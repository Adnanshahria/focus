'use client';
import { useMemo, useState } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { DateRange } from 'react-day-picker';
import { subMonths } from 'date-fns';
import { isWithinInterval } from 'date-fns';
import { Card } from '../ui/card';
import { OverallChartHeader } from './overall-chart-header';
import { OverallChartContent } from './overall-chart-content';
import { ChartData } from './overall-chart-utils';

export const OverallChart = () => {
    const { user } = useUser();
    const firestore = useFirestore();
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
      from: subMonths(new Date(), 1),
      to: new Date(),
    });
    
    const allRecordsQuery = useMemoFirebase(() => {
        if (!user) return null;
        return query(
            collection(firestore, `users/${user.uid}/focusRecords`),
            orderBy('date', 'asc')
        );
    }, [user, firestore]);

    const { data: allRecords, isLoading: loading } = useCollection<ChartData>(allRecordsQuery);

    const { chartData, totalMinutesInRange, totalPomosInRange } = useMemo(() => {
        if (!allRecords) return { chartData: [], totalMinutesInRange: 0, totalPomosInRange: 0 };
        
        if (!dateRange || !dateRange.from || !dateRange.to) {
            const totalMinutes = allRecords.reduce((acc, r) => acc + r.totalFocusMinutes, 0);
            const totalPomos = allRecords.reduce((acc, r) => acc + (r.totalPomos || 0), 0);
            return { chartData: allRecords, totalMinutesInRange: totalMinutes, totalPomosInRange: totalPomos };
        }
        
        const filteredData = allRecords.filter(record => 
            isWithinInterval(new Date(record.date), { start: dateRange.from!, end: dateRange.to! })
        );

        const totalMinutesInRange = filteredData.reduce((acc, r) => acc + r.totalFocusMinutes, 0);
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
                loading={loading}
                chartData={chartData}
            />
        </Card>
    );
};
