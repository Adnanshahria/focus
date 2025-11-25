'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
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
import { useCollection, useDoc } from '@/firebase';
import { collection, query, orderBy, doc } from 'firebase/firestore';
import { format } from 'date-fns';
import { useDateRanges } from '@/hooks/use-date-ranges';
import { cn } from '@/lib/utils';

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();
  const [isAuthDialogOpen, setAuthDialogOpen] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const { today } = useDateRanges();
  const todayDateString = format(today, 'yyyy-MM-dd');

  // --- Start of Optimized Data Fetching ---

  // 1. Memoize reference for Today's Data for instant load
  const todayRecordRef = useMemoFirebase(() => {
    if (!user || user.isAnonymous) return null;
    return doc(firestore, `users/${user.uid}/focusRecords`, todayDateString);
  }, [user, firestore, todayDateString]);
  
  const { data: todayRecord, isLoading: isTodayRecordLoading } = useDoc(todayRecordRef);

  const sessionsQuery = useMemoFirebase(() => {
    if (!user || user.isAnonymous) return null;
    return query(
      collection(firestore, `users/${user.uid}/focusRecords/${todayDateString}/sessions`),
      orderBy('startTime', 'desc'),
    );
  }, [user, firestore, todayDateString]);
  
  const { data: todaySessions, isLoading: areSessionsLoading } = useCollection(sessionsQuery);

  // 2. Memoize query for historical data for charts in the background
  const historicalRecordsQuery = useMemoFirebase(() => {
    if (!user || user.isAnonymous) return null;
    return query(
        collection(firestore, `users/${user.uid}/focusRecords`),
        orderBy('date', 'asc')
    );
  }, [user, firestore]);

  const { data: allRecords, isLoading: areAllRecordsLoading } = useCollection(historicalRecordsQuery);
  
  // --- End of Optimized Data Fetching ---

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsHeaderVisible(false);
      } else {
        setIsHeaderVisible(true);
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isUserLoading && (!user || user.isAnonymous)) {
      router.push('/');
    }
  }, [user, isUserLoading, router]);
  
  // The main page skeleton only waits for the user auth check.
  // Individual components will handle their own loading states.
  if (isUserLoading) {
    return <DashboardSkeleton />;
  }
  
  return (
    <>
      <AddFocusRecordDialog open={isAuthDialogOpen} onOpenChange={setAuthDialogOpen} />
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Header />
        
        <div className={cn(
          "fixed top-14 left-0 right-0 bg-background/95 backdrop-blur-sm z-40 lg:hidden border-b transition-transform duration-300",
          isHeaderVisible ? "translate-y-0" : "-translate-y-full"
        )}>
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
              <RecentActivityCard sessions={todaySessions} isLoading={areSessionsLoading} onLogClick={() => setAuthDialogOpen(true)} />
              <TodayChart todayRecord={todayRecord} isLoading={isTodayRecordLoading} sessions={todaySessions} />
            </div>
            <div className="space-y-6">
              {/* These components now handle their own loading state internally */}
              <WeekChart allRecords={allRecords} isLoading={areAllRecordsLoading} />
              <MonthChart allRecords={allRecords} isLoading={areAllRecordsLoading} />
            </div>
          </div>
          <Card className="col-span-1 md:col-span-2">
            {/* This component handles its own loading state internally */}
            <OverallChart allRecords={allRecords} />
          </Card>
        </main>
      </div>
    </>
  );
}
