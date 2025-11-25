'use client';

import { useCallback } from 'react';
import { useUser } from '@/firebase';
import { useFirestore } from '@/firebase/hooks/hooks';
import { doc, collection, runTransaction } from 'firebase/firestore';
import { TimerMode } from '@/store/timer-state';

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

        const today = new Date().toISOString().split('T')[0];
        const focusRecordRef = doc(firestore, `users/${user.uid}/focusRecords`, today);
        const sessionsCollection = collection(focusRecordRef, 'sessions');
        const newSessionRef = doc(sessionsCollection);

        try {
            await runTransaction(firestore, async (transaction) => {
                const recordSnap = await transaction.get(focusRecordRef);
                const currentData = recordSnap.data() || { totalFocusMinutes: 0, totalPomos: 0 };
                
                let newTotalFocusMinutes = currentData.totalFocusMinutes;
                let newTotalPomos = currentData.totalPomos;

                // Only add to totals if it's a pomodoro session
                if (mode === 'pomodoro') {
                    newTotalFocusMinutes += durationInMinutes;
                    if (isCompletion) {
                        newTotalPomos += 1;
                    }
                }

                const focusRecordUpdate = {
                    id: today, date: today, userId: user.uid,
                    totalFocusMinutes: newTotalFocusMinutes, totalPomos: newTotalPomos,
                };
                
                // Record all session types (pomodoro, shortBreak, longBreak)
                transaction.set(newSessionRef, {
                    id: newSessionRef.id, focusRecordId: focusRecordRef.id,
                    startTime: new Date(sessionStartTime).toISOString(), endTime: new Date().toISOString(),
                    duration: durationInMinutes, type: mode, completed: isCompletion,
                });

                // Update the daily aggregate record
                transaction.set(focusRecordRef, focusRecordUpdate, { merge: true });
            });
            return true;
        } catch (error) {
            console.error("Transaction to record session failed: ", error);
            return false;
        }
    }, [user, firestore]);

    return { recordSession };
};
