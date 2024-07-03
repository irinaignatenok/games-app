const cacheName = 'cacheAssets-v14'

// On install Event
// Triggered when the service worker is installed
self.addEventListener('install', (event) => {
    console.log('[SW]Install:', event);

    // Activate itself when it enters the waiting phase
    self.skipWaiting();


    // Create the static cache.
    event.waitUntil(
        caches.open(cacheName)
            .then((cache) => {
                cache.addAll([
                    '/',
                    '/index.html',
                    '/pages/add/index.html',
                    '/pages/add/',
                    '/pages/list',
                    '/pages/list/index.html',
                    '/js/script.js',
                    '/css/style.css',
                    '/images/logo.jpeg',
                    '/manifest.json',
                    '/icon/favicon-196.png',
                    '/icons/favicon-32x32.png',
                    '/icons/android-chrome-144x144.png',
                    '/offline.html'

                ])
            })
            .catch((error) => {
                console.log('Cache failed:', error)
            })

    )

});

/*
On Activate Event.
Triggered when the service worker is activated
*/
self.addEventListener('activate', (event) => {
    // console.log('[SW] Activate!:', event);


    // Immediately get control over the open pages.
    event.waitUntil(clients.claim());

    // Removes caches that are no longer necessary. We should use the previous cache
    // wait until the cache wil be deleted
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                cacheNames.forEach((item) => {
                    console.log('Found: ', item)
                    if (item !== cacheName) {
                        caches.delete(item);
                    }
                })
            })
    );

});

// This line will be executed after getting control over open pages


/* On fetch Event.
*Triggered when the service worker retrives an asset.
*/


self.addEventListener('fetch', (event) => {
    // event.respondWith(
    //     caches.match(event.request)
    //         .then((response) => {
    //             console.log("Response", response)
    //             return response;
    //         })
    //         .catch((error) => {
    //             console.log("Matchrd failed", error)
    //         })
    // )
    // console.log(event.request);
    // we are open the specific caches in stead of all objects

    // //Cache only strategies
    // event.respondWith(
    //     caches.open(cacheName)
    //         .then((cache) => {
    //             return cache.match(event.request)
    //                 .then((response) => {
    //                     return response
    //                 })
    //         })
    // )


    // //Cache strategy: Network only
    // event.respondWith(
    //     fetch(event.request)
    // )


    // //Cache strategy: Cache with Network Fallback
    // event.respondWith(
    //     caches.open(cacheName)
    //         .then((cache) => {
    //             return cache.match(event.request)
    //                 .then((response) => {
    //                     return response || fetch(event.request)

    //                 })
    //         })
    // )

    // //Cache strategy: Network with cache Fallback
    // event.respondWith(
    //     fetch(event.request)
    //         .catch(() => {
    //             return caches.open(cacheName)
    //                 .then((cache) => {
    //                     return cache.match(event.request)
    //                 })
    //         })
    // )


    // // THE BEST Cache strategy: State While Revalidate
    event.respondWith(
        caches.open(cacheName)
            .then((cache) => {
                return cache.match(event.request)
                    .then((cachedResponse) => {
                        const fetchedResponse = fetch(event.request)
                            .then((networkResponse) => {
                                cache.put(event.request, networkResponse.clone());
                                return networkResponse;
                            })
                            // if there is not connection I have to get sothing from the cache
                            .catch(() => {
                                return cache.match('/offline.html')
                            })
                        return cachedResponse || fetchedResponse;
                    })
            })
    )
})

