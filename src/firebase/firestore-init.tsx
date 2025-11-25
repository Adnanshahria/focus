'use client';

import { useEffect } from 'react';
import { useFirestore } from '@/firebase/provider';
import { enableIndexedDbPersistence } from 'firebase/firestore';

/**
 * A client-only component that enables Firestore offline persistence.
 * This should be rendered once within the main Firebase provider.
 * It ensures that persistence is enabled on the client-side before any
 * Firestore operations are attempted.
 */
export function FirestoreInit() {
  const firestore = useFirestore();

  useEffect(() => {
    const enablePersistence = async () => {
      try {
        // The 'enableIndexedDbPersistence' function must be called before
        // any other Firestore methods. This component ensures that.
        await enableIndexedDbPersistence(firestore);
      } catch (err: any) {
        if (err.code === 'failed-precondition') {
          // This error occurs if multiple tabs are open, as persistence
          // can only be enabled in one tab at a time.
          console.warn(
            "Firestore persistence failed: Multiple tabs open. Offline mode will not be available in this tab."
          );
        } else if (err.code === 'unimplemented') {
          // This error occurs if the browser doesn't support IndexedDB.
          console.warn(
            "Firestore persistence failed: Browser does not support IndexedDB. Offline mode is unavailable."
          );
        }
      }
    };

    enablePersistence();
  }, [firestore]); // The effect runs once when the firestore instance is available.

  // This component does not render anything to the DOM.
  return null;
}
