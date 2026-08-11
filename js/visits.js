// Client-side visit counter: calls /api/visit to increment and get total
(async function () {
  const el = document.getElementById('visitCount');
  if (!el) return;

  try {
    const res = await fetch('/api/visit', { method: 'POST' });
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    const n = Number(data?.count ?? 0) || 0;
    // format with thousands separators
    el.textContent = n.toLocaleString('pt-BR');
  } catch (err) {
    console.warn('Visit counter error:', err);
  }
})();
