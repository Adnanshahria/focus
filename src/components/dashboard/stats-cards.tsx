import { startOfWeek, endOfWeek, isWithinInterval, parseISO } from 'date-fns';
import { Clock, Target, Trophy, Calendar } from 'lucide-react';

interface StatsCardsProps {
    todayRecord?: any;
    dailyGoal?: number;
    theme?: 'dark' | 'light';
    allRecords?: any[];
}

const formatDuration = (minutes: number) => {
    if (isNaN(minutes) || minutes < 0) return '0h 0m';
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}m`;
};

export const StatsCards = ({ todayRecord, dailyGoal, theme = 'dark', allRecords = [] }: StatsCardsProps) => {
    const totalMinutes = todayRecord?.totalFocusMinutes || 0;
    const goal = dailyGoal || 120;
    const goalProgress = Math.min((totalMinutes / goal) * 100, 100);

    // Calculate Weekly Focus
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 }); // Assuming Monday start
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

    const safeRecords = Array.isArray(allRecords) ? allRecords : [];

    const weeklyMinutes = safeRecords.reduce((acc, record) => {
        const recordDate = parseISO(record.id); // Assuming ID is YYYY-MM-DD
        if (isWithinInterval(recordDate, { start: weekStart, end: weekEnd })) {
            return acc + (record.totalFocusMinutes || 0);
        }
        return acc;
    }, 0);

    // Determine colors based on theme
    const isDark = theme === 'dark';
    const textColor = isDark ? 'white' : 'hsl(var(--foreground))';
    const subTextColor = isDark ? 'rgba(255,255,255,0.5)' : 'hsl(var(--muted-foreground))';
    const bgColor = isDark ? 'bg-white/5 border-white/10' : 'bg-card border-border shadow-sm';
    const iconColor = isDark ? 'text-white/70' : 'text-primary';

    const Card = ({ title, value, icon: Icon, subValue }: { title: string, value: string, icon: any, subValue?: string }) => (
        <div className={`${bgColor} backdrop-blur-sm rounded-xl p-4 border flex flex-col justify-between h-full`}>
            <div className="flex items-center gap-2 mb-2">
                <Icon className={`w-4 h-4 ${iconColor}`} />
                <p className="text-xs font-medium" style={{ color: subTextColor }}>{title}</p>
            </div>
            <div>
                <p className="text-2xl font-bold" style={{ color: textColor }}>{value}</p>
                {subValue && <p className="text-xs mt-1" style={{ color: subTextColor }}>{subValue}</p>}
            </div>
        </div>
    );

    return (
        <div className="grid grid-cols-2 gap-4 w-full max-w-md px-4">
            <Card title="Today's Focus" value={formatDuration(totalMinutes)} icon={Clock} />
            <Card title="Weekly Focus" value={formatDuration(weeklyMinutes)} icon={Calendar} />
            <Card title="Focus Goal" value={formatDuration(goal)} icon={Target} />
            <div className={`${bgColor} backdrop-blur-sm rounded-xl p-4 border flex flex-col justify-between h-full`}>
                <div className="flex items-center gap-2 mb-2">
                    <Trophy className={`w-4 h-4 ${iconColor}`} />
                    <p className="text-xs font-medium" style={{ color: subTextColor }}>Accomplishment</p>
                </div>
                <div>
                    <p className="text-2xl font-bold" style={{ color: textColor }}>{Math.round(goalProgress)}%</p>
                    <div className="w-full bg-primary/10 h-1 mt-2 rounded-full overflow-hidden">
                        <div className="h-full transition-all duration-500" style={{ width: `${goalProgress}%`, backgroundColor: isDark ? 'white' : 'hsl(var(--primary))' }} />
                    </div>
                </div>
            </div>
        </div>
    );
};
