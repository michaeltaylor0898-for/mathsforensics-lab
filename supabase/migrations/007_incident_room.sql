-- Migration 007: Incident Room plans, free limits and the teacher trial.
-- Run once in Supabase → SQL Editor (safe to run again).
--
-- Who gets what:
--   Students with the Lab Exam Pass or a school licence (my_access().level = 'full'): every topic in solo play, unlimited.
--   Free accounts: 2 solo games a day on the sample topics; hosting 3 live games or team showdowns a month.
--   Teacher Pro (entitlement kind 'teacher_pro'), teachers and school admins in a licensed school, and the owner: unlimited hosting.
--   Anyone can start a one-off 14-day Teacher Pro trial, which begins the first time they choose to.
-- Case records (ir_results) are created by 008_incident_room_case_records.sql (you ran this earlier as incident-room-case-records.sql).

-- 1. Allow Teacher Pro purchases in the entitlements table.
--    If an older rule on "kind" would reject 'teacher_pro', it is removed (rows are only written by the webhook and the owner page).
do $$
declare c record;
begin
  for c in select conname, pg_get_constraintdef(oid) as def from pg_constraint
           where conrelid = 'public.entitlements'::regclass and contype = 'c' and pg_get_constraintdef(oid) ilike '%kind%'
  loop
    if c.def not ilike '%teacher_pro%' then
      execute format('alter table public.entitlements drop constraint %I', c.conname);
    end if;
  end loop;
end $$;

-- 2. Usage log (for the free limits) and trials
create table if not exists public.ir_usage (
  id         bigint generated always as identity primary key,
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  kind       text not null check (kind in ('solo', 'host')),
  created_at timestamptz not null default now()
);
create index if not exists ir_usage_user_time on public.ir_usage (user_id, kind, created_at desc);
alter table public.ir_usage enable row level security;
drop policy if exists "Read own Incident Room usage" on public.ir_usage;
create policy "Read own Incident Room usage" on public.ir_usage for select to authenticated using (auth.uid() = user_id);
-- No insert policy: rows are only added through ir_claim(), which checks the limits.

create table if not exists public.ir_trials (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  started_at timestamptz not null default now()
);
alter table public.ir_trials enable row level security;
drop policy if exists "Read own Incident Room trial" on public.ir_trials;
create policy "Read own Incident Room trial" on public.ir_trials for select to authenticated using (auth.uid() = user_id);

-- 3. What the signed-in person can do in Incident Room
create or replace function public.ir_access() returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare
  p profiles; lab jsonb; pro_until timestamptz; school_ok boolean := false; trial_start timestamptz;
  solo_n int; host_n int; plan text;
begin
  select * into p from profiles where id = auth.uid();
  if p.id is null then return jsonb_build_object('signed_in', false); end if;
  begin lab := public.my_access(); exception when others then lab := '{"level":"free"}'::jsonb; end;
  if p.school_id is not null then
    select (s.expires_at is null or s.expires_at > now()) into school_ok from schools s where s.id = p.school_id;
  end if;
  select max(e.expires_at) into pro_until from entitlements e
    where lower(e.email) = lower(p.email) and e.kind = 'teacher_pro' and (e.expires_at is null or e.expires_at > now());
  select started_at into trial_start from ir_trials where user_id = p.id;
  select count(*) into solo_n from ir_usage where user_id = p.id and kind = 'solo' and created_at >= date_trunc('day', now());
  select count(*) into host_n from ir_usage where user_id = p.id and kind = 'host' and created_at >= date_trunc('month', now());
  plan := case
    when p.role = 'owner' then 'pro'
    when pro_until is not null or exists (select 1 from entitlements e where lower(e.email) = lower(p.email) and e.kind = 'teacher_pro' and e.expires_at is null) then 'pro'
    when coalesce(school_ok, false) and p.role in ('teacher', 'schooladmin') then 'school'
    when trial_start is not null and trial_start > now() - interval '14 days' then 'trial'
    else 'free' end;
  return jsonb_build_object(
    'signed_in', true, 'role', p.role, 'name', p.name,
    'lab_level', coalesce(lab->>'level', 'free'), 'lab_source', lab->>'source',
    'host_plan', plan, 'pro_until', pro_until,
    'trial_used', trial_start is not null, 'trial_ends', trial_start + interval '14 days',
    'solo_today', solo_n, 'solo_limit', 2, 'hosts_month', host_n, 'host_limit', 3);
end $$;
grant execute on function public.ir_access() to anon, authenticated;

-- 4. Start a game: checks the limits and logs it
create or replace function public.ir_claim(p_kind text) returns jsonb
language plpgsql security definer set search_path = public as $$
declare acc jsonb := public.ir_access(); unlimited boolean;
begin
  if not coalesce((acc->>'signed_in')::boolean, false) then return jsonb_build_object('ok', false, 'reason', 'sign_in'); end if;
  if p_kind = 'solo' then
    unlimited := acc->>'lab_level' = 'full' or acc->>'host_plan' in ('pro', 'school', 'trial');
    if not unlimited and (acc->>'solo_today')::int >= (acc->>'solo_limit')::int then
      return jsonb_build_object('ok', false, 'reason', 'solo_limit', 'access', acc);
    end if;
  elsif p_kind = 'host' then
    unlimited := acc->>'host_plan' in ('pro', 'school', 'trial');
    if not unlimited and (acc->>'hosts_month')::int >= (acc->>'host_limit')::int then
      return jsonb_build_object('ok', false, 'reason', 'host_limit', 'access', acc);
    end if;
  else
    raise exception 'Unknown game kind';
  end if;
  insert into ir_usage (user_id, kind) values (auth.uid(), p_kind);
  return jsonb_build_object('ok', true, 'access', public.ir_access());
end $$;
grant execute on function public.ir_claim(text) to authenticated;

-- 5. Start the one-off 14-day Teacher Pro trial
create or replace function public.ir_start_trial() returns jsonb
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'Sign in first.'; end if;
  insert into ir_trials (user_id) values (auth.uid()) on conflict (user_id) do nothing;
  return public.ir_access();
end $$;
grant execute on function public.ir_start_trial() to authenticated;
