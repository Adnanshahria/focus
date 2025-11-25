
'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

/**
 * Initializes the Firebase app and returns the core services.
 * This function handles both server-side and client-side rendering by
 * checking if an app has already been initialized.
 */
export function initializeFirebase() {
  const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  const firestoreInstance = getFirestore(app);
  const authInstance = getAuth(app);

  return {
    firebaseApp: app,
    auth: authInstance,
    firestore: firestoreInstance,
  };
}
