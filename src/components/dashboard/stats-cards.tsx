import React from 'react';

interface StatsCardsProps {
    todayRecord?: any;
    dailyGoal?: number;
    theme?: 'dark' | 'light';
}

const formatDuration = (minutes: number) => {
    if (isNaN(minutes) || minutes < 0) return '0h 0m';
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}m`;
};

export const StatsCards = ({ todayRecord, dailyGoal, theme = 'dark' }: StatsCardsProps) => {
    const totalMinutes = todayRecord?.totalFocusMinutes || 0;
    const goal = dailyGoal || 120;
    const goalProgress = Math.min((totalMinutes / goal) * 100, 100);

    // Determine colors based on theme
    const isDark = theme === 'dark';
    const uiColor = isDark ? 'white' : 'hsl(var(--primary))';
    const textColor = isDark ? 'white' : 'hsl(var(--foreground))';
    const subTextColor = isDark ? 'rgba(255,255,255,0.5)' : 'hsl(var(--muted-foreground))';
    const bgColor = isDark ? 'bg-white/5 border-white/10' : 'bg-card border-border shadow-sm';

    return (
        <div className="grid grid-cols-2 gap-4 w-full max-w-md px-4">
            <div className={`${bgColor} backdrop-blur-sm rounded-xl p-4 border`}>
                <p className="text-xs mb-1" style={{ color: subTextColor }}>Today's Focus</p>
                <p className="text-2xl font-bold" style={{ color: textColor }}>{formatDuration(totalMinutes)}</p>
                <p className="text-xs mt-1" style={{ color: subTextColor }}>Goal: {formatDuration(goal)}</p>
            </div>
            <div className={`${bgColor} backdrop-blur-sm rounded-xl p-4 border`}>
                <p className="text-xs mb-1" style={{ color: subTextColor }}>Accomplishment</p>
                <p className="text-2xl font-bold" style={{ color: textColor }}>{Math.round(goalProgress)}%</p>
                <div className="w-full bg-primary/10 h-1 mt-2 rounded-full overflow-hidden">
                    <div className="h-full transition-all duration-500" style={{ width: `${goalProgress}%`, backgroundColor: isDark ? 'white' : 'hsl(var(--primary))' }} />
                </div>
            </div>
        </div>
    );
};
