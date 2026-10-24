/* ================= THE IDENTIKIT: live class game =================
   A hidden picture sits under 16 numbered tiles. Each question the class answers lifts tiles off:
   the more students who get it right, the more tiles come off (1 to 4). At any time a student can make
   ONE identification from a line-up of four names: the more tiles still covering the picture, the more
   it scores. Graphs, shapes and solids use questions on the picture's own topic; famous people and
   catchphrases use the topics the teacher picks. */
const IK_TILES = 16, IK_MAXQ = 10;
const IK_CATS = ["graphs", "shapes", "solids", "people", "catch"];
const ikIdPoints = covered => 200 + 50 * covered;
const ikTilesFor = (right, of) => 1 + Math.round(3 * (of ? right / of : 0));
const ikQPoints = (left, total) => 100 + Math.round(100 * Math.max(0, left) / Math.max(1, total));

/* the picture with its tiles; newly lifted tiles animate off */
function ikFrame(pic, off = [], fresh = [], o = {}) {
  const offS = new Set(off), freshS = new Set(fresh);
  let order = 0;
  return `<div class="ik-frame${o.big ? " big" : ""}${o.solved ? " solved" : ""}">
    <div class="ik-pic">${IK.html(pic)}</div>
    ${o.solved ? "" : `<div class="ik-tiles">${Array.from({ length: IK_TILES }, (_, i) => {
      const f = freshS.has(i), gone = offS.has(i) && !f;
      return `<div class="ik-t${gone ? " off" : ""}${f ? " go" : ""}" ${f ? `style="--d:${(order++) * 0.35}s"` : ""}><span>${i + 1}</span></div>`; }).join("")}</div>`}
  </div>`;
}
const ikLineup = (names, opts = {}) => `<div class="ik-lineup${opts.board ? " board" : ""}">${names.map((n, k) =>
  `<${opts.pick ? "button" : "div"} class="ik-sus${opts.right === n ? " right" : opts.right ? " dim" : ""}${opts.chosen === k ? " chosen" : ""}" ${opts.pick ? `data-ik="pick" data-k="${k}"` : ""}>
    <span class="ik-no">${k + 1}</span><span class="ik-nm">${esc(n)}</span>${opts.counts ? `<span class="cnt">${opts.counts[k] || 0}</span>` : ""}</${opts.pick ? "button" : "div"}>`).join("")}</div>`;
const IK_RULES = `<ul class="so-rules">
  <li><b>A hidden picture</b> is under 16 tiles: a graph, a shape, a solid, a famous mathematician or scientist, or a catchphrase.</li>
  <li><b>Answer the questions.</b> The more of the class who get each one right, the more tiles come off.</li>
  <li><b>Make one ID</b> from the line-up whenever you think you know. The more tiles still covering the picture, the more you score. A wrong ID scores nothing.</li></ul>`;

/* ================= HOST ================= */
function ikHostSetup() {
  stopTimer(); S.pad = null;
  if (!liveConfigured()) return liveMissing(homeFn);
  if (gating() && !S.acc.signed_in) return signInToHost(homeFn);
  const cfg = withFilter(store.get("ir-ik", null), { n: 3, time: "auto", tier: "H", topics: [], cats: IK_CATS.slice() });
  cfg.cats = Array.isArray(cfg.cats) && cfg.cats.length ? cfg.cats.filter(c => IK.CATS[c]) : IK_CATS.slice();
  const avail = () => IK.PICS.filter(p => cfg.cats.includes(p.cat) && (cfg.tier !== "F" || p.tier === "F")).length;
  const draw = (keep = false) => {
    const needTopics = cfg.cats.includes("people") || cfg.cats.includes("catch");
    set(`${brand("The Identikit · teacher")}
      ${gameSwitch("ik")}
      <section class="panel"><span class="eyebrow">Live class game</span><h2>The Identikit</h2>
        <ol class="so-teach">
          <li><b>Open the game</b> and show this screen on the board. Students go to <b>${JOIN_URL}</b> and type the code.</li>
          <li><b>A picture hides under 16 tiles.</b> The class answers questions on their tablets, and the more who get each one right, the more tiles come off.</li>
          <li><b>Students make one ID</b> from a line-up of four whenever they're ready. Earlier IDs score more; a wrong ID scores nothing.</li>
          <li><b>The unmasking</b> reveals the picture with a fact about it, and who identified it first.</li>
        </ol>
        <span class="eyebrow">Pictures to include</span>
        <div class="choice">${IK_CATS.map(c => `<button class="btn" data-ikcat="${c}" aria-pressed="${cfg.cats.includes(c)}">${esc(IK.CATS[c])}</button>`).join("")}</div>
        <p class="muted small">Graphs, shapes and solids ask questions on the picture's own topic (a hidden quadratic means quadratic questions). ${needTopics ? "Famous people and catchphrases use the topics below." : ""}</p>
        <span class="eyebrow">Tier</span>${choice("tier", cfg.tier, [["F", "Foundation"], ["H", "Higher (includes Foundation)"]])}
        ${needTopics ? `<div class="ik-topics"><span class="eyebrow">Topics for famous people and catchphrase rounds</span>${topicPicker(cfg)}</div>` : ""}
        <span class="eyebrow">Number of pictures</span>${choice("n", cfg.n, [[3, "3"], [5, "5"], [8, "8"]])}
        <span class="eyebrow">Time per question</span>${choice("time", cfg.time, [["auto", "Auto: suits each question"], [20, "20 s"], [30, "30 s"], [45, "45 s"]])}
        <p class="muted small">${avail()} pictures match these settings.</p>
        <div class="row"><button class="btn primary big" id="go" ${avail() && cfg.cats.length ? "" : "disabled"}>Open the game</button><button class="btn" id="back">Back</button>${soundBtns(true)}</div>
      </section>`, true, keep);
    const redraw = () => draw(true);
    bindGameSwitch();
    if (needTopics) bindTopicPicker(cfg, redraw);
    app.querySelectorAll("[data-ikcat]").forEach(b => b.onclick = () => { const c = b.dataset.ikcat; cfg.cats = cfg.cats.includes(c) ? cfg.cats.filter(x => x !== c) : cfg.cats.concat(c); redraw(); });
    bindChoice("tier", v => { cfg.tier = v; redraw(); });
    bindChoice("n", v => { cfg.n = +v; redraw(); });
    bindChoice("time", v => { cfg.time = v === "auto" ? "auto" : +v; redraw(); });
    document.getElementById("back").onclick = homeFn;
    document.getElementById("go").onclick = () => { saveCfg("ir-ik", cfg); Sound.unlock(); claimGame("host", () => ikHostStart(cfg), ikHostSetup); };
  };
  draw();
}
/* choose the pictures (mixing the categories) and the questions for each */
function ikPlan(cfg) {
  const ok = p => cfg.cats.includes(p.cat) && (cfg.tier !== "F" || p.tier === "F");
  const byCat = {}; shuffle(IK.PICS.filter(ok)).forEach(p => { (byCat[p.cat] = byCat[p.cat] || []).push(p); });
  const cats = shuffle(Object.keys(byCat)), out = [], usedNames = new Set();
  for (let k = 0; out.length < cfg.n && k < 200; k++) {
    const list = byCat[cats[k % cats.length]];
    if (!list || !list.length) { if (Object.values(byCat).every(l => !l.length)) break; continue; }
    const p = list.shift(); if (usedNames.has(p.name)) continue;
    usedNames.add(p.name); out.push(p);
  }
  const used = new Set();
  return out.map(p => {
    const own = p.topics && p.topics.length && p.cat !== "people" && p.cat !== "catch";
    /* free plan: only the sample topics */
    const lim = t => { if (!cfg.allow) return t; const ok = t.filter(x => cfg.allow.includes(x)); return ok.length ? ok : cfg.allow; };
    const pick = topics => shuffle(poolFor({ tier: cfg.tier, topics: lim(topics), mix: "mixed" }).filter(q => !used.has(q.n)));
    let qs = pick(own ? p.topics : cfg.topics);
    if (own && qs.length < IK_MAXQ) {      /* top up from the same strand, then anything */
      const strand = p.topics[0][0];
      qs = qs.concat(pick(TOPIC_IDS.filter(t => t[0] === strand && !p.topics.includes(t))));
    }
    if (qs.length < IK_MAXQ) qs = qs.concat(pick([]).filter(q => !qs.includes(q)));
    qs = qs.slice(0, IK_MAXQ); qs.forEach(q => used.add(q.n));
    return { id: p.id, lineup: IK.lineup(p), order: shuffle([...Array(IK_TILES).keys()]), qs: qs.map(q => q.n), perms: qs.map(q => makePerm(q)) };
  });
}
function ikHostStart(cfg) {
  const code = String(100000 + Math.floor(Math.random() * 900000));
  const H = S.host = { game: "identikit", code, cfg, round: 1, phase: "lobby", pi: -1, qi: -1, plan: [], off: [], fresh: [], players: {}, online: new Set(), kicked: new Set(), answers: {}, ids: {}, left: 0, total: 0, stats: [], qstats: [], status: "connecting" };
  ikNewRound(H);
  const ch = sb().channel("ir-" + code, { config: { broadcast: { self: false }, presence: { key: "host" } } });
  H.ch = ch;
  ch.on("broadcast", { event: "hello" }, ({ payload }) => { addPlayer(payload); ikPush(); if (H.phase === "lobby") ikDrawHost(); })
    .on("broadcast", { event: "answer" }, ({ payload }) => ikOnAnswer(payload))
    .on("broadcast", { event: "ident" }, ({ payload }) => ikOnIdent(payload))
    .on("presence", { event: "sync" }, () => {
      const st = ch.presenceState();
      H.online = new Set(Object.keys(st).filter(k => k !== "host"));
      Object.keys(st).forEach(k => { if (k !== "host" && st[k][0]) addPlayer(st[k][0]); });
      if (H.phase === "lobby") ikDrawHost(); else ikLiveUI();
    })
    .subscribe(status => {
      if (status === "SUBSCRIBED") { H.status = "live"; ch.track({ role: "host" }); ikPush(); }
      else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") H.status = "error";
      else if (status === "CLOSED") H.status = "closed";
      if (H.phase === "lobby") ikDrawHost();
    });
  H.beat = setInterval(ikPush, 3000);
  armGuard(() => { hostClose(); homeFn(); }, "Leaving ends the game for every student.");
  Sound.startMusic();
  ikDrawHost();
}
function ikNewRound(H) {
  H.plan = ikPlan(H.cfg);
  H.pi = -1; H.qi = -1; H.off = []; H.fresh = []; H.ids = {}; H.stats = []; H.qstats = []; H.phase = "lobby";
  Object.values(H.players).forEach(p => Object.assign(p, { score: 0, correct: 0, wrong: 0, streak: 0, best: 0, last: 0, ok: false, prevRank: 0, idsRight: 0, idOk: false, idPts: 0, idPick: null, qok: false, qpts: 0 }));
}
const ikPic = H => IK.byId[H.plan[H.pi].id];
const ikQ = H => QUESTIONS[H.plan[H.pi].qs[H.qi]];
function ikPush() {
  const H = S.host; if (!H || !H.ch || H.status !== "live" || H.game !== "identikit") return;
  const P = H.pi >= 0 && H.pi < H.plan.length ? H.plan[H.pi] : null;
  const inQ = P && H.qi >= 0 && H.qi < P.qs.length;
  const payload = { game: "identikit", phase: H.phase, round: H.round, pi: H.pi, n: H.plan.length, qi: H.qi,
    qn: inQ && (H.phase === "q" || H.phase === "tiles") ? P.qs[H.qi] : null, perm: inQ ? P.perms[H.qi] : null,
    pic: P && H.phase !== "lobby" ? P.id : null, lineup: P ? P.lineup : null, off: H.off, fresh: H.fresh,
    left: H.left, total: H.total, closing: !!H.closing, kicked: [...H.kicked], code: H.code, done: Object.keys(H.ids), typed: false };
  if (H.phase === "tiles") { const s = H.qstats[H.qstats.length - 1]; payload.qres = s ? { right: s.right, of: s.of, removed: H.fresh.length } : null; }
  if (H.phase === "unmask") { const s = H.stats[H.stats.length - 1]; payload.unmask = { name: ikPic(H).name, fact: ikPic(H).fact, first: s.first, right: s.right, of: s.of }; }
  if (["tiles", "unmask", "standings", "end"].includes(H.phase)) {
    const rk = ranking(), scores = {};
    rk.forEach((p, k) => { scores[p.id] = { score: p.score, rank: k + 1, of: rk.length, last: p.last, correct: p.correct, wrong: p.wrong, streak: p.streak, best: p.best,
      gap: k > 0 ? rk[k - 1].score - p.score : 0, above: k > 0 ? rk[k - 1].name : "", qok: p.qok, qpts: p.qpts, idOk: p.idOk, idPts: p.idPts, idPick: p.idPick, idsRight: p.idsRight }; });
    payload.scores = scores;
  }
  H.ch.send({ type: "broadcast", event: "state", payload });
}
function ikNextPicture() {
  const H = S.host;
  H.pi += 1;
  if (H.pi >= H.plan.length) return ikHostEnd();
  H.qi = -1; H.off = []; H.fresh = []; H.ids = {};
  Object.values(H.players).forEach(p => Object.assign(p, { last: 0, idOk: false, idPts: 0, idPick: null }));
  ikNextQuestion();
}
function ikNextQuestion() {
  const H = S.host;
  H.qi += 1; H.fresh = [];
  const P = H.plan[H.pi];
  if (H.qi >= P.qs.length || H.off.length >= IK_TILES) return ikUnmask();
  const q = ikQ(H);
  H.phase = "q"; H.total = secsFor(q, H.cfg.time, false); H.left = H.total; H.answers = {}; H.closing = false;
  Sound.startMusic(); clearTimeout(H.auto);
  ikDrawHost(); ikPush();
  stopTimer();
  tick = setInterval(() => {
    H.left = Math.max(0, H.left - 1);
    ikLiveUI();
    if (H.left <= 5 && H.left > 0) Sound.play("tick");
    if (H.left % 5 === 0 || H.closing) ikPush();
    if (H.left === 0) ikRevealQ();
  }, 1000);
}
function ikOnAnswer(p) {
  const H = S.host;
  if (!H || H.game !== "identikit" || H.phase !== "q" || !p || p.pi !== H.pi || p.qi !== H.qi || p.round !== H.round || H.kicked.has(p.id)) return;
  addPlayer(p);
  const a = H.answers[p.id] = H.answers[p.id] || { ans: null, left: H.left };
  if (p.ans !== undefined && p.ans !== null && JSON.stringify(p.ans) !== JSON.stringify(a.ans)) { a.ans = p.ans; a.left = H.left; }
  ikLiveUI();
  const online = [...H.online].filter(id => H.players[id]);
  if (!H.closing && online.length && online.every(id => H.answers[id] && H.answers[id].ans !== null) && H.left > 4) { H.closing = true; H.left = 4; ikLiveUI(); ikPush(); }
}
function ikOnIdent(p) {
  const H = S.host;
  if (!H || H.game !== "identikit" || !["q", "tiles"].includes(H.phase) || !p || p.pi !== H.pi || p.round !== H.round || H.kicked.has(p.id) || H.ids[p.id]) return;
  const k = +p.k; if (!Number.isInteger(k) || k < 0 || k > 3) return;
  addPlayer(p);
  H.ids[p.id] = { k, covered: IK_TILES - H.off.length, t: Date.now() };
  Sound.play("arrest");
  ikLiveUI(); ikPush();
}
function ikRevealQ() {
  const H = S.host; stopTimer();
  if (!H || H.phase !== "q") return;
  const q = ikQ(H);
  let right = 0, answered = 0; const dist = {};
  Object.values(H.players).forEach(p => {
    const a = H.answers[p.id], has = a && a.ans !== null && a.ans !== undefined;
    p.qok = false; p.qpts = 0;
    if (has) { answered += 1; const key = Array.isArray(a.ans) ? "seq" : a.ans; dist[key] = (dist[key] || 0) + 1; }
    if (has && isCorrect(q, a.ans)) { p.qok = true; right += 1; p.correct += 1; p.streak += 1; p.best = Math.max(p.best, p.streak); p.qpts = ikQPoints(a.left, H.total); p.score += p.qpts; p.last += p.qpts; }
    else { p.wrong += 1; p.streak = 0; }
  });
  const of = Object.keys(H.players).length;
  const P = H.plan[H.pi], want = ikTilesFor(right, of);
  H.fresh = P.order.filter(i => !H.off.includes(i)).slice(0, want);
  H.off = H.off.concat(H.fresh);
  H.qstats.push({ pi: H.pi, qn: P.qs[H.qi], right, answered, of, dist });
  H.phase = "tiles";
  Sound.play(right ? "correct" : "reveal");
  ikPush(); ikDrawHost();
}
const ikAllIded = H => { const online = [...H.online].filter(id => H.players[id]); return online.length > 0 && online.every(id => H.ids[id]); };
function ikUnmask() {
  const H = S.host; stopTimer(); clearTimeout(H.auto);
  const pic = ikPic(H), P = H.plan[H.pi];
  const prev = {}; ranking().forEach((p, k) => { prev[p.id] = k + 1; });
  let right = 0, first = null; const counts = [0, 0, 0, 0];
  Object.values(H.players).forEach(p => {
    const d = H.ids[p.id]; p.prevRank = prev[p.id]; p.idOk = false; p.idPts = 0; p.idPick = d ? P.lineup[d.k] : null;
    if (!d) return;
    counts[d.k] += 1;
    if (P.lineup[d.k] === pic.name) {
      p.idOk = true; p.idsRight += 1; right += 1; p.idPts = ikIdPoints(d.covered); p.score += p.idPts; p.last += p.idPts;
      if (!first || d.t < first.t) first = { name: p.name, avatar: p.avatar, covered: d.covered, t: d.t, pts: p.idPts };
    }
  });
  H.stats.push({ pi: H.pi, id: pic.id, right, of: Object.keys(H.players).length, made: Object.keys(H.ids).length, counts, first, tilesLeft: IK_TILES - H.off.length });
  H.phase = "unmask"; H.fresh = [];
  Sound.play("gold");
  ikPush(); ikDrawHost();
}
function ikLiveUI() {
  const H = S.host; if (!H || H.game !== "identikit") return;
  if (H.phase === "q") {
    timerUI(H.left, H.total);
    const t = document.getElementById("tleft"); if (t) t.textContent = H.left;
    const a = document.getElementById("acount"); if (a) a.textContent = Object.values(H.answers).filter(x => x.ans !== null).length;
    const c = document.getElementById("closing"); if (c) c.hidden = !H.closing;
  }
  const n = document.getElementById("pcount"); if (n) n.textContent = Object.keys(H.players).length;
  const ids = document.getElementById("idlist");
  if (ids) ids.innerHTML = Object.keys(H.ids).map(id => H.players[id]).filter(Boolean).map(p => `<span class="cu">${avatarSvg(p.avatar, "xs")}${esc(p.name)}</span>`).join("") || `<span class="muted small">No IDs yet.</span>`;
  const ic = document.getElementById("idcount"); if (ic) ic.textContent = Object.keys(H.ids).length;
}
function ikHostEnd() {
  const H = S.host; stopTimer(); clearTimeout(H.auto);
  H.phase = "end"; Sound.stopMusic();
  ikPush(); ikDrawHost();
}
function ikDrawHost() {
  const H = S.host; if (!H) return;
  const players = Object.values(H.players);
  const statusText = H.status === "live" ? "Connected" : H.status === "error" ? "Connection problem" : H.status === "closed" ? "Disconnected" : "Connecting…";
  const hud = sub => `<div class="hud">${brand(sub)}<span class="stat${H.status === "error" ? " no" : ""}">${statusText}</span>${soundBtns(true)}</div>`;
  const codeBar = `<span class="stat">Join: <b>${JOIN_URL}</b> · code <b class="cy">${spaced(H.code)}</b></span>`;
  if (H.phase === "lobby") {
    set(`${hud(H.round > 1 ? "The Identikit · next round" : "The Identikit · teacher screen")}
      <section class="panel joinpanel">
        <div><span class="eyebrow">On your tablet go to</span><div class="joinurl">${JOIN_URL}</div></div>
        <div><span class="eyebrow">Game code</span><div class="bigcode">${spaced(H.code)}</div></div>
      </section>
      <section class="panel so-intro"><div><span class="eyebrow">The Identikit · ${H.plan.length} pictures</span><h2>Who, or what, is under the tiles?</h2>${IK_RULES}</div>
        <div class="ik-demo">${ikFrame({ draw: () => `<svg viewBox="0 0 600 600"><rect width="600" height="600" fill="#0E1636"/><text x="300" y="360" font-size="260" text-anchor="middle" fill="#FFC857" font-family="Josefin Sans, sans-serif" font-weight="700">?</text></svg>` }, [5, 10], [])}</div></section>
      <section class="panel">
        <div class="row spread"><h3>Detectives in the room · ${players.length}</h3>
          <div class="row"><button class="btn primary big" id="start" ${players.length ? "" : "disabled"}>Start the Identikit</button><button class="btn quiet" id="quit">Close game</button></div></div>
        ${players.length ? `<div class="teams">${players.map(p => `<div class="team">${avatarSvg(p.avatar, "sm")}<span class="tn grow">${esc(p.name)}</span><button class="kick" data-kick="${esc(p.id)}" aria-label="Remove ${esc(p.name)}">×</button></div>`).join("")}</div>`
          : `<p class="muted">Waiting for students to join…</p>`}
        <p class="muted small">${H.cfg.cats.map(c => IK.CATS[c]).join(", ")} · ${H.cfg.tier === "F" ? "Foundation" : "Higher"}</p>
      </section>`, true);
    const st = document.getElementById("start"); if (st) st.onclick = ikNextPicture;
    app.querySelectorAll("[data-kick]").forEach(b => b.onclick = () => { H.kicked.add(b.dataset.kick); delete H.players[b.dataset.kick]; ikPush(); ikDrawHost(); });
    document.getElementById("quit").onclick = () => { hostClose(); homeFn(); };
    return;
  }
  const P = H.pi >= 0 && H.pi < H.plan.length ? H.plan[H.pi] : null, pic = P ? IK.byId[P.id] : null;
  const head = `Picture ${H.pi + 1} of ${H.plan.length}`;
  const left = (extra = "") => `<section class="panel ik-left">${ikFrame(pic, H.off, H.fresh, { big: true })}
    <div><span class="eyebrow">The line-up: who or what is it?</span>${ikLineup(P.lineup, { board: true })}</div>${extra}</section>`;
  const idBox = `<div><span class="eyebrow">IDs made · <span id="idcount">0</span></span><div class="custody" id="idlist"></div></div>`;
  if (H.phase === "q") {
    const q = ikQ(H), perm = P.perms[H.qi];
    set(`${hud(head)}
      <div class="row spread">${codeBar}<span class="stat">Answered <b id="acount">0</b> / <span id="pcount">${players.length}</span> · tiles left <b>${IK_TILES - H.off.length}</b></span></div>
      <div class="timer big" aria-hidden="true"><div class="timer-fill" style="width:100%"></div></div>
      <div class="ik-board">${left()}
        <section class="panel">
          ${qHead(q, `<span class="stat secs"><span id="tleft">${H.left}</span>s</span>`)}
          <p class="brief">${esc(q.brief)}</p>
          ${todoBanner(todoText(q, "board", false))}
          ${boardQ(q, perm, null)}
          <p class="closing" id="closing" ${H.closing ? "" : "hidden"}>Everyone has answered. Lifting tiles in a few seconds…</p>
          ${idBox}
          <div class="row"><button class="btn primary" id="reveal">Reveal answer</button><button class="btn quiet" id="unmask">Unmask now</button><button class="btn quiet" id="quit">End game</button></div>
        </section></div>`, true);
    ikLiveUI();
    document.getElementById("reveal").onclick = ikRevealQ;
    document.getElementById("unmask").onclick = ikUnmask;
    document.getElementById("quit").onclick = ikHostEnd;
    return;
  }
  if (H.phase === "tiles") {
    const q = ikQ(H), perm = P.perms[H.qi], s = H.qstats[H.qstats.length - 1];
    const done = H.off.length >= IK_TILES || H.qi + 1 >= P.qs.length || ikAllIded(H);
    const pct = s.of ? Math.round(100 * s.right / s.of) : 0;
    set(`${hud(head)}
      <div class="row spread">${codeBar}<span class="stat"><b>${s.right}</b> of ${s.of} right · tiles left <b>${IK_TILES - H.off.length}</b></span></div>
      <div class="ik-board">${left()}
        <section class="panel">
          <div class="ik-lift"><span class="ik-big">${H.fresh.length}</span><span>tile${H.fresh.length === 1 ? "" : "s"} lifted<br><small>${pct}% of the class got it right</small></span></div>
          ${qHead(q)}<p class="brief">${esc(q.brief)}</p>
          ${boardQ(q, perm, { dist: s.dist, answered: s.answered })}
          ${q.type === "spot" ? `<p>Final answer: <span class="answer">${esc(q.answer)}</span></p>` : ""}
          <p class="why"><b>Why:</b> ${esc(q.why)}</p>
          ${idBox}
          <div class="row">${done ? `<button class="btn primary big" id="unmask">Unmask the picture</button>` : `<button class="btn primary big" id="nextq">Next question</button><button class="btn quiet" id="unmask">Unmask now</button>`}<button class="btn quiet" id="quit">End game</button></div>
        </section></div>`, true);
    ikLiveUI();
    if (H.fresh.length) later(200, () => Sound.play("promote"));
    const nq = document.getElementById("nextq"); if (nq) nq.onclick = ikNextQuestion;
    document.getElementById("unmask").onclick = ikUnmask;
    document.getElementById("quit").onclick = ikHostEnd;
    return;
  }
  if (H.phase === "unmask") {
    const s = H.stats[H.stats.length - 1];
    set(`${hud(head + " · unmasked")}
      <div class="ik-board">
        <section class="panel ik-left">${ikFrame(pic, [], [], { big: true, solved: true })}</section>
        <section class="panel">
          <span class="eyebrow">${esc(IK.CATS[pic.cat])}</span><h2 class="ik-name">${esc(pic.name)}</h2>
          <p class="ik-fact">${esc(pic.fact)}</p>
          ${ikLineup(P.lineup, { board: true, right: pic.name, counts: s.counts })}
          <div class="result good"><span class="rhead">${s.right} of ${s.of} identified it</span>
            ${s.first ? `<p class="so-fast">${avatarSvg(s.first.avatar, "sm")}<span>First correct ID: <b>${esc(s.first.name)}</b>, with ${s.first.covered} tile${s.first.covered === 1 ? "" : "s"} still on · +${s.first.pts}</span></p>` : `<p>Nobody made a correct ID this time.</p>`}
            ${s.made < s.of ? `<p class="muted small">${s.of - s.made} made no ID.</p>` : ""}</div>
          <div class="row"><button class="btn primary big" id="next">Show the standings</button><button class="btn quiet" id="quit">End game</button></div>
        </section></div>`, true);
    later(300, () => Confetti.burst(s.right ? 140 : 40, 0.3, 0.3));
    document.getElementById("next").onclick = () => { H.phase = "standings"; Sound.play("standings"); ikPush(); ikDrawHost(); };
    document.getElementById("quit").onclick = ikHostEnd;
    return;
  }
  if (H.phase === "standings") {
    set(`${hud(`Standings after picture ${H.pi + 1}`)}
      <section class="panel"><h2>Top detectives</h2>${standingsRows(ranking(), 10)}
        <div class="row"><button class="btn primary big" id="next">${H.pi + 1 < H.plan.length ? "Next picture" : "Final results"}</button><button class="btn quiet" id="quit">End game</button></div>
      </section>`, true);
    document.getElementById("next").onclick = ikNextPicture;
    document.getElementById("quit").onclick = ikHostEnd;
    return;
  }
  /* end */
  const rk = ranking();
  const hardest = H.qstats.slice().sort((a, b) => a.right / Math.max(1, a.of) - b.right / Math.max(1, b.of)).slice(0, 5);
  set(`${hud("The Identikit · final results")}<div class="tape"></div>
    ${rk.length ? ceremonyHtml(rk.slice(0, 3), "Case closed: the top detectives") : `<section class="panel"><h2>Game over</h2></section>`}
    ${rk.length > 3 ? `<section class="panel"><h3>The rest of the squad</h3>${standingsRows(rk.slice(3).map(p => ({ ...p, prevRank: 0 })), 7, false).replace(/<span class="pos">(\d+)<\/span>/g, (m, d) => `<span class="pos">${+d + 3}</span>`)}</section>` : ""}
    <section class="panel"><h3>Class case report</h3>
      <span class="eyebrow">The pictures</span>
      <div class="ik-gallery">${H.stats.map(s => { const p = IK.byId[s.id]; return `<figure>${ikFrame(p, [], [], { solved: true })}<figcaption><b>${esc(p.name)}</b><br>${s.right} of ${s.of} identified · ${s.tilesLeft} tile${s.tilesLeft === 1 ? "" : "s"} left</figcaption></figure>`; }).join("")}</div>
      ${hardest.length ? `<span class="eyebrow">Hardest questions</span><div class="bars">${hardest.map(s => { const q = QUESTIONS[s.qn]; const pct = s.of ? Math.round(100 * s.right / s.of) : 0; return `<div class="bar wide-label"><span>${esc(q.brief)}</span><div class="track"><div class="fill" style="width:${pct}%"></div></div><span class="n">${pct}%</span></div>`; }).join("")}</div>` : ""}
      <details><summary class="eyebrow">Full results (teacher only)</summary>
        <div class="podium" style="margin-top:12px">${rk.map((p, k) => `<div class="place"><span class="pos">${k + 1}</span>${avatarSvg(p.avatar, "sm")}<span class="tn">${esc(p.name)}</span><span class="ts">✓${p.correct} ✗${p.wrong} · IDs ${p.idsRight} · ${p.score}</span></div>`).join("")}</div>
      </details>
    </section>
    <section class="panel"><h3>What next?</h3>
      <div class="row"><button class="btn primary" id="again">Play again with the same players</button><button class="btn" id="new">New game</button><button class="btn" id="home">Back to Incident Room</button></div>
    </section>`, true);
  if (rk.length) runCeremony(rk.slice(0, 3));
  document.getElementById("again").onclick = () => { H.round += 1; ikNewRound(H); Sound.startMusic(); ikPush(); ikDrawHost(); };
  document.getElementById("new").onclick = () => { hostClose(); ikHostSetup(); };
  document.getElementById("home").onclick = () => { hostClose(); homeFn(); };
}

/* ================= STUDENT ================= */
function ikStudentState(st) {
  const P = S.stu;
  if (st.round !== P.round) { P.round = st.round; P.hist = []; P.lastRank = 0; P.ik = {}; }
  P.state = st; P.ik = P.ik || {};
  const key = `${st.round}:${st.phase}:${st.pi}:${st.qi}`;
  const mine = st.scores && st.scores[P.id];
  if (st.pi !== P.ik.pi) P.ik = { pi: st.pi, picked: null, sent: false, open: false };
  if (st.done && st.done.includes(P.id)) P.ik.sent = true;
  if (key === P.key) {
    if (st.phase === "q") { P.left = Math.min(P.left, st.left); timerUI(P.left, st.total); const t = document.getElementById("tleft"); if (t) t.textContent = P.left; const c = document.getElementById("closing"); if (c) c.hidden = !st.closing; }
    return;
  }
  P.key = key;
  stopTimer();
  if (st.phase === "q") {
    P.L = freshPad(); P.left = st.left;
    S.pad = { L: P.L, act: (a, v) => ikStudentAct(a, v) };
    tick = setInterval(() => { P.left = Math.max(0, P.left - 1); timerUI(P.left, st.total); const t = document.getElementById("tleft"); if (t) t.textContent = P.left; }, 1000);
  } else S.pad = null;
  if (st.phase === "tiles" && st.qn !== null) {
    const q = QUESTIONS[st.qn];
    P.hist.push({ q, ok: !!(mine && mine.qok), ans: P.L ? P.L.sentAns : null });
    Sound.play(mine && mine.qok ? "correct" : P.L && P.L.sentAns !== null ? "wrong" : "noanswer");
  }
  if (st.phase === "unmask") { Sound.play(mine && mine.idOk ? "gold" : "reveal"); }
  if (st.phase === "standings" && mine) { const r = rankIdx(mine.correct, GAME_RANK_AT); P.promoted = r > P.lastRank; P.lastRank = r; Sound.play(P.promoted ? "promote" : "standings"); }
  if (st.phase === "end") studentSave();
  ikDrawStudent();
}
function ikStudentAct(act, v) {
  const P = S.stu, st = P && P.state;
  if (!st || st.phase !== "q") return;
  const q = QUESTIONS[st.qn], L = P.L, r = padAct(q, L, act, v);
  if (!r) return;
  const send = ans => P.ch.send({ type: "broadcast", event: "answer", payload: { id: P.id, name: S.player.name, avatar: S.player.avatar, round: st.round, pi: st.pi, qi: st.qi, ans } });
  if (r === "ans") { L.sentAns = L.ans; send(L.ans); Sound.play("tap"); }
  if (act === "seq-send" && L.ans) { L.sentAns = L.ans.slice(); send(L.sentAns); Sound.play("tap"); }
  if (r === "text" && q.type === "type") { L.sentAns = L.ans; L.sentText = L.ans; send(L.ans); Sound.play("tap"); }
  if (r === "seq") Sound.play("tap");
  ikDrawStudent(true);
}
/* the ID panel: pick from the line-up, confirm, then it's locked for this picture */
function ikIdPanel(st) {
  const I = S.stu.ik;
  if (I.sent) return `<div class="so-done">ID made${I.picked !== null && I.picked !== undefined ? `: <b>${esc(st.lineup[I.picked])}</b>` : ""}. Wait for the unmasking to see if you're right.</div>`;
  if (!I.open) return `<div class="row"><button class="btn primary big ik-idbtn" data-ik="open">Make an ID</button><span class="muted small">Worth ${ikIdPoints(IK_TILES - st.off.length)} points now. One try only.</span></div>`;
  return `<div class="ik-idbox"><span class="eyebrow">Who, or what, is it?</span>${ikLineup(st.lineup, { pick: true, chosen: I.picked })}
    <div class="row"><button class="btn primary" data-ik="confirm" ${I.picked === null ? "disabled" : ""}>Confirm ID${I.picked !== null ? `: ${esc(st.lineup[I.picked])}` : ""}</button><button class="btn quiet" data-ik="close">Not yet</button></div>
    <p class="muted small">Worth ${ikIdPoints(IK_TILES - st.off.length)} points now. A wrong ID scores 0 and you can't try again on this picture.</p></div>`;
}
document.addEventListener("click", e => {
  const b = e.target.closest && e.target.closest("[data-ik]");
  if (!b || !S.stu || !S.stu.state || S.stu.state.game !== "identikit") return;
  const P = S.stu, st = P.state, I = P.ik, a = b.dataset.ik;
  if (!["q", "tiles"].includes(st.phase) || I.sent) return;
  if (a === "open") { I.open = true; I.picked = null; }
  if (a === "close") I.open = false;
  if (a === "pick") I.picked = +b.dataset.k;
  if (a === "confirm" && I.picked !== null) {
    I.sent = true; I.open = false; Sound.play("arrest");
    P.ch.send({ type: "broadcast", event: "ident", payload: { id: P.id, name: S.player.name, avatar: S.player.avatar, round: st.round, pi: st.pi, k: I.picked } });
  }
  Sound.play("tap");
  const el = document.getElementById("ikId"); if (el) el.innerHTML = ikIdPanel(st);
});
function ikDrawStudent(keep = false) {
  const P = S.stu, st = P.state, mine = st.scores && st.scores[P.id];
  const me = `<div class="who">${avatarSvg(S.player.avatar, "sm")}${esc(S.player.name)}</div>`;
  const cnt = mine ? counters(mine.correct, mine.wrong) : "";
  const hud = extra => `<div class="hud">${me}${extra || ""}${cnt}${soundBtns()}</div>`;
  const pic = st.pic ? IK.byId[st.pic] : null;
  const head = `<span class="stat">Picture <b>${st.pi + 1}</b> / ${st.n}</span>`;
  if (st.phase === "lobby") {
    return set(`${hud(`<span class="stat">Game <b>${spaced(P.code)}</b></span>`)}
      <section class="panel"><span class="eyebrow">The Identikit</span><h2>You're in, ${esc(S.player.name)}</h2>${IK_RULES}
        <p class="muted small">Look at the board. The first picture appears when your teacher starts the game.</p></section>`);
  }
  if (st.phase === "q") {
    const q = QUESTIONS[st.qn];
    return set(`${hud(head)}
      <div class="timer" aria-hidden="true"><div class="timer-fill" style="width:${(P.left / st.total) * 100}%"></div></div>
      <div class="ik-play">
        <section class="panel ik-mini">${ikFrame(pic, st.off, [])}<div id="ikId">${ikIdPanel(st)}</div></section>
        <section class="panel">
          ${qHead(q, `<span class="stat secs"><span id="tleft">${P.left}</span>s</span>`)}
          <p class="brief">${esc(q.brief)}</p>
          ${todoBanner(todoText(q, "live", false) + " Every right answer helps lift the tiles.")}
          ${deviceQ(q, st.perm, P.L, { mode: "live", typed: false })}
          <p class="closing" id="closing" ${st.closing ? "" : "hidden"}>Everyone has answered. A few seconds left to change your answer.</p>
        </section></div>`, true, keep);
  }
  if (st.phase === "tiles") {
    const h = P.hist[P.hist.length - 1], ok = mine && mine.qok, q = QUESTIONS[st.qn];
    set(`${hud(head)}
      <div class="ik-play">
        <section class="panel ik-mini">${ikFrame(pic, st.off, st.fresh)}<div id="ikId">${ikIdPanel(st)}</div></section>
        <section class="panel">
          <div class="result ${ok ? "good" : "bad"}"><span class="rhead">${ok ? `Correct · +${mine.qpts}` : h && h.ans !== null ? "Not this time" : "No answer in time"}</span>
            ${!ok && h && h.ans !== null && h.ans !== undefined ? `<p>You said: <b>${esc(ansLabel(q, h.ans))}</b></p>` : ""}
            <p>Correct answer: <span class="answer">${esc(rightLabel(q))}</span></p><p class="why"><b>Why:</b> ${esc(q.why)}</p></div>
          ${st.qres ? `<div class="ik-lift"><span class="ik-big">${st.qres.removed}</span><span>tile${st.qres.removed === 1 ? "" : "s"} lifted<br><small>${st.qres.right} of ${st.qres.of} got it right</small></span></div>` : ""}
        </section></div>`, true);
    return;
  }
  if (st.phase === "unmask") {
    const u = st.unmask, I = P.ik;
    set(`${hud(head)}
      <div class="ik-play">
        <section class="panel ik-mini">${ikFrame(pic, [], [], { solved: true })}</section>
        <section class="panel">
          <span class="eyebrow">Unmasked</span><h2 class="ik-name">${esc(u.name)}</h2><p class="ik-fact">${esc(u.fact)}</p>
          <div class="result ${mine && mine.idOk ? "good so-win" : "bad"}">${mine && mine.idOk ? `<span class="so-stamp">Identified</span>` : ""}
            <span class="rhead">${mine && mine.idOk ? `Correct ID · +${mine.idPts}` : mine && mine.idPick ? "Wrong ID" : "No ID made"}</span>
            ${mine && mine.idPick && !mine.idOk ? `<p>You said: <b>${esc(mine.idPick)}</b></p>` : ""}
            ${u.first ? `<p>First correct ID: <b>${esc(u.first.name)}</b> with ${u.first.covered} tile${u.first.covered === 1 ? "" : "s"} still on.</p>` : ""}</div>
        </section></div>`, true);
    if (mine && mine.idOk) later(300, () => Confetti.burst(120, 0.5, 0.3));
    return;
  }
  if (st.phase === "standings") {
    return set(`${hud(`<span class="stat">After picture <b>${st.pi + 1}</b> / ${st.n}</span>`)}
      <section class="panel center">
        ${P.promoted ? `<div class="promo">Promoted to ${RANKS[P.lastRank]}</div>` : ""}
        ${mine ? `<span class="eyebrow">Your position</span><div class="big">${ordinal(mine.rank)}</div><p class="muted">of ${mine.of} · ${mine.score} points</p>
          <p class="gap">${mine.rank === 1 ? "You're top of the board. Keep it up." : `${mine.gap + 1} points to pass ${esc(mine.above)}`}</p>
          ${rankBadge(rankIdx(mine.correct, GAME_RANK_AT))}${mine.streak >= 3 ? `<span class="streak">${mine.streak} in a row</span>` : ""}` : `<h2>Standings on the board</h2>`}
      </section>`);
  }
  /* end: reuse the live game's end screen */
  return drawStudent(keep);
}
