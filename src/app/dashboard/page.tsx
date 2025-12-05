'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Header } from '@/components/header';
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
import { StatsCards } from '@/components/dashboard/stats-cards';
import { useUserPreferences } from '@/hooks/use-user-preferences';

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();
  const [isAuthDialogOpen, setAuthDialogOpen] = useState(false);
  const { today } = useDateRanges();
  const todayDateString = format(today, 'yyyy-MM-dd');
  const [isDeepFocus, setDeepFocus] = useState(false);
  const { theme, setTheme } = useTheme();
  const { preferences } = useUserPreferences();

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
      router.replace('/');
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
        .catch(err => {
          console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
          setDeepFocus(true);
        });
    } else {
      setDeepFocus(true);
    }
  };

  if (isDeepFocus) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full h-full"
        >
          <FloatingTimer
            theme={(theme === 'dark' || theme === 'light') ? theme : 'dark'}
            toggleTheme={toggleTheme}
            todayRecord={todayRecord}
            dailyGoal={preferences?.dailyGoalMinutes ?? 120}
            onExit={() => setDeepFocus(false)}
          />
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
        <main className="flex-1 pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full pb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col space-y-8"
          >
            {/* Header Section */}
            <div className="flex flex-col space-y-1">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground to-foreground/50 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-muted-foreground">
                Welcome back, <span className="font-medium text-foreground">{user?.email?.split('@')[0] || 'User'}</span>. Here's your focus overview.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              <div className='lg:col-span-2 space-y-6'>
                <TodayChart todayRecord={todayRecord} isLoading={isTodayRecordLoading} sessions={todaySessions} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <WeekChart allRecords={allRecords} isLoading={areAllRecordsLoading} />
                  <MonthChart allRecords={allRecords} isLoading={areAllRecordsLoading} />
                </div>
              </div>
              <div className="space-y-6">
                <RecentActivityCard sessions={todaySessions} isLoading={areSessionsLoading} onLogClick={() => setAuthDialogOpen(true)} />

                {/* Enhanced Deep Focus Card */}
                <Card className="relative overflow-hidden p-6 flex flex-col justify-center items-center text-center space-y-4 bg-gradient-to-br from-primary/15 via-primary/5 to-transparent border-primary/20">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
                  <div className="relative z-10 flex flex-col items-center space-y-4">
                    <div className="p-3 rounded-full bg-primary/15 text-primary ring-2 ring-primary/20">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Deep Focus Mode</h3>
                      <p className="text-sm text-muted-foreground mt-1">Eliminate distractions and boost productivity.</p>
                    </div>
                    <button
                      onClick={handleEnterDeepFocus}
                      className="w-full py-2.5 px-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98]"
                    >
                      Enter Focus Mode
                    </button>
                  </div>
                </Card>
              </div>
            </div>

            <Card className="border-none shadow-none bg-transparent">
              <OverallChart allRecords={allRecords} />
            </Card>
          </motion.div>
        </main>
      </div>
    </>
  );
}
