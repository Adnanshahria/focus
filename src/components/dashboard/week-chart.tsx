'use client';
import { useMemo } from 'react';
import { HistoricalFocusChart } from './historical-focus-chart';
import { Card, CardContent } from '@/components/ui/card';
import { useUserPreferences, WeekStartDay } from '@/hooks/use-user-preferences';
import { isWithinInterval } from 'date-fns';
import { useDateRanges } from '@/hooks/use-date-ranges';
import { Calendar, TrendingUp, Clock } from 'lucide-react';

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

const DAYS = [
    { value: 0, label: 'Sun' },
    { value: 1, label: 'Mon' },
    { value: 2, label: 'Tue' },
    { value: 3, label: 'Wed' },
    { value: 4, label: 'Thu' },
    { value: 5, label: 'Fri' },
    { value: 6, label: 'Sat' },
];

interface WeekChartProps {
    allRecords: any[] | undefined | null;
    isLoading: boolean;
}

export const WeekChart = ({ allRecords, isLoading }: WeekChartProps) => {
    const { preferences, updatePreferences } = useUserPreferences();
    const weekStartsOn = preferences?.weekStartsOn ?? 1;
    const dailyGoal = preferences?.dailyGoalMinutes ?? 120;

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

    const dailyAverage = useMemo(() => {
        const daysWithData = weeklyRecords.filter(r => r.totalFocusMinutes > 0).length;
        return daysWithData > 0 ? Math.round(weeklyTotal / daysWithData) : 0;
    }, [weeklyRecords, weeklyTotal]);

    return (
        <Card className="overflow-hidden">
            {/* Gradient Header */}
            <div className="bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent p-4 pb-3">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-blue-500/10">
                            <Calendar className="w-4 h-4 text-blue-500" />
                        </div>
                        <h3 className="font-semibold tracking-tight">Weekly Activity</h3>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Total:</span>
                        <span className="text-sm font-bold">{formatDuration(weeklyTotal)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <TrendingUp className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Avg:</span>
                        <span className="text-sm font-bold">{formatDuration(dailyAverage)}/day</span>
                    </div>
                </div>

                {/* Week Start Selector - Pill Style */}
                <div className="flex items-center gap-1.5">
                    <span className="text-xs text-muted-foreground mr-1">Starts:</span>
                    <div className="flex gap-1 bg-background/50 p-1 rounded-lg">
                        {DAYS.map(day => (
                            <button
                                key={day.value}
                                onClick={() => updatePreferences({ weekStartsOn: day.value as WeekStartDay })}
                                className={`
                                    px-2 py-1 text-xs font-medium rounded-md transition-all duration-200
                                    ${weekStartsOn === day.value
                                        ? 'bg-primary text-primary-foreground shadow-sm'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                                    }
                                `}
                            >
                                {day.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <CardContent className="pt-3">
                <HistoricalFocusChart
                    data={weeklyRecords || []}
                    loading={isLoading}
                    timeRange='week'
                    weekStartsOn={weekStartsOn as WeekStartDay}
                    goalMinutes={dailyGoal}
                />
            </CardContent>
        </Card>
    );
};
