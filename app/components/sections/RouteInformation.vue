<template>
  <section
    class="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 shadow-[var(--shadow-card)]"
  >
    <div class="mb-5 rounded-lg border border-[color-mix(in_srgb,var(--accent)_30%,var(--border)_70%)] bg-[color-mix(in_srgb,var(--accent)_8%,var(--surface)_92%)] px-4 py-3">
      <h2 class="inline-flex items-center rounded-md bg-[color-mix(in_srgb,var(--accent)_18%,white_82%)] px-2.5 py-1 text-base font-semibold m-0 mb-1 text-[var(--text)]">
        Informasi Rute Pelayaran
      </h2>
      <p class="text-xs text-[var(--text-muted)] m-0">Data kapal, jadwal, dan peta rute</p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
      <div class="flex flex-col gap-1.5">
        <label for="station-select" class="text-sm font-medium text-[var(--text)]">Stasiun</label>
        <select
          id="station-select"
          v-model="selectedStation"
          class="px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--surface)] shadow-[var(--shadow-sm)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-ring)]"
        >
          <option
            v-for="s in stationOptions"
            :key="s"
            :value="s"
          >
            {{ s }}
          </option>
        </select>
      </div>
      <div class="flex flex-col gap-1.5">
        <label for="top-route-select" class="text-sm font-medium text-[var(--text)]">Rute</label>
        <select
          id="top-route-select"
          :value="selectedRouteId"
          class="px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--surface)] shadow-[var(--shadow-sm)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-ring)]"
          @change="selectRouteById(($event.target as HTMLSelectElement).value)"
        >
          <option value="">
            Pilih rute...
          </option>
          <option
            v-for="r in availableRoutes"
            :key="r.id"
            :value="r.id"
          >
            {{ r.label }}
          </option>
        </select>
        <button
          type="button"
          class="w-fit px-3 py-2 rounded-lg text-sm font-medium cursor-pointer bg-[var(--surface)] text-[var(--primary)] border border-[var(--primary)] shadow-[var(--shadow-sm)] transition-colors duration-200 hover:bg-[var(--primary-hover)] disabled:opacity-60 disabled:cursor-not-allowed"
          :disabled="!canFlipRoute"
          @click="flipRouteDirection"
        >
          Switch
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
      <div class="flex flex-col gap-4">
        <!-- Kapal -->
        <div class="rounded-lg border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_94%,var(--primary)_6%)] p-4">
          <h3 class="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)] m-0 mb-3">Kapal</h3>
          <div class="flex flex-col gap-1.5">
            <label for="ship-name" class="text-sm font-medium text-[var(--text)]">Nama Kapal</label>
            <input
              id="ship-name"
              v-model="routeInfo.shipName"
              type="text"
              class="px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--surface)] shadow-[var(--shadow-sm)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-ring)]"
              placeholder="Contoh: KM. Dharma Lintas Utama"
            />
          </div>
        </div>

        <!-- Zona Waktu -->
        <div class="rounded-lg border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_94%,var(--accent)_6%)] p-4">
          <h3 class="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)] m-0 mb-3">Zona Waktu</h3>
          <div class="flex flex-col gap-1.5">
            <span class="text-sm font-medium text-[var(--text)]">
              UTC
            </span>
          </div>
        </div>

        <!-- Jadwal -->
        <div class="rounded-lg border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_94%,var(--primary)_6%)] p-4">
          <h3 class="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)] m-0 mb-3">Jadwal</h3>
          <div class="flex flex-col gap-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="flex flex-col gap-1.5">
                <label class="text-sm font-medium text-[var(--text)]">Waktu Keberangkatan</label>
                <div class="flex items-center gap-2 flex-wrap">
                  <input
                    id="departure-date"
                    v-model="routeInfo.departureDate"
                    type="date"
                    class="flex-1 min-w-0 px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--surface)] shadow-[var(--shadow-sm)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-ring)]"
                    placeholder="Tanggal"
                  />
                  <input
                    id="departure-time"
                    v-model="routeInfo.departureTime"
                    type="time"
                    class="flex-1 min-w-0 px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--surface)] shadow-[var(--shadow-sm)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-ring)]"
                    placeholder="Waktu"
                  />
                </div>
              </div>
              <div class="flex flex-col gap-1.5">
                <label class="text-sm font-medium text-[var(--text)]">Waktu Tiba</label>
                <div class="flex items-center gap-2 flex-wrap">
                  <input
                    id="arrival-date"
                    v-model="routeInfo.arrivalDate"
                    type="date"
                    class="flex-1 min-w-0 px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--surface)] shadow-[var(--shadow-sm)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-ring)]"
                    placeholder="Tanggal"
                  />
                  <input
                    id="arrival-time"
                    v-model="routeInfo.arrivalTime"
                    type="time"
                    class="flex-1 min-w-0 px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--surface)] shadow-[var(--shadow-sm)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-ring)]"
                    placeholder="Waktu"
                  />
                </div>
              </div>
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-sm font-medium text-[var(--text)]">Issued</label>
              <div class="flex items-center gap-2 flex-wrap">
                <input
                  id="issued-date"
                  v-model="routeInfo.issuedDate"
                  type="date"
                  class="flex-1 min-w-0 px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--surface)] shadow-[var(--shadow-sm)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-ring)]"
                  placeholder="Tanggal"
                />
                <input
                  id="issued-time"
                  v-model="routeInfo.issuedTime"
                  type="time"
                  class="flex-1 min-w-0 px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--surface)] shadow-[var(--shadow-sm)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-ring)]"
                  placeholder="Waktu"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Forecast Time Step -->
        <div class="rounded-lg border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_94%,var(--accent)_6%)] p-4">
          <h3 class="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)] m-0 mb-3">Forecast Time Step</h3>
          <div class="flex flex-col gap-1.5">
            <span class="text-sm font-medium text-[var(--text)]">
              Pilih: <span class="text-[var(--primary)]">{{ forecastTimeStep }} jam</span>
            </span>
            <div class="flex flex-nowrap gap-2">
              <label class="flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)] cursor-pointer hover:border-[var(--accent)]">
                <input
                  type="checkbox"
                  class="accent-[var(--primary)]"
                  :checked="forecastTimeStep === 1"
                  @change="(e) => { if ((e.target as HTMLInputElement).checked) forecastTimeStep = 1 }"
                >
                <span class="text-sm font-medium text-[var(--text)]">1 Jam</span>
              </label>

              <label class="flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)] cursor-pointer hover:border-[var(--accent)]">
                <input
                  type="checkbox"
                  class="accent-[var(--primary)]"
                  :checked="forecastTimeStep === 3"
                  @change="(e) => { if ((e.target as HTMLInputElement).checked) forecastTimeStep = 3 }"
                >
                <span class="text-sm font-medium text-[var(--text)]">3 Jam</span>
              </label>

              <label class="flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)] cursor-pointer hover:border-[var(--accent)]">
                <input
                  type="checkbox"
                  class="accent-[var(--primary)]"
                  :checked="forecastTimeStep === 6"
                  @change="(e) => { if ((e.target as HTMLInputElement).checked) forecastTimeStep = 6 }"
                >
                <span class="text-sm font-medium text-[var(--text)]">6 Jam</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Forecaster & PDF header (upt / kontak) -->
        <div class="rounded-lg border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_94%,var(--accent)_6%)] p-4">
          <h3 class="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)] m-0 mb-3">Forecaster &amp; header PDF</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="flex flex-col gap-1.5 md:col-span-2">
              <label for="forecaster" class="text-sm font-medium text-[var(--text)]">Forecaster</label>
              <input
                id="forecaster"
                v-model="routeInfo.forecaster"
                type="text"
                class="px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--surface)] shadow-[var(--shadow-sm)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-ring)]"
                placeholder="Nama forecaster"
              />
            </div>
            <div class="flex flex-col gap-1.5">
              <label for="nama-upt" class="text-sm font-medium text-[var(--text)]">Nama Upt</label>
              <input
                id="nama-upt"
                v-model="routeInfo.namaUpt"
                type="text"
                class="px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--surface)] shadow-[var(--shadow-sm)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-ring)]"
                placeholder="Nama unit pelaksana teknis"
              />
            </div>
            <div class="flex flex-col gap-1.5 md:col-span-2">
              <label for="pdf-alamat" class="text-sm font-medium text-[var(--text)]">Alamat</label>
              <textarea
                id="pdf-alamat"
                v-model="routeInfo.alamat"
                rows="2"
                class="px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--surface)] shadow-[var(--shadow-sm)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-ring)] resize-y min-h-[2.75rem]"
                placeholder="Alamat lengkap kantor (header PDF)"
              />
            </div>
            <div class="flex flex-col gap-1.5">
              <label for="pdf-telp" class="text-sm font-medium text-[var(--text)]">Telp</label>
              <input
                id="pdf-telp"
                v-model="routeInfo.telp"
                type="text"
                class="px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--surface)] shadow-[var(--shadow-sm)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-ring)]"
                placeholder="Nomor telepon"
              />
            </div>
            <div class="flex flex-col gap-1.5">
              <label for="pdf-email" class="text-sm font-medium text-[var(--text)]">Email</label>
              <input
                id="pdf-email"
                v-model="routeInfo.email"
                type="email"
                autocomplete="email"
                class="px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--surface)] shadow-[var(--shadow-sm)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-ring)]"
                placeholder="email@domain.go.id"
              />
            </div>
          </div>
          <ClientOnly>
            <SectionsSignaturePdfForm class="mt-4 pt-4 border-t border-[var(--border)]" />
            <template #fallback>
              <p class="mt-4 pt-4 border-t border-[var(--border)] text-xs text-[var(--text-muted)] m-0">
                Memuat form tanda tangan…
              </p>
            </template>
          </ClientOnly>
        </div>
      </div>
      <div class="flex flex-col gap-4 min-w-0 w-full">
        <div class="min-h-[300px] min-w-0 w-full">
          <SectionsRouteMap
            :route-coordinates="manualRouteData?.coordinates ?? undefined"
            :split-markers="splitPointCoordinates"
            :polygon-ring="manualRouteData?.boundingRectangle ?? undefined"
          />
        </div>
        <div class="rounded-xl p-4 border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)]">
          <h3 class="text-sm font-semibold m-0 mb-3 text-[var(--text)]">Summary Request</h3>
          <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
            <div>
              <dt class="text-xs text-[var(--text-muted)] mb-1">Stasiun</dt>
              <dd class="text-sm font-medium text-[var(--text)] break-words">
                {{ selectedStation || '-' }}
              </dd>
            </div>
            <div>
              <dt class="text-xs text-[var(--text-muted)] mb-1">Route name</dt>
              <dd class="text-sm font-medium text-[var(--text)] break-words">
                {{ routeNameText || '-' }}
              </dd>
            </div>
            <div>
              <dt class="text-xs text-[var(--text-muted)] mb-1">Ship name</dt>
              <dd class="text-sm font-medium text-[var(--text)] break-words">
                {{ routeInfo.shipName || '-' }}
              </dd>
            </div>
            <div>
              <dt class="text-xs text-[var(--text-muted)] mb-1">Forecast time step</dt>
              <dd class="text-sm font-medium text-[var(--text)] break-words">
                {{ forecastTimeStep }} jam
              </dd>
            </div>
            <div>
              <dt class="text-xs text-[var(--text-muted)] mb-1">Departure time</dt>
              <dd class="text-sm font-medium text-[var(--text)] break-words">
                {{ departureTimeText || '-' }}
              </dd>
            </div>
            <div>
              <dt class="text-xs text-[var(--text-muted)] mb-1">Arrival time</dt>
              <dd class="text-sm font-medium text-[var(--text)] break-words">
                {{ arrivalTimeText || '-' }}
              </dd>
            </div>
            <div class="sm:col-span-2">
              <dt class="text-xs text-[var(--text-muted)] mb-1">Issued Time</dt>
              <dd class="text-sm font-medium text-[var(--text)] break-words">
                {{ issuedTimeText || '-' }}
              </dd>
            </div>
            <div>
              <dt class="text-xs text-[var(--text-muted)] mb-1">Ship speed (route/duration)</dt>
              <dd class="text-sm font-medium text-[var(--text)] break-words">
                {{ shipSpeedKnotsText || '-' }}
              </dd>
            </div>
            <div>
              <dt class="text-xs text-[var(--text-muted)] mb-1">Route distance</dt>
              <dd class="text-sm font-medium text-[var(--text)] break-words">
                {{ routeDistanceNmText || '-' }}
              </dd>
            </div>
            <div>
              <dt class="text-xs text-[var(--text-muted)] mb-1">Ship estimation duration</dt>
              <dd class="text-sm font-medium text-[var(--text)] break-words">
                {{ shipEstDurationText || '-' }}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>

    <div class="mb-4">
      <div class="rounded-xl p-4 border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)]">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-3">
          <div class="min-w-0 flex-1">
            <h3 class="text-sm font-semibold m-0 text-[var(--text)]">GeoJSON</h3>
            <p class="text-xs text-[var(--text-muted)] m-0 mt-1">
              Pembaruan langsung: rute (LineString) atau permintaan prakiraan (Point per langkah waktu + dateTime).
            </p>
          </div>
          <button
            type="button"
            class="shrink-0 px-3 py-2 rounded-lg text-sm font-medium cursor-pointer bg-[var(--surface)] text-[var(--primary)] border border-[var(--primary)] shadow-[var(--shadow-sm)] transition-colors duration-200 hover:bg-[var(--primary-hover)] disabled:opacity-60 disabled:cursor-not-allowed"
            :disabled="!activeGeoJsonText || !canCopyGeoJson"
            @click="copyGeoJson"
          >
            {{ copied ? 'Copied' : 'Copy' }}
          </button>
        </div>
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
          class="w-full min-h-[280px] resize-y px-3 py-2 text-xs font-mono border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]"
          :value="activeGeoJsonText"
          readonly
          spellcheck="false"
        />
      </div>
    </div>

    <div
      v-if="processError"
      class="mt-4 rounded-lg border border-[var(--danger,#ef4444)] bg-[color-mix(in_srgb,var(--danger,#ef4444)_8%,var(--surface)_92%)] px-4 py-3 text-sm text-[var(--danger,#ef4444)]"
    >
      <strong>Error:</strong> {{ processError }}
    </div>

    <div class="flex items-center justify-end pt-4 flex-wrap gap-4">
      <div class="flex gap-3 items-center">
        <button
          type="button"
          class="px-5 py-2 rounded-lg text-sm font-medium cursor-pointer bg-[var(--surface)] text-[var(--primary)] border border-[var(--primary)] shadow-[var(--shadow-sm)] transition-colors duration-200 hover:bg-[var(--primary-hover)]"
          @click="openManualRouteModal"
        >
          Buat Rute Manual
        </button>
        <button
          type="button"
          class="px-5 py-2 rounded-lg text-sm font-medium cursor-pointer bg-[var(--primary)] text-[var(--color-white)] border-none shadow-[var(--shadow-md)] transition-[opacity,box-shadow] duration-200 hover:opacity-95 hover:shadow-[0_6px_20px_var(--primary-glow)] disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none"
          :disabled="isLoading"
          @click="handleProcess"
        >
          {{ isLoading ? 'Memproses...' : 'Proses' }}
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
