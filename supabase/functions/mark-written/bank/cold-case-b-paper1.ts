// Cold Case B · Higher Paper 1 (non-calculator) · all 23 questions, 80 marks (CC-B/1H)
//
// Question wording is copied from the paper. Mark points follow Mike's Cold Case B Paper 1 Forensic
// Mark Scheme line for line; the errors and Mike-mode danger zones come from its "Where the marks go
// missing" boxes. Coaching (key words, clues, traps) is written for the coached paper.
//
// Students write on a blank page, not on the printed paper, so questions that are answered ON a
// diagram (Q10 graph, Q11 Venn, Q21 sketch) have marker notes saying what to accept instead.
import type { Scheme } from "../schemes.ts";

const fr = (n: string | number, d: string | number) => `<span class="fr"><span>${n}</span><span>${d}</span></span>`;
const SRC = "CC-B/1H";

// ---------- diagrams ----------
const TXT = `font-family="Times New Roman,serif" fill="currentColor"`;
const NDA = (x: number, y: number) => `<text x="${x}" y="${y}" font-size="9" text-anchor="middle" fill="currentColor" opacity=".7" font-family="Arial,sans-serif">Not drawn accurately</text>`;

// Q10: cumulative frequency polygon, plotted from the paper's graph
const cumfreqGraph = (() => {
  const X = (t: number) => 50 + t * (280 / 60), Y = (f: number) => 220 - f * 2.5;
  const minor: string[] = [], major: string[] = [], labels: string[] = [];
  for (let t = 0; t <= 60; t += 2) (t % 10 ? minor : major).push(`M${X(t).toFixed(1)} ${Y(0)}V${Y(80)}`);
  for (let f = 0; f <= 80; f += 2) (f % 10 ? minor : major).push(`M${X(0)} ${Y(f)}H${X(60).toFixed(1)}`);
  for (let t = 0; t <= 60; t += 10) labels.push(`<text x="${X(t).toFixed(1)}" y="236" text-anchor="middle">${t}</text>`);
  for (let f = 0; f <= 80; f += 10) labels.push(`<text x="42" y="${Y(f) + 4}" text-anchor="end">${f}</text>`);
  const pts = [[0, 0], [10, 4], [20, 20], [30, 44], [40, 60], [50, 72], [60, 80]].map(([t, f]) => `${X(t).toFixed(1)},${Y(f)}`).join(" ");
  return `<svg viewBox="0 0 350 270" role="img" aria-label="Cumulative frequency graph for 80 people. Time in minutes from 0 to 60 across, cumulative frequency from 0 to 80 up. The graph is a set of straight line segments joining (0, 0), (10, 4), (20, 20), (30, 44), (40, 60), (50, 72) and (60, 80)."><path d="${minor.join("")}" stroke="currentColor" stroke-width=".35" opacity=".35" fill="none"/><path d="${major.join("")}" stroke="currentColor" stroke-width=".7" opacity=".6" fill="none"/><polyline points="${pts}" fill="none" stroke="currentColor" stroke-width="1.8"/><g font-size="11" ${TXT}>${labels.join("")}<text x="190" y="256" text-anchor="middle">Time (minutes)</text><text transform="translate(14 120) rotate(-90)" text-anchor="middle">Cumulative frequency</text></g></svg>`;
})();

const vennBlank = `<svg viewBox="0 0 300 160" role="img" aria-label="An empty Venn diagram: a rectangle labelled ξ containing two overlapping circles, F on the left and S on the right."><rect x="10" y="10" width="280" height="140" fill="none" stroke="currentColor" stroke-width="1.5"/><g fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="120" cy="82" r="52"/><circle cx="180" cy="82" r="52"/></g><g ${TXT} font-size="15" font-style="italic"><text x="20" y="30">ξ</text><text x="70" y="36">F</text><text x="222" y="36">S</text></g></svg>`;

const sector = `<svg viewBox="0 0 260 150" role="img" aria-label="Sector OAB of a circle with centre O. OA is horizontal with length 6 cm. Angle AOB is 150 degrees and the arc runs from A over the top to B."><path d="M120 120 L220 120 A100 100 0 0 0 33.4 70 Z" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M135 120 A15 15 0 0 0 107 112.5" fill="none" stroke="currentColor" stroke-width="1.2"/><g ${TXT} font-size="13"><text x="116" y="138" font-style="italic">O</text><text x="226" y="126" font-style="italic">A</text><text x="20" y="68" font-style="italic">B</text><text x="160" y="136">6 cm</text><text x="112" y="100">150°</text></g>${NDA(130, 148)}</svg>`;

const sineTriangle = `<svg viewBox="0 0 320 150" role="img" aria-label="Triangle ABC with AB along the bottom. Angle at A is 30 degrees, angle at B is 45 degrees, and side BC is 6 cm. C is at the top."><path d="M30 120 L290 120 L195 25 Z" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M60 120 A30 30 0 0 0 56 105" fill="none" stroke="currentColor" stroke-width="1.2"/><path d="M270 120 A20 20 0 0 1 276 106" fill="none" stroke="currentColor" stroke-width="1.2"/><g ${TXT} font-size="13"><text x="16" y="124" font-style="italic">A</text><text x="296" y="124" font-style="italic">B</text><text x="191" y="18" font-style="italic">C</text><text x="64" y="114">30°</text><text x="244" y="113">45°</text><text x="248" y="68">6 cm</text></g>${NDA(160, 142)}</svg>`;

const cyclicQuad = `<svg viewBox="0 0 300 200" role="img" aria-label="Points A, B, C and D on a circle, joined to make a quadrilateral ABCD. A is at the top, D on the right, C at the bottom and B on the left. Angle BAD is (3x + 10) degrees and angle BCD is (2x + 20) degrees."><circle cx="150" cy="95" r="70" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M137.8 26.1 L215.8 71.1 L168.1 162.6 L84.2 118.9 Z" fill="none" stroke="currentColor" stroke-width="1.5"/><g ${TXT} font-size="13" font-style="italic"><text x="132" y="18">A</text><text x="222" y="72">D</text><text x="164" y="180">C</text><text x="68" y="124">B</text></g><g ${TXT} font-size="10" text-anchor="middle"><text x="148" y="60">(3x + 10)°</text><text x="155" y="136">(2x + 20)°</text></g>${NDA(150, 196)}</svg>`;

export const COLD_CASE_B1: Scheme[] = [
  {
    id: "ccb1-q1",
    source: { paper: SRC, q: "1" },
    topic: "fracmul",
    tier: "H",
    calculator: false,
    prompt: `Work out &nbsp;<span class="eq">2${fr(1, 4)} × 1${fr(3, 5)}</span><br>Give your answer as a mixed number in its simplest form.`,
    promptText: "Work out 2 1/4 × 1 3/5 (two and a quarter times one and three fifths). Give your answer as a mixed number in its simplest form.",
    marks: 3,
    answer: "3 3/5",
    solution: ["9/4 × 8/5", "= 72/20", "= 18/5", "= 3 3/5"],
    noWorking: "full",
    showWorking: "Write both mixed numbers as improper fractions first (9/4 and 8/5), so the first method mark is safe even if the arithmetic slips.",
    points: [
      { id: "M1a", code: "M1", criterion: "Converts both to improper fractions: 9/4 and 8/5.", accept: ["2.25 and 1.6"], reject: ["only one converted correctly"] },
      {
        id: "M1b", code: "M1", ft: true,
        criterion: "Multiplies: 72/20 oe (or cancels first to get 18/5).",
        accept: ["any correctly cancelled equivalent, e.g. 36/10", "cancelling before multiplying, e.g. 9/1 × 2/5 = 18/5"],
        reject: ["multiplying the whole numbers and the fractions separately: 2 × 1 and 1/4 × 3/5"],
      },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "3 3/5 (three and three fifths).", reject: ["72/20 or 18/5 left as an improper fraction", "3 6/10 (not simplest form)", "3.6"] },
    ],
    errors: [
      { id: "wrong-operation", looksLike: "multiplied the whole numbers and the fractions separately: 2 × 1 and 1/4 × 3/5, giving 2 3/20 (scores 0)" },
      { id: "wrong-form", looksLike: "left the answer as 72/20 or 18/5 instead of a mixed number in its simplest form" },
      { id: "not-simplified", looksLike: "3 6/10 or 3 12/20 not simplified" },
    ],
    dangerZones: [
      { id: "convert", when: "the student is about to multiply, or has started, while the mixed numbers are still on the page unconverted", warn: "Change both mixed numbers into top-heavy fractions before you multiply." },
      { id: "form", when: "the working has reached an improper fraction result such as 72/20 or 18/5", warn: "The question wants a mixed number in its simplest form, so don't stop at the top-heavy fraction." },
    ],
    coach: {
      keyWords: [
        { text: "mixed number", why: "18/5 is the right value but loses the last mark. The answer must be written like 3 3/5." },
        { text: "simplest form", why: "3 6/10 is not finished. Cancel until the top and bottom share no factor." },
        { text: "×", why: "Multiplying. You can't multiply mixed numbers part by part, so convert first." },
      ],
      clues: [
        "Mixed numbers can't be multiplied as they are. Change each one into an improper fraction first.",
        "2 1/4 = 9/4 and 1 3/5 = 8/5. Now multiply the tops and multiply the bottoms.",
        "9/4 × 8/5 = 72/20. Simplify, then change the improper fraction back into a mixed number.",
      ],
      traps: ["Is your answer a mixed number, not a top-heavy fraction or a decimal?", "Have you cancelled the fraction part as far as it will go?"],
    },
  },
  {
    id: "ccb1-q2a",
    source: { paper: SRC, q: "2", part: "a" },
    topic: "pfd",
    tier: "H",
    calculator: false,
    prompt: "Write 84 as a product of its prime factors.",
    marks: 2,
    answer: "2² × 3 × 7",
    solution: ["84 = 2 × 42", "42 = 2 × 21", "21 = 3 × 7", "84 = 2² × 3 × 7"],
    noWorking: "full",
    showWorking: "A factor tree or repeated division earns the method mark even if one branch goes wrong.",
    points: [
      {
        id: "M1", code: "M1",
        criterion: "A factor tree or repeated division with at least two correct steps.",
        accept: ["e.g. 84 = 2 × 42 and 42 = 2 × 21 shown", "the primes 2, 2, 3, 7 reached by a correct tree, even if the answer is then written as a list"],
      },
      {
        id: "A1", code: "A1", dep: ["M1"],
        criterion: "2 × 2 × 3 × 7 or 2² × 3 × 7",
        reject: ["2, 2, 3, 7 as a list with commas", "2² + 3 + 7 (plus signs)", "1 included as a factor"],
      },
    ],
    errors: [
      { id: "wrong-form", looksLike: "wrote the prime factors as a list (2, 2, 3, 7) or with plus signs instead of as a product with ×" },
      { id: "stopped-early", looksLike: "left a non-prime in the answer, e.g. 4 × 3 × 7 or 2 × 6 × 7" },
    ],
    dangerZones: [
      { id: "primes", when: "a factor tree or repeated division has been started", warn: "Keep splitting until every branch ends in a prime number." },
      { id: "product", when: "all the prime factors have been found and the final answer is being written", warn: "Write the answer as a product with × signs, not a list with commas." },
    ],
    coach: {
      keyWords: [
        { text: "product", why: "Product means multiplied together. The answer must use × signs, not commas." },
        { text: "prime factors", why: "Every number in the answer must be prime. 4 and 6 are not." },
      ],
      clues: [
        "Use a factor tree or keep dividing by the smallest prime that goes in.",
        "84 = 2 × 42. Keep going: 42 = 2 × 21.",
        "21 = 3 × 7. Now write all the primes at the ends of the branches multiplied together.",
      ],
      traps: ["Are all your numbers prime?", "Have you written them with × signs, not commas? Index form like 2² is a bonus, not a must."],
    },
  },
  {
    id: "ccb1-q2b",
    source: { paper: SRC, q: "2", part: "b" },
    topic: "hcf",
    tier: "H",
    calculator: false,
    prompt: "Find the highest common factor (HCF) of 84 and 126",
    marks: 2,
    answer: "42",
    solution: ["84 = 2² × 3 × 7", "126 = 2 × 3² × 7", "HCF = 2 × 3 × 7 = 42"],
    noWorking: "full",
    showWorking: "Write 126 as a product of primes and compare it with part (a). Then a slip at the end still keeps the method mark.",
    points: [
      {
        id: "M1", code: "M1",
        criterion: "Writes 126 as 2 × 3² × 7, or lists factors of both numbers, or identifies the common prime factors.",
        accept: ["a Venn diagram of the prime factors of 84 and 126", "2 × 3 × 7 identified as the common primes"],
      },
      { id: "A1", code: "A1", dep: ["M1"], criterion: "42", reject: ["252 (the LCM)", "a common factor that is not the highest, e.g. 14, 21 or 6"] },
    ],
    errors: [
      { id: "hcf-lcm", looksLike: "gave the lowest common multiple, 252" },
      { id: "stopped-early", looksLike: "stopped at a common factor that isn't the highest, e.g. 14 or 21" },
    ],
    dangerZones: [
      { id: "both", when: "prime factors of 126 (or of both numbers) have been written", warn: "Highest common factor: only the primes in both numbers, each with its lower power." },
    ],
    coach: {
      keyWords: [
        { text: "highest common factor", why: "The biggest number that divides into both. It can't be bigger than 84." },
        { text: "84 and 126", why: "You already have 84 in primes from part (a). Use it." },
      ],
      clues: [
        "Write 126 as a product of prime factors too, then compare with your answer to part (a).",
        "126 = 2 × 3² × 7. Which primes appear in both 84 and 126?",
        "Take each shared prime with its lower power: 2, 3 and 7. Multiply them.",
      ],
      traps: ["Does your answer divide exactly into both 84 and 126?", "Is it smaller than 84? If not, you may have found the LCM."],
    },
  },
  {
    id: "ccb1-q3a",
    source: { paper: SRC, q: "3", part: "a" },
    topic: "sf",
    tier: "H",
    calculator: false,
    prompt: "Write &nbsp;<span class=\"eq\">5.6 × 10<sup>−3</sup></span>&nbsp; as an ordinary number.",
    promptText: "Write 5.6 × 10^(−3) as an ordinary number.",
    marks: 1,
    answer: "0.0056",
    solution: ["0.0056"],
    noWorking: "full",
    points: [
      { id: "B1", code: "B1", criterion: "0.0056", reject: ["0.00056", "5600", "0.056"] },
    ],
    errors: [
      { id: "negative-index", looksLike: "moved the decimal point the wrong way, giving 5600" },
      { id: "index-law", looksLike: "moved the decimal point the wrong number of places, e.g. 0.00056 or 0.056" },
    ],
    dangerZones: [
      { id: "direction", when: "the student has started moving the decimal point or writing zeros", warn: "A negative power makes the number smaller. Count three places carefully." },
    ],
    coach: {
      keyWords: [
        { text: "ordinary number", why: "No powers of 10 in the answer. Write it out in full." },
        { text: "10−3", why: "A negative power means a small number: divide by 1000." },
      ],
      clues: [
        "A negative power of 10 makes the number smaller. 10⁻³ means ÷ 1000.",
        "Dividing by 1000 moves the digits three places to the right of the decimal point.",
        "5.6 → 0.56 → 0.056 → ? (one more place)",
      ],
      traps: ["Is your answer less than 1? It should be.", "Count the places: three moves from 5.6."],
    },
  },
  {
    id: "ccb1-q3b",
    source: { paper: SRC, q: "3", part: "b" },
    topic: "sf",
    tier: "H",
    calculator: false,
    prompt: "Work out &nbsp;<span class=\"eq\">(4 × 10<sup>5</sup>) × (6 × 10<sup>3</sup>)</span><br>Give your answer in standard form.",
    promptText: "Work out (4 × 10^5) × (6 × 10^3). Give your answer in standard form.",
    marks: 2,
    answer: "2.4 × 10⁹",
    solution: ["4 × 6 = 24", "10⁵ × 10³ = 10⁸", "24 × 10⁸ = 2.4 × 10⁹"],
    noWorking: "full",
    showWorking: "Write 24 × 10⁸ as a line before converting. That alone earns the method mark.",
    points: [
      { id: "M1", code: "M1", criterion: "24 × 10⁸ or 2 400 000 000 seen." },
      { id: "A1", code: "A1", dep: ["M1"], criterion: "2.4 × 10⁹", reject: ["24 × 10⁸ (not standard form)", "2.4 × 10⁸", "24 × 10¹⁵"] },
    ],
    errors: [
      { id: "not-standard-form", looksLike: "left the answer as 24 × 10⁸: the first number must be at least 1 and less than 10" },
      { id: "index-law", looksLike: "multiplied the powers (10¹⁵) instead of adding them" },
      { id: "sign-error", looksLike: "adjusted the power the wrong way when converting 24 × 10⁸, giving 2.4 × 10⁷" },
    ],
    dangerZones: [
      { id: "adjust", when: "the front numbers and powers have been multiplied, e.g. 24 × 10⁸ is on the page", warn: "24 isn't between 1 and 10. When you fix it, the power has to change too." },
    ],
    coach: {
      keyWords: [
        { text: "standard form", why: "The front number must be at least 1 and less than 10. 24 × 10⁸ is not finished." },
        { text: "×", why: "Multiplying powers of 10: add the indices." },
      ],
      clues: [
        "Multiply the front numbers together, then the powers of 10 together.",
        "4 × 6 = 24 and 10⁵ × 10³ = 10⁸ (add the indices).",
        "24 × 10⁸ isn't standard form yet. 24 = 2.4 × 10, so what happens to the power?",
      ],
      traps: ["Is the front number between 1 and 10?", "When the front number got 10 times smaller, did the power go up by 1?"],
    },
  },
  {
    id: "ccb1-q4",
    source: { paper: SRC, q: "4" },
    topic: "simlin",
    tier: "H",
    calculator: false,
    prompt: "Solve the simultaneous equations<br><span class=\"eq\">3x + 2y = 4</span><br><span class=\"eq\">5x − 3y = 13</span>",
    marks: 3,
    answer: "x = 2, y = −1",
    solution: ["9x + 6y = 12", "10x − 6y = 26", "Add: 19x = 38, so x = 2", "3(2) + 2y = 4, so 2y = −2", "y = −1"],
    noWorking: "full",
    showWorking: "Write the two scaled equations, then the add or subtract line. Those two lines are both method marks.",
    points: [
      {
        id: "M1a", code: "M1",
        criterion: "Multiplies to make the coefficients of one letter equal, e.g. 9x + 6y = 12 and 10x − 6y = 26 (both sides of each equation multiplied).",
        accept: ["15x + 10y = 20 and 15x − 9y = 39", "a correct rearrangement of one equation for x or y, ready to substitute"],
        reject: ["right-hand side not multiplied, e.g. 9x + 6y = 4"],
      },
      {
        id: "M1b", code: "M1", ft: true, dep: ["M1a"],
        criterion: "Adds to eliminate y: 19x = 38 (or a correct method to eliminate x, e.g. subtracting to get 19y = −19).",
        accept: ["substituting the rearranged equation into the other and simplifying to a correct one-letter equation"],
        reject: ["subtracting when the signs are different: 9x + 6y and 10x − 6y subtracted"],
      },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "x = 2 and y = −1.", reject: ["y = 1", "only one value found"] },
    ],
    errors: [
      { id: "subtracted", looksLike: "subtracted the equations when the signs were different: +6y and −6y are removed by adding" },
      { id: "missed-term", looksLike: "forgot to multiply the right-hand side when scaling an equation" },
      { id: "sign-error", looksLike: "lost the negative sign on y when substituting back, giving y = 1" },
      { id: "stopped-early", looksLike: "found x but not y" },
    ],
    dangerZones: [
      { id: "scale", when: "the student is multiplying an equation to match coefficients", warn: "Multiply every term, including the number on the right-hand side." },
      { id: "signs", when: "the equations have been scaled so one variable has matching coefficients", warn: "Check the signs before you combine: same signs subtract, different signs add." },
      { id: "both", when: "one variable has been found", warn: "Now find the other one, then check both values in the equation you didn't substitute into." },
    ],
    coach: {
      keyWords: [
        { text: "simultaneous equations", why: "Two unknowns, two equations. You need a value for x AND y." },
        { text: "5x − 3y = 13", why: "Watch the minus sign on 3y. It decides whether you add or subtract." },
      ],
      clues: [
        "Make the y terms match in size. Multiply the first equation by 3 and the second by 2.",
        "9x + 6y = 12 and 10x − 6y = 26. The y terms have different signs, so add the equations.",
        "19x = 38. Find x, then put it back into 3x + 2y = 4 to find y.",
      ],
      traps: ["Have you found both x and y?", "Check both in the second equation: does 5x − 3y really give 13?"],
    },
  },
  {
    id: "ccb1-q5",
    source: { paper: SRC, q: "5" },
    topic: "anglefacts",
    tier: "H",
    calculator: false,
    prompt: "ABC is an isosceles triangle with AB = AC.<br>BCD is a straight line.<br>Angle ACD = 112°<br>Work out the size of angle BAC.<br>Give a reason for each stage of your working.",
    diagram: `<svg viewBox="0 0 300 150" role="img" aria-label="Isosceles triangle ABC with AB equal to AC. B, C and D lie on a straight line. The exterior angle ACD is 112 degrees."><g fill="none" stroke="currentColor" stroke-width="1.6"><path d="M40 120 L240 120 M40 120 L100 20 L160 120"/><path d="M65 67 L75 73 M135 67 L125 73" stroke-width="1.3"/><path d="M175 120 A15 15 0 0 0 152 108"/></g><g font-family="Times New Roman,serif" font-style="italic" font-size="14" fill="currentColor"><text x="96" y="14">A</text><text x="30" y="138">B</text><text x="155" y="138">C</text><text x="236" y="138">D</text></g><text x="168" y="104" font-size="12" fill="currentColor" font-family="Times New Roman,serif">112°</text><text x="150" y="148" font-size="9" text-anchor="middle" fill="currentColor" opacity=".7" font-family="Arial,sans-serif">Not drawn accurately</text></svg>`,
    marks: 3,
    answer: "44°",
    solution: [
      "Angle ACB = 180 − 112 = 68° (angles on a straight line add up to 180°)",
      "Angle ABC = 68° (base angles of an isosceles triangle are equal)",
      "Angle BAC = 180 − 68 − 68 = 44° (angles in a triangle add up to 180°)",
    ],
    noWorking: "full",
    showWorking: "Write each angle you find with its reason on the same line.",
    points: [
      { id: "M1", code: "M1", criterion: "Angle ACB = 180 − 112 = 68°", accept: ["68° marked at C (or at B) on a redrawn diagram"] },
      { id: "A1", code: "A1", dep: ["M1"], criterion: "Angle BAC = 180 − 68 − 68 = 44°" },
      {
        id: "B1", code: "B1",
        criterion: "Reasons: angles on a straight line add up to 180°, base angles of an isosceles triangle are equal, angles in a triangle add up to 180°. All three needed.",
        accept: ["'sum to 180' for 'add up to 180'", "'angles at B and C are equal because the triangle is isosceles'"],
        reject: ["'isosceles' on its own: the reason must say which angles are equal", "any of the three reasons missing", "informal names such as 'Z angles'"],
      },
    ],
    errors: [
      { id: "wrong-share", looksLike: "chose the wrong pair of equal angles: the equal sides are AB and AC, so the equal angles are at B and C, not at A" },
      { id: "stopped-early", looksLike: "found 68° and gave that as the answer, instead of angle BAC" },
    ],
    markerNotes: ["Reasons must be close enough to the standard wording to be clear. 'Isosceles' on its own is not a reason."],
    dangerZones: [
      { id: "reasons", when: "the first angle (68°) has been found", warn: "Write the reason next to each angle as you go: a mark depends on them." },
      { id: "pair", when: "the student is deciding which angles in the triangle are equal", warn: "The equal sides are AB and AC, so which two angles are equal?" },
    ],
    coach: {
      keyWords: [
        { text: "AB = AC", why: "Two equal sides, so the two base angles at B and C are equal." },
        { text: "straight line", why: "Angles on a straight line add up to 180°. That unlocks angle ACB." },
        { text: "angle BAC", why: "The angle at A, the middle letter. Not the angle at C." },
        { text: "Give a reason for each stage", why: "A whole mark depends on the reasons. Write each one next to its step, in full sentences." },
      ],
      clues: [
        "Start at C. Angle ACB and the 112° sit on a straight line.",
        "Angle ACB = 180 − 112 = 68°. Which other angle must also be 68°, and why?",
        "Angles ABC and ACB are both 68°. Use the angles in triangle ABC to find angle BAC.",
      ],
      traps: ["Is your answer the angle at A, not one of the 68° angles?", "Have you written three reasons, in words, one for each step? 'Isosceles' on its own isn't enough."],
    },
  },
  {
    id: "ccb1-q6",
    source: { paper: SRC, q: "6" },
    topic: "sdp",
    tier: "H",
    calculator: false,
    prompt: "A metal block has a mass of 1.8 kg.<br>The volume of the block is 240 cm<sup>3</sup><br>Work out the density of the metal. Give your answer in g/cm<sup>3</sup>",
    marks: 3,
    answer: "7.5",
    solution: ["1.8 kg = 1800 g", "density = 1800 ÷ 240", "= 7.5 g/cm³"],
    noWorking: "full",
    showWorking: "Write the conversion to grams and the division as separate lines: each is a method mark.",
    points: [
      { id: "M1a", code: "M1", criterion: "Converts 1.8 kg to 1800 g." },
      { id: "M1b", code: "M1", ft: true, criterion: "1800 ÷ 240 (their mass in grams divided by 240).", reject: ["240 ÷ 1800 (volume divided by mass)", "1.8 ÷ 240 (mass not converted to grams)"] },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "7.5", accept: ["7.5 g/cm³", "15/2"] },
    ],
    errors: [
      { id: "wrong-operation", looksLike: "didn't convert kilograms to grams, giving 0.0075" },
      { id: "wrong-direction", looksLike: "divided volume by mass (240 ÷ 1800)" },
    ],
    markerNotes: ["The units on the answer line (g/cm³) tell the student to divide grams by cm³."],
    dangerZones: [
      { id: "units", when: "the student is about to divide using 1.8", warn: "Check the units on the answer line: grams, not kilograms." },
      { id: "order", when: "the division is being written", warn: "Density is mass divided by volume. Which number goes first?" },
    ],
    coach: {
      keyWords: [
        { text: "1.8 kg", why: "Kilograms. The answer is in grams per cm³, so convert first." },
        { text: "g/cm3", why: "Grams divided by cm³. That tells you the formula and the units." },
      ],
      clues: [
        "Density = mass ÷ volume. Get the mass into grams first.",
        "1.8 kg = 1800 g.",
        "Now divide 1800 by 240. Try simplifying: both divide by 10, then by 8.",
      ],
      traps: ["Did you change kilograms into grams?", "Did you divide mass by volume, not the other way round?"],
    },
  },
  {
    id: "ccb1-q7",
    source: { paper: SRC, q: "7" },
    topic: "pct",
    tier: "H",
    calculator: false,
    prompt: "The value of a car decreases from £12 000 to £10 200<br>Work out the percentage decrease in the value of the car.",
    marks: 3,
    answer: "15%",
    solution: ["Decrease = 12 000 − 10 200 = 1800", "1800/12 000 × 100", "= 15%"],
    noWorking: "full",
    showWorking: "Write the decrease, then the fraction over the original value. Both are method marks.",
    points: [
      { id: "M1a", code: "M1", criterion: "Finds the decrease: 12 000 − 10 200 = 1800" },
      {
        id: "M1b", code: "M1", ft: true, criterion: "1800/12 000 × 100 (their decrease over the original value, × 100).",
        accept: ["10 200/12 000 × 100 = 85 followed by 100 − 85", "multiplier method: 10 200 ÷ 12 000 = 0.85"],
        reject: ["dividing by 10 200 (the new value)"],
      },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "15", reject: ["85 (the percentage left)", "17.6…"] },
    ],
    errors: [
      { id: "reverse-pct", looksLike: "divided by the new value (10 200) instead of the original value" },
      { id: "complement", looksLike: "gave 85%, the percentage that is left, not the decrease" },
    ],
    dangerZones: [
      { id: "divide", when: "the decrease (1800) has been found and the student is about to divide", warn: "Percentage change is always measured against the starting value." },
      { id: "which", when: "a percentage of 85 appears in the working", warn: "Is that the decrease, or what's left?" },
    ],
    coach: {
      keyWords: [
        { text: "percentage decrease", why: "You want how much it went down, as a percentage of what it started at." },
        { text: "from £12 000", why: "The original value. This goes on the bottom of the fraction." },
      ],
      clues: [
        "Percentage change = change ÷ original × 100.",
        "The change is 12 000 − 10 200 = 1800.",
        "Work out 1800 ÷ 12 000 × 100. Cancel the zeros first.",
      ],
      traps: ["Did you divide by the original value, £12 000?", "Is your answer the decrease, not the percentage left?"],
    },
  },
  {
    id: "ccb1-q8",
    source: { paper: SRC, q: "8" },
    topic: "ratio",
    tier: "H",
    calculator: false,
    prompt: "<span class=\"eq\">x : y = 2 : 3</span> &nbsp;and&nbsp; <span class=\"eq\">y : z = 4 : 5</span><br><span class=\"eq\">x + y + z = 140</span><br>Work out the value of x.",
    promptText: "x : y = 2 : 3 and y : z = 4 : 5. x + y + z = 140. Work out the value of x.",
    marks: 3,
    answer: "32",
    solution: ["x : y = 8 : 12 and y : z = 12 : 15", "x : y : z = 8 : 12 : 15", "140 ÷ 35 = 4", "x = 8 × 4 = 32"],
    noWorking: "full",
    showWorking: "Write the combined ratio 8 : 12 : 15 as a line. That's the first method mark.",
    points: [
      { id: "M1a", code: "M1", criterion: "Makes the y parts equal: x : y : z = 8 : 12 : 15", accept: ["any multiple, e.g. 16 : 24 : 30"] },
      { id: "M1b", code: "M1", ft: true, dep: ["M1a"], criterion: "140 ÷ (8 + 12 + 15) = 4", accept: ["their total of parts dividing 140, from a correctly matched three-part ratio"] },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "x = 8 × 4 = 32", reject: ["48 (the value of y)", "60 (the value of z)"] },
    ],
    errors: [
      { id: "stopped-early", looksLike: "joined the two ratios without making y the same, e.g. 2 : 3 : 5 or 2 : 7 : 5" },
      { id: "wrong-share", looksLike: "gave the value of y (48) or z (60) instead of x" },
    ],
    markerNotes: ["Check: 32 + 48 + 60 = 140."],
    dangerZones: [
      { id: "match", when: "the student is combining the two ratios", warn: "y has to be the same number in both ratios before you join them." },
      { id: "which", when: "the value of one part has been found (4)", warn: "The question asks for x only." },
    ],
    coach: {
      keyWords: [
        { text: "x : y = 2 : 3", why: "y is 3 parts here…" },
        { text: "y : z = 4 : 5", why: "…but 4 parts here. Make them match before combining." },
        { text: "value of x", why: "Only x. Not y, not z." },
      ],
      clues: [
        "Make y the same in both ratios. The lowest common multiple of 3 and 4 is 12.",
        "x : y = 8 : 12 and y : z = 12 : 15, so x : y : z = 8 : 12 : 15.",
        "That's 35 parts in total. Find one part from 140, then multiply by x's share.",
      ],
      traps: ["Is y the same number in both ratios?", "Check: do your x, y and z add up to 140?"],
    },
  },
  {
    id: "ccb1-q9",
    source: { paper: SRC, q: "9" },
    topic: "errint",
    tier: "H",
    calculator: false,
    prompt: "A number, n, is rounded to 2 decimal places.<br>The result is 4.37<br>Write down the error interval for n.",
    marks: 2,
    answer: "4.365 ≤ n < 4.375",
    solution: ["Half of 0.01 is 0.005", "Lower bound 4.37 − 0.005 = 4.365", "Upper bound 4.37 + 0.005 = 4.375", "4.365 ≤ n < 4.375"],
    noWorking: "full",
    points: [
      { id: "B1a", code: "B1", criterion: "4.365 and 4.375 seen." },
      { id: "B1b", code: "B1", criterion: "Fully correct interval with the correct inequality signs: 4.365 ≤ n < 4.375", reject: ["4.365 ≤ n ≤ 4.375", "4.365 ≤ n < 4.374 or 4.3749", "4.36 ≤ n < 4.38"] },
    ],
    errors: [
      { id: "bounds-half", looksLike: "went up and down by 0.01 instead of by half of 0.01, giving 4.36 and 4.38" },
      { id: "wrong-form", looksLike: "wrote the upper bound as 4.374 or 4.3749, or used ≤ at both ends" },
    ],
    dangerZones: [
      { id: "half", when: "the student is working out the bounds", warn: "Go up and down by half of the rounding unit, not the whole unit." },
      { id: "signs", when: "the interval is being written with inequality signs", warn: "The lower end includes the value; the upper end doesn't. Check both signs." },
    ],
    coach: {
      keyWords: [
        { text: "2 decimal places", why: "Rounded to the nearest 0.01, so the bounds are half of 0.01 either side." },
        { text: "error interval", why: "Write it as an inequality: lower ≤ n < upper." },
      ],
      clues: [
        "The rounding unit is 0.01. Half of it is 0.005.",
        "Subtract 0.005 from 4.37 for the lower bound, add 0.005 for the upper bound.",
        "Use ≤ at the lower bound and < at the upper bound.",
      ],
      traps: ["Is your upper bound a 'clean' number, not 4.374 or 4.3749?", "Is the sign at the upper end < and not ≤?"],
    },
  },
  {
    id: "ccb1-q10a",
    source: { paper: SRC, q: "10", part: "a" },
    topic: "cumfreq",
    tier: "H",
    calculator: false,
    prompt: "The cumulative frequency graph shows information about the times, in minutes, that 80 people took to complete a puzzle.<br>Use the graph to find an estimate for the median time.",
    diagram: cumfreqGraph,
    marks: 1,
    answer: "28",
    solution: ["Median: the 40th person", "Read across from 40 on the cumulative frequency axis to the graph, then down", "≈ 28 minutes"],
    noWorking: "full",
    points: [
      { id: "B1", code: "B1", criterion: "28 (accept 27 to 29), read across from a cumulative frequency of 40.", reject: ["40 (the cumulative frequency, not the time)", "30 (reading the middle of the time axis)"] },
    ],
    errors: [
      { id: "wrong-direction", looksLike: "read from the wrong axis: started on the time axis instead of at 40 on the cumulative frequency axis" },
    ],
    markerNotes: ["The student can't draw on the printed graph, so reading lines won't be visible. Judge from the value written. Accept any answer from 27 to 29."],
    dangerZones: [
      { id: "axis", when: "the student is about to read the median from the graph", warn: "The median is the 40th person, so start at 40 on the vertical axis." },
    ],
    coach: {
      keyWords: [
        { text: "80 people", why: "The median is the middle person: half of 80." },
        { text: "median time", why: "The answer is a time, read from the horizontal axis." },
      ],
      clues: [
        "The median is halfway through the people, so start at half of 80 on the cumulative frequency axis.",
        "Go across from 40 to the graph.",
        "Then go straight down to the time axis and read the time.",
      ],
      traps: ["Did you start on the cumulative frequency axis (up the side)?", "Is your answer a time in minutes?"],
    },
  },
  {
    id: "ccb1-q10b",
    source: { paper: SRC, q: "10", part: "b" },
    topic: "cumfreq",
    tier: "H",
    calculator: false,
    prompt: "Use the graph to find an estimate for the interquartile range.",
    promptText: "The cumulative frequency graph shows information about the times, in minutes, that 80 people took to complete a puzzle. Use the graph to find an estimate for the interquartile range.",
    diagram: cumfreqGraph,
    marks: 2,
    answer: "20",
    solution: ["Lower quartile: 20th person → 20 minutes", "Upper quartile: 60th person → 40 minutes", "IQR = 40 − 20 = 20 minutes"],
    noWorking: "full",
    showWorking: "Write both quartiles down before subtracting. That's the method mark.",
    points: [
      { id: "M1", code: "M1", criterion: "Reads at a cumulative frequency of 20 or 60: lower quartile 20, upper quartile 40.", accept: ["either quartile read correctly (LQ 19 to 21 or UQ 39 to 41)"] },
      { id: "A1", code: "A1", dep: ["M1"], criterion: "40 − 20 = 20 (accept 19 to 21)", reject: ["giving the two quartiles without subtracting"] },
    ],
    errors: [
      { id: "stopped-early", looksLike: "gave the two quartiles (20 and 40) without subtracting" },
      { id: "wrong-direction", looksLike: "read the quartiles from the time axis instead of at 20 and 60 on the cumulative frequency axis" },
    ],
    markerNotes: ["The student can't draw on the printed graph. Judge the method mark from the quartile values written."],
    dangerZones: [
      { id: "quartiles", when: "the student is about to read the quartiles", warn: "Quartiles are a quarter and three quarters of 80 people. Start on the vertical axis." },
      { id: "subtract", when: "both quartiles have been written", warn: "The interquartile range is one number. What do you do with the two quartiles?" },
    ],
    coach: {
      keyWords: [
        { text: "interquartile range", why: "Upper quartile minus lower quartile. One number." },
      ],
      clues: [
        "The quartiles are a quarter of the way and three quarters of the way through the 80 people.",
        "Read across from those cumulative frequencies to the graph, then down to the time axis.",
        "Subtract the lower quartile time from the upper quartile time.",
      ],
      traps: ["Have you subtracted, giving one number?", "Did you read the quartiles from the vertical axis first?"],
    },
  },
  {
    id: "ccb1-q10c",
    source: { paper: SRC, q: "10", part: "c" },
    topic: "cumfreq",
    tier: "H",
    calculator: false,
    prompt: "Use the graph to find an estimate for the number of people who took more than 45 minutes.",
    promptText: "The cumulative frequency graph shows information about the times, in minutes, that 80 people took to complete a puzzle. Use the graph to find an estimate for the number of people who took more than 45 minutes.",
    diagram: cumfreqGraph,
    marks: 2,
    answer: "14",
    solution: ["At 45 minutes, cumulative frequency ≈ 66", "More than 45 minutes: 80 − 66 = 14"],
    noWorking: "full",
    showWorking: "Write the reading at 45 minutes (66) before you subtract.",
    points: [
      { id: "M1", code: "M1", criterion: "Reads the cumulative frequency at 45 minutes: 66 (accept 65 to 67)." },
      { id: "A1", code: "A1", dep: ["M1"], criterion: "80 − 66 = 14 (accept 13 to 15)", reject: ["66 (the number who took 45 minutes or less)"] },
    ],
    errors: [
      { id: "complement", looksLike: "gave 66, the number who took 45 minutes or less: 'more than' needs a subtraction from 80" },
    ],
    markerNotes: ["The student can't draw on the printed graph. Judge the method mark from the reading written."],
    dangerZones: [
      { id: "more", when: "a reading at 45 minutes has been taken", warn: "The graph gives how many took 45 minutes or less. The question says more than." },
    ],
    coach: {
      keyWords: [
        { text: "more than 45 minutes", why: "The graph counts people up to a time. 'More than' means the rest of the 80." },
      ],
      clues: [
        "Go up from 45 on the time axis to the graph, then across to the cumulative frequency.",
        "That reading is the number of people who took 45 minutes or less.",
        "Subtract it from the total of 80.",
      ],
      traps: ["Did you subtract from 80?"],
    },
  },
  {
    id: "ccb1-q11a",
    source: { paper: SRC, q: "11", part: "a" },
    topic: "venn",
    tier: "H",
    calculator: false,
    prompt: "50 students were asked whether they study French (F) or Spanish (S).<br>28 students study French.<br>22 students study Spanish.<br>8 students study neither French nor Spanish.<br>Complete the Venn diagram.<br><small>Draw the Venn diagram in your working, or write the number for each region.</small>",
    promptText: "50 students were asked whether they study French (F) or Spanish (S). 28 students study French. 22 students study Spanish. 8 students study neither French nor Spanish. Complete the Venn diagram (circles F and S inside a rectangle ξ).",
    diagram: vennBlank,
    marks: 3,
    answer: "French only 20, both 8, Spanish only 14, neither 8",
    solution: ["50 − 8 = 42 students in the circles", "28 + 22 − 42 = 8 study both", "French only 28 − 8 = 20; Spanish only 22 − 8 = 14; neither 8"],
    noWorking: "full",
    showWorking: "Write the calculation for the overlap (28 + 22 + 8 − 50) before filling in the diagram.",
    points: [
      { id: "M1", code: "M1", criterion: "28 + 22 + 8 − 50 = 8 (or 50 − 8 = 42 inside the circles).", accept: ["8 placed in the intersection with 20 and 14 either side (implies the method)"] },
      { id: "A1a", code: "A1", dep: ["M1"], criterion: "8 in the intersection." },
      { id: "A1b", code: "A1", dep: ["M1"], criterion: "20 and 14 in the other two regions (20 French only, 14 Spanish only), and 8 outside the circles.", reject: ["28 and 22 in the 'only' regions"] },
    ],
    errors: [
      { id: "stopped-early", looksLike: "wrote 28 and 22 in the 'French only' and 'Spanish only' regions: those totals include the students who study both" },
    ],
    markerNotes: [
      "The student can't write on the printed diagram. Accept a redrawn Venn diagram with the numbers in place, or the four regions written out in words (French only, both, Spanish only, neither).",
      "A completed diagram with all four numbers correct implies the M1.",
    ],
    dangerZones: [
      { id: "overlap", when: "the student is about to write numbers in the circles", warn: "28 and 22 include the students who do both. Find the overlap first." },
    ],
    coach: {
      keyWords: [
        { text: "50 students", why: "Everyone, inside and outside the circles." },
        { text: "neither French nor Spanish", why: "These go outside both circles." },
      ],
      clues: [
        "Take away the students who study neither: that leaves the number inside the circles.",
        "28 + 22 is more than the number inside the circles. The extra are counted twice: they study both.",
        "Put the overlap in the middle, then subtract it from 28 and from 22 for the 'only' regions.",
      ],
      traps: ["Do your four numbers add up to 50?", "Does the whole French circle add up to 28?"],
    },
  },
  {
    id: "ccb1-q11b",
    source: { paper: SRC, q: "11", part: "b" },
    topic: "venn",
    tier: "H",
    calculator: false,
    prompt: "One of the students who studies French is chosen at random.<br>Find the probability that this student also studies Spanish.",
    promptText: "50 students were asked whether they study French or Spanish. 28 study French, 22 study Spanish, 8 study neither (so 8 study both). One of the students who studies French is chosen at random. Find the probability that this student also studies Spanish.",
    marks: 2,
    answer: "8/28",
    solution: ["The student is one of the 28 who study French", "8 of them also study Spanish", "8/28 = 2/7"],
    noWorking: "full",
    showWorking: "Write the fraction before simplifying, so the denominator 28 is visible.",
    points: [
      { id: "M1", code: "M1", criterion: "A fraction with denominator 28.", accept: ["k/28 for any k"] },
      { id: "A1", code: "A1", dep: ["M1"], criterion: "8/28 oe", accept: ["2/7", "4/14", "0.285… (to at least 2 significant figures)"], reject: ["8/50", "8 out of 28 written as a ratio 8 : 28"] },
    ],
    errors: [
      { id: "wrong-denominator", looksLike: "used 50 as the denominator, giving 8/50: the student is chosen from the 28 who study French" },
      { id: "not-probability", looksLike: "gave a count (8) instead of a probability" },
    ],
    dangerZones: [
      { id: "given", when: "the student is writing the denominator of the probability", warn: "The student is chosen from the French group, not from all 50." },
    ],
    coach: {
      keyWords: [
        { text: "who studies French", why: "This shrinks the group you choose from to the French circle only." },
        { text: "also studies Spanish", why: "The overlap: students in both circles." },
      ],
      clues: [
        "You're only choosing from the students who study French.",
        "So the denominator is the total in the French circle.",
        "The numerator is how many of those are in the overlap.",
      ],
      traps: ["Is the denominator the French total, not 50?"],
    },
  },
  {
    id: "ccb1-q12",
    source: { paper: SRC, q: "12" },
    topic: "dirprop",
    tier: "H",
    calculator: false,
    prompt: "y is directly proportional to the square root of x.<br>y = 12 when x = 9<br>Work out the value of y when x = 25",
    marks: 3,
    answer: "20",
    solution: ["y = k√x", "12 = k × √9 = 3k, so k = 4", "y = 4 × √25 = 4 × 5"],
    noWorking: "full",
    showWorking: "Start with y = k√x written down. That alone is the first method mark.",
    points: [
      { id: "M1a", code: "M1", criterion: "y = k√x", accept: ["y ∝ √x"], reject: ["y = kx", "y = kx²"] },
      { id: "M1b", code: "M1", dep: ["M1a"], criterion: "12 = k × 3 so k = 4" },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "y = 4 × √25 = 20", reject: ["33 1/3 (from y = kx)", "100"] },
    ],
    errors: [
      { id: "no-sqrt", looksLike: "ignored 'square root' and used y = kx, giving k = 4/3 and y = 33 1/3" },
      { id: "missed-square", looksLike: "squared x instead of square-rooting it" },
    ],
    dangerZones: [
      { id: "form", when: "the student is writing the proportion formula", warn: "Proportional to the square root of x. Make sure the root is in your formula." },
    ],
    coach: {
      keyWords: [
        { text: "directly proportional", why: "y = k × something." },
        { text: "square root of x", why: "The something is √x, not x." },
      ],
      clues: [
        "Write y = k√x.",
        "Put in y = 12 and x = 9 to find k: √9 = 3.",
        "k = 4. Now use x = 25.",
      ],
      traps: ["Did your formula have √x in it?", "Did you square-root 25 before multiplying?"],
    },
  },
  {
    id: "ccb1-q13",
    source: { paper: SRC, q: "13" },
    topic: "nthquad",
    tier: "H",
    calculator: false,
    prompt: "Here are the first five terms of a quadratic sequence.<br><span class=\"eq\">4 &nbsp;&nbsp; 9 &nbsp;&nbsp; 18 &nbsp;&nbsp; 31 &nbsp;&nbsp; 48</span><br>Find an expression, in terms of n, for the nth term of this sequence.",
    promptText: "Here are the first five terms of a quadratic sequence: 4, 9, 18, 31, 48. Find an expression, in terms of n, for the nth term of this sequence.",
    marks: 3,
    answer: "2n² − n + 3",
    solution: ["First differences: 5, 9, 13, 17", "Second difference: 4, so 2n²", "2n²: 2, 8, 18, 32, 50", "Sequence − 2n²: 2, 1, 0, −1, −2 → −n + 3", "nth term = 2n² − n + 3"],
    noWorking: "full",
    showWorking: "Write the differences and the 'subtract 2n²' row. Each is a method mark.",
    points: [
      { id: "M1a", code: "M1", criterion: "Finds the second difference, 4, and halves it to get 2n².", reject: ["4n² (second difference not halved)"] },
      { id: "M1b", code: "M1", ft: true, dep: ["M1a"], criterion: "Subtracts 2n² from each term to get 2, 1, 0, −1, −2, a linear sequence with nth term −n + 3." },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "2n² − n + 3" },
    ],
    errors: [
      { id: "second-difference", looksLike: "used the second difference as the coefficient (4n²): it must be halved" },
      { id: "nth-term", looksLike: "gave a linear nth term from the first differences" },
      { id: "sign-error", looksLike: "sign error in the linear part, e.g. 2n² + n + 3" },
    ],
    markerNotes: ["Check by substituting n = 1 and n = 2: you should get 4 and 9."],
    dangerZones: [
      { id: "halve", when: "the second difference (4) has been found", warn: "The n² coefficient is half the second difference." },
      { id: "linear", when: "the student has subtracted 2n² and is finding the linear part", warn: "The leftover sequence goes down, so watch the sign on n." },
    ],
    coach: {
      keyWords: [
        { text: "quadratic sequence", why: "The second differences are constant. Expect an n² term." },
        { text: "in terms of n", why: "Your answer is an expression with n in it, not a number." },
      ],
      clues: [
        "Find the first differences, then the second difference.",
        "Halve the second difference to get the n² coefficient. Then write out 2n² for n = 1 to 5.",
        "Subtract those from the sequence. What's left is linear: find its nth term and add it on.",
      ],
      traps: ["Did you halve the second difference?", "Check: does n = 1 give 4 and n = 2 give 9?"],
    },
  },
  {
    id: "ccb1-q14a",
    source: { paper: SRC, q: "14", part: "a" },
    topic: "surd",
    tier: "H",
    calculator: false,
    prompt: "Expand and simplify &nbsp;<span class=\"eq\">(3 + 2√5)(4 − √5)</span>",
    marks: 2,
    answer: "2 + 5√5",
    solution: ["3 × 4 = 12", "3 × −√5 = −3√5", "2√5 × 4 = 8√5", "2√5 × −√5 = −10", "12 − 3√5 + 8√5 − 10 = 2 + 5√5"],
    noWorking: "full",
    showWorking: "Write all four terms of the expansion before collecting.",
    points: [
      { id: "M1", code: "M1", criterion: "Expands to four terms with at least three correct: 12 − 3√5 + 8√5 − 10" },
      { id: "A1", code: "A1", dep: ["M1"], criterion: "2 + 5√5", reject: ["22 + 5√5 (−10 written as +10)", "unsimplified −2√25 left in"] },
    ],
    errors: [
      { id: "surd-root", looksLike: "got the last term wrong: 2√5 × (−√5) = −2 × 5 = −10, not −2√5, or −2√25 left unsimplified" },
      { id: "sign-error", looksLike: "sign slip on −3√5 or −10" },
    ],
    dangerZones: [
      { id: "last", when: "the student is multiplying 2√5 by −√5", warn: "√5 × √5 is a whole number. And keep the minus sign." },
    ],
    coach: {
      keyWords: [
        { text: "Expand and simplify", why: "Four terms, then collect: whole numbers together, √5 terms together." },
      ],
      clues: [
        "Multiply each term in the first bracket by each term in the second: four terms.",
        "The first three are 12, −3√5 and 8√5.",
        "The last is 2√5 × (−√5). √5 × √5 = 5, so it's −2 × 5.",
      ],
      traps: ["Did you get four terms?", "Is the last term a whole number with the right sign?"],
    },
  },
  {
    id: "ccb1-q14b",
    source: { paper: SRC, q: "14", part: "b" },
    topic: "surd",
    tier: "H",
    calculator: false,
    prompt: `Rationalise the denominator of &nbsp;<span class="eq">${fr(6, "√3")}</span><br>Give your answer in its simplest form.`,
    promptText: "Rationalise the denominator of 6/√3 (six over root three). Give your answer in its simplest form.",
    marks: 2,
    answer: "2√3",
    solution: ["6/√3 × √3/√3", "= 6√3/3", "= 2√3"],
    noWorking: "full",
    showWorking: "Show the × √3/√3 step and 6√3/3 before cancelling.",
    points: [
      { id: "M1", code: "M1", criterion: "Multiplies the numerator and denominator by √3: 6√3/3" },
      { id: "A1", code: "A1", dep: ["M1"], criterion: "2√3", reject: ["6√3/3 (not simplest form)"] },
    ],
    errors: [
      { id: "not-simplified", looksLike: "stopped at 6√3/3: 'simplest form' means the 6 and the 3 must be cancelled" },
      { id: "numerator-not-scaled", looksLike: "multiplied only the denominator by √3" },
    ],
    dangerZones: [
      { id: "cancel", when: "6√3/3 is on the page", warn: "Simplest form: can the 6 and the 3 cancel?" },
    ],
    coach: {
      keyWords: [
        { text: "Rationalise the denominator", why: "Get rid of the surd on the bottom." },
        { text: "simplest form", why: "After rationalising, cancel any common factor." },
      ],
      clues: [
        "Multiply the top and the bottom by √3.",
        "√3 × √3 = 3, so the denominator becomes 3.",
        "6√3 over 3: cancel the 6 and the 3.",
      ],
      traps: ["Is there still a fraction you could cancel?"],
    },
  },
  {
    id: "ccb1-q15",
    source: { paper: SRC, q: "15" },
    topic: "arcs",
    tier: "H",
    calculator: false,
    prompt: "OAB is a sector of a circle, centre O.<br>The radius of the circle is 6 cm. Angle AOB = 150°<br>Work out the perimeter of the sector.<br>Give your answer in terms of π.",
    diagram: sector,
    marks: 3,
    answer: "5π + 12",
    solution: ["Arc = 150/360 × 2 × π × 6", "= 5π", "Perimeter = 5π + 6 + 6 = 5π + 12 cm"],
    noWorking: "full",
    showWorking: "Write the arc length calculation in full before adding the radii.",
    points: [
      { id: "M1", code: "M1", criterion: "150/360 × 2 × π × 6", accept: ["5/12 × 12π"], reject: ["150/360 × π × 6² (sector area)"] },
      { id: "A1a", code: "A1", dep: ["M1"], criterion: "Arc length = 5π" },
      { id: "A1b", code: "A1", dep: ["M1"], criterion: "Perimeter = 5π + 12", reject: ["5π (arc only)", "17π", "15π + 12"] },
    ],
    errors: [
      { id: "wrong-formula", looksLike: "found the area of the sector (15π) instead of the perimeter" },
      { id: "stopped-early", looksLike: "gave only the arc length: the perimeter includes the two radii" },
      { id: "frac-add", looksLike: "combined 5π + 12 into 17π" },
    ],
    dangerZones: [
      { id: "formula", when: "the student is choosing a formula", warn: "Perimeter is a length. Area formulas have r²." },
      { id: "radii", when: "the arc length (5π) has been found", warn: "The perimeter goes all the way round the sector." },
    ],
    coach: {
      keyWords: [
        { text: "perimeter", why: "The distance all the way round: arc plus two radii." },
        { text: "in terms of π", why: "Leave π in. Don't use 3.14." },
      ],
      clues: [
        "The arc is 150/360 of the whole circumference.",
        "Circumference = 2 × π × 6. Multiply by 150/360.",
        "Add the two straight edges, each 6 cm. 5π and a number can't be combined.",
      ],
      traps: ["Have you added both radii?", "Is π still in your answer, kept separate from the number?"],
    },
  },
  {
    id: "ccb1-q16",
    source: { paper: SRC, q: "16" },
    topic: "volcone",
    tier: "H",
    calculator: false,
    prompt: "A solid metal sphere has radius 3 cm.<br>The sphere is melted down and all the metal is used to make a solid cone.<br>The cone has base radius 3 cm.<br>Work out the height of the cone.",
    marks: 3,
    answer: "12",
    solution: ["Sphere: 4/3 × π × 3³ = 36π", "Cone: 1/3 × π × 3² × h = 36π", "3πh = 36π", "h = 12 cm"],
    noWorking: "full",
    showWorking: "Write the sphere volume as 36π, then the cone equation. Keep π in.",
    points: [
      { id: "M1a", code: "M1", criterion: "Volume of sphere = 4/3 × π × 3³ = 36π", accept: ["113.1… if π was replaced (non-calculator, so rare)"] },
      { id: "M1b", code: "M1", ft: true, criterion: "Sets up the cone: 1/3 × π × 3² × h = 36π (their sphere volume)." },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "h = 12", reject: ["4 (missing the 1/3)"] },
    ],
    errors: [
      { id: "index-law", looksLike: "worked out 3³ as 9" },
      { id: "wrong-formula", looksLike: "left out the 1/3 in the cone formula, giving h = 4" },
      { id: "rounding", looksLike: "replaced π with 3.14 instead of keeping π in both volumes so it cancels" },
    ],
    dangerZones: [
      { id: "cube", when: "the student is working out 3³", warn: "Cubed means three 3s multiplied." },
      { id: "third", when: "the cone volume formula is being written", warn: "The cone formula has a third in it." },
    ],
    coach: {
      keyWords: [
        { text: "all the metal", why: "The volume doesn't change: sphere volume = cone volume." },
        { text: "height of the cone", why: "The unknown is h in the cone formula." },
      ],
      clues: [
        "Volume of a sphere = 4/3 πr³. Work it out with r = 3, keeping π.",
        "Volume of a cone = 1/3 πr²h. Set it equal to the sphere's volume.",
        "Simplify the left side to a number × πh, then divide both sides.",
      ],
      traps: ["Did you include the 1/3 in the cone?", "Did you keep π in, so it cancels?"],
    },
  },
  {
    id: "ccb1-q17",
    source: { paper: SRC, q: "17" },
    topic: "perp",
    tier: "H",
    calculator: false,
    prompt: "A is the point (−2, 3) and B is the point (4, 6).<br>Find an equation of the line that is perpendicular to AB and passes through B.<br>Give your answer in the form y = mx + c",
    marks: 4,
    answer: "y = −2x + 14",
    solution: ["Gradient AB = (6 − 3)/(4 − (−2)) = 3/6 = 1/2", "Perpendicular gradient = −2", "6 = −2 × 4 + c, so c = 14", "y = −2x + 14"],
    noWorking: "full",
    showWorking: "Write each gradient on its own line, then the substitution. Three of the four marks are for those lines.",
    points: [
      { id: "M1a", code: "M1", criterion: "Gradient of AB = (6 − 3)/(4 − (−2)) = 1/2", accept: ["3/6"], reject: ["6/3 = 2 (change in x over change in y)"] },
      { id: "M1b", code: "M1", ft: true, criterion: "Perpendicular gradient = −2 (negative reciprocal of their gradient)." , reject: ["−1/2", "2"] },
      { id: "M1c", code: "M1", ft: true, criterion: "Substitutes (4, 6): 6 = −2 × 4 + c (with their perpendicular gradient).", accept: ["y − 6 = −2(x − 4)"], reject: ["substituting A (−2, 3)"] },
      { id: "A1", code: "A1", dep: ["M1c"], criterion: "y = −2x + 14" },
    ],
    errors: [
      { id: "swapped", looksLike: "worked out the gradient as change in x over change in y, giving 2" },
      { id: "perp-gradient", looksLike: "used −1/2 or 2 as the perpendicular gradient: it must be the negative reciprocal" },
      { id: "wrong-share", looksLike: "substituted the coordinates of A when the line passes through B" },
    ],
    dangerZones: [
      { id: "gradient", when: "the student is working out the gradient of AB", warn: "Change in y over change in x. And subtracting −2 is adding 2." },
      { id: "perp", when: "the gradient of AB has been found", warn: "Perpendicular: flip it and change the sign." },
      { id: "point", when: "the student is about to substitute a point", warn: "The line passes through B." },
    ],
    coach: {
      keyWords: [
        { text: "perpendicular to AB", why: "Find AB's gradient first, then take its negative reciprocal." },
        { text: "passes through B", why: "Use B's coordinates to find c, not A's." },
        { text: "y = mx + c", why: "Your final answer must look like this." },
      ],
      clues: [
        "Gradient of AB = change in y ÷ change in x.",
        "AB has gradient 1/2. A perpendicular gradient multiplies with it to give −1.",
        "Put the gradient and the point (4, 6) into y = mx + c and solve for c.",
      ],
      traps: ["Is your gradient the negative reciprocal?", "Did you use B (4, 6), not A?"],
    },
  },
  {
    id: "ccb1-q18",
    source: { paper: SRC, q: "18" },
    topic: "rearr",
    tier: "H",
    calculator: false,
    prompt: `Make x the subject of the formula &nbsp;<span class="eq">y = ${fr("3x + 1", "x − 2")}</span>`,
    promptText: "Make x the subject of the formula y = (3x + 1)/(x − 2).",
    marks: 4,
    answer: "x = (2y + 1)/(y − 3)",
    solution: ["y(x − 2) = 3x + 1", "xy − 2y = 3x + 1", "xy − 3x = 2y + 1", "x(y − 3) = 2y + 1", "x = (2y + 1)/(y − 3)"],
    noWorking: "full",
    showWorking: "Write every line: multiply up, collect the x terms, factorise. Each is a method mark.",
    points: [
      { id: "M1a", code: "M1", criterion: "Multiplies by the denominator: y(x − 2) = 3x + 1", reject: ["yx − 2 = 3x + 1 (y not multiplied by −2)"] },
      { id: "M1b", code: "M1", ft: true, dep: ["M1a"], criterion: "Expands and collects the x terms on one side: xy − 3x = 2y + 1", accept: ["3x − xy = −2y − 1"] },
      { id: "M1c", code: "M1", ft: true, dep: ["M1b"], criterion: "Factorises: x(y − 3) = 2y + 1", accept: ["x(3 − y) = −2y − 1"] },
      { id: "A1", code: "A1", dep: ["M1c"], criterion: "x = (2y + 1)/(y − 3)", accept: ["x = (−2y − 1)/(3 − y)", "x = −(2y + 1)/(3 − y)"], reject: ["x still on both sides"] },
    ],
    errors: [
      { id: "missed-term", looksLike: "wrote yx − 2 and not yx − 2y when multiplying out" },
      { id: "stopped-early", looksLike: "left x on both sides of the final answer: collect the x terms and factorise" },
      { id: "sign-error", looksLike: "sign slip moving terms across the equals sign" },
    ],
    dangerZones: [
      { id: "expand", when: "the student has multiplied both sides by (x − 2)", warn: "y multiplies both terms in the bracket." },
      { id: "collect", when: "x appears on both sides of the equation", warn: "Get every x term on one side, then factorise x out." },
    ],
    coach: {
      keyWords: [
        { text: "Make x the subject", why: "x on its own on one side, and no x on the other side." },
      ],
      clues: [
        "Multiply both sides by (x − 2) to clear the fraction.",
        "Expand, then move all the x terms to one side and everything else to the other.",
        "x appears twice: factorise x out, then divide by the bracket.",
      ],
      traps: ["Is there an x anywhere on the right-hand side? There shouldn't be.", "Did y multiply the −2 as well?"],
    },
  },
  {
    id: "ccb1-q19",
    source: { paper: SRC, q: "19" },
    topic: "siner",
    tier: "H",
    calculator: false,
    prompt: "ABC is a triangle.<br>Angle BAC = 30° &nbsp;&nbsp; Angle ABC = 45° &nbsp;&nbsp; BC = 6 cm<br>Work out the length of AC.<br>Give your answer in the form a√2 where a is an integer.",
    diagram: sineTriangle,
    marks: 3,
    answer: "6√2",
    solution: ["AC/sin 45° = 6/sin 30°", "AC = 6 × sin 45° ÷ sin 30°", "= 6 × (√2/2) ÷ (1/2)", "= 6√2 cm"],
    noWorking: "full",
    showWorking: "Write the sine rule with the numbers in, then the exact values. Those are the two method marks.",
    points: [
      { id: "M1a", code: "M1", criterion: "AC/sin 45° = 6/sin 30°", accept: ["sin 45°/AC = sin 30°/6"], reject: ["AC paired with sin 30°"] },
      { id: "M1b", code: "M1", dep: ["M1a"], criterion: "Uses sin 30° = 1/2 and sin 45° = √2/2.", accept: ["sin 45° = 1/√2"] },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "AC = 6√2", reject: ["3√2/2", "a decimal such as 8.49"] },
    ],
    errors: [
      { id: "wrong-ratio", looksLike: "paired a side with the wrong angle: AC goes with the angle opposite it, angle B (45°)" },
      { id: "rearrange", looksLike: "divided by 1/2 as if it were halving, giving 3√2/2: dividing by 1/2 doubles" },
    ],
    markerNotes: ["Non-calculator: the exact values sin 30° = 1/2 and sin 45° = √2/2 must be used."],
    dangerZones: [
      { id: "pair", when: "the student is writing the sine rule", warn: "Each side goes with the angle opposite it. Which angle is opposite AC?" },
      { id: "divide", when: "the student is dividing by sin 30° = 1/2", warn: "Dividing by a half is the same as multiplying by 2." },
    ],
    coach: {
      keyWords: [
        { text: "Angle BAC = 30°", why: "Opposite BC, the 6 cm side." },
        { text: "Angle ABC = 45°", why: "Opposite AC, the side you want." },
        { text: "a√2", why: "An exact answer. Use exact trig values, not decimals." },
      ],
      clues: [
        "Two angles and a side opposite one of them: use the sine rule.",
        "AC/sin 45° = 6/sin 30°.",
        "sin 30° = 1/2 and sin 45° = √2/2. Dividing by 1/2 doubles.",
      ],
      traps: ["Is AC paired with the 45° angle?", "Is your answer in the form a√2 with a whole number a?"],
    },
  },
  {
    id: "ccb1-q20",
    source: { paper: SRC, q: "20" },
    topic: "circthm",
    tier: "H",
    calculator: false,
    prompt: "A, B, C and D are points on a circle.<br>Angle BAD = (3x + 10)° &nbsp;&nbsp; Angle BCD = (2x + 20)°<br>Work out the size of angle BAD.<br>You must show all your working.",
    diagram: cyclicQuad,
    marks: 3,
    answer: "100°",
    solution: ["Opposite angles of a cyclic quadrilateral add up to 180°", "3x + 10 + 2x + 20 = 180", "5x + 30 = 180, 5x = 150, x = 30", "Angle BAD = 3 × 30 + 10 = 100°"],
    noWorking: "zero",
    showWorking: "This question says 'You must show all your working', so an answer on its own scores nothing.",
    points: [
      { id: "M1a", code: "M1", criterion: "3x + 10 + 2x + 20 = 180 (opposite angles of a cyclic quadrilateral add up to 180°).", reject: ["3x + 10 = 2x + 20 (angles set equal)"] },
      { id: "M1b", code: "M1", ft: true, dep: ["M1a"], criterion: "5x = 150 so x = 30" },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "Angle BAD = 3 × 30 + 10 = 100°", reject: ["30 (the value of x)", "80° (angle BCD)"] },
    ],
    errors: [
      { id: "wrong-formula", looksLike: "set the two angles equal to each other, giving x = 10" },
      { id: "stopped-early", looksLike: "stopped at x = 30: the question asks for the angle, not for x" },
      { id: "wrong-share", looksLike: "gave angle BCD (80°) instead of angle BAD" },
    ],
    dangerZones: [
      { id: "theorem", when: "the student is writing an equation in x", warn: "These angles are opposite each other in a cyclic quadrilateral. Equal, or adding to something?" },
      { id: "finish", when: "x = 30 has been found", warn: "The question wants angle BAD, not x." },
    ],
    coach: {
      keyWords: [
        { text: "points on a circle", why: "ABCD is a cyclic quadrilateral." },
        { text: "angle BAD", why: "The angle at A. Find x, then substitute." },
        { text: "You must show all your working", why: "No working, no marks." },
      ],
      clues: [
        "Angles BAD and BCD are opposite angles of a cyclic quadrilateral.",
        "Opposite angles in a cyclic quadrilateral add up to 180°. Write that as an equation.",
        "Solve for x, then put it into 3x + 10.",
      ],
      traps: ["Did you find the angle, not just x?", "Is it angle BAD, the one at A?"],
    },
  },
  {
    id: "ccb1-q21",
    source: { paper: SRC, q: "21" },
    topic: "quadgraph",
    tier: "H",
    calculator: false,
    prompt: "Sketch the graph of &nbsp;<span class=\"eq\">y = x<sup>2</sup> − 4x − 5</span><br>Show clearly the coordinates of the turning point and of any points where the graph crosses the axes.",
    promptText: "Sketch the graph of y = x² − 4x − 5. Show clearly the coordinates of the turning point and of any points where the graph crosses the axes.",
    marks: 4,
    answer: "U-shaped curve through (−1, 0), (5, 0) and (0, −5), turning point (2, −9)",
    solution: ["x² − 4x − 5 = (x − 5)(x + 1) → crosses x-axis at (−1, 0) and (5, 0)", "x = 0 → y = −5 → (0, −5)", "(x − 2)² − 9 → turning point (2, −9)", "Sketch a U-shaped curve through these points"],
    noWorking: "full",
    showWorking: "Label every point with its coordinates on the sketch. The marks come from the labels.",
    points: [
      { id: "B1a", code: "B1", criterion: "Crosses the x-axis at (−1, 0) and (5, 0), from (x − 5)(x + 1) = 0.", accept: ["−1 and 5 marked on the x-axis of the sketch"] },
      { id: "B1b", code: "B1", criterion: "Crosses the y-axis at (0, −5).", accept: ["−5 marked on the y-axis"] },
      { id: "M1", code: "M1", criterion: "Completes the square, (x − 2)² − 9, or uses symmetry to find x = 2.", accept: ["x = (−1 + 5)/2 = 2", "x = −b/2a = 2"] },
      { id: "A1", code: "A1", dep: ["M1"], criterion: "U-shaped curve with the turning point labelled (2, −9).", reject: ["(2, −5)", "an upside-down (∩) curve", "turning point found but not labelled on a curve"] },
    ],
    errors: [
      { id: "stopped-early", looksLike: "found x = 2 for the turning point and didn't work out y, or gave (2, −5)" },
      { id: "wrong-direction", looksLike: "drew the curve upside down" },
      { id: "wrong-form", looksLike: "didn't label the coordinates: a sketch earns its marks from the labelled points" },
    ],
    markerNotes: ["The student draws their own axes. Judge from the labelled points and the shape (U-shaped), not from accurate scale."],
    dangerZones: [
      { id: "tp", when: "x = 2 has been found for the turning point", warn: "A turning point has two coordinates. Put x = 2 into the equation." },
      { id: "label", when: "the curve is being drawn", warn: "Label every point where it crosses an axis, and the turning point, with coordinates." },
    ],
    coach: {
      keyWords: [
        { text: "Sketch", why: "Not a plotted graph: right shape, key points labelled." },
        { text: "turning point", why: "The bottom of the U. Complete the square or use symmetry." },
        { text: "crosses the axes", why: "Set y = 0 for the x-axis, x = 0 for the y-axis." },
      ],
      clues: [
        "Factorise x² − 4x − 5 to find where y = 0.",
        "Put x = 0 to find where it crosses the y-axis.",
        "The turning point is halfway between the roots. Find its x, then its y.",
      ],
      traps: ["Is the curve U-shaped (positive x²)?", "Have you labelled all four points with coordinates?"],
    },
  },
  {
    id: "ccb1-q22",
    source: { paper: SRC, q: "22" },
    topic: "algfrac",
    tier: "H",
    calculator: false,
    prompt: `Solve &nbsp;<span class="eq">${fr(6, "x − 2")} − ${fr(6, "x + 1")} = 1</span><br>You must show all your working.`,
    promptText: "Solve 6/(x − 2) − 6/(x + 1) = 1. You must show all your working.",
    marks: 5,
    answer: "x = 5 and x = −4",
    solution: ["6(x + 1) − 6(x − 2) = (x − 2)(x + 1)", "6x + 6 − 6x + 12 = x² − x − 2", "18 = x² − x − 2", "x² − x − 20 = 0", "(x − 5)(x + 4) = 0", "x = 5 or x = −4"],
    noWorking: "zero",
    showWorking: "This question says 'You must show all your working', so an answer on its own scores nothing.",
    points: [
      { id: "M1a", code: "M1", criterion: "Multiplies through by (x − 2)(x + 1): 6(x + 1) − 6(x − 2) = (x − 2)(x + 1)", accept: ["combining the fractions over (x − 2)(x + 1) correctly"] },
      { id: "M1b", code: "M1", ft: true, dep: ["M1a"], criterion: "Expands both sides: 18 = x² − x − 2" },
      { id: "A1a", code: "A1", dep: ["M1b"], criterion: "x² − x − 20 = 0" },
      { id: "M1c", code: "M1", ft: true, criterion: "Factorises: (x − 5)(x + 4) = 0 (or a correct method to solve their 3-term quadratic).", accept: ["correct use of the quadratic formula", "completing the square"] },
      { id: "A1b", code: "A1", dep: ["M1c"], criterion: "x = 5 and x = −4", reject: ["only one solution"] },
    ],
    errors: [
      { id: "sign-error", looksLike: "expanded −6(x − 2) as −6x − 12 instead of −6x + 12" },
      { id: "missed-term", looksLike: "forgot that the 1 on the right-hand side must also be multiplied by both brackets" },
      { id: "stopped-early", looksLike: "gave only one solution" },
    ],
    dangerZones: [
      { id: "minus", when: "the student is expanding −6(x − 2)", warn: "Minus times minus. Check the sign of the 12." },
      { id: "rhs", when: "the student is multiplying through by the denominators", warn: "Every term gets multiplied, including the 1 on the right." },
      { id: "both", when: "the quadratic has been factorised", warn: "A quadratic has two solutions." },
    ],
    coach: {
      keyWords: [
        { text: "Solve", why: "Find every value of x that works." },
        { text: "You must show all your working", why: "No working, no marks." },
      ],
      clues: [
        "Multiply every term by (x − 2)(x + 1) to clear the fractions.",
        "6(x + 1) − 6(x − 2) = (x − 2)(x + 1). Expand carefully: −6 × −2 is +12.",
        "Rearrange to a quadratic equal to zero and factorise.",
      ],
      traps: ["Did you give both solutions?", "Did the 1 on the right get multiplied by both brackets?"],
    },
  },
  {
    id: "ccb1-q23",
    source: { paper: SRC, q: "23" },
    topic: "tangent",
    tier: "H",
    calculator: false,
    prompt: "The circle C has equation &nbsp;<span class=\"eq\">x<sup>2</sup> + y<sup>2</sup> = 25</span><br>P is the point (3, 4) on the circle.<br>Find an equation of the tangent to C at the point P.<br>Give your answer in the form ax + by = c where a, b and c are integers.",
    promptText: "The circle C has equation x² + y² = 25. P is the point (3, 4) on the circle. Find an equation of the tangent to C at the point P. Give your answer in the form ax + by = c where a, b and c are integers.",
    marks: 4,
    answer: "3x + 4y = 25",
    solution: ["Gradient of OP = 4/3", "Gradient of tangent = −3/4", "y − 4 = −3/4 (x − 3)", "4y − 16 = −3x + 9", "3x + 4y = 25"],
    noWorking: "full",
    showWorking: "Write the radius gradient, then the tangent gradient, then the line through (3, 4). Three method marks.",
    points: [
      { id: "M1a", code: "M1", criterion: "Gradient of the radius OP = 4/3" },
      { id: "M1b", code: "M1", ft: true, criterion: "Gradient of the tangent = −3/4 (negative reciprocal of their radius gradient)." , reject: ["4/3 used as the tangent gradient"] },
      { id: "M1c", code: "M1", ft: true, criterion: "y − 4 = −3/4 (x − 3) oe (their tangent gradient through (3, 4)).", accept: ["4 = −3/4 × 3 + c"] },
      { id: "A1", code: "A1", dep: ["M1c"], criterion: "3x + 4y = 25", accept: ["any integer multiple, e.g. 6x + 8y = 50"], reject: ["y = −3/4x + 25/4 (not in the form asked)"] },
    ],
    errors: [
      { id: "perp-gradient", looksLike: "used the gradient of the radius as the gradient of the tangent" },
      { id: "wrong-form", looksLike: "left the answer as y = −3/4x + 25/4: the question asks for integers in the form ax + by = c" },
    ],
    dangerZones: [
      { id: "perp", when: "the gradient of OP has been found", warn: "The tangent is perpendicular to the radius." },
      { id: "form", when: "an equation y = mx + c with fractions has been reached", warn: "The question wants ax + by = c with whole numbers." },
    ],
    coach: {
      keyWords: [
        { text: "tangent", why: "A tangent meets the radius at 90°." },
        { text: "ax + by = c", why: "Clear the fractions and get x and y on the same side." },
        { text: "integers", why: "Whole numbers only. Multiply through to clear fractions." },
      ],
      clues: [
        "The centre is (0, 0). Find the gradient of the radius from (0, 0) to (3, 4).",
        "The tangent is perpendicular to the radius: its gradient is the negative reciprocal.",
        "Use y − 4 = m(x − 3), then multiply by 4 and rearrange.",
      ],
      traps: ["Is your gradient perpendicular to the radius?", "Are a, b and c whole numbers?"],
    },
  },
];
