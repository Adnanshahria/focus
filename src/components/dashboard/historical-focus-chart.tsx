'use client';
import { useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { format, parseISO, eachDayOfInterval } from 'date-fns';
import { useDateRanges } from '@/hooks/use-date-ranges';

type ChartData = {
  date: string;
  totalFocusMinutes: number;
}

export const HistoricalFocusChart = ({ data, loading, timeRange }: { data: ChartData[], loading: boolean, timeRange: 'week' | 'month' }) => {
    const { dateRanges } = useDateRanges();

    const chartData = useMemo(() => {
        const { start, end } = dateRanges[timeRange];
        const interval = eachDayOfInterval({ start, end });
        const dataMap = new Map(data.map(d => [d.date, d.totalFocusMinutes]));

        return interval.map(day => {
            const dateStr = format(day, 'yyyy-MM-dd');
            return {
                date: dateStr,
                totalFocusMinutes: dataMap.get(dateStr) || 0,
            }
        });
    }, [data, timeRange, dateRanges]);

    let tickFormatter = (val: string) => format(parseISO(val), 'MMM d');
    if (timeRange === 'month') {
        tickFormatter = (val: string, index: number) => {
            const date = parseISO(val);
            if (date.getDate() === 1 || (date.getDate() - 1) % 7 === 0) {
                return format(date, 'd');
            }
            return '';
        }
    }
    
    if (loading) return <Skeleton className="h-[250px] w-full" />;
    
    if (chartData.length === 0 || chartData.every(d => d.totalFocusMinutes === 0)) {
        return <div className="text-center p-4 text-muted-foreground h-[250px] flex items-center justify-center">No data for this period.</div>;
    }

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
};
