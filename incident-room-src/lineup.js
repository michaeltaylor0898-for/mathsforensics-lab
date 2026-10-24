/* ================= THE LINEUP: live, two teams, four in a row =================
   A 7 x 6 board. Turns alternate between Cyan and Amber, but both teams answer every question.
   On your turn, if at least half your team is right, you drop a counter in the column you choose.
   If your team misses and the other team managed at least half, they steal the drop.
   Four in a row (across, up or diagonally) wins the round. */
const LN_COLS = 7, LN_ROWS = 6, LN_NEED = 0.5;
const lnEmpty = () => Array.from({ length: LN_COLS }, () => []);
function lnFour(grid, col, row) {
  const t = grid[col][row], at = (c, r) => (c >= 0 && c < LN_COLS && r >= 0 && grid[c][r]) || null;
  for (const [dc, dr] of [[1, 0], [0, 1], [1, 1], [1, -1]]) {
    const line = [[col, row]];
    for (const s of [1, -1]) { let c = col + dc * s, r = row + dr * s; while (at(c, r) === t) { line.push([c, r]); c += dc * s; r += dr * s; } }
    if (line.length >= 4) return line;
  }
  return null;
}
/* the board as SVG. o: { grid, pick (columns clickable), last: [c, r], win: [[c, r]...], small } */
function lnBoardSvg(o) {
  const cell = 76, m = 20, top = o.pick ? 56 : 16, W = 2 * m + LN_COLS * cell, H = top + m + LN_ROWS * cell;
  const cx = c => m + cell / 2 + c * cell, cy = r => top + cell / 2 + (LN_ROWS - 1 - r) * cell;
  const win = new Set((o.win || []).map(([c, r]) => c + "," + r));
  let g = `<rect x="${m - 8}" y="${top - 8}" width="${LN_COLS * cell + 16}" height="${LN_ROWS * cell + 16}" rx="18" fill="#1B36FF"/>`;
  for (let c = 0; c < LN_COLS; c++) {
    for (let r = 0; r < LN_ROWS; r++) {
      const t = o.grid[c][r], isNew = o.last && o.last[0] === c && o.last[1] === r, w = win.has(c + "," + r);
      g += `<circle cx="${cx(c)}" cy="${cy(r)}" r="${cell * 0.38}" fill="#0B122C"/>`;
      if (t) g += `<g class="ln-ctr${isNew ? " new" : ""}${w ? " win" : ""}" style="--from:${-(cy(r) + cell)}px"><circle cx="${cx(c)}" cy="${cy(r)}" r="${cell * 0.36}" fill="${LI_TEAM[t].col}" stroke="${w ? "#FFFFFF" : "rgba(0,0,0,.25)"}" stroke-width="${w ? 6 : 3}"/>
        <path transform="translate(${cx(c)} ${cy(r)}) scale(.9)" d="M0-15l4.4 9 9.9 1.4-7.2 7 1.7 9.8L0 7.6l-8.8 4.6 1.7-9.8-7.2-7 9.9-1.4z" fill="rgba(11,18,44,.35)"/></g>`;
    }
  }
  /* clickable columns go on top, so a tap anywhere in the column counts */
  if (o.pick) for (let c = 0; c < LN_COLS; c++) if (o.grid[c].length < LN_ROWS) g += `<g class="ln-col" data-col="${c}" role="button" tabindex="0" aria-label="Column ${c + 1}"><rect x="${m + c * cell}" y="0" width="${cell}" height="${H}" fill="transparent"/>
      <polygon points="${cx(c) - 16},${top - 40} ${cx(c) + 16},${top - 40} ${cx(c)},${top - 16}" class="ln-arrow"/><text x="${cx(c)}" y="${top - 44}" text-anchor="middle" class="ln-num">${c + 1}</text></g>`;
  return `<svg class="ln-board${o.small ? " small" : ""}" viewBox="0 0 ${W} ${H}" role="img" aria-label="The Lineup board">${g}</svg>`;
}
const LN_RULES = `<ul class="so-rules">
  <li><b>Two teams take turns:</b> <span class="li-tag c">Cyan</span> then <span class="li-tag a">Amber</span>. Everyone answers every question.</li>
  <li><b>On your turn,</b> if at least half your team gets it right, you drop a counter in the column you choose.</li>
  <li><b>Steal!</b> If the team whose turn it is misses and the other team gets at least half right, they drop instead.</li>
  <li><b>Four in a row</b> across, up or diagonally wins the round.</li></ul>`;

/* ================= HOST ================= */
function lnHostSetup() {
  stopTimer(); S.pad = null;
  if (!liveConfigured()) return liveMissing(homeFn);
  if (gating() && !S.acc.signed_in) return signInToHost(homeFn);
  const cfg = withFilter(store.get("ir-ln", null), { time: "auto", tier: "H", topics: [], best: 3 });
  const draw = (keep = false) => {
    set(`${brand("The Lineup · teacher")}
      ${gameSwitch("lineup")}
      <section class="panel"><span class="eyebrow">Live class game · two teams</span><h2>The Lineup</h2>
        <ol class="so-teach">
          <li><b>Open the game</b> and show the board. Students join at <b>${JOIN_URL}</b> and are split into <b>Cyan</b> and <b>Amber</b> automatically.</li>
          <li><b>Teams take turns,</b> but everyone answers every question on their tablet.</li>
          <li><b>On a team's turn,</b> if at least half of them are right they choose a column (they shout it, you tap it) and a counter drops. If they miss and the other team got at least half, the other team steals the drop.</li>
          <li><b>Four in a row wins the round.</b></li>
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
    document.getElementById("go").onclick = () => { saveCfg("ir-ln", cfg); Sound.unlock(); claimGame("host", () => lnHostStart(cfg), lnHostSetup); };
  };
  draw();
}
function lnHostStart(cfg) {
  const code = String(100000 + Math.floor(Math.random() * 900000));
  const H = S.host = { game: "lineup", code, cfg, round: 1, gr: 0, wins: { c: 0, a: 0 }, phase: "lobby", turn: "c", grid: lnEmpty(), last: null, win: null, dropper: null, qk: 0, used: new Set(), pool: [],
    players: {}, team: {}, online: new Set(), kicked: new Set(), answers: {}, left: 0, total: 0, log: [], status: "connecting" };
  const ch = sb().channel("ir-" + code, { config: { broadcast: { self: false }, presence: { key: "host" } } });
  H.ch = ch;
  ch.on("broadcast", { event: "hello" }, ({ payload }) => { liAdd(payload); lnPush(); if (H.phase === "lobby") lnDrawHost(); })
    .on("broadcast", { event: "answer" }, ({ payload }) => lnOnAnswer(payload))
    .on("presence", { event: "sync" }, () => {
      const st = ch.presenceState();
      H.online = new Set(Object.keys(st).filter(k => k !== "host"));
      Object.keys(st).forEach(k => { if (k !== "host" && st[k][0]) liAdd(st[k][0]); });
      if (H.phase === "lobby") lnDrawHost(); else lnLiveUI();
    })
    .subscribe(status => {
      if (status === "SUBSCRIBED") { H.status = "live"; ch.track({ role: "host" }); lnPush(); }
      else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") H.status = "error";
      else if (status === "CLOSED") H.status = "closed";
      if (H.phase === "lobby") lnDrawHost();
    });
  H.beat = setInterval(lnPush, 3000);
  armGuard(() => { hostClose(); homeFn(); }, "Leaving ends the game for every student.");
  Sound.startMusic("show");
  lnDrawHost();
}
function lnPush() {
  const H = S.host; if (!H || !H.ch || H.status !== "live" || H.game !== "lineup") return;
  const payload = { game: "lineup", phase: H.phase, round: H.round, gr: H.gr, best: H.cfg.best, wins: H.wins, turn: H.turn, grid: H.grid, last: H.last, win: H.win, dropper: H.dropper,
    qk: H.qk, qn: ["q", "result", "drop", "roundwin"].includes(H.phase) ? H.qn : null, perm: H.perm || null, left: H.left, total: H.total, closing: !!H.closing,
    kicked: [...H.kicked], code: H.code, teams: H.team, res: H.res || null, typed: false };
  if (["result", "drop", "roundwin", "end"].includes(H.phase)) {
    const rk = ranking(), scores = {};
    rk.forEach((p, k) => { scores[p.id] = { score: p.score, rank: k + 1, of: rk.length, last: p.last, ok: p.ok, correct: p.correct, wrong: p.wrong, streak: p.streak, best: p.best,
      gap: k > 0 ? rk[k - 1].score - p.score : 0, above: k > 0 ? rk[k - 1].name : "" }; });
    payload.scores = scores;
  }
  if (H.phase === "end") payload.champ = H.champ;
  H.ch.send({ type: "broadcast", event: "state", payload });
}
function lnStartRound() {
  const H = S.host;
  H.gr += 1; H.grid = lnEmpty(); H.last = null; H.win = null; H.dropper = null; H.res = null;
  H.turn = H.gr % 2 === 1 ? "c" : "a";
  Sound.startMusic("show");
  lnNextQuestion();
}
function lnNextQuestion() {
  const H = S.host;
  if (!H.pool.length) H.pool = shuffle(poolFor({ tier: H.cfg.tier, topics: H.cfg.topics, mix: "mixed" }).filter(q => !H.used.has(q.n)));
  if (!H.pool.length) { H.used.clear(); H.pool = shuffle(poolFor({ tier: H.cfg.tier, topics: H.cfg.topics, mix: "mixed" })); }
  const q = H.pool.shift();
  H.used.add(q.n); H.qn = q.n; H.perm = makePerm(q); H.qk += 1; H.res = null; H.dropper = null; H.last = null;
  H.phase = "q"; H.total = secsFor(q, H.cfg.time, false); H.left = H.total; H.answers = {}; H.closing = false;
  Sound.play("standings");
  lnDrawHost(); lnPush();
  stopTimer();
  tick = setInterval(() => {
    H.left = Math.max(0, H.left - 1);
    lnLiveUI();
    if (H.left <= 5 && H.left > 0) Sound.play("tick");
    if (H.left % 5 === 0 || H.closing) lnPush();
    if (H.left === 0) lnReveal();
  }, 1000);
}
function lnOnAnswer(p) {
  const H = S.host;
  if (!H || H.game !== "lineup" || H.phase !== "q" || !p || p.qk !== H.qk || p.round !== H.round || H.kicked.has(p.id)) return;
  liAdd(p);
  const a = H.answers[p.id] = H.answers[p.id] || { ans: null, left: H.left };
  if (p.ans !== undefined && p.ans !== null && JSON.stringify(p.ans) !== JSON.stringify(a.ans)) { a.ans = p.ans; a.left = H.left; }
  lnLiveUI();
  const online = [...H.online].filter(id => H.players[id]);
  if (!H.closing && online.length && online.every(id => H.answers[id] && H.answers[id].ans !== null) && H.left > 4) { H.closing = true; H.left = 4; lnLiveUI(); lnPush(); }
}
const lnOther = t => (t === "c" ? "a" : "c");
function lnReveal() {
  const H = S.host; stopTimer();
  if (!H || H.phase !== "q") return;
  const q = QUESTIONS[H.qn];
  const prev = {}; ranking().forEach((p, k) => { prev[p.id] = k + 1; });
  const tally = { c: { right: 0, of: 0 }, a: { right: 0, of: 0 } }, dist = {};
  let answered = 0;
  Object.values(H.players).forEach(p => {
    const t = H.team[p.id], a = H.answers[p.id], has = a && a.ans !== null && a.ans !== undefined;
    p.prevRank = prev[p.id]; p.last = 0; p.ok = false;
    if (t) tally[t].of += 1;
    if (has) { answered += 1; const key = Array.isArray(a.ans) ? "seq" : a.ans; dist[key] = (dist[key] || 0) + 1; }
    if (has && isCorrect(q, a.ans)) { p.ok = true; p.correct += 1; p.streak += 1; p.best = Math.max(p.best, p.streak); p.last = 100 + Math.round(100 * Math.max(0, a.left) / H.total); if (t) tally[t].right += 1; }
    else { p.wrong += 1; p.streak = 0; }
  });
  const pass = t => tally[t].of > 0 && tally[t].right / tally[t].of >= LN_NEED;
  const turn = H.turn, other = lnOther(turn);
  let dropper = null, steal = false;
  if (pass(turn)) dropper = turn; else if (pass(other)) { dropper = other; steal = true; }
  if (dropper) Object.values(H.players).forEach(p => { if (p.ok && H.team[p.id] === dropper) p.last += 50; });
  Object.values(H.players).forEach(p => { p.score += p.last; });
  H.dropper = dropper;
  H.res = { turn, dropper, steal, c: tally.c, a: tally.a };
  H.log.push({ gr: H.gr, qn: H.qn, turn, dropper, steal, answered, dist, right: tally.c.right + tally.a.right, of: tally.c.of + tally.a.of, topic: q.topic });
  H.phase = "result";
  Sound.play(dropper ? (steal ? "promote" : "correct") : "noanswer");
  lnPush(); lnDrawHost();
}
function lnDrop(col) {
  const H = S.host; if (!H || H.phase !== "drop" || !H.dropper || H.grid[col].length >= LN_ROWS) return;
  const row = H.grid[col].length;
  H.grid[col].push(H.dropper); H.last = [col, row];
  Sound.play("tap"); setTimeout(() => Sound.play("join"), 380);
  const line = lnFour(H.grid, col, row);
  if (line) {
    H.win = line; H.wins[H.dropper] += 1; H.phase = "roundwin";
    liMembers(H, H.dropper).forEach(p => { p.score += 200; p.last += 200; });
    setTimeout(() => Sound.play("gold"), 600);
  } else if (H.grid.every(c => c.length >= LN_ROWS)) {
    H.phase = "roundwin"; H.win = []; H.res.draw = true;
  } else { H.phase = "dropped"; H.turn = lnOther(H.turn); }
  lnPush(); lnDrawHost();
}
function lnLiveUI() {
  const H = S.host; if (!H || H.game !== "lineup" || H.phase !== "q") return;
  timerUI(H.left, H.total);
  const t = document.getElementById("tleft"); if (t) t.textContent = H.left;
  ["c", "a"].forEach(tm => { const el = document.getElementById("ans-" + tm); if (el) { const m = liMembers(H, tm); el.textContent = `${m.filter(p => H.answers[p.id] && H.answers[p.id].ans !== null).length} / ${m.length}`; } });
  const c = document.getElementById("closing"); if (c) c.hidden = !H.closing;
}
function lnEnd() {
  const H = S.host; stopTimer();
  H.champ = H.wins.c > H.wins.a ? "c" : H.wins.a > H.wins.c ? "a" : null;
  H.phase = "end"; Sound.stopMusic();
  lnPush(); lnDrawHost();
}
function lnDrawHost() {
  const H = S.host; if (!H) return;
  const players = Object.values(H.players);
  const statusText = H.status === "live" ? "Connected" : H.status === "error" ? "Connection problem" : H.status === "closed" ? "Disconnected" : "Connecting…";
  const hud = sub => `<div class="hud">${brand(sub)}<span class="stat${H.status === "error" ? " no" : ""}">${statusText}</span>${soundBtns(true)}</div>`;
  const codeBar = `<span class="stat">Join: <b>${JOIN_URL}</b> · code <b class="cy">${spaced(H.code)}</b></span>`;
  const teamCol = t => `<div class="li-team ${t}"><h3>${LI_TEAM[t].name} · ${liMembers(H, t).length}</h3><div class="li-members">${liMembers(H, t).map(p => `<span class="cu">${avatarSvg(p.avatar, "xs")}${esc(p.name)}<button class="li-swap" data-swap="${esc(p.id)}" title="Move to the other team" aria-label="Move ${esc(p.name)} to the other team">⇄</button></span>`).join("") || `<span class="muted small">Nobody yet</span>`}</div></div>`;
  const bindSwap = () => app.querySelectorAll("[data-swap]").forEach(b => b.onclick = () => { const id = b.dataset.swap; H.team[id] = H.team[id] === "c" ? "a" : "c"; lnPush(); lnDrawHost(); });
  if (H.phase === "lobby") {
    set(`${hud("The Lineup · teacher screen")}
      <section class="panel joinpanel">
        <div><span class="eyebrow">On your tablet go to</span><div class="joinurl">${JOIN_URL}</div></div>
        <div><span class="eyebrow">Game code</span><div class="bigcode">${spaced(H.code)}</div></div>
      </section>
      <section class="panel so-intro"><div><span class="eyebrow">The Lineup · ${H.cfg.best === 3 ? "best of 3" : "one round"}</span><h2>Four in a row wins</h2>${LN_RULES}</div>${lnBoardSvg({ grid: lnEmpty(), small: true })}</section>
      <section class="panel">
        <div class="row spread"><h3>Detectives in the room · ${players.length}</h3>
          <div class="row"><button class="btn primary big" id="start" ${liMembers(H, "c").length && liMembers(H, "a").length ? "" : "disabled"}>Start the game</button><button class="btn quiet" id="quit">Close game</button></div></div>
        <div class="li-teams">${teamCol("c")}${teamCol("a")}</div>
        <p class="muted small">Teams are balanced automatically. Tap ⇄ to move someone. You need at least one player on each team.</p>
      </section>`, true);
    const st = document.getElementById("start"); if (st) st.onclick = lnStartRound;
    bindSwap();
    document.getElementById("quit").onclick = () => { hostClose(); homeFn(); };
    return;
  }
  const roundLbl = `Round ${H.gr}${H.cfg.best === 3 ? " · best of 3" : ""}`;
  const q = H.qn !== undefined ? QUESTIONS[H.qn] : null;
  const turnBox = (big = false) => `<div class="li-turn ${H.turn}${big ? " li-big" : ""}"><span class="eyebrow">${LI_TEAM[H.turn].name}'s turn</span>
    <p>${LI_TEAM[H.turn].short} needs <b>half their team right</b> to drop a counter. If they miss, ${LI_TEAM[lnOther(H.turn)].short} can steal.</p></div>`;
  if (H.phase === "q") {
    set(`${hud(roundLbl)}
      <div class="row spread">${codeBar}<span class="stat">Answered: <span class="li-tag c" id="ans-c">0</span> <span class="li-tag a" id="ans-a">0</span></span></div>
      <div class="timer big" aria-hidden="true"><div class="timer-fill" style="width:100%"></div></div>
      <div class="li-wrap">
        <section class="panel li-main">${lnBoardSvg({ grid: H.grid })}</section>
        <section class="panel li-side">${turnBox()}
          ${qHead(q, `<span class="stat secs"><span id="tleft">${H.left}</span>s</span>`)}
          <p class="brief">${esc(q.brief)}</p>
          ${todoBanner(todoText(q, "board", false))}
          ${boardQ(q, H.perm, null)}
          <p class="closing" id="closing" ${H.closing ? "" : "hidden"}>Everyone has answered. Revealing in a few seconds…</p>
          <div class="row"><button class="btn primary" id="reveal">Reveal now</button><button class="btn quiet" id="quit">End game</button></div>
        </section></div>`, true);
    lnLiveUI();
    document.getElementById("reveal").onclick = lnReveal;
    document.getElementById("quit").onclick = lnEnd;
    return;
  }
  const r = H.res, pc = t => (r && r[t].of ? Math.round(100 * r[t].right / r[t].of) : 0);
  const vs = r ? `<div class="li-vs"><div class="c"><span class="pct">${pc("c")}%</span><span>Cyan · ${r.c.right} of ${r.c.of}</span></div><div class="a"><span class="pct">${pc("a")}%</span><span>Amber · ${r.a.right} of ${r.a.of}</span></div></div>` : "";
  if (H.phase === "result") {
    const d = r.dropper, last = H.log[H.log.length - 1];
    set(`${hud(roundLbl)}
      <div class="row spread">${codeBar}${liScore(H)}</div>
      <div class="li-wrap">
        <section class="panel li-main">${lnBoardSvg({ grid: H.grid })}</section>
        <section class="panel li-side">
          <div class="li-turn ${d || "none"} li-big"><span class="eyebrow">${LI_TEAM[r.turn].name}'s turn</span>
            <h2>${d ? (r.steal ? `Steal! ${LI_TEAM[d].name} drops a counter` : `${LI_TEAM[d].name} drops a counter`) : "No counter this time"}</h2>
            <p>${d ? `${LI_TEAM[d].short}, choose your column.` : `Neither team got half right. ${LI_TEAM[lnOther(r.turn)].short}'s turn next.`}</p></div>
          ${vs}
          <details><summary class="eyebrow">The question</summary><p class="brief small-brief">${esc(q.brief)}</p>${boardQ(q, H.perm, { dist: last.dist, answered: last.answered })}
            ${q.type === "spot" ? `<p>Final answer: <span class="answer">${esc(q.answer)}</span></p>` : ""}<p class="why"><b>Why:</b> ${esc(q.why)}</p></details>
          <div class="row">${d ? `<button class="btn primary big" id="choose">Choose the column</button>` : `<button class="btn primary big" id="nextq">Next question</button>`}<button class="btn quiet" id="quit">End game</button></div>
        </section></div>`, true);
    if (r.steal) later(200, () => Confetti.burst(60, d === "c" ? 0.3 : 0.7, 0.4));
    const ch = document.getElementById("choose"); if (ch) ch.onclick = () => { H.phase = "drop"; lnPush(); lnDrawHost(); };
    const nq = document.getElementById("nextq"); if (nq) nq.onclick = () => { H.turn = lnOther(H.turn); lnNextQuestion(); };
    document.getElementById("quit").onclick = lnEnd;
    return;
  }
  if (H.phase === "drop") {
    set(`${hud(roundLbl)}
      <div class="row spread">${codeBar}${liScore(H)}</div>
      <div class="li-wrap">
        <section class="panel li-main">${lnBoardSvg({ grid: H.grid, pick: true })}</section>
        <section class="panel li-side">
          <div class="li-turn ${H.dropper} li-big"><span class="eyebrow">${H.res.steal ? "Steal!" : "Your counter"}</span><h2>${LI_TEAM[H.dropper].name}, pick a column</h2>
            <p>Shout out a number from 1 to 7. Build your line of four, or block theirs.</p></div>
          <p class="muted">Teacher: tap the column they call out.</p>
          <div class="row"><button class="btn quiet" id="quit">End game</button></div>
        </section></div>`, true);
    app.querySelectorAll("[data-col]").forEach(g => { g.onclick = () => lnDrop(+g.dataset.col); g.onkeydown = e => { if (e.key === "Enter" || e.key === " ") lnDrop(+g.dataset.col); }; });
    document.getElementById("quit").onclick = lnEnd;
    return;
  }
  if (H.phase === "dropped" || H.phase === "roundwin") {
    const won = H.phase === "roundwin" && !H.res.draw, w = H.dropper;
    const matchOver = H.phase === "roundwin" && (H.cfg.best === 1 || H.wins.c >= 2 || H.wins.a >= 2 || H.gr >= 3);
    set(`${hud(roundLbl)}
      <div class="row spread">${codeBar}${liScore(H)}</div>
      <div class="li-wrap">
        <section class="panel li-main">${lnBoardSvg({ grid: H.grid, last: H.last, win: H.win })}</section>
        <section class="panel li-side">
          ${won ? `<div class="li-turn ${w} li-big"><span class="eyebrow">Round ${H.gr}</span><h2>Four in a row: ${LI_TEAM[w].name} wins the round!</h2><p>+200 for every ${LI_TEAM[w].short} detective.</p></div>`
            : H.phase === "roundwin" ? `<div class="li-turn none li-big"><h2>The board is full: this round is a draw</h2></div>`
            : `<div class="li-turn ${w}"><span class="eyebrow">Counter dropped in column ${H.last[0] + 1}</span><h2>${LI_TEAM[H.turn].name}'s turn next</h2></div>`}
          <div class="row">${H.phase === "dropped" ? `<button class="btn primary big" id="nextq">Next question</button>` : matchOver ? `<button class="btn primary big" id="final">Final results</button>` : `<button class="btn primary big" id="nextround">Next round</button>`}<button class="btn quiet" id="quit">End game</button></div>
        </section></div>`, true);
    if (won) later(700, () => Confetti.burst(200, w === "c" ? 0.3 : 0.7, 0.3));
    const nq = document.getElementById("nextq"); if (nq) nq.onclick = lnNextQuestion;
    const nr = document.getElementById("nextround"); if (nr) nr.onclick = lnStartRound;
    const fi = document.getElementById("final"); if (fi) fi.onclick = lnEnd;
    document.getElementById("quit").onclick = lnEnd;
    return;
  }
  /* end */
  const rk = ranking(), champ = H.champ;
  const byTopic = {}; H.log.forEach(e => { byTopic[e.topic] = byTopic[e.topic] || { right: 0, of: 0 }; byTopic[e.topic].right += e.right; byTopic[e.topic].of += e.of; });
  const topics = Object.entries(byTopic).sort((a, b) => a[1].right / Math.max(1, a[1].of) - b[1].right / Math.max(1, b[1].of));
  const steals = { c: H.log.filter(e => e.steal && e.dropper === "c").length, a: H.log.filter(e => e.steal && e.dropper === "a").length };
  set(`${hud("The Lineup · final results")}<div class="tape"></div>
    <section class="panel center li-champ ${champ || "none"}"><span class="eyebrow">Match result</span><h2>${champ ? `${LI_TEAM[champ].name} wins the match!` : "It's a draw!"}</h2>${liScore(H)}
      <p class="muted">Steals: Cyan ${steals.c} · Amber ${steals.a}</p></section>
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
    H.round += 1; H.gr = 0; H.wins = { c: 0, a: 0 }; H.log = []; H.used.clear(); H.pool = []; H.grid = lnEmpty(); H.phase = "lobby";
    Object.values(H.players).forEach(p => Object.assign(p, { score: 0, correct: 0, wrong: 0, streak: 0, best: 0, last: 0, ok: false, prevRank: 0 }));
    Sound.startMusic("show"); lnPush(); lnDrawHost();
  };
  document.getElementById("new").onclick = () => { hostClose(); lnHostSetup(); };
  document.getElementById("home").onclick = () => { hostClose(); homeFn(); };
}

/* ================= STUDENT ================= */
function lnStudentState(st) {
  const P = S.stu;
  if (st.round !== P.round) { P.round = st.round; P.hist = []; P.lastRank = 0; }
  P.state = st;
  const key = `${st.round}:${st.phase}:${st.gr}:${st.qk}`;
  const mine = st.scores && st.scores[P.id], myT = st.teams && st.teams[P.id];
  if (key === P.key) {
    if (st.phase === "q") { P.left = Math.min(P.left, st.left); timerUI(P.left, st.total); const t = document.getElementById("tleft"); if (t) t.textContent = P.left; const c = document.getElementById("closing"); if (c) c.hidden = !st.closing; }
    else if (st.phase === "lobby") lnDrawStudent();
    return;
  }
  const prevPhase = P.key ? P.key.split(":")[1] : "";
  P.key = key;
  stopTimer();
  if (st.phase === "q") {
    P.L = freshPad(); P.left = st.left;
    S.pad = { L: P.L, act: (a, v) => lnStudentAct(a, v) };
    tick = setInterval(() => { P.left = Math.max(0, P.left - 1); timerUI(P.left, st.total); const t = document.getElementById("tleft"); if (t) t.textContent = P.left; }, 1000);
  } else S.pad = null;
  if (st.phase === "result" && st.qn !== null) {
    const q = QUESTIONS[st.qn];
    P.hist.push({ q, ok: !!(mine && mine.ok), ans: P.L ? P.L.sentAns : null });
    Sound.play(mine && mine.ok ? "correct" : P.L && P.L.sentAns !== null ? "wrong" : "noanswer");
    if (st.res && st.res.dropper) setTimeout(() => Sound.play(st.res.dropper === myT ? "promote" : "standings"), 500);
  }
  if (st.phase === "dropped") Sound.play("join");
  if (st.phase === "roundwin" && st.win && st.win.length) setTimeout(() => Sound.play(st.dropper === myT ? "gold" : "end"), 400);
  if (st.phase === "end") studentSave();
  lnDrawStudent();
}
function lnStudentAct(act, v) {
  const P = S.stu, st = P && P.state;
  if (!st || st.phase !== "q") return;
  const q = QUESTIONS[st.qn], L = P.L, r = padAct(q, L, act, v);
  if (!r) return;
  const send = ans => P.ch.send({ type: "broadcast", event: "answer", payload: { id: P.id, name: S.player.name, avatar: S.player.avatar, round: st.round, qk: st.qk, ans } });
  if (r === "ans") { L.sentAns = L.ans; send(L.ans); Sound.play("tap"); }
  if (act === "seq-send" && L.ans) { L.sentAns = L.ans.slice(); send(L.sentAns); Sound.play("tap"); }
  if (r === "text" && q.type === "type") { L.sentAns = L.ans; L.sentText = L.ans; send(L.ans); Sound.play("tap"); }
  if (r === "seq") Sound.play("tap");
  lnDrawStudent(true);
}
function lnDrawStudent(keep = false) {
  const P = S.stu, st = P.state, mine = st.scores && st.scores[P.id], myT = st.teams && st.teams[P.id];
  const me = `<div class="who">${avatarSvg(S.player.avatar, "sm")}${esc(S.player.name)}</div>`;
  const cnt = mine ? counters(mine.correct, mine.wrong) : "";
  const hud = extra => `<div class="hud">${me}${myT ? liTeamTag(myT) : ""}${extra || ""}${cnt}${soundBtns()}</div>`;
  const wins = `<span class="stat"><span class="li-tag c">${st.wins.c}</span> <span class="li-tag a">${st.wins.a}</span></span>`;
  const board = (o = {}) => `<section class="panel">${lnBoardSvg(Object.assign({ grid: st.grid, small: true }, o))}</section>`;
  if (st.phase === "lobby") {
    return set(`${hud(`<span class="stat">Game <b>${spaced(P.code)}</b></span>`)}
      <section class="panel center li-joined ${myT || ""}">${avatarSvg(S.player.avatar, "lg")}<span class="eyebrow">You're in, ${esc(S.player.name)}</span>
        <h2>${myT ? `You're on the ${LI_TEAM[myT].name}` : "Finding your team…"}</h2>${myT ? `<p>Get four ${LI_TEAM[myT].short} counters in a row.</p>` : ""}</section>
      <section class="panel"><span class="eyebrow">The Lineup</span>${LN_RULES}</section>`);
  }
  if (st.phase === "q") {
    const q = QUESTIONS[st.qn], mineTurn = st.turn === myT;
    return set(`${hud(`<span class="stat">${LI_TEAM[st.turn].short}'s turn</span>`)}
      <div class="timer" aria-hidden="true"><div class="timer-fill" style="width:${(P.left / st.total) * 100}%"></div></div>
      <section class="panel">
        <div class="li-turn ${st.turn}"><b>${mineTurn ? "Your team's turn: get at least half of you right to drop a counter." : `${LI_TEAM[st.turn].name}'s turn. If they miss and half of you are right, you steal it!`}</b></div>
        ${qHead(q, `<span class="stat secs"><span id="tleft">${P.left}</span>s</span>`)}
        <p class="brief">${esc(q.brief)}</p>
        ${todoBanner(todoText(q, "live", false))}
        ${deviceQ(q, st.perm, P.L, { mode: "live", typed: false })}
        <p class="closing" id="closing" ${st.closing ? "" : "hidden"}>Everyone has answered. A few seconds left to change your answer.</p>
      </section>`, false, keep);
  }
  if (st.phase === "result" || st.phase === "drop") {
    const q = QUESTIONS[st.qn], h = P.hist[P.hist.length - 1], ok = mine && mine.ok, r = st.res, d = r && r.dropper;
    const pc = t => (r[t].of ? Math.round(100 * r[t].right / r[t].of) : 0);
    return set(`${hud(wins)}
      <section class="panel">
        <div class="result ${ok ? "good" : "bad"}"><span class="rhead">${ok ? `Correct · +${mine.last}` : h && h.ans !== null ? "Not this time" : "No answer in time"}</span>
          ${!ok && h && h.ans !== null && h.ans !== undefined ? `<p>You said: <b>${esc(ansLabel(q, h.ans))}</b></p>` : ""}
          <p>Correct answer: <span class="answer">${esc(rightLabel(q))}</span></p><p class="why"><b>Why:</b> ${esc(q.why)}</p></div>
        <div class="li-vs"><div class="c"><span class="pct">${pc("c")}%</span><span>Cyan</span></div><div class="a"><span class="pct">${pc("a")}%</span><span>Amber</span></div></div>
        <div class="li-turn ${d || "none"}"><b>${d ? (d === myT ? (r.steal ? "Your team stole the drop! Shout your column." : "Your team drops a counter: shout your column!") : `${LI_TEAM[d].name} ${r.steal ? "stole the drop" : "drops a counter"}.`) : "No counter this time."}</b></div>
      </section>${board()}`);
  }
  if (st.phase === "dropped" || st.phase === "roundwin") {
    const won = st.phase === "roundwin" && st.win && st.win.length;
    return set(`${hud(wins)}
      ${won ? `<section class="panel center li-turn ${st.dropper} li-big"><h2>${st.dropper === myT ? "Four in a row: your team wins the round!" : `${LI_TEAM[st.dropper].name} wins the round`}</h2></section>`
        : st.phase === "roundwin" ? `<section class="panel center"><h2>The board is full: a draw</h2></section>` : `<section class="panel center"><p>Counter dropped. <b>${LI_TEAM[st.turn].name}'s turn next.</b></p></section>`}
      ${board({ last: st.last, win: st.win })}`);
  }
  /* end: the usual end screen with the match result on top */
  const res = drawStudent(keep), champ = st.champ, hudEl = app.querySelector(".hud");
  if (hudEl) hudEl.insertAdjacentHTML("afterend", `<section class="panel center li-champ ${champ || "none"}"><h2>${champ ? (champ === myT ? "Your team wins the match!" : `${LI_TEAM[champ].name} wins the match`) : "The match is a draw"}</h2>
    <p><span class="li-tag c">Cyan ${st.wins.c}</span> <span class="li-tag a">Amber ${st.wins.a}</span></p></section>`);
  return res;
}
