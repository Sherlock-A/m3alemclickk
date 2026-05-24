// Jobly PWA Service Worker — push notifications + offline shell cache
const CACHE = 'jobly-v1';
const SHELL = ['/'];

// ── Install: cache app shell ───────────────────────────────────────────────────
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

// ── Activate: clean old caches ─────────────────────────────────────────────────
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// ── Fetch: network-first, fallback to cache for navigation ────────────────────
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);

  // Skip API calls — always network only
  if (url.pathname.startsWith('/api/')) return;

  // Navigation requests: network-first, fallback to shell
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request)
        .catch(() => caches.match('/'))
    );
  }
});

// ── Push: show notification ────────────────────────────────────────────────────
self.addEventListener('push', (e) => {
  if (!e.data) return;

  let data = { title: 'Jobly', body: 'Vous avez un nouveau contact !', url: '/dashboard/professional' };
  try { data = { ...data, ...JSON.parse(e.data.text()) }; } catch {}

  e.waitUntil(
    self.registration.showNotification(data.title, {
      body:    data.body,
      icon:    '/icons/icon-192.png',
      badge:   '/icons/icon-192.png',
      data:    { url: data.url },
      vibrate: [200, 100, 200],
      actions: [
        { action: 'open',    title: 'Voir le dashboard' },
        { action: 'dismiss', title: 'Ignorer' },
      ],
    })
  );
});

// ── Notification click ─────────────────────────────────────────────────────────
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  if (e.action === 'dismiss') return;

  const target = e.notification.data?.url ?? '/dashboard/professional';
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((wins) => {
      const match = wins.find((w) => w.url.includes(target));
      if (match) return match.focus();
      return clients.openWindow(target);
    })
  );
});
