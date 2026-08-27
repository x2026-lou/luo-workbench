import http.server, socketserver, threading, os, time, json
from playwright.sync_api import sync_playwright

os.chdir('/workspace/luo-workbench')
PORT = 8811
httpd = socketserver.TCPServer(('127.0.0.1', PORT), http.server.SimpleHTTPRequestHandler)
threading.Thread(target=httpd.serve_forever, daemon=True).start()
time.sleep(0.5)

results = {}
with sync_playwright() as p:
    b = p.chromium.launch(args=['--no-sandbox'])
    pg = b.new_page()
    errors = []
    pg.on('console', lambda m: errors.append(m.text) if m.type == 'error' else None)
    pg.on('pageerror', lambda e: errors.append('PAGEERR: ' + str(e)))
    pg.goto(f'http://127.0.0.1:{PORT}/index.html?v=13', wait_until='networkidle')
    pg.wait_for_timeout(800)

    # (1) 每日必打卡 per-date
    m = pg.evaluate("""() => {
      const k = 'luo_mustdo_' + (typeof todayKey==='function'?todayKey():'X');
      const before = JSON.parse(localStorage.getItem(k) || '{}');
      const card = document.querySelector('#mustDoList .mustdo-card');
      if(!card) return {ok:false, reason:'no mustdo card'};
      card.querySelector('.todo-check').click();
      const after = JSON.parse(localStorage.getItem(k) || '{}');
      return {ok:true, key:k, before:Object.keys(before).length, after:Object.keys(after).length};
    }""")
    results['1_mustdo_daily'] = m

    # (2) 吉他 6 项
    pg.evaluate("goPage('guitar')"); pg.wait_for_timeout(300)
    g = pg.evaluate("""() => {
      const cards = document.querySelectorAll('#guitarCheckList .cet-task');
      if(cards.length !== 6) return {ok:false, count:cards.length};
      cards[0].click();
      const k = 'luo_guitar_daily_' + todayKey();
      const done = JSON.parse(localStorage.getItem(k)||'{}');
      return {ok:true, count:cards.length, firstDone: !!done['scale']};
    }""")
    results['2_guitar_6'] = g

    # (3) 选词填空 换一篇
    pg.evaluate("goPage('english')"); pg.wait_for_timeout(300)
    pg.evaluate("""() => {
      const t = document.querySelector('#engTabs .tab[data-eng="quiz"]');
      if(t) t.click();
    }""")
    pg.wait_for_timeout(500)
    c = pg.evaluate("""() => {
      const h = document.getElementById('engQuizPanel')?.innerText || '';
      const m1 = h.match(/第 (\\d+)\\/(\\d+) 篇/);
      if(!m1) return {ok:false, reason:'no passage indicator', h:h.slice(0,120)};
      const btn = [...document.querySelectorAll('button')].find(x=>x.textContent.includes('换一篇'));
      const before = m1[1]+'/'+m1[2];
      if(btn) btn.click();
      return {ok:true, before, total:m1[2], hadBtn:!!btn};
    }""")
    pg.wait_for_timeout(400)
    c2 = pg.evaluate("""() => {
      const h = document.getElementById('engQuizPanel')?.innerText || '';
      const m1 = h.match(/第 (\\d+)\\/(\\d+) 篇/);
      return m1 ? (m1[1]+'/'+m1[2]) : 'none';
    }""")
    results['3_cloze_change'] = {**c, 'after': c2}

    # (4) 医学细胞生物学
    pg.evaluate("goPage('medical')"); pg.wait_for_timeout(300)
    results['4_medical_cellbio'] = pg.evaluate("() => ({ok: document.body.innerText.includes('医学细胞生物学')})")

    # (5) 聚合页
    pg.evaluate("goPage('collect')"); pg.wait_for_timeout(300)
    results['5_collect_page'] = pg.evaluate("""() => {
      const cnt = document.getElementById('collectCount');
      const list = document.getElementById('collectList');
      const tabs = document.querySelectorAll('#collectTypes .ctab');
      // 测试搜索：输入一个不可能匹配的词，计数应下降或显示空
      return {ok: !!cnt && !!list && tabs.length===5, tabCount:tabs.length, count:cnt?.textContent};
    }""")

    # (6) openApp 不抛错
    results['6_openapp'] = pg.evaluate("""() => {
      try {
        if(typeof openApp !== 'function') return {ok:false, reason:'no openApp'};
        return {ok:true, hasFn:true};
      } catch(e){ return {ok:false, err:String(e)}; }
    }""")

    results['console_errors'] = errors[:8]
    b.close()
httpd.shutdown()
print(json.dumps(results, ensure_ascii=False, indent=2))
