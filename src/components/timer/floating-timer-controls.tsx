'use client';

import { motion, AnimationProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { Play, Pause, ArrowLeft, Plus, Minus, XCircle, CheckCircle, Moon, Sun, Loader } from 'lucide-react';

interface FloatingTimerControlsProps {
  theme: 'dark' | 'light';
  controlsAnimationProps: AnimationProps;
  controlsVisible: boolean;
  isActive: boolean;
  isPristine: boolean;
  isSaving: boolean;
  onExit: (e: React.MouseEvent) => void;
  onSubtractTime: (e: React.MouseEvent) => void;
  onTogglePlay: (e: React.MouseEvent) => void;
  onAddTime: (e: React.MouseEvent) => void;
  onCancel: (e: React.MouseEvent) => void;
  onEndAndSave: (e: React.MouseEvent) => void;
  onToggleTheme: (e: React.MouseEvent) => void;
}

export const FloatingTimerControls = ({
  theme,
  controlsAnimationProps,
  controlsVisible,
  isActive,
  isPristine,
  isSaving,
  onExit,
  onSubtractTime,
  onTogglePlay,
  onAddTime,
  onCancel,
  onEndAndSave,
  onToggleTheme,
}: FloatingTimerControlsProps) => {
  const uiColor = theme === 'dark' ? 'white' : 'hsl(var(--primary))';
  const bgColorClass = theme === 'dark' ? 'bg-white/10 hover:bg-white/20' : 'bg-primary/10 hover:bg-primary/20';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={controlsAnimationProps}
      className="absolute bottom-8 sm:bottom-10 flex items-center gap-2"
      style={{ pointerEvents: controlsVisible ? 'auto' : 'none' }}
    >
      <Button variant="ghost" size="icon" onClick={onExit} className={cn("w-12 h-12 rounded-full backdrop-blur-sm", bgColorClass)} style={{ color: uiColor }}>
        <ArrowLeft className="w-6 h-6" />
      </Button>
      
      {isActive ? (
        <>
          <Button variant="ghost" size="icon" onClick={onSubtractTime} className={cn("w-12 h-12 rounded-full backdrop-blur-sm", bgColorClass)} style={{ color: uiColor }}>
            <Minus className="w-7 h-7" />
          </Button>
          <Button onClick={onTogglePlay} variant="ghost" size="icon" className={cn("w-16 h-16 rounded-full backdrop-blur-sm", theme === 'dark' ? 'bg-white/20 hover:bg-white/30' : 'bg-primary/20 hover:bg-primary/30')} style={{ color: uiColor }}>
            <Pause className="w-9 h-9" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onAddTime} className={cn("w-12 h-12 rounded-full backdrop-blur-sm", bgColorClass)} style={{ color: uiColor }}>
            <Plus className="w-7 h-7" />
          </Button>
        </>
      ) : (
        <>
          <Button variant="ghost" size="icon" onClick={onCancel} disabled={isPristine} className={cn("w-12 h-12 rounded-full backdrop-blur-sm", bgColorClass)} style={{ color: uiColor }}>
            <XCircle className="w-6 h-6" />
          </Button>
           <Button onClick={onTogglePlay} variant="ghost" size="icon" className={cn("w-16 h-16 rounded-full backdrop-blur-sm", theme === 'dark' ? 'bg-white/20 hover:bg-white/30' : 'bg-primary/20 hover:bg-primary/30')} style={{ color: uiColor }}>
            <Play className="w-9 h-9 ml-1" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onEndAndSave} disabled={isPristine || isSaving} className={cn("w-12 h-12 rounded-full backdrop-blur-sm", bgColorClass)} style={{ color: uiColor }}>
            {isSaving ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}><Loader className="w-6 h-6" /></motion.div> : <CheckCircle className="w-6 h-6" />}
          </Button>
        </>
      )}

      <Button variant="ghost" size="icon" onClick={onToggleTheme} className={cn("w-12 h-12 rounded-full backdrop-blur-sm", bgColorClass)} style={{ color: uiColor }}>
        {theme === 'dark' ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
      </Button>
    </motion.div>
  );
};
