'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTimerStore, TimerDurations } from '@/store/timer-store';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, collection } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '../ui/skeleton';

const timerSettingsSchema = z.object({
  pomodoroDuration: z.coerce.number().min(1, "Must be at least 1 minute"),
  shortBreakDuration: z.coerce.number().min(1, "Must be at least 1 minute").max(30),
  longBreakDuration: z.coerce.number().min(1, "Must be at least 1 minute").max(60),
});

type TimerSettingsFormValues = z.infer<typeof timerSettingsSchema>;

export function TimerSettings() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const setDurations = useTimerStore(state => state.setDurations);
  const durations = useTimerStore(state => ({
    pomodoroDuration: state.pomodoroDuration / 60,
    shortBreakDuration: state.shortBreakDuration / 60,
    longBreakDuration: state.longBreakDuration / 60,
  }));

  const userPreferencesRef = useMemoFirebase(() => {
    if (!user || user.isAnonymous) return null;
    const prefCollection = collection(firestore, `users/${user.uid}/userPreferences`);
    return doc(prefCollection, 'main');
  }, [user, firestore]);
  
  const { data: preferences, isLoading } = useDoc<TimerDurations>(userPreferencesRef);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<TimerSettingsFormValues>({
    resolver: zodResolver(timerSettingsSchema),
    defaultValues: durations,
  });

  useEffect(() => {
    if (preferences) {
      const remoteDurations = {
        pomodoroDuration: preferences.pomodoroDuration ? preferences.pomodoroDuration / 60 : 25,
        shortBreakDuration: preferences.shortBreakDuration ? preferences.shortBreakDuration / 60 : 5,
        longBreakDuration: preferences.longBreakDuration ? preferences.longBreakDuration / 60 : 15,
      };
      reset(remoteDurations);
      
      const storeDurations = {
        pomodoroDuration: remoteDurations.pomodoroDuration * 60,
        shortBreakDuration: remoteDurations.shortBreakDuration * 60,
        longBreakDuration: remoteDurations.longBreakDuration * 60,
      };
      setDurations(storeDurations);

    } else {
        const defaultDurations = {
          pomodoroDuration: 25,
          shortBreakDuration: 5,
          longBreakDuration: 15,
        }
        reset(defaultDurations);
    }
  }, [preferences, reset, setDurations]);

  const onSubmit = (data: TimerSettingsFormValues) => {
    if (!userPreferencesRef) {
        toast({ variant: 'destructive', title: 'Not Logged In', description: 'You must be logged in to save settings.'});
        return;
    };
    
    const newDurationsInSeconds = {
      id: 'main', // Add id to satisfy security rules
      pomodoroDuration: data.pomodoroDuration * 60,
      shortBreakDuration: data.shortBreakDuration * 60,
      longBreakDuration: data.longBreakDuration * 60,
    };

    setDocumentNonBlocking(userPreferencesRef, newDurationsInSeconds, { merge: true });
    setDurations(newDurationsInSeconds);
    
    toast({
      title: 'Settings Saved',
      description: 'Your timer durations have been updated.',
    });
    reset(data); // Resets the dirty state
  };
  
  if (isLoading && user && !user.isAnonymous) {
      return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-10 w-full" />
        </div>
      );
  }

  const isAnon = !user || user.isAnonymous;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="pomodoroDuration">Pomodoro (minutes)</Label>
        <Input id="pomodoroDuration" type="number" {...register('pomodoroDuration')} disabled={isAnon}/>
        {errors.pomodoroDuration && <p className="text-destructive text-xs">{errors.pomodoroDuration.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="shortBreakDuration">Short Break (minutes)</Label>
        <Input id="shortBreakDuration" type="number" {...register('shortBreakDuration')} disabled={isAnon}/>
        {errors.shortBreakDuration && <p className="text-destructive text-xs">{errors.shortBreakDuration.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="longBreakDuration">Long Break (minutes)</Label>
        <Input id="longBreakDuration" type="number" {...register('longBreakDuration')} disabled={isAnon}/>
        {errors.longBreakDuration && <p className="text-destructive text-xs">{errors.longBreakDuration.message}</p>}
      </div>
      <Button type="submit" disabled={isSubmitting || !isDirty || isAnon} className="w-full">
        {isSubmitting ? 'Saving...' : isAnon ? 'Log in to Save' : 'Save Changes'}
      </Button>
    </form>
  );
}
