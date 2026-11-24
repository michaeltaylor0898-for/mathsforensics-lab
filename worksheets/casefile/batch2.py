import json
from batch1 import Q, sheet, F, R
x,y,k,a,b='<i>x</i>','<i>y</i>','<i>k</i>','<i>a</i>','<i>b</i>'
def P(base,e): return f"{base}<sup>{e}</sup>"
def SF(nu,de): return f'<sup><span class="frac" style="font-size:.8em"><span class="nu">{nu}</span><span class="de">{de}</span></span></sup>'
S={}
S["num-indices"]=sheet("MF-CF-NUM-INDICES","Number","Indices","Laws of indices",
 "Powers follow rules, and the rules never change. Secure the three laws, extend to negative and fractional powers, then master equations where the unknown is in the power.",
 ["The three laws: multiply, divide, power of a power.","Zero, negative and fractional indices, brackets, and tampered evidence.","Unknowns in the power, and writing everything with one base."],
 ["When you <b>multiply</b> powers of the same base, add the indices. When you <b>divide</b>, subtract them. A <b>power of a power</b>: multiply them.",
  f"A <b>negative</b> index means one over: {P(a,'−n')} = 1 ÷ {P(a,'n')}. A <b>fractional</b> index means a root: {P(a,'1/n')} is the <i>n</i>th root, and {P(a,'m/n')} is the <i>n</i>th root, raised to the power <i>m</i>. Anything to the power 0 is 1."],
 ["Deal with numbers and letters separately.","Apply one law at a time, writing each step.","For a fractional index, take the root first: the numbers stay small.","For an index equation, write both sides as powers of the same base, then set the indices equal."],
 {"question":f"Evaluate {P('64','−2/3')}.","steps":[f"The negative means one over: {P('64','−2/3')} = 1 ÷ {P('64','2/3')}.","The denominator 3 means cube root: ∛64 = 4.","The numerator 2 means square it: 4² = 16.","So the answer is 1 ÷ 16."],"answer":"1/16"},
 [Q(f"Simplify {P(a,'5')} × {P(a,'3')}.",1,P(a,'8'),label="Answer"),
  Q(f"Simplify {P(y,'9')} ÷ {P(y,'4')}.",1,P(y,'5')),
  Q(f"Simplify ({P(x,'3')})<sup>4</sup>.",1,P(x,'12')),
  Q(f"Simplify 3{P(a,'4')} × 5{P(a,'2')}.",2,f"15{P(a,'6')}","Multiply the numbers, add the indices.",tip="Numbers multiply, indices add. 3 × 5 = 15, not 8."),
  Q(f"Write {P('2','3')} × {P('2','4')} ÷ {P('2','2')} as a single power of 2, then work out its value.",2,f"{P('2','5')} = 32","3 + 4 − 2 = 5.")],
 [Q(f"Evaluate {P('64','2/3')}.",2,"16","∛64 = 4, then 4² = 16."),
  Q(f"Write as fractions: (a) {P('5','−2')} (b) ({F('2','3')})<sup>−1</sup>",2,"(a) 1/25 (b) 3/2","A negative index flips the fraction.",label="(a) ____ (b)"),
  Q(f"Simplify (2{P(x,'3')}{y})<sup>4</sup>.",2,f"16{P(x,'12')}{P(y,'4')}","Every factor inside is raised to the power 4.",tip="The 2 is raised to the power 4 as well: 2⁴ = 16, not 8."),
  Q("Simplify "+F(f"12{P(a,'7')}{P(b,'3')}",f"4{P(a,'2')}{P(b,'5')}")+".",2,f"3{P(a,'5')}{P(b,'−2')}, or 3{P(a,'5')} ÷ {P(b,'2')}","12 ÷ 4, then subtract indices."),
  Q(f"Sara simplified (3{P(x,'2')})<sup>3</sup>. Find her mistake and give the correct answer.",2,f"27{P(x,'6')}","She didn't cube the 3: 3³ = 27.",tampered="(3x²)³ = 3x⁶",label="Answer")],
 [Q(f"Solve {P('2',x+' + 3')} = 32.",2,f"{x} = 2","32 = 2⁵, so <i>x</i> + 3 = 5.",label=f"{x} ="),
  Q(f"Solve {P('9',x)} = {P('27',x+' − 1')}.",3,f"{x} = 3",f"3<sup>2<i>x</i></sup> = 3<sup>3<i>x</i> − 3</sup>, so 2<i>x</i> = 3<i>x</i> − 3.",label=f"{x} =",tip="Write both sides as powers of the <b>same base</b>. 9 and 27 are both powers of 3."),
  Q(f"Evaluate ({F('27','8')})<sup>−2/3</sup>. Give your answer as a fraction.",3,"4/9","Flip: (8/27)<sup>2/3</sup>. Cube root: 2/3. Square: 4/9."),
  Q(f"{P('2',a)} = {P('8',x)} × {P('4',f'2{x} + 1')}. Find {a} in terms of {x}.",3,f"{a} = 7{x} + 2",f"2<sup>3<i>x</i></sup> × 2<sup>4<i>x</i> + 2</sup> = 2<sup>7<i>x</i> + 2</sup>.",label=f"{a} ="),
  Q(f"Show that {P('16','3/4')} × {P('2','−1')} = 4.",2,"16<sup>3/4</sup> = (⁴√16)³ = 2³ = 8, and 8 × ½ = 4.",lines=3,label=False)],
 ["Multiply, divide and raise powers using the three laws.","Work with zero and negative indices.","Evaluate fractional indices by taking the root first.","Simplify expressions with numbers, letters and brackets.","Solve equations by writing both sides with the same base."])

S["num-surds"]=sheet("MF-CF-NUM-SURDS","Number","Surds","Simplifying surds",
 "Exact answers, no rounding. Secure simplifying and multiplying, extend to brackets and rationalising, then master surd algebra in shapes and equations.",
 ["Simplify, add, multiply, and rationalise a simple denominator.","Expanding brackets, conjugates, and tampered evidence.","Rationalising harder fractions, surds in shapes and equations."],
 [f"A surd is a root that isn't a whole number, like {R('2')}. Keep it as a surd and the answer stays <b>exact</b>.",
  f"Key facts: {R('<i>ab</i>')} = {R(a)} × {R(b)}, and {R(a)} × {R(a)} = <i>a</i>. To <b>simplify</b>, find the biggest square number that's a factor. To <b>rationalise</b> a denominator, multiply top and bottom by the surd, or by the <b>conjugate</b> if the denominator is a bracket: for 3 − {R('2')}, multiply by 3 + {R('2')}."],
 ["Look for the largest square factor: 4, 9, 16, 25, 36, 49…","Only like surds add: 2√3 + 5√3 = 7√3, but √2 + √3 can't be simplified.","Expand brackets term by term, just like algebra.","Rationalise: multiply top and bottom by the same thing, so the value doesn't change."],
 {"question":"Rationalise the denominator of "+F("10","3 − "+R("2"))+".","steps":["The denominator is a bracket, so multiply top and bottom by the conjugate, 3 + √2.","Top: 10(3 + √2) = 30 + 10√2.","Bottom: (3 − √2)(3 + √2) = 9 − 2 = 7. The surds cancel.","So the answer is (30 + 10√2) ÷ 7."],"answer":F("30 + 10"+R("2"),"7")},
 [Q(f"Simplify {R('50')}.",2,"5√2","√(25 × 2).",label="Answer"),
  Q(f"Simplify {R('12')} + {R('27')}.",2,"5√3","2√3 + 3√3."),
  Q(f"Simplify {R('3')} × {R('12')}.",2,"6","√36."),
  Q(f"Expand and simplify {R('5')}(2 + {R('5')}).",2,"2√5 + 5","√5 × √5 = 5.",tip="√5 × √5 = 5. A common slip is writing 25, or leaving it as √25."),
  Q("Rationalise the denominator of "+F("6",R("3"))+".",2,"2√3","Multiply top and bottom by √3: 6√3 ÷ 3.")],
 [Q(f"Expand and simplify (3 + {R('2')})(3 − {R('2')}).",2,"7","9 − 2: the surd terms cancel."),
  Q(f"Expand and simplify (2 + {R('3')})².",2,"7 + 4√3","4 + 4√3 + 3.",tip="Write the bracket out twice. (2 + √3)² is not 4 + 3."),
  Q("Rationalise the denominator of "+F("4",R("5")+" − 1")+". Simplify your answer.",3,"√5 + 1","× (√5 + 1): 4(√5 + 1) ÷ (5 − 1)."),
  Q(f"A rectangle measures (3 + {R('5')}) cm by (3 − {R('5')}) cm. Find its area.",2,"4 cm²","9 − 5.",label="cm²"),
  Q(f"Ali expanded ({R('3')} + 1)². Find his mistake and give the correct answer.",2,"4 + 2√3","He squared each term but missed the middle terms: 3 + 2√3 + 1.",tampered="(√3 + 1)² = 3 + 1 = 4",label="Answer")],
 [Q("Rationalise the denominator of "+F("2 + "+R("3"),"2 − "+R("3"))+". Give your answer in the form <i>a</i> + <i>b</i>√3.",3,"7 + 4√3","× (2 + √3): (2 + √3)² ÷ (4 − 3)."),
  Q(f"A right-angled triangle has shorter sides (2 + {R('3')}) cm and (2 − {R('3')}) cm. Find the exact length of the hypotenuse.",3,"√14 cm","(7 + 4√3) + (7 − 4√3) = 14.",label="cm"),
  Q(f"Solve {x}{R('2')} + 3 = {x}{R('8')} − 5. Give your answer in the form <i>k</i>√2.",4,f"{x} = 4√2","√8 = 2√2, so 8 = <i>x</i>√2 and <i>x</i> = 8 ÷ √2.",lines=5,label=f"{x} =",tip="Simplify √8 first. Then you have like surds you can collect."),
  Q("Show that "+F(R('12')+" + "+R('75'),R('3'))+" is a whole number, and find it.",2,"7","(2√3 + 5√3) ÷ √3 = 7√3 ÷ √3.",label="Answer"),
  Q(f"Show that ({R(a)} + {R(b)})² − ({R(a)} − {R(b)})² = 4{R('<i>ab</i>')}.",2,"(a + 2√(ab) + b) − (a − 2√(ab) + b) = 4√(ab).",lines=4,label=False)],
 ["Simplify a surd using its largest square factor.","Add, subtract and multiply surds.","Expand brackets containing surds, using the conjugate to clear them.","Rationalise any denominator, including a bracket.","Keep answers exact in shapes and equations."])

S["alg-straight-line-graphs"]=sheet("MF-CF-ALG-SLINE","Graphs","Straight-line graphs","Straight-line graphs",
 "y = mx + c tells you everything about a line. Secure gradient and intercept, extend to equations through two points and parallel lines, then master perpendicular lines and bisectors.",
 ["Gradient, y-intercept, and points on a line.","Equations through two points, parallel lines, axes and midpoints, and tampered evidence.","Perpendicular lines, bisectors and unknown coordinates."],
 [f"Every straight line can be written as {y} = <i>m</i>{x} + <i>c</i>. <b>m</b> is the gradient: how far it goes up for every 1 across. <b>c</b> is the y-intercept: where it crosses the {y}-axis.",
  "Gradient = "+F("change in <i>y</i>","change in <i>x</i>")+". <b>Parallel</b> lines have the same gradient. <b>Perpendicular</b> gradients multiply to −1: flip the fraction and change the sign."],
 [f"Rearrange to {y} = … first if the equation isn't in that form.","Find the gradient: from the equation, or change in y over change in x.","Substitute a point the line passes through to find c.","Write the final equation and check one point in it."],
 {"question":"Find the equation of the line through (2, 5) and (6, 13).","steps":["Gradient = "+F("13 − 5","6 − 2")+" = "+F("8","4")+" = 2.",f"So {y} = 2{x} + <i>c</i>.","Substitute (2, 5): 5 = 2 × 2 + <i>c</i>, so <i>c</i> = 1.","Check with (6, 13): 2 × 6 + 1 = 13 ✓"],"answer":f"{y} = 2{x} + 1"},
 [Q(f"Write down the gradient and the {y}-intercept of {y} = 3{x} − 5.",2,"Gradient 3, y-intercept −5",label="Gradient ____ Intercept"),
  Q("Find the gradient of the line through (1, 2) and (4, 11).",2,"3","9 ÷ 3."),
  Q("Write down the equation of the line with gradient 2 that crosses the y-axis at (0, 7).",2,f"{y} = 2{x} + 7",label="Equation"),
  Q(f"Does the point (4, 5) lie on the line {y} = 2{x} − 2? Show how you decide.",2,"No: when x = 4, y = 6, not 5.",label="Yes / No"),
  Q(f"Find the gradient of the line 2{y} − 6{x} = 8.",2,"3",f"Rearrange: {y} = 3{x} + 4.",tip="The gradient is the number in front of <i>x</i> only once <i>y</i> is on its own. It isn't 6 or −6.")],
 [Q(f"Find the equation of the line through (1, 7) and (4, 1).",3,f"{y} = −2{x} + 9","Gradient −6 ÷ 3 = −2; 7 = −2 + c.",label="Equation"),
  Q(f"Find the equation of the line parallel to {y} = 4{x} − 1 that passes through (2, 3).",2,f"{y} = 4{x} − 5","Same gradient 4; 3 = 8 + c.",label="Equation"),
  Q(f"Find where the line 3{x} + 4{y} = 24 crosses each axis.",2,"(8, 0) and (0, 6)","Put y = 0, then x = 0.",label="Points"),
  Q("Find the midpoint of the line segment from (−2, 5) to (6, −1).",2,"(2, 2)","Average the x values, then the y values.",label="( ____ , ____ )"),
  Q("Kai found the gradient of the line through (1, 7) and (5, −1). Find his mistake and give the correct gradient.",2,"−2","He mixed the order: change in y on top, in the same order as x. (−1 − 7) ÷ (5 − 1).",tampered="(5 − 1) ÷ (−1 − 7) = 4 ÷ −8 = −½",label="Gradient")],
 [Q(f"Find the equation of the line perpendicular to {y} = ½{x} + 3 that passes through (4, 1).",3,f"{y} = −2{x} + 9","Perpendicular gradient −2; 1 = −8 + c.",label="Equation"),
  Q("A is (1, 2) and B is (7, 10). Find the equation of the perpendicular bisector of AB.",4,f"3{x} + 4{y} = 36 (or {y} = −¾{x} + 9)","Midpoint (4, 6). Gradient AB = 8/6 = 4/3, so the bisector's is −3/4.",lines=5,label="Equation",tip="A perpendicular bisector goes through the <b>midpoint</b>, at right angles. You need both facts."),
  Q(f"Show that the lines 2{y} = 3{x} + 4 and 3{y} + 2{x} = 6 are perpendicular.",2,"Gradients 3/2 and −2/3, and 3/2 × −2/3 = −1.",lines=4,label=False),
  Q(f"A line has gradient −3 and passes through ({k}, 7) and (3, {k}). Find {k}.",3,f"{k} = 1","(k − 7) ÷ (3 − k) = −3, so k − 7 = 3k − 9.",label=f"{k} ="),
  Q(f"Find the area of the triangle enclosed by the line {y} = 2{x} + 4 and the two axes.",3,"4 square units","Crosses at (−2, 0) and (0, 4): ½ × 2 × 4.",label="Area")],
 ["Read the gradient and intercept from y = mx + c, rearranging first if needed.","Find the gradient between two points, keeping the order consistent.","Find the equation of a line from two points, or a point and a parallel line.","Use perpendicular gradients and midpoints to find a bisector.","Find where a line meets the axes, and use it in area problems."])
for name,d in S.items():
    for sec in d["sections"].values():
        for q in sec["questions"]:
            if q.get("answer_label") is None and "answer_label" in q: q["answer_label"]=False
    json.dump(d,open(f"{name}.json","w"),ensure_ascii=False,indent=1)
print(list(S))
