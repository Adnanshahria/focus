'use client';

import { create } from 'zustand';
import { TimerState } from './timer-state';
import { createTimerActions, TimerActions } from './timer-actions';

export * from './timer-state';
export * from './timer-actions';

export const useTimerStore = create<TimerState & TimerActions>((set, get) => {
  const initialState: TimerState = {
    mode: 'pomodoro',
    pomodoroDuration: 25 * 60,
    shortBreakDuration: 5 * 60,
    longBreakDuration: 15 * 60,
    timeLeft: 25 * 60,
    isActive: false,
    pomodorosCompleted: 0,
    sessionStartTime: null,
    sessionDuration: 25 * 60,
    antiBurnIn: true,
    isSaving: false,
  };

  return {
    ...initialState,
    ...createTimerActions(set, get),
  };
});
