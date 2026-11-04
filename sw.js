const CACHE_NAME = 'jizhang-shell-v1';
const ICON_CACHE = 'jizhang-icons-v1';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll([
        './',
        './index.html',
        './accounting.css',
        './accounting.js',
        './manifest.webmanifest',
        './icons/icon-192.png',
        './icons/icon-512.png'
      ]).catch(() => undefined)
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME && key !== ICON_CACHE)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  const data = event.data;
  if (!data || data.type !== 'SET_PWA_ICONS') return;

  event.waitUntil((async () => {
    const cache = await caches.open(ICON_CACHE);
    const base = self.registration.scope;

    if (data.reset) {
      await Promise.all([
        cache.delete(new URL('icons/icon-192.png', base).href),
        cache.delete(new URL('icons/icon-512.png', base).href)
      ]);
    } else {
      const writes = [];
      if (data.icon192) {
        writes.push(
          cache.put(
            new URL('icons/icon-192.png', base).href,
            new Response(dataUrlToBlob(data.icon192), {
              headers: { 'Content-Type': 'image/png', 'Cache-Control': 'no-cache' }
            })
          )
        );
      }
      if (data.icon512) {
        writes.push(
          cache.put(
            new URL('icons/icon-512.png', base).href,
            new Response(dataUrlToBlob(data.icon512), {
              headers: { 'Content-Type': 'image/png', 'Cache-Control': 'no-cache' }
            })
          )
        );
      }
      await Promise.all(writes);
    }

    if (event.ports && event.ports[0]) {
      event.ports[0].postMessage({ ok: true });
    }
  })());
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  const isIcon192 = url.pathname.endsWith('/icons/icon-192.png');
  const isIcon512 = url.pathname.endsWith('/icons/icon-512.png');

  if (isIcon192 || isIcon512) {
    event.respondWith(serveIcon(event.request, url.href));
    return;
  }

  event.respondWith((async () => {
    try {
      return await fetch(event.request);
    } catch {
      const cache = await caches.open(CACHE_NAME);
      return (await cache.match(event.request, { ignoreSearch: true })) || Response.error();
    }
  })());
});

async function serveIcon(request, absoluteUrl) {
  const iconCache = await caches.open(ICON_CACHE);
  const custom = await iconCache.match(absoluteUrl) || await iconCache.match(request, { ignoreSearch: true });
  if (custom) return custom;

  const shell = await caches.open(CACHE_NAME);
  const cached = await shell.match(request, { ignoreSearch: true });
  if (cached) return cached;

  try {
    return await fetch(request);
  } catch {
    return Response.error();
  }
}

function dataUrlToBlob(dataUrl) {
  const [header, base64] = String(dataUrl).split(',');
  const mime = (header.match(/data:(.*?);/) || [])[1] || 'image/png';
  const binary = atob(base64 || '');
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}
