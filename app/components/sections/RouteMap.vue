<template>
  <div
    ref="mapEl"
    class="w-full h-[300px] min-h-[300px] rounded-xl overflow-hidden relative bg-[var(--input-bg)] border border-[var(--border)] shadow-[var(--shadow-md)]"
  />
</template>

<script setup lang="ts">
import type L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const props = defineProps<{
  routeCoordinates?: [number, number][]
  splitMarkers?: [number, number][]
}>()

const mapEl = ref<HTMLElement | null>(null)
let map: L.Map | null = null
let geoJsonLayer: L.GeoJSON | null = null
let markerLayerGroup: L.LayerGroup | null = null
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

function bearingDeg(from: [number, number], to: [number, number]): number {
  const [lng1, lat1] = from
  const [lng2, lat2] = to
  const toRad = (d: number) => d * Math.PI / 180
  const dLng = toRad(lng2 - lng1)
  const phi1 = toRad(lat1)
  const phi2 = toRad(lat2)
  const y = Math.sin(dLng) * Math.cos(phi2)
  const x = Math.cos(phi1) * Math.sin(phi2) - Math.sin(phi1) * Math.cos(phi2) * Math.cos(dLng)
  return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360
}

function createArrowIcon(L: typeof import('leaflet').default, rotation: number) {
  const cssRotation = rotation - 90
  return L.divIcon({
    className: '',
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    html: `<div style="width:22px;height:22px;border-radius:50%;background:#fff;box-shadow:0 1px 4px rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center;transform:rotate(${cssRotation}deg)"><svg width="11" height="11" viewBox="0 0 12 12"><path d="M2 1l8 5-8 5V1z" fill="#2563eb"/></svg></div>`
  })
}

function renderSplitMarkers() {
  if (!map || !Leaflet) return
  if (!markerLayerGroup) {
    markerLayerGroup = Leaflet.layerGroup().addTo(map)
  }
  markerLayerGroup.clearLayers()

  const pts = props.splitMarkers
  if (!pts || pts.length < 2) return

  for (let i = 0; i < pts.length; i++) {
    const [lng, lat] = pts[i]!
    let bearing = 0
    if (i < pts.length - 1) {
      bearing = bearingDeg(pts[i]!, pts[i + 1]!)
    } else if (i > 0) {
      bearing = bearingDeg(pts[i - 1]!, pts[i]!)
    }
    const icon = createArrowIcon(Leaflet, bearing)
    Leaflet.marker([lat, lng], { icon }).addTo(markerLayerGroup!)
  }
}

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
    const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#01a73e'
    geoJsonLayer = L.geoJSON(getRouteData() as never, {
      style: {
        color: primaryColor,
        weight: 4,
        opacity: 0.9
      }
    }).addTo(map)
    if (geoJsonLayer.getBounds().isValid()) {
      map.fitBounds(geoJsonLayer.getBounds(), { padding: [20, 20] })
    }
    renderSplitMarkers()
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

watch(
  () => props.splitMarkers,
  () => renderSplitMarkers(),
  { deep: true }
)

onBeforeUnmount(() => {
  map?.remove()
  map = null
  geoJsonLayer = null
  markerLayerGroup = null
})
</script>
