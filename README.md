# Maths Forensics Lab

Live site: https://lab.mathsforensics.com

- `site/` – the files served from the `lab.mathsforensics.com` folder in cPanel (upload the contents, keeping the folder structure).
  - `site/incident-room/` – Incident Room, the game layer. Built from `incident-room-src/`.
  - `site/join/` – short join link for live games (redirects to Incident Room).
- `supabase/migrations/` – SQL to run once in Supabase → SQL Editor, in number order.
- `supabase/functions/systeme-webhook/` – Edge Function that records Systeme.io purchases.

No secret keys belong in this repository. The publishable Supabase key in the pages is meant to be public; the service key lives only in Supabase Edge Function secrets.
