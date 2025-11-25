'use client';

import { useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { useAuth } from '@/firebase/provider';

export interface UserAuthState {
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
}

export const useUser = (): UserAuthState => {
  const auth = useAuth();
  const [userAuthState, setUserAuthState] = useState<UserAuthState>({
    user: auth?.currentUser || null,
    isUserLoading: true,
    userError: null,
  });

  useEffect(() => {
    if (!auth) {
      setUserAuthState({ user: null, isUserLoading: false, userError: new Error("Auth service not available.") });
      return;
    };
    
    // Set loading to true whenever the auth instance changes.
    // This ensures we always fetch the latest user state.
    setUserAuthState(prevState => ({ ...prevState, isUserLoading: true }));

    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        setUserAuthState({ user: firebaseUser, isUserLoading: false, userError: null });
      },
      (error) => {
        console.error("useUser: onAuthStateChanged error:", error);
        setUserAuthState({ user: null, isUserLoading: false, userError: error });
      }
    );
    return () => unsubscribe();
  // The dependency on `auth` is crucial.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth]);

  return userAuthState;
};
