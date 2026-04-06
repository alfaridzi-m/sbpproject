<template>
  <div class="max-w-[1440px] mx-auto px-6 pb-14 pt-2">
    <header class="mb-10 text-center">
      <div
        class="h-1 w-20 mx-auto rounded-full mb-5 shadow-[var(--shadow-sm)]"
        style="background: linear-gradient(90deg, var(--color-green), var(--color-blue))"
      />
      <h1 class="text-[1.875rem] font-bold m-0 mb-2 text-[var(--text)] tracking-tight">
        Aplikasi MFSTUDIO under Spbe
      </h1>
      <p class="text-[0.9375rem] text-[var(--text-muted)] m-0 max-w-xl mx-auto leading-relaxed">
        Informasi cuaca dan perencanaan rute kapal
      </p>
    </header>
    <main class="flex flex-col gap-7">
      <section id="route-information" class="scroll-mt-6">
        <SectionsRouteInformation />
      </section>
      <section id="forecast-table" class="scroll-mt-6">
        <SectionsForecastTable />
      </section>
      <section id="synoptic-summary" class="scroll-mt-6">
        <SectionsSynopticSummary />
      </section>
      <section id="pdf-preview" class="scroll-mt-6">
        <SectionsPdfPreview />
      </section>
    </main>

    <aside
      class="fixed bottom-4 right-4 z-40 hidden w-56 md:flex md:flex-col rounded-2xl border border-[color-mix(in_srgb,var(--accent)_25%,var(--border)_75%)] bg-[color-mix(in_srgb,var(--surface)_88%,white_12%)] p-3 shadow-[0_16px_34px_rgba(0,20,40,0.16)] backdrop-blur"
      aria-label="Quick navigation"
    >
      <p class="p-2 text-[0.68rem] uppercase tracking-[0.2em] text-[var(--text-muted)]">
        Page Navigation
      </p>
      <a
        v-for="item in sectionLinks"
        :key="item.href"
        :href="item.href"
        :aria-current="isActive(item.id) ? 'location' : undefined"
        class="group mb-1 whitespace-nowrap rounded-lg border px-3 py-2.5 text-xs font-medium no-underline transition-all duration-200"
        :class="isActive(item.id)
          ? 'border-[var(--primary)] bg-[color-mix(in_srgb,var(--primary)_16%,white_84%)] text-[var(--primary)] shadow-[0_8px_18px_var(--primary-glow)]'
          : 'border-transparent text-[var(--text)] hover:border-[var(--border)] hover:bg-[var(--surface-hover)]'"
      >
        <span class="inline-flex items-center gap-2">
          <span
            class="h-2 w-2 rounded-full transition-colors duration-200"
            :class="isActive(item.id) ? 'bg-[var(--primary)]' : 'bg-[var(--text-muted)]/50 group-hover:bg-[var(--text-muted)]'"
          />
          {{ item.label }}
        </span>
      </a>
    </aside>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const activeSection = ref('route-information')

const sectionLinks = [
  { id: 'route-information', label: 'Route Information', href: '#route-information' },
  { id: 'forecast-table', label: 'Forecast Table', href: '#forecast-table' },
  { id: 'synoptic-summary', label: 'Synoptic Summary', href: '#synoptic-summary' },
  { id: 'pdf-preview', label: 'PDF Preview', href: '#pdf-preview' },
]

function scrollToHash(hash: string) {
  if (!hash)
    return

  const target = document.querySelector(hash)
  if (target)
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function isActive(sectionId: string) {
  return activeSection.value === sectionId
}

function updateActiveSectionFromScroll() {
  const markerY = window.innerHeight * 0.35
  const sections = sectionLinks
    .map((section) => {
      const el = document.getElementById(section.id)
      if (!el)
        return null

      return {
        id: section.id,
        top: el.getBoundingClientRect().top,
      }
    })
    .filter((section): section is { id: string, top: number } => section !== null)

  if (!sections.length)
    return

  const reached = sections.filter(section => section.top <= markerY)
  const nextActiveId = reached.at(-1)?.id ?? sections[0]?.id
  if (nextActiveId)
    activeSection.value = nextActiveId

  const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8
  if (atBottom) {
    const lastSectionId = sectionLinks.at(-1)?.id
    if (lastSectionId)
      activeSection.value = lastSectionId
  }
}

onMounted(() => {
  nextTick(() => {
    scrollToHash(route.hash)
    updateActiveSectionFromScroll()
  })

  window.addEventListener('scroll', updateActiveSectionFromScroll, { passive: true })
})

watch(
  () => route.hash,
  (hash) => {
    const hashId = hash.replace('#', '')
    if (hashId)
      activeSection.value = hashId

    nextTick(() => {
      scrollToHash(hash)
      updateActiveSectionFromScroll()
    })
  },
)

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateActiveSectionFromScroll)
})
</script>
