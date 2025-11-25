'use client';
import { useState, useMemo } from 'react';
import { HistoricalFocusChart } from './historical-focus-chart';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { useDateRanges } from '@/hooks/use-date-ranges';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { format } from 'date-fns';

type WeekStartDay = 0 | 1 | 2 | 3 | 4 | 5 | 6;

function formatDuration(minutes: number) {
  if (isNaN(minutes) || minutes < 0) return '0h 0m';
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return `${hours}h ${mins}m`;
}

export const WeekChart = () => {
    const [weekStartsOn, setWeekStartsOn] = useState<WeekStartDay>(1);
    const { user } = useUser();
    const firestore = useFirestore();
    const { dateRanges } = useDateRanges(weekStartsOn);
    const { start, end } = dateRanges.week;

    const weeklyQuery = useMemoFirebase(() => {
        if (!user) return null;
        return query(
            collection(firestore, `users/${user.uid}/focusRecords`),
            where('date', '>=', format(start, 'yyyy-MM-dd')),
            where('date', '<=', format(end, 'yyyy-MM-dd')),
            orderBy('date', 'asc')
        );
    }, [user, firestore, start, end]);

    const { data, isLoading: loading } = useCollection(weeklyQuery);

    const weeklyTotal = useMemo(() => {
        if (!data) return 0;
        return data.reduce((acc, record) => acc + record.totalFocusMinutes, 0);
    }, [data]);

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
            </CardHeader>
            <CardContent>
                <HistoricalFocusChart 
                    data={data || []} 
                    loading={loading} 
                    timeRange='week'
                    weekStartsOn={weekStartsOn}
                />
            </CardContent>
        </Card>
    );
};
