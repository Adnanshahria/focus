import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Clock, Calendar } from 'lucide-react';
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

interface RecentActivityCardProps {
  onLogClick: () => void;
  sessions: any[] | null | undefined;
  isLoading: boolean;
}

export const RecentActivityCard = ({ onLogClick, sessions, isLoading }: RecentActivityCardProps) => {

  return (
    <Card className="lg:col-span-1 h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest focus sessions.</CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onLogClick} className='shrink-0 h-8 w-8'>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto pr-2 custom-scrollbar">
        {isLoading ? (
          <div className="space-y-4 pt-2">
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-12 w-4/5 rounded-lg" />
          </div>
        ) : sessions && sessions.length > 0 ? (
          <div className="space-y-4">
            {sessions.slice(0, 5).map((session, index) => (
              <div key={session.id || index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium leading-none capitalize">
                      {session.type === 'manual' ? 'Manual Entry' : session.type.replace('B', ' B')}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDistanceToNow(safeParseDate(session.startTime), { addSuffix: true })}
                    </p>
                  </div>
                </div>
                <div className="font-semibold text-sm bg-background px-2 py-1 rounded border shadow-sm">
                  {Math.round(session.duration)}m
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center py-8 space-y-2">
            <div className="p-3 bg-muted rounded-full">
              <Clock className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">No sessions logged today.</p>
            <Button variant="link" size="sm" onClick={onLogClick} className="text-primary">
              Log your first session
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
