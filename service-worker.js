const CACHE_NAME = 'ganbari-fullfix-v1';
const ASSETS = ['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(ASSETS)));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=>k!==CACHE_NAME&&caches.delete(k)))));self.clients.claim();});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET') return;
  e.respondWith(
    caches.match(e.request).then(cached=>{
      if(cached) return cached;
      return fetch(e.request).then(res=>{
        try{const url=new URL(e.request.url);if(url.origin===self.location.origin){const copy=res.clone();caches.open(CACHE_NAME).then(c=>c.put(e.request,copy));}}catch(_){}
        return res;
      }).catch(()=>caches.match('./index.html'))
    })
  );
});