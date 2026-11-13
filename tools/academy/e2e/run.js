const { chromium } = require('playwright'); const fs = require('fs');
const FILE = '/home/claude/mathsforensics-lab/site/academy/index.html', URL = 'https://lab.mathsforensics.com/academy/';
(async () => { const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 1100, height: 900 } }); const pg = await ctx.newPage();
  const errs = []; pg.on('pageerror', e => errs.push(e.message)); pg.on('console', m => { if (m.type() === 'error' && !/ERR_|net::/.test(m.text())) errs.push(m.text()); });
  await ctx.route('**/*', r => { const u = r.request().url();
    if (u.includes('/__sb/')) return (async () => { const res = await fetch('http://127.0.0.1:5599' + u.slice(u.indexOf('/__sb/') + 5), { method: 'POST', body: r.request().postData() }); r.fulfill({ contentType: 'application/json', body: await res.text() }); })();
    if (u.startsWith(URL)) return r.fulfill({ contentType: 'text/html', body: fs.readFileSync(FILE, 'utf8') });
    if (/supabase-js/.test(u)) return r.fulfill({ contentType: 'application/javascript', body: fs.readFileSync('stub-supabase.js', 'utf8') });
    if (u.startsWith('http://127.0.0.1:5599')) return r.continue();
    return r.abort(); });
  const log = (...a) => console.log(...a); const txt = async s => (await pg.textContent(s)).replace(/\s+/g, ' ').trim();
  const go = async (hash = '') => { await pg.goto(URL + hash); await pg.reload(); await pg.waitForTimeout(900); };
  const shot = async n => pg.screenshot({ path: '../acc_' + n + '.png', fullPage: false });

  log('--- A. No account');
  await go(); log('welcome:', (await txt('h1')), '| sign-in link:', await pg.getAttribute('a.btn', 'href')); await shot('welcome');
  await pg.click('#trydev'); await pg.waitForTimeout(200); await pg.fill('#cadetname', 'Tablet'); await pg.press('#cadetname', 'Enter'); await pg.waitForTimeout(300);
  log('after name:', (await txt('#app')).slice(0,100));
  log('locked cards:', await pg.locator('.tcard.locked').count(), '| open Bronze cards:', await pg.locator('.topics').first().locator('.tcard:not(.locked)').count());
  await go('#t-rounding-learn'); log('locked topic:', (await txt('#app')).slice(0, 120));
  // practise a free topic on the device so there is something to import later
  await go('#t-place-value-learn'); for (const s of [['#tryin', '2'], ['mc', 0], ['#tryin', '425']]) { if (s[0] === 'mc') await pg.click('#tryone [data-mc="0"]'); else { await pg.fill(s[0], s[1]); await pg.press(s[0], 'Enter'); } await pg.waitForTimeout(80); }
  log('device store has progress:', await pg.evaluate(() => !!JSON.parse(localStorage.getItem('mfa.v1')).topics['place-value'].learned));

  log('--- B. Parent');
  await pg.evaluate(() => localStorage.setItem('test-uid', '00000000-0000-0000-0000-0000000000a1')); await go('#path');
  log('parent app:', await pg.evaluate(() => JSON.stringify({role: ACC.me && ACC.me.role, acc: ACC.access, on: ACC.on, spare: ACC.me && ACC.me.spare_passes, prog: Object.entries(STORE.topics).filter(([k,p]) => p.learned||p.practised||p.secured).map(x=>x[0]), imp: importOffer, err: ACC.err, tu: localStorage.getItem('test-uid'), sbx: !!window.supabase})), errs);
  log('prompt shown:', await txt('#app section.panel .h3'));
  await pg.click('a[href="#add-child"]'); await pg.waitForTimeout(200); log('becomes-parent notice:', await pg.locator('text=This becomes a parent account').count()); await shot('addchild');
  await pg.fill('#kname', 'Sam'); await pg.selectOption('#kyear', '7'); await pg.fill('#kpin', '1234'); await pg.click('#kidform button[type=submit]'); await pg.waitForTimeout(800);
  log('children screen:', await txt('h1'), '| Sam chip:', await txt('.tcard .chip')); await shot('children');
  await pg.click('[data-open]'); await pg.fill('[data-pin] input', '9999'); await pg.press('[data-pin] input', 'Enter'); await pg.waitForTimeout(500);
  log('wrong PIN:', await txt('[data-pinmsg]'));
  await pg.fill('[data-pin] input', '1234'); await pg.press('[data-pin] input', 'Enter'); await pg.waitForTimeout(800);
  log('header:', await txt('#cadet'), '| import banner:', await pg.locator('#importbox').count(), '| locked:', await pg.locator('.tcard.locked').count()); await shot('path_import');
  await pg.click('#impyes'); await pg.waitForTimeout(800);
  log('after import: banner', await pg.locator('#importbox').count(), '| place value chip:', await txt('a.tcard[href="#t-place-value-learn"] .chip'), '| device cleared:', await pg.evaluate(() => localStorage.getItem('mfa.v1') === null));
  // learn rounding as Sam, then check it reached the database
  await go('#t-rounding-learn'); await pg.fill('#tryin', '3700'); await pg.press('#tryin', 'Enter'); await pg.waitForTimeout(80); await pg.fill('#tryin', '4'); await pg.press('#tryin', 'Enter'); await pg.waitForTimeout(80); await pg.fill('#tryin', '3700'); await pg.press('#tryin', 'Enter'); await pg.waitForTimeout(1200);
  await go('#path'); log('after reload, rounding chip:', await txt('a.tcard[href="#t-rounding-learn"] .chip'), '| still Sam:', await txt('#cadet b'));
  await pg.click('text=Switch child'); await pg.waitForTimeout(500); log('switch ->', await txt('h1'));
  await pg.click('text=Add a child'); await pg.fill('#kname', 'Mia'); await pg.selectOption('#kyear', '9'); await pg.click('#kidform button[type=submit]'); await pg.waitForTimeout(800);
  log('Mia chip:', (await pg.locator('.tcard').nth(1).locator('.chip').textContent()));
  await pg.locator('[data-open]').nth(1).click(); await pg.waitForTimeout(800); log('Mia locked cards:', await pg.locator('.tcard.locked').count(), '| import banner (should be 0):', await pg.locator('#importbox').count());
  await go('#t-rounding-learn'); log('Mia locked panel:', (await txt('#app')).includes('Academy Passes go on sale soon'));

  log('--- C. School student');
  await pg.evaluate(() => { localStorage.setItem('test-uid', '00000000-0000-0000-0000-0000000000c1'); sessionStorage.clear(); }); await go('#path');
  log('header:', await txt('#cadet'), '| locked:', await pg.locator('.tcard.locked').count(), '| parent prompt:', await pg.locator('text=Setting this up for your child?').count());
  log('--- D. Parent signs out'); await pg.evaluate(() => localStorage.setItem('test-uid', '00000000-0000-0000-0000-0000000000a1')); await go('#children');
  await pg.click('#signout'); await pg.waitForTimeout(800); log('after sign out:', await txt('h1'));
  log('errors:', errs); await b.close(); })();
