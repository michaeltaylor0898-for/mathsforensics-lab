/* ---------- PROBABILITY ---------- */
// P1 Probability basics
MC("P1", "F", "A fair dice is rolled. What is the probability of a number greater than 4?", ["1/3", "1/2", "2/3", "1/6"], "5 and 6 are greater than 4: 2 out of 6 = 1/3.", 25);
TY("P1", "F", "The probability that it rains tomorrow is 0.35. What is the probability that it does not rain?", "0.65", ["0.65", "65/100", "13/20"], "The probabilities add up to 1: 1 − 0.35 = 0.65.", "a decimal", 30);
TF("P1", "F", "An event can have a probability of 1.2.", false, "Probabilities are always between 0 (impossible) and 1 (certain).", 15);
SP("P1", "F", "A bag has 3 red, 5 blue and 2 green counters. Find P(blue).", ["Total counters = 3 + 5 + 2 = 10", "P(blue) = 5/3"], 1,
  ["P(blue) = 5/10 = 1/2", "P(blue) = 5/5 = 1", "P(blue) = 3/10"], "1/2", ["1/2", "0.5", "5/10"], "Probability = number of blue ÷ total number of counters = 5/10 = 1/2.", 35);
OR("P1", "F", "Put these events in order, from least likely to most likely.", "least likely to most likely", ["Rolling a 7 on an ordinary dice", "Rolling a 6 on an ordinary dice", "A fair coin landing on heads", "The sun rising tomorrow"], "The probabilities are 0, 1/6, 1/2 and almost 1.");
MC("P1", "F", "A spinner lands on red, blue or yellow with probabilities 0.3, 0.45 and x. Find x.", ["0.25", "0.75", "0.15", "0.35"], "The probabilities add up to 1: 1 − 0.3 − 0.45 = 0.25.", 30);
// P2 Relative frequency & expected outcomes
MC("P2", "F", "A fair dice is rolled 300 times. How many 6s would you expect?", ["50", "60", "6", "300"], "Expected = probability × number of trials = 1/6 × 300 = 50.", 25);
TY("P2", "F", "A drawing pin lands point up 36 times in 120 throws. What is the relative frequency of landing point up, as a decimal?", "0.3", ["0.3", "3/10", "36/120"], "Relative frequency = 36 ÷ 120 = 0.3.", "a decimal", 40);
TF("P2", "F", "Doing more trials gives a more reliable estimate of a probability.", true, "The relative frequency settles down closer to the true probability as the number of trials increases.");
SP("P2", "F", "The probability of winning a game is 0.15. How many wins would you expect in 400 games?", ["Expected wins = probability × number of games", "= 0.15 + 400 = 400.15"], 1,
  ["= 0.15 × 400 = 60", "= 400 ÷ 0.15 = 2667", "= 0.15 × 100 = 15"], "60", ["60"], "Multiply, don't add: 0.15 × 400 = 60 wins.", 35);
ME("P2", "F", "A coin lands on heads 70 times in 100 throws. Which is the best conclusion?", ["It may be biased, so throw it more times to check", "It is definitely fair", "It will land on heads next time", "Heads will always come up exactly 70% of the time"], "70 is a lot more than the expected 50, which suggests bias, but more trials would give stronger evidence.", 35);
// P3 Sample spaces
MC("P3", "F", "Two coins are flipped. How many possible outcomes are there?", ["4", "2", "3", "8"], "HH, HT, TH and TT: 2 × 2 = 4 outcomes.", 20);
TY("P3", "F", "Two fair dice are rolled and the scores added. What is the probability of a total of 7? Give a fraction.", "1/6", ["1/6", "6/36"], "6 of the 36 outcomes total 7: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1). 6/36 = 1/6.", "e.g. 1/4", 50);
TF("P3", "F", "When two dice are rolled, a total of 2 and a total of 12 are equally likely.", true, "Each can happen only one way, (1,1) or (6,6), so both have probability 1/36.", 30);
SP("P3", "F", "One spinner shows 1–3 and another shows 1–4. Both are spun. Find P(both show the same number).", ["There are 3 + 4 = 7 outcomes", "The same number: (1,1), (2,2), (3,3)", "P = 3/7"], 0,
  ["There are 3 × 4 = 12 outcomes", "There are 4 outcomes", "There are 3 outcomes"], "1/4", ["1/4", "3/12", "0.25"], "Multiply to count combined outcomes: 3 × 4 = 12. So P = 3/12 = 1/4.", 50);
MC("P3", "F", "Two ordinary dice are rolled. How many outcomes are there in the sample space?", ["36", "12", "6", "11"], "6 outcomes for the first dice × 6 for the second = 36.", 20);
// P4 Tree diagrams & independent events
MC("P4", "F", "A and B are independent. P(A) = 0.4 and P(B) = 0.5. Find P(A and B).", ["0.2", "0.9", "0.1", "0.45"], "For independent events, multiply: 0.4 × 0.5 = 0.2.", 30);
SP("P4", "F", "A fair coin is flipped twice. Find P(two heads).", ["P(H) = 1/2", "P(H and H) = 1/2 + 1/2 = 1"], 1,
  ["P(H and H) = 1/2 × 1/2 = 1/4", "P(H and H) = 1/2", "P(H and H) = 2/4"], "1/4", ["1/4", "0.25"], "'And' means multiply along the branches: 1/2 × 1/2 = 1/4. A probability of 1 would mean it always happens.", 35);
TY("P4", "F", "The probability of passing each of two independent tests is 0.7. Find the probability of failing both.", "0.09", ["0.09"], "P(fail) = 0.3 for each, so P(fail both) = 0.3 × 0.3 = 0.09.", "a decimal", 45);
TF("P4", "F", "On a tree diagram, you multiply along the branches and add the results for different routes.", true, "Multiply for 'and' along a route; add for 'or' between routes.", 25);
ME("P4", "F", "The probability of rain is 0.2 each day, independently. Which gives P(rain on exactly one of two days)?", ["0.2 × 0.8 + 0.8 × 0.2", "0.2 × 0.8", "0.2 + 0.8", "0.2 × 0.2"], "Rain then dry, or dry then rain: 0.16 + 0.16 = 0.32.", 40);
// P5 Conditional probability
MC("P5", "H", "A bag has 4 red and 6 blue balls. Two are taken without replacement. Find P(both red).", ["2/15", "4/25", "1/5", "16/100"], "4/10 × 3/9 = 12/90 = 2/15. After one red is taken, 3 reds are left out of 9.", 50);
SP("P5", "H", "A bag has 5 green and 3 yellow sweets. Two are eaten one after the other. Find P(both green).", ["P(first green) = 5/8", "P(second green) = 5/8", "P(both green) = 25/64"], 1,
  ["P(second green) = 4/7", "P(second green) = 4/8", "P(second green) = 5/7"], "5/14", ["5/14", "20/56"], "Without replacement there are 4 green out of 7 left: 5/8 × 4/7 = 20/56 = 5/14.", 55);
TY("P5", "H", "In a class of 30, 18 students study French, and 12 of those also study Spanish. A French student is picked at random. Find P(they study Spanish).", "2/3", ["2/3", "12/18"], "Only the 18 French students count: 12/18 = 2/3.", "e.g. 1/4", 50);
TF("P5", "H", "When items are taken without replacement, the probabilities on the second set of branches change.", true, "The first item isn't put back, so there is one fewer item and the counts change.", 25);
ME("P5", "H", "Which gives P(A given B)?", ["P(A and B) ÷ P(B)", "P(A) × P(B)", "P(A) + P(B)", "P(B) ÷ P(A)"], "Given B means only look at the outcomes in B: P(A | B) = P(A ∩ B) ÷ P(B).", 30);
// P6 Venn diagrams & sets
MC("P6", "F", "ξ = {1, 2, …, 10}. A = even numbers, B = multiples of 3. What is A ∩ B?", ["{6}", "{2, 3, 4, 6, 8, 9, 10}", "{3, 9}", "{6, 12}"], "∩ means in both. The only even multiple of 3 up to 10 is 6.", 40);
TF("P6", "F", "A ∪ B means the elements in A or B or both.", true, "∪ is the union: everything in either set. ∩ is the intersection: only what is in both.", 20);
TY("P6", "F", "Of 40 students, 25 like tea, 20 like coffee and 8 like both. How many like neither?", "3", ["3"], "Tea or coffee = 25 + 20 − 8 = 37. Neither = 40 − 37 = 3.", "a number", 50);
SP("P6", "F", "Of 30 people, 18 have a dog, 15 have a cat and 7 have both. How many have only a dog?", ["Only a dog = 18 + 7", "= 25"], 0,
  ["Only a dog = 18 − 7 = 11", "Only a dog = 18 − 15 = 3", "Only a dog = 30 − 18 = 12"], "11", ["11"], "The 7 with both are already inside the 18, so subtract them: 18 − 7 = 11.", 40);
MC("P6", "F", "What does A′ mean?", ["Everything not in A", "Everything in A", "A and B", "The empty set"], "A′ is the complement of A: everything in ξ that is not in A.", 20);

/* ---------- STATISTICS ---------- */
// S1 Averages & range
MC("S1", "F", "Find the median of 7, 3, 9, 4, 12.", ["7", "9", "4", "8"], "Put them in order: 3, 4, 7, 9, 12. The middle value is 7.", 25);
SP("S1", "F", "Find the mean of 4, 8, 9, 3, 6.", ["Total = 4 + 8 + 9 + 3 + 6 = 30", "Mean = 30 ÷ 6 = 5"], 1,
  ["Mean = 30 ÷ 5 = 6", "Mean = 30 ÷ 2 = 15", "Mean = 30 − 5 = 25"], "6", ["6"], "Divide by how many numbers there are (5), not by the last number: 30 ÷ 5 = 6.", 35);
TY("S1", "F", "Find the range of 15, 22, 8, 31, 19.", "23", ["23"], "Range = largest − smallest = 31 − 8 = 23.", "a number", 25);
TF("S1", "F", "The mode is the value that appears most often.", true, "The mode is the most common value.", 15);
MC("S1", "F", "Find the median of 2, 5, 6, 9, 10, 14.", ["7.5", "6", "9", "7"], "With 6 values the median is halfway between the 3rd and 4th: (6 + 9) ÷ 2 = 7.5.", 30);
ME("S1", "F", "The mean of 5 numbers is 12. Four of them are 10, 11, 14 and 9. Which finds the fifth number?", ["5 × 12 − (10 + 11 + 14 + 9)", "12 − (10 + 11 + 14 + 9)", "(10 + 11 + 14 + 9) ÷ 4", "5 × 12"], "The total of all 5 is 5 × 12 = 60. The four add to 44, so the fifth is 16.", 40);
// S2 Averages from frequency tables
MC("S2", "F", "Scores of 1, 2 and 3 have frequencies 4, 5 and 1. What is the mode?", ["2", "5", "3", "10"], "The mode is the score with the highest frequency: score 2 (5 times). 5 is the frequency, not the score.", 25);
SP("S2", "F", "Goals scored 0, 1 and 2 have frequencies 3, 5 and 2. Find the mean number of goals.", ["Total goals = 0×3 + 1×5 + 2×2 = 9", "Number of matches = 3 + 5 + 2 = 10", "Mean = 9 ÷ 3 = 3"], 2,
  ["Mean = 9 ÷ 10 = 0.9", "Mean = 10 ÷ 9 = 1.1", "Mean = 9 ÷ 2 = 4.5"], "0.9", ["0.9"], "Divide by the total frequency (10 matches), not by the number of rows.", 50);
TY("S2", "F", "Values 10, 20 and 30 have frequencies 1, 2 and 2. Find the mean.", "22", ["22"], "Total = 10 + 40 + 60 = 110. Number of values = 5. Mean = 110 ÷ 5 = 22.", "a number", 45);
TF("S2", "F", "Using midpoints with grouped data gives an estimate of the mean, not the exact mean.", true, "You don't know the exact values in each group, so the midpoint stands in for them.", 25);
ME("S2", "F", "In grouped data, the class 0 < t ≤ 10 has frequency 6. What do you multiply 6 by to estimate that class's total?", ["5, the midpoint", "10, the upper limit", "0, the lower limit", "6, the frequency"], "Use the midpoint of the class: (0 + 10) ÷ 2 = 5.", 30);
MC("S2", "F", "Shoe sizes 4, 5, 6 and 7 have frequencies 3, 6, 8 and 3 (20 people). Which size is the median?", ["Size 6", "Size 5", "Size 7", "Size 4"], "The median is between the 10th and 11th values. Running totals: 3, 9, 17. Both the 10th and 11th are size 6.", 45);
// S3 Charts & two-way tables
MC("S3", "F", "In a pie chart showing 60 people, how many degrees represent 1 person?", ["6°", "60°", "1°", "3.6°"], "360° ÷ 60 = 6° per person.", 25);
TY("S3", "F", "In a pie chart of 120 students, the sector for 'walk' is 90°. How many students walk?", "30", ["30"], "90° is a quarter of 360°, and a quarter of 120 is 30.", "a number", 35);
TF("S3", "F", "In a two-way table, each row total equals the sum of the numbers in that row.", true, "Row and column totals are found by adding, and they all add up to the grand total.", 20);
SP("S3", "F", "A pie chart shows 45 cats out of 180 pets. Find the angle for cats.", ["Fraction = 45/180 = 1/4", "Angle = 1/4 × 100 = 25°"], 1,
  ["Angle = 1/4 × 360 = 90°", "Angle = 45 × 360 = 16 200°", "Angle = 1/4 × 180 = 45°"], "90°", ["90"], "A pie chart is a full circle, 360°, not 100: 1/4 × 360 = 90°.", 35);
ME("S3", "F", "Which chart best shows how a temperature changes during a day?", ["A line graph", "A pie chart", "A Venn diagram", "A pictogram"], "A line graph shows change over time.", 20);
// S4 Scatter graphs & correlation
MC("S4", "F", "As hours of revision go up, test scores go up. This shows…", ["Positive correlation", "Negative correlation", "No correlation", "Proof that revision causes higher scores"], "Both values increase together, which is positive correlation.", 20);
TF("S4", "F", "Strong correlation proves that one thing causes the other.", false, "Correlation shows a relationship, not cause. Ice-cream sales and sunburn are correlated, but one doesn't cause the other.");
MC("S4", "F", "Which pair is most likely to show negative correlation?", ["A car's age and its value", "Height and shoe size", "Temperature and ice-cream sales", "Revision time and test score"], "As a car gets older, its value usually goes down.", 25);
ME("S4", "F", "How should you estimate a value from a scatter graph?", ["Draw a line of best fit and read from it, inside the range of the data", "Join the first and last points", "Use the highest point", "Average the labels on the axes"], "A line of best fit follows the trend. Readings inside the data range are more reliable.", 30);
TF("S4", "F", "Using a line of best fit far outside the range of the data can be unreliable.", true, "This is extrapolation: the trend may not continue beyond the data.", 25);
// S5 Sampling & types of data
MC("S5", "F", "Which of these is discrete data?", ["The number of pupils in a class", "Height", "The time to run 100 m", "The mass of an apple"], "Discrete data can only take certain values, like whole numbers of pupils. The others are measured, so they are continuous.", 25);
TF("S5", "F", "A larger random sample is usually more reliable.", true, "A bigger random sample is more likely to represent the whole population.", 15);
MC("S5", "F", "Asking only your friends about the school canteen gives a sample that is…", ["Biased", "Random", "Stratified", "Complete"], "Friends aren't representative of the whole school, so the sample is biased.", 20);
TY("S5", "H", "A school has 300 students in Year 10 and 200 in Year 11. A stratified sample of 50 is taken. How many should come from Year 10?", "30", ["30"], "Year 10 is 300/500 = 3/5 of the school: 3/5 × 50 = 30.", "a number", 45);
ME("S5", "F", "Which gives a simple random sample of 20 students from 400?", ["Number them 1–400 and pick 20 using random numbers", "Pick the first 20 names on the register", "Ask 20 students in the library", "Pick 20 of your friends"], "Every student must have the same chance of being chosen.", 30);
// S6 Cumulative frequency & box plots
MC("S6", "H", "What is the interquartile range?", ["Upper quartile − lower quartile", "Largest − smallest", "Median − lower quartile", "Mean − median"], "IQR = UQ − LQ: the spread of the middle 50% of the data.", 20);
TY("S6", "H", "The lower quartile is 24 and the upper quartile is 41. Find the IQR.", "17", ["17"], "IQR = 41 − 24 = 17.", "a number", 25);
TF("S6", "H", "On a cumulative frequency graph of 80 values, you read the median at a cumulative frequency of 40.", true, "The median is halfway through the data: ½ × 80 = 40.", 30);
SP("S6", "H", "A box plot shows minimum 5, lower quartile 12, median 18, upper quartile 25 and maximum 40. Find the IQR.", ["IQR = maximum − minimum", "= 40 − 5 = 35"], 0,
  ["IQR = upper quartile − lower quartile = 25 − 12 = 13", "IQR = median − lower quartile = 18 − 12 = 6", "IQR = maximum − median = 40 − 18 = 22"], "13", ["13"], "Maximum − minimum is the range. The IQR is UQ − LQ = 25 − 12 = 13.", 40);
ME("S6", "H", "Which comparison should you make between two box plots?", ["Compare the medians and the IQRs, in context", "Compare only the maximums", "Compare the lengths of the whiskers only", "Add the medians together"], "Compare an average (the median) and a measure of spread (the IQR), and say what they mean in context.", 35);
// S7 Histograms
MC("S7", "H", "In a histogram, the frequency of a class equals…", ["frequency density × class width", "the height of the bar", "class width ÷ frequency density", "frequency density + class width"], "In a histogram the area of a bar shows the frequency: frequency density × class width.", 25);
TY("S7", "H", "The class 10 < x ≤ 30 has frequency 50. Find its frequency density.", "2.5", ["2.5"], "Frequency density = frequency ÷ class width = 50 ÷ 20 = 2.5.", "a number", 35);
SP("S7", "H", "The class 0 < t ≤ 5 has frequency 15. Find its frequency density.", ["Frequency density = class width ÷ frequency", "= 5 ÷ 15 = 0.33"], 0,
  ["Frequency density = frequency ÷ class width = 15 ÷ 5 = 3", "Frequency density = frequency × class width = 75", "Frequency density = frequency = 15"], "3", ["3"], "It is the other way round: frequency density = frequency ÷ class width = 3.", 40);
TF("S7", "H", "In a histogram, the area of each bar represents the frequency.", true, "That's why bars of different widths can be compared fairly.", 20);
MC("S7", "H", "A histogram bar has frequency density 4 and class width 15. What is its frequency?", ["60", "19", "3.75", "11"], "Frequency = frequency density × class width = 4 × 15 = 60.", 25);
