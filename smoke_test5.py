import subprocess, threading, time, os, sys, json
from playwright.sync_api import sync_playwright

PORT = 8137
ROOT = os.path.dirname(os.path.abspath(__file__))

def start_server():
    p = subprocess.Popen([sys.executable, "-m", "http.server", str(PORT)],
                         cwd=ROOT, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    time.sleep(1.5)
    return p

server = start_server()
errors = []
results = {}

try:
    with sync_playwright() as pw:
        browser = pw.chromium.launch(args=["--no-sandbox"])
        page = browser.new_page()
        page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
        page.on("pageerror", lambda e: errors.append("PAGEERROR: " + str(e)))
        page.goto(f"http://127.0.0.1:{PORT}/index.html?v=19", wait_until="networkidle")
        time.sleep(2)

        # 1) daily word panel populated
        page.evaluate("goPage('english')")
        time.sleep(1)
        results["dailyWordPanel"] = page.eval_on_selector("#dailyWordPanel", "el => el.innerText.length") or 0
        # trigger immediate generation
        page.click("text=立即生成今日推荐", timeout=3000)
        time.sleep(1)
        results["dailyAfterGen"] = page.eval_on_selector("#dailyWordPanel", "el => el.innerText.includes('推荐')")

        # 2) vocab high-freq words
        page.evaluate("goPage('vocab')")
        time.sleep(1)
        results["highFreqCards"] = page.eval_on_selector_all(".word-card.done .word-w, #vocabBox .word-w", "els => els.length") or 0
        results["highFreqSample"] = page.eval_on_selector("#vocabBox", "el => (el.innerText.includes('高频词详解') && el.innerText.includes('记忆提示'))")

        # 3) grammar section
        page.evaluate("goPage('grammar')")
        time.sleep(1)
        results["grammarTitle"] = page.eval_on_selector("#grammarBox", "el => el.innerText.includes('今日语法')")
        results["grammarChips"] = page.eval_on_selector_all("#grammarBox .gptag", "els => els.length") or 0

        # 4) speaking section
        page.evaluate("goPage('speaking')")
        time.sleep(1)
        results["speakingTitle"] = page.eval_on_selector("#speakingBox", "el => el.innerText.includes('今日口语')")
        results["speakingExpr"] = page.eval_on_selector_all("#speakingBox .ana-li", "els => els.length") or 0

        # 5) image multi-select inputs present (notes/wardrobe/recipe)
        page.evaluate("goPage('image')")
        time.sleep(1)
        results["wardrobeMultiple"] = page.eval_on_selector("#imageWardrobePanel input[type=file]", "el => el.hasAttribute('multiple')") if page.query_selector("#imageWardrobePanel input[type=file]") else False
        page.evaluate("goPage('kitchen')")
        time.sleep(1)
        results["recipeMultiple"] = page.eval_on_selector("#recipePhoto", "el => el.hasAttribute('multiple')") if page.query_selector("#recipePhoto") else False

        browser.close()
except Exception as e:
    results["EXCEPTION"] = str(e)

server.terminate()
print(json.dumps({"errors": errors[:10], "results": results}, ensure_ascii=False, indent=2))
