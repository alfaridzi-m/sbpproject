import { writeFile, mkdir } from 'node:fs/promises'
import { join } from 'node:path'

interface RoutePayload {
  routeName: string
  coordinates: [number, number][]
  portOrigin?: string
  portDestination?: string
  /** GeoJSON outer ring [lng, lat], closed (first = last) */
  boundingRectangle?: [number, number][]
}

export default defineEventHandler(async (event) => {
  const body = await readBody<RoutePayload>(event)
  if (!body?.coordinates || body.coordinates.length < 2) {
    throw createError({ statusCode: 400, message: 'Route must have at least 2 coordinates' })
  }

  const parts = (body.routeName || '').split('-').map((s: string) => s.trim()).filter(Boolean)
  const origin = body.portOrigin || parts[0] || 'Origin'
  const destination = body.portDestination || parts[1] || 'Destination'

  const lineFeature = {
    type: 'Feature' as const,
    properties: {
      a: origin,
      b: destination,
      location: 'route'
    },
    geometry: {
      type: 'LineString' as const,
      coordinates: body.coordinates
    }
  }

  const ring = body.boundingRectangle
  const hasPoly = Array.isArray(ring) && ring.length >= 4

  const geojson = hasPoly
    ? {
        type: 'FeatureCollection' as const,
        features: [
          lineFeature,
          {
            type: 'Feature' as const,
            properties: { location: 'bounding-rectangle' },
            geometry: {
              type: 'Polygon' as const,
              coordinates: [ring]
            }
          }
        ]
      }
    : lineFeature

  const baseDir = process.cwd()
  const routeDir = join(baseDir, 'dataserve', 'route')
  const filePath = join(routeDir, 'route.json')

  await mkdir(routeDir, { recursive: true })
  await writeFile(filePath, JSON.stringify(geojson, null, 2), 'utf-8')

  return { ok: true }
})
