/* ---------- NUMBER ---------- */
// N1 Place value, ordering & negatives
MC("N1", "F", "What is −7 + 3?", ["−4", "−10", "4", "10"], "Start at −7 and move 3 to the right on the number line: −4.", 20);
TF("N1", "F", "−8 is greater than −3.", false, "−8 is further below zero than −3, so −8 < −3.", 15);
OR("N1", "F", "Put these numbers in order, from smallest to largest.", "smallest to largest", ["−5", "−2.5", "0.3", "0.35"], "Negatives come first, and −5 is further below zero than −2.5. Then 0.3 = 0.30, which is less than 0.35.");
TY("N1", "F", "Work out −6 × −4", "24", ["24"], "A negative times a negative is positive: 6 × 4 = 24.", "a number", 20);
SP("N1", "F", "Work out 3 − (−5) − 9", ["3 − (−5) = 3 − 5", "= −2", "−2 − 9 = −11"], 0,
  ["3 − (−5) = 3 + 5", "3 − (−5) = −3 − 5", "3 − (−5) = 3 × 5"], "−1", ["-1"], "Subtracting a negative is the same as adding: 3 − (−5) = 8, then 8 − 9 = −1.");
MC("N1", "F", "What is the value of the 7 in 3.072?", ["7 hundredths", "7 tenths", "7 thousandths", "7 tens"], "In 3.072 the digits after the point are 0 tenths, 7 hundredths and 2 thousandths.", 20);
// N2 Order of operations
MC("N2", "F", "Work out 3 + 4 × 2", ["11", "14", "24", "9"], "Multiply before adding: 4 × 2 = 8, then 3 + 8 = 11.", 20);
SP("N2", "F", "Work out 20 − 12 ÷ 4 + 1", ["20 − 12 = 8", "8 ÷ 4 = 2", "2 + 1 = 3"], 0,
  ["12 ÷ 4 = 3", "20 − 1 = 19", "4 + 1 = 5"], "18", ["18"], "Division comes before subtraction: 12 ÷ 4 = 3, so 20 − 3 + 1 = 18.");
TF("N2", "F", "(2 + 3)² = 2² + 3²", false, "(2 + 3)² = 5² = 25, but 2² + 3² = 4 + 9 = 13.");
TY("N2", "F", "Work out 5 × (6 − 2)²", "80", ["80"], "Brackets first: 6 − 2 = 4. Then the power: 4² = 16. Then 5 × 16 = 80.", "a number", 30);
MC("N2", "F", "Work out 18 ÷ 3 × 2", ["12", "3", "8", "36"], "Division and multiplication have equal priority, so work left to right: 18 ÷ 3 = 6, then 6 × 2 = 12.", 20);
MC("N2", "F", "Work out 2 + 3²", ["11", "25", "8", "13"], "Powers come before addition: 3² = 9, then 2 + 9 = 11.", 20);
// N3 Factors, multiples & primes
MC("N3", "F", "Which of these is a prime number?", ["29", "27", "39", "51"], "29 has exactly two factors, 1 and 29. 27 = 3 × 9, 39 = 3 × 13 and 51 = 3 × 17.", 25);
MC("N3", "F", "Which is 60 written as a product of prime factors?", ["2² × 3 × 5", "2 × 3 × 10", "4 × 3 × 5", "2² × 15"], "60 = 2 × 30 = 2 × 2 × 15 = 2 × 2 × 3 × 5. 10, 4 and 15 are not prime.");
TY("N3", "F", "Find the highest common factor (HCF) of 24 and 36.", "12", ["12"], "Factors of 24: 1, 2, 3, 4, 6, 8, 12, 24. The biggest one that also divides 36 is 12.", "a number", 30);
TY("N3", "F", "Find the lowest common multiple (LCM) of 6 and 8.", "24", ["24"], "Multiples of 8: 8, 16, 24. 24 is the first one that is also a multiple of 6.", "a number", 30);
SP("N3", "F", "Find the HCF of 18 and 30.", ["18 = 2 × 3 × 3", "30 = 2 × 3 × 5", "Multiply all the primes: 2 × 3 × 3 × 5 = 90", "HCF = 90"], 2,
  ["Multiply only the primes they share: 2 × 3 = 6", "Add the primes: 2 + 3 + 3 + 5 = 13", "Multiply the largest primes: 3 × 5 = 15"], "6", ["6"],
  "Multiplying all the primes gives the LCM, not the HCF. The HCF uses only the primes both numbers share: 2 × 3 = 6.");
TF("N3", "F", "1 is a prime number.", false, "A prime number has exactly two factors. 1 has only one factor, so it is not prime.", 15);
ME("N3", "F", "Buses leave every 12 minutes and trains every 20 minutes. Both leave at 9:00. Which method finds when they next leave together?", ["Find the LCM of 12 and 20", "Find the HCF of 12 and 20", "Add 12 and 20", "Multiply 12 by 20"], "They leave together at common multiples of 12 and 20. The LCM is 60, so next at 10:00.", 35);
// N4 Powers, roots & index laws
MC("N4", "F", "Simplify a⁵ × a³", ["a⁸", "a¹⁵", "a²", "2a⁸"], "When multiplying powers of the same base, add the indices: 5 + 3 = 8.", 20);
SP("N4", "F", "Simplify (x³)⁴ ÷ x²", ["(x³)⁴ = x⁷", "x⁷ ÷ x² = x⁵"], 0,
  ["(x³)⁴ = x¹²", "(x³)⁴ = x⁸¹", "(x³)⁴ = 4x³"], "x¹⁰", ["x10"], "A power of a power multiplies the indices: (x³)⁴ = x¹². Then x¹² ÷ x² = x¹⁰.");
TF("N4", "F", "5⁰ = 0", false, "Any non-zero number to the power 0 is 1, so 5⁰ = 1.", 15);
TY("N4", "F", "Work out √81 + 2³", "17", ["17"], "√81 = 9 and 2³ = 8, so 9 + 8 = 17.", "a number", 30);
MC("N4", "F", "What is the cube root of 64?", ["4", "8", "21.3", "16"], "4 × 4 × 4 = 64.", 20);
OR("N4", "F", "Put these in order, from smallest to largest.", "smallest to largest", ["2³", "3²", "√144", "4²"], "2³ = 8, 3² = 9, √144 = 12 and 4² = 16.");
// N5 Fractions
MC("N5", "F", "Work out 2/3 + 1/4", ["11/12", "3/7", "3/12", "2/12"], "Use a common denominator of 12: 8/12 + 3/12 = 11/12.");
SP("N5", "F", "Work out 3/5 ÷ 1/2", ["3/5 ÷ 1/2 = 3/5 × 2/1", "= 3/10"], 1,
  ["= 6/5", "= 5/6", "= 3/7"], "6/5 (= 1 1/5)", ["6/5", "1.2", "1_1/5"], "Line 2 multiplied by 1/2 instead of 2/1. 3/5 × 2/1 = 6/5, which is 1 1/5.");
TF("N5", "F", "1/3 of 60 is bigger than 3/10 of 60.", true, "1/3 of 60 = 20 and 3/10 of 60 = 18.");
TY("N5", "F", "Work out 3/4 of 28.", "21", ["21"], "28 ÷ 4 = 7, then 3 × 7 = 21.", "a number", 30);
ME("N5", "F", "Which method works out 1 2/3 × 3/5?", ["Change 1 2/3 to 5/3, then multiply: 5/3 × 3/5", "Change 1 2/3 to 3/3, then multiply", "Add the tops and the bottoms: (1 + 2 + 3)/(3 + 5)", "Multiply the bottoms only: 1 2/3 × 3/5 = 1 2/15"], "Mixed numbers must become improper fractions first. 5/3 × 3/5 = 15/15 = 1.", 35);
MC("N5", "F", "Write 18/24 in its simplest form.", ["3/4", "9/12", "6/8", "2/3"], "The HCF of 18 and 24 is 6: 18 ÷ 6 = 3 and 24 ÷ 6 = 4. 9/12 and 6/8 are equal to it but not fully simplified.", 25);
// N6 Fractions, decimals & percentages (+ 4 in the pilot set)
TY("N6", "F", "Write 3/20 as a percentage.", "15%", ["15"], "3/20 = 15/100 = 15%.", "a number", 30);
TF("N6", "F", "0.4 = 4%", false, "0.4 = 40/100 = 40%. 4% is 0.04.", 15);
// N7 Standard form
MC("N7", "F", "Write 45 000 in standard form.", ["4.5 × 10⁴", "45 × 10³", "4.5 × 10³", "0.45 × 10⁵"], "The first number must be between 1 and 10: 4.5. The point moves 4 places, so 4.5 × 10⁴.", 25);
SP("N7", "F", "Write 0.00063 in standard form.", ["Move the decimal point to get 6.3", "It moved 4 places", "0.00063 = 6.3 × 10⁴"], 2,
  ["0.00063 = 6.3 × 10⁻⁴", "0.00063 = 63 × 10⁻⁵", "0.00063 = 6.3 × 10⁻³"], "6.3 × 10⁻⁴", ["6.310-4"], "A number less than 1 has a negative power of 10: 0.00063 = 6.3 × 10⁻⁴.");
TY("N7", "F", "Work out (3 × 10⁵) × (2 × 10³). Give your answer in standard form.", "6 × 10⁸", ["6108"], "Multiply the numbers: 3 × 2 = 6. Add the powers: 10⁵ × 10³ = 10⁸.", "e.g. 4 × 10^5", 40);
TF("N7", "F", "3.2 × 10⁻² = 0.032", true, "10⁻² means divide by 100: 3.2 ÷ 100 = 0.032.");
OR("N7", "F", "Put these in order, from smallest to largest.", "smallest to largest", ["4 × 10⁻³", "2.5 × 10⁻²", "9 × 10⁻¹", "1.1 × 10²"], "Compare the powers first: 10⁻³ < 10⁻² < 10⁻¹ < 10². The values are 0.004, 0.025, 0.9 and 110.");
MC("N7", "H", "Work out (8 × 10⁶) ÷ (4 × 10⁹)", ["2 × 10⁻³", "2 × 10³", "2 × 10¹⁵", "4 × 10⁻³"], "8 ÷ 4 = 2 and 10⁶ ÷ 10⁹ = 10⁻³ (subtract the powers).");
// N8 Rounding & estimation
MC("N8", "F", "Round 0.04682 to 2 significant figures.", ["0.047", "0.05", "0.046", "0.0468"], "The first significant figure is the 4. Keep two: 0.046|82. The next digit is 8, so round up to 0.047.");
SP("N8", "F", "Estimate 49.7 × 3.18 ÷ 0.51", ["Round each to 1 s.f.: 50 × 3 ÷ 0.5", "50 × 3 = 150", "150 ÷ 0.5 = 75"], 2,
  ["150 ÷ 0.5 = 300", "150 ÷ 0.5 = 150.5", "150 ÷ 0.5 = 7.5"], "300", ["300"], "Dividing by 0.5 is the same as multiplying by 2, so 150 ÷ 0.5 = 300.");
TY("N8", "F", "Round 3.8461 to 1 decimal place.", "3.8", ["3.8"], "Look at the second decimal digit: 4 is less than 5, so round down to 3.8.", "a number", 25);
TF("N8", "F", "6482 rounded to 1 significant figure is 6000.", true, "The first significant figure is the 6 (thousands). The next digit is 4, so round down to 6000.");
MC("N8", "F", "Round 17.995 to 2 decimal places.", ["18.00", "17.99", "18.0", "17.10"], "The third decimal digit is 5, so 17.99 rounds up to 18.00. Keep two decimal places.");
ME("N8", "F", "Which is the best estimate for 612 × 0.0487?", ["600 × 0.05", "612 × 0.0487 worked out exactly", "600 × 0.5", "700 × 0.04"], "Round each number to 1 significant figure: 600 × 0.05 = 30.", 25);
// N9 Error intervals & bounds
MC("N9", "F", "A length l is 7.3 cm to 1 decimal place. What is its error interval?", ["7.25 ≤ l < 7.35", "7.2 ≤ l < 7.4", "7.25 < l ≤ 7.35", "7.3 ≤ l < 7.4"], "Half of 0.1 is 0.05. The lower bound 7.25 is included; the upper bound 7.35 is not.");
TY("N9", "F", "A mass is 80 kg to the nearest 10 kg. What is the lower bound?", "75 kg", ["75"], "Half of 10 is 5, so the lower bound is 80 − 5 = 75 kg.", "a number", 30);
SP("N9", "H", "a = 6.2 and b = 3.4, both to 1 d.p. Find the upper bound of a − b.", ["Upper bound of a = 6.25", "Upper bound of b = 3.45", "Upper bound of a − b = 6.25 − 3.45 = 2.8"], 2,
  ["Upper bound of a − b = 6.25 − 3.35 = 2.9", "Upper bound of a − b = 6.15 − 3.45 = 2.7", "Upper bound of a − b = 6.25 + 3.45 = 9.7"], "2.9", ["2.9"],
  "To make a difference as big as possible, use the largest a and the smallest b: 6.25 − 3.35 = 2.9.", 55);
ME("N9", "H", "Which calculation gives the upper bound of x ÷ y?", ["Upper bound of x ÷ lower bound of y", "Upper bound of x ÷ upper bound of y", "Lower bound of x ÷ lower bound of y", "Lower bound of x ÷ upper bound of y"], "Dividing by a smaller number gives a bigger answer, so use the largest x and the smallest y.", 35);
TF("N9", "F", "If n = 4.6 truncated to 1 decimal place, then 4.6 ≤ n < 4.7.", true, "Truncating cuts off digits, so any number from 4.6 up to (but not including) 4.7 truncates to 4.6.", 25);
TY("N9", "H", "A square has side 5 cm to the nearest cm. Find the upper bound of its area.", "30.25 cm²", ["30.25"], "The upper bound of the side is 5.5 cm, so the upper bound of the area is 5.5² = 30.25 cm².", "a number", 45);
// N10 Surds
MC("N10", "H", "Simplify √50", ["5√2", "25√2", "2√5", "10√5"], "50 = 25 × 2, so √50 = √25 × √2 = 5√2.", 25);
SP("N10", "H", "Simplify √12 + √27", ["√12 = 2√3", "√27 = 3√3", "2√3 + 3√3 = 5√6"], 2,
  ["2√3 + 3√3 = 5√3", "2√3 + 3√3 = 6√3", "2√3 + 3√3 = 5√9"], "5√3", ["5√3"], "Add like surds as you would like terms: 2 lots of √3 plus 3 lots of √3 is 5√3.");
TY("N10", "H", "Work out √3 × √12", "6", ["6"], "√3 × √12 = √36 = 6.", "a number", 30);
ME("N10", "H", "Which method rationalises the denominator of 6/√3?", ["Multiply the top and bottom by √3", "Multiply the top and bottom by 3", "Square the top and bottom", "Divide the top and bottom by √3"], "6/√3 × √3/√3 = 6√3/3 = 2√3.");
TF("N10", "H", "√9 + √16 = √25", false, "√9 + √16 = 3 + 4 = 7, but √25 = 5. You can't add square roots by adding the numbers inside them.");
MC("N10", "H", "Expand and simplify (2 + √5)(2 − √5)", ["−1", "9", "4 − √5", "−1 + 4√5"], "It is a difference of two squares: 2² − (√5)² = 4 − 5 = −1.", 35);
// N11 Recurring decimals
MC("N11", "H", "Write 0.777… (0.7 recurring) as a fraction.", ["7/9", "7/10", "77/100", "7/99"], "Let x = 0.777…, so 10x = 7.777…. Subtract: 9x = 7, so x = 7/9.");
OR("N11", "H", "Put the steps in order to write 0.4545… as a fraction.", "first step to last step", ["Let x = 0.4545…", "100x = 45.4545…", "Subtract: 99x = 45", "x = 45/99 = 5/11"], "Two digits repeat, so multiply by 100, subtract to remove the recurring part, then simplify.", 45);
TF("N11", "H", "0.3 recurring is equal to 1/3.", true, "Work out 1 ÷ 3 and you get 0.333…, with the 3 recurring forever.", 15);
SP("N11", "H", "Write 0.1666… (the 6 recurs) as a fraction.", ["Let x = 0.1666…", "10x = 1.666…", "10x − x: 9x = 1.5", "x = 1.5/9 = 15/9 = 5/3"], 3,
  ["x = 1.5/9 = 15/90 = 1/6", "x = 1.5/9 = 1/5", "x = 1.5/9 = 9/1.5"], "1/6", ["1/6"],
  "1.5/9: multiply the top and bottom by 10 to get 15/90, which simplifies to 1/6. 5/3 is bigger than 1, so it can't equal 0.1666…", 55);
TY("N11", "H", "Write 0.222… (0.2 recurring) as a fraction.", "2/9", ["2/9"], "Let x = 0.222…, 10x = 2.222…, so 9x = 2 and x = 2/9.", "e.g. 3/7", 40);
ME("N11", "H", "To write 0.123123… as a fraction, what should you multiply x = 0.123123… by?", ["1000", "10", "100", "3"], "Three digits repeat, so multiply by 10³ = 1000 to line up the recurring parts: 999x = 123.", 25);
// N12 Fractional & negative indices
MC("N12", "H", "Work out 8^(2/3)", ["4", "16/3", "64", "2"], "The 3 on the bottom means cube root: ∛8 = 2. Then square: 2² = 4.");
TY("N12", "H", "Write 2⁻³ as a fraction.", "1/8", ["1/8", "0.125"], "A negative index means the reciprocal: 2⁻³ = 1/2³ = 1/8.", "e.g. 1/4", 30);
SP("N12", "H", "Work out 25^(−1/2)", ["25^(1/2) = 5", "25^(−1/2) = −5"], 1,
  ["25^(−1/2) = 1/5", "25^(−1/2) = −1/5", "25^(−1/2) = 1/25"], "1/5", ["1/5", "0.2"], "A negative index means the reciprocal, not a negative number: 25^(−1/2) = 1/√25 = 1/5.", 40);
TF("N12", "H", "x^(1/2) = √x", true, "A power of 1/2 means the square root.", 15);
MC("N12", "H", "Work out (27/8)^(−1/3)", ["2/3", "3/2", "−3/2", "8/27"], "Cube root first: (27/8)^(1/3) = 3/2. The negative index flips it: 2/3.", 40);
OR("N12", "H", "Put these in order, from smallest to largest.", "smallest to largest", ["4⁻¹", "16^(1/2)", "2³", "81^(3/4)"], "4⁻¹ = 1/4, 16^(1/2) = 4, 2³ = 8 and 81^(3/4) = 3³ = 27.", 50);
// N13 Counting (product rule)
MC("N13", "F", "A café offers 4 starters and 6 mains. How many different starter-and-main meals are there?", ["24", "10", "6", "46"], "For each of the 4 starters there are 6 mains: 4 × 6 = 24.", 25);
TY("N13", "F", "A code has 3 digits, each from 0 to 9. How many different codes are possible?", "1000", ["1000"], "10 choices for each digit: 10 × 10 × 10 = 1000.", "a number", 35);
TF("N13", "F", "There are 6 ways to arrange the letters A, B and C in a row.", true, "3 choices for the first, 2 for the second, 1 for the last: 3 × 2 × 1 = 6.");
SP("N13", "F", "How many 2-letter codes can be made from A, B, C, D and E if a letter can't be used twice?", ["5 choices for the first letter", "5 choices for the second letter", "5 × 5 = 25"], 1,
  ["4 choices for the second letter", "6 choices for the second letter", "1 choice for the second letter"], "20", ["20"], "Letters can't repeat, so once one is used only 4 are left: 5 × 4 = 20.");
ME("N13", "H", "How many ways can 5 runners finish first, second and third?", ["5 × 4 × 3", "5 × 5 × 5", "5 + 4 + 3", "3 × 2 × 1"], "5 choices for 1st, then 4 for 2nd, then 3 for 3rd: 60 ways.");

/* ---------- RATIO, PROPORTION & RATES OF CHANGE ---------- */
// R3 Reverse percentages (+ 2 in the pilot set)
MC("R3", "F", "After a 10% increase, a price is £66. What was the original price?", ["£60", "£59.40", "£56", "£72.60"], "£66 is 110% of the original price: 66 ÷ 1.1 = £60.");
TY("R3", "F", "In a sale with 15% off, a TV costs £340. What was the original price?", "£400", ["400"], "£340 is 85% of the original price: 340 ÷ 0.85 = £400.", "a number", 45);
TF("R3", "F", "If a price falls by 20% to £80, the original price was £96.", false, "£80 is 80% of the original, so the original was 80 ÷ 0.8 = £100. Adding 20% of £80 gives the wrong answer.", 30);
SP("R3", "F", "A salary rose by 4% to £26 000. Find the salary before the rise.", ["£26 000 is 104% of the old salary", "1% = 26 000 ÷ 104 = £250", "Old salary = 250 × 104 = £26 000"], 2,
  ["Old salary = 250 × 100 = £25 000", "Old salary = 250 × 96 = £24 000", "Old salary = 26 000 − 4% = £24 960"], "£25 000", ["25000"], "1% is £250, so 100% (the old salary) is 250 × 100 = £25 000.", 50);
// R4 Compound interest, growth & decay
ME("R4", "F", "£500 is invested at 2% compound interest per year. Which calculation gives its value after 3 years?", ["500 × 1.02³", "500 × 1.02 × 3", "500 + 3 × 2", "500 × 0.02³"], "Each year multiplies the amount by 1.02, three times over: 500 × 1.02³ = £530.60.", 35);
TY("R4", "F", "A car worth £12 000 loses 10% of its value each year. What is it worth after 2 years?", "£9720", ["9720"], "12 000 × 0.9² = 12 000 × 0.81 = £9720.", "a number", 50);
SP("R4", "F", "£2000 earns 5% compound interest a year. Find its value after 2 years.", ["5% of 2000 = £100", "Interest for 2 years = 2 × 100 = £200", "Value = 2000 + 200 = £2200"], 1,
  ["Year 2 interest is 5% of £2100 = £105", "Interest for 2 years = 100 + 5 = £105", "Interest for 2 years = 100² = £10 000"], "£2205", ["2205"],
  "Compound interest is worked out on the new amount each year. 2000 × 1.05² = £2205.", 55);
TF("R4", "F", "Simple interest and compound interest give the same amount after 1 year.", true, "In the first year both are worked out on the original amount, so they match. They differ from year 2.", 25);
MC("R4", "H", "A colony of 800 bacteria doubles every hour. How many bacteria are there after 4 hours?", ["12 800", "6 400", "3 200", "4 000"], "800 × 2⁴ = 800 × 16 = 12 800.");
MC("R4", "F", "Which multiplier gives a 3.5% decrease?", ["0.965", "1.035", "0.35", "0.65"], "100% − 3.5% = 96.5% = 0.965.", 25);
// R5 Direct & inverse proportion (+ 6 in the pilot set)
TY("R5", "H", "y is inversely proportional to x². When x = 2, y = 9. Find y when x = 3.", "4", ["4", "y=4"], "y = k/x². k = 9 × 2² = 36. When x = 3, y = 36 ÷ 9 = 4.", "a number", 55);
// R6 Speed, density & pressure
MC("R6", "F", "A car travels 150 km in 2 hours 30 minutes. What is its average speed?", ["60 km/h", "75 km/h", "65 km/h", "62.5 km/h"], "2 hours 30 minutes = 2.5 hours. 150 ÷ 2.5 = 60 km/h.");
SP("R6", "F", "A cyclist rides at 12 km/h for 45 minutes. How far does she go?", ["Distance = speed × time", "= 12 × 45", "= 540 km"], 1,
  ["= 12 × 0.75", "= 12 × 0.45", "= 45 ÷ 12"], "9 km", ["9"], "The time must be in hours: 45 minutes = 0.75 hours. 12 × 0.75 = 9 km.");
TY("R6", "F", "A block has mass 600 g and volume 75 cm³. Find its density in g/cm³.", "8 g/cm³", ["8"], "Density = mass ÷ volume = 600 ÷ 75 = 8 g/cm³.", "a number", 35);
TF("R6", "F", "Pressure = force × area", false, "Pressure = force ÷ area. A bigger area spreads the force out, giving less pressure.");
MC("R6", "F", "A force of 200 N acts on an area of 4 m². What is the pressure?", ["50 N/m²", "800 N/m²", "196 N/m²", "0.02 N/m²"], "Pressure = force ÷ area = 200 ÷ 4 = 50 N/m².");
ME("R6", "F", "Which calculation converts 20 m/s into km/h?", ["20 × 3600 ÷ 1000", "20 × 60 ÷ 1000", "20 ÷ 3600 × 1000", "20 × 1000 ÷ 3600"], "In one hour it travels 20 × 3600 = 72 000 m, which is 72 km. So 72 km/h.", 35);
// R7 Best buys & unit conversions
MC("R7", "F", "Which is the best buy?", ["6 cans for £3.30", "4 cans for £2.40", "10 cans for £5.80", "12 cans for £7.20"], "Price per can: 55p, 60p, 58p and 60p. 6 cans for £3.30 is the cheapest per can.", 45);
TY("R7", "F", "Convert 3.2 km into metres.", "3200 m", ["3200"], "1 km = 1000 m, so 3.2 × 1000 = 3200 m.", "a number", 25);
SP("R7", "F", "Convert 4 m² into cm².", ["1 m = 100 cm", "So 1 m² = 100 cm²", "4 m² = 400 cm²"], 1,
  ["So 1 m² = 100 × 100 = 10 000 cm²", "So 1 m² = 1000 cm²", "So 1 m² = 200 cm²"], "40 000 cm²", ["40000"], "Area units use the scale factor squared: 1 m² = 100 cm × 100 cm = 10 000 cm². So 4 m² = 40 000 cm².");
TF("R7", "F", "1 litre = 1000 cm³", true, "1 litre = 1000 ml, and 1 ml = 1 cm³.", 15);
MC("R7", "F", "How many minutes are there in 2.4 hours?", ["144", "240", "124", "24"], "0.4 hours = 0.4 × 60 = 24 minutes, so 2.4 hours = 120 + 24 = 144 minutes.", 25);
ME("R7", "F", "£1 = €1.16. Which calculation converts €58 into pounds?", ["58 ÷ 1.16", "58 × 1.16", "58 − 1.16", "1.16 ÷ 58"], "Each pound buys €1.16, so divide: 58 ÷ 1.16 = £50.", 25);
// R8 Scale drawings & maps
MC("R8", "F", "A map scale is 1 : 25 000. Two towns are 8 cm apart on the map. How far apart are they in real life?", ["2 km", "200 m", "20 km", "3125 m"], "8 × 25 000 = 200 000 cm = 2000 m = 2 km.", 40);
TY("R8", "F", "A model car is built to a scale of 1 : 20. The real car is 4 m long. How long is the model, in cm?", "20 cm", ["20"], "4 m = 400 cm. 400 ÷ 20 = 20 cm.", "a number", 40);
TF("R8", "F", "On a 1 : 50 plan, 1 cm represents 50 cm in real life.", true, "A ratio scale with no units means the same units on both sides: 1 cm to 50 cm.");
SP("R8", "F", "A map scale is 1 cm to 5 km. A road is 32 km long. How long is it on the map?", ["1 cm represents 5 km", "Map length = 32 × 5", "= 160 cm"], 1,
  ["Map length = 32 ÷ 5", "Map length = 5 ÷ 32", "Map length = 32 − 5"], "6.4 cm", ["6.4"], "Every 5 km becomes 1 cm, so divide: 32 ÷ 5 = 6.4 cm.");
ME("R8", "F", "A plan has scale 1 : 200. Which converts 3.5 m in real life into a length on the plan, in cm?", ["350 ÷ 200", "3.5 × 200", "350 × 200", "3.5 ÷ 200 × 1000"], "3.5 m = 350 cm. The plan is 200 times smaller: 350 ÷ 200 = 1.75 cm.", 35);
