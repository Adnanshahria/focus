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

        const handleFullscreenChange = () => {
            if (!document.fullscreenElement) {
                router.push('/');
            }
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.addEventListener('msfullscreenchange', handleFullscreenChange);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
            document.removeEventListener('msfullscreenchange', handleFullscreenChange);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    return (
        <div 
            ref={containerRef} 
            className="flex flex-col items-center justify-center min-h-screen bg-background"
            onClick={enterFullScreen}
        >
            <FloatingTimer theme={theme as 'dark' | 'light' || 'dark'} toggleTheme={toggleTheme} />
        </div>
    );
}
