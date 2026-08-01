/* ================= Navigation ================= */
const navItems = [
  { id: 'daily', icon: '📅', label: '每日计划' },
  { id: 'review', icon: '📊', label: '内容复盘' },
  { id: 'english', icon: '🌍', label: '英语学习' },
  { id: 'exam', icon: '📚', label: '考公考编学习' },
  { id: 'medical', icon: '🩺', label: '医学专业课学习' },
  { id: 'inspiration', icon: '💡', label: '选题每日灵感' },
  { id: 'viral', icon: '🔥', label: '爆款热点视频/二创' },
  { id: 'edit', icon: '🎬', label: '拍摄剪辑学习' },
  { id: 'recruit', icon: '💼', label: '招聘信息', badge: 3 },
  { id: 'fitness', icon: '💪', label: '每日健身' },
  { id: 'finance', icon: '💰', label: '理财基金金融学习' },
  { id: 'novel', icon: '✍️', label: '爆款小说拆分/写作教学' },
  { id: 'image', icon: '🪞', label: '形象管理', new: true },
  { id: 'books', icon: '📖', label: '书籍推荐/拆书', new: true },
  { id: 'drawing', icon: '🎨', label: '实用绘画教学', new: true },
  { id: 'guitar', icon: '🎸', label: '吉他实用教学', new: true },
  { id: 'kitchen', icon: '🍳', label: '厨房小白/烹饪', new: true },
  { id: 'media', icon: '📱', label: '自媒体干货学习', new: true },
  { id: 'travel', icon: '✈️', label: '旅行攻略分享', new: true },
  { id: 'office', icon: '💻', label: '办公技能学习', new: true },
  { id: 'eq', icon: '💬', label: '情商提升', new: true },
  { id: 'ai', icon: '🤖', label: 'AI口令/数据分析', new: true }
];

let currentPage = 'daily';
function renderNav() {
  const list = document.getElementById('navList');
  list.innerHTML = navItems.map(item => `
    <div class="nav-item ${item.id === currentPage ? 'active' : ''}" data-id="${item.id}" onclick="goPage('${item.id}')">
      <div class="nav-icon">${item.icon}</div>
      <div class="nav-text">${item.label}</div>
      ${item.badge ? `<div class="nav-badge">${item.badge}</div>` : ''}
      ${item.new ? `<div class="nav-new">NEW</div>` : ''}
    </div>
  `).join('');
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
    eq: renderEq, ai: renderAi
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
    xhs: `https://www.xiaohongshu.com/search?keyword=${encodeQuery(keyword)}`
  };
}

function resourceCard(item) {
  const links = [];
  if (item.bili) links.push(`<a class="link-bili" href="${item.bili}" target="_blank">📺 B站</a>`);
  if (item.douyin) links.push(`<a class="link-douyin" href="${item.douyin}" target="_blank">🎵 抖音</a>`);
  if (item.xhs) links.push(`<a class="link-xhs" href="${item.xhs}" target="_blank">🔴 小红书</a>`);
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

function levelFor(pts) {
  if (pts >= 2000) return { lv: 10, title: '全能王者' };
  if (pts >= 1500) return { lv: 9, title: '自律大师' };
  if (pts >= 1200) return { lv: 8, title: '进阶达人' };
  if (pts >= 900) return { lv: 7, title: '学习标兵' };
  if (pts >= 600) return { lv: 6, title: '执行高手' };
  if (pts >= 400) return { lv: 5, title: '坚持之星' };
  if (pts >= 250) return { lv: 4, title: '努力进阶' };
  if (pts >= 150) return { lv: 3, title: '稳步提升' };
  if (pts >= 80) return { lv: 2, title: '初出茅庐' };
  return { lv: 1, title: '新手启程' };
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
  document.getElementById('statLevel').textContent = 'Lv' + lvl.lv;

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
function renderInspiration() {
  const shuffled = seededShuffle(inspirationPool, todayKey()).slice(0, 3);
  document.getElementById('inspirationList').innerHTML = shuffled.map(item => `
    <div class="card">
      <div class="font-bold mb-2">${item.title}</div>
      <div class="text-sm text-muted mb-2">角度：${item.angle}</div>
      <div class="mb-2"><span class="text-blue">文案钩子：</span>${item.script}</div>
      <div class="text-sm"><span class="text-orange">镜头思路：</span>${item.shots}</div>
    </div>
  `).join('');
}
function refreshInspiration() {
  const shuffled = [...inspirationPool].sort(() => Math.random() - 0.5).slice(0, 3);
  document.getElementById('inspirationList').innerHTML = shuffled.map(item => `
    <div class="card">
      <div class="font-bold mb-2">${item.title}</div>
      <div class="text-sm text-muted mb-2">角度：${item.angle}</div>
      <div class="mb-2"><span class="text-blue">文案钩子：</span>${item.script}</div>
      <div class="text-sm"><span class="text-orange">镜头思路：</span>${item.shots}</div>
    </div>
  `).join('');
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
  { title: '爽文“打脸”结构模板', tag: '男频/爽文', points: '被轻视-展现实力-众人震惊三幕', apply: '把反派写得越狂，打脸越爽' }
];
const novelTeaches = makeSearchItems([
  { icon: '✍️', title: '小说开头怎么写才吸引人', desc: '黄金三章与开头冲突设计', tags: ['写作技巧'] },
  { icon: '🎭', title: '人物小传与角色弧光', desc: '从动机到转变的完整塑造', tags: ['人物塑造'] },
  { icon: '⚡', title: '爽文节奏与卡点技巧', desc: '章节末尾留钩子的 6 种方法', tags: ['节奏把控'] },
  { icon: '💼', title: '短篇小说投稿平台指南', desc: '知乎/番茄/晋江/UC 签约与变现', tags: ['投稿变现'] }
], v => v.title);
let scripts = store.get('luo_scripts', []);
function renderNovel() {
  document.getElementById('novelSplitList').innerHTML = novelSplits.map(n => `
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
function renderDrawing() { document.getElementById('drawingVideoList').innerHTML = videoList('drawing', drawingVideos); }

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
  pendingRecipePhoto = '';
  document.getElementById('recipeName').value = ''; document.getElementById('recipePrice').value = ''; document.getElementById('recipePrep').value = ''; document.getElementById('recipePhoto').value = ''; document.getElementById('recipePhotoPreview').innerHTML = '';
  renderRecipes();
  toast('已保存到菜谱');
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
let travelPlans = store.get('luo_travel_plans', []);
function renderTravel() {
  document.getElementById('travelVideoList').innerHTML = videoList('travel', travelVideos);
  document.getElementById('travelPlanList').innerHTML = travelPlans.length ? travelPlans.map(p => `
    <div class="card-flat">
      <div class="flex-between mb-2"><span class="font-bold">${p.dest}</span><span class="text-sm text-muted">${p.days}</span></div>
      <div class="text-sm text-muted">${p.plan}</div>
      <button class="btn btn-outline btn-small mt-2" onclick="deleteTravelPlan(${p.id})">删除</button>
    </div>
  `).join('') : '<div class="list-empty">暂无旅行攻略</div>';
}
function addTravelPlan() {
  const dest = document.getElementById('travelDest').value.trim();
  const days = document.getElementById('travelDays').value.trim();
  const plan = document.getElementById('travelPlan').value.trim();
  if (!dest) return toast('请填写目的地');
  travelPlans.unshift({ id: Date.now(), dest, days, plan });
  store.set('luo_travel_plans', travelPlans);
  document.getElementById('travelDest').value = '';
  document.getElementById('travelDays').value = '';
  document.getElementById('travelPlan').value = '';
  renderTravel();
}
function deleteTravelPlan(id) { travelPlans = travelPlans.filter(p => p.id !== id); store.set('luo_travel_plans', travelPlans); renderTravel(); }

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
  { title: '读书拆解：把书变成思维导图', prompt: '请把《[书名]》拆解为思维导图大纲：核心观点、章节逻辑、金句、可迁移到自媒体的选题点。' }
];
function renderAi() {
  document.getElementById('aiPromptList').innerHTML = aiPrompts.map((p, i) => `
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
  navigator.clipboard?.writeText(aiPrompts[i].prompt).then(() => toast('已复制提示词')).catch(() => toast('复制失败，请手动复制'));
}

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
