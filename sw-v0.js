var staticCacheName = 'myNewsSite-v0';

self.addEventListener('install', function (event) {
  console.log('ServiceWorker (' + staticCacheName + '): install called');
  event.waitUntil(
    caches.open(staticCacheName).then(function (cache) {
      return cache.addAll([
        '/',
        'index.html',
        'manifest.json',
        'lib/jquery.min.js',
        'lib/bootstrap.min.css',
        'custom.css',
        'feedReader.js',
      ]);
    })
  );
});

self.addEventListener('activate', function (event) {
  console.log('ServiceWorker: Activate');
  //activate active worker asap
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', function (event) {

  //handle browser-reload develop function
  if (event.request.url.indexOf('/browser-sync/') !== -1) {
    event.respondWith(fetch(event.request));
    return;
  }

  console.log('ServiceWorker: fetch called for ' + event.request.url);

  //if request in cache then return it, otherwise fetch it from the network
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request);
    })
  );
});
