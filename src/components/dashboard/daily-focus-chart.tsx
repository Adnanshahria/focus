'use client';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

type DailyFocusChartProps = {
  data: { time: string; minutes: number }[];
};

export const DailyFocusChart = ({ data }: DailyFocusChartProps) => {
  const hasData = data.some(d => d.minutes > 0);

  return (
    <div className="h-[200px] w-full">
      {hasData ? (
        <ChartContainer
          config={{ minutes: { label: 'Minutes', color: 'hsl(var(--primary))' } }}
          className="w-full h-full"
        >
          <BarChart data={data} margin={{ top: 20, right: 20, left: -10, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value, index) => (index % 4 === 0 ? value : '')}
            />
            <YAxis stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
            <Bar dataKey="minutes" fill="hsl(var(--primary))" radius={4} />
          </BarChart>
        </ChartContainer>
      ) : (
        <div className="h-[200px] flex items-center justify-center text-muted-foreground">
          No focus sessions recorded today.
        </div>
      )}
    </div>
  );
};
