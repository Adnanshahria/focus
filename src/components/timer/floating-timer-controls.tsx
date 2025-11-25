'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { Play, Pause, ArrowLeft, Plus, Minus, XCircle, CheckCircle, Moon, Sun, Loader } from 'lucide-react';

interface FloatingTimerControlsProps {
  theme: 'dark' | 'light';
  controlsAnimation: any;
  controlsVisible: boolean;
  isActive: boolean;
  isPristine: boolean;
  isSaving: boolean;
  handleExit: (e: React.MouseEvent) => void;
  handleSubtractTime: (e: React.MouseEvent) => void;
  handleTogglePlay: (e: React.MouseEvent) => void;
  handleAddTime: (e: React.MouseEvent) => void;
  handleCancel: (e: React.MouseEvent) => void;
  handleEndAndSave: (e: React.MouseEvent) => void;
  handleToggleTheme: (e: React.MouseEvent) => void;
}

export const FloatingTimerControls = ({
  theme,
  controlsAnimation,
  controlsVisible,
  isActive,
  isPristine,
  isSaving,
  handleExit,
  handleSubtractTime,
  handleTogglePlay,
  handleAddTime,
  handleCancel,
  handleEndAndSave,
  handleToggleTheme,
}: FloatingTimerControlsProps) => {
  const uiColor = theme === 'dark' ? 'white' : 'hsl(var(--primary))';
  const bgColorClass = theme === 'dark' ? 'bg-white/10 hover:bg-white/20' : 'bg-primary/10 hover:bg-primary/20';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={controlsAnimation}
      className="absolute bottom-8 sm:bottom-10 flex items-center gap-2"
      style={{ pointerEvents: controlsVisible ? 'auto' : 'none' }}
    >
      <Button variant="ghost" size="icon" onClick={handleExit} className={cn("w-12 h-12 rounded-full backdrop-blur-sm", bgColorClass)} style={{ color: uiColor }}>
        <ArrowLeft className="w-6 h-6" />
      </Button>
      
      {isActive ? (
        <>
          <Button variant="ghost" size="icon" onClick={handleSubtractTime} className={cn("w-12 h-12 rounded-full backdrop-blur-sm", bgColorClass)} style={{ color: uiColor }}>
            <Minus className="w-7 h-7" />
          </Button>
          <Button onClick={handleTogglePlay} variant="ghost" size="icon" className={cn("w-16 h-16 rounded-full backdrop-blur-sm", theme === 'dark' ? 'bg-white/20 hover:bg-white/30' : 'bg-primary/20 hover:bg-primary/30')} style={{ color: uiColor }}>
            <Pause className="w-9 h-9" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleAddTime} className={cn("w-12 h-12 rounded-full backdrop-blur-sm", bgColorClass)} style={{ color: uiColor }}>
            <Plus className="w-7 h-7" />
          </Button>
        </>
      ) : (
        <>
          <Button variant="ghost" size="icon" onClick={handleCancel} disabled={isPristine} className={cn("w-12 h-12 rounded-full backdrop-blur-sm", bgColorClass)} style={{ color: uiColor }}>
            <XCircle className="w-6 h-6" />
          </Button>
           <Button onClick={handleTogglePlay} variant="ghost" size="icon" className={cn("w-16 h-16 rounded-full backdrop-blur-sm", theme === 'dark' ? 'bg-white/20 hover:bg-white/30' : 'bg-primary/20 hover:bg-primary/30')} style={{ color: uiColor }}>
            <Play className="w-9 h-9 ml-1" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleEndAndSave} disabled={isPristine || isSaving} className={cn("w-12 h-12 rounded-full backdrop-blur-sm", bgColorClass)} style={{ color: uiColor }}>
            {isSaving ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}><Loader className="w-6 h-6" /></motion.div> : <CheckCircle className="w-6 h-6" />}
          </Button>
        </>
      )}

      <Button variant="ghost" size="icon" onClick={handleToggleTheme} className={cn("w-12 h-12 rounded-full backdrop-blur-sm", bgColorClass)} style={{ color: uiColor }}>
        {theme === 'dark' ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
      </Button>
    </motion.div>
  );
};
