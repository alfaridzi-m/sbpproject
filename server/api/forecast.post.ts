import type { RouteInfo } from '~/composables/useMaritimeData'
import type { ForecastRow } from '~/composables/useMaritimeData'

export default defineEventHandler(async (event) => {
  const body = await readBody<RouteInfo>(event)

  // Placeholder: replace with actual backend integration
  // Returns mock forecast data based on route info
  const rows: ForecastRow[] = Array.from({ length: 5 }, (_, i) => ({
    id: `row-${Date.now()}-${i}`,
    date: '',
    time: '',
    weather: '',
    rr: '',
    wave: '',
    ws: '',
    wd: '',
    aruss: '',
    arusd: '',
    hslg: '',
    hsig: ''
  }))

  return { data: rows }
})
