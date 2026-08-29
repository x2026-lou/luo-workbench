import http.server, socketserver, threading, os, time, json
from playwright.sync_api import sync_playwright

os.chdir('/workspace/luo-workbench')
PORT = 8987
httpd = socketserver.TCPServer(('127.0.0.1', PORT), http.server.SimpleHTTPRequestHandler)
threading.Thread(target=httpd.serve_forever, daemon=True).start()
time.sleep(0.5)

res = {}
with sync_playwright() as p:
    b = p.chromium.launch(args=['--no-sandbox'])
    pg = b.new_page(viewport={'width': 390, 'height': 800})
    errs = []
    pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' else None)
    pg.on('pageerror', lambda e: errs.append('PAGEERR: ' + str(e)))
    pg.goto(f'http://127.0.0.1:{PORT}/index.html?v=18', wait_until='networkidle')
    pg.wait_for_timeout(1200)

    # ① IndexedDB 持久化：数据写入后能从 IDB 读回（localStorage 无该键也能读到）
    idb = pg.evaluate("""() => {
      return new Promise(resolve => {
        const req = indexedDB.open('luoWorkbench', 1);
        req.onsuccess = e => {
          const db = e.target.result;
          if (!db.objectStoreNames.contains('kv')) { resolve({hasStore:false}); return; }
          const tx = db.transaction('kv','readonly');
          const cur = tx.objectStore('kv').openCursor();
          const keys = [];
          cur.onsuccess = ce => { const c = ce.target.result; if (c) { keys.push(c.key); c.continue(); } else resolve({hasStore:true, count:keys.length, sample:keys.slice(0,5)}); };
          cur.onerror = () => resolve({hasStore:true, count:0});
        };
        req.onerror = () => resolve({hasStore:false, err:true});
      });
    }""")
    res['1_idb'] = idb

    # 写入一条数据，验证能从 store 读回（再确认进 IDB）
    write = pg.evaluate("""() => {
      store.set('luo_test_idb_x', {hello:'world', n:42});
      const back = store.get('luo_test_idb_x');
      // 清理
      const raw = _mem['luo_test_idb_x'];
      delete _mem['luo_test_idb_x'];
      return { back, raw: raw };
    }""")
    res['1_store_roundtrip'] = write

    # ② 收藏星标变黄 + 动画类
    star = pg.evaluate("""() => {
      goPage('review');
      reviews.unshift({id:998011, title:'黄色星标测试', data:'d', pros:'p', cons:'c', date: fmtDate()});
      renderReviews();
      const btn = document.querySelector('#reviewList .golden-star');
      if (!btn) return {ok:false};
      btn.click();
      const onStar = document.querySelector('#reviewList .golden-star.on');
      return { ok:true, starIsOn: !!onStar, color: onStar ? getComputedStyle(onStar).color : '' };
    }""")
    res['2_star_yellow'] = star

    # ③ 收藏页按版块分组
    group = pg.evaluate("""() => {
      // 准备几条不同来源的收藏
      store.set('luo_golden', JSON.stringify([
        {id:'genre-2', type:'题材库', title:'双向暗恋', text:'', date:'2026.8.22'},
        {id:'rev-998011', type:'复盘', title:'黄色星标测试', text:'', date: fmtDate()}
      ]));
      goPage('collect');
      toggleCollectGroup(); // -> section
      const titles = document.querySelectorAll('#collectList .collect-group-title');
      const grouped = titles.length > 0;
      const labels = Array.from(titles).map(t => t.textContent.replace(/\\s+/g,' ').trim());
      // 切回平铺
      toggleCollectGroup();
      return { grouped, groupCount: titles.length, labels };
    }""")
    res['3_group'] = group

    # ③ 笔记按版块归类：验证 _secLabel 映射
    sec = pg.evaluate("""() => {
      store.set('luo_notes_travel', JSON.stringify([{id:1,title:'我的旅行笔记',content:'内容',date:fmtDate()}]));
      goPage('collect'); setCollectType('笔记');
      toggleCollectGroup();
      const t = document.querySelector('#collectList .collect-group-title');
      return { groupTitle: t ? t.textContent.replace(/\\s+/g,' ').trim() : null };
    }""")
    res['3_note_section'] = sec

    res['console_errors'] = errs[:8]
    b.close()
httpd.shutdown()
print(json.dumps(res, ensure_ascii=False, indent=2))
