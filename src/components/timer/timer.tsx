'use client';

import React from 'react';
import { TimerDisplay } from "./timer-display";
import { TimerControls } from "./timer-controls";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { TimerModeSwitch } from "./timer-mode-switch";


const MemoizedTimerDisplay = React.memo(TimerDisplay);
const MemoizedTimerControls = React.memo(TimerControls);

export function Timer() {
  return (
    <motion.div
      key="timer-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn(
        "relative w-full max-w-[340px] h-[500px] md:max-w-[420px] md:h-[540px] rounded-3xl",
        "flex flex-col items-center justify-between p-6 md:p-8",
        "bg-gradient-to-b from-card/90 to-card/70 backdrop-blur-xl",
        "border border-white/10 dark:border-white/5",
        "shadow-[0_8px_40px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_60px_rgba(0,0,0,0.4)]",
        "before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-b before:from-white/5 before:to-transparent before:pointer-events-none"
      )}
    >
      <TimerModeSwitch />
      <MemoizedTimerDisplay />
      <MemoizedTimerControls />
    </motion.div>
  );
}
