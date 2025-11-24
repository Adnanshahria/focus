'use client';

import { useTimerStore, TimerMode } from '@/store/timer-store';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const modes: { id: TimerMode; label: string }[] = [
  { id: 'pomodoro', label: 'Pomodoro' },
  { id: 'shortBreak', label: 'Short Break' },
  { id: 'longBreak', label: 'Long Break' },
];

export function TimerModeSwitch() {
  const { mode, setMode, isActive } = useTimerStore();

  return (
    <div className="flex items-center justify-center p-1 rounded-full bg-muted w-full">
      {modes.map(modeItem => (
        <Button
          key={modeItem.id}
          onClick={() => !isActive && setMode(modeItem.id)}
          disabled={isActive}
          variant="ghost"
          size="sm"
          className={cn(
            'rounded-full px-4 py-1 text-sm font-medium transition-colors w-full',
            mode === modeItem.id
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:bg-background/50 hover:text-foreground'
          )}
        >
          {modeItem.label}
        </Button>
      ))}
    </div>
  );
}
