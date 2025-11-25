'use client';

import { useMemo } from 'react';
import { parseISO } from 'date-fns';
import { CardDescription, Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { DailyFocusChart } from './daily-focus-chart';
import { Skeleton } from '../ui/skeleton';

function formatDuration(minutes: number) {
  if (isNaN(minutes) || minutes < 0) return '0h 0m';
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return `${hours}h ${mins}m`;
}

interface TodayChartProps {
    todayRecord: any;
    sessions: any[] | null | undefined;
    isLoading: boolean;
}

export const TodayChart = ({ todayRecord, sessions, isLoading }: TodayChartProps) => {
    const hourlyChartData = useMemo(() => {
        const hourlyFocus = Array.from({ length: 24 }, (_, i) => ({
            time: `${String(i).padStart(2, '0')}:00`,
            minutes: 0,
        }));

        if (sessions) {
            sessions.forEach(session => {
                if (session.startTime && typeof session.duration === 'number') {
                    const start = parseISO(session.startTime);
                    const hour = start.getHours();
                    hourlyFocus[hour].minutes += session.duration;
                }
            });
        }
        return hourlyFocus;
    }, [sessions]);
    
    const totalMinutes = todayRecord?.totalFocusMinutes || 0;
    const totalPomos = todayRecord?.totalPomos || 0;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Today's Activity</CardTitle>
                 {isLoading ? (
                    <Skeleton className="h-5 w-32 mt-1" />
                ) : (
                    <CardDescription>
                        Focus: <span className="font-semibold text-foreground">{formatDuration(totalMinutes)}</span>
                        <span className='mx-2'>|</span>
                        Pomos: <span className="font-semibold text-foreground">{totalPomos}</span>
                    </CardDescription>
                )}
            </CardHeader>
            <CardContent>
                {isLoading ? <Skeleton className='h-[200px] w-full' /> : <DailyFocusChart data={hourlyChartData} />}
            </CardContent>
        </Card>
    );
};
