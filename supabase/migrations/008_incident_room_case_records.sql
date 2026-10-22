-- Incident Room: case records for signed-in students
-- Run once in Supabase: SQL Editor > New query > paste all of this > Run.
-- Each student can only read and add their own results (row-level security).

create table if not exists public.ir_results (
  id          bigint generated always as identity primary key,
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  played_at   timestamptz not null default now(),
  mode        text not null check (mode in ('solo', 'live')),
  questions   integer not null check (questions >= 0),
  correct     integer not null check (correct >= 0),
  score       integer not null default 0,
  best_streak integer not null default 0,
  rank_title  text,
  topics      jsonb not null default '{}'::jsonb,
  missed      jsonb not null default '[]'::jsonb
);

create index if not exists ir_results_user_played on public.ir_results (user_id, played_at desc);

alter table public.ir_results enable row level security;

drop policy if exists "Students read their own results" on public.ir_results;
create policy "Students read their own results"
  on public.ir_results for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Students add their own results" on public.ir_results;
create policy "Students add their own results"
  on public.ir_results for insert
  to authenticated
  with check (auth.uid() = user_id);

grant select, insert on public.ir_results to authenticated;
