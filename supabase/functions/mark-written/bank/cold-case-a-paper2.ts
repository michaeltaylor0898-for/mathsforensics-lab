// Cold Case A · Higher Paper 2 (calculator) · all 22 questions, 80 marks (CC-A/2H)
//
// Question wording is copied from the paper. Mark points follow Mike's Cold Case A Paper 2 Forensic
// Mark Scheme line for line; errors and Mike-mode danger zones come from its "Where the marks go
// missing" boxes.
import type { Scheme } from "../schemes.ts";

const fr = (n: string | number, d: string | number) => `<span class="fr"><span>${n}</span><span>${d}</span></span>`;
const SRC = "CC-A/2H";
const TXT = `font-family="Times New Roman,serif" fill="currentColor"`;
const NDA = (x: number, y: number) => `<text x="${x}" y="${y}" font-size="9" text-anchor="middle" fill="currentColor" opacity=".7" font-family="Arial,sans-serif">Not drawn accurately</text>`;
const table = (rows: (string | number)[][]) =>
  `<table class="qt">${rows.map((r, i) => `<tr>${r.map((c) => (i === 0 ? `<th>${c}</th>` : `<td>${c}</td>`)).join("")}</tr>`).join("")}</table>`;

// ---------- diagrams ----------
const rightPQR = `<svg viewBox="0 0 280 160" role="img" aria-label="Right-angled triangle PQR with the right angle at Q. PQ is horizontal, 8.4 cm. QR is vertical, 5.7 cm. The angle x is at P."><path d="M30 135 L240 135 L240 30 Z" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M228 135 V123 H240" fill="none" stroke="currentColor" stroke-width="1.1"/><path d="M62 135 A32 32 0 0 0 59 121" fill="none" stroke="currentColor" stroke-width="1.1"/><g ${TXT} font-size="13"><text x="16" y="140" font-style="italic">P</text><text x="246" y="140" font-style="italic">Q</text><text x="246" y="28" font-style="italic">R</text><text x="66" y="128" font-style="italic">x</text><text x="246" y="88">5.7 cm</text><text x="135" y="151" text-anchor="middle">8.4 cm</text></g></svg>`;

const coneA2 = `<svg viewBox="0 0 220 190" role="img" aria-label="A solid cone with base radius 4.5 cm and perpendicular height 11 cm."><g fill="none" stroke="currentColor" stroke-width="1.5"><ellipse cx="110" cy="150" rx="55" ry="11"/><path d="M55 150 L110 20 L165 150"/><path d="M110 20 V150 H165" stroke-dasharray="4 3" stroke-width="1.1"/><path d="M110 140 h10 v10" stroke-width="1"/></g><g ${TXT} font-size="12"><text x="104" y="118" text-anchor="end">11 cm</text><text x="170" y="156">4.5 cm</text></g>${NDA(110, 184)}</svg>`;

const triA2 = `<svg viewBox="0 -12 280 172" role="img" aria-label="Triangle ABC with AB along the bottom. Angle BAC is 48 degrees, angle ABC is 67 degrees and BC is 9.2 cm. C is at the top."><path d="M40 140 L220 140 L162.3 4.1 Z" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M68 140 A28 28 0 0 0 58.7 119.2 M200 140 A20 20 0 0 1 212.2 121.6" fill="none" stroke="currentColor" stroke-width="1.1"/><g ${TXT} font-size="12"><text x="26" y="146" font-style="italic">A</text><text x="224" y="146" font-style="italic">B</text><text x="158" y="-2" font-style="italic">C</text><text x="70" y="132">48°</text><text x="180" y="132">67°</text><text x="198" y="72">9.2 cm</text></g>${NDA(130, 157)}</svg>`;

const cuboidAG = `<svg viewBox="0 0 300 190" role="img" aria-label="Cuboid ABCDEFGH with AB = 12 cm along the front, BC = 5 cm going back and CG = 8 cm going up. The diagonal AG is drawn."><g fill="none" stroke="currentColor" stroke-width="1.5"><path d="M40 150 H190 V70 H40 Z M190 150 L250 100 V20 H100 L40 70 M190 70 L250 20"/><path d="M40 150 L100 100 H250 M100 100 V20" stroke-dasharray="4 3" stroke-width="1"/><path d="M40 150 L250 20" stroke-width="1.3"/><path d="M40 150 L250 100" stroke-dasharray="4 3" stroke-width="1"/></g><g ${TXT} font-size="12" font-style="italic"><text x="30" y="164">A</text><text x="192" y="164">B</text><text x="254" y="104">C</text><text x="86" y="98">D</text><text x="28" y="68">E</text><text x="194" y="84">F</text><text x="254" y="18">G</text><text x="92" y="16">H</text></g><g ${TXT} font-size="12"><text x="115" y="166" text-anchor="middle">12 cm</text><text x="226" y="136">5 cm</text><text x="256" y="62">8 cm</text></g>${NDA(150, 184)}</svg>`;

const shipA2 = (() => {
  const k = 9, A = [60, 175], rad = (d: number) => (d * Math.PI) / 180;
  const B = [A[0] + 14 * k * Math.sin(rad(70)), A[1] - 14 * k * Math.cos(rad(70))];
  const C = [B[0] + 9 * k * Math.sin(rad(150)), B[1] - 9 * k * Math.cos(rad(150))];
  const p = (q: number[]) => `${q[0].toFixed(1)} ${q[1].toFixed(1)}`;
  return `<svg viewBox="0 0 270 225" role="img" aria-label="A ship sails 14 km from A to B on a bearing of 070 degrees, then 9 km from B to C on a bearing of 150 degrees. North lines are drawn at A and B."><g fill="none" stroke="currentColor" stroke-width="1.5"><path d="M${p(A)} V${A[1] - 60} M${p(B)} V${B[1] - 60} M${p(A)} L${p(B)} L${p(C)}"/><path d="M${A[0] - 5} ${A[1] - 52} L${A[0]} ${A[1] - 62} L${A[0] + 5} ${A[1] - 52} M${B[0] - 5} ${B[1] - 52} L${B[0]} ${B[1] - 62} L${B[0] + 5} ${B[1] - 52}"/><path d="M${p(A)} L${p(C)}" stroke-dasharray="4 3" stroke-width="1"/></g><g ${TXT} font-size="12"><text x="${A[0] - 5}" y="${A[1] - 66}">N</text><text x="${B[0] - 5}" y="${B[1] - 66}">N</text><text x="${A[0] - 14}" y="${A[1] + 12}" font-style="italic">A</text><text x="${B[0] - 14}" y="${B[1] - 2}" font-style="italic">B</text><text x="${C[0] + 4}" y="${C[1] + 12}" font-style="italic">C</text><text x="${A[0] + 6}" y="${A[1] - 30}">70°</text><text x="${B[0] + 8}" y="${B[1] - 20}">150°</text><text x="${(A[0] + B[0]) / 2 + 4}" y="${(A[1] + B[1]) / 2 + 18}">14 km</text><text x="${(B[0] + C[0]) / 2 + 8}" y="${(B[1] + C[1]) / 2}">9 km</text></g>${NDA(135, 222)}</svg>`;
})();

const MASS = "Masses of 60 adults: 40 < m ≤ 50: 7; 50 < m ≤ 60: 15; 60 < m ≤ 70: 21; 70 < m ≤ 80: 12; 80 < m ≤ 90: 5.";
const massTable = table([["Mass (m kg)", "Frequency"], ["40 &lt; m ≤ 50", 7], ["50 &lt; m ≤ 60", 15], ["60 &lt; m ≤ 70", 21], ["70 &lt; m ≤ 80", 12], ["80 &lt; m ≤ 90", 5]]);
const DEER = "A ranger catches 40 deer, tags them and releases them. A week later she catches 60 deer, and 8 of these have a tag.";
const CAR = "A car travels 142 m, correct to the nearest metre, in 8.6 seconds, correct to 1 decimal place.";
const TRI = "ABC is a triangle with angle BAC = 48°, angle ABC = 67° and BC = 9.2 cm.";
const ITER = "x³ + 4x = 20.";
const EXPG = "The graph of y = abˣ passes through (0, 3) and (2, 12). a and b are positive constants.";

export const COLD_CASE_A2: Scheme[] = [
  {
    id: "cca2-q1a", source: { paper: SRC, q: "1", part: "a" }, topic: "round", tier: "H", calculator: true,
    prompt: `Use your calculator to work out &nbsp;<span class="eq">${fr("7.3<sup>2</sup> + √18.4", "5.6 − 2.91")}</span><br>Write down all the figures on your calculator display.`,
    promptText: "Use your calculator to work out (7.3² + √18.4) / (5.6 − 2.91). Write down all the figures on your calculator display.",
    marks: 2, answer: "21.40502681", solution: ["7.3² + √18.4 = 57.579…", "5.6 − 2.91 = 2.69", "57.579… ÷ 2.69 = 21.40502681"], noWorking: "full",
    showWorking: "Write the top and the bottom as separate values before dividing.",
    points: [
      { id: "M1", code: "M1", criterion: "57.579… (the numerator) or 2.69 (the denominator) seen." },
      { id: "A1", code: "A1", dep: ["M1"], criterion: "21.405026… (at least five figures).", reject: ["21.4 (rounded)"] },
    ],
    errors: [
      { id: "order-error", looksLike: "typed it in one line without brackets, so only √18.4 was divided by 5.6" },
      { id: "rounding", looksLike: "rounded in part (a), where the question asks for all the figures" },
    ],
    dangerZones: [{ id: "brackets", when: "the student is about to divide", warn: "Use the fraction button, or brackets round the top and the bottom." }],
    coach: {
      keyWords: [{ text: "all the figures", why: "Don't round. Copy every digit." }],
      clues: ["Work out the top and the bottom separately.", "Top: 7.3² + √18.4. Bottom: 5.6 − 2.91.", "Divide, using the fraction button."],
      traps: ["Have you written every figure?"],
    },
  },
  {
    id: "cca2-q1b", source: { paper: SRC, q: "1", part: "b" }, topic: "round", tier: "H", calculator: true,
    prompt: "Write your answer to part (a) correct to 3 significant figures.",
    promptText: "Write your answer to part (a) (21.40502681 if correct) correct to 3 significant figures.",
    marks: 1, answer: "21.4", solution: ["21.405… → 21.4"], noWorking: "full",
    points: [{ id: "B1", code: "B1", ft: true, criterion: "21.4 (ft their answer to (a)).", reject: ["21.41", "21"] }],
    errors: [{ id: "rounding", looksLike: "rounded to the wrong number of figures" }],
    dangerZones: [{ id: "sf", when: "the student is rounding", warn: "Count significant figures from the first non-zero digit." }],
    coach: {
      keyWords: [{ text: "3 significant figures", why: "Three digits, counting from the first non-zero one." }],
      clues: ["The first three significant figures are 2, 1 and 4.", "Look at the next digit.", "Round."],
      traps: ["Have you kept three figures?"],
    },
  },
  {
    id: "cca2-q2", source: { paper: SRC, q: "2" }, topic: "lin", tier: "H", calculator: true,
    prompt: "Solve &nbsp;<span class=\"eq\">7x − 4 = 3(x + 5)</span>",
    marks: 3, answer: "x = 4.75", solution: ["7x − 4 = 3x + 15", "4x = 19", "x = 4.75"], noWorking: "full",
    points: [
      { id: "M1a", code: "M1", criterion: "Expands the bracket: 3x + 15", reject: ["3x + 5"] },
      { id: "M1b", code: "M1", ft: true, dep: ["M1a"], criterion: "4x = 19" },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "x = 4.75 oe", accept: ["19/4", "4 3/4"], reject: ["4.8 or 5 (rounded)"] },
    ],
    errors: [
      { id: "missed-term", looksLike: "wrote 3x + 5, not multiplying the 5 by 3" },
      { id: "rounding", looksLike: "rounded to 4.8 or 5: the answer isn't a whole number and should be left exact" },
    ],
    dangerZones: [{ id: "expand", when: "the student is expanding the bracket", warn: "Multiply both terms inside by 3." }],
    coach: {
      keyWords: [{ text: "Solve", why: "Find x. It doesn't have to be a whole number." }],
      clues: ["Expand the bracket.", "Get the x terms on one side and numbers on the other.", "Divide, and leave the answer exact."],
      traps: ["Did you leave the answer exact?"],
    },
  },
  {
    id: "cca2-q3", source: { paper: SRC, q: "3" }, topic: "ratio", tier: "H", calculator: true,
    prompt: "A jacket costs €84 in Spain.<br>The same jacket costs £75 in the UK.<br>The exchange rate is £1 = €1.16<br>In which country is the jacket cheaper, and by how much? Give your answer in pounds.",
    marks: 3, answer: "Spain, by £2.59", solution: ["84 ÷ 1.16 = £72.41", "75 − 72.41 = £2.59", "Spain is cheaper"], noWorking: "full",
    points: [
      { id: "M1", code: "M1", criterion: "84 ÷ 1.16 (or 75 × 1.16)", reject: ["84 × 1.16"] },
      { id: "A1a", code: "A1", dep: ["M1"], criterion: "£72.41 (or €87)" },
      { id: "A1b", code: "A1", dep: ["M1"], criterion: "Spain, cheaper by £2.59", reject: ["€3 (difference in euros)"] },
    ],
    errors: [
      { id: "wrong-operation", looksLike: "multiplied when they should divide: 84 × 1.16 gives £97.44" },
      { id: "wrong-form", looksLike: "gave the difference in euros (€3) when the question asks for pounds" },
    ],
    markerNotes: ["Sense check: a pound is worth more than a euro, so the number of pounds must be smaller than the number of euros."],
    dangerZones: [{ id: "dir", when: "the student is converting euros", warn: "Should the pounds figure be smaller or bigger than 84?" }],
    coach: {
      keyWords: [{ text: "Give your answer in pounds", why: "Convert the euro price to pounds." }],
      clues: ["£1 = €1.16, so divide euros by 1.16.", "Compare with £75.", "Name the cheaper country and the difference in pounds."],
      traps: ["Is your difference in pounds?"],
    },
  },
  {
    id: "cca2-q4", source: { paper: SRC, q: "4" }, topic: "trig", tier: "H", calculator: true,
    prompt: "PQR is a right-angled triangle.<br>Work out the size of the angle marked x. Give your answer correct to 1 decimal place.",
    promptText: "PQR is right-angled at Q. PQ = 8.4 cm, QR = 5.7 cm. The angle x is at P. Work out x, correct to 1 decimal place.",
    diagram: rightPQR, marks: 3, answer: "34.2°", solution: ["tan x = 5.7 / 8.4", "x = tan⁻¹(5.7/8.4)", "= 34.159…"], noWorking: "full",
    points: [
      { id: "M1a", code: "M1", criterion: "tan x = 5.7 / 8.4", reject: ["tan x = 8.4 / 5.7"] },
      { id: "M1b", code: "M1", dep: ["M1a"], criterion: "x = tan⁻¹(5.7 / 8.4)" },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "34.2 (from 34.159…)", reject: ["55.8 (the other angle)"] },
    ],
    errors: [
      { id: "wrong-ratio", looksLike: "chose the wrong ratio: the two sides are opposite and adjacent, so it's tan" },
      { id: "swapped", looksLike: "divided the wrong way round, giving 55.8°, the other angle" },
      { id: "rounding", looksLike: "calculator in radians or gradians mode" },
    ],
    dangerZones: [{ id: "label", when: "the student is choosing a ratio", warn: "Label opposite, adjacent and hypotenuse from x." }],
    coach: {
      keyWords: [{ text: "angle marked x", why: "Label the sides from x." }],
      clues: ["From x: 5.7 is opposite, 8.4 is adjacent.", "Opposite and adjacent: tan.", "x = tan⁻¹(opposite ÷ adjacent)."],
      traps: ["Is your calculator in degrees?"],
    },
  },
  {
    id: "cca2-q5", source: { paper: SRC, q: "5" }, topic: "growth", tier: "H", calculator: true,
    prompt: "A car is bought for £18 500<br>The value of the car depreciates by 12% each year.<br>Work out the value of the car after 3 years. Give your answer correct to the nearest penny.",
    marks: 3, answer: "£12 607.23", solution: ["Multiplier 0.88", "18 500 × 0.88³ = 12 607.232"], noWorking: "full",
    points: [
      { id: "M1a", code: "M1", criterion: "Uses the multiplier 0.88", reject: ["1.12", "0.12³"] },
      { id: "M1b", code: "M1", dep: ["M1a"], criterion: "18 500 × 0.88³" },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "£12 607.23", reject: ["£11 840 (simple depreciation)"] },
    ],
    errors: [
      { id: "simple-compound", looksLike: "took off 12% of the original price three times, giving £11 840 (at most 1 mark)" },
      { id: "wrong-operation", looksLike: "used 1.12 (an increase) or 0.12³" },
    ],
    dangerZones: [{ id: "mult", when: "the student is choosing a multiplier", warn: "A 12% fall: what's left each year?" }],
    coach: {
      keyWords: [{ text: "depreciates by 12% each year", why: "× 0.88, three times." }, { text: "nearest penny", why: "Two decimal places." }],
      clues: ["A 12% decrease is a multiplier of 0.88.", "Three years: 0.88³.", "18 500 × 0.88³, to the nearest penny."],
      traps: ["Is your answer to 2 decimal places?"],
    },
  },
  {
    id: "cca2-q6", source: { paper: SRC, q: "6" }, topic: "sf", tier: "H", calculator: true,
    prompt: "Light travels at a speed of 2.998 × 10<sup>5</sup> km/s.<br>The distance from the Sun to the Earth is 1.496 × 10<sup>8</sup> km.<br>Work out the time it takes light to travel from the Sun to the Earth.<br>Give your answer in minutes, correct to 1 decimal place.",
    promptText: "Light travels at 2.998 × 10^5 km/s. The Sun is 1.496 × 10^8 km from the Earth. Work out the time light takes from the Sun to the Earth, in minutes, correct to 1 decimal place.",
    marks: 3, answer: "8.3 minutes", solution: ["(1.496 × 10⁸) ÷ (2.998 × 10⁵) = 499 s", "499 ÷ 60 = 8.316…"], noWorking: "full",
    points: [
      { id: "M1", code: "M1", criterion: "(1.496 × 10⁸) ÷ (2.998 × 10⁵)", reject: ["multiplying the two numbers"] },
      { id: "A1a", code: "A1", dep: ["M1"], criterion: "499 seconds (498.99…)" },
      { id: "A1b", code: "A1", dep: ["M1"], criterion: "8.3 (from 499 ÷ 60 = 8.316…)", reject: ["499 (seconds)"] },
    ],
    errors: [
      { id: "wrong-operation", looksLike: "multiplied the two numbers: time = distance ÷ speed" },
      { id: "stopped-early", looksLike: "stopped at 499, which is in seconds" },
      { id: "index-law", looksLike: "typed standard form with ×10 then the power button, giving an answer 10 times too big" },
    ],
    dangerZones: [{ id: "mins", when: "a value near 499 has been found", warn: "That's in seconds. The question asks for minutes." }],
    coach: {
      keyWords: [{ text: "in minutes", why: "The speed is per second: convert at the end." }],
      clues: ["Time = distance ÷ speed.", "Use the ×10ˣ key for standard form.", "Divide the seconds by 60."],
      traps: ["Is your answer in minutes?"],
    },
  },
  {
    id: "cca2-q7a", source: { paper: SRC, q: "7", part: "a" }, topic: "freqtab", tier: "H", calculator: true,
    prompt: `The table shows information about the masses, m kg, of 60 adults.${massTable}Write down the modal class.`,
    promptText: `${MASS} Write down the modal class.`,
    marks: 1, answer: "60 < m ≤ 70", solution: ["The highest frequency is 21"], noWorking: "full",
    points: [{ id: "B1", code: "B1", criterion: "60 < m ≤ 70", reject: ["21 (the frequency)"] }],
    errors: [{ id: "wrong-share", looksLike: "gave the frequency (21) and not the class" }],
    dangerZones: [{ id: "class", when: "the student is answering", warn: "Give the class, not the frequency." }],
    coach: {
      keyWords: [{ text: "modal class", why: "The class with the highest frequency." }],
      clues: ["Find the biggest frequency.", "Which class does it belong to?", "Write the class, not the number."],
      traps: ["Is your answer a class?"],
    },
  },
  {
    id: "cca2-q7b", source: { paper: SRC, q: "7", part: "b" }, topic: "freqtab", tier: "H", calculator: true,
    prompt: "Work out an estimate for the mean mass. Give your answer correct to 1 decimal place.",
    promptText: `${MASS} Work out an estimate for the mean mass, correct to 1 decimal place.`,
    marks: 3, answer: "63.8 kg", solution: ["45 × 7 + 55 × 15 + 65 × 21 + 75 × 12 + 85 × 5 = 3830", "3830 ÷ 60 = 63.83…"], noWorking: "full",
    showWorking: "Write the midpoint × frequency products before adding.",
    points: [
      { id: "M1a", code: "M1", criterion: "Multiplies midpoints by frequencies: 45 × 7, 55 × 15, 65 × 21, 75 × 12, 85 × 5 (at least four correct)." },
      { id: "M1b", code: "M1", ft: true, dep: ["M1a"], criterion: "3830 ÷ 60", reject: ["÷ 5"] },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "63.8 (from 63.83…)" },
    ],
    errors: [
      { id: "wrong-denominator", looksLike: "divided by 5 (the number of rows) and not by 60" },
      { id: "midpoint", looksLike: "used the end of each class and not the midpoint" },
    ],
    markerNotes: ["Sense check: the mean must lie near the middle classes."],
    dangerZones: [{ id: "mid", when: "the student is multiplying", warn: "Use the midpoint of each class." }],
    coach: {
      keyWords: [{ text: "estimate", why: "Use midpoints." }, { text: "mean mass", why: "Total of midpoint × frequency, divided by all 60 adults." }],
      clues: ["Midpoints are 45, 55, 65, 75, 85.", "Multiply each by its frequency and add.", "Divide by 60."],
      traps: ["Is your mean between 40 and 90, near the middle?"],
    },
  },
  {
    id: "cca2-q8a", source: { paper: SRC, q: "8", part: "a" }, topic: "brackets", tier: "H", calculator: true,
    prompt: "Factorise fully &nbsp;<span class=\"eq\">6x<sup>2</sup>y − 9xy<sup>2</sup></span>", promptText: "Factorise fully 6x²y − 9xy².",
    marks: 2, answer: "3xy(2x − 3y)", solution: ["HCF = 3xy", "3xy(2x − 3y)"], noWorking: "full",
    points: [
      { id: "M1", code: "M1", criterion: "A correct partial factorisation, e.g. 3x(2xy − 3y²) or xy(6x − 9y)" },
      { id: "A1", code: "A1", dep: ["M1"], criterion: "3xy(2x − 3y)" },
    ],
    errors: [{ id: "stopped-early", looksLike: "stopped at a partial factorisation: 'fully' means nothing is left to take out" }],
    dangerZones: [{ id: "fully", when: "a bracket has been written", warn: "Can anything else come out of the bracket?" }],
    coach: {
      keyWords: [{ text: "Factorise fully", why: "Take out the highest common factor: number, x and y." }],
      clues: ["What's the biggest number that divides 6 and 9?", "Which letters are in both terms?", "Take out 3xy."],
      traps: ["Is there anything left in the bracket that could come out?"],
    },
  },
  {
    id: "cca2-q8b", source: { paper: SRC, q: "8", part: "b" }, topic: "rearr", tier: "H", calculator: true,
    prompt: `Make r the subject of the formula &nbsp;<span class="eq">V = ${fr(4, 3)}πr<sup>3</sup></span>`, promptText: "Make r the subject of the formula V = (4/3)πr³.",
    marks: 2, answer: "r = ∛(3V/(4π))", solution: ["3V = 4πr³", "r³ = 3V/(4π)", "r = ∛(3V/(4π))"], noWorking: "full",
    points: [
      { id: "M1", code: "M1", criterion: "3V = 4πr³ or r³ = 3V/(4π)" },
      { id: "A1", code: "A1", dep: ["M1"], criterion: "r = ∛(3V/(4π))", reject: ["square root", "4V/(3π)"] },
    ],
    errors: [
      { id: "fractional-index", looksLike: "took a square root when it should be a cube root" },
      { id: "rearrange", looksLike: "divided by 4/3 incorrectly to get 4V/(3π): dividing by 4/3 is multiplying by 3/4" },
    ],
    dangerZones: [{ id: "root", when: "r³ is on its own", warn: "Undo a cube with a cube root." }],
    coach: {
      keyWords: [{ text: "Make r the subject", why: "Undo each step in reverse order." }],
      clues: ["Multiply both sides by 3.", "Divide by 4π.", "Cube root both sides."],
      traps: ["Is it a cube root?"],
    },
  },
  {
    id: "cca2-q9", source: { paper: SRC, q: "9" }, topic: "rev", tier: "H", calculator: true,
    prompt: "Maya gets a pay rise of 4.5%.<br>After the pay rise, her salary is £29 887<br>Work out Maya's salary before the pay rise.",
    marks: 3, answer: "£28 600", solution: ["£29 887 is 104.5% of the original", "29 887 ÷ 1.045"], noWorking: "full",
    points: [
      { id: "M1a", code: "M1", criterion: "Recognises that £29 887 is 104.5% of the original salary (multiplier 1.045)." },
      { id: "M1b", code: "M1", dep: ["M1a"], criterion: "29 887 ÷ 1.045" },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "£28 600", reject: ["£28 542.09 (4.5% taken off, scores 0)"] },
    ],
    errors: [{ id: "reverse-pct", looksLike: "took 4.5% off the new salary: 29 887 × 0.955 = £28 542.09 scores 0" }],
    dangerZones: [{ id: "reverse", when: "the student is about to take 4.5% of £29 887", warn: "The 4.5% was of the old salary. Divide by the multiplier." }],
    coach: {
      keyWords: [{ text: "before the pay rise", why: "Going back to 100%." }],
      clues: ["After a 4.5% rise, the salary is 104.5% of the original.", "That multiplier is 1.045.", "Divide by it to undo."],
      traps: ["Add 4.5% to your answer: do you get £29 887?"],
    },
  },
  {
    id: "cca2-q10", source: { paper: SRC, q: "10" }, topic: "prob", tier: "H", calculator: true,
    prompt: "The probability that a biased coin lands on heads is 0.65<br>The coin is thrown twice.<br>Work out the probability that the coin lands on heads at least once.",
    marks: 3, answer: "0.8775", solution: ["P(tails) = 0.35", "P(no heads) = 0.35² = 0.1225", "1 − 0.1225"], noWorking: "full",
    points: [
      { id: "M1a", code: "M1", criterion: "P(tails) = 1 − 0.65 = 0.35" },
      { id: "M1b", code: "M1", dep: ["M1a"], criterion: "1 − 0.35² (or 0.65 × 0.65 + 0.65 × 0.35 + 0.35 × 0.65)" },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "0.8775", reject: ["1.3", "0.4225"] },
    ],
    errors: [
      { id: "and-or", looksLike: "added 0.65 + 0.65 = 1.3, which can't be a probability" },
      { id: "stopped-early", looksLike: "worked out only heads both times (0.4225), or missed one of the mixed orders" },
    ],
    dangerZones: [{ id: "least", when: "the student starts", warn: "'At least once' is quickest as 1 − P(none)." }],
    coach: {
      keyWords: [{ text: "at least once", why: "1 − P(no heads)." }],
      clues: ["P(tails) = 1 − 0.65.", "P(no heads) = tails both times.", "Subtract that from 1."],
      traps: ["Is your answer between 0 and 1?"],
    },
  },
  {
    id: "cca2-q11", source: { paper: SRC, q: "11" }, topic: "volcone", tier: "H", calculator: true,
    prompt: "The diagram shows a solid metal cone.<br>The cone has base radius 4.5 cm and perpendicular height 11 cm.<br>The density of the metal is 8.9 g/cm<sup>3</sup><br>Work out the mass of the cone. Give your answer correct to 3 significant figures.",
    diagram: coneA2, marks: 4, answer: "2080 g", solution: ["Volume = ⅓ × π × 4.5² × 11 = 233.26…", "Mass = 233.26… × 8.9 = 2076.04…", "= 2080 g"], noWorking: "full",
    showWorking: "Write the volume, keeping the full calculator value, then multiply.",
    points: [
      { id: "M1a", code: "M1", criterion: "⅓ × π × 4.5² × 11" },
      { id: "A1a", code: "A1", dep: ["M1a"], criterion: "Volume = 233.26… cm³" },
      { id: "M1b", code: "M1", ft: true, criterion: "Their volume × 8.9", reject: ["÷ 8.9"] },
      { id: "A1b", code: "A1", dep: ["M1b"], criterion: "2080 (accept 2076 or better)", reject: ["6230 (⅓ left out)"] },
    ],
    errors: [
      { id: "rounding", looksLike: "rounded the volume to 233 before multiplying" },
      { id: "half", looksLike: "left out the ⅓, giving 6230 g" },
      { id: "wrong-operation", looksLike: "divided by the density when mass is density × volume" },
    ],
    dangerZones: [{ id: "third", when: "the student is writing the cone volume", warn: "The cone formula has a third in it." }],
    coach: {
      keyWords: [{ text: "density", why: "Mass = density × volume." }, { text: "3 significant figures", why: "Round at the end." }],
      clues: ["Volume of a cone = ⅓πr²h.", "Mass = density × volume.", "Round to 3 significant figures."],
      traps: ["Did you include the ⅓?"],
    },
  },
  {
    id: "cca2-q12", source: { paper: SRC, q: "12" }, topic: "qform", tier: "H", calculator: true,
    prompt: "Solve &nbsp;<span class=\"eq\">3x<sup>2</sup> − 7x − 2 = 0</span><br>Give your solutions correct to 2 decimal places.",
    promptText: "Solve 3x² − 7x − 2 = 0. Give your solutions correct to 2 decimal places.",
    marks: 3, answer: "x = 2.59 and x = −0.26", solution: ["x = (7 ± √((−7)² − 4 × 3 × (−2))) / (2 × 3)", "x = (7 ± √73) / 6", "x = 2.59 or x = −0.26"], noWorking: "full",
    showWorking: "Write the formula with the numbers in.",
    points: [
      { id: "M1a", code: "M1", criterion: "x = (7 ± √((−7)² − 4 × 3 × (−2))) / (2 × 3) (allow one sign error)." },
      { id: "M1b", code: "M1", dep: ["M1a"], criterion: "x = (7 ± √73) / 6" },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "2.59 and −0.26", reject: ["2 and 0.33 (from √25)"] },
    ],
    errors: [
      { id: "sign-error", looksLike: "−4 × 3 × (−2) is +24, giving √73; subtracting gives √25 and the wrong answers 2 and 0.33" },
      { id: "qformula-division", looksLike: "divided only the square root by 6" },
    ],
    dangerZones: [{ id: "disc", when: "the student is working out b² − 4ac", warn: "Minus times minus. Check the sign of 4ac." }],
    coach: {
      keyWords: [{ text: "2 decimal places", why: "Use the formula." }],
      clues: ["a = 3, b = −7, c = −2.", "−b = +7, and b² − 4ac = 49 + 24.", "The whole top is divided by 6."],
      traps: ["Is −b positive 7?"],
    },
  },
  {
    id: "cca2-q13a", source: { paper: SRC, q: "13", part: "a" }, topic: "sampling", tier: "H", calculator: true,
    prompt: "A ranger wants to estimate the number of deer in a forest.<br>She catches 40 deer, puts a tag on each one and releases them.<br>A week later she catches 60 deer. 8 of these 60 deer have a tag.<br>Work out an estimate for the total number of deer in the forest.",
    marks: 2, answer: "300 deer", solution: ["40/N = 8/60", "N = 40 × 60 ÷ 8"], noWorking: "full",
    points: [
      { id: "M1", code: "M1", criterion: "40/N = 8/60 oe, e.g. 40 × 60 ÷ 8" },
      { id: "A1", code: "A1", dep: ["M1"], criterion: "300", reject: ["5 (40 × 8 ÷ 60)"] },
    ],
    errors: [{ id: "wrong-ratio", looksLike: "set up the proportion the wrong way, e.g. 40 × 8 ÷ 60, giving about 5 deer" }],
    markerNotes: ["Sense check: the answer must be bigger than 40 and bigger than 60."],
    dangerZones: [{ id: "prop", when: "the student is setting up the proportion", warn: "Tagged ÷ total should match in the sample and the forest." }],
    coach: {
      keyWords: [{ text: "estimate", why: "Capture–recapture: the sample shows the fraction tagged." }],
      clues: ["In the sample, 8 out of 60 are tagged.", "In the forest, 40 out of N are tagged.", "Set the fractions equal and solve."],
      traps: ["Is your answer bigger than 60?"],
    },
  },
  {
    id: "cca2-q13b", source: { paper: SRC, q: "13", part: "b" }, topic: "sampling", tier: "H", calculator: true,
    prompt: "Write down one assumption you made in your answer to part (a).", promptText: `${DEER} Write down one assumption you made in your estimate.`,
    marks: 1, answer: "A valid assumption", solution: ["e.g. the tags did not fall off", "or no deer were born, died or left during the week"], noWorking: "full",
    points: [{ id: "B1", code: "B1", criterion: "One valid assumption, e.g. the tags did not fall off; no deer were born, died or left the forest during the week; the tagged deer mixed fully with the others; every deer was equally likely to be caught.", reject: ["'it was fair' or 'the sample was random' with no explanation"] }],
    errors: [{ id: "wrong-form", looksLike: "a vague statement such as 'it was fair' without saying what that means for the deer" }],
    dangerZones: [{ id: "specific", when: "the student is writing an assumption", warn: "Say exactly what stays the same for the deer." }],
    coach: {
      keyWords: [{ text: "assumption", why: "Something that must be true for the estimate to work." }],
      clues: ["Think about the tags.", "Think about the deer population over the week.", "Write one clear sentence about the deer."],
      traps: ["Is your assumption specific to the deer?"],
    },
  },
  {
    id: "cca2-q14a", source: { paper: SRC, q: "14", part: "a" }, topic: "bounds", tier: "H", calculator: true,
    prompt: "A car travels a distance of 142 m, correct to the nearest metre.<br>The time taken is 8.6 seconds, correct to 1 decimal place.<br>Write down the upper bound for the distance.",
    marks: 1, answer: "142.5 m", solution: ["142 + 0.5"], noWorking: "full",
    points: [{ id: "B1", code: "B1", criterion: "142.5", reject: ["142.4", "142.49"] }],
    errors: [{ id: "bounds-half", looksLike: "wrote the upper bound as 142.4 or 142.49" }],
    dangerZones: [{ id: "half", when: "the student is writing the bound", warn: "Half of 1 metre either side." }],
    coach: {
      keyWords: [{ text: "nearest metre", why: "± 0.5 m." }],
      clues: ["The rounding unit is 1 m.", "Half of it is 0.5.", "Add 0.5 to 142."],
      traps: ["Is your bound a 'clean' number?"],
    },
  },
  {
    id: "cca2-q14b", source: { paper: SRC, q: "14", part: "b" }, topic: "bounds", tier: "H", calculator: true,
    prompt: "Work out the lower bound for the average speed of the car. Give your answer correct to 3 significant figures.<br>You must show all your working.",
    promptText: `${CAR} Work out the lower bound for the average speed of the car, correct to 3 significant figures. You must show all your working.`,
    marks: 3, answer: "16.4 m/s", solution: ["Lower distance 141.5, upper time 8.65", "141.5 ÷ 8.65 = 16.358…"], noWorking: "zero",
    showWorking: "This question says 'You must show all your working'.",
    points: [
      { id: "M1a", code: "M1", criterion: "141.5 or 8.65 seen." },
      { id: "M1b", code: "M1", dep: ["M1a"], criterion: "141.5 ÷ 8.65", reject: ["141.5 ÷ 8.55"] },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "16.4 (from 16.358…)" },
    ],
    errors: [{ id: "bounds-division", looksLike: "divided the lower bound by the lower bound (141.5 ÷ 8.55 = 16.5): the smallest speed needs the smallest distance and the largest time" }],
    dangerZones: [{ id: "which", when: "the student is choosing bounds", warn: "Smallest speed: smallest distance, biggest time." }],
    coach: {
      keyWords: [{ text: "lower bound for the average speed", why: "Smallest distance ÷ largest time." }, { text: "You must show all your working", why: "No working, no marks." }],
      clues: ["Speed = distance ÷ time.", "Use the lower bound of the distance and the upper bound of the time.", "Round to 3 significant figures."],
      traps: ["Did you use the upper bound of the time?"],
    },
  },
  {
    id: "cca2-q15", source: { paper: SRC, q: "15" }, topic: "growth", tier: "H", calculator: true,
    prompt: "There are 2000 bacteria in a dish.<br>The number of bacteria increases by 15% each hour.<br>After how many complete hours will the number of bacteria first be greater than 5000?<br>You must show all your working.",
    marks: 3, answer: "7 hours", solution: ["2000 × 1.15⁶ = 4626", "2000 × 1.15⁷ = 5320"], noWorking: "zero",
    showWorking: "This question says 'You must show all your working'.",
    points: [
      { id: "M1a", code: "M1", criterion: "Uses the multiplier 1.15 repeatedly, or 2000 × 1.15ⁿ" },
      { id: "M1b", code: "M1", dep: ["M1a"], criterion: "Evaluates for 6 hours (4626) and for 7 hours (5320)." },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "7", reject: ["6", "10 or 11 (simple growth, scores 0)"] },
    ],
    errors: [
      { id: "simple-compound", looksLike: "added 15% of 2000 (300) each hour, giving 10 or 11 hours: the growth is compound (scores 0)" },
      { id: "stopped-early", looksLike: "gave 6 hours because 4626 is 'nearly' 5000, or 7 with no values" },
    ],
    dangerZones: [{ id: "either", when: "the student has tried a value", warn: "Show the hour below 5000 and the hour above." }],
    coach: {
      keyWords: [{ text: "increases by 15% each hour", why: "× 1.15 each hour." }, { text: "You must show all your working", why: "Show the values either side." }],
      clues: ["Multiplier 1.15.", "Try 2000 × 1.15ⁿ for different n.", "Show the last value below 5000 and the first above."],
      traps: ["Have you shown both values?"],
    },
  },
  {
    id: "cca2-q16a", source: { paper: SRC, q: "16", part: "a" }, topic: "siner", tier: "H", calculator: true,
    prompt: "ABC is a triangle.<br>Angle BAC = 48° &nbsp;&nbsp; Angle ABC = 67° &nbsp;&nbsp; BC = 9.2 cm<br>Work out the length of AC. Give your answer correct to 3 significant figures.",
    diagram: triA2, marks: 3, answer: "11.4 cm", solution: ["AC / sin 67° = 9.2 / sin 48°", "AC = 9.2 × sin 67° ÷ sin 48°", "= 11.395…"], noWorking: "full",
    points: [
      { id: "M1a", code: "M1", criterion: "AC / sin 67° = 9.2 / sin 48°" },
      { id: "M1b", code: "M1", dep: ["M1a"], criterion: "AC = 9.2 × sin 67° / sin 48°" },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "11.4 (from 11.395…)" },
    ],
    errors: [{ id: "wrong-ratio", looksLike: "paired sides with the wrong angles: AC is opposite angle B, and BC is opposite angle A" }],
    dangerZones: [{ id: "pair", when: "the student is writing the sine rule", warn: "Each side goes with the angle opposite it." }],
    coach: {
      keyWords: [{ text: "Angle ABC = 67°", why: "Opposite AC, the side you want." }, { text: "BC = 9.2 cm", why: "Opposite angle A, 48°." }],
      clues: ["Use the sine rule.", "AC / sin 67° = 9.2 / sin 48°.", "Multiply both sides by sin 67°."],
      traps: ["Is AC paired with 67°?"],
    },
  },
  {
    id: "cca2-q16b", source: { paper: SRC, q: "16", part: "b" }, topic: "areasin", tier: "H", calculator: true,
    prompt: "Work out the area of triangle ABC. Give your answer correct to 3 significant figures.",
    promptText: `${TRI} AC = 11.4 cm. Work out the area of triangle ABC, correct to 3 significant figures.`,
    diagram: triA2, marks: 2, answer: "47.5 cm²", solution: ["Angle ACB = 180 − 48 − 67 = 65°", "½ × 9.2 × 11.395… × sin 65° = 47.5"], noWorking: "full",
    points: [
      { id: "M1", code: "M1", ft: true, criterion: "Angle ACB = 65° and ½ × 9.2 × their AC × sin 65°" },
      { id: "A1", code: "A1", dep: ["M1"], criterion: "47.5" },
    ],
    errors: [{ id: "wrong-formula", looksLike: "used an angle that isn't between the two sides: ½ab sin C needs the included angle, here C = 65°" }],
    dangerZones: [{ id: "included", when: "the student is choosing an angle", warn: "The angle must be between the two sides you use." }],
    coach: {
      keyWords: [{ text: "area of triangle ABC", why: "½ab sin C with the angle between a and b." }],
      clues: ["Find angle C: 180 − 48 − 67.", "BC and AC meet at C.", "Area = ½ × 9.2 × AC × sin C."],
      traps: ["Is your angle between the two sides?"],
    },
  },
  {
    id: "cca2-q17a", source: { paper: SRC, q: "17", part: "a" }, topic: "iter", tier: "H", calculator: true,
    prompt: "Show that the equation &nbsp;<span class=\"eq\">x<sup>3</sup> + 4x = 20</span>&nbsp; has a solution between x = 2 and x = 3",
    promptText: "Show that x³ + 4x = 20 has a solution between x = 2 and x = 3.",
    marks: 2, answer: "Shown: change of sign between 2 and 3", solution: ["x = 2: 8 + 8 − 20 = −4", "x = 3: 27 + 12 − 20 = 19", "Change of sign, so a solution lies between 2 and 3"], noWorking: "zero",
    points: [
      { id: "M1", code: "M1", criterion: "Substitutes both values into x³ + 4x − 20: −4 when x = 2 and 19 when x = 3 (or compares 16 and 39 with 20)." },
      { id: "A1", code: "A1", dep: ["M1"], criterion: "States that there is a change of sign, so a solution lies between 2 and 3." },
    ],
    errors: [{ id: "stopped-early", looksLike: "worked out the two values but wrote no conclusion" }],
    dangerZones: [{ id: "conclude", when: "both values have been found", warn: "Finish with 'change of sign'." }],
    coach: {
      keyWords: [{ text: "Show that", why: "Values and a conclusion." }],
      clues: ["Rearrange to x³ + 4x − 20.", "Substitute 2 and 3.", "One negative, one positive: say what that means."],
      traps: ["Did you write 'change of sign'?"],
    },
  },
  {
    id: "cca2-q17b", source: { paper: SRC, q: "17", part: "b" }, topic: "iter", tier: "H", calculator: true,
    prompt: "A solution of x<sup>3</sup> + 4x = 20 can be found using the iteration formula &nbsp;<span class=\"eq\">x<sub>n+1</sub> = ∛(20 − 4x<sub>n</sub>)</span><br>Starting with x<sub>0</sub> = 2, use the iteration formula to work out the values of x<sub>1</sub>, x<sub>2</sub> and x<sub>3</sub><br>Give each value correct to 3 decimal places.",
    promptText: `${ITER} Iteration x(n+1) = ∛(20 − 4x(n)), starting with x0 = 2. Work out x1, x2 and x3, each correct to 3 decimal places.`,
    marks: 3, answer: "2.289, 2.213, 2.234", solution: ["x1 = ∛12 = 2.2894…", "x2 = 2.2133…", "x3 = 2.2338…"], noWorking: "full",
    points: [
      { id: "B1a", code: "B1", criterion: "x1 = 2.289" },
      { id: "B1b", code: "B1", criterion: "x2 = 2.213" },
      { id: "B1c", code: "B1", criterion: "x3 = 2.234" },
    ],
    errors: [{ id: "rounding", looksLike: "typed a rounded value back in each time" }],
    dangerZones: [{ id: "ans", when: "x1 has been found", warn: "Use ANS so the calculator keeps every figure." }],
    coach: {
      keyWords: [{ text: "x0 = 2", why: "Your starting value." }, { text: "3 decimal places", why: "Round each answer, keep full values in the calculator." }],
      clues: ["Type 2, then =.", "Enter ∛(20 − 4 × ANS).", "Press = three times."],
      traps: ["Did you use ANS?"],
    },
  },
  {
    id: "cca2-q18a", source: { paper: SRC, q: "18", part: "a" }, topic: "growth", tier: "H", calculator: true,
    prompt: "The graph of &nbsp;<span class=\"eq\">y = ab<sup>x</sup></span>&nbsp; passes through the points (0, 3) and (2, 12).<br>a and b are positive constants.<br>Work out the value of a and the value of b.",
    promptText: `${EXPG} Work out the value of a and the value of b.`,
    marks: 3, answer: "a = 3, b = 2", solution: ["3 = a × b⁰ = a", "12 = 3 × b²", "b² = 4, b = 2"], noWorking: "full",
    points: [
      { id: "B1", code: "B1", criterion: "a = 3 (from 3 = a × b⁰)", reject: ["a = 0"] },
      { id: "M1", code: "M1", criterion: "12 = 3 × b²" },
      { id: "A1", code: "A1", dep: ["M1"], criterion: "b = 2", reject: ["b = 4"] },
    ],
    errors: [
      { id: "index-law", looksLike: "thought b⁰ = 0: anything to the power 0 is 1, so a = 3" },
      { id: "no-sqrt", looksLike: "gave b = 4 by not taking the square root" },
    ],
    dangerZones: [{ id: "zero", when: "the student is using (0, 3)", warn: "What is any number to the power 0?" }],
    coach: {
      keyWords: [{ text: "y = abx", why: "Substitute each point." }],
      clues: ["Substitute (0, 3): b⁰ = 1.", "Substitute (2, 12) with your a.", "Solve for b (positive)."],
      traps: ["Did you square root to find b?"],
    },
  },
  {
    id: "cca2-q18b", source: { paper: SRC, q: "18", part: "b" }, topic: "growth", tier: "H", calculator: true,
    prompt: "Work out the value of y when x = 5", promptText: `${EXPG} So y = 3 × 2ˣ. Work out the value of y when x = 5.`,
    marks: 1, answer: "y = 96", solution: ["3 × 2⁵"], noWorking: "full",
    points: [{ id: "B1", code: "B1", ft: true, criterion: "y = 3 × 2⁵ = 96 (ft their a and b).", reject: ["7776 ((3 × 2)⁵)"] }],
    errors: [{ id: "index-law", looksLike: "worked out (3 × 2)⁵: the power applies only to b" }],
    dangerZones: [{ id: "power", when: "the student is substituting x = 5", warn: "The power applies to b only." }],
    coach: {
      keyWords: [{ text: "x = 5", why: "Substitute into y = abˣ." }],
      clues: ["Work out 2⁵ first.", "Then multiply by 3.", "That's y."],
      traps: ["Did you apply the power before multiplying?"],
    },
  },
  {
    id: "cca2-q19", source: { paper: SRC, q: "19" }, topic: "trig3d", tier: "H", calculator: true,
    prompt: "ABCDEFGH is a cuboid.<br>AB = 12 cm &nbsp;&nbsp; BC = 5 cm &nbsp;&nbsp; CG = 8 cm<br>Work out the size of the angle between the line AG and the plane ABCD.<br>Give your answer correct to 1 decimal place.",
    diagram: cuboidAG, marks: 4, answer: "31.6°", solution: ["AC = √(12² + 5²) = 13", "tan θ = 8/13", "θ = 31.607…"], noWorking: "full",
    showWorking: "Write AC, then the trig in triangle ACG.",
    points: [
      { id: "M1a", code: "M1", criterion: "AC = √(12² + 5²) = 13" },
      { id: "M1b", code: "M1", ft: true, dep: ["M1a"], criterion: "Identifies angle GAC and writes tan θ = 8/13" },
      { id: "M1c", code: "M1", dep: ["M1b"], criterion: "θ = tan⁻¹(8/13)" },
      { id: "A1", code: "A1", dep: ["M1c"], criterion: "31.6 (from 31.607…)", reject: ["33.7 (tan⁻¹(8/12))"] },
    ],
    errors: [
      { id: "wrong-share", looksLike: "chose the wrong angle, such as angle GAB: the angle is between AG and its 'shadow' AC" },
      { id: "wrong-ratio", looksLike: "used 12 as the adjacent side and not the diagonal AC" },
    ],
    dangerZones: [{ id: "shadow", when: "the student is choosing the triangle", warn: "Drop G straight down to the base. Which line is AG's shadow?" }],
    coach: {
      keyWords: [{ text: "plane ABCD", why: "The base. The angle is with AC, directly under AG." }],
      clues: ["Find the base diagonal AC with Pythagoras.", "Triangle ACG is right-angled at C.", "tan θ = CG ÷ AC."],
      traps: ["Did you use AC, not AB?"],
    },
  },
  {
    id: "cca2-q20", source: { paper: SRC, q: "20" }, topic: "cond", tier: "H", calculator: true,
    prompt: "There are 7 red counters and 5 green counters in a bag.<br>Three counters are taken from the bag at random, without replacement.<br>Work out the probability that exactly two of the three counters are red.",
    marks: 4, answer: "21/44", solution: ["P(RRG) = 7/12 × 6/11 × 5/10 = 210/1320", "Three orders", "3 × 210/1320 = 630/1320 = 21/44"], noWorking: "full",
    showWorking: "Write one order as a product, then account for all three orders.",
    points: [
      { id: "M1a", code: "M1", criterion: "A product of three fractions with denominators 12, 11 and 10." },
      { id: "M1b", code: "M1", dep: ["M1a"], criterion: "7/12 × 6/11 × 5/10 (one correct order, e.g. red, red, green)." },
      { id: "M1c", code: "M1", dep: ["M1b"], criterion: "Multiplies by 3, or adds the three orders." },
      { id: "A1", code: "A1", dep: ["M1c"], criterion: "21/44 oe", accept: ["630/1320", "0.477"], reject: ["7/44 (one order only)"] },
    ],
    errors: [
      { id: "stopped-early", looksLike: "found only one order (red, red, green) and gave 7/44: the green can be first, second or third" },
      { id: "replacement", looksLike: "kept the denominator as 12 each time" },
      { id: "wrong-share", looksLike: "worked out 'at least two red' when the question says 'exactly two'" },
    ],
    dangerZones: [
      { id: "orders", when: "one order has been worked out", warn: "Where else could the green counter come?" },
      { id: "denoms", when: "the student is writing the second and third fractions", warn: "Without replacement: 12, then 11, then 10." },
    ],
    coach: {
      keyWords: [{ text: "without replacement", why: "Denominators 12, 11, 10." }, { text: "exactly two", why: "Two red and one green, in any order." }],
      clues: ["Work out red, red, green.", "The green can be in any of three positions.", "Each order has the same probability: multiply by 3."],
      traps: ["Did you count all three orders?"],
    },
  },
  {
    id: "cca2-q21", source: { paper: SRC, q: "21" }, topic: "simquad", tier: "H", calculator: true,
    prompt: "Solve algebraically the simultaneous equations<br><span class=\"eq\">2x + y = 7</span><br><span class=\"eq\">x<sup>2</sup> + y<sup>2</sup> = 34</span>",
    promptText: "Solve algebraically the simultaneous equations 2x + y = 7 and x² + y² = 34.",
    marks: 5, answer: "x = 5, y = −3 and x = 0.6, y = 5.8", solution: ["y = 7 − 2x", "x² + (7 − 2x)² = 34", "x² + 49 − 28x + 4x² = 34", "5x² − 28x + 15 = 0", "(5x − 3)(x − 5) = 0", "x = 5, y = −3; x = 0.6, y = 5.8"], noWorking: "zero",
    showWorking: "'Solve algebraically' means the working must be shown.",
    points: [
      { id: "M1a", code: "M1", criterion: "Substitutes y = 7 − 2x: x² + (7 − 2x)² = 34" },
      { id: "M1b", code: "M1", dep: ["M1a"], criterion: "Expands: x² + 49 − 28x + 4x² = 34", reject: ["(7 − 2x)² = 49 − 4x² or 49 + 4x²"] },
      { id: "A1a", code: "A1", dep: ["M1b"], criterion: "5x² − 28x + 15 = 0" },
      { id: "M1c", code: "M1", ft: true, criterion: "Solves: (5x − 3)(x − 5) = 0 (or uses the quadratic formula)." },
      { id: "A1b", code: "A1", dep: ["M1c"], criterion: "x = 5, y = −3 and x = 0.6, y = 5.8, correctly paired." },
    ],
    errors: [
      { id: "missed-term", looksLike: "expanded (7 − 2x)² as 49 − 4x² or 49 + 4x², missing the middle term −28x" },
      { id: "stopped-early", looksLike: "found the x values and stopped" },
      { id: "wrong-share", looksLike: "substituted back into the circle equation, giving extra wrong y values: use y = 7 − 2x" },
    ],
    dangerZones: [
      { id: "square", when: "the student is expanding (7 − 2x)²", warn: "Three terms: don't miss the middle one." },
      { id: "ys", when: "both x values have been found", warn: "Use y = 7 − 2x for each." },
    ],
    coach: {
      keyWords: [{ text: "Solve algebraically", why: "Substitute, expand, solve." }],
      clues: ["Rearrange the linear equation: y = 7 − 2x.", "Substitute into x² + y² = 34 and expand (7 − 2x)² carefully.", "Solve the quadratic, then find y from y = 7 − 2x."],
      traps: ["Is each x paired with its own y?"],
    },
  },
  {
    id: "cca2-q22", source: { paper: SRC, q: "22" }, topic: "cosr", tier: "H", calculator: true,
    prompt: "A ship sails 14 km from A to B on a bearing of 070°<br>The ship then sails 9 km from B to C on a bearing of 150°<br>Work out the distance AC. Give your answer correct to 3 significant figures.",
    diagram: shipA2, marks: 4, answer: "17.9 km", solution: ["Angle ABC = 250 − 150 = 100°", "AC² = 14² + 9² − 2 × 14 × 9 × cos 100°", "AC² = 320.7…", "AC = 17.909…"], noWorking: "full",
    showWorking: "Write angle ABC with how you found it.",
    points: [
      { id: "B1", code: "B1", criterion: "Angle ABC = 100°", reject: ["80°", "150°"] },
      { id: "M1a", code: "M1", ft: true, criterion: "AC² = 14² + 9² − 2 × 14 × 9 × cos 100°" },
      { id: "M1b", code: "M1", dep: ["M1a"], criterion: "AC² = 320.7…" },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "17.9 (from 17.909…)" },
    ],
    errors: [
      { id: "wrong-operation", looksLike: "used 80° or 150° as the angle at B: the back-bearing of A from B is 250°, so angle ABC = 250 − 150 = 100°" },
      { id: "sign-error", looksLike: "lost the sign: cos 100° is negative, so AC² is bigger than 14² + 9²" },
      { id: "no-sqrt", looksLike: "forgot the square root" },
    ],
    dangerZones: [
      { id: "angle", when: "the student is finding angle ABC", warn: "Find the back-bearing of A from B first." },
      { id: "root", when: "AC² has been found", warn: "That's AC squared." },
    ],
    coach: {
      keyWords: [{ text: "bearing of 070°", why: "From A to B." }, { text: "bearing of 150°", why: "From B to C." }],
      clues: ["The back-bearing of A from B is 70 + 180 = 250°.", "Angle ABC = 250 − 150.", "Use the cosine rule, then square root."],
      traps: ["Is AC² bigger than 14² + 9²?"],
    },
  },
];
