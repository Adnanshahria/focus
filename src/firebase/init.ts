
'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { initializeFirestore, type Firestore, persistentLocalCache, getFirestore } from 'firebase/firestore';

let firebaseApp: FirebaseApp;
let auth: Auth;
let firestore: Firestore;

// Initialize Firebase only once
if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = getApp();
}

auth = getAuth(firebaseApp);

// The `getFirestore` function with no arguments can be used to get the default
// firestore instance, but it doesn't allow for specifying `localCache`.
// To handle hot-reloading correctly, we must catch the error and then get the
// existing instance.
try {
  firestore = initializeFirestore(firebaseApp, {
    localCache: persistentLocalCache({}),
  });
} catch (e) {
  if ((e as {code?: string}).code === 'failed-precondition') {
    console.warn("Firestore has already been initialized. Getting existing instance.");
    firestore = getFirestore(firebaseApp);
  } else {
    // Re-throw other errors
    throw e;
  }
}

export { firebaseApp, auth, firestore };
