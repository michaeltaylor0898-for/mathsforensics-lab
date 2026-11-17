src = "/home/claude/ir-live/index.html"
s = open(src, encoding="utf-8").read()
assert "MF_MODE" not in s
def rep(a, b, n=1):
    global s
    c = s.count(a); assert c == n, f"expected {n} got {c}: {a[:100]}"
    s = s.replace(a, b)

# ---- mode flag; separate saved data and live channels in the Academy ----
rep("""(() => {
"use strict";
/* ================= CORE HELPERS ================= */""", """(() => {
"use strict";
/* Academy mode: the same games engine published inside the Academy (academy/games.html) with
   window.MF_MODE = "academy". KS3 questions only, its own home page, saved data and live channels. */
const ACAD = window.MF_MODE === "academy";
/* ================= CORE HELPERS ================= */""")
rep("""const store = {
  get(k, d) { try { const v = localStorage.getItem(k);""", """const SKEY = k => (ACAD ? "ac-" : "") + k;
const store = {
  get(k, d) { try { const v = localStorage.getItem(SKEY(k));""")
rep("""  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
  del(k) { try { localStorage.removeItem(k); } catch (e) {} }""", """  set(k, v) { try { localStorage.setItem(SKEY(k), JSON.stringify(v)); } catch (e) {} },
  del(k) { try { localStorage.removeItem(SKEY(k)); } catch (e) {} }""")
rep('sb().channel("ir-" + code,', 'sb().channel((ACAD ? "ac-" : "ir-") + code,', 13)

# ---- tiers: KS3 only in the Academy, never in the Incident Room ----
rep("""const IV_TIERS = [["F", "GCSE Foundation"], ["H", "GCSE Higher"], ["K", "KS3 (Years 7–9)"]];""",
    """const IV_TIERS = [["F", "Foundation"], ["H", "Higher"]];
const ivTierFix = cfg => { cfg.tier = ACAD ? "K" : cfg.tier === "H" ? "H" : "F"; return cfg; };""")
rep("""  const fixSub = () => { if (!ivSubjects(cfg.tier).some(x => x[0] === cfg.subject)) cfg.subject = ivSubjects(cfg.tier)[0][0]; };
  fixSub();""", """  ivTierFix(cfg);
  const fixSub = () => { if (!ivSubjects(cfg.tier).some(x => x[0] === cfg.subject)) cfg.subject = ivSubjects(cfg.tier)[0][0]; };
  fixSub();""")
rep("""<section class="panel"><span class="eyebrow">Level</span>${choice("ivtier", cfg.tier, IV_TIERS)}
        <span class="eyebrow">Your chosen subject</span>""", """<section class="panel">${ACAD ? "" : `<span class="eyebrow">Tier</span>${choice("ivtier", cfg.tier, IV_TIERS)}`}
        <span class="eyebrow">Your chosen subject</span>""")
rep("""  if (cfg.subject && !ivSubjects(cfg.tier).some(x => x[0] === cfg.subject)) cfg.subject = "";""",
    """  ivTierFix(cfg);
  if (cfg.subject && !ivSubjects(cfg.tier).some(x => x[0] === cfg.subject)) cfg.subject = "";""")
rep("""        <span class="eyebrow">Level</span>${choice("ivtier", cfg.tier, IV_TIERS)}
        <span class="eyebrow">Topic focus</span>""", """        ${ACAD ? "" : `<span class="eyebrow">Tier</span>${choice("ivtier", cfg.tier, IV_TIERS)}`}
        <span class="eyebrow">Topic focus</span>""")
rep("""const withFilter = (cfg, defaults, ks3ok = false) => { const c = Object.assign({}, defaults, cfg || {}); c.ks3ok = ks3ok; c.tier = (ks3ok ? ["F", "K"] : ["F"]).includes(c.tier) ? c.tier : "H";""",
    """const withFilter = (cfg, defaults) => { const c = Object.assign({}, defaults, cfg || {}); c.tier = ACAD ? "K" : c.tier === "F" ? "F" : "H";""")
rep("""${choice("tier", cfg.tier, cfg.ks3ok ? [["F", "GCSE Foundation"], ["H", "GCSE Higher (includes Foundation)"], ["K", "KS3 (Years 7–9)"]] : [["F", "Foundation"], ["H", "Higher (includes Foundation)"]])}""",
    """${ACAD ? "" : `<span class="eyebrow">Tier</span>${choice("tier", cfg.tier, [["F", "Foundation"], ["H", "Higher (includes Foundation)"]])}`}""")
# the eyebrow "Tier" before the choice is now inside the conditional
i = s.index("""${ACAD ? "" : `<span class="eyebrow">Tier</span>${choice("tier", cfg.tier""")
pre = s[i-40:i]
assert pre.rstrip().endswith('<span class="eyebrow">Tier</span>'), pre
s = s[:i-40] + pre.replace('<span class="eyebrow">Tier</span>', '') + s[i:]
for a in ["""{ mix: "mixed", n: 10, tier: "H", topics: [] }, true)""", """{ count: 3, n: 6, mix: "mixed", tier: "H", topics: [] }, true)""", """{ n: 10, time: "auto", mix: "mixed", typed: false, tier: "H", topics: [] }, true)"""]:
    rep(a, a[:-7] + ")")
rep("""const saveCfg = (key, cfg) => { const { open, picking, allow, ks3ok, ...keep } = cfg;""", """const saveCfg = (key, cfg) => { const { open, picking, allow, ...keep } = cfg;""")
# no ?ks3=1 any more: the Academy has its own page
rep("""  if (q.get("ks3") === "1") ks3Prefs(q);
""", "")
i = s.index("/* ?ks3=1 (from the Academy)"); j = s.index("/* ================= START ================= */")
s = s[:i] + s[j:]
# solo play is free in the Academy (no Lab guest limit or upgrade screens)
rep("""async function claimGame(kind, go, back) {
  if (!gating()) return go();""", """async function claimGame(kind, go, back) {
  if (!gating() || (ACAD && kind === "solo")) return go();""")

# ---- the Academy's own pages and words ----
rep("""const JOIN_URL = "lab.mathsforensics.com/join";""",
    """const ACAD_HOME = "./";
const JOIN_URL = ACAD ? (location.host + location.pathname.replace(/[^/]*$/, "")).replace(/\\/$/, "") || "lab.mathsforensics.com/academy" : "lab.mathsforensics.com/join";""")
rep("""const signInUrl = next => `${LAB_URL}?next=${next || "incident-room"}`;""",
    """const signInUrl = next => (ACAD ? `${LAB_URL}?return=academy` : `${LAB_URL}?next=${next || "incident-room"}`);""")
rep("""const IV_CUP_URL = code => `https://lab.mathsforensics.com/incident-room/?cup=${code}`;""",
    """const IV_CUP_URL = code => (ACAD ? `${location.origin}${location.pathname}?cup=${code}` : `https://lab.mathsforensics.com/incident-room/?cup=${code}`);""")
rep("""const brand = (sub = "Maths Forensics Lab") => `<div class="brand">${SHIELD}<div><div class="name">Incident Room</div><div class="sub">${esc(sub)}</div></div></div>`;""",
    """const brand = (sub = ACAD ? "Class games · KS3" : "Maths Forensics Lab") => `<div class="brand">${SHIELD}<div><div class="name">${ACAD ? "Maths Forensics Academy" : "Incident Room"}</div><div class="sub">${esc(sub)}</div></div></div>`;""")
rep("""  app.innerHTML = html;
  if (!keepScroll) window.scrollTo(0, 0);""", """  app.innerHTML = ACAD ? acadWords(html) : html;
  if (!keepScroll) window.scrollTo(0, 0);""")
rep("""const gameSwitch = cur => `<div class="gameswitch" role="group" aria-label="Choose a game">
  ${READY.map(""", """const gameSwitch = cur => `<div class="gameswitch" role="group" aria-label="Choose a game">
  ${READY.filter(g => !ACAD || ACAD_GAMES.includes(g.id)).map(""")
rep("""<button class="gsw quiet" data-game="home">All games</button><a class="gsw quiet labback" href="${esc(LAB_URL)}">← Back to the Lab</a></div>`;""",
    """<button class="gsw quiet" data-game="home">All games</button><a class="gsw quiet labback" href="${esc(ACAD ? ACAD_HOME : LAB_URL)}">← Back to the ${ACAD ? "Academy" : "Lab"}</a></div>`;""")
rep("""function signIn() {
  stopTimer(); S.pad = null; S.pu = null; S.ivMode = false; S.wd = null; S.pv = null; S.hw = null; S.daily = null; S.hwd = null; S.hwc = null; puTok += 1;
  if (!S.host && !S.stu) disarmGuard();""", """function signIn() {
  stopTimer(); S.pad = null; S.pu = null; S.ivMode = false; S.wd = null; S.pv = null; S.hw = null; S.daily = null; S.hwd = null; S.hwc = null; puTok += 1;
  if (!S.host && !S.stu) disarmGuard();
  if (ACAD) return acadHome();""")
rep("""/* ================= START ================= */""", """/* ================= ACADEMY CLASS GAMES HOME ================= */
const ACAD_GAMES = ["interrogation", "rapid"];
/* words on shared screens that name the Incident Room */
const acadWords = html => html.replace(/Back to (the )?Incident Room/g, "Back to class games").replace(/Incident Room home page/g, "Academy class games page")
  .replace(/the Incident Room/g, "the Academy").replace(/Incident Room/g, "Academy");
function acadHome(err = "") {
  stopTimer(); S.pad = null; S.iv = null;
  set(`<div class="row spread homebar">${brand()}<a class="btn quiet labback" href="${ACAD_HOME}">← Back to the Academy</a></div>
    <section class="panel ac-join"><span class="eyebrow">Playing with your class?</span><h2>Join a class game</h2>
      <p class="muted">Type the 6-digit code your teacher shows on the board.</p>
      <form id="acJoin" class="row" novalidate><input id="acCode" class="field ac-code" inputmode="numeric" maxlength="6" placeholder="123456" autocomplete="off" aria-label="Game code"><button class="btn primary big" type="submit">Join</button></form>
      <p class="muted small" id="acErr" role="alert">${esc(err)}</p></section>
    <section class="panel"><span class="eyebrow">On your own</span><h2>Practise solo</h2>
      <div class="ac-games">
        <button class="ac-game" id="acIv">${gameIcon("interrogation", "sm")}<b>The Interrogation</b><span>Two 90-second rounds. Two right in a row and you're promoted, for more points.</span></button>
        <button class="ac-game" id="acRr">${gameIcon("rapid", "sm")}<b>Rapid Response</b><span>Pick your topics and answer 6 to 20 questions against the clock.</span></button>
      </div>
      <p class="muted small">Topics: collecting like terms, expanding brackets, percentages, ratio, fractions and mixed numbers, ordering fractions, decimals and rounding.</p></section>
    <section class="panel"><span class="eyebrow">Teachers</span><h2>Run a class game</h2>
      <p class="muted">Show the game on the board. Students join from the Academy with the code. You'll need your Maths Forensics teacher sign-in.</p>
      <div class="ac-games">
        <button class="ac-game" id="acHostIv">${gameIcon("interrogation", "sm")}<b>The Interrogation tournament</b><span>Qualifiers, quarter-finals, semi-finals and a final, in one lesson or as homework over a week.</span></button>
        <button class="ac-game" id="acHostRr">${gameIcon("rapid", "sm")}<b>Rapid Response, live</b><span>Everyone answers on their own tablet, with a live leaderboard.</span></button>
        <button class="ac-game" id="acTeams">${gameIcon("rapid", "sm")}<b>Team showdown</b><span>2 to 4 teams on mini whiteboards, scored on the board.</span></button>
      </div></section>`);
  const code = document.getElementById("acCode"), errEl = document.getElementById("acErr");
  code.oninput = () => { code.value = code.value.replace(/\\D/g, "").slice(0, 6); errEl.textContent = ""; };
  document.getElementById("acJoin").onsubmit = e => { e.preventDefault(); const c = code.value.replace(/\\D/g, "");
    if (c.length !== 6) { errEl.textContent = "Game codes have 6 digits."; return; } Sound.unlock(); joinScreen(c); };
  document.getElementById("acIv").onclick = () => { Sound.unlock(); ivSoloSetup(); };
  document.getElementById("acRr").onclick = () => { Sound.unlock(); profile(soloSetup); };
  document.getElementById("acHostIv").onclick = () => { Sound.unlock(); ivHostSetup(); };
  document.getElementById("acHostRr").onclick = () => { Sound.unlock(); hostSetup(); };
  document.getElementById("acTeams").onclick = () => { Sound.unlock(); teamSetup(); };
}
/* ================= START ================= */""")

# ---- The Interrogation: a wrong answer costs time, so tapping at random doesn't pay ----
rep("""  const flash = R.promo;
  setTimeout(() => { if (S.iv !== X) return; X.busy = false; if (X.left <= 0 || !X.active) return; ivNext(R); ivDrawQ(flash); }, r.ok || r.pass ? 380 : 1000);""",
"""  const flash = R.promo, wrong = !r.ok && !r.pass;
  /* 2 seconds for a wrong answer, then 1 more for each wrong answer in a row, up to 5 */
  X.miss = wrong ? (X.miss || 0) + 1 : r.ok ? 0 : (X.miss || 0);
  const pen = wrong ? Math.min(5, 1 + X.miss) : 0;
  if (wrong) ivPenalty(X, pen);
  setTimeout(() => { if (S.iv !== X) return; X.busy = false; if (X.left <= 0 || !X.active) return; ivNext(R); ivDrawQ(flash); }, wrong ? pen * 1000 : 380);""")
rep("""document.addEventListener("click", e => { const b = e.target.closest && e.target.closest("[data-iv]");""",
"""function ivPenalty(X, pen) {
  const q = app.querySelector(".iv-q"); if (!q) return;
  const el = document.createElement("div"); el.className = "iv-pen"; el.setAttribute("role", "status");
  let n = pen; const draw = () => { el.innerHTML = `<b>Wrong: ${pen}-second penalty</b><span>${n}</span>`; };
  draw(); q.appendChild(el);
  const t = setInterval(() => { n -= 1; if (n <= 0 || S.iv !== X || !el.isConnected) return clearInterval(t); draw(); }, 1000);
}
document.addEventListener("click", e => { const b = e.target.closest && e.target.closest("[data-iv]");""")
rep("""  <li><b>"No comment"</b> passes a question. Fewer passes wins a tie.</li>""",
    """  <li><b>"No comment"</b> passes a question. Fewer passes wins a tie.</li>
  <li><b>Wrong answers cost time:</b> a 2-second penalty, and 1 second more for each wrong answer in a row. Guessing doesn't pay.</li>""")
rep("""<div><b>Grades</b><span>${[1, 2, 3].map(l => ivGradeChip(l)).join(" ")}<br>Two right in a row: promoted. A wrong answer: back a grade. "No comment" passes, but fewer passes wins a tie.</span></div>""",
    """<div><b>Grades</b><span>${[1, 2, 3].map(l => ivGradeChip(l)).join(" ")}<br>Two right in a row: promoted. A wrong answer: back a grade and a 2-second penalty, longer if you keep guessing. "No comment" passes, but fewer passes wins a tie.</span></div>""")
open(src, "w", encoding="utf-8").write(s)
print("ok")
