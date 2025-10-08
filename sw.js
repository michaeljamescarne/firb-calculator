/**
 * Service Worker for FIRB Calculator PWA
 * Handles caching, offline support, and background sync
 */

const CACHE_NAME = 'firb-calculator-v1.0.0';
const RUNTIME_CACHE = 'firb-runtime-v1.0.0';

// Files to cache immediately on install
const PRECACHE_URLS = [
    '/',
    '/index.html',
    '/js/utils.js',
    '/js/icons.js',
    '/js/translations.js',
    '/js/calculations.js',
    '/js/state.js',
    '/js/alerts.js',
    '/js/scenarios.js',
    '/js/australiaMap.js',
    '/js/faq.js',
    '/js/timeline.js',
    '/js/investment.js',
    '/js/costOptimizer.js',
    '/js/pdfExport.js',
    '/js/emailSystem.js',
    '/js/mobileOptimization.js',
    '/js/charts.js',
    '/js/resultsDashboard.js',
    '/js/render.js',
    '/js/main.js',
    '/manifest.json'
];

// CDN resources (cache but don't fail if offline)
const CDN_URLS = [
    'https://cdn.tailwindcss.com',
    'https://unpkg.com/lucide@latest',
    'https://unpkg.com/react@18/umd/react.production.min.js',
    'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
    'https://unpkg.com/recharts@2.10.3/dist/Recharts.js',
    'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
    'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js'
];

/**
 * Install event - cache resources
 */
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installing...');

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Service Worker: Caching app shell');
                return cache.addAll(PRECACHE_URLS);
            })
            .then(() => self.skipWaiting())
            .catch(err => console.error('Service Worker: Cache failed', err))
    );
});

/**
 * Activate event - clean up old caches
 */
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activating...');

    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
                            console.log('Service Worker: Deleting old cache', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => self.clients.claim())
    );
});

/**
 * Fetch event - serve from cache, fallback to network
 */
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // Skip chrome extensions
    if (url.protocol === 'chrome-extension:') {
        return;
    }

    // Handle API calls differently (network first)
    if (url.pathname.startsWith('/api/')) {
        event.respondWith(networkFirst(request));
        return;
    }

    // Handle CDN resources (cache first, fallback to network)
    if (CDN_URLS.some(cdn => request.url.startsWith(cdn))) {
        event.respondWith(cacheFirst(request));
        return;
    }

    // Handle app resources (cache first, update in background)
    event.respondWith(cacheFirst(request));
});

/**
 * Cache first strategy - serve from cache, fallback to network
 */
async function cacheFirst(request) {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);

    if (cached) {
        // Serve from cache
        console.log('Service Worker: Serving from cache', request.url);

        // Update cache in background
        fetch(request)
            .then(response => {
                if (response && response.status === 200) {
                    cache.put(request, response.clone());
                }
            })
            .catch(() => {
                // Network error, but we already served from cache
            });

        return cached;
    }

    // Not in cache, fetch from network
    try {
        const response = await fetch(request);

        if (response && response.status === 200) {
            // Cache successful responses
            const cache = await caches.open(RUNTIME_CACHE);
            cache.put(request, response.clone());
        }

        return response;
    } catch (error) {
        console.error('Service Worker: Fetch failed', request.url, error);

        // Return offline page if available
        const offlinePage = await caches.match('/offline.html');
        if (offlinePage) {
            return offlinePage;
        }

        // Return basic offline response
        return new Response('Offline - Please check your connection', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
                'Content-Type': 'text/plain'
            })
        });
    }
}

/**
 * Network first strategy - for API calls
 */
async function networkFirst(request) {
    try {
        const response = await fetch(request);

        if (response && response.status === 200) {
            const cache = await caches.open(RUNTIME_CACHE);
            cache.put(request, response.clone());
        }

        return response;
    } catch (error) {
        console.log('Service Worker: Network failed, trying cache', request.url);

        const cached = await caches.match(request);
        if (cached) {
            return cached;
        }

        throw error;
    }
}

/**
 * Background sync for form submissions
 */
self.addEventListener('sync', (event) => {
    console.log('Service Worker: Background sync', event.tag);

    if (event.tag === 'sync-calculations') {
        event.waitUntil(syncCalculations());
    }
});

async function syncCalculations() {
    // Get pending calculations from IndexedDB
    // Send to server when back online
    // This would require IndexedDB setup
    console.log('Service Worker: Syncing calculations...');
}

/**
 * Push notifications (future feature)
 */
self.addEventListener('push', (event) => {
    if (!event.data) return;

    const data = event.data.json();

    const options = {
        body: data.body || 'FIRB Calculator update',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-96x96.png',
        vibrate: [100, 50, 100],
        data: {
            url: data.url || '/'
        }
    };

    event.waitUntil(
        self.registration.showNotification(data.title || 'FIRB Calculator', options)
    );
});

/**
 * Notification click handler
 */
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    event.waitUntil(
        clients.openWindow(event.notification.data.url || '/')
    );
});

/**
 * Message handler for cache updates
 */
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }

    if (event.data && event.data.type === 'CLEAR_CACHE') {
        event.waitUntil(
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => caches.delete(cacheName))
                );
            })
        );
    }
});
