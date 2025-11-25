'use client';
import { useMemo } from 'react';
import { HistoricalFocusChart } from './historical-focus-chart';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { useUserPreferences, WeekStartDay } from '@/hooks/use-user-preferences.tsx';

function formatDuration(minutes: number) {
  if (isNaN(minutes) || minutes < 0) return '0h 0m';
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return `${hours}h ${mins}m`;
}

interface WeekChartProps {
    weeklyRecords: any[] | undefined | null;
}

export const WeekChart = ({ weeklyRecords }: WeekChartProps) => {
    const { preferences, updatePreferences } = useUserPreferences();
    const weekStartsOn = preferences?.weekStartsOn ?? 1;

    const weeklyTotal = useMemo(() => {
        if (!weeklyRecords) return 0;
        return weeklyRecords.reduce((acc, record) => acc + record.totalFocusMinutes, 0);
    }, [weeklyRecords]);

    return (
        <Card>
            <CardHeader>
                 <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div>
                        <CardTitle>Weekly Activity</CardTitle>
                        <CardDescription>
                            Total: <span className="font-semibold text-foreground">{formatDuration(weeklyTotal)}</span>
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        <Label htmlFor='week-start' className='text-xs text-muted-foreground shrink-0'>Week starts on</Label>
                        <Select value={String(weekStartsOn)} onValueChange={(val) => updatePreferences({ weekStartsOn: Number(val) as WeekStartDay })}>
                            <SelectTrigger id='week-start' className='w-[120px] h-8 text-xs'>
                                <SelectValue placeholder="Select day" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="0">Sunday</SelectItem>
                                <SelectItem value="1">Monday</SelectItem>
                                <SelectItem value="2">Tuesday</SelectItem>
                                <SelectItem value="3">Wednesday</SelectItem>
                                <SelectItem value="4">Thursday</SelectItem>
                                <SelectItem value="5">Friday</SelectItem>
                                <SelectItem value="6">Saturday</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <HistoricalFocusChart 
                    data={weeklyRecords || []} 
                    loading={!weeklyRecords} 
                    timeRange='week'
                    weekStartsOn={weekStartsOn as WeekStartDay}
                />
            </CardContent>
        </Card>
    );
};
