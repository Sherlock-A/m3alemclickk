// M3allemClick Service Worker — Cache-first for assets, network-first for pages
const CACHE = 'm3c-v1';
const STATIC = [
  '/',
  '/professionals',
  '/offline.html',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(STATIC)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const { request } = e;
  const url = new URL(request.url);

  // Don't intercept non-GET or cross-origin
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;

  // API calls — network only (never cache)
  if (url.pathname.startsWith('/api/')) return;

  // Build assets (fingerprinted) — cache-first
  if (url.pathname.startsWith('/build/')) {
    e.respondWith(
      caches.match(request).then((cached) =>
        cached ?? fetch(request).then((res) => {
          const clone = res.clone();
          caches.open(CACHE).then((c) => c.put(request, clone));
          return res;
        })
      )
    );
    return;
  }

  // HTML pages — network-first, fallback to cache then offline page
  e.respondWith(
    fetch(request)
      .then((res) => {
        const clone = res.clone();
        caches.open(CACHE).then((c) => c.put(request, clone));
        return res;
      })
      .catch(() =>
        caches.match(request).then((cached) =>
          cached ?? caches.match('/offline.html')
        )
      )
  );
});
