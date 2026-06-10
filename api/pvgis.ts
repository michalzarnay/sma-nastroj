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
      outputs?: {
        monthly?: { fixed?: Record<string, number>[] } | Record<string, number>[];
        totals?: { fixed?: Record<string, number> };
      };
    };

    if (data.status === 'error') {
      return res.status(502).json({ error: `PVGIS: ${data.message ?? 'neznáma chyba'}` });
    }

    // PVGIS monthly může byť pole priamo alebo cez .fixed
    const rawMonthly = data.outputs?.monthly;
    const monthly: Record<string, number>[] = Array.isArray(rawMonthly)
      ? rawMonthly
      : (rawMonthly as { fixed?: Record<string, number>[] } | undefined)?.fixed ?? [];

    // Pole H_h sa v rôznych verziách API volá rôzne: H_h, H(h)_m, Gh
    const solar = Math.round(
      monthly.reduce((a, m) => {
        const val = m['H_h'] ?? m['H(h)_m'] ?? m['Gh'] ?? m['G(h)'] ?? 0;
        return a + val;
      }, 0)
    );

    // Debug: vráť aj surové dáta ak solar = 0
    if (solar === 0 && monthly.length > 0) {
      return res.json({ solar, _debug: { keys: Object.keys(monthly[0]), sample: monthly[0] } });
    }

    return res.json({ solar });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Neznáma chyba';
    return res.status(502).json({ error: `PVGIS nedostupné: ${msg}` });
  }
}
