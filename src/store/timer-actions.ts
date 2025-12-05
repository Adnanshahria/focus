'use client';

import { StateCreator } from 'zustand';
import { TimerState, TimerMode, TimerDurations, VisualSettings } from './timer-state';

export type TimerActions = {
  setMode: (mode: TimerMode) => void;
  start: (startTime: number) => void;
  pause: () => void;
  reset: () => void;
  tick: (decrement: number) => void;
  completeCycle: () => void;
  setDurations: (durations: Partial<TimerDurations>) => void;
  setVisuals: (visuals: Partial<VisualSettings>) => void;
  addTime: (seconds: number) => void;
  subtractTime: (seconds: number) => void;
  endAndSaveSession: () => void;
  setSaving: (isSaving: boolean) => void;
  setSessionTime: (seconds: number) => void;
};

const getInitialTime = (mode: TimerMode, durations?: Partial<TimerDurations>) => {
  switch (mode) {
    case 'pomodoro': return durations?.pomodoroDuration || 25 * 60;
    case 'shortBreak': return durations?.shortBreakDuration || 5 * 60;
    case 'longBreak': return durations?.longBreakDuration || 15 * 60;
  }
};

export const createTimerActions: StateCreator<TimerState & TimerActions, [], [], TimerActions> = (set: any, get: any) => ({
  setMode: (mode: TimerMode) => {
    const initialTime = getInitialTime(mode, get());
    set({ mode, isActive: false, timeLeft: initialTime, sessionDuration: initialTime, sessionStartTime: null });
  },
  start: (startTime: number) => set((state: any) => ({ isActive: true, sessionStartTime: state.sessionStartTime ?? startTime })),
  pause: () => set({ isActive: false }),
  reset: () => set((state: any) => {
    const initialTime = getInitialTime(state.mode, state);
    return { isActive: false, timeLeft: initialTime, sessionDuration: initialTime, sessionStartTime: null };
  }),
  endAndSaveSession: () => set((state: any) => {
    const initialTime = getInitialTime(state.mode, state);
    return { isActive: false, timeLeft: initialTime, sessionDuration: initialTime, sessionStartTime: null };
  }),
  tick: (decrement: number) => {
    set((state: any) => {
      const newTimeLeft = Math.max(0, state.timeLeft - decrement);
      return { timeLeft: newTimeLeft };
    });
  },
  completeCycle: () => {
    const { mode, pomodorosCompleted } = get();
    if (mode === 'pomodoro') {
      const newPomos = pomodorosCompleted + 1;
      set({ pomodorosCompleted: newPomos, isActive: false });
      get().setMode(newPomos % 4 === 0 ? 'longBreak' : 'shortBreak');
    } else {
      set({ isActive: false });
      get().setMode('pomodoro');
    }
  },
  setDurations: (durations: Partial<TimerDurations>) => {
    set(durations);
    if (!get().isActive) {
      const newInitialTime = getInitialTime(get().mode, get());
      set({ timeLeft: newInitialTime, sessionDuration: newInitialTime });
    }
  },
  setVisuals: (visuals: Partial<VisualSettings>) => set(visuals),
  addTime: (seconds: number) => set((state: any) => ({ timeLeft: state.timeLeft + seconds, sessionDuration: state.sessionDuration + seconds })),
  subtractTime: (seconds: number) => set((state: any) => ({ timeLeft: Math.max(0, state.timeLeft - seconds), sessionDuration: Math.max(0, state.sessionDuration - seconds) })),
  setSaving: (isSaving: boolean) => set({ isSaving }),
  setSessionTime: (seconds: number) => set({ timeLeft: seconds, sessionDuration: seconds }),
});
