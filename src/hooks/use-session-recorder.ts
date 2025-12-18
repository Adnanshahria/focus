'use client';

import { useCallback } from 'react';
import { useUser } from '@/firebase';
import { useFirestore } from '@/firebase/hooks/hooks';
import { doc, collection, Timestamp, writeBatch, increment } from 'firebase/firestore';
import { format } from 'date-fns';
import { TimerMode } from '@/store/timer-state';
import { addPendingSession } from '@/lib/pending-sessions';

export const useSessionRecorder = () => {
    const { user } = useUser();
    const firestore = useFirestore();

    const recordSession = useCallback(async (
        sessionStartTime: number | null,
        mode: TimerMode,
        isCompletion: boolean
    ) => {
        // Only record sessions for logged-in (non-anonymous) users.
        if (!user || user.isAnonymous || !firestore || !sessionStartTime) return false;

        const durationInMinutes = (Date.now() - sessionStartTime) / (1000 * 60);
        // Do not record very short, likely accidental, sessions.
        if (durationInMinutes < 0.1) return false;

        // If offline, queue the session for later sync
        if (typeof navigator !== 'undefined' && !navigator.onLine) {
            console.log('[SessionRecorder] Offline - queuing session for later sync');
            addPendingSession({
                userId: user.uid,
                sessionStartTime,
                endTime: Date.now(),
                durationMinutes: durationInMinutes,
                type: mode,
                completed: isCompletion,
            });
            return true; // Return success - will sync later
        }

        const today = format(new Date(), 'yyyy-MM-dd');
        const focusRecordRef = doc(firestore, `users/${user.uid}/focusRecords`, today);
        const sessionsCollection = collection(focusRecordRef, 'sessions');
        const newSessionRef = doc(sessionsCollection);

        try {
            const batch = writeBatch(firestore);

            // 1. Create the session document
            batch.set(newSessionRef, {
                id: newSessionRef.id,
                focusRecordId: focusRecordRef.id,
                startTime: Timestamp.fromDate(new Date(sessionStartTime)),
                endTime: Timestamp.fromDate(new Date()),
                duration: durationInMinutes,
                type: mode,
                completed: isCompletion,
            });

            // 2. Update daily totals using atomic increment
            // We use set with merge: true to ensure the document exists or is created
            const updateData: Record<string, any> = {
                id: today,
                date: today,
                userId: user.uid,
            };

            if (mode === 'pomodoro') {
                updateData.totalFocusMinutes = increment(durationInMinutes);
                if (isCompletion) {
                    updateData.totalPomos = increment(1);
                }
            }

            batch.set(focusRecordRef, updateData, { merge: true });

            await batch.commit();
            return true;
        } catch (error) {
            console.error("Batch write to record session failed: ", error);
            // If the write fails (possibly due to going offline during write), queue it
            if (typeof navigator !== 'undefined' && !navigator.onLine) {
                addPendingSession({
                    userId: user.uid,
                    sessionStartTime,
                    endTime: Date.now(),
                    durationMinutes: durationInMinutes,
                    type: mode,
                    completed: isCompletion,
                });
                return true; // Queued for later
            }
            return false;
        }
    }, [user, firestore]);

    return { recordSession };
};
