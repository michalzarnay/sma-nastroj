import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import type { Plugin } from 'vite'
import type { IncomingMessage, ServerResponse } from 'node:http'

/**
 * Dev-only plugin: simulates the /api/svp-flood Vercel function locally.
 * On production (Vercel) the real api/svp-flood.ts is used instead.
 */
function svpProxyPlugin(): Plugin {
  const SVP_BASE =
    'https://mpt.svp.sk/server/rest/services/inspire/INSPIRE_MPO/MapServer/identify'

  return {
    name: 'svp-dev-proxy',
    configureServer(server) {
      server.middlewares.use(
        '/api/svp-flood',
        async (req: IncomingMessage, res: ServerResponse) => {
          const url = new URL(req.url ?? '', 'http://localhost')
          const lat = parseFloat(url.searchParams.get('lat') ?? '')
          const lon = parseFloat(url.searchParams.get('lon') ?? '')

          const send = (status: number, body: unknown) => {
            res.statusCode = status
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(body))
          }

          if (isNaN(lat) || isNaN(lon))
            return send(400, { error: 'Chýbajú parametre lat/lon.' })

          const delta = 0.005
          const svpUrl =
            `${SVP_BASE}?` +
            `geometry=${encodeURIComponent(JSON.stringify({ x: lon, y: lat }))}&` +
            `geometryType=esriGeometryPoint&sr=4326&layers=all&tolerance=2&` +
            `mapExtent=${lon - delta},${lat - delta},${lon + delta},${lat + delta}&` +
            `imageDisplay=100,100,96&returnGeometry=false&f=json`

          try {
            const controller = new AbortController()
            const t = setTimeout(() => controller.abort(), 8000)
            const resp = await fetch(svpUrl, {
              headers: { 'User-Agent': 'sma-nastroj-dev/1.0' },
              signal: controller.signal,
            })
            clearTimeout(t)

            if (!resp.ok) return send(502, { error: `SVP vrátil ${resp.status}` })

            const data = await resp.json() as {
              results?: Array<{ attributes?: { inundationReturnPeriod?: number } }>
            }
            const periods = (data.results ?? [])
              .map(r => r.attributes?.inundationReturnPeriod ?? 0)
              .filter(p => p > 0)
            const minPeriod = periods.length > 0 ? Math.min(...periods) : null

            let riziko = 0
            if (minPeriod !== null) {
              if (minPeriod <= 5) riziko = 5
              else if (minPeriod <= 10) riziko = 4
              else if (minPeriod <= 50) riziko = 3
              else if (minPeriod <= 100) riziko = 2
              else riziko = 1
            }
            send(200, { riziko, perioda: minPeriod, zona: minPeriod ? `Q${minPeriod}` : null })
          } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Neznáma chyba'
            send(502, { error: `SVP nedostupné: ${msg}` })
          }
        },
      )
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), svpProxyPlugin()],
  server: {
    watch: {
      ignored: ['**/api/**'],
    },
  },
  optimizeDeps: {
    exclude: ['api'],
  },
})
