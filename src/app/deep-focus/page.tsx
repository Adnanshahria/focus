'use client';

import { FloatingTimer } from '@/components/timer/floating-timer';
import { useEffect, useState } from 'react';
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
    
    useEffect(() => {
        setTheme('dark');
        
        const requestFs = async () => {
            try {
                await document.documentElement.requestFullscreen();
            } catch (error) {
                console.error("Could not enter fullscreen:", error);
            } finally {
                setVisible(true);
            }
        };
        
        requestFs();

        const handleFullscreenChange = () => {
          if (!document.fullscreenElement) {
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
