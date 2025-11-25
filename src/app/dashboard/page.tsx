'use client';

import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Header } from '@/components/header';
import { Clock, Target, Plus, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { collection } from 'firebase/firestore';
import { format, parseISO, formatDistanceToNow } from 'date-fns';
import { AddFocusRecordDialog } from '@/components/dashboard/add-focus-record';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { TodayChart } from '@/components/dashboard/today-chart';
import { WeekChart } from '@/components/dashboard/week-chart';
import { MonthChart } from '@/components/dashboard/month-chart';
import { OverallChart } from '@/components/dashboard/overall-chart';
import { useDateRanges } from '@/hooks/use-date-ranges';
import { RecentActivityCard } from '@/components/dashboard/recent-activity-card';

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  
  useEffect(() => {
    if (!isUserLoading && (!user || user.isAnonymous)) {
      router.push('/');
    }
  }, [user, isUserLoading, router]);

  const allRecordsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return collection(firestore, `users/${user.uid}/focusRecords`);
  }, [user, firestore]);
  
  const { data: focusRecords, isLoading: focusRecordsLoading } = useCollection(allRecordsQuery);

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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <RecentActivityCard 
              focusRecords={focusRecords || []}
              onLogClick={() => setAddDialogOpen(true)}
            />
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
             <Card className="lg:col-span-2">
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
