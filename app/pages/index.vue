<template>
  <div class="min-h-screen">
    <!-- Sticky header -->
    <header
      class="sticky top-0 z-50 border-b backdrop-blur-xl transition-[background-color,border-color,box-shadow] duration-200"
      :class="scrolled
        ? 'bg-[color-mix(in_srgb,var(--surface)_88%,transparent)] border-[var(--border)] shadow-[var(--shadow-sm)]'
        : 'bg-transparent border-transparent'"
    >
      <div class="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center h-14 gap-6">
          <!-- Brand -->
          <a href="#" class="flex items-center gap-2.5 shrink-0 no-underline group">
            <div
              class="h-8 w-8 rounded-lg flex items-center justify-center shadow-[var(--shadow-sm)] group-hover:shadow-[var(--shadow-md)] transition-shadow"
              style="background: linear-gradient(135deg, var(--color-green), var(--color-blue))"
            >
              <svg class="w-[18px] h-[18px] text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 class="text-sm font-bold m-0 text-[var(--text)] tracking-tight leading-none">
              MFSTUDIO<span class="font-normal text-[var(--text-muted)] ml-1">SPBE</span>
            </h1>
          </a>

          <!-- Separator -->
          <div class="hidden sm:block h-5 w-px bg-[var(--border)]" />

          <!-- Nav links -->
          <nav class="hidden sm:flex items-center gap-1 flex-1 min-w-0" aria-label="Section navigation">
            <a
              v-for="(item, idx) in sectionLinks"
              :key="item.href"
              :href="item.href"
              :aria-current="isActive(item.id) ? 'page' : undefined"
              class="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium no-underline whitespace-nowrap transition-colors duration-150"
              :class="isActive(item.id)
                ? 'text-[var(--primary)] bg-[color-mix(in_srgb,var(--primary)_10%,transparent)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)]'"
            >
              <span
                class="inline-flex h-[18px] w-[18px] items-center justify-center rounded text-[0.6rem] font-bold leading-none"
                :class="isActive(item.id)
                  ? 'bg-[var(--primary)] text-white'
                  : 'bg-[var(--surface-hover)] text-[var(--text-muted)]'"
              >{{ idx + 1 }}</span>
              <span class="hidden lg:inline">{{ item.label }}</span>
              <span class="lg:hidden">{{ item.shortLabel }}</span>
            </a>
          </nav>

          <!-- Right actions -->
          <div class="flex items-center gap-2 ml-auto shrink-0">
            <!-- Mobile menu toggle -->
            <button
              type="button"
              class="sm:hidden h-8 w-8 rounded-lg border border-[var(--border)] bg-[var(--surface)] flex items-center justify-center cursor-pointer hover:bg-[var(--surface-hover)]"
              aria-label="Toggle navigation"
              @click="mobileNavOpen = !mobileNavOpen"
            >
              <svg class="w-4 h-4 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path v-if="!mobileNavOpen" stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                <path v-else stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <button
              type="button"
              class="h-8 w-8 rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)] flex items-center justify-center cursor-pointer hover:bg-[var(--surface-hover)] hover:border-[var(--accent)] active:scale-95 transition-all duration-150"
              :title="theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
              aria-label="Toggle dark mode"
              @click="toggleTheme"
            >
              <svg v-if="theme === 'light'" class="w-4 h-4 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
              <svg v-else class="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Mobile nav dropdown -->
        <nav
          v-if="mobileNavOpen"
          class="sm:hidden pb-3 flex flex-col gap-1 border-t border-[var(--border)] pt-2"
          aria-label="Mobile section navigation"
        >
          <a
            v-for="(item, idx) in sectionLinks"
            :key="item.href"
            :href="item.href"
            :aria-current="isActive(item.id) ? 'page' : undefined"
            class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium no-underline transition-colors"
            :class="isActive(item.id)
              ? 'text-[var(--primary)] bg-[color-mix(in_srgb,var(--primary)_10%,transparent)]'
              : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)]'"
            @click="mobileNavOpen = false"
          >
            <span
              class="inline-flex h-5 w-5 items-center justify-center rounded-md text-[0.6rem] font-bold"
              :class="isActive(item.id)
                ? 'bg-[var(--primary)] text-white'
                : 'bg-[var(--surface-hover)] text-[var(--text-muted)]'"
            >{{ idx + 1 }}</span>
            {{ item.label }}
          </a>
        </nav>
      </div>
    </header>

    <!-- Page content -->
    <div class="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-6">
      <main class="flex flex-col gap-0">
        <div v-for="(item, idx) in sectionLinks" :key="item.id">
          <!-- Section divider -->
          <div
            v-if="idx > 0"
            class="flex items-center gap-4 py-8"
          >
            <div class="flex-1 h-px bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" />
            <span class="flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.15em] text-[var(--text-muted)] font-medium select-none">
              <span
                class="inline-flex h-6 w-6 items-center justify-center rounded-full text-[0.65rem] font-bold border border-[var(--border)] bg-[var(--surface)]"
              >{{ idx + 1 }}</span>
              {{ item.label }}
            </span>
            <div class="flex-1 h-px bg-gradient-to-r from-[var(--border)] via-transparent to-transparent" />
          </div>

          <section :id="item.id" class="scroll-mt-20">
            <SectionsRouteInformation v-if="item.id === 'route-information'" />
            <SectionsForecastTable v-else-if="item.id === 'forecast-table'" />
            <SectionsSynopticSummary v-else-if="item.id === 'synoptic-summary'" />
            <SectionsPdfPreview v-else-if="item.id === 'pdf-preview'" />
          </section>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const { theme, toggleTheme } = useTheme()
const route = useRoute()
const activeSection = ref('route-information')
const scrolled = ref(false)
const mobileNavOpen = ref(false)

const sectionLinks = [
  { id: 'route-information', label: 'Route Information', shortLabel: 'Route', href: '#route-information' },
  { id: 'forecast-table', label: 'Forecast Table', shortLabel: 'Forecast', href: '#forecast-table' },
  { id: 'synoptic-summary', label: 'Synoptic Summary', shortLabel: 'Synoptic', href: '#synoptic-summary' },
  { id: 'pdf-preview', label: 'PDF Preview', shortLabel: 'PDF', href: '#pdf-preview' },
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

function updateScrollState() {
  scrolled.value = window.scrollY > 8
}

function updateActiveSectionFromScroll() {
  updateScrollState()

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
