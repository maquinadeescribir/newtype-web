// Minimal service worker: precached shell, cache-first static assets, network-first otherwise.
const CACHE = 'saw-v1'
const SHELL = ['./', './index.html', './manifest.webmanifest']

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()))
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  )
})

const isStatic = (url) => /\.(?:js|css|png|svg|ico|woff2?|webmanifest)$/.test(url.pathname)

async function put(req, res) {
  if (res && res.ok && res.type === 'basic') {
    const c = await caches.open(CACHE)
    c.put(req, res.clone())
  }
  return res
}

self.addEventListener('fetch', (e) => {
  const req = e.request
  if (req.method !== 'GET') return
  const url = new URL(req.url)
  const sameOrigin = url.origin === self.location.origin

  if (sameOrigin && isStatic(url)) {
    // cache-first for same-origin static assets
    e.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((res) => put(req, res))))
    return
  }

  // network-first for everything else; fall back to cache (navigations -> cached shell) when offline
  e.respondWith(
    fetch(req)
      .then((res) => (sameOrigin ? put(req, res) : res))
      .catch(() =>
        caches
          .match(req)
          .then((hit) => hit || (req.mode === 'navigate' ? caches.match('./index.html') : Response.error())),
      ),
  )
})
