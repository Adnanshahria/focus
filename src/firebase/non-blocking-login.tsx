'use client';
import {
  Auth,
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';

/** Initiate anonymous sign-in (non-blocking). */
export function initiateAnonymousSignIn(authInstance: Auth): Promise<void> {
  return signInAnonymously(authInstance).then(() => {}).catch((error) => {
    console.warn("Anonymous sign-in failed", error);
    // Propagate the error to allow the caller to handle it.
    throw error;
  });
}

/** Initiate email/password sign-up (non-blocking). */
export function initiateEmailSignUp(authInstance: Auth, email: string, password: string): Promise<void> {
    return createUserWithEmailAndPassword(authInstance, email, password).then(() => {}).catch((error) => {
        console.error("Sign up failed", error);
        throw error;
    });
}

/** Initiate email/password sign-in (non-blocking). */
export function initiateEmailSignIn(authInstance: Auth, email: string, password: string): Promise<void> {
    return signInWithEmailAndPassword(authInstance, email, password).then(() => {}).catch((error) => {
        console.error("Sign in failed", error);
        throw error;
    });
}
