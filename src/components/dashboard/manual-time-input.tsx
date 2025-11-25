'use client';
import { Controller, Control, FieldErrors } from 'react-hook-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { AddRecordFormValues } from './add-record-schema';

interface ManualTimeInputProps {
    control: Control<AddRecordFormValues>;
    errors: FieldErrors<AddRecordFormValues>;
}

export function ManualTimeInput({ control, errors }: ManualTimeInputProps) {
  return (
    <div>
      <Label>Start Time</Label>
      <div className="grid grid-cols-3 gap-2 mt-2">
        <Controller
          control={control}
          name="hour"
          render={({ field }) => (
            <Select onValueChange={(value) => field.onChange(Number(value))} value={String(field.value)}>
              <SelectTrigger><SelectValue placeholder="Hour" /></SelectTrigger>
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
              <SelectTrigger><SelectValue placeholder="Min" /></SelectTrigger>
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
            <RadioGroup onValueChange={field.onChange} value={field.value} className="flex items-center space-x-1 bg-secondary p-1 rounded-md">
              <RadioGroupItem value="am" id="am" className="sr-only" />
              <Label htmlFor="am" className="flex-1 text-center text-xs py-1.5 rounded-[5px] cursor-pointer transition-colors data-[state=checked]:bg-background data-[state=checked]:text-foreground data-[state=checked]:shadow-sm">AM</Label>
              <RadioGroupItem value="pm" id="pm" className="sr-only" />
              <Label htmlFor="pm" className="flex-1 text-center text-xs py-1.5 rounded-[5px] cursor-pointer transition-colors data-[state=checked]:bg-background data-[state=checked]:text-foreground data-[state=checked]:shadow-sm">PM</Label>
            </RadioGroup>
          )}
        />
      </div>
      {errors.hour && <p className="text-destructive text-xs mt-1">{errors.hour.message}</p>}
    </div>
  );
}
