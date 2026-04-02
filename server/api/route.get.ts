import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

interface RouteFeature {
  type: 'Feature'
  properties: { a?: string; b?: string; location?: string }
  geometry: { type: 'LineString'; coordinates: [number, number][] }
}

interface PolygonFeature {
  type: 'Feature'
  properties?: { location?: string }
  geometry: { type: 'Polygon'; coordinates: [number, number][][] }
}

interface RouteFeatureCollection {
  type: 'FeatureCollection'
  features: Array<RouteFeature | PolygonFeature>
}

function lineStringFromStored(data: RouteFeature | RouteFeatureCollection): RouteFeature | null {
  if (data.type === 'Feature' && data.geometry?.type === 'LineString') {
    return data as RouteFeature
  }
  if (data.type === 'FeatureCollection' && Array.isArray(data.features)) {
    const line = data.features.find(
      (f): f is RouteFeature => f.type === 'Feature' && f.geometry?.type === 'LineString'
    )
    return line ?? null
  }
  return null
}

function boundingRingFromStored(data: RouteFeatureCollection): [number, number][] | undefined {
  if (data.type !== 'FeatureCollection' || !Array.isArray(data.features)) return undefined
  const poly = data.features.find(
    (f): f is PolygonFeature => f.type === 'Feature' && f.geometry?.type === 'Polygon'
  )
  const ring = poly?.geometry?.coordinates?.[0]
  if (!ring || ring.length < 4) return undefined
  return ring as [number, number][]
}

export default defineEventHandler(async () => {
  const baseDir = process.cwd()
  const filePath = join(baseDir, 'dataserve', 'route', 'route.json')
  try {
    const content = await readFile(filePath, 'utf-8')
    const data = JSON.parse(content) as RouteFeature | RouteFeatureCollection
    const line = lineStringFromStored(data)
    if (line?.geometry?.coordinates?.length >= 2) {
      const routeName = [line.properties?.a, line.properties?.b].filter(Boolean).join(' - ')
      const out: {
        id: string
        routeName: string
        coordinates: [number, number][]
        portOrigin: string
        portDestination: string
        boundingRectangle?: [number, number][]
      } = {
        id: 'dataserve',
        routeName: routeName || 'Route dari dataserve',
        coordinates: line.geometry.coordinates,
        portOrigin: line.properties?.a ?? '',
        portDestination: line.properties?.b ?? ''
      }
      if (data.type === 'FeatureCollection') {
        const ring = boundingRingFromStored(data)
        if (ring) out.boundingRectangle = ring
      }
      return out
    }
  } catch {
    // file not found or invalid
  }
  return null
})
