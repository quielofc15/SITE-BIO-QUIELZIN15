const fetch = globalThis.fetch || require('node-fetch');

module.exports = async (req, res) => {
  // Only POST increments (page load/reload triggers POST)
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY;

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    res.status(500).json({ error: 'Supabase não configurado. Defina SUPABASE_URL e SUPABASE_SERVICE_KEY nas variáveis de ambiente.' });
    return;
  }

  const table = 'visits';
  const rowId = 1; // single global counter row
  const headers = {
    'Content-Type': 'application/json',
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
    Prefer: 'return=representation'
  };

  try {
    // 1) try to get existing row
    const getRes = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${rowId}`, { headers });
    if (!getRes.ok) throw new Error('Erro ao consultar Supabase');
    const arr = await getRes.json();

    if (!Array.isArray(arr) || arr.length === 0) {
      // create row with count = 1
      const createRes = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ id: rowId, count: 1 })
      });
      if (!createRes.ok) throw new Error('Erro ao criar contador no Supabase');
      const created = await createRes.json();
      const newCount = created?.[0]?.count ?? 1;
      res.status(200).json({ count: newCount });
      return;
    }

    const current = Number(arr[0].count || 0);
    const updated = current + 1;

    // patch the row
    const patchRes = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${rowId}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ count: updated })
    });
    if (!patchRes.ok) throw new Error('Erro ao atualizar contador no Supabase');
    const patched = await patchRes.json();
    const newCount = patched?.[0]?.count ?? updated;

    res.status(200).json({ count: newCount });
  } catch (err) {
    console.error('visit api error:', err);
    res.status(500).json({ error: 'Erro interno ao processar contador' });
  }
};
