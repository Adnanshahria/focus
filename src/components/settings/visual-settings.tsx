'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from 'next-themes';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Sun, Moon } from 'lucide-react';
import { useTimerStore } from '@/store/timer-store';
import { Skeleton } from '../ui/skeleton';
import { useUserPreferences } from '@/hooks/use-user-preferences.tsx';

type VisualSettingsFormValues = {
  theme: 'light' | 'dark';
  antiBurnIn: boolean;
};

export function VisualSettings() {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const setStoreVisuals = useTimerStore(state => state.setVisuals);
  const { preferences, isLoading, updatePreferences } = useUserPreferences();

  const { watch, reset, setValue } = useForm<VisualSettingsFormValues>();

  const watchedValues = watch();

  useEffect(() => {
    if (preferences) {
      const newValues = {
        theme: preferences.theme || 'dark',
        antiBurnIn: preferences.antiBurnIn ?? true,
      };
      reset(newValues);
      if (newValues.theme !== theme) {
        setTheme(newValues.theme);
      }
      setStoreVisuals({ antiBurnIn: newValues.antiBurnIn });
    }
  }, [preferences, reset, theme, setTheme, setStoreVisuals]);
  
  useEffect(() => {
    if (theme) setValue('theme', theme as 'light' | 'dark');
  }, [theme, setValue]);

  const handleSettingsChange = (data: Partial<VisualSettingsFormValues>) => {
    if (data.theme && data.theme !== theme) setTheme(data.theme);
    if (data.antiBurnIn !== undefined) setStoreVisuals({ antiBurnIn: data.antiBurnIn });
    
    updatePreferences(data);
    
    toast({ title: 'Settings Updated' });
    reset({ ...watchedValues, ...data });
  };
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-12" />
          <div className="grid grid-cols-2 gap-2"><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /></div>
        </div>
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Label>Theme</Label>
          <RadioGroup value={watchedValues.theme} className="grid grid-cols-2 gap-2" onValueChange={(value: 'light' | 'dark') => handleSettingsChange({ theme: value })}>
            <Label className="flex flex-col items-center justify-center gap-2 border rounded-md p-4 cursor-pointer hover:border-primary has-[input:checked]:border-primary">
              <Sun className="h-5 w-5"/><RadioGroupItem value="light" id="theme-light" className="sr-only"/><span>Light</span>
            </Label>
            <Label className="flex flex-col items-center justify-center gap-2 border rounded-md p-4 cursor-pointer hover:border-primary has-[input:checked]:border-primary">
              <Moon className="h-5 w-5"/><RadioGroupItem value="dark" id="theme-dark" className="sr-only"/><span>Dark</span>
            </Label>
          </RadioGroup>
        </div>
        <div className="flex items-center justify-between rounded-lg border p-3">
          <div className="space-y-0.5">
            <Label htmlFor="antiBurnIn">Anti-Burn</Label>
            <p className="text-xs text-muted-foreground">Moves timer in deep focus mode to save OLED screens.</p>
          </div>
          <Switch id="antiBurnIn" checked={watchedValues.antiBurnIn} onCheckedChange={(checked) => handleSettingsChange({ antiBurnIn: checked })}/>
        </div>
      </div>
  );
}
