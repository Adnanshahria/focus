'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore } from '@/firebase';
import { doc, collection, runTransaction } from 'firebase/firestore';

const addRecordSchema = z.object({
  date: z.date({
    required_error: 'A date is required.',
  }),
  duration: z.coerce
    .number()
    .min(1, 'Duration must be at least 1 minute.')
    .max(1440, 'Duration cannot exceed 1440 minutes (24 hours).'),
});

type AddRecordFormValues = z.infer<typeof addRecordSchema>;

interface AddFocusRecordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddFocusRecordDialog({ open, onOpenChange }: AddFocusRecordDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AddRecordFormValues>({
    resolver: zodResolver(addRecordSchema),
    defaultValues: {
      date: new Date(),
      duration: 25,
    },
  });

  const selectedDate = watch('date');

  const onSubmit = async (data: AddRecordFormValues) => {
    if (!user || user.isAnonymous || !firestore) {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: 'You must be logged in to add a record.',
      });
      return;
    }
    setIsSubmitting(true);

    try {
      const dateString = format(data.date, 'yyyy-MM-dd');
      const focusRecordRef = doc(firestore, `users/${user.uid}/focusRecords`, dateString);
      const sessionsCollectionRef = collection(focusRecordRef, 'sessions');

      await runTransaction(firestore, async (transaction) => {
        const recordSnap = await transaction.get(focusRecordRef);
        
        // Use existing data or initialize if it doesn't exist
        const currentData = recordSnap.data() || { 
            totalFocusMinutes: 0, 
            totalPomos: 0,
            userId: user.uid,
            date: dateString,
            id: dateString
        };
        
        const newTotalFocusMinutes = currentData.totalFocusMinutes + data.duration;

        const newSessionRef = doc(sessionsCollectionRef);
        transaction.set(newSessionRef, {
          id: newSessionRef.id,
          focusRecordId: focusRecordRef.id,
          startTime: data.date.toISOString(),
          endTime: new Date(data.date.getTime() + data.duration * 60000).toISOString(),
          duration: data.duration,
          type: 'manual',
        });
        
        const recordUpdateData = {
          ...currentData, // Carry over existing fields
          totalFocusMinutes: newTotalFocusMinutes,
        };
        
        transaction.set(focusRecordRef, recordUpdateData, { merge: true });
      });

      toast({
        title: 'Record Added',
        description: `Successfully logged ${data.duration} minutes for ${dateString}.`,
      });
      onOpenChange(false);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Failed to Add Record',
        description: error.message || 'An unexpected error occurred.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Manual Focus Record</DialogTitle>
          <DialogDescription>
            Log a focus session that you completed without the timer.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !selectedDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setValue('date', date)}
                  initialFocus
                  disabled={(date) =>
                    date > new Date() || date < new Date('1900-01-01')
                  }
                />
              </PopoverContent>
            </Popover>
            {errors.date && <p className="text-destructive text-xs">{errors.date.message}</p>}
          </div>
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
