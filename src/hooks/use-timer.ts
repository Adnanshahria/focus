'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useTimerStore } from '@/store/timer-store';
import { useUser, useFirestore } from '@/firebase';
import { doc, collection, getDoc } from 'firebase/firestore';
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
  } = store;

  const { user } = useUser();
  const firestore = useFirestore();

  const lastTickTimeRef = useRef<number | null>(null);
  const frameIdRef = useRef<number | null>(null);

  const recordSession = useCallback(
    async (isCompletion: boolean) => {
      if (!user || user.isAnonymous || !firestore || !sessionStartTime) return;

      // Only record focus sessions (pomodoros)
      if (mode !== 'pomodoro') return;

      const durationInMinutes = (Date.now() - sessionStartTime) / (1000 * 60);
      // Don't record very short sessions (less than ~6 seconds)
      if (durationInMinutes < 0.1) return;

      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      const focusRecordRef = doc(
        firestore,
        `users/${user.uid}/focusRecords`,
        today
      );

      const sessionData = {
        focusRecordId: focusRecordRef.id,
        startTime: new Date(sessionStartTime).toISOString(),
        endTime: new Date().toISOString(),
        duration: durationInMinutes,
        type: mode,
        completed: isCompletion,
      };

      const sessionsCollection = collection(focusRecordRef, 'sessions');
      addDocumentNonBlocking(sessionsCollection, sessionData);

      // Atomically update totals
      const recordSnap = await getDoc(focusRecordRef);
      const currentData = recordSnap.data() || {
        totalFocusMinutes: 0,
        totalPomos: 0,
      };

      const newTotalFocusMinutes =
        currentData.totalFocusMinutes + durationInMinutes;
      const newTotalPomos = isCompletion
        ? currentData.totalPomos + 1
        : currentData.totalPomos;

      const focusRecordUpdate = {
        id: today,
        date: today,
        userId: user.uid,
        totalFocusMinutes: newTotalFocusMinutes,
        totalPomos: newTotalPomos,
      };

      setDocumentNonBlocking(focusRecordRef, focusRecordUpdate, {
        merge: true,
      });

      // Update local store state
      useTimerStore.getState().setFocusHistory({
        totalFocusMinutes: newTotalFocusMinutes,
        totalPomos: newTotalPomos,
      });
    },
    [user, firestore, sessionStartTime, mode]
  );

  const start = useCallback(() => {
    startAction(Date.now());
  }, [startAction]);

  const pause = useCallback(() => {
    if (isActive) {
      recordSession(false);
    }
    pauseAction();
  }, [isActive, recordSession, pauseAction]);

  const reset = useCallback(() => {
    if (isActive) {
      recordSession(false);
    }
    resetAction();
  }, [isActive, recordSession, resetAction]);

  // Effect for animation frame based timer
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

  // Effect for handling cycle completion
  useEffect(() => {
    if (timeLeft <= 0 && isActive) {
      recordSession(true); // Record as a completed session
      completeCycle();
    }
  }, [timeLeft, isActive, completeCycle, recordSession]);

  return { ...store, start, pause, reset, addTime, subtractTime };
};

export * from '@/store/timer-store';
