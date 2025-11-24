'use client';

import { FloatingTimer } from '@/components/timer/floating-timer';
import { useUser } from '@/firebase';
import { initiateAnonymousSignIn } from '@/firebase/non-blocking-login';
import { useAuth } from '@/firebase';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function DeepFocusPage() {
    const { user, isUserLoading } = useUser();
    const auth = useAuth();

    useEffect(() => {
        if (!isUserLoading && !user) {
            initiateAnonymousSignIn(auth);
        }
    }, [user, isUserLoading, auth]);

    if (isUserLoading || !user) {
        return <div className="fixed inset-0 bg-black flex items-center justify-center"><Skeleton className="w-full h-full" /></div>
    }

    return <FloatingTimer />;
}
