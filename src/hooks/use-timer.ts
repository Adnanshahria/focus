'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useTimerStore } from '@/store/timer-store';
import { useUser, useFirestore } from '@/firebase';
import { doc, collection, getDoc, runTransaction } from 'firebase/firestore';
import {
  addDocumentNonBlocking,
  setDocumentNonBlocking,
} from '@/firebase/non-blocking-updates';

export const useTimer = () => {
  const store = useTimerStore();
  const {
    isActive,
    timeLeft,
    tick,
    completeCycle,
    start: startAction,
    pause: pauseAction,
    reset: resetAction,
    mode,
    sessionStartTime,
    addTime,
    subtractTime,
    endAndSaveSession: endAndSaveAction,
  } = store;

  const { user } = useUser();
  const firestore = useFirestore();

  const lastTickTimeRef = useRef<number | null>(null);
  const frameIdRef = useRef<number | null>(null);

  const recordSession = useCallback(
    async (isCompletion: boolean) => {
      if (!user || user.isAnonymous || !firestore || !sessionStartTime) return;

      if (mode !== 'pomodoro') return;

      const durationInMinutes = (Date.now() - sessionStartTime) / (1000 * 60);
      if (durationInMinutes < 0.1) return;

      const today = new Date().toISOString().split('T')[0];
      const focusRecordRef = doc(firestore, `users/${user.uid}/focusRecords`, today);
      const sessionsCollection = collection(focusRecordRef, 'sessions');

      addDocumentNonBlocking(sessionsCollection, {
        focusRecordId: focusRecordRef.id,
        startTime: new Date(sessionStartTime).toISOString(),
        endTime: new Date().toISOString(),
        duration: durationInMinutes,
        type: mode,
        completed: isCompletion,
      });

      // Use a transaction to safely update totals
      try {
        await runTransaction(firestore, async (transaction) => {
          const recordSnap = await transaction.get(focusRecordRef);
          const currentData = recordSnap.data() || { totalFocusMinutes: 0, totalPomos: 0 };
          
          const newTotalFocusMinutes = currentData.totalFocusMinutes + durationInMinutes;
          const newTotalPomos = isCompletion ? currentData.totalPomos + 1 : currentData.totalPomos;

          const focusRecordUpdate = {
            id: today,
            date: today,
            userId: user.uid,
            totalFocusMinutes: newTotalFocusMinutes,
            totalPomos: newTotalPomos,
          };
          
          transaction.set(focusRecordRef, focusRecordUpdate, { merge: true });
        });
      } catch (error) {
        console.error("Transaction failed: ", error);
      }
    },
    [user, firestore, sessionStartTime, mode]
  );

  const start = useCallback(() => {
    startAction(Date.now());
  }, [startAction]);

  const pause = useCallback(() => {
    pauseAction();
  }, [pauseAction]);

  const reset = useCallback(() => {
    resetAction();
  }, [resetAction]);

  const endAndSaveSession = useCallback(() => {
      if (isActive) {
          recordSession(false);
      }
      endAndSaveAction();
  }, [isActive, recordSession, endAndSaveAction]);


  useEffect(() => {
    if (!isActive) {
      lastTickTimeRef.current = null;
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
        frameIdRef.current = null;
      }
      return;
    }

    const runTick = (timestamp: number) => {
      if (!lastTickTimeRef.current) {
        lastTickTimeRef.current = timestamp;
      }

      const elapsed = timestamp - lastTickTimeRef.current;

      if (elapsed >= 1000) {
        const secondsElapsed = Math.floor(elapsed / 1000);
        tick(secondsElapsed);
        lastTickTimeRef.current = timestamp - (elapsed % 1000);
      }

      if (useTimerStore.getState().timeLeft > 0) {
        frameIdRef.current = requestAnimationFrame(runTick);
      }
    };

    if (timeLeft > 0) {
      frameIdRef.current = requestAnimationFrame(runTick);
    } else {
      lastTickTimeRef.current = null;
    }

    return () => {
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
        frameIdRef.current = null;
      }
    };
  }, [isActive, timeLeft, tick]);

  useEffect(() => {
    if (timeLeft <= 0 && isActive) {
      recordSession(true);
      completeCycle();
    }
  }, [timeLeft, isActive, completeCycle, recordSession]);

  return { ...store, start, pause, reset, addTime, subtractTime, endAndSaveSession };
};

export * from '@/store/timer-store';
