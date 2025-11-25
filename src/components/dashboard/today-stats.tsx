'use client';

import { useDoc, useFirestore, useMemoFirebase, useCollection } from "@/firebase";
import { useMemo, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { doc, collection, query, where } from "firebase/firestore";
import { Clock } from "lucide-react";
import { motion } from "framer-motion";
import { useDateRanges } from "@/hooks/use-date-ranges";

function formatDuration(minutes: number) {
  if (isNaN(minutes) || minutes < 0) return '0h 0m';
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return `${hours}h ${mins}m`;
}

export const TodayStats = ({ userId }: { userId: string }) => {
  const firestore = useFirestore();
  const [weekStartsOn] = useState<0 | 1>(1); // Default to Monday for homepage widget
  const { today, dateRanges } = useDateRanges(weekStartsOn);

  const todayDateString = format(today, 'yyyy-MM-dd');
  
  const focusRecordRef = useMemoFirebase(() => {
    if (!firestore || !userId) return null;
    return doc(firestore, `users/${userId}/focusRecords`, todayDateString);
  }, [firestore, userId, todayDateString]);
  
  const { data: todayRecord, isLoading: isTodayLoading } = useDoc(focusRecordRef);

  const weeklyFocusQuery = useMemoFirebase(() => {
    if (!firestore || !userId) return null;
    const { start, end } = dateRanges.week;
    return query(
      collection(firestore, `users/${userId}/focusRecords`),
      where('date', '>=', format(start, 'yyyy-MM-dd')),
      where('date', '<=', format(end, 'yyyy-MM-dd'))
    );
  }, [firestore, userId, dateRanges.week]);

  const { data: weeklyRecords, isLoading: isWeekLoading } = useCollection(weeklyFocusQuery);

  const focusMinutes = todayRecord?.totalFocusMinutes || 0;

  const weeklyFocusMinutes = useMemo(() => {
    if (!weeklyRecords) return 0;
    return weeklyRecords.reduce((acc, record) => acc + (record.totalFocusMinutes || 0), 0);
  }, [weeklyRecords]);

  const isLoading = isTodayLoading || isWeekLoading;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="mt-6 flex flex-col gap-2 w-64"
    >
      {isLoading ? (
        <>
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </>
      ) : (
        <>
          <div className="flex items-center justify-center text-sm text-muted-foreground bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-2">
            <Clock className="w-4 h-4 mr-3" />
            <span>Today's Focus:</span>
            <span className="font-semibold text-foreground ml-auto">{formatDuration(focusMinutes)}</span>
          </div>
          <div className="flex items-center justify-center text-sm text-muted-foreground bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-2">
            <Clock className="w-4 h-4 mr-3" />
            <span>This Week:</span>
            <span className="font-semibold text-foreground ml-auto">{formatDuration(weeklyFocusMinutes)}</span>
          </div>
        </>
      )}
    </motion.div>
  );
}
