import json
from batch1 import Q, sheet, F, R
from diagrams import graph
x,y,k,t,b,c='<i>x</i>','<i>y</i>','<i>k</i>','<i>t</i>','<i>b</i>','<i>c</i>'
def withsvg(q,svg): q["svg"]=svg; return q
S={}
DT=graph(0,3,0,50,curves=[[(0,0),(1,40),(1.5,40),(3,0)]],xstep=0.5,ystep=10,xlab="Time (hours)",ylab="Distance from base (km)",w=105,h=62,xmajor=0.5,ymajor=10)
VT=graph(0,12,0,14,curves=[[(0,0),(4,12),(10,12),(12,0)]],xstep=1,ystep=2,xlab="Time (s)",ylab="Speed (m/s)",w=105,h=62,xmajor=2,ymajor=2)
S["num-speed-distance-time"]=sheet("MF-CF-NUM-SPEED","Number","Speed and distance-time graphs","Speed, density and pressure",
 "Speed, distance and time are one formula three ways round. Secure the calculations, extend to graphs, units and average speed, then master velocity-time graphs and meeting problems.",
 ["Speed, distance and time, and reading a distance-time graph.","Unit conversions, density, average speed over two stages, and tampered evidence.","Velocity-time graphs, pressure, and two objects moving at once."],
 ["Speed = "+F("distance","time")+". Rearranged: distance = speed × time, and time = "+F("distance","speed")+". The units must match: km and hours give km/h; metres and seconds give m/s.",
  "On a <b>distance-time graph</b>, the gradient is the speed and a flat section means stopped. On a <b>speed-time graph</b>, the gradient is the acceleration and the <b>area underneath</b> is the distance travelled."],
 ["Write the formula you need, rearranged for the unknown.","Check the units: convert minutes to hours, or km to m, before you calculate.","For a graph: read values carefully at grid lines, then use gradient or area.","Give units with every answer, and turn decimal hours into minutes if asked."],
 {"question":"A patrol car drives 45 km in 36 minutes. Find its average speed in km/h.","steps":["The answer is in km/h, so change the time to hours: 36 minutes = "+F("36","60")+" = 0.6 hours.","Speed = "+F("distance","time")+" = "+F("45","0.6")+".","= 75 km/h.","Check: 75 km/h × 0.6 h = 45 km ✓"],"answer":"75 km/h"},
 [Q("A car travels 150 km in 2.5 hours. Find its average speed.",2,"60 km/h",label="km/h"),
  Q("A runner runs at 4 m/s for 90 seconds. How far does she run?",2,"360 m",label="m"),
  Q("How long does it take to travel 210 miles at 60 mph? Give your answer in hours and minutes.",2,"3 hours 30 minutes","210 ÷ 60 = 3.5 hours.",label="____ h ____ min",tip="0.5 hours is 30 minutes, not 50. Multiply the decimal part by 60."),
  withsvg(Q(["The graph shows a detective's journey from base to a crime scene and back.","Work out her speed on the way to the crime scene."],2,"40 km/h","40 km in 1 hour.",label="km/h"),DT),
  Q("Use the graph. How long did she spend at the crime scene?",1,"30 minutes","The flat section, from 1 to 1.5 hours.",label="minutes")],
 [Q("Use the same graph. Work out her speed on the way back to base. Give your answer to 1 decimal place.",2,"26.7 km/h","40 km in 1.5 hours.",label="km/h"),
  Q("Change 72 km/h into m/s.",2,"20 m/s","72 000 m in 3600 s.",label="m/s"),
  Q("A metal block has a mass of 240 g and a volume of 30 cm³. Find its density.",2,"8 g/cm³","Density = mass ÷ volume.",label="g/cm³"),
  Q("A drone flies 12 km at 30 km/h, then 18 km at 45 km/h. Find its average speed for the whole flight.",3,"37.5 km/h","Times 0.4 h + 0.4 h = 0.8 h. 30 km ÷ 0.8 h.",label="km/h",tip="Average speed is total distance ÷ total time. It is <b>not</b> the average of 30 and 45."),
  Q("Leo worked out the speed of a car that travels 45 km in 30 minutes. Find his mistake and give the correct speed.",2,"90 km/h","He divided by minutes, not hours: 45 ÷ 0.5.",tampered="speed = 45 ÷ 30 = 1.5 km/h",label="km/h")],
 [withsvg(Q(["The speed-time graph shows a car pulling away from a crime scene, then stopping at a checkpoint.","Work out the total distance travelled."],3,"108 m","Area: ½ × 4 × 12 + 6 × 12 + ½ × 2 × 12 = 24 + 72 + 12.",label="m",tip="Split the area under the graph into triangles and a rectangle. Distance is the <b>area</b>, not the gradient."),VT),
  Q("Use the speed-time graph. Work out the car's acceleration in the first 4 seconds.",2,"3 m/s²","Gradient: 12 ÷ 4.",label="m/s²"),
  Q(["A crate rests on a face of area 0.4 m², exerting a pressure of 300 N/m².","It is turned onto a face of area 0.15 m². Find the new pressure."],3,"800 N/m²","Force = 300 × 0.4 = 120 N. 120 ÷ 0.15.",label="N/m²"),
  Q(["Two suspects are 270 km apart. They drive towards each other, starting at the same time, at 80 km/h and 100 km/h.","How far has the slower car travelled when they meet?"],3,"120 km","They close the gap at 180 km/h: 270 ÷ 180 = 1.5 h. 80 × 1.5.",label="km"),
  Q("A train 200 m long travels at 90 km/h through a tunnel 1.3 km long. How long does it take from the front entering to the back leaving the tunnel?",3,"60 seconds","Distance 1300 + 200 = 1500 m. 90 km/h = 25 m/s. 1500 ÷ 25.",label="seconds")],
 ["Use speed = distance ÷ time in all three arrangements.","Convert between hours and minutes, and between km/h and m/s.","Read speed from the gradient of a distance-time graph.","Find distance from the area under a speed-time graph, and acceleration from its gradient.","Use density and pressure with the same formula triangle idea."])

QG=graph(-2,4,-5,6,curves=[lambda v:v*v-2*v-3],xstep=1,ystep=1,w=80,h=80,xmajor=1,ymajor=1)
S["alg-quadratic-graphs"]=sheet("MF-CF-ALG-QUADGRAPH","Graphs","Quadratic graphs","Quadratic graphs: roots and turning points",
 "Every quadratic graph is a parabola with roots, an intercept and a turning point. Secure reading them, extend to finding them algebraically, then master building and using the equation.",
 ["Tables of values, roots, intercept and turning point from a graph.","Roots and turning points by algebra, sketching, symmetry, and tampered evidence.","Finding the equation, solving with a line, and the discriminant."],
 [f"The graph of {y} = <i>a</i>{x}² + {b}{x} + {c} is a U shape (a ∩ if <i>a</i> is negative). The <b>roots</b> are where it crosses the {x}-axis: solve <i>y</i> = 0. The <b>y-intercept</b> is (0, <i>c</i>).",
  f"The <b>turning point</b> sits on the line of symmetry, halfway between the roots. Completing the square gives it directly: {y} = ({x} − <i>p</i>)² + <i>q</i> has turning point (<i>p</i>, <i>q</i>)."],
 ["Roots: factorise and solve = 0 (or read where the curve crosses the x-axis).","y-intercept: put x = 0.","Turning point: halfway between the roots, or complete the square.","To solve an equation with a graph, rearrange it so one side is the curve, and draw the other side as a line."],
 {"question":f"Find the roots, the y-intercept and the turning point of {y} = {x}² − 6{x} + 5.","steps":[f"Roots: ({x} − 1)({x} − 5) = 0, so {x} = 1 and {x} = 5.",f"y-intercept: when {x} = 0, {y} = 5, so (0, 5).",f"Line of symmetry halfway between the roots: {x} = 3.",f"Turning point: {y} = 9 − 18 + 5 = −4, so (3, −4). Check: ({x} − 3)² − 4 = {x}² − 6{x} + 5 ✓"],"answer":"Roots 1 and 5, y-intercept (0, 5), turning point (3, −4)"},
 [Q(f"Complete the values of {y} = {x}² − 2{x} − 3 for {x} = −2, −1, 0, 1, 2, 3, 4.",2,"5, 0, −3, −4, −3, 0, 5","Watch (−2)² = 4, not −4.",label="y values",tip="Put negative numbers in brackets when you square them: (−2)² = 4."),
  withsvg(Q(f"The graph of {y} = {x}² − 2{x} − 3 is drawn below. Write down its roots.",2,f"{x} = −1 and {x} = 3","Where the curve crosses the x-axis.",label="Roots"),QG),
  Q("Use the graph to write down the coordinates of the turning point.",2,"(1, −4)",label="( ____ , ____ )"),
  Q(f"Write down where the graph of {y} = {x}² + 5{x} + 6 crosses the {y}-axis.",1,"(0, 6)",label="( ____ , ____ )"),
  Q(f"Use the graph to solve {x}² − 2{x} − 3 = 5.",2,f"{x} = −2 and {x} = 4","Read where the curve is at height 5.",label=f"{x} =")],
 [Q(f"Find the roots of {y} = {x}² − 6{x} + 8 by factorising.",2,f"{x} = 2 and {x} = 4","(x − 2)(x − 4) = 0.",label="Roots"),
  Q(f"By completing the square, find the turning point of {y} = {x}² − 6{x} + 8.",3,"(3, −1)","(x − 3)² − 9 + 8 = (x − 3)² − 1.",label="( ____ , ____ )"),
  Q(f"Write down the equation of the line of symmetry of {y} = {x}² − 6{x} + 8.",1,f"{x} = 3",label="Equation"),
  Q(f"Sketch {y} = {x}² + 2{x} − 8. Label the roots, the y-intercept and the turning point with their coordinates.",4,"Roots (−4, 0) and (2, 0); y-intercept (0, −8); turning point (−1, −9)","(x + 4)(x − 2); (x + 1)² − 9.",lines=6,label=False),
  Q(f"Maya said where {y} = ({x} + 2)({x} − 5) crosses the {x}-axis. Find her mistake and give the correct values.",2,f"{x} = −2 and {x} = 5","Each bracket = 0: x + 2 = 0 gives x = −2.",tampered="It crosses at x = 2 and x = −5",label=f"{x} =")],
 [Q(f"The graph of {y} = {x}² + {b}{x} + {c} has its turning point at (2, −9). Find {b} and {c}, and the roots.",4,f"{b} = −4, {c} = −5; roots −1 and 5","(x − 2)² − 9 = x² − 4x − 5 = (x + 1)(x − 5).",lines=5,label=f"{b} = ____ {c} ="),
  Q(f"A quadratic graph crosses the {x}-axis at 2 and 3, and the {y}-axis at (0, 6). Find its equation.",3,f"{y} = {x}² − 5{x} + 6","y = a(x − 2)(x − 3); at x = 0, 6a = 6, so a = 1.",label=f"{y} ="),
  Q(f"Use the graph of {y} = {x}² − 2{x} − 3 and a straight line to solve {x}² − 3{x} − 1 = 0. Write down the equation of your line, then the solutions to 1 decimal place.",3,f"Line {y} = {x} − 2; {x} ≈ 3.3 and {x} ≈ −0.3",f"{x}² − 2{x} − 3 = {x} − 2 rearranges to {x}² − 3{x} − 1 = 0.",lines=4,label="Line ____ Solutions",tip="Make the left side match the graph you have: add and subtract until it says <i>x</i>² − 2<i>x</i> − 3. What's left is your line."),
  Q(f"For which values of {k} does the graph of {y} = {x}² − 4{x} + {k} not cross the {x}-axis?",3,f"{k} > 4","No roots: 16 − 4k < 0.",label=f"{k}"),
  Q(f"The path of a ball is {y} = −0.2{x}² + 2{x} + 1.5, where {y} is its height in metres. Find its greatest height.",3,"6.5 m","−0.2(x − 5)² + 5 + 1.5, so the maximum is at x = 5.",label="m")],
 ["Draw and read quadratic graphs from a table of values.","Find roots by factorising and the y-intercept from c.","Find the turning point from symmetry or by completing the square.","Solve equations using the graph and a straight line.","Build the equation of a quadratic from its features."])
for name,d in S.items():
    json.dump(d,open(f"{name}.json","w"),ensure_ascii=False,indent=1)
print(list(S))
