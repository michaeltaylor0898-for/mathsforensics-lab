// Cold Case: Most Wanted · Grade 8–9 Paper 2 (calculator) · all 14 questions, 70 marks (CC-MW/2)
//
// Question wording is copied from the paper. Mark points follow Mike's Most Wanted Paper 2 Forensic
// Mark Scheme line for line; errors and Mike-mode danger zones come from its "Where the marks go
// missing" boxes.
import type { Scheme } from "../schemes.ts";

const fr = (n: string | number, d: string | number) => `<span class="fr"><span>${n}</span><span>${d}</span></span>`;
const SRC = "CC-MW/2";
const TXT = `font-family="Times New Roman,serif" fill="currentColor"`;
const NDA = (x: number, y: number) => `<text x="${x}" y="${y}" font-size="9" text-anchor="middle" fill="currentColor" opacity=".7" font-family="Arial,sans-serif">Not drawn accurately</text>`;

// ---------- diagrams ----------
const histDist = (() => {
  const X = (d: number) => 50 + d * 5.6, Y = (f: number) => 215 - f * 45;
  const minor: string[] = [], major: string[] = [], lab: string[] = [];
  for (let d = 0; d <= 50; d++) (d % 5 ? minor : major).push(`M${X(d)} ${Y(0)}V${Y(4.5)}`);
  for (let k = 0; k <= 45; k++) (k % 5 ? minor : major).push(`M${X(0)} ${Y(k / 10)}H${X(50)}`);
  for (let d = 0; d <= 50; d += 5) lab.push(`<text x="${X(d)}" y="${Y(0) + 15}" text-anchor="middle">${d}</text>`);
  for (let k = 0; k <= 9; k++) lab.push(`<text x="44" y="${Y(k / 2) + 4}" text-anchor="end">${k === 0 ? "0" : (k / 2).toFixed(1)}</text>`);
  const bars = [[0, 10, 1.2], [10, 15, 3.6], [15, 20, 4.4], [20, 30, 2.0], [30, 50, 0.4]].map(([a, b, f]) => `<rect x="${X(a)}" y="${Y(f)}" width="${X(b) - X(a)}" height="${Y(0) - Y(f)}"/>`).join("");
  return `<svg viewBox="0 0 350 255" role="img" aria-label="Histogram of distances travelled to work. Bars: 0 to 10 km, frequency density 1.2; 10 to 15, 3.6; 15 to 20, 4.4; 20 to 30, 2.0; 30 to 50, 0.4."><path d="${minor.join("")}" stroke="currentColor" stroke-width=".35" opacity=".3" fill="none"/><path d="${major.join("")}" stroke="currentColor" stroke-width=".7" opacity=".55" fill="none"/><g fill="currentColor" fill-opacity=".15" stroke="currentColor" stroke-width="1.4">${bars}</g><g font-size="11" ${TXT}>${lab.join("")}<text x="190" y="250" text-anchor="middle">Distance (<tspan font-style="italic">d</tspan> km)</text><text transform="translate(14 115) rotate(-90)" text-anchor="middle">Frequency density</text></g></svg>`;
})();

const cuboidM = `<svg viewBox="0 0 300 190" role="img" aria-label="Cuboid ABCDEFGH with AB = 9 cm along the front, BC = 6 cm going back and CG = 5 cm going up. M is the midpoint of HG on the back top edge. A line is drawn from A to M."><g fill="none" stroke="currentColor" stroke-width="1.5"><path d="M40 150 H190 V70 H40 Z M190 150 L250 100 V20 H100 L40 70 M190 70 L250 20"/><path d="M40 150 L100 100 H250 M100 100 V20" stroke-dasharray="4 3" stroke-width="1"/><path d="M40 150 L175 20" stroke-width="1.3"/></g><circle cx="175" cy="20" r="2.5" fill="currentColor"/><g ${TXT} font-size="12" font-style="italic"><text x="30" y="164">A</text><text x="192" y="164">B</text><text x="254" y="104">C</text><text x="86" y="98">D</text><text x="28" y="68">E</text><text x="194" y="84">F</text><text x="254" y="18">G</text><text x="92" y="16">H</text><text x="171" y="13">M</text></g><g ${TXT} font-size="12"><text x="115" y="166" text-anchor="middle">9 cm</text><text x="226" y="136">6 cm</text><text x="256" y="62">5 cm</text></g>${NDA(150, 184)}</svg>`;

const chordSeg = `<svg viewBox="0 0 260 175" role="img" aria-label="A circle with centre O and radius 10 cm. Chord AB is 12 cm long, below O. The segment between the chord and the lower arc is shaded."><path d="M88 136 A70 70 0 0 0 172 136 Z" fill="currentColor" opacity=".18"/><circle cx="130" cy="80" r="70" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M88 136 L130 80 L172 136 Z" fill="none" stroke="currentColor" stroke-width="1.4"/><g ${TXT} font-size="12"><text x="126" y="72" font-style="italic">O</text><text x="76" y="142" font-style="italic">A</text><text x="176" y="142" font-style="italic">B</text><text x="156" y="104">10 cm</text><text x="130" y="131" text-anchor="middle">12 cm</text></g>${NDA(130, 168)}</svg>`;

const shipRoute = `<svg viewBox="0 0 270 225" role="img" aria-label="A ship sails 14 km from A to B on a bearing of 065 degrees, then 9 km from B to C on a bearing of 150 degrees. North lines are drawn at A and B. C is below and to the right of B."><g fill="none" stroke="currentColor" stroke-width="1.5"><path d="M60 170 V110 M174.2 116.8 V56.8 M60 170 L174.2 116.8 L214.7 186.9"/><path d="M55 118 L60 108 L65 118 M169.2 64.8 L174.2 54.8 L179.2 64.8"/><path d="M60 145 A25 25 0 0 1 82.7 159.4" stroke-width="1.1"/><path d="M174.2 96.8 A20 20 0 0 1 184.2 134.1" stroke-width="1.1"/><path d="M60 170 L214.7 186.9" stroke-dasharray="4 3" stroke-width="1"/></g><g ${TXT} font-size="12"><text x="55" y="104">N</text><text x="169" y="50">N</text><text x="46" y="184" font-style="italic">A</text><text x="160" y="114" font-style="italic">B</text><text x="218" y="200" font-style="italic">C</text><text x="72" y="140">65°</text><text x="190" y="104">150°</text><text x="122" y="160">14 km</text><text x="202" y="154">9 km</text></g>${NDA(135, 220)}</svg>`;

const PROP = "y is directly proportional to the square of x. x is inversely proportional to the square root of z. When z = 4, x = 6 and y = 18.";
const POWER = "The power, P watts, used by a heater is given by P = V²/R, where V = 11.3 and R = 7.6, each correct to 1 decimal place.";
const BACT = "The number of bacteria, N, t hours after the start of an experiment is modelled by N = ab^t, where a and b are positive constants. When t = 2, N = 1800. When t = 5, N = 6075.";
const DIST = "Histogram of distances to work: 0 < d ≤ 10 frequency density 1.2; 10–15, 3.6; 15–20, 4.4; 20–30, 2.0; 30–50, 0.4.";
const BAG = "There are 5 red counters, 4 blue counters and 3 green counters in a bag. Two counters are taken at random, without replacement.";
const PRIYA = "Priya drives 120 km from home to a meeting at an average speed of x km/h. She drives home along the same route at an average speed of (x + 20) km/h. The total driving time for the two journeys is 5 hours.";
const SHIP = "A ship sails 14 km from port A to buoy B on a bearing of 065°, then 9 km from B to lighthouse C on a bearing of 150°.";

export const MOST_WANTED_2: Scheme[] = [
  {
    id: "mw2-q1a", source: { paper: SRC, q: "1", part: "a" }, topic: "dirprop", tier: "H", calculator: true,
    prompt: "y is directly proportional to the square of x.<br>x is inversely proportional to the square root of z.<br>When z = 4, x = 6 and y = 18<br>Find a formula for y in terms of z. Give your answer in its simplest form.",
    marks: 3, answer: "y = 72/z", solution: ["y = kx² and x = c/√z", "k = 18 ÷ 6² = 0.5 and c = 6 × √4 = 12", "y = 0.5 × (12/√z)² = 0.5 × 144/z = 72/z"], noWorking: "full",
    showWorking: "Write both proportion formulas first.",
    points: [
      { id: "M1a", code: "M1", criterion: "y = kx² and x = c/√z", reject: ["y = kx or x = c/z"] },
      { id: "M1b", code: "M1", dep: ["M1a"], criterion: "k = 18 ÷ 6² = 0.5 and c = 6 × √4 = 12" },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "y = 0.5 × 144/z = 72/z", reject: ["y = 0.5(12/√z)² left unsimplified"] },
    ],
    errors: [
      { id: "missed-square", looksLike: "missed 'square' and 'square root', so the formulas became y = kx and x = c/z" },
      { id: "direct-inverse", looksLike: "treated both relationships as direct proportion" },
      { id: "not-simplified", looksLike: "left the answer as y = 0.5(12/√z)²" },
    ],
    dangerZones: [{ id: "forms", when: "the student is writing the proportion formulas", warn: "Check each one: square? square root? inverse?" }],
    coach: {
      keyWords: [{ text: "square of x", why: "y = kx²." }, { text: "inversely proportional to the square root of z", why: "x = c/√z." }, { text: "simplest form", why: "Simplify fully at the end." }],
      clues: ["Write y = kx² and x = c/√z.", "Find k and c using the given values.", "Substitute the x formula into the y formula and simplify."],
      traps: ["Is your formula in its simplest form?"],
    },
  },
  {
    id: "mw2-q1b", source: { paper: SRC, q: "1", part: "b" }, topic: "dirprop", tier: "H", calculator: true,
    prompt: "Work out the value of z when y = 5", promptText: `${PROP} The formula is y = 72/z. Work out the value of z when y = 5.`,
    marks: 1, answer: "z = 14.4", solution: ["5 = 72/z", "z = 72 ÷ 5"], noWorking: "full",
    points: [{ id: "B1", code: "B1", ft: true, criterion: "z = 72 ÷ 5 = 14.4 (ft their formula)." }],
    errors: [{ id: "rearrange", looksLike: "multiplied instead of dividing" }],
    dangerZones: [{ id: "rearr", when: "the student is rearranging", warn: "z is on the bottom: multiply both sides by z first." }],
    coach: {
      keyWords: [{ text: "y = 5", why: "Substitute and rearrange for z." }],
      clues: ["Put y = 5 into your formula.", "Multiply both sides by z.", "Divide."],
      traps: ["Put z back in: does it give 5?"],
    },
  },
  {
    id: "mw2-q2", source: { paper: SRC, q: "2" }, topic: "rearr", tier: "H", calculator: true,
    prompt: `Make x the subject of the formula &nbsp;<span class="eq">y = √(${fr("3x + 1", "x − 2")})</span>`,
    promptText: "Make x the subject of the formula y = √((3x + 1)/(x − 2)).",
    marks: 4, answer: "x = (2y² + 1)/(y² − 3)", solution: ["y² = (3x + 1)/(x − 2)", "y²(x − 2) = 3x + 1", "xy² − 3x = 2y² + 1", "x(y² − 3) = 2y² + 1", "x = (2y² + 1)/(y² − 3)"], noWorking: "full",
    showWorking: "Write each line: square, multiply up, collect, factorise.",
    points: [
      { id: "M1a", code: "M1", criterion: "Squares both sides: y² = (3x + 1)/(x − 2)" },
      { id: "M1b", code: "M1", ft: true, dep: ["M1a"], criterion: "y²(x − 2) = 3x + 1" },
      { id: "M1c", code: "M1", ft: true, dep: ["M1b"], criterion: "Collects the x terms and factorises: xy² − 3x = 2y² + 1, so x(y² − 3) = 2y² + 1" },
      { id: "A1", code: "A1", dep: ["M1c"], criterion: "x = (2y² + 1)/(y² − 3)", reject: ["x on both sides"] },
    ],
    errors: [
      { id: "order-error", looksLike: "square-rooted the top and bottom separately as a first step" },
      { id: "stopped-early", looksLike: "left x on both sides of the final answer" },
      { id: "sign-error", looksLike: "lost the sign when −2y² crossed the equals sign" },
    ],
    dangerZones: [{ id: "collect", when: "x appears on both sides", warn: "Collect the x terms on one side and factorise." }],
    coach: {
      keyWords: [{ text: "Make x the subject", why: "Clear the root, clear the fraction, collect, factorise, divide." }],
      clues: ["Square both sides.", "Multiply both sides by (x − 2) and expand.", "Get the x terms together, factorise x out, divide."],
      traps: ["Is there an x on the right-hand side?"],
    },
  },
  {
    id: "mw2-q3", source: { paper: SRC, q: "3" }, topic: "similar", tier: "H", calculator: true,
    prompt: "Statue A and statue B are mathematically similar solids made from the same metal.<br>The surface area of statue A is 180 cm<sup>2</sup><br>The surface area of statue B is 405 cm<sup>2</sup><br>The mass of statue A is 320 g.<br>Work out the mass of statue B.",
    marks: 4, answer: "1080 g", solution: ["Area scale factor = 405 ÷ 180 = 2.25", "Length scale factor = √2.25 = 1.5", "Volume scale factor = 1.5³ = 3.375", "320 × 3.375"], noWorking: "full",
    points: [
      { id: "M1a", code: "M1", criterion: "Area scale factor = 405 ÷ 180 = 2.25" },
      { id: "M1b", code: "M1", dep: ["M1a"], criterion: "Length scale factor = √2.25 = 1.5" },
      { id: "M1c", code: "M1", dep: ["M1b"], criterion: "Volume scale factor = 1.5³ = 3.375" },
      { id: "A1", code: "A1", dep: ["M1c"], criterion: "320 × 3.375 = 1080", reject: ["720 (area factor)"] },
    ],
    errors: [
      { id: "wrong-formula", looksLike: "multiplied the mass by the area scale factor, giving 720 g" },
      { id: "index-law", looksLike: "cubed 2.25, the area scale factor" },
    ],
    dangerZones: [{ id: "via", when: "the area scale factor has been found", warn: "Mass follows volume. Go through the length scale factor." }],
    coach: {
      keyWords: [{ text: "same metal", why: "Mass is proportional to volume." }, { text: "surface area", why: "Gives the area scale factor." }],
      clues: ["Find the area scale factor.", "Square root it for the length scale factor.", "Cube that for the volume (and mass) scale factor."],
      traps: ["Did you square root before cubing?"],
    },
  },
  {
    id: "mw2-q4", source: { paper: SRC, q: "4" }, topic: "sdp", tier: "H", calculator: true,
    prompt: "Liquid A has a density of 1.2 g/cm<sup>3</sup><br>Liquid B has a density of 0.9 g/cm<sup>3</sup><br>Liquid A and liquid B are mixed in the ratio 3 : 2 <b>by mass</b> to make liquid C.<br>Work out the density of liquid C. Give your answer correct to 2 decimal places.",
    marks: 4, answer: "1.06 g/cm³", solution: ["Take 3 g of A and 2 g of B", "Volumes: 3 ÷ 1.2 = 2.5 and 2 ÷ 0.9 = 2.222…", "5 ÷ 4.722… = 1.0588…"], noWorking: "full",
    showWorking: "Pick masses in the ratio and write each volume.",
    points: [
      { id: "M1a", code: "M1", criterion: "Chooses masses in the ratio 3 : 2, e.g. 3 g of A and 2 g of B." },
      { id: "M1b", code: "M1", dep: ["M1a"], criterion: "Volumes: 3 ÷ 1.2 = 2.5 and 2 ÷ 0.9 = 2.222…" },
      { id: "M1c", code: "M1", dep: ["M1b"], criterion: "Total mass ÷ total volume: 5 ÷ 4.722…" },
      { id: "A1", code: "A1", dep: ["M1c"], criterion: "1.06 (from 1.0588…)", reject: ["1.08 (ratio treated as by volume)"] },
    ],
    errors: [
      { id: "wrong-average", looksLike: "worked out (3 × 1.2 + 2 × 0.9) ÷ 5 = 1.08, which would be right only if the ratio were by volume" },
      { id: "rounding", looksLike: "rounded 2.222… to 2.2 before dividing" },
    ],
    dangerZones: [{ id: "mass", when: "the student starts combining densities", warn: "The ratio is by mass. Find the volumes first." }],
    coach: {
      keyWords: [{ text: "by mass", why: "Choose masses, then work out volumes." }, { text: "2 decimal places", why: "Keep full values until the end." }],
      clues: ["Take 3 g of A and 2 g of B.", "Volume = mass ÷ density for each.", "Density of C = total mass ÷ total volume."],
      traps: ["Did you find the volumes, not average the densities?"],
    },
  },
  {
    id: "mw2-q5a", source: { paper: SRC, q: "5", part: "a" }, topic: "bounds", tier: "H", calculator: true,
    prompt: `The power, P watts, used by a heater is given by the formula &nbsp;<span class="eq">P = ${fr("V<sup>2</sup>", "R")}</span><br>V = 11.3 correct to 1 decimal place<br>R = 7.6 correct to 1 decimal place<br>Work out the upper bound for the value of P. Give your answer correct to 4 decimal places.`,
    promptText: `${POWER} Work out the upper bound for P, correct to 4 decimal places.`,
    marks: 2, answer: "17.0626", solution: ["Upper V, lower R", "11.35² ÷ 7.55 = 17.0626"], noWorking: "full",
    points: [
      { id: "M1", code: "M1", criterion: "11.35² / 7.55", reject: ["11.35² / 7.65", "bounds of ± 0.1"] },
      { id: "A1", code: "A1", dep: ["M1"], criterion: "17.0626" },
    ],
    errors: [
      { id: "bounds-division", looksLike: "used the upper bound of both values: the biggest answer needs the biggest top and the smallest bottom" },
      { id: "bounds-half", looksLike: "used bounds of ± 0.1" },
    ],
    dangerZones: [{ id: "which", when: "the student is choosing bounds", warn: "Biggest answer: biggest top, smallest bottom." }],
    coach: {
      keyWords: [{ text: "upper bound for the value of P", why: "Biggest V, smallest R." }],
      clues: ["Each value could be 0.05 either way.", "Use the upper bound of V and the lower bound of R.", "Square, then divide."],
      traps: ["Did you use the lower bound of R?"],
    },
  },
  {
    id: "mw2-q5b", source: { paper: SRC, q: "5", part: "b" }, topic: "bounds", tier: "H", calculator: true,
    prompt: "Work out the lower bound for the value of P. Give your answer correct to 4 decimal places.", promptText: `${POWER} Work out the lower bound for P, correct to 4 decimal places.`,
    marks: 2, answer: "16.5441", solution: ["Lower V, upper R", "11.25² ÷ 7.65 = 16.5441"], noWorking: "full",
    points: [
      { id: "M1", code: "M1", criterion: "11.25² / 7.65" },
      { id: "A1", code: "A1", dep: ["M1"], criterion: "16.5441" },
    ],
    errors: [{ id: "bounds-division", looksLike: "used the lower bound of both values" }],
    dangerZones: [{ id: "which", when: "the student is choosing bounds", warn: "Smallest answer: smallest top, biggest bottom." }],
    coach: {
      keyWords: [{ text: "lower bound for the value of P", why: "Smallest V, biggest R." }],
      clues: ["Use the lower bound of V.", "Use the upper bound of R.", "Square, then divide."],
      traps: ["Did you use the upper bound of R?"],
    },
  },
  {
    id: "mw2-q5c", source: { paper: SRC, q: "5", part: "c" }, topic: "bounds", tier: "H", calculator: true,
    prompt: "Use your answers to parts (a) and (b) to write down the value of P to a suitable degree of accuracy. Give a reason for your answer.",
    promptText: `${POWER} Upper bound 17.0626, lower bound 16.5441. Write down P to a suitable degree of accuracy, with a reason.`,
    marks: 1, answer: "P = 17", solution: ["Both bounds round to 17 to 2 significant figures", "To 3 s.f. they give 17.1 and 16.5, which disagree"], noWorking: "full",
    points: [{ id: "B1", code: "B1", criterion: "P = 17, with the reason that both bounds agree when rounded to 2 significant figures.", reject: ["17.0", "16.8 (midpoint)", "no reason"] }],
    errors: [{ id: "rounding", looksLike: "gave 17.0 or the midpoint 16.8: the bounds don't agree to 3 significant figures; no reason scores 0" }],
    dangerZones: [{ id: "agree", when: "the student is rounding the bounds", warn: "Round both the same way until they agree." }],
    coach: {
      keyWords: [{ text: "suitable degree of accuracy", why: "The most accurate value both bounds agree on." }, { text: "Give a reason", why: "No reason, no mark." }],
      clues: ["Round both bounds to 3 significant figures: do they agree?", "Try 2 significant figures.", "Write the value and why."],
      traps: ["Did you give a reason?"],
    },
  },
  {
    id: "mw2-q6a", source: { paper: SRC, q: "6", part: "a" }, topic: "growth", tier: "H", calculator: true,
    prompt: "The number of bacteria, N, in a dish t hours after the start of an experiment is modelled by<br><span class=\"eq\">N = ab<sup>t</sup></span>&nbsp; where a and b are positive constants.<br>When t = 2, N = 1800<br>When t = 5, N = 6075<br>Work out the value of a and the value of b.",
    promptText: `${BACT} Work out the value of a and the value of b.`,
    marks: 4, answer: "a = 800, b = 1.5", solution: ["ab² = 1800 and ab⁵ = 6075", "b³ = 6075 ÷ 1800 = 3.375", "b = 1.5", "a = 1800 ÷ 1.5² = 800"], noWorking: "full",
    showWorking: "Write both equations, then divide them.",
    points: [
      { id: "M1a", code: "M1", criterion: "ab² = 1800 and ab⁵ = 6075" },
      { id: "M1b", code: "M1", dep: ["M1a"], criterion: "Divides to eliminate a: b³ = 6075 ÷ 1800 = 3.375" },
      { id: "A1a", code: "A1", dep: ["M1b"], criterion: "b = 1.5" },
      { id: "A1b", code: "A1", dep: ["M1b"], criterion: "a = 1800 ÷ 1.5² = 800", reject: ["1200 (divided by b only once)"] },
    ],
    errors: [
      { id: "wrong-operation", looksLike: "subtracted the two equations instead of dividing" },
      { id: "fractional-index", looksLike: "worked out 3.375 ÷ 3 when a cube root is needed" },
      { id: "index-law", looksLike: "found a by dividing 1800 by b only once" },
    ],
    dangerZones: [{ id: "divide", when: "both equations are written", warn: "Divide one by the other to get rid of a." }],
    coach: {
      keyWords: [{ text: "N = abt", why: "Two unknowns, two facts: two equations." }],
      clues: ["Write ab² = 1800 and ab⁵ = 6075.", "Divide the second by the first: a cancels, leaving b³.", "Cube root for b, then find a."],
      traps: ["Did you cube root, not divide by 3?"],
    },
  },
  {
    id: "mw2-q6b", source: { paper: SRC, q: "6", part: "b" }, topic: "growth", tier: "H", calculator: true,
    prompt: "According to the model, after how many complete hours will the number of bacteria first be greater than 100 000? You must show all your working.",
    promptText: `${BACT} So N = 800 × 1.5^t. After how many complete hours will N first be greater than 100 000? You must show all your working.`,
    marks: 2, answer: "12 hours", solution: ["t = 11: 800 × 1.5¹¹ = 69 198", "t = 12: 800 × 1.5¹² = 103 797"], noWorking: "zero",
    showWorking: "This question says 'You must show all your working'.",
    points: [
      { id: "M1", code: "M1", ft: true, criterion: "Values either side of 100 000: after 11 hours 69 198, after 12 hours 103 797." },
      { id: "A1", code: "A1", dep: ["M1"], criterion: "12", reject: ["11", "12 with no values"] },
    ],
    errors: [{ id: "stopped-early", looksLike: "gave 11, when the number is still below 100 000, or 12 with no values" }],
    dangerZones: [{ id: "either", when: "the student has tried a value of t", warn: "Show the hour below 100 000 and the hour above." }],
    coach: {
      keyWords: [{ text: "first be greater than 100 000", why: "Find the first whole hour above." }, { text: "You must show all your working", why: "Show the values either side." }],
      clues: ["Use N = 800 × 1.5ᵗ.", "Try whole numbers of hours.", "Show the last one below and the first one above."],
      traps: ["Have you shown both values?"],
    },
  },
  {
    id: "mw2-q7a", source: { paper: SRC, q: "7", part: "a" }, topic: "hist", tier: "H", calculator: true,
    prompt: "The histogram shows information about the distances, d km, that some people travel to work.<br>Work out the number of people who travel more than 20 km to work.",
    promptText: `${DIST} Work out the number of people who travel more than 20 km to work.`,
    diagram: histDist, marks: 2, answer: "28 people", solution: ["20 to 30: 2.0 × 10 = 20", "30 to 50: 0.4 × 20 = 8", "20 + 8"], noWorking: "full",
    points: [
      { id: "M1", code: "M1", criterion: "2.0 × 10 = 20 or 0.4 × 20 = 8" },
      { id: "A1", code: "A1", dep: ["M1"], criterion: "28" },
    ],
    errors: [{ id: "wrong-operation", looksLike: "read the heights of the bars as the frequencies: the frequency is the area" }],
    dangerZones: [{ id: "area", when: "the student is reading bars", warn: "Frequency = height × width." }],
    coach: {
      keyWords: [{ text: "more than 20 km", why: "The last two bars." }],
      clues: ["Find the bars from 20 to 30 and 30 to 50.", "Frequency = frequency density × width.", "Add the two frequencies."],
      traps: ["Did you multiply by the widths?"],
    },
  },
  {
    id: "mw2-q7b", source: { paper: SRC, q: "7", part: "b" }, topic: "hist", tier: "H", calculator: true,
    prompt: "Work out an estimate for the median distance. Give your answer correct to 1 decimal place.",
    promptText: `${DIST} Work out an estimate for the median distance, correct to 1 decimal place.`,
    diagram: histDist, marks: 3, answer: "17.3 km", solution: ["Frequencies 12, 18, 22, 20, 8: total 80", "Median is the 40th value", "30 people before 15 km, so 10 more into the 15–20 class", "15 + 10/22 × 5 = 17.27…"], noWorking: "full",
    showWorking: "List every frequency and the total before finding the median.",
    points: [
      { id: "M1a", code: "M1", criterion: "All frequencies: 12, 18, 22, 20, 8. Total 80, so the median is the 40th value." },
      { id: "M1b", code: "M1", dep: ["M1a"], criterion: "The 40th value is 10 values into the 15 to 20 class: 15 + 10/22 × 5" },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "17.3 (from 17.27…)", reject: ["17.5 (middle of the class)", "25 (middle of the axis)"] },
    ],
    errors: [
      { id: "wrong-average", looksLike: "gave 17.5, the middle of the class, or 25, the middle of the axis" },
      { id: "wrong-operation", looksLike: "read the bar heights as frequencies" },
    ],
    dangerZones: [{ id: "share", when: "the median class has been found", warn: "Share out the class in proportion: how far into it is the 40th person?" }],
    coach: {
      keyWords: [{ text: "median distance", why: "The middle person, by counting frequencies." }],
      clues: ["Find every frequency: height × width. Add them for the total.", "The median is the 40th person. Which class is that in?", "Go 10 people into a class of 22, which is 5 km wide."],
      traps: ["Did you use proportion within the class?"],
    },
  },
  {
    id: "mw2-q8a", source: { paper: SRC, q: "8", part: "a" }, topic: "cond", tier: "H", calculator: true,
    prompt: "There are 5 red counters, 4 blue counters and 3 green counters in a bag.<br>Two counters are taken from the bag at random, without replacement.<br>Work out the probability that the two counters are the same colour.",
    marks: 3, answer: "19/66", solution: ["RR: 5/12 × 4/11 = 20/132", "BB: 4/12 × 3/11 = 12/132", "GG: 3/12 × 2/11 = 6/132", "38/132 = 19/66"], noWorking: "full",
    showWorking: "Write all three products before adding.",
    points: [
      { id: "M1a", code: "M1", criterion: "One correct product, e.g. 5/12 × 4/11", reject: ["5/12 × 5/12 (with replacement)"] },
      { id: "M1b", code: "M1", dep: ["M1a"], criterion: "Adds all three: 20/132 + 12/132 + 6/132" },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "38/132 = 19/66 oe" },
    ],
    errors: [{ id: "replacement", looksLike: "squared each probability, as if the first counter were put back" }],
    dangerZones: [
      { id: "eleven", when: "the student is writing the second probability", warn: "One counter is gone. Out of how many now?" },
      { id: "three", when: "one or two colours are done", warn: "Same colour: all three colours count." },
    ],
    coach: {
      keyWords: [{ text: "without replacement", why: "The second draw is out of 11." }, { text: "same colour", why: "Red-red, blue-blue or green-green." }],
      clues: ["Three routes: both red, both blue, both green.", "Each second probability is out of 11, with one fewer of that colour.", "Add the three products."],
      traps: ["Did you include all three colours?"],
    },
  },
  {
    id: "mw2-q8b", source: { paper: SRC, q: "8", part: "b" }, topic: "cond", tier: "H", calculator: true,
    prompt: "The two counters are the same colour.<br>Work out the probability that they are both red.",
    promptText: `${BAG} P(same colour) = 38/132. The two counters are the same colour. Work out the probability that they are both red.`,
    marks: 2, answer: "10/19", solution: ["P(both red) = 20/132", "20/132 ÷ 38/132 = 20/38"], noWorking: "full",
    points: [
      { id: "M1", code: "M1", ft: true, criterion: "20/132 ÷ 38/132" },
      { id: "A1", code: "A1", dep: ["M1"], criterion: "10/19", accept: ["20/38"], reject: ["20/132"] },
    ],
    errors: [{ id: "wrong-denominator", looksLike: "gave 20/132: once you know the counters match, the 38 matching outcomes are the new total" }],
    dangerZones: [{ id: "given", when: "the student is writing the probability", warn: "Given they match: what's the new total?" }],
    coach: {
      keyWords: [{ text: "The two counters are the same colour", why: "Given: only matching pairs count now." }],
      clues: ["Only the 'same colour' outcomes count.", "Of those, which are both red?", "P(both red) ÷ P(same colour)."],
      traps: ["Is your denominator the 'same colour' probability?"],
    },
  },
  {
    id: "mw2-q9a", source: { paper: SRC, q: "9", part: "a" }, topic: "formeq", tier: "H", calculator: true,
    prompt: "Priya drives 120 km from home to a meeting at an average speed of x km/h.<br>She drives home along the same route at an average speed of (x + 20) km/h.<br>The total driving time for the two journeys is 5 hours.<br>Show that &nbsp;<span class=\"eq\">x<sup>2</sup> − 28x − 480 = 0</span>",
    promptText: `${PRIYA} Show that x² − 28x − 480 = 0.`,
    marks: 4, answer: "Shown: 120/x + 120/(x + 20) = 5 leads to x² − 28x − 480 = 0",
    solution: ["Times: 120/x and 120/(x + 20)", "120/x + 120/(x + 20) = 5", "120(x + 20) + 120x = 5x(x + 20)", "240x + 2400 = 5x² + 100x", "5x² − 140x − 2400 = 0, so x² − 28x − 480 = 0"], noWorking: "zero",
    points: [
      { id: "M1a", code: "M1", criterion: "Times for the two journeys: 120/x and 120/(x + 20)", reject: ["120x (time as distance × speed)"] },
      { id: "M1b", code: "M1", dep: ["M1a"], criterion: "120/x + 120/(x + 20) = 5" },
      { id: "M1c", code: "M1", dep: ["M1b"], criterion: "Clears the fractions: 120(x + 20) + 120x = 5x(x + 20)" },
      { id: "A1", code: "A1", dep: ["M1c"], criterion: "240x + 2400 = 5x² + 100x, leading to x² − 28x − 480 = 0" },
    ],
    errors: [
      { id: "wrong-formula", looksLike: "wrote time as distance × speed" },
      { id: "wrong-average", looksLike: "added the two speeds and divided 240 by the total: average speeds can't be combined like that" },
    ],
    dangerZones: [{ id: "time", when: "the student is writing the times", warn: "Time = distance ÷ speed." }],
    coach: {
      keyWords: [{ text: "Show that", why: "Start from the times and arrive at the equation." }, { text: "total driving time", why: "Time there + time back = 5." }],
      clues: ["Time = distance ÷ speed for each journey.", "Add the two times and set equal to 5.", "Multiply through by x(x + 20), expand and simplify."],
      traps: ["Did you start from the times, not the answer?"],
    },
  },
  {
    id: "mw2-q9b", source: { paper: SRC, q: "9", part: "b" }, topic: "factq", tier: "H", calculator: true,
    prompt: "Work out Priya's average speed on the journey home.",
    promptText: `${PRIYA} x² − 28x − 480 = 0. Work out Priya's average speed on the journey home.`,
    marks: 2, answer: "60 km/h", solution: ["(x − 40)(x + 12) = 0, so x = 40", "Home speed = 40 + 20"], noWorking: "full",
    points: [
      { id: "M1", code: "M1", criterion: "(x − 40)(x + 12) = 0, so x = 40", accept: ["correct use of the quadratic formula"] },
      { id: "A1", code: "A1", dep: ["M1"], criterion: "40 + 20 = 60", reject: ["40 (the outward speed)"] },
    ],
    errors: [{ id: "wrong-share", looksLike: "gave 40, the speed on the way to the meeting: the question asks for the journey home" }],
    dangerZones: [{ id: "home", when: "x = 40 has been found", warn: "Which journey does the question ask about?" }],
    coach: {
      keyWords: [{ text: "journey home", why: "Speed (x + 20)." }],
      clues: ["Factorise x² − 28x − 480.", "Reject the negative solution.", "The journey home was at x + 20."],
      traps: ["Is your answer the speed home?"],
    },
  },
  {
    id: "mw2-q10", source: { paper: SRC, q: "10" }, topic: "perp", tier: "H", calculator: true,
    prompt: "A is the point (1, 2) and B is the point (7, 5).<br>The straight line L passes through B and is perpendicular to AB.<br>L crosses the x-axis at the point C.<br>Work out the area of triangle ABC.<br>You must show all your working.",
    marks: 5, answer: "18.75", solution: ["Gradient AB = 3/6 = 1/2", "Gradient L = −2", "y − 5 = −2(x − 7); y = 0 gives x = 9.5, C = (9.5, 0)", "Right angle at B: area = ½ × AB × BC = ½ × √45 × √31.25"], noWorking: "zero",
    showWorking: "This question says 'You must show all your working'.",
    points: [
      { id: "M1a", code: "M1", criterion: "Gradient of AB = (5 − 2)/(7 − 1) = 1/2", reject: ["6/3 = 2"] },
      { id: "M1b", code: "M1", ft: true, dep: ["M1a"], criterion: "Gradient of L = −2", reject: ["−1/2"] },
      { id: "M1c", code: "M1", ft: true, dep: ["M1b"], criterion: "y − 5 = −2(x − 7); when y = 0, x = 9.5, so C is (9.5, 0)" },
      { id: "M1d", code: "M1", ft: true, dep: ["M1c"], criterion: "The right angle is at B: area = ½ × AB × BC = ½ × √45 × √31.25", accept: ["any correct area method, e.g. enclosing rectangle minus triangles"] },
      { id: "A1", code: "A1", dep: ["M1d"], criterion: "18.75" },
    ],
    errors: [
      { id: "swapped", looksLike: "worked out the gradient as 6/3 = 2, the wrong way up" },
      { id: "perp-gradient", looksLike: "used −1/2 for the perpendicular: flip the fraction as well as changing the sign" },
      { id: "wrong-formula", looksLike: "treated AC as a base along the x-axis: A isn't on the axis" },
    ],
    dangerZones: [
      { id: "perp", when: "the gradient of AB has been found", warn: "Perpendicular: flip and change the sign." },
      { id: "area", when: "C has been found", warn: "Where is the right angle? Use it for base and height." },
    ],
    coach: {
      keyWords: [{ text: "perpendicular to AB", why: "The angle at B is 90°." }, { text: "You must show all your working", why: "No working, no marks." }],
      clues: ["Find the gradient of AB, then the perpendicular gradient.", "Write the equation of L through B and set y = 0 to find C.", "The right angle is at B: area = ½ × AB × BC."],
      traps: ["Is your perpendicular gradient −2?"],
    },
  },
  {
    id: "mw2-q11", source: { paper: SRC, q: "11" }, topic: "trig3d", tier: "H", calculator: true,
    prompt: "ABCDEFGH is a cuboid. M is the midpoint of HG.<br>AB = 9 cm &nbsp;&nbsp; BC = 6 cm &nbsp;&nbsp; CG = 5 cm<br>Work out the size of the angle between the line AM and the plane ABCD.<br>Give your answer correct to 1 decimal place.",
    diagram: cuboidM, marks: 5, answer: "33.7°", solution: ["N = midpoint of DC, directly below M", "AN² = 4.5² + 6² = 56.25", "AN = 7.5", "tan x = 5 ÷ 7.5", "x = 33.7°"], noWorking: "full",
    showWorking: "Name the point below M and write AN before the trig.",
    points: [
      { id: "M1a", code: "M1", criterion: "Identifies N, the midpoint of DC, directly below M, and the right-angled triangle AMN." },
      { id: "M1b", code: "M1", dep: ["M1a"], criterion: "AN² = 4.5² + 6²", reject: ["9² + 6²"] },
      { id: "A1a", code: "A1", dep: ["M1b"], criterion: "AN = 7.5" },
      { id: "M1c", code: "M1", ft: true, dep: ["M1b"], criterion: "tan x = 5 / 7.5" },
      { id: "A1b", code: "A1", dep: ["M1c"], criterion: "33.7" },
    ],
    errors: [
      { id: "wrong-share", looksLike: "used 9 cm where half of it is needed: M is the midpoint, so DN = 4.5 cm" },
      { id: "wrong-formula", looksLike: "found the angle AG or AC makes with the base" },
    ],
    dangerZones: [{ id: "below", when: "the student starts", warn: "Drop straight down from M to the base. Where does it land?" }],
    coach: {
      keyWords: [{ text: "midpoint of HG", why: "M is above the midpoint of DC." }, { text: "plane ABCD", why: "The base. Drop down from M." }],
      clues: ["The point directly below M is N, the midpoint of DC.", "AN² = 4.5² + 6².", "tan x = MN ÷ AN, with MN = 5."],
      traps: ["Did you use 4.5, not 9?"],
    },
  },
  {
    id: "mw2-q12", source: { paper: SRC, q: "12" }, topic: "arcs", tier: "H", calculator: true,
    prompt: "A and B are points on a circle, centre O.<br>The radius of the circle is 10 cm. The chord AB has length 12 cm.<br>Work out the area of the shaded segment.<br>Give your answer correct to 3 significant figures.",
    diagram: chordSeg, marks: 5, answer: "16.4 cm²", solution: ["Half of angle AOB = sin⁻¹(6/10) = 36.87°", "Angle AOB = 73.74°", "Sector = 73.74/360 × π × 10² = 64.35", "Triangle = ½ × 12 × 8 = 48", "Segment = 16.35… = 16.4"], noWorking: "full",
    showWorking: "Write the angle, sector and triangle as separate lines, keeping full values.",
    points: [
      { id: "M1a", code: "M1", criterion: "Half of angle AOB: sin⁻¹(6/10) = 36.87° (or the cosine rule in triangle OAB)." },
      { id: "A1a", code: "A1", dep: ["M1a"], criterion: "Angle AOB = 73.74°", reject: ["36.87 used as the whole angle"] },
      { id: "M1b", code: "M1", ft: true, criterion: "Sector: 73.74/360 × π × 10² = 64.35" },
      { id: "M1c", code: "M1", criterion: "Triangle: ½ × 12 × 8 = 48 (or ½ × 10² × sin 73.74°)." },
      { id: "A1b", code: "A1", dep: ["M1b", "M1c"], criterion: "16.4 (from 16.35)", reject: ["16.3 (angle rounded early)", "64.4 (triangle not subtracted)"] },
    ],
    errors: [
      { id: "half", looksLike: "used 36.87° as the whole angle at the centre" },
      { id: "stopped-early", looksLike: "forgot to subtract the triangle" },
      { id: "rounding", looksLike: "rounded the angle to 73.7 before using it, giving 16.3" },
    ],
    dangerZones: [
      { id: "angle", when: "half the angle has been found", warn: "That's half the angle at O." },
      { id: "triangle", when: "the sector area has been found", warn: "The segment is the sector minus the triangle." },
    ],
    coach: {
      keyWords: [{ text: "shaded segment", why: "Sector minus triangle." }, { text: "3 significant figures", why: "Keep full values until the end." }],
      clues: ["Split triangle OAB into two right-angled triangles to find the angle at O.", "Sector = angle/360 × π × 10².", "Triangle height = √(10² − 6²) = 8. Subtract the triangle."],
      traps: ["Did you double the half-angle?", "Did you subtract the triangle?"],
    },
  },
  {
    id: "mw2-q13a", source: { paper: SRC, q: "13", part: "a" }, topic: "iter", tier: "H", calculator: true,
    prompt: "Show that the equation &nbsp;<span class=\"eq\">x<sup>3</sup> + 2x − 7 = 0</span>&nbsp; can be rearranged to give &nbsp;<span class=\"eq\">x = ∛(7 − 2x)</span>",
    promptText: "Show that x³ + 2x − 7 = 0 can be rearranged to give x = ∛(7 − 2x).",
    marks: 1, answer: "Shown: x³ = 7 − 2x, then cube root", solution: ["x³ = 7 − 2x", "x = ∛(7 − 2x)"], noWorking: "zero",
    points: [{ id: "B1", code: "B1", criterion: "x³ = 7 − 2x, then takes the cube root of both sides." }],
    errors: [{ id: "order-error", looksLike: "started from the given answer" }],
    dangerZones: [{ id: "start", when: "the student starts", warn: "Start from the original equation." }],
    coach: {
      keyWords: [{ text: "Show that", why: "Every step from the original equation." }],
      clues: ["Start with x³ + 2x − 7 = 0.", "Move 2x − 7 to the other side.", "Cube root both sides."],
      traps: ["Did you start from the original equation?"],
    },
  },
  {
    id: "mw2-q13b", source: { paper: SRC, q: "13", part: "b" }, topic: "iter", tier: "H", calculator: true,
    prompt: "Starting with x<sub>0</sub> = 1.5, use the iteration formula &nbsp;<span class=\"eq\">x<sub>n+1</sub> = ∛(7 − 2x<sub>n</sub>)</span><br>to work out the values of x<sub>1</sub>, x<sub>2</sub> and x<sub>3</sub>. Give each value correct to 4 decimal places.",
    promptText: "Starting with x0 = 1.5, use x(n+1) = ∛(7 − 2x(n)) to work out x1, x2 and x3, each correct to 4 decimal places.",
    marks: 3, answer: "1.5874, 1.5639, 1.5703", solution: ["x1 = ∛4 = 1.587401…", "x2 = 1.563932…", "x3 = 1.570303…"], noWorking: "full",
    points: [
      { id: "B1a", code: "B1", criterion: "x1 = 1.5874" },
      { id: "B1b", code: "B1", criterion: "x2 = 1.5639" },
      { id: "B1c", code: "B1", criterion: "x3 = 1.5703" },
    ],
    errors: [{ id: "fractional-index", looksLike: "used a square root for the cube root" }, { id: "rounding", looksLike: "typed rounded values back in" }],
    dangerZones: [{ id: "ans", when: "x1 has been found", warn: "Use ANS, not the rounded value." }],
    coach: {
      keyWords: [{ text: "x0 = 1.5", why: "Your starting value." }, { text: "4 decimal places", why: "Round each answer, keep full values in the calculator." }],
      clues: ["Put 1.5 into the formula.", "Type 1.5, =, then ∛(7 − 2ANS).", "Press = for each next value."],
      traps: ["Is it a cube root?"],
    },
  },
  {
    id: "mw2-q13c", source: { paper: SRC, q: "13", part: "c" }, topic: "iter", tier: "H", calculator: true,
    prompt: "Show that the solution of &nbsp;<span class=\"eq\">x<sup>3</sup> + 2x − 7 = 0</span>&nbsp; is x = 1.57 correct to 2 decimal places.",
    promptText: "Show that the solution of x³ + 2x − 7 = 0 is x = 1.57 correct to 2 decimal places.",
    marks: 2, answer: "Shown: change of sign between 1.565 and 1.575", solution: ["x = 1.565: −0.037", "x = 1.575: 0.057", "Change of sign, so the solution is between 1.565 and 1.575, which is 1.57 to 2 d.p."], noWorking: "zero",
    points: [
      { id: "M1", code: "M1", criterion: "Substitutes x = 1.565 and x = 1.575 into x³ + 2x − 7: −0.037 and 0.057", reject: ["1.56 and 1.58", "continued iteration only"] },
      { id: "A1", code: "A1", dep: ["M1"], criterion: "There is a change of sign, so the solution lies between 1.565 and 1.575 and is 1.57 to 2 decimal places." },
    ],
    errors: [
      { id: "no-bounds", looksLike: "tested 1.56 and 1.58, which only shows the solution is between them; the values to test are 1.565 and 1.575" },
      { id: "stopped-early", looksLike: "carried on iterating and wrote 'it settles at 1.57', which doesn't prove the rounding" },
    ],
    dangerZones: [{ id: "bounds", when: "the student chooses values to test", warn: "Test the bounds of 1.57 to 2 decimal places." }],
    coach: {
      keyWords: [{ text: "correct to 2 decimal places", why: "Test the bounds: 1.565 and 1.575." }],
      clues: ["What are the bounds of 1.57 to 2 decimal places?", "Substitute both into x³ + 2x − 7.", "One negative, one positive: say what that proves."],
      traps: ["Did you test 1.565 and 1.575?"],
    },
  },
  {
    id: "mw2-q14a", source: { paper: SRC, q: "14", part: "a" }, topic: "cosr", tier: "H", calculator: true,
    prompt: "A ship sails 14 km from port A to buoy B on a bearing of 065°<br>The ship then sails 9 km from B to lighthouse C on a bearing of 150°<br>Work out the distance AC. Give your answer correct to 3 significant figures.",
    diagram: shipRoute, marks: 3, answer: "17.3 km", solution: ["Angle ABC = 65 + 30 = 95°", "AC² = 14² + 9² − 2 × 14 × 9 × cos 95°", "AC = 17.29…"], noWorking: "full",
    showWorking: "Write angle ABC with how you found it before the cosine rule.",
    points: [
      { id: "M1a", code: "M1", criterion: "Angle ABC = 65 + 30 = 95°", reject: ["85° (150 − 65)"] },
      { id: "M1b", code: "M1", ft: true, dep: ["M1a"], criterion: "AC² = 14² + 9² − 2 × 14 × 9 × cos 95°" },
      { id: "A1", code: "A1", dep: ["M1b"], criterion: "17.3 (from 17.29…)", reject: ["16.0 (from 85°)"] },
    ],
    errors: [{ id: "wrong-operation", looksLike: "worked out angle ABC as 150 − 65 = 85°, giving 16.0 km" }],
    markerNotes: ["At B: the angle back towards A is 65° (alternate angles) and the angle round to C is 180 − 150 = 30°."],
    dangerZones: [{ id: "angle", when: "the student is finding angle ABC", warn: "Draw the south line at B and use alternate angles." }],
    coach: {
      keyWords: [{ text: "bearing of 065°", why: "Measured clockwise from north at A." }, { text: "bearing of 150°", why: "Measured clockwise from north at B." }],
      clues: ["Find angle ABC first.", "From B, A is on a back bearing; use alternate angles: 65°. The angle to C from south is 30°.", "Use the cosine rule with angle ABC."],
      traps: ["Is angle ABC 95°?"],
    },
  },
  {
    id: "mw2-q14b", source: { paper: SRC, q: "14", part: "b" }, topic: "bearing", tier: "H", calculator: true,
    prompt: "Work out the bearing of C from A. Give your answer correct to the nearest degree.",
    promptText: `${SHIP} Angle ABC = 95° and AC = 17.29 km. Work out the bearing of C from A, to the nearest degree.`,
    diagram: shipRoute, marks: 3, answer: "096°", solution: ["sin A / 9 = sin 95° / 17.29…", "Angle BAC = 31.2°", "65 + 31.2 = 96.2 → 096°"], noWorking: "full",
    points: [
      { id: "M1", code: "M1", ft: true, criterion: "sin A / 9 = sin 95° / 17.29…" },
      { id: "A1a", code: "A1", dep: ["M1"], criterion: "Angle BAC = 31.2°" },
      { id: "A1b", code: "A1", dep: ["M1"], criterion: "65 + 31.2 = 096°", reject: ["31° (the triangle angle)", "96 without three figures"] },
    ],
    errors: [{ id: "stopped-early", looksLike: "gave 31°, the angle in the triangle, as the bearing: a bearing is from north, with three figures" }],
    dangerZones: [{ id: "north", when: "angle BAC has been found", warn: "A bearing is measured from north. Add it to 65°." }],
    coach: {
      keyWords: [{ text: "bearing of C from A", why: "Clockwise from north at A, three figures." }],
      clues: ["Use the sine rule to find angle BAC.", "The bearing of B from A is 065°.", "Add angle BAC to 65° and write with three figures."],
      traps: ["Is your bearing three figures?"],
    },
  },
];
