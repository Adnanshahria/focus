'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AnimationControls } from 'framer-motion';
import { useWakeLock } from './use-wakelock';

export const useFloatingTimer = (controlsAnimation: AnimationControls) => {
    const router = useRouter();
    const [controlsVisible, setControlsVisible] = useState(false);
    const [isDimmed, setIsDimmed] = useState(false);
    const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const dimTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const { isSupported: isWakeLockSupported, request: requestWakeLock, release: releaseWakeLock } = useWakeLock();

    const showControls = useCallback(() => {
        setIsDimmed(false);
        setControlsVisible(true);
        controlsAnimation.start({ opacity: 1, y: 0 });
        if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
        if (dimTimeoutRef.current) clearTimeout(dimTimeoutRef.current);

        controlsTimeoutRef.current = setTimeout(() => {
            controlsAnimation.start({ opacity: 0, y: 10 }).then(() => setControlsVisible(false));
        }, 3000);

        dimTimeoutRef.current = setTimeout(() => {
            setIsDimmed(true);
        }, 20000);
    }, [controlsAnimation]);

    const handleExit = useCallback(() => {
        if (document.fullscreenElement) {
            document.exitFullscreen().catch(err => console.error(err));
        }
        router.push('/');
    }, [router]);

    useEffect(() => {
        if (isWakeLockSupported) requestWakeLock();
        showControls();

        const handlePopState = (event: PopStateEvent) => {
            event.preventDefault();
            handleExit();
        };

        if (window.history.state?.page !== 'deepFocus') {
            window.history.pushState({ page: 'deepFocus' }, '');
        }

        window.addEventListener('popstate', handlePopState);

        return () => {
            if (isWakeLockSupported) releaseWakeLock();
            if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
            if (dimTimeoutRef.current) clearTimeout(dimTimeoutRef.current);
            window.removeEventListener('popstate', handlePopState);
            if (window.history.state?.page === 'deepFocus') {
                try { window.history.back(); } catch(e) {}
            }
        };
    }, [isWakeLockSupported, requestWakeLock, releaseWakeLock, showControls, handleExit]);

    return { controlsVisible, isDimmed, showControls, handleExit };
};
