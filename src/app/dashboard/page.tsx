'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import { Header } from '@/components/header';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AddFocusRecordDialog } from '@/components/dashboard/add-focus-record';
import { TodayChart } from '@/components/dashboard/today-chart';
import { WeekChart } from '@/components/dashboard/week-chart';
import { MonthChart } from '@/components/dashboard/month-chart';
import { OverallChart } from '@/components/dashboard/overall-chart';
import { RecentActivityCard } from '@/components/dashboard/recent-activity-card';
import { Card } from '@/components/ui/card';
import { DashboardSkeleton } from '@/components/dashboard/dashboard-skeleton';
import { useFirestore, useMemoFirebase } from '@/firebase/hooks/hooks';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query, orderBy, where, doc } from 'firebase/firestore';
import { format, startOfDay, isWithinInterval, startOfMonth } from 'date-fns';
import { useDateRanges } from '@/hooks/use-date-ranges';

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();
  const [isAuthDialogOpen, setAuthDialogOpen] = useState(false);
  const { today, dateRanges } = useDateRanges();
  const todayDateString = format(today, 'yyyy-MM-dd');

  // Unified query for current month's records to optimize initial load
  const monthlyRecordsQuery = useMemoFirebase(() => {
    if (!user || user.isAnonymous) return null;
    const monthStart = format(startOfMonth(today), 'yyyy-MM-dd');
    return query(
        collection(firestore, `users/${user.uid}/focusRecords`),
        where('date', '>=', monthStart),
        orderBy('date', 'asc')
    );
  }, [user, firestore, today]);

  const { data: currentMonthRecords, isLoading: areRecordsLoading } = useCollection(monthlyRecordsQuery);

  // Unified query for today's sessions
  const sessionsQuery = useMemoFirebase(() => {
    if (!user || user.isAnonymous) return null;
    return query(
      collection(firestore, `users/${user.uid}/focusRecords/${todayDateString}/sessions`),
      orderBy('startTime', 'desc'),
    );
  }, [user, firestore, todayDateString]);
  
  const { data: todaySessions, isLoading: areSessionsLoading } = useCollection(sessionsQuery);

  // Memoized derived data for charts
  const todayRecord = useMemo(() => currentMonthRecords?.find(r => r.id === todayDateString), [currentMonthRecords, todayDateString]);
  const weeklyRecords = useMemo(() => currentMonthRecords?.filter(r => isWithinInterval(new Date(r.date), dateRanges.week)), [currentMonthRecords, dateRanges.week]);
  const monthlyRecords = useMemo(() => currentMonthRecords, [currentMonthRecords]);

  useEffect(() => {
    if (!isUserLoading && (!user || user.isAnonymous)) {
      router.push('/');
    }
  }, [user, isUserLoading, router]);

  const isLoading = isUserLoading || areRecordsLoading || areSessionsLoading;

  if (isLoading) {
    return <DashboardSkeleton />;
  }
  
  return (
    <>
      <AddFocusRecordDialog open={isAuthDialogOpen} onOpenChange={setAuthDialogOpen} />
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Header />
        
        <div className="fixed top-14 left-0 right-0 bg-background/95 backdrop-blur-sm z-40 lg:hidden border-b">
          <div className="flex items-center justify-start gap-4 p-4 max-w-6xl mx-auto">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Record</h1>
          </div>
        </div>

        <main className="flex-1 flex flex-col p-4 md:p-6 lg:p-8 max-w-6xl mx-auto w-full">
          <div className="h-28 lg:h-14"></div>

          <div className="hidden lg:flex items-center justify-start gap-4 mb-6 w-full">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Record</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className='space-y-6'>
              <RecentActivityCard sessions={todaySessions} onLogClick={() => setAuthDialogOpen(true)} />
              <TodayChart todayRecord={todayRecord} sessions={todaySessions} />
            </div>
            <div className="space-y-6">
              <WeekChart weeklyRecords={weeklyRecords} />
              <MonthChart monthlyRecords={monthlyRecords} />
            </div>
          </div>
          <Card className="col-span-1 md:col-span-2">
            <OverallChart allRecords={currentMonthRecords} />
          </Card>
        </main>
      </div>
    </>
  );
}
