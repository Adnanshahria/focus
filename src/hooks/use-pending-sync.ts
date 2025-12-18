'use client';

import { useEffect, useCallback } from 'react';
import { useUser } from '@/firebase';
import { useFirestore } from '@/firebase/hooks/hooks';
import { doc, collection, Timestamp, writeBatch, increment } from 'firebase/firestore';
import { getPendingSessions, removePendingSession } from '@/lib/pending-sessions';
import { useOfflineStatus } from './use-offline-status';

export function usePendingSync() {
    const { user } = useUser();
    const firestore = useFirestore();
    const { isOnline } = useOfflineStatus();

    const syncPendingSessions = useCallback(async () => {
        if (!user || user.isAnonymous || !firestore || !isOnline) return;

        const pending = getPendingSessions().filter(s => s.userId === user.uid);
        if (pending.length === 0) return;

        console.log(`[PendingSync] Syncing ${pending.length} pending sessions...`);

        for (const session of pending) {
            try {
                const date = new Date(session.sessionStartTime).toISOString().split('T')[0];
                const focusRecordRef = doc(firestore, `users/${user.uid}/focusRecords`, date);
                const sessionsCollection = collection(focusRecordRef, 'sessions');
                const newSessionRef = doc(sessionsCollection);

                const batch = writeBatch(firestore);

                batch.set(newSessionRef, {
                    id: newSessionRef.id,
                    focusRecordId: date,
                    startTime: Timestamp.fromDate(new Date(session.sessionStartTime)),
                    endTime: Timestamp.fromDate(new Date(session.endTime)),
                    duration: session.durationMinutes,
                    type: session.type,
                    completed: session.completed,
                });

                const updateData: Record<string, any> = {
                    id: date,
                    date: date,
                    userId: user.uid,
                };

                if (session.type === 'pomodoro') {
                    updateData.totalFocusMinutes = increment(session.durationMinutes);
                    if (session.completed) {
                        updateData.totalPomos = increment(1);
                    }
                }

                batch.set(focusRecordRef, updateData, { merge: true });
                await batch.commit();
                removePendingSession(session.id);
                console.log(`[PendingSync] Synced session ${session.id}`);
            } catch (error) {
                console.error('[PendingSync] Failed to sync pending session:', error);
            }
        }
    }, [user, firestore, isOnline]);

    // Sync when coming back online
    useEffect(() => {
        if (isOnline) {
            // Small delay to ensure connection is stable
            const timeoutId = setTimeout(() => {
                syncPendingSessions();
            }, 1000);
            return () => clearTimeout(timeoutId);
        }
    }, [isOnline, syncPendingSessions]);

    return { syncPendingSessions };
}
