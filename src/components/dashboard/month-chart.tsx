'use client';
import { useMemo } from 'react';
import { HistoricalFocusChart } from './historical-focus-chart';
import { Card, CardContent } from '../ui/card';
import { isWithinInterval, format } from 'date-fns';
import { useDateRanges } from '@/hooks/use-date-ranges';
import { useUserPreferences } from '@/hooks/use-user-preferences';
import { CalendarDays, TrendingUp, Clock } from 'lucide-react';

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
    const { dateRanges, today } = useDateRanges();
    const { preferences } = useUserPreferences();
    const dailyGoal = preferences?.dailyGoalMinutes ?? 120;

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

    const dailyAverage = useMemo(() => {
        const daysWithData = monthlyRecords.filter(r => r.totalFocusMinutes > 0).length;
        return daysWithData > 0 ? Math.round(monthlyTotal / daysWithData) : 0;
    }, [monthlyRecords, monthlyTotal]);

    const currentMonth = format(today, 'MMMM yyyy');

    return (
        <Card className="overflow-hidden">
            {/* Gradient Header */}
            <div className="bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent p-4 pb-3">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-purple-500/10">
                            <CalendarDays className="w-4 h-4 text-purple-500" />
                        </div>
                        <div>
                            <h3 className="font-semibold tracking-tight">Monthly Activity</h3>
                            <p className="text-xs text-muted-foreground">{currentMonth}</p>
                        </div>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Total:</span>
                        <span className="text-sm font-bold">{formatDuration(monthlyTotal)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <TrendingUp className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Avg:</span>
                        <span className="text-sm font-bold">{formatDuration(dailyAverage)}/day</span>
                    </div>
                </div>
            </div>

            <CardContent className="pt-3">
                <HistoricalFocusChart
                    data={monthlyRecords || []}
                    loading={isLoading}
                    timeRange='month'
                    weekStartsOn={1}
                    goalMinutes={dailyGoal}
                />
            </CardContent>
        </Card>
    );
};
