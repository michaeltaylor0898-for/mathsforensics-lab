// Cold Case B · Higher Paper 1 (non-calculator) · questions 1 to 5 (CC-B/1H)
//
// Question wording is copied from the paper. The mark schemes are DRAFTS written from the paper
// (the paper's own mark scheme wasn't available), so each entry has draft: true until Mike has
// checked it against the Cold Case B mark scheme. Coaching (key words, clues, traps) is new.
import type { Scheme } from "../schemes.ts";

const fr = (n: string | number, d: string | number) => `<span class="fr"><span>${n}</span><span>${d}</span></span>`;
const SRC = "CC-B/1H";

export const COLD_CASE_B1: Scheme[] = [
  {
    id: "ccb1-q1",
    draft: true,
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
      { id: "M1a", code: "M1", criterion: "Both mixed numbers written as improper fractions: 9/4 and 8/5 (or equivalent, e.g. 2.25 and 1.6).", reject: ["only one converted correctly"] },
      {
        id: "M1b", code: "M1", ft: true, dep: ["M1a"],
        criterion: "Multiplies their improper fractions correctly: 72/20 or a correctly cancelled equivalent (18/5, 36/10).",
        accept: ["cancelling before multiplying, e.g. 9/1 × 2/5 = 18/5"],
        reject: ["multiplying the whole numbers and the fractions separately: 2 × 1 + 1/4 × 3/5"],
      },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "3 3/5 (three and three fifths).", reject: ["18/5 left as an improper fraction", "3 6/10 (not simplest form)", "3.6"] },
    ],
    errors: [
      { id: "wrong-operation", looksLike: "multiplied the whole numbers and the fractions separately: 2 × 1 = 2 and 1/4 × 3/5 = 3/20, giving 2 3/20" },
      { id: "wrong-form", looksLike: "left the answer as 18/5 or 3.6 instead of a mixed number" },
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
    draft: true,
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
        criterion: "A correct method: factor tree or repeated division with at least two correct steps, or the primes 2, 2, 3, 7 seen.",
        accept: ["2, 2, 3, 7 listed (even without ×)"],
      },
      {
        id: "A1", code: "A1", dep: ["M1"],
        criterion: "2² × 3 × 7 or 2 × 2 × 3 × 7, written as a product.",
        reject: ["2, 2, 3, 7 as a list with commas", "1 included as a factor", "2² + 3 + 7"],
      },
    ],
    errors: [
      { id: "wrong-form", looksLike: "listed the primes with commas instead of writing them as a product with ×" },
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
    draft: true,
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
        criterion: "A correct method: 126 = 2 × 3² × 7 (with 84 from part (a)), or a Venn diagram of the prime factors, or lists of factors of both numbers with at least one common factor greater than 7 identified.",
        accept: ["2 × 3 × 7 identified as the common primes"],
      },
      { id: "A1", code: "A1", dep: ["M1"], criterion: "42", reject: ["252 (the LCM)", "a common factor that is not the highest, e.g. 14, 21 or 6"] },
    ],
    errors: [
      { id: "hcf-lcm", looksLike: "gave the lowest common multiple, 252" },
      { id: "stopped-early", looksLike: "gave a common factor that isn't the highest, e.g. 14 or 21" },
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
    draft: true,
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
    draft: true,
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
      {
        id: "M1", code: "M1",
        criterion: "24 × 10⁸ seen, or 2 400 000 000, or an answer of the form 2.4 × 10ⁿ.",
        accept: ["2.4 × 10⁹ implies it"],
      },
      { id: "A1", code: "A1", criterion: "2.4 × 10⁹", reject: ["24 × 10⁸ (not standard form)", "2.4 × 10⁸", "24 × 10¹⁵"] },
    ],
    errors: [
      { id: "not-standard-form", looksLike: "left the answer as 24 × 10⁸" },
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
    draft: true,
    source: { paper: SRC, q: "4" },
    topic: "simlin",
    tier: "H",
    calculator: false,
    prompt: "Solve the simultaneous equations<br><span class=\"eq\">3x + 2y = 4</span><br><span class=\"eq\">5x − 3y = 13</span>",
    marks: 3,
    answer: "x = 2, y = −1",
    solution: ["9x + 6y = 12", "10x − 6y = 26", "19x = 38, so x = 2", "3(2) + 2y = 4, so 2y = −2", "y = −1"],
    noWorking: "full",
    showWorking: "Write the scaled equations and the add or subtract step. That earns the first M1 even if the arithmetic slips.",
    points: [
      {
        id: "M1a", code: "M1",
        criterion: "A correct method to eliminate one variable: coefficients of x or y made equal and the equations added or subtracted correctly (allow one arithmetic error), or a correct rearrangement and substitution.",
        accept: ["9x + 6y = 12 and 10x − 6y = 26 then added", "15x + 10y = 20 and 15x − 9y = 39 then subtracted"],
        reject: ["equations subtracted when they should be added (signs of y the same after scaling)"],
      },
      {
        id: "M1b", code: "M1", ft: true, dep: ["M1a"],
        criterion: "Substitutes their value of one variable into an equation to find the other.",
      },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "x = 2 and y = −1.", reject: ["y = 1", "only one value found"] },
    ],
    errors: [
      { id: "added-squares", looksLike: "added the equations when they needed subtracting, or the other way round" },
      { id: "sign-error", looksLike: "sign slip with −3y or −6y, often giving y = 1" },
      { id: "stopped-early", looksLike: "found x but not y" },
    ],
    dangerZones: [
      { id: "signs", when: "the equations have been scaled so one variable has matching coefficients", warn: "Check the signs before you combine: same signs subtract, different signs add." },
      { id: "both", when: "one variable has been found", warn: "Now find the other one, then check both values in the second equation." },
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
    draft: true,
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
    noWorking: "answer",
    showWorking: "Write each angle you find with its reason on the same line.",
    points: [
      { id: "B1a", code: "B1", criterion: "Angle ACB = 68° (or angle ABC = 68°), seen in working or on the diagram." },
      { id: "B1b", code: "B1", criterion: "Angle BAC = 44°", accept: ["180 − 2 × 68 = 44"] },
      {
        id: "C1", code: "C1", dep: ["B1a"],
        criterion: "All three reasons given, in words, each linked to a stage: angles on a straight line add up to 180°; base angles of an isosceles triangle are equal; angles in a triangle add up to 180°.",
        accept: ["'angles on a line sum to 180'", "'isosceles triangle, so ABC = ACB'"],
        reject: ["missing any one reason", "'Z angles', 'F angles' or other informal names", "reasons written without saying which angle they explain, when it isn't clear"],
      },
    ],
    errors: [
      { id: "wrong-share", looksLike: "found angle ACB or ABC (68°) and gave that as the answer, instead of angle BAC" },
      { id: "wrong-operation", looksLike: "assumed angle BAC equals one of the base angles, or used 112 inside the triangle" },
    ],
    markerNotes: ["Reasons must use standard wording closely enough to be clear. Accept 'sum' for 'add up to'."],
    dangerZones: [
      { id: "reasons", when: "the first angle (68°) has been found", warn: "Write the reason next to each angle as you go: a mark depends on them." },
      { id: "which", when: "the base angles are known and the student is about to find the last angle", warn: "The question asks for angle BAC, the angle at A." },
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
      traps: ["Is your answer the angle at A, not one of the 68° angles?", "Have you written three reasons, in words, one for each step?"],
    },
  },
];
