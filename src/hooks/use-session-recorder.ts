'use client';

import { useCallback } from 'react';
import { useUser, useFirestore } from '@/firebase';
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
        if (!user || user.isAnonymous || !firestore || !sessionStartTime) return false;
        if (mode !== 'pomodoro') return false;

        const durationInMinutes = (Date.now() - sessionStartTime) / (1000 * 60);
        if (durationInMinutes < 0.1) return false;

        const today = new Date().toISOString().split('T')[0];
        const focusRecordRef = doc(firestore, `users/${user.uid}/focusRecords`, today);
        const sessionsCollection = collection(focusRecordRef, 'sessions');
        const newSessionRef = doc(sessionsCollection);

        try {
            await runTransaction(firestore, async (transaction) => {
                const recordSnap = await transaction.get(focusRecordRef);
                const currentData = recordSnap.data() || { totalFocusMinutes: 0, totalPomos: 0 };
                
                const newTotalFocusMinutes = currentData.totalFocusMinutes + durationInMinutes;
                const newTotalPomos = isCompletion ? currentData.totalPomos + 1 : currentData.totalPomos;

                const focusRecordUpdate = {
                    id: today, date: today, userId: user.uid,
                    totalFocusMinutes: newTotalFocusMinutes, totalPomos: newTotalPomos,
                };
                
                transaction.set(focusRecordRef, focusRecordUpdate, { merge: true });
                transaction.set(newSessionRef, {
                    id: newSessionRef.id, focusRecordId: focusRecordRef.id,
                    startTime: new Date(sessionStartTime).toISOString(), endTime: new Date().toISOString(),
                    duration: durationInMinutes, type: mode, completed: isCompletion,
                });
            });
            return true;
        } catch (error) {
            console.error("Transaction to record session failed: ", error);
            return false;
        }
    }, [user, firestore]);

    return { recordSession };
};
