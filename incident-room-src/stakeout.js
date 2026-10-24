/* ================= STAKEOUT: live class game =================
   The board shows the city map and the surveillance reports, one at a time.
   Students cross off points, draw lines and make ONE arrest per case on their tablet:
   earlier arrests score more, a wrong arrest scores nothing. After each case the board
   shows where everyone arrested, so mix-ups like swapping x and y are visible at once. */
const SO_COL = ["#FFC857", "#00FCF1", "#FF8FB1"];
const SO_U = 40, SO_M = 34, SO_W = SO_M * 2 + SO.R * 2 * SO_U;
const soKey = (x, y) => x + "," + y;
const soXY = (x, y) => [SO_M + (x + SO.R) * SO_U, SO_M + (SO.R - y) * SO_U];
let soClipN = 0;
const SO_TIME = { 20: "20 s", 30: "30 s", 45: "45 s", 60: "60 s" };

/* a line A x + B y = C drawn right across the map (clipped to the grid) */
function soSeg(L) {
  const E = SO.R + 0.7;
  let a, b;
  if (L.B === 0) { const x = L.C / L.A; a = [x, -E]; b = [x, E]; }
  else { const f = x => (L.C - L.A * x) / L.B; a = [-E, f(-E)]; b = [E, f(E)];
    if (Math.abs(L.A / L.B) > 1) { const g = y => (L.C - L.B * y) / L.A; a = [g(-E), -E]; b = [g(E), E]; } }
  const [x1, y1] = soXY(...a), [x2, y2] = soXY(...b);
  return `x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"`;
}
const soLineOf = (p, q) => ({ A: q[1] - p[1], B: -(q[0] - p[0]), C: (q[1] - p[1]) * p[0] - (q[0] - p[0]) * p[1] });
const soOn = (L, x, y) => L.A * x + L.B * y === L.C;
const SUSPECT = `<g fill="#0B122C"><circle cy="-2.5" r="3.6"/><path d="M-7.6 10C-7.6 4.2-4.4 1.8 0 1.8S7.6 4.2 7.6 10z"/><rect x="-6.8" y="-6.6" width="13.6" height="1.8" rx=".9"/><path d="M-3.8-6.4l.8-4.6h6l.8 4.6z"/></g>`;

/* the map. o = { pad (crossed, lines, pending, confirm, arrested), rev (case reveal), dots (class arrests), big } */
function soGridSvg(o = {}) {
  const pad = o.pad || { crossed: new Set(), lines: [] }, rev = o.rev, R = SO.R;
  const clip = "soclip" + (++soClipN);
  let g = `<defs><clipPath id="${clip}"><rect x="${SO_M - 14}" y="${SO_M - 14}" width="${SO_W - 2 * SO_M + 28}" height="${SO_W - 2 * SO_M + 28}"/></clipPath></defs>`;
  g += `<rect x="${SO_M - 14}" y="${SO_M - 14}" width="${SO_W - 2 * SO_M + 28}" height="${SO_W - 2 * SO_M + 28}" rx="8" class="so-bg"/>`;
  for (let i = -R; i <= R; i++) {
    const [x] = soXY(i, 0), [, y] = soXY(0, i);
    g += `<line class="so-gl" x1="${x}" y1="${SO_M}" x2="${x}" y2="${SO_W - SO_M}"/><line class="so-gl" x1="${SO_M}" y1="${y}" x2="${SO_W - SO_M}" y2="${y}"/>`;
  }
  const [ox, oy] = soXY(0, 0);
  g += `<line class="so-ax" x1="${SO_M - 12}" y1="${oy}" x2="${SO_W - SO_M + 12}" y2="${oy}"/><line class="so-ax" x1="${ox}" y1="${SO_M - 12}" x2="${ox}" y2="${SO_W - SO_M + 12}"/>`;
  g += `<text class="so-axl" x="${SO_W - SO_M + 16}" y="${oy + 5}">x</text><text class="so-axl" x="${ox - 4}" y="${SO_M - 18}">y</text>`;
  for (let i = -R; i <= R; i++) {
    if (!i) continue;
    const [x] = soXY(i, 0), [, y] = soXY(0, i);
    g += `<text class="so-n" x="${x}" y="${oy + 17}" text-anchor="middle">${SO.num(i)}</text><text class="so-n" x="${ox - 7}" y="${y + 4.5}" text-anchor="end">${SO.num(i)}</text>`;
  }
  g += `<text class="so-n" x="${ox - 7}" y="${oy + 17}" text-anchor="end">0</text>`;
  /* lines: the reports' lines after the reveal, then the student's own */
  g += `<g clip-path="url(#${clip})">`;
  if (rev) rev.lines.forEach(l => { if (l) g += `<line class="so-rl" stroke="${SO_COL[l.k]}" ${soSeg(l.L)}/>`; });
  (pad.lines || []).forEach((l, i) => { g += `<line class="so-ml" ${soSeg(soLineOf(l.a, l.b))}/>`; });
  g += `</g>`;
  /* points */
  g += `<g class="so-pts">`;
  SO.POINTS.forEach(([x, y]) => {
    const [cx, cy] = soXY(x, y), k = soKey(x, y);
    g += `<g class="sp${pad.crossed.has(k) ? " x" : ""}" data-k="${k}" transform="translate(${cx},${cy})"><circle r="4.2"/><path class="xx" d="M-6-6L6 6M6-6L-6 6"/></g>`;
  });
  g += `</g>`;
  if (pad.pending) { const [cx, cy] = soXY(...pad.pending); g += `<circle class="so-pend" cx="${cx}" cy="${cy}" r="10"/>`; }
  if (rev) { const [cx, cy] = soXY(...rev.p); g += `<g class="so-sus" transform="translate(${cx},${cy})"><circle class="ring" r="20"/><circle r="13"/>${SUSPECT}</g>`; }
  /* class arrests on the board */
  if (o.dots) Object.entries(o.dots).forEach(([k, n]) => {
    const [x, y] = k.split(",").map(Number), [cx, cy] = soXY(x, y), right = rev && rev.p[0] === x && rev.p[1] === y;
    g += right ? `<g class="so-dot ok" transform="translate(${cx + 17},${cy - 17})"><circle r="${Math.min(16, 10 + n)}"/><text y="5" text-anchor="middle">${n}</text></g>`
      : `<g class="so-dot" transform="translate(${cx},${cy})"><circle r="${Math.min(19, 11 + n * 1.5)}"/><text y="5" text-anchor="middle">${n}</text></g>`;
  });
  const arr = pad.arrestPt || pad.confirm;
  if (arr) { const [cx, cy] = soXY(...arr), ok = rev ? (rev.p[0] === arr[0] && rev.p[1] === arr[1]) : null;
    g += `<g class="so-arr${ok === true ? " ok" : ok === false ? " no" : ""}" transform="translate(${cx},${cy})"><circle r="14"/><path d="M0-20v9M0 11v9M-20 0h9M11 0h9"/></g>`; }
  return `<svg class="so-grid${o.big ? " big" : ""}" viewBox="0 0 ${SO_W} ${SO_W}" role="img" aria-label="Coordinate grid from ${SO.num(-R)} to ${R}">${g}</svg>`;
}

/* ---------- the student's tools: cross off, draw a line, arrest ---------- */
const soFreshPad = (practice = false) => ({ crossed: new Set(), lines: [], tool: "cross", pending: null, confirm: null, arrested: false, arrestPt: null, undo: [], practice });
const soSnap = pad => { pad.undo.push({ c: [...pad.crossed], l: pad.lines.map(l => ({ ...l })) }); if (pad.undo.length > 40) pad.undo.shift(); };
/* pointer position in grid units */
function soGridPos(svg, ev) {
  const m = svg.getScreenCTM && svg.getScreenCTM(); if (!m) return null;
  const p = svg.createSVGPoint(); p.x = ev.clientX; p.y = ev.clientY;
  const q = p.matrixTransform(m.inverse());
  return [(q.x - SO_M) / SO_U - SO.R, SO.R - (q.y - SO_M) / SO_U];
}
const soSnapPt = (g, maxD) => { if (!g) return null; const [gx, gy] = g, x = Math.round(gx), y = Math.round(gy);
  return Math.abs(x) > SO.R || Math.abs(y) > SO.R || Math.hypot(gx - x, gy - y) > maxD ? null : [x, y]; };
function soNearest(svg, ev, maxD) {
  const g = soGridPos(svg, ev); if (!g) return null;
  const [gx, gy] = g, x = Math.round(gx), y = Math.round(gy);
  if (Math.abs(x) > SO.R || Math.abs(y) > SO.R || Math.hypot(gx - x, gy - y) > maxD) return null;
  return [x, y];
}
function soMountPad(pad, onArrest) {
  const wrap = document.getElementById("soGrid"); if (!wrap) return;
  wrap.innerHTML = soGridSvg({ pad });
  const svg = wrap.querySelector("svg");
  let drag = null;
  const mark = (pt) => {
    const k = soKey(...pt); if (drag.done.has(k)) return; drag.done.add(k);
    if (drag.mode) pad.crossed.add(k); else pad.crossed.delete(k);
    const el = svg.querySelector(`[data-k="${k}"]`); if (el) el.classList.toggle("x", drag.mode);
  };
  svg.addEventListener("pointerdown", ev => {
    const pt = soNearest(svg, ev, 0.48); if (!pt) return;
    ev.preventDefault();
    if (pad.tool === "cross") {
      soSnap(pad);
      drag = { mode: !pad.crossed.has(soKey(...pt)), done: new Set(), id: ev.pointerId, last: soGridPos(svg, ev) };
      try { svg.setPointerCapture(ev.pointerId); } catch (e) {}
      mark(pt);
    } else if (pad.tool === "line") {
      if (!pad.pending) pad.pending = pt;
      else if (pad.pending[0] === pt[0] && pad.pending[1] === pt[1]) pad.pending = null;
      else { soSnap(pad); pad.lines.push({ a: pad.pending, b: pt }); if (pad.lines.length > 3) pad.lines.shift(); pad.pending = null; Sound.play("tap"); }
      soMountPad(pad, onArrest); soTools(pad, onArrest);
    } else if (pad.tool === "arrest" && !pad.arrested) {
      pad.confirm = pt; Sound.play("tap");
      soMountPad(pad, onArrest); soTools(pad, onArrest);
    }
  });
  svg.addEventListener("pointermove", ev => {
    if (!drag || ev.pointerId !== drag.id) return;
    /* follow the whole path since the last event, so a quick swipe doesn't skip points */
    const g = soGridPos(svg, ev); if (!g) return;
    const [x0, y0] = drag.last || g, steps = Math.max(1, Math.ceil(Math.hypot(g[0] - x0, g[1] - y0) / 0.15));
    for (let i = 1; i <= steps; i++) { const pt = soSnapPt([x0 + (g[0] - x0) * i / steps, y0 + (g[1] - y0) * i / steps], 0.42); if (pt) mark(pt); }
    drag.last = g;
  });
  const end = () => { if (drag) { drag = null; soTools(pad, onArrest); } };
  svg.addEventListener("pointerup", end); svg.addEventListener("pointercancel", end); svg.addEventListener("lostpointercapture", end);
}
function soTools(pad, onArrest) {
  const el = document.getElementById("soTools"); if (!el) return;
  const hint = pad.arrested ? "" : pad.tool === "cross" ? "Tap or drag across points to cross off places the suspect can't be. Drag over crossed points to bring them back."
    : pad.tool === "line" ? (pad.pending ? `Now tap a second point to draw a line through ${SO.pt(...pad.pending)}.` : "Tap two points to draw a straight line through them.")
    : "Tap the point where you think the suspect is hiding.";
  el.innerHTML = `
    ${pad.arrested ? `<div class="so-done">${pad.practice ? "Practice arrest" : "Arrest made"}${pad.arrestPt ? ` at <b>${SO.pt(...pad.arrestPt)}</b>` : ""}. ${pad.practice ? "In the game you get one arrest warrant per case." : "One warrant per case: wait for the reveal. You can keep working on the map."}</div>` : ""}
    ${pad.confirm && !pad.arrested ? `<div class="so-confirm"><span>Arrest the suspect at <b>${SO.pt(...pad.confirm)}</b>?</span><div class="row"><button class="btn primary" data-so="confirm">Confirm arrest</button><button class="btn quiet" data-so="cancel">Cancel</button></div></div>` : ""}
    <div class="so-toolrow">
      <div class="choice">
        <button class="btn" data-sotool="cross" aria-pressed="${pad.tool === "cross"}"><span aria-hidden="true">✕</span> Cross off</button>
        <button class="btn" data-sotool="line" aria-pressed="${pad.tool === "line"}"><span aria-hidden="true">╱</span> Draw a line</button>
        <button class="btn${pad.arrested ? "" : " arrestbtn"}" data-sotool="arrest" aria-pressed="${pad.tool === "arrest"}" ${pad.arrested ? "disabled" : ""}><span aria-hidden="true">◎</span> Arrest</button>
      </div>
      <div class="row"><button class="btn quiet" data-so="undo" ${pad.undo.length ? "" : "disabled"}>Undo</button><button class="btn quiet" data-so="clear">Clear map</button></div>
    </div>
    ${hint ? `<p class="muted small">${hint}</p>` : ""}
    ${pad.lines.length ? `<div class="so-lines">${pad.lines.map((l, i) => `<div class="so-line"><span>Your line through ${SO.pt(...l.a)} and ${SO.pt(...l.b)}</span>
      <button class="btn" data-so="keep" data-i="${i}">Cross off everything not on it</button><button class="btn quiet" data-so="rm" data-i="${i}" aria-label="Remove this line">✕</button></div>`).join("")}</div>` : ""}`;
  el.onclick = e => {
    const t = e.target.closest("[data-sotool], [data-so]"); if (!t || t.disabled) return;
    if (t.dataset.sotool) { pad.tool = t.dataset.sotool; pad.pending = null; if (pad.tool !== "arrest") pad.confirm = null; Sound.play("tap"); soMountPad(pad, onArrest); return soTools(pad, onArrest); }
    const a = t.dataset.so, i = +t.dataset.i;
    if (a === "undo") { const s = pad.undo.pop(); if (s) { pad.crossed = new Set(s.c); pad.lines = s.l; } }
    if (a === "clear") { soSnap(pad); pad.crossed.clear(); pad.lines = []; pad.pending = null; if (pad.practice) { pad.arrested = false; pad.arrestPt = null; } }
    if (a === "rm") { soSnap(pad); pad.lines.splice(i, 1); }
    if (a === "keep") { soSnap(pad); const L = soLineOf(pad.lines[i].a, pad.lines[i].b); SO.POINTS.forEach(([x, y]) => { if (!soOn(L, x, y)) pad.crossed.add(soKey(x, y)); }); Sound.play("tap"); }
    if (a === "cancel") pad.confirm = null;
    if (a === "confirm" && pad.confirm) { pad.arrested = true; pad.arrestPt = pad.confirm; pad.confirm = null; pad.tool = "cross"; Sound.play("arrest"); if (onArrest) onArrest(pad.arrestPt); }
    soMountPad(pad, onArrest); soTools(pad, onArrest);
  };
}
const soReports = (reps, k, big) => `<ol class="so-reps${big ? " so-big" : ""}">${reps.map((r, i) => `<li class="${i === k ? "now" : ""}" style="--c:${SO_COL[i]}"><span class="so-src">Report ${i + 1} · ${esc(r.src)}</span><span class="so-txt">${r.h}</span></li>`).join("")}
  ${reps.length < 3 ? Array.from({ length: 3 - reps.length }, (_, j) => `<li class="wait"><span class="so-src">Report ${reps.length + j + 1}</span><span class="so-txt muted">Waiting for surveillance…</span></li>`).join("") : ""}</ol>`;
const soSteps = rev => `<ol class="so-steps">${rev.steps.map((s, i) => `<li style="--c:${SO_COL[i]}"><span class="so-txt">${s.h}</span>${s.how ? `<span class="muted small">${esc(s.how)}</span>` : ""}
  <span class="small">${Array.isArray(s.left) ? (s.left.length === 1 ? `Only <b>${SO.pt(...s.left[0])}</b> is left: the suspect.` : `Still possible: ${s.left.map(p => SO.pt(...p)).join(", ")}`) : `Still possible: ${s.left} points`}</span></li>`).join("")}</ol>`;
const SO_RULES = `<ul class="so-rules"><li><b>3 surveillance reports</b> per case, one at a time.</li><li><b>Cross off</b> the points the suspect can't be, or <b>draw a line</b> to help.</li><li><b>One arrest per case.</b> The earlier you arrest, the more you score, but a wrong arrest scores nothing.</li></ul>`;

/* ================= HOST ================= */
function soHostSetup() {
  stopTimer(); S.pad = null;
  if (!liveConfigured()) return liveMissing(homeFn);
  if (gating() && !S.acc.signed_in) return signInToHost(homeFn);
  const cfg = Object.assign({ level: 1, n: 5, time: 30 }, store.get("ir-so", {}));
  const draw = (keep = false) => {
    set(`${brand("Stakeout · teacher")}
      ${gameSwitch("so")}
      <section class="panel"><span class="eyebrow">New game</span><h2>Stakeout</h2>
        <p class="muted">Find the hidden suspect on a coordinate grid. Students join at <b>${JOIN_URL}</b> with the game code. Each case has 3 surveillance reports; students cross off points, draw lines and make one arrest. After each case the board shows where everyone arrested, so you can see mistakes like swapped coordinates straight away.</p>
        <span class="eyebrow">Straight-line graphs</span>${choice("lv", cfg.level, [[1, "Level 1: y = mx + c"], [2, "Level 2: rearranging, two points, parallel"], [3, "Level 3 (Higher): fractions, perpendicular"]])}
        <p class="muted small">${esc(SO.LEVELS[cfg.level])}. Grid from ${SO.num(-SO.R)} to ${SO.R}.</p>
        <span class="eyebrow">Number of cases</span>${choice("n", cfg.n, [[3, "3"], [5, "5"], [8, "8"]])}
        <span class="eyebrow">Time per report</span>${choice("t", cfg.time, Object.entries(SO_TIME))}
        <div class="row"><button class="btn primary big" id="go">Open the game</button><button class="btn" id="back">Back</button>${soundBtns(true)}</div>
      </section>`, true, keep);
    bindGameSwitch();
    bindChoice("lv", v => { cfg.level = +v; draw(true); });
    bindChoice("n", v => { cfg.n = +v; draw(true); });
    bindChoice("t", v => { cfg.time = +v; draw(true); });
    document.getElementById("back").onclick = homeFn;
    document.getElementById("go").onclick = () => { store.set("ir-so", cfg); Sound.unlock(); claimGame("host", () => soHostStart(cfg), soHostSetup); };
  };
  draw();
}
function soHostStart(cfg) {
  const code = String(100000 + Math.floor(Math.random() * 900000));
  const H = S.host = { game: "stakeout", code, cfg, round: 1, phase: "lobby", ci: -1, k: 0, cases: [], players: {}, online: new Set(), kicked: new Set(), arrests: {}, left: 0, total: cfg.time, stats: [], status: "connecting" };
  soNewRound(H);
  const ch = sb().channel("ir-" + code, { config: { broadcast: { self: false }, presence: { key: "host" } } });
  H.ch = ch;
  ch.on("broadcast", { event: "hello" }, ({ payload }) => { addPlayer(payload); soPush(); if (H.phase === "lobby") soDrawHost(); })
    .on("broadcast", { event: "arrest" }, ({ payload }) => soOnArrest(payload))
    .on("presence", { event: "sync" }, () => {
      const st = ch.presenceState();
      H.online = new Set(Object.keys(st).filter(k => k !== "host"));
      Object.keys(st).forEach(k => { if (k !== "host" && st[k][0]) addPlayer(st[k][0]); });
      if (H.phase === "lobby") soDrawHost(); else soLiveUI();
    })
    .subscribe(status => {
      if (status === "SUBSCRIBED") { H.status = "live"; ch.track({ role: "host" }); soPush(); }
      else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") H.status = "error";
      else if (status === "CLOSED") H.status = "closed";
      if (H.phase === "lobby") soDrawHost();
    });
  H.beat = setInterval(soPush, 3000);
  armGuard(() => { hostClose(); homeFn(); }, "Leaving ends the game for every student.");
  Sound.startMusic();
  soDrawHost();
}
function soNewRound(H) {
  H.cases = SO.makeCases(H.cfg.n, H.cfg.level);
  H.ci = -1; H.k = 0; H.stats = []; H.phase = "lobby"; H.arrests = {};
  Object.values(H.players).forEach(p => Object.assign(p, { score: 0, correct: 0, wrong: 0, streak: 0, best: 0, last: 0, ok: false, prevRank: 0 }));
}
const soCase = H => H.cases[H.ci];
function soReveal(cs) {
  return { p: cs.p, lines: cs.clues.map((c, k) => (c.L ? { k, L: c.L } : null)),
    steps: cs.clues.map(c => ({ h: c.h, how: c.how, left: c.left.length <= 8 ? c.left : c.left.length })) };
}
function soPush() {
  const H = S.host; if (!H || !H.ch || H.status !== "live" || H.game !== "stakeout") return;
  const cs = H.ci >= 0 && H.ci < H.cases.length ? soCase(H) : null;
  const payload = { game: "stakeout", phase: H.phase, round: H.round, ci: H.ci, n: H.cases.length, k: H.k, level: H.cfg.level,
    reps: cs && H.phase !== "lobby" ? cs.clues.slice(0, H.phase === "report" ? H.k + 1 : 3).map(c => ({ src: c.src, h: c.h })) : [],
    left: H.left, total: H.total, closing: !!H.closing, kicked: [...H.kicked], code: H.code, done: Object.keys(H.arrests) };
  if (cs && H.phase === "reveal") payload.rev = soReveal(cs);
  if (H.phase === "reveal" || H.phase === "standings" || H.phase === "end") {
    const rk = ranking(), scores = {};
    rk.forEach((p, k) => { scores[p.id] = { score: p.score, rank: k + 1, of: rk.length, last: p.last, ok: p.ok, correct: p.correct, wrong: p.wrong, streak: p.streak, best: p.best,
      gap: k > 0 ? rk[k - 1].score - p.score : 0, above: k > 0 ? rk[k - 1].name : "", arrest: p.arrest || null, diag: p.diag || "", when: p.when || 0 }; });
    payload.scores = scores;
  }
  H.ch.send({ type: "broadcast", event: "state", payload });
}
function soNextCase() {
  const H = S.host;
  H.ci += 1;
  if (H.ci >= H.cases.length) return soHostEnd();
  H.k = 0; H.arrests = {}; H.closing = false; H.finalize = false;
  H.phase = "report"; H.total = H.cfg.time; H.left = H.total;
  Sound.startMusic(); Sound.play("radio");
  soDrawHost(); soPush(); soTick();
}
function soTick() {
  const H = S.host; stopTimer();
  tick = setInterval(() => {
    H.left = Math.max(0, H.left - 1);
    soLiveUI();
    if (H.left <= 5 && H.left > 0) Sound.play("tick");
    if (H.left % 5 === 0 || H.closing) soPush();
    if (H.left === 0) { if (H.finalize || H.k >= 2) soHostReveal(); else soNextReport(); }
  }, 1000);
}
function soNextReport() {
  const H = S.host; if (!H || H.phase !== "report" || H.k >= 2) return;
  H.k += 1; H.left = H.total; H.closing = false;
  Sound.play("radio");
  soDrawHost(); soPush(); soTick();
}
function soOnArrest(p) {
  const H = S.host;
  if (!H || H.phase !== "report" || !p || p.ci !== H.ci || p.round !== H.round || H.kicked.has(p.id) || H.arrests[p.id] || !Array.isArray(p.pt)) return;
  const x = +p.pt[0], y = +p.pt[1];
  if (!Number.isInteger(x) || !Number.isInteger(y) || Math.abs(x) > SO.R || Math.abs(y) > SO.R) return;
  addPlayer(p);
  H.arrests[p.id] = { pt: [x, y], k: H.k, left: H.left, total: H.total };
  Sound.play("join");
  soLiveUI(); soPush();
  const online = [...H.online].filter(id => H.players[id]);
  if (online.length && online.every(id => H.arrests[id])) {
    H.finalize = true;
    if (!H.closing) { H.closing = true; H.left = Math.min(H.left, 3); soLiveUI(); soPush(); }
  }
}
function soHostReveal() {
  const H = S.host; stopTimer();
  if (!H || H.phase !== "report") return;
  const cs = soCase(H);
  const prev = {}; if (H.ci > 0) ranking().forEach((p, k) => { prev[p.id] = k + 1; });
  const dots = {}, tags = {}, failed = [0, 0, 0], wrongPts = {};
  let right = 0, arrested = 0;
  Object.values(H.players).forEach(p => {
    const a = H.arrests[p.id];
    p.prevRank = prev[p.id]; p.last = 0; p.ok = false; p.arrest = a ? a.pt : null; p.diag = ""; p.when = a ? a.k + 1 : 0;
    if (a) {
      arrested += 1;
      const k = soKey(...a.pt); dots[k] = (dots[k] || 0) + 1;
      const d = SO.diagnose(cs, ...a.pt);
      if (d.tag === "right") {
        p.ok = true; right += 1; p.correct += 1; p.streak += 1; p.best = Math.max(p.best, p.streak);
        p.last = SO.arrestPoints(a.k, a.left, a.total);
      } else {
        p.wrong += 1; p.streak = 0; p.diag = d.text;
        tags[d.tag] = (tags[d.tag] || 0) + 1; d.failed.forEach(f => { failed[f] += 1; }); wrongPts[k] = (wrongPts[k] || 0) + 1;
      }
    } else { p.wrong += 1; p.streak = 0; }
    p.score += p.last;
  });
  const common = Object.entries(wrongPts).sort((a, b) => b[1] - a[1])[0] || null;
  H.stats.push({ ci: H.ci, right, arrested, of: Object.keys(H.players).length, dots, tags, failed, common });
  H.phase = "reveal";
  Sound.play("reveal");
  soPush(); soDrawHost();
}
function soLiveUI() {
  const H = S.host; if (!H || H.phase !== "report") return;
  timerUI(H.left, H.total);
  const t = document.getElementById("tleft"); if (t) t.textContent = H.left;
  const a = document.getElementById("acount"); if (a) a.textContent = Object.keys(H.arrests).length;
  const n = document.getElementById("pcount"); if (n) n.textContent = Object.keys(H.players).length;
  const c = document.getElementById("closing"); if (c) c.hidden = !H.closing;
  const cu = document.getElementById("custody");
  if (cu) cu.innerHTML = Object.keys(H.arrests).map(id => H.players[id]).filter(Boolean).map(p => `<span class="cu">${avatarSvg(p.avatar, "xs")}${esc(p.name)}</span>`).join("") || `<span class="muted small">No arrests yet.</span>`;
}
function soHostEnd() {
  const H = S.host; stopTimer();
  H.phase = "end"; Sound.stopMusic();
  soPush(); soDrawHost();
}
const SO_TAG_TIP = {
  swap: "Coordinates are (x, y): across first, then up or down.",
  sign: "Check the signs: left of the y-axis means a negative x, below the x-axis a negative y.",
  offline: "Plot two points from the equation and check the arrest is on the line.",
  area: "Re-read the location report: quadrant, odd or even, at least or at most.",
  other: "Work through the reports in order and cross off as you go."
};
function soTagList(tags) {
  const list = Object.entries(tags).sort((a, b) => b[1] - a[1]);
  return list.length ? `<ul class="so-tags">${list.map(([t, n]) => `<li><b>${n}</b> ${esc(SO.TAG_LABEL[t] || t)}<span class="muted small"> · ${esc(SO_TAG_TIP[t] || "")}</span></li>`).join("")}</ul>` : "";
}
function soDrawHost() {
  const H = S.host; if (!H) return;
  const players = Object.values(H.players);
  const statusText = H.status === "live" ? "Connected" : H.status === "error" ? "Connection problem" : H.status === "closed" ? "Disconnected" : "Connecting…";
  const hud = sub => `<div class="hud">${brand(sub)}<span class="stat${H.status === "error" ? " no" : ""}">${statusText}</span>${soundBtns(true)}</div>`;
  const codeBar = `<span class="stat">Join: <b>${JOIN_URL}</b> · code <b class="cy">${spaced(H.code)}</b></span>`;
  if (H.phase === "lobby") {
    set(`${hud(H.round > 1 ? "Stakeout · next round" : "Stakeout · teacher screen")}
      <section class="panel joinpanel">
        <div><span class="eyebrow">On your tablet go to</span><div class="joinurl">${JOIN_URL}</div></div>
        <div><span class="eyebrow">Game code</span><div class="bigcode">${spaced(H.code)}</div></div>
      </section>
      <section class="panel so-intro"><div><span class="eyebrow">Stakeout · ${H.cases.length} cases</span><h2>Find the hidden suspect</h2>${SO_RULES}</div>${soGridSvg({})}</section>
      <section class="panel">
        <div class="row spread"><h3>Detectives in the room · ${players.length}</h3>
          <div class="row"><button class="btn primary big" id="start" ${players.length ? "" : "disabled"}>Start the stakeout</button><button class="btn quiet" id="quit">Close game</button></div></div>
        ${players.length ? `<div class="teams">${players.map(p => `<div class="team">${avatarSvg(p.avatar, "sm")}<span class="tn grow">${esc(p.name)}</span><button class="kick" data-kick="${esc(p.id)}" aria-label="Remove ${esc(p.name)}">×</button></div>`).join("")}</div>`
          : `<p class="muted">Waiting for students to join… While they wait, they can practise with the tools on their tablet.</p>`}
        <p class="muted small">${esc(SO.LEVELS[H.cfg.level])} · ${H.cfg.time} s per report</p>
      </section>`, true);
    const st = document.getElementById("start"); if (st) st.onclick = soNextCase;
    app.querySelectorAll("[data-kick]").forEach(b => b.onclick = () => { H.kicked.add(b.dataset.kick); delete H.players[b.dataset.kick]; soPush(); soDrawHost(); });
    document.getElementById("quit").onclick = () => { hostClose(); homeFn(); };
    return;
  }
  const cs = H.ci >= 0 && H.ci < H.cases.length ? soCase(H) : null;
  if (H.phase === "report") {
    set(`${hud(`Case ${H.ci + 1} of ${H.cases.length}`)}
      <div class="row spread">${codeBar}<span class="stat">Arrests <b id="acount">0</b> / <span id="pcount">${players.length}</span></span></div>
      <div class="timer big" aria-hidden="true"><div class="timer-fill" style="width:100%"></div></div>
      <div class="so-board">
        <section class="panel so-map">${soGridSvg({ big: true })}</section>
        <section class="panel so-side">
          <div class="row spread"><span class="eyebrow">Surveillance reports</span><span class="stat secs"><span id="tleft">${H.left}</span>s</span></div>
          ${soReports(cs.clues.slice(0, H.k + 1), H.k, true)}
          <p class="muted small">Arrest after report ${H.k + 1}: up to ${SO.arrestPoints(H.k, H.total, H.total)} points.</p>
          <div><span class="eyebrow">Arrests made</span><div class="custody" id="custody"></div></div>
          <p class="closing" id="closing" ${H.closing ? "" : "hidden"}>Every detective has made an arrest. Revealing…</p>
          <div class="row">${H.k < 2 ? `<button class="btn primary" id="nextrep">Next report now</button>` : ""}<button class="btn${H.k < 2 ? "" : " primary"}" id="reveal">Reveal the suspect</button><button class="btn quiet" id="quit">End game</button></div>
        </section>
      </div>`, true);
    soLiveUI();
    const nr = document.getElementById("nextrep"); if (nr) nr.onclick = soNextReport;
    document.getElementById("reveal").onclick = soHostReveal;
    document.getElementById("quit").onclick = soHostEnd;
    return;
  }
  if (H.phase === "reveal") {
    const s = H.stats[H.stats.length - 1], rev = soReveal(cs);
    const swapN = s.tags.swap || 0;
    set(`${hud(`Case ${H.ci + 1} of ${H.cases.length} · reveal`)}
      <div class="row spread">${codeBar}<span class="stat"><b>${s.right}</b> of ${s.of} caught the suspect</span></div>
      <div class="so-board">
        <section class="panel so-map">${soGridSvg({ big: true, rev, dots: s.dots })}</section>
        <section class="panel so-side">
          <div class="result good"><span class="rhead">The suspect was at ${SO.pt(...cs.p)}</span>
            <p>${s.right} of ${s.of} caught them${s.of - s.arrested ? ` · ${s.of - s.arrested} made no arrest` : ""}.</p>
            ${s.common ? `<p>Most common wrong arrest: <span class="answer">${SO.pt(...s.common[0].split(",").map(Number))}</span> (${s.common[1]})${swapN && s.common[0] === soKey(cs.p[1], cs.p[0]) ? `: x and y swapped.` : ""}</p>` : ""}
            ${soTagList(s.tags)}</div>
          <span class="eyebrow">How to crack it</span>${soSteps(rev)}
          <div class="row"><button class="btn primary big" id="next">Show the standings</button><button class="btn quiet" id="quit">End game</button></div>
        </section>
      </div>`, true);
    document.getElementById("next").onclick = () => { H.phase = "standings"; Sound.play("standings"); soPush(); soDrawHost(); };
    document.getElementById("quit").onclick = soHostEnd;
    return;
  }
  if (H.phase === "standings") {
    set(`${hud(`Standings after case ${H.ci + 1}`)}
      <section class="panel"><h2>Top detectives</h2>${standingsRows(ranking(), 10)}
        <div class="row"><button class="btn primary big" id="next">${H.ci + 1 < H.cases.length ? "Next case" : "Final results"}</button><button class="btn quiet" id="quit">End game</button></div>
      </section>`, true);
    document.getElementById("next").onclick = soNextCase;
    document.getElementById("quit").onclick = soHostEnd;
    return;
  }
  /* end */
  const rk = ranking(), tags = {};
  H.stats.forEach(s => Object.entries(s.tags).forEach(([t, n]) => { tags[t] = (tags[t] || 0) + n; }));
  const failed = [0, 0, 0]; H.stats.forEach(s => s.failed.forEach((n, i) => { failed[i] += n; }));
  set(`${hud("Stakeout · final results")}<div class="tape"></div>
    ${rk.length ? ceremonyHtml(rk.slice(0, 3), "Case closed: the top detectives") : `<section class="panel"><h2>Game over</h2></section>`}
    ${rk.length > 3 ? `<section class="panel"><h3>The rest of the squad</h3>${standingsRows(rk.slice(3).map(p => ({ ...p, prevRank: 0 })), 7, false).replace(/<span class="pos">(\d+)<\/span>/g, (m, d) => `<span class="pos">${+d + 3}</span>`)}</section>` : ""}
    <section class="panel"><h3>Class case report</h3>
      <div class="bars">${H.stats.map(s => { const c = H.cases[s.ci]; const pct = s.of ? Math.round(100 * s.right / s.of) : 0;
        return `<div class="bar wide-label"><span>Case ${s.ci + 1}: suspect at ${SO.pt(...c.p)} · ${esc(c.clues.find(x => x.kind === "line").t.replace(/^The suspect is /, "").replace(/\.$/, ""))}</span><div class="track"><div class="fill" style="width:${pct}%"></div></div><span class="n">${pct}%</span></div>`; }).join("")}</div>
      ${Object.keys(tags).length ? `<div><span class="eyebrow">Patterns in the wrong arrests</span>${soTagList(tags)}</div>` : `<p class="good">No wrong arrests in the whole stakeout.</p>`}
      <details><summary class="eyebrow">Full results (teacher only)</summary>
        <div class="podium" style="margin-top:12px">${rk.map((p, k) => `<div class="place"><span class="pos">${k + 1}</span>${avatarSvg(p.avatar, "sm")}<span class="tn">${esc(p.name)}</span><span class="ts">✓${p.correct} ✗${p.wrong} · ${p.score}</span></div>`).join("")}</div>
      </details>
    </section>
    <section class="panel"><h3>What next?</h3>
      <div class="row"><button class="btn primary" id="again">Play again with the same players</button><button class="btn" id="new">New game</button><button class="btn" id="home">Back to Incident Room</button></div>
    </section>`, true);
  if (rk.length) runCeremony(rk.slice(0, 3));
  document.getElementById("again").onclick = () => { H.round += 1; soNewRound(H); Sound.startMusic(); soPush(); soDrawHost(); };
  document.getElementById("new").onclick = () => { hostClose(); soHostSetup(); };
  document.getElementById("home").onclick = () => { hostClose(); homeFn(); };
}

/* ================= STUDENT ================= */
function soStudentState(st) {
  const P = S.stu;
  if (st.round !== P.round) { P.round = st.round; P.hist = []; P.lastRank = 0; P.so = null; }
  P.state = st;
  const key = `${st.round}:${st.phase}:${st.ci}`;
  const mine = st.scores && st.scores[P.id];
  if (key === P.key) {
    if (st.phase === "report") {
      if (st.k !== P.soK) { P.soK = st.k; P.left = st.left; Sound.play("radio"); soStudentReports(st); }
      else P.left = Math.min(P.left, st.left);
      timerUI(P.left, st.total); const t = document.getElementById("tleft"); if (t) t.textContent = P.left;
      const c = document.getElementById("closing"); if (c) c.hidden = !st.closing;
    }
    return;
  }
  P.key = key;
  stopTimer();
  if (st.phase === "lobby") { if (!P.so || !P.so.practice) P.so = soFreshPad(true); }
  if (st.phase === "report") {
    if (!P.so || P.so.ci !== st.ci || P.so.practice || P.so.round !== st.round) { P.so = soFreshPad(); P.so.ci = st.ci; P.so.round = st.round; }
    if (st.done && st.done.includes(P.id)) P.so.arrested = true;
    P.soK = st.k; P.left = st.left;
    tick = setInterval(() => { P.left = Math.max(0, P.left - 1); timerUI(P.left, st.total); const t = document.getElementById("tleft"); if (t) t.textContent = P.left; }, 1000);
  }
  if (st.phase === "reveal" && st.rev) {
    const ok = !!(mine && mine.ok);
    P.hist.push({ ok, t: `Stakeout: suspect at ${SO.pt(...st.rev.p)}`, made: !!(mine && mine.arrest) });
    Sound.play(ok ? "correct" : mine && mine.arrest ? "wrong" : "noanswer");
  }
  if (st.phase === "standings" && mine) {
    const r = rankIdx(mine.correct, GAME_RANK_AT);
    P.promoted = r > P.lastRank; P.lastRank = r;
    Sound.play(P.promoted ? "promote" : "standings");
  }
  if (st.phase === "end") soStudentSave();
  soDrawStudent();
}
function soSendArrest(pt) {
  const P = S.stu, st = P && P.state; if (!st || st.phase !== "report") return;
  P.ch.send({ type: "broadcast", event: "arrest", payload: { id: P.id, name: S.player.name, avatar: S.player.avatar, round: st.round, ci: st.ci, pt } });
}
function soStudentReports(st) {
  const el = document.getElementById("soReps"); if (el) el.innerHTML = soReports(st.reps, st.k);
  const pts = document.getElementById("soWorth"); if (pts) pts.textContent = SO.arrestPoints(st.k, st.total, st.total);
  const h = document.getElementById("soHead"); if (h) h.textContent = `Case ${st.ci + 1} / ${st.n} · report ${st.k + 1} of 3`;
}
async function soStudentSave() {
  const P = S.stu; if (!P || P.saved[P.round] || !S.user) return;
  P.saved[P.round] = "pending";
  const mine = P.state.scores && P.state.scores[P.id], round = P.round;
  const right = P.hist.filter(h => h.ok).length;
  const res = await saveResult({ mode: "live", questions: P.hist.length, correct: right, score: mine ? mine.score : 0, best: mine ? mine.best : 0,
    topics: P.hist.length ? { A9: [right, P.hist.length] } : {}, missed: P.hist.filter(h => !h.ok).map(h => h.t) });
  if (S.stu === P && P.round === round) { P.saved[round] = res; const el = document.getElementById("savenote"); if (el && P.state.phase === "end") el.innerHTML = saveNote(res); }
}
function soDrawStudent() {
  const P = S.stu, st = P.state, mine = st.scores && st.scores[P.id];
  const me = `<div class="who">${avatarSvg(S.player.avatar, "sm")}${esc(S.player.name)}</div>`;
  const cnt = mine ? counters(mine.correct, mine.wrong) : "";
  const hud = extra => `<div class="hud">${me}${extra || ""}${cnt}${soundBtns()}</div>`;
  if (st.phase === "lobby") {
    set(`${hud(`<span class="stat">Game <b>${spaced(P.code)}</b></span>`)}
      <section class="panel"><span class="eyebrow">Stakeout</span><h2>You're in, ${esc(S.player.name)}</h2>${SO_RULES}
        <p class="muted small">Practise with the tools while you wait. The first case starts when your teacher is ready.</p></section>
      <section class="panel so-pad"><div id="soGrid"></div><div id="soTools"></div></section>`);
    soMountPad(P.so, null); soTools(P.so, null);
    return;
  }
  if (st.phase === "report") {
    set(`${hud(`<span class="stat" id="soHead">Case ${st.ci + 1} / ${st.n} · report ${st.k + 1} of 3</span>`)}
      <div class="timer" aria-hidden="true"><div class="timer-fill" style="width:${(P.left / st.total) * 100}%"></div></div>
      <section class="panel so-pad">
        <div class="row spread"><span class="eyebrow">Find the suspect</span><span class="stat secs"><span id="tleft">${P.left}</span>s</span></div>
        <div id="soReps">${soReports(st.reps, st.k)}</div>
        <p class="muted small">An arrest now scores up to <b id="soWorth">${SO.arrestPoints(st.k, st.total, st.total)}</b> points. A wrong arrest scores 0.</p>
        <p class="closing" id="closing" ${st.closing ? "" : "hidden"}>Everyone has made an arrest. Revealing…</p>
        <div id="soGrid"></div><div id="soTools"></div>
      </section>`);
    soMountPad(P.so, soSendArrest); soTools(P.so, soSendArrest);
    return;
  }
  if (st.phase === "reveal") {
    const ok = mine && mine.ok, made = mine && mine.arrest;
    const pad = P.so && P.so.ci === st.ci ? P.so : soFreshPad();
    const view = { crossed: pad.crossed, lines: pad.lines, arrestPt: made ? mine.arrest : null };
    set(`${hud(`<span class="stat">Case <b>${st.ci + 1}</b> / ${st.n}</span>`)}
      <section class="panel">
        <div class="result ${ok ? "good" : "bad"}"><span class="rhead">${ok ? `Suspect caught · +${mine.last}` : made ? "Wrong suspect" : "No arrest made"}</span>
          ${ok ? `<p>You arrested after report ${mine.when}${mine.when === 1 ? ": brilliant detective work" : ""}.</p>` : made ? `<p>${esc(mine.diag)}</p>` : `<p>Arrest before the time runs out to score.</p>`}
          <p>The suspect was at <span class="answer">${SO.pt(...st.rev.p)}</span>.</p></div>
        ${soGridSvg({ pad: view, rev: st.rev })}
        <span class="eyebrow">How to crack it</span>${soSteps(st.rev)}
        <p class="muted">Look at the board to see where everyone arrested.</p>
      </section>`);
    return;
  }
  if (st.phase === "standings") {
    set(`${hud(`<span class="stat">After case <b>${st.ci + 1}</b> / ${st.n}</span>`)}
      <section class="panel center">
        ${P.promoted ? `<div class="promo">Promoted to ${RANKS[P.lastRank]}</div>` : ""}
        ${mine ? `<span class="eyebrow">Your position</span><div class="big">${ordinal(mine.rank)}</div><p class="muted">of ${mine.of} · ${mine.score} points</p>
          <p class="gap">${mine.rank === 1 ? "You're top of the board. Keep it up." : `${mine.gap + 1} points to pass ${esc(mine.above)}`}</p>
          ${rankBadge(rankIdx(mine.correct, GAME_RANK_AT))}${mine.streak >= 3 ? `<span class="streak">${mine.streak} in a row</span>` : ""}` : `<h2>Standings on the board</h2>`}
      </section>`);
    return;
  }
  /* end */
  const res = P.saved[P.round];
  const place = mine && mine.rank <= 3 ? mine.rank : 0;
  set(`${hud("")}
    ${place ? `<section class="panel center celebrate" style="--d:${REVEAL[place] / 1000}s">
      <p class="cel-wait">Look at the board: the top 3 are being revealed…</p>
      <div class="cel-win">${medalSvg(place, "big")}${avatarSvg(S.player.avatar, "xl")}
        <span class="cel-place">${PLACE_WORD[place]} place!</span>
        <span class="cel-medal">${MEDALS_C[place][2]} medal${place === 1 ? " · Top detective" : ""}</span>
        <span class="muted">${mine.score} points · ${mine.correct} suspects caught</span></div></section>` : ""}
    <section class="panel center">${place ? "" : avatarSvg(S.player.avatar, "lg")}
      ${mine ? `<span class="eyebrow">Final position</span><div class="big">${ordinal(mine.rank)}</div><p class="muted">of ${mine.of} · ${mine.score} points</p>
        ${rankBadge(rankIdx(mine.correct, GAME_RANK_AT))}
        <div class="kpis"><div class="kpi"><span class="eyebrow">Caught</span><span class="v ok">${mine.correct}</span></div><div class="kpi"><span class="eyebrow">Missed</span><span class="v no">${mine.wrong}</span></div><div class="kpi"><span class="eyebrow">Best streak</span><span class="v">${mine.best}</span></div></div>` : `<h2>Game over</h2>`}
      <div id="savenote">${S.user ? (res && res !== "pending" ? saveNote(res) : `<p class="muted small">Saving to your case record…</p>`) : saveNote({ saved: false, why: "guest" })}</div>
    </section>
    <section class="panel"><h3>What next?</h3>
      <p class="muted small">If your teacher starts another round, you'll join it automatically. Stay on this page.</p>
      <div class="row"><button class="btn primary" id="solo">Practise solo cases</button>${S.user ? `<button class="btn" id="rec">My case record</button>` : ""}<button class="btn quiet" id="leave">Leave the game</button></div>
    </section>`);
  if (place) {
    if (place === 1) later(REVEAL.roll, () => Sound.play("drumroll"));
    later(REVEAL[place], () => { Sound.play(place === 1 ? "gold" : place === 2 ? "silver" : "bronze"); Confetti.burst(place === 1 ? 200 : 110, 0.5, 0.35); });
    if (place === 1) later(REVEAL[1] + 900, () => Confetti.burst(140, 0.5, 0.3));
  } else Sound.play("end");
}

/* choosing between the live games on the teacher's setup screen */
const gameSwitch = cur => `<div class="choice gameswitch" role="group" aria-label="Choose a game"><button class="btn" data-game="quiz" aria-pressed="${cur === "quiz"}">Case quiz</button><button class="btn" data-game="so" aria-pressed="${cur === "so"}">Stakeout <span class="newtag">New</span></button></div>`;
const bindGameSwitch = () => app.querySelectorAll("[data-game]").forEach(b => b.onclick = () => { store.set("ir-game", b.dataset.game); (b.dataset.game === "so" ? soHostSetup : hostSetup)(); });

