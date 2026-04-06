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
              <div class="flex flex-wrap items-center justify-between gap-2 shrink-0">
                <div class="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    class="px-2.5 py-1.5 rounded-md text-xs font-medium cursor-pointer bg-[var(--surface)] text-[var(--text-muted)] border border-[var(--border)] shadow-[var(--shadow-sm)] transition-colors hover:text-[var(--text)] hover:border-[var(--text-muted)]"
                    @click="resetCurrentTab"
                  >
                    Reset tab
                  </button>
                  <button
                    v-if="isZoomed"
                    type="button"
                    class="px-2.5 py-1.5 rounded-md text-xs font-medium cursor-pointer bg-[var(--surface)] text-[var(--text-muted)] border border-[var(--border)] shadow-[var(--shadow-sm)] transition-colors hover:text-[var(--text)] hover:border-[var(--text-muted)]"
                    @click="resetZoom"
                  >
                    Reset zoom
                  </button>
                </div>
                <p class="text-[11px] text-[var(--text-muted)] m-0 text-right">
                  Scroll to zoom · Shift+drag to pan · Drag points to adjust
                </p>
              </div>
              <div class="relative w-full flex-1 min-h-0" style="min-height: 320px">
                <canvas ref="chartCanvas" style="touch-action: none" />
              </div>
              <div
                class="shrink-0 rounded-xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_96%,var(--border)_4%)] px-4 py-3"
              >
                <h3 class="text-xs font-semibold text-[var(--text)] m-0 mb-2 tracking-wide uppercase text-[var(--text-muted)]">
                  Data manipulation
                </h3>
                <p class="text-[11px] text-[var(--text-muted)] m-0 mb-3">
                  Scale the <strong class="text-[var(--text)] font-medium">{{ getActiveParam().label }}</strong> series linearly into a target range, or round to reporting precision.
                </p>
                <div class="flex flex-wrap items-end gap-3">
                  <div class="flex flex-col gap-0.5">
                    <label class="text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wide" for="fc-norm-min">Target min</label>
                    <input
                      id="fc-norm-min"
                      v-model.number="normTargetMin"
                      type="number"
                      step="any"
                      class="w-[6.5rem] py-1.5 px-2 rounded-md border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)] text-sm"
                    />
                  </div>
                  <div class="flex flex-col gap-0.5">
                    <label class="text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wide" for="fc-norm-max">Target max</label>
                    <input
                      id="fc-norm-max"
                      v-model.number="normTargetMax"
                      type="number"
                      step="any"
                      class="w-[6.5rem] py-1.5 px-2 rounded-md border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)] text-sm"
                    />
                  </div>
                  <button
                    type="button"
                    class="px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] shadow-[var(--shadow-sm)] transition-colors hover:border-[var(--text-muted)]"
                    title="Map current min→target min and current max→target max (linear)"
                    @click="normalizeActiveTabRange"
                  >
                    Normalize range
                  </button>
                  <button
                    type="button"
                    class="px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] shadow-[var(--shadow-sm)] transition-colors hover:border-[var(--text-muted)]"
                    title="Nearest integer (visibility, wind/current speed); nearest 0.1 (wave, hsig); nearest 10° for directions"
                    @click="roundActiveTabNearest"
                  >
                    Round nearest
                  </button>
                </div>
              </div>
            </template>
          </div>

          <!-- Footer -->
          <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-[var(--border)] shrink-0">
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
  { key: 'ws', label: 'Wind Speed', unit: 'kt', color: '#10b981', min: 0, decimals: 1 },
  { key: 'wd', label: 'Wind Dir', unit: '°', color: '#f59e0b', min: 0, max: 360, decimals: 0 },
  { key: 'aruss', label: 'Current Speed', unit: 'cm/s', color: '#8b5cf6', min: 0, decimals: 2 },
  { key: 'arusd', label: 'Current Dir', unit: '°', color: '#ec4899', min: 0, max: 360, decimals: 0 },
  { key: 'hsig', label: 'Hsig', unit: 'm', color: '#ef4444', min: 0, decimals: 2 },
]

const activeTab = ref<ParamKey>('visibility')
const chartCanvas = ref<HTMLCanvasElement | null>(null)
const isZoomed = ref(false)

/** Target range for “Normalize range” (linear map from current series min/max). */
const normTargetMin = ref(0)
const normTargetMax = ref(1)

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

function isDarkMode(): boolean {
  if (!import.meta.client) return false
  return document.documentElement.getAttribute('data-theme') === 'dark'
}

function getChartLabelColor(): string {
  return isDarkMode() ? '#94a3b8' : '#6b7280'
}

function getChartGridColor(opacity = 1): string {
  const base = isDarkMode() ? 0.15 : 0.12
  return `rgba(128,128,128,${base * opacity})`
}

function clampDirectionDeg(deg: number): number {
  return Math.min(360, Math.max(0, deg))
}

/** Calm: ws ≤ 0 ⇒ wd 0. Otherwise “north” is 360, not 0. */
function normalizeWindDirection(ws: number, wd: number): number {
  if (!(ws > 0)) return 0
  if (wd === 0) return 360
  return wd
}

/** Nearest 10° on [0, 360] (e.g. 124→120, 275→280, 8→10). */
function roundNearestDirectionDeg(deg: number): number {
  const d = clampDirectionDeg(deg)
  if (d === 0) return 0
  const t = Math.round(d / 10) * 10
  return clampDirectionDeg(t)
}

function roundValueNearest(key: ParamKey, value: number, edits?: Record<ParamKey, number>): number {
  const p = parameters.find(x => x.key === key)!
  let v: number
  if (key === 'visibility' || key === 'ws' || key === 'aruss') {
    v = Math.round(value)
  } else if (key === 'wave' || key === 'hsig') {
    v = Math.round(value * 10) / 10
  } else if (key === 'wd') {
    v = roundNearestDirectionDeg(value)
    v = normalizeWindDirection(edits?.ws ?? 0, v)
  } else if (key === 'arusd') {
    v = roundNearestDirectionDeg(value)
  } else {
    v = value
  }
  v = Math.max(p.min, v)
  if (p.max != null) v = Math.min(p.max, v)
  if (key === 'wave' || key === 'hsig') return Number(v.toFixed(1))
  return Math.round(v)
}

function roundActiveTabNearest() {
  const key = activeTab.value
  for (const row of forecastData.value) {
    const edits = editedValues.value[row.id]
    if (!edits) continue
    edits[key] = roundValueNearest(key, edits[key], edits)
    if (key === 'ws' || key === 'wd') {
      edits.wd = normalizeWindDirection(edits.ws, edits.wd)
    }
  }
  nextTick(() => buildChart())
}

function snapValueForActiveParam(key: ParamKey, v: number): number {
  const p = parameters.find(x => x.key === key)!
  let x = v
  x = Math.max(p.min, x)
  if (p.max != null) x = Math.min(p.max, x)
  if (key === 'wave' || key === 'hsig') return Number(x.toFixed(1))
  return Math.round(x)
}

/** Linear map: current series min → target min, max → target max. */
function normalizeActiveTabRange() {
  const key = activeTab.value
  const tMin = normTargetMin.value
  const tMax = normTargetMax.value
  if (!Number.isFinite(tMin) || !Number.isFinite(tMax) || tMin >= tMax) return

  const values: number[] = []
  for (const row of forecastData.value) {
    const v = editedValues.value[row.id]?.[key]
    if (v != null && Number.isFinite(v)) values.push(v)
  }
  if (!values.length) return

  const vmin = Math.min(...values)
  const vmax = Math.max(...values)

  if (vmin === vmax) {
    const mid = (tMin + tMax) / 2
    for (const row of forecastData.value) {
      const ed = editedValues.value[row.id]
      if (ed) ed[key] = snapValueForActiveParam(key, mid)
    }
  } else {
    const scale = (tMax - tMin) / (vmax - vmin)
    for (const row of forecastData.value) {
      const ed = editedValues.value[row.id]
      if (!ed) continue
      const nv = (ed[key] - vmin) * scale + tMin
      ed[key] = snapValueForActiveParam(key, nv)
    }
  }

  if (key === 'ws' || key === 'wd') {
    for (const row of forecastData.value) {
      const ed = editedValues.value[row.id]
      if (ed) ed.wd = normalizeWindDirection(ed.ws, ed.wd)
    }
  }
  nextTick(() => buildChart())
}

function syncNormalizeRangeDefaults() {
  if (!forecastData.value.length) return
  const p = getActiveParam()
  const key = p.key
  let lo = Number.POSITIVE_INFINITY
  let hi = Number.NEGATIVE_INFINITY
  for (const row of forecastData.value) {
    const v = editedValues.value[row.id]?.[key]
    if (v != null && Number.isFinite(v)) {
      lo = Math.min(lo, v)
      hi = Math.max(hi, v)
    }
  }
  if (!Number.isFinite(lo)) {
    lo = p.min
    hi = p.max ?? p.min + 1
  }
  if (hi <= lo) hi = lo + 1e-4
  normTargetMin.value = lo
  normTargetMax.value = hi
}

/** How values are written back to forecast rows on Apply (no “30.0”; dirs three digits). */
function formatEditedValueForApply(key: ParamKey, val: number, edits?: Record<ParamKey, number>): string {
  if (key === 'wd') {
    const ws = edits?.ws ?? 0
    const d = Math.round(normalizeWindDirection(ws, val))
    if (d === 0) return ''
    return String(d).padStart(3, '0')
  }
  if (key === 'arusd') {
    const d = Math.round(val)
    if (d === 0) return ''
    return String(d).padStart(3, '0')
  }
  if (val === 0) return ''
  if (key === 'wave' || key === 'hsig') return val.toFixed(1)
  if (key === 'visibility' || key === 'ws' || key === 'aruss') return String(Math.round(val))
  const p = parameters.find(x => x.key === key)!
  return val.toFixed(p.decimals)
}

function initSnapshot() {
  originalValues.value = {}
  editedValues.value = {}
  for (const row of forecastData.value) {
    const vals = {} as Record<ParamKey, number>
    for (const p of parameters) vals[p.key] = readRowNum(row, p.key)
    vals.wd = normalizeWindDirection(vals.ws, vals.wd)
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
        pointBorderColor: isDarkMode() ? '#1a1d27' : '#ffffff',
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
            color: getChartLabelColor(),
          },
          grid: { color: getChartGridColor() },
          ticks: { color: getChartLabelColor(), font: { size: 11 } },
        },
        x: {
          ticks: {
            maxRotation: 45,
            font: { size: 10 },
            color: getChartLabelColor(),
            autoSkip: true,
            maxTicksLimit: 20,
          },
          grid: { color: getChartGridColor(0.6) },
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
  const canvasEl = chartCanvas.value
  if (!canvasEl || !chartInstance) return
  const canvas: HTMLCanvasElement = canvasEl

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

    const rowId = forecastData.value[dragIdx]?.id
    if (rowId && editedValues.value[rowId]) {
      const ed = editedValues.value[rowId]
      ed[activeTab.value] = value
      if (activeTab.value === 'ws' || activeTab.value === 'wd') {
        ed.wd = normalizeWindDirection(ed.ws, ed.wd)
      }
    }

    let plotY = value
    if (activeTab.value === 'wd' && rowId && editedValues.value[rowId]) {
      plotY = editedValues.value[rowId].wd
    }
    chartInstance.data.datasets[0].data[dragIdx] = plotY
    chartInstance.update('none')
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
    const edits = editedValues.value[row.id]
    if (orig && edits) {
      edits[activeTab.value] = orig[activeTab.value]
      if (activeTab.value === 'ws' || activeTab.value === 'wd') {
        edits.wd = normalizeWindDirection(edits.ws, edits.wd)
      }
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
      r[p.key] = formatEditedValueForApply(p.key, edits[p.key], edits)
    }
  }
  emit('update:modelValue', false)
}

function cancel() {
  emit('update:modelValue', false)
}

watch(activeTab, () => {
  syncNormalizeRangeDefaults()
})

watch(() => props.modelValue, async (v) => {
  if (v) {
    initSnapshot()
    await nextTick()
    syncNormalizeRangeDefaults()
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
