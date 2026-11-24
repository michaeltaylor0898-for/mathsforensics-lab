import json
from batch1 import Q, sheet, F, R
from diagrams import venn, tree
def W(q,svg): q["svg"]=svg; return q
S={}
T1=tree([("Red",""),("Blue","")],[[("Red",""),("Blue","")],[("Red",""),("Blue","")]])
T2=tree([("Rain","0.3"),("No rain","0.7")],[[("Late","0.4"),("On time","")],[("Late","0.1"),("On time","")]])
S["prob-probability"]=sheet("MF-CF-PROB-TREE","Data and probability","Probability","Tree diagrams",
 "Every outcome, every branch. Secure single events and expected results, extend to tree diagrams, then master without-replacement problems and algebra.",
 ["Single events, missing probabilities, relative frequency, listing outcomes.","Tree diagrams with replacement, combined events, counting, and tampered evidence.","Without replacement, 'at least one', conditional probability and algebra."],
 ["Probabilities add up to 1. P(not A) = 1 − P(A). For <b>independent</b> events, multiply: P(A and B) = P(A) × P(B). For outcomes that can't happen together, add: P(A or B) = P(A) + P(B).",
  "On a <b>tree diagram</b>, multiply <b>along</b> the branches and add <b>between</b> the routes you want. <b>Without replacement</b>, the second set of branches changes: one fewer item, and one fewer of the colour you took."],
 ["Write the probabilities on every branch. Each set of branches adds up to 1.","Multiply along each route you want.","Add the routes together.","For 'at least one', it's usually quicker to do 1 − P(none)."],
 {"question":"A bag has 3 red and 5 blue counters. Two are taken without replacement. Find the probability that both are red.","steps":["First counter: P(red) = "+F("3","8")+".","Without replacement there are now 2 red out of 7: P(red) = "+F("2","7")+".","Multiply along the branch: "+F("3","8")+" × "+F("2","7")+" = "+F("6","56")+".","Simplify: "+F("3","28")+". Check: it's smaller than "+F("3","8")+" × "+F("3","8")+", as it should be ✓"],"answer":F("3","28")},
 [Q("A bag has 5 red, 3 blue and 2 green counters. One is taken at random. Find P(blue).",1,"3/10",label="Answer"),
  Q("Using the same bag, find P(red or green).",2,"7/10","5 + 2 = 7 out of 10."),
  Q("A spinner lands on A, B, C or D with probabilities 0.2, 0.35, x and 0.15. Find x.",2,"0.3","1 − 0.7.",label="x ="),
  Q("A dice is thrown 200 times and lands on six 48 times. Estimate how many sixes there would be in 500 throws.",2,"120","Relative frequency 48/200 = 0.24. 0.24 × 500.",label="Answer"),
  Q("Two fair coins are flipped. List all the possible outcomes, and find P(two heads).",2,"HH, HT, TH, TT; P(two heads) = 1/4",label="P(two heads)",tip="HT and TH are <b>different</b> outcomes. Missing one is the most common slip.")],
 [W(Q(["A bag has 3 red and 2 blue counters. A counter is taken, its colour noted and it is put back. Then a second counter is taken.","Complete the tree diagram, then find P(both red)."],3,"9/25","3/5 × 3/5.",label="P(both red)"),T1),
  Q("Using the same tree diagram, find the probability of getting one of each colour.",3,"12/25","RB + BR = 6/25 + 6/25.",label="Answer"),
  W(Q("The probability it rains on a school day is 0.3. Complete the tree diagram, then find the probability a detective trainee is late.",3,"0.19","0.3 × 0.4 + 0.7 × 0.1.",label="Answer"),T2),
  Q("A case code is 3 letters (A to Z) followed by 2 digits (0 to 9). How many different codes are possible?",2,"1 757 600","26 × 26 × 26 × 10 × 10.",label="Answer"),
  Q("Zak found the probability of rolling two sixes with two dice. Find his mistake.",2,"1/36","Both sixes means AND: multiply, 1/6 × 1/6.",tampered="P(6 and 6) = 1/6 + 1/6 = 1/3",label="Answer")],
 [Q("A bag has 4 red and 6 blue sweets. Two are taken without replacement. Find the probability they are the same colour.",4,"7/15","4/10 × 3/9 + 6/10 × 5/9 = 12/90 + 30/90 = 42/90.",lines=5,label="Answer"),
  Q("Using the same bag, find the probability that at least one sweet is red.",3,"2/3","1 − P(both blue) = 1 − 30/90.",label="Answer",tip="'At least one' covers lots of routes. Find P(none) instead and take it away from 1."),
  Q(["A bag has n sweets, 6 of them orange. Two are taken without replacement. P(both orange) = 1/3.","Show that n² − n − 90 = 0, and find n."],4,"n = 10","6/n × 5/(n − 1) = 1/3 → 90 = n(n − 1) → (n − 10)(n + 9) = 0.",lines=6,label="n ="),
  Q("60% of a class study French. Of these, 30% also study Spanish. Of the others, 50% study Spanish. A student who studies Spanish is chosen at random. Find the probability they also study French.",4,"9/19","P(F and S) = 0.18, P(not F and S) = 0.2. 0.18 ÷ 0.38.",lines=6,label="Answer"),
  Q("A fair dice is thrown three times. Find the probability of at least one six.",3,"91/216","1 − (5/6)³.",label="Answer")],
 ["Use the fact that probabilities add up to 1.","Estimate with relative frequency and expected outcomes.","Draw and use tree diagrams: multiply along, add between.","Handle without-replacement problems by changing the second branches.","Use 1 − P(none), conditional probability and algebra."])

V1=venn("F","S","12","5","8","5")
S["prob-venn-diagrams"]=sheet("MF-CF-PROB-VENN","Data and probability","Venn diagrams","Venn diagrams",
 "Overlaps are where the marks hide. Secure set notation, extend to surveys and conditional probability, then master Venn diagrams with algebra and three sets.",
 ["Set notation: ∩, ∪, complement, and probabilities from a diagram.","Surveys with an overlap, conditional probability, and tampered evidence.","Algebra in Venn diagrams, three sets, and independence."],
 ["ξ is everything. <b>A ∩ B</b> (intersection) is in both. <b>A ∪ B</b> (union) is in either or both. <b>A′</b> is everything not in A.",
  "Fill a Venn diagram from the <b>middle outwards</b>: the overlap first, then 'only A' and 'only B', then outside. For <b>given that</b> questions, the total becomes only the part you're told about."],
 ["Put the overlap in first.","Subtract to find 'only A' and 'only B'. Don't count the overlap twice.","Check every region adds up to the total in ξ.","For P(B given A), divide by the number in A, not the total."],
 {"question":"40 officers were asked if they have a dog (D) or a cat (C). 18 have a dog, 15 a cat, and 6 have both. Find the probability that an officer chosen at random has neither.","steps":["Both: 6 in the overlap.","Dog only: 18 − 6 = 12. Cat only: 15 − 6 = 9.","Inside the circles: 12 + 6 + 9 = 27. Outside: 40 − 27 = 13.","P(neither) = "+F("13","40")+". Check: 12 + 6 + 9 + 13 = 40 ✓"],"answer":F("13","40")},
 [Q("ξ = {1, 2, 3, …, 12}. A = multiples of 3. B = even numbers. List the members of A ∩ B.",2,"{6, 12}",label="A ∩ B ="),
  Q("Using the same sets, list the members of A ∪ B.",2,"{2, 3, 4, 6, 8, 9, 10, 12}",label="A ∪ B ="),
  Q("Using the same sets, a number is chosen at random from ξ. Find P((A ∪ B)′).",2,"1/3","{1, 5, 7, 11}: 4 out of 12.",label="Answer"),
  W(Q("The Venn diagram shows 30 trainees who study French (F) and Spanish (S). Find the probability a trainee chosen at random studies French.",2,"17/30","12 + 5.",label="Answer",tip="'Studies French' includes the overlap. It's 12 + 5, not 12."),V1),
  Q("Using the Venn diagram, how many trainees are in S′?",1,"17","12 + 5 outside S.",label="Answer")],
 [Q("50 people were asked about pets. 28 own a dog, 20 own a cat and 9 own both. How many own neither?",3,"11","19 dog only + 9 + 11 cat only = 39. 50 − 39.",label="Answer"),
  Q("Using the same survey, find the probability that a person chosen at random owns a cat but not a dog.",2,"11/50",label="Answer"),
  Q("Using the same survey, a dog owner is chosen at random. Find the probability they also own a cat.",2,"9/28","Given a dog owner: out of 28, not 50.",label="Answer"),
  Q("ξ = {1, 2, …, 12}, A = multiples of 3, B = even numbers. List A′ ∩ B.",2,"{2, 4, 8, 10}","Even, but not a multiple of 3.",label="A′ ∩ B ="),
  Q("Nia worked out how many of the 50 people own a pet. Find her mistake.",2,"39","She counted the 9 who own both twice: 28 + 20 − 9.",tampered="28 + 20 = 48 people own a pet",label="Answer")],
 [Q(["40 people were surveyed. 25 are in group A, 22 in group B, and 5 are in neither.","How many are in both A and B?"],3,"12","25 + 22 − x + 5 = 40.",label="Answer"),
  Q("Using the same survey, a person in A is chosen at random. Find the probability they are also in B.",2,"12/25",label="Answer"),
  W(Q(["The Venn diagram shows 50 detectives. Find x, then the probability that a detective chosen at random is in B."],4,"x = 7; P(B) = 3/5","2x + (x + 3) + (3x − 1) + 6 = 50, so 6x = 42. B: 10 + 20 = 30.",lines=5,label="x = ____ P(B) ="),venn("A","B","2x","x + 3","3x − 1","6")),
  Q("ξ = {1, 2, …, 20}. P = prime numbers, E = even numbers, S = square numbers. How many numbers are in exactly two of the sets?",3,"3","P ∩ E = {2}; E ∩ S = {4, 16}; P ∩ S is empty.",label="Answer"),
  Q("P(A) = 0.5, P(B) = 0.4 and P(A ∩ B) = 0.2. Are A and B independent? Give a reason.",2,"Yes: P(A) × P(B) = 0.2 = P(A ∩ B).",label="Yes / No")],
 ["Read and use ∩, ∪ and complement.","Fill a Venn diagram from the overlap outwards.","Find probabilities, including 'given that'.","Use algebra to find missing values in a Venn diagram.","Test whether two events are independent."])
for name,d in S.items():
    json.dump(d,open(f"{name}.json","w"),ensure_ascii=False,indent=1)
print(list(S))
