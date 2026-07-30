/**
 * Vercel serverless proxy pre zber nezodpovedaných otázok chatbota.
 * Prepošle záznam na VESMA most (Google Apps Script Web App),
 * ktorý ho zapíše do Google Sheetu.
 *
 * POST /api/feedback
 * Body: { question: string, step: number, timestamp: string }
 */

export default async function handler(
  req: { method: string; body: { question?: string; step?: number; timestamp?: string } },
  res: {
    status: (c: number) => { json: (d: unknown) => void };
    json: (d: unknown) => void;
  },
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

  const { question, step, timestamp } = req.body ?? {};

  if (!question || typeof question !== 'string' || question.trim().length === 0) {
    return res.status(400).json({ error: 'Chýba otázka' });
  }

  const sheetUrl = process.env.SHEET_WEBAPP_URL;
  const secret = process.env.SHEET_WEBHOOK_SECRET;

  if (!sheetUrl || !secret) {
    return res.status(500).json({ error: 'Chýba konfigurácia VESMA mostu' });
  }

  const payload = {
    secret,
    action: 'unanswered',
    question: question.trim(),
    step: step ?? 0,
    timestamp: timestamp ?? new Date().toISOString(),
  };

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);

    const response = await fetch(sheetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!response.ok) {
      return res.status(502).json({ error: 'VESMA most vrátil chybu' });
    }

    return res.json({ ok: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Neznáma chyba';
    return res.status(502).json({ error: `Nedá sa spojiť s VESMA mostom: ${msg}` });
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
