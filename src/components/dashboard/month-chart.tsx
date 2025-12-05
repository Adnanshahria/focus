'use client';
import { useMemo } from 'react';
import { HistoricalFocusChart } from './historical-focus-chart';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../ui/card';
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

interface MonthChartProps {
    allRecords: any[] | undefined | null;
    isLoading: boolean;
}

export const MonthChart = ({ allRecords, isLoading }: MonthChartProps) => {
    const { dateRanges } = useDateRanges();
    const monthlyRecords = useMemo(() => {
        if (!allRecords) return [];
        return allRecords.filter(r => {
            try {
                return isWithinInterval(safeParseDate(r.date), dateRanges.month);
            } catch {
                return false;
            }
        });
    }, [allRecords, dateRanges.month]);

    const monthlyTotal = useMemo(() => {
        if (!monthlyRecords) return 0;
        return monthlyRecords.reduce((acc, record) => acc + (record.totalFocusMinutes || 0), 0);
    }, [monthlyRecords]);

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
                    data={monthlyRecords || []}
                    loading={isLoading}
                    timeRange='month'
                    weekStartsOn={1} // weekStartsOn doesn't affect month view
                />
            </CardContent>
        </Card>
    );
};
