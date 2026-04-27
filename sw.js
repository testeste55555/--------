const CACHE_NAME = 'vocab-quiz-cache-v2'; // 数字を上げる
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  // アイコン画像を用意したらここに追加します
  // './icon-192.png',
  // './icon-512.png'
];

// インストール時にファイルをキャッシュ
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

// ネットワークリクエスト時にキャッシュを返す（オフライン対応）
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // キャッシュにあればそれを返し、なければネットワークから取得
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
});