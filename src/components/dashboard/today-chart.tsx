'use client';

import { useUser, useFirestore, useDoc, useMemoFirebase, useCollection } from '@/firebase';
import { useMemo } from 'react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { collection, query, orderBy, doc } from 'firebase/firestore';
import { format, parseISO } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { CardDescription, Card, CardHeader, CardTitle, CardContent } from '../ui/card';

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

    const focusRecordRef = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        return doc(firestore, `users/${user.uid}/focusRecords`, todayDateString);
    }, [user, firestore, todayDateString]);
    
    const { data: todayRecord, isLoading: recordLoading } = useDoc(focusRecordRef);

    const sessionsQuery = useMemoFirebase(() => {
        if (!user || user.isAnonymous) return null;
        return query(
            collection(firestore, `users/${user.uid}/focusRecords/${todayDateString}/sessions`),
            orderBy('startTime', 'asc')
        );
    }, [user, firestore, todayDateString]);

    const { data: sessions, isLoading: sessionsLoading } = useCollection(sessionsQuery);

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

    const isLoading = recordLoading || sessionsLoading;

    if (isLoading && user && !user.isAnonymous) return <Skeleton className="h-[300px] w-full" />;
    
    const totalMinutes = todayRecord?.totalFocusMinutes || 0;
    const totalPomos = todayRecord?.totalPomos || 0;
    const hasData = hourlyChartData.some(d => d.minutes > 0);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Today's Activity</CardTitle>
                <CardDescription>
                    Focus: <span className="font-semibold text-foreground">{formatDuration(totalMinutes)}</span>
                    <span className='mx-2'>|</span>
                    Pomos: <span className="font-semibold text-foreground">{totalPomos}</span>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[200px] w-full">
                    {hasData ? (
                        <ChartContainer config={{ minutes: { label: 'Minutes', color: 'hsl(var(--primary))' } }} className="w-full h-full">
                            <BarChart data={hourlyChartData} margin={{ top: 20, right: 20, left: -10, bottom: 0 }}>
                                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                                <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value, index) => index % 4 === 0 ? value : ''} />
                                <YAxis stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                                <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
                                <Bar dataKey="minutes" fill="hsl(var(--primary))" radius={4} />
                            </BarChart>
                        </ChartContainer>
                    ) : (
                        <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                            No focus sessions recorded today.
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};
