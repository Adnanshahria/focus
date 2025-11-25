'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useUser, useFirestore, useDoc, useMemoFirebase, setDocumentNonBlocking } from '@/firebase';
import { doc, collection } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from 'next-themes';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Sun, Moon } from 'lucide-react';
import { useTimerStore } from '@/store/timer-store';
import { Skeleton } from '../ui/skeleton';

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
  const { antiBurnIn: storeAntiBurnIn, setVisuals: setStoreVisuals } = useTimerStore(state => ({
    antiBurnIn: state.antiBurnIn,
    setVisuals: state.setVisuals
  }));

  const userPreferencesRef = useMemoFirebase(() => {
    if (!user || user.isAnonymous) return null;
    const prefCollection = collection(firestore, `users/${user.uid}/userPreferences`);
    return doc(prefCollection, 'main');
  }, [user, firestore]);

  const { data: preferences, isLoading } = useDoc<UserPreferences>(userPreferencesRef);

  const {
    watch,
    reset,
    setValue,
  } = useForm<VisualSettingsFormValues>({
    resolver: zodResolver(visualSettingsSchema),
    defaultValues: {
      antiBurnIn: storeAntiBurnIn,
      theme: (theme as 'light' | 'dark') || defaultValues.theme,
    },
  });

  const watchedValues = watch();
  const isAnon = !user || user.isAnonymous;


  useEffect(() => {
    if (preferences) {
      const newValues = {
        theme: preferences.theme || defaultValues.theme,
        antiBurnIn: preferences.antiBurnIn ?? defaultValues.antiBurnIn,
      };
      reset(newValues);
      if(newValues.theme !== theme) {
        setTheme(newValues.theme);
      }
      setStoreVisuals({ antiBurnIn: newValues.antiBurnIn });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preferences, reset]);
  
  useEffect(() => {
    // Sync form state with the theme from next-themes
    if (theme) {
      setValue('theme', theme as 'light' | 'dark');
    }
  }, [theme, setValue]);

  const saveSettings = (data: Partial<VisualSettingsFormValues>) => {
    if (data.theme && data.theme !== theme) {
      setTheme(data.theme);
    }
    if (data.antiBurnIn !== undefined) {
      setStoreVisuals({ antiBurnIn: data.antiBurnIn });
    }
    
    if (isAnon) return;
    
    const dataToSave = { id: 'main', ...data };
    setDocumentNonBlocking(userPreferencesRef!, dataToSave, { merge: true });
    
    toast({
      title: 'Settings Updated',
      description: 'Your appearance settings have been saved.',
    });
    reset({ ...watchedValues, ...data });
  };

  const handleAntiBurnInChange = (checked: boolean) => {
    setValue('antiBurnIn', checked, { shouldDirty: true });
    saveSettings({ antiBurnIn: checked });
  };

  const handleThemeChange = (value: 'light' | 'dark') => {
    if (value !== theme) {
        setValue('theme', value, { shouldDirty: true });
        saveSettings({ theme: value });
    }
  };
  
  if (isLoading && !isAnon) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-12" />
          <div className="grid grid-cols-2 gap-2">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Theme</Label>
        <RadioGroup
          value={watchedValues.theme}
          className="grid grid-cols-2 gap-2"
          disabled={isAnon}
        >
          <Label 
            onClick={() => !isAnon && handleThemeChange('light')}
            className="flex flex-col items-center justify-center gap-2 border rounded-md p-4 cursor-pointer hover:border-primary has-[input:checked]:border-primary data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50"
            data-disabled={isAnon}
          >
            <Sun className="h-5 w-5"/>
            <RadioGroupItem value="light" id="theme-light" className="sr-only"/>
            <span>Light</span>
          </Label>
          <Label 
            onClick={() => !isAnon && handleThemeChange('dark')}
            className="flex flex-col items-center justify-center gap-2 border rounded-md p-4 cursor-pointer hover:border-primary has-[input:checked]:border-primary data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50"
            data-disabled={isAnon}
          >
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
          onCheckedChange={handleAntiBurnInChange}
          disabled={isAnon}
        />
      </div>
    </div>
  );
}
