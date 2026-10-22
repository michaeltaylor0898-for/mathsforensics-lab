/* ================= GCSE QUESTION BANK =================
   Topics follow the GCSE (9–1) specification, grouped by strand.
   tier: "F" = Foundation and Higher, "H" = Higher only.
   Builders:
     SP spot the mistake  (topic, tier, brief, lines, err, fixes[0 = correct], answer, accept|null, why, secs?)
     MC multiple choice   (topic, tier, brief, options[0 = correct], why, secs?)
     ME choose the method (topic, tier, brief, options[0 = correct], why, secs?)
     TF true or false     (topic, tier, brief, correct, why, secs?)
     OR put in order      (topic, tier, brief, dir, items[in correct order], why, secs?)
     TY type the answer   (topic, tier, brief, answer, accept[], why, hint?, secs?)                   */
const STRANDS = { N: "Number", A: "Algebra", R: "Ratio & proportion", G: "Geometry & measures", P: "Probability", S: "Statistics" };
const TOPIC_LIST = [
  ["N1", "Place value, ordering & negatives"], ["N2", "Order of operations"], ["N3", "Factors, multiples & primes"],
  ["N4", "Powers, roots & index laws"], ["N5", "Fractions"], ["N6", "Fractions, decimals & percentages"],
  ["N7", "Standard form"], ["N8", "Rounding & estimation"], ["N9", "Error intervals & bounds"],
  ["N10", "Surds"], ["N11", "Recurring decimals"], ["N12", "Fractional & negative indices"], ["N13", "Counting (product rule)"],
  ["A1", "Simplifying expressions"], ["A2", "Expanding brackets"], ["A3", "Factorising"], ["A4", "Substitution & formulae"],
  ["A5", "Rearranging formulae"], ["A6", "Linear equations"], ["A7", "Inequalities"], ["A8", "Sequences"],
  ["A9", "Straight-line graphs"], ["A10", "Quadratic graphs"], ["A11", "Solving quadratics"],
  ["A12", "Quadratic formula & completing the square"], ["A13", "Simultaneous equations"], ["A14", "Functions"],
  ["A15", "Algebraic proof"], ["A16", "Algebraic fractions"], ["A17", "Iteration"], ["A18", "Cubic, reciprocal & other graphs"],
  ["A19", "Circles & tangents"], ["A20", "Real-life & motion graphs"], ["A21", "Quadratic inequalities"], ["A22", "Graph transformations"],
  ["R1", "Ratio"], ["R2", "Percentages"], ["R3", "Reverse percentages"], ["R4", "Compound interest, growth & decay"],
  ["R5", "Direct & inverse proportion"], ["R6", "Speed, density & pressure"], ["R7", "Best buys & unit conversions"], ["R8", "Scale drawings & maps"],
  ["G1", "Angle facts & parallel lines"], ["G2", "Angles in polygons"], ["G3", "Properties of shapes"], ["G4", "Perimeter & area"],
  ["G5", "Circles"], ["G6", "Arcs & sectors"], ["G7", "Volume & surface area"], ["G8", "Cones, pyramids & spheres"],
  ["G9", "Pythagoras"], ["G10", "Trigonometry"], ["G11", "Sine rule, cosine rule & area"], ["G12", "3D Pythagoras & trigonometry"],
  ["G13", "Transformations"], ["G14", "Similarity & congruence"], ["G15", "Similar areas & volumes"], ["G16", "Constructions & loci"],
  ["G17", "Bearings"], ["G18", "Vectors"], ["G19", "Circle theorems"], ["G20", "Plans & elevations"],
  ["P1", "Probability basics"], ["P2", "Relative frequency & expected outcomes"], ["P3", "Sample spaces"],
  ["P4", "Tree diagrams & independent events"], ["P5", "Conditional probability"], ["P6", "Venn diagrams & sets"],
  ["S1", "Averages & range"], ["S2", "Averages from frequency tables"], ["S3", "Charts & two-way tables"],
  ["S4", "Scatter graphs & correlation"], ["S5", "Sampling & types of data"], ["S6", "Cumulative frequency & box plots"], ["S7", "Histograms"]
];
const TOPICS = Object.fromEntries(TOPIC_LIST);
const TOPIC_IDS = TOPIC_LIST.map(t => t[0]);
const strandOf = id => (STRANDS[String(id)[0]] ? String(id)[0] : null);
const TYPES = {
  spot:   { label: "Spot the mistake" },
  mc:     { label: "Multiple choice" },
  tf:     { label: "True or false" },
  order:  { label: "Put in order" },
  method: { label: "Choose the method" },
  type:   { label: "Type the answer" }
};
const SECS = { spot: 45, mc: 30, tf: 20, order: 40, method: 30, type: 40 };
const BANK = [];
const add = q => { q.secs = q.secs || SECS[q.type]; BANK.push(q); };
const SP = (topic, tier, brief, lines, err, fixes, answer, accept, why, secs) => add({ type: "spot", topic, tier, brief, lines, err, fixes, answer, accept: accept || null, why, secs });
const MC = (topic, tier, brief, options, why, secs) => add({ type: "mc", topic, tier, brief, options, why, secs });
const ME = (topic, tier, brief, options, why, secs) => add({ type: "method", topic, tier, brief, options, why, secs });
const TF = (topic, tier, brief, correct, why, secs) => add({ type: "tf", topic, tier, brief, correct, why, secs });
const OR = (topic, tier, brief, dir, items, why, secs) => add({ type: "order", topic, tier, brief, dir, items, why, secs });
const TY = (topic, tier, brief, answer, accept, why, hint, secs) => add({ type: "type", topic, tier, brief, answer, accept, why, hint: hint || "", secs });

/* ---------- The Year 9 pilot set ---------- */
SP("R1", "F", "Share £84 in the ratio 3 : 4.", ["Ratio of shares is 3 : 4", "One part = 84 ÷ 4 = £21", "Shares: 3 × 21 = £63 and 4 × 21 = £84", "Answer: £63 and £84"], 1,
  ["One part = 84 ÷ 7 = £12", "One part = 84 ÷ 12 = £7", "One part = 84 × 7 = £588"], "£36 and £48", ["36,48", "48,36", "36:48"],
  "Divided by one number in the ratio instead of the total number of parts (3 + 4 = 7). Check: the shares must add back to £84.");
SP("R2", "F", "Increase £60 by 15%.", ["10% of £60 = £6", "5% of £60 = £3", "15% of £60 = 6 + 3 = £9", "New amount = 60 − 9 = £51"], 3,
  ["New amount = 60 + 9 = £69", "New amount = 60 × 9 = £540", "New amount = 9 + 15 = £24"], "£69", ["69"],
  "Subtracted the 15% instead of adding it. An increase must make the amount bigger.", 40);
SP("A1", "F", "Simplify 3x + 5y − x + 2y", ["x terms: 3x − x = 3", "y terms: 5y + 2y = 7y", "Answer: 3 + 7y"], 0,
  ["3x − x = 2x", "3x − x = 4x", "3x − x = 3x²"], "2x + 7y", ["2x+7y", "7y+2x"],
  "Treated − x as if it removes the letter. 3x − x means 3 lots of x take away 1 lot of x, which is 2x.", 35);
SP("R5", "F", "5 pens cost £3.40. How much do 8 pens cost?", ["Find the cost of 1 pen first", "1 pen = 5 ÷ 3.40 = £1.47", "8 pens = 8 × 1.47 = £11.76"], 1,
  ["1 pen = 3.40 ÷ 5 = £0.68", "1 pen = 3.40 × 5 = £17.00", "1 pen = 3.40 ÷ 8 = £0.43"], "£5.44", ["5.44"],
  "Divided the wrong way round. Cost of one item = total cost ÷ number of items.");
SP("R1", "F", "Write 40 cm : 2 m in its simplest form.", ["40 cm : 2 m", "= 40 : 2", "Divide both by 2: 20 : 1", "Answer: 20 : 1"], 1,
  ["= 40 : 200", "= 4 : 2", "= 40 : 20"], "1 : 5", ["1:5"], "Simplified before writing both amounts in the same units. 2 m = 200 cm.", 40);
SP("R3", "F", "After a 20% discount a coat costs £48. Find the original price.", ["The discount was 20%", "20% of £48 = £9.60", "Original price = 48 + 9.60 = £57.60"], 1,
  ["£48 is 80% of the original, so 1% = £0.60", "£48 is 120% of the original, so 1% = £0.40", "20% of £48 = £4.80"], "£60", ["60"],
  "Took 20% of the sale price. The 20% was taken off the original, so £48 is 80% of the original price.", 55);
SP("A2", "F", "Expand and simplify 2(x + 4) − 3(x − 2)", ["2(x + 4) = 2x + 8", "−3(x − 2) = −3x − 6", "2x + 8 − 3x − 6 = −x + 2"], 1,
  ["−3(x − 2) = −3x + 6", "−3(x − 2) = −3x − 2", "−3(x − 2) = 3x + 6"], "−x + 14", ["-x+14", "14-x", "-1x+14"],
  "Sign error: the −3 multiplies both terms in the bracket, and −3 × −2 = +6.", 55);
SP("R5", "F", "6 workers take 10 days to build a wall. How long would 4 workers take at the same rate?", ["Fewer workers means the job takes longer", "Days = 10 × 4 ÷ 6", "≈ 6.7 days"], 1,
  ["Days = 6 × 10 ÷ 4", "Days = 10 + 2", "Days = 6 × 10 ÷ 6"], "15 days", ["15"],
  "Treated it as direct proportion. Line 1 says it should take longer, but 6.7 days is shorter. Total work = 6 × 10 = 60 worker-days.", 55);
SP("R2", "F", "A price rises from £40 to £50. Find the percentage increase.", ["Increase = 50 − 40 = £10", "Percentage increase = 10 ÷ 50 × 100", "= 20%"], 1,
  ["= 10 ÷ 40 × 100", "= 50 ÷ 40 × 100", "= 10 ÷ 10 × 100"], "25%", ["25"],
  "Divided by the new value. Percentage change is always compared with the original amount.");
SP("A2", "F", "Expand (x + 3)(x + 5)", ["x × x = x²", "x × 5 + 3 × x = 8x", "3 × 5 = 8", "Answer: x² + 8x + 8"], 2,
  ["3 × 5 = 15", "3 × 5 = 35", "x × 3 = 3x"], "x² + 8x + 15", ["x2+8x+15", "15+8x+x2", "x2+15+8x"],
  "Added the two numbers instead of multiplying them. Every term in the first bracket multiplies every term in the second.");
SP("R2", "F", "Decrease 250 by 12% using a multiplier.", ["100% − 12% = 88%", "Multiplier = 8.8", "250 × 8.8 = 2200"], 1,
  ["Multiplier = 0.88", "Multiplier = 0.12", "Multiplier = 1.12"], "220", ["220"],
  "Converted 88% to 8.8. Divide the percentage by 100: 88% = 0.88. A decrease must give less than 250.", 40);
SP("A3", "F", "Factorise fully 8x² + 12x", ["Highest common factor: 4", "8x² + 12x = 4(2x² + 3x)", "Fully factorised"], 0,
  ["Highest common factor: 4x", "Highest common factor: 2", "Highest common factor: 8x"], "4x(2x + 3)", ["4x(2x+3)", "4x(3+2x)", "(2x+3)4x", "(3+2x)4x"],
  "Missed the algebraic common factor. Both terms contain x, so the highest common factor is 4x.", 40);
MC("R1", "F", "Share £45 in the ratio 2 : 3. What is the larger share?", ["£27", "£18", "£30", "£22.50"], "2 + 3 = 5 parts, so one part is 45 ÷ 5 = £9. The larger share is 3 × 9 = £27.");
MC("R2", "F", "What is 35% of 80?", ["28", "24", "45", "2.8"], "10% of 80 is 8, so 30% is 24 and 5% is 4. 24 + 4 = 28.", 25);
MC("A2", "F", "Expand 3(2x − 5)", ["6x − 15", "6x − 5", "5x − 15", "6x + 15"], "Multiply both terms by 3: 3 × 2x = 6x and 3 × −5 = −15.", 20);
MC("R5", "F", "3 notebooks cost £4.50. How much do 7 notebooks cost?", ["£10.50", "£9.00", "£31.50", "£11.50"], "One notebook costs 4.50 ÷ 3 = £1.50, so 7 notebooks cost 7 × 1.50 = £10.50.");
MC("N6", "F", "Which fraction is equal to 0.375?", ["3/8", "3/75", "37/5", "3/5"], "0.375 = 375/1000. Divide the top and bottom by 125 to get 3/8.");
TF("A1", "F", "x + x + x = x³", false, "x + x + x means three lots of x, which is 3x. x³ means x × x × x.", 15);
TF("R2", "F", "Increasing a price by 10% and then decreasing it by 10% takes it back to the original price.", false, "Try £100: up 10% is £110, then down 10% of £110 is £99, not £100. The second 10% is of a bigger amount.");
TF("R1", "F", "The ratio 12 : 18 simplifies to 2 : 3.", true, "Divide both parts by 6: 12 ÷ 6 = 2 and 18 ÷ 6 = 3.", 15);
TF("A2", "F", "2(x + 3) = 2x + 3", false, "The 2 multiplies both terms in the bracket: 2(x + 3) = 2x + 6.", 15);
TF("R5", "F", "If 4 workers take 6 days, then 8 workers take 12 days.", false, "More workers means less time. Total work is 4 × 6 = 24 worker-days, so 8 workers take 24 ÷ 8 = 3 days.");
OR("N6", "F", "Put these fractions in order, from largest to smallest.", "largest to smallest", ["3/4", "2/3", "5/8", "1/2"], "As decimals: 3/4 = 0.75, 2/3 ≈ 0.667, 5/8 = 0.625, 1/2 = 0.5.");
OR("N6", "F", "Put these in order, from smallest to largest.", "smallest to largest", ["1/4", "28%", "2/7", "0.3"], "Change them all to decimals: 1/4 = 0.25, 28% = 0.28, 2/7 ≈ 0.286, 0.3.", 45);
OR("N6", "F", "Put these in order, from smallest to largest.", "smallest to largest", ["−3/4", "−1/2", "1/3", "2/5"], "Negatives are smallest, and −3/4 is further below zero than −1/2. Then 1/3 ≈ 0.333 and 2/5 = 0.4.");
OR("R1", "F", "Put the steps in order to share £60 in the ratio 1 : 2.", "first step to last step", ["Add the parts: 1 + 2 = 3", "Find one part: 60 ÷ 3 = £20", "Multiply: 1 × 20 = £20 and 2 × 20 = £40", "Check: 20 + 40 = £60"], "Find the total number of parts first, then the value of one part, then each share. Finish by checking they add up.", 45);
ME("R3", "F", "£60 is the price after a 25% increase. Which method finds the original price?", ["60 ÷ 1.25", "60 × 0.75", "60 × 1.25", "60 − 25% of 60"], "£60 is 125% of the original, so divide by the multiplier 1.25. The original price was £48.", 35);
ME("A3", "F", "Which method factorises x² + 5x + 6?", ["Find two numbers that multiply to 6 and add to 5", "Find two numbers that add to 6 and multiply to 5", "Take out x as a common factor", "Divide every term by 6"], "2 and 3 multiply to 6 and add to 5, so x² + 5x + 6 = (x + 2)(x + 3).", 35);
ME("R2", "F", "Which calculation decreases £250 by 12%?", ["250 × 0.88", "250 × 0.12", "250 − 12", "250 × 1.12"], "A 12% decrease leaves 88% of the amount, and 88% = 0.88. So 250 × 0.88 = £220.", 25);
ME("R5", "F", "A recipe for 4 people uses 300 g of flour. Which method finds the flour for 10 people?", ["300 ÷ 4 × 10", "300 × 4 ÷ 10", "300 + 6", "300 × 10"], "Find the amount for 1 person (300 ÷ 4 = 75 g), then multiply by 10 to get 750 g.");
TY("A1", "F", "Simplify 4a + 3b − a + 2b", "3a + 5b", ["3a+5b", "5b+3a"], "a terms: 4a − a = 3a. b terms: 3b + 2b = 5b.", "e.g. 2a + 3b", 35);
TY("R2", "F", "Work out 15% of 240.", "36", ["36"], "10% of 240 is 24 and 5% is 12. 24 + 12 = 36.", "a number", 35);
TY("R5", "F", "y is directly proportional to x. When x = 4, y = 10. Find y when x = 10.", "25", ["25", "y=25"], "10 ÷ 4 = 2.5, so y = 2.5x. When x = 10, y = 2.5 × 10 = 25.", "a number", 45);
TY("A3", "F", "Factorise 6x + 9", "3(2x + 3)", ["3(2x+3)", "3(3+2x)", "(2x+3)3"], "The highest common factor of 6x and 9 is 3, so 6x + 9 = 3(2x + 3).", "e.g. 2(x + 4)", 35);
TY("R1", "F", "Simplify the ratio 24 : 36.", "2 : 3", ["2:3"], "The highest common factor of 24 and 36 is 12. 24 ÷ 12 = 2 and 36 ÷ 12 = 3.", "e.g. 1 : 4", 30);
