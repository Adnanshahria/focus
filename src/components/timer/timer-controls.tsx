"use client";

import { useTimer } from "@/hooks/use-timer";
import { Button } from "@/components/ui/button";
import { Play, Pause, Clock, Plus, Minus } from "lucide-react";
import { Loader } from "@/components/ui/loader";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { useState, ChangeEvent } from "react";

export function TimerControls() {
  const { isActive, start, pause, endAndSaveSession, resetSession, timeLeft, sessionDuration, isSaving, setSessionTime, addTime, subtractTime } = useTimer();
  const [isTimePopupOpen, setIsTimePopupOpen] = useState(false);
  const [customMinutes, setCustomMinutes] = useState(25);

  const handleEndAndSave = () => endAndSaveSession();
  const handleCancel = () => resetSession();
  const handleTogglePlay = () => isActive ? pause() : start();

  const isPristine = timeLeft === sessionDuration && !isActive;

  const handleSetTime = () => {
    setSessionTime(customMinutes * 60);
    setIsTimePopupOpen(false);
  };

  const handleAddTime = () => addTime(5 * 60);
  const handleSubtractTime = () => subtractTime(5 * 60);

  return (
    <div className="flex flex-col items-center justify-center w-full gap-6">
      <div className="flex items-center gap-4">
        {/* Subtract Time Button */}
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSubtractTime}
            className="w-10 h-10 rounded-full bg-secondary/20 hover:bg-secondary/30 text-secondary-foreground"
          >
            <Minus className="w-5 h-5" />
          </Button>
        </motion.div>

        {isActive ? (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handleTogglePlay}
              size="lg"
              className={cn(
                "rounded-full w-24 h-24 flex items-center justify-center transition-all duration-300",
                "bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-[0_0_30px_hsl(var(--secondary)/0.3)]"
              )}
            >
              <Pause className="w-10 h-10 fill-current" />
            </Button>
          </motion.div>
        ) : (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handleTogglePlay}
              size="lg"
              className={cn(
                "rounded-full w-24 h-24 flex items-center justify-center transition-all duration-300",
                "bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_30px_hsl(var(--primary)/0.4)]"
              )}
            >
              <Play className="w-10 h-10 fill-current ml-1" />
            </Button>
          </motion.div>
        )}

        {/* Add Time Button */}
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleAddTime}
            className="w-10 h-10 rounded-full bg-secondary/20 hover:bg-secondary/30 text-secondary-foreground"
          >
            <Plus className="w-5 h-5" />
          </Button>
        </motion.div>
      </div>

      {!isActive && (
        <div className="flex items-center gap-3">
          {/* Set Time Popover */}
          <Popover open={isTimePopupOpen} onOpenChange={setIsTimePopupOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground gap-2">
                <Clock className="w-4 h-4" />
                Set Time
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

          <div className="h-4 w-px bg-border" />

          <Button onClick={handleEndAndSave} size="sm" variant="ghost" className="text-muted-foreground hover:text-foreground" disabled={isPristine || isSaving}>
            {isSaving ? <><Loader className="animate-spin mr-2 w-4 h-4" /> Saving...</> : 'End & Save'}
          </Button>

          <div className="h-4 w-px bg-border" />

          <Button onClick={handleCancel} size="sm" variant="ghost" className="text-muted-foreground hover:text-foreground" disabled={isPristine}>
            Cancel
          </Button>
        </div>
      )}

      {isActive && (
        <Button onClick={handleEndAndSave} size="sm" variant="ghost" className="text-muted-foreground hover:text-foreground mt-2" disabled={isSaving}>
          {isSaving ? <><Loader className="animate-spin mr-2 w-4 h-4" /> Saving...</> : 'End Session'}
        </Button>
      )}
    </div>
  );
}
