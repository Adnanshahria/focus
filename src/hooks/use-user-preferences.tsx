'use client';
import { useState, useCallback } from 'react';
import { useUser, useFirestore, useDoc, useMemoFirebase, setDocumentNonBlocking } from '@/firebase';
import { doc, collection } from 'firebase/firestore';
import { AuthRequiredDialog } from '@/components/auth/auth-required-dialog';

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

    const userPreferencesRef = useMemoFirebase(() => {
        if (!user || user.isAnonymous) return null;
        // All user preferences are stored in a single document named 'main' for simplicity.
        return doc(collection(firestore, `users/${user.uid}/userPreferences`), 'main');
    }, [user, firestore]);

    const { data: preferences, isLoading: isPreferencesLoading } = useDoc<UserPreferences>(userPreferencesRef);
    
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
