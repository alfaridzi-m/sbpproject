import { writeFile, mkdir } from 'node:fs/promises'
import { join } from 'node:path'

interface RoutePayload {
  routeName: string
  coordinates: [number, number][]
  portOrigin?: string
  portDestination?: string
}

export default defineEventHandler(async (event) => {
  const body = await readBody<RoutePayload>(event)
  if (!body?.coordinates || body.coordinates.length < 2) {
    throw createError({ statusCode: 400, message: 'Route must have at least 2 coordinates' })
  }

  const parts = (body.routeName || '').split('-').map((s: string) => s.trim()).filter(Boolean)
  const origin = body.portOrigin || parts[0] || 'Origin'
  const destination = body.portDestination || parts[1] || 'Destination'

  const geojson = {
    type: 'Feature',
    properties: {
      a: origin,
      b: destination,
      location: 'route'
    },
    geometry: {
      type: 'LineString',
      coordinates: body.coordinates
    }
  }

  const baseDir = process.cwd()
  const routeDir = join(baseDir, 'dataserve', 'route')
  const filePath = join(routeDir, 'route.json')

  await mkdir(routeDir, { recursive: true })
  await writeFile(filePath, JSON.stringify(geojson, null, 2), 'utf-8')

  return { ok: true }
})
