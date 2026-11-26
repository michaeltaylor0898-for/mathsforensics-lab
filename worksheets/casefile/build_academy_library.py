"""Builds the Academy revision library: lab.mathsforensics.com/sheets/academy/ (Years 7, 8 and 9).
Reads academy/library.json and the built sheets (academy/<id>.json + .pdf). Copies the PDFs to site/sheets/pdf/.
Run after build_pages.py, which rebuilds site/sheets/ from scratch."""
import json, pathlib, shutil, re, html
HERE = pathlib.Path(__file__).parent
ns = {"__file__": str(HERE / "build_pages.py")}
exec((HERE / "build_pages.py").read_text().split("def qhtml")[0], ns)  # CSS, page(), SITE, OUT from the GCSE sheet pages
E, page, OUT, SITE = html.escape, ns["page"], ns["OUT"], ns["SITE"]
strip = lambda s: re.sub(r"<[^>]+>", "", s)
LIB = json.loads((HERE / "academy" / "library.json").read_text())
(OUT / "pdf").mkdir(parents=True, exist_ok=True)

def sheet(sid):
    d = json.loads((HERE / "academy" / f"{sid}.json").read_text())
    shutil.copy(HERE / "academy" / f"{sid}.pdf", OUT / "pdf" / f"{sid}.pdf")
    return d

EXTRA = """
.years{display:flex;gap:8px;flex-wrap:wrap;margin-top:22px}.years a{border:1.5px solid var(--line);border-radius:999px;padding:9px 18px;color:#fff;text-decoration:none;font-weight:700}
.years a:hover{border-color:var(--cyan)}
.tile.soonu{border-style:dashed;color:var(--muted)}.tile.soonu b{color:#C6CEE8}
.tile .dl{display:inline-block;margin-top:10px;color:var(--cyan);font-weight:700;font-size:15px}
.pack{display:flex;justify-content:space-between;gap:16px;align-items:center;background:linear-gradient(135deg,#132158,#0E1640);border:1px solid var(--cyan);border-radius:14px;padding:18px 20px;margin-bottom:14px}
.pack p{margin:4px 0 0;color:#C6CEE8;font-size:16px}
.soon{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}.soon span{border:1px dashed var(--line);border-radius:999px;padding:5px 12px;color:var(--muted);font-size:14.5px}
.how{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.how div{background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:14px 16px;font-size:16px;color:#C6CEE8}
.how b{display:block;color:#fff;margin-bottom:4px}
@media(max-width:860px){.how{grid-template-columns:1fr 1fr}.pack{flex-direction:column;align-items:flex-start}}
@media(max-width:520px){.how{grid-template-columns:1fr}}
"""
secs = ""
for y in ("7", "8", "9"):
    yd = LIB["years"][y]
    tiles = ""
    def tile(sid, unit=""):
        d = sheet(sid)
        return (f'<a class="tile" href="/sheets/pdf/{sid}.pdf" download>{unit}<b>{E(strip(d["title"]))}</b>'
                f'<small>{E(strip(d["cover_sub"]).split(".")[0])}.</small><span class="dl">Download PDF ↓</span></a>')
    if yd.get("units"):
        for num, name, sids in yd["units"]:
            u = f'<span class="eb" style="font-size:11px">Unit {num} · {E(name)}</span><br>'
            tiles += "".join(tile(sid, u) for sid in sids) if sids else f'<div class="tile soonu">{u}<b>{E(name)}</b><small>Coming soon</small></div>'
    for sid in yd.get("sheets", []):
        tiles += tile(sid)
    for pk in LIB["packs"]:
        if pk["year"] == y: shutil.copy(HERE / "academy" / f'{pk["id"]}.pdf', OUT / "pdf" / f'{pk["id"]}.pdf')
    packs = "".join(f'<div class="pack"><div><span class="eb">Whole pack</span><h3 style="margin:4px 0 0;font-size:20px">{E(p["title"])}</h3><p>{E(p["text"])}</p></div>'
                    f'<a class="btn" href="/sheets/pdf/{p["id"]}.pdf" download>Download the pack</a></div>' for p in LIB["packs"] if p["year"] == y)
    soon = "" if yd.get("units") else ('<p style="color:var(--muted);margin:14px 0 0;font-size:16px">' + ("Coming next:" if tiles else "The first Year " + y + " sheets are on the way:") +
            '</p><div class="soon">' + "".join(f"<span>{E(t)}</span>" for t in yd["planned"][:8]) + "</div>") if yd.get("planned") else ""
    secs += (f'<section id="year-{y}"><div class="w"><h2>Year {y}</h2><p style="color:#C6CEE8;margin:-4px 0 16px">{E(yd["blurb"])}</p>'
             f'{packs}{f"<div class=grid>{tiles}</div>" if tiles else ""}{soon}</div></section>')

body = f"""<main><div class="w hero"><span class="eb">Maths Forensics Academy · Free revision sheets</span><h1>Free KS3 maths revision sheets for Years 7, 8 and 9.</h1>
<p class="lede">Printable worksheets written for parents helping at home. Every sheet has worked examples to learn from, three levels of practice (<b>Developing</b>, <b>Securing</b> and <b>Extending</b>) and a full answer key with the mistakes to look out for. New sheets are added regularly.</p>
<div class="years"><a href="#year-7">Year 7</a><a href="#year-8">Year 8</a><a href="#year-9">Year 9</a><a href="/sheets/">GCSE sheets</a></div></div>
<section><div class="w"><h2>How to use a sheet</h2><div class="how">
<div><b>1. Learn it together</b>Read the first page and talk through the worked examples.</div>
<div><b>2. Start at Developing</b>Let your child work on their own. Most of a level right? Move up.</div>
<div><b>3. Check the answers</b>The answer key is at the back, with the common mistakes.</div>
<div><b>4. Ask how, not just what</b>Get them to explain their working: that's where the learning shows.</div></div></div></section>
{secs}
<section><div class="w lab"><div class="card"><span class="eb">The Academy</span><h2>Want them to keep going?</h2><p>The Maths Forensics Academy has step-by-step lessons for Years 7 to 9, answers checked as your child goes, story cases and maths games, and a weekly view of their progress for you.</p><a class="btn" href="https://www.mathsforensics.com/academy">See the Academy</a></div>
<div class="card"><span class="eb">Free trial</span><h2>Try the Academy free</h2><p>Start a free trial and we'll send this library's newest pack to your inbox, with short tips on helping your child with maths.</p><a class="btn ghost" href="https://www.mathsforensics.com/academy-free-trial">Start the free trial</a></div></div></section></main>"""
title = "Free KS3 maths worksheets for Years 7, 8 and 9 with answers | Maths Forensics Academy"
desc = "Free printable KS3 maths revision worksheets for Years 7, 8 and 9, written for parents helping at home. Worked examples, three levels of practice and full answers."
ld = '<script type="application/ld+json">' + json.dumps({"@context": "https://schema.org", "@type": "CollectionPage", "name": "Maths Forensics Academy revision sheets", "description": desc, "url": f"{SITE}/sheets/academy/", "isAccessibleForFree": True, "inLanguage": "en-GB", "educationalLevel": "Key Stage 3"}) + "</script>"
out = page(title, desc, f"{SITE}/sheets/academy/", body, ld).replace("</style>", EXTRA + "</style>", 1)
out = out.replace("Free GCSE maths worksheets, Securing to Mastery", "Free KS3 maths revision sheets, Years 7 to 9")
out = out.replace('href="/sheets/" class="cur">Worksheets', 'href="/sheets/">Worksheets').replace('href="https://www.mathsforensics.com/academy">Years 7–9</a><a href="https://www.mathsforensics.com/jumpstart', 'href="https://www.mathsforensics.com/academy" class="cur">Years 7–9</a><a href="https://www.mathsforensics.com/jumpstart', 1)
(OUT / "academy").mkdir(exist_ok=True)
(OUT / "academy" / "index.html").write_text(out)
sm = OUT / "sitemap.xml"
if sm.exists() and "/sheets/academy/" not in sm.read_text():
    sm.write_text(sm.read_text().replace("</urlset>", f"  <url><loc>{SITE}/sheets/academy/</loc></url>\n</urlset>"))
print("library ->", OUT / "academy")
