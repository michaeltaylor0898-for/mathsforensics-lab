"""Builds Maths Forensics practice / challenge sheets (A4 PDF) from a simple data description.
One template for both products:
  Academy practice sheet  (KS3, Years 7-9)  -> accent orange, levels Securing / Extending / Mastery
  Lab challenge sheet     (GCSE)            -> accent cyan/blue, levels tied to grades 4-5 / 6-7 / 8-9
Usage: python3 make_sheet.py  (writes sheet HTML + PDF next to this file)"""
import base64, html, io, json, pathlib, subprocess, sys
import qrcode

HERE = pathlib.Path(__file__).parent
E = html.escape

def qr_svg_data(url):
    img = qrcode.make(url, box_size=6, border=1)
    buf = io.BytesIO(); img.save(buf, format="PNG")
    return "data:image/png;base64," + base64.b64encode(buf.getvalue()).decode()

SHIELD = """<svg viewBox="0 0 40 46" aria-hidden="true"><path d="M20 2 37 8v13c0 11-7.5 19.5-17 23C10.5 40.5 3 32 3 21V8z" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="18" cy="20" r="7" fill="none" stroke="currentColor" stroke-width="3"/><path d="m23 25 6 6" stroke="#1B36FF" stroke-width="4" stroke-linecap="round"/></svg>"""

CSS = """
@page{size:A4;margin:11mm 13mm 15mm}
*{box-sizing:border-box}
:root{--navy:#0B122C;--cyan:#00FCF1;--teal:#00A99F;--blue:#1B36FF;--ink:#16203F;--muted:#5B6585;--line:#D5DAEA;--soft:#F3F6FC;--acc:var(--teal);--acc2:var(--blue)}
body{margin:0;font-family:Inter,"DejaVu Sans",sans-serif;color:var(--ink);font-size:10.6pt;line-height:1.42;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.academy{--acc:#D8955B;--acc2:#B8642A}
.pb{break-before:page}
.qg{break-inside:avoid}
.top{border-radius:3mm;background:var(--navy);color:#EAF0FF;padding:7mm 8mm 6mm;display:grid;grid-template-columns:1fr auto;gap:6mm;align-items:end}
.brand{display:flex;gap:3mm;align-items:center;color:var(--cyan)}.academy .brand{color:#F0B27A}
.brand svg{width:11mm;height:12.5mm}
.brand b{display:block;font-family:"Inter Display",Inter,sans-serif;font-weight:800;letter-spacing:.06em;font-size:13pt;color:#fff}
.brand span{display:block;font-family:"DejaVu Sans Mono",monospace;font-size:7.4pt;letter-spacing:.22em}
.top h1{font-family:"Inter Display",Inter,sans-serif;font-weight:800;font-size:23pt;line-height:1.05;margin:5mm 0 0;color:#fff}
.top .meta{text-align:right;font-family:"DejaVu Sans Mono",monospace;font-size:7.6pt;letter-spacing:.08em;color:#9AA6CC}
.top .meta b{display:block;color:var(--cyan);font-size:9pt;letter-spacing:.14em;margin-bottom:1.5mm}.academy .top .meta b{color:#F0B27A}
.who{display:grid;grid-template-columns:2fr 1fr 1fr;gap:5mm;margin:5mm 0 4mm;font-size:8.6pt;color:var(--muted)}
.who span{border-bottom:1px solid var(--line);padding-bottom:5mm}
.intro{display:grid;grid-template-columns:1.25fr 1fr;gap:5mm;margin-bottom:4mm}
.notes{background:var(--soft);border-left:3pt solid var(--acc);border-radius:2mm;padding:3mm 4mm;font-size:9.4pt}
.notes h3,.levels h3{font-family:"DejaVu Sans Mono",monospace;font-size:7.4pt;letter-spacing:.18em;color:var(--acc2);margin:0 0 1.5mm;text-transform:uppercase}
.notes p{margin:0 0 1.2mm}
.levels{border:1px solid var(--line);border-radius:2mm;padding:3mm 4mm;font-size:8.8pt}
.levels div{display:grid;grid-template-columns:4.5mm 1fr auto;gap:2mm;align-items:center;margin:1.3mm 0}
.levels i{width:3.4mm;height:3.4mm;border-radius:1mm;display:block}
.levels em{font-style:normal;font-family:"DejaVu Sans Mono",monospace;font-size:7.4pt;color:var(--muted)}
.lv-s{background:var(--acc)}.lv-e{background:var(--acc2)}.lv-m{background:var(--navy)}
.sect{margin:3.5mm 0 1mm;display:flex;align-items:center;gap:3mm;break-after:avoid}
.sect .tag{font-family:"Inter Display",Inter,sans-serif;font-weight:800;color:#fff;padding:1.4mm 3.5mm;border-radius:1.5mm;font-size:11pt;letter-spacing:.02em}
.sect.s .tag{background:var(--acc)}.sect.e .tag{background:var(--acc2)}.sect.m .tag{background:var(--navy);box-shadow:inset 0 -1.2mm 0 var(--cyan)}
.academy .sect.m .tag{box-shadow:inset 0 -1.2mm 0 #F0B27A}
.sect p{margin:0;font-size:8.8pt;color:var(--muted)}
.sect .rule{flex:1;height:1px;background:var(--line)}
.q{display:grid;grid-template-columns:7mm 1fr 13mm;gap:2mm;padding:2.6mm 0;border-bottom:1px solid #EEF1F8;break-inside:avoid}
.q .n{width:6.2mm;height:6.2mm;border-radius:50%;background:var(--soft);border:1px solid var(--line);display:grid;place-items:center;font-weight:700;font-size:8.6pt}
.q .mk{text-align:right;font-family:"DejaVu Sans Mono",monospace;font-size:8pt;color:var(--muted)}
.q .t p{margin:0 0 1mm}
.q .eq{font-family:"DejaVu Serif",serif;font-size:11pt;display:block;margin:1mm 0 1mm 4mm}
.q .space{margin-top:1.5mm;background-image:linear-gradient(#C3CADF 1px,transparent 1px);background-size:100% 7mm;background-position:0 6.9mm}
.q .ans{display:flex;justify-content:flex-end;gap:2mm;align-items:flex-end;font-size:8.6pt;color:var(--muted);margin-top:1mm}
.q .ans span{display:inline-block;min-width:38mm;border-bottom:1px solid var(--ink);height:5mm}
.tip{margin:2.5mm 0;padding:2.5mm 3.5mm;border-radius:2mm;background:#E9FFFD;border:1px solid #9FEDE8;font-size:9pt;break-inside:avoid}
.academy .tip{background:#FFF4EA;border-color:#F3CDA9}
.tip b{font-family:"DejaVu Sans Mono",monospace;font-size:7.4pt;letter-spacing:.16em;color:var(--acc2);margin-right:2mm}
.tampered{border:1.5px dashed var(--acc2);border-radius:2mm;padding:2mm 3mm;margin:1.5mm 0;font-family:"DejaVu Serif",serif;font-size:10pt;background:#FAFBFF}
.tampered small{display:block;font-family:"DejaVu Sans Mono",monospace;font-size:7pt;letter-spacing:.16em;color:var(--acc2);margin-bottom:1mm}
.marked{display:grid;grid-template-columns:1fr 22mm;gap:4mm;align-items:center;margin-top:3mm;padding:3mm 4mm;border-radius:2mm;background:var(--navy);color:#EAF0FF;font-size:9pt;break-inside:avoid}
.marked b{color:var(--cyan)}.marked img{width:22mm;height:22mm;background:#fff;border-radius:1mm;padding:1mm}
.foot{margin-top:auto;padding-top:4mm;display:flex;justify-content:space-between;font-family:"DejaVu Sans Mono",monospace;font-size:7pt;color:var(--muted);letter-spacing:.06em}
.answers h2{font-family:"Inter Display",Inter,sans-serif;font-size:16pt;margin:5mm 0 1mm}
.answers .sub{color:var(--muted);font-size:9pt;margin:0 0 3mm}
.akey{columns:2;column-gap:7mm}
.a{break-inside:avoid;padding:2mm 0;border-bottom:1px solid #EEF1F8;font-size:9.2pt}
.a b{display:inline-block;min-width:7mm}
.a .w{display:block;color:var(--muted);font-size:8.4pt;margin:0.6mm 0 0 7mm}
.a .lvl{font-family:"DejaVu Sans Mono",monospace;font-size:6.8pt;letter-spacing:.12em;padding:.3mm 1.3mm;border-radius:1mm;color:#fff;margin-left:1.5mm;vertical-align:1px}
.track{margin-top:4mm;border:1px solid var(--line);border-radius:2mm;padding:3mm 4mm;break-inside:avoid}
.track table{width:100%;border-collapse:collapse;font-size:8.8pt;margin-top:1.5mm}
.track th,.track td{border:1px solid var(--line);padding:1.6mm 2mm;text-align:center}
.track th{background:var(--soft);font-weight:600}.track td:first-child,.track th:first-child{text-align:left}
.rma{display:grid;grid-template-columns:repeat(3,1fr);gap:3mm;margin-top:2.5mm;font-size:8.6pt}
.rma div{background:var(--soft);border-radius:1.5mm;padding:2mm 2.5mm}.rma b{display:block;color:var(--acc2)}
"""

LV = {"s": "Securing", "e": "Extending", "m": "Mastery"}

def question(i, q):
    body = "".join(f"<p>{p}</p>" for p in q["text"])
    if q.get("eqs"):
        body += "".join(f'<span class="eq">{e}</span>' for e in q["eqs"])
    if q.get("tampered"):
        body += f'<div class="tampered"><small>TAMPERED EVIDENCE · FIND THE MISTAKE</small>{q["tampered"]}</div>'
    lines = q.get("lines", 3)
    body += f'<div class="space" style="height:{lines*7}mm"></div>'
    if q.get("answer_label") is not False:
        body += f'<div class="ans">{q.get("answer_label","Answer")}<span></span></div>'
    return f'<div class="q"><div class="n">{i}</div><div class="t">{body}</div><div class="mk">[{q["marks"]}]</div></div>'

def build(sheet):
    acad = sheet["product"] == "academy"
    cls = "academy" if acad else "lab"
    prod = "ACADEMY · PRACTICE SHEET" if acad else "LAB · CHALLENGE SHEET"
    meta = f'<b>{E(sheet["code"])}</b>{sheet["level_line"]}<br>{sheet["time"]}'
    head = f"""<div class="top"><div><div class="brand">{SHIELD}<div><b>MATHS FORENSICS</b><span>{prod}</span></div></div>
      <h1>{sheet["title"]}</h1></div><div class="meta">{meta}</div></div>"""
    who = '<div class="who"><span>Name</span><span>Class</span><span>Date</span></div>'
    lv = "".join(f'<div><i class="lv-{k}"></i><span><b>{LV[k]}</b> · {sheet["levels"][k]}</span><em>☐</em></div>' for k in "sem")
    intro = f"""<div class="intro"><div class="notes"><h3>Case notes</h3>{"".join(f"<p>{p}</p>" for p in sheet["notes"])}</div>
      <div class="levels"><h3>Three levels</h3>{lv}<p style="margin:1.5mm 0 0;font-size:8pt;color:var(--muted)">Tick each level when you get every question right.</p></div></div>"""
    body, n = head + who + intro, 0
    for k in "sem":
        sec = sheet["sections"][k]
        body += f'<div class="sect {k}{" pb" if sec.get("newpage") else ""}"><span class="tag">{LV[k]}</span><p>{sec["blurb"]}</p><span class="rule"></span></div>'
        for q in sec["questions"]:
            n += 1
            tip = f'<div class="tip"><b>FORENSIC TIP</b>{q["tip"]}</div>' if q.get("tip") else ""
            body += f'<div class="qg">{question(n, q)}{tip}</div>'  # a tip always stays with its question
        if k == "m" and sheet.get("marked_url"):
            body += f'<div class="marked"><div><b>Get your Mastery working marked.</b> Open Forensic Marking, choose <b>{E(sheet["marked_topic"])}</b>, and write or photograph your working. Every mark explained, line by line.<br><span style="color:#9AA6CC;font-size:8pt">{E(sheet["marked_url"])}</span></div><img src="{qr_svg_data(sheet["marked_url"])}" alt="QR code"></div>'
    # answers page
    alist = []; n = 0
    for k in "sem":
        for q in sheet["sections"][k]["questions"]:
            n += 1
            col = {"s": "var(--acc)", "e": "var(--acc2)", "m": "var(--navy)"}[k]
            alist.append(f'<div class="a"><b>{n}</b>{q["answer"]}<span class="lvl" style="background:{col}">{LV[k][0]}</span>{f"<span class=w>{q["working"]}</span>" if q.get("working") else ""}</div>')
    marks = {k: sum(q["marks"] for q in sheet["sections"][k]["questions"]) for k in "sem"}
    track = f"""<div class="track"><h3 style="margin:0;font-size:10pt">Close the case</h3>
      <table><tr><th>Level</th><th>Marks</th><th>My score</th><th>Secured? (every mark)</th></tr>
      {"".join(f"<tr><td>{LV[k]}</td><td>{marks[k]}</td><td></td><td>☐</td></tr>" for k in "sem")}</table>
      <div class="rma"><div><b>R · Reading</b>Misread or missed part of the question</div><div><b>M · Method</b>Didn't know how to do it</div><div><b>A · Accuracy</b>Knew how, slipped in the working</div></div>
      <p style="font-size:8.4pt;color:var(--muted);margin:2mm 0 0">For every mark you lost, write R, M or A next to the question. If most are R or A, the fix is technique, not more topic practice.</p></div>"""
    body += (f"""<div class="answers pb"><div class="top"><div><div class="brand">{SHIELD}<div><b>MATHS FORENSICS</b><span>{prod} · ANSWERS</span></div></div>
      <h1>{sheet["title"]}: answers</h1></div><div class="meta"><b>{E(sheet["code"])}</b>Check only after you've finished</div></div>
      <h2>Answers and key steps</h2><p class="sub">An answer with no working shown earns only the final mark in an exam, if any. Check your method as well as your answer.</p>
      <div class="akey">{"".join(alist)}</div>{track}</div>""")
    out = body
    return f'<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><title>{E(sheet["code"])}</title><style>{CSS}</style></head><body class="{cls}">{out}</body></html>'

if __name__ == "__main__":
    for f in sys.argv[1:]:
        data = json.loads(pathlib.Path(f).read_text())
        p = pathlib.Path(f).with_suffix(".html"); p.write_text(build(data))
        print("wrote", p)
