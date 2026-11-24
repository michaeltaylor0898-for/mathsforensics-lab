import json, math
from batch1 import Q, sheet, F, R
from diagrams import graph, tri, cuboid
x,a,b='<i>x</i>','<i>a</i>','<i>b</i>'
def W(q,svg): q["svg"]=svg; return q
r3=R("3"); r2=R("2")
TAB=('<table style="border-collapse:collapse;margin:2mm auto 0;font-family:DejaVu Serif;font-size:10pt;text-align:center">'
 '<tr>'+''.join(f'<td style="border:1px solid #9FD9D4;padding:1mm 3mm;background:#fff"><b>{h}</b></td>' for h in ["","0°","30°","45°","60°","90°"])+'</tr>'
 +''.join('<tr>'+f'<td style="border:1px solid #9FD9D4;padding:1mm 3mm;background:#fff"><b>{n}</b></td>'+''.join(f'<td style="border:1px solid #9FD9D4;padding:1mm 3mm;background:#fff">{v}</td>' for v in vals)+'</tr>'
 for n,vals in [("sin",["0",F("1","2"),F(r2,"2"),F(r3,"2"),"1"]),("cos",["1",F(r3,"2"),F(r2,"2"),F("1","2"),"0"]),("tan",["0",F("1",r3),"1",r3,"–"])])+'</table>')
S={}
S["geo-exact-trig"]=sheet("MF-CF-GEO-EXACTTRIG","Shape","Exact trig values","Exact trig values",
 "No calculator, no rounding. Secure the values for 0°, 30°, 45°, 60° and 90°, extend to finding sides and angles exactly, then master surd answers in real shapes.",
 ["Recall the exact values and combine them.","Exact sides and angles in right-angled triangles, and tampered evidence.","Surd answers in shapes, and simple trig equations."],
 ["On the non-calculator paper you must know these values by heart. They come from two triangles: half an equilateral triangle (30° and 60°) and half a square (45°).",TAB],
 ["Learn the table, or rebuild it from the two triangles.","Label the sides of the right-angled triangle: hypotenuse, opposite, adjacent.","Pick sin, cos or tan with SOH CAH TOA, and substitute the exact value.","Keep surds exact: rationalise a denominator if you're asked to simplify."],
 {"question":"A ramp makes an angle of 30° with the ground and is 8 m long. How high does it rise? Give an exact answer.","steps":["The ramp is the hypotenuse; the height is opposite the 30° angle. So use sin.","sin 30° = "+F("height","8")+".","sin 30° = ½, so height = 8 × ½.","Height = 4 m. Check: 4 is half of 8, as the 30° triangle always gives ✓"],"answer":"4 m"},
 [Q("Write down the exact value of sin 30°.",1,"½",label="Answer"),
  Q("Work out cos 60° + sin 30°.",2,"1","½ + ½."),
  Q("Work out tan 45° × cos 0°.",2,"1","1 × 1."),
  W(Q("Find the exact length of BC.",2,"5 cm","sin 30° × 10.",label="cm"),tri([(0,0),(8.66,0),(8.66,5)],sides={(0,2):"10 cm"},angles={0:"30°"},right=1)),
  Q("Write down the exact value of tan 60°.",1,"√3")],
 [W(Q("Find the exact length of the hypotenuse AC.",2,"12 cm","cos 60° = 6 ÷ AC, so AC = 6 ÷ ½.",label="cm"),tri([(0,0),(6,0),(6,10.39)],sides={(0,1):"6 cm"},angles={0:"60°"},right=1)),
  Q("Work out the exact value of sin 60° × tan 30°.",2,"½",F(r3,"2")+" × "+F("1",r3)+" = ½."),
  Q("A right-angled triangle has an opposite side of 4 cm and a hypotenuse of 8 cm. Find the angle without a calculator.",2,"30°","sin θ = ½.",label="°"),
  Q("Show that sin² 45° + cos² 45° = 1.",2,"(√2/2)² + (√2/2)² = ½ + ½ = 1",lines=3,label=False),
  Q("Ola wrote this. Find her mistake.",2,"sin 30° + sin 30° = ½ + ½ = 1, but sin 60° = √3/2. You can't add the angles.",tampered="sin 30° + sin 30° = sin 60°",label="Correct value")],
 [Q("An equilateral triangle has sides of 6 cm. Find its exact area.",3,"9√3 cm²","Height 6 sin 60° = 3√3. Area ½ × 6 × 3√3.",label="cm²",tip="Split it into two right-angled triangles with angles 30°, 60°, 90°. The height is the side opposite 60°."),
  W(Q("Find the exact length of BC. Give your answer in its simplest form.",3,"2√3 cm","tan 30° × 6 = 6 ÷ √3 = 2√3.",label="cm"),tri([(0,0),(6,0),(6,3.46)],sides={(0,1):"6 cm"},angles={0:"30°"},right=1)),
  Q(f"Solve 2 sin {x} = 1 for 0° ≤ {x} ≤ 90°.",2,f"{x} = 30°","sin x = ½.",label=f"{x} ="),
  Q("Show that cos 30° × tan 60° = 3/2.",2,"√3/2 × √3 = 3/2",lines=3,label=False),
  Q("Triangle ABC has a right angle at C. AB = 8 cm and angle A = 45°. Find the exact length of AC.",3,"4√2 cm","8 cos 45° = 8 × √2/2.",label="cm")],
 ["Recall sin, cos and tan of 0°, 30°, 45°, 60° and 90°.","Rebuild the values from half an equilateral triangle and half a square.","Find sides and angles exactly in right-angled triangles.","Give answers in simplest surd form.","Solve simple trig equations without a calculator."])

SG=graph(0,360,-1,1,curves=[lambda v:math.sin(math.radians(v))],xstep=30,ystep=0.5,xmajor=90,ymajor=0.5,w=110,h=50,xlab="x",ylab="y")
CG=graph(0,360,-1,1,curves=[lambda v:math.cos(math.radians(v))],xstep=30,ystep=0.5,xmajor=90,ymajor=0.5,w=110,h=50,xlab="x",ylab="y")
S["geo-trig-graphs"]=sheet("MF-CF-GEO-TRIGGRAPHS","Graphs","Trig graphs","Exact trig values",
 "Sine, cosine and tangent repeat for ever. Secure their shapes, extend to finding every angle in a range, then master transformations and trig equations.",
 ["The shapes of y = sin x, cos x and tan x, and reading values.","Using symmetry to find a second angle, simple transformations, and tampered evidence.","Trig equations with two solutions, and stretched or shifted graphs."],
 ["<b>y = sin x</b> and <b>y = cos x</b> are waves between −1 and 1 that repeat every 360°. <b>y = tan x</b> repeats every 180° and has asymptotes at 90°, 270°…",
  "Your calculator gives <b>one</b> angle. The graph's symmetry gives the others: for sin, the second angle is 180° − <i>x</i>; for cos, it's 360° − <i>x</i>; for tan, add 180°."],
 ["Sketch the graph for the range you're given.","Use your calculator (or exact values) for the first angle.","Use the symmetry of the graph to find every other angle in the range.","Check each answer by substituting it back."],
 {"question":"Solve sin <i>x</i> = −0.5 for 0° ≤ <i>x</i> ≤ 360°.","steps":["sin⁻¹(−0.5) = −30°, which is outside the range.","sin 30° = 0.5, and the sine graph is negative between 180° and 360°.","By symmetry the angles are 180° + 30° and 360° − 30°.","Check: sin 210° = −0.5 ✓ and sin 330° = −0.5 ✓"],"answer":"<i>x</i> = 210° or 330°"},
 [W(Q(f"The graph of y = sin {x} is shown. Write down the value of sin 90°.",1,"1",label="Answer"),SG),
  Q(f"Use the graph to solve sin {x} = 0.5 for 0° ≤ {x} ≤ 360°.",2,f"{x} = 30° and 150°","Draw across at 0.5.",label=f"{x} ="),
  W(Q(f"The graph of y = cos {x} is shown. Where does it cross the {x}-axis between 0° and 360°?",2,"90° and 270°",label=f"{x} ="),CG),
  Q(f"Write down the maximum value of y = cos {x}, and the values of {x} between 0° and 360° where it happens.",2,"1, at 0° and 360°",label="Max ____ at"),
  Q(f"How often does the graph of y = tan {x} repeat?",1,"Every 180°",label="°")],
 [Q(f"sin 40° ≈ 0.643. Find another angle between 0° and 360° with the same sine.",2,"140°","180° − 40°.",label="°"),
  Q(f"cos 70° ≈ 0.342. Find the two angles between 0° and 360° for which cos {x} = −0.342.",3,"110° and 250°","180° − 70° and 180° + 70°.",label=f"{x} ="),
  Q(f"Describe how the graph of y = sin {x} + 2 is related to the graph of y = sin {x}.",2,"A translation 2 units up","Every point moves up 2.",label=False),
  Q(f"Write down the maximum and minimum values of y = 3 cos {x}.",2,"Max 3, min −3",label="Max ____ Min"),
  Q(f"Tom solved cos {x} = 0.5 for 0° ≤ {x} ≤ 360°. Find his mistake.",2,"x = 60° and x = 300°","The cos graph is at 0.5 twice in the range. He found only one.",tampered="cos⁻¹(0.5) = 60°, so x = 60°",label=f"{x} =",tip="Always sketch the graph across the whole range. Count how many times it crosses your line, then find that many answers.")],
 [Q(f"Solve 2 sin {x} + 1 = 0 for 0° ≤ {x} ≤ 360°.",3,"210° and 330°","sin x = −½.",label=f"{x} ="),
  Q(f"The graph of y = sin({x} + 90°) is the same as the graph of another trig function. Which one? Explain.",2,"y = cos x","Shifting sin 90° left lines its peak up with cos at 0°.",label="y ="),
  Q(f"The graph of y = {a} sin({b}{x}) has a maximum value of 4 and repeats every 180°. Find {a} and {b}.",3,f"{a} = 4, {b} = 2","The period of sin bx is 360° ÷ b.",label=f"{a} = ____ {b} ="),
  Q(f"Solve tan {x} = √3 for 0° ≤ {x} ≤ 360°.",2,"60° and 240°","tan repeats every 180°.",label=f"{x} ="),
  Q(f"Find the coordinates of the maximum point of y = 1 − 2 cos {x} for 0° < {x} < 360°.",3,"(180°, 3)","Greatest when cos x = −1.",label="( ____ , ____ )")],
 ["Sketch y = sin x, y = cos x and y = tan x, with their key points.","Use symmetry to find every solution in a range.","Describe translations and stretches of trig graphs.","Solve trig equations after rearranging.","Find a and b from a graph's height and period."])

T1=tri([(0,0),(10,0),(3.7,5.2)],sides={(1,2):"8 cm",(0,2):"b"},angles={0:"40°",1:"65°"},names=("A","B","C"))
S["geo-sine-cosine-rule"]=sheet("MF-CF-GEO-SINECOS","Shape","Sine and cosine rule","Sine rule",
 "Trigonometry for triangles without a right angle. Secure choosing the right rule, extend to areas and contexts, then master the ambiguous case and algebra.",
 ["Sine rule, cosine rule and ½ab sin C, one step each.","Angles, quadrilaterals, contexts, and tampered evidence.","Two possible triangles, bearings, and forming equations."],
 ["Label the sides with lower-case letters opposite their angles: side <i>a</i> is opposite angle A.",
  "<b>Sine rule</b> (a pair of opposite side and angle, plus one more): "+F("<i>a</i>","sin A")+" = "+F("<i>b</i>","sin B")+" = "+F("<i>c</i>","sin C")+". <b>Cosine rule</b> (two sides and the angle between, or all three sides): <i>a</i>² = <i>b</i>² + <i>c</i>² − 2<i>bc</i> cos A. <b>Area</b> = ½<i>ab</i> sin C."],
 ["Label the triangle: angles A, B, C; sides a, b, c opposite them.","Have you got a side and its opposite angle? Sine rule. Otherwise, cosine rule.","Substitute, then rearrange before you press any buttons.","Round only at the end, and check the biggest side is opposite the biggest angle."],
 {"question":"In triangle PQR, PQ = 9 cm, PR = 7 cm and angle P = 50°. Find QR.","steps":["Two sides and the angle between them, with no opposite pair: cosine rule.","QR² = 9² + 7² − 2 × 9 × 7 × cos 50°.","= 81 + 49 − 126 × 0.6428 = 49.01.","QR = √49.01 = 7.00 cm. Check: it's opposite 50°, between the other two sides ✓"],"answer":"QR = 7.00 cm (3 s.f.)"},
 [W(Q("Find the length <i>b</i>. Give your answer to 3 significant figures.",3,"11.3 cm","b = 8 sin 65° ÷ sin 40°.",label="cm"),T1),
  Q("In triangle ABC, b = 7 cm, c = 9 cm and angle A = 50°. Find a.",3,"7.00 cm","a² = 49 + 81 − 126 cos 50°.",label="cm"),
  Q("Find the area of a triangle with sides 6 cm and 9 cm and an angle of 40° between them.",2,"17.4 cm²","½ × 6 × 9 × sin 40°.",label="cm²"),
  Q("A triangle has sides 7 cm, 8 cm and 9 cm. Find the largest angle.",3,"73.4°","cos C = (49 + 64 − 81) ÷ 112.",label="°",tip="The largest angle is opposite the longest side. Rearrange first: cos C = (a² + b² − c²) ÷ 2ab."),
  Q("In triangle ABC, a = 10 cm, angle A = 70° and b = 8 cm. Find angle B.",3,"48.7°","sin B = 8 sin 70° ÷ 10.",label="°")],
 [Q("Two observers are 200 m apart on a straight road. They see a suspect's drone at angles of 50° and 60° from the road. How far is the drone from the first observer?",3,"184 m","The third angle is 70°. 200 sin 60° ÷ sin 70°.",label="m",tip="Sketch it first. The side you want is opposite the angle at the <b>second</b> observer."),
  Q("A triangle has sides 5 cm, 6 cm and 7 cm. Find its area.",4,"14.7 cm²","Find one angle by the cosine rule (e.g. 78.5° between 5 and 6), then ½ × 5 × 6 × sin 78.5°.",lines=5,label="cm²"),
  Q("A parallelogram has sides of 8 cm and 5 cm, with angles of 60° and 120°. Find the length of its longer diagonal.",3,"11.4 cm","d² = 64 + 25 − 80 cos 120°.",label="cm"),
  Q("In triangle XYZ, XY = 12 cm, angle X = 35° and angle Y = 80°. Find XZ.",3,"13.0 cm","Angle Z = 65°. 12 sin 80° ÷ sin 65°.",label="cm"),
  Q("Jas used the cosine rule with b = 7, c = 9 and A = 50°. Find her mistake.",2,"a = 7.00 cm","She multiplied the whole of b² + c² − 2bc by cos A. Only 2bc is multiplied by cos A.",tampered="a² = (49 + 81 − 126) cos 50° = 2.57<br>a = 1.60 cm",label="Correct a")],
 [Q("In triangle ABC, a = 7 cm, b = 9 cm and angle A = 40°. Find the two possible sizes of angle B.",3,"55.7° or 124.3°","sin B = 9 sin 40° ÷ 7 = 0.826. The second angle is 180° − 55.7°.",label="°",tip="When the side opposite the known angle is the <b>shorter</b> one, two triangles can fit. Check whether 180° minus your angle also works."),
  Q("A triangle has an area of 30 cm². Two of its sides are 8 cm and 10 cm. Find the acute angle between them.",3,"48.6°","½ × 8 × 10 × sin C = 30, so sin C = 0.75.",label="°"),
  Q("A patrol boat sails 12 km on a bearing of 060°, then 8 km on a bearing of 130°. How far is it from its start?",4,"16.5 km","The angle at the turn is 180° − 70° = 110°. d² = 144 + 64 − 192 cos 110°.",lines=6,label="km"),
  Q("A triangle has sides x cm, (x + 1) cm and (x + 2) cm. The largest angle is 120°. Find x.",4,"x = 1.5","(x + 2)² = x² + (x + 1)² − 2x(x + 1) cos 120° → 2x² − x − 3 = 0 → (2x − 3)(x + 1) = 0.",lines=6,label="x ="),
  Q("Show that the area of an equilateral triangle with side s is (√3/4)s².",2,"½ × s × s × sin 60° = ½ s² × √3/2 = (√3/4)s²",lines=3,label=False)],
 ["Label any triangle and choose between the sine and cosine rules.","Find missing sides and angles in triangles without a right angle.","Find the area of any triangle with ½ab sin C.","Spot the ambiguous case and give both angles.","Use the rules with bearings and with algebra."])

S["geo-pythagoras-trig"]=sheet("MF-CF-GEO-PYTHTRIG","Shape","Pythagoras and trigonometry in 2D and 3D","3D trigonometry and Pythagoras",
 "Right-angled triangles are everywhere, even inside boxes. Secure Pythagoras and SOH CAH TOA, extend to elevation and bearings, then master lengths and angles in 3D.",
 ["Pythagoras and SOH CAH TOA in one triangle.","Two-step problems, elevation, bearings, and tampered evidence.","Lengths and angles inside cuboids and pyramids."],
 ["<b>Pythagoras</b>: in a right-angled triangle, <i>a</i>² + <i>b</i>² = <i>c</i>², where <i>c</i> is the hypotenuse (opposite the right angle). Add to find the hypotenuse; subtract to find a shorter side.",
  "<b>SOH CAH TOA</b>: sin = "+F("opp","hyp")+", cos = "+F("adj","hyp")+", tan = "+F("opp","adj")+". In <b>3D</b>, find a right-angled triangle inside the shape, often using a diagonal of the base first."],
 ["Find a right-angled triangle and sketch it flat.","Label hyp, opp and adj from the angle you're using.","Two sides, no angle: Pythagoras. An angle involved: SOH CAH TOA.","In 3D, work out the base diagonal first, then use it in a vertical triangle."],
 {"question":"A cuboid measures 3 cm by 4 cm by 12 cm. Find the length of the longest diagonal.","steps":["The base is 3 cm by 4 cm. Its diagonal: √(3² + 4²) = √25 = 5 cm.","The longest diagonal makes a right-angled triangle with the base diagonal (5 cm) and the height (12 cm).","Diagonal = √(5² + 12²) = √169.","= 13 cm. In one step: √(3² + 4² + 12²) = 13 ✓"],"answer":"13 cm"},
 [Q("A right-angled triangle has shorter sides of 9 cm and 12 cm. Find the hypotenuse.",2,"15 cm","√(81 + 144).",label="cm"),
  Q("A right-angled triangle has a hypotenuse of 13 cm and one side of 5 cm. Find the other side.",2,"12 cm","√(169 − 25).",label="cm",tip="Finding a shorter side means <b>subtract</b>. If your answer is longer than the hypotenuse, you added."),
  W(Q("Find the length x. Give your answer to 3 significant figures.",2,"5.74 cm","x = 10 sin 35°.",label="cm"),tri([(0,0),(8.19,0),(8.19,5.74)],sides={(0,2):"10 cm",(1,2):"x"},angles={0:"35°"},right=1)),
  Q("A right-angled triangle has an opposite side of 7 cm and an adjacent side of 10 cm. Find the angle.",2,"35.0°","tan⁻¹(0.7).",label="°"),
  Q("A 5 m ladder leans against a wall with its foot 1.4 m from the wall. How high up the wall does it reach?",2,"4.8 m","√(25 − 1.96).",label="m")],
 [Q("An isosceles triangle has sides 10 cm, 10 cm and 12 cm. Find its area.",3,"48 cm²","Height √(100 − 36) = 8. ½ × 12 × 8.",label="cm²"),
  Q("A drone hovers 40 m above the ground. An officer stands 65 m from the point directly below it. Find the angle of elevation of the drone.",2,"31.6°","tan⁻¹(40 ÷ 65).",label="°"),
  Q("A rectangle measures 8 cm by 5 cm. Find the angle between a diagonal and a longer side.",2,"32.0°","tan⁻¹(5 ÷ 8).",label="°"),
  Q("A suspect walks 6 km north, then 8 km east. Find how far she is from her start, and the bearing she would need to walk back on.",3,"10 km on a bearing of 233°","The start-to-finish bearing is tan⁻¹(8/6) = 053°; the way back is 053° + 180°.",label="____ km, bearing"),
  Q("Rui found the missing side of a right-angled triangle with hypotenuse 10 cm and one side 6 cm. Find his mistake.",2,"8 cm","He added instead of subtracting: √(100 − 36) = 8.",tampered="√(10² + 6²) = √136 = 11.7 cm",label="cm")],
 [W(Q("The cuboid ABCDEFGH measures 3 cm by 4 cm by 12 cm. Find the length AG.",3,"13 cm","√(3² + 4² + 12²).",label="cm"),cuboid(3,4,4.8,dims=("3 cm","4 cm","12 cm"),diag=[("A","G"),("A","C")])),
  Q("For the same cuboid, find the angle between AG and the base ABCD.",3,"67.4°","AC = 5 cm, CG = 12 cm. tan⁻¹(12 ÷ 5).",label="°",tip="The angle with the base is in triangle ACG: AC on the base, CG straight up. Sketch that triangle flat."),
  Q("A square-based pyramid has a base of side 6 cm. The apex is directly above the centre of the base, and each sloping edge is 7 cm. Find the height of the pyramid.",4,"5.57 cm","Half the base diagonal is √18 = 4.24. Height √(49 − 18) = √31.",lines=6,label="cm"),
  Q("For the same pyramid, find the angle between a sloping edge and the base.",2,"52.7°","cos⁻¹(√18 ÷ 7).",label="°"),
  Q("A right-angled triangle has shorter sides x cm and (x + 7) cm, and a hypotenuse of 13 cm. Find x.",4,"x = 5","x² + (x + 7)² = 169 → x² + 7x − 60 = 0 → (x + 12)(x − 5) = 0.",lines=5,label="x =")],
 ["Use Pythagoras to find any side of a right-angled triangle.","Choose sin, cos or tan and find sides and angles.","Solve problems with elevation, bearings and two steps.","Find lengths and angles inside cuboids and pyramids.","Form and solve an equation from Pythagoras."])
for name,d in S.items():
    for sec in d["sections"].values():
        for q in sec["questions"]:
            if "answer_label" in q and q["answer_label"] is None: q["answer_label"]=False
    json.dump(d,open(f"{name}.json","w"),ensure_ascii=False,indent=1)
print(list(S))
