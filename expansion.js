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
const cetWords = [
  { w: 'abandon', ph: '/əˈbændən/', pos: 'v.', cn: '抛弃；放弃', freq: '高', ex: 'He abandoned his car in the snow.' },
  { w: 'ability', ph: '/əˈbɪləti/', pos: 'n.', cn: '能力；才能', freq: '高', ex: 'She has the ability to lead.' },
  { w: 'absence', ph: '/ˈæbsəns/', pos: 'n.', cn: '缺席；缺乏', freq: '中', ex: 'His absence was noticed.' },
  { w: 'absorb', ph: '/əbˈzɔːb/', pos: 'v.', cn: '吸收；吸引', freq: '中', ex: 'Plants absorb water.' },
  { w: 'abstract', ph: '/ˈæbstrækt/', pos: 'adj.', cn: '抽象的', freq: '低', ex: 'An abstract concept.' },
  { w: 'academic', ph: '/ˌækəˈdemɪk/', pos: 'adj.', cn: '学术的', freq: '高', ex: 'Academic performance matters.' },
  { w: 'accept', ph: '/əkˈsept/', pos: 'v.', cn: '接受；同意', freq: '高', ex: 'Accept the invitation.' },
  { w: 'access', ph: '/ˈækses/', pos: 'n./v.', cn: '通道；接近', freq: '高', ex: 'Access to information.' },
  { w: 'accident', ph: '/ˈæksɪdənt/', pos: 'n.', cn: '事故；意外', freq: '中', ex: 'A traffic accident.' },
  { w: 'accompany', ph: '/əˈkʌmpəni/', pos: 'v.', cn: '陪伴；伴随', freq: '中', ex: 'She accompanied me home.' },
  { w: 'accomplish', ph: '/əˈkʌmplɪʃ/', pos: 'v.', cn: '完成；实现', freq: '高', ex: 'We accomplished the task.' },
  { w: 'account', ph: '/əˈkaʊnt/', pos: 'n.', cn: '账户；描述', freq: '高', ex: 'Open a bank account.' },
  { w: 'accurate', ph: '/ˈækjərət/', pos: 'adj.', cn: '准确的', freq: '高', ex: 'Accurate data.' },
  { w: 'achieve', ph: '/əˈtʃiːv/', pos: 'v.', cn: '实现；达到', freq: '高', ex: 'Achieve your goal.' },
  { w: 'acquire', ph: '/əˈkwaɪə/', pos: 'v.', cn: '获得；习得', freq: '高', ex: 'Acquire new skills.' },
  { w: 'active', ph: '/ˈæktɪv/', pos: 'adj.', cn: '积极的；活跃的', freq: '高', ex: 'Stay active.' },
  { w: 'adapt', ph: '/əˈdæpt/', pos: 'v.', cn: '适应；改编', freq: '高', ex: 'Adapt to change.' },
  { w: 'adequate', ph: '/ˈædɪkwət/', pos: 'adj.', cn: '足够的', freq: '中', ex: 'Adequate food.' },
  { w: 'adjust', ph: '/əˈdʒʌst/', pos: 'v.', cn: '调整；适应', freq: '中', ex: 'Adjust your plan.' },
  { w: 'advance', ph: '/ədˈvɑːns/', pos: 'v./n.', cn: '推进；进步', freq: '高', ex: 'Advance technology.' },
  { w: 'advantage', ph: '/ədˈvɑːntɪdʒ/', pos: 'n.', cn: '优势', freq: '高', ex: 'Take advantage of it.' },
  { w: 'advise', ph: '/ədˈvaɪz/', pos: 'v.', cn: '建议', freq: '高', ex: 'Advise me on this.' },
  { w: 'afford', ph: '/əˈfɔːd/', pos: 'v.', cn: '负担得起', freq: '高', ex: 'Can you afford it?' },
  { w: 'aggressive', ph: '/əˈɡresɪv/', pos: 'adj.', cn: '好斗的；激进的', freq: '中', ex: 'An aggressive policy.' },
  { w: 'aid', ph: '/eɪd/', pos: 'n./v.', cn: '援助；帮助', freq: '中', ex: 'First aid.' },
  { w: 'allow', ph: '/əˈlaʊ/', pos: 'v.', cn: '允许', freq: '高', ex: 'Allow me to explain.' },
  { w: 'ambition', ph: '/æmˈbɪʃn/', pos: 'n.', cn: '野心；抱负', freq: '中', ex: 'His ambition is clear.' },
  { w: 'ancient', ph: '/ˈeɪnʃənt/', pos: 'adj.', cn: '古老的', freq: '中', ex: 'Ancient history.' },
  { w: 'announce', ph: '/əˈnaʊns/', pos: 'v.', cn: '宣布', freq: '中', ex: 'Announce the result.' },
  { w: 'anxiety', ph: '/æŋˈzaɪəti/', pos: 'n.', cn: '焦虑；忧虑', freq: '中', ex: 'Exam anxiety.' },
  { w: 'apparent', ph: '/əˈpærənt/', pos: 'adj.', cn: '明显的', freq: '高', ex: 'It was apparent.' },
  { w: 'appetite', ph: '/ˈæpɪtaɪt/', pos: 'n.', cn: '胃口；欲望', freq: '低', ex: 'A good appetite.' },
  { w: 'appreciate', ph: '/əˈpriːʃieɪt/', pos: 'v.', cn: '欣赏；感激', freq: '高', ex: 'I appreciate your help.' },
  { w: 'appropriate', ph: '/əˈprəʊpriət/', pos: 'adj.', cn: '合适的', freq: '中', ex: 'Appropriate clothes.' },
  { w: 'approve', ph: '/əˈpruːv/', pos: 'v.', cn: '批准；赞成', freq: '中', ex: 'Approve the plan.' },
  { w: 'argue', ph: '/ˈɑːɡjuː/', pos: 'v.', cn: '争论；主张', freq: '高', ex: 'They argue a lot.' },
  { w: 'arise', ph: '/əˈraɪz/', pos: 'v.', cn: '出现；升起', freq: '高', ex: 'Problems arise.' },
  { w: 'aspect', ph: '/ˈæspekt/', pos: 'n.', cn: '方面', freq: '高', ex: 'Every aspect.' },
  { w: 'assess', ph: '/əˈses/', pos: 'v.', cn: '评估', freq: '中', ex: 'Assess the risk.' },
  { w: 'assist', ph: '/əˈsɪst/', pos: 'v.', cn: '协助', freq: '中', ex: 'Assist the teacher.' },
  { w: 'assume', ph: '/əˈsjuːm/', pos: 'v.', cn: '假定；承担', freq: '高', ex: 'Assume responsibility.' },
  { w: 'assure', ph: '/əˈʃʊə/', pos: 'v.', cn: '使确信', freq: '中', ex: 'Assure him it\'s fine.' },
  { w: 'attach', ph: '/əˈtætʃ/', pos: 'v.', cn: '系；附上', freq: '中', ex: 'Attach the file.' },
  { w: 'attack', ph: '/əˈtæk/', pos: 'v./n.', cn: '攻击', freq: '中', ex: 'Under attack.' },
  { w: 'attain', ph: '/əˈteɪn/', pos: 'v.', cn: '达到；获得', freq: '中', ex: 'Attain success.' },
  { w: 'attitude', ph: '/ˈætɪtjuːd/', pos: 'n.', cn: '态度', freq: '高', ex: 'Positive attitude.' },
  { w: 'attract', ph: '/əˈtrækt/', pos: 'v.', cn: '吸引', freq: '高', ex: 'Attract attention.' },
  { w: 'audience', ph: '/ˈɔːdiəns/', pos: 'n.', cn: '观众；听众', freq: '中', ex: 'A large audience.' },
  { w: 'authority', ph: '/ɔːˈθɒrəti/', pos: 'n.', cn: '权威；当局', freq: '中', ex: 'Local authority.' },
  { w: 'automatic', ph: '/ˌɔːtəˈmætɪk/', pos: 'adj.', cn: '自动的', freq: '中', ex: 'Automatic door.' },
  { w: 'available', ph: '/əˈveɪləbl/', pos: 'adj.', cn: '可用的；有空的', freq: '高', ex: 'Available now.' },
  { w: 'average', ph: '/ˈævərɪdʒ/', pos: 'adj./n.', cn: '平均的', freq: '高', ex: 'Average score.' },
  { w: 'avoid', ph: '/əˈvɔɪd/', pos: 'v.', cn: '避免', freq: '高', ex: 'Avoid mistakes.' },
  { w: 'award', ph: '/əˈwɔːd/', pos: 'n./v.', cn: '奖；授予', freq: '中', ex: 'Win an award.' },
  { w: 'aware', ph: '/əˈweə/', pos: 'adj.', cn: '意识到的', freq: '高', ex: 'Be aware of risk.' },
  { w: 'benefit', ph: '/ˈbenɪfɪt/', pos: 'n./v.', cn: '益处；受益', freq: '高', ex: 'Benefit your health.' },
  { w: 'blame', ph: '/bleɪm/', pos: 'v./n.', cn: '责备', freq: '中', ex: 'Don\'t blame him.' },
  { w: 'board', ph: '/bɔːd/', pos: 'n.', cn: '板；董事会', freq: '中', ex: 'On board.' },
  { w: 'boost', ph: '/buːst/', pos: 'v./n.', cn: '提升；推动', freq: '中', ex: 'Boost confidence.' },
  { w: 'brief', ph: '/briːf/', pos: 'adj.', cn: '简短的', freq: '中', ex: 'A brief note.' },
  { w: 'broad', ph: '/brɔːd/', pos: 'adj.', cn: '宽阔的', freq: '中', ex: 'Broad mind.' },
  { w: 'calculate', ph: '/ˈkælkjuleɪt/', pos: 'v.', cn: '计算', freq: '中', ex: 'Calculate the cost.' },
  { w: 'campaign', ph: '/kæmˈpeɪn/', pos: 'n.', cn: '运动；战役', freq: '中', ex: 'An ad campaign.' },
  { w: 'cancel', ph: '/ˈkænsl/', pos: 'v.', cn: '取消', freq: '中', ex: 'Cancel the order.' },
  { w: 'candidate', ph: '/ˈkændɪdət/', pos: 'n.', cn: '候选人', freq: '中', ex: 'A presidential candidate.' },
  { w: 'capture', ph: '/ˈkæptʃə/', pos: 'v.', cn: '捕获；捕捉', freq: '中', ex: 'Capture the moment.' },
  { w: 'career', ph: '/kəˈrɪə/', pos: 'n.', cn: '职业；生涯', freq: '高', ex: 'A medical career.' },
  { w: 'casual', ph: '/ˈkæʒuəl/', pos: 'adj.', cn: '随意的；偶然的', freq: '中', ex: 'Casual wear.' },
  { w: 'category', ph: '/ˈkætəɡəri/', pos: 'n.', cn: '类别', freq: '中', ex: 'Each category.' },
  { w: 'cease', ph: '/siːs/', pos: 'v.', cn: '停止', freq: '低', ex: 'Cease fire.' },
  { w: 'challenge', ph: '/ˈtʃælɪndʒ/', pos: 'n./v.', cn: '挑战', freq: '高', ex: 'Face the challenge.' },
  { w: 'channel', ph: '/ˈtʃænl/', pos: 'n.', cn: '频道；渠道', freq: '中', ex: 'Sales channel.' },
  { w: 'chapter', ph: '/ˈtʃæptə/', pos: 'n.', cn: '章；回', freq: '中', ex: 'Chapter one.' },
  { w: 'character', ph: '/ˈkærəktə/', pos: 'n.', cn: '性格；角色', freq: '高', ex: 'A strong character.' },
  { w: 'charge', ph: '/tʃɑːdʒ/', pos: 'n./v.', cn: '收费；负责', freq: '高', ex: 'In charge of.' },
  { w: 'circumstance', ph: '/ˈsɜːkəmstəns/', pos: 'n.', cn: '情况；环境', freq: '中', ex: 'Under no circumstance.' },
  { w: 'cite', ph: '/saɪt/', pos: 'v.', cn: '引用', freq: '中', ex: 'Cite the source.' },
  { w: 'civil', ph: '/ˈsɪvl/', pos: 'adj.', cn: '公民的；民用的', freq: '中', ex: 'Civil service.' },
  { w: 'clarify', ph: '/ˈklærəfaɪ/', pos: 'v.', cn: '澄清', freq: '中', ex: 'Clarify the rule.' },
  { w: 'classic', ph: '/ˈklæsɪk/', pos: 'adj./n.', cn: '经典的', freq: '中', ex: 'A classic novel.' },
  { w: 'climate', ph: '/ˈklaɪmət/', pos: 'n.', cn: '气候', freq: '中', ex: 'Climate change.' },
  { w: 'cognitive', ph: '/ˈkɒɡnətɪv/', pos: 'adj.', cn: '认知的', freq: '低', ex: 'Cognitive skill.' },
  { w: 'collapse', ph: '/kəˈlæps/', pos: 'v./n.', cn: '倒塌；崩溃', freq: '低', ex: 'The bridge collapsed.' },
  { w: 'colleague', ph: '/ˈkɒliːɡ/', pos: 'n.', cn: '同事', freq: '中', ex: 'My colleague.' },
  { w: 'combat', ph: '/ˈkɒmbæt/', pos: 'v./n.', cn: '战斗； combating', freq: '中', ex: 'Combat pollution.' },
  { w: 'comment', ph: '/ˈkɒment/', pos: 'n./v.', cn: '评论', freq: '高', ex: 'Leave a comment.' },
  { w: 'commission', ph: '/kəˈmɪʃn/', pos: 'n.', cn: '委员会；佣金', freq: '低', ex: 'A commission report.' },
  { w: 'commit', ph: '/kəˈmɪt/', pos: 'v.', cn: '犯；承诺', freq: '高', ex: 'Commit a crime.' },
  { w: 'community', ph: '/kəˈmjuːnəti/', pos: 'n.', cn: '社区；群体', freq: '高', ex: 'Local community.' },
  { w: 'compensate', ph: '/ˈkɒmpenseɪt/', pos: 'v.', cn: '补偿', freq: '低', ex: 'Compensate for loss.' },
  { w: 'compete', ph: '/kəmˈpiːt/', pos: 'v.', cn: '竞争', freq: '高', ex: 'Compete for the job.' },
  { w: 'complex', ph: '/ˈkɒmpleks/', pos: 'adj.', cn: '复杂的', freq: '高', ex: 'A complex issue.' },
  { w: 'component', ph: '/kəmˈpəʊnənt/', pos: 'n.', cn: '成分；部件', freq: '中', ex: 'Key component.' },
  { w: 'comprehensive', ph: '/ˌkɒmprɪˈhensɪv/', pos: 'adj.', cn: '全面的', freq: '中', ex: 'Comprehensive plan.' },
  { w: 'comprise', ph: '/kəmˈpraɪz/', pos: 'v.', cn: '包含；组成', freq: '中', ex: 'The team comprises 10.' },
  { w: 'concentrate', ph: '/ˈkɒnsntreɪt/', pos: 'v.', cn: '集中；专注', freq: '高', ex: 'Concentrate on study.' },
  { w: 'concept', ph: '/ˈkɒnsept/', pos: 'n.', cn: '概念', freq: '高', ex: 'A new concept.' },
  { w: 'concern', ph: '/kənˈsɜːn/', pos: 'v./n.', cn: '关心；担忧', freq: '高', ex: 'Concern for others.' },
  { w: 'conclude', ph: '/kənˈkluːd/', pos: 'v.', cn: '总结；得出结论', freq: '高', ex: 'Conclude the speech.' },
  { w: 'conduct', ph: '/kənˈdʌkt/', pos: 'v.', cn: '进行；行为', freq: '高', ex: 'Conduct research.' },
  { w: 'confidence', ph: '/ˈkɒnfɪdəns/', pos: 'n.', cn: '信心', freq: '高', ex: 'Build confidence.' },
  { w: 'confirm', ph: '/kənˈfɜːm/', pos: 'v.', cn: '确认', freq: '高', ex: 'Confirm the booking.' },
  { w: 'conflict', ph: '/ˈkɒnflɪkt/', pos: 'n./v.', cn: '冲突', freq: '中', ex: 'A civil conflict.' },
  { w: 'confront', ph: '/kənˈfrʌnt/', pos: 'v.', cn: '面对；对抗', freq: '低', ex: 'Confront the problem.' },
  { w: 'conscious', ph: '/ˈkɒnʃəs/', pos: 'adj.', cn: '有意识的', freq: '中', ex: 'Conscious decision.' },
  { w: 'consequence', ph: '/ˈkɒnsɪkwəns/', pos: 'n.', cn: '结果；后果', freq: '高', ex: 'Face the consequence.' },
  { w: 'conserve', ph: '/kənˈsɜːv/', pos: 'v.', cn: '保护；节约', freq: '中', ex: 'Conserve energy.' },
  { w: 'considerable', ph: '/kənˈsɪdərəbl/', pos: 'adj.', cn: '相当大的', freq: '中', ex: 'Considerable progress.' },
  { w: 'consist', ph: '/kənˈsɪst/', pos: 'v.', cn: '由…组成', freq: '高', ex: 'Consist of three parts.' },
  { w: 'constant', ph: '/ˈkɒnstənt/', pos: 'adj.', cn: '持续的；恒定的', freq: '中', ex: 'Constant change.' },
  { w: 'constitute', ph: '/ˈkɒnstɪtjuːt/', pos: 'v.', cn: '构成；组成', freq: '低', ex: 'Constitute a risk.' },
  { w: 'consult', ph: '/kənˈsʌlt/', pos: 'v.', cn: '咨询；查阅', freq: '中', ex: 'Consult a doctor.' },
  { w: 'consume', ph: '/kənˈsjuːm/', pos: 'v.', cn: '消耗；消费', freq: '中', ex: 'Consume less.' },
  { w: 'contact', ph: '/ˈkɒntækt/', pos: 'n./v.', cn: '联系', freq: '高', ex: 'Keep in contact.' },
  { w: 'contain', ph: '/kənˈteɪn/', pos: 'v.', cn: '包含；容纳', freq: '高', ex: 'The box contains books.' },
  { w: 'contemporary', ph: '/kənˈtemprəri/', pos: 'adj.', cn: '当代的', freq: '低', ex: 'Contemporary art.' },
  { w: 'content', ph: '/ˈkɒntent/', pos: 'n./adj.', cn: '内容；满足的', freq: '高', ex: 'Table of contents.' },
  { w: 'contest', ph: '/ˈkɒntest/', pos: 'n.', cn: '竞赛', freq: '中', ex: 'A singing contest.' },
  { w: 'context', ph: '/ˈkɒntekst/', pos: 'n.', cn: '语境；背景', freq: '中', ex: 'In context.' },
  { w: 'contract', ph: '/ˈkɒntrækt/', pos: 'n.', cn: '合同', freq: '中', ex: 'Sign a contract.' },
  { w: 'contradict', ph: '/ˌkɒntrəˈdɪkt/', pos: 'v.', cn: '反驳；矛盾', freq: '低', ex: 'Contradict yourself.' },
  { w: 'contribute', ph: '/kənˈtrɪbjuːt/', pos: 'v.', cn: '贡献；促成', freq: '高', ex: 'Contribute to society.' },
  { w: 'controversial', ph: '/ˌkɒntrəˈvɜːʃl/', pos: 'adj.', cn: '有争议的', freq: '中', ex: 'A controversial topic.' },
  { w: 'convey', ph: '/kənˈveɪ/', pos: 'v.', cn: '传达；输送', freq: '中', ex: 'Convey a message.' },
  { w: 'convince', ph: '/kənˈvɪns/', pos: 'v.', cn: '使信服', freq: '中', ex: 'Convince the judge.' },
  { w: 'corporate', ph: '/ˈkɔːpərət/', pos: 'adj.', cn: '公司的', freq: '中', ex: 'Corporate culture.' },
  { w: 'correspond', ph: '/ˌkɒrəˈspɒnd/', pos: 'v.', cn: '对应；通信', freq: '低', ex: 'Correspond to need.' },
  { w: 'costly', ph: '/ˈkɒstli/', pos: 'adj.', cn: '昂贵的', freq: '中', ex: 'Costly mistake.' },
  { w: 'create', ph: '/kriˈeɪt/', pos: 'v.', cn: '创造', freq: '高', ex: 'Create value.' },
  { w: 'credit', ph: '/ˈkredɪt/', pos: 'n.', cn: '信用；学分', freq: '中', ex: 'Course credit.' },
  { w: 'crisis', ph: '/ˈkraɪsɪs/', pos: 'n.', cn: '危机', freq: '中', ex: 'Economic crisis.' },
  { w: 'critic', ph: '/ˈkrɪtɪk/', pos: 'n.', cn: '评论家；批评者', freq: '中', ex: 'A literary critic.' },
  { w: 'crucial', ph: '/ˈkruːʃl/', pos: 'adj.', cn: '关键的', freq: '高', ex: 'A crucial moment.' },
  { w: 'culture', ph: '/ˈkʌltʃə/', pos: 'n.', cn: '文化', freq: '高', ex: 'Campus culture.' },
  { w: 'curiosity', ph: '/ˌkjʊəriˈɒsəti/', pos: 'n.', cn: '好奇心', freq: '中', ex: 'Out of curiosity.' },
  { w: 'current', ph: '/ˈkʌrənt/', pos: 'adj.', cn: '当前的', freq: '高', ex: 'Current issue.' },
  { w: 'debate', ph: '/dɪˈbeɪt/', pos: 'n./v.', cn: '辩论', freq: '中', ex: 'A heated debate.' },
  { w: 'decade', ph: '/ˈdekeɪd/', pos: 'n.', cn: '十年', freq: '中', ex: 'Over a decade.' },
  { w: 'decline', ph: '/dɪˈklaɪn/', pos: 'v./n.', cn: '下降；拒绝', freq: '中', ex: 'Decline the offer.' },
  { w: 'dedicate', ph: '/ˈdedɪkeɪt/', pos: 'v.', cn: '致力于', freq: '低', ex: 'Dedicate to work.' },
  { w: 'define', ph: '/dɪˈfaɪn/', pos: 'v.', cn: '定义', freq: '高', ex: 'Define the term.' },
  { w: 'deliberate', ph: '/dɪˈlɪbərət/', pos: 'adj.', cn: '故意的；深思的', freq: '低', ex: 'A deliberate act.' },
  { w: 'demonstrate', ph: '/ˈdemənstreɪt/', pos: 'v.', cn: '证明；演示', freq: '高', ex: 'Demonstrate the method.' },
  { w: 'deny', ph: '/dɪˈnaɪ/', pos: 'v.', cn: '否认；拒绝', freq: '中', ex: 'Deny the charge.' },
  { w: 'depend', ph: '/dɪˈpend/', pos: 'v.', cn: '依赖', freq: '高', ex: 'Depend on you.' },
  { w: 'depress', ph: '/dɪˈpres/', pos: 'v.', cn: '使沮丧；压低', freq: '中', ex: 'Depress the price.' },
  { w: 'derive', ph: '/dɪˈraɪv/', pos: 'v.', cn: '源于；得出', freq: '中', ex: 'Derive from Latin.' },
  { w: 'deserve', ph: '/dɪˈzɜːv/', pos: 'v.', cn: '应得', freq: '中', ex: 'Deserve praise.' },
  { w: 'design', ph: '/dɪˈzaɪn/', pos: 'v./n.', cn: '设计', freq: '高', ex: 'Design a plan.' },
  { w: 'desire', ph: '/dɪˈzaɪə/', pos: 'n./v.', cn: '渴望', freq: '中', ex: 'A strong desire.' },
  { w: 'detail', ph: '/ˈdiːteɪl/', pos: 'n.', cn: '细节', freq: '高', ex: 'Pay attention to detail.' },
  { w: 'detect', ph: '/dɪˈtekt/', pos: 'v.', cn: '察觉；探测', freq: '中', ex: 'Detect a signal.' },
  { w: 'device', ph: '/dɪˈvaɪs/', pos: 'n.', cn: '设备；装置', freq: '中', ex: 'A mobile device.' },
  { w: 'diminish', ph: '/dɪˈmɪnɪʃ/', pos: 'v.', cn: '减少；削弱', freq: '低', ex: 'Diminish risk.' },
  { w: 'disappoint', ph: '/ˌdɪsəˈpɔɪnt/', pos: 'v.', cn: '使失望', freq: '中', ex: 'Don\'t disappoint me.' },
  { w: 'discipline', ph: '/ˈdɪsəplɪn/', pos: 'n.', cn: '纪律；学科', freq: '中', ex: 'Self-discipline.' },
  { w: 'discount', ph: '/ˈdɪskaʊnt/', pos: 'n.', cn: '折扣', freq: '中', ex: 'A student discount.' },
  { w: 'discriminate', ph: '/dɪˈskrɪmɪneɪt/', pos: 'v.', cn: '歧视；区分', freq: '低', ex: 'Discriminate against.' },
  { w: 'dismiss', ph: '/dɪsˈmɪs/', pos: 'v.', cn: '解散；驳回', freq: '中', ex: 'Dismiss the idea.' },
  { w: 'display', ph: '/dɪˈspleɪ/', pos: 'v./n.', cn: '展示', freq: '中', ex: 'Display confidence.' },
  { w: 'dispose', ph: '/dɪˈspəʊz/', pos: 'v.', cn: '处理；处置', freq: '低', ex: 'Dispose of waste.' },
  { w: 'dispute', ph: '/dɪˈspjuːt/', pos: 'n./v.', cn: '争端；争论', freq: '低', ex: 'A border dispute.' },
  { w: 'distinct', ph: '/dɪˈstɪŋkt/', pos: 'adj.', cn: '明显的；不同的', freq: '中', ex: 'Distinct features.' },
  { w: 'distribute', ph: '/dɪˈstrɪbjuːt/', pos: 'v.', cn: '分配；分发', freq: '中', ex: 'Distribute leaflets.' },
  { w: 'diverse', ph: '/daɪˈvɜːs/', pos: 'adj.', cn: '多样的', freq: '中', ex: 'Diverse cultures.' },
  { w: 'document', ph: '/ˈdɒkjument/', pos: 'n.', cn: '文件；文档', freq: '中', ex: 'A legal document.' },
  { w: 'dominate', ph: '/ˈdɒmɪneɪt/', pos: 'v.', cn: '支配；主导', freq: '中', ex: 'Dominate the market.' },
  { w: 'doubt', ph: '/daʊt/', pos: 'n./v.', cn: '怀疑', freq: '高', ex: 'No doubt.' },
  { w: 'draft', ph: '/drɑːft/', pos: 'n./v.', cn: '草稿；起草', freq: '中', ex: 'A draft plan.' },
  { w: 'dramatic', ph: '/drəˈmætɪk/', pos: 'adj.', cn: '戏剧性的；显著的', freq: '中', ex: 'A dramatic change.' },
  { w: 'dynamic', ph: '/daɪˈnæmɪk/', pos: 'adj.', cn: '动态的；有活力的', freq: '低', ex: 'A dynamic team.' },
  { w: 'eager', ph: '/ˈiːɡə/', pos: 'adj.', cn: '渴望的', freq: '中', ex: 'Eager to learn.' },
  { w: 'economic', ph: '/ˌiːkəˈnɒmɪk/', pos: 'adj.', cn: '经济的', freq: '高', ex: 'Economic growth.' },
  { w: 'efficient', ph: '/ɪˈfɪʃnt/', pos: 'adj.', cn: '高效的', freq: '中', ex: 'An efficient worker.' },
  { w: 'elaborate', ph: '/ɪˈlæbərət/', pos: 'adj./v.', cn: '精心制作的；详述', freq: '低', ex: 'An elaborate plan.' },
  { w: 'element', ph: '/ˈelɪmənt/', pos: 'n.', cn: '元素；要素', freq: '中', ex: 'Key element.' },
  { w: 'eliminate', ph: '/ɪˈlɪmɪneɪt/', pos: 'v.', cn: '消除；淘汰', freq: '中', ex: 'Eliminate poverty.' },
  { w: 'embarrass', ph: '/ɪmˈbærəs/', pos: 'v.', cn: '使尴尬', freq: '中', ex: 'Don\'t embarrass him.' },
  { w: 'emerge', ph: '/ɪˈmɜːdʒ/', pos: 'v.', cn: '出现；浮现', freq: '高', ex: 'A new trend emerges.' },
  { w: 'emotion', ph: '/ɪˈməʊʃn/', pos: 'n.', cn: '情绪；情感', freq: '中', ex: 'Show emotion.' },
  { w: 'emphasize', ph: '/ˈemfəsaɪz/', pos: 'v.', cn: '强调', freq: '高', ex: 'Emphasize the point.' },
  { w: 'enable', ph: '/ɪˈneɪbl/', pos: 'v.', cn: '使能够', freq: '高', ex: 'Enable us to win.' },
  { w: 'encounter', ph: '/ɪnˈkaʊntə/', pos: 'v./n.', cn: '遭遇；遇到', freq: '中', ex: 'Encounter a problem.' },
  { w: 'enhance', ph: '/ɪnˈhɑːns/', pos: 'v.', cn: '提高；增强', freq: '高', ex: 'Enhance skills.' },
  { w: 'enormous', ph: '/ɪˈnɔːməs/', pos: 'adj.', cn: '巨大的', freq: '高', ex: 'An enormous building.' },
  { w: 'ensure', ph: '/ɪnˈʃʊə/', pos: 'v.', cn: '确保', freq: '高', ex: 'Ensure safety.' },
  { w: 'entire', ph: '/ɪnˈtaɪə/', pos: 'adj.', cn: '全部的', freq: '高', ex: 'The entire day.' },
  { w: 'environment', ph: '/ɪnˈvaɪrənmənt/', pos: 'n.', cn: '环境', freq: '高', ex: 'Protect the environment.' },
  { w: 'essential', ph: '/ɪˈsenʃl/', pos: 'adj.', cn: '必要的', freq: '高', ex: 'Water is essential.' },
  { w: 'establish', ph: '/ɪˈstæblɪʃ/', pos: 'v.', cn: '建立；确立', freq: '高', ex: 'Establish a company.' },
  { w: 'estimate', ph: '/ˈestɪmeɪt/', pos: 'v./n.', cn: '估计', freq: '中', ex: 'Estimate the cost.' },
  { w: 'ethic', ph: '/ˈeθɪk/', pos: 'n.', cn: '伦理；道德', freq: '低', ex: 'Work ethic.' },
  { w: 'evaluate', ph: '/ɪˈvæljueɪt/', pos: 'v.', cn: '评价；评估', freq: '高', ex: 'Evaluate the result.' },
  { w: 'evidence', ph: '/ˈevɪdəns/', pos: 'n.', cn: '证据', freq: '高', ex: 'Strong evidence.' },
  { w: 'evident', ph: '/ˈevɪdənt/', pos: 'adj.', cn: '明显的', freq: '中', ex: 'It is evident.' },
  { w: 'exaggerate', ph: '/ɪɡˈzædʒəreɪt/', pos: 'v.', cn: '夸大', freq: '低', ex: 'Don\'t exaggerate.' },
  { w: 'exceed', ph: '/ɪkˈsiːd/', pos: 'v.', cn: '超过', freq: '中', ex: 'Exceed the limit.' },
  { w: 'exclude', ph: '/ɪkˈskluːd/', pos: 'v.', cn: '排除；不包括', freq: '中', ex: 'Exclude the disabled.' },
  { w: 'exhibit', ph: '/ɪɡˈzɪbɪt/', pos: 'v./n.', cn: '展览；展示', freq: '中', ex: 'Exhibit talent.' },
  { w: 'expand', ph: '/ɪkˈspænd/', pos: 'v.', cn: '扩张；扩大', freq: '中', ex: 'Expand the business.' },
  { w: 'expect', ph: '/ɪkˈspekt/', pos: 'v.', cn: '期望；预料', freq: '高', ex: 'Expect the worst.' },
  { w: 'expense', ph: '/ɪkˈspens/', pos: 'n.', cn: '花费；开支', freq: '中', ex: 'At the expense of.' },
  { w: 'expertise', ph: '/ˌekspɜːˈtiːz/', pos: 'n.', cn: '专长', freq: '低', ex: 'Technical expertise.' },
  { w: 'explicit', ph: '/ɪkˈsplɪsɪt/', pos: 'adj.', cn: '明确的', freq: '低', ex: 'Explicit instruction.' },
  { w: 'exploit', ph: '/ɪkˈsplɔɪt/', pos: 'v.', cn: '开发；利用', freq: '低', ex: 'Exploit resources.' },
  { w: 'explore', ph: '/ɪkˈsplɔː/', pos: 'v.', cn: '探索', freq: '高', ex: 'Explore the city.' },
  { w: 'export', ph: '/ɪkˈspɔːt/', pos: 'v./n.', cn: '出口', freq: '中', ex: 'Export goods.' },
  { w: 'expose', ph: '/ɪkˈspəʊz/', pos: 'v.', cn: '暴露；揭露', freq: '中', ex: 'Expose the truth.' },
  { w: 'extend', ph: '/ɪkˈstend/', pos: 'v.', cn: '延伸；延长', freq: '高', ex: 'Extend the deadline.' },
  { w: 'external', ph: '/ɪkˈstɜːnl/', pos: 'adj.', cn: '外部的', freq: '中', ex: 'External pressure.' },
  { w: 'facilitate', ph: '/fəˈsɪlɪteɪt/', pos: 'v.', cn: '促进；使便利', freq: '低', ex: 'Facilitate learning.' },
  { w: 'factor', ph: '/ˈfæktə/', pos: 'n.', cn: '因素', freq: '高', ex: 'Key factor.' },
  { w: 'faint', ph: '/feɪnt/', pos: 'adj.', cn: '微弱的；模糊的', freq: '低', ex: 'A faint light.' },
  { w: 'familiar', ph: '/fəˈmɪliə/', pos: 'adj.', cn: '熟悉的', freq: '中', ex: 'Familiar with it.' },
  { w: 'feature', ph: '/ˈfiːtʃə/', pos: 'n./v.', cn: '特征；以…为特色', freq: '高', ex: 'A key feature.' },
  { w: 'federal', ph: '/ˈfedərəl/', pos: 'adj.', cn: '联邦的', freq: '中', ex: 'Federal government.' },
  { w: 'fee', ph: '/fiː/', pos: 'n.', cn: '费用', freq: '中', ex: 'Tuition fee.' },
  { w: 'financial', ph: '/faɪˈnænʃl/', pos: 'adj.', cn: '金融的；财政的', freq: '高', ex: 'Financial aid.' },
  { w: 'flexible', ph: '/ˈfleksəbl/', pos: 'adj.', cn: '灵活的', freq: '中', ex: 'A flexible schedule.' },
  { w: 'focus', ph: '/ˈfəʊkəs/', pos: 'v./n.', cn: '聚焦；集中', freq: '高', ex: 'Focus on goals.' },
  { w: 'foundation', ph: '/faʊnˈdeɪʃn/', pos: 'n.', cn: '基础；基金会', freq: '中', ex: 'Lay a foundation.' },
  { w: 'frame', ph: '/freɪm/', pos: 'n./v.', cn: '框架；制定', freq: '中', ex: 'A logical frame.' },
  { w: 'fulfill', ph: '/fʊlˈfɪl/', pos: 'v.', cn: '履行；实现', freq: '高', ex: 'Fulfill a promise.' },
  { w: 'function', ph: '/ˈfʌŋkʃn/', pos: 'n./v.', cn: '功能；运转', freq: '高', ex: 'Basic function.' },
  { w: 'fundamental', ph: '/ˌfʌndəˈmentl/', pos: 'adj.', cn: '基本的；根本的', freq: '高', ex: 'Fundamental rights.' },
  { w: 'generate', ph: '/ˈdʒenəreɪt/', pos: 'v.', cn: '产生；生成', freq: '高', ex: 'Generate ideas.' },
  { w: 'generous', ph: '/ˈdʒenərəs/', pos: 'adj.', cn: '慷慨的', freq: '中', ex: 'A generous gift.' },
  { w: 'genuine', ph: '/ˈdʒenjʊɪn/', pos: 'adj.', cn: '真正的', freq: '中', ex: 'Genuine smile.' },
  { w: 'global', ph: '/ˈɡləʊbl/', pos: 'adj.', cn: '全球的', freq: '高', ex: 'Global warming.' },
  { w: 'goal', ph: '/ɡəʊl/', pos: 'n.', cn: '目标', freq: '高', ex: 'Set a goal.' },
  { w: 'graduate', ph: '/ˈɡrædʒueɪt/', pos: 'v./n.', cn: '毕业；毕业生', freq: '高', ex: 'Graduate from college.' },
  { w: 'grant', ph: '/ɡrɑːnt/', pos: 'v./n.', cn: '授予；拨款', freq: '中', ex: 'Grant a wish.' },
  { w: 'guarantee', ph: '/ˌɡærənˈtiː/', pos: 'v./n.', cn: '保证', freq: '高', ex: 'Guarantee quality.' },
  { w: 'guilty', ph: '/ˈɡɪlti/', pos: 'adj.', cn: '有罪的；内疚的', freq: '中', ex: 'Feel guilty.' },
  { w: 'handle', ph: '/ˈhændl/', pos: 'v.', cn: '处理；应对', freq: '高', ex: 'Handle pressure.' },
  { w: 'hierarchy', ph: '/ˈhaɪərɑːki/', pos: 'n.', cn: '等级；层级', freq: '低', ex: 'A clear hierarchy.' },
  { w: 'highlight', ph: '/ˈhaɪlaɪt/', pos: 'v./n.', cn: '强调；亮点', freq: '中', ex: 'Highlight the risk.' },
  { w: 'hint', ph: '/hɪnt/', pos: 'n./v.', cn: '暗示；提示', freq: '低', ex: 'A helpful hint.' },
  { w: 'household', ph: '/ˈhaʊshəʊld/', pos: 'n./adj.', cn: '家庭；家用的', freq: '中', ex: 'Household name.' },
  { w: 'humble', ph: '/ˈhʌmbl/', pos: 'adj.', cn: '谦逊的', freq: '中', ex: 'A humble person.' },
  { w: 'identify', ph: '/aɪˈdentɪfaɪ/', pos: 'v.', cn: '识别；确认', freq: '高', ex: 'Identify the problem.' },
  { w: 'identity', ph: '/aɪˈdentəti/', pos: 'n.', cn: '身份；特性', freq: '中', ex: 'Cultural identity.' },
  { w: 'ignore', ph: '/ɪɡˈnɔː/', pos: 'v.', cn: '忽视', freq: '高', ex: 'Ignore the noise.' },
  { w: 'illustrate', ph: '/ˈɪləstreɪt/', pos: 'v.', cn: '说明；图解', freq: '中', ex: 'Illustrate the point.' },
  { w: 'image', ph: '/ˈɪmɪdʒ/', pos: 'n.', cn: '形象；图像', freq: '高', ex: 'Public image.' },
  { w: 'immigrant', ph: '/ˈɪmɪɡrənt/', pos: 'n.', cn: '移民', freq: '低', ex: 'An immigrant worker.' },
  { w: 'impact', ph: '/ˈɪmpækt/', pos: 'n./v.', cn: '影响；冲击', freq: '高', ex: 'Have an impact.' },
  { w: 'imply', ph: '/ɪmˈplaɪ/', pos: 'v.', cn: '暗示', freq: '中', ex: 'What does it imply?' },
  { w: 'impose', ph: '/ɪmˈpəʊz/', pos: 'v.', cn: '强加；征收', freq: '中', ex: 'Impose a tax.' },
  { w: 'incentive', ph: '/ɪnˈsentɪv/', pos: 'n.', cn: '激励；刺激', freq: '低', ex: 'A financial incentive.' },
  { w: 'incident', ph: '/ˈɪnsɪdənt/', pos: 'n.', cn: '事件', freq: '中', ex: 'A minor incident.' },
  { w: 'incline', ph: '/ɪnˈklaɪn/', pos: 'v.', cn: '倾向于', freq: '低', ex: 'Incline to agree.' },
  { w: 'income', ph: '/ˈɪnkʌm/', pos: 'n.', cn: '收入', freq: '高', ex: 'Monthly income.' },
  { w: 'increase', ph: '/ɪnˈkriːs/', pos: 'v./n.', cn: '增加', freq: '高', ex: 'Increase sales.' },
  { w: 'index', ph: '/ˈɪndeks/', pos: 'n.', cn: '指数；索引', freq: '低', ex: 'Price index.' },
  { w: 'indicate', ph: '/ˈɪndɪkeɪt/', pos: 'v.', cn: '表明；指示', freq: '高', ex: 'Studies indicate.' },
  { w: 'individual', ph: '/ˌɪndɪˈvɪdʒuəl/', pos: 'n./adj.', cn: '个人；个体的', freq: '高', ex: 'Individual needs.' },
  { w: 'industry', ph: '/ˈɪndəstri/', pos: 'n.', cn: '工业；行业', freq: '高', ex: 'Service industry.' },
  { w: 'inevitable', ph: '/ɪnˈevɪtəbl/', pos: 'adj.', cn: '不可避免的', freq: '中', ex: 'An inevitable result.' },
  { w: 'influence', ph: '/ˈɪnfluəns/', pos: 'n./v.', cn: '影响', freq: '高', ex: 'Have an influence.' },
  { w: 'inform', ph: '/ɪnˈfɔːm/', pos: 'v.', cn: '通知；告知', freq: '高', ex: 'Inform the public.' },
  { w: 'infrastructure', ph: '/ˈɪnfrəstrʌktʃə/', pos: 'n.', cn: '基础设施', freq: '低', ex: 'Urban infrastructure.' },
  { w: 'inherit', ph: '/ɪnˈherɪt/', pos: 'v.', cn: '继承', freq: '低', ex: 'Inherit a house.' },
  { w: 'initial', ph: '/ɪˈnɪʃl/', pos: 'adj.', cn: '最初的', freq: '中', ex: 'Initial stage.' },
  { w: 'inject', ph: '/ɪnˈdʒekt/', pos: 'v.', cn: '注射；注入', freq: '低', ex: 'Inject capital.' },
  { w: 'injure', ph: '/ˈɪndʒə/', pos: 'v.', cn: '伤害', freq: '中', ex: 'Injure a leg.' },
  { w: 'innocent', ph: '/ˈɪnəsnt/', pos: 'adj.', cn: '无辜的', freq: '中', ex: 'Innocent people.' },
  { w: 'input', ph: '/ˈɪnpʊt/', pos: 'n.', cn: '输入；投入', freq: '中', ex: 'Your input matters.' },
  { w: 'insert', ph: '/ɪnˈsɜːt/', pos: 'v.', cn: '插入', freq: '低', ex: 'Insert a coin.' },
  { w: 'insight', ph: '/ˈɪnsaɪt/', pos: 'n.', cn: '洞见；领悟', freq: '中', ex: 'Gain insight.' },
  { w: 'insist', ph: '/ɪnˈsɪst/', pos: 'v.', cn: '坚持', freq: '中', ex: 'Insist on it.' },
  { w: 'inspect', ph: '/ɪnˈspekt/', pos: 'v.', cn: '检查；视察', freq: '低', ex: 'Inspect the goods.' },
  { w: 'instant', ph: '/ˈɪnstənt/', pos: 'adj.', cn: '立即的', freq: '中', ex: 'Instant reply.' },
  { w: 'instinct', ph: '/ˈɪnstɪŋkt/', pos: 'n.', cn: '本能', freq: '中', ex: 'By instinct.' },
  { w: 'intend', ph: '/ɪnˈtend/', pos: 'v.', cn: '打算', freq: '高', ex: 'Intend to help.' },
  { w: 'intense', ph: '/ɪnˈtens/', pos: 'adj.', cn: '强烈的；剧烈的', freq: '中', ex: 'Intense heat.' },
  { w: 'interaction', ph: '/ˌɪntərˈækʃn/', pos: 'n.', cn: '互动', freq: '中', ex: 'Social interaction.' },
  { w: 'internal', ph: '/ɪnˈtɜːnl/', pos: 'adj.', cn: '内部的', freq: '中', ex: 'Internal affairs.' },
  { w: 'interpret', ph: '/ɪnˈtɜːprɪt/', pos: 'v.', cn: '解释；口译', freq: '中', ex: 'Interpret the law.' },
  { w: 'interval', ph: '/ˈɪntəvl/', pos: 'n.', cn: '间隔', freq: '低', ex: 'At intervals.' },
  { w: 'intervention', ph: '/ˌɪntəˈvenʃn/', pos: 'n.', cn: '干预', freq: '低', ex: 'Government intervention.' },
  { w: 'involve', ph: '/ɪnˈvɒlv/', pos: 'v.', cn: '涉及；使参与', freq: '高', ex: 'Involve students.' },
  { w: 'isolate', ph: '/ˈaɪsəleɪt/', pos: 'v.', cn: '隔离；孤立', freq: '低', ex: 'Isolate the patient.' },
  { w: 'issue', ph: '/ˈɪʃuː/', pos: 'n./v.', cn: '问题；发布', freq: '高', ex: 'A key issue.' },
  { w: 'justify', ph: '/ˈdʒʌstɪfaɪ/', pos: 'v.', cn: '证明…正当', freq: '中', ex: 'Justify the cost.' },
  { w: 'label', ph: '/ˈleɪbl/', pos: 'n./v.', cn: '标签；标注', freq: '中', ex: 'A price label.' },
  { w: 'labor', ph: '/ˈleɪbə/', pos: 'n.', cn: '劳动；劳动力', freq: '中', ex: 'Manual labor.' },
  { w: 'lack', ph: '/læk/', pos: 'n./v.', cn: '缺乏', freq: '高', ex: 'Lack of sleep.' },
  { w: 'landscape', ph: '/ˈlændskeɪp/', pos: 'n.', cn: '风景；景观', freq: '低', ex: 'Rural landscape.' },
  { w: 'layer', ph: '/ˈleɪə/', pos: 'n.', cn: '层', freq: '低', ex: 'A layer of snow.' },
  { w: 'legal', ph: '/ˈliːɡl/', pos: 'adj.', cn: '法律的；合法的', freq: '高', ex: 'Legal aid.' },
  { w: 'legitimate', ph: '/lɪˈdʒɪtɪmət/', pos: 'adj.', cn: '合法的；合理的', freq: '低', ex: 'A legitimate reason.' },
  { w: 'leisure', ph: '/ˈleʒə/', pos: 'n.', cn: '闲暇', freq: '中', ex: 'Leisure time.' },
  { w: 'level', ph: '/ˈlevl/', pos: 'n./adj.', cn: '水平；平的', freq: '高', ex: 'A high level.' },
  { w: 'liberal', ph: '/ˈlɪbərəl/', pos: 'adj.', cn: '自由的；开明的', freq: '低', ex: 'A liberal arts college.' },
  { w: 'license', ph: '/ˈlaɪsns/', pos: 'n.', cn: '执照；许可', freq: '中', ex: 'A driver\'s license.' },
  { w: 'link', ph: '/lɪŋk/', pos: 'n./v.', cn: '联系；连接', freq: '高', ex: 'Link theory to practice.' },
  { w: 'locate', ph: '/ləʊˈkeɪt/', pos: 'v.', cn: '位于；找出', freq: '中', ex: 'Locate the file.' },
  { w: 'logic', ph: '/ˈlɒdʒɪk/', pos: 'n.', cn: '逻辑', freq: '中', ex: 'Sound logic.' },
  { w: 'loyal', ph: '/ˈlɔɪəl/', pos: 'adj.', cn: '忠诚的', freq: '中', ex: 'A loyal friend.' },
  { w: 'maintain', ph: '/meɪnˈteɪn/', pos: 'v.', cn: '维持；保养', freq: '高', ex: 'Maintain a habit.' },
  { w: 'major', ph: '/ˈmeɪdʒə/', pos: 'adj./n.', cn: '主要的；专业', freq: '高', ex: 'A major issue.' },
  { w: 'manifest', ph: '/ˈmænɪfest/', pos: 'v./adj.', cn: '显示；明显的', freq: '低', ex: 'Manifest in behavior.' },
  { w: 'manipulate', ph: '/məˈnɪpjuleɪt/', pos: 'v.', cn: '操纵；操作', freq: '低', ex: 'Manipulate data.' },
  { w: 'margin', ph: '/ˈmɑːdʒɪn/', pos: 'n.', cn: '边缘；利润', freq: '低', ex: 'Profit margin.' },
  { w: 'massive', ph: '/ˈmæsɪv/', pos: 'adj.', cn: '巨大的', freq: '中', ex: 'Massive support.' },
  { w: 'mature', ph: '/məˈtʃʊə/', pos: 'adj.', cn: '成熟的', freq: '中', ex: 'A mature attitude.' },
  { w: 'mechanism', ph: '/ˈmekənɪzəm/', pos: 'n.', cn: '机制；机理', freq: '中', ex: 'A defense mechanism.' },
  { w: 'mental', ph: '/ˈmentl/', pos: 'adj.', cn: '心理的；精神的', freq: '高', ex: 'Mental health.' },
  { w: 'method', ph: '/ˈmeθəd/', pos: 'n.', cn: '方法', freq: '高', ex: 'A scientific method.' },
  { w: 'migrant', ph: '/ˈmaɪɡrənt/', pos: 'n.', cn: '移民；候鸟', freq: '低', ex: 'Migrant workers.' },
  { w: 'military', ph: '/ˈmɪlətri/', pos: 'adj.', cn: '军事的', freq: '中', ex: 'Military service.' },
  { w: 'minimal', ph: '/ˈmɪnɪml/', pos: 'adj.', cn: '最小的', freq: '低', ex: 'Minimal risk.' },
  { w: 'modify', ph: '/ˈmɒdɪfaɪ/', pos: 'v.', cn: '修改；调整', freq: '中', ex: 'Modify the plan.' },
  { w: 'monitor', ph: '/ˈmɒnɪtə/', pos: 'v./n.', cn: '监控；显示器', freq: '中', ex: 'Monitor progress.' },
  { w: 'motive', ph: '/ˈməʊtɪv/', pos: 'n.', cn: '动机', freq: '中', ex: 'A hidden motive.' },
  { w: 'mutual', ph: '/ˈmjuːtʃuəl/', pos: 'adj.', cn: '相互的', freq: '中', ex: 'Mutual respect.' },
  { w: 'narrow', ph: '/ˈnærəʊ/', pos: 'adj.', cn: '狭窄的', freq: '低', ex: 'A narrow road.' },
  { w: 'native', ph: '/ˈneɪtɪv/', pos: 'adj./n.', cn: '本地的；母语的', freq: '中', ex: 'Native speaker.' },
  { w: 'natural', ph: '/ˈnætʃrəl/', pos: 'adj.', cn: '自然的', freq: '高', ex: 'Natural talent.' },
  { w: 'negative', ph: '/ˈneɡətɪv/', pos: 'adj.', cn: '消极的；负的', freq: '高', ex: 'Negative attitude.' },
  { w: 'neglect', ph: '/nɪˈɡlekt/', pos: 'v./n.', cn: '忽视；疏忽', freq: '中', ex: 'Neglect your health.' },
  { w: 'network', ph: '/ˈnetwɜːk/', pos: 'n.', cn: '网络', freq: '高', ex: 'Social network.' },
  { w: 'neutral', ph: '/ˈnjuːtrəl/', pos: 'adj.', cn: '中立的', freq: '低', ex: 'Stay neutral.' },
  { w: 'nevertheless', ph: '/ˌnevəðəˈles/', pos: 'adv.', cn: '然而；不过', freq: '低', ex: 'Nevertheless, we try.' },
  { w: 'notion', ph: '/ˈnəʊʃn/', pos: 'n.', cn: '概念；想法', freq: '中', ex: 'A vague notion.' },
  { w: 'novel', ph: '/ˈnɒvl/', pos: 'n./adj.', cn: '小说；新颖的', freq: '中', ex: 'A novel idea.' },
  { w: 'nuclear', ph: '/ˈnjuːkliə/', pos: 'adj.', cn: '核的', freq: '中', ex: 'Nuclear energy.' },
  { w: 'objective', ph: '/əbˈdʒektɪv/', pos: 'n./adj.', cn: '目标；客观的', freq: '高', ex: 'An objective view.' },
  { w: 'obtain', ph: '/əbˈteɪn/', pos: 'v.', cn: '获得', freq: '高', ex: 'Obtain a degree.' },
  { w: 'obvious', ph: '/ˈɒbviəs/', pos: 'adj.', cn: '明显的', freq: '高', ex: 'An obvious mistake.' },
  { w: 'occupy', ph: '/ˈɒkjupaɪ/', pos: 'v.', cn: '占据；占领', freq: '中', ex: 'Occupy your mind.' },
  { w: 'occur', ph: '/əˈkɜː/', pos: 'v.', cn: '发生；出现', freq: '高', ex: 'Accidents occur.' },
  { w: 'offend', ph: '/əˈfend/', pos: 'v.', cn: '冒犯', freq: '中', ex: 'Offend someone.' },
  { w: 'offset', ph: '/ˈɒfset/', pos: 'v.', cn: '抵消', freq: '低', ex: 'Offset the cost.' },
  { w: 'ongoing', ph: '/ˈɒnɡəʊɪŋ/', pos: 'adj.', cn: '进行中的', freq: '中', ex: 'An ongoing project.' },
  { w: 'opponent', ph: '/əˈpəʊnənt/', pos: 'n.', cn: '对手', freq: '中', ex: 'A worthy opponent.' },
  { w: 'optimistic', ph: '/ˌɒptɪˈmɪstɪk/', pos: 'adj.', cn: '乐观的', freq: '中', ex: 'An optimistic view.' },
  { w: 'option', ph: '/ˈɒpʃn/', pos: 'n.', cn: '选择；选项', freq: '高', ex: 'Keep your options open.' },
  { w: 'origin', ph: '/ˈɒrɪdʒɪn/', pos: 'n.', cn: '起源；出身', freq: '中', ex: 'Country of origin.' },
  { w: 'output', ph: '/ˈaʊtpʊt/', pos: 'n.', cn: '产量；输出', freq: '中', ex: 'Daily output.' },
  { w: 'overcome', ph: '/ˌəʊvəˈkʌm/', pos: 'v.', cn: '克服', freq: '高', ex: 'Overcome fear.' },
  { w: 'overlap', ph: '/ˌəʊvəˈlæp/', pos: 'v./n.', cn: '重叠', freq: '低', ex: 'Overlap in time.' },
  { w: 'overseas', ph: '/ˌəʊvəˈsiːz/', pos: 'adv./adj.', cn: '海外', freq: '中', ex: 'Overseas study.' },
  { w: 'panel', ph: '/ˈpænl/', pos: 'n.', cn: '专家组；面板', freq: '低', ex: 'A discussion panel.' },
  { w: 'participant', ph: '/pɑːˈtɪsɪpənt/', pos: 'n.', cn: '参与者', freq: '中', ex: 'Active participant.' },
  { w: 'particular', ph: '/pəˈtɪkjələ/', pos: 'adj.', cn: '特别的；特定的', freq: '高', ex: 'In particular.' },
  { w: 'partner', ph: '/ˈpɑːtnə/', pos: 'n.', cn: '伙伴；搭档', freq: '高', ex: 'Business partner.' },
  { w: 'passive', ph: '/ˈpæsɪv/', pos: 'adj.', cn: '被动的', freq: '中', ex: 'Passive voice.' },
  { w: 'peak', ph: '/piːk/', pos: 'n./adj.', cn: '高峰', freq: '中', ex: 'Peak season.' },
  { w: 'perceive', ph: '/pəˈsiːv/', pos: 'v.', cn: '感知；察觉', freq: '中', ex: 'Perceive a change.' },
  { w: 'perform', ph: '/pəˈfɔːm/', pos: 'v.', cn: '执行；表演', freq: '高', ex: 'Perform a task.' },
  { w: 'period', ph: '/ˈpɪəriəd/', pos: 'n.', cn: '时期；周期', freq: '高', ex: 'A short period.' },
  { w: 'persist', ph: '/pəˈsɪst/', pos: 'v.', cn: '坚持；持续', freq: '中', ex: 'Persist in study.' },
  { w: 'perspective', ph: '/pəˈspektɪv/', pos: 'n.', cn: '视角；观点', freq: '高', ex: 'From my perspective.' },
  { w: 'phenomenon', ph: '/fəˈnɒmɪnən/', pos: 'n.', cn: '现象', freq: '高', ex: 'A natural phenomenon.' },
  { w: 'physical', ph: '/ˈfɪzɪkl/', pos: 'adj.', cn: '身体的；物理的', freq: '高', ex: 'Physical health.' },
  { w: 'plus', ph: '/plʌs/', pos: 'prep./conj.', cn: '加；而且', freq: '高', ex: 'Plus, it\'s free.' },
  { w: 'policy', ph: '/ˈpɒləsi/', pos: 'n.', cn: '政策', freq: '高', ex: 'Public policy.' },
  { w: 'portion', ph: '/ˈpɔːʃn/', pos: 'n.', cn: '部分；一份', freq: '中', ex: 'A portion of food.' },
  { w: 'pose', ph: '/pəʊz/', pos: 'v.', cn: '造成；摆姿势', freq: '中', ex: 'Pose a threat.' },
  { w: 'positive', ph: '/ˈpɒzətɪv/', pos: 'adj.', cn: '积极的；正的', freq: '高', ex: 'Positive attitude.' },
  { w: 'possess', ph: '/pəˈzes/', pos: 'v.', cn: '拥有', freq: '中', ex: 'Possess talent.' },
  { w: 'posture', ph: '/ˈpɒstʃə/', pos: 'n.', cn: '姿势；姿态', freq: '低', ex: 'Good posture.' },
  { w: 'poverty', ph: '/ˈpɒvəti/', pos: 'n.', cn: '贫困', freq: '中', ex: 'Live in poverty.' },
  { w: 'precise', ph: '/prɪˈsaɪs/', pos: 'adj.', cn: '精确的', freq: '中', ex: 'Precise data.' },
  { w: 'predict', ph: '/prɪˈdɪkt/', pos: 'v.', cn: '预测', freq: '中', ex: 'Predict the result.' },
  { w: 'prefer', ph: '/prɪˈfɜː/', pos: 'v.', cn: '更喜欢', freq: '高', ex: 'Prefer tea to coffee.' },
  { w: 'preliminary', ph: '/prɪˈlɪmɪnəri/', pos: 'adj.', cn: '初步的', freq: '低', ex: 'A preliminary study.' },
  { w: 'preserve', ph: '/prɪˈzɜːv/', pos: 'v.', cn: '保护；保存', freq: '中', ex: 'Preserve the environment.' },
  { w: 'prevail', ph: '/prɪˈveɪl/', pos: 'v.', cn: '盛行；获胜', freq: '低', ex: 'Justice will prevail.' },
  { w: 'previous', ph: '/ˈpriːviəs/', pos: 'adj.', cn: '先前的', freq: '高', ex: 'Previous experience.' },
  { w: 'primary', ph: '/ˈpraɪməri/', pos: 'adj.', cn: '主要的；初级的', freq: '高', ex: 'Primary goal.' },
  { w: 'priority', ph: '/praɪˈɒrəti/', pos: 'n.', cn: '优先；优先级', freq: '高', ex: 'Top priority.' },
  { w: 'privacy', ph: '/ˈprɪvəsi/', pos: 'n.', cn: '隐私', freq: '中', ex: 'Right to privacy.' },
  { w: 'proceed', ph: '/prəˈsiːd/', pos: 'v.', cn: '继续进行', freq: '中', ex: 'Proceed with care.' },
  { w: 'process', ph: '/ˈprəʊses/', pos: 'n./v.', cn: '过程；处理', freq: '高', ex: 'A long process.' },
  { w: 'proclaim', ph: '/prəˈkleɪm/', pos: 'v.', cn: '宣布', freq: '低', ex: 'Proclaim a victory.' },
  { w: 'produce', ph: '/prəˈdjuːs/', pos: 'v.', cn: '生产；产生', freq: '高', ex: 'Produce results.' },
  { w: 'profile', ph: '/ˈprəʊfaɪl/', pos: 'n.', cn: '简介；轮廓', freq: '中', ex: 'User profile.' },
  { w: 'profit', ph: '/ˈprɒfɪt/', pos: 'n./v.', cn: '利润；获利', freq: '中', ex: 'Make a profit.' },
  { w: 'profound', ph: '/prəˈfaʊnd/', pos: 'adj.', cn: '深刻的', freq: '低', ex: 'A profound impact.' },
  { w: 'prohibit', ph: '/prəˈhɪbɪt/', pos: 'v.', cn: '禁止', freq: '中', ex: 'Prohibit smoking.' },
  { w: 'project', ph: '/ˈprɒdʒekt/', pos: 'n.', cn: '项目；工程', freq: '高', ex: 'A research project.' },
  { w: 'promote', ph: '/prəˈməʊt/', pos: 'v.', cn: '促进；提升', freq: '高', ex: 'Promote health.' },
  { w: 'propose', ph: '/prəˈpəʊz/', pos: 'v.', cn: '提议；求婚', freq: '中', ex: 'Propose a plan.' },
  { w: 'prospect', ph: '/ˈprɒspekt/', pos: 'n.', cn: '前景；期望', freq: '中', ex: 'Job prospects.' },
  { w: 'prosperity', ph: '/prɒˈsperəti/', pos: 'n.', cn: '繁荣', freq: '低', ex: 'Economic prosperity.' },
  { w: 'protect', ph: '/prəˈtekt/', pos: 'v.', cn: '保护', freq: '高', ex: 'Protect the environment.' },
  { w: 'protest', ph: '/ˈprəʊtest/', pos: 'n./v.', cn: '抗议', freq: '中', ex: 'A peaceful protest.' },
  { w: 'provide', ph: '/prəˈvaɪd/', pos: 'v.', cn: '提供', freq: '高', ex: 'Provide support.' },
  { w: 'publish', ph: '/ˈpʌblɪʃ/', pos: 'v.', cn: '出版；发布', freq: '中', ex: 'Publish a paper.' },
  { w: 'pursue', ph: '/pəˈsjuː/', pos: 'v.', cn: '追求；从事', freq: '高', ex: 'Pursue your dream.' },
  { w: 'qualify', ph: '/ˈkwɒlɪfaɪ/', pos: 'v.', cn: '使合格； qualifying', freq: '中', ex: 'Qualify for the job.' },
  { w: 'quality', ph: '/ˈkwɒləti/', pos: 'n.', cn: '质量；品质', freq: '高', ex: 'High quality.' },
  { w: 'quote', ph: '/kwəʊt/', pos: 'v./n.', cn: '引用；报价', freq: '中', ex: 'Quote a line.' },
  { w: 'radical', ph: '/ˈrædɪkl/', pos: 'adj.', cn: '激进的；根本的', freq: '低', ex: 'A radical change.' },
  { w: 'random', ph: '/ˈrændəm/', pos: 'adj.', cn: '随机的', freq: '中', ex: 'Random sample.' },
  { w: 'range', ph: '/reɪndʒ/', pos: 'n./v.', cn: '范围；ranging', freq: '高', ex: 'A wide range.' },
  { w: 'rank', ph: '/ræŋk/', pos: 'n./v.', cn: '等级；排名', freq: '中', ex: 'Rank first.' },
  { w: 'rate', ph: '/reɪt/', pos: 'n./v.', cn: '比率；评价', freq: '高', ex: 'Birth rate.' },
  { w: 'rational', ph: '/ˈræʃnəl/', pos: 'adj.', cn: '理性的', freq: '低', ex: 'A rational choice.' },
  { w: 'react', ph: '/riˈækt/', pos: 'v.', cn: '反应', freq: '高', ex: 'React to news.' },
  { w: 'reality', ph: '/riˈæləti/', pos: 'n.', cn: '现实', freq: '高', ex: 'Face reality.' },
  { w: 'realize', ph: '/ˈrɪəlaɪz/', pos: 'v.', cn: '意识到；实现', freq: '高', ex: 'Realize a dream.' },
  { w: 'receive', ph: '/rɪˈsiːv/', pos: 'v.', cn: '收到', freq: '高', ex: 'Receive a gift.' },
  { w: 'recover', ph: '/rɪˈkʌvə/', pos: 'v.', cn: '恢复；挽回', freq: '中', ex: 'Recover from illness.' },
  { w: 'reflect', ph: '/rɪˈflekt/', pos: 'v.', cn: '反映；反思', freq: '高', ex: 'Reflect on life.' },
  { w: 'reform', ph: '/rɪˈfɔːm/', pos: 'v./n.', cn: '改革', freq: '中', ex: 'Education reform.' },
  { w: 'refuge', ph: '/ˈrefjuːdʒ/', pos: 'n.', cn: '避难所', freq: '低', ex: 'A safe refuge.' },
  { w: 'regime', ph: '/reɪˈʒiːm/', pos: 'n.', cn: '政权；制度', freq: '低', ex: 'A political regime.' },
  { w: 'region', ph: '/ˈriːdʒən/', pos: 'n.', cn: '地区', freq: '中', ex: 'In the region.' },
  { w: 'register', ph: '/ˈredʒɪstə/', pos: 'v.', cn: '登记；注册', freq: '中', ex: 'Register for class.' },
  { w: 'regulate', ph: '/ˈreɡjuleɪt/', pos: 'v.', cn: '管理；调节', freq: '中', ex: 'Regulate the market.' },
  { w: 'reinforce', ph: '/ˌriːɪnˈfɔːs/', pos: 'v.', cn: '加强；加固', freq: '低', ex: 'Reinforce learning.' },
  { w: 'reject', ph: '/rɪˈdʒekt/', pos: 'v.', cn: '拒绝；驳回', freq: '中', ex: 'Reject the offer.' },
  { w: 'relate', ph: '/rɪˈleɪt/', pos: 'v.', cn: '关联；叙述', freq: '高', ex: 'Relate to others.' },
  { w: 'release', ph: '/rɪˈliːs/', pos: 'v./n.', cn: '释放；发布', freq: '中', ex: 'Release a film.' },
  { w: 'relevant', ph: '/ˈreləvənt/', pos: 'adj.', cn: '相关的', freq: '高', ex: 'Relevant experience.' },
  { w: 'relief', ph: '/rɪˈliːf/', pos: 'n.', cn: '缓解；宽慰', freq: '中', ex: 'A sense of relief.' },
  { w: 'rely', ph: '/rɪˈlaɪ/', pos: 'v.', cn: '依赖', freq: '高', ex: 'Rely on yourself.' },
  { w: 'remain', ph: '/rɪˈmeɪn/', pos: 'v.', cn: '保持；剩余', freq: '高', ex: 'Remain calm.' },
  { w: 'remote', ph: '/rɪˈməʊt/', pos: 'adj.', cn: '遥远的', freq: '中', ex: 'Remote area.' },
  { w: 'remove', ph: '/rɪˈmuːv/', pos: 'v.', cn: '移除', freq: '高', ex: 'Remove obstacles.' },
  { w: 'replace', ph: '/rɪˈpleɪs/', pos: 'v.', cn: '取代；更换', freq: '高', ex: 'Replace the old.' },
  { w: 'request', ph: '/rɪˈkwest/', pos: 'n./v.', cn: '请求', freq: '高', ex: 'At your request.' },
  { w: 'require', ph: '/rɪˈkwaɪə/', pos: 'v.', cn: '需要；要求', freq: '高', ex: 'Require effort.' },
  { w: 'research', ph: '/rɪˈsɜːtʃ/', pos: 'n./v.', cn: '研究', freq: '高', ex: 'Do research.' },
  { w: 'reserve', ph: '/rɪˈzɜːv/', pos: 'v./n.', cn: '保留；预订', freq: '中', ex: 'Reserve a seat.' },
  { w: 'resolve', ph: '/rɪˈzɒlv/', pos: 'v.', cn: '解决；决心', freq: '中', ex: 'Resolve conflict.' },
  { w: 'resort', ph: '/rɪˈzɔːt/', pos: 'n./v.', cn: '度假胜地；求助', freq: '低', ex: 'Resort to force.' },
  { w: 'resource', ph: '/rɪˈsɔːs/', pos: 'n.', cn: '资源', freq: '高', ex: 'Natural resources.' },
  { w: 'respond', ph: '/rɪˈspɒnd/', pos: 'v.', cn: '回应', freq: '高', ex: 'Respond quickly.' },
  { w: 'restore', ph: '/rɪˈstɔː/', pos: 'v.', cn: '恢复；修复', freq: '低', ex: 'Restore confidence.' },
  { w: 'restrict', ph: '/rɪˈstrɪkt/', pos: 'v.', cn: '限制', freq: '中', ex: 'Restrict access.' },
  { w: 'retain', ph: '/rɪˈteɪn/', pos: 'v.', cn: '保留；保持', freq: '低', ex: 'Retain talent.' },
  { w: 'reveal', ph: '/rɪˈviːl/', pos: 'v.', cn: '揭示；显露', freq: '中', ex: 'Reveal the truth.' },
  { w: 'revenue', ph: '/ˈrevənjuː/', pos: 'n.', cn: '收入；税收', freq: '低', ex: 'Tax revenue.' },
  { w: 'reverse', ph: '/rɪˈvɜːs/', pos: 'v./adj.', cn: '反转；相反的', freq: '中', ex: 'Reverse the trend.' },
  { w: 'reward', ph: '/rɪˈwɔːd/', pos: 'n./v.', cn: '奖励', freq: '高', ex: 'A worthy reward.' },
  { w: 'rigid', ph: '/ˈrɪdʒɪd/', pos: 'adj.', cn: '僵硬的；严格的', freq: '低', ex: 'Rigid rules.' },
  { w: 'robust', ph: '/rəʊˈbʌst/', pos: 'adj.', cn: '强健的；稳健的', freq: '低', ex: 'A robust system.' },
  { w: 'route', ph: '/ruːt/', pos: 'n.', cn: '路线', freq: '中', ex: 'A safe route.' },
  { w: 'safeguard', ph: '/ˈseɪfɡɑːd/', pos: 'v./n.', cn: '保护；保障', freq: '低', ex: 'Safeguard rights.' },
  { w: 'salary', ph: '/ˈsæləri/', pos: 'n.', cn: '薪水', freq: '中', ex: 'Monthly salary.' },
  { w: 'scale', ph: '/skeɪl/', pos: 'n./v.', cn: '规模；比例', freq: '中', ex: 'On a large scale.' },
  { w: 'scenario', ph: '/səˈnɑːriəʊ/', pos: 'n.', cn: '情景；剧本', freq: '低', ex: 'A worst-case scenario.' },
  { w: 'scatter', ph: '/ˈskætə/', pos: 'v.', cn: '散开；散布', freq: '低', ex: 'Scatter seeds.' },
  { w: 'scheme', ph: '/skiːm/', pos: 'n.', cn: '计划；方案', freq: '低', ex: 'A training scheme.' },
  { w: 'scope', ph: '/skəʊp/', pos: 'n.', cn: '范围', freq: '中', ex: 'Beyond the scope.' },
  { w: 'secure', ph: '/sɪˈkjʊə/', pos: 'adj./v.', cn: '安全的；获得', freq: '高', ex: 'Secure a job.' },
  { w: 'seek', ph: '/siːk/', pos: 'v.', cn: '寻求', freq: '高', ex: 'Seek help.' },
  { w: 'segment', ph: '/ˈseɡmənt/', pos: 'n.', cn: '部分；片段', freq: '低', ex: 'A market segment.' },
  { w: 'select', ph: '/sɪˈlekt/', pos: 'v.', cn: '选择', freq: '高', ex: 'Select a topic.' },
  { w: 'sensible', ph: '/ˈsensəbl/', pos: 'adj.', cn: '明智的', freq: '中', ex: 'A sensible choice.' },
  { w: 'sequence', ph: '/ˈsiːkwəns/', pos: 'n.', cn: '顺序；序列', freq: '低', ex: 'In sequence.' },
  { w: 'series', ph: '/ˈsɪəriːz/', pos: 'n.', cn: '系列', freq: '中', ex: 'A series of events.' },
  { w: 'settle', ph: '/ˈsetl/', pos: 'v.', cn: '解决；定居', freq: '中', ex: 'Settle a dispute.' },
  { w: 'severe', ph: '/sɪˈvɪə/', pos: 'adj.', cn: '严重的；严厉的', freq: '中', ex: 'Severe weather.' },
  { w: 'shift', ph: '/ʃɪft/', pos: 'v./n.', cn: '转移；轮班', freq: '中', ex: 'Shift focus.' },
  { w: 'significant', ph: '/sɪɡˈnɪfɪkənt/', pos: 'adj.', cn: '重大的；显著的', freq: '高', ex: 'A significant difference.' },
  { w: 'similar', ph: '/ˈsɪmələ/', pos: 'adj.', cn: '相似的', freq: '高', ex: 'Similar ideas.' },
  { w: 'simulate', ph: '/ˈsɪmjuleɪt/', pos: 'v.', cn: '模拟', freq: '低', ex: 'Simulate an exam.' },
  { w: 'site', ph: '/saɪt/', pos: 'n.', cn: '地点；网站', freq: '中', ex: 'A construction site.' },
  { w: 'situation', ph: '/ˌsɪtʃuˈeɪʃn/', pos: 'n.', cn: '情况；形势', freq: '高', ex: 'A difficult situation.' },
  { w: 'skill', ph: '/skɪl/', pos: 'n.', cn: '技能', freq: '高', ex: 'Practical skills.' },
  { w: 'social', ph: '/ˈsəʊʃl/', pos: 'adj.', cn: '社会的；社交的', freq: '高', ex: 'Social media.' },
  { w: 'society', ph: '/səˈsaɪəti/', pos: 'n.', cn: '社会；协会', freq: '高', ex: 'A civilized society.' },
  { w: 'solar', ph: '/ˈsəʊlə/', pos: 'adj.', cn: '太阳的', freq: '低', ex: 'Solar energy.' },
  { w: 'source', ph: '/sɔːs/', pos: 'n.', cn: '来源', freq: '高', ex: 'Reliable source.' },
  { w: 'specific', ph: '/spəˈsɪfɪk/', pos: 'adj.', cn: '具体的；特定的', freq: '高', ex: 'Specific examples.' },
  { w: 'specify', ph: '/ˈspesɪfaɪ/', pos: 'v.', cn: '明确说明', freq: '中', ex: 'Specify the time.' },
  { w: 'spectrum', ph: '/ˈspektrəm/', pos: 'n.', cn: '光谱；范围', freq: '低', ex: 'A wide spectrum.' },
  { w: 'spend', ph: '/spend/', pos: 'v.', cn: '花费；度过', freq: '高', ex: 'Spend time.' },
  { w: 'spirit', ph: '/ˈspɪrɪt/', pos: 'n.', cn: '精神；灵魂', freq: '中', ex: 'Team spirit.' },
  { w: 'split', ph: '/splɪt/', pos: 'v.', cn: '分裂；分开', freq: '低', ex: 'Split the task.' },
  { w: 'sponsor', ph: '/ˈspɒnsə/', pos: 'n./v.', cn: '赞助者；赞助', freq: '低', ex: 'Event sponsor.' },
  { w: 'stable', ph: '/ˈsteɪbl/', pos: 'adj.', cn: '稳定的', freq: '中', ex: 'A stable job.' },
  { w: 'statistic', ph: '/stəˈtɪstɪk/', pos: 'n.', cn: '统计；数据', freq: '中', ex: 'Latest statistics.' },
  { w: 'status', ph: '/ˈsteɪtəs/', pos: 'n.', cn: '地位；状态', freq: '高', ex: 'Social status.' },
  { w: 'strain', ph: '/streɪn/', pos: 'n./v.', cn: '张力；拉紧', freq: '低', ex: 'Under strain.' },
  { w: 'strategy', ph: '/ˈstrætədʒi/', pos: 'n.', cn: '策略', freq: '高', ex: 'A clear strategy.' },
  { w: 'stress', ph: '/stres/', pos: 'n./v.', cn: '压力；强调', freq: '高', ex: 'Under stress.' },
  { w: 'strict', ph: '/strɪkt/', pos: 'adj.', cn: '严格的', freq: '中', ex: 'Strict rules.' },
  { w: 'structure', ph: '/ˈstrʌktʃə/', pos: 'n./v.', cn: '结构；构建', freq: '高', ex: 'Clear structure.' },
  { w: 'struggle', ph: '/ˈstrʌɡl/', pos: 'v./n.', cn: '挣扎；奋斗', freq: '中', ex: 'Struggle for life.' },
  { w: 'submit', ph: '/səbˈmɪt/', pos: 'v.', cn: '提交；屈服', freq: '中', ex: 'Submit a paper.' },
  { w: 'subsequent', ph: '/ˈsʌbsɪkwənt/', pos: 'adj.', cn: '随后的', freq: '低', ex: 'Subsequent events.' },
  { w: 'subsidy', ph: '/ˈsʌbsədi/', pos: 'n.', cn: '补贴', freq: '低', ex: 'Government subsidy.' },
  { w: 'substance', ph: '/ˈsʌbstəns/', pos: 'n.', cn: '物质；实质', freq: '低', ex: 'A harmful substance.' },
  { w: 'subtle', ph: '/ˈsʌtl/', pos: 'adj.', cn: '微妙的', freq: '低', ex: 'A subtle difference.' },
  { w: 'succeed', ph: '/səkˈsiːd/', pos: 'v.', cn: '成功', freq: '高', ex: 'Succeed in exams.' },
  { w: 'sufficient', ph: '/səˈfɪʃnt/', pos: 'adj.', cn: '足够的', freq: '中', ex: 'Sufficient evidence.' },
  { w: 'suggest', ph: '/səˈdʒest/', pos: 'v.', cn: '建议；暗示', freq: '高', ex: 'Suggest a plan.' },
  { w: 'summary', ph: '/ˈsʌməri/', pos: 'n.', cn: '摘要', freq: '中', ex: 'In summary.' },
  { w: 'supplement', ph: '/ˈsʌplɪmənt/', pos: 'n./v.', cn: '补充', freq: '低', ex: 'A dietary supplement.' },
  { w: 'supply', ph: '/səˈplaɪ/', pos: 'v./n.', cn: '供应', freq: '中', ex: 'Supply and demand.' },
  { w: 'suppose', ph: '/səˈpəʊz/', pos: 'v.', cn: '假设；认为', freq: '高', ex: 'Suppose it rains.' },
  { w: 'surge', ph: '/sɜːdʒ/', pos: 'n./v.', cn: '激增', freq: '低', ex: 'A surge in price.' },
  { w: 'survey', ph: '/ˈsɜːveɪ/', pos: 'n./v.', cn: '调查', freq: '中', ex: 'A customer survey.' },
  { w: 'survive', ph: '/səˈvaɪv/', pos: 'v.', cn: '幸存；存活', freq: '高', ex: 'Survive the crisis.' },
  { w: 'sustain', ph: '/səˈsteɪn/', pos: 'v.', cn: '维持；支撑', freq: '中', ex: 'Sustain growth.' },
  { w: 'swallow', ph: '/ˈswɒləʊ/', pos: 'v.', cn: '吞下', freq: '低', ex: 'Swallow pride.' },
  { w: 'switch', ph: '/swɪtʃ/', pos: 'v./n.', cn: '转换；开关', freq: '中', ex: 'Switch jobs.' },
  { w: 'symbol', ph: '/ˈsɪmbl/', pos: 'n.', cn: '象征；符号', freq: '中', ex: 'A symbol of peace.' },
  { w: 'sympathy', ph: '/ˈsɪmpəθi/', pos: 'n.', cn: '同情；共鸣', freq: '低', ex: 'Express sympathy.' },
  { w: 'tackle', ph: '/ˈtækl/', pos: 'v.', cn: '处理； tackling', freq: '中', ex: 'Tackle the issue.' },
  { w: 'target', ph: '/ˈtɑːɡɪt/', pos: 'n./v.', cn: '目标；瞄准', freq: '高', ex: 'Hit the target.' },
  { w: 'task', ph: '/tɑːsk/', pos: 'n.', cn: '任务', freq: '高', ex: 'Daily tasks.' },
  { w: 'technical', ph: '/ˈteknɪkl/', pos: 'adj.', cn: '技术的', freq: '中', ex: 'Technical skills.' },
  { w: 'technique', ph: '/tekˈniːk/', pos: 'n.', cn: '技巧；技术', freq: '中', ex: 'A new technique.' },
  { w: 'technology', ph: '/tekˈnɒlədʒi/', pos: 'n.', cn: '科技', freq: '高', ex: 'Modern technology.' },
  { w: 'temporary', ph: '/ˈtemprəri/', pos: 'adj.', cn: '临时的', freq: '中', ex: 'A temporary job.' },
  { w: 'tend', ph: '/tend/', pos: 'v.', cn: '倾向于', freq: '高', ex: 'Tend to agree.' },
  { w: 'term', ph: '/tɜːm/', pos: 'n.', cn: '学期；术语', freq: '高', ex: 'In the long term.' },
  { w: 'territory', ph: '/ˈterətri/', pos: 'n.', cn: '领土；领域', freq: '低', ex: 'Foreign territory.' },
  { w: 'threat', ph: '/θret/', pos: 'n.', cn: '威胁', freq: '中', ex: 'A real threat.' },
  { w: 'thus', ph: '/ðʌs/', pos: 'adv.', cn: '因此', freq: '高', ex: 'Thus we win.' },
  { w: 'tie', ph: '/taɪ/', pos: 'v./n.', cn: '系；联系', freq: '中', ex: 'Tie the knot.' },
  { w: 'timeline', ph: '/ˈtaɪmlaɪn/', pos: 'n.', cn: '时间线', freq: '低', ex: 'A project timeline.' },
  { w: 'tiny', ph: '/ˈtaɪni/', pos: 'adj.', cn: '微小的', freq: '低', ex: 'A tiny room.' },
  { w: 'tissue', ph: '/ˈtɪʃuː/', pos: 'n.', cn: '组织；纸巾', freq: '低', ex: 'Body tissue.' },
  { w: 'tone', ph: '/təʊn/', pos: 'n.', cn: '语气；音调', freq: '中', ex: 'A polite tone.' },
  { w: 'topic', ph: '/ˈtɒpɪk/', pos: 'n.', cn: '话题', freq: '高', ex: 'Hot topic.' },
  { w: 'trace', ph: '/treɪs/', pos: 'v./n.', cn: '追踪；痕迹', freq: '中', ex: 'Trace the source.' },
  { w: 'track', ph: '/træk/', pos: 'n./v.', cn: '轨道；追踪', freq: '高', ex: 'Keep track.' },
  { w: 'trade', ph: '/treɪd/', pos: 'n./v.', cn: '贸易；交易', freq: '中', ex: 'International trade.' },
  { w: 'tradition', ph: '/trəˈdɪʃn/', pos: 'n.', cn: '传统', freq: '中', ex: 'Cultural tradition.' },
  { w: 'traffic', ph: '/ˈtræfɪk/', pos: 'n.', cn: '交通；流量', freq: '中', ex: 'Heavy traffic.' },
  { w: 'trail', ph: '/treɪl/', pos: 'n.', cn: '小径；踪迹', freq: '低', ex: 'A mountain trail.' },
  { w: 'train', ph: '/treɪn/', pos: 'v./n.', cn: '训练；火车', freq: '高', ex: 'Train hard.' },
  { w: 'transfer', ph: '/trænsˈfɜː/', pos: 'v.', cn: '转移；调动', freq: '中', ex: 'Transfer money.' },
  { w: 'transform', ph: '/trænsˈfɔːm/', pos: 'v.', cn: '改变；转化', freq: '高', ex: 'Transform life.' },
  { w: 'transient', ph: '/ˈtrænziənt/', pos: 'adj.', cn: '短暂的', freq: '低', ex: 'Transient joy.' },
  { w: 'transmit', ph: '/trænsˈmɪt/', pos: 'v.', cn: '传播；传送', freq: '中', ex: 'Transmit a signal.' },
  { w: 'transparent', ph: '/trænsˈpærənt/', pos: 'adj.', cn: '透明的', freq: '低', ex: 'Transparent rules.' },
  { w: 'transport', ph: '/trænsˈpɔːt/', pos: 'n./v.', cn: '运输', freq: '中', ex: 'Public transport.' },
  { w: 'trap', ph: '/træp/', pos: 'n./v.', cn: '陷阱；困住', freq: '中', ex: 'Fall into a trap.' },
  { w: 'treat', ph: '/triːt/', pos: 'v.', cn: '对待；治疗', freq: '高', ex: 'Treat fairly.' },
  { w: 'trend', ph: '/trend/', pos: 'n.', cn: '趋势', freq: '高', ex: 'A growing trend.' },
  { w: 'trial', ph: '/ˈtraɪəl/', pos: 'n.', cn: '审判；试验', freq: '中', ex: 'A clinical trial.' },
  { w: 'trick', ph: '/trɪk/', pos: 'n./v.', cn: '诡计；戏弄', freq: '中', ex: 'A clever trick.' },
  { w: 'trigger', ph: '/ˈtrɪɡə/', pos: 'v./n.', cn: '触发', freq: '低', ex: 'Trigger a reaction.' },
  { w: 'tropical', ph: '/ˈtrɒpɪkl/', pos: 'adj.', cn: '热带的', freq: '低', ex: 'Tropical climate.' },
  { w: 'tuition', ph: '/tjuˈɪʃn/', pos: 'n.', cn: '学费', freq: '中', ex: 'High tuition.' },
  { w: 'twist', ph: '/twɪst/', pos: 'v./n.', cn: '扭转；转折', freq: '低', ex: 'A plot twist.' },
  { w: 'ultimate', ph: '/ˈʌltɪmət/', pos: 'adj.', cn: '最终的', freq: '高', ex: 'The ultimate goal.' },
  { w: 'undergo', ph: '/ˌʌndəˈɡəʊ/', pos: 'v.', cn: '经历；承受', freq: '低', ex: 'Undergo surgery.' },
  { w: 'uniform', ph: '/ˈjuːnɪfɔːm/', pos: 'n./adj.', cn: '制服；一致的', freq: '中', ex: 'School uniform.' },
  { w: 'unique', ph: '/juˈniːk/', pos: 'adj.', cn: '独特的', freq: '高', ex: 'A unique style.' },
  { w: 'universal', ph: '/ˌjuːnɪˈvɜːsl/', pos: 'adj.', cn: '普遍的', freq: '中', ex: 'Universal law.' },
  { w: 'unlike', ph: '/ʌnˈlaɪk/', pos: 'prep.', cn: '不像', freq: '中', ex: 'Unlike last year.' },
  { w: 'update', ph: '/ˌʌpˈdeɪt/', pos: 'v./n.', cn: '更新', freq: '高', ex: 'Update the app.' },
  { w: 'utility', ph: '/juˈtɪləti/', pos: 'n.', cn: '效用；公用事业', freq: '低', ex: 'Public utility.' },
  { w: 'utilize', ph: '/ˈjuːtəlaɪz/', pos: 'v.', cn: '利用', freq: '中', ex: 'Utilize resources.' },
  { w: 'vague', ph: '/veɪɡ/', pos: 'adj.', cn: '模糊的', freq: '中', ex: 'A vague answer.' },
  { w: 'valid', ph: '/ˈvælɪd/', pos: 'adj.', cn: '有效的；合理的', freq: '高', ex: 'A valid reason.' },
  { w: 'vanish', ph: '/ˈvænɪʃ/', pos: 'v.', cn: '消失', freq: '低', ex: 'The fog vanished.' },
  { w: 'variable', ph: '/ˈveəriəbl/', pos: 'n./adj.', cn: '变量；可变的', freq: '低', ex: 'A key variable.' },
  { w: 'vary', ph: '/ˈveəri/', pos: 'v.', cn: '变化；不同', freq: '高', ex: 'Opinions vary.' },
  { w: 'vast', ph: '/vɑːst/', pos: 'adj.', cn: '广阔的；巨大的', freq: '中', ex: 'A vast area.' },
  { w: 'vehicle', ph: '/ˈviːəkl/', pos: 'n.', cn: '车辆；工具', freq: '中', ex: 'A new vehicle.' },
  { w: 'venture', ph: '/ˈventʃə/', pos: 'n./v.', cn: '冒险；企业', freq: '低', ex: 'A new venture.' },
  { w: 'version', ph: '/ˈvɜːʃn/', pos: 'n.', cn: '版本', freq: '中', ex: 'The latest version.' },
  { w: 'victim', ph: '/ˈvɪktɪm/', pos: 'n.', cn: '受害者', freq: '中', ex: 'A flood victim.' },
  { w: 'view', ph: '/vjuː/', pos: 'n./v.', cn: '观点；观看', freq: '高', ex: 'In my view.' },
  { w: 'virtual', ph: '/ˈvɜːtʃuəl/', pos: 'adj.', cn: '虚拟的', freq: '中', ex: 'Virtual reality.' },
  { w: 'visible', ph: '/ˈvɪzəbl/', pos: 'adj.', cn: '可见的', freq: '中', ex: 'Visible progress.' },
  { w: 'vision', ph: '/ˈvɪʒn/', pos: 'n.', cn: '视力；愿景', freq: '中', ex: 'A clear vision.' },
  { w: 'visual', ph: '/ˈvɪʒuəl/', pos: 'adj.', cn: '视觉的', freq: '中', ex: 'Visual aids.' },
  { w: 'vital', ph: '/ˈvaɪtl/', pos: 'adj.', cn: '至关重要的', freq: '高', ex: 'Vital importance.' },
  { w: 'volume', ph: '/ˈvɒljuːm/', pos: 'n.', cn: '量；体积', freq: '中', ex: 'Sales volume.' },
  { w: 'voluntary', ph: '/ˈvɒləntri/', pos: 'adj.', cn: '志愿的；自愿的', freq: '低', ex: 'Voluntary work.' },
  { w: 'vote', ph: '/vəʊt/', pos: 'v./n.', cn: '投票', freq: '中', ex: 'Vote for him.' },
  { w: 'wage', ph: '/weɪdʒ/', pos: 'n.', cn: '工资', freq: '中', ex: 'Minimum wage.' },
  { w: 'wander', ph: '/ˈwɒndə/', pos: 'v.', cn: '徘徊；漫步', freq: '低', ex: 'Wander in the park.' },
  { w: 'wealth', ph: '/welθ/', pos: 'n.', cn: '财富', freq: '中', ex: 'Health is wealth.' },
  { w: 'weapon', ph: '/ˈwepən/', pos: 'n.', cn: '武器', freq: '中', ex: 'A nuclear weapon.' },
  { w: 'wisdom', ph: '/ˈwɪzdəm/', pos: 'n.', cn: '智慧', freq: '中', ex: 'Ancient wisdom.' },
  { w: 'withdraw', ph: '/wɪðˈdrɔː/', pos: 'v.', cn: '撤回；取款', freq: '中', ex: 'Withdraw money.' },
  { w: 'witness', ph: '/ˈwɪtnəs/', pos: 'v./n.', cn: '目睹；证人', freq: '中', ex: 'Witness a change.' },
  { w: 'worship', ph: '/ˈwɜːʃɪp/', pos: 'v./n.', cn: '崇拜', freq: '低', ex: 'Worship heroes.' },
  { w: 'yield', ph: '/jiːld/', pos: 'v./n.', cn: '产出；屈服', freq: '中', ex: 'Yield results.' },
  { w: 'youth', ph: '/juːθ/', pos: 'n.', cn: '青春；青年', freq: '中', ex: 'In my youth.' },
  { w: 'yield', ph: '/jiːld/', pos: 'v.', cn: '产生；屈服；让步', freq: '中', ex: 'The investment yields good profit.' },
  { w: 'zone', ph: '/zəʊn/', pos: 'n.', cn: '地区；区域', freq: '高', ex: 'This is a no-parking zone.' },
  { w: 'zoom', ph: '/zuːm/', pos: 'v.', cn: '快速移动；变焦', freq: '中', ex: 'The car zoomed past.' },
  { w: 'welfare', ph: '/ˈwelfeə/', pos: 'n.', cn: '福利；幸福', freq: '中', ex: 'Social welfare helps the poor.' },
  { w: 'wander', ph: '/ˈwɒndə/', pos: 'v.', cn: '漫步；走神', freq: '中', ex: 'She wandered in the park.' },
  { w: 'vessel', ph: '/ˈvesl/', pos: 'n.', cn: '血管；船只；容器', freq: '中', ex: 'A blood vessel carries blood.' },
  { w: 'venture', ph: '/ˈventʃə/', pos: 'n.', cn: '冒险（事业）', freq: '中', ex: 'A new business venture is risky.' },
  { w: 'vain', ph: '/veɪn/', pos: 'a.', cn: '徒劳的；虚荣的', freq: '中', ex: 'They tried in vain to save him.' },
  { w: 'urgent', ph: '/ˈɜːdʒənt/', pos: 'a.', cn: '紧急的', freq: '高', ex: 'This is an urgent call.' },
  { w: 'utility', ph: '/juːˈtɪləti/', pos: 'n.', cn: '实用；公用事业', freq: '中', ex: 'The utility of this tool is clear.' },
  { w: 'undergo', ph: '/ˌʌndəˈɡəʊ/', pos: 'v.', cn: '经历；承受', freq: '高', ex: 'He underwent surgery.' },
  { w: 'underlie', ph: '/ˌʌndəˈlaɪ/', pos: 'v.', cn: '构成…的基础', freq: '中', ex: 'Trust underlies friendship.' },
  { w: 'uniform', ph: '/ˈjuːnɪfɔːm/', pos: 'n./a.', cn: '制服；一致的', freq: '中', ex: 'Students wear a uniform.' },
  { w: 'union', ph: '/ˈjuːnjən/', pos: 'n.', cn: '联盟；工会', freq: '中', ex: 'The workers formed a union.' },
  { w: 'unity', ph: '/ˈjuːnəti/', pos: 'n.', cn: '团结；统一', freq: '中', ex: 'Unity brings strength.' },
  { w: 'upset', ph: '/ʌpˈset/', pos: 'v./a.', cn: '使心烦；打乱', freq: '高', ex: 'The news upset her.' },
  { w: 'utilize', ph: '/ˈjuːtəlaɪz/', pos: 'v.', cn: '利用', freq: '中', ex: 'We should utilize solar energy.' },
  { w: 'utmost', ph: '/ˈʌtməʊst/', pos: 'a.', cn: '极度的；最大限度的', freq: '中', ex: 'We tried our utmost.' },
  { w: 'vacant', ph: '/ˈveɪkənt/', pos: 'a.', cn: '空缺的；空的', freq: '中', ex: 'The seat was vacant.' },
  { w: 'vague', ph: '/veɪɡ/', pos: 'a.', cn: '模糊的；含糊的', freq: '中', ex: 'He gave a vague answer.' },
  { w: 'valid', ph: '/ˈvælɪd/', pos: 'a.', cn: '有效的；合理的', freq: '高', ex: 'Your ticket is still valid.' },
  { w: 'valley', ph: '/ˈvæli/', pos: 'n.', cn: '山谷', freq: '中', ex: 'The river runs through the valley.' },
  { w: 'variable', ph: '/ˈveəriəbl/', pos: 'a./n.', cn: '可变的；变量', freq: '中', ex: 'Temperature is a variable.' },
  { w: 'vary', ph: '/ˈveəri/', pos: 'v.', cn: '变化；不同', freq: '高', ex: 'Prices vary by season.' },
  { w: 'vast', ph: '/vɑːst/', pos: 'a.', cn: '广阔的；巨大的', freq: '高', ex: 'A vast ocean lay ahead.' },
  { w: 'vehicle', ph: '/ˈviːəkl/', pos: 'n.', cn: '车辆；媒介', freq: '高', ex: 'The vehicle broke down.' },
  { w: 'velocity', ph: '/vəˈlɒsəti/', pos: 'n.', cn: '速度；速率', freq: '低', ex: 'The velocity of light is fixed.' },
  { w: 'vertical', ph: '/ˈvɜːtɪkl/', pos: 'a.', cn: '垂直的', freq: '中', ex: 'Draw a vertical line.' },
  { w: 'via', ph: '/ˈvaɪə/', pos: 'prep.', cn: '经由；通过', freq: '高', ex: 'I sent it via email.' },
  { w: 'vice', ph: '/vaɪs/', pos: 'n.', cn: '恶习；缺点', freq: '中', ex: 'Greed is a vice.' },
  { w: 'victim', ph: '/ˈvɪktɪm/', pos: 'n.', cn: '受害者', freq: '高', ex: 'He was a victim of fraud.' },
  { w: 'violate', ph: '/ˈvaɪəleɪt/', pos: 'v.', cn: '违反；侵犯', freq: '中', ex: 'Do not violate the rules.' },
  { w: 'virtual', ph: '/ˈvɜːtʃuəl/', pos: 'a.', cn: '虚拟的；实质上的', freq: '高', ex: 'We met in a virtual room.' },
  { w: 'virtue', ph: '/ˈvɜːtʃuː/', pos: 'n.', cn: '美德；优点', freq: '中', ex: 'Honesty is a virtue.' },
  { w: 'visible', ph: '/ˈvɪzəbl/', pos: 'a.', cn: '可见的', freq: '中', ex: 'The star is visible at night.' },
  { w: 'vision', ph: '/ˈvɪʒn/', pos: 'n.', cn: '视力；远见', freq: '高', ex: 'She has a clear vision.' },
  { w: 'vital', ph: '/ˈvaɪtl/', pos: 'a.', cn: '至关重要的；生命的', freq: '高', ex: 'Sleep is vital to health.' },
  { w: 'volume', ph: '/ˈvɒljuːm/', pos: 'n.', cn: '体积；音量；卷', freq: '中', ex: 'Turn up the volume.' },
  { w: 'voluntary', ph: '/ˈvɒləntri/', pos: 'a.', cn: '自愿的；志愿的', freq: '中', ex: 'He is a voluntary worker.' },
  { w: 'vote', ph: '/vəʊt/', pos: 'v./n.', cn: '投票；选举', freq: '高', ex: 'They vote for the leader.' },
  { w: 'voyage', ph: '/ˈvɔɪɪdʒ/', pos: 'n.', cn: '航行；航程', freq: '低', ex: 'The voyage took months.' },
  { w: 'wage', ph: '/weɪdʒ/', pos: 'n.', cn: '工资（常用复数）', freq: '高', ex: 'His wages rose this year.' },
  { w: 'warn', ph: '/wɔːn/', pos: 'v.', cn: '警告；提醒', freq: '高', ex: 'She warned me of the risk.' },
  { w: 'weary', ph: '/ˈwɪəri/', pos: 'a.', cn: '疲倦的；厌倦的', freq: '低', ex: 'He felt weary after work.' },
  { w: 'weave', ph: '/wiːv/', pos: 'v.', cn: '编织', freq: '中', ex: 'She weaves a basket.' },
  { w: 'weed', ph: '/wiːd/', pos: 'n./v.', cn: '杂草；除草', freq: '低', ex: 'Pull the weeds in the garden.' },
  { w: 'widen', ph: '/ˈwaɪdn/', pos: 'v.', cn: '加宽；扩大', freq: '中', ex: 'They widened the road.' },
  { w: 'willing', ph: '/ˈwɪlɪŋ/', pos: 'a.', cn: '愿意的', freq: '高', ex: 'He is willing to help.' },
  { w: 'withdraw', ph: '/wɪðˈdrɔː/', pos: 'v.', cn: '撤回；取款', freq: '中', ex: 'He withdrew money from the bank.' },
  { w: 'witness', ph: '/ˈwɪtnəs/', pos: 'n./v.', cn: '目击者；见证', freq: '高', ex: 'She witnessed the accident.' },
  { w: 'worship', ph: '/ˈwɜːʃɪp/', pos: 'v./n.', cn: '崇拜；敬奉', freq: '中', ex: 'They worship the sun.' },
  { w: 'worthy', ph: '/ˈwɜːði/', pos: 'a.', cn: '值得的', freq: '中', ex: 'The cause is worthy of support.' },
  { w: 'yawn', ph: '/jɔːn/', pos: 'v.', cn: '打哈欠', freq: '低', ex: 'He yawned in class.' },
  { w: 'youngster', ph: '/ˈjʌŋstə/', pos: 'n.', cn: '年轻人；少年', freq: '中', ex: 'The youngsters played outside.' },
  { w: 'quarrel', ph: '/ˈkwɒrəl/', pos: 'v./n.', cn: '争吵', freq: '中', ex: 'They quarreled over money.' },
  { w: 'quiver', ph: '/ˈkwɪvə/', pos: 'v.', cn: '颤抖；抖动', freq: '低', ex: 'Her voice quivered.' },
  { w: 'quotation', ph: '/kwəʊˈteɪʃn/', pos: 'n.', cn: '引文；报价', freq: '中', ex: 'He used a quotation from Tagore.' },
  { w: 'radical', ph: '/ˈrædɪkl/', pos: 'a.', cn: '根本的；激进的', freq: '中', ex: 'A radical change is needed.' },
  { w: 'rail', ph: '/reɪl/', pos: 'n.', cn: '栏杆；铁轨', freq: '中', ex: 'The train left the rails.' },
  { w: 'rational', ph: '/ˈræʃnəl/', pos: 'a.', cn: '理性的；合理的', freq: '中', ex: 'Make a rational choice.' },
  { w: 'realm', ph: '/relm/', pos: 'n.', cn: '领域；王国', freq: '中', ex: 'In the realm of art, rules differ.' },
  { w: 'rebel', ph: '/ˈrebl/', pos: 'n./v.', cn: '反叛者；反抗', freq: '中', ex: 'The rebels fought the king.' },
  { w: 'recall', ph: '/rɪˈkɔːl/', pos: 'v.', cn: '回忆；召回', freq: '高', ex: 'I recall his face.' },
  { w: 'recession', ph: '/rɪˈseʃn/', pos: 'n.', cn: '经济衰退', freq: '中', ex: 'The recession hurt jobs.' },
  { w: 'reckless', ph: '/ˈrekləs/', pos: 'a.', cn: '鲁莽的', freq: '低', ex: 'Reckless driving is dangerous.' },
  { w: 'reckon', ph: '/ˈrekən/', pos: 'v.', cn: '认为；估计', freq: '中', ex: 'I reckon he is right.' },
  { w: 'recruit', ph: '/rɪˈkruːt/', pos: 'v./n.', cn: '招募；新成员', freq: '高', ex: 'The army recruits soldiers.' },
  { w: 'refine', ph: '/rɪˈfaɪn/', pos: 'v.', cn: '精炼；改进', freq: '中', ex: 'They refine crude oil.' },
  { w: 'reinforce', ph: '/ˌriːɪnˈfɔːs/', pos: 'v.', cn: '加强；加固', freq: '高', ex: 'This proves reinforces my view.' },
  { w: 'rejoice', ph: '/rɪˈdʒɔɪs/', pos: 'v.', cn: '欣喜；高兴', freq: '低', ex: 'They rejoiced at the news.' },
  { w: 'relay', ph: '/ˈriːleɪ/', pos: 'v./n.', cn: '转播；接力', freq: '低', ex: 'The match was relayed live.' },
  { w: 'relevant', ph: '/ˈreləvənt/', pos: 'a.', cn: '相关的', freq: '高', ex: 'Give a relevant example.' },
  { w: 'reliable', ph: '/rɪˈlaɪəbl/', pos: 'a.', cn: '可靠的', freq: '高', ex: 'He is a reliable friend.' },
  { w: 'relief', ph: '/rɪˈliːf/', pos: 'n.', cn: '缓解；宽慰', freq: '高', ex: 'The medicine brought relief.' },
  { w: 'religious', ph: '/rɪˈlɪdʒəs/', pos: 'a.', cn: '宗教的', freq: '中', ex: 'She is religious.' },
  { w: 'reluctant', ph: '/rɪˈlʌktənt/', pos: 'a.', cn: '不情愿的', freq: '中', ex: 'He was reluctant to go.' },
  { w: 'remarkable', ph: '/rɪˈmɑːkəbl/', pos: 'a.', cn: '显著的；非凡的', freq: '高', ex: 'She made remarkable progress.' },
  { w: 'remedy', ph: '/ˈremədi/', pos: 'n./v.', cn: '补救；治疗', freq: '中', ex: 'There is no easy remedy.' },
  { w: 'render', ph: '/ˈrendə/', pos: 'v.', cn: '致使；提供', freq: '高', ex: 'The shock rendered him silent.' },
  { w: 'rent', ph: '/rent/', pos: 'n./v.', cn: '租金；出租', freq: '高', ex: 'He pays rent monthly.' }
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
  { cat: '节奏', title: '情绪蓄水池', body: '长期伏笔到点释放，读者才爆哭。前面每埋一次，后面回报一次。', ex: '第3章埋的伤疤，第20章揭晓，弹幕全破防。' }
];
function renderNovelCraft() {
  const el = document.getElementById('novelCraftBox'); if (!el) return;
  const cats = ['全部', '逻辑', '钩子', '文案', '节奏', '共鸣'];
  const cur = el.dataset.cat || '全部';
  const pool = cur === '全部' ? novelCraft : novelCraft.filter(c => c.cat === cur);
  const list = seededShuffle(pool, 'craft' + cur + todayKey());
  el.innerHTML = `
    <div class="text-sm mb-2" style="color:#1565c0;font-weight:700">📅 每日更新 · ${todayKey()}（共 ${novelCraft.length} 条创作心法，每天轮换呈现顺序，覆盖逻辑/钩子/文案/节奏/共鸣）</div>
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
  { cat: 'Cos', title: '病娇反派 cos', scenario: '用妆造和眼神拿捏反派疯感', hook: '「温柔笑着，却让人后背发凉」', shots: ['素颜对比', '上妆过程', '眼神特写练习', '定格wink'], voice: '「疯批也可以很美」', bgm: '暗黑电子', caption: '#病娇 #反派cos' }
];
function renderVideoScr() {
  const el = document.getElementById('videoScrBox'); if (!el) return;
  const cats = ['全部', 'Cos', '追星', '旅游'];
  const cur = el.dataset.cat || '全部';
  const pool = cur === '全部' ? videoScripts : videoScripts.filter(v => v.cat === cur);
  const list = seededShuffle(pool, 'vscr' + cur + todayKey());
  el.innerHTML = `
    <div class="text-sm mb-2" style="color:#1565c0;font-weight:700">📅 每日更新 · ${todayKey()}（共 ${videoScripts.length} 套脚本模板，每天轮换呈现顺序，覆盖 Cos / 追星 / 旅游）</div>
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
  const ids = ['daily', 'review', 'english', 'exam', 'medical', 'inspiration', 'viral', 'edit', 'recruit', 'fitness', 'finance', 'novel', 'image', 'books', 'drawing', 'guitar', 'kitchen', 'media', 'travel', 'office', 'eq', 'ai', 'jjwxc', 'meme', 'mine', 'genius', 'material', 'vocab', 'novelcraft', 'videoscr', 'editcheck', 'goods', 'rewards', 'accounting', 'film', 'dailyreview', 'seasonaldish', 'booklearn'];
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
