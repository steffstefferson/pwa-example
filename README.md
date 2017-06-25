# pwa-example
example of a pwa newssite 

checkout the diffrent kind of service-workers

sw-v0.js
(to use it copy the file content to sw.js)
caches the app shell but not the rssfeed

sw-v1.js
(to use it copy the file content to sw.js)
caches the app shell and also the rssfeed, but for both a cache first strategy is applied

sw-v2.js
(to use it copy the file content to sw.js)
cache first strategy for app shell and network first strategy for the rssfeed

Note: consider using tools like sw-precache, sw-toolbox or workbox when dealing with service workers.