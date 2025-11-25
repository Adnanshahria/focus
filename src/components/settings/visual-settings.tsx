'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useUser, useFirestore, useDoc, useMemoFirebase, setDocumentNonBlocking } from '@/firebase';
import { doc, collection } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from 'next-themes';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Sun, Moon } from 'lucide-react';
import { useTimerStore } from '@/store/timer-store';

const visualSettingsSchema = z.object({
  theme: z.enum(['light', 'dark']),
  antiBurnIn: z.boolean(),
});

type VisualSettingsFormValues = z.infer<typeof visualSettingsSchema>;

type UserPreferences = {
    theme?: 'light' | 'dark';
    antiBurnIn?: boolean;
}

const defaultValues: VisualSettingsFormValues = {
  theme: 'dark',
  antiBurnIn: true,
};

export function VisualSettings() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const { setVisuals: setStoreVisuals } = useTimerStore();

  const userPreferencesRef = useMemoFirebase(() => {
    if (!user || user.isAnonymous) return null;
    const prefCollection = collection(firestore, `users/${user.uid}/userPreferences`);
    return doc(prefCollection, 'main');
  }, [user, firestore]);

  const { data: preferences, isLoading } = useDoc<UserPreferences>(userPreferencesRef);

  const {
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { isSubmitting, isDirty },
  } = useForm<VisualSettingsFormValues>({
    resolver: zodResolver(visualSettingsSchema),
    defaultValues: defaultValues,
  });

  const watchedValues = watch();
  
  // Sync remote preferences to form state
  useEffect(() => {
    if (preferences) {
      const newValues = {
        theme: preferences.theme || defaultValues.theme,
        antiBurnIn: preferences.antiBurnIn ?? defaultValues.antiBurnIn,
      };
      reset(newValues);
      if(newValues.theme) {
        setTheme(newValues.theme);
      }
      setStoreVisuals({ antiBurnIn: newValues.antiBurnIn });
    }
  }, [preferences, reset, setTheme, setStoreVisuals]);

  // Sync theme from next-themes to form state
  useEffect(() => {
      setValue('theme', (theme as 'light' | 'dark') || defaultValues.theme);
  }, [theme, setValue]);

  const handleValueChange = <T extends keyof VisualSettingsFormValues>(field: T, value: VisualSettingsFormValues[T]) => {
      setValue(field, value, { shouldDirty: true });
      if (field === 'theme') {
          setTheme(value as string);
      }
      // Immediately submit form to save changes
      handleSubmit(onSubmit)();
  }

  const onSubmit = (data: VisualSettingsFormValues) => {
    setStoreVisuals({ antiBurnIn: data.antiBurnIn });
    if (!userPreferencesRef) {
        if (!user || user.isAnonymous) {
            // Silently fail for anonymous users, don't show toast
        }
        return;
    }
    
    const dataToSave = { id: 'main', ...data };

    setDocumentNonBlocking(userPreferencesRef, dataToSave, { merge: true });
    
    toast({
      title: 'Settings Updated',
      description: 'Your appearance settings have been saved.',
    });
    reset(data); // Resets dirty state after save
  };
  
  if (isLoading && user && !user.isAnonymous) {
      return <div>Loading settings...</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label>Theme</Label>
        <RadioGroup
          onValueChange={(value: 'light' | 'dark') => handleValueChange('theme', value)}
          value={watchedValues.theme}
          className="grid grid-cols-2 gap-2"
          disabled={!user || user.isAnonymous}
        >
          <Label className="flex flex-col items-center justify-center gap-2 border rounded-md p-4 cursor-pointer hover:border-primary has-[input:checked]:border-primary">
            <Sun className="h-5 w-5"/>
            <RadioGroupItem value="light" id="theme-light" className="sr-only"/>
            <span>Light</span>
          </Label>
          <Label className="flex flex-col items-center justify-center gap-2 border rounded-md p-4 cursor-pointer hover:border-primary has-[input:checked]:border-primary">
            <Moon className="h-5 w-5"/>
            <RadioGroupItem value="dark" id="theme-dark" className="sr-only"/>
            <span>Dark</span>
          </Label>
        </RadioGroup>
      </div>
      
      <div className="flex items-center justify-between rounded-lg border p-3">
        <div className="space-y-0.5">
          <Label htmlFor="antiBurnIn">Anti-Burn</Label>
          <p className="text-xs text-muted-foreground">
            Moves the Timer to save Amoled/Oled/Poled screen pixels in the deepfocus mode.
          </p>
        </div>
        <Switch 
          id="antiBurnIn"
          checked={watchedValues.antiBurnIn}
          onCheckedChange={(checked) => handleValueChange('antiBurnIn', checked)}
          disabled={!user || user.isAnonymous}
        />
      </div>
    </form>
  );
}
