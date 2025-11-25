'use client';
import { useMemo } from 'react';
import { HistoricalFocusChart } from './historical-focus-chart';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../ui/card';
import { useDateRanges } from '@/hooks/use-date-ranges';
import { isWithinInterval } from 'date-fns';

function formatDuration(minutes: number) {
  if (isNaN(minutes) || minutes < 0) return '0h 0m';
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return `${hours}h ${mins}m`;
}

export const MonthChart = ({ data, loading }: { data: any[], loading: boolean }) => {
    const { dateRanges } = useDateRanges();

    const monthlyTotal = useMemo(() => {
        const { start, end } = dateRanges.month;
        if (!data) return 0;
        return data
            .filter(record => isWithinInterval(new Date(record.date), { start, end }))
            .reduce((acc, record) => acc + record.totalFocusMinutes, 0);
    }, [data, dateRanges.month]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Monthly Activity</CardTitle>
                <CardDescription>
                    Total: <span className="font-semibold text-foreground">{formatDuration(monthlyTotal)}</span>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <HistoricalFocusChart 
                    data={data} 
                    loading={loading} 
                    timeRange='month'
                    weekStartsOn={1} // weekStartsOn doesn't affect month view
                />
            </CardContent>
        </Card>
    );
};
