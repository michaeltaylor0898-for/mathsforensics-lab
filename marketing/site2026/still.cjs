const { chromium } = require('playwright'); const S = require('./srv.cjs');
const SP = '/tmp/claude-0/-home-claude/f1d53d1f-4d59-5811-9613-91c4d8e7bcb5/scratchpad/ir/stills/';
require('fs').mkdirSync(SP, { recursive: true });
const C = s => `(document.querySelector('${s}')||{click(){}}).click()`;
const SHOTS = {
  vault: ['?play=vault', ["document.getElementById('pvSolo').click()", "1"]],
  harbour: ['?play=harbour', ["document.getElementById('hwSolo').click()", "document.getElementById('hwShuffle').click()", "document.getElementById('hwGoBattle').click()", "1"]],
  identikit: ['', [C('[data-iksolo]'), C('#go'), "1", "(()=>{const o=document.querySelectorAll('.pu-opt');o[0]&&o[0].click()})()", "1"]],
  home: ['', ["1"]],
};
(async () => { const srv = S.start(8899); const b = await chromium.launch();
  for (const [name, [q, steps]] of Object.entries(SHOTS)) {
    if (process.argv[2] && process.argv[2] !== name) continue;
    const ctx = await b.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1.5 });
    await ctx.route(/fonts\.googleapis\.com/, r => r.fulfill({ contentType: 'text/css', body: S.CSS.replace(/url\(\//g, 'url(http://localhost:8899/') }));
    await ctx.route(/supabase\.co|jsdelivr/, r => r.abort());
    const p = await ctx.newPage(); p.on('pageerror', e => console.log(name, 'ERR', e.message));
    await p.goto('http://localhost:8899/incident-room/' + q); await p.waitForTimeout(1500);
    for (const s of steps) { await p.evaluate(s).catch(e => console.log(name, e.message.slice(0, 80))); await p.waitForTimeout(1200); }
    await p.screenshot({ path: SP + name + '.png' });
    console.log(name, (await p.innerText('#app')).slice(0, 160).replace(/\n+/g, ' | '));
    await ctx.close();
  }
  await b.close(); srv.close(); })();
