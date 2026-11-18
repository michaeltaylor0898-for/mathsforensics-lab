const { chromium } = require('playwright'); const S = require('./srv.cjs');
const SP = '/tmp/claude-0/-home-claude/f1d53d1f-4d59-5811-9613-91c4d8e7bcb5/scratchpad/ir/stills/';
(async () => { const srv = S.start(8898); const b = await chromium.launch();
  for (const f of ['vault', 'like-terms', 'timetables']) {
    const ctx = await b.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1.5 });
    await ctx.route(/fonts\.googleapis\.com/, r => r.fulfill({ contentType: 'text/css', body: S.CSS.replace(/url\(\//g, 'url(http://localhost:8898/') }));
    const p = await ctx.newPage(); p.on('pageerror', e => console.log(f, 'ERR', e.message));
    await p.goto(`http://localhost:8898/academy/${f}.html`); await p.waitForTimeout(1200);
    await p.screenshot({ path: SP + `ac-${f}-0.png` });
    const btns = await p.evaluate(() => [...document.querySelectorAll('button')].filter(b => b.offsetParent).map(b => b.textContent.trim().slice(0, 30)));
    console.log(f, JSON.stringify(btns.slice(0, 12)));
    // press the first big start-looking button, twice if there's a briefing
    for (let i = 0; i < 3; i++) { await p.evaluate(() => { const v = [...document.querySelectorAll('button')].filter(b => b.offsetParent); const b = v.find(b => /^(Cadet|Detective)/.test(b.textContent.trim())) || v.find(b => /start|play|begin|open the|accept|let's|next/i.test(b.textContent)); b && b.click(); }); await p.waitForTimeout(1300); }
    await p.screenshot({ path: SP + `ac-${f}-1.png` });
    await ctx.close();
  }
  await b.close(); srv.close(); })();
