'use client';

import { useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ReferenceLine } from 'recharts';
import { format, parseISO, eachDayOfInterval } from 'date-fns';
import { useDateRanges } from '@/hooks/use-date-ranges';

type ChartData = {
  date: string;
  totalFocusMinutes: number;
};

type HistoricalFocusChartProps = {
  data: ChartData[];
  loading: boolean;
  timeRange: 'week' | 'month';
  weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  goalMinutes?: number;
};

// Helper to safely get date string from various formats
function safeDateString(date: any): string {
  if (!date) return '';
  if (typeof date === 'string') return date;
  if (date instanceof Date) return format(date, 'yyyy-MM-dd');
  if (date.toDate && typeof date.toDate === 'function') return format(date.toDate(), 'yyyy-MM-dd');
  if (date.seconds) return format(new Date(date.seconds * 1000), 'yyyy-MM-dd');
  return '';
}

export const HistoricalFocusChart = ({ data, loading, timeRange, weekStartsOn, goalMinutes }: HistoricalFocusChartProps) => {
  const { dateRanges } = useDateRanges(weekStartsOn);

  const chartData = useMemo(() => {
    const { start, end } = dateRanges[timeRange];
    if (!data) return [];

    const interval = eachDayOfInterval({ start, end });
    // Build map with safe date string conversion
    const dataMap = new Map(data.map(d => [safeDateString(d.date), d.totalFocusMinutes || 0]));

    return interval.map(day => {
      const dateStr = format(day, 'yyyy-MM-dd');
      return {
        date: dateStr,
        totalFocusMinutes: dataMap.get(dateStr) || 0,
      };
    });
  }, [data, timeRange, dateRanges]);

  const maxValue = useMemo(() => {
    const maxData = Math.max(...chartData.map(d => d.totalFocusMinutes), 0);
    return Math.max(maxData, goalMinutes || 0) * 1.2 || 60;
  }, [chartData, goalMinutes]);

  let tickFormatter = (val: string) => {
    try {
      return format(parseISO(val), 'EEE');
    } catch {
      return '';
    }
  };

  if (timeRange === 'month') {
    tickFormatter = (val: string) => {
      try {
        const date = parseISO(val);
        return format(date, 'd');
      } catch {
        return '';
      }
    };
  }

  if (loading && chartData.length === 0) {
    return <Skeleton className="h-[200px] w-full rounded-lg" />;
  }

  if (chartData.length === 0 || chartData.every(d => d.totalFocusMinutes === 0)) {
    return (
      <div className="h-[200px] flex flex-col items-center justify-center text-muted-foreground gap-2">
        <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center">
          <svg className="w-6 h-6 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <p className="text-sm">No data for this period</p>
      </div>
    );
  }

  return (
    <div className="h-[200px] w-full relative">
      {loading && <Skeleton className="absolute inset-0 bg-card/50 rounded-lg" />}
      <ChartContainer
        config={{ totalFocusMinutes: { label: 'Minutes', color: 'hsl(var(--primary))' } }}
        className="w-full h-full"
      >
        <BarChart data={chartData} margin={{ top: 20, right: 20, bottom: 5, left: -10 }}>
          <defs>
            <linearGradient id="historicalBarGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={1} />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.5} />
            </linearGradient>
          </defs>
          <CartesianGrid
            vertical={false}
            stroke="hsl(var(--border) / 0.3)"
            strokeDasharray="3 3"
          />
          <XAxis
            dataKey="date"
            tickFormatter={tickFormatter}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
            interval={timeRange === 'month' ? 6 : 0}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            tickLine={false}
            axisLine={false}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
            domain={[0, maxValue]}
          />
          {goalMinutes && goalMinutes > 0 && (
            <ReferenceLine
              y={goalMinutes}
              stroke="hsl(var(--primary) / 0.4)"
              strokeDasharray="5 5"
              strokeWidth={2}
              label={{
                value: 'Goal',
                position: 'right',
                fill: 'hsl(var(--muted-foreground))',
                fontSize: 10
              }}
            />
          )}
          <ChartTooltip
            cursor={{ fill: 'hsl(var(--muted) / 0.3)' }}
            content={<ChartTooltipContent indicator="dot" />}
          />
          <Bar
            dataKey="totalFocusMinutes"
            fill="url(#historicalBarGradient)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
};
