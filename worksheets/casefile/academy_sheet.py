"""Maths Forensics Academy revision worksheets (A4 PDF), for Years 7-9, written for parents supporting at home.
Same Casefile look as the GCSE sheets, with Academy labels and three levels: Developing / Securing / Extending.
Each sheet: cover, a note for parents, Learn it (briefing + worked examples), three levels of practice,
a full answer key with the mistakes to look out for, a progress check, then Case Closed.
Usage: python3 academy_sheet.py sheet.json [...]  -> sheet.html (then node topdf.js)"""
import json, pathlib, sys
from case_sheet import CSS as BASE_CSS, SHIELD, E, qr

LV = {"d": "Developing", "s": "Securing", "e": "Extending"}
CLS = {"d": "s", "s": "e", "e": "m"}  # reuse the GCSE sheet colours: teal, blue, navy
COL = {"d": "#00A99F", "s": "var(--blue)", "e": "var(--navy)"}

CSS = BASE_CSS + """
.parents{display:grid;grid-template-columns:1fr 1fr;gap:3mm;margin:0 0 1mm}
.parents div{background:var(--soft);border-radius:2mm;padding:2.6mm 3.5mm;font-size:8.9pt;break-inside:avoid}
.parents b.mono{display:block;font-size:7.2pt;color:var(--blue);margin-bottom:.8mm}
.parents p{margin:0}
.qq{grid-template-columns:7mm 1fr}
.miss{margin-top:3mm;border:1px solid var(--ye-bd);background:#FFFDF2;border-radius:2mm;padding:3mm 4mm;break-inside:avoid;font-size:9pt}
.miss h3{margin:0 0 1.2mm;font-size:7.6pt;color:var(--ye-ink)}
.miss ul{margin:0;padding-left:5mm}.miss li{margin:.6mm 0}
.exs{display:grid;gap:3mm}
.cover .chips .m{background:#fff;color:var(--navy)}
.akey{margin:0 0 2mm;font-size:9.2pt;color:var(--muted)}
"""

def question(i, q):
    b = "".join(f"<p>{p}</p>" for p in q["text"])
    if q.get("eqs"): b += "".join(f'<span class="eq">{e}</span>' for e in q["eqs"])
    if q.get("svg"): b += q["svg"]
    if q.get("tampered"): b += f'<div class="tampered"><small>TAMPERED EVIDENCE · FIND THE MISTAKE</small>{q["tampered"]}</div>'
    if q.get("lines", 2): b += f'<div class="space" style="height:{q.get("lines",2)*7}mm"></div>'
    if q.get("answer_label") is not False: b += f'<div class="ans">{q.get("answer_label","Answer")}<span></span></div>'
    return f'<div class="qq"><div class="n">{i}</div><div class="t">{b}</div></div>'

def example(ex):
    steps = "".join(f'<div class="step"><b>{i}</b><span>{st}</span></div>' for i, st in enumerate(ex["steps"], 1))
    return f"""<div class="ex"><p class="q"><em>WORKED EXAMPLE</em>{ex["question"]}</p>
      <div class="yellow"><h3 class="mono">Solution</h3>{steps}<div class="fin">✓ {ex["answer"]}</div></div></div>"""

def build(s):
    cover = f"""<div class="cover"><div class="brand">{SHIELD}<div><b>MATHS FORENSICS ACADEMY</b><span class="mono">{E(s["product_line"])}</span></div></div>
      <div class="series mono">Academy revision · {E(s["strand"])}</div><h1>{s["title"]}</h1><div class="sub">{s["cover_sub"]}</div>
      <div class="chips">{"".join(f'<span class="{CLS[k]} mono">{LV[k]}</span>' for k in "dse")}<span class="mono">Answers included</span></div>
      <div class="code mono"><b>{E(s["code"])}</b>{E(s["level_line"])} · {E(s["time"])}</div></div>
      <div class="who"><span>Name</span><span>Class</span><span>Date</span></div>"""
    p = s["parents"]
    parents = f"""<div class="parents">
      <div><b class="mono">For parents: how to use this sheet</b><p>Read <b>Learn it</b> together first and talk through the worked examples. Then let your child try the questions on their own. Start at <b>Developing</b>; move up when they get most of a level right. Answers are at the back.</p></div>
      <div><b class="mono">What to listen for</b><p>{p["listen"]}</p></div></div>"""
    learn = f"""<h2 class="st">Learn it</h2><div class="cyan"><h3 class="mono">What you need to know</h3>{"".join(f"<p>{x}</p>" for x in s["briefing"])}
      {"<ol>" + "".join(f"<li>{x}</li>" for x in s["method"]) + "</ol>" if s.get("method") else ""}</div>
      <div class="exs">{"".join(example(ex) for ex in s["examples"])}</div>"""
    kc = f"""<div style="break-inside:avoid"><h2 class="st">Practice</h2><p style="margin:0;font-size:9.4pt">Show your working: it helps you check, and it's how marks are won in tests.</p>
      <div class="levels">{"".join(f'<div class="{CLS[k]}"><b>{LV[k]}</b>{E(s["levels_long"][k])}</div>' for k in "dse")}</div></div>"""
    n = 0
    for k in "dse":
        sec = s["sections"][k]
        kc += f'<div class="sect {CLS[k]}{" pb" if sec.get("newpage") else ""}"><span class="tag">{LV[k]}</span><p>{sec["blurb"]}</p><span class="rule"></span></div>'
        for q in sec["questions"]:
            n += 1
            tip = f'<div class="tip"><b class="mono">Forensic tip</b>{q["tip"]}</div>' if q.get("tip") else ""
            kc += f'<div class="qg">{question(n, q)}{tip}</div>'
    sols, n = [], 0
    for k in "dse":
        for q in s["sections"][k]["questions"]:
            n += 1
            sols.append(f'<div class="sol"><div class="yellow"><div class="h"><b>Q{n}</b><span class="lvl mono" style="background:{COL[k]}">{LV[k]}</span></div>'
                        f'{f"<div class=w>{q["working"]}</div>" if q.get("working") else ""}<div class="a">✓ {q["answer"]}</div></div></div>')
    counts = {k: len(s["sections"][k]["questions"]) for k in "dse"}
    nx = s["next"]
    end = f"""<h2 class="st pb">Answer key</h2><p class="akey">For checking together. A right answer with the wrong working is worth a second look: ask your child to explain how they got it.</p>
      <div class="sols">{"".join(sols)}</div>
      <div class="miss"><h3 class="mono">Mistakes to look out for</h3><ul>{"".join(f"<li>{x}</li>" for x in s["mistakes"])}</ul></div>
      <div class="track"><b style="font-size:10pt">How did it go?</b><table><tr><th>Level</th><th>Questions</th><th>Right first time</th><th>Got it now?</th></tr>
      {"".join(f"<tr><td>{LV[k]}</td><td>{counts[k]}</td><td></td><td>☐</td></tr>" for k in "dse")}</table>
      <div class="rma"><div><b>R · Reading</b>Misread or missed part of the question</div><div><b>M · Method</b>Didn't know how to do it yet</div><div><b>A · Accuracy</b>Knew how, slipped in the working</div></div>
      <p style="font-size:8.3pt;color:var(--muted);margin:2mm 0 0">Next to each wrong answer, write R, M or A. Mostly R or A? Slow down and check. Mostly M? Go back to Learn it and the worked examples.</p></div>
      <div class="closed"><h2>Case closed: <em>{E(s["closed_title"])}</em></h2><div>On this sheet you've practised how to:</div><ul>{"".join(f"<li>{x}</li>" for x in s["closed_points"])}</ul>
      <div class="tag">Because every case comes down to one principle: numbers don't lie.</div></div>
      <div class="next"><div><h3 class="mono">Your next assignment</h3><b class="big">{nx["title"]}</b><p>{nx["text"]}</p><div class="url">{E(nx["url"].replace("https://",""))}</div></div><img src="{qr(nx["url"])}" alt="QR code"></div>"""
    return f'<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><title>{E(s["code"])}</title><style>{CSS}</style></head><body>{cover}{parents}{learn}{kc}{end}</body></html>'

if __name__ == "__main__":
    for f in sys.argv[1:]:
        p = pathlib.Path(f).with_suffix(".html"); p.write_text(build(json.loads(pathlib.Path(f).read_text()))); print("wrote", p)
