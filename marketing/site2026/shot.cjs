const { chromium } = require('playwright');
const page = process.argv[2], SP = '/tmp/claude-0/-home-claude/f1d53d1f-4d59-5811-9613-91c4d8e7bcb5/scratchpad/';
(async () => { const b = await chromium.launch(); const errs = [];
  for (const [w, tag] of [[1280, 'd'], [390, 'm']]) {
    const p = await b.newPage({ viewport: { width: w, height: 900 } }); p.on('pageerror', e => errs.push(e.message));
    await p.goto('file:///home/claude/mathsforensics-lab/marketing/site2026/out/preview.html#' + page); await p.waitForTimeout(300);
    const sw = await p.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.scrollHeight]);
    console.log(tag, 'scroll', sw);
    await p.screenshot({ path: SP + `site-${page}-${tag}.png`, fullPage: true });
  }
  console.log('errors', errs); await b.close(); })();
