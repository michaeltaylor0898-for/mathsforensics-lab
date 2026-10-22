/* ---------- ALGEBRA ---------- */
// A1 Simplifying expressions (+ 3 in the pilot set)
MC("A1", "F", "Simplify 5p × 3q", ["15pq", "8pq", "15p + q", "53pq"], "Multiply the numbers and write the letters together: 5 × 3 = 15, so 15pq.", 20);
TY("A1", "F", "Simplify 7x − 2y − 3x + 5y", "4x + 3y", ["4x+3y", "3y+4x"], "x terms: 7x − 3x = 4x. y terms: −2y + 5y = 3y.", "e.g. 2x + 5y", 35);
MC("A1", "F", "Simplify 12a²b ÷ 4ab", ["3a", "3ab", "8a", "3a²"], "12 ÷ 4 = 3, a² ÷ a = a and b ÷ b = 1. So the answer is 3a.", 30);
// A2 Expanding brackets (+ 4 in the pilot set)
TY("A2", "F", "Expand and simplify (x − 4)(x + 6)", "x² + 2x − 24", ["x2+2x-24"], "x² + 6x − 4x − 24 = x² + 2x − 24.", "type x^2 for x²", 45);
MC("A2", "H", "Expand (2x + 1)²", ["4x² + 4x + 1", "4x² + 1", "2x² + 4x + 1", "4x² + 2x + 1"], "(2x + 1)(2x + 1) = 4x² + 2x + 2x + 1 = 4x² + 4x + 1.");
TY("A2", "H", "Expand and simplify (x + 1)(x + 2)(x + 3)", "x³ + 6x² + 11x + 6", ["x3+6x2+11x+6"], "(x + 1)(x + 2) = x² + 3x + 2. Multiply by (x + 3): x³ + 3x² + 2x + 3x² + 9x + 6 = x³ + 6x² + 11x + 6.", "type x^3 for x³", 75);
// A3 Factorising (+ 3 in the pilot set)
MC("A3", "F", "Factorise x² − 9", ["(x + 3)(x − 3)", "(x − 3)²", "(x + 9)(x − 1)", "x(x − 9)"], "It is a difference of two squares: x² − 3² = (x + 3)(x − 3).", 25);
SP("A3", "F", "Factorise x² − 2x − 15", ["Find two numbers that multiply to −15 and add to −2", "The numbers are 3 and −5", "(x − 3)(x + 5)"], 2,
  ["(x + 3)(x − 5)", "(x − 3)(x − 5)", "(x + 3)(x + 5)"], "(x + 3)(x − 5)", ["(x+3)(x-5)", "(x-5)(x+3)"],
  "The numbers are +3 and −5, so the brackets are (x + 3)(x − 5). Check: 3 × −5 = −15 and 3 − 5 = −2.");
TY("A3", "H", "Factorise 2x² + 7x + 3", "(2x + 1)(x + 3)", ["(2x+1)(x+3)", "(x+3)(2x+1)"], "2 × 3 = 6, and 6 and 1 add to 7: 2x² + 6x + x + 3 = 2x(x + 3) + 1(x + 3) = (2x + 1)(x + 3).", "e.g. (x + 1)(3x + 2)", 60);
TF("A3", "F", "x² + 5x = x(x + 5)", true, "Expanding x(x + 5) gives x² + 5x, so x is a common factor.", 15);
// A4 Substitution & formulae
MC("A4", "F", "Find the value of 3a² when a = −4.", ["48", "−48", "144", "24"], "Square first: (−4)² = 16. Then 3 × 16 = 48.", 25);
SP("A4", "F", "Work out 2x² − 5 when x = 3", ["x² = 3 × 2 = 6", "2x² = 2 × 6 = 12", "2x² − 5 = 12 − 5 = 7"], 0,
  ["x² = 3 × 3 = 9", "x² = 3 + 3 = 6", "x² = 2 × 3 = 6"], "13", ["13"], "x² means x × x, not x × 2. 3² = 9, so 2 × 9 − 5 = 13.");
TY("A4", "F", "v = u + at. Find v when u = 5, a = 3 and t = 4.", "17", ["17", "v=17"], "v = 5 + 3 × 4 = 5 + 12 = 17.", "a number", 30);
TF("A4", "F", "If p = −2, then p³ = 8.", false, "(−2)³ = −2 × −2 × −2 = −8.");
MC("A4", "F", "The cost in pounds of hiring a bike for h hours is C = 8 + 3h. Find the cost for 5 hours.", ["£23", "£55", "£15", "£16"], "C = 8 + 3 × 5 = 8 + 15 = £23.", 25);
ME("A4", "F", "Which correctly finds the value of (a + b)/c when a = 7, b = 5 and c = 4?", ["(7 + 5) ÷ 4", "7 + 5 ÷ 4", "7 + (5 ÷ 4)", "(7 × 5) ÷ 4"], "The fraction line works like a bracket: (7 + 5) ÷ 4 = 3.", 25);
// A5 Rearranging formulae
MC("A5", "F", "Make x the subject of y = 3x − 7", ["x = (y + 7)/3", "x = (y − 7)/3", "x = y/3 + 7", "x = 3y + 7"], "Add 7 to both sides: y + 7 = 3x. Divide by 3: x = (y + 7)/3.");
SP("A5", "F", "Make r the subject of A = πr²", ["A = πr²", "Divide both sides by π: A/π = r²", "Halve both sides: r = A/(2π)"], 2,
  ["Square root both sides: r = √(A/π)", "Square both sides: r = (A/π)²", "Subtract π: r = A − π"], "r = √(A/π)", null,
  "The inverse of squaring is taking the square root, not halving: r = √(A/π).");
TY("A5", "F", "Make t the subject of v = u + at", "t = (v − u)/a", ["t=(v-u)/a", "(v-u)/a"], "Subtract u: v − u = at. Divide by a: t = (v − u)/a.", "e.g. t = (v + 2)/a", 45);
TF("A5", "F", "If y = x/4 + 2, then x = 4y − 8.", true, "Subtract 2: y − 2 = x/4. Multiply by 4: x = 4(y − 2) = 4y − 8.", 30);
OR("A5", "F", "Put the steps in order to make x the subject of 5(x − 2) = y.", "first step to last step", ["Expand: 5x − 10 = y", "Add 10 to both sides: 5x = y + 10", "Divide by 5: x = (y + 10)/5"], "Undo the operations in reverse order: expand, add 10, then divide by 5.");
ME("A5", "H", "Which first step helps make x the subject of ax + b = cx + d?", ["Collect the x terms on one side: ax − cx = d − b", "Divide every term by x", "Square both sides", "Take out a factor of a"], "Collect the x terms, then factorise: x(a − c) = d − b, so x = (d − b)/(a − c).", 40);
// A6 Linear equations
MC("A6", "F", "Solve 4x + 7 = 31", ["x = 6", "x = 9.5", "x = 24", "x = 38"], "Subtract 7: 4x = 24. Divide by 4: x = 6.", 25);
SP("A6", "F", "Solve 3(x − 2) = 18", ["3x − 2 = 18", "3x = 20", "x = 20/3"], 0,
  ["3x − 6 = 18", "3x − 5 = 18", "x − 6 = 18"], "x = 8", ["8", "x=8"], "The 3 multiplies both terms: 3x − 6 = 18, so 3x = 24 and x = 8.");
TY("A6", "F", "Solve 5x − 3 = 2x + 9", "x = 4", ["4", "x=4"], "Subtract 2x: 3x − 3 = 9. Add 3: 3x = 12, so x = 4.", "a number", 40);
TF("A6", "F", "The solution of x/3 = 6 is x = 2.", false, "Multiply both sides by 3: x = 18.", 15);
OR("A6", "F", "Put the steps in order to solve (2x + 4)/3 = 6.", "first step to last step", ["Multiply both sides by 3: 2x + 4 = 18", "Subtract 4: 2x = 14", "Divide by 2: x = 7"], "Remove the fraction first, then undo the + 4, then the × 2.");
ME("A6", "F", "The angles of a triangle are x, 2x and 3x. Which equation finds x?", ["x + 2x + 3x = 180", "x + 2x + 3x = 360", "x × 2x × 3x = 180", "6x = 90"], "Angles in a triangle add up to 180°: 6x = 180, so x = 30°.", 25);
// A7 Inequalities
MC("A7", "F", "Solve 3x − 4 > 11", ["x > 5", "x < 5", "x > 7/3", "x > 15"], "Add 4: 3x > 15. Divide by 3: x > 5.", 25);
TY("A7", "F", "List the integers n such that −2 < n ≤ 3.", "−1, 0, 1, 2, 3", ["-1,0,1,2,3"], "−2 is not included (<), but 3 is included (≤).", "e.g. 1, 2, 3", 40);
SP("A7", "F", "Solve 5 − 2x ≥ 11", ["Subtract 5: −2x ≥ 6", "Divide by −2: x ≥ −3"], 1,
  ["Divide by −2: x ≤ −3", "Divide by −2: x ≥ 3", "Divide by −2: x ≤ 3"], "x ≤ −3", ["x≤-3", "x<=-3"],
  "Dividing an inequality by a negative number reverses the sign: x ≤ −3.");
TF("A7", "F", "On a number line, x ≥ 4 is shown with a filled-in circle at 4.", true, "≥ includes 4, so the circle is filled in. An open circle means 4 is not included.", 25);
MC("A7", "F", "Which integers n satisfy 7 ≤ 2n + 1 < 13?", ["3, 4, 5", "3, 4, 5, 6", "4, 5", "2, 3, 4, 5, 6"], "Subtract 1: 6 ≤ 2n < 12. Divide by 2: 3 ≤ n < 6, so n = 3, 4, 5.", 40);
// A8 Sequences
MC("A8", "F", "Find the nth term of 5, 8, 11, 14, …", ["3n + 2", "n + 3", "3n + 5", "5n + 3"], "It goes up by 3, so start with 3n. 3n gives 3, 6, 9…; add 2 to get 5, 8, 11…", 35);
SP("A8", "F", "Find the nth term of 20, 16, 12, 8, …", ["The difference is −4", "So the sequence is based on 4n", "4 × 1 = 4, and 20 − 4 = 16", "nth term = 4n + 16"], 1,
  ["So the sequence is based on −4n", "So the sequence is based on n − 4", "So the sequence is based on 4 − n"], "24 − 4n", ["24-4n", "-4n+24"],
  "A difference of −4 means −4n. −4n gives −4, −8, −12…; add 24 to get 20, 16, 12… So the nth term is 24 − 4n.", 55);
TY("A8", "F", "The nth term of a sequence is 2n² + 1. Find the 5th term.", "51", ["51"], "2 × 5² + 1 = 2 × 25 + 1 = 51.", "a number", 30);
TF("A8", "F", "The 100th term of 7, 12, 17, 22, … is 502.", true, "The nth term is 5n + 2, so the 100th term is 500 + 2 = 502.", 35);
MC("A8", "H", "Find the nth term of 2, 9, 18, 29, …", ["n² + 4n − 3", "2n² + 7", "n² + 7n", "n² + 4n + 1"], "The second difference is 2, so it starts n². Subtract n² to leave 1, 5, 9, 13, which is 4n − 3.", 60);
MC("A8", "F", "Which of these is a geometric sequence?", ["3, 6, 12, 24", "3, 6, 9, 12", "1, 4, 9, 16", "1, 1, 2, 3, 5"], "In a geometric sequence each term is multiplied by the same number (here 2). The others add, are square numbers, or are Fibonacci.", 25);
// A9 Straight-line graphs
MC("A9", "F", "What is the gradient of y = 4 − 3x?", ["−3", "4", "3", "−4"], "In y = mx + c, the gradient m is the number multiplying x: −3.", 20);
TY("A9", "F", "Find the gradient of the line through (1, 2) and (4, 11).", "3", ["3"], "Gradient = change in y ÷ change in x = (11 − 2) ÷ (4 − 1) = 9 ÷ 3 = 3.", "a number", 40);
SP("A9", "F", "Find the equation of the line with gradient 2 that passes through (3, 1).", ["y = 2x + c", "1 = 2 × 3 + c", "c = 1 + 6 = 7", "y = 2x + 7"], 2,
  ["c = 1 − 6 = −5", "c = 6 − 1 = 5", "c = 1 ÷ 6"], "y = 2x − 5", ["y=2x-5"], "1 = 6 + c, so c = 1 − 6 = −5. The equation is y = 2x − 5.", 55);
TF("A9", "F", "The lines y = 3x + 1 and y = 3x − 5 are parallel.", true, "Parallel lines have the same gradient. Both have gradient 3.");
MC("A9", "H", "Which line is perpendicular to y = 2x + 3?", ["y = −½x + 1", "y = 2x − 3", "y = −2x + 3", "y = ½x + 3"], "Perpendicular gradients multiply to −1: 2 × −½ = −1.");
MC("A9", "F", "Where does y = 5x − 10 cross the x-axis?", ["(2, 0)", "(0, −10)", "(−2, 0)", "(10, 0)"], "On the x-axis, y = 0: 5x − 10 = 0, so x = 2.");
// A10 Quadratic graphs
MC("A10", "F", "What are the roots of y = (x − 2)(x + 5)?", ["x = 2 and x = −5", "x = −2 and x = 5", "x = 2 and x = 5", "x = −10"], "y = 0 when x − 2 = 0 or x + 5 = 0, so x = 2 or x = −5.");
TF("A10", "F", "The graph of y = x² − 4 crosses the y-axis at (0, −4).", true, "On the y-axis x = 0, so y = 0 − 4 = −4.");
TY("A10", "F", "Find y when x = 4 on the curve y = x² − 3x + 1.", "5", ["5", "y=5"], "16 − 12 + 1 = 5.", "a number", 30);
MC("A10", "F", "Where is the line of symmetry of y = x² + 2x − 8?", ["x = −1", "x = 1", "x = −8", "x = 2"], "The roots are x = −4 and x = 2 (from (x + 4)(x − 2)). The line of symmetry is halfway between them: x = −1.", 45);
ME("A10", "F", "Which method finds where y = x² − 6x + 5 crosses the x-axis?", ["Solve x² − 6x + 5 = 0", "Substitute x = 0", "Find the gradient", "Work out 5 − 6"], "It crosses the x-axis where y = 0. (x − 1)(x − 5) = 0, so x = 1 and x = 5.");
MC("A10", "H", "What are the coordinates of the turning point of y = (x − 3)² + 4?", ["(3, 4)", "(−3, 4)", "(3, −4)", "(4, 3)"], "(x − 3)² is smallest (zero) when x = 3, giving y = 4. So the minimum is at (3, 4).");
// A11 Solving quadratics
MC("A11", "F", "Solve x² − 7x + 12 = 0", ["x = 3 or x = 4", "x = −3 or x = −4", "x = 12", "x = 7 or x = 12"], "(x − 3)(x − 4) = 0, so x = 3 or x = 4.");
SP("A11", "F", "Solve x² = 5x", ["Divide both sides by x: x = 5", "So x = 5 is the only solution"], 0,
  ["Rearrange: x² − 5x = 0, so x(x − 5) = 0", "Square root both sides: x = √(5x)", "Subtract x: x = 4x"], "x = 0 or x = 5", ["0,5", "5,0", "x=0,x=5", "x=5,x=0"],
  "Dividing by x loses the solution x = 0. Factorise instead: x(x − 5) = 0, so x = 0 or x = 5.");
TY("A11", "F", "Solve x² − 16 = 0. Give both solutions.", "x = 4 or x = −4", ["4,-4", "-4,4", "x=4,x=-4", "x=-4,x=4", "±4", "x=±4"], "x² = 16, so x = 4 or x = −4. Don't forget the negative root.", "e.g. 3, −3", 40);
TF("A11", "F", "x² + 3x − 10 = 0 has solutions x = 2 and x = −5.", true, "x² + 3x − 10 = (x + 5)(x − 2), so x = −5 or x = 2.", 30);
OR("A11", "F", "Put the steps in order to solve x² + x − 6 = 0.", "first step to last step", ["Find two numbers that multiply to −6 and add to 1: 3 and −2", "Factorise: (x + 3)(x − 2) = 0", "Set each bracket to zero: x + 3 = 0 or x − 2 = 0", "x = −3 or x = 2"], "Find the pair, factorise, set each bracket to zero, then solve.", 50);
MC("A11", "H", "Solve 2x² + 5x − 3 = 0", ["x = ½ or x = −3", "x = −½ or x = 3", "x = 2 or x = −3", "x = 3 or x = 5"], "2x² + 5x − 3 = (2x − 1)(x + 3), so x = ½ or x = −3.", 50);
// A12 Quadratic formula & completing the square
MC("A12", "H", "Write x² + 6x + 2 in the form (x + a)² + b.", ["(x + 3)² − 7", "(x + 3)² + 2", "(x + 6)² − 34", "(x + 3)² − 11"], "(x + 3)² = x² + 6x + 9. So x² + 6x + 2 = (x + 3)² − 9 + 2 = (x + 3)² − 7.", 45);
SP("A12", "H", "Solve x² + 4x − 1 = 0 using the quadratic formula.", ["a = 1, b = 4, c = −1", "b² − 4ac = 16 − 4 = 12", "x = (−4 ± √12)/2"], 1,
  ["b² − 4ac = 16 + 4 = 20", "b² − 4ac = 16 − 1 = 15", "b² − 4ac = 8 + 4 = 12"], "x = 0.24 or x = −4.24 (2 d.p.)", ["0.24,-4.24", "-4.24,0.24", "x=0.24,x=-4.24", "x=-4.24,x=0.24"],
  "c = −1, so −4ac = −4 × 1 × (−1) = +4. b² − 4ac = 20, so x = (−4 ± √20)/2 = −2 ± √5.", 75);
TY("A12", "H", "How many real solutions does x² + 2x + 5 = 0 have?", "0", ["0", "none", "no"], "b² − 4ac = 4 − 20 = −16. It is negative, so there are no real solutions.", "a number", 45);
TF("A12", "H", "The minimum point of y = (x − 4)² − 9 is (4, −9).", true, "(x − 4)² is smallest (zero) when x = 4, so the minimum value is −9 at x = 4.", 25);
ME("A12", "H", "Which method solves x² + 3x − 7 = 0?", ["Use the quadratic formula, because it doesn't factorise", "Factorise into (x + 7)(x − 1)", "Square root both sides", "Divide every term by x"], "No two whole numbers multiply to −7 and add to 3, so use the formula: x = (−3 ± √37)/2.");
MC("A12", "H", "x² − 10x + 18 = (x − a)² − b. Find a and b.", ["a = 5, b = 7", "a = 10, b = 82", "a = 5, b = −7", "a = 5, b = 43"], "(x − 5)² = x² − 10x + 25. So x² − 10x + 18 = (x − 5)² − 25 + 18 = (x − 5)² − 7.", 50);
// A13 Simultaneous equations
MC("A13", "F", "Solve x + y = 10 and x − y = 4", ["x = 7, y = 3", "x = 3, y = 7", "x = 6, y = 4", "x = 14, y = −4"], "Add the equations: 2x = 14, so x = 7. Then y = 10 − 7 = 3.", 40);
SP("A13", "F", "Solve 2x + y = 11 and x + y = 7", ["Subtract the equations: x = 4", "Substitute: 4 + y = 7", "y = 11"], 2,
  ["y = 3", "y = −3", "y = 7/4"], "x = 4, y = 3", ["x=4,y=3", "y=3,x=4", "4,3"], "4 + y = 7 means y = 3. Check: 2 × 4 + 3 = 11.", 50);
TY("A13", "F", "3 pens and 2 rulers cost £1.80. 1 pen and 2 rulers cost £1.00. Find the cost of one pen in pence.", "40p", ["40", "0.40", "0.4"], "Subtract: 2 pens cost 80p, so one pen costs 40p.", "a number", 55);
TF("A13", "H", "The line y = x + 1 and the curve y = x² − 1 meet where x² − x − 2 = 0.", true, "Set them equal: x² − 1 = x + 1, so x² − x − 2 = 0. This gives x = 2 or x = −1.", 40);
ME("A13", "F", "Which first step eliminates y from 3x + 2y = 16 and 5x − 2y = 0?", ["Add the two equations", "Subtract the two equations", "Multiply the first equation by 5", "Divide both equations by 2"], "+2y and −2y cancel when you add: 8x = 16, so x = 2.");
MC("A13", "H", "Solve y = 2x and x² + y² = 20", ["x = 2, y = 4 or x = −2, y = −4", "x = 2, y = 4 only", "x = 4, y = 2 or x = −4, y = −2", "x = ±2, y = 4"], "Substitute: x² + 4x² = 20, so x² = 4 and x = ±2. Then y = 2x gives y = 4 or y = −4.", 60);
// A14 Functions
MC("A14", "H", "f(x) = 3x − 1. Find f(4).", ["11", "12", "3", "13"], "f(4) = 3 × 4 − 1 = 11.", 20);
TY("A14", "H", "f(x) = 2x + 5. Find f⁻¹(x).", "(x − 5)/2", ["(x-5)/2", "f-1(x)=(x-5)/2", "y=(x-5)/2"], "Write y = 2x + 5 and make x the subject: x = (y − 5)/2. So f⁻¹(x) = (x − 5)/2.", "e.g. (x + 1)/3", 45);
SP("A14", "H", "f(x) = x² and g(x) = x + 3. Find fg(2).", ["fg(2) means do f first: f(2) = 4", "g(4) = 7", "fg(2) = 7"], 0,
  ["fg(2) means do g first: g(2) = 5", "fg(2) means f × g: 4 × 5", "fg(2) means add them: 4 + 5"], "25", ["25"], "In fg(x), g is applied first (it is next to x): g(2) = 5, then f(5) = 25.", 50);
TF("A14", "H", "If f(x) = 5x, then f⁻¹(x) = x/5.", true, "The inverse undoes the function: multiplying by 5 is undone by dividing by 5.", 20);
ME("A14", "H", "Which method finds the inverse of f(x) = (x + 1)/4?", ["Write y = (x + 1)/4 and make x the subject", "Work out 1/f(x)", "Work out f(−x)", "Multiply f(x) by −1"], "Rearranging gives x = 4y − 1, so f⁻¹(x) = 4x − 1.");
MC("A14", "H", "f(x) = 2x and g(x) = x − 7. Find gf(x).", ["2x − 7", "2x − 14", "2(x − 7)", "x² − 7"], "gf(x) means apply f first, then g: g(2x) = 2x − 7.", 35);
// A15 Algebraic proof
MC("A15", "H", "n is an integer. Which expression is always odd?", ["2n + 1", "2n", "n + 1", "3n"], "2n is always even, so 2n + 1 is always odd. The others depend on n.", 25);
TF("A15", "H", "(n + 1)² − (n − 1)² = 4n for every value of n.", true, "(n² + 2n + 1) − (n² − 2n + 1) = 4n.", 40);
SP("A15", "H", "Prove that the sum of two consecutive integers is odd.", ["Let the integers be n and n + 1", "Sum = 2n + 1", "2n is even, so 2n + 1 is even"], 2,
  ["2n is even, so 2n + 1 is odd", "2n is odd, so 2n + 1 is even", "n is even, so 2n + 1 is odd"], "The sum is odd", null, "2n is always even, and an even number plus 1 is odd.", 40);
ME("A15", "H", "How should a proof that the product of two odd numbers is odd begin?", ["Write the odd numbers as 2a + 1 and 2b + 1", "Show that 3 × 5 = 15", "Write the odd numbers as 2a and 2b", "Write them as n and n + 1"], "Examples don't prove it for every number. (2a + 1)(2b + 1) = 2(2ab + a + b) + 1, which is odd.");
MC("A15", "H", "Which of these is an identity (true for every x)?", ["2(x + 3) ≡ 2x + 6", "2x + 3 = 9", "x² = 4", "x + 1 = 2x"], "An identity is true for every value. The others are equations, true only for some values of x.", 25);
TY("A15", "H", "(x + 4)² − (x + 2)² = ax + b. Find the value of a.", "4", ["4", "a=4"], "x² + 8x + 16 − (x² + 4x + 4) = 4x + 12, so a = 4 (and b = 12).", "a number", 50);
// A16 Algebraic fractions
MC("A16", "H", "Simplify (x² − 9)/(x + 3)", ["x − 3", "x + 3", "x − 9", "x² − 3"], "x² − 9 = (x + 3)(x − 3). Cancel (x + 3) to leave x − 3.", 35);
SP("A16", "H", "Write 2/x + 3/(x + 1) as a single fraction.", ["Common denominator: x(x + 1)", "= (2(x + 1) + 3x)/(x(x + 1))", "= (2x + 1 + 3x)/(x(x + 1))", "= (5x + 1)/(x(x + 1))"], 2,
  ["= (2x + 2 + 3x)/(x(x + 1))", "= (2x + 3x)/(x(x + 1))", "= 5/(2x + 1)"], "(5x + 2)/(x(x + 1))", ["(5x+2)/(x(x+1))", "(5x+2)/(x2+x)"], "2(x + 1) = 2x + 2, so the top is 5x + 2.", 60);
TF("A16", "H", "x/3 + x/4 = 2x/7", false, "Use a common denominator: 4x/12 + 3x/12 = 7x/12.", 30);
TY("A16", "H", "Solve 6/x = 3", "x = 2", ["2", "x=2"], "Multiply both sides by x: 6 = 3x, so x = 2.", "a number", 25);
MC("A16", "H", "Simplify (x² + 5x + 6)/(x² + 3x + 2)", ["(x + 3)/(x + 1)", "(5x + 6)/(3x + 2)", "3", "(x + 2)/(x + 1)"], "(x + 2)(x + 3) over (x + 1)(x + 2). Cancel (x + 2) to get (x + 3)/(x + 1).", 55);
ME("A16", "H", "Which is the best first step to solve 3/(x − 1) = 2/(x + 2)?", ["Multiply both sides by (x − 1)(x + 2)", "Add the numerators", "Square both sides", "Subtract 3 from both sides"], "This clears the fractions: 3(x + 2) = 2(x − 1), so 3x + 6 = 2x − 2 and x = −8.");
// A17 Iteration
MC("A17", "H", "x₍ₙ₊₁₎ = 2 + 1/xₙ and x₀ = 2. Find x₁.", ["2.5", "3", "1.5", "0.5"], "x₁ = 2 + 1/2 = 2.5.", 30);
TY("A17", "H", "x₍ₙ₊₁₎ = √(xₙ + 6) and x₀ = 2. Find x₁ to 2 decimal places.", "2.83", ["2.83"], "x₁ = √(2 + 6) = √8 = 2.828… = 2.83 (2 d.p.).", "e.g. 1.25", 45);
TF("A17", "H", "f(x) = x³ + x − 5 changes sign between x = 1 and x = 2, so f(x) = 0 has a root between 1 and 2.", true, "f(1) = −3 and f(2) = 5. A sign change shows the curve crosses zero between them.", 35);
SP("A17", "H", "Show that x³ − 2x − 5 = 0 has a root between 2 and 3.", ["When x = 2: 8 − 4 − 5 = −1", "When x = 3: 27 − 6 − 5 = 16", "Both values are positive, so there is no root"], 2,
  ["There is a sign change, so there is a root between 2 and 3", "Both values are negative, so there is a root", "The values are different, so there is no root"], "There is a root between 2 and 3", null,
  "−1 is negative and 16 is positive. A sign change means the curve crosses zero, so there is a root.", 50);
ME("A17", "H", "Which rearrangement of x³ + 4x − 1 = 0 gives an iteration formula?", ["x = (1 − x³)/4", "x = x³ + 4x − 1", "x = 4/(1 − x³)", "x = 1 + x³ + 4"], "4x = 1 − x³, so x = (1 − x³)/4. This gives x₍ₙ₊₁₎ = (1 − xₙ³)/4.", 40);
// A18 Cubic, reciprocal & other graphs
MC("A18", "F", "Which equation gives a reciprocal graph?", ["y = 1/x", "y = x³", "y = 2ˣ", "y = x² + 1"], "y = 1/x is the reciprocal graph: two curves that never touch the axes.", 20);
TF("A18", "H", "The graph of y = 2ˣ passes through (0, 1).", true, "2⁰ = 1, so when x = 0, y = 1.");
MC("A18", "F", "What shape is the graph of y = x³ − 2?", ["An S-shaped cubic curve", "A straight line", "A U-shaped parabola", "Two separate curves"], "The highest power is x³, so it is a cubic: an S-shaped curve.", 25);
TY("A18", "F", "Find y when x = 3 on the curve y = x³ − 4x.", "15", ["15", "y=15"], "3³ − 4 × 3 = 27 − 12 = 15.", "a number", 30);
MC("A18", "H", "For 0° ≤ x ≤ 360°, where is the maximum of y = sin x?", ["x = 90°", "x = 180°", "x = 0°", "x = 270°"], "sin 90° = 1, the largest value sin can take.", 25);
TF("A18", "H", "The graph of y = cos x passes through (90°, 1).", false, "cos 90° = 0, so it passes through (90°, 0). It passes through (0°, 1).");
// A19 Circles & tangents
MC("A19", "H", "What is the radius of the circle x² + y² = 49?", ["7", "49", "24.5", "14"], "x² + y² = r², so r² = 49 and r = 7.", 20);
TF("A19", "H", "The point (3, 4) lies on the circle x² + y² = 25.", true, "3² + 4² = 9 + 16 = 25.", 25);
SP("A19", "H", "Find the gradient of the tangent to x² + y² = 25 at (3, 4).", ["Gradient of the radius to (3, 4) = 4/3", "The tangent is parallel to the radius", "Tangent gradient = 4/3"], 1,
  ["The tangent is perpendicular to the radius", "The tangent goes through the centre", "The tangent has gradient 0"], "−3/4", ["-3/4", "-0.75"],
  "A tangent meets the radius at 90°. The perpendicular gradient to 4/3 is −3/4.", 50);
TY("A19", "H", "A circle has centre (0, 0) and passes through (6, 8). What is its radius?", "10", ["10"], "r = √(6² + 8²) = √100 = 10.", "a number", 35);
ME("A19", "H", "Which method finds the tangent to x² + y² = 10 at (1, 3)?", ["Find the radius gradient (3), then use gradient −1/3 through (1, 3)", "Use gradient 3 through (1, 3)", "Use gradient 10 through (0, 0)", "Use gradient 1/3 through (0, 0)"], "The tangent is perpendicular to the radius. Gradient −1/3 through (1, 3) gives y − 3 = −⅓(x − 1), or x + 3y = 10.", 45);
// A20 Real-life & motion graphs
MC("A20", "F", "On a distance–time graph, what does a horizontal line show?", ["Not moving", "Constant speed", "Speeding up", "Going backwards"], "The distance isn't changing as time passes, so the object is stationary.", 20);
TY("A20", "F", "A distance–time graph is a straight line from (0, 0) to (4 hours, 240 km). What is the speed in km/h?", "60 km/h", ["60"], "Speed = gradient = 240 ÷ 4 = 60 km/h.", "a number", 35);
TF("A20", "H", "On a velocity–time graph, the area under the graph gives the distance travelled.", true, "Area = velocity × time = distance.");
SP("A20", "F", "A taxi charges £3 plus £2 per mile. Find the cost of a 7-mile journey.", ["Cost = 3 + 2 × miles", "Cost = 3 + 2 × 7", "= 5 × 7 = £35"], 2,
  ["= 3 + 14 = £17", "= 3 × 2 + 7 = £13", "= 2 + 3 × 7 = £23"], "£17", ["17"], "Multiply before adding: 2 × 7 = 14, then 3 + 14 = £17.");
MC("A20", "H", "A velocity–time graph rises steadily from 0 to 20 m/s in 5 seconds. What is the acceleration?", ["4 m/s²", "100 m/s²", "0.25 m/s²", "15 m/s²"], "Acceleration = gradient = 20 ÷ 5 = 4 m/s².");
ME("A20", "F", "How do you find the speed from a straight-line distance–time graph?", ["Work out the gradient: distance ÷ time", "Find the area under the graph", "Read off the highest point", "Add the distance and the time"], "Speed = distance ÷ time, which is the gradient of the line.", 25);
// A21 Quadratic inequalities
MC("A21", "H", "Solve x² < 25", ["−5 < x < 5", "x < 5", "x < −5 or x > 5", "x < ±5"], "x² < 25 between the roots −5 and 5, so −5 < x < 5.", 35);
TF("A21", "H", "The solution of x² − 9 > 0 is x < −3 or x > 3.", true, "y = x² − 9 is above the x-axis outside its roots, −3 and 3.", 30);
SP("A21", "H", "Solve x² − 2x − 8 ≤ 0", ["(x − 4)(x + 2) ≤ 0", "Critical values: x = 4 and x = −2", "x ≤ −2 or x ≥ 4"], 2,
  ["−2 ≤ x ≤ 4", "x ≤ 4", "−4 ≤ x ≤ 2"], "−2 ≤ x ≤ 4", ["-2≤x≤4", "-2<=x<=4"],
  "The parabola is below or on the x-axis (≤ 0) between its roots, so −2 ≤ x ≤ 4.", 55);
ME("A21", "H", "Which method helps you solve a quadratic inequality?", ["Sketch the graph and see where it is above or below the x-axis", "Divide both sides by x", "Square root both sides only", "Check x = 0 only"], "Find the roots, sketch the U-shape, then read off where it is above (> 0) or below (< 0) the axis.");
TY("A21", "H", "How many integers satisfy x² ≤ 4?", "5", ["5"], "−2 ≤ x ≤ 2, so the integers are −2, −1, 0, 1, 2.", "a number", 35);
// A22 Graph transformations
MC("A22", "H", "What does y = f(x) + 3 do to the graph of y = f(x)?", ["Moves it up 3", "Moves it down 3", "Moves it left 3", "Moves it right 3"], "Adding 3 outside the function adds 3 to every y-value.", 25);
MC("A22", "H", "y = f(x − 2) is a translation of y = f(x) by…", ["2 to the right", "2 to the left", "2 up", "2 down"], "Inside the bracket the change is the opposite way: x − 2 moves the graph 2 to the right.", 25);
TF("A22", "H", "y = −f(x) is a reflection of y = f(x) in the x-axis.", true, "Every y-value changes sign, which flips the graph over the x-axis.");
TY("A22", "H", "y = x² is translated 3 units to the right. Its turning point moves from (0, 0) to (a, 0). Find a.", "3", ["3", "a=3"], "The new graph is y = (x − 3)², with its turning point at (3, 0).", "a number", 30);
SP("A22", "H", "y = f(x) has a maximum at (2, 5). Find the maximum of y = f(x + 1).", ["f(x + 1) is a translation 1 to the right", "The maximum moves to (3, 5)"], 0,
  ["f(x + 1) is a translation 1 to the left", "f(x + 1) is a translation 1 up", "f(x + 1) is a stretch by factor 1"], "(1, 5)", ["(1,5)", "1,5"],
  "Adding inside the bracket moves the graph left: (2 − 1, 5) = (1, 5).", 45);
