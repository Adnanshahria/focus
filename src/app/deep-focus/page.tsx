'use client';

import { FloatingTimer } from '@/components/timer/floating-timer';
import { useUser } from '@/firebase';
import { initiateAnonymousSignIn } from '@/firebase/non-blocking-login';
import { useAuth } from '@/firebase';
import { useEffect, useRef } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function DeepFocusPage() {
    const { user, isUserLoading } = useUser();
    const auth = useAuth();
    const containerRef = useRef<HTMLDivElement>(null);

    // Automatically enter fullscreen when the component mounts
    useEffect(() => {
        const elem = containerRef.current;
        if (elem && !document.fullscreenElement) {
            if (elem.requestFullscreen) {
                elem.requestFullscreen().catch(() => {
                    // Fail silently if the user denies the request
                });
            } else if ((elem as any).webkitRequestFullscreen) { /* Safari */
                (elem as any).webkitRequestFullscreen();
            } else if ((elem as any).msRequestFullscreen) { /* IE11 */
                (elem as any).msRequestFullscreen();
            }
        }
    }, []);

    useEffect(() => {
        if (!isUserLoading && !user) {
            initiateAnonymousSignIn(auth);
        }
    }, [user, isUserLoading, auth]);

    
    // Exit fullscreen when the component unmounts
    useEffect(() => {
        return () => {
            if (document.fullscreenElement && document.exitFullscreen) {
                 document.exitFullscreen().catch(err => {
                    // Avoid logging errors if exiting fails, as it can be noisy.
                 });
            }
        };
    }, []);


    if (isUserLoading || !user) {
        return <div className="fixed inset-0 bg-black flex items-center justify-center"><Skeleton className="w-full h-full" /></div>
    }

    return (
        <div ref={containerRef} className="fixed inset-0 bg-black flex flex-col items-center justify-center">
            <FloatingTimer />
        </div>
    );
}
