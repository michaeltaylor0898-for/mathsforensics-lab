-- Migration 008: an Academy Pass only unlocks the child it's given to.
-- In 007, a student account with an Academy Pass on its own email got the Academy unlocked for itself.
-- Every home Academy account is a parent account, so that pass belongs to a child the parent hasn't
-- added yet: the Academy now asks them to add their child, and the pass goes to that child.
-- Run once in Supabase → SQL Editor, after 007. Safe to run again.

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
  -- An Academy Pass only ever unlocks the child it's given to. A pass on a student's own email
  -- means a parent who hasn't added their child yet, so the Academy prompts them to do that.
  return jsonb_build_object('level', 'free');
end $$;

