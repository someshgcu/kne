// src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  inMemoryPersistence
} from "firebase/auth";
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyACLACg6D6o_hyUVHK7uCJXf47eP_gdnaM",
  authDomain: "incpuc.firebaseapp.com",
  projectId: "incpuc",
  storageBucket: "incpuc.firebasestorage.app",
  messagingSenderId: "356887207702",
  appId: "1:356887207702:web:305a558c8fdd53acf97a37",
  measurementId: "G-W8NJSKL3MF"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

// Track persistence initialization state
let persistenceInitialized = false;
let persistenceError: Error | null = null;

/**
 * Initialize auth persistence with fallback strategy:
 * 1. Try browserLocalPersistence (survives browser restart)
 * 2. Fallback to browserSessionPersistence (survives page refresh)
 * 3. Final fallback to inMemoryPersistence (for strict privacy modes)
 */
export async function initializeAuthPersistence(): Promise<{ success: boolean; mode: string; error?: Error }> {
  if (persistenceInitialized) {
    return {
      success: !persistenceError,
      mode: persistenceError ? 'failed' : 'already-initialized',
      error: persistenceError || undefined
    };
  }

  // Try browserLocalPersistence first (best UX - survives browser close)
  try {
    await setPersistence(auth, browserLocalPersistence);
    persistenceInitialized = true;
    console.log('[Firebase] Auth persistence set to: browserLocalPersistence');
    return { success: true, mode: 'local' };
  } catch (localError) {
    console.warn('[Firebase] browserLocalPersistence failed, trying session...', localError);
  }

  // Try browserSessionPersistence (survives page refresh but not tab close)
  try {
    await setPersistence(auth, browserSessionPersistence);
    persistenceInitialized = true;
    console.log('[Firebase] Auth persistence set to: browserSessionPersistence');
    return { success: true, mode: 'session' };
  } catch (sessionError) {
    console.warn('[Firebase] browserSessionPersistence failed, trying inMemory...', sessionError);
  }

  // Final fallback to inMemoryPersistence (for strict Incognito/privacy modes)
  try {
    await setPersistence(auth, inMemoryPersistence);
    persistenceInitialized = true;
    console.log('[Firebase] Auth persistence set to: inMemoryPersistence');
    return { success: true, mode: 'memory' };
  } catch (memoryError) {
    console.error('[Firebase] All persistence methods failed:', memoryError);
    persistenceError = memoryError as Error;
    persistenceInitialized = true; // Mark as initialized even on failure to prevent retries
    return { success: false, mode: 'failed', error: memoryError as Error };
  }
}

// Initialize Firestore with named database
export const db = initializeFirestore(app,
  {
    experimentalForceLongPolling: true,
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager()
    })
  },
  "incpuc"
);

export default app;