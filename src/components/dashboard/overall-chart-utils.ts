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

// Helper to safely get date string from various formats
function safeDateString(date: any): string {
  if (!date) return '';
  if (typeof date === 'string') return date;
  if (date instanceof Date) return format(date, 'yyyy-MM-dd');
  if (date.toDate && typeof date.toDate === 'function') return format(date.toDate(), 'yyyy-MM-dd');
  if (date.seconds) return format(new Date(date.seconds * 1000), 'yyyy-MM-dd');
  return '';
}

export const tickFormatter = (val: any, index: number) => {
  try {
    const dateStr = safeDateString(val);
    if (!dateStr) return '';
    const date = parseISO(dateStr);
    const dayOfMonth = date.getDate();
    if (dayOfMonth === 1 || index === 0 || index % 7 === 0) {
      return format(date, 'MMM d');
    }
    return '';
  } catch {
    return '';
  }
};
