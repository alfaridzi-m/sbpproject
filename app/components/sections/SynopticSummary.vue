<template>
  <section
    class="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 shadow-[var(--shadow-card)]"
  >
    <div class="mb-4 rounded-lg border border-[color-mix(in_srgb,var(--accent)_30%,var(--border)_70%)] bg-[color-mix(in_srgb,var(--accent)_8%,var(--surface)_92%)] px-4 py-3">
      <h2 class="inline-flex items-center rounded-md bg-[color-mix(in_srgb,var(--accent)_18%,white_82%)] px-2.5 py-1 text-base font-semibold m-0 mb-1 text-[var(--text)]">
        Kondisi Sinoptik & Peringatan
      </h2>
      <p class="text-xs text-[var(--text-muted)] m-0">Ringkasan meteorologi dan peringatan</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="flex flex-col gap-2">
        <label for="synoptic" class="text-sm font-medium text-[var(--text)]">Kondisi Sinoptik / Meteorological Situation</label>
        <textarea
          id="synoptic"
          v-model="synopticInfo"
          rows="5"
          class="p-3 border border-[var(--border)] rounded-lg text-sm font-[inherit] resize-y min-h-[100px] bg-[var(--surface)] shadow-[var(--shadow-sm)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-ring)]"
          placeholder="Deskripsi kondisi meteorologi..."
        />
      </div>
      <div class="flex flex-col gap-2">
        <label for="warnings" class="text-sm font-medium text-[var(--text)]">Peringatan Dini / Warnings</label>
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
      <label for="cyclone" class="text-sm font-medium text-[var(--text)]">Peringatan Siklon Tropis / Cyclone Warning</label>
      <input
        id="cyclone"
        v-model="cycloneWarning"
        type="text"
        class="p-3 border border-[var(--border)] rounded-lg text-sm font-[inherit] bg-[var(--surface)] shadow-[var(--shadow-sm)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-ring)]"
        placeholder="Contoh: Tidak ada sistem siklon tropis (TC) dan badai tropis (TS) yang aktif"
      />
    </div>
    <div class="flex justify-center mt-4">
      <button
        type="button"
        class="py-2 px-6 bg-[var(--primary)] text-[var(--color-white)] border-none rounded-lg text-sm font-semibold cursor-pointer shadow-[var(--shadow-md)] transition-[opacity,box-shadow] duration-200 hover:opacity-95 hover:shadow-[0_6px_20px_var(--primary-glow)] disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none"
        :disabled="isGenerating"
        @click="generateSynoptic"
      >
        {{ isGenerating ? 'Memproses...' : 'Ai' }}
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
const { synopticInfo, warnings, cycloneWarning } = useMaritimeData()

const isGenerating = ref(false)

async function generateSynoptic() {
  isGenerating.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 800))
    synopticInfo.value = `Angin dominan dari selatan bertiup di wilayah prakiraan. Kondisi tekanan rendah di wilayah Darwin, Australia Bagian Utara berpotensi meningkatkan pertumbuhan awan konvektif. Ridge tekanan tinggi di Laut Cina Selatan mendukung kondisi stabil di perairan.`
    warnings.value = `Kecepatan angin melebihi 15 knot. Tinggi gelombang melebihi 1.25 meter`
  } finally {
    isGenerating.value = false
  }
}
</script>

