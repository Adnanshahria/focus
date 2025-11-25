
'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { initializeFirestore, type Firestore, persistentLocalCache, getFirestore } from 'firebase/firestore';

let firebaseApp: FirebaseApp;
let auth: Auth;
let firestore: Firestore;

if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig);
  auth = getAuth(firebaseApp);
  try {
    firestore = initializeFirestore(firebaseApp, {
      localCache: persistentLocalCache({}),
    });
  } catch (e) {
    if ((e as { code?: string }).code === 'failed-precondition') {
      console.warn(
        "Firestore has already been initialized. This can happen with multiple tabs open. Getting existing instance."
      );
      firestore = getFirestore(firebaseApp);
    } else {
      throw e;
    }
  }
} else {
  firebaseApp = getApp();
  auth = getAuth(firebaseApp);
  firestore = getFirestore(firebaseApp);
}

export { firebaseApp, auth, firestore };
