import { useDoc, useFirestore, useMemoFirebase, useCollection } from "@/firebase";
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { doc, collection, query, where } from "firebase/firestore";
import { motion } from "framer-motion";
import { useDateRanges } from "@/hooks/use-date-ranges";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { useUserPreferences } from "@/hooks/use-user-preferences";

export const TodayStats = ({ userId }: { userId: string }) => {
  const firestore = useFirestore();
  const { today, dateRanges } = useDateRanges();
  const { preferences } = useUserPreferences();

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

  const isLoading = isTodayLoading || isWeekLoading;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="mt-6 flex flex-col gap-2 w-full items-center"
    >
      {isLoading ? (
        <div className="flex flex-col gap-2 w-64">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : (
        <StatsCards
          todayRecord={todayRecord}
          dailyGoal={preferences?.dailyGoalMinutes ?? 120}
          theme="dark"
          allRecords={weeklyRecords || []}
        />
      )}
    </motion.div>
  );
}
