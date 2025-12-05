'use client';

import { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '../ui/skeleton';
import { useUserPreferences } from '@/hooks/use-user-preferences.tsx';

export function VisualSettings() {
  const { toast } = useToast();
  const { preferences, isLoading, updatePreferences } = useUserPreferences();
  const [antiBurnIn, setAntiBurnIn] = useState(true);

  useEffect(() => {
    if (preferences?.antiBurnIn !== undefined) {
      setAntiBurnIn(preferences.antiBurnIn);
    }
  }, [preferences?.antiBurnIn]);

  const handleAntiBurnChange = (checked: boolean) => {
    setAntiBurnIn(checked);
    updatePreferences({ antiBurnIn: checked });
    toast({ title: 'Settings Updated' });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-20 w-full rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-lg border p-4">
        <div className="space-y-1">
          <Label htmlFor="antiBurnIn" className="font-medium">Anti-Burn Protection</Label>
          <p className="text-sm text-muted-foreground">
            Slowly moves the timer in Deep Focus mode to prevent OLED screen burn-in.
          </p>
        </div>
        <Switch
          id="antiBurnIn"
          checked={antiBurnIn}
          onCheckedChange={handleAntiBurnChange}
        />
      </div>
      <p className="text-xs text-muted-foreground px-1">
        The app uses dark mode by default for a better focus experience and battery savings.
      </p>
    </div>
  );
}
