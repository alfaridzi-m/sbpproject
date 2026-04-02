import type { ForecastRow } from '~/composables/useMaritimeData'

interface SplitPointBody {
  dateTime: string
  coordinate: [number, number]
  fraction: number
}

interface ForecastRequestBody {
  portOrigin?: string
  portDestination?: string
  forecastTimeStep?: number
  timeZone?: string
  splitPoints?: SplitPointBody[]
}

function pad2(n: number) {
  return String(n).padStart(2, '0')
}

function formatCoordinate(lng: number, lat: number): string {
  const latStr = `${Math.abs(lat).toFixed(4)}°${lat >= 0 ? 'N' : 'S'}`
  const lngStr = `${Math.abs(lng).toFixed(4)}°${lng >= 0 ? 'E' : 'W'}`
  return `${latStr}, ${lngStr}`
}

export default defineEventHandler(async (event) => {
  const body = await readBody<ForecastRequestBody>(event)
  const splitPoints = body.splitPoints
  // UTC-only: ignore any incoming timezone label and always use UTC instants.
  const tzOffset = 0

  if (splitPoints && splitPoints.length > 0) {
    const rows: ForecastRow[] = splitPoints.map((sp, i) => {
      const utcMs = new Date(sp.dateTime).getTime()
      const dt = new Date(utcMs + tzOffset * 3600000)

      const [lng, lat] = sp.coordinate

      return {
        id: `row-${Date.now()}-${i}`,
        date: `${pad2(dt.getUTCDate())}/${pad2(dt.getUTCMonth() + 1)}/${String(dt.getUTCFullYear()).slice(-2)}`,
        time: `${pad2(dt.getUTCHours())}:${pad2(dt.getUTCMinutes())}`,
        coordinate: formatCoordinate(lng, lat),
        visibility: '',
        weather: '',
        rr: '',
        wave: '',
        ws: '',
        wd: '',
        aruss: '',
        arusd: '',
        hslg: '',
        hsig: ''
      }
    })

    return { data: rows }
  }

  return { data: [] }
})
