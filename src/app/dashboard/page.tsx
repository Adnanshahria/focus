'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Header } from '@/components/header';
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
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { FloatingTimer } from '@/components/timer/floating-timer';

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();
  const [isAuthDialogOpen, setAuthDialogOpen] = useState(false);
  const { today } = useDateRanges();
  const todayDateString = format(today, 'yyyy-MM-dd');
  const [isDeepFocus, setDeepFocus] = useState(false);
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // --- Start of Optimized Data Fetching ---
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
    if (!isUserLoading && (!user || user.isAnonymous)) {
      router.push('/');
    }
  }, [user, isUserLoading, router]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setDeepFocus(false);
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);
  
  const handleEnterDeepFocus = () => {
    const element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen()
        .then(() => setDeepFocus(true))
        .catch(err => console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`));
    }
  };

  if (isDeepFocus) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
          <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="w-full h-full"
          >
              <FloatingTimer theme={theme as 'dark' | 'light' || 'dark'} toggleTheme={toggleTheme} />
          </motion.div>
      </div>
    );
  }
  
  if (isUserLoading && !allRecords) {
    return <DashboardSkeleton />;
  }
  
  return (
    <>
      <AddFocusRecordDialog open={isAuthDialogOpen} onOpenChange={setAuthDialogOpen} />
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Header onDeepFocusClick={handleEnterDeepFocus} />
        <main className="flex-1 p-4 pt-20 md:p-6 lg:p-8 max-w-6xl mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className='space-y-6'>
              <RecentActivityCard sessions={todaySessions} isLoading={areSessionsLoading} onLogClick={() => setAuthDialogOpen(true)} />
              <TodayChart todayRecord={todayRecord} isLoading={isTodayRecordLoading} sessions={todaySessions} />
            </div>
            <div className="space-y-6">
              <WeekChart allRecords={allRecords} isLoading={areAllRecordsLoading} />
              <MonthChart allRecords={allRecords} isLoading={areAllRecordsLoading} />
            </div>
          </div>
          <Card className="col-span-1 md:col-span-2">
            <OverallChart allRecords={allRecords} />
          </Card>
        </main>
      </div>
    </>
  );
}
