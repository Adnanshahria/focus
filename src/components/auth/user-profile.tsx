'use client';

import { useUser } from '@/firebase';
import { useAuth } from '@/firebase/hooks/hooks';
import { AuthForm } from './auth-form';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '../ui/skeleton';

function getInitials(name: string | null | undefined): string {
  if (!name) return '??';
  const names = name.split(' ');
  const initials = names.map(n => n[0]).join('');
  return initials.slice(0, 2).toUpperCase();
}

export function UserProfile() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();

  const handleSignOut = async () => {
    if (auth) {
      await auth.signOut();
    }
  };

  if (isUserLoading) {
    return (
      <div className="flex flex-col items-center gap-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="text-center space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-40" />
        </div>
        <Skeleton className="h-10 w-full" />
      </div>
    )
  }

  if (!user || user.isAnonymous) {
    return <AuthForm />;
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <Avatar className="h-16 w-16">
        <AvatarImage src={user.photoURL ?? ''} />
        <AvatarFallback>{getInitials(user.displayName || user.email)}</AvatarFallback>
      </Avatar>
      <div className="text-center">
        <p className="font-semibold text-lg">{user.displayName || 'User'}</p>
        <p className="text-sm text-muted-foreground">{user.email}</p>
      </div>
      <Button variant="outline" onClick={handleSignOut} className="w-full">
        <LogOut className="mr-2 h-4 w-4" />
        Sign Out
      </Button>
    </div>
  );
}
