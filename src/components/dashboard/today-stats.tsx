'use client';

import { useDoc, useFirestore, useMemoFirebase } from "@/firebase";
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { format, startOfDay } from "date-fns";
import { doc } from "firebase/firestore";
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
  const todayDateString = useMemo(() => format(startOfDay(new Date()), 'yyyy-MM-dd'), []);
  
  const focusRecordRef = useMemoFirebase(() => {
    if (!firestore || !userId) return null;
    return doc(firestore, `users/${userId}/focusRecords`, todayDateString);
  }, [firestore, userId, todayDateString]);
  
  const { data: todayRecord, isLoading } = useDoc(focusRecordRef);

  if (isLoading) {
    return <Skeleton className="w-48 h-10 mt-6" />;
  }

  const focusMinutes = todayRecord?.totalFocusMinutes || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="mt-6 flex items-center justify-center gap-3 text-sm text-muted-foreground bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-2"
    >
      <Clock className="w-4 h-4" />
      <span>Today's Focus:</span>
      <span className="font-semibold text-foreground">{formatDuration(focusMinutes)}</span>
    </motion.div>
  );
}
