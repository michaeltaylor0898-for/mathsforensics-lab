\set ON_ERROR_STOP 0
\pset tuples_only on
\pset format unaligned
-- people
insert into auth.users (id, email) values
 ('00000000-0000-0000-0000-0000000000a1','parent1@x.com'), ('00000000-0000-0000-0000-0000000000a2','parent2@x.com'),
 ('00000000-0000-0000-0000-0000000000b1','labkid@x.com'),  ('00000000-0000-0000-0000-0000000000b2','acadonly@x.com'),
 ('00000000-0000-0000-0000-0000000000c1','y7@school.org'), ('00000000-0000-0000-0000-0000000000d1','teacher@school.org'),
 ('00000000-0000-0000-0000-0000000000d2','teacher2@school.org');
update profiles set role='teacher', name='Ms T' where email in ('teacher@school.org','teacher2@school.org');
update profiles set name='Ava Jones' where email='y7@school.org';
insert into schools (id,name,seats,expires_at) values ('00000000-0000-0000-0000-00000000005c','Hillcrest',30,now()+interval '200 days');
update profiles set school_id='00000000-0000-0000-0000-00000000005c' where role='teacher';
insert into classes (id,school_id,teacher_id,name,code) values ('00000000-0000-0000-0000-0000000c1a55','00000000-0000-0000-0000-00000000005c','00000000-0000-0000-0000-0000000000d1','7M','ABC234');
insert into entitlements (email,kind,expires_at,source,order_ref,payload) values
 ('parent1@x.com','academy_pass',now()+interval '365 days','test','A1','{}'),
 ('labkid@x.com','exam_pass',now()+interval '200 days','test','E1','{}'),
 ('acadonly@x.com','academy_pass',now()+interval '365 days','test','A2','{}');

create or replace function as_user(u text) returns void language sql as $$ select set_config('request.jwt.claim.sub', u, false) $$;
set role authenticated;

\echo '--- 1. Parent signs up and adds a child'
select as_user('00000000-0000-0000-0000-0000000000a1');
select 'me before: role=' || (academy_me()->>'role') || ' spare=' || (academy_me()->>'spare_passes');
select 'add Sam: ' || (academy_add_child('Sam', 7, '1234') is not null);
select 'role now: ' || my_role();
select 'own learner gone: ' || (academy_me()->'learner' = 'null'::jsonb);
select 'Sam access: ' || (academy_me()->'children'->0->'access'->>'level') || ' / spare=' || (academy_me()->>'spare_passes');
select 'parent Lab access (must be free): ' || (my_access()->>'level');
select 'add Mia (no pass yet): ' || (academy_add_child('Mia', 9) is not null);
select 'Mia access: ' || (academy_me()->'children'->1->'access'->>'level');
select 'PIN right: ' || academy_check_pin((select id from learners where first_name='Sam'), '1234') || ', wrong: ' || academy_check_pin((select id from learners where first_name='Sam'), '9999');
select 'Year 11 refused: '; select academy_add_child('Tom', 11);
select 'save Sam progress: '; insert into academy_progress (learner_id, topic, learned, practised) select id, 'rounding', true, 4 from learners where first_name='Sam';
select 'import merges: ' || academy_import((select id from learners where first_name='Sam'), '{"rounding":{"practised":2,"secured":true,"best":5},"perimeter":{"learned":true},"BAD KEY":{}}');
select string_agg(topic||':'||learned||'/'||practised||'/'||secured||'/'||best, ', ' order by topic) from academy_progress;
select 'parent joins a class (must fail): '; select join_class('ABC234');

\echo '--- 2. Second parent buys a pass for Mia? No: a stranger tries to reach the first family'
select as_user('00000000-0000-0000-0000-0000000000a2');
select 'stranger sees learners: ' || count(*) from learners;
select 'stranger sees progress: ' || count(*) from academy_progress;
select 'stranger access probe: ' || (academy_learner_access((select id from learners limit 1))->>'level');
select 'stranger writes progress (must fail): '; insert into academy_progress (learner_id, topic) values ((select id from learners where first_name='Sam'), 'notation');
select 'stranger edits child (must fail): '; select academy_update_child('00000000-0000-0000-0000-000000000000', 'X', 7);
select 'stranger reads PIN check: ' || academy_check_pin((select id from learners where first_name='Sam' limit 1), '1234');

\echo '--- 3. Lab and Academy passes stay separate'
select as_user('00000000-0000-0000-0000-0000000000b1');
select 'exam pass kid, Lab: ' || (my_access()->>'level') || ', Academy: ' || (academy_me()->'learner'->'access'->>'level');
select as_user('00000000-0000-0000-0000-0000000000b2');
select 'academy pass on own email, Lab (must be free): ' || (my_access()->>'level') || ', Academy for self (must be free): ' || (academy_me()->'learner'->'access'->>'level') || ', spare passes: ' || (academy_me()->>'spare_passes');

\echo '--- 4. School class'
select as_user('00000000-0000-0000-0000-0000000000c1');
select 'join: ' || (join_class('ABC234') is not null);
select 'Y7 Academy before teacher opens it: ' || (academy_me()->'learner'->'access'->>'level') || ', Lab: ' || (my_access()->>'level');
select 'school student adds a child (must fail): '; select academy_add_child('X', 7);
select as_user('00000000-0000-0000-0000-0000000000d2');
select 'other teacher opens doors (must fail): '; select set_class_doors('00000000-0000-0000-0000-0000000c1a55', 'ks3', true, true);
select as_user('00000000-0000-0000-0000-0000000000d1');
select set_class_doors('00000000-0000-0000-0000-0000000c1a55', 'ks3', true, true);
select 'both doors off (must fail): '; select set_class_doors('00000000-0000-0000-0000-0000000c1a55', 'ks3', false, false);
select as_user('00000000-0000-0000-0000-0000000000c1');
select 'Y7 Academy now: ' || (academy_me()->'learner'->'access'->>'source');
insert into academy_progress (learner_id, topic, secured) select id, 'place-value', true from learners where user_id = auth.uid();
insert into academy_awards (learner_id, tier, score, max) select id, 'bronze', 24, 30 from learners where user_id = auth.uid();
insert into academy_awards (learner_id, tier, score, max) select id, 'bronze', 23, 30 from learners where user_id = auth.uid();
select 'awards 24/30 and 23/30 passed: ' || string_agg(passed::text, ',' order by score desc) from academy_awards;
select as_user('00000000-0000-0000-0000-0000000000d1');
select 'teacher sees class progress: ' || jsonb_array_length(academy_class_progress('00000000-0000-0000-0000-0000000c1a55')) || ' student, secured=' || (academy_class_progress('00000000-0000-0000-0000-0000000c1a55')->0->'topics'->'place-value'->>'secured');
select 'teacher sees home children (must be 0): ' || count(*) from learners where parent_id is not null;
select as_user('00000000-0000-0000-0000-0000000000d2');
select 'other teacher reads class (must fail): '; select academy_class_progress('00000000-0000-0000-0000-0000000c1a55');
select 'other teacher sees progress rows: ' || count(*) from academy_progress;

\echo '--- 5. Removing a child frees the pass'
select as_user('00000000-0000-0000-0000-0000000000a1');
select academy_remove_child((select id from learners where first_name='Sam'));
select 'children: ' || jsonb_array_length(academy_me()->'children') || ', spare passes: ' || (academy_me()->>'spare_passes');
select 'assign to Mia: ' || academy_assign_pass((select id from learners where first_name='Mia')) || ', Mia: ' || (academy_me()->'children'->0->'access'->>'level');
select 'Sam progress deleted: ' || (select count(*) = 0 from academy_progress p where not exists (select 1 from learners l where l.id = p.learner_id));
select 'role change by hand (must fail): '; update profiles set role='owner' where id = auth.uid();
