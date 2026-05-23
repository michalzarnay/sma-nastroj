/**
 * Vercel serverless proxy for PVGIS solar irradiance data.
 * Browser cannot call re.jrc.ec.europa.eu directly (no CORS headers).
 *
 * GET /api/pvgis?lat=48.15&lon=17.6
 * Response: { solar: number } — ročný úhrn kWh/m²
 */

const PVGIS_BASE = 'https://re.jrc.ec.europa.eu/api/v5_2/MRcalc';

export default async function handler(
  req: { query: Record<string, string> },
  res: {
    status: (c: number) => { json: (d: unknown) => void };
    json: (d: unknown) => void;
  },
) {
  const lat = parseFloat(req.query.lat ?? '');
  const lon = parseFloat(req.query.lon ?? '');

  if (isNaN(lat) || isNaN(lon)) {
    return res.status(400).json({ error: 'Chýbajú parametre lat/lon.' });
  }

  const url =
    `${PVGIS_BASE}?lat=${lat}&lon=${lon}` +
    `&outputformat=json&raddatabase=PVGIS-SARAH2&horirrad=1`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const resp = await fetch(url, {
      headers: { 'User-Agent': 'sma-nastroj/1.0' },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!resp.ok) {
      return res.status(502).json({ error: `PVGIS vrátil ${resp.status}` });
    }

    const data = await resp.json() as {
      status?: string;
      message?: string;
      outputs?: { monthly?: { fixed?: { H_h: number }[] } };
    };

    if (data.status === 'error') {
      return res.status(502).json({ error: `PVGIS: ${data.message ?? 'neznáma chyba'}` });
    }

    const monthly = data.outputs?.monthly?.fixed ?? [];
    const solar = Math.round(monthly.reduce((a, m) => a + (m.H_h ?? 0), 0));

    return res.json({ solar });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Neznáma chyba';
    return res.status(502).json({ error: `PVGIS nedostupné: ${msg}` });
  }
}
