'use client';

import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { useMemo } from 'react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { collection, query, orderBy } from 'firebase/firestore';
import { format, parseISO } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { CardDescription } from '../ui/card';

function formatDuration(minutes: number) {
  if (isNaN(minutes) || minutes < 0) return '0h 0m';
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return `${hours}h ${mins}m`;
}

export const TodayChart = () => {
    const { user } = useUser();
    const firestore = useFirestore();
    const today = useMemo(() => new Date(), []);
    const todayDateString = useMemo(() => format(today, 'yyyy-MM-dd'), [today]);

    const sessionsQuery = useMemoFirebase(() => {
        if (!user || user.isAnonymous) return null;
        return query(
            collection(firestore, `users/${user.uid}/focusRecords/${todayDateString}/sessions`),
            orderBy('startTime', 'asc')
        );
    }, [user, firestore, todayDateString]);

    const { data: sessions, isLoading } = useCollection(sessionsQuery);

    const { chartData, totalMinutes } = useMemo(() => {
        const hourlyFocus = Array.from({ length: 24 }, (_, i) => ({
            time: `${String(i).padStart(2, '0')}:00`,
            minutes: 0,
        }));
        let total = 0;

        if (sessions) {
            sessions.forEach(session => {
                if (session.startTime && typeof session.duration === 'number') {
                    const start = parseISO(session.startTime);
                    const hour = start.getHours();
                    hourlyFocus[hour].minutes += session.duration;
                    total += session.duration;
                }
            });
        }
        return { chartData: hourlyFocus, totalMinutes: total };
    }, [sessions]);

    if (isLoading) return <Skeleton className="h-[250px] w-full" />;

    const hasData = chartData.some(d => d.minutes > 0);

    return (
        <div className="space-y-4">
             <CardDescription>
                Total Today: <span className="font-semibold text-foreground">{formatDuration(totalMinutes)}</span>
            </CardDescription>
            <div className="h-[250px] w-full">
                {hasData ? (
                    <ChartContainer config={{ minutes: { label: 'Minutes', color: 'hsl(var(--primary))' } }} className="w-full h-full">
                        <BarChart data={chartData} margin={{ top: 20, right: 20, left: -10, bottom: 0 }}>
                            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                            <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value, index) => index % 4 === 0 ? value : ''} />
                            <YAxis stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                            <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
                            <Bar dataKey="minutes" fill="hsl(var(--primary))" radius={4} />
                        </BarChart>
                    </ChartContainer>
                ) : (
                    <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                        No focus sessions recorded today.
                    </div>
                )}
            </div>
        </div>
    );
};
