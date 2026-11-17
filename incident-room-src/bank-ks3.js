/* ================= KS3 ACADEMY BANK (Years 7–9) =================
   Same builders as the GCSE bank. tier holds the KS3 level, which The Interrogation uses as its grades:
     "K1" Constable (1 point) · "K2" Sergeant (2 points) · "K3" Inspector (3 points)
   Topics (Academy):
     KA1 Collecting like terms · KA2 Expanding brackets · KR1 Percentages · KR2 Ratio
     KN1 Fractions and mixed numbers · KN2 Ordering fractions · KN3 Decimals and rounding          */
const KS3_TOPIC_LIST = [
  ["KA1", "Collecting like terms"], ["KA2", "Expanding brackets"], ["KR1", "Percentages"], ["KR2", "Ratio"],
  ["KN1", "Fractions and mixed numbers"], ["KN2", "Ordering fractions"], ["KN3", "Decimals and rounding"]
];

/* ---------- KA1 Collecting like terms ---------- */
MC("KA1", "K1", "Simplify a + a + a + a", ["4a", "a⁴", "4 + a", "a4"], "Adding the same letter four times gives 4a. a⁴ means a × a × a × a.", 20);
MC("KA1", "K1", "Simplify 3x + 5x", ["8x", "8x²", "15x", "35x"], "Add the numbers in front: 3 + 5 = 8, so 8x.", 20);
TY("KA1", "K1", "Simplify 6y − 2y + y", "5y", ["5y"], "6 − 2 + 1 = 5. A y on its own counts as 1y.", "e.g. 3y", 25);
TF("KA1", "K1", "2a + 3b = 5ab", false, "a and b are different letters, so 2a and 3b aren't like terms. 2a + 3b can't be simplified.", 15);
MC("KA1", "K1", "Simplify 4m + 3 + 2m + 5", ["6m + 8", "14m", "6m + 15", "8m + 6"], "m terms: 4m + 2m = 6m. Numbers: 3 + 5 = 8.", 25);
TF("KA1", "K1", "x + x = x²", false, "x + x = 2x. x² means x × x.", 15);
TY("KA1", "K2", "Simplify 5a + 3b − 2a + 4b", "3a + 7b", ["3a+7b", "7b+3a"], "a terms: 5a − 2a = 3a. b terms: 3b + 4b = 7b.", "e.g. 2a + 5b", 35);
SP("KA1", "K2", "Simplify 7p − 3q − 2p + 5q", ["p terms: 7p − 2p = 5p", "q terms: −3q + 5q = −8q", "Answer: 5p − 8q"], 1,
  ["q terms: −3q + 5q = 2q", "q terms: −3q + 5q = 8q", "q terms: −3q + 5q = −2q"], "5p + 2q", ["5p+2q", "2q+5p"],
  "The minus belongs to the 3q only. −3 + 5 = 2, so the q terms make +2q.", 40);
MC("KA1", "K2", "Simplify 4x − 7 − x + 2", ["3x − 5", "5x − 9", "3x − 9", "4x − 5"], "x terms: 4x − x = 3x. Numbers: −7 + 2 = −5.", 30);
TF("KA1", "K2", "3x + 2y − 3x = 2y", true, "3x − 3x = 0, so only 2y is left.", 15);
MC("KA1", "K2", "Which expression simplifies to 2a + 5?", ["7a − 5a + 2 + 3", "2a + 5a", "7a + 5 − 5a − 5", "a + a + 5a"], "7a − 5a = 2a and 2 + 3 = 5. The third one gives 2a, because 5 − 5 = 0.", 35);
TY("KA1", "K2", "Simplify 9m − 4n − 6m − 3n", "3m − 7n", ["3m-7n", "-7n+3m"], "m terms: 9 − 6 = 3. n terms: −4 − 3 = −7.", "e.g. 2m − 5n", 35);
MC("KA1", "K3", "Simplify 3x² + 4x − x² + 2x", ["2x² + 6x", "8x³", "6x² + 2x", "4x² + 6x"], "x² terms: 3x² − x² = 2x². x terms: 4x + 2x = 6x. x² and x aren't like terms.", 30);
SP("KA1", "K3", "Simplify 5ab + 2a − 3ba + a", ["ab and ba are different terms", "So the answer is 5ab − 3ba + 3a"], 0,
  ["ab and ba are like terms, because a × b = b × a", "ab and a are like terms", "ab and ba cancel each other out"], "2ab + 3a", ["2ab+3a", "3a+2ab"],
  "ab and ba are the same term, so 5ab − 3ab = 2ab. Then 2a + a = 3a.", 45);
TY("KA1", "K3", "Simplify 2x² − 3x + 5 − x² + 4x − 7", "x² + x − 2", ["x2+x-2", "x^2+x-2"], "x²: 2 − 1 = 1. x: −3 + 4 = 1. Numbers: 5 − 7 = −2.", "type x^2 for x²", 50);
TF("KA1", "K3", "4y² and 4y are like terms.", false, "y² means y × y, which is a different kind of term from y.", 15);
MC("KA1", "K3", "A rectangle has sides 3x + 2 and x − 1. Which is its perimeter?", ["8x + 2", "4x + 1", "8x + 6", "3x² + 2"], "Perimeter = 2(3x + 2) + 2(x − 1) = 6x + 4 + 2x − 2 = 8x + 2.", 45);

/* ---------- KA2 Expanding brackets ---------- */
MC("KA2", "K1", "Expand 3(x + 4)", ["3x + 12", "3x + 4", "x + 12", "3x + 7"], "Multiply both terms by 3: 3 × x = 3x and 3 × 4 = 12.", 20);
TY("KA2", "K1", "Expand 5(a − 2)", "5a − 10", ["5a-10"], "5 × a = 5a and 5 × −2 = −10.", "e.g. 4a − 8", 25);
TF("KA2", "K1", "2(x + 6) = 2x + 6", false, "The 2 multiplies both terms: 2(x + 6) = 2x + 12.", 15);
MC("KA2", "K1", "Expand 4(2y + 1)", ["8y + 4", "6y + 4", "8y + 1", "8y + 5"], "4 × 2y = 8y and 4 × 1 = 4.", 20);
TY("KA2", "K1", "Expand 7(3 + m)", "21 + 7m", ["21+7m", "7m+21"], "7 × 3 = 21 and 7 × m = 7m.", "e.g. 12 + 4m", 25);
MC("KA2", "K2", "Expand x(x + 5)", ["x² + 5x", "2x + 5", "x² + 5", "x + 5x"], "x × x = x² and x × 5 = 5x.", 25);
SP("KA2", "K2", "Expand −2(x − 3)", ["−2 × x = −2x", "−2 × −3 = −6", "Answer: −2x − 6"], 1,
  ["−2 × −3 = +6", "−2 × −3 = −5", "−2 × −3 = −1"], "−2x + 6", ["-2x+6", "6-2x"], "A negative times a negative is positive: −2 × −3 = +6.", 40);
TY("KA2", "K2", "Expand and simplify 3(x + 2) + 4x", "7x + 6", ["7x+6", "6+7x"], "3(x + 2) = 3x + 6. Then 3x + 4x = 7x.", "e.g. 5x + 3", 35);
MC("KA2", "K2", "Expand and simplify 2(a + 3) + 3(a − 1)", ["5a + 3", "5a + 9", "5a + 5", "6a + 3"], "2a + 6 + 3a − 3 = 5a + 3.", 35);
TF("KA2", "K2", "y(y − 4) = y² − 4y", true, "y × y = y² and y × −4 = −4y.", 15);
MC("KA2", "K2", "4(x + □) = 4x + 28. What number goes in the box?", ["7", "24", "28", "32"], "4 × □ = 28, so □ = 7.", 25);
SP("KA2", "K3", "Expand and simplify 5(x + 2) − 2(x + 3)", ["5(x + 2) = 5x + 10", "−2(x + 3) = −2x + 6", "5x + 10 − 2x + 6 = 3x + 16"], 1,
  ["−2(x + 3) = −2x − 6", "−2(x + 3) = −2x + 3", "−2(x + 3) = 2x + 6"], "3x + 4", ["3x+4", "4+3x"],
  "The −2 multiplies both terms: −2 × 3 = −6. So 5x + 10 − 2x − 6 = 3x + 4.", 50);
TY("KA2", "K3", "Expand 3x(2x − 5)", "6x² − 15x", ["6x2-15x", "6x^2-15x"], "3x × 2x = 6x² and 3x × −5 = −15x.", "type x^2 for x²", 40);
MC("KA2", "K3", "Expand (x + 3)(x + 2)", ["x² + 5x + 6", "x² + 6", "x² + 6x + 5", "2x + 5"], "x × x + x × 2 + 3 × x + 3 × 2 = x² + 2x + 3x + 6 = x² + 5x + 6.", 40);
TY("KA2", "K3", "Expand and simplify 4(2x − 1) − 3(x − 5)", "5x + 11", ["5x+11", "11+5x"], "8x − 4 − 3x + 15. −3 × −5 = +15. 8x − 3x = 5x and −4 + 15 = 11.", "e.g. 2x + 9", 55);

/* ---------- KR1 Percentages ---------- */
MC("KR1", "K1", "Find 10% of £70", ["£7", "£0.70", "£10", "£700"], "10% is one tenth: 70 ÷ 10 = £7.", 20);
TY("KR1", "K1", "Find 25% of 80", "20", ["20"], "25% is a quarter: 80 ÷ 4 = 20.", "a number", 25);
MC("KR1", "K1", "Write 3/4 as a percentage", ["75%", "34%", "3.4%", "43%"], "3/4 = 0.75 = 75%.", 20);
TF("KR1", "K1", "50% of 36 is 18.", true, "50% is a half, and half of 36 is 18.", 15);
MC("KR1", "K1", "Find 5% of 60", ["3", "12", "30", "0.3"], "10% of 60 is 6, so 5% is half of that: 3.", 25);
TY("KR1", "K2", "Find 35% of 240", "84", ["84"], "10% = 24, so 30% = 72. 5% = 12. 72 + 12 = 84.", "a number", 40);
SP("KR1", "K2", "Increase £80 by 15%", ["10% of 80 = 8", "5% of 80 = 4", "15% of 80 = 12", "80 − 12 = £68"], 3,
  ["80 + 12 = £92", "80 × 12 = £960", "80 + 15 = £95"], "£92", ["92"], "An increase means add: 80 + 12 = £92.", 40);
MC("KR1", "K2", "A £45 jumper is reduced by 20%. What is the sale price?", ["£36", "£25", "£9", "£54"], "20% of 45 = 9, so the price is 45 − 9 = £36.", 35);
TY("KR1", "K2", "Write 18 out of 40 as a percentage", "45%", ["45", "45%"], "18/40 = 45/100 = 45%.", "e.g. 30%", 35);
MC("KR1", "K2", "Which is the same as 0.6?", ["60%", "6%", "0.6%", "16%"], "0.6 = 60/100 = 60%.", 20);
TY("KR1", "K3", "Find 17.5% of £200", "35", ["35", "£35"], "10% = 20, 5% = 10, 2.5% = 5. 20 + 10 + 5 = £35.", "a number", 45);
ME("KR1", "K3", "Which calculation finds 12% of 350 in one step?", ["0.12 × 350", "12 × 350", "350 ÷ 12", "1.2 × 350"], "12% = 12/100 = 0.12, so multiply by 0.12: 42.", 30);
MC("KR1", "K3", "A price goes from £50 to £60. What is the percentage increase?", ["20%", "10%", "16.7%", "60%"], "The increase is £10. 10 ÷ 50 = 0.2 = 20%. Divide by the original amount.", 40);
SP("KR1", "K3", "Decrease 250 by 12%", ["12% = 0.12", "Multiplier = 1 + 0.12 = 1.12", "250 × 1.12 = 280"], 1,
  ["Multiplier = 1 − 0.12 = 0.88", "Multiplier = 0.12", "Multiplier = 12"], "220", ["220"], "A 12% decrease leaves 88%, so multiply by 0.88: 250 × 0.88 = 220.", 50);
TF("KR1", "K3", "Increasing by 10% and then decreasing by 10% gets you back where you started.", false, "100 up 10% is 110. Then 10% of 110 is 11, so 110 − 11 = 99. The second 10% is of a bigger amount.", 25);

/* ---------- KR2 Ratio ---------- */
MC("KR2", "K1", "Simplify 12 : 18", ["2 : 3", "6 : 9", "3 : 2", "4 : 6"], "Divide both by 6, their highest common factor.", 20);
TY("KR2", "K1", "Simplify 15 : 25", "3 : 5", ["3:5"], "Divide both by 5.", "e.g. 2 : 7", 25);
TF("KR2", "K1", "4 : 6 is the same ratio as 2 : 3.", true, "Divide both parts of 4 : 6 by 2 to get 2 : 3.", 15);
MC("KR2", "K1", "There are 3 boys for every 4 girls. What fraction of the group are boys?", ["3/7", "3/4", "4/7", "1/3"], "3 + 4 = 7 parts, and 3 of them are boys: 3/7.", 30);
MC("KR2", "K1", "Share 20 sweets in the ratio 1 : 3", ["5 and 15", "10 and 10", "1 and 19", "4 and 16"], "1 + 3 = 4 parts. 20 ÷ 4 = 5 per part, so 5 and 15.", 25);
SP("KR2", "K2", "Share £60 in the ratio 2 : 3", ["Total parts = 2 + 3 = 5", "One part = 60 ÷ 3 = £20", "Shares: £40 and £60"], 1,
  ["One part = 60 ÷ 5 = £12", "One part = 60 ÷ 2 = £30", "One part = 60 × 5 = £300"], "£24 and £36", ["24,36", "36,24", "24:36"],
  "Divide by the total number of parts, 5. Check: the shares must add up to £60.", 45);
TY("KR2", "K2", "Red and blue counters are in the ratio 2 : 5. There are 14 red counters. How many blue counters are there?", "35", ["35"], "14 ÷ 2 = 7 counters per part, so blue = 5 × 7 = 35.", "a number", 40);
MC("KR2", "K2", "Write 50 cm : 2 m in its simplest form", ["1 : 4", "25 : 1", "50 : 2", "1 : 40"], "Use the same units first: 2 m = 200 cm. 50 : 200 = 1 : 4.", 35);
TY("KR2", "K2", "A recipe for 4 people uses 300 g of flour. How many grams for 6 people?", "450", ["450", "450g"], "300 ÷ 4 = 75 g per person, and 6 × 75 = 450 g.", "a number", 40);
TF("KR2", "K2", "In the ratio 3 : 5, the first share is 3/5 of the total.", false, "3 + 5 = 8 parts, so the first share is 3/8 of the total. 3/5 compares the two shares with each other.", 20);
MC("KR2", "K3", "Share £84 in the ratio 1 : 2 : 4", ["£12, £24, £48", "£21, £42, £84", "£28, £28, £28", "£12, £24, £36"], "1 + 2 + 4 = 7 parts. 84 ÷ 7 = £12 per part.", 40);
TY("KR2", "K3", "Anna and Ben share money in the ratio 5 : 3. Anna gets £24 more than Ben. How much does Anna get?", "60", ["60", "£60"], "The difference is 5 − 3 = 2 parts = £24, so 1 part = £12 and Anna gets 5 × 12 = £60.", "a number", 55);
ME("KR2", "K3", "Mix A is 3 cups of juice to 2 of water. Mix B is 5 cups of juice to 4 of water. Which method shows which is stronger?", ["Compare juice as a fraction of each mix: 3/5 and 5/9", "Compare 3 − 2 with 5 − 4", "Compare 3 + 2 with 5 + 4", "Compare 3 × 2 with 5 × 4"], "3/5 = 0.6 and 5/9 ≈ 0.56, so Mix A is stronger.", 45);
MC("KR2", "K3", "Cats and dogs are in the ratio 3 : 7. There are 40 more dogs than cats. How many animals are there altogether?", ["100", "40", "70", "130"], "7 − 3 = 4 parts = 40, so 1 part = 10. Altogether 3 + 7 = 10 parts = 100.", 50);

/* ---------- KN1 Fractions and mixed numbers ---------- */
MC("KN1", "K1", "Work out 2/7 + 3/7", ["5/7", "5/14", "6/7", "1/7"], "The denominators are the same, so add the tops: 2 + 3 = 5.", 20);
TY("KN1", "K1", "Work out 5/9 − 2/9. Give your answer in its simplest form.", "1/3", ["1/3", "3/9"], "5 − 2 = 3, so 3/9, which simplifies to 1/3.", "e.g. 2/5", 30);
MC("KN1", "K1", "Write 7/2 as a mixed number", ["3 1/2", "2 1/7", "3 2/7", "7 1/2"], "7 ÷ 2 = 3 remainder 1, so 3 1/2.", 25);
MC("KN1", "K1", "Write 2 3/4 as an improper fraction", ["11/4", "9/4", "23/4", "8/4"], "2 wholes = 8 quarters, plus 3 quarters = 11/4.", 25);
TF("KN1", "K1", "1/2 + 1/3 = 2/5", false, "Use a common denominator of 6: 3/6 + 2/6 = 5/6. Never add the bottoms.", 20);
TY("KN1", "K2", "Work out 1/4 + 2/3", "11/12", ["11/12"], "Common denominator 12: 3/12 + 8/12 = 11/12.", "e.g. 5/6", 40);
SP("KN1", "K2", "Work out 3/5 × 2/3", ["Multiply the tops: 3 × 2 = 6", "Multiply the bottoms: 5 + 3 = 8", "Answer: 6/8"], 1,
  ["Multiply the bottoms: 5 × 3 = 15", "Multiply the bottoms: 5 − 3 = 2", "Keep the bottom: 5"], "2/5", ["2/5", "6/15"],
  "Multiply the tops and the bottoms: 6/15, which simplifies to 2/5.", 40);
MC("KN1", "K2", "Work out 2/5 ÷ 1/3", ["6/5", "2/15", "3/10", "1/5"], "Keep, change, flip: 2/5 × 3/1 = 6/5.", 35);
TY("KN1", "K2", "Work out 1 1/2 + 2 1/4", "3 3/4", ["3 3/4", "15/4", "3.75"], "Wholes: 1 + 2 = 3. Fractions: 2/4 + 1/4 = 3/4. So 3 3/4.", "e.g. 2 1/3", 40);
TF("KN1", "K2", "2/3 ÷ 2 = 1/3", true, "Halving 2/3 gives 1/3.", 20);
TY("KN1", "K3", "Work out 2 1/3 × 1 1/2", "3 1/2", ["3 1/2", "7/2", "3.5"], "7/3 × 3/2 = 21/6 = 7/2 = 3 1/2.", "e.g. 4 1/4", 55);
SP("KN1", "K3", "Work out 3 1/4 − 1 2/3", ["Whole numbers: 3 − 1 = 2", "Fractions: 1/4 − 2/3 = 3/12 − 8/12", "That's −5/12, so 2 − 5/12 = 2 5/12"], 2,
  ["That's −5/12, so 2 − 5/12 = 1 7/12", "That's 5/12, so 2 + 5/12 = 2 5/12", "That's −5/12, so the answer is −5/12"], "1 7/12", ["1 7/12", "19/12"],
  "The fractions give −5/12, which comes off the 2: 2 − 5/12 = 1 7/12. Check: 39/12 − 20/12 = 19/12.", 60);
MC("KN1", "K3", "Work out 1 1/2 ÷ 3/4", ["2", "1 1/8", "9/8", "1/2"], "3/2 ÷ 3/4 = 3/2 × 4/3 = 12/6 = 2.", 45);
ME("KN1", "K3", "What is the best first step to work out 2 1/5 × 3?", ["Write 2 1/5 as 11/5", "Multiply the 1/5 by 3 only", "Add 3 to the 2", "Write 3 as 3/5"], "Turn the mixed number into an improper fraction: 11/5 × 3 = 33/5 = 6 3/5.", 35);

/* ---------- KN2 Ordering fractions ---------- */
MC("KN2", "K1", "Which is bigger, 3/5 or 2/5?", ["3/5", "2/5", "They're equal", "You can't tell"], "The denominators are the same, so compare the tops: 3 > 2.", 15);
MC("KN2", "K1", "Which fraction is the largest?", ["1/2", "1/3", "1/4", "1/5"], "With 1 on top, the smaller the bottom number, the bigger each part.", 20);
TF("KN2", "K1", "1/8 is bigger than 1/6.", false, "Cutting into 8 pieces makes smaller pieces than cutting into 6, so 1/8 < 1/6.", 15);
OR("KN2", "K1", "Put these fractions in order, smallest first.", "smallest to largest", ["1/4", "2/4", "3/4", "5/4"], "Same denominator, so order the tops: 1, 2, 3, 5.");
MC("KN2", "K1", "Which fraction is equal to 2/3?", ["4/6", "2/6", "3/2", "4/3"], "Multiply the top and bottom by 2: 2/3 = 4/6.", 20);
OR("KN2", "K2", "Put these fractions in order, smallest first.", "smallest to largest", ["2/5", "1/2", "3/5", "3/4"], "As decimals: 0.4, 0.5, 0.6, 0.75.");
MC("KN2", "K2", "Which is bigger, 5/8 or 3/5?", ["5/8", "3/5", "They're equal", "You can't tell"], "Common denominator 40: 5/8 = 25/40 and 3/5 = 24/40.", 30);
SP("KN2", "K2", "Which is larger, 2/3 or 3/4?", ["Use a common denominator of 12", "2/3 = 8/12 and 3/4 = 9/12", "So 2/3 is larger"], 2,
  ["So 3/4 is larger", "So they are equal", "So 2/3 is larger by 1/12"], "3/4", ["3/4"], "9/12 is more than 8/12, so 3/4 is larger.", 40);
TY("KN2", "K2", "Which is smallest: 3/10, 1/4 or 2/5? Type the fraction.", "1/4", ["1/4"], "As decimals: 0.3, 0.25 and 0.4. The smallest is 1/4.", "e.g. 1/2", 35);
TF("KN2", "K2", "7/9 is bigger than 4/5.", false, "Common denominator 45: 7/9 = 35/45 and 4/5 = 36/45, so 7/9 is smaller.", 25);
OR("KN2", "K3", "Put these in order, smallest first.", "smallest to largest", ["0.3", "1/3", "0.35", "3/8"], "1/3 = 0.333… and 3/8 = 0.375, so 0.3, 1/3, 0.35, 3/8.");
OR("KN2", "K3", "Put these in order, smallest first.", "smallest to largest", ["−1/2", "−1/3", "1/4", "1/3"], "Negatives come first, and −1/2 is further below zero than −1/3.");
MC("KN2", "K3", "Which fraction lies between 1/3 and 1/2?", ["2/5", "1/4", "3/5", "2/3"], "1/3 ≈ 0.33 and 1/2 = 0.5. 2/5 = 0.4 is between them.", 35);
TY("KN2", "K3", "Write the fraction exactly halfway between 1/4 and 1/2.", "3/8", ["3/8", "0.375", "6/16"], "1/4 = 2/8 and 1/2 = 4/8, so halfway is 3/8.", "e.g. 5/12", 45);

/* ---------- KN3 Decimals and rounding ---------- */
MC("KN3", "K1", "Round 4.67 to 1 decimal place", ["4.7", "4.6", "5", "4.67"], "The next digit is 7, which is 5 or more, so round up to 4.7.", 20);
TY("KN3", "K1", "Work out 3.4 + 2.75", "6.15", ["6.15"], "Line up the decimal points: 3.40 + 2.75 = 6.15.", "a number", 30);
MC("KN3", "K1", "Round 2,348 to the nearest hundred", ["2,300", "2,400", "2,350", "2,000"], "The tens digit is 4, which is less than 5, so round down to 2,300.", 20);
TF("KN3", "K1", "0.5 is bigger than 0.45.", true, "0.5 = 0.50, and 0.50 > 0.45.", 15);
TY("KN3", "K1", "Work out 6 − 2.3", "3.7", ["3.7"], "6.0 − 2.3 = 3.7.", "a number", 25);
SP("KN3", "K2", "Work out 0.3 × 0.4", ["3 × 4 = 12", "There are 2 decimal places in the question", "Answer: 1.2"], 2,
  ["Answer: 0.12", "Answer: 12", "Answer: 0.012"], "0.12", ["0.12", ".12"], "Two decimal places in the question, so two in the answer: 0.12.", 35);
MC("KN3", "K2", "Round 0.04637 to 2 significant figures", ["0.046", "0.05", "0.0464", "0.04"], "The first significant figure is 4. Keep 4 and 6, then the next digit is 3, so round down: 0.046.", 30);
TY("KN3", "K2", "Work out 2.4 × 3", "7.2", ["7.2"], "24 × 3 = 72, with one decimal place: 7.2.", "a number", 25);
MC("KN3", "K2", "Work out 7.2 ÷ 0.3", ["24", "2.4", "0.24", "240"], "Multiply both numbers by 10: 72 ÷ 3 = 24.", 30);
TY("KN3", "K2", "Round 3.995 to 2 decimal places", "4.00", ["4.00", "4"], "The third decimal place is 5, so round up: 3.99 becomes 4.00. Keep both decimal places.", "a number", 35);
ME("KN3", "K3", "Which is the best estimate for 4.87 × 19.6?", ["5 × 20 = 100", "4 × 19 = 76", "4.9 × 20 = 98", "5 × 19.6 = 98"], "Round each number to 1 significant figure: 5 × 20 = 100.", 30);
TF("KN3", "K3", "0.4 × 0.5 = 2", false, "4 × 5 = 20, and there are two decimal places in the question, so 0.4 × 0.5 = 0.20 = 0.2.", 20);
TY("KN3", "K3", "Work out 1.25 × 0.8", "1", ["1", "1.0", "1.00"], "125 × 8 = 1000, with three decimal places: 1.000 = 1.", "a number", 40);
MC("KN3", "K3", "A length is 6.4 m, rounded to 1 decimal place. What is the smallest it could be?", ["6.35 m", "6.3 m", "6.45 m", "6.39 m"], "Anything from 6.35 up to (but not including) 6.45 rounds to 6.4.", 40);
SP("KN3", "K3", "Work out 3.6 ÷ 0.04", ["Multiply both numbers by 100: 360 ÷ 4", "360 ÷ 4 = 9", "Answer: 9"], 1,
  ["360 ÷ 4 = 90", "360 ÷ 4 = 0.9", "360 ÷ 4 = 900"], "90", ["90"], "360 ÷ 4 = 90.", 40);
