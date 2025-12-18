'use client';

import { useState, useEffect } from 'react';

export function useOfflineStatus() {
    const [isOnline, setIsOnline] = useState(true);
    const [wasOffline, setWasOffline] = useState(false);

    useEffect(() => {
        // Set initial state on client
        setIsOnline(navigator.onLine);

        const handleOnline = () => {
            setIsOnline(true);
            setWasOffline(true); // Flag that we came back online
            setTimeout(() => setWasOffline(false), 3000); // Reset after 3s
        };

        const handleOffline = () => {
            setIsOnline(false);
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return { isOnline, wasOffline };
}
