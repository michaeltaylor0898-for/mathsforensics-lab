"""Builds site/incident-room/index.html from the files in this folder.  Run:  python3 incident-room-src/build.py"""
import os
D = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(D)
rd = lambda name: open(os.path.join(D, name), encoding="utf-8").read()
chars = rd("characters.js").replace('class="a-scan" d="M39 56h9"', 'class="a-scan2" d="M39 56h9"')
js = "\n".join([rd("core.js"), rd("questions.js"), rd("bank-nr.js"), rd("bank-a.js"), rd("bank-g.js"), rd("bank-ps.js"),
                "const QUESTIONS = BANK;\nQUESTIONS.forEach((q, k) => { q.n = k; });", chars, rd("sound.js"), rd("stakeout-core.js"), rd("stakeout.js"), rd("identikit-pics.js"), rd("identikit.js"), rd("games.js"), rd("app.js")])
html = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex">
<title>Incident Room</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@400;600;700&family=JetBrains+Mono:wght@500;700&display=swap">
<style>
{rd("style.css")}
</style>
<script>
/* Settings. The Supabase key is the publishable one (safe in a web page); never put the secret key here. */
window.IR_CONFIG = {{
  url: "https://duvxykqlrekqhfvsvnrj.supabase.co",
  key: "sb_publishable_llHxDDCcByPpdbi5G2Hqtg_DqGcnuHn",
  labUrl: "https://lab.mathsforensics.com/",
  examPassUrl: "https://www.mathsforensics.com/mathsforensics-lab-checkout",
  teacherProUrl: "https://www.mathsforensics.com/incident-room-teacherpro-checkout",
  prices: {{ pass: "£49", passLater: "£59", teacherPro: "£49 a year" }},
  supportEmail: "support@mathsforensics.com"
}};
</script>
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.57.4/dist/umd/supabase.js"></script>
</head>
<body>
<main id="app" aria-live="polite"></main>
<script>
(() => {{
"use strict";
{js}
}})();
</script>
</body>
</html>
"""
out = os.path.join(ROOT, "site", "incident-room", "index.html")
open(out, "w", encoding="utf-8").write(html)
open(os.path.join(ROOT, "incident-room-src", ".check.js"), "w").write('(() => {\n"use strict";\n' + js + "\n})();")
print("built", out, len(html), "bytes")
