// M3allemClick Service Worker — v2
// Cache-first for assets, network-first for pages, offline fallback
const CACHE_NAME = 'm3c-v2';
const STATIC_ASSETS = [
  '/',
  '/professionals',
  '/offline.html',
  '/manifest.json',
];

// Install — pre-cache static shell
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then((c) => c.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate — purge old caches
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const { request } = e;
  const url = new URL(request.url);

  // Skip non-GET and cross-origin
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;

  // API calls — always network (no cache)
  if (url.pathname.startsWith('/api/')) return;

  // Fingerprinted build assets — cache-first (permanent)
  if (url.pathname.startsWith('/build/') || url.pathname.startsWith('/icons/')) {
    e.respondWith(
      caches.match(request).then((cached) =>
        cached ?? fetch(request).then((res) => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((c) => c.put(request, clone));
          }
          return res;
        })
      )
    );
    return;
  }

  // Professional profile pages — cache for offline reading
  if (url.pathname.startsWith('/professionals/')) {
    e.respondWith(
      fetch(request)
        .then((res) => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((c) => c.put(request, clone));
          }
          return res;
        })
        .catch(() =>
          caches.match(request).then((cached) =>
            cached ?? caches.match('/offline.html')
          )
        )
    );
    return;
  }

  // HTML pages — network-first, fallback to cache then offline page
  e.respondWith(
    fetch(request)
      .then((res) => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(request, clone));
        }
        return res;
      })
      .catch(() =>
        caches.match(request).then((cached) =>
          cached ?? caches.match('/offline.html')
        )
      )
  );
});

// Notify clients when new SW is available
self.addEventListener('message', (e) => {
  if (e.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
