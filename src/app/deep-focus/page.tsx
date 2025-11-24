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

    useEffect(() => {
        if (!isUserLoading && !user) {
            initiateAnonymousSignIn(auth);
        }
    }, [user, isUserLoading, auth]);

    const enterFullScreen = () => {
        const elem = containerRef.current;
        if (elem) {
            if (elem.requestFullscreen) {
                elem.requestFullscreen().catch(err => {
                    if (err.name !== 'NotAllowedError') {
                        console.error("Fullscreen request failed:", err);
                    }
                });
            } else if ((elem as any).webkitRequestFullscreen) { /* Safari */
                (elem as any).webkitRequestFullscreen();
            } else if ((elem as any).msRequestFullscreen) { /* IE11 */
                (elem as any).msRequestFullscreen();
            }
        }
    };
    
    // Exit fullscreen when the component unmounts
    useEffect(() => {
        return () => {
            if (document.fullscreenElement && document.exitFullscreen) {
                 document.exitFullscreen().catch(err => console.error("Error exiting fullscreen:", err));
            }
        };
    }, []);


    if (isUserLoading || !user) {
        return <div className="fixed inset-0 bg-black flex items-center justify-center"><Skeleton className="w-full h-full" /></div>
    }

    return (
        <div ref={containerRef} className="fixed inset-0 bg-black flex flex-col items-center justify-center cursor-pointer" onClick={enterFullScreen}>
            <FloatingTimer />
        </div>
    );
}
