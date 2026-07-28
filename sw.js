const CACHE_NAME = 'jardin-v12';
const ASSETS = ['/', '/index.html', '/style.css', '/data.js', '/calendrier.js', '/planches.js', '/sources.js', '/app.js', '/manifest.json',
  '/legumes/tomate.js', '/legumes/carotte.js', '/legumes/laitue.js', '/legumes/courgette.js',
  '/legumes/radis.js', '/legumes/haricot.js', '/legumes/poivron_aubergine.js', '/legumes/epinard.js',
  '/legumes/petit_pois.js', '/legumes/alliacees.js', '/legumes/chou.js', '/legumes/cucurbitacees.js',
  '/legumes/autres.js', '/legumes/pomme_de_terre.js'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then(response => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(c => c.put(e.request, copy)).catch(() => {});
        return response;
      })
      .catch(() => caches.match(e.request))
  );
});
