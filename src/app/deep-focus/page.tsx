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
    
    // Default to dark mode and handle exiting fullscreen.
    useEffect(() => {
        setTheme('dark');
        
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
            // Ensure we exit fullscreen if the component unmounts for any reason.
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
