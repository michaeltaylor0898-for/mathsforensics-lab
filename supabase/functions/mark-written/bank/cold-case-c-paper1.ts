// Cold Case C · Higher Paper 1 (non-calculator) · all 24 questions, 80 marks (CC-C/1H)
//
// Question wording is copied from the paper. Mark points follow Mike's Cold Case C Paper 1 Forensic
// Mark Scheme line for line; errors and Mike-mode danger zones come from its "Where the marks go
// missing" boxes. B2 marks are split into two B1 points so partial credit still works.
import type { Scheme } from "../schemes.ts";

const fr = (n: string | number, d: string | number) => `<span class="fr"><span>${n}</span><span>${d}</span></span>`;
const SRC = "CC-C/1H";
const TXT = `font-family="Times New Roman,serif" fill="currentColor"`;
const NDA = (x: number, y: number) => `<text x="${x}" y="${y}" font-size="9" text-anchor="middle" fill="currentColor" opacity=".7" font-family="Arial,sans-serif">Not drawn accurately</text>`;
const table = (rows: (string | number)[][], headRow = true) =>
  `<table class="qt">${rows.map((r, i) => `<tr>${r.map((c, j) => ((headRow ? i : j) === 0 ? `<th>${c}</th>` : `<td>${c}</td>`)).join("")}</tr>`).join("")}</table>`;

// ---------- diagrams ----------
const bearing = `<svg viewBox="0 -12 260 182" role="img" aria-label="A north line at A and a north line at B. B is up and to the right of A, on a bearing of 065 degrees from A."><g fill="none" stroke="currentColor" stroke-width="1.5"><path d="M60 140 V40 M190 80 V10 M60 140 L190 80"/><path d="M55 48 L60 38 L65 48 M185 18 L190 8 L195 18"/><path d="M60 110 A30 30 0 0 1 87 127"/></g><g ${TXT} font-size="13"><text x="55" y="34">N</text><text x="185" y="4">N</text><text x="46" y="154" font-style="italic">A</text><text x="196" y="86" font-style="italic">B</text><text x="70" y="104">65°</text></g>${NDA(130, 166)}</svg>`;

const boxPlots = (() => {
  const X = (v: number) => 90 + v * 5;
  const grid: string[] = [];
  for (let v = 0; v <= 50; v += 2) grid.push(`M${X(v)} 10V130`);
  const ax = [0, 10, 20, 30, 40, 50].map((v) => `<text x="${X(v)}" y="146" text-anchor="middle">${v}</text>`).join("");
  return `<svg viewBox="0 0 360 170" role="img" aria-label="Box plot for class A on a test score scale from 0 to 50: lowest 15, lower quartile 24, median 30, upper quartile 34, highest 44. An empty row for class B."><path d="${grid.join("")}" stroke="currentColor" stroke-width=".4" opacity=".3"/><path d="M${X(0)} 130H${X(50)}" stroke="currentColor" stroke-width="1.2"/><g fill="none" stroke="currentColor" stroke-width="1.5"><path d="M${X(15)} 45H${X(24)}M${X(34)} 45H${X(44)}M${X(15)} 37V53M${X(44)} 37V53M${X(30)} 32V58"/><rect x="${X(24)}" y="32" width="${X(34) - X(24)}" height="26"/></g><g ${TXT} font-size="12"><text x="70" y="49" text-anchor="end">Class A</text><text x="70" y="104" text-anchor="end">Class B</text>${ax}<text x="${X(25)}" y="164" text-anchor="middle">Test score</text></g></svg>`;
})();

const rightTri = `<svg viewBox="0 0 220 180" role="img" aria-label="Right-angled triangle ABC with the right angle at B. AB is vertical, 2 root 3 cm. BC is horizontal, 2 cm."><path d="M80 20 L80 150 L170 150 Z" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M80 138 H92 V150" fill="none" stroke="currentColor" stroke-width="1.1"/><g ${TXT} font-size="13"><text x="76" y="14" font-style="italic">A</text><text x="66" y="162" font-style="italic">B</text><text x="174" y="162" font-style="italic">C</text><text x="74" y="90" text-anchor="end">2√3 cm</text><text x="125" y="168" text-anchor="middle">2 cm</text></g>${NDA(125, 178)}</svg>`;

const simTri = `<svg viewBox="0 0 260 200" role="img" aria-label="Triangle ADE with B on AD and C on AE. BC is parallel to DE. AB = 6 cm, BD = 3 cm, BC = 8 cm."><g fill="none" stroke="currentColor" stroke-width="1.5"><path d="M130 15 L40 165 L220 165 Z M70 115 L190 115"/><path d="M127 112 l5 3 l-5 3 M187 162 l5 3 l-5 3" stroke-width="1.2"/></g><g ${TXT} font-size="13"><text x="125" y="11" font-style="italic">A</text><text x="56" y="114" font-style="italic">B</text><text x="196" y="114" font-style="italic">C</text><text x="28" y="178" font-style="italic">D</text><text x="224" y="178" font-style="italic">E</text><text x="92" y="66" text-anchor="end">6 cm</text><text x="50" y="146" text-anchor="end">3 cm</text><text x="130" y="108" text-anchor="middle">8 cm</text></g>${NDA(130, 195)}</svg>`;

const circOBC = `<svg viewBox="0 0 240 200" role="img" aria-label="A circle with centre O. A, B and C are on the circle, A at the top, B lower left, C lower right. Triangle ABC is drawn, and O is joined to B and C. Angle OBC is 28 degrees."><circle cx="120" cy="100" r="75" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M120 25 L51 131 L189 131 Z M51 131 L120 94 L189 131" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M73 131 A22 22 0 0 0 70 121" fill="none" stroke="currentColor" stroke-width="1.1"/><g ${TXT} font-size="13"><text x="116" y="19" font-style="italic">A</text><text x="116" y="88" font-style="italic">O</text><text x="38" y="138" font-style="italic">B</text><text x="193" y="138" font-style="italic">C</text><text x="78" y="128" font-size="11">28°</text></g>${NDA(120, 194)}</svg>`;

const triX30 = `<svg viewBox="0 0 280 132" role="img" aria-label="A triangle with sides x cm and (x + 3) cm meeting at an angle of 30 degrees on the left."><path d="M30 90 L250 90 L150 20 Z" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M62 90 A32 32 0 0 0 57 72" fill="none" stroke="currentColor" stroke-width="1.1"/><g ${TXT} font-size="12"><text x="66" y="80">30°</text><text x="86" y="46" text-anchor="end" font-style="italic">x cm</text><text x="140" y="106" text-anchor="middle"><tspan font-style="italic">(x</tspan> + 3) cm</text></g>${NDA(140, 128)}</svg>`;

const juTree = `<svg viewBox="0 0 330 180" role="img" aria-label="Probability tree. Monday: Late 0.2, Not late blank. Tuesday after Late: Late 0.3, Not late blank. Tuesday after Not late: Late blank, Not late blank."><g fill="none" stroke="currentColor" stroke-width="1.4"><path d="M20 95 L120 45 M20 95 L120 145 M175 45 L260 20 M175 45 L260 70 M175 145 L260 120 M175 145 L260 170"/></g><g ${TXT} font-size="12"><text x="60" y="14">Monday</text><text x="262" y="10">Tuesday</text><text x="124" y="49">Late</text><text x="124" y="149">Not late</text><text x="264" y="24">Late</text><text x="264" y="74">Not late</text><text x="264" y="124">Late</text><text x="264" y="174">Not late</text><text x="52" y="62">0.2</text><text x="46" y="138">……</text><text x="210" y="24">0.3</text><text x="210" y="72">……</text><text x="210" y="124">……</text><text x="210" y="172">……</text></g></svg>`;

const JO = "The probability that Jo is late for school on Monday is 0.2<br>The probability that Jo is late for school on Tuesday is 0.3<br>The two events are independent.";
const JO_T = "P(Jo late on Monday) = 0.2. P(Jo late on Tuesday) = 0.3. The two events are independent.";

export const COLD_CASE_C1: Scheme[] = [
  {
    id: "ccc1-q1", source: { paper: SRC, q: "1" }, topic: "frac", tier: "H", calculator: false,
    prompt: `Work out &nbsp;<span class="eq">1${fr(5, 6)} + 2${fr(3, 8)}</span><br>Give your answer as a mixed number in its simplest form.`,
    promptText: "Work out 1 5/6 + 2 3/8. Give your answer as a mixed number in its simplest form.",
    marks: 3, answer: "4 5/24", solution: ["44/24 + 57/24 (or 20/24 + 9/24 with the wholes)", "= 101/24 (or 3 29/24)", "= 4 5/24"], noWorking: "full",
    showWorking: "Write both fractions over 24 before adding.",
    points: [
      { id: "M1a", code: "M1", criterion: "Uses a common denominator of 24: 20/24 and 9/24 (or 44/24 and 57/24).", accept: ["any common multiple of 6 and 8, e.g. 48"] },
      { id: "M1b", code: "M1", ft: true, dep: ["M1a"], criterion: "29/24 or 101/24" },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "4 5/24", reject: ["3 29/24", "101/24"] },
    ],
    errors: [
      { id: "frac-add", looksLike: "added the numerators and the denominators to get 8/14" },
      { id: "wrong-form", looksLike: "left the answer as 3 29/24: the fraction part is top-heavy, so one more whole must be carried" },
    ],
    dangerZones: [
      { id: "denom", when: "the student is about to add the fractions", warn: "Same denominator first." },
      { id: "carry", when: "a fraction part bigger than 1 has appeared, such as 29/24", warn: "Is the fraction part top-heavy? Carry a whole." },
    ],
    coach: {
      keyWords: [{ text: "mixed number", why: "Whole number and a proper fraction." }, { text: "simplest form", why: "Cancel as far as possible." }],
      clues: ["Add the whole numbers and the fractions separately, or convert both to improper fractions.", "Use 24 as the common denominator: 5/6 = 20/24 and 3/8 = 9/24.", "20/24 + 9/24 is more than 1, so carry a whole."],
      traps: ["Is the fraction part less than 1?"],
    },
  },
  {
    id: "ccc1-q2", source: { paper: SRC, q: "2" }, topic: "ind", tier: "H", calculator: false,
    prompt: "Simplify &nbsp;<span class=\"eq\">3x<sup>2</sup>y × 4x<sup>3</sup>y<sup>5</sup></span>",
    promptText: "Simplify 3x²y × 4x³y⁵.",
    marks: 2, answer: "12x⁵y⁶", solution: ["3 × 4 = 12", "x² × x³ = x⁵", "y × y⁵ = y⁶"], noWorking: "full",
    points: [
      { id: "B1a", code: "B1", criterion: "Two of the three parts correct: 12, x⁵, y⁶." },
      { id: "B1b", code: "B1", criterion: "12x⁵y⁶ fully correct." },
    ],
    errors: [
      { id: "index-law", looksLike: "multiplied the powers to get x⁶: when you multiply, the powers are added" },
      { id: "wrong-operation", looksLike: "added the coefficients to get 7" },
      { id: "missed-term", looksLike: "forgot that y means y¹, giving y⁵" },
    ],
    markerNotes: ["Mike's scheme is B2 (B1 for two of the three parts): award B1a for two parts, B1a and B1b for all three."],
    dangerZones: [{ id: "powers", when: "the student is combining the powers", warn: "Multiplying: add the powers. And y on its own is y¹." }],
    coach: {
      keyWords: [{ text: "Simplify", why: "One term: number, then x power, then y power." }],
      clues: ["Multiply the numbers: 3 × 4.", "Multiply the x terms: add the powers.", "y on its own means y¹. Add the y powers."],
      traps: ["Did you add the powers, not multiply them?"],
    },
  },
  {
    id: "ccc1-q3", source: { paper: SRC, q: "3" }, topic: "ratio", tier: "H", calculator: false,
    prompt: "Green paint is made by mixing blue paint and yellow paint in the ratio 2 : 5<br>Sam has 300 ml of blue paint and 600 ml of yellow paint.<br>Work out the greatest amount of green paint that Sam can make.",
    marks: 3, answer: "840 ml", solution: ["Blue: 300 ÷ 2 = 150 per part; yellow: 600 ÷ 5 = 120 per part", "Yellow runs out first: 120 ml per part", "7 × 120 = 840 ml"], noWorking: "full",
    showWorking: "Work out the size of one part from each colour.",
    points: [
      { id: "M1a", code: "M1", criterion: "300 ÷ 2 = 150 or 600 ÷ 5 = 120" },
      { id: "M1b", code: "M1", criterion: "Identifies that the yellow paint runs out first: 7 × 120 (or 240 + 600)." },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "840", reject: ["900 (all the paint)", "1050 (150 per part)"] },
    ],
    errors: [
      { id: "wrong-operation", looksLike: "added all the paint to get 900 ml: not all the blue can be used" },
      { id: "wrong-share", looksLike: "used 150 ml per part, giving 1050 ml but needing 750 ml of yellow" },
    ],
    dangerZones: [{ id: "limit", when: "the student has a value for one part", warn: "Check which colour runs out first." }],
    coach: {
      keyWords: [{ text: "ratio 2 : 5", why: "2 parts blue to 5 parts yellow." }, { text: "greatest amount", why: "One colour will run out first." }],
      clues: ["Find how big one part could be using all the blue, and using all the yellow.", "The smaller part size is the one that limits you.", "Green = 7 parts."],
      traps: ["Do you have enough of both colours for your answer?"],
    },
  },
  {
    id: "ccc1-q4", source: { paper: SRC, q: "4" }, topic: "bearing", tier: "H", calculator: false,
    prompt: "The bearing of B from A is 065°<br>Work out the bearing of A from B.",
    diagram: bearing, marks: 2, answer: "245°", solution: ["65 + 180 = 245°"], noWorking: "full",
    points: [
      { id: "M1", code: "M1", criterion: "65 + 180, or marks the co-interior angle of 115° at B." },
      { id: "A1", code: "A1", dep: ["M1"], criterion: "245", reject: ["295 (360 − 65)", "115"] },
    ],
    errors: [
      { id: "wrong-operation", looksLike: "worked out 360 − 65 = 295" },
      { id: "stopped-early", looksLike: "gave 115°, the co-interior angle, which isn't measured clockwise from north" },
    ],
    dangerZones: [{ id: "north", when: "the student is working at B", warn: "Measure clockwise from the north line at B." }],
    coach: {
      keyWords: [{ text: "bearing of A from B", why: "Stand at B and face north." }],
      clues: ["The two north lines are parallel.", "A back bearing differs by 180°.", "Add 180° to 65°."],
      traps: ["Is it measured clockwise from north at B?"],
    },
  },
  {
    id: "ccc1-q5", source: { paper: SRC, q: "5" }, topic: "sdp", tier: "H", calculator: false,
    prompt: "Leah drives 90 km at an average speed of 60 km/h.<br>She then drives 100 km at an average speed of 40 km/h.<br>Work out Leah's average speed for the whole journey.",
    marks: 3, answer: "47.5 km/h", solution: ["90 ÷ 60 = 1.5 hours", "100 ÷ 40 = 2.5 hours", "190 ÷ 4 = 47.5 km/h"], noWorking: "full",
    showWorking: "Write each time before dividing the total distance.",
    points: [
      { id: "M1a", code: "M1", criterion: "Finds a time: 90 ÷ 60 = 1.5 hours or 100 ÷ 40 = 2.5 hours." },
      { id: "M1b", code: "M1", ft: true, dep: ["M1a"], criterion: "Total distance ÷ total time: 190 ÷ 4" },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "47.5", reject: ["50 (average of the speeds, scores 0)"] },
    ],
    errors: [{ id: "wrong-average", looksLike: "averaged the two speeds to get 50 km/h (scores 0)" }],
    dangerZones: [{ id: "avg", when: "the student is about to combine the speeds", warn: "Average speed is total distance ÷ total time." }],
    coach: {
      keyWords: [{ text: "average speed for the whole journey", why: "Total distance ÷ total time." }],
      clues: ["Find the time for each part: time = distance ÷ speed.", "Add the times and add the distances.", "Divide total distance by total time."],
      traps: ["Is your answer below 50? It should be: she drove longer at 40 km/h."],
    },
  },
  {
    id: "ccc1-q6", source: { paper: SRC, q: "6" }, topic: "freqtab", tier: "H", calculator: false,
    prompt: `The table gives information about the times, t minutes, that 20 students took to travel to school.${table([["Time (t minutes)", "Frequency"], ["0 &lt; t ≤ 10", 4], ["10 &lt; t ≤ 20", 6], ["20 &lt; t ≤ 30", 8], ["30 &lt; t ≤ 40", 2]])}Work out an estimate for the mean time.`,
    promptText: "Times of 20 students: 0 < t ≤ 10: 4; 10 < t ≤ 20: 6; 20 < t ≤ 30: 8; 30 < t ≤ 40: 2. Work out an estimate for the mean time.",
    marks: 3, answer: "19 minutes", solution: ["5 × 4 + 15 × 6 + 25 × 8 + 35 × 2 = 380", "380 ÷ 20 = 19"], noWorking: "full",
    showWorking: "Write the midpoint × frequency products.",
    points: [
      { id: "M1a", code: "M1", criterion: "Multiplies midpoints by frequencies: 5 × 4, 15 × 6, 25 × 8, 35 × 2 (at least three correct)." },
      { id: "M1b", code: "M1", ft: true, dep: ["M1a"], criterion: "(20 + 90 + 200 + 70) ÷ 20 = 380 ÷ 20" },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "19" },
    ],
    errors: [
      { id: "wrong-denominator", looksLike: "divided by 4 (the number of rows) instead of 20 (the number of students)" },
      { id: "midpoint", looksLike: "used the end of each class (10, 20, 30, 40) instead of the midpoint" },
    ],
    dangerZones: [{ id: "mid", when: "the student is multiplying by frequencies", warn: "Use the middle of each class." }],
    coach: {
      keyWords: [{ text: "estimate", why: "You don't know exact times, so use midpoints." }, { text: "20 students", why: "Divide by this." }],
      clues: ["Find the midpoint of each class.", "Multiply each midpoint by its frequency and add.", "Divide the total by 20."],
      traps: ["Did you divide by 20?"],
    },
  },
  {
    id: "ccc1-q7", source: { paper: SRC, q: "7" }, topic: "cint", tier: "H", calculator: false,
    prompt: "Ravi invests £4000 for 2 years in a savings account.<br>The account pays compound interest at a rate of 5% per year.<br>Work out the value of Ravi's investment at the end of the 2 years.",
    marks: 3, answer: "£4410", solution: ["5% of £4000 = £200, giving £4200", "5% of £4200 = £210", "£4410"], noWorking: "full",
    showWorking: "Write each year's interest on its own line.",
    points: [
      { id: "M1a", code: "M1", criterion: "5% of £4000 = £200, giving £4200 after one year." },
      { id: "M1b", code: "M1", ft: true, dep: ["M1a"], criterion: "5% of £4200 = £210, added on." },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "£4410", reject: ["£4400 (simple interest)"] },
    ],
    errors: [{ id: "simple-compound", looksLike: "used simple interest: 2 × £200 gives £4400" }],
    dangerZones: [{ id: "year2", when: "the first year's value (£4200) has been found", warn: "Year 2's interest is on the new amount." }],
    coach: {
      keyWords: [{ text: "compound interest", why: "Interest is added each year, and the next year's interest is on the new total." }],
      clues: ["Find 5% of £4000 and add it on.", "Now find 5% of the new amount.", "Add that on too."],
      traps: ["Is your second year's interest more than £200?"],
    },
  },
  {
    id: "ccc1-q8", source: { paper: SRC, q: "8" }, topic: "invprop", tier: "H", calculator: false,
    prompt: "It takes 6 machines 10 hours to complete an order.<br>All the machines work at the same rate.<br>Work out how long it would take 4 machines to complete the same order.",
    marks: 2, answer: "15 hours", solution: ["6 × 10 = 60 machine-hours", "60 ÷ 4 = 15 hours"], noWorking: "full",
    points: [
      { id: "M1", code: "M1", criterion: "6 × 10 = 60 machine-hours" },
      { id: "A1", code: "A1", dep: ["M1"], criterion: "60 ÷ 4 = 15", reject: ["6 2/3 (direct proportion)"] },
    ],
    errors: [{ id: "direct-inverse", looksLike: "treated it as direct proportion: 10 ÷ 6 × 4 = 6 2/3 hours" }],
    markerNotes: ["Sense check: fewer machines must take longer, so the answer is more than 10 hours."],
    dangerZones: [{ id: "inv", when: "the student starts", warn: "Fewer machines: more time or less?" }],
    coach: {
      keyWords: [{ text: "same rate", why: "The total amount of work stays the same." }, { text: "4 machines", why: "Fewer machines, so it takes longer." }],
      clues: ["Find the total work: machines × hours.", "6 × 10 = 60 machine-hours.", "Share that work between 4 machines."],
      traps: ["Is your answer more than 10 hours?"],
    },
  },
  {
    id: "ccc1-q9a", source: { paper: SRC, q: "9", part: "a" }, topic: "factq", tier: "H", calculator: false,
    prompt: "Factorise &nbsp;<span class=\"eq\">x<sup>2</sup> − 7x + 12</span>", promptText: "Factorise x² − 7x + 12.",
    marks: 2, answer: "(x − 3)(x − 4)", solution: ["Numbers that multiply to +12 and add to −7: −3 and −4", "(x − 3)(x − 4)"], noWorking: "full",
    points: [
      { id: "M1", code: "M1", criterion: "(x ± 3)(x ± 4)" },
      { id: "A1", code: "A1", dep: ["M1"], criterion: "(x − 3)(x − 4)", reject: ["(x + 3)(x + 4)"] },
    ],
    errors: [{ id: "sign-error", looksLike: "wrote (x + 3)(x + 4): the numbers must multiply to +12 and add to −7, so both are negative" }],
    dangerZones: [{ id: "signs", when: "the student has the numbers 3 and 4", warn: "They must add to −7. What signs?" }],
    coach: {
      keyWords: [{ text: "Factorise", why: "Write as two brackets." }],
      clues: ["Find two numbers that multiply to +12 and add to −7.", "Both numbers must be negative.", "Write them in two brackets with x."],
      traps: ["Expand your brackets: do you get −7x?"],
    },
  },
  {
    id: "ccc1-q9b", source: { paper: SRC, q: "9", part: "b" }, topic: "factq2", tier: "H", calculator: false,
    prompt: "Solve &nbsp;<span class=\"eq\">2x<sup>2</sup> + 5x − 3 = 0</span>", promptText: "Solve 2x² + 5x − 3 = 0.",
    marks: 3, answer: "x = 1/2 and x = −3", solution: ["(2x − 1)(x + 3) = 0", "2x − 1 = 0 → x = 1/2", "x + 3 = 0 → x = −3"], noWorking: "full",
    points: [
      { id: "M1", code: "M1", criterion: "(2x ± 1)(x ± 3)", accept: ["correct substitution into the quadratic formula"] },
      { id: "A1a", code: "A1", dep: ["M1"], criterion: "(2x − 1)(x + 3)" },
      { id: "A1b", code: "A1", dep: ["M1"], criterion: "x = 1/2 and x = −3", reject: ["−1/2 and 3", "x = 1 from 2x − 1 = 0"] },
    ],
    errors: [
      { id: "sign-error", looksLike: "read the solutions straight off the brackets with the wrong signs (−1/2 and 3)" },
      { id: "rearrange", looksLike: "solved 2x − 1 = 0 as x = 1" },
    ],
    dangerZones: [{ id: "solve", when: "the brackets have been found", warn: "Set each bracket equal to 0 and solve it properly." }],
    coach: {
      keyWords: [{ text: "Solve", why: "Two values of x." }],
      clues: ["Factorise into (2x ± …)(x ± …).", "The middle term must come to +5x.", "Set each bracket equal to 0 and solve."],
      traps: ["Did you solve 2x − 1 = 0 correctly?"],
    },
  },
  {
    id: "ccc1-q10a", source: { paper: SRC, q: "10", part: "a" }, topic: "tree", tier: "H", calculator: false,
    prompt: `${JO}<br>Complete the probability tree diagram.<br><small>Write the four missing probabilities in your working, saying which branch each one is on.</small>`,
    promptText: `${JO_T} Complete the probability tree diagram: missing values are Monday Not late, and Tuesday Not late after Late, Late after Not late, Not late after Not late.`,
    diagram: juTree, marks: 2, answer: "Monday Not late 0.8; Tuesday 0.7, 0.3 and 0.7",
    solution: ["Monday Not late: 0.8", "Tuesday after Late: Not late 0.7", "Tuesday after Not late: Late 0.3, Not late 0.7"], noWorking: "full",
    points: [
      { id: "B1a", code: "B1", criterion: "0.8 on the 'Not late' branch for Monday." },
      { id: "B1b", code: "B1", criterion: "0.7, 0.3 and 0.7 on the Tuesday branches." },
    ],
    errors: [{ id: "complement", looksLike: "put the wrong value on a Tuesday branch: the events are independent, so Tuesday's probabilities don't change" }],
    markerNotes: ["The student can't write on the printed tree. Accept the values with clear branch labels, or a redrawn tree."],
    dangerZones: [{ id: "indep", when: "the student is filling in the Tuesday branches", warn: "Independent: Tuesday's probabilities are the same whatever happened Monday." }],
    coach: {
      keyWords: [{ text: "independent", why: "Tuesday's probabilities are the same on both sets of branches." }],
      clues: ["Each pair of branches adds to 1.", "Monday Not late = 1 − 0.2.", "Both Tuesday pairs are Late 0.3 and Not late 0.7."],
      traps: ["Does every pair add to 1?"],
    },
  },
  {
    id: "ccc1-q10b", source: { paper: SRC, q: "10", part: "b" }, topic: "tree", tier: "H", calculator: false,
    prompt: "Work out the probability that Jo is late for school on exactly one of the two days.",
    promptText: `${JO_T} Work out the probability that Jo is late for school on exactly one of the two days.`,
    marks: 3, answer: "0.38", solution: ["Late then not late: 0.2 × 0.7 = 0.14", "Not late then late: 0.8 × 0.3 = 0.24", "0.14 + 0.24 = 0.38"], noWorking: "full",
    showWorking: "Write both products before adding.",
    points: [
      { id: "M1a", code: "M1", ft: true, criterion: "0.2 × 0.7 or 0.8 × 0.3" },
      { id: "M1b", code: "M1", ft: true, dep: ["M1a"], criterion: "Adds the two products: 0.14 + 0.24" },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "0.38", reject: ["0.06 (late both days)", "0.44 (at least one day)"] },
    ],
    errors: [
      { id: "wrong-share", looksLike: "found 'late on both days' (0.06) or 'late on at least one day' (0.44)" },
      { id: "and-or", looksLike: "added along the branches instead of multiplying" },
      { id: "rounding", looksLike: "decimal slip such as 0.2 × 0.7 = 1.4" },
    ],
    dangerZones: [{ id: "exactly", when: "the student is choosing paths", warn: "Exactly one: late then not late, or not late then late." }],
    coach: {
      keyWords: [{ text: "exactly one", why: "Two routes: late Monday only, or late Tuesday only." }],
      clues: ["Find the two paths with exactly one 'Late'.", "Multiply along each path.", "Add the two paths."],
      traps: ["Did you leave out late on both days?"],
    },
  },
  {
    id: "ccc1-q11", source: { paper: SRC, q: "11" }, topic: "sline", tier: "H", calculator: false,
    prompt: "The straight line L passes through the points (1, 5) and (3, 11).<br>Find an equation of the line L.",
    marks: 3, answer: "y = 3x + 2", solution: ["Gradient = (11 − 5)/(3 − 1) = 3", "5 = 3 × 1 + c, so c = 2", "y = 3x + 2"], noWorking: "full",
    showWorking: "Write the gradient calculation and the substitution.",
    points: [
      { id: "M1a", code: "M1", criterion: "Gradient = (11 − 5)/(3 − 1) = 3", reject: ["1/3 (upside down)"] },
      { id: "M1b", code: "M1", ft: true, criterion: "Substitutes a point: 5 = 3 × 1 + c" },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "y = 3x + 2", reject: ["3x + 2 without 'y ='", "the gradient alone"] },
    ],
    errors: [
      { id: "swapped", looksLike: "worked out the gradient upside down (1/3)" },
      { id: "wrong-form", looksLike: "gave only the gradient, or wrote '3x + 2' without 'y ='" },
    ],
    markerNotes: ["Check with the second point: 3 × 3 + 2 = 11."],
    dangerZones: [{ id: "grad", when: "the student is working out the gradient", warn: "Change in y over change in x." }],
    coach: {
      keyWords: [{ text: "equation of the line", why: "y = mx + c, with numbers for m and c." }],
      clues: ["Gradient = change in y ÷ change in x.", "Put the gradient and one point into y = mx + c.", "Solve for c and write the equation."],
      traps: ["Does (3, 11) fit your equation?"],
    },
  },
  {
    id: "ccc1-q12a", source: { paper: SRC, q: "12", part: "a" }, topic: "sf", tier: "H", calculator: false,
    prompt: "Work out &nbsp;<span class=\"eq\">(3.2 × 10<sup>5</sup>) + (4.5 × 10<sup>4</sup>)</span><br>Give your answer in standard form.",
    promptText: "Work out (3.2 × 10^5) + (4.5 × 10^4). Give your answer in standard form.",
    marks: 2, answer: "3.65 × 10⁵", solution: ["320 000 + 45 000 = 365 000", "= 3.65 × 10⁵"], noWorking: "full",
    points: [
      { id: "M1", code: "M1", criterion: "Writes both numbers to the same power of 10: 320 000 + 45 000 or 3.2 × 10⁵ + 0.45 × 10⁵" },
      { id: "A1", code: "A1", dep: ["M1"], criterion: "3.65 × 10⁵", reject: ["7.7 × 10⁹"] },
    ],
    errors: [{ id: "index-law", looksLike: "added the numbers and the powers to get 7.7 × 10⁹: you can only add the front numbers when the powers are the same" }],
    dangerZones: [{ id: "match", when: "the student is about to add", warn: "The powers of 10 are different. Make them match first." }],
    coach: {
      keyWords: [{ text: "+", why: "Adding: the powers must match first." }, { text: "standard form", why: "a × 10ⁿ with 1 ≤ a < 10." }],
      clues: ["Write both as ordinary numbers, or both with 10⁵.", "320 000 + 45 000.", "Write the total in standard form."],
      traps: ["Is the front number between 1 and 10?"],
    },
  },
  {
    id: "ccc1-q12b", source: { paper: SRC, q: "12", part: "b" }, topic: "fracind", tier: "H", calculator: false,
    prompt: "Work out the value of &nbsp;<span class=\"eq\">125<sup>−2/3</sup></span>", promptText: "Work out the value of 125^(−2/3).",
    marks: 2, answer: "1/25", solution: ["Cube root of 125 = 5", "5² = 25", "Negative power: 1/25"], noWorking: "full",
    points: [
      { id: "M1", code: "M1", criterion: "Takes the cube root to get 5, or deals with the negative power as a reciprocal." },
      { id: "A1", code: "A1", dep: ["M1"], criterion: "1/25", accept: ["0.04"], reject: ["−25"] },
    ],
    errors: [{ id: "negative-index", looksLike: "gave −25: a negative power means 'one over', not a negative answer" }],
    dangerZones: [{ id: "neg", when: "the student has found 25", warn: "What does the minus in the power do?" }],
    coach: {
      keyWords: [{ text: "−2/3", why: "Cube root, square, then one over." }],
      clues: ["The 3 on the bottom of the power means cube root.", "Then square it.", "The negative means take the reciprocal."],
      traps: ["Is your answer positive?"],
    },
  },
  {
    id: "ccc1-q13a", source: { paper: SRC, q: "13", part: "a" }, topic: "cumfreq", tier: "H", calculator: false,
    prompt: `The box plot shows information about the test scores of the students in class A.<br>The table shows information about the test scores of the students in class B.${table([["", "Lowest", "Lower quartile", "Median", "Upper quartile", "Highest"], ["Class B", 12, 20, 26, 35, 48]])}On the grid, draw a box plot for the information in the table.<br><small>Sketch the box plot for class B in your working with its five values labelled.</small>`,
    promptText: "Class A box plot: lowest 15, LQ 24, median 30, UQ 34, highest 44. Class B: lowest 12, LQ 20, median 26, UQ 35, highest 48. Draw a box plot for class B.",
    diagram: boxPlots, marks: 2, answer: "Box plot with 12, 20, 26, 35, 48",
    solution: ["Whiskers to 12 and 48", "Box from 20 to 35", "Median line at 26"], noWorking: "full",
    points: [
      { id: "B1a", code: "B1", criterion: "A box with at least three of the five values correct." },
      { id: "B1b", code: "B1", criterion: "Fully correct box plot: whiskers to 12 and 48, box from 20 to 35, median line at 26." },
    ],
    errors: [{ id: "wrong-share", looksLike: "drew the ends of the box at the lowest and highest values" }],
    markerNotes: ["The student can't draw on the printed grid. Accept a sketch with the five values labelled. Mike's B2 (B1 for at least three values) is split into B1a and B1b."],
    dangerZones: [{ id: "box", when: "the student is drawing", warn: "Box from quartile to quartile; whiskers to the ends." }],
    coach: {
      keyWords: [{ text: "box plot", why: "Five values: lowest, LQ, median, UQ, highest." }],
      clues: ["The box goes from the lower quartile to the upper quartile.", "Draw a line across the box at the median.", "Whiskers go out to the lowest and highest."],
      traps: ["Are all five values in the right place?"],
    },
  },
  {
    id: "ccc1-q13b", source: { paper: SRC, q: "13", part: "b" }, topic: "compare", tier: "H", calculator: false,
    prompt: "Compare the distributions of the test scores for class A and class B.",
    promptText: "Class A: lowest 15, LQ 24, median 30, UQ 34, highest 44 (IQR 10). Class B: lowest 12, LQ 20, median 26, UQ 35, highest 48 (IQR 15). Compare the distributions of the test scores for class A and class B.",
    diagram: boxPlots, marks: 2, answer: "Two comparisons in context",
    solution: ["Class A has the higher median (30 compared with 26), so on average class A scored higher", "Class A has the smaller interquartile range (10 compared with 15), so class A's scores were more consistent"], noWorking: "full",
    points: [
      { id: "B1a", code: "B1", criterion: "Compares the medians in context, e.g. class A has the higher median (30 compared with 26), so on average class A scored higher." },
      { id: "B1b", code: "B1", criterion: "Compares the spread in context, e.g. class A has the smaller interquartile range (10 compared with 15), so the scores in class A were more consistent.", accept: ["range comparison in context (29 vs 36)"] },
    ],
    errors: [{ id: "stopped-early", looksLike: "listed values without comparing them, or compared only the highest marks" }],
    markerNotes: ["Each mark needs a comparison word (higher, more consistent) and what it means for the scores. One comparison about an average, one about spread."],
    dangerZones: [{ id: "context", when: "the student is writing a comparison", warn: "Say which is higher and what that means for the scores." }],
    coach: {
      keyWords: [{ text: "Compare", why: "Say which is bigger, and what it means." }],
      clues: ["Make one comparison about an average: the median.", "Make one comparison about spread: the interquartile range.", "For each, say what it means for the test scores."],
      traps: ["Did you use a comparison word and the context?"],
    },
  },
  {
    id: "ccc1-q14a", source: { paper: SRC, q: "14", part: "a" }, topic: "surd", tier: "H", calculator: false,
    prompt: "ABC is a right-angled triangle.<br>AB = 2√3 cm &nbsp;&nbsp; BC = 2 cm &nbsp;&nbsp; Angle ABC = 90°<br>Work out the length of AC.",
    diagram: rightTri, marks: 2, answer: "AC = 4 cm", solution: ["(2√3)² + 2² = 12 + 4 = 16", "AC = 4"], noWorking: "full",
    points: [
      { id: "M1", code: "M1", criterion: "(2√3)² + 2² = 12 + 4" },
      { id: "A1", code: "A1", dep: ["M1"], criterion: "AC = 4" },
    ],
    errors: [{ id: "surd-root", looksLike: "worked out (2√3)² as 6 or 4√3: both the 2 and the √3 are squared, giving 12" }],
    dangerZones: [{ id: "sq", when: "the student is squaring 2√3", warn: "Square the 2 and square the √3." }],
    coach: {
      keyWords: [{ text: "right-angled", why: "Pythagoras." }],
      clues: ["AC is the hypotenuse.", "(2√3)² = 2² × (√3)².", "Add, then square root."],
      traps: ["Did you get 12 for (2√3)²?"],
    },
  },
  {
    id: "ccc1-q14b", source: { paper: SRC, q: "14", part: "b" }, topic: "exacttrig", tier: "H", calculator: false,
    prompt: "Work out the size of angle ACB.",
    promptText: "ABC is right-angled at B. AB = 2√3 cm, BC = 2 cm, AC = 4 cm. Work out the size of angle ACB.",
    diagram: rightTri, marks: 2, answer: "60°", solution: ["tan C = 2√3/2 = √3", "C = 60°"], noWorking: "full",
    points: [
      { id: "M1", code: "M1", criterion: "tan C = 2√3/2 = √3 or cos C = 2/4", accept: ["sin C = 2√3/4"] },
      { id: "A1", code: "A1", dep: ["M1"], criterion: "60°", reject: ["30° (angle BAC)"] },
    ],
    errors: [{ id: "wrong-ratio", looksLike: "used the wrong ratio and got 30°, which is angle BAC" }],
    dangerZones: [{ id: "label", when: "the student is choosing a ratio", warn: "Label opposite, adjacent and hypotenuse from angle C." }],
    coach: {
      keyWords: [{ text: "angle ACB", why: "The angle at C." }],
      clues: ["From C: AB is opposite, BC is adjacent, AC is the hypotenuse.", "cos C = adjacent ÷ hypotenuse = 2/4.", "Which angle has cos = 1/2?"],
      traps: ["Is it the angle at C, not at A?"],
    },
  },
  {
    id: "ccc1-q15", source: { paper: SRC, q: "15" }, topic: "recur", tier: "H", calculator: false,
    prompt: "Write the recurring decimal &nbsp;0.38̇&nbsp; as a fraction in its simplest form.<br>You must show all your working.",
    promptText: "Write the recurring decimal 0.3888… (only the 8 recurs) as a fraction in its simplest form. You must show all your working.",
    marks: 3, answer: "7/18", solution: ["x = 0.3888…", "10x = 3.888…, 100x = 38.888…", "90x = 35", "x = 35/90 = 7/18"], noWorking: "zero",
    showWorking: "This question says 'You must show all your working'.",
    points: [
      { id: "M1a", code: "M1", criterion: "Lets x = 0.3888… and writes 10x = 3.888… and 100x = 38.888…" },
      { id: "M1b", code: "M1", dep: ["M1a"], criterion: "Subtracts: 90x = 35" },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "x = 35/90 = 7/18", reject: ["38/99", "35/90 left unsimplified"] },
    ],
    errors: [
      { id: "recurring-subtract", looksLike: "subtracted two lines where the recurring parts don't line up" },
      { id: "recurring-terminating", looksLike: "treated both digits as recurring and wrote 38/99: only the 8 recurs" },
      { id: "not-simplified", looksLike: "left the answer as 35/90" },
    ],
    dangerZones: [{ id: "line", when: "the student is choosing multiples of x", warn: "Pick two multiples whose recurring parts line up exactly." }],
    coach: {
      keyWords: [{ text: "0.38̇", why: "The dot is only over the 8: 0.3888…" }, { text: "simplest form", why: "Cancel fully." }],
      clues: ["Let x = 0.3888…", "Write 10x and 100x: both end in 0.888…", "Subtract 10x from 100x, solve, and simplify."],
      traps: ["Is only the 8 recurring in your working?"],
    },
  },
  {
    id: "ccc1-q16", source: { paper: SRC, q: "16" }, topic: "similar", tier: "H", calculator: false,
    prompt: "In the diagram, ABD and ACE are straight lines. BC is parallel to DE.<br>AB = 6 cm &nbsp;&nbsp; BD = 3 cm &nbsp;&nbsp; BC = 8 cm<br>Work out the length of DE.",
    diagram: simTri, marks: 3, answer: "DE = 12 cm", solution: ["AD = 6 + 3 = 9", "Scale factor = 9/6 = 1.5", "DE = 8 × 1.5"], noWorking: "full",
    points: [
      { id: "M1a", code: "M1", criterion: "AD = 6 + 3 = 9" },
      { id: "M1b", code: "M1", ft: true, criterion: "Scale factor 9/6 = 1.5, or 8 × 9/6" },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "DE = 12", reject: ["4 (scale factor 3/6)", "11 (adding 3)"] },
    ],
    errors: [
      { id: "wrong-ratio", looksLike: "used BD and AB to get a scale factor of 3/6, giving DE = 4: the large triangle's side is AD, the whole length" },
      { id: "wrong-operation", looksLike: "added 3 to get 11: similar shapes are linked by multiplying, not adding" },
    ],
    dangerZones: [{ id: "whole", when: "the student is finding the scale factor", warn: "The big triangle's side is the whole of AD." }],
    coach: {
      keyWords: [{ text: "BC is parallel to DE", why: "Triangles ABC and ADE are similar." }],
      clues: ["Triangle ABC and triangle ADE are similar.", "AD = AB + BD.", "Scale factor = AD ÷ AB. Multiply BC by it."],
      traps: ["Did you multiply, not add?"],
    },
  },
  {
    id: "ccc1-q17a", source: { paper: SRC, q: "17", part: "a" }, topic: "graphtrans", tier: "H", calculator: false,
    prompt: "The graph of y = f(x) has a minimum point at (2, −3).<br>Write down the coordinates of the minimum point of the graph of &nbsp;y = f(x) + 4",
    marks: 1, answer: "(2, 1)", solution: ["Up 4: (2, −3 + 4)"], noWorking: "full",
    points: [{ id: "B1", code: "B1", criterion: "(2, 1)", reject: ["(6, −3)"] }],
    errors: [{ id: "wrong-direction", looksLike: "changed the x-coordinate instead of the y-coordinate" }],
    dangerZones: [{ id: "which", when: "the student is applying the transformation", warn: "+4 outside the function moves the graph up." }],
    coach: {
      keyWords: [{ text: "f(x) + 4", why: "Adding outside the bracket moves the graph up." }],
      clues: ["f(x) + 4 is a vertical translation.", "Only the y-coordinate changes.", "Add 4 to the y-coordinate."],
      traps: ["Did only the y-coordinate change?"],
    },
  },
  {
    id: "ccc1-q17b", source: { paper: SRC, q: "17", part: "b" }, topic: "graphtrans", tier: "H", calculator: false,
    prompt: "Write down the coordinates of the minimum point of the graph of &nbsp;y = f(x − 3)",
    promptText: "The graph of y = f(x) has a minimum point at (2, −3). Write down the coordinates of the minimum point of the graph of y = f(x − 3).",
    marks: 1, answer: "(5, −3)", solution: ["Right 3: (2 + 3, −3)"], noWorking: "full",
    points: [{ id: "B1", code: "B1", criterion: "(5, −3)", reject: ["(−1, −3)"] }],
    errors: [{ id: "wrong-direction", looksLike: "moved the graph the wrong way to get (−1, −3): f(x − 3) moves it 3 to the right" }],
    dangerZones: [{ id: "dir", when: "the student is applying the transformation", warn: "Inside the bracket works the opposite way to how it looks." }],
    coach: {
      keyWords: [{ text: "f(x − 3)", why: "Inside the bracket: a horizontal translation." }],
      clues: ["f(x − 3) is a horizontal translation.", "Inside the bracket, − 3 moves the graph to the right.", "Add 3 to the x-coordinate."],
      traps: ["Did the graph move right, not left?"],
    },
  },
  {
    id: "ccc1-q17c", source: { paper: SRC, q: "17", part: "c" }, topic: "graphtrans", tier: "H", calculator: false,
    prompt: "Write down the coordinates of the minimum point of the graph of &nbsp;y = f(−x)",
    promptText: "The graph of y = f(x) has a minimum point at (2, −3). Write down the coordinates of the minimum point of the graph of y = f(−x).",
    marks: 1, answer: "(−2, −3)", solution: ["Reflect in the y-axis: (−2, −3)"], noWorking: "full",
    points: [{ id: "B1", code: "B1", criterion: "(−2, −3)", reject: ["(2, 3)"] }],
    errors: [{ id: "wrong-direction", looksLike: "reflected in the x-axis: f(−x) reflects in the y-axis, so only the x-coordinate changes sign" }],
    dangerZones: [{ id: "axis", when: "the student is reflecting", warn: "Which coordinate does −x change?" }],
    coach: {
      keyWords: [{ text: "f(−x)", why: "The minus is on x: a reflection in the y-axis." }],
      clues: ["f(−x) is a reflection.", "It reflects in the y-axis.", "Only the x-coordinate changes sign."],
      traps: ["Did only the x-coordinate change sign?"],
    },
  },
  {
    id: "ccc1-q18", source: { paper: SRC, q: "18" }, topic: "algfrac", tier: "H", calculator: false,
    prompt: `Write &nbsp;<span class="eq">${fr(3, "x + 2")} + ${fr(2, "x − 1")}</span>&nbsp; as a single fraction in its simplest form.`,
    promptText: "Write 3/(x + 2) + 2/(x − 1) as a single fraction in its simplest form.",
    marks: 3, answer: "(5x + 1)/((x + 2)(x − 1))", solution: ["Common denominator (x + 2)(x − 1)", "3(x − 1) + 2(x + 2) = 3x − 3 + 2x + 4", "= (5x + 1)/((x + 2)(x − 1))"], noWorking: "full",
    showWorking: "Write the numerator with brackets before expanding.",
    points: [
      { id: "M1a", code: "M1", criterion: "Uses the common denominator (x + 2)(x − 1)." },
      { id: "M1b", code: "M1", dep: ["M1a"], criterion: "Numerator 3(x − 1) + 2(x + 2)" },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "(5x + 1)/((x + 2)(x − 1))", accept: ["denominator expanded to x² + x − 2"], reject: ["5/(2x + 1)"] },
    ],
    errors: [
      { id: "frac-add", looksLike: "added the tops and the bottoms to get 5/(2x + 1) (scores 0)" },
      { id: "sign-error", looksLike: "sign errors expanding: 3(x − 1) = 3x − 3 and 2(x + 2) = 2x + 4" },
    ],
    dangerZones: [{ id: "common", when: "the student is about to combine", warn: "You need a common denominator first." }],
    coach: {
      keyWords: [{ text: "single fraction", why: "One numerator over one denominator." }],
      clues: ["Use the common denominator (x + 2)(x − 1).", "Multiply each numerator by the other denominator.", "Expand and simplify the top."],
      traps: ["Did you multiply out both numerator brackets correctly?"],
    },
  },
  {
    id: "ccc1-q19", source: { paper: SRC, q: "19" }, topic: "surd", tier: "H", calculator: false,
    prompt: `Write &nbsp;<span class="eq">√75 − √12 + ${fr(6, "√3")}</span>&nbsp; in the form k√3 where k is an integer.<br>You must show all your working.`,
    promptText: "Write √75 − √12 + 6/√3 in the form k√3 where k is an integer. You must show all your working.",
    marks: 3, answer: "5√3", solution: ["√75 = 5√3", "√12 = 2√3", "6/√3 = 6√3/3 = 2√3", "5√3 − 2√3 + 2√3"], noWorking: "zero",
    showWorking: "This question says 'You must show all your working'.",
    points: [
      { id: "M1a", code: "M1", criterion: "√75 = 5√3 or √12 = 2√3" },
      { id: "M1b", code: "M1", criterion: "6/√3 = 6√3/3 = 2√3" },
      { id: "A1", code: "A1", dep: ["M1a", "M1b"], criterion: "5√3 − 2√3 + 2√3 = 5√3" },
    ],
    errors: [
      { id: "surd-root", looksLike: "subtracted under the root to get √63: surds only combine once they're written with the same root" },
      { id: "numerator-not-scaled", looksLike: "wrote 6/√3 as 6√3 or as 2" },
    ],
    dangerZones: [{ id: "simplify", when: "the student is about to combine the surds", warn: "Write each one as a number × √3 first." }],
    coach: {
      keyWords: [{ text: "k√3", why: "Write every term as a multiple of √3." }, { text: "You must show all your working", why: "No working, no marks." }],
      clues: ["75 = 25 × 3 and 12 = 4 × 3.", "Rationalise 6/√3: multiply top and bottom by √3.", "Collect the √3 terms."],
      traps: ["Is every term a multiple of √3 before you add?"],
    },
  },
  {
    id: "ccc1-q20", source: { paper: SRC, q: "20" }, topic: "circthm", tier: "H", calculator: false,
    prompt: "A, B and C are points on a circle, centre O.<br>Angle OBC = 28°<br>Work out the size of angle BAC.<br>Give a reason for each stage of your working.",
    diagram: circOBC, marks: 4, answer: "62°",
    solution: ["Angle OCB = 28° (base angles of an isosceles triangle, OB = OC as radii)", "Angle BOC = 180 − 28 − 28 = 124° (angles in a triangle add up to 180°)", "Angle BAC = 124 ÷ 2 = 62° (angle at the centre is twice the angle at the circumference)"], noWorking: "full",
    showWorking: "Write each angle with its reason.",
    points: [
      { id: "M1a", code: "M1", criterion: "Angle BOC = 180 − 28 − 28 = 124°" },
      { id: "M1b", code: "M1", ft: true, dep: ["M1a"], criterion: "124 ÷ 2" },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "Angle BAC = 62°", reject: ["248 (doubled)", "28"] },
      { id: "B1", code: "B1", criterion: "Reasons: base angles of an isosceles triangle are equal (OB = OC, radii), angles in a triangle add up to 180°, the angle at the centre is twice the angle at the circumference.", reject: ["not saying why triangle OBC is isosceles"] },
    ],
    errors: [
      { id: "wrong-direction", looksLike: "doubled when they should halve: the angle at the circumference is the smaller one" },
      { id: "wrong-share", looksLike: "assumed angle BAC is 28°" },
    ],
    markerNotes: ["The isosceles reason must say why: OB and OC are radii."],
    dangerZones: [
      { id: "iso", when: "the student is finding angle OCB or BOC", warn: "Why is triangle OBC isosceles? Say so." },
      { id: "half", when: "angle BOC has been found", warn: "Centre or circumference: which is the bigger angle?" },
    ],
    coach: {
      keyWords: [{ text: "centre O", why: "OB and OC are radii, so triangle OBC is isosceles." }, { text: "Give a reason for each stage", why: "A mark depends on the reasons." }],
      clues: ["OB = OC (radii), so angle OCB = 28°.", "Find angle BOC using angles in a triangle.", "Angle at the centre is twice the angle at the circumference."],
      traps: ["Did you halve, not double?", "Have you given all three reasons?"],
    },
  },
  {
    id: "ccc1-q21", source: { paper: SRC, q: "21" }, topic: "qineq", tier: "H", calculator: false,
    prompt: "Solve &nbsp;<span class=\"eq\">x<sup>2</sup> > 3x + 10</span>", promptText: "Solve x² > 3x + 10.",
    marks: 4, answer: "x < −2 or x > 5", solution: ["x² − 3x − 10 > 0", "(x − 5)(x + 2) > 0", "Critical values −2 and 5", "x < −2 or x > 5"], noWorking: "full",
    showWorking: "Write the factorised form and the critical values.",
    points: [
      { id: "M1a", code: "M1", criterion: "Rearranges to x² − 3x − 10 > 0" },
      { id: "M1b", code: "M1", ft: true, dep: ["M1a"], criterion: "Factorises: (x − 5)(x + 2)" },
      { id: "A1a", code: "A1", dep: ["M1b"], criterion: "Critical values −2 and 5" },
      { id: "A1b", code: "A1", dep: ["M1b"], criterion: "x < −2 or x > 5", reject: ["−2 < x < 5", "−2 > x > 5", "only x > 5"] },
    ],
    errors: [
      { id: "inequality-region", looksLike: "wrote −2 < x < 5, the region between the critical values" },
      { id: "wrong-form", looksLike: "wrote it as one inequality such as −2 > x > 5, which no number satisfies, or gave only x > 5" },
    ],
    dangerZones: [{ id: "region", when: "the critical values have been found", warn: "Sketch the U-shaped curve: where is it above the axis?" }],
    coach: {
      keyWords: [{ text: ">", why: "Greater than: where the curve is above the axis." }],
      clues: ["Rearrange so one side is 0.", "Factorise and find the critical values.", "Sketch y = x² − 3x − 10: where is it above the x-axis?"],
      traps: ["Is your answer outside the critical values, as two separate inequalities?"],
    },
  },
  {
    id: "ccc1-q22", source: { paper: SRC, q: "22" }, topic: "csq", tier: "H", calculator: false,
    prompt: "Solve &nbsp;<span class=\"eq\">x<sup>2</sup> + 6x − 2 = 0</span><br>Give your answers in the form a ± √b where a and b are integers.",
    promptText: "Solve x² + 6x − 2 = 0. Give your answers in the form a ± √b where a and b are integers.",
    marks: 3, answer: "x = −3 ± √11", solution: ["(x + 3)² − 9 − 2 = 0", "(x + 3)² = 11", "x = −3 ± √11"], noWorking: "full",
    points: [
      { id: "M1a", code: "M1", criterion: "(x + 3)²", accept: ["correct substitution into the quadratic formula: (−6 ± √44)/2"] },
      { id: "M1b", code: "M1", dep: ["M1a"], criterion: "(x + 3)² − 9 − 2 = 0, so (x + 3)² = 11", accept: ["√44 = 2√11 in the formula method"] },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "x = −3 ± √11", reject: ["3 ± √11", "−3 + √11 only"] },
    ],
    errors: [
      { id: "csq-half", looksLike: "forgot to subtract the 9, leading to ± √2" },
      { id: "no-sqrt", looksLike: "took only the positive square root" },
      { id: "sign-error", looksLike: "wrote +3 in the answer instead of −3" },
    ],
    dangerZones: [{ id: "nine", when: "the student has written (x + 3)²", warn: "(x + 3)² gives an extra 9. Take it off." }],
    coach: {
      keyWords: [{ text: "a ± √b", why: "Completing the square gives this form directly." }],
      clues: ["Complete the square: half of 6 is 3.", "(x + 3)² − 9 − 2 = 0.", "Rearrange, square root both sides (±), and subtract 3."],
      traps: ["Did you include ±?"],
    },
  },
  {
    id: "ccc1-q23", source: { paper: SRC, q: "23" }, topic: "aproof", tier: "H", calculator: false,
    prompt: "Prove algebraically that the sum of the squares of any two consecutive odd numbers is always 2 more than a multiple of 8",
    marks: 4, answer: "Proof: the sum is 8n² + 2",
    solution: ["Odd numbers 2n − 1 and 2n + 1", "(2n − 1)² = 4n² − 4n + 1, (2n + 1)² = 4n² + 4n + 1", "Sum = 8n² + 2", "8n² is a multiple of 8, so the sum is 2 more than a multiple of 8"], noWorking: "zero",
    points: [
      { id: "M1a", code: "M1", criterion: "Writes two consecutive odd numbers algebraically, e.g. 2n − 1 and 2n + 1 (or 2n + 1 and 2n + 3).", reject: ["n and n + 2 (not necessarily odd)"] },
      { id: "M1b", code: "M1", dep: ["M1a"], criterion: "Expands both squares: 4n² − 4n + 1 and 4n² + 4n + 1" },
      { id: "A1a", code: "A1", dep: ["M1b"], criterion: "Sum = 8n² + 2 (or 8n² + 16n + 10 = 8(n² + 2n + 1) + 2)." },
      { id: "A1b", code: "A1", dep: ["A1a"], criterion: "Conclusion: 8n² is a multiple of 8, so the sum is 2 more than a multiple of 8." },
    ],
    errors: [
      { id: "wrong-form", looksLike: "used n and n + 2, which aren't necessarily odd, or tested a few pairs of numbers (not a proof, scores 0)" },
      { id: "stopped-early", looksLike: "reached 8n² + 2 and stopped without the concluding sentence" },
    ],
    dangerZones: [
      { id: "odd", when: "the student is choosing expressions", warn: "An odd number must be written as 2n + 1 or 2n − 1." },
      { id: "conclude", when: "8n² + 2 (or similar) has been reached", warn: "Finish with a sentence explaining why." },
    ],
    coach: {
      keyWords: [{ text: "Prove algebraically", why: "Use n. Examples don't count." }, { text: "consecutive odd numbers", why: "2n − 1 and 2n + 1." }],
      clues: ["Write two consecutive odd numbers using n.", "Square each and add.", "Write the result as 8 × (something) + 2 and explain."],
      traps: ["Did you write a concluding sentence?"],
    },
  },
  {
    id: "ccc1-q24", source: { paper: SRC, q: "24" }, topic: "areasin", tier: "H", calculator: false,
    prompt: "The diagram shows a triangle.<br>The area of the triangle is 10 cm<sup>2</sup><br>Work out the value of x.<br>You must show all your working.",
    promptText: "A triangle has sides x cm and (x + 3) cm with an angle of 30° between them. The area of the triangle is 10 cm². Work out the value of x. You must show all your working.",
    diagram: triX30, marks: 4, answer: "x = 5",
    solution: ["½ × x × (x + 3) × sin 30° = 10", "sin 30° = ½, so x(x + 3) = 40", "x² + 3x − 40 = 0, (x + 8)(x − 5) = 0", "x = 5 (x = −8 rejected)"], noWorking: "zero",
    showWorking: "This question says 'You must show all your working'.",
    points: [
      { id: "M1a", code: "M1", criterion: "½ × x × (x + 3) × sin 30° = 10" },
      { id: "M1b", code: "M1", dep: ["M1a"], criterion: "Uses sin 30° = ½ to reach x(x + 3) = 40" },
      { id: "M1c", code: "M1", ft: true, dep: ["M1b"], criterion: "x² + 3x − 40 = 0 and factorises: (x + 8)(x − 5) = 0" },
      { id: "A1", code: "A1", dep: ["M1c"], criterion: "x = 5 (rejecting x = −8).", reject: ["both 5 and −8 given as answers"] },
    ],
    errors: [
      { id: "wrong-formula", looksLike: "used the wrong value for sin 30°" },
      { id: "half", looksLike: "worked out ½ × ½ as 1" },
      { id: "stopped-early", looksLike: "gave both x = 5 and x = −8: a length can't be negative" },
    ],
    dangerZones: [
      { id: "sin", when: "the student has written the area formula", warn: "sin 30° is an exact value you know." },
      { id: "reject", when: "both solutions have been found", warn: "Can a length be negative?" },
    ],
    coach: {
      keyWords: [{ text: "The area of the triangle is 10", why: "Use ½ab sin C = 10." }, { text: "You must show all your working", why: "No working, no marks." }],
      clues: ["Area = ½ × x × (x + 3) × sin 30°.", "sin 30° = ½, so ¼ × x(x + 3) = 10.", "Expand, rearrange to a quadratic = 0, and factorise."],
      traps: ["Did you reject the negative solution?"],
    },
  },
];
