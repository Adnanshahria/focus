
'use client';

import { FloatingTimer } from '@/components/timer/floating-timer';
import { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export default function DeepFocusPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [theme, setTheme] = useState<'dark' | 'light'>('dark');

    const toggleTheme = () => {
        setTheme(current => current === 'dark' ? 'light' : 'dark');
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

    useEffect(() => {
        enterFullScreen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    return (
        <div 
            ref={containerRef} 
            className={cn(
                "fixed inset-0 flex flex-col items-center justify-center",
                theme === 'dark' ? 'bg-black' : 'bg-white'
            )}
            onClick={enterFullScreen}
        >
            <FloatingTimer theme={theme} toggleTheme={toggleTheme} />
        </div>
    );
}
