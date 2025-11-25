'use client';
import { Skeleton } from '@/components/ui/skeleton';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { ComposedChart, CartesianGrid, XAxis, YAxis, Bar, Scatter } from 'recharts';
import { ChartData, tickFormatter } from './overall-chart-utils';

interface OverallChartContentProps {
    loading: boolean;
    chartData: ChartData[];
}

export const OverallChartContent = ({ loading, chartData }: OverallChartContentProps) => {
    return (
        <div className="space-y-4">
            {loading && <Skeleton className="absolute inset-0 bg-card/50" />}
            {chartData.length === 0 ? (
                <div className="text-center p-4 text-muted-foreground h-[250px] flex items-center justify-center">
                    No data for this period.
                </div>
            ) : (
                <ChartContainer
                    config={{
                        totalFocusMinutes: { label: 'Minutes', color: 'hsl(var(--primary))' },
                        totalPomos: { label: 'Pomos', color: 'hsl(var(--secondary))' }
                    }}
                    className="w-full h-[250px]"
                >
                    <ComposedChart data={chartData} margin={{ top: 20, right: 20, bottom: 5, left: -10 }}>
                        <CartesianGrid vertical={false} stroke="hsl(var(--border) / 0.5)" strokeDasharray="3 3" />
                        <XAxis dataKey="date" tickFormatter={tickFormatter} tickLine={false} axisLine={false} tickMargin={8} interval="preserveStartEnd" />
                        <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                        <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                        <ChartLegend content={<ChartLegendContent />} />
                        <Bar yAxisId="left" dataKey="totalFocusMinutes" fill="var(--color-totalFocusMinutes)" radius={4} />
                        <Scatter yAxisId="right" dataKey="totalPomos" fill="var(--color-totalPomos)" />
                    </ComposedChart>
                </ChartContainer>
            )}
        </div>
    );
};
