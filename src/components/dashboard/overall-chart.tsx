'use client';
import { useMemo, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { format, parseISO, eachDayOfInterval, subMonths, isWithinInterval } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { DatePickerWithRange } from '../ui/date-picker';
import { CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

type ChartData = {
  date: string;
  totalFocusMinutes: number;
  totalPomos: number;
}

function formatDuration(minutes: number) {
  if (isNaN(minutes) || minutes < 0) return '0h 0m';
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return `${hours}h ${mins}m`;
}

export const OverallChart = ({ allRecords, loading }: { allRecords: ChartData[], loading: boolean }) => {
    const today = new Date();
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
      from: subMonths(today, 1),
      to: today,
    });

    const { chartData, totalMinutes } = useMemo(() => {
        if (!dateRange || !dateRange.from || !dateRange.to) {
             const totalMinutes = allRecords.reduce((acc, r) => acc + r.totalFocusMinutes, 0);
             return { chartData: allRecords, totalMinutes };
        }
        
        const filteredData = allRecords.filter(record => 
            isWithinInterval(new Date(record.date), { start: dateRange.from!, end: dateRange.to! })
        );

        const totalMinutes = filteredData.reduce((acc, r) => acc + r.totalFocusMinutes, 0);
        
        return { chartData: filteredData, totalMinutes };

    }, [allRecords, dateRange]);

    const lifetimeTotals = useMemo(() => {
        const totalMinutes = allRecords.reduce((acc, r) => acc + r.totalFocusMinutes, 0);
        const totalPomos = allRecords.reduce((acc, r) => acc + (r.totalPomos || 0), 0);
        return { totalMinutes, totalPomos };
    }, [allRecords]);

    const tickFormatter = (val: string, index: number) => {
        const date = parseISO(val);
        const dayOfMonth = date.getDate();
        if (dayOfMonth === 1 || index === 0 || index % 7 === 0) {
            return format(date, 'MMM d');
        }
        return '';
    };
    
    if (loading) return <Skeleton className="h-[350px] w-full" />;
    
    return (
        <>
        <CardHeader>
            <CardTitle>Overall Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <CardDescription>Filter your focus history by date range.</CardDescription>
                <DatePickerWithRange date={dateRange} setDate={setDateRange} />
            </div>

             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div className="rounded-lg border bg-card p-3">
                    <p className="text-xs text-muted-foreground">Focus in Range</p>
                    <p className="text-lg font-bold">{formatDuration(totalMinutes)}</p>
                </div>
                <div className="rounded-lg border bg-card p-3">
                    <p className="text-xs text-muted-foreground">Lifetime Focus</p>
                    <p className="text-lg font-bold">{formatDuration(lifetimeTotals.totalMinutes)}</p>
                </div>
                 <div className="rounded-lg border bg-card p-3">
                    <p className="text-xs text-muted-foreground">Lifetime Pomos</p>
                    <p className="text-lg font-bold">{lifetimeTotals.totalPomos}</p>
                </div>
            </div>

            {chartData.length === 0 || chartData.every(d => d.totalFocusMinutes === 0) ? (
                 <div className="text-center p-4 text-muted-foreground h-[250px] flex items-center justify-center">No data for this period.</div>
            ): (
                 <ChartContainer config={{ totalFocusMinutes: { label: 'Minutes', color: 'hsl(var(--primary))' } }} className="w-full h-[250px]">
                    <BarChart data={chartData} margin={{ top: 20, right: 20, bottom: 5, left: -10 }}>
                        <CartesianGrid vertical={false} stroke="hsl(var(--border) / 0.5)" strokeDasharray="3 3" />
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
            )}
        </CardContent>
        </>
    );
};
