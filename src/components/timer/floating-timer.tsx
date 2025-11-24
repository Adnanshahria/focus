'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useTimer, useTimerStore } from '@/hooks/use-timer';
import { cn } from '@/lib/utils';
import { useWakeLock } from '@/hooks/use-wakelock';
import { Button } from '../ui/button';
import { Play, Pause, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  if (hours > 0) {
    return `${String(hours)}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

export function FloatingTimer() {
  const router = useRouter();
  const { timeLeft, isActive, start, pause, pomodoroDuration, shortBreakDuration, longBreakDuration, mode } = useTimer();
  const { antiBurnIn } = useTimerStore();

  const [controlsVisible, setControlsVisible] = useState(false);
  const [isDimmed, setIsDimmed] = useState(false);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dimTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const controlsAnimation = useAnimation();
  const pixelShiftControls = useAnimation();
  const { isSupported, request, release } = useWakeLock();
  const containerRef = useRef<HTMLDivElement>(null);

  const getDuration = () => {
    switch (mode) {
      case "pomodoro": return pomodoroDuration;
      case "shortBreak": return shortBreakDuration;
      case "longBreak": return longBreakDuration;
      default: return pomodoroDuration;
    }
  }

  const duration = getDuration();
  const progress = duration > 0 ? ((duration - timeLeft) / duration) * 100 : 0;

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
    router.push('/');
  }, [router]);

  useEffect(() => {
    if (isSupported) request();
    showControls(); // Show controls on mount
    
    return () => {
      if (isSupported) release();
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
      if (dimTimeoutRef.current) clearTimeout(dimTimeoutRef.current);
    };
  }, [isSupported, request, release, showControls]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        e.preventDefault();
        showControls();
        isActive ? pause() : start();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showControls, isActive, pause, start]);

  useEffect(() => {
    if (!antiBurnIn) return;
    const shiftPixel = () => {
      if(!containerRef.current) return;
      const { clientWidth, clientHeight } = containerRef.current;
      const maxJitterX = clientWidth > 480 ? 20 : 10;
      const maxJitterY = clientHeight > 270 ? 20 : 10;
      const x = Math.floor(Math.random() * (maxJitterX * 2 + 1)) - maxJitterX;
      const y = Math.floor(Math.random() * (maxJitterY * 2 + 1)) - maxJitterY;
      pixelShiftControls.start({ x, y, transition: { duration: 1, ease: 'easeOut' } });
    };
    pixelShiftControls.set({ x: 0, y: 0 });
    const intervalId = setInterval(shiftPixel, 60000);
    return () => clearInterval(intervalId);
  }, [pixelShiftControls, antiBurnIn]);


  const handleContainerClick = () => {
    showControls();
  }

  return (
    <div ref={containerRef} className="fixed inset-0 bg-black flex flex-col items-center justify-center cursor-pointer" onClick={handleContainerClick}>
        <motion.div
            animate={pixelShiftControls}
            className={cn(
                "relative flex flex-col items-center justify-center gap-8 transition-opacity duration-1000",
                isDimmed ? "opacity-30" : "opacity-100"
            )}
        >
            <div className="relative w-[320px] h-[180px] md:w-[480px] md:h-[270px] flex items-center justify-center">
                 <div 
                    className="absolute inset-0 bg-black/30 backdrop-blur-xl rounded-2xl" 
                    style={{ 
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                 />
                 <motion.div
                    className="absolute inset-0 rounded-2xl"
                    style={{
                        padding: '1px',
                        background: `linear-gradient(to right, white, white) no-repeat`,
                        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                        WebkitMaskComposite: 'xor',
                        maskComposite: 'exclude',
                    }}
                    initial={{ backgroundSize: '0% 100%'}}
                    animate={{ backgroundSize: `${progress}% 100%` }}
                    transition={{ duration: 1, ease: "linear" }}
                 />
                <div className="relative z-10 flex flex-col items-center justify-center">
                    <div className="text-white text-7xl md:text-8xl font-thin tracking-tighter tabular-nums">
                        {formatTime(timeLeft)}
                    </div>
                </div>
            </div>
        </motion.div>

        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={controlsAnimation}
            className="absolute bottom-10 flex items-center gap-4"
            style={{ pointerEvents: controlsVisible ? 'auto' : 'none' }}
        >
            <Button variant="ghost" size="icon" onClick={handleExit} className="w-16 h-16 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm">
                <ArrowLeft className="w-8 h-8"/>
            </Button>
            <Button
                onClick={(e) => {
                    e.stopPropagation();
                    isActive ? pause() : start()
                }}
                variant="ghost"
                size="icon"
                className="w-20 h-20 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
            >
                {isActive ? <Pause className="w-10 h-10"/> : <Play className="w-10 h-10 ml-1"/>}
            </Button>
        </motion.div>
    </div>
  );
}
