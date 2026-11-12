// Cold Case C · Higher Paper 2 (calculator) · all 21 questions, 80 marks (CC-C/2H)
//
// Question wording is copied from the paper. Mark points follow Mike's Cold Case C Paper 2 Forensic
// Mark Scheme line for line; errors and Mike-mode danger zones come from its "Where the marks go
// missing" boxes. B2 marks are split into two B1 points so partial credit still works.
import type { Scheme } from "../schemes.ts";

const fr = (n: string | number, d: string | number) => `<span class="fr"><span>${n}</span><span>${d}</span></span>`;
const SRC = "CC-C/2H";
const TXT = `font-family="Times New Roman,serif" fill="currentColor"`;
const NDA = (x: number, y: number) => `<text x="${x}" y="${y}" font-size="9" text-anchor="middle" fill="currentColor" opacity=".7" font-family="Arial,sans-serif">Not drawn accurately</text>`;

// ---------- diagrams ----------
const pond = `<svg viewBox="0 0 250 200" role="img" aria-label="A circular pond of radius 3.4 m surrounded by a path 0.8 m wide."><circle cx="120" cy="95" r="84" fill="currentColor" fill-opacity=".12" stroke="currentColor" stroke-width="1.5"/><circle cx="120" cy="95" r="68" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M120 95 H188 M188 95 H204" stroke="currentColor" stroke-width="1.2"/><g ${TXT} font-size="12"><text x="154" y="89" text-anchor="middle">3.4 m</text><text x="208" y="70">0.8 m</text><text x="104" y="118" font-style="italic">pond</text></g>${NDA(120, 195)}</svg>`;

const histQueue = (() => {
  const X = (t: number) => 50 + t * 7, Y = (d: number) => 210 - d * 50;
  const minor: string[] = [], major: string[] = [], lab: string[] = [];
  for (let t = 0; t <= 40; t++) (t % 5 ? minor : major).push(`M${X(t)} ${Y(0)}V${Y(3.5)}`);
  for (let k = 0; k <= 35; k++) (k % 5 ? minor : major).push(`M${X(0)} ${Y(k / 10)}H${X(40)}`);
  for (let t = 0; t <= 40; t += 5) lab.push(`<text x="${X(t)}" y="226" text-anchor="middle">${t}</text>`);
  for (let k = 0; k <= 7; k++) lab.push(`<text x="44" y="${Y(k / 2) + 4}" text-anchor="end">${k === 0 ? "0" : (k / 2).toFixed(1)}</text>`);
  const bars = [[0, 5, 1.2], [5, 10, 3.2], [10, 20, 2.1], [20, 40, 0.6]].map(([a, b, d]) => `<rect x="${X(a)}" y="${Y(d)}" width="${X(b) - X(a)}" height="${Y(0) - Y(d)}"/>`).join("");
  return `<svg viewBox="0 0 350 250" role="img" aria-label="Histogram of waiting times. Bars: 0 to 5 minutes, frequency density 1.2; 5 to 10, 3.2; 10 to 20, 2.1; 20 to 40, 0.6."><path d="${minor.join("")}" stroke="currentColor" stroke-width=".35" opacity=".3" fill="none"/><path d="${major.join("")}" stroke="currentColor" stroke-width=".7" opacity=".55" fill="none"/><g fill="currentColor" fill-opacity=".15" stroke="currentColor" stroke-width="1.4">${bars}</g><g font-size="11" ${TXT}>${lab.join("")}<text x="190" y="244" text-anchor="middle">Time (<tspan font-style="italic">t</tspan> minutes)</text><text transform="translate(14 125) rotate(-90)" text-anchor="middle">Frequency density</text></g></svg>`;
})();

const sector135 = `<svg viewBox="0 0 280 170" role="img" aria-label="Sector OPQ of a circle, centre O, radius 8.2 cm. OP is horizontal and angle POQ is 135 degrees."><path d="M120 130 L230 130 A110 110 0 0 0 42.2 52.2 Z" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M138 130 A18 18 0 0 0 107.3 117.3" fill="none" stroke="currentColor" stroke-width="1.2"/><g ${TXT} font-size="13"><text x="116" y="146" font-style="italic">O</text><text x="236" y="136" font-style="italic">P</text><text x="28" y="50" font-style="italic">Q</text><text x="112" y="110">135°</text><text x="175" y="146" text-anchor="middle">8.2 cm</text></g>${NDA(140, 165)}</svg>`;

const vennAB = `<svg viewBox="0 0 300 160" role="img" aria-label="An empty Venn diagram: a rectangle labelled ξ containing two overlapping circles, A on the left and B on the right."><rect x="10" y="10" width="280" height="140" fill="none" stroke="currentColor" stroke-width="1.5"/><g fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="120" cy="82" r="52"/><circle cx="180" cy="82" r="52"/></g><g ${TXT} font-size="15" font-style="italic"><text x="20" y="30">ξ</text><text x="70" y="36">A</text><text x="222" y="36">B</text></g></svg>`;

const cone = `<svg viewBox="0 0 220 190" role="img" aria-label="A solid cone with base radius 5 cm and perpendicular height 12 cm."><g fill="none" stroke="currentColor" stroke-width="1.5"><ellipse cx="110" cy="150" rx="60" ry="12"/><path d="M50 150 L110 20 L170 150"/><path d="M110 20 V150 H170" stroke-dasharray="4 3" stroke-width="1.1"/><path d="M110 140 h10 v10" stroke-width="1"/></g><g ${TXT} font-size="12"><text x="104" y="104" text-anchor="end">12 cm</text><text x="176" y="155">5 cm</text></g>${NDA(110, 184)}</svg>`;

const vecOPQ = `<svg viewBox="0 0 280 175" role="img" aria-label="Triangle OPQ. O bottom left, P bottom right, Q at the top. M is the midpoint of PQ, R is the midpoint of OQ, and N is on OM."><g fill="none" stroke="currentColor" stroke-width="1.5"><path d="M40 150 L240 150 L110 20 Z"/><path d="M40 150 L175 85" stroke-dasharray="4 3" stroke-width="1.1"/></g><g fill="currentColor"><circle cx="175" cy="85" r="2.5"/><circle cx="75" cy="85" r="2.5"/><circle cx="130" cy="106.7" r="2.5"/></g><g ${TXT} font-size="13" font-style="italic"><text x="104" y="14">Q</text><text x="26" y="160">O</text><text x="246" y="160">P</text><text x="182" y="84">M</text><text x="58" y="84">R</text><text x="128" y="124">N</text></g>${NDA(140, 170)}</svg>`;

const triABC = `<svg viewBox="0 0 300 160" role="img" aria-label="Triangle ABC with AC along the bottom, 14.5 cm. AB is 8.6 cm and BC is 11.2 cm. B is at the top."><path d="M20 130 L280 130 L105 26 Z" fill="none" stroke="currentColor" stroke-width="1.6"/><g ${TXT} font-size="12"><text x="100" y="18" font-style="italic">B</text><text x="8" y="134" font-style="italic">A</text><text x="284" y="134" font-style="italic">C</text><text x="56" y="72" text-anchor="end">8.6 cm</text><text x="200" y="72">11.2 cm</text><text x="150" y="146" text-anchor="middle">14.5 cm</text></g>${NDA(150, 158)}</svg>`;

const Q7 = "The histogram shows information about the times, t minutes, that some customers waited in a queue.";
const Q7_T = "Histogram of waiting times: 0 < t ≤ 5 frequency density 1.2; 5 < t ≤ 10, 3.2; 10 < t ≤ 20, 2.1; 20 < t ≤ 40, 0.6.";
const V11 = "ξ = {integers from 1 to 12}, A = {multiples of 3}, B = {even numbers}.";
const ACC = "The acceleration, a m/s², of a car is given by a = (v − u)/t, where v = 24.6, u = 12.2 and t = 4.7, each correct to 1 decimal place.";
const F17 = "The function f is such that f(x) = (2x + 3)/(x − 1).";

export const COLD_CASE_C2: Scheme[] = [
  {
    id: "ccc2-q1a", source: { paper: SRC, q: "1", part: "a" }, topic: "round", tier: "H", calculator: true,
    prompt: `Use your calculator to work out &nbsp;<span class="eq">${fr("5.2<sup>3</sup> − √71", "0.48 × 6.5")}</span><br>Write down all the figures on your calculator display.`,
    promptText: "Use your calculator to work out (5.2³ − √71) / (0.48 × 6.5). Write down all the figures on your calculator display.",
    marks: 2, answer: "42.36597764", solution: ["5.2³ − √71 = 132.18…", "0.48 × 6.5 = 3.12", "132.18… ÷ 3.12 = 42.36597764"], noWorking: "full",
    showWorking: "Write the top and the bottom as separate values before dividing.",
    points: [
      { id: "M1", code: "M1", criterion: "132.18… (the numerator) or 3.12 (the denominator) seen." },
      { id: "A1", code: "A1", dep: ["M1"], criterion: "42.36597… (at least five figures).", reject: ["42.37 (rounded)"] },
    ],
    errors: [
      { id: "order-error", looksLike: "typed it in one line without brackets, so only √71 was divided, or the answer was multiplied by 6.5" },
      { id: "rounding", looksLike: "rounded in part (a), where the question asks for all the figures" },
    ],
    dangerZones: [{ id: "brackets", when: "the student is about to divide", warn: "Use the fraction button, or brackets round the top and the bottom." }],
    coach: {
      keyWords: [{ text: "all the figures", why: "Don't round. Copy every digit." }],
      clues: ["Work out the top and the bottom separately.", "Top: 5.2³ − √71. Bottom: 0.48 × 6.5.", "Divide, using the fraction button."],
      traps: ["Have you written every figure?"],
    },
  },
  {
    id: "ccc2-q1b", source: { paper: SRC, q: "1", part: "b" }, topic: "round", tier: "H", calculator: true,
    prompt: "Write your answer to part (a) correct to 2 decimal places.",
    promptText: "Write your answer to part (a) (42.36597764 if correct) correct to 2 decimal places.",
    marks: 1, answer: "42.37", solution: ["42.365… → 42.37"], noWorking: "full",
    points: [{ id: "B1", code: "B1", ft: true, criterion: "42.37 (ft their answer to (a)).", reject: ["42.36"] }],
    errors: [{ id: "rounding", looksLike: "truncated instead of rounding" }],
    dangerZones: [{ id: "round", when: "the student is rounding", warn: "Look at the third decimal place." }],
    coach: {
      keyWords: [{ text: "2 decimal places", why: "Two digits after the point." }],
      clues: ["Keep two digits after the point.", "Look at the third decimal digit.", "5 or more rounds up."],
      traps: ["Did you round, not cut off?"],
    },
  },
  {
    id: "ccc2-q2", source: { paper: SRC, q: "2" }, topic: "pct", tier: "H", calculator: true,
    prompt: "A house is bought for £184 000<br>It is later sold for £209 760<br>Work out the percentage profit.",
    marks: 3, answer: "14%", solution: ["Profit = 209 760 − 184 000 = 25 760", "25 760 ÷ 184 000 × 100", "= 14%"], noWorking: "full",
    showWorking: "Write the profit, then the fraction over the buying price.",
    points: [
      { id: "M1a", code: "M1", criterion: "Profit = 209 760 − 184 000 = 25 760", accept: ["209 760 ÷ 184 000 = 1.14"] },
      { id: "M1b", code: "M1", ft: true, criterion: "25 760 ÷ 184 000 (× 100)" },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "14", reject: ["12.3 (divided by the selling price)", "114"] },
    ],
    errors: [
      { id: "reverse-pct", looksLike: "divided by the selling price, giving 12.3%: percentage profit is always of the original price" },
      { id: "stopped-early", looksLike: "gave 114%, the selling price as a percentage of the cost" },
    ],
    dangerZones: [{ id: "base", when: "the profit has been found", warn: "Percentage of which price?" }],
    coach: {
      keyWords: [{ text: "percentage profit", why: "Profit as a percentage of the buying price." }],
      clues: ["Profit = selling price − buying price.", "Divide the profit by the buying price.", "Multiply by 100."],
      traps: ["Did you divide by £184 000?"],
    },
  },
  {
    id: "ccc2-q3a", source: { paper: SRC, q: "3", part: "a" }, topic: "linineq", tier: "H", calculator: true,
    prompt: "Solve &nbsp;<span class=\"eq\">−7 &lt; 3x + 2 ≤ 11</span>", promptText: "Solve −7 < 3x + 2 ≤ 11.",
    marks: 2, answer: "−3 < x ≤ 3", solution: ["−9 < 3x ≤ 9", "−3 < x ≤ 3"], noWorking: "full",
    points: [
      { id: "M1", code: "M1", criterion: "Subtracts 2 from all three parts: −9 < 3x ≤ 9" },
      { id: "A1", code: "A1", dep: ["M1"], criterion: "−3 < x ≤ 3", reject: ["inequality signs changed into equals signs"] },
    ],
    errors: [
      { id: "missed-term", looksLike: "subtracted 2 from only one side" },
      { id: "wrong-form", looksLike: "changed the inequality signs into equals signs" },
    ],
    dangerZones: [{ id: "all3", when: "the student is subtracting 2", warn: "Do the same to all three parts." }],
    coach: {
      keyWords: [{ text: "Solve", why: "Get x on its own in the middle." }],
      clues: ["Subtract 2 from all three parts.", "Then divide all three parts by 3.", "Keep the same inequality signs."],
      traps: ["Are the signs the same as in the question?"],
    },
  },
  {
    id: "ccc2-q3b", source: { paper: SRC, q: "3", part: "b" }, topic: "linineq", tier: "H", calculator: true,
    prompt: "x is an integer. Write down all the possible values of x.",
    promptText: "−7 < 3x + 2 ≤ 11, which gives −3 < x ≤ 3. x is an integer. Write down all the possible values of x.",
    marks: 1, answer: "−2, −1, 0, 1, 2, 3", solution: ["Integers with −3 < x ≤ 3"], noWorking: "full",
    points: [{ id: "B1", code: "B1", ft: true, criterion: "−2, −1, 0, 1, 2, 3 (ft their inequality).", reject: ["including −3", "leaving out 0 or 3"] }],
    errors: [{ id: "inequality-region", looksLike: "included −3 (the sign is <, so −3 isn't allowed) or left out 0" }],
    dangerZones: [{ id: "ends", when: "the student is listing integers", warn: "Check each end: is it < or ≤?" }],
    coach: {
      keyWords: [{ text: "integer", why: "Whole numbers, including 0 and negatives." }],
      clues: ["Use your answer to (a).", "< means the end isn't included; ≤ means it is.", "List every whole number in between, including 0."],
      traps: ["Did you check both ends?"],
    },
  },
  {
    id: "ccc2-q4", source: { paper: SRC, q: "4" }, topic: "circ", tier: "H", calculator: true,
    prompt: "A circular pond has a radius of 3.4 m.<br>The pond is surrounded by a path that is 0.8 m wide.<br>Work out the area of the path. Give your answer correct to 3 significant figures.",
    diagram: pond, marks: 3, answer: "19.1 m²", solution: ["Outer radius = 3.4 + 0.8 = 4.2", "π × 4.2² − π × 3.4² = 19.10…", "= 19.1 m²"], noWorking: "full",
    showWorking: "Write the outer radius and both circle areas.",
    points: [
      { id: "M1a", code: "M1", criterion: "Radius of the outer circle = 3.4 + 0.8 = 4.2", reject: ["5.0 (0.8 added twice)"] },
      { id: "M1b", code: "M1", ft: true, criterion: "π × 4.2² − π × 3.4²" },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "19.1 (from 19.10…)", reject: ["2.01 (π × 0.8²)"] },
    ],
    errors: [
      { id: "wrong-formula", looksLike: "worked out π × 0.8² = 2.01: the path is a ring, so big circle minus small circle" },
      { id: "radius-diameter", looksLike: "added 0.8 twice to the radius: the width is added twice to the diameter but once to the radius" },
    ],
    dangerZones: [{ id: "ring", when: "the student is starting", warn: "The path is a ring: big circle minus small circle." }],
    coach: {
      keyWords: [{ text: "area of the path", why: "Just the ring round the pond." }, { text: "3 significant figures", why: "Round at the end." }],
      clues: ["The outer circle's radius is the pond's radius plus the path width.", "Work out both circle areas.", "Subtract the pond from the big circle."],
      traps: ["Did you add 0.8 only once to the radius?"],
    },
  },
  {
    id: "ccc2-q5", source: { paper: SRC, q: "5" }, topic: "sdp", tier: "H", calculator: true,
    prompt: "A gold bar is in the shape of a cuboid measuring 12 cm by 5 cm by 2.5 cm.<br>The density of gold is 19.3 g/cm<sup>3</sup><br>Work out the mass of the gold bar. Give your answer in kilograms.",
    marks: 3, answer: "2.895 kg", solution: ["Volume = 12 × 5 × 2.5 = 150 cm³", "Mass = 150 × 19.3 = 2895 g", "= 2.895 kg"], noWorking: "full",
    points: [
      { id: "M1a", code: "M1", criterion: "Volume = 12 × 5 × 2.5 = 150" },
      { id: "M1b", code: "M1", ft: true, dep: ["M1a"], criterion: "150 × 19.3 = 2895", reject: ["150 ÷ 19.3"] },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "2.895", accept: ["2.9"], reject: ["2895 (grams)"] },
    ],
    errors: [
      { id: "wrong-operation", looksLike: "divided the volume by the density: mass = density × volume" },
      { id: "wrong-form", looksLike: "left the answer as 2895, which is in grams" },
    ],
    dangerZones: [{ id: "kg", when: "2895 has been found", warn: "Check the units the question asks for." }],
    coach: {
      keyWords: [{ text: "in kilograms", why: "Density gives grams. Convert at the end." }],
      clues: ["Find the volume of the cuboid.", "Mass = density × volume.", "1000 g = 1 kg."],
      traps: ["Is your answer in kilograms?"],
    },
  },
  {
    id: "ccc2-q6a", source: { paper: SRC, q: "6", part: "a" }, topic: "brackets", tier: "H", calculator: true,
    prompt: "Expand and simplify &nbsp;<span class=\"eq\">(2x − 5)<sup>2</sup></span>", promptText: "Expand and simplify (2x − 5)².",
    marks: 2, answer: "4x² − 20x + 25", solution: ["(2x − 5)(2x − 5)", "= 4x² − 10x − 10x + 25", "= 4x² − 20x + 25"], noWorking: "full",
    points: [
      { id: "M1", code: "M1", criterion: "(2x − 5)(2x − 5) with at least three of the four terms correct." },
      { id: "A1", code: "A1", dep: ["M1"], criterion: "4x² − 20x + 25", reject: ["4x² − 25", "4x² + 25"] },
    ],
    errors: [{ id: "missed-term", looksLike: "wrote 4x² − 25 or 4x² + 25: squaring a bracket always gives a middle term" }],
    dangerZones: [{ id: "square", when: "the student is squaring the bracket", warn: "Write it as two brackets multiplied." }],
    coach: {
      keyWords: [{ text: "(2x − 5)2", why: "Means (2x − 5)(2x − 5)." }],
      clues: ["Write it as (2x − 5)(2x − 5).", "Multiply every term by every term: four terms.", "Collect the two x terms."],
      traps: ["Is there a middle term?"],
    },
  },
  {
    id: "ccc2-q6b", source: { paper: SRC, q: "6", part: "b" }, topic: "rearr", tier: "H", calculator: true,
    prompt: "Make x the subject of the formula &nbsp;<span class=\"eq\">y = 3x<sup>2</sup> − 5</span>", promptText: "Make x the subject of the formula y = 3x² − 5.",
    marks: 2, answer: "x = ±√((y + 5)/3)", solution: ["y + 5 = 3x²", "x² = (y + 5)/3", "x = ±√((y + 5)/3)"], noWorking: "full",
    points: [
      { id: "M1", code: "M1", criterion: "y + 5 = 3x²" },
      { id: "A1", code: "A1", dep: ["M1"], criterion: "x = ±√((y + 5)/3) (condone a missing ±).", reject: ["root over the numerator only"] },
    ],
    errors: [{ id: "order-error", looksLike: "square-rooted before dividing by 3, or drew the root over the top of the fraction only" }],
    dangerZones: [{ id: "order", when: "the student has y + 5 = 3x²", warn: "Divide by 3 before you square root." }],
    coach: {
      keyWords: [{ text: "Make x the subject", why: "x on its own: undo each step in reverse order." }],
      clues: ["Add 5 to both sides.", "Divide both sides by 3.", "Square root both sides: the root covers the whole fraction."],
      traps: ["Does your square root cover the whole fraction?"],
    },
  },
  {
    id: "ccc2-q7a", source: { paper: SRC, q: "7", part: "a" }, topic: "hist", tier: "H", calculator: true,
    prompt: `${Q7}<br>Work out the number of customers who waited between 5 and 10 minutes.`, promptText: `${Q7_T} Work out the number of customers who waited between 5 and 10 minutes.`,
    diagram: histQueue, marks: 1, answer: "16 customers", solution: ["3.2 × 5 = 16"], noWorking: "full",
    points: [{ id: "B1", code: "B1", criterion: "16 (3.2 × 5).", reject: ["3.2 (the bar height)"] }],
    errors: [{ id: "wrong-operation", looksLike: "read the height of the bar as the frequency: in a histogram the frequency is the area" }],
    dangerZones: [{ id: "area", when: "the student is reading the bar", warn: "Frequency is the area: height × width." }],
    coach: {
      keyWords: [{ text: "histogram", why: "Frequency = frequency density × class width." }],
      clues: ["Find the bar for 5 to 10 minutes.", "Read its height (frequency density).", "Multiply by the class width, 5."],
      traps: ["Did you multiply by the width?"],
    },
  },
  {
    id: "ccc2-q7b", source: { paper: SRC, q: "7", part: "b" }, topic: "hist", tier: "H", calculator: true,
    prompt: "Work out the total number of customers.", promptText: `${Q7_T} Work out the total number of customers.`,
    diagram: histQueue, marks: 2, answer: "55 customers", solution: ["1.2 × 5 = 6", "2.1 × 10 = 21", "0.6 × 20 = 12", "6 + 16 + 21 + 12 = 55"], noWorking: "full",
    points: [
      { id: "M1", code: "M1", criterion: "At least two other frequencies from frequency density × class width: 6, 21, 12." },
      { id: "A1", code: "A1", dep: ["M1"], criterion: "55" },
    ],
    errors: [{ id: "wrong-operation", looksLike: "added the bar heights instead of the areas" }],
    dangerZones: [{ id: "widths", when: "the student is working out frequencies", warn: "The class widths aren't all the same." }],
    coach: {
      keyWords: [{ text: "total number", why: "Add the frequency of every bar." }],
      clues: ["Find the frequency of every bar: height × width.", "Widths are 5, 5, 10 and 20.", "Add all four frequencies."],
      traps: ["Did you use each bar's own width?"],
    },
  },
  {
    id: "ccc2-q7c", source: { paper: SRC, q: "7", part: "c" }, topic: "hist", tier: "H", calculator: true,
    prompt: "Work out an estimate for the number of customers who waited more than 30 minutes.", promptText: `${Q7_T} Work out an estimate for the number of customers who waited more than 30 minutes.`,
    diagram: histQueue, marks: 1, answer: "6 customers", solution: ["0.6 × 10 = 6 (half of the 20 to 40 class)"], noWorking: "full",
    points: [{ id: "B1", code: "B1", criterion: "6 (half of the 20 to 40 class).", reject: ["12 (the whole bar)"] }],
    errors: [{ id: "stopped-early", looksLike: "gave 12, the whole of the last bar: only half of it is above 30 minutes" }],
    dangerZones: [{ id: "half", when: "the student is using the last bar", warn: "Only part of that bar is above 30." }],
    coach: {
      keyWords: [{ text: "more than 30 minutes", why: "Only part of the last bar." }],
      clues: ["Which bar contains 30 minutes?", "From 30 to 40 is a width of 10.", "Frequency = height × 10."],
      traps: ["Did you use only the part above 30?"],
    },
  },
  {
    id: "ccc2-q8", source: { paper: SRC, q: "8" }, topic: "simlin", tier: "H", calculator: true,
    prompt: "5 pens and 3 rulers cost a total of £6.35<br>2 pens and 7 rulers cost a total of £6.60<br>Work out the cost of one pen and the cost of one ruler.<br><small>Give both answers in pence.</small>",
    promptText: "5 pens and 3 rulers cost a total of £6.35. 2 pens and 7 rulers cost a total of £6.60. Work out the cost of one pen and the cost of one ruler. The answer lines are in pence (Pen ...p, Ruler ...p).",
    marks: 4, answer: "Pen 85p, ruler 70p", solution: ["5p + 3r = 635, 2p + 7r = 660", "10p + 6r = 1270 and 10p + 35r = 3300", "29r = 2030, so r = 70", "5p + 210 = 635, so p = 85"], noWorking: "full",
    showWorking: "Write both equations and the elimination step.",
    points: [
      { id: "M1a", code: "M1", criterion: "Forms two equations: 5p + 3r = 635 and 2p + 7r = 660 (or in pounds)." },
      { id: "M1b", code: "M1", ft: true, dep: ["M1a"], criterion: "Makes the coefficients of one letter equal and eliminates, e.g. 29r = 2030." },
      { id: "A1a", code: "A1", dep: ["M1b"], criterion: "One correct value." },
      { id: "A1b", code: "A1", dep: ["M1b"], criterion: "Pen 85p and ruler 70p.", reject: ["0.85 and 0.70 on a pence answer line"] },
    ],
    errors: [
      { id: "wrong-form", looksLike: "mixed pounds and pence: the answer line is in pence, so 0.85 scores no accuracy mark" },
      { id: "added-squares", looksLike: "added the equations when they needed subtracting" },
    ],
    markerNotes: ["Check by putting both values into the equation not used last."],
    dangerZones: [
      { id: "units", when: "the student is writing the equations", warn: "Pounds or pence? Pick one and stick to it." },
      { id: "signs", when: "coefficients have been matched", warn: "Same signs: subtract." },
    ],
    coach: {
      keyWords: [{ text: "cost of one pen and the cost of one ruler", why: "Two unknowns: you need two values." }],
      clues: ["Write two equations with p for a pen and r for a ruler, in pence.", "Multiply them so one letter has the same coefficient, then subtract.", "Solve for that letter, then substitute back."],
      traps: ["Are your answers in pence?", "Do both values work in both equations?"],
    },
  },
  {
    id: "ccc2-q9a", source: { paper: SRC, q: "9", part: "a" }, topic: "arcs", tier: "H", calculator: true,
    prompt: "OPQ is a sector of a circle, centre O.<br>The radius of the circle is 8.2 cm. Angle POQ = 135°<br>Work out the area of the sector. Give your answer correct to 3 significant figures.",
    diagram: sector135, marks: 2, answer: "79.2 cm²", solution: ["135/360 × π × 8.2² = 79.21…"], noWorking: "full",
    points: [
      { id: "M1", code: "M1", criterion: "135/360 × π × 8.2²", reject: ["135/180"] },
      { id: "A1", code: "A1", dep: ["M1"], criterion: "79.2" },
    ],
    errors: [{ id: "wrong-formula", looksLike: "used the arc formula for the area, or 135/180" }],
    dangerZones: [{ id: "frac", when: "the student is writing the fraction of the circle", warn: "A full turn is 360°." }],
    coach: {
      keyWords: [{ text: "area of the sector", why: "A fraction of the circle's area." }],
      clues: ["The sector is 135/360 of the circle.", "Circle area = πr².", "Multiply them."],
      traps: ["Did you use 360, not 180?"],
    },
  },
  {
    id: "ccc2-q9b", source: { paper: SRC, q: "9", part: "b" }, topic: "arcs", tier: "H", calculator: true,
    prompt: "Work out the length of the arc PQ. Give your answer correct to 3 significant figures.",
    promptText: "OPQ is a sector of a circle, centre O, radius 8.2 cm, angle POQ = 135°. Work out the length of the arc PQ, correct to 3 significant figures.",
    diagram: sector135, marks: 2, answer: "19.3 cm", solution: ["135/360 × 2 × π × 8.2 = 19.32…"], noWorking: "full",
    points: [
      { id: "M1", code: "M1", criterion: "135/360 × 2 × π × 8.2" },
      { id: "A1", code: "A1", dep: ["M1"], criterion: "19.3", reject: ["35.7 (perimeter)"] },
    ],
    errors: [
      { id: "wrong-formula", looksLike: "swapped the formulas, using the area formula for the arc" },
      { id: "wrong-share", looksLike: "added the two radii to give the perimeter, 35.7 cm: the question asks for the arc only" },
    ],
    dangerZones: [{ id: "arc", when: "the arc length has been found", warn: "Arc only, or perimeter?" }],
    coach: {
      keyWords: [{ text: "length of the arc", why: "Just the curved edge." }],
      clues: ["The arc is 135/360 of the circumference.", "Circumference = 2πr.", "Multiply them."],
      traps: ["Did you leave the radii out?"],
    },
  },
  {
    id: "ccc2-q10", source: { paper: SRC, q: "10" }, topic: "ratio", tier: "H", calculator: true,
    prompt: "There are only red counters and blue counters in a bag.<br>The ratio of the number of red counters to the number of blue counters is 5 : 3<br>12 red counters are taken out of the bag.<br>There are now equal numbers of red counters and blue counters in the bag.<br>Work out the total number of counters that were in the bag at the start.",
    marks: 3, answer: "48 counters", solution: ["Red = 5k, blue = 3k", "5k − 12 = 3k, so k = 6", "8 × 6 = 48"], noWorking: "full",
    points: [
      { id: "M1a", code: "M1", criterion: "Red = 5k and blue = 3k, with 5k − 12 = 3k (or 2 parts = 12)." },
      { id: "M1b", code: "M1", dep: ["M1a"], criterion: "k = 6" },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "8 × 6 = 48", reject: ["30 (red)", "36 (after removing 12)"] },
    ],
    errors: [
      { id: "wrong-share", looksLike: "gave 30, the red counters, or 36, the total after the 12 were removed" },
      { id: "parts-count", looksLike: "shared 12 in the ratio 5 : 3" },
    ],
    dangerZones: [{ id: "parts", when: "the student starts", warn: "The 12 removed is the difference between red and blue." }],
    coach: {
      keyWords: [{ text: "equal numbers", why: "Taking 12 red away closes the gap between 5 parts and 3 parts." }, { text: "at the start", why: "Before the 12 were removed." }],
      clues: ["Red has 2 more parts than blue.", "Those 2 parts are the 12 counters removed.", "Find one part, then the total of 8 parts."],
      traps: ["Is your answer the total at the start?"],
    },
  },
  {
    id: "ccc2-q11a", source: { paper: SRC, q: "11", part: "a" }, topic: "venn", tier: "H", calculator: true,
    prompt: "ξ = {integers from 1 to 12}<br>A = {multiples of 3}<br>B = {even numbers}<br>Complete the Venn diagram for this information.<br><small>Write the numbers in each region in your working, or redraw the diagram.</small>",
    promptText: `${V11} Complete the Venn diagram (circles A and B inside ξ).`,
    diagram: vennAB, marks: 2, answer: "A and B: 6, 12; A only: 3, 9; B only: 2, 4, 8, 10; outside: 1, 5, 7, 11",
    solution: ["A ∩ B: 6, 12", "A only: 3, 9", "B only: 2, 4, 8, 10", "Outside both: 1, 5, 7, 11"], noWorking: "full",
    points: [
      { id: "B1a", code: "B1", criterion: "Two or three of the four regions correct (intersection 6, 12; A only 3, 9; B only 2, 4, 8, 10; outside 1, 5, 7, 11)." },
      { id: "B1b", code: "B1", criterion: "All four regions correct." },
    ],
    errors: [
      { id: "stopped-early", looksLike: "left out 1, 5, 7 and 11: every member of ξ must appear, including outside the circles" },
      { id: "wrong-share", looksLike: "wrote 6 and 12 in both circles as well as in the overlap" },
    ],
    markerNotes: ["The student can't write on the printed diagram. Accept a redrawn diagram or the regions listed. Mike's B2 (B1 for two or three regions) is split into B1a and B1b."],
    dangerZones: [{ id: "outside", when: "the circles have been filled", warn: "Is every number from 1 to 12 somewhere?" }],
    coach: {
      keyWords: [{ text: "integers from 1 to 12", why: "All 12 numbers must appear somewhere." }],
      clues: ["List the multiples of 3 and the even numbers up to 12.", "Numbers in both lists go in the overlap.", "Numbers in neither go outside the circles."],
      traps: ["Have you placed all 12 numbers, each once?"],
    },
  },
  {
    id: "ccc2-q11b", source: { paper: SRC, q: "11", part: "b" }, topic: "venn", tier: "H", calculator: true,
    prompt: "A number is chosen at random from ξ.<br>Find the probability that the number is in A ∪ B.",
    promptText: `${V11} A number is chosen at random from ξ. Find the probability that the number is in A ∪ B.`,
    diagram: vennAB, marks: 1, answer: "8/12", solution: ["A ∪ B = {2, 3, 4, 6, 8, 9, 10, 12}", "8/12"], noWorking: "full",
    points: [{ id: "B1", code: "B1", criterion: "8/12 oe", accept: ["2/3", "0.666…"] }],
    errors: [{ id: "and-or", looksLike: "found A ∩ B (2/12) instead of A ∪ B" }],
    dangerZones: [{ id: "union", when: "the student is counting", warn: "∪ means in A or B or both." }],
    coach: {
      keyWords: [{ text: "A ∪ B", why: "Union: in A, or B, or both." }],
      clues: ["∪ means 'or'.", "Count every number inside either circle.", "Divide by 12."],
      traps: ["Did you count the overlap only once?"],
    },
  },
  {
    id: "ccc2-q11c", source: { paper: SRC, q: "11", part: "c" }, topic: "venn", tier: "H", calculator: true,
    prompt: "Given that the number is in B, find the probability that it is also in A.",
    promptText: `${V11} A number is chosen at random from ξ. Given that the number is in B, find the probability that it is also in A.`,
    diagram: vennAB, marks: 1, answer: "2/6", solution: ["B has 6 numbers; 2 of them (6, 12) are also in A", "2/6"], noWorking: "full",
    points: [{ id: "B1", code: "B1", criterion: "2/6 oe", accept: ["1/3", "0.333…"], reject: ["2/12"] }],
    errors: [{ id: "wrong-denominator", looksLike: "gave 2/12: 'given that it is in B' means the total is the 6 numbers in B" }],
    dangerZones: [{ id: "given", when: "the student is choosing a denominator", warn: "Given it's in B: how many numbers are you choosing from?" }],
    coach: {
      keyWords: [{ text: "Given that the number is in B", why: "Only the numbers in B count now." }],
      clues: ["The number is one of those in B.", "How many numbers are in B?", "How many of those are also in A?"],
      traps: ["Is your denominator the number of elements in B?"],
    },
  },
  {
    id: "ccc2-q12", source: { paper: SRC, q: "12" }, topic: "qform", tier: "H", calculator: true,
    prompt: "Solve &nbsp;<span class=\"eq\">2x<sup>2</sup> + 5x − 4 = 0</span><br>Give your solutions correct to 3 significant figures.",
    promptText: "Solve 2x² + 5x − 4 = 0. Give your solutions correct to 3 significant figures.",
    marks: 3, answer: "x = 0.637 and x = −3.14", solution: ["x = (−5 ± √(5² − 4 × 2 × (−4))) / (2 × 2)", "√57 = 7.549…", "x = 0.637 or x = −3.14"], noWorking: "full",
    showWorking: "Write the formula with the numbers in.",
    points: [
      { id: "M1a", code: "M1", criterion: "x = (−5 ± √(5² − 4 × 2 × (−4))) / (2 × 2)", reject: ["√(25 − 32)"] },
      { id: "M1b", code: "M1", dep: ["M1a"], criterion: "√57 or 7.549…" },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "0.637 and −3.14", reject: ["0.64 (2 d.p., not 3 s.f.)"] },
    ],
    errors: [
      { id: "sign-error", looksLike: "worked out 25 − 32 under the root: −4 × 2 × (−4) = +32" },
      { id: "qformula-division", looksLike: "divided only the square root by 4" },
      { id: "rounding", looksLike: "gave 2 decimal places when 3 significant figures were asked for" },
    ],
    dangerZones: [{ id: "disc", when: "the student is working out b² − 4ac", warn: "Minus times minus. Check the sign of 4ac." }],
    coach: {
      keyWords: [{ text: "3 significant figures", why: "It won't factorise: use the formula." }],
      clues: ["a = 2, b = 5, c = −4.", "b² − 4ac = 25 + 32.", "The fraction line goes under the whole top."],
      traps: ["Are both answers to 3 significant figures?"],
    },
  },
  {
    id: "ccc2-q13a", source: { paper: SRC, q: "13", part: "a" }, topic: "bounds", tier: "H", calculator: true,
    prompt: `The acceleration, a m/s<sup>2</sup>, of a car is given by the formula &nbsp;<span class="eq">a = ${fr("v − u", "t")}</span><br>v = 24.6 correct to 1 decimal place<br>u = 12.2 correct to 1 decimal place<br>t = 4.7 correct to 1 decimal place<br>Work out the upper bound for the value of a.<br>Give your answer correct to 4 significant figures.`,
    promptText: `${ACC} Work out the upper bound for the value of a. Give your answer correct to 4 significant figures.`,
    marks: 2, answer: "2.688", solution: ["Upper v, lower u, lower t", "(24.65 − 12.15) ÷ 4.65 = 2.688…"], noWorking: "full",
    points: [
      { id: "M1", code: "M1", criterion: "(24.65 − 12.15) / 4.65", reject: ["upper bounds of all three values"] },
      { id: "A1", code: "A1", dep: ["M1"], criterion: "2.688" },
    ],
    errors: [{ id: "bounds-division", looksLike: "used the upper bound of all three values: the biggest answer needs the biggest top and smallest bottom" }],
    dangerZones: [{ id: "which", when: "the student is choosing bounds", warn: "Biggest answer: biggest top (v up, u down) and smallest bottom." }],
    coach: {
      keyWords: [{ text: "upper bound for the value of a", why: "Make the top as big as possible and the bottom as small as possible." }],
      clues: ["Each value could be 0.05 either way.", "Biggest v − u: upper v, lower u.", "Divide by the lower bound of t."],
      traps: ["Did you use the lower bound of u and of t?"],
    },
  },
  {
    id: "ccc2-q13b", source: { paper: SRC, q: "13", part: "b" }, topic: "bounds", tier: "H", calculator: true,
    prompt: "Work out the lower bound for the value of a.<br>Give your answer correct to 4 significant figures.",
    promptText: `${ACC} Work out the lower bound for the value of a. Give your answer correct to 4 significant figures.`,
    marks: 2, answer: "2.589", solution: ["Lower v, upper u, upper t", "(24.55 − 12.25) ÷ 4.75 = 2.589…"], noWorking: "full",
    points: [
      { id: "M1", code: "M1", criterion: "(24.55 − 12.25) / 4.75" },
      { id: "A1", code: "A1", dep: ["M1"], criterion: "2.589" },
    ],
    errors: [{ id: "bounds-division", looksLike: "used the lower bound of all three values" }],
    dangerZones: [{ id: "which", when: "the student is choosing bounds", warn: "Smallest answer: smallest top and biggest bottom." }],
    coach: {
      keyWords: [{ text: "lower bound for the value of a", why: "Smallest top, biggest bottom." }],
      clues: ["Smallest v − u: lower v, upper u.", "Divide by the upper bound of t.", "Round to 4 significant figures."],
      traps: ["Did you use the upper bound of u and of t?"],
    },
  },
  {
    id: "ccc2-q13c", source: { paper: SRC, q: "13", part: "c" }, topic: "bounds", tier: "H", calculator: true,
    prompt: "Use your answers to parts (a) and (b) to write down the value of a to a suitable degree of accuracy. Give a reason for your answer.",
    promptText: `${ACC} The upper bound of a is 2.688 and the lower bound is 2.589. Use these to write down the value of a to a suitable degree of accuracy. Give a reason for your answer.`,
    marks: 1, answer: "a = 3", solution: ["Both bounds round to 3 to 1 significant figure", "To 2 s.f. they give 2.7 and 2.6, which disagree"], noWorking: "full",
    points: [{ id: "B1", code: "B1", criterion: "a = 3, with the reason that both bounds agree when rounded to 1 significant figure (they give 2.7 and 2.6 to 2 s.f.).", reject: ["2.6 or 2.7", "3 with no reason"] }],
    errors: [{ id: "rounding", looksLike: "gave 2.6 or 2.7: the bounds disagree at that accuracy" }, { id: "stopped-early", looksLike: "gave no reason (scores 0)" }],
    dangerZones: [{ id: "agree", when: "the student is rounding the bounds", warn: "Round both bounds the same way until they agree." }],
    coach: {
      keyWords: [{ text: "suitable degree of accuracy", why: "The most accurate value both bounds agree on." }, { text: "Give a reason", why: "No reason, no mark." }],
      clues: ["Round both bounds to 2 significant figures: do they agree?", "Try 1 significant figure.", "Write the value and say both bounds round to it."],
      traps: ["Did you give a reason?"],
    },
  },
  {
    id: "ccc2-q14", source: { paper: SRC, q: "14" }, topic: "dirprop", tier: "H", calculator: true,
    prompt: "y is directly proportional to the cube of x.<br>y = 43.2 when x = 6<br>Work out the value of x when y = 145.8",
    marks: 3, answer: "x = 9", solution: ["y = kx³", "k = 43.2 ÷ 6³ = 0.2", "x³ = 145.8 ÷ 0.2 = 729, x = ∛729"], noWorking: "full",
    showWorking: "Start with y = kx³ written down.",
    points: [
      { id: "M1a", code: "M1", criterion: "y = kx³", reject: ["y = kx"] },
      { id: "M1b", code: "M1", dep: ["M1a"], criterion: "k = 43.2 ÷ 6³ = 0.2" },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "x³ = 145.8 ÷ 0.2 = 729, so x = 9", reject: ["729", "27 (square root)", "20.25 (y = kx)"] },
    ],
    errors: [
      { id: "direct-inverse", looksLike: "used y = kx, giving x = 20.25: 'the cube of x' puts x³ in the formula" },
      { id: "stopped-early", looksLike: "stopped at x³ = 729, or took the square root instead of the cube root" },
    ],
    dangerZones: [{ id: "cube", when: "x³ = 729 has been found", warn: "That's x³. One more step." }],
    coach: {
      keyWords: [{ text: "cube of x", why: "x³ goes in the formula." }],
      clues: ["Write y = kx³.", "Use y = 43.2 and x = 6 to find k.", "Put y = 145.8 in, find x³, then cube root."],
      traps: ["Did you cube root at the end?"],
    },
  },
  {
    id: "ccc2-q15", source: { paper: SRC, q: "15" }, topic: "surface", tier: "H", calculator: true,
    prompt: "The diagram shows a solid cone.<br>The cone has base radius 5 cm and perpendicular height 12 cm.<br>Work out the total surface area of the cone.<br>Give your answer correct to 3 significant figures.",
    diagram: cone, marks: 4, answer: "283 cm²", solution: ["Slant height = √(5² + 12²) = 13", "Curved surface = π × 5 × 13 = 65π", "Base = 25π", "Total = 90π = 282.7… = 283 cm²"], noWorking: "full",
    showWorking: "Write the slant height, curved surface and base as separate lines.",
    points: [
      { id: "M1a", code: "M1", criterion: "Slant height = √(5² + 12²) = 13" },
      { id: "M1b", code: "M1", ft: true, criterion: "Curved surface = π × 5 × 13 (= 65π)", reject: ["π × 5 × 12"] },
      { id: "M1c", code: "M1", ft: true, dep: ["M1b"], criterion: "Adds the base: 65π + 25π = 90π" },
      { id: "A1", code: "A1", dep: ["M1c"], criterion: "283 (from 282.7…)", reject: ["204 (base left out)"] },
    ],
    errors: [
      { id: "wrong-formula", looksLike: "used the perpendicular height, 12, as l in πrl: the formula needs the slant height" },
      { id: "stopped-early", looksLike: "left out the circular base when the question says 'total' surface area, giving 204" },
    ],
    dangerZones: [
      { id: "slant", when: "the student is about to use πrl", warn: "l is the slant height, not the perpendicular height." },
      { id: "base", when: "the curved surface has been found", warn: "'Total' surface area: what else is there?" },
    ],
    coach: {
      keyWords: [{ text: "total surface area", why: "Curved surface plus the circular base." }, { text: "perpendicular height", why: "Not the slant height: find l with Pythagoras." }],
      clues: ["Find the slant height with Pythagoras.", "Curved surface = πrl.", "Add the area of the base, πr²."],
      traps: ["Did you include the base?"],
    },
  },
  {
    id: "ccc2-q16a", source: { paper: SRC, q: "16", part: "a" }, topic: "iter", tier: "H", calculator: true,
    prompt: "Show that the equation &nbsp;<span class=\"eq\">x<sup>3</sup> − 5x − 3 = 0</span>&nbsp; has a solution between x = 2 and x = 3",
    promptText: "Show that the equation x³ − 5x − 3 = 0 has a solution between x = 2 and x = 3.",
    marks: 2, answer: "Shown: f(2) = −5, f(3) = 9, change of sign", solution: ["f(2) = 8 − 10 − 3 = −5", "f(3) = 27 − 15 − 3 = 9", "Change of sign, so there is a solution between 2 and 3"], noWorking: "zero",
    points: [
      { id: "M1", code: "M1", criterion: "f(2) = −5 and f(3) = 9" },
      { id: "A1", code: "A1", dep: ["M1"], criterion: "States that there is a change of sign, so there is a solution between 2 and 3." },
    ],
    errors: [{ id: "stopped-early", looksLike: "worked out the two values and wrote no conclusion: 'change of sign' earns the second mark" }],
    dangerZones: [{ id: "conclude", when: "both values have been found", warn: "Finish with the words that prove it." }],
    coach: {
      keyWords: [{ text: "Show that", why: "Values and a conclusion." }],
      clues: ["Substitute x = 2 into x³ − 5x − 3.", "Substitute x = 3.", "One is negative, one positive: say what that means."],
      traps: ["Did you write 'change of sign'?"],
    },
  },
  {
    id: "ccc2-q16b", source: { paper: SRC, q: "16", part: "b" }, topic: "iter", tier: "H", calculator: true,
    prompt: "A solution of x<sup>3</sup> − 5x − 3 = 0 can be found using the iteration formula &nbsp;<span class=\"eq\">x<sub>n+1</sub> = ∛(5x<sub>n</sub> + 3)</span><br>Starting with x<sub>0</sub> = 2, use the iteration formula to work out the values of x<sub>1</sub>, x<sub>2</sub> and x<sub>3</sub><br>Give each value correct to 3 decimal places.",
    promptText: "Iteration formula x(n+1) = cube root of (5x(n) + 3). Starting with x0 = 2, work out x1, x2 and x3, each correct to 3 decimal places.",
    marks: 3, answer: "2.351, 2.453, 2.481", solution: ["x1 = ∛13 = 2.35133…", "x2 = 2.45280…", "x3 = 2.48060…"], noWorking: "full",
    points: [
      { id: "B1a", code: "B1", criterion: "x1 = 2.351" },
      { id: "B1b", code: "B1", criterion: "x2 = 2.453" },
      { id: "B1c", code: "B1", criterion: "x3 = 2.481" },
    ],
    errors: [
      { id: "fractional-index", looksLike: "used the square root instead of the cube root" },
      { id: "rounding", looksLike: "typed rounded values back in" },
    ],
    dangerZones: [{ id: "ans", when: "x1 has been found", warn: "Use ANS, not the rounded value." }],
    coach: {
      keyWords: [{ text: "x0 = 2", why: "Your starting value." }, { text: "3 decimal places", why: "Round each answer, but keep full values in the calculator." }],
      clues: ["Put x0 = 2 into the formula.", "Type 2, =, then ∛(5ANS + 3).", "Press = again for x2 and x3."],
      traps: ["Is it a cube root?"],
    },
  },
  {
    id: "ccc2-q17a", source: { paper: SRC, q: "17", part: "a" }, topic: "funcmach", tier: "H", calculator: true,
    prompt: `The function f is such that &nbsp;<span class="eq">f(x) = ${fr("2x + 3", "x − 1")}</span><br>Work out the value of f(4)`,
    promptText: `${F17} Work out the value of f(4).`,
    marks: 1, answer: "11/3", solution: ["(8 + 3) ÷ (4 − 1) = 11/3"], noWorking: "full",
    points: [{ id: "B1", code: "B1", criterion: "11/3", accept: ["3.67", "3 2/3"] }],
    errors: [{ id: "order-error", looksLike: "substituted into only part of the fraction" }],
    dangerZones: [{ id: "sub", when: "the student is substituting", warn: "Replace every x with 4." }],
    coach: {
      keyWords: [{ text: "f(4)", why: "Replace x with 4." }],
      clues: ["Top: 2 × 4 + 3.", "Bottom: 4 − 1.", "Divide."],
      traps: ["Did you replace both x's?"],
    },
  },
  {
    id: "ccc2-q17b", source: { paper: SRC, q: "17", part: "b" }, topic: "inv", tier: "H", calculator: true,
    prompt: "Find &nbsp;f<sup>−1</sup>(x)", promptText: `${F17} Find f⁻¹(x).`,
    marks: 3, answer: "f⁻¹(x) = (x + 3)/(x − 2)", solution: ["y = (2x + 3)/(x − 1)", "y(x − 1) = 2x + 3", "xy − 2x = y + 3, x(y − 2) = y + 3", "f⁻¹(x) = (x + 3)/(x − 2)"], noWorking: "full",
    showWorking: "Write each rearranging line.",
    points: [
      { id: "M1a", code: "M1", criterion: "y(x − 1) = 2x + 3" },
      { id: "M1b", code: "M1", ft: true, dep: ["M1a"], criterion: "Collects the x terms and factorises: x(y − 2) = y + 3" },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "(x + 3)/(x − 2)", reject: ["(x − 1)/(2x + 3) (reciprocal)", "answer left in terms of y"] },
    ],
    errors: [
      { id: "inverse-reciprocal", looksLike: "gave (x − 1)/(2x + 3): the inverse function isn't the reciprocal" },
      { id: "stopped-early", looksLike: "left the answer in terms of y" },
    ],
    dangerZones: [{ id: "collect", when: "x appears on both sides", warn: "Get both x terms on one side and factorise." }],
    coach: {
      keyWords: [{ text: "f−1(x)", why: "The inverse: undo f. Not 1 ÷ f." }],
      clues: ["Write y = (2x + 3)/(x − 1) and multiply both sides by (x − 1).", "Collect the x terms on one side and factorise x out.", "Divide, then write the answer in terms of x."],
      traps: ["Is your answer in terms of x?"],
    },
  },
  {
    id: "ccc2-q18a", source: { paper: SRC, q: "18", part: "a" }, topic: "circleeq", tier: "H", calculator: true,
    prompt: "The circle C has equation &nbsp;<span class=\"eq\">x<sup>2</sup> + y<sup>2</sup> = 40</span><br>Show that the point P(6, 2) lies on the circle C.",
    promptText: "The circle C has equation x² + y² = 40. Show that the point P(6, 2) lies on the circle C.",
    marks: 1, answer: "Shown: 6² + 2² = 40", solution: ["6² + 2² = 36 + 4 = 40"], noWorking: "zero",
    points: [{ id: "B1", code: "B1", criterion: "6² + 2² = 36 + 4 = 40" }],
    errors: [{ id: "missed-square", looksLike: "added 6 + 2 without squaring" }],
    dangerZones: [{ id: "sub", when: "the student is substituting", warn: "Square both coordinates." }],
    coach: {
      keyWords: [{ text: "Show that", why: "Substitute and show it equals 40." }],
      clues: ["Substitute x = 6 and y = 2.", "Work out 6² + 2².", "Show it equals 40."],
      traps: ["Did you show the working, not just say it?"],
    },
  },
  {
    id: "ccc2-q18b", source: { paper: SRC, q: "18", part: "b" }, topic: "tangent", tier: "H", calculator: true,
    prompt: "Find an equation of the tangent to C at the point P.<br>Give your answer in the form y = mx + c",
    promptText: "The circle C has equation x² + y² = 40. P(6, 2) is on the circle. Find an equation of the tangent to C at P, in the form y = mx + c.",
    marks: 3, answer: "y = −3x + 20", solution: ["Gradient of OP = 2/6 = 1/3", "Tangent gradient = −3", "2 = −3 × 6 + c, c = 20"], noWorking: "full",
    points: [
      { id: "M1a", code: "M1", criterion: "Gradient of the radius OP = 2/6 = 1/3" },
      { id: "M1b", code: "M1", ft: true, dep: ["M1a"], criterion: "Gradient of the tangent = −3", reject: ["1/3", "−1/3", "3"] },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "y = −3x + 20" },
    ],
    errors: [{ id: "perp-gradient", looksLike: "used 1/3 (the radius gradient), −1/3 or 3: flip the fraction and change the sign" }],
    dangerZones: [{ id: "perp", when: "the radius gradient has been found", warn: "The tangent is perpendicular to the radius." }],
    coach: {
      keyWords: [{ text: "tangent", why: "Perpendicular to the radius at P." }, { text: "y = mx + c", why: "Your answer's form." }],
      clues: ["Find the gradient of OP.", "The tangent's gradient is the negative reciprocal.", "Use P(6, 2) to find c."],
      traps: ["Do your two gradients multiply to −1?"],
    },
  },
  {
    id: "ccc2-q19a", source: { paper: SRC, q: "19", part: "a" }, topic: "vecproof", tier: "H", calculator: true,
    prompt: "OPQ is a triangle. &nbsp;OP = 2<b>a</b> &nbsp;&nbsp; OQ = 2<b>b</b><br>M is the midpoint of PQ. R is the midpoint of OQ.<br>N is the point on OM such that ON : NM = 2 : 1<br>Find the vector OM in terms of <b>a</b> and <b>b</b>.",
    promptText: "OPQ is a triangle. Vector OP = 2a, vector OQ = 2b. M is the midpoint of PQ. R is the midpoint of OQ. N is on OM with ON : NM = 2 : 1. Find vector OM in terms of a and b.",
    diagram: vecOPQ, marks: 1, answer: "a + b", solution: ["PQ = 2b − 2a", "OM = 2a + ½(2b − 2a) = a + b"], noWorking: "full",
    points: [{ id: "B1", code: "B1", criterion: "OM = a + b" }],
    errors: [{ id: "sign-error", looksLike: "sign error in PQ" }],
    dangerZones: [{ id: "route", when: "the student is finding OM", warn: "Go O to P, then half of P to Q." }],
    coach: {
      keyWords: [{ text: "midpoint of PQ", why: "Halfway along PQ." }],
      clues: ["PQ = PO + OQ = −2a + 2b.", "OM = OP + ½PQ.", "Simplify."],
      traps: ["Did you simplify fully?"],
    },
  },
  {
    id: "ccc2-q19b", source: { paper: SRC, q: "19", part: "b" }, topic: "vecproof", tier: "H", calculator: true,
    prompt: "Prove that PNR is a straight line.",
    promptText: "OPQ is a triangle. OP = 2a, OQ = 2b, OM = a + b. M is the midpoint of PQ, R is the midpoint of OQ, N is on OM with ON : NM = 2 : 1. Prove that PNR is a straight line.",
    diagram: vecOPQ, marks: 4, answer: "Proof: PR = 3/2 PN",
    solution: ["ON = 2/3 (a + b)", "PN = −2a + 2/3 (a + b) = −4/3 a + 2/3 b", "PR = −2a + b", "PR = 3/2 PN, so PN and PR are parallel and share P: PNR is a straight line"], noWorking: "zero",
    points: [
      { id: "M1a", code: "M1", criterion: "ON = 2/3 (a + b)", reject: ["1/3 (a + b)"] },
      { id: "M1b", code: "M1", ft: true, dep: ["M1a"], criterion: "PN = −2a + 2/3 (a + b) = −4/3 a + 2/3 b" },
      { id: "M1c", code: "M1", criterion: "PR = −2a + b" },
      { id: "A1", code: "A1", dep: ["M1b", "M1c"], criterion: "PR = 3/2 PN, so PN and PR are parallel, and they share the point P, so PNR is a straight line." },
    ],
    errors: [
      { id: "stopped-early", looksLike: "found the two vectors and stopped: the proof needs 'parallel' (a multiple) and 'a point in common'" },
      { id: "wrong-ratio", looksLike: "used 1/3 for ON: N is 2/3 of the way along OM" },
    ],
    dangerZones: [
      { id: "frac", when: "the student is finding ON", warn: "2 : 1 is 3 parts. How far along is N?" },
      { id: "conclude", when: "both vectors have been found", warn: "Show one is a multiple of the other, and say what they share." },
    ],
    coach: {
      keyWords: [{ text: "Prove", why: "Two vectors, one a multiple of the other, sharing a point." }, { text: "straight line", why: "Parallel and a common point." }],
      clues: ["ON = 2/3 of OM.", "Find PN and PR in terms of a and b.", "Show PR is a multiple of PN and state that they share P."],
      traps: ["Did you mention both 'parallel' and the common point?"],
    },
  },
  {
    id: "ccc2-q20", source: { paper: SRC, q: "20" }, topic: "cond", tier: "H", calculator: true,
    prompt: "A box contains 4 milk chocolates and 6 dark chocolates.<br>Ella takes 3 chocolates from the box at random and eats them.<br>Work out the probability that Ella eats at least one milk chocolate.",
    marks: 4, answer: "5/6", solution: ["P(no milk) = 6/10 × 5/9 × 4/8 = 120/720 = 1/6", "P(at least one milk) = 1 − 1/6"], noWorking: "full",
    showWorking: "Write P(no milk) as a product first.",
    points: [
      { id: "M1a", code: "M1", criterion: "P(no milk chocolates) = 6/10 × 5/9 × 4/8", reject: ["6/10 × 6/10 × 6/10"] },
      { id: "A1a", code: "A1", dep: ["M1a"], criterion: "120/720 or 1/6" },
      { id: "M1b", code: "M1", ft: true, criterion: "1 − 1/6 (1 − their P(none))." },
      { id: "A1b", code: "A1", dep: ["M1b"], criterion: "5/6 oe", accept: ["0.833"] },
    ],
    errors: [
      { id: "replacement", looksLike: "kept the denominator as 10 each time: the chocolates are eaten, so it's 10, then 9, then 8" },
      { id: "wrong-share", looksLike: "worked out exactly one milk chocolate instead of at least one" },
    ],
    dangerZones: [
      { id: "denom", when: "the student is writing the second fraction", warn: "A chocolate has been eaten. How many are left?" },
      { id: "complement", when: "the student is starting", warn: "'At least one' is quickest as 1 − P(none)." },
    ],
    coach: {
      keyWords: [{ text: "eats them", why: "Without replacement: fewer each time." }, { text: "at least one", why: "1 − P(none)." }],
      clues: ["Find the probability of eating no milk chocolates.", "All three dark: 6/10 × 5/9 × 4/8.", "Subtract from 1."],
      traps: ["Did your denominators go 10, 9, 8?"],
    },
  },
  {
    id: "ccc2-q21a", source: { paper: SRC, q: "21", part: "a" }, topic: "cosr", tier: "H", calculator: true,
    prompt: "ABC is a triangle.<br>AB = 8.6 cm &nbsp;&nbsp; BC = 11.2 cm &nbsp;&nbsp; AC = 14.5 cm<br>Work out the size of angle ABC. Give your answer correct to 1 decimal place.",
    diagram: triABC, marks: 3, answer: "93.2°", solution: ["cos B = (8.6² + 11.2² − 14.5²) / (2 × 8.6 × 11.2)", "cos B = −0.0563…", "B = 93.2°"], noWorking: "full",
    points: [
      { id: "M1a", code: "M1", criterion: "cos B = (8.6² + 11.2² − 14.5²) / (2 × 8.6 × 11.2)" },
      { id: "M1b", code: "M1", dep: ["M1a"], criterion: "cos B = −0.0563…" },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "93.2", reject: ["86.8 (negative sign lost)"] },
    ],
    errors: [
      { id: "wrong-formula", looksLike: "put the wrong side last: the side subtracted must be opposite the angle, 14.5" },
      { id: "sign-error", looksLike: "lost the negative sign and gave 86.8°" },
    ],
    dangerZones: [{ id: "opp", when: "the student is setting up the cosine rule", warn: "The side opposite angle B is the one subtracted." }],
    coach: {
      keyWords: [{ text: "angle ABC", why: "The angle at B, opposite AC." }],
      clues: ["Three sides, find an angle: cosine rule.", "AC = 14.5 is opposite B, so 14.5² is subtracted.", "Use cos⁻¹ on the result."],
      traps: ["Is your cosine negative? Then the angle is over 90°."],
    },
  },
  {
    id: "ccc2-q21b", source: { paper: SRC, q: "21", part: "b" }, topic: "areasin", tier: "H", calculator: true,
    prompt: "Work out the area of triangle ABC. Give your answer correct to 3 significant figures.",
    promptText: "Triangle ABC has AB = 8.6 cm, BC = 11.2 cm, AC = 14.5 cm and angle ABC = 93.2°. Work out the area of triangle ABC, correct to 3 significant figures.",
    diagram: triABC, marks: 2, answer: "48.1 cm²", solution: ["½ × 8.6 × 11.2 × sin 93.2° = 48.08…"], noWorking: "full",
    points: [
      { id: "M1", code: "M1", ft: true, criterion: "½ × 8.6 × 11.2 × sin 93.2° (their angle).", reject: ["½ × 14.5 × 8.6 (as if right-angled)"] },
      { id: "A1", code: "A1", dep: ["M1"], criterion: "48.1" },
    ],
    errors: [{ id: "wrong-formula", looksLike: "used ½ × 14.5 × 8.6 as if there were a right angle" }],
    dangerZones: [{ id: "angle", when: "the student is choosing sides", warn: "Use the two sides either side of angle B." }],
    coach: {
      keyWords: [{ text: "area of triangle ABC", why: "Use ½ab sin C with the angle from (a)." }],
      clues: ["Use area = ½ab sin C.", "The sides either side of B are 8.6 and 11.2.", "Use your angle from (a)."],
      traps: ["Are the two sides the ones next to angle B?"],
    },
  },
];
