// Checks the AI marker against your own marking, before any student relies on it.
//
// 1. Put photos or screenshots of real answers in eval/samples/ (one question per image).
// 2. List them in eval/marks.csv with YOUR marks, one row per image:
//      file,question_id,your_marks
//      jo-csq.jpg,csq-01,B0 M1 M1 A0 A0
//      sam-rev.png,rev-01,M1 M1 A1
//    your_marks lists every mark point in scheme order, 1 = awarded, 0 = not (B0, M1, A1...).
// 3. Run:  ANTHROPIC_API_KEY=... deno run -A eval/run-eval.ts
//
// It marks every image exactly as the live function would (same prompt, same rules) and reports
// how often the AI agrees with you, then lists every disagreement so you can fix the mark scheme
// wording. eval/samples/ is git-ignored: students' work never goes into the repository.
import { byId } from "../supabase/functions/mark-written/schemes.ts";
import { type AiMarking, applyRules, MARKING_TOOL, schemeText, SYSTEM_PROMPT } from "../supabase/functions/mark-written/marking.ts";

const MODEL = Deno.env.get("MARKING_MODEL") ?? "claude-sonnet-5-5";
const key = Deno.env.get("ANTHROPIC_API_KEY");
if (!key) throw new Error("Set ANTHROPIC_API_KEY");
const dir = new URL(".", import.meta.url).pathname;
const rows = (await Deno.readTextFile(dir + "marks.csv")).trim().split(/\r?\n/).slice(1).map((l) => l.split(",").map((x) => x.trim()));

const types: Record<string, string> = { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp" };
let exact = 0, within1 = 0, pointsAgree = 0, pointsTotal = 0, n = 0, inTok = 0, outTok = 0;
const disagreements: string[] = [];

for (const [file, qid, yours] of rows) {
  const s = byId(qid);
  if (!s) { console.log(`skip ${file}: unknown question ${qid}`); continue; }
  const mine = yours.split(/\s+/).map((m) => m.endsWith("1"));
  if (mine.length !== s.points.length) { console.log(`skip ${file}: ${s.points.length} marks expected, got ${mine.length}`); continue; }
  const bytes = await Deno.readFile(dir + "samples/" + file);
  let b64 = ""; for (let i = 0; i < bytes.length; i += 0x8000) b64 += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify({
      model: MODEL, max_tokens: 2000,
      system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
      tools: [MARKING_TOOL], tool_choice: { type: "tool", name: MARKING_TOOL.name },
      messages: [{ role: "user", content: [
        { type: "image", source: { type: "base64", media_type: types[file.split(".").pop()!.toLowerCase()], data: btoa(b64) } },
        { type: "text", text: schemeText(s) },
      ] }],
    }),
  });
  if (!res.ok) { console.log(`${file}: API error ${res.status} ${await res.text()}`); continue; }
  const out = await res.json();
  inTok += out.usage?.input_tokens ?? 0; outTok += out.usage?.output_tokens ?? 0;
  const r = applyRules(s, out.content.find((c: any) => c.type === "tool_use").input as AiMarking);
  const yourScore = mine.filter(Boolean).length;
  n++; if (r.score === yourScore) exact++; if (Math.abs(r.score - yourScore) <= 1) within1++;
  r.points.forEach((p, i) => {
    pointsTotal++;
    if (p.awarded === mine[i]) pointsAgree++;
    else disagreements.push(`${file} ${p.id}: you ${mine[i] ? "gave" : "didn't give"} it, AI ${p.awarded ? "gave" : "didn't"}. AI: "${p.overridden ?? p.reason}"${p.evidence ? ` (line ${p.line}: ${p.evidence})` : ""}`);
  });
  console.log(`${file.padEnd(28)} you ${yourScore}/${s.marks}  AI ${r.score}/${s.marks}${r.needs_review ? "  (flagged for review)" : ""}`);
}

const pct = (a: number, b: number) => b ? `${Math.round((100 * a) / b)}%` : "-";
console.log(`\n${n} answers marked`);
console.log(`Same total as you:     ${pct(exact, n)}`);
console.log(`Within one mark:       ${pct(within1, n)}`);
console.log(`Mark points agreeing:  ${pct(pointsAgree, pointsTotal)}`);
console.log(`Tokens: ${inTok} in, ${outTok} out (about ${Math.round((inTok + outTok) / Math.max(n, 1))} per answer)`);
if (disagreements.length) console.log("\nDisagreements\n" + disagreements.join("\n"));
