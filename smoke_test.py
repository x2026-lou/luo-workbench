import http.server, socketserver, threading, os, time, json
from playwright.sync_api import sync_playwright

os.chdir('/workspace/luo-workbench')
PORT = 8866
httpd = socketserver.TCPServer(('127.0.0.1', PORT), http.server.SimpleHTTPRequestHandler)
threading.Thread(target=httpd.serve_forever, daemon=True).start()
time.sleep(0.5)

res = {}
with sync_playwright() as p:
    b = p.chromium.launch(args=['--no-sandbox'])
    pg = b.new_page()
    errs = []
    pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' else None)
    pg.on('pageerror', lambda e: errs.append('PAGEERR: ' + str(e)))
    pg.goto(f'http://127.0.0.1:{PORT}/index.html?v=14', wait_until='networkidle')
    pg.wait_for_timeout(900)

    # ② 选词填空 28 篇
    pg.evaluate("goPage('english')"); pg.wait_for_timeout(300)
    pg.evaluate("""document.querySelector('#engTabs .tab[data-eng="quiz"]').click()""")
    pg.wait_for_timeout(500)
    cloze = pg.evaluate("""() => {
      const h = document.getElementById('engQuizPanel').innerText || '';
      const m = h.match(/第 (\\d+)\\/(\\d+) 篇/);
      return { ok: !!m, total: m ? +m[2] : 0 };
    }""")
    res['2_cloze_28'] = cloze

    # ③ 收藏星标 + 聚合弹窗
    pg.evaluate("""() => {
      const g = JSON.parse(localStorage.getItem('luo_golden')||'[]');
      g.unshift({id:'t1', type:'好评', title:'测试金句', text:'这是一条测试收藏', date: fmtDate()});
      localStorage.setItem('luo_golden', JSON.stringify(g));
      const n = JSON.parse(localStorage.getItem('luo_notes_daily')||'[]');
      n.unshift({id:'n_test', title:'测试笔记', content:'正文[[IMG:data:image/png;base64,AAAA]]尾巴', date: fmtDate()});
      localStorage.setItem('luo_notes_daily', JSON.stringify(n));
    }""")
    pg.evaluate("goPage('collect')"); pg.wait_for_timeout(400)
    collect = pg.evaluate("""() => {
      const cards = [...document.querySelectorAll('#collectList .collect-card')];
      const noteCard = cards.find(c => c.innerText.includes('测试笔记')) || cards[0];
      if (!noteCard) return { ok:false, reason:'no cards', count: document.getElementById('collectCount').textContent };
      noteCard.click();
      const modal = document.getElementById('collectModal');
      const open = modal.classList.contains('open');
      const body = document.getElementById('collectModalBody').innerHTML;
      const hasImg = body.includes('<img');
      return { ok:true, count: cards.length, modalOpen: open, bodyHasImg: hasImg, countText: document.getElementById('collectCount').textContent };
    }""")
    res['3_collect_modal'] = collect

    # gstar 在 复盘/菜谱/衣橱/旅行 渲染存在（直接操作应用内存数组再渲染）
    pg.evaluate("""() => {
      reviews.unshift({id: 999001, title:'测试复盘', data:'数据', pros:'优点', cons:'优化', date: fmtDate()}); renderReviews();
      recipes.unshift({id: 999002, name:'测试菜', price:'5元', prep:'做法', photo:'', date: fmtDate()}); renderRecipes();
      wardrobe.unshift({id: 999003, name:'测试单品', img:'data:image/png;base64,AAA'}); renderWardrobe();
      travelPlans.unshift({id:999004, departure:'北京', dest:'上海', days:3, type:'short', theme:'观光', budget:'1000', schedule:[{day:1,text:'外滩'}], luggage:['充电宝'], done:false, date: fmtDate()}); renderTravel();
    }""")
    pg.wait_for_timeout(400)
    stars = pg.evaluate("""() => ({ goldenStarCount: document.querySelectorAll('.golden-star').length })""")
    res['3_gstar_buttons'] = stars

    # ④ 笔记内联编辑 + id + 插图
    note = pg.evaluate("""() => {
      goPage('daily');
      const n = JSON.parse(localStorage.getItem('luo_notes_daily')||'[]');
      if(!n.find(x=>x.id==='n_ed')) n.unshift({id:'n_ed', title:'编', content:'旧内容', date: fmtDate()});
      localStorage.setItem('luo_notes_daily', JSON.stringify(n));
      renderMyNotes('daily');
      const star = document.querySelector('#notesList-daily .golden-star');
      const hasImgFn = typeof insertNoteImage === 'function';
      const editBtn = [...document.querySelectorAll('#notesList-daily .note-btn')].find(b=>b.textContent==='编辑');
      editBtn && editBtn.click();
      const btnText = document.getElementById('noteSaveBtn-daily').textContent;
      return { hasStar: !!star, hasImgFn, saveBtnAfterEdit: btnText };
    }""")
    res['4_note_edit'] = note

    # ⑤ 自动备份
    backup = pg.evaluate("""() => {
      toggleAutoBackup();
      return { on: localStorage.getItem('luo_auto_backup_on')==='true', hasSnapshot: !!localStorage.getItem('luo_auto_backup') };
    }""")
    res['5_auto_backup'] = backup

    res['console_errors'] = errs[:10]
    b.close()
httpd.shutdown()
print(json.dumps(res, ensure_ascii=False, indent=2))
