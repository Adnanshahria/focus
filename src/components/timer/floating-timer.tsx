'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useTimer } from '@/hooks/use-timer';
import { useTimerStore } from '@/store/timer-store';
import { cn } from '@/lib/utils';
import { useWakeLock } from '@/hooks/use-wakelock';
import { useRouter } from 'next/navigation';
import { FloatingTimerDisplay } from './floating-timer-display';
import { FloatingTimerControls } from './floating-timer-controls';

interface FloatingTimerProps {
    theme: 'dark' | 'light';
    toggleTheme: () => void;
}

export function FloatingTimer({ theme, toggleTheme }: FloatingTimerProps) {
  const router = useRouter();
  const { timeLeft, isActive, start, pause, addTime, subtractTime, sessionDuration, endAndSaveSession, resetSession, isSaving } = useTimer();
  const { antiBurnIn } = useTimerStore();

  const [controlsVisible, setControlsVisible] = useState(false);
  const [isDimmed, setIsDimmed] = useState(false);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dimTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const controlsAnimation = useAnimation();
  const pixelShiftControls = useAnimation();
  const { isSupported, request, release } = useWakeLock();

  const showControls = useCallback(() => {
    setIsDimmed(false);
    setControlsVisible(true);
    controlsAnimation.start({ opacity: 1, y: 0 });
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    if (dimTimeoutRef.current) clearTimeout(dimTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      controlsAnimation.start({ opacity: 0, y: 10 }).then(() => setControlsVisible(false));
    }, 3000);
    dimTimeoutRef.current = setTimeout(() => setIsDimmed(true), 20000);
  }, [controlsAnimation]);

  const handleExit = useCallback(() => {
    if (document.fullscreenElement) {
        document.exitFullscreen().catch(err => console.error(err));
    }
    router.push('/');
  }, [router]);
  
  const handleEventAndShowControls = (event: React.MouseEvent, action?: () => void) => {
    event.stopPropagation();
    action?.();
    showControls();
  };

  useEffect(() => {
    if (isSupported) request();
    showControls();
    const handlePopState = (event: PopStateEvent) => {
        event.preventDefault(); 
        handleExit();
    };
    if (window.history.state?.page !== 'deepFocus') {
        window.history.pushState({ page: 'deepFocus' }, '');
    }
    window.addEventListener('popstate', handlePopState);
    return () => {
      if (isSupported) release();
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
      if (dimTimeoutRef.current) clearTimeout(dimTimeoutRef.current);
      window.removeEventListener('popstate', handlePopState);
      if (window.history.state?.page === 'deepFocus') {
          try { window.history.back(); } catch(e) {}
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      showControls();
      if (e.key === ' ') { e.preventDefault(); isActive ? pause() : start(); }
      if(e.key === 'Escape') { handleExit(); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showControls, isActive, pause, start, handleExit]);

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
  
  return (
    <div className="w-full h-full flex flex-col items-center justify-center cursor-pointer" onClick={showControls}>
      <motion.div animate={pixelShiftControls} className={cn('relative flex flex-col items-center justify-center gap-8 transition-opacity duration-1000', isDimmed ? 'opacity-30' : 'opacity-100')}>
        <FloatingTimerDisplay theme={theme} timeLeft={timeLeft} sessionDuration={sessionDuration} isActive={isActive} />
      </motion.div>
      <FloatingTimerControls
        theme={theme}
        controlsAnimationProps={controlsAnimation}
        controlsVisible={controlsVisible}
        isActive={isActive}
        isPristine={timeLeft === sessionDuration && !isActive}
        isSaving={isSaving}
        onExit={(e) => handleEventAndShowControls(e, handleExit)}
        onSubtractTime={(e) => handleEventAndShowControls(e, () => subtractTime(3 * 60))}
        onTogglePlay={(e) => handleEventAndShowControls(e, isActive ? pause : start)}
        onAddTime={(e) => handleEventAndShowControls(e, () => addTime(3 * 60))}
        onCancel={(e) => handleEventAndShowControls(e, resetSession)}
        onEndAndSave={(e) => handleEventAndShowControls(e, endAndSaveSession)}
        onToggleTheme={(e) => handleEventAndShowControls(e, toggleTheme)}
      />
    </div>
  );
}
