import subprocess, time, sys, os
from playwright.sync_api import sync_playwright

PORT = 8139
ROOT = os.path.dirname(os.path.abspath(__file__))

proc = subprocess.Popen(["python3.11", "-m", "http.server", str(PORT)], cwd=ROOT,
                        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
time.sleep(1.5)

results = {}
errors = []

try:
    with sync_playwright() as p:
        b = p.chromium.launch()
        pg = b.new_page()
        pg.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
        pg.on("pageerror", lambda e: errors.append("PAGEERR: " + str(e)))
        pg.goto(f"http://localhost:{PORT}/?v=20", wait_until="networkidle")
        time.sleep(1.0)

        # 1) imageTabs 第二栏应为电子衣柜
        order = pg.evaluate("Array.from(document.querySelectorAll('#imageTabs .tab')).map(t=>t.dataset.img)")
        results['imageTabs_order'] = order
        results['wardrobe_is_2nd'] = (order[1] == 'wardrobe' if len(order) > 1 else False)

        # 2) 英语版块：日期导航按钮 + 标签
        pg.evaluate("goPage('english')")
        time.sleep(0.6)
        nav_btns = pg.evaluate("document.querySelectorAll('#wordDayNav button').length")
        results['wordDayNav_buttons'] = nav_btns
        lbl0 = pg.evaluate("document.getElementById('wordDayLabel').textContent")
        results['label_today'] = lbl0
        # 上一日
        pg.evaluate("goWordDay(wordDayOffset - 1)")
        time.sleep(0.3)
        lbl_prev = pg.evaluate("document.getElementById('wordDayLabel').textContent")
        results['label_after_prev'] = lbl_prev
        # 今日
        pg.evaluate("goWordDay(0)")
        time.sleep(0.3)
        lbl_today = pg.evaluate("document.getElementById('wordDayLabel').textContent")
        results['label_back_today'] = lbl_today
        # 下一日
        pg.evaluate("goWordDay(wordDayOffset + 1)")
        time.sleep(0.3)
        lbl_next = pg.evaluate("document.getElementById('wordDayLabel').textContent")
        results['label_after_next'] = lbl_next

        # 3) 背词 +1 积分
        pg.evaluate("goWordDay(0); switchWordTab('new');")
        time.sleep(0.4)
        before = pg.evaluate("typeof totalPoints!=='undefined' ? totalPoints : null")
        # 确保当前词未学过，点击标记
        pg.evaluate("if(!learnedSet.has(wordList[wordIdx % wordList.length].en)) markWordLearned()")
        time.sleep(0.3)
        after = pg.evaluate("typeof totalPoints!=='undefined' ? totalPoints : null")
        results['points_before'] = before
        results['points_after'] = after
        results['points_increased'] = (isinstance(before,int) and isinstance(after,int) and after == before + 1)

        # 4) 高频词面板：卡片数量 + 助记可折叠
        pg.evaluate("goPage('vocab')")
        time.sleep(0.6)
        hf_cards = pg.evaluate("document.querySelectorAll('#vocabBox .word-list .word-card').length")
        results['highfreq_cards'] = hf_cards
        hf_collapsible = pg.evaluate("document.querySelectorAll('#vocabBox .word-mnem[onclick]').length")
        results['highfreq_mnem_collapsible'] = hf_collapsible
        # 测试点击折叠确实切换 open
        if hf_collapsible > 0:
            first = pg.evaluate("""(function(){var el=document.querySelector('#vocabBox .word-mnem[onclick]');var had=el.classList.contains('open');el.click();return {had:had,now:el.classList.contains('open')};})()""")
            results['collapse_toggle_works'] = (first['had'] != first['now'])

        b.close()
except Exception as e:
    errors.append("EXC: " + str(e))

proc.terminate()
print("ERRORS:", errors)
print("RESULTS:", results)
# 断言
ok = (not errors) and results.get('wardrobe_is_2nd') and results.get('wordDayNav_buttons')==3 \
     and ('过去' in str(results.get('label_after_prev',''))) and results.get('label_back_today')=='📅 今日单词' \
     and ('未来' in str(results.get('label_after_next',''))) and results.get('points_increased') \
     and results.get('highfreq_cards',0) >= 50 and results.get('highfreq_mnem_collapsible',0) > 0 \
     and results.get('collapse_toggle_works')
print("SMOKE_OK" if ok else "SMOKE_FAIL")
sys.exit(0 if ok else 1)
