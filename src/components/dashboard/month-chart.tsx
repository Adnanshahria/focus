'use client';
import { HistoricalFocusChart } from './historical-focus-chart';
import { CardDescription } from '../ui/card';

export const MonthChart = ({ data, loading }: { data: any[], loading: boolean }) => {
    return (
        <div className='space-y-4'>
            <CardDescription>Your focus minutes for the current month.</CardDescription>
            <HistoricalFocusChart 
                data={data} 
                loading={loading} 
                timeRange='month'
                weekStartsOn={1} // weekStartsOn doesn't affect month view
            />
        </div>
    );
};
