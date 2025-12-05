import { startOfWeek, endOfWeek, isWithinInterval, parseISO } from 'date-fns';
import { Clock, Target, Trophy, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

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
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

    const safeRecords = Array.isArray(allRecords) ? allRecords : [];

    const weeklyMinutes = safeRecords.reduce((acc, record) => {
        const recordDate = parseISO(record.id);
        if (isWithinInterval(recordDate, { start: weekStart, end: weekEnd })) {
            return acc + (record.totalFocusMinutes || 0);
        }
        return acc;
    }, 0);

    const StatItem = ({ icon: Icon, label, value, colorClass, bgClass }: any) => (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-background/40 border border-border/70 backdrop-blur-sm shadow-sm transition-all hover:bg-background/60 hover:shadow-md">
            <div className={cn("p-2 rounded-lg shrink-0", bgClass)}>
                <Icon className={cn("w-4 h-4", colorClass)} />
            </div>
            <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{label}</span>
                <span className="text-lg font-bold tracking-tight leading-none">{value}</span>
            </div>
        </div>
    );

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
            <StatItem
                icon={Clock}
                label="Today"
                value={formatDuration(totalMinutes)}
                colorClass="text-blue-500"
                bgClass="bg-blue-500/10"
            />
            <StatItem
                icon={Calendar}
                label="This Week"
                value={formatDuration(weeklyMinutes)}
                colorClass="text-purple-500"
                bgClass="bg-purple-500/10"
            />
            <StatItem
                icon={Target}
                label="Daily Goal"
                value={`${Math.round(goalProgress)}%`}
                colorClass="text-emerald-500"
                bgClass="bg-emerald-500/10"
            />
        </div>
    );
};
