-- Minimal replica of the live Supabase schema (from Mike's export, 13 Nov 2026)
create schema if not exists extensions; create schema if not exists auth;
create extension if not exists citext with schema public;
do $$ begin create role authenticated nologin; exception when duplicate_object then null; end $$;
grant usage on schema public, extensions, auth to authenticated;
create table auth.users (id uuid primary key default gen_random_uuid(), email text, raw_user_meta_data jsonb default '{}', raw_app_meta_data jsonb default '{}', created_at timestamptz default now(), last_sign_in_at timestamptz);
create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
grant execute on function auth.uid() to authenticated;
create table schools (id uuid primary key default gen_random_uuid(), name text not null, seats int not null check (seats > 0), expires_at timestamptz not null, created_at timestamptz not null default now());
create table profiles (id uuid primary key references auth.users(id) on delete cascade, name text not null, email citext not null unique, role text not null check (role = any (array['student','teacher','schooladmin','owner'])), school_id uuid references schools(id) on delete set null, created_at timestamptz not null default now());
create table classes (id uuid primary key default gen_random_uuid(), school_id uuid not null references schools(id) on delete cascade, teacher_id uuid not null references profiles(id) on delete cascade, name text not null, code text not null unique check (code ~ '^[A-Z2-9]{6}$'), created_at timestamptz not null default now());
create table class_members (class_id uuid not null references classes(id) on delete cascade, user_id uuid not null references profiles(id) on delete cascade, joined_at timestamptz not null default now(), primary key (class_id, user_id));
create table entitlements (id uuid primary key default gen_random_uuid(), email citext not null, kind text not null, expires_at timestamptz not null, source text not null, order_ref text unique, payload jsonb, created_at timestamptz not null default now());
create function my_role() returns text language sql stable security definer set search_path to 'public' as $$ select role from profiles where id = auth.uid() $$;
create function my_school() returns uuid language sql stable security definer set search_path to 'public' as $$ select school_id from profiles where id = auth.uid() $$;
create function is_owner() returns boolean language sql stable security definer set search_path to 'public' as $$ select coalesce((select role = 'owner' from profiles where id = auth.uid()), false) $$;
create function teaches(p_user uuid) returns boolean language sql stable security definer set search_path to 'public' as $$ select exists (select 1 from class_members m join classes c on c.id = m.class_id where m.user_id = p_user and c.teacher_id = auth.uid()) $$;
create function seats_used(p_school uuid) returns integer language sql stable security definer set search_path to 'public' as $$ select count(distinct m.user_id)::int from class_members m join classes c on c.id = m.class_id where c.school_id = p_school $$;
create function ir_can_manage_class(p_class uuid) returns boolean language sql stable security definer set search_path to 'public' as $$ select exists (select 1 from classes c join profiles p on p.id = auth.uid() where c.id = p_class and (c.teacher_id = auth.uid() or p.role = 'owner' or (p.role = 'schooladmin' and p.school_id is not null and p.school_id = c.school_id))) $$;
create function guard_profile() returns trigger language plpgsql as $$ begin
  if auth.uid() is not null and coalesce(current_setting('app.trusted_write', true), 'off') <> 'on' and not is_owner() and (new.role <> old.role or new.school_id is distinct from old.school_id or new.email <> old.email) then raise exception 'Only the name can be changed.'; end if; return new; end $$;
create trigger guard_profile before update on profiles for each row execute function guard_profile();
create function handle_new_user() returns trigger language plpgsql security definer set search_path to 'public' as $$ begin
  insert into profiles (id, email, name, role, school_id) values (new.id, new.email, coalesce(new.raw_user_meta_data->>'name',''), coalesce(new.raw_app_meta_data->>'role','student'), nullif(new.raw_app_meta_data->>'school_id','')::uuid); return new; end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function handle_new_user();
alter table profiles enable row level security; alter table classes enable row level security; alter table entitlements enable row level security; alter table class_members enable row level security;
create policy p on profiles for select using (id = auth.uid() or teaches(id) or is_owner());
create policy e on entitlements for select using (email = (select email from profiles where id = auth.uid()) or is_owner());
grant select, insert, update, delete on all tables in schema public to authenticated;
alter default privileges in schema public grant select, insert, update, delete on tables to authenticated;
-- the live my_access, before the migration
create function my_access() returns jsonb language sql stable security definer set search_path to 'public' as $$
  select case when p.role <> 'student' then jsonb_build_object('level','full','source','staff')
    when s.id is not null and s.expires_at > now() and exists (select 1 from class_members where user_id = p.id) then jsonb_build_object('level','full','source','school')
    when e.id is not null then jsonb_build_object('level','full','source','pass') else jsonb_build_object('level','free') end
  from profiles p left join schools s on s.id = p.school_id
  left join lateral (select * from entitlements where email = p.email and expires_at > now() order by expires_at desc limit 1) e on true where p.id = auth.uid() $$;
