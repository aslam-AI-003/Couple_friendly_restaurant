/* eslint-disable no-restricted-globals */

const CACHE_NAME = 'couple-friendly-hub-v2';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo.png',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Offline queue for storing actions when offline
const OFFLINE_QUEUE_KEY = 'cf_offline_queue';

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker: Installing v2...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('📦 Service Worker: Caching static assets');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  console.log('✅ Service Worker: Activated v2');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Service Worker: Removing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - Network first strategy with offline fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Skip non-GET requests (POST/PUT/DELETE) - these are handled by offline queue in the app
  if (request.method !== 'GET') return;

  // Skip Firebase requests - always go to network (Firebase has its own offline persistence)
  if (
    request.url.includes('firestore.googleapis.com') ||
    request.url.includes('firebase') ||
    request.url.includes('googleapis.com') ||
    request.url.includes('identitytoolkit')
  ) {
    return;
  }

  // Skip API requests - always try network
  if (request.url.includes('/api/')) {
    return;
  }

  // For all other requests (static assets, HTML, CSS, JS)
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return fetch(request)
        .then((networkResponse) => {
          // Cache successful GET responses
          if (networkResponse.status === 200) {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        })
        .catch(() => {
          // Network failed - serve from cache
          return cache.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // For navigation requests, serve the cached index.html (SPA)
            if (request.mode === 'navigate') {
              return cache.match('/index.html');
            }
            // Return offline fallback for other requests
            return new Response('Offline', { status: 503, statusText: 'Offline' });
          });
        });
    })
  );
});

// Listen for messages from the app (for offline sync)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Background sync - retry failed requests when back online
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-offline-orders') {
    console.log('🔄 Service Worker: Syncing offline orders...');
    event.waitUntil(syncOfflineData());
  }
});

async function syncOfflineData() {
  // Notify all clients to sync their offline data
  const clients = await self.clients.matchAll();
  clients.forEach(client => {
    client.postMessage({ type: 'SYNC_OFFLINE_DATA' });
  });
}
