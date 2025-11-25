'use client';
import {
  Auth,
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';

/** Initiate anonymous sign-in (non-blocking). */
export function initiateAnonymousSignIn(authInstance: Auth): void {
  signInAnonymously(authInstance).catch((error) => {
    // This can be expanded to show a toast or log to a service
    console.warn("Anonymous sign-in failed", error);
  });
}

/** Initiate email/password sign-up (non-blocking). */
export function initiateEmailSignUp(authInstance: Auth, email: string, password: string): void {
  createUserWithEmailAndPassword(authInstance, email, password)
    .catch((error) => {
        // The onAuthStateChanged listener in FirebaseProvider will handle the user state change on success.
        // We only need to handle the error case here, e.g., by showing a toast.
        // This is handled centrally in the auth form for better user feedback.
        console.error("Sign up failed", error);
        // We could use a global error emitter here to show a toast
        // Example: errorEmitter.emit('auth-error', error);
    });
}

/** Initiate email/password sign-in (non-blocking). */
export function initiateEmailSignIn(authInstance: Auth, email: string, password: string): void {
  signInWithEmailAndPassword(authInstance, email, password)
    .catch((error) => {
        // Similar to sign up, success is handled by the global auth state listener.
        // We can handle specific sign-in errors here.
        console.error("Sign in failed", error);
        // Example: errorEmitter.emit('auth-error', error);
    });
}
