// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  runtimeConfig: {
    apiBaseUrl: process.env.API_BASE_URL || '',
    apiKey: process.env.API_KEY || ''
  },
  css: ['leaflet/dist/leaflet.css'],
  tailwindcss: {
    config: {
      content: [
        './app/**/*.{vue,js,ts,jsx,tsx}',
        './app/**/**/*.{vue,js,ts,jsx,tsx}'
      ]
    }
  },
  vite: {
    optimizeDeps: {
      include: ['chart.js', 'chartjs-plugin-zoom']
    }
  }
})
