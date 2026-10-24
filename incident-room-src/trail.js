/* ================= CASE TRAIL: live, 2 to 4 teams =================
   A trail of 20 squares round the edge of the board. Teams take turns to roll and move.
   Topic squares: everyone answers a question on that topic.
     Empty square: the moving team claims it if at least half of them are right.
     Your own square: half right upgrades it (worth double).
     A rival's square: beat their score on the question to take it over, or pay them rent.
   Tip-off squares draw a card; corners are HQ (+100 when you pass), Lockup, Safe House and Go to Lockup.
   Final score: bank + squares (100 each, 200 upgraded) + 300 for every complete colour set. */
const CT_TEAMS = {
  c: { name: "Cyan team", short: "Cyan", col: "#00FCF1" }, a: { name: "Amber team", short: "Amber", col: "#FFC857" },
  p: { name: "Pink team", short: "Pink", col: "#FF8FB1" }, g: { name: "Green team", short: "Green", col: "#3DDC97" }
};
const CT_ORDER = ["c", "a", "p", "g"];
const CT_SETS = { 1: "A", 2: "A", 4: "A", 6: "B", 7: "B", 9: "B", 11: "C", 12: "C", 14: "C", 16: "D", 17: "D", 19: "D" };
const CT_SETCOL = { A: "#7B61FF", B: "#FF8A3D", C: "#2EC4B6", D: "#E5484D" };
const CT_TIPS = [3, 8, 13, 18];
const CT_CORNER = { 0: "hq", 5: "lockup", 10: "safe", 15: "golock" };
const CT_CARDS = [
  { id: "fwd3", text: "Hot tip! Move forward 3 squares." },
  { id: "reward", text: "Reward for information: +150 to your bank." },
  { id: "lost", text: "You lost the paperwork: −100 from your bank." },
  { id: "back2", text: "Wrong lead. Go back 2 squares." },
  { id: "catchup", text: "Case review: the team in last place gets +200." },
  { id: "lockup", text: "Called in for questioning. Go to Lockup and miss your next turn." },
  { id: "overtime", text: "Overtime pay: every team gets +50." },
  { id: "witness", text: "A witness comes forward: claim the next empty topic square ahead of you." }
];
/* square positions round a 6 x 6 grid: 0 is bottom right, going clockwise along the bottom first */
function ctXY(i) {
  if (i <= 5) return [5 - i, 5];
  if (i <= 10) return [0, 5 - (i - 5)];
  if (i <= 15) return [i - 10, 0];
  return [5, i - 15];
}
const ctTag = t => `<span class="ct-tag" style="--tc:${CT_TEAMS[t].col}">${CT_TEAMS[t].short}</span>`;
const CT_ICON = {
  hq: `<path d="M-14 4v12h28V4L0-10z" fill="none" stroke="#FFC857" stroke-width="3"/><path d="M-4 16V8h8v8" fill="#FFC857"/>`,
  lockup: `<rect x="-14" y="-12" width="28" height="28" rx="3" fill="none" stroke="#FF6B86" stroke-width="3"/><path d="M-7-12v28M0-12v28M7-12v28" stroke="#FF6B86" stroke-width="3"/>`,
  safe: `<path d="M0-14l14 6v8c0 9-6 14-14 17-8-3-14-8-14-17v-8z" fill="none" stroke="#3DDC97" stroke-width="3"/>`,
  golock: `<path d="M-14 0h22M2-8l8 8-8 8" fill="none" stroke="#FF6B86" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`,
  tip: `<circle r="13" fill="none" stroke="#FFC857" stroke-width="3"/><text y="7" text-anchor="middle" font-size="20" font-weight="700" fill="#FFC857">?</text>`
};
const CT_LABEL = { hq: "HQ · +100 when you pass", lockup: "Lockup", safe: "Safe House · +50", golock: "Go to Lockup", tip: "Tip-off" };

/* the board. o: { sq, pos, teams, active, hl (square to highlight), small, center (html) } */
function ctBoardSvg(o) {
  const S = 112, W = 6 * S;
  let g = `<rect x="${S}" y="${S}" width="${4 * S}" height="${4 * S}" rx="10" fill="#0E1636"/>
    <text x="${W / 2}" y="${W / 2 - 18}" text-anchor="middle" class="ct-logo">CASE TRAIL</text>`;
  o.sq.forEach((s, i) => {
    const [x, y] = ctXY(i), X = x * S, Y = y * S, hl = o.hl === i;
    const own = s.o ? CT_TEAMS[s.o].col : null;
    g += `<g class="ct-sq${hl ? " hl" : ""}"><rect x="${X + 3}" y="${Y + 3}" width="${S - 6}" height="${S - 6}" rx="8" fill="${own ? own : "#16214B"}" fill-opacity="${own ? 0.28 : 1}" stroke="${hl ? "#FFFFFF" : own || "#2A3870"}" stroke-width="${hl ? 6 : own ? 4 : 2}"/>`;
    if (s.k === "topic") {
      g += `<rect x="${X + 3}" y="${Y + 3}" width="${S - 6}" height="16" rx="6" fill="${CT_SETCOL[s.set]}"/>`;
      g += liWrap(s.tn, 13).map((ln, k) => `<text x="${X + S / 2}" y="${Y + 40 + k * 15}" text-anchor="middle" class="ct-t">${esc(ln)}</text>`).join("");
      if (s.up) g += `<text x="${X + S - 16}" y="${Y + S - 12}" text-anchor="middle" class="ct-star">★</text>`;
    } else {
      g += `<g transform="translate(${X + S / 2} ${Y + S / 2 - 10})">${CT_ICON[s.k]}</g><text x="${X + S / 2}" y="${Y + S - 16}" text-anchor="middle" class="ct-t small">${esc(CT_LABEL[s.k].split(" · ")[0])}</text>`;
    }
    g += `</g>`;
  });
  /* tokens */
  const at = {}; Object.entries(o.pos).forEach(([t, i]) => { (at[i] = at[i] || []).push(t); });
  Object.entries(at).forEach(([i, ts]) => {
    const [x, y] = ctXY(+i);
    ts.forEach((t, k) => { const ox = x * S + 26 + (k % 2) * 30, oy = y * S + S - 30 - Math.floor(k / 2) * 30 - (ts.length > 2 ? 0 : 0);
      g += `<g class="ct-tok${o.active === t ? " active" : ""}"><circle cx="${ox}" cy="${oy}" r="13" fill="${CT_TEAMS[t].col}" stroke="#0B122C" stroke-width="3"/><text x="${ox}" y="${oy + 5}" text-anchor="middle" class="ct-tk">${CT_TEAMS[t].short[0]}</text></g>`; });
  });
  return `<div class="ct-wrap${o.small ? " small" : ""}"><svg class="ct-board" viewBox="0 0 ${W} ${W}" role="img" aria-label="Case Trail board">${g}</svg>${o.center ? `<div class="ct-center">${o.center}</div>` : ""}</div>`;
}
const ctDie = n => `<svg class="ct-die" viewBox="0 0 60 60" aria-label="Dice shows ${n}"><rect x="3" y="3" width="54" height="54" rx="12" fill="#F4F1E8"/>${({ 1: [[30, 30]], 2: [[18, 18], [42, 42]], 3: [[18, 18], [30, 30], [42, 42]], 4: [[18, 18], [42, 18], [18, 42], [42, 42]], 5: [[18, 18], [42, 18], [30, 30], [18, 42], [42, 42]], 6: [[18, 16], [42, 16], [18, 30], [42, 30], [18, 44], [42, 44]] }[n] || []).map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5.5" fill="#0B122C"/>`).join("")}</svg>`;
function ctTotals(H) {
  const tot = {};
  H.teams.forEach(t => {
    let sq = 0; H.sq.forEach(s => { if (s.o === t) sq += s.up ? 200 : 100; });
    const sets = ["A", "B", "C", "D"].filter(k => H.sq.filter(s => s.set === k).every(s => s.o === t)).length;
    tot[t] = { bank: H.bank[t], squares: sq, sets, total: H.bank[t] + sq + sets * 300 };
  });
  return tot;
}
const ctTable = (H, tot) => `<div class="ct-table">${H.teams.slice().sort((x, y) => tot[y].total - tot[x].total).map(t => `<div class="ct-row${H.active === t ? " active" : ""}" style="--tc:${CT_TEAMS[t].col}"><span class="ct-sw"></span><b>${CT_TEAMS[t].short}</b><span class="muted small">bank ${tot[t].bank} · squares ${tot[t].squares}${tot[t].sets ? ` · ${tot[t].sets} set${tot[t].sets > 1 ? "s" : ""}` : ""}${H.locked && H.locked[t] ? " · in Lockup" : ""}</span><span class="ct-tot">${tot[t].total}</span></div>`).join("")}</div>`;
const CT_RULES = `<ul class="so-rules">
  <li><b>Teams take turns to roll</b> and move round the trail.</li>
  <li><b>Everyone answers every question.</b> Land on an empty topic and your team claims it if at least half of you are right.</li>
  <li><b>Your own square:</b> half right upgrades it to ★ (worth double). <b>A rival's square:</b> beat their score to take it, or pay them 100 rent.</li>
  <li><b>Tip-offs</b> can help or hurt. Pass HQ for +100. Own all three squares of a colour for +300.</li></ul>`;

/* ================= HOST ================= */
function ctHostSetup() {
  stopTimer(); S.pad = null;
  if (!liveConfigured()) return liveMissing(homeFn);
  if (gating() && !S.acc.signed_in) return signInToHost(homeFn);
  const cfg = withFilter(store.get("ir-ct", null), { time: "auto", tier: "H", topics: [], nteams: 4, turns: 5 });
  const draw = (keep = false) => {
    set(`${brand("Case Trail · teacher")}
      ${gameSwitch("trail")}
      <section class="panel"><span class="eyebrow">Live class game · 2 to 4 teams</span><h2>Case Trail</h2>
        <ol class="so-teach">
          <li><b>Open the game</b> and show the board. Students join at <b>${JOIN_URL}</b> and are split into teams automatically.</li>
          <li><b>Teams take turns:</b> you press <b>Roll</b> for the team whose turn it is, and their token moves.</li>
          <li><b>On a topic square everyone answers.</b> The moving team claims an empty square with half right, upgrades its own square, or must beat the owner's score to take a rival's square (otherwise it pays rent).</li>
          <li><b>Highest total wins</b> after every team has had its turns: bank + squares + colour-set bonuses.</li>
        </ol>
        ${topicPicker(cfg)}
        <span class="eyebrow">Teams</span>${choice("nteams", cfg.nteams, [[2, "2 teams"], [3, "3 teams"], [4, "4 teams"]])}
        <span class="eyebrow">Turns per team</span>${choice("turns", cfg.turns, [[3, "3 (about 10 minutes)"], [5, "5 (about 20 minutes)"], [8, "8 (a full lesson)"]])}
        <span class="eyebrow">Time per question</span>${choice("time", cfg.time, [["auto", "Auto: suits each question"], [20, "20 s"], [30, "30 s"], [45, "45 s"]])}
        <div class="row"><button class="btn primary big" id="go" ${poolFor(cfg).length ? "" : "disabled"}>Open the game</button><button class="btn" id="back">Back</button>${soundBtns(true)}</div>
      </section>`, true, keep);
    const redraw = () => draw(true);
    bindGameSwitch(); bindTopicPicker(cfg, redraw);
    bindChoice("nteams", v => { cfg.nteams = +v; redraw(); });
    bindChoice("turns", v => { cfg.turns = +v; redraw(); });
    bindChoice("time", v => { cfg.time = v === "auto" ? "auto" : +v; redraw(); });
    document.getElementById("back").onclick = homeFn;
    document.getElementById("go").onclick = () => { saveCfg("ir-ct", cfg); Sound.unlock(); claimGame("host", () => ctHostStart(cfg), ctHostSetup); };
  };
  draw();
}
function ctNewBoard(H) {
  const avail = TOPIC_IDS.filter(t => QUESTIONS.some(q => q.topic === t && (H.cfg.tier !== "F" || q.tier === "F")));
  const chosen = H.cfg.topics.length ? H.cfg.topics.filter(t => avail.includes(t)) : avail;
  let list = []; while (list.length < 12) list = list.concat(shuffle(chosen.length ? chosen : avail));
  let k = 0;
  H.sq = Array.from({ length: 20 }, (_, i) => CT_CORNER[i] ? { k: CT_CORNER[i] } : CT_TIPS.includes(i) ? { k: "tip" } : { k: "topic", t: list[k], tn: TOPICS[list[k++]], set: CT_SETS[i], o: null, up: false });
  H.pos = {}; H.bank = {}; H.locked = {}; H.teams.forEach(t => { H.pos[t] = 0; H.bank[t] = 0; });
  H.deck = shuffle(CT_CARDS.map(c => c.id));
}
function ctHostStart(cfg) {
  const code = String(100000 + Math.floor(Math.random() * 900000));
  const H = S.host = { game: "trail", code, cfg, round: 1, teams: CT_ORDER.slice(0, cfg.nteams), phase: "lobby", turnNo: 0, active: null, roll: null, msg: "", card: null, qk: 0, used: new Set(), pool: [],
    players: {}, team: {}, online: new Set(), kicked: new Set(), answers: {}, left: 0, total: 0, log: [], status: "connecting" };
  ctNewBoard(H);
  const ch = sb().channel("ir-" + code, { config: { broadcast: { self: false }, presence: { key: "host" } } });
  H.ch = ch;
  ch.on("broadcast", { event: "hello" }, ({ payload }) => { ctAdd(payload); ctPush(); if (H.phase === "lobby") ctDrawHost(); })
    .on("broadcast", { event: "answer" }, ({ payload }) => ctOnAnswer(payload))
    .on("presence", { event: "sync" }, () => {
      const st = ch.presenceState();
      H.online = new Set(Object.keys(st).filter(k => k !== "host"));
      Object.keys(st).forEach(k => { if (k !== "host" && st[k][0]) ctAdd(st[k][0]); });
      if (H.phase === "lobby") ctDrawHost(); else ctLiveUI();
    })
    .subscribe(status => {
      if (status === "SUBSCRIBED") { H.status = "live"; ch.track({ role: "host" }); ctPush(); }
      else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") H.status = "error";
      else if (status === "CLOSED") H.status = "closed";
      if (H.phase === "lobby") ctDrawHost();
    });
  H.beat = setInterval(ctPush, 3000);
  armGuard(() => { hostClose(); homeFn(); }, "Leaving ends the game for every student.");
  Sound.startMusic("show");
  ctDrawHost();
}
function ctAdd(p) {
  const H = S.host; if (!H || !p || !p.id || H.kicked.has(p.id)) return;
  addPlayer(p);
  if (H.players[p.id] && !H.team[p.id]) {
    const n = t => Object.keys(H.team).filter(id => H.team[id] === t && H.players[id]).length;
    H.team[p.id] = H.teams.slice().sort((x, y) => n(x) - n(y))[0];
  }
}
const ctMembers = (H, t) => Object.values(H.players).filter(p => H.team[p.id] === t);
function ctPush() {
  const H = S.host; if (!H || !H.ch || H.status !== "live" || H.game !== "trail") return;
  const tot = ctTotals(H);
  const payload = { game: "trail", phase: H.phase, round: H.round, teamsList: H.teams, turnNo: H.turnNo, maxTurns: H.cfg.turns * H.teams.length, active: H.active, roll: H.roll,
    sq: H.sq, pos: H.pos, bank: H.bank, locked: H.locked, tot, msg: H.msg, card: H.card, mode: H.mode || null, owner: H.owner || null,
    qk: H.qk, qn: ["q", "result"].includes(H.phase) ? H.qn : null, perm: H.perm || null, left: H.left, total: H.total, closing: !!H.closing,
    kicked: [...H.kicked], code: H.code, teams: H.team, res: H.res || null, typed: false };
  if (["result", "end"].includes(H.phase)) {
    const rk = ranking(), scores = {};
    rk.forEach((p, k) => { scores[p.id] = { score: p.score, rank: k + 1, of: rk.length, last: p.last, ok: p.ok, correct: p.correct, wrong: p.wrong, streak: p.streak, best: p.best,
      gap: k > 0 ? rk[k - 1].score - p.score : 0, above: k > 0 ? rk[k - 1].name : "" }; });
    payload.scores = scores;
  }
  if (H.phase === "end") payload.champ = H.champ;
  H.ch.send({ type: "broadcast", event: "state", payload });
}
/* ---------- turns ---------- */
function ctNextTurn() {
  const H = S.host;
  if (H.turnNo >= H.cfg.turns * H.teams.length) return ctEnd();
  const t = H.teams[H.turnNo % H.teams.length];
  H.turnNo += 1; H.active = t; H.roll = null; H.card = null; H.res = null; H.mode = null; H.owner = null; H.hl = null;
  if (H.locked[t]) { H.locked[t] = false; H.phase = "info"; H.msg = `${CT_TEAMS[t].name} is in Lockup and misses this turn.`; Sound.play("noanswer"); }
  else { H.phase = "turn"; H.msg = `${CT_TEAMS[t].name}, it's your turn. Roll the dice!`; Sound.play("standings"); }
  ctPush(); ctDrawHost();
}
function ctRoll() {
  const H = S.host; if (!H || H.phase !== "turn") return;
  H.phase = "rolling"; ctDrawHost(); Sound.play("drumroll");
  let n = 0;
  const spin = setInterval(() => { const d = document.getElementById("ctDie"); if (d) d.innerHTML = ctDie(1 + Math.floor(Math.random() * 6)); if (++n >= 9) { clearInterval(spin); H.roll = 1 + Math.floor(Math.random() * 6); ctMove(H.roll); } }, 90);
}
/* move the active team square by square (negative steps go backwards), then resolve where it lands */
function ctMove(steps) {
  const H = S.host, t = H.active, dir = steps < 0 ? -1 : 1;
  let left = Math.abs(steps);
  H.phase = "moving"; ctPush(); ctDrawHost();
  const step = () => {
    if (!S.host || S.host !== H) return;
    const from = H.pos[t];
    H.pos[t] = (H.pos[t] + dir + 20) % 20;
    if (dir > 0 && H.pos[t] === 0 && from === 19) { H.bank[t] += 100; H.flash = "Passed HQ: +100"; }
    Sound.play("tap");
    H.hl = H.pos[t]; ctDrawHost();
    if (--left > 0) setTimeout(step, 320); else setTimeout(ctLand, 420);
  };
  setTimeout(step, 250);
}
function ctLand() {
  const H = S.host, t = H.active, i = H.pos[t], s = H.sq[i];
  H.hl = i;
  const passed = H.flash ? ` ${H.flash}.` : ""; H.flash = "";
  if (s.k === "topic") return ctAsk(i, passed);
  if (s.k === "tip") { ctCard(passed); return; }
  if (s.k === "hq") { H.bank[t] += 100; H.msg = `${CT_TEAMS[t].short} lands on HQ: +100.`; Sound.play("promote"); }
  else if (s.k === "safe") { H.bank[t] += 50; H.msg = `${CT_TEAMS[t].short} reaches the Safe House: +50.${passed}`; Sound.play("correct"); }
  else if (s.k === "lockup") { H.msg = `${CT_TEAMS[t].short} is just visiting the Lockup.${passed}`; }
  else if (s.k === "golock") { H.pos[t] = 5; H.locked[t] = true; H.msg = `Go to Lockup! ${CT_TEAMS[t].short} misses its next turn.${passed}`; Sound.play("wrong"); }
  H.phase = "info"; ctPush(); ctDrawHost();
}
function ctCard(passed = "") {
  const H = S.host, t = H.active;
  if (!H.deck.length) H.deck = shuffle(CT_CARDS.map(c => c.id));
  const id = H.deck.shift(), card = CT_CARDS.find(c => c.id === id);
  H.card = card.text; H.phase = "card"; H.cardId = id; H.msg = passed.trim();
  Sound.play("reveal");
  ctPush(); ctDrawHost();
}
function ctApplyCard() {
  const H = S.host, t = H.active, id = H.cardId;
  H.card = null;
  if (id === "fwd3") return ctMove(3);
  if (id === "back2") return ctMove(-2);
  if (id === "reward") { H.bank[t] += 150; H.msg = `${CT_TEAMS[t].short} +150.`; }
  if (id === "lost") { H.bank[t] = Math.max(0, H.bank[t] - 100); H.msg = `${CT_TEAMS[t].short} −100.`; }
  if (id === "overtime") { H.teams.forEach(x => { H.bank[x] += 50; }); H.msg = "Every team +50."; }
  if (id === "catchup") { const tot = ctTotals(H), last = H.teams.slice().sort((x, y) => tot[x].total - tot[y].total)[0]; H.bank[last] += 200; H.msg = `${CT_TEAMS[last].name} is in last place and gets +200.`; }
  if (id === "lockup") { H.pos[t] = 5; H.locked[t] = true; H.msg = `${CT_TEAMS[t].short} goes to Lockup and misses its next turn.`; }
  if (id === "witness") {
    let j = H.pos[t], found = -1; for (let k = 1; k <= 20; k++) { const n = (j + k) % 20; if (H.sq[n].k === "topic" && !H.sq[n].o) { found = n; break; } }
    if (found >= 0) { H.sq[found].o = t; H.hl = found; H.msg = `${CT_TEAMS[t].short} claims ${H.sq[found].tn}.`; Sound.play("promote"); } else H.msg = "No empty squares left to claim.";
  }
  H.phase = "info"; ctPush(); ctDrawHost();
}
/* ---------- questions ---------- */
function ctAsk(i, passed = "") {
  const H = S.host, t = H.active, s = H.sq[i];
  H.mode = !s.o ? "claim" : s.o === t ? "upgrade" : "rival"; H.owner = s.o || null;
  const fresh = q => !H.used.has(q.n);
  let pool = poolFor({ tier: H.cfg.tier, topics: [s.t], mix: "mixed" }).filter(fresh);
  if (!pool.length) pool = poolFor({ tier: H.cfg.tier, topics: TOPIC_IDS.filter(x => x[0] === s.t[0]), mix: "mixed" }).filter(fresh);
  if (!pool.length) { H.used.clear(); pool = poolFor({ tier: H.cfg.tier, topics: [s.t], mix: "mixed" }); }
  const q = shuffle(pool)[0];
  H.used.add(q.n); H.qn = q.n; H.perm = makePerm(q); H.qk += 1;
  H.msg = (H.mode === "claim" ? `${CT_TEAMS[t].short} can claim ${s.tn}: they need half of their team right.`
    : H.mode === "upgrade" ? `${CT_TEAMS[t].short} is on home turf: half right upgrades ${s.tn} to ★.`
    : `${s.tn} belongs to ${CT_TEAMS[s.o].short}. ${CT_TEAMS[t].short} must beat ${CT_TEAMS[s.o].short}'s score to take it, or pay 100 rent.`) + passed;
  H.phase = "q"; H.total = secsFor(q, H.cfg.time, false); H.left = H.total; H.answers = {}; H.closing = false;
  Sound.play("join");
  ctDrawHost(); ctPush();
  stopTimer();
  tick = setInterval(() => {
    H.left = Math.max(0, H.left - 1);
    ctLiveUI();
    if (H.left <= 5 && H.left > 0) Sound.play("tick");
    if (H.left % 5 === 0 || H.closing) ctPush();
    if (H.left === 0) ctReveal();
  }, 1000);
}
function ctOnAnswer(p) {
  const H = S.host;
  if (!H || H.game !== "trail" || H.phase !== "q" || !p || p.qk !== H.qk || p.round !== H.round || H.kicked.has(p.id)) return;
  ctAdd(p);
  const a = H.answers[p.id] = H.answers[p.id] || { ans: null, left: H.left };
  if (p.ans !== undefined && p.ans !== null && JSON.stringify(p.ans) !== JSON.stringify(a.ans)) { a.ans = p.ans; a.left = H.left; }
  ctLiveUI();
  const online = [...H.online].filter(id => H.players[id]);
  if (!H.closing && online.length && online.every(id => H.answers[id] && H.answers[id].ans !== null) && H.left > 4) { H.closing = true; H.left = 4; ctLiveUI(); ctPush(); }
}
function ctReveal() {
  const H = S.host; stopTimer();
  if (!H || H.phase !== "q") return;
  const q = QUESTIONS[H.qn], t = H.active, s = H.sq[H.pos[t]];
  const prev = {}; ranking().forEach((p, k) => { prev[p.id] = k + 1; });
  const tally = {}; H.teams.forEach(x => { tally[x] = { right: 0, of: 0 }; });
  const dist = {}; let answered = 0;
  Object.values(H.players).forEach(p => {
    const tm = H.team[p.id], a = H.answers[p.id], has = a && a.ans !== null && a.ans !== undefined;
    p.prevRank = prev[p.id]; p.last = 0; p.ok = false;
    if (tm && tally[tm]) tally[tm].of += 1;
    if (has) { answered += 1; const key = Array.isArray(a.ans) ? "seq" : a.ans; dist[key] = (dist[key] || 0) + 1; }
    if (has && isCorrect(q, a.ans)) { p.ok = true; p.correct += 1; p.streak += 1; p.best = Math.max(p.best, p.streak); p.last = 100 + Math.round(100 * Math.max(0, a.left) / H.total); if (tm && tally[tm]) tally[tm].right += 1; }
    else { p.wrong += 1; p.streak = 0; }
    p.score += p.last;
  });
  const pct = x => (tally[x].of ? tally[x].right / tally[x].of : 0), P = x => Math.round(100 * pct(x));
  let outcome = "", good = false;
  if (H.mode === "claim") {
    if (pct(t) >= 0.5) { s.o = t; good = true; outcome = `${CT_TEAMS[t].short} claims ${s.tn}!`; } else outcome = `${CT_TEAMS[t].short} needed half right (got ${P(t)}%). ${s.tn} stays empty.`;
  } else if (H.mode === "upgrade") {
    if (pct(t) >= 0.5 && !s.up) { s.up = true; good = true; outcome = `${s.tn} is upgraded to ★: now worth 200.`; }
    else if (pct(t) >= 0.5) { H.bank[t] += 50; good = true; outcome = `Already upgraded: ${CT_TEAMS[t].short} earns +50 instead.`; }
    else outcome = `${CT_TEAMS[t].short} got ${P(t)}%: no upgrade this time.`;
  } else {
    const o = H.owner;
    if (pct(t) > pct(o)) { s.o = t; s.up = false; good = true; outcome = `${CT_TEAMS[t].short} (${P(t)}%) beat ${CT_TEAMS[o].short} (${P(o)}%) and takes over ${s.tn}!`; }
    else { const rent = Math.min(100, H.bank[t]); H.bank[t] -= rent; H.bank[o] += 100; outcome = `${CT_TEAMS[o].short} (${P(o)}%) held on against ${CT_TEAMS[t].short} (${P(t)}%). ${CT_TEAMS[t].short} pays 100 rent.`; }
  }
  H.res = { outcome, good, tally, mode: H.mode, active: t, owner: H.owner };
  H.log.push({ qn: H.qn, topic: q.topic, dist, answered, right: Object.values(tally).reduce((a, b) => a + b.right, 0), of: Object.values(tally).reduce((a, b) => a + b.of, 0) });
  H.phase = "result";
  Sound.play(good ? "promote" : "noanswer");
  ctPush(); ctDrawHost();
}
function ctLiveUI() {
  const H = S.host; if (!H || H.game !== "trail" || H.phase !== "q") return;
  timerUI(H.left, H.total);
  const t = document.getElementById("tleft"); if (t) t.textContent = H.left;
  const a = document.getElementById("acount"); if (a) a.textContent = Object.values(H.answers).filter(x => x.ans !== null).length;
  const c = document.getElementById("closing"); if (c) c.hidden = !H.closing;
}
function ctEnd() {
  const H = S.host; stopTimer();
  const tot = ctTotals(H), best = H.teams.slice().sort((x, y) => tot[y].total - tot[x].total);
  H.champ = tot[best[0]].total > tot[best[1]].total ? best[0] : null;
  H.phase = "end"; Sound.stopMusic();
  ctPush(); ctDrawHost();
}
function ctDrawHost() {
  const H = S.host; if (!H) return;
  const players = Object.values(H.players), tot = ctTotals(H);
  const statusText = H.status === "live" ? "Connected" : H.status === "error" ? "Connection problem" : H.status === "closed" ? "Disconnected" : "Connecting…";
  const hud = sub => `<div class="hud">${brand(sub)}<span class="stat${H.status === "error" ? " no" : ""}">${statusText}</span>${soundBtns(true)}</div>`;
  const codeBar = `<span class="stat">Join: <b>${JOIN_URL}</b> · code <b class="cy">${spaced(H.code)}</b></span>`;
  const teamCol = t => `<div class="li-team" style="border-color:${CT_TEAMS[t].col}"><h3 style="color:${CT_TEAMS[t].col}">${CT_TEAMS[t].name} · ${ctMembers(H, t).length}</h3><div class="li-members">${ctMembers(H, t).map(p => `<span class="cu">${avatarSvg(p.avatar, "xs")}${esc(p.name)}<button class="li-swap" data-swap="${esc(p.id)}" title="Move to the next team" aria-label="Move ${esc(p.name)} to another team">⇄</button></span>`).join("") || `<span class="muted small">Nobody yet</span>`}</div></div>`;
  if (H.phase === "lobby") {
    set(`${hud("Case Trail · teacher screen")}
      <section class="panel joinpanel">
        <div><span class="eyebrow">On your tablet go to</span><div class="joinurl">${JOIN_URL}</div></div>
        <div><span class="eyebrow">Game code</span><div class="bigcode">${spaced(H.code)}</div></div>
      </section>
      <section class="panel so-intro"><div><span class="eyebrow">Case Trail · ${H.teams.length} teams · ${H.cfg.turns} turns each</span><h2>Claim the trail</h2>${CT_RULES}</div>${ctBoardSvg({ sq: H.sq, pos: {}, small: true })}</section>
      <section class="panel">
        <div class="row spread"><h3>Detectives in the room · ${players.length}</h3>
          <div class="row"><button class="btn primary big" id="start" ${H.teams.every(t => ctMembers(H, t).length) ? "" : "disabled"}>Start the game</button><button class="btn quiet" id="quit">Close game</button></div></div>
        <div class="li-teams ct-teams">${H.teams.map(teamCol).join("")}</div>
        <p class="muted small">Teams are balanced automatically. Tap ⇄ to move someone to the next team. Every team needs at least one player.</p>
      </section>`, true);
    const st = document.getElementById("start"); if (st) st.onclick = ctNextTurn;
    app.querySelectorAll("[data-swap]").forEach(b => b.onclick = () => { const id = b.dataset.swap; H.team[id] = H.teams[(H.teams.indexOf(H.team[id]) + 1) % H.teams.length]; ctPush(); ctDrawHost(); });
    document.getElementById("quit").onclick = () => { hostClose(); homeFn(); };
    return;
  }
  if (H.phase === "end") return ctDrawEnd(tot);
  const t = H.active, turnLbl = `Turn ${H.turnNo} of ${H.cfg.turns * H.teams.length}`;
  const center = `<div class="ct-c"><div id="ctDie">${H.roll ? ctDie(H.roll) : ctDie(6)}</div><span class="ct-turn" style="--tc:${CT_TEAMS[t].col}">${CT_TEAMS[t].short}'s turn</span></div>`;
  const board = `<section class="panel li-main"><div id="ctBoard">${ctBoardSvg({ sq: H.sq, pos: H.pos, active: t, hl: H.hl })}</div></section>`;
  const board2 = `<section class="panel li-main ct-hasc">${ctBoardSvg({ sq: H.sq, pos: H.pos, active: t, hl: H.hl, center })}</section>`;
  let side = "";
  if (H.phase === "turn" || H.phase === "rolling" || H.phase === "moving") {
    side = `<div class="li-turn" style="border-color:${CT_TEAMS[t].col}"><span class="eyebrow">${turnLbl}</span><h2 style="color:${CT_TEAMS[t].col}">${CT_TEAMS[t].name}</h2><p>${esc(H.msg)}</p></div>
      ${H.phase === "turn" ? `<button class="btn primary big" id="roll">Roll the dice</button>` : `<p class="muted">${H.phase === "rolling" ? "Rolling…" : `Moving ${H.roll} square${H.roll === 1 ? "" : "s"}…`}</p>`}`;
  } else if (H.phase === "card") {
    side = `<div class="ct-card"><span class="eyebrow">Tip-off card</span><p>${esc(H.card)}</p></div>${H.msg ? `<p class="muted">${esc(H.msg)}</p>` : ""}<button class="btn primary big" id="apply">OK</button>`;
  } else if (H.phase === "info") {
    side = `<div class="li-turn" style="border-color:${CT_TEAMS[t].col}"><span class="eyebrow">${turnLbl}</span><p class="ct-msg">${esc(H.msg)}</p></div><button class="btn primary big" id="next">Next turn</button>`;
  } else if (H.phase === "q") {
    const q = QUESTIONS[H.qn];
    side = `<div class="li-turn" style="border-color:${CT_TEAMS[t].col}"><span class="eyebrow">${CT_TEAMS[t].name} · ${esc(H.sq[H.pos[t]].tn)}</span><p>${esc(H.msg)}</p></div>
      ${qHead(q, `<span class="stat secs"><span id="tleft">${H.left}</span>s</span>`)}<p class="brief small-brief">${esc(q.brief)}</p>
      ${todoBanner(todoText(q, "board", false))}${boardQ(q, H.perm, null)}
      <p class="muted small">Answered <b id="acount">0</b> of ${players.length}</p>
      <p class="closing" id="closing" ${H.closing ? "" : "hidden"}>Everyone has answered. Revealing…</p>
      <button class="btn primary" id="reveal">Reveal now</button>`;
  } else if (H.phase === "result") {
    const q = QUESTIONS[H.qn], r = H.res, last = H.log[H.log.length - 1];
    side = `<div class="li-turn" style="border-color:${r.good ? "var(--good)" : "var(--line)"}"><span class="eyebrow">${CT_TEAMS[t].name}</span><h2>${esc(r.outcome)}</h2></div>
      <div class="ct-pcts">${H.teams.map(x => `<div style="--tc:${CT_TEAMS[x].col}" class="${x === t || x === r.owner ? "on" : ""}"><span class="pct">${r.tally[x].of ? Math.round(100 * r.tally[x].right / r.tally[x].of) : 0}%</span><span>${CT_TEAMS[x].short}</span></div>`).join("")}</div>
      <details><summary class="eyebrow">The question</summary><p class="brief small-brief">${esc(q.brief)}</p>${boardQ(q, H.perm, { dist: last.dist, answered: last.answered })}
        ${q.type === "spot" ? `<p>Final answer: <span class="answer">${esc(q.answer)}</span></p>` : ""}<p class="why"><b>Why:</b> ${esc(q.why)}</p></details>
      <button class="btn primary big" id="next">Next turn</button>`;
  }
  set(`${hud(turnLbl)}
    <div class="row spread">${codeBar}<span class="stat">${H.phase === "q" ? `<span class="stat secs"></span>` : ""}</span></div>
    ${H.phase === "q" ? `<div class="timer big" aria-hidden="true"><div class="timer-fill" style="width:100%"></div></div>` : ""}
    <div class="li-wrap ct-layout">${H.phase === "q" || H.phase === "result" ? board : board2}
      <section class="panel li-side">${side}<span class="eyebrow">Scores</span>${ctTable(H, tot)}<div class="row"><button class="btn quiet" id="quit">End game</button></div></section></div>`, true);
  ctLiveUI();
  const r = document.getElementById("roll"); if (r) r.onclick = ctRoll;
  const ap = document.getElementById("apply"); if (ap) ap.onclick = ctApplyCard;
  const nx = document.getElementById("next"); if (nx) nx.onclick = ctNextTurn;
  const rv = document.getElementById("reveal"); if (rv) rv.onclick = ctReveal;
  document.getElementById("quit").onclick = ctEnd;
}
function ctDrawEnd(tot) {
  const H = S.host, rk = ranking(), champ = H.champ;
  const order = H.teams.slice().sort((x, y) => tot[y].total - tot[x].total);
  const byTopic = {}; H.log.forEach(e => { byTopic[e.topic] = byTopic[e.topic] || { right: 0, of: 0 }; byTopic[e.topic].right += e.right; byTopic[e.topic].of += e.of; });
  const topics = Object.entries(byTopic).sort((a, b) => a[1].right / Math.max(1, a[1].of) - b[1].right / Math.max(1, b[1].of));
  set(`<div class="hud">${brand("Case Trail · final results")}${soundBtns(true)}</div><div class="tape"></div>
    <section class="panel center"><span class="eyebrow">Final scores</span><h2 ${champ ? `style="color:${CT_TEAMS[champ].col}"` : ""}>${champ ? `${CT_TEAMS[champ].name} wins Case Trail!` : "It's a tie at the top!"}</h2>
      <div class="ct-final">${order.map((t, k) => `<div style="--tc:${CT_TEAMS[t].col}"><span class="pos">${k + 1}</span><b>${CT_TEAMS[t].short}</b><span class="ct-tot">${tot[t].total}</span><span class="muted small">bank ${tot[t].bank} + squares ${tot[t].squares}${tot[t].sets ? ` + sets ${tot[t].sets * 300}` : ""}</span></div>`).join("")}</div>
      ${ctBoardSvg({ sq: H.sq, pos: H.pos, small: true })}</section>
    ${rk.length ? ceremonyHtml(rk.slice(0, 3), "Top detectives across all teams") : ""}
    <section class="panel"><h3>Class case report</h3>
      <p class="muted small">Topics from hardest to easiest for this class.</p>
      <div class="bars">${topics.map(([tp, v]) => { const pct = v.of ? Math.round(100 * v.right / v.of) : 0; return `<div class="bar wide-label"><span>${esc(TOPICS[tp] || tp)}</span><div class="track"><div class="fill" style="width:${pct}%"></div></div><span class="n">${pct}%</span></div>`; }).join("")}</div>
      <details><summary class="eyebrow">Full results (teacher only)</summary>
        <div class="podium" style="margin-top:12px">${rk.map((p, k) => `<div class="place"><span class="pos">${k + 1}</span>${avatarSvg(p.avatar, "sm")}<span class="tn">${esc(p.name)} ${H.team[p.id] ? ctTag(H.team[p.id]) : ""}</span><span class="ts">✓${p.correct} ✗${p.wrong} · ${p.score}</span></div>`).join("")}</div>
      </details>
    </section>
    <section class="panel"><h3>What next?</h3>
      <div class="row"><button class="btn primary" id="again">Play again with the same teams</button><button class="btn" id="new">New game</button><button class="btn" id="home">Back to Incident Room</button></div>
    </section>`, true);
  if (rk.length) runCeremony(rk.slice(0, 3));
  if (champ) later(500, () => Confetti.burst(200, 0.5, 0.3));
  document.getElementById("again").onclick = () => {
    H.round += 1; H.turnNo = 0; H.log = []; H.used.clear(); ctNewBoard(H); H.phase = "lobby"; H.active = null;
    Object.values(H.players).forEach(p => Object.assign(p, { score: 0, correct: 0, wrong: 0, streak: 0, best: 0, last: 0, ok: false, prevRank: 0 }));
    Sound.startMusic("show"); ctPush(); ctDrawHost();
  };
  document.getElementById("new").onclick = () => { hostClose(); ctHostSetup(); };
  document.getElementById("home").onclick = () => { hostClose(); homeFn(); };
}

/* ================= STUDENT ================= */
function ctStudentState(st) {
  const P = S.stu;
  if (st.round !== P.round) { P.round = st.round; P.hist = []; P.lastRank = 0; }
  P.state = st;
  const key = `${st.round}:${st.phase}:${st.turnNo}:${st.qk}`;
  const mine = st.scores && st.scores[P.id], myT = st.teams && st.teams[P.id];
  if (key === P.key) {
    if (st.phase === "q") { P.left = Math.min(P.left, st.left); timerUI(P.left, st.total); const t = document.getElementById("tleft"); if (t) t.textContent = P.left; const c = document.getElementById("closing"); if (c) c.hidden = !st.closing; }
    else if (st.phase === "lobby" || st.phase === "moving" || st.phase === "card" || st.phase === "info") ctDrawStudent();
    return;
  }
  P.key = key;
  stopTimer();
  if (st.phase === "q") {
    P.L = freshPad(); P.left = st.left;
    S.pad = { L: P.L, act: (a, v) => ctStudentAct(a, v) };
    tick = setInterval(() => { P.left = Math.max(0, P.left - 1); timerUI(P.left, st.total); const t = document.getElementById("tleft"); if (t) t.textContent = P.left; }, 1000);
  } else S.pad = null;
  if (st.phase === "result" && st.qn !== null) {
    const q = QUESTIONS[st.qn];
    P.hist.push({ q, ok: !!(mine && mine.ok), ans: P.L ? P.L.sentAns : null });
    Sound.play(mine && mine.ok ? "correct" : P.L && P.L.sentAns !== null ? "wrong" : "noanswer");
  }
  if (st.phase === "turn" && st.active === myT) Sound.play("promote");
  if (st.phase === "end") studentSave();
  ctDrawStudent();
}
function ctStudentAct(act, v) {
  const P = S.stu, st = P && P.state;
  if (!st || st.phase !== "q") return;
  const q = QUESTIONS[st.qn], L = P.L, r = padAct(q, L, act, v);
  if (!r) return;
  const send = ans => P.ch.send({ type: "broadcast", event: "answer", payload: { id: P.id, name: S.player.name, avatar: S.player.avatar, round: st.round, qk: st.qk, ans } });
  if (r === "ans") { L.sentAns = L.ans; send(L.ans); Sound.play("tap"); }
  if (act === "seq-send" && L.ans) { L.sentAns = L.ans.slice(); send(L.sentAns); Sound.play("tap"); }
  if (r === "text" && q.type === "type") { L.sentAns = L.ans; L.sentText = L.ans; send(L.ans); Sound.play("tap"); }
  if (r === "seq") Sound.play("tap");
  ctDrawStudent(true);
}
function ctDrawStudent(keep = false) {
  const P = S.stu, st = P.state, mine = st.scores && st.scores[P.id], myT = st.teams && st.teams[P.id];
  const me = `<div class="who">${avatarSvg(S.player.avatar, "sm")}${esc(S.player.name)}</div>`;
  const cnt = mine ? counters(mine.correct, mine.wrong) : "";
  const hud = extra => `<div class="hud">${me}${myT ? ctTag(myT) : ""}${extra || ""}${cnt}${soundBtns()}</div>`;
  const board = () => `<section class="panel">${ctBoardSvg({ sq: st.sq, pos: st.pos, active: st.active, small: true })}</section>`;
  const myTot = myT && st.tot && st.tot[myT] ? `<span class="stat">Team <b>${st.tot[myT].total}</b></span>` : "";
  if (st.phase === "lobby") {
    return set(`${hud(`<span class="stat">Game <b>${spaced(P.code)}</b></span>`)}
      <section class="panel center li-joined" ${myT ? `style="border:3px solid ${CT_TEAMS[myT].col}"` : ""}>${avatarSvg(S.player.avatar, "lg")}<span class="eyebrow">You're in, ${esc(S.player.name)}</span>
        <h2 ${myT ? `style="color:${CT_TEAMS[myT].col}"` : ""}>${myT ? `You're on the ${CT_TEAMS[myT].name}` : "Finding your team…"}</h2></section>
      <section class="panel"><span class="eyebrow">Case Trail</span>${CT_RULES}</section>`);
  }
  if (st.phase === "end") {
    const res = drawStudent(keep), hudEl = app.querySelector(".hud"), champ = st.champ;
    if (hudEl) hudEl.insertAdjacentHTML("afterend", `<section class="panel center"><h2 ${champ ? `style="color:${CT_TEAMS[champ].col}"` : ""}>${champ ? (champ === myT ? "Your team wins Case Trail!" : `${CT_TEAMS[champ].name} wins Case Trail`) : "A tie at the top!"}</h2>
      <div class="ct-final">${st.teamsList.slice().sort((x, y) => st.tot[y].total - st.tot[x].total).map((t, k) => `<div style="--tc:${CT_TEAMS[t].col}"><span class="pos">${k + 1}</span><b>${CT_TEAMS[t].short}</b><span class="ct-tot">${st.tot[t].total}</span></div>`).join("")}</div></section>`);
    return res;
  }
  if (st.phase === "q") {
    const q = QUESTIONS[st.qn], t = st.active;
    const stake = st.mode === "claim" ? (t === myT ? "Your team can claim this square: you need half of you right." : `${CT_TEAMS[t].short} is trying to claim this square. Answer anyway: every right answer scores you points.`)
      : st.mode === "upgrade" ? (t === myT ? "Your home turf: half right upgrades it to ★." : `${CT_TEAMS[t].short} is on home turf. Answer for your own points.`)
      : st.owner === myT ? `${CT_TEAMS[t].short} is attacking YOUR square! Beat their score to keep it.` : t === myT ? `Beat ${CT_TEAMS[st.owner].short}'s score to take this square, or pay rent.` : `${CT_TEAMS[t].short} v ${CT_TEAMS[st.owner].short}. Answer for your own points.`;
    return set(`${hud(myTot)}
      <div class="timer" aria-hidden="true"><div class="timer-fill" style="width:${(P.left / st.total) * 100}%"></div></div>
      <section class="panel">
        <div class="li-turn" style="border-color:${CT_TEAMS[t].col}"><b>${esc(stake)}</b></div>
        ${qHead(q, `<span class="stat secs"><span id="tleft">${P.left}</span>s</span>`)}
        <p class="brief">${esc(q.brief)}</p>
        ${todoBanner(todoText(q, "live", false))}
        ${deviceQ(q, st.perm, P.L, { mode: "live", typed: false })}
        <p class="closing" id="closing" ${st.closing ? "" : "hidden"}>Everyone has answered. A few seconds left to change your answer.</p>
      </section>`, false, keep);
  }
  if (st.phase === "result") {
    const q = QUESTIONS[st.qn], h = P.hist[P.hist.length - 1], ok = mine && mine.ok, r = st.res;
    return set(`${hud(myTot)}
      <section class="panel">
        <div class="result ${ok ? "good" : "bad"}"><span class="rhead">${ok ? `Correct · +${mine.last}` : h && h.ans !== null ? "Not this time" : "No answer in time"}</span>
          ${!ok && h && h.ans !== null && h.ans !== undefined ? `<p>You said: <b>${esc(ansLabel(q, h.ans))}</b></p>` : ""}
          <p>Correct answer: <span class="answer">${esc(rightLabel(q))}</span></p><p class="why"><b>Why:</b> ${esc(q.why)}</p></div>
        <div class="li-turn" style="border-color:${r.good ? "var(--good)" : "var(--line)"}"><b>${esc(r.outcome)}</b></div>
      </section>${board()}`);
  }
  /* turn, rolling, moving, card, info: follow the board */
  const t = st.active;
  const head = st.phase === "card" ? `<div class="ct-card"><span class="eyebrow">Tip-off card · ${CT_TEAMS[t].short}</span><p>${esc(st.card || "")}</p></div>`
    : `<div class="li-turn" style="border-color:${CT_TEAMS[t].col}"><span class="eyebrow">Turn ${st.turnNo} of ${st.maxTurns}</span><h2 style="color:${CT_TEAMS[t].col}">${t === myT ? "Your team's turn!" : `${CT_TEAMS[t].name}'s turn`}</h2>
      <p>${st.phase === "turn" ? (t === myT ? "Watch the board: the dice is about to roll." : "Watch the board.") : st.phase === "moving" || st.phase === "rolling" ? (st.roll ? `Rolled a ${st.roll}…` : "Rolling…") : esc(st.msg)}</p></div>`;
  return set(`${hud(myTot)}<section class="panel">${head}</section>${board()}`);
}
