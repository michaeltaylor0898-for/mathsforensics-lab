/* ================= LINE OF INQUIRY: live, two teams =================
   A board of 20 hexagons (5 columns, 4 rows), each with a letter and a topic. Cyan links left to right,
   Amber links top to bottom. The team that won the last hexagon picks the next one; everyone answers,
   and the team with the higher percentage correct wins it. First unbroken path wins the round. */
const LI_COLS = 5, LI_ROWS = 4, LI_N = LI_COLS * LI_ROWS, LI_LETTERS = "ABCDEFGHIJKLMNOPQRST";
const LI_TEAM = { c: { name: "Cyan team", short: "Cyan", col: "#00FCF1", ink: "#0B122C" }, a: { name: "Amber team", short: "Amber", col: "#FFC857", ink: "#0B122C" } };
const liIdx = (c, r) => r * LI_COLS + c;
const liCR = i => [i % LI_COLS, Math.floor(i / LI_COLS)];
function liNeighbours(i) {
  const [c, r] = liCR(i), odd = c % 2 === 1;
  const d = odd ? [[0, -1], [0, 1], [-1, 0], [-1, 1], [1, 0], [1, 1]] : [[0, -1], [0, 1], [-1, -1], [-1, 0], [1, -1], [1, 0]];
  return d.map(([dc, dr]) => [c + dc, r + dr]).filter(([x, y]) => x >= 0 && x < LI_COLS && y >= 0 && y < LI_ROWS).map(([x, y]) => liIdx(x, y));
}
/* a winning path for a team, or null: Cyan joins column 0 to column 4, Amber joins row 0 to row 3 */
function liPath(board, t) {
  const start = [], isEnd = t === "c" ? (i => liCR(i)[0] === LI_COLS - 1) : (i => liCR(i)[1] === LI_ROWS - 1);
  for (let i = 0; i < LI_N; i++) if (board[i].o === t && (t === "c" ? liCR(i)[0] === 0 : liCR(i)[1] === 0)) start.push(i);
  const prev = {}, seen = new Set(start), queue = start.slice();
  while (queue.length) {
    const i = queue.shift();
    if (isEnd(i)) { const path = [i]; let k = i; while (prev[k] !== undefined) { k = prev[k]; path.push(k); } return path.reverse(); }
    liNeighbours(i).forEach(n => { if (!seen.has(n) && board[n].o === t) { seen.add(n); prev[n] = i; queue.push(n); } });
  }
  return null;
}
const liWrap = (s, w = 12) => { const out = []; let line = ""; String(s).split(/\s+/).forEach(word => { if ((line + " " + word).trim().length > w && line) { out.push(line); line = word; } else line = (line + " " + word).trim(); }); if (line) out.push(line); return out.slice(0, 3); };

/* the board, drawn as SVG. o: { board, sel, path, pick (clickable), small } */
function liBoardSvg(o) {
  const s = 66, h = Math.sqrt(3) * s, m = 34;
  const W = 2 * m + 2 * s + (LI_COLS - 1) * 1.5 * s, H = 2 * m + LI_ROWS * h + h / 2;
  const X = c => m + s + c * 1.5 * s, Y = (c, r) => m + h / 2 + r * h + (c % 2 ? h / 2 : 0);
  const hexPts = (cx, cy, k = 1) => Array.from({ length: 6 }, (_, j) => { const a = Math.PI / 3 * j; return `${(cx + s * k * Math.cos(a)).toFixed(1)},${(cy + s * k * Math.sin(a)).toFixed(1)}`; }).join(" ");
  const onPath = new Set(o.path || []);
  let g = `<rect x="4" y="${m}" width="14" height="${H - 2 * m}" rx="7" fill="${LI_TEAM.c.col}"/><rect x="${W - 18}" y="${m}" width="14" height="${H - 2 * m}" rx="7" fill="${LI_TEAM.c.col}"/>
    <rect x="${m}" y="4" width="${W - 2 * m}" height="14" rx="7" fill="${LI_TEAM.a.col}"/><rect x="${m}" y="${H - 18}" width="${W - 2 * m}" height="14" rx="7" fill="${LI_TEAM.a.col}"/>`;
  o.board.forEach((cell, i) => {
    const [c, r] = liCR(i), cx = X(c), cy = Y(c, r), own = cell.o ? LI_TEAM[cell.o] : null, sel = o.sel === i, win = onPath.has(i);
    g += `<g class="li-hex${own ? " own" : ""}${sel ? " sel" : ""}${win ? " win" : ""}${o.pick && !cell.o ? " pickable" : ""}" ${o.pick && !cell.o ? `data-hex="${i}" role="button" tabindex="0" aria-label="Hexagon ${cell.l}: ${esc(cell.tn)}"` : ""}>
      <polygon points="${hexPts(cx, cy, 0.95)}" fill="${own ? own.col : "#16214B"}" stroke="${win ? "#FFFFFF" : sel ? "#FFFFFF" : "#2A3870"}" stroke-width="${win || sel ? 6 : 3}"/>
      <text x="${cx}" y="${cy - (own ? 2 : 14)}" text-anchor="middle" class="li-l" fill="${own ? own.ink : "#FFFFFF"}">${cell.l}</text>
      ${own ? "" : liWrap(cell.tn).map((ln, k, arr) => `<text x="${cx}" y="${cy + 12 + k * 15 - (arr.length - 1) * 4}" text-anchor="middle" class="li-t">${esc(ln)}</text>`).join("")}</g>`;
  });
  return `<svg class="li-board${o.small ? " small" : ""}" viewBox="0 0 ${W.toFixed(0)} ${H.toFixed(0)}" role="img" aria-label="Line of Inquiry board">${g}</svg>`;
}
const liTeamTag = t => `<span class="li-tag ${t}">${LI_TEAM[t].name}</span>`;
const LI_RULES = `<ul class="so-rules">
  <li><b>Two teams.</b> <span class="li-tag c">Cyan</span> links <b>left to right</b>; <span class="li-tag a">Amber</span> links <b>top to bottom</b>.</li>
  <li><b>The team that won the last hexagon picks the next one.</b> Shout out its letter.</li>
  <li><b>Everyone answers.</b> The team with the higher percentage right wins the hexagon, so every answer counts.</li>
  <li><b>Build your path, or block theirs.</b> The first unbroken line across wins the round.</li></ul>`;

/* ================= HOST ================= */
function liHostSetup() {
  stopTimer(); S.pad = null;
  if (!liveConfigured()) return liveMissing(homeFn);
  if (gating() && !S.acc.signed_in) return signInToHost(homeFn);
  const cfg = withFilter(store.get("ir-li", null), { time: "auto", tier: "H", topics: [], best: 3 });
  const draw = (keep = false) => {
    set(`${brand("Line of Inquiry · teacher")}
      ${gameSwitch("inquiry")}
      <section class="panel"><span class="eyebrow">Live class game · two teams</span><h2>Line of Inquiry</h2>
        <ol class="so-teach">
          <li><b>Open the game</b> and show the board. Students go to <b>${JOIN_URL}</b>, type the code, and are split into <b>Cyan</b> and <b>Amber</b> teams automatically.</li>
          <li><b>The team that won the last hexagon picks the next.</b> They shout its letter and you tap it on the board.</li>
          <li><b>Everyone answers</b> on their tablet. The team with the higher percentage correct wins the hexagon.</li>
          <li><b>First unbroken path wins the round:</b> Cyan left to right, Amber top to bottom.</li>
        </ol>
        ${topicPicker(cfg)}
        <span class="eyebrow">Match length</span>${choice("best", cfg.best, [[1, "One round"], [3, "Best of 3"]])}
        <span class="eyebrow">Time per question</span>${choice("time", cfg.time, [["auto", "Auto: suits each question"], [20, "20 s"], [30, "30 s"], [45, "45 s"]])}
        <div class="row"><button class="btn primary big" id="go" ${poolFor(cfg).length ? "" : "disabled"}>Open the game</button><button class="btn" id="back">Back</button>${soundBtns(true)}</div>
      </section>`, true, keep);
    const redraw = () => draw(true);
    bindGameSwitch(); bindTopicPicker(cfg, redraw);
    bindChoice("best", v => { cfg.best = +v; redraw(); });
    bindChoice("time", v => { cfg.time = v === "auto" ? "auto" : +v; redraw(); });
    document.getElementById("back").onclick = homeFn;
    document.getElementById("go").onclick = () => { saveCfg("ir-li", cfg); Sound.unlock(); claimGame("host", () => liHostStart(cfg), liHostSetup); };
  };
  draw();
}
function liNewBoard(H) {
  const avail = TOPIC_IDS.filter(t => QUESTIONS.some(q => q.topic === t && (H.cfg.tier !== "F" || q.tier === "F")));
  const chosen = H.cfg.topics.length ? H.cfg.topics.filter(t => avail.includes(t)) : avail;
  let list = []; while (list.length < LI_N) list = list.concat(shuffle(chosen.length ? chosen : avail));
  H.board = list.slice(0, LI_N).map((t, i) => ({ l: LI_LETTERS[i], t, tn: TOPICS[t], o: null }));
  H.sel = null; H.path = null;
}
function liHostStart(cfg) {
  const code = String(100000 + Math.floor(Math.random() * 900000));
  const H = S.host = { game: "inquiry", code, cfg, round: 1, gr: 0, wins: { c: 0, a: 0 }, phase: "lobby", picker: Math.random() < 0.5 ? "c" : "a", board: [], sel: null, qk: 0, used: new Set(),
    players: {}, team: {}, online: new Set(), kicked: new Set(), answers: {}, left: 0, total: 0, log: [], status: "connecting" };
  liNewBoard(H);
  const ch = sb().channel("ir-" + code, { config: { broadcast: { self: false }, presence: { key: "host" } } });
  H.ch = ch;
  ch.on("broadcast", { event: "hello" }, ({ payload }) => { liAdd(payload); liPush(); if (H.phase === "lobby") liDrawHost(); })
    .on("broadcast", { event: "answer" }, ({ payload }) => liOnAnswer(payload))
    .on("presence", { event: "sync" }, () => {
      const st = ch.presenceState();
      H.online = new Set(Object.keys(st).filter(k => k !== "host"));
      Object.keys(st).forEach(k => { if (k !== "host" && st[k][0]) liAdd(st[k][0]); });
      if (H.phase === "lobby") liDrawHost(); else liLiveUI();
    })
    .subscribe(status => {
      if (status === "SUBSCRIBED") { H.status = "live"; ch.track({ role: "host" }); liPush(); }
      else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") H.status = "error";
      else if (status === "CLOSED") H.status = "closed";
      if (H.phase === "lobby") liDrawHost();
    });
  H.beat = setInterval(liPush, 3000);
  armGuard(() => { hostClose(); homeFn(); }, "Leaving ends the game for every student.");
  Sound.startMusic("show");
  liDrawHost();
}
/* new players go to the smaller team */
function liAdd(p) {
  const H = S.host; if (!H || !p || !p.id || H.kicked.has(p.id)) return;
  addPlayer(p);
  if (H.players[p.id] && !H.team[p.id]) {
    const n = t => Object.keys(H.team).filter(id => H.team[id] === t && H.players[id]).length;
    H.team[p.id] = n("c") <= n("a") ? "c" : "a";
  }
}
const liMembers = (H, t) => Object.values(H.players).filter(p => H.team[p.id] === t);
function liPush() {
  const H = S.host; if (!H || !H.ch || H.status !== "live" || H.game !== "inquiry") return;
  const payload = { game: "inquiry", phase: H.phase, round: H.round, gr: H.gr, best: H.cfg.best, wins: H.wins, picker: H.picker,
    board: H.board.map(b => ({ l: b.l, tn: b.tn, o: b.o })), sel: H.sel, qk: H.qk, qn: ["q", "result", "roundwin"].includes(H.phase) ? H.qn : null, perm: H.perm || null,
    left: H.left, total: H.total, closing: !!H.closing, kicked: [...H.kicked], code: H.code, teams: H.team, path: H.path, typed: false };
  if (H.phase === "result" || H.phase === "roundwin") payload.res = H.res;
  if (["result", "roundwin", "end"].includes(H.phase)) {
    const rk = ranking(), scores = {};
    rk.forEach((p, k) => { scores[p.id] = { score: p.score, rank: k + 1, of: rk.length, last: p.last, ok: p.ok, correct: p.correct, wrong: p.wrong, streak: p.streak, best: p.best,
      gap: k > 0 ? rk[k - 1].score - p.score : 0, above: k > 0 ? rk[k - 1].name : "" }; });
    payload.scores = scores;
  }
  if (H.phase === "end") payload.champ = H.champ;
  H.ch.send({ type: "broadcast", event: "state", payload });
}
function liStartRound() {
  const H = S.host;
  H.gr += 1; if (H.gr > 1) { liNewBoard(H); H.picker = H.firstPicker === "c" ? "a" : "c"; }
  H.firstPicker = H.picker;
  H.phase = "pick"; H.sel = null; H.res = null;
  Sound.startMusic("show"); Sound.play("standings");
  liDrawHost(); liPush();
}
/* the teacher taps the hexagon the picking team called out */
function liChoose(i) {
  const H = S.host; if (!H || H.phase !== "pick" || H.board[i].o) return;
  H.sel = i;
  const cell = H.board[i];
  const fresh = q => !H.used.has(q.n);
  let pool = poolFor({ tier: H.cfg.tier, topics: [cell.t], mix: "mixed" }).filter(fresh);
  if (!pool.length) pool = poolFor({ tier: H.cfg.tier, topics: TOPIC_IDS.filter(t => t[0] === cell.t[0]), mix: "mixed" }).filter(fresh);
  if (!pool.length) pool = poolFor({ tier: H.cfg.tier, topics: [], mix: "mixed" }).filter(fresh);
  if (!pool.length) { H.used.clear(); pool = poolFor({ tier: H.cfg.tier, topics: [cell.t], mix: "mixed" }); }
  const q = shuffle(pool)[0];
  H.used.add(q.n); H.qn = q.n; H.perm = makePerm(q); H.qk += 1;
  H.phase = "q"; H.total = secsFor(q, H.cfg.time, false); H.left = H.total; H.answers = {}; H.closing = false;
  Sound.play("join");
  liDrawHost(); liPush();
  stopTimer();
  tick = setInterval(() => {
    H.left = Math.max(0, H.left - 1);
    liLiveUI();
    if (H.left <= 5 && H.left > 0) Sound.play("tick");
    if (H.left % 5 === 0 || H.closing) liPush();
    if (H.left === 0) liReveal();
  }, 1000);
}
function liOnAnswer(p) {
  const H = S.host;
  if (!H || H.game !== "inquiry" || H.phase !== "q" || !p || p.qk !== H.qk || p.round !== H.round || H.kicked.has(p.id)) return;
  liAdd(p);
  const a = H.answers[p.id] = H.answers[p.id] || { ans: null, left: H.left };
  if (p.ans !== undefined && p.ans !== null && JSON.stringify(p.ans) !== JSON.stringify(a.ans)) { a.ans = p.ans; a.left = H.left; }
  liLiveUI();
  const online = [...H.online].filter(id => H.players[id]);
  if (!H.closing && online.length && online.every(id => H.answers[id] && H.answers[id].ans !== null) && H.left > 4) { H.closing = true; H.left = 4; liLiveUI(); liPush(); }
}
function liReveal() {
  const H = S.host; stopTimer();
  if (!H || H.phase !== "q") return;
  const q = QUESTIONS[H.qn], cell = H.board[H.sel];
  const prev = {}; ranking().forEach((p, k) => { prev[p.id] = k + 1; });
  const tally = { c: { right: 0, of: 0, time: 0 }, a: { right: 0, of: 0, time: 0 } }, dist = {};
  let answered = 0;
  Object.values(H.players).forEach(p => {
    const t = H.team[p.id], a = H.answers[p.id], has = a && a.ans !== null && a.ans !== undefined;
    p.prevRank = prev[p.id]; p.last = 0; p.ok = false;
    if (t) tally[t].of += 1;
    if (has) { answered += 1; const key = Array.isArray(a.ans) ? "seq" : a.ans; dist[key] = (dist[key] || 0) + 1; }
    if (has && isCorrect(q, a.ans)) {
      p.ok = true; p.correct += 1; p.streak += 1; p.best = Math.max(p.best, p.streak);
      p.last = 100 + Math.round(100 * Math.max(0, a.left) / H.total);
      if (t) { tally[t].right += 1; tally[t].time += a.left; }
    } else { p.wrong += 1; p.streak = 0; }
  });
  const pct = t => (tally[t].of ? tally[t].right / tally[t].of : 0);
  let winner = null;
  if (pct("c") > pct("a")) winner = "c"; else if (pct("a") > pct("c")) winner = "a";
  else if (tally.c.right > 0) winner = tally.c.time / tally.c.right >= tally.a.time / Math.max(1, tally.a.right) ? "c" : "a";   /* tie: the faster team */
  if (winner) { cell.o = winner; H.picker = winner; Object.values(H.players).forEach(p => { if (p.ok && H.team[p.id] === winner) p.last += 50; }); }
  Object.values(H.players).forEach(p => { p.score += p.last; });
  H.res = { winner, c: { right: tally.c.right, of: tally.c.of }, a: { right: tally.a.right, of: tally.a.of }, tie: winner && pct("c") === pct("a") };
  H.log.push({ gr: H.gr, l: cell.l, t: cell.t, qn: H.qn, winner, c: pct("c"), a: pct("a"), answered, dist, right: tally.c.right + tally.a.right, of: tally.c.of + tally.a.of });
  let path = winner ? liPath(H.board, winner) : null;
  if (!path && H.board.every(b => b.o)) {                      /* board full with no line: most hexagons wins */
    const n = t => H.board.filter(b => b.o === t).length;
    winner = n("c") >= n("a") ? "c" : "a"; H.res.winner = winner; path = [];
  }
  if (path) {
    H.path = path; H.wins[winner] += 1; H.phase = "roundwin";
    liMembers(H, winner).forEach(p => { p.score += 200; p.last += 200; });
    Sound.play("gold");
  } else {
    H.phase = "result";
    Sound.play(winner ? "promote" : "noanswer");
  }
  liPush(); liDrawHost();
}
function liLiveUI() {
  const H = S.host; if (!H || H.game !== "inquiry") return;
  if (H.phase === "q") {
    timerUI(H.left, H.total);
    const t = document.getElementById("tleft"); if (t) t.textContent = H.left;
    ["c", "a"].forEach(tm => { const el = document.getElementById("ans-" + tm); if (el) { const m = liMembers(H, tm); el.textContent = `${m.filter(p => H.answers[p.id] && H.answers[p.id].ans !== null).length} / ${m.length}`; } });
    const c = document.getElementById("closing"); if (c) c.hidden = !H.closing;
  }
}
function liEnd() {
  const H = S.host; stopTimer();
  H.champ = H.wins.c > H.wins.a ? "c" : H.wins.a > H.wins.c ? "a" : null;
  H.phase = "end"; Sound.stopMusic();
  liPush(); liDrawHost();
}
const liScore = H => `<div class="li-score"><span class="li-tag c">Cyan ${H.wins.c}</span><span class="muted">rounds</span><span class="li-tag a">Amber ${H.wins.a}</span></div>`;
function liDrawHost() {
  const H = S.host; if (!H) return;
  const players = Object.values(H.players);
  const statusText = H.status === "live" ? "Connected" : H.status === "error" ? "Connection problem" : H.status === "closed" ? "Disconnected" : "Connecting…";
  const hud = sub => `<div class="hud">${brand(sub)}<span class="stat${H.status === "error" ? " no" : ""}">${statusText}</span>${soundBtns(true)}</div>`;
  const codeBar = `<span class="stat">Join: <b>${JOIN_URL}</b> · code <b class="cy">${spaced(H.code)}</b></span>`;
  const teamCol = t => `<div class="li-team ${t}"><h3>${LI_TEAM[t].name} · ${liMembers(H, t).length}</h3><div class="li-members">${liMembers(H, t).map(p => `<span class="cu">${avatarSvg(p.avatar, "xs")}${esc(p.name)}<button class="li-swap" data-swap="${esc(p.id)}" title="Move to the other team" aria-label="Move ${esc(p.name)} to the other team">⇄</button></span>`).join("") || `<span class="muted small">Nobody yet</span>`}</div></div>`;
  if (H.phase === "lobby") {
    set(`${hud("Line of Inquiry · teacher screen")}
      <section class="panel joinpanel">
        <div><span class="eyebrow">On your tablet go to</span><div class="joinurl">${JOIN_URL}</div></div>
        <div><span class="eyebrow">Game code</span><div class="bigcode">${spaced(H.code)}</div></div>
      </section>
      <section class="panel so-intro"><div><span class="eyebrow">Line of Inquiry · ${H.cfg.best === 3 ? "best of 3" : "one round"}</span><h2>Claim a path across the board</h2>${LI_RULES}</div>${liBoardSvg({ board: H.board, small: true })}</section>
      <section class="panel">
        <div class="row spread"><h3>Detectives in the room · ${players.length}</h3>
          <div class="row"><button class="btn primary big" id="start" ${liMembers(H, "c").length && liMembers(H, "a").length ? "" : "disabled"}>Start the game</button><button class="btn quiet" id="quit">Close game</button></div></div>
        <div class="li-teams">${teamCol("c")}${teamCol("a")}</div>
        <p class="muted small">Teams are balanced automatically. Tap ⇄ to move someone. You need at least one player on each team.</p>
      </section>`, true);
    const st = document.getElementById("start"); if (st) st.onclick = liStartRound;
    app.querySelectorAll("[data-swap]").forEach(b => b.onclick = () => { const id = b.dataset.swap; H.team[id] = H.team[id] === "c" ? "a" : "c"; liPush(); liDrawHost(); });
    document.getElementById("quit").onclick = () => { hostClose(); homeFn(); };
    return;
  }
  const roundLbl = `Round ${H.gr}${H.cfg.best === 3 ? " · best of 3" : ""}`;
  if (H.phase === "pick") {
    set(`${hud(roundLbl)}
      <div class="row spread">${codeBar}${liScore(H)}</div>
      <div class="li-wrap">
        <section class="panel li-main">${liBoardSvg({ board: H.board, pick: true })}</section>
        <section class="panel li-side">
          <div class="li-turn ${H.picker}"><span class="eyebrow">Your choice</span><h2>${LI_TEAM[H.picker].name}, pick a hexagon</h2><p>Shout out a letter. ${H.picker === "c" ? "Cyan is linking left to right." : "Amber is linking top to bottom."}</p></div>
          <p class="muted">Teacher: tap the hexagon they call out.</p>
          <div class="li-teams">${teamCol("c")}${teamCol("a")}</div>
          <div class="row"><button class="btn quiet" id="quit">End game</button></div>
        </section></div>`, true);
    app.querySelectorAll("[data-hex]").forEach(g => { g.onclick = () => liChoose(+g.dataset.hex); g.onkeydown = e => { if (e.key === "Enter" || e.key === " ") liChoose(+g.dataset.hex); }; });
    app.querySelectorAll("[data-swap]").forEach(b => b.onclick = () => { const id = b.dataset.swap; H.team[id] = H.team[id] === "c" ? "a" : "c"; liPush(); liDrawHost(); });
    document.getElementById("quit").onclick = liEnd;
    return;
  }
  const cell = H.sel !== null ? H.board[H.sel] : null, q = H.qn !== undefined ? QUESTIONS[H.qn] : null;
  if (H.phase === "q") {
    set(`${hud(roundLbl)}
      <div class="row spread">${codeBar}<span class="stat">Answered: <span class="li-tag c" id="ans-c">0</span> <span class="li-tag a" id="ans-a">0</span></span></div>
      <div class="timer big" aria-hidden="true"><div class="timer-fill" style="width:100%"></div></div>
      <div class="li-wrap">
        <section class="panel li-main">${liBoardSvg({ board: H.board, sel: H.sel })}</section>
        <section class="panel li-side">
          <span class="eyebrow">Hexagon ${cell.l} · ${esc(cell.tn)}</span>
          ${qHead(q, `<span class="stat secs"><span id="tleft">${H.left}</span>s</span>`)}
          <p class="brief">${esc(q.brief)}</p>
          ${todoBanner(todoText(q, "board", false))}
          ${boardQ(q, H.perm, null)}
          <p class="closing" id="closing" ${H.closing ? "" : "hidden"}>Everyone has answered. Revealing in a few seconds…</p>
          <div class="row"><button class="btn primary" id="reveal">Reveal now</button><button class="btn quiet" id="quit">End game</button></div>
        </section></div>`, true);
    liLiveUI();
    document.getElementById("reveal").onclick = liReveal;
    document.getElementById("quit").onclick = liEnd;
    return;
  }
  if (H.phase === "result" || H.phase === "roundwin") {
    const r = H.res, pc = t => (r[t].of ? Math.round(100 * r[t].right / r[t].of) : 0);
    const last = H.log[H.log.length - 1];
    const done = H.phase === "roundwin", w = r.winner;
    const matchOver = done && (H.cfg.best === 1 || H.wins[w] >= 2);
    set(`${hud(roundLbl)}
      <div class="row spread">${codeBar}${liScore(H)}</div>
      <div class="li-wrap">
        <section class="panel li-main">${liBoardSvg({ board: H.board, sel: done ? null : H.sel, path: H.path })}</section>
        <section class="panel li-side">
          ${done ? `<div class="li-turn ${w} li-big"><span class="eyebrow">Round ${H.gr}</span><h2>${LI_TEAM[w].name} wins the round!</h2><p>An unbroken line ${w === "c" ? "from left to right" : "from top to bottom"}. +200 for every ${LI_TEAM[w].short} detective.</p></div>`
            : `<div class="li-turn ${w || "none"}"><span class="eyebrow">Hexagon ${cell.l}</span><h2>${w ? `${LI_TEAM[w].name} wins ${cell.l}` : "Nobody wins it"}</h2><p>${w ? `${LI_TEAM[w].short} picks next.${r.tie ? " (A tie, so the faster team took it.)" : ""}` : `Nobody got it right, so ${LI_TEAM[H.picker].short} picks again.`}</p></div>`}
          <div class="li-vs"><div class="c"><span class="pct">${pc("c")}%</span><span>Cyan · ${r.c.right} of ${r.c.of}</span></div><div class="a"><span class="pct">${pc("a")}%</span><span>Amber · ${r.a.right} of ${r.a.of}</span></div></div>
          <details ${done ? "" : "open"}><summary class="eyebrow">The question</summary>
            <p class="brief small-brief">${esc(q.brief)}</p>${boardQ(q, H.perm, { dist: last.dist, answered: last.answered })}
            ${q.type === "spot" ? `<p>Final answer: <span class="answer">${esc(q.answer)}</span></p>` : ""}<p class="why"><b>Why:</b> ${esc(q.why)}</p></details>
          <div class="row">${done ? (matchOver ? `<button class="btn primary big" id="final">Final results</button>` : `<button class="btn primary big" id="nextround">Next round</button>`) : `<button class="btn primary big" id="next">${LI_TEAM[H.picker].short} picks next</button>`}<button class="btn quiet" id="quit">End game</button></div>
        </section></div>`, true);
    if (done) later(300, () => Confetti.burst(200, w === "c" ? 0.3 : 0.7, 0.3));
    const nx = document.getElementById("next"); if (nx) nx.onclick = () => { H.phase = "pick"; H.sel = null; H.res = null; liPush(); liDrawHost(); };
    const nr = document.getElementById("nextround"); if (nr) nr.onclick = liStartRound;
    const fi = document.getElementById("final"); if (fi) fi.onclick = liEnd;
    document.getElementById("quit").onclick = liEnd;
    return;
  }
  /* end */
  const rk = ranking(), champ = H.champ;
  const byTopic = {}; H.log.forEach(e => { const k = e.t; byTopic[k] = byTopic[k] || { right: 0, of: 0 }; byTopic[k].right += e.right; byTopic[k].of += e.of; });
  const topics = Object.entries(byTopic).sort((a, b) => a[1].right / Math.max(1, a[1].of) - b[1].right / Math.max(1, b[1].of));
  set(`${hud("Line of Inquiry · final results")}<div class="tape"></div>
    <section class="panel center li-champ ${champ || "none"}"><span class="eyebrow">Match result</span><h2>${champ ? `${LI_TEAM[champ].name} wins the match!` : "It's a draw!"}</h2>${liScore(H)}</section>
    ${rk.length ? ceremonyHtml(rk.slice(0, 3), "Top detectives across both teams") : ""}
    <section class="panel"><h3>Class case report</h3>
      <p class="muted small">Topics from hardest to easiest for this class.</p>
      <div class="bars">${topics.map(([t, v]) => { const pct = v.of ? Math.round(100 * v.right / v.of) : 0; return `<div class="bar wide-label"><span>${esc(TOPICS[t] || t)}</span><div class="track"><div class="fill" style="width:${pct}%"></div></div><span class="n">${pct}%</span></div>`; }).join("")}</div>
      <details><summary class="eyebrow">Full results (teacher only)</summary>
        <div class="podium" style="margin-top:12px">${rk.map((p, k) => `<div class="place"><span class="pos">${k + 1}</span>${avatarSvg(p.avatar, "sm")}<span class="tn">${esc(p.name)} <span class="li-tag ${H.team[p.id]}">${LI_TEAM[H.team[p.id]] ? LI_TEAM[H.team[p.id]].short : ""}</span></span><span class="ts">✓${p.correct} ✗${p.wrong} · ${p.score}</span></div>`).join("")}</div>
      </details>
    </section>
    <section class="panel"><h3>What next?</h3>
      <div class="row"><button class="btn primary" id="again">Rematch with the same teams</button><button class="btn" id="new">New game</button><button class="btn" id="home">Back to Incident Room</button></div>
    </section>`, true);
  if (rk.length) runCeremony(rk.slice(0, 3));
  if (champ) later(500, () => Confetti.burst(200, champ === "c" ? 0.3 : 0.7, 0.3));
  document.getElementById("again").onclick = () => {
    H.round += 1; H.gr = 0; H.wins = { c: 0, a: 0 }; H.log = []; H.used.clear(); liNewBoard(H); H.phase = "lobby";
    Object.values(H.players).forEach(p => Object.assign(p, { score: 0, correct: 0, wrong: 0, streak: 0, best: 0, last: 0, ok: false, prevRank: 0 }));
    Sound.startMusic("show"); liPush(); liDrawHost();
  };
  document.getElementById("new").onclick = () => { hostClose(); liHostSetup(); };
  document.getElementById("home").onclick = () => { hostClose(); homeFn(); };
}

/* ================= STUDENT ================= */
function liStudentState(st) {
  const P = S.stu;
  if (st.round !== P.round) { P.round = st.round; P.hist = []; P.lastRank = 0; }
  P.state = st;
  const key = `${st.round}:${st.phase}:${st.gr}:${st.qk}`;
  const mine = st.scores && st.scores[P.id];
  if (key === P.key) {
    if (st.phase === "q") { P.left = Math.min(P.left, st.left); timerUI(P.left, st.total); const t = document.getElementById("tleft"); if (t) t.textContent = P.left; const c = document.getElementById("closing"); if (c) c.hidden = !st.closing; }
    else if (st.phase === "lobby") liDrawStudent();       /* team changes in the lobby */
    return;
  }
  P.key = key;
  stopTimer();
  if (st.phase === "q") {
    P.L = freshPad(); P.left = st.left;
    S.pad = { L: P.L, act: (a, v) => liStudentAct(a, v) };
    tick = setInterval(() => { P.left = Math.max(0, P.left - 1); timerUI(P.left, st.total); const t = document.getElementById("tleft"); if (t) t.textContent = P.left; }, 1000);
  } else S.pad = null;
  if ((st.phase === "result" || st.phase === "roundwin") && st.qn !== null) {
    const q = QUESTIONS[st.qn];
    P.hist.push({ q, ok: !!(mine && mine.ok), ans: P.L ? P.L.sentAns : null });
    Sound.play(mine && mine.ok ? "correct" : P.L && P.L.sentAns !== null ? "wrong" : "noanswer");
    const myT = st.teams[P.id];
    if (st.phase === "roundwin") setTimeout(() => Sound.play(st.res.winner === myT ? "gold" : "end"), 600);
    else if (st.res && st.res.winner) setTimeout(() => Sound.play(st.res.winner === myT ? "promote" : "standings"), 500);
  }
  if (st.phase === "pick") Sound.play("standings");
  if (st.phase === "end") studentSave();
  liDrawStudent();
}
function liStudentAct(act, v) {
  const P = S.stu, st = P && P.state;
  if (!st || st.phase !== "q") return;
  const q = QUESTIONS[st.qn], L = P.L, r = padAct(q, L, act, v);
  if (!r) return;
  const send = ans => P.ch.send({ type: "broadcast", event: "answer", payload: { id: P.id, name: S.player.name, avatar: S.player.avatar, round: st.round, qk: st.qk, ans } });
  if (r === "ans") { L.sentAns = L.ans; send(L.ans); Sound.play("tap"); }
  if (act === "seq-send" && L.ans) { L.sentAns = L.ans.slice(); send(L.sentAns); Sound.play("tap"); }
  if (r === "text" && q.type === "type") { L.sentAns = L.ans; L.sentText = L.ans; send(L.ans); Sound.play("tap"); }
  if (r === "seq") Sound.play("tap");
  liDrawStudent(true);
}
function liDrawStudent(keep = false) {
  const P = S.stu, st = P.state, mine = st.scores && st.scores[P.id], myT = st.teams && st.teams[P.id];
  const me = `<div class="who">${avatarSvg(S.player.avatar, "sm")}${esc(S.player.name)}</div>`;
  const cnt = mine ? counters(mine.correct, mine.wrong) : "";
  const hud = extra => `<div class="hud">${me}${myT ? liTeamTag(myT) : ""}${extra || ""}${cnt}${soundBtns()}</div>`;
  const wins = `<span class="stat"><span class="li-tag c">${st.wins.c}</span> <span class="li-tag a">${st.wins.a}</span></span>`;
  if (st.phase === "lobby") {
    return set(`${hud(`<span class="stat">Game <b>${spaced(P.code)}</b></span>`)}
      <section class="panel center li-joined ${myT || ""}">${avatarSvg(S.player.avatar, "lg")}<span class="eyebrow">You're in, ${esc(S.player.name)}</span>
        <h2>${myT ? `You're on the ${LI_TEAM[myT].name}` : "Finding your team…"}</h2>
        ${myT ? `<p>${myT === "c" ? "Your team links the board from left to right." : "Your team links the board from top to bottom."}</p>` : ""}</section>
      <section class="panel"><span class="eyebrow">Line of Inquiry</span>${LI_RULES}</section>`);
  }
  if (st.phase === "pick") {
    const mineTurn = st.picker === myT;
    return set(`${hud(wins)}
      <section class="panel center li-turn ${st.picker}"><span class="eyebrow">Round ${st.gr}</span>
        <h2>${mineTurn ? "Your team picks!" : `${LI_TEAM[st.picker].name} is choosing`}</h2>
        <p>${mineTurn ? "Agree on a hexagon and shout out its letter. Build your path, or block theirs." : "Get ready to answer: every right answer helps your team."}</p></section>
      <section class="panel">${liBoardSvg({ board: st.board, small: true })}</section>`);
  }
  if (st.phase === "q") {
    const q = QUESTIONS[st.qn], cell = st.board[st.sel];
    return set(`${hud(`<span class="stat">Hexagon <b>${cell.l}</b></span>`)}
      <div class="timer" aria-hidden="true"><div class="timer-fill" style="width:${(P.left / st.total) * 100}%"></div></div>
      <section class="panel">
        ${qHead(q, `<span class="stat secs"><span id="tleft">${P.left}</span>s</span>`)}
        <p class="brief">${esc(q.brief)}</p>
        ${todoBanner(todoText(q, "live", false) + " Every right answer helps " + (myT ? "the " + LI_TEAM[myT].name : "your team") + " win hexagon " + cell.l + ".")}
        ${deviceQ(q, st.perm, P.L, { mode: "live", typed: false })}
        <p class="closing" id="closing" ${st.closing ? "" : "hidden"}>Everyone has answered. A few seconds left to change your answer.</p>
      </section>`, false, keep);
  }
  if (st.phase === "result" || st.phase === "roundwin") {
    const q = QUESTIONS[st.qn], h = P.hist[P.hist.length - 1], ok = mine && mine.ok, r = st.res, w = r.winner;
    const pc = t => (r[t].of ? Math.round(100 * r[t].right / r[t].of) : 0);
    return set(`${hud(wins)}
      ${st.phase === "roundwin" ? `<section class="panel center li-turn ${w} big"><h2>${w === myT ? "Your team wins the round!" : `${LI_TEAM[w].name} wins the round`}</h2></section>` : ""}
      <section class="panel">
        <div class="result ${ok ? "good" : "bad"}"><span class="rhead">${ok ? `Correct · +${mine.last}` : h && h.ans !== null ? "Not this time" : "No answer in time"}</span>
          ${!ok && h && h.ans !== null && h.ans !== undefined ? `<p>You said: <b>${esc(ansLabel(q, h.ans))}</b></p>` : ""}
          <p>Correct answer: <span class="answer">${esc(rightLabel(q))}</span></p><p class="why"><b>Why:</b> ${esc(q.why)}</p></div>
        <div class="li-vs"><div class="c"><span class="pct">${pc("c")}%</span><span>Cyan</span></div><div class="a"><span class="pct">${pc("a")}%</span><span>Amber</span></div></div>
        <p class="center"><b>${w ? `${LI_TEAM[w].name} won hexagon ${st.board[st.sel].l}` : "Nobody won that hexagon"}</b></p>
      </section>
      <section class="panel">${liBoardSvg({ board: st.board, small: true, path: st.path })}</section>`);
  }
  /* end: show the match result above the usual end screen */
  const res = drawStudent(keep);
  const champ = st.champ;
  const hudEl = app.querySelector(".hud");
  if (hudEl) hudEl.insertAdjacentHTML("afterend", `<section class="panel center li-champ ${champ || "none"}"><h2>${champ ? (champ === myT ? "Your team wins the match!" : `${LI_TEAM[champ].name} wins the match`) : "The match is a draw"}</h2>
    <p><span class="li-tag c">Cyan ${st.wins.c}</span> <span class="li-tag a">Amber ${st.wins.a}</span></p></section>`);
  return res;
}
