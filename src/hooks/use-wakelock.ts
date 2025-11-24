'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * A hook to manage the Screen Wake Lock API.
 * Provides functions to request and release the wake lock,
 * and tracks its status.
 *
 * @returns An object with wake lock status and control functions.
 */
export const useWakeLock = () => {
  const [isSupported, setIsSupported] = useState(false);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  // This effect runs once to check if the Wake Lock API is supported by the browser.
  useEffect(() => {
    setIsSupported('wakeLock' in navigator);
  }, []);

  const request = useCallback(async () => {
    if (!isSupported || wakeLockRef.current) return;

    try {
      const lock = await navigator.wakeLock.request('screen');
      wakeLockRef.current = lock;
      
      lock.addEventListener('release', () => {
        wakeLockRef.current = null;
      });

    } catch (err: any) {
       if (err.name === 'NotAllowedError') {
        console.warn(`Wake Lock request failed: ${err.message}. This can happen in development or if the page is not in focus.`);
      } else {
        console.error(`Wake Lock failed: ${err.name}, ${err.message}`);
      }
    }
  }, [isSupported]);

  const release = useCallback(async () => {
    if (!wakeLockRef.current) return;

    try {
      await wakeLockRef.current.release();
      wakeLockRef.current = null;
    } catch (err: any) {
      console.error(`Wake Lock release failed: ${err.name}, ${err.message}`);
    }
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      // Re-request the lock if the document becomes visible and a lock was previously active
      if (wakeLockRef.current && document.visibilityState === 'visible') {
        request();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [request]);

  return { isSupported, isLocked: !!wakeLockRef.current, request, release };
};
