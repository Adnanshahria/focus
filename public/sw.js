const CACHE_VERSION = 'v4';
const CACHE_NAME = `focusflow-${CACHE_VERSION}`;

const STATIC_ASSETS = [
    '/',
    '/manifest.json',
    '/icon-192.png',
    '/icon-512.png',
    '/logo.png'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(STATIC_ASSETS))
            .catch((err) => console.error('Failed to cache static assets:', err))
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name.startsWith('focusflow-') && name !== CACHE_NAME)
                    .map((name) => {
                        console.log('[SW] Deleting old cache:', name);
                        return caches.delete(name);
                    })
            );
        }).then(() => {
            // Take control of all clients immediately
            return self.clients.claim();
        })
    );
});

// Fetch event - stale-while-revalidate strategy
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') return;

    // Skip Chrome extension requests
    if (url.protocol === 'chrome-extension:') return;

    // Skip Firebase/Google API requests (handled by Firestore SDK offline persistence)
    if (url.hostname.includes('firestore.googleapis.com') ||
        url.hostname.includes('firebase') ||
        url.hostname.includes('googleapis.com') ||
        url.hostname.includes('firebaseio.com')) {
        return;
    }

    // Skip WebSocket and other non-HTTP(S) protocols
    if (!url.protocol.startsWith('http')) return;

    // For navigation requests (HTML pages), use network-first
    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    if (response && response.status === 200) {
                        const clone = response.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
                    }
                    return response;
                })
                .catch(() => caches.match(request).then((cached) => cached || caches.match('/')))
        );
        return;
    }

    // For static assets (JS, CSS, images), use stale-while-revalidate
    event.respondWith(
        caches.match(request).then((cached) => {
            // Return cached version immediately if available
            const fetchPromise = fetch(request)
                .then((response) => {
                    // Only cache successful responses
                    if (response && response.status === 200 && response.type === 'basic') {
                        const clone = response.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
                    }
                    return response;
                })
                .catch((err) => {
                    console.log('[SW] Fetch failed, returning cached:', request.url);
                    return cached;
                });

            return cached || fetchPromise;
        })
    );
});

// Handle messages from the app
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
