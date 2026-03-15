import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

interface RouteFeature {
  type: 'Feature'
  properties: { a?: string; b?: string; location?: string }
  geometry: { type: 'LineString'; coordinates: [number, number][] }
}

export default defineEventHandler(async () => {
  const baseDir = process.cwd()
  const filePath = join(baseDir, 'dataserve', 'route', 'route.json')
  try {
    const content = await readFile(filePath, 'utf-8')
    const data = JSON.parse(content) as RouteFeature
    if (data?.geometry?.coordinates?.length >= 2) {
      const routeName = [data.properties?.a, data.properties?.b].filter(Boolean).join(' - ')
      return {
        id: 'dataserve',
        routeName: routeName || 'Route dari dataserve',
        coordinates: data.geometry.coordinates,
        portOrigin: data.properties?.a ?? '',
        portDestination: data.properties?.b ?? ''
      }
    }
  } catch {
    // file not found or invalid
  }
  return null
})
