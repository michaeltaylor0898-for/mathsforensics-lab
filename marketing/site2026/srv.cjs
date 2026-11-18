// serves the Incident Room with local copies of its Google fonts, for screenshots
const http = require('http'), fs = require('fs'), path = require('path');
const FD = '/tmp/claude-0/-home-claude/f1d53d1f-4d59-5811-9613-91c4d8e7bcb5/scratchpad/fonts/node_modules/@fontsource';
const face = (fam, dir, w) => `@font-face{font-family:'${fam}';font-weight:${w};font-style:normal;src:url(/fonts/${dir}/files/${dir}-latin-${w}-normal.woff2) format('woff2')}`;
const CSS = [[ 'Josefin Sans','josefin-sans',[400,600,700]],['JetBrains Mono','jetbrains-mono',[400,500,700]],['Special Elite','special-elite',[400]],['Unbounded','unbounded',[600,800]]]
  .flatMap(([f,d,ws]) => ws.map(w => face(f,d,w))).join('\n');
module.exports = { CSS, start(port) {
  return http.createServer((req, res) => {
    const u = decodeURIComponent(req.url.split('?')[0]);
    if (u.startsWith('/fonts/')) { const f = path.join(FD, u.slice(7)); return fs.readFile(f, (e, d) => { if (e) { res.writeHead(404); return res.end(); } res.writeHead(200, { 'content-type': 'font/woff2' }); res.end(d); }); }
    if (u === '/gfonts.css') { res.writeHead(200, { 'content-type': 'text/css' }); return res.end(CSS); }
    let f = path.join('/home/claude/mathsforensics-lab/site', u); if (u.endsWith('/')) f += 'index.html';
    fs.readFile(f, (e, d) => { if (e) { res.writeHead(404); return res.end(); } res.writeHead(200, { 'content-type': f.endsWith('.html') ? 'text/html' : 'application/octet-stream' }); res.end(d); });
  }).listen(port);
} };
