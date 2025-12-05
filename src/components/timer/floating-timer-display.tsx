'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

import { StatsCards } from '@/components/dashboard/stats-cards';

const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
        return `${String(hours)}:${String(mins).padStart(2, '0')}:${String(
            secs
        ).padStart(2, '0')}`;
    }
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

interface FloatingTimerDisplayProps {
    theme: 'dark' | 'light';
    timeLeft: number;
    sessionDuration: number;
    isActive: boolean;
    todayRecord?: any;
    dailyGoal?: number;
}

export const FloatingTimerDisplay = ({ theme, timeLeft, sessionDuration, isActive, todayRecord, dailyGoal }: FloatingTimerDisplayProps) => {
    const [pathLength, setPathLength] = useState(0);
    const pathRef = useRef<SVGPathElement>(null);
    const uiColor = theme === 'dark' ? 'white' : 'hsl(var(--primary))';

    useEffect(() => {
        if (pathRef.current) {
            setPathLength(pathRef.current.getTotalLength());
        }
    }, [sessionDuration, timeLeft]); // Update when duration changes

    const progress = sessionDuration > 0 ? (sessionDuration - timeLeft) / sessionDuration : 0;
    const strokeDashoffset = pathLength > 0 ? pathLength * (1 - progress) : 0;

    return (
        <div className="flex flex-col items-center gap-8">
            <div className="relative w-[320px] h-[180px] md:w-[480px] md:h-[270px] flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 480 270" fill="none">
                    <path d="M240,1.5 h223.5 a15,15 0 0 1 15,15 v237 a15,15 0 0 1 -15,15 h-447 a15,15 0 0 1 -15,-15 v-237 a15,15 0 0 1 15,-15 Z" stroke={uiColor} strokeOpacity="0.1" strokeWidth="6" />
                    <motion.path ref={pathRef} d="M240,1.5 h223.5 a15,15 0 0 1 15,15 v237 a15,15 0 0 1 -15,15 h-447 a15,15 0 0 1 -15,-15 v-237 a15,15 0 0 1 15,-15 Z" stroke={uiColor} strokeWidth="6" strokeDasharray={pathLength} strokeDashoffset={strokeDashoffset} initial={false} transition={{ duration: 1, ease: 'linear' }} />
                </svg>
                <div className="relative z-10 flex flex-col items-center justify-center">
                    <div className="text-7xl md:text-8xl font-thin tracking-tighter tabular-nums" style={{ color: uiColor }}>
                        {formatTime(timeLeft)}
                    </div>
                </div>
            </div>

            <StatsCards todayRecord={todayRecord} dailyGoal={dailyGoal} theme={theme} />
        </div>
    );
};
