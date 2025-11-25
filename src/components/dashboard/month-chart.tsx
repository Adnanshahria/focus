'use client';
import { useMemo } from 'react';
import { HistoricalFocusChart } from './historical-focus-chart';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../ui/card';
import { useDateRanges } from '@/hooks/use-date-ranges';
import { useUser } from '@/firebase';
import { useFirestore, useMemoFirebase } from '@/firebase/hooks/hooks';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { format } from 'date-fns';

function formatDuration(minutes: number) {
  if (isNaN(minutes) || minutes < 0) return '0h 0m';
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return `${hours}h ${mins}m`;
}

export const MonthChart = () => {
    const { user } = useUser();
    const firestore = useFirestore();
    const { dateRanges } = useDateRanges();
    const { start, end } = dateRanges.month;

    const monthlyQuery = useMemoFirebase(() => {
        if (!user) return null;
        return query(
            collection(firestore, `users/${user.uid}/focusRecords`),
            where('date', '>=', format(start, 'yyyy-MM-dd')),
            where('date', '<=', format(end, 'yyyy-MM-dd')),
            orderBy('date', 'asc')
        );
    }, [user, firestore, start, end]);

    const { data, isLoading: loading } = useCollection(monthlyQuery);

    const monthlyTotal = useMemo(() => {
        if (!data) return 0;
        return data.reduce((acc, record) => acc + record.totalFocusMinutes, 0);
    }, [data]);

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
                    data={data || []} 
                    loading={loading} 
                    timeRange='month'
                    weekStartsOn={1} // weekStartsOn doesn't affect month view
                />
            </CardContent>
        </Card>
    );
};
