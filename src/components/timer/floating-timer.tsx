'use client';

import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useTimer } from '@/hooks/use-timer';
import { useTimerStore } from '@/store/timer-store';
import { cn } from '@/lib/utils';
import { useFloatingTimer } from '@/hooks/use-floating-timer';
import { FloatingTimerDisplay } from './floating-timer-display';
import { FloatingTimerControls } from './floating-timer-controls';

interface FloatingTimerProps {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  todayRecord?: any;
  dailyGoal?: number;
  onExit?: () => void;
}

export function FloatingTimer({ theme, toggleTheme, todayRecord, dailyGoal, onExit }: FloatingTimerProps) {
  const { timeLeft, isActive, start, pause, addTime, subtractTime, setSessionTime, sessionDuration, endAndSaveSession, resetSession, isSaving } = useTimer();
  const { antiBurnIn } = useTimerStore();
  const controlsAnimation = useAnimation();
  const pixelShiftControls = useAnimation();
  const { controlsVisible, isDimmed, showControls, handleExit: exitFullscreen } = useFloatingTimer(controlsAnimation);

  const handleExitWrapper = () => {
    exitFullscreen();
    onExit?.();
  };

  const handleEventAndShowControls = (event: React.MouseEvent, action?: () => void) => {
    event.stopPropagation();
    action?.();
    showControls();
  };

  useEffect(() => {
    if (!antiBurnIn) return;
    const shiftPixel = () => {
      const maxJitter = window.innerWidth > 480 ? 20 : 10;
      const x = Math.floor(Math.random() * (maxJitter * 2 + 1)) - maxJitter;
      const y = Math.floor(Math.random() * (maxJitter * 2 + 1)) - maxJitter;
      pixelShiftControls.start({ x, y, transition: { duration: 1, ease: 'easeOut' } });
    };
    pixelShiftControls.set({ x: 0, y: 0 });
    const intervalId = setInterval(shiftPixel, 60000);
    return () => clearInterval(intervalId);
  }, [pixelShiftControls, antiBurnIn]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      showControls();
      if (e.key === ' ') { e.preventDefault(); isActive ? pause() : start(); }
      if (e.key === 'Escape') { handleExitWrapper(); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showControls, isActive, pause, start, exitFullscreen, onExit]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center cursor-pointer bg-black" onClick={showControls}>
      <motion.div animate={pixelShiftControls} className={cn('relative flex flex-col items-center justify-center gap-8 transition-opacity duration-1000', isDimmed ? 'opacity-30' : 'opacity-100')}>
        <FloatingTimerDisplay
          theme={theme}
          timeLeft={timeLeft}
          sessionDuration={sessionDuration}
          isActive={isActive}
          todayRecord={todayRecord}
          dailyGoal={dailyGoal}
        />
      </motion.div>
      <FloatingTimerControls
        theme={theme}
        controlsAnimationProps={controlsAnimation}
        controlsVisible={controlsVisible}
        isActive={isActive}
        isPristine={timeLeft === sessionDuration && !isActive}
        isSaving={isSaving}
        onExit={(e) => handleEventAndShowControls(e, handleExitWrapper)}
        onSubtractTime={(e) => handleEventAndShowControls(e, () => subtractTime(3 * 60))}
        onTogglePlay={(e) => handleEventAndShowControls(e, isActive ? pause : start)}
        onAddTime={(e) => handleEventAndShowControls(e, () => addTime(3 * 60))}
        onCancel={(e) => handleEventAndShowControls(e, resetSession)}
        onEndAndSave={(e) => handleEventAndShowControls(e, endAndSaveSession)}
        onToggleTheme={(e) => handleEventAndShowControls(e, toggleTheme)}
        onSetSessionTime={(seconds) => setSessionTime(seconds)}
      />
    </div>
  );
}
