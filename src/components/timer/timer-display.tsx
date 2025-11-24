"use client";

import { useTimer } from "@/hooks/use-timer";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};

export function TimerDisplay() {
  const { timeLeft, mode, pomodoroDuration, shortBreakDuration, longBreakDuration } = useTimer();

  const getDuration = () => {
    switch (mode) {
      case "pomodoro": return pomodoroDuration;
      case "shortBreak": return shortBreakDuration;
      case "longBreak": return longBreakDuration;
    }
  }

  const duration = getDuration();
  const progress = duration > 0 ? (duration - timeLeft) / duration : 0;
  const circumference = 2 * Math.PI * 120; // Adjusted radius
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="relative w-[260px] h-[260px] md:w-[300px] md:h-[300px] flex items-center justify-center">
      <svg className="absolute w-full h-full" viewBox="0 0 260 260">
        <circle
          cx="130"
          cy="130"
          r="120"
          fill="none"
          stroke="hsl(var(--border) / 0.5)"
          strokeWidth="10"
        />
        <motion.circle
          cx="130"
          cy="130"
          r="120"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="10"
          strokeLinecap="round"
          transform="rotate(-90 130 130)"
          strokeDasharray={circumference}
          initial={false}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.3, ease: "linear" }}
        />
      </svg>
      <div className="z-10 text-center">
        <h2 className={cn(
          "text-6xl md:text-7xl font-black tracking-tighter tabular-nums text-foreground"
        )}>
          {formatTime(timeLeft)}
        </h2>
      </div>
    </div>
  );
}
