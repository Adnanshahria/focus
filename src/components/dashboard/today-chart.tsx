'use client';

import { useMemo } from 'react';
import { parseISO } from 'date-fns';
import { Card, CardContent } from '../ui/card';
import { DailyFocusChart } from './daily-focus-chart';
import { Skeleton } from '../ui/skeleton';
import { Clock, Flame, Target } from 'lucide-react';
import { useUserPreferences } from '@/hooks/use-user-preferences';

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
    if (typeof date === 'string') return parseISO(date);
    if (date.toDate && typeof date.toDate === 'function') return date.toDate();
    if (date.seconds) return new Date(date.seconds * 1000);
    return new Date();
}

interface TodayChartProps {
    todayRecord: any;
    sessions: any[] | null | undefined;
    isLoading: boolean;
}

export const TodayChart = ({ todayRecord, sessions, isLoading }: TodayChartProps) => {
    const { preferences } = useUserPreferences();
    const dailyGoal = preferences?.dailyGoalMinutes ?? 120; // Default 2 hours

    const hourlyChartData = useMemo(() => {
        const hourlyFocus = Array.from({ length: 24 }, (_, i) => ({
            time: `${String(i).padStart(2, '0')}:00`,
            minutes: 0,
        }));

        if (sessions) {
            sessions.forEach(session => {
                if (session.startTime && typeof session.duration === 'number') {
                    try {
                        const start = safeParseDate(session.startTime);
                        const hour = start.getHours();
                        hourlyFocus[hour].minutes += session.duration;
                    } catch (e) {
                        console.error("Error parsing session date:", e);
                    }
                }
            });
        }
        return hourlyFocus;
    }, [sessions]);

    const totalMinutes = todayRecord?.totalFocusMinutes || 0;
    const totalPomos = todayRecord?.totalPomos || 0;
    const goalProgress = dailyGoal > 0 ? Math.min((totalMinutes / dailyGoal) * 100, 100) : 0;

    return (
        <Card className="overflow-hidden">
            {/* Gradient Header */}
            <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 pb-4">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-lg font-semibold tracking-tight">Today's Activity</h3>
                        <p className="text-sm text-muted-foreground">Track your daily focus progress</p>
                    </div>
                    {dailyGoal > 0 && (
                        <div className="flex items-center gap-2 text-sm">
                            <Target className="w-4 h-4 text-primary" />
                            <span className="text-muted-foreground">Goal:</span>
                            <span className="font-medium">{formatDuration(dailyGoal)}</span>
                        </div>
                    )}
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-3 gap-3">
                    {/* Focus Time Card */}
                    <div className="bg-background/60 backdrop-blur-sm rounded-xl p-3 border border-border/50 shadow-sm">
                        {isLoading ? (
                            <Skeleton className="h-12 w-full" />
                        ) : (
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-primary/10">
                                    <Clock className="w-4 h-4 text-primary" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Focus Time</p>
                                    <p className="text-lg font-bold tracking-tight">{formatDuration(totalMinutes)}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Pomos Card */}
                    <div className="bg-background/60 backdrop-blur-sm rounded-xl p-3 border border-border/50 shadow-sm">
                        {isLoading ? (
                            <Skeleton className="h-12 w-full" />
                        ) : (
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-orange-500/10">
                                    <Flame className="w-4 h-4 text-orange-500" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Pomodoros</p>
                                    <p className="text-lg font-bold tracking-tight">{totalPomos}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Goal Progress Card */}
                    <div className="bg-background/60 backdrop-blur-sm rounded-xl p-3 border border-border/50 shadow-sm">
                        {isLoading ? (
                            <Skeleton className="h-12 w-full" />
                        ) : (
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <svg className="w-10 h-10 -rotate-90">
                                        <circle
                                            cx="20"
                                            cy="20"
                                            r="16"
                                            fill="none"
                                            stroke="hsl(var(--muted))"
                                            strokeWidth="3"
                                        />
                                        <circle
                                            cx="20"
                                            cy="20"
                                            r="16"
                                            fill="none"
                                            stroke="hsl(var(--primary))"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                            strokeDasharray={`${goalProgress} 100`}
                                            className="transition-all duration-500"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Goal</p>
                                    <p className="text-lg font-bold tracking-tight">{Math.round(goalProgress)}%</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <CardContent className="pt-4">
                {isLoading ? (
                    <Skeleton className='h-[200px] w-full rounded-lg' />
                ) : (
                    <DailyFocusChart data={hourlyChartData} goalMinutes={dailyGoal} />
                )}
            </CardContent>
        </Card>
    );
};
