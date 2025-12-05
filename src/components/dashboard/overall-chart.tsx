'use client';
import { useMemo, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { subMonths, isWithinInterval } from 'date-fns';
import { Card } from '../ui/card';
import { OverallChartHeader } from './overall-chart-header';
import { OverallChartContent } from './overall-chart-content';
import { ChartData } from './overall-chart-utils';

// Helper to safely parse dates that could be strings, Date objects, or Firestore Timestamps
function safeParseDate(date: any): Date {
    if (!date) return new Date();
    if (date instanceof Date) return date;
    if (typeof date === 'string') return new Date(date);
    if (date.toDate && typeof date.toDate === 'function') return date.toDate();
    if (date.seconds) return new Date(date.seconds * 1000);
    return new Date();
}

interface OverallChartProps {
    allRecords: ChartData[] | undefined | null;
}

export const OverallChart = ({ allRecords }: OverallChartProps) => {
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: subMonths(new Date(), 1),
        to: new Date(),
    });

    const { chartData, totalMinutesInRange, totalPomosInRange } = useMemo(() => {
        if (!allRecords) return { chartData: [], totalMinutesInRange: 0, totalPomosInRange: 0 };

        if (!dateRange || !dateRange.from || !dateRange.to) {
            const totalMinutes = allRecords.reduce((acc, r) => acc + (r.totalFocusMinutes || 0), 0);
            const totalPomos = allRecords.reduce((acc, r) => acc + (r.totalPomos || 0), 0);
            return { chartData: allRecords, totalMinutesInRange: totalMinutes, totalPomosInRange: totalPomos };
        }

        const filteredData = allRecords.filter(record => {
            try {
                return isWithinInterval(safeParseDate(record.date), { start: dateRange.from!, end: dateRange.to! });
            } catch {
                return false;
            }
        });

        const totalMinutesInRange = filteredData.reduce((acc, r) => acc + (r.totalFocusMinutes || 0), 0);
        const totalPomosInRange = filteredData.reduce((acc, r) => acc + (r.totalPomos || 0), 0);

        return { chartData: filteredData, totalMinutesInRange, totalPomosInRange };
    }, [allRecords, dateRange]);

    const lifetimeTotals = useMemo(() => {
        if (!allRecords) return { totalMinutes: 0, totalPomos: 0 };
        const totalMinutes = allRecords.reduce((acc, r) => acc + r.totalFocusMinutes, 0);
        const totalPomos = allRecords.reduce((acc, r) => acc + (r.totalPomos || 0), 0);
        return { totalMinutes, totalPomos };
    }, [allRecords]);

    return (
        <Card>
            <OverallChartHeader
                lifetimeTotals={lifetimeTotals}
                dateRange={dateRange}
                setDateRange={setDateRange}
                totalMinutesInRange={totalMinutesInRange}
                totalPomosInRange={totalPomosInRange}
            />
            <OverallChartContent
                loading={!allRecords}
                chartData={chartData}
            />
        </Card>
    );
};
