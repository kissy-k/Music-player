
const CACHE_NAME = "girlypub-cache-v1";
const OFFLINE_FILES = [
  "./",
  "./index.html",
  "./manifest.json"
  // if you add external icons (icon-192.png etc) add them here:
  // "./icon-192.png", "./icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(OFFLINE_FILES))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  // Only handle GET requests
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((networkResponse) => {
        // Optionally cache fetched files (careful with large dynamic responses)
        return networkResponse;
      }).catch(() => {
        // If offline and the request is for a navigation (page), serve index.html
        if (event.request.mode === "navigate") {
          return caches.match("./index.html");
        }
      });
    })
  );
});