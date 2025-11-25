'use client';
import {
  Auth,
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';

export function initiateAnonymousSignIn(authInstance: Auth): void {
  if (!authInstance.currentUser) {
    signInAnonymously(authInstance).catch((error) => {
      console.warn("Anonymous sign-in failed", error);
    });
  }
}

export async function initiateEmailSignUp(authInstance: Auth, email: string, password: string): Promise<void> {
  try {
    await createUserWithEmailAndPassword(authInstance, email, password);
  } catch (error: any) {
    const message = error.code === 'auth/email-already-in-use'
      ? 'This email address is already in use.'
      : 'An unexpected error occurred. Please try again.';
    throw new Error(message);
  }
}

export async function initiateEmailSignIn(authInstance: Auth, email: string, password: string): Promise<void> {
  try {
    await signInWithEmailAndPassword(authInstance, email, password);
  } catch (error: any) {
    const message = (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password')
      ? 'Invalid email or password.'
      : 'An unexpected error occurred. Please try again.';
    throw new Error(message);
  }
}
