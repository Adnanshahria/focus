'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

interface RecentActivityCardProps {
  onLogClick: () => void;
  sessions: any[] | null;
}

export const RecentActivityCard = ({ onLogClick, sessions }: RecentActivityCardProps) => {

  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <div className="flex items-center justify-between">
            <div>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest focus sessions.</CardDescription>
            </div>
             <Button variant="outline" size="sm" onClick={onLogClick} className='shrink-0'>
                <Plus className="h-4 w-4 mr-2" />
                Log
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        {!sessions ? (
          <div className="space-y-4 pt-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-4/5" />
          </div>
        ) : sessions.length > 0 ? (
          <ul className="space-y-4 pt-2">
            {sessions.slice(0, 5).map(session => (
              <li key={session.id} className="flex justify-between items-center text-sm">
                <div>
                  <span className='capitalize font-medium'>{session.type === 'manual' ? 'Manual Entry' : session.type.replace('B', ' B')}</span>
                  <p className="text-muted-foreground text-xs" title={new Date(session.startTime).toLocaleString()}>
                    {formatDistanceToNow(parseISO(session.startTime), { addSuffix: true })}
                  </p>
                </div>
                <span className="font-semibold">{Math.round(session.duration)}m</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-muted-foreground text-sm text-center py-8">No sessions logged today.</div>
        )}
      </CardContent>
    </Card>
  );
};
