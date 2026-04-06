<template>
  <div>
    <div
      ref="pdfDocumentRef"
      class="text-sm leading-normal text-slate-800 w-[210mm] mx-auto"
    >
      <!-- PAGE 1 -->
      <div class="pdf-page p-8 flex flex-col">
        <!-- BMKG Header -->
        <header class="flex items-center gap-4 -mx-8 px-8 py-4 mb-4 border-b border-slate-300 bg-slate-100">
          <img
            :src="bmkgLogoUrl"
            alt="BMKG Logo"
            class="bmkg-logo shrink-0 object-contain"
            width="70"
            height="88"
          />
          <div class="flex-1 text-center">
            <p class="text-[0.875rem] font-bold m-0 mb-0.5 text-slate-900 tracking-wide">BADAN METEOROLOGI, KLIMATOLOGI, DAN GEOFISIKA</p>
            <p class="text-[0.75rem] font-semibold m-0 mb-0.5 text-slate-700">{{ routeInfo.namaUpt || 'Stasiun Meteorologi Maritim Tenau Kupang' }}</p>
            <p class="text-[0.6875rem] m-0 mb-0.5 text-slate-600">{{ routeInfo.alamat || 'Jalan M. Praja Alak' }}</p>
            <p class="text-[0.6875rem] m-0 text-slate-600">Telp: {{ routeInfo.telp || '081215122192' }} | Email: {{ routeInfo.email || 'stamar.tenau@bmkg.go.id' }}</p>
          </div>
        </header>

        <!-- Document Title -->
        <div class="text-center mb-4">
          <h1 class="text-[0.9375rem] font-bold m-0 text-red-800">Informasi Prakiraan Cuaca Wisata Bahari</h1>
          <p class="text-[0.875rem] font-bold m-0 mt-0.5 text-red-800">
            {{ routeInfo.portOrigin || '[Pelabuhan Asal]' }} - {{ routeInfo.portDestination || '[Pelabuhan Tujuan]' }}
          </p>
        </div>

        <!-- Route Info Box (2 columns) -->
        <div class="border border-slate-300 rounded p-3 mb-5 pdf-avoid-split">
          <div class="grid grid-cols-2 gap-x-6 gap-y-2 text-[0.75rem]">
            <div>
              <p class="m-0 font-bold text-slate-900">Pelabuhan Asal</p>
              <p class="m-0 text-slate-700">{{ routeInfo.portOrigin || '—' }}</p>
            </div>
            <div>
              <p class="m-0 font-bold text-slate-900">Pelabuhan Tujuan</p>
              <p class="m-0 text-slate-700">{{ routeInfo.portDestination || '—' }}</p>
            </div>
            <div>
              <p class="m-0 font-bold text-slate-900">Waktu Keberangkatan</p>
              <p class="m-0 text-slate-700">{{ formatDateTime(routeInfo.departureDate, routeInfo.departureTime) || '—' }} LT</p>
            </div>
            <div>
              <p class="m-0 font-bold text-slate-900">Waktu Tiba</p>
              <p class="m-0 text-slate-700">{{ formatDateTime(routeInfo.arrivalDate, routeInfo.arrivalTime) || '—' }} LT</p>
            </div>
            <div>
              <p class="m-0 font-bold text-slate-900">Issued</p>
              <p class="m-0 text-slate-700">{{ formatDateTime(routeInfo.issuedDate, routeInfo.issuedTime) || '—' }} LT</p>
            </div>
          </div>
        </div>

        <!-- Map -->
        <div class="mb-5 flex justify-center pdf-avoid-split">
          <div class="w-[75%] border border-slate-300 rounded-lg overflow-hidden bg-slate-50">
            <div ref="mapContainerRef" class="w-full h-[260px]" />
          </div>
        </div>

        <!-- Kondisi Sinoptik -->
        <div class="mb-4 pdf-avoid-split">
          <h3 class="text-[0.8125rem] font-bold italic m-0 mb-1.5 text-slate-900 underline">Kondisi Sinoptik</h3>
          <p class="m-0 text-[0.6875rem] leading-relaxed text-justify text-slate-800">{{ synopticInfo || '—' }}</p>
        </div>

        <!-- Peringatan Dini -->
        <div class="mb-2 pdf-avoid-split">
          <h3 class="text-[0.8125rem] font-bold m-0 mb-1.5 text-slate-900 underline">Peringatan Dini</h3>
          <p class="m-0 text-[0.6875rem] leading-relaxed bg-yellow-200 inline px-1">{{ warnings || '—' }}</p>
        </div>

        <!-- Peringatan Siklon Tropis -->
        <div class="mb-4 mt-1">
          <p class="m-0 text-[0.6875rem] leading-relaxed text-slate-800">
            <span class="font-bold underline">Peringatan Siklon Tropis</span> : {{ cycloneWarning || 'Tidak ada sistem siklon tropis yang aktif' }}
          </p>
        </div>

        <!-- Prakiraan Pelabuhan -->
        <div class="mb-4 pdf-avoid-split">
          <h3 class="text-[0.8125rem] font-bold m-0 mb-2 text-slate-900 underline">Prakiraan Pelabuhan</h3>
          <div class="grid grid-cols-2 gap-4 text-[0.6875rem]">
            <!-- Pelabuhan Asal -->
            <div class="border border-slate-300 rounded p-3">
              <p class="m-0 font-bold text-slate-700 mb-1">Pelabuhan Asal</p>
              <p class="m-0 font-bold text-slate-900 mb-2">{{ routeInfo.portOrigin || '—' }}</p>
              <div class="grid grid-cols-[auto_auto_1fr] gap-x-2 gap-y-0.5">
                <span class="text-slate-700">Cuaca</span>
                <span class="text-slate-700" />
                <span class="text-slate-900">{{ portForecastOrigin.cuaca }}</span>
                <span class="text-slate-700">Tinggi Gelombang</span>
                <span class="text-slate-700">: {{ portForecastOrigin.tinggiGelombang }}</span>
                <span class="text-slate-900">m</span>
                <span class="text-slate-700">Angin</span>
                <span class="text-slate-700">: {{ portForecastOrigin.anginKecepatan }}</span>
                <span class="text-slate-900">knot - {{ portForecastOrigin.anginArah }}</span>
                <span class="text-slate-700">Jarak Pandang</span>
                <span class="text-slate-700">: {{ portForecastOrigin.jarakPandang }}</span>
                <span class="text-slate-900">km</span>
              </div>
            </div>
            <!-- Pelabuhan Tujuan -->
            <div class="border border-slate-300 rounded p-3">
              <p class="m-0 font-bold text-slate-700 mb-1">Pelabuhan Tujuan</p>
              <p class="m-0 font-bold text-slate-900 mb-2">{{ routeInfo.portDestination || '—' }}</p>
              <div class="grid grid-cols-[auto_auto_1fr] gap-x-2 gap-y-0.5">
                <span class="text-slate-700">Cuaca</span>
                <span class="text-slate-700" />
                <span class="text-slate-900">{{ portForecastDestination.cuaca }}</span>
                <span class="text-slate-700">Tinggi Gelombang</span>
                <span class="text-slate-700">: {{ portForecastDestination.tinggiGelombang }}</span>
                <span class="text-slate-900">m</span>
                <span class="text-slate-700">Angin</span>
                <span class="text-slate-700">: {{ portForecastDestination.anginKecepatan }}</span>
                <span class="text-slate-900">knot - {{ portForecastDestination.anginArah }}</span>
                <span class="text-slate-700">Jarak Pandang</span>
                <span class="text-slate-700">: {{ portForecastDestination.jarakPandang }}</span>
                <span class="text-slate-900">km</span>
              </div>
            </div>
          </div>
        </div>

        <!-- DISCLAIMER (pinned bottom) -->
        <div class="mt-auto pt-3 border-t border-slate-200 pdf-avoid-split">
          <p class="m-0 text-[0.6875rem] italic text-slate-500">Disclaimer : {{ disclaimer }}</p>
        </div>
      </div>

      <!-- PAGE 2 -->
      <div class="pdf-page pdf-page-start p-8 flex flex-col">
        <!-- BMKG Header (repeated for page 2) -->
        <header class="flex items-center gap-4 -mx-8 px-8 py-4 mb-4 border-b border-slate-300 bg-slate-100">
          <img
            :src="bmkgLogoUrl"
            alt="BMKG Logo"
            class="bmkg-logo shrink-0 object-contain"
            width="70"
            height="88"
          />
          <div class="flex-1 text-center">
            <p class="text-[0.875rem] font-bold m-0 mb-0.5 text-slate-900 tracking-wide">BADAN METEOROLOGI, KLIMATOLOGI, DAN GEOFISIKA</p>
            <p class="text-[0.75rem] font-semibold m-0 mb-0.5 text-slate-700">{{ routeInfo.namaUpt || 'Stasiun Meteorologi Maritim Tenau Kupang' }}</p>
            <p class="text-[0.6875rem] m-0 mb-0.5 text-slate-600">{{ routeInfo.alamat || 'Jalan M. Praja Alak' }}</p>
            <p class="text-[0.6875rem] m-0 text-slate-600">Telp: {{ routeInfo.telp || '081215122192' }} | Email: {{ routeInfo.email || 'stamar.tenau@bmkg.go.id' }}</p>
          </div>
        </header>

        <!-- Document Title (repeated) -->
        <div class="text-center mb-4">
          <h1 class="text-[0.9375rem] font-bold m-0 text-red-800">Informasi Prakiraan Cuaca Wisata Bahari</h1>
          <p class="text-[0.875rem] font-bold m-0 mt-0.5 text-red-800">
            {{ routeInfo.portOrigin || '[Pelabuhan Asal]' }} - {{ routeInfo.portDestination || '[Pelabuhan Tujuan]' }}
          </p>
        </div>

        <!-- Route Info Box (repeated) -->
        <div class="border border-slate-300 rounded p-3 mb-5 pdf-avoid-split">
          <div class="grid grid-cols-2 gap-x-6 gap-y-2 text-[0.75rem]">
            <div>
              <p class="m-0 font-bold text-slate-900">Pelabuhan Asal</p>
              <p class="m-0 text-slate-700">{{ routeInfo.portOrigin || '—' }}</p>
            </div>
            <div>
              <p class="m-0 font-bold text-slate-900">Pelabuhan Tujuan</p>
              <p class="m-0 text-slate-700">{{ routeInfo.portDestination || '—' }}</p>
            </div>
            <div>
              <p class="m-0 font-bold text-slate-900">Waktu Keberangkatan</p>
              <p class="m-0 text-slate-700">{{ formatDateTime(routeInfo.departureDate, routeInfo.departureTime) || '—' }} LT</p>
            </div>
            <div>
              <p class="m-0 font-bold text-slate-900">Waktu Tiba</p>
              <p class="m-0 text-slate-700">{{ formatDateTime(routeInfo.arrivalDate, routeInfo.arrivalTime) || '—' }} LT</p>
            </div>
            <div>
              <p class="m-0 font-bold text-slate-900">Issued</p>
              <p class="m-0 text-slate-700">{{ formatDateTime(routeInfo.issuedDate, routeInfo.issuedTime) || '—' }} LT</p>
            </div>
          </div>
        </div>

        <!-- Informasi Titik Rute -->
        <div class="mb-5 pdf-avoid-split">
          <h3 class="text-[0.8125rem] font-bold m-0 mb-3 text-slate-900 underline text-center">Informasi Titik Rute</h3>
          <table class="w-full border-collapse text-[0.625rem]">
            <thead>
              <tr class="bg-slate-700 text-white">
                <th class="p-1.5 border border-slate-600 text-center font-semibold">Koordinat</th>
                <th class="p-1.5 border border-slate-600 text-center font-semibold">Kondisi<br>Cuaca</th>
                <th class="p-1.5 border border-slate-600 text-center font-semibold">Jarak<br>Pandang(km)</th>
                <th class="p-1.5 border border-slate-600 text-center font-semibold">Gelombang(m)</th>
                <th class="p-1.5 border border-slate-600 text-center font-semibold" colspan="2">Angin(kt)</th>
                <th class="p-1.5 border border-slate-600 text-center font-semibold">Gust(kt)</th>
                <th class="p-1.5 border border-slate-600 text-center font-semibold" colspan="2">Arus(cm/s)</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(row, idx) in forecastData"
                :key="row.id"
                :class="idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'"
              >
                <td class="p-1.5 border border-slate-200 text-left text-[0.5625rem] leading-tight">{{ row.coordinate || row.date || '—' }}</td>
                <td class="p-1.5 border border-slate-200 text-center">{{ row.weather }}</td>
                <td class="p-1.5 border border-slate-200 text-center">{{ row.visibility || '—' }}</td>
                <td class="p-1.5 border border-slate-200 text-center">{{ row.wave }}</td>
                <td class="p-1.5 border border-slate-200 text-center">{{ row.ws }}</td>
                <td class="p-1.5 border border-slate-200 text-center">{{ row.wd }}</td>
                <td class="p-1.5 border border-slate-200 text-center">{{ row.hsig }}</td>
                <td class="p-1.5 border border-slate-200 text-center">{{ row.aruss }}</td>
                <td class="p-1.5 border border-slate-200 text-center">{{ row.arusd }}</td>
              </tr>
              <tr v-if="!forecastData.length">
                <td colspan="9" class="p-2 text-center text-slate-400 border border-slate-200">Belum ada data</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Forecaster on Duty -->
        <div class="mt-8 pr-4 pdf-avoid-split w-full flex justify-end">
          <div class="flex min-w-0 max-w-[14rem] flex-col items-center gap-2 text-center">
            <p class="m-0 w-full text-[0.8125rem] text-slate-800">Forecaster on Duty</p>
            <img
              v-if="signatureDataUrl"
              :src="signatureDataUrl"
              alt="Tanda tangan forecaster"
              class="block max-h-[4.5rem] max-w-[13rem] w-auto h-auto object-contain"
            >
            <p
              class="m-0 w-full text-[0.8125rem] font-semibold text-slate-900 break-words"
              :class="signatureDataUrl ? '' : 'pt-12'"
            >
              ({{ routeInfo.forecaster || '—' }})
            </p>
          </div>
        </div>

        <!-- DISCLAIMER (pinned bottom) -->
        <div class="mt-auto pt-3 border-t border-slate-200 pdf-avoid-split">
          <p class="m-0 text-[0.6875rem] italic text-slate-500">Disclaimer : {{ disclaimer }}</p>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import type L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const { routeInfo, forecastData, synopticInfo, warnings, cycloneWarning, disclaimer, manualRouteData } = useMaritimeData()
const bmkgLogoUrl = useBmkgLogoUrl()

const signatureDataUrl = computed(() => {
  const u = routeInfo.value.signatureImageDataUrl?.trim()
  return u || ''
})

const pdfDocumentRef = ref<HTMLElement | null>(null)
const mapContainerRef = ref<HTMLElement | null>(null)
const isDownloading = ref(false)

const portForecastOrigin = reactive({
  cuaca: 'Berawan Tebal',
  tinggiGelombang: '0,4',
  anginKecepatan: '6',
  anginArah: 'Utara',
  jarakPandang: '21',
})

const portForecastDestination = reactive({
  cuaca: 'Berawan Tebal',
  tinggiGelombang: '0,68',
  anginKecepatan: '6',
  anginArah: 'Utara',
  jarakPandang: '37',
})

let map: L.Map | null = null

const DEFAULT_COORDINATES: [number, number][] = [
  [124.549938922943, 1.2001702882989633],
  [124.5501216227247, 1.2003864258154806],
  [124.55048990311656, 1.2009221253564277],
  [124.55176136822041, 1.2024551270183252],
  [124.55239319828848, 1.2036948479074283],
  [124.55302754307411, 1.2080352333612154],
  [124.55190757119635, 1.2129843899773505],
  [124.54708684693941, 1.2179973771220602],
  [124.47440407900262, 1.3058458713355634],
  [124.48453490772238, 1.371295134439947],
  [124.79064915680777, 1.5877967281989527],
  [124.81015988588376, 1.6163176365279952],
  [124.86606744412484, 1.7150104927792427],
  [125.28757565394824, 2.6395500006033785],
  [125.32906091778466, 2.8166426315258803],
  [125.46816849594063, 3.148169659833087],
  [125.53313156759873, 3.3430269212128394],
  [125.53994313459322, 3.382314880333297],
  [125.5539909981245, 3.4154384508432685],
  [125.55411139867488, 3.420755693878732],
  [125.55243950295562, 3.428712774816873],
  [125.55161879798663, 3.4306789363960917],
  [125.55122522373813, 3.431545686955289],
  [125.54988935033327, 3.4336870706982126]
]

function getRouteCoordinates(): [number, number][] {
  if (manualRouteData.value?.coordinates && manualRouteData.value.coordinates.length >= 2) {
    return manualRouteData.value.coordinates
  }
  return DEFAULT_COORDINATES
}

onMounted(async () => {
  const el = mapContainerRef.value
  if (!el) return
  const Leaflet = (await import('leaflet')).default

  try {
    map = Leaflet.map(el, { preferCanvas: true, zoomControl: false, attributionControl: false }).setView([2.3, 125], 6)
    Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map)

    const coords = getRouteCoordinates()
    const geoJson: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        properties: {},
        geometry: { type: 'LineString', coordinates: coords }
      }]
    }
    const layer = Leaflet.geoJSON(geoJson as never, {
      style: { color: '#01A73E', weight: 4, opacity: 0.9 }
    }).addTo(map)
    if (layer.getBounds().isValid()) {
      map.fitBounds(layer.getBounds(), { padding: [20, 20] })
    }
    await nextTick()
    requestAnimationFrame(() => {
      requestAnimationFrame(() => map?.invalidateSize())
    })
  } catch (err) {
    console.error('Map init error:', err)
  }
})

onBeforeUnmount(() => {
  map?.remove()
  map = null
})

function formatDateTime(date: string, time: string) {
  if (!date) return ''
  const d = new Date(date)
  const day = d.getUTCDate()
  const month = d.toLocaleDateString('id-ID', { month: 'long', timeZone: 'UTC' })
  const year = d.getUTCFullYear()
  const dateStr = `${day} ${month} ${year}`
  if (!time) return dateStr
  return `${dateStr} pukul ${time}`
}

function safeFilenamePart(s: string) {
  return (s || 'laporan').replace(/[^a-zA-Z0-9-_]/g, '_')
}

async function svgToPngDataUrl(svgUrl: string): Promise<string> {
  const url = svgUrl.startsWith('http://') || svgUrl.startsWith('https://') || svgUrl.startsWith('data:')
    ? svgUrl
    : new URL(svgUrl.startsWith('/') ? svgUrl : `/${svgUrl}`, `${window.location.origin}/`).href
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
    let logoDataUrl: string | null = null
    try {
      logoDataUrl = await svgToPngDataUrl('/logo-bmkg.svg')
    } catch {
      // ignore
    }

    const html2pdf = (await import('html2pdf.js')).default
    const origin = safeFilenamePart(routeInfo.value.portOrigin || 'asal')
    const dest = safeFilenamePart(routeInfo.value.portDestination || 'tujuan')

    const MAX_PDF_BYTES = 6 * 1024 * 1024
    const filename = `wisata-bahari-${origin}-${dest}.pdf`

    // Generate with decreasing resolution until the file is <= 6MB.
    const attempts: Array<{ scale: number; quality: number }> = [
      { scale: 2, quality: 0.65 },
      { scale: 1.5, quality: 0.55 },
      { scale: 1, quality: 0.45 },
      { scale: 0.85, quality: 0.35 },
      { scale: 0.7, quality: 0.28 },
    ]

    const baseOpt = {
      margin: 0,
      filename,
      html2canvas: {
        useCORS: true,
        onclone: (_clonedDoc: Document, clonedEl: HTMLElement) => {
          if (logoDataUrl) {
            clonedEl.querySelectorAll<HTMLImageElement>('.bmkg-logo').forEach(img => {
              img.src = logoDataUrl!
            })
          }
          clonedEl.querySelectorAll<HTMLElement>('.pdf-page').forEach(page => {
            page.style.marginTop = '0'
            page.style.borderTop = 'none'
            page.style.boxShadow = 'none'
          })
        },
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const, compress: true },
      pagebreak: {
        mode: ['avoid-all', 'css', 'legacy'],
        before: '.pdf-page-start',
        avoid: '.pdf-avoid-split',
      },
    }

    let blob: Blob | null = null
    for (const attempt of attempts) {
      const opt = {
        ...baseOpt,
        image: { type: 'jpeg' as const, quality: attempt.quality },
        html2canvas: { ...baseOpt.html2canvas, scale: attempt.scale },
      }

      const worker = html2pdf().set(opt).from(el)
      const nextBlob = await worker.outputPdf('blob')
      blob = nextBlob
      if (nextBlob.size <= MAX_PDF_BYTES) break
    }

    if (!blob) throw new Error('Failed to generate PDF blob')
    if (blob.size > MAX_PDF_BYTES) {
      console.warn(`PDF still larger than 6MB: ${(blob.size / 1024 / 1024).toFixed(2)}MB`)
    }
    const url = URL.createObjectURL(blob!)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  } catch (err) {
    console.error('PDF generation failed:', err)
  } finally {
    isDownloading.value = false
  }
}

defineExpose({ downloadPdf })
</script>

<style scoped>
.pdf-page {
  width: 210mm;
  height: 297mm;
  overflow: hidden;
  box-sizing: border-box;
  background: white;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.pdf-page + .pdf-page {
  margin-top: 24px;
}

.pdf-page-start {
  break-before: page;
  page-break-before: always;
}

.pdf-avoid-split {
  break-inside: avoid;
  page-break-inside: avoid;
}
</style>
