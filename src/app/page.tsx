'use client';

import { Header } from "@/components/header";
import { Timer } from "@/components/timer/timer";
import { useUser } from "@/firebase";
import { useAuth } from '@/firebase/hooks/hooks';
import { initiateAnonymousSignIn } from "@/firebase/non-blocking-login";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { TodayStats } from "@/components/dashboard/today-stats";
import { FloatingTimer } from "@/components/timer/floating-timer";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";


export default function Home() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const { theme, setTheme } = useTheme();
  const [isDeepFocus, setDeepFocus] = useState(false);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  };

  useEffect(() => {
    if (!isUserLoading && !user && auth) {
      initiateAnonymousSignIn(auth);
    }
  }, [user, isUserLoading, auth]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setDeepFocus(false);
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleEnterDeepFocus = () => {
    const element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen()
        .then(() => {
          setDeepFocus(true);
        })
        .catch(err => {
          console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        });
    }
  };

  if (isDeepFocus) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full h-full"
        >
          <FloatingTimer theme={(theme === 'dark' || theme === 'light') ? theme : 'dark'} toggleTheme={toggleTheme} />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header onDeepFocusClick={handleEnterDeepFocus} />
      <main className="flex-1 flex flex-col items-center justify-center pt-20 px-4 sm:px-6 lg:px-8">
        {isUserLoading || !user ? (
          <div className="flex flex-col items-center justify-center gap-8">
            <Skeleton className="w-[340px] h-[500px] md:w-[420px] md:h-[540px] rounded-3xl" />
          </div>
        ) : (
          <>
            <Timer />
            {user && !user.isAnonymous && user.email && <TodayStats userId={user.email.split('@')[0]} />}
          </>
        )}
      </main>
    </div>
  );
}
