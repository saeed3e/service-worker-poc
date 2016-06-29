var CACHE_NAME = 'my-site-cache-v6';

// The files we want to cache
var urlsToCache = [
    'http://localhost/Dropbox/git/Static4/service-worker-poc/styles/style.css',
    'http://localhost/Dropbox/git/Static4/service-worker-poc/script/main.js'
];


self.addEventListener('fetch', function(event) {
  console.log('fetch')
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        
        // Cache hit - return response
        if (response) {
          return response;
        }
        console.log('response:........',response)
         // IMPORTANT: Clone the request. A request is a stream and
        // can only be consumed once. Since we are consuming this
        // once by cache and once by the browser for fetch, we need
        // to clone the response
        var fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          function(response) {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have 2 stream.
            var responseToCache = response.clone();

            caches.open(CACHE_NAME).then(function(cache) {
                cache.put(event.request, responseToCache);
              });
            console.log(response)
            return response;
          }
        );
      }
    )
  );
});



// Set the callback for the install step
self.addEventListener('install', function(event) {
    // Perform install steps
    self.skipWaiting();
    console.log('install');

    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            console.log('Opened cache',urlsToCache,cache);
            return cache.addAll(urlsToCache);
        })
    );
});



self.addEventListener('activate', function(event) {
	console.log('activate');
  var cacheWhitelist = [CACHE_NAME,'pages-cache-v1', 'blog-posts-cache-v1'];

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
        	console.log(cacheName);
        	console.log(cacheWhitelist);
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});