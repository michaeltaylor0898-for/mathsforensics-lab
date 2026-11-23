const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const p = await b.newPage();
  for (const f of process.argv.slice(2)) { await p.goto('file://' + f); await p.waitForTimeout(300);
    const code = await p.title();
    await p.pdf({ path: f.replace(/\.html$/, '.pdf'), format: 'A4', printBackground: true, preferCSSPageSize: true, displayHeaderFooter: true, headerTemplate: '<span></span>',
      footerTemplate: `<div style="width:100%;margin:0 13mm;display:flex;justify-content:space-between;font-family:'DejaVu Sans Mono',monospace;font-size:7px;color:#5B6585;letter-spacing:.06em"><span>© Maths Forensics · mathsforensics.com · ${code}</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>` });
    console.log('pdf', f); }
  await b.close(); })();
