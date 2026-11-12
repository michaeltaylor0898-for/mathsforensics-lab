// Cold Case B · Higher Paper 3 (calculator) · all 22 questions, 80 marks (CC-B/3H)
//
// Question wording is copied from the paper. Mark points follow Mike's Cold Case B Paper 3 Forensic
// Mark Scheme line for line; errors and Mike-mode danger zones come from its "Where the marks go
// missing" boxes. Students write on a blank page, so questions answered on a grid (Q10 box plot,
// Q12 region, Q19 line) have marker notes saying what to accept instead.
import type { Scheme } from "../schemes.ts";

const fr = (n: string | number, d: string | number) => `<span class="fr"><span>${n}</span><span>${d}</span></span>`;
const SRC = "CC-B/3H";
const TXT = `font-family="Times New Roman,serif" fill="currentColor"`;
const NDA = (x: number, y: number) => `<text x="${x}" y="${y}" font-size="9" text-anchor="middle" fill="currentColor" opacity=".7" font-family="Arial,sans-serif">Not drawn accurately</text>`;

// A square-grid coordinate plane from (x0, y0) to (x1, y1), `u` px per unit, with labelled axes.
// `extra` is drawn on top in grid units via the returned px/py helpers.
function plane(x0: number, x1: number, y0: number, y1: number, u: number, label: string, extra: (px: (x: number) => number, py: (y: number) => number) => string, step = 1, uy = u) {
  const pad = 26, W = (x1 - x0) * u + pad * 2, H = (y1 - y0) * uy + pad * 2;
  const px = (x: number) => +(pad + (x - x0) * u).toFixed(1), py = (y: number) => +(pad + (y1 - y) * uy).toFixed(1);
  const g: string[] = [], t: string[] = [];
  for (let x = x0; x <= x1; x++) g.push(`M${px(x)} ${py(y0)}V${py(y1)}`);
  for (let y = y0; y <= y1; y++) g.push(`M${px(x0)} ${py(y)}H${px(x1)}`);
  for (let x = x0; x <= x1; x += step) if (x) t.push(`<text x="${px(x)}" y="${py(0) + 13}" text-anchor="middle">${x < 0 ? "−" + -x : x}</text>`);
  for (let y = y0; y <= y1; y += step) if (y && (uy >= 18 || y % 2 === 0)) t.push(`<text x="${px(0) - 5}" y="${py(y) + 4}" text-anchor="end">${y < 0 ? "−" + -y : y}</text>`);
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${label}"><path d="${g.join("")}" stroke="currentColor" stroke-width=".5" opacity=".35" fill="none"/><path d="M${px(x0)} ${py(0)}H${px(x1) + 8}M${px(0)} ${py(y0)}V${py(y1) - 8}" stroke="currentColor" stroke-width="1.3" fill="none"/><g font-size="11" ${TXT}>${t.join("")}<text x="${px(0) - 5}" y="${py(0) + 13}" text-anchor="end">O</text><text x="${px(x1) + 10}" y="${py(0) + 4}" font-style="italic">x</text><text x="${px(0) - 4}" y="${py(y1) - 10}" font-style="italic">y</text></g>${extra(px, py)}</svg>`;
}

const triPQ = plane(-1, 11, -1, 8, 22, "Coordinate grid. Triangle P has vertices (2, 2), (2, 3) and (4, 2). Triangle Q has vertices (4, 4), (4, 7) and (10, 4).", (px, py) =>
  `<g stroke="currentColor" stroke-width="1.5" fill="currentColor" fill-opacity=".15"><path d="M${px(2)} ${py(2)}L${px(2)} ${py(3)}L${px(4)} ${py(2)}Z"/><path d="M${px(4)} ${py(4)}L${px(4)} ${py(7)}L${px(10)} ${py(4)}Z"/></g><g ${TXT} font-size="13" font-weight="bold"><text x="${px(2.35)}" y="${py(2.25)}">P</text><text x="${px(5.3)}" y="${py(4.8)}">Q</text></g>`);

const blankRegion = plane(-1, 8, -1, 8, 24, "An empty coordinate grid, x from −1 to 8 and y from −1 to 8.", () => "");

const sineGraph = (() => {
  const X = (d: number) => 40 + d * 0.75, Y = (v: number) => 90 - v * 60;
  const pts: string[] = [];
  for (let d = 0; d <= 360; d += 5) pts.push(`${X(d).toFixed(1)},${Y(Math.sin(d * Math.PI / 180)).toFixed(1)}`);
  return `<svg viewBox="0 0 340 175" role="img" aria-label="Graph of y = sin x from 0 to 360 degrees. It rises to 1 at 90 degrees, crosses the axis at 180, falls to −1 at 270 and returns to 0 at 360."><path d="M40 30H310M40 60H310M40 120H310M40 150H310M107.5 25V155M175 25V155M242.5 25V155M310 25V155" stroke="currentColor" stroke-width=".5" opacity=".35"/><path d="M40 90H318M40 160V18" stroke="currentColor" stroke-width="1.3" fill="none"/><polyline points="${pts.join(" ")}" fill="none" stroke="currentColor" stroke-width="1.7"/><g ${TXT} font-size="11"><text x="107.5" y="104" text-anchor="middle">90°</text><text x="175" y="104" text-anchor="middle">180°</text><text x="242.5" y="104" text-anchor="middle">270°</text><text x="310" y="104" text-anchor="middle">360°</text><text x="34" y="34" text-anchor="end">1</text><text x="34" y="64" text-anchor="end">0.5</text><text x="34" y="124" text-anchor="end">−0.5</text><text x="34" y="154" text-anchor="end">−1</text><text x="34" y="94" text-anchor="end">O</text><text x="322" y="94" font-style="italic">x</text><text x="44" y="16" font-style="italic">y</text></g></svg>`;
})();

const quadGraph = plane(-1, 5, -4, 9, 40, "Graph of y = x² − 3x − 1 for x from −1 to 5. It crosses the x-axis near x = −0.3 and x = 3.3 and has its minimum at (1.5, −3.25).", (px, py) => {
  const pts: string[] = [];
  for (let x = -1; x <= 5.001; x += 0.1) pts.push(`${px(x)},${py(x * x - 3 * x - 1)}`);
  return `<polyline points="${pts.join(" ")}" fill="none" stroke="currentColor" stroke-width="1.7"/>`;
}, 1, 15);

const boxAxis = `<svg viewBox="0 0 330 70" role="img" aria-label="An empty scale for a box plot: time in minutes from 0 to 50."><path d="M20 30H310" stroke="currentColor" stroke-width="1.3"/>${[0, 10, 20, 30, 40, 50].map((v) => `<path d="M${20 + v * 5.8} 30v6" stroke="currentColor"/><text x="${20 + v * 5.8}" y="50" text-anchor="middle" font-size="11" ${TXT}>${v}</text>`).join("")}<text x="165" y="66" text-anchor="middle" font-size="11" ${TXT}>Time (minutes)</text></svg>`;

const cuboid = `<svg viewBox="0 0 300 190" role="img" aria-label="Cuboid ABCDEFGH. AB = 12 cm along the front bottom edge, BC = 9 cm going back, CG = 8 cm going up."><g fill="none" stroke="currentColor" stroke-width="1.5"><path d="M40 150 H190 V70 H40 Z M190 150 L250 100 V20 H100 L40 70 M190 70 L250 20"/><path d="M40 150 L100 100 H250 M100 100 V20" stroke-dasharray="4 3" stroke-width="1"/></g><g ${TXT} font-size="12" font-style="italic"><text x="30" y="164">A</text><text x="192" y="164">B</text><text x="254" y="104">C</text><text x="86" y="98">D</text><text x="28" y="68">E</text><text x="194" y="84">F</text><text x="254" y="18">G</text><text x="92" y="16">H</text></g><g ${TXT} font-size="12"><text x="115" y="166" text-anchor="middle">12 cm</text><text x="226" y="136">9 cm</text><text x="256" y="62">8 cm</text></g>${NDA(150, 184)}</svg>`;

const triX = `<svg viewBox="0 0 260 150" role="img" aria-label="A triangle with sides 7.2 cm and 8.5 cm meeting at the acute angle x, at the bottom left."><path d="M30 120 L230 120 L130 22 Z" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M55 120 A25 25 0 0 0 48 102" fill="none" stroke="currentColor" stroke-width="1.2"/><g ${TXT} font-size="12"><text x="60" y="112" font-style="italic">x</text><text x="72" y="64" text-anchor="end">7.2 cm</text><text x="130" y="136" text-anchor="middle">8.5 cm</text></g>${NDA(130, 148)}</svg>`;

const frustum = `<svg viewBox="0 0 260 210" role="img" aria-label="A frustum made by removing a small cone from the top of a large cone. Large cone: base radius 9 cm, height 24 cm. Small cone: base radius 3 cm, height 8 cm."><g fill="none" stroke="currentColor" stroke-width="1.5"><ellipse cx="130" cy="170" rx="54" ry="10"/><ellipse cx="130" cy="72" rx="18" ry="4"/><path d="M76 170 L112 72 M184 170 L148 72"/><path d="M112 72 L130 22 L148 72" stroke-dasharray="4 3" stroke-width="1"/><path d="M130 170 H184" stroke-width="1.2"/><path d="M130 72 H148" stroke-width="1.2"/><path d="M215 22 V170 M210 28 L215 22 L220 28 M210 164 L215 170 L220 164" stroke-width="1.1"/><path d="M60 22 V72 M55 28 L60 22 L65 28 M55 66 L60 72 L65 66" stroke-width="1.1"/></g><g ${TXT} font-size="12"><text x="157" y="190" text-anchor="middle">9 cm</text><text x="152" y="66">3 cm</text><text x="222" y="100">24 cm</text><text x="54" y="50" text-anchor="end">8 cm</text></g>${NDA(130, 206)}</svg>`;

const BIS = "A recipe for 12 biscuits uses 150 g of flour.";
const PUZZLE = "Here are the times, in minutes, that 15 people took to complete a puzzle. The times are in order.";
const TIMES = "12 &nbsp; 15 &nbsp; 17 &nbsp; 18 &nbsp; 21 &nbsp; 22 &nbsp; 24 &nbsp; 25 &nbsp; 27 &nbsp; 30 &nbsp; 31 &nbsp; 33 &nbsp; 36 &nbsp; 40 &nbsp; 44";
const TIMES_T = "12, 15, 17, 18, 21, 22, 24, 25, 27, 30, 31, 33, 36, 40, 44";

export const COLD_CASE_B3: Scheme[] = [
  {
    id: "ccb3-q1a", source: { paper: SRC, q: "1", part: "a" }, topic: "ratio", tier: "H", calculator: true,
    prompt: `${BIS}<br>Work out how much flour is needed to make 30 biscuits.`,
    marks: 2, answer: "375 g", solution: ["150 ÷ 12 = 12.5 g per biscuit", "12.5 × 30 = 375 g"], noWorking: "full",
    points: [
      { id: "M1", code: "M1", criterion: "150 ÷ 12 × 30 (or 150 × 2.5).", reject: ["150 + 18 (adding the same amount)"] },
      { id: "A1", code: "A1", dep: ["M1"], criterion: "375" },
    ],
    errors: [{ id: "wrong-operation", looksLike: "added the same amount to both: 18 more biscuits does not mean 18 more grams" }],
    dangerZones: [{ id: "scale", when: "the student is scaling the recipe", warn: "Proportion means multiplying, not adding." }],
    coach: {
      keyWords: [{ text: "12 biscuits", why: "The recipe size you're scaling from." }, { text: "30 biscuits", why: "The size you're scaling to." }],
      clues: ["Find the flour for one biscuit first.", "150 ÷ 12 = 12.5 g per biscuit.", "Multiply by the number of biscuits you want."],
      traps: ["Is your answer in grams?"],
    },
  },
  {
    id: "ccb3-q1b", source: { paper: SRC, q: "1", part: "b" }, topic: "ratio", tier: "H", calculator: true,
    prompt: "Jo has 500 g of flour. Work out the greatest number of biscuits Jo can make.",
    promptText: `${BIS} Jo has 500 g of flour. Work out the greatest number of biscuits Jo can make.`,
    marks: 1, answer: "40 biscuits", solution: ["500 ÷ 12.5 = 40"], noWorking: "full",
    points: [{ id: "B1", code: "B1", criterion: "40 (500 ÷ 12.5)." }],
    errors: [{ id: "rounding", looksLike: "rounded up: Jo can't make part of a biscuit with flour she doesn't have" }],
    dangerZones: [{ id: "round", when: "the student has a division result", warn: "Greatest number she can make: round the right way." }],
    coach: {
      keyWords: [{ text: "greatest number", why: "Whole biscuits only, and she can't use more flour than she has." }],
      clues: ["Each biscuit uses 12.5 g of flour.", "Divide 500 by 12.5.", "If it isn't a whole number, round down."],
      traps: ["Does your number of biscuits use 500 g or less?"],
    },
  },
  {
    id: "ccb3-q2", source: { paper: SRC, q: "2" }, topic: "pct", tier: "H", calculator: true,
    prompt: "The price of a phone is £480<br>The price is increased by 5%. The new price is then reduced by 5%.<br>Work out the final price of the phone.",
    marks: 3, answer: "£478.80", solution: ["480 × 1.05 = 504", "504 × 0.95 = 478.80"], noWorking: "full",
    showWorking: "Write each multiplier step on its own line.",
    points: [
      { id: "M1a", code: "M1", criterion: "480 × 1.05 = 504", accept: ["480 + 24 = 504"] },
      { id: "M1b", code: "M1", ft: true, dep: ["M1a"], criterion: "504 × 0.95", accept: ["504 − 25.20"] },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "£478.80", reject: ["£480", "£478.8 (money needs two decimal places)"] },
    ],
    errors: [
      { id: "reverse-pct", looksLike: "said the price goes back to £480: the 5% reduction is 5% of the new, higher price" },
      { id: "wrong-form", looksLike: "wrote £478.8: money needs two decimal places" },
    ],
    dangerZones: [{ id: "second", when: "the increased price (504) has been found", warn: "5% of which price comes off now?" }],
    coach: {
      keyWords: [{ text: "The new price is then reduced by 5%", why: "5% of the new price, not of £480." }, { text: "final price", why: "After both changes." }],
      clues: ["Use multipliers: an increase of 5% is × 1.05.", "480 × 1.05 = 504.", "A decrease of 5% is × 0.95. Apply it to 504."],
      traps: ["Is your answer written with two decimal places?"],
    },
  },
  {
    id: "ccb3-q3", source: { paper: SRC, q: "3" }, topic: "lin", tier: "H", calculator: true,
    prompt: `Solve &nbsp;<span class="eq">${fr("3x − 1", 4)} = ${fr("x + 5", 3)}</span>`,
    promptText: "Solve (3x − 1)/4 = (x + 5)/3.",
    marks: 3, answer: "x = 4.6", solution: ["3(3x − 1) = 4(x + 5)", "9x − 3 = 4x + 20", "5x = 23", "x = 4.6"], noWorking: "full",
    showWorking: "Write the cross-multiplied line with brackets before expanding.",
    points: [
      { id: "M1a", code: "M1", criterion: "Cross-multiplies: 3(3x − 1) = 4(x + 5)" },
      { id: "M1b", code: "M1", ft: true, dep: ["M1a"], criterion: "9x − 3 = 4x + 20, so 5x = 23" },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "x = 4.6 oe", accept: ["23/5", "4 3/5"] },
    ],
    errors: [
      { id: "missed-term", looksLike: "multiplied only one term in each bracket, giving 9x − 1 or 4x + 5" },
      { id: "sign-error", looksLike: "sign errors when collecting terms" },
    ],
    markerNotes: ["The answer doesn't have to be a whole number."],
    dangerZones: [{ id: "expand", when: "the student has written 3(3x − 1) = 4(x + 5)", warn: "Multiply every term inside each bracket." }],
    coach: {
      keyWords: [{ text: "Solve", why: "Find x. It might not be a whole number." }],
      clues: ["Multiply both sides by 12 (or cross-multiply) to clear the fractions.", "3(3x − 1) = 4(x + 5). Expand both sides.", "Collect the x terms on one side and solve."],
      traps: ["Put your x back into both sides: do they match?"],
    },
  },
  {
    id: "ccb3-q4a", source: { paper: SRC, q: "4", part: "a" }, topic: "polygon", tier: "H", calculator: true,
    prompt: "Each interior angle of a regular polygon is 162°<br>Work out the number of sides of the polygon.",
    marks: 2, answer: "20 sides", solution: ["Exterior angle = 180 − 162 = 18°", "360 ÷ 18 = 20"], noWorking: "full",
    points: [
      { id: "M1", code: "M1", criterion: "Exterior angle = 180 − 162 = 18°" },
      { id: "A1", code: "A1", dep: ["M1"], criterion: "360 ÷ 18 = 20" },
    ],
    errors: [{ id: "wrong-operation", looksLike: "worked out 360 ÷ 162: divide 360 by the exterior angle" }],
    dangerZones: [{ id: "ext", when: "the student is about to divide into 360", warn: "360 ÷ the exterior angle, not the interior angle." }],
    coach: {
      keyWords: [{ text: "interior angle", why: "Change it to an exterior angle first." }, { text: "regular", why: "All exterior angles are equal, and they add to 360°." }],
      clues: ["Interior + exterior = 180°.", "Exterior angle = 18°.", "Exterior angles of any polygon add up to 360°."],
      traps: ["Did you divide 360 by the exterior angle?"],
    },
  },
  {
    id: "ccb3-q4b", source: { paper: SRC, q: "4", part: "b" }, topic: "polygon", tier: "H", calculator: true,
    prompt: "Work out the sum of the interior angles of the polygon.",
    promptText: "A regular polygon has interior angles of 162° (it has 20 sides). Work out the sum of the interior angles of the polygon.",
    marks: 1, answer: "3240°", solution: ["20 × 162 = 3240°", "or (20 − 2) × 180 = 3240°"], noWorking: "full",
    points: [{ id: "B1", code: "B1", ft: true, criterion: "3240° (20 × 162 or 18 × 180; ft their number of sides).", reject: ["3600 (20 × 180)"] }],
    errors: [{ id: "stopped-early", looksLike: "used n × 180 and forgot to subtract 2 first" }],
    dangerZones: [{ id: "sum", when: "the student is working out the sum", warn: "n − 2 triangles, or n angles of 162°." }],
    coach: {
      keyWords: [{ text: "sum of the interior angles", why: "All the interior angles added together." }],
      clues: ["All the interior angles are 162°.", "How many are there?", "Or use (n − 2) × 180."],
      traps: ["Did you subtract 2 if you used the formula?"],
    },
  },
  {
    id: "ccb3-q5", source: { paper: SRC, q: "5" }, topic: "sf", tier: "H", calculator: true,
    prompt: "The population of a country is 6.7 × 10<sup>7</sup><br>The area of the country is 2.43 × 10<sup>5</sup> km<sup>2</sup><br>Work out the population density of the country, in people per km<sup>2</sup><br>Give your answer in standard form, correct to 3 significant figures.",
    promptText: "The population of a country is 6.7 × 10^7. The area of the country is 2.43 × 10^5 km². Work out the population density, in people per km². Give your answer in standard form, correct to 3 significant figures.",
    marks: 3, answer: "2.76 × 10²", solution: ["(6.7 × 10⁷) ÷ (2.43 × 10⁵) = 275.7…", "= 2.76 × 10²"], noWorking: "full",
    points: [
      { id: "M1", code: "M1", criterion: "(6.7 × 10⁷) ÷ (2.43 × 10⁵)", reject: ["area ÷ population"] },
      { id: "A1a", code: "A1", dep: ["M1"], criterion: "275.7…" },
      { id: "A1b", code: "A1", dep: ["M1"], criterion: "2.76 × 10²", reject: ["276 (not standard form)", "27.6 × 10¹"] },
    ],
    errors: [
      { id: "wrong-direction", looksLike: "divided area by population" },
      { id: "not-standard-form", looksLike: "left the answer as 276, or wrote 27.6 × 10¹" },
    ],
    dangerZones: [{ id: "form", when: "a value such as 275.7 has been found", warn: "The question wants standard form, to 3 significant figures." }],
    coach: {
      keyWords: [{ text: "people per km2", why: "People ÷ area." }, { text: "standard form", why: "a × 10ⁿ with 1 ≤ a < 10." }],
      clues: ["Population density = population ÷ area.", "Type (6.7 × 10⁷) ÷ (2.43 × 10⁵) using the ×10ˣ key.", "Round to 3 significant figures and write in standard form."],
      traps: ["Is the front number between 1 and 10?"],
    },
  },
  {
    id: "ccb3-q6", source: { paper: SRC, q: "6" }, topic: "transform", tier: "H", calculator: true,
    prompt: "The diagram shows triangle <b>P</b> and triangle <b>Q</b> on a coordinate grid.<br>Describe fully the single transformation that maps triangle <b>P</b> onto triangle <b>Q</b>.",
    promptText: "Triangle P has vertices (2, 2), (2, 3), (4, 2). Triangle Q has vertices (4, 4), (4, 7), (10, 4). Describe fully the single transformation that maps triangle P onto triangle Q.",
    diagram: triPQ, marks: 3, answer: "Enlargement, scale factor 3, centre (1, 1)",
    solution: ["Enlargement", "Scale factor 3 (each side is 3 times as long)", "Centre (1, 1): lines through matching corners meet there"], noWorking: "full",
    points: [
      { id: "B1a", code: "B1", criterion: "Enlargement", reject: ["'it gets 3 times bigger' without the word enlargement"] },
      { id: "B1b", code: "B1", criterion: "Scale factor 3" },
      { id: "B1c", code: "B1", criterion: "Centre (1, 1)", reject: ["(0, 0)"] },
    ],
    errors: [
      { id: "stopped-early", looksLike: "left out the centre, or guessed (0, 0)" },
      { id: "wrong-form", looksLike: "wrote 'it gets 3 times bigger' without the word enlargement" },
    ],
    markerNotes: ["Mark each of the three facts independently. More than one transformation scores 0."],
    dangerZones: [{ id: "centre", when: "the student has named the transformation and scale factor", warn: "'Describe fully' means the centre too." }],
    coach: {
      keyWords: [{ text: "Describe fully", why: "Name it, give the scale factor, and give the centre." }, { text: "single transformation", why: "One transformation only." }],
      clues: ["Q is bigger than P, same shape: what transformation is that?", "Compare a pair of matching sides to get the scale factor.", "Draw lines through matching corners: they meet at the centre."],
      traps: ["Have you given all three: the name, scale factor and centre?"],
    },
  },
  {
    id: "ccb3-q7a", source: { paper: SRC, q: "7", part: "a" }, topic: "ratio", tier: "H", calculator: true,
    prompt: "A car uses 5.6 litres of petrol for every 100 km it travels.<br>Petrol costs £1.52 per litre.<br>Work out the cost of the petrol for a journey of 340 km.",
    marks: 3, answer: "£28.94", solution: ["340 ÷ 100 × 5.6 = 19.04 litres", "19.04 × 1.52 = 28.9408", "£28.94"], noWorking: "full",
    showWorking: "Write the litres used as a line before working out the cost.",
    points: [
      { id: "M1a", code: "M1", criterion: "340 ÷ 100 × 5.6 = 19.04 litres", reject: ["340 × 5.6"] },
      { id: "M1b", code: "M1", ft: true, criterion: "19.04 × 1.52 (their litres × 1.52)." },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "£28.94", reject: ["£28.88 (litres rounded to 19)"] },
    ],
    errors: [
      { id: "wrong-operation", looksLike: "multiplied 340 by 5.6 and forgot the 'per 100 km'" },
      { id: "rounding", looksLike: "rounded the litres to 19 before working out the cost" },
    ],
    dangerZones: [{ id: "per100", when: "the student is working out the petrol used", warn: "5.6 litres is for every 100 km, not every km." }],
    coach: {
      keyWords: [{ text: "for every 100 km", why: "Find how many hundreds of km are in 340." }, { text: "per litre", why: "Cost = litres × price per litre." }],
      clues: ["340 km is 3.4 lots of 100 km.", "Litres used = 3.4 × 5.6.", "Multiply the litres by £1.52."],
      traps: ["Did you keep the unrounded litres until the end?"],
    },
  },
  {
    id: "ccb3-q7b", source: { paper: SRC, q: "7", part: "b" }, topic: "sdp", tier: "H", calculator: true,
    prompt: "The speed limit on a road is 15 m/s. Change 15 m/s to km/h.",
    marks: 1, answer: "54 km/h", solution: ["15 × 3600 = 54 000 m per hour", "54 000 ÷ 1000 = 54 km/h"], noWorking: "full",
    points: [{ id: "B1", code: "B1", criterion: "54", reject: ["4.16… (divided by 3.6)"] }],
    errors: [{ id: "rearrange", looksLike: "divided by 3.6 instead of multiplying: a speed in km/h is always a bigger number than the same speed in m/s" }],
    dangerZones: [{ id: "dir", when: "the student is converting", warn: "Should the km/h number be bigger or smaller than 15?" }],
    coach: {
      keyWords: [{ text: "15 m/s", why: "15 metres every second." }, { text: "km/h", why: "Kilometres every hour." }],
      clues: ["Find how far it goes in an hour: there are 3600 seconds in an hour.", "15 × 3600 metres per hour.", "Change metres to kilometres: ÷ 1000."],
      traps: ["Is your km/h number bigger than 15?"],
    },
  },
  {
    id: "ccb3-q8a", source: { paper: SRC, q: "8", part: "a" }, topic: "geoseq", tier: "H", calculator: true,
    prompt: "Here are the first three terms of a geometric sequence.<br><span class=\"eq\">4 &nbsp;&nbsp; 6 &nbsp;&nbsp; 9</span><br>Write down the common ratio of the sequence.",
    promptText: "Here are the first three terms of a geometric sequence: 4, 6, 9. Write down the common ratio of the sequence.",
    marks: 1, answer: "1.5", solution: ["6 ÷ 4 = 1.5"], noWorking: "full",
    points: [{ id: "B1", code: "B1", criterion: "1.5", accept: ["3/2"], reject: ["2 (a common difference)"] }],
    errors: [{ id: "wrong-operation", looksLike: "treated the sequence as arithmetic and gave a difference" }],
    dangerZones: [{ id: "ratio", when: "the student is finding the ratio", warn: "Geometric: divide a term by the one before it." }],
    coach: {
      keyWords: [{ text: "geometric sequence", why: "Each term is multiplied by the same number." }, { text: "common ratio", why: "The number you multiply by." }],
      clues: ["Divide the second term by the first.", "Check it with the third term divided by the second.", "That number is the ratio."],
      traps: ["Does it work for 6 → 9 as well as 4 → 6?"],
    },
  },
  {
    id: "ccb3-q8b", source: { paper: SRC, q: "8", part: "b" }, topic: "geoseq", tier: "H", calculator: true,
    prompt: "Work out the 8th term of the sequence. Give your answer correct to 1 decimal place.",
    promptText: "A geometric sequence starts 4, 6, 9 (common ratio 1.5). Work out the 8th term. Give your answer correct to 1 decimal place.",
    marks: 2, answer: "68.3", solution: ["8th term = 4 × 1.5⁷", "= 68.34…", "= 68.3"], noWorking: "full",
    points: [
      { id: "M1", code: "M1", ft: true, criterion: "4 × 1.5⁷ (ft their ratio).", reject: ["4 × 1.5⁸"] },
      { id: "A1", code: "A1", dep: ["M1"], criterion: "68.3" },
    ],
    errors: [{ id: "index-law", looksLike: "used 1.5⁸: the 8th term has only seven multiplications, because the first term has none" }],
    dangerZones: [{ id: "power", when: "the student is writing the power", warn: "How many times do you multiply to get from the 1st term to the 8th?" }],
    coach: {
      keyWords: [{ text: "8th term", why: "Seven multiplications after the first term." }, { text: "1 decimal place", why: "Round at the end." }],
      clues: ["Each term is the one before × the ratio.", "From term 1 to term 8 is seven steps.", "8th term = first term × ratio⁷."],
      traps: ["Is the power 7, not 8?"],
    },
  },
  {
    id: "ccb3-q8c", source: { paper: SRC, q: "8", part: "c" }, topic: "geoseq", tier: "H", calculator: true,
    prompt: "Which term of the sequence is the first to be greater than 1000?<br>You must show your working.",
    promptText: "A geometric sequence starts 4, 6, 9 (common ratio 1.5). Which term of the sequence is the first to be greater than 1000? You must show your working.",
    marks: 2, answer: "The 15th term", solution: ["14th term = 4 × 1.5¹³ = 778.5", "15th term = 4 × 1.5¹⁴ = 1167.7", "The 15th term"], noWorking: "zero",
    showWorking: "This question says 'You must show your working': show the terms either side of 1000.",
    points: [
      { id: "M1", code: "M1", criterion: "Values either side of 1000: the 14th term is 778.5 and the 15th term is 1167.7." },
      { id: "A1", code: "A1", dep: ["M1"], criterion: "The 15th term", reject: ["14 (the power)"] },
    ],
    errors: [{ id: "wrong-share", looksLike: "gave 14, the power, when the question asks which term" }],
    dangerZones: [{ id: "which", when: "the student has found a term above 1000", warn: "Which term number is it? The power is one less." }],
    coach: {
      keyWords: [{ text: "first to be greater than 1000", why: "Find the last term below and the first above." }, { text: "You must show your working", why: "Show both values." }],
      clues: ["Keep multiplying by 1.5 (or use 4 × 1.5ⁿ⁻¹).", "Find the last term below 1000 and the first above it.", "Write down both, with their term numbers."],
      traps: ["Is your answer the term number, not the power?"],
    },
  },
  {
    id: "ccb3-q9", source: { paper: SRC, q: "9" }, topic: "counting", tier: "H", calculator: true,
    prompt: "Tariq makes three-digit numbers using the digits 1, 2, 3, 4, 5 and 6<br>He does not use any digit more than once in a number.<br>Work out how many different even three-digit numbers Tariq can make.",
    marks: 3, answer: "60", solution: ["Last digit 2, 4 or 6: 3 choices", "First digit: 5 choices left, then 4", "3 × 5 × 4 = 60"], noWorking: "full",
    showWorking: "Write the choices for each digit before multiplying.",
    points: [
      { id: "M1a", code: "M1", criterion: "The last digit must be 2, 4 or 6, so there are 3 choices." },
      { id: "M1b", code: "M1", criterion: "3 × 5 × 4", reject: ["6 × 6 × 6", "3 × 6 × 6"] },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "60", reject: ["120 (counts odd numbers too)"] },
    ],
    errors: [
      { id: "replacement", looksLike: "worked out 6 × 6 × 6 or 3 × 6 × 6, which lets digits repeat" },
      { id: "stopped-early", looksLike: "worked out 6 × 5 × 4 = 120, which counts the odd numbers as well" },
    ],
    dangerZones: [{ id: "restrict", when: "the student starts counting choices", warn: "Start with the digit that has a restriction." }],
    coach: {
      keyWords: [{ text: "not use any digit more than once", why: "Each choice leaves one fewer digit." }, { text: "even", why: "The last digit must be even." }],
      clues: ["Start with the last digit: it must be even.", "There are 3 even digits. Then how many are left for the first digit?", "Multiply the number of choices for each place."],
      traps: ["Did you stop digits repeating?", "Is every number you counted even?"],
    },
  },
  {
    id: "ccb3-q10a", source: { paper: SRC, q: "10", part: "a" }, topic: "cumfreq", tier: "H", calculator: true,
    prompt: `${PUZZLE}<br><span class="eq">${TIMES}</span><br>Write down the median time.`,
    promptText: `${PUZZLE} ${TIMES_T}. Write down the median time.`,
    marks: 1, answer: "25 minutes", solution: ["8th value of 15 = 25"], noWorking: "full",
    points: [{ id: "B1", code: "B1", criterion: "25" }],
    errors: [{ id: "wrong-average", looksLike: "gave the wrong middle value" }],
    dangerZones: [{ id: "middle", when: "the student is finding the median", warn: "15 values: which position is the middle?" }],
    coach: {
      keyWords: [{ text: "median", why: "The middle value." }, { text: "15 people", why: "The middle of 15 is the 8th." }],
      clues: ["The times are already in order.", "With 15 values, the middle is the 8th.", "Count along to the 8th value."],
      traps: ["Did you count to the 8th value?"],
    },
  },
  {
    id: "ccb3-q10b", source: { paper: SRC, q: "10", part: "b" }, topic: "cumfreq", tier: "H", calculator: true,
    prompt: "Work out the interquartile range of the times.",
    promptText: `${PUZZLE} ${TIMES_T}. Work out the interquartile range of the times.`,
    marks: 2, answer: "IQR = 15", solution: ["Lower quartile: 4th value = 18", "Upper quartile: 12th value = 33", "33 − 18"], noWorking: "full",
    showWorking: "Write both quartiles before subtracting.",
    points: [
      { id: "M1", code: "M1", criterion: "Lower quartile 18 (4th value) or upper quartile 33 (12th value)." },
      { id: "A1", code: "A1", dep: ["M1"], criterion: "33 − 18 = 15", reject: ["32 (the range)"] },
    ],
    errors: [
      { id: "wrong-average", looksLike: "gave the range (44 − 12 = 32)" },
      { id: "wrong-share", looksLike: "picked the wrong positions for the quartiles: with 15 values they're the 4th and 12th" },
    ],
    dangerZones: [{ id: "pos", when: "the student is finding the quartiles", warn: "Quartile positions for 15 values: a quarter and three quarters of the way through." }],
    coach: {
      keyWords: [{ text: "interquartile range", why: "Upper quartile − lower quartile." }],
      clues: ["With 15 values, the lower quartile is the 4th value.", "The upper quartile is the 12th value.", "Subtract the lower quartile from the upper quartile."],
      traps: ["Did you use the quartiles, not the smallest and largest?"],
    },
  },
  {
    id: "ccb3-q10c", source: { paper: SRC, q: "10", part: "c" }, topic: "cumfreq", tier: "H", calculator: true,
    prompt: "On the grid, draw a box plot for the times.<br><small>Sketch the box plot in your working with its five values labelled.</small>",
    promptText: `${PUZZLE} ${TIMES_T}. Draw a box plot for the times (scale 0 to 50 minutes).`,
    diagram: boxAxis, marks: 2, answer: "Box plot with 12, 18, 25, 33, 44",
    solution: ["Minimum 12, lower quartile 18, median 25, upper quartile 33, maximum 44", "Whiskers to 12 and 44, box from 18 to 33, median line at 25"], noWorking: "full",
    points: [
      { id: "B1a", code: "B1", criterion: "At least three of the five values (12, 18, 25, 33, 44) correctly placed." },
      { id: "B1b", code: "B1", criterion: "Whiskers to 12 and 44, box from 18 to 33, median line at 25 (all five correct)." },
    ],
    errors: [{ id: "wrong-share", looksLike: "drew the ends of the box at the lowest and highest values" }],
    markerNotes: ["The student can't draw on the printed scale. Accept a sketched box plot with the five values labelled, or the five values clearly listed as min, LQ, median, UQ, max. Mike's B2 (B1 for at least three of five values) is split into B1a and B1b to match."],
    dangerZones: [{ id: "box", when: "the student is drawing the box", warn: "The box runs from quartile to quartile; the whiskers go to the ends." }],
    coach: {
      keyWords: [{ text: "box plot", why: "Five values: smallest, lower quartile, median, upper quartile, largest." }],
      clues: ["You already have the median and quartiles from (a) and (b).", "The whiskers go out to the smallest and largest times.", "Draw the box from the lower to the upper quartile with a line at the median."],
      traps: ["Is each of the five values labelled or clearly placed?"],
    },
  },
  {
    id: "ccb3-q11", source: { paper: SRC, q: "11" }, topic: "similar", tier: "H", calculator: true,
    prompt: "Two bottles are mathematically similar.<br>The small bottle has a height of 15 cm and holds 500 ml.<br>The large bottle has a height of 24 cm.<br>Work out how much the large bottle holds.",
    marks: 3, answer: "2048 ml", solution: ["Length scale factor = 24 ÷ 15 = 1.6", "Volume scale factor = 1.6³ = 4.096", "500 × 4.096 = 2048 ml"], noWorking: "full",
    showWorking: "Write the length scale factor, then cube it.",
    points: [
      { id: "M1a", code: "M1", criterion: "Length scale factor = 24 ÷ 15 = 1.6" },
      { id: "M1b", code: "M1", ft: true, dep: ["M1a"], criterion: "Volume scale factor = 1.6³ = 4.096" },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "500 × 4.096 = 2048", reject: ["800 (× 1.6)", "1280 (× 1.6²)"] },
    ],
    errors: [{ id: "missed-square", looksLike: "multiplied by 1.6 only (800 ml) or by 1.6² (1280 ml): capacity is a volume, so the scale factor must be cubed" }],
    dangerZones: [{ id: "cube", when: "the length scale factor 1.6 has been found", warn: "Capacity is a volume. What happens to the scale factor?" }],
    coach: {
      keyWords: [{ text: "mathematically similar", why: "Same shape, different size: use scale factors." }, { text: "holds", why: "Capacity is a volume." }],
      clues: ["Find the length scale factor from the heights.", "Volume scale factor = length scale factor cubed.", "Multiply 500 ml by the volume scale factor."],
      traps: ["Did you cube the scale factor?"],
    },
  },
  {
    id: "ccb3-q12", source: { paper: SRC, q: "12" }, topic: "linineq", tier: "H", calculator: true,
    prompt: "On the grid, show by shading the region that satisfies all three of these inequalities.<br><span class=\"eq\">x ≥ 1</span> &nbsp;&nbsp; <span class=\"eq\">y ≥ 2</span> &nbsp;&nbsp; <span class=\"eq\">x + y ≤ 6</span><br>Label the region R.<br><small>Sketch the axes, lines and region in your working.</small>",
    promptText: "On a grid (x and y from −1 to 8), show by shading the region that satisfies all three inequalities x ≥ 1, y ≥ 2, x + y ≤ 6. Label the region R.",
    diagram: blankRegion, marks: 4, answer: "Triangle with vertices (1, 2), (4, 2) and (1, 5)",
    solution: ["Draw x = 1 (vertical), y = 2 (horizontal) and x + y = 6 through (0, 6) and (6, 0)", "R is the triangle with vertices (1, 2), (4, 2) and (1, 5)"], noWorking: "full",
    points: [
      { id: "B1a", code: "B1", criterion: "The line x = 1 drawn.", reject: ["x = 1 drawn horizontally"] },
      { id: "B1b", code: "B1", criterion: "The line y = 2 drawn." },
      { id: "B1c", code: "B1", criterion: "The line x + y = 6 drawn, through (0, 6) and (6, 0)." },
      { id: "B1d", code: "B1", criterion: "The correct triangular region identified and labelled R." },
    ],
    errors: [
      { id: "swapped", looksLike: "drew x = 1 as a horizontal line: x = 1 is vertical and y = 2 is horizontal" },
      { id: "inequality-region", looksLike: "shaded on the wrong side of x + y = 6" },
    ],
    markerNotes: ["The student sketches on a blank page. Judge each line from labels or intercepts on their sketch, and the region from its corners (1, 2), (4, 2) and (1, 5). Test point: (2, 3) is inside R."],
    dangerZones: [
      { id: "vert", when: "the student is drawing x = 1 or y = 2", warn: "x = 1 is a vertical line." },
      { id: "side", when: "the student is choosing the side of x + y = 6", warn: "Test a point such as (2, 3) in all three inequalities." },
    ],
    coach: {
      keyWords: [{ text: "all three", why: "R must satisfy every inequality at once." }, { text: "Label the region R", why: "The region needs its label." }],
      clues: ["Draw the three boundary lines: x = 1, y = 2 and x + y = 6.", "x + y = 6 goes through (0, 6) and (6, 0).", "Find the region that's right of x = 1, above y = 2 and below x + y = 6."],
      traps: ["Is x = 1 vertical?", "Does (2, 3) lie inside your R?"],
    },
  },
  {
    id: "ccb3-q13a", source: { paper: SRC, q: "13", part: "a" }, topic: "trig3d", tier: "H", calculator: true,
    prompt: "ABCDEFGH is a cuboid.<br>AB = 12 cm &nbsp;&nbsp; BC = 9 cm &nbsp;&nbsp; CG = 8 cm<br>Work out the length of AC.",
    diagram: cuboid, marks: 2, answer: "AC = 15 cm", solution: ["AC² = 12² + 9² = 225", "AC = 15 cm"], noWorking: "full",
    points: [
      { id: "M1", code: "M1", criterion: "12² + 9²" },
      { id: "A1", code: "A1", dep: ["M1"], criterion: "AC = 15" },
    ],
    errors: [{ id: "no-sqrt", looksLike: "gave 225 without square-rooting" }, { id: "missed-square", looksLike: "added the lengths, not their squares" }],
    dangerZones: [{ id: "root", when: "12² + 9² has been worked out", warn: "That's AC squared." }],
    coach: {
      keyWords: [{ text: "AC", why: "The diagonal across the base." }],
      clues: ["Triangle ABC is right-angled at B.", "Use Pythagoras: AC² = AB² + BC².", "Square root to finish."],
      traps: ["Did you square-root at the end?"],
    },
  },
  {
    id: "ccb3-q13b", source: { paper: SRC, q: "13", part: "b" }, topic: "trig3d", tier: "H", calculator: true,
    prompt: "Work out the length of the diagonal AG.",
    promptText: "ABCDEFGH is a cuboid with AB = 12 cm, BC = 9 cm, CG = 8 cm, and AC = 15 cm. Work out the length of the diagonal AG.",
    diagram: cuboid, marks: 2, answer: "AG = 17 cm", solution: ["AG² = 15² + 8² = 289", "AG = 17 cm"], noWorking: "full",
    points: [
      { id: "M1", code: "M1", ft: true, criterion: "15² + 8² (or 12² + 9² + 8²; ft their AC)." },
      { id: "A1", code: "A1", dep: ["M1"], criterion: "AG = 17" },
    ],
    errors: [{ id: "missed-term", looksLike: "used only two of the three dimensions: AG is the hypotenuse of triangle ACG, right-angled at C" }],
    dangerZones: [{ id: "3d", when: "the student is setting up Pythagoras for AG", warn: "AG goes across, back and up: which right-angled triangle is it in?" }],
    coach: {
      keyWords: [{ text: "diagonal AG", why: "Corner to opposite corner, through the inside of the cuboid." }],
      clues: ["AG is the hypotenuse of triangle ACG, with the right angle at C.", "AG² = AC² + CG².", "Use AC from part (a) and CG = 8."],
      traps: ["Did you use all three dimensions?"],
    },
  },
  {
    id: "ccb3-q14", source: { paper: SRC, q: "14" }, topic: "factq2", tier: "H", calculator: true,
    prompt: "Solve, by factorising, &nbsp;<span class=\"eq\">6x<sup>2</sup> − 7x − 3 = 0</span>",
    promptText: "Solve, by factorising, 6x² − 7x − 3 = 0.",
    marks: 3, answer: "x = −1/3 and x = 3/2", solution: ["(3x + 1)(2x − 3) = 0", "3x + 1 = 0 → x = −1/3", "2x − 3 = 0 → x = 3/2"], noWorking: "zero",
    showWorking: "The question says 'by factorising', so the brackets must be seen.",
    points: [
      { id: "M1", code: "M1", criterion: "(3x ± 1)(2x ± 3)" },
      { id: "A1a", code: "A1", dep: ["M1"], criterion: "(3x + 1)(2x − 3)" },
      { id: "A1b", code: "A1", dep: ["A1a"], criterion: "x = −1/3 and x = 3/2", accept: ["x = −0.333… and x = 1.5"], reject: ["−1 and 3 read off the brackets"] },
    ],
    errors: [
      { id: "wrong-form", looksLike: "read the solutions straight off the brackets as −1 and 3: each bracket must be set equal to zero and solved" },
      { id: "wrong-formula", looksLike: "used the quadratic formula when the question says 'by factorising'" },
    ],
    dangerZones: [{ id: "solve", when: "the brackets have been found", warn: "Set each bracket equal to zero and solve it." }],
    coach: {
      keyWords: [{ text: "by factorising", why: "The method is set: brackets, not the formula." }],
      clues: ["Find two brackets of the form (3x ± …)(2x ± …).", "Check the middle term: it must come to −7x.", "Set each bracket equal to 0 and solve."],
      traps: ["Did you solve each bracket = 0, not just read the numbers off?"],
    },
  },
  {
    id: "ccb3-q15", source: { paper: SRC, q: "15" }, topic: "growth", tier: "H", calculator: true,
    prompt: "The value of a van falls from £15 000 to £9720 in 2 years.<br>The value falls by the same percentage each year.<br>Work out this percentage. Give your answer correct to 1 decimal place.",
    marks: 4, answer: "19.5%", solution: ["9720 ÷ 15 000 = 0.648", "√0.648 = 0.8049…", "1 − 0.8049… = 0.195…", "19.5%"], noWorking: "full",
    showWorking: "Write the overall multiplier, its square root, and the subtraction as separate lines.",
    points: [
      { id: "M1a", code: "M1", criterion: "9720 ÷ 15 000 = 0.648" },
      { id: "M1b", code: "M1", dep: ["M1a"], criterion: "√0.648 = 0.8049…" },
      { id: "M1c", code: "M1", dep: ["M1b"], criterion: "1 − 0.8049…" },
      { id: "A1", code: "A1", dep: ["M1c"], criterion: "19.5", reject: ["17.6 (35.2% halved)", "80.5 (the multiplier)"] },
    ],
    errors: [
      { id: "simple-compound", looksLike: "worked out the total fall, 35.2%, and halved it to get 17.6%" },
      { id: "complement", looksLike: "gave 80.5%, the multiplier, as the answer" },
    ],
    dangerZones: [
      { id: "root", when: "the overall multiplier 0.648 has been found", warn: "Two years of the same multiplier. How do you undo squaring?" },
      { id: "fall", when: "0.8049… has been found", warn: "That's the multiplier. What percentage is lost?" },
    ],
    coach: {
      keyWords: [{ text: "the same percentage each year", why: "The same multiplier, used twice." }, { text: "1 decimal place", why: "Round at the end." }],
      clues: ["Find the overall multiplier: new value ÷ old value.", "That's the yearly multiplier squared, so square root it.", "Turn the multiplier into a percentage decrease."],
      traps: ["Is your answer the decrease, not the multiplier?"],
    },
  },
  {
    id: "ccb3-q16", source: { paper: SRC, q: "16" }, topic: "areasin", tier: "H", calculator: true,
    prompt: "The diagram shows a triangle with an acute angle x.<br>The area of the triangle is 24 cm<sup>2</sup><br>Work out the size of angle x. Give your answer correct to 1 decimal place.",
    promptText: "A triangle has sides 7.2 cm and 8.5 cm with the acute angle x between them. The area of the triangle is 24 cm². Work out the size of angle x, correct to 1 decimal place.",
    diagram: triX, marks: 3, answer: "51.7°", solution: ["½ × 8.5 × 7.2 × sin x = 24", "sin x = 24 ÷ 30.6 = 0.7843…", "x = 51.7°"], noWorking: "full",
    points: [
      { id: "M1a", code: "M1", criterion: "½ × 8.5 × 7.2 × sin x = 24" },
      { id: "M1b", code: "M1", dep: ["M1a"], criterion: "sin x = 24/30.6 = 0.7843…", reject: ["sin x = 0.392 (missing the ½)"] },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "51.7", reject: ["23.1"] },
    ],
    errors: [
      { id: "half", looksLike: "forgot the ½, giving sin x = 0.392 and an angle of 23.1°" },
      { id: "rounding", looksLike: "rounded 0.7843 to 0.78 before finding the angle" },
    ],
    dangerZones: [{ id: "inv", when: "sin x has been found as a number", warn: "Use inverse sin, and keep the full value." }],
    coach: {
      keyWords: [{ text: "The area of the triangle is 24", why: "Use area = ½ab sin C backwards." }, { text: "1 decimal place", why: "Keep full accuracy until the end." }],
      clues: ["Area = ½ × a × b × sin C, where C is the angle between a and b.", "½ × 8.5 × 7.2 × sin x = 24. Work out ½ × 8.5 × 7.2.", "Divide to find sin x, then use sin⁻¹."],
      traps: ["Did you include the ½?"],
    },
  },
  {
    id: "ccb3-q17a", source: { paper: SRC, q: "17", part: "a" }, topic: "graphshape", tier: "H", calculator: true,
    prompt: "Here is the graph of y = sin x for 0° ≤ x ≤ 360°<br>Write down the coordinates of the maximum point of the graph.",
    diagram: sineGraph, marks: 1, answer: "(90, 1)", solution: ["Maximum at x = 90°, y = 1"], noWorking: "full",
    points: [{ id: "B1", code: "B1", criterion: "(90, 1)", reject: ["(1, 90)"] }],
    errors: [{ id: "swapped", looksLike: "wrote the coordinates the wrong way round" }],
    dangerZones: [{ id: "order", when: "the student is writing the coordinates", warn: "x first, then y." }],
    coach: {
      keyWords: [{ text: "maximum point", why: "The top of the curve." }, { text: "coordinates", why: "Give x and y." }],
      clues: ["Find the highest point on the curve.", "Read down to the x-axis.", "Read across to the y-axis."],
      traps: ["Is it (x, y), in that order?"],
    },
  },
  {
    id: "ccb3-q17b", source: { paper: SRC, q: "17", part: "b" }, topic: "graphshape", tier: "H", calculator: true,
    prompt: "Solve &nbsp;sin x = 0.4 &nbsp;for 0° ≤ x ≤ 360°<br>Give your solutions correct to 1 decimal place.",
    diagram: sineGraph, marks: 3, answer: "23.6° and 156.4°", solution: ["sin⁻¹(0.4) = 23.57…", "x = 23.6°", "x = 180 − 23.6 = 156.4°"], noWorking: "full",
    points: [
      { id: "M1", code: "M1", criterion: "sin⁻¹(0.4) = 23.57…" },
      { id: "A1a", code: "A1", dep: ["M1"], criterion: "23.6" },
      { id: "A1b", code: "A1", dep: ["M1"], criterion: "180 − 23.6 = 156.4", reject: ["336.4 (360 − 23.6, the rule for cosine)"] },
    ],
    errors: [
      { id: "stopped-early", looksLike: "gave only the calculator answer: the line y = 0.4 crosses the curve twice" },
      { id: "wrong-formula", looksLike: "found the second solution as 360 − 23.6, which is the rule for cosine" },
    ],
    dangerZones: [{ id: "second", when: "23.6° has been found", warn: "Look at the graph: how many times does y = 0.4 cross it?" }],
    coach: {
      keyWords: [{ text: "0° ≤ x ≤ 360°", why: "Look for every solution in this range." }, { text: "1 decimal place", why: "Round each answer." }],
      clues: ["Use sin⁻¹ on your calculator for the first solution.", "The sine graph is symmetrical about 90°.", "The second solution is 180° minus the first."],
      traps: ["Have you found two solutions?"],
    },
  },
  {
    id: "ccb3-q18", source: { paper: SRC, q: "18" }, topic: "triple", tier: "H", calculator: true,
    prompt: "Expand and simplify &nbsp;<span class=\"eq\">(2x − 3)(x + 4)(x − 1)</span>",
    marks: 3, answer: "2x³ + 3x² − 17x + 12",
    solution: ["(2x − 3)(x + 4) = 2x² + 5x − 12", "(2x² + 5x − 12)(x − 1) = 2x³ − 2x² + 5x² − 5x − 12x + 12", "= 2x³ + 3x² − 17x + 12"], noWorking: "full",
    showWorking: "Expand two brackets first and write that line down.",
    points: [
      { id: "M1a", code: "M1", criterion: "Expands two of the brackets, e.g. 2x² + 5x − 12 or x² + 3x − 4." },
      { id: "M1b", code: "M1", ft: true, dep: ["M1a"], criterion: "Multiplies by the third bracket, with at least four of the six terms correct." },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "2x³ + 3x² − 17x + 12" },
    ],
    errors: [
      { id: "sign-error", looksLike: "sign errors with the two negative brackets: −3 × −1 = +3" },
      { id: "missed-term", looksLike: "multiplied all three brackets at once and lost terms" },
    ],
    markerNotes: ["Check the constant: −3 × 4 × −1 = +12."],
    dangerZones: [{ id: "third", when: "two brackets have been expanded", warn: "Every term multiplies both terms of the last bracket: six terms." }],
    coach: {
      keyWords: [{ text: "Expand and simplify", why: "Multiply out, then collect like terms." }],
      clues: ["Expand two of the brackets first.", "(2x − 3)(x + 4) = 2x² + 5x − 12.", "Multiply each term by x and by −1, then collect like terms."],
      traps: ["Check the constant term: −3 × 4 × −1."],
    },
  },
  {
    id: "ccb3-q19a", source: { paper: SRC, q: "19", part: "a" }, topic: "quadgraph", tier: "H", calculator: true,
    prompt: "Here is the graph of &nbsp;<span class=\"eq\">y = x<sup>2</sup> − 3x − 1</span><br>Use the graph to find estimates for the solutions of &nbsp;<span class=\"eq\">x<sup>2</sup> − 3x − 1 = 0</span>",
    promptText: "Here is the graph of y = x² − 3x − 1 (x from −1 to 5). Use the graph to find estimates for the solutions of x² − 3x − 1 = 0.",
    diagram: quadGraph, marks: 2, answer: "x = −0.3 and x = 3.3", solution: ["Read where the curve crosses the x-axis", "x ≈ −0.3 and x ≈ 3.3"], noWorking: "full",
    points: [
      { id: "B1a", code: "B1", criterion: "One of −0.3 and 3.3, within ±0.1." },
      { id: "B1b", code: "B1", criterion: "Both −0.3 and 3.3, each within ±0.1." },
    ],
    errors: [{ id: "wrong-share", looksLike: "read where the curve crosses the y-axis, or gave y values" }],
    markerNotes: ["Mike's scheme is B2 (B1 for one correct): award B1a for one, B1a and B1b for both."],
    dangerZones: [{ id: "axis", when: "the student is reading the graph", warn: "= 0 means where the curve crosses the x-axis." }],
    coach: {
      keyWords: [{ text: "Use the graph", why: "Read the values, don't calculate." }, { text: "= 0", why: "Where y = 0: the x-axis." }],
      clues: ["The solutions are where y = 0.", "Find where the curve crosses the x-axis.", "Read both x values to 1 decimal place."],
      traps: ["Have you given two x values?"],
    },
  },
  {
    id: "ccb3-q19b", source: { paper: SRC, q: "19", part: "b" }, topic: "quadgraph", tier: "H", calculator: true,
    prompt: "By drawing a suitable straight line on the grid, find estimates for the solutions of &nbsp;<span class=\"eq\">x<sup>2</sup> − 4x + 1 = 0</span><br><small>Write the equation of your line, sketch it, and give the x values where it crosses the curve.</small>",
    promptText: "The graph of y = x² − 3x − 1 is drawn (x from −1 to 5). By drawing a suitable straight line on the grid, find estimates for the solutions of x² − 4x + 1 = 0.",
    diagram: quadGraph, marks: 3, answer: "x = 0.3 and x = 3.7",
    solution: ["(x² − 3x − 1) − (x² − 4x + 1) = x − 2", "Draw y = x − 2", "Crossings at x ≈ 0.3 and x ≈ 3.7"], noWorking: "full",
    points: [
      { id: "M1a", code: "M1", criterion: "Identifies the line y = x − 2." },
      { id: "M1b", code: "M1", dep: ["M1a"], criterion: "Draws y = x − 2 on the grid (or a sketch of it against the curve).", accept: ["two correct points on y = x − 2 identified, e.g. (0, −2) and (4, 2)"] },
      { id: "A1", code: "A1", dep: ["M1a"], criterion: "0.3 and 3.7, each within ±0.1.", reject: ["y coordinates of the crossing points"] },
    ],
    errors: [
      { id: "wrong-formula", looksLike: "solved with the quadratic formula: the question says 'by drawing a suitable straight line'" },
      { id: "sign-error", looksLike: "found the wrong line by subtracting the wrong way round" },
      { id: "wrong-share", looksLike: "gave the y-coordinates of the crossing points" },
    ],
    markerNotes: ["The student can't draw on the printed grid. Accept the line's equation with a sketch or two points on it for M1b."],
    dangerZones: [{ id: "line", when: "the student is finding the line", warn: "Subtract the new equation from the graph's equation." }],
    coach: {
      keyWords: [{ text: "By drawing a suitable straight line", why: "The method is set: find a line, then read the crossings." }],
      clues: ["You want y = x² − 3x − 1 to equal something that turns the equation into x² − 4x + 1 = 0.", "(x² − 3x − 1) − (x² − 4x + 1) gives the line.", "Draw that line and read the x values where it crosses the curve."],
      traps: ["Did you give x values, not y values?"],
    },
  },
  {
    id: "ccb3-q20", source: { paper: SRC, q: "20" }, topic: "aproof", tier: "H", calculator: true,
    prompt: "n is a positive integer.<br>Prove algebraically that &nbsp;<span class=\"eq\">(3n + 1)<sup>2</sup> − (3n − 1)<sup>2</sup></span>&nbsp; is always a multiple of 12",
    promptText: "n is a positive integer. Prove algebraically that (3n + 1)² − (3n − 1)² is always a multiple of 12.",
    marks: 3, answer: "Proof: the expression simplifies to 12n",
    solution: ["(3n + 1)² = 9n² + 6n + 1", "(3n − 1)² = 9n² − 6n + 1", "Difference = 12n", "12n = 12 × n, a multiple of 12 for every integer n"], noWorking: "zero",
    points: [
      { id: "M1a", code: "M1", criterion: "Expands both brackets: 9n² + 6n + 1 and 9n² − 6n + 1" },
      { id: "M1b", code: "M1", ft: true, dep: ["M1a"], criterion: "Subtracts to get 12n" },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "States that 12n is a multiple of 12 for every integer n.", reject: ["stopping at 12n with no concluding sentence"] },
    ],
    errors: [
      { id: "sign-error", looksLike: "lost the sign on the second bracket: −(9n² − 6n + 1) = −9n² + 6n − 1" },
      { id: "stopped-early", looksLike: "reached 12n and stopped, with no concluding sentence" },
      { id: "wrong-form", looksLike: "substituted numbers for n, which isn't a proof" },
    ],
    dangerZones: [
      { id: "minus", when: "the student is subtracting the second expansion", warn: "The minus applies to every term in the second bracket." },
      { id: "conclude", when: "12n has been reached", warn: "Finish with a sentence that says why it's a multiple of 12." },
    ],
    coach: {
      keyWords: [{ text: "Prove algebraically", why: "Use n, not numbers. Examples don't prove it." }, { text: "multiple of 12", why: "Show it can be written as 12 × something." }],
      clues: ["Expand (3n + 1)² and (3n − 1)² fully.", "Subtract: put the second expansion in brackets first.", "Write the result as 12 × (something) and say why that's a multiple of 12."],
      traps: ["Did you write a concluding sentence?"],
    },
  },
  {
    id: "ccb3-q21", source: { paper: SRC, q: "21" }, topic: "cond", tier: "H", calculator: true,
    prompt: "Bag A contains 4 red counters and 6 blue counters.<br>Bag B contains 5 red counters and 3 blue counters.<br>A counter is taken at random from bag A and put into bag B.<br>A counter is then taken at random from bag B.<br>Work out the probability that the counter taken from bag B is red.",
    marks: 4, answer: "3/5", solution: ["Red moved: 4/10 × 6/9 = 24/90", "Blue moved: 6/10 × 5/9 = 30/90", "24/90 + 30/90 = 54/90 = 3/5"], noWorking: "full",
    showWorking: "Write each route as a product before adding.",
    points: [
      { id: "M1a", code: "M1", criterion: "Red moved, then red taken: 4/10 × 6/9" },
      { id: "M1b", code: "M1", criterion: "Blue moved, then red taken: 6/10 × 5/9" },
      { id: "M1c", code: "M1", ft: true, dep: ["M1a", "M1b"], criterion: "Adds the two products: 24/90 + 30/90" },
      { id: "A1", code: "A1", dep: ["M1c"], criterion: "3/5 oe", accept: ["0.6", "54/90"] },
    ],
    errors: [
      { id: "replacement", looksLike: "kept 8 counters in bag B: after the move there are 9" },
      { id: "stopped-early", looksLike: "worked out only one of the two routes" },
    ],
    markerNotes: ["The number of red counters in bag B depends on which colour was moved."],
    dangerZones: [
      { id: "nine", when: "the student is writing probabilities for bag B", warn: "How many counters are in bag B after the move?" },
      { id: "routes", when: "one route has been worked out", warn: "What if the other colour was moved?" },
    ],
    coach: {
      keyWords: [{ text: "put into bag B", why: "Bag B now has 9 counters, and its reds depend on what was moved." }],
      clues: ["There are two routes: a red is moved, or a blue is moved.", "If red is moved, bag B has 6 red out of 9. If blue, 5 red out of 9.", "Multiply along each route, then add."],
      traps: ["Are your bag B denominators 9?", "Did you add both routes?"],
    },
  },
  {
    id: "ccb3-q22", source: { paper: SRC, q: "22" }, topic: "volcone", tier: "H", calculator: true,
    prompt: "A frustum is made by removing a small cone from the top of a large cone.<br>The large cone has base radius 9 cm and height 24 cm.<br>The small cone has base radius 3 cm and height 8 cm.<br>Work out the volume of the frustum.<br>Give your answer correct to 3 significant figures.",
    diagram: frustum, marks: 5, answer: "1960 cm³",
    solution: ["Large cone: ⅓ × π × 9² × 24 = 648π", "Small cone: ⅓ × π × 3² × 8 = 24π", "Frustum = 624π = 1960.3…", "= 1960 cm³"], noWorking: "full",
    showWorking: "Write each cone's volume as a separate line.",
    points: [
      { id: "M1a", code: "M1", criterion: "Large cone: ⅓ × π × 9² × 24 (= 648π)" },
      { id: "M1b", code: "M1", criterion: "Small cone: ⅓ × π × 3² × 8 (= 24π)" },
      { id: "M1c", code: "M1", ft: true, dep: ["M1a", "M1b"], criterion: "Subtracts: 624π" },
      { id: "A1a", code: "A1", dep: ["M1c"], criterion: "1960.3…" },
      { id: "A1b", code: "A1", dep: ["M1c"], criterion: "1960, correctly rounded to 3 significant figures." },
    ],
    errors: [
      { id: "wrong-formula", looksLike: "used a height of 16 cm with one of the radii, as if the frustum were a cone or cylinder" },
      { id: "half", looksLike: "forgot the ⅓ in one of the two volumes" },
    ],
    dangerZones: [{ id: "method", when: "the student is starting", warn: "Large cone minus small cone is the reliable method." }],
    coach: {
      keyWords: [{ text: "removing a small cone", why: "Frustum = large cone − small cone." }, { text: "3 significant figures", why: "Round at the end." }],
      clues: ["Volume of a cone = ⅓πr²h.", "Work out the large cone and the small cone separately.", "Subtract, then round."],
      traps: ["Did you use ⅓ in both volumes?"],
    },
  },
];
