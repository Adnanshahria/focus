'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Clock, Calendar, Flame, Timer } from 'lucide-react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

// Helper to safely parse dates that could be strings, Date objects, or Firestore Timestamps
function safeParseDate(date: any): Date {
  if (!date) return new Date();
  if (date instanceof Date) return date;
  if (typeof date === 'string') return parseISO(date);
  if (date.toDate && typeof date.toDate === 'function') return date.toDate();
  if (date.seconds) return new Date(date.seconds * 1000);
  return new Date();
}

function getSessionIcon(type: string) {
  if (type === 'manual') return Timer;
  if (type === 'pomodoro' || type === 'focusBlock') return Flame;
  return Clock;
}

function getSessionColor(type: string) {
  if (type === 'manual') return 'text-blue-500 bg-blue-500/10';
  if (type === 'pomodoro' || type === 'focusBlock') return 'text-orange-500 bg-orange-500/10';
  return 'text-primary bg-primary/10';
}

interface RecentActivityCardProps {
  onLogClick: () => void;
  sessions: any[] | null | undefined;
  isLoading: boolean;
}

export const RecentActivityCard = ({ onLogClick, sessions, isLoading }: RecentActivityCardProps) => {

  return (
    <Card className="h-full flex flex-col overflow-hidden">
      {/* Gradient Header */}
      <CardHeader className="bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-transparent pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-green-500/10">
              <Clock className="w-4 h-4 text-green-500" />
            </div>
            <div>
              <CardTitle className="text-base">Recent Activity</CardTitle>
              <p className="text-xs text-muted-foreground">Your latest focus sessions</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onLogClick}
            className='h-8 gap-1.5 text-xs bg-background/60 backdrop-blur-sm border-border/50 hover:bg-background'
          >
            <Plus className="h-3.5 w-3.5" />
            Log
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-auto pr-2 custom-scrollbar pt-3">
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-14 w-full rounded-xl" />
            <Skeleton className="h-14 w-full rounded-xl" />
            <Skeleton className="h-14 w-4/5 rounded-xl" />
          </div>
        ) : sessions && sessions.length > 0 ? (
          <div className="space-y-2">
            {sessions.slice(0, 5).map((session, index) => {
              const Icon = getSessionIcon(session.type);
              const colorClass = getSessionColor(session.type);

              return (
                <div
                  key={session.id || index}
                  className="group relative flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all duration-200 border border-transparent hover:border-border/50"
                >
                  {/* Left accent line */}
                  <div className={`absolute left-0 top-2 bottom-2 w-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${session.type === 'manual' ? 'bg-blue-500' : 'bg-gradient-to-b from-primary to-primary/50'}`} />

                  <div className="flex items-center gap-3 pl-1">
                    <div className={`p-2 rounded-lg ${colorClass} transition-colors`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium leading-none capitalize">
                        {session.type === 'manual' ? 'Manual Entry' : session.type === 'focusBlock' ? 'Focus Block' : 'Pomodoro'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDistanceToNow(safeParseDate(session.startTime), { addSuffix: true })}
                      </p>
                    </div>
                  </div>

                  <div className="font-bold text-sm bg-background px-2.5 py-1 rounded-lg border shadow-sm">
                    {Math.round(session.duration)}m
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center py-8 space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
              <Clock className="w-7 h-7 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">No sessions today</p>
              <p className="text-xs text-muted-foreground/70 mt-0.5">Start your first focus session!</p>
            </div>
            <Button
              variant="default"
              size="sm"
              onClick={onLogClick}
              className="mt-2 gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              Log a session
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
