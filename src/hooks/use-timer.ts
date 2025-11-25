'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useTimerStore } from '@/store/timer-store';
import { useUser, useFirestore } from '@/firebase/provider';
import { doc, collection, runTransaction } from 'firebase/firestore';

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

  const lastTickTimeRef = useRef<number | null>(null);
  const frameIdRef = useRef<number | null>(null);

  const recordSession = useCallback(
    async (isCompletion: boolean) => {
      // Hooks are called inside, just-in-time.
      const { user } = useUser();
      const firestore = useFirestore();

      if (!user || user.isAnonymous || !firestore || !sessionStartTime) return false;
      if (mode !== 'pomodoro') return false;

      const durationInMinutes = (Date.now() - sessionStartTime) / (1000 * 60);
      if (durationInMinutes < 0.1) return false;

      const today = new Date().toISOString().split('T')[0];
      const focusRecordRef = doc(firestore, `users/${user.uid}/focusRecords`, today);
      const sessionsCollection = collection(focusRecordRef, 'sessions');
      const newSessionRef = doc(sessionsCollection);

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

          transaction.set(newSessionRef, {
            id: newSessionRef.id,
            focusRecordId: focusRecordRef.id,
            startTime: new Date(sessionStartTime).toISOString(),
            endTime: new Date().toISOString(),
            duration: durationInMinutes,
            type: mode,
            completed: isCompletion,
          });
        });
        return true;
      } catch (error) {
        console.error("Transaction to record session failed: ", error);
        return false;
      }
    },
    [sessionStartTime, mode] // user and firestore are stable from context
  );

  const start = useCallback(() => {
    startAction(Date.now());
  }, [startAction]);

  const pause = useCallback(async () => {
    if (isActive && sessionStartTime) {
      await recordSession(false);
    }
    pauseAction();
  }, [isActive, sessionStartTime, pauseAction, recordSession]);

  const reset = useCallback(() => {
    resetAction();
  }, [resetAction]);

  const endAndSaveSession = useCallback(async () => {
    // If timer is active or was paused mid-session, record it before resetting.
    if (sessionStartTime) {
        // If it was active, pause first which also triggers save.
        if (isActive) {
            await pause();
        }
    }
    // Now perform the reset of the state.
    endAndSaveAction();
  }, [isActive, sessionStartTime, pause, endAndSaveAction]);


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

      if (useTimerStore.getState().timeLeft > 0 && useTimerStore.getState().isActive) {
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
    const handleTimerEnd = async () => {
        if (timeLeft <= 0 && isActive) {
            await recordSession(true);
            completeCycle();
        }
    }
    handleTimerEnd();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, isActive]);

  return { ...store, start, pause, reset, addTime, subtractTime, endAndSaveSession };
};
