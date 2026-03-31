<template>
  <section
    class="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 shadow-[var(--shadow-card)]"
  >
    <div class="mb-4 rounded-lg border border-[color-mix(in_srgb,var(--accent)_30%,var(--border)_70%)] bg-[color-mix(in_srgb,var(--accent)_8%,var(--surface)_92%)] px-4 py-3">
      <h2 class="inline-flex items-center rounded-md bg-[color-mix(in_srgb,var(--accent)_18%,white_82%)] px-2.5 py-1 text-base font-semibold m-0 mb-1 text-[var(--text)]">
        Preview Dokumen — Seperti BMKG
      </h2>
      <p class="text-xs text-[var(--text-muted)] m-0">Pratinjau sebelum unduh PDF</p>
    </div>
    <div class="flex gap-2 mb-4">
      <button
        type="button"
        :class="['py-2 px-4 rounded-lg text-sm cursor-pointer transition-all duration-200 shadow-[var(--shadow-sm)]', pdfTemplate === 'rute-pelayaran' ? 'bg-[var(--primary)] text-white border border-[var(--primary)] shadow-[var(--shadow-md)]' : 'bg-[var(--input-bg)] border border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--accent)]']"
        @click="pdfTemplate = 'rute-pelayaran'"
      >
        Rute Pelayaran Khusus
      </button>
      <button
        type="button"
        :class="['py-2 px-4 rounded-lg text-sm cursor-pointer transition-all duration-200 shadow-[var(--shadow-sm)]', pdfTemplate === 'wisata-bahari' ? 'bg-[var(--primary)] text-white border border-[var(--primary)] shadow-[var(--shadow-md)]' : 'bg-[var(--input-bg)] border border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--accent)]']"
        @click="pdfTemplate = 'wisata-bahari'"
      >
        Wisata Bahari
      </button>
    </div>
    <SectionsRutePelayaranPdfPreview v-if="pdfTemplate === 'rute-pelayaran'" />
    <SectionsWisataBahariPdfPreview v-else-if="pdfTemplate === 'wisata-bahari'" />
  </section>
</template>

<script setup lang="ts">
const { pdfTemplate } = useMaritimeData()
</script>
