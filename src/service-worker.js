self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('zivra-cache').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/src/main.tsx',
        // Add other assets to cache
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
