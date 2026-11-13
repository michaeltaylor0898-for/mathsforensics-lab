insert into auth.users (id, email) values ('00000000-0000-0000-0000-0000000000a1','parent1@x.com'), ('00000000-0000-0000-0000-0000000000c1','y7@school.org'), ('00000000-0000-0000-0000-0000000000d1','teacher@school.org');
update profiles set role='teacher', name='Ms T' where email='teacher@school.org'; update profiles set name='Jo Parent' where email='parent1@x.com'; update profiles set name='Ava Jones' where email='y7@school.org';
insert into schools (id,name,seats,expires_at) values ('00000000-0000-0000-0000-00000000005c','Hillcrest',30,now()+interval '200 days');
update profiles set school_id='00000000-0000-0000-0000-00000000005c' where role='teacher';
insert into classes (id,school_id,teacher_id,name,code,key_stage,academy_on) values ('00000000-0000-0000-0000-0000000c1a55','00000000-0000-0000-0000-00000000005c','00000000-0000-0000-0000-0000000000d1','7M','ABC234','ks3',true);
insert into class_members values ('00000000-0000-0000-0000-0000000c1a55','00000000-0000-0000-0000-0000000000c1');
update profiles set school_id='00000000-0000-0000-0000-00000000005c' where email='y7@school.org';
insert into entitlements (email,kind,expires_at,source,order_ref,payload) values ('parent1@x.com','academy_pass',now()+interval '365 days','test','A1','{}');
