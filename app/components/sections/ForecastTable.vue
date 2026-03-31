<template>
  <section
    class="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 shadow-[var(--shadow-card)]"
  >
    <div class="mb-4 rounded-lg border border-[color-mix(in_srgb,var(--accent)_30%,var(--border)_70%)] bg-[color-mix(in_srgb,var(--accent)_8%,var(--surface)_92%)] px-4 py-3">
      <h2 class="inline-flex items-center rounded-md bg-[color-mix(in_srgb,var(--accent)_18%,white_82%)] px-2.5 py-1 text-base font-semibold m-0 mb-1 text-[var(--text)]">
        Forecast Table Data
      </h2>
      <p class="text-xs text-[var(--text-muted)] m-0">Edit sel prakiraan per titik waktu</p>
    </div>
    <div class="overflow-x-auto mb-4 rounded-lg shadow-[var(--shadow-sm)] border border-[var(--border)] bg-[var(--surface)]">
      <table class="w-full border-collapse text-[0.8125rem] [&_th]:py-2 [&_th]:px-3 [&_td]:py-2 [&_td]:px-3 [&_th]:text-left [&_td]:text-left [&_th]:border-b [&_td]:border-b [&_th]:border-[var(--border)] [&_td]:border-[var(--border)]">
        <thead>
          <tr class="bg-[var(--table-header-bg)] text-[var(--table-header-text)] font-bold whitespace-nowrap [&>th]:border-none [&>th]:border-b [&>th]:border-[var(--color-white)]/20">
            <th>Data dd/mm/yy</th>
            <th>Waktu</th>
            <th>Koordinat</th>
            <th>Visibility</th>
            <th>Cuaca</th>
            <th>rr</th>
            <th>Wave</th>
            <th>ws</th>
            <th>wd</th>
            <th>aruss</th>
            <th>arusd</th>
            <th>hslg</th>
            <th>hsig</th>
            <th class="w-10 text-center"> </th>
          </tr>
          <tr class="bg-[var(--surface)] text-[var(--text-muted)] font-medium text-xs whitespace-nowrap [&>th]:border-none [&>th]:border-b [&>th]:border-[var(--border)]">
            <th>dd/mm/yy</th>
            <th>—</th>
            <th>lat, lon</th>
            <th>km</th>
            <th>—</th>
            <th>mm</th>
            <th>m</th>
            <th>m/s</th>
            <th>°</th>
            <th>m/s</th>
            <th>°</th>
            <th>m</th>
            <th>m</th>
            <th class="w-10 text-center"> </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in forecastData"
            :key="row.id"
            class="group"
          >
            <td class="bg-[var(--surface)] group-hover:bg-[var(--surface-hover)] align-middle font-bold text-[var(--text)]"><input v-model="row.date" type="text" placeholder="dd/mm/yy" class="w-full min-w-[70px] py-1.5 px-2 border border-[var(--input-border)] rounded-md bg-[var(--input-bg)] text-[var(--text)] placeholder:text-[var(--text-muted)] hover:border-[var(--input-border)] focus:border-[var(--table-header-bg)] focus:bg-[var(--surface)] focus:outline-none" /></td>
            <td class="bg-[var(--surface)] group-hover:bg-[var(--surface-hover)] align-middle font-bold text-[var(--text)]"><input v-model="row.time" type="text" placeholder="00:00" class="w-full min-w-[70px] py-1.5 px-2 border border-[var(--input-border)] rounded-md bg-[var(--input-bg)] text-[var(--text)] placeholder:text-[var(--text-muted)] hover:border-[var(--input-border)] focus:border-[var(--table-header-bg)] focus:bg-[var(--surface)] focus:outline-none" /></td>
            <td class="bg-[var(--surface)] group-hover:bg-[var(--surface-hover)] align-middle"><input v-model="row.coordinate" type="text" placeholder="Koordinat" class="w-full min-w-[100px] py-1.5 px-2 border border-[var(--input-border)] rounded-md bg-[var(--input-bg)] text-[var(--text)] placeholder:text-[var(--text-muted)] hover:border-[var(--input-border)] focus:border-[var(--table-header-bg)] focus:bg-[var(--surface)] focus:outline-none" /></td>
            <td class="bg-[var(--surface)] group-hover:bg-[var(--surface-hover)] align-middle"><input v-model="row.visibility" type="text" placeholder="—" class="w-full min-w-[56px] py-1.5 px-2 border border-[var(--input-border)] rounded-md bg-[var(--input-bg)] text-[var(--text)] placeholder:text-[var(--text-muted)] hover:border-[var(--input-border)] focus:border-[var(--table-header-bg)] focus:bg-[var(--surface)] focus:outline-none" /></td>
            <td class="bg-[var(--surface)] group-hover:bg-[var(--surface-hover)] align-middle"><input v-model="row.weather" type="text" placeholder="Cuaca" class="w-full min-w-[70px] py-1.5 px-2 border border-[var(--input-border)] rounded-md bg-[var(--input-bg)] text-[var(--text)] placeholder:text-[var(--text-muted)] hover:border-[var(--input-border)] focus:border-[var(--table-header-bg)] focus:bg-[var(--surface)] focus:outline-none" /></td>
            <td class="bg-[var(--surface)] group-hover:bg-[var(--surface-hover)] align-middle"><input v-model="row.rr" type="text" placeholder="—" class="w-full min-w-[70px] py-1.5 px-2 border border-[var(--input-border)] rounded-md bg-[var(--input-bg)] text-[var(--text)] placeholder:text-[var(--text-muted)] hover:border-[var(--input-border)] focus:border-[var(--table-header-bg)] focus:bg-[var(--surface)] focus:outline-none" /></td>
            <td class="bg-[var(--surface)] group-hover:bg-[var(--surface-hover)] align-middle"><input v-model="row.wave" type="text" placeholder="—" class="w-full min-w-[70px] py-1.5 px-2 border border-[var(--input-border)] rounded-md bg-[var(--input-bg)] text-[var(--text)] placeholder:text-[var(--text-muted)] hover:border-[var(--input-border)] focus:border-[var(--table-header-bg)] focus:bg-[var(--surface)] focus:outline-none" /></td>
            <td class="bg-[var(--surface)] group-hover:bg-[var(--surface-hover)] align-middle"><input v-model="row.ws" type="text" placeholder="—" class="w-full min-w-[70px] py-1.5 px-2 border border-[var(--input-border)] rounded-md bg-[var(--input-bg)] text-[var(--text)] placeholder:text-[var(--text-muted)] hover:border-[var(--input-border)] focus:border-[var(--table-header-bg)] focus:bg-[var(--surface)] focus:outline-none" /></td>
            <td class="bg-[var(--surface)] group-hover:bg-[var(--surface-hover)] align-middle"><input v-model="row.wd" type="text" placeholder="—" class="w-full min-w-[70px] py-1.5 px-2 border border-[var(--input-border)] rounded-md bg-[var(--input-bg)] text-[var(--text)] placeholder:text-[var(--text-muted)] hover:border-[var(--input-border)] focus:border-[var(--table-header-bg)] focus:bg-[var(--surface)] focus:outline-none" /></td>
            <td class="bg-[var(--surface)] group-hover:bg-[var(--surface-hover)] align-middle"><input v-model="row.aruss" type="text" placeholder="—" class="w-full min-w-[70px] py-1.5 px-2 border border-[var(--input-border)] rounded-md bg-[var(--input-bg)] text-[var(--text)] placeholder:text-[var(--text-muted)] hover:border-[var(--input-border)] focus:border-[var(--table-header-bg)] focus:bg-[var(--surface)] focus:outline-none" /></td>
            <td class="bg-[var(--surface)] group-hover:bg-[var(--surface-hover)] align-middle"><input v-model="row.arusd" type="text" placeholder="—" class="w-full min-w-[70px] py-1.5 px-2 border border-[var(--input-border)] rounded-md bg-[var(--input-bg)] text-[var(--text)] placeholder:text-[var(--text-muted)] hover:border-[var(--input-border)] focus:border-[var(--table-header-bg)] focus:bg-[var(--surface)] focus:outline-none" /></td>
            <td class="bg-[var(--surface)] group-hover:bg-[var(--surface-hover)] align-middle"><input v-model="row.hslg" type="text" placeholder="—" class="w-full min-w-[70px] py-1.5 px-2 border border-[var(--input-border)] rounded-md bg-[var(--input-bg)] text-[var(--text)] placeholder:text-[var(--text-muted)] hover:border-[var(--input-border)] focus:border-[var(--table-header-bg)] focus:bg-[var(--surface)] focus:outline-none" /></td>
            <td class="bg-[var(--surface)] group-hover:bg-[var(--surface-hover)] align-middle"><input v-model="row.hsig" type="text" placeholder="—" class="w-full min-w-[70px] py-1.5 px-2 border border-[var(--input-border)] rounded-md bg-[var(--input-bg)] text-[var(--text)] placeholder:text-[var(--text-muted)] hover:border-[var(--input-border)] focus:border-[var(--table-header-bg)] focus:bg-[var(--surface)] focus:outline-none" /></td>
            <td class="w-10 text-center bg-[var(--surface)] group-hover:bg-[var(--surface-hover)] align-middle">
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
  </section>
</template>

<script setup lang="ts">
const { forecastData, addForecastRow } = useMaritimeData()

function removeRow(id: string) {
  const idx = forecastData.value.findIndex(r => r.id === id)
  if (idx !== -1) forecastData.value.splice(idx, 1)
}
</script>

