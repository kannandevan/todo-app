const CACHE_NAME = 'todo-pwa-v1';
const STATIC_URLS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/favicon.ico'
];

// Install: Cache static assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            // Try to cache core files, but don't fail if some are missing
            return cache.addAll(STATIC_URLS).catch(err => console.warn('SW cache addAll error:', err));
        })
    );
    self.skipWaiting();
});

// Activate: Clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((name) => {
                    if (name !== CACHE_NAME) {
                        return caches.delete(name);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch: Network First, fallback to Cache
// This strategy is safer for development as it ensures fresh content when online
self.addEventListener('fetch', (event) => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') return;
    // Skip chrome-extension schemes
    if (event.request.url.startsWith('chrome-extension')) return;

    event.respondWith(
        fetch(event.request)
            .then((networkResponse) => {
                // Cache successful network responses
                const clone = networkResponse.clone();
                if (clone.ok) {
                    caches.open(CACHE_NAME).then((cache) => {
                        // Use put to store the fresh copy
                        cache.put(event.request, clone).catch(err => { });
                    });
                }
                return networkResponse;
            })
            .catch(() => {
                // Fallback to cache if network fails
                return caches.match(event.request);
            })
    );
});
