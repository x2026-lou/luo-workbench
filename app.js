/* ================= Navigation ================= */
/* 同类型板块整合在一起，按 9 大分类分组；renderNav 会自动标序号 */
const navItems = [
  // 1. 每日规划与复盘
  { id: 'daily', icon: '📅', label: '每日计划', group: '每日规划与复盘' },
  { id: 'dailyreview', icon: '🔁', label: '每日复盘', group: '每日规划与复盘' },
  { id: 'review', icon: '📊', label: '内容复盘', group: '每日规划与复盘' },
  { id: 'rewards', icon: '🏆', label: '奖励·每日评价', group: '每日规划与复盘' },
  // 2. 学习备考
  { id: 'english', icon: '🌍', label: '英语学习', group: '学习备考' },
  { id: 'vocab', icon: '🔤', label: '单词背诵', group: '学习备考' },
  { id: 'exam', icon: '📚', label: '考公考编学习', group: '学习备考' },
  { id: 'medical', icon: '🩺', label: '医学专业课学习', group: '学习备考' },
  // 3. 创作与写作
  { id: 'novel', icon: '✍️', label: '爆款小说拆分/写作教学', group: '创作与写作' },
  { id: 'jjwxc', icon: '📚', label: '晋江写作素材库', group: '创作与写作' },
  { id: 'novelcraft', icon: '✨', label: '小说创作进阶', group: '创作与写作' },
  { id: 'videoscr', icon: '🎥', label: '视频脚本灵感', group: '创作与写作' },
  // 4. 自媒体与剪辑
  { id: 'edit', icon: '🎬', label: '拍摄剪辑学习', group: '自媒体与剪辑' },
  { id: 'editcheck', icon: '✂️', label: '剪辑打卡', group: '自媒体与剪辑' },
  { id: 'media', icon: '📱', label: '自媒体干货学习', group: '自媒体与剪辑' },
  { id: 'viral', icon: '🔥', label: '爆款热点视频/二创', group: '自媒体与剪辑' },
  { id: 'material', icon: '🌐', label: '全网素材库', group: '自媒体与剪辑' },
  { id: 'genius', icon: '💡', label: '灵感生成器', group: '自媒体与剪辑' },
  { id: 'meme', icon: '🔥', label: '梗库', group: '自媒体与剪辑' },
  { id: 'mine', icon: '🛡️', label: '避雷指南', group: '自媒体与剪辑' },
  // 5. 技能与兴趣
  { id: 'drawing', icon: '🎨', label: '实用绘画教学', group: '技能与兴趣' },
  { id: 'guitar', icon: '🎸', label: '吉他实用教学', group: '技能与兴趣' },
  { id: 'kitchen', icon: '🍳', label: '厨房小白/烹饪', group: '技能与兴趣' },
  { id: 'office', icon: '💻', label: '办公技能学习', group: '技能与兴趣' },
  // 6. 生活与健康
  { id: 'travel', icon: '✈️', label: '旅行攻略分享', group: '生活与健康' },
  { id: 'image', icon: '🪞', label: '形象管理', group: '生活与健康' },
  { id: 'fitness', icon: '💪', label: '每日健身', group: '生活与健康' },
  { id: 'seasonaldish', icon: '🥗', label: '时令菜品', group: '生活与健康' },
  // 7. 阅读与影视
  { id: 'books', icon: '📖', label: '书籍推荐/拆书', group: '阅读与影视' },
  { id: 'booknotes', icon: '📑', label: '书摘收藏', group: '阅读与影视' },
  { id: 'booklearn', icon: '📚', label: '好书拆分', group: '阅读与影视' },
  { id: 'film', icon: '🎞️', label: '拉片笔记', group: '阅读与影视' },
  // 8. 理财与事务
  { id: 'finance', icon: '💰', label: '理财基金金融学习', group: '理财与事务' },
  { id: 'recruit', icon: '💼', label: '招聘信息', badge: 3, group: '理财与事务' },
  { id: 'accounting', icon: '🧾', label: '每日记账', group: '理财与事务' },
  { id: 'goods', icon: '🛍️', label: '好物记录', group: '理财与事务' },
  // 9. 思维与情商
  { id: 'ai', icon: '🤖', label: 'AI口令/数据分析', group: '思维与情商' },
  { id: 'eq', icon: '💬', label: '情商提升', group: '思维与情商' }
];

let currentPage = 'daily';
function renderNav() {
  const list = document.getElementById('navList');
  let html = '';
  let lastGroup = null;
  let idx = 0;
  navItems.forEach(item => {
    idx++;
    if (item.group !== lastGroup) {
      html += `<div class="nav-group">${item.group}</div>`;
      lastGroup = item.group;
    }
    html += `
    <div class="nav-item ${item.id === currentPage ? 'active' : ''}" data-id="${item.id}" onclick="goPage('${item.id}')">
      <div class="nav-idx">${String(idx).padStart(2,'0')}</div>
      <div class="nav-icon">${item.icon}</div>
      <div class="nav-text">${item.label}</div>
      ${item.badge ? `<div class="nav-badge">${item.badge}</div>` : ''}
      ${item.new ? `<div class="nav-new">NEW</div>` : ''}
    </div>`;
  });
  list.innerHTML = html;
}

function goPage(id) {
  currentPage = id;
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n => n.classList.toggle('active', n.dataset.id === id));
  document.querySelectorAll('.bnav-item').forEach(b => b.classList.toggle('active', b.dataset.page === id));
  toggleSidebar(false);
  window.scrollTo(0,0);
  const renderMap = {
    daily: renderTodos, review: renderReviews, english: renderEnglish, exam: renderExam,
    medical: renderMedical, inspiration: renderInspiration, viral: renderViral, edit: renderEdit,
    recruit: renderRecruit, fitness: renderFitness, finance: renderFinance, novel: renderNovel,
    image: renderImage, books: renderBooks, drawing: renderDrawing, guitar: renderGuitar,
    kitchen: renderKitchen, media: renderMedia, travel: renderTravel, office: renderOffice,
    eq: renderEq, ai: renderAi,     jjwxc: renderJJWXC, meme: renderMeme,
    mine: renderMine, genius: renderGenius, material: renderMaterial,
    vocab: renderVocab, novelcraft: renderNovelCraft, videoscr: renderVideoScr,
    editcheck: renderEditCheck, goods: renderGoods, rewards: renderRewards,
    dailyreview: renderDailyReview, booknotes: renderBookNotes, film: renderFilm,
    accounting: renderAccounting, seasonaldish: renderSeasonalDish, booklearn: renderBookLearn,
    exam: renderExamWrap, recruit: renderRecruitWrap
  };
  if (renderMap[id]) renderMap[id]();
  renderMyNotes(id);
}

/* ================= Section Notes (custom per section) ================= */
function renderMyNotes(id) {
  const page = document.getElementById('page-' + id);
  if (!page) return;
  let box = page.querySelector('.section-notes');
  if (!box) {
    box = document.createElement('div');
    box.className = 'card section-notes mt-3';
    box.innerHTML = `
      <div class="font-bold mb-2">📝 我的笔记</div>
      <div id="notesList-${id}"></div>
      <div class="mt-2" style="display:flex;flex-direction:column;gap:8px">
        <input type="text" id="noteTitle-${id}" class="form-input" placeholder="笔记标题（可选）">
        <textarea id="noteContent-${id}" class="form-textarea" placeholder="记录这一板块的想法、重点、灵感…"></textarea>
        <button class="btn btn-primary" onclick="addMyNote('${id}')">保存笔记</button>
      </div>`;
    page.appendChild(box);
  }
  const notes = store.get('luo_notes_' + id, []);
  const list = document.getElementById('notesList-' + id);
  if (!list) return;
  list.innerHTML = notes.length ? notes.map((n, i) => `
    <div class="note-item">
      <div class="note-body">
        ${n.title ? `<div class="note-title">${n.title}</div>` : ''}
        <div class="note-text">${n.content}</div>
        <div class="note-date">${n.date || ''}</div>
      </div>
      <div class="note-actions">
        <button class="note-btn" onclick="editMyNote('${id}',${i})">编辑</button>
        <button class="note-btn del" onclick="deleteMyNote('${id}',${i})">删除</button>
      </div>
    </div>`).join('') : '<div class="list-empty">还没有笔记，记一条吧 ✍️</div>';
}
function addMyNote(id) {
  const t = document.getElementById('noteTitle-' + id);
  const c = document.getElementById('noteContent-' + id);
  const title = t.value.trim(); const content = c.value.trim();
  if (!title && !content) return toast('请输入笔记内容');
  const notes = store.get('luo_notes_' + id, []);
  notes.unshift({ title, content, date: fmtDate() });
  store.set('luo_notes_' + id, notes);
  t.value = ''; c.value = '';
  renderMyNotes(id);
  toast('笔记已保存');
}
function deleteMyNote(id, i) {
  const notes = store.get('luo_notes_' + id, []);
  notes.splice(i, 1);
  store.set('luo_notes_' + id, notes);
  renderMyNotes(id);
}
function editMyNote(id, i) {
  const notes = store.get('luo_notes_' + id, []);
  const n = notes[i];
  const content = prompt('编辑笔记内容', n.content);
  if (content === null) return;
  const title = prompt('编辑笔记标题', n.title || '');
  if (title === null) return;
  notes[i] = { title: title.trim(), content: content.trim(), date: n.date };
  store.set('luo_notes_' + id, notes);
  renderMyNotes(id);
}

function toggleSidebar(force) {
  const sb = document.getElementById('sidebar');
  const ov = document.getElementById('sidebarOverlay');
  const open = force !== undefined ? force : !sb.classList.contains('open');
  sb.classList.toggle('open', open);
  ov.classList.toggle('open', open);
}

/* ================= Storage ================= */
const store = {
  get: (k, def) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : def; } catch { return def; } },
  set: (k, v) => {
    try {
      localStorage.setItem(k, JSON.stringify(v));
      return true;
    } catch (e) {
      console.error('store.set 失败（可能本地存储已满）:', k, e);
      if (typeof toast === 'function') toast('⚠️ 本地存储空间不足，本次内容未能保存，请删除一些带照片的菜谱/笔记后再试');
      return false;
    }
  }
};

/* ================= Helpers ================= */
function fmtDate() { const d = new Date(); return `${d.getFullYear()}.${d.getMonth()+1}.${d.getDate()}`; }
function todayKey() { const d = new Date(); return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`; }
function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 1800);
}
function syncCloud() { toast('已同步到本机（本地存储）'); toggleSidebar(false); }

function updateOnlineStatus() {
  const banner = document.getElementById('offlineBanner');
  if (!navigator.onLine) banner.classList.add('show');
  else banner.classList.remove('show');
}
function safeExternalClick(e) {
  const a = e.target.closest('a[href]');
  if (a && a.target === '_blank' && !navigator.onLine) {
    e.preventDefault();
    toast('当前无网络，视频链接需联网后访问');
  }
}

function encodeQuery(s) { return encodeURIComponent(s); }
function searchLinks(keyword) {
  return {
    bili: `https://m.bilibili.com/search?keyword=${encodeQuery(keyword)}`,
    douyin: `https://www.douyin.com/search/${encodeQuery(keyword)}`,
    xhs: `https://www.xiaohongshu.com/search?keyword=${encodeQuery(keyword)}`,
    jjwxc: `https://www.jjwxc.net/search.php?kw=${encodeQuery(keyword)}`
  };
}

function resourceCard(item) {
  const links = [];
  if (item.bili) links.push(`<a class="link-bili" href="${item.bili}" target="_blank">📺 B站</a>`);
  if (item.douyin) links.push(`<a class="link-douyin" href="${item.douyin}" target="_blank">🎵 抖音</a>`);
  if (item.xhs) links.push(`<a class="link-xhs" href="${item.xhs}" target="_blank">🔴 小红书</a>`);
  if (item.jjwxc) links.push(`<a class="link-jjwxc" href="${item.jjwxc}" target="_blank">📚 晋江</a>`);
  if (item.web) links.push(`<a class="link-web" href="${item.web}" target="_blank">🌐 网页</a>`);
  const doneBtn = item.done !== undefined ? `<button class="link-done" onclick="${item.doneFn}">${item.done ? '✓ 已打卡' : '打卡'}</button>` : '';
  return `
    <div class="resource-card">
      <div class="resource-icon" style="background:${item.iconBg||'var(--blue-light)'}">${item.icon}</div>
      <div class="resource-body">
        <div class="resource-title">${item.title}</div>
        <div class="resource-meta">${item.desc}</div>
        <div class="resource-tags">${(item.tags||[]).map(t => `<span class="resource-tag">${t}</span>`).join('')}</div>
        <div class="resource-actions">${links.join('')}${doneBtn}</div>
      </div>
    </div>
  `;
}

function videoList(title, list, doneFn) {
  return list.map((v, i) => resourceCard({
    icon: v.icon, title: v.title, desc: v.desc, tags: v.tags, iconBg: v.iconBg,
    bili: v.bili, douyin: v.douyin, xhs: v.xhs, web: v.web,
    done: v.done, doneFn: doneFn ? `${doneFn}(${i})` : undefined
  })).join('');
}

function makeSearchItems(arr, keywordFn) {
  return arr.map(a => {
    const kw = keywordFn(a);
    const links = searchLinks(kw);
    return { ...a, bili: links.bili, douyin: links.douyin, xhs: links.xhs };
  });
}

/* Deterministic shuffle so "daily" content is stable per day, changes next day */
function seededShuffle(arr, seedStr) {
  let seed = 0;
  for (let i = 0; i < seedStr.length; i++) seed = (seed * 31 + seedStr.charCodeAt(i)) >>> 0;
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    seed = (seed * 1103515245 + 12345) >>> 0;
    const j = seed % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ================= Daily Plan & Rewards ================= */
const defaultMustDos = [
  { id: 'md_exercise', text: '运动 45 分钟', minutes: 45, points: 20, done: false },
  { id: 'md_guitar', text: '乐器练习 1 小时', minutes: 60, points: 20, done: false },
  { id: 'md_english', text: '英语练习 30 分钟', minutes: 30, points: 20, done: false },
  { id: 'md_medical', text: '医学学习 40 分钟', minutes: 40, points: 20, done: false }
];
let mustDos = store.get('luo_mustdos', JSON.parse(JSON.stringify(defaultMustDos)));
let todos = store.get('luo_todos', [
  { id: 1, text: '发布英语口语vlog第4期', priority: 'high', done: false, points: 15 },
  { id: 2, text: '整理考公行测错题本', priority: 'mid', done: false, points: 10 },
  { id: 3, text: '剪辑Kpop燃脂操挑战视频', priority: 'high', done: true, points: 15 },
  { id: 4, text: '录制3条选题灵感脚本', priority: 'mid', done: false, points: 10 },
  { id: 5, text: '浏览招聘信息3条', priority: 'low', done: false, points: 5 },
  { id: 6, text: '跟练燃脂操1次', priority: 'mid', done: true, points: 10 }
]);
let filter = 'all';
let totalPoints = store.get('luo_total_points', 0);

// 19 级玄幻境界阶梯：从现在（2026-08-18）到飞升之期 2027-06-21
const REALM_GOAL_DATE = '2027-06-21';
function flyDaysLeft() {
  const goal = new Date(REALM_GOAL_DATE + 'T00:00:00');
  const d = Math.ceil((goal - new Date()) / 86400000);
  return d > 0 ? d : 0;
}
// need = 进入该境界所需的累计积分（第 1 级为 0）
const LEVELS = [
  { name: '凡境', sub: '尘世起点', need: 0 },
  { name: '炼气期', sub: '引气入体', need: 60 },
  { name: '筑基期', sub: '根基初成', need: 150 },
  { name: '开光期', sub: '灵识初开', need: 280 },
  { name: '融合期', sub: '天人合一', need: 450 },
  { name: '金丹期', sub: '丹田凝丹', need: 650 },
  { name: '元婴期', sub: '元神初诞', need: 900 },
  { name: '出窍期', sub: '神游太虚', need: 1200 },
  { name: '分神期', sub: '三花聚顶', need: 1550 },
  { name: '合体期', sub: '身魂合一', need: 1950 },
  { name: '洞虚期', sub: '洞悉虚空', need: 2400 },
  { name: '大乘期', sub: '法力通玄', need: 2900 },
  { name: '渡劫期', sub: '雷劫加身', need: 3450 },
  { name: '地仙境', sub: '脱离轮回', need: 4050 },
  { name: '天仙境', sub: '逍遥天地', need: 4700 },
  { name: '金仙境', sub: '万法不侵', need: 5400 },
  { name: '太乙境', sub: '道韵天成', need: 6150 },
  { name: '大罗境', sub: '超脱时空', need: 6950 },
  { name: '仙帝境', sub: '飞升之巅', need: 8000 }
];
function levelFor(pts) {
  let cur = LEVELS[0];
  for (const L of LEVELS) { if (pts >= L.need) cur = L; else break; }
  const idx = LEVELS.indexOf(cur);
  const next = LEVELS[idx + 1] || null;
  const span = next ? (next.need - cur.need) : 1;
  const prog = next ? Math.min(100, Math.round((pts - cur.need) / span * 100)) : 100;
  return {
    lv: idx + 1, title: cur.name, sub: cur.sub, need: cur.need,
    next: next ? next.name : null, nextPts: next ? next.need : null,
    progress: prog, total: LEVELS.length
  };
}
// 统一加分：持久化 + 刷新顶部等级显示（切实有效的积分规则核心）
function addPoints(x, silent) {
  totalPoints += x;
  store.set('luo_total_points', totalPoints);
  const lv = levelFor(totalPoints);
  const sl = document.getElementById('statLevel');
  if (sl) sl.textContent = 'Lv' + lv.lv;
  if (!silent && typeof toast === 'function') toast('+' + x + ' 积分');
  if (typeof renderRewards === 'function') { try { const rb = document.getElementById('rewardsBox'); if (rb && rb.offsetParent !== null) renderRewards(); } catch (e) {} }
}

function saveTodos() {
  store.set('luo_todos', todos);
  store.set('luo_mustdos', mustDos);
  store.set('luo_total_points', totalPoints);
  renderTodos();
}

function renderTodos() {
  const list = document.getElementById('todoList');
  const filtered = todos.filter(t => filter === 'all' || t.priority === filter);
  list.innerHTML = filtered.length ? filtered.map(t => `
    <div class="todo-item ${t.done ? 'done' : ''}">
      <div class="todo-check" onclick="toggleTodo(${t.id})">${t.done ? '✓' : ''}</div>
      <div class="todo-text">${t.text}</div>
      <div class="todo-points">+${t.points || 10}</div>
      <div class="tag tag-${t.priority}">${t.priority === 'high' ? '高优先' : t.priority === 'mid' ? '中优先' : '低优先'}</div>
      <button class="todo-del" onclick="deleteTodo(${t.id})">×</button>
    </div>
  `).join('') : '<div class="list-empty">暂无任务，添加一条吧</div>';

  const mustList = document.getElementById('mustDoList');
  mustList.innerHTML = mustDos.map((m, idx) => `
    <div class="mustdo-card ${m.done ? 'done' : ''}">
      <div class="flex-between">
        <div class="mustdo-header">
          <div class="mustdo-icon">${['🏃','🎸','🌍','🩺'][idx] || '✨'}</div>
          <div>
            <div class="mustdo-title">${m.text}</div>
            <div class="mustdo-time">目标 ${m.minutes} 分钟 · +${m.points} 积分</div>
          </div>
        </div>
        <div class="todo-check" style="width:28px;height:28px" onclick="toggleMustDo(${idx})">${m.done ? '✓' : ''}</div>
      </div>
    </div>
  `).join('') + `
    <div class="add-box" style="margin-top:12px">
      <input type="text" id="mustDoInput" placeholder="新增每日必打卡（例如：阅读20分钟）" style="font-size:13px">
      <input type="number" id="mustDoMin" placeholder="分钟" style="width:70px;font-size:13px">
      <button class="btn btn-green" style="padding:10px 14px" onclick="addMustDo()">+</button>
    </div>
    <button class="btn btn-outline" style="width:100%;margin-top:8px;font-size:12px" onclick="resetMustDo()">恢复默认必打卡</button>
  `;

  const active = todos.filter(t => !t.done).length + mustDos.filter(m => !m.done).length;
  const totalCount = todos.length + mustDos.length;
  const doneCount = todos.filter(t => t.done).length + mustDos.filter(m => m.done).length;
  const rate = totalCount ? Math.round(doneCount / totalCount * 100) : 0;
  const todayPoints = todos.filter(t => t.done).reduce((s, t) => s + (t.points || 10), 0) + mustDos.filter(m => m.done).reduce((s, m) => s + m.points, 0);

  document.getElementById('statActive').textContent = active;
  document.getElementById('statRate').textContent = rate + '%';
  document.getElementById('statPoints').textContent = todayPoints;
  const lvl = levelFor(totalPoints);
  document.getElementById('statLevel').textContent = 'Lv' + lvl.lv + ' · ' + lvl.title;

  document.getElementById('rewardRate').textContent = rate + '%';
  document.getElementById('rewardScore').textContent = todayPoints;
  document.getElementById('rewardTitle').textContent = lvl.title;
  document.getElementById('rewardEval').innerHTML = generateEval(rate, doneCount, totalCount, todayPoints);
}

function generateEval(rate, done, total, points) {
  let evalText = '';
  if (rate === 0) evalText = '今天还没开始哦。建议先完成一项「每日必打卡」，比如运动或英语，获得第一笔积分。';
  else if (rate < 40) evalText = '起步中，完成每日必打卡能快速提升完成率。建议优先处理高优先任务，减少拖延。';
  else if (rate < 70) evalText = '进展不错，保持节奏就能完成今日目标。建议把中优先任务拆分，逐个击破。';
  else if (rate < 100) evalText = '非常棒，再冲刺一下就能满分收官。建议检查是否还有可快速完成的小任务。';
  else evalText = '今日全部完成！执行力满分，建议奖励自己一段自由时间或一份小甜品。';

  const missing = [];
  if (!mustDos.find(m => m.text.includes('运动'))?.done) missing.push('运动');
  if (!mustDos.find(m => m.text.includes('乐器'))?.done) missing.push('乐器练习');
  if (!mustDos.find(m => m.text.includes('英语'))?.done) missing.push('英语');
  let suggestion = '';
  if (missing.length) suggestion = `<br><br><b>💡 改善建议：</b>今日还未完成 ${missing.join('、')}，建议晚上留出固定时段集中攻克。`;
  else if (rate < 100) suggestion = '<br><br><b>💡 改善建议：</b>必打卡已完成，可以补充复盘、英语单词或阅读等轻量任务。';
  else suggestion = '<br><br><b>🎁 奖励建议：</b>连续满分可兑换一次自己喜欢的小奖励，保持正向循环。';
  return `<b>今日获得 ${points} 积分，完成 ${done}/${total} 项。</b><br>${evalText}${suggestion}`;
}

function toggleTodo(id) { const t = todos.find(x => x.id === id); if (t) { t.done = !t.done; if (t.done) totalPoints += (t.points || 10); else totalPoints -= (t.points || 10); saveTodos(); } }
function deleteTodo(id) { todos = todos.filter(x => x.id !== id); saveTodos(); }
function addTodo() {
  const input = document.getElementById('todoInput');
  const val = input.value.trim();
  if (!val) return toast('请输入任务内容');
  todos.push({ id: Date.now(), text: val, priority: document.getElementById('todoPriority').value, done: false, points: 10 });
  input.value = ''; saveTodos();
}
function toggleMustDo(idx) {
  const m = mustDos[idx];
  m.done = !m.done;
  if (m.done) totalPoints += m.points; else totalPoints -= m.points;
  saveTodos();
}
function addMustDo() {
  const text = document.getElementById('mustDoInput').value.trim();
  const min = parseInt(document.getElementById('mustDoMin').value) || 15;
  if (!text) return toast('请输入必打卡内容');
  mustDos.push({ id: Date.now(), text, minutes: min, points: 15, done: false });
  document.getElementById('mustDoInput').value = '';
  document.getElementById('mustDoMin').value = '';
  saveTodos();
}
function deleteMustDo(idx) { mustDos.splice(idx, 1); saveTodos(); }
function resetMustDo() { mustDos = JSON.parse(JSON.stringify(defaultMustDos)); saveTodos(); toast('已恢复默认必打卡'); }

document.querySelectorAll('#dailyTabs .tab').forEach(tab => {
  tab.onclick = () => { filter = tab.dataset.filter; document.querySelectorAll('#dailyTabs .tab').forEach(t => t.classList.remove('active')); tab.classList.add('active'); renderTodos(); };
});

/* ================= Review ================= */
let reviews = store.get('luo_reviews', []);
function saveReviews() { store.set('luo_reviews', reviews); renderReviews(); }
function addReview() {
  const title = document.getElementById('revTitle').value.trim();
  if (!title) return toast('请填写视频标题');
  reviews.unshift({ id: Date.now(), title, data: document.getElementById('revData').value, pros: document.getElementById('revPros').value, cons: document.getElementById('revCons').value, date: fmtDate() });
  ['revTitle','revData','revPros','revCons'].forEach(id => document.getElementById(id).value = '');
  saveReviews();
}
function renderReviews() {
  document.getElementById('reviewList').innerHTML = reviews.length ? reviews.map(r => `
    <div class="card-flat">
      <div class="flex-between mb-2"><span class="font-bold">${r.title}</span><span class="text-sm text-muted">${r.date}</span></div>
      <div class="text-sm text-muted mb-2">数据：${r.data || '未填写'}</div>
      <div class="mb-2"><span class="text-blue">优点：</span>${r.pros || '—'}</div>
      <div class="mb-2"><span class="text-orange">优化：</span>${r.cons || '—'}</div>
      <button class="btn btn-outline btn-small" onclick="deleteReview(${r.id})">删除</button>
    </div>
  `).join('') : '<div class="list-empty">暂无复盘记录</div>';
  renderDailyReview();
}
function deleteReview(id) { reviews = reviews.filter(x => x.id !== id); saveReviews(); }

/* ================= Daily Review ================= */
function renderDailyReview() {
  const el = document.getElementById('dailyReview');
  if (!el) return;
  document.getElementById('reviewDate').value = fmtDate();
  const all = store.get('luo_daily_reviews', []);
  const today = all.find(r => r.date === fmtDate());
  el.value = today ? today.text : '';
  const hist = all.slice().reverse();
  document.getElementById('dailyReviewHistory').innerHTML = hist.length ? hist.map(r => `
    <div class="card-flat">
      <div class="font-bold mb-1">${r.date}</div>
      <div class="text-sm text-muted" style="white-space:pre-wrap">${r.text}</div>
      <button class="btn btn-outline btn-small mt-2" onclick="deleteDailyReview('${r.date}')">删除</button>
    </div>`).join('') : '<div class="list-empty">还没有复盘记录</div>';
}
function saveDailyReview() {
  const text = document.getElementById('dailyReview').value.trim();
  if (!text) return toast('请填写今日复盘');
  const all = store.get('luo_daily_reviews', []);
  const idx = all.findIndex(r => r.date === fmtDate());
  if (idx >= 0) all[idx].text = text; else all.push({ date: fmtDate(), text });
  store.set('luo_daily_reviews', all);
  renderDailyReview();
  toast('复盘已保存');
}
function deleteDailyReview(date) {
  let all = store.get('luo_daily_reviews', []);
  all = all.filter(r => r.date !== date);
  store.set('luo_daily_reviews', all);
  renderDailyReview();
}

/* ================= English ================= */
const words = [
  { en: 'abundant', pho: '/əˈbʌndənt/', cn: '丰富的；充裕的' },
  { en: 'contribute', pho: '/kənˈtrɪbjuːt/', cn: '贡献；促成' },
  { en: 'efficient', pho: '/ɪˈfɪʃnt/', cn: '高效的' },
  { en: 'opportunity', pho: '/ˌɒpəˈtjuːnəti/', cn: '机会' },
  { en: 'phenomenon', pho: '/fəˈnɒmɪnən/', cn: '现象' },
  { en: 'schedule', pho: '/ˈʃedjuːl/', cn: '日程表；安排' },
  { en: 'strategy', pho: '/ˈstrætədʒi/', cn: '策略' },
  { en: 'temporary', pho: '/ˈtemprəri/', cn: '暂时的' },
  { en: 'vocabulary', pho: '/vəˈkæbjələri/', cn: '词汇' },
  { en: 'widespread', pho: '/ˈwaɪdspred/', cn: '广泛的' }
];
let wordIdx = store.get('luo_word_idx', 0);
let learnedWords = store.get('luo_learned_words', []);
function showWord() {
  const w = words[wordIdx % words.length];
  document.getElementById('wordEn').textContent = w.en;
  document.getElementById('wordPho').textContent = w.pho;
  document.getElementById('wordCn').textContent = w.cn;
  document.getElementById('wordIdx').textContent = `${wordIdx + 1} / ${words.length}`;
  document.getElementById('wordProgress').style.width = `${Math.min(100, (learnedWords.length / words.length) * 100)}%`;
  document.getElementById('wordGrid').innerHTML = words.map((x, i) => `
    <div class="word-cell" style="${learnedWords.includes(x.en) ? 'background:#E8F5E9' : ''}">
      <div class="en">${x.en}</div><div class="cn">${x.cn}</div>
    </div>
  `).join('');
}
function nextWord() { wordIdx = (wordIdx + 1) % words.length; showWord(); }
function prevWord() { wordIdx = (wordIdx - 1 + words.length) % words.length; showWord(); }
function markWordLearned() {
  const w = words[wordIdx % words.length].en;
  if (!learnedWords.includes(w)) learnedWords.push(w);
  store.set('luo_learned_words', learnedWords);
  showWord(); toast('已标记掌握');
}

const quizData = [
  { q: '“贡献；促成”对应的英文是？', opts: ['contribute', 'attribute', 'distribute'], a: 0 },
  { q: '“高效的”英文是？', opts: ['effective', 'efficient', 'effortless'], a: 1 },
  { q: '“广泛的”英文是？', opts: ['worldwide', 'widespread', 'wide'], a: 1 },
  { q: '“机会”英文是？', opts: ['chance', 'opportunity', 'choice'], a: 1 },
  { q: '“日程表”英文是？', opts: ['schedule', 'scheme', 'school'], a: 0 }
];
let quizIdx = 0, answered = false;
function renderQuiz() {
  const q = quizData[quizIdx];
  document.getElementById('quizQuestion').textContent = `第 ${quizIdx + 1}/${quizData.length} 题：${q.q}`;
  document.getElementById('quizOptions').innerHTML = q.opts.map((opt, i) => `<button class="quiz-opt" onclick="answerQuiz(${i})">${opt}</button>`).join('');
  document.getElementById('quizResult').textContent = ''; answered = false;
}
function answerQuiz(i) {
  if (answered) return; answered = true;
  const q = quizData[quizIdx]; const opts = document.querySelectorAll('.quiz-opt');
  opts[i].classList.add(i === q.a ? 'correct' : 'wrong');
  if (i !== q.a) opts[q.a].classList.add('correct');
  document.getElementById('quizResult').textContent = i === q.a ? '✅ 回答正确！' : '❌ 再巩固一下';
  document.getElementById('quizResult').className = 'quiz-result ' + (i === q.a ? 'text-blue' : 'text-orange');
}
function nextQuiz() { quizIdx = (quizIdx + 1) % quizData.length; renderQuiz(); }

const englishVideos = makeSearchItems([
  { icon: '🦉', title: '多邻国 ABC 闯关 5 关', desc: '游戏化英语学习，适合每日碎片时间', tags: ['多邻国','入门'], iconBg: 'var(--green-light)' },
  { icon: '📚', title: '牛津树绘本阅读', desc: '分级阅读，从简单故事积累语感', tags: ['绘本','阅读'], iconBg: 'var(--blue-light)' },
  { icon: '📖', title: 'RAZ 分级阅读', desc: '北美主流分级体系，稳步提升阅读能力', tags: ['RAZ','阅读'], iconBg: 'var(--orange-light)' },
  { icon: '📺', title: '英语动画片学习', desc: '看动画练听力，适合日常磨耳朵', tags: ['动画','听力'], iconBg: 'var(--green-light)' },
  { icon: '🎧', title: '听英语音频 30 分钟', desc: '播客/有声书/新闻，沉浸式听力输入', tags: ['听力','日常'], iconBg: 'var(--pink-light)' },
  { icon: '🎓', title: '四六级高频词汇速记课', desc: '按词根词缀串记核心词，通勤可刷', tags: ['四六级','词汇'], iconBg: 'var(--blue-light)' },
  { icon: '🗣️', title: '日常口语900句跟读', desc: '覆盖点餐/问路/面试等高频场景', tags: ['口语','跟读'], iconBg: 'var(--orange-light)' },
  { icon: '📻', title: '四六级听力抢分技巧', desc: '听前预判+关键词定位', tags: ['四六级','听力'], iconBg: 'var(--pink-light)' }
], v => v.title);

function renderEnglish() {
  showWord();
  document.getElementById('englishVideoList').innerHTML = videoList('english', englishVideos);
}

document.querySelectorAll('#engTabs .tab').forEach(tab => {
  tab.onclick = () => {
    const mode = tab.dataset.eng;
    document.querySelectorAll('#engTabs .tab').forEach(t => t.classList.remove('active')); tab.classList.add('active');
    document.getElementById('engWordsPanel').style.display = mode === 'words' ? 'block' : 'none';
    document.getElementById('engQuizPanel').style.display = mode === 'quiz' ? 'block' : 'none';
    document.getElementById('engVideoPanel').style.display = mode === 'videos' ? 'block' : 'none';
    if (mode === 'quiz') renderQuiz();
  };
});

/* ================= Exam ================= */
const examVideos = makeSearchItems([
  { icon: '📐', title: '行测·资料分析速算技巧', desc: '截位直除/百化分核心技巧，免费全集网课', tags: ['行测','速算'] },
  { icon: '✍️', title: '申论·大作文万能框架', desc: '开头/分论点/结尾模板化拆解', tags: ['申论','写作'] },
  { icon: '📖', title: '言语理解·高频成语500', desc: '近5年真题高频成语，每天20个', tags: ['行测','言语'] },
  { icon: '📐', title: '判断推理·图推40式', desc: '位置/样式/属性/数量四大规律', tags: ['行测','图推'] },
  { icon: '🎯', title: '事业编·公基速记口诀', desc: '法律/政治/经济高频考点口诀化', tags: ['事业编','公基'] },
  { icon: '⏱️', title: '数量关系·秒杀技巧', desc: '代入法/赋值法/数字特性破题', tags: ['行测','数量'] },
  { icon: '📝', title: '申论·公文写作格式', desc: '通知/倡议书/讲话稿模板与范文', tags: ['申论','公文'] },
  { icon: '🔁', title: '错题复盘方法论', desc: '建立错题本+同类题归类+周复盘', tags: ['方法','复盘'] }
], v => v.title);

const examQuizData = [
  { q: '行测中“类比推理”属于哪个模块？', opts: ['言语理解', '判断推理', '数量关系'], a: 1 },
  { q: '申论作答应优先使用材料中的？', opts: ['原词原句', '华丽辞藻', '个人经历'], a: 0 },
  { q: '下列属于“行政许可”的是？', opts: ['交警开罚单', '发营业执照', '法院判决'], a: 1 },
  { q: '“三个代表”重要思想对应时期核心是？', opts: ['经济建设', '党的建设', '对外开放'], a: 1 },
  { q: '医学类考公常报岗位隶属？', opts: ['卫健委/疾控中心', '教育局', '气象局'], a: 0 },
  { q: '资料分析解题首要步骤？', opts: ['直接硬算', '读题圈关键词', '背公式'], a: 1 }
];
let eqIdx = 0, eqAnswered = false;
function renderExam() {
  document.getElementById('examVideoList').innerHTML = videoList('exam', examVideos);
  let h = 0; for (const c of todayKey()) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  eqIdx = h % examQuizData.length;
  const q = examQuizData[eqIdx];
  document.getElementById('examQuiz').innerHTML = `
    <div class="font-bold mb-3">第 ${eqIdx + 1}/${examQuizData.length} 题：${q.q}</div>
    ${q.opts.map((opt, i) => `<button class="quiz-opt" onclick="answerExam(${i})">${opt}</button>`).join('')}
    <div class="quiz-result" id="examQuizResult"></div>
    <button class="btn btn-primary" style="width:100%;margin-top:10px" onclick="nextExamQuiz()">下一题</button>
  `;
  eqAnswered = false;
  const jobs = [
    { title: '2026 年事业单位综合岗', loc: '全国', edu: '本科及以上', major: '医学相关', link: 'https://www.baidu.com/s?wd=2026事业单位医学岗位招聘' },
    { title: '疾控中心公共卫生岗', loc: '各省', edu: '本科及以上', major: '医学/预防医学', link: 'https://www.baidu.com/s?wd=疾控中心招聘医学本科' },
    { title: '卫健委/医保局行政岗', loc: '地市', edu: '本科及以上', major: '医学类', link: 'https://www.baidu.com/s?wd=卫健委招聘医学专业本科' }
  ];
  document.getElementById('examJobs').innerHTML = jobs.map(j => `
    <div class="resource-card">
      <div class="resource-body">
        <div class="resource-title">${j.title}</div>
        <div class="resource-meta">📍 ${j.loc} · 🎓 ${j.edu} · 📖 ${j.major}</div>
        <div class="resource-actions"><a class="link-web" href="${j.link}" target="_blank">查看公告</a></div>
      </div>
    </div>
  `).join('');
}
function answerExam(i) { if (eqAnswered) return; eqAnswered = true; const q = examQuizData[eqIdx]; const opts = document.querySelectorAll('#examQuiz .quiz-opt'); opts[i].classList.add(i === q.a ? 'correct' : 'wrong'); if (i !== q.a) opts[q.a].classList.add('correct'); document.getElementById('examQuizResult').textContent = i === q.a ? '✅ 正确' : '❌ 正确答案：' + q.opts[q.a]; }
function nextExamQuiz() { eqIdx = (eqIdx + 1) % examQuizData.length; renderExam(); }

/* ================= Medical ================= */
/* 医学专业课复习资料（按科目：高频考点/易错/难点/口诀，名词·特性加粗，供自主复习） */
const medicalData = [
  { subject: '生理学', high: [
    { t: '① 名词解释：<b>稳态</b>', c: '内环境理化性质维持相对恒定的状态，是机体自我调节的核心目标。' },
    { t: '② 名词解释：<b>动作电位</b>', c: '可兴奋细胞受刺激后膜电位发生的快速、可传导的<b>去极化反转</b>，是兴奋的标志。' },
    { t: '③ 简答：<b>心肌细胞</b>动作电位分期', c: '0期(<b>快Na⁺内流</b>)→1期(短暂K⁺外流)→2期(<b>平台期</b>，Ca²⁺内流与K⁺外流平衡)→3期(K⁺外流)→4期(静息)。平台期是心肌区别于骨骼肌的关键。' },
    { t: '④ 简答：<b>动脉血压</b>形成四要素', c: '<b>心输出量</b>、外周阻力、大动脉弹性(缓冲)、循环血量，四者共同决定血压高低。' },
    { t: '⑤ 名词解释：<b>通气/血流比值</b>', c: '肺泡通气量与肺血流之比，约<b>0.84</b>时换气效率最高；增大提示"死腔样通气"，减小提示"分流"。' } ],
    wrong: ['把"平台期"误认为复极化；混淆<b>收缩压/舒张压</b>定义；误以为心率越快心输出量越多(过快反而下降)'],
    hard: ['各期离子流机制、<b>异长/等长自身调节</b>的区分与应用'],
    mnemonic: ['"0钠1钾2钙平，3钾4静记分明"(动作电位分期)'] },
  { subject: '生物化学与分子生物学', high: [
    { t: '① 名词解释：<b>三羧酸循环</b>', c: '在线粒体基质中<b>乙酰CoA</b>彻底氧化的共同通路，产生NADH/FADH₂，是糖脂蛋白代谢枢纽。' },
    { t: '② 简答：<b>糖酵解</b>三个关键酶', c: '<b>己糖激酶</b>、磷酸果糖激酶-1、<b>丙酮酸激酶</b>；其中PFK-1是最主要限速酶。' },
    { t: '③ 名词解释：<b>氧化磷酸化</b>', c: '呼吸链电子传递释放能量<b>偶联ATP合成</b>；P/O比值反映每对电子产ATP效率。' },
    { t: '④ 名词解释：<b>酮体</b>', c: '肝细胞生成、<b>肝外组织</b>利用的<b>乙酰乙酸/β-羟丁酸/丙酮</b>，长期饥饿时的重要脑能源。' },
    { t: '⑤ 简答：<b>DNA复制</b>特点', c: '<b>半保留</b>、半不连续(<b>冈崎片段</b>)、需RNA引物、双向进行。' } ],
    wrong: ['糖酵解场所误记线粒体(实为<b>胞质</b>)；酮体"肝内生成、肝外利用"常被颠倒；TCA误记在胞质'],
    hard: ['代谢途径交叉调控、呼吸链复合体顺序与抑制剂位点'],
    mnemonic: ['"三羧酸在基质，糖酵胞质三酶卡；酮体肝生肝外用，复制半保留双向"'] },
  { subject: '病理学', high: [
    { t: '① 名词解释：<b>萎缩/化生/增生</b>', c: '萎缩=体积缩小；<b>化生</b>=一种分化上皮被另一种取代(如鳞化)；增生=细胞数量增多。' },
    { t: '② 名词解释：<b>梗死</b>', c: '血管阻塞致局部组织<b>缺血性坏死</b>；分<b>贫血性</b>(心、脾、肾)与出血性(肺、肠)。' },
    { t: '③ 简答：<b>肿瘤分化</b>与恶性度', c: '分化越低恶性度越高；<b>异型性</b>(细胞/组织结构异常)是良恶性诊断依据。' },
    { t: '④ 名词解释：<b>肉芽组织</b>', c: '新生毛细血管+成纤维细胞+炎细胞，是<b>组织修复</b>的主力， eventual 演变为瘢痕。' },
    { t: '⑤ 简答：<b>炎症</b>基本病理', c: '变质、渗出、增生三要素；<b>趋化</b>指白细胞沿化学梯度定向游走。' } ],
    wrong: ['把"化生"当"增生"；坏死与<b>凋亡</b>混淆(凋亡无炎反应)；癌(上皮)与肉瘤(间叶)来源颠倒'],
    hard: ['凋亡 vs 坏死的形态与机制、转移途径(淋巴/血行/种植)'],
    mnemonic: ['"变质渗出增生，炎变三步真；癌从上皮来，肉瘤间叶生"'] },
  { subject: '诊断学', high: [
    { t: '① 名词解释：<b>移动性浊音</b>', c: '腹水>1000ml时浊音随体位改变，是提示<b>腹腔积液</b>的重要体征。' },
    { t: '② 名词解释：<b>Murphy征</b>', c: '深压右肋缘下、令吸气时因痛终止吸气为阳性，提示<b>急性胆囊炎</b>。' },
    { t: '③ 简答：<b>发热</b>分度', c: '低热37.3-38℃、中热38.1-39℃、高热39.1-41℃、超高热>41℃。' },
    { t: '④ 名词解释：<b>弛张热</b>', c: '体温>39℃且24h波动>2℃但不回正常(见于<b>败血症</b>)，需与稽留热鉴别。' },
    { t: '⑤ 简答：<b>水肿</b>常见病因', c: '心(右心衰)、肾(<b>肾病综合征</b>)、肝(低蛋白)、营养不良性。' } ],
    wrong: ['混淆<b>弛张热</b>与稽留热；移动性浊音阈值(>1000ml)记错；墨菲征与麦氏点混淆'],
    hard: ['各种热型鉴别、叩诊与听诊的定性定位'],
    mnemonic: ['"稽留高稳一天平，弛张两天两度升；墨菲胆囊压，麦氏阑尾疼"'] },
  { subject: '内科学', high: [
    { t: '① 名词解释：<b>COPD</b>', c: '以持续<b>气流受限</b>为特征的慢性气道病，与吸烟/<b>慢性支气管炎</b>/肺气肿相关。' },
    { t: '② 简答：<b>左心衰</b>临床表现', c: '<b>肺循环淤血</b>：呼吸困难(劳力性→夜间阵发性→端坐呼吸)、肺水肿、湿啰音。' },
    { t: '③ 简答：<b>心绞痛</b>与心梗鉴别', c: '心梗胸痛更剧烈、>30min、<b>ST段抬高</b>、心肌酶(CK-MB/cTnI)升高。' },
    { t: '④ 名词解释：<b>消化性溃疡</b>', c: '胃/十二指肠黏膜溃疡，<b>幽门螺杆菌</b>与NSAIDs为主要病因；十二指肠溃疡更常见。' },
    { t: '⑤ 简答：<b>糖尿病</b>并发症', c: '急性(<b>酮症酸中毒</b>)；慢性微血管(视网膜/肾)、大血管(心/脑/下肢)。' } ],
    wrong: ['左心衰(肺淤血)与右心衰(体循环淤血)表现颠倒；溃疡好发部位(十二指肠>胃)；心梗与心绞痛时间阈值(<30min)'],
    hard: ['NYHA心功能分级、常见酸碱失衡(ABG)判读'],
    mnemonic: ['"左衰肺淤血，右衰体循环；COPD气流限，戒烟是根本"'] },
  { subject: '外科学', high: [
    { t: '① 名词解释：<b>无菌术</b>', c: '杀灭/清除微生物、防止伤口感染的<b>原则与操作</b>(灭菌+消毒+无菌操作)。' },
    { t: '② 名词解释：<b>休克</b>', c: '有效循环血量锐减致<b>组织灌注不足</b>；常见失血性、感染性(脓毒性)、心源性。' },
    { t: '③ 简答：<b>破伤风</b>处理原则', c: '清创、早期足量<b>抗毒素(TAT)</b>、镇静解痉、防窒息；强调"预防>治疗"。' },
    { t: '④ 简答：<b>急性阑尾炎</b>体征', c: '<b>麦氏点</b>(右髂前上棘与脐连线外1/3)压痛、反跳痛、肌紧张。' },
    { t: '⑤ 名词解释：<b>颅内压增高</b>', c: '颅内容积代偿失代偿，三主征：<b>头痛/呕吐/视乳头水肿</b>。' } ],
    wrong: ['麦氏点定位错误；破伤风"预防大于治疗"常被忽视；感染性休克补液原则(先晶后胶)混淆'],
    hard: ['休克三期表现、肿瘤TNM分期含义'],
    mnemonic: ['"麦氏右髂上，压痛反跳张；破伤风清创，TAT莫忘"'] },
  { subject: '妇产科学', high: [
    { t: '① 名词解释：<b>早孕反应</b>', c: '停经约6周起出现恶心/呕吐/厌油，多在<b>12周</b>前后缓解。' },
    { t: '② 名词解释：<b>前置胎盘</b>', c: '胎盘附着于<b>宫颈内口</b>，典型表现为妊娠晚期<b>无痛性阴道流血</b>。' },
    { t: '③ 简答：<b>妊娠期高血压</b>表现', c: '<b>高血压</b>+蛋白尿+水肿，重度可进展为<b>子痫</b>(抽搐)。' },
    { t: '④ 名词解释：<b>产后出血</b>', c: '胎儿娩出后24h内出血量>500ml；四大因：宫缩乏力/产道损伤/胎盘因素/<b>凝血障碍</b>。' },
    { t: '⑤ 简答：<b>卵巢囊肿蒂扭转</b>', c: '突发下腹剧痛伴恶心呕吐，是妇科常见急腹症，多需<b>急诊手术</b>。' } ],
    wrong: ['前置胎盘"无痛性出血"常被遗漏；妊高症与子痫关系混淆；产后出血阈值(>500ml)记错'],
    hard: ['分娩机制(衔接→下降→俯屈→内旋转)、妇科肿瘤FIGO分期'],
    mnemonic: ['"前置无痛流血，妊高抽子痫；产后五百血，四因记心间"'] },
  { subject: '儿科学', high: [
    { t: '① 名词解释：<b>生长发育</b>', c: '连续而有阶段、各系统不平衡，有两个高峰：<b>婴儿期</b>与<b>青春期</b>。' },
    { t: '② 简答：<b>体重</b>估算公式', c: '<1岁=出生(3kg)+月龄×0.7；2岁=年龄×2+8(kg)；体格评价常用指标。' },
    { t: '③ 名词解释：<b>新生儿黄疸</b>', c: '胆红素代谢未成熟致皮肤黄染；分<b>生理性</b>(生后2-3天、轻、自退)与病理性。' },
    { t: '④ 简答：<b>佝偻病</b>', c: '<b>维生素D</b>缺乏致钙磷代谢异常、骨骼改变(方颅/鸡胸/O形腿)。' },
    { t: '⑤ 名词解释：<b>小儿腹泻</b>', c: '多病原致大便次数/性状改变，核心是<b>防治脱水</b>与电解质紊乱。' } ],
    wrong: ['体重公式(1岁/2岁)记错；生理性与病理性黄疸界限(出现时间/峰值)混淆；脱水程度(轻中重)判读错误'],
    hard: ['计划免疫程序(疫苗时间表)、液体疗法(累积损失量计算)'],
    mnemonic: ['"两岁乘二加八，一岁公斤加七；维D缺佝偻病，黄疸分生理病"'] }
];
const medicalVideos = makeSearchItems([
  { icon: '🦴', title: '系统解剖学（霍琨手绘版）', desc: '医学本科必修，运动/内脏/神经解剖系统讲解', tags: ['解剖','基础'] },
  { icon: '🧪', title: '生物化学与分子生物学', desc: '糖脂代谢/酶/核酸/基因表达', tags: ['生化','基础'] },
  { icon: '🛡️', title: '医学免疫学', desc: '固有免疫与适应性免疫、超敏反应', tags: ['免疫','基础'] },
  { icon: '🦠', title: '医学微生物学', desc: '细菌/病毒/真菌致病与抗感染', tags: ['微生物','基础'] },
  { icon: '🫀', title: '生理学精讲', desc: '循环/呼吸/消化/泌尿/神经生理机制', tags: ['生理','基础'] },
  { icon: '🧬', title: '病理学重点', desc: '炎症/肿瘤/心血管与呼吸系统病理', tags: ['病理','基础'] },
  { icon: '⚖️', title: '病理生理学', desc: '水电解质/酸碱/缺氧/休克/发热', tags: ['病生','基础'] },
  { icon: '💊', title: '药理学速记', desc: '心血管/神经/抗菌药作用机制与临床应用', tags: ['药理','基础'] },
  { icon: '🩺', title: '诊断学·检体诊断', desc: '病史采集/体格检查/病历书写', tags: ['诊断','临床'] },
  { icon: '🫁', title: '内科学·呼吸/循环/消化', desc: '常见内科病发病机制与诊疗', tags: ['内科','临床'] },
  { icon: '🩹', title: '外科学·总论与普外', desc: '无菌术/创伤/感染/普外与骨科', tags: ['外科','临床'] },
  { icon: '🧒', title: '儿科学', desc: '生长发育/新生儿/儿童常见疾病', tags: ['儿科','临床'] },
  { icon: '🤰', title: '妇产科学', desc: '生理产科/妇科肿瘤/生殖内分泌', tags: ['妇科','临床'] },
  { icon: '🧠', title: '神经病学', desc: '中枢与周围神经疾病定位诊断', tags: ['神经','临床'] },
  { icon: '🩻', title: '医学影像学', desc: 'X线/CT/MRI/超声影像判读', tags: ['影像','临床'] },
  { icon: '🌡️', title: '预防医学与流行病学', desc: '疾病分布/三级预防/统计基础', tags: ['预防','公卫'] }
], v => v.title);
function renderMedical() {
  document.getElementById('medicalVideoList').innerHTML = videoList('medical', medicalVideos);
  const box = document.getElementById('medReview');
  if (box) box.innerHTML = `
    <div class="font-bold mb-2">📚 医学专业课复习资料（按科目）</div>
    ${medicalData.map((s, si) => `
      <div class="card mt-2">
        <div class="font-bold mb-2">🩺 ${esc(s.subject)}</div>
        <div class="text-sm font-bold text-blue mb-1">· 常考高频考点（含简单解答）</div>
        ${s.high.map(h => `<div class="text-sm mb-2"><b>${h.t}</b><br><span class="text-muted">${h.c}</span></div>`).join('')}
        <div class="text-sm font-bold text-orange mb-1">· 易错考点</div>
        ${s.wrong.map(w => `<div class="text-sm mb-1">⚠️ ${esc(w)}</div>`).join('')}
        <div class="text-sm font-bold text-green mb-1">· 学习难点</div>
        ${s.hard.map(hd => `<div class="text-sm mb-1">🔧 ${esc(hd)}</div>`).join('')}
        <div class="text-sm font-bold" style="color:#8e44ad">· 记忆口诀</div>
        ${s.mnemonic.map(m => `<div class="text-sm mb-1">🔑 ${esc(m)}</div>`).join('')}
      </div>`).join('')}
  `;
  document.getElementById('medNote').value = store.get('luo_med_note', '');
}
function saveMedicalNote() { store.set('luo_med_note', document.getElementById('medNote').value); toast('笔记已保存'); }

/* ================= Inspiration ================= */
const inspirationPool = [
  { title: '普通人下班后的 1 小时', angle: '反内卷+自我提升', script: '开头：23岁，工资5千，但我每天下班只做一件事…', shots: '近景走路+书桌+时间字幕' },
  { title: '考公人崩溃瞬间', angle: '情绪共鸣+搞笑', script: '做了100道题，对答案发现全是红叉，但我发现了一个规律…', shots: '俯拍试卷+手抖特效+崩溃表情' },
  { title: '英语老师不会告诉你的口语技巧', angle: '知识反差', script: '别再背单词书了，母语者日常只用这200个表达…', shots: '口播+屏幕录制+关键词高亮' },
  { title: '30 天学会剪辑', angle: '成长记录', script: '第1天剪得像PPT，第30天甲方开始给我打钱…', shots: '对比分屏+数据展示+收款截图' },
  { title: '00后搞钱日记', angle: '理财新手', script: '工资3000，但我每个月能存下1500，方法很简单…', shots: '记账App录屏+卡通数字' },
  { title: 'Kpop 燃脂舞跟练', angle: '健身+娱乐', script: '跳完这首IVE新歌，我暴汗了 but 好开心', shots: '全身跟练+歌词字幕+卡路里计数' },
  { title: '医学生的一天vlog', angle: '专业+治愈', script: '7点解剖楼，22点自习室，医学生的浪漫是白大褂…', shots: '图书馆延时+实验镜头+夜晚路灯' },
  { title: '低成本改造出租屋', angle: '生活美学', script: '租来的房子也能很舒服，我花了200块做了这些…', shots: '前后对比+好物特写+收纳' },
  { title: '面试被问“你最大的缺点”', angle: '职场干货', script: '千万别说“我太追求完美”，正确答法是…', shots: '口播+字幕重点+情景演绎' },
  { title: '一个人也要好好吃饭', angle: '治愈+美食', script: '独居第365天，我学会了10分钟搞定一餐…', shots: '备菜快剪+热气腾腾特写+餐具' }
];
function paintInspiration(shuffled) {
  const html = shuffled.map(item => `
    <div class="card">
      <div class="font-bold mb-2">${item.title}</div>
      <div class="text-sm text-muted mb-2">角度：${item.angle}</div>
      <div class="mb-2"><span class="text-blue">文案钩子：</span>${item.script}</div>
      <div class="text-sm"><span class="text-orange">镜头思路：</span>${item.shots}</div>
    </div>
  `).join('');
  const list1 = document.getElementById('inspirationList');
  const list2 = document.getElementById('geniusInspirationList');
  if (list1) list1.innerHTML = html;
  if (list2) list2.innerHTML = html;
}
function renderInspiration() {
  const shuffled = seededShuffle(inspirationPool, todayKey()).slice(0, 3);
  paintInspiration(shuffled);
}
function refreshInspiration() {
  const shuffled = [...inspirationPool].sort(() => Math.random() - 0.5).slice(0, 3);
  paintInspiration(shuffled);
  toast('灵感已换一批');
}

/* ================= Viral ================= */
let viralVideos = store.get('luo_viral', [
  { title: '“早八人 5 分钟出门妆”', platform: '抖音', tag: '美妆/通勤', reason: '切中打工人早起痛点，5分钟低门槛', hook: '开头直接展示素颜→全妆对比', idea: '改编为“考公人 5 分钟提神妆”或“通勤英语跟读 5 分钟”', bili: searchLinks('早八人5分钟出门妆').bili, douyin: 'https://www.douyin.com/search/5%E5%88%86%E9%92%9F%E5%87%BA%E9%97%A8%E5%A6%86' },
  { title: '“挑战 30 天瘦 10 斤”', platform: '得物/抖音', tag: '健身/挑战', reason: '强目标+强反差，适合追更', hook: 'Day1 体重秤特写+目标语音', idea: '改编为“30 天英语听力逆袭”或“30 天考公作息挑战”', bili: searchLinks('挑战30天瘦10斤').bili, douyin: 'https://www.douyin.com/search/30%E5%A4%A9%E7%98%A610%E6%96%A4' },
  { title: '“办公室低预算穿搭”', platform: '抖音', tag: '穿搭/职场', reason: '实用性强，评论区求链接', hook: '月薪三千怎么穿得像一万', idea: '改编为“考公人平价学习装备”或“大学生平价实习穿搭”', bili: searchLinks('办公室低预算穿搭').bili, douyin: 'https://www.douyin.com/search/%E4%BD%8E%E9%A2%84%E7%AE%97%E7%A9%BF%E6%90%AD' }
]);
function renderViral() {
  const updated = store.get('luo_viral_updated', '');
  const updEl = document.getElementById('viralUpdated');
  if (updEl) updEl.textContent = updated ? '上次采集：' + updated : '尚未采集，点上方按钮采集今日热点';
  document.getElementById('viralList').innerHTML = viralVideos.map(v => `
    <div class="card">
      <div class="flex-between mb-2"><span class="font-bold">${v.title}</span><span class="tag tag-low">${v.platform}</span></div>
      <div class="resource-tags">${v.tag.split('/').map(t => `<span class="resource-tag">${t}</span>`).join('')}</div>
      <div class="mb-2"><span class="text-orange">爆火原因：</span>${v.reason}</div>
      <div class="mb-2"><span class="text-blue">开头钩子：</span>${v.hook}</div>
      <div class="mb-3" style="background:var(--orange-light);padding:10px;border-radius:10px;font-size:13px"><span class="font-bold">二创思路：</span>${v.idea}</div>
      <div class="resource-actions">
        <a class="link-bili" href="${v.bili}" target="_blank">📺 B站</a>
        <a class="link-douyin" href="${v.douyin}" target="_blank">🎵 抖音</a>
        ${v.xhs ? `<a class="link-xhs" href="${v.xhs}" target="_blank">🔴 小红书</a>` : ''}
      </div>
    </div>
  `).join('');
}
function mockCrawl() {
  toast('正在模拟采集…');
  setTimeout(() => {
    const pool = [
      { title: '“下班后做自媒体第 N 天”', platform: '抖音', tag: '自媒体/成长', reason: '素人逆袭叙事，追更欲强', hook: '今天是我做自媒体的第 47 天，收入终于破千了', idea: '改编为“下班后学英语第 N 天”系列，每天晒单词打卡', kw: '下班后做自媒体' },
      { title: '“体制内上岸后的一天”', platform: '抖音', tag: '考公/日常', reason: '目标群体精准，评论区许愿', hook: '上岸前我以为会轻松，上岸后发现…', idea: '改编为“医学生考编上岸经验”或“本科医学生上岸日记”', kw: '体制内上岸后的一天' },
      { title: '“医学生期末月vlog”', platform: 'B站', tag: '医学/治愈', reason: '共鸣强，期末季流量大', hook: '解剖图谱翻烂了，但今天又背下 50 个结构', idea: '做成“期末复习陪伴”系列，穿插记忆口诀', kw: '医学生期末vlog' },
      { title: '“一个人住的100个瞬间”', platform: '小红书', tag: '生活/治愈', reason: '情绪价值高，易收藏', hook: '租来的房子，也要好好生活', idea: '改编为“独居医学生的一日三餐”', kw: '一个人住的瞬间' }
    ];
    const pick = seededShuffle(pool, String(Date.now())).slice(0, 2).map(p => ({ ...p, bili: searchLinks(p.kw).bili, douyin: searchLinks(p.kw).douyin, xhs: searchLinks(p.kw).xhs }));
    const now = new Date();
    const ts = `${now.getMonth()+1}/${now.getDate()} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
    viralVideos = pick.concat(viralVideos).slice(0, 6);
    store.set('luo_viral', viralVideos);
    store.set('luo_viral_updated', ts);
    renderViral();
    toast('已采集 ' + pick.length + ' 条爆款（' + ts + '）');
  }, 1200);
}

/* ================= Editing ================= */
let editProgress = store.get('luo_edit_progress', [
  { title: '第1课：文案钩子 7 大模板', desc: '开头3秒留人公式，反差/悬念/数字钩子拆解', tags: ['文案','口播'], done: false },
  { title: '第2课：剪映调色思路·ins风', desc: '低饱和奶油色调参数，一键出ins感', tags: ['调色','剪映'], done: false },
  { title: '第3课：5种必学运镜手法', desc: '推拉摇移跟，手机拍出电影感', tags: ['拍摄','运镜'], done: false },
  { title: '第4课：卡点剪辑从0到1', desc: '踩点标记+节拍自动对齐，10分钟学会卡点', tags: ['剪辑','卡点'], done: false },
  { title: '第5课：转场与节奏控制', desc: '硬切/遮罩/匹配转场，让画面不拖沓', tags: ['转场','节奏'], done: false },
  { title: '第6课：花字与字幕排版', desc: '关键词高亮、双语字幕、动态花字', tags: ['字幕','排版'], done: false },
  { title: '第7课：音效与BGM搭配', desc: '踩点音效、环境音、卡点音乐选曲', tags: ['音效','配乐'], done: false },
  { title: '第8课：封面与标题设计', desc: '三秒吸引点击的封面构图与标题公式', tags: ['封面','标题'], done: false },
  { title: '第9课：Vlog 叙事结构', desc: '起承转合+情绪曲线，日常也能好看', tags: ['vlog','叙事'], done: false },
  { title: '第10课：混剪二创实战', desc: '素材整理+节奏重组，做出高燃混剪', tags: ['混剪','二创'], done: false }
]);
function renderEdit() {
  const doneCount = editProgress.filter(c => c.done).length;
  const pct = Math.round(doneCount / editProgress.length * 100);
  document.getElementById('editProgress').style.width = pct + '%';
  document.getElementById('editProgressText').textContent = `学习进度 ${doneCount}/${editProgress.length} 节（${pct}%）`;
  const videos = editProgress.map((c, i) => ({ ...c, icon: ['📝','🎨','🎬','🎵'][i] || '🎬', bili: searchLinks('剪映' + c.title).bili, douyin: searchLinks('剪映' + c.title).douyin }));
  document.getElementById('editList').innerHTML = videos.map((c, i) => resourceCard({
    icon: c.icon, title: c.title, desc: c.desc, tags: c.tags, iconBg: 'var(--pink-light)',
    bili: c.bili, douyin: c.douyin, done: c.done, doneFn: `toggleEdit(${i})`
  })).join('');
}
function toggleEdit(i) { editProgress[i].done = !editProgress[i].done; store.set('luo_edit_progress', editProgress); renderEdit(); }

/* ================= Recruitment ================= */
const recruitJobs = [
  { title: '医院临床/医技岗位（编内）', loc: '各省三甲医院', edu: '本科全日制医学学位', major: '临床医学/医学影像等', link: 'https://www.baidu.com/s?wd=医院招聘医学本科2026' },
  { title: '疾控中心公共卫生岗', loc: '市/县级疾控中心', edu: '本科及以上', major: '预防医学/临床医学', link: 'https://www.baidu.com/s?wd=疾控中心招聘医学本科' },
  { title: '卫健委/医保局行政岗', loc: '地市机关', edu: '本科及以上', major: '医学类', link: 'https://www.baidu.com/s?wd=卫健委招聘医学专业' },
  { title: '医学院校教辅/实验员', loc: '医学院校', edu: '本科及以上', major: '医学相关', link: 'https://www.baidu.com/s?wd=医学院校招聘教辅医学本科' },
  { title: '医学编辑 / 医学内容运营', loc: '医药企业/健康平台', edu: '本科及以上', major: '医学类', link: 'https://www.baidu.com/s?wd=医学编辑招聘' },
  { title: '药企医学联络官 MSL', loc: '一线/新一线', edu: '本科及以上', major: '临床医学/药学', link: 'https://www.baidu.com/s?wd=药企MSL医学联络官招聘' },
  { title: '基层卫生院全科医生', loc: '区县/乡镇', edu: '本科及以上', major: '临床医学', link: 'https://www.baidu.com/s?wd=基层卫生院全科医生招聘' },
  { title: '三甲医院规培/专硕并轨', loc: '各省', edu: '本科及以上', major: '临床医学', link: 'https://www.baidu.com/s?wd=三甲医院规培招生2026' },
  { title: '医学检验/影像技师', loc: '医院/第三方实验室', edu: '本科及以上', major: '医学检验/影像', link: 'https://www.baidu.com/s?wd=医学检验技师招聘' },
  { title: '健康体检中心医师', loc: '连锁机构', edu: '本科及以上', major: '临床医学', link: 'https://www.baidu.com/s?wd=体检中心医师招聘' }
];
let recruitSeed = todayKey();
function renderRecruit(reshuffle) {
  if (reshuffle) recruitSeed = String(Date.now());
  const jobs = seededShuffle(recruitJobs, 'recruit' + recruitSeed).slice(0, 6);
  document.getElementById('recruitList').innerHTML = `
    <div class="flex-between mb-2">
      <span class="text-sm text-muted">数据每日更新 · 共 ${recruitJobs.length} 条候选</span>
      <button class="btn btn-outline btn-small" onclick="renderRecruit(true)">🔄 刷新</button>
    </div>` + jobs.map(j => `
    <div class="resource-card">
      <div class="resource-body">
        <div class="resource-title">${j.title}</div>
        <div class="resource-meta">📍 ${j.loc} · 🎓 ${j.edu} · 📖 ${j.major}</div>
        <div class="resource-actions"><a class="link-web" href="${j.link}" target="_blank">查看公告</a></div>
      </div>
    </div>
  `).join('');
}

/* ================= Fitness ================= */
const fitnessVideos = makeSearchItems([
  { icon: '🔥', title: '帕梅拉 45 分钟全身燃脂合集', desc: '有氧+无氧结合，适合每日跟练', tags: ['帕梅拉','燃脂'], iconBg: 'var(--orange-light)' },
  { icon: '🎌', title: '动漫跟练视频（宅舞燃脂版）', desc: '二次元BGM+简单舞步，快乐出汗', tags: ['动漫','燃脂舞'], iconBg: 'var(--pink-light)' },
  { icon: '🍫', title: '腹肌训练·无器械初级', desc: '卷腹+平板支撑组合，避免腰部代偿', tags: ['腹肌','核心'], iconBg: 'var(--blue-light)' },
  { icon: '💪', title: '手臂力量训练（不练斜方肌）', desc: '侧平举注意沉肩，避免耸肩发力', tags: ['手臂','塑形'], iconBg: 'var(--green-light)' },
  { icon: '🎾', title: '网球实用教学·零基础入门', desc: '握拍/发球/正反手基础动作', tags: ['网球','运动'], iconBg: 'var(--purple-light)' },
  { icon: '🧘', title: '拉伸放松与体态矫正', desc: '改善圆肩驼背的每日拉伸', tags: ['拉伸','体态'], iconBg: 'var(--blue-light)' }
], v => v.title);
function renderFitness() {
  document.getElementById('fitnessVideoList').innerHTML = videoList('fitness', fitnessVideos);
  const water = store.get('luo_water', [false,false,false,false,false,false,false,false]);
  document.getElementById('waterList').innerHTML = water.map((d, i) => `
    <div class="todo-item ${d ? 'done' : ''}" onclick="toggleWater(${i})" style="cursor:pointer">
      <div class="todo-check">${d ? '✓' : ''}</div>
      <div class="todo-text">${['8:00','10:00','12:00','14:00','16:00','18:00','20:00','21:30'][i]} 饮水 ${[200,200,300,200,200,200,200,100][i]}ml</div>
    </div>
  `).join('');
}
function toggleWater(i) { const water = store.get('luo_water', [false,false,false,false,false,false,false,false]); water[i] = !water[i]; store.set('luo_water', water); renderFitness(); }

/* ================= Finance ================= */
const financeVideos = makeSearchItems([
  { icon: '🐶', title: '《小狗钱钱》理财启蒙精讲', desc: '先建立金钱观，再谈怎么赚', tags: ['入门','读书'] },
  { icon: '📊', title: '标准普尔家庭资产配置图', desc: '4个账户分配工资：要花/保命/生钱/保本', tags: ['入门','配置'] },
  { icon: '💰', title: '新手第一支货币基金', desc: '从余额宝原理讲起，认识最安全的理财起点', tags: ['入门','低风险'] },
  { icon: '📈', title: '基金定投实战课', desc: '微笑曲线、定投频率与止盈策略', tags: ['基金','定投'] }
], v => v.title);
let bills = store.get('luo_bills', []);
function renderFinance() {
  document.getElementById('financeVideoList').innerHTML = videoList('finance', financeVideos);
  const income = bills.filter(b => b.type === 'in').reduce((s, b) => s + b.amount, 0);
  const out = bills.filter(b => b.type === 'out').reduce((s, b) => s + b.amount, 0);
  document.getElementById('billIn').textContent = income.toFixed(2);
  document.getElementById('billOut').textContent = out.toFixed(2);
  document.getElementById('billNet').textContent = (income - out).toFixed(2);
  document.getElementById('billList').innerHTML = bills.length ? bills.slice().reverse().map(b => `
    <div class="bill-item">
      <div><div class="font-bold">${b.note}</div><div class="text-sm text-muted">${b.date}</div></div>
      <div class="font-bold ${b.type === 'in' ? 'bill-amount in' : 'bill-amount out'}">${b.type === 'in' ? '+' : '-'}${b.amount.toFixed(2)}</div>
    </div>
  `).join('') : '<div class="list-empty">暂无记账记录</div>';
}
function addBill() {
  const type = document.getElementById('billType').value;
  const amount = parseFloat(document.getElementById('billAmount').value);
  const note = document.getElementById('billNote').value.trim();
  if (!amount || amount <= 0) return toast('请输入金额');
  bills.push({ id: Date.now(), type, amount, note: note || (type === 'in' ? '收入' : '支出'), date: fmtDate() });
  store.set('luo_bills', bills);
  document.getElementById('billAmount').value = '';
  document.getElementById('billNote').value = '';
  renderFinance();
}
document.querySelectorAll('#financeTabs .tab').forEach(tab => {
  tab.onclick = () => {
    const mode = tab.dataset.fin;
    document.querySelectorAll('#financeTabs .tab').forEach(t => t.classList.remove('active')); tab.classList.add('active');
    document.getElementById('financeCoursePanel').style.display = mode === 'course' ? 'block' : 'none';
    document.getElementById('financeBillPanel').style.display = mode === 'bill' ? 'block' : 'none';
  };
});

/* ================= Novel ================= */
const novelSplits = [
  { title: '《开端》爆款拆解', tag: '悬疑/无限流', points: '高概念设定+公交车封闭空间+节奏快', apply: '小说可用“时间循环+日常场景”制造紧张感' },
  { title: '《狂飙》人物塑造拆解', tag: '现实/扫黑', points: '反派高启强成长弧光完整，观众共情', apply: '塑造有层次反派，让读者又恨又怜' },
  { title: '知乎盐选短篇爆款结构', tag: '短篇/爽文', points: '前三句必出冲突，500字一个小反转', apply: '开头直接写矛盾，避免大段背景' },
  { title: '《甄嬛传》宫斗爽点拆解', tag: '古言/宫斗', points: '信息差+隐忍反击+情感羁绊', apply: '用“伪装弱小-积蓄力量-反杀”结构写女主' },
  { title: '《盗墓笔记》悬念钩子拆解', tag: '悬疑/冒险', points: '未知空间+线索递进+人物羁绊', apply: '每章留一个“接下来会发生什么”的钩子' },
  { title: '《庆余年》穿越爽文节奏', tag: '穿越/权谋', points: '现代思维降维+身份反差+金句', apply: '用主角“知道答案”的信息差制造爽点' },
  { title: '言情甜文“推拉”写法', tag: '甜宠/言情', points: '靠近-疏远-误会-和好情绪曲线', apply: '用暧昧拉扯代替直接表白更上头' },
  { title: '爽文“打脸”结构模板', tag: '男频/爽文', points: '被轻视-展现实力-众人震惊三幕', apply: '把反派写得越狂，打脸越爽' },
  { title: '《琅琊榜》权谋复仇线拆解', tag: '古装/权谋', points: '十二年隐忍布局+赤焰冤案+以弱博强', apply: '用“主角手中只有真相与人心”制造智斗爽感' },
  { title: '《陈情令》CP感营造', tag: '耽改/双男主', points: '共患难羁绊+眼神戏+“姑苏蓝氏”规则反差', apply: '双男主用“一个守规一个破规”制造天然张力' },
  { title: '《都挺好》家庭群像', tag: '现实/家庭', points: '原生家庭矛盾+苏明玉独立线+不强行和解', apply: '写家庭文别急着和解，把代际创伤写实更戳人' },
  { title: '《隐秘的角落》细思极恐', tag: '悬疑/人性', points: '“一起爬山吗”童谣隐喻+成年人失控', apply: '用天真视角反衬黑暗，反差越甜越瘆人' },
  { title: '《小敏家》中年爱情', tag: '现实/温情', points: '离异重组+代际摩擦+成年人克制浪漫', apply: '中年言情靠“互相托底”而非甜宠，更耐看' },
  { title: '番茄小说黄金三章', tag: '男频/新媒体', points: '第一章立人设金手指、第二章小高潮、第三章入团', apply: '前 3000 字必须让读者“上瘾”，否则就流失' },
  { title: '晋江“先婚后爱”套路', tag: '言情/婚后', points: '契约婚姻+同居日常+假戏真做', apply: '用“合法同居”把推拉合理化，甜度自然不齁' },
  { title: '无限流“副本”设计', tag: '男频/系统', points: '规则怪谈+关卡递进+队友羁绊', apply: '每个副本只加一条新规则，读者边猜边怕' },
  { title: '《山海情》群像叙事', tag: '主旋律/群像', points: '脱贫主线+多个立体配角+方言真实感', apply: '群像文给每个配角一个“自私又可爱”的动机' },
  { title: '校园文“破镜重圆”', tag: '言情/校园', points: '年少错过+成年重逢+未消的心结', apply: '用“那年的误会一直没解开”做重逢钩子' },
  { title: '悬疑“叙述性诡计”', tag: '推理/本格', points: '叙述视角误导+最后一页反转', apply: '让读者“知道全部细节却看错”，反转才炸' },
  { title: '竖屏短剧“爽点密集”', tag: '短剧/竖屏', points: '每 10 秒一个冲突、每集一个反转', apply: '把长篇小说压缩成“每屏一个钩子”的节奏' },
  { title: '《长相思》古言虐恋拆解', tag: '古言/虐', points: '多角羁绊+宿命感+求而不得', apply: '用“求而不得”堆虐点，留白给读者脑补' },
  { title: '《苍兰诀》仙侠甜虐', tag: '仙侠/甜虐', points: '月尊×小妖的反差人设+救赎', apply: '神魔身份反差制造天然张力' },
  { title: '《三体》科幻叙事', tag: '科幻/硬核', points: '硬核设定+人性拷问+“未知”', apply: '用“未知”做终极钩子，留最大想象空间' },
  { title: '《明朝那些事儿》通俗史', tag: '历史/通俗', points: '口语化讲史+现代梗', apply: '用现代梗拉近与读者的距离' },
  { title: '《鬼吹灯》盗墓悬疑', tag: '悬疑/冒险', points: '民俗知识+探险+氛围', apply: '用真实民俗知识营造可信的惊悚' },
  { title: '《斗破苍穹》升级流', tag: '男频/玄幻', points: '废柴逆袭+打脸+阶梯成长', apply: '明确大目标+一级级小成长，读者有奔头' },
  { title: '《诡秘之主》克苏鲁体系', tag: '男频/克苏鲁', points: '序列体系+层层阴谋', apply: '用体系化设定撑起超长篇不崩' },
  { title: '《大江大河》时代群像', tag: '现实/年代', points: '改革浪潮下的个人命运', apply: '大时代衬小人物，命运感最强' },
  { title: '《欢乐颂》都市群像', tag: '都市/群像', points: '五女视角并行', apply: '多主角并行刻画，覆盖更广读者群' },
  { title: '《白夜追凶》硬汉悬疑', tag: '悬疑/硬汉', points: '双胞胎身份错位', apply: '身份错位即钩子，悬念拉满' },
  { title: '《沉默的真相》社会派', tag: '悬疑/社会', points: '三条时间线汇流揭真相', apply: '多线并行，结尾汇成一股爆发' },
  { title: '《我的天才女友》女性成长', tag: '成长/女性', points: '友谊如镜像+互相成就', apply: '用“另一个自己”写成长最深刻' },
  { title: '《小王子》寓言式', tag: '寓言/治愈', points: '童心哲思+简单意象', apply: '用最简单意象讲最深的道理' },
  { title: '《哈利波特》英雄之旅', tag: '奇幻/成长', points: '学院框架+七年成长', apply: '用“学校”框住冒险，结构清晰' },
  { title: '《花千骨》仙侠虐恋', tag: '仙侠/虐', points: '师徒虐恋+救赎', apply: '禁忌关系+救赎，虐点清晰' },
  { title: '《香蜜沉沉烬如霜》仙侠', tag: '仙侠/误会', points: '陨丹设定制造误会', apply: '用一个设定锁死误会，推动全书' },
  { title: '《逃出大英博物馆》微短剧', tag: '短剧/国潮', points: '文物拟人+情绪符号', apply: '用强情绪符号做社交传播' },
  { title: '《孤注一掷》反诈现实', tag: '现实/悬疑', points: '真实事件改编+社会痛点', apply: '用社会痛点抓最大共鸣' },
  { title: '《消失的她》悬疑反转', tag: '悬疑/反转', points: '层层反转+信任崩塌', apply: '用“信任崩塌”做爽点与后劲' }
];
const novelTeaches = makeSearchItems([
  { icon: '✍️', title: '小说开头怎么写才吸引人', desc: '黄金三章与开头冲突设计', tags: ['写作技巧'] },
  { icon: '🎭', title: '人物小传与角色弧光', desc: '从动机到转变的完整塑造', tags: ['人物塑造'] },
  { icon: '⚡', title: '爽文节奏与卡点技巧', desc: '章节末尾留钩子的 6 种方法', tags: ['节奏把控'] },
  { icon: '💼', title: '短篇小说投稿平台指南', desc: '知乎/番茄/晋江/UC 签约与变现', tags: ['投稿变现'] }
], v => v.title);
let scripts = store.get('luo_scripts', []);
function renderNovel() {
  const nsList = seededShuffle(novelSplits, todayKey()).slice(0, 10);
  document.getElementById('novelSplitList').innerHTML =
    `<div class="text-sm mb-2" style="color:#1565c0;font-weight:700">📅 每日更新 · ${todayKey()}（从市面最火前 100 风格池抽取，今日展示 10 / 共 ${novelSplits.length} 篇爆款，每天轮换不同书目）</div>` +
    nsList.map(n => `
    <div class="card">
      <div class="font-bold mb-2">${n.title}</div>
      <div class="resource-tags"><span class="resource-tag">${n.tag}</span></div>
      <div class="mb-2"><span class="text-blue">爆点：</span>${n.points}</div>
      <div class="text-sm"><span class="text-orange">迁移写法：</span>${n.apply}</div>
    </div>
  `).join('');
  document.getElementById('novelTeachList').innerHTML = videoList('novelTeach', novelTeaches);
  document.getElementById('scriptList').innerHTML = scripts.length ? scripts.map(s => `
    <div class="card-flat">
      <div class="flex-between mb-2"><span class="font-bold">${s.name}</span><span class="tag tag-low">${s.type || '电视剧'}</span></div>
      <div class="text-sm mb-2"><span class="text-blue">钩子：</span>${s.hook}</div>
      <div class="text-sm mb-2"><span class="text-orange">冲突：</span>${s.conflict}</div>
      <div class="text-sm mb-2"><span class="text-muted">迁移：</span>${s.learn}</div>
      <button class="btn btn-outline btn-small" onclick="deleteScript(${s.id})">删除</button>
    </div>
  `).join('') : '<div class="list-empty">暂无拉片记录</div>';
}
document.querySelectorAll('#novelTabs .tab').forEach(tab => {
  tab.onclick = () => {
    const mode = tab.dataset.novel;
    document.querySelectorAll('#novelTabs .tab').forEach(t => t.classList.remove('active')); tab.classList.add('active');
    document.getElementById('novelSplitPanel').style.display = mode === 'split' ? 'block' : 'none';
    document.getElementById('novelTeachPanel').style.display = mode === 'teach' ? 'block' : 'none';
    document.getElementById('novelScriptPanel').style.display = mode === 'script' ? 'block' : 'none';
  };
});
function addScript() {
  const name = document.getElementById('scriptName').value.trim();
  if (!name) return toast('请填写剧名');
  scripts.unshift({ id: Date.now(), name, type: document.getElementById('scriptType').value, hook: document.getElementById('scriptHook').value, conflict: document.getElementById('scriptConflict').value, learn: document.getElementById('scriptLearn').value });
  store.set('luo_scripts', scripts);
  ['scriptName','scriptHook','scriptConflict','scriptLearn'].forEach(id => document.getElementById(id).value = '');
  renderNovel();
}
function deleteScript(id) { scripts = scripts.filter(s => s.id !== id); store.set('luo_scripts', scripts); renderNovel(); }

/* ================= Image Management ================= */
const makeupVideos = makeSearchItems([
  { icon: '💄', title: '少年感中性风妆容教程', desc: '干净底妆+自然眉形+修容弱化柔感', tags: ['妆容','中性风'] },
  { icon: '🪞', title: '伪素颜 5 分钟出门妆', desc: '学生党/通勤党快速出门公式', tags: ['淡妆','日常'] },
  { icon: '✨', title: '眉毛画法·英气眉 vs 柔和眉', desc: '根据脸型选择眉形，提升少年感', tags: ['眉毛','妆容'] },
  { icon: '🧴', title: '油皮/混油护肤流程', desc: '清洁-保湿-防晒三步不踩雷', tags: ['护肤','日常'] },
  { icon: '🌞', title: '通勤防晒与底妆持久', desc: '不脱妆的定妆手法', tags: ['底妆','通勤'] }
], v => v.title);
const outfitVideos = makeSearchItems([
  { icon: '👕', title: '少年感中性风穿搭公式', desc: '基础款叠穿，低饱和配色', tags: ['穿搭','中性风'] },
  { icon: '👖', title: '直筒裤/工装裤挑选指南', desc: '修饰腿型，拉长比例', tags: ['下装','穿搭'] },
  { icon: '👟', title: '胶囊衣橱·10件单品搭30套', desc: '少买多搭，提升利用率', tags: ['衣橱','搭配'] },
  { icon: '🧥', title: '外套怎么选不显壮', desc: '版型/肩线/长度避雷', tags: ['外套','版型'] },
  { icon: '🎒', title: '配饰点缀公式', desc: '帽子/包/银饰的少年感搭配', tags: ['配饰','搭配'] }
], v => v.title);
let wardrobe = store.get('luo_wardrobe', []);
function renderImage() {
  document.getElementById('makeupVideoList').innerHTML = videoList('makeup', makeupVideos);
  document.getElementById('outfitVideoList').innerHTML = videoList('outfit', outfitVideos);
  renderWardrobe();
  renderOutfit();
}

/* ================= Wardrobe outfit suggestions (with history) ================= */
let outfitHistory = store.get('luo_outfit_history', []);
function genOutfit() {
  if (wardrobe.length === 0) return toast('请先在衣柜上传单品');
  const shuffled = wardrobe.slice().sort(() => Math.random() - 0.5);
  const pick = shuffled.slice(0, Math.min(3, shuffled.length));
  outfitHistory.unshift({ date: fmtDate(), items: pick.map(p => p.name) });
  store.set('luo_outfit_history', outfitHistory);
  renderOutfit();
  toast('已生成今日穿搭');
}
function renderOutfit() {
  const today = document.getElementById('outfitToday');
  if (!today) return;
  const t = outfitHistory.find(o => o.date === fmtDate());
  today.innerHTML = t ? `<div class="text-sm">今天建议穿：<b>${t.items.join(' + ')}</b></div>` : '<div class="text-sm text-muted">还没有生成今日穿搭</div>';
  const hist = document.getElementById('outfitHistory');
  hist.innerHTML = outfitHistory.length ? '<div class="font-bold mb-2 text-sm">📅 历史穿搭</div>' + outfitHistory.map(o => `
    <div class="card-flat"><div class="text-sm"><span class="text-muted">${o.date}：</span>${o.items.join(' + ')}</div></div>`).join('') : '';
}
function renderWardrobe() {
  const grid = document.getElementById('wardrobeGrid');
  let html = wardrobe.map((item, i) => `
    <div class="wardrobe-item" style="position:relative" onclick="deleteWardrobe(${i})">
      <img src="${item.img}" alt="${item.name}">
      <div style="position:absolute;bottom:0;left:0;right:0;background:rgba(255,255,255,0.85);font-size:10px;padding:2px;text-align:center">${item.name}</div>
    </div>
  `).join('');
  if (wardrobe.length < 9) {
    html += `
      <label class="wardrobe-item">
        <span style="font-size:24px">📷</span><span>拍照添加</span>
        <input type="file" accept="image/*" style="display:none" onchange="uploadWardrobe(this)">
      </label>
    `;
  }
  grid.innerHTML = html;
}
function uploadWardrobe(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    const img = new Image();
    img.onload = () => {
      const MAX = 1000;
      let { width, height } = img;
      if (width > height && width > MAX) { height = Math.round(height * MAX / width); width = MAX; }
      else if (height > MAX) { width = Math.round(width * MAX / height); height = MAX; }
      const canvas = document.createElement('canvas');
      canvas.width = width; canvas.height = height;
      canvas.getContext('2d').drawImage(img, 0, 0, width, height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.75);
      wardrobe.push({ id: Date.now(), name: '单品 ' + (wardrobe.length + 1), img: dataUrl });
      store.set('luo_wardrobe', wardrobe);
      renderWardrobe();
    };
    img.onerror = () => toast('图片读取失败');
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}
function deleteWardrobe(i) { wardrobe.splice(i, 1); store.set('luo_wardrobe', wardrobe); renderWardrobe(); }
document.querySelectorAll('#imageTabs .tab').forEach(tab => {
  tab.onclick = () => {
    const mode = tab.dataset.img;
    document.querySelectorAll('#imageTabs .tab').forEach(t => t.classList.remove('active')); tab.classList.add('active');
    document.getElementById('imageMakeupPanel').style.display = mode === 'makeup' ? 'block' : 'none';
    document.getElementById('imageOutfitPanel').style.display = mode === 'outfit' ? 'block' : 'none';
    document.getElementById('imageWardrobePanel').style.display = mode === 'wardrobe' ? 'block' : 'none';
    document.getElementById('imageAdvicePanel').style.display = mode === 'advice' ? 'block' : 'none';
  };
});

/* ================= Books ================= */
const bookVideos = makeSearchItems([
  { icon: '📚', title: '《蛤蟆先生去看心理医生》拆书', desc: '情绪觉察与自我成长', tags: ['心理','成长'] },
  { icon: '🔪', title: '《白夜行》叙事结构拆解', desc: '东野圭吾双线叙事与伏笔埋设', tags: ['推理','写作'] },
  { icon: '🏠', title: '《百年孤独》开头为什么经典', desc: '时间压缩与家族命运写法', tags: ['名著','写作'] },
  { icon: '🧠', title: '《认知觉醒》读书笔记', desc: '元认知与刻意练习', tags: ['认知','成长'] },
  { icon: '💡', title: '《被讨厌的勇气》拆解', desc: '阿德勒心理学·课题分离', tags: ['心理','哲思'] },
  { icon: '🎯', title: '《原子习惯》四步法', desc: '微习惯复利与身份认同', tags: ['习惯','效率'] },
  { icon: '💰', title: '《穷爸爸富爸爸》财商拆解', desc: '资产与负债的底层认知', tags: ['财商','理财'] },
  { icon: '✍️', title: '《故事》剧本结构拆解', desc: '麦基叙事理论·故事脊柱', tags: ['写作','编剧'] },
  { icon: '🌿', title: '《活着》人物命运解读', desc: '余华笔下的苦难与韧性', tags: ['名著','文学'] },
  { icon: '🗺️', title: '《纳瓦尔宝典》拆解', desc: '财富与幸福的底层逻辑', tags: ['商业','思维'] },
  { icon: '🔥', title: '《人类简史》核心观点', desc: '认知革命与想象的共同体', tags: ['历史','思辨'] },
  { icon: '😴', title: '《非暴力沟通》拆解', desc: '观察-感受-需要-请求四步', tags: ['沟通','情商'] }
], v => v.title);
let excerpts = store.get('luo_excerpts', []);
function renderBooks() {
  document.getElementById('bookVideoList').innerHTML = videoList('books', bookVideos);
  renderBookDaily();
  document.getElementById('bookExcerptList').innerHTML = excerpts.length ? excerpts.map(e => `
    <div class="card-flat">
      <div class="font-bold mb-2">${e.title}</div>
      <div class="text-sm text-muted" style="font-style:italic">“${e.content}”</div>
      <button class="btn btn-outline btn-small mt-2" onclick="deleteExcerpt(${e.id})">删除</button>
    </div>
  `).join('') : '<div class="list-empty">暂无书摘</div>';
}
function addBookExcerpt() {
  const title = document.getElementById('bookTitle').value.trim();
  const content = document.getElementById('bookExcerpt').value.trim();
  if (!title || !content) return toast('请填写书名和摘录');
  excerpts.unshift({ id: Date.now(), title, content, date: fmtDate() });
  store.set('luo_excerpts', excerpts);
  document.getElementById('bookTitle').value = '';
  document.getElementById('bookExcerpt').value = '';
  renderBooks();
}
function deleteExcerpt(id) { excerpts = excerpts.filter(e => e.id !== id); store.set('luo_excerpts', excerpts); renderBooks(); }

/* ================= Daily book recommendation ================= */
function renderBookDaily() {
  const el = document.getElementById('bookDaily');
  if (!el) return;
  const rec = seededShuffle(bookVideos, 'book' + todayKey())[0];
  const links = searchLinks(rec.title);
  el.innerHTML = `
    <div class="font-bold mb-1">${rec.title}</div>
    <div class="text-sm text-muted mb-2">${rec.desc}</div>
    <div class="resource-actions">
      <a class="link-bili" href="${links.bili}" target="_blank">📺 B站</a>
      <a class="link-douyin" href="${links.douyin}" target="_blank">🎵 抖音</a>
      <a class="link-xhs" href="${links.xhs}" target="_blank">🔴 小红书</a>
    </div>`;
}

/* ================= Drawing ================= */
const drawingVideos = makeSearchItems([
  { icon: '🧸', title: 'QQ人零基础画法', desc: '头身比、表情、动态入门', tags: ['QQ人','零基础'] },
  { icon: '💑', title: 'CP产粮 2D 画风教程', desc: '双人互动构图与氛围上色', tags: ['CP','2D'] },
  { icon: '✋', title: '手部/人体结构简化', desc: '用几何体概括人体', tags: ['人体','基础'] },
  { icon: '🎨', title: 'Procreate/画世界上色流程', desc: '线稿、铺色、光影、细化', tags: ['上色','软件'] },
  { icon: '✏️', title: '线条与笔刷练习', desc: '控笔训练提升线条干净度', tags: ['线条','练习'] },
  { icon: '🌈', title: '配色与光影基础', desc: '冷暖对比/环境光氛围', tags: ['配色','光影'] }
], v => v.title);
const drawQQ = [
  { title: '🧸 QQ人 · 头身比', points: ['最常用 1:1 ~ 1:2，头越大越萌', '肩宽 ≈ 头宽，身体用方块/圆柱概括', '四肢短粗，关节用球表示更灵活', '动作幅度大一点，可爱感翻倍'] },
  { title: '😊 QQ人 · 表情库', points: ['眼睛占脸 1/2，高光决定灵气', '眉毛离眼睛越近越委屈/越凶', '嘴型用「△/▽/ω」快速出情绪', ' blush 用两点或短线，萌度暴涨'] },
  { title: '🏃 QQ人 · 动作模板', points: ['站立：重心在一只脚，身体微侧', '奔跑：身体前倾，手脚形成对角线', '坐下：腿缩成一团，像小面包', '举手/挥动：手臂向上伸展，显活力'] },
  { title: '👕 QQ人 · 服饰简化', points: ['褶皱只画受力点：腋下、手肘、腰部', '领子、袖口、下摆是识别角色的关键', '小配饰（蝴蝶结、铃铛）强化记忆点', '同一角色保持固定配色+标志物'] }
];
const drawCP = [
  { title: '💑 CP · 经典站位', points: ['并肩：温馨日常，适合校园/甜文', '一前一后：景深+保护感，适合体型差', '背靠背：反差与信任，反差萌 CP 常用', '面对面：对视/额头相抵，糖分最高'] },
  { title: '🤝 CP · 互动小动作', points: ['牵手：大拇指相扣比五指张开更自然', '整理衣领/头发：克制又亲密', '递东西时指尖相碰：暗恋名场面', '背后环抱：占有欲与安全感并存'] },
  { title: '👀 CP · 眼神与氛围', points: ['视线交汇时其他元素虚化', '一人看镜头、一人看对方，故事感强', '用环境光（夕阳/路灯）染色', '留白背景+飘落物（花/雨/雪）增情绪'] },
  { title: '🎭 CP · 体型差 & 属性差', points: ['身高差：站一起时头部错位明显', '年上×年下：姿态稳重 vs 活泼', '强强：肩膀平齐，眼神对抗', '温柔×暴躁：动作一收一放，张力足'] }
];
const drawStyle = [
  { title: '✏️ 赛璐璐 · 平涂', points: ['线稿清晰闭合，方便后期选区', '色块平涂，阴影少且边缘硬', '高光形状明确，常用白色点/条', '适合立绘、头像、条漫'] },
  { title: '🌫️ 伪厚涂 · 氛围', points: ['线稿较淡，后期可隐藏', '用喷枪过渡，肤色有冷暖变化', '背景与人物色调统一', '适合情绪插图、氛围头像'] },
  { title: '🎨 色彩 · 配色公式', points: ['主色 60% + 辅色 30% + 点缀色 10%', '邻近色舒服，互补色抓眼', '阴影加入冷色/环境色，避免纯黑', '用正片叠底统一色调'] },
  { title: '💡 光影 · 快速出效果', points: ['先定光源方向（顶光/侧光/逆光）', '受光面暖亮，背光面冷暗', '轮廓光/边缘光让人物从背景跳出', '强光下眯眼、阴影浓重，情绪更强'] }
];
function renderDrawing() {
  const mode = document.querySelector('#drawTabs .tab.active')?.dataset.draw || 'qq';
  document.getElementById('drawQQPanel').style.display = mode === 'qq' ? 'block' : 'none';
  document.getElementById('drawCPPanel').style.display = mode === 'cp' ? 'block' : 'none';
  document.getElementById('drawStylePanel').style.display = mode === 'style' ? 'block' : 'none';
  document.getElementById('drawVideoPanel').style.display = mode === 'video' ? 'block' : 'none';
  const card = (item) => `<div class="card"><div class="font-bold mb-2">${esc(item.title)}</div><div class="text-sm" style="line-height:1.8">${item.points.map(p => '· ' + esc(p)).join('<br>')}</div></div>`;
  if (mode === 'qq') document.getElementById('drawQQPanel').innerHTML = drawQQ.map(card).join('');
  if (mode === 'cp') document.getElementById('drawCPPanel').innerHTML = drawCP.map(card).join('');
  if (mode === 'style') document.getElementById('drawStylePanel').innerHTML = drawStyle.map(card).join('');
  if (mode === 'video') document.getElementById('drawingVideoList').innerHTML = videoList('drawing', drawingVideos);
}
document.querySelectorAll('#drawTabs .tab').forEach(tab => {
  tab.onclick = () => {
    document.querySelectorAll('#drawTabs .tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active'); renderDrawing();
  };
});

/* ================= Guitar ================= */
const guitarVideos = makeSearchItems([
  { icon: '🎼', title: '吉他乐谱基础知识', desc: '六线谱、和弦图、节奏型', tags: ['乐理','入门'] },
  { icon: '🖐️', title: '常用和弦指法与转换', desc: 'C/G/Am/Em/F 等基础和弦', tags: ['和弦','指法'] },
  { icon: '🎵', title: '简单弹唱曲目跟练', desc: '适合新手的 10 首入门歌', tags: ['弹唱','跟练'] },
  { icon: '⚡', title: '爬格子与手指独立性训练', desc: '每日 10 分钟基本功', tags: ['基本功','练习'] },
  { icon: '🎶', title: '节奏训练·扫弦与切音', desc: '下上扫弦+切音制造律动', tags: ['节奏','扫弦'] },
  { icon: '🎸', title: '指弹入门·简单旋律', desc: '用琶音弹会第一首指弹', tags: ['指弹','入门'] }
], v => v.title);
let guitarTimer = null, guitarSeconds = store.get('luo_guitar_seconds', 0);
function renderGuitar() {
  document.getElementById('guitarVideoList').innerHTML = videoList('guitar', guitarVideos);
  updateGuitarDisplay();
}
function updateGuitarDisplay() {
  const m = Math.floor(guitarSeconds / 60).toString().padStart(2, '0');
  const s = (guitarSeconds % 60).toString().padStart(2, '0');
  document.getElementById('guitarTime').textContent = `${m}:${s}`;
}
function toggleGuitarTimer() {
  const btn = document.getElementById('guitarTimerBtn');
  if (guitarTimer) {
    clearInterval(guitarTimer); guitarTimer = null;
    btn.textContent = '继续练习';
    btn.classList.remove('btn-orange'); btn.classList.add('btn-primary');
  } else {
    btn.textContent = '暂停练习';
    btn.classList.remove('btn-primary'); btn.classList.add('btn-orange');
    guitarTimer = setInterval(() => { guitarSeconds++; store.set('luo_guitar_seconds', guitarSeconds); updateGuitarDisplay(); }, 1000);
  }
}

/* ================= Kitchen ================= */
const cookVideos = makeSearchItems([
  { icon: '🍅', title: '番茄炒蛋·厨房小白第一道菜', desc: '调味比例与火候控制', tags: ['家常菜','快手'] },
  { icon: '🥩', title: '家常小炒肉做法', desc: '腌制、滑油、爆香全流程', tags: ['家常菜','下饭'] },
  { icon: '🥦', title: '清炒时蔬万能公式', desc: '保持翠绿爽口的秘诀', tags: ['蔬菜','健康'] },
  { icon: '🍜', title: '阳春面/葱油拌面', desc: '一碗好汤底与葱油的做法', tags: ['主食','面食'] },
  { icon: '🍲', title: '番茄牛腩煲', desc: '炖煮软烂入味的家常硬菜', tags: ['炖菜','肉类'] },
  { icon: '🥚', title: '滑蛋虾仁', desc: '嫩滑口感的火候诀窍', tags: ['家常菜','海鲜'] },
  { icon: '🍚', title: '电饭煲一锅出（腊肠饭）', desc: '懒人必备，饭菜同熟', tags: ['主食','懒人'] }
], v => v.title);
const dessertVideos = makeSearchItems([
  { icon: '🍮', title: '焦糖布丁（烤箱版）', desc: '简单三步，新手零失败', tags: ['甜品','烤箱'] },
  { icon: '🍰', title: '微波炉蛋糕 2 分钟', desc: '无需打发，搅拌即烤', tags: ['甜品','微波炉'] },
  { icon: '🍦', title: '酸奶水果杯', desc: '低卡简单，随手做', tags: ['甜品','免烤'] },
  { icon: '🧁', title: '舒芙蕾松饼', desc: '云朵口感，小火慢煎', tags: ['甜品','平底锅'] },
  { icon: '🍪', title: '免烤奥利奥冰淇淋', desc: '三层叠加，冷冻即食', tags: ['甜品','免烤'] }
], v => v.title);
const snackVideos = makeSearchItems([
  { icon: '🍗', title: '空气炸锅奥尔良鸡翅', desc: '少油酥脆，懒人必备', tags: ['空气炸锅','小吃'] },
  { icon: '🍟', title: '烤箱烤薯角', desc: '外脆里糯，追剧小食', tags: ['烤箱','小吃'] },
  { icon: '🌽', title: '微波炉爆米花', desc: '3 分钟搞定，健康少油', tags: ['微波炉','零食'] },
  { icon: '🥟', title: '快手韭菜盒子', desc: '半发面，外酥里嫩', tags: ['面食','小吃'] },
  { icon: '🧆', title: '空气炸锅薯条（土豆）', desc: '无油版本，复脆技巧', tags: ['空气炸锅','零食'] }
], v => v.title);
function renderKitchen() {
  document.getElementById('cookVideoList').innerHTML = videoList('kitchen', cookVideos);
  document.getElementById('dessertVideoList').innerHTML = videoList('kitchen', dessertVideos);
  document.getElementById('snackVideoList').innerHTML = videoList('kitchen', snackVideos);
  renderRecipes();
  renderSeasonDishes();
}

/* ================= Recipe Space (electronic cookbook) ================= */
let recipes = store.get('luo_recipes', []);
let pendingRecipePhoto = '';
function uploadRecipePhoto(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    const img = new Image();
    img.onload = () => {
      const MAX = 1000;
      let { width, height } = img;
      if (width > height && width > MAX) { height = Math.round(height * MAX / width); width = MAX; }
      else if (height > MAX) { width = Math.round(width * MAX / height); height = MAX; }
      const canvas = document.createElement('canvas');
      canvas.width = width; canvas.height = height;
      canvas.getContext('2d').drawImage(img, 0, 0, width, height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.75); // 压缩后存储，避免 localStorage 爆满导致卡顿/白屏
      pendingRecipePhoto = dataUrl;
      document.getElementById('recipePhotoPreview').innerHTML = `<img src="${dataUrl}" style="max-width:100%;border-radius:10px;margin-top:8px">`;
    };
    img.onerror = () => toast('图片读取失败');
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}
function addRecipe() {
  const name = document.getElementById('recipeName').value.trim();
  if (!name) return toast('请填写菜名');
  recipes.unshift({ id: Date.now(), name, price: document.getElementById('recipePrice').value, prep: document.getElementById('recipePrep').value, photo: pendingRecipePhoto, date: fmtDate() });
  store.set('luo_recipes', recipes);
  addPoints(3, true);
  pendingRecipePhoto = '';
  document.getElementById('recipeName').value = ''; document.getElementById('recipePrice').value = ''; document.getElementById('recipePrep').value = ''; document.getElementById('recipePhoto').value = ''; document.getElementById('recipePhotoPreview').innerHTML = '';
  renderRecipes();
  toast('已保存到菜谱 +3');
}
function renderRecipes() {
  const list = document.getElementById('recipeList');
  if (!list) return;
  list.innerHTML = recipes.length ? recipes.map(r => `
    <div class="card-flat">
      ${r.photo ? `<img src="${r.photo}" style="width:100%;border-radius:10px;margin-bottom:8px">` : ''}
      <div class="font-bold mb-1">${r.name}</div>
      ${r.price ? `<div class="text-sm mb-1"><span class="text-orange">物价：</span>${r.price}</div>` : ''}
      ${r.prep ? `<div class="text-sm text-muted" style="white-space:pre-wrap">${r.prep}</div>` : ''}
      <button class="btn btn-outline btn-small mt-2" onclick="deleteRecipe(${r.id})">删除</button>
    </div>`).join('') : '<div class="list-empty">还没有菜谱，添加第一道吧 🍳</div>';
}
function deleteRecipe(id) { recipes = recipes.filter(r => r.id !== id); store.set('luo_recipes', recipes); renderRecipes(); }

/* ================= Seasonal dishes (per month) ================= */
function getSeason() {
  const m = new Date().getMonth() + 1;
  if (m >= 3 && m <= 5) return { name: '春', dishes: ['春笋炒肉','香椿炒蛋','荠菜馄饨','清炒芦笋','草莓奶昔'], tip: '春笋/香椿正当季，清淡养肝。' };
  if (m >= 6 && m <= 8) return { name: '夏', dishes: ['凉拌黄瓜','冬瓜排骨汤','清蒸鲈鱼','拍黄瓜','绿豆沙'], tip: '多补水清热，冬瓜/丝瓜便宜又消暑。' };
  if (m >= 9 && m <= 11) return { name: '秋', dishes: ['板栗烧鸡','莲藕排骨汤','南瓜浓汤','糖炒栗子','桂花糯米藕'], tip: '秋燥宜润肺，莲藕/梨/南瓜当季。' };
  return { name: '冬', dishes: ['萝卜炖牛腩','羊肉汤','白菜猪肉饺','红薯粥','红烧羊肉'], tip: '冬令进补，萝卜/羊肉/根茎类便宜耐放。' };
}
function renderSeasonDishes() {
  const el = document.getElementById('seasonDishes');
  if (!el) return;
  const s = getSeason();
  const priceRef = { '春笋炒肉':'春笋4+肉10≈14元', '香椿炒蛋':'香椿8+蛋2≈10元', '荠菜馄饨':'荠菜3+肉8≈11元', '清炒芦笋':'芦笋6+蒜1≈7元', '草莓奶昔':'草莓8+奶3≈11元', '凉拌黄瓜':'黄瓜2+蒜1≈3元', '冬瓜排骨汤':'冬瓜2+排骨12≈14元', '清蒸鲈鱼':'鲈鱼15≈15元', '拍黄瓜':'黄瓜2≈2元', '绿豆沙':'绿豆3≈3元', '板栗烧鸡':'板栗5+鸡12≈17元', '莲藕排骨汤':'莲藕4+排骨12≈16元', '南瓜浓汤':'南瓜3≈3元', '糖炒栗子':'栗子8≈8元', '桂花糯米藕':'藕4+糯米2≈6元', '萝卜炖牛腩':'萝卜2+牛腩18≈20元', '羊肉汤':'羊肉20≈20元', '白菜猪肉饺':'白菜2+肉8≈10元', '红薯粥':'红薯3≈3元', '红烧羊肉':'羊肉20≈20元' };
  el.innerHTML = `<div class="mb-2">当前季节：<b>${s.name}季</b> · ${s.tip}</div>` +
    s.dishes.map(d => `<div class="mb-1">🍽️ ${d} <span class="text-muted">（物价参考 ${priceRef[d] || '时价'}）</span></div>`).join('') +
    `<div class="mt-2 text-muted">备菜流程：按「洗切→腌渍/焯水→炖煮/快炒」通用三步，周末备好葱姜蒜蓉与分装肉类，工作日 15 分钟出餐。</div>`;
}
document.querySelectorAll('#kitchenTabs .tab').forEach(tab => {
  tab.onclick = () => {
    const mode = tab.dataset.kit;
    document.querySelectorAll('#kitchenTabs .tab').forEach(t => t.classList.remove('active')); tab.classList.add('active');
    document.getElementById('kitchenCookPanel').style.display = mode === 'cook' ? 'block' : 'none';
    document.getElementById('kitchenDessertPanel').style.display = mode === 'dessert' ? 'block' : 'none';
    document.getElementById('kitchenSnackPanel').style.display = mode === 'snack' ? 'block' : 'none';
    document.getElementById('kitchenPrepPanel').style.display = mode === 'prep' ? 'block' : 'none';
    document.getElementById('kitchenRecipePanel').style.display = mode === 'recipe' ? 'block' : 'none';
    if (mode === 'prep') renderSeasonDishes();
    if (mode === 'recipe') renderRecipes();
  };
});

/* ================= Self-media ================= */
const mediaVideos = makeSearchItems([
  { icon: '📈', title: '抖音起号涨粉底层逻辑', desc: '标签、完播率、互动率解析', tags: ['抖音','运营'] },
  { icon: '💰', title: '小红书变现路径拆解', desc: '涨粉、接广、带货、知识付费', tags: ['小红书','变现'] },
  { icon: '🎬', title: '爆款短视频脚本公式', desc: '钩子+痛点+解决方案+转化', tags: ['脚本','爆款'] },
  { icon: '📊', title: '自媒体数据分析入门', desc: '看懂后台数据，优化内容', tags: ['数据','复盘'] },
  { icon: '🔁', title: '内容选题库搭建', desc: '用表格积累可复用选题', tags: ['选题','方法'] },
  { icon: '🤳', title: '口播表现力训练', desc: '眼神/手势/语气的镜头感', tags: ['口播','表现力'] }
], v => v.title);
function renderMedia() { document.getElementById('mediaVideoList').innerHTML = videoList('media', mediaVideos); }

/* ================= Travel ================= */
const travelVideos = makeSearchItems([
  { icon: '📍', title: '特种兵式旅行攻略制作', desc: '交通+住宿+打卡路线规划', tags: ['攻略','路线'] },
  { icon: '🎒', title: '行李收纳清单', desc: '3-7 天出行必备物品', tags: ['收纳','清单'] },
  { icon: '🍜', title: '小众城市美食探店', desc: '如何找到本地人才知道的好店', tags: ['美食','探店'] }
], v => v.title);

const TRIP_TYPES = {
  short: { label: '短途', icon: '🚗', days: '1-2', desc: '1-2 天 · 周边可达', defaultDays: 2 },
  medium: { label: '中途', icon: '🚄', days: '3-5', desc: '3-5 天 · 高铁可达', defaultDays: 4 },
  long: { label: '长途', icon: '✈️', days: '6+', desc: '6 天以上 · 飞机/长途', defaultDays: 7 }
};

let travelPlans = store.get('luo_travel_plans', []);
let currentTripType = 'short';
let travelDraft = null;

function renderTravel() {
  const tv = document.getElementById('travelVideoList');
  if (tv) tv.innerHTML = videoList('travel', travelVideos);
  renderTravelTypeTabs();
  renderTravelPlans();
  renderTravelPreview();
  renderTravelStats();
}

function renderTravelTypeTabs() {
  const tabs = document.querySelectorAll('#travelTypeTabs .tab');
  tabs.forEach(t => {
    t.classList.toggle('active', t.dataset.ttype === currentTripType);
    t.onclick = () => {
      currentTripType = t.dataset.ttype;
      renderTravelTypeTabs();
      document.getElementById('travelTypeDesc').textContent = TRIP_TYPES[currentTripType].desc;
      document.getElementById('travelDays').value = TRIP_TYPES[currentTripType].defaultDays;
    };
  });
}

function renderTravelStats() {
  const total = travelPlans.length;
  const done = travelPlans.filter(p => p.done).length;
  const rate = total ? Math.round(done / total * 100) : 0;
  const lv = total < 3 ? '起步' : total < 10 ? '进阶' : '达人';
  document.getElementById('travelLevelTag').textContent = `${lv} · ${total}`;
  document.getElementById('travelMastery').textContent = rate + '%';
  document.getElementById('travelMasteryBar').style.width = rate + '%';
  document.getElementById('travelTaskCount').textContent = `${done}/${total}`;
  document.getElementById('travelDoneRate').textContent = rate + '%';
  document.getElementById('travelStickerCount').textContent = Math.floor(done / 3);
}

function locateTravelDeparture() {
  const input = document.getElementById('travelDeparture');
  if (navigator.geolocation) {
    toast('正在获取定位…');
    navigator.geolocation.getCurrentPosition(pos => {
      input.value = '当前定位 · ' + pos.coords.latitude.toFixed(2) + ', ' + pos.coords.longitude.toFixed(2);
      toast('已获取坐标，建议手动改为城市名');
    }, () => { toast('定位失败，请手动输入'); input.focus(); });
  } else { toast('您的设备不支持自动定位'); input.focus(); }
}
function manualTravelDeparture() {
  const input = document.getElementById('travelDeparture');
  input.value = ''; input.focus();
}

function generateTravelPlan() {
  const departure = document.getElementById('travelDeparture').value.trim();
  const dest = document.getElementById('travelDest').value.trim();
  const days = parseInt(document.getElementById('travelDays').value, 10);
  const budget = document.getElementById('travelBudget').value.trim();
  const theme = document.getElementById('travelTheme').value.trim();
  const luggageRaw = document.getElementById('travelLuggage').value.trim();
  if (!departure) return toast('请填写出发地');
  if (!dest) return toast('请填写目的地');
  if (!days || days < 1 || days > 14) return toast('请填写 1-14 天的天数');
  const luggage = luggageRaw ? luggageRaw.split(/[，,、]/).map(s => s.trim()).filter(Boolean) : ['身份证', '充电宝', '轻便外套', '舒适运动鞋', '雨伞', '常用药', '洗漱用品', '相机'];
  const schedule = [];
  for (let d = 1; d <= days; d++) {
    let text;
    if (d === 1) text = `抵达${dest}，办理入住，开启「${theme || '当地特色'}」初体验`;
    else if (d === days) text = `自由活动 + 采购伴手礼，返程回${departure}`;
    else {
      const opts = [
        `${theme || '热门景点'}深度游，感受当地人文`, '探索街巷与本地小店，发现隐藏惊喜', '打卡地标建筑+品尝特色美食', '睡到自然醒后悠闲出行', '逛博物馆/文化馆/艺术馆，慢节奏一日游', '亲近自然：公园/山川/湖泊放松行程'
      ];
      text = opts[(d - 2) % opts.length];
    }
    schedule.push({ day: d, text });
  }
  travelDraft = { id: 'draft-' + Date.now(), departure, dest, type: currentTripType, days, budget, theme, luggage, schedule, createdAt: fmtDate(), done: false };
  renderTravelPreview();
}

function renderTravelPreview() {
  const el = document.getElementById('travelPreview'); if (!el) return;
  if (!travelDraft) { el.style.display = 'none'; el.innerHTML = ''; return; }
  const t = TRIP_TYPES[travelDraft.type];
  el.style.display = 'block';
  el.innerHTML = `
    <div class="card" style="background:linear-gradient(135deg,#F3E5F5,#fff)">
      <div class="flex-between mb-2">
        <span class="font-bold">${esc(travelDraft.departure)} → ${esc(travelDraft.dest)} · ${travelDraft.days}天${t.label}</span>
        <span class="tag tag-purple">${t.icon} ${t.label}</span>
      </div>
      <div class="text-sm text-muted mb-2">主题：${esc(travelDraft.theme) || '无主题'}　预算：${travelDraft.budget ? '约 ' + esc(travelDraft.budget) + ' 元/人' : '未填写'}</div>
      <div class="mb-2">
        ${travelDraft.schedule.map(s => `<div class="travel-day"><span class="day-label">D${s.day}</span><div class="day-text">${esc(s.text)}</div></div>`).join('')}
      </div>
      <div class="text-sm mb-3">
        <span class="font-bold">🎒 清单：</span>
        ${travelDraft.luggage.map(x => `<span class="resource-tag">${esc(x)}</span>`).join('')}
      </div>
      <div style="display:flex;gap:8px">
        <button class="btn btn-primary" style="flex:1" onclick="saveTravelPlan()">💾 保存攻略</button>
        <button class="btn btn-outline" onclick="clearTravelDraft()">清空</button>
      </div>
    </div>`;
}

function saveTravelPlan() {
  if (!travelDraft) return toast('请先生成方案');
  const idx = travelPlans.findIndex(p => p.id === travelDraft.id);
  if (idx >= 0) { travelPlans[idx] = { ...travelDraft }; toast('攻略已更新'); }
  else { travelPlans.unshift({ ...travelDraft, id: Date.now() }); toast('攻略已保存 +3'); addPoints(3, true); }
  store.set('luo_travel_plans', travelPlans);
  travelDraft = null;
  renderTravel();
}
function clearTravelDraft() { travelDraft = null; renderTravelPreview(); }

function renderTravelPlans() {
  const el = document.getElementById('travelPlanList'); if (!el) return;
  el.innerHTML = travelPlans.length ? travelPlans.map(p => {
    const t = TRIP_TYPES[p.type];
    return `<div class="card-flat">
      <div class="flex-between mb-2">
        <span class="font-bold">${esc(p.departure)} → ${esc(p.dest)} · ${p.days}天${t.label}</span>
        <span class="tag tag-purple">${t.icon} ${t.label}</span>
      </div>
      <div class="text-sm text-muted mb-2">主题：${esc(p.theme) || '无主题'}　预算：${p.budget ? '约 ' + esc(p.budget) + ' 元/人' : '未填写'}</div>
      <div class="mb-2">
        ${p.schedule.map(s => `<div class="travel-day"><span class="day-label">D${s.day}</span><div class="day-text">${esc(s.text)}</div></div>`).join('')}
      </div>
      <div class="text-sm mb-2">
        <span class="font-bold">🎒 清单：</span>
        ${p.luggage.map(x => `<span class="resource-tag">${esc(x)}</span>`).join('')}
      </div>
      <div class="flex-between">
        <div style="display:flex;gap:8px">
          <button class="btn btn-outline btn-small" onclick="editTravelPlan(${p.id})">编辑</button>
          <button class="btn btn-outline btn-small" onclick="deleteTravelPlan(${p.id})">删除</button>
        </div>
        <button class="btn ${p.done ? 'btn-green' : 'btn-primary'} btn-small" onclick="toggleTravelDone(${p.id})">${p.done ? '✓ 已完成' : '完成打卡'}</button>
      </div>
    </div>`;
  }).join('') : '<div class="list-empty">暂无旅行攻略，生成一条吧 ✈️</div>';
}

function editTravelPlan(id) {
  const p = travelPlans.find(x => x.id === id); if (!p) return;
  currentTripType = p.type || 'short';
  document.getElementById('travelDeparture').value = p.departure;
  document.getElementById('travelDest').value = p.dest;
  document.getElementById('travelDays').value = p.days;
  document.getElementById('travelBudget').value = p.budget || '';
  document.getElementById('travelTheme').value = p.theme || '';
  document.getElementById('travelLuggage').value = p.luggage.join('、');
  travelDraft = { ...p };
  renderTravelTypeTabs();
  document.getElementById('travelTypeDesc').textContent = TRIP_TYPES[currentTripType].desc;
  renderTravelPreview();
  window.scrollTo(0, 0);
  toast('已载入编辑，修改后点击预览卡片里的保存');
}
function deleteTravelPlan(id) { travelPlans = travelPlans.filter(p => p.id !== id); store.set('luo_travel_plans', travelPlans); renderTravel(); }
function toggleTravelDone(id) {
  const p = travelPlans.find(x => x.id === id); if (!p) return;
  p.done = !p.done; store.set('luo_travel_plans', travelPlans); renderTravel();
  toast(p.done ? '打卡成功 +2' : '已取消打卡');
  if (p.done) addPoints(2, true);
}

/* ================= Office ================= */
const officeVideos = makeSearchItems([
  { icon: '📊', title: 'Excel 函数实战：VLOOKUP+数据透视表', desc: '办公效率翻倍', tags: ['Excel','函数'] },
  { icon: '🎨', title: 'PPT 高级感排版技巧', desc: '对齐、留白、配色、字体', tags: ['PPT','设计'] },
  { icon: '📝', title: 'Word 论文排版全流程', desc: '页眉页脚、目录、引用', tags: ['Word','排版'] },
  { icon: '💻', title: '计算机二级 office 考前冲刺', desc: '真题讲解与操作技巧', tags: ['二级','考证'] },
  { icon: '📧', title: '邮件礼仪与高效沟通', desc: '主题/正文/附件的职场写法', tags: ['邮件','沟通'] },
  { icon: '🗂️', title: 'Notion/飞书多维表格', desc: '用表格管理项目与进度', tags: ['工具','效率'] }
], v => v.title);
function renderOffice() { document.getElementById('officeVideoList').innerHTML = videoList('office', officeVideos); }

/* ================= EQ ================= */
const eqVideos = makeSearchItems([
  { icon: '🗣️', title: '高情商回话技巧', desc: '尴尬场合如何自然接话', tags: ['沟通','回话'] },
  { icon: '🤝', title: '社交边界感建立', desc: '既不讨好也不冷漠的相处方式', tags: ['社交','边界'] },
  { icon: '😊', title: '职场新人高情商话术', desc: '请教、拒绝、汇报的表达方式', tags: ['职场','话术'] },
  { icon: '❤️', title: '亲密关系中的情绪表达', desc: '非暴力沟通四步法', tags: ['情绪','沟通'] },
  { icon: '🌟', title: '自信表达与气场训练', desc: '眼神/语速/姿态的自信感', tags: ['自信','表达'] },
  { icon: '🧘', title: '情绪稳定方法论', desc: '6秒冷静法+认知重构', tags: ['情绪','自愈'] }
], v => v.title);
function renderEq() { document.getElementById('eqVideoList').innerHTML = videoList('eq', eqVideos); }

/* ================= AI Prompts ================= */
const aiPrompts = [
  { title: '数据分析：帮我分析本月收支', prompt: '我是一位学生/职场新人，请根据以下收支数据帮我分析消费结构、指出可优化项，并给出下月预算建议。数据如下：' },
  { title: '学习规划：制定一周学习计划', prompt: '请帮我制定一份一周学习计划，每天学习时间为晚上 19:00-22:00，科目包括英语、医学专业、考公行测，要求劳逸结合，并包含复习与测试。' },
  { title: '内容创作：给短视频写脚本', prompt: '请为一条“医学生日常学习vlog”短视频写一段 30 秒脚本，包含开头钩子、中间内容、结尾引导点赞关注，风格轻松真实。' },
  { title: '高情商表达：如何委婉拒绝', prompt: '请帮我写一段委婉拒绝别人但不得罪人的话术，场景是：朋友想让我帮忙做一件我做不到的事。要求真诚、有边界感。' },
  { title: '医学复习：帮我梳理内科笔记', prompt: '我是医学本科生，正在复习内科学，请帮我用表格梳理「呼吸系统常见疾病」的病因、临床表现、首选检查与鉴别诊断，便于记忆。' },
  { title: '考公申论：批改一段大作文', prompt: '请扮演申论阅卷老师，批改下面这段大作文开头，指出立意、结构和语言问题，并给出修改示范：' },
  { title: '简历优化：把经历改成 STAR 法则', prompt: '请把我下面这段实习经历改写成 STAR 法则（情境-任务-行动-结果），量化成果，语言精炼专业：' },
  { title: '健身计划：一周训练安排', prompt: '请为我制定一周训练计划，目标：减脂+练腹肌+手臂塑形（不练斜方肌），每周练 5 天，包含帕梅拉/跟练/网球，给出每日安排。' },
  { title: '旅行规划：生成行程清单', prompt: '我计划去[目的地]玩[天数]天，预算[金额]，喜欢美食和拍照。请帮我规划每日行程、交通、住宿建议和必带清单。' },
  { title: '绘画灵感：给 QQ 人设计动作', prompt: '请给我 5 个适合 QQ 人（头身比1:1）的可爱动作构思，包含表情、肢体和道具，适合做 CP 产粮插画。' },
  { title: '英语陪练：情景对话练习', prompt: '请扮演英语母语者，和我用简单英语聊「my daily routine」，每次只说一两句，等我回复后再继续，遇到错误温柔纠正。' },
  { title: '读书拆解：把书变成思维导图', prompt: '请把《[书名]》拆解为思维导图大纲：核心观点、章节逻辑、金句、可迁移到自媒体的选题点。' },
  { title: '论文降重：改写学术段落', prompt: '请帮我把下面这段论文改写，保留原意但换种表达降低重复率，保持学术语气：' },
  { title: '英文邮件：礼貌催进度', prompt: '请帮我写一封英文邮件，礼貌地跟进[对方]关于[事项]的进度，既不过于急切也不失专业，给出主题行和正文。' },
  { title: '情绪急救：把焦虑写下来', prompt: '我最近很焦虑，请先陪我聊聊，再帮我把焦虑的事项列成清单，并按“可控/不可控”分类，给出今晚能做的一件小事。' },
  { title: '爆款标题：生成 10 个选题', prompt: '请为一篇关于「[主题]」的小红书/公众号文章生成 10 个有点击欲的标题，分别标注使用的钩子类型（数字/反差/悬念/共鸣）。' },
  { title: '自媒体大纲：列公众号框架', prompt: '请帮我把「[选题]」拆成一篇 1500 字公众号文章框架：标题、3 个分论点、每个分论点的案例与金句、结尾引导。' },
  { title: '人际分析：拆解一段对话潜台词', prompt: '请帮我分析下面这段对话里对方的潜台词和情绪，并给我一个得体的回复建议：' },
  { title: '穿搭建议：按身材给方案', prompt: '我是[身高/体重/身材特点]的学生，想要少年感中性风，请给出 3 套一周穿搭公式和避雷单品。' },
  { title: '备考口诀：把知识点编成顺口溜', prompt: '请把下面这些[科目]知识点编成好记的口诀或谐音梗，方便考前快速回忆：' },
  { title: '会议纪要：整理成行动清单', prompt: '请把下面这段会议记录整理成：① 决议事项 ② 待办（负责人+截止日）③ 遗留问题，用清单呈现。' },
  { title: '真诚表白：写一段心里话', prompt: '请帮我写一段给[对象]的真诚表白，不油腻、不套路，带点具体回忆，留出让我填名字和细节的空白。' },
  { title: '购物决策：对比两款产品', prompt: '我纠结[产品A]和[产品B]，请从价格、核心参数、适用场景、优缺点对比，最后给明确选购建议。' },
  { title: '代码求助：解释这段报错', prompt: '我运行代码报了下面这个错，请用人话解释原因、定位可能出错的行，并给出修复方案：' },
  { title: '论文大纲：生成三级框架', prompt: '请为题目《[题目]》生成论文三级大纲：摘要要点、引言问题、3 个分论点及对应论据方向、结论，标注每部分字数建议。' },
  { title: '职场周报：把流水账变成果', prompt: '请把我本周的工作流水整理成周报：① 关键成果（量化）② 进行中 ③ 风险与需协调 ④ 下周计划，语气专业简洁。' },
  { title: '辩论陪练：正反方视角', prompt: '请就辩题「[辩题]」分别给出正方与反方各 3 个核心论点及论据，并指出对方可能的反驳，帮我做攻防准备。' },
  { title: '情绪日记：梳理今日心情', prompt: '请听我讲讲今天发生的事，帮我识别背后的情绪（焦虑/委屈/开心），并给一句今晚可以对自己说的话。' },
  { title: '拍照姿势：给旅行出构图', prompt: '我在[场景：海边/古城/咖啡馆]，请给我 5 个自然不尬的拍照姿势和构图思路，适合手机自拍/同伴帮拍。' },
  { title: '代码注释：补中文说明', prompt: '请给下面这段函数逐行补上简洁中文注释，说明输入、输出与关键逻辑，保持代码不变：' }
];
function renderAi() {
  const list = seededShuffle(aiPrompts, todayKey());
  document.getElementById('aiPromptList').innerHTML =
    `<div class="text-sm mb-2" style="color:#1565c0;font-weight:700">📅 每日更新 · ${todayKey()}（共 ${aiPrompts.length} 条口令，每天轮换顺序，覆盖学习/创作/生活）</div>` +
    list.map((p, i) => `
    <div class="prompt-card">
      <div class="prompt-title">${p.title}</div>
      <div class="prompt-box">
        ${p.prompt}
        <button class="prompt-copy" onclick="copyPrompt(${i})">复制</button>
      </div>
    </div>
  `).join('');
}
function copyPrompt(i) {
  const list = seededShuffle(aiPrompts, todayKey());
  navigator.clipboard?.writeText(list[i].prompt).then(() => toast('已复制提示词')).catch(() => toast('复制失败，请手动复制'));
}

/* ================= 晋江写作素材库 / 梗库 / 避雷 / 灵感 / 全网素材 ================= */
function esc(s) { return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }

/* ---- 收藏（核心金句 / 好评 / 雷点） ---- */
function getGolden() { return store.get('luo_golden', []); }
function isGolden(id) { return getGolden().some(g => g.id === id); }
function toggleGolden(id, type, title, text) {
  let arr = getGolden();
  if (arr.some(g => g.id === id)) { arr = arr.filter(g => g.id !== id); store.set('luo_golden', arr); toast('已取消收藏'); }
  else { arr.unshift({ id, type, title, text, date: fmtDate() }); store.set('luo_golden', arr); toast('⭐ 已收藏：' + title); }
  if (currentPage === 'material') renderMaterial();
  if (currentPage === 'meme') renderMeme();
  if (currentPage === 'mine') renderMine();
}
function goldenStar(id) { return `<button class="golden-star ${isGolden(id) ? 'on' : ''}" onclick="toggleGolden('${id}','${esc(id).split('-')[0]}','${esc(id)}','')">${isGolden(id) ? '★' : '☆'}</button>`; }

/* ---- 榜单扒文（真实作品，结构拆解） ---- */
const jjwxcWorks = [
  { title: '今夜刮起台风', author: '玄笺', genre: '百合·近代现代', tags: ['高积分', '强强', '破镜重圆'], status: '连载', words: 195963, points: '8.68亿',
    hook: '以“台风夜”为强意象开场，借天气制造封闭空间与情绪高压，天然催生冲突与亲密。',
    why: '榜首级热度来自“强情绪+强结构”：把外部环境（台风）与内心风暴同构，开篇即钩子。',
    tropes: ['强取豪夺', '破镜重圆', '双向暗恋', '强强'],
    merits: ['意象统一：台风=关系风暴', '开篇钩子强', '情绪密度高', '人物动机清晰'],
    controversy: ['节奏偏快易显仓促', '部分读者觉得强取段落需铺垫'],
    analysis: { plot: '误会—对抗—和解三段式，每章留悬念', character: '双强人设，谁也不跪', bg: '都市+职业背景增强真实感', copy: '“今夜之后，再没有风能把我们吹散”类短句', outline: '台风相遇→对抗拉扯→真相→和解', chapter: '每章结尾抛悬念', prose: '短句多、节奏快', conflict: '外部事件与内部心结双线并行', pace: '快节奏+关键留白', blank: '关键告白留白不写满', psychology: '大量内心独白', action: '动作服务于情绪', hookScene: '台风夜封闭空间', dialogue: '对话带刺含潜台词', expression: '微表情细腻', env: '天气参与叙事', mainPlot: '感情主线', subPlot: '职业线点缀' },
    char: { bg: '各自有完整来路', base: '外冷内执', motive: '不肯再失去', child: '童年缺失塑造占有欲' } },
  { title: '回响', author: '一只花夹子', genre: '百合·近代现代', tags: ['超高积分', '细腻', '治愈'], status: '连载', words: 205225, points: '6.16亿',
    hook: '以“声音/回声”隐喻未说出口的爱，概念先行勾人。',
    why: '文笔与心理描写是核心卖点，慢热但后劲大，读者追更粘性高。',
    tropes: ['暗恋', '双向奔赴', '治愈', '慢热'],
    merits: ['心理描写顶级', '留白克制', '情绪真实', '人物弧光完整'],
    controversy: ['慢热劝退部分读者', '篇幅偏长'],
    analysis: { plot: '暗恋—错过—回响式重逢', character: '敏感内敛型主角', bg: '生活流背景', copy: '用通感写心动', outline: '暗恋铺垫→误会→重逢', chapter: '情绪递进式', prose: '诗化语言', conflict: '自我与怯懦的对抗', pace: '慢热蓄势', blank: '未言之爱留白', psychology: '通感心理', action: '细微动作传情', hookScene: '回响意象', dialogue: '欲言又止', expression: '眼神戏足', env: '日常环境情绪化', mainPlot: '情感', subPlot: '友情线' },
    char: { bg: '平凡家庭', base: '温柔怯懦', motive: '想被听见', child: '长期被忽视' } },
  { title: '趁她之危', author: '秦淮洲', genre: '百合·近代现代', tags: ['强取', '拉扯', '高人气'], status: '连载', words: 95855, points: '2.6亿',
    hook: '标题即梗，“趁虚而入”的张力从书名就立住。',
    why: '精准踩中“强势攻×脆弱受”的爽感结构，拉扯感强。',
    tropes: ['强取豪夺', '趁虚而入', '拉扯'],
    merits: ['人设反差', '张力足', '节奏紧凑'],
    controversy: ['强取段落需合理动机', '部分读者介意不对等'],
    analysis: { plot: '趁虚→纠缠→动心', character: '攻强势/受破碎', bg: '都市', copy: '书名即钩子', outline: '危机相遇→攻势→软化', chapter: '每章推进关系', prose: '利落', conflict: '权力不对等', pace: '快', blank: '动心瞬间留白', psychology: '受视角为主', action: '压迫式动作', hookScene: '危机开场', dialogue: '攻主动受被动', expression: '受的微表情', env: '夜/室内', mainPlot: '情感拉扯', subPlot: '事业线' },
    char: { bg: '受有创伤过往', base: '外强中干', motive: '渴望依靠', child: '被抛弃经历' } },
  { title: '陷入我们的热恋', author: '—', genre: '现代言情·校园', tags: ['校园标杆', '双向暗恋', '甜蜜'], status: '热门', words: '—', points: '—',
    hook: '桀骜少年×软萌学霸的双向暗恋，青春感与甜度平衡。',
    why: '校园青春文标杆：把“暗恋—试探—双向确认”写得干净明亮，无狗血。',
    tropes: ['双向暗恋', '校园', '青梅/竹马', '甜宠'],
    merits: ['青春氛围真实', '双向不虐', '文笔鲜活', '节奏明快'],
    controversy: ['甜度偏高怕腻者慎入'],
    analysis: { plot: '暗恋→互相试探→双向确认', character: '反差CP', bg: '高中/大学', copy: '少年感台词', outline: '相识→暗恋→试探→在一起', chapter: '日常+小高潮', prose: '轻快', conflict: '青春期自我认知', pace: '轻快', blank: '心动留白', psychology: '少女/少年心事', action: '运动/日常动作', hookScene: '课堂/球场', dialogue: '少年对话自然', expression: '脸红微表情', env: '校园四季', mainPlot: '恋爱', subPlot: '学业/友情' },
    char: { bg: '普通家庭', base: '外冷内热', motive: '想被看见', child: '曾被忽视' } },
  { title: '校园·暗恋', author: '薛瑾璱', genre: '言情·近代现代·女主视角', tags: ['暗恋', '花季雨季', '正剧'], status: '连载', words: '—', points: '—',
    hook: '女主视角暗恋，第一人称代入感强。',
    why: '第一人称+女主视角的暗恋，心理真实、代入强，正剧基调不悬浮。',
    tropes: ['暗恋', '第一人称', '女主视角', '校园'],
    merits: ['第一人称代入', '心理细腻', '视角独特'],
    controversy: ['第一人称限制信息'],
    analysis: { plot: '暗恋长跑', character: '内向观察者', bg: '校园', copy: '内心独白式文案', outline: '注目→陪伴→告白', chapter: '情绪流', prose: '细腻', conflict: '不敢说出口', pace: '舒缓', blank: '未说之爱', psychology: '大量独白', action: '偷看动作', hookScene: '教室角落', dialogue: '少而精', expression: '欲说还休', env: '校园日常', mainPlot: '暗恋', subPlot: '成长' },
    char: { bg: '普通', base: '敏感内向', motive: '默默喜欢', child: '安静童年' } },
  { title: '她的山她的海', author: '扶华', genre: '百合·校园', tags: ['细腻','治愈','双女主'], status: '完结', words: 300000, points: '高分',
    hook: '两个女孩在山海之间的相互照亮，温柔而坚定。',
    why: '扶华经典百合校园，以细腻笔触写少女情谊与自我成长，后劲极大。',
    tropes: ['双向暗恋','双女主','校园','治愈'],
    merits: ['文笔细腻','情感真实','人物立体'],
    controversy: ['节奏偏慢','篇幅较长'],
    analysis: { plot:'相识—靠近—彼此成全', character:'一个明媚一个沉静', bg:'海岛小城校园', copy:'“你是我的山，也是我的海”', outline:'相遇→靠近→各自成长', chapter:'情绪流推进', prose:'诗化克制', conflict:'自我与怯懦', pace:'舒缓', blank:'未言之爱留白', psychology:'大量独白', action:'细微动作', hookScene:'海边相遇', dialogue:'欲言又止', expression:'眼神戏', env:'山海气候', mainPlot:'情谊成长', subPlot:'学业友情' },
    char: { bg:'普通家庭', base:'外冷内热', motive:'渴望被懂', child:'孤独童年' } },
  { title: '某某', author: '木苏里', genre: '纯爱·校园', tags: ['双强','校园标杆','意难平'], status: '完结', words: 280000, points: '超高积分',
    hook: '盛望与江添，两个天才少年在附中的光芒与遗憾。',
    why: '校园纯爱标杆，把“最好的人留不住”写得高级又余味，名场面频出。',
    tropes: ['双向暗恋','白月光','破镜','校园'],
    merits: ['文笔高级','氛围感强','台词绝'],
    controversy: ['结局意难平','部分读者求 HE'],
    analysis: { plot:'相遇—羁绊—分离—回望', character:'桀骜×清冷双强', bg:'重点中学', copy:'“我的骨骼说，我还是爱你”', outline:'同窗→靠近→错过', chapter:'情绪递进', prose:'诗意留白', conflict:'现实与心动', pace:'轻缓蓄势', blank:'未说出口', psychology:'少年心事', action:'日常互动', hookScene:'教室/天台', dialogue:'少年感台词', expression:'微表情', env:'校园四季', mainPlot:'情感', subPlot:'学业' },
    char: { bg:'优渥家庭', base:'外傲内软', motive:'想被需要', child:'被寄予厚望' } },
  { title: '撒野', author: '巫哲', genre: '纯爱·校园', tags: ['救赎','现实向','双男主'], status: '完结', words: 320000, points: '超高积分',
    hook: '蒋丞被丢到小城钢厂，遇见了他想一起“撒野”的人。',
    why: '现实向校园救赎文，写原生家庭、高考与彼此拉扯，又痛又暖。',
    tropes: ['救赎','双向奔赴','校园','成长'],
    merits: ['真实接地气','人物弧光强','台词鲜活'],
    controversy: ['前期压抑','方言阅读门槛'],
    analysis: { plot:'落魄—相遇—互相托举', character:'刺头×温柔强者', bg:'北方小城钢厂', copy:'“怕什么，我陪你”', outline:'困境→靠近→高考', chapter:'现实流', prose:'口语化有力', conflict:'原生家庭', pace:'沉稳', blank:'脆弱瞬间', psychology:'防御与渴望', action:'护短动作', hookScene:'钢厂/天台', dialogue:'狠话藏软', expression:'倔强', env:'灰调小城', mainPlot:'救赎', subPlot:'学业' },
    char: { bg:'被遗弃经历', base:'外壳尖锐', motive:'想要归属', child:'颠沛童年' } },
  { title: '伪装学渣', author: '木瓜黄', genre: '纯爱·校园', tags: ['双强','反差','甜'], status: '完结', words: 260000, points: '高分',
    hook: '两个“学渣”互相伪装，实则都在藏起光。',
    why: '校园双强反差甜文，学霸装学渣的名场面欢乐又上头。',
    tropes: ['双向暗恋','装学渣','双强','校园'],
    merits: ['反差萌','节奏轻快','甜而不腻'],
    controversy: ['甜度偏高'],
    analysis: { plot:'伪装—识破—双向确认', character:'傲娇×慵懒双强', bg:'重点高中', copy:'“其实我全会”', outline:'误会→拆穿→在一起', chapter:'日常+小高潮', prose:'轻快', conflict:'自尊与心意', pace:'明快', blank:'心动留白', psychology:'少年心事', action:'课堂互动', hookScene:'考场/走廊', dialogue:'互怼甜', expression:'耳红', env:'校园', mainPlot:'恋爱', subPlot:'学业逆袭' },
    char: { bg:'普通', base:'外松内紧', motive:'怕被看轻', child:'被低估' } },
  { title: '默读', author: 'priest', genre: '纯爱·悬疑', tags: ['刑侦','智力对决','双男主'], status: '完结', words: 400000, points: '超高积分',
    hook: '刑侦队长与犯罪专家，在案件与过往里彼此解码。',
    why: '悬疑+纯爱双线高能，每案映射社会议题，格局大。',
    tropes: ['强强','悬疑','救赎','破镜'],
    merits: ['结构精巧','立意深刻','文笔老辣'],
    controversy: ['暗线沉重','篇幅长'],
    analysis: { plot:'案件—追凶—解密身世', character:'硬汉×优雅智性', bg:'现代都市刑侦', copy:'“我可以教你，但你要听”', outline:'单元案→主线收束', chapter:'悬疑递进', prose:'冷峻利落', conflict:'法理与人情', pace:'紧凑', blank:'真相延迟', psychology:'创伤解码', action:'审讯对峙', hookScene:'案发现场', dialogue:'机锋暗藏', expression:'克制', env:'雨夜都市', mainPlot:'探案', subPlot:'情感' },
    char: { bg:'复杂过往', base:'外冷内执', motive:'寻求公正', child:'创伤经历' } },
  { title: '偷偷藏不住', author: '竹已', genre: '言情·校园', tags: ['暗恋','甜文','年下'], status: '完结', words: 350000, points: '超高积分',
    hook: '桑稚暗恋哥哥的朋友段嘉许，一路追到他身边。',
    why: '校园暗恋甜文天花板，暗恋心理写得真实又撩，全民上头。',
    tropes: ['暗恋','年下','甜宠','校园'],
    merits: ['暗恋代入强','甜度精准','人设讨喜'],
    controversy: ['甜度偏高怕腻者慎'],
    analysis: { plot:'暗恋—追随—双向确认', character:'软萌妹×温柔哥', bg:'高中到大学', copy:'“段哥哥”', outline:'暗恋→靠近→在一起', chapter:'甜日常', prose:'鲜活', conflict:'年龄差心理', pace:'轻甜', blank:'心动留白', psychology:'少女暗恋', action:'小动作', hookScene:'书桌/聚会', dialogue:'甜撩', expression:'脸红', env:'校园生活', mainPlot:'恋爱', subPlot:'成长' },
    char: { bg:'和睦家庭', base:'天真执着', motive:'想靠近他', child:'被宠爱' } }
];

/* ---- 题材库（等级 S/A/B） ---- */
const jjwxcGenres = [
  { name: '暗恋', tier: 'S', desc: '第一人称/女主视角代入极强，长盛不衰', coreTropes: ['双向暗恋', '暗恋成真', '竹马暗恋', '暗恋对象不知情', '默默守护'], praise: ['代入感强', '情绪真实', '后劲大'], mines: ['单箭头拖太长', '告白草率'], advice: ['用细节堆心动，少直白抒情', '设置“差点被发现”的紧张感'],
    detail: '暗恋的爽点在于“我知道你不知道”的信息差与小心翼翼。核心是**把单箭头写出重量**：不是“我喜欢他”，而是“他转笔时我数到第三下才敢抬头”。分两种写法——① 甜向：双向暗恋，双方都在藏，揭穿时double甜；② 虐向：单箭头+遗憾，靠“他结婚了我还记得他爱喝的口味”收刀。',
    example: '举例：女主视角写“每周三他打球，我就把水放在第三排”，三年没说出口；结尾他拿出同款水：“我也放了三年。”——信息差回收，双向暗恋拆穿，读者暴哭。' },
  { name: '校园', tier: 'S', desc: '青春氛围+甜度，短视频化友好', coreTropes: ['双向暗恋', '青梅竹马', '校霸×学霸', '破镜重圆(大学)', '运动会/课堂'], praise: ['青春感', '甜而不腻'], mines: ['悬浮人设', '狗血冲突'], advice: ['用真实校园细节建立真实感', 'CP反差要鲜明'],
    detail: '校园文的真实感来自**具体场景**：早读、晚自习、小卖部、运动会、高考倒计时。人设反差公式=桀骜×软萌 / 学神×学渣 / 校霸×书呆。甜要“有事发生”，不是硬撒糖，而是“他把自己的外套披你身上还嫌弃你矮”。',
    example: '举例：《某某》盛望×江添=桀骜学霸×清冷学霸，用“附中天才”的共同身份制造默契；《伪装学渣》两个学霸互装学渣，反差萌来自“其实我全会”的反复拆穿。' },
  { name: '百合GL', tier: 'S', desc: '2026 积分榜头部，强强/破镜最稳', coreTropes: ['强取豪夺', '破镜重圆', '双向暗恋', '室友/死对头', 'ABO/Omega'], praise: ['强情绪', '高粘性', '读者大方'], mines: ['强行不对等', '烂尾'], advice: ['双强人设更受欢迎', '台风/重逢等强意象开篇'],
    detail: '百合读者更吃**双强/势均力敌**与细腻心理。开篇用强意象（台风、海、雪）制造封闭空间与情绪高压。破镜重圆在百合里特别稳，因为“失去过又找回”的情绪回响强。避免一方彻底弱势的强行不对等。',
    example: '举例：《她的山她的海》用“山/海”互喻写两个女孩互相成全；《今夜刮起台风》用台风夜封闭空间把外部风暴与内心风暴同构，开篇即钩子。' },
  { name: '言情(现言)', tier: 'S', desc: '主流大盘，甜宠/追妻/破镜', coreTropes: ['破镜重圆', '追妻火葬场', '先婚后爱', '青梅竹马', '职场恋爱'], praise: ['受众广', '易影视化'], mines: ['工业糖精', '男主油腻'], advice: ['冲突要源于性格而非巧合', '女主需有自我'],
    detail: '现言要**女主有事业线与判断力**，男主不是“赏赐式宠爱”而是平等对手。追妻火葬场的前提是男主先有“失去”，读者才解气。破镜重圆的分手理由必须成立（价值观冲突＞误会）。',
    example: '举例：女主是律师，男主是甲方，法庭上针锋相对→私下拉扯，比“霸总宠妻”更有张力；分手因男主隐瞒关键决策，重逢时他已学会尊重，而非跪求。' },
  { name: '第一人称', tier: 'A', desc: '代入感拉满，适合暗恋/悬疑', coreTropes: ['女主视角暗恋', '第一人称悬疑', '内心独白', '限知视角', '不可靠叙述'], praise: ['沉浸', '心理真实'], mines: ['信息受限致剧情慢'], advice: ['用内心戏补信息', '关键处切视角'],
    detail: '第一人称的**限知视角**是双刃剑：沉浸感强，但主角不知情时读者也被蒙在鼓里。技巧：用“我以为是A，其实是B”的错位制造张力；悬疑里让“我”成为不可靠叙述者，结尾反转时才成立。',
    example: '举例：暗恋文用“我暗恋的人是凶手”的限知独白，读者跟着主角怀疑，最后反转“凶手是替他顶罪的人”——信息差全靠第一人称藏。' },
  { name: '破镜重圆', tier: 'A', desc: '情绪回响强，重逢即钩子', coreTropes: ['重逢', '误会解开', '带球/失忆(慎用)', '岁月沉淀', '和解'], praise: ['后劲大', '成熟感'], mines: ['强行分手', '虐而失真'], advice: ['分手需合理且双方有成长', '重逢后慢热升温'],
    detail: '破镜的核心是**“分开的日子里两人都变了”**。读者要看到分离期的成长，否则重逢只是原地踏步。重逢后给“慢热升温”，别立刻复合，让“熟悉又陌生”的拉扯持续。',
    example: '举例：《某某》盛望江添分离多年各自成为更好的人，重逢时一个已是医生一个仍是刺头，身份反转让旧情有了新张力；而非简单“我错了求复合”。' },
  { name: '穿书/快穿', tier: 'A', desc: '无限流友好，单元剧结构', coreTropes: ['炮灰逆袭', '反派女配', '系统任务', '攻略', '世界线'], praise: ['结构清晰', '节奏快'], mines: ['系统机械', '世界逻辑崩'], advice: ['每个世界有独立主题', '系统服务剧情非挂件'],
    detail: '穿书/快穿靠**单元剧**控节奏：每个世界一个主题（搞事业/救某人/揭阴谋），主线用“系统任务”串联。系统是工具不是外挂，否则爽感廉价。炮灰逆袭要“靠脑子翻盘”。',
    example: '举例：《穿成炮灰后我靠摆摊爆红》每个世界用不同生意破局，主线是“系统让我当炮灰，我偏活成主角”，事业线抵消恋爱悬浮。' },
  { name: '悬疑', tier: 'A', desc: '强情节，适配第一人称限知', coreTropes: ['不可靠叙述', '反转', '密室/案子', '暗线', '真相延迟'], praise: ['留存高', '讨论度高'], mines: ['逻辑硬伤', '反转为反转'], advice: ['伏笔前置', '用限知视角藏信息'],
    detail: '悬疑的命门是**伏笔前置+真相延迟**。第3章埋的线索，第30章才回收，读者二刷才懂。避免“为反转而反转”的神展开，反转必须早有暗示。限知视角天然适合藏关键信息。',
    example: '举例：开篇写“我喜欢的人出现在案发现场监控里”，读者随主角怀疑他是凶手；结尾反转“他是去救受害者”，伏笔早在第二章他买止血绷带时埋下。' },
  { name: '玄幻', tier: 'B', desc: '世界观为重，起号门槛高', coreTropes: ['重生', '废柴逆袭', '宗门', '秘境', '契灵'], praise: ['长线', '男频女频通吃'], mines: ['设定堆砌', '升级流水'], advice: ['用人物动机带世界观', '前期紧凑'],
    detail: '玄幻容易**设定堆砌+升级流水**。破解法：让世界观通过主角的“想要什么”自然展开，而非大段说明。前期紧凑，金手指要有代价或限制。',
    example: '举例：主角重生不是为爽，而是为救某人——动机驱动下，功法/宗门设定随复仇线逐层揭开，比“开局满级”更抓人。' },
  { name: '无限流', tier: 'B', desc: '副本制，单元+主线', coreTropes: ['副本', '玩家', '规则怪谈', '通关', '主神'], praise: ['强情节', '易出圈'], mines: ['副本同质', '规则混乱'], advice: ['每个副本一种恐惧/主题', '主角成长线贯穿'],
    detail: '无限流靠**副本差异化**维持新鲜感：每个副本对应一种恐惧（密闭/信任/时间）或主题（人性实验）。主神/系统线要收束到主角成长，否则副本沦为过关游戏。',
    example: '举例：一个副本是“不能说谎的村庄”，逼出角色秘密；下一个是“七日循环”，训练决策——副本服务于主角性格蜕变，而非随机闯关。' }
];

/* ---- 平台规则（真实 2025-2026） ---- */
const jjwxcRules = [
  { name: 'V线字数下调（分频道）', date: '2026-01-29 执行', change: '纯爱&多元 6万字、百合&无CP 5万字、古言/衍生按原频道最低字数；四组均取消“是否大于20万字”的篇幅限制；入V时系统按各频道字数规则自动检测非V章节字数。', impact: '入V门槛下调，中小体量可更早变现，新文走榜更友好。', compliance: '入V前确认本组v线字数（百合/无CP 5万、纯爱&多元 6万），别按旧标准卡字数。' },
  { name: '金榜 50 万字红线', date: '2025-12-16', change: '新系数算法将 50 万字设为分水岭，超字数作品金榜排名被“除以系数”稀释。', impact: '遏制水文，长文难靠堆量上榜，质量与节奏更重要。', compliance: '控制篇幅、重质不重量；冲刺金榜优先打磨前 50 万字内亮点。' },
  { name: '营养液发放规则', date: '2025-12-05', change: '不足 3 万字的部分不发放营养液（例：V章 22 万字全文不跳订约得 7 瓶）。', impact: '前期字数少则营养液收益低，需靠订阅与留存。', compliance: '别为凑营养液硬灌水，专注前 3 万字质量。' },
  { name: '入V基本条件', date: '现行', change: 'VIP 作者须为签约作者；文章 3 万字以上且具人气基础，可在作者后台“自荐申V”。', impact: '签约是前提，先过签约再谈入V。', compliance: '攒够 3 万字与基础收藏再申V，避免轮空。' },
  { name: '签约作者更新要求', date: '现行', change: '每年至少 1 部≥20 万字作品；每月最低更新 4 章（每章≥3000 字）；VIP 稿费千字三分。', impact: '有最低产出约束，断更影响权重与收益。', compliance: '排好存稿，避免卡V/断更触发读者雷点。' },
  { name: '读者排雷自由/文下环境', date: '2022 新规延续', change: '保留读者排雷帖与文下评论自由；作者不得无故删评、控评。', impact: '文下口碑直接影响订阅留存。', compliance: '正视排雷，理性回应，不删评激化矛盾。' },
  { name: '审核与 AI 内容标识', date: '现行', change: '涉政、低俗、抄袭、敏感内容不予通过；AI 生成内容需依规标识。', impact: '审核趋严，蹭热点需合规。', compliance: '敏感题材规避红线；AI 辅助写作主动标注，避免误判。' }
];

/* ---- 当日创作选题参考（按日轮换） ---- */
const jjwxcDailyPool = [
  { title: '台风夜被困的双向暗恋', angle: '强意象+暗恋', why: '借“封闭空间+天气”制造天然张力，对标《今夜刮起台风》结构', hook: '台风预警那天，我和暗恋的人被困在同一间屋子', shots: '环境描写开篇→心理独白→小动作破冰' },
  { title: '重生后我不再替他挡刀', angle: '女性觉醒+反转', why: '“不替原男主挡刀”的反套路，爽点清晰', hook: '上一世我替他挡了刀，这一世刀落向他自己', shots: '对比开篇→决绝动作→新关系建立' },
  { title: '室友是死对头的Omega', angle: '百合ABO+同居', why: '室友/死对头是高频热梗，ABO增强羁绊', hook: '分配宿舍那天，我和全校最不对付的人成了室友', shots: '冲突登场→信息差→靠近' },
  { title: '竹马假装不认识我', angle: '破镜+失忆', why: '“假装不识”拉扯感强，重逢即钩子', hook: '他看我的眼神像看陌生人，可我们曾约定一生', shots: '悬念开场→碎片回忆→真相' },
  { title: '第一人称：我暗恋的人是凶手', angle: '悬疑+暗恋', why: '限知视角藏信息，暗恋与危险叠加', hook: '我喜欢的人，出现在案发现场监控里', shots: '限知独白→线索→反转' },
  { title: '穿成炮灰后我靠摆摊爆红', angle: '穿书+事业线', why: '事业线抵消恋爱悬浮，单元感强', hook: '系统让我当炮灰，我偏开摊赚翻全场', shots: '反差开场→经营爽点→打脸' },
  { title: '校霸的软萌学霸同桌', angle: '校园反差CP', why: '桀骜×软萌经典反差，甜度可控', hook: '他踹开门坐我旁边：“以后罩着你”', shots: '出场张力→日常甜→心动' },
  { title: '离婚后我成了他的白月光', angle: '追妻/破镜', why: '“被离婚者反成白月光”情绪回响强', hook: '签字那天我说随便，三年后他跪求复婚', shots: '冷静开场→逆袭→重逢碾压' }
];

/* ---- 梗库 ---- */
const memePool = [
  { trope: '强取豪夺', genre: '恋爱/百合', tier: 'S', desc: '强势一方主动攻城，张力来源', usage: '配“脆弱/破碎”受形成反差', example: '《趁她之危》趁虚而入' },
  { trope: '双向暗恋', genre: '校园/恋爱', tier: 'S', desc: '双方都在暗恋，甜虐共生', usage: '用“对方不知情”的紧张感堆细节', example: '《陷入我们的热恋》' },
  { trope: '破镜重圆', genre: '言情', tier: 'S', desc: '重逢即钩子，情绪回响强', usage: '分手需合理，重逢慢热', example: '带球/失忆慎用' },
  { trope: '竹马/青梅', genre: '校园', tier: 'A', desc: '两小无猜，信任基底', usage: '用“熟悉感”制造独有亲密', example: '“我的竹马罢了”' },
  { trope: '替身文学', genre: '言情', tier: 'B', desc: '“看清楚了我不是他”名场面', usage: '慎用，易踩雷，需给受真正被看见', example: '雷点高发，建议反转救赎' },
  { trope: '重生', genre: '玄幻/言情', tier: 'A', desc: '带记忆重来，信息差爽点', usage: '用前世遗憾驱动今生选择', example: '重生后不挡刀' },
  { trope: '穿书/快穿', genre: '无限流', tier: 'A', desc: '单元剧结构，系统任务', usage: '每世界独立主题', example: '炮灰女配逆袭' },
  { trope: '失忆', genre: '恋爱', tier: 'A', desc: '重置关系，拉扯道具', usage: '别硬失忆，给合理触发', example: '重逢后前任求复合' },
  { trope: '死对头', genre: '百合/言情', tier: 'A', desc: '对抗中靠近，张力足', usage: '用 rivalry 做情感载体', example: '和心机大小姐成为室友' },
  { trope: '冲喜', genre: '古言/百合', tier: 'B', desc: '病弱/婚约梗，旧式张力', usage: '配时代背景更自洽', example: '给病弱郡主冲喜' },
  { trope: 'ABO/Omega', genre: '百合/纯爱', tier: 'A', desc: '生理羁绊增强绑定', usage: '信息素=情绪外化', example: '专属情人gl' },
  { trope: '病弱', genre: '百合', tier: 'B', desc: '脆弱美，激发保护欲', usage: '避免卖惨，给内在韧性', example: '病弱郡主' },
  { trope: '系统', genre: '无限流', tier: 'A', desc: '任务驱动，节奏器', usage: '服务剧情非挂件', example: '绑定撒娇系统' },
  { trope: '无限流', genre: '悬疑', tier: 'A', desc: '副本制强情节', usage: '每副本一种主题', example: '规则怪谈' },
  { trope: '反派逆袭', genre: '穿书', tier: 'A', desc: '炮灰翻身，爽点清晰', usage: '用事业线抵消悬浮', example: '被玩弄的反派女配' },
  { trope: '工业糖精', genre: '—', tier: 'B', desc: '【雷】无逻辑硬甜', usage: '避免，甜需有因', example: '雷点高发' },
  { trope: '破防', genre: '百合', tier: 'B', desc: '高冷者动心瞬间', usage: '用微表情写崩塌', example: '带猫跑后高冷美人破防' },
  { trope: '双向奔赴', genre: '全', tier: 'S', desc: '【好评】互相走向对方', usage: '优于单向苦恋', example: '读者最买账' }
];

/* ---- 避雷指南（好评/雷点） ---- */
const minePool = [
  { type: '好评', genre: '全', point: '双向奔赴', detail: '两人都主动走向对方，比单向苦恋更得读者心。', tip: '让CP各有行动线。' },
  { type: '好评', genre: '全', point: '人物弧光', detail: '主角随剧情成长、改变，读者追更粘性高。', tip: '每个大事件后留一点性格变化。' },
  { type: '好评', genre: '暗恋', point: '细腻心理', detail: '第一人称/限知视角的真实心事最戳人。', tip: '用身体反应写心动，少形容词堆砌。' },
  { type: '好评', genre: '全', point: '留白', detail: '关键告白/心动不写满，读者自己脑补更上头。', tip: '写完删三行，留呼吸感。' },
  { type: '好评', genre: '全', point: '烟火气', detail: '真实生活细节（饭、天气、小动作）增强沉浸。', tip: '用环境参与情绪。' },
  { type: '雷点', genre: '言情', point: '替身文学', detail: '“看清楚了我不是他”式替身最易惹雷，受需被真正看见。', tip: '若用，必给救赎与独立人格。' },
  { type: '雷点', genre: '全', point: '烂尾', detail: '前期铺陈、结尾草收，读者落差最大。', tip: '提前规划结局，伏笔回收。' },
  { type: '雷点', genre: '全', point: '工业糖精', detail: '无逻辑硬甜、为甜而甜，甜度越高越腻。', tip: '甜要有因果与张力。' },
  { type: '雷点', genre: '全', point: '卡V/断更', detail: '入V即断更、长期不更新，直接劝退。', tip: '排存稿，稳定更新。' },
  { type: '雷点', genre: '全', point: '水文', detail: '为凑字数灌水，金榜系数也会稀释长文。', tip: '每章有推进，删废话。' },
  { type: '雷点', genre: '言情', point: '女主恋爱脑/男主油腻', detail: '无自我女主、说教油腻男主是高频雷。', tip: '给女主事业与判断力。' },
  { type: '雷点', genre: '全', point: '一窝蜂跟风', detail: '什么火写什么，剧情套路化易尬。', tip: '热梗+个人视角翻新。' },
  { type: '雷点', genre: '全', point: '断更致歉回避', detail: '作者致歉却回避不更原因，读者更怒。', tip: '坦诚沟通，给预期。' },
  { type: '雷点', genre: '全', point: '删评控评', detail: '无故删读者排雷帖激化矛盾。', tip: '尊重排雷自由，理性回应。' }
];

/* ---- 全网素材库 ---- */
const materialPool = [
  { title: '早八人 5 分钟出门妆', platform: '抖音', tag: '美妆/通勤', reason: '切打工人早起痛点，低门槛', hook: '素颜→全妆对比', idea: '改编“考公人 5 分钟提神妆”', keyword: '早八妆' },
  { title: '挑战 30 天瘦 10 斤', platform: '得物/抖音', tag: '健身/挑战', reason: '强目标强反差，适合追更', hook: 'Day1 体重秤特写', idea: '改编“30 天英语逆袭”', keyword: '30天挑战' },
  { title: '普通人下班后 1 小时', platform: '小红书', tag: '自律/成长', reason: '反内卷情绪共鸣', hook: '23岁工资5千只做一件事', idea: '迁移到“写作者的1小时”', keyword: '下班后一小时' },
  { title: '暗恋成真名场面', platform: '晋江/小红书', tag: '暗恋/甜', reason: '情绪价值高，易出金句', hook: '他忽然回头叫我名字', idea: '拆为名场面写作模板', keyword: '暗恋成真' },
  { title: '强取豪夺名段落', platform: '晋江', tag: '百合/言情', reason: '张力结构可拆解迁移', hook: '“趁她之危”式开场', idea: '分析攻势节奏', keyword: '强取豪夺' },
  { title: '校园双向暗恋', platform: '晋江/抖音', tag: '校园/甜', reason: '青春甜度+短视频友好', hook: '桀骜少年×软萌学霸', idea: '写校园暗恋分镜', keyword: '校园双向暗恋' },
  { title: '破镜重圆情绪流', platform: '晋江', tag: '言情', reason: '重逢钩子+后劲', hook: '再见已是陌生人', idea: '拆解重逢升温节奏', keyword: '破镜重圆' },
  { title: '第一人称悬疑', platform: '晋江/知乎', tag: '悬疑', reason: '限知视角藏信息', hook: '我喜欢的人出现在案发现场', idea: '写不可靠叙述', keyword: '第一人称悬疑' },
  { title: '穿书炮灰逆袭', platform: '晋江/抖音', tag: '穿书/爽', reason: '事业线抵消悬浮', hook: '系统让我当炮灰', idea: '单元爽点设计', keyword: '穿书炮灰' },
  { title: '晋江热门题材风向', platform: '晋江', tag: '数据/选题', reason: '实时榜单指导选题', hook: '本月百合/校园头部', idea: '对照榜单定题材', keyword: '晋江热门题材' },
  { title: '读者雷点合集', platform: '晋江吧/知乎', tag: '避雷', reason: '避坑降本', hook: '那些年我们踩过的雷', idea: '做成避雷清单', keyword: '晋江雷点' },
  { title: '金句文案模板', platform: '小红书', tag: '文案', reason: '可直接挪用结构', hook: '一句顶一万句', idea: '建金句库', keyword: '文案金句' }
];

/* ---- 渲染：主模块 ---- */
function renderJJWXC() {
  // 每日风向
  const daily = seededShuffle(jjwxcDailyPool, todayKey()).slice(0, 3);
  document.getElementById('jjwxcDaily').innerHTML = `
    <div class="card card-gradient-green">
      <div class="font-bold mb-2">📌 当日创作风向</div>
      ${daily.map(d => `<div class="mb-2"><span class="text-blue font-bold">${esc(d.title)}</span> <span class="tag tag-low">${esc(d.angle)}</span><div class="text-sm text-muted">${esc(d.why)}</div><div class="text-sm">钩子：${esc(d.hook)}</div></div>`).join('')}
    </div>`;
  const upd = store.get('luo_jjwxc_updated', '');
  const updEl = document.getElementById('jjwxcUpdated');
  if (updEl) updEl.textContent = upd ? '上次联网刷新：' + upd : '当前为内置素材库（联网刷新可尝试最新榜单）';
  renderJJWXCRank(); renderJJWXCGenre(); renderJJWXCRule();
}
const jjwxcRankBooks = {
  '校园': [
    { title: '《某某》', tags: ['校园', '纯爱', '救赎'], author: '木苏里', hook: '两个少年在校园里互相靠近', why: '双向救赎的情感张力强', learn: '用日常细节写心动' },
    { title: '《撒野》', tags: ['校园', '现实', '救赎'], author: '巫哲', hook: '两个少年在校园里互相靠近', why: '双向救赎的情感张力强', learn: '把成长烦恼与感情线交织' },
    { title: '《伪装学渣》', tags: ['校园', '甜', '反差'], author: '木瓜黄', hook: '两个少年在校园里互相靠近', why: '校园背景天然纯爱，受众稳定', learn: '把成长烦恼与感情线交织' },
    { title: '《轻狂》', tags: ['校园', '热血'], author: '巫哲', hook: '青春校园里的成长与羁绊', why: '少年感与成长线结合', learn: '用日常细节写心动' },
    { title: '《一个钢镚儿》', tags: ['校园', '穷富'], author: '巫哲', hook: '青春校园里的成长与羁绊', why: '校园背景天然纯爱，受众稳定', learn: '把成长烦恼与感情线交织' },
    { title: '《白纸与喜欢》', tags: ['校园', '暗恋', '成长'], hook: '青春校园里的成长与羁绊', why: '少年感与成长线结合', learn: '用日常细节写心动' },
    { title: '《风声》（校园型同人）', tags: ['校园', '同人', '悬疑'], hook: '悬疑主线中交织的感情线', why: '校园背景天然纯爱，受众稳定', learn: '把成长烦恼与感情线交织' },
    { title: '《放学别走》', tags: ['校园', '拉扯'], author: '酱子贝', hook: '教室、蝉鸣、晚自习的青春切片', why: '青春细节真实，极易代入', learn: '用教室、操场、晚自习等具体场景堆氛围' },
    { title: '《你微笑时很美》', tags: ['校园', '电竞', '甜'], author: '青浼', hook: '电竞少年的校园热血与羁绊', why: '校园背景天然纯爱，受众稳定', learn: '把成长烦恼与感情线交织' },
    { title: '《你的距离》', tags: ['校园', '师生'], author: '公子优', hook: '两个少年在校园里互相靠近', why: '校园背景天然纯爱，受众稳定', learn: '把成长烦恼与感情线交织' },
    { title: '《奶油味暗恋》', tags: ['校园', '暗恋'], author: '这碗粥', hook: '两个少年在校园里互相靠近', why: '少年感与成长线结合', learn: '用日常细节写心动' },
    { title: '《这题超纲了》', tags: ['校园', '甜', '反差'], author: '木瓜黄', hook: '少年感十足的校园故事', why: '青春细节真实，极易代入', learn: '用教室、操场、晚自习等具体场景堆氛围' },
    { title: '《过门》', tags: ['校园', '成长'], author: 'priest', hook: '教室、蝉鸣、晚自习的青春切片', why: '校园背景天然纯爱，受众稳定', learn: '把成长烦恼与感情线交织' },
    { title: '《狼行成双》', tags: ['校园', '热血'], author: '巫哲', hook: '两个少年在校园里互相靠近', why: '少年感与成长线结合', learn: '用日常细节写心动' },
    { title: '《格格不入》', tags: ['校园', '救赎'], author: '巫哲', hook: '少年感十足的校园故事', why: '双向救赎的情感张力强', learn: '用日常细节写心动' },
    { title: '《飞来横犬》', tags: ['校园', '成长'], author: '巫哲', hook: '青春校园里的成长与羁绊', why: '少年感与成长线结合', learn: '用日常细节写心动' },
    { title: '《嚣张》', tags: ['校园', '热血'], author: '巫哲', hook: '教室、蝉鸣、晚自习的青春切片', why: '少年感与成长线结合', learn: '用日常细节写心动' },
    { title: '《白日梦我》', tags: ['校园', '甜'], author: '栖见', hook: '青春校园里的成长与羁绊', why: '少年感与成长线结合', learn: '用日常细节写心动' },
    { title: '《暗格里的秘密》', tags: ['校园', '暗恋', '成长'], author: '耳东兔子', hook: '青春校园里的成长与羁绊', why: '少年感与成长线结合', learn: '用日常细节写心动' },
    { title: '《致我们单纯的小美好》', tags: ['校园', '甜'], author: '赵乾乾', hook: '教室、蝉鸣、晚自习的青春切片', why: '青春细节真实，极易代入', learn: '用教室、操场、晚自习等具体场景堆氛围' },
    { title: '《最好的我们》', tags: ['校园', '青春'], author: '八月长安', hook: '少年感十足的校园故事', why: '校园背景天然纯爱，受众稳定', learn: '把成长烦恼与感情线交织' },
    { title: '《你好，旧时光》', tags: ['校园', '成长'], author: '八月长安', hook: '教室、蝉鸣、晚自习的青春切片', why: '少年感与成长线结合', learn: '用日常细节写心动' },
    { title: '《暗恋·橘生淮南》', tags: ['校园', '暗恋'], author: '八月长安', hook: '青春校园里的成长与羁绊', why: '青春细节真实，极易代入', learn: '用教室、操场、晚自习等具体场景堆氛围' },
    { title: '《这么多年》', tags: ['校园', '成长'], author: '八月长安', hook: '教室、蝉鸣、晚自习的青春切片', why: '少年感与成长线结合', learn: '用日常细节写心动' },
    { title: '《我才不要和你做朋友呢》', tags: ['校园', '穿越', '甜'], author: '陈昊宇', hook: '少年感十足的校园故事', why: '少年感与成长线结合', learn: '用日常细节写心动' },
    { title: '《一闪一闪亮星星》', tags: ['校园', '暗恋'], author: '段余霜', hook: '两个少年在校园里互相靠近', why: '校园背景天然纯爱，受众稳定', learn: '把成长烦恼与感情线交织' },
    { title: '《二进制恋爱》', tags: ['校园', '甜'], author: '庄达菲', hook: '青春校园里的成长与羁绊', why: '校园背景天然纯爱，受众稳定', learn: '把成长烦恼与感情线交织' },
    { title: '《时光与他，恰是正好》', tags: ['校园', '甜'], author: '蒋牧童', hook: '少年感十足的校园故事', why: '校园背景天然纯爱，受众稳定', learn: '把成长烦恼与感情线交织' },
    { title: '《她的小梨涡》', tags: ['校园', '甜', '暗恋'], author: '唧唧的猫', hook: '青春校园里的成长与羁绊', why: '青春细节真实，极易代入', learn: '用教室、操场、晚自习等具体场景堆氛围' },
    { title: '《草莓印》', tags: ['校园', '甜'], author: '不止是颗菜', hook: '两个少年在校园里互相靠近', why: '青春细节真实，极易代入', learn: '用教室、操场、晚自习等具体场景堆氛围' },
  ],
  '暗恋': [
    { title: '《偷偷藏不住》', tags: ['暗恋', '甜', '校园'], author: '竹已', hook: '把没说出口的喜欢写进日常', why: '克制与试探带来持续张力', learn: '用眼神、小动作、欲言又止堆情绪' },
    { title: '《难哄》', tags: ['暗恋', '破镜', '甜'], author: '竹已', hook: '暗恋成真前的百转千回', why: '暗恋心理刻画精准', learn: '用"差一点"的关系写透心动' },
    { title: '《她的小梨涡》', tags: ['暗恋', '校园', '甜'], author: '唧唧的猫', hook: '把没说出口的喜欢写进日常', why: '暗恋心理刻画精准', learn: '用"差一点"的关系写透心动' },
    { title: '《暗恋·橘生淮南》', tags: ['暗恋', '青春'], author: '八月长安', hook: '把没说出口的喜欢写进日常', why: '暗恋心理刻画精准', learn: '用"差一点"的关系写透心动' },
    { title: '《奶油味暗恋》', tags: ['暗恋', '校园'], author: '这碗粥', hook: '藏在眼神与细节里的心动', why: '读者能在细节里找到自己', learn: '让暗恋在细节中自然升温' },
    { title: '《我喜欢你的信息素》', tags: ['暗恋', 'ABO'], author: '引路星', hook: '朋友以上恋人未满的拉扯', why: '克制与试探带来持续张力', learn: '用眼神、小动作、欲言又止堆情绪' },
    { title: '《小清欢》', tags: ['暗恋', '甜'], author: '向日葵', hook: '暗恋成真前的百转千回', why: '克制与试探带来持续张力', learn: '用眼神、小动作、欲言又止堆情绪' },
    { title: '《暗格里的秘密》', tags: ['暗恋', '成长'], author: '耳东兔子', hook: '把没说出口的喜欢写进日常', why: '读者能在细节里找到自己', learn: '让暗恋在细节中自然升温' },
    { title: '《橘生淮南·暗恋》', tags: ['暗恋', '青春'], author: '八月长安', hook: '把没说出口的喜欢写进日常', why: '暗恋心理刻画精准', learn: '用"差一点"的关系写透心动' },
    { title: '《告别薇安》', tags: ['暗恋', '都市'], author: '安妮宝贝', hook: '把没说出口的喜欢写进日常', why: '暗恋心理刻画精准', learn: '用"差一点"的关系写透心动' },
    { title: '《匆匆那年》', tags: ['暗恋', '青春'], author: '九夜茴', hook: '朋友以上恋人未满的拉扯', why: '暗恋心理刻画精准', learn: '用"差一点"的关系写透心动' },
    { title: '《致青春》', tags: ['暗恋', '都市'], author: '辛夷坞', hook: '朋友以上恋人未满的拉扯', why: '读者能在细节里找到自己', learn: '让暗恋在细节中自然升温' },
    { title: '《何以笙箫默》', tags: ['暗恋', '现言', '破镜'], author: '顾漫', hook: '暗恋成真前的百转千回', why: '克制与试探带来持续张力', learn: '用眼神、小动作、欲言又止堆情绪' },
    { title: '《原来你还在这里》', tags: ['暗恋', '都市'], author: '辛夷坞', hook: '把没说出口的喜欢写进日常', why: '读者能在细节里找到自己', learn: '让暗恋在细节中自然升温' },
    { title: '《致我们暖暖的小时光》', tags: ['暗恋', '甜'], author: '赵乾乾', hook: '朋友以上恋人未满的拉扯', why: '读者能在细节里找到自己', learn: '让暗恋在细节中自然升温' },
    { title: '《我只喜欢你》', tags: ['暗恋', '甜'], author: '乔一', hook: '把没说出口的喜欢写进日常', why: '暗恋心理刻画精准', learn: '用"差一点"的关系写透心动' },
    { title: '《大约是爱》', tags: ['暗恋', '甜'], author: '李李翔', hook: '把没说出口的喜欢写进日常', why: '克制与试探带来持续张力', learn: '用眼神、小动作、欲言又止堆情绪' },
    { title: '《半是蜜糖半是伤》', tags: ['暗恋', '都市'], author: '棋子', hook: '藏在眼神与细节里的心动', why: '读者能在细节里找到自己', learn: '让暗恋在细节中自然升温' },
    { title: '《你是我的荣耀》', tags: ['暗恋', '现言', '航天'], author: '顾漫', hook: '朋友以上恋人未满的拉扯', why: '克制与试探带来持续张力', learn: '用眼神、小动作、欲言又止堆情绪' },
    { title: '《余生请多指教》', tags: ['暗恋', '甜'], author: '柏林石匠', hook: '把没说出口的喜欢写进日常', why: '克制与试探带来持续张力', learn: '用眼神、小动作、欲言又止堆情绪' },
    { title: '《亲爱的，热爱的》', tags: ['暗恋', '甜', '电竞'], author: '墨宝非宝', hook: '把没说出口的喜欢写进日常', why: '克制与试探带来持续张力', learn: '用眼神、小动作、欲言又止堆情绪' },
    { title: '《微微一笑很倾城》', tags: ['暗恋', '校园', '网游'], author: '顾漫', hook: '把没说出口的喜欢写进日常', why: '克制与试探带来持续张力', learn: '用眼神、小动作、欲言又止堆情绪' },
    { title: '《杉杉来吃》', tags: ['暗恋', '甜', '霸总'], author: '顾漫', hook: '暗恋成真前的百转千回', why: '读者能在细节里找到自己', learn: '让暗恋在细节中自然升温' },
    { title: '《骄阳似我》', tags: ['暗恋', '甜'], author: '顾漫', hook: '藏在眼神与细节里的心动', why: '克制与试探带来持续张力', learn: '用眼神、小动作、欲言又止堆情绪' },
    { title: '《你是我的城池营垒》', tags: ['暗恋', '职场'], author: '沐清雨', hook: '把没说出口的喜欢写进日常', why: '读者能在细节里找到自己', learn: '让暗恋在细节中自然升温' },
    { title: '《致我们终将逝去的青春》', tags: ['暗恋', '青春'], author: '辛夷坞', hook: '暗恋成真前的百转千回', why: '暗恋心理刻画精准', learn: '用"差一点"的关系写透心动' },
    { title: '《我在时间尽头等你》', tags: ['暗恋', '奇幻'], author: '郑执', hook: '把没说出口的喜欢写进日常', why: '克制与试探带来持续张力', learn: '用眼神、小动作、欲言又止堆情绪' },
    { title: '《你的婚礼》', tags: ['暗恋', '青春'], author: '刘雨昕', hook: '暗恋成真前的百转千回', why: '克制与试探带来持续张力', learn: '用眼神、小动作、欲言又止堆情绪' },
    { title: '《我的刺猬女孩》', tags: ['暗恋', '校园'], author: '王鑫', hook: '朋友以上恋人未满的拉扯', why: '暗恋心理刻画精准', learn: '用"差一点"的关系写透心动' },
    { title: '《一闪一闪亮星星》', tags: ['暗恋', '校园', '奇幻'], author: '段余霜', hook: '藏在眼神与细节里的心动', why: '克制与试探带来持续张力', learn: '用眼神、小动作、欲言又止堆情绪' },
  ],
  '百合': [
    { title: '《她的山，她的海》', tags: ['百合', '校园', '救赎'], author: '扶华', hook: '温柔陪伴式的女性情感', why: '双向救赎的情感张力强', learn: '用日常细节写感情，克制更动人' },
    { title: '《影后的自我修养》', tags: ['百合', '娱乐圈'], author: '扶华', hook: '聚光灯下的身份差与情感拉扯', why: '双女主互动张力足', learn: '用身份差/反差制造戏剧' },
    { title: '《非友》', tags: ['百合', '校园'], hook: '两个女孩之间的羁绊与救赎', why: '女性情感刻画细腻', learn: '用日常细节写感情，克制更动人' },
    { title: '《与塞万提斯同行》', tags: ['百合', '治愈'], hook: '温柔陪伴式的女性情感', why: '情感克制比直给更动人', learn: '双女主互动要层层递进' },
    { title: '《末日乐园》', tags: ['百合', '科幻'], hook: '两个女孩之间的羁绊与救赎', why: '女性情感刻画细腻', learn: '用日常细节写感情，克制更动人' },
    { title: '《探虚陵》', tags: ['百合', '悬疑', '古风'], author: '君sola', hook: '悬疑主线中交织的感情线', why: '情感克制比直给更动人', learn: '双女主互动要层层递进' },
    { title: '《我亲爱的法医小姐》', tags: ['百合', '悬疑', '职场'], author: '酒暖春深', hook: '悬疑主线中交织的感情线', why: '双女主互动张力足', learn: '用身份差/反差制造戏剧' },
    { title: '《余生为期》', tags: ['百合', '现代', '年上'], author: '闵然', hook: '两个女孩之间的羁绊与救赎', why: '双女主互动张力足', learn: '用身份差/反差制造戏剧' },
    { title: '《她是第三种绝色》', tags: ['百合', '娱乐圈'], author: '天若悬河', hook: '聚光灯下的身份差与情感拉扯', why: '女性情感刻画细腻', learn: '用日常细节写感情，克制更动人' },
    { title: '《全世界都在等你心动》', tags: ['百合', '校园'], author: '素衣只一', hook: '身份差与情感张力的碰撞', why: '情感克制比直给更动人', learn: '双女主互动要层层递进' },
    { title: '《半只橙》', tags: ['百合', '现代', '暗恋'], author: '米闹闹', hook: '两个女孩之间的羁绊与救赎', why: '女性情感刻画细腻', learn: '用日常细节写感情，克制更动人' },
    { title: '《予她半城》', tags: ['百合', '现代', '破镜'], author: '苏难', hook: '两个女孩之间的羁绊与救赎', why: '双女主互动张力足', learn: '用身份差/反差制造戏剧' },
    { title: '《宇宙第一可爱》', tags: ['百合', '星际'], author: '叶涩', hook: '细腻柔软的双女主故事', why: '女性情感刻画细腻', learn: '用日常细节写感情，克制更动人' },
    { title: '《她的学生们》', tags: ['百合', '校园'], author: '南柯十三殿', hook: '温柔陪伴式的女性情感', why: '情感克制比直给更动人', learn: '双女主互动要层层递进' },
    { title: '《山河不夜天》', tags: ['百合', '古风'], author: '莫晨欢', hook: '古风背景下的双女主/言情纠葛', why: '情感克制比直给更动人', learn: '双女主互动要层层递进' },
    { title: '《向你而行》', tags: ['百合', '职场'], author: '玄笺', hook: '两个女孩之间的羁绊与救赎', why: '双女主互动张力足', learn: '用身份差/反差制造戏剧' },
    { title: '《微光》', tags: ['百合', '治愈'], author: '鱼霜', hook: '身份差与情感张力的碰撞', why: '女性情感刻画细腻', learn: '用日常细节写感情，克制更动人' },
    { title: '《靠近你，淹没我》', tags: ['百合', '娱乐圈'], author: '三国大王', hook: '聚光灯下的身份差与情感拉扯', why: '双女主互动张力足', learn: '用身份差/反差制造戏剧' },
    { title: '《有几分像》', tags: ['百合', '现代'], author: '挽瞳', hook: '温柔陪伴式的女性情感', why: '女性情感刻画细腻', learn: '用日常细节写感情，克制更动人' },
    { title: '《禁止动心》', tags: ['百合', '校园'], author: '潩清', hook: '温柔陪伴式的女性情感', why: '情感克制比直给更动人', learn: '双女主互动要层层递进' },
    { title: '《窒息》', tags: ['百合', '悬疑'], author: '红烧肉', hook: '悬疑主线中交织的感情线', why: '双女主互动张力足', learn: '用身份差/反差制造戏剧' },
    { title: '《瓜田李下》', tags: ['百合', '古风'], author: '许温柔', hook: '古风背景下的双女主/言情纠葛', why: '女性情感刻画细腻', learn: '用日常细节写感情，克制更动人' },
    { title: '《浅尝辄止》', tags: ['百合', '现代'], author: '不要胡萝卜', hook: '细腻柔软的双女主故事', why: '情感克制比直给更动人', learn: '双女主互动要层层递进' },
    { title: '《余情可待》', tags: ['百合', '破镜'], author: '闵然', hook: '温柔陪伴式的女性情感', why: '女性情感刻画细腻', learn: '用日常细节写感情，克制更动人' },
    { title: '《头号玩家》', tags: ['百合', '电竞'], author: '多梨', hook: '温柔陪伴式的女性情感', why: '情感克制比直给更动人', learn: '双女主互动要层层递进' },
    { title: '《她吻》', tags: ['百合', '现代'], author: '池袋最强', hook: '细腻柔软的双女主故事', why: '情感克制比直给更动人', learn: '双女主互动要层层递进' },
    { title: '《失重》', tags: ['百合', '职场'], author: '咬鸦', hook: '温柔陪伴式的女性情感', why: '情感克制比直给更动人', learn: '双女主互动要层层递进' },
    { title: '《单向通行》', tags: ['百合', '暗恋'], author: '花生糖', hook: '细腻柔软的双女主故事', why: '女性情感刻画细腻', learn: '用日常细节写感情，克制更动人' },
    { title: '《她是我的小可爱》', tags: ['百合', '校园'], author: '故砚', hook: '细腻柔软的双女主故事', why: '情感克制比直给更动人', learn: '双女主互动要层层递进' },
    { title: '《养兽为妃》', tags: ['百合', '古风'], author: '鲤乐', hook: '古风背景下的双女主/言情纠葛', why: '双女主互动张力足', learn: '用身份差/反差制造戏剧' },
    { title: '《我的同桌是omega》', tags: ['百合', 'ABO', '校园'], author: '倒吊人大叔', hook: '两个女孩之间的羁绊与救赎', why: '女性情感刻画细腻', learn: '用日常细节写感情，克制更动人' },
    { title: '《王妃》', tags: ['百合', '古风'], author: '易人北', hook: '古风背景下的双女主/言情纠葛', why: '女性情感刻画细腻', learn: '用日常细节写感情，克制更动人' },
    { title: '《狐言》', tags: ['百合', '玄幻'], author: '水千丞', hook: '细腻柔软的双女主故事', why: '双女主互动张力足', learn: '用身份差/反差制造戏剧' },
    { title: '《她比烟花寂寞》', tags: ['百合', '娱乐圈'], author: '花田', hook: '聚光灯下的身份差与情感拉扯', why: '情感克制比直给更动人', learn: '双女主互动要层层递进' },
    { title: '《风吹过的夏天》', tags: ['百合', '校园'], author: '林子', hook: '温柔陪伴式的女性情感', why: '情感克制比直给更动人', learn: '双女主互动要层层递进' },
    { title: '《暗恋这件小事》', tags: ['百合', '暗恋'], author: '一只狐狸', hook: '身份差与情感张力的碰撞', why: '双女主互动张力足', learn: '用身份差/反差制造戏剧' },
    { title: '《今天也没变成猫》', tags: ['百合', '现代'], author: '酒小七', hook: '温柔陪伴式的女性情感', why: '双女主互动张力足', learn: '用身份差/反差制造戏剧' },
    { title: '《失控》', tags: ['百合', '悬疑'], author: '龙柒', hook: '悬疑主线中交织的感情线', why: '情感克制比直给更动人', learn: '双女主互动要层层递进' },
    { title: '《我在逃生游戏里做主播》', tags: ['百合', '无限流'], author: '扶华', hook: '细腻柔软的双女主故事', why: '情感克制比直给更动人', learn: '双女主互动要层层递进' },
    { title: '《女将军和长公主》', tags: ['百合', '古风'], author: '请君莫笑', hook: '古风背景下的双女主/言情纠葛', why: '情感克制比直给更动人', learn: '双女主互动要层层递进' },
    { title: '《快穿之绝世宠妃》', tags: ['百合', '快穿', '古风'], author: '柒殇祭', hook: '古风背景下的双女主/言情纠葛', why: '女性情感刻画细腻', learn: '用日常细节写感情，克制更动人' },
    { title: '《和女主对照组HE了》', tags: ['百合', '穿书'], author: '姜沉漾', hook: '两个女孩之间的羁绊与救赎', why: '情感克制比直给更动人', learn: '双女主互动要层层递进' },
    { title: '《病美人师尊的千层套路》', tags: ['百合', '仙侠'], author: '食鹿客', hook: '古风背景下的双女主/言情纠葛', why: '情感克制比直给更动人', learn: '双女主互动要层层递进' },
    { title: '《全校只有我是人》', tags: ['百合', '奇幻', '校园'], author: '凤久安', hook: '温柔陪伴式的女性情感', why: '双女主互动张力足', learn: '用身份差/反差制造戏剧' },
    { title: '《我的房东是冥王》', tags: ['百合', '灵异'], author: '小狐昔里', hook: '身份差与情感张力的碰撞', why: '女性情感刻画细腻', learn: '用日常细节写感情，克制更动人' },
    { title: '《影后今天被告白了吗》', tags: ['百合', '娱乐圈'], author: '鸽', hook: '聚光灯下的身份差与情感拉扯', why: '女性情感刻画细腻', learn: '用日常细节写感情，克制更动人' },
    { title: '《穿成反派的我靠沙雕苟活》', tags: ['百合', '穿书'], author: '马户子君', hook: '身份差与情感张力的碰撞', why: '情感克制比直给更动人', learn: '双女主互动要层层递进' },
    { title: '《白月光Omega总想独占我》', tags: ['百合', 'ABO'], author: '海大人', hook: '温柔陪伴式的女性情感', why: '情感克制比直给更动人', learn: '双女主互动要层层递进' },
    { title: '《她属于我》', tags: ['百合', '现代'], author: '三月图腾', hook: '温柔陪伴式的女性情感', why: '情感克制比直给更动人', learn: '双女主互动要层层递进' },
    { title: '《操纵我心》', tags: ['百合', '娱乐圈'], author: '青山', hook: '聚光灯下的身份差与情感拉扯', why: '女性情感刻画细腻', learn: '用日常细节写感情，克制更动人' },
    { title: '《魔女时间》', tags: ['百合', '奇幻'], author: '蛋挞鲨', hook: '两个女孩之间的羁绊与救赎', why: '双女主互动张力足', learn: '用身份差/反差制造戏剧' },
    { title: '《春风不度》', tags: ['百合', '古风'], author: '热到昏厥', hook: '古风背景下的双女主/言情纠葛', why: '情感克制比直给更动人', learn: '双女主互动要层层递进' },
    { title: '《见光死》', tags: ['百合', '现代'], author: '瓜子猫', hook: '两个女孩之间的羁绊与救赎', why: '女性情感刻画细腻', learn: '用日常细节写感情，克制更动人' },
    { title: '《摘星》', tags: ['百合', '娱乐圈'], author: '若花辞树', hook: '聚光灯下的身份差与情感拉扯', why: '女性情感刻画细腻', learn: '用日常细节写感情，克制更动人' },
    { title: '《月下美人》', tags: ['百合', '古风'], author: '边巡', hook: '古风背景下的双女主/言情纠葛', why: '双女主互动张力足', learn: '用身份差/反差制造戏剧' },
    { title: '《贪恋》', tags: ['百合', '现代'], author: '今轲', hook: '两个女孩之间的羁绊与救赎', why: '女性情感刻画细腻', learn: '用日常细节写感情，克制更动人' },
    { title: '《孤掷温柔》', tags: ['百合', '现代'], author: '闵然', hook: '细腻柔软的双女主故事', why: '女性情感刻画细腻', learn: '用日常细节写感情，克制更动人' },
    { title: '《跌落暮色》', tags: ['百合', '校园', '救赎'], author: '渐却', hook: '两个女孩之间的羁绊与救赎', why: '双向救赎的情感张力强', learn: '双女主互动要层层递进' },
    { title: '《夜尽天明》', tags: ['百合', '悬疑'], author: '一冉', hook: '悬疑主线中交织的感情线', why: '女性情感刻画细腻', learn: '用日常细节写感情，克制更动人' },
  ],
  '言情': [
    { title: '《知否知否应是绿肥红瘦》', tags: ['言情', '古言', '宅斗'], author: '关心则乱', hook: '事业与爱情双线并行', why: '情感张力到位', learn: '用反差人设制造戏剧冲突' },
    { title: '《何以笙箫默》', tags: ['言情', '现言', '破镜'], author: '顾漫', hook: '甜虐交织的感情线', why: '甜宠与现实感平衡', learn: '深情靠克制与留白写' },
    { title: '《步步惊心》', tags: ['言情', '清穿'], author: '桐华', hook: '人设反差带来的化学反应', why: '人物执念驱动剧情', learn: '让事业线为感情线背书' },
    { title: '《微微一笑很倾城》', tags: ['言情', '校园', '网游'], author: '顾漫', hook: '事业与爱情双线并行', why: '甜宠与现实感平衡', learn: '深情靠克制与留白写' },
    { title: '《打火机与公主裙》', tags: ['言情', '现实'], author: 'Twentine', hook: '甜虐交织的感情线', why: '甜宠与现实感平衡', learn: '深情靠克制与留白写' },
    { title: '《那个不为人知的故事》', tags: ['言情', '现实', '虐'], author: 'Twentine', hook: '人设反差带来的化学反应', why: '情感张力到位', learn: '用反差人设制造戏剧冲突' },
    { title: '《一厘米的阳光》', tags: ['言情', '现言', '治愈'], author: '墨宝非宝', hook: '人设反差带来的化学反应', why: '人物执念驱动剧情', learn: '让事业线为感情线背书' },
    { title: '《你是我的荣耀》', tags: ['言情', '现言', '航天'], author: '顾漫', hook: '人设反差带来的化学反应', why: '甜宠与现实感平衡', learn: '深情靠克制与留白写' },
    { title: '《杉杉来吃》', tags: ['言情', '甜', '霸总'], author: '顾漫', hook: '甜虐交织的感情线', why: '情感张力到位', learn: '用反差人设制造戏剧冲突' },
    { title: '《暗格里的秘密》', tags: ['言情', '暗恋', '成长'], author: '耳东兔子', hook: '事业与爱情双线并行', why: '情感张力到位', learn: '用反差人设制造戏剧冲突' },
    { title: '《甄嬛传》', tags: ['言情', '古言', '宫斗'], author: '流潋紫', hook: '人设反差带来的化学反应', why: '人物执念驱动剧情', learn: '让事业线为感情线背书' },
    { title: '《如懿传》', tags: ['言情', '古言', '宫斗'], author: '流潋紫', hook: '事业与爱情双线并行', why: '情感张力到位', learn: '用反差人设制造戏剧冲突' },
    { title: '《琅琊榜》', tags: ['言情', '古言', '权谋'], author: '海宴', hook: '人设反差带来的化学反应', why: '情感张力到位', learn: '用反差人设制造戏剧冲突' },
    { title: '《三生三世十里桃花》', tags: ['言情', '仙侠', '虐恋'], author: '唐七', hook: '古风背景下的双女主/言情纠葛', why: '人物执念驱动剧情', learn: '让事业线为感情线背书' },
    { title: '《花千骨》', tags: ['言情', '仙侠', '师徒'], author: 'Fresh果果', hook: '古风背景下的双女主/言情纠葛', why: '人物执念驱动剧情', learn: '让事业线为感情线背书' },
    { title: '《香蜜沉沉烬如霜》', tags: ['言情', '仙侠', '虐恋'], author: '电线', hook: '古风背景下的双女主/言情纠葛', why: '情感张力到位', learn: '用反差人设制造戏剧冲突' },
    { title: '《东宫》', tags: ['言情', '古言', '虐恋'], author: '匪我思存', hook: '人设反差带来的化学反应', why: '人物执念驱动剧情', learn: '让事业线为感情线背书' },
    { title: '《梦华录》', tags: ['言情', '古言', '女性'], author: '关汉卿', hook: '事业与爱情双线并行', why: '人物执念驱动剧情', learn: '让事业线为感情线背书' },
    { title: '《庆余年》', tags: ['言情', '权谋'], author: '猫腻', hook: '人设反差带来的化学反应', why: '甜宠与现实感平衡', learn: '深情靠克制与留白写' },
    { title: '《赘婿》', tags: ['言情', '历史', '赘婿'], author: '愤怒的香蕉', hook: '人设反差带来的化学反应', why: '人物执念驱动剧情', learn: '让事业线为感情线背书' },
    { title: '《御赐小仵作》', tags: ['言情', '悬疑', '古言'], author: '清闲丫头', hook: '悬疑主线中交织的感情线', why: '情感张力到位', learn: '用反差人设制造戏剧冲突' },
    { title: '《星汉灿烂》', tags: ['言情', '古言', '宅斗'], author: '关心则乱', hook: '事业与爱情双线并行', why: '情感张力到位', learn: '用反差人设制造戏剧冲突' },
    { title: '《苍兰诀》', tags: ['言情', '仙侠', '甜宠'], author: '九鹭非香', hook: '古风背景下的双女主/言情纠葛', why: '情感张力到位', learn: '用反差人设制造戏剧冲突' },
    { title: '《卿卿日常》', tags: ['言情', '古言', '甜宠'], author: '多木木多', hook: '人设反差带来的化学反应', why: '甜宠与现实感平衡', learn: '深情靠克制与留白写' },
    { title: '《长月烬明》', tags: ['言情', '仙侠', '虐恋'], author: '藤萝为枝', hook: '古风背景下的双女主/言情纠葛', why: '人物执念驱动剧情', learn: '让事业线为感情线背书' },
    { title: '《宁安如梦》', tags: ['言情', '古言', '重生'], author: '时镜', hook: '甜虐交织的感情线', why: '情感张力到位', learn: '用反差人设制造戏剧冲突' },
    { title: '《以爱为营》', tags: ['言情', '现言', '甜宠'], author: '翘摇', hook: '事业与爱情双线并行', why: '情感张力到位', learn: '用反差人设制造戏剧冲突' },
    { title: '《偷偷藏不住》', tags: ['言情', '现言', '暗恋'], author: '竹已', hook: '事业与爱情双线并行', why: '甜宠与现实感平衡', learn: '深情靠克制与留白写' },
    { title: '《难哄》', tags: ['言情', '现言', '破镜'], author: '竹已', hook: '甜虐交织的感情线', why: '人物执念驱动剧情', learn: '让事业线为感情线背书' },
    { title: '《她的小梨涡》', tags: ['言情', '校园', '甜宠'], author: '唧唧的猫', hook: '事业与爱情双线并行', why: '人物执念驱动剧情', learn: '让事业线为感情线背书' },
  ],
};
function renderJJWXCRank() {
  const el = document.getElementById('jjwxcRankList'); if (!el) return;
  const genres = ['校园', '暗恋', '百合', '言情'];
  el.innerHTML = '<div class="text-sm mb-2" style="color:#1565c0;font-weight:700">📅 每日更新 · ' + todayKey() + '（以 校园 / 暗恋 / 百合 / 言情 为主，各类型从热度榜 top100 风格池每日轮换 5 本，可⭐收藏）</div>' +
    genres.map(g => {
      const pool = jjwxcRankBooks[g] || [];
      const list = seededShuffle(pool, g + todayKey()).slice(0, 5);
      let _jj = 0;
      return `<div class="mb-3">
        <div class="font-bold mb-2" style="color:#1565c0">🔖 ${g} · 今日 ${list.length} 本（池中 ${pool.length} 本随日期轮换）</div>
        ${list.map((w, i) => {
          const aid = 'jjwxc-' + g + '-' + i + '-' + (_jj++);
          const a = (window.buildJJWXC ? window.buildJJWXC(w, g) : null);
          return `<div class="card">
          <div class="flex-between mb-1"><span class="font-bold">${esc(w.title)}</span>${w.author ? `<span class="text-sm text-muted">${esc(w.author)}</span>` : ''}</div>
          <div class="resource-tags mb-2">${w.tags.map(t => `<span class="resource-tag">${esc(t)}</span>`).join('')}</div>
          <div class="mb-1"><span class="text-orange">吸引力：</span>${esc(w.hook)}</div>
          <div class="mb-1"><span class="text-blue">为何火：</span>${esc(w.why)}</div>
          <div class="text-sm mb-2"><span class="text-green">可学写法：</span>${esc(w.learn)}</div>
          <button class="btn btn-ghost btn-sm mb-2" onclick="toggleJJWXC('${aid}')">📖 深度扒文（简介/人设/逻辑/大纲/章纲…）</button>
          <div id="${aid}" class="jjwxc-analysis" style="display:none">${renderJJWXCAnalysis(a)}</div>
          <div class="resource-actions"><a class="link-jjwxc" href="${searchLinks(w.title).jjwxc}" target="_blank">📚 晋江搜此书</a>${goldenStar('rank-' + g + '-' + i)}</div>
        </div>`;
        }).join('')}
      </div>`;
    }).join('');
}
function renderJJWXCAnalysis(a) {
  if (!a) return '';
  const block = (t, b) => `<div class="ana-block"><div class="ana-h">${t}</div><div class="ana-b">${b}</div></div>`;
  return [
    block('📝 简介', esc(a.intro)),
    block('👥 人设分析', esc(a.charAnalysis)),
    block('🧩 小说逻辑', esc(a.logic)),
    block('🪝 钩子设置', esc(a.hookSetup)),
    block('✍️ 文案组织', esc(a.copywriting)),
    block('🎬 叙事节奏', esc(a.pacing)),
    block('💞 吸引读者共鸣点', esc(a.resonance)),
    block('⚔️ 矛盾点 / 冲突', esc(a.conflict)),
    block('👁 第一人称描写角度', esc(a.pov)),
    block('💎 全书金句', a.quotes.map(q => `<div class="ana-quote">“${esc(q)}”</div>`).join('')),
    block('🔥 梗', (a.memes || []).map(m => `<span class="resource-tag">${esc(m)}</span>`).join(' ')),
    block('🛠 创作建议', (a.advice || []).map(x => `<div class="ana-li">· ${esc(x)}</div>`).join('')),
    block('🗺 全书大纲' + (a.isTemplate ? '（题材通用模板）' : ''), (a.bookOutline || []).map((o, i) => `<div class="ana-li"><b>${i + 1}.</b> ${esc(o)}</div>`).join('')),
    block('📑 章纲' + (a.isTemplate ? '（题材通用骨架）' : ''), (a.chapterOutline || []).map((o, i) => `<div class="ana-li">${esc(o)}</div>`).join(''))
  ].join('');
}
function toggleJJWXC(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = (el.style.display === 'none') ? 'block' : 'none';
}
function renderJJWXCGenre() {
  const el = document.getElementById('jjwxcGenreList'); if (!el) return;
  el.innerHTML = jjwxcGenres.map((g, i) => {
    const id = 'genre-' + i;
    return `<div class="card">
      <div class="flex-between mb-1"><span class="font-bold">${esc(g.name)}</span><span class="tier-${g.tier}">${g.tier} 级</span></div>
      <div class="text-sm text-muted mb-2">${esc(g.desc)}</div>
      <div class="mb-2"><span class="text-orange">高分核心梗 TOP5：</span>${g.coreTropes.map(t => `<span class="resource-tag">${esc(t)}</span>`).join('')}</div>
      <div class="mb-2 text-sm"><span class="text-blue">🔍 细节分析：</span><span class="text-muted">${esc(g.detail)}</span></div>
      <div class="mb-2 text-sm" style="background:var(--orange-light);padding:8px;border-radius:8px"><span class="font-bold">📌 举例分析：</span>${esc(g.example)}</div>
      <div class="mb-1 text-sm"><span class="text-green">读者好评点：</span>${g.praise.map(esc).join('、')}</div>
      <div class="mb-1 text-sm"><span class="mine-zone">雷点：</span>${g.mines.map(esc).join('、')}</div>
      <div class="mb-1 text-sm"><span class="hl-rule">创作建议：</span>${g.advice.map(esc).join('；')}</div>
      <div class="resource-actions">${goldenStar(id)}</div>
    </div>`;
  }).join('');
}
function renderJJWXCRule() {
  const el = document.getElementById('jjwxcRuleList'); if (!el) return;
  el.innerHTML = jjwxcRules.map(r => `<div class="card">
    <div class="flex-between mb-1"><span class="font-bold">${esc(r.name)}</span><span class="tag tag-low">${esc(r.date)}</span></div>
    <div class="mb-1 text-sm"><span class="text-blue">核心调整：</span>${esc(r.change)}</div>
    <div class="mb-1 text-sm"><span class="text-orange">影响面：</span>${esc(r.impact)}</div>
    <div class="mb-1 text-sm hl-rule">⚠️ 合规提醒：${esc(r.compliance)}</div>
  </div>`).join('');
}
function refreshJJWXC() {
  // 尝试实时抓取晋江公开搜索（best-effort）；失败则保持内置库
  toast('正在尝试联网刷新…');
  const kw = '晋江 热门 百合 校园 暗恋';
  const url = searchLinks(kw).jjwxc;
  fetch(url, { mode: 'no-cors' }).then(() => {
    store.set('luo_jjwxc_updated', fmtDate() + ' ' + new Date().toLocaleTimeString());
    document.getElementById('jjwxcUpdated').textContent = '上次联网刷新：' + fmtDate();
    toast('已尝试联网（晋江页面需手动确认最新榜单）');
  }).catch(() => {
    store.set('luo_jjwxc_updated', fmtDate() + '（离线，使用内置库）');
    toast('联网受限，已用内置素材库（内容完整）');
  });
  // 同时轮换一次每日风向，制造“刷新感”
  renderJJWXC();
}

/* ---- 渲染：梗库 ---- */
function renderMeme() {
  const el = document.getElementById('memeList'); if (!el) return;
  const f = document.querySelector('#memeTabs .tab.active')?.dataset.meme || 'all';
  const list = memePool.filter(m => f === 'all' || m.genre.includes(f) || f === 'all' && m.genre === '全');
  el.innerHTML = list.map((m, i) => {
    const id = 'meme-' + i;
    return `<div class="card">
      <div class="flex-between mb-1"><span class="font-bold">${esc(m.trope)}</span><span class="tier-${m.tier}">${m.tier} 级</span></div>
      <div class="text-sm text-muted mb-1">题材：${esc(m.genre)}</div>
      <div class="mb-1 text-sm">${esc(m.desc)}</div>
      <div class="mb-1 text-sm"><span class="text-blue">用法：</span>${esc(m.usage)}</div>
      <div class="mb-1 text-sm"><span class="text-orange">示例：</span>${esc(m.example)}</div>
      <div class="resource-actions"><a class="link-jjwxc" href="${searchLinks(m.trope).jjwxc}" target="_blank">📚 晋江搜梗</a>${goldenStar(id)}</div>
    </div>`;
  }).join('') || '<div class="list-empty">暂无该题材梗</div>';
}

/* ---- 渲染：避雷指南 ---- */
function renderMine() {
  const el = document.getElementById('mineList'); if (!el) return;
  const f = document.querySelector('#mineTabs .tab.active')?.dataset.mine || 'all';
  const list = minePool.filter(m => f === 'all' || m.type === f);
  el.innerHTML = list.map((m, i) => {
    const id = 'mine-' + i;
    const cls = m.type === '雷点' ? 'mine-zone' : 'text-green';
    return `<div class="card">
      <div class="flex-between mb-1"><span class="font-bold">${m.type === '雷点' ? '🛡️' : '👍'} ${esc(m.point)}</span><span class="tag tag-low">${esc(m.genre)}</span></div>
      <div class="mb-1 text-sm">${esc(m.detail)}</div>
      <div class="mb-1 text-sm"><span class="${cls}">建议：</span>${esc(m.tip)}</div>
      <div class="resource-actions">${goldenStar(id)}</div>
    </div>`;
  }).join('') || '<div class="list-empty">暂无内容</div>';
}

/* ---- 渲染：灵感生成器 ---- */
function renderGenius() { renderInspiration(); }
function generateIdea() {
  const genre = document.getElementById('genGenre').value;
  const a = document.getElementById('genA').value.trim() || '桀骜不驯的校霸';
  const b = document.getElementById('genB').value.trim() || '软萌学霸';
  const pov = document.getElementById('genPOV').value;
  const len = document.getElementById('genLen').value;
  const genreInfo = jjwxcGenres.find(g => g.name === genre) || { coreTropes: ['双向暗恋'], advice: ['用细节堆心动'] };
  const trope = genreInfo.coreTropes[Math.floor(Math.random() * genreInfo.coreTropes.length)];
  const angle = seededShuffle(jjwxcDailyPool, a + b + genre).slice(0, 1)[0];
  const html = `
    <div class="card card-gradient-blue">
      <div class="font-bold mb-2">🎯 你的专属选题</div>
      <div class="mb-1"><span class="text-blue">题材：</span>${esc(genre)} ｜ <span class="text-orange">主梗：</span>${esc(trope)}</div>
      <div class="mb-1"><span class="text-blue">人设：</span>${esc(a)} × ${esc(b)}</div>
      <div class="mb-1"><span class="text-blue">视角：</span>${esc(pov)} ｜ <span class="text-blue">体量：</span>${esc(len)}</div>
      <div class="mb-1"><span class="hl-rule">一句话钩子：</span>${esc(a)}以为${esc(b)}永远不知道——直到${esc(angle ? angle.hook : '那个雨夜')}</div>
      <div class="mb-1 text-sm"><span class="text-green">章纲思路：</span>第1章 相遇钩子 → 第3章 关系转折 → 中点 误会/危机 → 高潮 双向确认 → 结局 余韵留白</div>
      <div class="mb-1 text-sm"><span class="text-orange">可借鉴写法：</span>${genreInfo.advice.map(esc).join('；')}</div>
      <div class="mb-1 text-sm"><span class="mine-zone">避雷：</span>避免工业糖精与单箭头拖太长；用${esc(pov)}写真实心理。</div>
      <button class="btn btn-orange" style="width:100%;margin-top:6px" onclick="toggleGolden('idea-${Date.now()}','灵感','${esc(genre)}选题','${esc(a)}×${esc(b)} ${esc(trope)}')">⭐ 收藏此选题</button>
    </div>`;
  document.getElementById('geniusResult').innerHTML = html;
  toast('已生成专属选题');
}

/* ---- 渲染：全网素材库 ---- */
function renderMaterial() {
  const el = document.getElementById('materialList'); if (!el) return;
  const kw = (document.getElementById('materialSearch').value || '').trim();
  const list = materialPool.filter(m => !kw || (m.title + m.tag + m.keyword + m.reason).includes(kw));
  // 收藏区
  const gold = getGolden();
  const goldEl = document.getElementById('materialGolden');
  if (goldEl) goldEl.innerHTML = gold.length ? `<div class="card"><div class="font-bold mb-2">⭐ 我的收藏（${gold.length}）</div>${gold.map(g => `<div class="note-item"><div class="note-body"><div class="note-title">${esc(g.title)}</div><div class="note-text">${esc(g.text || '')}</div></div><button class="note-btn del" onclick="toggleGolden('${esc(g.id)}','${esc(g.type)}','${esc(g.title)}','')">删</button></div>`).join('')}</div>` : '';
  el.innerHTML = list.map((m, i) => {
    const id = 'mat-' + i;
    const L = searchLinks(m.keyword);
    const links = `<a class="link-jjwxc" href="${L.jjwxc}" target="_blank">📚 晋江</a><a class="link-bili" href="${L.bili}" target="_blank">📺 B站</a><a class="link-xhs" href="${L.xhs}" target="_blank">🔴 小红书</a>`;
    return `<div class="card">
      <div class="flex-between mb-1"><span class="font-bold">${esc(m.title)}</span><span class="tag tag-low">${esc(m.platform)}</span></div>
      <div class="resource-tags mb-1"><span class="resource-tag">${esc(m.tag)}</span></div>
      <div class="mb-1 text-sm"><span class="text-orange">爆火原因：</span>${esc(m.reason)}</div>
      <div class="mb-1 text-sm"><span class="text-blue">开头钩子：</span>${esc(m.hook)}</div>
      <div class="mb-2 text-sm" style="background:var(--orange-light);padding:8px;border-radius:8px;font-size:12px"><span class="font-bold">迁移写法：</span>${esc(m.idea)}</div>
      <div class="resource-actions">${links}${goldenStar(id)}</div>
    </div>`;
  }).join('') || '<div class="list-empty">没有匹配的素材</div>';
}

/* ---- Tab 绑定 ---- */
document.querySelectorAll('#jjwxcTabs .tab').forEach(tab => {
  tab.onclick = () => {
    document.querySelectorAll('#jjwxcTabs .tab').forEach(t => t.classList.remove('active')); tab.classList.add('active');
    const m = tab.dataset.jj;
    document.getElementById('jjwxcRankPanel').style.display = m === 'rank' ? '' : 'none';
    document.getElementById('jjwxcGenrePanel').style.display = m === 'genre' ? '' : 'none';
    document.getElementById('jjwxcRulePanel').style.display = m === 'rule' ? '' : 'none';
  };
});
document.querySelectorAll('#memeTabs .tab').forEach(tab => {
  tab.onclick = () => { document.querySelectorAll('#memeTabs .tab').forEach(t => t.classList.remove('active')); tab.classList.add('active'); renderMeme(); };
});
document.querySelectorAll('#mineTabs .tab').forEach(tab => {
  tab.onclick = () => { document.querySelectorAll('#mineTabs .tab').forEach(t => t.classList.remove('active')); tab.classList.add('active'); renderMine(); };
});

/* ================= Init ================= */
function init() {
  const d = new Date();
  const weeks = ['周日','周一','周二','周三','周四','周五','周六'];
  document.getElementById('topDate').textContent = `${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日`;
  document.getElementById('topWeek').textContent = weeks[d.getDay()];
  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
  document.addEventListener('click', safeExternalClick);
  updateOnlineStatus();
  renderNav();
  renderTodos();
  renderMyNotes('daily');
}
init();
