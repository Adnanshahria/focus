'use client';

import React, { DependencyList, createContext, useContext, ReactNode, useMemo } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Firestore } from 'firebase/firestore';
import { Auth, User } from 'firebase/auth';
import { useUser as useUserHook, UserAuthState } from './hooks/use-user';

// Combined state for the Firebase context
export interface FirebaseContextState {
  areServicesAvailable: boolean;
  firebaseApp: FirebaseApp | null;
  firestore: Firestore | null;
  auth: Auth | null;
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
}

// React Context
export const FirebaseContext = createContext<FirebaseContextState | undefined>(undefined);

interface FirebaseProviderProps {
  children: ReactNode;
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
}

export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({
  children,
  firebaseApp,
  firestore,
  auth,
}) => {
  const servicesAvailable = !!(firebaseApp && firestore && auth);
  const baseContextValue = useMemo(() => ({
      areServicesAvailable: servicesAvailable,
      firebaseApp: servicesAvailable ? firebaseApp : null,
      firestore: servicesAvailable ? firestore : null,
      auth: servicesAvailable ? auth : null,
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [firebaseApp, firestore, auth]);

  return (
    <FirebaseContext.Provider value={baseContextValue as FirebaseContextState}>
        <FirebaseUserProvider>
            {children}
        </FirebaseUserProvider>
    </FirebaseContext.Provider>
  );
};

const FirebaseUserProvider: React.FC<{children: ReactNode}> = ({ children }) => {
    const baseContext = useContext(FirebaseContext);
    const userAuthState = useUserHook();

    const fullContextValue = useMemo(() => ({
        ...baseContext,
        ...userAuthState
    }), [baseContext, userAuthState]);

    return (
        <FirebaseContext.Provider value={fullContextValue as FirebaseContextState}>
            {children}
        </FirebaseContext.Provider>
    )
}

export const useFirebase = (): FirebaseContextState => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider.');
  }
  return context;
};

export const useFirestore = (): Firestore => {
  const { firestore } = useFirebase();
  if (!firestore) throw new Error("Firestore not available.");
  return firestore;
};

export const useFirebaseApp = (): FirebaseApp => {
  const { firebaseApp } = useFirebase();
  if (!firebaseApp) throw new Error("FirebaseApp not available.");
  return firebaseApp;
};

export const useAuth = (): Auth => {
  const { auth } = useFirebase();
  if (!auth) throw new Error("Auth not available.");
  return auth;
};

type MemoFirebase<T> = T & { __memo?: true };

export function useMemoFirebase<T>(
  factory: () => T,
  deps: DependencyList | undefined
): T {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoized = useMemo(factory, deps);

  if (typeof memoized !== 'object' || memoized === null) {
    return memoized;
  }
  if (process.env.NODE_ENV === 'development') {
    (memoized as MemoFirebase<T>).__memo = true;
  }
  return memoized;
}
