// On install Event
// Triggered when the service worker is installed
self.addEventListener('install', (event) => {
    console.log('[SW]Install:', event);
});

self.addEventListener('fetch', () => {
    return;
})