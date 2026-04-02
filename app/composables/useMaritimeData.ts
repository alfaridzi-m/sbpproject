export interface RouteInfo {
  shipName: string
  portOrigin: string
  portDestination: string
  departureDate: string
  departureTime: string
  arrivalDate: string
  arrivalTime: string
  issuedDate: string
  issuedTime: string
  forecaster: string
  namaUpt: string
  alamat: string
  telp: string
  email: string
}

export interface ForecastRow {
  id: string
  date: string
  time: string
  coordinate: string
  visibility: string
  weather: string
  rr: string
  wave: string
  ws: string
  wd: string
  temp?: string
  aruss: string
  arusd: string
  hslg: string
  hsig: string
}

export interface PortForecast {
  portOrigin: string
  portDestination: string
}

export interface RouteOption {
  id: string
  label: string
  routeName: string
  coordinates: [number, number][]
  portOrigin: string
  portDestination: string
  /** GeoJSON Polygon outer ring [lng, lat] × 5 (closed), from manual modal rectangle */
  boundingRectangle?: [number, number][]
}

export interface SplitPoint {
  dateTime: string
  coordinate: [number, number]
  fraction: number
}

/** Met-ocean payload on forecast output features (dummy GeoJSON / future API). */
export interface ForecastOutputMetOcean {
  gust_knot?: number
  visibility_km?: number
  wind_speed_knot?: number
  wind_dir_str?: string
  weather?: string
  current_speed_cms?: number
  wave_height_m?: number
  wind_dir_deg?: number
  current_dir_deg?: number
  current_dir_str?: string
}

export interface ForecastOutputFeatureProperties {
  dateTime: string
  index: number
  fraction: number
  metOcean?: ForecastOutputMetOcean
}

/** Extended FeatureCollection returned by the forecast API. */
export interface ForecastOutputGeoJSON {
  type: 'FeatureCollection'
  forecastTimeStepHours?: number
  timeZone?: string
  dateTimeReference?: string
  features: Array<{
    type: 'Feature'
    geometry: { type: 'Point'; coordinates: [number, number] }
    properties: ForecastOutputFeatureProperties
  }>
}

/** GeoJSON forecast request: points along route at each time step with ISO datetimes. */
export interface ForecastReqGeoJSON {
  type: 'FeatureCollection'
  /** Hours between samples (1, 3, or 6); foreign member for app use. */
  forecastTimeStepHours: number
  /**
   * GeoJSON request is UTC-only. `timeZone` is always `UTC` and feature `dateTime`
   * values are ISO 8601 instants in UTC (Zulu) — see `dateTimeReference`.
   * Feature `dateTime` values are always UTC — see `dateTimeReference`.
   */
  timeZone: string
  /** All feature `properties.dateTime` strings are ISO 8601 in UTC (Zulu). */
  dateTimeReference: 'UTC'
  features: ForecastReqFeature[]
  /** AOI from manual route modal (drag rectangle); GeoJSON Polygon outer ring. */
  boundingPolygon?: {
    type: 'Polygon'
    coordinates: [number, number][][]
  }
}

export interface ForecastReqFeature {
  type: 'Feature'
  geometry: {
    type: 'Point'
    /** GeoJSON order: [longitude, latitude] */
    coordinates: [number, number]
  }
  properties: {
    /** ISO 8601 instant in UTC only (e.g. ends with `Z`). */
    dateTime: string
    /** Position along route by distance (0 = departure, 1 = arrival) */
    fraction: number
    /** Order along the voyage (0-based) */
    index: number
  }
}

/** Canonical ISO 8601 UTC string (`…Z`) for GeoJSON export. */
function toUtcIsoString(instant: Date | number): string {
  return new Date(instant).toISOString()
}

/** Re-parse any ISO-like string and emit canonical UTC `…Z` (defensive). */
function normalizeFeatureDateTimeUtc(isoLike: string): string {
  const ms = Date.parse(isoLike)
  return Number.isFinite(ms) ? new Date(ms).toISOString() : isoLike
}

function splitPointsToForecastReqGeoJSON(
  splitPoints: SplitPoint[],
  forecastTimeStepHours: number,
  timeZone: string
): ForecastReqGeoJSON {
  return {
    type: 'FeatureCollection',
    forecastTimeStepHours,
    timeZone,
    dateTimeReference: 'UTC',
    features: splitPoints.map((sp, index) => {
      const [lng, lat] = sp.coordinate
      return {
        type: 'Feature' as const,
        geometry: {
          type: 'Point' as const,
          coordinates: [lng, lat] as [number, number]
        },
        properties: {
          dateTime: normalizeFeatureDateTimeUtc(sp.dateTime),
          fraction: sp.fraction,
          index
        }
      }
    })
  }
}

const KNOT_TO_MS = 0.514444

function pad2(n: number) {
  return String(n).padStart(2, '0')
}

function formatCoordinateLngLat(lng: number, lat: number): string {
  const latStr = `${Math.abs(lat).toFixed(4)}°${lat >= 0 ? 'N' : 'S'}`
  const lngStr = `${Math.abs(lng).toFixed(4)}°${lng >= 0 ? 'E' : 'W'}`
  return `${latStr}, ${lngStr}`
}

function metOceanForFeatureIndex(
  features: ForecastOutputGeoJSON['features'],
  i: number
): ForecastOutputMetOcean | undefined {
  if (!features.length) return undefined
  const f = features[i] ?? features[features.length - 1]
  return f?.properties.metOcean
}

function forecastRowsFromSplitPointsAndGeo(
  splitPoints: SplitPoint[],
  geo: ForecastOutputGeoJSON
): ForecastRow[] {
  const features = geo.features ?? []
  const t0 = Date.now()
  return splitPoints.map((sp, i) => {
    const utcMs = new Date(sp.dateTime).getTime()
    const dt = new Date(utcMs)
    const [lng, lat] = sp.coordinate
    const met = metOceanForFeatureIndex(features, i)

    const fmt = (n: number, decimals: number) => Number(n.toFixed(decimals))

    return {
      id: `row-${t0}-${i}`,
      date: `${pad2(dt.getUTCDate())}/${pad2(dt.getUTCMonth() + 1)}/${String(dt.getUTCFullYear()).slice(-2)}`,
      time: `${pad2(dt.getUTCHours())}:${pad2(dt.getUTCMinutes())}`,
      coordinate: formatCoordinateLngLat(lng, lat),
      visibility: met?.visibility_km != null ? String(fmt(met.visibility_km, 1)) : '',
      weather: met?.weather ?? '',
      rr: '',
      wave: met?.wave_height_m != null ? String(fmt(met.wave_height_m, 2)) : '',
      ws: met?.wind_speed_knot != null ? String(fmt(met.wind_speed_knot * KNOT_TO_MS, 1)) : '',
      wd: met?.wind_dir_deg != null ? String(Math.round(met.wind_dir_deg)) : (met?.wind_dir_str ?? ''),
      aruss: met?.current_speed_cms != null ? String(fmt(met.current_speed_cms / 100, 2)) : '',
      arusd: met?.current_dir_deg != null ? String(Math.round(met.current_dir_deg)) : '',
      hslg: '',
      hsig: met?.wave_height_m != null ? String(fmt(met.wave_height_m, 2)) : ''
    }
  })
}

function haversineDistanceNm(a: [number, number], b: [number, number]): number {
  const [lng1, lat1] = a
  const [lng2, lat2] = b
  const R = 6371e3
  const toRad = (deg: number) => deg * Math.PI / 180
  const phi1 = toRad(lat1)
  const phi2 = toRad(lat2)
  const dPhi = toRad(lat2 - lat1)
  const dLambda = toRad(lng2 - lng1)
  const sinDphi = Math.sin(dPhi / 2)
  const sinDlambda = Math.sin(dLambda / 2)
  const h = sinDphi * sinDphi + Math.cos(phi1) * Math.cos(phi2) * sinDlambda * sinDlambda
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h))
  return R * c / 1852
}

function interpolateAlongRoute(
  coordinates: [number, number][],
  fraction: number
): [number, number] {
  if (coordinates.length === 0) return [0, 0]
  if (fraction <= 0 || coordinates.length === 1) return coordinates[0]!
  if (fraction >= 1) return coordinates[coordinates.length - 1]!

  const cumulDist: number[] = [0]
  for (let i = 1; i < coordinates.length; i++) {
    cumulDist.push(cumulDist[i - 1]! + haversineDistanceNm(coordinates[i - 1]!, coordinates[i]!))
  }
  const totalDist = cumulDist[cumulDist.length - 1]!
  if (totalDist === 0) return coordinates[0]!

  const targetDist = fraction * totalDist
  for (let i = 1; i < cumulDist.length; i++) {
    if (cumulDist[i]! >= targetDist) {
      const segStart = cumulDist[i - 1]!
      const segLen = cumulDist[i]! - segStart
      const segFrac = segLen === 0 ? 0 : (targetDist - segStart) / segLen
      const [lng1, lat1] = coordinates[i - 1]!
      const [lng2, lat2] = coordinates[i]!
      return [
        lng1 + segFrac * (lng2 - lng1),
        lat1 + segFrac * (lat2 - lat1)
      ]
    }
  }
  return coordinates[coordinates.length - 1]!
}

function parseDateTimeToUtc(dateStr: string, timeStr: string): Date | null {
  if (!dateStr || !timeStr) return null
  const dp = dateStr.split('-').map(Number)
  const tp = timeStr.split(':').map(Number)
  if (dp.length < 3 || tp.length < 2) return null
  const [y, m, d] = dp as [number, number, number]
  const [hh, mm] = tp as [number, number]
  if ([y, m, d, hh, mm].some(n => !Number.isFinite(n))) return null
  // Interpret app inputs as UTC (not local time).
  return new Date(Date.UTC(y, m - 1, d, hh, mm, 0))
}

function computeSplitPoints(
  coordinates: [number, number][],
  departureDateStr: string,
  departureTimeStr: string,
  arrivalDateStr: string,
  arrivalTimeStr: string,
  stepHours: number
): SplitPoint[] {
  const dep = parseDateTimeToUtc(departureDateStr, departureTimeStr)
  const arr = parseDateTimeToUtc(arrivalDateStr, arrivalTimeStr)
  if (!dep || !arr || coordinates.length < 2) return []

  const totalMs = arr.getTime() - dep.getTime()
  if (totalMs <= 0) return []

  const stepMs = stepHours * 3600000
  const points: SplitPoint[] = []

  for (let elapsed = 0; elapsed <= totalMs; elapsed += stepMs) {
    const fraction = elapsed / totalMs
    const t = dep.getTime() + elapsed
    points.push({
      dateTime: toUtcIsoString(t),
      coordinate: interpolateAlongRoute(coordinates, fraction),
      fraction
    })
  }

  const last = points[points.length - 1]
  if (last && new Date(last.dateTime).getTime() < arr.getTime()) {
    points.push({
      dateTime: toUtcIsoString(arr),
      coordinate: interpolateAlongRoute(coordinates, 1),
      fraction: 1
    })
  }

  return points
}

export function useMaritimeData() {
  const routeInfo = useState<RouteInfo>('maritime-routeInfo', () => ({
    shipName: '',
    portOrigin: '',
    portDestination: '',
    departureDate: '',
    departureTime: '',
    arrivalDate: '',
    arrivalTime: '',
    issuedDate: '',
    issuedTime: '',
    forecaster: '',
    namaUpt: '',
    alamat: '',
    telp: '',
    email: ''
  }))

  const forecastData = useState<ForecastRow[]>('maritime-forecastData', () => [])
  const synopticInfo = useState('maritime-synopticInfo', () => 'Angin dominan timur hingga tenggara bertiup di sepanjang rute pelayaran dengan kondisi atmosfer relatif labil pada sore hingga malam hari. Pertumbuhan awan konvektif berpotensi terjadi lokal dan dapat menurunkan jarak pandang sementara, terutama saat hujan ringan hingga sedang.')
  const warnings = useState('maritime-warnings', () => 'Waspada peningkatan angin > 15 knot dan tinggi gelombang > 1.25 m pada periode tertentu.')
  const cycloneWarning = useState('maritime-cycloneWarning', () => 'Tidak terdeteksi aktivitas siklon tropis aktif di wilayah pemantauan.')
  const disclaimer = useState('maritime-disclaimer', () => 'BMKG weather information is provided as technical guidance and is not the sole basis for determining vessel departure, which remains under the authority of the relevant authorities')
  const safetyAdvisory = useState('maritime-safetyAdvisory', () => '')
  const pdfTemplate = useState<'rute-pelayaran' | 'wisata-bahari'>('maritime-pdfTemplate', () => 'rute-pelayaran')
  const isLoading = useState('maritime-isLoading', () => false)
  const processError = useState<string | null>('maritime-processError', () => null)
  const manualRouteData = useState<{
    routeName: string
    coordinates: [number, number][]
    boundingRectangle?: [number, number][]
  } | null>('maritime-manualRouteData', () => null)
  const forecastTimeStep = useState<1 | 3 | 6>('maritime-forecastTimeStep', () => 1)
  // UTC-only: inputs, computed times, and all GeoJSON timestamps are in UTC.
  const timeZone = useState<'UTC'>('maritime-timeZone', () => 'UTC')

  const selectedStation = useState<string>('maritime-selectedStation', () => 'Stasiun Maritim Bitung')
  const availableRoutes = useState<RouteOption[]>('maritime-availableRoutes', () => [])
  const selectedRouteId = useState<string>('maritime-selectedRouteId', () => '')

  async function fetchAvailableRoutes() {
    const routes: RouteOption[] = []
    try {
      const res = await $fetch<{
        id: string
        routeName: string
        coordinates: [number, number][]
        portOrigin: string
        portDestination: string
        boundingRectangle?: [number, number][]
      } | null>('/api/route')
      if (res) {
        routes.push({
          id: res.id,
          label: res.routeName,
          routeName: res.routeName,
          coordinates: res.coordinates,
          portOrigin: res.portOrigin,
          portDestination: res.portDestination,
          ...(res.boundingRectangle?.length ? { boundingRectangle: res.boundingRectangle } : {})
        })
      }
    } catch {
      // dataserve may be empty or missing
    }
    availableRoutes.value = routes
    const first = routes[0]
    if (first && !selectedRouteId.value) {
      selectedRouteId.value = first.id
      applyRoute(first)
    }
  }

  function applyRoute(route: RouteOption) {
    manualRouteData.value = {
      routeName: route.label,
      coordinates: route.coordinates,
      ...(route.boundingRectangle?.length ? { boundingRectangle: route.boundingRectangle } : {})
    }
    routeInfo.value.portOrigin = route.portOrigin
    routeInfo.value.portDestination = route.portDestination
  }

  function selectRouteById(id: string) {
    const route = availableRoutes.value.find(r => r.id === id)
    if (route) {
      selectedRouteId.value = id
      applyRoute(route)
    }
  }

  onMounted(() => {
    fetchAvailableRoutes()
  })

  async function saveRoute(data: {
    routeName: string
    coordinates: [number, number][]
    boundingRectangle?: [number, number][]
  }) {
    try {
      await $fetch('/api/route', {
        method: 'POST',
        body: {
          routeName: data.routeName,
          coordinates: data.coordinates,
          portOrigin: routeInfo.value.portOrigin,
          portDestination: routeInfo.value.portDestination,
          ...(data.boundingRectangle?.length ? { boundingRectangle: data.boundingRectangle } : {})
        }
      })
    } catch (err) {
      console.warn('Failed to save route to dataserve:', err)
    }
    await fetchAvailableRoutes()
    selectedRouteId.value = 'dataserve'
  }

  async function processRoute() {
    isLoading.value = true
    processError.value = null
    try {
      const coords = manualRouteData.value?.coordinates
      if (!coords || coords.length < 2) {
        forecastData.value = []
        return
      }

      const splitPoints = computeSplitPoints(
        coords,
        routeInfo.value.departureDate,
        routeInfo.value.departureTime,
        routeInfo.value.arrivalDate,
        routeInfo.value.arrivalTime,
        forecastTimeStep.value
      )

      const geoJsonBody = forecastReq.value

      const response = await $fetch<ForecastOutputGeoJSON>('/api/forecast-proxy', {
        method: 'POST',
        body: geoJsonBody
      })

      if (
        response?.type === 'FeatureCollection'
        && Array.isArray(response.features)
        && response.features.length > 0
      ) {
        forecastData.value = forecastRowsFromSplitPointsAndGeo(
          splitPoints,
          response
        )
      } else {
        forecastData.value = []
      }
    } catch (err: unknown) {
      forecastData.value = []
      const msg = (err as { statusMessage?: string }).statusMessage
        ?? (err as { message?: string }).message
        ?? 'Gagal memproses forecast'
      processError.value = msg
    } finally {
      isLoading.value = false
    }
  }

  function addForecastRow() {
    forecastData.value.push({
      id: `row-${Date.now()}`,
      date: '',
      time: '',
      coordinate: '',
      visibility: '',
      weather: '',
      rr: '',
      wave: '',
      ws: '',
      wd: '',
      temp: '',
      aruss: '',
      arusd: '',
      hslg: '',
      hsig: ''
    })
  }

  const splitPointCoordinates = computed<[number, number][]>(() => {
    const coords = manualRouteData.value?.coordinates
    if (!coords || coords.length < 2) return []

    const points = computeSplitPoints(
      coords,
      routeInfo.value.departureDate,
      routeInfo.value.departureTime,
      routeInfo.value.arrivalDate,
      routeInfo.value.arrivalTime,
      forecastTimeStep.value
    )

    return points.map(p => p.coordinate)
  })

  /** GeoJSON FeatureCollection: one Point per forecast time step with dateTime + coordinates. */
  const forecastReq = computed<ForecastReqGeoJSON>(() => {
    const coords = manualRouteData.value?.coordinates
    if (!coords || coords.length < 2) {
      return {
        type: 'FeatureCollection',
        forecastTimeStepHours: forecastTimeStep.value,
        timeZone: timeZone.value,
        dateTimeReference: 'UTC',
        features: []
      }
    }

    const splitPoints = computeSplitPoints(
      coords,
      routeInfo.value.departureDate,
      routeInfo.value.departureTime,
      routeInfo.value.arrivalDate,
      routeInfo.value.arrivalTime,
      forecastTimeStep.value
    )

    const base = splitPointsToForecastReqGeoJSON(
      splitPoints,
      forecastTimeStep.value,
      timeZone.value
    )
    const ring = manualRouteData.value?.boundingRectangle
    if (ring && ring.length >= 4) {
      return {
        ...base,
        boundingPolygon: {
          type: 'Polygon' as const,
          coordinates: [ring]
        }
      }
    }
    return base
  })

  return {
    routeInfo,
    manualRouteData,
    selectedStation,
    availableRoutes,
    selectedRouteId,
    forecastData,
    synopticInfo,
    warnings,
    cycloneWarning,
    disclaimer,
    safetyAdvisory,
    pdfTemplate,
    isLoading,
    processError,
    forecastTimeStep,
    timeZone,
    splitPointCoordinates,
    forecastReq,
    processRoute,
    addForecastRow,
    saveRoute,
    fetchAvailableRoutes,
    selectRouteById
  }
}
