"""Builds the Systeme paste files and a clickable preview from src/.
   src/<page>.html holds sections split by <!-- BLOCK: name -->. Links are {{NAME}} tokens from LINKS."""
import re, pathlib, json, html, os
root = pathlib.Path(__file__).parent
src = root / "src"
out = root / ("out" if os.environ.get("EDITION", "launch") == "launch" else "out-soft")
out.mkdir(exist_ok=True)
CSS = (src / "style.css").read_text()
LINKS = json.loads((src / "links.json").read_text())
PAGES = [("home", "Homepage", "/"), ("academy", "Academy", "/academy"), ("gcse", "GCSE (the Lab)", "/the-lab"), ("schools", "Schools", "/schools"), ("about", "About", "/about"), ("coldcase", "Cold Case", "/cold-case")]
PHOTO = '<span>YOUR PHOTO HERE<br>{label}</span>'

def fill(s):
    s = re.sub(r"\{\{PHOTO_([A-Z_]+)\}\}", lambda m: PHOTO.format(label=LINKS.get("PHOTO_" + m.group(1), "photo")), s)
    def rep(m):
        k = m.group(1)
        if k not in LINKS: raise SystemExit("missing link " + k)
        return html.escape(LINKS[k], quote=True)
    return re.sub(r"\{\{([A-Z_]+)\}\}", rep, s)

# 11 January edition: every feature presented as live (no "from January" labels)
LAUNCH = [
    (r'\s*<span class="tag jan">(Jan|From January)</span>(?=</(h3|li)>)', ''),
    (r'<span class="tag jan">From January</span>(<h4 style="margin-top:14px">Story cases)', r'<span class="tag">Cases</span>\1'),
    (r'<span class="tag jan">From January</span>(<h4 style="margin-top:14px">Forensic Marking)', r'<span class="tag">Add-on</span>\1'),
    (r'<span class="tag jan">January</span>(<h4 style="margin-top:14px">Forensic Marking)', r'<span class="tag" style="color:var(--amber)">Show it</span>\1'),
    (r', from January', ''),
    (r'Forensic Marking · from January', 'Forensic Marking'),
    (r'Forensic Marking, from January', 'Forensic Marking'),
    (r'and from January, your handwritten working', 'and your handwritten working'),
    (r'It launches in January\. ', ''),
    (r'<span class="badge jan">JANUARY</span>', '<span class="badge">EVERYTHING</span>'),
    (r'href="\{\{FI_WAITLIST\}\}">Join the list</a>', 'href="{{FI_CHECKOUT}}">Get The Full Investigation</a>'),
]
# Soft-launch edition: features still being finished say "Coming soon" (no dates)
SOFT = [
    (r'<span class="tag jan">(From January|January)</span>', '<span class="tag jan">Coming soon</span>'),
    (r'<span class="tag jan">Jan</span>', '<span class="tag jan">Soon</span>'),
    (r'Forensic Marking, from January', 'Forensic Marking (coming soon)'),
    (r'Forensic Marking · from January', 'Forensic Marking · coming soon'),
    (r', from January', ' (coming soon)'),
    (r'and from January, your handwritten working', 'and soon, your handwritten working'),
    (r'It launches in January\. ', "It's coming soon. "),
    (r'<span class="badge jan">JANUARY</span>', '<span class="badge jan">COMING SOON</span>'),
]
EDITION = os.environ.get("EDITION", "launch")

def blocks(name):
    hd = (src / "_header.html").read_text()
    for pg in ["gcse", "academy", "schools", "about"]:
        hd = hd.replace("{{CUR_" + pg + "}}", ' aria-current="page"' if pg == name else "")
    raw = "<!-- BLOCK: 0 header -->\n" + hd + "\n" + (src / f"{name}.html").read_text() + "\n<!-- BLOCK: 99 footer -->\n" + (src / "_footer.html").read_text()
    if EDITION == "launch":
        for a, b in LAUNCH: raw = re.sub(a, b, raw)
    else:
        for a, b in SOFT: raw = re.sub(a, b, raw)
    parts = re.split(r"<!-- BLOCK: ([^>]*?) -->", raw)
    return [(parts[i].strip(), fill(parts[i + 1].strip())) for i in range(1, len(parts), 2)]

preview = []
for name, title, path in PAGES:
    if not (src / f"{name}.html").exists(): continue
    bl = blocks(name)
    d = out / name; d.mkdir(exist_ok=True)
    for f in d.glob("*.html"): f.unlink()
    for i, (bn, body) in enumerate(bl, 1):
        style = f"<style>\n{CSS}\n</style>\n" if i == 1 else ""
        (d / f"block-{i}-{re.sub(r'[^a-z0-9]+', '-', re.sub(r'^[0-9]+ *', '', bn).lower()).strip('-')}.html").write_text(
            f"<!-- Maths Forensics · {title} · block {i} of {len(bl)}{' · this block carries the styles: paste it first' if i == 1 else ''} -->\n{style}<div class=\"mf\">\n{body}\n</div>\n")
    allbody = "\n".join(b for _, b in bl)
    (d / "whole-page.html").write_text(f"<!-- Maths Forensics · {title} · whole page in one Raw HTML block -->\n<style>\n{CSS}\n</style>\n<div class=\"mf\">\n{allbody}\n</div>\n")
    preview.append((name, title, path, "".join(f'<div class="mf">\n{b}\n</div>\n' for _, b in bl)))

# preview: every page on one artifact, switched by #name; site links point at the matching preview page
url2page = {LINKS[k]: n for k, n in [("HOME", "home"), ("ACADEMY_PAGE", "academy"), ("GCSE_PAGE", "gcse"), ("SCHOOLS_PAGE", "schools"), ("ABOUT", "about"), ("COLD_CASE", "coldcase")]}
nav = "".join(f'<a href="#{n}" data-p="{n}">{t}</a>' for n, t, _, _ in preview)
pages = ""
for n, t, path, body in preview:
    for u, pn in url2page.items():
        body = body.replace(f'href="{html.escape(u, quote=True)}"', f'href="#{pn}"')
        body = body.replace(f'href="{html.escape(u, quote=True)}#paths"', 'href="#home-paths"')
        body = body.replace(f'href="{html.escape(u, quote=True)}#incident-room"', 'href="#gcse-incident-room"')
    body = body.replace(html.escape(LINKS["MEDIA"], quote=True), "media/")
    if n == "gcse": body = body.replace('id="incident-room"', 'id="gcse-incident-room"').replace('id="plans"', 'id="gcse-plans"').replace('href="#plans"', 'href="#gcse-plans"')
    body = body.replace('href="#paths"', 'href="#home-paths"').replace('id="paths"', 'id="home-paths"').replace('href="#plans"', 'href="#home-plans"').replace('id="plans"', 'id="home-plans"') if n == "home" else body
    pages += f'<main class="pg" id="pg-{n}" hidden>\n{body}</main>\n'
pv = f"""<title>Maths Forensics Site Redesign</title>
<meta name="claude:viewport-fit-sides" content="cover">
<style>
:root{{color-scheme:dark}}
body{{background:#0B122C;margin:0}}
.pnav{{position:sticky;top:env(safe-area-inset-top,0px);z-index:30;display:flex;gap:6px;flex-wrap:wrap;padding:10px max(16px,env(safe-area-inset-left,0px)) 10px max(16px,env(safe-area-inset-right,0px));background:#070C20;border-bottom:1px solid #26336A;font:600 14px/1 'Josefin Sans',system-ui,sans-serif}}
body::before{{content:"";position:fixed;inset:0 0 auto;height:env(safe-area-inset-top,0px);z-index:31;background:#070C20}}
.pnav a{{color:#9AA6CC;text-decoration:none;padding:9px 12px;border-radius:9px;border:1px solid transparent}}
.pnav a[aria-current="page"]{{color:#0B122C;background:#00FCF1}}
.pnav a:focus-visible{{outline:2px solid #00FCF1}}
.sysbar{{font:500 12px/1.4 'JetBrains Mono',monospace;letter-spacing:.06em;color:#6F7BA6;background:#070C20;padding:10px max(16px,env(safe-area-inset-left,0px)) 10px max(16px,env(safe-area-inset-right,0px));border-bottom:1px dashed #26336A}}
</style>
<style>
{CSS}
</style>
<nav class="pnav" aria-label="Pages">{nav}</nav>
{pages}
<script>
(function(){{
  var names={json.dumps([n for n, *_ in preview])};
  function show(){{
    var h=(location.hash||"").slice(1), page=h.split("-")[0], anchor=h.indexOf("-")>0?h:null;
    if(names.indexOf(page)<0){{page=names[0];anchor=null}}
    names.forEach(function(n){{document.getElementById("pg-"+n).hidden=n!==page}});
    document.querySelectorAll(".pnav a").forEach(function(a){{a.setAttribute("aria-current",a.dataset.p===page?"page":"false")}});
    var el=anchor&&document.getElementById(anchor); if(el) el.scrollIntoView(); else window.scrollTo(0,0);
  }}
  window.addEventListener("hashchange",show); show();
}})();
</script>
"""
(out / "preview.html").write_text(pv)
print("built", [p[0] for p in preview])
