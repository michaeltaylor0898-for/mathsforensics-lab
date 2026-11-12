// Cold Case A · Higher Paper 1 (non-calculator) · all 24 questions, 80 marks (CC-A/1H)
//
// Question wording is copied from the paper. Mark points follow Mike's Cold Case A Paper 1 Forensic
// Mark Scheme line for line; errors and Mike-mode danger zones come from its "Where the marks go
// missing" boxes. B2 marks are split into two B1 points, and answers drawn on a grid (Q10, Q14)
// have marker notes saying what to accept on a blank page.
import type { Scheme } from "../schemes.ts";

const fr = (n: string | number, d: string | number) => `<span class="fr"><span>${n}</span><span>${d}</span></span>`;
const SRC = "CC-A/1H";
const TXT = `font-family="Times New Roman,serif" fill="currentColor"`;
const NDA = (x: number, y: number) => `<text x="${x}" y="${y}" font-size="9" text-anchor="middle" fill="currentColor" opacity=".7" font-family="Arial,sans-serif">Not drawn accurately</text>`;
const table = (rows: (string | number)[][], headRow = true) =>
  `<table class="qt">${rows.map((r, i) => `<tr>${r.map((c, j) => ((headRow ? i : j) === 0 ? `<th>${c}</th>` : `<td>${c}</td>`)).join("")}</tr>`).join("")}</table>`;

// ---------- diagrams ----------
const pentHex = `<svg viewBox="30 10 255 175" role="img" aria-label="A regular pentagon on the left and a regular hexagon on the right share a vertical side. At the top end of the shared side, the angle x lies outside both shapes, between the pentagon's edge and the hexagon's edge."><g fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="150,60 150,130 83.4,151.6 42.3,95 83.4,38.4"/><polygon points="150,60 210.6,25 271.2,60 271.2,130 210.6,165 150,130"/><path d="M132.9 54.4 A18 18 0 0 1 165.6 51" stroke-width="1.2"/></g><text x="148" y="40" font-size="14" font-style="italic" text-anchor="middle" ${TXT}>x</text>${NDA(150, 182)}</svg>`;

const quadGrid = (() => {
  const ux = 38, uy = 18, x0 = -2, x1 = 4, y0 = -6, y1 = 5, pad = 24;
  const px = (x: number) => pad + (x - x0) * ux, py = (y: number) => pad + (y1 - y) * uy;
  const g: string[] = [], t: string[] = [];
  for (let x = x0; x <= x1; x++) g.push(`M${px(x)} ${py(y0)}V${py(y1)}`);
  for (let y = y0; y <= y1; y++) g.push(`M${px(x0)} ${py(y)}H${px(x1)}`);
  for (let x = x0; x <= x1; x++) if (x) t.push(`<text x="${px(x)}" y="${py(0) + 13}" text-anchor="middle">${x < 0 ? "−" + -x : x}</text>`);
  for (let y = y0; y <= y1; y++) if (y) t.push(`<text x="${px(0) - 5}" y="${py(y) + 4}" text-anchor="end">${y < 0 ? "−" + -y : y}</text>`);
  return `<svg viewBox="0 0 ${(x1 - x0) * ux + pad * 2} ${(y1 - y0) * uy + pad * 2}" role="img" aria-label="An empty grid with x from −2 to 4 and y from −6 to 5."><path d="${g.join("")}" stroke="currentColor" stroke-width=".5" opacity=".35" fill="none"/><path d="M${px(x0)} ${py(0)}H${px(x1) + 8}M${px(0)} ${py(y0)}V${py(y1) - 8}" stroke="currentColor" stroke-width="1.3"/><g font-size="11" ${TXT}>${t.join("")}<text x="${px(0) - 5}" y="${py(0) + 13}" text-anchor="end">O</text><text x="${px(x1) + 10}" y="${py(0) + 4}" font-style="italic">x</text><text x="${px(0) - 4}" y="${py(y1) - 10}" font-style="italic">y</text></g></svg>`;
})();

const histPuzzle = (() => {
  const X = (t: number) => 50 + t * 5.6, Y = (d: number) => 210 - d * 50;
  const minor: string[] = [], major: string[] = [], lab: string[] = [];
  for (let t = 0; t <= 50; t++) (t % 10 ? minor : major).push(`M${X(t)} ${Y(0)}V${Y(3.5)}`);
  for (let k = 0; k <= 35; k++) (k % 5 ? minor : major).push(`M${X(0)} ${Y(k / 10)}H${X(50)}`);
  for (let t = 0; t <= 50; t += 10) lab.push(`<text x="${X(t)}" y="226" text-anchor="middle">${t}</text>`);
  for (let k = 0; k <= 7; k++) lab.push(`<text x="44" y="${Y(k / 2) + 4}" text-anchor="end">${k === 0 ? "0" : (k / 2).toFixed(1)}</text>`);
  const bars = [[0, 10, 0.8], [10, 15, 2.4], [20, 30, 1.4]].map(([a, b, d]) => `<rect x="${X(a)}" y="${Y(d)}" width="${X(b) - X(a)}" height="${Y(0) - Y(d)}"/>`).join("");
  return `<svg viewBox="0 0 350 250" role="img" aria-label="Histogram with three bars drawn: 0 to 10 minutes at frequency density 0.8, 10 to 15 at 2.4, and 20 to 30 at 1.4. The bars for 15 to 20 and 30 to 50 are missing."><path d="${minor.join("")}" stroke="currentColor" stroke-width=".35" opacity=".3" fill="none"/><path d="${major.join("")}" stroke="currentColor" stroke-width=".7" opacity=".55" fill="none"/><g fill="currentColor" fill-opacity=".15" stroke="currentColor" stroke-width="1.4">${bars}</g><g font-size="11" ${TXT}>${lab.join("")}<text x="190" y="244" text-anchor="middle">Time (<tspan font-style="italic">t</tspan> minutes)</text><text transform="translate(14 125) rotate(-90)" text-anchor="middle">Frequency density</text></g></svg>`;
})();

const tangentCircle = `<svg viewBox="0 0 260 190" role="img" aria-label="A circle with centre O. A is at the bottom of the circle and TA is a horizontal tangent at A, with T to the right. B is on the circle, up and to the right. Angle BAT is 58 degrees."><circle cx="130" cy="90" r="60" fill="none" stroke="currentColor" stroke-width="1.5"/><g fill="none" stroke="currentColor" stroke-width="1.4"><path d="M60 150 H240 M130 150 L183.9 63.7 M130 90 L130 150 M130 90 L183.9 63.7"/><path d="M155 150 A25 25 0 0 0 143.2 128.8" stroke-width="1.1"/></g><circle cx="130" cy="90" r="2" fill="currentColor"/><g ${TXT} font-size="13"><text x="118" y="88" font-style="italic">O</text><text x="188" y="60" font-style="italic">B</text><text x="126" y="168" font-style="italic">A</text><text x="236" y="168" font-style="italic">T</text><text x="152" y="140" font-size="11">58°</text></g>${NDA(130, 186)}</svg>`;

const tri60 = `<svg viewBox="0 -14 280 164" role="img" aria-label="Triangle ABC with AC along the bottom, 8 cm. AB is 5 cm and angle BAC is 60 degrees."><path d="M30 125 L250 125 L98.8 5.9 Z" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M58 125 A28 28 0 0 0 44 100.8" fill="none" stroke="currentColor" stroke-width="1.1"/><g ${TXT} font-size="12"><text x="94" y="0" dy="4" font-style="italic">B</text><text x="18" y="129" font-style="italic">A</text><text x="254" y="129" font-style="italic">C</text><text x="58" y="62" text-anchor="end">5 cm</text><text x="60" y="117">60°</text><text x="140" y="141" text-anchor="middle">8 cm</text></g></svg>`;

const vecOABC = `<svg viewBox="0 0 300 180" role="img" aria-label="Triangle OAB with OBC a straight line. O at the left, B in the middle and C on the right of the bottom line. A is at the top. OA = 3a and OB = 3b. M is on OA and N is the midpoint of AB."><g fill="none" stroke="currentColor" stroke-width="1.5"><path d="M30 150 L70 20 L150 150 M30 150 H270"/></g><g fill="currentColor"><circle cx="56.7" cy="63.3" r="2.5"/><circle cx="110" cy="85" r="2.5"/><circle cx="270" cy="150" r="2.5"/></g><g ${TXT} font-size="13"><text x="66" y="14" font-style="italic">A</text><text x="18" y="160" font-style="italic">O</text><text x="146" y="166" font-style="italic">B</text><text x="266" y="166" font-style="italic">C</text><text x="40" y="62" font-style="italic">M</text><text x="116" y="84" font-style="italic">N</text><text x="38" y="106" text-anchor="end">3<tspan font-weight="bold">a</tspan></text><text x="84" y="166">3<tspan font-weight="bold">b</tspan></text></g>${NDA(150, 177)}</svg>`;

const PUZ = "The table and the histogram give information about the time, t minutes, that some people took to complete a puzzle.";
const PUZ_T = "Histogram and table for puzzle times: 0 < t ≤ 10 frequency 8 (bar height 0.8); 10 < t ≤ 15 bar height 2.4 (frequency missing from the table); 15 < t ≤ 20 frequency 15 (bar missing); 20 < t ≤ 30 bar height 1.4 (frequency missing); 30 < t ≤ 50 frequency 8 (bar missing).";
const puzTable = table([["Time (t minutes)", "Frequency"], ["0 &lt; t ≤ 10", 8], ["10 &lt; t ≤ 15", ""], ["15 &lt; t ≤ 20", 15], ["20 &lt; t ≤ 30", ""], ["30 &lt; t ≤ 50", 8]]);
const FG = "The functions f and g are such that f(x) = 3x − 2 and g(x) = x² + 1.";
const VEC = "OAB is a triangle. OBC is a straight line. OA = 3a, OB = 3b. M is the point on OA such that OM : MA = 2 : 1. N is the midpoint of AB. B is the midpoint of OC.";

export const COLD_CASE_A1: Scheme[] = [
  {
    id: "cca1-q1", source: { paper: SRC, q: "1" }, topic: "frac", tier: "H", calculator: false,
    prompt: `Work out &nbsp;<span class="eq">3${fr(1, 5)} − 1${fr(3, 4)}</span><br>Give your answer as a mixed number in its simplest form.`,
    promptText: "Work out 3 1/5 − 1 3/4. Give your answer as a mixed number in its simplest form.",
    marks: 3, answer: "1 9/20", solution: ["16/5 − 7/4", "= 64/20 − 35/20", "= 29/20", "= 1 9/20"], noWorking: "full",
    showWorking: "Write both fractions over 20 before subtracting.",
    points: [
      { id: "M1a", code: "M1", criterion: "Converts to improper fractions, 16/5 and 7/4 (or deals with the whole numbers and fractions separately, 2 + 1/5 − 3/4)." },
      { id: "M1b", code: "M1", ft: true, criterion: "Writes both fractions with a common denominator, e.g. 64/20 − 35/20." },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "1 9/20", reject: ["29/20 (not a mixed number)", "2 11/20"] },
    ],
    errors: [
      { id: "wrong-form", looksLike: "stopped at 29/20: the question asks for a mixed number" },
      { id: "wrong-direction", looksLike: "worked out 3 − 1 = 2 and then 3/4 − 1/5 the wrong way round, giving 2 11/20" },
    ],
    dangerZones: [{ id: "borrow", when: "the student is subtracting the fraction parts separately", warn: "1/5 is smaller than 3/4. Convert to improper fractions to be safe." }],
    coach: {
      keyWords: [{ text: "mixed number", why: "Whole number and a proper fraction." }, { text: "−", why: "Subtracting: careful when the second fraction is bigger." }],
      clues: ["Change both to improper fractions.", "Use 20 as the common denominator.", "Subtract, then change back to a mixed number."],
      traps: ["Is the fraction part simplified and less than 1?"],
    },
  },
  {
    id: "cca1-q2", source: { paper: SRC, q: "2" }, topic: "round", tier: "H", calculator: false,
    prompt: `Work out an estimate for the value of &nbsp;<span class="eq">${fr("5.92 × 31.4", "0.49")}</span>`,
    promptText: "Work out an estimate for the value of (5.92 × 31.4) / 0.49.",
    marks: 2, answer: "360", solution: ["≈ (6 × 30) / 0.5", "= 180 / 0.5", "= 180 × 2"], noWorking: "zero",
    showWorking: "An estimate must show the rounded numbers. Without them it scores 0.",
    points: [
      { id: "M1", code: "M1", criterion: "Rounds at least two of the numbers to 1 significant figure: 6, 30 and 0.5", reject: ["0.49 rounded to 1 or 0"] },
      { id: "A1", code: "A1", dep: ["M1"], criterion: "360", reject: ["90 (divided by 2 instead of 0.5)", "the exact value"] },
    ],
    errors: [
      { id: "rearrange", looksLike: "treated dividing by 0.5 as halving: 180 ÷ 0.5 = 360, not 90" },
      { id: "rounding", looksLike: "rounded 0.49 to 1 or 0, or worked out the exact value (not an estimate)" },
    ],
    dangerZones: [{ id: "half", when: "the student is dividing by 0.5", warn: "Dividing by a half makes it bigger." }],
    coach: {
      keyWords: [{ text: "estimate", why: "Round each number to 1 significant figure first." }],
      clues: ["Round each number to 1 significant figure.", "5.92 → 6, 31.4 → 30, 0.49 → 0.5.", "6 × 30 = 180. Dividing by 0.5 is the same as × 2."],
      traps: ["Did you show the rounded numbers?"],
    },
  },
  {
    id: "cca1-q3", source: { paper: SRC, q: "3" }, topic: "ratio", tier: "H", calculator: false,
    prompt: "Asha, Ben and Carla share some money in the ratio 3 : 4 : 8<br>Carla gets £35 more than Asha.<br>Work out how much money Ben gets.",
    marks: 3, answer: "£28", solution: ["Carla − Asha = 8 − 3 = 5 parts", "5 parts = £35, so 1 part = £7", "Ben = 4 × 7"], noWorking: "full",
    points: [
      { id: "M1a", code: "M1", criterion: "Finds the difference in parts between Carla and Asha: 8 − 3 = 5 parts" },
      { id: "M1b", code: "M1", dep: ["M1a"], criterion: "35 ÷ 5 = 7, so 1 part is £7" },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "Ben gets 4 × 7 = £28", reject: ["£21 (Asha)", "£56 (Carla)"] },
    ],
    errors: [
      { id: "parts-count", looksLike: "divided £35 by the total number of parts (15): the £35 is a difference, not the total" },
      { id: "wrong-share", looksLike: "gave Asha's (£21) or Carla's (£56) share" },
    ],
    dangerZones: [{ id: "diff", when: "the student is using the £35", warn: "£35 is the gap between Carla and Asha, not the total." }],
    coach: {
      keyWords: [{ text: "£35 more than", why: "A difference between two shares." }, { text: "Ben", why: "The share you need." }],
      clues: ["How many more parts does Carla have than Asha?", "Those 5 parts are worth £35.", "Find one part, then Ben's 4 parts."],
      traps: ["Is your answer Ben's share?"],
    },
  },
  {
    id: "cca1-q4", source: { paper: SRC, q: "4" }, topic: "lin", tier: "H", calculator: false,
    prompt: "Solve &nbsp;<span class=\"eq\">5(2x − 3) = 3x + 20</span>",
    marks: 3, answer: "x = 5", solution: ["10x − 15 = 3x + 20", "7x = 35"], noWorking: "full",
    points: [
      { id: "M1a", code: "M1", criterion: "Expands the bracket correctly: 10x − 15", reject: ["10x − 3"] },
      { id: "M1b", code: "M1", ft: true, criterion: "Collects terms to reach 7x = 35 (ft their expansion)." },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "x = 5" },
    ],
    errors: [
      { id: "missed-term", looksLike: "wrote 10x − 3: the 5 must multiply both terms in the bracket" },
      { id: "sign-error", looksLike: "sign slip moving −15 across" },
    ],
    dangerZones: [{ id: "expand", when: "the student is expanding the bracket", warn: "Multiply both terms inside." }],
    coach: {
      keyWords: [{ text: "Solve", why: "Find x." }],
      clues: ["Expand the bracket: multiply both terms by 5.", "Collect x terms on one side and numbers on the other.", "Divide to find x."],
      traps: ["Put x back in: do both sides match?"],
    },
  },
  {
    id: "cca1-q5", source: { paper: SRC, q: "5" }, topic: "polygon", tier: "H", calculator: false,
    prompt: "The diagram shows a regular pentagon and a regular hexagon.<br>The two shapes share a common side.<br>Work out the size of the angle marked x.<br>You must show all your working.",
    diagram: pentHex, marks: 3, answer: "132°", solution: ["Pentagon interior angle = 180 − 360/5 = 108°", "Hexagon interior angle = 180 − 360/6 = 120°", "x = 360 − 108 − 120"], noWorking: "zero",
    showWorking: "This question says 'You must show all your working'.",
    points: [
      { id: "M1a", code: "M1", criterion: "A correct method for one interior angle, e.g. 180 − 360/5 = 108 or 180 − 360/6 = 120" },
      { id: "M1b", code: "M1", ft: true, criterion: "360 − 108 − 120" },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "132" },
    ],
    errors: [
      { id: "wrong-formula", looksLike: "used the exterior angles (72° and 60°) as if they were interior angles, or the whole angle sum (540° or 720°)" },
      { id: "stopped-early", looksLike: "forgot that angles around a point add up to 360°" },
    ],
    dangerZones: [{ id: "interior", when: "the student is finding the polygon angles", warn: "You need interior angles: 180 minus the exterior angle." }],
    coach: {
      keyWords: [{ text: "regular", why: "All angles equal." }, { text: "You must show all your working", why: "No working, no marks." }],
      clues: ["Find one interior angle of each shape.", "Exterior angle = 360 ÷ number of sides; interior = 180 − exterior.", "Angles around a point add up to 360°."],
      traps: ["Did you use interior angles?"],
    },
  },
  {
    id: "cca1-q6", source: { paper: SRC, q: "6" }, topic: "mean", tier: "H", calculator: false,
    prompt: "The mean of five numbers is 12<br>A sixth number is added to the list.<br>The mean of all six numbers is 13<br>Work out the sixth number.",
    marks: 2, answer: "18", solution: ["5 × 12 = 60", "6 × 13 = 78", "78 − 60"], noWorking: "full",
    points: [
      { id: "M1", code: "M1", criterion: "Finds a total: 5 × 12 = 60 or 6 × 13 = 78" },
      { id: "A1", code: "A1", dep: ["M1"], criterion: "78 − 60 = 18", reject: ["13 or 14"] },
    ],
    errors: [{ id: "wrong-average", looksLike: "worked with the means, not the totals, and answered 13 or 14" }],
    dangerZones: [{ id: "totals", when: "the student starts", warn: "When a mean changes, find the totals first." }],
    coach: {
      keyWords: [{ text: "mean", why: "Total ÷ how many. Work with totals." }],
      clues: ["Find the total of the five numbers.", "Find the total of all six numbers.", "The difference is the sixth number."],
      traps: ["Did you use totals, not means?"],
    },
  },
  {
    id: "cca1-q7", source: { paper: SRC, q: "7" }, topic: "rev", tier: "H", calculator: false,
    prompt: "In a sale, the normal price of a coat is reduced by 15%.<br>The sale price of the coat is £68<br>Work out the normal price of the coat.",
    marks: 3, answer: "£80", solution: ["£68 is 85% of the normal price", "1% = 68 ÷ 85 = 0.8", "100% = £80"], noWorking: "full",
    points: [
      { id: "M1a", code: "M1", criterion: "Recognises that £68 is 85% of the normal price (100 − 15)." },
      { id: "M1b", code: "M1", dep: ["M1a"], criterion: "A complete method, e.g. 68 ÷ 85 × 100, or 5% = £4 so 100% = £80." },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "£80", reject: ["£78.20 (15% of £68 added on, scores 0)"] },
    ],
    errors: [{ id: "reverse-pct", looksLike: "found 15% of £68 and added it on, giving £78.20 (scores 0): the 15% was taken off the normal price" }],
    markerNotes: ["Check: 15% of £80 is £12, and 80 − 12 = 68."],
    dangerZones: [{ id: "reverse", when: "the student is about to work with 15% of £68", warn: "The 15% came off the normal price, not the sale price." }],
    coach: {
      keyWords: [{ text: "normal price", why: "The original 100%." }, { text: "reduced by 15%", why: "So £68 is 85%." }],
      clues: ["£68 is 85% of the normal price.", "Find 5% (or 1%) from 85%.", "Scale up to 100%."],
      traps: ["Take 15% off your answer: do you get £68?"],
    },
  },
  {
    id: "cca1-q8a", source: { paper: SRC, q: "8", part: "a" }, topic: "fracind", tier: "H", calculator: false,
    prompt: "Work out the value of &nbsp;<span class=\"eq\">64<sup>2/3</sup></span>", promptText: "Work out the value of 64^(2/3).",
    marks: 1, answer: "16", solution: ["∛64 = 4", "4² ="], noWorking: "full",
    points: [{ id: "B1", code: "B1", criterion: "16 (cube root of 64 is 4, then 4²).", reject: ["42.67 (64 × 2/3)"] }],
    errors: [{ id: "fractional-index", looksLike: "worked out 64 × 2/3" }],
    dangerZones: [{ id: "root", when: "the student starts", warn: "The 3 on the bottom means cube root." }],
    coach: {
      keyWords: [{ text: "2/3", why: "Cube root, then square." }],
      clues: ["The bottom of the power is the root.", "Cube root of 64.", "Then square it."],
      traps: ["Did you root first?"],
    },
  },
  {
    id: "cca1-q8b", source: { paper: SRC, q: "8", part: "b" }, topic: "fracind", tier: "H", calculator: false,
    prompt: `Work out the value of &nbsp;<span class="eq">(${fr(16, 81)})<sup>−3/4</sup></span>`, promptText: "Work out the value of (16/81)^(−3/4).",
    marks: 2, answer: "27/8", solution: ["Reciprocal: (81/16)^(3/4)", "Fourth root: 3/2", "Cube: 27/8"], noWorking: "full",
    points: [
      { id: "M1", code: "M1", criterion: "Deals correctly with the negative power or the fourth root: 81/16, or 3/2, or 2/3, or 8/27." },
      { id: "A1", code: "A1", dep: ["M1"], criterion: "27/8 oe", accept: ["3 3/8", "3.375"], reject: ["−27/8", "8/27"] },
    ],
    errors: [
      { id: "negative-index", looksLike: "treated the negative power as a negative answer: a negative power means reciprocal" },
      { id: "fractional-index", looksLike: "cubed before taking the fourth root" },
    ],
    dangerZones: [{ id: "neg", when: "the student starts", warn: "Negative power: flip the fraction." }],
    coach: {
      keyWords: [{ text: "−3/4", why: "Flip, fourth root, then cube." }],
      clues: ["The negative power means flip the fraction.", "Fourth root of 81 is 3, of 16 is 2.", "Then cube."],
      traps: ["Is your answer positive?"],
    },
  },
  {
    id: "cca1-q9", source: { paper: SRC, q: "9" }, topic: "ratio", tier: "H", calculator: false,
    prompt: "The ratio of the number of boys to the number of girls in a chess club is 3 : 5<br>6 more boys join the club. No girls join or leave.<br>The ratio of the number of boys to the number of girls is now 3 : 4<br>Work out the number of girls in the chess club.",
    marks: 3, answer: "40 girls", solution: ["3 : 5 = 12 : 20 and 3 : 4 = 15 : 20", "3 parts = 6 boys, 1 part = 2", "Girls = 20 × 2"], noWorking: "full",
    points: [
      { id: "M1a", code: "M1", criterion: "Sets up the problem, e.g. (3k + 6)/5k = 3/4, or makes the girls' parts equal: 3 : 5 = 12 : 20 and 3 : 4 = 15 : 20." },
      { id: "M1b", code: "M1", dep: ["M1a"], criterion: "12k + 24 = 15k so k = 8, or 3 parts = 6 boys so 1 part = 2." },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "40 girls (5 × 8 or 20 × 2).", reject: ["24 or 30 (boys)"] },
    ],
    errors: [
      { id: "wrong-share", looksLike: "gave the number of boys (24 or 30)" },
      { id: "wrong-ratio", looksLike: "assumed the 6 extra boys are 1 part of the original ratio" },
    ],
    dangerZones: [{ id: "girls", when: "the student starts", warn: "The girls don't change. Make their parts equal in both ratios." }],
    coach: {
      keyWords: [{ text: "No girls join or leave", why: "The girls' number stays fixed." }, { text: "number of girls", why: "That's the answer, not the boys." }],
      clues: ["Rewrite both ratios with the same number of girl parts: 12 : 20 and 15 : 20.", "The boys went up by 3 parts: that's the 6 new boys.", "Find one part, then the girls."],
      traps: ["Is your answer the number of girls?"],
    },
  },
  {
    id: "cca1-q10a", source: { paper: SRC, q: "10", part: "a" }, topic: "quadgraph", tier: "H", calculator: false,
    prompt: `Complete the table of values for &nbsp;<span class="eq">y = x<sup>2</sup> − 2x − 4</span>${table([["x", "−2", "−1", 0, 1, 2, 3, 4], ["y", 4, "", "−4", "", "−4", "", 4]], false)}`,
    promptText: "Complete the table of values for y = x² − 2x − 4 for x = −2, −1, 0, 1, 2, 3, 4. Given: y = 4 at x = −2, −4 at x = 0, −4 at x = 2, 4 at x = 4. Missing: x = −1, 1, 3.",
    marks: 2, answer: "−1, −5, −1", solution: ["x = −1: 1 + 2 − 4 = −1", "x = 1: 1 − 2 − 4 = −5", "x = 3: 9 − 6 − 4 = −1"], noWorking: "full",
    points: [
      { id: "B1a", code: "B1", criterion: "One or two of −1, −5, −1 correct (for x = −1, 1, 3)." },
      { id: "B1b", code: "B1", criterion: "All three values correct: −1, −5, −1." },
    ],
    errors: [{ id: "sign-error", looksLike: "worked out (−1)² as −1, giving y = −3 instead of −1" }],
    markerNotes: ["Mike's scheme is B2 (B1 for one or two correct): award B1a for one or two, B1a and B1b for all three."],
    dangerZones: [{ id: "neg", when: "the student is substituting x = −1", warn: "(−1)² is positive." }],
    coach: {
      keyWords: [{ text: "table of values", why: "Substitute each x." }],
      clues: ["Substitute x = −1, 1 and 3 into x² − 2x − 4.", "(−1)² = +1, and −2 × −1 = +2.", "Check the values make a symmetrical pattern."],
      traps: ["Is the table symmetrical about x = 1?"],
    },
  },
  {
    id: "cca1-q10b", source: { paper: SRC, q: "10", part: "b" }, topic: "quadgraph", tier: "H", calculator: false,
    prompt: "On the grid, draw the graph of &nbsp;<span class=\"eq\">y = x<sup>2</sup> − 2x − 4</span>&nbsp; for values of x from −2 to 4<br><small>Sketch the axes and curve in your working, with the plotted points marked.</small>",
    promptText: "Draw the graph of y = x² − 2x − 4 for x from −2 to 4 (points (−2, 4), (−1, −1), (0, −4), (1, −5), (2, −4), (3, −1), (4, 4)).",
    diagram: quadGrid, marks: 2, answer: "Smooth U-shaped curve through (−2, 4), (−1, −1), (0, −4), (1, −5), (2, −4), (3, −1), (4, 4)",
    solution: ["Plot the seven points", "Join with a smooth curve with its lowest point at (1, −5)"], noWorking: "full",
    points: [
      { id: "M1", code: "M1", ft: true, criterion: "At least five points plotted correctly (ft their table)." },
      { id: "A1", code: "A1", dep: ["M1"], criterion: "A smooth curve through all seven points: (−2, 4), (−1, −1), (0, −4), (1, −5), (2, −4), (3, −1), (4, 4).", reject: ["straight-line segments", "a flat bottom between (0, −4) and (2, −4)"] },
    ],
    errors: [{ id: "wrong-form", looksLike: "joined the points with straight lines, or drew a flat bottom: the curve must dip to (1, −5)" }],
    markerNotes: ["The student can't draw on the printed grid. Judge from their sketch: points visibly at the right coordinates (labelled or on drawn gridlines) and a smooth U shape through (1, −5)."],
    dangerZones: [{ id: "smooth", when: "the points have been plotted", warn: "Join them with a smooth curve, not straight lines." }],
    coach: {
      keyWords: [{ text: "draw the graph", why: "Plot every point, then a smooth curve." }],
      clues: ["Plot each pair from the table.", "The lowest point is (1, −5).", "Join with one smooth U-shaped curve."],
      traps: ["Is the curve smooth through the bottom?"],
    },
  },
  {
    id: "cca1-q10c", source: { paper: SRC, q: "10", part: "c" }, topic: "quadgraph", tier: "H", calculator: false,
    prompt: "Use your graph to find estimates for the solutions of &nbsp;<span class=\"eq\">x<sup>2</sup> − 2x − 4 = 0</span>",
    promptText: "Using the graph of y = x² − 2x − 4, find estimates for the solutions of x² − 2x − 4 = 0.",
    marks: 2, answer: "x = −1.2 and x = 3.2", solution: ["Read where the curve crosses the x-axis", "x ≈ −1.2 and x ≈ 3.2"], noWorking: "full",
    points: [
      { id: "B1a", code: "B1", ft: true, criterion: "One of −1.2 and 3.2, within ±0.1 (ft their graph)." },
      { id: "B1b", code: "B1", ft: true, criterion: "Both −1.2 and 3.2, each within ±0.1 (ft their graph)." },
    ],
    errors: [{ id: "stopped-early", looksLike: "gave only one solution" }],
    markerNotes: ["Mike's scheme is B2 (B1 for one correct)."],
    dangerZones: [{ id: "both", when: "one crossing has been read", warn: "The curve crosses the x-axis twice." }],
    coach: {
      keyWords: [{ text: "= 0", why: "Where y = 0: the x-axis." }],
      clues: ["The solutions are where y = 0.", "Find where the curve crosses the x-axis.", "Read both x values to 1 decimal place."],
      traps: ["Have you given two values?"],
    },
  },
  {
    id: "cca1-q11", source: { paper: SRC, q: "11" }, topic: "cond", tier: "H", calculator: false,
    prompt: "There are 5 red counters and 3 blue counters in a bag.<br>Maya takes a counter from the bag at random and does not put it back.<br>She then takes a second counter from the bag at random.<br>Work out the probability that the two counters Maya takes are the same colour.<br>Give your answer as a fraction in its simplest form.",
    marks: 4, answer: "13/28", solution: ["P(RR) = 5/8 × 4/7 = 20/56", "P(BB) = 3/8 × 2/7 = 6/56", "26/56 = 13/28"], noWorking: "full",
    showWorking: "Write both products before adding.",
    points: [
      { id: "M1a", code: "M1", criterion: "Uses a denominator of 7 for the second counter, e.g. 4/7 or 2/7." },
      { id: "M1b", code: "M1", criterion: "5/8 × 4/7 or 3/8 × 2/7" },
      { id: "M1c", code: "M1", ft: true, dep: ["M1b"], criterion: "Adds the two products: 20/56 + 6/56" },
      { id: "A1", code: "A1", dep: ["M1c"], criterion: "13/28", reject: ["26/56 (not simplest form)", "34/64 (with replacement)"] },
    ],
    errors: [
      { id: "replacement", looksLike: "put the counter back: 5/8 × 5/8 + 3/8 × 3/8 = 34/64 scores at most 1 mark" },
      { id: "stopped-early", looksLike: "found only red and red" },
      { id: "not-simplified", looksLike: "left the answer as 26/56" },
    ],
    dangerZones: [
      { id: "seven", when: "the student is writing the second probability", warn: "One counter is gone. How many are left?" },
      { id: "both", when: "one same-colour route has been found", warn: "Same colour: both red, or both blue." },
    ],
    coach: {
      keyWords: [{ text: "does not put it back", why: "The second draw is out of 7." }, { text: "same colour", why: "Both red or both blue." }, { text: "simplest form", why: "Cancel at the end." }],
      clues: ["Two routes: red then red, blue then blue.", "After one counter, there are 7 left, with one fewer of that colour.", "Multiply along each route and add."],
      traps: ["Is your fraction fully simplified?"],
    },
  },
  {
    id: "cca1-q12", source: { paper: SRC, q: "12" }, topic: "invprop", tier: "H", calculator: false,
    prompt: "y is inversely proportional to the square of x.<br>y = 3 when x = 4<br>Work out the value of y when x = 6<br>Give your answer as a fraction in its simplest form.",
    marks: 3, answer: "4/3", solution: ["y = k/x²", "k = 3 × 4² = 48", "y = 48/36"], noWorking: "full",
    showWorking: "Start with y = k/x² written down.",
    points: [
      { id: "M1a", code: "M1", criterion: "y = k/x²", reject: ["y = k/x", "y = kx²"] },
      { id: "M1b", code: "M1", dep: ["M1a"], criterion: "k = 3 × 4² = 48" },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "y = 48/36 = 4/3", accept: ["1 1/3"], reject: ["48/36 (not simplest form)"] },
    ],
    errors: [
      { id: "missed-square", looksLike: "missed 'square': y = k/x gives k = 12 and y = 2" },
      { id: "direct-inverse", looksLike: "missed 'inversely': used y = kx²" },
      { id: "not-simplified", looksLike: "left the answer as 48/36" },
    ],
    dangerZones: [{ id: "form", when: "the student is writing the proportion formula", warn: "Inversely, and the square of x: both go in the formula." }],
    coach: {
      keyWords: [{ text: "inversely proportional", why: "k goes over the x part." }, { text: "square of x", why: "x² in the formula." }],
      clues: ["Write y = k/x².", "Find k using y = 3 and x = 4.", "Put x = 6 in and simplify."],
      traps: ["Is your fraction simplified?"],
    },
  },
  {
    id: "cca1-q13", source: { paper: SRC, q: "13" }, topic: "recur", tier: "H", calculator: false,
    prompt: `Prove algebraically that the recurring decimal &nbsp;0.24̇5̇&nbsp; can be written as &nbsp;<span class="eq">${fr(27, 110)}</span>`,
    promptText: "Prove algebraically that the recurring decimal 0.2454545… (the 4 and 5 recur) can be written as 27/110.",
    marks: 3, answer: "Proof: 990x = 243, x = 243/990 = 27/110", solution: ["x = 0.24545…", "10x = 2.4545…, 1000x = 245.4545…", "990x = 243", "x = 243/990 = 27/110"], noWorking: "zero",
    points: [
      { id: "M1a", code: "M1", criterion: "Lets x = 0.24545… and finds two multiples with the same recurring part, e.g. 10x = 2.4545… and 1000x = 245.4545…" },
      { id: "M1b", code: "M1", dep: ["M1a"], criterion: "Subtracts to remove the recurring part: 990x = 243" },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "x = 243/990 = 27/110, with the cancelling shown (dividing by 9).", reject: ["starting from 27/110 and dividing"] },
    ],
    errors: [
      { id: "recurring-terminating", looksLike: "read the dots wrongly: only the 4 and 5 recur, so it's 0.2454545…, not 0.245245…" },
      { id: "stopped-early", looksLike: "didn't show the simplification to 27/110" },
    ],
    dangerZones: [{ id: "line", when: "the student is choosing multiples of x", warn: "Pick two multiples whose recurring parts line up." }],
    coach: {
      keyWords: [{ text: "Prove algebraically", why: "Use x and show every step." }, { text: "0.24̇5̇", why: "The dots are on the 4 and 5: 0.2454545…" }],
      clues: ["Let x = 0.2454545…", "10x = 2.4545… and 1000x = 245.4545…", "Subtract, solve for x, and simplify."],
      traps: ["Did you show the cancelling to 27/110?"],
    },
  },
  {
    id: "cca1-q14a", source: { paper: SRC, q: "14", part: "a" }, topic: "hist", tier: "H", calculator: false,
    prompt: `${PUZ}${puzTable}Use the histogram to complete the table.`, promptText: `${PUZ_T} Use the histogram to complete the table.`,
    diagram: histPuzzle, marks: 2, answer: "12 and 14", solution: ["10 < t ≤ 15: 2.4 × 5 = 12", "20 < t ≤ 30: 1.4 × 10 = 14"], noWorking: "full",
    points: [
      { id: "B1a", code: "B1", criterion: "12 (frequency density 2.4 × class width 5)." },
      { id: "B1b", code: "B1", criterion: "14 (frequency density 1.4 × class width 10).", reject: ["2.4 and 1.4 (bar heights)"] },
    ],
    errors: [{ id: "wrong-operation", looksLike: "read the height of a bar as the frequency (writing 2.4 and 1.4 in the table)" }],
    dangerZones: [{ id: "area", when: "the student is reading a bar", warn: "Frequency = height × width." }],
    coach: {
      keyWords: [{ text: "Use the histogram", why: "Frequency is the area of each bar." }],
      clues: ["Find the bars for 10 to 15 and 20 to 30.", "Read each bar's height.", "Multiply by its class width."],
      traps: ["Did you multiply by the width?"],
    },
  },
  {
    id: "cca1-q14b", source: { paper: SRC, q: "14", part: "b" }, topic: "hist", tier: "H", calculator: false,
    prompt: "Use the table to complete the histogram.<br><small>Write the height of each missing bar, or sketch them, in your working.</small>", promptText: `${PUZ_T} Use the table to complete the histogram (draw the bars for 15–20 and 30–50).`,
    diagram: histPuzzle, marks: 2, answer: "Bars of height 3.0 and 0.4", solution: ["15 < t ≤ 20: 15 ÷ 5 = 3.0", "30 < t ≤ 50: 8 ÷ 20 = 0.4"], noWorking: "full",
    points: [
      { id: "B1a", code: "B1", criterion: "Bar from 15 to 20 drawn to a height of 3.0 (15 ÷ 5)." },
      { id: "B1b", code: "B1", criterion: "Bar from 30 to 50 drawn to a height of 0.4 (8 ÷ 20).", reject: ["height 8 (the frequency)"] },
    ],
    errors: [{ id: "wrong-operation", looksLike: "drew bars with height equal to the frequency" }],
    markerNotes: ["The student can't draw on the printed histogram. Accept the two bar heights stated with their classes, or a sketch with heights labelled."],
    dangerZones: [{ id: "fd", when: "the student is working out a bar height", warn: "Height = frequency ÷ class width." }],
    coach: {
      keyWords: [{ text: "complete the histogram", why: "Bar height is frequency density." }],
      clues: ["Frequency density = frequency ÷ class width.", "15 to 20 has width 5; 30 to 50 has width 20.", "Draw each bar to its frequency density."],
      traps: ["Did you divide by the class width?"],
    },
  },
  {
    id: "cca1-q15", source: { paper: SRC, q: "15" }, topic: "circthm", tier: "H", calculator: false,
    prompt: "A and B are points on a circle, centre O.<br>TA is a tangent to the circle at A.<br>Angle BAT = 58°<br>Work out the size of angle OBA.<br>Give a reason for each stage of your working.",
    diagram: tangentCircle, marks: 3, answer: "32°", solution: ["Angle OAT = 90° (tangent perpendicular to radius)", "Angle OAB = 90 − 58 = 32°", "Angle OBA = 32° (base angles of isosceles triangle OAB, OA = OB radii)"], noWorking: "full",
    showWorking: "Write each angle with its reason.",
    points: [
      { id: "M1", code: "M1", criterion: "Angle OAT = 90°, or angle OAB = 90 − 58 = 32°" },
      { id: "A1", code: "A1", dep: ["M1"], criterion: "Angle OBA = 32°", reject: ["58°"] },
      { id: "B1", code: "B1", criterion: "Both reasons: the tangent to a circle is perpendicular to the radius, and base angles of an isosceles triangle are equal (OA = OB, both radii).", accept: ["a correct alternate segment theorem route with every step reasoned"], reject: ["'because it is a circle'"] },
    ],
    errors: [
      { id: "wrong-share", looksLike: "assumed angle OBA is 58°" },
      { id: "stopped-early", looksLike: "gave no reasons, or vague ones such as 'because it is a circle'" },
    ],
    dangerZones: [{ id: "reasons", when: "the first angle has been found", warn: "Write the reason with its key words." }],
    coach: {
      keyWords: [{ text: "tangent", why: "Meets the radius OA at 90°." }, { text: "Give a reason for each stage", why: "A mark depends on the reasons." }],
      clues: ["Angle OAT is 90°: tangent and radius.", "So angle OAB = 90 − 58.", "OA = OB (radii), so triangle OAB is isosceles."],
      traps: ["Have you given both reasons with the key words?"],
    },
  },
  {
    id: "cca1-q16", source: { paper: SRC, q: "16" }, topic: "similar", tier: "H", calculator: false,
    prompt: "Solid A and solid B are mathematically similar.<br>The surface area of solid A is 48 cm<sup>2</sup><br>The surface area of solid B is 300 cm<sup>2</sup><br>The volume of solid A is 16 cm<sup>3</sup><br>Work out the volume of solid B.",
    marks: 3, answer: "250 cm³", solution: ["Area scale factor = 300/48 = 25/4", "Length scale factor = 5/2", "Volume scale factor = 125/8", "16 × 125/8"], noWorking: "full",
    points: [
      { id: "M1a", code: "M1", criterion: "Area scale factor 300/48 = 25/4, so length scale factor = √(25/4) = 5/2" },
      { id: "M1b", code: "M1", dep: ["M1a"], criterion: "Volume scale factor = (5/2)³ = 125/8" },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "16 × 125/8 = 250", reject: ["100 (area factor used)"] },
    ],
    errors: [{ id: "wrong-formula", looksLike: "used the area scale factor for the volume: 16 × 6.25 = 100 scores 0" }],
    dangerZones: [{ id: "via", when: "the area scale factor has been found", warn: "Go through the length scale factor: square root, then cube." }],
    coach: {
      keyWords: [{ text: "surface area", why: "Gives the area scale factor." }, { text: "volume", why: "Needs the volume scale factor." }],
      clues: ["Area scale factor = 300 ÷ 48.", "Square root it for the length scale factor.", "Cube that for the volume scale factor."],
      traps: ["Did you go through the length scale factor?"],
    },
  },
  {
    id: "cca1-q17", source: { paper: SRC, q: "17" }, topic: "surd", tier: "H", calculator: false,
    prompt: `Write &nbsp;<span class="eq">${fr("5 + √3", "2 − √3")}</span>&nbsp; in the form a + b√3 where a and b are integers.<br>You must show all your working.`,
    promptText: "Write (5 + √3)/(2 − √3) in the form a + b√3 where a and b are integers. You must show all your working.",
    marks: 3, answer: "13 + 7√3", solution: ["Multiply top and bottom by (2 + √3)", "Top: 10 + 5√3 + 2√3 + 3 = 13 + 7√3", "Bottom: 4 − 3 = 1"], noWorking: "zero",
    showWorking: "This question says 'You must show all your working'.",
    points: [
      { id: "M1a", code: "M1", criterion: "Multiplies the numerator and the denominator by (2 + √3).", reject: ["by (2 − √3)"] },
      { id: "M1b", code: "M1", dep: ["M1a"], criterion: "Expands the numerator, 10 + 5√3 + 2√3 + 3 (at least three terms correct), or shows the denominator is 4 − 3 = 1." },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "13 + 7√3" },
    ],
    errors: [
      { id: "sign-error", looksLike: "multiplied by (2 − √3): the sign must change; or a sign slip giving 4 + 3 = 7 in the denominator" },
      { id: "surd-root", looksLike: "wrote √3 × √3 as 9 or 6 instead of 3" },
    ],
    dangerZones: [{ id: "conj", when: "the student is choosing what to multiply by", warn: "Change the sign in the middle of the denominator." }],
    coach: {
      keyWords: [{ text: "a + b√3", why: "Rationalise, then simplify." }, { text: "You must show all your working", why: "No working, no marks." }],
      clues: ["Multiply top and bottom by (2 + √3).", "The bottom becomes 4 − 3.", "Expand the top and collect terms."],
      traps: ["Did √3 × √3 give 3?"],
    },
  },
  {
    id: "cca1-q18", source: { paper: SRC, q: "18" }, topic: "cosr", tier: "H", calculator: false,
    prompt: "ABC is a triangle.<br>AB = 5 cm &nbsp;&nbsp; AC = 8 cm &nbsp;&nbsp; Angle BAC = 60°<br>Work out the length of BC.",
    diagram: tri60, marks: 3, answer: "BC = 7 cm", solution: ["BC² = 5² + 8² − 2 × 5 × 8 × cos 60°", "= 25 + 64 − 40 = 49", "BC = √49"], noWorking: "full",
    points: [
      { id: "M1a", code: "M1", criterion: "Substitutes into the cosine rule: BC² = 5² + 8² − 2 × 5 × 8 × cos 60°" },
      { id: "M1b", code: "M1", dep: ["M1a"], criterion: "Uses cos 60° = ½ to reach 25 + 64 − 40 = 49" },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "BC = 7", reject: ["49"] },
    ],
    errors: [
      { id: "order-error", looksLike: "worked out (25 + 64 − 80) × ½: the multiplication must be done before the subtraction" },
      { id: "wrong-formula", looksLike: "used cos 60° = √3/2" },
      { id: "no-sqrt", looksLike: "gave 49 without square-rooting" },
    ],
    dangerZones: [{ id: "order", when: "the student is evaluating the cosine rule", warn: "Work out 2 × 5 × 8 × cos 60° first, then subtract." }],
    coach: {
      keyWords: [{ text: "Angle BAC = 60°", why: "cos 60° is an exact value." }],
      clues: ["Two sides and the angle between: cosine rule.", "cos 60° = ½.", "Work out BC², then square root."],
      traps: ["Did you square root?"],
    },
  },
  {
    id: "cca1-q19a", source: { paper: SRC, q: "19", part: "a" }, topic: "comp", tier: "H", calculator: false,
    prompt: "The functions f and g are such that<br><span class=\"eq\">f(x) = 3x − 2</span> &nbsp;and&nbsp; <span class=\"eq\">g(x) = x<sup>2</sup> + 1</span><br>Work out the value of fg(2)",
    promptText: `${FG} Work out the value of fg(2).`,
    marks: 2, answer: "fg(2) = 13", solution: ["g(2) = 2² + 1 = 5", "f(5) = 15 − 2"], noWorking: "full",
    points: [
      { id: "M1", code: "M1", criterion: "g(2) = 2² + 1 = 5" },
      { id: "A1", code: "A1", dep: ["M1"], criterion: "f(5) = 13", reject: ["17 (gf(2))"] },
    ],
    errors: [{ id: "composite-order", looksLike: "did the functions in the wrong order: gf(2) = g(4) = 17" }],
    dangerZones: [{ id: "order", when: "the student starts", warn: "In fg(2), g acts first." }],
    coach: {
      keyWords: [{ text: "fg(2)", why: "g first, then f." }],
      clues: ["Work out g(2) first.", "g(2) = 2² + 1.", "Put that answer into f."],
      traps: ["Did you do g first?"],
    },
  },
  {
    id: "cca1-q19b", source: { paper: SRC, q: "19", part: "b" }, topic: "inv", tier: "H", calculator: false,
    prompt: "Find &nbsp;f<sup>−1</sup>(x)", promptText: `${FG} Find f⁻¹(x).`,
    marks: 2, answer: "f⁻¹(x) = (x + 2)/3", solution: ["y = 3x − 2", "y + 2 = 3x", "x = (y + 2)/3"], noWorking: "full",
    points: [
      { id: "M1", code: "M1", criterion: "Writes y = 3x − 2 and attempts to make x the subject, e.g. y + 2 = 3x" },
      { id: "A1", code: "A1", dep: ["M1"], criterion: "f⁻¹(x) = (x + 2)/3 oe", reject: ["1/(3x − 2)", "x + 2/3"] },
    ],
    errors: [
      { id: "inverse-reciprocal", looksLike: "wrote the reciprocal 1/(3x − 2)" },
      { id: "order-error", looksLike: "wrote x + 2/3: the whole of x + 2 is divided by 3" },
    ],
    dangerZones: [{ id: "undo", when: "the student starts", warn: "Undo the steps in reverse order." }],
    coach: {
      keyWords: [{ text: "f−1(x)", why: "The inverse: undo f. Not 1 ÷ f." }],
      clues: ["Write y = 3x − 2.", "Add 2, then divide by 3.", "Write the answer in terms of x."],
      traps: ["Is the whole of x + 2 divided by 3?"],
    },
  },
  {
    id: "cca1-q20", source: { paper: SRC, q: "20" }, topic: "aproof", tier: "H", calculator: false,
    prompt: "n is a positive integer.<br>Prove algebraically that &nbsp;<span class=\"eq\">(2n + 3)<sup>2</sup> − (2n − 1)<sup>2</sup></span>&nbsp; is always a multiple of 8",
    promptText: "n is a positive integer. Prove algebraically that (2n + 3)² − (2n − 1)² is always a multiple of 8.",
    marks: 3, answer: "Proof: 16n + 8 = 8(2n + 1)", solution: ["(2n + 3)² = 4n² + 12n + 9", "(2n − 1)² = 4n² − 4n + 1", "Difference = 16n + 8 = 8(2n + 1)", "8(2n + 1) is a multiple of 8"], noWorking: "zero",
    points: [
      { id: "M1a", code: "M1", criterion: "Expands both brackets: 4n² + 12n + 9 and 4n² − 4n + 1 (at least one fully correct).", accept: ["difference of two squares: (2n + 3 − (2n − 1))(2n + 3 + 2n − 1)"] },
      { id: "M1b", code: "M1", dep: ["M1a"], criterion: "Subtracts correctly to reach 16n + 8", accept: ["4(4n + 2)"] },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "Writes 8(2n + 1) and concludes that this is a multiple of 8." },
    ],
    errors: [
      { id: "sign-error", looksLike: "the minus didn't apply to the whole second bracket, giving 8n + 10" },
      { id: "stopped-early", looksLike: "no factorised form or no conclusion" },
      { id: "wrong-form", looksLike: "tried numbers for n, which isn't a proof" },
    ],
    dangerZones: [
      { id: "minus", when: "the student is subtracting the second expansion", warn: "Bracket the second expansion: the minus applies to every term." },
      { id: "conclude", when: "16n + 8 has been reached", warn: "Factorise out the 8 and say why it's a multiple of 8." },
    ],
    coach: {
      keyWords: [{ text: "Prove algebraically", why: "Use n. Examples don't count." }, { text: "multiple of 8", why: "Show it's 8 × something." }],
      clues: ["Expand both squares fully.", "Subtract, keeping the second expansion in brackets.", "Factorise out 8 and write a conclusion."],
      traps: ["Did you write a concluding sentence?"],
    },
  },
  {
    id: "cca1-q21a", source: { paper: SRC, q: "21", part: "a" }, topic: "csq", tier: "H", calculator: false,
    prompt: "Write &nbsp;<span class=\"eq\">x<sup>2</sup> − 6x + 11</span>&nbsp; in the form (x − a)<sup>2</sup> + b where a and b are integers.",
    promptText: "Write x² − 6x + 11 in the form (x − a)² + b where a and b are integers.",
    marks: 2, answer: "(x − 3)² + 2", solution: ["(x − 3)² − 9 + 11", "= (x − 3)² + 2"], noWorking: "full",
    points: [
      { id: "M1", code: "M1", criterion: "(x − 3)²", reject: ["(x − 6)²"] },
      { id: "A1", code: "A1", dep: ["M1"], criterion: "(x − 3)² + 2", reject: ["(x − 3)² + 20"] },
    ],
    errors: [
      { id: "csq-half", looksLike: "wrote (x − 6)²: halve the coefficient of x" },
      { id: "sign-error", looksLike: "added 9 instead of subtracting it, giving + 20" },
    ],
    dangerZones: [{ id: "nine", when: "the student has written (x − 3)²", warn: "(x − 3)² gives an extra 9. Take it off." }],
    coach: {
      keyWords: [{ text: "(x − a)2 + b", why: "Completing the square." }],
      clues: ["Halve the −6: the bracket is (x − 3)².", "(x − 3)² = x² − 6x + 9.", "Adjust the constant: 11 − 9."],
      traps: ["Expand your answer: does it give x² − 6x + 11?"],
    },
  },
  {
    id: "cca1-q21b", source: { paper: SRC, q: "21", part: "b" }, topic: "csq", tier: "H", calculator: false,
    prompt: "Hence write down the coordinates of the turning point of the graph of &nbsp;<span class=\"eq\">y = x<sup>2</sup> − 6x + 11</span>",
    promptText: "x² − 6x + 11 = (x − 3)² + 2. Hence write down the coordinates of the turning point of y = x² − 6x + 11.",
    marks: 1, answer: "(3, 2)", solution: ["(x − 3)² + 2 has its minimum at (3, 2)"], noWorking: "full",
    points: [{ id: "B1", code: "B1", ft: true, criterion: "(3, 2) (ft their answer to (a)).", reject: ["(−3, 2)"] }],
    errors: [{ id: "sign-error", looksLike: "wrote (−3, 2): the x-coordinate is the value that makes the bracket zero" }],
    dangerZones: [{ id: "sign", when: "the student is writing the x-coordinate", warn: "What value of x makes the bracket zero?" }],
    coach: {
      keyWords: [{ text: "Hence", why: "Use your answer to (a)." }, { text: "turning point", why: "Read it from the completed square form." }],
      clues: ["The bracket is zero when x = 3.", "Then y is the number added on.", "Write it as a coordinate."],
      traps: ["Is the x-coordinate positive 3?"],
    },
  },
  {
    id: "cca1-q22", source: { paper: SRC, q: "22" }, topic: "algfrac", tier: "H", calculator: false,
    prompt: `Simplify fully &nbsp;<span class="eq">${fr("2x<sup>2</sup> − 5x − 3", "x<sup>2</sup> − 9")}</span>`,
    promptText: "Simplify fully (2x² − 5x − 3) / (x² − 9).",
    marks: 3, answer: "(2x + 1)/(x + 3)", solution: ["2x² − 5x − 3 = (2x + 1)(x − 3)", "x² − 9 = (x − 3)(x + 3)", "= (2x + 1)/(x + 3)"], noWorking: "full",
    points: [
      { id: "M1a", code: "M1", criterion: "Factorises the numerator: (2x + 1)(x − 3)" },
      { id: "M1b", code: "M1", criterion: "Factorises the denominator: (x − 3)(x + 3)" },
      { id: "A1", code: "A1", dep: ["M1a", "M1b"], criterion: "(2x + 1)/(x + 3)", reject: ["factorised but not cancelled"] },
    ],
    errors: [
      { id: "wrong-operation", looksLike: "'cancelled' individual terms such as the x² or the 3 and the 9" },
      { id: "not-simplified", looksLike: "factorised correctly but didn't cancel" },
    ],
    dangerZones: [{ id: "factor", when: "the student is about to cancel", warn: "Only whole brackets cancel. x² − 9 is a difference of two squares." }],
    coach: {
      keyWords: [{ text: "Simplify fully", why: "Factorise, then cancel." }],
      clues: ["Factorise the top into (2x ± …)(x ± …).", "x² − 9 is a difference of two squares.", "Cancel the common bracket."],
      traps: ["Did you cancel the common bracket?"],
    },
  },
  {
    id: "cca1-q23", source: { paper: SRC, q: "23" }, topic: "simquad", tier: "H", calculator: false,
    prompt: "Solve algebraically the simultaneous equations<br><span class=\"eq\">x<sup>2</sup> + y<sup>2</sup> = 13</span><br><span class=\"eq\">y = x + 1</span>",
    promptText: "Solve algebraically the simultaneous equations x² + y² = 13 and y = x + 1.",
    marks: 5, answer: "x = 2, y = 3 and x = −3, y = −2", solution: ["x² + (x + 1)² = 13", "x² + x² + 2x + 1 = 13", "2x² + 2x − 12 = 0, x² + x − 6 = 0", "(x + 3)(x − 2) = 0", "x = 2, y = 3; x = −3, y = −2"], noWorking: "zero",
    showWorking: "'Solve algebraically' means the working must be shown.",
    points: [
      { id: "M1a", code: "M1", criterion: "Substitutes: x² + (x + 1)² = 13" },
      { id: "M1b", code: "M1", dep: ["M1a"], criterion: "Expands correctly: x² + x² + 2x + 1 = 13", reject: ["(x + 1)² = x² + 1"] },
      { id: "A1a", code: "A1", dep: ["M1b"], criterion: "2x² + 2x − 12 = 0 or x² + x − 6 = 0" },
      { id: "M1c", code: "M1", ft: true, criterion: "Solves their quadratic: (x + 3)(x − 2) = 0" },
      { id: "A1b", code: "A1", dep: ["M1c"], criterion: "x = 2, y = 3 and x = −3, y = −2, correctly paired." },
    ],
    errors: [
      { id: "missed-term", looksLike: "wrote (x + 1)² = x² + 1" },
      { id: "stopped-early", looksLike: "found the two x values and stopped, or spotted x = 2 and didn't solve fully" },
    ],
    dangerZones: [
      { id: "square", when: "the student is expanding (x + 1)²", warn: "(x + 1)² has three terms." },
      { id: "ys", when: "both x values have been found", warn: "Each x needs its y." },
    ],
    coach: {
      keyWords: [{ text: "Solve algebraically", why: "Substitute and solve, showing every step." }],
      clues: ["Replace y with x + 1 in the circle equation.", "Expand (x + 1)² carefully and simplify to a quadratic.", "Factorise, then find y for each x."],
      traps: ["Have you paired each x with its y?"],
    },
  },
  {
    id: "cca1-q24a", source: { paper: SRC, q: "24", part: "a" }, topic: "vecproof", tier: "H", calculator: false,
    prompt: "OAB is a triangle. OBC is a straight line.<br>OA = 3<b>a</b> &nbsp;&nbsp; OB = 3<b>b</b><br>M is the point on OA such that OM : MA = 2 : 1<br>N is the midpoint of AB.<br>B is the midpoint of OC.<br>Find the vector AB in terms of <b>a</b> and <b>b</b>.",
    promptText: `${VEC} Find vector AB in terms of a and b.`,
    diagram: vecOABC, marks: 1, answer: "3b − 3a", solution: ["AB = AO + OB = −3a + 3b"], noWorking: "full",
    points: [{ id: "B1", code: "B1", criterion: "AB = 3b − 3a oe", reject: ["3a + 3b", "3a − 3b"] }],
    errors: [{ id: "sign-error", looksLike: "direction error: from A to O is −3a" }],
    dangerZones: [{ id: "route", when: "the student is finding AB", warn: "Go from A back to O, then O to B." }],
    coach: {
      keyWords: [{ text: "AB", why: "From A to B, via O." }],
      clues: ["A to O is the reverse of OA.", "Then add O to B.", "AB = −3a + 3b."],
      traps: ["Did going backwards change the sign?"],
    },
  },
  {
    id: "cca1-q24b", source: { paper: SRC, q: "24", part: "b" }, topic: "vecproof", tier: "H", calculator: false,
    prompt: "Prove that MNC is a straight line.", promptText: `${VEC} AB = 3b − 3a. Prove that MNC is a straight line.`,
    diagram: vecOABC, marks: 4, answer: "Proof: MC = 4 MN",
    solution: ["ON = 3/2 a + 3/2 b", "MN = −2a + 3/2 a + 3/2 b = −1/2 a + 3/2 b", "MC = −2a + 6b", "MC = 4 MN, so MN and MC are parallel with M in common: MNC is a straight line"], noWorking: "zero",
    points: [
      { id: "M1a", code: "M1", criterion: "AN = ½(3b − 3a) or ON = 3/2 a + 3/2 b" },
      { id: "M1b", code: "M1", ft: true, dep: ["M1a"], criterion: "MN = −2a + 3/2 a + 3/2 b = −½a + 3/2 b" },
      { id: "M1c", code: "M1", criterion: "MC = −2a + 6b (or NC = −3/2 a + 9/2 b)", reject: ["OC = 3b used"] },
      { id: "A1", code: "A1", dep: ["M1b", "M1c"], criterion: "Shows MC = 4MN (or NC = 3MN) and concludes: the vectors are parallel and share a common point, so MNC is a straight line." },
    ],
    errors: [
      { id: "sign-error", looksLike: "direction errors, e.g. A to O written as +3a" },
      { id: "wrong-share", looksLike: "used OC = 3b instead of 6b" },
      { id: "stopped-early", looksLike: "found the two vectors but didn't finish: the last mark needs the multiple and 'parallel with a common point'" },
    ],
    dangerZones: [
      { id: "oc", when: "the student is finding OC", warn: "B is the midpoint of OC. How long is OC?" },
      { id: "conclude", when: "both vectors have been found", warn: "Show one is a multiple of the other and name the common point." },
    ],
    coach: {
      keyWords: [{ text: "Prove", why: "Parallel vectors with a common point." }, { text: "straight line", why: "One vector is a multiple of the other." }],
      clues: ["OM = 2a and OC = 6b.", "Find MN and MC in terms of a and b.", "Show MC is a multiple of MN, and state they share M."],
      traps: ["Did you say both 'parallel' and 'common point'?"],
    },
  },
];
