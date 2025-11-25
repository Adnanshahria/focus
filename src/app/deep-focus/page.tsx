'use client';

import { FloatingTimer } from '@/components/timer/floating-timer';
import { useRef, useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function DeepFocusPage() {
    const { theme, setTheme } = useTheme();
    const [visible, setVisible] = useState(false);
    const router = useRouter();

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };
    
    // Default to dark mode and enter fullscreen on mount.
    useEffect(() => {
        setTheme('dark');
        
        const enterFullScreen = async () => {
            try {
                if (document.documentElement.requestFullscreen) {
                    await document.documentElement.requestFullscreen();
                    setVisible(true); // Fade in content after entering fullscreen
                }
            } catch (error) {
                console.error("Could not enter fullscreen:", error);
                setVisible(true); // Still show content if fullscreen fails
            }
        };

        enterFullScreen();

        const handleFullscreenChange = () => {
          if (!document.fullscreenElement) {
            // User exited fullscreen, navigate back
            router.push('/');
          }
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);

    }, [setTheme, router]);
    
    return (
        <div 
            className="flex flex-col items-center justify-center min-h-screen bg-background"
        >
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: visible ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                className="w-full h-full"
            >
                <FloatingTimer theme={theme as 'dark' | 'light' || 'dark'} toggleTheme={toggleTheme} />
            </motion.div>
        </div>
    );
}
