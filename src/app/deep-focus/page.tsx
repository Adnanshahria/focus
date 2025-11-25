'use client';

import { FloatingTimer } from '@/components/timer/floating-timer';
import { useRef, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';

export default function DeepFocusPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { theme, setTheme } = useTheme();
    const { user, isUserLoading } = useUser();
    const router = useRouter();

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    useEffect(() => {
        if (!isUserLoading && (!user || user.isAnonymous)) {
            router.push('/');
        }
    }, [user, isUserLoading, router]);

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
    
    // Default to dark mode when entering deep focus
    useEffect(() => {
        setTheme('dark');
        enterFullScreen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (isUserLoading || !user || user.isAnonymous) {
        return (
            <div className="fixed inset-0 flex flex-col items-center justify-center bg-background">
                {/* You can add a loader here if you want */}
            </div>
        );
    }
    
    return (
        <div 
            ref={containerRef} 
            className="fixed inset-0 flex flex-col items-center justify-center bg-background"
            onClick={enterFullScreen}
        >
            <FloatingTimer theme={theme as 'dark' | 'light' || 'dark'} toggleTheme={toggleTheme} />
        </div>
    );
}
