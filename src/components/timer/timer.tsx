'use client';

import React from 'react';
import { TimerDisplay } from "./timer-display";
import { TimerControls } from "./timer-controls";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { TimerModeSwitch } from "./timer-mode-switch";


const MemoizedTimerDisplay = React.memo(TimerDisplay);
const MemoizedTimerControls = React.memo(TimerControls);
const MemoizedTimerModeSwitch = React.memo(TimerModeSwitch);

export function Timer() {
  return (
    <motion.div
      key="timer-container"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "relative w-full max-w-[340px] h-[500px] md:max-w-[420px] md:h-[540px] rounded-3xl",
        "flex flex-col items-center justify-between p-6",
        "bg-card/80 backdrop-blur-md border shadow-2xl shadow-black/20"
      )}
    >
      <MemoizedTimerModeSwitch />
      <MemoizedTimerDisplay />
      <MemoizedTimerControls />
    </motion.div>
  );
}
