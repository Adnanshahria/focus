'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

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
    timeLeft: number;
    sessionDuration: number;
    isActive: boolean;
    todayRecord?: any;
    dailyGoal?: number;
}

export const FloatingTimerDisplay = ({ timeLeft, sessionDuration, isActive, todayRecord, dailyGoal }: FloatingTimerDisplayProps) => {
    const [pathLength, setPathLength] = useState(0);
    const pathRef = useRef<SVGPathElement>(null);
    const uiColor = 'white';
    const [isGoalVisible, setIsGoalVisible] = useState(true);

    // Accomplishment Logic
    const totalMinutes = todayRecord?.totalFocusMinutes || 0;
    const goal = dailyGoal || 120;
    const goalProgress = Math.min((totalMinutes / goal) * 100, 100);
    const [accPathLength, setAccPathLength] = useState(0);
    const accPathRef = useRef<SVGPathElement>(null);

    useEffect(() => {
        if (pathRef.current) {
            setPathLength(pathRef.current.getTotalLength());
        }
        if (accPathRef.current) {
            setAccPathLength(accPathRef.current.getTotalLength());
        }
    }, [sessionDuration, timeLeft]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsGoalVisible(false);
        }, 20000);
        return () => clearTimeout(timer);
    }, [isGoalVisible]);

    const handleGoalClick = () => {
        setIsGoalVisible(true);
    };

    const progress = sessionDuration > 0 ? (sessionDuration - timeLeft) / sessionDuration : 0;
    const strokeDashoffset = pathLength > 0 ? pathLength * (1 - progress) : 0;

    const accStrokeDashoffset = accPathLength > 0 ? accPathLength * (1 - (goalProgress / 100)) : 0;

    const formatDuration = (minutes: number) => {
        if (isNaN(minutes) || minutes < 0) return '0h 0m';
        const hours = Math.floor(minutes / 60);
        const mins = Math.round(minutes % 60);
        return `${hours}h ${mins}m`;
    };

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

            <div className="flex gap-4">
                {/* Focus Goal Card */}
                <motion.div
                    initial={{ opacity: 1 }}
                    animate={{ opacity: isGoalVisible ? 1 : 0 }}
                    transition={{ duration: 0.5 }}
                    onClick={handleGoalClick}
                    className={`p-4 rounded-xl border backdrop-blur-sm cursor-pointer transition-all ${isGoalVisible ? 'pointer-events-auto' : 'pointer-events-none'}`}
                    style={{ borderColor: 'rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.05)' }}
                >
                    <p className="text-xs text-white/50 mb-1">Focus Goal</p>
                    <p className="text-2xl font-bold text-white">{formatDuration(goal)}</p>
                </motion.div>

                {/* Accomplishment Card */}
                <div className="relative p-4 rounded-xl backdrop-blur-sm flex flex-col justify-center items-center w-[160px] h-[80px]">
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 160 80" fill="none">
                        <rect x="1.5" y="1.5" width="157" height="77" rx="10.5" stroke={uiColor} strokeOpacity="0.1" strokeWidth="3" />
                        <motion.rect ref={accPathRef} x="1.5" y="1.5" width="157" height="77" rx="10.5" stroke={uiColor} strokeWidth="3" strokeDasharray={accPathLength} strokeDashoffset={accStrokeDashoffset} initial={false} transition={{ duration: 1, ease: 'linear' }} />
                    </svg>
                    <div className="relative z-10 text-center">
                        <p className="text-xs text-white/50 mb-1">Accomplishment</p>
                        <p className="text-2xl font-bold text-white">{Math.round(goalProgress)}%</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
