<template>
  <section
    class="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 shadow-[var(--shadow-card)]"
  >
    <div class="mb-4 rounded-lg border border-[color-mix(in_srgb,var(--accent)_30%,var(--border)_70%)] bg-[color-mix(in_srgb,var(--accent)_8%,var(--surface)_92%)] px-4 py-3 flex items-start justify-between gap-3">
      <div>
        <h2 class="inline-flex items-center rounded-md bg-[color-mix(in_srgb,var(--accent)_18%,white_82%)] px-2.5 py-1 text-base font-semibold m-0 mb-1 text-[var(--text)]">
          Forecast Table Data
        </h2>
        <p class="text-xs text-[var(--text-muted)] m-0">Tanggal, waktu, dan koordinat hanya baca; kolom lain dapat diedit</p>
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
        <thead>
          <tr class="bg-[var(--table-header-bg)] text-[var(--table-header-text)] font-bold whitespace-nowrap [&>th]:border-none [&>th]:border-b [&>th]:border-[var(--color-white)]/20">
            <th>Data dd/mm/yy</th>
            <th>Waktu</th>
            <th class="min-w-[16rem] w-[min(22rem,40vw)]">Koordinat</th>
            <th>Visibility</th>
            <th>Cuaca</th>
            <th>Wave</th>
            <th>ws</th>
            <th>wd</th>
            <th>aruss</th>
            <th>arusd</th>
            <th>hsig</th>
            <th class="w-10 text-center"> </th>
          </tr>
          <tr class="bg-[var(--surface)] text-[var(--text-muted)] font-medium text-xs whitespace-nowrap [&>th]:border-none [&>th]:border-b [&>th]:border-[var(--border)]">
            <th>dd/mm/yy</th>
            <th>—</th>
            <th class="min-w-[16rem] w-[min(22rem,40vw)]">lat, lon</th>
            <th>km</th>
            <th>—</th>
            <th>m</th>
            <th>kt</th>
            <th>°</th>
            <th>cm/s</th>
            <th>°</th>
            <th>m</th>
            <th class="w-10 text-center"> </th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(row, index) in forecastData" :key="row.id">
            <tr
              v-if="showDayGapBefore(index)"
              aria-hidden="true"
              class="pointer-events-none"
            >
              <td
                colspan="12"
                class="p-0 border-0 h-4 border-b-0 bg-[var(--surface)] shadow-[inset_0_1px_0_0_var(--border)]"
              />
            </tr>
            <tr class="group">
              <td :class="[metaStripe(index), 'align-middle font-bold text-[var(--text)]']">
                <span class="block min-w-[70px] py-1.5 px-2 rounded-md border border-transparent text-[var(--text)] select-text">{{ row.date || '—' }}</span>
              </td>
              <td :class="[metaStripe(index), 'align-middle font-bold text-[var(--text)]']">
                <span class="block min-w-[70px] py-1.5 px-2 rounded-md border border-transparent text-[var(--text)] select-text">{{ row.time || '—' }}</span>
              </td>
              <td :class="[metaStripe(index), 'align-middle min-w-[16rem] w-[min(22rem,40vw)] max-w-[28rem]']">
                <span class="block py-1.5 px-2 rounded-md border border-transparent font-mono text-[0.75rem] leading-snug text-[var(--text)] break-all whitespace-normal select-text">{{ row.coordinate || '—' }}</span>
              </td>
              <td :class="[fieldStripe(index), 'align-middle']"><input v-model="row.visibility" type="text" placeholder="—" class="w-full min-w-[56px] py-1.5 px-2 border border-[var(--input-border)] rounded-md bg-[var(--input-bg)] text-[var(--text)] placeholder:text-[var(--text-muted)] hover:border-[var(--input-border)] focus:border-[var(--table-header-bg)] focus:bg-[var(--surface)] focus:outline-none" /></td>
              <td :class="[fieldStripe(index), 'align-middle']"><input v-model="row.weather" type="text" placeholder="Cuaca" class="w-full min-w-[70px] py-1.5 px-2 border border-[var(--input-border)] rounded-md bg-[var(--input-bg)] text-[var(--text)] placeholder:text-[var(--text-muted)] hover:border-[var(--input-border)] focus:border-[var(--table-header-bg)] focus:bg-[var(--surface)] focus:outline-none" /></td>
              <td :class="[fieldStripe(index), 'align-middle']"><input v-model="row.wave" type="text" placeholder="—" class="w-full min-w-[70px] py-1.5 px-2 border border-[var(--input-border)] rounded-md bg-[var(--input-bg)] text-[var(--text)] placeholder:text-[var(--text-muted)] hover:border-[var(--input-border)] focus:border-[var(--table-header-bg)] focus:bg-[var(--surface)] focus:outline-none" /></td>
              <td :class="[fieldStripe(index), 'align-middle']"><input v-model="row.ws" type="text" placeholder="—" class="w-full min-w-[70px] py-1.5 px-2 border border-[var(--input-border)] rounded-md bg-[var(--input-bg)] text-[var(--text)] placeholder:text-[var(--text-muted)] hover:border-[var(--input-border)] focus:border-[var(--table-header-bg)] focus:bg-[var(--surface)] focus:outline-none" /></td>
              <td :class="[fieldStripe(index), 'align-middle']"><input v-model="row.wd" type="text" placeholder="—" class="w-full min-w-[70px] py-1.5 px-2 border border-[var(--input-border)] rounded-md bg-[var(--input-bg)] text-[var(--text)] placeholder:text-[var(--text-muted)] hover:border-[var(--input-border)] focus:border-[var(--table-header-bg)] focus:bg-[var(--surface)] focus:outline-none" /></td>
              <td :class="[fieldStripe(index), 'align-middle']"><input v-model="row.aruss" type="text" placeholder="—" class="w-full min-w-[70px] py-1.5 px-2 border border-[var(--input-border)] rounded-md bg-[var(--input-bg)] text-[var(--text)] placeholder:text-[var(--text-muted)] hover:border-[var(--input-border)] focus:border-[var(--table-header-bg)] focus:bg-[var(--surface)] focus:outline-none" /></td>
              <td :class="[fieldStripe(index), 'align-middle']"><input v-model="row.arusd" type="text" placeholder="—" class="w-full min-w-[70px] py-1.5 px-2 border border-[var(--input-border)] rounded-md bg-[var(--input-bg)] text-[var(--text)] placeholder:text-[var(--text-muted)] hover:border-[var(--input-border)] focus:border-[var(--table-header-bg)] focus:bg-[var(--surface)] focus:outline-none" /></td>
              <td :class="[fieldStripe(index), 'align-middle']"><input v-model="row.hsig" type="text" placeholder="—" class="w-full min-w-[70px] py-1.5 px-2 border border-[var(--input-border)] rounded-md bg-[var(--input-bg)] text-[var(--text)] placeholder:text-[var(--text-muted)] hover:border-[var(--input-border)] focus:border-[var(--table-header-bg)] focus:bg-[var(--surface)] focus:outline-none" /></td>
              <td :class="[fieldStripe(index), 'w-10 text-center align-middle']">
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
    <button
      type="button"
      class="py-2 px-4 bg-[var(--surface)] text-[var(--primary)] border border-dashed border-[var(--primary)] rounded-lg text-sm cursor-pointer shadow-[var(--shadow-sm)] transition-colors duration-200 hover:bg-[var(--primary-hover)]"
      @click="addForecastRow"
    >
      + Tambah Baris
    </button>
    <ForecastAdjustModal v-model="showAdjustModal" />
  </section>
</template>

<script setup lang="ts">
import ForecastAdjustModal from './ForecastAdjustModal.vue'

const { forecastData, addForecastRow } = useMaritimeData()
const showAdjustModal = ref(false)

function showDayGapBefore(index: number): boolean {
  if (index === 0) return false
  const rows = forecastData.value
  const cur = rows[index]?.date ?? ''
  const prev = rows[index - 1]?.date ?? ''
  return cur !== prev
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

