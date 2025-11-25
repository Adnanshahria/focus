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
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  
  useEffect(() => {
    if (!isUserLoading && (!user || user.isAnonymous)) {
      router.push('/');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user || user.isAnonymous) {
    return (
      <div className="flex flex-col min-h-screen bg-card">
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
        <main className="flex-1 flex flex-col pt-20 p-4 md:p-6 lg:p-8 max-w-6xl mx-auto w-full">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className='flex items-center gap-2'>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Progress</h1>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className='space-y-6'>
                <RecentActivityCard onLogClick={() => setAddDialogOpen(true)} />
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
