"use client";

import { useTimer } from "@/hooks/use-timer";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Plus, Minus } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function TimerControls() {
  const { isActive, start, pause, addTime, subtractTime, endAndSaveSession, timeLeft, sessionDuration } = useTimer();

  const handleAddTime = () => addTime(3 * 60);
  const handleSubtractTime = () => subtractTime(3 * 60);
  const handleEndAndSave = () => endAndSaveSession();
  const handleTogglePlay = () => isActive ? pause() : start();
  
  const isPristine = timeLeft === sessionDuration && !isActive;

  return (
    <div className="flex items-center justify-center w-full gap-2">
      {!isActive ? (
        <>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Button onClick={handleEndAndSave} size="icon" variant="ghost" className="rounded-full w-14 h-14 text-muted-foreground hover:text-foreground" disabled={isPristine}>
                <RotateCcw />
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
              onClick={handleTogglePlay}
              size="lg"
              className={cn(
                  "rounded-full w-28 h-14 text-lg font-bold uppercase tracking-wider transition-all duration-300",
                  "text-background shadow-[0_0_20px_hsl(var(--primary)/0.4)]",
                  "bg-primary hover:bg-primary/90"
              )}
              >
              <Play className="mr-2" />
              {isPristine ? 'Start' : 'Resume'}
              </Button>
          </motion.div>
          <div className="w-14 h-14"></div>
        </>
      ) : (
        <>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Button onClick={handleSubtractTime} size="icon" variant="ghost" className="rounded-full w-14 h-14 text-muted-foreground hover:text-foreground">
              <Minus />
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handleTogglePlay}
              size="lg"
              className={cn(
                  "rounded-full w-28 h-14 text-lg font-bold uppercase tracking-wider transition-all duration-300",
                  "bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-[0_0_20px_hsl(var(--primary)/0.2)]"
              )}
            >
              <Pause className="mr-2" />
              Pause
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Button onClick={handleAddTime} size="icon" variant="ghost" className="rounded-full w-14 h-14 text-muted-foreground hover:text-foreground">
              <Plus />
            </Button>
          </motion.div>
        </>
      )}
    </div>
  );
}
