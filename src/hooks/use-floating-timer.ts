'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { AnimationControls } from 'framer-motion';
import { useWakeLock } from './use-wakelock';

export const useFloatingTimer = (controlsAnimation: AnimationControls) => {
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
        // No need for router.replace('/') - the fullscreenchange event listener
        // in page.tsx already handles setting isDeepFocus to false, which
        // unmounts FloatingTimer and shows the regular Timer component.
    }, []);

    useEffect(() => {
        if (isWakeLockSupported) requestWakeLock();
        showControls();

        return () => {
            if (isWakeLockSupported) releaseWakeLock();
            if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
            if (dimTimeoutRef.current) clearTimeout(dimTimeoutRef.current);
        };
    }, [isWakeLockSupported, requestWakeLock, releaseWakeLock, showControls]);

    return { controlsVisible, isDimmed, showControls, handleExit };
};
