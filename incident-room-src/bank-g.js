/* ---------- GEOMETRY & MEASURES ---------- */
// G1 Angle facts & parallel lines
MC("G1", "F", "Two angles on a straight line are 3x and 2x. Find x.", ["36°", "72°", "18°", "90°"], "Angles on a straight line add up to 180°: 5x = 180, so x = 36°.", 30);
TF("G1", "F", "Alternate angles on parallel lines are equal.", true, "Alternate (Z) angles are equal when the lines are parallel.", 15);
SP("G1", "F", "Two angles in a triangle are 48° and 75°. Find the third angle.", ["Angles in a triangle add up to 360°", "360 − 48 − 75 = 237°"], 0,
  ["Angles in a triangle add up to 180°", "Angles in a triangle add up to 90°", "Angles in a triangle add up to 270°"], "57°", ["57"], "Angles in a triangle add up to 180°: 180 − 48 − 75 = 57°.", 35);
TY("G1", "F", "Three angles around a point are 120°, 95° and x. Find x.", "145°", ["145"], "Angles around a point add up to 360°: 360 − 120 − 95 = 145°.", "a number", 30);
MC("G1", "F", "Co-interior (allied) angles between parallel lines add up to…", ["180°", "90°", "360°", "They are equal"], "Co-interior (C) angles are on the same side between the parallel lines and add up to 180°.", 20);
ME("G1", "F", "An isosceles triangle has an angle of 40° between its two equal sides. Which finds each of the other two angles?", ["(180 − 40) ÷ 2", "180 − 40 × 2", "(360 − 40) ÷ 2", "40 ÷ 2"], "The other two angles are equal and share what is left of 180°: (180 − 40) ÷ 2 = 70°.", 35);
// G2 Angles in polygons
MC("G2", "F", "What is the sum of the interior angles of a hexagon?", ["720°", "1080°", "360°", "540°"], "Sum = (n − 2) × 180 = 4 × 180 = 720°.", 25);
SP("G2", "F", "Find each interior angle of a regular pentagon.", ["Sum = (5 − 2) × 180 = 540°", "Each angle = 540 ÷ 6 = 90°"], 1,
  ["Each angle = 540 ÷ 5 = 108°", "Each angle = 540 ÷ 3 = 180°", "Each angle = 360 ÷ 5 = 72°"], "108°", ["108"], "A pentagon has 5 equal angles, so divide by 5: 540 ÷ 5 = 108°.", 40);
TY("G2", "F", "Each exterior angle of a regular polygon is 30°. How many sides does it have?", "12", ["12"], "Exterior angles add up to 360°: 360 ÷ 30 = 12 sides.", "a number", 30);
TF("G2", "F", "The exterior angles of any polygon add up to 360°.", true, "Walking around any polygon you turn through one full turn, 360°.", 15);
MC("G2", "F", "What is each exterior angle of a regular octagon?", ["45°", "135°", "40°", "60°"], "360 ÷ 8 = 45°. (135° is the interior angle.)", 25);
OR("G2", "F", "Put these regular polygons in order of interior angle, from smallest to largest.", "smallest to largest", ["Equilateral triangle", "Square", "Regular hexagon", "Regular decagon"], "The interior angles are 60°, 90°, 120° and 144°. More sides means bigger angles.");
// G3 Properties of shapes
MC("G3", "F", "How many lines of symmetry does a regular hexagon have?", ["6", "3", "12", "2"], "A regular polygon has as many lines of symmetry as it has sides.", 20);
TF("G3", "F", "A parallelogram that isn't a rectangle or rhombus has 2 lines of symmetry.", false, "A general parallelogram has no lines of symmetry, but it has rotational symmetry of order 2.");
MC("G3", "F", "Which quadrilateral has exactly one pair of parallel sides?", ["Trapezium", "Parallelogram", "Rhombus", "Kite"], "A trapezium has exactly one pair of parallel sides. Parallelograms and rhombuses have two; a kite has none.", 25);
TY("G3", "F", "What is the order of rotational symmetry of a square?", "4", ["4"], "A square looks the same 4 times in a full turn (every 90°).", "a number", 20);
MC("G3", "F", "Which 3D shape has 6 faces, 12 edges and 8 vertices?", ["Cuboid", "Square-based pyramid", "Triangular prism", "Tetrahedron"], "A cuboid has 6 faces, 12 edges and 8 vertices.", 25);
TF("G3", "F", "All four sides of a rhombus are equal.", true, "A rhombus is a parallelogram with four equal sides.", 15);
// G4 Perimeter & area
MC("G4", "F", "Find the area of a triangle with base 10 cm and height 7 cm.", ["35 cm²", "70 cm²", "17 cm²", "34 cm²"], "Area = ½ × base × height = ½ × 10 × 7 = 35 cm².", 25);
SP("G4", "F", "Find the area of a trapezium with parallel sides 6 cm and 10 cm and height 4 cm.", ["Area = ½(a + b)h", "= ½ × (6 + 10) × 4", "= ½ × 16 × 4 = 64 cm²"], 2,
  ["= ½ × 16 × 4 = 32 cm²", "= 16 × 4 = 64 cm²", "= ½ × 6 × 10 × 4 = 120 cm²"], "32 cm²", ["32"], "16 × 4 = 64, and half of 64 is 32. The ½ was forgotten.");
TY("G4", "F", "A rectangle has area 48 cm² and length 8 cm. Find its perimeter.", "28 cm", ["28"], "Width = 48 ÷ 8 = 6 cm. Perimeter = 2 × (8 + 6) = 28 cm.", "a number", 40);
TF("G4", "F", "A parallelogram with base 9 cm and slanted side 5 cm has area 45 cm².", false, "Area = base × perpendicular height. The slanted side is not the height, so the area is less than 45 cm².", 30);
ME("G4", "F", "Which method finds the area of an L-shape?", ["Split it into two rectangles and add their areas", "Multiply the two longest sides", "Add up all the sides", "Multiply all the sides together"], "Split the compound shape into rectangles, find each area, then add.", 25);
MC("G4", "F", "A square has perimeter 36 cm. What is its area?", ["81 cm²", "36 cm²", "144 cm²", "1296 cm²"], "Each side is 36 ÷ 4 = 9 cm, so the area is 9 × 9 = 81 cm².", 30);
// G5 Circles
MC("G5", "F", "Find the circumference of a circle with diameter 10 cm. Use π = 3.14.", ["31.4 cm", "78.5 cm", "62.8 cm", "314 cm"], "Circumference = π × d = 3.14 × 10 = 31.4 cm.", 25);
SP("G5", "F", "Find the area of a circle with diameter 8 cm, in terms of π.", ["Area = πr²", "r = 8", "Area = 64π cm²"], 1,
  ["r = 4", "r = 16", "r = 8²"], "16π cm²", ["16π"], "The radius is half the diameter: r = 4, so the area is π × 4² = 16π cm².");
TY("G5", "F", "A circle has radius 5 cm. Find its area to 1 decimal place.", "78.5 cm²", ["78.5"], "π × 5² = 25π = 78.539… = 78.5 cm².", "a number", 40);
TF("G5", "F", "The circumference of a circle is πr².", false, "πr² is the area. The circumference is πd (or 2πr).", 15);
MC("G5", "F", "A circle has circumference 20π cm. What is its radius?", ["10 cm", "20 cm", "5 cm", "√20 cm"], "C = 2πr, so 2πr = 20π and r = 10 cm.", 30);
ME("G5", "F", "Which calculation gives the perimeter of a semicircle with diameter 12 cm?", ["π × 12 ÷ 2 + 12", "π × 12 ÷ 2", "π × 6² ÷ 2", "π × 12 + 12"], "Half the circumference plus the straight edge: 6π + 12 ≈ 30.8 cm.", 35);
// G6 Arcs & sectors
MC("G6", "F", "Find the area of a sector with radius 6 cm and angle 90°, in terms of π.", ["9π cm²", "36π cm²", "3π cm²", "18π cm²"], "90/360 × π × 6² = ¼ × 36π = 9π cm².", 35);
SP("G6", "F", "Find the arc length of a sector with radius 10 cm and angle 72°, in terms of π.", ["Arc length = θ/360 × πd", "= 72/360 × π × 10", "= 2π cm"], 1,
  ["= 72/360 × π × 20", "= 72/360 × π × 10²", "= 360/72 × π × 20"], "4π cm", ["4π"], "Use the diameter (20 cm), not the radius: 72/360 × 20π = ⅕ × 20π = 4π cm.", 50);
TY("G6", "F", "A sector has angle 120° and radius 3 cm. Find its area in terms of π.", "3π cm²", ["3π"], "120/360 × π × 3² = ⅓ × 9π = 3π cm².", "e.g. 5π", 45);
TF("G6", "F", "A sector with an angle of 180° is a semicircle.", true, "180° is half of 360°, so the sector is half the circle.", 15);
ME("G6", "H", "A sector has area 12π cm² and radius 6 cm. Which equation finds its angle θ?", ["θ/360 × 36π = 12π", "θ/360 × 12π = 36π", "θ × 6 = 12π", "θ/360 × 6π = 12π"], "θ/360 × π × 6² = 12π, so θ/360 = ⅓ and θ = 120°.", 40);
// G7 Volume & surface area
MC("G7", "F", "Find the volume of a cuboid 5 cm by 4 cm by 3 cm.", ["60 cm³", "12 cm³", "47 cm³", "94 cm³"], "Volume = 5 × 4 × 3 = 60 cm³. (94 cm² is its surface area.)", 25);
SP("G7", "F", "Find the volume of a cylinder with radius 3 cm and height 10 cm, in terms of π.", ["Volume = πr²h", "= π × 3 × 10", "= 30π cm³"], 1,
  ["= π × 3² × 10", "= π × 6 × 10", "= 2π × 3 × 10"], "90π cm³", ["90π"], "The radius must be squared: π × 9 × 10 = 90π cm³.");
TY("G7", "F", "Find the surface area of a cube with sides of 4 cm.", "96 cm²", ["96"], "6 faces, each 4 × 4 = 16 cm²: 6 × 16 = 96 cm².", "a number", 30);
TF("G7", "F", "Volume of a prism = area of cross-section × length.", true, "A prism has the same cross-section all the way through, so multiply its area by the length.", 15);
MC("G7", "F", "A triangular prism has cross-section area 12 cm² and length 9 cm. Find its volume.", ["108 cm³", "21 cm³", "54 cm³", "216 cm³"], "Volume = 12 × 9 = 108 cm³.", 25);
ME("G7", "F", "Which formula gives the total surface area of a closed cylinder?", ["2πr² + 2πrh", "πr²h", "2πr + 2πrh", "πr² + πrh"], "Two circles (2πr²) plus the curved surface, which unrolls into a rectangle 2πr by h.");
// G8 Cones, pyramids & spheres
MC("G8", "F", "Find the volume of a sphere with radius 3 cm, in terms of π. (V = 4/3πr³)", ["36π cm³", "12π cm³", "108π cm³", "27π cm³"], "4/3 × π × 3³ = 4/3 × 27π = 36π cm³.", 40);
SP("G8", "F", "Find the volume of a cone with radius 4 cm and height 9 cm. (V = ⅓πr²h)", ["V = ⅓ × π × 4² × 9", "= ⅓ × π × 16 × 9", "= 144π cm³"], 2,
  ["= 48π cm³", "= 432π cm³", "= 16π cm³"], "48π cm³", ["48π"], "Don't forget the ⅓: 16 × 9 = 144, and 144 ÷ 3 = 48. So 48π cm³.");
TY("G8", "F", "A square-based pyramid has a base 6 cm by 6 cm and height 10 cm. Find its volume. (V = ⅓ × base area × height)", "120 cm³", ["120"], "⅓ × 36 × 10 = 120 cm³.", "a number", 45);
TF("G8", "F", "A cone has one-third of the volume of a cylinder with the same base and height.", true, "Cylinder: πr²h. Cone: ⅓πr²h.", 25);
MC("G8", "H", "A hemisphere has radius 6 cm. Find its volume, in terms of π.", ["144π cm³", "288π cm³", "72π cm³", "48π cm³"], "Half of a sphere: ½ × 4/3 × π × 216 = 144π cm³.", 45);
// G9 Pythagoras
MC("G9", "F", "A right-angled triangle has shorter sides 6 cm and 8 cm. Find the hypotenuse.", ["10 cm", "14 cm", "100 cm", "√28 cm"], "c² = 6² + 8² = 36 + 64 = 100, so c = 10 cm.", 30);
SP("G9", "F", "A right-angled triangle has hypotenuse 13 cm and another side 5 cm. Find the third side.", ["a² + b² = c²", "x² = 13² + 5²", "x² = 194, so x = 13.9 cm"], 1,
  ["x² = 13² − 5²", "x² = 13 − 5", "x² = (13 + 5)²"], "12 cm", ["12"], "To find a shorter side, subtract: 169 − 25 = 144, so x = 12 cm. A shorter side can't be longer than the hypotenuse.", 45);
TY("G9", "F", "Find the distance between the points (1, 2) and (7, 10).", "10", ["10"], "Across 6, up 8: √(6² + 8²) = √100 = 10.", "a number", 40);
TF("G9", "F", "A triangle with sides 7, 24 and 25 is right-angled.", true, "7² + 24² = 49 + 576 = 625 = 25².", 30);
ME("G9", "F", "A 5 m ladder leans against a wall with its foot 1.4 m from the wall. Which finds how high up the wall it reaches?", ["√(5² − 1.4²)", "√(5² + 1.4²)", "5 − 1.4", "5² − 1.4²"], "The ladder is the hypotenuse, so subtract: √(25 − 1.96) = 4.8 m.", 35);
MC("G9", "F", "A square has a diagonal of √50 cm. What is its side length?", ["5 cm", "7.07 cm", "25 cm", "2.5 cm"], "s² + s² = 50, so s² = 25 and s = 5 cm.", 40);
// G10 Trigonometry
MC("G10", "F", "In a right-angled triangle, which ratio links the opposite side and the hypotenuse?", ["sin", "cos", "tan", "Pythagoras"], "SOH: sin = opposite ÷ hypotenuse.", 20);
SP("G10", "F", "The hypotenuse is 12 cm and the angle is 30°. Find x, the side opposite the angle.", ["Use sin: sin 30° = x/12", "x = 12 ÷ sin 30°", "x = 24 cm"], 1,
  ["x = 12 × sin 30°", "x = sin 30° ÷ 12", "x = 12 × cos 30°"], "6 cm", ["6"], "Multiply both sides by 12: x = 12 × sin 30° = 12 × 0.5 = 6 cm. The opposite side must be shorter than the hypotenuse.", 45);
TY("G10", "F", "tan θ = 1. Find θ.", "45°", ["45"], "tan 45° = 1, because the opposite and adjacent sides are equal.", "a number", 25);
TF("G10", "F", "cos 60° = 0.5", true, "This is one of the exact values: cos 60° = ½.", 15);
MC("G10", "F", "In a right-angled triangle the opposite side is 7 cm and the adjacent side is 7 cm. Find the angle.", ["45°", "30°", "60°", "90°"], "tan θ = 7/7 = 1, so θ = 45°.", 30);
ME("G10", "F", "The adjacent side is 8 cm and the hypotenuse is 10 cm. Which finds the angle θ?", ["θ = cos⁻¹(8/10)", "θ = sin⁻¹(8/10)", "θ = tan⁻¹(8/10)", "θ = cos(8/10)"], "Adjacent and hypotenuse use cos. θ = cos⁻¹(0.8) = 36.9°.", 35);
// G11 Sine rule, cosine rule & area
MC("G11", "H", "Which formula finds the area of a triangle from two sides and the angle between them?", ["½ab sin C", "½bh", "a² = b² + c² − 2bc cos A", "a/sin A = b/sin B"], "Area = ½ab sin C, where C is the angle between sides a and b.", 25);
SP("G11", "H", "In triangle ABC, b = 5, c = 7 and angle A = 60°. Find side a.", ["a² = b² + c² − 2bc cos A", "a² = 25 + 49 − 2 × 5 × 7 × cos 60°", "a² = 74 − 70 = 4, so a = 2"], 2,
  ["a² = 74 − 35 = 39, so a = 6.24", "a² = 74 + 35 = 109, so a = 10.44", "a² = 74 − 70 × 60"], "a = 6.24 (2 d.p.)", ["6.24", "a=6.24", "√39", "a=√39"],
  "cos 60° = 0.5, so 2 × 5 × 7 × 0.5 = 35. a² = 39, so a = 6.24 (2 d.p.).", 75);
TY("G11", "H", "Find the area of a triangle with sides 8 cm and 10 cm and an angle of 30° between them.", "20 cm²", ["20"], "½ × 8 × 10 × sin 30° = 40 × 0.5 = 20 cm².", "a number", 45);
TF("G11", "H", "You can use the sine rule when you know two angles and one side.", true, "The sine rule links each side with its opposite angle, so two angles and a side are enough.", 25);
ME("G11", "H", "You know all three sides of a triangle. Which finds one of its angles?", ["The cosine rule", "The sine rule", "½ab sin C", "Pythagoras"], "With three sides and no angles, rearrange the cosine rule: cos A = (b² + c² − a²)/2bc.");
// G12 3D Pythagoras & trigonometry
MC("G12", "H", "Find the length of the space diagonal of a cuboid 3 cm by 4 cm by 12 cm.", ["13 cm", "19 cm", "5 cm", "169 cm"], "d² = 3² + 4² + 12² = 9 + 16 + 144 = 169, so d = 13 cm.", 45);
TY("G12", "H", "A cube has sides of 2 cm. Find the length of its space diagonal to 2 decimal places.", "3.46 cm", ["3.46"], "d² = 2² + 2² + 2² = 12, so d = √12 = 3.46 cm (2 d.p.).", "a number", 50);
TF("G12", "H", "For a cuboid with sides a, b and c, the space diagonal d satisfies d² = a² + b² + c².", true, "Use Pythagoras twice: once across the base, then up the height.", 25);
ME("G12", "H", "Which method finds the angle between a cuboid's space diagonal and its base?", ["Find the base diagonal, then use tan with the height", "Use the height only", "Use the volume", "Use the perimeter of the base"], "The base diagonal, the height and the space diagonal make a right-angled triangle: tan θ = height ÷ base diagonal.", 40);
// G13 Transformations
MC("G13", "F", "The point (3, 2) is reflected in the y-axis. Where does it go?", ["(−3, 2)", "(3, −2)", "(2, 3)", "(−3, −2)"], "Reflecting in the y-axis changes the sign of the x-coordinate.", 25);
TF("G13", "F", "A translation by the column vector (4, −1) moves a shape 4 right and 1 down.", true, "The top number moves right (+) or left (−); the bottom number moves up (+) or down (−).");
MC("G13", "F", "A shape is enlarged by scale factor 3. What happens to its perimeter?", ["It is 3 times bigger", "It is 9 times bigger", "It is 27 times bigger", "It stays the same"], "Every length is multiplied by 3, so the perimeter is too. (The area would be 9 times bigger.)");
SP("G13", "F", "Rotate the point (2, 1) through 90° clockwise about the origin.", ["For 90° clockwise: (x, y) → (y, −x)", "(2, 1) → (1, 2)"], 1,
  ["(2, 1) → (1, −2)", "(2, 1) → (−1, 2)", "(2, 1) → (−2, −1)"], "(1, −2)", ["(1,-2)", "1,-2"], "(y, −x) gives (1, −2). The minus sign was dropped.", 45);
TY("G13", "F", "A shape is enlarged by scale factor ½. A side of 14 cm becomes how many cm?", "7 cm", ["7"], "14 × ½ = 7 cm. A scale factor between 0 and 1 makes the shape smaller.", "a number", 25);
ME("G13", "F", "Which information do you need to describe a rotation fully?", ["The angle, the direction and the centre", "The angle only", "The direction and a vector", "The mirror line"], "For example: 90° clockwise about (0, 0).", 25);
// G14 Similarity & congruence
MC("G14", "F", "Which of these does NOT prove that two triangles are congruent?", ["AAA (three equal angles)", "SSS", "SAS", "RHS"], "Three equal angles only shows the triangles are similar. They could be different sizes.", 25);
SP("G14", "F", "Triangles ABC and DEF are similar. AB = 4 cm, DE = 10 cm and BC = 6 cm. Find EF.", ["Scale factor = 10 − 4 = 6", "EF = 6 + 6 = 12 cm"], 0,
  ["Scale factor = 10 ÷ 4 = 2.5", "Scale factor = 4 ÷ 10 = 0.4", "Scale factor = 10 × 4 = 40"], "15 cm", ["15"], "Similar shapes use a multiplier, not an amount added: 10 ÷ 4 = 2.5, so EF = 6 × 2.5 = 15 cm.", 45);
TF("G14", "F", "All squares are similar.", true, "Every square has the same angles and the same shape; only the size changes.", 15);
TY("G14", "F", "A 10 cm by 15 cm photo is enlarged so the short side is 25 cm. How long is the long side?", "37.5 cm", ["37.5"], "Scale factor = 25 ÷ 10 = 2.5, so the long side is 15 × 2.5 = 37.5 cm.", "a number", 40);
MC("G14", "F", "Two similar triangles have matching sides of 3 cm and 12 cm. What is the scale factor from the smaller to the larger?", ["4", "9", "36", "1/4"], "Scale factor = new length ÷ old length = 12 ÷ 3 = 4.", 25);
// G15 Similar areas & volumes
MC("G15", "H", "Two similar shapes have a length scale factor of 3. What is the area scale factor?", ["9", "3", "27", "6"], "Area scale factor = (length scale factor)² = 3² = 9.", 25);
SP("G15", "H", "Two similar cylinders have heights 5 cm and 10 cm. The smaller has volume 40 cm³. Find the larger volume.", ["Length scale factor = 2", "Volume scale factor = 2² = 4", "Larger volume = 160 cm³"], 1,
  ["Volume scale factor = 2³ = 8", "Volume scale factor = 2 × 3 = 6", "Volume scale factor = 2"], "320 cm³", ["320"], "Volume scales by the cube of the length factor: 2³ = 8, so 40 × 8 = 320 cm³.", 50);
TY("G15", "H", "Two similar shapes have areas 16 cm² and 100 cm². What is the length scale factor?", "2.5", ["2.5", "5/2"], "Area scale factor = 100 ÷ 16 = 6.25. Length scale factor = √6.25 = 2.5.", "a number", 45);
TF("G15", "H", "If the volume scale factor is 27, the length scale factor is 3.", true, "Length scale factor = ∛27 = 3.", 25);
// G16 Constructions & loci
MC("G16", "F", "What is the locus of points exactly 3 cm from a point P?", ["A circle of radius 3 cm centred on P", "A straight line", "A square", "Two parallel lines"], "Every point on the circle is the same distance, 3 cm, from P.", 25);
TF("G16", "F", "The perpendicular bisector of AB is the locus of points the same distance from A and from B.", true, "Every point on the perpendicular bisector is equidistant from A and B.", 25);
MC("G16", "F", "What is the locus of points the same distance from two lines that meet at an angle?", ["The angle bisector", "The perpendicular bisector", "A circle", "A parallel line"], "Points on the angle bisector are equidistant from both arms of the angle.", 25);
OR("G16", "F", "Put the steps in order to construct the perpendicular bisector of a line AB.", "first step to last step", ["Open the compasses to more than half of AB", "With the point on A, draw arcs above and below AB", "With the point on B and the same radius, draw arcs above and below AB", "Join the two points where the arcs cross"], "Use the same radius from both ends; the line through the crossing points is the perpendicular bisector.", 50);
ME("G16", "F", "A goat is tied to a post with a 5 m rope. Which describes where it can graze?", ["Inside a circle of radius 5 m centred on the post", "Only on a circle of radius 5 m", "Along a 5 m straight line", "Inside a square of side 5 m"], "It can reach any point up to 5 m away, so the region is the inside of a circle.", 25);
// G17 Bearings
MC("G17", "F", "What is the bearing of due East?", ["090°", "180°", "270°", "045°"], "Bearings are measured clockwise from North: East is a quarter turn, 090°.", 20);
SP("G17", "F", "The bearing of B from A is 070°. Find the bearing of A from B.", ["Back bearing = 070° − 180°", "= −110°"], 0,
  ["Back bearing = 070° + 180° = 250°", "Back bearing = 180° − 070° = 110°", "Back bearing = 360° − 070° = 290°"], "250°", ["250"], "For a bearing under 180°, add 180°: 070 + 180 = 250°.", 40);
TY("G17", "F", "The bearing of Q from P is 300°. Find the bearing of P from Q.", "120°", ["120"], "For a bearing over 180°, subtract 180°: 300 − 180 = 120°.", "a number", 35);
TF("G17", "F", "Bearings are measured clockwise from North.", true, "They are also always written with three figures, for example 045°.", 15);
MC("G17", "F", "A bearing of 225° points…", ["South-west", "South-east", "North-west", "North-east"], "180° is South and 270° is West, so 225° is halfway between: South-west.", 25);
// G18 Vectors
MC("G18", "F", "a = (3, −1) and b = (2, 5) as column vectors. Find a + b.", ["(5, 4)", "(1, −6)", "(6, −5)", "(5, −6)"], "Add the tops and the bottoms: 3 + 2 = 5 and −1 + 5 = 4.", 30);
TF("G18", "F", "The column vector (−2, 3) means 2 left and 3 up.", true, "The top number is horizontal (− is left); the bottom number is vertical (+ is up).", 20);
SP("G18", "F", "a = (5, 2) and b = (1, 4) as column vectors. Find a − b.", ["a − b = (5 − 1, 2 − 4)", "= (4, 6)"], 1,
  ["= (4, −2)", "= (6, 6)", "= (−4, 2)"], "(4, −2)", ["(4,-2)", "4,-2"], "2 − 4 = −2, so a − b = (4, −2).", 35);
MC("G18", "H", "OA = a and OB = b. Find the vector AB.", ["b − a", "a − b", "a + b", "½(a + b)"], "AB = AO + OB = −a + b = b − a.", 30);
ME("G18", "H", "OA = a, OB = b and M is the midpoint of AB. Which gives OM?", ["a + ½(b − a)", "½(a − b)", "a + b", "b − ½a"], "OM = OA + AM = a + ½AB = a + ½(b − a) = ½(a + b).", 45);
TF("G18", "H", "If AB = 2a + b and CD = 6a + 3b, then AB and CD are parallel.", true, "CD = 3(2a + b) = 3AB, so CD is a multiple of AB.", 35);
// G19 Circle theorems
MC("G19", "H", "The angle at the centre of a circle is ___ the angle at the circumference standing on the same arc.", ["twice", "half", "equal to", "90° more than"], "Angle at the centre = 2 × angle at the circumference.", 25);
TF("G19", "H", "The angle in a semicircle is 90°.", true, "An angle standing on a diameter is always a right angle.", 15);
SP("G19", "H", "One angle of a cyclic quadrilateral is 110°. Find the opposite angle.", ["Opposite angles in a cyclic quadrilateral are equal", "So the opposite angle is 110°"], 0,
  ["Opposite angles in a cyclic quadrilateral add up to 180°", "Opposite angles add up to 360°", "Opposite angles add up to 90°"], "70°", ["70"], "Opposite angles in a cyclic quadrilateral add up to 180°: 180 − 110 = 70°.", 40);
TY("G19", "H", "The angle at the centre is 140°. Find the angle at the circumference standing on the same arc.", "70°", ["70"], "The angle at the circumference is half the angle at the centre: 140 ÷ 2 = 70°.", "a number", 30);
MC("G19", "H", "A tangent meets a radius at…", ["90°", "45°", "180°", "60°"], "A tangent is always perpendicular to the radius at the point where they meet.", 20);
ME("G19", "H", "Two tangents are drawn to a circle from the same point outside it. Which fact can you use?", ["The two tangents are equal in length", "The tangents are parallel", "The tangents meet at 90°", "The tangents pass through the centre"], "Tangents from an external point are equal in length.", 30);
// G20 Plans & elevations
MC("G20", "F", "The view of a 3D shape from directly above is called the…", ["Plan", "Front elevation", "Side elevation", "Net"], "Plan = view from above. Elevations are views from the front and side.", 20);
TF("G20", "F", "The plan of an upright cylinder is a circle.", true, "From above you see the circular top.", 15);
MC("G20", "F", "What is the front elevation of a square-based pyramid?", ["A triangle", "A square", "A circle", "A rectangle"], "From the front you see the sloping faces meeting at the top: a triangle.", 25);
MC("G20", "F", "What is the plan of a cone standing on its base?", ["A circle with a dot at the centre", "A triangle", "A square", "A semicircle"], "From above you see the circular base, with the point of the cone at the centre.", 25);
