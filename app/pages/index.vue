<template>
  <div class="max-w-[1200px] mx-auto px-6 pb-12">
    <header class="mb-8 text-center">
      <h1 class="text-[1.75rem] font-bold m-0 mb-2 text-[var(--text)]">Aplikasi Forecast Maritim</h1>
      <p class="text-[0.9375rem] text-[var(--text-muted)] m-0">Informasi cuaca dan perencanaan rute kapal</p>
    </header>
    <main class="flex flex-col gap-0">
      <SectionsRouteInformation />
      <SectionsForecastTable />
      <SectionsSynopticSummary />
      <SectionsPdfPreview />
    </main>
  </div>
</template>

<script setup lang="ts">
// Page uses shared state from useMaritimeData composable
</script>
