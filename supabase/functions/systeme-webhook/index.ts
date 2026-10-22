// Supabase Edge Function: receives Systeme.io "sale completed" webhooks and records an Exam Pass or a Teacher Pro plan.
// When the buyer signs in (or signs up) with the same email, my_access() returns full access.
//
// Deploy:   supabase functions deploy systeme-webhook --no-verify-jwt
// Secrets:  WEBHOOK_KEY=<long random string>  EXAM_PASS_PLANS=<comma-separated product / price plan names that unlock the Lab>
//           TEACHER_PRO_PLANS=<comma-separated product / price plan names for Incident Room Teacher Pro> (optional)
// Systeme.io → Automations → workflow "Sale completed" → Send webhook to:
//           https://<project-ref>.supabase.co/functions/v1/systeme-webhook?key=<WEBHOOK_KEY>
//
// Before going live, send one test purchase to a request inspector (Pipedream/RequestBin) and check the
// field paths below against the real payload. Systeme.io documents the event as customer.sale.completed.
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

// Works with both the legacy service_role key and the newer sb_secret_ keys
function serviceKey(): string | undefined {
  const legacy = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (legacy) return legacy;
  try {
    const keys = JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS") ?? "{}");
    const k = keys.default ?? Object.values(keys)[0];
    if (typeof k === "string") return k;
  } catch { /* not set */ }
  return Deno.env.get("SERVICE_KEY"); // manual fallback: add a secret called SERVICE_KEY
}

const SYSTEME_IPS = ["185.236.142.1", "185.236.142.2", "185.236.142.3"];

function passExpiry(from = new Date()): string {
  const y = from.getUTCMonth() >= 6 ? from.getUTCFullYear() + 1 : from.getUTCFullYear();
  return new Date(Date.UTC(y, 5, 30, 20, 0)).toISOString(); // 30 June of the exam season (20:00 UTC, still 30 June in the UK and Spain)
}
const get = (o: any, ...paths: string[]) => {
  for (const p of paths) {
    const v = p.split(".").reduce((x, k) => (x == null ? x : x[k]), o);
    if (v != null && v !== "") return v;
  }
  return null;
};

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });
  const url = new URL(req.url);
  if (url.searchParams.get("key") !== Deno.env.get("WEBHOOK_KEY")) return new Response("Forbidden", { status: 403 });
  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim();
  if (Deno.env.get("CHECK_IP") === "1" && !SYSTEME_IPS.includes(ip)) return new Response("Forbidden", { status: 403 });

  let body: any;
  try { body = await req.json(); } catch { return new Response("Bad JSON", { status: 400 }); }
  const data = body.data ?? body;
  const type = get(body, "type", "event_type");
  if (type && !String(type).includes("sale")) return new Response("Ignored", { status: 200 });

  const email = get(data, "customer.email", "contact.email", "email");
  const orderRef = String(get(data, "order.id", "order_item.id", "id") ?? crypto.randomUUID());
  if (!email) return new Response("No customer email in payload", { status: 422 });
  // Systeme.io sends EVERY sale here, so only unlock the Lab for the products listed in EXAM_PASS_PLANS
  // (comma-separated price plan or product names, e.g. "Maths Forensics Lab Exam Pass, Mark Recovery System").
  // If it isn't set, nothing is unlocked: safer than giving the Lab to every buyer of every product.
  const list = (name: string) => (Deno.env.get(name) ?? "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
  const passPlans = list("EXAM_PASS_PLANS").length ? list("EXAM_PASS_PLANS") : list("EXAM_PASS_PLAN");
  const teacherPlans = list("TEACHER_PRO_PLANS");
  if (!passPlans.length && !teacherPlans.length) return new Response("EXAM_PASS_PLANS secret not set: sale ignored", { status: 200 });
  const text = JSON.stringify(data).toLowerCase();
  // Teacher Pro is checked first, so a plan name like "Teacher Pro" can't be mistaken for an Exam Pass
  const kind = teacherPlans.some((w) => text.includes(w)) ? "teacher_pro" : passPlans.some((w) => text.includes(w)) ? "exam_pass" : null;
  if (!kind) return new Response("Not a Lab sale", { status: 200 });

  const key = serviceKey();
  if (!key) return new Response("No server key: add an Edge Function secret called SERVICE_KEY", { status: 500 });
  const db = createClient(Deno.env.get("SUPABASE_URL")!, key);
  const expires = kind === "teacher_pro" ? new Date(Date.now() + 368 * 864e5).toISOString() : passExpiry(); // Teacher Pro: one year plus a few days' grace
  const { error } = await db.from("entitlements").upsert(
    { email: String(email).toLowerCase(), kind, expires_at: expires, source: "systeme.io", order_ref: `SIO-${orderRef}`, payload: body },
    { onConflict: "order_ref" },
  );
  if (error) return new Response("Database error: " + error.message, { status: 500 }); // Systeme.io will retry
  return new Response("OK", { status: 200 });
});
