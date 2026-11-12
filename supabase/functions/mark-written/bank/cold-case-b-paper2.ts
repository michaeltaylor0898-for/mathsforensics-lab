// Cold Case B · Higher Paper 2 (calculator) · all 21 questions, 80 marks (CC-B/2H)
//
// Question wording is copied from the paper. Mark points follow Mike's Cold Case B Paper 2 Forensic
// Mark Scheme line for line; errors and Mike-mode danger zones come from its "Where the marks go
// missing" boxes. Students write on a blank page, so the histogram (Q10) and tree diagram (Q11)
// have marker notes saying what to accept instead of marks on the printed grid.
import type { Scheme } from "../schemes.ts";

const fr = (n: string | number, d: string | number) => `<span class="fr"><span>${n}</span><span>${d}</span></span>`;
const SRC = "CC-B/2H";
const TXT = `font-family="Times New Roman,serif" fill="currentColor"`;
const NDA = (x: number, y: number) => `<text x="${x}" y="${y}" font-size="9" text-anchor="middle" fill="currentColor" opacity=".7" font-family="Arial,sans-serif">Not drawn accurately</text>`;
// headRow: the first row holds the headings; otherwise the first column does
const table = (rows: (string | number)[][], headRow = true) =>
  `<table class="qt">${rows.map((r, i) => `<tr>${r.map((c, j) => ((headRow ? i : j) === 0 ? `<th>${c}</th>` : `<td>${c}</td>`)).join("")}</tr>`).join("")}</table>`;

// ---------- diagrams ----------
const windowShape = `<svg viewBox="0 0 260 190" role="img" aria-label="A window: a rectangle 1.6 m wide and 2.4 m high with a semicircle of diameter 1.6 m on top."><g fill="none" stroke="currentColor" stroke-width="1.6"><path d="M90 50 V170 H170 V50"/><path d="M90 50 A40 40 0 0 1 170 50"/><path d="M90 50 H170" stroke-dasharray="4 3"/></g><g ${TXT} font-size="12"><text x="84" y="114" text-anchor="end">2.4 m</text><text x="130" y="184" text-anchor="middle">1.6 m</text></g></svg>`;

const isosPQR = `<svg viewBox="0 0 260 170" role="img" aria-label="Isosceles triangle PQR with P at the top. PQ and PR are both 9.5 cm. Angles PQR and PRQ are both 64 degrees."><path d="M80 140 L180 140 L130 37 Z" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M98 140 A18 18 0 0 0 88 124 M162 140 A18 18 0 0 1 172 124" fill="none" stroke="currentColor" stroke-width="1.2"/><g ${TXT} font-size="13"><text x="125" y="30" font-style="italic">P</text><text x="66" y="152" font-style="italic">Q</text><text x="184" y="152" font-style="italic">R</text><text x="98" y="90" text-anchor="end">9.5 cm</text><text x="162" y="90">9.5 cm</text><text x="100" y="134" font-size="11">64°</text><text x="142" y="134" font-size="11">64°</text></g>${NDA(130, 165)}</svg>`;

const histGrid = (() => {
  const X = (s: number) => 50 + (s - 20) * 5.4, Y = (d: number) => 210 - d * 60;
  const minor: string[] = [], major: string[] = [], labels: string[] = [];
  for (let s = 20; s <= 70; s += 2) (s % 10 ? minor : major).push(`M${X(s).toFixed(1)} ${Y(0)}V${Y(3)}`);
  for (let k = 0; k <= 30; k++) (k % 5 ? minor : major).push(`M${X(20)} ${Y(k / 10)}H${X(70)}`);
  for (let s = 20; s <= 70; s += 10) labels.push(`<text x="${X(s)}" y="226" text-anchor="middle">${s}</text>`);
  for (let k = 0; k <= 6; k++) labels.push(`<text x="44" y="${Y(k / 2) + 4}" text-anchor="end">${k === 0 ? "0" : (k / 2).toFixed(1)}</text>`);
  return `<svg viewBox="0 0 350 250" role="img" aria-label="An empty histogram grid: speed in mph from 20 to 70 across, frequency density from 0 to 3.0 up."><path d="${minor.join("")}" stroke="currentColor" stroke-width=".35" opacity=".35" fill="none"/><path d="${major.join("")}" stroke="currentColor" stroke-width=".7" opacity=".6" fill="none"/><g font-size="11" ${TXT}>${labels.join("")}<text x="185" y="244" text-anchor="middle">Speed (s mph)</text><text transform="translate(14 120) rotate(-90)" text-anchor="middle">Frequency density</text></g></svg>`;
})();

const rainTree = `<svg viewBox="0 0 320 170" role="img" aria-label="Probability tree. First branches: Rain 0.3, No rain blank. After Rain: Late 0.4, Not late blank. After No rain: Late 0.1, Not late blank."><g fill="none" stroke="currentColor" stroke-width="1.4"><path d="M20 85 L120 40 M20 85 L120 130 M170 40 L260 18 M170 40 L260 62 M170 130 L260 108 M170 130 L260 152"/></g><g ${TXT} font-size="12"><text x="124" y="44">Rain</text><text x="124" y="134">No rain</text><text x="264" y="22">Late</text><text x="264" y="66">Not late</text><text x="264" y="112">Late</text><text x="264" y="156">Not late</text><text x="50" y="52">0.3</text><text x="44" y="128">……</text><text x="205" y="22">0.4</text><text x="205" y="66">……</text><text x="205" y="112">0.1</text><text x="205" y="156">……</text></g></svg>`;

const scalene = `<svg viewBox="0 0 300 160" role="img" aria-label="A triangle with sides 7.2 cm, 9.5 cm and 12.1 cm. The 12.1 cm side is along the bottom."><path d="M30 130 L272 130 L119 17 Z" fill="none" stroke="currentColor" stroke-width="1.6"/><g ${TXT} font-size="12"><text x="68" y="70" text-anchor="end">7.2 cm</text><text x="200" y="70">9.5 cm</text><text x="151" y="146" text-anchor="middle">12.1 cm</text></g>${NDA(151, 158)}</svg>`;

const vectorOAB = `<svg viewBox="0 0 280 170" role="img" aria-label="Triangle OAB. O at bottom left, B at bottom right, A at the top. OA is the vector a and OB is the vector b. P lies on AB, nearer to B, and is joined to O."><defs><marker id="ar2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="currentColor"/></marker></defs><g fill="none" stroke="currentColor" stroke-width="1.5"><path d="M40 140 L110 20" marker-end="url(#ar2)"/><path d="M40 140 L240 140" marker-end="url(#ar2)"/><path d="M110 20 L240 140 M40 140 L207.5 110"/></g><g ${TXT} font-size="13"><text x="104" y="14" font-style="italic">A</text><text x="26" y="150" font-style="italic">O</text><text x="246" y="150" font-style="italic">B</text><text x="212" y="106" font-style="italic">P</text><text x="62" y="76" font-weight="bold">a</text><text x="136" y="156" font-weight="bold">b</text></g>${NDA(140, 166)}</svg>`;

const rectX = `<svg viewBox="0 0 260 130" role="img" aria-label="A rectangle with height x − 1 and width x + 5, in centimetres."><rect x="70" y="20" width="140" height="70" fill="none" stroke="currentColor" stroke-width="1.6"/><g ${TXT} font-size="13" font-style="italic"><text x="62" y="59" text-anchor="end">x − 1</text><text x="140" y="108" text-anchor="middle">x + 5</text></g>${NDA(140, 124)}</svg>`;

const segment = `<svg viewBox="0 0 260 190" role="img" aria-label="A circle centre O, radius 7.5 cm. A and B are on the circle and angle AOB is 110 degrees. The segment between chord AB and the arc above it is shaded."><path d="M72.7 59.9 A70 70 0 0 1 187.3 59.9 Z" fill="currentColor" opacity=".18"/><circle cx="130" cy="100" r="70" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M72.7 59.9 L130 100 L187.3 59.9 Z" fill="none" stroke="currentColor" stroke-width="1.5"/><g ${TXT} font-size="12"><text x="60" y="56" font-style="italic">A</text><text x="192" y="56" font-style="italic">B</text><text x="126" y="118" font-style="italic">O</text><text x="118" y="80">110°</text><text x="162" y="94">7.5 cm</text></g>${NDA(130, 186)}</svg>`;

export const COLD_CASE_B2: Scheme[] = [
  {
    id: "ccb2-q1a", source: { paper: SRC, q: "1", part: "a" }, topic: "round", tier: "H", calculator: true,
    prompt: `Use your calculator to work out &nbsp;<span class="eq">${fr("3.4<sup>2</sup> + √12.6", "1.9 × 0.85")}</span><br>Write down all the figures on your calculator display.`,
    promptText: "Use your calculator to work out (3.4² + √12.6) / (1.9 × 0.85). Write down all the figures on your calculator display.",
    marks: 2, answer: "9.355819114",
    solution: ["3.4² + √12.6 = 15.1096…", "1.9 × 0.85 = 1.615", "15.1096… ÷ 1.615 = 9.355819114"],
    noWorking: "full", showWorking: "Write the top and the bottom as separate values before dividing.",
    points: [
      { id: "M1", code: "M1", criterion: "15.109… (the numerator) or 1.615 (the denominator) seen." },
      { id: "A1", code: "A1", dep: ["M1"], criterion: "9.355819… (at least five figures).", reject: ["9.36 (rounded: the question asks for all the figures)", "25.95… (numerator × 0.85 ÷ 1.9: no brackets round the denominator)"] },
    ],
    errors: [
      { id: "order-error", looksLike: "typed it in one line without brackets round the denominator, so it was multiplied by 0.85 instead of divided" },
      { id: "rounding", looksLike: "rounded in part (a), where the question asks for all the figures" },
    ],
    dangerZones: [{ id: "brackets", when: "the student is about to divide the numerator by the denominator", warn: "Use the fraction button, or put brackets round the whole bottom." }],
    coach: {
      keyWords: [{ text: "all the figures", why: "Don't round. Copy every digit on the display." }],
      clues: ["Work out the top and the bottom separately first.", "Top: 3.4² + √12.6. Bottom: 1.9 × 0.85 = 1.615.", "Divide the top by the bottom, using the fraction button or brackets."],
      traps: ["Have you written every figure from the display?"],
    },
  },
  {
    id: "ccb2-q1b", source: { paper: SRC, q: "1", part: "b" }, topic: "round", tier: "H", calculator: true,
    prompt: "Write your answer to part (a) correct to 2 decimal places.",
    promptText: "Write your answer to part (a) (9.355819114 if correct) correct to 2 decimal places.",
    marks: 1, answer: "9.36", solution: ["9.355… → 9.36"], noWorking: "full",
    points: [{ id: "B1", code: "B1", ft: true, criterion: "9.36 (ft their answer to (a)).", reject: ["9.35 (truncated)", "9.4"] }],
    errors: [{ id: "rounding", looksLike: "truncated to 9.35 instead of rounding" }],
    dangerZones: [{ id: "round", when: "the student is rounding", warn: "Look at the third decimal place to decide." }],
    coach: {
      keyWords: [{ text: "2 decimal places", why: "Two digits after the point." }],
      clues: ["Keep two digits after the decimal point.", "Look at the third decimal digit.", "If it's 5 or more, round the second digit up."],
      traps: ["Did you round, not just cut off?"],
    },
  },
  {
    id: "ccb2-q2", source: { paper: SRC, q: "2" }, topic: "bestbuy", tier: "H", calculator: true,
    prompt: "Rice is sold in two sizes of bag.<br>A small bag contains 750 g of rice and costs £2.85<br>A large bag contains 1.2 kg of rice and costs £4.44<br>Which bag is the better value for money? You must show all your working.",
    marks: 3, answer: "The large bag",
    solution: ["Small: 2.85 ÷ 0.75 = £3.80 per kg", "Large: 4.44 ÷ 1.2 = £3.70 per kg", "The large bag is better value"],
    noWorking: "zero", showWorking: "This question says 'You must show all your working': a decision with no figures scores 0.",
    points: [
      { id: "M1a", code: "M1", criterion: "A unit price for one bag, e.g. 2.85 ÷ 0.75 = £3.80 per kg.", accept: ["0.38p per g", "amount per £1, e.g. 750 ÷ 2.85 = 263 g per £"] },
      { id: "M1b", code: "M1", criterion: "A comparable unit price for the other bag, e.g. 4.44 ÷ 1.2 = £3.70 per kg.", reject: ["a unit price in different units from the first bag (g vs kg) without converting"] },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "Large bag, supported by correct figures." },
    ],
    errors: [
      { id: "wrong-operation", looksLike: "mixed units: compared a price per gram with a price per kilogram" },
      { id: "wrong-direction", looksLike: "divided the wrong way round (grams per pound) and then chose the smaller number" },
    ],
    dangerZones: [
      { id: "units", when: "the student is about to divide using 750 and 1.2", warn: "One bag is in grams, one in kilograms. Make them match first." },
      { id: "decide", when: "both unit values have been found", warn: "Is a smaller number better here, or a bigger one? It depends which way you divided." },
    ],
    coach: {
      keyWords: [{ text: "750 g", why: "Grams…" }, { text: "1.2 kg", why: "…and kilograms. Convert so they match." }, { text: "You must show all your working", why: "No figures, no marks." }],
      clues: ["Find the cost of the same amount of rice for each bag.", "750 g = 0.75 kg. Divide each price by its mass in kg.", "Compare the two prices per kg: the cheaper one is better value."],
      traps: ["Are both unit prices in the same units?", "Have you written your decision with the figures that support it?"],
    },
  },
  {
    id: "ccb2-q3", source: { paper: SRC, q: "3" }, topic: "circ", tier: "H", calculator: true,
    prompt: "The diagram shows a window made from a rectangle and a semicircle.<br>The rectangle is 1.6 m wide and 2.4 m high.<br>The diameter of the semicircle is 1.6 m.<br>Work out the total area of the window.<br>Give your answer correct to 3 significant figures.",
    diagram: windowShape, marks: 3, answer: "4.85 m²",
    solution: ["Rectangle: 1.6 × 2.4 = 3.84", "Semicircle: ½ × π × 0.8² = 1.005…", "Total = 4.845… = 4.85 m²"],
    noWorking: "full", showWorking: "Write the rectangle and the semicircle areas as separate lines.",
    points: [
      { id: "M1a", code: "M1", criterion: "Rectangle: 1.6 × 2.4 = 3.84" },
      { id: "M1b", code: "M1", criterion: "Semicircle: ½ × π × 0.8²", reject: ["½ × π × 1.6² (diameter used as radius)", "π × 0.8² (whole circle)"] },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "4.85 (from 4.845…)", reject: ["7.86 (diameter as radius)", "5.85 (whole circle)"] },
    ],
    errors: [
      { id: "radius-diameter", looksLike: "used the diameter, 1.6, as the radius, giving 7.86 m²" },
      { id: "half", looksLike: "added a whole circle (5.85 m²) when the shape has a semicircle" },
    ],
    dangerZones: [{ id: "radius", when: "the student is working out the semicircle area", warn: "Radius or diameter? And it's half a circle." }],
    coach: {
      keyWords: [{ text: "semicircle", why: "Half a circle: halve the circle's area." }, { text: "diameter", why: "Halve it to get the radius." }, { text: "3 significant figures", why: "Round at the end only." }],
      clues: ["Split the window into a rectangle and a semicircle.", "Rectangle: width × height. Semicircle radius = 1.6 ÷ 2.", "Semicircle area = ½ × π × r². Add the two areas."],
      traps: ["Did you use the radius, not the diameter?", "Did you halve the circle area?"],
    },
  },
  {
    id: "ccb2-q4", source: { paper: SRC, q: "4" }, topic: "cint", tier: "H", calculator: true,
    prompt: `Dev has £5000 to invest for 4 years. He can choose one of these accounts.${table([["Account A", "Account B"], ["3.5% per year<br><b>simple</b> interest", "3.2% per year<br><b>compound</b> interest"]])}Which account will give Dev more money at the end of the 4 years, and by how much?<br>You must show all your working.`,
    promptText: "Dev has £5000 to invest for 4 years. Account A: 3.5% per year simple interest. Account B: 3.2% per year compound interest. Which account will give Dev more money at the end of the 4 years, and by how much? You must show all your working.",
    marks: 4, answer: "Account A, by £28.62",
    solution: ["A: 5000 × 0.035 × 4 = 700, so £5700", "B: 5000 × 1.032⁴ = £5671.38", "5700 − 5671.38 = 28.62", "Account A, by £28.62"],
    noWorking: "zero", showWorking: "This question says 'You must show all your working'.",
    points: [
      { id: "M1a", code: "M1", criterion: "Account A: 5000 × 0.035 × 4 = 700, giving £5700" },
      { id: "M1b", code: "M1", criterion: "Account B: 5000 × 1.032⁴", accept: ["year-by-year compound calculation"] },
      { id: "A1a", code: "A1", dep: ["M1b"], criterion: "£5671.38" },
      { id: "A1b", code: "A1", dep: ["M1a", "A1a"], criterion: "Account A, by £28.62" },
    ],
    errors: [
      { id: "simple-compound", looksLike: "treated both accounts as compound, or both as simple" },
      { id: "stopped-early", looksLike: "found the two amounts and didn't give the difference" },
      { id: "wrong-share", looksLike: "assumed compound interest must win and chose Account B" },
    ],
    dangerZones: [
      { id: "types", when: "the student starts calculating an account", warn: "One account is simple interest and one is compound. Treat them differently." },
      { id: "diff", when: "both final amounts have been found", warn: "The question also asks by how much." },
    ],
    coach: {
      keyWords: [{ text: "simple", why: "Same interest every year." }, { text: "compound", why: "Interest on the interest: use a multiplier and a power." }, { text: "by how much", why: "Give the difference too." }],
      clues: ["Account A: interest is the same each year. Find one year's interest and multiply by 4.", "Account B: multiplier 1.032, used 4 times: 5000 × 1.032⁴.", "Compare the two totals and subtract."],
      traps: ["Did you name the account AND give the difference?"],
    },
  },
  {
    id: "ccb2-q5a", source: { paper: SRC, q: "5", part: "a" }, topic: "freqtab", tier: "H", calculator: true,
    prompt: `The table shows the number of goals scored by a team in each of its 30 matches.${table([["Number of goals", 0, 1, 2, 3, 4], ["Number of matches", 9, 8, 7, 4, 2]], false)}Work out the mean number of goals scored per match.`,
    promptText: "Goals 0,1,2,3,4 with frequencies (matches) 9, 8, 7, 4, 2 (30 matches). Work out the mean number of goals scored per match.",
    marks: 3, answer: "1.4",
    solution: ["0×9 + 1×8 + 2×7 + 3×4 + 4×2 = 42", "42 ÷ 30 = 1.4"], noWorking: "full",
    showWorking: "Write the total of the goals × matches column before dividing.",
    points: [
      { id: "M1a", code: "M1", criterion: "0 × 9 + 1 × 8 + 2 × 7 + 3 × 4 + 4 × 2 = 42" },
      { id: "M1b", code: "M1", ft: true, criterion: "42 ÷ 30 (their total ÷ 30).", reject: ["÷ 5 (number of columns)"] },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "1.4" },
    ],
    errors: [{ id: "wrong-denominator", looksLike: "divided by 5 (the number of columns) instead of 30 (the number of matches)" }],
    dangerZones: [{ id: "divide", when: "the student has the total number of goals and is about to divide", warn: "Divide by the number of matches." }],
    coach: {
      keyWords: [{ text: "mean", why: "Total goals ÷ number of matches." }, { text: "30 matches", why: "This is what you divide by." }],
      clues: ["Multiply each number of goals by its number of matches.", "Add those products to get the total number of goals.", "Divide the total by 30."],
      traps: ["Did you divide by 30, not 5?"],
    },
  },
  {
    id: "ccb2-q5b", source: { paper: SRC, q: "5", part: "b" }, topic: "freqtab", tier: "H", calculator: true,
    prompt: "Work out the median number of goals scored per match.",
    promptText: "Goals 0,1,2,3,4 with frequencies (matches) 9, 8, 7, 4, 2 (30 matches). Work out the median number of goals scored per match.",
    marks: 1, answer: "1 goal", solution: ["Median is between the 15th and 16th values", "Matches 10 to 17 scored 1 goal", "Median = 1"], noWorking: "full",
    points: [{ id: "B1", code: "B1", criterion: "1 (the 15th and 16th values are both 1).", reject: ["2 (middle of 0 to 4)", "7 (middle frequency)"] }],
    errors: [{ id: "wrong-average", looksLike: "gave 2, the middle of 0, 1, 2, 3, 4, or 7, the middle frequency" }],
    dangerZones: [{ id: "count", when: "the student is finding the median", warn: "Count through the matches, not the column headings." }],
    coach: {
      keyWords: [{ text: "median", why: "The middle match, when all 30 are in order." }],
      clues: ["With 30 matches, the middle is between the 15th and 16th.", "Count through the frequencies: 9 matches scored 0.", "The next 8 matches scored the next number of goals. Where do the 15th and 16th fall?"],
      traps: ["Is your answer a number of goals, not a frequency?"],
    },
  },
  {
    id: "ccb2-q6", source: { paper: SRC, q: "6" }, topic: "areasin", tier: "H", calculator: true,
    prompt: "PQR is an isosceles triangle with PQ = PR = 9.5 cm.<br>Angle PQR = angle PRQ = 64°<br>Work out the area of triangle PQR.<br>Give your answer correct to 3 significant figures.",
    diagram: isosPQR, marks: 4, answer: "35.6 cm²",
    solution: ["Angle QPR = 180 − 64 − 64 = 52°", "Area = ½ × 9.5 × 9.5 × sin 52°", "= 35.55…", "= 35.6 cm²"],
    noWorking: "full", showWorking: "Write angle QPR = 52° before using the area formula.",
    points: [
      { id: "M1a", code: "M1", criterion: "Angle QPR = 180 − 64 − 64 = 52° (or height = 9.5 sin 64° = 8.538…)." },
      { id: "M1b", code: "M1", ft: true, criterion: "½ × 9.5 × 9.5 × sin 52° (or ½ × base × height with base = 8.329…).", reject: ["½ × 9.5 × 9.5 × sin 64°", "½ × 9.5 × 9.5 (as if right-angled)"] },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "35.55… or 35.56" },
      { id: "B1", code: "B1", criterion: "35.6, correctly rounded to 3 significant figures (ft their more accurate answer)." },
    ],
    errors: [
      { id: "wrong-formula", looksLike: "used 64° in ½ab sin C: the angle must be the one between the two 9.5 cm sides, 52°" },
      { id: "wrong-ratio", looksLike: "worked out ½ × 9.5 × 9.5 as if the triangle were right-angled" },
    ],
    dangerZones: [{ id: "angle", when: "the student is about to use ½ab sin C", warn: "The angle must be between the two sides you're using." }],
    coach: {
      keyWords: [{ text: "PQ = PR = 9.5 cm", why: "Two sides you know. The angle between them is at P." }, { text: "3 significant figures", why: "Round at the end." }],
      clues: ["Use area = ½ab sin C, where C is the angle between sides a and b.", "The angle between PQ and PR is at P: 180 − 64 − 64.", "Area = ½ × 9.5 × 9.5 × sin 52°."],
      traps: ["Is your angle the one between the two 9.5 cm sides?", "Is your answer to 3 significant figures?"],
    },
  },
  {
    id: "ccb2-q7", source: { paper: SRC, q: "7" }, topic: "rev", tier: "H", calculator: true,
    prompt: "The price of a laptop, including VAT at 20%, is £1074<br>Work out the price of the laptop before VAT was added.",
    marks: 3, answer: "£895", solution: ["£1074 is 120% of the original", "1074 ÷ 1.2 = 895"], noWorking: "full",
    showWorking: "Write 1074 ÷ 1.2. That line is worth two of the three marks.",
    points: [
      { id: "M1a", code: "M1", criterion: "Recognises that £1074 is 120% of the original price (multiplier 1.2)." },
      { id: "M1b", code: "M1", dep: ["M1a"], criterion: "1074 ÷ 1.2", accept: ["1074 ÷ 120 × 100"] },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "£895", reject: ["£859.20 (20% taken off £1074)"] },
    ],
    errors: [{ id: "reverse-pct", looksLike: "took 20% off £1074, giving £859.20 (scores 0)" }],
    dangerZones: [{ id: "reverse", when: "the student is about to work with 20% of £1074", warn: "The 20% was added to the original price, not to £1074." }],
    coach: {
      keyWords: [{ text: "including VAT", why: "£1074 is already the bigger amount: 120% of the original." }, { text: "before VAT", why: "You're going backwards to 100%." }],
      clues: ["The original price is 100%. With VAT added it's 120%.", "So £1074 = 120% of the original.", "Divide by 1.2 to undo the increase."],
      traps: ["If you add 20% to your answer, do you get £1074?"],
    },
  },
  {
    id: "ccb2-q8a", source: { paper: SRC, q: "8", part: "a" }, topic: "sline", tier: "H", calculator: true,
    prompt: "A is the point (−3, 2) and B is the point (5, −4).<br>Work out the length of the line segment AB.",
    marks: 2, answer: "AB = 10", solution: ["Differences: 8 and 6", "√(8² + 6²) = √100", "= 10"], noWorking: "full",
    points: [
      { id: "M1", code: "M1", criterion: "√(8² + 6²)", accept: ["8² + 6² = 100 seen"] },
      { id: "A1", code: "A1", dep: ["M1"], criterion: "10" },
    ],
    errors: [{ id: "sign-error", looksLike: "sign errors in the differences: from −3 to 5 is 8, and from 2 to −4 is 6" }],
    dangerZones: [{ id: "diffs", when: "the student is working out the differences in x and y", warn: "Careful with the negatives: how far is it from −3 to 5?" }],
    coach: {
      keyWords: [{ text: "length", why: "Use Pythagoras on the differences in x and y." }],
      clues: ["Find the change in x and the change in y from A to B.", "Change in x is 8, change in y is 6 (ignore the direction).", "Length = √(8² + 6²)."],
      traps: ["Did you square both differences before adding?"],
    },
  },
  {
    id: "ccb2-q8b", source: { paper: SRC, q: "8", part: "b" }, topic: "sline", tier: "H", calculator: true,
    prompt: "Write down the coordinates of the midpoint of AB.",
    promptText: "A is the point (−3, 2) and B is the point (5, −4). Write down the coordinates of the midpoint of AB.",
    marks: 1, answer: "(1, −1)", solution: ["((−3 + 5)/2, (2 + −4)/2) = (1, −1)"], noWorking: "full",
    points: [{ id: "B1", code: "B1", criterion: "(1, −1)" }],
    errors: [{ id: "wrong-operation", looksLike: "subtracted the coordinates when a midpoint needs them added and halved" }],
    dangerZones: [{ id: "mid", when: "the student is finding the midpoint", warn: "Add the coordinates and halve." }],
    coach: {
      keyWords: [{ text: "midpoint", why: "The average of the x values and of the y values." }],
      clues: ["Add the two x coordinates and halve.", "Do the same with the two y coordinates.", "Write them as a coordinate pair."],
      traps: ["Is it written as (x, y)?"],
    },
  },
  {
    id: "ccb2-q9a", source: { paper: SRC, q: "9", part: "a" }, topic: "comp", tier: "H", calculator: true,
    prompt: "The functions f and g are such that<br><span class=\"eq\">f(x) = 5x − 3</span> &nbsp;and&nbsp; <span class=\"eq\">g(x) = x<sup>2</sup> + 2</span><br>Work out the value of fg(−1)",
    promptText: "f(x) = 5x − 3 and g(x) = x² + 2. Work out the value of fg(−1).",
    marks: 2, answer: "fg(−1) = 12", solution: ["g(−1) = (−1)² + 2 = 3", "f(3) = 5 × 3 − 3 = 12"], noWorking: "full",
    points: [
      { id: "M1", code: "M1", criterion: "g(−1) = (−1)² + 2 = 3" },
      { id: "A1", code: "A1", dep: ["M1"], criterion: "f(3) = 12", reject: ["66 (gf: f first)", "2 (from (−1)² = −1)"] },
    ],
    errors: [
      { id: "composite-order", looksLike: "applied f first instead of g" },
      { id: "sign-error", looksLike: "worked out (−1)² as −1" },
    ],
    dangerZones: [{ id: "order", when: "the student is starting the composite function", warn: "fg(−1): which function acts on −1 first?" }],
    coach: {
      keyWords: [{ text: "fg(−1)", why: "Work from the inside: g first, then f." }],
      clues: ["fg(−1) means f(g(−1)): do g first.", "g(−1) = (−1)² + 2. Squaring a negative gives a positive.", "Put that answer into f."],
      traps: ["Did you do g first?"],
    },
  },
  {
    id: "ccb2-q9b", source: { paper: SRC, q: "9", part: "b" }, topic: "qform", tier: "H", calculator: true,
    prompt: "Solve &nbsp;f(x) = g(x)<br>Give your solutions correct to 2 decimal places.",
    promptText: "f(x) = 5x − 3 and g(x) = x² + 2. Solve f(x) = g(x). Give your solutions correct to 2 decimal places.",
    marks: 3, answer: "x = 3.62 and x = 1.38",
    solution: ["x² + 2 = 5x − 3", "x² − 5x + 5 = 0", "x = (5 ± √(25 − 20)) / 2", "x = 3.62 or x = 1.38"], noWorking: "full",
    showWorking: "Write the quadratic = 0 and the formula with numbers in.",
    points: [
      { id: "M1a", code: "M1", criterion: "x² + 2 = 5x − 3, so x² − 5x + 5 = 0" },
      { id: "M1b", code: "M1", ft: true, dep: ["M1a"], criterion: "x = (5 ± √(25 − 20)) / 2 (correct substitution into the formula for their quadratic).", accept: ["completing the square: (x − 2.5)² = 1.25"] },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "3.62 and 1.38", reject: ["only one solution"] },
    ],
    errors: [
      { id: "sign-error", looksLike: "sign slip rearranging to x² − 5x + 5 = 0" },
      { id: "qformula-division", looksLike: "divided only the square root by 2" },
      { id: "wrong-operation", looksLike: "tried to factorise x² − 5x + 5, which doesn't factorise" },
    ],
    dangerZones: [{ id: "method", when: "the quadratic x² − 5x + 5 = 0 has been found", warn: "'2 decimal places' is the hint: does this factorise?" }],
    coach: {
      keyWords: [{ text: "f(x) = g(x)", why: "Set the two expressions equal." }, { text: "2 decimal places", why: "It won't factorise: use the formula." }],
      clues: ["Write 5x − 3 = x² + 2.", "Rearrange to x² − 5x + 5 = 0.", "Use the quadratic formula with a = 1, b = −5, c = 5."],
      traps: ["Have you given two solutions?", "Both to 2 decimal places?"],
    },
  },
  {
    id: "ccb2-q10a", source: { paper: SRC, q: "10", part: "a" }, topic: "hist", tier: "H", calculator: true,
    prompt: `The table shows information about the speeds, s mph, of 49 cars on a road.${table([["Speed (s mph)", "Frequency"], ["20 &lt; s ≤ 30", 6], ["30 &lt; s ≤ 40", 14], ["40 &lt; s ≤ 45", 12], ["45 &lt; s ≤ 50", 9], ["50 &lt; s ≤ 70", 8]])}On the grid, draw a histogram for this information.<br><small>Sketch the histogram in your working, or write the frequency density for each class.</small>`,
    promptText: "Speeds of 49 cars: 20 < s ≤ 30: 6; 30 < s ≤ 40: 14; 40 < s ≤ 45: 12; 45 < s ≤ 50: 9; 50 < s ≤ 70: 8. Draw a histogram (frequency density axis 0 to 3.0, speed 20 to 70).",
    diagram: histGrid, marks: 3, answer: "Bars of height 0.6, 1.4, 2.4, 1.8 and 0.4",
    solution: ["Class widths 10, 10, 5, 5, 20", "Frequency densities 6÷10 = 0.6, 14÷10 = 1.4, 12÷5 = 2.4, 9÷5 = 1.8, 8÷20 = 0.4", "Draw bars of these heights with no gaps"],
    noWorking: "full",
    points: [
      { id: "B1a", code: "B1", criterion: "At least two frequency densities calculated correctly (0.6, 1.4, 2.4, 1.8, 0.4)." },
      { id: "B1b", code: "B1", criterion: "At least three bars (or frequency densities for three classes) correct." },
      { id: "B1c", code: "B1", criterion: "All five bars correct: frequency densities 0.6, 1.4, 2.4, 1.8 and 0.4, with the right class widths." },
    ],
    errors: [{ id: "wrong-operation", looksLike: "drew bars with height equal to the frequency instead of frequency density" }],
    markerNotes: ["The student can't draw on the printed grid. Accept a sketched histogram with the bar heights labelled, or the five frequency densities listed against their classes. Mike's scheme is B3, B2 for three or four bars, B1 for at least two densities: award B1a, B1b, B1c cumulatively to match."],
    dangerZones: [{ id: "fd", when: "the student is about to draw or list bar heights", warn: "Bar height is frequency density, not frequency. Check each class width." }],
    coach: {
      keyWords: [{ text: "histogram", why: "Bar height = frequency density = frequency ÷ class width." }],
      clues: ["Work out each class width: they aren't all the same.", "Frequency density = frequency ÷ class width.", "Draw each bar from its class's start to end, as tall as its frequency density."],
      traps: ["Did you divide every frequency by its own class width?"],
    },
  },
  {
    id: "ccb2-q10b", source: { paper: SRC, q: "10", part: "b" }, topic: "hist", tier: "H", calculator: true,
    prompt: "Work out an estimate for the number of cars with a speed greater than 60 mph.",
    promptText: "Speeds of 49 cars: the class 50 < s ≤ 70 has frequency 8. Work out an estimate for the number of cars with a speed greater than 60 mph.",
    marks: 1, answer: "4 cars", solution: ["60 to 70 is half of the 50 to 70 class", "½ × 8 = 4"], noWorking: "full",
    points: [{ id: "B1", code: "B1", criterion: "4 (half of the 50 < s ≤ 70 class).", reject: ["8 (the whole class)"] }],
    errors: [{ id: "stopped-early", looksLike: "gave 8, the whole of the last class: only half of it is above 60" }],
    dangerZones: [{ id: "half", when: "the student is using the 50 to 70 class", warn: "Only part of that class is above 60." }],
    coach: {
      keyWords: [{ text: "greater than 60 mph", why: "Only part of the last class." }],
      clues: ["Which class contains 60 mph?", "What fraction of the 50 to 70 class is above 60?", "Take that fraction of its frequency."],
      traps: ["Did you use only the part of the class above 60?"],
    },
  },
  {
    id: "ccb2-q11a", source: { paper: SRC, q: "11", part: "a" }, topic: "tree", tier: "H", calculator: true,
    prompt: "On any day, the probability that it rains is 0.3<br>If it rains, the probability that Sam is late for work is 0.4<br>If it does not rain, the probability that Sam is late for work is 0.1<br>Complete the probability tree diagram.<br><small>Write the three missing probabilities in your working, saying which branch each one is on.</small>",
    promptText: "P(rain) = 0.3. If it rains, P(late) = 0.4. If it does not rain, P(late) = 0.1. Complete the probability tree diagram: the missing values are on the No rain branch and the two Not late branches.",
    diagram: rainTree, marks: 2, answer: "No rain 0.7; Not late 0.6 and 0.9",
    solution: ["No rain: 1 − 0.3 = 0.7", "Not late after rain: 1 − 0.4 = 0.6", "Not late after no rain: 1 − 0.1 = 0.9"], noWorking: "full",
    points: [
      { id: "B1a", code: "B1", criterion: "0.7 on the 'No rain' branch." },
      { id: "B1b", code: "B1", criterion: "0.6 and 0.9 on the two 'Not late' branches (0.6 after Rain, 0.9 after No rain)." },
    ],
    errors: [{ id: "complement", looksLike: "put the wrong complement on a branch, e.g. 0.6 after No rain" }],
    markerNotes: ["The student can't write on the printed tree. Accept the values written with clear branch labels, or a redrawn tree."],
    dangerZones: [{ id: "pairs", when: "the student is filling in the branches", warn: "Each pair of branches from one point adds to 1." }],
    coach: {
      keyWords: [{ text: "Complete the probability tree diagram", why: "Each pair of branches must add up to 1." }],
      clues: ["Branches from the same point add up to 1.", "No rain = 1 − 0.3.", "Not late = 1 − the 'late' probability on that pair."],
      traps: ["Does every pair of branches add up to 1?"],
    },
  },
  {
    id: "ccb2-q11b", source: { paper: SRC, q: "11", part: "b" }, topic: "tree", tier: "H", calculator: true,
    prompt: "Work out the probability that Sam is late for work on any day.",
    promptText: "P(rain) = 0.3. If it rains, P(late) = 0.4. If it does not rain, P(late) = 0.1. Work out the probability that Sam is late for work on any day.",
    marks: 2, answer: "0.19", solution: ["0.3 × 0.4 = 0.12", "0.7 × 0.1 = 0.07", "0.12 + 0.07 = 0.19"], noWorking: "full",
    points: [
      { id: "M1", code: "M1", ft: true, criterion: "0.3 × 0.4 + 0.7 × 0.1 (ft their 0.7)." },
      { id: "A1", code: "A1", dep: ["M1"], criterion: "0.19", reject: ["0.5 (0.4 + 0.1)"] },
    ],
    errors: [{ id: "and-or", looksLike: "added 0.4 and 0.1 to get 0.5: each must first be multiplied along its branch" }],
    dangerZones: [{ id: "paths", when: "the student is combining probabilities", warn: "Multiply along each path, then add the paths that end in Late." }],
    coach: {
      keyWords: [{ text: "late for work", why: "Two ways to be late: rain and late, or no rain and late." }],
      clues: ["Find the two paths that end in 'Late'.", "Multiply along each path: 0.3 × 0.4 and 0.7 × 0.1.", "Add the two paths."],
      traps: ["Did you multiply along the branches before adding?"],
    },
  },
  {
    id: "ccb2-q11c", source: { paper: SRC, q: "11", part: "c" }, topic: "cond", tier: "H", calculator: true,
    prompt: "On Monday, Sam was late for work.<br>Work out the probability that it rained on Monday.",
    promptText: "P(rain) = 0.3. If it rains, P(late) = 0.4. If it does not rain, P(late) = 0.1, so P(late) = 0.19. On Monday, Sam was late for work. Work out the probability that it rained on Monday.",
    marks: 2, answer: "12/19", solution: ["P(rain and late) = 0.12", "P(late) = 0.19", "0.12 ÷ 0.19 = 12/19"], noWorking: "full",
    points: [
      { id: "M1", code: "M1", ft: true, criterion: "0.12 ÷ 0.19 (ft their (b))." },
      { id: "A1", code: "A1", dep: ["M1"], criterion: "12/19", accept: ["0.632 (or better)"], reject: ["0.3", "0.12"] },
    ],
    errors: [{ id: "wrong-denominator", looksLike: "answered 0.3 or 0.12: once Sam was late, only the 0.19 counts as the total" }],
    dangerZones: [{ id: "given", when: "the student is working out the probability", warn: "You know Sam was late. What's the total probability of that?" }],
    coach: {
      keyWords: [{ text: "Sam was late", why: "This is given: only the 'late' paths count now." }],
      clues: ["Only the days Sam is late count: that total is your answer to (b).", "Of that, the 'rain and late' part is 0.3 × 0.4.", "Divide the 'rain and late' probability by the total 'late' probability."],
      traps: ["Is your denominator the probability of being late?"],
    },
  },
  {
    id: "ccb2-q12a", source: { paper: SRC, q: "12", part: "a" }, topic: "bounds", tier: "H", calculator: true,
    prompt: "A rectangle has length 8.4 cm and width 5.7 cm.<br>Both measurements are correct to 1 decimal place.<br>Work out the lower bound for the area of the rectangle.",
    marks: 2, answer: "47.1775", solution: ["Lower bounds 8.35 and 5.65", "8.35 × 5.65 = 47.1775 cm²"], noWorking: "full",
    points: [
      { id: "M1", code: "M1", criterion: "8.35 × 5.65", reject: ["8.3 × 5.6"] },
      { id: "A1", code: "A1", dep: ["M1"], criterion: "47.1775", accept: ["47.2"] },
    ],
    errors: [
      { id: "bounds-half", looksLike: "used bounds of 8.4 ± 0.1: for 1 decimal place the bounds are ± 0.05" },
      { id: "no-bounds", looksLike: "worked out the area from 8.4 and 5.7 and then took 0.05 off the answer" },
    ],
    dangerZones: [{ id: "bounds", when: "the student is writing the bounds of 8.4 and 5.7", warn: "Half of 0.1 either side, and put the bounds on the measurements first." }],
    coach: {
      keyWords: [{ text: "correct to 1 decimal place", why: "Each value could be up to 0.05 either way." }, { text: "lower bound for the area", why: "Smallest length × smallest width." }],
      clues: ["Find the lower bound of each measurement: subtract 0.05.", "Lower bounds: 8.35 and 5.65.", "Multiply them."],
      traps: ["Did you use ± 0.05, not ± 0.1?"],
    },
  },
  {
    id: "ccb2-q12b", source: { paper: SRC, q: "12", part: "b" }, topic: "bounds", tier: "H", calculator: true,
    prompt: "Work out the upper bound for the perimeter of the rectangle.",
    promptText: "A rectangle has length 8.4 cm and width 5.7 cm, both correct to 1 decimal place. Work out the upper bound for the perimeter of the rectangle.",
    marks: 2, answer: "28.4", solution: ["Upper bounds 8.45 and 5.75", "2 × (8.45 + 5.75) = 28.4 cm"], noWorking: "full",
    points: [
      { id: "M1", code: "M1", criterion: "2 × (8.45 + 5.75)" },
      { id: "A1", code: "A1", dep: ["M1"], criterion: "28.4", reject: ["28.2 (from 8.4 and 5.7)"] },
    ],
    errors: [{ id: "bounds-half", looksLike: "used bounds of ± 0.1 instead of ± 0.05" }, { id: "no-bounds", looksLike: "used 8.4 and 5.7" }],
    dangerZones: [{ id: "upper", when: "the student is choosing values", warn: "Upper bound: the biggest each side could be." }],
    coach: {
      keyWords: [{ text: "upper bound for the perimeter", why: "Use the biggest possible length and width." }],
      clues: ["Find the upper bound of each measurement: add 0.05.", "Upper bounds: 8.45 and 5.75.", "Perimeter = 2 × (length + width)."],
      traps: ["Did you add all four sides?"],
    },
  },
  {
    id: "ccb2-q13", source: { paper: SRC, q: "13" }, topic: "volcone", tier: "H", calculator: true,
    prompt: "A cylinder of radius 6.5 cm stands on a horizontal table.<br>The cylinder contains water to a depth of 12 cm.<br>A solid metal sphere of radius 3 cm is lowered into the water until it is completely covered.<br>No water spills out of the cylinder.<br>Work out the rise in the level of the water.<br>Give your answer correct to 2 decimal places.",
    marks: 4, answer: "0.85 cm", solution: ["Sphere: 4/3 × π × 3³ = 36π (113.09…)", "π × 6.5² × h = 36π", "h = 36 ÷ 42.25 = 0.852…", "Rise = 0.85 cm"], noWorking: "full",
    showWorking: "Write the sphere's volume, then the cylinder equation with h in it.",
    points: [
      { id: "M1a", code: "M1", criterion: "Volume of sphere = 4/3 × π × 3³ = 36π (113.09…)" },
      { id: "M1b", code: "M1", ft: true, criterion: "π × 6.5² × h = 36π (their sphere volume)." },
      { id: "M1c", code: "M1", ft: true, dep: ["M1b"], criterion: "h = 36 ÷ 42.25 (or 113.09… ÷ 132.73…)." },
      { id: "A1", code: "A1", dep: ["M1c"], criterion: "0.85 (from 0.852…)" },
    ],
    errors: [
      { id: "wrong-formula", looksLike: "used the 12 cm depth, which isn't needed, or the sphere's radius in the cylinder formula" },
      { id: "rounding", looksLike: "rounded 36π early, changing the second decimal place" },
    ],
    dangerZones: [{ id: "rise", when: "the sphere's volume has been found", warn: "The rise is a thin cylinder of water with the cylinder's radius." }],
    coach: {
      keyWords: [{ text: "rise in the level", why: "Not the new depth: just how much it goes up." }, { text: "2 decimal places", why: "Keep full accuracy until the end." }],
      clues: ["The water rises by the sphere's volume.", "The extra water forms a cylinder of radius 6.5 cm and height h.", "Set π × 6.5² × h equal to the sphere's volume and solve for h."],
      traps: ["Did you leave out the 12 cm? It isn't needed."],
    },
  },
  {
    id: "ccb2-q14", source: { paper: SRC, q: "14" }, topic: "invprop", tier: "H", calculator: true,
    prompt: "P is inversely proportional to V.<br>P = 120 when V = 2.5<br>Work out the value of V when P = 80",
    marks: 3, answer: "V = 3.75", solution: ["P = k/V", "k = 120 × 2.5 = 300", "V = 300 ÷ 80"], noWorking: "full",
    showWorking: "Start with P = k/V written down.",
    points: [
      { id: "M1a", code: "M1", criterion: "P = k/V", reject: ["P = kV"] },
      { id: "M1b", code: "M1", dep: ["M1a"], criterion: "k = 120 × 2.5 = 300" },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "V = 300 ÷ 80 = 3.75", reject: ["1.67 (direct proportion)"] },
    ],
    errors: [{ id: "direct-inverse", looksLike: "treated it as direct proportion: 80 ÷ 120 × 2.5 = 1.67" }],
    markerNotes: ["Sense check: when P goes down, V must go up, so the answer is more than 2.5."],
    dangerZones: [{ id: "form", when: "the student is writing the proportion formula", warn: "Inversely proportional: k goes over V." }],
    coach: {
      keyWords: [{ text: "inversely proportional", why: "P = k ÷ V. As one goes up, the other goes down." }],
      clues: ["Write P = k/V.", "Find k using P = 120 and V = 2.5.", "Put P = 80 in and rearrange for V."],
      traps: ["P went down, so did V go up?"],
    },
  },
  {
    id: "ccb2-q15", source: { paper: SRC, q: "15" }, topic: "cosr", tier: "H", calculator: true,
    prompt: "The diagram shows a triangle.<br>Work out the size of the largest angle in the triangle.<br>Give your answer correct to 1 decimal place.",
    promptText: "A triangle has sides 7.2 cm, 9.5 cm and 12.1 cm. Work out the size of the largest angle in the triangle. Give your answer correct to 1 decimal place.",
    diagram: scalene, marks: 3, answer: "91.8°",
    solution: ["Largest angle is opposite 12.1 cm", "cos x = (7.2² + 9.5² − 12.1²) / (2 × 7.2 × 9.5)", "cos x = −0.0315…", "x = 91.8°"], noWorking: "full",
    showWorking: "Write the cosine rule with the numbers in before using the calculator.",
    points: [
      { id: "M1a", code: "M1", criterion: "cos x = (7.2² + 9.5² − 12.1²) / (2 × 7.2 × 9.5) (the angle opposite the longest side)." },
      { id: "M1b", code: "M1", dep: ["M1a"], criterion: "cos x = −0.0315…" },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "91.8", reject: ["88.2 (negative sign dropped)", "one of the other angles"] },
    ],
    errors: [
      { id: "wrong-share", looksLike: "found one of the other angles: the largest angle is opposite the longest side, 12.1 cm" },
      { id: "sign-error", looksLike: "dropped the negative sign and gave 88.2°" },
      { id: "order-error", looksLike: "typed the fraction without brackets round the top and the bottom" },
    ],
    dangerZones: [
      { id: "which", when: "the student is setting up the cosine rule", warn: "The largest angle is opposite the longest side." },
      { id: "neg", when: "a cosine value has been worked out", warn: "Check the sign of your cosine before you find the angle." },
    ],
    coach: {
      keyWords: [{ text: "largest angle", why: "It's opposite the longest side, 12.1 cm." }, { text: "1 decimal place", why: "Round at the end." }],
      clues: ["Three sides, no angles: use the cosine rule.", "The angle you want is opposite 12.1 cm, so 12.1² is the one subtracted.", "cos x = (7.2² + 9.5² − 12.1²) ÷ (2 × 7.2 × 9.5), then use cos⁻¹."],
      traps: ["Is your angle opposite the 12.1 cm side?", "A negative cosine gives an angle over 90°: is yours?"],
    },
  },
  {
    id: "ccb2-q16", source: { paper: SRC, q: "16" }, topic: "algfrac", tier: "H", calculator: true,
    prompt: `Simplify fully &nbsp;<span class="eq">${fr("x<sup>2</sup> − 3x − 10", "x<sup>2</sup> − 25")}</span>`,
    promptText: "Simplify fully (x² − 3x − 10) / (x² − 25).",
    marks: 3, answer: "(x + 2)/(x + 5)", solution: ["x² − 3x − 10 = (x − 5)(x + 2)", "x² − 25 = (x − 5)(x + 5)", "= (x + 2)/(x + 5)"], noWorking: "full",
    showWorking: "Write both factorisations: each is a method mark.",
    points: [
      { id: "M1a", code: "M1", criterion: "Factorises the numerator: (x − 5)(x + 2)" },
      { id: "M1b", code: "M1", criterion: "Factorises the denominator: (x − 5)(x + 5)" },
      { id: "A1", code: "A1", dep: ["M1a", "M1b"], criterion: "(x + 2)/(x + 5)", reject: ["further 'cancelling' of x to get 2/5"] },
    ],
    errors: [
      { id: "wrong-operation", looksLike: "'cancelled' the x² terms, or the −10 with the −25, instead of whole factors" },
      { id: "not-simplified", looksLike: "carried on to cancel the x in (x + 2)/(x + 5), which isn't allowed" },
    ],
    dangerZones: [{ id: "factor", when: "the student is about to cancel", warn: "Only whole brackets cancel. Factorise both first." }],
    coach: {
      keyWords: [{ text: "Simplify fully", why: "Factorise top and bottom, then cancel common brackets." }],
      clues: ["Factorise the numerator: two numbers that multiply to −10 and add to −3.", "The denominator is a difference of two squares.", "Cancel the bracket that appears on top and bottom."],
      traps: ["Did you cancel only whole brackets?"],
    },
  },
  {
    id: "ccb2-q17a", source: { paper: SRC, q: "17", part: "a" }, topic: "iter", tier: "H", calculator: true,
    prompt: `Show that the equation &nbsp;<span class="eq">x<sup>3</sup> − 7x + 5 = 0</span>&nbsp; can be rearranged to give &nbsp;<span class="eq">x = ${fr("x<sup>3</sup> + 5", 7)}</span>`,
    promptText: "Show that the equation x³ − 7x + 5 = 0 can be rearranged to give x = (x³ + 5)/7.",
    marks: 1, answer: "Shown: x³ + 5 = 7x, so x = (x³ + 5)/7", solution: ["x³ + 5 = 7x", "x = (x³ + 5)/7"], noWorking: "zero",
    points: [{ id: "B1", code: "B1", criterion: "x³ + 5 = 7x, then dividing both sides by 7." }],
    errors: [{ id: "order-error", looksLike: "started from the given answer and worked backwards" }],
    dangerZones: [{ id: "start", when: "the student begins", warn: "Start from x³ − 7x + 5 = 0 and end at the given form." }],
    coach: {
      keyWords: [{ text: "Show that", why: "Every step must be written, starting from the first equation." }],
      clues: ["Start with x³ − 7x + 5 = 0.", "Move the 7x term to the other side.", "Divide both sides by 7."],
      traps: ["Did you start from the original equation?"],
    },
  },
  {
    id: "ccb2-q17b", source: { paper: SRC, q: "17", part: "b" }, topic: "iter", tier: "H", calculator: true,
    prompt: `Starting with x<sub>0</sub> = 1, use the iteration formula &nbsp;<span class="eq">x<sub>n+1</sub> = ${fr("x<sub>n</sub><sup>3</sup> + 5", 7)}</span><br>to work out the values of x<sub>1</sub>, x<sub>2</sub> and x<sub>3</sub><br>Give each value correct to 3 decimal places.`,
    promptText: "Starting with x0 = 1, use the iteration formula x(n+1) = (x(n)³ + 5)/7 to work out the values of x1, x2 and x3. Give each value correct to 3 decimal places.",
    marks: 3, answer: "0.857, 0.804, 0.789", solution: ["x1 = 6/7 = 0.857142…", "x2 = 0.804248…", "x3 = 0.788600…"], noWorking: "full",
    points: [
      { id: "B1a", code: "B1", criterion: "x1 = 0.857" },
      { id: "B1b", code: "B1", criterion: "x2 = 0.804" },
      { id: "B1c", code: "B1", criterion: "x3 = 0.789", reject: ["0.788 or 0.790 from re-entering rounded values"] },
    ],
    errors: [
      { id: "rounding", looksLike: "typed the rounded value back in each time, which changes the third decimal place" },
      { id: "order-error", looksLike: "forgot the brackets, so only the 5 was divided by 7" },
    ],
    dangerZones: [{ id: "ans", when: "x1 has been found", warn: "Use the full value (the ANS key), not the rounded one." }],
    coach: {
      keyWords: [{ text: "x0 = 1", why: "Your starting value." }, { text: "3 decimal places", why: "Round each answer, but keep full values in the calculator." }],
      clues: ["Put x0 = 1 into the formula to get x1.", "Type 1, press =, then (ANS³ + 5) ÷ 7.", "Press = again for x2 and again for x3."],
      traps: ["Did you use the unrounded value each time?"],
    },
  },
  {
    id: "ccb2-q18a", source: { paper: SRC, q: "18", part: "a" }, topic: "growth", tier: "H", calculator: true,
    prompt: "The value, £V, of a machine after t years is given by the formula<br><span class=\"eq\">V = 24 000 × 0.85<sup>t</sup></span><br>Work out the value of the machine after 3 years.",
    promptText: "V = 24 000 × 0.85^t. Work out the value of the machine after 3 years.",
    marks: 1, answer: "£14 739", solution: ["24 000 × 0.85³ = 14 739"], noWorking: "full",
    points: [{ id: "B1", code: "B1", criterion: "£14 739", reject: ["61 200 (24 000 × 0.85 × 3)"] }],
    errors: [{ id: "index-law", looksLike: "worked out 24 000 × 0.85 × 3 instead of 0.85³" }],
    dangerZones: [{ id: "power", when: "the student is substituting t = 3", warn: "t is a power, not a multiplier." }],
    coach: {
      keyWords: [{ text: "0.85t", why: "0.85 to the power t." }],
      clues: ["Substitute t = 3.", "0.85 is raised to the power 3.", "Multiply 24 000 by 0.85³."],
      traps: ["Is your answer less than £24 000?"],
    },
  },
  {
    id: "ccb2-q18b", source: { paper: SRC, q: "18", part: "b" }, topic: "growth", tier: "H", calculator: true,
    prompt: "After how many complete years will the value of the machine first be less than £8000?<br>You must show all your working.",
    promptText: "V = 24 000 × 0.85^t. After how many complete years will the value of the machine first be less than £8000? You must show all your working.",
    marks: 3, answer: "7 years", solution: ["t = 6: 24 000 × 0.85⁶ = £9051.59", "t = 7: 24 000 × 0.85⁷ = £7693.85", "7 years"], noWorking: "zero",
    showWorking: "This question says 'You must show all your working': show the values for 6 and 7 years.",
    points: [
      { id: "M1a", code: "M1", criterion: "Substitutes at least one further value of t into the formula." },
      { id: "M1b", code: "M1", criterion: "Values for t = 6 (£9051.59) and t = 7 (£7693.85)." },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "7", reject: ["6", "7 with nothing to support it"] },
    ],
    errors: [{ id: "stopped-early", looksLike: "gave 6 years, when the value is still above £8000" }],
    dangerZones: [{ id: "both", when: "the student has tried a value of t", warn: "Show the year above £8000 and the year below it." }],
    coach: {
      keyWords: [{ text: "first be less than £8000", why: "Find the first whole year it drops below." }, { text: "You must show all your working", why: "Show the values either side." }],
      clues: ["Try different whole numbers of years in the formula.", "Find the last year it's above £8000.", "Show that year and the next one, with their values."],
      traps: ["Have you shown the values for both years either side of £8000?"],
    },
  },
  {
    id: "ccb2-q19a", source: { paper: SRC, q: "19", part: "a" }, topic: "vecproof", tier: "H", calculator: true,
    prompt: "OAB is a triangle. &nbsp;OA = <b>a</b> &nbsp;&nbsp; OB = <b>b</b><br>P is the point on AB such that AP : PB = 3 : 1<br>Find the vector AB in terms of <b>a</b> and <b>b</b>.",
    promptText: "OAB is a triangle. Vector OA = a, vector OB = b. P is the point on AB such that AP : PB = 3 : 1. Find vector AB in terms of a and b.",
    diagram: vectorOAB, marks: 1, answer: "b − a", solution: ["AB = AO + OB = −a + b"], noWorking: "full",
    points: [{ id: "B1", code: "B1", criterion: "AB = b − a oe", reject: ["a + b", "a − b"] }],
    errors: [{ id: "sign-error", looksLike: "wrote a + b or a − b" }],
    dangerZones: [{ id: "route", when: "the student is finding AB", warn: "Go from A back to O, then O to B." }],
    coach: {
      keyWords: [{ text: "AB", why: "From A to B. Go via O." }],
      clues: ["Find a route from A to B through O.", "A to O is the reverse of OA.", "Then add O to B."],
      traps: ["Going backwards along a vector changes its sign: did you?"],
    },
  },
  {
    id: "ccb2-q19b", source: { paper: SRC, q: "19", part: "b" }, topic: "vecproof", tier: "H", calculator: true,
    prompt: "Find the vector OP in terms of <b>a</b> and <b>b</b>. Give your answer in its simplest form.",
    promptText: "OA = a, OB = b, AB = b − a. P is on AB with AP : PB = 3 : 1. Find vector OP in terms of a and b, in its simplest form.",
    diagram: vectorOAB, marks: 3, answer: "1/4 a + 3/4 b",
    solution: ["AP = 3/4 (b − a)", "OP = a + 3/4 (b − a)", "= 1/4 a + 3/4 b"], noWorking: "full",
    showWorking: "Write AP as a fraction of AB first.",
    points: [
      { id: "M1a", code: "M1", ft: true, criterion: "AP = 3/4 (b − a)", reject: ["1/3 (b − a)"] },
      { id: "M1b", code: "M1", ft: true, dep: ["M1a"], criterion: "OP = a + 3/4 (b − a)" },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "1/4 a + 3/4 b", accept: ["(a + 3b)/4"], reject: ["unsimplified a + 3/4 b − 3/4 a"] },
    ],
    errors: [
      { id: "wrong-ratio", looksLike: "read the ratio 3 : 1 as 1/3: P is 3/4 of the way from A to B because there are 4 parts" },
      { id: "not-simplified", looksLike: "didn't simplify the final answer" },
    ],
    dangerZones: [{ id: "frac", when: "the student is turning the ratio into a fraction", warn: "3 : 1 is 4 parts in total." }],
    coach: {
      keyWords: [{ text: "simplest form", why: "Collect the a terms and the b terms." }],
      clues: ["AP : PB = 3 : 1, so AP is 3/4 of AB.", "OP = OA + AP.", "Expand and collect the a terms."],
      traps: ["Is your fraction out of 4, not 3?", "Have you collected the a terms?"],
    },
  },
  {
    id: "ccb2-q20a", source: { paper: SRC, q: "20", part: "a" }, topic: "formeq", tier: "H", calculator: true,
    prompt: "The diagram shows a rectangle. All measurements are in centimetres.<br>The area of the rectangle is 30 cm<sup>2</sup><br>Show that &nbsp;<span class=\"eq\">x<sup>2</sup> + 4x − 35 = 0</span>",
    promptText: "A rectangle has sides (x − 1) cm and (x + 5) cm. The area of the rectangle is 30 cm². Show that x² + 4x − 35 = 0.",
    diagram: rectX, marks: 2, answer: "Shown: (x + 5)(x − 1) = 30 gives x² + 4x − 35 = 0",
    solution: ["(x + 5)(x − 1) = 30", "x² + 4x − 5 = 30", "x² + 4x − 35 = 0"], noWorking: "zero",
    points: [
      { id: "M1", code: "M1", criterion: "(x + 5)(x − 1) = 30" },
      { id: "A1", code: "A1", dep: ["M1"], criterion: "x² + 4x − 5 = 30, leading to x² + 4x − 35 = 0 (expansion shown)." },
    ],
    errors: [
      { id: "order-error", looksLike: "started from the given equation and worked backwards: a 'show that' must begin with the area" },
      { id: "missed-term", looksLike: "expanded (x + 5)(x − 1) with a missing or wrong term" },
    ],
    dangerZones: [{ id: "start", when: "the student begins", warn: "Start with length × width = 30." }],
    coach: {
      keyWords: [{ text: "Show that", why: "Start from the area and arrive at the equation." }, { text: "30 cm2", why: "Length × width = 30." }],
      clues: ["Area = length × width.", "Write (x + 5)(x − 1) = 30.", "Expand the brackets and subtract 30 from both sides."],
      traps: ["Did you show the expanded brackets?"],
    },
  },
  {
    id: "ccb2-q20b", source: { paper: SRC, q: "20", part: "b" }, topic: "qform", tier: "H", calculator: true,
    prompt: "Work out the perimeter of the rectangle.<br>Give your answer correct to 3 significant figures.",
    promptText: "A rectangle has sides (x − 1) cm and (x + 5) cm, and x² + 4x − 35 = 0. Work out the perimeter of the rectangle. Give your answer correct to 3 significant figures.",
    diagram: rectX, marks: 3, answer: "25.0 cm",
    solution: ["x = (−4 ± √(16 + 140)) / 2", "x = 4.245 (reject the negative solution)", "Perimeter = 4x + 8 = 24.98… = 25.0 cm"], noWorking: "full",
    showWorking: "Write the formula with numbers in, then x, then the perimeter.",
    points: [
      { id: "M1", code: "M1", criterion: "x = (−4 ± √(16 + 140)) / 2" },
      { id: "A1a", code: "A1", dep: ["M1"], criterion: "x = 4.245 (rejecting the negative solution)." },
      { id: "A1b", code: "A1", dep: ["M1"], criterion: "Perimeter = 2(x + 5) + 2(x − 1) = 4x + 8 = 25.0", accept: ["24.98"], reject: ["4.24 (x, not the perimeter)"] },
    ],
    errors: [
      { id: "stopped-early", looksLike: "stopped at x = 4.24: the question asks for the perimeter" },
      { id: "sign-error", looksLike: "used the negative root, which would give negative lengths" },
    ],
    dangerZones: [
      { id: "neg", when: "both solutions for x have been found", warn: "A length can't be negative. Which x works?" },
      { id: "perim", when: "x has been found", warn: "The question asks for the perimeter." },
    ],
    coach: {
      keyWords: [{ text: "perimeter", why: "Not x: add up all four sides." }, { text: "3 significant figures", why: "Keep x unrounded until the end." }],
      clues: ["x² + 4x − 35 = 0 doesn't factorise nicely: use the formula.", "Reject the negative value of x.", "Perimeter = 2(x + 5) + 2(x − 1)."],
      traps: ["Is your answer the perimeter, not x?"],
    },
  },
  {
    id: "ccb2-q21", source: { paper: SRC, q: "21" }, topic: "arcs", tier: "H", calculator: true,
    prompt: "A and B are points on a circle, centre O, with radius 7.5 cm.<br>Angle AOB = 110°<br>Work out the area of the shaded segment.<br>Give your answer correct to 3 significant figures.",
    diagram: segment, marks: 4, answer: "27.6 cm²",
    solution: ["Sector: 110/360 × π × 7.5² = 53.99…", "Triangle: ½ × 7.5² × sin 110° = 26.42…", "Segment = 53.99… − 26.42… = 27.57… = 27.6 cm²"], noWorking: "full",
    showWorking: "Write the sector area and the triangle area as separate lines.",
    points: [
      { id: "M1a", code: "M1", criterion: "Sector: 110/360 × π × 7.5² (= 53.99…)" },
      { id: "M1b", code: "M1", criterion: "Triangle: ½ × 7.5² × sin 110° (= 26.42…)", reject: ["½ × 7.5 × 7.5 (as if right-angled)"] },
      { id: "M1c", code: "M1", ft: true, dep: ["M1a", "M1b"], criterion: "Sector − triangle" },
      { id: "A1", code: "A1", dep: ["M1c"], criterion: "27.6" },
    ],
    errors: [
      { id: "stopped-early", looksLike: "gave the area of the sector and forgot to take off the triangle" },
      { id: "wrong-formula", looksLike: "used ½ × base × height with 7.5 × 7.5, as if the triangle were right-angled" },
      { id: "rounding", looksLike: "rounded the two areas before subtracting" },
    ],
    dangerZones: [
      { id: "triangle", when: "the sector area has been found", warn: "The segment is the sector minus the triangle." },
      { id: "sin", when: "the student is working out the triangle area", warn: "The triangle isn't right-angled. Use ½ab sin C." },
    ],
    coach: {
      keyWords: [{ text: "shaded segment", why: "Sector minus triangle." }, { text: "3 significant figures", why: "Round only at the end." }],
      clues: ["Segment = sector − triangle AOB.", "Sector = 110/360 × π × 7.5².", "Triangle = ½ × 7.5 × 7.5 × sin 110°."],
      traps: ["Did you subtract the triangle?", "Did you round only at the end?"],
    },
  },
];
