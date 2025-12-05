'use client';
import { Skeleton } from '@/components/ui/skeleton';
import { ChartContainer, ChartTooltip, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { ComposedChart, CartesianGrid, XAxis, YAxis, Bar, Scatter, TooltipProps } from 'recharts';
import { ChartData, tickFormatter, formatDuration } from './overall-chart-utils';
import { CardContent } from '../ui/card';
import { format, parseISO } from 'date-fns';

interface OverallChartContentProps {
    loading: boolean;
    chartData: ChartData[];
}

// Custom tooltip component for better formatting
const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (!active || !payload || payload.length === 0) return null;

    // Format date for display
    let formattedDate = label;
    try {
        formattedDate = format(parseISO(label), 'MMM d, yyyy');
    } catch { }

    return (
        <div className="rounded-lg border bg-background/95 backdrop-blur-sm p-3 shadow-lg">
            <p className="font-medium text-sm mb-2">{formattedDate}</p>
            <div className="space-y-1.5">
                {payload.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                        <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-muted-foreground">{entry.name}:</span>
                        <span className="font-medium">
                            {entry.dataKey === 'totalFocusMinutes'
                                ? formatDuration(entry.value as number)
                                : entry.value}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const OverallChartContent = ({ loading, chartData }: OverallChartContentProps) => {
    return (
        <CardContent className="pt-4">
            <div className="relative">
                {loading && <Skeleton className="absolute inset-0 bg-card/50 z-10 rounded-lg" />}
                {chartData.length === 0 ? (
                    <div className="h-[250px] flex flex-col items-center justify-center text-muted-foreground gap-2">
                        <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center">
                            <svg className="w-6 h-6 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <p className="text-sm">No data for this period</p>
                        <p className="text-xs text-muted-foreground/70">Select a different date range</p>
                    </div>
                ) : (
                    <ChartContainer
                        config={{
                            totalFocusMinutes: { label: 'Minutes', color: 'hsl(var(--primary))' },
                            totalPomos: { label: 'Pomos', color: 'hsl(24 95% 53%)' }
                        }}
                        className="w-full h-[250px]"
                    >
                        <ComposedChart data={chartData} margin={{ top: 20, right: 30, bottom: 5, left: -10 }}>
                            <defs>
                                <linearGradient id="overallBarGradient" x1="0" y1="0" x2="0" y2="1">
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
                                interval="preserveStartEnd"
                                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                            />
                            <YAxis
                                yAxisId="left"
                                stroke="hsl(var(--muted-foreground))"
                                tickLine={false}
                                axisLine={false}
                                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                            />
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                stroke="hsl(var(--muted-foreground))"
                                tickLine={false}
                                axisLine={false}
                                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                            />
                            <ChartTooltip
                                cursor={{ fill: 'hsl(var(--muted) / 0.3)' }}
                                content={<CustomTooltip />}
                            />
                            <ChartLegend content={<ChartLegendContent />} />
                            <Bar
                                yAxisId="left"
                                dataKey="totalFocusMinutes"
                                name="Minutes"
                                fill="url(#overallBarGradient)"
                                radius={[4, 4, 0, 0]}
                            />
                            <Scatter
                                yAxisId="right"
                                dataKey="totalPomos"
                                name="Pomos"
                                fill="hsl(24 95% 53%)"
                                shape={(props: any) => (
                                    <circle
                                        cx={props.cx}
                                        cy={props.cy}
                                        r={5}
                                        fill="hsl(24 95% 53%)"
                                        stroke="hsl(var(--background))"
                                        strokeWidth={2}
                                    />
                                )}
                            />
                        </ComposedChart>
                    </ChartContainer>
                )}
            </div>
        </CardContent>
    );
};
