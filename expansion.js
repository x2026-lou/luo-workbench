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
   ② 单词背诵（四六级 / 考频 / 分组 / 随堂测试 / 语法 / 口语）
   =================================================================== */
const cetWords = [
  { w: 'abandon', ph: '/əˈbændən/', pos: 'v.', cn: '抛弃；放弃', freq: '高', ex: 'He abandoned his car in the snow.' },
  { w: 'accelerate', ph: '/əkˈseləreɪt/', pos: 'v.', cn: '加速；加快', freq: '中', ex: 'The car accelerated to overtake.' },
  { w: 'accomplish', ph: '/əˈkʌmplɪʃ/', pos: 'v.', cn: '完成；实现', freq: '高', ex: 'We accomplished the task on time.' },
  { w: 'accurate', ph: '/ˈækjərət/', pos: 'adj.', cn: '准确的；精确的', freq: '高', ex: 'The data is accurate.' },
  { w: 'adequate', ph: '/ˈædɪkwət/', pos: 'adj.', cn: '足够的；适当的', freq: '中', ex: 'We have adequate food.' },
  { w: 'ambiguous', ph: '/æmˈbɪɡjuəs/', pos: 'adj.', cn: '模棱两可的', freq: '低', ex: 'His answer was ambiguous.' },
  { w: 'anticipate', ph: '/ænˈtɪsɪpeɪt/', pos: 'v.', cn: '预期；预料', freq: '中', ex: 'We anticipate a rise in price.' },
  { w: 'apparent', ph: '/əˈpærənt/', pos: 'adj.', cn: '明显的；表面的', freq: '高', ex: 'It was apparent to all.' },
  { w: 'appreciate', ph: '/əˈpriːʃieɪt/', pos: 'v.', cn: '欣赏；感激；增值', freq: '高', ex: 'I appreciate your help.' },
  { w: 'appropriate', ph: '/əˈprəʊpriət/', pos: 'adj.', cn: '合适的', freq: '中', ex: 'Wear appropriate clothes.' },
  { w: 'benefit', ph: '/ˈbenɪfɪt/', pos: 'n./v.', cn: '益处；受益', freq: '高', ex: 'It benefits your health.' },
  { w: 'brilliant', ph: '/ˈbrɪljənt/', pos: 'adj.', cn: '杰出的；明亮的', freq: '中', ex: 'A brilliant idea!' },
  { w: 'circumstance', ph: '/ˈsɜːkəmstəns/', pos: 'n.', cn: '情况；环境', freq: '中', ex: 'Under no circumstance.' },
  { w: 'comprehensive', ph: '/ˌkɒmprɪˈhensɪv/', pos: 'adj.', cn: '全面的；综合的', freq: '中', ex: 'A comprehensive plan.' },
  { w: 'compromise', ph: '/ˈkɒmprəmaɪz/', pos: 'n./v.', cn: '妥协；折中', freq: '低', ex: 'Reach a compromise.' },
  { w: 'consequence', ph: '/ˈkɒnsɪkwəns/', pos: 'n.', cn: '结果；后果', freq: '高', ex: 'Face the consequence.' },
  { w: 'considerable', ph: '/kənˈsɪdərəbl/', pos: 'adj.', cn: '相当大的', freq: '中', ex: 'Considerable progress.' },
  { w: 'consistent', ph: '/kənˈsɪstənt/', pos: 'adj.', cn: '一致的；持续的', freq: '中', ex: 'Be consistent in study.' },
  { w: 'contemporary', ph: '/kənˈtemprəri/', pos: 'adj.', cn: '当代的；同时代的', freq: '低', ex: 'Contemporary art.' },
  { w: 'contribute', ph: '/kənˈtrɪbjuːt/', pos: 'v.', cn: '贡献；促成', freq: '高', ex: 'Contribute to society.' },
  { w: 'controversial', ph: '/ˌkɒntrəˈvɜːʃl/', pos: 'adj.', cn: '有争议的', freq: '中', ex: 'A controversial topic.' },
  { w: 'crucial', ph: '/ˈkruːʃl/', pos: 'adj.', cn: '关键的；至关重要的', freq: '高', ex: 'A crucial moment.' },
  { w: 'deliberate', ph: '/dɪˈlɪbərət/', pos: 'adj.', cn: '故意的；深思熟虑的', freq: '低', ex: 'A deliberate mistake.' },
  { w: 'demonstrate', ph: '/ˈdemənstreɪt/', pos: 'v.', cn: '证明；演示', freq: '高', ex: 'Demonstrate the method.' },
  { w: 'distinguish', ph: '/dɪˈstɪŋɡwɪʃ/', pos: 'v.', cn: '区分；辨别', freq: '中', ex: 'Distinguish right from wrong.' },
  { w: 'dominant', ph: '/ˈdɒmɪnənt/', pos: 'adj.', cn: '占主导的；统治的', freq: '中', ex: 'The dominant culture.' },
  { w: 'elaborate', ph: '/ɪˈlæbərət/', pos: 'adj./v.', cn: '精心制作的；详述', freq: '低', ex: 'An elaborate plan.' },
  { w: 'embarrass', ph: '/ɪmˈbærəs/', pos: 'v.', cn: '使尴尬', freq: '中', ex: 'Don\'t embarrass him.' },
  { w: 'emphasis', ph: '/ˈemfəsɪs/', pos: 'n.', cn: '强调；重点', freq: '高', ex: 'Put emphasis on reading.' },
  { w: 'enhance', ph: '/ɪnˈhɑːns/', pos: 'v.', cn: '提高；增强', freq: '高', ex: 'Enhance your skills.' },
  { w: 'enormous', ph: '/ɪˈnɔːməs/', pos: 'adj.', cn: '巨大的', freq: '高', ex: 'An enormous building.' },
  { w: 'essential', ph: '/ɪˈsenʃl/', pos: 'adj.', cn: '必要的；本质的', freq: '高', ex: 'Water is essential.' },
  { w: 'evaluate', ph: '/ɪˈvæljueɪt/', pos: 'v.', cn: '评价；评估', freq: '高', ex: 'Evaluate the result.' },
  { w: 'evident', ph: '/ˈevɪdənt/', pos: 'adj.', cn: '明显的', freq: '中', ex: 'It is evident that...' },
  { w: 'exaggerate', ph: '/ɪɡˈzædʒəreɪt/', pos: 'v.', cn: '夸大', freq: '低', ex: 'Don\'t exaggerate.' },
  { w: 'fascinate', ph: '/ˈfæsɪneɪt/', pos: 'v.', cn: '使着迷', freq: '中', ex: 'The story fascinates me.' },
  { w: 'feasible', ph: '/ˈfiːzəbl/', pos: 'adj.', cn: '可行的', freq: '中', ex: 'A feasible plan.' },
  { w: 'fluctuate', ph: '/ˈflʌktʃueɪt/', pos: 'v.', cn: '波动', freq: '低', ex: 'Prices fluctuate.' },
  { w: 'fundamental', ph: '/ˌfʌndəˈmentl/', pos: 'adj.', cn: '基本的；根本的', freq: '高', ex: 'Fundamental rights.' },
  { w: 'generate', ph: '/ˈdʒenəreɪt/', pos: 'v.', cn: '产生；生成', freq: '高', ex: 'Generate ideas.' },
  { w: 'guarantee', ph: '/ˌɡærənˈtiː/', pos: 'v./n.', cn: '保证；担保', freq: '高', ex: 'We guarantee quality.' },
  { w: 'humble', ph: '/ˈhʌmbl/', pos: 'adj.', cn: '谦逊的；卑微的', freq: '中', ex: 'A humble person.' },
  { w: 'illusion', ph: '/ɪˈluːʒn/', pos: 'n.', cn: '幻觉；错觉', freq: '低', ex: 'An optical illusion.' },
  { w: 'inevitable', ph: '/ɪnˈevɪtəbl/', pos: 'adj.', cn: '不可避免的', freq: '中', ex: 'An inevitable result.' },
  { w: 'influence', ph: '/ˈɪnfluəns/', pos: 'n./v.', cn: '影响', freq: '高', ex: 'Have an influence on.' },
  { w: 'inevitable', ph: '/ɪnˈevɪtəbl/', pos: 'adj.', cn: '不可避免的', freq: '中', ex: 'Change is inevitable.' },
  { w: 'justify', ph: '/ˈdʒʌstɪfaɪ/', pos: 'v.', cn: '证明…正当', freq: '中', ex: 'How to justify it?' },
  { w: 'legitimate', ph: '/lɪˈdʒɪtɪmət/', pos: 'adj.', cn: '合法的；合理的', freq: '低', ex: 'A legitimate reason.' },
  { w: 'magnificent', ph: '/mæɡˈnɪfɪsnt/', pos: 'adj.', cn: '壮丽的', freq: '低', ex: 'A magnificent view.' },
  { w: 'maintain', ph: '/meɪnˈteɪn/', pos: 'v.', cn: '维持；保养', freq: '高', ex: 'Maintain a habit.' },
  { w: 'negligible', ph: '/ˈneɡlɪdʒəbl/', pos: 'adj.', cn: '可忽略的', freq: '低', ex: 'A negligible error.' },
  { w: 'obvious', ph: '/ˈɒbviəs/', pos: 'adj.', cn: '明显的', freq: '高', ex: 'An obvious mistake.' },
  { w: 'occupy', ph: '/ˈɒkjupaɪ/', pos: 'v.', cn: '占据；占领', freq: '中', ex: 'Occupy your mind.' },
  { w: 'overwhelming', ph: '/ˌəʊvəˈwelmɪŋ/', pos: 'adj.', cn: '压倒性的', freq: '中', ex: 'Overwhelming support.' },
  { w: 'phenomenon', ph: '/fəˈnɒmɪnən/', pos: 'n.', cn: '现象', freq: '高', ex: 'A natural phenomenon.' },
  { w: 'preserve', ph: '/prɪˈzɜːv/', pos: 'v.', cn: '保护；保存', freq: '中', ex: 'Preserve the environment.' },
  { w: 'prevail', ph: '/prɪˈveɪl/', pos: 'v.', cn: '盛行；获胜', freq: '低', ex: 'Justice will prevail.' },
  { w: 'pursue', ph: '/pəˈsjuː/', pos: 'v.', cn: '追求；从事', freq: '高', ex: 'Pursue your dream.' },
  { w: 'radical', ph: '/ˈrædɪkl/', pos: 'adj.', cn: '激进的；根本的', freq: '低', ex: 'A radical change.' },
  { w: 'reluctant', ph: '/rɪˈlʌktənt/', pos: 'adj.', cn: '不情愿的', freq: '中', ex: 'He was reluctant to go.' },
  { w: 'significant', ph: '/sɪɡˈnɪfɪkənt/', pos: 'adj.', cn: '重大的；显著的', freq: '高', ex: 'A significant difference.' },
  { w: 'sufficient', ph: '/səˈfɪʃnt/', pos: 'adj.', cn: '足够的', freq: '中', ex: 'Sufficient evidence.' },
  { w: 'superficial', ph: '/ˌsuːpəˈfɪʃl/', pos: 'adj.', cn: '表面的；肤浅的', freq: '低', ex: 'A superficial analysis.' },
  { w: 'thorough', ph: '/ˈθʌrə/', pos: 'adj.', cn: '彻底的', freq: '中', ex: 'A thorough check.' },
  { w: 'tremendous', ph: '/trəˈmendəs/', pos: 'adj.', cn: '巨大的；极好的', freq: '中', ex: 'A tremendous effort.' },
  { w: 'ultimate', ph: '/ˈʌltɪmət/', pos: 'adj.', cn: '最终的；根本的', freq: '高', ex: 'The ultimate goal.' },
  { w: 'unique', ph: '/juˈniːk/', pos: 'adj.', cn: '独特的', freq: '高', ex: 'A unique style.' },
  { w: 'vague', ph: '/veɪɡ/', pos: 'adj.', cn: '模糊的', freq: '中', ex: 'A vague answer.' },
  { w: 'valid', ph: '/ˈvælɪd/', pos: 'adj.', cn: '有效的；合理的', freq: '高', ex: 'A valid passport.' },
  { w: 'vanish', ph: '/ˈvænɪʃ/', pos: 'v.', cn: '消失', freq: '低', ex: 'The fog vanished.' },
  { w: 'vivid', ph: '/ˈvɪvɪd/', pos: 'adj.', cn: '生动的；鲜明的', freq: '中', ex: 'A vivid memory.' }
];
const VOCAB_BATCH = 10;
let vocabState = store.get('luo_vocab_state', { batch: 0, learned: [] });
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
    <div class="flex-between mb-2">
      <span class="text-sm text-muted">🔤 本组单词（点击「背完换下一批」自动轮换）</span>
      <button class="btn btn-orange" style="padding:6px 10px;font-size:12px" onclick="completeVocabBatch()">背完换下一批 →</button>
    </div>
    <div class="word-list">
      ${words.map((w, i) => {
        const idx = vocabState.batch * VOCAB_BATCH + i;
        const done = vocabState.learned.includes(idx);
        return `<div class="word-card ${done ? 'done' : ''}" onclick="toggleWordLearned(${idx})">
          <div class="word-head"><span class="word-w">${w.w}</span><span class="tier-${w.freq === '高' ? 'S' : w.freq === '中' ? 'A' : 'B'}">${w.freq}频</span></div>
          <div class="word-ph">${w.ph} <span class="text-muted">${w.pos}</span></div>
          <div class="word-cn">${w.cn}</div>
          <div class="word-ex">📌 ${w.ex}</div>
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
  totalPoints += 5; store.set('luo_total_points', totalPoints);
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
  { type: '常识·法律', q: '我国民法典规定普通诉讼时效一般为？', opts: ['1 年', '2 年', '3 年', '5 年'], ans: 2, exp: '《民法典》规定普通诉讼时效为 3 年。' }
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
  { cat: '共鸣', title: '人物对话即性格', body: '让对话带「潜台词」：说一半、反着说、用口头禅。对话推动关系而非交代信息。', ex: '「谁等你了。」（其实从三点等到六点）' }
];
function renderNovelCraft() {
  const el = document.getElementById('novelCraftBox'); if (!el) return;
  const cats = ['全部', '逻辑', '钩子', '文案', '节奏', '共鸣'];
  const cur = el.dataset.cat || '全部';
  const list = cur === '全部' ? novelCraft : novelCraft.filter(c => c.cat === cur);
  el.innerHTML = `
    <div class="tabs" id="ncTabs">
      ${cats.map(c => `<div class="tab ${c === cur ? 'active' : ''}" onclick="setNcCat('${c}')">${c}</div>`).join('')}
    </div>
    <div class="craft-list mt-2">
      ${list.map((c, i) => `<div class="card">
        <div class="flex-between"><div class="font-bold">${esc(c.title)}</div><span class="tier-A">${c.cat}</span></div>
        <div class="mt-1">${esc(c.body)}</div>
        <div class="text-sm text-blue mt-1">📌 示例：${esc(c.ex)}</div>
        ${gstar('craft-' + i, '创作', c.title, c.body)}
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
  { cat: '旅游', title: '小众机位打卡', scenario: '同一景点拍出大片', hook: '「本地人都不知道的机位」', shots: ['普通游客照对比', '低角度/逆光示范', '调色前后', '参数标注'], voice: '教程口播', bgm: '无词电子', caption: '#摄影技巧 #出片' }
];
function renderVideoScr() {
  const el = document.getElementById('videoScrBox'); if (!el) return;
  const cats = ['全部', 'Cos', '追星', '旅游'];
  const cur = el.dataset.cat || '全部';
  const list = cur === '全部' ? videoScripts : videoScripts.filter(v => v.cat === cur);
  el.innerHTML = `
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
        ${gstar('vscr-' + i, '脚本', v.title, v.hook)}
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
  { id: 'et_story', name: '叙事结构', cat: '结构', desc: '用「开头钩子+3个要点+金句结尾」剪 30 秒', tip: '先写脚本再剪，不沉迷素材。' }
];
function renderEditCheck() {
  const el = document.getElementById('editCheckBox'); if (!el) return;
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
  totalPoints += 10; store.set('luo_total_points', totalPoints);
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
  { kw: '护腕 健身 举重', cat: '运动', note: '护具' }
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
  toast('已记录好物');
  renderGoods();
}
function delGood(i) { const m = store.get('luo_goods', []); m.splice(i, 1); store.set('luo_goods', m); renderGoods(); }

/* ===================================================================
   奖励机制 · 跨模块客观评价 · 改善建议
   =================================================================== */
function getCount(key) { const v = store.get(key, []); return Array.isArray(v) ? v.length : 0; }
function countNotes() {
  const ids = ['daily', 'review', 'english', 'exam', 'medical', 'inspiration', 'viral', 'edit', 'recruit', 'fitness', 'finance', 'novel', 'image', 'books', 'drawing', 'guitar', 'kitchen', 'media', 'travel', 'office', 'eq', 'ai', 'jjwxc', 'meme', 'mine', 'genius', 'material', 'vocab', 'novelcraft', 'videoscr', 'editcheck', 'goods', 'rewards', 'accounting', 'film', 'dailyreview', 'seasonaldish', 'booklearn'];
  return ids.reduce((s, id) => s + getCount('luo_notes_' + id), 0);
}
function renderRewards() {
  const el = document.getElementById('rewardsBox'); if (!el) return;
  const pts = totalPoints;
  const lv = levelFor(pts);
  const streak = store.get('luo_streak', { count: 0, last: '' });
  const vocabLearned = (store.get('luo_vocab_state', { learned: [] }).learned || []).length;
  const editStreak = store.get('luo_edit_streak', 0);
  const gold = getGolden().length;
  const badges = [
    { n: '🌱 启程', c: pts >= 80 }, { n: '🔥 连续7天', c: streak.count >= 7 },
    { n: '📝 复盘达人', c: getCount('luo_dailyreview') >= 5 }, { n: '🧾 记账达人', c: getCount('luo_accounting') >= 10 },
    { n: '📑 书摘收藏', c: getCount('luo_booknotes') >= 5 }, { n: '🔤 单词进阶', c: vocabLearned >= 30 },
    { n: '✂️ 剪辑打卡', c: editStreak >= 5 }, { n: '⭐ 收藏家', c: gold >= 20 },
    { n: '🎬 创作素材', c: gold >= 10 }
  ];
  const owned = badges.filter(b => b.c).length;
  const stats = [
    ['积分', pts], ['等级', lv.title], ['连续完成任务', streak.count + ' 天'],
    ['累计笔记', countNotes() + ' 条'], ['每日复盘', getCount('luo_dailyreview')],
    ['书摘', getCount('luo_booknotes')], ['拉片', getCount('luo_films')],
    ['电子菜谱', getCount('luo_recipes')], ['旅行攻略', getCount('luo_travel_guides')],
    ['好物', getCount('luo_goods')], ['记账', getCount('luo_accounting') + ' 条'],
    ['已背单词', vocabLearned], ['收藏', gold]
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
  if (streak.count === 0 && pts < 80) evalText = '你还在起步阶段，建议先固定「每日必打卡」习惯，积满 80 分即可解锁第一个等级。';
  else if (empty.length >= 4) evalText = '主线任务在推进，但记录型模块（' + empty.join('、') + '）还是空白。建议每天挑 1 个顺手记一条，积累长期复利。';
  else if (empty.length > 0) evalText = '整体不错！还有「' + empty.join('、') + '」可以开始经营，它们是复盘与创作素材的宝库。';
  else evalText = '全模块都在运转，执行力很强。建议每周做一次跨模块复盘，把书摘/拉片/笔记串成自己的方法论。';
  let suggest = '';
  if (!mustDone) suggest = '<br><b>💡 改善建议：</b>今日「每日必打卡」尚未全部完成，先补齐运动/英语/乐器等基础项，连续天数才会计入奖励。';
  else if (empty.length) suggest = '<br><b>💡 改善建议：</b>从空白模块里选一个最低门槛的开始（如记账每天 1 笔、复盘每天 3 行），比一次性全开更可持续。';
  else suggest = '<br><b>🎁 奖励建议：</b>各模块均衡，可给自己设一个阶段奖励（如完成连续 7 天即兑换喜欢的小物）。';

  el.innerHTML = `
    <div class="reward-hero">
      <div class="reward-lv">Lv${lv.lv} · ${lv.title}</div>
      <div class="reward-pts">${pts} 积分</div>
      <div class="reward-streak">🔥 连续完成任务 ${streak.count} 天</div>
    </div>
    <div class="card mt-3">
      <div class="font-bold mb-2">🏅 徽章（${owned}/${badges.length}）</div>
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
  totalPoints += 30; store.set('luo_total_points', totalPoints);
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
  toast('复盘已保存'); renderDailyReview();
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
  store.set('luo_booknotes', list); toast('书摘已保存'); renderBookNotes();
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
  store.set('luo_films', list); toast('拉片已保存'); renderFilm();
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
  store.set('luo_accounting', list); toast('已记账'); renderAccounting();
}
function delAccounting(i) { const l = store.get('luo_accounting', []); l.splice(i, 1); store.set('luo_accounting', l); renderAccounting(); }

/* ===================================================================
   时令菜品（按当前季节 + 物价 + 备菜流程）
   =================================================================== */
const seasonalDishes = {
  '夏': [
    { name: '蒜蓉拍黄瓜', price: '黄瓜约 2-3 元/根', prep: '1. 黄瓜拍裂切段；2. 蒜末+生抽+醋+少许糖；3. 冷藏 10 分钟更爽口。', tip: '末伏清热解腻，5 分钟搞定。' },
    { name: '清炒空心菜', price: '空心菜约 3-4 元/把', prep: '1. 梗叶分开；2. 热油蒜末爆香先下梗；3. 再下叶大火 30 秒。', tip: '火大速度快，避免出水变黑。' },
    { name: '苦瓜炒蛋', price: '苦瓜约 3 元 + 蛋 2 元', prep: '1. 苦瓜薄片盐腌去苦；2. 蛋液炒散盛出；3. 合炒调味。', tip: '盐腌后挤水，苦味大减。' },
    { name: '丝瓜虾仁汤', price: '丝瓜约 3 元 + 虾仁 8-12 元', prep: '1. 丝瓜滚刀块；2. 少油煸软；3. 加水煮开下虾仁。', tip: '夏季补蛋白又清淡。' },
    { name: '冬瓜排骨汤', price: '冬瓜约 2 元 + 排骨 15 元', prep: '1. 排骨焯水；2. 冬瓜块同炖 40 分钟；3. 少盐。', tip: '末伏「冬瓜清热」经典，可加薏米。' },
    { name: '凉拌豇豆', price: '豇豆约 4 元', prep: '1. 整根焯熟切段；2. 蒜泥+辣油+生抽；3. 拌匀。', tip: '务必煮熟，生豇豆有毒。' }
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
  { title: '《故事》', author: '罗伯特·麦基', why: '编剧圣经，直接服务小说/视频叙事', split: ['结构：激励事件→进展→危机→高潮', '人物：欲望+恐惧驱动', '鸿沟：预期与结果之间的差距制造张力', '落地带：给你主角写一个「激励事件」'], takeaway: '故事讲的不是堆事，而是价值在压力下的转折。' }
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
