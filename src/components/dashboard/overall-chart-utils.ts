'use client';
import { format, parseISO } from 'date-fns';

export type ChartData = {
  date: string;
  totalFocusMinutes: number;
  totalPomos: number;
}

export function formatDuration(minutes: number) {
  if (isNaN(minutes) || minutes < 0) return '0h 0m';
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return `${hours}h ${mins}m`;
}

export const tickFormatter = (val: string, index: number) => {
    const date = parseISO(val);
    const dayOfMonth = date.getDate();
    if (dayOfMonth === 1 || index === 0 || index % 7 === 0) {
        return format(date, 'MMM d');
    }
    return '';
};
