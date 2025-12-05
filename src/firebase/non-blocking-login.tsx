'use client';
import {
  Auth,
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

/**
 * Ensures a user document exists in Firestore. Creates one if it doesn't exist.
 */
async function ensureUserDocument(authInstance: Auth, uid: string, email?: string | null): Promise<void> {
  const firestore = getFirestore(authInstance.app);
  const userDocRef = doc(firestore, 'users', uid);

  const userDoc = await getDoc(userDocRef);
  if (!userDoc.exists()) {
    await setDoc(userDocRef, {
      id: uid,
      uid: uid,
      email: email || null,
      createdAt: new Date().toISOString()
    });
  }
}

/**
 * Initiates anonymous sign-in (non-blocking).
 * This is safe to call even if a user is already signed in; Firebase handles it.
 */
export function initiateAnonymousSignIn(authInstance: Auth): void {
  signInAnonymously(authInstance).catch((error) => {
    // This is generally safe to ignore as it only fails in niche scenarios,
    // but we log it for debugging purposes.
    console.warn("Anonymous sign-in attempt failed", error);
  });
}

/**
 * Initiates email/password sign-up. Throws a user-friendly error on failure.
 */
export async function initiateEmailSignUp(authInstance: Auth, email: string, password: string): Promise<void> {
  try {
    const userCredential = await createUserWithEmailAndPassword(authInstance, email, password);
    // Ensure user document exists in Firestore
    await ensureUserDocument(authInstance, userCredential.user.uid, email);
  } catch (error: unknown) {
    const errorObj = error as { code?: string; message?: string };
    console.error("Sign up error:", errorObj.code, errorObj.message);
    const message = errorObj.code === 'auth/email-already-in-use'
      ? 'This email address is already in use.'
      : errorObj.code === 'auth/weak-password'
        ? 'Password is too weak. Please use at least 6 characters.'
        : 'An unexpected error occurred. Please try again.';
    throw new Error(message);
  }
}

/**
 * Initiates email/password sign-in. Throws a user-friendly error on failure.
 */
export async function initiateEmailSignIn(authInstance: Auth, email: string, password: string): Promise<void> {
  try {
    const userCredential = await signInWithEmailAndPassword(authInstance, email, password);
    // Ensure user document exists (fixes users who exist in Auth but not Firestore)
    await ensureUserDocument(authInstance, userCredential.user.uid, email);
  } catch (error: unknown) {
    const errorObj = error as { code?: string; message?: string };
    const message = (errorObj.code === 'auth/invalid-credential' || errorObj.code === 'auth/user-not-found' || errorObj.code === 'auth/wrong-password')
      ? 'Invalid email or password. Please check your credentials and try again.'
      : 'An unexpected error occurred during sign-in. Please try again later.';
    throw new Error(message);
  }
}
