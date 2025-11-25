'use client';
import { useState, useMemo } from 'react';
import { HistoricalFocusChart } from './historical-focus-chart';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { useDateRanges } from '@/hooks/use-date-ranges';
import { format, isWithinInterval } from 'date-fns';

type WeekStartDay = 0 | 1 | 2 | 3 | 4 | 5 | 6;

function formatDuration(minutes: number) {
  if (isNaN(minutes) || minutes < 0) return '0h 0m';
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return `${hours}h ${mins}m`;
}

export const WeekChart = ({ data, loading }: { data: any[], loading: boolean }) => {
    const [weekStartsOn, setWeekStartsOn] = useState<WeekStartDay>(1);
    const { dateRanges } = useDateRanges(weekStartsOn);

    const weeklyTotal = useMemo(() => {
        const { start, end } = dateRanges.week;
        return data
            .filter(record => isWithinInterval(new Date(record.date), { start, end }))
            .reduce((acc, record) => acc + record.totalFocusMinutes, 0);
    }, [data, dateRanges.week]);

    return (
        <Card>
            <CardHeader>
                 <CardTitle>Weekly Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                     <CardDescription>
                        Total this week: <span className="font-semibold text-foreground">{formatDuration(weeklyTotal)}</span>
                    </CardDescription>
                    <div className="flex items-center gap-2">
                        <Label htmlFor='week-start' className='text-xs text-muted-foreground'>Week starts on</Label>
                        <Select value={String(weekStartsOn)} onValueChange={(val) => setWeekStartsOn(Number(val) as WeekStartDay)}>
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
                <HistoricalFocusChart 
                    data={data} 
                    loading={loading} 
                    timeRange='week'
                    weekStartsOn={weekStartsOn}
                />
            </CardContent>
        </Card>
    );
};
