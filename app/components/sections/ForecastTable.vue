<template>
  <section
    class="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 shadow-[var(--shadow-card)]"
  >
    <div class="mb-4 rounded-lg border border-[color-mix(in_srgb,var(--accent)_30%,var(--border)_70%)] bg-[color-mix(in_srgb,var(--accent)_8%,var(--surface)_92%)] px-4 py-3 flex items-start justify-between gap-3">
      <div>
        <h2 class="inline-flex items-center rounded-md bg-[color-mix(in_srgb,var(--accent)_18%,var(--surface)_82%)] px-2.5 py-1 text-base font-semibold m-0 mb-1 text-[var(--text)]">
          Forecast Table Data
        </h2>
        <div v-if="hasModelMetadata" class="mb-4 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-xs text-[var(--text)]">
      <p class="m-0 font-semibold mb-1">Model Information</p>
      <p class="m-0 leading-relaxed">
        Wave: <span class="font-medium">{{ modelMetadata.wave_model || '-' }}</span>
        · Flow: <span class="font-medium">{{ modelMetadata.flow_model || '-' }}</span>
        · Atmos: <span class="font-medium">{{ modelMetadata.atmos_model || '-' }}</span>
        · Baserun: <span class="font-medium border-b">{{ formatBaserun(modelMetadata.baserun) }}</span>
      </p>
    </div>
      </div>
      <button
        type="button"
        class="shrink-0 py-2 px-4 bg-[var(--primary)] text-[var(--color-white)] border-none rounded-lg text-sm font-medium cursor-pointer shadow-[var(--shadow-sm)] transition-[opacity,box-shadow] duration-200 hover:opacity-95 hover:shadow-[0_4px_14px_var(--primary-glow)] disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="forecastData.length === 0"
        @click="showAdjustModal = true"
      >
        Adjust Data
      </button>
    </div>

    <div class="overflow-x-auto mb-4 rounded-lg shadow-[var(--shadow-sm)] border border-[var(--border)] bg-[var(--surface)]">
      <table class="w-full border-collapse text-[0.8125rem] [&_th]:py-2 [&_th]:px-3 [&_td]:py-2 [&_td]:px-3 [&_th]:text-left [&_td]:text-left [&_th]:border-b [&_td]:border-b [&_th]:border-[var(--border)] [&_td]:border-[var(--border)]">
        <tbody>
          <tr v-if="forecastData.length === 0">
            <td colspan="12" class="py-12 text-center text-[var(--text-muted)] text-sm">
              Belum ada data forecast.
            </td>
          </tr>
          <template v-for="(block, bIdx) in forecastDayBlocks" :key="block.dateKey + '-' + block.startIndex">
            <!-- Table header (repeated per day) -->
            <tr
              class="bg-[var(--table-header-bg)] text-[var(--table-header-text)] font-bold [&>th]:border-none [&>th]:border-b [&>th]:border-[var(--color-white)]/20 [&>th]:align-top [&>th]:py-2.5"
              :class="bIdx > 0 ? 'border-t-[3px] border-[var(--bulk-row-border)]' : ''"
            >
              <th class="whitespace-nowrap" scope="col">
                <span class="block leading-tight">Data</span>
                <span class="block text-[10px] font-normal text-[var(--table-header-text)]/80 mt-0.5">dd/mm/yy</span>
              </th>
              <th class="whitespace-nowrap" scope="col">
                <span class="block leading-tight">Waktu</span>
                <span class="block text-[10px] font-normal text-[var(--table-header-text)]/80 mt-0.5">—</span>
              </th>
              <th class="min-w-[16rem] w-[min(22rem,40vw)]" scope="col">
                <span class="block leading-tight">Koordinat</span>
                <span class="block text-[10px] font-normal text-[var(--table-header-text)]/80 mt-0.5">lat, lon</span>
              </th>
              <th class="whitespace-nowrap" scope="col">
                <span class="block leading-tight">Visibility</span>
                <span class="block text-[10px] font-normal text-[var(--table-header-text)]/80 mt-0.5">km</span>
              </th>
              <th class="whitespace-nowrap" scope="col">
                <span class="block leading-tight">Cuaca</span>
                <span class="block text-[10px] font-normal text-[var(--table-header-text)]/80 mt-0.5">kode</span>
              </th>
              <th class="whitespace-nowrap" scope="col">
                <span class="block leading-tight">Wave</span>
                <span class="block text-[10px] font-normal text-[var(--table-header-text)]/80 mt-0.5">m</span>
              </th>
              <th class="whitespace-nowrap" scope="col">
                <span class="block leading-tight">ws</span>
                <span class="block text-[10px] font-normal text-[var(--table-header-text)]/80 mt-0.5">kt</span>
              </th>
              <th class="whitespace-nowrap" scope="col">
                <span class="block leading-tight">wd</span>
                <span class="block text-[10px] font-normal text-[var(--table-header-text)]/80 mt-0.5">°</span>
              </th>
              <th class="whitespace-nowrap" scope="col">
                <span class="block leading-tight">aruss</span>
                <span class="block text-[10px] font-normal text-[var(--table-header-text)]/80 mt-0.5">cm/s</span>
              </th>
              <th class="whitespace-nowrap" scope="col">
                <span class="block leading-tight">arusd</span>
                <span class="block text-[10px] font-normal text-[var(--table-header-text)]/80 mt-0.5">°</span>
              </th>
              <th class="whitespace-nowrap" scope="col">
                <span class="block leading-tight">hsig</span>
                <span class="block text-[10px] font-normal text-[var(--table-header-text)]/80 mt-0.5">m</span>
              </th>
              <th class="w-10 text-center" scope="col">
                <span class="sr-only">Hapus</span>
              </th>
            </tr>
            <!-- Set all rows — only this date -->
            <tr
              class="bg-[var(--bulk-row-bg)] text-[var(--bulk-row-text)] border-t-2 border-[var(--bulk-row-border)] [&>th]:border [&>th]:border-[var(--bulk-row-border)] [&>th]:border-solid [&>th]:py-2.5 [&>th]:px-2 [&>th]:align-middle"
            >
              <th colspan="3" class="text-left text-[11px] font-semibold text-[var(--bulk-label-text)] whitespace-normal max-w-[14rem]" scope="row">
                <span class="block">Set all rows</span>
                <span class="block font-normal text-[var(--bulk-label-sub)] mt-0.5">{{ block.displayDate }}</span>
              </th>
              <th>
                <input
                  v-model="bulkPack(block.dateKey).visibility"
                  type="text"
                  placeholder="km"
                  :title="`Set visibility for all rows on ${block.displayDate}`"
                  class="w-full min-w-[56px] py-1.5 px-2 border border-[var(--bulk-input-border)] rounded-md bg-[var(--bulk-input-bg)] text-[var(--bulk-row-text)] text-xs placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent-ring)] focus:outline-none"
                  @change="applyBulkText('visibility', block.dateKey)"
                />
              </th>
              <th>
                <select
                  v-model="bulkPack(block.dateKey).weather"
                  :title="`Weather for all rows on ${block.displayDate}`"
                  class="w-full min-w-[4.5rem] max-w-[9rem] py-1.5 px-2 border border-[var(--bulk-input-border)] rounded-md bg-[var(--bulk-input-bg)] text-[var(--bulk-row-text)] text-xs cursor-pointer focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent-ring)] focus:outline-none"
                  @change="applyBulkWeather(block.dateKey)"
                >
                  <option value="">—</option>
                  <option
                    v-for="code in WEATHER_CODES_LIST"
                    :key="code"
                    :value="code"
                  >
                    {{ code }}
                  </option>
                </select>
              </th>
              <th>
                <input
                  v-model="bulkPack(block.dateKey).wave"
                  type="text"
                  placeholder="m"
                  class="w-full min-w-[56px] py-1.5 px-2 border border-[var(--bulk-input-border)] rounded-md bg-[var(--bulk-input-bg)] text-[var(--bulk-row-text)] text-xs placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent-ring)] focus:outline-none"
                  @change="applyBulkText('wave', block.dateKey)"
                />
              </th>
              <th>
                <input
                  v-model="bulkPack(block.dateKey).ws"
                  type="text"
                  placeholder="kt"
                  class="w-full min-w-[56px] py-1.5 px-2 border border-[var(--bulk-input-border)] rounded-md bg-[var(--bulk-input-bg)] text-[var(--bulk-row-text)] text-xs placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent-ring)] focus:outline-none"
                  @change="applyBulkText('ws', block.dateKey)"
                />
              </th>
              <th>
                <input
                  v-model="bulkPack(block.dateKey).wd"
                  type="text"
                  placeholder="°"
                  class="w-full min-w-[56px] py-1.5 px-2 border border-[var(--bulk-input-border)] rounded-md bg-[var(--bulk-input-bg)] text-[var(--bulk-row-text)] text-xs placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent-ring)] focus:outline-none"
                  @change="applyBulkText('wd', block.dateKey)"
                />
              </th>
              <th>
                <input
                  v-model="bulkPack(block.dateKey).aruss"
                  type="text"
                  placeholder="cm/s"
                  class="w-full min-w-[56px] py-1.5 px-2 border border-[var(--bulk-input-border)] rounded-md bg-[var(--bulk-input-bg)] text-[var(--bulk-row-text)] text-xs placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent-ring)] focus:outline-none"
                  @change="applyBulkText('aruss', block.dateKey)"
                />
              </th>
              <th>
                <input
                  v-model="bulkPack(block.dateKey).arusd"
                  type="text"
                  placeholder="°"
                  class="w-full min-w-[56px] py-1.5 px-2 border border-[var(--bulk-input-border)] rounded-md bg-[var(--bulk-input-bg)] text-[var(--bulk-row-text)] text-xs placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent-ring)] focus:outline-none"
                  @change="applyBulkText('arusd', block.dateKey)"
                />
              </th>
              <th>
                <input
                  v-model="bulkPack(block.dateKey).hsig"
                  type="text"
                  placeholder="m"
                  class="w-full min-w-[56px] py-1.5 px-2 border border-[var(--bulk-input-border)] rounded-md bg-[var(--bulk-input-bg)] text-[var(--bulk-row-text)] text-xs placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent-ring)] focus:outline-none"
                  @change="applyBulkText('hsig', block.dateKey)"
                />
              </th>
              <th class="w-10 text-center text-[var(--text-muted)] text-xs font-medium">
                —
              </th>
            </tr>
            <!-- Data rows for this day -->
            <tr
              v-for="(row, rowIdx) in block.rows"
              :key="row.id"
              class="group"
            >
              <td :class="[metaStripe(block.startIndex + rowIdx), 'align-middle font-bold text-[var(--text)]']">
                <span class="block min-w-[70px] py-1.5 px-2 rounded-md border border-transparent text-[var(--text)] select-text">{{ row.date || '—' }}</span>
              </td>
              <td :class="[metaStripe(block.startIndex + rowIdx), 'align-middle font-bold text-[var(--text)]']">
                <span class="block min-w-[70px] py-1.5 px-2 rounded-md border border-transparent text-[var(--text)] select-text">{{ row.time || '—' }}</span>
              </td>
              <td :class="[metaStripe(block.startIndex + rowIdx), 'align-middle min-w-[16rem] w-[min(22rem,40vw)] max-w-[28rem]']">
                <span class="block py-1.5 px-2 rounded-md border border-transparent font-mono text-[0.75rem] leading-snug text-[var(--text)] break-all whitespace-normal select-text">{{ row.coordinate || '—' }}</span>
              </td>
              <td :class="[fieldStripe(block.startIndex + rowIdx), 'align-middle']"><input v-model="row.visibility" type="text" placeholder="—" class="w-full min-w-[56px] py-1.5 px-2 border border-[var(--input-border)] rounded-md bg-[var(--input-bg)] text-[var(--text)] placeholder:text-[var(--text-muted)] hover:border-[var(--input-border)] focus:border-[var(--table-header-bg)] focus:bg-[var(--surface)] focus:outline-none" /></td>
              <td :class="[fieldStripe(block.startIndex + rowIdx), 'align-middle']">
                <select
                  v-model="row.weather"
                  class="w-full min-w-[4.5rem] max-w-[9rem] py-1.5 px-2 border border-[var(--input-border)] rounded-md bg-[var(--input-bg)] text-[var(--text)] hover:border-[var(--input-border)] focus:border-[var(--table-header-bg)] focus:bg-[var(--surface)] focus:outline-none cursor-pointer"
                >
                  <option value="">—</option>
                  <option
                    v-if="row.weather && !isStandardWeather(row.weather)"
                    :value="row.weather"
                  >
                    {{ row.weather }}
                  </option>
                  <option
                    v-for="code in WEATHER_CODES_LIST"
                    :key="code"
                    :value="code"
                  >
                    {{ code }}
                  </option>
                </select>
              </td>
              <td :class="[fieldStripe(block.startIndex + rowIdx), 'align-middle']"><input v-model="row.wave" type="text" placeholder="—" class="w-full min-w-[70px] py-1.5 px-2 border border-[var(--input-border)] rounded-md bg-[var(--input-bg)] text-[var(--text)] placeholder:text-[var(--text-muted)] hover:border-[var(--input-border)] focus:border-[var(--table-header-bg)] focus:bg-[var(--surface)] focus:outline-none" /></td>
              <td :class="[fieldStripe(block.startIndex + rowIdx), 'align-middle']"><input v-model="row.ws" type="text" placeholder="—" class="w-full min-w-[70px] py-1.5 px-2 border border-[var(--input-border)] rounded-md bg-[var(--input-bg)] text-[var(--text)] placeholder:text-[var(--text-muted)] hover:border-[var(--input-border)] focus:border-[var(--table-header-bg)] focus:bg-[var(--surface)] focus:outline-none" /></td>
              <td :class="[fieldStripe(block.startIndex + rowIdx), 'align-middle']"><input v-model="row.wd" type="text" placeholder="—" class="w-full min-w-[70px] py-1.5 px-2 border border-[var(--input-border)] rounded-md bg-[var(--input-bg)] text-[var(--text)] placeholder:text-[var(--text-muted)] hover:border-[var(--input-border)] focus:border-[var(--table-header-bg)] focus:bg-[var(--surface)] focus:outline-none" /></td>
              <td :class="[fieldStripe(block.startIndex + rowIdx), 'align-middle']"><input v-model="row.aruss" type="text" placeholder="—" class="w-full min-w-[70px] py-1.5 px-2 border border-[var(--input-border)] rounded-md bg-[var(--input-bg)] text-[var(--text)] placeholder:text-[var(--text-muted)] hover:border-[var(--input-border)] focus:border-[var(--table-header-bg)] focus:bg-[var(--surface)] focus:outline-none" /></td>
              <td :class="[fieldStripe(block.startIndex + rowIdx), 'align-middle']"><input v-model="row.arusd" type="text" placeholder="—" class="w-full min-w-[70px] py-1.5 px-2 border border-[var(--input-border)] rounded-md bg-[var(--input-bg)] text-[var(--text)] placeholder:text-[var(--text-muted)] hover:border-[var(--input-border)] focus:border-[var(--table-header-bg)] focus:bg-[var(--surface)] focus:outline-none" /></td>
              <td :class="[fieldStripe(block.startIndex + rowIdx), 'align-middle']"><input v-model="row.hsig" type="text" placeholder="—" class="w-full min-w-[70px] py-1.5 px-2 border border-[var(--input-border)] rounded-md bg-[var(--input-bg)] text-[var(--text)] placeholder:text-[var(--text-muted)] hover:border-[var(--input-border)] focus:border-[var(--table-header-bg)] focus:bg-[var(--surface)] focus:outline-none" /></td>
              <td :class="[fieldStripe(block.startIndex + rowIdx), 'w-10 text-center align-middle']">
                <button
                  type="button"
                  class="bg-none border-none text-[var(--text-muted)] text-xl cursor-pointer p-1 leading-none hover:text-[var(--danger)]"
                  aria-label="Hapus baris"
                  @click="removeRow(row.id)"
                >
                  ×
                </button>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
      <p class="text-xs text-[var(--text-muted)] mt-2 text-right">Drag to scroll right to see more →</p>
    </div>
    <ForecastAdjustModal v-model="showAdjustModal" />
  </section>
</template>

<script setup lang="ts">
import type { ForecastRow } from '~/composables/useMaritimeData'
import ForecastAdjustModal from './ForecastAdjustModal.vue'

const { forecastData, modelMetadata } = useMaritimeData()
const showAdjustModal = ref(false)

const hasModelMetadata = computed(() => (
  Boolean(modelMetadata.value.wave_model)
  || Boolean(modelMetadata.value.flow_model)
  || Boolean(modelMetadata.value.atmos_model)
  || Boolean(modelMetadata.value.baserun)
))

function formatBaserun(raw: string | undefined): string {
  const val = String(raw ?? '').trim()
  const m = /^(\d{4})(\d{2})(\d{2})(\d{2})\d{2}$/.exec(val)
  if (!m) return val || '-'
  const [, y, mo, d, h] = m
  return `${y}/${mo}/${d} ${h}`
}

type BulkTextField = 'visibility' | 'wave' | 'ws' | 'wd' | 'aruss' | 'arusd' | 'hsig'

function rowDateKey(date: string | undefined): string {
  return date ?? '__nodate__'
}

function rowMatchesDateKey(row: ForecastRow, dateKey: string): boolean {
  return rowDateKey(row.date) === dateKey
}

/** Consecutive rows with the same `date` form one block (one header + bulk row + data). */
const forecastDayBlocks = computed(() => {
  const rows = forecastData.value
  const out: { dateKey: string; displayDate: string; startIndex: number; rows: ForecastRow[] }[] = []
  let i = 0
  while (i < rows.length) {
    const first = rows[i]
    if (!first) break
    const dateKey = rowDateKey(first.date)
    const displayDate = first.date?.trim() || '—'
    const startIndex = i
    const chunk: ForecastRow[] = []
    while (i < rows.length) {
      const r = rows[i]
      if (!r || rowDateKey(r.date) !== dateKey) break
      chunk.push(r)
      i++
    }
    out.push({ dateKey, displayDate, startIndex, rows: chunk })
  }
  return out
})

type BulkPack = Record<BulkTextField, string> & { weather: string }

const emptyBulkPack = (): BulkPack => ({
  visibility: '',
  wave: '',
  ws: '',
  wd: '',
  aruss: '',
  arusd: '',
  hsig: '',
  weather: '',
})

const bulkByDate = reactive<Record<string, BulkPack>>({})

function bulkPack(dateKey: string): BulkPack {
  if (!bulkByDate[dateKey]) bulkByDate[dateKey] = emptyBulkPack()
  return bulkByDate[dateKey]
}

function applyBulkText(field: BulkTextField, dateKey: string) {
  const v = bulkPack(dateKey)[field]
  for (const row of forecastData.value) {
    if (rowMatchesDateKey(row, dateKey)) {
      row[field] = v
    }
  }
}

function applyBulkWeather(dateKey: string) {
  const v = bulkPack(dateKey).weather
  for (const row of forecastData.value) {
    if (rowMatchesDateKey(row, dateKey)) {
      row.weather = v
    }
  }
}

/** BMKG-style weather codes (matches PDF legend / en route WX column). */
const WEATHER_CODES_LIST = ['NSW', 'FU', 'FG', 'SL RA', 'MOD RA', 'HVY RA', 'SHRA', 'TSRA'] as const

const WEATHER_CODES = new Set<string>(WEATHER_CODES_LIST)

function isStandardWeather(v: string | undefined): boolean {
  return WEATHER_CODES.has((v ?? '').trim())
}

function metaStripe(index: number): string {
  return index % 2 === 0
    ? 'bg-[color-mix(in_srgb,var(--surface)_92%,var(--border)_8%)] group-hover:bg-[color-mix(in_srgb,var(--surface-hover)_92%,var(--border)_8%)]'
    : 'bg-[color-mix(in_srgb,var(--surface)_86%,var(--border)_14%)] group-hover:bg-[color-mix(in_srgb,var(--surface-hover)_86%,var(--border)_14%)]'
}

function fieldStripe(index: number): string {
  return index % 2 === 0
    ? 'bg-[var(--surface)] group-hover:bg-[var(--surface-hover)]'
    : 'bg-[color-mix(in_srgb,var(--surface)_90%,var(--border)_10%)] group-hover:bg-[color-mix(in_srgb,var(--surface-hover)_90%,var(--border)_10%)]'
}

function removeRow(id: string) {
  const idx = forecastData.value.findIndex(r => r.id === id)
  if (idx !== -1) forecastData.value.splice(idx, 1)
}
</script>
