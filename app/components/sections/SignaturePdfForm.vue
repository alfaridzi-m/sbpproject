<template>
  <div>
    <h3 class="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)] m-0 mb-2">
      Tanda tangan PDF
    </h3>
    <p class="text-xs text-[var(--text-muted)] m-0 mb-3">
      Ditampilkan di area “Forecaster on Duty” pada pratinjau dan unduhan PDF.
    </p>

    <div class="flex flex-wrap gap-2 mb-3">
      <button
        type="button"
        class="px-3 py-1.5 rounded-lg text-sm font-medium border shadow-[var(--shadow-sm)] transition-colors duration-200"
        :class="mode === 'upload'
          ? 'border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_12%,var(--surface)_88%)] text-[var(--text)]'
          : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text)] hover:border-[var(--accent)]'"
        @click="mode = 'upload'"
      >
        Unggah PNG
      </button>
      <button
        type="button"
        class="px-3 py-1.5 rounded-lg text-sm font-medium border shadow-[var(--shadow-sm)] transition-colors duration-200"
        :class="mode === 'draw'
          ? 'border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_12%,var(--surface)_88%)] text-[var(--text)]'
          : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text)] hover:border-[var(--accent)]'"
        @click="mode = 'draw'"
      >
        Gambar
      </button>
    </div>

    <div v-if="mode === 'upload'" class="flex flex-col gap-2">
      <label
        class="inline-flex w-fit items-center gap-2 px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)] cursor-pointer text-sm font-medium text-[var(--text)] hover:border-[var(--accent)]"
      >
        <input
          type="file"
          accept="image/png"
          class="sr-only"
          @change="onPngSelected"
        >
        Pilih file PNG
      </label>
      <p class="text-[0.6875rem] text-[var(--text-muted)] m-0">Hanya format PNG.</p>
    </div>

    <div v-else class="flex flex-col gap-2">
      <div
        class="w-full max-w-[300px] rounded-lg border border-[var(--border)] bg-white overflow-hidden h-52 relative z-0"
      >
        <canvas
          ref="canvasRef"
          class="block w-full h-full touch-none cursor-crosshair"
        />
      </div>
      <p class="text-[0.6875rem] text-[var(--text-muted)] m-0">
        Klik kiri mouse, tahan, dan seret untuk menggambar (atau gunakan jari di layar sentuh).
      </p>
      <div class="flex flex-wrap gap-2">
        <button
          type="button"
          class="px-3 py-2 rounded-lg text-sm font-medium cursor-pointer bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] shadow-[var(--shadow-sm)] hover:border-[var(--accent)]"
          @click="clearPadOnly"
        >
          Kosongkan kanvas
        </button>
        <button
          type="button"
          class="px-3 py-2 rounded-lg text-sm font-medium cursor-pointer bg-[var(--primary)] text-[var(--color-white)] border-none shadow-[var(--shadow-sm)] hover:opacity-95"
          @click="applyDrawnSignature"
        >
          Terapkan ke PDF
        </button>
      </div>
    </div>

    <div v-if="routeInfo.signatureImageDataUrl" class="mt-4 flex flex-col gap-2">
      <span class="text-xs font-medium text-[var(--text)]">Pratinjau tersimpan</span>
      <div class="flex flex-wrap items-center gap-3">
        <img
          :src="routeInfo.signatureImageDataUrl"
          alt="Tanda tangan"
          class="max-h-16 max-w-[220px] object-contain border border-[var(--border)] rounded-lg bg-white p-1"
        >
        <button
          type="button"
          class="px-3 py-2 rounded-lg text-sm font-medium cursor-pointer bg-[var(--surface)] text-[var(--primary)] border border-[var(--primary)] shadow-[var(--shadow-sm)] hover:bg-[var(--primary-hover)]"
          @click="removeSignature"
        >
          Hapus tanda tangan
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { routeInfo } = useMaritimeData()

const mode = ref<'upload' | 'draw'>('upload')
const canvasRef = ref<HTMLCanvasElement | null>(null)
type SignaturePadInstance = InstanceType<(typeof import('signature_pad'))['default']>
let pad: SignaturePadInstance | null = null

/** Match signature_pad README: create pad first, then set bitmap size + transform, then clear(). */
function resizePadCanvas() {
  if (!pad || !canvasRef.value) return
  const el = canvasRef.value
  const ratio = Math.max(window.devicePixelRatio || 1, 1)
  const w = el.offsetWidth
  const h = el.offsetHeight
  if (w < 4 || h < 4) return

  el.width = Math.floor(w * ratio)
  el.height = Math.floor(h * ratio)
  const ctx = el.getContext('2d')
  if (ctx) ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
  pad.clear()
}

async function initPad() {
  if (!import.meta.client) return
  if (mode.value !== 'draw') return

  pad?.off()
  pad = null

  // Default watch flush is `pre`: runs before Vue paints `v-else` canvas, so ref was always null.
  await nextTick()
  await nextTick()

  const el = canvasRef.value
  if (!el || mode.value !== 'draw') return

  await new Promise<void>(r => requestAnimationFrame(() => r()))
  await new Promise<void>(r => requestAnimationFrame(() => r()))

  void (async () => {
    if (!canvasRef.value || canvasRef.value !== el || mode.value !== 'draw') return

    const { default: SignaturePad } = await import('signature_pad')
    if (mode.value !== 'draw' || canvasRef.value !== el) return

    pad = new SignaturePad(el, {
      backgroundColor: '#ffffff',
      penColor: '#0f172a',
      minWidth: 1,
      maxWidth: 4,
      minDistance: 2,
      throttle: 8,
    })

    resizePadCanvas()

    const existing = routeInfo.value.signatureImageDataUrl
    if (existing) {
      try {
        await pad.fromDataURL(existing, { ratio: window.devicePixelRatio || 1 })
      } catch {
        /* ignore */
      }
    }
  })()
}

watch(
  mode,
  (m) => {
    if (m === 'draw') void initPad()
    else {
      pad?.off()
      pad = null
    }
  },
  { flush: 'post' },
)

onMounted(() => {
  if (mode.value === 'draw') void initPad()
})

onBeforeUnmount(() => {
  pad?.off()
  pad = null
})

function onPngSelected(ev: Event) {
  const input = ev.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  if (file.type !== 'image/png') {
    input.value = ''
    return
  }
  const reader = new FileReader()
  reader.onload = () => {
    if (typeof reader.result === 'string') routeInfo.value.signatureImageDataUrl = reader.result
    input.value = ''
  }
  reader.readAsDataURL(file)
}

function clearPadOnly() {
  pad?.clear()
}

function applyDrawnSignature() {
  if (!pad || pad.isEmpty()) return
  routeInfo.value.signatureImageDataUrl = pad.toDataURL('image/png')
}

function removeSignature() {
  routeInfo.value.signatureImageDataUrl = ''
  pad?.clear()
}
</script>
