'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTimerStore } from '@/store/timer-store';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '../ui/skeleton';
import { useUserPreferences } from '@/hooks/use-user-preferences.tsx';

const timerSettingsSchema = z.object({
  pomodoroDuration: z.coerce.number().min(1, "Must be at least 1 minute"),
  shortBreakDuration: z.coerce.number().min(1, "Must be at least 1 minute").max(30),
  longBreakDuration: z.coerce.number().min(1, "Must be at least 1 minute").max(60),
});

type TimerSettingsFormValues = z.infer<typeof timerSettingsSchema>;

export function TimerSettings() {
  const { toast } = useToast();
  const setDurations = useTimerStore(state => state.setDurations);
  const { preferences, isLoading, updatePreferences } = useUserPreferences();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<TimerSettingsFormValues>();

  useEffect(() => {
    if (preferences) {
      const formValues = {
        pomodoroDuration: (preferences.pomodoroDuration || 25 * 60) / 60,
        shortBreakDuration: (preferences.shortBreakDuration || 5 * 60) / 60,
        longBreakDuration: (preferences.longBreakDuration || 15 * 60) / 60,
      };
      reset(formValues);
      setDurations({
        pomodoroDuration: formValues.pomodoroDuration * 60,
        shortBreakDuration: formValues.shortBreakDuration * 60,
        longBreakDuration: formValues.longBreakDuration * 60,
      });
    }
  }, [preferences, reset, setDurations]);

  const onSubmit = (data: TimerSettingsFormValues) => {
    const newDurationsInSeconds = {
      pomodoroDuration: data.pomodoroDuration * 60,
      shortBreakDuration: data.shortBreakDuration * 60,
      longBreakDuration: data.longBreakDuration * 60,
    };
    
    updatePreferences(newDurationsInSeconds);
    toast({
      title: 'Settings Saved',
      description: 'Your timer durations have been updated.',
    });
    reset(data);
  };
  
  if (isLoading) {
      return (
        <div className="space-y-4">
            <div className="space-y-2"> <Skeleton className="h-4 w-24" /> <Skeleton className="h-10 w-full" /> </div>
            <div className="space-y-2"> <Skeleton className="h-4 w-24" /> <Skeleton className="h-10 w-full" /> </div>
            <div className="space-y-2"> <Skeleton className="h-4 w-24" /> <Skeleton className="h-10 w-full" /> </div>
            <Skeleton className="h-10 w-full" />
        </div>
      );
  }

  return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="pomodoroDuration">Pomodoro (minutes)</Label>
          <Input id="pomodoroDuration" type="number" {...register('pomodoroDuration')} />
          {errors.pomodoroDuration && <p className="text-destructive text-xs">{errors.pomodoroDuration.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="shortBreakDuration">Short Break (minutes)</Label>
          <Input id="shortBreakDuration" type="number" {...register('shortBreakDuration')} />
          {errors.shortBreakDuration && <p className="text-destructive text-xs">{errors.shortBreakDuration.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="longBreakDuration">Long Break (minutes)</Label>
          <Input id="longBreakDuration" type="number" {...register('longBreakDuration')} />
          {errors.longBreakDuration && <p className="text-destructive text-xs">{errors.longBreakDuration.message}</p>}
        </div>
        <Button type="submit" disabled={isSubmitting || !isDirty} className="w-full">
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
  );
}
