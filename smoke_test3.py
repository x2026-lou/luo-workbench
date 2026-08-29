import http.server, socketserver, threading, os, time, json
from playwright.sync_api import sync_playwright

os.chdir('/workspace/luo-workbench')
PORT = 8973
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
    pg.goto(f'http://127.0.0.1:{PORT}/index.html?v=16', wait_until='networkidle')
    pg.wait_for_timeout(900)

    # ① 收藏：点击星标 → luo_golden 更新 + 星标变黄
    fav = pg.evaluate("""() => {
      goPage('review');
      reviews.unshift({id: 998001, title:'收藏测试复盘', data:'d', pros:'p', cons:'c', date: fmtDate()});
      renderReviews();
      const btn = document.querySelector('#reviewList .golden-star');
      if (!btn) return { ok:false, reason:'no star' };
      btn.click();
      const golden = JSON.parse(localStorage.getItem('luo_golden')||'[]');
      const after = document.querySelector('#reviewList .golden-star.on');
      return { ok:true, goldenCount: golden.length, hasOn: !!after, lastHasSource: golden[0] && !!golden[0].source, source: golden[0] && golden[0].source };
    }""")
    res['1_favorite'] = fav

    # 聚合页：收藏出现 + 详情弹窗含「前往来源」按钮可跳转
    jump = pg.evaluate("""() => {
      goPage('collect');
      const card = document.querySelector('#collectList .collect-card');
      if (!card) return { ok:false, reason:'no card', count: document.getElementById('collectCount').textContent };
      card.click();
      const modal = document.getElementById('collectModal');
      const open = modal.classList.contains('open');
      const jb = document.getElementById('collectModalJump');
      const jumpVisible = jb && jb.style.display !== 'none';
      let beforePage = currentPage;
      if (jumpVisible) jb.click();
      return { ok:true, modalOpen: open, jumpVisible, beforePage, afterPage: currentPage };
    }""")
    res['1_collect_jump'] = jump

    # ② 单词：未背(橙) vs 已背(蓝) + 标记按钮蓝色
    word = pg.evaluate("""() => {
      goPage('english'); switchWordTab('new');
      const cells = document.querySelectorAll('#wordGrid .word-cell');
      const unlearnedColor = cells[0] ? getComputedStyle(cells[0]).borderTopColor : '';
      // 标记第一词为掌握
      cells[0].click();
      document.getElementById('wordLearnedBtn').click();
      const learnedCell = document.querySelector('#wordGrid .word-cell.learned');
      const learnedColor = learnedCell ? getComputedStyle(learnedCell).borderTopColor : '';
      const btnOn = document.getElementById('wordLearnedBtn').classList.contains('on');
      return { ok:true, cells: cells.length, unlearnedBorder: unlearnedColor, learnedBorder: learnedColor, btnBlue: btnOn };
    }""")
    res['2_word_colors'] = word

    # ② 单词网格响应式（auto-fill）
    grid = pg.evaluate("""() => {
      const g = document.querySelector('#wordGrid');
      const cs = getComputedStyle(g);
      return { template: cs.gridTemplateColumns };
    }""")
    res['2_grid'] = grid

    # ② 换下一批：批次+1，单词变化
    batch = pg.evaluate("""() => {
      goPage('english'); switchWordTab('new');
      const before = (newWords[0]||{}).en;
      const b0 = wordBatch;
      nextWordBatch();
      const after = (newWords[0]||{}).en;
      const label = document.getElementById('wordBatchBtn').textContent;
      return { ok:true, before, after, changed: before!==after, batchBefore:b0, batchAfter: wordBatch, label };
    }""")
    res['2_batch'] = batch

    # ③ 自动备份存在
    backup = pg.evaluate("""() => ({ on: localStorage.getItem('luo_auto_backup_on'), snap: !!localStorage.getItem('luo_auto_backup') })""")
    res['3_backup'] = backup

    res['console_errors'] = errs[:8]
    b.close()
httpd.shutdown()
print(json.dumps(res, ensure_ascii=False, indent=2))
