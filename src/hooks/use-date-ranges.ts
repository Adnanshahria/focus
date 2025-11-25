'use client';

import { useMemo } from 'react';
import { startOfDay, endOfWeek, startOfWeek, startOfMonth, endOfMonth } from 'date-fns';

export function useDateRanges() {
    const today = useMemo(() => startOfDay(new Date()), []);
    
    const dateRanges = useMemo(() => {
        const endOfWeekDate = endOfWeek(today, { weekStartsOn: 1 });
        return {
          day: { start: today, end: today },
          week: { start: startOfWeek(today, { weekStartsOn: 1 }), end: endOfWeekDate },
          month: { start: startOfMonth(today), end: endOfMonth(today) },
        }
    }, [today]);

    return { today, dateRanges };
}
