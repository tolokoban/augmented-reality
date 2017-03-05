function precache() {
    return caches.open(CACHE).then(function (cache) {
        return cache.addAll([
            './index.html',
            './manifest.json',
            './js/@index.js',
            './css/@index.css',
            './css/app/earth.mini.png',
            './css/app/earth.png',
            './css/app/hero.mini.png',
            './css/app/hero.png',
            './css/app/icon-192.png',
            './css/app/icon-512.png',
            './css/app/moon.mini.png',
            './css/app/moon.png'
        ]);
    });
}

function fromCache(request) {
    return caches.open(CACHE).then(function (cache) {
        return cache.match(request).then(function (matching) {
            return matching || Promise.reject('no-match');
        });
    });
}

function update(request) {
    return caches.open(CACHE).then(function (cache) {
        return fetch(request).then(function (response) {
            return cache.put(request, response);
        });
    });
}


var CACHE = 'cache-and-update';

self.addEventListener('install', function(evt) {
    console.log('[SW] install.');
    evt.waitUntil(precache());
});

self.addEventListener('activate', function(evt) {
    console.log('[SW] activate.');
    evt.waitUntil(precache());
});

self.addEventListener('fetch', function(evt) {
    console.log('[SW] fetch. ', evt.request.url);
    evt.respondWith(fromCache(evt.request));
    evt.waitUntil(update(evt.request));
});

self.addEventListener('message', function(evt) {
    console.log('[SW] message.');
});

self.addEventListener('sync', function(evt) {
    console.log('[SW] sync.');
});

self.addEventListener('push', function(evt) {
    console.log('[SW] push.');
});

