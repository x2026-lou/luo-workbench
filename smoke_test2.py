import http.server, socketserver, threading, os, time, json
from playwright.sync_api import sync_playwright

os.chdir('/workspace/luo-workbench')
PORT = 8899
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
    pg.goto(f'http://127.0.0.1:{PORT}/index.html?v=15', wait_until='networkidle')
    pg.wait_for_timeout(900)

    # ① 手绘勾：勾选必打卡后出现 svg.draw-check
    dc = pg.evaluate("""() => {
      goPage('daily');
      const card = document.querySelector('#mustDoList .mustdo-card .todo-check');
      if (!card) return { ok:false, reason:'no check' };
      card.click();
      const after = document.querySelector('#mustDoList .mustdo-card .todo-check.done svg.draw-check');
      return { ok: !!after, svgPresent: !!after };
    }""")
    res['1_draw_check'] = dc

    # ② 已掌握浅色：标记单词掌握后 word-cell.learned 带浅色样式
    lw = pg.evaluate("""() => {
      goPage('english'); switchWordTab('new');
      const before = document.querySelectorAll('.word-cell.learned').length;
      // 取第一个词标为掌握
      const first = document.querySelector('#wordGrid .word-cell');
      if (!first) return { ok:false, reason:'no word cell' };
      first.click();
      // 点击「标记掌握」按钮
      const btn = document.getElementById('wordLearnedBtn');
      if (btn) btn.click();
      const learnedCells = document.querySelectorAll('.word-cell.learned');
      return { ok: learnedCells.length > before, before, after: learnedCells.length };
    }""")
    res['2_learned_light'] = lw

    # 校验 CSS：draw-check 动画与 learned 浅色规则存在
    css = pg.evaluate("""() => {
      const cs = getComputedStyle(document.createElement('style'));
      const sheets = [...document.styleSheets];
      let hasDraw = false, hasLearned = false;
      for (const s of sheets) { try { for (const r of s.cssRules) { if (r.selectorText && r.selectorText.includes('draw-check')) hasDraw = true; if (r.selectorText && r.selectorText.includes('.word-cell.learned')) hasLearned = true; } } catch(e){} }
      return { hasDraw, hasLearned };
    }""")
    res['css_rules'] = css
    res['console_errors'] = errs[:8]
    b.close()
httpd.shutdown()
print(json.dumps(res, ensure_ascii=False, indent=2))
