<template>
  <div>
    <div class="text-sm leading-normal text-slate-800 w-[210mm] mx-auto">
      <div class="pdf-page px-8 pb-8 pt-0 flex flex-col">
        <!-- Header: same layout as Wisata Bahari / BMKG rutin (logo + centered block) -->
        <header class="flex items-center gap-4 -mx-8 px-8 py-3 mb-4 border-b border-slate-300 bg-slate-100">
          <img
            :src="bmkgLogoUrl"
            alt="BMKG Logo"
            class="bmkg-logo shrink-0 object-contain"
            width="56"
            height="70"
          />
          <div class="flex-1 text-center">
            <p class="text-[0.875rem] font-bold m-0 mb-0.5 text-slate-900 tracking-wide">
              BADAN METEOROLOGI, KLIMATOLOGI, DAN GEOFISIKA
            </p>
            <p class="text-[0.75rem] font-semibold m-0 mb-0.5 text-slate-800">
              {{ routeInfo.namaUpt || 'Stasiun Meteorologi Kelas II Maritim Kendari' }}
            </p>
            <p class="text-[0.6875rem] m-0 mb-0.5 text-slate-600">
              {{ routeInfo.alamat || 'Jl. Jendral Sudirman No 158, Kelurahan Kampung Salo, Kendari' }}
            </p>
            <p class="text-[0.6875rem] m-0 text-slate-600">
              Telp: {{ routeInfo.telp || '08114005929' }} | Email: {{ routeInfo.email || 'stamar.kendari@bmkg.go.id' }}
            </p>
          </div>
        </header>

        <div class="text-center mb-4">
          <h1 class="text-[0.9375rem] font-bold m-0 text-slate-900">
            PRAKIRAAN CUACA RUTE PELAYARAN
          </h1>
          <p class="text-[0.8125rem] font-bold m-0 mt-1 text-slate-900">
            Rute {{ routeInfo.portOrigin || 'Kendari' }} - {{ routeInfo.portDestination || 'Morowali' }}
          </p>
          <p class="text-[0.75rem] m-0 mt-1 text-slate-800">
            Nomor : {{ nomorSurat }}
          </p>
        </div>

        <!-- Panduan tinggi gelombang -->
        <div class="mb-4 pdf-avoid-split">
          <table class="rutin-table w-full border-collapse text-[0.5625rem]">
            <thead>
              <tr>
                <th class="rutin-th bg-white text-slate-900 font-bold border border-slate-400 px-1 py-1 text-center">
                  Panduan Tinggi Gelombang
                </th>
                <th class="rutin-th text-white font-bold border border-slate-400 px-1 py-1 text-center bg-[#3b82f6]">
                  Tenang
                </th>
                <th class="rutin-th text-white font-bold border border-slate-400 px-1 py-1 text-center bg-[#16a34a]">
                  Rendah
                </th>
                <th class="rutin-th text-slate-900 font-bold border border-slate-400 px-1 py-1 text-center bg-[#facc15]">
                  Sedang
                </th>
                <th class="rutin-th text-white font-bold border border-slate-400 px-1 py-1 text-center bg-[#f97316]">
                  Tinggi
                </th>
                <th class="rutin-th text-white font-bold border border-slate-400 px-1 py-1 text-center bg-[#ef4444]">
                  Sangat Tinggi
                </th>
                <th class="rutin-th text-white font-bold border border-slate-400 px-1 py-1 text-center bg-[#7c3aed]">
                  Ekstrem
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="rutin-td border border-slate-400 px-1 py-1 text-center font-semibold text-slate-800">
                  Gelombang
                </td>
                <td class="rutin-td border border-slate-400 px-1 py-1 text-center">0–0,5 m</td>
                <td class="rutin-td border border-slate-400 px-1 py-1 text-center">0,5 – 1,25 m</td>
                <td class="rutin-td border border-slate-400 px-1 py-1 text-center">1,25 – 2,5 m</td>
                <td class="rutin-td border border-slate-400 px-1 py-1 text-center">2,5 – 4 m</td>
                <td class="rutin-td border border-slate-400 px-1 py-1 text-center">4 – 6 m</td>
                <td class="rutin-td border border-slate-400 px-1 py-1 text-center">6 – 9 m</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Tabel prakiraan -->
        <div class="mb-5 pdf-avoid-split">
          <table class="rutin-table w-full border-collapse text-[0.625rem]">
            <thead>
              <tr>
                <th class="rutin-th border border-slate-400 px-1 py-1 text-center font-bold bg-slate-100" rowspan="2">
                  Tanggal
                </th>
                <th class="rutin-th border border-slate-400 px-1 py-1 text-center font-bold bg-slate-100" rowspan="2">
                  Cuaca
                </th>
                <th class="rutin-th border border-slate-400 px-1 py-1 text-center font-bold bg-slate-100" rowspan="2">
                  Tinggi Gelombang<br>Signifikan (m)
                </th>
                <th class="rutin-th border border-slate-400 px-1 py-1 text-center font-bold bg-slate-100" colspan="2">
                  Angin
                </th>
                <th class="rutin-th border border-slate-400 px-1 py-1 text-center font-bold bg-slate-100" colspan="2">
                  Arus
                </th>
              </tr>
              <tr>
                <th class="rutin-th border border-slate-400 px-1 py-0.5 text-center font-bold bg-slate-50">
                  Arah
                </th>
                <th class="rutin-th border border-slate-400 px-1 py-0.5 text-center font-bold bg-slate-50">
                  Kec.(knot)
                </th>
                <th class="rutin-th border border-slate-400 px-1 py-0.5 text-center font-bold bg-slate-50">
                  Arah
                </th>
                <th class="rutin-th border border-slate-400 px-1 py-0.5 text-center font-bold bg-slate-50">
                  Kec.(knot)
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(row, idx) in rutinTableRows"
                :key="'r' + idx"
                :class="idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'"
              >
                <td class="rutin-td border border-slate-400 px-1 py-1 text-center">{{ row.tanggal }}</td>
                <td class="rutin-td border border-slate-400 px-1 py-1 text-center">{{ row.cuaca }}</td>
                <td class="rutin-td border border-slate-400 px-1 py-1 text-center">{{ row.gelombang }}</td>
                <td class="rutin-td border border-slate-400 px-1 py-1 text-center">{{ row.anginArah }}</td>
                <td class="rutin-td border border-slate-400 px-1 py-1 text-center">{{ row.anginKnot }}</td>
                <td class="rutin-td border border-slate-400 px-1 py-1 text-center">{{ row.arusArah }}</td>
                <td class="rutin-td border border-slate-400 px-1 py-1 text-center">{{ row.arusKnot }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="mb-4 pdf-avoid-split">
          <h3 class="text-[0.8125rem] font-bold m-0 mb-1 text-slate-900">
            Saran Keselamatan
          </h3>
          <p class="m-0 text-[0.75rem] font-semibold text-slate-800 mb-1">
            Berisiko terhadap keselamatan pelayaran :
          </p>
          <ul class="m-0 pl-5 text-[0.75rem] leading-relaxed text-slate-800 list-disc space-y-0.5">
            <li>
              Perahu Nelayan apabila kecepatan angin mencapai 15 knot dan tinggi gelombang mencapai 1,25 m
            </li>
            <li>
              Kapal Tongkang apabila kecepatan angin mencapai 16 knot dan tinggi gelombang mencapai 1,5 m
            </li>
            <li>
              Kapal Ferry apabila kecepatan angin mencapai 21 knot dan tinggi gelombang mencapai 2,5 m
            </li>
            <li>
              Kapal Besar (Kargo/Pesiar) apabila kecepatan angin mencapai 27 knot dan tinggi gelombang mencapai 4,0 m
            </li>
          </ul>
        </div>

        <div class="mt-auto pt-3 border-t border-slate-200 pdf-avoid-split">
          <p class="m-0 text-[0.6875rem] italic text-slate-500">
            Disclaimer : {{ disclaimer }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ForecastRow } from '~/composables/useMaritimeData'

const { routeInfo, forecastData, disclaimer } = useMaritimeData()
const bmkgLogoUrl = useBmkgLogoUrl()

const isDownloading = ref(false)

const ROMAN_MONTH = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'] as const
const DIR_SHORT = ['U', 'TL', 'T', 'TG', 'S', 'BD', 'B', 'BL'] as const

const nomorSurat = computed(() => {
  const raw = routeInfo.value.issuedDate
  if (!raw) return 'ME.01.02/KDI/021/III/2026'
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw)
  if (!m) return 'ME.01.02/KDI/021/III/2026'
  const y = Number(m[1])
  const mo = Number(m[2])
  const d = Number(m[3])
  const roman = ROMAN_MONTH[mo - 1] ?? 'I'
  const seq = String(d).padStart(3, '0')
  return `ME.01.02/KDI/${seq}/${roman}/${y}`
})

function expandDdMmYy(ddmmyy: string): string {
  const parts = ddmmyy.split('/').map(p => p.trim())
  if (parts.length !== 3) return ddmmyy
  const day = Number(parts[0])
  const month = Number(parts[1])
  let year = Number(parts[2])
  if (!Number.isFinite(day) || !Number.isFinite(month)) return ddmmyy
  if (year < 100 && Number.isFinite(year)) year += 2000
  return `${day}/${month}/${year}`
}

function parseNum(s: string): number {
  const x = parseFloat(String(s).replace(',', '.'))
  return Number.isFinite(x) ? x : NaN
}

function windDeg(r: ForecastRow): number | null {
  const w = String(r.wd ?? '').trim()
  if (!w) return null
  const n = parseFloat(w)
  return Number.isFinite(n) ? n : null
}

function currentDeg(r: ForecastRow): number | null {
  const w = String(r.arusd ?? '').trim()
  if (!w) return null
  const n = parseFloat(w)
  return Number.isFinite(n) ? n : null
}

function degToShort(deg: number): string {
  const norm = ((deg % 360) + 360) % 360
  const i = Math.round(norm / 45) % 8
  return DIR_SHORT[i]!
}

function fmtDirRange(degs: number[]): string {
  const ok = degs.filter(Number.isFinite)
  if (!ok.length) return '—'
  const lo = Math.min(...ok)
  const hi = Math.max(...ok)
  if (lo === hi) return degToShort(lo)
  return `${degToShort(lo)} - ${degToShort(hi)}`
}

function fmtRange(lo: number, hi: number, decimals: number): string {
  if (!Number.isFinite(lo) && !Number.isFinite(hi)) return '—'
  if (!Number.isFinite(lo)) return Number(hi).toFixed(decimals).replace('.', ',')
  if (!Number.isFinite(hi)) return Number(lo).toFixed(decimals).replace('.', ',')
  const a = Math.min(lo, hi)
  const b = Math.max(lo, hi)
  const fa = Number(a.toFixed(decimals))
  const fb = Number(b.toFixed(decimals))
  if (fa === fb) return String(fa).replace('.', ',')
  return `${String(fa).replace('.', ',')} - ${String(fb).replace('.', ',')}`
}

function cmS_toKnot(cms: number): number {
  return cms / 51.444
}

interface RutinDayRow {
  tanggal: string
  cuaca: string
  gelombang: string
  anginArah: string
  anginKnot: string
  arusArah: string
  arusKnot: string
}

const PLACEHOLDER_ROWS: RutinDayRow[] = [
  { tanggal: '11/3/2026', cuaca: 'Cerah Berawan', gelombang: '0,2 - 0,5', anginArah: 'B - U', anginKnot: '3 - 12', arusArah: 'TG - BD', arusKnot: '0,4 - 0,6' },
  { tanggal: '12/3/2026', cuaca: 'Hujan Ringan', gelombang: '0,4 - 0,6', anginArah: 'BD - BL', anginKnot: '5 - 15', arusArah: 'S - B', arusKnot: '0,4 - 0,6' },
  { tanggal: '13/3/2026', cuaca: 'Hujan Ringan', gelombang: '0,5 - 0,7', anginArah: 'BD - BL', anginKnot: '5 - 15', arusArah: 'S - B', arusKnot: '0,4 - 0,6' },
]

const rutinTableRows = computed<RutinDayRow[]>(() => {
  const rows = forecastData.value
  if (!rows.length) return PLACEHOLDER_ROWS

  const byDate = new Map<string, ForecastRow[]>()
  for (const r of rows) {
    const k = r.date || '—'
    if (!byDate.has(k)) byDate.set(k, [])
    byDate.get(k)!.push(r)
  }

  const out: RutinDayRow[] = []

  for (const [, dayRows] of byDate) {
    const first = dayRows[0]!
    const waves = dayRows.map(r => parseNum(r.wave)).filter(Number.isFinite)
    const wss = dayRows.map(r => parseNum(r.ws)).filter(Number.isFinite)
    const windDirs = dayRows.map(windDeg).filter((x): x is number => x != null)
    const curs = dayRows.map(r => parseNum(r.aruss)).filter(Number.isFinite).map(cmS_toKnot)
    const curDirs = dayRows.map(currentDeg).filter((x): x is number => x != null)

    const weather = dayRows.map(r => r.weather).find(Boolean) || '—'

    let anginArah = '—'
    if (windDirs.length) anginArah = fmtDirRange(windDirs)
    else {
      const textual = dayRows.map(r => String(r.wd || '').trim()).find(w => w && Number.isNaN(parseFloat(w)))
      if (textual) anginArah = textual
    }

    let arusArah = '—'
    if (curDirs.length) arusArah = fmtDirRange(curDirs)
    else {
      const textual = dayRows.map(r => String(r.arusd || '').trim()).find(w => w && Number.isNaN(parseFloat(w)))
      if (textual) arusArah = textual
    }

    out.push({
      tanggal: expandDdMmYy(first.date),
      cuaca: weather,
      gelombang: waves.length ? fmtRange(Math.min(...waves), Math.max(...waves), 1) : '—',
      anginArah,
      anginKnot: wss.length ? fmtRange(Math.min(...wss), Math.max(...wss), 0) : '—',
      arusArah,
      arusKnot: curs.length ? fmtRange(Math.min(...curs), Math.max(...curs), 1) : '—',
    })
  }

  out.sort((a, b) => {
    const pa = a.tanggal.split('/').map(Number)
    const pb = b.tanggal.split('/').map(Number)
    const ya = pa[2] ?? 0
    const yb = pb[2] ?? 0
    if (ya !== yb) return ya - yb
    const ma = pa[1] ?? 0
    const mb = pb[1] ?? 0
    if (ma !== mb) return ma - mb
    return (pa[0] ?? 0) - (pb[0] ?? 0)
  })

  return out
})

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

type RGB = [number, number, number]

function pdfLastAutoTableFinalY(doc: object): number {
  const y = (doc as { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY
  return y ?? 0
}

async function downloadPdf() {
  isDownloading.value = true
  try {
    const { jsPDF } = await import('jspdf')
    const { default: autoTable } = await import('jspdf-autotable')

    const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait', compress: true })
    const PW = 210
    const PH = 297
    const M = 10
    const CW = PW - 2 * M

    const SL100: RGB = [241, 245, 249]
    const SL200: RGB = [226, 232, 240]
    const SL300: RGB = [203, 213, 225]
    const SL50: RGB = [248, 250, 252]
    const SL500: RGB = [100, 116, 139]
    const SL600: RGB = [71, 85, 105]
    const SL700: RGB = [51, 65, 85]
    const SL800: RGB = [30, 41, 59]
    const SL900: RGB = [15, 23, 42]
    const WHITE: RGB = [255, 255, 255]
    const BLACK: RGB = [0, 0, 0]

    const BLUE: RGB = [59, 130, 246]
    const GREEN: RGB = [22, 163, 74]
    const YELLOW: RGB = [250, 204, 21]
    const ORANGE: RGB = [249, 115, 22]
    const RED: RGB = [239, 68, 68]
    const PURPLE: RGB = [124, 58, 237]

    let logoImg: string | null = null
    try {
      logoImg = await svgToPngDataUrl('/logo-bmkg.svg')
    } catch {
      // ignore
    }

    const ri = routeInfo.value
    const headerH = 28
    pdf.setFillColor(...SL100)
    pdf.rect(0, 0, PW, headerH, 'F')
    pdf.setDrawColor(...SL300)
    pdf.setLineWidth(0.3)
    pdf.line(0, headerH, PW, headerH)

    if (logoImg) {
      try {
        pdf.addImage(logoImg, 'PNG', M, 4, 14, 17.5)
      } catch {
        // ignore
      }
    }

    const cx = PW / 2
    let ty = 7.5
    pdf.setFont('helvetica', 'bold').setFontSize(8.5).setTextColor(...SL900)
    pdf.text('BADAN METEOROLOGI, KLIMATOLOGI, DAN GEOFISIKA', cx, ty, { align: 'center', maxWidth: CW - 22 })
    ty += 4.2
    pdf.setFontSize(7.5).setTextColor(...SL800)
    pdf.text(
      ri.namaUpt || 'Stasiun Meteorologi Kelas II Maritim Kendari',
      cx,
      ty,
      { align: 'center', maxWidth: CW - 22 },
    )
    ty += 3.8
    pdf.setFont('helvetica', 'normal').setFontSize(6.5).setTextColor(...SL600)
    const addr = ri.alamat || 'Jl. Jendral Sudirman No 158, Kelurahan Kampung Salo, Kendari'
    for (const line of pdf.splitTextToSize(addr, CW - 24)) {
      pdf.text(line, cx, ty, { align: 'center' })
      ty += 3
    }
    pdf.text(
      `Telp: ${ri.telp || '08114005929'} | Email: ${ri.email || 'stamar.kendari@bmkg.go.id'}`,
      cx,
      ty,
      { align: 'center', maxWidth: CW - 22 },
    )

    let y = headerH + 7
    pdf.setFont('helvetica', 'bold').setFontSize(10.5).setTextColor(...SL900)
    pdf.text('PRAKIRAAN CUACA RUTE PELAYARAN', PW / 2, y, { align: 'center' })
    y += 5.5
    pdf.setFontSize(9)
    pdf.text(
      `Rute ${ri.portOrigin || 'Kendari'} - ${ri.portDestination || 'Morowali'}`,
      PW / 2,
      y,
      { align: 'center' },
    )
    y += 5
    pdf.setFont('helvetica', 'normal').setFontSize(8.5).setTextColor(...SL800)
    pdf.text(`Nomor : ${nomorSurat.value}`, PW / 2, y, { align: 'center' })
    y += 9

    autoTable(pdf, {
      startY: y,
      margin: { left: M, right: M },
      tableWidth: CW,
      theme: 'grid',
      styles: {
        fontSize: 6.2,
        cellPadding: 1.4,
        lineColor: BLACK,
        lineWidth: 0.12,
        halign: 'center',
        valign: 'middle',
        font: 'helvetica',
      },
      head: [
        [
          { content: 'Panduan Tinggi Gelombang', styles: { fillColor: WHITE, textColor: SL900, fontStyle: 'bold' } },
          { content: 'Tenang', styles: { fillColor: BLUE, textColor: WHITE, fontStyle: 'bold' } },
          { content: 'Rendah', styles: { fillColor: GREEN, textColor: WHITE, fontStyle: 'bold' } },
          { content: 'Sedang', styles: { fillColor: YELLOW, textColor: SL900, fontStyle: 'bold' } },
          { content: 'Tinggi', styles: { fillColor: ORANGE, textColor: WHITE, fontStyle: 'bold' } },
          { content: 'Sangat Tinggi', styles: { fillColor: RED, textColor: WHITE, fontStyle: 'bold' } },
          { content: 'Ekstrem', styles: { fillColor: PURPLE, textColor: WHITE, fontStyle: 'bold' } },
        ],
      ],
      body: [
        [
          { content: 'Gelombang', styles: { fontStyle: 'bold', textColor: SL800 } },
          '0–0,5 m',
          '0,5 – 1,25 m',
          '1,25 – 2,5 m',
          '2,5 – 4 m',
          '4 – 6 m',
          '6 – 9 m',
        ],
      ],
    })
    y = pdfLastAutoTableFinalY(pdf) + 7

    const bodyRows = rutinTableRows.value.map((r) => [
      r.tanggal,
      r.cuaca,
      r.gelombang,
      r.anginArah,
      r.anginKnot,
      r.arusArah,
      r.arusKnot,
    ])

    autoTable(pdf, {
      startY: y,
      margin: { left: M, right: M },
      tableWidth: CW,
      theme: 'grid',
      styles: {
        fontSize: 7,
        cellPadding: 1.1,
        lineColor: BLACK,
        lineWidth: 0.12,
        halign: 'center',
        valign: 'middle',
        font: 'helvetica',
      },
      head: [
        [
          { content: 'Tanggal', rowSpan: 2, styles: { fillColor: SL200, textColor: SL900, fontStyle: 'bold' } },
          { content: 'Cuaca', rowSpan: 2, styles: { fillColor: SL200, textColor: SL900, fontStyle: 'bold' } },
          {
            content: 'Tinggi Gelombang\nSignifikan (m)',
            rowSpan: 2,
            styles: { fillColor: SL200, textColor: SL900, fontStyle: 'bold' },
          },
          { content: 'Angin', colSpan: 2, styles: { fillColor: SL200, textColor: SL900, fontStyle: 'bold' } },
          { content: 'Arus', colSpan: 2, styles: { fillColor: SL200, textColor: SL900, fontStyle: 'bold' } },
        ],
        [
          { content: 'Arah', styles: { fillColor: SL50, textColor: SL900, fontStyle: 'bold' } },
          { content: 'Kec.(knot)', styles: { fillColor: SL50, textColor: SL900, fontStyle: 'bold' } },
          { content: 'Arah', styles: { fillColor: SL50, textColor: SL900, fontStyle: 'bold' } },
          { content: 'Kec.(knot)', styles: { fillColor: SL50, textColor: SL900, fontStyle: 'bold' } },
        ],
      ],
      body: bodyRows,
      didParseCell: (data) => {
        if (data.section === 'body' && data.row.index % 2 === 1) {
          data.cell.styles.fillColor = SL50
        }
      },
    })
    y = pdfLastAutoTableFinalY(pdf) + 6

    const safetyReserve = 42
    if (y > PH - safetyReserve) {
      pdf.addPage()
      y = M + 4
    }

    pdf.setFont('helvetica', 'bold').setFontSize(9).setTextColor(...SL900)
    pdf.text('Saran Keselamatan', M, y)
    y += 4.5
    pdf.setFont('helvetica', 'bold').setFontSize(7.5).setTextColor(...SL800)
    pdf.text('Berisiko terhadap keselamatan pelayaran :', M, y)
    y += 4.5
    pdf.setFont('helvetica', 'normal').setFontSize(7).setTextColor(...SL700)
    const bullets = [
      'Perahu Nelayan apabila kecepatan angin mencapai 15 knot dan tinggi gelombang mencapai 1,25 m',
      'Kapal Tongkang apabila kecepatan angin mencapai 16 knot dan tinggi gelombang mencapai 1,5 m',
      'Kapal Ferry apabila kecepatan angin mencapai 21 knot dan tinggi gelombang mencapai 2,5 m',
      'Kapal Besar (Kargo/Pesiar) apabila kecepatan angin mencapai 27 knot dan tinggi gelombang mencapai 4,0 m',
    ]
    for (const line of bullets) {
      const wrapped = pdf.splitTextToSize(`• ${line}`, CW - 4)
      for (const w of wrapped) {
        if (y > PH - 28) {
          pdf.addPage()
          y = M + 4
        }
        pdf.text(w, M + 2, y)
        y += 3.6
      }
      y += 0.5
    }

    y += 2
    pdf.setDrawColor(...SL300).setLineWidth(0.2)
    pdf.line(M, y, M + CW, y)
    y += 5
    pdf.setFont('helvetica', 'italic').setFontSize(6.8).setTextColor(...SL500)
    for (const line of pdf.splitTextToSize(`Disclaimer : ${disclaimer.value}`, CW)) {
      if (y > PH - 12) {
        pdf.addPage()
        y = M + 4
      }
      pdf.text(line, M, y)
      y += 3.5
    }

    const origin = safeFilenamePart(ri.portOrigin || 'asal')
    const dest = safeFilenamePart(ri.portDestination || 'tujuan')
    pdf.save(`rutin-${origin}-${dest}.pdf`)
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
  min-height: 297mm;
  overflow: hidden;
  box-sizing: border-box;
  background: white;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.pdf-page-start {
  break-before: page;
  page-break-before: always;
}

.pdf-avoid-split {
  break-inside: avoid;
  page-break-inside: avoid;
}

.rutin-table {
  table-layout: fixed;
}

.rutin-th,
.rutin-td {
  vertical-align: middle;
}
</style>
