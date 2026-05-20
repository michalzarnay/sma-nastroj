/**
 * Vercel serverless proxy for SVP flood hazard zones.
 * Frontend cannot call mpt.svp.sk directly (no CORS headers).
 *
 * GET /api/svp-flood?lat=48.15&lon=17.6
 * Response: { riziko: 0-5, perioda: number|null, zona: string|null }
 */

const SVP_BASE =
  'https://mpt.svp.sk/server/rest/services/inspire/INSPIRE_MPO/MapServer/identify';

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

  const delta = 0.005;
  const svpUrl =
    `${SVP_BASE}?` +
    `geometry=${encodeURIComponent(JSON.stringify({ x: lon, y: lat }))}&` +
    `geometryType=esriGeometryPoint&` +
    `sr=4326&` +
    `layers=all&` +
    `tolerance=2&` +
    `mapExtent=${lon - delta},${lat - delta},${lon + delta},${lat + delta}&` +
    `imageDisplay=100,100,96&` +
    `returnGeometry=false&` +
    `f=json`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const resp = await fetch(svpUrl, {
      headers: { 'User-Agent': 'sma-nastroj/1.0' },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!resp.ok) {
      return res.status(502).json({ error: `SVP server vrátil ${resp.status}` });
    }

    const data = await resp.json() as {
      results?: Array<{ attributes?: { inundationReturnPeriod?: number } }>;
    };

    const periods: number[] = (data.results ?? [])
      .map((r) => r.attributes?.inundationReturnPeriod ?? 0)
      .filter((p) => p > 0);

    const minPeriod = periods.length > 0 ? Math.min(...periods) : null;

    let riziko = 0;
    if (minPeriod !== null) {
      if (minPeriod <= 5) riziko = 5;
      else if (minPeriod <= 10) riziko = 4;
      else if (minPeriod <= 50) riziko = 3;
      else if (minPeriod <= 100) riziko = 2;
      else riziko = 1;
    }

    return res.json({ riziko, perioda: minPeriod, zona: minPeriod ? `Q${minPeriod}` : null });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Neznáma chyba';
    return res.status(502).json({ error: `Nepodarilo sa spojiť so SVP: ${msg}` });
  }
}
