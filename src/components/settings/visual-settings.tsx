'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from 'next-themes';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Sun, Moon } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { useUserPreferences } from '@/hooks/use-user-preferences.tsx';
import { cn } from '@/lib/utils';

type VisualSettingsFormValues = {
  theme: 'light' | 'dark';
  antiBurnIn: boolean;
};

export function VisualSettings() {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const { preferences, isLoading, updatePreferences } = useUserPreferences();

  const { watch, reset, setValue } = useForm<VisualSettingsFormValues>({
    defaultValues: {
      theme: 'dark',
      antiBurnIn: true,
    }
  });

  const watchedValues = watch();

  // Safe getters with fallbacks
  const currentTheme = watchedValues.theme || theme || 'dark';
  const currentAntiBurnIn = watchedValues.antiBurnIn ?? true;

  useEffect(() => {
    if (preferences) {
      const newValues = {
        theme: (preferences.theme || 'dark') as 'light' | 'dark',
        antiBurnIn: preferences.antiBurnIn ?? true,
      };
      reset(newValues);
      if (newValues.theme !== theme) {
        setTheme(newValues.theme);
      }
    }
  }, [preferences, reset, theme, setTheme]);

  useEffect(() => {
    if (theme && (theme === 'light' || theme === 'dark')) {
      setValue('theme', theme);
    }
  }, [theme, setValue]);

  const handleSettingsChange = (data: Partial<VisualSettingsFormValues>) => {
    if (data.theme && data.theme !== theme) setTheme(data.theme);

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
        <RadioGroup value={currentTheme} className="grid grid-cols-2 gap-4" onValueChange={(value: 'light' | 'dark') => handleSettingsChange({ theme: value })}>
          <Label className={cn(
            "flex flex-col items-center justify-center gap-3 border-2 rounded-xl p-4 cursor-pointer hover:bg-accent hover:text-accent-foreground transition-all",
            currentTheme === 'light' ? "border-primary bg-primary/5" : "border-muted"
          )}>
            <Sun className={cn("h-6 w-6", currentTheme === 'light' ? "text-primary" : "text-muted-foreground")} />
            <RadioGroupItem value="light" id="theme-light" className="sr-only" />
            <span className="font-medium">Light</span>
          </Label>
          <Label className={cn(
            "flex flex-col items-center justify-center gap-3 border-2 rounded-xl p-4 cursor-pointer hover:bg-accent hover:text-accent-foreground transition-all",
            currentTheme === 'dark' ? "border-primary bg-primary/5" : "border-muted"
          )}>
            <Moon className={cn("h-6 w-6", currentTheme === 'dark' ? "text-primary" : "text-muted-foreground")} />
            <RadioGroupItem value="dark" id="theme-dark" className="sr-only" />
            <span className="font-medium">Dark</span>
          </Label>
        </RadioGroup>
      </div>
      <div className="flex items-center justify-between rounded-lg border p-3">
        <div className="space-y-0.5">
          <Label htmlFor="antiBurnIn">Anti-Burn</Label>
          <p className="text-xs text-muted-foreground">Moves timer in deep focus mode to save OLED screens.</p>
        </div>
        <Switch id="antiBurnIn" checked={currentAntiBurnIn} onCheckedChange={(checked) => handleSettingsChange({ antiBurnIn: checked })} />
      </div>
    </div>
  );
}
