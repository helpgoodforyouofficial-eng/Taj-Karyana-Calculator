const cacheName = 'taj-calc-v4'; // Har baar update par v3 se v4, v5 karte rehna
const assets = [
  './',
  './index.html',
  './manifest.json'
];

// 1. Install Event: Files ko cache mein save karna
self.addEventListener('install', e => {
  self.skipWaiting(); // Purane service worker ko foran khatam karo
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(assets);
    })
  );
});

// 2. Activate Event: Purane cache ko delete karna (Ye bohat zaroori hai)
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== cacheName).map(key => caches.delete(key))
      );
    })
  );
});

// 3. Fetch Event: Pehle Network se check karo, agar internet nahi hai to Cache se uthao
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request).catch(() => {
      return caches.match(e.request);
    })
  );
});
