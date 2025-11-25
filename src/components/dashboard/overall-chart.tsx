'use client';
import { useMemo, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { format, parseISO, isWithinInterval, subMonths } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { DatePickerWithRange } from '../ui/date-picker';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

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

    const { chartData, totalMinutesInRange } = useMemo(() => {
        if (!allRecords) {
            return { chartData: [], totalMinutesInRange: 0 };
        }
        if (!dateRange || !dateRange.from || !dateRange.to) {
             const totalMinutes = allRecords.reduce((acc, r) => acc + r.totalFocusMinutes, 0);
             return { chartData: allRecords, totalMinutesInRange: totalMinutes };
        }
        
        const filteredData = allRecords.filter(record => 
            isWithinInterval(new Date(record.date), { start: dateRange.from!, end: dateRange.to! })
        );

        const totalMinutesInRange = filteredData.reduce((acc, r) => acc + r.totalFocusMinutes, 0);
        
        return { chartData: filteredData, totalMinutesInRange };

    }, [allRecords, dateRange]);

    const lifetimeTotals = useMemo(() => {
        if (!allRecords) return { totalMinutes: 0, totalPomos: 0 };
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
    
    if (loading && (!allRecords || allRecords.length === 0)) return <Skeleton className="h-[350px] w-full" />;
    
    return (
        <Card>
        <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                    <CardTitle>Overall Activity</CardTitle>
                    <CardDescription className='mt-2'>
                        Lifetime Focus: <span className='font-semibold text-foreground'>{formatDuration(lifetimeTotals.totalMinutes)}</span>
                        <span className='mx-2'>|</span>
                        Lifetime Pomos: <span className='font-semibold text-foreground'>{lifetimeTotals.totalPomos}</span>
                    </CardDescription>
                </div>
                <div className='space-y-2'>
                    <DatePickerWithRange date={dateRange} setDate={setDateRange} />
                    <p className='text-xs text-muted-foreground text-right'>
                        Focus in range: <span className='font-semibold text-foreground'>{formatDuration(totalMinutesInRange)}</span>
                    </p>
                </div>
            </div>
        </CardHeader>
        <CardContent className="space-y-4">
            {loading && <Skeleton className="absolute inset-0 bg-card/50" />}
            {chartData.length === 0 ? (
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
        </Card>
    );
};
