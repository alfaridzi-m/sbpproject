<template>
  <div class="max-w-[1200px] mx-auto px-6 pb-14 pt-2">
    <header class="mb-10 text-center">
      <div
        class="h-1 w-20 mx-auto rounded-full mb-5 shadow-[var(--shadow-sm)]"
        style="background: linear-gradient(90deg, var(--color-green), var(--color-blue))"
      />
      <h1 class="text-[1.875rem] font-bold m-0 mb-2 text-[var(--text)] tracking-tight">
        Aplikasi Forecast Maritim
      </h1>
      <p class="text-[0.9375rem] text-[var(--text-muted)] m-0 max-w-xl mx-auto leading-relaxed">
        Informasi cuaca dan perencanaan rute kapal
      </p>
    </header>
    <main class="flex flex-col gap-7">
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
