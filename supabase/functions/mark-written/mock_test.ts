import { deepStrictEqual as assertEquals } from "node:assert/strict";
import { cleanPage, mergeItems, mockReport, qKey } from "./mock.ts";

Deno.test("question keys match across spellings", () => {
  assertEquals(qKey("Q12(a)(ii)"), "12aii");
  assertEquals(qKey("12 a ii"), "12aii");
});

Deno.test("causes are scaled to the teacher's mark", () => {
  const p = cleanPage({ readable: true, marked: true, items: [
    { q: "3", topic: "pct", available: 4, awarded: 1, lost: [{ cause: "R", n: 1 }, { cause: "A", n: 5 }], note: "x" },
    { q: "4", topic: "nope", available: 2, awarded: 0, lost: [], note: "" },
    { q: "5", topic: "pct", available: 3, awarded: 3, lost: [{ cause: "A", n: 1 }], note: "" },
    { q: "6", topic: "pct", available: 2, awarded: 0, lost: [{ cause: "A", n: 1 }], note: "" },
  ] }, 1);
  assertEquals(p.items[0].lost, [{ cause: "R", n: 1 }, { cause: "A", n: 2 }]);
  assertEquals(p.items[1].topic, "other");
  assertEquals(p.items[1].lost, [{ cause: "K", n: 2 }]);
  assertEquals(p.items[2].lost, []);
  assertEquals(p.items[3].lost, [{ cause: "A", n: 2 }]);
});

Deno.test("merging keeps the reading with the teacher's mark, and the report adds up", () => {
  const a = cleanPage({ items: [{ q: "7b", topic: "pct", available: 3, awarded: null, lost: [], note: "working only" }] }, 1).items;
  const b = cleanPage({ items: [
    { q: "7(b)", topic: "pct", available: 3, awarded: 1, lost: [{ cause: "M", n: 2 }], note: "no working" },
    { q: "8", topic: "negnum", available: 2, awarded: 0, lost: [{ cause: "N", n: 2 }], note: "blank" },
    { q: "1", topic: "negnum", available: 2, awarded: 2, lost: [], note: "" },
  ] }, 2).items;
  const items = mergeItems([a, b]);
  assertEquals(items.map((i) => i.q), ["1", "7(b)", "8"]);
  const r = mockReport(items, null);
  assertEquals([r.score, r.max, r.recoverable, r.lost.M, r.lost.N], [3, 7, 2, 2, 2]);
  assertEquals(r.recoverable_pct, 71);
  assertEquals(r.plan[0].title.startsWith("Fix the method habit"), true);
});
