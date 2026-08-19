from playwright.sync_api import sync_playwright

errors = []
pages = ['english', 'medical', 'novel', 'ai', 'jjwxc', 'meme', 'mine', 'genius', 'material',
         'vocab', 'novelcraft', 'videoscr', 'editcheck', 'goods',
         'rewards', 'dailyreview', 'booknotes', 'film', 'accounting',
         'seasonaldish', 'booklearn', 'exam', 'recruit', 'travel', 'drawing', 'office', 'eq']

with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page()
    pg.on('console', lambda m: errors.append('CONSOLE ' + m.type + ': ' + m.text) if m.type in ('error', 'warning') else None)
    pg.on('pageerror', lambda e: errors.append('PAGEERROR: ' + str(e)))
    pg.goto('http://127.0.0.1:8099/index.html', wait_until='networkidle')

    for pid in pages:
        try:
            js = "var el=document.querySelector('.nav-item[data-id=\"" + pid + "\"]'); if(el) el.click();"
            pg.evaluate(js)
            pg.wait_for_timeout(200)
        except Exception as e:
            errors.append('NAV ' + pid + ': ' + str(e))

    # 晋江 tab 切换
    pg.evaluate("()=>{ var t=document.querySelectorAll('#jjwxcTabs .tab'); for(var i=0;i<t.length;i++) t[i].click(); }")
    pg.wait_for_timeout(100)
    pg.evaluate("()=>{ if(window.refreshJJWXC) refreshJJWXC(); }")
    pg.wait_for_timeout(100)
    # 旅行：先切换到旅行页，再生成并保存一个方案
    pg.evaluate("()=>{ if(window.goPage) goPage('travel'); }")
    pg.wait_for_timeout(200)
    pg.evaluate("""()=>{
      var d=document.getElementById('travelDeparture'); if(d) d.value='测试出发地';
      var dest=document.getElementById('travelDest'); if(dest) dest.value='测试目的地';
      var days=document.getElementById('travelDays'); if(days) days.value='3';
      var budget=document.getElementById('travelBudget'); if(budget) budget.value='2000';
      var theme=document.getElementById('travelTheme'); if(theme) theme.value='博物馆巡礼';
      var lug=document.getElementById('travelLuggage'); if(lug) lug.value='身份证、充电宝、雨伞';
      if(window.generateTravelPlan) generateTravelPlan();
      if(window.saveTravelPlan) saveTravelPlan();
    }""")
    pg.wait_for_timeout(300)
    # 旅行：切换中途/长途 tab
    pg.evaluate("""()=>{
      var t=document.querySelector('#travelTypeTabs .tab[data-ttype=\"medium\"]'); if(t) t.click();
      t=document.querySelector('#travelTypeTabs .tab[data-ttype=\"long\"]'); if(t) t.click();
    }""")
    pg.wait_for_timeout(100)

    pg.evaluate("()=>{ var t=document.querySelector('#memeTabs .tab[data-meme=\"百合\"]'); if(t) t.click(); }")
    pg.evaluate("()=>{ var t=document.querySelector('#mineTabs .tab[data-mine=\"雷点\"]'); if(t) t.click(); }")
    pg.evaluate("()=>{ var a=document.getElementById('genA'); if(a)a.value='桀骜校霸'; var b=document.getElementById('genB'); if(b)b.value='软萌学霸'; if(window.generateIdea) generateIdea(); }")
    pg.evaluate("()=>{ var s=document.getElementById('materialSearch'); if(s){ s.value='暗恋'; if(window.renderMaterial) renderMaterial(); } }")

    # 单词：随堂测试
    pg.evaluate("()=>{ if(window.vocabTest) vocabTest(); }")
    pg.evaluate("()=>{ if(window.completeVocabBatch) completeVocabBatch(); }")
    # 小说创作切 tab
    pg.evaluate("()=>{ if(window.setNcCat) setNcCat('钩子'); }")
    # 视频脚本切 tab
    pg.evaluate("()=>{ if(window.setVsCat) setVsCat('追星'); }")
    # 剪辑打卡：完成一项 + 完成今日
    pg.evaluate("()=>{ if(window.toggleEditTask) toggleEditTask('et_transition'); }")
    pg.evaluate("()=>{ if(window.finishEditDay) finishEditDay(); }")
    # 好物：加一条
    pg.evaluate("()=>{ var n=document.getElementById('gName'); if(n){ n.value='测试好物'; if(window.addGood) addGood(); } }")
    # 奖励：领取
    pg.evaluate("()=>{ if(window.renderRewards) renderRewards(); if(window.claimDailyReward) claimDailyReward(); }")
    # 复盘/书摘/拉片/记账 各加一条
    pg.evaluate("()=>{ var d=document.getElementById('drDone'); if(d){ d.value='测试完成'; if(window.addDailyReview) addDailyReview(); } }")
    pg.evaluate("()=>{ var t=document.getElementById('bnText'); if(t){ t.value='测试书摘'; if(window.addBookNote) addBookNote(); } }")
    pg.evaluate("()=>{ var n=document.getElementById('fmName'); if(n){ n.value='测试片'; if(window.addFilm) addFilm(); } }")
    pg.evaluate("()=>{ var a=document.getElementById('acAmount'); if(a){ a.value='12'; if(window.addAccounting) addAccounting(); } }")
    # 时令/好书
    pg.evaluate("()=>{ if(window.renderSeasonalDish) renderSeasonalDish(); }")
    pg.evaluate("()=>{ if(window.renderBookLearn) renderBookLearn(); if(window.toggleLearn) toggleLearn(0,0); }")
    # 收藏星标
    pg.evaluate("()=>{ var g=document.querySelector('.golden-star'); if(g) g.click(); }")
    pg.wait_for_timeout(300)
    b.close()

print('ERRORS_COUNT=' + str(len(errors)))
for e in errors[:60]:
    print(e)
