"""Maths Forensics case-file worksheets (A4 PDF), styled after the Mark Recovery System Casefiles:
cover band, cyan case-briefing box, yellow worked-example box, a three-level Knowledge Check
(Securing / Extending / Mastery), yellow solution boxes, then Case Closed and Your next assignment.
Usage: python3 case_sheet.py sheet.json [...]  -> sheet.html next to each json (then node topdf.js)"""
import base64, html, io, json, pathlib, sys
import qrcode

E = html.escape
LV = {"s": "Securing", "e": "Extending", "m": "Mastery"}
SHIELD = """<svg viewBox="0 0 40 46" aria-hidden="true"><path d="M20 2 37 8v13c0 11-7.5 19.5-17 23C10.5 40.5 3 32 3 21V8z" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="18" cy="20" r="7" fill="none" stroke="currentColor" stroke-width="3"/><path d="m23 25 6 6" stroke="#1B36FF" stroke-width="4" stroke-linecap="round"/></svg>"""

def qr(url):
    b = io.BytesIO(); qrcode.make(url, box_size=6, border=1).save(b, format="PNG")
    return "data:image/png;base64," + base64.b64encode(b.getvalue()).decode()

CSS = """
@page{size:A4;margin:11mm 13mm 15mm}
*{box-sizing:border-box}
:root{--navy:#0B122C;--cyan:#00FCF1;--teal:#00A99F;--blue:#1B36FF;--ink:#16203F;--muted:#5B6585;--line:#D5DAEA;--soft:#F3F6FC;
 --cy-bg:#E6FFFE;--cy-bd:#00D9CF;--ye-bg:#FFF8D6;--ye-bd:#F2C200;--ye-ink:#6B5200}
body{margin:0;font-family:Inter,"DejaVu Sans",sans-serif;color:var(--ink);font-size:10.5pt;line-height:1.45;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.pb{break-before:page}
.mono{font-family:"DejaVu Sans Mono",monospace;letter-spacing:.16em;text-transform:uppercase}
/* cover band */
.cover{background:var(--navy);color:#EAF0FF;border-radius:3mm;padding:8mm 9mm 7mm;position:relative;overflow:hidden}
.cover:after{content:"";position:absolute;right:-18mm;top:-18mm;width:70mm;height:70mm;border-radius:50%;border:1.2mm solid rgba(0,252,241,.18)}
.brand{display:flex;gap:3mm;align-items:center;color:var(--cyan)}
.brand svg{width:10mm;height:11.5mm}
.brand b{display:block;font-family:"Inter Display",Inter,sans-serif;font-weight:800;letter-spacing:.08em;font-size:12pt;color:#fff}
.brand span{display:block;font-size:7pt}
.cover .series{margin-top:7mm;color:var(--cyan);font-size:7.6pt}
.cover h1{font-family:"Inter Display",Inter,sans-serif;font-weight:800;font-size:28pt;line-height:1.02;margin:1.5mm 0 2mm;color:#fff;text-transform:uppercase;letter-spacing:.01em}
.cover .sub{color:#B7C2E6;font-size:10pt;max-width:120mm}
.cover .chips{display:flex;gap:2mm;margin-top:4.5mm;flex-wrap:wrap}
.cover .chips span{font-size:7.2pt;padding:1.2mm 2.6mm;border-radius:10mm;border:1px solid rgba(255,255,255,.25);color:#EAF0FF}
.cover .chips .s{background:#00A99F;border-color:#00A99F}.cover .chips .e{background:var(--blue);border-color:var(--blue)}.cover .chips .m{background:#fff;color:var(--navy);border-color:#fff}
.cover .code{position:absolute;right:9mm;top:8mm;text-align:right;font-size:7pt;color:#9AA6CC}
.cover .code b{display:block;color:var(--cyan);font-size:8.4pt}
.who{display:grid;grid-template-columns:2fr 1fr 1fr;gap:5mm;margin:4.5mm 0 4mm;font-size:8.6pt;color:var(--muted)}
.who span{border-bottom:1px solid var(--line);padding-bottom:5mm}
h2.st{font-family:"Inter Display",Inter,sans-serif;font-weight:800;font-size:14pt;text-transform:uppercase;letter-spacing:.02em;margin:5mm 0 2.5mm;display:flex;align-items:center;gap:3mm;break-after:avoid}
h2.st:after{content:"";flex:1;height:1.2pt;background:var(--cyan)}
.cyan{background:var(--cy-bg);border:1px solid var(--cy-bd);border-left:3.5pt solid var(--cy-bd);border-radius:2mm;padding:3.5mm 4.5mm;break-inside:avoid}
.cyan h3,.yellow h3{margin:0 0 1.5mm;font-size:7.6pt;color:#007F78}
.yellow h3{color:var(--ye-ink)}
.cyan p{margin:0 0 1.6mm}.cyan p:last-child{margin:0}
.cyan ol{margin:1mm 0 0;padding-left:5mm}.cyan li{margin:.6mm 0}
.ex{margin-top:3.5mm;break-inside:avoid}
.ex .q{font-weight:600;margin:0 0 2mm}
.ex .q em{font-style:normal;font-family:"DejaVu Sans Mono",monospace;font-size:7.6pt;letter-spacing:.14em;color:var(--blue);margin-right:2mm}
.yellow{background:var(--ye-bg);border:1px solid var(--ye-bd);border-left:3.5pt solid var(--ye-bd);border-radius:2mm;padding:3mm 4.5mm;break-inside:avoid}
.yellow .step{display:grid;grid-template-columns:6mm 1fr;gap:1mm;margin:.8mm 0}
.yellow .step b{color:var(--ye-ink)}
.yellow .fin{margin-top:2mm;font-weight:700}
.eq{font-family:"DejaVu Serif",serif;font-size:11pt}
.frac{display:inline-flex;flex-direction:column;align-items:center;vertical-align:middle;margin:0 .2em;font-family:"DejaVu Serif",serif;line-height:1.25}
.frac .nu{padding:0 .25em .15em;border-bottom:1px solid currentColor}.frac .de{padding:.15em .25em 0}
.rad{white-space:nowrap}.rad .ov{border-top:1px solid currentColor;padding:0 .12em;margin-left:-.05em}
.display{text-align:center;margin:2mm 0;font-size:12.5pt}
.levels{display:grid;grid-template-columns:repeat(3,1fr);gap:3mm;margin:3mm 0 1mm;font-size:8.6pt}
.levels div{border-radius:2mm;padding:2.5mm 3mm;border:1px solid var(--line)}
.levels b{display:block;font-size:9.4pt;margin-bottom:.5mm}
.levels .s{border-top:2.5pt solid #00A99F}.levels .e{border-top:2.5pt solid var(--blue)}.levels .m{border-top:2.5pt solid var(--navy)}
.sect{margin:4.5mm 0 1mm;display:flex;align-items:center;gap:3mm;break-after:avoid}
.sect .tag{font-family:"Inter Display",Inter,sans-serif;font-weight:800;color:#fff;padding:1.4mm 3.5mm;border-radius:1.5mm;font-size:10.5pt;text-transform:uppercase;letter-spacing:.04em}
.sect.s .tag{background:#00A99F}.sect.e .tag{background:var(--blue)}.sect.m .tag{background:var(--navy);box-shadow:inset 0 -1.2mm 0 var(--cyan)}
.sect p{margin:0;font-size:8.8pt;color:var(--muted)}
.sect .rule{flex:1;height:1px;background:var(--line)}
.qg{break-inside:avoid}
.qq{display:grid;grid-template-columns:7mm 1fr 12mm;gap:2mm;padding:2.6mm 0;border-bottom:1px solid #EEF1F8}
.qq .n{width:6.4mm;height:6.4mm;border-radius:50%;background:var(--navy);color:var(--cyan);display:grid;place-items:center;font-weight:700;font-size:8.4pt}
.qq .mk{text-align:right;font-family:"DejaVu Sans Mono",monospace;font-size:8pt;color:var(--muted)}
.qq .t p{margin:0 0 1mm}
.qq .eq{display:block;margin:1mm 0 1mm 4mm}
.space{margin-top:1.5mm;background-image:linear-gradient(#C3CADF 1px,transparent 1px);background-size:100% 7mm;background-position:0 6.9mm}
.ans{display:flex;justify-content:flex-end;gap:2mm;align-items:flex-end;font-size:8.6pt;color:var(--muted);margin-top:1mm}
.ans span{display:inline-block;min-width:38mm;border-bottom:1px solid var(--ink);height:5mm}
.tip{margin:2mm 0 1mm;padding:2.3mm 3.5mm;border-radius:2mm;background:var(--cy-bg);border:1px dashed var(--cy-bd);font-size:8.9pt}
.tip b.mono{font-size:7pt;color:#007F78;margin-right:2mm}
.tampered{border:1.5px dashed var(--blue);border-radius:2mm;padding:2mm 3mm;margin:1.5mm 0;font-family:"DejaVu Serif",serif;font-size:10pt;background:#FAFBFF}
.tampered small{display:block;font-family:"DejaVu Sans Mono",monospace;font-size:6.8pt;letter-spacing:.16em;color:var(--blue);margin-bottom:1mm}
.marked{display:grid;grid-template-columns:1fr 22mm;gap:4mm;align-items:center;margin-top:3mm;padding:3mm 4mm;border-radius:2mm;background:var(--navy);color:#EAF0FF;font-size:9pt;break-inside:avoid}
.marked b{color:var(--cyan)}.marked img{width:22mm;height:22mm;background:#fff;border-radius:1mm;padding:1mm}
.sols{columns:2;column-gap:5mm}
.sol{break-inside:avoid;margin:0 0 3mm;font-size:9pt}
.sol .yellow{padding:2.4mm 3.2mm}
.sol .h{display:flex;justify-content:space-between;align-items:center;margin-bottom:1mm}
.sol .h b{font-size:9.4pt}
.sol .lvl{font-size:6.4pt;padding:.4mm 1.6mm;border-radius:1mm;color:#fff}
.sol .w{color:#4B4320;font-size:8.5pt;margin-top:.6mm}
.sol .a{font-weight:700;margin-top:.8mm}
.track{border:1px solid var(--line);border-radius:2mm;padding:3mm 4mm;break-inside:avoid;margin-top:2mm}
.track table{width:100%;border-collapse:collapse;font-size:8.8pt;margin-top:1.5mm}
.track th,.track td{border:1px solid var(--line);padding:1.6mm 2mm;text-align:center}
.track th{background:var(--soft);font-weight:600}.track td:first-child,.track th:first-child{text-align:left}
.rma{display:grid;grid-template-columns:repeat(3,1fr);gap:3mm;margin-top:2.5mm;font-size:8.4pt}
.rma div{background:var(--soft);border-radius:1.5mm;padding:2mm 2.5mm}.rma b{display:block;color:var(--blue)}
.closed{margin-top:5mm;background:var(--navy);color:#DDE5FF;border-radius:3mm;padding:6mm 7mm;break-inside:avoid}
.closed h2{font-family:"Inter Display",Inter,sans-serif;font-weight:800;color:#fff;font-size:15pt;text-transform:uppercase;margin:0 0 2mm}
.closed h2 em{font-style:normal;color:var(--cyan)}
.closed ul{margin:2mm 0 0;padding-left:5mm}.closed li{margin:.8mm 0}
.closed .tag{color:var(--cyan);font-weight:700;margin-top:3mm}
.next{display:grid;grid-template-columns:1fr 24mm;gap:5mm;align-items:center;margin-top:4mm;border:1.5px solid var(--cy-bd);border-radius:3mm;padding:4.5mm 5mm;background:var(--cy-bg);break-inside:avoid}
.next h3{margin:0 0 1mm;font-size:7.6pt;color:#007F78}
.next b.big{display:block;font-family:"Inter Display",Inter,sans-serif;font-size:13pt;margin-bottom:1mm}
.next p{margin:0;font-size:9.2pt}
.next .url{font-family:"DejaVu Sans Mono",monospace;font-size:8pt;color:var(--blue);margin-top:1.5mm}
.next img{width:24mm;height:24mm;background:#fff;border-radius:1mm;padding:1mm;border:1px solid var(--line)}
"""

def question(i, q):
    b = "".join(f"<p>{p}</p>" for p in q["text"])
    if q.get("eqs"): b += "".join(f'<span class="eq">{e}</span>' for e in q["eqs"])
    if q.get("svg"): b += q["svg"]
    if q.get("tampered"): b += f'<div class="tampered"><small>TAMPERED EVIDENCE · FIND THE MISTAKE</small>{q["tampered"]}</div>'
    b += f'<div class="space" style="height:{q.get("lines",3)*7}mm"></div>'
    if q.get("answer_label") is not False: b += f'<div class="ans">{q.get("answer_label","Answer")}<span></span></div>'
    return f'<div class="qq"><div class="n">{i}</div><div class="t">{b}</div><div class="mk">[{q["marks"]}]</div></div>'

def build(s):
    lvc = {"s": "#00A99F", "e": "var(--blue)", "m": "var(--navy)"}
    cover = f"""<div class="cover"><div class="brand">{SHIELD}<div><b>MATHS FORENSICS</b><span class="mono">{E(s["product_line"])}</span></div></div>
      <div class="series mono">Case file series · {E(s["strand"])}</div><h1>{s["title"]}</h1><div class="sub">{s["cover_sub"]}</div>
      <div class="chips">{"".join(f'<span class="{k} mono">{LV[k]} · {E(s["levels"][k])}</span>' for k in "sem")}</div>
      <div class="code mono"><b>{E(s["code"])}</b>{E(s["level_line"])} · {E(s["time"])}</div></div>
      <div class="who"><span>Name</span><span>Class</span><span>Date</span></div>"""
    brief = f"""<h2 class="st">Case briefing</h2><div class="cyan"><h3 class="mono">What you need to know</h3>{"".join(f"<p>{p}</p>" for p in s["briefing"])}
      {"<ol>" + "".join(f"<li>{x}</li>" for x in s["method"]) + "</ol>" if s.get("method") else ""}</div>"""
    ex = s["example"]
    steps = "".join(f'<div class="step"><b>{i}</b><span>{st}</span></div>' for i, st in enumerate(ex["steps"], 1))
    brief += f"""<div class="ex"><p class="q"><em>WORKED EXAMPLE</em>{ex["question"]}</p>
      <div class="yellow"><h3 class="mono">Solution</h3>{steps}<div class="fin">✓ {ex["answer"]}</div></div></div>"""
    kc = f"""<div style="break-inside:avoid"><h2 class="st">Knowledge check</h2><p style="margin:0;font-size:9.4pt">{s.get("kc_intro","Use your investigative skills to solve each case. Show full working: the method marks are where most students lose out.")}</p>
      <div class="levels">{"".join(f'<div class="{k}"><b>{LV[k]}</b>{E(s["levels_long"][k])}<br><span style="color:var(--muted)">Secured ☐</span></div>' for k in "sem")}</div></div>"""
    n = 0
    for k in "sem":
        sec = s["sections"][k]
        kc += f'<div class="sect {k}{" pb" if sec.get("newpage") else ""}"><span class="tag">{LV[k]}</span><p>{sec["blurb"]}</p><span class="rule"></span></div>'
        for q in sec["questions"]:
            n += 1
            tip = f'<div class="tip"><b class="mono">Forensic tip</b>{q["tip"]}</div>' if q.get("tip") else ""
            kc += f'<div class="qg">{question(n, q)}{tip}</div>'
        if k == "m" and s.get("marked_url") and not s.get("free"):
            kc += f'<div class="marked"><div><b>Get your Mastery working marked.</b> Open Forensic Marking, choose <b>{E(s["marked_topic"])}</b>, then write or photograph your working. Every mark explained, line by line.<br><span style="color:#9AA6CC;font-size:8pt">{E(s["marked_url"])}</span></div><img src="{qr(s["marked_url"])}" alt="QR code"></div>'
    sols, n = [], 0
    for k in "sem":
        for q in s["sections"][k]["questions"]:
            n += 1
            if k == "m" and s.get("free"): continue
            sols.append(f'<div class="sol"><div class="yellow"><div class="h"><b>Q{n}</b><span class="lvl mono" style="background:{lvc[k]}">{LV[k]}</span></div>'
                        f'{f"<div class=w>{q["working"]}</div>" if q.get("working") else ""}<div class="a">✓ {q["answer"]}</div></div></div>')
    lock = ""
    if s.get("free"):
        lu = s["marked_url"]
        lock = f'<div class="marked" style="margin:1mm 0 3mm"><div><b>Mastery solutions are in the Lab.</b> Grades 8 and 9 are won on method, so a bare answer won\'t tell you much. Photograph or write your Mastery working in <b>Forensic Marking</b> and get it marked mark by mark, with the full solution and the mistake behind every lost mark. Your first marked question is free.<br><span style="color:#9AA6CC;font-size:8pt">{E(lu)}</span></div><img src="{qr(lu)}" alt="QR code"></div>'
    marks = {k: sum(q["marks"] for q in s["sections"][k]["questions"]) for k in "sem"}
    nx = s["next"]
    end = f"""<h2 class="st pb">Knowledge check: solutions</h2><p style="margin:0 0 3mm;font-size:9.2pt;color:var(--muted)">Check your method as well as your answer. In the exam, an answer with no working usually earns the final mark at most.</p>
      <div class="sols">{"".join(sols)}</div>{lock}
      <div class="track"><b style="font-size:10pt">Mark your evidence</b><table><tr><th>Level</th><th>Marks</th><th>My score</th><th>Secured? (every mark)</th></tr>
      {"".join(f"<tr><td>{LV[k]}</td><td>{marks[k]}</td><td></td><td>☐</td></tr>" for k in "sem")}</table>
      <div class="rma"><div><b>R · Reading</b>Misread or missed part of the question</div><div><b>M · Method</b>Didn't know how to do it</div><div><b>A · Accuracy</b>Knew how, slipped in the working</div></div>
      <p style="font-size:8.3pt;color:var(--muted);margin:2mm 0 0">Write R, M or A next to every mark you lost. Mostly R or A? The fix is technique, not more practice of the topic.</p></div>
      <div class="closed"><h2>Case closed: <em>{E(s["closed_title"])}</em></h2><div>In this case file you've learned to:</div><ul>{"".join(f"<li>{x}</li>" for x in s["closed_points"])}</ul>
      <div class="tag">Because every case comes down to one principle: numbers don't lie.</div></div>
      <div class="next"><div><h3 class="mono">Your next assignment</h3><b class="big">{nx["title"]}</b><p>{nx["text"]}</p><div class="url">{E(nx["url"])}</div></div><img src="{qr(nx["url"])}" alt="QR code"></div>"""
    return f'<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><title>{E(s["code"])}</title><style>{CSS}</style></head><body>{cover}{brief}{kc}{end}</body></html>'

if __name__ == "__main__":
    for f in sys.argv[1:]:
        p = pathlib.Path(f).with_suffix(".html"); p.write_text(build(json.loads(pathlib.Path(f).read_text()))); print("wrote", p)
