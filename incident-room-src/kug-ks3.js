/* ================= KS3 QUESTION GENERATORS (The Interrogation, Academy mode) =================
   KUG.make(strands, lv) returns one multiple-choice question { topic, brief, opts, a, why }
   for a KS3 topic. strands: topic-id prefixes, e.g. ["KA1", "KA2"]; [] means every KS3 topic.
   lv: 1 Constable, 2 Sergeant, 3 Inspector. Uses Math.random only, so ivWithSeed makes it repeatable.
   Every wrong option is checked to be a different value from the answer.                       */
const KUG = (() => {
  const R = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const P = a => a[Math.floor(Math.random() * a.length)];
  const M = "−";
  const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
  /* ---- algebra: an expression is a list of [coef, key]; key "" is a number, "x", "x²", "xy" ---- */
  const term = (c, k, first) => {
    if (!c) return "";
    const a = Math.abs(c), body = k ? (a === 1 ? k : a + k) : String(a);
    return first ? (c < 0 ? M + body : body) : (c < 0 ? ` ${M} ` : " + ") + body;
  };
  const ex = ts => { let out = ""; ts.forEach(([c, k]) => { if (c) out += term(c, k, !out); }); return out || "0"; };
  const canon = ts => { const m = {}; ts.forEach(([c, k]) => { m[k] = (m[k] || 0) + c; }); return Object.keys(m).sort().filter(k => m[k]).map(k => k + ":" + m[k]).join(","); };
  /* ---- numbers ---- */
  const dec = (n, dp) => { const s = (Math.round(n * 1e6) / 1e6).toFixed(dp === undefined ? 6 : dp); return dp === undefined ? s.replace(/\.?0+$/, "") : s; };
  const fr = (n, d) => { const g = gcd(n, d); n /= g; d /= g; if (d < 0) { n = -n; d = -d; } return [n, d]; };
  const fs = ([n, d]) => (d === 1 ? String(n) : `${n}/${d}`);
  const mixed = ([n, d]) => { const w = Math.floor(n / d), r = n - w * d; return !r ? String(w) : w ? `${w} ${r}/${d}` : `${r}/${d}`; };
  /* build the question: wrongs are [text, value] pairs; value null means "different by construction" */
  const mk = (topic, brief, ans, ansVal, wrongs, why) => {
    const seen = new Set([ans]), opts = [ans];
    for (const [t, v] of wrongs) {
      if (opts.length === 4) break;
      if (!t || seen.has(t) || /\d\.\d{4,}/.test(t) || /(^|[^\d])-\d/.test(t)) continue;
      if (v !== null && v !== undefined && Math.abs(v - ansVal) < 1e-9) continue;
      seen.add(t); opts.push(t);
    }
    if (opts.length < 4) return null;
    const sh = opts.slice(); for (let i = sh.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [sh[i], sh[j]] = [sh[j], sh[i]]; }
    return { topic, brief, opts: sh, a: sh.indexOf(ans), why };
  };
  const mkEx = (topic, brief, ansTs, wrongTs, why) => {
    const key = canon(ansTs);
    return mk(topic, brief, ex(ansTs), 0, wrongTs.filter(w => canon(w) !== key).map(w => [ex(w), null]), why);
  };

  const G = {
    /* ---------- KA1 collecting like terms ---------- */
    KA1(lv) {
      const v = P(["x", "y", "a", "m", "n", "p"]);
      if (lv === 1) {
        const a = R(2, 9), b = R(2, 9), c = R(1, 9);
        if (Math.random() < 0.5) return mkEx("KA1", `Simplify ${ex([[a, v], [b, v]])}`, [[a + b, v]],
          [[[a + b, v + "²"]], [[a * b, v]], [[a + b + 1, v]], [[a + b - 1, v]]], `Add the numbers in front: ${a} + ${b} = ${a + b}, so ${a + b}${v}. The letter doesn't change.`);
        return mkEx("KA1", `Simplify ${ex([[a, v], [c, ""], [b, v]])}`, [[a + b, v], [c, ""]],
          [[[a + b + c, v]], [[a + b, v], [-c, ""]], [[a * b, v], [c, ""]], [[a + b, v + "²"], [c, ""]]], `${v} terms: ${a} + ${b} = ${a + b}, so ${a + b}${v}. The number ${c} stays on its own: ${ex([[a + b, v], [c, ""]])}.`);
      }
      if (lv === 2) {
        const w = v === "y" ? "x" : "y", a = R(4, 9), b = R(2, 7), c = R(1, a - 1), d = R(1, 6);
        const ans = [[a - c, v], [b + d, w]];
        return mkEx("KA1", `Simplify ${ex([[a, v], [b, w], [-c, v], [d, w]])}`, ans,
          [[[a + c, v], [b + d, w]], [[a - c, v], [b - d, w]], [[a - c + b + d, v + w]], [[a + c, v], [b - d, w]]],
          `${v} terms: ${a} ${M} ${c} = ${a - c}. ${w} terms: ${b} + ${d} = ${b + d}. Keep the sign in front of each term with it.`);
      }
      const a = R(2, 7), b = R(3, 9), c = R(1, 6), d = R(1, 9);
      const ans = [[a + c, v + "²"], [b - d, v]];
      if (b === d) return null;
      return mkEx("KA1", `Simplify ${ex([[a, v + "²"], [b, v], [c, v + "²"], [-d, v]])}`, ans,
        [[[a + c + b - d, v + "²"]], [[a + c, v + "⁴"], [b - d, v]], [[a + c, v + "²"], [b + d, v]], [[a + b + c - d, v]]],
        `${v}² and ${v} are not like terms. ${v}² terms: ${a} + ${c} = ${a + c}. ${v} terms: ${b} ${M} ${d} = ${b - d}.`);
    },
    /* ---------- KA2 expanding brackets ---------- */
    KA2(lv) {
      const v = P(["x", "y", "a", "n"]);
      if (lv === 1) {
        const a = R(2, 9), b = R(1, 9), s = Math.random() < 0.5 ? 1 : -1;
        return mkEx("KA2", `Expand ${a}(${ex([[1, v], [s * b, ""]])})`, [[a, v], [s * a * b, ""]],
          [[[a, v], [s * b, ""]], [[1, v], [s * a * b, ""]], [[a, v], [-s * a * b, ""]], [[a, v], [s * (a + b), ""]]],
          `Multiply everything inside by ${a}: ${a} × ${v} = ${a}${v} and ${a} × ${s < 0 ? M : ""}${b} = ${s < 0 ? M : ""}${a * b}.`);
      }
      if (lv === 2) {
        if (Math.random() < 0.5) {
          const a = R(2, 6), b = R(2, 5), c = R(1, 9);
          return mkEx("KA2", `Expand ${a}(${ex([[b, v], [-c, ""]])})`, [[a * b, v], [-a * c, ""]],
            [[[a * b, v], [-c, ""]], [[a * b, v], [a * c, ""]], [[a + b, v], [-a * c, ""]], [[b, v], [-a * c, ""]]],
            `${a} × ${b}${v} = ${a * b}${v} and ${a} × ${M}${c} = ${M}${a * c}.`);
        }
        const a = R(2, 9), b = R(1, 9);
        return mkEx("KA2", `Expand ${M}${a}(${ex([[1, v], [-b, ""]])})`, [[-a, v], [a * b, ""]],
          [[[-a, v], [-a * b, ""]], [[a, v], [-a * b, ""]], [[-a, v], [-b, ""]], [[-a, v], [b, ""]]],
          `${M}${a} × ${v} = ${M}${a}${v}, and ${M}${a} × ${M}${b} = +${a * b}: a negative times a negative is positive.`);
      }
      if (Math.random() < 0.4) {
        const b = R(2, 9);
        return mkEx("KA2", `Expand ${v}(${v} + ${b})`, [[1, v + "²"], [b, v]],
          [[[2, v], [b, ""]], [[1, v + "²"], [b, ""]], [[1 + b, v + "²"]], [[1, v + "²"], [b, v + "²"]]],
          `${v} × ${v} = ${v}² and ${v} × ${b} = ${b}${v}.`);
      }
      const a = R(2, 5), b = R(1, 6), c = R(2, 5), d = R(1, 6);
      if (a * b === c * d) return null;
      const k = a * b - c * d;
      return mkEx("KA2", `Expand and simplify ${a}(${v} + ${b}) + ${c}(${v} ${M} ${d})`, [[a + c, v], [k, ""]],
        [[[a + c, v], [a * b + c * d, ""]], [[a + c, v], [b - d, ""]], [[a + c, v], [a * b - d, ""]], [[a * c, v], [k, ""]]],
        `${a}${v} + ${a * b} + ${c}${v} ${M} ${c * d} = ${ex([[a + c, v], [k, ""]])}.`);
    },
    /* ---------- KR1 percentages ---------- */
    KR1(lv) {
      if (lv === 1) {
        const p = P([10, 20, 25, 50, 5, 75, 30]), base = { 10: 10, 20: 5, 25: 4, 50: 2, 5: 20, 75: 4, 30: 10 }[p];
        const N = base * R(2, 18), ans = N * p / 100;
        return mk("KR1", `Work out ${p}% of ${N}`, dec(ans), ans,
          [[dec(N - ans), N - ans], [dec(ans * 10), ans * 10], [dec(ans / 10), ans / 10], [dec(ans + p), ans + p]],
          p === 10 ? `10% means divide by 10: ${N} ÷ 10 = ${dec(ans)}.` : p === 50 ? `50% is a half: ${N} ÷ 2 = ${dec(ans)}.` : p === 25 ? `25% is a quarter: ${N} ÷ 4 = ${dec(ans)}.`
          : `${p}% = ${p}/100, so ${N} × ${p} ÷ 100 = ${dec(ans)}.`);
      }
      if (lv === 2) {
        const p = P([10, 20, 5, 15, 25, 40]), N = 20 * R(2, 20), up = Math.random() < 0.5, ch = N * p / 100, ans = up ? N + ch : N - ch;
        const thing = P([["A coat costs £", "", up ? "The price goes up by" : "It is reduced by"], ["A bag of rice weighs ", " g", up ? "It is made bigger by" : "It is made smaller by"]]);
        return mk("KR1", `${thing[0]}${N}${thing[1]}. ${thing[2]} ${p}%. What is the new ${thing[1] ? "weight" : "price"}?`, `${!thing[1] ? "£" : ""}${dec(ans)}${thing[1]}`, ans,
          [[up ? N - ch : N + ch, null], [ch, null], [up ? N + p : N - p, up ? N + p : N - p], [up ? N + ch * 10 : N - ch / 10, null]]
            .map(([v, x]) => [`${!thing[1] ? "£" : ""}${dec(v)}${thing[1]}`, v]),
          `${p}% of ${N} = ${dec(ch)}. ${up ? `${N} + ${dec(ch)}` : `${N} ${M} ${dec(ch)}`} = ${dec(ans)}.`);
      }
      if (Math.random() < 0.5) {
        const p = P([3, 7, 12, 15, 35, 4, 65]), up = Math.random() < 0.5, m = up ? 1 + p / 100 : 1 - p / 100;
        return mk("KR1", `Which single multiplier ${up ? "increases" : "decreases"} an amount by ${p}%?`, dec(m), m,
          [[dec(p / 100), p / 100], [dec(up ? 1 - p / 100 : 1 + p / 100), up ? 1 - p / 100 : 1 + p / 100], [dec(p / 10), p / 10], [dec(p), p]],
          `${up ? `100% + ${p}%` : `100% ${M} ${p}%`} = ${dec(m * 100)}% = ${dec(m)}.`);
      }
      const [a, b] = P([[9, 12], [18, 24], [12, 15], [7, 20], [6, 8], [21, 30], [13, 20], [27, 36], [3, 5], [17, 25]]), k = P([1, 2, 3]);
      const A = a * k, B = b * k, ans = 100 * a / b;
      return mk("KR1", `A student scores ${A} out of ${B}. What percentage is that?`, dec(ans) + "%", ans,
        [[dec(100 * b / a, 1).replace(/\.0$/, "") + "%", 100 * b / a], [dec(B - A) + "%", B - A], [dec(A) + "%", A], [dec(100 - ans) + "%", 100 - ans]],
        `${A} ÷ ${B} = ${dec(a / b)}, and × 100 gives ${dec(ans)}%.`);
    },
    /* ---------- KR2 ratio ---------- */
    KR2(lv) {
      const pr = () => { let p, q; do { p = R(1, 7); q = R(1, 7); } while (p === q || gcd(p, q) !== 1); return [p, q]; };
      if (lv === 1) {
        const [p, q] = pr(), k = R(2, 9);
        const f = [2, 3, 4].find(f => k % f === 0 && f < k), part = f ? [`${p * k / f} : ${q * k / f}`, null] : [`${p * k} : ${q}`, null];
        return mk("KR2", `Write ${p * k} : ${q * k} in its simplest form`, `${p} : ${q}`, p / q,
          [[`${q} : ${p}`, q / p], part, [`${p + 1} : ${q + 1}`, (p + 1) / (q + 1)], [`${p * k - 1} : ${q * k - 1}`, (p * k - 1) / (q * k - 1)]],
          `Divide both by ${k}, the highest common factor: ${p * k} ÷ ${k} = ${p} and ${q * k} ÷ ${k} = ${q}.`);
      }
      if (lv === 2) {
        const [p, q] = pr(), k = R(2, 12), N = (p + q) * k, big = p > q, who = P(["Ali", "Bea", "Cal", "Dev", "Eve", "Finn"]);
        const ans = p * k;
        return mk("KR2", `£${N} is shared between ${who} and Jo in the ratio ${p} : ${q}. How much does ${who} get?`, "£" + ans, ans,
          [["£" + q * k, q * k], ["£" + dec(N / 2), N / 2], ["£" + dec(N / p), N / p], ["£" + dec(N * p / q), N * p / q], ["£" + (k), k]],
          `${p} + ${q} = ${p + q} parts. One part is £${N} ÷ ${p + q} = £${k}, so ${who} gets ${p} × £${k} = £${ans}.`);
      }
      const [p, q] = pr(), k = R(3, 12), A = p * k, ans = q * k;
      return mk("KR2", `The ratio of boys to girls in a club is ${p} : ${q}. There are ${A} boys. How many girls are there?`, String(ans), ans,
        [[String(A + q - p), A + q - p], [String(A * q), A * q], [String(A + ans), A + ans], [String(k), k], [String(Math.round(A / q) || A + 1), null]],
        `${A} boys is ${p} parts, so one part is ${A} ÷ ${p} = ${k}. Girls: ${q} × ${k} = ${ans}.`);
    },
    /* ---------- KN1 fractions and mixed numbers ---------- */
    KN1(lv) {
      if (lv === 1) {
        if (Math.random() < 0.5) {
          const d = R(3, 9), w = R(1, 5), r = R(1, d - 1), n = w * d + r;
          if (gcd(r, d) !== 1) return null;
          return mk("KN1", `Write ${n}/${d} as a mixed number`, `${w} ${r}/${d}`, n / d,
            [[`${r} ${w}/${d}`, (r * d + w) / d], [`${w} ${n - w * d + 1}/${d}`, null], [`${w + 1} ${r}/${d}`, w + 1 + r / d], [`${w} ${d}/${r}`, w + d / r], [`${w} ${r}/${n}`, w + r / n]].filter(([t]) => !/ (\d+)\/\1$/.test(t)),
            `${d} goes into ${n} ${w} times (${w * d}) with ${r} left over: ${w} ${r}/${d}.`);
        }
        const d = R(5, 12), a = R(1, d - 2), b = R(1, d - 1 - a), s = fr(a + b, d);
        if (gcd(a, d) !== 1 || gcd(b, d) !== 1) return null;
        return mk("KN1", `Work out ${a}/${d} + ${b}/${d}`, fs(s), (a + b) / d,
          [[`${a + b}/${2 * d}`, (a + b) / (2 * d)], [`${a * b}/${d}`, a * b / d], [`${a + b + 1}/${d}`, (a + b + 1) / d], [`${Math.abs(a - b) || a + 2}/${d}`, (Math.abs(a - b) || a + 2) / d]],
          `The denominators are the same, so add the numerators: ${a} + ${b} = ${a + b}${fs(s) !== `${a + b}/${d}` ? `, and ${a + b}/${d} = ${fs(s)}` : ""}. The denominator stays ${d}.`);
      }
      if (lv === 2) {
        const pairs = [[2, 3], [3, 4], [2, 5], [3, 5], [4, 5], [2, 7], [3, 8], [5, 6], [4, 3], [6, 4]];
        const [b, d] = P(pairs), a = R(1, b - 1 || 1), c = R(1, d - 1 || 1); if (gcd(a, b) !== 1 || gcd(c, d) !== 1) return null; const sub = Math.random() < 0.4 && a * d > c * b;
        const val = sub ? a / b - c / d : a / b + c / d, s = fr(sub ? a * d - c * b : a * d + c * b, b * d);
        const op = sub ? M : "+";
        return mk("KN1", `Work out ${a}/${b} ${op} ${c}/${d}`, fs(s), val,
          [[`${sub ? a - c : a + c}/${b + d}`, (sub ? a - c : a + c) / (b + d)], [`${sub ? a - c : a + c}/${b * d}`, (sub ? a - c : a + c) / (b * d)], [fs(fr(sub ? a * d - c * b + b : a * d + c * b + 1, b * d)), null], [fs(fr(a * c, b * d)), a * c / (b * d)]].filter(([t]) => !/^-|^0\/|\/0$/.test(t)),
          `Use a common denominator of ${b * d}: ${a * d}/${b * d} ${op} ${c * b}/${b * d} = ${sub ? a * d - c * b : a * d + c * b}/${b * d}${fs(s) !== `${sub ? a * d - c * b : a * d + c * b}/${b * d}` ? ` = ${fs(s)}` : ""}.`);
      }
      const kind = P(["add", "mul", "div"]);
      if (kind === "add") {
        const w1 = R(1, 3), w2 = R(1, 3), [b, d] = P([[2, 3], [2, 4], [3, 4], [2, 5], [4, 3], [3, 6]]), a = R(1, b - 1), c = R(1, d - 1);
        if (gcd(a, b) !== 1 || gcd(c, d) !== 1) return null;
        const n = (w1 * b + a) * d + (w2 * d + c) * b, s = fr(n, b * d), val = n / (b * d);
        return mk("KN1", `Work out ${w1} ${a}/${b} + ${w2} ${c}/${d}`, mixed(s), val,
          [[`${w1 + w2} ${a + c}/${b + d}`, w1 + w2 + (a + c) / (b + d)], [mixed(fr(n - b * d, b * d)), val - 1], [mixed(fr(n + b * d, b * d)), val + 1], [`${w1 * w2} ${fs(fr(a * c, b * d))}`, null]],
          `Add the whole numbers: ${w1} + ${w2} = ${w1 + w2}. Then ${a}/${b} + ${c}/${d} = ${fs(fr(a * d + c * b, b * d))}. Together: ${mixed(s)}.`);
      }
      const a = R(1, 5), b = R(2, 7), c = R(1, 5), d = R(2, 7);
      if (gcd(a, b) !== 1 || gcd(c, d) !== 1 || a >= b || c >= d) return null;
      if (kind === "mul") {
        const s = fr(a * c, b * d);
        return mk("KN1", `Work out ${a}/${b} × ${c}/${d}`, fs(s), a * c / (b * d),
          [[fs(fr(a * d + c * b, b * d)), (a * d + c * b) / (b * d)], [fs(fr(a * d, b * c)), a * d / (b * c)], [`${a * c}/${b + d}`, a * c / (b + d)], [`${a + c}/${b + d}`, (a + c) / (b + d)]],
          `Multiply the tops and multiply the bottoms: ${a} × ${c} = ${a * c}, ${b} × ${d} = ${b * d}${fs(s) !== `${a * c}/${b * d}` ? `, and ${a * c}/${b * d} = ${fs(s)}` : ""}.`);
      }
      const s = fr(a * d, b * c);
      return mk("KN1", `Work out ${a}/${b} ÷ ${c}/${d}`, s[1] === 1 ? String(s[0]) : (s[0] > s[1] ? mixed(s) : fs(s)), a * d / (b * c),
        [[fs(fr(a * c, b * d)), a * c / (b * d)], [fs(fr(b * c, a * d)), b * c / (a * d)], [`${a * d}/${b + c}`, a * d / (b + c)], [fs(fr(a * d - 1 > 0 ? a * d - 1 : a * d + 1, b * c)), null]].map(([t, v]) => { const m = t.match(/^(\d+)\/(\d+)$/); return [m && +m[1] > +m[2] ? mixed([+m[1], +m[2]]) : t, v]; }),
        `Keep, change, flip: ${a}/${b} × ${d}/${c} = ${a * d}/${b * c}${fs(s) !== `${a * d}/${b * c}` ? ` = ${fs(s)}` : ""}.`);
    },
    /* ---------- KN2 ordering fractions ---------- */
    KN2(lv) {
      if (lv === 1) {
        if (Math.random() < 0.5) {
          const ds = []; while (ds.length < 4) { const d = R(2, 12); if (!ds.includes(d)) ds.push(d); }
          const big = Math.random() < 0.5, ans = big ? Math.min(...ds) : Math.max(...ds);
          return mk("KN2", `Which is the ${big ? "largest" : "smallest"}: ${ds.map(d => "1/" + d).join(", ")}?`, `1/${ans}`, 1 / ans, ds.filter(d => d !== ans).map(d => [`1/${d}`, 1 / d]),
            `With 1 on top, ${big ? "the smaller the denominator, the bigger the fraction" : "the bigger the denominator, the smaller the fraction"}: 1/${ans}.`);
        }
        const d = R(7, 15), ns = []; while (ns.length < 4) { const n = R(1, d - 1); if (!ns.includes(n)) ns.push(n); }
        const ans = Math.max(...ns);
        return mk("KN2", `Which is the largest: ${ns.map(n => n + "/" + d).join(", ")}?`, `${ans}/${d}`, ans / d, ns.filter(n => n !== ans).map(n => [`${n}/${d}`, n / d]),
          `The denominators are all ${d}, so the biggest numerator wins: ${ans}/${d}.`);
      }
      const pool = [[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [2, 5], [3, 5], [4, 5], [5, 6], [3, 8], [5, 8], [7, 10], [3, 10], [7, 12], [5, 12], [4, 9]];
      const fs4 = []; let g = 0;
      while (fs4.length < (lv === 2 ? 4 : 3) && g++ < 50) { const f = P(pool); if (!fs4.some(h => Math.abs(h[0] / h[1] - f[0] / f[1]) < 1e-9)) fs4.push(f); }
      if (lv === 2) {
        const big = Math.random() < 0.5, ans = fs4.reduce((m, f) => ((big ? f[0] / f[1] > m[0] / m[1] : f[0] / f[1] < m[0] / m[1]) ? f : m));
        return mk("KN2", `Which fraction is the ${big ? "largest" : "smallest"}: ${fs4.map(fs).join(", ")}?`, fs(ans), ans[0] / ans[1], fs4.filter(f => f !== ans).map(f => [fs(f), f[0] / f[1]]),
          `As decimals: ${fs4.map(f => `${fs(f)} = ${dec(f[0] / f[1], 2)}`).join(", ")}. So ${fs(ans)} is the ${big ? "largest" : "smallest"}.`);
      }
      /* lv 3: put a fraction, a decimal and a percentage in order */
      const vals = fs4.map(f => f[0] / f[1]);
      const shown = [fs(fs4[0]), dec(vals[1], 3).replace(/0+$/, "").replace(/\.$/, ""), dec(vals[2] * 100, 1).replace(/\.0$/, "") + "%"];
      if (shown.some((s, i) => i > 0 && Math.abs(parseFloat(s) / (i === 2 ? 100 : 1) - vals[i]) > 1e-9)) return null;
      const idx = [0, 1, 2].sort((x, y) => vals[x] - vals[y]), list = o => o.map(i => shown[i]).join(", ");
      const perms = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]].filter(o => o.join() !== idx.join());
      return mk("KN2", `Which list puts ${shown.join(", ")} in order, smallest first?`, list(idx), 0, perms.map(o => [list(o), null]),
        `Change them all to decimals: ${shown.map((s, i) => `${s} = ${dec(vals[i], 3)}`).join(", ")}.`);
    },
    /* ---------- KN3 decimals and rounding ---------- */
    KN3(lv) {
      if (lv === 1) {
        if (Math.random() < 0.5) {
          let x; do { x = R(100, 9999) / 100; } while (Math.round(x * 100) % 10 === 0);
          const ans = Math.round(x * 10) / 10, tr = Math.floor(x * 10) / 10, up = Math.ceil(x * 10) / 10;
          return mk("KN3", `Round ${dec(x, 2)} to 1 decimal place`, dec(ans, 1), ans,
            [[dec(ans === tr ? up : tr, 1), ans === tr ? up : tr], [dec(Math.round(x), 0), Math.round(x)], [dec(x, 2), x], [dec(Math.round(x * 100) / 100 + 0.1 * (ans === tr ? -1 : 1), 1), null]].filter(([t]) => t !== dec(ans, 1)),
            `Look at the second decimal place: ${Math.round(x * 100) % 10}. ${Math.round(x * 100) % 10 >= 5 ? "5 or more, so round up" : "Less than 5, so round down"}: ${dec(ans, 1)}.`);
        }
        const a = R(11, 99) / 10, k = P([10, 100, 1000]), divide = Math.random() < 0.5, ans = divide ? a / k : a * k;
        return mk("KN3", `Work out ${dec(a)} ${divide ? "÷" : "×"} ${k}`, dec(ans), ans,
          [[dec(divide ? a * k : a / k), divide ? a * k : a / k], [dec(divide ? a / (k * 10) : a * k * 10), null], [dec(divide ? a / (k / 10 || 1) : a * k / 10), null], [`${dec(a)}${"0".repeat(String(k).length - 1)}`, null]],
          `${divide ? "Dividing" : "Multiplying"} by ${k} moves every digit ${String(k).length - 1} place${k > 10 ? "s" : ""} to the ${divide ? "right" : "left"}: ${dec(ans)}.`);
      }
      if (lv === 2) {
        if (Math.random() < 0.5) {
          const p = R(2, 9), q = R(2, 9), A = p / 10, B = q / 10, ans = p * q / 100;
          return mk("KN3", `Work out ${dec(A)} × ${dec(B)}`, dec(ans), ans,
            [[dec(p * q / 10), p * q / 10], [dec(p * q / 1000), p * q / 1000], [String(p * q), p * q], [dec(A + B), A + B]],
            `${p} × ${q} = ${p * q}. There are 2 decimal places in the question, so the answer is ${dec(ans)}.`);
        }
        const a = R(12, 98) / 10, b = R(2, 9), ans = Math.round(a * b * 10) / 10;
        return mk("KN3", `Work out ${dec(a)} × ${b}`, dec(ans), ans,
          [[dec(ans * 10), ans * 10], [dec(ans / 10), ans / 10], [dec(Math.floor(a) * b + (Math.round(a * 10) % 10) / 10), null], [dec(a + b), a + b]],
          `${Math.round(a * 10)} × ${b} = ${Math.round(a * 10) * b}, and one decimal place gives ${dec(ans)}.`);
      }
      const k = P(["dp2", "sf1", "div"]);
      if (k === "dp2") {
        let x; do { x = R(1000, 99999) / 1000; } while (Math.round(x * 1000) % 10 === 0);
        const ans = Math.round(x * 100 + 1e-9) / 100, tr = Math.floor(x * 100) / 100, up = Math.ceil(x * 100) / 100;
        return mk("KN3", `Round ${dec(x, 3)} to 2 decimal places`, dec(ans, 2), ans,
          [[dec(ans === tr ? up : tr, 2), null], [dec(Math.round(x * 10) / 10, 1), Math.round(x * 10) / 10], [dec(ans + 0.1, 2), ans + 0.1], [dec(x, 3), x]].filter(([t]) => t !== dec(ans, 2)),
          `Look at the third decimal place: ${Math.round(x * 1000) % 10}. ${Math.round(x * 1000) % 10 >= 5 ? "Round up" : "Round down"}: ${dec(ans, 2)}.`);
      }
      if (k === "sf1") {
        const mag = P([1, 10, 100, 0.1, 0.01]), m = R(11, 99) / 10;
        if (Math.round(m * 10) % 10 === 0) return null;
        const x = m * mag, ans = Math.round(m) * mag, dp = mag >= 1 ? 0 : mag === 0.1 ? 1 : 2, dp2 = dp + 1;
        return mk("KN3", `Round ${dec(x)} to 1 significant figure`, dec(ans), ans,
          [[dec(Math.round(m) * mag * 10), null], [dec(Math.round(m * 10) / 10 * mag), x], [dec(Math.round(m) * mag / 10), null], [dec(Math.round(m) === Math.ceil(m) ? Math.floor(m) * mag : Math.ceil(m) * mag), null]].filter(([t]) => t !== dec(ans)),
          `The first significant figure is ${String(m)[0]}. The next digit is ${String(Math.round(m * 10))[1]}, so round ${Math.round(m) > Math.floor(m) ? "up" : "down"}: ${dec(ans)}.`);
      }
      const b = P([0.2, 0.4, 0.5, 0.3, 0.6, 0.02, 0.05]), ansI = R(2, 30), a = Math.round(ansI * b * 1000) / 1000;
      return mk("KN3", `Work out ${dec(a)} ÷ ${dec(b)}`, String(ansI), ansI,
        [[dec(ansI / 10), ansI / 10], [dec(ansI * 10), ansI * 10], [dec(a * b), a * b], [dec(ansI / 100), ansI / 100]],
        `Multiply both by ${b < 0.1 ? 100 : 10} so you divide by a whole number: ${dec(a * (b < 0.1 ? 100 : 10))} ÷ ${dec(b * (b < 0.1 ? 100 : 10))} = ${ansI}.`);
    }
  };
  const IDS = Object.keys(G);
  function make(strands, lv) {
    const ids = strands && strands.length ? IDS.filter(id => strands.some(s => id.startsWith(s))) : IDS;
    if (!ids.length) return null;
    for (let k = 0; k < 12; k++) { const id = P(ids); try { const q = G[id](lv); if (q) return q; } catch (e) { /* try another */ } }
    return null;
  }
  return { make, IDS, G };
})();
