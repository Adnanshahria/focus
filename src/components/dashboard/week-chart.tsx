'use client';
import { useState } from 'react';
import { HistoricalFocusChart } from './historical-focus-chart';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CardDescription } from '@/components/ui/card';

type WeekStartDay = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export const WeekChart = ({ data, loading }: { data: any[], loading: boolean }) => {
    const [weekStartsOn, setWeekStartsOn] = useState<WeekStartDay>(1);

    return (
        <div className="space-y-4">
             <div className="flex items-center justify-between">
                <CardDescription>Your focus minutes for the current week.</CardDescription>
                <div className="flex items-center gap-2">
                    <Label htmlFor='week-start' className='text-xs text-muted-foreground'>Week starts on</Label>
                    <Select value={String(weekStartsOn)} onValueChange={(val) => setWeekStartsOn(Number(val) as WeekStartDay)}>
                        <SelectTrigger id='week-start' className='w-[120px] h-8 text-xs'>
                            <SelectValue placeholder="Select day" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="0">Sunday</SelectItem>
                            <SelectItem value="1">Monday</SelectItem>
                            <SelectItem value="2">Tuesday</SelectItem>
                            <SelectItem value="3">Wednesday</SelectItem>
                            <SelectItem value="4">Thursday</SelectItem>
                            <SelectItem value="5">Friday</SelectItem>
                            <SelectItem value="6">Saturday</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <HistoricalFocusChart 
                data={data} 
                loading={loading} 
                timeRange='week'
                weekStartsOn={weekStartsOn}
            />
        </div>
    );
};
