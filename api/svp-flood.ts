/**
 * Vercel serverless proxy for SVP flood hazard zones.
 * Frontend cannot call mpt.svp.sk directly (no CORS headers).
 *
 * GET /api/svp-flood?lat=48.15&lon=17.6
 * Response: { riziko: 0-5, perioda: number|null, zona: string|null }
 *   riziko 0 = no data / outside flood zone
 *   riziko 1 = Q1000 zone (lowest hazard)
 *   riziko 2 = Q100 zone
 *   riziko 3 = Q50 zone
 *   riziko 4 = Q10 zone
 *   riziko 5 = Q5 zone (highest hazard)
 */

export const config = { runtime: 'edge' };

const SVP_BASE =
  'https://mpt.svp.sk/server/rest/services/inspire/INSPIRE_MPO/MapServer/identify';

export default async function handler(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const lat = parseFloat(url.searchParams.get('lat') ?? '');
  const lon = parseFloat(url.searchParams.get('lon') ?? '');

  if (isNaN(lat) || isNaN(lon)) {
    return Response.json({ error: 'Chýbajú parametre lat/lon.' }, { status: 400 });
  }

  const delta = 0.005; // ~500m tolerance box
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
    const resp = await fetch(svpUrl, {
      headers: { 'User-Agent': 'sma-nastroj/1.0' },
      signal: AbortSignal.timeout(8000),
    });

    if (!resp.ok) {
      return Response.json(
        { error: `SVP server vrátil ${resp.status}` },
        { status: 502 },
      );
    }

    const data = (await resp.json()) as {
      results?: Array<{ attributes?: { inundationReturnPeriod?: number } }>;
    };

    const periods: number[] = (data.results ?? [])
      .map((r) => r.attributes?.inundationReturnPeriod ?? 0)
      .filter((p) => p > 0);

    const minPeriod = periods.length > 0 ? Math.min(...periods) : null;

    // Map return period → 1-5 risk scale
    let riziko = 0;
    if (minPeriod !== null) {
      if (minPeriod <= 5) riziko = 5;
      else if (minPeriod <= 10) riziko = 4;
      else if (minPeriod <= 50) riziko = 3;
      else if (minPeriod <= 100) riziko = 2;
      else riziko = 1;
    }

    const zonaLabel = minPeriod !== null ? `Q${minPeriod}` : null;

    return Response.json({ riziko, perioda: minPeriod, zona: zonaLabel });
  } catch (err) {
    return Response.json(
      { error: 'Nepodarilo sa spojiť so SVP serverom.' },
      { status: 502 },
    );
  }
}
