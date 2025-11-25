'use client';

import { FloatingTimer } from '@/components/timer/floating-timer';
import { useRef, useEffect } from 'react';
import { useTheme } from 'next-themes';

export default function DeepFocusPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    // Use the theme from the provider directly
    const { theme, setTheme } = useTheme();

    const toggleTheme = () => {
        // Toggle between light and dark mode
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
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
