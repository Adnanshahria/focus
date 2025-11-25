'use client';

import { Header } from "@/components/header";
import { Timer } from "@/components/timer/timer";
import { useUser, useAuth, initiateAnonymousSignIn, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { useEffect, useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { format, startOfDay } from "date-fns";
import { doc, collection } from "firebase/firestore";
import { Clock } from "lucide-react";
import { motion } from "framer-motion";

function formatDuration(minutes: number) {
  if (isNaN(minutes) || minutes < 0) return '0h 0m';
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return `${hours}h ${mins}m`;
}

const TodayStats = ({ userId }: { userId: string }) => {
  const firestore = useFirestore();
  const todayDateString = useMemo(() => format(startOfDay(new Date()), 'yyyy-MM-dd'), []);
  
  const focusRecordRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(collection(firestore, `users/${userId}/focusRecords`), todayDateString);
  }, [firestore, userId, todayDateString]);
  
  const { data: todayRecord, isLoading } = useDoc(focusRecordRef);

  if (isLoading) {
    return <Skeleton className="w-48 h-10 mt-6" />;
  }

  const focusMinutes = todayRecord?.totalFocusMinutes || 0;

  if (focusMinutes < 1) return null; // Don't show if there's no focus time

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

export default function Home() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();

  useEffect(() => {
    if (!isUserLoading && !user) {
      initiateAnonymousSignIn(auth);
    }
  }, [user, isUserLoading, auth]);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center p-4 pt-20 md:pt-24">
        {isUserLoading || !user ? (
          <div className="flex flex-col items-center justify-center gap-8">
            <Skeleton className="w-[340px] h-[500px] md:w-[420px] md:h-[540px] rounded-3xl" />
          </div>
        ) : (
          <>
            <Timer />
            {user && !user.isAnonymous && <TodayStats userId={user.uid} />}
          </>
        )}
      </main>
    </div>
  );
}
