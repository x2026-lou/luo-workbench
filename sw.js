const CACHE = 'luo-workbench-v34';
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
  './cet4_real_ext.js',
  './med_exam.js',
  './exam_ext.js',
  './exam_tips.js',
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
    // 导航（HTML）：网络优先但限时 2.5s——超时立即回退缓存页面秒开（绝不白屏/干等），
    // 网络成功则顺手更新缓存；彻底解决「打开工作台等待时间长」
    event.respondWith((async () => {
      const cached = await caches.match(req).then(r => r || caches.match('./index.html')).catch(() => null);
      const timer = new Promise(resolve => setTimeout(() => resolve(null), 2500));
      try {
        const res = await Promise.race([fetch(req), timer]);
        if (res && res.status === 200) {
          caches.open(CACHE).then(c => c.put(req, res.clone()));
          return res;
        }
        if (res) return res; // 非200（如304改造前的响应）直接用
      } catch (e) { /* 网络失败，走缓存 */ }
      // 网络超时/失败：先把后台请求结果写进缓存供下次使用，再返回缓存页
      fetch(req).then(res => { if (res && res.status === 200) caches.open(CACHE).then(c => c.put(req, res.clone())); }).catch(() => {});
      return cached || Response.error();
    })());
    return;
  }
  // 静态资源（JS/CSS/图片等）：缓存优先 + 后台静默更新 —— 首屏秒开，不再苦等 GitHub 拉取；
  // 关键兜底：精确版本未命中时，忽略 ?v= 参数匹配旧版缓存立即返回（杜绝网络慢导致样式/脚本加载失败变裸 HTML），
  // 然后后台拉新版写入缓存，下次打开即为新版本（配合 CACHE 名 bump 的 SW 更新提示）
  event.respondWith((async () => {
    const cached = await caches.match(req) || await caches.match(req, { ignoreSearch: true, ignoreVary: true });
    const network = fetch(req).then(res => {
      if (res && res.status === 200) caches.open(CACHE).then(c => c.put(req, res.clone()));
      return res;
    }).catch(() => cached);
    return cached || network;
  })());
});
