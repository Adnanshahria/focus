'use client';
import { DateRange } from 'react-day-picker';
import { DatePickerWithRange } from '../ui/date-picker';
import { CardHeader } from '../ui/card';
import { formatDuration } from './overall-chart-utils';
import { Clock, Flame, TrendingUp, CalendarRange } from 'lucide-react';

interface OverallChartHeaderProps {
    lifetimeTotals: { totalMinutes: number, totalPomos: number };
    dateRange: DateRange | undefined;
    setDateRange: (date: DateRange | undefined) => void;
    totalMinutesInRange: number;
    totalPomosInRange: number;
}

export const OverallChartHeader = ({ lifetimeTotals, dateRange, setDateRange, totalMinutesInRange, totalPomosInRange }: OverallChartHeaderProps) => {
    return (
        <CardHeader className="bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-purple-500/5 pb-4">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                {/* Left Side - Title & Lifetime Stats */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20">
                            <TrendingUp className="w-4 h-4 text-cyan-500" />
                        </div>
                        <h3 className="text-lg font-semibold tracking-tight">Overall Activity</h3>
                    </div>

                    {/* Lifetime Stats Cards */}
                    <div className="flex gap-3">
                        <div className="flex items-center gap-2 bg-background/60 backdrop-blur-sm px-3 py-2 rounded-lg border border-border/50">
                            <Clock className="w-4 h-4 text-primary" />
                            <div>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Lifetime</p>
                                <p className="text-sm font-bold">{formatDuration(lifetimeTotals.totalMinutes)}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 bg-background/60 backdrop-blur-sm px-3 py-2 rounded-lg border border-border/50">
                            <Flame className="w-4 h-4 text-orange-500" />
                            <div>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Pomos</p>
                                <p className="text-sm font-bold">{lifetimeTotals.totalPomos}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Date Picker & Range Stats */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <CalendarRange className="w-4 h-4 text-muted-foreground" />
                        <DatePickerWithRange date={dateRange} setDate={setDateRange} />
                    </div>

                    {/* Range Stats */}
                    <div className="flex items-center gap-3 text-sm justify-end">
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-primary"></div>
                            <span className="text-muted-foreground">Focus:</span>
                            <span className="font-semibold">{formatDuration(totalMinutesInRange)}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                            <span className="text-muted-foreground">Pomos:</span>
                            <span className="font-semibold">{totalPomosInRange}</span>
                        </div>
                    </div>
                </div>
            </div>
        </CardHeader>
    );
};
