const { chromium } = require('playwright'); const http = require('http'), fs = require('fs'), path = require('path');
const root = '/home/claude/mathsforensics-lab/site', SP = '/tmp/claude-0/-home-claude/f1d53d1f-4d59-5811-9613-91c4d8e7bcb5/scratchpad/';
const srv = http.createServer((req, res) => { let p = path.join(root, decodeURIComponent(req.url.split('?')[0])); if (p.endsWith('/')) p += 'index.html'; fs.readFile(p, (e, d) => { if (e) { res.writeHead(404); return res.end('404'); } res.writeHead(200, { 'content-type': 'text/html' }); res.end(d); }); }).listen(8770);
const U = 'http://localhost:8770';
(async () => { const b = await chromium.launch(); const errs = [];
  for (const [w, h, tag] of [[1280, 900, 'desk'], [390, 844, 'phone']]) {
    const pg = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: tag === 'desk' ? 1 : 2 }); pg.on('pageerror', e => errs.push(e.message));
    await pg.goto(U + '/'); await pg.waitForTimeout(600);
    await pg.screenshot({ path: SP + `hq-${tag}.png`, fullPage: true });
    console.log(tag, 'url', pg.url(), 'sw', await pg.evaluate(() => document.documentElement.scrollWidth));
  }
  const ctx = await b.newContext(); 
  await ctx.route(/cdn\.jsdelivr\.net\/npm\/@supabase/, r => r.fulfill({ contentType: 'application/javascript', body: fs.readFileSync(SP + 'sbjs/package/dist/umd/supabase.js') }));
  await ctx.route(/supabase\.co/, r => r.abort());
  const p = await ctx.newPage(); p.on('pageerror', e => errs.push('ctx ' + e.message));
  for (const u of ['/?token_hash=abc&type=signup', '/?return=academy', '/?next=incident-room', '/#access_token=x&type=recovery', '/?hq']) { await p.goto(U + u); await p.waitForTimeout(700); console.log(u, '->', p.url().replace(U, '')); }
  await p.goto(U + '/'); await p.click('[data-where="gcse"]'); await p.fill('#code', '654321'); await Promise.all([p.waitForURL(/incident-room/), p.click('#join .btn')]); console.log('gcse join ->', p.url().replace(U, ''));
  await p.goto(U + '/'); console.log('remembered', await p.getAttribute('[data-where="gcse"]', 'aria-pressed'));
  await p.click('[data-where="academy"]'); await p.fill('#code', '111222'); await Promise.all([p.waitForURL(/games/), p.click('#join .btn')]); console.log('ks3 join ->', p.url().replace(U, ''));
  await p.goto(U + '/'); await p.evaluate(() => localStorage.setItem('sb-duvxykqlrekqhfvsvnrj-auth-token', JSON.stringify({ access_token: 'a', refresh_token: 'r' }))); await p.goto(U + '/'); await p.waitForTimeout(700); console.log('signed in ->', p.url().replace(U, ''));
  await p.goto(U + '/?hq'); await p.waitForTimeout(500); console.log('signed in ?hq ->', p.url().replace(U, ''));
  await p.evaluate(() => localStorage.clear());
  await p.goto(U + '/lab/'); await p.waitForTimeout(2500); console.log('lab text:', (await p.innerText('body')).slice(0, 200).replace(/\n/g, ' | '));
  console.log('lab privacy link', await p.$$eval('a[href*="privacy"]', a => a.map(x => x.getAttribute('href'))));
  console.log('errors', errs); await b.close(); srv.close(); })();
