'use client';

import { useMemo, useState, useEffect } from 'react';
import { parseISO } from 'date-fns';
import { Card, CardContent } from '../ui/card';
import { DailyFocusChart } from './daily-focus-chart';
import { Skeleton } from '../ui/skeleton';
import { Clock, Flame, Target } from 'lucide-react';
import { useUserPreferences } from '@/hooks/use-user-preferences';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

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
    const { preferences, updatePreferences } = useUserPreferences();
    const dailyGoal = preferences?.dailyGoalMinutes ?? 120; // Default 2 hours

    const [goalHours, setGoalHours] = useState(Math.floor(dailyGoal / 60));
    const [goalMinutes, setGoalMinutes] = useState(dailyGoal % 60);
    const [isOpen, setIsOpen] = useState(false);

    // Sync local state with preferences when not editing
    useEffect(() => {
        if (!isOpen) {
            setGoalHours(Math.floor(dailyGoal / 60));
            setGoalMinutes(dailyGoal % 60);
        }
    }, [dailyGoal, isOpen]);

    const handleSaveGoal = () => {
        const totalMinutes = (Number(goalHours) || 0) * 60 + (Number(goalMinutes) || 0);
        updatePreferences({ dailyGoalMinutes: totalMinutes });
        setIsOpen(false);
    };

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
            {/* Gradient Header */}
            <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 pb-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-4 gap-4 sm:gap-0">
                    <div>
                        <h3 className="text-lg font-semibold tracking-tight">Today's Activity</h3>
                        <p className="text-sm text-muted-foreground">Track your daily focus progress</p>
                    </div>
                    <Popover open={isOpen} onOpenChange={setIsOpen}>
                        <PopoverTrigger asChild>
                            <div
                                className="flex items-center gap-2 text-sm cursor-pointer hover:bg-background/50 p-2 rounded-md transition-colors border border-transparent hover:border-border/50 w-full sm:w-auto justify-between sm:justify-start"
                                role="button"
                                title="Click to set daily goal"
                            >
                                <div className="flex items-center gap-2">
                                    <Target className="w-4 h-4 text-primary" />
                                    <span className="text-muted-foreground">Goal:</span>
                                </div>
                                <span className="font-medium">{formatDuration(dailyGoal)}</span>
                            </div>
                        </PopoverTrigger>
                        <PopoverContent className="w-80" align="end">
                            <div className="grid gap-4">
                                <div className="space-y-2">
                                    <h4 className="font-medium leading-none">Set Daily Goal</h4>
                                    <p className="text-sm text-muted-foreground">
                                        Set your daily focus target.
                                    </p>
                                </div>
                                <div className="flex gap-4">
                                    <div className="grid gap-2 flex-1">
                                        <Label htmlFor="hours">Hours</Label>
                                        <Input
                                            id="hours"
                                            type="number"
                                            min="0"
                                            max="24"
                                            value={goalHours}
                                            onChange={(e: any) => setGoalHours(Number(e.target.value))}
                                        />
                                    </div>
                                    <div className="grid gap-2 flex-1">
                                        <Label htmlFor="minutes">Minutes</Label>
                                        <Input
                                            id="minutes"
                                            type="number"
                                            min="0"
                                            max="59"
                                            value={goalMinutes}
                                            onChange={(e: any) => setGoalMinutes(Number(e.target.value))}
                                        />
                                    </div>
                                </div>
                                <Button onClick={handleSaveGoal} className="w-full">Save Goal</Button>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
