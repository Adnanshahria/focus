'use client';

import { FloatingTimer } from '@/components/timer/floating-timer';
import { useUser, useAuth, initiateAnonymousSignIn } from '@/firebase';
import { useEffect, useRef } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function DeepFocusPage() {
    const { user, isUserLoading } = useUser();
    const auth = useAuth();
    const containerRef = useRef<HTMLDivElement>(null);

    const enterFullScreen = () => {
        const elem = containerRef.current;
        if (elem && !document.fullscreenElement) {
            if (elem.requestFullscreen) {
                elem.requestFullscreen().catch(() => {});
            } else if ((elem as any).webkitRequestFullscreen) { /* Safari */
                (elem as any).webkitRequestFullscreen();
            } else if ((elem as any).msRequestFullscreen) { /* IE11 */
                (elem as any).msRequestFullscreen();
            }
        }
    };
    
    useEffect(() => {
        if (!isUserLoading && !user) {
            initiateAnonymousSignIn(auth);
        }
    }, [user, isUserLoading, auth]);


    if (isUserLoading || !user) {
        return <div className="fixed inset-0 bg-black flex items-center justify-center"><Skeleton className="w-full h-full" /></div>
    }

    return (
        <div ref={containerRef} className="fixed inset-0 bg-black flex flex-col items-center justify-center" onClick={enterFullScreen}>
            <FloatingTimer />
        </div>
    );
}
