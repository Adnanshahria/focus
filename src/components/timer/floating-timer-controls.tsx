'use client';

import { useState, ChangeEvent } from 'react';
import { motion, AnimationProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { Play, Pause, ArrowLeft, Plus, Minus, XCircle, CheckCircle, Moon, Sun, Clock } from 'lucide-react';
import { Loader } from '@/components/ui/loader';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FloatingTimerControlsProps {
  theme: 'dark' | 'light';
  controlsAnimationProps: AnimationProps;
  controlsVisible: boolean;
  isActive: boolean;
  isPristine: boolean;
  isSaving: boolean;
  onExit: (event: React.MouseEvent) => void;
  onSubtractTime: (event: React.MouseEvent) => void;
  onTogglePlay: (event: React.MouseEvent) => void;
  onAddTime: (event: React.MouseEvent) => void;
  onCancel: (event: React.MouseEvent) => void;
  onEndAndSave: (event: React.MouseEvent) => void;
  onToggleTheme: (event: React.MouseEvent) => void;
  onSetSessionTime: (seconds: number) => void;
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
  onSetSessionTime,
}: FloatingTimerControlsProps) => {
  const uiColor = theme === 'dark' ? 'white' : 'hsl(var(--primary))';
  const bgColorClass = theme === 'dark' ? 'bg-white/10 hover:bg-white/20' : 'bg-primary/10 hover:bg-primary/20';

  const [isTimePopupOpen, setIsTimePopupOpen] = useState(false);
  const [customMinutes, setCustomMinutes] = useState(25);

  const handleSetTime = () => {
    onSetSessionTime(customMinutes * 60);
    setIsTimePopupOpen(false);
  };

  const handleOpenPopup = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsTimePopupOpen(true);
  };

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

          {/* Minus Button for Custom Time */}
          <Popover open={isTimePopupOpen} onOpenChange={setIsTimePopupOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" onClick={handleOpenPopup} className={cn("w-12 h-12 rounded-full backdrop-blur-sm", bgColorClass)} style={{ color: uiColor }}>
                <Clock className="w-7 h-7" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-60 p-4" side="top">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Set Duration</h4>
                  <p className="text-sm text-muted-foreground">
                    Set timer duration in minutes.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    min="1"
                    value={customMinutes}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setCustomMinutes(Number(e.target.value))}
                  />
                  <Button onClick={handleSetTime}>Set</Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Button onClick={onTogglePlay} variant="ghost" size="icon" className={cn("w-16 h-16 rounded-full backdrop-blur-sm", theme === 'dark' ? 'bg-white/20 hover:bg-white/30' : 'bg-primary/20 hover:bg-primary/30')} style={{ color: uiColor }}>
            <Play className="w-9 h-9 ml-1" />
          </Button>

          {/* Plus Button to add time */}
          <Button variant="ghost" size="icon" onClick={onAddTime} className={cn("w-12 h-12 rounded-full backdrop-blur-sm", bgColorClass)} style={{ color: uiColor }}>
            <Plus className="w-7 h-7" />
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
