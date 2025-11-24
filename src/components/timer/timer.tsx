'use client';

import React from 'react';
import { TimerDisplay } from "./timer-display";
import { TimerControls } from "./timer-controls";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useTimerStore } from "@/store/timer-store";
import { useDoc, useFirestore, useUser, useMemoFirebase } from "@/firebase";
import { useEffect } from "react";
import { doc, collection } from "firebase/firestore";
import { TimerModeSwitch } from "./timer-mode-switch";

type UserPreferences = {
    pomodoroDuration?: number;
    shortBreakDuration?: number;
    longBreakDuration?: number;
}

const MemoizedTimerDisplay = React.memo(TimerDisplay);
const MemoizedTimerControls = React.memo(TimerControls);
const MemoizedTimerModeSwitch = React.memo(TimerModeSwitch);

export function Timer() {
  const { setDurations } = useTimerStore(state => ({
    setDurations: state.setDurations,
  }));

  const { user } = useUser();
  const firestore = useFirestore();

  const userPreferencesRef = useMemoFirebase(() => {
    if (!user || user.isAnonymous) return null;
    const prefCollection = collection(firestore, `users/${user.uid}/userPreferences`);
    return doc(prefCollection, 'main');
  }, [user, firestore]);

  const { data: preferences } = useDoc<UserPreferences>(userPreferencesRef);

  useEffect(() => {
    if (preferences) {
      if (preferences.pomodoroDuration && preferences.shortBreakDuration && preferences.longBreakDuration) {
          setDurations({
            pomodoroDuration: preferences.pomodoroDuration,
            shortBreakDuration: preferences.shortBreakDuration,
            longBreakDuration: preferences.longBreakDuration,
          });
      }
    }
  }, [preferences, setDurations]);

  return (
    <motion.div
      key="timer-container"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "relative w-full max-w-[340px] h-[480px] md:max-w-[420px] md:h-[520px] rounded-3xl",
        "flex flex-col items-center justify-around p-4",
        "bg-card border shadow-2xl shadow-black/10 dark:shadow-black/20"
      )}
    >
      <MemoizedTimerModeSwitch />
      <MemoizedTimerDisplay />
      <MemoizedTimerControls />
    </motion.div>
  );
}
