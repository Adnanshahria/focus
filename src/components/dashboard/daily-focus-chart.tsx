'use client';

import { useMemo } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { parseISO } from 'date-fns';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export function DailyFocusChart() {
  const { user } = useUser();
  const firestore = useFirestore();

  const today = new Date().toISOString().split('T')[0];

  const sessionsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(
      collection(firestore, `users/${user.uid}/focusRecords/${today}/sessions`),
      orderBy('startTime', 'desc')
    );
  }, [user, firestore, today]);

  const { data: sessions, isLoading } = useCollection(sessionsQuery);

  const chartData = useMemo(() => {
    const hourlyFocus = Array.from({ length: 24 }, (_, i) => ({
      time: `${String(i).padStart(2, '0')}:00`,
      minutes: 0,
    }));

    if (sessions) {
      sessions.forEach(session => {
        const start = parseISO(session.startTime);
        const hour = start.getHours();
        hourlyFocus[hour].minutes += session.duration;
      });
    }

    return hourlyFocus;
  }, [sessions]);

  if (isLoading) {
    return <div className="text-center text-muted-foreground p-4">Loading daily data...</div>
  }

  const hasData = chartData.some(d => d.minutes > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Focus Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        {hasData ? (
          <div className="h-[250px] w-full">
            <ChartContainer config={{}} className="w-full h-full">
              <BarChart data={chartData} margin={{ top: 20, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value, index) => index % 4 === 0 ? value : ''}/>
                <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
                <Bar dataKey="minutes" fill="hsl(var(--primary))" radius={4} />
              </BarChart>
            </ChartContainer>
          </div>
        ) : (
          <div className="h-[250px] flex items-center justify-center text-muted-foreground">
            No focus sessions recorded today.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
