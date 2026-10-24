/* ================= APP ================= */
const CFG = window.IR_CONFIG || {};
const JOIN_URL = "lab.mathsforensics.com/join";
const LAB_URL = CFG.labUrl || "https://lab.mathsforensics.com/";
const signInUrl = next => `${LAB_URL}?next=${next || "incident-room"}`;
const liveConfigured = () => !!(window.supabase && CFG.url && CFG.key && !/PASTE/.test(CFG.url + CFG.key));
let sbClient = null;
const sb = () => sbClient || (sbClient = window.supabase.createClient(CFG.url, CFG.key, { realtime: { params: { eventsPerSecond: 20 } } }));

const app = document.getElementById("app");
const S = { player: { name: "", avatar: "det-f" }, user: null, acc: null, solo: null, teams: null, host: null, stu: null, pad: null, guarded: false };
window.IR = { S, QUESTIONS, normAns, isCorrect, typedOk, TOPICS, poolFor, pickQuestions, FREE_TOPICS_IR: () => FREE_TOPICS_IR, SO, IK, Sound };
let tick = null;
const stopTimer = () => { if (tick) { clearInterval(tick); tick = null; } };
/* ---------- celebrations: medals, podium reveal, confetti ---------- */
let celebTimers = [];
const later = (ms, fn) => celebTimers.push(setTimeout(fn, ms));
const clearCeleb = () => { celebTimers.forEach(clearTimeout); celebTimers = []; };
const reduceMotion = () => { try { return matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) { return false; } };
const Confetti = (() => {
  let cv = null, cx = null, parts = [], raf = null, W = 0, H = 0, dpr = 1;
  const COLS = ["#00FCF1", "#1B36FF", "#FFC857", "#3DDC97", "#FF6B86", "#E9EDFA"];
  function size() { dpr = Math.min(2, window.devicePixelRatio || 1); W = innerWidth; H = innerHeight; cv.width = W * dpr; cv.height = H * dpr; cx.setTransform(dpr, 0, 0, dpr, 0, 0); }
  function loop() {
    cx.clearRect(0, 0, W, H);
    parts.forEach(p => { p.vy += p.g; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.r += p.vr;
      cx.save(); cx.translate(p.x, p.y); cx.rotate(p.r); cx.fillStyle = p.c; cx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.abs(Math.cos(p.r * 2))); cx.restore(); });
    parts = parts.filter(p => p.y < H + 40);
    raf = parts.length ? requestAnimationFrame(loop) : (cx.clearRect(0, 0, W, H), null);
  }
  return {
    burst(n = 140, ox = 0.5, oy = 0.3) {
      if (reduceMotion() || !document.body) return;
      if (!cv) { cv = document.createElement("canvas"); cv.className = "confetti"; cv.setAttribute("aria-hidden", "true"); document.body.appendChild(cv); cx = cv.getContext("2d"); addEventListener("resize", () => cv && size()); }
      if (!cx) return;
      size();
      for (let i = 0; i < n; i++) parts.push({ x: W * ox + (Math.random() - 0.5) * W * 0.2, y: H * oy, vx: (Math.random() - 0.5) * 14, vy: -Math.random() * 13 - 3,
        g: 0.22 + Math.random() * 0.12, w: 6 + Math.random() * 6, h: 9 + Math.random() * 8, r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.35, c: COLS[i % COLS.length] });
      if (!raf) raf = requestAnimationFrame(loop);
    }
  };
})();
const MEDALS_C = { 1: ["#FFD66B", "#C9971C", "Gold"], 2: ["#EEF1F8", "#9AA6BD", "Silver"], 3: ["#EDB088", "#A8643A", "Bronze"] };
const medalSvg = (p, cls = "") => { const [c1, c2] = MEDALS_C[p];
  return `<svg class="medal-svg ${cls}" viewBox="0 0 64 84" aria-hidden="true"><path d="M17 0h13l7 26H24z" fill="#1B36FF"/><path d="M47 0H34l-7 26h13z" fill="#00FCF1"/>
    <circle cx="32" cy="54" r="27" fill="${c2}"/><circle cx="32" cy="54" r="22" fill="${c1}"/><circle cx="32" cy="54" r="22" fill="none" stroke="${c2}" stroke-width="1.5" stroke-dasharray="3 3"/>
    <text x="32" y="63" text-anchor="middle" font-size="26" font-weight="700" fill="#0B122C" font-family="Josefin Sans, Trebuchet MS, sans-serif">${p}</text>
    <path class="glint" d="M19 44l7-7" stroke="#fff" stroke-width="3" stroke-linecap="round"/></svg>`; };
/* reveal timings (ms): 3rd, 2nd, drumroll, 1st */
const REVEAL = { 3: 1200, 2: 2700, roll: 3900, 1: 5400 };
const PLACE_WORD = { 1: "1st", 2: "2nd", 3: "3rd" };
function ceremonyHtml(top, title) {
  const slots = [2, 1, 3].filter(p => top[p - 1]);
  return `<section class="panel ceremony"><h2 class="cer-title">${esc(title)}</h2>
    <div class="stage">${slots.map(p => { const t = top[p - 1];
      return `<div class="pod p${p}" style="--d:${REVEAL[p] / 1000}s">
        <div class="pod-top">${p === 1 ? `<div class="spot"></div>` : ""}${medalSvg(p)}${avatarSvg(t.avatar, "xl")}<span class="pod-name">${esc(t.name)}</span><span class="pod-score">${t.score} points</span></div>
        <div class="plinth"><span>${PLACE_WORD[p]}</span></div></div>`; }).join("")}</div></section>`;
}
function runCeremony(top) {
  if (!top.length) return;
  Sound.stopMusic();
  if (top[2]) later(REVEAL[3], () => Sound.play("bronze"));
  if (top[1]) later(REVEAL[2], () => Sound.play("silver"));
  later(REVEAL.roll, () => Sound.play("drumroll"));
  later(REVEAL[1], () => { Sound.play("gold"); Confetti.burst(180, 0.5, 0.3); });
  later(REVEAL[1] + 700, () => Confetti.burst(120, 0.25, 0.35));
  later(REVEAL[1] + 1300, () => Confetti.burst(120, 0.75, 0.35));
}
const set = (html, wide = false, keepScroll = false) => {
  clearCeleb();
  app.classList.toggle("wide", wide);
  app.innerHTML = html;
  if (!keepScroll) window.scrollTo(0, 0);
};

/* ---------- avatars ---------- */
const C = { cyan: "#00FCF1", blue: "#1B36FF", amber: "#FFC857", ink: "#0B122C" };
const ring = `<circle cx="32" cy="32" r="30" fill="${C.ink}" stroke="${C.blue}" stroke-width="2"/>`;
const EMBLEMS = [
  { id: "lens", svg: `${ring}<g class="a-bob"><circle cx="28" cy="28" r="11" fill="none" stroke="${C.cyan}" stroke-width="4"/><line x1="36" y1="36" x2="46" y2="46" stroke="${C.cyan}" stroke-width="5" stroke-linecap="round"/></g>` },
  { id: "print", svg: `${ring}<g fill="none" stroke="${C.cyan}" stroke-width="2.4" stroke-linecap="round"><path d="M18 36c1-11 7-17 14-17s13 6 14 17"/><path d="M23 40c0-9 4-15 9-15s9 6 9 15"/><path d="M28 44c0-7 2-12 4-12s4 5 4 12"/></g><rect class="a-scan" x="14" y="31" width="36" height="2" rx="1" fill="${C.amber}"/>` },
  { id: "owl", svg: `${ring}<g class="a-bob"><path d="M18 22l6 6M46 22l-6 6" stroke="${C.cyan}" stroke-width="3" stroke-linecap="round"/><circle cx="25" cy="33" r="7" fill="none" stroke="${C.cyan}" stroke-width="3"/><circle cx="39" cy="33" r="7" fill="none" stroke="${C.cyan}" stroke-width="3"/><circle cx="25" cy="33" r="2.5" fill="${C.amber}"/><circle cx="39" cy="33" r="2.5" fill="${C.amber}"/><path d="M30 42l2 3 2-3z" fill="${C.amber}"/></g>` },
  { id: "torch", svg: `${ring}<path class="a-flick" d="M30 26L52 16v32L30 38z" fill="${C.amber}" opacity=".85"/><rect x="12" y="27" width="20" height="10" rx="3" fill="${C.cyan}"/>` }
];
const AVATARS = CHAR_DEFS.map(d => ({ id: d.id, name: d.role }));
const avatarSvg = (id, cls = "") => {
  const d = CHAR_DEFS.find(x => x.id === id);
  if (d) return `<svg class="av ${cls}" viewBox="0 0 64 64" aria-hidden="true">${charSvgBody(d)}</svg>`;
  const a = EMBLEMS.find(x => x.id === id) || EMBLEMS[0];
  return `<svg class="av ${cls}" viewBox="0 0 64 64" aria-hidden="true">${a.svg}</svg>`;
};
const SHIELD = `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M32 4l24 9v17c0 15-10 25-24 30C18 55 8 45 8 30V13z" fill="${C.ink}" stroke="${C.cyan}" stroke-width="3"/><circle cx="29" cy="28" r="9" fill="none" stroke="${C.cyan}" stroke-width="3"/><line x1="35.5" y1="34.5" x2="43" y2="42" stroke="${C.cyan}" stroke-width="4" stroke-linecap="round"/><rect x="18" y="47" width="28" height="3" fill="${C.amber}"/></svg>`;
const brand = (sub = "Maths Forensics Lab") => `<div class="brand">${SHIELD}<div><div class="name">Incident Room</div><div class="sub">${esc(sub)}</div></div></div>`;
const avatarPicker = sel => `<div class="avatars" role="group" aria-label="Detectives">${AVATARS.map(a => `<button class="av-btn" data-avatar="${a.id}" aria-pressed="${a.id === sel}">${avatarSvg(a.id)}<span>${a.name}</span></button>`).join("")}</div>`;
const bindPicker = onPick => app.querySelectorAll("[data-avatar]").forEach(b => b.onclick = () => {
  onPick(b.dataset.avatar);
  app.querySelectorAll("[data-avatar]").forEach(x => x.setAttribute("aria-pressed", x === b));
  Sound.play("tap");
});

/* ---------- sound buttons (any screen) ---------- */
const ICON_SPK = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="M16 9c1.5 1.5 1.5 4.5 0 6M18.5 6.5c3 3 3 8 0 11" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>`;
const ICON_NOTE = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 17V5l11-2v12" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="6.5" cy="17.5" r="2.5" fill="currentColor"/><circle cx="17.5" cy="15.5" r="2.5" fill="currentColor"/></svg>`;
const soundBtns = (music = false) => `<div class="toggles">
  <button class="iconbtn" data-ui="sfx" aria-pressed="${Sound.sfx}">${ICON_SPK}<span>${Sound.sfx ? "Sound on" : "Sound off"}</span></button>
  ${music ? `<button class="iconbtn" data-ui="music" aria-pressed="${Sound.music}">${ICON_NOTE}<span>${Sound.music ? "Music on" : "Music off"}</span></button>` : ""}</div>`;
app.addEventListener("click", e => {
  const u = e.target.closest && e.target.closest("[data-ui]");
  if (!u) return;
  if (u.dataset.ui === "sfx") { const on = Sound.toggleSfx(); u.setAttribute("aria-pressed", on); u.querySelector("span").textContent = on ? "Sound on" : "Sound off"; }
  if (u.dataset.ui === "music") { const on = Sound.toggleMusic(); u.setAttribute("aria-pressed", on); u.querySelector("span").textContent = on ? "Music on" : "Music off"; }
});

/* ---------- answer pad: shared by solo and live devices ---------- */
const freshPad = () => ({ ans: null, seq: [], draft: "", sentAns: null, sentText: null });
const todoBanner = text => `<div class="todo"><span class="todo-k">What to do</span><span class="todo-t">${esc(text)}</span></div>`;
const qHead = (q, secsHtml = "") => `<div class="row spread qhead"><div class="row"><span class="tag strong">${TYPES[q.type].label}</span><span class="tag">${TOPICS[q.topic]}</span></div>${secsHtml}</div>`;

function deviceQ(q, perm, L, o) {
  const live = o.mode === "live";
  const picked = v => (L.ans === v ? " picked" : "");
  const sendTxt = live ? (L.sentAns !== null && L.sentAns !== undefined ? "Send new answer" : "Send") : "Check answer";
  let h = "";
  if (q.type === "spot") {
    h = `<div class="evidence">${q.lines.map((l, k) => `<button class="ev${picked(k)}" data-act="pick" data-v="${k}"><span class="ln">Line ${k + 1}</span><span class="evt">${esc(l)}</span><span class="verdict">${L.ans === k ? "Your choice" : ""}</span></button>`).join("")}</div>`;
    if (live && typedFor(q, o.typed) && L.ans !== null) h += typeBox(L, "Now type the correct final answer to the question", "e.g. £36 and £48", L.sentText !== null ? "Update" : "Send");
  }
  if (q.type === "mc" || q.type === "method") {
    h = `<div class="opts${q.type === "method" ? " long" : ""}">${perm.map((oi, k) => `<button class="opt${picked(oi)}" data-act="pick" data-v="${oi}"><span class="let">${LETTERS[k]}</span><span class="ot">${esc(q.options[oi])}</span></button>`).join("")}</div>`;
  }
  if (q.type === "tf") {
    h = `<div class="opts tf">${[1, 0].map(v => `<button class="opt${picked(v)}" data-act="pick" data-v="${v}"><span class="ot">${v ? "True" : "False"}</span></button>`).join("")}</div>`;
  }
  if (q.type === "order") {
    const full = L.seq.length === q.items.length;
    h = `<div class="opts">${perm.map(oi => { const p = L.seq.indexOf(oi); return `<button class="opt${p >= 0 ? " picked" : ""}" data-act="seq" data-v="${oi}"><span class="let num">${p >= 0 ? p + 1 : ""}</span><span class="ot">${esc(q.items[oi])}</span></button>`; }).join("")}</div>
      <div class="row"><button class="btn" data-act="seq-clear" ${L.seq.length ? "" : "disabled"}>Start again</button>${live ? `<button class="btn primary" data-act="seq-send" ${full ? "" : "disabled"}>${sendTxt}</button>` : ""}</div>`;
  }
  if (q.type === "type") h = typeBox(L, "Your answer", q.hint || "", live ? (L.sentAns !== null ? "Update" : "Send") : "Check answer");
  if (live && L.sentAns !== null) h += `<p class="sent">Answer sent. You can change it until the time runs out.</p>`;
  if (!live) {
    const ready = q.type === "order" ? L.seq.length === q.items.length : q.type === "type" ? false : L.ans !== null;
    if (q.type !== "type") h += `<div class="row"><button class="btn primary big" data-act="check" ${ready ? "" : "disabled"}>Check answer</button></div>`;
  }
  return h;
}
function typeBox(L, label, hint, btn) {
  return `<div class="typebox"><label for="tans">${esc(label)}</label>
    <div class="row"><input id="tans" class="field" maxlength="30" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="${esc(hint)}" value="${esc(L.draft)}">
    <button class="btn primary" data-act="send-text">${esc(btn)}</button></div>
    <p class="muted small">For x² type x^2. You can leave out £ and % signs.</p>
    ${L.sentText !== null && L.sentText !== undefined ? `<p class="sent">Sent: <b>${esc(L.sentText)}</b></p>` : ""}</div>`;
}
app.addEventListener("click", e => {
  const b = e.target.closest && e.target.closest("[data-act]");
  if (!b || b.disabled || !S.pad) return;
  const v = b.dataset.v;
  S.pad.act(b.dataset.act, v === undefined ? null : Number(v));
});
app.addEventListener("input", e => { if (e.target.id === "tans" && S.pad) S.pad.L.draft = e.target.value; });
app.addEventListener("keydown", e => { if (e.target.id === "tans" && e.key === "Enter" && S.pad) S.pad.act("send-text", null); });

/* applies a tap to a pad; returns what changed */
function padAct(q, L, act, v) {
  if (act === "pick") { L.ans = v; return "ans"; }
  if (act === "seq") {
    const p = L.seq.indexOf(v);
    if (p >= 0) L.seq = L.seq.slice(0, p); else L.seq.push(v);
    L.ans = L.seq.length === q.items.length ? L.seq.slice() : null;
    return "seq";
  }
  if (act === "seq-clear") { L.seq = []; L.ans = null; return "seq"; }
  if (act === "send-text") {
    const inp = document.getElementById("tans");
    const t = (inp ? inp.value : L.draft).trim().slice(0, 30);
    if (!t) return null;
    L.draft = t;
    if (q.type === "type") L.ans = t;
    return "text";
  }
  return act;
}

/* ---------- board view of a question (teacher screen, team showdown) ---------- */
const distBar = (n, of) => `<span class="dist"><span style="width:${of ? (n / of) * 100 : 0}%"></span></span>`;
function boardQ(q, perm, rv) {
  const counts = rv && !rv.noCounts;
  if (q.type === "spot") return `<div class="evidence">${q.lines.map((l, k) => { const hit = rv && k === q.err, d = counts ? (rv.dist[k] || 0) : 0;
    return `<div class="ev${hit ? " tampered" : ""}"><span class="ln">Line ${k + 1}</span><span class="evt">${esc(l)}${counts ? distBar(d, rv.answered) : ""}</span><span class="verdict">${hit ? "Mistake" : ""}${counts ? ` <b>${d}</b>` : ""}</span></div>`; }).join("")}</div>
    ${rv ? `<div class="fixline"><span class="todo-k">Should read</span> <span class="answer">${esc(q.fixes[0])}</span></div>` : ""}`;
  if (q.type === "mc" || q.type === "method") return `<div class="opts${q.type === "method" ? " long" : ""}">${perm.map((oi, k) => { const cls = rv ? (oi === 0 ? " right" : " dim") : "";
    return `<div class="opt${cls}"><span class="let">${LETTERS[k]}</span><span class="ot">${esc(q.options[oi])}</span>${counts ? `<span class="cnt">${rv.dist[oi] || 0}</span>` : ""}</div>`; }).join("")}</div>`;
  if (q.type === "tf") return `<div class="opts tf">${[1, 0].map(v => { const cls = rv ? ((v === 1) === q.correct ? " right" : " dim") : "";
    return `<div class="opt${cls}"><span class="ot">${v ? "True" : "False"}</span>${counts ? `<span class="cnt">${rv.dist[v] || 0}</span>` : ""}</div>`; }).join("")}</div>`;
  if (q.type === "order") return rv
    ? `<ol class="orderlist">${q.items.map(t => `<li>${esc(t)}</li>`).join("")}</ol>`
    : `<div class="opts">${perm.map((oi, k) => `<div class="opt"><span class="let">${LETTERS[k]}</span><span class="ot">${esc(q.items[oi])}</span></div>`).join("")}</div>`;
  if (q.type === "type") return rv ? `<div class="bigans"><span class="todo-k">Answer</span> ${esc(q.answer)}</div>` : `<div class="typehint">Type your answer on your tablet</div>`;
  return "";
}

/* ---------- leave-the-game safeguard ---------- */
const leaveModal = document.createElement("div");
leaveModal.className = "modal"; leaveModal.hidden = true;
leaveModal.innerHTML = `<div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="leave-h">
  <h2 id="leave-h">Leave the game?</h2>
  <p id="leave-p">If you leave, you stop scoring points. You can rejoin with the same code and keep your score.</p>
  <div class="row"><button class="btn primary" id="leave-stay">Stay in the game</button><button class="btn" id="leave-go">Leave the game</button></div></div>`;
document.body.appendChild(leaveModal);
let onLeave = null;
function armGuard(leaveFn, text) {
  onLeave = leaveFn;
  document.getElementById("leave-p").textContent = text;
  if (!S.guarded) { try { history.pushState({ ir: 1 }, ""); } catch (e) {} S.guarded = true; }
}
function disarmGuard() { S.guarded = false; onLeave = null; leaveModal.hidden = true; }
window.addEventListener("popstate", () => {
  if (!S.guarded) return;
  try { history.pushState({ ir: 1 }, ""); } catch (e) {}
  leaveModal.hidden = false;
  document.getElementById("leave-stay").focus();
});
window.addEventListener("beforeunload", e => { if (S.guarded) { e.preventDefault(); e.returnValue = ""; } });
document.getElementById("leave-stay").onclick = () => { leaveModal.hidden = true; };
document.getElementById("leave-go").onclick = () => { const f = onLeave; disarmGuard(); if (f) f(); };

/* ---------- signed-in student (Lab account on the same site) ---------- */
async function initAuth() {
  if (!liveConfigured()) return;
  try {
    const { data } = await sb().auth.getSession();
    const u = data && data.session && data.session.user;
    if (!u) return;
    const md = u.user_metadata || {};
    const first = String(md.first_name || md.given_name || md.full_name || md.name || (u.email || "").split("@")[0] || "").trim().split(/\s+/)[0];
    S.user = { id: u.id, email: u.email || "", name: first.slice(0, 20) };
    if (!S.player.name) S.player.name = S.user.name;
  } catch (e) {}
}
/* ================= PLANS: what this person can play ================= */
/* S.acc is null until we know the plans are switched on (migration 007 run); while null nothing is locked. */
const FREE_TOPICS_IR = ["N1", "N2", "N5", "A1", "A2", "A6", "R1", "R2", "G1", "G4", "P1", "S1"];
const GUEST_SOLO_LIMIT = 2;
const PRICES = Object.assign({ pass: "£49", passLater: "£59", teacherPro: "£49 a year" }, CFG.prices || {});
const gating = () => !!S.acc;
const hostUnlimited = () => !gating() || ["pro", "school", "trial"].includes(S.acc.host_plan);
const soloUnlimited = () => !gating() || (S.acc.signed_in && (S.acc.lab_level === "full" || hostUnlimited()));
const soloAllow = () => (soloUnlimited() ? null : FREE_TOPICS_IR);
const fmtDate = d => { try { return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }); } catch (e) { return ""; } };
const fmtDay = d => { try { return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long" }); } catch (e) { return ""; } };
async function loadAccess() {
  if (!liveConfigured()) return;
  try {
    const { data, error } = await sb().rpc("ir_access");
    S.acc = error ? null : (data || { signed_in: false });
  } catch (e) { S.acc = null; }
}
function guestSolo() {
  const today = new Date().toISOString().slice(0, 10);
  const g = store.get("ir-guest-solo", { day: today, n: 0 });
  return g.day === today ? g : { day: today, n: 0 };
}
function planLabel() {
  if (!gating()) return S.user ? "Signed in · " + S.user.name : "Playing as a guest";
  const a = S.acc;
  if (!a.signed_in) { const left = Math.max(0, GUEST_SOLO_LIMIT - guestSolo().n); return `Guest · ${left} of ${GUEST_SOLO_LIMIT} free games left today`; }
  if (a.host_plan === "pro") return "Teacher Pro";
  if (a.host_plan === "school") return "School licence";
  if (a.host_plan === "trial") return `Teacher Pro trial · until ${fmtDay(a.trial_ends)}`;
  if (a.lab_level === "full") return a.lab_source === "school" ? "School licence" : "Exam Pass";
  return `Free plan · ${Math.max(0, a.solo_limit - a.solo_today)} of ${a.solo_limit} solo games left today`;
}
const upgradeCard = (kind) => kind === "pass" ? `<div class="plan best"><span class="eyebrow">For students</span><h3>Lab Exam Pass</h3>
    <p class="price"><b>${esc(PRICES.pass)}</b>${PRICES.passLater && PRICES.passLater !== PRICES.pass ? ` <span class="muted small">launch price, then ${esc(PRICES.passLater)}</span>` : ""}</p>
    <ul><li>Unlimited solo games on all 76 GCSE topics</li><li>Your case record: promotions, medals and topics to practise</li><li>Everything in Maths Forensics Lab, until your exams</li></ul>
    <a class="btn primary" href="${esc(CFG.examPassUrl || LAB_URL)}">Get the Exam Pass</a></div>`
  : `<div class="plan best"><span class="eyebrow">For teachers</span><h3>Teacher Pro</h3><p class="price"><b>${esc(PRICES.teacherPro)}</b></p>
    <ul><li>Unlimited live games and team showdowns</li><li>All 432 questions, Foundation and Higher, every topic</li><li>Class case reports after every game</li></ul>
    ${CFG.teacherProUrl ? `<a class="btn primary" href="${esc(CFG.teacherProUrl)}">Get Teacher Pro</a>` : `<span class="tag">On sale soon</span>`}</div>`;
function upgradeScreen(reason, back, retry) {
  stopTimer(); S.pad = null;
  const a = S.acc || {};
  const canTrial = reason === "host_limit" && a.signed_in && !a.trial_used;
  const head = { solo_limit: ["You've played your free games for today", `Free accounts get ${a.solo_limit || GUEST_SOLO_LIMIT} solo games a day on ${FREE_TOPICS_IR.length} sample topics. Come back tomorrow, or unlock everything now.`],
    host_limit: ["You've hosted your 3 free games this month", "Free teacher accounts can host 3 live games or team showdowns a month. Start a free trial or go Pro for unlimited games."],
    locked: ["That topic is part of the Exam Pass", `The free plan covers ${FREE_TOPICS_IR.length} sample topics. The Exam Pass unlocks all 76.`] }[reason];
  set(`${brand(planLabel())}<div class="tape"></div>
    <section class="panel"><span class="eyebrow">Upgrade</span><h2>${esc(head[0])}</h2><p class="muted">${esc(head[1])}</p>
      ${canTrial ? `<div class="row"><button class="btn primary big" id="trial">Start my 14-day free trial</button></div><p class="muted small">Teacher Pro free for 14 days. No card needed, and it doesn't renew.</p>` : ""}
      <div class="plans">${reason === "host_limit" ? upgradeCard("pro") : upgradeCard("pass")}
        ${reason === "host_limit" ? `<div class="plan"><span class="eyebrow">For schools</span><h3>Department licence</h3><p class="muted">Every maths teacher and student in your school, with Maths Forensics Lab included. Email <b>${esc(CFG.supportEmail || "support@mathsforensics.com")}</b> for a quote.</p></div>`
          : `<div class="plan"><span class="eyebrow">At school?</span><h3>Join your class</h3><p class="muted">If your school has a licence, enter your class code in Maths Forensics Lab and everything unlocks.</p><a class="btn" href="${LAB_URL}">Open the Lab</a></div>`}</div>
      <div class="row"><button class="btn" id="recheck">I've just paid: check again</button><button class="btn quiet" id="back">Back</button></div>
    </section>`, reason === "host_limit");
  const t = document.getElementById("trial");
  if (t) t.onclick = async () => { t.disabled = true; try { const { data, error } = await sb().rpc("ir_start_trial"); if (!error && data) S.acc = data; } catch (e) {} retry ? retry() : back(); };
  document.getElementById("recheck").onclick = async () => { await loadAccess(); retry ? retry() : back(); };
  document.getElementById("back").onclick = back;
}
function signInToHost(back) {
  set(`${brand("Host a game")}<section class="panel"><h2>Sign in to host a game</h2>
    <p class="muted">Hosting is free with a Maths Forensics Lab account: 3 live games or team showdowns a month, or unlimited with Teacher Pro (${esc(PRICES.teacherPro)}). New accounts can try Teacher Pro free for 14 days.</p>
    <div class="row"><a class="btn primary" href="${signInUrl("incident-room-host")}">Sign in or create a free account</a><button class="btn quiet" id="back">Back</button></div></section>`);
  document.getElementById("back").onclick = back;
}

/* My account: what this person's plan includes, with upgrade, trial and "check again" */
const withEmail = url => { try { const u = new URL(url); if (S.user && S.user.email) u.searchParams.set("email", S.user.email); return u.toString(); } catch (e) { return url; } };
async function accountScreen() {
  stopTimer(); S.pad = null;
  set(`${brand("My account")}<div class="tape"></div><section class="panel"><h2>Checking your plan…</h2></section>`);
  await loadAccess();
  const a = S.acc, back = `<button class="btn quiet" id="back">Back</button>`;
  if (!S.user || !a || !a.signed_in) {
    set(`${brand("My account")}<div class="tape"></div><section class="panel"><span class="eyebrow">My account</span>
      ${S.user ? `<h2>Your plan couldn't be loaded</h2><p class="muted">Check your connection and try again.</p><div class="row"><button class="btn primary" id="again">Try again</button>${back}</div>`
        : `<h2>You're playing as a guest</h2><p class="muted">Guests get ${GUEST_SOLO_LIMIT} solo games a day. Sign in to Maths Forensics Lab to save your case record, host games and see your plan.</p>
          <div class="row"><a class="btn primary" href="${signInUrl()}">Sign in to the Lab</a>${back}</div>`}</section>`);
    const ag = document.getElementById("again"); if (ag) ag.onclick = accountScreen;
    document.getElementById("back").onclick = signIn; return;
  }
  const unlimitedSolo = a.lab_level === "full" || ["pro", "school", "trial"].includes(a.host_plan);
  const solo = unlimitedSolo ? `<b>Unlimited</b> on every topic${a.lab_level === "full" ? ` (${a.lab_source === "school" ? "school licence" : "Exam Pass"})` : ""}`
    : `<b>${Math.max(0, a.solo_limit - a.solo_today)} of ${a.solo_limit}</b> free games left today, on ${FREE_TOPICS_IR.length} sample topics`;
  const host = { pro: `<b>Teacher Pro</b>: unlimited${a.pro_until ? `, until <b>${fmtDate(a.pro_until)}</b>` : ""}`,
    school: "<b>School licence</b>: unlimited",
    trial: `<b>Teacher Pro free trial</b>: unlimited until <b>${fmtDate(a.trial_ends)}</b>`,
    free: `<b>Free</b>: ${Math.min(a.hosts_month, a.host_limit)} of ${a.host_limit} games used this month${a.trial_used ? `. Your free trial ended on ${fmtDate(a.trial_ends)}` : ""}` }[a.host_plan] || "";
  const teacherish = a.role !== "student" || a.host_plan !== "free";
  const canPro = teacherish && (a.host_plan === "free" || a.host_plan === "trial") && CFG.teacherProUrl;
  const canTrial = teacherish && a.host_plan === "free" && !a.trial_used;
  const canPass = a.role === "student" && !unlimitedSolo && CFG.examPassUrl;
  set(`${brand(planLabel())}<div class="tape"></div>
    <section class="panel"><span class="eyebrow">My account</span><h2>${esc(S.user.name)}</h2><p class="muted">${esc(S.user.email)}</p>
      <div class="acctrows">
        <div><span class="muted">Solo cases</span><span>${solo}</span></div>
        <div><span class="muted">Live games and team showdowns</span><span>${host}</span></div>
      </div>
      <div class="row">${canPro ? `<a class="btn primary" href="${esc(withEmail(CFG.teacherProUrl))}" target="_blank" rel="noopener">Get Teacher Pro · ${esc(PRICES.teacherPro)}</a>` : ""}
        ${canTrial ? `<button class="btn" id="trial">Start 14-day free trial</button>` : ""}
        ${canPass ? `<a class="btn${canPro ? "" : " primary"}" href="${esc(withEmail(CFG.examPassUrl))}" target="_blank" rel="noopener">Get the Exam Pass · ${esc(PRICES.pass)}</a>` : ""}</div>
      <p class="muted small">Bought something? Payments usually arrive within a minute. Use the same email to sign in as you used to pay.</p>
      <div class="row"><button class="btn" id="again">I've paid: check again</button><a class="btn quiet" href="${LAB_URL}?next=account">Account in the Lab</a>${back}</div>
    </section>`);
  document.getElementById("again").onclick = accountScreen;
  document.getElementById("back").onclick = signIn;
  const t = document.getElementById("trial");
  if (t) t.onclick = async () => { t.disabled = true; try { await sb().rpc("ir_start_trial"); } catch (e) {} accountScreen(); };
}
/* Ask the server before a game starts; calls go() if allowed */
async function claimGame(kind, go, back) {
  if (!gating()) return go();
  if (kind === "host" && !S.acc.signed_in) return signInToHost(back);
  if (kind === "solo" && !S.acc.signed_in) {
    const g = guestSolo();
    if (g.n >= GUEST_SOLO_LIMIT) return upgradeScreen("solo_limit", back, () => claimGame(kind, go, back));
    store.set("ir-guest-solo", { day: g.day, n: g.n + 1 });
    return go();
  }
  try {
    const { data, error } = await sb().rpc("ir_claim", { p_kind: kind });
    if (error || !data) return go();
    if (data.access) S.acc = data.access;
    if (data.ok) return go();
    upgradeScreen(data.reason, back, () => claimGame(kind, go, back));
  } catch (e) { go(); }
}

async function saveResult(r) {
  if (!S.user || !liveConfigured()) return { saved: false, why: "guest" };
  try {
    const { error } = await sb().from("ir_results").insert({
      mode: r.mode, questions: r.questions, correct: r.correct, score: r.score,
      best_streak: r.best, rank_title: RANKS[rankIdx(r.correct, GAME_RANK_AT)], topics: r.topics, missed: r.missed
    });
    if (error) return { saved: false, why: /ir_results|relation|schema cache/i.test(error.message || "") ? "setup" : "error" };
    return { saved: true };
  } catch (e) { return { saved: false, why: "error" }; }
}
function topicTally(results) {
  const t = {};
  results.forEach(r => { const k = r.q.topic; t[k] = t[k] || [0, 0]; t[k][1] += 1; if (r.ok) t[k][0] += 1; });
  return t;
}
const saveNote = res => !res ? "" : res.saved ? `<p class="good small">Saved to your case record.</p>`
  : res.why === "guest" ? `<p class="muted small">Playing as a guest, so this isn't saved. <a href="${signInUrl()}">Sign in to the Lab</a> to keep a case record.</p>`
  : res.why === "setup" ? `<p class="muted small">Case records aren't switched on yet, so this wasn't saved.</p>`
  : `<p class="muted small">Couldn't save this result. Check the connection.</p>`;

/* ================= SIGN IN, PROFILE, LOBBY ================= */
function profile(next = signIn) {
  set(`${brand()}
    <section class="panel">
      <label class="eyebrow" for="fname">Your first name</label>
      <input id="fname" class="field" maxlength="20" autocomplete="off" value="${esc(S.player.name)}">
      <h2>Choose your detective</h2>
      <p class="muted small">Your first name and detective are what classmates see. No photos, nothing else to type.</p>
      ${avatarPicker(S.player.avatar)}
      <div class="row"><button class="btn primary big" id="toLobby">Start</button><button class="btn quiet" id="back">Back</button></div>
    </section>`);
  bindPicker(id => { S.player.avatar = id; });
  document.getElementById("toLobby").onclick = () => {
    S.player.name = (document.getElementById("fname").value.trim() || S.player.name || "Detective").slice(0, 20);
    Sound.unlock(); next();
  };
  document.getElementById("back").onclick = signIn;
}
/* the old lobby is now the home page */
function lobby() { return signIn(); }
const choice = (attr, val, opts) => `<div class="choice">${opts.map(([v, l]) => `<button class="btn" data-${attr}="${v}" aria-pressed="${String(v) === String(val)}">${l}</button>`).join("")}</div>`;
const bindChoice = (attr, fn) => app.querySelectorAll(`[data-${attr}]`).forEach(b => b.onclick = () => fn(b.dataset[attr]));
const withFilter = (cfg, defaults) => { const c = Object.assign({}, defaults, cfg || {}); c.tier = c.tier === "F" ? "F" : "H"; c.topics = Array.isArray(c.topics) ? c.topics.filter(id => TOPICS[id]) : []; c.open = []; c.picking = c.topics.length > 0; return c; };
const saveCfg = (key, cfg) => { const { open, picking, allow, ...keep } = cfg; store.set(key, keep); };
const filterSummary = cfg => `${cfg.tier === "F" ? "Foundation" : "Higher"} · ${cfg.topics.length ? cfg.topics.length + " topic" + (cfg.topics.length > 1 ? "s" : "") : "all topics"}`;
function topicPicker(cfg) {
  const avail = id => QUESTIONS.some(q => q.topic === id && (cfg.tier !== "F" || q.tier === "F"));
  const lk = id => !!cfg.allow && !cfg.allow.includes(id);
  const n = poolFor(cfg).length;
  const picking = cfg.picking || cfg.topics.length > 0;
  const boxes = Object.entries(STRANDS).map(([s, name]) => {
    const ids = TOPIC_IDS.filter(id => strandOf(id) === s && avail(id));
    if (!ids.length) return "";
    const on = ids.filter(id => cfg.topics.includes(id)).length;
    return `<details data-strand-box="${s}" ${(on && on < ids.length) || cfg.open.includes(s) ? "open" : ""}><summary><span class="sname">${name}</span><span class="muted small">${on ? `${on} of ${ids.length} chosen` : `${ids.length} topics`}</span></summary>
      <div class="chips"><button class="chip all" data-strand="${s}">${on === ids.length ? "Clear all" : "Select all"}</button>${ids.map(id => lk(id) ? `<button class="chip lk" data-locked="${id}" title="Unlock with the Exam Pass">🔒 ${esc(TOPICS[id])}</button>` : `<button class="chip" data-topic="${id}" aria-pressed="${cfg.topics.includes(id)}">${esc(TOPICS[id])}</button>`).join("")}</div></details>`;
  }).join("");
  return `${cfg.allow ? `<div class="freenote"><b>Free plan:</b> ${cfg.allow.length} sample topics (🔒 shows the rest). <button class="linkbtn" data-ui="upgrade">Unlock all 76 topics</button></div>` : ""}
    <span class="eyebrow">Tier</span>${choice("tier", cfg.tier, [["F", "Foundation"], ["H", "Higher (includes Foundation)"]])}
    <span class="eyebrow">Topics</span>${choice("tmode", picking ? "pick" : "all", [["all", "All GCSE topics"], ["pick", "Choose topics"]])}
    ${picking ? `<div class="chips strands">${Object.entries(STRANDS).map(([s, name]) => {
        const ids = TOPIC_IDS.filter(id => strandOf(id) === s && avail(id));
        if (!ids.length) return "";
        const all = ids.every(id => cfg.topics.includes(id)), some = ids.some(id => cfg.topics.includes(id));
        return `<button class="chip strand${some && !all ? " part" : ""}" data-strand="${s}" aria-pressed="${all}">${name}</button>`; }).join("")}</div>
      <p class="muted small">Tap a strand to choose all of it, or open a strand below to pick single topics.</p>
      <div class="tpick">${boxes}</div>` : ""}
    <p class="muted small"><b>${n}</b> question${n === 1 ? "" : "s"} match these settings.${n && n < cfg.n ? ` The game will use all ${n}.` : ""}${!n ? (cfg.mix === "spot" ? " None of these topics have spot-the-mistake questions: choose more topics or mixed types." : " Choose at least one topic.") : ""}</p>`;
}
function bindTopicPicker(cfg, redraw) {
  bindChoice("tier", v => { cfg.tier = v; redraw(); });
  bindChoice("tmode", v => { cfg.picking = v === "pick"; if (v === "all") cfg.topics = []; redraw(); });
  app.querySelectorAll("[data-topic]").forEach(b => b.onclick = () => {
    const id = b.dataset.topic;
    cfg.topics = cfg.topics.includes(id) ? cfg.topics.filter(x => x !== id) : [...cfg.topics, id];
    const s = strandOf(id); if (!cfg.open.includes(s)) cfg.open.push(s);
    redraw();
  });
  app.querySelectorAll("[data-strand]").forEach(b => b.onclick = () => {
    const s = b.dataset.strand;
    const ids = [...app.querySelectorAll(`[data-strand-box="${s}"] [data-topic]`)].map(x => x.dataset.topic);
    if (!ids.length) return;
    const all = ids.every(id => cfg.topics.includes(id));
    cfg.topics = all ? cfg.topics.filter(id => !ids.includes(id)) : [...new Set([...cfg.topics, ...ids])];
    redraw();
  });
  app.querySelectorAll("[data-locked], [data-ui=upgrade]").forEach(b => b.onclick = () => upgradeScreen("locked", () => redraw()));
  app.querySelectorAll("[data-strand-box]").forEach(d => d.addEventListener("toggle", () => {
    const s = d.dataset.strandBox;
    cfg.open = d.open ? [...new Set([...cfg.open, s])] : cfg.open.filter(x => x !== s);
  }));
}


/* ================= CASE RECORD ================= */
const MEDALS = [
  { id: "first", name: "First case", how: "Finish your first game", test: a => a.games >= 1 },
  { id: "closed", name: "Case closed", how: "Get every question right in a game of 6 or more", test: a => a.perfect },
  { id: "streak", name: "Hot streak", how: "5 right in a row", test: a => a.bestStreak >= 5 },
  { id: "regular", name: "On the beat", how: "Play 10 games", test: a => a.games >= 10 },
  { id: "specialist", name: "Specialist", how: "90% or more in one topic, over 20 questions", test: a => a.specialist },
  { id: "century", name: "Century", how: "100 correct answers in total", test: a => a.correct >= 100 }
];
async function recordScreen() {
  stopTimer(); S.pad = null;
  if (!S.user) {
    return set(`<div class="hud">${brand("Case record")}</div>
      <section class="panel"><h2>Sign in to keep a case record</h2>
      <p class="muted">Your case record saves every solo and live game: your scores, promotions from Constable to Superintendent, and medals. Sign in to Maths Forensics Lab, then come back to Incident Room.</p>
      <div class="row"><a class="btn primary" href="${signInUrl()}">Sign in to the Lab</a><button class="btn" id="back">Back</button></div></section>`), document.getElementById("back").onclick = lobby;
  }
  set(`<div class="hud">${brand("Case record")}<div class="who">${avatarSvg(S.player.avatar, "sm")}${esc(S.player.name)}</div></div>
    <section class="panel"><h2>Opening your case record…</h2></section>`);
  let rows = [], err = null;
  try {
    const r = await sb().from("ir_results").select("*").order("played_at", { ascending: false }).limit(500);
    if (r.error) err = r.error; else rows = r.data || [];
  } catch (e) { err = e; }
  if (err) {
    const setup = /ir_results|relation|schema cache/i.test(err.message || "");
    set(`<div class="hud">${brand("Case record")}</div><section class="panel"><h2>${setup ? "Case records aren't switched on yet" : "Couldn't open your case record"}</h2>
      <p class="muted">${setup ? "Your teacher needs to finish setting up Incident Room." : "Check the connection and try again."}</p>
      <div class="row"><button class="btn" id="back">Back</button></div></section>`);
    return document.getElementById("back").onclick = lobby;
  }
  const a = { games: rows.length, questions: 0, correct: 0, bestStreak: 0, perfect: false, specialist: false, bestSolo: 0 };
  const topics = {};
  rows.forEach(r => {
    a.questions += r.questions; a.correct += r.correct; a.bestStreak = Math.max(a.bestStreak, r.best_streak || 0);
    if (r.questions >= 6 && r.correct === r.questions) a.perfect = true;
    if (r.mode === "solo") a.bestSolo = Math.max(a.bestSolo, r.score);
    Object.entries(r.topics || {}).forEach(([k, v]) => { topics[k] = topics[k] || [0, 0]; topics[k][0] += v[0]; topics[k][1] += v[1]; });
  });
  a.specialist = Object.values(topics).some(([c, n]) => n >= 20 && c / n >= 0.9);
  const strands = {};
  Object.entries(topics).forEach(([k, [c, n]]) => { const s = strandOf(k); if (!s) return; strands[s] = strands[s] || [0, 0]; strands[s][0] += c; strands[s][1] += n; });
  const weak = Object.entries(topics).filter(([k, [c, n]]) => TOPICS[k] && n >= 2 && c / n < 0.7).sort((x, y) => x[1][0] / x[1][1] - y[1][0] / y[1][1]).slice(0, 5);
  const ri = rankIdx(a.correct, CAREER_RANK_AT);
  const next = CAREER_RANK_AT[ri + 1];
  set(`<div class="hud">${brand("Case record")}<div class="who">${avatarSvg(S.player.avatar, "sm")}${esc(S.player.name)}</div></div>
    <div class="tape"></div>
    <section class="panel center">
      ${avatarSvg(S.player.avatar, "lg")}
      ${rankBadge(ri)}
      <p class="muted">${next !== undefined ? `${next - a.correct} more correct answers for promotion to ${RANKS[ri + 1]}.` : "Top rank reached."}</p>
      <div class="kpis">
        <div class="kpi"><span class="eyebrow">Games</span><span class="v">${a.games}</span></div>
        <div class="kpi"><span class="eyebrow">Correct answers</span><span class="v">${a.correct} / ${a.questions}</span></div>
        <div class="kpi"><span class="eyebrow">Accuracy</span><span class="v">${a.questions ? Math.round(100 * a.correct / a.questions) : 0}%</span></div>
        <div class="kpi"><span class="eyebrow">Best solo score</span><span class="v">${a.bestSolo}</span></div>
      </div>
    </section>
    <section class="panel"><h3>Medals</h3>
      <div class="medals">${MEDALS.map(m => { const got = m.test(a); return `<div class="medal${got ? " got" : ""}"><span class="mico">${got ? "★" : "☆"}</span><span><b>${m.name}</b><br><span class="muted small">${m.how}</span></span></div>`; }).join("")}</div>
    </section>
    <section class="panel"><h3>Accuracy by strand</h3>
      ${Object.keys(strands).length ? `<div class="bars">${Object.entries(strands).map(([k, [c, n]]) => `<div class="bar wide-label"><span>${STRANDS[k]}</span><div class="track"><div class="fill" style="width:${n ? (c / n) * 100 : 0}%"></div></div><span class="n">${Math.round(100 * c / n)}%</span></div>`).join("")}</div>` : `<p class="muted">Play a game to start your record.</p>`}
      ${weak.length ? `<h3>Topics to practise</h3><ul class="misses">${weak.map(([k, [c, n]]) => `<li><b>${esc(TOPICS[k])}</b><span class="muted">${c} of ${n} right (${Math.round(100 * c / n)}%)</span></li>`).join("")}</ul>` : ""}
    </section>
    <section class="panel"><h3>Recent games</h3>
      ${rows.length ? `<div class="podium">${rows.slice(0, 8).map(r => `<div class="place"><span class="pos small">${new Date(r.played_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</span><span class="tag">${r.mode === "solo" ? "Solo" : "Live"}</span><span class="tn">${r.correct} / ${r.questions} correct</span><span class="ts">${r.score}</span></div>`).join("")}</div>` : `<p class="muted">No games yet.</p>`}
    </section>
    <div class="row"><button class="btn primary" id="play">Practise solo</button><button class="btn" id="back">Back</button></div>`);
  document.getElementById("play").onclick = soloSetup;
  document.getElementById("back").onclick = lobby;
}

/* ================= SOLO ================= */
function soloSetup() {
  stopTimer(); S.pad = null;
  const cfg = withFilter(store.get("ir-solo", null), { mix: "mixed", n: 10, tier: "H", topics: [] });
  cfg.allow = soloAllow();
  if (cfg.allow) cfg.topics = cfg.topics.filter(id => cfg.allow.includes(id));
  const draw = (keep = false) => {
    const none = !poolFor(cfg).length;
    set(`<div class="hud">${brand("Rapid Response · solo")}<div class="who">${avatarSvg(S.player.avatar, "sm")}${esc(S.player.name)}</div></div>
      <section class="panel"><h2>Set up your cases</h2>
        ${topicPicker(cfg)}
        <span class="eyebrow">Question types</span>${choice("mix", cfg.mix, [["mixed", "Mixed (recommended)"], ["spot", "Spot the mistake only"]])}
        <span class="eyebrow">Number of questions</span>${choice("n", cfg.n, [[6, "6"], [10, "10"], [15, "15"], [20, "20"]])}
        <p class="muted small">Each question has its own time limit. You'll see an explanation after every one.</p>
        <div class="row"><button class="btn primary big" id="go" ${none ? "disabled" : ""}>Start</button><button class="btn" id="back">Back</button>${soundBtns()}</div>
      </section>`, false, keep);
    const redraw = () => draw(true);
    bindTopicPicker(cfg, redraw);
    bindChoice("mix", v => { cfg.mix = v; redraw(); });
    bindChoice("n", v => { cfg.n = +v; redraw(); });
    document.getElementById("back").onclick = lobby;
    document.getElementById("go").onclick = () => { saveCfg("ir-solo", cfg); Sound.unlock(); claimGame("solo", () => startSolo(cfg), soloSetup); };
  };
  draw();
}
function startSolo(cfg) {
  const qs = pickQuestions(cfg.n, cfg);
  if (!qs.length) return soloSetup();
  S.solo = { cfg, qs, perms: qs.map(n => makePerm(QUESTIONS[n])), i: 0, score: 0, correct: 0, wrong: 0, streak: 0, best: 0, results: [] };
  armGuard(() => { stopTimer(); S.solo = null; lobby(); }, "Your answers in this game won't be saved.");
  soloQ();
}
function soloQ() {
  const s = S.solo, q = QUESTIONS[s.qs[s.i]];
  s.L = freshPad(); s.phase = "q"; s.total = secsFor(q, "auto", false); s.left = s.total; s.promoted = false;
  S.pad = { L: s.L, act: (a, v) => soloAct(a, v) };
  drawSolo();
  stopTimer();
  tick = setInterval(() => {
    if (s.phase !== "q") return;
    s.left -= 1; timerUI(s.left, s.total);
    if (s.left <= 5 && s.left > 0) Sound.play("tick");
    if (s.left <= 0) soloCheck();
  }, 1000);
}
function timerUI(left, total) {
  const fill = document.querySelector(".timer-fill");
  if (fill) { fill.style.width = `${Math.max(0, left / total) * 100}%`; fill.classList.toggle("low", left <= 5); }
  const t = document.getElementById("tleft"); if (t) t.textContent = Math.max(0, left);
}
const counters = (c, w) => `<span class="stat ok">✓ <b>${c}</b></span><span class="stat no">✗ <b>${w}</b></span>`;
function soloAct(act, v) {
  const s = S.solo, q = QUESTIONS[s.qs[s.i]];
  if (s.phase === "q") {
    if (act === "check") return soloCheck();
    const r = padAct(q, s.L, act, v);
    if (r === "text") return soloCheck();
    if (r) { Sound.play("tap"); drawSolo(true); }
  } else if (s.phase === "fix" && act === "fix") {
    s.fixPick = v; s.fixOk = v === 0;
    if (s.fixOk) { s.pts += 50; s.score += 50; Sound.play("correct"); } else Sound.play("wrong");
    s.phase = "done"; drawSolo(true);
  }
}
function soloCheck() {
  const s = S.solo, q = QUESTIONS[s.qs[s.i]];
  if (s.phase !== "q") return;
  stopTimer();
  const ok = isCorrect(q, s.L.ans);
  s.ok = ok; s.pts = ok ? 100 + Math.ceil(50 * Math.max(0, s.left) / s.total) : 0;
  const before = rankIdx(s.correct, GAME_RANK_AT);
  if (ok) { s.correct += 1; s.streak += 1; s.best = Math.max(s.best, s.streak); } else { s.wrong += 1; s.streak = 0; }
  s.promoted = rankIdx(s.correct, GAME_RANK_AT) > before;
  s.score += s.pts;
  s.results.push({ q, ok, ans: s.L.ans });
  Sound.play(ok ? (s.promoted ? "promote" : "correct") : s.L.ans === null ? "noanswer" : "wrong");
  if (ok && q.type === "spot") { s.phase = "fix"; s.fixOrder = shuffle([0, 1, 2]); s.fixPick = null; }
  else s.phase = "done";
  drawSolo(true);
}
function drawSolo(keep = false) {
  const s = S.solo, q = QUESTIONS[s.qs[s.i]], perm = s.perms[s.i];
  let body = "";
  if (s.phase === "q") body = todoBanner(todoText(q, "solo")) + deviceQ(q, perm, s.L, { mode: "solo" });
  else {
    const head = s.L.ans === null ? "Time's up" : s.ok ? `Correct · +${s.pts}` : "Not this time";
    let fix = "";
    if (s.phase === "fix") fix = `<div class="findings good"><span class="head">You found the mistake</span><p>Bonus +50: which line should replace it?</p></div>
      <div class="opts long">${s.fixOrder.map(f => `<button class="opt" data-act="fix" data-v="${f}"><span class="ot">${esc(q.fixes[f])}</span></button>`).join("")}</div>`;
    else if (q.type === "spot" && s.ok) fix = `<div class="findings ${s.fixOk ? "good" : "bad"}"><span class="head">${s.fixOk ? "Fix correct · +50" : "Fix missed"}</span></div>`;
    body = `${q.type === "spot" ? boardQ(q, perm, { noCounts: true }) : ""}
      <div class="result ${s.ok ? "good" : "bad"}"><span class="rhead">${head}</span>
        ${s.ok ? "" : `<p>You said: <b>${esc(ansLabel(q, s.L.ans))}</b></p>`}
        <p>Correct answer: <span class="answer">${esc(rightLabel(q))}</span>${q.type === "spot" ? `<br>Final answer: <span class="answer">${esc(q.answer)}</span>` : ""}</p>
        <p class="why"><b>Why:</b> ${esc(q.why)}</p></div>
      ${s.promoted ? `<div class="promo">Promoted to ${RANKS[rankIdx(s.correct, GAME_RANK_AT)]}</div>` : ""}
      ${fix}
      ${s.phase === "done" ? `<div class="row"><button class="btn primary big" id="next">${s.i + 1 < s.qs.length ? "Next question" : "See your case report"}</button></div>` : ""}`;
  }
  set(`<div class="hud">
      <div class="who">${avatarSvg(S.player.avatar, "sm")}${esc(S.player.name)}</div>
      <span class="stat">Question <b>${s.i + 1}</b> / ${s.qs.length}</span>
      ${counters(s.correct, s.wrong)}
      <span class="stat">Score <b>${s.score}</b></span>${soundBtns()}</div>
    <div class="timer" aria-hidden="true"><div class="timer-fill${s.left <= 5 ? " low" : ""}" style="width:${s.phase === "q" ? (s.left / s.total) * 100 : 0}%"></div></div>
    <section class="panel">
      ${qHead(q, s.phase === "q" ? `<span class="stat secs"><span id="tleft">${s.left}</span>s</span>` : "")}
      <p class="brief">${esc(q.brief)}</p>
      ${body}
    </section>
    <div class="row"><button class="btn quiet" id="quit">End game</button></div>`, false, keep);
  const nx = document.getElementById("next");
  if (nx) { nx.onclick = () => { s.i += 1; if (s.i < s.qs.length) soloQ(); else soloReport(); }; nx.focus({ preventScroll: true }); }
  document.getElementById("quit").onclick = () => { stopTimer(); disarmGuard(); if (s.results.length) soloReport(); else { S.solo = null; lobby(); } };
  if (s.phase === "q" && q.type === "type") { const inp = document.getElementById("tans"); if (inp && !keep) inp.focus(); }
}
async function soloReport() {
  stopTimer(); S.pad = null; disarmGuard();
  const s = S.solo, r = s.results;
  const missed = r.filter(x => !x.ok);
  const tally = topicTally(r);
  const ri = rankIdx(s.correct, GAME_RANK_AT);
  Sound.play("end");
  const draw = res => {
    set(`<div class="hud">${brand("Case report")}<div class="who">${avatarSvg(S.player.avatar, "sm")}${esc(S.player.name)}</div></div>
      <div class="tape"></div>
      <section class="panel">
        ${rankBadge(ri)}
        <div class="kpis">
          <div class="kpi"><span class="eyebrow">Score</span><span class="big">${s.score}</span></div>
          <div class="kpi"><span class="eyebrow">Correct</span><span class="v ok">${s.correct}</span></div>
          <div class="kpi"><span class="eyebrow">Wrong</span><span class="v no">${s.wrong}</span></div>
          <div class="kpi"><span class="eyebrow">Best streak</span><span class="v">${s.best}</span></div>
        </div>
        ${saveNote(res)}
      </section>
      <section class="panel"><h3>By topic</h3>
        <div class="bars">${Object.entries(tally).map(([k, [c, n]]) => `<div class="bar wide-label"><span>${esc(TOPICS[k] || k)}</span><div class="track"><div class="fill" style="width:${(c / n) * 100}%"></div></div><span class="n">${c} / ${n}</span></div>`).join("")}</div>
      </section>
      ${reviewHtml(r)}
      <section class="panel"><h3>What next?</h3>
        <div class="row"><button class="btn primary" id="again">Play again</button>
        <button class="btn" id="other">${s.cfg.mix === "spot" ? "Try mixed questions" : "Spot the mistake only"}</button>
        <button class="btn" id="rec">${S.user ? "My case record" : "Sign in to save results"}</button>
        <button class="btn" id="home">Back to Incident Room</button></div>
      </section>`);
    document.getElementById("again").onclick = () => startSolo(s.cfg);
    document.getElementById("other").onclick = () => startSolo({ ...s.cfg, mix: s.cfg.mix === "spot" ? "mixed" : "spot" });
    document.getElementById("rec").onclick = recordScreen;
    document.getElementById("home").onclick = lobby;
  };
  draw(S.user ? { saved: false, why: "pending" } : null);
  if (S.user) {
    const res = await saveResult({ mode: "solo", questions: r.length, correct: s.correct, score: s.score, best: s.best, topics: tally, missed: missed.map(x => x.q.brief) });
    if (S.solo === s) draw(res);
  }
}
function reviewHtml(results) {
  const missed = results.filter(x => !x.ok);
  return `<section class="panel"><h3>${missed.length ? "Review your case file" : "No mistakes slipped past you"}</h3>
    ${missed.length ? `<p class="muted small">Every question you missed, with the explanation.</p><ul class="misses">${missed.map(m => `<li>
      <div class="row"><span class="tag strong">${TYPES[m.q.type].label}</span><span class="tag">${TOPICS[m.q.topic]}</span></div>
      <b>${esc(m.q.brief)}</b>
      <span>You said: ${esc(ansLabel(m.q, m.ans))}</span>
      <span>Correct: <span class="answer">${esc(rightLabel(m.q))}</span></span>
      <span class="muted">${esc(m.q.why)}</span></li>`).join("")}</ul>` : `<p class="muted">Every answer was right.</p>`}
  </section>`;
}

/* ================= TEAM SHOWDOWN (projector) ================= */
const TEAM_DEFS = [{ name: "Fingerprints", av: "print" }, { name: "Torches", av: "torch" }, { name: "Owls", av: "owl" }, { name: "Lenses", av: "lens" }];
function teamSetup() {
  stopTimer(); S.pad = null;
  const cfg = withFilter(store.get("ir-team", null), { count: 3, n: 6, mix: "mixed", tier: "H", topics: [] });
  const draw = (keep = false) => {
    const none = !poolFor(cfg).length;
    set(`${brand("Team showdown · projector")}
      <section class="panel"><h2>Set up the teams</h2>
        <p class="muted">Teams write their answer on a mini whiteboard. Reveal, then tap every team that got it right.</p>
        <span class="eyebrow">Number of teams</span>${choice("count", cfg.count, [[2, "2 teams"], [3, "3 teams"], [4, "4 teams"]])}
        <span class="eyebrow">Questions</span>${choice("n", cfg.n, [[6, "6"], [10, "10"]])}
        <span class="eyebrow">Question types</span>${choice("mix", cfg.mix, [["mixed", "Mixed"], ["spot", "Spot the mistake only"]])}
        ${topicPicker(cfg)}
        <div class="teams">${TEAM_DEFS.slice(0, cfg.count).map(t => `<div class="team">${avatarSvg(t.av, "sm")}<span class="tn">${t.name}</span></div>`).join("")}</div>
        <div class="row"><button class="btn primary big" id="go" ${none ? "disabled" : ""}>Start the showdown</button><button class="btn" id="back">Back</button>${soundBtns(true)}</div>
      </section>`, true, keep);
    const redraw = () => draw(true);
    bindTopicPicker(cfg, redraw);
    bindChoice("count", v => { cfg.count = +v; redraw(); });
    bindChoice("n", v => { cfg.n = +v; redraw(); });
    bindChoice("mix", v => { cfg.mix = v; redraw(); });
    document.getElementById("back").onclick = S.player.name ? lobby : signIn;
    document.getElementById("go").onclick = () => {
      saveCfg("ir-team", cfg);
      Sound.unlock();
      const qs = pickQuestions(cfg.n, cfg);
      if (!qs.length) return;
      claimGame("host", () => {
        S.teams = { i: 0, qs, perms: qs.map(n => makePerm(QUESTIONS[n])), list: TEAM_DEFS.slice(0, cfg.count).map(t => ({ ...t, score: 0 })) };
        teamCase();
      }, teamSetup);
    };
  };
  draw();
}
function teamTodo(q) {
  return { spot: "On your whiteboard: write the number of the FIRST line that goes wrong.", mc: "On your whiteboard: write the letter of the correct answer.",
    tf: "On your whiteboard: write TRUE or FALSE.", order: `On your whiteboard: write the letters in order, from ${q.dir}.`,
    method: "On your whiteboard: write the letter of the method that works.", type: "On your whiteboard: write the answer." }[q.type];
}
function teamCase() {
  const T = S.teams, q = QUESTIONS[T.qs[T.i]];
  T.cur = { left: q.secs + 10, total: q.secs + 10, revealed: false, running: true, got: new Set() };
  Sound.startMusic();
  drawTeam();
  stopTimer();
  tick = setInterval(() => {
    const cur = T.cur;
    if (!cur.running || cur.revealed) return;
    cur.left = Math.max(0, cur.left - 1); timerUI(cur.left, cur.total);
    if (cur.left <= 5 && cur.left > 0) Sound.play("tick");
    if (cur.left === 0) cur.running = false;
  }, 1000);
}
function drawTeam() {
  const T = S.teams, q = QUESTIONS[T.qs[T.i]], perm = T.perms[T.i], cur = T.cur;
  const board = T.list.map((t, k) => `<button class="team" data-team="${k}" aria-pressed="${cur.got.has(k)}" ${cur.revealed ? "" : "disabled"}>${avatarSvg(t.av, "sm")}<span><span class="tn">${t.name}</span><br><span class="ts">${t.score + (cur.got.has(k) ? 100 : 0)} pts</span></span></button>`).join("");
  set(`<div class="hud">${brand("Team showdown")}<span class="stat">Question <b>${T.i + 1}</b> / ${T.qs.length}</span>${soundBtns(true)}</div>
    <div class="timer" aria-hidden="true"><div class="timer-fill" style="width:${(cur.left / cur.total) * 100}%"></div></div>
    <section class="panel">
      ${qHead(q, `<span class="stat secs"><span id="tleft">${cur.left}</span>s</span>`)}
      <p class="brief">${esc(q.brief)}</p>
      ${cur.revealed ? "" : todoBanner(teamTodo(q))}
      ${boardQ(q, perm, cur.revealed ? { noCounts: true } : null)}
      ${cur.revealed ? `<div class="result bad"><p>Correct answer: <span class="answer">${esc(rightLabel(q))}</span></p><p class="why"><b>Why:</b> ${esc(q.why)}</p></div>` : ""}
    </section>
    <section class="panel">
      <span class="eyebrow">${cur.revealed ? "Tap every team that got it right (+100)" : "Scores"}</span>
      <div class="teams">${board}</div>
      <div class="row">${cur.revealed ? `<button class="btn primary big" id="next">${T.i + 1 < T.qs.length ? "Next question" : "Final scores"}</button>`
        : `<button class="btn primary big" id="reveal">Reveal the answer</button><button class="btn" id="pause">${cur.running ? "Pause timer" : "Resume timer"}</button>`}
        <button class="btn quiet" id="quit">End game</button></div>
    </section>`, true);
  const rv = document.getElementById("reveal"); if (rv) rv.onclick = () => { cur.revealed = true; Sound.play("reveal"); drawTeam(); };
  const pz = document.getElementById("pause"); if (pz) pz.onclick = () => { cur.running = !cur.running; drawTeam(); };
  app.querySelectorAll("[data-team]").forEach(b => b.onclick = () => { const k = +b.dataset.team; cur.got.has(k) ? cur.got.delete(k) : cur.got.add(k); Sound.play("tap"); drawTeam(); });
  const nx = document.getElementById("next"); if (nx) nx.onclick = () => { cur.got.forEach(k => { T.list[k].score += 100; }); T.i += 1; if (T.i < T.qs.length) teamCase(); else teamEnd(); };
  document.getElementById("quit").onclick = () => { if (cur.revealed) cur.got.forEach(k => { T.list[k].score += 100; }); teamEnd(); };
}
function teamEnd() {
  stopTimer(); Sound.stopMusic();
  const ranked = S.teams.list.slice().sort((a, b) => b.score - a.score);
  const tie = ranked[1] && ranked[1].score === ranked[0].score;
  const top = ranked.slice(0, 3).map(t => ({ name: t.name, avatar: t.av, score: t.score }));
  set(`${brand("Team showdown · final scores")}<div class="tape"></div>
    ${ceremonyHtml(top, tie ? "It's a tie at the top!" : `${ranked[0].name} crack the case`)}
    ${ranked[3] ? `<section class="panel"><div class="podium"><div class="place"><span class="pos">4</span>${avatarSvg(ranked[3].av, "sm")}<span class="tn">${ranked[3].name}</span><span class="ts">${ranked[3].score}</span></div></div></section>` : ""}
    <div class="row"><button class="btn primary" id="again">New showdown</button><button class="btn" id="home">Back</button></div>`, true);
  runCeremony(top);
  document.getElementById("again").onclick = teamSetup;
  document.getElementById("home").onclick = S.player.name ? lobby : signIn;
}

/* ================= LIVE GAME: HOST ================= */
const spaced = code => String(code).slice(0, 3) + " " + String(code).slice(3);
function liveMissing(back) {
  set(`${brand()}<section class="panel"><h2>Live games aren't switched on yet</h2>
    <p class="muted">${!window.supabase ? "The live connection didn't load. Check the internet connection and refresh." : "The Supabase address and key at the top of this file still need filling in."}</p>
    <div class="row"><button class="btn" id="back">Back</button></div></section>`);
  document.getElementById("back").onclick = back;
}
const homeFn = () => signIn();
function hostSetup() {
  stopTimer(); S.pad = null;
  if (!liveConfigured()) return liveMissing(homeFn);
  if (gating() && !S.acc.signed_in) return signInToHost(homeFn);
  const cfg = withFilter(store.get("ir-host", null), { n: 10, time: "auto", mix: "mixed", typed: false, tier: "H", topics: [] });
  const draw = (keep = false) => {
    const none = !poolFor(cfg).length;
    set(`${brand("Rapid Response · teacher")}
      ${gameSwitch("rapid")}
      <section class="panel"><span class="eyebrow">Live class game</span><h2>Rapid Response</h2>
        <p class="muted">Show this screen on the board. Students join at <b>${JOIN_URL}</b> with the game code and answer on their tablets.</p>
        ${topicPicker(cfg)}
        <span class="eyebrow">Question types</span>${choice("mix", cfg.mix, [["mixed", "Mixed (recommended)"], ["spot", "Spot the mistake only"]])}
        <span class="eyebrow">Number of questions</span>${choice("n", cfg.n, [[6, "6"], [10, "10"], [15, "15"], [20, "20"]])}
        <span class="eyebrow">Time per question</span>${choice("time", cfg.time, [["auto", "Auto: suits each question"], [20, "20 s"], [30, "30 s"], [45, "45 s"], [60, "60 s"]])}
        <span class="eyebrow">Spot the mistake questions</span>${choice("typed", cfg.typed ? 1 : 0, [[0, "Tap the line"], [1, "Tap the line, then type the answer"]])}
        <div class="row"><button class="btn primary big" id="go" ${none ? "disabled" : ""}>Open the game</button><button class="btn" id="back">Back</button>${soundBtns(true)}</div>
      </section>`, true, keep);
    const redraw = () => draw(true);
    bindTopicPicker(cfg, redraw);
    bindChoice("mix", v => { cfg.mix = v; redraw(); });
    bindChoice("n", v => { cfg.n = +v; redraw(); });
    bindChoice("time", v => { cfg.time = v === "auto" ? "auto" : +v; redraw(); });
    bindChoice("typed", v => { cfg.typed = v === "1"; redraw(); });
    bindGameSwitch();
    document.getElementById("back").onclick = homeFn;
    document.getElementById("go").onclick = () => { saveCfg("ir-host", cfg); Sound.unlock(); claimGame("host", () => hostStart(cfg), hostSetup); };
  };
  draw();
}
function hostStart(cfg) {
  const code = String(100000 + Math.floor(Math.random() * 900000));
  const H = S.host = { code, cfg, typed: !!cfg.typed, round: 1, phase: "lobby", i: -1, players: {}, online: new Set(), kicked: new Set(), answers: {}, left: 0, total: 0, stats: [], status: "connecting" };
  newRound(H);
  const ch = sb().channel("ir-" + code, { config: { broadcast: { self: false }, presence: { key: "host" } } });
  H.ch = ch;
  ch.on("broadcast", { event: "hello" }, ({ payload }) => { addPlayer(payload); hostPush(); if (H.phase === "lobby") drawHost(); })
    .on("broadcast", { event: "answer" }, ({ payload }) => onAnswer(payload))
    .on("presence", { event: "sync" }, () => {
      const st = ch.presenceState();
      H.online = new Set(Object.keys(st).filter(k => k !== "host"));
      Object.keys(st).forEach(k => { if (k !== "host" && st[k][0]) addPlayer(st[k][0]); });
      if (H.phase === "lobby") drawHost(); else hostLiveUI();
    })
    .subscribe(status => {
      if (status === "SUBSCRIBED") { H.status = "live"; ch.track({ role: "host" }); hostPush(); }
      else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") H.status = "error";
      else if (status === "CLOSED") H.status = "closed";
      if (H.phase === "lobby") drawHost();
    });
  H.beat = setInterval(hostPush, 3000);
  armGuard(() => { hostClose(); homeFn(); }, "Leaving ends the game for every student.");
  Sound.startMusic();
  drawHost();
}
function newRound(H) {
  H.qs = pickQuestions(H.cfg.n, H.cfg);
  H.perms = H.qs.map(n => makePerm(QUESTIONS[n]));
  H.i = -1; H.stats = []; H.phase = "lobby";
  Object.values(H.players).forEach(p => Object.assign(p, { score: 0, correct: 0, wrong: 0, streak: 0, best: 0, last: 0, ok: false, typedOk: false, prevRank: 0 }));
}
function addPlayer(p) {
  const H = S.host;
  if (!H || !p || !p.id || H.kicked.has(p.id)) return;
  if (!H.players[p.id]) {
    H.players[p.id] = { id: p.id, name: String(p.name || "Detective").slice(0, 20), avatar: p.avatar || "det-f", score: 0, correct: 0, wrong: 0, streak: 0, best: 0, last: 0, ok: false, typedOk: false, prevRank: 0 };
    Sound.play("join");
  }
}
const ranking = () => Object.values(S.host.players).sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
function hostPush() {
  const H = S.host; if (!H || !H.ch || H.status !== "live") return;
  const inQ = H.i >= 0 && H.i < H.qs.length;
  const payload = { phase: H.phase, round: H.round, i: H.i, n: H.qs.length, qn: inQ ? H.qs[H.i] : null, perm: inQ ? H.perms[H.i] : null,
    left: H.left, total: H.total, typed: H.typed, closing: !!H.closing, kicked: [...H.kicked], code: H.code };
  if (H.phase === "reveal" || H.phase === "standings" || H.phase === "end") {
    const rk = ranking(), scores = {};
    rk.forEach((p, k) => { scores[p.id] = { score: p.score, rank: k + 1, of: rk.length, last: p.last, ok: p.ok, typedOk: p.typedOk, correct: p.correct, wrong: p.wrong, streak: p.streak, best: p.best,
      gap: k > 0 ? rk[k - 1].score - p.score : 0, above: k > 0 ? rk[k - 1].name : "" }; });
    payload.scores = scores;
  }
  H.ch.send({ type: "broadcast", event: "state", payload });
}
function hostClose() {
  const H = S.host; if (!H) return;
  stopTimer(); clearInterval(H.beat); Sound.stopMusic(); disarmGuard();
  try { H.ch && sb().removeChannel(H.ch); } catch (e) {}
  S.host = null;
}
function hostNext() {
  const H = S.host;
  H.i += 1;
  if (H.i >= H.qs.length) return hostEnd();
  const q = QUESTIONS[H.qs[H.i]];
  H.phase = "question"; H.total = secsFor(q, H.cfg.time, H.typed); H.left = H.total; H.answers = {}; H.closing = false;
  Sound.startMusic();
  drawHost(); hostPush();
  stopTimer();
  tick = setInterval(() => {
    H.left = Math.max(0, H.left - 1);
    hostLiveUI();
    if (H.left <= 5 && H.left > 0) Sound.play("tick");
    if (H.left % 5 === 0 || H.closing) hostPush();
    if (H.left === 0) hostReveal();
  }, 1000);
}
const complete = (H, a) => a && a.ans !== null && a.ans !== undefined && (!typedFor(QUESTIONS[H.qs[H.i]], H.typed) || (a.text !== undefined && a.text !== null));
function onAnswer(p) {
  const H = S.host;
  if (!H || H.phase !== "question" || !p || p.i !== H.i || p.round !== H.round || H.kicked.has(p.id)) return;
  addPlayer(p);
  const a = H.answers[p.id] = H.answers[p.id] || { ans: null, text: null, left: H.left };
  if (p.ans !== undefined && p.ans !== null && JSON.stringify(p.ans) !== JSON.stringify(a.ans)) { a.ans = p.ans; a.left = H.left; }
  if (p.text !== undefined && p.text !== null) a.text = String(p.text).slice(0, 30);
  hostLiveUI();
  const online = [...H.online].filter(id => H.players[id]);
  if (!H.closing && online.length && online.every(id => complete(H, H.answers[id])) && H.left > 5) {
    H.closing = true; H.left = 5; hostLiveUI(); hostPush();
  }
}
function hostReveal() {
  const H = S.host; stopTimer();
  if (H.phase !== "question") return;
  const q = QUESTIONS[H.qs[H.i]];
  const prev = {}; if (H.i > 0) ranking().forEach((p, k) => { prev[p.id] = k + 1; });
  const dist = {}, wrongTexts = {};
  let right = 0, answered = 0, typedRight = 0, typedSent = 0;
  Object.values(H.players).forEach(p => {
    const a = H.answers[p.id];
    p.prevRank = prev[p.id]; p.last = 0; p.ok = false; p.typedOk = false;
    const has = a && a.ans !== null && a.ans !== undefined;
    if (has) {
      answered += 1;
      const key = Array.isArray(a.ans) ? "seq" : a.ans;
      dist[key] = (dist[key] || 0) + 1;
      if (q.type === "type" && !isCorrect(q, a.ans)) { const t = String(a.ans).trim().toLowerCase(); wrongTexts[t] = (wrongTexts[t] || 0) + 1; }
    }
    if (has && isCorrect(q, a.ans)) {
      p.ok = true; right += 1; p.correct += 1; p.streak += 1; p.best = Math.max(p.best, p.streak);
      p.last = 500 + Math.round(500 * Math.max(0, a.left) / H.total);
    } else { p.wrong += 1; p.streak = 0; }
    if (typedFor(q, H.typed) && a && a.text) {
      typedSent += 1;
      if (typedOk(q, a.text)) { p.typedOk = true; p.last += 300; typedRight += 1; }
      else { const t = a.text.trim().toLowerCase(); wrongTexts[t] = (wrongTexts[t] || 0) + 1; }
    }
    p.score += p.last;
  });
  const commonWrong = Object.entries(wrongTexts).filter(([, n]) => n >= 2).sort((a, b) => b[1] - a[1]).slice(0, 3);
  H.stats.push({ qn: H.qs[H.i], answered, right, dist, typedRight, typedSent, commonWrong, of: Object.keys(H.players).length });
  H.phase = "reveal";
  Sound.play("reveal");
  hostPush(); drawHost();
}
function hostLiveUI() {
  const H = S.host; if (!H || H.phase !== "question") return;
  timerUI(H.left, H.total);
  const a = document.getElementById("acount"); if (a) a.textContent = Object.values(H.answers).filter(x => complete(H, x)).length;
  const n = document.getElementById("pcount"); if (n) n.textContent = Object.keys(H.players).length;
  const c = document.getElementById("closing"); if (c) c.hidden = !H.closing;
}
function hostEnd() {
  const H = S.host; stopTimer();
  H.phase = "end"; Sound.stopMusic();
  hostPush(); drawHost();
}
function standingsRows(list, max = 10, showLast = true) {
  return `<div class="podium">${list.slice(0, max).map((p, k) => {
    const mv = p.prevRank ? p.prevRank - (k + 1) : 0;
    return `<div class="place${k === 0 ? " first" : ""}"><span class="pos">${k + 1}</span>
      <span class="move ${mv > 0 ? "up" : mv < 0 ? "down" : ""}">${mv > 0 ? "▲" + mv : mv < 0 ? "▼" + -mv : "–"}</span>
      ${avatarSvg(p.avatar, "sm")}<span class="tn">${esc(p.name)}<br>${rankBadge(rankIdx(p.correct, GAME_RANK_AT))}${p.streak >= 3 ? ` <span class="streak">${p.streak} in a row</span>` : ""}</span>
      <span class="ts">${showLast && p.last ? `<small class="good">+${p.last}</small> ` : ""}${p.score}</span></div>`; }).join("")}</div>`;
}
function drawHost() {
  const H = S.host; if (!H) return;
  const players = Object.values(H.players);
  const statusText = H.status === "live" ? "Connected" : H.status === "error" ? "Connection problem" : H.status === "closed" ? "Disconnected" : "Connecting…";
  const hud = sub => `<div class="hud">${brand(sub)}<span class="stat${H.status === "error" ? " no" : ""}">${statusText}</span>${soundBtns(true)}</div>`;
  if (H.phase === "lobby") {
    set(`${hud(H.round > 1 ? "Rapid Response · next round" : "Rapid Response · teacher screen")}
      <section class="panel joinpanel">
        <div><span class="eyebrow">On your tablet go to</span><div class="joinurl">${JOIN_URL}</div></div>
        <div><span class="eyebrow">Game code</span><div class="bigcode">${spaced(H.code)}</div></div>
      </section>
      <section class="panel">
        <div class="row spread"><h3>Detectives in the room · ${players.length}</h3>
          <div class="row"><button class="btn primary big" id="start" ${players.length ? "" : "disabled"}>Start the game</button><button class="btn quiet" id="quit">Close game</button></div></div>
        ${players.length ? `<div class="teams">${players.map(p => `<div class="team">${avatarSvg(p.avatar, "sm")}<span class="tn grow">${esc(p.name)}</span><button class="kick" data-kick="${esc(p.id)}" aria-label="Remove ${esc(p.name)}">×</button></div>`).join("")}</div>`
          : `<p class="muted">Waiting for students to join…</p>`}
        <p class="muted small">${H.qs.length} questions · ${filterSummary(H.cfg)} · ${H.cfg.mix === "mixed" ? "mixed types" : "spot the mistake"} · ${H.cfg.time === "auto" ? "auto timing" : H.cfg.time + " s each"}${H.typed ? " · typed answers" : ""}</p>
      </section>`, true);
    const st = document.getElementById("start"); if (st) st.onclick = hostNext;
    app.querySelectorAll("[data-kick]").forEach(b => b.onclick = () => { H.kicked.add(b.dataset.kick); delete H.players[b.dataset.kick]; hostPush(); drawHost(); });
    document.getElementById("quit").onclick = () => { hostClose(); homeFn(); };
    return;
  }
  const q = H.i >= 0 && H.i < H.qs.length ? QUESTIONS[H.qs[H.i]] : null, perm = q ? H.perms[H.i] : null;
  const codeBar = `<span class="stat">Join: <b>${JOIN_URL}</b> · code <b class="cy">${spaced(H.code)}</b></span>`;
  if (H.phase === "question") {
    set(`${hud("Question " + (H.i + 1) + " of " + H.qs.length)}
      <div class="row spread">${codeBar}<span class="stat">Answered <b id="acount">0</b> / <span id="pcount">${players.length}</span></span></div>
      <div class="timer big" aria-hidden="true"><div class="timer-fill" style="width:100%"></div></div>
      <section class="panel">
        ${qHead(q, `<span class="stat secs"><span id="tleft">${H.left}</span>s</span>`)}
        <p class="brief">${esc(q.brief)}</p>
        ${todoBanner(todoText(q, "board", typedFor(q, H.typed)))}
        ${boardQ(q, perm, null)}
        <p class="closing" id="closing" ${H.closing ? "" : "hidden"}>Everyone has answered. Revealing in a few seconds: you can still change your answer.</p>
        <div class="row"><button class="btn primary" id="reveal">Reveal now</button><button class="btn quiet" id="quit">End game</button></div>
      </section>`, true);
    hostLiveUI();
    document.getElementById("reveal").onclick = hostReveal;
    document.getElementById("quit").onclick = hostEnd;
    return;
  }
  if (H.phase === "reveal") {
    const s = H.stats[H.stats.length - 1];
    set(`${hud("Question " + (H.i + 1) + " of " + H.qs.length)}
      <div class="row spread">${codeBar}<span class="stat"><b>${s.right}</b> of ${s.of} got it right</span></div>
      <section class="panel">
        ${qHead(q)}
        <p class="brief">${esc(q.brief)}</p>
        ${boardQ(q, perm, s)}
        <div class="result good"><span class="rhead">${s.right} of ${s.of} correct</span>
          ${q.type === "order" ? `<p>${s.dist.seq || 0} put them in order; ${s.right} got the order right.</p>` : ""}
          ${q.type === "spot" ? `<p>Final answer: <span class="answer">${esc(q.answer)}</span></p>` : ""}
          ${typedFor(q, H.typed) ? `<p>${s.typedRight} of ${s.typedSent} typed the right final answer.</p>` : ""}
          ${s.commonWrong.length ? `<p>Common wrong answers: ${s.commonWrong.map(([t, n]) => `<span class="answer">${esc(t)}</span> (${n})`).join(", ")}</p>` : ""}
          <p class="why"><b>Why:</b> ${esc(q.why)}</p></div>
        <div class="row"><button class="btn primary big" id="next">Show the standings</button><button class="btn quiet" id="quit">End game</button></div>
      </section>`, true);
    document.getElementById("next").onclick = () => { H.phase = "standings"; Sound.play("standings"); hostPush(); drawHost(); };
    document.getElementById("quit").onclick = hostEnd;
    return;
  }
  if (H.phase === "standings") {
    set(`${hud("Standings after question " + (H.i + 1))}
      <section class="panel"><h2>Top detectives</h2>${standingsRows(ranking(), 10)}
        <div class="row"><button class="btn primary big" id="next">${H.i + 1 < H.qs.length ? "Next question" : "Final results"}</button><button class="btn quiet" id="quit">End game</button></div>
      </section>`, true);
    document.getElementById("next").onclick = hostNext;
    document.getElementById("quit").onclick = hostEnd;
    return;
  }
  /* end */
  const rk = ranking();
  const hardest = H.stats.slice().sort((a, b) => a.right / Math.max(1, a.of) - b.right / Math.max(1, b.of));
  set(`${hud("Final results")}<div class="tape"></div>
    ${rk.length ? ceremonyHtml(rk.slice(0, 3), "Case closed: the top detectives") : `<section class="panel"><h2>Game over</h2></section>`}
    ${rk.length > 3 ? `<section class="panel"><h3>The rest of the squad</h3>${standingsRows(rk.slice(3).map(p => ({ ...p, prevRank: 0 })), 7, false).replace(/<span class="pos">(\d+)<\/span>/g, (m, d) => `<span class="pos">${+d + 3}</span>`)}</section>` : ""}
    <section class="panel"><h3>Class case report</h3>
      <p class="muted small">Questions from hardest to easiest for this class.</p>
      <div class="bars">${hardest.map(s => { const q = QUESTIONS[s.qn]; const pct = s.of ? Math.round(100 * s.right / s.of) : 0; return `<div class="bar wide-label"><span>${esc(q.brief)}</span><div class="track"><div class="fill" style="width:${pct}%"></div></div><span class="n">${pct}%</span></div>`; }).join("")}</div>
      ${hardest.length ? `<p class="note"><b>Hardest question:</b> ${esc(QUESTIONS[hardest[0].qn].brief)}<br>${esc(QUESTIONS[hardest[0].qn].why)}</p>` : ""}
      <details><summary class="eyebrow">Full results (teacher only)</summary>
        <div class="podium" style="margin-top:12px">${rk.map((p, k) => `<div class="place"><span class="pos">${k + 1}</span>${avatarSvg(p.avatar, "sm")}<span class="tn">${esc(p.name)}</span><span class="ts">✓${p.correct} ✗${p.wrong} · ${p.score}</span></div>`).join("")}</div>
      </details>
    </section>
    <section class="panel"><h3>What next?</h3>
      <div class="row"><button class="btn primary" id="again">Play again with the same players</button><button class="btn" id="new">New game</button><button class="btn" id="home">Back to Incident Room</button></div>
    </section>`, true);
  if (rk.length) runCeremony(rk.slice(0, 3));
  document.getElementById("again").onclick = () => { H.round += 1; newRound(H); Sound.startMusic(); hostPush(); drawHost(); };
  document.getElementById("new").onclick = () => { hostClose(); hostSetup(); };
  document.getElementById("home").onclick = () => { hostClose(); homeFn(); };
}

/* ================= LIVE GAME: STUDENT ================= */
function studentId(reuse) {
  let id = reuse || null;
  if (!id) { try { id = sessionStorage.getItem("ir-id"); } catch (e) {} }
  if (!id) id = "p" + Math.random().toString(36).slice(2, 10);
  try { sessionStorage.setItem("ir-id", id); } catch (e) {}
  return id;
}
function joinScreen(prefill = "", err = "") {
  stopTimer(); S.pad = null;
  if (!liveConfigured()) return liveMissing(signIn);
  const st = { avatar: S.player.avatar || "det-f" };
  const last = store.get("ir-last", null);
  const canRejoin = last && Date.now() - last.t < 3 * 3600e3 && !prefill;
  set(`${brand("Join a live game")}
    ${canRejoin ? `<section class="panel joincard"><span class="eyebrow">Were you in a game?</span>
      <div class="row"><button class="btn primary" id="rejoin">Rejoin game ${esc(spaced(last.code))} as ${esc(last.name)}</button></div>
      <p class="muted small">You'll keep your score.</p></section>` : ""}
    <section class="panel">
      <label class="eyebrow" for="jcode">Game code (on the board)</label>
      <input id="jcode" class="field code-in" inputmode="numeric" maxlength="7" autocomplete="off" placeholder="000 000" value="${esc(prefill)}">
      <label class="eyebrow" for="jname">Your first name</label>
      <input id="jname" class="field" maxlength="20" autocomplete="off" value="${esc(S.player.name)}">
      <span class="eyebrow">Choose your detective</span>
      ${avatarPicker(st.avatar)}
      <p class="no" id="jerr" ${err ? "" : "hidden"}>${esc(err)}</p>
      <div class="row"><button class="btn primary big" id="jgo">Join the game</button><button class="btn quiet" id="back">Back</button></div>
    </section>`);
  bindPicker(id => { st.avatar = id; });
  const rj = document.getElementById("rejoin");
  if (rj) rj.onclick = () => { S.player.name = last.name; S.player.avatar = last.avatar; Sound.unlock(); studentJoin(last.code, last.id); };
  document.getElementById("back").onclick = signIn;
  document.getElementById("jgo").onclick = () => {
    const code = document.getElementById("jcode").value.replace(/\D/g, "");
    const name = document.getElementById("jname").value.trim();
    const e = document.getElementById("jerr");
    if (code.length !== 6) { e.textContent = "Enter the 6-digit code shown on the board."; e.hidden = false; return; }
    if (!name) { e.textContent = "Enter your first name."; e.hidden = false; return; }
    S.player.name = name.slice(0, 20); S.player.avatar = st.avatar;
    Sound.unlock(); studentJoin(code);
  };
}
function studentJoin(code, reuseId) {
  const id = studentId(reuseId);
  const P = S.stu = { code, id, state: null, key: "", left: 0, round: 0, hist: [], L: freshPad(), lastRank: 0, saved: {} };
  set(`${brand("Join a live game")}<section class="panel"><h2>Connecting…</h2><p class="muted">Finding game ${spaced(code)}.</p></section>`);
  const ch = sb().channel("ir-" + code, { config: { broadcast: { self: false }, presence: { key: id } } });
  P.ch = ch;
  ch.on("broadcast", { event: "state" }, ({ payload }) => onState(payload))
    .subscribe(status => {
      if (status === "SUBSCRIBED") {
        const me = { id, name: S.player.name, avatar: S.player.avatar };
        ch.track(me);
        ch.send({ type: "broadcast", event: "hello", payload: me });
      }
      if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") studentFail("Couldn't connect. Check the Wi-Fi and try again.");
    });
  P.wait = setTimeout(() => { if (!P.state) studentFail(`No game found with code ${spaced(code)}. Check the code on the board.`); }, 8000);
}
function studentLeave(toScreen = signIn) {
  const P = S.stu;
  stopTimer(); S.pad = null; disarmGuard();
  if (P) { clearTimeout(P.wait); try { sb().removeChannel(P.ch); } catch (e) {} }
  S.stu = null;
  toScreen();
}
function studentFail(msg) {
  const P = S.stu, code = P ? P.code : "";
  studentLeave(() => joinScreen(code, msg));
}
function onState(st) {
  const P = S.stu; if (!P) return;
  clearTimeout(P.wait);
  if (st.kicked && st.kicked.includes(P.id)) {
    store.del("ir-last");
    return studentLeave(() => set(`${brand()}<section class="panel"><h2>You've been removed from this game</h2><p class="muted">Ask your teacher if you think this is a mistake.</p><div class="row"><button class="btn" id="b">OK</button></div></section>`) || (document.getElementById("b").onclick = signIn));
  }
  if (!P.state) {
    store.set("ir-last", { code: P.code, id: P.id, name: S.player.name, avatar: S.player.avatar, t: Date.now() });
    armGuard(() => { store.del("ir-last"); studentLeave(); }, "If you leave, you stop scoring points. You can rejoin with the same code and keep your score.");
    Sound.play("join");
  }
  if (st.game === "stakeout") return soStudentState(st);
  if (st.game === "identikit") return ikStudentState(st);
  if (st.game === "inquiry") return liStudentState(st);
  if (st.game === "lineup") return lnStudentState(st);
  if (st.round !== P.round) { P.round = st.round; P.hist = []; P.lastRank = 0; }
  P.state = st;
  const key = `${st.round}:${st.phase}:${st.i}`;
  if (key === P.key) {
    if (st.phase === "question") { P.left = Math.min(P.left, st.left); timerUI(P.left, st.total); const c = document.getElementById("closing"); if (c) c.hidden = !st.closing; }
    return;
  }
  P.key = key;
  stopTimer();
  const mine = st.scores && st.scores[P.id];
  if (st.phase === "question") {
    P.L = freshPad(); P.left = st.left;
    S.pad = { L: P.L, act: (a, v) => studentAct(a, v) };
    tick = setInterval(() => { P.left = Math.max(0, P.left - 1); timerUI(P.left, st.total); }, 1000);
  } else S.pad = null;
  if (st.phase === "reveal" && st.qn !== null) {
    const q = QUESTIONS[st.qn];
    P.hist.push({ q, ok: !!(mine && mine.ok), ans: P.L.sentAns });
    Sound.play(mine && mine.ok ? "correct" : P.L.sentAns === null ? "noanswer" : "wrong");
  }
  if (st.phase === "standings" && mine) {
    const r = rankIdx(mine.correct, GAME_RANK_AT);
    P.promoted = r > P.lastRank; P.lastRank = r;
    Sound.play(P.promoted ? "promote" : "standings");
  }
  if (st.phase === "end") { studentSave(); }
  drawStudent();
}
function studentAct(act, v) {
  const P = S.stu, st = P && P.state;
  if (!st || st.phase !== "question") return;
  const q = QUESTIONS[st.qn], L = P.L;
  const r = padAct(q, L, act, v);
  if (!r) return;
  const send = (ans, text) => P.ch.send({ type: "broadcast", event: "answer", payload: { id: P.id, name: S.player.name, avatar: S.player.avatar, round: st.round, i: st.i, ans, text } });
  if (r === "ans") { L.sentAns = L.ans; send(L.ans, null); Sound.play("tap"); }
  if (act === "seq-send" && L.ans) { L.sentAns = L.ans.slice(); send(L.sentAns, null); Sound.play("tap"); }
  if (r === "text") {
    if (q.type === "type") { L.sentAns = L.ans; L.sentText = L.ans; send(L.ans, null); }
    else { L.sentText = L.draft; send(L.sentAns, L.draft); }
    Sound.play("tap");
  }
  if (r === "seq") Sound.play("tap");
  drawStudent(true);
}
async function studentSave() {
  const P = S.stu; if (!P || P.saved[P.round] || !S.user) return;
  P.saved[P.round] = "pending";
  const mine = P.state.scores && P.state.scores[P.id];
  const round = P.round;
  const res = await saveResult({ mode: "live", questions: P.hist.length, correct: P.hist.filter(h => h.ok).length, score: mine ? mine.score : 0,
    best: mine ? mine.best : 0, topics: topicTally(P.hist), missed: P.hist.filter(h => !h.ok).map(h => h.q.brief) });
  if (S.stu === P && P.round === round) { P.saved[round] = res; const el = document.getElementById("savenote"); if (el && P.state.phase === "end") el.innerHTML = saveNote(res); }
}
function drawStudent(keep = false) {
  const P = S.stu, st = P.state;
  const mine = st.scores && st.scores[P.id];
  const me = `<div class="who">${avatarSvg(S.player.avatar, "sm")}${esc(S.player.name)}</div>`;
  const cnt = mine ? counters(mine.correct, mine.wrong) : (P.hist.length ? counters(P.hist.filter(h => h.ok).length, P.hist.filter(h => !h.ok).length) : "");
  const hud = extra => `<div class="hud">${me}${extra || ""}${cnt}${soundBtns()}</div>`;
  if (st.phase === "lobby") {
    return set(`${hud(`<span class="stat">Game <b>${spaced(P.code)}</b></span>`)}
      <section class="panel center">${avatarSvg(S.player.avatar, "lg")}<h2>You're in, ${esc(S.player.name)}</h2>
      <p class="muted">Look at the board. The first question opens when your teacher starts the game.</p></section>`);
  }
  if (st.phase === "question") {
    const q = QUESTIONS[st.qn];
    return set(`${hud(`<span class="stat">Question <b>${st.i + 1}</b> / ${st.n}</span>`)}
      <div class="timer" aria-hidden="true"><div class="timer-fill" style="width:${(P.left / st.total) * 100}%"></div></div>
      <section class="panel">
        ${qHead(q, `<span class="stat secs"><span id="tleft">${P.left}</span>s</span>`)}
        <p class="brief">${esc(q.brief)}</p>
        ${todoBanner(todoText(q, "live", typedFor(q, st.typed)))}
        ${deviceQ(q, st.perm, P.L, { mode: "live", typed: st.typed })}
        <p class="closing" id="closing" ${st.closing ? "" : "hidden"}>Everyone has answered. A few seconds left to change your answer.</p>
      </section>`, false, keep);
  }
  if (st.phase === "reveal") {
    const q = QUESTIONS[st.qn], h = P.hist[P.hist.length - 1];
    const ok = mine && mine.ok;
    return set(`${hud(`<span class="stat">Question <b>${st.i + 1}</b> / ${st.n}</span>`)}
      <section class="panel">
        <div class="result ${ok ? "good" : "bad"}"><span class="rhead">${ok ? `Correct · +${mine.last}` : h && h.ans !== null ? "Not this time" : "No answer in time"}</span>
          ${!ok && h && h.ans !== null ? `<p>You said: <b>${esc(ansLabel(q, h.ans))}</b></p>` : ""}
          <p>Correct answer: <span class="answer">${esc(rightLabel(q))}</span></p>
          ${typedFor(q, st.typed) ? `<p>${mine && mine.typedOk ? "Your typed answer was right · +300" : "Final answer"}: <span class="answer">${esc(q.answer)}</span></p>` : ""}
          <p class="why"><b>Why:</b> ${esc(q.why)}</p></div>
        <p class="muted">Look at the board for the standings.</p>
      </section>`);
  }
  if (st.phase === "standings") {
    return set(`${hud(`<span class="stat">After question <b>${st.i + 1}</b> / ${st.n}</span>`)}
      <section class="panel center">
        ${P.promoted ? `<div class="promo">Promoted to ${RANKS[P.lastRank]}</div>` : ""}
        ${mine ? `<span class="eyebrow">Your position</span><div class="big">${ordinal(mine.rank)}</div><p class="muted">of ${mine.of} · ${mine.score} points</p>
          <p class="gap">${mine.rank === 1 ? "You're top of the board. Keep it up." : `${mine.gap + 1} points to pass ${esc(mine.above)}`}</p>
          ${rankBadge(rankIdx(mine.correct, GAME_RANK_AT))}${mine.streak >= 3 ? `<span class="streak">${mine.streak} in a row</span>` : ""}` : `<h2>Standings on the board</h2>`}
      </section>`);
  }
  if (st.phase === "end") {
    const res = P.saved[P.round];
    const place = mine && mine.rank <= 3 ? mine.rank : 0;
    const html = set(`${hud("")}
      ${place ? `<section class="panel center celebrate" style="--d:${REVEAL[place] / 1000}s">
        <p class="cel-wait">Look at the board: the top 3 are being revealed…</p>
        <div class="cel-win">${medalSvg(place, "big")}${avatarSvg(S.player.avatar, "xl")}
          <span class="cel-place">${PLACE_WORD[place]} place!</span>
          <span class="cel-medal">${MEDALS_C[place][2]} medal${place === 1 ? " · Top detective" : ""}</span>
          <span class="muted">${mine.score} points · ${mine.correct} correct</span></div></section>` : ""}
      <section class="panel center">${place ? "" : avatarSvg(S.player.avatar, "lg")}
        ${mine ? `<span class="eyebrow">Final position</span><div class="big">${ordinal(mine.rank)}</div><p class="muted">of ${mine.of} · ${mine.score} points</p>
          ${rankBadge(rankIdx(mine.correct, GAME_RANK_AT))}
          <div class="kpis"><div class="kpi"><span class="eyebrow">Correct</span><span class="v ok">${mine.correct}</span></div><div class="kpi"><span class="eyebrow">Wrong</span><span class="v no">${mine.wrong}</span></div><div class="kpi"><span class="eyebrow">Best streak</span><span class="v">${mine.best}</span></div></div>` : `<h2>Game over</h2>`}
        <div id="savenote">${S.user ? (res && res !== "pending" ? saveNote(res) : `<p class="muted small">Saving to your case record…</p>`) : saveNote({ saved: false, why: "guest" })}</div>
      </section>
      ${reviewHtml(P.hist)}
      <section class="panel"><h3>What next?</h3>
        <p class="muted small">If your teacher starts another round, you'll join it automatically. Stay on this page.</p>
        <div class="row"><button class="btn primary" id="solo">Practise solo</button>${S.user ? `<button class="btn" id="rec">My case record</button>` : ""}<button class="btn quiet" id="leave">Leave the game</button></div>
      </section>`, false, keep);
    if (place) {
      if (place === 1) later(REVEAL.roll, () => Sound.play("drumroll"));
      later(REVEAL[place], () => { Sound.play(place === 1 ? "gold" : place === 2 ? "silver" : "bronze"); Confetti.burst(place === 1 ? 200 : 110, 0.5, 0.35); });
      if (place === 1) later(REVEAL[1] + 900, () => Confetti.burst(140, 0.5, 0.3));
    } else Sound.play("end");
    return html;
  }
}
app.addEventListener("click", e => {
  const t = e.target.closest && e.target.closest("#solo, #rec, #leave");
  if (!t || !S.stu || !S.stu.state || S.stu.state.phase !== "end") return;
  e.stopImmediatePropagation();
  if (t.id === "leave") { store.del("ir-last"); studentLeave(); }
  if (t.id === "solo") { store.del("ir-last"); studentLeave(soloSetup); }
  if (t.id === "rec") { store.del("ir-last"); studentLeave(recordScreen); }
}, true);

/* ================= START ================= */
(async () => {
  const q = new URLSearchParams(location.search);
  if (q.has("host")) { set(`${brand("Host a game")}<section class="panel"><h2>Opening…</h2></section>`); await initAuth(); await loadAccess(); return ({ stakeout: soHostSetup, so: soHostSetup, identikit: ikHostSetup, ik: ikHostSetup, inquiry: liHostSetup, lineup: lnHostSetup }[q.get("game") || store.get("ir-game", "rapid")] || hostSetup)(); }
  else if (q.has("join") || q.has("code")) joinScreen((q.get("code") || "").replace(/\D/g, "").slice(0, 6));
  else signIn();
  await initAuth();
  await loadAccess();
  if (!S.host && !S.stu && !S.solo && app.querySelector("#toJoin")) signIn();
  const jn = document.getElementById("jname"); if (S.user && jn && !jn.value) jn.value = S.player.name;
})();
