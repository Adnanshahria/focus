'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format, set, isFuture } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
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
  hour: z.coerce.number().min(1).max(12),
  minute: z.coerce.number().min(0).max(59),
  ampm: z.enum(['am', 'pm']),
  duration: z.coerce
    .number()
    .min(1, 'Duration must be at least 1 minute.')
    .max(1440, 'Duration cannot exceed 24 hours.'),
}).refine(data => {
  let hour24 = data.hour;
  if (data.ampm === 'pm' && data.hour < 12) {
    hour24 += 12;
  }
  if (data.ampm === 'am' && data.hour === 12) {
    hour24 = 0;
  }
  const selectedDateTime = set(data.date, { hours: hour24, minutes: data.minute });
  return !isFuture(selectedDateTime);
}, {
  message: 'Start time cannot be in the future.',
  path: ['hour'], // You can associate the error with a specific field
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

  const now = new Date();
  const currentHour = now.getHours();
  const formattedHour = currentHour % 12 === 0 ? 12 : currentHour % 12;

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<AddRecordFormValues>({
    resolver: zodResolver(addRecordSchema),
    defaultValues: {
      date: now,
      hour: formattedHour,
      minute: now.getMinutes(),
      ampm: currentHour >= 12 ? 'pm' : 'am',
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
      let hour24 = data.hour;
      if (data.ampm === 'pm' && data.hour < 12) {
        hour24 += 12;
      }
      if (data.ampm === 'am' && data.hour === 12) {
        hour24 = 0;
      }
      
      const dateWithTime = set(data.date, { hours: hour24, minutes: data.minute, seconds: 0, milliseconds: 0 });
      const dateString = format(dateWithTime, 'yyyy-MM-dd');
      
      const focusRecordRef = doc(firestore, `users/${user.uid}/focusRecords`, dateString);
      const sessionsCollectionRef = collection(focusRecordRef, 'sessions');

      await runTransaction(firestore, async (transaction) => {
        const recordSnap = await transaction.get(focusRecordRef);
        
        const currentData = recordSnap.data() || { 
            totalFocusMinutes: 0, 
            totalPomos: 0,
        };
        
        const newTotalFocusMinutes = currentData.totalFocusMinutes + data.duration;
        const isPomodoro = data.duration >= 25; // Simple check if it can be considered a pomo
        const newTotalPomos = currentData.totalPomos + (isPomodoro ? 1 : 0);

        const newSessionRef = doc(sessionsCollectionRef); // Create a reference for the new session
        transaction.set(newSessionRef, {
          id: newSessionRef.id,
          focusRecordId: focusRecordRef.id,
          startTime: dateWithTime.toISOString(),
          endTime: new Date(dateWithTime.getTime() + data.duration * 60000).toISOString(),
          duration: data.duration,
          type: 'manual',
          completed: true, // Manual entries are always 'completed'
        });
        
        // Prepare data for the main focus record
        const recordUpdateData = {
          id: dateString,
          date: dateString,
          userId: user.uid,
          totalFocusMinutes: newTotalFocusMinutes,
          totalPomos: newTotalPomos
        };
        
        // Use set with merge to create or update the daily record
        transaction.set(focusRecordRef, recordUpdateData, { merge: true });
      });

      toast({
        title: 'Record Added',
        description: `Successfully logged ${data.duration} minutes for ${format(data.date, 'PPP')}.`,
      });
      onOpenChange(false);
      reset(); // Reset form to default values after successful submission
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Manual Focus Record</DialogTitle>
          <DialogDescription>
            Log a focus session that you completed without the timer.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
           <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Controller
                control={control}
                name="date"
                render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => field.onChange(date)}
                      initialFocus
                      disabled={(date) =>
                        date > new Date() || date < new Date('1900-01-01')
                      }
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
            {errors.date && <p className="text-destructive text-xs">{errors.date.message}</p>}
          </div>
          
          <div>
            <Label>Start Time</Label>
            <div className="grid grid-cols-3 gap-2 mt-2">
                 <Controller
                    control={control}
                    name="hour"
                    render={({ field }) => (
                      <Select onValueChange={(value) => field.onChange(Number(value))} value={String(field.value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Hour" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 12 }, (_, i) => i + 1).map(h => (
                            <SelectItem key={h} value={String(h)}>{String(h).padStart(2, '0')}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                <Controller
                    control={control}
                    name="minute"
                    render={({ field }) => (
                        <Select onValueChange={(value) => field.onChange(Number(value))} value={String(field.value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Min" />
                            </SelectTrigger>
                            <SelectContent>
                                {Array.from({ length: 60 }, (_, i) => i).map(m => (
                                    <SelectItem key={m} value={String(m)}>{String(m).padStart(2, '0')}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
                 <Controller
                    control={control}
                    name="ampm"
                    render={({ field }) => (
                        <RadioGroup 
                            onValueChange={field.onChange} 
                            value={field.value} 
                            className="flex items-center space-x-1 bg-secondary p-1 rounded-md"
                        >
                            <RadioGroupItem value="am" id="am" className="sr-only" />
                            <Label htmlFor="am" className="flex-1 text-center text-xs py-1.5 rounded-[5px] cursor-pointer transition-colors data-[state=checked]:bg-background data-[state=checked]:text-foreground data-[state=checked]:shadow-sm">AM</Label>
                            <RadioGroupItem value="pm" id="pm" className="sr-only" />
                            <Label htmlFor="pm" className="flex-1 text-center text-xs py-1.5 rounded-[5px] cursor-pointer transition-colors data-[state=checked]:bg-background data-[state=checked]:text-foreground data-[state=checked]:shadow-sm">PM</Label>
                        </RadioGroup>
                    )}
                 />
            </div>
            {errors.hour && <p className="text-destructive text-xs mt-1">{errors.hour.message}</p>}
            {errors.minute && <p className="text-destructive text-xs mt-1">{errors.minute.message}</p>}
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
