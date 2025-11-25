'use client';
import { DateRange } from 'react-day-picker';
import { DatePickerWithRange } from '../ui/date-picker';
import { CardDescription, CardHeader, CardTitle } from '../ui/card';
import { formatDuration } from './overall-chart-utils';

interface OverallChartHeaderProps {
    lifetimeTotals: { totalMinutes: number, totalPomos: number };
    dateRange: DateRange | undefined;
    setDateRange: (date: DateRange | undefined) => void;
    totalMinutesInRange: number;
    totalPomosInRange: number;
}

export const OverallChartHeader = ({ lifetimeTotals, dateRange, setDateRange, totalMinutesInRange, totalPomosInRange }: OverallChartHeaderProps) => {
    return (
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
                        <span className='mx-2'>|</span>
                        Pomos: <span className='font-semibold text-foreground'>{totalPomosInRange}</span>
                    </p>
                </div>
            </div>
        </CardHeader>
    );
};
