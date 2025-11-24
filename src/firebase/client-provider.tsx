'use client';

import React, { useMemo, type ReactNode } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { initializeFirebase } from '@/firebase';
import { firebaseConfig } from './config';
import { initializeApp } from 'firebase/app';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  const firebaseServices = useMemo(() => {
    // In a deployed environment (like GitHub pages), auto-init will fail.
    // We must explicitly pass the config.
    try {
        return initializeFirebase();
    } catch (e) {
        console.warn("Automatic Firebase initialization failed, likely in a non-Firebase hosting environment. Falling back to explicit config.");
        const app = initializeApp(firebaseConfig);
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
