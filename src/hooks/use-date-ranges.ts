'use client';

import { useMemo } from 'react';
import { startOfDay, endOfWeek, startOfWeek, startOfMonth, endOfMonth } from 'date-fns';

export function useDateRanges(weekStartsOn: 0 | 1 = 1) {
    // Memoize `today` to prevent it from being recalculated on every render,
    // which could cause downstream infinite loops in effects.
    const today = useMemo(() => startOfDay(new Date()), []);
    
    const dateRanges = useMemo(() => {
        const options = { weekStartsOn };
        return {
          day: { start: today, end: today },
          week: { start: startOfWeek(today, options), end: endOfWeek(today, options) },
          month: { start: startOfMonth(today), end: endOfMonth(today) },
        }
    }, [today, weekStartsOn]);

    return { today, dateRanges };
}
