import json, math
from batch1 import Q, sheet, F, R
from diagrams import circ, poly, tri
def W(q,svg): q["svg"]=svg; return q
x,y='<i>x</i>','<i>y</i>'
S={}
# ---------- similar shapes
SIM1=poly({"A":(0,0),"B":(4,0),"C":(1,3),"D":(7,0),"E":(17,0),"F":(9.5,7.5)},segs=[("A","B"),("B","C"),("C","A"),("D","E"),("E","F"),("F","D")],sides={("A","B"):"4 cm",("A","C"):"6 cm",("D","E"):"10 cm",("D","F"):"x"},w=96,h=44)
PAR=poly({"A":(3,6),"D":(0,0),"E":(8,0),"B":(1.8,3.6),"C":(5,3.6)},segs=[("A","B"),("B","D"),("A","C"),("C","E"),("D","E"),("B","C")],sides={("A","B"):"4 cm",("B","D"):"6 cm",("B","C"):"5 cm"},w=70,h=50)
BOW=poly({"A":(0,4),"B":(4,4),"C":(2,2.4),"D":(-1,0),"E":(5,0)},segs=[("A","B"),("D","E"),("A","C"),("C","E"),("B","C"),("C","D")],sides={("A","B"):"8 cm",("D","E"):"12 cm",("A","C"):"6 cm",("C","E"):"x"},w=70,h=46)
S["geo-similar-shapes"]=sheet("MF-CF-GEO-SIMILAR","Shape","Similar shapes","Similar shapes: lengths",
 "Same shape, different size. Secure the scale factor for lengths, extend to triangles inside triangles and to area and volume, then master problems that switch between all three.",
 ["Scale factors and missing lengths in similar shapes.","Triangles inside triangles, area and volume scale factors, and tampered evidence.","Switching between length, area and volume, maps, and proving similarity."],
 ["Similar shapes have equal angles and every length multiplied by the same <b>scale factor</b> <i>k</i>. Find <i>k</i> from a pair of <b>corresponding</b> sides: new ÷ old.",
  "Areas scale by <i>k</i>², and volumes by <i>k</i>³. To go back from areas or volumes to lengths, take the square root or the cube root."],
 ["Match up corresponding sides. Redraw the shapes the same way round if it helps.","Find the length scale factor k from one matching pair.","Multiply lengths by k, areas by k², volumes by k³.","Check: the bigger shape should have the bigger answers."],
 {"question":"Two similar evidence boxes have heights 10 cm and 15 cm. The smaller box has a volume of 400 cm³. Find the volume of the larger box.","steps":["Length scale factor: k = 15 ÷ 10 = 1.5.","Volume scale factor: k³ = 1.5³ = 3.375.","Larger volume = 400 × 3.375.","= 1350 cm³. Check: bigger box, bigger volume ✓"],"answer":"1350 cm³"},
 [W(Q("The two triangles are similar. Find the length x.",2,"15 cm","Scale factor 10 ÷ 4 = 2.5. 6 × 2.5.",label="cm"),SIM1),
  Q("A rectangle measures 3 cm by 5 cm. A similar rectangle measures 9 cm by 15 cm. Write down the scale factor.",1,"3",label="Answer"),
  Q("Two shapes are similar. A side of 8 cm in the small shape matches a side of 12 cm in the large one. Another side of the small shape is 10 cm. Find the matching side in the large shape.",2,"15 cm","k = 1.5.",label="cm"),
  Q("A photo 15 cm wide and 10 cm tall is enlarged to 24 cm wide. How tall is the enlargement?",2,"16 cm","k = 24 ÷ 15 = 1.6.",label="cm",tip="Work out the scale factor by <b>multiplying</b>, not adding. Adding 9 cm to the height would distort the photo."),
  Q("Are triangles with sides 3, 4, 5 and 6, 8, 10 similar? Give a reason.",2,"Yes: every side is multiplied by 2.",label="Yes / No")],
 [W(Q("BC is parallel to DE. Find the length DE.",3,"12.5 cm","Triangles ABC and ADE are similar. AD = 10, so k = 10 ÷ 4 = 2.5. 5 × 2.5.",label="cm",tip="Use the <b>whole</b> side AD = 4 + 6 = 10, not BD = 6. The triangles share the corner A."),PAR),
  Q("Two similar shapes have lengths in the ratio 2 : 3. The smaller has an area of 20 cm². Find the area of the larger.",2,"45 cm²","Area factor (3/2)² = 2.25.",label="cm²"),
  Q("Two similar cylinders have heights 6 cm and 9 cm. The smaller has a volume of 80 cm³. Find the volume of the larger.",2,"270 cm³","(1.5)³ = 3.375.",label="cm³"),
  Q("Two similar cones have surface areas of 50 cm² and 200 cm². Find the ratio of their heights.",2,"1 : 2","Area factor 4, so length factor √4.",label="Ratio"),
  Q("Ella enlarged a shape of area 12 cm² by scale factor 3. Find her mistake.",2,"108 cm²","Areas scale by 3² = 9, not 3.",tampered="Lengths × 3, so area × 3<br>12 × 3 = 36 cm²",label="cm²")],
 [Q("Two similar bottles have volumes of 250 cm³ and 2000 cm³. The small bottle is 12 cm tall and has a surface area of 300 cm². Find the height and the surface area of the large bottle.",4,"24 cm and 1200 cm²","Volume factor 8, so k = 2. Area factor 4.",lines=5,label="____ cm ____ cm²"),
  Q("Two similar solids have surface areas of 64 cm² and 100 cm². The smaller has a volume of 256 cm³. Find the volume of the larger.",4,"500 cm³","Length factor √(100/64) = 1.25. Volume factor 1.25³ = 1.953125.",lines=5,label="cm³",tip="Go back to the <b>length</b> scale factor first. You can't get from an area factor to a volume factor directly."),
  Q("In triangle ABC, D is on AB and E is on AC, with angle ADE = angle ACB. AD = 4 cm, AE = 6 cm and AC = 8 cm. Find AB.",3,"12 cm","Triangles ADE and ACB are similar (angle A is shared). AD/AC = AE/AB.",label="cm"),
  Q("A map has a scale of 1 : 25 000. A lake has an area of 6 cm² on the map. Find its real area in m².",3,"375 000 m²","6 × 25 000² = 3 750 000 000 cm². ÷ 10 000.",label="m²"),
  W(Q("AB is parallel to DE. Explain why triangles ABC and EDC are similar, then find x.",3,"x = 9 cm","Vertically opposite angles at C are equal; alternate angles A and E are equal. k = 12 ÷ 8 = 1.5.",lines=5,label="cm"),BOW)],
 ["Find a scale factor from corresponding sides.","Find missing lengths, including triangles inside triangles.","Use k² for areas and k³ for volumes.","Work back from an area or volume factor to a length factor.","Give geometric reasons for similarity."])

# ---------- congruence
PG=poly({"A":(0,0),"B":(6,0),"C":(8,3.5),"D":(2,3.5)},segs=[("A","B"),("B","C"),("C","D"),("D","A"),("A","C")],w=70,h=38)
ISO=poly({"A":(3,6),"B":(0,0),"C":(6,0),"D":(1.2,2.4),"E":(4.8,2.4)},segs=[("A","B"),("A","C"),("B","C"),("B","E"),("C","D")],w=60,h=46)
S["geo-congruence"]=sheet("MF-CF-GEO-CONGRUENCE","Shape","Congruence","Congruence proofs",
 "Same shape, same size, proved beyond doubt. Secure the four conditions, extend to proofs in quadrilaterals, then master proofs that use circles and isosceles triangles.",
 ["SSS, SAS, ASA and RHS, and picking the right one.","Proofs inside parallelograms, kites and isosceles triangles, and tampered evidence.","Multi-step proofs, and what congruence lets you conclude."],
 ["Two triangles are <b>congruent</b> if they are exactly the same shape and size. You only need to show one of four conditions: <b>SSS</b> (three sides), <b>SAS</b> (two sides and the angle between them), <b>ASA</b> (two angles and a corresponding side) or <b>RHS</b> (right angle, hypotenuse, side).",
  "AAA is <b>not</b> enough: it proves similar, not congruent. A congruence proof is a short list of three facts, each with a reason, then the condition."],
 ["Name the two triangles, with the letters in matching order.","Find three pairs of equal sides or angles.","Give a reason for each: 'opposite sides of a parallelogram', 'common side', 'radii'.","State the condition (SSS, SAS, ASA or RHS), then what follows from it."],
 {"question":"ABCD is a parallelogram. Prove that triangles ABC and CDA are congruent.","steps":["AB = CD (opposite sides of a parallelogram are equal).","BC = DA (opposite sides of a parallelogram are equal).","AC = CA (common side).","So triangles ABC and CDA are congruent (SSS)."],"answer":"Congruent by SSS"},
 [Q("Write down the four conditions for two triangles to be congruent.",2,"SSS, SAS, ASA, RHS",label=False,lines=2),
  Q("Triangle P has sides 5 cm and 7 cm with an angle of 40° between them. Triangle Q has the same. Which condition shows they are congruent?",1,"SAS",label="Answer"),
  Q("Two triangles both have angles of 50°, 60° and 70°. Must they be congruent? Explain.",2,"No: equal angles show they're similar, but one could be bigger.",label="Yes / No"),
  Q("In triangles ABC and DEF, AB = DE, BC = EF and AC = DF. State the condition, and name the angle equal to angle A.",2,"SSS; angle D",label="____ ; angle"),
  Q("Two right-angled triangles each have a hypotenuse of 10 cm and another side of 6 cm. Which condition shows they are congruent?",1,"RHS",label="Answer")],
 [W(Q("ABCD is a parallelogram. Prove that angle ABC = angle CDA.",3,"AB = CD and BC = DA (opposite sides of a parallelogram), AC common, so ABC ≅ CDA (SSS). Corresponding angles ABC and CDA are equal.",lines=5,label=False,tip="Once triangles are congruent, every matching side and angle is equal. That's how a proof gets you to the fact you want."),PG),
  Q("Triangle ABC has AB = AC. M is the midpoint of BC. Prove that triangles ABM and ACM are congruent, and explain why AM is perpendicular to BC.",3,"AB = AC (given), BM = CM (M is the midpoint), AM common: SSS. So angles AMB and AMC are equal, and they add to 180°, so each is 90°.",lines=5,label=False),
  Q("ABCD is a kite with AB = AD and CB = CD. Prove that triangles ABC and ADC are congruent.",3,"AB = AD, CB = CD (given), AC common: SSS.",lines=4,label=False),
  Q("ABCD is a square. E is on AB and F is on BC, with AE = BF. Prove that triangles DAE and ABF are congruent.",3,"DA = AB (sides of a square), AE = BF (given), angle DAE = angle ABF = 90°: SAS.",lines=4,label=False),
  Q("Sam's proof is below. Find the flaw.",2,"The 5 cm sides don't correspond: one is opposite 30°, the other opposite 60°. ASA needs a corresponding side.",tampered="Both triangles have angles 30°, 60°, 90° and a side of 5 cm.<br>So they are congruent (ASA).",lines=3,label=False)],
 [Q("PQRS is a parallelogram. X is on PQ and Y is on RS, with PX = RY. Prove that triangles PXS and RYQ are congruent.",4,"PS = RQ (opposite sides), PX = RY (given), angle P = angle R (opposite angles of a parallelogram): SAS.",lines=6,label=False),
  Q("Prove that the diagonals of a parallelogram ABCD bisect each other. Let them meet at M.",4,"AB = CD (opposite sides); angle MAB = angle MCD and angle MBA = angle MDC (alternate angles, AB ∥ DC). So ABM ≅ CDM (ASA), giving AM = CM and BM = DM.",lines=6,label=False),
  Q("A and B lie on a circle with centre O. M is the midpoint of the chord AB. Prove that OM is perpendicular to AB.",4,"OA = OB (radii), AM = BM (M is the midpoint), OM common: SSS. So angles OMA and OMB are equal and add to 180°, so each is 90°.",lines=6,label=False),
  W(Q("ABC is isosceles with AB = AC. D is on AB and E is on AC, with BD = CE. Prove that BE = CD.",4,"BD = CE (given), BC common, angle DBC = angle ECB (base angles of an isosceles triangle). So DBC ≅ ECB (SAS), and BE = CD.",lines=6,label=False,tip="Choose the triangles that contain the two lengths you need: BE is in triangle EBC, CD is in triangle DCB."),ISO),
  Q("Explain why 'two sides and an angle that is not between them' (SSA) is not a condition for congruence.",2,"Two different triangles can fit the same two sides and non-included angle (the ambiguous case), so they needn't be congruent.",lines=3,label=False)],
 ["Use SSS, SAS, ASA and RHS, and know AAA isn't enough.","Match corresponding vertices when naming triangles.","Give a reason for every fact in a proof.","Use congruence to prove lengths and angles equal.","Prove properties of parallelograms, kites, isosceles triangles and circles."])

# ---------- circle theorems
C1=circ({"A":210,"B":330,"C":95},segs=[("O","A"),("O","B"),("C","A"),("C","B")],angles={("A","O","B"):"110°",("A","C","B"):"x"})
C2=circ({"A":180,"B":0,"C":125},segs=[("A","B"),("A","C"),("C","B")],angles={("C","A","B"):"35°",("A","B","C"):"x"})
C3=circ({"A":205,"B":335,"C":65,"D":120},segs=[("A","C"),("B","C"),("A","D"),("B","D")],angles={("A","D","B"):"42°",("A","C","B"):"x"},center=None)
C4=circ({"A":150,"B":230,"C":320,"D":55},segs=[("A","B"),("B","C"),("C","D"),("D","A")],angles={("D","A","B"):"75°",("B","C","D"):"x"},center=None)
C5=circ({"T":270,"P":(1.55,-1)},segs=[("O","T"),("O","P"),("T","P")],angles={("T","O","P"):"58°",("O","P","T"):"x"},tangents=[("T",1.8)],w=60,h=46)
th=math.degrees(math.acos(1/1.6))
C6=circ({"A":270-th,"B":270+th,"P":(0,-1.6)},segs=[("P","A"),("P","B"),("O","A"),("O","B")],angles={("A","P","B"):"50°",("A","O","B"):"x"},w=50,h=68)
C7=circ({"A":205,"B":335,"C":90},segs=[("O","A"),("O","B"),("A","B"),("C","A"),("C","B")],angles={("O","A","B"):"28°",("A","O","B"):"x",("A","C","B"):"y"})
C8=circ({"A":270,"B":25,"C":150,"T":(1.3,-1)},segs=[("A","B"),("A","C"),("B","C")],angles={("T","A","B"):"64°",("A","C","B"):"x"},tangents=[("A",1.6)],center=None,w=60,h=46)
C9=circ({"A":150,"B":230,"C":320,"D":55},segs=[("A","B"),("B","C"),("C","D"),("D","A")],angles={("A","B","C"):"2x",("C","D","A"):"x + 30°"},center=None)
S["geo-circle-theorems"]=sheet("MF-CF-GEO-CIRCLES","Shape","Circle theorems","Circle theorems",
 "Seven theorems, and a reason for every angle. Secure spotting each theorem, extend to tangents and isosceles triangles hiding in radii, then master multi-step chains and proof.",
 ["One theorem at a time, with the reason written.","Tangents from a point, radii, the alternate segment, algebra, and tampered evidence.","Chains of theorems, proofs, and chords."],
 ["The angle at the <b>centre</b> is twice the angle at the circumference. The angle in a <b>semicircle</b> is 90°. Angles in the <b>same segment</b> are equal. Opposite angles of a <b>cyclic quadrilateral</b> add to 180°.",
  "A <b>tangent</b> meets a radius at 90°. Two tangents from one point are <b>equal</b>. The angle between a tangent and a chord equals the angle in the <b>alternate segment</b>. The perpendicular from the centre to a chord <b>bisects</b> it. Two radii make an <b>isosceles</b> triangle."],
 ["Mark every radius: two radii mean an isosceles triangle.","Look for the shape the theorem needs: a 'bow tie', an 'arrowhead', a quadrilateral, a tangent.","Write the angle and the theorem's reason, every time. Reasons earn marks.","Use ordinary angle facts too: triangles 180°, straight lines 180°."],
 {"question":"A, B and C are on a circle with centre O. Angle OAB = 20°. Find angle ACB, giving reasons.","steps":["OA = OB (radii), so triangle OAB is isosceles: angle OBA = 20°.","Angle AOB = 180° − 20° − 20° = 140° (angles in a triangle add to 180°).","The angle at the centre is twice the angle at the circumference.","So angle ACB = 140° ÷ 2 = 70°."],"answer":"Angle ACB = 70°"},
 [W(Q("O is the centre of the circle. Find x, giving a reason.",2,"55°","The angle at the centre is twice the angle at the circumference.",label=f"{x} ="),C1),
  W(Q("AB is a diameter. Find x, giving reasons.",2,"55°","The angle in a semicircle is 90°, so x = 180° − 90° − 35°.",label=f"{x} ="),C2),
  W(Q("Find x, giving a reason.",2,"42°","Angles in the same segment are equal.",label=f"{x} =",tip="Look for the 'bow tie': two angles standing on the same chord AB, on the same side."),C3),
  W(Q("ABCD is a cyclic quadrilateral. Find x, giving a reason.",2,"105°","Opposite angles of a cyclic quadrilateral add to 180°.",label=f"{x} ="),C4),
  W(Q("PT is a tangent to the circle at T, and O is the centre. Find x, giving reasons.",2,"32°","A tangent meets a radius at 90°, so x = 180° − 90° − 58°.",label=f"{x} ="),C5)],
 [W(Q("PA and PB are tangents to the circle with centre O. Find x, giving reasons.",3,"130°","Angles OAP and OBP are 90° (tangent meets radius). Angles in a quadrilateral: 360° − 90° − 90° − 50°.",label=f"{x} ="),C6),
  W(Q("O is the centre. Find x and y, giving reasons.",3,"x = 124°, y = 62°","OA = OB (radii) so angle OBA = 28°; x = 180° − 56°. y = x ÷ 2 (angle at the centre).",label=f"{x} = ____ {y} =",tip="Two radii make an isosceles triangle. This is the step most students miss."),C7),
  W(Q("The line through A is a tangent to the circle. Find x, giving a reason.",2,"64°","Alternate segment theorem.",label=f"{x} ="),C8),
  W(Q("ABCD is a cyclic quadrilateral. Find x.",3,"x = 50°","2x + x + 30° = 180°.",label=f"{x} ="),C9),
  Q("A point C is on a circle with centre O. Angle AOB = 140°. Kim wrote the line below. Find her mistake.",2,"70°","The angle at the centre is <b>twice</b> the angle at the circumference, so halve it.",tampered="angle ACB = 2 × 140° = 280°",label="angle ACB =")],
 [Q(["AB is a diameter of a circle with centre O. C is on the circle. The tangent at C meets AB extended at P, and angle CPA = 30°.","Find angle CAP, giving reasons."],4,"30°","Angle OCP = 90° (tangent meets radius), so angle COP = 60°. OA = OC (radii), so triangle OAC is isosceles; the exterior angle COP = 2 × angle CAO.",lines=6,label="angle CAP ="),
  Q("Use the angle at the centre theorem to prove that opposite angles of a cyclic quadrilateral add up to 180°.",4,"Join both opposite vertices to O. The two angles at O are 2a and 2c and make a full turn: 2a + 2c = 360°, so a + c = 180°.",lines=6,label=False),
  Q(f"In a cyclic quadrilateral ABCD, angle A = 2{y}, angle B = 3{x}, angle C = 4{y} − 30° and angle D = {x} + 40°. Find {x} and {y}.",4,f"{x} = 35°, {y} = 35°","A + C = 180: 6y − 30 = 180. B + D = 180: 4x + 40 = 180.",lines=5,label=f"{x} = ____ {y} ="),
  Q("PA and PB are tangents to a circle with centre O, and angle APB = 40°. C is a point on the major arc AB. Find angle ACB, giving reasons.",3,"70°","Angle AOB = 360° − 90° − 90° − 40° = 140°. Angle at the centre is twice angle ACB.",lines=5,label="angle ACB ="),
  Q("A circle has radius 13 cm. A chord of the circle is 24 cm long. Find the distance from the centre to the chord.",3,"5 cm","The perpendicular from the centre bisects the chord: √(13² − 12²).",label="cm")],
 ["Recognise all seven circle theorems in a diagram.","Write a reason for every angle you find.","Spot the isosceles triangle made by two radii.","Combine theorems with angle facts in multi-step chains.","Prove a circle theorem from another."])
_c=S["geo-circle-theorems"]["sections"]
for q in _c["m"]["questions"]: q["lines"]=min(q.get("lines",4),4)
for q in _c["s"]["questions"]+_c["e"]["questions"]: q["lines"]=min(q.get("lines",2),2)
for name,d in S.items():
    json.dump(d,open(f"{name}.json","w"),ensure_ascii=False,indent=1)
print(list(S))
