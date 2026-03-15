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

const MOCK_FORECAST: ForecastRow[] = [
  { id: '1', date: '25/02/26', time: '06:00', weather: 'Hujan', rr: '2', wave: '1.4', ws: '10', wd: 'NW', temp: '28', aruss: '0.4', arusd: 'SW', hslg: '1.2', hsig: '1.4' },
  { id: '2', date: '25/02/26', time: '12:00', weather: 'Cerah berawan', rr: '0', wave: '1.2', ws: '6', wd: 'SW', temp: '30', aruss: '0.35', arusd: 'S', hslg: '1.0', hsig: '1.2' },
  { id: '3', date: '25/02/26', time: '18:00', weather: 'Cerah berawan', rr: '0', wave: '1.1', ws: '4', wd: 'S', temp: '29', aruss: '0.3', arusd: 'SW', hslg: '0.9', hsig: '1.1' },
  { id: '4', date: '26/02/26', time: '06:00', weather: 'Hujan', rr: '2', wave: '1.5', ws: '12', wd: 'SW', temp: '27', aruss: '0.45', arusd: 'S', hslg: '1.3', hsig: '1.5' },
  { id: '5', date: '26/02/26', time: '12:00', weather: 'Cerah berawan', rr: '0', wave: '1.3', ws: '7', wd: 'S', temp: '30', aruss: '0.4', arusd: 'SW', hslg: '1.1', hsig: '1.3' },
  { id: '6', date: '26/02/26', time: '18:00', weather: 'Cerah', rr: '0', wave: '1.0', ws: '5', wd: 'SSE', temp: '29', aruss: '0.3', arusd: 'S', hslg: '0.8', hsig: '1.0' },
  { id: '7', date: '27/02/26', time: '06:00', weather: 'Berawan', rr: '0', wave: '1.2', ws: '8', wd: 'SE', temp: '26', aruss: '0.35', arusd: 'S', hslg: '1.0', hsig: '1.2' },
  { id: '8', date: '27/02/26', time: '12:00', weather: 'Cerah berawan', rr: '0', wave: '1.1', ws: '6', wd: 'E', temp: '28', aruss: '0.3', arusd: 'SW', hslg: '0.9', hsig: '1.1' },
  { id: '9', date: '27/02/26', time: '18:00', weather: 'Cerah berawan', rr: '0', wave: '1.0', ws: '4', wd: 'NE', temp: '27', aruss: '0.3', arusd: 'S', hslg: '0.8', hsig: '1.0' },
  { id: '10', date: '28/02/26', time: '06:00', weather: 'Cerah', rr: '0', wave: '1.0', ws: '5', wd: 'N', temp: '27', aruss: '0.3', arusd: 'SW', hslg: '0.8', hsig: '1.0' },
  { id: '11', date: '28/02/26', time: '12:00', weather: 'Cerah berawan', rr: '0', wave: '1.1', ws: '6', wd: 'NE', temp: '29', aruss: '0.35', arusd: 'S', hslg: '0.9', hsig: '1.1' },
  { id: '12', date: '28/02/26', time: '18:00', weather: 'Cerah berawan', rr: '0', wave: '1.0', ws: '7', wd: 'E', temp: '30', aruss: '0.35', arusd: 'S', hslg: '0.8', hsig: '1.0' },
]

const MOCK_SYNOPTIC = `Angin dominan dari selatan bertiup di wilayah prakiraan. Kondisi tekanan rendah di wilayah Darwin, Australia Bagian Utara berpotensi meningkatkan pertumbuhan awan konvektif. Ridge tekanan tinggi di Laut Cina Selatan mendukung kondisi stabil di perairan Kalimantan.`

const MOCK_WARNINGS = `Kecepatan angin melebihi 15 knot. Tinggi gelombang melebihi 1.25 meter`

const MOCK_CYCLONE = `Tidak ada sistem siklon tropis (TC) dan badai tropis (TS) yang aktif.`

const MOCK_DISCLAIMER = `Informasi cuaca BMKG disediakan sebagai panduan teknis dan bukan satu-satunya dasar untuk menentukan keberangkatan kapal, yang tetap berada di bawah wewenang otoritas terkait.`

const MOCK_SAFETY_ADVISORY = `Kondisi berikut berpotensi menimbulkan risiko terhadap keselamatan navigasi:
- Kapal penangkap ikan: kecepatan angin mencapai 15 knot dan tinggi gelombang mencapai 1.25 meter.
- Tongkang: kecepatan angin mencapai 16 knot dan tinggi gelombang mencapai 1.5 meter.
- Kapal feri: kecepatan angin mencapai 21 knot dan tinggi gelombang mencapai 2.5 meter.
- Kapal besar (kargo/kapal pesiar): kecepatan angin mencapai 27 knot dan tinggi gelombang mencapai 4.0 meter.`

export function useMaritimeData() {
  const routeInfo = useState<RouteInfo>('maritime-routeInfo', () => ({
    shipName: 'KM. Dharma Lintas Utama',
    portOrigin: 'Pelabuhan Soekarno Hatta - Makassar',
    portDestination: 'Pelabuhan Batulicin Tanah Bumbu',
    departureDate: '2026-02-24',
    departureTime: '08:00',
    arrivalDate: '2026-02-25',
    arrivalTime: '08:00',
    issuedDate: '2026-02-23',
    issuedTime: '13:00',
    forecaster: 'Herbuana Yoga W.'
  }))

  const forecastData = useState<ForecastRow[]>('maritime-forecastData', () => [...MOCK_FORECAST])
  const synopticInfo = useState('maritime-synopticInfo', () => MOCK_SYNOPTIC)
  const warnings = useState('maritime-warnings', () => MOCK_WARNINGS)
  const cycloneWarning = useState('maritime-cycloneWarning', () => MOCK_CYCLONE)
  const disclaimer = useState('maritime-disclaimer', () => MOCK_DISCLAIMER)
  const safetyAdvisory = useState('maritime-safetyAdvisory', () => MOCK_SAFETY_ADVISORY)
  const pdfTemplate = useState<'rute-pelayaran' | 'wisata-bahari'>('maritime-pdfTemplate', () => 'rute-pelayaran')
  const isLoading = useState('maritime-isLoading', () => false)
  const manualRouteData = useState<{ routeName: string; coordinates: [number, number][] } | null>('maritime-manualRouteData', () => null)

  const ROUTE_STORAGE_KEY = 'spb-maritime-route'

  const availableRoutes = useState<RouteOption[]>('maritime-availableRoutes', () => [])
  const selectedRouteId = useState<string>('maritime-selectedRouteId', () => '')

  function getLocalRouteOption(): RouteOption | null {
    if (!import.meta.client) return null
    try {
      const stored = localStorage.getItem(ROUTE_STORAGE_KEY)
      if (!stored) return null
      const parsed = JSON.parse(stored) as { routeName?: string; coordinates?: [number, number][]; routeInfo?: { portOrigin?: string; portDestination?: string } }
      if (!parsed.coordinates?.length || parsed.coordinates.length < 2) return null
      const origin = parsed.routeInfo?.portOrigin ?? (parsed.routeName?.split('-')[0]?.trim() ?? 'Origin')
      const dest = parsed.routeInfo?.portDestination ?? (parsed.routeName?.split('-')[1]?.trim() ?? 'Destination')
      const label = parsed.routeName || `${origin} - ${dest}`
      return {
        id: 'local',
        label,
        routeName: label,
        coordinates: parsed.coordinates,
        portOrigin: origin,
        portDestination: dest
      }
    } catch {
      return null
    }
  }

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
    const local = getLocalRouteOption()
    if (local && !routes.some(r => r.id === 'local')) {
      routes.push(local)
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
    loadRouteFromStorage()
    fetchAvailableRoutes()
  })

  function loadRouteFromStorage() {
    if (import.meta.client) {
      try {
        const stored = localStorage.getItem(ROUTE_STORAGE_KEY)
        if (stored) {
          const parsed = JSON.parse(stored) as { routeName?: string; coordinates?: [number, number][]; routeInfo?: RouteInfo }
          if (parsed.coordinates && Array.isArray(parsed.coordinates) && parsed.coordinates.length >= 2) {
            manualRouteData.value = {
              routeName: parsed.routeName ?? '',
              coordinates: parsed.coordinates
            }
            if (parsed.routeInfo) {
              routeInfo.value = { ...routeInfo.value, ...parsed.routeInfo }
            }
          }
        }
      } catch {
        // ignore invalid stored data
      }
    }
  }

  async function saveRoute(data: { routeName: string; coordinates: [number, number][] }) {
    const payload = {
      routeName: data.routeName,
      coordinates: data.coordinates,
      savedAt: Date.now(),
      routeInfo: routeInfo.value
    }
    if (import.meta.client) {
      try {
        localStorage.setItem(ROUTE_STORAGE_KEY, JSON.stringify(payload))
      } catch {
        // quota exceeded or private mode
      }
    }
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
    selectedRouteId.value = 'local'
  }

  async function processRoute() {
    isLoading.value = true
    try {
      const response = await $fetch('/api/forecast', {
        method: 'POST',
        body: routeInfo.value
      })
      if (response && Array.isArray((response as { data?: unknown }).data)) {
        forecastData.value = (response as { data: ForecastRow[] }).data
      }
    } catch {
      forecastData.value = [...MOCK_FORECAST]
    } finally {
      isLoading.value = false
    }
  }

  function addForecastRow() {
    forecastData.value.push({
      id: `row-${Date.now()}`,
      date: '',
      time: '',
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

  return {
    routeInfo,
    manualRouteData,
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
    processRoute,
    addForecastRow,
    saveRoute,
    fetchAvailableRoutes,
    selectRouteById
  }
}
