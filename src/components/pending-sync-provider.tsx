'use client';

import { usePendingSync } from '@/hooks/use-pending-sync';

export function PendingSyncProvider({ children }: { children: React.ReactNode }) {
    usePendingSync(); // This handles syncing pending sessions when online
    return <>{children}</>;
}
