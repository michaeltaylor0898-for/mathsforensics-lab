import json
x,y,k,t,n,w='<i>x</i>','<i>y</i>','<i>k</i>','<i>t</i>','<i>n</i>','<i>w</i>'
MU="https://lab.mathsforensics.com/written/"
NEXT={"title":"Practise every GCSE topic in the Lab","text":"New numbers every time, feedback that names the mistake behind each wrong answer, and handwritten working marked like an examiner. Start free.","url":"https://www.mathsforensics.com/the-lab"}
LV={"s":"grades 4–5","e":"grades 6–7","m":"grades 8–9"}
def Q(text,marks,ans,work=None,lines=None,label="Answer",tip=None,tampered=None,eqs=None):
    q={"text":text if isinstance(text,list) else [text],"marks":marks,"lines":lines or max(2,marks),"answer":ans}
    if label is not None: q["answer_label"]=label
    for kk,v in (("working",work),("tip",tip),("tampered",tampered),("eqs",eqs)):
        if v: q[kk]=v
    return q
def sheet(code,strand,title,topic,cover,longs,brief,method,ex,s,e,m,closed):
    return {"code":code,"product_line":"Case file worksheet · GCSE","strand":strand,"title":title,"level_line":"GCSE Higher","time":"About 50 minutes",
     "cover_sub":cover,"levels":LV,"levels_long":dict(zip("sem",longs)),"briefing":brief,"method":method,"example":ex,"free":True,
     "marked_url":MU,"marked_topic":topic,
     "sections":{"s":{"blurb":"The method, step by step. Show every line.","questions":s},"e":{"blurb":"A step is hidden, or there's a context to unpick. One piece of tampered evidence.","questions":e},
                 "m":{"blurb":"No hints. Plan before you calculate.","questions":m}},
     "closed_title":title,"closed_points":closed,"next":NEXT}

S={}
S["num-ratio"]=sheet("MF-CF-NUM-RATIO","Number","Ratio","Sharing in a ratio",
 "Parts, shares and differences. Secure the method, extend it to hidden totals and linked ratios, then master the changing-ratio problems that decide grade 8 and 9.",
 ["Sharing an amount, simplifying, scaling.","Differences, linked ratios, and one piece of tampered evidence.","Ratios that change, and ratio with algebra."],
 ["A ratio compares quantities of the <b>same kind</b>, in the <b>same units</b>. 3 : 5 means for every 3 of the first there are 5 of the second: 8 <b>parts</b> altogether.",
  "Almost every ratio question comes down to finding the value of <b>one part</b>. Work out how many parts you know about, and what they're worth."],
 ["Add the numbers in the ratio to find the total number of parts.","Divide the amount you know by the number of parts it covers: that's one part.","Multiply one part by each number in the ratio.","Check: the shares add up to the total."],
 {"question":"Two suspects split £27,000 in the ratio 4 : 5. How much does each receive?","steps":["4 + 5 = 9 parts altogether.","£27,000 ÷ 9 = £3,000 for one part.","Suspect 1: 4 × £3,000 = £12,000. Suspect 2: 5 × £3,000 = £15,000.","Check: £12,000 + £15,000 = £27,000 ✓"],"answer":"£12,000 and £15,000"},
 [Q("Share £84 in the ratio 3 : 4.",2,"£36 and £48","7 parts, £12 a part.",label="£ ____ and £"),
  Q("Share 270 g in the ratio 2 : 3 : 4.",2,"60 g, 90 g and 120 g","9 parts, 30 g a part.",label="Three amounts"),
  Q("Evidence bags are red or blue in the ratio 5 : 3. There are 40 red bags. How many blue bags are there?",2,"24","5 parts = 40, so one part = 8; blue = 3 × 8."),
  Q("Write 45 cm : 1.5 m as a ratio in its simplest form.",2,"3 : 10","45 cm : 150 cm, then divide by 15.",tip="Change to the <b>same units</b> before you simplify. 45 : 1.5 is a common wrong start."),
  Q("A team of 36 is split into analysts and officers in the ratio 4 : 5. How many more officers are there than analysts?",3,"4","9 parts, 4 a part: 16 analysts, 20 officers.")],
 [Q("The ratio of boys to girls in a club is 3 : 5. There are 18 more girls than boys. How many members are there?",3,"72","Difference 2 parts = 18, one part 9, total 8 parts = 72.",tip="The <b>difference</b> between two shares is also a number of parts: here 5 − 3 = 2 parts."),
  Q([f"<i>a</i> : <i>b</i> = 3 : 4 and <i>b</i> : <i>c</i> = 6 : 5.","Find <i>a</i> : <i>b</i> : <i>c</i> in its simplest form."],2,"9 : 12 : 10","Make <i>b</i> the same: 3 : 4 = 9 : 12 and 6 : 5 = 12 : 10.",label="<i>a</i> : <i>b</i> : <i>c</i> ="),
  Q("A recipe for 4 people uses 300 g of flour and 2 eggs. How much of each is needed for 10 people?",2,"750 g flour and 5 eggs","Scale by 10 ÷ 4 = 2.5.",label="Flour ____ g Eggs"),
  Q("Concrete is cement and sand in the ratio 2 : 7. What fraction of the concrete is sand?",2,"7/9","9 parts altogether, 7 of them sand."),
  Q("Jo was asked to share £60 in the ratio 2 : 3. Find her mistake and give the correct shares.",2,"£24 and £36","She divided by each number in the ratio, not by 5 parts. One part is £12.",tampered="£60 ÷ 2 = £30<br>£60 ÷ 3 = £20<br>Answer: £30 and £20",label="Correct shares")],
 [Q(["The ratio of Tom's money to Sam's money is 3 : 5.","Tom gives Sam £10. Now the ratio is 1 : 3.","How much money did Tom have at the start?"],4,"£30","Tom 3<i>x</i>, Sam 5<i>x</i>. 3(3<i>x</i> − 10) = 5<i>x</i> + 10, so <i>x</i> = 10.",lines=6,label="£",tip="Give each person an amount in terms of <i>x</i>, change both amounts, then write the new ratio as an equation."),
  Q(f"Solve ({x} + 3) : ({x} − 1) = 7 : 3.",3,f"{x} = 4","3(<i>x</i> + 3) = 7(<i>x</i> − 1), so 3<i>x</i> + 9 = 7<i>x</i> − 7.",label=f"{x} ="),
  Q(["A bag holds 40 counters. Red to green is 3 : 5.","How many green counters must be added so the ratio of red to green becomes 1 : 3?"],3,"20","15 red and 25 green. For 1 : 3, green must be 45."),
  Q(["Purple paint is red and blue mixed in the ratio 2 : 3.","Lara has 500 ml of red and 900 ml of blue. What is the most purple paint she can make?"],3,"1250 ml","All the red (2 parts = 500 ml) needs 750 ml of blue, which she has. Using all the blue would need 600 ml of red.",label="ml"),
  Q("The areas of two squares are in the ratio 4 : 9. Find the ratio of their perimeters. Explain your answer.",2,"2 : 3","Lengths are in the ratio √4 : √9 = 2 : 3, and perimeter is a length.",label="Ratio")],
 ["Share an amount in a ratio, and find one part from any information you're given.","Use the difference between shares as a number of parts.","Link two ratios by making the shared term the same.","Turn a changing ratio into an equation and solve it.","Spot when a ratio has to be simplified, scaled or converted first."])

S["num-percentages"]=sheet("MF-CF-NUM-PCT","Number","Percentages","Percentage change",
 "Multipliers do the heavy lifting. Secure percentage change, extend to reverse percentages and compound growth, then master the multi-step problems examiners love.",
 ["Percentages of amounts, increase, decrease, percentage change.","Reverse percentages, compound interest, depreciation, and tampered evidence.","Repeated change, unknown rates and comparisons."],
 ["A <b>multiplier</b> turns any percentage change into one calculation. Increase by 15%: × 1.15. Decrease by 15%: × 0.85.",
  "<b>Percentage change</b> = change ÷ original × 100. <b>Reverse percentage</b>: divide by the multiplier to get back to the original. <b>Compound change</b>: multiply by the multiplier once for every year, so original × multiplier<sup>n</sup>."],
 ["Decide: percentage of, change, reverse, or repeated change?","Write the multiplier (100% ± the change, as a decimal).","Multiply, divide, or use a power.","Check: does the answer make sense? A price after an increase should be bigger."],
 {"question":"After a 20% price rise, a forensic camera costs £96. What was the price before the rise?","steps":["A 20% rise means the new price is 120% of the original: multiplier 1.2.","Original × 1.2 = £96.","Original = £96 ÷ 1.2 = £80.","Check: £80 × 1.2 = £96 ✓"],"answer":"£80"},
 [Q("Find 35% of £240.",2,"£84","0.35 × 240.",label="£"),
  Q("Increase £64 by 15%.",2,"£73.60","64 × 1.15.",label="£"),
  Q("A laptop's price falls from £450 to £378. Work out the percentage decrease.",3,"16%","Change £72. 72 ÷ 450 × 100.",label="%",tip="Divide by the <b>original</b> amount, not the new one."),
  Q("Write 18 out of 75 as a percentage.",2,"24%","18 ÷ 75 × 100.",label="%"),
  Q("An evidence store holds 1250 items. 8% are fingerprint samples. How many items are not fingerprint samples?",2,"1150","92% of 1250, or 1250 − 100.")],
 [Q("A coat costs £56 in a sale with 30% off. What was its price before the sale?",3,"£80","Sale price is 70%: 56 ÷ 0.7.",label="£",tip="Don't add 30% of £56 back on. The 30% was taken off the <b>original</b> price, so divide by 0.7."),
  Q("£2000 is invested at 3% compound interest per year. Work out its value after 4 years.",3,"£2251.02","2000 × 1.03⁴ = 2251.0176…",label="£"),
  Q("A car bought for £18,000 loses 15% of its value each year. Work out its value after 3 years.",3,"£11,054.25","18000 × 0.85³.",label="£"),
  Q("A town's population is 12,000 after a 25% increase. What was it before?",2,"9,600","12000 ÷ 1.25."),
  Q("Ben was asked to find the value of £80 after 3 years at 5% compound interest. Find his mistake and give the correct value.",2,"£92.61","He used simple interest (5% × 3). Compound: 80 × 1.05³ = 92.61.",tampered="5% × 3 years = 15%<br>£80 × 1.15 = £92<br>Answer: £92",label="Correct value £")],
 [Q("A price is increased by 20%, then the new price is decreased by 20%. Find the overall percentage change.",2,"A 4% decrease","1.2 × 0.8 = 0.96.",label="Overall change"),
  Q(f"A colony of bacteria grows by {x}% each day. It grows from 5000 to 5618 in 2 days. Find {x}.",3,f"{x} = 6","(1 + <i>x</i>/100)² = 5618 ÷ 5000 = 1.1236, so 1 + <i>x</i>/100 = 1.06.",label=f"{x} ="),
  Q("An amount is invested at 4% compound interest. After 3 years it is worth £5624.32. How much was invested?",3,"£5000","5624.32 ÷ 1.04³ = 5624.32 ÷ 1.124864.",label="£"),
  Q(["A jacket costs £120. Shop A takes 25% off, then a further 10% off the reduced price. Shop B takes 33% off.","Which shop is cheaper, and by how much?"],4,"Shop B, by 60p","A: 120 × 0.75 × 0.9 = £81. B: 120 × 0.67 = £80.40.",lines=5,label="Shop ____ by",tip="25% then 10% is <b>not</b> 35% off. Multiply the multipliers: 0.75 × 0.9 = 0.675, which is 32.5% off."),
  Q("A painting gains 10% in value each year. After how many whole years will its value first be more than double what it is now?",3,"8 years","1.1⁷ = 1.949, 1.1⁸ = 2.144.",label="years")],
 ["Use a multiplier for any percentage increase or decrease.","Work out a percentage change, dividing by the original amount.","Undo a percentage change by dividing by the multiplier.","Model compound growth and depreciation with powers.","Combine several changes by multiplying their multipliers."])

S["alg-forming-equations"]=sheet("MF-CF-ALG-FORMEQ","Algebra","Forming and solving equations","Forming and solving equations",
 "Turn words into algebra, then solve it. Secure linear equations, extend to brackets, fractions and shapes, then master the problems that become quadratics.",
 ["Linear equations: one and two steps, brackets, unknowns on both sides.","Forming equations from shapes and words, fractions, and tampered evidence.","Equations from problems that turn quadratic, and proof."],
 ["An equation is a balance: do the <b>same</b> to both sides and it stays true. To <b>form</b> an equation, give the unknown a letter, write two expressions for the same thing, and set them equal.",
  "Brackets first, fractions next (multiply every term by the denominator), then collect the letters on the side with more of them."],
 ["Define your letter: what does <i>x</i> stand for?","Write an expression for each fact, then make them equal.","Expand brackets, clear fractions, collect like terms, solve.","Answer the question that was asked, with units, and check it."],
 {"question":"A rectangle's length is 3 cm more than twice its width. Its perimeter is 42 cm. Find its area.","steps":["Let the width be <i>w</i> cm. Then the length is 2<i>w</i> + 3.","Perimeter: 2(<i>w</i> + 2<i>w</i> + 3) = 42, so 6<i>w</i> + 6 = 42.","6<i>w</i> = 36, so <i>w</i> = 6. The length is 15 cm.","Area = 6 × 15 = 90 cm². Check: 2(6 + 15) = 42 ✓"],"answer":"90 cm²"},
 [Q(f"Solve 5{x} − 7 = 18.",2,f"{x} = 5",label=f"{x} ="),
  Q(f"Solve 3({x} + 4) = 27.",2,f"{x} = 5","3<i>x</i> + 12 = 27, or divide by 3 first.",label=f"{x} ="),
  Q(f"Solve 7{x} − 3 = 4{x} + 15.",2,f"{x} = 6","3<i>x</i> = 18.",label=f"{x} ="),
  Q(f"Solve ({x} + 5) ÷ 3 = 4.",2,f"{x} = 7","<i>x</i> + 5 = 12.",label=f"{x} ="),
  Q("I think of a number, multiply it by 4 and subtract 9. The answer is 31. Form an equation and solve it to find my number.",3,"10","4<i>n</i> − 9 = 31.",label="Number",tip="The method mark is for the equation. Write it down before you solve it, even if you can do it in your head.")],
 [Q(f"A rectangle has length (2{x} + 3) cm and width ({x} − 1) cm. Its perimeter is 34 cm. Find its area.",4,"52 cm²","6<i>x</i> + 4 = 34, <i>x</i> = 5: 13 cm by 4 cm.",lines=4,label="cm²"),
  Q(f"Solve 4(2{x} − 1) = 3({x} + 7).",3,f"{x} = 5","8<i>x</i> − 4 = 3<i>x</i> + 21.",label=f"{x} ="),
  Q(f"The angles of a triangle are ({x} + 20)°, 2{x}° and (3{x} − 20)°. Find the largest angle.",3,"70°","6<i>x</i> = 180, <i>x</i> = 30: angles 50°, 60°, 70°.",label="°"),
  Q(f"Solve (2{x} − 1)/3 − ({x} + 2)/4 = 1.",3,f"{x} = 4.4","× 12: 4(2<i>x</i> − 1) − 3(<i>x</i> + 2) = 12, so 5<i>x</i> − 10 = 12.",label=f"{x} =",tip="When you multiply through, the minus sign in front of the second fraction applies to <b>both</b> terms: −3(<i>x</i> + 2) = −3<i>x</i> − 6."),
  Q(f"Amir solved 3({x} − 2) = 2{x} + 5. Find his mistake and solve the equation correctly.",2,f"{x} = 11","He only multiplied the <i>x</i> by 3: 3(<i>x</i> − 2) = 3<i>x</i> − 6.",tampered="3x − 2 = 2x + 5<br>x = 7",label=f"{x} =")],
 [Q("A detective is three times as old as her trainee. In 8 years' time she will be twice as old as him. How old are they now?",4,"Trainee 8, detective 24","3<i>t</i> + 8 = 2(<i>t</i> + 8).",lines=5,label="Ages"),
  Q(f"Solve 3/({x} − 1) = 5/({x} + 3).",3,f"{x} = 7","3(<i>x</i> + 3) = 5(<i>x</i> − 1).",label=f"{x} ="),
  Q(f"An isosceles triangle has two equal sides of (2{x} + 3) cm and a base of ({x} + 5) cm. Its perimeter is 46 cm. Find the length of each side.",3,"17 cm, 17 cm and 12 cm","5<i>x</i> + 11 = 46, <i>x</i> = 7.",label="Sides"),
  Q("A rectangle's length is 4 cm more than its width. Its area is 96 cm². Find its perimeter.",4,"40 cm","<i>w</i>(<i>w</i> + 4) = 96 → <i>w</i>² + 4<i>w</i> − 96 = 0 → (<i>w</i> + 12)(<i>w</i> − 8) = 0, <i>w</i> = 8. Reject −12: a length can't be negative.",lines=5,label="cm"),
  Q("Prove that the sum of any three consecutive whole numbers is a multiple of 3.",2,"<i>n</i> + (<i>n</i> + 1) + (<i>n</i> + 2) = 3<i>n</i> + 3 = 3(<i>n</i> + 1), a multiple of 3.",lines=4,label=None)],
 ["Solve linear equations with brackets, fractions and unknowns on both sides.","Form an equation from words or a diagram, defining your letter.","Answer the question asked, not just the value of <i>x</i>.","Recognise when a problem gives a quadratic, and reject impossible answers.","Write a short algebraic proof."])
# answer_label None means no answer line: encode as False
for d in S.values():
    for sec in d["sections"].values():
        for q in sec["questions"]:
            if "answer_label" in q and q["answer_label"] is None: q["answer_label"]=False

S["alg-quadratic-equations"]=sheet("MF-CF-ALG-QUADEQ","Algebra","Quadratic equations","The quadratic formula",
 "Three ways to crack a quadratic. Secure factorising, extend to the formula and completing the square, then master disguised quadratics and the discriminant.",
 ["Solving by factorising, including a ≠ 1.","The formula, completing the square, forming a quadratic, and tampered evidence.","Disguised quadratics, the discriminant and context problems."],
 ["A quadratic equation has an <i>x</i>² term. Rearrange to <b>= 0</b> first. Then: <b>factorise</b> if it factorises, use the <b>formula</b> <i>x</i> = (−<i>b</i> ± √(<i>b</i>² − 4<i>ac</i>)) ÷ 2<i>a</i> when it doesn't, and <b>complete the square</b> when the question asks for surd form or a turning point.",
  "The <b>discriminant</b> <i>b</i>² − 4<i>ac</i> tells you how many solutions there are: positive, two; zero, one; negative, none."],
 ["Rearrange so one side is 0.","Choose: factorise, formula, or complete the square.","Solve each bracket, or substitute carefully into the formula, with brackets round negatives.","Give both solutions, rounded as asked, and reject any that don't fit a context."],
 {"question":"Solve 2<i>x</i>² − 3<i>x</i> − 7 = 0, giving your answers to 2 decimal places.","steps":["It doesn't factorise, so use the formula with <i>a</i> = 2, <i>b</i> = −3, <i>c</i> = −7.","<i>x</i> = (3 ± √((−3)² − 4 × 2 × (−7))) ÷ 4 = (3 ± √65) ÷ 4.","√65 = 8.0623, so <i>x</i> = 11.0623 ÷ 4 or −5.0623 ÷ 4.","Check by substituting one answer: 2(2.77)² − 3(2.77) − 7 ≈ 0 ✓"],"answer":"<i>x</i> = 2.77 or <i>x</i> = −1.27"},
 [Q(f"Solve {x}² + 7{x} + 12 = 0.",3,f"{x} = −3 or {x} = −4","(<i>x</i> + 3)(<i>x</i> + 4) = 0.",label=f"{x} ="),
  Q(f"Solve {x}² − 5{x} = 0.",2,f"{x} = 0 or {x} = 5","<i>x</i>(<i>x</i> − 5) = 0.",label=f"{x} =",tip="Don't divide both sides by <i>x</i>: you lose the solution <i>x</i> = 0. Factorise instead."),
  Q(f"Solve {x}² − 49 = 0.",2,f"{x} = 7 or {x} = −7","Difference of two squares, or <i>x</i>² = 49.",label=f"{x} ="),
  Q(f"Solve {x}² − 2{x} − 15 = 0.",3,f"{x} = 5 or {x} = −3","(<i>x</i> − 5)(<i>x</i> + 3) = 0.",label=f"{x} ="),
  Q(f"Solve 2{x}² + 7{x} + 3 = 0.",3,f"{x} = −½ or {x} = −3","(2<i>x</i> + 1)(<i>x</i> + 3) = 0.",label=f"{x} =")],
 [Q(f"Solve 3{x}² − 5{x} − 4 = 0. Give your answers to 2 decimal places.",3,f"{x} = 2.26 or {x} = −0.59","(5 ± √73) ÷ 6.",label=f"{x} ="),
  Q(f"Write {x}² + 6{x} − 5 in the form ({x} + <i>a</i>)² + <i>b</i>.",2,f"({x} + 3)² − 14","(<i>x</i> + 3)² = <i>x</i>² + 6<i>x</i> + 9, so subtract 14.",label="Answer"),
  Q(f"Hence solve {x}² + 6{x} − 5 = 0, giving your answers in surd form.",2,f"{x} = −3 ± √14","(<i>x</i> + 3)² = 14.",label=f"{x} ="),
  Q(f"A rectangle has length ({x} + 5) cm and width ({x} − 2) cm. Its area is 60 cm². Find {x}.",4,f"{x} = 7","<i>x</i>² + 3<i>x</i> − 70 = 0 → (<i>x</i> + 10)(<i>x</i> − 7) = 0. Reject −10: the width would be negative.",lines=4,label=f"{x} ="),
  Q(f"Leah solved {x}² − 3{x} − 10 = 0. Find her mistake and give the correct solutions.",2,f"{x} = 5 or {x} = −2","Her factors are right but the signs of the solutions are flipped: <i>x</i> − 5 = 0 gives <i>x</i> = 5.",tampered="(x − 5)(x + 2) = 0<br>x = −5 or x = 2",label=f"{x} =")],
 [Q(f"Solve 2/({x} + 1) + 3/{x} = 2. Give your answers to 2 decimal places.",5,f"{x} = 2.19 or {x} = −0.69","2<i>x</i> + 3(<i>x</i> + 1) = 2<i>x</i>(<i>x</i> + 1) → 2<i>x</i>² − 3<i>x</i> − 3 = 0 → (3 ± √33) ÷ 4.",lines=6,label=f"{x} ="),
  Q(f"Show that {x}² − 4{x} + 7 = 0 has no real solutions.",2,"<i>b</i>² − 4<i>ac</i> = 16 − 28 = −12 < 0, so no real solutions.","Or: (<i>x</i> − 2)² + 3 is always at least 3.",lines=3,label=False),
  Q(f"{x}² + {k}{x} + 9 = 0 has exactly one solution. Find the possible values of {k}.",3,f"{k} = 6 or {k} = −6","<i>k</i>² − 36 = 0.",label=f"{k} ="),
  Q(f"Solve {x}⁴ − 13{x}² + 36 = 0.",4,f"{x} = ±2 or {x} = ±3","Let <i>y</i> = <i>x</i>²: <i>y</i>² − 13<i>y</i> + 36 = 0 → (<i>y</i> − 4)(<i>y</i> − 9) = 0.",lines=5,label=f"{x} =",tip="A quadratic in disguise. Substitute <i>y</i> = <i>x</i>², solve, then take <b>both</b> square roots of each answer."),
  Q(f"A drone's height in metres after {t} seconds is <i>h</i> = 20{t} − 5{t}². Find when it is 15 m above the ground.",3,f"{t} = 1 s and {t} = 3 s","5<i>t</i>² − 20<i>t</i> + 15 = 0 → <i>t</i>² − 4<i>t</i> + 3 = 0.",label=f"{t} =")],
 ["Solve quadratics by factorising, including when <i>a</i> isn't 1.","Use the quadratic formula and round sensibly.","Complete the square and give answers in surd form.","Use the discriminant to count solutions.","Spot a quadratic in disguise and solve problems in context."])

for name,d in S.items():
    json.dump(d,open(f"{name}.json","w"),ensure_ascii=False,indent=1)
print(list(S))
