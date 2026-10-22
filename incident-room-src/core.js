/* ================= CORE HELPERS ================= */
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const shuffle = arr => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
  del(k) { try { localStorage.removeItem(k); } catch (e) {} }
};
const ordinal = n => { const s = ["th", "st", "nd", "rd"], v = n % 100; return n + (s[(v - 20) % 10] || s[v] || s[0]); };
const LETTERS = ["A", "B", "C", "D", "E", "F"];

/* typed answers: ignore case, spaces, £, %, °; accept x², x^2 and x2; 1 1/5 as a mixed number; sqrt/root as √; pi as π */
const SUP = { "⁰": "0", "¹": "1", "²": "2", "³": "3", "⁴": "4", "⁵": "5", "⁶": "6", "⁷": "7", "⁸": "8", "⁹": "9", "⁻": "-" };
const normAns = t => {
  let s = String(t || "").toLowerCase().trim();
  s = s.replace(/(\d)\s+(\d+\/\d+)/g, "$1_$2");
  s = s.replace(/[−–—]/g, "-").replace(/÷/g, "/").replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻]/g, ch => SUP[ch]);
  s = s.replace(/sqrt|root/g, "√").replace(/pi/g, "π");
  s = s.replace(/\band\b|\bor\b|&|;/g, ",");
  s = s.replace(/£|%|°|\bdays?\b|\bpounds?\b|\s/g, "");
  s = s.replace(/(\d),(\d{3})(?!\d)/g, "$1$2");
  s = s.replace(/(\d)x(10)/g, "$1*$2").replace(/×/g, "*").replace(/[*^]/g, "");
  return s.replace(/\.0+$/, "").replace(/[,.]+$/, "");
};
const UNIT_RE = /(cm2|cm3|mm2|mm3|m2|m3|km2|g\/cm3|n\/m2|km\/h|kmh|m\/s|mph|mm|cm|km|kg|mg|ml|litres?|hours?|hrs?|minutes?|mins?|seconds?|secs?|degrees?|deg|units?|days?|m|g|l|h|s|p)$/;
function typedOk(q, t) {
  if (!q.accept) return false;
  const n = normAns(t);
  if (q.accept.includes(n)) return true;
  if (q.accept.every(a => /^-?[\d.]+(\/[\d.]+)?π?$/.test(a))) {
    const m = n.replace(UNIT_RE, "");
    return m !== n && /[\dπ]$/.test(m) && q.accept.includes(m);
  }
  return false;
}

function isCorrect(q, a) {
  if (a === null || a === undefined) return false;
  switch (q.type) {
    case "spot": return a === q.err;
    case "mc": case "method": return a === 0;
    case "tf": return a === (q.correct ? 1 : 0);
    case "order": return Array.isArray(a) && a.length === q.items.length && a.every((v, i) => v === i);
    case "type": return typedOk(q, a);
  }
  return false;
}
function ansLabel(q, a) {
  if (a === null || a === undefined || a === "") return "No answer";
  switch (q.type) {
    case "spot": return `Line ${a + 1}`;
    case "mc": case "method": return q.options[a];
    case "tf": return a ? "True" : "False";
    case "order": return a.map(i => q.items[i]).join(", ");
    case "type": return String(a);
  }
  return "";
}
function rightLabel(q) {
  switch (q.type) {
    case "spot": return `Line ${q.err + 1} should read: ${q.fixes[0]}`;
    case "mc": case "method": return q.options[0];
    case "tf": return q.correct ? "True" : "False";
    case "order": return q.items.join(", ");
    case "type": return q.answer;
  }
  return "";
}
function todoText(q, where, typed) {
  const dev = where !== "board";
  const pre = dev ? "" : "On your tablet: ";
  const send = where === "solo" ? "Check answer" : "Send";
  switch (q.type) {
    case "spot": return dev
      ? (typed ? "Tap the FIRST line that goes wrong. Then type the correct final answer and tap Send." : "Find the mistake: tap the FIRST line where the working goes wrong.")
      : (typed ? "On your tablet: tap the FIRST line that goes wrong, then type the correct final answer." : "On your tablet: tap the FIRST line where the working goes wrong.");
    case "mc": return pre + (dev ? "Tap the correct answer." : "tap the correct answer.");
    case "tf": return pre + (dev ? "Is it true or false? Tap one." : "is it true or false? Tap one.");
    case "order": return pre + (dev ? `Tap the answers in order, from ${q.dir}. Then tap ${send}.` : `tap the answers in order, from ${q.dir}.`);
    case "method": return pre + (dev ? "Tap the method that works." : "tap the method that works.");
    case "type": return pre + (dev ? `Type your answer, then tap ${send}.` : "type your answer.");
  }
  return "";
}
function makePerm(q) {
  const len = q.type === "order" ? q.items.length : (q.type === "mc" || q.type === "method") ? q.options.length : 0;
  if (!len) return null;
  let p;
  do { p = shuffle([...Array(len).keys()]); } while (q.type === "order" && p.every((v, i) => v === i));
  return p;
}
/* questions that match a game's settings: tier (F = Foundation only, H = everything), chosen topics, spot-only */
function poolFor(cfg) {
  const topics = cfg.topics || [];
  return QUESTIONS.filter(q => (cfg.tier !== "F" || q.tier === "F") && (!topics.length || topics.includes(q.topic)) && (!cfg.allow || cfg.allow.includes(q.topic)) && (cfg.mix !== "spot" || q.type === "spot"));
}
function pickQuestions(n, cfg) {
  const pool = poolFor(cfg);
  if (cfg.mix === "spot") return shuffle(pool).slice(0, n).map(q => q.n);
  const pools = {};
  Object.keys(TYPES).forEach(t => { pools[t] = shuffle(pool.filter(q => q.type === t)); });
  const cycle = ["mc", "spot", "tf", "order", "method", "type"], out = [];
  for (let k = 0; out.length < n && k < 400; k++) { const p = pools[cycle[k % cycle.length]]; if (p.length) out.push(p.shift().n); }
  return out;
}
const typedFor = (q, typed) => !!(typed && q.type === "spot" && q.accept);
const secsFor = (q, setting, typed) => (setting === "auto" ? q.secs : +setting) + (typedFor(q, typed) ? 15 : 0);

/* ranks: promoted by correct answers in a game, and across all saved games */
const RANKS = ["Constable", "Detective Constable", "Sergeant", "Inspector", "Chief Inspector", "Superintendent"];
const GAME_RANK_AT = [0, 2, 4, 6, 8, 11];
const CAREER_RANK_AT = [0, 10, 30, 60, 100, 160];
const rankIdx = (c, at) => { let r = 0; at.forEach((v, i) => { if (c >= v) r = i; }); return r; };
const rankBadge = idx => `<span class="rk rk${idx}"><span class="chev">${"<i></i>".repeat(Math.max(1, idx + 1))}</span>${RANKS[idx]}</span>`;
