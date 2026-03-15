<template>
  <section class="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-6 mb-6">
    <h2 class="text-base font-semibold m-0 mb-4 text-[var(--text)]">Informasi Rute Pelayaran</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
      <div class="flex flex-col gap-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex flex-col gap-1.5">
            <label for="ship-name" class="text-sm font-medium text-[var(--text)]">Nama Kapal</label>
            <input
              id="ship-name"
              v-model="routeInfo.shipName"
              type="text"
              class="px-3 py-2 text-sm border border-[var(--border)] rounded-md focus:outline-none focus:border-[var(--primary)]"
              placeholder="Contoh: KM. Dharma Lintas Utama"
            />
          </div>
          <div class="flex flex-col gap-1.5">
            <label for="route-select" class="text-sm font-medium text-[var(--text)]">Route</label>
            <select
              id="route-select"
              :value="selectedRouteId"
              class="px-3 py-2 text-sm border border-[var(--border)] rounded-md focus:outline-none focus:border-[var(--primary)] bg-white"
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
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-medium text-[var(--text)]">Waktu Keberangkatan</label>
            <div class="flex items-center gap-2 flex-wrap">
              <input
                id="departure-date"
                v-model="routeInfo.departureDate"
                type="date"
                class="flex-1 min-w-0 px-3 py-2 text-sm border border-[var(--border)] rounded-md focus:outline-none focus:border-[var(--primary)]"
                placeholder="Tanggal"
              />
              <input
                id="departure-time"
                v-model="routeInfo.departureTime"
                type="time"
                class="flex-1 min-w-0 px-3 py-2 text-sm border border-[var(--border)] rounded-md focus:outline-none focus:border-[var(--primary)]"
                placeholder="Waktu"
              />
              <span class="text-xs text-[var(--text-muted)] whitespace-nowrap">LT</span>
            </div>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-medium text-[var(--text)]">Waktu Tiba</label>
            <div class="flex items-center gap-2 flex-wrap">
              <input
                id="arrival-date"
                v-model="routeInfo.arrivalDate"
                type="date"
                class="flex-1 min-w-0 px-3 py-2 text-sm border border-[var(--border)] rounded-md focus:outline-none focus:border-[var(--primary)]"
              />
              <input
                id="arrival-time"
                v-model="routeInfo.arrivalTime"
                type="time"
                class="flex-1 min-w-0 px-3 py-2 text-sm border border-[var(--border)] rounded-md focus:outline-none focus:border-[var(--primary)]"
              />
              <span class="text-xs text-[var(--text-muted)] whitespace-nowrap">LT</span>
            </div>
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-medium text-[var(--text)]">Issued</label>
            <div class="flex items-center gap-2 flex-wrap">
              <input
                id="issued-date"
                v-model="routeInfo.issuedDate"
                type="date"
                class="flex-1 min-w-0 px-3 py-2 text-sm border border-[var(--border)] rounded-md focus:outline-none focus:border-[var(--primary)]"
              />
              <input
                id="issued-time"
                v-model="routeInfo.issuedTime"
                type="time"
                class="flex-1 min-w-0 px-3 py-2 text-sm border border-[var(--border)] rounded-md focus:outline-none focus:border-[var(--primary)]"
              />
              <span class="text-xs text-[var(--text-muted)] whitespace-nowrap">LT</span>
            </div>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex flex-col gap-1.5">
            <label for="forecaster" class="text-sm font-medium text-[var(--text)]">Forecaster</label>
            <input
              id="forecaster"
              v-model="routeInfo.forecaster"
              type="text"
              class="px-3 py-2 text-sm border border-[var(--border)] rounded-md focus:outline-none focus:border-[var(--primary)]"
              placeholder="Nama forecaster"
            />
          </div>
        </div>
      </div>
      <div class="min-h-[300px] min-w-0 w-full">
        <SectionsRouteMap :route-coordinates="manualRouteData?.coordinates ?? undefined" />
      </div>
    </div>
    <div class="flex items-center justify-end pt-4 flex-wrap gap-4">
      <div class="flex gap-3 items-center">
        <button
          type="button"
          class="px-5 py-2 rounded-md text-sm font-medium cursor-pointer bg-transparent text-[var(--primary)] border border-[var(--primary)] transition-opacity duration-200 hover:bg-[rgba(15,118,110,0.1)]"
          @click="openManualRouteModal"
        >
          Buat Rute Manual
        </button>
        <button
          type="button"
          class="px-5 py-2 rounded-md text-sm font-medium cursor-pointer bg-[var(--primary)] text-white border-none transition-opacity duration-200 hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
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

const { routeInfo, manualRouteData, availableRoutes, selectedRouteId, processRoute, isLoading, saveRoute, selectRouteById } = useMaritimeData()

const showModal = ref(false)

function openManualRouteModal() {
  showModal.value = true
}

async function onManualRouteSubmit(data: { routeName: string; coordinates: [number, number][] }) {
  manualRouteData.value = { routeName: data.routeName, coordinates: data.coordinates }
  if (data.routeName) {
    const parts = data.routeName.split('-').map((s) => s.trim()).filter(Boolean)
    if (parts.length >= 1) routeInfo.value.portOrigin = parts[0] ?? ''
    if (parts.length >= 2) routeInfo.value.portDestination = parts[1] ?? ''
  }
  await saveRoute(data)
}

async function handleProcess() {
  await processRoute()
}
</script>
