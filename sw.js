const CACHE = 'luo-workbench-v11';
// 相对路径：站点部署在 /luo-workbench/ 子路径下，必须用 ./ 才能正确缓存
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './cet4_core.js',
  './cet4_full.js',
  './cet4_enhance.js',
  './gaokao_core.js',
  './expansion.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', event => {
  self.skipWaiting(); // 新 SW 安装后立即接管，不等旧页面关闭
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS).catch(() => {})).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))) // 清掉旧缓存，避免一直喂旧版
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  // 网络优先：联网时永远拉最新版本；请求失败（离线）才回退到缓存
  event.respondWith(
    fetch(req)
      .then(res => {
        if (res && res.status === 200) {
          const copy = res.clone();
          caches.open(CACHE).then(cache => cache.put(req, copy)); // 顺手把新版本存入缓存，供离线使用
        }
        return res;
      })
      .catch(() => caches.match(req).then(r => r || caches.match('./index.html')))
  );
});
