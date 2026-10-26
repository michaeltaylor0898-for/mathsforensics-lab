# Maths Forensics Lab

Live site: https://lab.mathsforensics.com

- `site/` – the files served from the `lab.mathsforensics.com` folder in cPanel (upload the contents, keeping the folder structure).
  - `site/incident-room/` – Incident Room, the game layer. Built from `incident-room-src/`.
  - `site/join/` – short join link for live games (redirects to Incident Room).
- `supabase/migrations/` – SQL to run once in Supabase → SQL Editor, in number order.
- `supabase/functions/systeme-webhook/` – Edge Function that records Systeme.io purchases.
- `supabase/functions/mark-written/` – Edge Function that AI-marks handwritten working (prototype). Mark schemes live in `schemes.ts`.
- `site/written/` – prototype page for written answers (canvas or photo). Not linked from the Lab yet.
- `eval/` – checks the AI marker against your own marks before students use it.

## Written answers (prototype)

1. Run `supabase/migrations/007_written_marking.sql` in the SQL Editor.
2. Add secrets: `ANTHROPIC_API_KEY`, and `PURGE_KEY` (any long random string).
3. Deploy: `supabase functions deploy mark-written --no-verify-jwt`
4. Upload `site/written/` to the `lab.mathsforensics.com` folder, so it's at lab.mathsforensics.com/written/.
5. Optional daily image clean-up (deletes images over 90 days old, keeps the marks): schedule a POST to the function with `{"action":"purge","key":"<PURGE_KEY>"}`.

Test the scoring rules: `deno test supabase/functions/mark-written/`
Check the AI against your marking: see the top of `eval/run-eval.ts`.

No secret keys belong in this repository. The publishable Supabase key in the pages is meant to be public; the service key lives only in Supabase Edge Function secrets.
