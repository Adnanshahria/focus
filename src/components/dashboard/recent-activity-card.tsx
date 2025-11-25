'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Target, Plus } from 'lucide-react';
import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { useDateRanges } from '@/hooks/use-date-ranges';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';

function formatDuration(minutes: number) {
  if (isNaN(minutes) || minutes < 0) return '0h 0m';
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return `${hours}h ${mins}m`;
}

interface RecentActivityCardProps {
  focusRecords: any[];
  onLogClick: () => void;
}

export const RecentActivityCard = ({ focusRecords, onLogClick }: RecentActivityCardProps) => {
  const { today } = useDateRanges();
  const { user } = useUser();
  const firestore = useFirestore();

  const stats = useMemo(() => {
    const todayDateStr = format(today, 'yyyy-MM-dd');
    const todayRecord = focusRecords?.find(r => r.id === todayDateStr);
    return {
      todayPomos: todayRecord?.totalPomos || 0,
      todayFocus: todayRecord?.totalFocusMinutes || 0,
    };
  }, [focusRecords, today]);

  const sessionsQuery = useMemoFirebase(() => {
    if (!user || user.isAnonymous) return null;
    return query(
      collection(firestore, `users/${user.uid}/focusRecords/${format(today, 'yyyy-MM-dd')}/sessions`),
      orderBy('startTime', 'desc'),
      limit(5)
    );
  }, [user, firestore, today]);

  const { data: sessions, isLoading: sessionsLoading } = useCollection(sessionsQuery);

  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Your latest focus sessions and daily stats.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center p-4 rounded-lg border bg-background">
                <Clock className="w-6 h-6 mr-4 text-primary" />
                <div>
                    <p className="text-xs text-muted-foreground">Today's Focus</p>
                    <p className="text-xl font-bold">{formatDuration(stats.todayFocus)}</p>
                </div>
            </div>
             <div className="flex items-center p-4 rounded-lg border bg-background">
                <Target className="w-6 h-6 mr-4 text-primary" />
                <div>
                    <p className="text-xs text-muted-foreground">Today's Pomos</p>
                    <p className="text-xl font-bold">{stats.todayPomos}</p>
                </div>
            </div>
        </div>

        <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium">Today's Sessions</h4>
             <Button variant="outline" size="sm" onClick={onLogClick} className='shrink-0'>
                <Plus className="h-4 w-4 mr-2" />
                Log
            </Button>
        </div>
        
        {sessionsLoading ? (
          <div className="space-y-4 pt-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-4/5" />
          </div>
        ) : sessions && sessions.length > 0 ? (
          <ul className="space-y-4 pt-2">
            {sessions.map(session => (
              <li key={session.id} className="flex justify-between items-center text-sm">
                <div>
                  <span className='capitalize font-medium'>{session.type === 'manual' ? 'Manual Entry' : session.type.replace('B', ' B')}</span>
                  <p className="text-muted-foreground text-xs" title={new Date(session.startTime).toLocaleString()}>
                    {formatDistanceToNow(parseISO(session.startTime), { addSuffix: true })}
                  </p>
                </div>
                <span className="font-semibold">{Math.round(session.duration)}m</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-muted-foreground text-sm text-center py-8">No records for today.</div>
        )}
      </CardContent>
    </Card>
  );
};
