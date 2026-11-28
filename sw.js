const CACHE = 'project-os-shell-v1.6';
const BASE = new URL(self.registration.scope);
const INDEX = new URL('index.html', BASE).href;
const ASSETS = ['manifest.webmanifest','icons/icon-192.png','icons/icon-512.png'].map(p=>new URL(p,BASE).href);
const allowedNavigation = url => url.origin===BASE.origin && (url.pathname===BASE.pathname || url.pathname===new URL(INDEX).pathname) && !url.search;
self.addEventListener('install',event=>{
  event.waitUntil((async()=>{
    const cache=await caches.open(CACHE);
    await cache.addAll([INDEX,...ASSETS].map(url=>new Request(url,{cache:'reload',credentials:'same-origin'})));
    await self.skipWaiting();
  })());
});
self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(k=>k.startsWith('project-os-shell-')&&k!==CACHE).map(k=>caches.delete(k)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch',event=>{
  const req=event.request, url=new URL(req.url);
  if(req.method!=='GET'||url.origin!==BASE.origin||req.headers.has('Authorization'))return;
  if(req.mode==='navigate'&&allowedNavigation(url)){
    event.respondWith((async()=>{
      try{
        const response=await fetch(req,{cache:'no-cache'});
        if(response.ok&&!response.redirected&&response.headers.get('Content-Type')?.includes('text/html')&&!/no-store|private/i.test(response.headers.get('Cache-Control')||'')){
          try{const cache=await caches.open(CACHE);await cache.put(INDEX,response.clone());}catch{ /* Storage quota must not break navigation. */ }
        }
        return response;
      }catch{
        return (await caches.open(CACHE)).match(INDEX).then(r=>r||new Response('Project OS is offline. Reconnect to load the application.',{status:503,headers:{'Content-Type':'text/plain'}}));
      }
    })());
  }else if(ASSETS.includes(url.href)){
    event.respondWith(caches.open(CACHE).then(cache=>cache.match(req)).then(cached=>cached||fetch(req)));
  }
});
