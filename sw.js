const CACHE_NAME = 'vocab-quiz-cache-v3.1'; // 必ず数字を上げる！
const urlsToCache = [
  './',
  './index.html',
  './manifest.json'
];

// インストール時にファイルをキャッシュ
self.addEventListener('install', (event) => {
  // ★追加：新しいバージョンが見つかったら、すぐに待機状態をスキップする
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

// ネットワークリクエスト時にキャッシュを返す
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});

// 古いキャッシュを削除してアップデート
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // ★追加：すぐに新しいService Workerにコントロールを奪わせる
  self.clients.claim();
});