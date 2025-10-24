/**
 * Service Worker para ECONEURA
 * Habilita PWA, cache estratégico, y funcionamiento offline
 */

const CACHE_NAME = 'econeura-v1';
const RUNTIME_CACHE = 'econeura-runtime';

// Archivos críticos para cachear en instalación
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo-econeura.svg',
];

// Instalación del Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Precaching app shell');
        return cache.addAll(PRECACHE_URLS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activación y limpieza de caches antiguos
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME && name !== RUNTIME_CACHE)
            .map((name) => {
              console.log('[SW] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Estrategia de cache: Network First con fallback a Cache
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // Skip API calls (siempre ir a la red)
  if (url.pathname.startsWith('/api/')) {
    return;
  }

  event.respondWith(
    caches.open(RUNTIME_CACHE)
      .then((cache) => {
        return fetch(request)
          .then((response) => {
            // Si la respuesta es válida, cachearla
            if (response && response.status === 200) {
              cache.put(request, response.clone());
            }
            return response;
          })
          .catch(() => {
            // Si falla la red, buscar en cache
            return cache.match(request)
              .then((cached) => {
                if (cached) {
                  console.log('[SW] Serving from cache:', request.url);
                  return cached;
                }
                
                // Si no hay cache, devolver página offline
                if (request.mode === 'navigate') {
                  return caches.match('/index.html');
                }
                
                return new Response('Offline', {
                  status: 503,
                  statusText: 'Service Unavailable'
                });
              });
          });
      })
  );
});

// Mensajes del cliente
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.keys().then((names) => {
      names.forEach((name) => caches.delete(name));
    });
  }
});

