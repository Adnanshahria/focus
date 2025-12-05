'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format, set } from 'date-fns';
import { addRecordSchema, AddRecordFormValues } from './add-record-schema';
import { CalendarIcon, Clock, Timer, Plus, Minus, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/firebase';
import { useFirestore } from '@/firebase/hooks/hooks';
import { doc, collection, runTransaction, Timestamp } from 'firebase/firestore';
import { Slider } from '@/components/ui/slider';

interface AddFocusRecordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const QUICK_DURATIONS = [15, 25, 30, 45, 60, 90];

export function AddFocusRecordDialog({ open, onOpenChange }: AddFocusRecordDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  const now = new Date();
  const currentHour = now.getHours();

  const { handleSubmit, control, reset, watch, setValue, formState: { errors } } = useForm<AddRecordFormValues>({
    resolver: zodResolver(addRecordSchema),
    defaultValues: {
      date: now,
      hour: currentHour % 12 === 0 ? 12 : currentHour % 12,
      minute: Math.floor(now.getMinutes() / 5) * 5,
      ampm: currentHour >= 12 ? 'pm' : 'am',
      duration: 25,
    },
  });

  const duration = watch('duration');
  const selectedDate = watch('date');
  const hour = watch('hour');
  const minute = watch('minute');
  const ampm = watch('ampm');

  const onSubmit = async (data: AddRecordFormValues) => {
    if (!user || user.isAnonymous || !firestore) {
      toast({ variant: 'destructive', title: 'Authentication Error', description: 'You must be logged in.' });
      return;
    }
    setIsSubmitting(true);
    try {
      await logFocusRecord(data);
      toast({
        title: '✓ Session Logged',
        description: `Added ${data.duration} minutes of focus time.`
      });
      onOpenChange(false);
      reset();
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Failed to Add Record', description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  async function logFocusRecord(data: AddRecordFormValues) {
    if (!user || !firestore) throw new Error("User or Firestore not available");

    let hour24 = data.hour;
    if (data.ampm === 'pm' && data.hour < 12) hour24 += 12;
    if (data.ampm === 'am' && data.hour === 12) hour24 = 0;

    const dateWithTime = set(data.date, { hours: hour24, minutes: data.minute, seconds: 0, milliseconds: 0 });
    const dateString = format(dateWithTime, 'yyyy-MM-dd');

    const focusRecordRef = doc(firestore, `users/${user.uid}/focusRecords`, dateString);
    const sessionsCollectionRef = collection(focusRecordRef, 'sessions');

    await runTransaction(firestore, async (transaction) => {
      const userDocRef = doc(firestore, 'users', user.uid);
      const userDocSnap = await transaction.get(userDocRef);
      const recordSnap = await transaction.get(focusRecordRef);

      if (!userDocSnap.exists()) {
        transaction.set(userDocRef, {
          id: user.uid,
          uid: user.uid,
          email: user.email,
          createdAt: new Date().toISOString()
        });
      }

      const currentData = recordSnap.data() || { totalFocusMinutes: 0, totalPomos: 0 };
      const newTotalFocusMinutes = currentData.totalFocusMinutes + data.duration;
      const isPomodoro = data.duration >= 25;
      const newTotalPomos = currentData.totalPomos + (isPomodoro ? 1 : 0);

      const newSessionRef = doc(sessionsCollectionRef);
      transaction.set(newSessionRef, {
        id: newSessionRef.id, focusRecordId: focusRecordRef.id,
        startTime: Timestamp.fromDate(dateWithTime),
        endTime: Timestamp.fromDate(new Date(dateWithTime.getTime() + data.duration * 60000)),
        duration: data.duration, type: 'manual', completed: true,
      });

      transaction.set(focusRecordRef, {
        id: dateString, date: dateString, userId: user.uid,
        totalFocusMinutes: newTotalFocusMinutes, totalPomos: newTotalPomos
      }, { merge: true });
    });
  }

  const adjustDuration = (delta: number) => {
    const newValue = Math.max(5, Math.min(180, duration + delta));
    setValue('duration', newValue);
  };

  const formatTime = () => {
    const h = hour.toString().padStart(2, '0');
    const m = minute.toString().padStart(2, '0');
    return `${h}:${m} ${ampm.toUpperCase()}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden bg-gradient-to-b from-background to-background/95 border-primary/10">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-border/50 bg-gradient-to-r from-primary/5 to-transparent">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <div className="p-2 rounded-lg bg-primary/10">
                <Timer className="h-5 w-5 text-primary" />
              </div>
              Log Focus Session
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Record a session you completed without using the timer.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="px-6 pb-6 space-y-6">
          {/* Date & Time Row */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            {/* Date Picker */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</label>
              <Controller control={control} name="date" render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal h-12 bg-secondary/30 border-border/50 hover:bg-secondary/50',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                      {field.value ? format(field.value, 'MMM d, yyyy') : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date > new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              )} />
            </div>

            {/* Time Picker */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Start Time</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal h-12 bg-secondary/30 border-border/50 hover:bg-secondary/50"
                  >
                    <Clock className="mr-2 h-4 w-4 text-primary" />
                    {formatTime()}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-4" align="start">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <Controller control={control} name="hour" render={({ field }) => (
                        <select
                          className="flex-1 h-10 px-3 rounded-md bg-secondary border border-border/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                          value={field.value}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        >
                          {Array.from({ length: 12 }, (_, i) => i + 1).map(h => (
                            <option key={h} value={h}>{h.toString().padStart(2, '0')}</option>
                          ))}
                        </select>
                      )} />
                      <span className="text-xl font-bold text-muted-foreground">:</span>
                      <Controller control={control} name="minute" render={({ field }) => (
                        <select
                          className="flex-1 h-10 px-3 rounded-md bg-secondary border border-border/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                          value={field.value}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        >
                          {Array.from({ length: 12 }, (_, i) => i * 5).map(m => (
                            <option key={m} value={m}>{m.toString().padStart(2, '0')}</option>
                          ))}
                        </select>
                      )} />
                    </div>
                    <Controller control={control} name="ampm" render={({ field }) => (
                      <div className="flex rounded-lg overflow-hidden border border-border/50">
                        <button
                          type="button"
                          onClick={() => field.onChange('am')}
                          className={cn(
                            "flex-1 py-2 text-sm font-medium transition-colors",
                            field.value === 'am'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-secondary text-muted-foreground hover:text-foreground'
                          )}
                        >
                          AM
                        </button>
                        <button
                          type="button"
                          onClick={() => field.onChange('pm')}
                          className={cn(
                            "flex-1 py-2 text-sm font-medium transition-colors",
                            field.value === 'pm'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-secondary text-muted-foreground hover:text-foreground'
                          )}
                        >
                          PM
                        </button>
                      </div>
                    )} />
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Duration Section */}
          <div className="space-y-4">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Duration</label>

            {/* Quick Duration Buttons */}
            <div className="flex flex-wrap gap-2">
              {QUICK_DURATIONS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setValue('duration', d)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-sm font-medium transition-all",
                    duration === d
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                      : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  {d}m
                </button>
              ))}
            </div>

            {/* Duration Slider */}
            <div className="bg-secondary/30 rounded-xl p-4 space-y-4">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => adjustDuration(-5)}
                  className="p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <div className="text-center">
                  <span className="text-4xl font-bold tabular-nums">{duration}</span>
                  <span className="text-lg text-muted-foreground ml-1">min</span>
                </div>
                <button
                  type="button"
                  onClick={() => adjustDuration(5)}
                  className="p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <Controller control={control} name="duration" render={({ field }) => (
                <Slider
                  value={[field.value]}
                  onValueChange={([val]) => field.onChange(val)}
                  min={5}
                  max={180}
                  step={5}
                  className="w-full"
                />
              )} />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>5 min</span>
                <span>3 hours</span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/20"
          >
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 mr-2 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-5 w-5 mr-2" />
                Add Focus Session
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
