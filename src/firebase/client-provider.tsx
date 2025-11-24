'use client';

import React, { useMemo, type ReactNode } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { initializeFirebase } from '@/firebase';
import { firebaseConfig } from './config';
import { initializeApp, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';


interface FirebaseClientProviderProps {
  children: ReactNode;
}

export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  const firebaseServices = useMemo(() => {
    try {
        return initializeFirebase();
    } catch (e) {
      if (process.env.NODE_ENV !== "development") {
        console.warn("Automatic Firebase initialization failed, likely in a non-Firebase hosting environment. Falling back to explicit config.");
      }
      const app = getApp();
      return {
          firebaseApp: app,
          firestore: app ? getFirestore(app) : null,
          auth: app ? getAuth(app) : null,
      }
    }
  }, []);

  return (
    <FirebaseProvider
      firebaseApp={firebaseServices.firebaseApp}
      auth={firebaseServices.auth}
      firestore={firebaseServices.firestore}
    >
      {children}
    </FirebaseProvider>
  );
}
