<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="fixed inset-0 flex items-center justify-center z-[1000] p-4 bg-slate-900/45 backdrop-blur-[2px]"
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
                    'cursor-move': activeTool === 'pick',
                    'cursor-crosshair': activeTool === 'draw' || activeTool === 'rectangle'
                  }"
                />
                <template #fallback>
                  <div class="h-[55vh] min-h-[400px] flex items-center justify-center text-[var(--text-muted)] text-sm bg-[var(--surface-hover)] border-2 border-dashed border-[var(--border)] rounded-lg">
                    Memuat peta...
                  </div>
                </template>
              </ClientOnly>
              <div class="absolute top-3 left-3 flex flex-col items-center gap-1.5 z-[500] shadow-[var(--shadow-md)] rounded-lg p-1 bg-[var(--surface)]/95 border border-[var(--border)]">
                <button
                  type="button"
                  class="flex items-center justify-center w-9 h-9 p-0 rounded-md border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] cursor-pointer transition-colors duration-150 hover:bg-[var(--color-white)] disabled:opacity-50 disabled:cursor-not-allowed"
                  :class="{ 'bg-[var(--primary)] text-[var(--color-white)] border-[var(--primary)]': activeTool === 'draw' }"
                  title="Draw"
                  aria-label="Draw"
                  @click="activeTool = 'draw'"
                >
                  <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                  </svg>
                </button>
                <button
                  type="button"
                  class="flex items-center justify-center w-9 h-9 p-0 rounded-md border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] cursor-pointer transition-colors duration-150 hover:bg-[var(--color-white)] disabled:opacity-50 disabled:cursor-not-allowed"
                  :class="{ 'bg-[var(--primary)] text-[var(--color-white)] border-[var(--primary)]': activeTool === 'pick' }"
                  :disabled="coordinates.length < 2"
                  title="Pick"
                  aria-label="Pick"
                  @click="activeTool = 'pick'"
                >
                  <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M7 4l10 8-10 8V4z" />
                  </svg>
                </button>
                <button
                  type="button"
                  class="flex items-center justify-center w-9 h-9 p-0 rounded-md border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] cursor-pointer transition-colors duration-150 hover:bg-[var(--color-white)]"
                  :class="{ 'bg-[var(--primary)] text-[var(--color-white)] border-[var(--primary)]': activeTool === 'rectangle' }"
                  title="Persegi (AOI)"
                  aria-label="Gambar persegi"
                  @click="activeTool = 'rectangle'"
                >
                  <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="5" y="5" width="14" height="14" rx="1" />
                    <path d="M5 9h14" />
                    <path d="M9 5v14" />
                  </svg>
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

type ToolMode = 'draw' | 'pick' | 'rectangle'

const mapEl = ref<HTMLElement | null>(null)
const routeName = ref('')
const fromPort = ref('')
const toPort = ref('')
const coordinates = ref<[number, number][]>([])
const activeTool = ref<ToolMode>('draw')
/** Closed outer ring for GeoJSON Polygon (from drag-rectangle tool) */
const boundingRectangle = ref<[number, number][] | null>(null)

const toolHints: Record<ToolMode, string> = {
  draw: 'Klik pada peta untuk menggambar garis rute',
  pick: 'Seret titik untuk memindahkan, atau klik garis untuk menambah titik',
  rectangle: 'Klik dan seret pada peta untuk menggambar persegi (AOI); tersimpan ke GeoJSON permintaan prakiraan'
}

let map: L.Map | null = null
let polyline: L.Polyline | null = null
const markers: L.Marker[] = []
let Leaflet: typeof L | null = null
let baseTileLayer: L.TileLayer | null = null
let tileSourceIndex = 0
let tileErrorCount = 0
let mapClickHandler: ((e: L.LeafletMouseEvent) => void) | null = null
let rectPreview: L.Rectangle | null = null
let rectFinal: L.Rectangle | null = null
let rectDragAnchor: L.LatLng | null = null
let rectLastLatLng: L.LatLng | null = null

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

async function initMap() {
  const el = mapEl.value
  if (!el) return
  const L = (await import('leaflet')).default
  Leaflet = L
  await nextTick()
  if (!map) {
    // Prefer canvas renderer to avoid pane/renderer redraw issues
    // when switching tools (draw <-> pick).
    map = L.map(el, {
      preferCanvas: true,
      zoomControl: false,
      zoomAnimation: false,
      fadeAnimation: false,
      markerZoomAnimation: false
    }).setView([2.3, 125], 6)
    // Place zoom controls at bottom-right as requested.
    L.control.zoom({ position: 'bottomright' }).addTo(map)
    tileSourceIndex = 0
    tileErrorCount = 0
    baseTileLayer = buildTileLayer(L, tileSourceIndex).addTo(map)
    mapClickHandler = (e: L.LeafletMouseEvent) => handleMapClick(e.latlng.lng, e.latlng.lat)
    map.on('click', (e: L.LeafletMouseEvent) => mapClickHandler?.(e))
    map.on('mousedown', onMapMouseDown)
    map.on('mousemove', onMapMouseMove)
    L.DomEvent.on(document as unknown as HTMLElement, 'mouseup', onDocMouseUp)
  }
  ensureBaseTileLayer()
  setupToolBehavior()
  redrawFinalRectangle()
  setTimeout(() => map?.invalidateSize(), 150)
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
  Lmod.DomEvent.stopPropagation(e.originalEvent)
  rectDragAnchor = e.latlng
  rectLastLatLng = e.latlng
  map.dragging.disable()
}

function onMapMouseMove(e: L.LeafletMouseEvent) {
  const Lmod = Leaflet
  if (!Lmod || !map || activeTool.value !== 'rectangle' || !rectDragAnchor) return
  rectLastLatLng = e.latlng
  const bounds = Lmod.latLngBounds(rectDragAnchor, e.latlng)
  if (!rectPreview) {
    rectPreview = Lmod.rectangle(bounds, {
      color: '#2563eb',
      weight: 2,
      dashArray: '6 4',
      fillColor: '#3b82f6',
      fillOpacity: 0.15
    }).addTo(map)
  } else {
    rectPreview.setBounds(bounds)
  }
}

function onDocMouseUp() {
  const Lmod = Leaflet
  if (!Lmod || !map || !rectDragAnchor) return
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
  const bounds = Lmod.latLngBounds(rectDragAnchor, end)
  rectDragAnchor = null
  rectLastLatLng = null
  rectPreview?.remove()
  rectPreview = null
  const sw = bounds.getSouthWest()
  const ne = bounds.getNorthEast()
  if (sw.equals(ne)) return
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
  map?.dragging.enable()
}

function handleMapClick(lng: number, lat: number) {
  if (activeTool.value === 'draw') {
    addPoint(lng, lat)
  }
}

function setupToolBehavior() {
  const L = Leaflet
  if (!L || !map) return
  markers.forEach((m, i) => {
    // Keep marker dragging enabled to avoid a Leaflet rendering/pane glitch
    // when toggling draggable state during tool switches (draw <-> pick).
    m.dragging?.enable()

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
      coordinates.value[i] = [latlng.lng, latlng.lat]
      updatePolyline()
    })
  })
  if (polyline) {
    polyline.off('click')
    if (activeTool.value === 'pick') {
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
  // Keep the polyline instance to avoid preferCanvas redraw glitches.
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
  if (!mapEl.value) return

  const coords = coordinates.value.map(([lng, lat]) => [lng, lat] as [number, number])
  const rect = boundingRectangle.value?.map(([lng, lat]) => [lng, lat] as [number, number]) ?? null

  // Remove current map instance and all layers/panes.
  map?.remove()
  map = null
  baseTileLayer = null
  polyline = null
  markers.forEach(m => m.remove())
  markers.length = 0

  rectPreview?.remove()
  rectPreview = null
  rectFinal = null
  rectDragAnchor = null
  rectLastLatLng = null

  tileSourceIndex = 0
  tileErrorCount = 0

  // Restore drawing state.
  coordinates.value = coords
  boundingRectangle.value = rect

  // Recreate map + layers.
  await nextTick()
  await initMap()
  rebuildMarkers()
  updatePolyline()
  redrawFinalRectangle()
  setTimeout(() => map?.invalidateSize(), 150)
}

watch(activeTool, (newTool, oldTool) => {
  if (newTool !== 'rectangle') {
    rectPreview?.remove()
    rectPreview = null
    rectDragAnchor = null
    rectLastLatLng = null
    map?.dragging.enable()
  }

  // Leaflet renderer/pane state can get corrupted when toggling draw <-> pick.
  // Re-initialize the map while preserving the current drawing.
  if (
    (newTool === 'pick' && oldTool === 'draw') ||
    (newTool === 'draw' && oldTool === 'pick')
  ) {
    void reinitMapPreserveDrawing()
    return
  }

  ensureBaseTileLayer()
  setupToolBehavior()
  // Leaflet sometimes needs a size invalidation when tools change.
  setTimeout(() => map?.invalidateSize(), 0)
})

watch(modelValue, (open) => {
  if (open) {
    routeName.value = ''
    fromPort.value = ''
    toPort.value = ''
    coordinates.value = []
    boundingRectangle.value = null
    activeTool.value = 'draw'
    nextTick(() => initMap())
  } else {
    if (Leaflet) {
      Leaflet.DomEvent.off(document as unknown as HTMLElement, 'mouseup', onDocMouseUp)
    }
    clearAllDrawing()
    rectPreview = null
    rectFinal = null
    rectDragAnchor = null
    rectLastLatLng = null
    map?.remove()
    map = null
    baseTileLayer = null
    tileSourceIndex = 0
    tileErrorCount = 0
    polyline = null
    markers.length = 0
  }
})
</script>
