-- Migration 009: teacher set work in the Academy.
--
-- Academy work uses the Lab's existing assignments table. Its topic says what to do:
--   ac:learn:<topic>   learn the topic and answer 5 practice questions
--   ac:secure:<topic>  pass the topic's 5-question check (4 out of 5)
--   ac:case:<nn>       crack case file nn
-- Students see it in the Academy; the teacher sees who has done it on the class page in the Lab.
--
-- This migration only widens academy_class_progress so the teacher's class page can match
-- each student (it now returns the student's user id and how many checks they have tried).
--
-- Run once in Supabase → SQL Editor. Safe to run again.

create or replace function public.academy_class_progress(p_class uuid) returns jsonb
language plpgsql stable security definer set search_path = public as $$
begin
  if not ir_can_manage_class(p_class) then raise exception 'Only this class''s teacher can see this.'; end if;
  return coalesce((select jsonb_agg(jsonb_build_object(
      'name', sp.name, 'user', m.user_id, 'learner', l.id,
      'topics', coalesce((select jsonb_object_agg(ap.topic, jsonb_build_object('learned', ap.learned, 'practised', ap.practised,
                   'secured', ap.secured, 'best', ap.best, 'checks', ap.checks, 'updated_at', ap.updated_at))
                   from academy_progress ap where ap.learner_id = l.id), '{}'::jsonb),
      'awards', coalesce((select jsonb_agg(jsonb_build_object('tier', a.tier, 'score', a.score, 'max', a.max, 'passed', a.passed, 'at', a.created_at))
                   from academy_awards a where a.learner_id = l.id), '[]'::jsonb)) order by sp.name)
    from class_members m join profiles sp on sp.id = m.user_id left join learners l on l.user_id = m.user_id
    where m.class_id = p_class), '[]'::jsonb);
end $$;

grant execute on function public.academy_class_progress(uuid) to authenticated;
