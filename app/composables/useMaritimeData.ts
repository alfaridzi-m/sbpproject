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
}

export interface SplitPoint {
  dateTime: string
  coordinate: [number, number]
  fraction: number
}

const TZ_OFFSETS: Record<string, number> = { WIB: 7, WITA: 8, WIT: 9, UTC: 0 }

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

function parseDateTimeToUtc(dateStr: string, timeStr: string, tz: string): Date | null {
  if (!dateStr || !timeStr) return null
  const dp = dateStr.split('-').map(Number)
  const tp = timeStr.split(':').map(Number)
  if (dp.length < 3 || tp.length < 2) return null
  const [y, m, d] = dp as [number, number, number]
  const [hh, mm] = tp as [number, number]
  if ([y, m, d, hh, mm].some(n => !Number.isFinite(n))) return null
  const offset = TZ_OFFSETS[tz] ?? 0
  return new Date(Date.UTC(y, m - 1, d, hh, mm, 0) - offset * 3600000)
}

function computeSplitPoints(
  coordinates: [number, number][],
  departureDateStr: string,
  departureTimeStr: string,
  arrivalDateStr: string,
  arrivalTimeStr: string,
  stepHours: number,
  tz: string
): SplitPoint[] {
  const dep = parseDateTimeToUtc(departureDateStr, departureTimeStr, tz)
  const arr = parseDateTimeToUtc(arrivalDateStr, arrivalTimeStr, tz)
  if (!dep || !arr || coordinates.length < 2) return []

  const totalMs = arr.getTime() - dep.getTime()
  if (totalMs <= 0) return []

  const stepMs = stepHours * 3600000
  const points: SplitPoint[] = []

  for (let elapsed = 0; elapsed <= totalMs; elapsed += stepMs) {
    const fraction = elapsed / totalMs
    const dt = new Date(dep.getTime() + elapsed)
    points.push({
      dateTime: dt.toISOString(),
      coordinate: interpolateAlongRoute(coordinates, fraction),
      fraction
    })
  }

  const last = points[points.length - 1]
  if (last && new Date(last.dateTime).getTime() < arr.getTime()) {
    points.push({
      dateTime: arr.toISOString(),
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
    forecaster: ''
  }))

  const forecastData = useState<ForecastRow[]>('maritime-forecastData', () => [])
  const synopticInfo = useState('maritime-synopticInfo', () => 'Angin dominan timur hingga tenggara bertiup di sepanjang rute pelayaran dengan kondisi atmosfer relatif labil pada sore hingga malam hari. Pertumbuhan awan konvektif berpotensi terjadi lokal dan dapat menurunkan jarak pandang sementara, terutama saat hujan ringan hingga sedang.')
  const warnings = useState('maritime-warnings', () => 'Waspada peningkatan angin > 15 knot dan tinggi gelombang > 1.25 m pada periode tertentu.')
  const cycloneWarning = useState('maritime-cycloneWarning', () => 'Tidak terdeteksi aktivitas siklon tropis aktif di wilayah pemantauan.')
  const disclaimer = useState('maritime-disclaimer', () => 'BMKG weather information is provided as technical guidance and is not the sole basis for determining vessel departure, which remains under the authority of the relevant authorities')
  const safetyAdvisory = useState('maritime-safetyAdvisory', () => '')
  const pdfTemplate = useState<'rute-pelayaran' | 'wisata-bahari'>('maritime-pdfTemplate', () => 'rute-pelayaran')
  const isLoading = useState('maritime-isLoading', () => false)
  const manualRouteData = useState<{ routeName: string; coordinates: [number, number][] } | null>('maritime-manualRouteData', () => null)
  const forecastTimeStep = useState<1 | 3 | 6>('maritime-forecastTimeStep', () => 1)
  const timeZone = useState<'WIB' | 'WITA' | 'WIT' | 'UTC'>('maritime-timeZone', () => 'WIB')

  const selectedStation = useState<string>('maritime-selectedStation', () => 'Stasiun Maritim Bitung')
  const availableRoutes = useState<RouteOption[]>('maritime-availableRoutes', () => [])
  const selectedRouteId = useState<string>('maritime-selectedRouteId', () => '')

  async function fetchAvailableRoutes() {
    const routes: RouteOption[] = []
    try {
      const res = await $fetch<{ id: string; routeName: string; coordinates: [number, number][]; portOrigin: string; portDestination: string } | null>('/api/route')
      if (res) {
        routes.push({
          id: res.id,
          label: res.routeName,
          routeName: res.routeName,
          coordinates: res.coordinates,
          portOrigin: res.portOrigin,
          portDestination: res.portDestination
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
    manualRouteData.value = { routeName: route.label, coordinates: route.coordinates }
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

  async function saveRoute(data: { routeName: string; coordinates: [number, number][] }) {
    try {
      await $fetch('/api/route', {
        method: 'POST',
        body: {
          routeName: data.routeName,
          coordinates: data.coordinates,
          portOrigin: routeInfo.value.portOrigin,
          portDestination: routeInfo.value.portDestination
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
        forecastTimeStep.value,
        timeZone.value
      )

      const response = await $fetch('/api/forecast', {
        method: 'POST',
        body: {
          ...routeInfo.value,
          forecastTimeStep: forecastTimeStep.value,
          timeZone: timeZone.value,
          splitPoints
        }
      })
      if (response && Array.isArray((response as { data?: unknown }).data)) {
        forecastData.value = (response as { data: ForecastRow[] }).data
      }
    } catch {
      forecastData.value = []
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
      forecastTimeStep.value,
      timeZone.value
    )

    return points.map(p => p.coordinate)
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
    forecastTimeStep,
    timeZone,
    splitPointCoordinates,
    processRoute,
    addForecastRow,
    saveRoute,
    fetchAvailableRoutes,
    selectRouteById
  }
}
