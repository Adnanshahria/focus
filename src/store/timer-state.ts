'use client';

export type TimerMode = 'pomodoro' | 'shortBreak' | 'longBreak';

export type TimerDurations = {
  pomodoroDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
};

export type VisualSettings = {
  antiBurnIn: boolean;
};

export type TimerState = {
  mode: TimerMode;
  timeLeft: number;
  isActive: boolean;
  pomodorosCompleted: number;
  sessionStartTime: number | null;
  sessionDuration: number; // The total duration for the current session including added time
  isSaving: boolean;
} & TimerDurations &
  VisualSettings;
