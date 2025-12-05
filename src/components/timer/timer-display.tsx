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
  const { timeLeft, sessionDuration, isActive } = useTimer();

  const progress = sessionDuration > 0 ? (sessionDuration - timeLeft) / sessionDuration : 0;
  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="relative w-[260px] h-[260px] md:w-[300px] md:h-[300px] flex items-center justify-center">
      {/* Background glow when active */}
      {isActive && (
        <motion.div
          className="absolute inset-0 rounded-full bg-primary/20 blur-3xl"
          animate={{ opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      <svg className="absolute w-full h-full" viewBox="0 0 260 260">
        {/* Track circle */}
        <circle
          cx="130"
          cy="130"
          r="120"
          fill="none"
          stroke="hsl(var(--border) / 0.15)"
          strokeWidth="8"
        />
        {/* Progress circle */}
        <motion.circle
          cx="130"
          cy="130"
          r="120"
          fill="none"
          stroke="url(#gradient)"
          strokeWidth="10"
          strokeLinecap="round"
          transform="rotate(-90 130 130)"
          strokeDasharray={circumference}
          initial={false}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{
            filter: isActive ? "drop-shadow(0 0 8px hsl(var(--primary) / 0.5))" : "none"
          }}
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="50%" stopColor="hsl(220, 90%, 65%)" />
            <stop offset="100%" stopColor="hsl(280, 80%, 60%)" />
          </linearGradient>
        </defs>
      </svg>
      <div className="z-10 text-center">
        <motion.h2
          className={cn(
            "text-6xl md:text-7xl font-black tracking-tighter tabular-nums",
            "bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent"
          )}
          animate={isActive ? { scale: [1, 1.01, 1] } : {}}
          transition={{ duration: 1, repeat: Infinity }}
        >
          {formatTime(timeLeft)}
        </motion.h2>
      </div>
    </div>
  );
}
