"use strict";
// 網路優先：有網路時一律抓最新版，離線時才用上次存下的內容。
// release.json（新版偵測）不經過這裡，維持原本的更新機制。
// 每個路徑只留一份（存入時去掉 ?v= 等參數）；漫畫、圖卡、桌布與 PDF 不存，避免佔用手機空間。
const CACHE = "prajna-offline-v1";
const CORE = ["./","index.html","contents.html","kepan.html","recitation.html","giving.html","journal.html","guide.html","references.html",
  "lecture.html","collection.html","comics.html","artwork.html","wallpapers.html",
  "style.css","recitation.css","giving.css","app.js","site-update.js","legacy-links.js","reading-settings.js","reading-guides.js","reading-notes.js",
  "recitation.js","recitation-data.js","giving.js","document-viewer.js","reference-audio.js","data.json","manifest.webmanifest",
  "giving-mark.svg","artwork/meditation-cover.webp","icons/prajna-192.png","icons/prajna-512.png","icons/apple-touch-icon.png"];
const CORE_PATHS = new Set(CORE.map(item => new URL(item,self.registration.scope).pathname));

function keyFor(url) {
  return url.origin + url.pathname;
}
function storable(url) {
  if (CORE_PATHS.has(url.pathname)) return true;
  if (/\.pdf$/i.test(url.pathname)) return false;
  return !/\/(artwork|cards|lecture-pdfs)\//.test(url.pathname);
}

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE)
    .then(cache => Promise.all(CORE.map(item => {
      const url = new URL(item,self.registration.scope);
      return fetch(url.href,{cache:"reload"})
        .then(res => { if (res && res.status === 200 && res.type === "basic") return cache.put(keyFor(url),res); })
        .catch(() => {});
    })))
    .catch(() => {})
    .then(() => self.skipWaiting()));
});

self.addEventListener("activate", event => {
  event.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(key => key.startsWith("prajna-offline-") && key !== CACHE).map(key => caches.delete(key))))
    .catch(() => {})
    .then(() => self.clients.claim()));
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET" || request.headers.has("range")) return;
  const url = new URL(request.url);
  if (url.origin !== location.origin) return;
  if (url.pathname.endsWith("/release.json") || url.pathname.endsWith("/sw.js")) return;
  event.respondWith(fetch(request)
    .then(res => {
      if (res && res.status === 200 && res.type === "basic" && storable(url)) {
        const copy = res.clone();
        event.waitUntil(caches.open(CACHE).then(cache => cache.put(keyFor(url),copy)).catch(() => {}));
      }
      return res;
    })
    .catch(() => {
      // 新版重載失敗時，退回不帶更新參數的網址，之後連上網路會再試一次。
      if (request.mode === "navigate" && url.searchParams.has("site-release")) {
        url.searchParams.delete("site-release");
        return Response.redirect(url.href,302);
      }
      return caches.open(CACHE).then(cache => cache.match(keyFor(url))).then(hit => hit || Response.error());
    }));
});
