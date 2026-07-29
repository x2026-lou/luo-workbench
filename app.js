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
  set: (k, v) => localStorage.setItem(k, JSON.stringify(v))
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

function encodeQuery(s) { return encodeURIComponent(s); }
function searchLinks(keyword) {
  return {
    bili: `https://search.bilibili.com/all?keyword=${encodeQuery(keyword)}`,
    douyin: `https://www.douyin.com/search/${encodeQuery(keyword)}`,
    xhs: `https://www.xiaohongshu.com/search_result?keyword=${encodeQuery(keyword)}`
  };
}

function resourceCard(item) {
  const links = [];
  if (item.bili) links.push(`<a class="link-bili" href="${item.bili}" target="_blank">📺 B站</a>`);
  if (item.douyin) links.push(`<a class="link-douyin" href="${item.douyin}" target="_blank">🎵 抖音</a>`);
  if (item.xhs) links.push(`<a class="link-xhs" href="${item.xhs}" target="_blank">📕 小红书</a>`);
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

/* ================= Daily Plan & Rewards ================= */
const defaultMustDos = [
  { id: 'md_exercise', text: '运动 45 分钟', minutes: 45, points: 20, done: false },
  { id: 'md_guitar', text: '乐器练习 1 小时', minutes: 60, points: 20, done: false },
  { id: 'md_english', text: '英语练习 30 分钟', minutes: 30, points: 20, done: false }
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
          <div class="mustdo-icon">${['🏃','🎸','🌍'][idx] || '✨'}</div>
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
}
function deleteReview(id) { reviews = reviews.filter(x => x.id !== id); saveReviews(); }

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
  { icon: '🎯', title: '事业编·公基速记口诀', desc: '法律/政治/经济高频考点口诀化', tags: ['事业编','公基'] }
], v => v.title);

const examQuizData = [
  { q: '行测中“类比推理”属于哪个模块？', opts: ['言语理解', '判断推理', '数量关系'], a: 1 },
  { q: '申论作答应优先使用材料中的？', opts: ['原词原句', '华丽辞藻', '个人经历'], a: 0 }
];
let eqIdx = 0, eqAnswered = false;
function renderExam() {
  document.getElementById('examVideoList').innerHTML = videoList('exam', examVideos);
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
  { icon: '🦴', title: '系统解剖学基础（霍琨版）', desc: '医学本科必修，手绘解剖图记忆法', tags: ['解剖','专业课'] },
  { icon: '🫀', title: '生理学入门精讲', desc: '细胞/循环/呼吸/泌尿生理机制', tags: ['生理','专业课'] },
  { icon: '🧬', title: '病理学重点总结', desc: '炎症/肿瘤/心血管病理核心', tags: ['病理','专业课'] },
  { icon: '💊', title: '药理学速记', desc: '药物作用机制与临床应用', tags: ['药理','专业课'] }
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
  { title: 'Kpop 燃脂舞跟练', angle: '健身+娱乐', script: '跳完这首IVE新歌，我暴汗了 but 好开心', shots: '全身跟练+歌词字幕+卡路里计数' }
];
function renderInspiration() {
  const shuffled = [...inspirationPool].sort(() => 0.5 - Math.random()).slice(0, 3);
  document.getElementById('inspirationList').innerHTML = shuffled.map(item => `
    <div class="card">
      <div class="font-bold mb-2">${item.title}</div>
      <div class="text-sm text-muted mb-2">角度：${item.angle}</div>
      <div class="mb-2"><span class="text-blue">文案钩子：</span>${item.script}</div>
      <div class="text-sm"><span class="text-orange">镜头思路：</span>${item.shots}</div>
    </div>
  `).join('');
}
function refreshInspiration() { renderInspiration(); toast('灵感已刷新'); }

/* ================= Viral ================= */
let viralVideos = store.get('luo_viral', [
  { title: '“早八人 5 分钟出门妆”', platform: '抖音', tag: '美妆/通勤', reason: '切中打工人早起痛点，5分钟低门槛', hook: '开头直接展示素颜→全妆对比', idea: '改编为“考公人 5 分钟提神妆”或“通勤英语跟读 5 分钟”', bili: searchLinks('早八人5分钟出门妆').bili, douyin: 'https://www.douyin.com/search/5%E5%88%86%E9%92%9F%E5%87%BA%E9%97%A8%E5%A6%86' },
  { title: '“挑战 30 天瘦 10 斤”', platform: '得物/抖音', tag: '健身/挑战', reason: '强目标+强反差，适合追更', hook: 'Day1 体重秤特写+目标语音', idea: '改编为“30 天英语听力逆袭”或“30 天考公作息挑战”', bili: searchLinks('挑战30天瘦10斤').bili, douyin: 'https://www.douyin.com/search/30%E5%A4%A9%E7%98%A610%E6%96%A4' },
  { title: '“办公室低预算穿搭”', platform: '抖音', tag: '穿搭/职场', reason: '实用性强，评论区求链接', hook: '月薪三千怎么穿得像一万', idea: '改编为“考公人平价学习装备”或“大学生平价实习穿搭”', bili: searchLinks('办公室低预算穿搭').bili, douyin: 'https://www.douyin.com/search/%E4%BD%8E%E9%A2%84%E7%AE%97%E7%A9%BF%E6%90%AD' }
]);
function renderViral() {
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
      </div>
    </div>
  `).join('');
}
function mockCrawl() {
  toast('正在模拟采集…');
  setTimeout(() => {
    const newItems = [
      { title: '“下班后做自媒体第 N 天”', platform: '抖音', tag: '自媒体/成长', reason: '素人逆袭叙事，追更欲强', hook: '今天是我做自媒体的第 47 天，收入终于破千了', idea: '改编为“下班后学英语第 N 天”系列，每天晒单词打卡', bili: searchLinks('下班后做自媒体第N天').bili, douyin: 'https://www.douyin.com/search/%E4%B8%8B%E7%8F%AD%E5%90%8E%E5%81%9A%E8%87%AA%E5%AA%92%E4%BD%93' },
      { title: '“体制内上岸后的一天”', platform: '抖音', tag: '考公/日常', reason: '目标群体精准，评论区许愿', hook: '上岸前我以为会轻松，上岸后发现…', idea: '改编为“医学生考编上岸经验”或“本科医学生上岸日记”', bili: searchLinks('体制内上岸后的一天').bili, douyin: 'https://www.douyin.com/search/%E4%BD%93%E5%88%B6%E5%86%85%E4%B8%8A%E5%B2%B8%E5%90%8E%E7%9A%84%E4%B8%80%E5%A4%A9' }
    ];
    viralVideos = newItems.concat(viralVideos).slice(0, 6);
    store.set('luo_viral', viralVideos);
    renderViral();
    toast('已采集 ' + newItems.length + ' 条爆款');
  }, 1200);
}

/* ================= Editing ================= */
let editProgress = store.get('luo_edit_progress', [
  { title: '第1课：文案钩子 7 大模板', desc: '开头3秒留人公式，反差/悬念/数字钩子拆解', tags: ['文案','口播'], done: false },
  { title: '第2课：剪映调色思路·ins风', desc: '低饱和奶油色调参数，一键出ins感', tags: ['调色','剪映'], done: false },
  { title: '第3课：5种必学运镜手法', desc: '推拉摇移跟，手机拍出电影感', tags: ['拍摄','运镜'], done: false },
  { title: '第4课：卡点剪辑从0到1', desc: '踩点标记+节拍自动对齐，10分钟学会卡点', tags: ['剪辑','卡点'], done: false }
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
function renderRecruit() {
  const jobs = [
    { title: '医院临床/医技岗位（编内）', loc: '各省三甲医院', edu: '本科全日制医学学位', major: '临床医学/医学影像等', link: 'https://www.baidu.com/s?wd=医院招聘医学本科2026' },
    { title: '疾控中心公共卫生岗', loc: '市/县级疾控中心', edu: '本科及以上', major: '预防医学/临床医学', link: 'https://www.baidu.com/s?wd=疾控中心招聘医学本科' },
    { title: '卫健委/医保局行政岗', loc: '地市机关', edu: '本科及以上', major: '医学类', link: 'https://www.baidu.com/s?wd=卫健委招聘医学专业' },
    { title: '医学院校教辅/实验员', loc: '医学院校', edu: '本科及以上', major: '医学相关', link: 'https://www.baidu.com/s?wd=医学院校招聘教辅医学本科' },
    { title: '医学编辑 / 医学内容运营', loc: '医药企业/健康平台', edu: '本科及以上', major: '医学类', link: 'https://www.baidu.com/s?wd=医学编辑招聘' }
  ];
  document.getElementById('recruitList').innerHTML = jobs.map(j => `
    <div class="resource-card">
      <div class="resource-body">
        <div class="resource-title">${j.title}</div>
        <div class="resource-meta">📍 ${j.loc} · 🎓 ${j.edu} · 📖 ${j.major}</div>
        <div class="resource-actions"><a class="link-web" href="${j.link}" target="_blank">查看详情</a></div>
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
  { icon: '🎾', title: '网球实用教学·零基础入门', desc: '握拍/发球/正反手基础动作', tags: ['网球','运动'], iconBg: 'var(--purple-light)' }
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
  { title: '知乎盐选短篇爆款结构', tag: '短篇/爽文', points: '前三句必出冲突，500字一个小反转', apply: '开头直接写矛盾，避免大段背景' }
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
      <div class="font-bold mb-2">${s.name}</div>
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
  scripts.unshift({ id: Date.now(), name, hook: document.getElementById('scriptHook').value, conflict: document.getElementById('scriptConflict').value, learn: document.getElementById('scriptLearn').value });
  store.set('luo_scripts', scripts);
  ['scriptName','scriptHook','scriptConflict','scriptLearn'].forEach(id => document.getElementById(id).value = '');
  renderNovel();
}
function deleteScript(id) { scripts = scripts.filter(s => s.id !== id); store.set('luo_scripts', scripts); renderNovel(); }

/* ================= Image Management ================= */
const makeupVideos = makeSearchItems([
  { icon: '💄', title: '少年感中性风妆容教程', desc: '干净底妆+自然眉形+修容弱化柔感', tags: ['妆容','中性风'] },
  { icon: '🪞', title: '伪素颜 5 分钟出门妆', desc: '学生党/通勤党快速出门公式', tags: ['淡妆','日常'] },
  { icon: '✨', title: '眉毛画法·英气眉 vs 柔和眉', desc: '根据脸型选择眉形，提升少年感', tags: ['眉毛','妆容'] }
], v => v.title);
const outfitVideos = makeSearchItems([
  { icon: '👕', title: '少年感中性风穿搭公式', desc: '基础款叠穿，低饱和配色', tags: ['穿搭','中性风'] },
  { icon: '👖', title: '直筒裤/工装裤挑选指南', desc: '修饰腿型，拉长比例', tags: ['下装','穿搭'] },
  { icon: '👟', title: '胶囊衣橱·10件单品搭30套', desc: '少买多搭，提升利用率', tags: ['衣橱','搭配'] }
], v => v.title);
let wardrobe = store.get('luo_wardrobe', []);
function renderImage() {
  document.getElementById('makeupVideoList').innerHTML = videoList('makeup', makeupVideos);
  document.getElementById('outfitVideoList').innerHTML = videoList('outfit', outfitVideos);
  renderWardrobe();
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
    wardrobe.push({ id: Date.now(), name: '单品 ' + (wardrobe.length + 1), img: e.target.result });
    store.set('luo_wardrobe', wardrobe);
    renderWardrobe();
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
  { icon: '🧠', title: '《认知觉醒》读书笔记', desc: '元认知与刻意练习', tags: ['认知','成长'] }
], v => v.title);
let excerpts = store.get('luo_excerpts', []);
function renderBooks() {
  document.getElementById('bookVideoList').innerHTML = videoList('books', bookVideos);
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

/* ================= Drawing ================= */
const drawingVideos = makeSearchItems([
  { icon: '🧸', title: 'QQ人零基础画法', desc: '头身比、表情、动态入门', tags: ['QQ人','零基础'] },
  { icon: '💑', title: 'CP产粮 2D 画风教程', desc: '双人互动构图与氛围上色', tags: ['CP','2D'] },
  { icon: '✋', title: '手部/人体结构简化', desc: '用几何体概括人体', tags: ['人体','基础'] },
  { icon: '🎨', title: 'Procreate/画世界上色流程', desc: '线稿、铺色、光影、细化', tags: ['上色','软件'] }
], v => v.title);
function renderDrawing() { document.getElementById('drawingVideoList').innerHTML = videoList('drawing', drawingVideos); }

/* ================= Guitar ================= */
const guitarVideos = makeSearchItems([
  { icon: '🎼', title: '吉他乐谱基础知识', desc: '六线谱、和弦图、节奏型', tags: ['乐理','入门'] },
  { icon: '🖐️', title: '常用和弦指法与转换', desc: 'C/G/Am/Em/F 等基础和弦', tags: ['和弦','指法'] },
  { icon: '🎵', title: '简单弹唱曲目跟练', desc: '适合新手的 10 首入门歌', tags: ['弹唱','跟练'] },
  { icon: '⚡', title: '爬格子与手指独立性训练', desc: '每日 10 分钟基本功', tags: ['基本功','练习'] }
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
  { icon: '🥦', title: '清炒时蔬万能公式', desc: '保持翠绿爽口的秘诀', tags: ['蔬菜','健康'] }
], v => v.title);
const dessertVideos = makeSearchItems([
  { icon: '🍮', title: '焦糖布丁（烤箱版）', desc: '简单三步，新手零失败', tags: ['甜品','烤箱'] },
  { icon: '🍰', title: '微波炉蛋糕 2 分钟', desc: '无需打发，搅拌即烤', tags: ['甜品','微波炉'] },
  { icon: '🍦', title: '酸奶水果杯', desc: '低卡简单，随手做', tags: ['甜品','免烤'] }
], v => v.title);
const snackVideos = makeSearchItems([
  { icon: '🍗', title: '空气炸锅奥尔良鸡翅', desc: '少油酥脆，懒人必备', tags: ['空气炸锅','小吃'] },
  { icon: '🍟', title: '烤箱烤薯角', desc: '外脆里糯，追剧小食', tags: ['烤箱','小吃'] },
  { icon: '🌽', title: '微波炉爆米花', desc: '3 分钟搞定，健康少油', tags: ['微波炉','零食'] }
], v => v.title);
function renderKitchen() {
  document.getElementById('cookVideoList').innerHTML = videoList('kitchen', cookVideos);
  document.getElementById('dessertVideoList').innerHTML = videoList('kitchen', dessertVideos);
  document.getElementById('snackVideoList').innerHTML = videoList('kitchen', snackVideos);
}
document.querySelectorAll('#kitchenTabs .tab').forEach(tab => {
  tab.onclick = () => {
    const mode = tab.dataset.kit;
    document.querySelectorAll('#kitchenTabs .tab').forEach(t => t.classList.remove('active')); tab.classList.add('active');
    document.getElementById('kitchenCookPanel').style.display = mode === 'cook' ? 'block' : 'none';
    document.getElementById('kitchenDessertPanel').style.display = mode === 'dessert' ? 'block' : 'none';
    document.getElementById('kitchenSnackPanel').style.display = mode === 'snack' ? 'block' : 'none';
    document.getElementById('kitchenPrepPanel').style.display = mode === 'prep' ? 'block' : 'none';
  };
});

/* ================= Self-media ================= */
const mediaVideos = makeSearchItems([
  { icon: '📈', title: '抖音起号涨粉底层逻辑', desc: '标签、完播率、互动率解析', tags: ['抖音','运营'] },
  { icon: '💰', title: '小红书变现路径拆解', desc: '涨粉、接广、带货、知识付费', tags: ['小红书','变现'] },
  { icon: '🎬', title: '爆款短视频脚本公式', desc: '钩子+痛点+解决方案+转化', tags: ['脚本','爆款'] },
  { icon: '📊', title: '自媒体数据分析入门', desc: '看懂后台数据，优化内容', tags: ['数据','复盘'] }
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
  { icon: '💻', title: '计算机二级 office 考前冲刺', desc: '真题讲解与操作技巧', tags: ['二级','考证'] }
], v => v.title);
function renderOffice() { document.getElementById('officeVideoList').innerHTML = videoList('office', officeVideos); }

/* ================= EQ ================= */
const eqVideos = makeSearchItems([
  { icon: '🗣️', title: '高情商回话技巧', desc: '尴尬场合如何自然接话', tags: ['沟通','回话'] },
  { icon: '🤝', title: '社交边界感建立', desc: '既不讨好也不冷漠的相处方式', tags: ['社交','边界'] },
  { icon: '😊', title: '职场新人高情商话术', desc: '请教、拒绝、汇报的表达方式', tags: ['职场','话术'] },
  { icon: '❤️', title: '亲密关系中的情绪表达', desc: '非暴力沟通四步法', tags: ['情绪','沟通'] }
], v => v.title);
function renderEq() { document.getElementById('eqVideoList').innerHTML = videoList('eq', eqVideos); }

/* ================= AI Prompts ================= */
const aiPrompts = [
  { title: '数据分析：帮我分析本月收支', prompt: '我是一位学生/职场新人，请根据以下收支数据帮我分析消费结构、指出可优化项，并给出下月预算建议。数据如下：' },
  { title: '学习规划：制定一周学习计划', prompt: '请帮我制定一份一周学习计划，每天学习时间为晚上 19:00-22:00，科目包括英语、医学专业、考公行测，要求劳逸结合，并包含复习与测试。' },
  { title: '内容创作：给短视频写脚本', prompt: '请为一条“医学生日常学习vlog”短视频写一段 30 秒脚本，包含开头钩子、中间内容、结尾引导点赞关注，风格轻松真实。' },
  { title: '高情商表达：如何委婉拒绝', prompt: '请帮我写一段委婉拒绝别人但不得罪人的话术，场景是：朋友想让我帮忙做一件我做不到的事。要求真诚、有边界感。' }
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
  renderNav();
  renderTodos();
}
init();
