// Run: deno test supabase/functions/mark-written/
import { deepStrictEqual as assertEquals, ok as assert } from "node:assert/strict";
import { SCHEMES, byId } from "./schemes.ts";
import { ERRORS } from "./errors.ts";
import { type AiMarking, applyCheck, applyRules, schemeText, MARKING_TOOL } from "./marking.ts";

const LAB_TOPICS = ["csq", "qform", "simquad", "rev", "algfrac", "recur", "fracmul", "pfd", "hcf", "sf", "simlin", "anglefacts"];

Deno.test("every scheme is consistent", () => {
  for (const s of SCHEMES) {
    assertEquals(s.points.length, s.marks, `${s.id}: one point per mark`);
    const ids = s.points.map((p) => p.id);
    assertEquals(new Set(ids).size, ids.length, `${s.id}: duplicate point ids`);
    for (const p of s.points) for (const d of p.dep ?? []) assert(ids.includes(d), `${s.id}/${p.id}: dep ${d} missing`);
    for (const e of s.errors ?? []) assert(ERRORS[e.id], `${s.id}: unknown error id ${e.id}`);
    assert(LAB_TOPICS.includes(s.topic), `${s.id}: topic ${s.topic}`);
    assert(schemeText(s).includes(s.answer));
    if (s.coach) {
      const text = s.prompt.replace(/<br>/g, " ").replace(/&nbsp;/g, " ").replace(/<[^>]+>/g, "");
      for (const k of s.coach.keyWords) assert(text.includes(k.text), `${s.id}: key words "${k.text}" not in the prompt`);
      assertEquals(s.coach.clues.length, 3);
      for (const c of s.coach.clues) assert(!c.includes(s.answer), `${s.id}: a clue gives away the answer`);
    }
  }
  assert(MARKING_TOOL.input_schema.properties.root_cause.properties.error_id.enum.includes("csq-half"));
});

const ai = (o: Partial<AiMarking>): AiMarking => ({
  status: "marked", transcription: [], answer_only: false, points: [], root_cause: { error_id: "none", line: null, explanation: "" },
  went_right: [], went_wrong: [], fix: [], verdict: "", confidence: "high", review_note: null, ...o,
});
const pt = (id: string, awarded: boolean, line: number | null, ft = false) => ({ id, awarded, line, follow_through: ft, reason: "r" });

// The Maths Genie screenshot: wrong bracket sign carried all the way through
const mikeExample = [
  "(x − 4)² − 16 − 4", "(x − 4)² − 20 = 0", "x − 4 = √20", "x = 4 ± √20", "x = 4 ± 2√5",
];

Deno.test("completing the square example scores 2/5, and a lenient A1 is removed", () => {
  const r = applyRules(byId("csq-01")!, ai({
    transcription: mikeExample,
    points: [pt("B1", false, 1), pt("M1a", true, 1, true), pt("M1b", true, 4, true), pt("A1a", false, 4), pt("A1b", true, 5)],
    root_cause: { error_id: "csq-half", line: 1, explanation: "Bracket should be (x + 4)." },
  }));
  assertEquals(r.score, 2);
  assertEquals(r.points.find((p) => p.id === "A1b")!.awarded, false);
  assert(r.points.find((p) => p.id === "A1b")!.overridden);
  assertEquals(r.points.find((p) => p.id === "M1a")!.evidence, "(x − 4)² − 16 − 4");
  assertEquals(r.points.find((p) => p.id === "M1a")!.follow_through, true);
  assertEquals(r.root_cause?.name, ERRORS["csq-half"]);
  assert(r.needs_review);
});

Deno.test("follow-through is refused where the scheme doesn't allow it", () => {
  const r = applyRules(byId("csq-01")!, ai({
    transcription: mikeExample,
    points: [pt("B1", false, 1), pt("M1a", true, 1, true), pt("M1b", true, 4, true), pt("A1a", true, 4, true), pt("A1b", false, 5)],
  }));
  assertEquals(r.score, 2);
  assertEquals(r.points.find((p) => p.id === "A1a")!.awarded, false);
});

Deno.test("full marks: no root cause, no review", () => {
  const s = byId("rev-01")!;
  const r = applyRules(s, ai({ transcription: ["68 ÷ 0.85", "= 80"], points: s.points.map((p) => pt(p.id, true, 1)) }));
  assertEquals(r.score, 3);
  assertEquals(r.root_cause, null);
  assertEquals(r.needs_review, false);
});

Deno.test("answer-only rules", () => {
  const csq = byId("csq-01")!;
  const zero = applyRules(csq, ai({ transcription: ["x = −4 ± 2√5"], answer_only: true, points: csq.points.map((p) => pt(p.id, true, 1)) }));
  assertEquals(zero.score, 0);
  const qf = byId("qform-01")!;
  const ans = applyRules(qf, ai({ transcription: ["x = 2.26, −0.59"], answer_only: true, points: qf.points.map((p) => pt(p.id, true, 1)) }));
  // Maths Forensics rule: no method seen, so no M and no A, whatever the exam board would give
  assertEquals(ans.score, 0);
  assertEquals(ans.exam_board_score, 1);
});

Deno.test("unreadable work scores nothing; bad line numbers are dropped; missing points count as not awarded", () => {
  const s = byId("simquad-01")!;
  const u = applyRules(s, ai({ status: "unreadable", points: s.points.map((p) => pt(p.id, true, 1)) }));
  assertEquals(u.score, 0);
  const r = applyRules(s, ai({ transcription: ["x² + (x + 1)² = 13"], points: [pt("M1a", true, 9)] }));
  assertEquals(r.score, 1);
  assertEquals(r.points[0].evidence, null);
  assert(r.needs_review);
});

Deno.test("an unknown root cause becomes 'other'", () => {
  const s = byId("rev-01")!;
  const r = applyRules(s, ai({ transcription: ["68 × 1.15"], points: s.points.map((p) => pt(p.id, false, 1)),
    root_cause: { error_id: "made-up", line: 1, explanation: "x" } }));
  assertEquals(r.root_cause?.error_id, "other");
});

Deno.test("a correct bare answer scores 0 under the Maths Forensics rule, with the exam-board mark alongside", () => {
  const s = byId("rev-01")!;
  const r = applyRules(s, ai({ transcription: ["£80"], answer_only: true, points: s.points.map((p) => pt(p.id, true, 1)) }));
  assertEquals(r.score, 0);
  assertEquals(r.exam_board_score, 3);
  assert(r.unprotected?.startsWith("No method seen, so 0 out of 3"));
  assertEquals(r.needs_review, false);
  assertEquals(r.root_cause?.name, "No method shown");
  // B marks are independent: a bare 0.0056 still earns its B1
  const b = byId("ccb1-q3a")!;
  const rb = applyRules(b, ai({ transcription: ["0.0056"], answer_only: true, points: [pt("B1", true, 1)] }));
  assertEquals(rb.score, 1);
  assertEquals(rb.unprotected, null);
  const shown = applyRules(s, ai({ transcription: ["68 ÷ 0.85", "= 80"], points: s.points.map((p) => pt(p.id, true, 2)) }));
  assertEquals(shown.unprotected, null);
});

Deno.test("root cause keeps a valid R/M/A category only", () => {
  const s = byId("rev-01")!;
  const r = applyRules(s, ai({ transcription: ["68 × 1.15"], points: s.points.map((p) => pt(p.id, false, 1)),
    root_cause: { error_id: "reverse-pct", category: "M", line: 1, explanation: "x" } }));
  assertEquals(r.root_cause?.category, "M");
});

Deno.test("check my working never shows the answer", () => {
  const s = byId("rev-01")!;
  const c = applyCheck(s, { status: "on_track", transcription: ["68 ÷ 0.85"], line: null, message: "Good, that gives £80." });
  assert(!c.message.includes("80"));
  const ok = applyCheck(s, { status: "problem", transcription: ["68 × 0.15"], line: 1, message: "Look at line 1: what percentage of the old price is £68?" });
  assertEquals(ok.line, 1);
});

Deno.test("an accuracy mark can't stand without a method mark, even with working", () => {
  const s = byId("ccb1-q3b")!; // M1 then A1 with no dep in the scheme
  const r = applyRules(s, ai({ transcription: ["2.4 × 10⁹"], answer_only: false, points: [pt("M1", false, 1), pt("A1", true, 1)] }));
  assertEquals(r.score, 0);
  assertEquals(r.exam_board_score, 1);
});
