'use client';

import { useMemo } from 'react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ReferenceLine } from 'recharts';

type DailyFocusChartProps = {
  data: { time: string; minutes: number }[];
  goalMinutes?: number;
};

export const DailyFocusChart = ({ data, goalMinutes }: DailyFocusChartProps) => {
  const hasData = data.some(d => d.minutes > 0);

  // Calculate average per-hour goal if daily goal is set
  const hourlyGoal = goalMinutes ? Math.round(goalMinutes / 24) : undefined;

  const maxValue = useMemo(() => {
    const maxData = Math.max(...data.map(d => d.minutes), 0);
    return Math.max(maxData, hourlyGoal || 0) * 1.2;
  }, [data, hourlyGoal]);

  return (
    <div className="h-[200px] w-full">
      {hasData ? (
        <ChartContainer
          config={{
            minutes: {
              label: 'Minutes',
              color: 'hsl(var(--primary))'
            }
          }}
          className="w-full h-full"
        >
          <BarChart data={data} margin={{ top: 20, right: 20, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={1} />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.6} />
              </linearGradient>
              <linearGradient id="barGradientHover" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={1} />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              stroke="hsl(var(--border) / 0.3)"
            />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              tickFormatter={(value, index) => (index % 4 === 0 ? value : '')}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              domain={[0, maxValue]}
            />
            {hourlyGoal && hourlyGoal > 0 && (
              <ReferenceLine
                y={hourlyGoal}
                stroke="hsl(var(--primary) / 0.5)"
                strokeDasharray="5 5"
                strokeWidth={2}
              />
            )}
            <ChartTooltip
              cursor={{ fill: 'hsl(var(--muted) / 0.3)' }}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Bar
              dataKey="minutes"
              fill="url(#barGradient)"
              radius={[4, 4, 0, 0]}
              className="transition-all duration-200"
            />
          </BarChart>
        </ChartContainer>
      ) : (
        <div className="h-[200px] flex flex-col items-center justify-center text-muted-foreground gap-2">
          <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center">
            <svg className="w-6 h-6 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-sm">No focus sessions recorded today</p>
          <p className="text-xs text-muted-foreground/70">Start a timer to begin tracking!</p>
        </div>
      )}
    </div>
  );
};
