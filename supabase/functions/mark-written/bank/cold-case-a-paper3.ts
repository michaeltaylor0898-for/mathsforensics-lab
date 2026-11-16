// Cold Case A · Higher Paper 3 (calculator) · all 22 questions, 80 marks (CC-A/3H)
//
// Question wording is copied from the paper (supplied as an A3 booklet and reassembled in page order).
// Mark points follow Mike's Cold Case A Paper 3 Forensic Mark Scheme line for line; errors and
// Mike-mode danger zones come from its "Where the marks go missing" boxes. B2 marks are split into two
// B1 points, and answers drawn on a grid (Q6c, Q14b, Q15b) have marker notes for a blank page.
import type { Scheme } from "../schemes.ts";

const fr = (n: string | number, d: string | number) => `<span class="fr"><span>${n}</span><span>${d}</span></span>`;
const SRC = "CC-A/3H";
const TXT = `font-family="Times New Roman,serif" fill="currentColor"`;
const NDA = (x: number, y: number) => `<text x="${x}" y="${y}" font-size="9" text-anchor="middle" fill="currentColor" opacity=".7" font-family="Arial,sans-serif">Not drawn accurately</text>`;
const table = (rows: (string | number)[][], headRow = true) =>
  `<table class="qt">${rows.map((r, i) => `<tr>${r.map((c, j) => ((headRow ? i : j) === 0 ? `<th>${c}</th>` : `<td>${c}</td>`)).join("")}</tr>`).join("")}</table>`;

// Graph paper with labelled axes and optional marks drawn on top
function paper(o: { xMax: number; yMin?: number; yMax: number; xMajor: number; yMajor: number; xMinor: number; yMinor: number; xLabel: string; yLabel: string; extra?: (X: (x: number) => number, Y: (y: number) => number) => string; aria: string; xMin?: number }) {
  const xMin = o.xMin ?? 0, yMin = o.yMin ?? 0, W = 270, H = 190, L = 50, T = 12;
  const X = (x: number) => +(L + ((x - xMin) / (o.xMax - xMin)) * W).toFixed(1), Y = (y: number) => +(T + H - ((y - yMin) / (o.yMax - yMin)) * H).toFixed(1);
  const minor: string[] = [], major: string[] = [], lab: string[] = [];
  const isMaj = (v: number, m: number) => Math.abs(v / m - Math.round(v / m)) < 1e-9;
  for (let x = xMin; x <= o.xMax + 1e-9; x += o.xMinor) (isMaj(x, o.xMajor) ? major : minor).push(`M${X(x)} ${Y(yMin)}V${Y(o.yMax)}`);
  for (let y = yMin; y <= o.yMax + 1e-9; y += o.yMinor) (isMaj(y, o.yMajor) ? major : minor).push(`M${X(xMin)} ${Y(y)}H${X(o.xMax)}`);
  const n = (v: number) => (v < 0 ? "−" + -v : String(v));
  for (let x = xMin; x <= o.xMax + 1e-9; x += o.xMajor) lab.push(`<text x="${X(x)}" y="${Y(yMin) + 15}" text-anchor="middle">${n(+x.toFixed(2))}</text>`);
  for (let y = yMin; y <= o.yMax + 1e-9; y += o.yMajor) lab.push(`<text x="${L - 6}" y="${Y(y) + 4}" text-anchor="end">${n(+y.toFixed(2))}</text>`);
  return `<svg viewBox="0 0 335 245" role="img" aria-label="${o.aria}"><path d="${minor.join("")}" stroke="currentColor" stroke-width=".35" opacity=".3" fill="none"/><path d="${major.join("")}" stroke="currentColor" stroke-width=".7" opacity=".55" fill="none"/>${o.extra ? o.extra(X, Y) : ""}<g font-size="11" ${TXT}>${lab.join("")}<text x="${L + W / 2}" y="240" text-anchor="middle">${o.xLabel}</text><text transform="translate(13 ${T + H / 2}) rotate(-90)" text-anchor="middle">${o.yLabel}</text></g></svg>`;
}

// ---------- diagrams ----------
const ladder = `<svg viewBox="0 0 220 190" role="img" aria-label="A ladder 6.5 m long leaning against a vertical wall. The foot of the ladder is 1.8 m from the wall."><g fill="none" stroke="currentColor" stroke-width="1.6"><path d="M150 15 V165 H30"/><path d="M75 165 L150 22" stroke-width="2"/><path d="M138 165 V153 H150" stroke-width="1.1"/></g><g ${TXT} font-size="12"><text x="158" y="90">wall</text><text x="100" y="92" text-anchor="end">6.5 m</text><text x="112" y="180" text-anchor="middle">1.8 m</text></g>${NDA(110, 188)}</svg>`;

const SCATTER = [[1, 24], [2, 28], [3, 37], [4, 40], [5, 49], [6, 52], [6, 25], [7, 61], [8, 64], [9, 74]];
const scatter = paper({
  xMax: 10, yMax: 80, xMajor: 1, yMajor: 10, xMinor: 0.2, yMinor: 2, xLabel: "Hours spent revising", yLabel: "Test score",
  aria: "Scatter graph of hours revising against test score for 10 students. Points: (1, 24), (2, 28), (3, 37), (4, 40), (5, 49), (6, 52), (6, 25), (7, 61), (8, 64), (9, 74).",
  extra: (X, Y) => `<g stroke="currentColor" stroke-width="1.5">${SCATTER.map(([x, y]) => `<path d="M${X(x) - 4} ${Y(y) - 4}l8 8m0 -8l-8 8"/>`).join("")}</g>`,
});

const sector72 = `<svg viewBox="0 0 260 170" role="img" aria-label="Sector OAB of a circle, centre O, radius 9.4 cm. OA is horizontal and angle AOB is 72 degrees."><path d="M60 145 L200 145 A140 140 0 0 0 103.3 11.9 Z" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M84 145 A24 24 0 0 0 67.4 122.2" fill="none" stroke="currentColor" stroke-width="1.1"/><g ${TXT} font-size="13"><text x="46" y="158" font-style="italic">O</text><text x="204" y="152" font-style="italic">A</text><text x="98" y="10" font-style="italic">B</text><text x="86" y="134">72°</text><text x="130" y="160" text-anchor="middle">9.4 cm</text></g>${NDA(150, 168)}</svg>`;

const cfGrid = paper({ xMax: 50, yMax: 60, xMajor: 10, yMajor: 10, xMinor: 2, yMinor: 2, xLabel: "Height (h cm)", yLabel: "Cumulative frequency", aria: "An empty grid: height from 0 to 50 cm across, cumulative frequency from 0 to 60 up." });

const cubicGrid = paper({ xMin: -2, xMax: 2, yMin: -2, yMax: 4, xMajor: 1, yMajor: 1, xMinor: 0.2, yMinor: 0.2, xLabel: "x", yLabel: "y", aria: "An empty grid: x from −2 to 2, y from −2 to 4." });

// Triangle ACD: CD at right angles to AC, towards the upper left (shortened to fit; not to scale)
const twoTriangles = (() => {
  const k = 20, A = [30, 175], B = [30 + 7.5 * k, 175], C = [B[0], 175 - 4 * k];
  const ac = [C[0] - A[0], C[1] - A[1]], len = Math.hypot(ac[0], ac[1]), u = [ac[0] / len, ac[1] / len];
  const perp = [u[1], -u[0]]; // rotate towards the upper left
  const D = [C[0] + perp[0] * 5 * k, C[1] + perp[1] * 5 * k];
  const p = (q: number[]) => `${q[0].toFixed(1)} ${q[1].toFixed(1)}`;
  const sq = (P: number[], d1: number[], d2: number[]) => `M${p([P[0] + d1[0] * 10, P[1] + d1[1] * 10])} L${p([P[0] + d1[0] * 10 + d2[0] * 10, P[1] + d1[1] * 10 + d2[1] * 10])} L${p([P[0] + d2[0] * 10, P[1] + d2[1] * 10])}`;
  return `<svg viewBox="0 -10 260 230" role="img" aria-label="Two right-angled triangles. ABC has AB = 7.5 cm along the bottom and BC = 4 cm going up from B, with the right angle at B. Triangle ACD shares the side AC, with the right angle at C and angle CAD = 38 degrees."><g fill="none" stroke="currentColor" stroke-width="1.6"><path d="M${p(A)} L${p(B)} L${p(C)} Z M${p(A)} L${p(D)} L${p(C)}"/><path d="${sq(B, [-1, 0], [0, -1])}" stroke-width="1"/><path d="${sq(C, [-u[0], -u[1]], perp)}" stroke-width="1"/></g><g ${TXT} font-size="12"><text x="${A[0] - 14}" y="${A[1] + 4}" font-style="italic">A</text><text x="${B[0] + 4}" y="${B[1] + 4}" font-style="italic">B</text><text x="${C[0] + 5}" y="${C[1]}" font-style="italic">C</text><text x="${D[0] - 4}" y="${D[1] - 4}" font-style="italic">D</text><text x="${A[0] + 30}" y="${A[1] - 29}" font-size="11">38°</text><text x="${(A[0] + B[0]) / 2}" y="${A[1] + 15}" text-anchor="middle">7.5 cm</text><text x="${B[0] + 5}" y="${(B[1] + C[1]) / 2 + 4}">4 cm</text></g>${NDA(110, 215)}</svg>`;
})();

const chords = (() => {
  const cx = 130, cy = 100, r = 75, pt = (deg: number) => [cx + r * Math.cos((deg * Math.PI) / 180), cy - r * Math.sin((deg * Math.PI) / 180)];
  const D = pt(70), A = pt(160), B = pt(215), C = pt(300);
  const p = (q: number[]) => `${q[0].toFixed(1)} ${q[1].toFixed(1)}`;
  return `<svg viewBox="0 0 260 200" role="img" aria-label="A circle with points D (top right), A (left), B (lower left) and C (lower right). The chords AC and BD cross at X. Angle ABD is 34 degrees and angle BDC is 47 degrees."><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M${p(A)} L${p(C)} M${p(B)} L${p(D)} M${p(A)} L${p(B)} M${p(D)} L${p(C)}" fill="none" stroke="currentColor" stroke-width="1.4"/><g ${TXT} font-size="12"><text x="${D[0] + 4}" y="${D[1] - 2}" font-style="italic">D</text><text x="${A[0] - 14}" y="${A[1] + 4}" font-style="italic">A</text><text x="${B[0] - 12}" y="${B[1] + 10}" font-style="italic">B</text><text x="${C[0] + 4}" y="${C[1] + 10}" font-style="italic">C</text><text x="${B[0] + 14}" y="${B[1] - 10}">34°</text><text x="${D[0] - 6}" y="${D[1] + 30}">47°</text><text x="126" y="122" font-style="italic">X</text></g>${NDA(130, 194)}</svg>`;
})();

const SCAT_T = "Scatter graph of hours revising (x) against test score (y) for 10 students: (1, 24), (2, 28), (3, 37), (4, 40), (5, 49), (6, 52), (6, 25), (7, 61), (8, 64), (9, 74).";
const spinTable = table([["Colour", "Red", "Blue", "Green", "Yellow"], ["Probability", 0.35, 0.2, "2x", "x"]], false);
const SPIN = "A biased spinner: P(red) = 0.35, P(blue) = 0.2, P(green) = 2x, P(yellow) = x.";
const plantTable = table([["Height (h cm)", "Frequency", "Cumulative frequency"], ["0 &lt; h ≤ 10", 4, ""], ["10 &lt; h ≤ 20", 11, ""], ["20 &lt; h ≤ 30", 20, ""], ["30 &lt; h ≤ 40", 17, ""], ["40 &lt; h ≤ 50", 8, ""]]);
const PLANT = "Heights of 60 plants: 0 < h ≤ 10: 4; 10 < h ≤ 20: 11; 20 < h ≤ 30: 20; 30 < h ≤ 40: 17; 40 < h ≤ 50: 8. Cumulative frequencies 4, 15, 35, 52, 60.";
const cubicTable = table([["x", "−2", "−1.5", "−1", "−0.5", 0, 0.5, 1, 1.5, 2], ["y", "−1", "", 3, 2.375, 1, "", "−1", "", 3]], false);
const CUBIC = "y = x³ − 3x + 1. Table: x = −2, −1.5, −1, −0.5, 0, 0.5, 1, 1.5, 2 gives y = −1, 2.125, 3, 2.375, 1, −0.375, −1, −0.125, 3.";

export const COLD_CASE_A3: Scheme[] = [
  {
    id: "cca3-q1a", source: { paper: SRC, q: "1", part: "a" }, topic: "pfd", tier: "H", calculator: true,
    prompt: "Write 126 as a product of its prime factors.",
    marks: 2, answer: "2 × 3² × 7", solution: ["126 = 2 × 63", "63 = 3 × 21 = 3 × 3 × 7", "126 = 2 × 3² × 7"], noWorking: "full",
    points: [
      { id: "M1", code: "M1", criterion: "A factor tree or repeated division with at least two correct steps." },
      { id: "A1", code: "A1", dep: ["M1"], criterion: "2 × 3 × 3 × 7 or 2 × 3² × 7", reject: ["a list with commas", "plus signs"] },
    ],
    errors: [{ id: "wrong-form", looksLike: "wrote the factors as a list or with plus signs" }],
    dangerZones: [{ id: "product", when: "all the primes have been found", warn: "Write them as a product with × signs." }],
    coach: {
      keyWords: [{ text: "product", why: "Multiplied together, with × signs." }, { text: "prime factors", why: "Every number must be prime." }],
      clues: ["126 = 2 × 63.", "Keep splitting until every branch is prime.", "Write the primes multiplied together."],
      traps: ["Does your product multiply back to 126?"],
    },
  },
  {
    id: "cca3-q1b", source: { paper: SRC, q: "1", part: "b" }, topic: "pfd", tier: "H", calculator: true,
    prompt: "126k is a square number.<br>Find the smallest possible positive integer value of k.",
    promptText: "126 = 2 × 3² × 7. 126k is a square number. Find the smallest possible positive integer value of k.",
    marks: 1, answer: "k = 14", solution: ["126 = 2 × 3² × 7", "The 2 and the 7 each need a partner", "k = 2 × 7"], noWorking: "full",
    points: [{ id: "B1", code: "B1", criterion: "k = 14 (the 2 and the 7 each need a partner to make a square).", reject: ["126 (makes a square, but not the smallest)"] }],
    errors: [{ id: "stopped-early", looksLike: "answered 126: that does make a square, but it isn't the smallest value" }],
    dangerZones: [{ id: "even", when: "the student is choosing k", warn: "In a square, every prime appears an even number of times." }],
    coach: {
      keyWords: [{ text: "square number", why: "Every prime factor appears an even number of times." }, { text: "smallest", why: "Only add the primes that are missing a partner." }],
      clues: ["Look at your prime factors from part (a).", "Which primes appear an odd number of times?", "Multiply just those together."],
      traps: ["Is your k the smallest that works?"],
    },
  },
  {
    id: "cca3-q2", source: { paper: SRC, q: "2" }, topic: "cint", tier: "H", calculator: true,
    prompt: "Aisha invests £3200 for 4 years in a savings account.<br>The account pays compound interest at a rate of 2.4% per year.<br>Work out the value of the investment at the end of the 4 years.",
    marks: 3, answer: "£3518.44", solution: ["Multiplier 1.024", "3200 × 1.024⁴ = 3518.44"], noWorking: "full",
    points: [
      { id: "M1a", code: "M1", criterion: "Uses the multiplier 1.024", reject: ["1.24"] },
      { id: "M1b", code: "M1", dep: ["M1a"], criterion: "3200 × 1.024⁴" },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "£3518.44", reject: ["£3507.20 (simple interest)", "the interest only"] },
    ],
    errors: [
      { id: "wrong-operation", looksLike: "used 1.24 as the multiplier: 2.4% is 0.024, so the multiplier is 1.024" },
      { id: "simple-compound", looksLike: "worked out simple interest (4 × £76.80), giving £3507.20" },
      { id: "stopped-early", looksLike: "gave only the interest and not the value of the investment" },
    ],
    dangerZones: [{ id: "mult", when: "the student is writing the multiplier", warn: "2.4% as a decimal is 0.024." }],
    coach: {
      keyWords: [{ text: "compound interest", why: "Multiplier to the power of the number of years." }],
      clues: ["An increase of 2.4% is a multiplier of 1.024.", "Four years: 1.024⁴.", "Multiply 3200 by it."],
      traps: ["Is your multiplier 1.024?"],
    },
  },
  {
    id: "cca3-q3", source: { paper: SRC, q: "3" }, topic: "sdp", tier: "H", calculator: true,
    prompt: "A train travels 252 km in 2 hours 24 minutes.<br>Work out the average speed of the train in km/h.",
    marks: 3, answer: "105 km/h", solution: ["2 hours 24 minutes = 2.4 hours", "252 ÷ 2.4"], noWorking: "full",
    points: [
      { id: "M1a", code: "M1", criterion: "Converts the time: 2 hours 24 minutes = 2.4 hours (or 144 minutes).", reject: ["2.24 hours"] },
      { id: "M1b", code: "M1", ft: true, dep: ["M1a"], criterion: "252 ÷ 2.4" },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "105", reject: ["112.5 (from 2.24)"] },
    ],
    errors: [
      { id: "rounding", looksLike: "typed the time as 2.24 hours, giving 112.5 km/h: 24 minutes is 0.4 of an hour" },
      { id: "wrong-form", looksLike: "divided by 144 and left the answer in km per minute" },
    ],
    dangerZones: [{ id: "time", when: "the student is converting the time", warn: "24 minutes is what fraction of an hour?" }],
    coach: {
      keyWords: [{ text: "2 hours 24 minutes", why: "Not 2.24 hours." }, { text: "km/h", why: "Time must be in hours." }],
      clues: ["24 minutes = 24/60 of an hour.", "So the time is 2.4 hours.", "Speed = distance ÷ time."],
      traps: ["Did you convert 24 minutes properly?"],
    },
  },
  {
    id: "cca3-q4a", source: { paper: SRC, q: "4", part: "a" }, topic: "brackets", tier: "H", calculator: true,
    prompt: "Expand and simplify &nbsp;<span class=\"eq\">(3x − 2)(x + 5)</span>",
    marks: 2, answer: "3x² + 13x − 10", solution: ["3x² + 15x − 2x − 10", "= 3x² + 13x − 10"], noWorking: "full",
    points: [
      { id: "M1", code: "M1", criterion: "Four terms with at least three correct: 3x² + 15x − 2x − 10" },
      { id: "A1", code: "A1", dep: ["M1"], criterion: "3x² + 13x − 10" },
    ],
    errors: [{ id: "sign-error", looksLike: "sign error on the last term: −2 × 5 = −10" }],
    dangerZones: [{ id: "four", when: "the student is expanding", warn: "Four terms, and watch the −2." }],
    coach: {
      keyWords: [{ text: "Expand and simplify", why: "Four terms, then collect." }],
      clues: ["Multiply each term in the first bracket by each in the second.", "3x × x, 3x × 5, −2 × x, −2 × 5.", "Collect the x terms."],
      traps: ["Is the last term −10?"],
    },
  },
  {
    id: "cca3-q4b", source: { paper: SRC, q: "4", part: "b" }, topic: "factq", tier: "H", calculator: true,
    prompt: "Factorise &nbsp;<span class=\"eq\">x<sup>2</sup> − 9x + 20</span>", promptText: "Factorise x² − 9x + 20.",
    marks: 2, answer: "(x − 4)(x − 5)", solution: ["Numbers that multiply to +20 and add to −9: −4 and −5"], noWorking: "full",
    points: [
      { id: "M1", code: "M1", criterion: "(x ± 4)(x ± 5)" },
      { id: "A1", code: "A1", dep: ["M1"], criterion: "(x − 4)(x − 5)", reject: ["(x + 4)(x + 5)"] },
    ],
    errors: [{ id: "sign-error", looksLike: "wrote (x + 4)(x + 5): the numbers must multiply to +20 and add to −9, so both are negative" }],
    dangerZones: [{ id: "signs", when: "the student has 4 and 5", warn: "They must add to −9. What signs?" }],
    coach: {
      keyWords: [{ text: "Factorise", why: "Two brackets." }],
      clues: ["Find two numbers that multiply to +20 and add to −9.", "Both must be negative.", "Write them in brackets with x."],
      traps: ["Expand your answer: do you get −9x?"],
    },
  },
  {
    id: "cca3-q5", source: { paper: SRC, q: "5" }, topic: "trig", tier: "H", calculator: true,
    prompt: "A ladder of length 6.5 m leans against a vertical wall.<br>The foot of the ladder is on horizontal ground, 1.8 m from the wall.<br>Work out how far up the wall the ladder reaches.<br>Give your answer correct to 3 significant figures.",
    diagram: ladder, marks: 3, answer: "6.25 m", solution: ["6.5² − 1.8² = 39.01", "√39.01 = 6.2457…"], noWorking: "full",
    points: [
      { id: "M1a", code: "M1", criterion: "6.5² − 1.8²", reject: ["6.5² + 1.8²"] },
      { id: "M1b", code: "M1", dep: ["M1a"], criterion: "√39.01" },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "6.25 (from 6.2457…)", reject: ["6.74 (squares added)"] },
    ],
    errors: [
      { id: "wrong-operation", looksLike: "added the squares, giving 6.74 m: the ladder is the hypotenuse, so the height must be shorter than 6.5 m" },
      { id: "no-sqrt", looksLike: "forgot the square root" },
    ],
    dangerZones: [{ id: "hyp", when: "the student is setting up Pythagoras", warn: "Which side is the hypotenuse? Add or subtract?" }],
    coach: {
      keyWords: [{ text: "ladder of length 6.5 m", why: "The hypotenuse: the longest side." }],
      clues: ["The ladder is the hypotenuse.", "To find a shorter side, subtract the squares.", "Square root at the end."],
      traps: ["Is your answer less than 6.5 m?"],
    },
  },
  {
    id: "cca3-q6a", source: { paper: SRC, q: "6", part: "a" }, topic: "scatter", tier: "H", calculator: true,
    prompt: "The scatter graph shows the number of hours that 10 students spent revising and their scores in a test.<br>One student's result does not fit the pattern of the others.<br>Write down the coordinates of the point for this student.",
    promptText: `${SCAT_T} One student's result does not fit the pattern. Write down the coordinates of the point for this student.`,
    diagram: scatter, marks: 1, answer: "(6, 25)", solution: ["The point (6, 25) is far below the others"], noWorking: "full",
    points: [{ id: "B1", code: "B1", criterion: "(6, 25)", reject: ["(25, 6)"] }],
    errors: [{ id: "swapped", looksLike: "wrote the coordinates the wrong way round" }],
    dangerZones: [{ id: "order", when: "the student is writing the coordinates", warn: "x first: hours, then score." }],
    coach: {
      keyWords: [{ text: "does not fit the pattern", why: "The outlier." }],
      clues: ["Look for the point far away from the trend.", "Read its hours (across).", "Read its score (up)."],
      traps: ["Is it (hours, score)?"],
    },
  },
  {
    id: "cca3-q6b", source: { paper: SRC, q: "6", part: "b" }, topic: "scatter", tier: "H", calculator: true,
    prompt: "Ignoring this student, describe the correlation shown by the scatter graph.",
    promptText: `${SCAT_T} Ignoring the outlier (6, 25), describe the correlation shown.`,
    diagram: scatter, marks: 1, answer: "Positive correlation", solution: ["As hours increase, scores increase"], noWorking: "full",
    points: [{ id: "B1", code: "B1", criterion: "Positive correlation", reject: ["words only, e.g. 'the more you revise the better you do'"] }],
    errors: [{ id: "wrong-form", looksLike: "described the relationship in words only: the question asks for the type of correlation" }],
    dangerZones: [{ id: "type", when: "the student is answering", warn: "Name the type of correlation." }],
    coach: {
      keyWords: [{ text: "correlation", why: "Positive, negative or none." }],
      clues: ["Ignore the outlier.", "As hours go up, what happens to scores?", "Name the type of correlation."],
      traps: ["Did you use the word 'positive' or 'negative'?"],
    },
  },
  {
    id: "cca3-q6c", source: { paper: SRC, q: "6", part: "c" }, topic: "scatter", tier: "H", calculator: true,
    prompt: "By drawing a line of best fit, estimate the test score of a student who revised for 7½ hours.<br><small>Describe or sketch your line of best fit in your working, then give your estimate.</small>",
    promptText: `${SCAT_T} By drawing a line of best fit (ignoring the outlier), estimate the test score of a student who revised for 7.5 hours.`,
    diagram: scatter, marks: 2, answer: "About 65", solution: ["Line of best fit through the middle of the points, ignoring (6, 25)", "Read up from 7.5 hours: about 65"], noWorking: "full",
    points: [
      { id: "M1", code: "M1", criterion: "A straight line of best fit through the middle of the points, ignoring the outlier.", accept: ["two points on their line stated, e.g. (1, 22) and (9, 74)", "a sketch of the line"] },
      { id: "A1", code: "A1", dep: ["M1"], criterion: "An answer in the range 61 to 68, read from their line at 7.5 hours." },
    ],
    errors: [{ id: "wrong-form", looksLike: "forced the line through the origin, joined the points dot to dot, or gave an estimate with no line" }],
    markerNotes: ["The student can't draw on the printed graph. Accept a described or sketched line of best fit (two points on it, or a sketch) as evidence for M1."],
    dangerZones: [{ id: "line", when: "the student is drawing the line", warn: "One straight line through the middle, ignoring the outlier." }],
    coach: {
      keyWords: [{ text: "line of best fit", why: "One straight line through the middle of the points." }],
      clues: ["Ignore the outlier.", "Draw one straight line with about the same number of points either side.", "Read up from 7.5 to the line, then across."],
      traps: ["Is your estimate between 61 and 68?"],
    },
  },
  {
    id: "cca3-q7", source: { paper: SRC, q: "7" }, topic: "simlin", tier: "H", calculator: true,
    prompt: "Solve the simultaneous equations<br><span class=\"eq\">4x + 3y = 5</span><br><span class=\"eq\">6x − 5y = 36</span>",
    marks: 4, answer: "x = 3.5, y = −3", solution: ["20x + 15y = 25 and 18x − 15y = 108", "38x = 133, x = 3.5", "4(3.5) + 3y = 5, y = −3"], noWorking: "full",
    showWorking: "Write the scaled equations and the elimination step.",
    points: [
      { id: "M1a", code: "M1", criterion: "Makes one pair of coefficients equal, e.g. 20x + 15y = 25 and 18x − 15y = 108", reject: ["right-hand side not multiplied"] },
      { id: "M1b", code: "M1", ft: true, dep: ["M1a"], criterion: "Adds to eliminate y: 38x = 133" },
      { id: "A1a", code: "A1", dep: ["M1b"], criterion: "x = 3.5" },
      { id: "A1b", code: "A1", dep: ["M1b"], criterion: "y = −3" },
    ],
    errors: [
      { id: "subtracted", looksLike: "subtracted when the signs of the matching terms were different" },
      { id: "missed-term", looksLike: "forgot to multiply the right-hand side" },
      { id: "stopped-early", looksLike: "assumed the answers must be whole numbers and abandoned a correct method" },
    ],
    markerNotes: ["Check: 6 × 3.5 − 5 × (−3) = 36."],
    dangerZones: [
      { id: "signs", when: "coefficients have been matched", warn: "Different signs: add." },
      { id: "decimal", when: "a non-whole value appears", warn: "Answers don't have to be whole numbers. Keep going." },
    ],
    coach: {
      keyWords: [{ text: "Solve the simultaneous equations", why: "Find both x and y." }],
      clues: ["Make the y coefficients match: × 5 and × 3.", "The y terms have different signs: add.", "Solve for x, then substitute to find y."],
      traps: ["Do both values work in the second equation?"],
    },
  },
  {
    id: "cca3-q8a", source: { paper: SRC, q: "8", part: "a" }, topic: "linineq", tier: "H", calculator: true,
    prompt: "Solve &nbsp;<span class=\"eq\">3(2x − 1) &gt; 4x + 9</span>", promptText: "Solve 3(2x − 1) > 4x + 9.",
    marks: 2, answer: "x > 6", solution: ["6x − 3 > 4x + 9", "2x > 12"], noWorking: "full",
    points: [
      { id: "M1", code: "M1", criterion: "6x − 3 > 4x + 9" },
      { id: "A1", code: "A1", dep: ["M1"], criterion: "x > 6", reject: ["x = 6"] },
    ],
    errors: [{ id: "wrong-form", looksLike: "wrote x = 6 or dropped the inequality sign" }],
    dangerZones: [{ id: "sign", when: "the student is finishing", warn: "Keep the inequality sign." }],
    coach: {
      keyWords: [{ text: "Solve", why: "Keep the > sign throughout." }],
      clues: ["Expand the bracket.", "Collect x terms on one side.", "Divide, keeping the sign."],
      traps: ["Is your answer an inequality?"],
    },
  },
  {
    id: "cca3-q8b", source: { paper: SRC, q: "8", part: "b" }, topic: "linineq", tier: "H", calculator: true,
    prompt: "Write down the smallest integer that satisfies &nbsp;<span class=\"eq\">3(2x − 1) &gt; 4x + 9</span>", promptText: "3(2x − 1) > 4x + 9 gives x > 6. Write down the smallest integer that satisfies it.",
    marks: 1, answer: "7", solution: ["x > 6, so the smallest integer is 7"], noWorking: "full",
    points: [{ id: "B1", code: "B1", ft: true, criterion: "7", reject: ["6"] }],
    errors: [{ id: "inequality-region", looksLike: "answered 6: x must be greater than 6, so 6 itself isn't allowed" }],
    dangerZones: [{ id: "strict", when: "the student is choosing the integer", warn: "Greater than 6: is 6 allowed?" }],
    coach: {
      keyWords: [{ text: "smallest integer", why: "The first whole number that works." }],
      clues: ["Use your answer to (a).", "x > 6 doesn't include 6.", "What's the next whole number?"],
      traps: ["Does 6 satisfy x > 6?"],
    },
  },
  {
    id: "cca3-q9a", source: { paper: SRC, q: "9", part: "a" }, topic: "arcs", tier: "H", calculator: true,
    prompt: "OAB is a sector of a circle, centre O.<br>The radius of the circle is 9.4 cm. Angle AOB = 72°<br>Work out the area of the sector. Give your answer correct to 3 significant figures.",
    diagram: sector72, marks: 2, answer: "55.5 cm²", solution: ["72/360 × π × 9.4² = 55.52…"], noWorking: "full",
    points: [
      { id: "M1", code: "M1", criterion: "72/360 × π × 9.4²", reject: ["72/180"] },
      { id: "A1", code: "A1", dep: ["M1"], criterion: "55.5" },
    ],
    errors: [{ id: "wrong-formula", looksLike: "swapped the formulas (area uses πr²) or used 180" }],
    dangerZones: [{ id: "frac", when: "the student is writing the fraction", warn: "A full turn is 360°." }],
    coach: {
      keyWords: [{ text: "area of the sector", why: "A fraction of πr²." }],
      clues: ["The sector is 72/360 of the circle.", "Circle area = πr².", "Multiply."],
      traps: ["Did you use 360?"],
    },
  },
  {
    id: "cca3-q9b", source: { paper: SRC, q: "9", part: "b" }, topic: "arcs", tier: "H", calculator: true,
    prompt: "Work out the length of the arc AB. Give your answer correct to 3 significant figures.",
    promptText: "Sector OAB, radius 9.4 cm, angle AOB = 72°. Work out the length of the arc AB, correct to 3 significant figures.",
    diagram: sector72, marks: 2, answer: "11.8 cm", solution: ["72/360 × 2 × π × 9.4 = 11.81…"], noWorking: "full",
    points: [
      { id: "M1", code: "M1", criterion: "72/360 × 2 × π × 9.4" },
      { id: "A1", code: "A1", dep: ["M1"], criterion: "11.8", reject: ["30.6 (perimeter)"] },
    ],
    errors: [{ id: "wrong-share", looksLike: "added the two radii: the question asks for the arc, not the perimeter" }],
    dangerZones: [{ id: "arc", when: "the arc length has been found", warn: "Arc only: no radii." }],
    coach: {
      keyWords: [{ text: "length of the arc", why: "Only the curved edge." }],
      clues: ["The arc is 72/360 of the circumference.", "Circumference = 2πr.", "Multiply."],
      traps: ["Did you leave out the radii?"],
    },
  },
  {
    id: "cca3-q10a", source: { paper: SRC, q: "10", part: "a" }, topic: "prob", tier: "H", calculator: true,
    prompt: `A biased spinner can land on red, blue, green or yellow.<br>The table shows the probability of each colour.${spinTable}Work out the probability that the spinner lands on green.`,
    promptText: `${SPIN} Work out the probability that the spinner lands on green.`,
    marks: 2, answer: "0.3", solution: ["3x = 1 − 0.35 − 0.2 = 0.45", "x = 0.15", "P(green) = 2x"], noWorking: "full",
    points: [
      { id: "M1", code: "M1", criterion: "3x = 1 − 0.35 − 0.2 = 0.45" },
      { id: "A1", code: "A1", dep: ["M1"], criterion: "P(green) = 2x = 0.3", reject: ["0.15 (x, yellow)"] },
    ],
    errors: [
      { id: "stopped-early", looksLike: "stopped at x = 0.15: that's the probability of yellow; green is 2x" },
      { id: "wrong-formula", looksLike: "forgot that all the probabilities add up to 1" },
    ],
    dangerZones: [{ id: "green", when: "x has been found", warn: "Green is 2x." }],
    coach: {
      keyWords: [{ text: "green", why: "2x, not x." }],
      clues: ["All the probabilities add up to 1.", "Take red and blue away from 1: that leaves 2x + x.", "Find x, then double it for green."],
      traps: ["Is your answer 2x?"],
    },
  },
  {
    id: "cca3-q10b", source: { paper: SRC, q: "10", part: "b" }, topic: "relfreq", tier: "H", calculator: true,
    prompt: "The spinner is spun 400 times.<br>Work out an estimate for the number of times the spinner lands on yellow.",
    promptText: `${SPIN} (x = 0.15.) The spinner is spun 400 times. Estimate the number of times it lands on yellow.`,
    marks: 2, answer: "60 times", solution: ["P(yellow) = 0.15", "0.15 × 400"], noWorking: "full",
    points: [
      { id: "M1", code: "M1", ft: true, criterion: "0.15 × 400", reject: ["0.3 × 400"] },
      { id: "A1", code: "A1", dep: ["M1"], criterion: "60" },
    ],
    errors: [{ id: "wrong-share", looksLike: "used the probability of green" }],
    dangerZones: [{ id: "which", when: "the student is multiplying by 400", warn: "Yellow is x." }],
    coach: {
      keyWords: [{ text: "yellow", why: "Probability x." }, { text: "400 times", why: "Expected = probability × trials." }],
      clues: ["P(yellow) = x.", "Expected number = probability × number of spins.", "Multiply."],
      traps: ["Did you use yellow's probability?"],
    },
  },
  {
    id: "cca3-q11", source: { paper: SRC, q: "11" }, topic: "dirprop", tier: "H", calculator: true,
    prompt: "The time, T seconds, for one swing of a pendulum is directly proportional to the square root of its length, L metres.<br>T = 2.2 when L = 1.21<br>Work out the value of T when L = 2.25",
    marks: 3, answer: "T = 3", solution: ["T = k√L", "2.2 = k × 1.1, so k = 2", "T = 2 × √2.25 = 2 × 1.5"], noWorking: "full",
    showWorking: "Start with T = k√L written down.",
    points: [
      { id: "M1a", code: "M1", criterion: "T = k√L", reject: ["T = kL"] },
      { id: "M1b", code: "M1", dep: ["M1a"], criterion: "2.2 = k × 1.1, so k = 2" },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "T = 2 × √2.25 = 3", reject: ["4.09 (from T = kL)"] },
    ],
    errors: [
      { id: "no-sqrt", looksLike: "used T = kL, giving k = 1.818… and T = 4.09" },
      { id: "missed-square", looksLike: "squared when the question says square root" },
    ],
    dangerZones: [{ id: "form", when: "the student is writing the formula", warn: "Proportional to the square root of L." }],
    coach: {
      keyWords: [{ text: "square root of its length", why: "T = k√L." }],
      clues: ["Write T = k√L.", "√1.21 = 1.1. Find k.", "Use L = 2.25."],
      traps: ["Is √L in your formula?"],
    },
  },
  {
    id: "cca3-q12", source: { paper: SRC, q: "12" }, topic: "errint", tier: "H", calculator: true,
    prompt: "A number, x, is truncated to 1 decimal place.<br>The result is 6.4<br>Write down the error interval for x.",
    marks: 2, answer: "6.4 ≤ x < 6.5", solution: ["Truncated: later digits cut off", "6.4 ≤ x < 6.5"], noWorking: "full",
    points: [
      { id: "B1a", code: "B1", criterion: "6.4 and 6.5 seen." },
      { id: "B1b", code: "B1", criterion: "6.4 ≤ x < 6.5", reject: ["6.35 ≤ x < 6.45 (rounding)"] },
    ],
    errors: [{ id: "bounds-half", looksLike: "treated truncation as rounding and wrote 6.35 ≤ x < 6.45" }],
    dangerZones: [{ id: "trunc", when: "the student is writing the bounds", warn: "Truncated, not rounded: digits were cut off." }],
    coach: {
      keyWords: [{ text: "truncated", why: "Cut off, not rounded. x could be 6.4 up to but not including 6.5." }],
      clues: ["Truncating just chops off later digits.", "So x starts at 6.4.", "x is less than 6.5."],
      traps: ["Is your interval from 6.4, not 6.35?"],
    },
  },
  {
    id: "cca3-q13", source: { paper: SRC, q: "13" }, topic: "nthquad", tier: "H", calculator: true,
    prompt: "Here are the first four terms of a quadratic sequence.<br><span class=\"eq\">3 &nbsp;&nbsp; 10 &nbsp;&nbsp; 21 &nbsp;&nbsp; 36</span><br>Find an expression, in terms of n, for the nth term of this sequence.",
    promptText: "Quadratic sequence: 3, 10, 21, 36. Find an expression, in terms of n, for the nth term.",
    marks: 3, answer: "2n² + n", solution: ["Differences 7, 11, 15; second difference 4", "2n²: 2, 8, 18, 32", "Remainder 1, 2, 3, 4 = n"], noWorking: "full",
    points: [
      { id: "M1a", code: "M1", criterion: "Second difference is 4, so the sequence starts with 2n²", reject: ["4n²"] },
      { id: "M1b", code: "M1", ft: true, dep: ["M1a"], criterion: "Subtracts 2n² from each term: 1, 2, 3, 4, which is n" },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "2n² + n" },
    ],
    errors: [
      { id: "second-difference", looksLike: "used the second difference itself as the coefficient (4n²): it must be halved" },
      { id: "stopped-early", looksLike: "stopped at 2n²" },
    ],
    markerNotes: ["Check with n = 3: 2 × 9 + 3 = 21."],
    dangerZones: [{ id: "halve", when: "the second difference has been found", warn: "Halve it for the n² coefficient." }],
    coach: {
      keyWords: [{ text: "quadratic sequence", why: "Expect an n² term." }],
      clues: ["Find the first and second differences.", "Halve the second difference for the n² coefficient.", "Subtract 2n² and find the rule for what's left."],
      traps: ["Does n = 3 give 21?"],
    },
  },
  {
    id: "cca3-q14a", source: { paper: SRC, q: "14", part: "a" }, topic: "cumfreq", tier: "H", calculator: true,
    prompt: `The table shows information about the heights, h cm, of 60 plants.${plantTable}Complete the cumulative frequency column in the table.`,
    promptText: "Heights of 60 plants: 0 < h ≤ 10: 4; 10 < h ≤ 20: 11; 20 < h ≤ 30: 20; 30 < h ≤ 40: 17; 40 < h ≤ 50: 8. Complete the cumulative frequency column.",
    marks: 1, answer: "4, 15, 35, 52, 60", solution: ["Running totals: 4, 4 + 11, 15 + 20, 35 + 17, 52 + 8"], noWorking: "full",
    points: [{ id: "B1", code: "B1", criterion: "4, 15, 35, 52, 60" }],
    errors: [{ id: "wrong-operation", looksLike: "copied the frequencies instead of the running totals" }],
    dangerZones: [{ id: "running", when: "the student is filling the column", warn: "Each entry adds on the next frequency." }],
    coach: {
      keyWords: [{ text: "cumulative frequency", why: "Running total." }],
      clues: ["Start with 4.", "Add each new frequency to the total so far.", "The last entry should be 60."],
      traps: ["Does your last entry equal 60?"],
    },
  },
  {
    id: "cca3-q14b", source: { paper: SRC, q: "14", part: "b" }, topic: "cumfreq", tier: "H", calculator: true,
    prompt: "On the grid, draw a cumulative frequency graph for this information.<br><small>Sketch your graph in your working with the plotted points labelled.</small>",
    promptText: `${PLANT} Draw a cumulative frequency graph (height 0 to 50 across, cumulative frequency 0 to 60 up).`,
    diagram: cfGrid, marks: 2, answer: "Points (10, 4), (20, 15), (30, 35), (40, 52), (50, 60) joined from (0, 0)", solution: ["Plot at the upper class boundaries", "Join with a smooth curve or straight segments, starting at (0, 0)"], noWorking: "full",
    points: [
      { id: "M1", code: "M1", ft: true, criterion: "At least four points plotted at the upper end of each class: (10, 4), (20, 15), (30, 35), (40, 52), (50, 60).", reject: ["points at class midpoints (5, 15, 25…)"] },
      { id: "A1", code: "A1", dep: ["M1"], criterion: "All five points correct and joined with a smooth curve or straight line segments, starting from (0, 0)." },
    ],
    errors: [
      { id: "midpoint", looksLike: "plotted each point at the middle of its class: cumulative frequency is always plotted at the upper class boundary" },
      { id: "wrong-operation", looksLike: "plotted the frequencies and not the running totals" },
    ],
    markerNotes: ["The student can't draw on the printed grid. Accept a sketch with the plotted points labelled, or the five coordinates listed with a description of the curve from (0, 0)."],
    dangerZones: [{ id: "upper", when: "the student is plotting", warn: "Plot at the end of each class." }],
    coach: {
      keyWords: [{ text: "cumulative frequency graph", why: "Running totals at upper class boundaries." }],
      clues: ["Plot (10, 4), (20, 15) and so on.", "Start the graph at (0, 0).", "Join with a smooth curve."],
      traps: ["Did you plot at the upper boundary of each class?"],
    },
  },
  {
    id: "cca3-q14c", source: { paper: SRC, q: "14", part: "c" }, topic: "cumfreq", tier: "H", calculator: true,
    prompt: "Use your graph to find an estimate for the median height.", promptText: `${PLANT} Use the cumulative frequency graph to estimate the median height.`,
    marks: 1, answer: "About 27.5 cm", solution: ["Read across from 30 (half of 60)", "≈ 27.5 cm"], noWorking: "full",
    points: [{ id: "B1", code: "B1", ft: true, criterion: "An answer in the range 26 to 29, read from their graph at a cumulative frequency of 30.", reject: ["reading from 60"] }],
    errors: [{ id: "wrong-direction", looksLike: "read across from 60 and not from half of 60" }],
    dangerZones: [{ id: "half", when: "the student is reading the median", warn: "Start at half of 60." }],
    coach: {
      keyWords: [{ text: "median", why: "The middle plant: the 30th." }],
      clues: ["Half of 60 is 30.", "Go across from 30 to your curve.", "Go down and read the height."],
      traps: ["Did you start at 30?"],
    },
  },
  {
    id: "cca3-q15a", source: { paper: SRC, q: "15", part: "a" }, topic: "graphshape", tier: "H", calculator: true,
    prompt: `Complete the table of values for &nbsp;<span class="eq">y = x<sup>3</sup> − 3x + 1</span>${cubicTable}`,
    promptText: "Complete the table of values for y = x³ − 3x + 1 for x = −2, −1.5, −1, −0.5, 0, 0.5, 1, 1.5, 2. Given: −1, ?, 3, 2.375, 1, ?, −1, ?, 3. Missing at x = −1.5, 0.5, 1.5.",
    marks: 2, answer: "2.125, −0.375, −0.125", solution: ["x = −1.5: −3.375 + 4.5 + 1 = 2.125", "x = 0.5: 0.125 − 1.5 + 1 = −0.375", "x = 1.5: 3.375 − 4.5 + 1 = −0.125"], noWorking: "full",
    points: [
      { id: "B1a", code: "B1", criterion: "One or two of 2.125, −0.375, −0.125 correct." },
      { id: "B1b", code: "B1", criterion: "All three values correct: 2.125, −0.375, −0.125." },
    ],
    errors: [{ id: "sign-error", looksLike: "typed −1.5³ without brackets: always use (−1.5)³" }],
    markerNotes: ["Mike's scheme is B2 (B1 for one or two correct)."],
    dangerZones: [{ id: "brackets", when: "the student is substituting a negative", warn: "Put negative numbers in brackets on the calculator." }],
    coach: {
      keyWords: [{ text: "table of values", why: "Substitute each x." }],
      clues: ["Substitute x = −1.5, 0.5 and 1.5.", "Use brackets: (−1.5)³.", "Check the values fit the pattern."],
      traps: ["Did you bracket the negative?"],
    },
  },
  {
    id: "cca3-q15b", source: { paper: SRC, q: "15", part: "b" }, topic: "graphshape", tier: "H", calculator: true,
    prompt: "On the grid, draw the graph of &nbsp;<span class=\"eq\">y = x<sup>3</sup> − 3x + 1</span>&nbsp; for values of x from −2 to 2<br><small>Sketch the axes and curve in your working, with the plotted points marked.</small>",
    promptText: `${CUBIC} Draw the graph for x from −2 to 2.`,
    diagram: cubicGrid, marks: 2, answer: "Smooth S-shaped curve through the nine points", solution: ["Plot the nine points", "Join with a smooth curve: maximum near (−1, 3), minimum near (1, −1)"], noWorking: "full",
    points: [
      { id: "M1", code: "M1", ft: true, criterion: "At least seven points plotted correctly (ft their table)." },
      { id: "A1", code: "A1", dep: ["M1"], criterion: "A smooth curve through all nine points.", reject: ["straight-line segments"] },
    ],
    errors: [{ id: "wrong-form", looksLike: "joined the points with a ruler" }],
    markerNotes: ["The student can't draw on the printed grid. Judge from their sketch: points at the right coordinates and a smooth curve through them."],
    dangerZones: [{ id: "smooth", when: "the points have been plotted", warn: "Join with a smooth curve, not straight lines." }],
    coach: {
      keyWords: [{ text: "draw the graph", why: "Plot every point, then a smooth curve." }],
      clues: ["Plot all nine points from the table.", "The curve peaks near (−1, 3) and dips near (1, −1).", "Join with one smooth curve."],
      traps: ["Is the curve smooth?"],
    },
  },
  {
    id: "cca3-q15c", source: { paper: SRC, q: "15", part: "c" }, topic: "graphshape", tier: "H", calculator: true,
    prompt: "Use your graph to find estimates for the three solutions of &nbsp;<span class=\"eq\">x<sup>3</sup> − 3x + 1 = 0</span>",
    promptText: `${CUBIC} Use the graph to estimate the three solutions of x³ − 3x + 1 = 0.`,
    marks: 2, answer: "x = −1.9, 0.3 and 1.5", solution: ["Read where the curve crosses the x-axis three times"], noWorking: "full",
    points: [
      { id: "B1a", code: "B1", ft: true, criterion: "Two of −1.9, 0.3 (or 0.35) and 1.5, each within ±0.1 (ft their graph)." },
      { id: "B1b", code: "B1", ft: true, criterion: "All three: −1.9, 0.3 (or 0.35) and 1.5, each within ±0.1." },
    ],
    errors: [{ id: "stopped-early", looksLike: "gave fewer than three solutions: the curve crosses the x-axis three times" }],
    markerNotes: ["Mike's scheme is B2 (B1 for two correct)."],
    dangerZones: [{ id: "three", when: "the student has one or two crossings", warn: "How many times does the curve cross the x-axis?" }],
    coach: {
      keyWords: [{ text: "three solutions", why: "Three crossings of the x-axis." }],
      clues: ["Solutions are where y = 0.", "Find all three crossings.", "Read each x value to 1 decimal place."],
      traps: ["Have you given three values?"],
    },
  },
  {
    id: "cca3-q16", source: { paper: SRC, q: "16" }, topic: "trig", tier: "H", calculator: true,
    prompt: "The diagram shows two right-angled triangles, ABC and ACD.<br>AB = 7.5 cm &nbsp;&nbsp; BC = 4 cm &nbsp;&nbsp; Angle ABC = angle ACD = 90° &nbsp;&nbsp; Angle CAD = 38°<br>Work out the length of CD. Give your answer correct to 3 significant figures.",
    diagram: twoTriangles, marks: 4, answer: "6.64 cm", solution: ["AC² = 7.5² + 4² = 72.25", "AC = 8.5", "CD = 8.5 × tan 38°", "= 6.6409…"], noWorking: "full",
    showWorking: "Find AC first and write it down.",
    points: [
      { id: "M1a", code: "M1", criterion: "AC² = 7.5² + 4²" },
      { id: "A1a", code: "A1", dep: ["M1a"], criterion: "AC = 8.5" },
      { id: "M1b", code: "M1", ft: true, criterion: "CD = 8.5 × tan 38°", reject: ["sin or cos (5.23 or 6.70)"] },
      { id: "A1b", code: "A1", dep: ["M1b"], criterion: "6.64 (from 6.6409…)" },
    ],
    errors: [
      { id: "stopped-early", looksLike: "didn't see that AC is needed first: it's the side the two triangles share" },
      { id: "wrong-ratio", looksLike: "used sin or cos (giving 5.23 or 6.70): AC is adjacent and CD is opposite, so it's tan" },
    ],
    dangerZones: [
      { id: "ac", when: "the student starts", warn: "Which side do the two triangles share?" },
      { id: "ratio", when: "the student is choosing a ratio in triangle ACD", warn: "Label from the 38° angle: CD is opposite, AC is adjacent." },
    ],
    coach: {
      keyWords: [{ text: "two right-angled triangles", why: "Solve one to get the side you need for the other." }],
      clues: ["Find AC using Pythagoras in triangle ABC.", "In triangle ACD, the right angle is at C.", "From 38°: CD is opposite, AC is adjacent. Use tan."],
      traps: ["Did you use tan?"],
    },
  },
  {
    id: "cca3-q17", source: { paper: SRC, q: "17" }, topic: "rearr", tier: "H", calculator: true,
    prompt: `Make q the subject of the formula &nbsp;<span class="eq">p = ${fr("3 − 2q", "q + 4")}</span>`, promptText: "Make q the subject of the formula p = (3 − 2q)/(q + 4).",
    marks: 4, answer: "q = (3 − 4p)/(p + 2)", solution: ["p(q + 4) = 3 − 2q", "pq + 4p = 3 − 2q", "pq + 2q = 3 − 4p", "q(p + 2) = 3 − 4p", "q = (3 − 4p)/(p + 2)"], noWorking: "full",
    showWorking: "Write each line: multiply up, collect, factorise.",
    points: [
      { id: "M1a", code: "M1", criterion: "Multiplies by the denominator: p(q + 4) = 3 − 2q" },
      { id: "M1b", code: "M1", ft: true, dep: ["M1a"], criterion: "Expands and collects the q terms: pq + 2q = 3 − 4p", reject: ["pq + 4 (4 not multiplied by p)"] },
      { id: "M1c", code: "M1", ft: true, dep: ["M1b"], criterion: "Factorises: q(p + 2) = 3 − 4p" },
      { id: "A1", code: "A1", dep: ["M1c"], criterion: "q = (3 − 4p)/(p + 2)", reject: ["q on both sides"] },
    ],
    errors: [
      { id: "missed-term", looksLike: "wrote pq + 4 and not pq + 4p" },
      { id: "stopped-early", looksLike: "left q on both sides" },
      { id: "sign-error", looksLike: "sign errors when moving −2q and 4p across" },
    ],
    dangerZones: [{ id: "collect", when: "q appears on both sides", warn: "Collect the q terms on one side and factorise." }],
    coach: {
      keyWords: [{ text: "Make q the subject", why: "q appears twice: collect and factorise." }],
      clues: ["Multiply both sides by (q + 4).", "Expand, then get both q terms on one side.", "Factorise q out and divide."],
      traps: ["Is q only on the left?"],
    },
  },
  {
    id: "cca3-q18", source: { paper: SRC, q: "18" }, topic: "circthm", tier: "H", calculator: true,
    prompt: "A, B, C and D are points on a circle.<br>AC and BD intersect at the point X.<br>Angle ABD = 34° &nbsp;&nbsp; Angle BDC = 47°<br>Work out the size of angle AXB.<br>Give a reason for each stage of your working.",
    diagram: chords, marks: 4, answer: "99°", solution: ["Angle BAC = angle BDC = 47° (angles in the same segment are equal)", "Angle AXB = 180 − 47 − 34 = 99° (angles in a triangle add up to 180°)"], noWorking: "full",
    showWorking: "Write each angle with its reason.",
    points: [
      { id: "M1a", code: "M1", criterion: "Angle BAC = 47° (or angle ACD = 34°)." },
      { id: "M1b", code: "M1", dep: ["M1a"], criterion: "180 − 47 − 34" },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "Angle AXB = 99°", reject: ["81° (angle AXD)"] },
      { id: "B1", code: "B1", criterion: "Reasons: angles in the same segment are equal and angles in a triangle add up to 180°.", reject: ["'bow tie' or 'butterfly'"] },
    ],
    errors: [
      { id: "wrong-share", looksLike: "added 34 and 47 to get 81°, which is angle AXD, the angle next to the one asked for" },
      { id: "wrong-form", looksLike: "gave the reason as 'bow tie' or 'butterfly': the mark needs 'angles in the same segment'" },
    ],
    dangerZones: [
      { id: "segment", when: "the student is finding an angle in triangle ABX", warn: "Which angles stand on the same arc?" },
      { id: "which", when: "the student has an angle at X", warn: "Is it angle AXB, or the one next to it?" },
    ],
    coach: {
      keyWords: [{ text: "angle AXB", why: "In triangle ABX." }, { text: "Give a reason for each stage", why: "Use the proper names." }],
      clues: ["Angles BAC and BDC both stand on arc BC.", "So angle BAC = 47°.", "Use the angles in triangle ABX."],
      traps: ["Is your answer angle AXB, not AXD?", "Did you write 'angles in the same segment'?"],
    },
  },
  {
    id: "cca3-q19", source: { paper: SRC, q: "19" }, topic: "units", tier: "H", calculator: true,
    prompt: "An empty tank is in the shape of a cuboid.<br>The tank measures 1.2 m by 0.8 m by 0.5 m.<br>Water flows into the tank at a rate of 2.5 litres per second.<br>1 m<sup>3</sup> = 1000 litres<br>Work out how long it takes to fill the tank completely.<br>Give your answer in minutes and seconds.",
    marks: 4, answer: "3 minutes 12 seconds", solution: ["Volume = 1.2 × 0.8 × 0.5 = 0.48 m³", "0.48 × 1000 = 480 litres", "480 ÷ 2.5 = 192 seconds", "= 3 minutes 12 seconds"], noWorking: "full",
    showWorking: "Write the volume, litres and seconds as separate lines.",
    points: [
      { id: "M1a", code: "M1", criterion: "Volume = 1.2 × 0.8 × 0.5 = 0.48 m³" },
      { id: "M1b", code: "M1", ft: true, dep: ["M1a"], criterion: "0.48 × 1000 = 480 litres" },
      { id: "M1c", code: "M1", ft: true, dep: ["M1b"], criterion: "480 ÷ 2.5 = 192 seconds", reject: ["× 2.5"] },
      { id: "A1", code: "A1", dep: ["M1c"], criterion: "3 minutes 12 seconds", reject: ["1 minute 92 seconds", "3 minutes 20 seconds"] },
    ],
    errors: [
      { id: "wrong-form", looksLike: "wrote 192 seconds as 1 minute 92 seconds, or 3.2 minutes as 3 minutes 20 seconds: 0.2 of a minute is 12 seconds" },
      { id: "wrong-operation", looksLike: "multiplied by 2.5 instead of dividing, or missed the conversion to litres" },
    ],
    dangerZones: [{ id: "mins", when: "a number of seconds has been found", warn: "60 seconds in a minute. 0.2 of a minute isn't 20 seconds." }],
    coach: {
      keyWords: [{ text: "minutes and seconds", why: "Convert seconds carefully at the end." }, { text: "litres per second", why: "Volume in litres ÷ rate." }],
      clues: ["Find the volume in m³ and change it to litres.", "Time in seconds = litres ÷ 2.5.", "Split the seconds into minutes and seconds."],
      traps: ["Did you convert using 60 seconds per minute?"],
    },
  },
  {
    id: "cca3-q20", source: { paper: SRC, q: "20" }, topic: "venn", tier: "H", calculator: true,
    prompt: "There are 30 students in a class.<br>18 of the students play football.<br>15 of the students play tennis.<br>4 of the students play neither football nor tennis.<br>One of the students who plays tennis is chosen at random.<br>Work out the probability that this student also plays football.",
    marks: 3, answer: "7/15", solution: ["Both: 18 + 15 + 4 − 30 = 7", "Chosen from the 15 tennis players", "7/15"], noWorking: "full",
    points: [
      { id: "M1a", code: "M1", criterion: "Number who play both: 18 + 15 + 4 − 30 = 7" },
      { id: "M1b", code: "M1", criterion: "A fraction with denominator 15.", reject: ["denominator 30"] },
      { id: "A1", code: "A1", dep: ["M1a", "M1b"], criterion: "7/15" },
    ],
    errors: [
      { id: "wrong-denominator", looksLike: "used 30 as the denominator: the student is chosen from the 15 who play tennis" },
      { id: "stopped-early", looksLike: "used 18 and 15 as 'football only' and 'tennis only', which makes more than 30 students" },
    ],
    dangerZones: [{ id: "given", when: "the student is writing the denominator", warn: "Chosen from the tennis players only." }],
    coach: {
      keyWords: [{ text: "who plays tennis", why: "Choose from the 15 tennis players." }, { text: "also plays football", why: "Both: the overlap." }],
      clues: ["Draw a Venn diagram: 30 − 4 = 26 inside the circles.", "18 + 15 − 26 play both.", "Divide by the 15 tennis players."],
      traps: ["Is your denominator 15?"],
    },
  },
  {
    id: "cca3-q21", source: { paper: SRC, q: "21" }, topic: "qineq", tier: "H", calculator: true,
    prompt: "Solve &nbsp;<span class=\"eq\">2x<sup>2</sup> − 5x − 12 ≥ 0</span>", promptText: "Solve 2x² − 5x − 12 ≥ 0.",
    marks: 4, answer: "x ≤ −1.5 or x ≥ 4", solution: ["(2x + 3)(x − 4)", "Critical values −1.5 and 4", "U-shaped curve: above the axis outside the roots", "x ≤ −1.5 or x ≥ 4"], noWorking: "full",
    showWorking: "Write the factorised form and the critical values.",
    points: [
      { id: "M1a", code: "M1", criterion: "Factorises: (2x + 3)(x − 4)" },
      { id: "A1a", code: "A1", dep: ["M1a"], criterion: "Critical values −1.5 and 4", reject: ["1.5 and −4"] },
      { id: "M1b", code: "M1", criterion: "Chooses the outside regions, e.g. from a sketch of the U-shaped curve." },
      { id: "A1b", code: "A1", dep: ["M1b"], criterion: "x ≤ −1.5 or x ≥ 4", reject: ["−1.5 ≤ x ≤ 4", "< or > instead of ≤ or ≥"] },
    ],
    errors: [
      { id: "inequality-region", looksLike: "wrote −1.5 ≤ x ≤ 4, the region between the critical values" },
      { id: "wrong-form", looksLike: "used < and > when the question has ≥" },
      { id: "sign-error", looksLike: "read the critical values with the wrong signs (1.5 and −4)" },
    ],
    dangerZones: [{ id: "region", when: "the critical values have been found", warn: "Sketch the U: where is it above the axis?" }],
    coach: {
      keyWords: [{ text: "≥", why: "Greater than or equal: where the curve is on or above the axis." }],
      clues: ["Factorise 2x² − 5x − 12.", "Find the critical values.", "Sketch the U-shaped curve: above the axis outside the roots."],
      traps: ["Did you keep ≤ and ≥?"],
    },
  },
  {
    id: "cca3-q22", source: { paper: SRC, q: "22" }, topic: "surface", tier: "H", calculator: true,
    prompt: "A solid hemisphere has a volume of 2000 cm<sup>3</sup><br>Work out the total surface area of the hemisphere.<br>Give your answer correct to 3 significant figures.",
    marks: 4, answer: "914 cm²", solution: ["⅔πr³ = 2000", "r³ = 3000/π, r = 9.847…", "Total surface area = 2πr² + πr² = 3πr²", "= 913.9…"], noWorking: "full",
    showWorking: "Write the volume equation, r, and the surface area formula.",
    points: [
      { id: "M1a", code: "M1", criterion: "⅔πr³ = 2000", reject: ["4/3 πr³ = 2000"] },
      { id: "M1b", code: "M1", dep: ["M1a"], criterion: "r³ = 3000/π, so r = 9.847…" },
      { id: "M1c", code: "M1", ft: true, criterion: "Total surface area = 2πr² + πr² = 3πr²", reject: ["2πr² only (base left out)"] },
      { id: "A1", code: "A1", dep: ["M1c"], criterion: "914 (from 913.9…)" },
    ],
    errors: [
      { id: "half", looksLike: "used the formula for a whole sphere, 4/3 πr³ = 2000, giving a radius of 7.82 cm" },
      { id: "stopped-early", looksLike: "forgot the flat circular face: a solid hemisphere has a curved surface (2πr²) and a base (πr²)" },
      { id: "rounding", looksLike: "rounded r to 9.8 before squaring" },
    ],
    dangerZones: [
      { id: "half", when: "the student is writing the volume formula", warn: "A hemisphere is half a sphere." },
      { id: "base", when: "the curved surface has been found", warn: "A solid hemisphere has a flat face too." },
    ],
    coach: {
      keyWords: [{ text: "solid hemisphere", why: "Half a sphere, with a flat circular base." }, { text: "total surface area", why: "Curved part plus the base." }],
      clues: ["Hemisphere volume = ⅔πr³. Set it equal to 2000 and find r.", "Curved surface = 2πr²; base = πr².", "Add them, keeping r unrounded."],
      traps: ["Did you include the flat face?"],
    },
  },
];
