var staticCacheName = 'myNewsSite-v1';

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

  event.waitUntil(deleteOldCacheVersions().then(function () {
    self.clients.claim();
  }));

  function deleteOldCacheVersions() {
    return caches.keys().then(function (keyList) {
      return Promise.all(keyList.map(function (key) {
        if (key !== staticCacheName) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    });
  }
});

self.addEventListener('fetch', function (event) {
  //handle browser-sync develop function
  if (event.request.url.indexOf('/browser-sync/') !== -1) {
    event.respondWith(fetch(event.request));
    return;
  }

  console.log('ServiceWorker: fetch called for ' + event.request.url);

  //if request in cache then return it, otherwise fetch it from the network
  //the request from the network is cached for further usings.
  event.respondWith(
    caches.match(event.request).then(function (responseFromCache) {
      return responseFromCache || fetch(event.request).then(function (responseFresh) {
        var responseToCache = responseFresh.clone();
        caches.open(staticCacheName).then(function (cache) {
          return cache.put(event.request, responseToCache);
        });
        return responseFresh;
      });
    })
  );
});