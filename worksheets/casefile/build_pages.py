"""Builds the free worksheet pages for lab.mathsforensics.com/sheets/ from the sheet JSON + PDFs.
Output: ../../site/sheets/index.html, ../../site/sheets/<slug>/index.html, ../../site/sheets/pdf/<slug>.pdf"""
import json, pathlib, shutil, html, re
E=html.escape
HERE=pathlib.Path(__file__).parent; OUT=HERE.parent.parent/"site"/"sheets"
ORDER=["Number","Algebra","Graphs","Shape","Data and probability"]
SITE="https://lab.mathsforensics.com"
FAV=open(HERE.parent.parent/"site/index.html").read().split('<link rel="icon" href="',1)[1].split('"',1)[0]
def strip(s): return re.sub(r"<[^>]+>","",s)
CSS="""
:root{--ink:#0B122C;--panel:#111A3D;--line:#26336A;--text:#E8ECF8;--muted:#9AA6CC;--cyan:#00FCF1;--blue:#1B36FF;--teal:#00A99F}
*{box-sizing:border-box}body{margin:0;background:var(--ink);color:var(--text);font-family:"Josefin Sans",system-ui,sans-serif;font-size:18px;line-height:1.55}
a{color:var(--cyan)}.w{max-width:1120px;margin:0 auto;padding:0 20px}
header{border-bottom:1px solid var(--line)}header .w{display:flex;align-items:center;justify-content:space-between;height:64px}
.logo{display:flex;gap:10px;align-items:center;color:#fff;text-decoration:none;font-family:Unbounded,sans-serif;font-weight:800;font-size:15px;letter-spacing:.04em}
.logo img{width:26px;height:30px}
.nav{display:flex;align-items:center;gap:18px}.nav a{color:#C6CEE8;text-decoration:none;font-size:15.5px;font-weight:600}.nav a:hover,.nav a.cur{color:var(--cyan)}
.nav a.hq,.drop a.hq{background:var(--cyan);color:var(--ink);padding:9px 16px;border-radius:10px}
.menu{display:none;position:relative}.menu summary{list-style:none;cursor:pointer;font-family:"JetBrains Mono",monospace;font-size:13px;letter-spacing:.14em;border:1px solid var(--line);border-radius:10px;padding:9px 14px}
.menu summary::-webkit-details-marker{display:none}.drop{position:absolute;right:0;top:46px;background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:10px;display:flex;flex-direction:column;min-width:220px;z-index:5}
.drop a{color:#fff;text-decoration:none;padding:9px 10px;border-radius:8px}.drop a.hq{margin-top:6px;text-align:center}
@media(max-width:1100px){.nav{display:none}.menu{display:block}}
.eb{font-family:"JetBrains Mono",monospace;font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:var(--cyan)}
h1{font-family:Unbounded,sans-serif;font-weight:800;font-size:clamp(30px,5vw,48px);line-height:1.08;margin:10px 0 14px}
h2{font-family:Unbounded,sans-serif;font-weight:600;font-size:clamp(21px,3vw,27px);margin:0 0 12px}
.hero{padding-top:44px;padding-bottom:30px}.lede{color:#C6CEE8;font-size:20px;max-width:720px}
.btns{display:flex;gap:12px;flex-wrap:wrap;margin-top:22px}
.btn{display:inline-block;background:var(--cyan);color:var(--ink);font-weight:700;text-decoration:none;padding:13px 22px;border-radius:999px}
.btn.ghost{background:transparent;color:#fff;border:1.5px solid var(--line)}
.levels{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin:26px 0}
.lv{background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:16px 18px;border-top:4px solid var(--teal)}
.lv.e{border-top-color:var(--blue)}.lv.m{border-top-color:#fff}.lv b{display:block;font-size:19px}.lv span{color:var(--muted);font-size:16px}
section{padding:26px 0;border-top:1px solid var(--line)}
.q{background:#fff;color:#16203F;border-radius:12px;padding:16px 20px;margin:12px 0;font-size:17px}
.q .tag{font-family:"JetBrains Mono",monospace;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#fff;padding:3px 8px;border-radius:5px;margin-right:8px}
.q .s{background:var(--teal)}.q .e{background:var(--blue)}.q .m{background:var(--ink)}
.q p{margin:6px 0}.q .eq{display:block;font-family:Georgia,serif;margin:2px 0 2px 16px}
.frac{display:inline-flex;flex-direction:column;align-items:center;vertical-align:middle;margin:0 .2em;font-family:Georgia,serif;line-height:1.2}
.frac .nu{padding:0 .25em .1em;border-bottom:1px solid currentColor}.frac .de{padding:.1em .25em 0}.rad .ov{border-top:1px solid currentColor}
.q svg{max-width:100%!important;height:auto!important;margin-left:0!important}.q{overflow-wrap:anywhere}
.lab{display:grid;grid-template-columns:1fr 1fr;gap:16px}.card{background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:20px}
.card p{color:#C6CEE8;margin:6px 0 14px}
ul.tick{padding-left:0;list-style:none}ul.tick li{padding-left:26px;position:relative;margin:6px 0}ul.tick li:before{content:"✓";position:absolute;left:0;color:var(--cyan);font-weight:700}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:12px}
.tile{display:block;background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:16px;text-decoration:none;color:#fff}
.tile:hover{border-color:var(--cyan)}.tile small{display:block;color:var(--muted);font-size:15px;margin-top:4px}
footer{border-top:1px solid var(--line);padding:26px 0 40px;color:var(--muted);font-size:15px}
@media(max-width:720px){.levels,.lab{grid-template-columns:1fr}}
"""
def page(title,desc,canon,body,ld=""):
    return f"""<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>{E(title)}</title><meta name="description" content="{E(desc)}"><link rel="canonical" href="{canon}">
<meta property="og:title" content="{E(title)}"><meta property="og:description" content="{E(desc)}"><meta property="og:type" content="website"><meta property="og:url" content="{canon}">
<link rel="icon" href="{FAV}"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Unbounded:wght@600;800&family=Josefin+Sans:wght@400;600;700&family=JetBrains+Mono:wght@500;700&display=swap">
<style>{CSS}</style>{ld}</head><body>
<header><div class="w"><a class="logo" href="https://www.mathsforensics.com/"><img src="{FAV}" alt="">MATHS FORENSICS</a><nav class="nav"><a href="https://www.mathsforensics.com/">Home</a><a href="https://www.mathsforensics.com/the-lab">GCSE</a><a href="https://www.mathsforensics.com/cold-case">Past papers</a><a href="/sheets/" class="cur">Worksheets</a><a href="https://www.mathsforensics.com/academy">Years 7–9</a><a href="https://www.mathsforensics.com/jumpstart-lab">A-Level</a><a href="https://www.mathsforensics.com/schools">Schools</a><a href="https://www.mathsforensics.com/about">About</a><a class="hq" href="https://lab.mathsforensics.com/">Log in to HQ</a></nav><details class="menu"><summary>MENU</summary><div class="drop"><a href="https://www.mathsforensics.com/">Home</a><a href="https://www.mathsforensics.com/the-lab">GCSE</a><a href="https://www.mathsforensics.com/cold-case">Past papers</a><a href="/sheets/">Worksheets</a><a href="https://www.mathsforensics.com/academy">Years 7–9</a><a href="https://www.mathsforensics.com/jumpstart-lab">A-Level</a><a href="https://www.mathsforensics.com/schools">Schools</a><a href="https://www.mathsforensics.com/about">About</a><a class="hq" href="https://lab.mathsforensics.com/">Log in to HQ</a></div></details></div></header>
{body}
<footer><div class="w">© Maths Forensics · Free GCSE maths worksheets, Securing to Mastery · <a href="https://www.mathsforensics.com/">mathsforensics.com</a> · <a href="/privacy.html">Privacy</a></div></footer></body></html>"""
def qhtml(q,k):
    b="".join(f"<p>{p}</p>" for p in q["text"])
    if q.get("eqs"): b+="".join(f'<span class="eq">{e}</span>' for e in q["eqs"])
    if q.get("svg"): b+=q["svg"]
    if q.get("tampered"): b+=f'<div style="border:1.5px dashed #1B36FF;border-radius:8px;padding:8px 12px;margin:8px 0;font-family:Georgia,serif;background:#FAFBFF"><small style="display:block;font-family:JetBrains Mono,monospace;font-size:11px;letter-spacing:.14em;color:#1B36FF">TAMPERED EVIDENCE</small>{q["tampered"]}</div>'
    return f'<div class="q"><span class="tag {k}">{ {"s":"Securing","e":"Extending","m":"Mastery"}[k]}</span>{b}</div>'
sheets=[]
for f in sorted(HERE.glob("*.json")):
    d=json.loads(f.read_text())
    if not d.get("free"): continue
    if not (HERE/f"{f.stem}.pdf").exists(): continue
    d["slug"]=f.stem.split("-",1)[1]; d["file"]=f.stem; sheets.append(d)
if OUT.exists(): shutil.rmtree(OUT)
(OUT/"pdf").mkdir(parents=True)
for d in sheets:
    shutil.copy(HERE/f"{d['file']}.pdf", OUT/"pdf"/f"{d['slug']}.pdf")
    t=strip(d["title"]); canon=f"{SITE}/sheets/{d['slug']}/"
    title=f"{t} worksheet: free GCSE maths, grades 4 to 9 | Maths Forensics"
    desc=f"Free printable GCSE maths {t.lower()} worksheet with answers. Securing, Extending and Mastery sections from grade 4 to grade 9, plus exam tips on where marks are lost."
    sec=d["sections"]; nq=sum(len(sec[k]["questions"]) for k in "sem")
    samples="".join(qhtml(sec[k]["questions"][i],k) for k,i in (("s",0),("e",len(sec["e"]["questions"])-1),("m",0)))
    rel=[o for o in sheets if o["strand"]==d["strand"] and o is not d][:6]
    relh="".join(f'<a class="tile" href="/sheets/{o["slug"]}/">{E(strip(o["title"]))}<small>{E(o["strand"])}</small></a>' for o in rel)
    ld=f'<script type="application/ld+json">{json.dumps({"@context":"https://schema.org","@type":"LearningResource","name":t+" worksheet","description":desc,"educationalLevel":"GCSE","learningResourceType":"Worksheet","isAccessibleForFree":True,"inLanguage":"en-GB","url":canon,"provider":{"@type":"Organization","name":"Maths Forensics","url":"https://www.mathsforensics.com"}})}</script>'
    body=f"""<main><div class="w hero"><span class="eb">Free GCSE maths worksheet · {E(d['strand'])}</span><h1>{E(t)}</h1>
<p class="lede">{d['cover_sub']}</p>
<div class="btns"><a class="btn" href="/sheets/pdf/{d['slug']}.pdf" download>Download the free PDF</a><a class="btn ghost" href="/lab/">Practise it in the Lab</a></div>
<div class="levels">{"".join(f'<div class="lv {k}"><b>{ {"s":"Securing","e":"Extending","m":"Mastery"}[k]} · {E(d["levels"][k])}</b><span>{E(d["levels_long"][k])}</span></div>' for k in "sem")}</div></div>
<section><div class="w"><h2>What's in the case file</h2><ul class="tick">
<li>A case briefing on {E(t.lower())}, with a fully worked example</li><li>{nq} exam-style questions in three levels, with space for working and marks shown</li>
<li>Tampered evidence: find the mistake in a student's working</li><li>Forensic tips at the questions where marks usually go missing</li>
<li>Worked solutions for Securing and Extending, and a tracker to code every lost mark as Reading, Method or Accuracy</li></ul></div></section>
<section><div class="w"><h2>Three questions from the sheet</h2>{samples}</div></section>
<section><div class="w lab"><div class="card"><span class="eb">Mastery solutions</span><h2>Get your Mastery working marked</h2><p>Grades 8 and 9 are won on method. Photograph or write your working in Forensic Marking and get it marked mark by mark, with the full solution and the mistake behind every lost mark. Your first marked question is free.</p><a class="btn" href="/written/?sheet=CF-{d['code'].split('MF-CF-',1)[1]}">Mark my Mastery answers</a></div>
<div class="card"><span class="eb">The Lab</span><h2>Every GCSE topic, new numbers every time</h2><p>Practise {E(t.lower())} and every other GCSE topic online, with feedback that names the mistake behind each wrong answer.</p><a class="btn ghost" href="https://www.mathsforensics.com/the-lab">See the Lab</a></div></div></section>
{f'<section><div class="w"><h2>More {E(d["strand"].lower())} worksheets</h2><div class="grid">{relh}</div></div></section>' if relh else ''}</main>"""
    (OUT/d["slug"]).mkdir(); (OUT/d["slug"]/"index.html").write_text(page(title,desc,canon,body,ld))
groups="".join(f'<section><div class="w"><h2>{E(s)}</h2><div class="grid">'+"".join(f'<a class="tile" href="/sheets/{d["slug"]}/">{E(strip(d["title"]))}<small>{E(strip(d["cover_sub"]).split(".")[0])}.</small></a>' for d in sheets if d["strand"]==s)+'</div></div></section>' for s in ORDER if any(d["strand"]==s for d in sheets))
body=f"""<main><div class="w hero"><span class="eb">Free GCSE maths worksheets</span><h1>GCSE maths worksheets that go all the way to grade 9.</h1>
<p class="lede">Every case file has three levels: <b>Securing</b> (grades 4 to 5), <b>Extending</b> (6 to 7) and <b>Mastery</b> (8 to 9). Free to download and print, with worked solutions, exam tips and a piece of tampered evidence to crack.</p>
<div class="btns"><a class="btn" href="#Number">Find a topic</a><a class="btn ghost" href="/written/">Get your working marked</a></div></div>{groups.replace('<section><div class="w"><h2>Number','<section id="Number"><div class="w"><h2>Number',1)}</main>"""
(OUT/"index.html").write_text(page("Free GCSE maths worksheets, grades 4 to 9 | Maths Forensics","Free printable GCSE maths worksheets with answers, from grade 4 to grade 9. Every topic in three levels: Securing, Extending and Mastery, with exam tips on where marks are lost.",f"{SITE}/sheets/",body))
print(len(sheets),"sheets ->",OUT)
urls=[f"{SITE}/sheets/"]+[f"{SITE}/sheets/{d['slug']}/" for d in sheets]
(OUT/"sitemap.xml").write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+"".join(f"  <url><loc>{u}</loc></url>\n" for u in urls)+"</urlset>\n")
