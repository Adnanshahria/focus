
'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { initializeFirestore, type Firestore, persistentLocalCache, getFirestore, CACHE_SIZE_UNLIMITED } from 'firebase/firestore';

function initializeServices() {
  const isConfigured = getApps().length > 0;
  const app = isConfigured ? getApp() : initializeApp(firebaseConfig);
  const auth = getAuth(app);
  
  let firestore: Firestore;
  try {
    firestore = initializeFirestore(app, {
      localCache: persistentLocalCache({ cacheSizeBytes: CACHE_SIZE_UNLIMITED }),
    });
  } catch (e) {
    // This error happens if Firestore has already been initialized in another tab.
    if ((e as { code?: string }).code === 'failed-precondition') {
      console.warn(
        "Firestore has already been initialized, likely in another tab. Getting existing instance."
      );
      firestore = getFirestore(app);
    } else {
      // Re-throw other errors
      throw e;
    }
  }

  return { app, auth, firestore };
}

function getFirebaseServices() {
  const { app, auth, firestore } = initializeServices();
  return { firebaseApp: app, auth, firestore };
}

export const { firebaseApp, auth, firestore } = getFirebaseServices();
