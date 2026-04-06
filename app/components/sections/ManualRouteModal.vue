<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="fixed inset-0 flex items-center justify-center z-[1000] p-4 bg-black/50 backdrop-blur-[2px]"
      @click.self="close"
    >
      <div class="bg-[var(--surface)] rounded-xl shadow-[var(--shadow-card)] border border-[var(--border)] w-[80vw] h-[90vh] max-w-[80vw] max-h-[90vh] overflow-y-auto flex flex-col">
        <div class="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
          <h2 class="text-lg font-semibold m-0">Buat Rute Secara Manual</h2>
          <button
            type="button"
            class="bg-transparent border-none text-2xl cursor-pointer text-[var(--text-muted)] leading-none p-1 hover:text-[var(--text)]"
            aria-label="Tutup"
            @click="close"
          >
            ×
          </button>
        </div>
        <form
          class="p-5"
          @submit.prevent="submit"
        >
          <div class="mb-4">
            <label for="route-name" class="block text-sm font-medium text-[var(--text)]">Nama Rute</label>
            <input
              id="route-name"
              v-model="routeName"
              type="text"
              class="w-full mt-1 px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--surface)] shadow-[var(--shadow-sm)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-ring)]"
              placeholder="Contoh: Makassar - Batulicin"
            />
          </div>
          <div class="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="route-from" class="block text-sm font-medium text-[var(--text)]">Dari (From)</label>
              <input
                id="route-from"
                v-model="fromPort"
                type="text"
                class="w-full mt-1 px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--surface)] shadow-[var(--shadow-sm)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-ring)]"
                placeholder="Nama pelabuhan asal"
              />
            </div>
            <div>
              <label for="route-to" class="block text-sm font-medium text-[var(--text)]">Ke (To)</label>
              <input
                id="route-to"
                v-model="toPort"
                type="text"
                class="w-full mt-1 px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--surface)] shadow-[var(--shadow-sm)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-ring)]"
                placeholder="Nama pelabuhan tujuan"
              />
            </div>
          </div>
          <div class="mb-4">
            <div class="flex flex-col gap-1 mb-2">
              <span class="text-sm font-medium text-[var(--text)]">Gambar rute di peta</span>
              <span class="text-xs text-[var(--text-muted)]">{{ toolHints[activeTool] }}</span>
            </div>
            <div class="relative rounded-lg overflow-hidden border border-[var(--border)]">
              <ClientOnly>
                <div
                  ref="mapEl"
                  class="w-full h-[55vh] min-h-[400px] rounded-lg overflow-hidden border border-[var(--border)]"
                  :class="{
                    'cursor-default': activeTool === 'pick',
                    'cursor-crosshair': activeTool === 'draw' || activeTool === 'rectangle'
                  }"
                />
                <template #fallback>
                  <div class="h-[55vh] min-h-[400px] flex items-center justify-center text-[var(--text-muted)] text-sm bg-[var(--surface-hover)] border-2 border-dashed border-[var(--border)] rounded-lg">
                    Memuat peta...
                  </div>
                </template>
              </ClientOnly>
              <div
                class="absolute top-3 left-3 z-[500] flex items-center gap-0.5 rounded-xl border border-[var(--toolbar-border)] bg-[var(--toolbar-bg)] p-1 pl-2 shadow-[var(--shadow-md)] backdrop-blur-[1px]"
                role="toolbar"
                aria-label="Alat gambar peta"
              >
                <span
                  class="mr-1 h-6 w-px shrink-0 self-center rounded-full bg-[var(--border)]"
                  aria-hidden="true"
                />
                <button
                  type="button"
                  class="map-tool-btn relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-transparent bg-[var(--surface)] text-[var(--text)] transition-colors duration-150 hover:bg-[var(--toolbar-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-ring)]"
                  :class="toolBtnActiveClass('pick')"
                  title="Pick / Geser Titik (1)"
                  aria-label="Pick untuk geser titik"
                  :aria-pressed="activeTool === 'pick'"
                  @click="activeTool = 'pick'"
                >
                  <svg
                    class="pointer-events-none h-[18px] w-[18px]"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M6 3l12 9-5 1 2 7-3-2-2-5-4 2V3z" />
                  </svg>
                  <span
                    class="pointer-events-none absolute bottom-0 right-0.5 text-[10px] font-bold leading-none tabular-nums"
                    :class="activeTool === 'pick' ? 'text-[var(--primary)]' : 'text-[var(--text-muted)]'"
                  >1</span>
                </button>
                <button
                  type="button"
                  class="map-tool-btn relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-transparent bg-[var(--surface)] text-[var(--text)] transition-colors duration-150 hover:bg-[var(--toolbar-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-ring)]"
                  :class="toolBtnActiveClass('draw')"
                  title="Pencil / Tambah Garis (2)"
                  aria-label="Pencil untuk tambah garis rute"
                  :aria-pressed="activeTool === 'draw'"
                  @click="activeTool = 'draw'"
                >
                  <svg
                    class="pointer-events-none h-[18px] w-[18px]"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fill="currentColor"
                      d="M5.2 3.2 18.5 12.8 14.1 15.2l2.1 7.6-2.4-8.8L5.2 3.2z"
                    />
                  </svg>
                  <span
                    class="pointer-events-none absolute bottom-0 right-0.5 text-[10px] font-bold leading-none tabular-nums"
                    :class="activeTool === 'draw' ? 'text-[var(--primary)]' : 'text-[var(--text-muted)]'"
                  >2</span>
                </button>
                <button
                  type="button"
                  class="map-tool-btn relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-transparent bg-[var(--surface)] text-[var(--text)] transition-colors duration-150 hover:bg-[var(--toolbar-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-ring)]"
                  :class="toolBtnActiveClass('rectangle')"
                  title="Persegi AOI (3)"
                  aria-label="Gambar persegi area"
                  :aria-pressed="activeTool === 'rectangle'"
                  @click="activeTool = 'rectangle'"
                >
                  <svg
                    class="pointer-events-none h-[18px] w-[18px]"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                  >
                    <rect x="5" y="5" width="14" height="14" rx="2.5" ry="2.5" />
                  </svg>
                  <span
                    class="pointer-events-none absolute bottom-0 right-0.5 text-[10px] font-bold leading-none tabular-nums"
                    :class="activeTool === 'rectangle' ? 'text-[var(--primary)]' : 'text-[var(--text-muted)]'"
                  >3</span>
                </button>
              </div>
            </div>
            <div class="flex items-center gap-2 mt-2 flex-wrap">
              <button
                type="button"
                class="px-3 py-1.5 rounded-md text-[13px] font-medium cursor-pointer bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] hover:bg-[var(--surface-hover)] disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="coordinates.length === 0"
                title="Hapus titik terakhir"
                @click="removeLastPoint"
              >
                Undo
              </button>
              <button
                type="button"
                class="px-3 py-1.5 rounded-md text-[13px] font-medium cursor-pointer bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] hover:bg-[var(--surface-hover)] disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="coordinates.length === 0"
                title="Hapus semua titik"
                @click="clearLineOnly"
              >
                Hapus Semua
              </button>
              <button
                type="button"
                class="px-3 py-1.5 rounded-md text-[13px] font-medium cursor-pointer bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] hover:bg-[var(--surface-hover)] disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="!boundingRectangle"
                title="Hapus persegi AOI"
                @click="clearRectangle"
              >
                Hapus persegi
              </button>
              <span
                v-if="coordinates.length > 0"
                class="text-xs text-[var(--text-muted)]"
              >
                {{ coordinates.length }} titik
              </span>
              <span
                v-if="boundingRectangle"
                class="text-xs text-[var(--text-muted)]"
              >
                AOI tersimpan
              </span>
            </div>
            <p
              v-if="boundaryWarning"
              class="mt-2 rounded-md border border-[var(--warning-border)] bg-[var(--warning-bg)] px-3 py-2 text-xs text-[var(--warning-text)]"
              role="alert"
            >
              {{ boundaryWarning }}
            </p>
          </div>
          <div class="flex gap-3 justify-end mt-6 pt-4 border-t border-[var(--border)]">
            <button
              type="button"
              class="px-4 py-2 rounded-md text-sm font-medium cursor-pointer bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] hover:bg-[var(--surface-hover)]"
              @click="close"
            >
              Batal
            </button>
            <button
              type="submit"
              class="px-4 py-2 rounded-lg text-sm font-medium cursor-pointer bg-[var(--primary)] text-[var(--color-white)] border-none shadow-[var(--shadow-md)] hover:opacity-95 hover:shadow-[0_6px_20px_var(--primary-glow)] disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none"
              :disabled="coordinates.length < 2"
            >
              Simpan Rute
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import type L from 'leaflet'
import 'leaflet/dist/leaflet.css'

export interface ManualRouteData {
  routeName: string
  coordinates: [number, number][]
  /** Port names used to populate geojson properties `a` (origin) and `b` (destination). */
  from?: string
  to?: string
  /** GeoJSON Polygon outer ring [lng, lat] (closed); included in forecast GeoJSON request */
  boundingRectangle?: [number, number][]
}

const modelValue = defineModel<boolean>({ default: false })

const emit = defineEmits<{
  submit: [data: ManualRouteData]
}>()

type ToolMode = 'pick' | 'draw' | 'rectangle'
type MapViewState = {
  center: [number, number]
  zoom: number
}

function toolBtnActiveClass(tool: ToolMode) {
  return activeTool.value === tool
    ? 'border-[color-mix(in_srgb,var(--primary)_35%,var(--border)_65%)] bg-[color-mix(in_srgb,var(--primary)_16%,var(--surface)_84%)] text-[var(--primary)] shadow-[0_1px_2px_rgba(0,0,0,0.06)]'
    : ''
}

const mapEl = ref<HTMLElement | null>(null)
const routeName = ref('')
const fromPort = ref('')
const toPort = ref('')
const coordinates = ref<[number, number][]>([])
const activeTool = ref<ToolMode>('draw')
/** Closed outer ring for GeoJSON Polygon (from drag-rectangle tool) */
const boundingRectangle = ref<[number, number][] | null>(null)
const boundaryWarning = ref('')

const BOUNDARY_LIMITS = {
  minLng: 90,
  maxLng: 145,
  minLat: -15,
  maxLat: 15
} as const

const toolHints: Record<ToolMode, string> = {
  pick: 'Pilih mode cursor untuk geser titik koordinat (pintasan 1)',
  draw: 'Pilih mode pencil untuk menambah titik/garis rute (pintasan 2)',
  rectangle: 'Klik kiri + seret untuk persegi AOI 1:1; tombol tengah mouse untuk pan; pintasan 3'
}

let map: L.Map | null = null
let polyline: L.Polyline | null = null
const markers: L.Marker[] = []
let Leaflet: typeof L | null = null
let baseTileLayer: L.TileLayer | null = null
let tileSourceIndex = 0
let tileErrorCount = 0
let tileLoadCount = 0
let tileWatchdogTimer: ReturnType<typeof setTimeout> | null = null
let mapClickHandler: ((e: L.LeafletMouseEvent) => void) | null = null
let rectPreview: L.Rectangle | null = null
let rectFinal: L.Rectangle | null = null
let boundaryRect: L.Rectangle | null = null
let rectDragAnchor: L.LatLng | null = null
let rectLastLatLng: L.LatLng | null = null
let middlePanActive = false
let middlePanLastPoint: L.Point | null = null
let mapResizeObserver: ResizeObserver | null = null
let boundaryWarningTimer: ReturnType<typeof setTimeout> | null = null

function showBoundaryWarning(message = 'Gambar garis/persegi harus berada di area 90°E - 145°E dan 15°S - 15°N.') {
  boundaryWarning.value = message
  if (boundaryWarningTimer) clearTimeout(boundaryWarningTimer)
  boundaryWarningTimer = setTimeout(() => {
    boundaryWarning.value = ''
  }, 3000)
}

function clearBoundaryWarning() {
  boundaryWarning.value = ''
  if (!boundaryWarningTimer) return
  clearTimeout(boundaryWarningTimer)
  boundaryWarningTimer = null
}

function isPointInsideBoundary(lng: number, lat: number) {
  return lng >= BOUNDARY_LIMITS.minLng
    && lng <= BOUNDARY_LIMITS.maxLng
    && lat >= BOUNDARY_LIMITS.minLat
    && lat <= BOUNDARY_LIMITS.maxLat
}

function isBoundsInsideBoundary(bounds: L.LatLngBounds) {
  const sw = bounds.getSouthWest()
  const ne = bounds.getNorthEast()
  return isPointInsideBoundary(sw.lng, sw.lat) && isPointInsideBoundary(ne.lng, ne.lat)
}

function drawBoundaryOverlay(Lmod: typeof L) {
  if (!map) return
  const boundaryBounds = Lmod.latLngBounds(
    Lmod.latLng(BOUNDARY_LIMITS.minLat, BOUNDARY_LIMITS.minLng),
    Lmod.latLng(BOUNDARY_LIMITS.maxLat, BOUNDARY_LIMITS.maxLng)
  )
  boundaryRect?.remove()
  boundaryRect = Lmod.rectangle(boundaryBounds, {
    color: '#dc2626',
    weight: 2,
    dashArray: '8 6',
    fillOpacity: 0,
    interactive: false
  }).addTo(map)
  boundaryRect.bringToFront()
}

function teardownMapResizeObserver() {
  mapResizeObserver?.disconnect()
  mapResizeObserver = null
}

function clearTileWatchdog() {
  if (!tileWatchdogTimer) return
  clearTimeout(tileWatchdogTimer)
  tileWatchdogTimer = null
}

function scheduleTileWatchdog(Lmod: typeof L) {
  clearTileWatchdog()
  tileWatchdogTimer = setTimeout(() => {
    // If no tile has loaded, force a base-layer refresh.
    if (!map || tileLoadCount > 0) return
    baseTileLayer?.remove()
    if (tileSourceIndex < TILE_SOURCES.length - 1) tileSourceIndex += 1
    baseTileLayer = buildTileLayer(Lmod, tileSourceIndex).addTo(map)
    map.invalidateSize({ animate: false })
  }, 2200)
}

function attachMapResizeObserver() {
  teardownMapResizeObserver()
  const el = mapEl.value
  if (!el || typeof ResizeObserver === 'undefined') return
  mapResizeObserver = new ResizeObserver(() => {
    map?.invalidateSize({ animate: false })
  })
  mapResizeObserver.observe(el)
}

/** Axis-aligned square in ~meters: anchor corner + cursor defines quadrant; side = max(|Δx|,|Δy|) in meters. */
function squareBoundsFromAnchor(Lmod: typeof L, anchor: L.LatLng, cursor: L.LatLng): L.LatLngBounds {
  const latRad = (anchor.lat * Math.PI) / 180
  const metersPerDegLat = 111_320
  const metersPerDegLng = 111_320 * Math.cos(latRad)
  const w = (cursor.lng - anchor.lng) * metersPerDegLng
  const h = (cursor.lat - anchor.lat) * metersPerDegLat
  const sideMeters = Math.max(Math.abs(w), Math.abs(h))
  if (sideMeters < 1e-3) {
    return Lmod.latLngBounds(anchor, anchor)
  }
  const signLat = cursor.lat >= anchor.lat ? 1 : -1
  const signLng = cursor.lng >= anchor.lng ? 1 : -1
  const other = Lmod.latLng(
    anchor.lat + signLat * (sideMeters / metersPerDegLat),
    anchor.lng + signLng * (sideMeters / metersPerDegLng)
  )
  return Lmod.latLngBounds(anchor, other)
}

function scheduleMapInvalidate() {
  const run = () => map?.invalidateSize({ animate: false })
  void nextTick(() => {
    requestAnimationFrame(run)
  })
  ;[0, 50, 150, 400].forEach(ms => setTimeout(run, ms))
}

const TILE_SOURCES = [
  {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '© OpenStreetMap contributors'
  },
  {
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution: '© OpenStreetMap contributors © CARTO'
  }
] as const

function buildTileLayer(Lmod: typeof L, sourceIndex: number) {
  const source = TILE_SOURCES[sourceIndex] ?? TILE_SOURCES[0]
  const layer = Lmod.tileLayer(source.url, {
    attribution: source.attribution,
    maxZoom: 19
  })
  layer.on('tileloadstart', () => {
    if (tileLoadCount === 0) scheduleTileWatchdog(Lmod)
  })
  layer.on('tileload', () => {
    tileLoadCount += 1
    clearTileWatchdog()
  })
  layer.on('tileerror', () => {
    tileErrorCount += 1
    if (tileErrorCount < 8) return
    if (!map || tileSourceIndex >= TILE_SOURCES.length - 1) return
    tileSourceIndex += 1
    tileErrorCount = 0
    baseTileLayer?.remove()
    baseTileLayer = buildTileLayer(Lmod, tileSourceIndex).addTo(map)
  })
  return layer
}

function ensureBaseTileLayer() {
  if (!map || !baseTileLayer) return
  if (!map.hasLayer(baseTileLayer)) {
    baseTileLayer.addTo(map)
  }
}

function forceRefreshBaseTiles() {
  const Lmod = Leaflet
  if (!Lmod || !map) return
  tileLoadCount = 0
  clearTileWatchdog()
  baseTileLayer?.remove()
  baseTileLayer = buildTileLayer(Lmod, tileSourceIndex).addTo(map)
  scheduleTileWatchdog(Lmod)
  scheduleMapInvalidate()
}

function getCurrentMapViewState(): MapViewState | null {
  if (!map) return null
  const center = map.getCenter()
  const zoom = map.getZoom()
  if (!Number.isFinite(center.lat) || !Number.isFinite(center.lng) || !Number.isFinite(zoom)) {
    return null
  }
  return {
    center: [center.lat, center.lng],
    zoom
  }
}

async function initMap(viewState?: MapViewState) {
  const el = mapEl.value
  if (!el) return
  const L = (await import('leaflet')).default
  Leaflet = L
  await nextTick()
  if (!map) {
    // preferCanvas caused blank tiles in some modal/resize cases; SVG renderer is more reliable here.
    map = L.map(el, {
      preferCanvas: false,
      zoomControl: false,
      zoomAnimation: false,
      fadeAnimation: false,
      markerZoomAnimation: false
    }).setView(viewState?.center ?? [2.3, 125], viewState?.zoom ?? 6)
    // Place zoom controls at bottom-right as requested.
    L.control.zoom({ position: 'bottomright' }).addTo(map)
    tileSourceIndex = 0
    tileErrorCount = 0
    tileLoadCount = 0
    baseTileLayer = buildTileLayer(L, tileSourceIndex).addTo(map)
    drawBoundaryOverlay(L)
    scheduleTileWatchdog(L)
    mapClickHandler = (e: L.LeafletMouseEvent) => handleMapClick(e.latlng.lng, e.latlng.lat)
    map.on('click', (e: L.LeafletMouseEvent) => mapClickHandler?.(e))
    map.on('mousedown', onMapMouseDown)
    map.on('mousemove', onMapMouseMove)
    L.DomEvent.on(document as unknown as HTMLElement, 'mouseup', onDocMouseUp)
    attachMapResizeObserver()
    map.whenReady(() => {
      map?.invalidateSize({ animate: false })
    })
  }
  ensureBaseTileLayer()
  setupToolBehavior()
  redrawFinalRectangle()
  scheduleMapInvalidate()
}

function boundsToRing(Lmod: typeof L, bounds: L.LatLngBounds): [number, number][] {
  const sw = bounds.getSouthWest()
  const ne = bounds.getNorthEast()
  const se = Lmod.latLng(sw.lat, ne.lng)
  const nw = Lmod.latLng(ne.lat, sw.lng)
  return [
    [sw.lng, sw.lat],
    [se.lng, se.lat],
    [ne.lng, ne.lat],
    [nw.lng, nw.lat],
    [sw.lng, sw.lat]
  ]
}

function onMapMouseDown(e: L.LeafletMouseEvent) {
  const Lmod = Leaflet
  if (!Lmod || !map || activeTool.value !== 'rectangle') return
  const mouseEvent = e.originalEvent as MouseEvent
  if (mouseEvent.button === 1) {
    // Middle button drag: pan map while staying in rectangle tool.
    middlePanActive = true
    middlePanLastPoint = Lmod.point(mouseEvent.clientX, mouseEvent.clientY)
    Lmod.DomEvent.preventDefault(mouseEvent)
    Lmod.DomEvent.stopPropagation(mouseEvent)
    return
  }
  if (mouseEvent.button !== 0) return
  Lmod.DomEvent.stopPropagation(e.originalEvent)
  rectDragAnchor = e.latlng
  rectLastLatLng = e.latlng
  map.dragging.disable()
}

function onMapMouseMove(e: L.LeafletMouseEvent) {
  const Lmod = Leaflet
  if (!Lmod || !map || activeTool.value !== 'rectangle') return
  if (middlePanActive) {
    const mouseEvent = e.originalEvent as MouseEvent
    const nextPoint = Lmod.point(mouseEvent.clientX, mouseEvent.clientY)
    if (middlePanLastPoint) {
      const delta = nextPoint.subtract(middlePanLastPoint)
      if (delta.x !== 0 || delta.y !== 0) {
        map.panBy([-delta.x, -delta.y], { animate: false })
      }
    }
    middlePanLastPoint = nextPoint
    return
  }
  if (!rectDragAnchor) return
  rectLastLatLng = e.latlng
  const bounds = squareBoundsFromAnchor(Lmod, rectDragAnchor, e.latlng)
  const insideBoundary = isBoundsInsideBoundary(bounds)
  if (!rectPreview) {
    rectPreview = Lmod.rectangle(bounds, {
      color: insideBoundary ? '#2563eb' : '#dc2626',
      weight: 2,
      dashArray: '6 4',
      fillColor: insideBoundary ? '#3b82f6' : '#ef4444',
      fillOpacity: 0.15
    }).addTo(map)
  } else {
    rectPreview.setBounds(bounds)
    rectPreview.setStyle({
      color: insideBoundary ? '#2563eb' : '#dc2626',
      fillColor: insideBoundary ? '#3b82f6' : '#ef4444'
    })
  }
}

function onDocMouseUp() {
  const Lmod = Leaflet
  if (!Lmod || !map) return
  if (middlePanActive) {
    middlePanActive = false
    middlePanLastPoint = null
    return
  }
  if (!rectDragAnchor) return
  if (activeTool.value !== 'rectangle') {
    rectDragAnchor = null
    rectLastLatLng = null
    rectPreview?.remove()
    rectPreview = null
    map.dragging.enable()
    return
  }
  map.dragging.enable()
  const end = rectLastLatLng ?? rectDragAnchor
  const bounds = squareBoundsFromAnchor(Lmod, rectDragAnchor, end)
  rectDragAnchor = null
  rectLastLatLng = null
  rectPreview?.remove()
  rectPreview = null
  const sw = bounds.getSouthWest()
  const ne = bounds.getNorthEast()
  if (sw.equals(ne)) return
  if (!isBoundsInsideBoundary(bounds)) {
    showBoundaryWarning()
    return
  }
  clearBoundaryWarning()
  const ring = boundsToRing(Lmod, bounds)
  boundingRectangle.value = ring
  rectFinal?.remove()
  rectFinal = Lmod.rectangle(bounds, {
    color: '#1d4ed8',
    weight: 2,
    fillColor: '#3b82f6',
    fillOpacity: 0.12
  }).addTo(map)
}

function redrawFinalRectangle() {
  const Lmod = Leaflet
  if (!Lmod || !map || !boundingRectangle.value || boundingRectangle.value.length < 4) return
  const ring = boundingRectangle.value
  const lats = ring.map(([, lat]) => lat)
  const lngs = ring.map(([lng]) => lng)
  const b = Lmod.latLngBounds(
    Lmod.latLng(Math.min(...lats), Math.min(...lngs)),
    Lmod.latLng(Math.max(...lats), Math.max(...lngs))
  )
  rectFinal?.remove()
  rectFinal = Lmod.rectangle(b, {
    color: '#1d4ed8',
    weight: 2,
    fillColor: '#3b82f6',
    fillOpacity: 0.12
  }).addTo(map)
}

function clearRectangle() {
  boundingRectangle.value = null
  rectPreview?.remove()
  rectPreview = null
  rectFinal?.remove()
  rectFinal = null
  rectDragAnchor = null
  rectLastLatLng = null
  middlePanActive = false
  middlePanLastPoint = null
  map?.dragging.enable()
}

function handleMapClick(lng: number, lat: number) {
  if (activeTool.value === 'draw') {
    if (!isPointInsideBoundary(lng, lat)) {
      showBoundaryWarning()
      return
    }
    clearBoundaryWarning()
    addPoint(lng, lat)
  }
}

function setupToolBehavior() {
  const L = Leaflet
  if (!L || !map) return
  markers.forEach((m, i) => {
    // Cursor/pick mode is dedicated for moving existing coordinates.
    if (activeTool.value === 'pick') {
      m.dragging?.enable()
    } else {
      m.dragging?.disable()
    }

    m.off('dragstart')
    // Avoid map panning while dragging markers (can cause tile/vector redraw glitches).
    m.on('dragstart', () => {
      map?.dragging.disable()
    })

    m.off('dragend')
    m.on('dragend', () => {
      map?.dragging.enable()
      if (activeTool.value !== 'pick') return
      const latlng = m.getLatLng()
      if (!isPointInsideBoundary(latlng.lng, latlng.lat)) {
        showBoundaryWarning('Titik tidak boleh digeser keluar area 90°E - 145°E dan 15°S - 15°N.')
        m.setLatLng([coordinates.value[i]?.[1] ?? latlng.lat, coordinates.value[i]?.[0] ?? latlng.lng])
        return
      }
      clearBoundaryWarning()
      coordinates.value[i] = [latlng.lng, latlng.lat]
      updatePolyline()
    })
  })
  if (polyline) {
    polyline.off('click')
    if (activeTool.value === 'draw' && coordinates.value.length >= 2) {
      polyline.on('click', (e: L.LeafletMouseEvent) => {
        L.DomEvent.stopPropagation(e)
        insertPointOnLine(e.latlng.lng, e.latlng.lat)
      })
    }
  }
}

function pointToSegmentDistance(L: NonNullable<typeof Leaflet>, click: L.LatLng, a: L.LatLng, b: L.LatLng): number {
  const samples = 15
  let minDist = Infinity
  for (let k = 0; k <= samples; k++) {
    const t = k / samples
    const lat = a.lat + t * (b.lat - a.lat)
    const lng = a.lng + t * (b.lng - a.lng)
    const pt = L.latLng(lat, lng)
    minDist = Math.min(minDist, click.distanceTo(pt))
  }
  return minDist
}

function insertPointOnLine(clickLng: number, clickLat: number) {
  const L = Leaflet
  if (!L || !map || coordinates.value.length < 2) return
  if (!isPointInsideBoundary(clickLng, clickLat)) {
    showBoundaryWarning()
    return
  }
  const coords = coordinates.value
  let bestIdx = 1
  let bestDist = Infinity
  const clickLatLng = L.latLng(clickLat, clickLng)
  for (let i = 0; i < coords.length - 1; i++) {
    const ptA = coords[i]
    const ptB = coords[i + 1]
    if (!ptA || !ptB) continue
    const a = L.latLng(ptA[1], ptA[0])
    const b = L.latLng(ptB[1], ptB[0])
    const dist = pointToSegmentDistance(L, clickLatLng, a, b)
    if (dist < bestDist) {
      bestDist = dist
      bestIdx = i + 1
    }
  }
  const newCoords = [...coords.slice(0, bestIdx), [clickLng, clickLat] as [number, number], ...coords.slice(bestIdx)]
  coordinates.value = newCoords
  rebuildMarkers()
  updatePolyline()
  setupToolBehavior()
}

function rebuildMarkers() {
  const L = Leaflet
  if (!L || !map) return
  markers.forEach(m => m.remove())
  markers.length = 0
  coordinates.value.forEach(([lng, lat]) => {
    const m = L.marker([lat, lng], { draggable: true }).addTo(map!)
    markers.push(m)
  })
  setupToolBehavior()
}

function addPoint(lng: number, lat: number) {
  const L = Leaflet
  if (!L || !map) return
  if (!isPointInsideBoundary(lng, lat)) {
    showBoundaryWarning()
    return
  }
  coordinates.value.push([lng, lat])
  const m = L.marker([lat, lng], { draggable: true }).addTo(map)
  markers.push(m)
  updatePolyline()
  setupToolBehavior()
}

function updatePolyline() {
  const L = Leaflet
  if (!L || !map || coordinates.value.length < 2) return
  const latLngs = coordinates.value.map(([lng, lat]) => [lat, lng] as [number, number])
  const style = {
    color: getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#01a73e',
    weight: 6,
    opacity: 0.9
  }
  // Keep the polyline instance to avoid pane/renderer redraw glitches.
  if (!polyline) {
    polyline = L.polyline(latLngs, style).addTo(map)
  } else {
    polyline.setLatLngs(latLngs)
    polyline.setStyle(style)
  }
  setupToolBehavior()
}

function removeLastPoint() {
  if (coordinates.value.length === 0) return
  const last = markers.pop()
  last?.remove()
  coordinates.value.pop()
  updatePolyline()
  if (polyline && coordinates.value.length < 2) {
    polyline.remove()
    polyline = null
  }
}

function clearLineOnly() {
  markers.forEach(m => m.remove())
  markers.length = 0
  polyline?.remove()
  polyline = null
  coordinates.value = []
}

function clearAllDrawing() {
  clearRectangle()
  clearLineOnly()
  clearBoundaryWarning()
}

function close() {
  modelValue.value = false
}

function submit() {
  if (coordinates.value.length < 2) return
  emit('submit', {
    routeName: routeName.value.trim(),
    coordinates: [...coordinates.value],
    from: fromPort.value.trim() || undefined,
    to: toPort.value.trim() || undefined,
    ...(boundingRectangle.value?.length ? { boundingRectangle: [...boundingRectangle.value] } : {})
  })
  clearAllDrawing()
  routeName.value = ''
  fromPort.value = ''
  toPort.value = ''
  close()
}

async function reinitMapPreserveDrawing() {
  const el = mapEl.value
  if (!el) return

  const viewState = getCurrentMapViewState()
  const coords = coordinates.value.map(([lng, lat]) => [lng, lat] as [number, number])
  const rect = boundingRectangle.value?.map(([lng, lat]) => [lng, lat] as [number, number]) ?? null

  clearTileWatchdog()
  teardownMapResizeObserver()
  if (Leaflet) {
    Leaflet.DomEvent.off(document as unknown as HTMLElement, 'mouseup', onDocMouseUp)
  }
  map?.remove()
  map = null
  baseTileLayer = null
  polyline = null
  markers.forEach(m => m.remove())
  markers.length = 0
  rectPreview?.remove()
  rectPreview = null
  rectFinal = null
  boundaryRect?.remove()
  boundaryRect = null
  rectDragAnchor = null
  rectLastLatLng = null
  tileSourceIndex = 0
  tileErrorCount = 0
  tileLoadCount = 0

  coordinates.value = coords
  boundingRectangle.value = rect

  await nextTick()
  await initMap(viewState ?? undefined)
  rebuildMarkers()
  updatePolyline()
  redrawFinalRectangle()
  scheduleMapInvalidate()
}

watch(activeTool, (newTool, oldTool) => {
  if (!modelValue.value) return
  const el = mapEl.value
  const mapElementNotInitialized = !!el && !el.classList.contains('leaflet-container')
  if (modelValue.value && (!map || mapElementNotInitialized)) {
    void nextTick(() => {
      void initMap()
    })
    return
  }

  if (newTool !== 'rectangle') {
    rectPreview?.remove()
    rectPreview = null
    rectDragAnchor = null
    rectLastLatLng = null
    map?.dragging.enable()
  }

  if (oldTool !== newTool) {
    void reinitMapPreserveDrawing()
    return
  }

  ensureBaseTileLayer()
  setupToolBehavior()
  // Keep tile pane healthy after tool changes without map teardown.
  scheduleMapInvalidate()
})

function onMapToolsKeydown(e: KeyboardEvent) {
  if (!modelValue.value) return
  const el = e.target as HTMLElement | null
  if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)) return
  if (e.key === '1') {
    activeTool.value = 'pick'
    e.preventDefault()
  } else if (e.key === '2') {
    activeTool.value = 'draw'
    e.preventDefault()
  } else if (e.key === '3') {
    activeTool.value = 'rectangle'
    e.preventDefault()
  }
}

watch(modelValue, (open) => {
  if (open) {
    routeName.value = ''
    fromPort.value = ''
    toPort.value = ''
    coordinates.value = []
    boundingRectangle.value = null
    clearBoundaryWarning()
    activeTool.value = 'draw'
    tileLoadCount = 0
    clearTileWatchdog()
    if (import.meta.client) {
      window.addEventListener('keydown', onMapToolsKeydown)
    }
    nextTick(() => {
      void initMap().then(() => scheduleMapInvalidate())
    })
  } else {
    clearTileWatchdog()
    teardownMapResizeObserver()
    if (import.meta.client) {
      window.removeEventListener('keydown', onMapToolsKeydown)
    }
    if (Leaflet) {
      Leaflet.DomEvent.off(document as unknown as HTMLElement, 'mouseup', onDocMouseUp)
    }
    clearAllDrawing()
    rectPreview = null
    rectFinal = null
    boundaryRect?.remove()
    boundaryRect = null
    rectDragAnchor = null
    rectLastLatLng = null
    map?.remove()
    map = null
    baseTileLayer = null
    tileSourceIndex = 0
    tileErrorCount = 0
    tileLoadCount = 0
    polyline = null
    markers.length = 0
    clearBoundaryWarning()
  }
})
</script>

<style scoped>
:deep(.leaflet-container),
:deep(.leaflet-pane) {
  background: transparent;
}

:deep(.leaflet-container) {
  background: var(--input-bg, #f8fafc);
}

/* Guard against global img/reset styles breaking leaflet tiles. */
:deep(.leaflet-container img.leaflet-tile) {
  max-width: none !important;
  max-height: none !important;
  width: 256px;
  height: 256px;
}
</style>
