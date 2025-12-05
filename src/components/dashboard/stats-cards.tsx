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

    // Slim Modern Card Component
    const ModernCard = ({ title, value, icon: Icon, colorClass, bgClass, borderClass }: any) => (
        <div className={`group relative overflow-hidden rounded-xl border border-white/5 bg-black/20 p-3 transition-all duration-300 hover:bg-white/5 hover:shadow-lg hover:-translate-y-0.5 ${borderClass}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 flex items-center gap-3">
                <div className={`p-2 rounded-lg ${bgClass} ring-1 ring-inset ring-white/10 shrink-0`}>
                    <Icon className={`w-4 h-4 ${colorClass}`} />
                </div>
                <div className="flex flex-col">
                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider leading-tight">{title}</p>
                    <p className="text-lg font-bold text-white tracking-tight leading-tight">{value}</p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="grid grid-cols-2 gap-3 w-full max-w-[340px] px-0">
            <ModernCard
                title="Today"
                value={formatDuration(totalMinutes)}
                icon={Clock}
                colorClass="text-blue-400"
                bgClass="bg-blue-500/10"
                borderClass="hover:border-blue-500/20"
            />
            <ModernCard
                title="Weekly"
                value={formatDuration(weeklyMinutes)}
                icon={Calendar}
                colorClass="text-purple-400"
                bgClass="bg-purple-500/10"
                borderClass="hover:border-purple-500/20"
            />
            <ModernCard
                title="Goal"
                value={formatDuration(goal)}
                icon={Target}
                colorClass="text-emerald-400"
                bgClass="bg-emerald-500/10"
                borderClass="hover:border-emerald-500/20"
            />

            {/* Accomplishment Card */}
            <div className="group relative overflow-hidden rounded-xl border border-white/5 bg-black/20 p-3 transition-all duration-300 hover:bg-white/5 hover:shadow-lg hover:-translate-y-0.5 hover:border-amber-500/20">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10 flex flex-col justify-center h-full gap-1.5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-md bg-amber-500/10 ring-1 ring-inset ring-white/10">
                                <Trophy className="w-3 h-3 text-amber-400" />
                            </div>
                            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Progress</p>
                        </div>
                        <div className="text-[10px] font-bold text-amber-400">
                            {Math.round(goalProgress)}%
                        </div>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden ring-1 ring-white/5">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(251,191,36,0.3)]"
                            style={{ width: `${goalProgress}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
