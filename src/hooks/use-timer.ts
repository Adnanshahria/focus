'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useTimerStore } from '@/store/timer-store';
import { useSessionRecorder } from './use-session-recorder';

export const useTimer = () => {
  const store = useTimerStore();
  const {
    isActive, timeLeft, tick, completeCycle,
    start: startAction, pause: pauseAction, reset: resetAction,
    mode, sessionStartTime, addTime, subtractTime,
    endAndSaveSession: endAndSaveAction, isSaving, setSaving,
  } = store;

  const { recordSession } = useSessionRecorder();

  const lastTickTimeRef = useRef<number | null>(null);
  const frameIdRef = useRef<number | null>(null);

  const start = useCallback(() => startAction(Date.now()), [startAction]);
  const pause = useCallback(() => pauseAction(), [pauseAction]);
  const resetSession = useCallback(() => resetAction(), [resetAction]);

  const endAndSaveSession = useCallback(async () => {
    if (isSaving || !sessionStartTime) return;
    setSaving(true);
    try {
      await recordSession(sessionStartTime, mode, false); // Record partial session
      endAndSaveAction(); // Then reset the state
    } finally {
        setSaving(false);
    }
  }, [isSaving, sessionStartTime, recordSession, mode, endAndSaveAction, setSaving]);

  useEffect(() => {
    if (!isActive) {
      lastTickTimeRef.current = null;
      if (frameIdRef.current) cancelAnimationFrame(frameIdRef.current);
      frameIdRef.current = null;
      return;
    }

    const runTick = (timestamp: number) => {
      if (!lastTickTimeRef.current) lastTickTimeRef.current = timestamp;
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

    if (timeLeft > 0) frameIdRef.current = requestAnimationFrame(runTick);
    else lastTickTimeRef.current = null;

    return () => { if (frameIdRef.current) cancelAnimationFrame(frameIdRef.current); };
  }, [isActive, timeLeft, tick]);

  useEffect(() => {
    const handleTimerEnd = async () => {
        if (timeLeft <= 0 && isActive) {
            setSaving(true);
            try {
                await recordSession(sessionStartTime, mode, true);
                completeCycle();
            } finally {
                setSaving(false);
            }
        }
    }
    handleTimerEnd();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, isActive]);

  return { ...store, start, pause, resetSession, addTime, subtractTime, endAndSaveSession };
};
