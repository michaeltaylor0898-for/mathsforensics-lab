// Same surface as supabase-js for the calls the Academy makes; the signed-in user comes from localStorage "test-uid".
window.supabase = { createClient() { const uid = () => localStorage.getItem('test-uid');
  const call = async (path, body) => { const r = await fetch('/__sb' + path, { method: 'POST', body: JSON.stringify({ uid: uid(), ...body }) }); return r.json(); };
  return { auth: { async getSession() { return { data: { session: uid() ? { user: { id: uid() } } : null } }; }, async signOut() { localStorage.removeItem('test-uid'); } },
    rpc: (name, args) => call('/rpc', { name, args }),
    from() { return { select() { return { eq: (_k, v) => call('/select', { learner_id: v }) }; }, upsert: (rows) => call('/upsert', { rows }) }; } }; } };
