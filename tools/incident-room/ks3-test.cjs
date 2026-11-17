const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const root = '/home/claude/ir-live';
const srv = http.createServer((req, res) => { const p = path.join(root, decodeURIComponent(req.url.split('?')[0]).replace(/\/$/, '/index.html')); fs.readFile(p, (e, d) => { if (e) { res.writeHead(404); return res.end(); } res.writeHead(200, { 'content-type': 'text/html' }); res.end(d); }); }).listen(8765);
(async () => {
  const b = await chromium.launch(); const errs = [];
  const ctx = await b.newContext({ viewport: { width: 1024, height: 768 } });
  await ctx.route(/cdn\.jsdelivr\.net\/npm\/@supabase/, r => r.fulfill({ contentType: 'application/javascript', body: fs.readFileSync('/tmp/claude-0/-home-claude/f1d53d1f-4d59-5811-9613-91c4d8e7bcb5/scratchpad/sbjs/package/dist/umd/supabase.js') }));
  await ctx.route(/supabase\.co/, r => r.abort());
  const pg = await ctx.newPage();
  pg.on('pageerror', e => errs.push('pageerror: ' + e.message));
  pg.on('console', m => { if (m.type() === 'error' && !/supabase|Failed to load|net::/i.test(m.text())) errs.push('console: ' + m.text()); });
  await pg.goto('http://localhost:8765/?play=interrogation&ks3=1&sub=KF'); await pg.waitForTimeout(2500);
  const r = await pg.evaluate(() => {
    const IR = window.IR, Q = IR.QUESTIONS, out = {};
    out.total = Q.length; out.ks3 = Q.filter(q => q.ks3).length;
    out.idxOk = Q.every((q, k) => q.n === k);
    out.H = IR.poolFor({ tier: 'H', topics: [] }).filter(q => q.ks3).length;
    out.F = IR.poolFor({ tier: 'F', topics: [] }).filter(q => q.ks3).length;
    out.Hn = IR.poolFor({ tier: 'H', topics: [] }).length;
    out.K = IR.poolFor({ tier: 'K', topics: [] }).length; out.Knon = IR.poolFor({ tier: 'K', topics: [] }).filter(q => !q.ks3).length;
    out.Kallow = IR.poolFor({ tier: 'K', topics: [], allow: ['N1'] }).length;
    out.KA1 = IR.poolFor({ tier: 'K', topics: ['KA1'] }).length;
    // interrogation sets
    const bad = []; let sizes = [];
    for (const strands of [[], ['KA1','KA2'], ['KR1'], ['KR2'], ['KN1','KN2'], ['KN3']]) for (let seed = 1; seed < 40; seed++) {
      const set = IR.ivBuild(seed * 7919, { tier: 'K', strands, free: true });
      sizes.push([1,2,3].map(l => set[l].length).join('/'));
      for (const l of [1,2,3]) for (const q of set[l]) { if (q.topic[0] !== 'K' || (strands.length && !strands.some(s => q.topic.startsWith(s)))) bad.push(q.topic); if (q.opts.length < 2 || q.a < 0 || q.a >= q.opts.length || new Set(q.opts).size !== q.opts.length) bad.push('opt:' + q.brief); }
    }
    const g = IR.ivBuild(5, { tier: 'H', strands: [] }); const gk = [1,2,3].flatMap(l => g[l]).filter(q => q.topic[0] === 'K').length;
    const g2 = IR.ivBuild(5, { tier: 'F', strands: ['A'] }); const gk2 = [1,2,3].flatMap(l => g2[l]).filter(q => q.topic[0] !== 'A').length;
    const same = JSON.stringify(IR.ivBuild(99, { tier: 'K', strands: ['KA1'] })) === JSON.stringify(IR.ivBuild(99, { tier: 'K', strands: ['KA1'] }));
    Object.assign(out, { bad: bad.slice(0, 10), nbad: bad.length, sizes: [...new Set(sizes)].slice(0, 6), gcseLeak: gk, gcseStrand: gk2, seeded: same });
    return out;
  });
  console.log(JSON.stringify(r));
  // UI: solo interrogation in KS3
  const txt = await pg.locator('#app, body').first().innerText();
  console.log('setup KS3 pressed:', await pg.locator('[data-ivtier="K"]').getAttribute('aria-pressed'), 'KF pressed:', await pg.locator('[data-ivsub="KF"]').getAttribute('aria-pressed'));
  await pg.screenshot({ path: '/tmp/claude-0/-home-claude/f1d53d1f-4d59-5811-9613-91c4d8e7bcb5/scratchpad/iv-setup.png', fullPage: true });
  await pg.click('#go'); await pg.waitForTimeout(500);
  // a name prompt may appear
  for (let i = 0; i < 6 && !(await pg.locator('.pu-opt').count()); i++) { await pg.waitForTimeout(800); }
  const briefs = [];
  for (let i = 0; i < 12; i++) { if (!(await pg.locator('.pu-opt').count())) break; briefs.push(await pg.locator('.pu-q').innerText()); await pg.locator('.pu-opt').first().click(); await pg.waitForTimeout(1200); }
  console.log('played', briefs.length, briefs.slice(0, 8));
  await pg.screenshot({ path: '/tmp/claude-0/-home-claude/f1d53d1f-4d59-5811-9613-91c4d8e7bcb5/scratchpad/iv-play.png' });
  // Rapid Response solo KS3
  const pg2 = await ctx.newPage(); pg2.on('pageerror', e => errs.push('pg2: ' + e.message));
  await pg2.goto('http://localhost:8765/?play=rapid&ks3=1&topics=KR1,KR2'); await pg2.waitForTimeout(2500);
  let t2 = await pg2.innerText('body'); console.log('RR first screen:', t2.slice(0, 200).replace(/\n/g, ' | '));
  // fill profile if asked
  const nm = pg2.locator('input').first(); if (await nm.count()) { try { await nm.fill('Tester'); } catch (e) {} }
  for (const sel of ['button:has-text("Start")']) { if (await pg2.locator(sel).count() && !(await pg2.locator('[data-tier="K"]').count())) { try { await pg2.click(sel); await pg2.waitForTimeout(800); } catch (e) {} } }
  t2 = await pg2.innerText('body'); console.log('RR setup:', t2.slice(0, 600).replace(/\n/g, ' | '));
  await pg2.screenshot({ path: '/tmp/claude-0/-home-claude/f1d53d1f-4d59-5811-9613-91c4d8e7bcb5/scratchpad/rr-setup.png', fullPage: true });
  if (await pg2.locator('#go').count()) { await pg2.click('#go'); await pg2.waitForTimeout(1500); console.log('RR q:', (await pg2.innerText('body')).slice(0, 300).replace(/\n/g, ' | ')); console.log('RR topics', await pg2.evaluate(() => window.IR.S.solo && window.IR.S.solo.qs.map(n => window.IR.QUESTIONS[n].topic).join(','))); }
  // switch tier back to GCSE in a fresh setup and check topics clear
  const pg3 = await ctx.newPage(); pg3.on('pageerror', e => errs.push('pg3: ' + e.message));
  await pg3.goto('http://localhost:8765/?host&game=interrogation&ks3=1'); await pg3.waitForTimeout(2500);
  console.log('host iv:', (await pg3.innerText('body')).slice(0, 900).replace(/\n/g, ' | '));
  if (await pg3.locator('[data-ivtier="K"]').count()) {
    console.log('host K pressed', await pg3.locator('[data-ivtier="K"]').getAttribute('aria-pressed'));
    await pg3.click('[data-ivsub="KP"]'); await pg3.waitForTimeout(300);
    await pg3.click('[data-ivtier="H"]'); await pg3.waitForTimeout(300);
    console.log('after H, subject:', await pg3.evaluate(() => [...document.querySelectorAll('[data-ivsub]')].map(b => b.dataset.ivsub + (b.getAttribute('aria-pressed') === 'true' ? '*' : '')).join(' ')));
    await pg3.click('[data-ivtier="K"]'); await pg3.waitForTimeout(300);
    await pg3.click('[data-ivmode="cup"]'); await pg3.waitForTimeout(300);
  }
  await pg3.screenshot({ path: '/tmp/claude-0/-home-claude/f1d53d1f-4d59-5811-9613-91c4d8e7bcb5/scratchpad/iv-host.png', fullPage: true });
  // GCSE solo picker still default H w/o KS3 after switching
  console.log('errors', errs);
  await b.close(); srv.close();
})();
