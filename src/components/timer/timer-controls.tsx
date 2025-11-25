"use client";

import { useTimer } from "@/hooks/use-timer";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Plus, Minus } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function TimerControls() {
  const { isActive, start, pause, reset, addTime, subtractTime } = useTimer();

  const handleAddTime = () => {
    addTime(3 * 60); // Add 3 minutes
  };
  
  const handleSubtractTime = () => {
    subtractTime(3 * 60); // Subtract 3 minutes
  };

  return (
    <div className="flex items-center justify-center w-full gap-2">
      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
        <Button onClick={handleSubtractTime} size="icon" variant="ghost" className="rounded-full w-14 h-14 text-muted-foreground hover:text-foreground">
          <Minus />
        </Button>
      </motion.div>
      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
        <Button onClick={reset} size="icon" variant="ghost" className="rounded-full w-14 h-14 text-muted-foreground hover:text-foreground">
          <RotateCcw />
        </Button>
      </motion.div>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          onClick={isActive ? pause : start}
          size="lg"
          className={cn(
            "rounded-full w-28 h-14 text-lg font-bold uppercase tracking-wider transition-all duration-300",
            "text-background shadow-[0_0_20px_hsl(var(--primary)/0.4)]",
            isActive 
              ? "bg-secondary hover:bg-secondary/90 text-secondary-foreground" 
              : "bg-primary hover:bg-primary/90"
          )}
        >
          {isActive ? <Pause className="mr-2" /> : <Play className="mr-2" />}
          {isActive ? "Pause" : "Start"}
        </Button>
      </motion.div>
      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
        <Button onClick={handleAddTime} size="icon" variant="ghost" className="rounded-full w-14 h-14 text-muted-foreground hover:text-foreground">
          <Plus />
        </Button>
      </motion.div>
    </div>
  );
}
