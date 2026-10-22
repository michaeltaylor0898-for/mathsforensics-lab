# Maths Forensics Lab

Live site: https://lab.mathsforensics.com

- `site/` – the files served from the `lab.mathsforensics.com` folder in cPanel (upload the contents, keeping the folder structure).
  - `site/incident-room/` – Incident Room, the game layer. Built from `incident-room-src/`.
  - `site/join/` – short join link for live games (redirects to Incident Room).
- `supabase/migrations/` – SQL to run once in Supabase → SQL Editor, in number order.
- `supabase/functions/systeme-webhook/` – Edge Function that records Systeme.io purchases.

No secret keys belong in this repository. The publishable Supabase key in the pages is meant to be public; the service key lives only in Supabase Edge Function secrets.

## Incident Room plans (migration 007)

| Who | Solo play | Hosting live games / team showdowns |
| --- | --- | --- |
| Guest (not signed in) | 2 games a day, 12 sample topics | Must sign in |
| Free Lab account | 2 games a day, 12 sample topics | 3 a month, then a one-off 30-day Teacher Pro trial |
| Exam Pass or school-licence student | Unlimited, all 76 topics | 3 a month (free) |
| Teacher Pro (`entitlements.kind = 'teacher_pro'`) | Unlimited | Unlimited |
| Teacher or school admin in a licensed school | Unlimited | Unlimited |

Until migration 007 is run, Incident Room locks nothing.

Teacher Pro checkout link and prices: edit `IR_CONFIG` near the top of `site/incident-room/index.html` (or `incident-room-src/build.py` and rebuild).
