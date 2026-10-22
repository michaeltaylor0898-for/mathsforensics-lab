-- Migration 006: repair a missing profile after sign-in.
-- Every account normally gets a profile automatically when it is created. If one is ever missing
-- (for example an account created before that rule existed, or a profile row deleted by hand),
-- sign-in failed with "Cannot coerce the result to a single JSON object". The Lab now calls this
-- function to create the missing profile as a student. Run once in Supabase → SQL Editor (safe to run again).

create or replace function public.ensure_my_profile() returns jsonb
language plpgsql security definer set search_path = public as $$
declare u auth.users;
begin
  select * into u from auth.users where id = auth.uid();
  if u.id is null then raise exception 'Sign in first.'; end if;
  if exists (select 1 from profiles where id = u.id) then return jsonb_build_object('status', 'ok'); end if;
  if coalesce(u.email, '') = '' then return jsonb_build_object('status', 'no_email'); end if;
  if exists (select 1 from profiles where email = u.email) then return jsonb_build_object('status', 'email_taken'); end if;
  insert into profiles (id, email, name, role, school_id)
  values (u.id, u.email,
          left(coalesce(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name', ''), 80),
          coalesce(u.raw_app_meta_data->>'role', 'student'),
          nullif(u.raw_app_meta_data->>'school_id', '')::uuid);
  return jsonb_build_object('status', 'created');
end $$;
grant execute on function public.ensure_my_profile() to authenticated;
