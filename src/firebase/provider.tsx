'use client';

import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Firestore } from 'firebase/firestore';
import { Auth } from 'firebase/auth';
import { useUser as useUserHook, UserAuthState } from './hooks/use-user';

// Combined state for the Firebase context
export interface FirebaseContextState {
  areServicesAvailable: boolean;
  firebaseApp: FirebaseApp | null;
  firestore: Firestore | null;
  auth: Auth | null;
  user: UserAuthState['user'];
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

// Custom hooks to easily access parts of the context
export const useFirebaseApp = () => {
    const context = useContext(FirebaseContext);
    if (context === undefined) throw new Error("useFirebaseApp must be used within a FirebaseProvider");
    return context.firebaseApp;
}

export const useFirestore = () => {
    const context = useContext(FirebaseContext);
    if (context === undefined) throw new Error("useFirestore must be used within a FirebaseProvider");
    return context.firestore;
}

export const useAuth = () => {
    const context = useContext(FirebaseContext);
    if (context === undefined) throw new Error("useAuth must be used within a FirebaseProvider");
    return context.auth;
}

export const useUser = (): UserAuthState => {
    const context = useContext(FirebaseContext);
    if (context === undefined) throw new Error("useUser must be used within a FirebaseProvider");
    const { user, isUserLoading, userError } = context;
    return { user, isUserLoading, userError };
}
