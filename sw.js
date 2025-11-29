const CACHE_NAME = 'egocoach-v2';
const RUNTIME_CACHE = 'egocoach-runtime';

// Files to cache on install
const PRECACHE_URLS = [
    '/',
    '/index.html',
    '/assets/css/styles.css',
    '/assets/css/modules.css',
    '/assets/css/animations.css',
    '/assets/js/core/app.js',
    '/assets/js/core/router.js',
    '/assets/js/core/store.js',
    '/assets/js/core/eventBus.js',
    '/assets/js/core/keyboardShortcuts.js',
    '/favicon.png',
    '/404.html'
];

// Install event - cache core files
self.addEventListener('install', event => {
    console.log('[SW] Installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('[SW] Caching app shell');
                return cache.addAll(PRECACHE_URLS);
            })
            .then(() => self.skipWaiting())
    );
});

// Activate event - clean old caches
self.addEventListener('activate', event => {
    console.log('[SW] Activating...');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames
                    .filter(name => name !== CACHE_NAME && name !== RUNTIME_CACHE)
                    .map(name => {
                        console.log('[SW] Deleting old cache:', name);
                        return caches.delete(name);
                    })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip cross-origin requests
    if (url.origin !== location.origin) {
        return;
    }

    // Network-first for API calls (if any)
    if (url.pathname.startsWith('/api/')) {
        event.respondWith(networkFirst(request));
        return;
    }

    // Cache-first for static assets
    if (
        request.destination === 'style' ||
        request.destination === 'script' ||
        request.destination === 'font' ||
        request.destination === 'image'
    ) {
        event.respondWith(cacheFirst(request));
        return;
    }

    // Stale-while-revalidate for HTML
    event.respondWith(staleWhileRevalidate(request));
});

// Cache-first strategy
async function cacheFirst(request) {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);

    if (cached) {
        return cached;
    }

    try {
        const response = await fetch(request);
        if (response.ok) {
            cache.put(request, response.clone());
        }
        return response;
    } catch (error) {
        console.error('[SW] Fetch failed:', error);
        // Return offline page if available
        return cache.match('/404.html');
    }
}

// Network-first strategy
async function networkFirst(request) {
    try {
        const response = await fetch(request);
        const cache = await caches.open(RUNTIME_CACHE);
        cache.put(request, response.clone());
        return response;
    } catch (error) {
        const cached = await caches.match(request);
        return cached || new Response('Offline', { status: 503 });
    }
}

// Stale-while-revalidate strategy
async function staleWhileRevalidate(request) {
    const cache = await caches.open(RUNTIME_CACHE);
    const cached = await cache.match(request);

    const fetchPromise = fetch(request).then(response => {
        if (response.ok) {
            cache.put(request, response.clone());
        }
        return response;
    }).catch(() => cached || caches.match('/404.html'));

    return cached || fetchPromise;
}

// Listen for messages from the client
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
