// public/service-worker.js

self.addEventListener('push', (event) => {
    const data = event.data.json();

    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icon.png',
    });

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
  });


  const CACHE_NAME = 'kino-vavilon-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Установка Service Worker и кэширование статических файлов
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Кэш открывается');
      return cache.addAll(urlsToCache);
    })
  );
});

// Обработка запросов из кэша
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Возвращаем ресурс из кэша или выполняем запрос к сети
      return response || fetch(event.request);
    })
  );
});

// Удаление старого кэша
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});