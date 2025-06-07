const CACHE_NAME = 'agroSense-v1.1.0';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('Failed to cache resources:', error);
      })
  );
  // Force activation of new service worker
  self.skipWaiting();
});

// Fetch event - serve cached resources when offline
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached resource if found
        if (response) {
          return response;
        }

        // Clone the request because it's a stream
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then((response) => {
          // Check if valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response because it's a stream
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then((cache) => {
              // Only cache GET requests
              if (event.request.method === 'GET') {
                cache.put(event.request, responseToCache);
              }
            });

          return response;
        }).catch(() => {
          // Return offline page or default response for navigation requests
          if (event.request.mode === 'navigate') {
            return caches.match('/');
          }
        });
      }
    )
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Take control of all pages
      return self.clients.claim();
    })
  );
});

// Background sync for offline data
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(syncOfflineData());
  }
});

async function syncOfflineData() {
  try {
    // Sync pending analytics events
    const pendingAnalytics = localStorage.getItem('pendingAnalytics');
    if (pendingAnalytics) {
      const events = JSON.parse(pendingAnalytics);
      // In production, send these to your analytics service
      console.log('Syncing analytics events:', events);
      localStorage.removeItem('pendingAnalytics');
    }
    
    console.log('Background sync completed');
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Enhanced push notifications
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  
  const options = {
    body: data.body || 'New weather alert available',
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: data.id || '1',
      url: data.url || '/'
    },
    actions: [
      {
        action: 'explore',
        title: data.actionText || 'View Details',
        icon: '/icon-192x192.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icon-192x192.png'
      }
    ],
    tag: data.tag || 'general',
    renotify: true,
    requireInteraction: data.urgent || false
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'AgroSense Alert', options)
  );
});

// Handle notification clicks with better routing
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    const urlToOpen = event.notification.data.url || '/';
    
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then((clientList) => {
          // If app is already open, focus it
          for (let i = 0; i < clientList.length; i++) {
            const client = clientList[i];
            if (client.url.includes(self.location.origin) && 'focus' in client) {
              return client.focus();
            }
          }
          // Otherwise open new window
          if (clients.openWindow) {
            return clients.openWindow(urlToOpen);
          }
        })
    );
  }
});

// Message handling for runtime communication
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
