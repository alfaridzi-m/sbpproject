<template>
  <section
    class="bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-[var(--shadow-card)] overflow-hidden"
  >
    <!-- Route selector bar -->
    <div class="flex flex-col sm:flex-row items-stretch sm:items-end gap-3 px-5 pt-5 pb-4 bg-[color-mix(in_srgb,var(--accent)_6%,var(--surface)_94%)] border-b border-[var(--border)]">
      <div class="flex-1 min-w-0 flex flex-col gap-1">
        <label for="station-select" class="text-[0.7rem] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Stasiun</label>
        <select
          id="station-select"
          v-model="selectedStation"
          class="ri-select"
        >
          <option v-for="s in stationOptions" :key="s" :value="s">{{ s }}</option>
        </select>
      </div>
      <div class="flex-1 min-w-0 flex flex-col gap-1">
        <label for="top-route-select" class="text-[0.7rem] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Rute</label>
        <select
          id="top-route-select"
          :value="selectedRouteId"
          class="ri-select"
          @change="selectRouteById(($event.target as HTMLSelectElement).value)"
        >
          <option value="">Pilih rute...</option>
          <option v-for="r in availableRoutes" :key="r.id" :value="r.id">{{ r.label }}</option>
        </select>
      </div>
      <div class="flex gap-2 shrink-0">
        <button
          type="button"
          class="ri-btn-outline"
          :disabled="!canFlipRoute"
          @click="flipRouteDirection"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" /></svg>
          Switch
        </button>
        <button
          type="button"
          class="ri-btn-outline"
          @click="openManualRouteModal"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
          Manual
        </button>
      </div>
    </div>

    <!-- Map (full width, prominent) -->
    <div class="min-h-[320px] w-full">
      <SectionsRouteMap
        :route-coordinates="manualRouteData?.coordinates ?? undefined"
        :split-markers="splitPointCoordinates"
        :polygon-ring="manualRouteData?.boundingRectangle ?? undefined"
      />
    </div>

    <!-- Summary stats bar -->
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 border-b border-[var(--border)]">
      <div class="ri-stat-cell">
        <dt>Route</dt>
        <dd>{{ routeNameText || '-' }}</dd>
      </div>
      <div class="ri-stat-cell">
        <dt>Distance</dt>
        <dd>{{ routeDistanceNmText || '-' }}</dd>
      </div>
      <div class="ri-stat-cell">
        <dt>Speed</dt>
        <dd>{{ shipSpeedKnotsText || '-' }}</dd>
      </div>
      <div class="ri-stat-cell">
        <dt>Duration</dt>
        <dd>{{ shipEstDurationText || '-' }}</dd>
      </div>
      <div class="ri-stat-cell col-span-2 sm:col-span-1">
        <dt>Time Step</dt>
        <dd class="text-[var(--primary)]">{{ forecastTimeStep }} jam</dd>
      </div>
    </div>

    <div class="p-5 flex flex-col gap-5">
      <!-- Ship + Schedule + Step — 2 column grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <!-- Left column: Ship & Forecast step -->
        <div class="flex flex-col gap-4">
          <div class="flex flex-col sm:flex-row gap-4">
            <div class="flex-1 flex flex-col gap-1.5">
              <label for="ship-name" class="ri-label">Nama Kapal</label>
              <input id="ship-name" v-model="routeInfo.shipName" type="text" class="ri-input" placeholder="KM. Dharma Lintas Utama" />
            </div>
            <div class="shrink-0 flex flex-col gap-1.5">
              <span class="ri-label">Zona Waktu</span>
              <div class="ri-input-static">UTC</div>
            </div>
          </div>
          <div>
            <span class="ri-label mb-2 block">Forecast Time Step</span>
            <div class="flex flex-nowrap gap-1.5">
              <button
                v-for="step in ([1, 3, 6] as const)"
                :key="step"
                type="button"
                class="flex-1 py-2 rounded-lg text-sm font-semibold border cursor-pointer transition-all duration-150"
                :class="forecastTimeStep === step
                  ? 'bg-[var(--primary)] text-white border-[var(--primary)] shadow-[var(--shadow-sm)]'
                  : 'bg-[var(--surface)] text-[var(--text)] border-[var(--border)] hover:border-[var(--primary)] hover:text-[var(--primary)]'"
                @click="forecastTimeStep = step"
              >
                {{ step }}h
              </button>
            </div>
          </div>
        </div>

        <!-- Right column: Schedule -->
        <div class="flex flex-col gap-3 rounded-xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_96%,var(--accent)_4%)] p-4">
          <h3 class="text-[0.7rem] font-semibold uppercase tracking-wider text-[var(--text-muted)] m-0">Jadwal</h3>
          <div class="grid grid-cols-[auto_1fr_1fr] gap-x-3 gap-y-2.5 items-center">
            <span class="ri-label-inline">Berangkat</span>
            <input id="departure-date" v-model="routeInfo.departureDate" type="date" class="ri-input text-xs" />
            <input id="departure-time" v-model="routeInfo.departureTime" type="time" class="ri-input text-xs" />

            <span class="ri-label-inline">Tiba</span>
            <input id="arrival-date" v-model="routeInfo.arrivalDate" type="date" class="ri-input text-xs" />
            <input id="arrival-time" v-model="routeInfo.arrivalTime" type="time" class="ri-input text-xs" />

            <span class="ri-label-inline">Issued</span>
            <input id="issued-date" v-model="routeInfo.issuedDate" type="date" class="ri-input text-xs" />
            <input id="issued-time" v-model="routeInfo.issuedTime" type="time" class="ri-input text-xs" />
          </div>
        </div>
      </div>

      <!-- Forecaster & PDF Header — collapsible -->
      <details class="group rounded-xl border border-[var(--border)] overflow-hidden">
        <summary class="flex items-center gap-2 px-4 py-3 cursor-pointer select-none bg-[color-mix(in_srgb,var(--surface)_96%,var(--accent)_4%)] hover:bg-[var(--surface-hover)]">
          <svg class="w-4 h-4 text-[var(--text-muted)] transition-transform duration-200 group-open:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /></svg>
          <span class="text-sm font-semibold text-[var(--text)]">Forecaster & Header PDF</span>
          <span class="text-[0.65rem] text-[var(--text-muted)] ml-auto">Nama, UPT, alamat, tanda tangan</span>
        </summary>
        <div class="p-4 border-t border-[var(--border)]">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div class="flex flex-col gap-1.5 sm:col-span-2 lg:col-span-1">
              <label for="forecaster" class="ri-label">Forecaster</label>
              <input id="forecaster" v-model="routeInfo.forecaster" type="text" class="ri-input" placeholder="Nama forecaster" />
            </div>
            <div class="flex flex-col gap-1.5">
              <label for="nama-upt" class="ri-label">Nama UPT</label>
              <input id="nama-upt" v-model="routeInfo.namaUpt" type="text" class="ri-input" placeholder="Unit pelaksana teknis" />
            </div>
            <div class="flex flex-col gap-1.5">
              <label for="pdf-telp" class="ri-label">Telp</label>
              <input id="pdf-telp" v-model="routeInfo.telp" type="text" class="ri-input" placeholder="Nomor telepon" />
            </div>
            <div class="flex flex-col gap-1.5 sm:col-span-2">
              <label for="pdf-alamat" class="ri-label">Alamat</label>
              <textarea id="pdf-alamat" v-model="routeInfo.alamat" rows="2" class="ri-input resize-y min-h-[2.75rem]" placeholder="Alamat lengkap kantor (header PDF)" />
            </div>
            <div class="flex flex-col gap-1.5">
              <label for="pdf-email" class="ri-label">Email</label>
              <input id="pdf-email" v-model="routeInfo.email" type="email" autocomplete="email" class="ri-input" placeholder="email@domain.go.id" />
            </div>
          </div>
          <ClientOnly>
            <SectionsSignaturePdfForm class="mt-4 pt-4 border-t border-[var(--border)]" />
            <template #fallback>
              <p class="mt-4 pt-4 border-t border-[var(--border)] text-xs text-[var(--text-muted)] m-0">Memuat form tanda tangan…</p>
            </template>
          </ClientOnly>
        </div>
      </details>

      <!-- GeoJSON — collapsible -->
      <details class="group rounded-xl border border-[var(--border)] overflow-hidden">
        <summary class="flex items-center gap-2 px-4 py-3 cursor-pointer select-none bg-[color-mix(in_srgb,var(--surface)_96%,var(--accent)_4%)] hover:bg-[var(--surface-hover)]">
          <svg class="w-4 h-4 text-[var(--text-muted)] transition-transform duration-200 group-open:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /></svg>
          <span class="text-sm font-semibold text-[var(--text)]">GeoJSON</span>
          <span class="text-[0.65rem] text-[var(--text-muted)]">Rute & forecast request</span>
          <button
            type="button"
            class="ml-auto shrink-0 px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer bg-[var(--surface)] text-[var(--primary)] border border-[var(--primary)] shadow-[var(--shadow-sm)] hover:bg-[var(--primary-hover)] disabled:opacity-60 disabled:cursor-not-allowed"
            :disabled="!activeGeoJsonText || !canCopyGeoJson"
            @click.stop="copyGeoJson"
          >
            {{ copied ? 'Copied' : 'Copy' }}
          </button>
        </summary>
        <div class="p-4 border-t border-[var(--border)]">
          <div
            class="flex flex-wrap gap-1.5 mb-3 p-1 rounded-lg bg-[color-mix(in_srgb,var(--border)_35%,var(--surface)_65%)] border border-[var(--border)]"
            role="tablist"
          >
            <button
              type="button"
              role="tab"
              :aria-selected="geoJsonTab === 'forecast'"
              class="px-3 py-1.5 rounded-md text-xs font-medium transition-colors border border-transparent"
              :class="geoJsonTab === 'forecast'
                ? 'bg-[var(--surface)] text-[var(--text)] border-[var(--border)] shadow-[var(--shadow-sm)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text)]'"
              @click="geoJsonTab = 'forecast'"
            >
              Forecast request
            </button>
            <button
              type="button"
              role="tab"
              :aria-selected="geoJsonTab === 'route'"
              class="px-3 py-1.5 rounded-md text-xs font-medium transition-colors border border-transparent"
              :class="geoJsonTab === 'route'
                ? 'bg-[var(--surface)] text-[var(--text)] border-[var(--border)] shadow-[var(--shadow-sm)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text)]'"
              @click="geoJsonTab = 'route'"
            >
              Route (LineString)
            </button>
          </div>
          <textarea
            class="w-full min-h-[220px] resize-y px-3 py-2 text-xs font-mono border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]"
            :value="activeGeoJsonText"
            readonly
            spellcheck="false"
          />
        </div>
      </details>

      <!-- Error -->
      <div
        v-if="processError"
        class="rounded-lg border border-[var(--danger,#ef4444)] bg-[color-mix(in_srgb,var(--danger,#ef4444)_8%,var(--surface)_92%)] px-4 py-3 text-sm text-[var(--danger,#ef4444)]"
      >
        <strong>Error:</strong> {{ processError }}
      </div>

      <!-- Action bar -->
      <div class="flex items-center justify-end gap-3 pt-1">
        <button
          type="button"
          class="px-6 py-2.5 rounded-xl text-sm font-semibold cursor-pointer bg-[var(--primary)] text-[var(--color-white)] border-none shadow-[var(--shadow-md)] transition-[opacity,box-shadow] duration-200 hover:opacity-95 hover:shadow-[0_6px_20px_var(--primary-glow)] disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none"
          :disabled="isLoading"
          @click="handleProcess"
        >
          {{ isLoading ? 'Memproses...' : 'Proses Forecast' }}
        </button>
      </div>
    </div>

    <ManualRouteModal
      v-model="showModal"
      @submit="onManualRouteSubmit"
    />
  </section>
</template>

<script setup lang="ts">
import ManualRouteModal from './ManualRouteModal.vue'

const { routeInfo, manualRouteData, selectedStation, availableRoutes, selectedRouteId, processRoute, isLoading, processError, saveRoute, selectRouteById, forecastTimeStep, splitPointCoordinates, forecastReq } = useMaritimeData()

const stationOptions = [
  'Stasiun Maritim Bitung',
  'Stasiun Maritim Ambon'
]

const showModal = ref(false)

const routeNameText = computed(() => {
  return manualRouteData.value?.routeName
    || [routeInfo.value.portOrigin, routeInfo.value.portDestination].filter(Boolean).join(' - ')
    || ''
})

const canFlipRoute = computed(() => (manualRouteData.value?.coordinates?.length ?? 0) >= 2)

function flipRouteDirection() {
  if (!canFlipRoute.value || !manualRouteData.value) return

  const nextOrigin = routeInfo.value.portDestination
  const nextDestination = routeInfo.value.portOrigin

  // If the currently selected route exists in `availableRoutes` (i.e., not a custom manual "dataserve" route),
  // prefer switching to the canonical reverse route to keep the dropdown label consistent.
  const currentId = selectedRouteId.value
  const isUsingPredefinedRoute = currentId !== 'dataserve' && availableRoutes.value.some(r => r.id === currentId)
  const matchingReverseRoute = availableRoutes.value.find(
    r => r.portOrigin === nextOrigin && r.portDestination === nextDestination
  )

  if (isUsingPredefinedRoute && matchingReverseRoute) {
    selectRouteById(matchingReverseRoute.id)
    return
  }

  // Otherwise: swap ports + reverse the polyline so fraction 0 (departure) is at the new origin.
  routeInfo.value.portOrigin = nextOrigin
  routeInfo.value.portDestination = nextDestination
  manualRouteData.value.coordinates = [...manualRouteData.value.coordinates].reverse()

  // Keep the UI + GeoJSON route name consistent with the swapped direction.
  const parts = [routeInfo.value.portOrigin, routeInfo.value.portDestination].filter(Boolean)
  manualRouteData.value.routeName = parts.join(' - ')
}

const MONTHS_ID = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']

function pad2(n: number) {
  return String(n).padStart(2, '0')
}

// "nearest hour" where minutes >= 30 rounds up (UTC).
// Example: 16:28 -> 16:00; 16:31 -> 17:00
function getNowNearestHourUtcParts() {
  const nowMs = Date.now()
  const dt = new Date(nowMs)

  const minutes = dt.getUTCMinutes()
  const seconds = dt.getUTCSeconds()
  const millis = dt.getUTCMilliseconds()
  const msIntoHour = (minutes * 60 + seconds) * 1000 + millis

  const roundedMs = nowMs - msIntoHour + (minutes >= 30 ? 3600000 : 0)
  const rounded = new Date(roundedMs)

  const year = rounded.getUTCFullYear()
  const month = rounded.getUTCMonth() + 1
  const day = rounded.getUTCDate()
  const hour = rounded.getUTCHours()

  return {
    dateStr: `${year}-${pad2(month)}-${pad2(day)}`,
    timeStr: `${pad2(hour)}:00`
  }
}

function addHoursToUtcParts(dateStr: string, timeStr: string, hours: number) {
  const dateParts = dateStr.split('-')
  if (dateParts.length !== 3) return { dateStr, timeStr }
  const y = Number(dateParts[0])
  const m = Number(dateParts[1]) - 1
  const d = Number(dateParts[2])

  const timeParts = timeStr.split(':')
  if (timeParts.length < 2) return { dateStr, timeStr }
  const hh = Number(timeParts[0])
  const mm = Number(timeParts[1])
  if (![y, m, d, hh, mm].every(n => Number.isFinite(n))) return { dateStr, timeStr }

  const base = Date.UTC(y, m, d, hh, mm, 0, 0)
  const next = base + hours * 3600000
  const dt = new Date(next)

  return {
    dateStr: `${dt.getUTCFullYear()}-${pad2(dt.getUTCMonth() + 1)}-${pad2(dt.getUTCDate())}`,
    timeStr: `${pad2(dt.getUTCHours())}:${pad2(dt.getUTCMinutes())}`
  }
}

onMounted(() => {
  const dep = getNowNearestHourUtcParts()
  const arr = addHoursToUtcParts(dep.dateStr, dep.timeStr, 2)

  routeInfo.value.departureDate = dep.dateStr
  routeInfo.value.departureTime = dep.timeStr

  routeInfo.value.arrivalDate = arr.dateStr
  routeInfo.value.arrivalTime = arr.timeStr

  // Issued follows the same "today nearest hour" rule.
  routeInfo.value.issuedDate = dep.dateStr
  routeInfo.value.issuedTime = dep.timeStr
})

// Inputs are interpreted as UTC instants; output is a human-friendly UTC label.
function formatUtcDateTime(dateStr: string, timeStr: string) {
  if (!dateStr || !timeStr) return ''
  const dateParts = dateStr.split('-')
  if (dateParts.length !== 3) return ''
  const y = Number(dateParts[0])
  const m = Number(dateParts[1]) - 1
  const d = Number(dateParts[2])
  const timeParts = timeStr.split(':')
  if (timeParts.length < 2) return ''
  const hh = Number(timeParts[0])
  const mm = Number(timeParts[1])
  if ([y, m, d, hh, mm].some(n => !Number.isFinite(n))) return ''

  const dt = new Date(Date.UTC(y, m, d, hh, mm, 0))

  const day = dt.getUTCDate()
  const monthName = MONTHS_ID[dt.getUTCMonth()]
  const year = dt.getUTCFullYear()
  const hour = String(dt.getUTCHours()).padStart(2, '0')
  const minute = String(dt.getUTCMinutes()).padStart(2, '0')

  return `${day} ${monthName} ${year} pukul ${hour}:${minute}`
}

const departureTimeText = computed(() => formatUtcDateTime(routeInfo.value.departureDate, routeInfo.value.departureTime))
const arrivalTimeText = computed(() => formatUtcDateTime(routeInfo.value.arrivalDate, routeInfo.value.arrivalTime))
const issuedTimeText = computed(() => formatUtcDateTime(routeInfo.value.issuedDate, routeInfo.value.issuedTime))

const geoJsonHasRoute = computed(() => !!manualRouteData.value?.coordinates && manualRouteData.value.coordinates.length >= 2)

function parseDateTime(dateStr: string, timeStr: string): Date | null {
  if (!dateStr || !timeStr) return null
  const dateParts = dateStr.split('-')
  if (dateParts.length !== 3) return null
  const y = Number(dateParts[0])
  const m = Number(dateParts[1]) - 1
  const d = Number(dateParts[2])
  const timeParts = timeStr.split(':')
  if (timeParts.length < 2) return null
  const hh = Number(timeParts[0])
  const mm = Number(timeParts[1])
  if ([y, m, d, hh, mm].some(n => !Number.isFinite(n))) return null

  // Interpret app inputs as UTC.
  return new Date(Date.UTC(y, m, d, hh, mm, 0))
}

function toRad(deg: number) {
  return deg * Math.PI / 180
}

// Haversine distance along the WGS84 sphere; output is nautical miles (NM)
function distanceNmBetween(a: [number, number], b: [number, number]) {
  const [lng1, lat1] = a
  const [lng2, lat2] = b
  const R = 6371e3 // meters
  const phi1 = toRad(lat1)
  const phi2 = toRad(lat2)
  const dPhi = toRad(lat2 - lat1)
  const dLambda = toRad(lng2 - lng1)
  const sinDphi = Math.sin(dPhi / 2)
  const sinDlambda = Math.sin(dLambda / 2)
  const h = sinDphi * sinDphi + Math.cos(phi1) * Math.cos(phi2) * sinDlambda * sinDlambda
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h))
  const meters = R * c
  return meters / 1852
}

function formatDurationFromHours(hours: number) {
  if (!Number.isFinite(hours) || hours <= 0) return ''
  const totalMinutes = Math.round(hours * 60)
  const h = Math.floor(totalMinutes / 60)
  const m = totalMinutes % 60
  return `${h} jam ${m} menit`
}

const routeDistanceNm = computed(() => {
  if (!geoJsonHasRoute.value) return 0
  const coords = manualRouteData.value!.coordinates
  let sum = 0
  for (let i = 1; i < coords.length; i++) {
    sum += distanceNmBetween(coords[i - 1]!, coords[i]!)
  }
  return sum
})

const routeDurationHours = computed(() => {
  const dep = parseDateTime(routeInfo.value.departureDate, routeInfo.value.departureTime)
  const arr = parseDateTime(routeInfo.value.arrivalDate, routeInfo.value.arrivalTime)
  if (!dep || !arr) return null
  const diffMs = arr.getTime() - dep.getTime()
  if (!Number.isFinite(diffMs) || diffMs <= 0) return null
  return diffMs / (1000 * 60 * 60)
})

const shipSpeedKnots = computed(() => {
  const durHours = routeDurationHours.value
  if (!durHours || durHours <= 0) return null
  const distance = routeDistanceNm.value
  if (!distance || distance <= 0) return null
  return distance / durHours
})

const shipEstDurationHours = computed(() => {
  const speed = shipSpeedKnots.value
  if (!speed || speed <= 0) return null
  const distance = routeDistanceNm.value
  if (!distance || distance <= 0) return null
  return distance / speed
})

const shipSpeedKnotsText = computed(() => {
  const v = shipSpeedKnots.value
  if (v == null) return ''
  const kmh = v * 1.852
  return `${v.toFixed(2)} knot (${kmh.toFixed(2)} km/h)`
})

const routeDistanceNmText = computed(() => {
  const d = routeDistanceNm.value
  if (!Number.isFinite(d) || d <= 0) return ''
  const km = d * 1.852
  return `${d.toFixed(2)} NM (${km.toFixed(2)} km)`
})

const shipEstDurationText = computed(() => {
  const v = shipEstDurationHours.value
  return v == null ? '' : formatDurationFromHours(v)
})

const geoJson = computed<GeoJSON.FeatureCollection>(() => {
  if (!geoJsonHasRoute.value) {
    return { type: 'FeatureCollection', features: [] }
  }
  const coords = manualRouteData.value!.coordinates
  const ring = manualRouteData.value?.boundingRectangle
  const lineFeature: GeoJSON.Feature = {
    type: 'Feature',
    properties: {
      station: selectedStation.value,
      shipName: routeInfo.value.shipName,
      routeName: routeNameText.value,
      departureTime: departureTimeText.value,
      arrivalTime: arrivalTimeText.value,
      issuedTime: issuedTimeText.value,
        timeZone: 'UTC',
      forecastTimeStepHours: forecastTimeStep.value,
      shipSpeedKnots: shipSpeedKnots.value == null ? null : Number(shipSpeedKnots.value.toFixed(2)),
      shipEstimationDuration: shipEstDurationText.value || null,
      routeDistanceNm: routeDistanceNm.value > 0 ? Number(routeDistanceNm.value.toFixed(2)) : null,
      routeDurationHours: routeDurationHours.value == null ? null : Number(routeDurationHours.value.toFixed(3)),
      a: routeInfo.value.portOrigin,
      b: routeInfo.value.portDestination,
      location: 'route'
    },
    geometry: {
      type: 'LineString',
      coordinates: coords
    }
  }
  const features: GeoJSON.Feature[] = [lineFeature]
  if (ring && ring.length >= 4) {
    features.push({
      type: 'Feature',
      properties: {
        station: selectedStation.value,
        routeName: routeNameText.value,
        location: 'bounding-rectangle'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [ring]
      }
    })
  }
  return { type: 'FeatureCollection', features }
})

const geoJsonText = computed(() => JSON.stringify(geoJson.value, null, 2))

const forecastReqText = computed(() => JSON.stringify(forecastReq.value, null, 2))

const geoJsonTab = ref<'route' | 'forecast'>('forecast')

const activeGeoJsonText = computed(() =>
  geoJsonTab.value === 'route' ? geoJsonText.value : forecastReqText.value
)

/** Route tab needs a polyline; forecast tab always has a valid JSON object (may be empty features). */
const canCopyGeoJson = computed(() =>
  geoJsonTab.value === 'route' ? geoJsonHasRoute.value : true
)

const copied = ref(false)

async function copyGeoJson() {
  if (!canCopyGeoJson.value || !activeGeoJsonText.value) return
  try {
    await navigator.clipboard.writeText(activeGeoJsonText.value)
    copied.value = true
    setTimeout(() => { copied.value = false }, 1200)
  } catch {
    // Fallback: older browsers may not allow clipboard without permissions.
    const ta = document.createElement('textarea')
    ta.value = activeGeoJsonText.value
    ta.setAttribute('readonly', 'true')
    ta.style.position = 'absolute'
    ta.style.left = '-9999px'
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    document.body.removeChild(ta)
    copied.value = true
    setTimeout(() => { copied.value = false }, 1200)
  }
}

function openManualRouteModal() {
  showModal.value = true
}

async function onManualRouteSubmit(data: {
  routeName: string
  coordinates: [number, number][]
  boundingRectangle?: [number, number][]
  from?: string
  to?: string
}) {
  manualRouteData.value = {
    routeName: data.routeName,
    coordinates: data.coordinates,
    ...(data.boundingRectangle?.length ? { boundingRectangle: data.boundingRectangle } : {})
  }

  const from = data.from?.trim() || ''
  const to = data.to?.trim() || ''

  if (from) routeInfo.value.portOrigin = from
  if (to) routeInfo.value.portDestination = to

  // Backward compatibility: if user didn't fill From/To, infer it from "Nama Rute".
  if ((!from || !to) && data.routeName) {
    const parts = data.routeName.split('-').map((s) => s.trim()).filter(Boolean)
    if (!from && parts.length >= 1) routeInfo.value.portOrigin = parts[0] ?? ''
    if (!to && parts.length >= 2) routeInfo.value.portDestination = parts[1] ?? ''
  }
  await saveRoute(data)
}

async function handleProcess() {
  await processRoute()
}
</script>

<style scoped>
.ri-select {
  @apply px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--surface)] shadow-[var(--shadow-sm)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-ring)];
}
.ri-input {
  @apply px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--surface)] shadow-[var(--shadow-sm)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-ring)];
}
.ri-input-static {
  @apply px-3 py-2 text-sm font-semibold text-[var(--primary)] border border-[var(--border)] rounded-lg bg-[color-mix(in_srgb,var(--primary)_6%,var(--surface)_94%)];
}
.ri-label {
  @apply text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide;
}
.ri-label-inline {
  @apply text-xs font-medium text-[var(--text)] whitespace-nowrap;
}
.ri-btn-outline {
  @apply inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium cursor-pointer bg-[var(--surface)] text-[var(--primary)] border border-[var(--primary)] shadow-[var(--shadow-sm)] transition-colors duration-200 hover:bg-[var(--primary-hover)] disabled:opacity-60 disabled:cursor-not-allowed;
}
.ri-stat-cell {
  @apply flex flex-col gap-0.5 px-4 py-3 border-b border-r border-[var(--border)] last:border-r-0;
}
.ri-stat-cell dt {
  @apply text-[0.65rem] font-semibold uppercase tracking-wider text-[var(--text-muted)];
}
.ri-stat-cell dd {
  @apply text-xs font-medium text-[var(--text)] break-words m-0 leading-snug;
}
</style>
