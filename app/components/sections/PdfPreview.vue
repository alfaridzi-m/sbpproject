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
    <div class="flex items-center justify-between gap-4 mb-4">
      <div class="flex gap-2">
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
      <button
        type="button"
        :disabled="isDownloading"
        :aria-busy="isDownloading"
        class="inline-flex items-center justify-center gap-2 py-2 px-5 min-w-[10.5rem] bg-[var(--primary)] text-white border-none rounded-lg text-sm font-medium cursor-pointer shadow-[var(--shadow-md)] transition-[opacity,box-shadow] duration-200 hover:opacity-95 hover:shadow-[0_6px_20px_rgba(1,167,62,0.35)] disabled:opacity-90 disabled:shadow-none disabled:cursor-wait"
        @click="onDownloadClick"
      >
        <span
          v-if="isDownloading"
          class="size-4 shrink-0 rounded-full border-2 border-white/35 border-t-white animate-spin"
          aria-hidden="true"
        />
        <span>{{ isDownloading ? 'Downloading…' : 'Download PDF' }}</span>
      </button>
    </div>
    <div class="max-h-[calc(100vh-12rem)] overflow-y-auto rounded-lg border border-[var(--border)] bg-[var(--surface-muted)]">
      <SectionsRutePelayaranPdfPreview
        v-if="pdfTemplate === 'rute-pelayaran'"
        ref="rutePreviewRef"
      />
      <SectionsWisataBahariPdfPreview
        v-else-if="pdfTemplate === 'wisata-bahari'"
        ref="wisataPreviewRef"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
const { pdfTemplate } = useMaritimeData()

const rutePreviewRef = ref<any | null>(null)
const wisataPreviewRef = ref<any | null>(null)
const isDownloading = ref(false)

const onDownloadClick = async () => {
  if (isDownloading.value) return
  isDownloading.value = true
  try {
    if (pdfTemplate.value === 'rute-pelayaran') {
      await rutePreviewRef.value?.downloadPdf?.()
    } else if (pdfTemplate.value === 'wisata-bahari') {
      await wisataPreviewRef.value?.downloadPdf?.()
    }
  } finally {
    isDownloading.value = false
  }
}
</script>
