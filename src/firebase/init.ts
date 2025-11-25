
'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { initializeFirestore, type Firestore, persistentLocalCache } from 'firebase/firestore';

let firebaseApp: FirebaseApp;
let auth: Auth;
let firestore: Firestore;

// Initialize Firebase only once
if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig);
  firestore = initializeFirestore(firebaseApp, {
    localCache: persistentLocalCache({}),
  });
  auth = getAuth(firebaseApp);
} else {
  firebaseApp = getApp();
  auth = getAuth(firebaseApp);
  // This will throw if it's called with different options, 
  // but we are assuming it's already been initialized correctly.
  // In a client-only environment, this else block might not be strictly necessary
  // if the init file is only ever imported once.
  firestore = initializeFirestore(firebaseApp, {
    localCache: persistentLocalCache({}),
  });
}

export { firebaseApp, auth, firestore };
