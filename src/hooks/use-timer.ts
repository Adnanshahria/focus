'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import { useTimerStore } from '@/store/timer-store';
import { useSessionRecorder } from './use-session-recorder';
import { useAudioAlert } from './use-audio-alert';

export const useTimer = () => {
  const {
    start: startAction, pause: pauseAction, reset: resetAction,
    addTime, subtractTime, setSessionTime,
    endAndSaveSession: endAndSaveAction, setSaving,
  } = useTimerStore();

  // We only subscribe to what we actually need for the logic here.
  // Note: logic concerning 'isActive' and 'timeLeft' for the tick is mostly handled inside the store actions now,
  // but we still need the effect to drive the tick if we want to keep the requestAnimationFrame loop here.
  // Ideally, the loop should be decoupled or the component consuming time should subscribe.
  // However, to keep this refactor manageable, we'll subscribe to just what strict logic needs.

  const isActive = useTimerStore(state => state.isActive);
  const timeLeft = useTimerStore(state => state.timeLeft);
  const mode = useTimerStore(state => state.mode);
  const sessionStartTime = useTimerStore(state => state.sessionStartTime);
  const isSaving = useTimerStore(state => state.isSaving);
  const tick = useTimerStore(state => state.tick);
  const completeCycle = useTimerStore(state => state.completeCycle);

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
    // OPTIMISTIC UPDATE:
    // 1. Immediately reset the UI state so the user thinks it's done.
    // 2. Fire the network request in the background (fire-and-forget).

    if (isSaving || !sessionStartTime) return;

    // Immediate UI feedback
    endAndSaveAction();

    // Background write
    recordSession(sessionStartTime, mode, false).catch(err => {
      console.error("Background session save failed:", err);
      // Error handling strategy: The recordSession now has local queueing (see next step), 
      // so it shouldn't fail unless fatal logic error.
    });

  }, [isSaving, sessionStartTime, recordSession, mode, endAndSaveAction]);

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

      // Read state directly from store to avoid closure staleness without dependency
      const state = useTimerStore.getState();
      if (state.timeLeft > 0 && state.isActive) {
        frameIdRef.current = requestAnimationFrame(runTick);
      }
    };

    if (timeLeft > 0) frameIdRef.current = requestAnimationFrame(runTick);
    else lastTickTimeRef.current = null;

    return () => { if (frameIdRef.current) cancelAnimationFrame(frameIdRef.current); };
  }, [isActive, tick, timeLeft]); // Re-subscribe when isActive changes

  useEffect(() => {
    const handleTimerEnd = async () => {
      // Check condition but do NOT block UI
      if (timeLeft <= 0 && isActive) {
        playBeep();

        // Optimistic completion
        completeCycle();

        // Background write
        recordSession(sessionStartTime, mode, true).catch(err => {
          console.error("Failed to record completed session in background:", err);
        });
      }
    }
    handleTimerEnd();
  }, [timeLeft, isActive, playBeep, recordSession, mode, sessionStartTime, completeCycle]);

  return {
    isActive, timeLeft, mode, sessionStartTime, isSaving,
    start, pause, resetSession, addTime, subtractTime, setSessionTime, endAndSaveSession
  };
};
