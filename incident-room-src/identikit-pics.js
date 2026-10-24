/* ================= THE IDENTIKIT: the hidden pictures =================
   Every picture is 600 x 600. Graphs, shapes, solids and catchphrases are drawn here so they stay exact
   and sharp on a projector; the famous mathematicians and scientists are photos in img/identikit/.
   Each picture: id, cat, name (the right answer), options (3 look-alikes), fact, tier, topics (for the
   tile questions; people and catchphrases use the teacher's topics instead). */
const IK = (() => {
  const BG = `<rect width="600" height="600" fill="#0E1636"/>`;
  const CY = "#00FCF1", AM = "#FFC857", PK = "#FF8FB1", WH = "#E9EDFA", MU = "#5B6AA8", GR = "#22305F";
  const M = "−";
  const svg = body => `<svg viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Hidden picture">${BG}${body}</svg>`;

  /* ---------- graphs ---------- */
  function graph(o) {
    const [x0, x1] = o.xr || [-5, 5], [y0, y1] = o.yr || [-5, 5];
    const X = x => 50 + (x - x0) / (x1 - x0) * 500, Y = y => 550 - (y - y0) / (y1 - y0) * 500;
    const xs = o.xstep || 1, ys = o.ystep || 1;
    let g = `<g stroke="${GR}" stroke-width="2">`;
    for (let x = Math.ceil(x0 / xs) * xs; x <= x1 + 1e-9; x += xs) g += `<line x1="${X(x)}" y1="50" x2="${X(x)}" y2="550"/>`;
    for (let y = Math.ceil(y0 / ys) * ys; y <= y1 + 1e-9; y += ys) g += `<line x1="50" y1="${Y(y)}" x2="550" y2="${Y(y)}"/>`;
    g += `</g><g stroke="${WH}" stroke-width="3"><line x1="40" y1="${Y(0)}" x2="562" y2="${Y(0)}"/><line x1="${X(0)}" y1="38" x2="${X(0)}" y2="560"/></g>`;
    g += `<g fill="${WH}" font-family="JetBrains Mono, monospace" font-size="19" font-weight="700"><text x="570" y="${Y(0) + 6}">x</text><text x="${X(0) - 6}" y="30">y</text>`;
    const lab = v => (v < 0 ? M + Math.abs(v) : String(v)) + (o.deg ? "°" : "");
    (o.xlabels || []).forEach(x => { g += `<text x="${X(x)}" y="${Y(0) + 26}" text-anchor="middle" font-size="${o.deg ? 15 : 19}">${lab(x)}</text>`; });
    (o.ylabels || []).forEach(y => { g += `<text x="${X(0) - 10}" y="${Y(y) + 6}" text-anchor="end">${y < 0 ? M + Math.abs(y) : y}</text>`; });
    g += `</g>`;
    const curve = `stroke="${AM}" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"`;
    if (o.vline !== undefined) g += `<line x1="${X(o.vline)}" y1="50" x2="${X(o.vline)}" y2="550" ${curve}/>`;
    else if (o.circle) g += `<circle cx="${X(0)}" cy="${Y(0)}" r="${X(o.circle) - X(0)}" ${curve}/>`;
    else {
      let d = "", prev = null;
      for (let i = 0; i <= 600; i++) {
        const x = x0 + (x1 - x0) * i / 600, y = o.f(x);
        const ok = Number.isFinite(y) && y > y0 - 2 && y < y1 + 2;
        const jump = prev !== null && Math.abs(y - prev) > (y1 - y0);
        if (!ok || jump) { prev = ok ? y : null; if (ok) d += `M${X(x).toFixed(1)} ${Y(y).toFixed(1)}`; continue; }
        d += (prev === null ? "M" : "L") + `${X(x).toFixed(1)} ${Y(y).toFixed(1)}`; prev = y;
      }
      g += `<clipPath id="gc"><rect x="50" y="50" width="500" height="500"/></clipPath><path d="${d}" ${curve} clip-path="url(#gc)"/>`;
    }
    return svg(g);
  }
  const L5 = [-4, -3, -2, -1, 1, 2, 3, 4];
  const G = (o) => graph(Object.assign({ xlabels: L5, ylabels: L5 }, o));
  const TRIG = { xr: [-360, 360], yr: [-2, 2], xstep: 90, ystep: 0.5, deg: true, xlabels: [-360, -180, 180, 360], ylabels: [-1, 1] };

  /* ---------- flat shapes ---------- */
  const P = pts => pts.map(p => p.join(",")).join(" ");
  const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const unit = (a, b) => { const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy); return [dx / l, dy / l]; };
  function ticks(a, b, n) { const [ux, uy] = unit(a, b), [mx, my] = mid(a, b), nx = -uy, ny = ux; let s = "";
    for (let i = 0; i < n; i++) { const o = (i - (n - 1) / 2) * 11, cx = mx + ux * o, cy = my + uy * o; s += `<line x1="${cx - nx * 14}" y1="${cy - ny * 14}" x2="${cx + nx * 14}" y2="${cy + ny * 14}"/>`; }
    return `<g stroke="${WH}" stroke-width="4" stroke-linecap="round">${s}</g>`; }
  function arrows(a, b, n) { const [ux, uy] = unit(a, b), [mx, my] = mid(a, b), nx = -uy, ny = ux; let s = "";
    for (let i = 0; i < n; i++) { const o = (i - (n - 1) / 2) * 14, cx = mx + ux * o, cy = my + uy * o;
      s += `<polyline points="${cx - ux * 12 + nx * 11},${cy - uy * 12 + ny * 11} ${cx},${cy} ${cx - ux * 12 - nx * 11},${cy - uy * 12 - ny * 11}"/>`; }
    return `<g stroke="${WH}" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round">${s}</g>`; }
  const rightAngle = (v, a, b, s = 30) => { const [ax, ay] = unit(v, a), [bx, by] = unit(v, b);
    return `<polyline points="${v[0] + ax * s},${v[1] + ay * s} ${v[0] + ax * s + bx * s},${v[1] + ay * s + by * s} ${v[0] + bx * s},${v[1] + by * s}" fill="none" stroke="${WH}" stroke-width="4"/>`; };
  const shape = (pts, extra = "") => svg(`<polygon points="${P(pts)}" fill="rgba(0,252,241,.13)" stroke="${CY}" stroke-width="6" stroke-linejoin="round"/>${extra}`);
  const regular = (n, r = 215, cx = 300, cy = 315) => { const pts = []; for (let i = 0; i < n; i++) { const t = Math.PI / 2 + Math.PI / n + i * 2 * Math.PI / n; pts.push([cx + r * Math.cos(t), cy + r * Math.sin(t)]); } return pts; };
  const allTicks = (pts, n = 1) => pts.map((p, i) => ticks(p, pts[(i + 1) % pts.length], n)).join("");
  const arcPt = (t, r = 210, c = [300, 300]) => [c[0] + r * Math.cos(t * Math.PI / 180), c[1] - r * Math.sin(t * Math.PI / 180)];
  const circleBase = `<circle cx="300" cy="300" r="210" fill="rgba(0,252,241,.08)" stroke="${CY}" stroke-width="6"/><circle cx="300" cy="300" r="6" fill="${WH}"/>`;

  /* ---------- solids: polyhedra in oblique projection, hidden edges dashed ---------- */
  const KX = 0.5, KY = 0.36;
  function poly3(V, F, o = {}) {
    const ox = o.ox || 150, oy = o.oy || 470;
    const pr = ([x, y, z]) => [ox + x + KX * z, oy - y - KY * z];
    const c = V.reduce((s, v) => [s[0] + v[0] / V.length, s[1] + v[1] / V.length, s[2] + v[2] / V.length], [0, 0, 0]);
    const vis = F.map(f => {
      const [a, b, d] = [V[f[0]], V[f[1]], V[f[2]]];
      const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], w = [d[0] - a[0], d[1] - a[1], d[2] - a[2]];
      let n = [u[1] * w[2] - u[2] * w[1], u[2] * w[0] - u[0] * w[2], u[0] * w[1] - u[1] * w[0]];
      const fc = f.reduce((s, i) => [s[0] + V[i][0] / f.length, s[1] + V[i][1] / f.length, s[2] + V[i][2] / f.length], [0, 0, 0]);
      if (n[0] * (fc[0] - c[0]) + n[1] * (fc[1] - c[1]) + n[2] * (fc[2] - c[2]) < 0) n = n.map(x => -x);
      return n[0] * -KX + n[1] * -KY + n[2] * 1 < 0;          // facing the viewer
    });
    const edges = new Map();
    F.forEach((f, fi) => f.forEach((v, i) => { const a = v, b = f[(i + 1) % f.length], k = a < b ? a + "-" + b : b + "-" + a; edges.set(k, (edges.get(k) || false) || vis[fi]); }));
    let g = "";
    F.forEach((f, fi) => { if (vis[fi]) g += `<polygon points="${P(f.map(i => pr(V[i])))}" fill="${fi === (o.shade ?? -1) ? "rgba(255,200,87,.22)" : "rgba(0,252,241,.12)"}" stroke="none"/>`; });
    edges.forEach((seen, k) => { const [a, b] = k.split("-").map(Number), p = pr(V[a]), q = pr(V[b]);
      g += `<line x1="${p[0]}" y1="${p[1]}" x2="${q[0]}" y2="${q[1]}" stroke="${CY}" stroke-width="${seen ? 6 : 3.5}" ${seen ? "" : `stroke-dasharray="14 10" opacity=".75"`} stroke-linecap="round"/>`; });
    return svg(g);
  }
  const box = (w, h, d) => poly3([[0, 0, 0], [w, 0, 0], [w, h, 0], [0, h, 0], [0, 0, d], [w, 0, d], [w, h, d], [0, h, d]],
    [[0, 1, 2, 3], [4, 5, 6, 7], [0, 1, 5, 4], [3, 2, 6, 7], [0, 3, 7, 4], [1, 2, 6, 5]], { ox: 300 - (w + KX * d) / 2, oy: 300 + (h + KY * d) / 2 });
  const prism = (base, d, o) => { const n = base.length, V = base.map(([x, y]) => [x, y, 0]).concat(base.map(([x, y]) => [x, y, d]));
    const F = [[...Array(n).keys()], [...Array(n).keys()].map(i => i + n)]; for (let i = 0; i < n; i++) F.push([i, (i + 1) % n, (i + 1) % n + n, i + n]); return poly3(V, F, o); };
  const pyramid = (base, apex, o) => { const n = base.length, V = base.concat([apex]); const F = [[...Array(n).keys()]]; for (let i = 0; i < n; i++) F.push([i, (i + 1) % n, n]); return poly3(V, F, o); };
  /* round solids, drawn with ellipses */
  const ell = (cx, cy, rx, ry, half) => half === "front" ? `<path d="M${cx - rx} ${cy}A${rx} ${ry} 0 0 0 ${cx + rx} ${cy}" fill="none" stroke="${CY}" stroke-width="6"/>`
    : half === "back" ? `<path d="M${cx - rx} ${cy}A${rx} ${ry} 0 0 1 ${cx + rx} ${cy}" fill="none" stroke="${CY}" stroke-width="3.5" stroke-dasharray="14 10" opacity=".75"/>`
    : `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="rgba(0,252,241,.12)" stroke="${CY}" stroke-width="6"/>`;
  const FILL = "rgba(0,252,241,.12)";

  /* ---------- catchphrases ---------- */
  const face = (cx, cy, mood) => mood === "cute"
    ? `<circle cx="${cx - 26}" cy="${cy}" r="14" fill="${WH}"/><circle cx="${cx + 26}" cy="${cy}" r="14" fill="${WH}"/><circle cx="${cx - 22}" cy="${cy + 2}" r="7" fill="#0B122C"/><circle cx="${cx + 30}" cy="${cy + 2}" r="7" fill="#0B122C"/>
       <path d="M${cx - 18} ${cy + 30}q18 16 36 0" stroke="${WH}" stroke-width="5" fill="none" stroke-linecap="round"/><ellipse cx="${cx - 46}" cy="${cy + 24}" rx="10" ry="6" fill="${PK}" opacity=".8"/><ellipse cx="${cx + 46}" cy="${cy + 24}" rx="10" ry="6" fill="${PK}" opacity=".8"/>`
    : `<path d="M${cx - 50} ${cy - 22}l36 14M${cx + 50} ${cy - 22}l-36 14" stroke="#0B122C" stroke-width="9" stroke-linecap="round"/><circle cx="${cx - 26}" cy="${cy + 6}" r="8" fill="#0B122C"/><circle cx="${cx + 26}" cy="${cy + 6}" r="8" fill="#0B122C"/>
       <rect x="${cx - 30}" y="${cy + 34}" width="60" height="20" rx="4" fill="${WH}" stroke="#0B122C" stroke-width="4"/><path d="M${cx - 15} ${cy + 34}v20M${cx} ${cy + 34}v20M${cx + 15} ${cy + 34}v20" stroke="#0B122C" stroke-width="3"/>`;
  const heart = (x, y, s = 1, c = PK) => `<path transform="translate(${x},${y}) scale(${s})" d="M0 10C-14 0-22-8-14-16-8-21 0-17 0-11 0-17 8-21 14-16 22-8 14 0 0 10z" fill="${c}"/>`;

  const PICS = [
    /* GRAPHS */
    { id: "g-yx", cat: "graphs", name: "y = x", options: ["y = " + M + "x", "y = 2x", "y = x + 1"], tier: "F", topics: ["A9"], fact: "y = x goes through the origin with gradient 1: every point has the same x and y coordinate.", draw: () => G({ f: x => x }) },
    { id: "g-ynx", cat: "graphs", name: "y = " + M + "x", options: ["y = x", "y = " + M + "2x", "y = 1 " + M + " x"], tier: "F", topics: ["A9"], fact: "y = " + M + "x goes through the origin with gradient " + M + "1, sloping down from left to right.", draw: () => G({ f: x => -x }) },
    { id: "g-2x1", cat: "graphs", name: "y = 2x + 1", options: ["y = x + 2", "y = " + M + "2x + 1", "y = 2x " + M + " 1"], tier: "F", topics: ["A9"], fact: "y = 2x + 1 has gradient 2 and crosses the y-axis at (0, 1).", draw: () => G({ f: x => 2 * x + 1 }) },
    { id: "g-n2x3", cat: "graphs", name: "y = " + M + "2x + 3", options: ["y = 2x + 3", "y = " + M + "2x " + M + " 3", "y = " + M + "3x + 2"], tier: "F", topics: ["A9"], fact: "y = " + M + "2x + 3 has gradient " + M + "2 and crosses the y-axis at (0, 3).", draw: () => G({ f: x => -2 * x + 3 }) },
    { id: "g-y3", cat: "graphs", name: "y = 3", options: ["x = 3", "y = " + M + "3", "y = 3x"], tier: "F", topics: ["A9"], fact: "y = 3 is a horizontal line: every point on it has y-coordinate 3.", draw: () => G({ f: () => 3 }) },
    { id: "g-xn2", cat: "graphs", name: "x = " + M + "2", options: ["y = " + M + "2", "x = 2", "y = " + M + "2x"], tier: "F", topics: ["A9"], fact: "x = " + M + "2 is a vertical line: every point on it has x-coordinate " + M + "2.", draw: () => G({ vline: -2 }) },
    { id: "g-x2", cat: "graphs", name: "y = x²", options: ["y = " + M + "x²", "y = x² + 2", "y = 2x"], tier: "F", topics: ["A10"], fact: "y = x² is a U-shaped parabola with its turning point (a minimum) at the origin.", draw: () => G({ f: x => x * x }) },
    { id: "g-nx24", cat: "graphs", name: "y = " + M + "x² + 4", options: ["y = x² + 4", "y = x² " + M + " 4", "y = " + M + "x² " + M + " 4"], tier: "F", topics: ["A10"], fact: "y = " + M + "x² + 4 is an upside-down parabola with its maximum at (0, 4). It crosses the x-axis at " + M + "2 and 2.", draw: () => G({ f: x => 4 - x * x }) },
    { id: "g-x2m4", cat: "graphs", name: "y = x² " + M + " 4", options: ["y = x² + 4", "y = (x " + M + " 4)²", "y = " + M + "x² + 4"], tier: "F", topics: ["A10"], fact: "y = x² " + M + " 4 is y = x² moved down 4. Its minimum is (0, " + M + "4) and its roots are " + M + "2 and 2.", draw: () => G({ f: x => x * x - 4 }) },
    { id: "g-xm2sq", cat: "graphs", name: "y = (x " + M + " 2)²", options: ["y = (x + 2)²", "y = x² " + M + " 2", "y = x² + 2"], tier: "H", topics: ["A10", "A22"], fact: "y = (x " + M + " 2)² is y = x² moved 2 to the right. Its turning point is (2, 0).", draw: () => G({ f: x => (x - 2) ** 2 }) },
    { id: "g-x3", cat: "graphs", name: "y = x³", options: ["y = " + M + "x³", "y = x²", "y = 1/x"], tier: "F", topics: ["A18"], fact: "y = x³ is a cubic: it rises from bottom left to top right and flattens through the origin.", draw: () => G({ f: x => x ** 3 }) },
    { id: "g-nx3", cat: "graphs", name: "y = " + M + "x³", options: ["y = x³", "y = " + M + "x²", "y = " + M + "1/x"], tier: "F", topics: ["A18"], fact: "y = " + M + "x³ is a cubic that falls from top left to bottom right.", draw: () => G({ f: x => -(x ** 3) }) },
    { id: "g-recip", cat: "graphs", name: "y = 1/x", options: ["y = " + M + "1/x", "y = x³", "y = x"], tier: "F", topics: ["A18"], fact: "y = 1/x is a reciprocal graph: two curves that never touch either axis (the axes are asymptotes).", draw: () => G({ f: x => 1 / x }) },
    { id: "g-exp", cat: "graphs", name: "y = 2ˣ", options: ["y = (½)ˣ", "y = x²", "y = 2x"], tier: "H", topics: ["A18"], fact: "y = 2ˣ is exponential growth: it crosses the y-axis at (0, 1) and doubles every step to the right.", draw: () => G({ f: x => 2 ** x }) },
    { id: "g-circ", cat: "graphs", name: "x² + y² = 9", options: ["x² + y² = 3", "x² + y² = 81", "x + y = 9"], tier: "H", topics: ["A19"], fact: "x² + y² = 9 is a circle centred on the origin with radius 3 (because 3² = 9).", draw: () => G({ circle: 3 }) },
    { id: "g-sin", cat: "graphs", name: "y = sin x", options: ["y = cos x", "y = tan x", "y = " + M + "sin x"], tier: "H", topics: ["A18", "G10"], fact: "y = sin x goes through (0, 0), peaks at 1 when x = 90° and repeats every 360°.", draw: () => graph(Object.assign({ f: x => Math.sin(x * Math.PI / 180) }, TRIG)) },
    { id: "g-cos", cat: "graphs", name: "y = cos x", options: ["y = sin x", "y = tan x", "y = " + M + "cos x"], tier: "H", topics: ["A18", "G10"], fact: "y = cos x starts at (0, 1), crosses the x-axis at 90° and repeats every 360°.", draw: () => graph(Object.assign({ f: x => Math.cos(x * Math.PI / 180) }, TRIG)) },
    { id: "g-tan", cat: "graphs", name: "y = tan x", options: ["y = sin x", "y = cos x", "y = 1/x"], tier: "H", topics: ["A18", "G10"], fact: "y = tan x repeats every 180° and has asymptotes at 90°, 270° and so on, where it is undefined.", draw: () => graph(Object.assign({ f: x => Math.tan(x * Math.PI / 180) }, TRIG, { yr: [-4, 4], ystep: 1, ylabels: [-2, 2] })) },

    /* FLAT SHAPES */
    { id: "s-equi", cat: "shapes", name: "Equilateral triangle", options: ["Isosceles triangle", "Scalene triangle", "Right-angled triangle"], tier: "F", topics: ["G3", "G1"], fact: "An equilateral triangle has 3 equal sides and 3 equal angles of 60°.", draw: () => { const p = [[150, 470], [450, 470], [300, 210]]; return shape(p, allTicks(p)); } },
    { id: "s-isos", cat: "shapes", name: "Isosceles triangle", options: ["Equilateral triangle", "Scalene triangle", "Right-angled triangle"], tier: "F", topics: ["G3", "G1"], fact: "An isosceles triangle has 2 equal sides, and the 2 angles opposite them are equal.", draw: () => { const p = [[200, 490], [400, 490], [300, 110]]; return shape(p, ticks(p[0], p[2], 1) + ticks(p[1], p[2], 1)); } },
    { id: "s-scal", cat: "shapes", name: "Scalene triangle", options: ["Isosceles triangle", "Equilateral triangle", "Right-angled triangle"], tier: "F", topics: ["G3", "G1"], fact: "A scalene triangle has no equal sides and no equal angles. Different numbers of dashes show the sides are all different.", draw: () => { const p = [[100, 470], [510, 490], [220, 150]]; return shape(p, ticks(p[0], p[1], 1) + ticks(p[1], p[2], 2) + ticks(p[2], p[0], 3)); } },
    { id: "s-right", cat: "shapes", name: "Right-angled triangle", options: ["Isosceles triangle", "Equilateral triangle", "Scalene triangle"], tier: "F", topics: ["G3", "G9"], fact: "A right-angled triangle has one 90° angle, shown by the small square. Its longest side is the hypotenuse.", draw: () => { const p = [[150, 470], [470, 470], [150, 220]]; return shape(p, rightAngle(p[0], p[1], p[2])); } },
    { id: "s-para", cat: "shapes", name: "Parallelogram", options: ["Rhombus", "Trapezium", "Rectangle"], tier: "F", topics: ["G3", "G4"], fact: "A parallelogram has two pairs of parallel sides (shown by the arrows). Opposite sides and opposite angles are equal.", draw: () => { const p = [[100, 430], [390, 430], [500, 190], [210, 190]]; return shape(p, arrows(p[0], p[1], 1) + arrows(p[3], p[2], 1) + arrows(p[0], p[3], 2) + arrows(p[1], p[2], 2)); } },
    { id: "s-rhom", cat: "shapes", name: "Rhombus", options: ["Square", "Parallelogram", "Kite"], tier: "F", topics: ["G3"], fact: "A rhombus has 4 equal sides and two pairs of parallel sides. Its diagonals cross at right angles.", draw: () => { const p = [[130, 420], [380, 420], [505, 203.5], [255, 203.5]]; return shape(p, allTicks(p) + arrows(p[0], p[1], 1) + arrows(p[3], p[2], 1)); } },
    { id: "s-trap", cat: "shapes", name: "Trapezium", options: ["Parallelogram", "Kite", "Rhombus"], tier: "F", topics: ["G3", "G4"], fact: "A trapezium has exactly one pair of parallel sides. Its area is ½(a + b)h.", draw: () => { const p = [[90, 440], [510, 440], [400, 200], [180, 200]]; return shape(p, arrows(p[0], p[1], 1) + arrows(p[3], p[2], 1)); } },
    { id: "s-kite", cat: "shapes", name: "Kite", options: ["Rhombus", "Trapezium", "Parallelogram"], tier: "F", topics: ["G3"], fact: "A kite has two pairs of equal adjacent sides and one line of symmetry. Its diagonals cross at right angles.", draw: () => { const p = [[300, 100], [450, 250], [300, 510], [150, 250]]; return shape(p, ticks(p[0], p[1], 1) + ticks(p[3], p[0], 1) + ticks(p[1], p[2], 2) + ticks(p[2], p[3], 2)); } },
    { id: "s-pent", cat: "shapes", name: "Regular pentagon", options: ["Regular hexagon", "Regular heptagon", "Regular octagon"], tier: "F", topics: ["G2"], fact: "A regular pentagon has 5 equal sides. Each interior angle is 108° and the exterior angles are 72°.", draw: () => { const p = regular(5); return shape(p, allTicks(p)); } },
    { id: "s-hex", cat: "shapes", name: "Regular hexagon", options: ["Regular pentagon", "Regular octagon", "Regular heptagon"], tier: "F", topics: ["G2"], fact: "A regular hexagon has 6 equal sides and interior angles of 120°. Hexagons tessellate, which is why bees use them.", draw: () => { const p = regular(6); return shape(p, allTicks(p)); } },
    { id: "s-oct", cat: "shapes", name: "Regular octagon", options: ["Regular hexagon", "Regular decagon", "Regular heptagon"], tier: "F", topics: ["G2"], fact: "A regular octagon has 8 equal sides. Each exterior angle is 360° ÷ 8 = 45°, so each interior angle is 135°.", draw: () => { const p = regular(8); return shape(p, allTicks(p)); } },
    { id: "s-sector", cat: "shapes", name: "Sector", options: ["Segment", "Semicircle", "Arc"], tier: "F", topics: ["G5", "G6"], fact: "A sector is the slice between two radii and an arc, like a slice of pizza.", draw: () => { const a = arcPt(20), b = arcPt(100); return svg(circleBase + `<path d="M300 300L${a}A210 210 0 0 0 ${b}Z" fill="rgba(255,200,87,.55)" stroke="${AM}" stroke-width="6" stroke-linejoin="round"/>`); } },
    { id: "s-segment", cat: "shapes", name: "Segment", options: ["Sector", "Chord", "Semicircle"], tier: "F", topics: ["G5", "G6"], fact: "A segment is the region between a chord and an arc.", draw: () => { const a = arcPt(200), b = arcPt(340); return svg(circleBase + `<path d="M${a}A210 210 0 0 0 ${b}Z" fill="rgba(255,200,87,.55)" stroke="${AM}" stroke-width="6"/>`); } },
    { id: "s-tangent", cat: "shapes", name: "Tangent", options: ["Chord", "Radius", "Diameter"], tier: "F", topics: ["G5", "G19"], fact: "A tangent touches a circle at exactly one point, and it meets the radius there at 90°.", draw: () => { const t = 45, p = arcPt(t), d = [Math.cos((t + 90) * Math.PI / 180), -Math.sin((t + 90) * Math.PI / 180)];
      return svg(circleBase + `<line x1="300" y1="300" x2="${p[0]}" y2="${p[1]}" stroke="${WH}" stroke-width="4" stroke-dasharray="10 8"/><line x1="${p[0] - d[0] * 260}" y1="${p[1] - d[1] * 260}" x2="${p[0] + d[0] * 260}" y2="${p[1] + d[1] * 260}" stroke="${AM}" stroke-width="7" stroke-linecap="round"/>` + rightAngle(p, [300, 300], [p[0] + d[0] * 100, p[1] + d[1] * 100], 24)); } },

    /* SOLIDS */
    { id: "d-cube", cat: "solids", name: "Cube", options: ["Cuboid", "Square-based pyramid", "Square"], tier: "F", topics: ["G7", "G20"], fact: "A cube has 6 square faces, 12 edges and 8 vertices. Volume = side³.", draw: () => box(230, 230, 230) },
    { id: "d-cuboid", cat: "solids", name: "Cuboid", options: ["Cube", "Rectangle", "Triangular prism"], tier: "F", topics: ["G7", "G20"], fact: "A cuboid has 6 rectangular faces. Volume = length × width × height.", draw: () => box(320, 160, 230) },
    { id: "d-triprism", cat: "solids", name: "Triangular prism", options: ["Square-based pyramid", "Tetrahedron", "Cuboid"], tier: "F", topics: ["G7"], fact: "A triangular prism has the same triangle all the way through. Volume = area of the triangle × length.", draw: () => prism([[0, 0], [260, 0], [130, 200]], 300, { ox: 95, oy: 450 }) },
    { id: "d-hexprism", cat: "solids", name: "Hexagonal prism", options: ["Pentagonal prism", "Hexagonal pyramid", "Cylinder"], tier: "F", topics: ["G7"], fact: "A hexagonal prism has two hexagon ends joined by 6 rectangles: 8 faces, 18 edges and 12 vertices.", draw: () => prism([[70, 0], [210, 0], [280, 121], [210, 242], [70, 242], [0, 121]], 170, { ox: 120, oy: 450 }) },
    { id: "d-sqpyr", cat: "solids", name: "Square-based pyramid", options: ["Tetrahedron", "Cone", "Triangular prism"], tier: "F", topics: ["G8"], fact: "A square-based pyramid has a square base and 4 triangular faces meeting at a point. Volume = ⅓ × base area × height.", draw: () => pyramid([[0, 0, 0], [280, 0, 0], [280, 0, 280], [0, 0, 280]], [140, 300, 140], { ox: 90, oy: 470 }) },
    { id: "d-tetra", cat: "solids", name: "Tetrahedron", options: ["Square-based pyramid", "Triangular prism", "Cube"], tier: "F", topics: ["G8"], fact: "A tetrahedron is a triangle-based pyramid: 4 triangular faces, 6 edges and 4 vertices.", draw: () => pyramid([[0, 0, 0], [300, 0, 0], [210, 0, 300]], [170, 300, 110], { ox: 90, oy: 480 }) },
    { id: "d-cyl", cat: "solids", name: "Cylinder", options: ["Cone", "Sphere", "Circle"], tier: "F", topics: ["G7"], fact: "A cylinder is a prism with a circular cross-section. Volume = πr²h.", draw: () => svg(`<path d="M170 170V430A130 42 0 0 0 430 430V170" fill="${FILL}" stroke="${CY}" stroke-width="6"/>${ell(300, 430, 130, 42, "back")}${ell(300, 170, 130, 42)}`) },
    { id: "d-cone", cat: "solids", name: "Cone", options: ["Cylinder", "Square-based pyramid", "Sector"], tier: "F", topics: ["G8"], fact: "A cone has a circular base and one vertex. Volume = ⅓πr²h, a third of the cylinder it fits inside.", draw: () => svg(`<path d="M300 90L160 450A140 45 0 0 0 440 450Z" fill="${FILL}" stroke="${CY}" stroke-width="6" stroke-linejoin="round"/>${ell(300, 450, 140, 45, "back")}`) },
    { id: "d-sphere", cat: "solids", name: "Sphere", options: ["Hemisphere", "Circle", "Cylinder"], tier: "F", topics: ["G8"], fact: "A sphere is perfectly round in 3D. Volume = ⁴⁄₃πr³ and surface area = 4πr².", draw: () => svg(`<circle cx="300" cy="300" r="200" fill="${FILL}" stroke="${CY}" stroke-width="6"/>${ell(300, 300, 200, 55, "front")}${ell(300, 300, 200, 55, "back")}`) },
    { id: "d-hemi", cat: "solids", name: "Hemisphere", options: ["Sphere", "Cone", "Semicircle"], tier: "F", topics: ["G8"], fact: "A hemisphere is half a sphere. Volume = ⅔πr³.", draw: () => svg(`<path d="M100 370A200 200 0 0 1 500 370A200 60 0 0 1 100 370Z" fill="${FILL}" stroke="${CY}" stroke-width="6"/>${ell(300, 370, 200, 60, "back")}`) },
    { id: "d-frustum", cat: "solids", name: "Frustum", options: ["Cone", "Cylinder", "Hemisphere"], tier: "H", topics: ["G8", "G15"], fact: "A frustum is a cone with its top cut off parallel to the base. Volume = big cone " + M + " small cone.", draw: () => svg(`<path d="M220 180L130 440A170 52 0 0 0 470 440L380 180" fill="${FILL}" stroke="${CY}" stroke-width="6" stroke-linejoin="round"/>${ell(300, 440, 170, 52, "back")}${ell(300, 180, 80, 25)}`) },

    /* CATCHPHRASES: say what you see */
    { id: "c-sqroot", cat: "catch", name: "Square root", options: ["Cube root", "Square number", "Tree diagram"], tier: "F", topics: ["N4"], fact: "The square root of a number, when multiplied by itself, gives that number: √49 = 7.", draw: () => svg(`<rect y="330" width="600" height="270" fill="#3A2A1C"/><line x1="0" y1="330" x2="600" y2="330" stroke="#6B4E2E" stroke-width="6"/>
      <g stroke="#C89A5B" stroke-width="9" fill="none" stroke-linecap="round"><path d="M300 330c0 60-40 90-90 130s-60 70-60 100"/><path d="M300 330c10 70 60 90 100 140s40 60 50 90"/><path d="M290 340c-20 50-80 40-130 60"/><path d="M310 345c30 40 90 30 150 50"/><path d="M210 460c-30 0-60 20-80 10"/><path d="M400 470c30-10 60 0 80-20"/><path d="M300 330v170"/></g>
      <rect x="180" y="90" width="240" height="240" fill="rgba(0,252,241,.15)" stroke="${CY}" stroke-width="9"/>`) },
    { id: "c-acute", cat: "catch", name: "Acute angle", options: ["Obtuse angle", "Right angle", "Reflex angle"], tier: "F", topics: ["G1"], fact: "An acute angle is less than 90°. (A cute angle!)", draw: () => svg(`<path d="M90 470H540M90 470L470 180" stroke="${CY}" stroke-width="10" stroke-linecap="round" fill="none"/><path d="M230 470A140 140 0 0 0 201 385" stroke="${AM}" stroke-width="7" fill="none"/>
      <g transform="translate(380 360)">${face(0, 0, "cute")}</g>${heart(470, 120, 2)}${heart(530, 230, 1.3)}${heart(170, 200, 1.6)}`) },
    { id: "c-times", cat: "catch", name: "Times table", options: ["Two-way table", "Table of values", "Frequency table"], tier: "F", topics: ["N3"], fact: "Times tables are the multiplication facts, and knowing them up to 12 × 12 speeds up all your other maths.", draw: () => svg(`<rect x="70" y="390" width="460" height="34" rx="8" fill="#8B5E34"/><rect x="110" y="424" width="26" height="140" fill="#6B4527"/><rect x="464" y="424" width="26" height="140" fill="#6B4527"/>
      <circle cx="300" cy="235" r="150" fill="#F4F1E8" stroke="${AM}" stroke-width="14"/>${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(i => { const t = i * Math.PI / 6; return `<line x1="${300 + 122 * Math.sin(t)}" y1="${235 - 122 * Math.cos(t)}" x2="${300 + 136 * Math.sin(t)}" y2="${235 - 136 * Math.cos(t)}" stroke="#0B122C" stroke-width="${i % 3 ? 4 : 8}"/>`; }).join("")}
      <g font-family="JetBrains Mono, monospace" font-weight="700" font-size="34" fill="#0B122C" text-anchor="middle"><text x="300" y="132">12</text><text x="398" y="247">3</text><text x="300" y="358">6</text><text x="202" y="247">9</text></g>
      <path d="M300 235L300 150M300 235L360 270" stroke="#0B122C" stroke-width="9" stroke-linecap="round"/><circle cx="300" cy="235" r="9" fill="#0B122C"/>`) },
    { id: "c-sine", cat: "catch", name: "Sine wave", options: ["Tangent", "Sign change", "Cosine rule"], tier: "H", topics: ["G10", "A18"], fact: "A sine wave is the graph of y = sin x: smooth up-and-down waves that repeat every 360°.", draw: () => svg(`<rect x="285" y="250" width="30" height="330" fill="#9AA6C8"/><rect x="140" y="110" width="320" height="170" rx="16" fill="#1C7C3A" stroke="${WH}" stroke-width="8"/>
      <g fill="${WH}" font-family="Josefin Sans, sans-serif" font-weight="700" font-size="64" text-anchor="middle"><text x="300" y="218">HELLO!</text></g>
      <path d="M460 190c40-10 70-40 80-80" stroke="#F1C9A5" stroke-width="22" stroke-linecap="round" fill="none"/><g fill="#F1C9A5"><circle cx="545" cy="95" r="24"/><rect x="532" y="44" width="10" height="38" rx="5"/><rect x="545" y="40" width="10" height="40" rx="5"/><rect x="558" y="48" width="10" height="36" rx="5"/><rect x="566" y="70" width="10" height="30" rx="5" transform="rotate(30 571 85)"/></g>
      <g stroke="${AM}" stroke-width="6" stroke-linecap="round" fill="none"><path d="M500 50c-10-14-10-30 0-42"/><path d="M590 130c14 6 24 0 30-10"/></g>`) },
    { id: "c-mean", cat: "catch", name: "Mean", options: ["Median", "Mode", "Range"], tier: "F", topics: ["S1"], fact: "The mean is the total divided by how many values there are. (This one is just mean!)", draw: () => svg(`<g font-family="JetBrains Mono, monospace" font-weight="700" font-size="70" fill="${MU}" text-anchor="middle"><text x="110" y="120">3</text><text x="490" y="120">7</text></g>
      <circle cx="300" cy="340" r="200" fill="${AM}"/><g transform="translate(300 350) scale(1.7)">${face(0, 0, "mean")}</g>
      <text x="300" y="215" font-family="JetBrains Mono, monospace" font-weight="700" font-size="70" fill="#0B122C" text-anchor="middle">5</text>
      <g fill="${WH}" opacity=".75"><circle cx="70" cy="300" r="24"/><circle cx="40" cy="260" r="16"/><circle cx="530" cy="300" r="24"/><circle cx="560" cy="260" r="16"/></g>`) },
    { id: "c-power2", cat: "catch", name: "Power of 2", options: ["Square root of 2", "Multiple of 2", "Factor of 2"], tier: "F", topics: ["N4"], fact: "A power of 2 is 2 multiplied by itself: 2, 4, 8, 16, 32 … 2¹⁰ = 1024.", draw: () => svg(`<text x="300" y="550" font-family="Josefin Sans, sans-serif" font-weight="700" font-size="380" text-anchor="middle" fill="${CY}">2</text>
      <path d="M215 320C140 300 120 210 165 140M385 320C460 300 480 210 435 140" stroke="#F1C9A5" stroke-width="30" stroke-linecap="round" fill="none"/><circle cx="150" cy="255" r="30" fill="#F1C9A5"/><circle cx="450" cy="255" r="30" fill="#F1C9A5"/>
      <rect x="70" y="104" width="460" height="22" rx="10" fill="#9AA6C8"/><rect x="40" y="62" width="44" height="106" rx="10" fill="${MU}"/><rect x="516" y="62" width="44" height="106" rx="10" fill="${MU}"/><circle cx="165" cy="125" r="24" fill="#F1C9A5"/><circle cx="435" cy="125" r="24" fill="#F1C9A5"/>
      <g transform="translate(300 360) scale(.75)">${face(0, 0, "cute")}</g><g stroke="${AM}" stroke-width="6" stroke-linecap="round"><path d="M110 330l-30 14M490 330l30 14M300 30v-20"/></g>`) },
    { id: "c-bestfit", cat: "catch", name: "Line of best fit", options: ["Line of symmetry", "Number line", "Tangent"], tier: "F", topics: ["S4"], fact: "A line of best fit runs through the middle of the points on a scatter graph to show the trend.", draw: () => svg(`<line x1="70" y1="530" x2="560" y2="530" stroke="${WH}" stroke-width="4"/><line x1="70" y1="530" x2="70" y2="60" stroke="${WH}" stroke-width="4"/>
      ${[[110, 470], [150, 440], [170, 470], [210, 400], [250, 410], [280, 350], [320, 360], [340, 300], [390, 300], [420, 250], [450, 270], [490, 200], [520, 180]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9" fill="${MU}"/>`).join("")}
      <line x1="90" y1="490" x2="540" y2="165" stroke="${AM}" stroke-width="12" stroke-linecap="round"/><rect x="292" y="314" width="70" height="20" rx="6" fill="${PK}" transform="rotate(-36 327 324)"/>
      <g transform="translate(470 120)"><rect x="-40" y="-10" width="80" height="20" rx="8" fill="#9AA6C8"/><rect x="-54" y="-26" width="18" height="52" rx="6" fill="${MU}"/><rect x="36" y="-26" width="18" height="52" rx="6" fill="${MU}"/></g>
      <g fill="${CY}"><path d="M260 280q-8 14 0 22q8-8 0-22z"/><path d="M380 230q-8 14 0 22q8-8 0-22z"/></g>`) },

    /* FAMOUS MATHEMATICIANS AND SCIENTISTS (photos) */
    { id: "p-newton", cat: "people", name: "Isaac Newton", img: "newton", fact: "Isaac Newton (1643–1727) explained gravity and the laws of motion, and developed calculus." },
    { id: "p-einstein", cat: "people", name: "Albert Einstein", img: "einstein", fact: "Albert Einstein (1879–1955) developed the theory of relativity, including E = mc²." },
    { id: "p-turing", cat: "people", name: "Alan Turing", img: "turing", fact: "Alan Turing (1912–1954) helped break the Enigma code in the Second World War and laid the foundations of computer science." },
    { id: "p-curie", cat: "people", name: "Marie Curie", img: "curie", fact: "Marie Curie (1867–1934) pioneered the study of radioactivity and was the first person to win Nobel Prizes in two sciences." },
    { id: "p-nightingale", cat: "people", name: "Florence Nightingale", img: "nightingale", fact: "Florence Nightingale (1820–1910) was a nurse and statistician whose rose diagrams showed that most soldiers were dying of preventable disease." },
    { id: "p-euler", cat: "people", name: "Leonhard Euler", img: "euler", fact: "Leonhard Euler (1707–1783) gave us f(x) notation and the formula faces + vertices " + M + " edges = 2 for solids." },
    { id: "p-pythagoras", cat: "people", name: "Pythagoras", img: "pythagoras", fact: "Pythagoras (about 570–495 BC) is the Greek thinker the theorem a² + b² = c² is named after." },
    { id: "p-pythagoras2", cat: "people", name: "Pythagoras", img: "pythagoras-theorem", fact: "Squares on the sides of a right-angled triangle: a² + b² = c², Pythagoras' theorem." },
    { id: "p-leonardo", cat: "people", name: "Leonardo da Vinci", img: "leonardo", fact: "Leonardo da Vinci (1452–1519) was an artist and inventor who drew the Vitruvian Man and illustrated a famous book on the golden ratio." },
    { id: "p-fibonacci", cat: "people", name: "Fibonacci", img: "fibonacci", fact: "Fibonacci (about 1170–1250) brought our 0–9 digits to Europe and is famous for the sequence 1, 1, 2, 3, 5, 8, 13 …" },
    { id: "p-pascal", cat: "people", name: "Blaise Pascal", img: "pascal", fact: "Blaise Pascal (1623–1662) helped found probability theory and built one of the first mechanical calculators." },
    { id: "p-pascal2", cat: "people", name: "Blaise Pascal", img: "pascal-triangle", fact: "Pascal's triangle: each number is the sum of the two above it. Its rows give the coefficients for expanding brackets." },
    { id: "p-galileo", cat: "people", name: "Galileo Galilei", img: "galileo", fact: "Galileo Galilei (1564–1642) improved the telescope and discovered four of Jupiter's moons." },
    { id: "p-johnson", cat: "people", name: "Katherine Johnson", img: "johnson", fact: "Katherine Johnson (1918–2020) calculated the flight paths that took NASA astronauts into orbit and to the Moon." },
    { id: "p-johnson2", cat: "people", name: "Katherine Johnson", img: "johnson-nasa", fact: "Katherine Johnson co-wrote this 1960 NASA report on placing a satellite over a chosen point on Earth." },
    { id: "p-descartes", cat: "people", name: "René Descartes", img: "descartes", fact: "René Descartes (1596–1650) invented the coordinate system: (x, y) coordinates are called Cartesian after him." },
    { id: "p-euclid", cat: "people", name: "Euclid", img: "euclid", fact: "Euclid (about 300 BC) wrote the Elements, the geometry book used in schools for over 2,000 years." },
    { id: "p-archimedes", cat: "people", name: "Archimedes", img: "archimedes", fact: "Archimedes (about 287–212 BC) showed π is between 3¹⁰⁄₇₁ and 3¹⁄₇, worked out the volume of a sphere and is said to have shouted \"Eureka!\" in his bath." },
    { id: "p-lovelace", cat: "people", name: "Ada Lovelace", img: "lovelace", fact: "Ada Lovelace (1815–1852) wrote what is often called the first computer program, for Charles Babbage's Analytical Engine." },
    { id: "p-babbage", cat: "people", name: "Charles Babbage", img: "babbage", fame: 2, fact: "Charles Babbage (1791–1871) designed the Difference Engine and the Analytical Engine, mechanical computers a century before electronic ones." },
    { id: "p-khwarizmi", cat: "people", name: "Al-Khwarizmi", img: "al-khwarizmi", fame: 2, fact: "Al-Khwarizmi (about 780–850) worked in Baghdad. His book gave us the word algebra (al-jabr), and the word algorithm comes from his name." },
    { id: "p-gauss", cat: "people", name: "Carl Friedrich Gauss", img: "gauss", fame: 2, fact: "Carl Friedrich Gauss (1777–1855), the \"Prince of Mathematicians\", is said to have added 1 to 100 in seconds as a schoolboy: the answer is 5050." },
    { id: "p-noether", cat: "people", name: "Emmy Noether", img: "noether", fame: 2, fact: "Emmy Noether (1882–1935) transformed algebra, and Noether's theorem links symmetry to the conservation laws of physics." },
    { id: "p-ramanujan", cat: "people", name: "Srinivasa Ramanujan", img: "ramanujan", fame: 2, fact: "Srinivasa Ramanujan (1887–1920) was largely self-taught. 1729 is called the taxicab number after his remark that it is the smallest number that is the sum of two cubes in two ways." },
    { id: "p-fermat", cat: "people", name: "Pierre de Fermat", img: "fermat", fame: 2, fact: "Pierre de Fermat (1607–1665) claimed that aⁿ + bⁿ = cⁿ has no whole-number answers when n > 2. Fermat's Last Theorem was finally proved in 1994." },
    { id: "p-leibniz", cat: "people", name: "Gottfried Leibniz", img: "leibniz", fame: 2, fact: "Gottfried Leibniz (1646–1716) invented calculus at the same time as Newton, and his dy/dx notation is the one we still use." },
    { id: "p-boole", cat: "people", name: "George Boole", img: "boole", fame: 2, fact: "George Boole (1815–1864) invented Boolean algebra, the logic of TRUE and FALSE that every computer runs on." },
    { id: "p-maxwell", cat: "people", name: "James Clerk Maxwell", img: "maxwell", fame: 2, fact: "James Clerk Maxwell (1831–1879) wrote the equations that unite electricity, magnetism and light." },
    { id: "p-aryabhata", cat: "people", name: "Aryabhata", img: "aryabhata", fame: 2, fact: "Aryabhata (476–550) was an Indian mathematician and astronomer who gave π as 3.1416 and explained eclipses." },
    { id: "p-cauchy", cat: "people", name: "Augustin-Louis Cauchy", img: "cauchy", fame: 3, fact: "Augustin-Louis Cauchy (1789–1857) put calculus on firm foundations with careful definitions of limits." },
    { id: "p-cantor", cat: "people", name: "Georg Cantor", img: "cantor", fame: 3, fact: "Georg Cantor (1845–1918) proved that some infinities are bigger than others." },
    { id: "p-riemann", cat: "people", name: "Bernhard Riemann", img: "riemann", fame: 3, fact: "Bernhard Riemann (1826–1866) made a guess about prime numbers, the Riemann hypothesis, that is still unproved and has a million-dollar prize." },
    { id: "p-galois", cat: "people", name: "Évariste Galois", img: "galois", fame: 3, fact: "Évariste Galois (1811–1832) founded group theory and wrote down his ideas the night before he died in a duel, aged 20." },
    { id: "p-weierstrass", cat: "people", name: "Karl Weierstrass", img: "weierstrass", fame: 3, fact: "Karl Weierstrass (1815–1897) taught in schools for years before becoming known as the father of modern analysis." },
    { id: "p-banach", cat: "people", name: "Stefan Banach", img: "banach", fame: 3, fact: "Stefan Banach (1892–1945) was a Polish mathematician who founded functional analysis. Maths problems he and friends wrote in a café notebook became famous." },
    { id: "p-cayley", cat: "people", name: "Arthur Cayley", img: "cayley", fame: 3, fact: "Arthur Cayley (1821–1895) developed matrices, and worked as a lawyer for 14 years while doing maths in his spare time." },
    { id: "p-lagrange", cat: "people", name: "Joseph-Louis Lagrange", img: "lagrange", fame: 3, fact: "Joseph-Louis Lagrange (1736–1813) advanced mechanics and calculus, and helped create the metric system." },
    { id: "p-hilbert", cat: "people", name: "David Hilbert", img: "hilbert", fame: 3, fact: "David Hilbert (1862–1943) set 23 famous problems in 1900 that shaped twentieth-century mathematics." },
    { id: "p-poincare", cat: "people", name: "Henri Poincaré", img: "poincare", fame: 3, fact: "Henri Poincaré (1854–1912) helped found topology. His famous conjecture about shapes was finally proved in 2003." }
  ];
  /* people get their line-up from the other people. fame: 1 well known (default), 2 met in school maths, 3 for keen Higher students (Higher games only) */
  PICS.filter(p => p.cat === "people").forEach(p => { p.fame = p.fame || 1; p.tier = p.fame === 3 ? "H" : "F"; p.topics = []; p.options = null; });
  const FAME = {}; PICS.filter(p => p.cat === "people").forEach(p => { FAME[p.name] = p.fame; });
  const PEOPLE = Object.keys(FAME);
  const CATS = { graphs: "Graphs", shapes: "Shapes", solids: "Solids", catch: "Catchphrase", people: "Famous mathematicians & scientists" };
  const byId = Object.fromEntries(PICS.map(p => [p.id, p]));
  const shuf = a => { const x = a.slice(); for (let i = x.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [x[i], x[j]] = [x[j], x[i]]; } return x; };
  /* the four names shown in the line-up, in a random order */
  function lineup(p) {
    /* look-alikes no more obscure than the answer, so a well-known face isn't hidden among names nobody knows */
    const others = p.options || shuf(PEOPLE.filter(n => n !== p.name && FAME[n] <= Math.max(p.fame, 1))).slice(0, 3);
    return shuf([p.name, ...others]);
  }
  const html = (p, imgBase = "img/identikit/") => p.img ? `<img src="${imgBase}${p.img}.jpg" alt="" draggable="false">` : p.draw();
  return { PICS, CATS, byId, lineup, html, PEOPLE };
})();
