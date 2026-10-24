/* ================= THE IDENTIKIT: solo play =================
   Each student has their own board. A right answer lifts 3 tiles, a wrong one (or running out of time) lifts 1.
   One ID per picture from the line-up: the more tiles still on, the more it scores, and stars show how early it was. */
const IKS_RIGHT = 3, IKS_WRONG = 1;
const ikStars = covered => (covered >= 10 ? 3 : covered >= 5 ? 2 : 1);
const starRow = (n, of = 3) => `<span class="stars" aria-label="${n} of ${of} stars">${Array.from({ length: of }, (_, i) => `<span class="${i < n ? "on" : ""}">★</span>`).join("")}</span>`;

function ikSoloSetup() {
  stopTimer(); S.pad = null;
  const cfg = withFilter(store.get("ir-iks", null), { n: 3, tier: "H", topics: [], cats: IK_CATS.slice() });
  cfg.cats = Array.isArray(cfg.cats) && cfg.cats.length ? cfg.cats.filter(c => IK.CATS[c]) : IK_CATS.slice();
  cfg.allow = soloAllow();
  if (cfg.allow) cfg.topics = cfg.topics.filter(id => cfg.allow.includes(id));
  const avail = () => IK.PICS.filter(p => cfg.cats.includes(p.cat) && (cfg.tier !== "F" || p.tier === "F")).length;
  const draw = (keep = false) => {
    const needTopics = cfg.cats.includes("people") || cfg.cats.includes("catch");
    set(`<div class="hud">${brand("The Identikit · solo")}<div class="who">${avatarSvg(S.player.avatar, "sm")}${esc(S.player.name)}</div></div>
      <section class="panel"><span class="eyebrow">Play on your own</span><h2>The Identikit</h2>
        <ol class="so-teach">
          <li><b>A picture hides under 16 tiles.</b> Answer questions to lift them: a right answer lifts 3 tiles, a wrong one lifts 1.</li>
          <li><b>Make one ID</b> from the line-up of four whenever you think you know. The more tiles still on, the more you score.</li>
          <li><b>Earn up to 3 stars</b> for each picture by identifying it early. A wrong ID scores nothing.</li>
        </ol>
        <span class="eyebrow">Pictures to include</span>
        <div class="choice">${IK_CATS.map(c => `<button class="btn" data-ikcat="${c}" aria-pressed="${cfg.cats.includes(c)}">${esc(IK.CATS[c])}</button>`).join("")}</div>
        <span class="eyebrow">Tier</span>${choice("tier", cfg.tier, [["F", "Foundation"], ["H", "Higher"]])}
        ${needTopics ? `<div class="ik-topics"><span class="eyebrow">Topics for famous people and catchphrase pictures</span>${topicPicker(cfg)}</div>` : ""}
        <span class="eyebrow">Number of pictures</span>${choice("n", cfg.n, [[3, "3"], [5, "5"]])}
        <p class="muted small">Graphs, shapes and solids ask questions on their own topic.${cfg.allow ? " On the free plan, questions come from the sample topics." : ""}</p>
        <div class="row"><button class="btn primary big" id="go" ${avail() && cfg.cats.length ? "" : "disabled"}>Start</button><button class="btn" id="back">Back</button>${soundBtns()}</div>
      </section>`, false, keep);
    const redraw = () => draw(true);
    if (needTopics) bindTopicPicker(cfg, redraw);
    app.querySelectorAll("[data-ikcat]").forEach(b => b.onclick = () => { const c = b.dataset.ikcat; cfg.cats = cfg.cats.includes(c) ? cfg.cats.filter(x => x !== c) : cfg.cats.concat(c); redraw(); });
    bindChoice("tier", v => { cfg.tier = v; redraw(); });
    bindChoice("n", v => { cfg.n = +v; redraw(); });
    document.getElementById("back").onclick = signIn;
    document.getElementById("go").onclick = () => { saveCfg("ir-iks", cfg); Sound.unlock(); claimGame("solo", () => ikSoloStart(cfg), ikSoloSetup); };
  };
  draw();
}
function ikSoloStart(cfg) {
  const plan = ikPlan(cfg);
  if (!plan.length) return ikSoloSetup();
  S.iks = { cfg, plan, pi: -1, score: 0, correct: 0, wrong: 0, streak: 0, best: 0, results: [], pics: [] };
  armGuard(() => { stopTimer(); S.iks = null; S.pad = null; signIn(); }, "Your answers in this game won't be saved.");
  Sound.startMusic();
  ikSoloPicture();
}
function ikSoloPicture() {
  const K = S.iks;
  K.pi += 1;
  if (K.pi >= K.plan.length) return ikSoloReport();
  K.qi = -1; K.off = []; K.fresh = []; K.idOpen = false; K.idPick = null; K.picDone = false;
  ikSoloQ();
}
const ikSoloCovered = K => IK_TILES - K.off.length;
function ikSoloQ() {
  const K = S.iks, P = K.plan[K.pi];
  K.qi += 1; K.fresh = [];
  if (K.qi >= P.qs.length || K.off.length >= IK_TILES) { K.phase = "final"; K.idOpen = true; stopTimer(); S.pad = null; return ikSoloDraw(); }
  const q = QUESTIONS[P.qs[K.qi]];
  K.L = freshPad(); K.phase = "q"; K.total = secsFor(q, "auto", false); K.left = K.total;
  S.pad = { L: K.L, act: (a, v) => ikSoloAct(a, v) };
  ikSoloDraw();
  stopTimer();
  tick = setInterval(() => {
    if (K.phase !== "q") return;
    K.left -= 1; timerUI(K.left, K.total);
    if (K.left <= 5 && K.left > 0) Sound.play("tick");
    if (K.left <= 0) ikSoloCheck();
  }, 1000);
}
function ikSoloAct(act, v) {
  const K = S.iks; if (!K || K.phase !== "q") return;
  const q = QUESTIONS[K.plan[K.pi].qs[K.qi]];
  if (act === "check") return ikSoloCheck();
  const r = padAct(q, K.L, act, v);
  if (r === "text") return ikSoloCheck();
  if (r) { Sound.play("tap"); ikSoloDraw(true); }
}
function ikSoloCheck() {
  const K = S.iks; if (K.phase !== "q") return;
  stopTimer();
  const P = K.plan[K.pi], q = QUESTIONS[P.qs[K.qi]], ok = isCorrect(q, K.L.ans);
  K.ok = ok; K.pts = ok ? 100 + Math.ceil(50 * Math.max(0, K.left) / K.total) : 0;
  const before = rankIdx(K.correct, GAME_RANK_AT);
  if (ok) { K.correct += 1; K.streak += 1; K.best = Math.max(K.best, K.streak); } else { K.wrong += 1; K.streak = 0; }
  K.promoted = rankIdx(K.correct, GAME_RANK_AT) > before;
  K.score += K.pts;
  K.results.push({ q, ok, ans: K.L.ans });
  K.fresh = P.order.filter(i => !K.off.includes(i)).slice(0, ok ? IKS_RIGHT : IKS_WRONG);
  K.off = K.off.concat(K.fresh);
  Sound.play(ok ? (K.promoted ? "promote" : "correct") : K.L.ans === null ? "noanswer" : "wrong");
  K.phase = "done"; S.pad = null; K.freshShown = false;
  ikSoloDraw(true);
  if (K.fresh.length) later(250, () => Sound.play("promote"));
}
function ikSoloIdent(k) {
  const K = S.iks, P = K.plan[K.pi], pic = IK.byId[P.id];
  stopTimer(); S.pad = null;
  const covered = ikSoloCovered(K), ok = P.lineup[k] === pic.name;
  const pts = ok ? ikIdPoints(covered) : 0, stars = ok ? ikStars(covered) : 0;
  K.score += pts;
  K.pics.push({ id: P.id, ok, covered, stars, pts, guess: P.lineup[k] });
  K.phase = "unmask"; K.idOpen = false;
  Sound.play(ok ? "gold" : "wrong");
  ikSoloDraw();
  if (ok) later(300, () => Confetti.burst(stars === 3 ? 180 : 100, 0.5, 0.3));
}
function ikSoloDraw(keep = false) {
  const K = S.iks, P = K.plan[K.pi], pic = IK.byId[P.id];
  const hud = `<div class="hud"><div class="who">${avatarSvg(S.player.avatar, "sm")}${esc(S.player.name)}</div>
    <span class="stat">Picture <b>${K.pi + 1}</b> / ${K.plan.length}</span>${counters(K.correct, K.wrong)}<span class="stat">Score <b>${K.score}</b></span>${soundBtns(true)}</div>`;
  const idPanel = () => {
    const worth = ikIdPoints(ikSoloCovered(K));
    if (!K.idOpen) return `<div class="row"><button class="btn primary big ik-idbtn" data-iks="open">Make an ID</button><span class="muted small">Worth ${worth} points and ${starRow(ikStars(ikSoloCovered(K)))} now. One try only.</span></div>`;
    return `<div class="ik-idbox"><span class="eyebrow">${K.phase === "final" ? "All the evidence is in: who, or what, is it?" : "Who, or what, is it?"}</span>${ikLineup(P.lineup, { pick: true, chosen: K.idPick })}
      <div class="row"><button class="btn primary" data-iks="confirm" ${K.idPick === null ? "disabled" : ""}>Confirm ID${K.idPick !== null ? `: ${esc(P.lineup[K.idPick])}` : ""}</button>${K.phase === "final" ? "" : `<button class="btn quiet" data-iks="close">Not yet</button>`}</div>
      <p class="muted small">Worth ${worth} points now. A wrong ID scores 0 and ends this picture.</p></div>`;
  };
  const fresh = K.phase === "done" && !K.freshShown ? K.fresh : [];
  if (K.phase === "done") K.freshShown = true;
  const left = `<section class="panel ik-mini">${ikFrame(pic, K.phase === "unmask" ? [] : K.off, fresh, { solved: K.phase === "unmask" })}
    ${K.phase === "unmask" ? "" : `<p class="muted small center">${ikSoloCovered(K)} of ${IK_TILES} tiles still on</p><div id="iksId">${idPanel()}</div>`}</section>`;
  let right = "";
  if (K.phase === "q") {
    const q = QUESTIONS[P.qs[K.qi]];
    right = `<section class="panel">${qHead(q, `<span class="stat secs"><span id="tleft">${K.left}</span>s</span>`)}<p class="brief">${esc(q.brief)}</p>
      ${todoBanner(todoText(q, "solo") + " A right answer lifts 3 tiles.")}${deviceQ(q, P.perms[K.qi], K.L, { mode: "solo" })}</section>`;
  } else if (K.phase === "done") {
    const q = QUESTIONS[P.qs[K.qi]];
    right = `<section class="panel"><div class="result ${K.ok ? "good" : "bad"}"><span class="rhead">${K.L.ans === null ? "Time's up" : K.ok ? `Correct · +${K.pts}` : "Not this time"}</span>
        ${K.ok || K.L.ans === null ? "" : `<p>You said: <b>${esc(ansLabel(q, K.L.ans))}</b></p>`}
        <p>Correct answer: <span class="answer">${esc(rightLabel(q))}</span></p><p class="why"><b>Why:</b> ${esc(q.why)}</p></div>
      <div class="ik-lift"><span class="ik-big">${K.fresh.length}</span><span>tile${K.fresh.length === 1 ? "" : "s"} lifted<br><small>${ikSoloCovered(K)} still on</small></span></div>
      ${K.promoted ? `<div class="promo">Promoted to ${RANKS[rankIdx(K.correct, GAME_RANK_AT)]}</div>` : ""}
      <div class="row"><button class="btn primary big" id="next">${K.off.length >= IK_TILES || K.qi + 1 >= P.qs.length ? "Make your ID" : "Next question"}</button></div></section>`;
  } else if (K.phase === "final") {
    right = `<section class="panel"><span class="eyebrow">Last chance</span><h2>Time to identify it</h2><p class="muted">${K.off.length >= IK_TILES ? "Every tile is off." : "That was the last question for this picture."} Pick from the line-up to finish this picture.</p></section>`;
  } else {
    const r = K.pics[K.pics.length - 1];
    right = `<section class="panel"><span class="eyebrow">${esc(IK.CATS[pic.cat])} · unmasked</span><h2 class="ik-name">${esc(pic.name)}</h2><p class="ik-fact">${esc(pic.fact)}</p>
      <div class="result ${r.ok ? "good so-win" : "bad"}">${r.ok ? `<span class="so-stamp">Identified</span>` : ""}<span class="rhead">${r.ok ? `Correct ID · +${r.pts}` : "Wrong ID"}</span>
        ${r.ok ? `<p>${starRow(r.stars)} You identified it with ${r.covered} tile${r.covered === 1 ? "" : "s"} still on.</p>` : `<p>You said: <b>${esc(r.guess)}</b>.</p>`}</div>
      <div class="row"><button class="btn primary big" id="nextpic">${K.pi + 1 < K.plan.length ? "Next picture" : "See your case report"}</button></div></section>`;
  }
  set(`${hud}${K.phase === "q" ? `<div class="timer" aria-hidden="true"><div class="timer-fill" style="width:${(K.left / K.total) * 100}%"></div></div>` : ""}
    <div class="ik-play">${left}${right}</div>
    <div class="row"><button class="btn quiet" id="quit">End game</button></div>`, true, keep);
  const nx = document.getElementById("next"); if (nx) nx.onclick = ikSoloQ;
  const np = document.getElementById("nextpic"); if (np) np.onclick = ikSoloPicture;
  document.getElementById("quit").onclick = () => { stopTimer(); disarmGuard(); if (K.results.length || K.pics.length) ikSoloReport(); else { S.iks = null; signIn(); } };
  if (K.phase === "q" && QUESTIONS[P.qs[K.qi]].type === "type" && !keep) { const inp = document.getElementById("tans"); if (inp) inp.focus(); }
}
/* line-up taps in solo play */
document.addEventListener("click", e => {
  const b = e.target.closest && e.target.closest("[data-iks], [data-ik='pick']");
  const K = S.iks;
  if (!b || !K || K.phase === "unmask" || S.stu) return;
  const a = b.dataset.iks || "pick";
  if (a === "open") { K.idOpen = true; K.idPick = null; }
  if (a === "close") K.idOpen = false;
  if (a === "pick") K.idPick = +b.dataset.k;
  Sound.play("tap");
  if (a === "confirm" && K.idPick !== null) { Sound.play("arrest"); return ikSoloIdent(K.idPick); }
  const el = document.getElementById("iksId"); if (el) { const keepQ = K.phase === "q"; ikSoloDraw(true); if (keepQ) timerUI(K.left, K.total); }
});
async function ikSoloReport() {
  stopTimer(); S.pad = null; disarmGuard(); Sound.stopMusic();
  const K = S.iks, r = K.results, tally = topicTally(r), ri = rankIdx(K.correct, GAME_RANK_AT);
  const stars = K.pics.reduce((s, p) => s + p.stars, 0), ids = K.pics.filter(p => p.ok).length;
  Sound.play("end");
  const draw = res => {
    set(`<div class="hud">${brand("The Identikit · case report")}<div class="who">${avatarSvg(S.player.avatar, "sm")}${esc(S.player.name)}</div></div>
      <div class="tape"></div>
      <section class="panel">
        ${rankBadge(ri)}
        <div class="kpis">
          <div class="kpi"><span class="eyebrow">Score</span><span class="big">${K.score}</span></div>
          <div class="kpi"><span class="eyebrow">Identified</span><span class="v ok">${ids} / ${K.pics.length}</span></div>
          <div class="kpi"><span class="eyebrow">Stars</span><span class="v">${stars} / ${K.pics.length * 3}</span></div>
          <div class="kpi"><span class="eyebrow">Questions right</span><span class="v">${K.correct} / ${r.length}</span></div>
        </div>
        ${saveNote(res)}
      </section>
      <section class="panel"><h3>Your pictures</h3>
        <div class="ik-gallery">${K.pics.map(p => { const pic = IK.byId[p.id]; return `<figure>${ikFrame(pic, [], [], { solved: true })}<figcaption><b>${esc(pic.name)}</b><br>${p.ok ? `${starRow(p.stars)} ${p.covered} tiles on` : `You said ${esc(p.guess)}`}</figcaption></figure>`; }).join("")}</div>
      </section>
      ${r.length ? reviewHtml(r) : ""}
      <section class="panel"><h3>What next?</h3>
        <div class="row"><button class="btn primary" id="again">Play again</button><button class="btn" id="rec">${S.user ? "My case record" : "Sign in to save results"}</button><button class="btn" id="home">Back to Incident Room</button></div>
      </section>`);
    document.getElementById("again").onclick = () => claimGame("solo", () => ikSoloStart(K.cfg), ikSoloSetup);
    document.getElementById("rec").onclick = recordScreen;
    document.getElementById("home").onclick = signIn;
  };
  draw(S.user ? { saved: false, why: "pending" } : null);
  if (stars === K.pics.length * 3 && K.pics.length) later(400, () => { Sound.play("gold"); Confetti.burst(200, 0.5, 0.3); });
  if (S.user && r.length) {
    const res = await saveResult({ mode: "solo", questions: r.length, correct: K.correct, score: K.score, best: K.best, topics: tally,
      missed: r.filter(x => !x.ok).map(x => x.q.brief).concat(K.pics.filter(p => !p.ok).map(p => `Identikit: ${IK.byId[p.id].name}`)) });
    if (S.iks === K) draw(res);
  }
}
