"""KS3 national curriculum (DfE-00179-2013) -> Maths Forensics Academy topic map.
Run: python3 curriculum.py  -> checks coverage, writes curriculum.json
"""
import json, sys

# Every KS3 subject-content statement, with a short code.
NC = {
 # Number
 "N1": "Place value for decimals, measures and integers of any size",
 "N2": "Order integers, decimals and fractions; number line; = ≠ < > ≤ ≥",
 "N3": "Primes, factors, multiples, HCF, LCM, prime factorisation",
 "N4": "Four operations with integers, decimals, fractions and mixed numbers, positive and negative",
 "N5": "Priority of operations: brackets, powers, roots, reciprocals",
 "N6": "Relationships between operations, including inverse operations",
 "N7": "Integer powers and real roots; powers of 2, 3, 4, 5; exact roots vs decimal approximations",
 "N8": "Standard form A × 10ⁿ",
 "N9": "Terminating decimals and their fractions",
 "N10": "Percentages: parts per hundred, percentage change as fraction/decimal, one quantity as a % of another, over 100%",
 "N11": "Fractions and percentages as operators",
 "N12": "Standard units of mass, length, time, money and other measures",
 "N13": "Rounding to decimal places and significant figures",
 "N14": "Estimating by rounding; error intervals a < x ≤ b",
 "N15": "Using a calculator and interpreting the result",
 "N16": "The infinite nature of integers, real and rational numbers",
 # Algebra
 "A1": "Algebraic notation (ab, 3y, a², a/b, brackets)",
 "A2": "Substitution into formulae and expressions, including scientific formulae",
 "A3": "Vocabulary: expressions, equations, inequalities, terms, factors",
 "A4": "Simplify: collect like terms, single brackets, common factors, two binomials",
 "A5": "Standard formulae; rearranging to change the subject",
 "A6": "Modelling situations with expressions, formulae and graphs",
 "A7": "Solving linear equations in one variable",
 "A8": "Coordinates in all four quadrants",
 "A9": "Graphs of linear and quadratic functions",
 "A10": "Interpreting relationships algebraically and graphically",
 "A11": "y = mx + c; gradients and intercepts",
 "A12": "Reading values from graphs; approximate solutions of simultaneous equations",
 "A13": "Contextual graphs: piece-wise linear, exponential, reciprocal",
 "A14": "Sequences from term-to-term and position-to-term rules",
 "A15": "Arithmetic sequences and the nth term",
 "A16": "Geometric and other sequences",
 # Ratio, proportion and rates of change
 "R1": "Converting between related standard units (time, length, area, volume, mass)",
 "R2": "Scale factors, scale diagrams and maps",
 "R3": "One quantity as a fraction of another",
 "R4": "Ratio notation and simplest form",
 "R5": "Dividing a quantity in a ratio",
 "R6": "Multiplicative relationships as a ratio or a fraction",
 "R7": "Ratio linked to fractions and linear functions",
 "R8": "Percentage increase, decrease, original value and simple interest",
 "R9": "Direct and inverse proportion, including graphs and algebra",
 "R10": "Compound units: speed, unit pricing, density",
 # Geometry and measures
 "G1": "Area of triangles, parallelograms, trapezia; volume of cuboids and prisms",
 "G2": "Perimeter of 2-D shapes and circles; area of circles and composite shapes",
 "G3": "Drawing and measuring lines and angles; scale drawings",
 "G4": "Ruler and compass constructions; shortest distance to a line",
 "G5": "Conventional terms: parallel, perpendicular, polygons, symmetry",
 "G6": "Labelling triangle ABC; congruence criteria",
 "G7": "Properties of triangles, quadrilaterals, circles and other plane figures",
 "G8": "Translations, rotations and reflections",
 "G9": "Congruent triangles; enlargement and similar shapes",
 "G10": "Angles at a point, on a straight line, vertically opposite",
 "G11": "Parallel lines: alternate and corresponding angles",
 "G12": "Angle sum of a triangle and of any polygon; regular polygons",
 "G13": "Deriving results, including Pythagoras' theorem; simple proofs",
 "G14": "Pythagoras and trigonometric ratios in right-angled triangles",
 "G15": "Faces, edges and vertices of 3-D solids",
 "G16": "Interpreting relationships algebraically and geometrically",
 # Probability
 "P1": "Probability experiments, fairness, language and the 0–1 scale",
 "P2": "Probabilities of all outcomes sum to 1",
 "P3": "Sets, unions and intersections: tables, grids and Venn diagrams",
 "P4": "Sample spaces for single and combined events",
 # Statistics
 "S1": "Distributions: mean, mode, median, range, outliers",
 "S2": "Tables and charts: frequency tables, bar charts, pie charts, pictograms, line charts",
 "S3": "Bivariate data and scatter graphs",
}

# [id, name, strand, [NC codes]]  — order within a tier is the suggested teaching order.
TIERS = {
 "bronze": [
  ["place-value", "Place value", "Number", ["N1"]],
  ["four-operations", "The four operations", "Number", ["N4"]],
  ["negative-numbers", "Negative numbers", "Number", ["N2", "N4"]],
  ["rounding", "Rounding", "Number", ["N13"]],
  ["factors-multiples", "Factors, multiples and primes", "Number", ["N3"]],
  ["order-of-operations", "Order of operations", "Number", ["N5", "N6"]],
  ["notation", "Algebraic notation", "Algebra", ["A1", "A3"]],
  ["simplifying", "Simplifying expressions", "Algebra", ["A4"]],
  ["substitution", "Substitution", "Algebra", ["A2"]],
  ["fractions-of-amounts", "Fractions of amounts", "Ratio", ["N11", "R3"]],
  ["metric-units", "Metric units", "Ratio", ["N12", "R1"]],
  ["perimeter", "Perimeter", "Geometry", ["G2"]],
  ["area-rectangles", "Area of rectangles", "Geometry", ["G1", "G2"]],
  ["angle-facts", "Angle facts", "Geometry", ["G10", "G3"]],
  ["probability-words", "Probability words and the scale", "Probability", ["P1"]],
  ["charts-tables", "Tables and charts", "Statistics", ["S2"]],
 ],
 "silver": [
  ["ordering-numbers", "Ordering numbers", "Number", ["N2"]],
  ["hcf-lcm", "HCF, LCM and prime factors", "Number", ["N3"]],
  ["fractions-add-sub", "Adding and subtracting fractions", "Number", ["N4"]],
  ["fractions-mul-div", "Multiplying and dividing fractions", "Number", ["N4"]],
  ["decimal-calculations", "Calculating with decimals", "Number", ["N4", "N15"]],
  ["powers-roots", "Powers and roots", "Number", ["N7", "N5"]],
  ["fdp", "Fractions, decimals and percentages", "Number", ["N9", "N10"]],
  ["expanding-brackets", "Expanding brackets", "Algebra", ["A4"]],
  ["equations-1", "Solving equations", "Algebra", ["A7", "A3", "N6"]],
  ["sequences", "Sequences", "Algebra", ["A14"]],
  ["coordinates", "Coordinates", "Algebra", ["A8"]],
  ["ratio-simplify", "Ratio", "Ratio", ["R4", "R6", "R3"]],
  ["ratio-share", "Sharing in a ratio", "Ratio", ["R5"]],
  ["percentages-of-amounts", "Percentages of amounts", "Ratio", ["N10", "N11"]],
  ["area-triangles", "Area of triangles and parallelograms", "Geometry", ["G1"]],
  ["angles-shapes", "Angles in triangles and quadrilaterals", "Geometry", ["G12", "G7", "G6"]],
  ["polygons-symmetry", "Polygons and symmetry", "Geometry", ["G5", "G7"]],
  ["probability-single", "Calculating probability", "Probability", ["P1", "P2"]],
  ["averages", "Averages and range", "Statistics", ["S1"]],
 ],
 "gold": [
  ["standard-form", "Standard form", "Number", ["N8"]],
  ["estimation", "Estimation", "Number", ["N14", "N15"]],
  ["percentage-compare", "One number as a percentage of another", "Number", ["N10", "R3"]],
  ["factorising", "Factorising", "Algebra", ["A4", "A3"]],
  ["equations-2", "Equations with unknowns on both sides", "Algebra", ["A7"]],
  ["nth-term", "The nth term", "Algebra", ["A15"]],
  ["linear-graphs", "Straight-line graphs", "Algebra", ["A9", "A10"]],
  ["formulae", "Writing and using formulae", "Algebra", ["A2", "A5", "A6"]],
  ["percentage-change", "Percentage change and simple interest", "Ratio", ["R8", "N10"]],
  ["direct-proportion", "Direct proportion and best buys", "Ratio", ["R9", "R10", "R7"]],
  ["speed-distance-time", "Speed, distance and time", "Ratio", ["R10", "A13"]],
  ["scale-drawings", "Scale drawings and maps", "Ratio", ["R2", "G3"]],
  ["parallel-angles", "Angles in parallel lines", "Geometry", ["G11"]],
  ["polygon-angles", "Angles in polygons", "Geometry", ["G12"]],
  ["circles", "Circles", "Geometry", ["G2", "G7"]],
  ["volume-prisms", "Volume of prisms", "Geometry", ["G1", "G15"]],
  ["transformations", "Transformations", "Geometry", ["G8"]],
  ["sample-spaces", "Sample spaces", "Probability", ["P4", "P2"]],
  ["venn-diagrams", "Venn diagrams", "Probability", ["P3"]],
  ["pie-charts", "Pie charts", "Statistics", ["S2"]],
  ["grouped-data", "Frequency tables and grouped data", "Statistics", ["S1", "S2"]],
 ],
 "platinum": [
  ["index-laws", "Index laws", "Number", ["N7"]],
  ["exact-values", "Exact values, roots and recurring decimals", "Number", ["N7", "N9", "N16"]],
  ["bounds", "Error intervals", "Number", ["N14"]],
  ["double-brackets", "Expanding double brackets", "Algebra", ["A4"]],
  ["rearranging", "Rearranging formulae", "Algebra", ["A5"]],
  ["inequalities", "Inequalities", "Algebra", ["A3", "N2"]],
  ["y-mx-c", "y = mx + c", "Algebra", ["A11", "A10"]],
  ["simultaneous-graphs", "Simultaneous equations with graphs", "Algebra", ["A12"]],
  ["quadratic-graphs", "Quadratic graphs", "Algebra", ["A9", "A12"]],
  ["real-life-graphs", "Real-life graphs", "Algebra", ["A13", "A6"]],
  ["geometric-sequences", "Geometric sequences", "Algebra", ["A16"]],
  ["reverse-percentages", "Reverse percentages", "Ratio", ["R8"]],
  ["inverse-proportion", "Inverse proportion", "Ratio", ["R9"]],
  ["compound-measures", "Density and compound measures", "Ratio", ["R10"]],
  ["pythagoras", "Pythagoras' theorem", "Geometry", ["G13", "G14", "G16"]],
  ["trigonometry", "Trigonometry", "Geometry", ["G14"]],
  ["congruence-similarity", "Congruence and similarity", "Geometry", ["G6", "G9", "R7"]],
  ["constructions", "Constructions and loci", "Geometry", ["G4", "G3"]],
  ["surface-area", "3-D shapes and surface area", "Geometry", ["G15", "G1", "G16"]],
  ["relative-frequency", "Relative frequency", "Probability", ["P1"]],
  ["scatter-graphs", "Scatter graphs", "Statistics", ["S3"]],
  ["comparing-distributions", "Comparing distributions", "Statistics", ["S1"]],
 ],
}

def main():
    used = {}
    ids = set()
    for tier, ts in TIERS.items():
        for tid, name, strand, codes in ts:
            assert tid not in ids, "duplicate id " + tid
            ids.add(tid)
            for c in codes:
                assert c in NC, f"{tid}: unknown code {c}"
                used.setdefault(c, []).append(tid)
    missing = [c for c in NC if c not in used]
    print({t: len(v) for t, v in TIERS.items()}, "total", len(ids))
    if missing:
        print("UNCOVERED:", missing); sys.exit(1)
    print("All", len(NC), "national curriculum statements are covered.")
    out = {"nc": NC, "tiers": {t: [dict(id=a, name=b, strand=c, nc=d) for a, b, c, d in v] for t, v in TIERS.items()}, "coverage": used}
    json.dump(out, open("curriculum.json", "w"), ensure_ascii=False, indent=1)

if __name__ == "__main__":
    main()
