// Supabase Edge Function: marks a student's handwritten working with an AI vision model.
//
//   GET                         -> the list of questions available for written marking (public parts only)
//   POST {question_id, image}   -> marks the image, saves it, returns the case report
//   POST {action:"dispute", mark_id, note} -> student flags a mark they think is wrong
//   POST {action:"purge", key}  -> deletes images older than 90 days (call daily from a scheduler)
//
// Deploy:   supabase functions deploy mark-written --no-verify-jwt   (the function checks the sign-in itself)
// Secrets:  ANTHROPIC_API_KEY=<key from console.anthropic.com>
//           PURGE_KEY=<long random string> (for the daily image clean-up, see migration 007)
//           optional: MARKING_MODEL (default claude-sonnet-5-5), FREE_DAILY (default 2), FULL_DAILY (default 25),
//                     ALLOWED_ORIGINS (comma-separated; default lab.mathsforensics.com + localhost)
// Needs migration 007 (written_marks table + written-work storage bucket).
import { createClient } from "npm:@supabase/supabase-js@2.45.4";
import { byId, publicQuestion, SCHEMES } from "./schemes.ts";
import { type AiMarking, applyRules, MARKING_TOOL, schemeText, SYSTEM_PROMPT } from "./marking.ts";

const MODEL = Deno.env.get("MARKING_MODEL") ?? "claude-sonnet-5-5";
const FREE_DAILY = Number(Deno.env.get("FREE_DAILY") ?? 2);
const FULL_DAILY = Number(Deno.env.get("FULL_DAILY") ?? 25);
const MAX_IMAGE_BYTES = 3_000_000;
const ORIGINS = (Deno.env.get("ALLOWED_ORIGINS") ?? "https://lab.mathsforensics.com,http://localhost:8000,http://127.0.0.1:8000")
  .split(",").map((s) => s.trim());

function serviceKey(): string | undefined {
  const legacy = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (legacy) return legacy;
  try {
    const keys = JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS") ?? "{}");
    const k = keys.default ?? Object.values(keys)[0];
    if (typeof k === "string") return k;
  } catch { /* not set */ }
  return Deno.env.get("SERVICE_KEY");
}
function anonKey(): string | undefined {
  const legacy = Deno.env.get("SUPABASE_ANON_KEY");
  if (legacy) return legacy;
  try {
    const keys = JSON.parse(Deno.env.get("SUPABASE_PUBLISHABLE_KEYS") ?? "{}");
    const k = keys.default ?? Object.values(keys)[0];
    if (typeof k === "string") return k;
  } catch { /* not set */ }
  return undefined;
}

Deno.serve(async (req) => {
  const origin = req.headers.get("origin") ?? "";
  const cors: Record<string, string> = {
    "Access-Control-Allow-Origin": ORIGINS.includes(origin) ? origin : ORIGINS[0],
    "Access-Control-Allow-Headers": "authorization, content-type, apikey, x-client-info",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Vary": "Origin",
  };
  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });
  const fail = (message: string, status = 400) => json({ error: message }, status);

  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  if (req.method === "GET") return json({ questions: SCHEMES.map(publicQuestion) });
  if (req.method !== "POST") return fail("Method not allowed", 405);

  // Who is asking?
  const token = (req.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
  const url = Deno.env.get("SUPABASE_URL")!;
  const key = serviceKey();
  if (!key) return fail("Server not set up: missing service key", 500);
  const db = createClient(url, key, { auth: { persistSession: false } });

  let body: any;
  try { body = await req.json(); } catch { return fail("Bad request"); }

  // Scheduled clean-up: delete images older than 90 days unless the mark is disputed (keeps the report)
  if (body.action === "purge") {
    const pk = Deno.env.get("PURGE_KEY");
    if (!pk || body.key !== pk) return fail("Forbidden", 403);
    const cutoff = new Date(Date.now() - 90 * 864e5).toISOString();
    const { data: old } = await db.from("written_marks").select("id,image_path")
      .not("image_path", "is", null).eq("disputed", false).lt("created_at", cutoff).limit(500);
    if (!old?.length) return json({ purged: 0 });
    const rm = await db.storage.from("written-work").remove(old.map((o) => o.image_path));
    if (rm.error) return fail(rm.error.message, 500);
    await db.from("written_marks").update({ image_path: null }).in("id", old.map((o) => o.id));
    return json({ purged: old.length });
  }

  const { data: who } = await db.auth.getUser(token);
  const user = who?.user;
  if (!user) return fail("Sign in to have your working marked.", 401);

  // A student disputes a mark: flag it for review
  if (body.action === "dispute") {
    const { error } = await db.from("written_marks")
      .update({ disputed: true, dispute_note: String(body.note ?? "").slice(0, 500), disputed_at: new Date().toISOString() })
      .eq("id", body.mark_id).eq("user_id", user.id);
    return error ? fail(error.message, 500) : json({ ok: true });
  }

  const scheme = byId(String(body.question_id ?? ""));
  if (!scheme) return fail("Unknown question.");
  const m = /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/.exec(String(body.image ?? ""));
  if (!m) return fail("Send the working as a JPEG, PNG or WebP image.");
  const [, mediaType, b64] = m;
  if (b64.length * 0.75 > MAX_IMAGE_BYTES) return fail("That image is too large. Try again with a smaller photo.");

  // Exam Pass holders get more marking per day than free accounts
  const userDb = createClient(url, anonKey() ?? key, { global: { headers: { Authorization: `Bearer ${token}` } }, auth: { persistSession: false } });
  const { data: access } = await userDb.rpc("my_access");
  const full = access?.level === "full";
  const limit = full ? FULL_DAILY : FREE_DAILY;
  const since = new Date(); since.setUTCHours(0, 0, 0, 0);
  const { count } = await db.from("written_marks").select("id", { count: "exact", head: true })
    .eq("user_id", user.id).gte("created_at", since.toISOString());
  if ((count ?? 0) >= limit) {
    return fail(full
      ? `You've used today's ${limit} marked answers. More tomorrow.`
      : `Free accounts get ${limit} marked answers a day. The Exam Pass gives you ${FULL_DAILY}.`, 429);
  }

  // Ask the AI to mark it
  const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
  if (!apiKey) return fail("Server not set up: missing ANTHROPIC_API_KEY", 500);
  const started = Date.now();
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "x-api-key": apiKey, "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 2000,
      system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
      tools: [MARKING_TOOL],
      tool_choice: { type: "tool", name: MARKING_TOOL.name },
      messages: [{
        role: "user",
        content: [
          { type: "image", source: { type: "base64", media_type: mediaType, data: b64 } },
          { type: "text", text: schemeText(scheme) },
        ],
      }],
    }),
  });
  if (!res.ok) {
    console.error("Marking API error", res.status, await res.text());
    return fail("The marker is busy. Try again in a minute.", 503);
  }
  const out = await res.json();
  const call = (out.content ?? []).find((c: any) => c.type === "tool_use");
  if (!call?.input) return fail("The marker couldn't read that. Try again.", 502);
  const result = applyRules(scheme, call.input as AiMarking);

  // Save the image (private bucket, own folder) and the marking
  const markId = crypto.randomUUID();
  const ext = mediaType.split("/")[1].replace("jpeg", "jpg");
  const imagePath = `${user.id}/${markId}.${ext}`;
  const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
  const up = await db.storage.from("written-work").upload(imagePath, bytes, { contentType: mediaType });
  if (up.error) console.error("Image save failed", up.error.message);

  const { error: insErr } = await db.from("written_marks").insert({
    id: markId, user_id: user.id, question_id: scheme.id, topic: scheme.topic,
    image_path: up.error ? null : imagePath,
    score: result.score, max_marks: result.max, status: result.status,
    result, needs_review: result.needs_review, model: MODEL,
    input_tokens: out.usage?.input_tokens ?? null, output_tokens: out.usage?.output_tokens ?? null,
    ms: Date.now() - started,
  });
  if (insErr) console.error("Save failed", insErr.message);

  // Feed the Lab's progress and error tracking like any other attempt
  if (result.status === "marked") {
    const r = await db.from("attempts").insert({
      user_id: user.id, topic: scheme.topic, correct: result.score === result.max,
      error_id: result.root_cause?.error_id === "other" ? null : result.root_cause?.error_id ?? null,
      source: "written", marks: result.score, max_marks: result.max, ref: `written:${scheme.id}`,
    });
    if (r.error) console.error("Attempt save failed", r.error.message);
  }

  return json({ mark_id: insErr ? null : markId, question: publicQuestion(scheme), ...result, remaining_today: limit - (count ?? 0) - 1 });
});
