-- Migration 007: Maths Forensics Academy accounts (KS3).
--
-- One platform, two doors. The Lab keeps working exactly as before. This adds:
--   * a 'parent' role, for home Academy accounts (a child under 13 can't consent for themselves)
--   * learners: a student profile that either has its own login (Lab students, school accounts)
--     or belongs to a parent (home Academy children: first name and year group only, no email)
--   * academy_progress and academy_awards, kept apart from the Lab's attempts
--   * classes.key_stage plus lab_on / academy_on, so a teacher can open either door for a class
--   * the 'academy_pass' entitlement kind: one pass = one child, 12 months
--   * my_access() now ignores Academy Passes and treats parents like students, so an Academy Pass
--     never unlocks the Lab and a parent account never gets staff access
--
-- Run once in Supabase → SQL Editor. Safe to run again.

create extension if not exists pgcrypto with schema extensions;

/* ---------- 1. parent role ---------- */
do $$
declare c record;
begin
  for c in select conname from pg_constraint
           where conrelid = 'public.profiles'::regclass and contype = 'c' and pg_get_constraintdef(oid) ilike '%role%'
  loop execute format('alter table public.profiles drop constraint %I', c.conname); end loop;
end $$;
alter table public.profiles add constraint profiles_role_check
  check (role in ('student', 'teacher', 'schooladmin', 'owner', 'parent'));

/* ---------- 2. classes: key stage and doors ---------- */
alter table public.classes add column if not exists key_stage text not null default 'ks4';
alter table public.classes add column if not exists lab_on boolean not null default true;
alter table public.classes add column if not exists academy_on boolean not null default false;
do $$ begin
  alter table public.classes add constraint classes_key_stage_check check (key_stage in ('ks3', 'ks4', 'ks5'));
exception when duplicate_object then null; end $$;

/* ---------- 3. learners ---------- */
create table if not exists public.learners (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references public.profiles(id) on delete cascade,     -- signs in themselves
  parent_id uuid references public.profiles(id) on delete cascade,          -- home child, owned by a parent
  first_name text not null check (char_length(btrim(first_name)) between 1 and 20),
  year_group smallint check (year_group between 7 and 13),
  pin_hash text,                                                            -- optional 4-digit PIN on a shared device
  created_at timestamptz not null default now(),
  constraint learners_one_owner check ((user_id is null) <> (parent_id is null))
);
create index if not exists learners_parent_idx on public.learners (parent_id);

/* ---------- 4. progress and awards ---------- */
create table if not exists public.academy_progress (
  learner_id uuid not null references public.learners(id) on delete cascade,
  topic text not null check (topic ~ '^[a-z0-9-]{2,40}$'),
  learned boolean not null default false,
  practised integer not null default 0 check (practised between 0 and 100000),
  streak integer not null default 0 check (streak between 0 and 10000),
  secured boolean not null default false,
  best smallint not null default 0 check (best between 0 and 5),
  checks integer not null default 0 check (checks between 0 and 100000),
  secured_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (learner_id, topic)
);

create table if not exists public.academy_awards (
  id uuid primary key default gen_random_uuid(),
  learner_id uuid not null references public.learners(id) on delete cascade,
  tier text not null check (tier in ('bronze', 'silver', 'gold', 'platinum')),
  score integer not null,
  max integer not null check (max between 1 and 100),
  passed boolean generated always as (score * 5 >= max * 4) stored,          -- 80% to pass
  cert_code text not null unique default upper(substr(md5(gen_random_uuid()::text), 1, 8)),
  created_at timestamptz not null default now(),
  check (score between 0 and max)
);
create index if not exists academy_awards_learner_idx on public.academy_awards (learner_id);

/* ---------- 5. who can see a learner ---------- */
create or replace function public.acts_for(p_learner uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from learners where id = p_learner and (user_id = auth.uid() or parent_id = auth.uid()))
$$;

-- Teachers see learners in their classes; school admins see learners in their school.
-- Only learners with their own login can be in a class (home children never are).
create or replace function public.teaches_learner(p_learner uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from learners l join profiles sp on sp.id = l.user_id
    where l.id = p_learner
      and (teaches(l.user_id) or (my_role() = 'schooladmin' and sp.school_id is not null and sp.school_id = my_school())))
$$;

alter table public.learners enable row level security;
alter table public.academy_progress enable row level security;
alter table public.academy_awards enable row level security;

drop policy if exists "read own, my children, my students" on public.learners;
create policy "read own, my children, my students" on public.learners for select
  using (user_id = auth.uid() or parent_id = auth.uid() or teaches_learner(id) or is_owner());
-- learners are created and changed only through the academy_* functions below

drop policy if exists "read progress" on public.academy_progress;
create policy "read progress" on public.academy_progress for select
  using (acts_for(learner_id) or teaches_learner(learner_id) or is_owner());
drop policy if exists "write own progress" on public.academy_progress;
create policy "write own progress" on public.academy_progress for insert with check (acts_for(learner_id));
drop policy if exists "change own progress" on public.academy_progress;
create policy "change own progress" on public.academy_progress for update using (acts_for(learner_id)) with check (acts_for(learner_id));
drop policy if exists "clear own progress" on public.academy_progress;
create policy "clear own progress" on public.academy_progress for delete using (acts_for(learner_id));

drop policy if exists "read awards" on public.academy_awards;
create policy "read awards" on public.academy_awards for select
  using (acts_for(learner_id) or teaches_learner(learner_id) or is_owner());
drop policy if exists "add own awards" on public.academy_awards;
create policy "add own awards" on public.academy_awards for insert with check (acts_for(learner_id));

/* ---------- 6. the Lab ignores Academy Passes, and parents are not staff ---------- */
create or replace function public.my_access() returns jsonb
language sql stable security definer set search_path = public as $$
  select case
    when p.role in ('teacher', 'schooladmin', 'owner') then jsonb_build_object('level','full','source','staff')
    when s.id is not null and s.expires_at > now() and exists (select 1 from class_members where user_id = p.id)
      then jsonb_build_object('level','full','source','school','school',s.name,'expires_at',s.expires_at)
    when e.id is not null then jsonb_build_object('level','full','source','pass','expires_at',e.expires_at,'order_ref',e.order_ref)
    else jsonb_build_object('level','free') end
  from profiles p
  left join schools s on s.id = p.school_id
  left join lateral (select * from entitlements where email = p.email and kind <> 'academy_pass'
                     and expires_at > now() order by expires_at desc limit 1) e on true
  where p.id = auth.uid()
$$;

-- Parents can't join classes (classes are for learners with their own school login)
create or replace function public.join_class(p_code text) returns uuid
language plpgsql security definer set search_path = public as $$
declare c classes; s schools; me profiles;
begin
  select * into me from profiles where id = auth.uid();
  if me.id is null then raise exception 'Sign in first.'; end if;
  if me.role = 'parent' then raise exception 'This is a parent account. Your child joins a class with their own school sign-in.'; end if;
  select * into c from classes where code = upper(trim(p_code));
  if c.id is null then raise exception 'That class code wasn''t found. Check it with your teacher.'; end if;
  select * into s from schools where id = c.school_id;
  if me.school_id is not null and me.school_id <> s.id then raise exception 'Your account belongs to another school.'; end if;
  if s.expires_at <= now() then raise exception '% licence has expired. Ask your teacher to renew it.', s.name; end if;
  if exists (select 1 from class_members where class_id = c.id and user_id = me.id) then raise exception 'You are already in that class.'; end if;
  if me.school_id is null and seats_used(s.id) >= s.seats then
    raise exception '% has used all % of its seats. Ask your teacher to contact Maths Forensics.', s.name, s.seats; end if;
  insert into class_members (class_id, user_id) values (c.id, me.id);
  perform set_config('app.trusted_write', 'on', true);  -- lets guard_profile allow this one server-side change
  update profiles set school_id = s.id where id = me.id;
  perform set_config('app.trusted_write', 'off', true);
  return c.id;
end $$;

/* ---------- 7. Academy access ---------- */
-- What one learner can open in the Academy: 'full' (with its source) or 'free'.
create or replace function public.academy_learner_access(p_learner uuid) returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare l learners; p profiles; owner_email text; e entitlements; sch schools;
begin
  select * into l from learners where id = p_learner;
  if l.id is null or not (acts_for(p_learner) or teaches_learner(p_learner) or is_owner()) then return jsonb_build_object('level', 'free'); end if;
  if l.parent_id is not null then
    select email into owner_email from profiles where id = l.parent_id;
    select * into e from entitlements
      where email = owner_email and kind = 'academy_pass' and expires_at > now() and payload->>'learner_id' = l.id::text
      order by expires_at desc limit 1;
    if e.id is not null then return jsonb_build_object('level', 'full', 'source', 'pass', 'expires_at', e.expires_at); end if;
    return jsonb_build_object('level', 'free');
  end if;
  select * into p from profiles where id = l.user_id;
  if p.role in ('teacher', 'schooladmin', 'owner') then return jsonb_build_object('level', 'full', 'source', 'staff'); end if;
  select s.* into sch from class_members m join classes c on c.id = m.class_id join schools s on s.id = c.school_id
    where m.user_id = p.id and c.academy_on and s.expires_at > now() limit 1;
  if sch.id is not null then return jsonb_build_object('level', 'full', 'source', 'school', 'school', sch.name, 'expires_at', sch.expires_at); end if;
  select * into e from entitlements where email = p.email and kind = 'academy_pass' and expires_at > now() order by expires_at desc limit 1;
  if e.id is not null then return jsonb_build_object('level', 'full', 'source', 'pass', 'expires_at', e.expires_at); end if;
  return jsonb_build_object('level', 'free');
end $$;

-- Everything the Academy needs on sign-in: who you are, your own learner (created on first visit
-- for anyone who isn't a parent), your children if you're a parent, and any unassigned passes.
create or replace function public.academy_me() returns jsonb
language plpgsql security definer set search_path = public as $$
declare p profiles; me learners; kids jsonb; spare int;
begin
  select * into p from profiles where id = auth.uid();
  if p.id is null then return jsonb_build_object('signed_in', false); end if;
  if p.role <> 'parent' then
    select * into me from learners where user_id = p.id;
    if me.id is null then
      insert into learners (user_id, first_name)
        values (p.id, left(coalesce(nullif(split_part(btrim(p.name), ' ', 1), ''), 'Cadet'), 20))
        on conflict (user_id) do nothing;
      select * into me from learners where user_id = p.id;
    end if;
  end if;
  select coalesce(jsonb_agg(jsonb_build_object('id', l.id, 'first_name', l.first_name, 'year_group', l.year_group,
           'has_pin', l.pin_hash is not null, 'access', academy_learner_access(l.id)) order by l.created_at), '[]'::jsonb)
    into kids from learners l where l.parent_id = p.id;
  select count(*) into spare from entitlements
    where email = p.email and kind = 'academy_pass' and expires_at > now() and coalesce(payload->>'learner_id', '') = '';
  return jsonb_build_object('signed_in', true, 'role', p.role, 'name', p.name,
    'learner', case when me.id is null then null else jsonb_build_object('id', me.id, 'first_name', me.first_name,
      'year_group', me.year_group, 'access', academy_learner_access(me.id)) end,
    'children', kids, 'spare_passes', spare);
end $$;

-- Give one of the parent's unassigned passes to a child. Returns true if a pass was assigned.
create or replace function public.academy_assign_pass(p_learner uuid) returns boolean
language plpgsql security definer set search_path = public as $$
declare p profiles; e entitlements;
begin
  select * into p from profiles where id = auth.uid();
  if not exists (select 1 from learners where id = p_learner and parent_id = p.id) then raise exception 'That isn''t one of your children.'; end if;
  if (academy_learner_access(p_learner)->>'level') = 'full' then return true; end if;
  select * into e from entitlements
    where email = p.email and kind = 'academy_pass' and expires_at > now() and coalesce(payload->>'learner_id', '') = ''
    order by created_at limit 1 for update;
  if e.id is null then return false; end if;
  update entitlements set payload = coalesce(payload, '{}'::jsonb) || jsonb_build_object('learner_id', p_learner::text) where id = e.id;
  return true;
end $$;

-- Parent adds a child (first name, year group, optional 4-digit PIN). A brand-new account that
-- has never joined a class becomes a parent account the first time it adds a child.
create or replace function public.academy_add_child(p_first_name text, p_year integer, p_pin text default null) returns uuid
language plpgsql security definer set search_path = public as $$
declare p profiles; nid uuid;
begin
  select * into p from profiles where id = auth.uid();
  if p.id is null then raise exception 'Sign in first.'; end if;
  if p.role = 'student' then
    if exists (select 1 from class_members where user_id = p.id) or p.school_id is not null then
      raise exception 'This account is a student account in a school. Sign in with a parent account to add a child.';
    end if;
    perform set_config('app.trusted_write', 'on', true);
    update profiles set role = 'parent' where id = p.id;
    perform set_config('app.trusted_write', 'off', true);
    delete from learners where user_id = p.id
      and not exists (select 1 from academy_progress where learner_id = learners.id)
      and not exists (select 1 from academy_awards where learner_id = learners.id);
  elsif p.role not in ('parent', 'owner') then
    raise exception 'Teacher accounts can''t hold children. Use a separate parent account.';
  end if;
  if char_length(btrim(coalesce(p_first_name, ''))) not between 1 and 20 then raise exception 'Enter a first name (up to 20 letters).'; end if;
  if p_year is not null and p_year not between 7 and 9 then raise exception 'The Academy is for Years 7, 8 and 9.'; end if;
  if p_pin is not null and p_pin !~ '^[0-9]{4}$' then raise exception 'The PIN must be 4 digits.'; end if;
  if (select count(*) from learners where parent_id = p.id) >= 6 then raise exception 'A parent account can hold up to 6 children.'; end if;
  insert into learners (parent_id, first_name, year_group, pin_hash)
    values (p.id, btrim(p_first_name), p_year, case when p_pin is null then null else extensions.crypt(p_pin, extensions.gen_salt('bf')) end)
    returning id into nid;
  perform academy_assign_pass(nid);
  return nid;
end $$;

create or replace function public.academy_update_child(p_learner uuid, p_first_name text, p_year integer, p_pin text default null, p_clear_pin boolean default false)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from learners where id = p_learner and parent_id = auth.uid()) then raise exception 'That isn''t one of your children.'; end if;
  if char_length(btrim(coalesce(p_first_name, ''))) not between 1 and 20 then raise exception 'Enter a first name (up to 20 letters).'; end if;
  if p_year is not null and p_year not between 7 and 9 then raise exception 'The Academy is for Years 7, 8 and 9.'; end if;
  if p_pin is not null and p_pin !~ '^[0-9]{4}$' then raise exception 'The PIN must be 4 digits.'; end if;
  update learners set first_name = btrim(p_first_name), year_group = p_year,
    pin_hash = case when p_clear_pin then null when p_pin is not null then extensions.crypt(p_pin, extensions.gen_salt('bf')) else pin_hash end
    where id = p_learner;
end $$;

-- Removing a child deletes their progress and awards. Their pass goes back to the parent to reassign.
create or replace function public.academy_remove_child(p_learner uuid) returns void
language plpgsql security definer set search_path = public as $$
declare em text;
begin
  if not exists (select 1 from learners where id = p_learner and parent_id = auth.uid()) then raise exception 'That isn''t one of your children.'; end if;
  select email into em from profiles where id = auth.uid();
  update entitlements set payload = payload - 'learner_id' where email = em and kind = 'academy_pass' and payload->>'learner_id' = p_learner::text;
  delete from learners where id = p_learner;
end $$;

-- The PIN stops brothers and sisters opening each other's profile on a shared device.
-- It's a convenience lock inside the parent's signed-in account, not a password.
create or replace function public.academy_check_pin(p_learner uuid, p_pin text) returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce((select pin_hash is null or pin_hash = extensions.crypt(coalesce(p_pin, ''), pin_hash)
                   from learners where id = p_learner and parent_id = auth.uid()), false)
$$;

-- Move progress saved on this device into the account. Keeps the better of the two for each topic.
create or replace function public.academy_import(p_learner uuid, p_topics jsonb) returns integer
language plpgsql security definer set search_path = public as $$
declare k text; v jsonb; n int := 0;
begin
  if not acts_for(p_learner) then raise exception 'That isn''t your profile.'; end if;
  if jsonb_typeof(p_topics) <> 'object' or octet_length(p_topics::text) > 40000 then raise exception 'Nothing to import.'; end if;
  for k, v in select * from jsonb_each(p_topics) loop
    continue when k !~ '^[a-z0-9-]{2,40}$' or jsonb_typeof(v) <> 'object';
    insert into academy_progress as ap (learner_id, topic, learned, practised, streak, secured, best, checks, secured_at)
    values (p_learner, k, coalesce((v->>'learned')::boolean, false),
            least(greatest(coalesce((v->>'practised')::int, 0), 0), 100000), least(greatest(coalesce((v->>'streak')::int, 0), 0), 10000),
            coalesce((v->>'secured')::boolean, false), least(greatest(coalesce((v->>'best')::int, 0), 0), 5),
            least(greatest(coalesce((v->>'checks')::int, 0), 0), 100000),
            case when coalesce((v->>'secured')::boolean, false) then now() end)
    on conflict (learner_id, topic) do update set
      learned = ap.learned or excluded.learned, practised = greatest(ap.practised, excluded.practised),
      streak = greatest(ap.streak, excluded.streak), secured = ap.secured or excluded.secured,
      best = greatest(ap.best, excluded.best), checks = greatest(ap.checks, excluded.checks),
      secured_at = coalesce(ap.secured_at, excluded.secured_at), updated_at = now();
    n := n + 1;
  end loop;
  return n;
end $$;

-- Teachers: Academy progress for one class (only learners with their own login, in that class)
create or replace function public.academy_class_progress(p_class uuid) returns jsonb
language plpgsql stable security definer set search_path = public as $$
begin
  if not ir_can_manage_class(p_class) then raise exception 'Only this class''s teacher can see this.'; end if;
  return coalesce((select jsonb_agg(jsonb_build_object(
      'name', sp.name, 'learner', l.id,
      'topics', coalesce((select jsonb_object_agg(ap.topic, jsonb_build_object('learned', ap.learned, 'practised', ap.practised,
                   'secured', ap.secured, 'best', ap.best, 'updated_at', ap.updated_at)) from academy_progress ap where ap.learner_id = l.id), '{}'::jsonb),
      'awards', coalesce((select jsonb_agg(jsonb_build_object('tier', a.tier, 'score', a.score, 'max', a.max, 'passed', a.passed, 'at', a.created_at))
                   from academy_awards a where a.learner_id = l.id), '[]'::jsonb)) order by sp.name)
    from class_members m join profiles sp on sp.id = m.user_id left join learners l on l.user_id = m.user_id
    where m.class_id = p_class), '[]'::jsonb);
end $$;

-- Teachers set a class's key stage and which doors are open
create or replace function public.set_class_doors(p_class uuid, p_key_stage text, p_lab boolean, p_academy boolean) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not ir_can_manage_class(p_class) then raise exception 'Only this class''s teacher can change this.'; end if;
  if p_key_stage not in ('ks3', 'ks4', 'ks5') then raise exception 'Choose KS3, KS4 or KS5.'; end if;
  if not (coalesce(p_lab, false) or coalesce(p_academy, false)) then raise exception 'Keep at least one door open.'; end if;
  update classes set key_stage = p_key_stage, lab_on = coalesce(p_lab, false), academy_on = coalesce(p_academy, false) where id = p_class;
end $$;

grant execute on function public.acts_for(uuid), public.teaches_learner(uuid), public.academy_learner_access(uuid),
  public.academy_me(), public.academy_assign_pass(uuid), public.academy_add_child(text, integer, text),
  public.academy_update_child(uuid, text, integer, text, boolean), public.academy_remove_child(uuid),
  public.academy_check_pin(uuid, text), public.academy_import(uuid, jsonb), public.academy_class_progress(uuid),
  public.set_class_doors(uuid, text, boolean, boolean) to authenticated;
