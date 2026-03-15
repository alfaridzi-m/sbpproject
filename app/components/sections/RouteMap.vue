<template>
  <div
    ref="mapEl"
    class="w-full h-[300px] min-h-[300px] rounded-lg overflow-hidden relative bg-[var(--surface-hover)]"
  />
</template>

<script setup lang="ts">
import type L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const props = defineProps<{
  routeCoordinates?: [number, number][]
}>()

const mapEl = ref<HTMLElement | null>(null)
let map: L.Map | null = null
let geoJsonLayer: L.GeoJSON | null = null
let Leaflet: typeof L | null = null

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

function getRouteData(): GeoJSON.FeatureCollection {
  const coords = props.routeCoordinates && props.routeCoordinates.length >= 2
    ? props.routeCoordinates
    : DEFAULT_COORDINATES
  return {
    type: 'FeatureCollection',
    features: [{
      type: 'Feature',
      properties: { a: 'Origin', b: 'Destination', location: 'route' },
      geometry: {
        type: 'LineString',
        coordinates: coords
      }
    }]
  }
}

onMounted(async () => {
  const el = mapEl.value
  if (!el) return
  const L = (await import('leaflet')).default
  Leaflet = L

  try {
    map = L.map(el, { preferCanvas: true }).setView([2.3, 125], 6)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map)
    geoJsonLayer = L.geoJSON(getRouteData() as never, {
      style: {
        color: '#0f766e',
        weight: 4,
        opacity: 0.9
      }
    }).addTo(map)
    if (geoJsonLayer.getBounds().isValid()) {
      map.fitBounds(geoJsonLayer.getBounds(), { padding: [20, 20] })
    }
    await nextTick()
    requestAnimationFrame(() => {
      requestAnimationFrame(() => map?.invalidateSize())
    })
  } catch (err) {
    console.error('Map init error:', err)
  }
})

watch(
  () => props.routeCoordinates,
  (coords) => {
    if (!map || !geoJsonLayer || !Leaflet) return
    geoJsonLayer.clearLayers()
    if (!coords || coords.length < 2) {
      geoJsonLayer.addData(getRouteData() as never)
    } else {
      const feature = {
        type: 'Feature' as const,
        properties: {},
        geometry: {
          type: 'LineString' as const,
          coordinates: coords
        }
      }
      geoJsonLayer.addData(feature as never)
    }
    if (geoJsonLayer.getBounds().isValid()) {
      map.fitBounds(geoJsonLayer.getBounds(), { padding: [20, 20] })
    }
    nextTick(() => map?.invalidateSize())
  },
  { deep: true }
)

onBeforeUnmount(() => {
  map?.remove()
  map = null
  geoJsonLayer = null
})
</script>
