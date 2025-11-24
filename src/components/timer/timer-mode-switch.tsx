'use client';

import { useTimerStore, TimerMode } from '@/store/timer-store';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const modes: { id: TimerMode; label: string }[] = [
  { id: 'pomodoro', label: 'Pomodoro' },
  { id: 'shortBreak', label: 'Short Break' },
  { id: 'longBreak', label: 'Long Break' },
];

export function TimerModeSwitch() {
  const { mode, setMode, isActive } = useTimerStore();

  const handleModeChange = (newMode: string) => {
    if (!isActive) {
      setMode(newMode as TimerMode);
    }
  };

  return (
    <Tabs value={mode} onValueChange={handleModeChange} className="w-full max-w-xs">
      <TabsList className="grid w-full grid-cols-3">
        {modes.map(modeItem => (
          <TabsTrigger
            key={modeItem.id}
            value={modeItem.id}
            disabled={isActive}
            className="text-xs sm:text-sm"
          >
            {modeItem.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
