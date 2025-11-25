'use client';

import { FloatingTimer } from '@/components/timer/floating-timer';
import { useRef, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';

export default function DeepFocusPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { theme, setTheme } = useTheme();
    const router = useRouter();

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };
    
    // Default to dark mode and enter fullscreen when the page loads.
    useEffect(() => {
        setTheme('dark');
        const elem = containerRef.current;

        const enterFullScreen = () => {
             if (elem && !document.fullscreenElement) {
                if (elem.requestFullscreen) {
                    elem.requestFullscreen().catch(err => console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`));
                } else if ((elem as any).webkitRequestFullscreen) { /* Safari */
                    (elem as any).webkitRequestFullscreen();
                }
            }
        };

        enterFullScreen();

        const handleFullscreenChange = () => {
            if (!document.fullscreenElement) {
                router.push('/');
            }
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
            if (document.fullscreenElement) {
                document.exitFullscreen();
            }
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    return (
        <div 
            ref={containerRef} 
            className="flex flex-col items-center justify-center min-h-screen bg-background"
        >
            <FloatingTimer theme={theme as 'dark' | 'light' || 'dark'} toggleTheme={toggleTheme} />
        </div>
    );
}
