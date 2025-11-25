'use client';
import * as z from 'zod';
import { set, isFuture } from 'date-fns';

export const addRecordSchema = z.object({
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
  if (data.ampm === 'am' && data.hour === 12) { // Midnight case
    hour24 = 0;
  }
  const selectedDateTime = set(data.date, { hours: hour24, minutes: data.minute });
  return !isFuture(selectedDateTime);
}, {
  message: 'Start time cannot be in the future.',
  path: ['hour'], // Associate the error with a field for display
});


export type AddRecordFormValues = z.infer<typeof addRecordSchema>;
