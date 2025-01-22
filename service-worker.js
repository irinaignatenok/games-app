import gameDB from './js/game-db/game-db.js';

const cacheName = 'cacheAssets-v11'

// On install Event
// Triggered when the service worker is installed
self.addEventListener('install', (event) => {
    // console.log('[SW]Install:', event);

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
                    // console.log('Found: ', item)
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
    console.log("Request:", event.request.method)
    if (event.request.method === 'GET') {
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
    }

})

// Broadcast a message to the user
clients.matchAll().then((clients) => {
    clients.forEach((client) => {
        client.postMessage({
            action: 'game-sync',
            count: games.length
        })
    })
})
// On Message Posted

self.addEventListener('message', (event) => {
    const data = event.data;
    // console.log("Data", data)
    // console.log("Message received", event)

    const whoPostedTheMEssage = event.source;
    // console.log('Sending a messgae to the Client!...')
    whoPostedTheMEssage.postMessage("Thanks for the message!!!")


    //  Message to all clients
    const options = {
        includeUncontrolled: false,
        type: 'window'
    };
    clients.matchAll(options)
        .then((matchClients) => {
            matchClients.forEach((client) => {
                if (client.id !== whoPostedTheMEssage.id) {
                    client.postMessage('Soneone else send a message')
                }
            })
        })
})


// On Background Synchronization
// 
self.addEventListener('sync', (event) => {
    console.log("[SW] Bg Sync:", event);

    switch (event.tag) {
        case 'my-tag-name':
            console.log('Do Something');
            // Perform tasks for 'my-tag-name' synchronization
            // event.waitUntil(doSomething());
            break;

        case 'add-game':
            console.log("Add ME");
            addGame()
            // Call the function to add the game, ensuring it returns a promise
            // event.waitUntil(addGame());
            break;
    }

});

function addGame() {

    // Open the offline database
    gameDB.dbOffline.open()
        .then(() => {
            // Get all locally saved games
            gameDB.dbOffline.getAll()
                .then((games) => {
                    // Open the online database
                    gameDB.dbOnline.open()
                        .then(() => {

                            // Save the games online
                            games.forEach(game => {
                                gameDB.dbOnline.add(game.title, game.genre, game.hasFinished)
                                    .then(() => {
                                        console.log("Game saved", game);
                                        gameDB.dbOffline.delete(game.id);
                                    })
                                    .catch((error) => console.log(error))
                            });
                            //  Broadcast a message to the user(clients are inside service worker)
                            // we trigger this function in add/script.js   // On Message Posted to a Client.
                            clients.matchAll()
                                .then((clients) => {
                                    clients.forEach((client) => {
                                        client.postMessage({
                                            action: 'game-sync',
                                            count: games.length
                                        })
                                    })
                                })
                            // Also display notification
                            const message = `Syncronized ${games.lengh} games!`
                            registration.showNotofication(message);
                        })
                        .catch((error) => console.log(error))
                })

        })
        .catch((error) => console.log(error))
}

/**
 * On Notification Click. it will trigger if in the script file we have a function showNotofocation
 *
 */

self.addEventListener('notificationclick', (event) => {
    const data = event.notification.data;
    console.log('Event', event)
    switch (event.action) {
        case 'confirm':
            break;

        case 'cancel':
            break;

        default:
            console.log('Clicked on the notification')
            const openPromise = clients.openWindow('/pages/add');
            event.waitUntil(openPromise);
            break;
    }
})

/**
 * On Push message received.
 */
self.addEventListener('push', (event) => {
    console.log('Event:', event)
    console.log('Data:', event.data); //it is pushed from the server

    const data = event.data.json(); //receiving json method from the server
    console.log('Data content:', data)

    // Display notification
    const options = {
        body: data.description,
        image: data.image
    }
    // event.waitUntil //showNotification is a asyncronies function we use this method make surewe get everything up to here and move to another line
    event.waitUntil(
        self.registration.showNotification(data.title, options)
        // self.registration.showNotification('My notification')//notification will come back from the server
    )
});