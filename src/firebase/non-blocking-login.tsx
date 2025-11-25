'use client';
import {
  Auth,
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';

/** Initiate anonymous sign-in (non-blocking). */
export function initiateAnonymousSignIn(authInstance: Auth): void {
  // Only sign in anonymously if there's no current user.
  if (!authInstance.currentUser) {
    signInAnonymously(authInstance).catch((error) => {
      console.warn("Anonymous sign-in failed", error);
    });
  }
}

/**
 * Initiate email/password sign-up (blocking with error throwing).
 * @throws {Error} Throws an error on failure so the UI can catch it.
 */
export async function initiateEmailSignUp(authInstance: Auth, email: string, password: string): Promise<void> {
  try {
    await createUserWithEmailAndPassword(authInstance, email, password);
    // Success is handled by the onAuthStateChanged listener.
  } catch (error: any) {
    // Re-throw a more user-friendly error for the form to catch.
    const message = error.code === 'auth/email-already-in-use'
      ? 'This email address is already in use.'
      : error.message;
    throw new Error(message);
  }
}

/**
 * Initiate email/password sign-in (blocking with error throwing).
 * @throws {Error} Throws an error on failure so the UI can catch it.
 */
export async function initiateEmailSignIn(authInstance: Auth, email: string, password: string): Promise<void> {
  try {
    await signInWithEmailAndPassword(authInstance, email, password);
    // Success is handled by the onAuthStateChanged listener.
  } catch (error: any) {
     // Re-throw a more user-friendly error.
    const message = (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password')
      ? 'Invalid email or password.'
      : error.message;
    throw new Error(message);
  }
}
