// Cold Case Zero · Higher free sample paper (non-calculator) · all 24 questions, 80 marks (CC-Z/H)
//
// Question wording is copied from the paper. Mark points follow Mike's Cold Case Zero Forensic Mark
// Scheme line for line; errors and Mike-mode danger zones come from its "Where the marks go missing"
// boxes. B3 is split into three B1 points so partial credit still works.
import type { Scheme } from "../schemes.ts";

const fr = (n: string | number, d: string | number) => `<span class="fr"><span>${n}</span><span>${d}</span></span>`;
const SRC = "CC-Z/H";
const TXT = `font-family="Times New Roman,serif" fill="currentColor"`;
const NDA = (x: number, y: number) => `<text x="${x}" y="${y}" font-size="9" text-anchor="middle" fill="currentColor" opacity=".7" font-family="Arial,sans-serif">Not drawn accurately</text>`;
const table = (rows: (string | number)[][], headRow = true) =>
  `<table class="qt">${rows.map((r, i) => `<tr>${r.map((c, j) => ((headRow ? i : j) === 0 ? `<th>${c}</th>` : `<td>${c}</td>`)).join("")}</tr>`).join("")}</table>`;

// ---------- diagrams ----------
const parallel = `<svg viewBox="0 0 280 150" role="img" aria-label="Two parallel horizontal lines crossed by a sloping line. At the top crossing, the angle (3x + 20) degrees is below the top line on the right of the sloping line. At the bottom crossing, the angle (2x + 10) degrees is above the bottom line on the right of the sloping line."><g fill="none" stroke="currentColor" stroke-width="1.5"><path d="M30 35 H250 M30 105 H250 M95 130 L165 10"/><path d="M240 30 L250 35 L240 40 M240 100 L250 105 L240 110"/><path d="M168 35 A18 18 0 0 1 145 50" stroke-width="1.1"/><path d="M128 105 A18 18 0 0 0 117 91" stroke-width="1.1"/></g><g ${TXT} font-size="11"><text x="172" y="56">(3x + 20)°</text><text x="136" y="98">(2x + 10)°</text></g>${NDA(140, 145)}</svg>`;

const rotGrid = (() => {
  const u = 22, pad = 24, px = (x: number) => pad + (x + 5) * u, py = (y: number) => pad + (5 - y) * u;
  const g: string[] = [], t: string[] = [];
  for (let v = -5; v <= 5; v++) { g.push(`M${px(v)} ${py(-5)}V${py(5)}`, `M${px(-5)} ${py(v)}H${px(5)}`); if (v) t.push(`<text x="${px(v)}" y="${py(0) + 13}" text-anchor="middle">${v < 0 ? "−" + -v : v}</text>`, `<text x="${px(0) - 5}" y="${py(v) + 4}" text-anchor="end">${v < 0 ? "−" + -v : v}</text>`); }
  const tri = (p: number[][]) => `<path d="M${p.map(([x, y]) => `${px(x)} ${py(y)}`).join("L")}Z"/>`;
  return `<svg viewBox="0 0 ${10 * u + pad * 2} ${10 * u + pad * 2}" role="img" aria-label="Coordinate grid from −5 to 5. Triangle A has vertices (1, 1), (1, 4) and (3, 1). Triangle B has vertices (1, −1), (4, −1) and (1, −3)."><path d="${g.join("")}" stroke="currentColor" stroke-width=".5" opacity=".35"/><path d="M${px(-5)} ${py(0)}H${px(5) + 8}M${px(0)} ${py(-5)}V${py(5) - 8}" stroke="currentColor" stroke-width="1.3"/><g stroke="currentColor" stroke-width="1.5" fill="currentColor" fill-opacity=".15">${tri([[1, 1], [1, 4], [3, 1]])}${tri([[1, -1], [4, -1], [1, -3]])}</g><g font-size="10" ${TXT}>${t.join("")}<text x="${px(0) - 5}" y="${py(0) + 13}" text-anchor="end">O</text></g><g ${TXT} font-size="13" font-weight="bold"><text x="${px(1.45)}" y="${py(1.6)}">A</text><text x="${px(1.6)}" y="${py(-1.75)}">B</text></g></svg>`;
})();

const capsule = `<svg viewBox="0 0 220 204" role="img" aria-label="A solid made from a cylinder of radius 3 cm and height 10 cm with a hemisphere of radius 3 cm on top."><g fill="none" stroke="currentColor" stroke-width="1.5"><path d="M80 60 A30 30 0 0 1 140 60"/><path d="M80 60 V160 M140 60 V160"/><ellipse cx="110" cy="160" rx="30" ry="8"/><path d="M80 60 A30 8 0 0 0 140 60" /><path d="M80 60 A30 8 0 0 1 140 60" stroke-dasharray="4 3" stroke-width="1"/><path d="M110 160 H140" stroke-width="1.1"/></g><g ${TXT} font-size="12"><text x="148" y="114">10 cm</text><text x="125" y="181" text-anchor="middle" font-size="11">3 cm</text></g>${NDA(110, 196)}</svg>`;

const speedTime = (() => {
  const X = (t: number) => 50 + t * 7, Y = (v: number) => 190 - v * 7;
  const minor: string[] = [], major: string[] = [], lab: string[] = [];
  for (let t = 0; t <= 40; t++) (t % 5 ? minor : major).push(`M${X(t)} ${Y(0)}V${Y(25)}`);
  for (let v = 0; v <= 25; v++) (v % 5 ? minor : major).push(`M${X(0)} ${Y(v)}H${X(40)}`);
  for (let t = 0; t <= 40; t += 5) lab.push(`<text x="${X(t)}" y="${Y(0) + 15}" text-anchor="middle">${t}</text>`);
  for (let v = 5; v <= 25; v += 5) lab.push(`<text x="44" y="${Y(v) + 4}" text-anchor="end">${v}</text>`);
  return `<svg viewBox="0 0 350 230" role="img" aria-label="Speed–time graph. Speed rises steadily from 0 to 20 m/s over the first 10 seconds, stays at 20 m/s until 30 seconds, then falls steadily to 0 at 40 seconds."><path d="${minor.join("")}" stroke="currentColor" stroke-width=".35" opacity=".3" fill="none"/><path d="${major.join("")}" stroke="currentColor" stroke-width=".7" opacity=".55" fill="none"/><polyline points="${X(0)},${Y(0)} ${X(10)},${Y(20)} ${X(30)},${Y(20)} ${X(40)},${Y(0)}" fill="none" stroke="currentColor" stroke-width="1.8"/><g font-size="11" ${TXT}>${lab.join("")}<text x="190" y="225" text-anchor="middle">Time (seconds)</text><text transform="translate(14 105) rotate(-90)" text-anchor="middle">Speed (m/s)</text></g></svg>`;
})();

const cosAxes = `<svg viewBox="0 0 340 160" role="img" aria-label="Empty axes for a sketch: x from 0 to 360 degrees with marks at 90, 180, 270 and 360; y from −1 to 1."><path d="M40 20H310M40 140H310M107.5 15V145M175 15V145M242.5 15V145M310 15V145" stroke="currentColor" stroke-width=".5" opacity=".35"/><path d="M40 80H318M40 150V10" stroke="currentColor" stroke-width="1.3" fill="none"/><g ${TXT} font-size="11"><text x="107.5" y="94" text-anchor="middle">90°</text><text x="175" y="94" text-anchor="middle">180°</text><text x="242.5" y="94" text-anchor="middle">270°</text><text x="310" y="94" text-anchor="middle">360°</text><text x="34" y="24" text-anchor="end">1</text><text x="34" y="144" text-anchor="end">−1</text><text x="34" y="84" text-anchor="end">O</text><text x="322" y="84" font-style="italic">x</text><text x="44" y="10" font-style="italic">y</text></g></svg>`;

const tangents = `<svg viewBox="0 0 290 200" role="img" aria-label="A circle with centre O. PA and PB are tangents from the point P on the right, touching the circle at A (top) and B (bottom). C is on the circle on the left. O is joined to A and B, and C is joined to A and B. Angle APB is 48 degrees."><circle cx="120" cy="95" r="60" fill="none" stroke="currentColor" stroke-width="1.5"/><g fill="none" stroke="currentColor" stroke-width="1.4"><path d="M260 95 L133.6 28.4 M260 95 L133.6 161.6 M145.7 40.8 L120 95 L145.7 149.2 M145.7 40.8 L60 95 L145.7 149.2"/><path d="M240 84.5 A22 22 0 0 0 240 105.5" stroke-width="1.1"/></g><g ${TXT} font-size="13"><text x="128" y="30" font-style="italic">A</text><text x="128" y="172" font-style="italic">B</text><text x="46" y="99" font-style="italic">C</text><text x="106" y="99" font-style="italic">O</text><text x="264" y="99" font-style="italic">P</text><text x="214" y="99" font-size="11">48°</text></g>${NDA(150, 194)}</svg>`;

const TRAVEL = table([["", "Walk", "Bus", "Car", "Total"], ["Boys", 12, "", "", ""], ["Girls", "", 16, 9, 45], ["Total", "", 30, "", 80]]);
const TRAVEL_T = "Two-way table (walk, bus, car, total) for 80 students: Boys walk 12; Girls bus 16, car 9, total 45; Total bus 30, overall 80. Other cells blank.";
const PLANTS = "Here are the heights, in cm, of 11 plants. The heights are in order: 3, 5, 6, 8, 9, 11, 12, 14, 15, 18, 20.";
const CAR = "Speed–time graph for part of a car journey: speed rises from 0 to 20 m/s over the first 10 s, stays at 20 m/s until 30 s, then falls to 0 at 40 s.";

export const COLD_CASE_ZERO: Scheme[] = [
  {
    id: "ccz-q1", source: { paper: SRC, q: "1" }, topic: "fracmul", tier: "H", calculator: false,
    prompt: `Work out &nbsp;<span class="eq">3${fr(3, 4)} ÷ 2${fr(1, 2)}</span><br>Give your answer as a mixed number in its simplest form.`,
    promptText: "Work out 3 3/4 ÷ 2 1/2. Give your answer as a mixed number in its simplest form.",
    marks: 3, answer: "1 1/2", solution: ["15/4 ÷ 5/2", "= 15/4 × 2/5", "= 30/20 = 3/2", "= 1 1/2"], noWorking: "full",
    showWorking: "Write both as improper fractions, then the 'flip and multiply' line.",
    points: [
      { id: "M1a", code: "M1", criterion: "Converts both to improper fractions: 15/4 and 5/2" },
      { id: "M1b", code: "M1", ft: true, dep: ["M1a"], criterion: "Multiplies by the reciprocal: 15/4 × 2/5", reject: ["flipping the first fraction"] },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "1 1/2", reject: ["30/20 or 3/2 (not a mixed number)"] },
    ],
    errors: [
      { id: "wrong-operation", looksLike: "turned the wrong fraction upside down, or divided the whole numbers and fractions separately" },
      { id: "wrong-form", looksLike: "left the answer as 30/20 or 3/2" },
    ],
    dangerZones: [{ id: "flip", when: "the student is about to divide", warn: "Flip only the second fraction, then multiply." }],
    coach: {
      keyWords: [{ text: "÷", why: "Dividing fractions: multiply by the reciprocal." }, { text: "mixed number", why: "Convert back at the end." }],
      clues: ["Change both to improper fractions.", "Dividing by 5/2 is the same as multiplying by 2/5.", "Multiply, simplify, and write as a mixed number."],
      traps: ["Is your answer a mixed number in its simplest form?"],
    },
  },
  {
    id: "ccz-q2", source: { paper: SRC, q: "2" }, topic: "hcf", tier: "H", calculator: false,
    prompt: "Bus A leaves the bus station every 18 minutes.<br>Bus B leaves the bus station every 24 minutes.<br>Bus A and bus B both leave the bus station at 08 00<br>Work out the next time that bus A and bus B both leave the bus station at the same time.",
    marks: 3, answer: "09 12", solution: ["Multiples of 18: 18, 36, 54, 72", "Multiples of 24: 24, 48, 72", "LCM = 72 minutes = 1 hour 12 minutes", "08 00 + 1 h 12 min"], noWorking: "full",
    points: [
      { id: "M1", code: "M1", criterion: "Lists multiples of 18 and 24, or uses prime factors." },
      { id: "A1a", code: "A1", dep: ["M1"], criterion: "Lowest common multiple = 72 minutes", reject: ["432 (18 × 24)", "6 (HCF)"] },
      { id: "A1b", code: "A1", dep: ["M1"], criterion: "09 12 (accept 9.12 am)", reject: ["08 72", "09 20", "08 06"] },
    ],
    errors: [
      { id: "hcf-lcm", looksLike: "found the highest common factor (6) and answered 08 06" },
      { id: "stopped-early", looksLike: "used 18 × 24 = 432, a common multiple but not the lowest" },
      { id: "wrong-form", looksLike: "wrote 72 minutes after 08 00 as 08 72 or 09 20: 72 minutes is 1 hour 12 minutes" },
    ],
    dangerZones: [{ id: "time", when: "72 minutes has been found", warn: "How many hours and minutes is 72 minutes?" }],
    coach: {
      keyWords: [{ text: "next time", why: "The first time they coincide again: the LCM." }],
      clues: ["List multiples of 18 and of 24.", "Find the first number in both lists.", "Add that many minutes to 08 00."],
      traps: ["Did you convert the minutes into hours and minutes?"],
    },
  },
  {
    id: "ccz-q3", source: { paper: SRC, q: "3" }, topic: "lin", tier: "H", calculator: false,
    prompt: `Solve &nbsp;<span class="eq">${fr("x + 1", 2)} + ${fr("x − 2", 3)} = 4</span>`,
    promptText: "Solve (x + 1)/2 + (x − 2)/3 = 4.",
    marks: 3, answer: "x = 5", solution: ["3(x + 1) + 2(x − 2) = 24", "3x + 3 + 2x − 4 = 24", "5x − 1 = 24"], noWorking: "full",
    points: [
      { id: "M1a", code: "M1", criterion: "Multiplies through by 6: 3(x + 1) + 2(x − 2) = 24", reject: ["right-hand side left as 4"] },
      { id: "M1b", code: "M1", ft: true, dep: ["M1a"], criterion: "5x − 1 = 24" },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "x = 5" },
    ],
    errors: [
      { id: "missed-term", looksLike: "didn't multiply the right-hand side by 6 (left it as 4)" },
      { id: "sign-error", looksLike: "expanded 2(x − 2) as 2x − 2" },
    ],
    markerNotes: ["Check: 6/2 + 3/3 = 3 + 1 = 4."],
    dangerZones: [{ id: "rhs", when: "the student is multiplying through by 6", warn: "Every term, including the 4 on the right." }],
    coach: {
      keyWords: [{ text: "Solve", why: "Clear the fractions first." }],
      clues: ["Multiply every term by 6.", "3(x + 1) + 2(x − 2) = 24.", "Expand, collect, solve."],
      traps: ["Did the 4 get multiplied by 6?"],
    },
  },
  {
    id: "ccz-q4", source: { paper: SRC, q: "4" }, topic: "pct", tier: "H", calculator: false,
    prompt: "Sara buys 40 mugs for £2.50 each.<br>She sells 30 of the mugs for £4 each.<br>She sells the other 10 mugs for £1.50 each.<br>Work out Sara's percentage profit.",
    marks: 4, answer: "35%", solution: ["Cost = 40 × 2.50 = £100", "Income = 30 × 4 + 10 × 1.50 = £135", "Profit £35; 35/100 × 100"], noWorking: "full",
    showWorking: "Write the cost, the income, and the profit as a fraction of the cost.",
    points: [
      { id: "M1a", code: "M1", criterion: "Total cost = 40 × 2.50 = £100" },
      { id: "M1b", code: "M1", criterion: "Total income = 30 × 4 + 10 × 1.50 = £135" },
      { id: "M1c", code: "M1", ft: true, dep: ["M1a", "M1b"], criterion: "35/100 × 100" },
      { id: "A1", code: "A1", dep: ["M1c"], criterion: "35", reject: ["25.9 (divided by income)", "135"] },
    ],
    errors: [
      { id: "reverse-pct", looksLike: "divided the profit by the income (135) instead of the cost" },
      { id: "stopped-early", looksLike: "gave 135%, the income as a percentage of the cost" },
    ],
    dangerZones: [{ id: "base", when: "the profit has been found", warn: "Percentage profit is measured against what was paid." }],
    coach: {
      keyWords: [{ text: "percentage profit", why: "Profit as a percentage of the cost." }],
      clues: ["Find the total cost and the total income.", "Profit = income − cost.", "Profit ÷ cost × 100."],
      traps: ["Did you divide by the cost?"],
    },
  },
  {
    id: "ccz-q5", source: { paper: SRC, q: "5" }, topic: "parallel", tier: "H", calculator: false,
    prompt: "The diagram shows two parallel lines and a straight line that crosses them.<br>Work out the value of x.<br>Give a reason for your answer.",
    promptText: "Two parallel lines are crossed by a straight line. The angles (3x + 20)° and (2x + 10)° are co-interior (on the same side, between the parallel lines). Work out the value of x and give a reason.",
    diagram: parallel, marks: 3, answer: "x = 30", solution: ["3x + 20 + 2x + 10 = 180 (co-interior angles add up to 180°)", "5x + 30 = 180", "x = 30"], noWorking: "full",
    points: [
      { id: "M1", code: "M1", criterion: "3x + 20 + 2x + 10 = 180", reject: ["3x + 20 = 2x + 10"] },
      { id: "A1", code: "A1", dep: ["M1"], criterion: "x = 30", reject: ["−10"] },
      { id: "B1", code: "B1", criterion: "Reason: co-interior angles add up to 180° (accept allied angles).", reject: ["'C angles'"] },
    ],
    errors: [
      { id: "wrong-formula", looksLike: "set the two angles equal, as if alternate or corresponding, giving x = −10" },
      { id: "wrong-form", looksLike: "gave the reason as 'C angles': the mark needs co-interior or allied" },
    ],
    dangerZones: [{ id: "which", when: "the student is writing an equation", warn: "Are these angles equal, or do they add to 180°?" }],
    coach: {
      keyWords: [{ text: "parallel lines", why: "Look for alternate, corresponding or co-interior angles." }, { text: "Give a reason", why: "Use the proper name." }],
      clues: ["Both angles are between the parallel lines, on the same side.", "Co-interior angles add up to 180°.", "Write the equation and solve."],
      traps: ["Did you name the angle fact properly?"],
    },
  },
  {
    id: "ccz-q6a", source: { paper: SRC, q: "6", part: "a" }, topic: "twoway", tier: "H", calculator: false,
    prompt: `80 students were asked how they travel to school.<br>Each student either walks, travels by bus or travels by car.<br>The two-way table shows some information about their answers.${TRAVEL}Complete the two-way table.<br><small>Write the missing values in your working, saying which cell each one goes in.</small>`,
    promptText: `${TRAVEL_T} Complete the two-way table.`,
    marks: 3, answer: "Boys 12, 14, 9, total 35; girls 20, 16, 9, total 45; totals 32, 30, 18, 80",
    solution: ["Girls walk = 45 − 16 − 9 = 20", "Boys bus = 30 − 16 = 14", "Boys total = 80 − 45 = 35, so boys car = 35 − 12 − 14 = 9", "Totals: walk 32, car 18"], noWorking: "full",
    points: [
      { id: "B1a", code: "B1", criterion: "Two or three of the six missing entries correct (boys bus 14, boys car 9, boys total 35, girls walk 20, total walk 32, total car 18)." },
      { id: "B1b", code: "B1", criterion: "Four or five of the six missing entries correct." },
      { id: "B1c", code: "B1", criterion: "All six entries correct." },
    ],
    errors: [{ id: "stopped-early", looksLike: "didn't check that every row and column adds up to its total" }],
    markerNotes: ["Mike's scheme is B3 (B2 for four or five, B1 for two or three): award B1a, B1b, B1c cumulatively. Accept the values written with their cells named, or a redrawn table."],
    dangerZones: [{ id: "check", when: "the table has been filled", warn: "Check every row and every column adds to its total." }],
    coach: {
      keyWords: [{ text: "two-way table", why: "Rows and columns both add up to their totals." }],
      clues: ["Start with a row or column that has only one gap.", "Girls: 45 − 16 − 9.", "Boys' total is 80 − 45; then fill the rest."],
      traps: ["Does every row and column add up?"],
    },
  },
  {
    id: "ccz-q6b", source: { paper: SRC, q: "6", part: "b" }, topic: "twoway", tier: "H", calculator: false,
    prompt: "One of the girls is chosen at random.<br>Find the probability that this girl walks to school.",
    promptText: `${TRAVEL_T} (Girls who walk = 20.) One of the girls is chosen at random. Find the probability that this girl walks to school.`,
    marks: 2, answer: "20/45", solution: ["20 of the 45 girls walk", "20/45 = 4/9"], noWorking: "full",
    points: [
      { id: "M1", code: "M1", criterion: "A fraction with denominator 45." },
      { id: "A1", code: "A1", dep: ["M1"], criterion: "20/45 oe", accept: ["4/9"], reject: ["20/80", "20/32"] },
    ],
    errors: [{ id: "wrong-denominator", looksLike: "used 80 (all students) or 32 (all walkers) as the denominator" }],
    dangerZones: [{ id: "girls", when: "the student is writing the denominator", warn: "The choice is from the girls only." }],
    coach: {
      keyWords: [{ text: "One of the girls", why: "Choose from the 45 girls only." }],
      clues: ["The denominator is the number of girls.", "How many girls walk?", "Write it as a fraction."],
      traps: ["Is your denominator 45?"],
    },
  },
  {
    id: "ccz-q7a", source: { paper: SRC, q: "7", part: "a" }, topic: "nthlin", tier: "H", calculator: false,
    prompt: "Here are the first four terms of an arithmetic sequence.<br><span class=\"eq\">5 &nbsp;&nbsp; 8 &nbsp;&nbsp; 11 &nbsp;&nbsp; 14</span><br>Find an expression, in terms of n, for the nth term of the sequence.",
    promptText: "Arithmetic sequence: 5, 8, 11, 14. Find an expression, in terms of n, for the nth term.",
    marks: 2, answer: "3n + 2", solution: ["Common difference 3, so 3n", "3 × 1 = 3, and 5 − 3 = 2"], noWorking: "full",
    points: [
      { id: "B1a", code: "B1", criterion: "3n" },
      { id: "B1b", code: "B1", criterion: "3n + 2", reject: ["n + 3", "3n + 5"] },
    ],
    errors: [
      { id: "nth-term", looksLike: "wrote n + 3, the term-to-term rule" },
      { id: "nth-zero", looksLike: "wrote 3n + 5, using the first term as the constant" },
    ],
    dangerZones: [{ id: "const", when: "the student has 3n", warn: "Compare 3n with the sequence to find the constant." }],
    coach: {
      keyWords: [{ text: "nth term", why: "A rule using n." }],
      clues: ["The terms go up by 3, so start with 3n.", "3n gives 3, 6, 9, 12.", "What do you add to get 5, 8, 11, 14?"],
      traps: ["Does n = 1 give 5?"],
    },
  },
  {
    id: "ccz-q7b", source: { paper: SRC, q: "7", part: "b" }, topic: "nthlin", tier: "H", calculator: false,
    prompt: "Is 152 a term in the sequence? You must show how you get your answer.",
    promptText: "Arithmetic sequence 5, 8, 11, 14 with nth term 3n + 2. Is 152 a term in the sequence? You must show how you get your answer.",
    marks: 2, answer: "Yes, it is the 50th term", solution: ["3n + 2 = 152", "3n = 150, n = 50", "n is a whole number, so yes"], noWorking: "zero",
    points: [
      { id: "M1", code: "M1", ft: true, criterion: "3n + 2 = 152" },
      { id: "A1", code: "A1", dep: ["M1"], criterion: "n = 50, a whole number, so 152 is in the sequence.", reject: ["'yes' with no working (scores 0)"] },
    ],
    errors: [{ id: "stopped-early", looksLike: "answered 'yes' with no working, or found n = 50 without saying it's a whole number" }],
    dangerZones: [{ id: "conclude", when: "n = 50 has been found", warn: "Say why that proves it: is n a whole number?" }],
    coach: {
      keyWords: [{ text: "You must show how you get your answer", why: "'Yes' alone scores 0." }],
      clues: ["Set your nth term equal to 152.", "Solve for n.", "If n is a whole number, it's a term. Say so."],
      traps: ["Did you write a conclusion?"],
    },
  },
  {
    id: "ccz-q8", source: { paper: SRC, q: "8" }, topic: "sdp", tier: "H", calculator: false,
    prompt: `A box exerts a force of 240 newtons on a table.<br>The base of the box is a rectangle measuring 0.6 m by 0.5 m.<br><span class="eq">pressure = ${fr("force", "area")}</span><br>Work out the pressure that the box exerts on the table.`,
    promptText: "A box exerts a force of 240 newtons on a table. The base is a rectangle 0.6 m by 0.5 m. Pressure = force ÷ area. Work out the pressure.",
    marks: 3, answer: "800 N/m²", solution: ["Area = 0.6 × 0.5 = 0.3 m²", "240 ÷ 0.3 = 2400 ÷ 3"], noWorking: "full",
    points: [
      { id: "M1a", code: "M1", criterion: "Area = 0.6 × 0.5 = 0.3 m²", reject: ["3 or 0.03"] },
      { id: "M1b", code: "M1", ft: true, criterion: "240 ÷ 0.3", reject: ["240 × 0.3"] },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "800", reject: ["80"] },
    ],
    errors: [
      { id: "rounding", looksLike: "worked out 0.6 × 0.5 as 3 or 0.03" },
      { id: "rearrange", looksLike: "multiplied by 0.3, or divided by 0.3 wrongly to get 80: dividing by 0.3 is the same as 2400 ÷ 3" },
    ],
    dangerZones: [{ id: "decimal", when: "the student is dividing by 0.3", warn: "Make the divisor a whole number: 2400 ÷ 3." }],
    coach: {
      keyWords: [{ text: "pressure", why: "Force ÷ area." }],
      clues: ["Find the area of the base.", "0.6 × 0.5 = 0.3 m².", "Divide 240 by 0.3: multiply both by 10 first."],
      traps: ["Is your answer bigger than 240? Dividing by less than 1 makes it bigger."],
    },
  },
  {
    id: "ccz-q9", source: { paper: SRC, q: "9" }, topic: "linineq", tier: "H", calculator: false,
    prompt: "Solve &nbsp;<span class=\"eq\">3(x − 2) ≤ 5x + 4</span>",
    marks: 3, answer: "x ≥ −5", solution: ["3x − 6 ≤ 5x + 4", "−10 ≤ 2x", "x ≥ −5"], noWorking: "full",
    points: [
      { id: "M1a", code: "M1", criterion: "Expands: 3x − 6 ≤ 5x + 4" },
      { id: "M1b", code: "M1", ft: true, dep: ["M1a"], criterion: "−10 ≤ 2x or −2x ≤ 10" },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "x ≥ −5", reject: ["x ≤ −5", "x = −5"] },
    ],
    errors: [
      { id: "inequality-region", looksLike: "divided by −2 and didn't reverse the inequality sign, giving x ≤ −5" },
      { id: "wrong-form", looksLike: "replaced the inequality sign with an equals sign" },
    ],
    dangerZones: [{ id: "neg", when: "the student is about to divide by a negative", warn: "Dividing by a negative flips the sign. Or keep x positive." }],
    coach: {
      keyWords: [{ text: "≤", why: "Keep the inequality sign all the way through." }],
      clues: ["Expand the bracket.", "Collect x terms on the side where they stay positive.", "Divide, keeping the sign the right way."],
      traps: ["Did you flip the sign if you divided by a negative?"],
    },
  },
  {
    id: "ccz-q10", source: { paper: SRC, q: "10" }, topic: "sf", tier: "H", calculator: false,
    prompt: "Work out &nbsp;<span class=\"eq\">(8 × 10<sup>6</sup>) ÷ (2 × 10<sup>−3</sup>)</span><br>Give your answer in standard form.",
    promptText: "Work out (8 × 10^6) ÷ (2 × 10^−3). Give your answer in standard form.",
    marks: 2, answer: "4 × 10⁹", solution: ["8 ÷ 2 = 4", "10⁶ ÷ 10⁻³ = 10⁹"], noWorking: "full",
    points: [
      { id: "M1", code: "M1", criterion: "8 ÷ 2 = 4 or 10^(6 − (−3)) = 10⁹" },
      { id: "A1", code: "A1", dep: ["M1"], criterion: "4 × 10⁹", reject: ["4 × 10³"] },
    ],
    errors: [{ id: "negative-index", looksLike: "worked out 6 − 3 = 3: subtracting a negative power means adding" }],
    dangerZones: [{ id: "index", when: "the student is dividing the powers", warn: "6 − (−3): careful with the double negative." }],
    coach: {
      keyWords: [{ text: "÷", why: "Dividing powers: subtract the indices." }, { text: "standard form", why: "a × 10ⁿ." }],
      clues: ["Divide the front numbers.", "Subtract the powers: 6 − (−3).", "Minus a negative is plus."],
      traps: ["Is the power 9?"],
    },
  },
  {
    id: "ccz-q11", source: { paper: SRC, q: "11" }, topic: "sdp", tier: "H", calculator: false,
    prompt: "Change a speed of 72 km/h into m/s.",
    marks: 2, answer: "20 m/s", solution: ["72 km/h = 72 000 m per hour", "÷ 3600 s"], noWorking: "full",
    points: [
      { id: "M1", code: "M1", criterion: "72 × 1000 or ÷ 3600 (or ÷ 3.6)." },
      { id: "A1", code: "A1", dep: ["M1"], criterion: "20", reject: ["1200 (÷ 60 only once)", "259.2 (× 3.6)"] },
    ],
    errors: [
      { id: "stopped-early", looksLike: "divided by 60 only once, giving 1200 (metres per minute)" },
      { id: "rearrange", looksLike: "multiplied by 3.6 instead of dividing" },
    ],
    markerNotes: ["Sense check: 72 km/h is about 20 metres every second."],
    dangerZones: [{ id: "time", when: "the student is converting hours", warn: "An hour is 3600 seconds." }],
    coach: {
      keyWords: [{ text: "m/s", why: "Metres every second." }],
      clues: ["Change km to m: × 1000.", "Change per hour to per second: ÷ 3600.", "Or simply ÷ 3.6."],
      traps: ["Is your m/s value smaller than 72?"],
    },
  },
  {
    id: "ccz-q12a", source: { paper: SRC, q: "12", part: "a" }, topic: "cumfreq", tier: "H", calculator: false,
    prompt: "Here are the heights, in cm, of 11 plants. The heights are in order.<br><span class=\"eq\">3 &nbsp; 5 &nbsp; 6 &nbsp; 8 &nbsp; 9 &nbsp; 11 &nbsp; 12 &nbsp; 14 &nbsp; 15 &nbsp; 18 &nbsp; 20</span><br>Write down the median height.",
    promptText: `${PLANTS} Write down the median height.`,
    marks: 1, answer: "11 cm", solution: ["6th value of 11"], noWorking: "full",
    points: [{ id: "B1", code: "B1", criterion: "11" }],
    errors: [{ id: "wrong-average", looksLike: "gave the wrong middle value" }],
    dangerZones: [{ id: "mid", when: "the student is finding the median", warn: "11 values: the middle one is the 6th." }],
    coach: {
      keyWords: [{ text: "median", why: "The middle value." }],
      clues: ["The values are already in order.", "With 11 values the middle is the 6th.", "Count along to it."],
      traps: ["Did you count to the 6th value?"],
    },
  },
  {
    id: "ccz-q12b", source: { paper: SRC, q: "12", part: "b" }, topic: "cumfreq", tier: "H", calculator: false,
    prompt: "Work out the interquartile range of the heights.", promptText: `${PLANTS} Work out the interquartile range of the heights.`,
    marks: 2, answer: "9 cm", solution: ["Lower quartile = 3rd value = 6", "Upper quartile = 9th value = 15", "15 − 6"], noWorking: "full",
    points: [
      { id: "M1", code: "M1", criterion: "Lower quartile = 6 (3rd value) or upper quartile = 15 (9th value)." },
      { id: "A1", code: "A1", dep: ["M1"], criterion: "15 − 6 = 9", reject: ["17 (the range)"] },
    ],
    errors: [
      { id: "wrong-average", looksLike: "gave the range (20 − 3 = 17)" },
      { id: "stopped-early", looksLike: "gave the two quartiles without subtracting" },
      { id: "wrong-share", looksLike: "counted to the wrong positions: for 11 values the quartiles are the 3rd and 9th" },
    ],
    dangerZones: [{ id: "pos", when: "the student is finding the quartiles", warn: "For 11 values, which positions are the quartiles?" }],
    coach: {
      keyWords: [{ text: "interquartile range", why: "Upper quartile − lower quartile." }],
      clues: ["The lower quartile is the 3rd value.", "The upper quartile is the 9th value.", "Subtract."],
      traps: ["Did you use the quartiles, not the ends?"],
    },
  },
  {
    id: "ccz-q13", source: { paper: SRC, q: "13" }, topic: "transform", tier: "H", calculator: false,
    prompt: "The diagram shows triangle <b>A</b> and triangle <b>B</b> on a coordinate grid.<br>Describe fully the single transformation that maps triangle <b>A</b> onto triangle <b>B</b>.",
    promptText: "Triangle A has vertices (1, 1), (1, 4), (3, 1). Triangle B has vertices (1, −1), (4, −1), (1, −3). Describe fully the single transformation that maps triangle A onto triangle B.",
    diagram: rotGrid, marks: 3, answer: "Rotation, 90° clockwise, centre (0, 0)", solution: ["Rotation", "90° clockwise", "about (0, 0)"], noWorking: "full",
    points: [
      { id: "B1a", code: "B1", criterion: "Rotation", reject: ["'turn'"] },
      { id: "B1b", code: "B1", criterion: "90° clockwise (or 270° anticlockwise)." },
      { id: "B1c", code: "B1", criterion: "Centre (0, 0) (accept 'about the origin')." },
    ],
    errors: [
      { id: "stopped-early", looksLike: "left out the angle, the direction or the centre" },
      { id: "wrong-form", looksLike: "wrote 'turn' instead of 'rotation', or described two transformations (scores 0)" },
    ],
    markerNotes: ["Mark each fact independently. Two transformations score 0."],
    dangerZones: [{ id: "full", when: "the student has named the transformation", warn: "A rotation needs an angle, a direction and a centre." }],
    coach: {
      keyWords: [{ text: "Describe fully", why: "Rotation: angle, direction and centre." }, { text: "single transformation", why: "One only." }],
      clues: ["Same size and shape, turned: a rotation.", "Which way, and by how much?", "Which point stays fixed? Try the origin."],
      traps: ["Have you given the angle, direction and centre?"],
    },
  },
  {
    id: "ccz-q14", source: { paper: SRC, q: "14" }, topic: "fracind", tier: "H", calculator: false,
    prompt: "Work out the value of &nbsp;<span class=\"eq\">16<sup>3/4</sup> × 3<sup>−2</sup></span>", promptText: "Work out the value of 16^(3/4) × 3^(−2).",
    marks: 3, answer: "8/9", solution: ["16^(3/4) = 2³ = 8", "3⁻² = 1/9", "8 × 1/9"], noWorking: "full",
    points: [
      { id: "M1a", code: "M1", criterion: "16^(3/4) = 2³ = 8" },
      { id: "M1b", code: "M1", criterion: "3⁻² = 1/9" },
      { id: "A1", code: "A1", dep: ["M1a", "M1b"], criterion: "8/9" },
    ],
    errors: [
      { id: "fractional-index", looksLike: "worked out 16 × 3/4 = 12" },
      { id: "negative-index", looksLike: "wrote 3⁻² as −9 or −6: a negative power means 'one over'" },
    ],
    dangerZones: [{ id: "neg", when: "the student is working on 3⁻²", warn: "Negative power: one over." }],
    coach: {
      keyWords: [{ text: "3/4", why: "Fourth root, then cube." }, { text: "−2", why: "One over 3²." }],
      clues: ["The fourth root of 16 is 2.", "Cube it.", "3⁻² = 1 ÷ 3². Multiply."],
      traps: ["Is your answer positive?"],
    },
  },
  {
    id: "ccz-q15", source: { paper: SRC, q: "15" }, topic: "simlin", tier: "H", calculator: false,
    prompt: "3 adult tickets and 2 child tickets cost a total of £31<br>2 adult tickets and 5 child tickets cost a total of £39<br>Work out the cost of one adult ticket and the cost of one child ticket.",
    marks: 4, answer: "Adult £7, child £5", solution: ["3a + 2c = 31 and 2a + 5c = 39", "15a + 10c = 155 and 4a + 10c = 78", "11a = 77, a = 7", "c = 5"], noWorking: "full",
    showWorking: "Write both equations and the elimination step.",
    points: [
      { id: "M1a", code: "M1", criterion: "Forms both equations: 3a + 2c = 31 and 2a + 5c = 39" },
      { id: "M1b", code: "M1", ft: true, dep: ["M1a"], criterion: "Makes one pair of coefficients equal and eliminates, e.g. 15a + 10c = 155 and 4a + 10c = 78, so 11a = 77" },
      { id: "A1a", code: "A1", dep: ["M1b"], criterion: "Adult ticket £7" },
      { id: "A1b", code: "A1", dep: ["M1b"], criterion: "Child ticket £5" },
    ],
    errors: [
      { id: "sign-error", looksLike: "subtraction slip when eliminating" },
      { id: "stopped-early", looksLike: "found one price and stopped" },
    ],
    markerNotes: ["Check: 3 × 7 + 2 × 5 = 31 and 2 × 7 + 5 × 5 = 39. Trial and improvement only scores if checked in both statements."],
    dangerZones: [{ id: "both", when: "one price has been found", warn: "Now find the other, and check both statements." }],
    coach: {
      keyWords: [{ text: "cost of one adult ticket and the cost of one child ticket", why: "Two unknowns: two answers." }],
      clues: ["Write two equations with a and c.", "Make the c coefficients match: × 5 and × 2.", "Subtract, solve for a, then substitute back."],
      traps: ["Do both prices work in both statements?"],
    },
  },
  {
    id: "ccz-q16", source: { paper: SRC, q: "16" }, topic: "volcone", tier: "H", calculator: false,
    prompt: "A solid is made from a cylinder and a hemisphere.<br>The cylinder has radius 3 cm and height 10 cm.<br>The hemisphere has radius 3 cm.<br>Work out the total volume of the solid.<br>Give your answer in terms of π.",
    diagram: capsule, marks: 3, answer: "108π cm³", solution: ["Cylinder: π × 3² × 10 = 90π", "Hemisphere: ½ × 4/3 × π × 3³ = 18π", "Total 108π"], noWorking: "full",
    points: [
      { id: "M1a", code: "M1", criterion: "Cylinder: π × 3² × 10 = 90π" },
      { id: "M1b", code: "M1", criterion: "Hemisphere: ½ × 4/3 × π × 3³ = 18π", reject: ["36π (whole sphere)"] },
      { id: "A1", code: "A1", dep: ["M1a", "M1b"], criterion: "108π", reject: ["126π", "339.1… (π replaced)"] },
    ],
    errors: [
      { id: "half", looksLike: "used the volume of a whole sphere (36π), giving 126π" },
      { id: "wrong-formula", looksLike: "used r² in the sphere formula" },
      { id: "wrong-form", looksLike: "multiplied out π as 3.14 when the question asks for an answer in terms of π" },
    ],
    dangerZones: [{ id: "hemi", when: "the student is using the sphere formula", warn: "Hemisphere: half a sphere." }],
    coach: {
      keyWords: [{ text: "hemisphere", why: "Half a sphere." }, { text: "in terms of π", why: "Leave π in." }],
      clues: ["Cylinder volume = πr²h.", "Sphere volume = 4/3 πr³: halve it.", "Add the two, keeping π."],
      traps: ["Did you halve the sphere?"],
    },
  },
  {
    id: "ccz-q17a", source: { paper: SRC, q: "17", part: "a" }, topic: "gradarea", tier: "H", calculator: false,
    prompt: "Here is a speed–time graph for part of a car journey.<br>Work out the acceleration of the car during the first 10 seconds.",
    promptText: `${CAR} Work out the acceleration of the car during the first 10 seconds.`,
    diagram: speedTime, marks: 1, answer: "2 m/s²", solution: ["Gradient = 20 ÷ 10"], noWorking: "full",
    points: [{ id: "B1", code: "B1", criterion: "Gradient = 20 ÷ 10 = 2", reject: ["0.5 (10 ÷ 20)"] }],
    errors: [{ id: "swapped", looksLike: "divided the wrong way round (10 ÷ 20): acceleration is change in speed over time" }],
    dangerZones: [{ id: "grad", when: "the student is working out the gradient", warn: "Change in speed ÷ time taken." }],
    coach: {
      keyWords: [{ text: "acceleration", why: "The gradient of a speed–time graph." }],
      clues: ["Look at the first 10 seconds.", "The speed goes from 0 to 20 m/s.", "Divide the change in speed by the time."],
      traps: ["Is it speed ÷ time?"],
    },
  },
  {
    id: "ccz-q17b", source: { paper: SRC, q: "17", part: "b" }, topic: "gradarea", tier: "H", calculator: false,
    prompt: "Work out the total distance the car travels in the 40 seconds.",
    promptText: `${CAR} Work out the total distance the car travels in the 40 seconds.`,
    diagram: speedTime, marks: 3, answer: "600 m", solution: ["½ × 10 × 20 = 100", "20 × 20 = 400", "½ × 10 × 20 = 100", "Total 600 m"], noWorking: "full",
    points: [
      { id: "M1a", code: "M1", criterion: "A method for the area under the graph: trapezium ½(20 + 40) × 20, or triangles and rectangle." },
      { id: "M1b", code: "M1", dep: ["M1a"], criterion: "A fully correct calculation: 100 + 400 + 100" },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "600", reject: ["800 (40 × 20)"] },
    ],
    errors: [{ id: "wrong-formula", looksLike: "worked out 40 × 20 = 800, as if at 20 m/s the whole time: distance is the area under the graph" }],
    dangerZones: [{ id: "area", when: "the student starts", warn: "Distance is the area under the graph." }],
    coach: {
      keyWords: [{ text: "total distance", why: "The area under the speed–time graph." }],
      clues: ["Split the shape into two triangles and a rectangle.", "Or use the trapezium formula.", "Add the areas."],
      traps: ["Did you include all three parts?"],
    },
  },
  {
    id: "ccz-q18", source: { paper: SRC, q: "18" }, topic: "triple", tier: "H", calculator: false,
    prompt: "Expand and simplify &nbsp;<span class=\"eq\">(2x + 1)(x − 3)(x + 2)</span>",
    marks: 3, answer: "2x³ − x² − 13x − 6", solution: ["(x − 3)(x + 2) = x² − x − 6", "(2x + 1)(x² − x − 6) = 2x³ − 2x² − 12x + x² − x − 6", "= 2x³ − x² − 13x − 6"], noWorking: "full",
    showWorking: "Expand two brackets first and write that line.",
    points: [
      { id: "M1a", code: "M1", criterion: "Expands two of the brackets, e.g. x² − x − 6 or 2x² − 5x − 3." },
      { id: "M1b", code: "M1", ft: true, dep: ["M1a"], criterion: "Multiplies by the third bracket, with at least four of the six terms correct." },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "2x³ − x² − 13x − 6" },
    ],
    errors: [
      { id: "sign-error", looksLike: "sign errors when multiplying by a negative term" },
      { id: "missed-term", looksLike: "missed a term in the second expansion: there should be six terms before simplifying" },
    ],
    dangerZones: [{ id: "six", when: "the student is multiplying by the third bracket", warn: "Six terms before you simplify." }],
    coach: {
      keyWords: [{ text: "Expand and simplify", why: "Multiply out fully, then collect." }],
      clues: ["Expand two brackets first: (x − 3)(x + 2).", "Multiply each term by 2x and by 1.", "Collect like terms."],
      traps: ["Check the constant: 1 × −3 × 2."],
    },
  },
  {
    id: "ccz-q19", source: { paper: SRC, q: "19" }, topic: "cond", tier: "H", calculator: false,
    prompt: `There are 3 red counters and n blue counters in a bag.<br>Tom takes two counters from the bag at random, without replacement.<br>The probability that both counters are red is &nbsp;<span class="eq">${fr(1, 12)}</span><br>Work out the value of n.<br>You must show all your working.`,
    promptText: "There are 3 red counters and n blue counters in a bag. Tom takes two counters at random, without replacement. The probability that both are red is 1/12. Work out the value of n. You must show all your working.",
    marks: 4, answer: "n = 6", solution: ["3/(n + 3) × 2/(n + 2) = 1/12", "(n + 3)(n + 2) = 72", "n² + 5n − 66 = 0, (n + 11)(n − 6) = 0", "n = 6"], noWorking: "zero",
    showWorking: "This question says 'You must show all your working'.",
    points: [
      { id: "M1a", code: "M1", criterion: "3/(n + 3) × 2/(n + 2)", reject: ["3/(n + 3) × 3/(n + 3)"] },
      { id: "M1b", code: "M1", dep: ["M1a"], criterion: "Sets equal to 1/12 and reaches (n + 3)(n + 2) = 72" },
      { id: "M1c", code: "M1", ft: true, dep: ["M1b"], criterion: "n² + 5n − 66 = 0 and factorises (n + 11)(n − 6) = 0 (or spots that 9 × 8 = 72)." },
      { id: "A1", code: "A1", dep: ["M1c"], criterion: "n = 6", reject: ["9 (total counters)"] },
    ],
    errors: [
      { id: "replacement", looksLike: "put the counter back: used 3/(n + 3) × 3/(n + 3)" },
      { id: "wrong-share", looksLike: "answered 9, the total number of counters, when the question asks for n" },
    ],
    dangerZones: [{ id: "second", when: "the student is writing the second probability", warn: "One red is gone: how many reds and how many counters now?" }],
    coach: {
      keyWords: [{ text: "without replacement", why: "The second fraction has one fewer on top and bottom." }, { text: "value of n", why: "The blue counters, not the total." }],
      clues: ["P(red then red) = 3/(n + 3) × 2/(n + 2).", "Set it equal to 1/12 and cross-multiply.", "Solve the quadratic: two consecutive numbers that multiply to 72."],
      traps: ["Is your answer n, not n + 3?"],
    },
  },
  {
    id: "ccz-q20", source: { paper: SRC, q: "20" }, topic: "surd", tier: "H", calculator: false,
    prompt: `Write &nbsp;<span class="eq">${fr("6 + √8", "√2")}</span>&nbsp; in the form a + b√2 where a and b are integers.<br>You must show all your working.`,
    promptText: "Write (6 + √8)/√2 in the form a + b√2 where a and b are integers. You must show all your working.",
    marks: 3, answer: "2 + 3√2", solution: ["× √2/√2: (6√2 + √16)/2", "= (6√2 + 4)/2", "= 3√2 + 2"], noWorking: "zero",
    showWorking: "This question says 'You must show all your working'.",
    points: [
      { id: "M1a", code: "M1", criterion: "Multiplies the numerator and denominator by √2, or splits into 6/√2 + √8/√2." },
      { id: "M1b", code: "M1", dep: ["M1a"], criterion: "(6√2 + 4)/2 or 3√2 + √4" },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "2 + 3√2" },
    ],
    errors: [
      { id: "surd-root", looksLike: "worked out √8 × √2 as 10 or 8: it's √16 = 4" },
      { id: "numerator-not-scaled", looksLike: "divided only one of the two terms in the numerator by 2" },
    ],
    dangerZones: [{ id: "both", when: "the student is dividing by 2", warn: "Both terms on top get divided." }],
    coach: {
      keyWords: [{ text: "a + b√2", why: "Rationalise, then simplify." }, { text: "You must show all your working", why: "No working, no marks." }],
      clues: ["Multiply top and bottom by √2.", "√8 × √2 = √16.", "Divide both terms by 2."],
      traps: ["Did you divide both terms?"],
    },
  },
  {
    id: "ccz-q21a", source: { paper: SRC, q: "21", part: "a" }, topic: "graphshape", tier: "H", calculator: false,
    prompt: "On the axes, sketch the graph of &nbsp;y = cos x&nbsp; for 0° ≤ x ≤ 360°<br><small>Sketch your own axes in your working, with the key points marked.</small>",
    promptText: "Sketch the graph of y = cos x for 0° ≤ x ≤ 360° (axes: x 0 to 360°, y −1 to 1).",
    diagram: cosAxes, marks: 2, answer: "Cosine curve from (0, 1) down to (180, −1) and back to (360, 1)", solution: ["Starts at (0, 1)", "Crosses at 90° and 270°", "Minimum (180, −1), ends at (360, 1)"], noWorking: "full",
    points: [
      { id: "B1a", code: "B1", criterion: "Curve starts at (0, 1), falls to (180, −1) and returns to (360, 1).", reject: ["sine curve starting at (0, 0)"] },
      { id: "B1b", code: "B1", criterion: "Smooth curve crossing the x-axis at 90° and 270°.", reject: ["straight-line zig-zag"] },
    ],
    errors: [
      { id: "wrong-formula", looksLike: "drew the sine curve, which starts at (0, 0)" },
      { id: "wrong-form", looksLike: "joined the points with straight lines to make a zig-zag" },
    ],
    markerNotes: ["The student sketches on a blank page. Judge the shape and the key points labelled."],
    dangerZones: [{ id: "start", when: "the student starts the sketch", warn: "Where does cos start at x = 0?" }],
    coach: {
      keyWords: [{ text: "cos x", why: "Starts at 1, not 0." }, { text: "sketch", why: "Right shape and key points." }],
      clues: ["cos 0° = 1.", "It crosses the axis at 90° and 270°.", "Lowest at (180, −1), back to 1 at 360°."],
      traps: ["Is it a smooth curve, starting at 1?"],
    },
  },
  {
    id: "ccz-q21b", source: { paper: SRC, q: "21", part: "b" }, topic: "graphshape", tier: "H", calculator: false,
    prompt: "Solve &nbsp;cos x = 0.5 &nbsp;for 0° ≤ x ≤ 360°",
    marks: 2, answer: "60° and 300°", solution: ["cos 60° = 0.5", "By symmetry, 360 − 60 = 300°"], noWorking: "full",
    points: [
      { id: "B1a", code: "B1", criterion: "60°" },
      { id: "B1b", code: "B1", criterion: "300°", reject: ["120°"] },
    ],
    errors: [{ id: "stopped-early", looksLike: "gave only 60°, or 120° as the second answer: by symmetry it's 360 − 60 = 300°" }],
    dangerZones: [{ id: "second", when: "60° has been found", warn: "The cosine graph is symmetrical about 180°." }],
    coach: {
      keyWords: [{ text: "0° ≤ x ≤ 360°", why: "Look for every solution." }],
      clues: ["cos 60° = 0.5 is an exact value.", "The cos graph is symmetrical about 180°.", "Second solution = 360 − first."],
      traps: ["Have you found two solutions?"],
    },
  },
  {
    id: "ccz-q22", source: { paper: SRC, q: "22" }, topic: "circthm", tier: "H", calculator: false,
    prompt: "A, B and C are points on a circle, centre O.<br>PA and PB are tangents to the circle.<br>Angle APB = 48°<br>Work out the size of angle ACB.<br>Give a reason for each stage of your working.",
    diagram: tangents, marks: 4, answer: "66°", solution: ["Angles OAP and OBP = 90° (tangent perpendicular to radius)", "Angle AOB = 360 − 90 − 90 − 48 = 132° (angles in a quadrilateral)", "Angle ACB = 132 ÷ 2 = 66° (angle at centre is twice angle at circumference)"], noWorking: "full",
    showWorking: "Write each angle with its reason.",
    points: [
      { id: "M1a", code: "M1", criterion: "Angle OAP = 90° or angle OBP = 90°" },
      { id: "M1b", code: "M1", ft: true, dep: ["M1a"], criterion: "Angle AOB = 360 − 90 − 90 − 48 = 132°" },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "Angle ACB = 132 ÷ 2 = 66°", reject: ["264 (doubled)", "48"] },
      { id: "B1", code: "B1", criterion: "Reasons: the tangent to a circle is perpendicular to the radius, angles in a quadrilateral add up to 360°, the angle at the centre is twice the angle at the circumference." },
    ],
    errors: [
      { id: "wrong-share", looksLike: "assumed angle AOB is 48°" },
      { id: "wrong-direction", looksLike: "doubled 132 when it should be halved" },
      { id: "stopped-early", looksLike: "missing reasons: each of the three steps needs one" },
    ],
    dangerZones: [
      { id: "ninety", when: "the student starts", warn: "What angle does a tangent make with a radius?" },
      { id: "half", when: "angle AOB has been found", warn: "Centre or circumference: which is bigger?" },
    ],
    coach: {
      keyWords: [{ text: "tangents", why: "Each meets its radius at 90°." }, { text: "Give a reason for each stage", why: "A mark depends on the reasons." }],
      clues: ["OAPB is a quadrilateral with two 90° angles.", "Angle AOB = 360 − 90 − 90 − 48.", "Angle at the centre is twice the angle at the circumference."],
      traps: ["Did you halve?", "Three reasons?"],
    },
  },
  {
    id: "ccz-q23", source: { paper: SRC, q: "23" }, topic: "simquad", tier: "H", calculator: false,
    prompt: "Solve algebraically the simultaneous equations<br><span class=\"eq\">y = x<sup>2</sup> − 3x + 1</span><br><span class=\"eq\">y = 2x − 5</span>",
    promptText: "Solve algebraically the simultaneous equations y = x² − 3x + 1 and y = 2x − 5.",
    marks: 4, answer: "x = 2, y = −1 and x = 3, y = 1", solution: ["x² − 3x + 1 = 2x − 5", "x² − 5x + 6 = 0", "(x − 2)(x − 3) = 0", "x = 2, y = −1; x = 3, y = 1"], noWorking: "zero",
    showWorking: "'Solve algebraically' means the working must be shown.",
    points: [
      { id: "M1a", code: "M1", criterion: "Equates: x² − 3x + 1 = 2x − 5" },
      { id: "M1b", code: "M1", ft: true, dep: ["M1a"], criterion: "x² − 5x + 6 = 0" },
      { id: "M1c", code: "M1", ft: true, dep: ["M1b"], criterion: "Factorises: (x − 2)(x − 3) = 0" },
      { id: "A1", code: "A1", dep: ["M1c"], criterion: "x = 2, y = −1 and x = 3, y = 1, correctly paired." },
    ],
    errors: [
      { id: "sign-error", looksLike: "sign slip moving 2x − 5 across: it becomes −2x + 5" },
      { id: "stopped-early", looksLike: "found the two x values and stopped" },
    ],
    dangerZones: [
      { id: "move", when: "the student is rearranging to = 0", warn: "Moving 2x − 5 across changes both signs." },
      { id: "ys", when: "both x values have been found", warn: "Use y = 2x − 5 to find each y." },
    ],
    coach: {
      keyWords: [{ text: "Solve algebraically", why: "Show the algebra." }],
      clues: ["Set the two expressions for y equal.", "Rearrange to a quadratic = 0 and factorise.", "Use y = 2x − 5 to find each y."],
      traps: ["Is each x paired with its y?"],
    },
  },
  {
    id: "ccz-q24", source: { paper: SRC, q: "24" }, topic: "aproof", tier: "H", calculator: false,
    prompt: "Prove algebraically that the difference between the squares of any two consecutive integers is equal to the sum of the two integers.",
    marks: 3, answer: "Proof: both equal 2n + 1", solution: ["Integers n and n + 1", "(n + 1)² − n² = n² + 2n + 1 − n² = 2n + 1", "n + (n + 1) = 2n + 1", "Both are 2n + 1, so they are equal"], noWorking: "zero",
    points: [
      { id: "M1a", code: "M1", criterion: "Writes consecutive integers as n and n + 1 and forms (n + 1)² − n²" },
      { id: "M1b", code: "M1", dep: ["M1a"], criterion: "Expands and simplifies to 2n + 1", reject: ["(n + 1)² = n² + 1"] },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "Shows that the sum n + (n + 1) is also 2n + 1, with a conclusion." },
    ],
    errors: [
      { id: "missed-term", looksLike: "expanded (n + 1)² as n² + 1" },
      { id: "stopped-early", looksLike: "reached 2n + 1 and stopped: the sum must also be shown to be 2n + 1, with a conclusion" },
      { id: "wrong-form", looksLike: "used numbers instead of algebra" },
    ],
    dangerZones: [{ id: "sum", when: "2n + 1 has been reached", warn: "Now show the sum is the same, and say so." }],
    coach: {
      keyWords: [{ text: "Prove algebraically", why: "Use n. Examples don't count." }, { text: "sum of the two integers", why: "Show this equals the difference too." }],
      clues: ["Call the integers n and n + 1.", "Expand (n + 1)² − n² and simplify.", "Work out n + (n + 1) and compare."],
      traps: ["Did you conclude that the two are equal?"],
    },
  },
];
