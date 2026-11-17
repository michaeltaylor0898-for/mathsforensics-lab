const { chromium } = require('playwright'); const http = require('http'), fs = require('fs'), path = require('path');
const root = '/home/claude/mathsforensics-lab/site', SP = '/tmp/claude-0/-home-claude/f1d53d1f-4d59-5811-9613-91c4d8e7bcb5/scratchpad/';
const srv = http.createServer((req, res) => { let p = path.join(root, decodeURIComponent(req.url.split('?')[0])); if (p.endsWith('/')) p += 'index.html'; fs.readFile(p, (e, d) => { if (e) { res.writeHead(404); return res.end(); } res.writeHead(200, { 'content-type': 'text/html' }); res.end(d); }); }).listen(8769);
const U = 'http://localhost:8769';
(async () => { const b = await chromium.launch(); const errs = [];
  const ctx = await b.newContext({ viewport: { width: 1024, height: 800 } });
  await ctx.route(/cdn\.jsdelivr\.net\/npm\/@supabase/, r => r.fulfill({ contentType: 'application/javascript', body: fs.readFileSync(SP + 'sbjs/package/dist/umd/supabase.js') }));
  await ctx.route(/supabase\.co/, r => r.abort());
  const np = async () => { const p = await ctx.newPage(); p.on('pageerror', e => errs.push(p.url() + ' ' + e.message)); return p; };
  // 1 academy header link on phone
  const ph = await b.newPage({ viewport: { width: 390, height: 800 } }); ph.on('pageerror', e => errs.push('ph ' + e.message));
  await ph.goto(U + '/academy/#path'); await ph.waitForTimeout(700);
  const inp = ph.locator('input').first(); if (await inp.isVisible().catch(() => false) && !(await ph.locator('#irCode').count())) { await inp.fill('Sam'); await ph.keyboard.press('Enter'); await ph.waitForTimeout(500); }
  await ph.screenshot({ path: SP + 'acad-header-phone.png' }); console.log('phone scrollW', await ph.evaluate(() => document.documentElement.scrollWidth));
  // 2 games home
  const g = await np(); await g.goto(U + '/academy/games.html'); await g.waitForTimeout(2000);
  console.log('home:', (await g.innerText('#app')).slice(0, 300).replace(/\n/g, ' | '));
  await g.screenshot({ path: SP + 'games-home.png', fullPage: true });
  await g.fill('#acCode', '123456'); await g.click('#acJoin button'); await g.waitForTimeout(800);
  console.log('join:', (await g.innerText('#app')).slice(0, 200).replace(/\n/g, ' | '));
  // 3 solo interrogation, penalty
  const s = await np(); await s.goto(U + '/academy/games.html?play=interrogation&sub=KD'); await s.waitForTimeout(1800);
  console.log('iv setup:', (await s.innerText('#app')).slice(0, 700).replace(/\n/g, ' | '));
  await s.click('#go'); for (let i = 0; i < 8 && !(await s.locator('.pu-opt').count()); i++) await s.waitForTimeout(700);
  const t0 = Date.now(); let wrongs = 0, shots = 0;
  for (let i = 0; i < 6; i++) { if (!(await s.locator('.pu-opt').count())) break;
    const a = await s.evaluate(() => window.IR.S.iv.R.q.a); const pick = (a + 1) % 4;
    await s.locator('.pu-opt').nth(pick).click(); wrongs++; await s.waitForTimeout(300);
    if (!shots++) await s.screenshot({ path: SP + 'iv-penalty.png' });
    const pen = await s.locator('.iv-pen').innerText().catch(() => 'none'); console.log('pen', pen.replace(/\n/g, ' '));
    for (let k = 0; k < 20 && await s.locator('.iv-pen').count(); k++) await s.waitForTimeout(250);
  }
  console.log('6 wrongs took', (Date.now() - t0) / 1000, 's');
  // 4 rapid solo
  const r = await np(); await r.goto(U + '/academy/games.html?play=rapid'); await r.waitForTimeout(1800);
  if (await r.locator('input').count()) { await r.locator('input').first().fill('Tess'); await r.click('button:has-text("Start")'); await r.waitForTimeout(700); }
  console.log('rr setup:', (await r.innerText('#app')).slice(0, 400).replace(/\n/g, ' | '));
  await r.screenshot({ path: SP + 'rr-acad.png', fullPage: true });
  // 5 host interrogation in academy
  const h = await np(); await h.goto(U + '/academy/games.html?host&game=interrogation'); await h.waitForTimeout(2000);
  console.log('host:', (await h.innerText('#app')).slice(0, 900).replace(/\n/g, ' | '));
  // 6 IR GCSE: no KS3
  const i = await np(); await i.goto(U + '/incident-room/?play=interrogation&ks3=1'); await i.waitForTimeout(2000);
  console.log('IR iv tiers:', await i.evaluate(() => [...document.querySelectorAll('[data-ivtier],[data-ivsub]')].map(b => b.textContent).join(',')));
  console.log('IR store keys:', await i.evaluate(() => Object.keys(localStorage).join(',')));
  console.log('errors', errs); await b.close(); srv.close(); })();
