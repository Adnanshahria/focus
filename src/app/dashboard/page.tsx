'use client';

import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Header } from '@/components/header';
import { Clock, Target, Plus, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { format, parseISO, formatDistanceToNow, startOfDay } from 'date-fns';
import { AddFocusRecordDialog } from '@/components/dashboard/add-focus-record';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { StatCard } from '@/components/dashboard/stat-card';
import { TodayChart } from '@/components/dashboard/today-chart';
import { WeekChart } from '@/components/dashboard/week-chart';
import { MonthChart } from '@/components/dashboard/month-chart';
import { OverallChart } from '@/components/dashboard/overall-chart';
import { useDateRanges } from '@/hooks/use-date-ranges';

function formatDuration(minutes: number) {
  if (isNaN(minutes) || minutes < 0) return '0h 0m';
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return `${hours}h ${mins}m`;
}

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const { today } = useDateRanges();

  useEffect(() => {
    if (!isUserLoading && (!user || user.isAnonymous)) {
      router.push('/');
    }
  }, [user, isUserLoading, router]);

  const todayRecordQuery = useMemoFirebase(() => {
    if (!user) return null;
    return collection(firestore, `users/${user.uid}/focusRecords`);
  }, [user, firestore]);
  
  const { data: focusRecords, isLoading: focusRecordsLoading } = useCollection(todayRecordQuery);

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

  if (isUserLoading || !user || user.isAnonymous) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center p-4 pt-20">
          <Skeleton className="w-full h-full" />
        </main>
      </div>
    );
  }

  return (
    <>
      <AddFocusRecordDialog open={isAddDialogOpen} onOpenChange={setAddDialogOpen} />
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Header />
        <main className="flex-1 flex flex-col pt-20 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className='flex items-center gap-2'>
              <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                <Link href="/">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Progress</h1>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <StatCard title="Today's Focus" value={formatDuration(stats.todayFocus)} icon={Clock} />
              <StatCard title="Today's Pomos" value={String(stats.todayPomos)} icon={Target} />
               <Card className="col-span-1 sm:col-span-2 lg:col-span-1">
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                    <div>
                        <CardTitle className='text-base font-medium'>Recent Activity</CardTitle>
                        <CardDescription className="text-xs">Your last few sessions today.</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setAddDialogOpen(true)} className='shrink-0'>
                        <Plus className="h-4 w-4 mr-2" />
                        Log
                    </Button>
                </CardHeader>
                <CardContent>
                    {sessionsLoading ? (
                        <div className="space-y-4 pt-4">
                            <Skeleton className="h-8 w-full" />
                            <Skeleton className="h-8 w-full" />
                            <Skeleton className="h-8 w-4/5" />
                        </div>
                    ) : sessions && sessions.length > 0 ? (
                    <ul className="space-y-4 pt-4">
                        {sessions.map(session => (
                        <li key={session.id} className="flex justify-between items-center text-sm">
                            <div>
                            <span className='capitalize font-medium'>{session.type === 'manual' ? 'Manual Entry' : session.type.replace('B', ' B')} </span>
                            <p className="text-muted-foreground text-xs" title={new Date(session.startTime).toLocaleString()}>
                                {formatDistanceToNow(parseISO(session.startTime), { addSuffix: true })}
                            </p>
                            </div>
                            <span className="font-semibold">{Math.round(session.duration)}m</span>
                        </li>
                        ))}
                    </ul>
                    ) : (
                    <div className="text-muted-foreground text-sm text-center pt-8">No records for today.</div>
                    )}
                </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Today's Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    <TodayChart />
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Weekly Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    <WeekChart data={focusRecords || []} loading={focusRecordsLoading} />
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Monthly Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    <MonthChart data={focusRecords || []} loading={focusRecordsLoading} />
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Overall History</CardTitle>
                </CardHeader>
                <CardContent>
                    <OverallChart allRecords={focusRecords || []} loading={focusRecordsLoading} />
                </CardContent>
            </Card>
        </div>
      </main>
    </div>
    </>
  );
}
