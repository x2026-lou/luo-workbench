/* =====================================================================
   洛的工作台 · 扩展模块 expansion.js
   新增：单词背诵 / 小说创作进阶 / 视频脚本灵感 / 剪辑打卡 /
        好物记录 / 奖励·每日评价 / 每日复盘 / 拉片 / 记账 /
        时令菜品 / 好书拆分 / 考公每日一测 / 实时招聘
   复用 app.js 全局：store / seededShuffle / todayKey / searchLinks /
        toast / esc / fmtDate / getGolden / toggleGolden / goldenStar /
        totalPoints / mustDos / levelFor
   ===================================================================== */

/* ---------- 通用：收藏星标 ---------- */
function gstar(id, type, title, text) {
  const on = isGolden(id);
  return `<button class="golden-star ${on ? 'on' : ''}" onclick="toggleGolden('${esc(id)}','${esc(type)}','${esc(title)}','${esc(text || '')}')">${on ? '★' : '☆'}</button>`;
}
/* 通用 tab 切换（新页面使用 data-panel） */
function switchTab(tabEl, panelId) {
  const page = tabEl.closest('.page');
  tabEl.parentElement.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  tabEl.classList.add('active');
  page.querySelectorAll('[data-panel]').forEach(p => p.style.display = 'none');
  const target = page.querySelector('[data-panel="' + panelId + '"]');
  if (target) target.style.display = 'block';
}

/* ===================================================================
   ② 单词背诵（近5年四级真题高频词 / 考频 / 分组 / 随堂测试 / 语法 / 口语）
   说明：以下为基于近5年（2021-2025）四级真题词频整理的高频词精选集，
        考频标注 高/中/低；背完一组自动换下一批，随堂测试实时出题。
   =================================================================== */
let cetWords = window.cet4FullWords || [
  { w: 'abandon', ph: '/əˈbændən/', pos: 'v.', cn: '放弃；抛弃', freq: '高', ex: 'He abandoned the plan.' }
];
const VOCAB_BATCH = 10;
let vocabState = store.get('luo_vocab_state', { batch: 0, learned: [] });

/* 单词增强：考频标注 + 有趣助记（来自 cet4_enhance.js，运行一次） */
(function enrichCetWords() {
  const high = new Set(window.cet4FreqHigh || []);
  const mid = new Set(window.cet4FreqMid || []);
  const gen = window.cet4GenMnem;
  cetWords.forEach(w => {
    if (!w.freq) w.freq = high.has(w.w) ? '高' : mid.has(w.w) ? '中' : '低';
    if (!w.mnem && gen) { const m = gen(w.w, w.cn); if (m) w.mnem = m; }
  });
})();
/* 导入词典：合并用户自定义单词（持久化 luo_vocab_custom） */
const VOCAB_CUSTOM_KEY = 'luo_vocab_custom';
let vocabCustom = store.get(VOCAB_CUSTOM_KEY, []);
function applyCustomWords() {
  if (vocabCustom.length) {
    vocabCustom.forEach(c => cetWords.push({ w: c.w, ph: c.ph || '', pos: c.pos || '', cn: c.cn, ex: c.ex || '', freq: '自', mnem: c.mnem || '' }));
  }
}
applyCustomWords();
function importWords() {
  const ta = document.getElementById('vocabImportInput'); if (!ta) return;
  const lines = ta.value.split('\n').map(s => s.trim()).filter(Boolean);
  let added = 0;
  lines.forEach(line => {
    const p = line.split('|').map(s => s.trim());
    if (!p[0]) return;
    const w = {
      w: p[0], ph: p[1] || '', pos: p[2] || '', cn: p[3] || '（查词典）',
      ex: p[4] || '', freq: '自', mnem: ''
    };
    if (cetWords.some(x => x.w.toLowerCase() === w.w.toLowerCase())) return;
    vocabCustom.push(w); cetWords.push(w); added++;
  });
  store.set(VOCAB_CUSTOM_KEY, vocabCustom);
  const msg = document.getElementById('vocabImportMsg');
  if (msg) msg.innerHTML = added > 0
    ? `<span style="color:#2e7d32">✅ 已导入 ${added} 个新单词并合并进词库，去下面背一背吧～</span>`
    : `<span style="color:#c62828">⚠️ 没有新增（可能格式为空或单词已存在）。</span>`;
  if (ta) ta.value = '';
  renderVocab();
  toast('已导入 ' + added + ' 个单词');
}
function clearImportedWords() {
  cetWords = cetWords.filter(w => w.freq !== '自');
  vocabCustom = []; store.set(VOCAB_CUSTOM_KEY, vocabCustom);
  const msg = document.getElementById('vocabImportMsg');
  if (msg) msg.innerHTML = `<span style="color:#1565c0">🧹 已清空你导入的单词。</span>`;
  renderVocab();
}
function renderVocabApps() {
  const el = document.getElementById('vocabAppBox'); if (!el) return;
  el.innerHTML = appLinkRow([
    { name: '百词斩', pkg: 'com.maimemo.android.baicizhan', url: 'https://www.baicizhan.com/', scheme: 'com.maimemo.android.baicizhan', icon: '🍊' },
    { name: '不背单词', pkg: 'cn.com.langeasy.LangEasyLexis', url: 'https://www.bbdc.cn/', scheme: 'cn.com.langeasy.LangEasyLexis', icon: '🦋' },
    { name: '奶酪单词', pkg: 'com.jdjdc.jdfastjdc', url: 'https://www.cheeseword.com/', scheme: 'com.jdjdc.jdfastjdc', icon: '🧀' }
  ]);
}
/* 抖音式记单词：拆分 + 故事化记忆法（模仿抖音博主“看一遍就记住”风格） */
const vocabMemoryData = [
  { w: 'ambulance', ph: '/ˈæmbjələns/', cn: 'n. 救护车', split: 'am(俺) + bu(不) + lan(能) + ce(死)', story: '“俺不能死！”——快叫救护车 🚑' },
  { w: 'pest', ph: '/pest/', cn: 'n. 害虫', split: 'pe(拍) + st(死它)', story: '看到害虫，第一反应就是“拍死它” 🪳' },
  { w: 'ambition', ph: '/æmˈbɪʃən/', cn: 'n. 雄心，抱负', split: 'am(俺) + bi(必) + tion(神)', story: '“俺必胜”的雄心壮志 🔥' },
  { w: 'famine', ph: '/ˈfæmɪn/', cn: 'n. 饥荒', split: 'fa(发) + mi(米) + ne(呢)', story: '闹饥荒了，快“发米呢”！🌾' },
  { w: 'candidate', ph: '/ˈkændɪdət/', cn: 'n. 候选人', split: 'can(能) + did(做) + ate(吃)', story: '又能做又能吃 → 当候选人没毛病 😋' },
  { w: 'economy', ph: '/ɪˈkɒnəmi/', cn: 'n. 经济', split: 'e(鹅) + con(看) + o(蛋) + my(米)', story: '鹅看着蛋和米 → 这是 economy（经济）💰' },
  { w: 'gesture', ph: '/ˈdʒestʃə/', cn: 'n. 手势，姿态', split: 'ge(哥) + st(手势) + ure(儿)', story: '哥做手势逗小儿 → gesture 🙌' },
  { w: 'innocent', ph: '/ˈɪnəsnt/', cn: 'adj. 天真无邪的', split: 'in(在…里) + no(没有) + cent(分)', story: '口袋里“没有一分钱”的孩子 → 天真无邪 👶' },
  { w: 'hesitate', ph: '/ˈhezɪteɪt/', cn: 'v. 犹豫', split: 'he(他) + sit(坐) + ate(吃)', story: '他坐着吃东西，犹豫要不要走 🍜' },
  { w: 'mansion', ph: '/ˈmænʃn/', cn: 'n. 豪宅，大厦', split: 'man(男人) + sion(神)', story: '男人住得像神一样 → 豪宅 🏰' },
  { w: 'genuine', ph: '/ˈdʒenjuɪn/', cn: 'adj. 真正的，真诚的', split: 'gen(真) + u(你) + ine(因)', story: '“真你因” → 真诚 genuine 💗' },
  { w: 'island', ph: '/ˈaɪlənd/', cn: 'n. 岛（s 不发音）', split: 'i(我) + s(Silent!哑巴) + land(陆地)', story: '我(s 不发音)站在陆地边 → 岛 🏝️ 口诀：岛上的 s 是哑巴' },
  { w: 'forbid', ph: '/fəˈbɪd/', cn: 'v. 禁止', split: 'for(为了) + bid(出价/投标)', story: '为了公平，禁止私下出价 🚫' },
  { w: 'budget', ph: '/ˈbʌdʒɪt/', cn: 'n. 预算', split: 'bu(不) + dge(挤) + t(他)', story: '预算有限，不挤“他”的钱包 💸' },
  { w: 'bride', ph: '/braɪd/', cn: 'n. 新娘', split: 'b(不) + ride(骑马)', story: '古代新娘“不骑马”坐花轿 → bride 👰' },
  { w: 'chimney', ph: '/ˈtʃɪmni/', cn: 'n. 烟囱', split: 'chi(吃) + m(烟) + ney(腻)', story: '吃烟吃得腻 → 烟囱冒烟 🔥' }
];
let vocabMemorySeed = 0;
function renderVocabDouyin() {
  const el = document.getElementById('vocabDouyinBox'); if (!el) return;
  const picked = seededShuffle(vocabMemoryData, todayKey() + '_mem_' + vocabMemorySeed).slice(0, 6);
  el.innerHTML = picked.map(m => `
    <div class="mem-card">
      <div class="mem-head"><span class="mem-word">${esc(m.w)}</span><span class="mem-ph">${esc(m.ph)}</span><span class="mem-cn">${esc(m.cn)}</span></div>
      <div class="mem-split"><b>🔪 拆分：</b>${esc(m.split)}</div>
      <div class="mem-story"><b>📖 故事：</b>${esc(m.story)}</div>
    </div>`).join('');
}
function refreshVocabMemory() { vocabMemorySeed = (vocabMemorySeed + 1) % 7; renderVocabDouyin(); toast('已换一批记忆法 🎲'); }
function vocabBatches() {
  const arr = [];
  for (let i = 0; i < cetWords.length; i += VOCAB_BATCH) arr.push(cetWords.slice(i, i + VOCAB_BATCH));
  return arr;
}
function renderVocab() {
  const el = document.getElementById('vocabBox'); if (!el) return;
  const batches = vocabBatches();
  if (vocabState.batch >= batches.length) vocabState.batch = 0;
  const words = batches[vocabState.batch];
  const totalBatch = batches.length;
  const learned = vocabState.learned.length;
  el.innerHTML = `
    <div class="stat-grid">
      <div class="stat-card"><div class="stat-num">${vocabState.batch + 1}/${totalBatch}</div><div class="stat-label">当前组</div></div>
      <div class="stat-card"><div class="stat-num">${learned}</div><div class="stat-label">已背单词</div></div>
      <div class="stat-card"><div class="stat-num">${cetWords.length}</div><div class="stat-label">词库总量</div></div>
    </div>
    <div class="text-sm mb-2" style="color:#1565c0;font-weight:700">📘 出题范围：<b>大学英语四级（CET-4）考纲词汇</b>（近 5 年真题高频，随堂测试均出自此词库）</div>
    <div class="flex-between mb-2">
      <span class="text-sm text-muted">🔤 本组单词（点击「背完换下一批」自动轮换）</span>
      <button class="btn btn-orange" style="padding:6px 10px;font-size:12px" onclick="completeVocabBatch()">背完换下一批 →</button>
    </div>
    <div class="word-list">
      ${words.map((w, i) => {
        const idx = vocabState.batch * VOCAB_BATCH + i;
        const done = vocabState.learned.includes(idx);
        return `<div class="word-card ${done ? 'done' : ''}" onclick="toggleWordLearned(${idx})">
          <div class="word-head"><span class="word-w">${w.w}</span><span class="tier-${w.freq === '高' ? 'S' : w.freq === '中' ? 'A' : 'B'}">${w.freq ? w.freq + '频' : ''}</span></div>
          <div class="word-ph">${w.ph || ''} <span class="text-muted">${w.pos || ''}</span></div>
          <div class="word-cn">${w.cn || '（查词典）'}</div>
          <div class="word-ex">${w.ex ? '📌 ' + w.ex : ''}</div>
          <div class="word-mnem ${w.mnem ? '' : 'mnem-muted'}" onclick="event.stopPropagation();this.classList.toggle('open')">
            <span class="mnem-ico">💡</span>
            <span class="mnem-body">${w.mnem ? esc(w.mnem) : '🔗 联想记忆：' + esc(w.cn || '')}</span>
          </div>
          <div class="word-done">${done ? '✓ 已背' : '点击标记'}</div>
        </div>`;
      }).join('')}
    </div>
    <div class="flex-between mt-3">
      <button class="btn btn-primary" onclick="vocabTest()">📝 随堂测试（实时出题）</button>
      <button class="btn btn-outline" onclick="completeVocabBatch()">换一批</button>
    </div>
    <div id="vocabTestBox" class="mt-3"></div>
    <div class="card mt-3">
      <div class="font-bold mb-2">📘 常考简单语法（每组轮换）</div>
      <div class="text-sm text-muted">${vocabGrammar()}</div>
    </div>
    <div class="card mt-3">
      <div class="font-bold mb-2">💬 实用口语（每组轮换）</div>
      <div class="text-sm">${vocabSpoken()}</div>
    </div>`;
  renderVocabApps();
  renderVocabDouyin();
}
function vocabGrammar() {
  const tips = [
    '① 时态：现在完成时 have/has + done，强调「过去发生、影响现在」——I have learned 50 words.',
    '② 定语从句：先行词指人用 who/whom，指物用 which/that——The book that you lent me is great.',
    '③ 虚拟语气：If I were you, I would...（与现在事实相反用 were）。',
    '④ 被动语态：be + done，常用在科普/说明文——The plan was accomplished.',
    '⑤ 非谓语：doing 表主动进行，done 表被动完成——Given more time, we can do better.',
    '⑥ 比较级：the + 比较级..., the + 比较级...——The more you read, the wiser you become.'
  ];
  return seededShuffle(tips, 'grammar' + vocabState.batch).slice(0, 3).join('<br>');
}
function vocabSpoken() {
  const sp = [
    'Could you break that down for me?（能再解释清楚点吗？）',
    'I\'m totally into this song.（我超喜欢这首歌。）',
    'Let\'s call it a day.（今天先到这儿吧。）',
    'No worries, take your time.（别急，慢慢来。）',
    'That makes sense.（有道理 / 说得通。）',
    'I\'m running late.（我要迟到了。）',
    'Could you do me a favor?（能帮我个忙吗？）',
    'It\'s on me this time.（这次我请客。）'
  ];
  return seededShuffle(sp, 'spoken' + vocabState.batch).slice(0, 4).map(s => '· ' + s).join('<br>');
}
function toggleWordLearned(idx) {
  const i = vocabState.learned.indexOf(idx);
  if (i >= 0) vocabState.learned.splice(i, 1); else vocabState.learned.push(idx);
  store.set('luo_vocab_state', vocabState);
  addPoints(i >= 0 ? -1 : 1, true);
  renderVocab();
}
function completeVocabBatch() {
  const batches = vocabBatches();
  const start = vocabState.batch * VOCAB_BATCH;
  for (let k = 0; k < VOCAB_BATCH; k++) {
    const idx = start + k;
    if (idx < cetWords.length && !vocabState.learned.includes(idx)) vocabState.learned.push(idx);
  }
  vocabState.batch = (vocabState.batch + 1) % batches.length;
  addPoints(5, true);
  store.set('luo_vocab_state', vocabState);
  toast('✅ 本组完成 +5 积分，已换下一批');
  renderVocab();
}
function vocabTest() {
  const box = document.getElementById('vocabTestBox'); if (!box) return;
  const pool = vocabState.learned.length >= 4 ? vocabState.learned.map(i => cetWords[i]) : cetWords;
  const qs = seededShuffle(pool, String(Date.now())).slice(0, 5).map(w => {
    const wrong = seededShuffle(cetWords.filter(x => x.w !== w.w).map(x => x.cn), w.w).slice(0, 3);
    const opts = seededShuffle(wrong.concat(w.cn), w.w + Date.now());
    return { w, opts, ans: opts.indexOf(w.cn) };
  });
  box.innerHTML = `<div class="card"><div class="font-bold mb-2">📝 随堂测试（选出正确释义）</div>
    ${qs.map((q, qi) => `<div class="quiz-q" data-ans="${q.ans}">
      <div class="quiz-word">${q.w.w} <span class="text-muted" style="font-size:12px">${q.w.ph}</span></div>
      <div class="quiz-opts">${q.opts.map((o, oi) => `<button class="quiz-opt" onclick="answerQuiz(this,${qi},${oi})">${o}</button>`).join('')}</div>
      <div class="quiz-fb" id="qfb-${qi}"></div>
    </div>`).join('')}
    <div id="quizScore" class="font-bold mt-2"></div>
    <button class="btn btn-orange" style="width:100%;margin-top:8px" onclick="vocabTest()">🔄 换一批题（实时更新）</button>
  </div>`;
}
function answerQuiz(btn, qi, oi) {
  const qEl = btn.closest('.quiz-q');
  if (qEl.dataset.done) return;
  const ans = +qEl.dataset.ans;
  qEl.dataset.done = '1';
  qEl.querySelectorAll('.quiz-opt').forEach((b, i) => {
    b.disabled = true;
    if (i === ans) b.classList.add('correct');
    if (i === oi && oi !== ans) b.classList.add('wrong');
  });
  const fb = document.getElementById('qfb-' + qi);
  fb.innerHTML = oi === ans ? '<span class="text-green">✓ 答对</span>' : '<span class="text-orange">✗ 正确答案已标绿</span>';
  if (oi === ans) addPoints(1, false);
  const score = document.getElementById('quizScore');
  const total = document.querySelectorAll('.quiz-q').length;
  const right = document.querySelectorAll('.quiz-opt.correct').length;
  score.textContent = `本次得分：${right}/${total}`;
}

/* ===================================================================
   ③ 考公每日一测（注入 exam 页）
   =================================================================== */
const kaogongBank = [
  { type: '行测·常识', q: '2026 国考预计报名与笔试时间？', opts: ['10月报名/11月底笔试', '9月报名/10月笔试', '12月报名/1月笔试', '随时报名'], ans: 0, exp: '2026 国考预计 10 月 15 日左右启动报名，11 月底笔试；新增政治理论模块。' },
  { type: '行测·言语', q: '下列成语中，与「一蹴而就」语义相反的是？', opts: ['循序渐进', '立竿见影', '水到渠成', '迎刃而解'], ans: 0, exp: '「一蹴而就」指一下子成功；「循序渐进」强调逐步推进，语义相对。' },
  { type: '行测·判断', q: '所有 A 都是 B，有的 B 是 C，可推出？', opts: ['有的 C 是 A', '所有 B 是 A', '有的 A 是 C', '无法必然推出'], ans: 3, exp: '仅知「有的 B 是 C」，A 与 C 的关系无法必然推出。' },
  { type: '行测·数量', q: '一项工程甲独做 10 天、乙独做 15 天，合作需几天？', opts: ['5', '6', '8', '12'], ans: 1, exp: '效率 1/10+1/15=1/6，故 6 天。' },
  { type: '行测·资料', q: '同比增长率 = (本期−去年同期)/？', opts: ['本期', '去年同期', '两者平均值', '本期+去年同期'], ans: 1, exp: '同比增长率分母为「去年同期」。' },
  { type: '申论', q: '申论大题作答的核心要求是？', opts: ['辞藻华丽', '紧扣材料、逻辑清晰、对策可行', '字数越多越好', '照搬范文'], ans: 1, exp: '申论重在对材料的归纳概括与提出可行对策，而非堆砌辞藻。' },
  { type: '常识·时政', q: '2026 下半年公考通常包含几次主要机会？', opts: ['1 次', '3 次', '5 次', '越多越好无定数'], ans: 2, exp: '常见梳理：国考、省考联考、选调、事业单位、三支一扶等，下半年常被归纳约 5 次机会。' },
  { type: '行测·言语', q: '「这项政策＿＿了民生关切」应填？', opts: ['回应', '反映', '呼应', '均可'], ans: 3, exp: '「回应/反映/呼应」在此语境皆可，属近义辨析题。' },
  { type: '判断·类比', q: '医生：医院 ≈ ？', opts: ['教师：学校', '司机：马路', '作家：书店', '厨师：菜场'], ans: 0, exp: '职业与主要工作场所的对应关系。' },
  { type: '常识·法律', q: '我国民法典规定普通诉讼时效一般为？', opts: ['1 年', '2 年', '3 年', '5 年'], ans: 2, exp: '《民法典》规定普通诉讼时效为 3 年。' },
  { type: '行测·言语', q: '下列词语中，与「兼容并蓄」语义最接近的是？', opts: ['独树一帜', '博采众长', '一枝独秀', '孤芳自赏'], ans: 1, exp: '「兼容并蓄」指吸收不同内容，与「博采众长」近义。' },
  { type: '行测·资料', q: '若 A 比上年增长 20%，B 比上年增长 20%，则 A、B 合计比上年约增长？', opts: ['20%', '40%', '约20%（权重未知）', '44%'], ans: 2, exp: '合计增长率取决于各自基期权重，不能简单相加。' },
  { type: '申论', q: '公文写作中「请示」与「报告」的主要区别是？', opts: ['都用于汇报', '请示需批复、报告不必', '报告需批复', '无区别'], ans: 1, exp: '请示是「一文一事、需上级批复」，报告用于汇报不需批复。' },
  { type: '常识·科技', q: '我国自主研发的卫星导航系统是？', opts: ['GPS', '北斗', '伽利略', '格洛纳斯'], ans: 1, exp: '北斗卫星导航系统（BDS）是我国自主建设的全球卫星导航系统。' },
  { type: '行测·判断', q: '「所有猫都怕水，Tom 是猫，所以 Tom 怕水」属于？', opts: ['归纳推理', '演绎推理', '类比推理', '因果推理'], ans: 1, exp: '由一般到个别，是标准的三段论演绎推理。' },
  { type: '常识·经济', q: 'CPI 指的是？', opts: ['居民消费价格指数', '工业生产指数', '国内生产总值', '失业率'], ans: 0, exp: 'CPI（居民消费价格指数）反映一篮子消费品价格变动。' },
  { type: '申论', q: '写对策建议时，最应避免的是？', opts: ['具体可操作', '空话套话', '结合数据', '明确责任主体'], ans: 1, exp: '对策要具体可行，空话套话是申论大忌。' },
  { type: '行测·数量', q: '某班 40 人，会英语 25 人、会日语 18 人，都会 8 人，都不会的几人？', opts: ['5', '8', '10', '15'], ans: 0, exp: '至少会一种=25+18-8=35，都不会=40-35=5。' },
  { type: '常识·时政', q: '2026 国考新增的考查模块通常是？', opts: ['政治理论', '体育', '美术', '音乐'], ans: 0, exp: '近年国考行测强化政治理论模块考查。' }
];
function renderExamWrap() {
  if (typeof renderExam === 'function') renderExam();
  const box = document.getElementById('examDailyBox'); if (!box) return;
  const qs = seededShuffle(kaogongBank, todayKey()).slice(0, 5);
  box.innerHTML = `<div class="card card-gradient-blue mt-3">
    <div class="flex-between"><div class="font-bold">📝 考公每日一测（每日更新）</div><span class="tag tag-low">${todayKey()}</span></div>
    <p class="text-sm text-muted mb-2">点选项看解析；「换一批」实时出题。</p>
    ${qs.map((q, qi) => `<div class="quiz-q" data-ans="${q.ans}">
      <div class="quiz-word"><span class="text-blue">[${q.type}]</span> ${q.q}</div>
      <div class="quiz-opts">${q.opts.map((o, oi) => `<button class="quiz-opt" onclick="answerExam(this,${qi},${oi})">${o}</button>`).join('')}</div>
      <div class="quiz-fb" id="efb-${qi}"></div>
    </div>`).join('')}
    <button class="btn btn-orange" style="width:100%;margin-top:8px" onclick="renderExamDaily()">🔄 换一批题（实时更新）</button>
  </div>`;
}
function renderExamDaily() {
  const box = document.getElementById('examDailyBox'); if (!box) return;
  const qs = seededShuffle(kaogongBank, String(Date.now())).slice(0, 5);
  box.innerHTML = `<div class="card card-gradient-blue mt-3">
    <div class="flex-between"><div class="font-bold">📝 考公每日一测（实时出题）</div><span class="tag tag-low">${fmtDate()}</span></div>
    ${qs.map((q, qi) => `<div class="quiz-q" data-ans="${q.ans}">
      <div class="quiz-word"><span class="text-blue">[${q.type}]</span> ${q.q}</div>
      <div class="quiz-opts">${q.opts.map((o, oi) => `<button class="quiz-opt" onclick="answerExam(this,${qi},${oi})">${o}</button>`).join('')}</div>
      <div class="quiz-fb" id="efb-${qi}"></div>
    </div>`).join('')}
    <button class="btn btn-orange" style="width:100%;margin-top:8px" onclick="renderExamDaily()">🔄 换一批题（实时更新）</button>
  </div>`;
}
function answerExam(btn, qi, oi) {
  const qEl = btn.closest('.quiz-q');
  if (qEl.dataset.done) return;
  const ans = +qEl.dataset.ans;
  qEl.dataset.done = '1';
  qEl.querySelectorAll('.quiz-opt').forEach((b, i) => {
    b.disabled = true;
    if (i === ans) b.classList.add('correct');
    if (i === oi && oi !== ans) b.classList.add('wrong');
  });
  const fb = document.getElementById('efb-' + qi);
  const exp = kaogongBank.find(k => k.ans === ans && k.q === qEl.querySelector('.quiz-word').textContent.replace(/^\[.*?\]\s*/, ''));
  fb.innerHTML = (oi === ans ? '<span class="text-green">✓ 答对</span> ' : '<span class="text-orange">✗ 看解析</span> ') + '<span class="text-sm text-muted">' + (exp ? exp.exp : '') + '</span>';
  if (oi === ans) addPoints(1, false);
}

/* ===================================================================
   ③ 实时招聘（注入 recruit 页，2026 真实线索）
   =================================================================== */
const recruitLive = [
  { role: '央企 2026 届夏季校招', org: '中国融通集团 / 兵器工业等', area: '全国', tag: '央企', src: '人社部高校毕业生就业平台', url: 'http://www.job.mohrss.gov.cn/qyzp/index.jhtml' },
  { role: '2026 杭州市大学生暑期就业见习', org: '浙江 24365 大学生就业服务平台', area: '杭州', tag: '见习', src: '浙江24365', url: 'http://ejobmart.cn/jyxt-v5/jyweb/webIndex.zf' },
  { role: '2026 校园招聘（秋招前瞻）', org: 'BOSS 直聘校招频道', area: '全国', tag: '校招', src: 'BOSS直聘', url: 'https://www.zhipin.com/school/' },
  { role: '实习 / 春招 / 夏招汇总', org: 'Offer360 校招汇总平台', area: '全国', tag: '实习', src: 'Offer360', url: 'https://www.offer360.cn/' },
  { role: '地方国企 / 央企同步校招', org: '北汽 / 广西移动 / 天津泰达等', area: '多地', tag: '国企', src: '公开报道', url: 'https://www.sohu.com/a/940413692_122362512' },
  { role: '2026 国考 / 省考 / 事业单位', org: '公考招录公告', area: '全国', tag: '公考', src: '公考网', url: 'https://www.gzdysx.com/html/2026gk/index.html' }
];
function renderRecruitWrap() {
  if (typeof renderRecruit === 'function') renderRecruit();
  const box = document.getElementById('recruitLiveBox'); if (!box) return;
  box.innerHTML = `<div class="card card-gradient-orange mt-3">
    <div class="flex-between"><div class="font-bold">🔔 实时招聘线索（2026 更新）</div><span class="tag tag-low">${fmtDate()}</span></div>
    <p class="text-sm text-muted mb-2">数据于构建时联网整理，点来源跳转核实最新岗位。</p>
    ${recruitLive.map((r, i) => `<div class="recruit-live-item">
      <div><span class="rl-tag">${r.tag}</span> <b>${esc(r.role)}</b></div>
      <div class="text-sm text-muted">${esc(r.org)} · ${esc(r.area)} · 来源：${esc(r.src)}</div>
      <a class="btn btn-outline" style="padding:4px 10px;font-size:12px;margin-top:6px" href="${r.url}" target="_blank">查看来源 ↗</a>
      ${gstar('recruit-' + i, '招聘', r.role, r.org)}
    </div>`).join('')}
  </div>`;
}

/* ===================================================================
   ④ 小说创作进阶：逻辑 / 钩子 / 文案 / 节奏 / 共鸣
   =================================================================== */
const novelCraft = [
  { cat: '逻辑', title: '主线三幕结构', body: '建置（人物+世界）→ 对抗（阻碍升级）→ 解决（代价与成长）。每章都要推进「目标—阻碍—行动—结果」小循环。', ex: '《她的山，她的海》以「相互救赎」为骨，暗恋只是表层。' },
  { cat: '逻辑', title: '人设服务剧情', body: '人物身世/性格底色决定其选择；让「幼年经历→性格成因→关键动机」形成因果链，读者才信服。', ex: '傲娇角色每次口是心非，都对应童年缺爱的防御机制。' },
  { cat: '钩子', title: '章节结尾钩子', body: '每章末抛一个未解问题/突变/秘密，逼读者点下一章。钩子=信息差+情绪悬置。', ex: '「她以为那封信烧了，却不知他早抄了一份。」' },
  { cat: '钩子', title: '开篇 3 行定生死', body: '首句给冲突、反差或强情绪，别用大段环境铺陈。前 300 字决定留不留。', ex: '「我喜欢的人，是我哥的未婚妻。」' },
  { cat: '文案', title: '一句话梗概公式', body: '【人设】+【处境】+【目标】+【最大阻碍】。例：社恐学霸×桀骜校霸，假装情侣却假戏真做。', ex: '用「人设反差」制造天然张力，文案一眼抓人。' },
  { cat: '文案', title: '金句收藏与化用', body: '建立自己的金句库：情绪句、反转句、留白句。用在章末/高潮前，提升转发欲。', ex: '「有些喜欢，是说不出口的、却比告白更重的东西。」' },
  { cat: '节奏', title: '张弛交替', body: '高能冲突后给 1-2 章缓冲（日常/糖/心理），避免全程紧绷疲劳。甜虐比例按题材调。', ex: '校园文：「考试危机」紧→「天台分糖」松→「家长反对」再紧。' },
  { cat: '节奏', title: '信息投放节奏', body: '秘密分阶段揭露，每次只给一点；让读者「比主角先知道」制造焦急与期待。', ex: '身世之谜分 3 章揭开，每章多一块拼图。' },
  { cat: '共鸣', title: '真实情绪颗粒', body: '写「具体的委屈」而非「她很难过」。用动作/感官替代形容词：攥紧衣角、喉咙发紧。', ex: '暗恋共鸣点：偷偷存对方语音、假装偶遇。' },
  { cat: '共鸣', title: '代入感来自细节', body: '共情建立在共同经验：食堂、晚自习、未发出的消息。越具体越普适。', ex: '「那条打了又删的消息，最后变成了『在吗』。」' },
  { cat: '共鸣', title: '留白与心理活动', body: '不写尽、留呼吸。心理活动用「短句+破折号」模拟真实思维跳跃，胜过长篇独白。', ex: '「他来了。——又走了。——可我等了一晚上。」' },
  { cat: '共鸣', title: '人物对话即性格', body: '让对话带「潜台词」：说一半、反着说、用口头禅。对话推动关系而非交代信息。', ex: '「谁等你了。」（其实从三点等到六点）' },
  { cat: '逻辑', title: '欲望驱动一切', body: '给主角一个「非得到不可」的欲望，再设阻碍。没有欲望就没有故事，没有阻碍就没有张力。', ex: '她想考上本校研究生，却卡在英语单科线。' },
  { cat: '逻辑', title: '信息差制造悬念', body: '读者知道的比主角多（或反之），紧张感就来了。善用「上帝视角限知」。', ex: '读者早知道信是假的，主角还当真——揪心。' },
  { cat: '钩子', title: '章节开头也重要', body: '不只是结尾，开头也要有钩子：冲突已发生、或抛出悬念，读者才愿意读下去。', ex: '「我暗恋的人，今天当着全班念了我们的聊天记录。」' },
  { cat: '钩子', title: '金句前置', body: '把最戳人的一句话放在开篇或章末，利于截图传播与读者收藏。', ex: '「有些喜欢，是说不出口的、却比告白更重的东西。」' },
  { cat: '文案', title: '反差人设一句话', body: '用「A 属性 × B 属性」制造张力，人设一眼立住。', ex: '「校霸却怕黑 / 学霸却社恐 / 浪子却专一」。' },
  { cat: '文案', title: '文案三要素', body: '① 给身份代入 ② 给情绪价值 ③ 给点击理由。三者齐备转化最高。', ex: '「社恐女生的暗恋，每个女孩都懂。」' },
  { cat: '节奏', title: '爽点前置', body: '开篇 1-3 章内给出第一个小爽点/小糖点，留住读者再慢慢铺大线。', ex: '先让主角打脸一次小反派，再展开身世。' },
  { cat: '节奏', title: '情绪曲线', body: '一章之内也要有起承转合：平静→波动→小高潮→留钩子。避免平铺直叙。', ex: '日常→误会的苗头→爆发→误会加深的钩子。' },
  { cat: '共鸣', title: '共同记忆点', body: '高考、晚自习、宿舍、未发出的消息——越具体的共同经验越有代入感。', ex: '「那条打了又删的消息，最后变成了『在吗』。」' },
  { cat: '共鸣', title: '遗憾与错过', body: '青春文最痛的是「差一点」：差一点说出口、差一点在一起。把「差一点」写到极致。', ex: '「如果那天我没假装无所谓，现在会不会不一样。」' },
  { cat: '逻辑', title: '配角也要有弧光', body: '配角不是工具人，给每个重要配角一个小目标，主线因此更厚。反派阵营里也要有“不得已”。', ex: '军师效忠反派，其实只为救被扣的妹妹——读者瞬间理解。' },
  { cat: '逻辑', title: '世界观用细节喂', body: '别用大段设定交代，把规则藏进情节与对话。读者边读边拼，比说明书更有沉浸感。', ex: '用「月圆夜不许出门」代替解释整套魔法体系。' },
  { cat: '钩子', title: '伪结局钩子', body: '看似解决、实则埋下更大危机，章末给“以为赢了”的错觉再反转。', ex: '「以为赢了，直到发现奖品是自己的记忆。」' },
  { cat: '文案', title: '评论区即素材库', body: '看读者在哪些章催更、骂人设、求糖——那里就是爽点与痛点坐标。', ex: '读者齐喊“缺糖”，就在下一章加缓冲甜戏。' },
  { cat: '节奏', title: '预告式章节标题', body: '标题先剧透冲突，逼读者点进来；配合章末钩子形成双重牵引。', ex: '「第13章 她亲手烧了那封信」。' },
  { cat: '共鸣', title: '感官记忆点', body: '用气味、声音、温度锚定情绪，比形容词更戳。具体感官=具体回忆。', ex: '「雨后泥土味=每个暗恋开始的夏天」。' },
  { cat: '共鸣', title: '成长不是突变', body: '主角改变要渐进，靠事件累积。一次打击只裂一道缝，三件事后才换一个人。', ex: '从「怕麻烦」到「主动扛事」，经历三件事的推挤。' },
  { cat: '节奏', title: '情绪蓄水池', body: '长期伏笔到点释放，读者才爆哭。前面每埋一次，后面回报一次。', ex: '第3章埋的伤疤，第20章揭晓，弹幕全破防。' },
  { cat: '逻辑', title: '因果链闭环', body: '每个选择都有后果并回流主线，读者感到“一切早有关联”。', ex: '第三章的小善，终章救了主角一命。' },
  { cat: '逻辑', title: '反派也要有逻辑', body: '反派按自己的“正义”行事才可怕，脸谱化反派易出戏。', ex: '反派灭城只为救病妹，读者竟理解。' },
  { cat: '逻辑', title: '金手指须有限制', body: '系统/异能必须有代价或冷却，否则无敌即无张力。', ex: '每次预知未来都会失忆一天。' },
  { cat: '逻辑', title: '伏笔要可回溯', body: '埋的线后面要收，否则成注水；收得太突兀则成机械降神。', ex: '开篇的梦，结局才揭是预言。' },
  { cat: '逻辑', title: '冲突升级有层级', body: '小冲突→中冲突→存亡冲突，层层加码而非原地打转。', ex: '吵架→决裂→生死抉择。' },
  { cat: '逻辑', title: '动机必须站得住', body: '主角为啥拼命？动机越私人越驱动读者共情。', ex: '她想考研，却卡在英语单科线。' },
  { cat: '钩子', title: '身份错位钩子', body: '“我以为的陌生人竟是死对头”，信息不对称制造持续悬念。', ex: '网恋对象=现实宿敌。' },
  { cat: '钩子', title: '倒计时钩子', body: '给事件一个 deadline，紧迫感拉满，读者跟着数日子。', ex: '「只剩七天，婚约就生效。」' },
  { cat: '钩子', title: '预言/诅咒钩子', body: '“他会在二十岁死去”，读者追着看如何破局。', ex: '每章逼近生日，焦虑累积。' },
  { cat: '钩子', title: '物品钩子', body: '一件神秘信物贯穿全书，每出现一次揭开一层。', ex: '半块玉佩牵出灭门真相。' },
  { cat: '钩子', title: '关系钩子', body: '“我们假装情侣”设定本身即钩子，天然戏剧。', ex: '协议恋爱却假戏真做。' },
  { cat: '钩子', title: '反差钩子', body: '强大的人露出脆弱一瞬，人设瞬间立体。', ex: '杀伐果断的将军怕黑。' },
  { cat: '文案', title: '一句话三要素', body: '人设+目标+阻碍，缺一个都不抓人。', ex: '社恐学霸×桀骜校霸，假装情侣。' },
  { cat: '文案', title: '用具体替代抽象', body: '“社恐少女”比“平凡女孩”更立，标签即代入。', ex: '「她总坐最后一排靠窗。」' },
  { cat: '文案', title: '给读者一个身份', body: '“每个暗恋过的人”都能代入，转化最高。', ex: '「这条，写给偷偷喜欢过的你。」' },
  { cat: '文案', title: '埋情绪关键词', body: '“治愈”“救赎”“双向”是点击开关，文案里亮出来。', ex: '「双向救赎，甜到心尖。」' },
  { cat: '文案', title: '悬念式文案', body: '给钩子不给答案，读者才点。', ex: '「她不知道，这场婚姻是局。」' },
  { cat: '文案', title: '对比式文案', body: '高冷×话痨、教授×学生，张力自现。', ex: '「高冷教授×话痨学生。」' },
  { cat: '节奏', title: '三章一小爽', body: '长线铺陈也要有小奖励留住读者，别让读者等太久。', ex: '先让主角打脸小反派再铺大线。' },
  { cat: '节奏', title: '糖虐交替', body: '全程甜易腻，全程虐易弃，交替最稳。', ex: '危机紧→天台分糖松→家长反对再紧。' },
  { cat: '节奏', title: '信息节流', body: '大秘密分多次放，每次只揭一角。', ex: '身世分三章揭开。' },
  { cat: '节奏', title: '高潮前蓄力', body: '真正高潮前压低情绪，落差才爆。', ex: '团圆饭前先写一场误会。' },
  { cat: '节奏', title: '日常不是水', body: '日常也要推进关系或埋线，别纯灌。', ex: '食堂对话顺手埋下伏笔。' },
  { cat: '共鸣', title: '具体委屈', body: '写“攥紧衣角”而非“她难过”，动作即情绪。', ex: '「手指把衣角绞出了褶子。」' },
  { cat: '共鸣', title: '未说出口的话', body: '暗恋精髓在“没说”，留白即共鸣。', ex: '「那句喜欢，最终发成了『在吗』。」' },
  { cat: '共鸣', title: '真实尴尬', body: '社死、口误、认错人，越真越笑中带痛。', ex: '「当着全班的面叫错了他名字。」' },
  { cat: '共鸣', title: '代际理解', body: '与父母的和解/不解是全民情绪，写透戳哭一代人。', ex: '「妈，其实我懂你当年。」' },
  { cat: '共鸣', title: '孤独瞬间', body: '“一个人吃火锅”的细节比喊孤独更戳。', ex: '「鸳鸯锅，一人一半。」' },
  { cat: '共鸣', title: '努力被看见', body: '默默付出终被认可，读者最爽的治愈。', ex: '「你熬的夜，这次有人记得。」' },
  { cat: '人设', title: '反差人设', body: '外表×内核反差（冷面×温柔）立得住，一眼记住。', ex: '校霸却怕黑、学霸却社恐。' },
  { cat: '人设', title: '缺陷即记忆点', body: '傲娇、路痴、社恐，缺点让人物可爱而非完美。', ex: '能力顶尖却极度路痴。' },
  { cat: '人设', title: '人设一致性', body: '行为要符合底色，OOC（脱离人设）最劝退。', ex: '节俭的人不会突然挥霍。' },
  { cat: '人设', title: '成长型人设', body: '主角随时间改变，读者追的是“他最终变成谁”。', ex: '从逃避到挺身而出，经历三件事。' },
  { cat: '人设', title: '配角也有高光', body: '给挚友/对手惊艳时刻，群像更真。', ex: '懦弱室友为朋友挡下一刀。' },
  { cat: '人设', title: '用细节立人设', body: '“随身记仇小本子”比“她记仇”更活。', ex: '他默默记着每一笔人情。' },
  { cat: '人设', title: '人设靠选择显现', body: '危急时的选择定义人物，不是旁白说好。', ex: '洪水来了先救陌生人。' },
  { cat: '人设', title: '反派魅力', body: '有品位的反派（优雅/偏执）比纯粹恶更有戏。', ex: '反派弹着钢琴谈毁灭计划。' },
  { cat: '人设', title: '萌点设计', body: '大人物的幼稚面（吃醋/怕黑）拉近距离。', ex: '冷面总裁偷偷怕打雷。' },
  { cat: '人设', title: '人设互补', body: '双主角用互补性格制造天然互动与张力。', ex: '话痨×闷葫芦，一张嘴就出戏。' },
  { cat: '世界观', title: '规则即冲突源', body: '世界规则直接制造人物困境，设定服务剧情。', ex: '「十八岁必须婚配」逼出逃婚。' },
  { cat: '世界观', title: '用日常呈现宏大', body: '借一顿饭、一条街写出时代，比旁白更可信。', ex: '用一碗泡面写尽漂泊。' },
  { cat: '世界观', title: '阶层即张力', body: '身份落差（仆×主）自带戏剧冲突。', ex: '下等奴×上位将，禁忌拉扯。' },
  { cat: '世界观', title: '能力要有代价', body: '任何金手指设限制，否则世界失衡读者出戏。', ex: '治愈他人必自伤。' },
  { cat: '世界观', title: '地名要有呼吸', body: '给地点记忆点，读者能“认路”才沉浸。', ex: '「槐花巷三号，她等了他七年。」' },
  { cat: '对话', title: '对话带潜台词', body: '说一半、反着说，比直给高级，耐琢磨。', ex: '「谁等你了。」（其实等到六点）' },
  { cat: '对话', title: '用口头禅塑人', body: '固定句式成人物签名，一听即知是谁。', ex: '他每句都以「理论上」开头。' },
  { cat: '对话', title: '吵架也要推进', body: '冲突对话暴露关系变化，别为了吵而吵。', ex: '一句「你从没信过我」撕开裂痕。' },
  { cat: '对话', title: '沉默也是对话', body: '该说话时沉默，张力更强，留白即千言。', ex: '他没回答，只是把伞往她那边偏。' },
  { cat: '对话', title: '信息差对话', body: '一方知另一方不知，读者揪心又焦急。', ex: '读者早知信是假的，主角还当真。' },
  { cat: '修改', title: '冷处理再改', body: '放几天再读，盲点自现，避免当局者迷。', ex: '隔周重读，发现第三章注水。' },
  { cat: '修改', title: '删废话', body: '能砍则砍，每句都要有用，长不等于好。', ex: '删掉所有「她想」「他觉得」多余。' },
  { cat: '修改', title: '朗读测节奏', body: '念出声，拗口处即问题处，语感最诚实。', ex: '长句读不顺，必拆。' },
  { cat: '修改', title: '找读者试读', body: '哪里弃、哪里懵，试读数据最诚实。', ex: '三人都在第5章睡著，重改开头。' },
  { cat: '修改', title: '开篇狠删', body: '前三千字最该精简，别舍不得，黄金三章定生死。', ex: '删掉两页背景，直接从冲突起。' },
  { cat: '短篇', title: '一个核心事件', body: '短篇只打一个点，别铺太大，集中才利落。', ex: '一篇只写「那次没说出口的再见」。' },
  { cat: '短篇', title: '开头即冲突', body: '短篇没篇幅铺垫，第一句就上矛盾。', ex: '「离婚协议，签吧。」开篇第一句。' },
  { cat: '短篇', title: '结尾要回响', body: '末句留余味或反转，读完还在想。', ex: '「原来那封信，他一直留着。」' },
  { cat: '短篇', title: '人物少而精', body: '两三人足矣，关系写透胜过多而浅。', ex: '只写她和他，一场雨里和解。' },
  { cat: '短篇', title: '场景集中', body: '一个空间内完成，张力集中不散。', ex: '全程在一节车厢里。' },
  { cat: '开篇', title: '前三百字定生死', body: '必须出现冲突/反差/强情绪，否则划走。', ex: '「我喜欢的人，是我哥的未婚妻。」' },
  { cat: '开篇', title: '别从天气写起', body: '环境铺垫放后面，先抓人再铺景。', ex: '先写她摔门，再补窗外雨。' },
  { cat: '开篇', title: '主角速出场', body: '尽早让主角行动，建立代入感。', ex: '第一句就写主角的选择与动作。' },
  { cat: '开篇', title: '抛悬念', body: '开篇给一个未解之谜，读者才往下翻。', ex: '「那具尸体，穿着我的衣服。」' },
  { cat: '开篇', title: '亮人设', body: '用一件小事展示主角性格，比介绍更有力。', ex: '开篇她把最后一块糖给了乞丐。' },
  { cat: '变现', title: '平台适配', body: '晋江重文、番茄重爽、知乎重钩子，按平台调写法。', ex: '同一梗，晋江慢炖、番茄快炸。' },
  { cat: '变现', title: '稳定更新', body: '日更/隔更比爆发式更留粉，断更是头号劝退。', ex: '排好存稿，假期也不断。' },
  { cat: '变现', title: '互动养读者', body: '作者有话说、评论区运营增粘性，读者变老粉。', ex: '每章末留个小问题互动。' },
  { cat: '情绪', title: '情绪曲线', body: '一章之内也有起承转合，避免平铺直叙。', ex: '平静→波动→小高潮→留钩子。' },
  { cat: '情绪', title: '先抑后扬', body: '压低再释放，爽感/哭点最大。', ex: '先写被全网骂，再写逆袭打脸。' },
  { cat: '情绪', title: '环境映情绪', body: '雨天/晴天参与心情，景即情。', ex: '分手那天下了整夜的雨。' },
  { cat: '情绪', title: '身体反应写情绪', body: '喉咙发紧、指尖凉，比“难过”真十倍。', ex: '「她捏着手机，指节发白。」' },
  { cat: '情绪', title: '克制更动人', body: '大悲不嚎，沉默的崩溃最杀读者。', ex: '她只是把照片轻轻放进了抽屉。' }
];
function renderNovelCraft() {
  const el = document.getElementById('novelCraftBox'); if (!el) return;
  const cats = ['全部', ...Array.from(new Set(novelCraft.map(c => c.cat)))];
  const cur = el.dataset.cat || '全部';
  const pool = cur === '全部' ? novelCraft : novelCraft.filter(c => c.cat === cur);
  const list = seededShuffle(pool, 'craft' + cur + todayKey());
  el.innerHTML = `
    <div class="text-sm mb-2" style="color:#1565c0;font-weight:700">📅 每日更新 · ${todayKey()}（共 ${novelCraft.length} 条创作心法，每天轮换呈现顺序，覆盖逻辑/钩子/文案/节奏/共鸣/人设/世界观/对话/修改/短篇/开篇/变现/情绪）</div>
    <div class="tabs" id="ncTabs">
      ${cats.map(c => `<div class="tab ${c === cur ? 'active' : ''}" onclick="setNcCat('${c}')">${c}</div>`).join('')}
    </div>
    <div class="craft-list mt-2">
      ${list.map((c, i) => `<div class="card">
        <div class="flex-between"><div class="font-bold">${esc(c.title)}</div><span class="tier-A">${c.cat}</span></div>
        <div class="mt-1">${esc(c.body)}</div>
        <div class="text-sm text-blue mt-1">📌 示例：${esc(c.ex)}</div>
        ${gstar('craft-' + cur + '-' + i, '创作', c.title, c.body)}
      </div>`).join('')}
    </div>`;
}
function setNcCat(cat) {
  const el = document.getElementById('novelCraftBox'); if (!el) return;
  el.dataset.cat = cat; renderNovelCraft();
}

/* ===================================================================
   ⑤ 视频脚本灵感：Cos / 追女明星 / 旅游（可直接落地）
   =================================================================== */
const videoScripts = [
  { cat: 'Cos', title: '宿舍低成本 Cos 变装', scenario: '用宿舍灯光+床单当背景，15 秒完成角色变身', hook: '「室友以为我去上课，其实我去当爱豆了」', shots: ['0-3s 日常睡衣routine', '3-8s 卡点换装（音乐 drop 瞬间）', '8-15s 角色定格+眼神特写'], voice: '旁白：「今天，我是__」', bgm: '角色 OP 卡点版（注意版权，用剪辑变速原创）', caption: '#Cosplay #宿舍变装 #低成本' },
  { cat: 'Cos', title: 'Cos 过程拆解 vlog', scenario: '展示假发/妆造/道具制作，干货向', hook: '「30 块还原贵价角色妆」', shots: ['开头成品惊艳镜头', '材料平铺「总成本XX」', '分步上妆+字幕要点', '结尾对比图'], voice: '口播：「重点在眉形和眼线弧度」', bgm: '轻快 lo-fi', caption: '#化妆教程 #Cos教程' },
  { cat: 'Cos', title: '漫展打卡挑战', scenario: '漫展随机采访+合照集锦', hook: '「一天集齐 10 个神级 Coser」', shots: ['入场全景', '逐个 Coser reaction', '自己出镜定格', '结尾约下次'], voice: '街访式：「你 Cos 的是谁？」', bgm: '展会热单', caption: '#漫展 #同好' },
  { cat: '追星', title: '爱豆安利向混剪', scenario: '用舞台高光+采访拼一段「为什么爱她」', hook: '「看完这条，你也会爱上她」', shots: ['强情绪舞台开头', '努力训练回忆杀', '粉丝视角reaction', '结尾应援口号'], voice: '文案：「她值得，也值得被你看见」', bgm: '本人 vocal 纯音乐', caption: '#XX应援 #安利' },
  { cat: '追星', title: '追星日常 vlog', scenario: '抢票/看演出/做手幅的一天', hook: '「为爱发电的一天」', shots: ['早上设闹钟抢票', '手工做手幅过程', '现场live片段', '返图九宫格'], voice: '流水账但带情绪：「手抖着点提交」', bgm: '轻快', caption: '#追星日常 #演唱会' },
  { cat: '追星', title: '二创 Reaction', scenario: '边看舞台边真实反应', hook: '「第一次看这段，我哭了对不起」', shots: ['播放前期待脸', '高潮处真实反应特写', '暂停解析细节'], voice: '即兴吐槽+安利', bgm: '原舞台降噪保留', caption: '#reaction #二创' },
  { cat: '旅游', title: '周末citywalk 攻略', scenario: '半天逛吃路线，适合学生党', hook: '「100 块玩转__老城」', shots: ['地图路线动画', '小吃特写+价格', '出片机位示范', '避坑提示'], voice: '口播：「第一站别去网红店」', bgm: 'city pop', caption: '#citywalk #学生党旅游' },
  { cat: '旅游', title: '旅行 vlog 模板', scenario: '通用三段式，换城市即用', hook: '「__三日，存下这份」', shots: ['出发机场/车站', '每日高光快剪', '当地美食', '结尾感悟金句'], voice: '旁白：「旅行是把日常过成诗」', bgm: '轻音乐', caption: '#旅行vlog #攻略' },
  { cat: '旅游', title: '小众机位打卡', scenario: '同一景点拍出大片', hook: '「本地人都不知道的机位」', shots: ['普通游客照对比', '低角度/逆光示范', '调色前后', '参数标注'], voice: '教程口播', bgm: '无词电子', caption: '#摄影技巧 #出片' },
  { cat: 'Cos', title: 'Cos 反差萌', scenario: '素颜日常 vs 角色定妆的强烈对比', hook: '「同一个人？这反差也太绝了」', shots: ['开头素颜戴眼镜啃零食', '卡点换装一镜到底', '角色定格wink', '结尾比心'], voice: '「变身前：废柴；变身后：本命」', bgm: '角色 ED 变奏（变速原创）', caption: '#Cos反差 #变身' },
  { cat: 'Cos', title: '低成本道具 DIY', scenario: '用快递盒/扭蛋/旧衣做角色武器', hook: '「0 成本还原这把武器」', shots: ['成品展示', '材料平铺', '裁剪粘合过程快剪', '上色细节'], voice: '教程口播：「关键在喷漆打底」', bgm: 'lo-fi 轻快', caption: '#道具教程 #手工' },
  { cat: 'Cos', title: '双人联动 Cos', scenario: '和搭子拍 CP 向互动', hook: '「我们俩就是原作本作」', shots: ['同框入场', '互动名场面复刻', '对视笑场花絮', '定格合照'], voice: '即兴对话', bgm: '角色 BGM 纯音', caption: '#联动 #CP' },
  { cat: '追星', title: '打投数据日常', scenario: '超话签到/投票/做数据的真实记录', hook: '「为爱发电的第 N 天，数据涨了」', shots: ['早间签到截图', '投票进度条', '做数据教程', '当日成果'], voice: '流水账：「今天也把榜守住」', bgm: '轻快', caption: '#打投 #做数据' },
  { cat: '追星', title: '线下应援记录', scenario: '接机/灯牌/演唱会外场', hook: '「这一次，就站在你眼前」', shots: ['灯牌亮起特写', '人群reaction', '远远一眼live', '返程疲惫但满足'], voice: '旁白：「值得」', bgm: '本人 vocal', caption: '#线下应援 #演唱会' },
  { cat: '追星', title: '爱豆语录混剪', scenario: '把采访金句串成「治愈向」', hook: '「这几句话，陪我熬过期末」', shots: ['黑底白字金句卡', '对应舞台/笑容', '粉丝视角', '结尾感谢'], voice: '文案：「谢谢你成为光」', bgm: '钢琴纯音', caption: '#语录 #治愈' },
  { cat: '旅游', title: '特种兵 24h 打卡', scenario: '极限时间多地刷景点', hook: '「24 小时，我刷了 8 个地标」', shots: ['凌晨车站', '景点快剪接龙', '美食塞满', '深夜回程'], voice: '口播：「腿已废，但值」', bgm: 'city pop 快节奏', caption: '#特种兵旅游 #打卡' },
  { cat: '旅游', title: '小众美食探店', scenario: '钻巷子找本地人小店', hook: '「游客找不到，本地人排队」', shots: ['巷口定位', '老板现做特写', '第一口反应', '人均价标注'], voice: '口播：「认准这家」', bgm: '轻快', caption: '#美食探店 #本地' },
  { cat: '旅游', title: '一个人旅行 vlog', scenario: '独行也精彩的自我对话', hook: '「一个人，也能把日子过成诗」', shots: ['行李箱出发', '独自看海/城', '自拍杆延时', '夜记手账'], voice: '旁白：「独处是和自己约会」', bgm: '民谣', caption: '#一个人旅行 #独行' },
  { cat: 'Cos', title: '汉服日常反差 vlog', scenario: '把汉服穿进食堂/教室的破次元反差', hook: '「穿汉服去上早八，室友看傻了」', shots: ['出门穿汉服', '教室落座反差', '食堂端餐盘', '回寝换常服对比'], voice: '「传统也能很日常」', bgm: '国风电子', caption: '#汉服日常 #反差' },
  { cat: 'Cos', title: '角色声线模仿', scenario: '配音向，还原本命经典台词', hook: '「闭眼一听，就是他本人」', shots: ['原片名场面', '自己对着镜子配', '音画对比', '花絮笑场'], voice: '原台词+即兴吐槽', bgm: '角色 BGM 纯音', caption: '#配音 #声控' },
  { cat: '追星', title: '双担舞台对比', scenario: '把两个爱豆同曲目不同舞台剪在一起', hook: '「同一个动作，两种心动」', shots: ['A舞台高光', 'B舞台高光', '逐帧对比', '结尾二选一投票'], voice: '「你更pick谁」', bgm: '双舞台混音', caption: '#双担 #对比' },
  { cat: '追星', title: '小卡开箱测评', scenario: '拆新出的周边盲盒/小卡', hook: '「这一盒到底值不值」', shots: ['未拆封展示', '逐张开箱', '自留/出闲鱼标注', '性价比结论'], voice: '真实测评不恰烂钱', bgm: '轻快', caption: '#周边开箱 #测评' },
  { cat: '旅游', title: '夜市逛吃攻略', scenario: '本地夜市扫街，学生党友好', hook: '「50 块吃撑的夜市地图」', shots: ['入口全景', '每摊特写+价格', '必点清单', '避雷提示'], voice: '口播：「这家别错过」', bgm: '市井 lo-fi', caption: '#夜市 #美食' },
  { cat: '旅游', title: '高铁周末游', scenario: '2 小时直达周边城市的一日往返', hook: '「不上班的周末，去隔壁省」', shots: ['高铁票特写', '出站打卡', 'citywalk快剪', '当晚返程'], voice: '「说走就走」', bgm: 'city pop', caption: '#高铁游 #周末' },
  { cat: 'Cos', title: '病娇反派 cos', scenario: '用妆造和眼神拿捏反派疯感', hook: '「温柔笑着，却让人后背发凉」', shots: ['素颜对比', '上妆过程', '眼神特写练习', '定格wink'], voice: '「疯批也可以很美」', bgm: '暗黑电子', caption: '#病娇 #反派cos' },
  { cat: '美食', title: '深夜食堂探店', scenario: '钻巷子找本地人小店，治愈向', hook: '「游客找不到，本地人排队」', shots: ['巷口定位', '老板现做特写', '第一口反应', '人均价标注'], voice: '口播：「认准这家」', bgm: '轻快 lo-fi', caption: '#美食探店 #本地' },
  { cat: '美食', title: '宿舍简易料理', scenario: '一个电煮锅搞定一周早餐', hook: '「宿舍也能吃出仪式感」', shots: ['食材平铺', '下锅过程', '成品摆盘', '室友抢食花絮'], voice: '「10 分钟搞定」', bgm: 'city pop', caption: '#宿舍美食 #懒人食谱' },
  { cat: '美食', title: '网红零食测评', scenario: '按热度榜买一堆挨个试', hook: '「这箱到底值不值得囤」', shots: ['开箱平铺', '逐个试吃', '打分排行', '回购结论'], voice: '真实不恰烂钱', bgm: '轻快', caption: '#零食测评 #避雷' },
  { cat: '美食', title: '减脂餐一周', scenario: '好看又好吃的低卡便当', hook: '「减脂也能吃得开心」', shots: ['备菜过程', '摆盘', '热量标注', '七天对比'], voice: '「好吃才坚持得下去」', bgm: '轻音乐', caption: '#减脂餐 #健康' },
  { cat: '学习', title: '考研自习室 vlog', scenario: '沉浸式学习陪伴，解焦虑', hook: '「陪你一起，今天也加油」', shots: ['入座摊书', '番茄钟计时', '背书法特写', '收工小结'], voice: '白噪音+轻语', bgm: 'lo-fi 学习向', caption: '#考研 #学习陪伴' },
  { cat: '学习', title: '高效笔记法', scenario: '康奈尔/思维导图实操', hook: '「这个方法让我少背三遍」', shots: ['工具平铺', '分步示范', '成品展示', '适用场景'], voice: '教程口播', bgm: '无词电子', caption: '#笔记法 #干货' },
  { cat: '学习', title: '期末复习倒计时', scenario: '一周突击计划拆解', hook: '「七天，从挂科边缘到稳过」', shots: ['倒计时板', '每日重点', '刷题实录', '查分反应'], voice: '「别放弃，还来得及」', bgm: '轻快', caption: '#期末 #复习' },
  { cat: '学习', title: '医学导图速记', scenario: '把疾病编成记忆宫殿', hook: '「一张图记住整章」', shots: ['空白导图', '边讲边填', '彩色标注', '闭眼复述'], voice: '讲解口播', bgm: '轻音乐', caption: '#医学 #记忆法' },
  { cat: '穿搭', title: '少年感一周穿搭', scenario: '基础款叠穿低饱和', hook: '「不费力也好看」', shots: ['单品平铺', '每日 OOTD', '细节特写', '总结公式'], voice: '「少买多搭」', bgm: 'city pop', caption: '#少年感 #穿搭' },
  { cat: '穿搭', title: '小个子穿搭公式', scenario: '显高比例技巧', hook: '「155 也能穿出大长腿」', shots: ['踩雷示范', '正确示范', '腰线对比', '鞋款推荐'], voice: '教程口播', bgm: '轻快', caption: '#小个子 #穿搭' },
  { cat: '穿搭', title: '旧衣改造', scenario: '把压箱底改出新花样', hook: '「这件居然还能这么穿」', shots: ['原衣展示', '剪改过程', '变身对比', '搭配示范'], voice: '「环保又省钱」', bgm: 'lo-fi', caption: '#旧衣改造 #DIY' },
  { cat: '萌宠', title: '云吸猫日常', scenario: '记录猫主子迷惑行为', hook: '「它今天又干了什么蠢事」', shots: ['睡姿特写', '拆家瞬间', '求食卖萌', '结尾定格'], voice: '旁白碎碎念', bgm: '轻快', caption: '#萌宠 #云吸猫' },
  { cat: '萌宠', title: '宠物拆家实录', scenario: '回家看到灾难现场', hook: '「我不在的这三小时」', shots: ['出门前', '回家惊呆', '主子无辜脸', '收拾残局'], voice: '崩溃又好笑', bgm: '喜剧', caption: '#宠物 #拆家' },
  { cat: '萌宠', title: '遛狗 vlog', scenario: '和狗子的一天散步', hook: '「被它拉去看了整座城市」', shots: ['出门兴奋', '公园奔跑', '路人互动', '回家瘫倒'], voice: '轻松旁白', bgm: '轻快', caption: '#遛狗 #日常' },
  { cat: '手工', title: '手帐拼贴教程', scenario: '一周手帐排版思路', hook: '「把生活贴成画」', shots: ['素材平铺', '排版示范', '成品翻页', '省钱渠道'], voice: '教程口播', bgm: '轻音乐', caption: '#手帐 #拼贴' },
  { cat: '手工', title: '滴胶小物 DIY', scenario: '做一款专属手机壳', hook: '「独一无二送自己」', shots: ['材料准备', '调色倒模', '脱模打磨', '成品展示'], voice: '「新手也能成」', bgm: 'lo-fi', caption: '#滴胶 #手工' },
  { cat: '手工', title: '串珠配饰', scenario: '复古珍珠手链编法', hook: '「一条手链的成本价」', shots: ['珠材平铺', '编法示范', '成品上身', '配色思路'], voice: '教程口播', bgm: '轻快', caption: '#串珠 #配饰' },
  { cat: '日常', title: '医学生的一天', scenario: '早八到夜自习的真实记录', hook: '「医学生的 24 小时」', shots: ['清晨闹钟', '早八课堂', '实验室', '夜自习收工'], voice: '流水账但带情绪', bgm: '轻音乐', caption: '#医学生 #日常' },
  { cat: '日常', title: '独居生活记录', scenario: '一个人也把日子过好', hook: '「独居第 N 天，挺好」', shots: ['早起煮咖啡', '收拾房间', '做饭', '夜读手账'], voice: '旁白：「与自己相处」', bgm: '民谣', caption: '#独居 #生活' },
  { cat: '日常', title: '周末断舍离', scenario: '一次彻底收纳', hook: '「扔掉一半，清爽了」', shots: ['前对比乱', '分类过程', '收纳技巧', '后对比爽'], voice: '「少即是多」', bgm: '轻快', caption: '#断舍离 #收纳' },
  { cat: '护肤', title: '油皮护肤流程', scenario: '清洁-保湿-防晒三步', hook: '「不踩雷的极简护肤」', shots: ['肤质分析', '产品平铺', '手法示范', '晨晚对比'], voice: '教程口播', bgm: '轻音乐', caption: '#护肤 #油皮' },
  { cat: '护肤', title: '平价好物盘点', scenario: '学生党友好清单', hook: '「百元搞定全套」', shots: ['清单展示', '逐个试用', '肤感特写', '回购建议'], voice: '真实测评', bgm: '轻快', caption: '#平价好物 #学生党' },
  { cat: '健身', title: '宿舍无器械训练', scenario: '床边就能练', hook: '「不出门也能动起来」', shots: ['热身', '动作分解', '跟练计时', '拉伸收尾'], voice: '「跟练就行」', bgm: '运动电子', caption: '#宿舍健身 #无器械' },
  { cat: '健身', title: '帕梅拉跟练打卡', scenario: '21 天计划记录', hook: '「第 N 天，肉眼可见变化」', shots: ['Day1 状态', '每日跟练', '对比照', '心得分享'], voice: '「坚持有反馈」', bgm: '运动', caption: '#帕梅拉 #打卡' }
];
function renderVideoScr() {
  const el = document.getElementById('videoScrBox'); if (!el) return;
  const cats = ['全部', ...Array.from(new Set(videoScripts.map(v => v.cat)))];
  const cur = el.dataset.cat || '全部';
  const pool = cur === '全部' ? videoScripts : videoScripts.filter(v => v.cat === cur);
  const list = seededShuffle(pool, 'vscr' + cur + todayKey());
  el.innerHTML = `
    <div class="text-sm mb-2" style="color:#1565c0;font-weight:700">📅 每日更新 · ${todayKey()}（共 ${videoScripts.length} 套脚本模板，每天轮换呈现顺序，覆盖 Cos / 追星 / 旅游 / 美食 / 学习 / 穿搭 / 萌宠 / 手工 / 日常 / 护肤 / 健身）</div>
    <div class="tabs" id="vsTabs">
      ${cats.map(c => `<div class="tab ${c === cur ? 'active' : ''}" onclick="setVsCat('${c}')">${c === '全部' ? '全部' : (c === 'Cos' ? '👗 Cos' : c === '追星' ? '⭐ 追星' : '✈️ 旅游')}</div>`).join('')}
    </div>
    <div class="mt-2">
      ${list.map((v, i) => `<div class="card">
        <div class="flex-between"><div class="font-bold">🎬 ${esc(v.title)}</div><span class="tier-S">${v.cat}</span></div>
        <div class="text-sm mt-1"><b>情境：</b>${esc(v.scenario)}</div>
        <div class="text-sm mt-1"><span class="text-orange">钩子：</span>${esc(v.hook)}</div>
        <div class="text-sm mt-1"><b>分镜：</b></div>
        <div class="text-sm">${v.shots.map(s => '· ' + esc(s)).join('<br>')}</div>
        <div class="text-sm mt-1"><span class="text-blue">口播：</span>${esc(v.voice)}</div>
        <div class="text-sm mt-1"><span class="text-green">BGM：</span>${esc(v.bgm)}</div>
        <div class="text-sm mt-1"><span class="text-muted">文案：</span>${esc(v.caption)}</div>
        ${gstar('vscr-' + cur + '-' + i, '脚本', v.title, v.hook)}
      </div>`).join('')}
    </div>`;
}
function setVsCat(cat) {
  const el = document.getElementById('videoScrBox'); if (!el) return;
  el.dataset.cat = cat; renderVideoScr();
}

/* ===================================================================
   ⑥ 剪辑打卡：转场 / 变速 / 调色 / 卡点
   =================================================================== */
const editTasks = [
  { id: 'et_transition', name: '转场练习', cat: '转场', desc: '用「遮罩/匹配剪辑/运动模糊」做 1 个无缝转场', tip: '匹配剪辑：前后两镜头的形状/运动方向一致最顺。' },
  { id: 'et_speed', name: '变速练习', cat: '变速', desc: '给一段素材做「慢动作高光+快进过渡」', tip: '关键动作慢放、过场快进，节奏立刻高级。' },
  { id: 'et_color', name: '调色练习', cat: '调色', desc: '套用/手调一套滤镜（对比度+色温+暗角）', tip: '统一色调比「好看」更重要，全片基调一致。' },
  { id: 'et_beat', name: '卡点练习', cat: '卡点', desc: '跟随鼓点切 8 个镜头', tip: '先听 BGM 标 beat，再按重音下刀。' },
  { id: 'et_text', name: '字幕/花字', cat: '包装', desc: '做一组动态花字标题', tip: '花字别挡人脸，出现/消失带小动效。' },
  { id: 'et_audio', name: '音频处理', cat: '声音', desc: '降噪+人声增强+背景乐音量平衡', tip: '人声 -6dB 左右，BGM -18dB 不抢戏。' },
  { id: 'et_frame', name: '构图练习', cat: '构图', desc: '用三分法/引导线重拍 3 张', tip: '手机开网格线，主体放交叉点。' },
  { id: 'et_story', name: '叙事结构', cat: '结构', desc: '用「开头钩子+3个要点+金句结尾」剪 30 秒', tip: '先写脚本再剪，不沉迷素材。' },
  { id: 'et_mask', name: '蒙版/抠图', cat: '特效', desc: '用蒙版把人物从背景分离做合成', tip: '用钢笔/色度建蒙版，边缘加 2px 羽化更自然。' },
  { id: 'et_stab', name: '防抖/稳定', cat: '画面', desc: '用 Warp/陀螺仪稳定抖动画面', tip: '先裁剪 10% 余量再稳定，避免黑边。' },
  { id: 'et_keyframe', name: '关键帧动画', cat: '动效', desc: '给文字/贴纸做位移缩放关键帧', tip: '缓入缓出比匀速更舒服。' },
  { id: 'et_green', name: '绿幕合成', cat: '特效', desc: '实拍人物叠加虚拟背景', tip: '打光均匀、人物离幕 1m 以上，抠得更干净。' },
  { id: 'et_jcut', name: 'J/L 切', cat: '转场', desc: '声音先入/画面后入的进阶转场', tip: 'L-cut：画面切了声音还在，叙事更顺。' },
  { id: 'et_sub', name: '字幕/多语', cat: '包装', desc: '做可关闭的双语字幕条', tip: '字幕在安全区下 1/10，别压到关键画面。' }
];
function renderEditCheck() {
  const el = document.getElementById('editCheckBox'); if (!el) return;
  const ab = document.getElementById('editCheckAppBox');
  if (ab) ab.innerHTML = appLinkRow([
    { name: '剪映', pkg: 'com.lemon.lv', url: 'https://lv.ulikecam.com/', scheme: 'com.lemon.lv', icon: '✂️' }
  ]);
  const tk = todayKey();
  let done = store.get('luo_editcheck_' + tk, {});
  let streak = store.get('luo_edit_streak', 0);
  // 历史累计打卡天数
  const history = store.get('luo_edit_history', {});
  const days = Object.keys(history).length;
  el.innerHTML = `
    <div class="stat-grid">
      <div class="stat-card"><div class="stat-num">${streak}</div><div class="stat-label">连续打卡(天)</div></div>
      <div class="stat-card"><div class="stat-num">${days}</div><div class="stat-label">累计打卡(天)</div></div>
      <div class="stat-card"><div class="stat-num">${Object.keys(done).filter(k => done[k]).length}/${editTasks.length}</div><div class="stat-label">今日完成</div></div>
    </div>
    <div class="text-sm text-muted mb-2">🎬 每日剪辑基础打卡（转场/变速/调色/卡点…）</div>
    <div class="edit-task-list">
      ${editTasks.map(t => `<div class="edit-task ${done[t.id] ? 'done' : ''}" onclick="toggleEditTask('${t.id}')">
        <div class="todo-check">${done[t.id] ? '✓' : ''}</div>
        <div class="et-body"><div class="font-bold">${esc(t.name)} <span class="text-muted" style="font-size:12px">[${t.cat}]</span></div>
        <div class="text-sm">${esc(t.desc)}</div>
        <div class="text-sm text-green">💡 ${esc(t.tip)}</div></div>
      </div>`).join('')}
    </div>
    <button class="btn btn-primary" style="width:100%;margin-top:10px" onclick="finishEditDay()">✅ 完成今日打卡</button>`;
}
function toggleEditTask(id) {
  const tk = todayKey();
  const done = store.get('luo_editcheck_' + tk, {});
  done[id] = !done[id];
  store.set('luo_editcheck_' + tk, done);
  renderEditCheck();
}
function finishEditDay() {
  const tk = todayKey();
  const done = store.get('luo_editcheck_' + tk, {});
  const cnt = Object.keys(done).filter(k => done[k]).length;
  if (cnt === 0) return toast('先完成至少一项剪辑打卡');
  const history = store.get('luo_edit_history', {});
  history[tk] = cnt;
  store.set('luo_edit_history', history);
  // 连续天数
  let streak = store.get('luo_edit_streak', 0);
  const y = new Date(Date.now() - 86400000); const yk = `${y.getFullYear()}-${y.getMonth() + 1}-${y.getDate()}`;
  streak = (store.get('luo_edit_last', '') === yk) ? streak + 1 : 1;
  store.set('luo_edit_streak', streak);
  store.set('luo_edit_last', tk);
  addPoints(10, true);
  toast('🎬 剪辑打卡完成 +10 积分，连续 ' + streak + ' 天');
  renderEditCheck();
}

/* ===================================================================
   ⑦ 好物记录：购物关键词 + 自用记录
   =================================================================== */
const goodKeywords = [
  { kw: '宿舍好物 平价', cat: '宿舍', note: '收纳/小电器/氛围灯' },
  { kw: '学生党 平价彩妆', cat: '美妆', note: '眉笔/唇釉/粉底液测评' },
  { kw: '通勤 帆布包 中性风', cat: '穿搭', note: '少年感百搭' },
  { kw: '空气炸锅 食谱', cat: '厨房', note: '低脂小吃' },
  { kw: '考研 资料 红宝书', cat: '学习', note: '单词/真题' },
  { kw: '健身 弹力带 居家', cat: '运动', note: '无器械' },
  { kw: '自拍 补光灯 便携', cat: '拍摄', note: '桌面/手持' },
  { kw: '机械键盘 静音', cat: '数码', note: '宿舍不扰民' },
  { kw: '平价香水 中性', cat: '美妆', note: '木质/柑橘调' },
  { kw: '露营 入门 装备', cat: '户外', note: '天幕/折叠椅' },
  { kw: '读书 Kindle 平替', cat: '阅读', note: '护眼屏' },
  { kw: '追星 应援 手幅 DIY', cat: '追星', note: '材料清单' },
  { kw: '考研 咖啡 提神', cat: '饮品', note: '挂耳/冷萃' },
  { kw: '电脑 支架 升降', cat: '数码', note: '护颈' },
  { kw: '平价 卫衣 oversize', cat: '穿搭', note: '叠穿' },
  { kw: '护腕 健身 举重', cat: '运动', note: '护具' },
  { kw: '平价 蓝牙耳机 降噪', cat: '数码', note: '自习/通勤' },
  { kw: '宿舍 床帘 遮光', cat: '宿舍', note: '隐私/助眠' },
  { kw: '考研 番茄钟 计时器', cat: '学习', note: '专注' },
  { kw: '桌面 收纳 洞洞板', cat: '宿舍', note: '走线/文具' },
  { kw: '平价 香水 小样', cat: '美妆', note: '先试后买' },
  { kw: '瑜伽垫 加厚 防滑', cat: '运动', note: '居家乡健' },
  { kw: '学生 电脑包 防摔', cat: '数码', note: '上课通勤' },
  { kw: '拍立得 相纸 平替', cat: '拍摄', note: '追星/手账' },
  { kw: '平价 保温杯 大容量', cat: '生活', note: '上课/图书馆' },
  { kw: '露营 折叠桌 便携', cat: '户外', note: '轻量化' },
  { kw: '平价 机械键盘 客制化', cat: '数码', note: '手感/性价比' }
];
function renderGoods() {
  const el = document.getElementById('goodsBox'); if (!el) return;
  el.innerHTML = `
    <div class="card">
      <div class="font-bold mb-2">🔍 购物搜索关键词（点关键词一键搜）</div>
      <input class="form-input" id="goodsSearch" placeholder="筛选关键词，如：宿舍 / 美妆" oninput="renderGoodKeywords()">
      <div class="chip-row mt-2" id="goodsKeywordList"></div>
    </div>
    <div class="card mt-3">
      <div class="font-bold mb-2">🛍️ 我的自用好物</div>
      <div class="form-group"><input class="form-input" id="gName" placeholder="物品名"></div>
      <div class="form-row">
        <input class="form-input" id="gPrice" placeholder="价格">
        <input class="form-input" id="gChannel" placeholder="渠道">
      </div>
      <div class="form-row">
        <input class="form-input" id="gRating" placeholder="评分 1-5">
        <input class="form-input" id="gCat" placeholder="分类">
      </div>
      <textarea class="form-textarea" id="gNote" placeholder="使用感受 / 优缺点"></textarea>
      <button class="btn btn-primary" style="width:100%;margin-top:6px" onclick="addGood()">保存好物</button>
    </div>
    <div id="goodsMine" class="mt-3"></div>`;
  renderGoodKeywords();
  renderGoodsMine();
}
function renderGoodKeywords() {
  const box = document.getElementById('goodsKeywordList'); if (!box) return;
  const kw = (document.getElementById('goodsSearch') || {}).value || '';
  const list = goodKeywords.filter(g => !kw || g.kw.includes(kw) || g.cat.includes(kw) || g.note.includes(kw));
  box.innerHTML = list.length ? list.map(g => `<a class="chip" href="${searchLinks(g.kw).xhs}" target="_blank">${esc(g.kw)} <span class="text-muted">·${esc(g.cat)}</span></a>`).join('') : '<span class="text-sm text-muted">无匹配关键词</span>';
}
function renderGoodsMine() {
  const m = document.getElementById('goodsMine'); if (!m) return;
  const mine = store.get('luo_goods', []);
  m.innerHTML = mine.length ? mine.map((g, i) => `<div class="card">
    <div class="flex-between"><div class="font-bold">${esc(g.name)} <span class="tier-A">${esc(g.cat || '')}</span></div><button class="todo-del" onclick="delGood(${i})">×</button></div>
    <div class="text-sm text-muted">💰 ${esc(g.price || '—')} · 🛒 ${esc(g.channel || '—')} · ⭐ ${esc(g.rating || '—')}</div>
    <div class="text-sm mt-1">${esc(g.note || '')}</div>
    ${gstar('good-' + i, '好物', g.name, g.note)}
  </div>`).join('') : '<div class="list-empty">还没有记录，添加第一件好物吧</div>';
}
function addGood() {
  const name = (document.getElementById('gName') || {}).value?.trim();
  if (!name) return toast('请输入物品名');
  const mine = store.get('luo_goods', []);
  mine.unshift({
    name, price: (document.getElementById('gPrice') || {}).value, channel: (document.getElementById('gChannel') || {}).value,
    rating: (document.getElementById('gRating') || {}).value, cat: (document.getElementById('gCat') || {}).value,
    note: (document.getElementById('gNote') || {}).value, date: fmtDate()
  });
  store.set('luo_goods', mine);
  addPoints(2, true);
  toast('已记录好物 +2');
  renderGoods();
}
function delGood(i) { const m = store.get('luo_goods', []); m.splice(i, 1); store.set('luo_goods', m); renderGoods(); }

/* ===================================================================
   奖励机制 · 跨模块客观评价 · 改善建议
   =================================================================== */
function getCount(key) { const v = store.get(key, []); return Array.isArray(v) ? v.length : 0; }
function countNotes() {
  const ids = ['daily', 'dailyreview', 'review', 'english', 'vocab', 'exam', 'medical', 'novel', 'jjwxc', 'novelcraft', 'videoscr', 'edit', 'editcheck', 'media', 'viral', 'material', 'genius', 'meme', 'mine', 'drawing', 'guitar', 'kitchen', 'travel', 'image', 'fitness', 'books', 'booknotes', 'booklearn', 'film', 'office', 'ai', 'eq', 'finance', 'recruit', 'accounting', 'goods', 'seasonaldish', 'rewards'];
  return ids.reduce((s, id) => s + getCount('luo_notes_' + id), 0);
}
const REALM_ICONS = ['🌱','🍃','🪨','💡','🌿','🔮','👶','🌌','🧠','🤝','🕳️','📜','⚡','⛰️','🌟','🛡️','☯️','♾️','👑'];
function renderRewards() {
  const el = document.getElementById('rewardsBox'); if (!el) return;
  const pts = totalPoints;
  const lv = levelFor(pts);
  const streak = store.get('luo_streak', { count: 0, last: '' });
  const vocabLearned = (store.get('luo_vocab_state', { learned: [] }).learned || []).length;
  const editStreak = store.get('luo_edit_streak', 0);
  const gold = getGolden().length;
  const fly = flyDaysLeft();
  // 19 重境界阶梯
  const ladder = LEVELS.map((L, i) => {
    const reached = pts >= L.need;
    const isCur = (i + 1) === lv.lv;
    return `<div class="realm-step ${reached ? 'reached' : ''} ${isCur ? 'cur' : ''}">
      <div class="realm-dot">${reached ? REALM_ICONS[i] : (i + 1)}</div>
      <div class="realm-name">${L.name}</div>
      <div class="realm-sub">${L.sub}</div>
      <div class="realm-need">${L.need} 分</div>
    </div>`;
  }).join('');
  const badges = [
    { n: '🌱 凡境启程', c: pts >= 60 }, { n: '🔥 连续7天', c: streak.count >= 7 },
    { n: '📝 复盘达人', c: getCount('luo_dailyreview') >= 5 }, { n: '🧾 记账达人', c: getCount('luo_accounting') >= 10 },
    { n: '📑 书摘收藏', c: getCount('luo_booknotes') >= 5 }, { n: '🔤 单词进阶', c: vocabLearned >= 30 },
    { n: '✂️ 剪辑打卡', c: editStreak >= 5 }, { n: '⭐ 收藏家', c: gold >= 20 },
    { n: '🎬 创作素材', c: gold >= 10 }, { n: '🏆 金丹突破', c: pts >= 650 },
    { n: '🌟 大乘在望', c: pts >= 2900 }, { n: '👑 仙帝飞升', c: pts >= 8000 }
  ];
  const owned = badges.filter(b => b.c).length;
  const stats = [
    ['积分', pts], ['境界', 'Lv' + lv.lv + ' ' + lv.title], ['距飞升之期', fly + ' 天'],
    ['连续完成任务', streak.count + ' 天'], ['累计笔记', countNotes() + ' 条'],
    ['每日复盘', getCount('luo_dailyreview')], ['书摘', getCount('luo_booknotes')],
    ['拉片', getCount('luo_films')], ['电子菜谱', getCount('luo_recipes')],
    ['旅行攻略', getCount('luo_travel_guides')], ['好物', getCount('luo_goods')],
    ['记账', getCount('luo_accounting') + ' 条'], ['已背单词', vocabLearned], ['收藏', gold]
  ];
  // 客观评价与建议（基于真实存储数据）
  const empty = [];
  if (countNotes() === 0) empty.push('笔记');
  if (getCount('luo_dailyreview') === 0) empty.push('每日复盘');
  if (getCount('luo_booknotes') === 0) empty.push('书摘');
  if (getCount('luo_films') === 0) empty.push('拉片');
  if (getCount('luo_accounting') === 0) empty.push('记账');
  if (vocabLearned < 30) empty.push('单词背诵');
  if (editStreak < 5) empty.push('剪辑打卡');
  const mustDone = (typeof mustDos !== 'undefined') ? mustDos.every(m => m.done) : true;
  let evalText = '';
  if (streak.count === 0 && pts < 80) evalText = '你尚处凡境，建议先固定「每日必打卡」习惯，积满 60 分即可踏入炼气期。';
  else if (empty.length >= 4) evalText = '主线任务在推进，但记录型模块（' + empty.join('、') + '）还是空白。建议每天挑 1 个顺手记一条，积累长期复利。';
  else if (empty.length > 0) evalText = '整体不错！还有「' + empty.join('、') + '」可以开始经营，它们是复盘与创作素材的宝库。';
  else evalText = '全模块都在运转，执行力很强。建议每周做一次跨模块复盘，把书摘/拉片/笔记串成自己的方法论。';
  let suggest = '';
  if (!mustDone) suggest = '<br><b>💡 改善建议：</b>今日「每日必打卡」尚未全部完成，先补齐运动/英语/乐器等基础项，连续天数才会计入奖励。';
  else if (empty.length) suggest = '<br><b>💡 改善建议：</b>从空白模块里选一个最低门槛的开始（如记账每天 1 笔、复盘每天 3 行），比一次性全开更可持续。';
  else suggest = '<br><b>🎁 奖励建议：</b>各模块均衡，可给自己设一个阶段奖励（如突破金丹期即兑换喜欢的小物）。';

  el.innerHTML = `
    <div class="reward-hero">
      <div class="reward-lv">Lv${lv.lv}/${lv.total} · ${lv.title}</div>
      <div class="reward-sub">${lv.sub}${lv.next ? ' → 下一境界「' + lv.next + '」还需 ' + (lv.nextPts - pts) + ' 分' : ' · 已臻飞升之巅 👑'}</div>
      <div class="realm-bar"><div class="realm-bar-fill" style="width:${lv.progress}%"></div></div>
      <div class="reward-pts">${pts} 积分</div>
      <div class="reward-streak">🔥 连续 ${streak.count} 天 · ⏳ 距飞升之期 ${fly} 天</div>
    </div>
    <div class="card mt-3">
      <div class="font-bold mb-2">🪜 19 重境界（已至 ${lv.lv}/${lv.total}）</div>
      <div class="realm-ladder">${ladder}</div>
    </div>
    <div class="card mt-3">
      <div class="font-bold mb-2">🏅 成就徽章（${owned}/${badges.length}）</div>
      <div class="badge-grid">${badges.map(b => `<div class="badge ${b.c ? 'on' : ''}">${b.n}</div>`).join('')}</div>
    </div>
    <div class="card mt-3">
      <div class="font-bold mb-2">📊 我的数据（客观统计）</div>
      <div class="stat-grid2">${stats.map(s => `<div class="stat-mini"><b>${s[1]}</b><span>${s[0]}</span></div>`).join('')}</div>
    </div>
    <div class="card mt-3">
      <div class="font-bold mb-2">📋 客观评价与改善建议</div>
      <div class="text-sm">${evalText}${suggest}</div>
    </div>
    <button class="btn btn-primary" style="width:100%;margin-top:10px" onclick="claimDailyReward()">🎁 领取今日奖励（完成必打卡 +30）</button>`;
}
function claimDailyReward() {
  const mustDone = (typeof mustDos !== 'undefined') ? mustDos.every(m => m.done) : true;
  if (!mustDone) return toast('先完成今日全部「每日必打卡」再领取奖励');
  const streak = store.get('luo_streak', { count: 0, last: '' });
  const tk = todayKey();
  if (streak.last === tk) return toast('今日奖励已领取 ✓');
  const y = new Date(Date.now() - 86400000); const yk = `${y.getFullYear()}-${y.getMonth() + 1}-${y.getDate()}`;
  streak.count = (streak.last === yk) ? streak.count + 1 : 1;
  streak.last = tk;
  store.set('luo_streak', streak);
  addPoints(30, true);
  toast('🎁 +30 积分，连续 ' + streak.count + ' 天');
  renderRewards();
}

/* ===================================================================
   持久化：每日复盘 / 书摘 / 拉片 / 记账
   =================================================================== */
function renderDailyReview() {
  const el = document.getElementById('dailyReviewBox'); if (!el) return;
  const list = store.get('luo_dailyreview', []);
  el.innerHTML = `
    <div class="card">
      <div class="font-bold mb-2">🔁 今日复盘（自动按日期归档）</div>
      <input class="form-input" id="drMood" placeholder="今日状态（如：充实 / 焦虑 / 平静）">
      <textarea class="form-textarea mt-2" id="drDone" placeholder="① 今天完成了什么"></textarea>
      <textarea class="form-textarea mt-2" id="drImprove" placeholder="② 哪里可以更好"></textarea>
      <textarea class="form-textarea mt-2" id="drPlan" placeholder="③ 明天最重要的一件事"></textarea>
      <button class="btn btn-primary" style="width:100%;margin-top:6px" onclick="addDailyReview()">保存到复盘</button>
    </div>
    <div id="drList" class="mt-3"></div>`;
  document.getElementById('drList').innerHTML = list.length ? list.map((r, i) => `<div class="card">
    <div class="flex-between"><div class="font-bold">${esc(r.date)} · ${esc(r.mood || '')}</div><button class="todo-del" onclick="delDailyReview(${i})">×</button></div>
    <div class="text-sm mt-1"><b>✅ 完成：</b>${esc(r.done || '')}</div>
    <div class="text-sm mt-1"><b>🔧 改进：</b>${esc(r.improve || '')}</div>
    <div class="text-sm mt-1"><b>🎯 明天：</b>${esc(r.plan || '')}</div>
  </div>`).join('') : '<div class="list-empty">还没有复盘，今天写第一条吧</div>';
}
function addDailyReview() {
  const done = (document.getElementById('drDone') || {}).value?.trim();
  if (!done) return toast('请先填写「今天完成了什么」');
  const list = store.get('luo_dailyreview', []);
  list.unshift({
    date: fmtDate(), mood: (document.getElementById('drMood') || {}).value,
    done, improve: (document.getElementById('drImprove') || {}).value, plan: (document.getElementById('drPlan') || {}).value
  });
  store.set('luo_dailyreview', list);
  addPoints(2, true);
  toast('复盘已保存 +2'); renderDailyReview();
}
function delDailyReview(i) { const l = store.get('luo_dailyreview', []); l.splice(i, 1); store.set('luo_dailyreview', l); renderDailyReview(); }

function renderBookNotes() {
  const el = document.getElementById('bookNotesBox'); if (!el) return;
  const list = store.get('luo_booknotes', []);
  el.innerHTML = `
    <div class="card">
      <div class="font-bold mb-2">📑 书摘收藏（长期留存）</div>
      <input class="form-input" id="bnBook" placeholder="书名 / 作者">
      <textarea class="form-textarea mt-2" id="bnText" placeholder="摘录触动的句子，或写一句读后感"></textarea>
      <button class="btn btn-primary" style="width:100%;margin-top:6px" onclick="addBookNote()">保存书摘</button>
    </div>
    <div id="bnList" class="mt-3"></div>`;
  document.getElementById('bnList').innerHTML = list.length ? list.map((b, i) => `<div class="card">
    <div class="flex-between"><div class="font-bold">${esc(b.book || '未命名')}</div><button class="todo-del" onclick="delBookNote(${i})">×</button></div>
    <div class="text-sm mt-1">${esc(b.text || '')}</div>
    <div class="text-sm text-muted mt-1">${esc(b.date || '')}</div>
    ${gstar('bn-' + i, '书摘', b.book, b.text)}
  </div>`).join('') : '<div class="list-empty">还没有书摘，读到的好句子存下来</div>';
}
function addBookNote() {
  const text = (document.getElementById('bnText') || {}).value?.trim();
  if (!text) return toast('请输入书摘内容');
  const list = store.get('luo_booknotes', []);
  list.unshift({ book: (document.getElementById('bnBook') || {}).value, text, date: fmtDate() });
  store.set('luo_booknotes', list); addPoints(2, true); toast('书摘已保存 +2'); renderBookNotes();
}
function delBookNote(i) { const l = store.get('luo_booknotes', []); l.splice(i, 1); store.set('luo_booknotes', l); renderBookNotes(); }

function renderFilm() {
  const el = document.getElementById('filmBox'); if (!el) return;
  const list = store.get('luo_films', []);
  el.innerHTML = `
    <div class="card">
      <div class="font-bold mb-2">🎞️ 拉片笔记（逐场拆解，长期留存）</div>
      <input class="form-input" id="fmName" placeholder="片名">
      <input class="form-input mt-2" id="fmScene" placeholder="场次 / 时间码（如 00:12:30）">
      <textarea class="form-textarea mt-2" id="fmNote" placeholder="景别 / 运镜 / 灯光 / 台词 / 情绪 / 为什么好"></textarea>
      <button class="btn btn-primary" style="width:100%;margin-top:6px" onclick="addFilm()">保存拉片</button>
    </div>
    <div id="fmList" class="mt-3"></div>`;
  document.getElementById('fmList').innerHTML = list.length ? list.map((f, i) => `<div class="card">
    <div class="flex-between"><div class="font-bold">${esc(f.name || '未命名')} <span class="text-muted" style="font-size:12px">${esc(f.scene || '')}</span></div><button class="todo-del" onclick="delFilm(${i})">×</button></div>
    <div class="text-sm mt-1">${esc(f.note || '')}</div>
    <div class="text-sm text-muted mt-1">${esc(f.date || '')}</div>
    ${gstar('fm-' + i, '拉片', f.name, f.note)}
  </div>`).join('') : '<div class="list-empty">还没有拉片，挑一场戏拆解起来</div>';
}
function addFilm() {
  const name = (document.getElementById('fmName') || {}).value?.trim();
  if (!name) return toast('请输入片名');
  const list = store.get('luo_films', []);
  list.unshift({ name, scene: (document.getElementById('fmScene') || {}).value, note: (document.getElementById('fmNote') || {}).value, date: fmtDate() });
  store.set('luo_films', list); addPoints(2, true); toast('拉片已保存 +2'); renderFilm();
}
function delFilm(i) { const l = store.get('luo_films', []); l.splice(i, 1); store.set('luo_films', l); renderFilm(); }

function renderAccounting() {
  const el = document.getElementById('accountingBox'); if (!el) return;
  const list = store.get('luo_accounting', []);
  const month = todayKey().slice(0, 7);
  const monthSum = list.filter(a => (a.date || '').startsWith(month)).reduce((s, a) => s + (Number(a.amount) || 0), 0);
  el.innerHTML = `
    <div class="stat-grid">
      <div class="stat-card"><div class="stat-num">${list.length}</div><div class="stat-label">总笔数</div></div>
      <div class="stat-card"><div class="stat-num">${monthSum.toFixed(0)}</div><div class="stat-label">本月支出</div></div>
      <div class="stat-card"><div class="stat-num">${(list[0] ? Number(list[0].amount) : 0).toFixed(0)}</div><div class="stat-label">最新一笔</div></div>
    </div>
    <div class="card mt-3">
      <div class="font-bold mb-2">🧾 记一笔</div>
      <div class="form-row">
        <input class="form-input" id="acAmount" placeholder="金额" type="number">
        <input class="form-input" id="acCat" placeholder="分类（餐饮/学习…）">
      </div>
      <input class="form-input mt-2" id="acNote" placeholder="备注">
      <button class="btn btn-primary" style="width:100%;margin-top:6px" onclick="addAccounting()">保存记账</button>
    </div>
    <div id="acList" class="mt-3"></div>`;
  document.getElementById('acList').innerHTML = list.length ? list.map((a, i) => `<div class="card">
    <div class="flex-between"><div><b>¥${(Number(a.amount) || 0).toFixed(0)}</b> <span class="text-muted">· ${esc(a.cat || '')}</span></div><button class="todo-del" onclick="delAccounting(${i})">×</button></div>
    <div class="text-sm mt-1">${esc(a.note || '')} <span class="text-muted">· ${esc(a.date || '')}</span></div>
  </div>`).join('') : '<div class="list-empty">还没有记账，今天第一笔走起</div>';
}
function addAccounting() {
  const amount = (document.getElementById('acAmount') || {}).value;
  if (!amount) return toast('请输入金额');
  const list = store.get('luo_accounting', []);
  list.unshift({ amount, cat: (document.getElementById('acCat') || {}).value, note: (document.getElementById('acNote') || {}).value, date: fmtDate() });
  store.set('luo_accounting', list); addPoints(2, true); toast('已记账 +2'); renderAccounting();
}
function delAccounting(i) { const l = store.get('luo_accounting', []); l.splice(i, 1); store.set('luo_accounting', l); renderAccounting(); }

/* ===================================================================
   时令菜品（按当前季节 + 物价 + 备菜流程）
   =================================================================== */
const seasonalDishes = {
  '春': [
    { name: '春笋炒肉', price: '春笋约 4 元 + 肉 8 元', prep: '1. 春笋去壳切滚刀焯水去涩；2. 肉片滑炒；3. 合炒加盐。', tip: '春笋鲜嫩，焯水去草酸更爽口。' },
    { name: '香椿炒蛋', price: '香椿约 6 元 + 蛋 2 元', prep: '1. 香椿焯水切碎；2. 蛋液混合；3. 少油摊熟。', tip: '焯水去亚硝酸盐，别贪生。' },
    { name: '荠菜馄饨', price: '荠菜约 3 元 + 肉 8 元', prep: '1. 荠菜焯水挤干剁碎；2. 拌肉馅包馄饨；3. 汤底紫菜虾皮。', tip: '春天限定的清香，冷冻可存。' },
    { name: '清炒芦笋', price: '芦笋约 6 元', prep: '1. 老根去皮切段；2. 蒜末快炒；3. 少盐出锅。', tip: '焯 30 秒更翠绿。' },
    { name: '草莓奶昔', price: '草莓约 8 元 + 奶 3 元', prep: '1. 草莓去蒂；2. 加酸奶/牛奶打匀；3. 可加燕麦。', tip: '春日颜值饮品，低糖版用无糖酸奶。' },
    { name: '韭菜炒河虾', price: '韭菜约 3 元 + 河虾 10 元', prep: '1. 河虾过油；2. 韭菜段大火快炒；3. 料酒提鲜。', tip: '春季韭菜最嫩，别炒老。' }
  ],
  '夏': [
    { name: '蒜蓉拍黄瓜', price: '黄瓜约 2-3 元/根', prep: '1. 黄瓜拍裂切段；2. 蒜末+生抽+醋+少许糖；3. 冷藏 10 分钟更爽口。', tip: '末伏清热解腻，5 分钟搞定。' },
    { name: '清炒空心菜', price: '空心菜约 3-4 元/把', prep: '1. 梗叶分开；2. 热油蒜末爆香先下梗；3. 再下叶大火 30 秒。', tip: '火大速度快，避免出水变黑。' },
    { name: '苦瓜炒蛋', price: '苦瓜约 3 元 + 蛋 2 元', prep: '1. 苦瓜薄片盐腌去苦；2. 蛋液炒散盛出；3. 合炒调味。', tip: '盐腌后挤水，苦味大减。' },
    { name: '丝瓜虾仁汤', price: '丝瓜约 3 元 + 虾仁 8-12 元', prep: '1. 丝瓜滚刀块；2. 少油煸软；3. 加水煮开下虾仁。', tip: '夏季补蛋白又清淡。' },
    { name: '冬瓜排骨汤', price: '冬瓜约 2 元 + 排骨 15 元', prep: '1. 排骨焯水；2. 冬瓜块同炖 40 分钟；3. 少盐。', tip: '末伏「冬瓜清热」经典，可加薏米。' },
    { name: '凉拌豇豆', price: '豇豆约 4 元', prep: '1. 整根焯熟切段；2. 蒜泥+辣油+生抽；3. 拌匀。', tip: '务必煮熟，生豇豆有毒。' }
  ],
  '秋': [
    { name: '板栗烧鸡', price: '板栗约 5 元 + 鸡 12 元', prep: '1. 鸡块焯水；2. 炒糖色下鸡；3. 加板栗焖 20 分钟。', tip: '秋补经典，板栗粉糯。' },
    { name: '莲藕排骨汤', price: '莲藕约 4 元 + 排骨 12 元', prep: '1. 排骨焯水；2. 莲藕块同炖 1 小时；3. 少盐。', tip: '秋燥润肺，藕选粉藕更糯。' },
    { name: '南瓜浓汤', price: '南瓜约 3 元 + 奶 3 元', prep: '1. 南瓜蒸熟；2. 加奶打成泥；3. 回锅少煮。', tip: '无糖版也甜，适合早餐。' },
    { name: '糖炒栗子', price: '栗子约 8 元', prep: '1. 栗子划口；2. 加糖油小火炒；3. 壳裂即熟。', tip: '划口防爆，街头同款。' },
    { name: '桂花糯米藕', price: '藕约 4 元 + 糯米 2 元', prep: '1. 糯米塞藕孔；2. 红糖桂花煮 1 小时；3. 切片淋汁。', tip: '秋日限定甜品，冷藏更 Q。' },
    { name: '山药炒木耳', price: '山药约 4 元 + 木耳 3 元', prep: '1. 山药去皮切片焯水；2. 木耳泡发；3. 清炒勾薄芡。', tip: '戴手套处理山药防痒。' }
  ],
  '冬': [
    { name: '萝卜炖牛腩', price: '萝卜约 2 元 + 牛腩 18 元', prep: '1. 牛腩焯水；2. 萝卜块同炖 1.5 小时；3. 调味。', tip: '冬令进补，萝卜吸满肉香。' },
    { name: '羊肉汤', price: '羊肉约 20 元', prep: '1. 羊肉焯水；2. 加姜葱白胡椒炖 1 小时；3. 撒香菜。', tip: '驱寒暖身，去膻靠焯水+白胡椒。' },
    { name: '白菜猪肉饺', price: '白菜约 2 元 + 肉 8 元', prep: '1. 白菜剁碎挤水拌肉；2. 包饺；3. 水开三滚。', tip: '白菜挤水防出汤。' },
    { name: '红薯粥', price: '红薯约 3 元', prep: '1. 红薯切块；2. 大米同煮成粥；3. 可加红枣。', tip: '暖胃早餐，天然甜。' },
    { name: '红烧羊肉', price: '羊肉约 20 元', prep: '1. 羊肉焯水；2. 炒糖色加料焖 1 小时；3. 收汁。', tip: '冬季硬菜，配饭一绝。' },
    { name: '腊味煲仔饭', price: '腊肠约 10 元 + 米 2 元', prep: '1. 米煮到半熟铺腊肠；2. 小火焖出饭焦；3. 淋酱汁。', tip: '锅巴是灵魂，注意火候。' }
  ]
};
function currentSeason() {
  const m = new Date().getMonth() + 1;
  if (m >= 3 && m <= 5) return '春';
  if (m >= 6 && m <= 8) return '夏';
  if (m >= 9 && m <= 11) return '秋';
  return '冬';
}
function seasonDishesData() {
  const s = currentSeason();
  return { season: s, list: seasonalDishes[s] || seasonalDishes['夏'] };
}
function renderSeasonalDish() {
  const el = document.getElementById('seasonalBox'); if (!el) return;
  const { season, list } = seasonDishesData();
  el.innerHTML = `
    <div class="season-banner">🌿 当前时令：<b>${season}季</b>（${fmtDate()} 自动判定）</div>
    <p class="text-sm text-muted mb-2">根据季节推荐应季菜品，附物价参考与常规备菜流程。</p>
    ${list.map((d, i) => `<div class="card">
      <div class="flex-between"><div class="font-bold">🥗 ${esc(d.name)}</div>${gstar('dish-' + i, '菜品', d.name, d.prep)}</div>
      <div class="text-sm text-orange mt-1">💰 物价参考：${esc(d.price)}</div>
      <div class="text-sm mt-1"><span class="text-blue">📋 备菜流程：</span>${esc(d.prep)}</div>
      <div class="text-sm text-green mt-1">💡 ${esc(d.tip)}</div>
    </div>`).join('')}`;
}
/* 把时令数据也喂给 kitchen 页已有的 #seasonDishes */
function fillKitchenSeason() {
  const el = document.getElementById('seasonDishes'); if (!el) return;
  const { season, list } = seasonDishesData();
  el.innerHTML = `<b>${season}季时令（${fmtDate()}）：</b>${list.map(d => esc(d.name) + '（' + esc(d.price) + '）').join('、')}。`;
}

/* ===================================================================
   好书拆分学习（实时整理 2026）
   =================================================================== */
const bookLearn = [
  { title: '《被讨厌的勇气》', author: '岸见一郎 / 古贺史健', why: '阿德勒心理学入门，适合改善内耗与人际', split: ['第一夜：目的论（不是过去决定你，是你赋予意义）', '第二夜：课题分离（别人的评价是别人的课题）', '第三夜：共同体感觉（在关系中找到归属）', '落地带：写一件「今天可以课题分离的事」'], takeaway: '自由就是被别人讨厌，不等于惹人讨厌。' },
  { title: '《穷查理宝典》', author: '查理·芒格', why: '多元思维模型，提升决策与写作逻辑', split: ['多元格栅模型', '逆向思考：反过来想', '能力圈原则', '落地带：列出你的 3 个能力圈'], takeaway: '宏观是我们必须接受的，微观才是我们能有所作为的。' },
  { title: '《活着》', author: '余华', why: '极简叙事范本，学「用细节代替煽情」', split: ['开场：福贵自述视角', '结构：苦难的递进节奏', '留白：不写心理只写动作', '落地带：仿写一段「只写动作不写情绪」'], takeaway: '写作共鸣来自具体动作，而非形容词堆砌。' },
  { title: '《卡片笔记写作法》', author: '申克·阿伦斯', why: '建立个人知识库，写作不再从零开始', split: [' fleeting→literature→permanent 三层笔记', '每条 note 只写一个想法', '用链接代替分类', '落地带：今天写 3 张永久卡片'], takeaway: '写得多不如连得巧，让笔记自己生长。' },
  { title: '《认知觉醒》', author: '周岭', why: '元认知与习惯养成，适配你的每日计划', split: ['元认知：跳出自己看自己', '舒适区边缘：最近发展区练习', '早冥读写跑', '落地带：设定一个微习惯'], takeaway: '成长权重比：改变量 > 行动量 > 思考量 > 学习量。' },
  { title: '《故事》', author: '罗伯特·麦基', why: '编剧圣经，直接服务小说/视频叙事', split: ['结构：激励事件→进展→危机→高潮', '人物：欲望+恐惧驱动', '鸿沟：预期与结果之间的差距制造张力', '落地带：给你主角写一个「激励事件」'], takeaway: '故事讲的不是堆事，而是价值在压力下的转折。' },
  { title: '《原子习惯》', author: '詹姆斯·克利尔', why: '把大目标拆成每天 1% 的系统', split: ['身份驱动：先成为再做', '两分钟法则：起步极小', '环境设计：让好习惯显眼', '落地带：写一个「我是__的人」'], takeaway: '你不是靠目标成功，而是靠系统。' },
  { title: '《纳瓦尔宝典》', author: '埃里克·乔根森', why: '财富与幸福的底层逻辑，适配副业/创作', split: ['杠杆：代码与媒体边际成本为 0', '专精度：做到前 1%', '复利：声誉与关系', '落地带：列出你的 3 个独特优势'], takeaway: '用专精度 × 杠杆 × 复利，撬动长期价值。' },
  { title: '《风格的练习》', author: '余光中/写作类', why: '学同一题材多种写法，直接提升文笔', split: ['同一句换 5 种句式', '长短句节奏控制', '具象代替抽象', '落地带：改写一段自己的旧文'], takeaway: '风格是反复锤炼出来的，不是天生的。' },
  { title: '《非暴力沟通》', author: '马歇尔·卢森堡', why: '改善人际与表达，服务角色/文案共情', split: ['观察≠评价', '表达感受而非想法', '说出需要', '落地带：写一句今天想说却没说出口的话'], takeaway: '先连接需要，再谈解决。' }
];
function renderBookLearn() {
  const el = document.getElementById('bookLearnBox'); if (!el) return;
  el.innerHTML = `<p class="text-sm text-muted mb-2">有价值书籍推荐 + 拆分学习（构建时整理 2026 书单，可逐章打卡）。</p>
    ${bookLearn.map((b, i) => {
      const prog = store.get('luo_booklearn_' + i, []);
      return `<div class="card">
        <div class="flex-between"><div class="font-bold">📚 ${esc(b.title)}</div><span class="text-muted" style="font-size:12px">${esc(b.author)}</span></div>
        <div class="text-sm text-blue mt-1">为什么读：${esc(b.why)}</div>
        <div class="text-sm mt-1"><b>拆分学习：</b></div>
        <div class="text-sm">${b.split.map((s, si) => `<label class="learn-item"><input type="checkbox" ${prog.includes(si) ? 'checked' : ''} onchange="toggleLearn(${i},${si})"> ${esc(s)}</label>`).join('')}</div>
        <div class="text-sm text-green mt-1">💡 金句：${esc(b.takeaway)}</div>
        ${gstar('bl-' + i, '好书', b.title, b.takeaway)}
      </div>`;
    }).join('')}`;
}
function toggleLearn(i, si) {
  const prog = store.get('luo_booklearn_' + i, []);
  const k = prog.indexOf(si);
  if (k >= 0) prog.splice(k, 1); else prog.push(si);
  store.set('luo_booklearn_' + i, prog);
  addPoints(k >= 0 ? -1 : 1, true);
  renderBookLearn();
}

/* ===================================================================
   初始化扩展（expansion.js 在 app.js 之后加载，此处自动触发）
   =================================================================== */
function initExpansion() {
  // 给 kitchen 页的时令模块注入实时数据
  fillKitchenSeason();
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initExpansion);
else initExpansion();
