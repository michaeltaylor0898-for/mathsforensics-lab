// Mark schemes for AI-marked written questions.
//
// These live on the server only. The page asks the function for the public part of each question
// (prompt, marks, topic) and never sees the mark scheme, so students can't read it from the page source.
//
// HOW TO WRITE A SCHEME
// Each mark point is one line of an exam-board scheme:
//   id        unique within the question, e.g. "M1", "M2", "A1", "B1" (use "M1a"/"M1b" if you need two M1s)
//   code      what the student sees: "M1", "A1", "B1"
//   criterion what earns the mark, written the way you'd brief a marker
//   accept    equivalent forms / alternative methods that also earn it
//   reject    things that look close but do NOT earn it
//   ft        true if the mark can be earned with the student's own earlier wrong value ("follow through")
//   dep       ids of marks that must also be awarded for this one to count (e.g. A1 dep M1).
//             The function enforces this itself after the AI has marked, so the AI can't break it.
//   implied   optional: what later working implies this mark even if the line isn't written
//
// noWorking: what a bare correct answer with no working gets.
//   "full"    = all marks (most "work out" questions)
//   "answer"  = only the final A/B marks (rare)
//   "zero"    = nothing (questions that say "show that", "by completing the square", "you must show your working")
//
// errors: error library ids (same ids as ERR in site/index.html) and what each one looks like here,
// so the root cause feeds straight into the Lab's existing error tracking.

import { COLD_CASE_B1 } from "./bank/cold-case-b-paper1.ts";

export type MarkPoint = {
  id: string;
  code: "M1" | "A1" | "B1" | "P1" | "C1";
  criterion: string;
  accept?: string[];
  reject?: string[];
  ft?: boolean;
  dep?: string[];
  implied?: string;
};

export type Scheme = {
  id: string;
  topic: string;          // Lab topic id (TOP in site/index.html)
  tier: "F" | "H";
  calculator: boolean;
  prompt: string;         // shown to the student; simple HTML allowed
  promptText?: string;    // plain-text version for the marker, when the prompt uses layout (stacked fractions)
  diagram?: string;       // inline SVG shown under the prompt (the marker gets promptText instead)
  draft?: boolean;        // true until Mike has checked the mark scheme against the paper's own
  marks: number;
  answer: string;         // final answer, for the marker
  solution: string[];     // model solution, line by line
  noWorking: "full" | "answer" | "zero";
  points: MarkPoint[];
  errors?: { id: string; looksLike: string }[];
  markerNotes?: string[];
  showWorking?: string;   // how to protect the marks, shown when a correct answer has no working
  source?: { paper: string; q: string; part?: string };   // e.g. { paper: "CC-B/1H", q: "2", part: "a" }
  coach?: Coaching;
  // Mike mode danger zones: the points in the method where students typically lose marks. Mike goes
  // amber when the working reaches one, once per zone, with the warning written here (in Mike's words).
  //   when  what the working looks like at that point, for the checker to recognise
  //   warn  what Mike says (one short sentence, never the answer)
  dangerZones?: { id: string; when: string; warn: string }[];
};

// The on-screen coaching for one question (coached-paper mode). Written once per question, so it
// costs nothing to run and never varies.
//   keyWords  phrases in the prompt the student should spot before starting. Each `text` must appear
//             in the prompt exactly as written (the page finds and marks it); `why` is shown on reveal.
//   clues     three clues, one at a time: 1 names the method, 2 gives the first line, 3 the key step.
//             Never the final answer.
//   traps     checks shown just before the student hands the answer in.
export type Coaching = {

  keyWords: { text: string; why: string }[];
  clues: [string, string, string];
  traps: string[];
};

export const SCHEMES: Scheme[] = [
  {
    id: "csq-01",
    topic: "csq",
    tier: "H",
    calculator: false,
    prompt: "By completing the square, solve &nbsp;<b>x² + 8x − 4 = 0</b><br>Give your answers in surd form.",
    marks: 5,
    answer: "x = −4 ± 2√5",
    solution: ["(x + 4)² − 16 − 4 = 0", "(x + 4)² = 20", "x + 4 = ±√20", "x = −4 ± √20", "x = −4 ± 2√5"],
    noWorking: "zero",
    dangerZones: [
      { id: "bracket", when: "the student is writing the bracket for completing the square", warn: "Half of +8, and keep the sign." },
      { id: "plusminus", when: "the squared bracket has been isolated and the student is about to square root", warn: "Square root both sides, and don't lose the ±." },
      { id: "surd", when: "the student has an answer containing √20", warn: "Surd form means simplified: is √20 as simple as it gets?" },
    ],
    points: [
      { id: "B1", code: "B1", criterion: "Correct bracket (x + 4)² written.", reject: ["(x − 4)²", "(x + 8)²"] },
      {
        id: "M1a", code: "M1", ft: true,
        criterion: "Completes the square fully: (x + a)² − a² − 4 = 0, or (x + a)² = a² + 4, using their bracket (x + a)².",
        accept: ["(x + 4)² − 20 = 0", "(x + 4)² = 20", "with their a: (x − 4)² − 16 − 4 = 0 earns this mark on follow-through"],
        reject: ["(x + 4)² − 4 = 0 (the a² term is missing)", "(x + 4)² + 16 − 4 (sign of a² wrong)"],
      },
      {
        id: "M1b", code: "M1", ft: true,
        criterion: "Square roots both sides with ±: x + a = ±√k for their a and k, or goes straight to x = −a ± √k.",
        accept: ["± first appears on the next line (x = 4 ± √20 implies it)"],
        reject: ["only the positive root, with no ± anywhere in the working or answer"],
        implied: "x = −a ± √k on a later line",
      },
      { id: "A1a", code: "A1", dep: ["M1b"], criterion: "x = −4 ± √20 (or both values listed separately).", reject: ["x = 4 ± √20", "decimals only"] },
      { id: "A1b", code: "A1", dep: ["A1a"], criterion: "Surd simplified: x = −4 ± 2√5 (or −4 + 2√5 and −4 − 2√5).", reject: ["−4 ± √20 left unsimplified", "decimal answers"] },
    ],
    errors: [
      { id: "csq-half", looksLike: "halved 8 but wrote (x − 4)² instead of (x + 4)², or used 8 instead of 4" },
      { id: "sign-error", looksLike: "sign slip moving −a² or the constant across, or −a written as +a at the end" },
      { id: "no-sqrt", looksLike: "only the positive square root" },
      { id: "not-simplified", looksLike: "left √20 instead of 2√5" },
    ],
    markerNotes: [
      "Worked example used to test the system: a student who writes (x − 4)² − 16 − 4, then (x − 4)² − 20 = 0, x − 4 = √20, x = 4 ± √20, x = 4 ± 2√5 scores B0 M1 M1 A0 A0 = 2/5. One root cause (bracket sign) costs three marks.",
    ],
  },
  {
    id: "qform-01",
    topic: "qform",
    tier: "H",
    calculator: true,
    prompt: "Solve &nbsp;<b>3x² − 5x − 4 = 0</b><br>Give your answers correct to 2 decimal places.",
    marks: 3,
    answer: "x = 2.26, x = −0.59",
    solution: ["x = (5 ± √(25 + 48)) / 6", "x = (5 ± √73) / 6", "x = 2.26 or x = −0.59"],
    noWorking: "answer",
    points: [
      {
        id: "M1a", code: "M1",
        criterion: "Correct substitution into the quadratic formula: (5 ± √((−5)² − 4×3×(−4))) / (2×3), or equivalent.",
        accept: ["completing the square correctly to (x − 5/6)² = 73/36"],
        reject: ["denominator 2 or 3 instead of 6", "√(25 − 48)"],
      },
      { id: "M1b", code: "M1", dep: ["M1a"], criterion: "Discriminant evaluated correctly: √73 (or (5 ± √73)/6).", implied: "both correct answers" },
      { id: "A1", code: "A1", dep: ["M1a"], criterion: "Both answers: 2.26 and −0.59.", reject: ["only one root", "2.257 and −0.591 (wrong accuracy) — no A1"] },
    ],
    errors: [
      { id: "qformula-division", looksLike: "divided only the square root by 2a, or used a instead of 2a" },
      { id: "sign-error", looksLike: "−b taken as −5, or −4ac taken as −48" },
      { id: "rounding", looksLike: "wrong number of decimal places" },
    ],
  },
  {
    id: "simquad-01",
    topic: "simquad",
    tier: "H",
    calculator: false,
    prompt: "Solve the simultaneous equations<br><b>y = x + 1</b><br><b>x² + y² = 13</b>",
    marks: 4,
    answer: "x = 2, y = 3 and x = −3, y = −2",
    solution: ["x² + (x + 1)² = 13", "2x² + 2x − 12 = 0", "x² + x − 6 = 0", "(x + 3)(x − 2) = 0", "x = 2, y = 3 or x = −3, y = −2"],
    noWorking: "answer",
    points: [
      { id: "M1a", code: "M1", criterion: "Substitutes the linear equation into the quadratic: x² + (x + 1)² = 13, or (y − 1)² + y² = 13.", reject: ["x² + x + 1² = 13 (bracket not squared)"] },
      {
        id: "M1b", code: "M1", ft: true, dep: ["M1a"],
        criterion: "Expands and rearranges to a three-term quadratic = 0, and attempts to solve it (factorising, formula or completing the square).",
        accept: ["2x² + 2x − 12 = 0", "x² + x − 6 = 0", "y² − y − 6 = 0"],
      },
      { id: "A1a", code: "A1", dep: ["M1b"], criterion: "Both x values: x = 2 and x = −3 (or both y values: 3 and −2)." },
      { id: "A1b", code: "A1", dep: ["A1a"], criterion: "Both pairs correctly matched: (2, 3) and (−3, −2).", reject: ["values not paired, or paired wrongly"] },
    ],
    errors: [
      { id: "missed-square", looksLike: "(x + 1)² expanded as x² + 1" },
      { id: "sign-error", looksLike: "sign slip when rearranging" },
      { id: "stopped-early", looksLike: "found x values but not y values" },
    ],
  },
  {
    id: "rev-01",
    topic: "rev",
    tier: "F",
    calculator: true,
    prompt: "In a sale, all prices are reduced by 15%.<br>A coat costs <b>£68</b> in the sale.<br>Work out the price of the coat before the sale.",
    marks: 3,
    answer: "£80",
    solution: ["100% − 15% = 85%", "£68 ÷ 0.85", "= £80"],
    noWorking: "full",
    points: [
      { id: "M1a", code: "M1", criterion: "Recognises the sale price is 85% of the original: 0.85 or 85% or 68 = 85%.", reject: ["15% of 68 (= 10.20)"] },
      { id: "M1b", code: "M1", dep: ["M1a"], criterion: "68 ÷ 0.85, or 68 ÷ 85 × 100, or finds 1% = 0.8.", accept: ["68 ÷ 85 = 0.8 then × 100"] },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "£80", reject: ["£78.20 (68 + 15% of 68)", "£57.80"] },
    ],
    errors: [
      { id: "reverse-pct", looksLike: "found 15% of £68 and added it on (£78.20)" },
      { id: "wrong-direction", looksLike: "took 15% off again (£57.80)" },
    ],
  },
  {
    id: "algfrac-01",
    topic: "algfrac",
    tier: "H",
    calculator: false,
    prompt: "Simplify fully &nbsp;<b>(x² − 9) / (x² + x − 6)</b>",
    marks: 3,
    answer: "(x − 3) / (x − 2)",
    solution: ["x² − 9 = (x + 3)(x − 3)", "x² + x − 6 = (x + 3)(x − 2)", "= (x − 3) / (x − 2)"],
    noWorking: "full",
    points: [
      { id: "B1a", code: "B1", criterion: "Numerator factorised: (x + 3)(x − 3)." },
      { id: "B1b", code: "B1", criterion: "Denominator factorised: (x + 3)(x − 2)." },
      { id: "B1c", code: "B1", criterion: "Final answer (x − 3)/(x − 2).", reject: ["cancelling x² terms, e.g. −9 / (x − 6)", "(x − 3)/(x − 2) followed by further wrong 'cancelling' to −3/−2"] },
    ],
    errors: [
      { id: "wrong-operation", looksLike: "cancelled individual terms (x²) instead of whole factors" },
      { id: "sign-error", looksLike: "factorised as (x − 3)(x + 2)" },
    ],
  },
  {
    id: "recur-01",
    topic: "recur",
    tier: "H",
    calculator: false,
    prompt: "Prove algebraically that &nbsp;<b>0.4̇5̇ = 5/11</b>",
    marks: 3,
    answer: "Proof",
    solution: ["x = 0.454545…", "100x = 45.454545…", "100x − x = 45, so 99x = 45", "x = 45/99 = 5/11"],
    noWorking: "zero",
    points: [
      { id: "M1a", code: "M1", criterion: "Defines x = 0.4545… and writes 100x = 45.4545… (or two recurring decimals with the same recurring part, e.g. 10000x = 4545.4545…).", reject: ["10x = 4.545… used with x, since the recurring parts don't line up"] },
      { id: "M1b", code: "M1", dep: ["M1a"], criterion: "Subtracts to get 99x = 45 (or equivalent).", implied: "x = 45/99" },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "Shows 45/99 simplifies to 5/11 and reaches the given answer.", reject: ["just writes 5/11 without 45/99 or a shown simplification"] },
    ],
    errors: [
      { id: "recurring-subtract", looksLike: "multiplied by 10 instead of 100, so the decimals don't cancel" },
      { id: "not-simplified", looksLike: "stops at 45/99 without showing it equals 5/11" },
    ],
  },
];

SCHEMES.push(...COLD_CASE_B1);

export const byId = (id: string) => SCHEMES.find((s) => s.id === id);

// What the page is allowed to see.
export const publicQuestion = (s: Scheme) => ({
  id: s.id, topic: s.topic, tier: s.tier, calculator: s.calculator, prompt: s.prompt, marks: s.marks,
  source: s.source ?? null, coach: s.coach ?? null, diagram: s.diagram ?? null, draft: !!s.draft,
});
