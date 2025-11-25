'use client';
import { FirestoreError } from "firebase/firestore";

/** Utility type to add an 'id' field to a given type T. */
export type WithId<T> = T & { id: string };

/** This is a dev-only type to help enforce correct usage of useMemoFirebase. */
export type Memoized<T> = T & { __memo?: true };

/** Interface for the return value of the useCollection hook. */
export interface UseCollectionResult<T> {
  data: WithId<T>[] | null;
  isLoading: boolean;
  error: FirestoreError | Error | null;
}

/** Interface for the return value of the useDoc hook. */
export interface UseDocResult<T> {
  data: WithId<T> | null;
  isLoading: boolean;
  error: FirestoreError | Error | null;
}
