'use client';

import { useEffect } from 'react';

export function PwaRegister() {
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
            const swPath = basePath ? `${basePath}/sw.js` : '/sw.js';
            const scope = basePath ? `${basePath}/` : '/';

            navigator.serviceWorker.register(swPath, { scope })
                .then((registration) => {
                    console.log('[PWA] ServiceWorker registered with scope:', registration.scope);

                    // Check for updates on page load
                    registration.update();

                    // Check for updates periodically (every hour)
                    const updateInterval = setInterval(() => {
                        registration.update();
                    }, 60 * 60 * 1000);

                    // Handle updates
                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        if (newWorker) {
                            newWorker.addEventListener('statechange', () => {
                                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                    // New content is available, notify user if needed
                                    console.log('[PWA] New content available, refresh to update');
                                }
                            });
                        }
                    });

                    // Cleanup interval on unmount would require storing the interval ID
                    // For simplicity, we'll let it run as the PWA registration is app-wide
                })
                .catch((err) => {
                    console.error('[PWA] ServiceWorker registration failed:', err);
                });
        }
    }, []);

    return null;
}
