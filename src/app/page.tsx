'use client';

import { Header } from "@/components/header";
import { Timer } from "@/components/timer/timer";
import { useUser, useTimerStore } from "@/firebase";
import { useEffect } from "react";
import { initiateAnonymousSignIn } from "@/firebase/non-blocking-login";
import { useAuth } from "@/firebase";
import { FloatingTimer } from "@/components/timer/floating-timer";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const isAmoledProtectionMode = useTimerStore(state => state.isAmoledProtectionMode);

  useEffect(() => {
    if (!isUserLoading && !user) {
      initiateAnonymousSignIn(auth);
    }
  }, [user, isUserLoading, auth]);

  if (isAmoledProtectionMode) {
    return <FloatingTimer />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center p-4 pt-20">
        {isUserLoading ? (
          <div className="flex flex-col items-center justify-center gap-4">
            <Skeleton className="w-[320px] h-[320px] md:w-[400px] md:h-[400px] rounded-full" />
            <Skeleton className="h-10 w-48" />
          </div>
        ) : (
          <Timer />
        )}
      </main>
    </div>
  );
}
