
'use client';

import { useState, useEffect } from 'react';
import {
  Query,
  onSnapshot,
  DocumentData,
  FirestoreError,
  QuerySnapshot,
  CollectionReference,
} from 'firebase/firestore';
import { WithId, Memoized, UseCollectionResult } from './types';

export function useCollection<T = any>(
    memoizedTargetRefOrQuery: Memoized<CollectionReference<DocumentData> | Query<DocumentData>> | null | undefined,
): UseCollectionResult<T> {
  type ResultItemType = WithId<T>;
  type StateDataType = ResultItemType[] | null;

  const [data, setData] = useState<StateDataType>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<FirestoreError | null>(null);

  if (process.env.NODE_ENV === 'development') {
    if (memoizedTargetRefOrQuery && !memoizedTargetRefOrQuery.__memo) {
      console.error('useCollection Error: The query/reference must be memoized with useMemoFirebase.');
    }
  }

  useEffect(() => {
    if (!memoizedTargetRefOrQuery) {
      setData(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    const unsubscribe = onSnapshot(
      memoizedTargetRefOrQuery,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const results: ResultItemType[] = snapshot.docs.map(doc => ({ ...(doc.data() as T), id: doc.id }));
        setData(results);
        setError(null);
        setIsLoading(false);
      },
      (err: FirestoreError) => {
        console.error("Firestore (useCollection) Error: ", err);
        setError(err);
        setData(null);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [memoizedTargetRefOrQuery]);
  
  return { data, isLoading, error };
}
