// Cold Case C · Higher Paper 3 (calculator) · all 22 questions, 80 marks (CC-C/3H)
//
// Question wording is copied from the paper. Mark points follow Mike's Cold Case C Paper 3 Forensic
// Mark Scheme line for line; errors and Mike-mode danger zones come from its "Where the marks go
// missing" boxes.
import type { Scheme } from "../schemes.ts";

const fr = (n: string | number, d: string | number) => `<span class="fr"><span>${n}</span><span>${d}</span></span>`;
const SRC = "CC-C/3H";
const TXT = `font-family="Times New Roman,serif" fill="currentColor"`;
const NDA = (x: number, y: number) => `<text x="${x}" y="${y}" font-size="9" text-anchor="middle" fill="currentColor" opacity=".7" font-family="Arial,sans-serif">Not drawn accurately</text>`;

// A graph on graph paper: x from 0 to xMax, y from 0 to yMax, with labelled major lines and a polyline.
function graph(o: { xMax: number; yMax: number; xMajor: number; yMajor: number; xMinor: number; yMinor: number; xLabel: string; yLabel: string; pts: number[][]; aria: string }) {
  const W = 280, H = 200, L = 50, T = 12;
  const X = (x: number) => +(L + (x / o.xMax) * W).toFixed(1), Y = (y: number) => +(T + H - (y / o.yMax) * H).toFixed(1);
  const minor: string[] = [], major: string[] = [], lab: string[] = [];
  for (let x = 0; x <= o.xMax + 1e-9; x += o.xMinor) (Math.abs(x / o.xMajor - Math.round(x / o.xMajor)) < 1e-9 ? major : minor).push(`M${X(x)} ${Y(0)}V${Y(o.yMax)}`);
  for (let y = 0; y <= o.yMax + 1e-9; y += o.yMinor) (Math.abs(y / o.yMajor - Math.round(y / o.yMajor)) < 1e-9 ? major : minor).push(`M${X(0)} ${Y(y)}H${X(o.xMax)}`);
  for (let x = 0; x <= o.xMax; x += o.xMajor) lab.push(`<text x="${X(x)}" y="${Y(0) + 15}" text-anchor="middle">${x}</text>`);
  for (let y = 0; y <= o.yMax; y += o.yMajor) lab.push(`<text x="${L - 6}" y="${Y(y) + 4}" text-anchor="end">${y}</text>`);
  return `<svg viewBox="0 0 345 250" role="img" aria-label="${o.aria}"><path d="${minor.join("")}" stroke="currentColor" stroke-width=".35" opacity=".3" fill="none"/><path d="${major.join("")}" stroke="currentColor" stroke-width=".7" opacity=".55" fill="none"/><polyline points="${o.pts.map(([x, y]) => `${X(x)},${Y(y)}`).join(" ")}" fill="none" stroke="currentColor" stroke-width="1.8"/><g font-size="11" ${TXT}>${lab.join("")}<text x="${L + W / 2}" y="245" text-anchor="middle">${o.xLabel}</text><text transform="translate(13 ${T + H / 2}) rotate(-90)" text-anchor="middle">${o.yLabel}</text></g></svg>`;
}

const speedTime = graph({ xMax: 28, yMax: 14, xMajor: 4, yMajor: 2, xMinor: 2, yMinor: 1, xLabel: "Time (seconds)", yLabel: "Speed (m/s)", pts: [[0, 0], [8, 12], [20, 12], [26, 0]], aria: "Speed–time graph. Speed rises steadily from 0 to 12 m/s over the first 8 seconds, stays at 12 m/s until 20 seconds, then falls steadily to 0 at 26 seconds." });
const cfMarks = graph({ xMax: 70, yMax: 120, xMajor: 10, yMajor: 20, xMinor: 2, yMinor: 4, xLabel: "Mark", yLabel: "Cumulative frequency", pts: [[0, 0], [10, 6], [20, 20], [30, 44], [40, 78], [50, 102], [60, 114], [70, 120]], aria: "Cumulative frequency graph for 120 students' marks, joining (0, 0), (10, 6), (20, 20), (30, 44), (40, 78), (50, 102), (60, 114) and (70, 120)." });

const squareCircle = `<svg viewBox="0 0 220 210" role="img" aria-label="A square with sides 8 cm drawn inside a circle, with all four corners on the circle. The four regions between the square and the circle are shaded."><path fill-rule="evenodd" d="M30.8 100 A79.2 79.2 0 1 0 189.2 100 A79.2 79.2 0 1 0 30.8 100 Z M54 44 H166 V156 H54 Z" fill="currentColor" fill-opacity=".18" stroke="currentColor" stroke-width="1.5"/><text x="110" y="172" text-anchor="middle" font-size="12" ${TXT}>8 cm</text>${NDA(110, 202)}</svg>`;

const triBAC = `<svg viewBox="0 0 300 160" role="img" aria-label="Triangle ABC with AC along the bottom, 9.8 cm. AB is 7.4 cm and angle BAC is 54 degrees."><path d="M30 130 L270 130 L137 23 Z" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M58 130 A28 28 0 0 0 46 107" fill="none" stroke="currentColor" stroke-width="1.1"/><g ${TXT} font-size="12"><text x="133" y="16" font-style="italic">B</text><text x="18" y="134" font-style="italic">A</text><text x="274" y="134" font-style="italic">C</text><text x="76" y="72" text-anchor="end">7.4 cm</text><text x="62" y="122">54°</text><text x="150" y="146" text-anchor="middle">9.8 cm</text></g>${NDA(150, 158)}</svg>`;

const pyramid = `<svg viewBox="0 0 260 200" role="img" aria-label="Square-based pyramid VABCD. V is above the centre O of the base. AB = 10 cm and the vertical height VO = 12 cm."><g fill="none" stroke="currentColor" stroke-width="1.5"><path d="M40 160 L170 160 L225 115 M40 160 L130 20 L170 160 M130 20 L225 115"/><path d="M40 160 L95 115 L225 115 M95 115 L130 20 M130 20 V138 M40 160 L225 115 M95 115 L170 160" stroke-dasharray="4 3" stroke-width="1"/></g><g ${TXT} font-size="12"><text x="126" y="14" font-style="italic">V</text><text x="28" y="172" font-style="italic">A</text><text x="172" y="174" font-style="italic">B</text><text x="230" y="118" font-style="italic">C</text><text x="82" y="112" font-style="italic">D</text><text x="134" y="150" font-style="italic">O</text><text x="135" y="80">12 cm</text><text x="105" y="176" text-anchor="middle">10 cm</text></g>${NDA(130, 194)}</svg>`;

const kite = `<svg viewBox="0 0 220 210" role="img" aria-label="Kite ABCD with A at the top, B on the left, D on the right and C at the bottom. AB = AD (one dash each) and CB = CD (two dashes each). The diagonal AC is drawn."><g fill="none" stroke="currentColor" stroke-width="1.5"><path d="M110 15 L50 60 L110 175 L170 60 Z M110 15 V175"/><path d="M77 32 l6 8 M143 32 l-6 8 M74 112 l8 -4 M77 118 l8 -4 M146 112 l-8 -4 M143 118 l-8 -4" stroke-width="1.2"/></g><g ${TXT} font-size="13" font-style="italic"><text x="106" y="11">A</text><text x="36" y="62">B</text><text x="176" y="62">D</text><text x="106" y="192">C</text></g>${NDA(110, 206)}</svg>`;

const BULBS = "A factory tests a sample of 250 light bulbs. 12 of the bulbs are faulty.";
const CF = "The cumulative frequency graph shows information about the marks of 120 students in an exam.";
const POP = "The population of a town is 48 500. The population is falling by 2.5% each year.";
const TRI = "ABC is a triangle with AB = 7.4 cm, AC = 9.8 cm and angle BAC = 54°.";

export const COLD_CASE_C3: Scheme[] = [
  {
    id: "ccc3-q1a", source: { paper: SRC, q: "1", part: "a" }, topic: "pfd", tier: "H", calculator: true,
    prompt: "Write 360 as a product of its prime factors.",
    marks: 2, answer: "2³ × 3² × 5", solution: ["360 = 2 × 180 = 2 × 2 × 90 = 2 × 2 × 2 × 45", "45 = 3 × 3 × 5", "360 = 2³ × 3² × 5"], noWorking: "full",
    points: [
      { id: "M1", code: "M1", criterion: "A factor tree or repeated division with at least two correct steps." },
      { id: "A1", code: "A1", dep: ["M1"], criterion: "2³ × 3² × 5", accept: ["2 × 2 × 2 × 3 × 3 × 5"], reject: ["2, 3, 5 with no multiplication signs or powers"] },
    ],
    errors: [{ id: "wrong-form", looksLike: "listed the prime factors 2, 3, 5 with no multiplication signs or powers" }],
    dangerZones: [{ id: "product", when: "all the primes have been found", warn: "Write them as a product, with every repeat included." }],
    coach: {
      keyWords: [{ text: "product", why: "Multiplied together, with × signs." }, { text: "prime factors", why: "Every number must be prime." }],
      clues: ["Use a factor tree: 360 = 2 × 180.", "Keep splitting until every branch is prime.", "Write the primes multiplied together, using powers for repeats."],
      traps: ["Does your product multiply back to 360?"],
    },
  },
  {
    id: "ccc3-q1b", source: { paper: SRC, q: "1", part: "b" }, topic: "hcf", tier: "H", calculator: true,
    prompt: "Find the highest common factor (HCF) of 360 and 252",
    marks: 2, answer: "36", solution: ["360 = 2³ × 3² × 5", "252 = 2² × 3² × 7", "HCF = 2² × 3² = 36"], noWorking: "full",
    points: [
      { id: "M1", code: "M1", criterion: "252 = 2² × 3² × 7 (or lists of factors of both numbers)." },
      { id: "A1", code: "A1", dep: ["M1"], criterion: "36", reject: ["12 or 18 (common, not highest)"] },
    ],
    errors: [{ id: "stopped-early", looksLike: "gave a common factor that isn't the highest, such as 12 or 18" }],
    dangerZones: [{ id: "lowest", when: "both prime factorisations are written", warn: "Take the lowest power of each prime that's in both." }],
    coach: {
      keyWords: [{ text: "highest common factor", why: "The biggest number that divides both." }],
      clues: ["Write 252 as a product of primes.", "Which primes are in both numbers?", "Take each shared prime with its lower power and multiply."],
      traps: ["Does your answer divide both numbers exactly?"],
    },
  },
  {
    id: "ccc3-q2", source: { paper: SRC, q: "2" }, topic: "ratio", tier: "H", calculator: true,
    prompt: "A watch costs $330 in New York and €295 in Madrid.<br>The exchange rates are £1 = $1.27 and £1 = €1.16<br>In which city is the watch cheaper, and by how much? Give your answer in pounds.",
    marks: 4, answer: "Madrid, by £5.53", solution: ["New York: 330 ÷ 1.27 = £259.84", "Madrid: 295 ÷ 1.16 = £254.31", "259.84 − 254.31 = £5.53", "Madrid, by £5.53"], noWorking: "full",
    showWorking: "Write each price in pounds before comparing.",
    points: [
      { id: "M1a", code: "M1", criterion: "330 ÷ 1.27 = 259.84", reject: ["330 × 1.27"] },
      { id: "M1b", code: "M1", criterion: "295 ÷ 1.16 = 254.31" },
      { id: "M1c", code: "M1", ft: true, dep: ["M1a", "M1b"], criterion: "Subtracts their two prices in pounds." },
      { id: "A1", code: "A1", dep: ["M1c"], criterion: "Madrid and £5.53", reject: ["£35 (330 − 295)"] },
    ],
    errors: [
      { id: "wrong-operation", looksLike: "multiplied by the exchange rates: £1 buys more than one dollar or euro, so divide" },
      { id: "no-bounds", looksLike: "compared 330 with 295 directly and said Madrid is £35 cheaper" },
    ],
    dangerZones: [{ id: "divide", when: "the student is converting a price", warn: "Should the price in pounds be a bigger or smaller number?" }],
    coach: {
      keyWords: [{ text: "Give your answer in pounds", why: "Convert both prices to pounds first." }],
      clues: ["Convert each price to pounds.", "£1 = $1.27, so divide dollars by 1.27.", "Divide euros by 1.16, then compare."],
      traps: ["Did you name the city and give the difference?"],
    },
  },
  {
    id: "ccc3-q3", source: { paper: SRC, q: "3" }, topic: "lin", tier: "H", calculator: true,
    prompt: "Solve &nbsp;<span class=\"eq\">3(2x − 5) = 4(x + 3) − 7</span>",
    marks: 3, answer: "x = 10", solution: ["6x − 15 = 4x + 12 − 7", "6x − 15 = 4x + 5", "2x = 20"], noWorking: "full",
    points: [
      { id: "M1a", code: "M1", criterion: "Expands both brackets: 6x − 15 = 4x + 12 − 7", reject: ["−28 (the −7 multiplied by 4)", "6x − 5"] },
      { id: "M1b", code: "M1", ft: true, dep: ["M1a"], criterion: "2x = 20" },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "x = 10" },
    ],
    errors: [{ id: "missed-term", looksLike: "multiplied the −7 by 4 (it's outside the bracket), or expanded 3(2x − 5) as 6x − 5" }],
    markerNotes: ["Check: 3 × 15 = 45 and 4 × 13 − 7 = 45."],
    dangerZones: [{ id: "expand", when: "the student is expanding the brackets", warn: "Multiply every term inside, and leave the −7 alone." }],
    coach: {
      keyWords: [{ text: "Solve", why: "Find x." }],
      clues: ["Expand both brackets.", "The −7 is outside the bracket: don't multiply it.", "Collect x terms on one side and numbers on the other."],
      traps: ["Put x back in: do both sides match?"],
    },
  },
  {
    id: "ccc3-q4", source: { paper: SRC, q: "4" }, topic: "polygon", tier: "H", calculator: true,
    prompt: "The four angles of a quadrilateral are<br><span class=\"eq\">x° &nbsp;&nbsp; (2x + 15)° &nbsp;&nbsp; (3x − 20)° &nbsp;&nbsp; 95°</span><br>Work out the size of the largest angle of the quadrilateral.",
    promptText: "The four angles of a quadrilateral are x°, (2x + 15)°, (3x − 20)° and 95°. Work out the size of the largest angle of the quadrilateral.",
    marks: 3, answer: "115°", solution: ["x + 2x + 15 + 3x − 20 + 95 = 360", "6x + 90 = 360, x = 45", "Angles 45, 105, 115, 95: largest 115°"], noWorking: "full",
    points: [
      { id: "M1a", code: "M1", criterion: "x + 2x + 15 + 3x − 20 + 95 = 360", reject: ["= 180"] },
      { id: "M1b", code: "M1", dep: ["M1a"], criterion: "6x + 90 = 360, so x = 45" },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "115 (the angles are 45, 105, 115 and 95).", reject: ["45 (x)"] },
    ],
    errors: [
      { id: "wrong-formula", looksLike: "used 180 for the angle sum: a quadrilateral's angles add up to 360" },
      { id: "stopped-early", looksLike: "stopped at x = 45: the question asks for the largest angle" },
    ],
    dangerZones: [{ id: "largest", when: "x = 45 has been found", warn: "Work out every angle, then pick the largest." }],
    coach: {
      keyWords: [{ text: "quadrilateral", why: "Angles add up to 360°." }, { text: "largest angle", why: "Not x: find all four angles." }],
      clues: ["Add the four angles and set them equal to 360.", "Simplify and solve for x.", "Substitute x into each expression."],
      traps: ["Is your answer an angle, not x?"],
    },
  },
  {
    id: "ccc3-q5a", source: { paper: SRC, q: "5", part: "a" }, topic: "relfreq", tier: "H", calculator: true,
    prompt: `${BULBS}<br>Write down an estimate for the probability that a bulb made by the factory is faulty.`,
    marks: 1, answer: "12/250", solution: ["12/250 = 0.048"], noWorking: "full",
    points: [{ id: "B1", code: "B1", criterion: "12/250 oe (0.048 or 4.8%).", reject: ["12 : 250 (a ratio, scores 0)"] }],
    errors: [{ id: "wrong-form", looksLike: "wrote the probability as a ratio such as 12 : 250" }],
    dangerZones: [{ id: "form", when: "the student is writing the probability", warn: "A probability is a fraction, decimal or percentage, not a ratio." }],
    coach: {
      keyWords: [{ text: "estimate for the probability", why: "Relative frequency: faulty ÷ total tested." }],
      clues: ["Use the sample results.", "Faulty bulbs ÷ bulbs tested.", "Write it as a fraction or decimal."],
      traps: ["Is it a fraction, decimal or percentage?"],
    },
  },
  {
    id: "ccc3-q5b", source: { paper: SRC, q: "5", part: "b" }, topic: "relfreq", tier: "H", calculator: true,
    prompt: "The factory makes 4000 bulbs each day.<br>Work out an estimate for the number of bulbs made each day that are <b>not</b> faulty.",
    promptText: `${BULBS} The factory makes 4000 bulbs each day. Work out an estimate for the number of bulbs made each day that are NOT faulty.`,
    marks: 2, answer: "3808 bulbs", solution: ["4000 × 0.048 = 192 faulty", "4000 − 192 = 3808"], noWorking: "full",
    points: [
      { id: "M1", code: "M1", ft: true, criterion: "4000 × (1 − 0.048) or 4000 − 192" },
      { id: "A1", code: "A1", dep: ["M1"], criterion: "3808", reject: ["192 (the faulty ones)"] },
    ],
    errors: [{ id: "complement", looksLike: "gave 192, the number that are faulty: the question says not faulty" }],
    dangerZones: [{ id: "not", when: "192 has been found", warn: "Faulty, or not faulty?" }],
    coach: {
      keyWords: [{ text: "not", why: "The bulbs that work." }],
      clues: ["Estimate the faulty ones: 4000 × your probability.", "Subtract from 4000.", "Or use the probability of not faulty directly."],
      traps: ["Is your answer the bulbs that are NOT faulty?"],
    },
  },
  {
    id: "ccc3-q6", source: { paper: SRC, q: "6" }, topic: "ratio", tier: "H", calculator: true,
    prompt: "In a school, the ratio of the number of boys to the number of girls is 4 : 5<br>30% of the boys cycle to school. 20% of the girls cycle to school.<br>Work out the percentage of all the students who cycle to school.<br>Give your answer correct to 1 decimal place.",
    marks: 3, answer: "24.4%", solution: ["Take 400 boys and 500 girls", "Cyclists: 120 + 100 = 220", "220 ÷ 900 × 100 = 24.4%"], noWorking: "full",
    showWorking: "Pick numbers that fit the ratio and write the cyclists for each group.",
    points: [
      { id: "M1a", code: "M1", criterion: "Uses the ratio, e.g. 400 boys and 500 girls, giving 120 and 100 who cycle.", accept: ["4/9 × 0.3 + 5/9 × 0.2"] },
      { id: "M1b", code: "M1", ft: true, dep: ["M1a"], criterion: "220 ÷ 900 (× 100)" },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "24.4", reject: ["25 (averaging 30% and 20%)"] },
    ],
    errors: [{ id: "wrong-average", looksLike: "averaged 30% and 20% to get 25%: that only works with equal numbers of boys and girls" }],
    dangerZones: [{ id: "avg", when: "the student is combining the percentages", warn: "There are more girls than boys. A simple average won't work." }],
    coach: {
      keyWords: [{ text: "ratio", why: "More girls than boys, so 20% counts for more." }, { text: "1 decimal place", why: "Round at the end." }],
      clues: ["Choose numbers that fit 4 : 5, like 400 boys and 500 girls.", "Find 30% of the boys and 20% of the girls.", "Total cyclists ÷ total students × 100."],
      traps: ["Is your answer closer to 20% than 30%?"],
    },
  },
  {
    id: "ccc3-q7", source: { paper: SRC, q: "7" }, topic: "simlin", tier: "H", calculator: true,
    prompt: "Here are the first five terms of a sequence. Each term is the sum of the two terms before it.<br><span class=\"eq\">a &nbsp;&nbsp; b &nbsp;&nbsp; a + b &nbsp;&nbsp; a + 2b &nbsp;&nbsp; 2a + 3b</span><br>The 3rd term of the sequence is 7<br>The 5th term of the sequence is 18<br>Work out the value of a and the value of b.",
    promptText: "A sequence: a, b, a + b, a + 2b, 2a + 3b (each term is the sum of the two before). The 3rd term is 7 and the 5th term is 18. Work out the value of a and the value of b.",
    marks: 3, answer: "a = 3 and b = 4", solution: ["a + b = 7 and 2a + 3b = 18", "2a + 2b = 14, subtract: b = 4", "a = 3"], noWorking: "full",
    points: [
      { id: "M1a", code: "M1", criterion: "a + b = 7 and 2a + 3b = 18" },
      { id: "M1b", code: "M1", dep: ["M1a"], criterion: "Eliminates one letter, e.g. 2a + 2b = 14, so b = 4" },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "a = 3 and b = 4", reject: ["a = 4, b = 3 (swapped)"] },
    ],
    errors: [
      { id: "stopped-early", looksLike: "guessed values that fit the 3rd term only, such as a = 2 and b = 5" },
      { id: "swapped", looksLike: "gave the two answers the wrong way round" },
    ],
    dangerZones: [{ id: "both", when: "the student has candidate values", warn: "Do they fit the 5th term too?" }],
    coach: {
      keyWords: [{ text: "3rd term", why: "a + b = 7." }, { text: "5th term", why: "2a + 3b = 18." }],
      clues: ["Write two equations from the 3rd and 5th terms.", "a + b = 7 and 2a + 3b = 18.", "Double the first and subtract to find b."],
      traps: ["Check: does 2a + 3b = 18?"],
    },
  },
  {
    id: "ccc3-q8a", source: { paper: SRC, q: "8", part: "a" }, topic: "gradarea", tier: "H", calculator: true,
    prompt: "Here is a speed–time graph for a cyclist.<br>Work out the deceleration of the cyclist during the last 6 seconds.",
    promptText: "Speed–time graph for a cyclist: 0 to 12 m/s over 0–8 s, constant 12 m/s from 8 to 20 s, then down to 0 at 26 s. Work out the deceleration during the last 6 seconds.",
    diagram: speedTime, marks: 1, answer: "2 m/s²", solution: ["12 ÷ 6 = 2 m/s²"], noWorking: "full",
    points: [{ id: "B1", code: "B1", criterion: "2 (12 ÷ 6; accept −2)." }],
    errors: [{ id: "swapped", looksLike: "divided time by speed (6 ÷ 12)" }],
    markerNotes: ["One large square is 4 seconds across and 2 m/s up."],
    dangerZones: [{ id: "grad", when: "the student is working out the deceleration", warn: "Deceleration is the gradient: change in speed ÷ time." }],
    coach: {
      keyWords: [{ text: "deceleration", why: "The gradient of the falling part of the graph." }],
      clues: ["Find the part of the graph where speed falls.", "Speed falls by 12 m/s.", "Divide by the 6 seconds it takes."],
      traps: ["Is it change in speed ÷ time?"],
    },
  },
  {
    id: "ccc3-q8b", source: { paper: SRC, q: "8", part: "b" }, topic: "gradarea", tier: "H", calculator: true,
    prompt: "Work out the total distance the cyclist travels in the 26 seconds.",
    promptText: "Speed–time graph for a cyclist: 0 to 12 m/s over 0–8 s, constant 12 m/s from 8 to 20 s, then down to 0 at 26 s. Work out the total distance travelled in the 26 seconds.",
    diagram: speedTime, marks: 3, answer: "228 m", solution: ["½ × 8 × 12 = 48", "12 × 12 = 144", "½ × 6 × 12 = 36", "48 + 144 + 36 = 228 m"], noWorking: "full",
    showWorking: "Write each area separately.",
    points: [
      { id: "M1a", code: "M1", criterion: "One correct area: ½ × 8 × 12 = 48 or 12 × 12 = 144 or ½ × 6 × 12 = 36." },
      { id: "M1b", code: "M1", dep: ["M1a"], criterion: "Adds all three areas (or uses the trapezium, ½(26 + 12) × 12)." },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "228", reject: ["312 (26 × 12)"] },
    ],
    errors: [
      { id: "wrong-formula", looksLike: "worked out 26 × 12 = 312, as if at top speed the whole time: distance is the area under the graph" },
      { id: "rounding", looksLike: "misread the scale: one large square is 4 seconds across and 2 m/s up" },
    ],
    dangerZones: [{ id: "area", when: "the student starts", warn: "Distance is the area under the graph." }],
    coach: {
      keyWords: [{ text: "total distance", why: "The area under a speed–time graph." }],
      clues: ["Split the area into a triangle, rectangle and triangle.", "Or use the trapezium: ½(a + b)h.", "Add the areas."],
      traps: ["Did you include all three parts?"],
    },
  },
  {
    id: "ccc3-q9", source: { paper: SRC, q: "9" }, topic: "perp", tier: "H", calculator: true,
    prompt: "A is the point (−1, 4) and B is the point (5, −2).<br>Find an equation of the perpendicular bisector of AB.<br>Give your answer in the form y = mx + c",
    marks: 4, answer: "y = x − 1", solution: ["Midpoint (2, 1)", "Gradient AB = (−2 − 4)/(5 − (−1)) = −1", "Perpendicular gradient = 1", "1 = 2 + c, c = −1"], noWorking: "full",
    showWorking: "Write the midpoint, both gradients and the substitution.",
    points: [
      { id: "M1a", code: "M1", criterion: "Midpoint of AB = (2, 1)" },
      { id: "M1b", code: "M1", criterion: "Gradient of AB = (−2 − 4)/(5 − (−1)) = −1" },
      { id: "M1c", code: "M1", ft: true, dep: ["M1b"], criterion: "Perpendicular gradient = 1" },
      { id: "A1", code: "A1", dep: ["M1a", "M1c"], criterion: "y = x − 1" },
    ],
    errors: [
      { id: "wrong-share", looksLike: "put the line through A or B: a bisector goes through the midpoint" },
      { id: "perp-gradient", looksLike: "kept the gradient as −1, giving a line parallel to AB" },
      { id: "sign-error", looksLike: "sign errors in 5 − (−1) = 6" },
    ],
    dangerZones: [
      { id: "perp", when: "the gradient of AB has been found", warn: "Perpendicular: negative reciprocal." },
      { id: "point", when: "the student is substituting a point", warn: "A bisector goes through the midpoint." },
    ],
    coach: {
      keyWords: [{ text: "perpendicular bisector", why: "At right angles to AB, through its midpoint." }],
      clues: ["Find the midpoint of AB.", "Find the gradient of AB, then the negative reciprocal.", "Use the midpoint to find c."],
      traps: ["Does your line pass through the midpoint?"],
    },
  },
  {
    id: "ccc3-q10", source: { paper: SRC, q: "10" }, topic: "circ", tier: "H", calculator: true,
    prompt: "The diagram shows a square inside a circle.<br>The four vertices of the square lie on the circle.<br>The square has sides of length 8 cm.<br>Work out the total area of the shaded regions.<br>Give your answer correct to 3 significant figures.",
    diagram: squareCircle, marks: 4, answer: "36.5 cm²", solution: ["Diagonal = √(8² + 8²) = 11.31…", "Radius = 5.656… (r² = 32)", "π × 32 − 64 = 36.53…", "= 36.5 cm²"], noWorking: "full",
    showWorking: "Write the diagonal and radius before the areas.",
    points: [
      { id: "M1a", code: "M1", criterion: "Diagonal of the square: √(8² + 8²) = 11.31…" },
      { id: "M1b", code: "M1", dep: ["M1a"], criterion: "Radius = 5.656… (or r² = 32)." },
      { id: "M1c", code: "M1", ft: true, dep: ["M1b"], criterion: "π × 32 − 64" },
      { id: "A1", code: "A1", dep: ["M1c"], criterion: "36.5" },
    ],
    errors: [
      { id: "radius-diameter", looksLike: "used 4 cm or 8 cm as the radius: the radius is half the diagonal, not half the side" },
      { id: "rounding", looksLike: "rounded the radius to 5.7 before squaring" },
    ],
    dangerZones: [{ id: "radius", when: "the student is finding the radius", warn: "The radius goes from the centre to a corner of the square." }],
    coach: {
      keyWords: [{ text: "vertices of the square lie on the circle", why: "The square's diagonal is the circle's diameter." }, { text: "shaded regions", why: "Circle minus square." }],
      clues: ["The diagonal of the square is a diameter.", "Use Pythagoras for the diagonal, then halve it.", "Shaded area = circle − square."],
      traps: ["Did you keep the radius unrounded?"],
    },
  },
  {
    id: "ccc3-q11a", source: { paper: SRC, q: "11", part: "a" }, topic: "cumfreq", tier: "H", calculator: true,
    prompt: `${CF}<br>Use the graph to find an estimate for the median mark.`,
    diagram: cfMarks, marks: 1, answer: "35", solution: ["Read across from 60 (half of 120)", "≈ 35"], noWorking: "full",
    points: [{ id: "B1", code: "B1", criterion: "35 (accept 34 to 36).", reject: ["60 (the halfway cumulative frequency)"] }],
    errors: [{ id: "wrong-direction", looksLike: "read across from 35 on the vertical axis, or gave 60, the halfway cumulative frequency" }],
    markerNotes: ["The student can't draw on the printed graph. Judge from the value written."],
    dangerZones: [{ id: "axis", when: "the student is reading the median", warn: "Start at 60 on the cumulative frequency axis." }],
    coach: {
      keyWords: [{ text: "120 students", why: "The median is the 60th." }, { text: "median mark", why: "A mark, read from the horizontal axis." }],
      clues: ["Half of 120 is 60.", "Go across from 60 on the vertical axis to the graph.", "Go down and read the mark."],
      traps: ["Is your answer a mark?"],
    },
  },
  {
    id: "ccc3-q11b", source: { paper: SRC, q: "11", part: "b" }, topic: "cumfreq", tier: "H", calculator: true,
    prompt: "Use the graph to find an estimate for the interquartile range.", promptText: `${CF} Use the graph to find an estimate for the interquartile range.`,
    diagram: cfMarks, marks: 2, answer: "IQR = 21", solution: ["Lower quartile at 30: about 24", "Upper quartile at 90: about 45", "45 − 24"], noWorking: "full",
    points: [
      { id: "M1", code: "M1", criterion: "Reads at 30 and at 90: lower quartile about 24, upper quartile about 45." },
      { id: "A1", code: "A1", dep: ["M1"], criterion: "21 (accept 19 to 23)" },
    ],
    errors: [{ id: "stopped-early", looksLike: "gave the two quartiles without subtracting" }],
    markerNotes: ["The student can't draw on the printed graph. Judge from the quartile values written."],
    dangerZones: [{ id: "q", when: "the student is reading the quartiles", warn: "Quartiles at a quarter and three quarters of 120." }],
    coach: {
      keyWords: [{ text: "interquartile range", why: "Upper quartile − lower quartile." }],
      clues: ["Quartiles are at 30 and 90 on the vertical axis.", "Read each across and down.", "Subtract."],
      traps: ["Did you subtract?"],
    },
  },
  {
    id: "ccc3-q11c", source: { paper: SRC, q: "11", part: "c" }, topic: "cumfreq", tier: "H", calculator: true,
    prompt: "The pass mark for the exam was 55.<br>Work out an estimate for the percentage of students who passed.", promptText: `${CF} The pass mark was 55. Work out an estimate for the percentage of students who passed.`,
    diagram: cfMarks, marks: 2, answer: "10%", solution: ["At 55: cumulative frequency ≈ 108", "Passed: 120 − 108 = 12", "12 ÷ 120 × 100 = 10%"], noWorking: "full",
    points: [
      { id: "M1", code: "M1", criterion: "Reads the cumulative frequency at a mark of 55: 108 (accept 107 to 109)." },
      { id: "A1", code: "A1", dep: ["M1"], criterion: "10 (accept 9 to 11)", reject: ["90 (the percentage who scored 55 or less)"] },
    ],
    errors: [{ id: "complement", looksLike: "gave 90%: 108 is the number who scored 55 or less; the number who passed is 120 − 108 = 12" }],
    markerNotes: ["The student can't draw on the printed graph. Judge from the reading written."],
    dangerZones: [{ id: "pass", when: "a reading at 55 has been taken", warn: "That's how many scored 55 or less. Who passed?" }],
    coach: {
      keyWords: [{ text: "passed", why: "Scored more than the pass mark." }, { text: "percentage", why: "Out of 120." }],
      clues: ["Go up from 55 to the graph and across.", "That's the number who didn't reach above 55.", "Subtract from 120 and turn into a percentage."],
      traps: ["Is your answer the students who passed?"],
    },
  },
  {
    id: "ccc3-q12", source: { paper: SRC, q: "12" }, topic: "similar", tier: "H", calculator: true,
    prompt: "Triangle A and triangle B are mathematically similar.<br>The area of triangle A is 18 cm<sup>2</sup><br>The area of triangle B is 50 cm<sup>2</sup><br>The base of triangle A is 4.5 cm.<br>Work out the base of triangle B.",
    marks: 3, answer: "7.5 cm", solution: ["Area scale factor = 50 ÷ 18 = 25/9", "Length scale factor = √(25/9) = 5/3", "4.5 × 5/3"], noWorking: "full",
    points: [
      { id: "M1a", code: "M1", criterion: "Area scale factor = 50 ÷ 18 = 25/9" },
      { id: "M1b", code: "M1", dep: ["M1a"], criterion: "Length scale factor = √(25/9) = 5/3" },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "4.5 × 5/3 = 7.5", reject: ["12.5 (area scale factor used)"] },
    ],
    errors: [{ id: "no-sqrt", looksLike: "multiplied the base by the area scale factor, giving 12.5 cm: lengths use the square root" }],
    dangerZones: [{ id: "root", when: "the area scale factor has been found", warn: "That's for area. What do lengths use?" }],
    coach: {
      keyWords: [{ text: "area", why: "Area scale factor = length scale factor squared." }, { text: "base", why: "A length." }],
      clues: ["Area scale factor = 50 ÷ 18.", "Length scale factor = √(area scale factor).", "Multiply the base by the length scale factor."],
      traps: ["Did you square root the area scale factor?"],
    },
  },
  {
    id: "ccc3-q13", source: { paper: SRC, q: "13" }, topic: "algfrac", tier: "H", calculator: true,
    prompt: `Simplify fully &nbsp;<span class="eq">${fr("x<sup>2</sup> + 5x", "x<sup>2</sup> + 2x − 15")}</span>`,
    promptText: "Simplify fully (x² + 5x) / (x² + 2x − 15).",
    marks: 3, answer: "x/(x − 3)", solution: ["x² + 5x = x(x + 5)", "x² + 2x − 15 = (x + 5)(x − 3)", "= x/(x − 3)"], noWorking: "full",
    points: [
      { id: "M1a", code: "M1", criterion: "Factorises the numerator: x(x + 5)" },
      { id: "M1b", code: "M1", criterion: "Factorises the denominator: (x + 5)(x − 3)" },
      { id: "A1", code: "A1", dep: ["M1a", "M1b"], criterion: "x/(x − 3)", reject: ["1/−3"] },
    ],
    errors: [
      { id: "wrong-operation", looksLike: "'cancelled' the x² terms at the start" },
      { id: "not-simplified", looksLike: "went on to cancel the x in x/(x − 3) to get 1/−3" },
    ],
    dangerZones: [{ id: "factor", when: "the student is about to cancel", warn: "Only whole factors cancel." }],
    coach: {
      keyWords: [{ text: "Simplify fully", why: "Factorise both, cancel common brackets." }],
      clues: ["Take out the common factor x from the top.", "Factorise the bottom into two brackets.", "Cancel the bracket that's on top and bottom."],
      traps: ["Did you cancel only whole brackets?"],
    },
  },
  {
    id: "ccc3-q14a", source: { paper: SRC, q: "14", part: "a" }, topic: "growth", tier: "H", calculator: true,
    prompt: "The population of a town is 48 500<br>The population is falling by 2.5% each year.<br>Work out the population of the town after 6 years.<br>Give your answer correct to 3 significant figures.",
    marks: 2, answer: "41 700", solution: ["48 500 × 0.975⁶ = 41 665…", "= 41 700"], noWorking: "full",
    points: [
      { id: "M1", code: "M1", criterion: "48 500 × 0.975⁶", reject: ["48 500 × 0.85 (15% in one go)", "0.75 or 0.025 as the multiplier"] },
      { id: "A1", code: "A1", dep: ["M1"], criterion: "41 700 (from 41 665)", reject: ["41 225"] },
    ],
    errors: [
      { id: "simple-compound", looksLike: "took off 6 × 2.5% = 15% in one go, giving 41 225" },
      { id: "wrong-operation", looksLike: "used 0.75 or 0.025 as the multiplier" },
    ],
    dangerZones: [{ id: "mult", when: "the student is choosing a multiplier", warn: "A 2.5% fall: what's left each year?" }],
    coach: {
      keyWords: [{ text: "falling by 2.5% each year", why: "Multiply by 0.975 each year." }, { text: "3 significant figures", why: "Round at the end." }],
      clues: ["The multiplier for a 2.5% fall is 0.975.", "Six years: use a power of 6.", "48 500 × 0.975⁶."],
      traps: ["Is your multiplier 0.975?"],
    },
  },
  {
    id: "ccc3-q14b", source: { paper: SRC, q: "14", part: "b" }, topic: "growth", tier: "H", calculator: true,
    prompt: "After how many complete years will the population first be less than 40 000?<br>You must show all your working.",
    promptText: `${POP} After how many complete years will the population first be less than 40 000? You must show all your working.`,
    marks: 2, answer: "8 years", solution: ["7 years: 48 500 × 0.975⁷ = 40 623", "8 years: 48 500 × 0.975⁸ = 39 608", "8 years"], noWorking: "zero",
    showWorking: "This question says 'You must show all your working'.",
    points: [
      { id: "M1", code: "M1", criterion: "Values for 7 years (40 623) and 8 years (39 608)." },
      { id: "A1", code: "A1", dep: ["M1"], criterion: "8", reject: ["7"] },
    ],
    errors: [{ id: "stopped-early", looksLike: "gave 7: after 7 years the population is still above 40 000" }],
    dangerZones: [{ id: "either", when: "the student has tried a year", warn: "Show the year above 40 000 and the year below." }],
    coach: {
      keyWords: [{ text: "first be less than 40 000", why: "Find the year it drops below." }, { text: "You must show all your working", why: "Show the values either side." }],
      clues: ["Try different numbers of years in 48 500 × 0.975ⁿ.", "Find the last year above 40 000.", "Show that year and the next."],
      traps: ["Have you shown both years?"],
    },
  },
  {
    id: "ccc3-q15", source: { paper: SRC, q: "15" }, topic: "csq", tier: "H", calculator: true,
    prompt: "The graph of &nbsp;<span class=\"eq\">y = x<sup>2</sup> + bx + c</span>&nbsp; has a turning point at (3, −4).<br>Work out the value of b and the value of c.",
    promptText: "The graph of y = x² + bx + c has a turning point at (3, −4). Work out the value of b and the value of c.",
    marks: 3, answer: "b = −6 and c = 5", solution: ["y = (x − 3)² − 4", "= x² − 6x + 9 − 4", "b = −6, c = 5"], noWorking: "full",
    points: [
      { id: "M1a", code: "M1", criterion: "y = (x − 3)² − 4", reject: ["(x + 3)² − 4"] },
      { id: "M1b", code: "M1", ft: true, dep: ["M1a"], criterion: "Expands: x² − 6x + 9 − 4" },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "b = −6 and c = 5", reject: ["c = −4"] },
    ],
    errors: [
      { id: "sign-error", looksLike: "wrote (x + 3)² − 4: a turning point at x = 3 comes from (x − 3)" },
      { id: "stopped-early", looksLike: "gave c = −4 straight from the turning point without expanding" },
    ],
    dangerZones: [{ id: "bracket", when: "the student is writing the completed-square form", warn: "Which bracket is zero when x = 3?" }],
    coach: {
      keyWords: [{ text: "turning point at (3, −4)", why: "Completed square form: (x − 3)² − 4." }],
      clues: ["A turning point (p, q) gives y = (x − p)² + q.", "Write y = (x − 3)² − 4.", "Expand and compare with x² + bx + c."],
      traps: ["Did you expand before reading off c?"],
    },
  },
  {
    id: "ccc3-q16", source: { paper: SRC, q: "16" }, topic: "nthquad", tier: "H", calculator: true,
    prompt: "Here are the first five terms of a quadratic sequence.<br><span class=\"eq\">5 &nbsp;&nbsp; 12 &nbsp;&nbsp; 23 &nbsp;&nbsp; 38 &nbsp;&nbsp; 57</span><br>Find an expression, in terms of n, for the nth term of this sequence.",
    promptText: "Quadratic sequence: 5, 12, 23, 38, 57. Find an expression, in terms of n, for the nth term.",
    marks: 3, answer: "2n² + n + 2", solution: ["Differences 7, 11, 15, 19; second difference 4", "2n²: 2, 8, 18, 32, 50", "Remainder 3, 4, 5, 6, 7 = n + 2"], noWorking: "full",
    points: [
      { id: "M1a", code: "M1", criterion: "Second difference = 4, so the sequence starts 2n².", reject: ["4n²"] },
      { id: "M1b", code: "M1", ft: true, dep: ["M1a"], criterion: "Subtracts 2n² from each term: 3, 4, 5, 6, 7" },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "2n² + n + 2" },
    ],
    errors: [
      { id: "second-difference", looksLike: "wrote 4n²: the coefficient of n² is half the second difference" },
      { id: "stopped-early", looksLike: "stopped at 2n² without dealing with what's left over" },
    ],
    markerNotes: ["Check with n = 1: 2 + 1 + 2 = 5."],
    dangerZones: [{ id: "halve", when: "the second difference has been found", warn: "Halve it for the n² coefficient." }],
    coach: {
      keyWords: [{ text: "quadratic sequence", why: "Expect an n² term." }],
      clues: ["Find the first and second differences.", "Half the second difference is the n² coefficient.", "Subtract 2n² and find the nth term of what's left."],
      traps: ["Does n = 1 give 5?"],
    },
  },
  {
    id: "ccc3-q17a", source: { paper: SRC, q: "17", part: "a" }, topic: "cosr", tier: "H", calculator: true,
    prompt: "ABC is a triangle.<br>AB = 7.4 cm &nbsp;&nbsp; AC = 9.8 cm &nbsp;&nbsp; Angle BAC = 54°<br>Work out the length of BC. Give your answer correct to 3 significant figures.",
    diagram: triBAC, marks: 3, answer: "8.10 cm", solution: ["BC² = 7.4² + 9.8² − 2 × 7.4 × 9.8 × cos 54°", "BC² = 65.5…", "BC = 8.10 cm"], noWorking: "full",
    points: [
      { id: "M1a", code: "M1", criterion: "BC² = 7.4² + 9.8² − 2 × 7.4 × 9.8 × cos 54°" },
      { id: "M1b", code: "M1", dep: ["M1a"], criterion: "BC² = 65.5…" },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "8.10", accept: ["8.1"] },
    ],
    errors: [
      { id: "order-error", looksLike: "worked out (7.4² + 9.8² − 2 × 7.4 × 9.8) × cos 54°: type the whole line in one go" },
      { id: "no-sqrt", looksLike: "forgot to square root" },
    ],
    dangerZones: [{ id: "root", when: "BC² has been found", warn: "That's BC squared." }],
    coach: {
      keyWords: [{ text: "Angle BAC = 54°", why: "The angle between the two sides you know: cosine rule." }],
      clues: ["Two sides and the angle between them: cosine rule.", "BC² = 7.4² + 9.8² − 2 × 7.4 × 9.8 × cos 54°.", "Type it in one go, then square root."],
      traps: ["Did you square root at the end?"],
    },
  },
  {
    id: "ccc3-q17b", source: { paper: SRC, q: "17", part: "b" }, topic: "siner", tier: "H", calculator: true,
    prompt: "Work out the size of angle ACB. Give your answer correct to 1 decimal place.",
    promptText: `${TRI} BC = 8.10 cm. Work out the size of angle ACB, correct to 1 decimal place.`,
    diagram: triBAC, marks: 2, answer: "47.7°", solution: ["sin C / 7.4 = sin 54° / 8.10", "sin C = 0.739…", "C = 47.7°"], noWorking: "full",
    points: [
      { id: "M1", code: "M1", ft: true, criterion: "sin C / 7.4 = sin 54° / 8.10 (their BC)." },
      { id: "A1", code: "A1", dep: ["M1"], criterion: "47.7 (accept 47.6 to 47.7)." },
    ],
    errors: [{ id: "wrong-ratio", looksLike: "paired the angle with the wrong side: angle C is opposite AB" }],
    dangerZones: [{ id: "pair", when: "the student is writing the sine rule", warn: "Angle C pairs with the side opposite it." }],
    coach: {
      keyWords: [{ text: "angle ACB", why: "The angle at C, opposite AB." }],
      clues: ["Use the sine rule with BC and angle A.", "sin C / 7.4 = sin 54° / BC.", "Rearrange for sin C and use sin⁻¹."],
      traps: ["Is angle C paired with AB = 7.4?"],
    },
  },
  {
    id: "ccc3-q18", source: { paper: SRC, q: "18" }, topic: "prob", tier: "H", calculator: true,
    prompt: "Spinner A has four equal sections numbered 1, 2, 3 and 4<br>Spinner B has three equal sections numbered 1, 2 and 3<br>Each spinner is spun once and the two numbers are multiplied together.<br>Work out the probability that the result is an even number.",
    marks: 3, answer: "2/3", solution: ["P(both odd) = 2/4 × 2/3 = 4/12", "P(even) = 1 − 4/12 = 8/12 = 2/3"], noWorking: "full",
    points: [
      { id: "M1a", code: "M1", criterion: "A sample space of the 12 outcomes or P(both odd) = 2/4 × 2/3." },
      { id: "M1b", code: "M1", dep: ["M1a"], criterion: "Counts 8 even products or 1 − 4/12." },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "2/3 oe", accept: ["8/12"], reject: ["1/2"] },
    ],
    errors: [
      { id: "wrong-operation", looksLike: "added the two numbers when the question says multiply" },
      { id: "wrong-share", looksLike: "assumed even and odd are equally likely and gave 1/2" },
    ],
    dangerZones: [{ id: "odd", when: "the student starts", warn: "A product is odd only when both numbers are odd." }],
    coach: {
      keyWords: [{ text: "multiplied", why: "Products, not sums." }, { text: "even", why: "Even unless both numbers are odd." }],
      clues: ["Draw a sample space: 4 × 3 = 12 outcomes.", "A product is odd only if both numbers are odd.", "Count the even products, or use 1 − P(both odd)."],
      traps: ["Did you multiply, not add?"],
    },
  },
  {
    id: "ccc3-q19", source: { paper: SRC, q: "19" }, topic: "trig3d", tier: "H", calculator: true,
    prompt: "VABCD is a pyramid with a square base ABCD.<br>The vertex V is vertically above the centre, O, of the base.<br>AB = 10 cm &nbsp;&nbsp; VO = 12 cm<br>Work out the size of the angle between the edge VA and the base ABCD.<br>Give your answer correct to 1 decimal place.",
    diagram: pyramid, marks: 4, answer: "59.5°", solution: ["AC = √(10² + 10²) = 14.14…", "AO = 7.071…", "tan x = 12 / 7.071…", "x = 59.5°"], noWorking: "full",
    showWorking: "Write AC and AO before the trig.",
    points: [
      { id: "M1a", code: "M1", criterion: "AC = √(10² + 10²) = 14.14…" },
      { id: "M1b", code: "M1", dep: ["M1a"], criterion: "AO = 7.071…" },
      { id: "M1c", code: "M1", ft: true, dep: ["M1b"], criterion: "tan x = 12 / 7.071…" },
      { id: "A1", code: "A1", dep: ["M1c"], criterion: "59.5", reject: ["67.4 (angle of a face, using 5 cm)"] },
    ],
    errors: [{ id: "wrong-share", looksLike: "used 5 cm, half the side, giving 67.4°, the angle a sloping face makes with the base: AO is half the diagonal" }],
    dangerZones: [{ id: "ao", when: "the student is finding the base of the right-angled triangle", warn: "VA meets the base at A. How far is A from O?" }],
    coach: {
      keyWords: [{ text: "edge VA", why: "The triangle you need is VOA." }, { text: "1 decimal place", why: "Round at the end." }],
      clues: ["The angle is in triangle VOA, right-angled at O.", "AO is half the diagonal AC: find AC with Pythagoras.", "tan x = VO ÷ AO."],
      traps: ["Did you use half the diagonal, not half the side?"],
    },
  },
  {
    id: "ccc3-q20", source: { paper: SRC, q: "20" }, topic: "congproof", tier: "H", calculator: true,
    prompt: "ABCD is a kite with AB = AD and CB = CD.<br>Prove that triangle ABC is congruent to triangle ADC.",
    diagram: kite, marks: 3, answer: "Proof (SSS)", solution: ["AB = AD (given)", "CB = CD (given)", "AC is common", "So triangles ABC and ADC are congruent (SSS)"], noWorking: "zero",
    points: [
      { id: "B1a", code: "B1", criterion: "AB = AD (given) and CB = CD (given)." },
      { id: "B1b", code: "B1", criterion: "AC is common to both triangles." },
      { id: "B1c", code: "B1", criterion: "So the triangles are congruent, SSS.", reject: ["no condition stated", "'they look the same' or 'it's a kite so it's symmetrical'"] },
    ],
    errors: [
      { id: "stopped-early", looksLike: "left out the common side AC, so only two pairs of sides were matched" },
      { id: "wrong-form", looksLike: "didn't state the condition (SSS), or wrote 'they look the same'" },
    ],
    dangerZones: [{ id: "third", when: "two pairs of sides have been matched", warn: "You need a third fact. What do the triangles share?" }],
    coach: {
      keyWords: [{ text: "Prove", why: "Three facts, each with a reason, then the condition." }, { text: "congruent", why: "SSS, SAS, ASA or RHS." }],
      clues: ["Write the two pairs of equal sides you're given.", "Which side is in both triangles?", "Name the congruence condition."],
      traps: ["Did you write SSS at the end?"],
    },
  },
  {
    id: "ccc3-q21", source: { paper: SRC, q: "21" }, topic: "simquad", tier: "H", calculator: true,
    prompt: "Solve algebraically the simultaneous equations<br><span class=\"eq\">y = x<sup>2</sup> − 5</span><br><span class=\"eq\">y = 2x + 3</span>",
    promptText: "Solve algebraically the simultaneous equations y = x² − 5 and y = 2x + 3.",
    marks: 5, answer: "x = 4, y = 11 and x = −2, y = −1", solution: ["x² − 5 = 2x + 3", "x² − 2x − 8 = 0", "(x − 4)(x + 2) = 0", "x = 4, y = 11; x = −2, y = −1"], noWorking: "zero",
    showWorking: "'Solve algebraically' means the working must be shown.",
    points: [
      { id: "M1a", code: "M1", criterion: "x² − 5 = 2x + 3" },
      { id: "M1b", code: "M1", ft: true, dep: ["M1a"], criterion: "x² − 2x − 8 = 0" },
      { id: "M1c", code: "M1", ft: true, dep: ["M1b"], criterion: "(x − 4)(x + 2) = 0", accept: ["correct use of the formula"] },
      { id: "A1a", code: "A1", dep: ["M1c"], criterion: "x = 4 and x = −2" },
      { id: "A1b", code: "A1", dep: ["A1a"], criterion: "y = 11 and y = −1, correctly paired.", reject: ["y = 7 for x = −2"] },
    ],
    errors: [
      { id: "stopped-early", looksLike: "found the two x values and stopped: each needs its y value" },
      { id: "sign-error", looksLike: "substituted x = −2 and got y = 7 from a sign slip: 2 × (−2) + 3 = −1" },
    ],
    dangerZones: [{ id: "ys", when: "both x values have been found", warn: "Each x needs its y. The linear equation is safest." }],
    coach: {
      keyWords: [{ text: "Solve algebraically", why: "Show the algebra, not a graph." }],
      clues: ["Set x² − 5 equal to 2x + 3.", "Rearrange to a quadratic = 0 and factorise.", "Find y for each x using y = 2x + 3."],
      traps: ["Have you paired each x with its y?"],
    },
  },
  {
    id: "ccc3-q22", source: { paper: SRC, q: "22" }, topic: "volcone", tier: "H", calculator: true,
    prompt: "A solid metal sphere has a radius of 4.5 cm.<br>The sphere is melted down and the metal is used to make small solid cones.<br>Each cone has a base radius of 1.5 cm and a height of 4 cm.<br>Work out the greatest number of complete cones that can be made.<br>You must show all your working.",
    marks: 4, answer: "40 cones", solution: ["Sphere: 4/3 × π × 4.5³ = 121.5π (381.7)", "Cone: ⅓ × π × 1.5² × 4 = 3π (9.42)", "121.5π ÷ 3π = 40.5", "40 complete cones"], noWorking: "zero",
    showWorking: "This question says 'You must show all your working'.",
    points: [
      { id: "M1a", code: "M1", criterion: "Sphere: 4/3 × π × 4.5³ (= 121.5π or 381.7)" },
      { id: "M1b", code: "M1", criterion: "Cone: ⅓ × π × 1.5² × 4 (= 3π or 9.42)" },
      { id: "M1c", code: "M1", ft: true, dep: ["M1a", "M1b"], criterion: "121.5π ÷ 3π = 40.5" },
      { id: "A1", code: "A1", dep: ["M1c"], criterion: "40", reject: ["41 (rounded up)", "13 (⅓ left out)"] },
    ],
    errors: [
      { id: "rounding", looksLike: "rounded 40.5 up to 41: there's only enough metal for 40 complete cones" },
      { id: "half", looksLike: "forgot the ⅓ in the cone formula, giving 13" },
    ],
    dangerZones: [{ id: "down", when: "40.5 has been found", warn: "Complete cones only. Which way do you round?" }],
    coach: {
      keyWords: [{ text: "greatest number of complete cones", why: "Round down." }, { text: "You must show all your working", why: "No working, no marks." }],
      clues: ["Find the sphere's volume.", "Find one cone's volume (remember the ⅓).", "Divide, then round down."],
      traps: ["Did you round down?"],
    },
  },
];
