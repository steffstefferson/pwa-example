var staticCacheName = 'myNewsSite-v2.0';

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

self.addEventListener('activate', function (e) {
  console.log('ServiceWorker: Activate');
  e.waitUntil(
    caches.keys().then(function (keyList) {
      return Promise.all(keyList.map(function (key) {
        if (key !== staticCacheName) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});



self.addEventListener('fetch', function (event) {
  //handle browser-sync develop function
  if (event.request.url.indexOf('/browser-sync/') !== -1) {
    event.respondWith(fetch(event.request));
    return;
  }
  console.log('ServiceWorker: fetch called for ' + event.request.url);

  //TODO: will probably not work in production :-)
  var isApplicationShell = event.request.url.indexOf("localhost") !== -1;
  if (isApplicationShell) {
    // cache first strategy for all static files    
    cacheFristStrategy(event);
  } else {
    networkFirstStrategy(event);
  }
});


function cacheFristStrategy(event) {
  console.log("cache first strategy for my ressources.");
  event.respondWith(
    caches.match(event.request).then(function (responseCache) {
      return responseCache || fetch(event.request).then(function (responseFresh) {
        var responseToCache = responseFresh.clone();
        caches.open(staticCacheName).then(function (cache) {
          return cache.put(event.request, responseToCache);
        });
        return responseFresh;
      });
    }));
}


function networkFirstStrategy(event) {
  console.log("network first strategy...");
  event.respondWith(
    caches.open(staticCacheName).then(function (cache) {
      console.log("try network...");
      return fetchFromNetworkAndCache(cache).then(returnFromCache);
    }));

  function fetchFromNetworkAndCache(cache) {
    const request20min = new Request(event.request.url + '?q=' + +new Date(), { mode: 'cors' });
    return fetch(request20min)
      .then(function (responseFresh) {
        if (responseFresh) {
          console.log("got response from network for " + event.request.url + ", cache and return it");
          cache.put(event.request, responseFresh);
          return responseFresh;
        } else {
          console.log("no network connection, try to serve it from cache");
        }
      }, function (err) {
        console.log('error fetch:', err);
      })
  }

  function returnFromCache() {
    return caches.match(event.request).then(function (responseCache) {
      if (responseCache) {
        console.log("return response from cache");
        return responseCache;
      } else {
        console.log("no response in cache, return null");
        return null;
      }
    });
  }
}
