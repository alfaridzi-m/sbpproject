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
          <div class="mb-4">
            <div class="flex flex-col gap-1 mb-2">
              <span class="text-sm font-medium text-[var(--text)]">Gambar rute di peta</span>
              <span class="text-xs text-[var(--text-muted)]">{{ toolHints[activeTool] }}</span>
            </div>
            <div class="relative rounded-lg overflow-hidden border border-[var(--border)]">
              <ClientOnly>
                <div
                  ref="mapEl"
                  class="w-full h-[55vh] min-h-[400px] rounded-lg overflow-hidden border border-[var(--border)] cursor-crosshair"
                  :class="{ 'cursor-move': activeTool === 'pick' }"
                />
                <template #fallback>
                  <div class="h-[55vh] min-h-[400px] flex items-center justify-center text-[var(--text-muted)] text-sm bg-[var(--surface-hover)] border-2 border-dashed border-[var(--border)] rounded-lg">
                    Memuat peta...
                  </div>
                </template>
              </ClientOnly>
              <div class="absolute top-3 left-1/2 -translate-x-1/2 flex flex-row items-center gap-1.5 z-[500] shadow-[var(--shadow-md)] rounded-lg p-1 bg-[var(--surface)]/95 border border-[var(--border)]">
                <button
                  type="button"
                  class="flex items-center justify-center w-9 h-9 p-0 rounded-md border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] cursor-pointer transition-colors duration-150 hover:bg-[var(--color-white)] disabled:opacity-50 disabled:cursor-not-allowed"
                  :class="{ 'bg-[var(--primary)] text-[var(--color-white)] border-[var(--primary)]': activeTool === 'draw' }"
                  title="Draw"
                  aria-label="Draw"
                  @click="activeTool = 'draw'"
                >
                  <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 19l7-7 3 3-7 7-3-3z" />
                    <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
                    <path d="M2 2l7.586 7.586" />
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
                    <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
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
                @click="clearRoute"
              >
                Hapus Semua
              </button>
              <span
                v-if="coordinates.length > 0"
                class="text-xs text-[var(--text-muted)]"
              >
                {{ coordinates.length }} titik
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
}

const modelValue = defineModel<boolean>({ default: false })

const emit = defineEmits<{
  submit: [data: ManualRouteData]
}>()

type ToolMode = 'draw' | 'pick'

const mapEl = ref<HTMLElement | null>(null)
const routeName = ref('')
const coordinates = ref<[number, number][]>([])
const activeTool = ref<ToolMode>('draw')

const toolHints: Record<ToolMode, string> = {
  draw: 'Klik pada peta untuk menggambar garis rute',
  pick: 'Seret titik untuk memindahkan, atau klik garis untuk menambah titik'
}

let map: L.Map | null = null
let polyline: L.Polyline | null = null
const markers: L.Marker[] = []
let Leaflet: typeof L | null = null
let mapClickHandler: ((e: L.LeafletMouseEvent) => void) | null = null

async function initMap() {
  const el = mapEl.value
  if (!el) return
  const L = (await import('leaflet')).default
  Leaflet = L
  await nextTick()
  if (!map) {
    map = L.map(el, { preferCanvas: true }).setView([2.3, 125], 6)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map)
    mapClickHandler = (e: L.LeafletMouseEvent) => handleMapClick(e.latlng.lng, e.latlng.lat)
    map.on('click', (e: L.LeafletMouseEvent) => mapClickHandler?.(e))
  }
  setupToolBehavior()
  setTimeout(() => map?.invalidateSize(), 150)
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
    if (activeTool.value === 'pick') {
      m.dragging?.enable()
      m.off('dragend')
      m.on('dragend', () => {
        const latlng = m.getLatLng()
        coordinates.value[i] = [latlng.lng, latlng.lat]
        updatePolyline()
      })
    } else {
      m.dragging?.disable()
      m.off('dragend')
    }
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
  if (coordinates.value.length >= 2) {
    const bounds = L.latLngBounds(coordinates.value.map(([lng, lat]) => [lat, lng] as [number, number]))
    map.fitBounds(bounds, { padding: [24, 24], maxZoom: 12 })
  }
}

function updatePolyline() {
  const L = Leaflet
  if (!L || !map || coordinates.value.length < 2) return
  polyline?.remove()
  const latLngs = coordinates.value.map(([lng, lat]) => [lat, lng] as [number, number])
  polyline = L.polyline(latLngs, {
    color: getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#01a73e',
    weight: 6,
    opacity: 0.9
  }).addTo(map)
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

function clearRoute() {
  markers.forEach(m => m.remove())
  markers.length = 0
  polyline?.remove()
  polyline = null
  coordinates.value = []
}

function close() {
  modelValue.value = false
}

function submit() {
  if (coordinates.value.length < 2) return
  emit('submit', {
    routeName: routeName.value.trim(),
    coordinates: [...coordinates.value]
  })
  clearRoute()
  routeName.value = ''
  close()
}

watch(activeTool, () => setupToolBehavior())

watch(modelValue, (open) => {
  if (open) {
    routeName.value = ''
    coordinates.value = []
    activeTool.value = 'draw'
    nextTick(() => initMap())
  } else {
    clearRoute()
    map?.remove()
    map = null
    polyline = null
    markers.length = 0
  }
})
</script>
