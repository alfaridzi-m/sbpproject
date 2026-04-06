type Theme = 'light' | 'dark'

const STORAGE_KEY = 'app-theme'

const theme = ref<Theme>('light')

function applyTheme(t: Theme) {
  if (!import.meta.client) return
  document.documentElement.setAttribute('data-theme', t)
}

function initTheme() {
  if (!import.meta.client) return

  const stored = localStorage.getItem(STORAGE_KEY) as Theme | null
  if (stored === 'light' || stored === 'dark') {
    theme.value = stored
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    theme.value = 'dark'
  }
  applyTheme(theme.value)
}

function toggleTheme() {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
  applyTheme(theme.value)
  if (import.meta.client) localStorage.setItem(STORAGE_KEY, theme.value)
}

export function useTheme() {
  return { theme: readonly(theme), toggleTheme, initTheme }
}
