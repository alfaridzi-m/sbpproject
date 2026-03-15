<template>
  <section class="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-6 mb-6">
    <h2 class="text-base font-semibold m-0 mb-4 text-[var(--text)]">Preview Dokumen — Seperti BMKG</h2>
    <div class="flex gap-2 mb-4">
      <button
        type="button"
        :class="['py-2 px-4 rounded-md text-sm cursor-pointer transition-all duration-200', pdfTemplate === 'rute-pelayaran' ? 'bg-[var(--primary)] text-white border border-[var(--primary)]' : 'bg-[var(--surface-hover)] border border-[var(--border)] hover:border-[var(--primary)] hover:text-[var(--primary)]']"
        @click="pdfTemplate = 'rute-pelayaran'"
      >
        Rute Pelayaran Khusus
      </button>
      <button
        type="button"
        :class="['py-2 px-4 rounded-md text-sm cursor-pointer transition-all duration-200', pdfTemplate === 'wisata-bahari' ? 'bg-[var(--primary)] text-white border border-[var(--primary)]' : 'bg-[var(--surface-hover)] border border-[var(--border)] hover:border-[var(--primary)] hover:text-[var(--primary)]']"
        @click="pdfTemplate = 'wisata-bahari'"
      >
        Wisata Bahari
      </button>
    </div>
    <div
      ref="pdfDocumentRef"
      class="bg-white border border-[var(--border)] rounded p-8 text-sm leading-normal text-slate-800 max-w-[210mm] mx-auto shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
    >
      <!-- BMKG Header with logo -->
      <header class="flex items-center gap-4 pb-4 mb-4 border-b-2 border-[var(--primary)]">
        <img
          src="/logo-bmkg.svg"
          alt="BMKG Logo"
          class="bmkg-logo shrink-0 object-contain"
          width="80"
          height="100"
        />
        <div class="flex-1">
          <p class="text-[0.8125rem] font-bold m-0 mb-1 text-[var(--text)]">BADAN METEOROLOGI, KLIMATOLOGI, DAN GEOFISIKA</p>
          <p class="text-[0.6875rem] font-semibold tracking-wide text-[var(--text-muted)] m-0">AGENCY FOR METEOROLOGY, CLIMATOLOGY, AND GEOPHYSICS</p>
        </div>
      </header>

      <!-- Document Title -->
      <div class="mb-6 pb-4 border-b-2 border-[var(--primary)]">
        <h1 class="text-base font-bold m-0 text-[var(--text)] whitespace-pre-line">
          {{ pdfTemplate === 'rute-pelayaran'
            ? `En Route and Port Weather Forecast Information for ${routeInfo.shipName || '[Nama Kapal]'}`
            : `Informasi Prakiraan Cuaca Wisata Bahari\n${routeInfo.portOrigin || '[Pelabuhan Asal]'} - ${routeInfo.portDestination || '[Pelabuhan Tujuan]'}`
          }}
        </h1>
      </div>

      <div class="grid gap-2 mb-6 p-4 bg-[var(--surface-hover)] rounded">
        <div class="grid grid-cols-[180px_1fr] gap-4">
          <span class="font-semibold text-[var(--text)]">Pelabuhan Asal</span>
          <span class="text-[var(--text)]">{{ routeInfo.portOrigin || '—' }}</span>
        </div>
        <div class="grid grid-cols-[180px_1fr] gap-4">
          <span class="font-semibold text-[var(--text)]">Pelabuhan Tujuan</span>
          <span class="text-[var(--text)]">{{ routeInfo.portDestination || '—' }}</span>
        </div>
        <div class="grid grid-cols-[180px_1fr] gap-4">
          <span class="font-semibold text-[var(--text)]">Waktu Keberangkatan</span>
          <span class="text-[var(--text)]">{{ formatDateTime(routeInfo.departureDate, routeInfo.departureTime) || '—' }} LT</span>
        </div>
        <div class="grid grid-cols-[180px_1fr] gap-4">
          <span class="font-semibold text-[var(--text)]">Waktu Tiba</span>
          <span class="text-[var(--text)]">{{ formatDateTime(routeInfo.arrivalDate, routeInfo.arrivalTime) || '—' }} LT</span>
        </div>
        <div class="grid grid-cols-[180px_1fr] gap-4">
          <span class="font-semibold text-[var(--text)]">Issued</span>
          <span class="text-[var(--text)]">{{ formatDateTime(routeInfo.issuedDate, routeInfo.issuedTime) || '—' }} LT</span>
        </div>
        <div class="grid grid-cols-[180px_1fr] gap-4">
          <span class="font-semibold text-[var(--text)]">Forecaster</span>
          <span class="text-[var(--text)]">{{ routeInfo.forecaster || '—' }}</span>
        </div>
      </div>

      <!-- Meteogram (Rute Pelayaran Khusus only) - Line chart style -->
      <div
        v-if="pdfTemplate === 'rute-pelayaran'"
        class="mb-6"
      >
        <h3 class="text-[0.8125rem] font-bold m-0 mb-2 text-[var(--text)]">Meteogram</h3>
        <div class="border border-[var(--border)] rounded p-4 bg-white text-xs">
          <svg
            class="w-full max-w-[520px] h-auto block"
            :viewBox="`0 0 ${chartWidth} ${chartHeight}`"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id="tempGrad" x1="0" x2="0" y1="1" y2="0">
                <stop offset="0" stop-color="#fda4af" />
                <stop offset="1" stop-color="#f43f5e" />
              </linearGradient>
            </defs>
            <!-- Grid -->
            <g class="meteogram-grid">
              <line
                v-for="i in 8"
                :key="'hy' + i"
                :x1="marginLeft"
                :y1="marginTop + (i - 1) * chartAreaH / 7"
                :x2="marginLeft + chartAreaW"
                :y2="marginTop + (i - 1) * chartAreaH / 7"
                stroke="#e2e8f0"
                stroke-width="0.5"
              />
              <line
                v-for="i in 10"
                :key="'vx' + i"
                :x1="marginLeft + (i - 1) * chartAreaW / 9"
                :y1="marginTop"
                :x2="marginLeft + (i - 1) * chartAreaW / 9"
                :y2="marginTop + chartAreaH"
                stroke="#e2e8f0"
                stroke-width="0.5"
              />
            </g>
            <!-- Temperature line (pink) -->
            <polyline
              v-if="tempPath"
              :points="tempPath"
              fill="none"
              stroke="url(#tempGrad)"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <!-- Wind speed line (blue) smooth curve with square markers -->
            <path
              v-if="windPath"
              :d="windPath"
              fill="none"
              stroke="#3b82f6"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <g v-for="(pt, i) in windPoints" :key="'pt' + i">
              <rect
                :x="pt.x - 3"
                :y="pt.y - 3"
                width="6"
                height="6"
                fill="#3b82f6"
              />
            </g>
            <!-- Left Y-axis: Temperature -->
            <text :x="marginLeft - 5" :y="marginTop + chartAreaH / 2" class="axis-label axis-left">Temperature (deg C)</text>
            <text v-for="(t, i) in [35, 30, 25, 20, 15, 10, 5, 0]" :key="'ty' + i" :x="marginLeft - 8" :y="marginTop + (1 - t / 35) * chartAreaH + 4" text-anchor="end" font-size="8" fill="#64748b">{{ t }}</text>
            <!-- Right Y-axis: Wind Speed -->
            <text :x="marginLeft + chartAreaW + 25" :y="marginTop + chartAreaH / 2" class="axis-label axis-right">Wind Speed (kts)</text>
            <text v-for="(w, i) in [14, 12, 10, 8, 6, 4, 2, 0]" :key="'wy' + i" :x="marginLeft + chartAreaW + 12" :y="marginTop + (1 - w / 14) * chartAreaH + 4" text-anchor="start" font-size="8" fill="#64748b">{{ w }}</text>
            <!-- Weather icons row -->
            <g class="meteogram-weather-icons">
              <text
                v-for="(row, i) in meteogramRows"
                :key="'wi' + row.id"
                :x="marginLeft + (i + 0.5) * (chartAreaW / meteogramRows.length)"
                :y="weatherIconY"
                text-anchor="middle"
                font-size="14"
              >{{ weatherIcon(row) }}</text>
            </g>
            <!-- Time axis labels -->
            <g class="meteogram-time-labels">
              <text
                v-for="(row, i) in meteogramRows"
                :key="'t' + row.id"
                :x="marginLeft + (i + 0.5) * (chartAreaW / meteogramRows.length)"
                :y="marginTop + chartAreaH + 18"
                text-anchor="middle"
                font-size="8"
                fill="#64748b"
              >{{ row.time }}</text>
            </g>
            <!-- Wind direction arrows -->
            <g class="meteogram-wind-arrows">
              <g
                v-for="(row, i) in meteogramRows"
                :key="'wa' + row.id"
                :transform="`translate(${marginLeft + (i + 0.5) * (chartAreaW / meteogramRows.length)},${marginTop + chartAreaH + 38}) rotate(${windDirectionAngle(row.wd)})`"
              >
                <path d="M0,-8 L-3,6 L0,2 L3,6 Z" fill="#1e293b" stroke="#1e293b" stroke-width="0.5" />
              </g>
            </g>
          </svg>
          <div class="flex gap-6 mt-3 pt-2 border-t border-[var(--border)] text-xs">
            <span class="flex items-center gap-2"><span class="inline-block w-6 h-0.5 rounded bg-gradient-to-r from-[#fda4af] to-[#f43f5e]" /> Temperature</span>
            <span class="flex items-center gap-2"><span class="inline-block w-6 h-0.5 rounded bg-[#3b82f6]" /> Wind Speed</span>
          </div>
        </div>
      </div>

      <div class="mb-5">
        <h3 class="text-[0.8125rem] font-bold m-0 mb-2 text-[var(--text)]">Kondisi Sinoptik / Meteorological Situation</h3>
        <p class="m-0 text-[0.8125rem]">{{ synopticInfo || '—' }}</p>
      </div>

      <div class="mb-5">
        <h3 class="text-[0.8125rem] font-bold m-0 mb-2 text-[var(--text)]">Peringatan Dini / Warnings</h3>
        <p class="m-0 text-[0.8125rem]">{{ warnings || '—' }}</p>
      </div>

      <div class="mb-5">
        <h3 class="text-[0.8125rem] font-bold m-0 mb-2 text-[var(--text)]">Peringatan Siklon Tropis / Cyclone Warning</h3>
        <p class="m-0 text-[0.8125rem]">{{ cycloneWarning || '—' }}</p>
      </div>

      <!-- Safety Advisory (Template: Rute Pelayaran) -->
      <div
        v-if="pdfTemplate === 'rute-pelayaran'"
        class="mb-5"
      >
        <h3 class="text-[0.8125rem] font-bold m-0 mb-2 text-[var(--text)]">Safety Advisory</h3>
        <p class="m-0 text-[0.8125rem] whitespace-pre-line">{{ safetyAdvisory || '—' }}</p>
      </div>

      <!-- Port Forecast Table -->
      <div class="mb-5">
        <h3 class="text-[0.8125rem] font-bold m-0 mb-2 text-[var(--text)]">Prakiraan Pelabuhan / Port Forecast</h3>
        <table class="w-full border-collapse text-xs [&_th]:p-2 [&_td]:p-2 [&_th]:border [&_td]:border [&_th]:border-[var(--border)] [&_td]:border-[var(--border)] [&_th]:text-left [&_td]:text-left [&_th]:bg-[var(--surface-hover)] [&_th]:font-semibold">
          <thead>
            <tr>
              <th>Pelabuhan Asal</th>
              <th>Pelabuhan Tujuan</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{ routeInfo.portOrigin || '—' }}</td>
              <td>{{ routeInfo.portDestination || '—' }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- En Route Forecast Table -->
      <div class="mb-5">
        <h3 class="text-[0.8125rem] font-bold m-0 mb-2 text-[var(--text)]">Informasi Titik Rute / En Route Forecast</h3>
        <table class="w-full border-collapse text-xs [&_th]:p-2 [&_td]:p-2 [&_th]:border [&_td]:border [&_th]:border-[var(--border)] [&_td]:border-[var(--border)] [&_th]:text-left [&_td]:text-left [&_th]:bg-[var(--surface-hover)] [&_th]:font-semibold [&_th]:text-center [&_td]:text-center">
          <thead>
            <tr>
              <th>Data</th>
              <th>Waktu</th>
              <th>Cuaca</th>
              <th>rr</th>
              <th>Wave (m)</th>
              <th>ws</th>
              <th>wd</th>
              <th>aruss</th>
              <th>arusd</th>
              <th>hslg</th>
              <th>hsig</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="row in forecastData"
              :key="row.id"
            >
              <td>{{ row.date }}</td>
              <td>{{ row.time }}</td>
              <td>{{ row.weather }}</td>
              <td>{{ row.rr }}</td>
              <td>{{ row.wave }}</td>
              <td>{{ row.ws }}</td>
              <td>{{ row.wd }}</td>
              <td>{{ row.aruss }}</td>
              <td>{{ row.arusd }}</td>
              <td>{{ row.hslg }}</td>
              <td>{{ row.hsig }}</td>
            </tr>
            <tr v-if="!forecastData.length">
              <td colspan="11" class="text-center text-[var(--text-muted)]">Belum ada data</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mt-6 pt-4 border-t border-[var(--border)]">
        <p class="m-0 text-[0.8125rem] italic text-[var(--text-muted)]">Disclaimer : {{ disclaimer }}</p>
      </div>

      <div class="mt-6 pt-4 text-center">
        <p class="text-[0.6875rem] font-bold tracking-widest text-[var(--text-muted)] m-0">AGENCY FOR METEOROLOGY, CLIMATOLOGY, AND GEOPHYSICS</p>
      </div>
    </div>
    <div class="flex justify-end mt-4">
      <button
        type="button"
        class="py-2 px-5 bg-[var(--primary)] text-white border-none rounded-md text-sm font-medium cursor-pointer transition-opacity duration-200 hover:opacity-90 disabled:opacity-60"
        :disabled="isDownloading"
        @click="downloadPdf"
      >
        {{ isDownloading ? 'Mengunduh...' : 'Download pdf' }}
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
const { routeInfo, forecastData, synopticInfo, warnings, cycloneWarning, disclaimer, safetyAdvisory, pdfTemplate } = useMaritimeData()

const pdfDocumentRef = ref<HTMLElement | null>(null)
const isDownloading = ref(false)

// Meteogram layout
const chartWidth = 520
const chartHeight = 220
const marginLeft = 50
const marginTop = 35
const chartAreaW = chartWidth - marginLeft - 60
const chartAreaH = chartHeight - marginTop - 55
const weatherIconY = 18

const meteogramRows = computed(() => forecastData.value.filter(r => r.date || r.time))

const tempPath = computed(() => {
  const rows = meteogramRows.value
  if (!rows.length) return ''
  const pts = rows.map((r, i) => {
    const temp = parseFloat(r.temp || '0') || 25
    const x = marginLeft + (i + 0.5) * (chartAreaW / rows.length)
    const y = marginTop + (1 - temp / 35) * chartAreaH
    return `${x},${y}`
  })
  return pts.join(' ')
})

/** Converts points to a smooth SVG path using Catmull-Rom spline interpolation */
function pointsToSmoothPath(points: { x: number; y: number }[]): string {
  if (points.length < 2) return ''
  const p0 = points[0]!
  const p1 = points[1]!
  if (points.length === 2) {
    return `M ${p0.x},${p0.y} L ${p1.x},${p1.y}`
  }
  const tension = 0.2 // Lower = looser, smoother curve
  let path = `M ${p0.x},${p0.y}`
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i]!
    const p2 = points[i + 1]!
    const p0 = points[i - 1] ?? {
      x: p1.x - (p2.x - p1.x),
      y: p1.y - (p2.y - p1.y),
    }
    const p3 = points[i + 2] ?? {
      x: p2.x + (p2.x - p1.x),
      y: p2.y + (p2.y - p1.y),
    }
    const cp1x = p1.x + (p2.x - p0.x) * tension
    const cp1y = p1.y + (p2.y - p0.y) * tension
    const cp2x = p2.x - (p3.x - p1.x) * tension
    const cp2y = p2.y - (p3.y - p1.y) * tension
    path += ` C ${cp1x.toFixed(2)},${cp1y.toFixed(2)} ${cp2x.toFixed(2)},${cp2y.toFixed(2)} ${p2.x},${p2.y}`
  }
  return path
}

const windPath = computed(() => {
  const pts = windPoints.value
  return pts.length ? pointsToSmoothPath(pts) : ''
})
const windPoints = computed(() => {
  const rows = meteogramRows.value
  if (!rows.length) return []
  return rows.map((r, i) => {
    const ws = parseFloat(r.ws || '0') || 5
    const x = marginLeft + (i + 0.5) * (chartAreaW / rows.length)
    const y = marginTop + (1 - Math.min(14, ws) / 14) * chartAreaH
    return { x, y }
  })
})

const windPathPoints = computed(() => {
  const rows = meteogramRows.value
  if (!rows.length) return ''
  return rows.map((r, i) => {
    const ws = parseFloat(r.ws || '0') || 5
    const x = marginLeft + (i + 0.5) * (chartAreaW / rows.length)
    const y = marginTop + (1 - Math.min(14, ws) / 14) * chartAreaH
    return `${x},${y}`
  }).join(' ')
})

function weatherIcon(row: { weather?: string; rr?: string }) {
  const w = (row.weather || '').toLowerCase()
  const rr = parseFloat(row.rr || '0') || 0
  if (rr > 0 || w.includes('hujan')) return '🌧️'
  if (w.includes('cerah') && w.includes('berawan')) return '⛅'
  if (w.includes('berawan')) return '☁️'
  if (w.includes('cerah')) return '☀️'
  return '⛅'
}

function windDirectionAngle(wd: string): number {
  const map: Record<string, number> = { N: 180, NNE: 202.5, NE: 225, ENE: 247.5, E: 270, ESE: 292.5, SE: 315, SSE: 337.5, S: 0, SSW: 22.5, SW: 45, WSW: 67.5, W: 90, WNW: 112.5, NW: 135, NNW: 157.5 }
  return map[wd?.toUpperCase()] ?? 0
}

function formatDateTime(date: string, time: string) {
  if (!date) return ''
  const d = new Date(date)
  const day = d.getDate()
  const month = d.toLocaleDateString('id-ID', { month: 'long' })
  const year = d.getFullYear()
  const dateStr = `${day} ${month} ${year}`
  if (!time) return dateStr
  return `${dateStr} pukul ${time}`
}

async function svgToPngDataUrl(svgUrl: string): Promise<string> {
  const url = svgUrl.startsWith('/') ? `${window.location.origin}${svgUrl}` : svgUrl
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        const w = img.naturalWidth || img.width || 160
        const h = img.naturalHeight || img.height || 200
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d')
        if (!ctx) return reject(new Error('Canvas context not available'))
        ctx.drawImage(img, 0, 0, w, h)
        resolve(canvas.toDataURL('image/png'))
      } catch (e) {
        reject(e)
      }
    }
    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = url
  })
}

async function downloadPdf() {
  const el = pdfDocumentRef.value
  if (!el) return

  isDownloading.value = true
  try {
    // Convert SVG logo to PNG data URL (html2canvas has issues with SVG)
    let logoDataUrl: string | null = null
    const logoImg = el.querySelector<HTMLImageElement>('.bmkg-logo')
    if (logoImg?.src) {
      try {
        const url = logoImg.src.startsWith('/') ? `${window.location.origin}${logoImg.src}` : logoImg.src
        logoDataUrl = await svgToPngDataUrl(url)
      } catch {
        // Fallback: use original src if conversion fails
      }
    }

    const html2pdf = (await import('html2pdf.js')).default
    const opt = {
      margin: 10,
      filename: `forecast-${(routeInfo.value.shipName || 'report').replace(/[^a-zA-Z0-9-_]/g, '_')}.pdf`,
      image: { type: 'png' as const, quality: 1 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        onclone: (_clonedDoc: Document, clonedEl: HTMLElement) => {
          if (logoDataUrl) {
            const img = clonedEl.querySelector<HTMLImageElement>('.bmkg-logo')
            if (img) img.src = logoDataUrl
          }
        },
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const },
    }
    const worker = html2pdf().set(opt).from(el)
    const blob = await worker.outputPdf('blob')
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = opt.filename
    a.click()
    URL.revokeObjectURL(url)
  } catch (err) {
    console.error('PDF generation failed:', err)
  } finally {
    isDownloading.value = false
  }
}
</script>

