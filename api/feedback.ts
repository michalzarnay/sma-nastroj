/**
 * POST /api/feedback
 * Prijme podnet z UI, prepošle ho na VESMA most (Apps Script), ktorý zapíše do GSheet.
 */

const WEBAPP_URL = process.env.SHEET_WEBAPP_URL ?? '';
const WEBHOOK_SECRET = process.env.SHEET_WEBHOOK_SECRET ?? '';

export default async function handler(
  req: { method?: string; body: { fieldLabel?: string; nazovPodnetu?: string; opisPodnetu?: string; url?: string } },
  res: { status: (c: number) => { json: (d: unknown) => void }; json: (d: unknown) => void },
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { fieldLabel, nazovPodnetu, opisPodnetu, url } = req.body;

  if (!nazovPodnetu?.trim()) {
    return res.status(400).json({ error: 'Chýba názov podnetu.' });
  }

  if (!WEBAPP_URL || !WEBHOOK_SECRET) {
    return res.status(503).json({ error: 'Backend nie je nakonfigurovaný.' });
  }

  const payload = {
    secret: WEBHOOK_SECRET,
    action: 'feedback',
    datum: new Date().toISOString(),
    prvok: fieldLabel ?? '',
    nazov: nazovPodnetu.trim(),
    opis: opisPodnetu?.trim() ?? '',
    url: url ?? '',
  };

  try {
    const resp = await fetch(WEBAPP_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!resp.ok) {
      return res.status(502).json({ error: `VESMA most vrátil ${resp.status}` });
    }
    return res.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Neznáma chyba';
    return res.status(502).json({ error: msg });
  }
}
