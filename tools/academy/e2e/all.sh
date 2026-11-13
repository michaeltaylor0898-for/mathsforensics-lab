set -e
su claude -c "/usr/lib/postgresql/16/bin/pg_ctl -D /tmp/pgt/data -o '-k /tmp/pgt -p 5499' -l /tmp/pgt/log start" >/dev/null 2>&1 || true
sleep 2
P="psql -h /tmp/pgt -p 5499 -U postgres"
$P -q -c "drop database if exists mf" -c "create database mf" 2>&1 | grep -v NOTICE || true
$P -d mf -q -v ON_ERROR_STOP=1 -f ../db-test/base.sql
$P -d mf -q -v ON_ERROR_STOP=1 -f /home/claude/mathsforensics-lab/supabase/migrations/007_academy_accounts.sql 2>&1 | grep -v NOTICE || true
$P -d mf -q -v ON_ERROR_STOP=1 -f /home/claude/mathsforensics-lab/supabase/migrations/008_academy_pass_for_children_only.sql
$P -d mf -q -v ON_ERROR_STOP=1 -f seed.sql
node server.js > server.log 2>&1 & SV=$!; sleep 1
node run.js 2>&1 | grep -v "agent-proxy\|connect_rejected\|Allowed domains\|For details" || true
kill $SV
$P -d mf -tA -c "select l.first_name, p.topic, p.learned, p.practised, p.secured from academy_progress p join learners l on l.id=p.learner_id order by 1,2" -c "select first_name, year_group, parent_id is not null as home, pin_hash is not null as pin from learners order by created_at" -c "select email, role from profiles order by email" -c "select payload->>'learner_id' is not null from entitlements"
