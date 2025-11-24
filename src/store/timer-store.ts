'use client';

import { create } from 'zustand';

export type TimerMode = 'pomodoro' | 'shortBreak' | 'longBreak';

const POMODORO_DUR = 25 * 60;
const SHORT_BREAK_DUR = 5 * 60;
const LONG_BREAK_DUR = 15 * 60;

const getInitialTime = (mode: TimerMode, durations?: Partial<TimerDurations>) => {
  switch (mode) {
    case 'pomodoro':
      return durations?.pomodoroDuration || POMODORO_DUR;
    case 'shortBreak':
      return durations?.shortBreakDuration || SHORT_BREAK_DUR;
    case 'longBreak':
      return durations?.longBreakDuration || LONG_BREAK_DUR;
  }
};

export type TimerDurations = {
  pomodoroDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
};

type VisualSettings = {
  antiBurnIn: boolean;
};

type TimerState = {
  mode: TimerMode;
  timeLeft: number;
  isActive: boolean;
  pomodorosCompleted: number;
  sessionStartTime: number | null;
  sessionDuration: number; // The total duration for the current session including added time
  totalFocusMinutes: number;
  totalPomos: number;
} & TimerDurations &
  VisualSettings;

type TimerActions = {
  setMode: (mode: TimerMode) => void;
  start: (startTime: number) => void;
  pause: () => void;
  reset: () => void;
  tick: (decrement: number) => void;
  completeCycle: () => void;
  setDurations: (durations: Partial<TimerDurations>) => void;
  setFocusHistory: (data: {
    totalFocusMinutes: number;
    totalPomos: number;
  }) => void;
  setVisuals: (visuals: Partial<VisualSettings>) => void;
  addTime: (seconds: number) => void;
};

export const useTimerStore = create<TimerState & TimerActions>((set, get) => ({
  mode: 'pomodoro',
  pomodoroDuration: POMODORO_DUR,
  shortBreakDuration: SHORT_BREAK_DUR,
  longBreakDuration: LONG_BREAK_DUR,
  timeLeft: POMODORO_DUR,
  isActive: false,
  pomodorosCompleted: 0,
  sessionStartTime: null,
  sessionDuration: POMODORO_DUR,
  totalFocusMinutes: 0,
  totalPomos: 0,
  antiBurnIn: true, // Enabled by default for better UX on OLED

  setMode: mode => {
    const initialTime = getInitialTime(mode, get());
    set({
      mode,
      isActive: false,
      timeLeft: initialTime,
      sessionDuration: initialTime,
    });
  },
  start: startTime => set({ isActive: true, sessionStartTime: startTime }),
  pause: () => set({ isActive: false }),
  reset: () =>
    set(state => {
        const initialTime = getInitialTime(state.mode, state);
        return {
            isActive: false,
            timeLeft: initialTime,
            sessionDuration: initialTime,
        }
    }),
  tick: decrement => {
    set(state => {
      const newTimeLeft = Math.max(0, state.timeLeft - decrement);
      if (newTimeLeft === 0 && state.isActive) {
        return { timeLeft: 0 };
      }
      return { timeLeft: newTimeLeft };
    });
  },
  completeCycle: () => {
    const currentMode = get().mode;
    if (currentMode === 'pomodoro') {
      const pomodoros = get().pomodorosCompleted + 1;
      set({ pomodorosCompleted: pomodoros, isActive: false });
      if (pomodoros % 4 === 0) {
        get().setMode('longBreak');
      } else {
        get().setMode('shortBreak');
      }
    } else {
      set({ isActive: false });
      get().setMode('pomodoro');
    }
  },
  setDurations: (durations: Partial<TimerDurations>) => {
    const currentDurations = {
      pomodoroDuration: get().pomodoroDuration,
      shortBreakDuration: get().shortBreakDuration,
      longBreakDuration: get().longBreakDuration,
    };
    const newDurations = { ...currentDurations, ...durations };
    set(newDurations);

    if (!get().isActive) {
        const initialTime = getInitialTime(get().mode, newDurations);
        set({ 
            timeLeft: initialTime,
            sessionDuration: initialTime,
        });
    }
  },
  setFocusHistory: data => {
    set(data);
  },
  setVisuals: visuals => {
    set(visuals);
  },
  addTime: seconds => {
    set(state => ({
      timeLeft: state.timeLeft + seconds,
      sessionDuration: state.sessionDuration + seconds,
    }));
  },
}));
