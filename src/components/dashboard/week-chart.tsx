'use client';
import { useMemo } from 'react';
import { HistoricalFocusChart } from './historical-focus-chart';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { useUserPreferences, WeekStartDay } from '@/hooks/use-user-preferences.tsx';
import { isWithinInterval } from 'date-fns';
import { useDateRanges } from '@/hooks/use-date-ranges';

function formatDuration(minutes: number) {
    if (isNaN(minutes) || minutes < 0) return '0h 0m';
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}m`;
}

// Helper to safely parse dates that could be strings, Date objects, or Firestore Timestamps
function safeParseDate(date: any): Date {
    if (!date) return new Date();
    if (date instanceof Date) return date;
    if (typeof date === 'string') return new Date(date);
    if (date.toDate && typeof date.toDate === 'function') return date.toDate();
    if (date.seconds) return new Date(date.seconds * 1000);
    return new Date();
}

interface WeekChartProps {
    allRecords: any[] | undefined | null;
    isLoading: boolean;
}

export const WeekChart = ({ allRecords, isLoading }: WeekChartProps) => {
    const { preferences, updatePreferences } = useUserPreferences();
    const weekStartsOn = preferences?.weekStartsOn ?? 1;

    const { dateRanges } = useDateRanges(weekStartsOn as WeekStartDay);
    const weeklyRecords = useMemo(() => {
        if (!allRecords) return [];
        return allRecords.filter(r => {
            try {
                return isWithinInterval(safeParseDate(r.date), dateRanges.week);
            } catch {
                return false;
            }
        });
    }, [allRecords, dateRanges.week]);

    const weeklyTotal = useMemo(() => {
        if (!weeklyRecords) return 0;
        return weeklyRecords.reduce((acc, record) => acc + (record.totalFocusMinutes || 0), 0);
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
                    loading={isLoading}
                    timeRange='week'
                    weekStartsOn={weekStartsOn as WeekStartDay}
                />
            </CardContent>
        </Card>
    );
};
