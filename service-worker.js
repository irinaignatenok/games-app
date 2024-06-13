// On install Event
// Triggered when the service worker is installed
self.addEventListener('install', (event) => {
    console.log('[SW]Install:', event);

    // Activate itself when it enters the waiting phase
    self.skipWaiting();

});

/*
On Activate Event.
Triggered when the service worker is activated
*/
self.addEventListener('activate', (event) => {
    console.log('[SW] Activate!:', event);


    // Immediately get control over the open pages.
    event.waitUntil(clients.claim());

    // This line will be executed after getting control over open pages

})
self.addEventListener('fetch', () => {
    return;
})