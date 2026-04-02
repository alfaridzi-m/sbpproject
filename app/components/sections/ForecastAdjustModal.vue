<template>
  <Teleport to="body">
    <Transition name="fc-adjust">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      >
        <div
          class="absolute inset-0 bg-black/40 backdrop-blur-sm"
          @click="cancel"
        />
        <div
          class="relative w-full max-w-[56rem] max-h-[85vh] bg-[var(--surface)] rounded-2xl shadow-2xl border border-[var(--border)] flex flex-col overflow-hidden"
        >
          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-[var(--border)] shrink-0">
            <div>
              <h2 class="text-lg font-semibold text-[var(--text)] m-0">
                Adjust Forecast Data
              </h2>
              <p class="text-xs text-[var(--text-muted)] m-0 mt-1">
                Drag points on the chart to adjust values
              </p>
            </div>
            <button
              type="button"
              class="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)] transition-colors text-xl leading-none border-none bg-transparent cursor-pointer"
              aria-label="Close"
              @click="cancel"
            >
              ×
            </button>
          </div>

          <!-- Tabs -->
          <div class="flex flex-wrap gap-1.5 px-6 py-3 border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_95%,var(--border)_5%)] shrink-0 overflow-x-auto">
            <button
              v-for="param in parameters"
              :key="param.key"
              type="button"
              class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 border cursor-pointer whitespace-nowrap"
              :class="activeTab === param.key
                ? 'text-white shadow-sm'
                : 'bg-[var(--surface)] text-[var(--text-muted)] border-[var(--border)] hover:text-[var(--text)] hover:border-[var(--text-muted)]'"
              :style="activeTab === param.key ? `background-color: ${param.color}; border-color: ${param.color}` : ''"
              @click="switchTab(param.key)"
            >
              {{ param.label }} ({{ param.unit }})
            </button>
          </div>

          <!-- Chart -->
          <div class="flex-1 min-h-0 px-6 py-4 flex flex-col">
            <div
              v-if="forecastData.length === 0"
              class="flex items-center justify-center flex-1 min-h-[320px] text-[var(--text-muted)] text-sm"
            >
              No forecast data available. Run the forecast first.
            </div>
            <template v-else>
              <div class="flex items-center justify-between mb-2 shrink-0">
                <p class="text-[11px] text-[var(--text-muted)] m-0">
                  Scroll to zoom · Hold Shift + drag to pan · Drag points to adjust
                </p>
                <button
                  v-if="isZoomed"
                  type="button"
                  class="px-2.5 py-1 rounded-md text-[11px] font-medium cursor-pointer bg-[var(--surface)] text-[var(--text-muted)] border border-[var(--border)] transition-colors hover:text-[var(--text)] hover:border-[var(--text-muted)]"
                  @click="resetZoom"
                >
                  Reset Zoom
                </button>
              </div>
              <div class="relative w-full flex-1" style="min-height: 320px">
                <canvas ref="chartCanvas" style="touch-action: none" />
              </div>
            </template>
          </div>

          <!-- Footer -->
          <div class="flex items-center justify-between px-6 py-4 border-t border-[var(--border)] shrink-0">
            <button
              type="button"
              class="px-4 py-2 rounded-lg text-sm font-medium cursor-pointer bg-[var(--surface)] text-[var(--text-muted)] border border-[var(--border)] shadow-[var(--shadow-sm)] transition-colors duration-200 hover:text-[var(--text)] hover:border-[var(--text-muted)]"
              @click="resetCurrentTab"
            >
              Reset Tab
            </button>
            <div class="flex gap-3">
              <button
                type="button"
                class="px-5 py-2 rounded-lg text-sm font-medium cursor-pointer bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] shadow-[var(--shadow-sm)] transition-colors duration-200 hover:bg-[var(--surface-hover)]"
                @click="cancel"
              >
                Cancel
              </button>
              <button
                type="button"
                class="px-5 py-2 rounded-lg text-sm font-medium cursor-pointer bg-[var(--primary)] text-[var(--color-white)] border-none shadow-[var(--shadow-md)] transition-[opacity,box-shadow] duration-200 hover:opacity-95 hover:shadow-[0_6px_20px_var(--primary-glow)]"
                @click="apply"
              >
                Apply Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { ForecastRow } from '~/composables/useMaritimeData'

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

const { forecastData } = useMaritimeData()

type ParamKey = 'visibility' | 'wave' | 'ws' | 'wd' | 'aruss' | 'arusd' | 'hsig'

interface ParamDef {
  key: ParamKey
  label: string
  unit: string
  color: string
  min: number
  max?: number
  decimals: number
}

const parameters: ParamDef[] = [
  { key: 'visibility', label: 'Visibility', unit: 'km', color: '#3b82f6', min: 0, decimals: 1 },
  { key: 'wave', label: 'Wave', unit: 'm', color: '#06b6d4', min: 0, decimals: 2 },
  { key: 'ws', label: 'Wind Speed', unit: 'm/s', color: '#10b981', min: 0, decimals: 1 },
  { key: 'wd', label: 'Wind Dir', unit: '°', color: '#f59e0b', min: 0, max: 360, decimals: 0 },
  { key: 'aruss', label: 'Current Speed', unit: 'm/s', color: '#8b5cf6', min: 0, decimals: 2 },
  { key: 'arusd', label: 'Current Dir', unit: '°', color: '#ec4899', min: 0, max: 360, decimals: 0 },
  { key: 'hsig', label: 'Hsig', unit: 'm', color: '#ef4444', min: 0, decimals: 2 },
]

const activeTab = ref<ParamKey>('visibility')
const chartCanvas = ref<HTMLCanvasElement | null>(null)
const isZoomed = ref(false)

const originalValues = ref<Record<string, Record<ParamKey, number>>>({})
const editedValues = ref<Record<string, Record<ParamKey, number>>>({})

let chartInstance: any = null
let ChartCtor: any = null
let cleanupDrag: (() => void) | null = null

function readRowNum(row: ForecastRow, key: ParamKey): number {
  return parseFloat((row as unknown as Record<string, string>)[key] || '0') || 0
}

function getActiveParam(): ParamDef {
  return parameters.find(p => p.key === activeTab.value)!
}

function initSnapshot() {
  originalValues.value = {}
  editedValues.value = {}
  for (const row of forecastData.value) {
    const vals = {} as Record<ParamKey, number>
    for (const p of parameters) vals[p.key] = readRowNum(row, p.key)
    originalValues.value[row.id] = { ...vals }
    editedValues.value[row.id] = { ...vals }
  }
}

async function ensureChartJs() {
  if (ChartCtor || !import.meta.client) return
  const {
    Chart, CategoryScale, LinearScale,
    PointElement, LineElement, LineController,
    Tooltip, Filler,
  } = await import('chart.js')
  const { default: zoomPlugin } = await import('chartjs-plugin-zoom')
  Chart.register(
    CategoryScale, LinearScale,
    PointElement, LineElement, LineController,
    Tooltip, Filler,
    zoomPlugin,
  )
  ChartCtor = Chart
}

function destroyChart() {
  cleanupDrag?.()
  cleanupDrag = null
  chartInstance?.destroy()
  chartInstance = null
}

async function buildChart() {
  destroyChart()
  if (!chartCanvas.value || !forecastData.value.length) return

  await ensureChartJs()
  if (!ChartCtor || !chartCanvas.value) return

  const param = getActiveParam()
  const labels = forecastData.value.map(r =>
    `${r.date || '—'}  ${r.time || ''}`.trim()
  )
  const data = forecastData.value.map(
    r => editedValues.value[r.id]?.[activeTab.value] ?? 0
  )

  const maxVal = Math.max(...data, 1)

  chartInstance = new ChartCtor(chartCanvas.value, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: `${param.label} (${param.unit})`,
        data: [...data],
        borderColor: param.color,
        backgroundColor: `${param.color}18`,
        fill: true,
        tension: 0.25,
        pointRadius: 7,
        pointHoverRadius: 11,
        pointBackgroundColor: param.color,
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2.5,
        pointHitRadius: 15,
        borderWidth: 2.5,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 0 },
      scales: {
        y: {
          min: param.min,
          ...(param.max != null ? { max: param.max } : { suggestedMax: maxVal * 1.4 }),
          title: {
            display: true,
            text: `${param.label} (${param.unit})`,
            font: { size: 12, weight: 'bold' as const },
            color: '#6b7280',
          },
          grid: { color: 'rgba(128,128,128,0.12)' },
          ticks: { color: '#6b7280', font: { size: 11 } },
        },
        x: {
          ticks: {
            maxRotation: 45,
            font: { size: 10 },
            color: '#6b7280',
            autoSkip: true,
            maxTicksLimit: 20,
          },
          grid: { color: 'rgba(128,128,128,0.08)' },
        },
      },
      plugins: {
        tooltip: {
          backgroundColor: 'rgba(0,0,0,0.8)',
          titleFont: { size: 11 },
          bodyFont: { size: 12, weight: 'bold' as const },
          padding: 10,
          cornerRadius: 8,
          callbacks: {
            label: (ctx: any) => `${param.label}: ${ctx.parsed.y} ${param.unit}`,
          },
        },
        legend: { display: false },
        zoom: {
          pan: {
            enabled: true,
            mode: 'xy' as const,
            modifierKey: 'shift' as const,
          },
          zoom: {
            wheel: { enabled: true, speed: 0.08 },
            pinch: { enabled: true },
            mode: 'xy' as const,
            onZoomComplete: () => { isZoomed.value = true },
          },
          limits: {
            y: { min: param.min, ...(param.max != null ? { max: param.max } : {}) },
          },
        },
      },
      interaction: { intersect: false, mode: 'nearest' as const },
    },
  })

  setupDrag()
}

function setupDrag() {
  const canvas = chartCanvas.value
  if (!canvas || !chartInstance) return

  let dragging = false
  let dragIdx = -1

  function hitIndex(e: PointerEvent): number {
    if (!chartInstance) return -1
    const els = chartInstance.getElementsAtEventForMode(
      e, 'nearest', { intersect: true }, true,
    )
    return els.length ? els[0].index : -1
  }

  function onDown(e: PointerEvent) {
    const idx = hitIndex(e)
    if (idx >= 0) {
      dragging = true
      dragIdx = idx
      canvas.setPointerCapture(e.pointerId)
      canvas.style.cursor = 'grabbing'
      e.preventDefault()
    }
  }

  function onMove(e: PointerEvent) {
    if (!dragging || dragIdx < 0 || !chartInstance) {
      canvas.style.cursor = hitIndex(e) >= 0 ? 'grab' : 'default'
      return
    }
    e.preventDefault()

    const param = getActiveParam()
    const yScale = chartInstance.scales.y
    const rect = canvas.getBoundingClientRect()
    let value = yScale.getValueForPixel(e.clientY - rect.top) ?? 0
    value = Math.max(param.min, value)
    if (param.max != null) value = Math.min(param.max, value)
    value = Number(value.toFixed(param.decimals))

    chartInstance.data.datasets[0].data[dragIdx] = value
    chartInstance.update('none')

    const rowId = forecastData.value[dragIdx]?.id
    if (rowId && editedValues.value[rowId]) {
      editedValues.value[rowId][activeTab.value] = value
    }
  }

  function onUp(e: PointerEvent) {
    if (!dragging) return
    dragging = false
    dragIdx = -1
    try { canvas.releasePointerCapture(e.pointerId) } catch { /* noop */ }
    canvas.style.cursor = 'default'
  }

  canvas.addEventListener('pointerdown', onDown)
  canvas.addEventListener('pointermove', onMove)
  canvas.addEventListener('pointerup', onUp)
  canvas.addEventListener('pointerleave', onUp)

  cleanupDrag = () => {
    canvas.removeEventListener('pointerdown', onDown)
    canvas.removeEventListener('pointermove', onMove)
    canvas.removeEventListener('pointerup', onUp)
    canvas.removeEventListener('pointerleave', onUp)
  }
}

function resetZoom() {
  if (!chartInstance) return
  chartInstance.resetZoom()
  isZoomed.value = false
}

function switchTab(key: ParamKey) {
  if (key === activeTab.value) return
  activeTab.value = key
  isZoomed.value = false
  nextTick(() => buildChart())
}

function resetCurrentTab() {
  for (const row of forecastData.value) {
    const orig = originalValues.value[row.id]
    if (orig && editedValues.value[row.id]) {
      editedValues.value[row.id][activeTab.value] = orig[activeTab.value]
    }
  }
  nextTick(() => buildChart())
}

function apply() {
  for (const row of forecastData.value) {
    const edits = editedValues.value[row.id]
    if (!edits) continue
    const r = row as unknown as Record<string, string>
    for (const p of parameters) {
      const val = edits[p.key]
      r[p.key] = val === 0 ? '' : val.toFixed(p.decimals)
    }
  }
  emit('update:modelValue', false)
}

function cancel() {
  emit('update:modelValue', false)
}

watch(() => props.modelValue, async (v) => {
  if (v) {
    initSnapshot()
    await nextTick()
    setTimeout(() => buildChart(), 60)
  } else {
    destroyChart()
  }
})

onBeforeUnmount(() => destroyChart())
</script>

<style scoped>
.fc-adjust-enter-active,
.fc-adjust-leave-active {
  transition: opacity 0.2s ease;
}
.fc-adjust-enter-from,
.fc-adjust-leave-to {
  opacity: 0;
}
</style>
