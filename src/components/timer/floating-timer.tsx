
'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useTimer } from '@/hooks/use-timer';
import { useTimerStore } from '@/store/timer-store';
import { cn } from '@/lib/utils';
import { useWakeLock } from '@/hooks/use-wakelock';
import { Button } from '../ui/button';
import { Play, Pause, ArrowLeft, Plus, Minus, RotateCcw, Moon, Sun } from 'lucide-react';
import { useRouter } from 'next/navigation';

const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  if (hours > 0) {
    return `${String(hours)}:${String(mins).padStart(2, '0')}:${String(
      secs
    ).padStart(2, '0')}`;
  }
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

interface FloatingTimerProps {
    theme: 'dark' | 'light';
    toggleTheme: () => void;
}

export function FloatingTimer({ theme, toggleTheme }: FloatingTimerProps) {
  const router = useRouter();
  const {
    timeLeft,
    isActive,
    start,
    pause,
    addTime,
    subtractTime,
    sessionDuration,
    endAndSaveSession,
  } = useTimer();
  const { antiBurnIn } = useTimerStore();

  const [controlsVisible, setControlsVisible] = useState(false);
  const [isDimmed, setIsDimmed] = useState(false);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dimTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const controlsAnimation = useAnimation();
  const pixelShiftControls = useAnimation();
  const { isSupported, request, release } = useWakeLock();
  
  const [pathLength, setPathLength] = useState(0);
  const pathRef = useRef<SVGPathElement>(null);


  useEffect(() => {
    if (pathRef.current) {
        const length = pathRef.current.getTotalLength();
        setPathLength(length);
    }
  }, [isActive, sessionDuration]); // Rerun when timer resets to get fresh path length

  const progress = sessionDuration > 0 ? (sessionDuration - timeLeft) / sessionDuration : 0;
  const strokeDashoffset = pathLength * (1 - progress);

  const showControls = useCallback(() => {
    setIsDimmed(false);
    setControlsVisible(true);
    controlsAnimation.start({ opacity: 1, y: 0 });

    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    if (dimTimeoutRef.current) clearTimeout(dimTimeoutRef.current);

    controlsTimeoutRef.current = setTimeout(() => {
      controlsAnimation
        .start({ opacity: 0, y: 10 })
        .then(() => setControlsVisible(false));
    }, 3000);

    dimTimeoutRef.current = setTimeout(() => setIsDimmed(true), 20000);
  }, [controlsAnimation]);

  const handleExit = useCallback(() => {
    if (document.fullscreenElement) {
        document.exitFullscreen().catch(err => console.error(err));
    }
    // Instead of router.back(), which can be unreliable, we push to the homepage.
    router.push('/');
  }, [router]);

  const handleAddTime = (e: React.MouseEvent) => {
    e.stopPropagation();
    addTime(3 * 60);
    showControls();
  }

  const handleSubtractTime = (e: React.MouseEvent) => {
    e.stopPropagation();
    subtractTime(3 * 60);
    showControls();
  }

  const handleEndAndSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    endAndSaveSession();
    showControls();
  }
  
  const handleTogglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    isActive ? pause() : start();
    showControls();
  }
  
  const handleToggleTheme = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleTheme();
    showControls();
  }

  useEffect(() => {
    if (isSupported) request();
    showControls(); 
    
    // This effect manages the browser's back button behavior.
    const handlePopState = (event: PopStateEvent) => {
        // When the user navigates back, trigger the exit function.
        event.preventDefault(); 
        handleExit();
    };

    // Push a new state to the history when entering deep focus.
    if (window.history.state?.page !== 'deepFocus') {
        window.history.pushState({ page: 'deepFocus' }, '');
    }
    // Add the listener for the back button.
    window.addEventListener('popstate', handlePopState);

    return () => {
      if (isSupported) release();
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
      if (dimTimeoutRef.current) clearTimeout(dimTimeoutRef.current);
      
      // Clean up the history listener.
      window.removeEventListener('popstate', handlePopState);
      
      // If we are still on the deep focus page in history, go back one step.
      if (window.history.state?.page === 'deepFocus') {
          try {
            window.history.back();
          } catch(e) {
            // This can fail if the history stack is empty.
          }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        e.preventDefault();
        showControls();
        isActive ? pause() : start();
      }
      if(e.key === 'Escape') {
        handleExit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showControls, isActive, pause, start, handleExit]);

  useEffect(() => {
    if (!antiBurnIn) return;
    const shiftPixel = () => {
      const maxJitterX = window.innerWidth > 480 ? 20 : 10;
      const maxJitterY = window.innerHeight > 270 ? 20 : 10;
      const x = Math.floor(Math.random() * (maxJitterX * 2 + 1)) - maxJitterX;
      const y = Math.floor(Math.random() * (maxJitterY * 2 + 1)) - maxJitterY;
      pixelShiftControls.start({
        x,
        y,
        transition: { duration: 1, ease: 'easeOut' },
      });
    };
    pixelShiftControls.set({ x: 0, y: 0 });
    const intervalId = setInterval(shiftPixel, 60000);
    return () => clearInterval(intervalId);
  }, [pixelShiftControls, antiBurnIn]);

  const handleContainerClick = () => {
    showControls();
  };
  
  const uiColor = theme === 'dark' ? 'white' : 'hsl(var(--primary))';
  const bgColorClass = theme === 'dark' ? 'bg-white/10 hover:bg-white/20' : 'bg-primary/10 hover:bg-primary/20';

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center cursor-pointer"
      onClick={handleContainerClick}
    >
      <motion.div
        animate={pixelShiftControls}
        className={cn(
          'relative flex flex-col items-center justify-center gap-8 transition-opacity duration-1000',
          isDimmed ? 'opacity-30' : 'opacity-100'
        )}
      >
        <div className="relative w-[320px] h-[180px] md:w-[480px] md:h-[270px] flex items-center justify-center">
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 480 270"
            fill="none"
          >
            <path
              d="M240,1.5 h223.5 a15,15 0 0 1 15,15 v237 a15,15 0 0 1 -15,15 h-447 a15,15 0 0 1 -15,-15 v-237 a15,15 0 0 1 15,-15 Z"
              stroke={uiColor}
              strokeOpacity="0.1"
              strokeWidth="6"
            />
            <motion.path
                ref={pathRef}
                d="M240,1.5 h223.5 a15,15 0 0 1 15,15 v237 a15,15 0 0 1 -15,15 h-447 a15,15 0 0 1 -15,-15 v-237 a15,15 0 0 1 15,-15 Z"
                stroke={uiColor}
                strokeWidth="6"
                strokeDasharray={pathLength}
                strokeDashoffset={strokeDashoffset}
                initial={false}
                transition={{ duration: 1, ease: 'linear' }}
            />
          </svg>

          <div className="relative z-10 flex flex-col items-center justify-center">
            <div 
              className="text-7xl md:text-8xl font-thin tracking-tighter tabular-nums"
              style={{ color: uiColor }}
            >
              {formatTime(timeLeft)}
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={controlsAnimation}
        className="absolute bottom-8 sm:bottom-10 flex items-center gap-2"
        style={{ pointerEvents: controlsVisible ? 'auto' : 'none' }}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={handleExit}
          className={cn("w-14 h-14 rounded-full backdrop-blur-sm", bgColorClass)}
          style={{ color: uiColor }}
        >
          <ArrowLeft className="w-7 h-7" />
        </Button>

        {isActive ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSubtractTime}
            className={cn("w-14 h-14 rounded-full backdrop-blur-sm", bgColorClass)}
            style={{ color: uiColor }}
          >
            <Minus className="w-7 h-7" />
          </Button>
        ) : (
           <Button
            variant="ghost"
            size="icon"
            onClick={handleEndAndSave}
            className={cn("w-14 h-14 rounded-full backdrop-blur-sm", bgColorClass)}
            style={{ color: uiColor }}
          >
            <RotateCcw className="w-6 h-6" />
          </Button>
        )}
        
        <Button
          onClick={handleTogglePlay}
          variant="ghost"
          size="icon"
          className={cn("w-16 h-16 rounded-full backdrop-blur-sm", theme === 'dark' ? 'bg-white/20 hover:bg-white/30' : 'bg-primary/20 hover:bg-primary/30')}
          style={{ color: uiColor }}
        >
          {isActive ? (
            <Pause className="w-9 h-9" />
          ) : (
            <Play className="w-9 h-9 ml-1" />
          )}
        </Button>

        {isActive ? (
            <Button
                variant="ghost"
                size="icon"
                onClick={handleAddTime}
                className={cn("w-14 h-14 rounded-full backdrop-blur-sm", bgColorClass)}
                style={{ color: uiColor }}
            >
            <Plus className="w-7 h-7" />
            </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggleTheme}
            className={cn("w-14 h-14 rounded-full backdrop-blur-sm", bgColorClass)}
            style={{ color: uiColor }}
          >
            {theme === 'dark' ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
          </Button>
        )}

        <div className="w-14 h-14" />
      </motion.div>
    </div>
  );
}

