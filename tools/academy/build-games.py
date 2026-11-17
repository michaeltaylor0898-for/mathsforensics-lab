"""Build site/academy/games.html (Academy class games) from site/incident-room/index.html.

Same engine, Academy mode (window.MF_MODE = "academy"): KS3 questions only, its own home page,
saved data ("ac-" keys) and live channels ("ac-" codes), and a violet / apricot colour scheme.
Run after every change to the Incident Room:  python3 tools/academy/build-games.py
"""
import re, sys, pathlib
root = pathlib.Path(__file__).resolve().parents[2]
src = root / "site/incident-room/index.html"
dst = root / "site/academy/games.html"
s = src.read_text(encoding="utf-8")

def rep(a, b, n=1):
    global s
    c = s.count(a)
    assert c == n, f"expected {n} got {c}: {a[:80]}"
    s = s.replace(a, b)

rep("<title>Incident Room</title>", "<title>Academy class games</title>")
i = s.index("<script>")
s = s[:i] + '<script>window.MF_MODE = "academy";</script>\n' + s[i:]

# colours: Incident Room navy and cyan become Academy violet and apricot
COL = [("#00FCF1", "#FFB86B"), ("#0B122C", "#160E2E"), ("#111A3B", "#21163F"), ("#172350", "#2B1D52"),
       ("#2A3870", "#3E2C72"), ("#1B36FF", "#8B5CF6"), ("#A3AED0", "#B9ABDB"), ("#E9EDFA", "#F4EFFF")]
for a, b in COL:
    s = re.sub(re.escape(a), b, s, flags=re.I)
s = re.sub(r"rgba\(0,\s*252,\s*241,", "rgba(255,184,107,", s)
s = re.sub(r"rgba\(11,\s*18,\s*44,", "rgba(22,14,46,", s)
assert 'window.MF_MODE = "academy"' in s
dst.write_text(s, encoding="utf-8")
print("wrote", dst, len(s))
