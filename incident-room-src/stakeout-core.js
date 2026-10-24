/* ================= STAKEOUT: case generator (pure maths, no screen code) =================
   The city map is the grid of whole-number points from -6 to 6 on both axes.
   A case hides one suspect at a grid point and gives 3 surveillance reports.
   Every case is checked so that: report 1 leaves at least 4 possible points, each report rules more out,
   and after the last report exactly one point is left (the suspect). */
const SO = (() => {
  const R = 6;
  const POINTS = [];
  for (let y = R; y >= -R; y--) for (let x = -R; x <= R; x++) POINTS.push([x, y]);
  const rnd = n => Math.floor(Math.random() * n);
  const pick = arr => arr[rnd(arr.length)];
  const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
  const MINUS = "−";
  const num = n => (n < 0 ? MINUS + Math.abs(n) : String(n));
  const pt = (x, y) => `(${num(x)}, ${num(y)})`;

  /* a fraction p/q (q > 0) as screen HTML and as plain text */
  function frac(p, q, forX) {
    const g = gcd(p, q); p /= g; q /= g;
    const s = p < 0 ? MINUS : "", a = Math.abs(p);
    if (q === 1) return { h: s + (forX && a === 1 ? "" : a), t: s + (forX && a === 1 ? "" : a) };
    return { h: s + `<span class="fr"><span>${a}</span><span>${q}</span></span>`, t: s + (forX ? `(${a}/${q})` : `${a}/${q}`) };
  }
  /* "y = mx + c" for gradient p/q and intercept c (c may be a fraction cn/cq) */
  function yEq(p, q, cn, cq = 1) {
    const m = p === 0 ? { h: "", t: "" } : frac(p, q, true);
    const xh = p === 0 ? "" : m.h + "x", xt = p === 0 ? "" : m.t + "x";
    const g = gcd(cn, cq); cn /= g; cq /= g;
    if (cn === 0) return p === 0 ? { h: "y = 0", t: "y = 0" } : { h: "y = " + xh, t: "y = " + xt };
    const c = frac(Math.abs(cn), cq);
    if (p === 0) return { h: "y = " + (cn < 0 ? MINUS : "") + c.h, t: "y = " + (cn < 0 ? MINUS : "") + c.t };
    return { h: `y = ${xh} ${cn < 0 ? MINUS : "+"} ${c.h}`, t: `y = ${xt} ${cn < 0 ? MINUS : "+"} ${c.t}` };
  }
  /* a term like "3x", "−x", "2y" for the left or right of a rearranged equation */
  const term = (k, v, first) => {
    if (k === 0) return "";
    const a = Math.abs(k), body = (a === 1 ? "" : a) + v;
    if (first) return (k < 0 ? MINUS : "") + body;
    return (k < 0 ? ` ${MINUS} ` : " + ") + body;
  };
  const same = (h, t) => ({ h, t });

  /* A line through (a, b). kind: "v" vertical, "h" horizontal, or gradient p/q.
     Stored as A x + B y = C with whole numbers, so any grid point can be tested exactly. */
  function lineThrough(a, b, kind) {
    if (kind === "v") return { v: true, A: 1, B: 0, C: a, p: null, q: null };
    if (kind === "h") return { h: true, A: 0, B: 1, C: b, p: 0, q: 1 };
    const [p, q] = kind;               // gradient p/q, q > 0, reduced
    return { A: -p, B: q, C: q * b - p * a, p, q };   // q y - p x = K
  }
  const onLine = (L, x, y) => L.A * x + L.B * y === L.C;
  const linePts = L => POINTS.filter(([x, y]) => onLine(L, x, y));

  /* the different ways a report can describe the same line */
  function lineForms(L, a, b, level) {
    const pts = linePts(L).filter(([x, y]) => !(x === a && y === b));
    const forms = [];
    if (L.v) {
      forms.push({ id: "eq", w: 3, h: `x = ${num(a)}`, t: `x = ${num(a)}`, how: `Every point on x = ${num(a)} has x-coordinate ${num(a)}: a vertical line.` });
      if (level > 1 && pts.length) { const [x1, y1] = pick(pts); forms.push({ id: "axis", w: 1, pre: "on a line parallel to the y-axis through ", h: pt(x1, y1), t: pt(x1, y1), how: `Parallel to the y-axis means vertical, so it is x = ${num(a)}.`, eq: `x = ${num(a)}` }); }
      return forms;
    }
    if (L.h) {
      forms.push({ id: "eq", w: 3, h: `y = ${num(b)}`, t: `y = ${num(b)}`, how: `Every point on y = ${num(b)} has y-coordinate ${num(b)}: a horizontal line.` });
      if (level > 1 && pts.length) { const [x1, y1] = pick(pts); forms.push({ id: "axis", w: 1, pre: "on a line parallel to the x-axis through ", h: pt(x1, y1), t: pt(x1, y1), how: `Parallel to the x-axis means horizontal, so it is y = ${num(b)}.`, eq: `y = ${num(b)}` }); }
      return forms;
    }
    const { p, q } = L, K = L.C;      // q y = p x + K
    const intC = K % q === 0, c = K / q;
    const std = yEq(p, q, K, q);
    const mTxt = frac(p, q).t;
    if (intC) forms.push({ id: "eq", w: level === 1 ? 6 : 2, h: std.h, t: std.t, how: `${std.t}: gradient ${mTxt}, crosses the y-axis at (0, ${num(c)}).` });
    if (level >= 2) {
      /* rearranged equations */
      if (q === 1 && intC) {
        if (p === -1) forms.push({ id: "re", w: 2, h: `x + y = ${num(K)}`, t: `x + y = ${num(K)}`, how: `x + y = ${num(K)} rearranges to ${std.t}.` });
        if (p === 1) forms.push({ id: "re", w: 2, h: `x ${MINUS} y = ${num(-K)}`, t: `x ${MINUS} y = ${num(-K)}`, how: `x ${MINUS} y = ${num(-K)} rearranges to ${std.t}.` });
        const e = `y${term(-p, "x")} = ${num(K)}`;
        forms.push({ id: "re", w: 1, h: e, t: e, how: `${e} rearranges to ${std.t}.` });
        const k = pick([2, 3]);
        const e2 = `${k}y = ${term(k * p, "x", true)}${K ? ` ${K < 0 ? MINUS : "+"} ${Math.abs(k * K)}` : ""}`;
        forms.push({ id: "re", w: 2, h: e2, t: e2, how: `Divide ${e2} by ${k}: ${std.t}.` });
      }
      if (q > 1) {
        const e = `${q}y = ${term(p, "x", true)}${K ? ` ${K < 0 ? MINUS : "+"} ${Math.abs(K)}` : ""}`;
        forms.push({ id: "re", w: 2, h: e, t: e, how: `Divide ${e} by ${q}: ${std.t}.` });
      }
      /* two points */
      if (pts.length >= 2) {
        let i = rnd(pts.length), j = rnd(pts.length - 1); if (j >= i) j++;
        const [P1, P2] = [pts[i], pts[j]].sort((u, v) => u[0] - v[0]);
        forms.push({ id: "two", w: 3, pre: "on the straight line through ", h: `${pt(...P1)} and ${pt(...P2)}`, t: `${pt(...P1)} and ${pt(...P2)}`,
          how: `Gradient = (${num(P2[1])} ${MINUS} ${num(P1[1])}) ÷ (${num(P2[0])} ${MINUS} ${num(P1[0])}) = ${mTxt}, so the line is ${std.t}.` });
      }
      /* gradient and a point */
      if (pts.length) {
        const [x1, y1] = pick(pts), m = frac(p, q);
        forms.push({ id: "grad", w: 2, pre: `on the line through ${pt(x1, y1)} with gradient `, h: m.h, t: m.t, how: `Gradient ${mTxt} through ${pt(x1, y1)} gives ${std.t}.` });
        /* parallel to another line */
        let c2 = rnd(13) - 6; if (c2 * q === K) c2 += c2 > 0 ? -2 : 2;
        const other = yEq(p, q, c2);
        forms.push({ id: "par", w: 2, pre: `on the line through ${pt(x1, y1)} that is parallel to `, h: other.h, t: other.t,
          how: `Parallel lines have the same gradient (${mTxt}). Through ${pt(x1, y1)} that gives ${std.t}.` });
        /* perpendicular (Higher) */
        if (level >= 3 && p !== 0) {
          const pp = p < 0 ? q : -q, pq = Math.abs(p);       // gradient -q/p, denominator kept positive
          let c3 = rnd(9) - 4;
          const perp = yEq(pp, pq, c3);
          forms.push({ id: "perp", w: 3, pre: `on the line through ${pt(x1, y1)} that is perpendicular to `, h: perp.h, t: perp.t,
            how: `Perpendicular gradients multiply to ${MINUS}1. ${frac(pp, pq).t} × ${mTxt} = ${MINUS}1, so the line is ${std.t}.` });
        }
      }
    }
    return forms;
  }
  const GRADS = {
    1: [[1, 1], [-1, 1], [2, 1], [-2, 1], [3, 1], [-3, 1]],
    2: [[1, 1], [-1, 1], [2, 1], [-2, 1], [3, 1], [-3, 1], [1, 2], [-1, 2]],
    3: [[1, 2], [-1, 2], [1, 3], [-1, 3], [2, 3], [-2, 3], [3, 2], [-3, 2], [2, 1], [-2, 1], [3, 1], [-3, 1]]
  };
  const wpick = arr => { let t = arr.reduce((s, f) => s + f.w, 0), r = Math.random() * t; for (const f of arr) { r -= f.w; if (r <= 0) return f; } return arr[arr.length - 1]; };
  const SOURCES = ["CCTV", "Witness", "Phone signal", "Patrol car", "Drone camera", "Informant", "Number-plate camera", "Sniffer dog"];

  function lineClue(a, b, level) {
    const r = Math.random(), hv = level === 1 ? 0.22 : 0.12;
    const kind = r < hv / 2 ? "v" : r < hv ? "h" : pick(GRADS[level]);
    const L = lineThrough(a, b, kind);
    if (linePts(L).length < 4) return null;
    if (!L.v && Math.abs(L.C / L.B) > (level === 1 ? 6 : 9)) return null;   // keep the y-intercept on (or near) the map
    const forms = lineForms(L, a, b, level);
    if (!forms.length) return null;
    const f = wpick(forms);
    const pre = f.pre || "on the line ";
    const std = L.v ? `x = ${num(a)}` : L.h ? `y = ${num(b)}` : yEq(L.p, L.q, L.C, L.q).t;
    return { kind: "line", form: f.id, L: { A: L.A, B: L.B, C: L.C }, std,
      h: `The suspect is ${pre}<b class="eq">${f.h}</b>.`, t: `The suspect is ${pre}${f.t}.`, how: f.how,
      test: (x, y) => onLine(L, x, y) };
  }
  const QUAD = [["first", (x, y) => x > 0 && y > 0], ["second", (x, y) => x < 0 && y > 0], ["third", (x, y) => x < 0 && y < 0], ["fourth", (x, y) => x > 0 && y < 0]];
  function narrowClue(a, b) {
    const opts = [];
    QUAD.forEach(([n, f]) => { if (f(a, b)) opts.push({ w: 3, s: `in the ${n} quadrant`, how: `The ${n} quadrant is where ${n === "first" ? "x and y are both positive" : n === "second" ? "x is negative and y is positive" : n === "third" ? "x and y are both negative" : "x is positive and y is negative"}.`, f }); });
    ["x", "y"].forEach(v => {
      const val = v === "x" ? a : b, get = v === "x" ? (x => x) : ((x, y) => y);
      if (val !== 0) opts.push({ w: 2, s: `${val < 0 ? "a negative" : "a positive"} ${v}-coordinate`, has: true, f: (x, y) => (val < 0 ? get(x, y) < 0 : get(x, y) > 0) });
      opts.push({ w: 1, s: `an ${Math.abs(val) % 2 ? "odd" : "even"} ${v}-coordinate`, has: true, f: (x, y) => Math.abs(get(x, y)) % 2 === Math.abs(val) % 2, how: Math.abs(val) % 2 ? "Odd numbers include negative ones: \u22125, \u22123, \u22121, 1, 3, 5." : "Even numbers include 0 and negative ones: \u22124, \u22122, 0, 2, 4." });
      const lo = val - rnd(3), hi = val + rnd(3);
      if (Math.random() < 0.5) opts.push({ w: 2, s: `${v === "x" ? "an" : "a"} ${v}-coordinate of at least ${num(lo)}`, has: true, f: (x, y) => get(x, y) >= lo });
      else opts.push({ w: 2, s: `${v === "x" ? "an" : "a"} ${v}-coordinate of at most ${num(hi)}`, has: true, f: (x, y) => get(x, y) <= hi });
    });
    const o = wpick(opts);
    const txt = `The suspect ${o.has ? "has" : "is"} ${o.s}.`;
    return { kind: "area", h: txt, t: txt, how: o.how || "", test: o.f };
  }

  const PATTERNS = [["line", "area", "line"], ["area", "line", "line"], ["line", "area", "area"]];
  /* level 1: x = a, y = b and y = mx + c with whole-number gradients
     level 2: also rearranged equations, two points, gradient and a point, parallel lines, gradient ½
     level 3: also fractional gradients and perpendicular lines (Higher) */
  function makeCase(level = 1) {
    for (let tries = 0; tries < 4000; tries++) {
      const a = rnd(11) - 5, b = rnd(11) - 5;
      if (a === 0 && b === 0) continue;
      const pat = pick(PATTERNS);
      const clues = pat.map(k => (k === "line" ? lineClue(a, b, level) : narrowClue(a, b)));
      if (clues.some(c => !c)) continue;
      const left = []; let cand = POINTS.slice(), ok = true;
      for (const c of clues) {
        const next = cand.filter(([x, y]) => c.test(x, y));
        if (next.length === cand.length || !next.some(([x, y]) => x === a && y === b)) { ok = false; break; }
        cand = next; left.push(cand.map(p => p.slice()));
      }
      if (!ok || left[0].length < 4 || left[0].length > (clues[0].kind === "line" ? 13 : 45) || left[1].length < 2 || left[2].length !== 1) continue;
      const ln = clues.filter(c => c.kind === "line"); if (ln.length === 2 && ln[0].std === ln[1].std) continue;
      const src = shuffleS(SOURCES).slice(0, 3);
      return { p: [a, b], level, clues: clues.map((c, i) => ({ src: src[i], h: c.h, t: c.t, how: c.how, kind: c.kind, L: c.L || null, std: c.std || null, test: c.test, left: left[i] })) };
    }
    return null;
  }
  const shuffleS = arr => { const x = arr.slice(); for (let i = x.length - 1; i > 0; i--) { const j = rnd(i + 1); [x[i], x[j]] = [x[j], x[i]]; } return x; };
  const makeCases = (n, level) => { const out = [], seen = new Set(); let g = 0; while (out.length < n && g++ < 200) { const c = makeCase(level); if (c && !seen.has(c.p + "")) { seen.add(c.p + ""); out.push(c); } } return out; };

  const passes = (cs, k, x, y) => cs.clues[k].test(x, y);

  /* why a wrong arrest was wrong: the pattern teachers most want to see */
  function diagnose(cs, x, y) {
    const [a, b] = cs.p;
    if (x === a && y === b) return { tag: "right" };
    const failed = cs.clues.map((c, k) => (passes(cs, k, x, y) ? -1 : k)).filter(k => k >= 0);
    if (x === b && y === a) return { tag: "swap", failed, text: `Swapped x and y: the suspect is at ${pt(a, b)}, not ${pt(x, y)}. Across first, then up or down.` };
    if ((x === -a && y === b) || (x === a && y === -b) || (x === -a && y === -b)) return { tag: "sign", failed, text: `Sign slip: ${pt(x, y)} is on the wrong side of ${x !== a && y !== b ? "both axes" : x !== a ? "the y-axis" : "the x-axis"}.` };
    if (failed.length === 1) return { tag: cs.clues[failed[0]].kind === "line" ? "offline" : "area", failed, text: `${pt(x, y)} doesn't fit report ${failed[0] + 1}: ${cs.clues[failed[0]].t}` };
    return { tag: "other", failed, text: `${pt(x, y)} doesn't fit reports ${failed.map(k => k + 1).join(" and ")}.` };
  }
  const TAG_LABEL = { swap: "Swapped x and y", sign: "Sign slips", offline: "Not on the line in a report", area: "Missed a location report", other: "Didn't fit two or more reports" };

  /* points for an arrest made while report k (0-based) was showing, with time left */
  const arrestPoints = (k, left, total, K = 3) => Math.round(400 + 600 * (K - 1 - k) / (K - 1)) + Math.round(200 * Math.max(0, left) / Math.max(1, total));
  const LEVELS = { 1: "y = mx + c, x = a and y = b", 2: "Rearranging, two points, parallel lines", 3: "Higher: fractional gradients, perpendicular lines" };
  return { R, POINTS, makeCase, makeCases, diagnose, passes, arrestPoints, pt, num, LEVELS, TAG_LABEL, linePts: L => POINTS.filter(([x, y]) => L.A * x + L.B * y === L.C) };
})();
