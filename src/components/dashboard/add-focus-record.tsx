'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format, set } from 'date-fns';
import { addRecordSchema, AddRecordFormValues } from './add-record-schema';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/firebase';
import { useFirestore } from '@/firebase/hooks/hooks';
import { doc, collection, runTransaction } from 'firebase/firestore';
import { ManualTimeInput } from './manual-time-input';

interface AddFocusRecordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddFocusRecordDialog({ open, onOpenChange }: AddFocusRecordDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  const now = new Date();
  const currentHour = now.getHours();

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<AddRecordFormValues>({
    resolver: zodResolver(addRecordSchema),
    defaultValues: {
      date: now,
      hour: currentHour % 12 === 0 ? 12 : currentHour % 12,
      minute: now.getMinutes(),
      ampm: currentHour >= 12 ? 'pm' : 'am',
      duration: 25,
    },
  });

  const onSubmit = async (data: AddRecordFormValues) => {
    if (!user || user.isAnonymous || !firestore) {
      toast({ variant: 'destructive', title: 'Authentication Error', description: 'You must be logged in.' });
      return;
    }
    setIsSubmitting(true);
    try {
      await logFocusRecord(data);
      toast({ title: 'Record Added', description: `Successfully logged ${data.duration} minutes.` });
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
      // ===== ALL READS FIRST =====
      const userDocRef = doc(firestore, 'users', user.uid);
      const userDocSnap = await transaction.get(userDocRef);
      const recordSnap = await transaction.get(focusRecordRef);

      // ===== THEN ALL WRITES =====
      // Ensure user document exists (auto-repair if deleted)
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
        startTime: dateWithTime.toISOString(), endTime: new Date(dateWithTime.getTime() + data.duration * 60000).toISOString(),
        duration: data.duration, type: 'manual', completed: true,
      });

      transaction.set(focusRecordRef, {
        id: dateString, date: dateString, userId: user.uid,
        totalFocusMinutes: newTotalFocusMinutes, totalPomos: newTotalPomos
      }, { merge: true });
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Manual Focus Record</DialogTitle>
          <DialogDescription>Log a session you completed without the timer.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Controller control={control} name="date" render={({ field }) => (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant={'outline'} className={cn('w-full justify-start text-left font-normal', !field.value && 'text-muted-foreground')}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date()} initialFocus />
                </PopoverContent>
              </Popover>
            )} />
            {errors.date && <p className="text-destructive text-xs">{errors.date.message}</p>}
          </div>

          <ManualTimeInput control={control} errors={errors} />

          <div className="space-y-2">
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input id="duration" type="number" {...register('duration')} />
            {errors.duration && <p className="text-destructive text-xs">{errors.duration.message}</p>}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? 'Adding...' : 'Add Record'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
