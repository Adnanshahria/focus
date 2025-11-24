'use client';

import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Header } from '@/components/header';
import { Clock, Target, Plus, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { collection, query, orderBy, limit, where } from 'firebase/firestore';
import { format, parseISO, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfDay, eachDayOfInterval, formatDistanceToNow, add } from 'date-fns';
import { AddFocusRecordDialog } from '@/components/dashboard/add-focus-record';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { cn } from '@/lib/utils';

function formatDuration(minutes: number) {
  if (isNaN(minutes) || minutes < 0) return '0h 0m';
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return `${hours}h ${mins}m`;
}

type ChartData = {
  date: string;
  totalFocusMinutes: number;
}

const StatCard = ({ title, value, icon: Icon, description }: { title: string, value: string, icon: React.ElementType, description?: string }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </CardContent>
    </Card>
);

const DailyFocusChart = () => {
    const { user } = useUser();
    const firestore = useFirestore();
    const today = useMemo(() => new Date(), []);
    const todayDateString = useMemo(() => format(today, 'yyyy-MM-dd'), [today]);

    const sessionsQuery = useMemoFirebase(() => {
        if (!user || user.isAnonymous) return null;
        return query(
            collection(firestore, `users/${user.uid}/focusRecords/${todayDateString}/sessions`),
            orderBy('startTime', 'asc')
        );
    }, [user, firestore, todayDateString]);

    const { data: sessions, isLoading } = useCollection(sessionsQuery);

    const chartData = useMemo(() => {
        const hourlyFocus = Array.from({ length: 24 }, (_, i) => ({
            time: `${String(i).padStart(2, '0')}:00`,
            minutes: 0,
        }));

        if (sessions) {
            sessions.forEach(session => {
                if (session.startTime && typeof session.duration === 'number') {
                    const start = parseISO(session.startTime);
                    const hour = start.getHours();
                    hourlyFocus[hour].minutes += session.duration;
                }
            });
        }
        return hourlyFocus;
    }, [sessions]);

    if (isLoading) return <Skeleton className="h-[250px] w-full" />;

    const hasData = chartData.some(d => d.minutes > 0);

    return (
        <div className="h-[250px] w-full">
            {hasData ? (
                <ChartContainer config={{ minutes: { label: 'Minutes', color: 'hsl(var(--primary))' } }} className="w-full h-full">
                    <BarChart data={chartData} margin={{ top: 20, right: 20, left: -10, bottom: 0 }}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value, index) => index % 4 === 0 ? value : ''} />
                        <YAxis stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                        <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
                        <Bar dataKey="minutes" fill="hsl(var(--primary))" radius={4} />
                    </BarChart>
                </ChartContainer>
            ) : (
                <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                    No focus sessions recorded today.
                </div>
            )}
        </div>
    );
};

const renderChart = (data: ChartData[], loading: boolean, timeRange: 'week' | 'month', dateRanges: any) => {
    if (loading) return <Skeleton className="h-[250px] w-full" />;
    
    let chartData = data;
    let tickFormatter = (val: string) => format(parseISO(val), 'MMM d');
    
    if (timeRange === 'week' || timeRange === 'month') {
        const { start, end } = dateRanges[timeRange];
        const interval = eachDayOfInterval({ start, end });
        const dataMap = new Map(data.map(d => [d.date, d.totalFocusMinutes]));

        chartData = interval.map(day => {
            const dateStr = format(day, 'yyyy-MM-dd');
            return {
                date: dateStr,
                totalFocusMinutes: dataMap.get(dateStr) || 0,
            }
        });

        if (timeRange === 'month') {
            tickFormatter = (val: string, index: number) => {
                const date = parseISO(val);
                if(date.getDate() === 1 || (date.getDate() - 1) % 7 === 0) {
                    return format(date, 'd');
                }
                return '';
            }
        }
    }
    
    if (chartData.length === 0) return <div className="text-center p-4 text-muted-foreground h-[250px] flex items-center justify-center">No data for this period.</div>;

    return (
      <ChartContainer config={{ totalFocusMinutes: { label: 'Minutes', color: 'hsl(var(--primary))' } }} className="w-full h-[250px]">
        <BarChart data={chartData} margin={{ top: 20, right: 20, bottom: 5, left: -10 }}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tickFormatter={tickFormatter}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            interval="preserveStartEnd"
          />
          <YAxis stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
          <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
          <Bar dataKey="totalFocusMinutes" fill="hsl(var(--primary))" radius={4} />
        </BarChart>
      </ChartContainer>
    );
}

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('week');
  
  useEffect(() => {
    if (!isUserLoading && (!user || user.isAnonymous)) {
      router.push('/');
    }
  }, [user, isUserLoading, router]);
  
  const today = useMemo(() => startOfDay(new Date()), []);
  const dateRanges = useMemo(() => {
    const endOfWeekDate = endOfWeek(today, { weekStartsOn: 1 });
    return {
      day: { start: today, end: today },
      week: { start: startOfWeek(today, { weekStartsOn: 1 }), end: endOfWeekDate },
      month: { start: startOfMonth(today), end: endOfMonth(today) },
    }
  }, [today]);
  
  const focusRecordsQuery = useMemoFirebase(() => {
    if (!user || user.isAnonymous) return null;
    const { start, end } = dateRanges[timeRange];
    
    // Firestore does not allow orderBy on a different field than a range comparison.
    // We will sort by date client-side after fetching.
    return query(collection(firestore, `users/${user.uid}/focusRecords`), 
        where('date', '>=', format(start, 'yyyy-MM-dd')),
        where('date', '<=', format(end, 'yyyy-MM-dd'))
    );
  }, [user, firestore, timeRange, dateRanges]);

  const { data: focusRecords, isLoading: focusRecordsLoading } = useCollection(focusRecordsQuery);

  const totalFocusForPeriod = useMemo(() => {
    if (!focusRecords) return 0;
    return focusRecords.reduce((acc, record) => acc + (record.totalFocusMinutes || 0), 0);
  }, [focusRecords]);

  const sortedFocusRecords = useMemo(() => {
      if (!focusRecords) return [];
      return [...focusRecords].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [focusRecords]);

  const stats = useMemo(() => {
    const todayDateStr = format(today, 'yyyy-MM-dd');
    const todayRecord = sortedFocusRecords.find(r => r.id === todayDateStr);
    
    return {
      todayPomos: todayRecord?.totalPomos || 0,
      todayFocus: todayRecord?.totalFocusMinutes || 0,
    };
  }, [sortedFocusRecords, today]);
  
  const sessionsQuery = useMemoFirebase(() => {
    if (!user || user.isAnonymous) return null;
    return query(
        collection(firestore, `users/${user.uid}/focusRecords/${format(today, 'yyyy-MM-dd')}/sessions`),
        orderBy('startTime', 'desc'),
        limit(5)
    );
  }, [user, firestore, today]);

  const { data: sessions, isLoading: sessionsLoading } = useCollection(sessionsQuery);

  const chartSourceData = useMemo(() => {
    if (!focusRecords) return [];
    // Ensure we use the unsorted records for the chart source as it will be processed again
    return focusRecords.map(r => ({ date: r.id, totalFocusMinutes: r.totalFocusMinutes }));
  }, [focusRecords]);


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
      <main className="flex-1 flex flex-col pt-20 p-4 md:p-6 lg:p-8 max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-2 mb-6">
            <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Progress</h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-6">
            <StatCard title="Today's Focus" value={formatDuration(stats.todayFocus)} icon={Clock} />
            <StatCard title="Today's Pomos" value={String(stats.todayPomos)} icon={Target} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div>
                          <CardTitle>Focus Activity</CardTitle>
                          <CardDescription>Your focus minutes over the selected period.</CardDescription>
                      </div>
                      <div className="text-2xl font-bold text-right sm:text-left">
                          {formatDuration(totalFocusForPeriod)}
                      </div>
                  </div>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="week" onValueChange={(value) => setTimeRange(value as 'day'|'week'|'month')} className="w-full">
                        <TabsList className="grid w-full grid-cols-3 mb-4">
                            <TabsTrigger value="day">Day</TabsTrigger>
                            <TabsTrigger value="week">Week</TabsTrigger>
                            <TabsTrigger value="month">Month</TabsTrigger>
                        </TabsList>
                        <TabsContent value="day">
                            <DailyFocusChart />
                        </TabsContent>
                        <TabsContent value="week">
                            {renderChart(chartSourceData, focusRecordsLoading, 'week', dateRanges)}
                        </TabsContent>
                        <TabsContent value="month">
                            {renderChart(chartSourceData, focusRecordsLoading, 'month', dateRanges)}
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
            <Card>
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
      </main>
    </div>
    </>
  );
}
