'use client';
import { useState, useCallback, useEffect } from 'react';
import { useUser } from '@/firebase';
import { useFirestore, useMemoFirebase } from '@/firebase/hooks/hooks';
import { useDoc } from '@/firebase/firestore/use-doc';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { doc, collection } from 'firebase/firestore';
import { AuthRequiredDialog } from '@/components/auth/auth-required-dialog';
import { useTimerStore } from '@/store/timer-store';

export type WeekStartDay = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type UserPreferences = {
    theme?: 'light' | 'dark';
    antiBurnIn?: boolean;
    pomodoroDuration?: number;
    shortBreakDuration?: number;
    longBreakDuration?: number;
    weekStartsOn?: WeekStartDay;
}

export function useUserPreferences() {
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();
    const [isAuthDialogOpen, setAuthDialogOpen] = useState(false);
    const setTimerStoreDurations = useTimerStore(state => state.setDurations);
    const setTimerStoreVisuals = useTimerStore(state => state.setVisuals);


    const userPreferencesRef = useMemoFirebase(() => {
        if (!user || user.isAnonymous) return null;
        // All user preferences are stored in a single document named 'main' for simplicity.
        return doc(collection(firestore, `users/${user.uid}/userPreferences`), 'main');
    }, [user, firestore]);

    const { data: preferences, isLoading: isPreferencesLoading } = useDoc<UserPreferences>(userPreferencesRef);

    // This effect is the single source of truth for synchronizing Firestore prefs with the Zustand store.
    useEffect(() => {
        if (preferences) {
            const { pomodoroDuration, shortBreakDuration, longBreakDuration, antiBurnIn } = preferences;
            setTimerStoreDurations({
                pomodoroDuration: pomodoroDuration || 25 * 60,
                shortBreakDuration: shortBreakDuration || 5 * 60,
                longBreakDuration: longBreakDuration || 15 * 60,
            });
            setTimerStoreVisuals({
                antiBurnIn: antiBurnIn ?? true
            });
        }
    }, [preferences, setTimerStoreDurations, setTimerStoreVisuals]);

    const updatePreferences = useCallback((newPrefs: Partial<UserPreferences>) => {
        if (!user || user.isAnonymous || !userPreferencesRef) {
            setAuthDialogOpen(true);
            return;
        }
        setDocumentNonBlocking(userPreferencesRef, { id: 'main', ...newPrefs }, { merge: true });
    }, [user, userPreferencesRef]);

    const AuthDialog = () => (
        <AuthRequiredDialog
            open={isAuthDialogOpen}
            onOpenChange={setAuthDialogOpen}
            featureName="save your settings"
        />
    );

    return {
        preferences,
        isLoading: isUserLoading || isPreferencesLoading,
        updatePreferences,
        AuthDialog,
        isAuthDialogOpen,
        setAuthDialogOpen
    };
}
