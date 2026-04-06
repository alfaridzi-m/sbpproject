<template>
  <section
    class="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 shadow-[var(--shadow-card)]"
  >
    <div class="mb-4 rounded-lg border border-[color-mix(in_srgb,var(--accent)_30%,var(--border)_70%)] bg-[color-mix(in_srgb,var(--accent)_8%,var(--surface)_92%)] px-4 py-3">
      <h2 class="inline-flex items-center rounded-md bg-[color-mix(in_srgb,var(--accent)_18%,var(--surface)_82%)] px-2.5 py-1 text-base font-semibold m-0 mb-1 text-[var(--text)]">
        Kondisi Sinoptik & Peringatan
      </h2>
      <p class="text-xs text-[var(--text-muted)] m-0">Ringkasan meteorologi dan peringatan</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="flex flex-col gap-2">
        <div class="flex items-start justify-between gap-3">
          <label for="synoptic" class="text-sm font-medium text-[var(--text)] min-w-0 pr-1">Kondisi Sinoptik / Meteorological Situation</label>
          <button
            type="button"
            class="af-btn shrink-0"
            :disabled="isFillingSynoptic"
            @click="autoFillSynoptic"
          >
            {{ isFillingSynoptic ? 'Memproses...' : 'Auto Fill' }}
          </button>
        </div>
        <textarea
          id="synoptic"
          v-model="synopticInfo"
          rows="5"
          class="p-3 border border-[var(--border)] rounded-lg text-sm font-[inherit] resize-y min-h-[100px] bg-[var(--surface)] shadow-[var(--shadow-sm)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-ring)]"
          placeholder="Deskripsi kondisi meteorologi..."
        />
      </div>
      <div class="flex flex-col gap-2">
        <div class="flex items-start justify-between gap-3">
          <label for="warnings" class="text-sm font-medium text-[var(--text)] min-w-0 pr-1">Peringatan Dini / Warnings</label>
          <button
            type="button"
            class="af-btn shrink-0"
            :disabled="isFillingWarnings"
            @click="autoFillWarnings"
          >
            {{ isFillingWarnings ? 'Memproses...' : 'Auto Fill' }}
          </button>
        </div>
        <textarea
          id="warnings"
          v-model="warnings"
          rows="2"
          class="p-3 border border-[var(--border)] rounded-lg text-sm font-[inherit] resize-y min-h-[100px] bg-[var(--surface)] shadow-[var(--shadow-sm)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-ring)]"
          placeholder="Contoh: Kecepatan angin melebihi 15 knot. Tinggi gelombang melebihi 1.25 meter"
        />
      </div>
    </div>
    <div class="flex flex-col gap-2 mt-4">
      <div class="flex items-start justify-between gap-3">
        <label for="cyclone" class="text-sm font-medium text-[var(--text)] min-w-0 pr-1">Peringatan Siklon Tropis / Cyclone Warning</label>
        <button
          type="button"
          class="af-btn shrink-0"
          :disabled="isFillingCyclone"
          @click="autoFillCyclone"
        >
          {{ isFillingCyclone ? 'Memproses...' : 'Auto Fill' }}
        </button>
      </div>
      <input
        id="cyclone"
        v-model="cycloneWarning"
        type="text"
        class="p-3 border border-[var(--border)] rounded-lg text-sm font-[inherit] bg-[var(--surface)] shadow-[var(--shadow-sm)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-ring)]"
        placeholder="Contoh: Tidak ada sistem siklon tropis (TC) dan badai tropis (TS) yang aktif"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
const { synopticInfo, warnings, cycloneWarning } = useMaritimeData()

const SYNOPTIC_TEMPLATE =
  'Angin dominan dari selatan bertiup di wilayah prakiraan. Kondisi tekanan rendah di wilayah Darwin, Australia Bagian Utara berpotensi meningkatkan pertumbuhan awan konvektif. Ridge tekanan tinggi di Laut Cina Selatan mendukung kondisi stabil di perairan.'

const WARNINGS_TEMPLATE = 'Kecepatan angin melebihi 15 knot. Tinggi gelombang melebihi 1.25 meter'

const CYCLONE_TEMPLATE =
  'Tidak ada sistem siklon tropis (TC) dan badai tropis (TS) yang aktif.'

const isFillingSynoptic = ref(false)
const isFillingWarnings = ref(false)
const isFillingCyclone = ref(false)

async function autoFillSynoptic() {
  isFillingSynoptic.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 800))
    synopticInfo.value = SYNOPTIC_TEMPLATE
  } finally {
    isFillingSynoptic.value = false
  }
}

async function autoFillWarnings() {
  isFillingWarnings.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 800))
    warnings.value = WARNINGS_TEMPLATE
  } finally {
    isFillingWarnings.value = false
  }
}

async function autoFillCyclone() {
  isFillingCyclone.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 800))
    cycloneWarning.value = CYCLONE_TEMPLATE
  } finally {
    isFillingCyclone.value = false
  }
}
</script>

<style scoped>
.af-btn {
  @apply py-1.5 px-3 bg-[var(--primary)] text-[var(--color-white)] border-none rounded-lg text-xs font-semibold cursor-pointer shadow-[var(--shadow-md)] transition-[opacity,box-shadow] duration-200 hover:opacity-95 hover:shadow-[0_6px_20px_var(--primary-glow)] disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none;
}
</style>

