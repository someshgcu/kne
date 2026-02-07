import { useEffect, useState, useRef } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db, initializeAuthPersistence } from '../../../lib/firebase';
import { Loader2, AlertTriangle, ShieldX } from 'lucide-react';

export type UserRole = 'principal' | 'admin' | 'front_office';

// Valid roles (lowercase for comparison)
const VALID_ROLES: UserRole[] = ['principal', 'admin', 'front_office'];

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles: UserRole[];
}

type AuthStatus = 'initializing' | 'checking' | 'authenticated' | 'unauthenticated' | 'error';

interface AuthState {
    user: User | null;
    role: UserRole | null;
    rawRole: string | null; // Store the raw role for debugging
    status: AuthStatus;
    errorMessage: string | null;
    isStorageError: boolean;
}

/**
 * Normalize role to lowercase and validate
 */
function normalizeRole(role: unknown): UserRole | null {
    if (typeof role !== 'string') {
        console.warn('[ProtectedRoute] Role is not a string:', typeof role, role);
        return null;
    }

    const normalizedRole = role.toLowerCase().trim() as UserRole;

    if (VALID_ROLES.includes(normalizedRole)) {
        return normalizedRole;
    }

    console.warn('[ProtectedRoute] Role not in valid list:', role, '-> normalized:', normalizedRole);
    return null;
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        role: null,
        rawRole: null,
        status: 'initializing',
        errorMessage: null,
        isStorageError: false,
    });
    const location = useLocation();
    const hasInitialized = useRef(false);

    // 🔍 DEBUG: Log on every render
    console.log('[ProtectedRoute] === RENDER ===', {
        path: location.pathname,
        status: authState.status,
        userUID: authState.user?.uid || 'none',
        rawRoleFromDB: authState.rawRole,
        normalizedRole: authState.role,
        allowedRoles: allowedRoles,
        roleCheck: authState.role ? `allowedRoles.includes('${authState.role}') = ${allowedRoles.includes(authState.role)}` : 'N/A',
    });

    useEffect(() => {
        // Prevent multiple initializations
        if (hasInitialized.current) {
            console.log('[ProtectedRoute] Already initialized, skipping');
            return;
        }
        hasInitialized.current = true;

        let unsubscribe: (() => void) | null = null;

        const initialize = async () => {
            console.log('[ProtectedRoute] Starting initialization...');

            try {
                // Initialize auth persistence first
                const persistenceResult = await initializeAuthPersistence();
                console.log('[ProtectedRoute] Persistence result:', persistenceResult);

                if (!persistenceResult.success) {
                    console.warn('[ProtectedRoute] Persistence initialization failed, continuing with default');
                }

                // Set up auth state listener
                unsubscribe = onAuthStateChanged(auth, async (user) => {
                    console.log('[ProtectedRoute] onAuthStateChanged fired:', user ? `UID: ${user.uid}` : 'No user');

                    if (user) {
                        setAuthState(prev => ({ ...prev, status: 'checking' }));

                        try {
                            // Fetch user role from Firestore
                            const userDocRef = doc(db, 'users', user.uid);
                            console.log('[ProtectedRoute] Fetching user doc:', `users/${user.uid}`);

                            const userDoc = await getDoc(userDocRef);
                            console.log('[ProtectedRoute] User doc exists:', userDoc.exists());

                            if (userDoc.exists()) {
                                const userData = userDoc.data();
                                const rawRole = userData?.role;

                                console.log('[ProtectedRoute] 📋 Raw user data:', userData);
                                console.log('[ProtectedRoute] 📋 Raw role value:', rawRole, `(type: ${typeof rawRole})`);

                                // Normalize role (case-insensitive)
                                const normalizedRole = normalizeRole(rawRole);
                                console.log('[ProtectedRoute] 📋 Normalized role:', normalizedRole);

                                if (normalizedRole) {
                                    console.log('[ProtectedRoute] ✅ Valid role found:', normalizedRole);
                                    setAuthState({
                                        user,
                                        role: normalizedRole,
                                        rawRole: String(rawRole),
                                        status: 'authenticated',
                                        errorMessage: null,
                                        isStorageError: false,
                                    });
                                } else {
                                    // Invalid role - sign out and show error
                                    console.error('[ProtectedRoute] ❌ Invalid role:', rawRole);
                                    await signOut(auth);
                                    setAuthState({
                                        user: null,
                                        role: null,
                                        rawRole: String(rawRole),
                                        status: 'error',
                                        errorMessage: `Invalid role "${rawRole}" assigned to your account. Valid roles are: ${VALID_ROLES.join(', ')}. Please contact administrator.`,
                                        isStorageError: false,
                                    });
                                }
                            } else {
                                // No user document - sign out and show error
                                console.error('[ProtectedRoute] ❌ User document not found for UID:', user.uid);
                                await signOut(auth);
                                setAuthState({
                                    user: null,
                                    role: null,
                                    rawRole: null,
                                    status: 'error',
                                    errorMessage: 'No role assigned to your account. Please contact administrator.',
                                    isStorageError: false,
                                });
                            }
                        } catch (error) {
                            console.error('[ProtectedRoute] ❌ Error fetching user role:', error);
                            const errorStr = String(error);
                            const isStorageError = errorStr.includes('storage') ||
                                errorStr.includes('quota') ||
                                errorStr.includes('access');

                            // Don't sign out on storage errors - let user know the issue
                            if (!isStorageError) {
                                await signOut(auth);
                            }

                            setAuthState({
                                user: isStorageError ? user : null,
                                role: null,
                                rawRole: null,
                                status: 'error',
                                errorMessage: isStorageError
                                    ? 'Storage access blocked. Please disable Incognito mode or enable cookies.'
                                    : 'Failed to verify your account. Please try logging in again.',
                                isStorageError,
                            });
                        }
                    } else {
                        // No user logged in
                        console.log('[ProtectedRoute] No user logged in');
                        setAuthState({
                            user: null,
                            role: null,
                            rawRole: null,
                            status: 'unauthenticated',
                            errorMessage: null,
                            isStorageError: false,
                        });
                    }
                });
            } catch (error) {
                console.error('[ProtectedRoute] ❌ Initialization error:', error);
                const errorStr = String(error);
                const isStorageError = errorStr.includes('storage') ||
                    errorStr.includes('quota') ||
                    errorStr.includes('access');

                setAuthState({
                    user: null,
                    role: null,
                    rawRole: null,
                    status: 'error',
                    errorMessage: isStorageError
                        ? 'Storage access blocked. Please disable Incognito mode or enable cookies.'
                        : 'Failed to initialize authentication.',
                    isStorageError,
                });
            }
        };

        initialize();

        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, []);

    // LOADING STATE - Show spinner, do NOT redirect
    if (authState.status === 'initializing' || authState.status === 'checking') {
        console.log('[ProtectedRoute] 🔄 Showing loading state for:', authState.status);
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="size-10 animate-spin text-accent" />
                    <p className="text-muted text-sm">
                        {authState.status === 'initializing' ? 'Initializing...' : 'Verifying access...'}
                    </p>
                </div>
            </div>
        );
    }

    // ERROR STATE - Show error, do NOT redirect (prevents loop)
    if (authState.status === 'error') {
        console.log('[ProtectedRoute] ❌ Showing error state:', authState.errorMessage);
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <div className="max-w-md w-full bg-card rounded-xl p-8 border border-border shadow-lg text-center">
                    {authState.isStorageError ? (
                        <AlertTriangle className="size-12 text-yellow-500 mx-auto mb-4" />
                    ) : (
                        <ShieldX className="size-12 text-red-500 mx-auto mb-4" />
                    )}
                    <h2 className="text-xl font-bold text-foreground mb-2">
                        {authState.isStorageError ? 'Storage Access Blocked' : 'Access Denied'}
                    </h2>
                    <p className="text-muted mb-6">{authState.errorMessage}</p>
                    {authState.isStorageError && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-left">
                            <p className="text-sm text-yellow-800 font-medium mb-2">How to fix:</p>
                            <ul className="text-sm text-yellow-700 list-disc list-inside space-y-1">
                                <li>Exit Incognito/Private browsing mode</li>
                                <li>Enable cookies in your browser settings</li>
                                <li>Disable strict tracking protection</li>
                            </ul>
                        </div>
                    )}
                    <a
                        href="/admin/login"
                        className="inline-block bg-accent text-accent-foreground px-6 py-3 rounded-lg font-semibold hover:bg-accent/90 transition-colors"
                    >
                        Go to Login
                    </a>
                </div>
            </div>
        );
    }

    // UNAUTHENTICATED - Safe to redirect to login
    if (authState.status === 'unauthenticated') {
        console.log('[ProtectedRoute] 🔒 User not authenticated, redirecting to login');
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    // AUTHENTICATED - Check role permissions
    if (authState.status === 'authenticated' && authState.role) {
        // Normalize allowedRoles to lowercase for comparison
        const normalizedAllowedRoles = allowedRoles.map(r => r.toLowerCase() as UserRole);
        const userRoleLower = authState.role.toLowerCase() as UserRole;

        const isAllowed = normalizedAllowedRoles.includes(userRoleLower);

        console.log('[ProtectedRoute] 🔐 Role check:', {
            userRole: authState.role,
            userRoleLower,
            allowedRoles,
            normalizedAllowedRoles,
            isAllowed,
        });

        if (!isAllowed) {
            // Redirect to their appropriate dashboard based on their role
            const roleRedirectMap: Record<UserRole, string> = {
                principal: '/principal/dashboard',
                admin: '/admin/dashboard',
                front_office: '/reception/dashboard',
            };

            const redirectTo = roleRedirectMap[authState.role];
            console.log('[ProtectedRoute] ⚠️ Role not allowed, redirecting to:', redirectTo);
            return <Navigate to={redirectTo} replace />;
        }

        // User is authenticated and has the correct role
        console.log('[ProtectedRoute] ✅ Access granted!');
        return <>{children}</>;
    }

    // Fallback - should never reach here
    console.log('[ProtectedRoute] ⚠️ Fallback triggered - redirecting to login');
    return <Navigate to="/admin/login" replace />;
}
