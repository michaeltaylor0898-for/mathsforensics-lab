// records one game into rec/<name>.webm while an auto-player answers (mostly right)
const { chromium } = require('playwright'); const S = require('./srv.cjs'); const fs = require('fs');
const SP = '/tmp/claude-0/-home-claude/f1d53d1f-4d59-5811-9613-91c4d8e7bcb5/scratchpad/ir/';
const [name, query, secs] = [process.argv[2], process.argv[3], +process.argv[4] || 20];
const GAMES = {
  pursuit: async p => { await p.click('#puGo'); },
  interrogation: async p => { await p.click('#go').catch(() => {}); },
};
(async () => { const port = 8800 + Math.floor(Math.random() * 90); const srv = S.start(port); const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1280, height: 720 }, recordVideo: { dir: SP + 'rec/' + name, size: { width: 1280, height: 720 } } });
  await ctx.route(/fonts\.googleapis\.com/, r => r.fulfill({ contentType: 'text/css', body: S.CSS.replace(/url\(\//g, `url(http://localhost:${port}/`) }));
  await ctx.route(/supabase\.co|jsdelivr/, r => r.abort());
  const p = await ctx.newPage(); p.on('pageerror', e => console.log('ERR', e.message));
  await p.goto(`http://localhost:${port}/incident-room/${query}`); await p.waitForTimeout(1500);
  if (GAMES[name]) await GAMES[name](p);
  await p.evaluate(() => { window.__auto = true; });
  if (process.env.FAST) setTimeout(() => p.evaluate(() => { if (window.IR.S.pu) window.IR.S.pu.left = 4; }).catch(() => {}), +process.env.FAST * 1000);
  const t0 = Date.now(); let n = 0;
  while (Date.now() - t0 < secs * 1000) {
    await p.waitForTimeout(900 + Math.random() * 700);
    const done = await p.evaluate(() => {
      const S = window.IR.S, q = (S.pu && S.pu.q) || (S.iv && S.iv.R && S.iv.R.q);
      const opts = [...document.querySelectorAll('.pu-opt')].filter(b => !b.disabled);
      if (!opts.length || !q || q.a === undefined) { const off = document.querySelectorAll('.pu-offerb'); const nb = off.length ? off[1] : document.querySelector('#app .btn.primary, #app button.primary'); if (nb && window.__auto) { nb.click(); return 'next'; } return 'none'; }
      const right = Math.random() < 0.85; const i = right ? q.a : (q.a + 1) % opts.length;
      opts[i] && opts[i].click(); return right ? 'R' : 'W';
    }).catch(e => 'err');
    n++;
  }
  await p.screenshot({ path: SP + 'rec/' + name + '-end.png' });
  await ctx.close(); await b.close(); srv.close();
  const f = fs.readdirSync(SP + 'rec/' + name).find(x => x.endsWith('.webm')); console.log('video', SP + 'rec/' + name + '/' + f, 'moves', n);
})();
