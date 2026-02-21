// src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  browserLocalPersistence,
  indexedDBLocalPersistence
} from "firebase/auth";
import { initializeFirestore, persistentLocalCache, persistentSingleTabManager } from "firebase/firestore";
import { getStorage } from "firebase/storage";

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

// Initialize Auth with explicit browserLocalPersistence to prevent logout issues
// Using initializeAuth instead of getAuth to set persistence at initialization
export const auth = initializeAuth(app, {
  persistence: [indexedDBLocalPersistence, browserLocalPersistence]
});

// Compatibility function for ProtectedRoute - persistence is already initialized above
// This is a no-op now since initializeAuth handles persistence
export async function initializeAuthPersistence(): Promise<{ success: boolean; mode: string; error?: Error }> {
  // Persistence is already set via initializeAuth, so this is always successful
  console.log('[Firebase] Auth persistence already initialized via initializeAuth');
  return { success: true, mode: 'indexedDB' };
}

// Initialize Firestore with single tab manager to avoid conflicts
// When opening preview in new tab, each tab manages its own cache
export const db = initializeFirestore(app,
  {
    experimentalForceLongPolling: true,
    localCache: persistentLocalCache({
      tabManager: persistentSingleTabManager({ forceOwnership: false })
    })
  },
  "incpuc"
);

// Initialize Firebase Storage for image uploads
export const storage = getStorage(app);

export default app;