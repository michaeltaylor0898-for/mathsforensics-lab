// Stand-in for Supabase: runs each call against the local Postgres copy as the signed-in user, with RLS on.
const http = require('http'); const { Pool } = require('pg');
const pool = new Pool({ host: '/tmp/pgt', port: 5499, user: 'postgres', database: 'mf' });
async function asUser(uid, fn) { const c = await pool.connect(); try { await c.query('begin'); await c.query("select set_config('request.jwt.claim.sub', $1, true)", [uid]); await c.query('set local role authenticated'); const r = await fn(c); await c.query('commit'); return r; } catch (e) { await c.query('rollback'); throw e; } finally { c.release(); } }
http.createServer((req, res) => { let b = ''; req.on('data', d => b += d); req.on('end', async () => {
  const send = (o) => { res.writeHead(200, { 'content-type': 'application/json', 'access-control-allow-origin': '*' }); res.end(JSON.stringify(o)); };
  try { const q = JSON.parse(b || '{}');
    if (req.url === '/rpc') { const keys = Object.keys(q.args || {}); const sql = `select to_jsonb(public.${q.name.replace(/\W/g, '')}(${keys.map((k, i) => `${k.replace(/\W/g, '')} => $${i + 1}`).join(', ')})) as r`;
      const vals = keys.map(k => { const v = q.args[k]; return v !== null && typeof v === 'object' ? JSON.stringify(v) : v; });
      const r = await asUser(q.uid, c => c.query(sql, vals)); return send({ data: r.rows[0].r }); }
    if (req.url === '/select') { const r = await asUser(q.uid, c => c.query('select topic,learned,practised,streak,secured,best,checks,secured_at from academy_progress where learner_id = $1', [q.learner_id])); return send({ data: r.rows }); }
    if (req.url === '/upsert') { await asUser(q.uid, async c => { for (const x of q.rows) await c.query(`insert into academy_progress (learner_id,topic,learned,practised,streak,secured,best,checks,secured_at,updated_at) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,now())
        on conflict (learner_id,topic) do update set learned=excluded.learned,practised=excluded.practised,streak=excluded.streak,secured=excluded.secured,best=excluded.best,checks=excluded.checks,secured_at=excluded.secured_at,updated_at=now()`, [x.learner_id, x.topic, x.learned, x.practised, x.streak, x.secured, x.best, x.checks, x.secured_at]); }); return send({ data: null }); }
    send({ error: { message: 'unknown' } });
  } catch (e) { send({ error: { message: e.message } }); } }); }).listen(5599, () => console.log('stand-in on 5599'));
