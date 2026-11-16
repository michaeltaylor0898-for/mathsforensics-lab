// Cold Case: Most Wanted · Grade 8–9 Paper 1 (non-calculator) · all 14 questions, 70 marks (CC-MW/1)
//
// Question wording is copied from the paper. Mark points follow Mike's Most Wanted Paper 1 Forensic Mark
// Scheme line for line; errors and Mike-mode danger zones come from its "Where the marks go missing" boxes.
// Q6(c) asks for a tangent drawn on the printed graph, so it has a marker note for a blank page.
import type { Scheme } from "../schemes.ts";

const fr = (n: string | number, d: string | number) => `<span class="fr"><span>${n}</span><span>${d}</span></span>`;
const SRC = "CC-MW/1";
const TXT = `font-family="Times New Roman,serif" fill="currentColor"`;
const NDA = (x: number, y: number) => `<text x="${x}" y="${y}" font-size="9" text-anchor="middle" fill="currentColor" opacity=".7" font-family="Arial,sans-serif">Not drawn accurately</text>`;
const p2 = (q: number[]) => `${q[0].toFixed(1)} ${q[1].toFixed(1)}`;

// ---------- diagrams ----------
// Q6: v = 4t − t²/4 passes through (2, 7), (4, 12), (6, 15), (8, 16), matching the printed curve.
const speedGraph = (() => {
  const L = 50, T = 10, W = 270, H = 200, X = (t: number) => L + (t / 8) * W, Y = (v: number) => T + H - (v / 18) * H;
  const minor: string[] = [], major: string[] = [], lab: string[] = [];
  for (let t = 0; t <= 8.0001; t += 0.2) (Math.abs(t - Math.round(t)) < 1e-6 ? major : minor).push(`M${X(t).toFixed(1)} ${Y(0)}V${Y(18)}`);
  for (let v = 0; v <= 18.0001; v += 0.4) (Math.abs(v / 2 - Math.round(v / 2)) < 1e-6 ? major : minor).push(`M${L} ${Y(v).toFixed(1)}H${X(8)}`);
  for (let t = 0; t <= 8; t++) lab.push(`<text x="${X(t)}" y="${Y(0) + 15}" text-anchor="middle">${t}</text>`);
  for (let v = 0; v <= 18; v += 2) lab.push(`<text x="${L - 6}" y="${Y(v) + 4}" text-anchor="end">${v}</text>`);
  const pts: string[] = [];
  for (let t = 0; t <= 8.0001; t += 0.1) pts.push(`${X(t).toFixed(1)} ${Y(4 * t - (t * t) / 4).toFixed(1)}`);
  return `<svg viewBox="0 0 335 255" role="img" aria-label="Speed-time graph. Time t from 0 to 8 seconds across, speed v from 0 to 18 m/s up. A curve starts at the origin and rises, getting less steep: it passes through (2, 7), (4, 12), (6, 15) and levels off at (8, 16)."><path d="${minor.join("")}" stroke="currentColor" stroke-width=".35" opacity=".3" fill="none"/><path d="${major.join("")}" stroke="currentColor" stroke-width=".7" opacity=".55" fill="none"/><path d="M${pts.join("L")}" fill="none" stroke="currentColor" stroke-width="1.8"/><g font-size="11" ${TXT}>${lab.join("")}<text x="${L + W / 2}" y="248" text-anchor="middle">Time (t seconds)</text><text transform="translate(13 ${T + H / 2}) rotate(-90)" text-anchor="middle">Speed (v m/s)</text></g></svg>`;
})();
const SPEED_T = "Speed-time graph: v = 0 at t = 0, rising and levelling off. Readings: (2, 7), (4, 12), (6, 15), (8, 16).";

// Q8: A at the bottom; arc AC has central angle 96° and arc AB 124° (alternate segment), so C is upper left and B upper right.
const tangentCircle = (() => {
  const cx = 130, cy = 85, r = 65, at = (deg: number) => [cx + r * Math.cos((deg * Math.PI) / 180), cy - r * Math.sin((deg * Math.PI) / 180)];
  const A = at(270), C = at(174), B = at(34), O = [cx, cy];
  return `<svg viewBox="0 0 260 195" role="img" aria-label="A circle, centre O. PAQ is a horizontal tangent touching the circle at A, at the bottom. C is on the upper left of the circle and B on the upper right. Chords AC and AB, and radii OB and OC, are drawn, with the chord BC. Angle CAP = 48 degrees and angle BAQ = 62 degrees."><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M30 ${A[1]} H230 M${p2(A)} L${p2(C)} L${p2(B)} Z M${p2(C)} L${p2(O)} L${p2(B)}" fill="none" stroke="currentColor" stroke-width="1.4"/><g ${TXT} font-size="12"><text x="${A[0] - 4}" y="${A[1] + 15}" font-style="italic">A</text><text x="32" y="${A[1] - 5}" font-style="italic">P</text><text x="222" y="${A[1] - 5}" font-style="italic">Q</text><text x="${C[0] - 13}" y="${C[1] + 4}" font-style="italic">C</text><text x="${B[0] + 4}" y="${B[1] - 2}" font-style="italic">B</text><text x="${O[0] - 3}" y="${O[1] + 15}" font-style="italic">O</text><text x="${A[0] - 62}" y="${A[1] - 5}" font-size="11">48°</text><text x="${A[0] + 40}" y="${A[1] - 5}" font-size="11">62°</text></g>${NDA(130, 190)}</svg>`;
})();

const triangle560 = `<svg viewBox="0 0 250 150" role="img" aria-label="Triangle ABC. AC = 8 cm along the bottom, AB = 5 cm, angle BAC = 60 degrees."><path d="M30 115 L210 115 L86 18 Z" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M50 115 A20 20 0 0 0 40 97.7" fill="none" stroke="currentColor" stroke-width="1"/><g ${TXT} font-size="12"><text x="16" y="120" font-style="italic">A</text><text x="214" y="120" font-style="italic">C</text><text x="82" y="13" font-style="italic">B</text><text x="120" y="131" text-anchor="middle">8 cm</text><text x="28" y="66">5 cm</text><text x="50" y="106" font-size="11">60°</text></g>${NDA(125, 146)}</svg>`;

const tangentAxes = `<svg viewBox="0 0 250 200" role="img" aria-label="Axes with origin O. A circle centre O. The tangent at P, in the first quadrant on the circle, crosses the x-axis at A and the y-axis at B, making triangle OAB."><g fill="none" stroke="currentColor" stroke-width="1.3"><path d="M20 120 H235 M95 195 V10"/><circle cx="95" cy="120" r="60"/><path d="M95 45 L195 120" stroke-width="1.6"/></g><circle cx="131" cy="72" r="2.5" fill="currentColor"/><g ${TXT} font-size="12"><text x="238" y="124" font-style="italic">x</text><text x="99" y="14" font-style="italic">y</text><text x="82" y="134" font-style="italic">O</text><text x="196" y="134" font-style="italic">A</text><text x="82" y="48" font-style="italic">B</text><text x="135" y="66" font-style="italic">P</text></g>${NDA(190, 190)}</svg>`;

const coneHemi = `<svg viewBox="0 0 200 200" role="img" aria-label="A solid made from a cone standing on top of a hemisphere. Both have radius r. The cone has perpendicular height h."><g fill="none" stroke="currentColor" stroke-width="1.5"><path d="M45 110 L100 15 L155 110"/><path d="M45 110 A55 55 0 0 0 155 110"/><path d="M45 110 A55 12 0 0 0 155 110"/><path d="M45 110 A55 12 0 0 1 155 110" stroke-dasharray="4 3" opacity=".7"/><path d="M100 15 V110 H155" stroke-dasharray="3 3" stroke-width="1.1"/><path d="M100 102 H108 V110" stroke-width="1"/></g><g ${TXT} font-size="13" font-style="italic"><text x="104" y="64">h</text><text x="125" y="124">r</text></g>${NDA(100, 190)}</svg>`;

const vectorTri = `<svg viewBox="0 0 280 170" role="img" aria-label="Triangle OAB with A at the top. O, B and P lie on a straight horizontal line, with P beyond B. M is the midpoint of OA. N is on AB. The straight line MNP is drawn."><g fill="none" stroke="currentColor" stroke-width="1.5"><path d="M25 140 L90 25 L150 140 Z M150 140 H265"/><path d="M57.5 82.5 L265 140" stroke-width="1.2"/></g><g fill="currentColor"><circle cx="57.5" cy="82.5" r="2.3"/><circle cx="130" cy="101.7" r="2.3"/></g><g ${TXT} font-size="12" font-style="italic"><text x="12" y="152">O</text><text x="86" y="19">A</text><text x="146" y="155">B</text><text x="262" y="155">P</text><text x="42" y="80">M</text><text x="132" y="96">N</text></g>${NDA(140, 166)}</svg>`;
const VEC = "OAB is a triangle and OBP is a straight line. OA = a, OB = b. M is the midpoint of OA. N is on AB with AN : NB = 2 : 1. MNP is a straight line.";

export const MOST_WANTED_1: Scheme[] = [
  {
    id: "mw1-q1", source: { paper: SRC, q: "1" }, topic: "surd", tier: "H", calculator: false,
    prompt: `Write &nbsp;<span class="eq">${fr("6 + √12", "√3 − 1")}</span>&nbsp; in the form &nbsp;<span class="eq">a + b√3</span>&nbsp; where a and b are integers.<br>You must show all your working.`,
    promptText: "Write (6 + √12)/(√3 − 1) in the form a + b√3 where a and b are integers. You must show all your working.",
    marks: 4, answer: "6 + 4√3", solution: ["Multiply top and bottom by √3 + 1", "Top: 6√3 + 6 + √36 + √12 = 12 + 8√3", "Bottom: 3 − 1 = 2", "(12 + 8√3) ÷ 2"], noWorking: "zero",
    showWorking: "Write the multiplied-out numerator and denominator.",
    points: [
      { id: "M1a", code: "M1", criterion: "Multiplies the top and the bottom by √3 + 1", reject: ["multiplying by √3 − 1"] },
      { id: "M1b", code: "M1", dep: ["M1a"], criterion: "Numerator: 6√3 + 6 + √36 + √12 = 12 + 8√3 (using √12 = 2√3)" },
      { id: "M1c", code: "M1", dep: ["M1a"], criterion: "Denominator: 3 − 1 = 2" },
      { id: "A1", code: "A1", dep: ["M1b", "M1c"], criterion: "6 + 4√3", reject: ["6 + 8√3", "12 + 4√3"] },
    ],
    errors: [
      { id: "sign-error", looksLike: "multiplied by √3 − 1, the same bracket as the denominator, which leaves a surd on the bottom: the sign must change" },
      { id: "wrong-operation", looksLike: "divided only one term by 2, giving 6 + 8√3 or 12 + 4√3" },
      { id: "not-simplified", looksLike: "left √12 unsimplified, so the like terms were never collected" },
    ],
    dangerZones: [
      { id: "conj", when: "the student is choosing what to multiply by", warn: "Change the sign in the middle of the denominator." },
      { id: "divide", when: "the student is dividing by 2", warn: "Both terms of the numerator get divided." },
    ],
    coach: {
      keyWords: [{ text: "a + b√3", why: "Rationalise, then simplify every surd to a multiple of √3." }, { text: "show all your working", why: "No working, no marks." }],
      clues: ["Multiply top and bottom by √3 + 1.", "The bottom becomes 3 − 1.", "√12 = 2√3 and √36 = 6. Collect, then divide every term by 2."],
      traps: ["Did you divide both terms by 2?"],
    },
  },
  {
    id: "mw1-q2", source: { paper: SRC, q: "2" }, topic: "fracind", tier: "H", calculator: false,
    prompt: "Solve &nbsp;<span class=\"eq\">4<sup>x+1</sup> × 8<sup>x−2</sup> = 16√2</span><br>You must show all your working.",
    promptText: "Solve 4^(x+1) × 8^(x−2) = 16√2. You must show all your working.",
    marks: 4, answer: "x = 1.7", solution: ["2^(2(x+1)) × 2^(3(x−2)) = 2^(5x−4)", "16√2 = 2⁴ × 2^½ = 2^4.5", "5x − 4 = 4.5", "x = 1.7 (17/10)"], noWorking: "zero",
    showWorking: "Write both sides as powers of 2.",
    points: [
      { id: "M1a", code: "M1", criterion: "Writes the left-hand side as powers of 2: 2^(2(x+1)) × 2^(3(x−2))" },
      { id: "M1b", code: "M1", criterion: "16√2 = 2⁴ × 2^½ = 2^4.5", reject: ["2⁴ (√2 ignored)"] },
      { id: "M1c", code: "M1", dep: ["M1a"], criterion: "Equates the powers: 5x − 4 = 4.5" },
      { id: "A1", code: "A1", dep: ["M1c"], criterion: "x = 1.7", accept: ["17/10"], reject: ["1.6"] },
    ],
    errors: [
      { id: "fractional-index", looksLike: "ignored the √2 and wrote 16√2 as 2⁴, which gives x = 1.6: a square root is a power of ½" },
      { id: "missed-term", looksLike: "expanded 2(x + 1) as 2x + 1" },
      { id: "index-law", looksLike: "multiplied the two powers on the left when they should be added" },
    ],
    dangerZones: [{ id: "root", when: "the student is converting 16√2", warn: "What power of 2 is √2?" }],
    coach: {
      keyWords: [{ text: "16√2", why: "Write it as a single power of 2." }, { text: "show all your working", why: "Each power of 2 must be visible." }],
      clues: ["4 = 2² and 8 = 2³.", "√2 = 2 to the power ½.", "Add the powers on the left, then equate."],
      traps: ["Did you include the √2 as a half power?"],
    },
  },
  {
    id: "mw1-q3", source: { paper: SRC, q: "3" }, topic: "aproof", tier: "H", calculator: false,
    prompt: "Prove algebraically that the sum of the squares of any three consecutive integers is always 2 more than a multiple of 3",
    marks: 4, answer: "3n² + 2, which is 2 more than a multiple of 3", solution: ["(n − 1)² + n² + (n + 1)²", "= n² − 2n + 1 + n² + n² + 2n + 1", "= 3n² + 2", "3n² is a multiple of 3, so the sum is 2 more than a multiple of 3"], noWorking: "zero",
    points: [
      { id: "M1a", code: "M1", criterion: "Three consecutive integers written as n − 1, n, n + 1 (or n, n + 1, n + 2)", reject: ["numerical examples"] },
      { id: "M1b", code: "M1", dep: ["M1a"], criterion: "Squares and adds: n² − 2n + 1 + n² + n² + 2n + 1" },
      { id: "A1a", code: "A1", dep: ["M1b"], criterion: "3n² + 2", accept: ["3n² + 6n + 5 = 3(n² + 2n + 1) + 2"] },
      { id: "A1b", code: "A1", dep: ["A1a"], criterion: "Conclusion: 3n² is a multiple of 3, so the sum is always 2 more than a multiple of 3" },
    ],
    errors: [
      { id: "wrong-form", looksLike: "tried numbers such as 1, 2, 3 and 4, 5, 6: examples are not a proof and score 0" },
      { id: "stopped-early", looksLike: "stopped at 3n² + 6n + 5 without splitting the 5 into 3 + 2, or reached 3n² + 2 with no concluding sentence" },
    ],
    markerNotes: ["Numerical examples alone score 0."],
    dangerZones: [
      { id: "algebra", when: "the student starts with numbers", warn: "Examples aren't a proof. Use n." },
      { id: "conclude", when: "the expression has been simplified", warn: "Write the concluding sentence." },
    ],
    coach: {
      keyWords: [{ text: "Prove algebraically", why: "Use n, not examples." }, { text: "2 more than a multiple of 3", why: "Aim for 3(something) + 2." }],
      clues: ["Call the integers n − 1, n and n + 1.", "Square each and add: the n terms cancel.", "Show the result is 3 × something + 2 and say so."],
      traps: ["Did you write a conclusion?"],
    },
  },
  {
    id: "mw1-q4", source: { paper: SRC, q: "4" }, topic: "algfrac", tier: "H", calculator: false,
    prompt: `Solve &nbsp;<span class="eq">${fr(4, "x + 2")} + ${fr(1, "x − 1")} = 2</span><br>You must show all your working.`,
    promptText: "Solve 4/(x + 2) + 1/(x − 1) = 2. You must show all your working.",
    marks: 5, answer: "x = 2 and x = −1/2", solution: ["4(x − 1) + (x + 2) = 2(x + 2)(x − 1)", "5x − 2 = 2x² + 2x − 4", "2x² − 3x − 2 = 0", "(2x + 1)(x − 2) = 0"], noWorking: "zero",
    showWorking: "Write the equation after clearing the fractions.",
    points: [
      { id: "M1a", code: "M1", criterion: "Multiplies every term by (x + 2)(x − 1): 4(x − 1) + (x + 2) = 2(x + 2)(x − 1)", reject: ["the 2 on the right not multiplied"] },
      { id: "M1b", code: "M1", dep: ["M1a"], criterion: "Expands both sides: 5x − 2 = 2x² + 2x − 4" },
      { id: "A1a", code: "A1", dep: ["M1b"], criterion: "2x² − 3x − 2 = 0" },
      { id: "M1c", code: "M1", ft: true, criterion: "(2x + 1)(x − 2) = 0", accept: ["correct use of the quadratic formula"] },
      { id: "A1b", code: "A1", dep: ["M1c"], criterion: "x = 2 and x = −1/2", reject: ["x = 2 only"] },
    ],
    errors: [
      { id: "missed-term", looksLike: "forgot to multiply the 2 on the right-hand side, which gives a linear equation" },
      { id: "wrong-operation", looksLike: "expanded 2(x + 2)(x − 1) by doubling both brackets" },
      { id: "stopped-early", looksLike: "gave only x = 2 because the other solution is a fraction" },
    ],
    markerNotes: ["Check x = −1/2: 4/1.5 + 1/(−1.5) = 2."],
    dangerZones: [
      { id: "rhs", when: "the student is clearing fractions", warn: "Every term gets multiplied, including the 2." },
      { id: "both", when: "one solution has been found", warn: "A quadratic usually has two solutions." },
    ],
    coach: {
      keyWords: [{ text: "Solve", why: "Expect a quadratic: two answers." }],
      clues: ["Multiply every term by (x + 2)(x − 1).", "Expand and rearrange to = 0.", "Factorise and give both solutions."],
      traps: ["Did you multiply the 2 on the right?", "Have you given two solutions?"],
    },
  },
  {
    id: "mw1-q5a", source: { paper: SRC, q: "5", part: "a" }, topic: "csq", tier: "H", calculator: false,
    prompt: "Write &nbsp;<span class=\"eq\">2x<sup>2</sup> − 12x + 23</span>&nbsp; in the form &nbsp;<span class=\"eq\">a(x − b)<sup>2</sup> + c</span>&nbsp; where a, b and c are integers.",
    promptText: "Write 2x² − 12x + 23 in the form a(x − b)² + c where a, b and c are integers.",
    marks: 3, answer: "2(x − 3)² + 5", solution: ["2(x² − 6x) + 23", "2[(x − 3)² − 9] + 23", "2(x − 3)² − 18 + 23"], noWorking: "full",
    points: [
      { id: "M1a", code: "M1", criterion: "2(x² − 6x) + 23" },
      { id: "M1b", code: "M1", dep: ["M1a"], criterion: "2[(x − 3)² − 9] + 23" },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "2(x − 3)² + 5", reject: ["2(x − 3)² + 14"] },
    ],
    errors: [{ id: "csq-half", looksLike: "forgot to multiply the −9 by 2, which gives 2(x − 3)² + 14" }],
    dangerZones: [{ id: "times2", when: "the square has been completed inside the bracket", warn: "The −9 is inside the 2( ). Multiply it out." }],
    coach: {
      keyWords: [{ text: "a(x − b)2 + c", why: "Take out the 2 first." }],
      clues: ["Factor 2 out of the x terms: 2(x² − 6x).", "x² − 6x = (x − 3)² − 9.", "Multiply the −9 by 2, then add 23."],
      traps: ["Did you multiply the −9 by 2?"],
    },
  },
  {
    id: "mw1-q5b", source: { paper: SRC, q: "5", part: "b" }, topic: "csq", tier: "H", calculator: false,
    prompt: "Hence write down the coordinates of the turning point of the graph of &nbsp;<span class=\"eq\">y = 2x<sup>2</sup> − 12x + 23</span>",
    promptText: "2x² − 12x + 23 = 2(x − 3)² + 5. Hence write down the coordinates of the turning point of y = 2x² − 12x + 23.",
    marks: 1, answer: "(3, 5)", solution: ["(x − 3)² is zero when x = 3, giving y = 5"], noWorking: "full",
    points: [{ id: "B1", code: "B1", ft: true, criterion: "(3, 5) (ft their part (a))", reject: ["(−3, 5)"] }],
    errors: [{ id: "sign-error", looksLike: "wrote (−3, 5): the bracket (x − 3) is zero when x = 3" }],
    dangerZones: [{ id: "sign", when: "the student reads off the x value", warn: "When is (x − 3) zero?" }],
    coach: {
      keyWords: [{ text: "Hence", why: "Use your completed square." }, { text: "turning point", why: "The minimum point." }],
      clues: ["The squared bracket is smallest when it's zero.", "Which x makes (x − 3) zero?", "Then y is the number added on."],
      traps: ["Is the sign of your x right?"],
    },
  },
  {
    id: "mw1-q5c", source: { paper: SRC, q: "5", part: "c" }, topic: "csq", tier: "H", calculator: false,
    prompt: "Hence explain why the equation &nbsp;<span class=\"eq\">2x<sup>2</sup> − 12x + 23 = 0</span>&nbsp; has no solutions.",
    promptText: "2x² − 12x + 23 = 2(x − 3)² + 5. Hence explain why 2x² − 12x + 23 = 0 has no solutions.",
    marks: 1, answer: "The minimum value is 5, which is above 0", solution: ["2(x − 3)² ≥ 0, so 2(x − 3)² + 5 ≥ 5 > 0", "The graph never reaches the x-axis"], noWorking: "full",
    points: [{ id: "B1", code: "B1", criterion: "The smallest value of 2(x − 3)² + 5 is 5, which is greater than 0, so the graph never reaches the x-axis.", reject: ["the discriminant (correct maths, but not 'hence')"] }],
    errors: [{ id: "wrong-form", looksLike: "used the discriminant: it's correct maths, but 'hence' means the answer must refer to the minimum value" }],
    dangerZones: [{ id: "hence", when: "the student reaches for b² − 4ac", warn: "'Hence' means use part (a)." }],
    coach: {
      keyWords: [{ text: "Hence", why: "Use the completed square, not the discriminant." }, { text: "no solutions", why: "The graph never touches the x-axis." }],
      clues: ["A square is never negative.", "So 2(x − 3)² + 5 is never less than 5.", "Explain what that means for y = 0."],
      traps: ["Did you use part (a)?"],
    },
  },
  {
    id: "mw1-q6a", source: { paper: SRC, q: "6", part: "a" }, topic: "gradarea", tier: "H", calculator: false,
    prompt: "The graph shows the speed, v m/s, of a car t seconds after it starts to move.<br>Use four strips of equal width to work out an estimate for the distance the car travels in the first 8 seconds.",
    promptText: `${SPEED_T} Use four strips of equal width to estimate the distance travelled in the first 8 seconds.`,
    diagram: speedGraph, marks: 3, answer: "84 m", solution: ["Speeds at t = 0, 2, 4, 6, 8: 0, 7, 12, 15, 16", "½ × 2 × [0 + 16 + 2(7 + 12 + 15)]", "= 84"], noWorking: "full",
    points: [
      { id: "M1a", code: "M1", criterion: "Reads the speeds at t = 2, 4, 6 and 8: 7, 12, 15 and 16" },
      { id: "M1b", code: "M1", ft: true, dep: ["M1a"], criterion: "½ × 2 × [0 + 16 + 2(7 + 12 + 15)]", accept: ["four separate trapezium areas added"] },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "84" },
    ],
    errors: [
      { id: "wrong-formula", looksLike: "treated the strips as rectangles" },
      { id: "missed-term", looksLike: "forgot to double the three middle speeds" },
    ],
    dangerZones: [{ id: "trap", when: "the student is finding the area", warn: "Trapezia, not rectangles." }],
    coach: {
      keyWords: [{ text: "four strips of equal width", why: "Four trapezia, each 2 seconds wide." }, { text: "distance", why: "Area under a speed-time graph." }],
      clues: ["Read the speed at t = 0, 2, 4, 6 and 8.", "Each strip is a trapezium of width 2.", "Add the four areas."],
      traps: ["Did you use trapezia?"],
    },
  },
  {
    id: "mw1-q6b", source: { paper: SRC, q: "6", part: "b" }, topic: "gradarea", tier: "H", calculator: false,
    prompt: "Is your answer to part (a) an underestimate or an overestimate?<br>Give a reason for your answer.",
    promptText: `${SPEED_T} The curve bends downwards (gets less steep). Is the trapezium estimate of the area an underestimate or an overestimate? Give a reason.`,
    diagram: speedGraph, marks: 1, answer: "Underestimate", solution: ["The curve bends over the top of each strip"], noWorking: "full",
    points: [{ id: "B1", code: "B1", criterion: "Underestimate, because the tops of the trapezia are below the curve.", reject: ["'underestimate' with no reason"] }],
    errors: [{ id: "wrong-direction", looksLike: "said overestimate: the straight tops of the strips sit under this curve" }],
    dangerZones: [{ id: "reason", when: "the student has chosen", warn: "Give the reason: where are the strips compared with the curve?" }],
    coach: {
      keyWords: [{ text: "Give a reason", why: "Say where the trapezia sit compared with the curve." }],
      clues: ["Picture the straight top of each strip.", "Is it above or below the curve?", "If area is missed, is the estimate too big or too small?"],
      traps: ["Did you give a reason?"],
    },
  },
  {
    id: "mw1-q6c", source: { paper: SRC, q: "6", part: "c" }, topic: "gradarea", tier: "H", calculator: false,
    prompt: "Work out an estimate for the acceleration of the car when t = 4<br>You must show your working on the graph.<br><small>Sketch the tangent in your working and write two points on it.</small>",
    promptText: `${SPEED_T} Estimate the acceleration when t = 4. Show the tangent used.`,
    diagram: speedGraph, marks: 2, answer: "About 2 m/s²", solution: ["Draw the tangent at (4, 12)", "e.g. through (0, 4) and (8, 20): gradient 16 ÷ 8"], noWorking: "zero",
    points: [
      { id: "M1", code: "M1", criterion: "Draws a tangent to the curve at t = 4 and works out its gradient.", reject: ["12 ÷ 4 (average acceleration)"] },
      { id: "A1", code: "A1", dep: ["M1"], criterion: "An answer in the range 1.7 to 2.3" },
    ],
    errors: [{ id: "wrong-operation", looksLike: "worked out 12 ÷ 4 = 3, the average acceleration over the first 4 seconds: acceleration at t = 4 is the gradient of the tangent there" }],
    markerNotes: ["No tangent scores 0, even with the right answer. The student can't draw on the printed graph: accept a sketched tangent at (4, 12) or two stated points on it, with the gradient worked out from them."],
    dangerZones: [{ id: "tangent", when: "the student is dividing speed by time", warn: "Acceleration at an instant: draw the tangent." }],
    coach: {
      keyWords: [{ text: "when t = 4", why: "At that instant: the gradient of the tangent." }, { text: "show your working on the graph", why: "No tangent, no marks." }],
      clues: ["Draw a straight line touching the curve at (4, 12).", "Pick two points far apart on that line.", "Gradient = change in v ÷ change in t."],
      traps: ["Did you use a tangent, not the chord from the origin?"],
    },
  },
  {
    id: "mw1-q7a", source: { paper: SRC, q: "7", part: "a" }, topic: "inv", tier: "H", calculator: false,
    prompt: `The function f is such that &nbsp;<span class="eq">f(x) = ${fr("2x + 6", "x − 3")}</span>&nbsp; where x ≠ 3<br>Find f<sup>−1</sup>(x)`,
    promptText: "f(x) = (2x + 6)/(x − 3), x ≠ 3. Find the inverse function f⁻¹(x).",
    marks: 3, answer: "f⁻¹(x) = (3x + 6)/(x − 2)", solution: ["y(x − 3) = 2x + 6", "xy − 3y = 2x + 6", "x(y − 2) = 3y + 6", "x = (3y + 6)/(y − 2)"], noWorking: "full",
    points: [
      { id: "M1a", code: "M1", criterion: "y(x − 3) = 2x + 6" },
      { id: "M1b", code: "M1", dep: ["M1a"], criterion: "Collects the x terms and factorises: x(y − 2) = 3y + 6" },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "(3x + 6)/(x − 2)", reject: ["(x − 3)/(2x + 6) (reciprocal)", "x on both sides"] },
    ],
    errors: [
      { id: "inverse-reciprocal", looksLike: "turned the fraction upside down: the inverse is not the reciprocal" },
      { id: "stopped-early", looksLike: "left x on both sides" },
    ],
    dangerZones: [{ id: "collect", when: "x appears twice", warn: "Collect the x terms on one side and factorise." }],
    coach: {
      keyWords: [{ text: "f−1(x)", why: "The inverse: undo f." }],
      clues: ["Write y = (2x + 6)/(x − 3) and multiply up.", "Get both x terms on one side and factorise x out.", "Divide, then write in terms of x."],
      traps: ["Is x on one side only?"],
    },
  },
  {
    id: "mw1-q7b", source: { paper: SRC, q: "7", part: "b" }, topic: "inv", tier: "H", calculator: false,
    prompt: `The function f is such that &nbsp;<span class="eq">f(x) = ${fr("2x + 6", "x − 3")}</span>&nbsp; where x ≠ 3<br>Solve f(x) = x`,
    promptText: "f(x) = (2x + 6)/(x − 3), x ≠ 3. Solve f(x) = x.",
    marks: 2, answer: "x = 6 and x = −1", solution: ["2x + 6 = x(x − 3)", "x² − 5x − 6 = 0", "(x − 6)(x + 1) = 0"], noWorking: "full",
    points: [
      { id: "M1", code: "M1", criterion: "2x + 6 = x(x − 3), so x² − 5x − 6 = 0" },
      { id: "A1", code: "A1", dep: ["M1"], criterion: "x = 6 and x = −1" },
    ],
    errors: [
      { id: "wrong-operation", looksLike: "solved f(x) = 0" },
      { id: "stopped-early", looksLike: "cancelled an x and lost a solution" },
    ],
    markerNotes: ["Check: f(6) = 18/3 = 6 and f(−1) = 4/(−4) = −1."],
    dangerZones: [{ id: "eq", when: "the student sets up the equation", warn: "f(x) = x, not 0." }],
    coach: {
      keyWords: [{ text: "f(x) = x", why: "Set the fraction equal to x." }],
      clues: ["Write (2x + 6)/(x − 3) = x.", "Multiply up and rearrange to a quadratic = 0.", "Factorise."],
      traps: ["Two solutions?"],
    },
  },
  {
    id: "mw1-q8", source: { paper: SRC, q: "8" }, topic: "circthm", tier: "H", calculator: false,
    prompt: "A, B and C are points on a circle, centre O.<br>PAQ is the tangent to the circle at A.<br>Angle CAP = 48° &nbsp;&nbsp; Angle BAQ = 62°<br>Work out the size of angle OBC.<br>Give a reason for each stage of your working.",
    diagram: tangentCircle, marks: 5, answer: "20°", solution: ["Angle BAC = 180 − 48 − 62 = 70° (angles on a straight line)", "Angle BOC = 2 × 70 = 140° (angle at the centre is twice the angle at the circumference)", "OB = OC (radii), so triangle OBC is isosceles", "Angle OBC = (180 − 140) ÷ 2"], noWorking: "full",
    showWorking: "Write each angle with its reason.",
    points: [
      { id: "B1a", code: "B1", criterion: "Angle BAC = 180 − 48 − 62 = 70°" },
      { id: "M1a", code: "M1", ft: true, criterion: "Angle BOC = 2 × 70 = 140°", reject: ["35° (halved)"] },
      { id: "M1b", code: "M1", ft: true, dep: ["M1a"], criterion: "(180 − 140) ÷ 2" },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "20" },
      { id: "B1b", code: "B1", criterion: "At least two correct reasons in the correct words: angles on a straight line add up to 180°; the angle at the centre is twice the angle at the circumference; OB = OC (radii) so the triangle is isosceles.", reject: ["'centre rule'", "'isosceles' without saying OB and OC are radii"] },
    ],
    errors: [
      { id: "wrong-operation", looksLike: "halved 70 to get the angle at the centre: it is doubled" },
      { id: "wrong-form", looksLike: "wrote 'isosceles' without saying why (OB and OC are both radii), or used shorthand like 'centre rule'" },
      { id: "radius-diameter", looksLike: "assumed BC is a diameter, so angle BAC = 90°" },
    ],
    dangerZones: [
      { id: "double", when: "the student moves from A to O", warn: "Centre angle: double or half?" },
      { id: "radii", when: "the student uses an isosceles triangle", warn: "Say why it's isosceles." },
    ],
    coach: {
      keyWords: [{ text: "angle OBC", why: "In triangle OBC." }, { text: "Give a reason for each stage", why: "Proper theorem names." }],
      clues: ["Angles on the straight line PAQ give angle BAC.", "The angle at the centre is twice the angle at the circumference.", "OB and OC are radii: the base angles are equal."],
      traps: ["Did you say OB and OC are radii?"],
    },
  },
  {
    id: "mw1-q9", source: { paper: SRC, q: "9" }, topic: "simquad", tier: "H", calculator: false,
    prompt: "The line &nbsp;<span class=\"eq\">y = 3x − 10</span>&nbsp; intersects the circle &nbsp;<span class=\"eq\">x<sup>2</sup> + y<sup>2</sup> = 20</span>&nbsp; at the points A and B.<br>Work out the length of AB.<br>Give your answer as a surd in its simplest form. You must show all your working.",
    promptText: "The line y = 3x − 10 intersects the circle x² + y² = 20 at A and B. Work out the length of AB as a surd in its simplest form. You must show all your working.",
    marks: 5, answer: "2√10", solution: ["x² + (3x − 10)² = 20", "10x² − 60x + 80 = 0, so x² − 6x + 8 = 0", "x = 2 or 4: A(2, −4), B(4, 2)", "AB = √(2² + 6²) = √40"], noWorking: "zero",
    showWorking: "Write the substituted equation, the two points, and the distance.",
    points: [
      { id: "M1a", code: "M1", criterion: "Substitutes: x² + (3x − 10)² = 20" },
      { id: "A1a", code: "A1", dep: ["M1a"], criterion: "10x² − 60x + 80 = 0, so x² − 6x + 8 = 0" },
      { id: "A1b", code: "A1", dep: ["A1a"], criterion: "A and B are (2, −4) and (4, 2)" },
      { id: "M1b", code: "M1", ft: true, criterion: "√((4 − 2)² + (2 − (−4))²)" },
      { id: "A1c", code: "A1", dep: ["M1b"], criterion: "√40 = 2√10", reject: ["√40 left unsimplified"] },
    ],
    errors: [
      { id: "missed-term", looksLike: "expanded (3x − 10)² as 9x² − 100 or 9x² + 100: the middle term, −60x, went missing" },
      { id: "stopped-early", looksLike: "stopped at the two points: the question asks for a length" },
      { id: "sign-error", looksLike: "worked out 2 − (−4) as −2" },
      { id: "not-simplified", looksLike: "left the answer as √40" },
    ],
    dangerZones: [
      { id: "expand", when: "the student squares the bracket", warn: "(3x − 10)² has three terms." },
      { id: "length", when: "both points have been found", warn: "The question wants the length AB." },
    ],
    coach: {
      keyWords: [{ text: "length of AB", why: "Find both points, then use Pythagoras." }, { text: "simplest form", why: "Simplify the surd." }],
      clues: ["Substitute y = 3x − 10 into the circle.", "Solve the quadratic and find both y values.", "Distance = √(Δx² + Δy²); simplify √40."],
      traps: ["Did you simplify the surd?"],
    },
  },
  {
    id: "mw1-q10a", source: { paper: SRC, q: "10", part: "a" }, topic: "cosr", tier: "H", calculator: false,
    prompt: "ABC is a triangle.<br>AB = 5 cm &nbsp;&nbsp; AC = 8 cm &nbsp;&nbsp; Angle BAC = 60°<br>Show that BC = 7 cm.",
    diagram: triangle560, marks: 3, answer: "BC² = 49, so BC = 7", solution: ["BC² = 5² + 8² − 2 × 5 × 8 × cos 60°", "= 25 + 64 − 40", "= 49"], noWorking: "zero",
    points: [
      { id: "M1a", code: "M1", criterion: "BC² = 5² + 8² − 2 × 5 × 8 × cos 60°" },
      { id: "M1b", code: "M1", dep: ["M1a"], criterion: "Uses cos 60° = ½: 25 + 64 − 40" },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "BC² = 49, so BC = 7", reject: ["working backwards from BC = 7"] },
    ],
    errors: [
      { id: "order-error", looksLike: "worked out (25 + 64 − 80) × ½: the multiplication by cos 60° comes before the subtraction" },
      { id: "wrong-form", looksLike: "started from BC = 7 and worked backwards" },
    ],
    dangerZones: [{ id: "order", when: "the student is evaluating the cosine rule", warn: "2 × 5 × 8 × cos 60° is one term. Work it out first." }],
    coach: {
      keyWords: [{ text: "Show that", why: "Start from the cosine rule, not from 7." }],
      clues: ["Two sides and the angle between them: cosine rule.", "cos 60° = ½.", "So 2 × 5 × 8 × ½ = 40."],
      traps: ["Did you work out the 40 before subtracting?"],
    },
  },
  {
    id: "mw1-q10b", source: { paper: SRC, q: "10", part: "b" }, topic: "siner", tier: "H", calculator: false,
    prompt: `Work out the exact value of sin ABC<br>Give your answer in the form &nbsp;<span class="eq">${fr("a√3", "b")}</span>&nbsp; where a and b are integers.`,
    promptText: "Triangle ABC: AB = 5 cm, AC = 8 cm, BC = 7 cm, angle BAC = 60°. Work out the exact value of sin ABC in the form a√3/b.",
    diagram: triangle560, marks: 2, answer: "4√3/7", solution: ["sin B / 8 = sin 60° / 7", "sin B = 8 × (√3/2) ÷ 7"], noWorking: "full",
    points: [
      { id: "M1", code: "M1", criterion: "sin B / 8 = sin 60° / 7", reject: ["pairing angle B with 5 or 7"] },
      { id: "A1", code: "A1", dep: ["M1"], criterion: "4√3/7", reject: ["8√3/14 unsimplified"] },
    ],
    errors: [
      { id: "swapped", looksLike: "paired angle B with the wrong side: it is opposite AC, which is 8" },
      { id: "not-simplified", looksLike: "left 8√3/14 unsimplified" },
    ],
    dangerZones: [{ id: "opp", when: "the student is pairing sides and angles", warn: "Which side is opposite angle B?" }],
    coach: {
      keyWords: [{ text: "exact value", why: "Use sin 60° = √3/2, no decimals." }, { text: "sin ABC", why: "The angle at B, opposite AC." }],
      clues: ["Use the sine rule.", "Angle B is opposite AC = 8; 60° is opposite BC = 7.", "Use sin 60° = √3/2 and simplify."],
      traps: ["Is your fraction simplified?"],
    },
  },
  {
    id: "mw1-q11a", source: { paper: SRC, q: "11", part: "a" }, topic: "tree", tier: "H", calculator: false,
    prompt: `There are only red counters and blue counters in a bag.<br>There are x red counters and (x + 3) blue counters.<br>Two counters are taken from the bag at random, without replacement.<br>The probability that both counters are red is ${fr(1, 12)}<br>Show that &nbsp;<span class="eq">4x<sup>2</sup> − 11x − 3 = 0</span>`,
    promptText: "A bag has x red and (x + 3) blue counters. Two are taken at random without replacement. P(both red) = 1/12. Show that 4x² − 11x − 3 = 0.",
    marks: 3, answer: "12x² − 12x = 4x² + 10x + 6, giving 4x² − 11x − 3 = 0", solution: ["x/(2x + 3) × (x − 1)/(2x + 2) = 1/12", "12x(x − 1) = (2x + 3)(2x + 2)", "12x² − 12x = 4x² + 10x + 6", "8x² − 22x − 6 = 0, ÷ 2"], noWorking: "zero",
    points: [
      { id: "M1a", code: "M1", criterion: "x/(2x + 3) × (x − 1)/(2x + 2)", reject: ["x + 3 as the total", "the same fraction twice"] },
      { id: "M1b", code: "M1", dep: ["M1a"], criterion: "Sets equal to 1/12 and clears the fractions: 12x(x − 1) = (2x + 3)(2x + 2)" },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "12x² − 12x = 4x² + 10x + 6, leading to 4x² − 11x − 3 = 0" },
    ],
    errors: [
      { id: "wrong-denominator", looksLike: "used x + 3 as the total: the total is red plus blue, 2x + 3" },
      { id: "replacement", looksLike: "kept the same fraction for the second counter when there is no replacement" },
    ],
    dangerZones: [
      { id: "total", when: "the student writes the first fraction", warn: "How many counters altogether?" },
      { id: "norep", when: "the student writes the second fraction", warn: "One red has gone. Both top and bottom go down by 1." },
    ],
    coach: {
      keyWords: [{ text: "without replacement", why: "Second fraction: one fewer on top and bottom." }, { text: "Show that", why: "Every line of algebra must be seen." }],
      clues: ["Total counters = x + (x + 3).", "P(red, red) = x/(2x + 3) × (x − 1)/(2x + 2).", "Set it equal to 1/12, cross-multiply and simplify."],
      traps: ["Is the total 2x + 3?"],
    },
  },
  {
    id: "mw1-q11b", source: { paper: SRC, q: "11", part: "b" }, topic: "tree", tier: "H", calculator: false,
    prompt: "Work out the probability that the two counters are different colours.",
    promptText: "A bag has x red and (x + 3) blue counters, with 4x² − 11x − 3 = 0. Two are taken without replacement. Work out the probability that the two counters are different colours.",
    marks: 3, answer: "1/2", solution: ["(4x + 1)(x − 3) = 0, so x = 3", "3 red, 6 blue, 9 in total", "3/9 × 6/8 + 6/9 × 3/8 = 36/72"], noWorking: "full",
    points: [
      { id: "M1a", code: "M1", criterion: "(4x + 1)(x − 3) = 0, so x = 3 (3 red and 6 blue)" },
      { id: "M1b", code: "M1", ft: true, dep: ["M1a"], criterion: "3/9 × 6/8 + 6/9 × 3/8", reject: ["one order only (1/4)"] },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "1/2", accept: ["36/72", "0.5"] },
    ],
    errors: [
      { id: "and-or", looksLike: "counted only one order, red then blue, which gives 1/4" },
      { id: "stopped-early", looksLike: "gave x = 3 as the final answer" },
    ],
    dangerZones: [{ id: "orders", when: "the student has one product", warn: "Red then blue, or blue then red?" }],
    coach: {
      keyWords: [{ text: "different colours", why: "Red then blue OR blue then red." }],
      clues: ["Factorise the quadratic to find x.", "Work out how many red, blue and total.", "Add P(red, blue) and P(blue, red)."],
      traps: ["Did you include both orders?"],
    },
  },
  {
    id: "mw1-q12", source: { paper: SRC, q: "12" }, topic: "tangent", tier: "H", calculator: false,
    prompt: "The circle C has equation &nbsp;<span class=\"eq\">x<sup>2</sup> + y<sup>2</sup> = 25</span><br>The tangent to C at the point P(3, 4) crosses the x-axis at A and the y-axis at B.<br>O is the origin.<br>Work out the area of triangle OAB.<br>You must show all your working.",
    promptText: "The circle x² + y² = 25. The tangent at P(3, 4) crosses the x-axis at A and the y-axis at B. O is the origin. Work out the area of triangle OAB. You must show all your working.",
    diagram: tangentAxes, marks: 5, answer: "625/24 square units", solution: ["Gradient OP = 4/3", "Tangent gradient = −3/4", "y − 4 = −¾(x − 3), i.e. 3x + 4y = 25", "A(25/3, 0), B(0, 25/4)", "Area = ½ × 25/3 × 25/4"], noWorking: "zero",
    showWorking: "Write the tangent's equation and both intercepts.",
    points: [
      { id: "M1a", code: "M1", criterion: "Gradient of the radius OP = 4/3" },
      { id: "M1b", code: "M1", dep: ["M1a"], criterion: "Gradient of the tangent = −3/4", reject: ["3/4", "4/3"] },
      { id: "M1c", code: "M1", ft: true, dep: ["M1b"], criterion: "y − 4 = −¾(x − 3)", accept: ["3x + 4y = 25"] },
      { id: "M1d", code: "M1", ft: true, dep: ["M1c"], criterion: "A is (25/3, 0) and B is (0, 25/4)" },
      { id: "A1", code: "A1", dep: ["M1d"], criterion: "½ × 25/3 × 25/4 = 625/24", accept: ["26 1/24", "26.04"] },
    ],
    errors: [
      { id: "perp-gradient", looksLike: "used 4/3, the gradient of the radius, for the tangent, or flipped the fraction without changing the sign" },
      { id: "swapped", looksLike: "swapped the intercepts: on the x-axis y = 0, and on the y-axis x = 0" },
      { id: "wrong-formula", looksLike: "forgot the ½ in the area of the triangle" },
    ],
    dangerZones: [
      { id: "perp", when: "the student has the radius gradient", warn: "The tangent is perpendicular: flip and change the sign." },
      { id: "half", when: "the student multiplies the intercepts", warn: "Triangle: don't forget the ½." },
    ],
    coach: {
      keyWords: [{ text: "tangent", why: "Perpendicular to the radius OP." }, { text: "area of triangle OAB", why: "½ × the two intercepts." }],
      clues: ["Find the gradient of OP.", "The tangent's gradient is the negative reciprocal. Write its equation through P.", "Put y = 0 and x = 0 to find A and B."],
      traps: ["Did you include the ½?"],
    },
  },
  {
    id: "mw1-q13a", source: { paper: SRC, q: "13", part: "a" }, topic: "volcone", tier: "H", calculator: false,
    prompt: "The diagram shows a solid made from a hemisphere and a cone.<br>The radius of the hemisphere is r cm.<br>The cone has base radius r cm and perpendicular height h cm.<br>The volume of the cone is equal to the volume of the hemisphere.<br>Show that h = 2r",
    diagram: coneHemi, marks: 2, answer: "⅓πr²h = ⅔πr³, cancel to get h equal to twice r", solution: ["⅓πr²h = ½ × ⁴⁄₃πr³", "Divide both sides by ⅓πr²"], noWorking: "zero",
    points: [
      { id: "M1", code: "M1", criterion: "⅓πr²h = ½ × ⁴⁄₃πr³", reject: ["⁴⁄₃πr³ (whole sphere)"] },
      { id: "A1", code: "A1", dep: ["M1"], criterion: "Cancels ⅓πr² from both sides to reach h = 2r" },
    ],
    errors: [{ id: "half", looksLike: "used the volume of a whole sphere, which gives h = 4r" }],
    dangerZones: [{ id: "hemi", when: "the student writes the hemisphere volume", warn: "Half of ⁴⁄₃πr³." }],
    coach: {
      keyWords: [{ text: "volume of the cone is equal to the volume of the hemisphere", why: "Set up one equation." }, { text: "Show that", why: "Every step written." }],
      clues: ["Cone volume = ⅓πr²h.", "Hemisphere volume = half of ⁴⁄₃πr³.", "Set them equal and cancel ⅓πr²."],
      traps: ["Did you halve the sphere formula?"],
    },
  },
  {
    id: "mw1-q13b", source: { paper: SRC, q: "13", part: "b" }, topic: "surface", tier: "H", calculator: false,
    prompt: "Show that the total surface area of the solid is &nbsp;<span class=\"eq\">πr<sup>2</sup>(2 + √5)</span>&nbsp; cm<sup>2</sup>",
    promptText: "A solid is a cone (base radius r, height h = 2r) on a hemisphere (radius r). Show that the total surface area of the solid is πr²(2 + √5) cm².",
    diagram: coneHemi, marks: 3, answer: "2πr² + √5πr², which factorises to the given form", solution: ["l² = r² + (2r)² = 5r², l = r√5", "Hemisphere curved surface: 2πr²", "Cone curved surface: πr × r√5", "Total = 2πr² + √5πr²"], noWorking: "zero",
    points: [
      { id: "M1a", code: "M1", criterion: "Slant height: l² = r² + (2r)² = 5r², so l = r√5", reject: ["using h as the slant height", "√(5r²) = 5r"] },
      { id: "M1b", code: "M1", ft: true, criterion: "Curved surface of the hemisphere 2πr² plus curved surface of the cone πr × r√5" },
      { id: "A1", code: "A1", dep: ["M1a", "M1b"], criterion: "2πr² + √5πr² = πr²(2 + √5)", reject: ["adding the joining circle"] },
    ],
    errors: [
      { id: "wrong-formula", looksLike: "used h as the slant height in πrl" },
      { id: "surd-root", looksLike: "wrote √(5r²) as 5r: it is r√5" },
      { id: "wrong-share", looksLike: "added the circle where the two shapes join: it's inside the solid, so it isn't part of the surface" },
    ],
    dangerZones: [
      { id: "slant", when: "the student uses πrl", warn: "l is the slant height, not h." },
      { id: "join", when: "the student adds a πr² for the base", warn: "Is that circle on the outside of the solid?" },
    ],
    coach: {
      keyWords: [{ text: "total surface area", why: "Only the outside: two curved surfaces." }],
      clues: ["Find the slant height with Pythagoras: r and 2r.", "Cone curved surface = πrl; hemisphere curved surface = 2πr².", "Add them and factorise πr²."],
      traps: ["Did you leave out the hidden circle?"],
    },
  },
  {
    id: "mw1-q14a", source: { paper: SRC, q: "14", part: "a" }, topic: "vecproof", tier: "H", calculator: false,
    prompt: "OAB is a triangle. OBP is a straight line.<br>OA = <b>a</b> &nbsp;&nbsp; OB = <b>b</b><br>M is the midpoint of OA. &nbsp; N is the point on AB such that AN : NB = 2 : 1<br>MNP is a straight line.<br>Find the vector MN in terms of <b>a</b> and <b>b</b>. Give your answer in its simplest form.",
    promptText: `${VEC} Find vector MN in terms of a and b, in its simplest form.`,
    diagram: vectorTri, marks: 2, answer: "−⅙a + ⅔b", solution: ["AN = ⅔(b − a)", "MN = MA + AN = ½a + ⅔(b − a)"], noWorking: "full",
    points: [
      { id: "M1", code: "M1", criterion: "AN = ⅔(b − a)", accept: ["ON = ⅓a + ⅔b"], reject: ["½(b − a) (2 : 1 read as a half)"] },
      { id: "A1", code: "A1", dep: ["M1"], criterion: "MN = ½a + ⅔(b − a) = −⅙a + ⅔b" },
    ],
    errors: [{ id: "wrong-ratio", looksLike: "read AN : NB = 2 : 1 as ½: N is ⅔ of the way from A to B" }],
    dangerZones: [{ id: "ratio", when: "the student is finding AN", warn: "2 : 1 means 3 parts. AN is 2 of them." }],
    coach: {
      keyWords: [{ text: "AN : NB = 2 : 1", why: "N is two thirds of the way from A to B." }, { text: "simplest form", why: "Collect the a terms." }],
      clues: ["AB = b − a.", "AN is two thirds of AB.", "MN = MA + AN, with MA = ½a."],
      traps: ["Did you collect the a terms?"],
    },
  },
  {
    id: "mw1-q14b", source: { paper: SRC, q: "14", part: "b" }, topic: "vecproof", tier: "H", calculator: false,
    prompt: "Find the vector OP in terms of <b>b</b>.",
    promptText: `${VEC} MN = −⅙a + ⅔b. Find vector OP in terms of b.`,
    diagram: vectorTri, marks: 4, answer: "2b", solution: ["OP = kb, so MP = −½a + kb", "MP = λ MN", "a terms: −½ = −⅙λ, so λ = 3", "k = 3 × ⅔"], noWorking: "full",
    showWorking: "Write MP in terms of k, then compare it with MN.",
    points: [
      { id: "M1a", code: "M1", criterion: "Writes OP = kb, so MP = −½a + kb" },
      { id: "M1b", code: "M1", dep: ["M1a"], criterion: "MNP is a straight line, so MP = λ MN" },
      { id: "M1c", code: "M1", ft: true, dep: ["M1b"], criterion: "Compares the a terms: −½ = −⅙λ, so λ = 3" },
      { id: "A1", code: "A1", dep: ["M1c"], criterion: "k = 3 × ⅔ = 2, so OP = 2b", reject: ["a guess from the diagram"] },
    ],
    errors: [
      { id: "wrong-form", looksLike: "guessed from the diagram: it isn't drawn accurately" },
      { id: "stopped-early", looksLike: "set MP = λ MN but didn't compare the a parts and the b parts separately" },
    ],
    dangerZones: [{ id: "parallel", when: "the student is using the straight line MNP", warn: "Straight line: MP is a multiple of MN. Compare a parts, then b parts." }],
    coach: {
      keyWords: [{ text: "OP", why: "P is on the line OB extended, so OP = kb." }],
      clues: ["Let OP = kb and write MP in terms of a, b and k.", "MP must be a multiple of MN.", "Match the a parts to find the multiple, then the b parts to find k."],
      traps: ["Did you work it out, not guess from the diagram?"],
    },
  },
];
