// ============================================
// SERVICE WORKER PARA CRESALIA PWA
// ============================================

const CACHE_NAME = 'cresalia-v2.3.0';
const STATIC_CACHE = 'cresalia-static-v2.3.0';
const DYNAMIC_CACHE = 'cresalia-dynamic-v2.3.0';

// Archivos estáticos críticos
const STATIC_FILES = [
  '/',
  '/index.html',
  '/index-cresalia.html',
  '/landing-cresalia-DEFINITIVO.html',
  '/tiendas/ejemplo-tienda/index.html',
  '/tiendas/ejemplo-tienda/admin-final.html',
  '/demo-buyer-interface.html',
  '/offline.html',
  '/manifest.json?v=6.0',
  '/vercel.json',
  // CSS
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css',
  // JavaScript
  'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js',
  'https://cdn.jsdelivr.net/npm/chart.js',
  '/js/sistema-interconexiones-global.js',
  // Imágenes - Logo PWA
  '/assets/logo/logo-cresalia.png?v=6.0'
];

// Archivos dinámicos (se cachean bajo demanda)
const DYNAMIC_PATTERNS = [
  /^\/tiendas\/.*\.html$/,
  /^\/api\/.*$/,
  /^\/images\/.*$/,
  /^\/icons\/.*$/
];

// ============================================
// INSTALACIÓN DEL SERVICE WORKER
// ============================================

self.addEventListener('install', event => {
  console.log('🔧 Service Worker: Instalando...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('📦 Service Worker: Cacheando archivos estáticos...');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('✅ Service Worker: Instalación completada');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('❌ Service Worker: Error en instalación:', error);
      })
  );
});

// ============================================
// ACTIVACIÓN DEL SERVICE WORKER
// ============================================

self.addEventListener('activate', event => {
  console.log('🚀 Service Worker: Activando...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('🗑️ Service Worker: Eliminando cache obsoleto:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('✅ Service Worker: Activación completada');
        return self.clients.claim();
      })
  );
});

// ============================================
// INTERCEPTACIÓN DE PETICIONES
// ============================================

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Estrategia: Cache First para archivos estáticos
  if (isStaticFile(request)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Estrategia: Network First para contenido dinámico
  if (isDynamicFile(request)) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Estrategia: Stale While Revalidate para otros recursos
  event.respondWith(staleWhileRevalidate(request));
});

// ============================================
// ESTRATEGIAS DE CACHE
// ============================================

// Cache First: Para archivos estáticos que raramente cambian
async function cacheFirst(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      console.log('📦 Service Worker: Sirviendo desde cache:', request.url);
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.ok) {
      // Solo cachear si es un recurso local o de CDN confiable
      const url = new URL(request.url);
      if (url.hostname.includes('cresalia-web.vercel.app') || 
          url.hostname.includes('cdnjs.cloudflare.com') || 
          url.hostname.includes('cdn.jsdelivr.net')) {
        const cache = await caches.open(STATIC_CACHE);
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    }
    
    return networkResponse;
  } catch (error) {
    console.error('❌ Service Worker: Error en cacheFirst:', error);
    // No devolver error 503, dejar que el navegador maneje el fallo
    throw error;
  }
}

// Network First: Para contenido dinámico que debe estar actualizado
async function networkFirst(request) {
  try {
    const url = new URL(request.url);
    
    // No cachear recursos externos problemáticos
    if (url.hostname.includes('via.placeholder.com') || 
        url.hostname.includes('api.mercadopago.com')) {
      return fetch(request).catch(() => new Response('', { status: 200 }));
    }
    
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.ok) {
      // Solo cachear recursos locales o de CDN confiable
      if (url.hostname.includes('cresalia-web.vercel.app') || 
          url.hostname.includes('cdnjs.cloudflare.com') || 
          url.hostname.includes('cdn.jsdelivr.net')) {
        const cache = await caches.open(DYNAMIC_CACHE);
        cache.put(request, networkResponse.clone());
      }
    }
    return networkResponse;
  } catch (error) {
    console.log('📦 Service Worker: Red no disponible, sirviendo desde cache:', request.url);
    const cachedResponse = await caches.match(request);
    // Si es una navegación (página HTML) y no hay cache, mostrar página offline
    if (request.mode === 'navigate' && !cachedResponse) {
      const offlinePage = await caches.match('/offline.html');
      if (offlinePage) {
        return offlinePage;
      }
    }
    // Si no hay cache, devolver respuesta vacía en lugar de error 503
    return cachedResponse || new Response('', { status: 200 });
  }
}

// Stale While Revalidate: Para recursos que pueden estar en cache pero se actualizan
async function staleWhileRevalidate(request) {
  try {
    const url = new URL(request.url);
    
    // No cachear recursos externos que puedan fallar (via.placeholder.com, etc.)
    if (url.hostname.includes('via.placeholder.com') || 
        url.hostname.includes('api.mercadopago.com')) {
      // Solo fetch, sin cachear
      return fetch(request).catch(() => {
        // Si falla, devolver respuesta vacía en lugar de error
        return new Response('', { status: 200, statusText: 'OK' });
      });
    }
    
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    const fetchPromise = fetch(request).then(networkResponse => {
      // Solo cachear si es exitoso y es un recurso local
      if (networkResponse.ok && 
          (url.hostname.includes('cresalia-web.vercel.app') || 
           url.hostname.includes('cdnjs.cloudflare.com') || 
           url.hostname.includes('cdn.jsdelivr.net'))) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    }).catch(() => cachedResponse);
    
    return cachedResponse || fetchPromise;
  } catch (error) {
    console.error('❌ Service Worker: Error en staleWhileRevalidate:', error);
    // Intentar fetch directo sin cache
    return fetch(request).catch(() => new Response('', { status: 200 }));
  }
}

// ============================================
// FUNCIONES AUXILIARES
// ============================================

function isStaticFile(request) {
  const url = new URL(request.url);
  
  // Archivos estáticos de la aplicación
  if (url.pathname.endsWith('.html') && !url.pathname.includes('/admin')) {
    return true;
  }
  
  // Recursos externos estáticos
  if (url.hostname.includes('cdnjs.cloudflare.com') || 
      url.hostname.includes('cdn.jsdelivr.net')) {
    return true;
  }
  
  // Archivos de iconos y manifest
  if (url.pathname.includes('/icons/') || 
      url.pathname.includes('/manifest.json')) {
    return true;
  }
  
  return false;
}

function isDynamicFile(request) {
  const url = new URL(request.url);
  
  // Archivos de administración
  if (url.pathname.includes('/admin')) {
    return true;
  }
  
  // APIs
  if (url.pathname.startsWith('/api/')) {
    return true;
  }
  
  // Contenido dinámico
  return DYNAMIC_PATTERNS.some(pattern => pattern.test(url.pathname));
}

// ============================================
// SINCRONIZACIÓN EN BACKGROUND
// ============================================

self.addEventListener('sync', event => {
  console.log('🔄 Service Worker: Sincronización en background:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  try {
    console.log('🔄 Service Worker: Ejecutando sincronización...');
    
    // Aquí se implementaría la lógica de sincronización
    // Por ejemplo, enviar datos pendientes, actualizar cache, etc.
    
    console.log('✅ Service Worker: Sincronización completada');
  } catch (error) {
    console.error('❌ Service Worker: Error en sincronización:', error);
  }
}

// ============================================
// NOTIFICACIONES PUSH
// ============================================

self.addEventListener('push', event => {
  console.log('📱 Service Worker: Notificación push recibida');

  if (event.data) {
    const data = event.data.json();
  const options = {
      body: data.body || 'Nueva notificación de Cresalia',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      vibrate: [200, 100, 200],
    data: {
        url: data.url || '/',
        timestamp: Date.now()
    },
    actions: [
      {
          action: 'open',
          title: 'Abrir',
          icon: '/icons/action-open.png'
      },
      {
        action: 'close',
        title: 'Cerrar',
          icon: '/icons/action-close.png'
      }
    ]
  };

  event.waitUntil(
      self.registration.showNotification(data.title || 'Cresalia', options)
  );
  }
});

// ============================================
// CLICK EN NOTIFICACIONES
// ============================================

self.addEventListener('notificationclick', event => {
  console.log('👆 Service Worker: Click en notificación:', event.action);

  event.notification.close();

  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.openWindow(event.notification.data?.url || '/')
    );
  }
});

// ============================================
// MENSAJES DEL CLIENTE
// ============================================

self.addEventListener('message', event => {
  console.log('💬 Service Worker: Mensaje recibido:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(cacheUrls(event.data.urls));
  }
});

async function cacheUrls(urls) {
  const cache = await caches.open(DYNAMIC_CACHE);
  return Promise.all(
    urls.map(url => 
      fetch(url).then(response => {
        if (response.ok) {
          cache.put(url, response);
        }
      })
    )
  );
}

// ============================================
// LIMPIEZA PERIÓDICA
// ============================================

setInterval(async () => {
  try {
    const cacheNames = await caches.keys();
    const oldCaches = cacheNames.filter(name => 
      name.startsWith('cresalia-') && 
      name !== STATIC_CACHE && 
      name !== DYNAMIC_CACHE
    );
    
    await Promise.all(
      oldCaches.map(name => caches.delete(name))
    );
    
    console.log('🧹 Service Worker: Limpieza de cache completada');
  } catch (error) {
    console.error('❌ Service Worker: Error en limpieza:', error);
  }
}, 24 * 60 * 60 * 1000); // Cada 24 horas

console.log('🎉 Service Worker: Cargado correctamente');