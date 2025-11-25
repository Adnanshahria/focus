'use client';

import { FloatingTimer } from '@/components/timer/floating-timer';
import { useRef, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';

export default function DeepFocusPage() {
    const { theme, setTheme } = useTheme();

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };
    
    // Default to dark mode on this page.
    useEffect(() => {
        setTheme('dark');
    }, [setTheme]);
    
    return (
        <div 
            className="flex flex-col items-center justify-center min-h-screen bg-background"
        >
            <FloatingTimer theme={theme as 'dark' | 'light' || 'dark'} toggleTheme={toggleTheme} />
        </div>
    );
}
