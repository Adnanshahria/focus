'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useTimerStore } from '@/store/timer-store';
import { useSessionRecorder } from './use-session-recorder';
import { useAudioAlert } from './use-audio-alert';

export const useTimer = () => {
  const store = useTimerStore();
  const {
    isActive, timeLeft, tick, completeCycle,
    start: startAction, pause: pauseAction, reset: resetAction,
    mode, sessionStartTime, addTime, subtractTime, setSessionTime,
    endAndSaveSession: endAndSaveAction, isSaving, setSaving,
  } = store;

  const { recordSession } = useSessionRecorder();
  const { playBeep, ensureAudioContext } = useAudioAlert();

  const lastTickTimeRef = useRef<number | null>(null);
  const frameIdRef = useRef<number | null>(null);

  const start = useCallback(() => {
    ensureAudioContext();
    startAction(Date.now());
  }, [startAction, ensureAudioContext]);

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

      const state = useTimerStore.getState();
      if (state.timeLeft > 0 && state.isActive) {
        frameIdRef.current = requestAnimationFrame(runTick);
      }
    };

    if (timeLeft > 0) frameIdRef.current = requestAnimationFrame(runTick);
    else lastTickTimeRef.current = null;

    return () => { if (frameIdRef.current) cancelAnimationFrame(frameIdRef.current); };
  }, [isActive, tick]);

  useEffect(() => {
    const handleTimerEnd = async () => {
      if (timeLeft <= 0 && isActive) {
        playBeep();
        setSaving(true);
        try {
          await recordSession(sessionStartTime, mode, true);
        } catch (error) {
          console.error("Failed to record session:", error);
          // Still complete the cycle to avoid stuck state
        } finally {
          completeCycle();
          setSaving(false);
        }
      }
    }
    handleTimerEnd();
  }, [timeLeft, isActive, playBeep, recordSession, mode, sessionStartTime, completeCycle, setSaving]);

  return { ...store, start, pause, resetSession, addTime, subtractTime, setSessionTime, endAndSaveSession };
};
