
'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore, persistentLocalCache, memoryLocalCache } from 'firebase/firestore';

/**
 * Initializes the Firebase app and returns the core services.
 * This function handles both server-side and client-side rendering by
 * checking if an app has already been initialized.
 * It also sets up Firestore with modern persistent caching.
 */
export function initializeFirebase() {
  const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  
  // Modern Firestore initialization with persistent cache.
  // This replaces the deprecated `enableIndexedDbPersistence`.
  const firestoreInstance = initializeFirestore(app, {
    localCache: persistentLocalCache({})
  });
  
  const authInstance = getAuth(app);

  return {
    firebaseApp: app,
    auth: authInstance,
    firestore: firestoreInstance,
  };
}
