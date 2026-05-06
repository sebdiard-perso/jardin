const CACHE_NAME = 'jardin-v3';
const ASSETS = ['/', '/index.html', '/style.css', '/data.js', '/calendrier.js', '/planches.js', '/app.js', '/manifest.json',
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
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
  ));
});

self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
