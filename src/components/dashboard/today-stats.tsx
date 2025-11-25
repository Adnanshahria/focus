'use client';

import { useDoc, useFirestore, useMemoFirebase, useCollection } from "@/firebase";
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { format, startOfDay, startOfWeek, endOfWeek } from "date-fns";
import { doc, collection, query, where } from "firebase/firestore";
import { Clock } from "lucide-react";
import { motion } from "framer-motion";

function formatDuration(minutes: number) {
  if (isNaN(minutes) || minutes < 0) return '0h 0m';
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return `${hours}h ${mins}m`;
}

export const TodayStats = ({ userId }: { userId: string }) => {
  const firestore = useFirestore();
  const today = useMemo(() => new Date(), []);
  const todayDateString = useMemo(() => format(startOfDay(today), 'yyyy-MM-dd'), [today]);
  
  const focusRecordRef = useMemoFirebase(() => {
    if (!firestore || !userId) return null;
    return doc(firestore, `users/${userId}/focusRecords`, todayDateString);
  }, [firestore, userId, todayDateString]);
  
  const { data: todayRecord, isLoading: isTodayLoading } = useDoc(focusRecordRef);

  const weeklyFocusQuery = useMemoFirebase(() => {
    if (!firestore || !userId) return null;
    const start = startOfWeek(today, { weekStartsOn: 1 });
    const end = endOfWeek(today, { weekStartsOn: 1 });
    return query(
      collection(firestore, `users/${userId}/focusRecords`),
      where('date', '>=', format(start, 'yyyy-MM-dd')),
      where('date', '<=', format(end, 'yyyy-MM-dd'))
    );
  }, [firestore, userId, today]);

  const { data: weeklyRecords, isLoading: isWeekLoading } = useCollection(weeklyFocusQuery);

  const focusMinutes = todayRecord?.totalFocusMinutes || 0;

  const weeklyFocusMinutes = useMemo(() => {
    if (!weeklyRecords) return 0;
    return weeklyRecords.reduce((acc, record) => acc + (record.totalFocusMinutes || 0), 0);
  }, [weeklyRecords]);

  if (isTodayLoading || isWeekLoading) {
    return <Skeleton className="w-64 h-10 mt-6" />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="mt-6 flex items-center justify-center gap-3 text-sm text-muted-foreground bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-2"
    >
      <Clock className="w-4 h-4" />
      <span>Today:</span>
      <span className="font-semibold text-foreground">{formatDuration(focusMinutes)}</span>
      <div className="border-l border-white/20 h-4 mx-2"></div>
      <span>This Week:</span>
      <span className="font-semibold text-foreground">{formatDuration(weeklyFocusMinutes)}</span>
    </motion.div>
  );
}
