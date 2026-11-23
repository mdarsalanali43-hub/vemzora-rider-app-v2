const CACHE_NAME = "vemzora-rider-shell-v2";
const APP_SHELL = ["/", "/rider-manifest.webmanifest", "/rider-icon-192.png", "/rider-icon-512.png"];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET" || new URL(req.url).origin !== self.location.origin) return;
  event.respondWith(fetch(req).then(res => {
    if (res && res.ok) { const copy = res.clone(); caches.open(CACHE_NAME).then(c => c.put(req, copy)); }
    return res;
  }).catch(() => caches.match(req).then(hit => hit || caches.match("/"))));
});

// Ready-order push events can be delivered here once a push service is configured.
self.addEventListener("push", event => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch (_) { data = { body: event.data ? event.data.text() : "A delivery is ready." }; }
  event.waitUntil(self.registration.showNotification(data.title || "Vemzora • New delivery ready", {
    body: data.body || "A new order is ready. Tap to open the rider app.",
    icon: "/rider-icon-192.png", badge: "/rider-icon-192.png",
    tag: data.tag || "vemzora-ready-order", renotify: true, data: { url: data.url || "/?riderApp=1" }
  }));
});

self.addEventListener("notificationclick", event => {
  event.notification.close();
  const target = new URL(event.notification.data?.url || "/?riderApp=1", self.location.origin).href;
  event.waitUntil(clients.matchAll({ type: "window", includeUncontrolled: true }).then(list => {
    for (const client of list) { if (client.url.startsWith(self.location.origin) && "focus" in client) { client.navigate(target); return client.focus(); } }
    return clients.openWindow(target);
  }));
});
