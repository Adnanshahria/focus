'use client';

import { Header } from "@/components/header";
import { Timer } from "@/components/timer/timer";
import { useUser, useAuth } from "@/firebase";
import { initiateAnonymousSignIn } from "@/firebase/non-blocking-login";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { TodayStats } from "@/components/dashboard/today-stats";


export default function Home() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();

  useEffect(() => {
    if (!isUserLoading && !user && auth) {
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
