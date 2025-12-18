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

const PREFERENCES_KEY = 'focusflow_preferences';

export type UserPreferences = {
    theme?: 'light' | 'dark';
    antiBurnIn?: boolean;
    pomodoroDuration?: number;
    shortBreakDuration?: number;
    longBreakDuration?: number;
    weekStartsOn?: WeekStartDay;
    dailyGoalMinutes?: number; // Daily focus goal in minutes (default: 120 = 2 hours)
}

const DEFAULT_PREFERENCES: UserPreferences = {
    pomodoroDuration: 25 * 60,
    shortBreakDuration: 5 * 60,
    longBreakDuration: 15 * 60,
    weekStartsOn: 1,
    dailyGoalMinutes: 120,
    antiBurnIn: true,
};

function getLocalPreferences(): UserPreferences {
    if (typeof window === 'undefined') return DEFAULT_PREFERENCES;
    try {
        const stored = localStorage.getItem(PREFERENCES_KEY);
        if (stored) {
            return { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) };
        }
    } catch (e) {
        console.error('[Preferences] Failed to load from localStorage:', e);
    }
    return DEFAULT_PREFERENCES;
}

function setLocalPreferences(prefs: UserPreferences) {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(PREFERENCES_KEY, JSON.stringify(prefs));
    } catch (e) {
        console.error('[Preferences] Failed to save to localStorage:', e);
    }
}

export function useUserPreferences() {
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();
    const [isAuthDialogOpen, setAuthDialogOpen] = useState(false);
    const [localPrefs, setLocalPrefs] = useState<UserPreferences>(DEFAULT_PREFERENCES);
    const setTimerStoreDurations = useTimerStore(state => state.setDurations);
    const setTimerStoreVisuals = useTimerStore(state => state.setVisuals);

    // Load from localStorage on mount (client-side only)
    useEffect(() => {
        setLocalPrefs(getLocalPreferences());
    }, []);

    const userPreferencesRef = useMemoFirebase(() => {
        if (!user || user.isAnonymous) return null;
        // All user preferences are stored in a single document named 'main' for simplicity.
        return doc(collection(firestore, `users/${user.uid}/userPreferences`), 'main');
    }, [user, firestore]);

    const { data: firestorePreferences, isLoading: isPreferencesLoading } = useDoc<UserPreferences>(userPreferencesRef);

    // Sync Firestore preferences to localStorage when they change
    useEffect(() => {
        if (firestorePreferences) {
            // Use functional update to avoid stale closure issue
            setLocalPrefs(currentLocalPrefs => {
                const merged = { ...currentLocalPrefs, ...firestorePreferences };
                setLocalPreferences(merged);
                return merged;
            });
        }
    }, [firestorePreferences]);

    // This effect is the single source of truth for synchronizing prefs with the Zustand store.
    // It uses localPrefs which is always available (from localStorage or Firestore)
    useEffect(() => {
        const prefs = localPrefs;
        setTimerStoreDurations({
            pomodoroDuration: prefs.pomodoroDuration || 25 * 60,
            shortBreakDuration: prefs.shortBreakDuration || 5 * 60,
            longBreakDuration: prefs.longBreakDuration || 15 * 60,
        });
        setTimerStoreVisuals({
            antiBurnIn: prefs.antiBurnIn ?? true
        });
    }, [localPrefs, setTimerStoreDurations, setTimerStoreVisuals]);

    const updatePreferences = useCallback((newPrefs: Partial<UserPreferences>) => {
        // Always update localStorage first for offline support
        const merged = { ...localPrefs, ...newPrefs };
        setLocalPrefs(merged);
        setLocalPreferences(merged);

        // If not logged in, prompt for auth
        if (!user || user.isAnonymous || !userPreferencesRef) {
            setAuthDialogOpen(true);
            return;
        }

        // Sync to Firestore (Firestore SDK handles offline queuing)
        if (typeof navigator !== 'undefined') {
            setDocumentNonBlocking(userPreferencesRef, { id: 'main', ...newPrefs }, { merge: true });
        }
    }, [user, userPreferencesRef, localPrefs]);

    const AuthDialog = () => (
        <AuthRequiredDialog
            open={isAuthDialogOpen}
            onOpenChange={setAuthDialogOpen}
            featureName="save your settings"
        />
    );

    return {
        preferences: localPrefs,
        isLoading: isUserLoading || isPreferencesLoading,
        updatePreferences,
        AuthDialog,
        isAuthDialogOpen,
        setAuthDialogOpen
    };
}
