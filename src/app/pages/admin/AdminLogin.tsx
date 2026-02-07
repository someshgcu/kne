import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { Lock, Mail, GraduationCap, Loader2, AlertCircle, WifiOff, AlertTriangle } from 'lucide-react';
import { auth, db, initializeAuthPersistence } from '../../../lib/firebase';
import type { UserRole } from '../../components/auth/ProtectedRoute';

// Valid roles (lowercase)
const VALID_ROLES: UserRole[] = ['principal', 'admin', 'front_office'];

/**
 * Normalize role to lowercase and validate
 */
function normalizeRole(role: unknown): UserRole | null {
  if (typeof role !== 'string') return null;
  const normalized = role.toLowerCase().trim() as UserRole;
  return VALID_ROLES.includes(normalized) ? normalized : null;
}

export function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isStorageError, setIsStorageError] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const hasInitialized = useRef(false);
  const hasRedirected = useRef(false);

  // Initialize auth persistence and check existing auth state
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    let unsubscribe: (() => void) | null = null;

    const initialize = async () => {
      try {
        // Initialize auth persistence first
        const persistenceResult = await initializeAuthPersistence();

        if (!persistenceResult.success) {
          console.warn('[AdminLogin] Persistence init failed:', persistenceResult.error);
          // Don't block login, just warn
        }

        // Set up auth state listener - ONLY for initial check, NOT for navigation
        unsubscribe = onAuthStateChanged(auth, async (user) => {
          // Only check on initial load, not after login
          if (hasRedirected.current) return;

          if (user) {
            try {
              const userDocRef = doc(db, 'users', user.uid);
              const userDoc = await getDoc(userDocRef);

              if (userDoc.exists()) {
                const rawRole = userDoc.data().role;
                const normalizedRole = normalizeRole(rawRole);

                console.log('[AdminLogin] Existing auth check - rawRole:', rawRole, '-> normalized:', normalizedRole);

                // Validate role before redirecting
                if (normalizedRole) {
                  hasRedirected.current = true;
                  redirectBasedOnRole(normalizedRole);
                  return;
                }
              }
              // If we get here, user exists but no valid role - let them stay on login
              // They can try logging in again or see the error
            } catch (err) {
              console.error('[AdminLogin] Error checking existing auth:', err);
              const errorStr = String(err);
              if (errorStr.includes('storage') || errorStr.includes('quota') || errorStr.includes('access')) {
                setIsStorageError(true);
                setError('Storage access is blocked. Please exit Incognito mode or enable cookies.');
              }
            }
          }
          setIsCheckingAuth(false);
        });
      } catch (err) {
        console.error('[AdminLogin] Initialization error:', err);
        const errorStr = String(err);
        if (errorStr.includes('storage') || errorStr.includes('quota') || errorStr.includes('access')) {
          setIsStorageError(true);
          setError('Storage access is blocked. Please exit Incognito mode or enable cookies.');
        }
        setIsCheckingAuth(false);
      }
    };

    initialize();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  // Check for error messages passed via navigation state
  useEffect(() => {
    const state = location.state as { error?: string } | null;
    if (state?.error) {
      setError(state.error);
      // Clear the state so error doesn't persist on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const redirectBasedOnRole = (role: UserRole) => {
    const roleRedirectMap: Record<UserRole, string> = {
      principal: '/principal/dashboard',
      admin: '/admin/dashboard',
      front_office: '/reception/dashboard',
    };
    navigate(roleRedirectMap[role], { replace: true });
  };

  const getErrorMessage = (errorCode: string): string => {
    switch (errorCode) {
      case 'auth/invalid-email':
        return 'Invalid email address format.';
      case 'auth/user-disabled':
        return 'This account has been disabled. Please contact administrator.';
      case 'auth/user-not-found':
        return 'No account found with this email address.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/invalid-credential':
        return 'Invalid email or password. Please check your credentials.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your internet connection.';
      default:
        return 'An error occurred. Please try again.';
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsStorageError(false);
    setIsLoading(true);

    try {
      // Step 1: Initialize persistence before login attempt
      const persistenceResult = await initializeAuthPersistence();
      if (!persistenceResult.success) {
        console.warn('[AdminLogin] Persistence failed before login, continuing anyway');
      }

      // Step 2: Authenticate with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Step 3: Immediately fetch the user's Firestore profile
      let userDoc;
      try {
        const userDocRef = doc(db, 'users', user.uid);
        userDoc = await getDoc(userDocRef);
      } catch (firestoreErr) {
        console.error('[AdminLogin] Firestore error:', firestoreErr);
        const errorStr = String(firestoreErr);

        // Check for storage/access errors
        if (errorStr.includes('storage') || errorStr.includes('quota') || errorStr.includes('access')) {
          setIsStorageError(true);
          setError('Storage access is blocked. Please exit Incognito mode or enable cookies in your browser settings.');
          // Sign out to prevent stuck state
          await signOut(auth);
          setIsLoading(false);
          return;
        }

        // For other Firestore errors, sign out and show error
        await signOut(auth);
        setError('Unable to verify your account. Please check your internet connection and try again.');
        setIsLoading(false);
        return;
      }

      // Step 4: Validate the role
      if (!userDoc.exists()) {
        console.error('[AdminLogin] User document not found');
        // Sign out and show error - DO NOT REDIRECT
        await signOut(auth);
        setError('Your account exists but has no role assigned. Please contact administrator.');
        setIsLoading(false);
        return;
      }

      const userData = userDoc.data();
      const rawRole = userData?.role;
      const normalizedRole = normalizeRole(rawRole);

      console.log('[AdminLogin] Login - rawRole:', rawRole, '-> normalized:', normalizedRole);

      if (!normalizedRole) {
        console.error('[AdminLogin] Invalid role:', rawRole);
        // Sign out and show error - DO NOT REDIRECT
        await signOut(auth);
        setError(`Access Denied: Invalid role "${rawRole}" assigned to your account. Valid roles: ${VALID_ROLES.join(', ')}.`);
        setIsLoading(false);
        return;
      }

      const role = normalizedRole;

      // Step 5: Valid role - Navigate to appropriate dashboard
      hasRedirected.current = true;
      redirectBasedOnRole(role);

    } catch (err: unknown) {
      console.error('[AdminLogin] Login error:', err);

      const errorStr = String(err);

      // Check for storage errors
      if (errorStr.includes('storage') || errorStr.includes('quota') || errorStr.includes('access')) {
        setIsStorageError(true);
        setError('Storage access is blocked. Please exit Incognito mode or enable cookies in your browser settings.');
        setIsLoading(false);
        return;
      }

      // Handle Firebase Auth errors
      if (err instanceof Error && 'code' in err) {
        const firebaseError = err as { code: string };
        setError(getErrorMessage(firebaseError.code));
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      setIsLoading(false);
    }
  };

  // Show loading while checking existing auth state
  if (isCheckingAuth) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-primary to-secondary">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="size-10 animate-spin text-white" />
          <p className="text-primary-foreground/80 text-sm">Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary via-primary to-secondary">
      <div className="max-w-md w-full">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-accent text-accent-foreground rounded-full mb-4">
            <GraduationCap className="size-8" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-bold text-primary-foreground mb-2">
            Admin Portal
          </h1>
          <p className="text-primary-foreground/80">
            Sign in to manage INCPUC platform
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-card rounded-2xl shadow-2xl p-8 border border-border">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Error Display */}
            {error && (
              <div
                className={`px-4 py-3 rounded-lg flex items-start gap-3 ${isStorageError
                  ? 'bg-yellow-50 border border-yellow-200 text-yellow-800'
                  : 'bg-red-50 border border-red-200 text-red-800'
                  }`}
                role="alert"
              >
                {isStorageError ? (
                  <AlertTriangle className="size-5 flex-shrink-0 mt-0.5" />
                ) : error.includes('Network') || error.includes('internet') ? (
                  <WifiOff className="size-5 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="size-5 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="text-sm">{error}</p>
                  {isStorageError && (
                    <ul className="text-xs mt-2 list-disc list-inside space-y-1 opacity-80">
                      <li>Exit Incognito/Private browsing mode</li>
                      <li>Enable cookies in browser settings</li>
                      <li>Disable strict tracking protection</li>
                    </ul>
                  )}
                </div>
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-body mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="size-5 text-muted" aria-hidden="true" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="block w-full pl-10 pr-3 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent bg-background text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="you@incpuc.edu.in"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-body mb-2"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="size-5 text-muted" aria-hidden="true" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="block w-full pl-10 pr-3 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent bg-background text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-accent text-accent-foreground px-6 py-4 rounded-lg hover:bg-accent/90 transition-colors font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted">
              Contact administrator for login credentials
            </p>
          </div>
        </div>

        {/* Back to Home Link */}
        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </main>
  );
}
