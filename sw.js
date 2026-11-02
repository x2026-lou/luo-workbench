const CACHE = 'luo-workbench-v31';
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
  './cet4_real.js',
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

self.addEventListener('message', event => {
  if (event.data === 'skip') self.skipWaiting();
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
  const url = new URL(req.url);
  const isNav = req.mode === 'navigate' || url.pathname.endsWith('/') || url.pathname.endsWith('index.html');
  if (isNav) {
    // 导航（HTML）：网络优先，确保第一时间拿到引用了新版本号的最新页面；失败则回退缓存，绝不白屏
    event.respondWith(
      fetch(req)
        .then(res => {
          if (res && res.status === 200) caches.open(CACHE).then(c => c.put(req, res.clone()));
          return res;
        })
        .catch(() => caches.match(req).then(r => r || caches.match('./index.html')))
    );
    return;
  }
  // 静态资源（JS/CSS/图片等）：缓存优先 + 后台静默更新 —— 首屏秒开，不再苦等 GitHub 拉取；
  // 后台把最新版写入缓存，下次打开即为新版本（配合 CACHE 名 bump 的 SW 更新提示）
  event.respondWith((async () => {
    const cached = await caches.match(req);
    const network = fetch(req).then(res => {
      if (res && res.status === 200) caches.open(CACHE).then(c => c.put(req, res.clone()));
      return res;
    }).catch(() => cached);
    return cached || network;
  })());
});
