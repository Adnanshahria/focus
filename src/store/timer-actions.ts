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
};

const getInitialTime = (mode: TimerMode, durations?: Partial<TimerDurations>) => {
  switch (mode) {
    case 'pomodoro': return durations?.pomodoroDuration || 25 * 60;
    case 'shortBreak': return durations?.shortBreakDuration || 5 * 60;
    case 'longBreak': return durations?.longBreakDuration || 15 * 60;
  }
};

export const createTimerActions: StateCreator<TimerState & TimerActions, [], [], TimerActions> = (set, get) => ({
  setMode: mode => {
    const initialTime = getInitialTime(mode, get());
    set({ mode, isActive: false, timeLeft: initialTime, sessionDuration: initialTime, sessionStartTime: null });
  },
  start: startTime => set(state => ({ isActive: true, sessionStartTime: state.sessionStartTime ?? startTime })),
  pause: () => set({ isActive: false }),
  reset: () => set(state => {
    const initialTime = getInitialTime(state.mode, state);
    return { isActive: false, timeLeft: initialTime, sessionDuration: initialTime, sessionStartTime: null };
  }),
  endAndSaveSession: () => set(state => {
    const initialTime = getInitialTime(state.mode, state);
    return { isActive: false, timeLeft: initialTime, sessionDuration: initialTime, sessionStartTime: null };
  }),
  tick: decrement => {
    set(state => {
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
  setDurations: (durations) => {
    set(durations);
    if (!get().isActive) {
      const newInitialTime = getInitialTime(get().mode, get());
      set({ timeLeft: newInitialTime, sessionDuration: newInitialTime });
    }
  },
  setVisuals: visuals => set(visuals),
  addTime: seconds => set(state => ({ timeLeft: state.timeLeft + seconds, sessionDuration: state.sessionDuration + seconds })),
  subtractTime: seconds => set(state => ({ timeLeft: Math.max(0, state.timeLeft - seconds), sessionDuration: Math.max(0, state.sessionDuration - seconds) })),
  setSaving: isSaving => set({ isSaving }),
  setSessionTime: seconds => set({ timeLeft: seconds, sessionDuration: seconds }),
});
