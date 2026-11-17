import sys
src = "/home/claude/ir-live/index.html"
s = open(src, encoding="utf-8").read()
bank = open("/home/claude/mathsforensics-lab/incident-room-src/bank-ks3.js", encoding="utf-8").read()
kug = open("/home/claude/mathsforensics-lab/incident-room-src/kug-ks3.js", encoding="utf-8").read()
assert "KS3_FROM" not in s, "already patched"
def rep(a, b, n=1):
    global s
    c = s.count(a)
    assert c == n, f"expected {n} got {c}: {a[:90]}"
    s = s.replace(a, b)

# 1. the KS3 bank, marked ks3, after the GCSE bank
rep("const QUESTIONS = BANK;\nQUESTIONS.forEach((q, k) => { q.n = k; });",
"""const KS3_FROM = BANK.length;
""" + bank.strip() + """
BANK.slice(KS3_FROM).forEach(q => { q.ks3 = true; if (q.accept) q.accept = [...new Set(q.accept.map(normAns))]; });
KS3_TOPIC_LIST.forEach(([id, name]) => { TOPICS[id] = name; });
const KS3_IDS = KS3_TOPIC_LIST.map(t => t[0]);
const QUESTIONS = BANK;
QUESTIONS.forEach((q, k) => { q.n = k; });""")
# one tier test for every pool: "K" is KS3 only; GCSE tiers never see KS3 questions
rep("function poolFor(cfg) {",
"""/* tier "K" means the KS3 (Academy) questions only. "F" and "H" are GCSE and never include them. */
function tierOk(q, tier) { return tier === "K" ? !!q.ks3 : !q.ks3 && (tier !== "F" || q.tier === "F"); }
const tierName = t => (t === "K" ? "KS3" : t === "F" ? "Foundation" : "Higher");
function poolFor(cfg) {""")
rep("return QUESTIONS.filter(q => (cfg.tier !== \"F\" || q.tier === \"F\") && (!topics.length || topics.includes(q.topic)) && (!cfg.allow || cfg.allow.includes(q.topic))",
    "return QUESTIONS.filter(q => tierOk(q, cfg.tier) && (!topics.length || topics.includes(q.topic)) && (cfg.tier === \"K\" || !cfg.allow || cfg.allow.includes(q.topic))")
rep("QUESTIONS.some(q => q.topic === t && (H.cfg.tier !== \"F\" || q.tier === \"F\"))", "QUESTIONS.some(q => q.topic === t && tierOk(q, H.cfg.tier))", 2)
rep("q.brief.length <= 130 && (G.tier === \"H\" || q.tier === \"F\")", "q.brief.length <= 130 && tierOk(q, G.tier)")
rep("topics.includes(q.topic) && (tier === \"H\" || q.tier === \"F\") && q.brief.length <= 170", "topics.includes(q.topic) && tierOk(q, tier) && q.brief.length <= 170")
rep("\"P1\"].includes(q.topic) && (tier === \"H\" || q.tier === \"F\")", "\"P1\"].includes(q.topic) && tierOk(q, tier)")

# 2. The Interrogation: KS3 subjects, grades from K1-K3, KS3 generators
rep("""const ivStrands = k => (k === "PS" ? ["P", "S"] : k ? [k] : []);""",
"""const IV_K_SUBJECTS = [["KA", "Algebra"], ["KP", "Percentages"], ["KR", "Ratio"], ["KF", "Fractions"], ["KD", "Decimals & rounding"]];
const IV_K_STR = { KA: ["KA1", "KA2"], KP: ["KR1"], KR: ["KR2"], KF: ["KN1", "KN2"], KD: ["KN3"] };
const ivSubjects = tier => (tier === "K" ? IV_K_SUBJECTS : IV_SUBJECTS);
const ivSubjName = (tier, k) => ((ivSubjects(tier).find(x => x[0] === k) || ["", ""])[1]);
const ivAll = tier => (tier === "K" ? "all of the KS3 topics" : "all of GCSE maths");
const ivStrands = k => (IV_K_STR[k] || (k === "PS" ? ["P", "S"] : k ? [k] : []));
/* the tier and subject a cup is stored with: KS3 cups keep tier "F" and the subject "KS3" or "KS3:KA" */
const ivCupNorm = c => { if (c && /^KS3/.test(c.subject || "")) { c.tier = "K"; c.subject = (c.subject.split(":")[1] || ""); } return c; };
""" + kug.strip())
rep("""function ivBankLevel(q, tier) {
  const t = q.secs || 30;""", """function ivBankLevel(q, tier) {
  if (q.ks3) return Math.min(3, Math.max(1, +String(q.tier).slice(1) || 1));
  const t = q.secs || 30;""")
rep("""    const topics = o.free ? FREE_TOPICS_IR : null, strands = o.strands || [];
    const bank = shuffle(QUESTIONS.filter(q => ["mc", "method", "tf"].includes(q.type) && q.brief.length <= 140 && (o.tier === "H" || q.tier === "F")
      && (!topics || topics.includes(q.topic)) && (!strands.length || strands.includes(q.topic[0]))));""",
"""    const ks3 = o.tier === "K", topics = o.free && !ks3 ? FREE_TOPICS_IR : null, strands = o.strands || [];
    const bank = shuffle(QUESTIONS.filter(q => ["mc", "method", "tf"].includes(q.type) && q.brief.length <= 140 && tierOk(q, o.tier)
      && (!topics || topics.includes(q.topic)) && (!strands.length || strands.some(s => q.topic.startsWith(s)))));""")
rep("""        else { const g = PUG.make(o.tier, strands, o.tier === "F" && lv === 3 ? 2 : lv); if (g) q = Object.assign({}, g, { lv }); }""",
"""        else { const g = ks3 ? KUG.make(strands, lv) : PUG.make(o.tier, strands, o.tier === "F" && lv === 3 ? 2 : lv); if (g) q = Object.assign({}, g, { lv }); }""")

# solo setup
rep("""  const paid = soloUnlimited(), cfg = Object.assign({ subject: "A", tier: "F" }, store.get("ir-iv", {}));""",
"""  const paid = soloUnlimited(), cfg = Object.assign({ subject: "A", tier: "F" }, store.get("ir-iv", {}));
  const fixSub = () => { if (!ivSubjects(cfg.tier).some(x => x[0] === cfg.subject)) cfg.subject = ivSubjects(cfg.tier)[0][0]; };
  fixSub();""")
rep("""<div><b>Round 1 · Your chosen subject</b><span>90 seconds on the part of GCSE maths you choose below.</span></div>
          <div><b>Round 2 · General case knowledge</b><span>90 seconds on everything.</span></div>""",
"""<div><b>Round 1 · Your chosen subject</b><span>90 seconds on the part of ${cfg.tier === "K" ? "KS3" : "GCSE"} maths you choose below.</span></div>
          <div><b>Round 2 · General case knowledge</b><span>90 seconds on ${cfg.tier === "K" ? "all the KS3 topics" : "everything"}.</span></div>""")
rep("""<section class="panel"><span class="eyebrow">Your chosen subject</span>${choice("ivsub", cfg.subject, IV_SUBJECTS)}
        <span class="eyebrow">Tier</span>${choice("ivtier", cfg.tier, [["F", "Foundation"], ["H", "Higher"]])}
        ${paid ? "" : `<p class="muted small">On the free plan, questions from the question bank come from the sample topics.</p>`}""",
"""<section class="panel"><span class="eyebrow">Level</span>${choice("ivtier", cfg.tier, IV_TIERS)}
        <span class="eyebrow">Your chosen subject</span>${choice("ivsub", cfg.subject, ivSubjects(cfg.tier))}
        ${cfg.tier === "K" ? `<p class="muted small">KS3 topics: collecting like terms, expanding brackets, percentages, ratio, fractions and mixed numbers, ordering fractions, decimals and rounding.</p>` : paid ? "" : `<p class="muted small">On the free plan, questions from the question bank come from the sample topics.</p>`}""")
rep("""    bindChoice("ivsub", v => { cfg.subject = v; draw(); });
    bindChoice("ivtier", v => { cfg.tier = v; draw(); });
    document.getElementById("back").onclick = signIn;""",
"""    bindChoice("ivsub", v => { cfg.subject = v; draw(); });
    bindChoice("ivtier", v => { cfg.tier = v; fixSub(); draw(); });
    document.getElementById("back").onclick = signIn;""")
rep("""const free = !soloUnlimited(), subj = IV_SUBJECTS.find(s => s[0] === cfg.subject) || IV_SUBJECTS[0];""",
    """const free = !soloUnlimited(), subs = ivSubjects(cfg.tier), subj = subs.find(s => s[0] === cfg.subject) || subs[0];""")
rep("""ivStrands(cfg.subject), free }),""", """ivStrands(subj[0]), free }),""")
rep(""""90 seconds on all of GCSE maths. You start on Constable questions again.\"""", """`90 seconds on ${ivAll(cfg.tier)}. You start on Constable questions again.`""")
rep("""const IV_SECS = { 0: 90, 1: 60, 2: 60, 3: 90 };""", """const IV_SECS = { 0: 90, 1: 60, 2: 60, 3: 90 };
const IV_TIERS = [["F", "GCSE Foundation"], ["H", "GCSE Higher"], ["K", "KS3 (Years 7–9)"]];""")

# host setup
rep("""        <span class="eyebrow">Tier</span>${choice("ivtier", cfg.tier, [["F", "Foundation"], ["H", "Higher"]])}
        <span class="eyebrow">Topic focus</span>${choice("ivsub", cfg.subject, [["", "All of GCSE"]].concat(IV_SUBJECTS))}""",
"""        <span class="eyebrow">Level</span>${choice("ivtier", cfg.tier, IV_TIERS)}
        <span class="eyebrow">Topic focus</span>${choice("ivsub", cfg.subject, [["", cfg.tier === "K" ? "All the KS3 topics" : "All of GCSE"]].concat(ivSubjects(cfg.tier)))}""")
rep("""    bindChoice("ivtier", v => { cfg.tier = v; draw(true); });""",
    """    bindChoice("ivtier", v => { cfg.tier = v; if (cfg.subject && !ivSubjects(v).some(x => x[0] === cfg.subject)) cfg.subject = ""; draw(true); });""")
rep("""  const cfg = Object.assign({ tier: "F", subject: "", mode: "live", title: "" }, store.get("ir-ivh", {}));""",
"""  const cfg = Object.assign({ tier: "F", subject: "", mode: "live", title: "" }, store.get("ir-ivh", {}));
  if (cfg.subject && !ivSubjects(cfg.tier).some(x => x[0] === cfg.subject)) cfg.subject = "";""")
# cups
rep("""insert({ code, title, tier: cfg.tier, subject: cfg.subject || "", seeds""",
    """insert({ code, title, tier: cfg.tier === "K" ? "F" : cfg.tier, subject: cfg.tier === "K" ? "KS3" + (cfg.subject ? ":" + cfg.subject : "") : cfg.subject || "", seeds""")
rep("""return data ? { data } : { err: "nocup" }; }""", """if (data && data.cup) ivCupNorm(data.cup); return data ? { data } : { err: "nocup" }; }""")
rep("""Homework tournament · ${c.tier === "H" ? "Higher" : "Foundation"}${c.subject ? ` · ${esc((IV_SUBJECTS.find(x => x[0] === c.subject) || ["", ""])[1])}` : ""}""",
    """Homework tournament · ${tierName(c.tier)}${c.subject ? ` · ${esc(ivSubjName(c.tier, c.subject))}` : ""}""")

# 3. Rapid Response: a KS3 tier in the topic picker
rep("""c.tier = c.tier === "F" ? "F" : "H"; c.topics = Array.isArray(c.topics) ? c.topics.filter(id => TOPICS[id]) : [];""",
    """c.tier = ["F", "K"].includes(c.tier) ? c.tier : "H"; c.topics = Array.isArray(c.topics) ? c.topics.filter(id => TOPICS[id] && (id[0] === "K") === (c.tier === "K")) : [];""")
rep("""const filterSummary = cfg => `${cfg.tier === "F" ? "Foundation" : "Higher"} · """, """const filterSummary = cfg => `${tierName(cfg.tier)} · """)
rep("""  const avail = id => QUESTIONS.some(q => q.topic === id && (cfg.tier !== "F" || q.tier === "F"));
  const lk = id => !!cfg.allow && !cfg.allow.includes(id);""",
"""  const ks3 = cfg.tier === "K", SL = ks3 ? KS3_STRANDS : STRANDS;
  const avail = id => QUESTIONS.some(q => q.topic === id && tierOk(q, cfg.tier));
  const idsOf = s => (ks3 ? KS3_IDS.filter(id => id.startsWith(s)) : TOPIC_IDS.filter(id => strandOf(id) === s && avail(id)));
  const lk = id => !ks3 && !!cfg.allow && !cfg.allow.includes(id);""")
rep("""  const boxes = Object.entries(STRANDS).map(([s, name]) => {
    const ids = TOPIC_IDS.filter(id => strandOf(id) === s && avail(id));""", """  const boxes = Object.entries(SL).map(([s, name]) => {
    const ids = idsOf(s);""")
rep("""  return `${cfg.allow ? `<div class="freenote">""", """  return `${cfg.allow && !ks3 ? `<div class="freenote">""")
rep("""${choice("tier", cfg.tier, [["F", "Foundation"], ["H", "Higher (includes Foundation)"]])}
    <span class="eyebrow">Topics</span>${choice("tmode", picking ? "pick" : "all", [["all", "All GCSE topics"], ["pick", "Choose topics"]])}
    ${picking ? `<div class="chips strands">${Object.entries(STRANDS).map(([s, name]) => {
        const ids = TOPIC_IDS.filter(id => strandOf(id) === s && avail(id));""",
"""${choice("tier", cfg.tier, cfg.ks3ok ? [["F", "GCSE Foundation"], ["H", "GCSE Higher (includes Foundation)"], ["K", "KS3 (Years 7–9)"]] : [["F", "Foundation"], ["H", "Higher (includes Foundation)"]])}
    <span class="eyebrow">Topics</span>${choice("tmode", picking ? "pick" : "all", [["all", ks3 ? "All KS3 topics" : "All GCSE topics"], ["pick", "Choose topics"]])}
    ${picking ? `<div class="chips strands">${Object.entries(SL).map(([s, name]) => {
        const ids = idsOf(s);""")
rep("""  bindChoice("tier", v => { cfg.tier = v; redraw(); });
  bindChoice("tmode",""", """  bindChoice("tier", v => { cfg.tier = v; cfg.topics = cfg.topics.filter(id => (id[0] === "K") === (v === "K")); cfg.open = []; redraw(); });
  bindChoice("tmode",""")
rep("""    const s = strandOf(id); if (!cfg.open.includes(s)) cfg.open.push(s);""", """    const s = id[0] === "K" ? id.slice(0, 2) : strandOf(id); if (!cfg.open.includes(s)) cfg.open.push(s);""")
rep("""const STRANDS = { N: "Number",""", """const KS3_STRANDS = { KA: "Algebra", KR: "Percentages & ratio", KN: "Fractions & decimals" };
const STRANDS = { N: "Number",""")
rep("""  cfg.allow = soloAllow();
  if (cfg.allow) cfg.topics = cfg.topics.filter(id => cfg.allow.includes(id));
  const draw = (keep = false) => {
    const none = !poolFor(cfg).length;""", """  cfg.allow = soloAllow();
  if (cfg.allow) cfg.topics = cfg.topics.filter(id => id[0] === "K" || cfg.allow.includes(id));
  const draw = (keep = false) => {
    const none = !poolFor(cfg).length;""")
rep("""const withFilter = (cfg, defaults) => { const c = Object.assign({}, defaults, cfg || {}); c.tier = ["F", "K"].includes(c.tier) ? c.tier : "H";""",
    """const withFilter = (cfg, defaults, ks3ok = false) => { const c = Object.assign({}, defaults, cfg || {}); c.ks3ok = ks3ok; c.tier = (ks3ok ? ["F", "K"] : ["F"]).includes(c.tier) ? c.tier : "H";""")
for k in ["ir-solo", "ir-team", "ir-host"]:
    pass
rep("""  const cfg = withFilter(store.get("ir-solo", null), { mix: "mixed", n: 10, tier: "H", topics: [] });
  cfg.allow = soloAllow();
  if""", """  const cfg = withFilter(store.get("ir-solo", null), { mix: "mixed", n: 10, tier: "H", topics: [] }, true);
  cfg.allow = soloAllow();
  if""")
rep("""withFilter(store.get("ir-team", null), { count: 3, n: 6, mix: "mixed", tier: "H", topics: [] })""", """withFilter(store.get("ir-team", null), { count: 3, n: 6, mix: "mixed", tier: "H", topics: [] }, true)""")
rep("""withFilter(store.get("ir-host", null), { n: 10, time: "auto", mix: "mixed", typed: false, tier: "H", topics: [] })""", """withFilter(store.get("ir-host", null), { n: 10, time: "auto", mix: "mixed", typed: false, tier: "H", topics: [] }, true)""")
rep("""const saveCfg = (key, cfg) => { const { open, picking, allow, ...keep } = cfg; store.set(key, keep); };""", """const saveCfg = (key, cfg) => { const { open, picking, allow, ks3ok, ...keep } = cfg; store.set(key, keep); };""")

rep("""  cfg.allow = soloAllow(); cfg.topics = due.filter(""", """  if (cfg.tier === "K") cfg.tier = "H";
  cfg.allow = soloAllow(); cfg.topics = due.filter(""")
# skills track GCSE only
rep("""  if (!topic || !TOPICS[topic]) return;
  const K = skillStore()""", """  if (!topic || !TOPICS[topic] || topic[0] === "K") return;
  const K = skillStore()""")

# 4. links from the Academy: ?ks3=1 opens a game set to KS3
rep("""  const q = new URLSearchParams(location.search);
  if (q.has("host"))""", """  const q = new URLSearchParams(location.search);
  if (q.get("ks3") === "1") ks3Prefs(q);
  if (q.has("host"))""")
rep("""  else if (q.get("play") === "interrogation") { await initAuth(); await loadAccess(); return ivSoloSetup(); }""",
"""  else if (q.get("play") === "interrogation") { await initAuth(); await loadAccess(); return ivSoloSetup(); }
  else if (q.get("play") === "rapid") { await initAuth(); await loadAccess(); return profile(soloSetup); }
  else if (q.get("play") === "teams") { await initAuth(); await loadAccess(); return teamSetup(); }""")
rep("""/* ================= START ================= */""", """/* ?ks3=1 (from the Academy) sets each game's level to KS3. &sub=KA picks an Interrogation subject; &topics=KA1,KA2 picks Rapid Response topics. */
function ks3Prefs(q) {
  const sub = (q.get("sub") || "").toUpperCase(), tops = (q.get("topics") || "").toUpperCase().split(",").filter(id => KS3_IDS.includes(id));
  const ivSub = IV_K_SUBJECTS.some(x => x[0] === sub) ? sub : "";
  store.set("ir-iv", Object.assign({}, store.get("ir-iv", {}), { tier: "K", subject: ivSub || "KA" }));
  store.set("ir-ivh", Object.assign({}, store.get("ir-ivh", {}), { tier: "K", subject: ivSub }));
  ["ir-solo", "ir-team", "ir-host"].forEach(k => store.set(k, Object.assign({}, store.get(k, {}) || {}, { tier: "K", topics: tops })));
}
/* ================= START ================= */""")
open(src, "w", encoding="utf-8").write(s)
print("ok", len(s))
