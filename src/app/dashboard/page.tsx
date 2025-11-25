'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Header } from '@/components/header';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AddFocusRecordDialog } from '@/components/dashboard/add-focus-record';
import { Skeleton } from '@/components/ui/skeleton';
import { TodayChart } from '@/components/dashboard/today-chart';
import { WeekChart } from '@/components/dashboard/week-chart';
import { MonthChart } from '@/components/dashboard/month-chart';
import { OverallChart } from '@/components/dashboard/overall-chart';
import { RecentActivityCard } from '@/components/dashboard/recent-activity-card';
import { Card } from '@/components/ui/card';

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [isAuthDialogOpen, setAuthDialogOpen] = useState(false);
  
  useEffect(() => {
    if (!isUserLoading && (!user || user.isAnonymous)) {
      router.push('/');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user || user.isAnonymous) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center p-4 pt-20 max-w-6xl mx-auto w-full">
          <div className="w-full space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className='flex items-center gap-2'>
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-32" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className='space-y-6'>
                  <Skeleton className="h-[250px] w-full" />
                  <Skeleton className="h-[300px] w-full" />
              </div>
              <div className="space-y-6">
                  <Skeleton className="h-[300px] w-full" />
                  <Skeleton className="h-[300px] w-full" />
              </div>
            </div>
            <Skeleton className="h-[400px] w-full" />
          </div>
        </main>
      </div>
    );
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
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Progress</h1>
          </div>
        </div>

        <main className="flex-1 flex flex-col p-4 md:p-6 lg:p-8 max-w-6xl mx-auto w-full">
          {/* This spacer div creates space for the two fixed headers on mobile/desktop */}
          <div className="h-28 lg:h-14"></div>

          <div className="hidden lg:flex items-center justify-start gap-4 mb-6 w-full">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Progress</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className='space-y-6'>
                <RecentActivityCard onLogClick={() => setAuthDialogOpen(true)} />
                <TodayChart />
            </div>
            <div className="space-y-6">
                 <WeekChart />
                 <MonthChart />
            </div>
          </div>
          <Card className="col-span-1 md:col-span-2">
            <OverallChart />
          </Card>
        </main>
      </div>
    </>
  );
}
