const CACHE_NAME = "music-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/styles.css",   // your CSS file
  "/script.js",    // your JS file
  "/icon-192.png",
  "/icon-512.png",
  "/assets/song1.mp3",
  "/assets/song2.mp3"
];

// Install service worker and cache files
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch from cache if available
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
    console.log("Service Worker: Fetching ", event.request.url);
});
