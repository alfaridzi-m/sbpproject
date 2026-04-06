<template>
  <div>
    <div
      ref="pdfDocumentRef"
      class="text-sm leading-normal text-slate-800 w-[210mm] mx-auto"
    >
      <!-- ========== PAGE 1 ========== -->
      <div class="pdf-page px-8 pb-8 pt-0 flex flex-col">
        <!-- 1. HEADER -->
        <header class="flex items-center gap-4 -mx-8 px-8 py-3 mb-4 border-b border-slate-300 bg-slate-100">
          <img
            :src="bmkgLogoUrl"
            alt="BMKG Logo"
            class="bmkg-logo shrink-0 object-contain"
            width="56"
            height="70"
          />
          <div class="flex-1 text-center">
            <p class="text-[0.875rem] font-bold m-0 mb-0.5 text-teal-700 tracking-wide">AGENCY FOR METEOROLOGY, CLIMATOLOGY, AND GEOPHYSICS</p>
            <p class="text-[0.75rem] font-semibold m-0 mb-0.5 text-slate-800">{{ routeInfo.namaUpt || 'Stasiun Meteorologi Klas II Maritim Paotere Makassar' }}</p>
            <p class="text-[0.6875rem] m-0 mb-0.5 text-slate-600">{{ routeInfo.alamat || 'Jl. Salodong, Kel. Untia, Kec. Biringkanaya, Kota Makassar, Sulawesi Selatan (90243)' }}</p>
            <p class="text-[0.6875rem] m-0 text-slate-600">Telp: {{ routeInfo.telp || '081242069700' }} | Email: {{ routeInfo.email || 'stamar.paotere@bmkg.go.id' }}</p>
          </div>
        </header>

        <!-- 2. DOCUMENT TITLE -->
        <div class="text-center mb-1">
          <h1 class="text-[0.9375rem] font-bold m-0 text-slate-900">
            En Route and Port Weather Forecast Information for {{ routeInfo.shipName || '[Nama Kapal]' }}
          </h1>
        </div>

        <!-- 3. ROUTE INFORMATION -->
        <div class="mb-5 pdf-avoid-split">
          <div class="pdf-rule-double-top mb-3" aria-hidden="true">
            <div class="pdf-rule-thick" />
            <div class="pdf-rule-gap" />
            <div class="pdf-rule-thin" />
          </div>
          <div class="grid grid-cols-2 gap-x-8 gap-y-0.5 px-1">
            <div>
              <p class="m-0 font-bold text-[0.75rem] text-slate-900 leading-tight">Port of Origin</p>
              <p class="m-0 text-[0.75rem] text-slate-700 leading-tight">{{ routeInfo.portOrigin || '—' }}</p>
            </div>
            <div>
              <p class="m-0 font-bold text-[0.75rem] text-slate-900 leading-tight">Port of Destination</p>
              <p class="m-0 text-[0.75rem] text-slate-700 leading-tight">{{ routeInfo.portDestination || '—' }}</p>
            </div>
            <div>
              <p class="m-0 font-bold text-[0.75rem] text-slate-900 leading-tight">Estimated Time of Departure</p>
              <p class="m-0 text-[0.75rem] text-slate-700 leading-tight">{{ formatDateTime(routeInfo.departureDate, routeInfo.departureTime) || '—' }} LT</p>
            </div>
            <div>
              <p class="m-0 font-bold text-[0.75rem] text-slate-900 leading-tight">Estimated Time of Arrival</p>
              <p class="m-0 text-[0.75rem] text-slate-700 leading-tight">{{ formatDateTime(routeInfo.arrivalDate, routeInfo.arrivalTime) || '—' }} LT</p>
            </div>
            <div>
              <p class="m-0 font-bold text-[0.75rem] text-slate-900 leading-tight">Issued</p>
              <p class="m-0 text-[0.75rem] text-slate-700 leading-tight">{{ formatDateTime(routeInfo.issuedDate, routeInfo.issuedTime) || '—' }} LT</p>
            </div>
          </div>
          <div class="pdf-rule-double-bottom mt-3" aria-hidden="true">
            <div class="pdf-rule-thin" />
            <div class="pdf-rule-gap" />
            <div class="pdf-rule-thick" />
          </div>
        </div>

        <!-- 4. METEOROLOGICAL SITUATION -->
        <div class="mb-1 pb-3 border-b border-slate-300 pdf-avoid-split">
          <h3 class="text-[0.8125rem] font-bold m-0 mb-1.5 text-slate-900 underline">Meteorological Situation</h3>
          <p class="m-0 text-[0.75rem] leading-relaxed text-slate-800">{{ synopticInfo || '—' }}</p>
        </div>

        <!-- 5. WARNINGS -->
        <div class="mb-1 pb-3 border-b border-slate-300 pdf-avoid-split">
          <h3 class="text-[0.8125rem] font-bold m-0 mb-1.5 text-slate-900">Warnings</h3>
          <p class="m-0 text-[0.75rem] leading-relaxed bg-yellow-200 px-1 py-0.5">{{ warnings || '—' }}</p>
          <p class="m-0 text-[0.75rem] leading-relaxed text-slate-800 mt-1.5">
            <span class="font-bold">Cyclone Warning</span> : {{ cycloneWarning || 'No Tropical Cyclone (TC) and Tropical Storms (TS).' }}
          </p>
        </div>

        <!-- 6. ROUTE MAP -->
        <div class="mb-4 pdf-avoid-split">
          <div class="border border-slate-300 rounded overflow-hidden bg-slate-50">
            <div ref="mapContainerRef" data-map-container class="w-full h-[220px]" />
          </div>
          <div class="flex items-center gap-2 mt-1.5 text-[0.5625rem] text-slate-600 flex-wrap">
            <span class="font-semibold">Tinggi Gelombang (m):</span>
            <span class="flex items-center gap-0.5"><span class="inline-block w-4 h-2.5 rounded-sm bg-green-600" /> ≤0.5</span>
            <span class="flex items-center gap-0.5"><span class="inline-block w-4 h-2.5 rounded-sm bg-blue-400" /> 0.5-1.25</span>
            <span class="flex items-center gap-0.5"><span class="inline-block w-4 h-2.5 rounded-sm bg-yellow-400" /> 1.25-2.5</span>
            <span class="flex items-center gap-0.5"><span class="inline-block w-4 h-2.5 rounded-sm bg-orange-500" /> 2.5-4.0</span>
            <span class="flex items-center gap-0.5"><span class="inline-block w-4 h-2.5 rounded-sm bg-red-500" /> 4.0-6.0</span>
            <span class="flex items-center gap-0.5"><span class="inline-block w-4 h-2.5 rounded-sm bg-purple-700" /> 6.0-9.0</span>
            <span class="flex items-center gap-0.5"><span class="inline-block w-4 h-2.5 rounded-sm bg-slate-800" /> &gt;9.0</span>
          </div>
        </div>

        <!-- 7. METEOGRAM -->
        <div class="mb-1 pb-1 border-b border-slate-300 pdf-avoid-split">
          <h3 class="text-[0.8125rem] font-bold m-0 mb-2 text-slate-900 underline">Meteogram</h3>
          <div data-meteogram class="border border-slate-300 rounded p-1 bg-white text-xs">
            <svg
              class="w-full h-auto block"
              :viewBox="`0 0 ${chartWidth} ${chartHeight}`"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <linearGradient id="visibilityGradRute" x1="0" x2="0" y1="1" y2="0">
                  <stop offset="0" stop-color="#fda4af" />
                  <stop offset="1" stop-color="#f43f5e" />
                </linearGradient>
              </defs>
              <!-- X-AXIS LABELS (top) -->
              <g class="meteogram-time-labels">
                <text v-for="(row, i) in meteogramRows" :key="'t' + row.id" :x="marginLeft + (i + 0.5) * (chartAreaW / meteogramRows.length)" y="10" text-anchor="middle" font-size="6" fill="#64748b">
                  <tspan :x="marginLeft + (i + 0.5) * (chartAreaW / meteogramRows.length)" dy="0">{{ formatMeteogramDate(row.date) }}</tspan>
                  <tspan :x="marginLeft + (i + 0.5) * (chartAreaW / meteogramRows.length)" dy="8">{{ row.time }}</tspan>
                </text>
              </g>
              <!-- WEATHER ICONS -->
              <g class="meteogram-weather-icons">
                <text v-for="(row, i) in meteogramRows" :key="'wi' + row.id" :x="marginLeft + (i + 0.5) * (chartAreaW / meteogramRows.length)" :y="weatherIconY" text-anchor="middle" font-size="10">{{ weatherIcon(row) }}</text>
              </g>
              <!-- GRID -->
              <g class="meteogram-grid">
                <line
                  v-for="i in 8" :key="'hy' + i"
                  :x1="marginLeft" :y1="marginTop + (i - 1) * chartAreaH / 7"
                  :x2="marginLeft + chartAreaW" :y2="marginTop + (i - 1) * chartAreaH / 7"
                  stroke="#e2e8f0" stroke-width="0.5"
                />
                <line
                  v-for="i in meteogramRows.length" :key="'vx' + i"
                  :x1="marginLeft + (i - 0.5) * (chartAreaW / meteogramRows.length)" :y1="marginTop"
                  :x2="marginLeft + (i - 0.5) * (chartAreaW / meteogramRows.length)" :y2="marginTop + chartAreaH"
                  stroke="#e2e8f0" stroke-width="0.5"
                />
              </g>
              <!-- DATA LINES -->
              <polyline v-if="visibilityPath" :points="visibilityPath" fill="none" stroke="url(#visibilityGradRute)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path v-if="windPath" :d="windPath" fill="none" stroke="#2779FD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <g v-for="(pt, i) in windPoints" :key="'pt' + i">
                <rect :x="pt.x - 2.5" :y="pt.y - 2.5" width="5" height="5" fill="#2779FD" />
              </g>
              <!-- Y-AXIS LEFT (Visibility) -->
              <text :x="marginLeft - 4" :y="marginTop + chartAreaH / 2" text-anchor="middle" font-size="6" fill="#64748b" :transform="`rotate(-90,${marginLeft - 4},${marginTop + chartAreaH / 2})`">Visibility (km)</text>
              <text v-for="(t, i) in visibilityTicks" :key="'vy' + i" :x="marginLeft - 6" :y="marginTop + i * chartAreaH / 7 + 2.5" text-anchor="end" font-size="6" fill="#64748b">{{ t }}</text>
              <!-- Y-AXIS RIGHT (Wind Speed) -->
              <text :x="marginLeft + chartAreaW + 22" :y="marginTop + chartAreaH / 2" text-anchor="middle" font-size="6" fill="#64748b" :transform="`rotate(90,${marginLeft + chartAreaW + 22},${marginTop + chartAreaH / 2})`">Wind Speed (kts)</text>
              <text v-for="(w, i) in windSpeedTicksKts" :key="'wy' + i" :x="marginLeft + chartAreaW + 8" :y="marginTop + i * chartAreaH / 7 + 2.5" text-anchor="start" font-size="6" fill="#64748b">{{ w }}</text>
              <!-- WIND DIRECTION ARROWS (at 0-axis) -->
              <g class="meteogram-wind-arrows">
                <g v-for="(row, i) in meteogramRows" :key="'wa' + row.id" :transform="`translate(${marginLeft + (i + 0.5) * (chartAreaW / meteogramRows.length)},${marginTop + chartAreaH + 9}) rotate(${windDirectionAngle(row.wd)})`">
                  <path d="M0,-5 L-2,4 L0,1.5 L2,4 Z" fill="#1e293b" stroke="#1e293b" stroke-width="0.5" />
                </g>
              </g>
            </svg>
            <div class="flex gap-6 pt-1 border-t border-slate-200 text-xs justify-center">
              <span class="flex items-center gap-2"><span class="inline-block w-6 h-0.5 rounded bg-gradient-to-r from-[#fda4af] to-[#f43f5e]" /> Visibility</span>
              <span class="flex items-center gap-2"><span class="inline-block w-6 h-0.5 rounded bg-[#2779FD]" /> Wind Speed</span>
            </div>
          </div>
        </div>

        <!-- DISCLAIMER (pinned bottom) -->
        <div class="mt-auto pt-3 border-t border-slate-200 pdf-avoid-split">
          <p class="m-0 text-[0.6875rem] italic text-slate-500">Disclaimer : {{ disclaimer }}</p>
        </div>
      </div>

      <!-- ========== PAGE 2 ========== -->
      <div class="pdf-page pdf-page-start px-8 pb-8 pt-0 flex flex-col">
        <!-- 1. HEADER (repeated) -->
        <header class="flex items-center gap-4 -mx-8 px-8 py-3 mb-4 border-b border-slate-300 bg-slate-100">
          <img :src="bmkgLogoUrl" alt="BMKG Logo" class="bmkg-logo shrink-0 object-contain" width="56" height="70" />
          <div class="flex-1 text-center">
            <p class="text-[0.875rem] font-bold m-0 mb-0.5 text-teal-700 tracking-wide">AGENCY FOR METEOROLOGY, CLIMATOLOGY, AND GEOPHYSICS</p>
            <p class="text-[0.75rem] font-semibold m-0 mb-0.5 text-slate-800">{{ routeInfo.namaUpt || 'Stasiun Meteorologi Klas II Maritim Paotere Makassar' }}</p>
            <p class="text-[0.6875rem] m-0 mb-0.5 text-slate-600">{{ routeInfo.alamat || 'Jl. Salodong, Kel. Untia, Kec. Biringkanaya, Kota Makassar, Sulawesi Selatan (90243)' }}</p>
            <p class="text-[0.6875rem] m-0 text-slate-600">Telp: {{ routeInfo.telp || '081242069700' }} | Email: {{ routeInfo.email || 'stamar.paotere@bmkg.go.id' }}</p>
          </div>
        </header>

        <!-- 2. DOCUMENT TITLE -->
        <div class="text-center mb-1">
          <h1 class="text-[0.9375rem] font-bold m-0 text-slate-900">
            En Route and Port Weather Forecast Information for {{ routeInfo.shipName || '[Nama Kapal]' }}
          </h1>
        </div>

        <!-- 3. ROUTE INFO (repeated) -->
        <div class="mb-5 pdf-avoid-split">
          <div class="pdf-rule-double-top mb-3" aria-hidden="true">
            <div class="pdf-rule-thick" />
            <div class="pdf-rule-gap" />
            <div class="pdf-rule-thin" />
          </div>
          <div class="grid grid-cols-2 gap-x-8 gap-y-0.5 px-1">
            <div>
              <p class="m-0 font-bold text-[0.75rem] text-slate-900 leading-tight">Port of Origin</p>
              <p class="m-0 text-[0.75rem] text-slate-700 leading-tight">{{ routeInfo.portOrigin || '—' }}</p>
            </div>
            <div>
              <p class="m-0 font-bold text-[0.75rem] text-slate-900 leading-tight">Port of Destination</p>
              <p class="m-0 text-[0.75rem] text-slate-700 leading-tight">{{ routeInfo.portDestination || '—' }}</p>
            </div>
            <div>
              <p class="m-0 font-bold text-[0.75rem] text-slate-900 leading-tight">Estimated Time of Departure</p>
              <p class="m-0 text-[0.75rem] text-slate-700 leading-tight">{{ formatDateTime(routeInfo.departureDate, routeInfo.departureTime) || '—' }} LT</p>
            </div>
            <div>
              <p class="m-0 font-bold text-[0.75rem] text-slate-900 leading-tight">Estimated Time of Arrival</p>
              <p class="m-0 text-[0.75rem] text-slate-700 leading-tight">{{ formatDateTime(routeInfo.arrivalDate, routeInfo.arrivalTime) || '—' }} LT</p>
            </div>
            <div>
              <p class="m-0 font-bold text-[0.75rem] text-slate-900 leading-tight">Issued</p>
              <p class="m-0 text-[0.75rem] text-slate-700 leading-tight">{{ formatDateTime(routeInfo.issuedDate, routeInfo.issuedTime) || '—' }} LT</p>
            </div>
          </div>
          <div class="pdf-rule-double-bottom mt-3" aria-hidden="true">
            <div class="pdf-rule-thin" />
            <div class="pdf-rule-gap" />
            <div class="pdf-rule-thick" />
          </div>
        </div>

        <!-- 4. PORT FORECAST TITLE -->
        <h2 class="text-center text-[0.875rem] font-bold m-0 mb-3 text-slate-900">Port Forecast</h2>

        <!-- 5. THRESHOLD LEVEL LEGEND -->
        <div class="mb-4 text-[0.5625rem] leading-relaxed text-slate-600 bg-white border border-slate-300 rounded p-2.5 pdf-avoid-split">
          <p class="m-0 mb-2 text-slate-700">
            NSW = No Significant Weather, FU = Smoke, FG = Fog, SL RA = Slight Rain, MOD RA = Moderate Rain, HVY RA = Heavy Rain, SHRA = Shower Rain, TSRA = Thunderstorm
          </p>
          <div class="grid grid-cols-[auto_1fr] gap-y-1.5 gap-x-3">
            <div class="flex items-center gap-1 border-r border-slate-200 pr-3">
              <span class="font-bold text-slate-700">Thresholds<br>Level</span>
            </div>
            <div class="space-y-1">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="font-semibold text-slate-700 w-10">Waves</span>
                <span class="flex items-center gap-0.5"><span class="inline-block w-3.5 h-2.5 bg-[#FEF001] border border-black/20" /> Moderate (1.25-2.5 m)</span>
                <span class="flex items-center gap-0.5"><span class="inline-block w-3.5 h-2.5 bg-[#FE0105] border border-black/20" /> Rough (2.5-4.0 m)</span>
                <span class="flex items-center gap-0.5"><span class="inline-block w-3.5 h-2.5 bg-[#9A1490] border border-black/20" /> Very Rough (&gt;4 m)</span>
              </div>
              <div class="flex items-center gap-2 flex-wrap">
                <span class="font-semibold text-slate-700 w-10">Winds</span>
                <span class="flex items-center gap-0.5"><span class="inline-block w-3.5 h-2.5 bg-[#FEF001] border border-black/20" /> Moderate (11-16 kts)</span>
                <span class="flex items-center gap-0.5"><span class="inline-block w-3.5 h-2.5 bg-[#FFB565] border border-black/20" /> Fresh (17-21 kts)</span>
                <span class="flex items-center gap-0.5"><span class="inline-block w-3.5 h-2.5 bg-[#FE4B01] border border-black/20" /> Strong (22-27 kts)</span>
                <span class="flex items-center gap-0.5"><span class="inline-block w-3.5 h-2.5 bg-[#FE0105] border border-black/20" /> Near Gale (28-33 kts)</span>
                <span class="flex items-center gap-0.5"><span class="inline-block w-3.5 h-2.5 bg-[#9A1490] border border-black/20" /> Gale (&gt;33 kts)</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 6. PORT OF ORIGIN TABLE -->
        <div class="mb-3 pdf-avoid-split">
          <h3 class="port-table-title">Port of Origin</h3>
          <table class="port-table">
            <colgroup>
              <col style="width:8%" /><col style="width:8%" /><col style="width:12%" />
              <col style="width:9%" /><col style="width:10%" /><col style="width:10%" />
              <col style="width:13%" /><col style="width:9%" />
              <col style="width:10%" /><col style="width:11%" />
            </colgroup>
            <thead>
              <tr class="port-thead-row1">
                <th class="port-th port-th-border">Time</th>
                <th class="port-th port-th-border">WX</th>
                <th class="port-th port-th-border">Visibility</th>
                <th class="port-th port-th-border" colspan="3">Winds</th>
                <th class="port-th port-th-border" colspan="2">Waves</th>
                <th class="port-th port-th-border" colspan="2">Current</th>
              </tr>
              <tr class="port-thead-row2">
                <th class="port-th port-th-border"></th>
                <th class="port-th port-th-border"></th>
                <th class="port-th port-th-border"></th>
                <th class="port-th port-th-border" colspan="3">10 m</th>
                <th class="port-th port-th-border" colspan="2"></th>
                <th class="port-th port-th-border" colspan="2">Surface</th>
              </tr>
              <tr class="port-thead-row3">
                <th class="port-th port-th-border-light">LT</th>
                <th class="port-th port-th-border-light"></th>
                <th class="port-th port-th-border-light">(km)</th>
                <th class="port-th port-th-border-light">Dir</th>
                <th class="port-th port-th-border-light">Spd<br>(kts)</th>
                <th class="port-th port-th-border-light">Gust<br>(kts)</th>
                <th class="port-th port-th-border-light">Total Wave<br>Dir</th>
                <th class="port-th port-th-border-light">Hsig<br>(m)</th>
                <th class="port-th port-th-border-light">Dir</th>
                <th class="port-th port-th-border-light">Spd<br>(cm/s)</th>
              </tr>
            </thead>
            <tbody>
              <tr class="port-date-row">
                <td class="port-td port-td-border text-left font-bold" colspan="10">{{ portOriginDateLabel }}</td>
              </tr>
              <tr
                v-for="(row, idx) in portOriginForecast"
                :key="'po' + idx"
                class="port-data-row"
              >
                <td class="port-td port-td-border text-center">{{ row.time }}</td>
                <td class="port-td port-td-border text-center">{{ row.wx }}</td>
                <td class="port-td port-td-border text-center">{{ row.visibility }}</td>
                <td class="port-td port-td-border text-center">{{ row.windDir }}</td>
                <td class="port-td port-td-border text-center">{{ row.windSpd }}</td>
                <td class="port-td port-td-border text-center" :class="gustClass(row.windGust)">{{ row.windGust }}</td>
                <td class="port-td port-td-border text-center">{{ row.waveDir }}</td>
                <td class="port-td port-td-border text-center">{{ row.waveHsig }}</td>
                <td class="port-td port-td-border text-center">{{ row.currentDir }}</td>
                <td class="port-td port-td-border text-center">{{ row.currentSpd }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 7. PORT OF DESTINATION TABLE -->
        <div class="mb-3 pdf-avoid-split">
          <h3 class="port-table-title">Port of Destination</h3>
          <table class="port-table">
            <colgroup>
              <col style="width:8%" /><col style="width:8%" /><col style="width:12%" />
              <col style="width:9%" /><col style="width:10%" /><col style="width:10%" />
              <col style="width:13%" /><col style="width:9%" />
              <col style="width:10%" /><col style="width:11%" />
            </colgroup>
            <thead>
              <tr class="port-thead-row1">
                <th class="port-th port-th-border">Time</th>
                <th class="port-th port-th-border">WX</th>
                <th class="port-th port-th-border">Visibility</th>
                <th class="port-th port-th-border" colspan="3">Winds</th>
                <th class="port-th port-th-border" colspan="2">Waves</th>
                <th class="port-th port-th-border" colspan="2">Current</th>
              </tr>
              <tr class="port-thead-row2">
                <th class="port-th port-th-border"></th>
                <th class="port-th port-th-border"></th>
                <th class="port-th port-th-border"></th>
                <th class="port-th port-th-border" colspan="3">10 m</th>
                <th class="port-th port-th-border" colspan="2"></th>
                <th class="port-th port-th-border" colspan="2">Surface</th>
              </tr>
              <tr class="port-thead-row3">
                <th class="port-th port-th-border-light">LT</th>
                <th class="port-th port-th-border-light"></th>
                <th class="port-th port-th-border-light">(km)</th>
                <th class="port-th port-th-border-light">Dir</th>
                <th class="port-th port-th-border-light">Spd<br>(kts)</th>
                <th class="port-th port-th-border-light">Gust<br>(kts)</th>
                <th class="port-th port-th-border-light">Total Wave<br>Dir</th>
                <th class="port-th port-th-border-light">Hsig<br>(m)</th>
                <th class="port-th port-th-border-light">Dir</th>
                <th class="port-th port-th-border-light">Spd<br>(cm/s)</th>
              </tr>
            </thead>
            <tbody>
              <tr class="port-date-row">
                <td class="port-td port-td-border text-left font-bold" colspan="10">{{ portDestDateLabel }}</td>
              </tr>
              <tr
                v-for="(row, idx) in portDestForecast"
                :key="'pd' + idx"
                class="port-data-row"
              >
                <td class="port-td port-td-border text-center">{{ row.time }}</td>
                <td class="port-td port-td-border text-center">{{ row.wx }}</td>
                <td class="port-td port-td-border text-center">{{ row.visibility }}</td>
                <td class="port-td port-td-border text-center">{{ row.windDir }}</td>
                <td class="port-td port-td-border text-center">{{ row.windSpd }}</td>
                <td class="port-td port-td-border text-center" :class="gustClass(row.windGust)">{{ row.windGust }}</td>
                <td class="port-td port-td-border text-center">{{ row.waveDir }}</td>
                <td class="port-td port-td-border text-center">{{ row.waveHsig }}</td>
                <td class="port-td port-td-border text-center">{{ row.currentDir }}</td>
                <td class="port-td port-td-border text-center">{{ row.currentSpd }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 8. SAFETY ADVISORY -->
        <div class="mb-4 pdf-avoid-split">
          <h3 class="text-[0.8125rem] font-bold m-0 mb-1.5 text-slate-900">Safety Advisory</h3>
          <p class="m-0 text-[0.75rem] leading-relaxed text-slate-800 mb-1">The following conditions may pose risks to navigation safety:</p>
          <ul class="m-0 pl-5 text-[0.75rem] leading-relaxed text-slate-800 list-disc space-y-0.5">
            <li><span class="font-bold">Fishing vessels</span> when wind speed reaches 15 knots and wave height reaches 1.25 meters.</li>
            <li><span class="font-bold">Barges</span> when wind speed reaches 16 knots and wave height reaches 1.5 meters.</li>
            <li><span class="font-bold">Ferry</span> vessels when wind speed reaches 21 knots and wave height reaches 2.5 meters.</li>
            <li><span class="font-bold">Large vessels</span> (Cargo/Cruise ships) when wind speed reaches 27 knots and wave height reaches 4.0 meters.</li>
          </ul>
        </div>

        <!-- DISCLAIMER (pinned bottom) -->
        <div class="mt-auto pt-3 border-t border-slate-200 pdf-avoid-split">
          <p class="m-0 text-[0.6875rem] italic text-slate-500">Disclaimer : {{ disclaimer }}</p>
        </div>
      </div>

      <!-- ========== PAGE 3+ : En Route Forecast (paginated) ========== -->
      <div
        v-for="(pageRows, pageIdx) in enRoutePages"
        :key="'enroute-page-' + pageIdx"
        class="pdf-page pdf-page-start px-8 pb-8 pt-0 flex flex-col"
      >
        <!-- 1. HEADER (repeated) -->
        <header class="flex items-center gap-4 -mx-8 px-8 py-3 mb-4 border-b border-slate-300 bg-slate-100">
          <img :src="bmkgLogoUrl" alt="BMKG Logo" class="bmkg-logo shrink-0 object-contain" width="56" height="70" />
          <div class="flex-1 text-center">
            <p class="text-[0.875rem] font-bold m-0 mb-0.5 text-teal-700 tracking-wide">AGENCY FOR METEOROLOGY, CLIMATOLOGY, AND GEOPHYSICS</p>
            <p class="text-[0.75rem] font-semibold m-0 mb-0.5 text-slate-800">{{ routeInfo.namaUpt || 'Stasiun Meteorologi Klas II Maritim Paotere Makassar' }}</p>
            <p class="text-[0.6875rem] m-0 mb-0.5 text-slate-600">{{ routeInfo.alamat || 'Jl. Salodong, Kel. Untia, Kec. Biringkanaya, Kota Makassar, Sulawesi Selatan (90243)' }}</p>
            <p class="text-[0.6875rem] m-0 text-slate-600">Telp: {{ routeInfo.telp || '081242069700' }} | Email: {{ routeInfo.email || 'stamar.paotere@bmkg.go.id' }}</p>
          </div>
        </header>

        <!-- 2. DOCUMENT TITLE -->
        <div class="text-center mb-1">
          <h1 class="text-[0.9375rem] font-bold m-0 text-slate-900">
            En Route and Port Weather Forecast Information for {{ routeInfo.shipName || '[Nama Kapal]' }}
          </h1>
        </div>

        <!-- 3. ROUTE INFO (repeated) -->
        <div class="mb-5 pdf-avoid-split">
          <div class="pdf-rule-double-top mb-3" aria-hidden="true">
            <div class="pdf-rule-thick" />
            <div class="pdf-rule-gap" />
            <div class="pdf-rule-thin" />
          </div>
          <div class="grid grid-cols-2 gap-x-8 gap-y-0.5 px-1">
            <div>
              <p class="m-0 font-bold text-[0.75rem] text-slate-900 leading-tight">Port of Origin</p>
              <p class="m-0 text-[0.75rem] text-slate-700 leading-tight">{{ routeInfo.portOrigin || '—' }}</p>
            </div>
            <div>
              <p class="m-0 font-bold text-[0.75rem] text-slate-900 leading-tight">Port of Destination</p>
              <p class="m-0 text-[0.75rem] text-slate-700 leading-tight">{{ routeInfo.portDestination || '—' }}</p>
            </div>
            <div>
              <p class="m-0 font-bold text-[0.75rem] text-slate-900 leading-tight">Estimated Time of Departure</p>
              <p class="m-0 text-[0.75rem] text-slate-700 leading-tight">{{ formatDateTime(routeInfo.departureDate, routeInfo.departureTime) || '—' }} LT</p>
            </div>
            <div>
              <p class="m-0 font-bold text-[0.75rem] text-slate-900 leading-tight">Estimated Time of Arrival</p>
              <p class="m-0 text-[0.75rem] text-slate-700 leading-tight">{{ formatDateTime(routeInfo.arrivalDate, routeInfo.arrivalTime) || '—' }} LT</p>
            </div>
            <div>
              <p class="m-0 font-bold text-[0.75rem] text-slate-900 leading-tight">Issued</p>
              <p class="m-0 text-[0.75rem] text-slate-700 leading-tight">{{ formatDateTime(routeInfo.issuedDate, routeInfo.issuedTime) || '—' }} LT</p>
            </div>
          </div>
          <div class="pdf-rule-double-bottom mt-3" aria-hidden="true">
            <div class="pdf-rule-thin" />
            <div class="pdf-rule-gap" />
            <div class="pdf-rule-thick" />
          </div>
        </div>

        <!-- 4. EN ROUTE FORECAST TITLE -->
        <h2 class="text-center text-[0.875rem] font-bold m-0 mb-3 text-slate-900">
          En route Forecast<template v-if="pageIdx > 0"> (continued)</template>
        </h2>

        <!-- THRESHOLD LEVEL LEGEND (first forecast page only) -->
        <div v-if="pageIdx === 0" class="mb-4 text-[0.5625rem] leading-relaxed text-slate-600 bg-white border border-slate-300 rounded p-2.5 pdf-avoid-split">
          <p class="m-0 mb-2 text-slate-700">
            NSW = No Significant Weather, FU = Smoke, FG = Fog, SL RA = Slight Rain, MOD RA = Moderate Rain, HVY RA = Heavy Rain, SHRA = Shower Rain, TSRA = Thunderstorm
          </p>
          <div class="grid grid-cols-[auto_1fr] gap-y-1.5 gap-x-3">
            <div class="flex items-center gap-1 border-r border-slate-200 pr-3">
              <span class="font-bold text-slate-700">Thresholds<br>Level</span>
            </div>
            <div class="space-y-1">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="font-semibold text-slate-700 w-10">Waves</span>
                <span class="flex items-center gap-0.5"><span class="inline-block w-3.5 h-2.5 bg-[#FEF001] border border-black/20" /> Moderate (1.25-2.5 m)</span>
                <span class="flex items-center gap-0.5"><span class="inline-block w-3.5 h-2.5 bg-[#FE0105] border border-black/20" /> Rough (2.5-4.0 m)</span>
                <span class="flex items-center gap-0.5"><span class="inline-block w-3.5 h-2.5 bg-[#9A1490] border border-black/20" /> Very Rough (&gt;4 m)</span>
              </div>
              <div class="flex items-center gap-2 flex-wrap">
                <span class="font-semibold text-slate-700 w-10">Winds</span>
                <span class="flex items-center gap-0.5"><span class="inline-block w-3.5 h-2.5 bg-[#FEF001] border border-black/20" /> Moderate (11-16 kts)</span>
                <span class="flex items-center gap-0.5"><span class="inline-block w-3.5 h-2.5 bg-[#FFB565] border border-black/20" /> Fresh (17-21 kts)</span>
                <span class="flex items-center gap-0.5"><span class="inline-block w-3.5 h-2.5 bg-[#FE4B01] border border-black/20" /> Strong (22-27 kts)</span>
                <span class="flex items-center gap-0.5"><span class="inline-block w-3.5 h-2.5 bg-[#FE0105] border border-black/20" /> Near Gale (28-33 kts)</span>
                <span class="flex items-center gap-0.5"><span class="inline-block w-3.5 h-2.5 bg-[#9A1490] border border-black/20" /> Gale (&gt;33 kts)</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 5. EN ROUTE FORECAST TABLE -->
        <div class="mb-5">
          <table class="port-table">
            <colgroup>
              <col style="width:17%" /><col style="width:8%" /><col style="width:9%" />
              <col style="width:10%" /><col style="width:10%" />
              <col style="width:9%" /><col style="width:9%" /><col style="width:8%" />
              <col style="width:10%" /><col style="width:10%" />
            </colgroup>
            <thead>
              <tr class="port-thead-row1">
                <th class="port-th port-th-border">Coordinate</th>
                <th class="port-th port-th-border">Time</th>
                <th class="port-th port-th-border">Weather</th>
                <th class="port-th port-th-border">Visibility</th>
                <th class="port-th port-th-border">Wave Height</th>
                <th class="port-th port-th-border" colspan="2">Wind Speed &amp;<br>Direction</th>
                <th class="port-th port-th-border">Gust</th>
                <th class="port-th port-th-border" colspan="2">Current Speed &amp;<br>Direction</th>
              </tr>
              <tr class="port-thead-row2">
                <th class="port-th port-th-border"></th>
                <th class="port-th port-th-border"></th>
                <th class="port-th port-th-border"></th>
                <th class="port-th port-th-border"></th>
                <th class="port-th port-th-border"></th>
                <th class="port-th port-th-border" colspan="2">(kt)</th>
                <th class="port-th port-th-border"></th>
                <th class="port-th port-th-border" colspan="2">(cm/s)</th>
              </tr>
              <tr class="port-thead-row3">
                <th class="port-th port-th-border-light"></th>
                <th class="port-th port-th-border-light">(LT)</th>
                <th class="port-th port-th-border-light"></th>
                <th class="port-th port-th-border-light">(km)</th>
                <th class="port-th port-th-border-light">(m)</th>
                <th class="port-th port-th-border-light">Spd</th>
                <th class="port-th port-th-border-light">Dir</th>
                <th class="port-th port-th-border-light">(kt)</th>
                <th class="port-th port-th-border-light">Spd</th>
                <th class="port-th port-th-border-light">Dir</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="(item, itemIdx) in pageRows" :key="item.key">
                <tr v-if="item.type === 'date-header'" class="port-date-row">
                  <td class="port-td port-td-border text-left font-bold" colspan="10">{{ item.dateLabel }}</td>
                </tr>
                <tr
                  v-else-if="item.row"
                  class="port-data-row"
                >
                  <td class="port-td port-td-border text-left whitespace-nowrap">{{ item.row.coordinate || '—' }}</td>
                  <td class="port-td port-td-border text-center">{{ item.row.time }}</td>
                  <td class="port-td port-td-border text-center">{{ weatherAbbrev(item.row.weather, item.row.rr) }}</td>
                  <td class="port-td port-td-border text-center">{{ item.row.visibility || '—' }}</td>
                  <td class="port-td port-td-border text-center" :class="waveHeightClass(item.row.wave)">{{ item.row.wave }}</td>
                  <td class="port-td port-td-border text-center">{{ item.row.ws }}</td>
                  <td class="port-td port-td-border text-center">{{ item.row.wd }}</td>
                  <td class="port-td port-td-border text-center" :class="gustClass(estimateGust(item.row.ws))">{{ estimateGust(item.row.ws) }}</td>
                  <td class="port-td port-td-border text-center">{{ item.row.aruss }}</td>
                  <td class="port-td port-td-border text-center">{{ item.row.arusd }}</td>
                </tr>
              </template>
              <tr v-if="pageIdx === 0 && !forecastData.length">
                <td colspan="10" class="port-td port-td-border text-center text-slate-400">Belum ada data</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 6. FORECASTER ON DUTY (last en-route page only) -->
        <div
          v-if="pageIdx === enRoutePages.length - 1"
          class="mt-8 pr-4 pdf-avoid-split w-full flex justify-end"
        >
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

        <!-- DISCLAIMER (pinned bottom — appears on every page) -->
        <div class="mt-auto pt-3 border-t border-slate-200 pdf-avoid-split">
          <p class="m-0 text-[0.6875rem] italic text-slate-500">Disclaimer : {{ disclaimer }}</p>
        </div>
      </div>

      <!-- ========== Significant Wave Height (paginated: max 4 images per page, 2×2 grid) ========== -->
      <div
        v-for="(pageImages, pageIdx) in wavePlotPages"
        :key="'wave-plots-' + pageIdx"
        class="pdf-page pdf-page-start px-8 pb-8 pt-0 flex flex-col"
      >
        <header class="flex items-center gap-4 -mx-8 px-8 py-3 mb-4 border-b border-slate-300 bg-slate-100">
          <img :src="bmkgLogoUrl" alt="BMKG Logo" class="bmkg-logo shrink-0 object-contain" width="56" height="70" />
          <div class="flex-1 text-center">
            <p class="text-[0.875rem] font-bold m-0 mb-0.5 text-teal-700 tracking-wide">AGENCY FOR METEOROLOGY, CLIMATOLOGY, AND GEOPHYSICS</p>
            <p class="text-[0.75rem] font-semibold m-0 mb-0.5 text-slate-800">{{ routeInfo.namaUpt || 'Stasiun Meteorologi Klas II Maritim Paotere Makassar' }}</p>
            <p class="text-[0.6875rem] m-0 mb-0.5 text-slate-600">{{ routeInfo.alamat || 'Jl. Salodong, Kel. Untia, Kec. Biringkanaya, Kota Makassar, Sulawesi Selatan (90243)' }}</p>
            <p class="text-[0.6875rem] m-0 text-slate-600">Telp: {{ routeInfo.telp || '081242069700' }} | Email: {{ routeInfo.email || 'stamar.paotere@bmkg.go.id' }}</p>
          </div>
        </header>

        <div class="text-center mb-1">
          <h1 class="text-[0.9375rem] font-bold m-0 text-slate-900">
            En Route and Port Weather Forecast Information for {{ routeInfo.shipName || '[Nama Kapal]' }}
          </h1>
        </div>

        <div class="mb-5 pdf-avoid-split">
          <div class="pdf-rule-double-top mb-3" aria-hidden="true">
            <div class="pdf-rule-thick" />
            <div class="pdf-rule-gap" />
            <div class="pdf-rule-thin" />
          </div>
          <div class="grid grid-cols-2 gap-x-8 gap-y-0.5 px-1">
            <div>
              <p class="m-0 font-bold text-[0.75rem] text-slate-900 leading-tight">Port of Origin</p>
              <p class="m-0 text-[0.75rem] text-slate-700 leading-tight">{{ routeInfo.portOrigin || '—' }}</p>
            </div>
            <div>
              <p class="m-0 font-bold text-[0.75rem] text-slate-900 leading-tight">Port of Destination</p>
              <p class="m-0 text-[0.75rem] text-slate-700 leading-tight">{{ routeInfo.portDestination || '—' }}</p>
            </div>
            <div>
              <p class="m-0 font-bold text-[0.75rem] text-slate-900 leading-tight">Estimated Time of Departure</p>
              <p class="m-0 text-[0.75rem] text-slate-700 leading-tight">{{ formatDateTime(routeInfo.departureDate, routeInfo.departureTime) || '—' }} LT</p>
            </div>
            <div>
              <p class="m-0 font-bold text-[0.75rem] text-slate-900 leading-tight">Estimated Time of Arrival</p>
              <p class="m-0 text-[0.75rem] text-slate-700 leading-tight">{{ formatDateTime(routeInfo.arrivalDate, routeInfo.arrivalTime) || '—' }} LT</p>
            </div>
            <div>
              <p class="m-0 font-bold text-[0.75rem] text-slate-900 leading-tight">Issued</p>
              <p class="m-0 text-[0.75rem] text-slate-700 leading-tight">{{ formatDateTime(routeInfo.issuedDate, routeInfo.issuedTime) || '—' }} LT</p>
            </div>
          </div>
          <div class="pdf-rule-double-bottom mt-3" aria-hidden="true">
            <div class="pdf-rule-thin" />
            <div class="pdf-rule-gap" />
            <div class="pdf-rule-thick" />
          </div>
        </div>

        <h2 class="text-center text-[0.875rem] font-bold m-0 mb-3 text-slate-900">
          Significant Wave Height<template v-if="pageIdx > 0"></template>
        </h2>

        <div class="grid grid-cols-2 gap-1 pdf-avoid-split">
          <div
            v-for="(src, imgIdx) in pageImages"
            :key="'wave-img-' + pageIdx + '-' + imgIdx"
            class="rounded overflow-hidden flex justify-center items-start"
          >
            <img
              :src="src"
              :alt="`Significant wave height plot ${pageIdx * imagesPerPlotPage + imgIdx + 1}`"
              class="block w-full max-h-[80mm] object-contain object-top"
            />
          </div>
        </div>

        <div class="mt-auto pt-3 border-t border-slate-200 pdf-avoid-split">
          <p class="m-0 text-[0.6875rem] italic text-slate-500">Disclaimer : {{ disclaimer }}</p>
        </div>
      </div>

      <!-- ========== Wind plots (paginated: max 4 images per page, 2×2 grid) ========== -->
      <div
        v-for="(pageImages, pageIdx) in windPlotPages"
        :key="'wind-plots-' + pageIdx"
        class="pdf-page pdf-page-start px-8 pb-8 pt-0 flex flex-col"
      >
        <header class="flex items-center gap-4 -mx-8 px-8 py-3 mb-4 border-b border-slate-300 bg-slate-100">
          <img :src="bmkgLogoUrl" alt="BMKG Logo" class="bmkg-logo shrink-0 object-contain" width="56" height="70" />
          <div class="flex-1 text-center">
            <p class="text-[0.875rem] font-bold m-0 mb-0.5 text-teal-700 tracking-wide">AGENCY FOR METEOROLOGY, CLIMATOLOGY, AND GEOPHYSICS</p>
            <p class="text-[0.75rem] font-semibold m-0 mb-0.5 text-slate-800">{{ routeInfo.namaUpt || 'Stasiun Meteorologi Klas II Maritim Paotere Makassar' }}</p>
            <p class="text-[0.6875rem] m-0 mb-0.5 text-slate-600">{{ routeInfo.alamat || 'Jl. Salodong, Kel. Untia, Kec. Biringkanaya, Kota Makassar, Sulawesi Selatan (90243)' }}</p>
            <p class="text-[0.6875rem] m-0 text-slate-600">Telp: {{ routeInfo.telp || '081242069700' }} | Email: {{ routeInfo.email || 'stamar.paotere@bmkg.go.id' }}</p>
          </div>
        </header>

        <div class="text-center mb-1">
          <h1 class="text-[0.9375rem] font-bold m-0 text-slate-900">
            En Route and Port Weather Forecast Information for {{ routeInfo.shipName || '[Nama Kapal]' }}
          </h1>
        </div>

        <div class="mb-5 pdf-avoid-split">
          <div class="pdf-rule-double-top mb-3" aria-hidden="true">
            <div class="pdf-rule-thick" />
            <div class="pdf-rule-gap" />
            <div class="pdf-rule-thin" />
          </div>
          <div class="grid grid-cols-2 gap-x-8 gap-y-0.5 px-1">
            <div>
              <p class="m-0 font-bold text-[0.75rem] text-slate-900 leading-tight">Port of Origin</p>
              <p class="m-0 text-[0.75rem] text-slate-700 leading-tight">{{ routeInfo.portOrigin || '—' }}</p>
            </div>
            <div>
              <p class="m-0 font-bold text-[0.75rem] text-slate-900 leading-tight">Port of Destination</p>
              <p class="m-0 text-[0.75rem] text-slate-700 leading-tight">{{ routeInfo.portDestination || '—' }}</p>
            </div>
            <div>
              <p class="m-0 font-bold text-[0.75rem] text-slate-900 leading-tight">Estimated Time of Departure</p>
              <p class="m-0 text-[0.75rem] text-slate-700 leading-tight">{{ formatDateTime(routeInfo.departureDate, routeInfo.departureTime) || '—' }} LT</p>
            </div>
            <div>
              <p class="m-0 font-bold text-[0.75rem] text-slate-900 leading-tight">Estimated Time of Arrival</p>
              <p class="m-0 text-[0.75rem] text-slate-700 leading-tight">{{ formatDateTime(routeInfo.arrivalDate, routeInfo.arrivalTime) || '—' }} LT</p>
            </div>
            <div>
              <p class="m-0 font-bold text-[0.75rem] text-slate-900 leading-tight">Issued</p>
              <p class="m-0 text-[0.75rem] text-slate-700 leading-tight">{{ formatDateTime(routeInfo.issuedDate, routeInfo.issuedTime) || '—' }} LT</p>
            </div>
          </div>
          <div class="pdf-rule-double-bottom mt-3" aria-hidden="true">
            <div class="pdf-rule-thin" />
            <div class="pdf-rule-gap" />
            <div class="pdf-rule-thick" />
          </div>
        </div>

        <h2 class="text-center text-[0.875rem] font-bold m-0 mb-3 text-slate-900">
          Wind<template v-if="pageIdx > 0"></template>
        </h2>

        <div class="grid grid-cols-2 gap-1 pdf-avoid-split">
          <div
            v-for="(src, imgIdx) in pageImages"
            :key="'wind-img-' + pageIdx + '-' + imgIdx"
            class="rounded overflow-hidden flex justify-center items-start"
          >
            <img
              :src="src"
              :alt="`Wind speed and direction plot ${pageIdx * imagesPerPlotPage + imgIdx + 1}`"
              class="block w-full max-h-[80mm] object-contain object-top"
            />
          </div>
        </div>

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

const { routeInfo, forecastData, synopticInfo, warnings, cycloneWarning, disclaimer, safetyAdvisory, manualRouteData, availableRoutes, selectedRouteId, splitPointCoordinates } = useMaritimeData()
const bmkgLogoUrl = useBmkgLogoUrl()

/** Explicit computed so preview + img src always track `signatureImageDataUrl`. */
const signatureDataUrl = computed(() => {
  const u = routeInfo.value.signatureImageDataUrl?.trim()
  return u || ''
})

const pdfDocumentRef = ref<HTMLElement | null>(null)
const mapContainerRef = ref<HTMLElement | null>(null)
const isDownloading = ref(false)

// --- Meteogram chart constants ---
const chartWidth = 520
const chartHeight = 155
const marginLeft = 42
const marginTop = 35
const chartAreaW = chartWidth - marginLeft - 48
const chartAreaH = chartHeight - marginTop - 20
const weatherIconY = 28

/** Meteogram wind axis: forecast `ws` is in knots (matches API). */
const windSpeedMaxKts = 25
const windSpeedTicksKts = [25, 20, 15,12, 9, 6, 3, 0] as const

const meteogramRows = computed(() => forecastData.value.filter(r => r.date || r.time))

const visibilityMaxKm = 10
const visibilityTicks = computed(() => {
  // 0..max mapped onto 7 equal segments (8 labels) for compact PDF readability.
  const steps = 7
  const max = visibilityMaxKm
  return Array.from({ length: steps + 1 }, (_, i) => Number((max - (i * max) / steps).toFixed(1)))
})

const visibilityPath = computed(() => {
  const rows = meteogramRows.value
  if (!rows.length) return ''
  return rows.map((r, i) => {
    const rawVisibility = parseFloat(r.visibility || '0') || 0
    const visibilityKm = Math.max(0, Math.min(visibilityMaxKm, rawVisibility))
    const x = marginLeft + (i + 0.5) * (chartAreaW / rows.length)
    const y = marginTop + (1 - visibilityKm / visibilityMaxKm) * chartAreaH
    return `${x},${y}`
  }).join(' ')
})

const windPoints = computed(() => {
  const rows = meteogramRows.value
  if (!rows.length) return []
  return rows.map((r, i) => {
    const ws = parseFloat(r.ws || '0') || 5
    const x = marginLeft + (i + 0.5) * (chartAreaW / rows.length)
    const y = marginTop + (1 - Math.min(windSpeedMaxKts, ws) / windSpeedMaxKts) * chartAreaH
    return { x, y }
  })
})

const windPath = computed(() => {
  const pts = windPoints.value
  return pts.length ? pointsToSmoothPath(pts) : ''
})

function pointsToSmoothPath(points: { x: number; y: number }[]): string {
  if (points.length < 2) return ''
  const p0 = points[0]!
  const p1 = points[1]!
  if (points.length === 2) {
    return `M ${p0.x},${p0.y} L ${p1.x},${p1.y}`
  }
  const tension = 0.2
  let path = `M ${p0.x},${p0.y}`
  for (let i = 0; i < points.length - 1; i++) {
    const cur = points[i]!
    const next = points[i + 1]!
    const prev = points[i - 1] ?? { x: cur.x - (next.x - cur.x), y: cur.y - (next.y - cur.y) }
    const after = points[i + 2] ?? { x: next.x + (next.x - cur.x), y: next.y + (next.y - cur.y) }
    const cp1x = cur.x + (next.x - prev.x) * tension
    const cp1y = cur.y + (next.y - prev.y) * tension
    const cp2x = next.x - (after.x - cur.x) * tension
    const cp2y = next.y - (after.y - cur.y) * tension
    path += ` C ${cp1x.toFixed(2)},${cp1y.toFixed(2)} ${cp2x.toFixed(2)},${cp2y.toFixed(2)} ${next.x},${next.y}`
  }
  return path
}

function weatherIcon(row: { weather?: string; rr?: string }) {
  const w = (row.weather || '').toLowerCase()
  const rr = parseFloat(row.rr || '0') || 0
  if (rr > 0 || w.includes('hujan')) return '🌧️'
  if (w.includes('cerah') && w.includes('berawan')) return '⛅'
  if (w.includes('berawan')) return '☁️'
  if (w.includes('cerah')) return '☀️'
  return '⛅'
}

const SHORT_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const

function formatMeteogramDate(dateStr: string): string {
  if (!dateStr) return ''
  const parts = dateStr.split('/')
  if (parts.length >= 2) {
    const day = parseInt(parts[0]!)
    const monthIdx = parseInt(parts[1]!) - 1
    return `${SHORT_MONTHS[monthIdx] ?? parts[1]} ${day}`
  }
  return dateStr
}

/** SVG rotation for wind arrow: default path points up; meteorological wd is direction wind comes FROM (0°=N). Arrow points downwind. */
function windDirectionAngle(wd: string): number {
  const trimmed = (wd ?? '').trim()
  if (!trimmed) return 0

  const cleaned = trimmed.replace(/°/g, '').trim()
  if (/^-?\d+(\.\d+)?$/.test(cleaned)) {
    const deg = Number(cleaned)
    if (!Number.isFinite(deg)) return 0
    const from = ((deg % 360) + 360) % 360
    return (from + 180) % 360
  }

  const dirMap: Record<string, number> = { N: 180, NNE: 202.5, NE: 225, ENE: 247.5, E: 270, ESE: 292.5, SE: 315, SSE: 337.5, S: 0, SSW: 22.5, SW: 45, WSW: 67.5, W: 90, WNW: 112.5, NW: 135, NNW: 157.5 }
  return dirMap[trimmed.toUpperCase()] ?? 0
}

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

function formatFullDate(dateStr: string): string {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  const dayName = d.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' })
  const day = d.getUTCDate()
  const month = d.toLocaleDateString('en-US', { month: 'long', timeZone: 'UTC' })
  const year = d.getUTCFullYear()
  return `${dayName}, ${day} ${month} ${year}`
}

// --- Page 2: Port Forecast Data ---
interface PortForecastRow {
  time: string
  wx: string
  visibility: string
  windDir: string
  windSpd: string
  windGust: string
  waveDir: string
  waveHsig: string
  currentDir: string
  currentSpd: string
}

const portOriginDateLabel = computed(() => formatFullDate(routeInfo.value.departureDate))
const portDestDateLabel = computed(() => formatFullDate(routeInfo.value.arrivalDate))

const portOriginForecast = ref<PortForecastRow[]>([
  { time: '08', wx: 'NSW', visibility: '10', windDir: 'NW', windSpd: '7', windGust: '11', waveDir: 'S', waveHsig: '0.3', currentDir: 'ENE', currentSpd: '37' },
  { time: '11', wx: 'NSW', visibility: '10', windDir: 'WNW', windSpd: '5', windGust: '8', waveDir: 'S', waveHsig: '0.3', currentDir: 'ENE', currentSpd: '41' },
  { time: '14', wx: 'NSW', visibility: '10', windDir: 'SSE', windSpd: '6', windGust: '9', waveDir: 'S', waveHsig: '0.3', currentDir: 'ENE', currentSpd: '41' },
  { time: '17', wx: 'NSW', visibility: '10', windDir: 'SSE', windSpd: '2', windGust: '3', waveDir: 'S', waveHsig: '0.3', currentDir: 'ENE', currentSpd: '38' },
  { time: '20', wx: 'NSW', visibility: '10', windDir: 'ESE', windSpd: '10', windGust: '15', waveDir: 'SSE', waveHsig: '0.3', currentDir: 'NE', currentSpd: '46' },
])

const portDestForecast = ref<PortForecastRow[]>([
  { time: '08', wx: 'NSW', visibility: '10', windDir: 'WNW', windSpd: '10', windGust: '15', waveDir: 'NE', waveHsig: '0.3', currentDir: 'ENE', currentSpd: '34' },
  { time: '11', wx: 'NSW', visibility: '10', windDir: 'NW', windSpd: '9', windGust: '14', waveDir: 'NNW', waveHsig: '0.4', currentDir: 'ENE', currentSpd: '33' },
  { time: '14', wx: 'NSW', visibility: '10', windDir: 'ENE', windSpd: '1', windGust: '2', waveDir: 'SSE', waveHsig: '0.3', currentDir: 'E', currentSpd: '29' },
  { time: '17', wx: 'NSW', visibility: '10', windDir: 'SE', windSpd: '7', windGust: '11', waveDir: 'SSE', waveHsig: '0.3', currentDir: 'E', currentSpd: '22' },
  { time: '20', wx: 'NSW', visibility: '10', windDir: 'ESE', windSpd: '9', windGust: '14', waveDir: 'SSE', waveHsig: '0.3', currentDir: 'E', currentSpd: '22' },
])

function gustClass(gust: string): string {
  const v = parseFloat(gust) || 0
  if (v >= 34) return 'bg-[#9A1490] text-white'
  if (v >= 28) return 'bg-[#FE0105] text-white'
  if (v >= 22) return 'bg-[#FE4B01] text-white'
  if (v >= 17) return 'bg-[#FFB565] text-slate-900'
  if (v >= 11) return 'bg-[#FEF001] text-slate-900'
  return ''
}

// --- Page 3: En Route Forecast helpers ---
function weatherAbbrev(weather: string, rr: string): string {
  const norm = (weather || '').trim().replace(/\s+/g, ' ')
  const upper = norm.toUpperCase()
  const known = new Set(['NSW', 'FU', 'FG', 'SL RA', 'MOD RA', 'HVY RA', 'SHRA', 'TSRA'])
  if (known.has(upper)) return upper
  const w = norm.toLowerCase()
  const rainfall = parseFloat(rr) || 0
  if (w.includes('petir') || w.includes('thunderstorm')) return 'TSRA'
  if (w.includes('hujan shower') || w.includes('shower')) return 'SHRA'
  if (rainfall > 20 || w.includes('hujan lebat') || w.includes('heavy')) return 'HVY RA'
  if (rainfall > 5 || w.includes('hujan sedang') || w.includes('moderate')) return 'MOD RA'
  if (rainfall > 0 || w.includes('hujan') || w.includes('rain')) return 'SL RA'
  if (w.includes('kabut') || w.includes('fog')) return 'FG'
  if (w.includes('asap') || w.includes('smoke')) return 'FU'
  return 'NSW'
}

function waveHeightClass(wave: string): string {
  const v = parseFloat(wave) || 0
  if (v >= 4.0) return 'bg-[#9A1490] text-white'
  if (v >= 2.5) return 'bg-[#FE0105] text-white'
  if (v >= 1.25) return 'bg-[#FEF001] text-slate-900'
  return ''
}

function estimateGust(ws: string): string {
  const v = parseFloat(ws) || 0
  return String(Math.round(v * 1.5))
}

function parseRouteDate(dateStr: string): Date | null {
  if (!dateStr) return null
  const parts = dateStr.split('/')
  if (parts.length === 3) {
    const day = parseInt(parts[0]!)
    const month = parseInt(parts[1]!) - 1
    let year = parseInt(parts[2]!)
    if (year < 100) year += 2000
    return new Date(Date.UTC(year, month, day))
  }
  return null
}

function formatRouteDate(dateStr: string): string {
  const d = parseRouteDate(dateStr)
  if (!d) return dateStr || '—'
  const dayName = d.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' })
  const day = d.getUTCDate()
  const month = d.toLocaleDateString('en-US', { month: 'long', timeZone: 'UTC' })
  const year = d.getUTCFullYear()
  return `${dayName}, ${day} ${month} ${year}`
}

interface EnRouteGroup {
  dateLabel: string
  rows: typeof forecastData.value
}

const enRouteForecastGroups = computed<EnRouteGroup[]>(() => {
  const groups: EnRouteGroup[] = []
  let currentDate = ''
  let currentGroup: EnRouteGroup | null = null

  for (const row of forecastData.value) {
    if (row.date !== currentDate) {
      currentDate = row.date
      currentGroup = { dateLabel: formatRouteDate(row.date), rows: [] }
      groups.push(currentGroup)
    }
    currentGroup?.rows.push(row)
  }

  return groups
})

interface EnRouteFlatItem {
  key: string
  type: 'date-header' | 'data'
  dateLabel?: string
  row?: (typeof forecastData.value)[number]
}

const FIRST_FORECAST_PAGE_ROWS = 22
const CONT_FORECAST_PAGE_ROWS = 32

const enRoutePages = computed<EnRouteFlatItem[][]>(() => {
  const flat: EnRouteFlatItem[] = []
  let counter = 0
  for (const group of enRouteForecastGroups.value) {
    flat.push({ key: `dh-${counter}`, type: 'date-header', dateLabel: group.dateLabel })
    counter++
    for (const row of group.rows) {
      flat.push({ key: `dr-${counter}`, type: 'data', row })
      counter++
    }
  }

  if (flat.length === 0) return [[]]

  const pages: EnRouteFlatItem[][] = []
  let i = 0
  pages.push(flat.slice(0, FIRST_FORECAST_PAGE_ROWS))
  i = FIRST_FORECAST_PAGE_ROWS

  while (i < flat.length) {
    pages.push(flat.slice(i, i + CONT_FORECAST_PAGE_ROWS))
    i += CONT_FORECAST_PAGE_ROWS
  }

  return pages
})

/** Max images per PDF page for wave / wind plot sections (2×2 grid). */
const imagesPerPlotPage = 4

function chunkPlotImages<T>(items: T[], chunkSize: number): T[][] {
  if (chunkSize < 1) return items.length ? [items] : []
  const pages: T[][] = []
  for (let i = 0; i < items.length; i += chunkSize) {
    pages.push(items.slice(i, i + chunkSize))
  }
  return pages
}

/** Paths under `public/` like `/swh_2026032600.png` — discovered at runtime. */
const { data: plotImagePaths } = useFetch<{ swhPaths: string[]; wsPaths: string[] }>(
  '/api/maritime/plot-images',
  { default: () => ({ swhPaths: [], wsPaths: [] }) }
)

function pad2(n: number) {
  return String(n).padStart(2, '0')
}

/** Matches map filenames: `swh_2026032600.png` → issued time as UTC (same as route forecast inputs). */
function dateTimeToYyyyMmDdHhUtc(dateStr: string, timeStr: string): string | null {
  if (!dateStr || !timeStr) return null
  const dp = dateStr.split('-').map(Number)
  const tp = timeStr.split(':').map(Number)
  if (dp.length < 3 || tp.length < 2) return null
  const [y, m, d] = dp as [number, number, number]
  const [hh, mm] = tp as [number, number]
  if ([y, m, d, hh, mm].some(n => !Number.isFinite(n))) return null
  const dt = new Date(Date.UTC(y, m - 1, d, hh, mm, 0))
  return `${dt.getUTCFullYear()}${pad2(dt.getUTCMonth() + 1)}${pad2(dt.getUTCDate())}${pad2(dt.getUTCHours())}`
}

const significantWavePlotImageUrls = computed(() => {
  const paths = plotImagePaths.value?.swhPaths
  if (paths?.length) return paths
  const s = dateTimeToYyyyMmDdHhUtc(routeInfo.value.issuedDate, routeInfo.value.issuedTime)
  return s ? [`/swh_${s}.png`] : []
})

const windPlotImageUrls = computed(() => {
  const paths = plotImagePaths.value?.wsPaths
  if (paths?.length) return paths
  const s = dateTimeToYyyyMmDdHhUtc(routeInfo.value.issuedDate, routeInfo.value.issuedTime)
  return s ? [`/ws_${s}.png`] : []
})

const wavePlotPages = computed(() => chunkPlotImages(significantWavePlotImageUrls.value, imagesPerPlotPage))
const windPlotPages = computed(() => chunkPlotImages(windPlotImageUrls.value, imagesPerPlotPage))

// --- Leaflet Map ---
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

let map: L.Map | null = null
let routeLayer: L.GeoJSON | null = null
let startMarker: L.CircleMarker | null = null
let endMarker: L.CircleMarker | null = null

function getRouteCoordinates(): [number, number][] {
  const selectedRoute = availableRoutes.value.find(r => r.id === selectedRouteId.value)
  if (selectedRoute?.coordinates && selectedRoute.coordinates.length >= 2) {
    return selectedRoute.coordinates
  }
  if (manualRouteData.value?.coordinates && manualRouteData.value.coordinates.length >= 2) {
    return manualRouteData.value.coordinates
  }
  return DEFAULT_COORDINATES
}

async function renderRouteOnMap(Leaflet: typeof import('leaflet')) {
  if (!map) return
  if (routeLayer) {
    routeLayer.remove()
    routeLayer = null
  }
  if (startMarker) {
    startMarker.remove()
    startMarker = null
  }
  if (endMarker) {
    endMarker.remove()
    endMarker = null
  }

  const coords = getRouteCoordinates()
  const sampledCoords = splitPointCoordinates.value
  const waveSegments = buildWaveLineSegments(sampledCoords, forecastData.value)
  const useWaveSegments = waveSegments.length > 0

  const geoJson: GeoJSON.FeatureCollection = useWaveSegments
    ? {
        type: 'FeatureCollection',
        features: waveSegments.map(segment => ({
          type: 'Feature' as const,
          properties: {
            waveHeight: segment.waveHeight,
            color: segment.color
          },
          geometry: {
            type: 'LineString' as const,
            coordinates: segment.coordinates
          }
        }))
      }
    : {
        type: 'FeatureCollection',
        features: [{
          type: 'Feature' as const,
          properties: {},
          geometry: { type: 'LineString' as const, coordinates: coords }
        }]
      }

  routeLayer = Leaflet.geoJSON(geoJson as never, {
    style: (feature) => {
      const color = (feature?.properties as { color?: string } | undefined)?.color
      if (color) {
        return { color, weight: 4, opacity: 0.95 }
      }
      return { color: '#ef4444', weight: 3, opacity: 0.9, dashArray: '8 4' }
    }
  }).addTo(map)

  const first = coords[0]
  const last = coords[coords.length - 1]
  if (first) {
    startMarker = Leaflet.circleMarker([first[1], first[0]], { radius: 6, color: '#16a34a', fillColor: '#16a34a', fillOpacity: 1, weight: 2 }).addTo(map)
  }
  if (last) {
    endMarker = Leaflet.circleMarker([last[1], last[0]], { radius: 6, color: '#16a34a', fillColor: '#16a34a', fillOpacity: 1, weight: 2 }).addTo(map)
  }

  const currentLayer = routeLayer
  if (currentLayer && currentLayer.getBounds().isValid()) {
    map.fitBounds(currentLayer.getBounds(), { padding: [20, 20] })
  }
}

interface WaveLineSegment {
  coordinates: [number, number][]
  waveHeight: number
  color: string
}

function waveColorFromHeight(height: number): string {
  if (height <= 0.5) return '#16a34a' // green-600
  if (height <= 1.25) return '#60a5fa' // blue-400
  if (height <= 2.5) return '#facc15' // yellow-400
  if (height <= 4.0) return '#f97316' // orange-500
  if (height <= 6.0) return '#ef4444' // red-500
  if (height <= 9.0) return '#6b21a8' // purple-700
  return '#1f2937' // slate-800
}

function buildWaveLineSegments(
  sampledCoords: [number, number][],
  rows: Array<{ wave?: string }>
): WaveLineSegment[] {
  if (sampledCoords.length < 2 || rows.length < 2) return []
  const maxIdx = Math.min(sampledCoords.length - 1, rows.length - 1)
  const segments: WaveLineSegment[] = []

  for (let i = 0; i < maxIdx; i++) {
    const start = sampledCoords[i]
    const end = sampledCoords[i + 1]
    if (!start || !end) continue
    const waveA = parseFloat(rows[i]?.wave || '0') || 0
    const waveB = parseFloat(rows[i + 1]?.wave || '0') || 0
    const waveHeight = Math.max(waveA, waveB)
    segments.push({
      coordinates: [start, end],
      waveHeight,
      color: waveColorFromHeight(waveHeight)
    })
  }

  return segments
}

onMounted(async () => {
  const el = mapContainerRef.value
  if (!el) return
  const Leaflet = (await import('leaflet')).default

  try {
    map = Leaflet.map(el, { preferCanvas: true, zoomControl: false, attributionControl: false }).setView([2.3, 125], 6)
    Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { crossOrigin: 'anonymous' }).addTo(map)

    await renderRouteOnMap(Leaflet)
    await nextTick()
    requestAnimationFrame(() => {
      requestAnimationFrame(() => map?.invalidateSize())
    })
  } catch (err) {
    console.error('Map init error:', err)
  }
})

onBeforeUnmount(() => {
  routeLayer?.remove()
  startMarker?.remove()
  endMarker?.remove()
  routeLayer = null
  startMarker = null
  endMarker = null
  map?.remove()
  map = null
})

watch([manualRouteData, availableRoutes, selectedRouteId, splitPointCoordinates, forecastData], async () => {
  if (!map) return
  const Leaflet = (await import('leaflet')).default
  await renderRouteOnMap(Leaflet)
}, { deep: true })

// --- PDF Download ---
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

async function imgToDataUrl(src: string): Promise<string> {
  const absUrl = src.startsWith('http') || src.startsWith('data:')
    ? src
    : new URL(src.startsWith('/') ? src : `/${src}`, window.location.origin).href
  return new Promise<string>((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      try {
        const c = document.createElement('canvas')
        c.width = img.naturalWidth || img.width
        c.height = img.naturalHeight || img.height
        const ctx = c.getContext('2d')
        if (!ctx) { resolve(absUrl); return }
        ctx.drawImage(img, 0, 0)
        resolve(c.toDataURL('image/png'))
      } catch { resolve(absUrl) }
    }
    img.onerror = () => resolve(absUrl)
    img.src = absUrl
  })
}

async function downloadPdf() {
  const el = pdfDocumentRef.value
  if (!el) return

  isDownloading.value = true
  try {
    const { jsPDF } = await import('jspdf')
    const { default: autoTable } = await import('jspdf-autotable')

    const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait', compress: true })

    const PW = 210
    const PH = 297
    const M = 8
    const CW = PW - 2 * M

    type RGB = [number, number, number]
    const TEAL700: RGB = [13, 148, 136]
    const SL900: RGB = [15, 23, 42]
    const SL800: RGB = [30, 41, 59]
    const SL700: RGB = [51, 65, 85]
    const SL600: RGB = [71, 85, 105]
    const SL500: RGB = [100, 116, 139]
    const SL300: RGB = [203, 213, 225]
    const SL200: RGB = [226, 232, 240]
    const SL100: RGB = [241, 245, 249]
    const WHITE: RGB = [255, 255, 255]
    const BLACK: RGB = [0, 0, 0]
    const TH1: RGB = [30, 43, 74]
    const TH2: RGB = [45, 63, 101]
    const DATE_BG: RGB = [219, 234, 254]
    const YEL200: RGB = [254, 240, 138]
    /** Threshold legend / PDF cell highlights — palette: FEF001, FFB565, FE4B01, FE0105, 9A1490 */
    const TH_C1: RGB = [254, 240, 1]
    const TH_C2: RGB = [255, 181, 101]
    const TH_C3: RGB = [254, 75, 1]
    const TH_C4: RGB = [254, 1, 5]
    const TH_C5: RGB = [154, 20, 144]

    /* ── Pre-load assets ── */
    let logoImg: string | null = null
    try { logoImg = await svgToPngDataUrl('/logo-bmkg.svg') } catch { /* ignore */ }

    let mapImg: string | null = null
    if (mapContainerRef.value && map) {
      try {
        map.invalidateSize()
        await new Promise(r => setTimeout(r, 1500))
        const h2c = (await import('html2canvas')).default
        const c = await h2c(mapContainerRef.value, { scale: 2, useCORS: true, backgroundColor: '#f8fafc' })
        mapImg = c.toDataURL('image/png')
      } catch { /* ignore */ }
    }

    let meteogramImg: string | null = null
    const mgSvg = el.querySelector('[data-meteogram] svg') as SVGSVGElement | null
    if (mgSvg) {
      try {
        const svgRect = mgSvg.getBoundingClientRect()
        const clone = mgSvg.cloneNode(true) as SVGSVGElement
        clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
        clone.setAttribute('width', String(svgRect.width))
        clone.setAttribute('height', String(svgRect.height))
        const svgStr = new XMLSerializer().serializeToString(clone)
        const svgDataUrl = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgStr)))
        meteogramImg = await new Promise<string | null>((resolve) => {
          const img = new Image()
          img.onload = () => {
            const canvas = document.createElement('canvas')
            const s = 2
            canvas.width = Math.round(svgRect.width * s)
            canvas.height = Math.round(svgRect.height * s)
            const ctx = canvas.getContext('2d')
            if (!ctx) { resolve(null); return }
            ctx.fillStyle = '#ffffff'
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            ctx.scale(s, s)
            ctx.drawImage(img, 0, 0, svgRect.width, svgRect.height)
            resolve(canvas.toDataURL('image/png'))
          }
          img.onerror = () => resolve(null)
          img.src = svgDataUrl
        })
      } catch { /* ignore */ }
    }
    if (!meteogramImg) {
      const mgContainer = el.querySelector('[data-meteogram]') as HTMLElement | null
      if (mgContainer) {
        try {
          const h2c = (await import('html2canvas')).default
          const c = await h2c(mgContainer, { scale: 2, useCORS: true, backgroundColor: '#ffffff' })
          meteogramImg = c.toDataURL('image/png')
        } catch { /* ignore */ }
      }
    }

    const plotCache = new Map<string, string>()
    await Promise.all(
      [...significantWavePlotImageUrls.value, ...windPlotImageUrls.value].map(async src => {
        try { plotCache.set(src, await imgToDataUrl(src)) } catch { /* ignore */ }
      })
    )

    const plotDims = new Map<string, { w: number; h: number }>()
    for (const src of new Set([...significantWavePlotImageUrls.value, ...windPlotImageUrls.value])) {
      const dataUrl = plotCache.get(src)
      if (!dataUrl) continue
      try {
        const dim = await new Promise<{ w: number; h: number }>((resolve) => {
          const im = new Image()
          im.onload = () => resolve({ w: im.naturalWidth || im.width, h: im.naturalHeight || im.height })
          im.onerror = () => resolve({ w: 1200, h: 800 })
          im.src = dataUrl
        })
        plotDims.set(src, dim)
      } catch {
        plotDims.set(src, { w: 1200, h: 800 })
      }
    }

    async function signatureMmBox(dataUrl: string): Promise<{ w: number; h: number }> {
      const maxW = 48
      const maxH = 18
      const dim = await new Promise<{ w: number; h: number }>((resolve) => {
        const im = new Image()
        im.onload = () => resolve({ w: im.naturalWidth || 1, h: im.naturalHeight || 1 })
        im.onerror = () => resolve({ w: 1, h: 1 })
        im.src = dataUrl
      })
      const ar = dim.w / dim.h
      let w = maxW
      let h = w / ar
      if (h > maxH) {
        h = maxH
        w = h * ar
      }
      return { w, h }
    }

    /* ── Helper: header ── */
    function addHeader(startY: number): number {
      const H = 26
      pdf.setFillColor(...SL100)
      pdf.rect(0, startY, PW, H, 'F')
      pdf.setDrawColor(...SL300)
      pdf.setLineWidth(0.3)
      pdf.line(0, startY + H, PW, startY + H)
      if (logoImg) { try { pdf.addImage(logoImg, 'PNG', M, startY + 2, 14, 17) } catch { /* ignore */ } }
      const cx = PW / 2
      let ty = startY + 5
      pdf.setFont('helvetica', 'bold').setFontSize(9).setTextColor(...TEAL700)
      pdf.text('AGENCY FOR METEOROLOGY, CLIMATOLOGY, AND GEOPHYSICS', cx, ty, { align: 'center' })
      ty += 4.5
      pdf.setFontSize(8).setTextColor(...SL800)
      pdf.text(routeInfo.value.namaUpt || 'Stasiun Meteorologi Klas II Maritim Paotere Makassar', cx, ty, { align: 'center' })
      ty += 3.5
      pdf.setFont('helvetica', 'normal').setFontSize(7).setTextColor(...SL600)
      pdf.text(routeInfo.value.alamat || 'Jl. Salodong, Kel. Untia, Kec. Biringkanaya, Kota Makassar, Sulawesi Selatan (90243)', cx, ty, { align: 'center', maxWidth: CW - 30 })
      ty += 3.5
      pdf.text(`Telp: ${routeInfo.value.telp || '081242069700'} | Email: ${routeInfo.value.email || 'stamar.paotere@bmkg.go.id'}`, cx, ty, { align: 'center' })
      return startY + H + 4
    }

    /* ── Helper: document title (wrapped lines; no fill — matches on-screen preview) ── */
    function addDocTitle(y: number): number {
      const title = `En Route and Port Weather Forecast Information for ${routeInfo.value.shipName || '[Nama Kapal]'}`
      pdf.setFont('helvetica', 'bold').setFontSize(10).setTextColor(...SL900)
      const lines = pdf.splitTextToSize(title, CW - 4)
      const lh = 4.5
      let ty = y
      for (const line of lines) {
        pdf.text(line, PW / 2, ty, { align: 'center' })
        ty += lh
      }
      return y + (lines.length - 1) * lh + 6
    }

    /* ── Helper: route info block ── */
    function addRouteBlock(y: number): number {
      pdf.setDrawColor(...SL900)
      pdf.setLineWidth(0.7)
      pdf.line(M, y, M + CW, y)
      pdf.setLineWidth(0.2)
      pdf.line(M, y + 0.9, M + CW, y + 0.9)
      y += 3.5
      const lx = M + 2
      const rx = M + CW / 2 + 4
      const pairs: [string, string, number][][] = [
        [['Port of Origin', routeInfo.value.portOrigin || '\u2014', lx], ['Port of Destination', routeInfo.value.portDestination || '\u2014', rx]],
        [['Estimated Time of Departure', (formatDateTime(routeInfo.value.departureDate, routeInfo.value.departureTime) || '\u2014') + ' LT', lx], ['Estimated Time of Arrival', (formatDateTime(routeInfo.value.arrivalDate, routeInfo.value.arrivalTime) || '\u2014') + ' LT', rx]],
        [['Issued', (formatDateTime(routeInfo.value.issuedDate, routeInfo.value.issuedTime) || '\u2014') + ' LT', lx]],
      ]
      for (const row of pairs) {
        for (const [label, value, x] of row) {
          pdf.setFont('helvetica', 'bold').setFontSize(7.5).setTextColor(...SL900)
          pdf.text(label as string, x as number, y)
          pdf.setFont('helvetica', 'normal').setTextColor(...SL700)
          pdf.text(value as string, x as number, y + 3.2)
        }
        y += 8
      }
      y -= 2
      pdf.setDrawColor(...SL900)
      pdf.setLineWidth(0.2)
      pdf.line(M, y, M + CW, y)
      pdf.setLineWidth(0.7)
      pdf.line(M, y + 0.9, M + CW, y + 0.9)
      return y + 5
    }

    /* ── Helper: disclaimer at page bottom (line + comfortable gap + wrapped text) ── */
    function addDisclaimer() {
      const bottomMargin = 12
      const lineHeightMm = 4
      const gapLineToText = 6
      pdf.setFont('helvetica', 'italic').setFontSize(7).setTextColor(...SL500)
      const lines = pdf.splitTextToSize(`Disclaimer : ${disclaimer.value}`, CW)
      const n = Math.max(1, lines.length)
      const lastBaseline = PH - bottomMargin
      const firstBaseline = lastBaseline - (n - 1) * lineHeightMm
      const separatorY = firstBaseline - gapLineToText
      pdf.setDrawColor(...SL300).setLineWidth(0.2)
      pdf.line(M, separatorY, M + CW, separatorY)
      let ty = firstBaseline
      for (const line of lines) {
        pdf.text(line, M, ty)
        ty += lineHeightMm
      }
    }

    function addPlotImagesGrid(startY: number, imgs: string[]) {
      const reserveBottom = 38
      const cellGap = 2
      const gridW = (CW - cellGap) / 2
      const availableH = PH - startY - reserveBottom
      const rowH = Math.max(32, (availableH - cellGap) / 2)
      for (let i = 0; i < imgs.length; i++) {
        const col = i % 2
        const row = Math.floor(i / 2)
        const cellX = M + col * (gridW + cellGap)
        const cellY = startY + row * (rowH + cellGap)
        const srcKey = imgs[i]!
        const src = plotCache.get(srcKey) || srcKey
        const dim = plotDims.get(srcKey) || { w: 1200, h: 800 }
        const nw = dim.w
        const nh = dim.h
        const scale = Math.min(gridW / nw, rowH / nh)
        const dw = nw * scale
        const dh = nh * scale
        const ix = cellX + (gridW - dw) / 2
        const iy = cellY + (rowH - dh) / 2
        try {
          pdf.addImage(src, 'PNG', ix, iy, dw, dh)
        } catch {
          try { pdf.addImage(src, 'JPEG', ix, iy, dw, dh) } catch { /* ignore */ }
        }
      }
    }

    /* ── Helper: new page with header/title/route ── */
    function newPageWithHeader(): number {
      pdf.addPage()
      let ny = addHeader(0)
      ny = addDocTitle(ny)
      ny = addRouteBlock(ny)
      return ny
    }

    /* ── Helper: gust cell color ── */
    function gustCellColor(v: number): { fill?: RGB; text?: RGB } {
      if (v >= 34) return { fill: TH_C5, text: WHITE }
      if (v >= 28) return { fill: TH_C4, text: WHITE }
      if (v >= 22) return { fill: TH_C3, text: WHITE }
      if (v >= 17) return { fill: TH_C2, text: SL900 }
      if (v >= 11) return { fill: TH_C1, text: SL900 }
      return {}
    }

    /* ── Helper: wave height cell color ── */
    function waveCellColor(v: number): { fill?: RGB; text?: RGB } {
      if (v >= 4.0) return { fill: TH_C5, text: WHITE }
      if (v >= 2.5) return { fill: TH_C4, text: WHITE }
      if (v >= 1.25) return { fill: TH_C1, text: SL900 }
      return {}
    }

    /* ── Helper: threshold legend box ── */
    function addThresholdLegend(y: number): number {
      const boxH = 24
      pdf.setFillColor(255, 255, 255).setDrawColor(...SL300).setLineWidth(0.3)
      pdf.roundedRect(M, y, CW, boxH, 1, 1, 'FD')
      let ly = y + 3.5
      pdf.setFont('helvetica', 'normal').setFontSize(5.5).setTextColor(...SL700)
      pdf.text('NSW = No Significant Weather, FU = Smoke, FG = Fog, SL RA = Slight Rain, MOD RA = Moderate Rain, HVY RA = Heavy Rain, SHRA = Shower Rain, TSRA = Thunderstorm', M + 3, ly, { maxWidth: CW - 6 })
      ly += 6
      pdf.setFont('helvetica', 'bold').setTextColor(...SL700)
      pdf.text('Thresholds', M + 3, ly)
      pdf.text('Level', M + 3, ly + 3)
      let lx = M + 22
      pdf.text('Waves', lx, ly)
      lx += 12
      pdf.setFont('helvetica', 'normal').setTextColor(...SL600)
      for (const [label, color] of [['Moderate (1.25-2.5 m)', TH_C1], ['Rough (2.5-4.0 m)', TH_C4], ['Very Rough (>4 m)', TH_C5]] as [string, RGB][]) {
        pdf.setFillColor(...color)
        pdf.rect(lx, ly - 2, 3.5, 2.2, 'F')
        lx += 4.5
        pdf.text(label, lx, ly)
        lx += pdf.getTextWidth(label) + 2
      }
      ly += 4
      lx = M + 22
      pdf.setFont('helvetica', 'bold').setTextColor(...SL700)
      pdf.text('Winds', lx, ly)
      lx += 12
      pdf.setFont('helvetica', 'normal').setTextColor(...SL600)
      for (const [label, color] of [['Moderate (11-16 kts)', TH_C1], ['Fresh (17-21 kts)', TH_C2], ['Strong (22-27 kts)', TH_C3], ['Near Gale (28-33 kts)', TH_C4], ['Gale (>33 kts)', TH_C5]] as [string, RGB][]) {
        pdf.setFillColor(...color)
        pdf.rect(lx, ly - 2, 3.5, 2.2, 'F')
        lx += 4.5
        pdf.text(label, lx, ly)
        lx += pdf.getTextWidth(label) + 2
      }
      return y + boxH + 4
    }

    /* ── Helper: port forecast table ── */
    function addPortTable(y: number, rows: PortForecastRow[], dateLabel: string): number {
      autoTable(pdf, {
        startY: y,
        margin: { left: M, right: M },
        tableWidth: CW,
        theme: 'grid',
        styles: { fontSize: 6, cellPadding: 1.2, lineColor: BLACK, lineWidth: 0.15, halign: 'center' as const, valign: 'middle' as const, font: 'helvetica' },
        head: [
          [
            { content: 'Time', styles: { fillColor: TH1, textColor: WHITE, fontStyle: 'bold' as const } },
            { content: 'WX', styles: { fillColor: TH1, textColor: WHITE, fontStyle: 'bold' as const } },
            { content: 'Visibility', styles: { fillColor: TH1, textColor: WHITE, fontStyle: 'bold' as const } },
            { content: 'Winds', colSpan: 3, styles: { fillColor: TH1, textColor: WHITE, fontStyle: 'bold' as const } },
            { content: 'Waves', colSpan: 2, styles: { fillColor: TH1, textColor: WHITE, fontStyle: 'bold' as const } },
            { content: 'Current', colSpan: 2, styles: { fillColor: TH1, textColor: WHITE, fontStyle: 'bold' as const } },
          ],
          [
            { content: '', styles: { fillColor: TH2, textColor: WHITE } },
            { content: '', styles: { fillColor: TH2, textColor: WHITE } },
            { content: '', styles: { fillColor: TH2, textColor: WHITE } },
            { content: '10 m', colSpan: 3, styles: { fillColor: TH2, textColor: WHITE, fontStyle: 'bold' as const } },
            { content: '', colSpan: 2, styles: { fillColor: TH2, textColor: WHITE } },
            { content: 'Surface', colSpan: 2, styles: { fillColor: TH2, textColor: WHITE, fontStyle: 'bold' as const } },
          ],
          [
            { content: 'LT', styles: { fillColor: WHITE, textColor: SL900 } },
            { content: '', styles: { fillColor: WHITE, textColor: SL900 } },
            { content: '(km)', styles: { fillColor: WHITE, textColor: SL900 } },
            { content: 'Dir', styles: { fillColor: WHITE, textColor: SL900 } },
            { content: 'Spd\n(kts)', styles: { fillColor: WHITE, textColor: SL900 } },
            { content: 'Gust\n(kts)', styles: { fillColor: WHITE, textColor: SL900 } },
            { content: 'Total Wave\nDir', styles: { fillColor: WHITE, textColor: SL900 } },
            { content: 'Hsig\n(m)', styles: { fillColor: WHITE, textColor: SL900 } },
            { content: 'Dir', styles: { fillColor: WHITE, textColor: SL900 } },
            { content: 'Spd\n(cm/s)', styles: { fillColor: WHITE, textColor: SL900 } },
          ],
        ],
        body: [
          [{ content: dateLabel, colSpan: 10, styles: { fillColor: DATE_BG, fontStyle: 'bold' as const, halign: 'left' as const } }],
          ...rows.map(r => [r.time, r.wx, r.visibility, r.windDir, r.windSpd, r.windGust, r.waveDir, r.waveHsig, r.currentDir, r.currentSpd]),
        ],
        columnStyles: {
          0: { cellWidth: CW * 0.08 }, 1: { cellWidth: CW * 0.08 }, 2: { cellWidth: CW * 0.12 },
          3: { cellWidth: CW * 0.09 }, 4: { cellWidth: CW * 0.10 }, 5: { cellWidth: CW * 0.10 },
          6: { cellWidth: CW * 0.13 }, 7: { cellWidth: CW * 0.09 }, 8: { cellWidth: CW * 0.10 }, 9: { cellWidth: CW * 0.11 },
        },
        didParseCell: (data: any) => {
          if (data.section === 'body' && data.row.index > 0 && data.column.index === 5) {
            const gc = gustCellColor(parseFloat(data.cell.raw as string) || 0)
            if (gc.fill) data.cell.styles.fillColor = gc.fill
            if (gc.text) data.cell.styles.textColor = gc.text
          }
        },
      })
      return (pdf as any).lastAutoTable.finalY
    }

    /* ── Helper: en route forecast table ── */
    function addEnRouteTable(y: number, pageRows: EnRouteFlatItem[]): number {
      const bodyData: any[][] = []
      for (const item of pageRows) {
        if (item.type === 'date-header') {
          bodyData.push([{ content: item.dateLabel || '', colSpan: 10, styles: { fillColor: DATE_BG, fontStyle: 'bold' as const, halign: 'left' as const } }])
        } else if (item.row) {
          const r = item.row
          bodyData.push([r.coordinate || '\u2014', r.time, weatherAbbrev(r.weather, r.rr), r.visibility || '\u2014', r.wave, r.ws, r.wd, estimateGust(r.ws), r.aruss, r.arusd])
        }
      }
      if (!bodyData.length) {
        bodyData.push([{ content: 'Belum ada data', colSpan: 10, styles: { halign: 'center' as const, textColor: SL500 } }])
      }
      autoTable(pdf, {
        startY: y,
        margin: { left: M, right: M },
        tableWidth: CW,
        theme: 'grid',
        styles: { fontSize: 6, cellPadding: 1.2, lineColor: BLACK, lineWidth: 0.15, halign: 'center' as const, valign: 'middle' as const, font: 'helvetica' },
        head: [
          [
            { content: 'Coordinate', styles: { fillColor: TH1, textColor: WHITE, fontStyle: 'bold' as const } },
            { content: 'Time', styles: { fillColor: TH1, textColor: WHITE, fontStyle: 'bold' as const } },
            { content: 'Weather', styles: { fillColor: TH1, textColor: WHITE, fontStyle: 'bold' as const } },
            { content: 'Visibility', styles: { fillColor: TH1, textColor: WHITE, fontStyle: 'bold' as const } },
            { content: 'Wave Height', styles: { fillColor: TH1, textColor: WHITE, fontStyle: 'bold' as const } },
            { content: 'Wind Speed &\nDirection', colSpan: 2, styles: { fillColor: TH1, textColor: WHITE, fontStyle: 'bold' as const } },
            { content: 'Gust', styles: { fillColor: TH1, textColor: WHITE, fontStyle: 'bold' as const } },
            { content: 'Current Speed &\nDirection', colSpan: 2, styles: { fillColor: TH1, textColor: WHITE, fontStyle: 'bold' as const } },
          ],
          [
            { content: '', styles: { fillColor: TH2, textColor: WHITE } },
            { content: '', styles: { fillColor: TH2, textColor: WHITE } },
            { content: '', styles: { fillColor: TH2, textColor: WHITE } },
            { content: '', styles: { fillColor: TH2, textColor: WHITE } },
            { content: '', styles: { fillColor: TH2, textColor: WHITE } },
            { content: '(kt)', colSpan: 2, styles: { fillColor: TH2, textColor: WHITE, fontStyle: 'bold' as const } },
            { content: '', styles: { fillColor: TH2, textColor: WHITE } },
            { content: '(cm/s)', colSpan: 2, styles: { fillColor: TH2, textColor: WHITE, fontStyle: 'bold' as const } },
          ],
          [
            { content: '', styles: { fillColor: WHITE, textColor: SL900 } },
            { content: '(LT)', styles: { fillColor: WHITE, textColor: SL900 } },
            { content: '', styles: { fillColor: WHITE, textColor: SL900 } },
            { content: '(km)', styles: { fillColor: WHITE, textColor: SL900 } },
            { content: '(m)', styles: { fillColor: WHITE, textColor: SL900 } },
            { content: 'Spd', styles: { fillColor: WHITE, textColor: SL900 } },
            { content: 'Dir', styles: { fillColor: WHITE, textColor: SL900 } },
            { content: '(kt)', styles: { fillColor: WHITE, textColor: SL900 } },
            { content: 'Spd', styles: { fillColor: WHITE, textColor: SL900 } },
            { content: 'Dir', styles: { fillColor: WHITE, textColor: SL900 } },
          ],
        ],
        body: bodyData,
        columnStyles: {
          0: { cellWidth: CW * 0.17, halign: 'left' as const },
          1: { cellWidth: CW * 0.08 }, 2: { cellWidth: CW * 0.09 }, 3: { cellWidth: CW * 0.10 },
          4: { cellWidth: CW * 0.10 }, 5: { cellWidth: CW * 0.09 }, 6: { cellWidth: CW * 0.09 },
          7: { cellWidth: CW * 0.08 }, 8: { cellWidth: CW * 0.10 }, 9: { cellWidth: CW * 0.10 },
        },
        didParseCell: (data: any) => {
          if (data.section !== 'body') return
          const raw = data.cell.raw as string
          if (data.column.index === 4 && raw) {
            const wc = waveCellColor(parseFloat(raw) || 0)
            if (wc.fill) data.cell.styles.fillColor = wc.fill
            if (wc.text) data.cell.styles.textColor = wc.text
          }
          if (data.column.index === 7 && raw) {
            const gc = gustCellColor(parseFloat(raw) || 0)
            if (gc.fill) data.cell.styles.fillColor = gc.fill
            if (gc.text) data.cell.styles.textColor = gc.text
          }
        },
      })
      return (pdf as any).lastAutoTable.finalY
    }

    /* ═══════════════════════════════════════
       PAGE 1 — Overview
       ═══════════════════════════════════════ */
    let y = addHeader(0)
    y = addDocTitle(y)
    y = addRouteBlock(y)

    pdf.setFont('helvetica', 'bold').setFontSize(8.5).setTextColor(...SL900)
    pdf.text('Meteorological Situation', M, y)
    const msW = pdf.getTextWidth('Meteorological Situation')
    pdf.setDrawColor(...SL900).setLineWidth(0.3)
    pdf.line(M, y + 0.5, M + msW, y + 0.5)
    y += 4
    pdf.setFont('helvetica', 'normal').setFontSize(7.5).setTextColor(...SL800)
    const synLines = pdf.splitTextToSize(synopticInfo.value || '\u2014', CW)
    pdf.text(synLines, M, y)
    y += synLines.length * 3 + 3
    pdf.setDrawColor(...SL300).setLineWidth(0.2)
    pdf.line(M, y, M + CW, y)
    y += 4

    pdf.setFont('helvetica', 'bold').setFontSize(8.5).setTextColor(...SL900)
    pdf.text('Warnings', M, y)
    y += 4
    const warnText = warnings.value || '\u2014'
    pdf.setFont('helvetica', 'normal').setFontSize(7.5)
    const warnLines = pdf.splitTextToSize(warnText, CW - 4)
    const warnH = warnLines.length * 3 + 2
    pdf.setFillColor(...YEL200)
    pdf.rect(M, y - 2.5, CW, warnH, 'F')
    pdf.setTextColor(...SL800)
    pdf.text(warnLines, M + 2, y)
    y += warnH + 2

    pdf.setFont('helvetica', 'bold').setFontSize(7.5).setTextColor(...SL800)
    const cyLabel = 'Cyclone Warning'
    pdf.text(cyLabel, M, y)
    const cyW = pdf.getTextWidth(cyLabel)
    pdf.setFont('helvetica', 'normal')
    pdf.text(` : ${cycloneWarning.value || 'No Tropical Cyclone (TC) and Tropical Storms (TS).'}`, M + cyW, y, { maxWidth: CW - cyW })
    y += 5
    pdf.setDrawColor(...SL300).setLineWidth(0.2)
    pdf.line(M, y, M + CW, y)
    y += 3

    if (mapImg) {
      const mapH = 55
      pdf.setDrawColor(...SL300).setLineWidth(0.3)
      pdf.rect(M, y, CW, mapH, 'S')
      try { pdf.addImage(mapImg, 'PNG', M + 0.3, y + 0.3, CW - 0.6, mapH - 0.6) } catch { /* ignore */ }
      y += mapH + 2
    }

    pdf.setFontSize(5.5).setFont('helvetica', 'bold').setTextColor(...SL600)
    let lx = M
    pdf.text('Tinggi Gelombang (m):', lx, y)
    lx += pdf.getTextWidth('Tinggi Gelombang (m):') + 2
    pdf.setFont('helvetica', 'normal')
    for (const [label, c] of [['<=0.5', [22, 163, 74]], ['0.5-1.25', [96, 165, 250]], ['1.25-2.5', [250, 204, 21]], ['2.5-4.0', [249, 115, 22]], ['4.0-6.0', [239, 68, 68]], ['6.0-9.0', [107, 33, 168]], ['>9.0', [31, 41, 55]]] as [string, number[]][]) {
      pdf.setFillColor(c[0]!, c[1]!, c[2]!)
      pdf.rect(lx, y - 1.8, 4, 2, 'F')
      lx += 5
      pdf.setTextColor(...SL600)
      pdf.text(label, lx, y)
      lx += pdf.getTextWidth(label) + 1.5
    }
    y += 5

    pdf.setFont('helvetica', 'bold').setFontSize(8.5).setTextColor(...SL900)
    pdf.text('Meteogram', M, y)
    const mgTW = pdf.getTextWidth('Meteogram')
    pdf.setDrawColor(...SL900).setLineWidth(0.3)
    pdf.line(M, y + 0.5, M + mgTW, y + 0.5)
    y += 3
    if (meteogramImg) {
      const mgH = Math.round(CW * chartHeight / chartWidth)
      try { pdf.addImage(meteogramImg, 'PNG', M, y, CW, mgH) } catch { /* ignore */ }
      y += mgH + 2
      const legCx = PW / 2
      pdf.setFontSize(6)
      const visLineX = legCx - 30
      pdf.setDrawColor(253, 164, 175).setLineWidth(0.5)
      pdf.line(visLineX, y - 1, visLineX + 8, y - 1)
      pdf.setFont('helvetica', 'normal').setTextColor(...SL800)
      pdf.text('Visibility', visLineX + 10, y)
      const wsLineX = legCx + 10
      pdf.setDrawColor(39, 121, 253).setLineWidth(0.5)
      pdf.line(wsLineX, y - 1, wsLineX + 8, y - 1)
      pdf.text('Wind Speed', wsLineX + 10, y)
      y += 3
    }
    addDisclaimer()

    /* ═══════════════════════════════════════
       PAGE 2 — Port Forecast
       ═══════════════════════════════════════ */
    y = newPageWithHeader()
    pdf.setFont('helvetica', 'bold').setFontSize(9).setTextColor(...SL900)
    pdf.text('Port Forecast', PW / 2, y, { align: 'center' })
    y += 5
    y = addThresholdLegend(y)

    pdf.setFont('helvetica', 'bold').setFontSize(8).setTextColor(...SL900)
    pdf.text('Port of Origin', M, y)
    y += 3
    y = addPortTable(y, portOriginForecast.value, portOriginDateLabel.value)
    y += 4

    pdf.setFont('helvetica', 'bold').setFontSize(8).setTextColor(...SL900)
    pdf.text('Port of Destination', M, y)
    y += 3
    y = addPortTable(y, portDestForecast.value, portDestDateLabel.value)
    y += 5

    pdf.setFont('helvetica', 'bold').setFontSize(8.5).setTextColor(...SL900)
    pdf.text('Safety Advisory', M, y)
    y += 4
    pdf.setFont('helvetica', 'normal').setFontSize(7.5).setTextColor(...SL800)
    pdf.text('The following conditions may pose risks to navigation safety:', M, y)
    y += 4.5
    const safetyItems = [
      { bold: 'Fishing vessels', rest: ' when wind speed reaches 15 knots and wave height reaches 1.25 meters.' },
      { bold: 'Barges', rest: ' when wind speed reaches 16 knots and wave height reaches 1.5 meters.' },
      { bold: 'Ferry', rest: ' vessels when wind speed reaches 21 knots and wave height reaches 2.5 meters.' },
      { bold: 'Large vessels', rest: ' (Cargo/Cruise ships) when wind speed reaches 27 knots and wave height reaches 4.0 meters.' },
    ]
    for (const item of safetyItems) {
      pdf.setFont('helvetica', 'normal').setTextColor(...SL800)
      pdf.text('\u2022', M + 2, y)
      pdf.setFont('helvetica', 'bold')
      pdf.text(item.bold, M + 5, y)
      const bw = pdf.getTextWidth(item.bold)
      pdf.setFont('helvetica', 'normal')
      pdf.text(item.rest, M + 5 + bw, y, { maxWidth: CW - 7 - bw })
      y += 4
    }
    addDisclaimer()

    /* ═══════════════════════════════════════
       PAGE 3+ — En Route Forecast
       ═══════════════════════════════════════ */
    const erPages = enRoutePages.value
    for (let pi = 0; pi < erPages.length; pi++) {
      y = newPageWithHeader()
      pdf.setFont('helvetica', 'bold').setFontSize(9).setTextColor(...SL900)
      pdf.text(pi === 0 ? 'En route Forecast' : 'En route Forecast (continued)', PW / 2, y, { align: 'center' })
      y += 5
      if (pi === 0) y = addThresholdLegend(y)
      y = addEnRouteTable(y, erPages[pi]!)
      if (pi === erPages.length - 1) {
        y += 10
        pdf.setFont('helvetica', 'normal').setFontSize(8.5).setTextColor(...SL800)
        const dutyY = y
        const rightEdge = PW - M - 5
        const colW = 48
        const colCx = rightEdge - colW / 2
        pdf.text('Forecaster on Duty', colCx, dutyY, { align: 'center', maxWidth: colW })
        y = dutyY + 4
        const sigUrl = routeInfo.value.signatureImageDataUrl
        if (sigUrl) {
          try {
            const { w: sigW, h: sigH } = await signatureMmBox(sigUrl)
            pdf.addImage(sigUrl, 'PNG', colCx - sigW / 2, y, sigW, sigH)
            y += sigH + 3
          } catch {
            y = dutyY + 18
          }
        } else {
          y = dutyY + 18
        }
        pdf.setFont('helvetica', 'bold').setFontSize(8.5).setTextColor(...SL900)
        const nameLines = pdf.splitTextToSize(`(${routeInfo.value.forecaster || '\u2014'})`, colW)
        let nameY = y
        for (const line of nameLines) {
          pdf.text(line, colCx, nameY, { align: 'center' })
          nameY += 4
        }
        y = nameY
      }
      addDisclaimer()
    }

    /* ═══════════════════════════════════════
       Significant Wave Height pages
       ═══════════════════════════════════════ */
    for (let pi = 0; pi < wavePlotPages.value.length; pi++) {
      y = newPageWithHeader()
      pdf.setFont('helvetica', 'bold').setFontSize(9).setTextColor(...SL900)
      pdf.text('Significant Wave Height', PW / 2, y, { align: 'center' })
      y += 5
      addPlotImagesGrid(y, wavePlotPages.value[pi]!)
      addDisclaimer()
    }

    /* ═══════════════════════════════════════
       Wind pages
       ═══════════════════════════════════════ */
    for (let pi = 0; pi < windPlotPages.value.length; pi++) {
      y = newPageWithHeader()
      pdf.setFont('helvetica', 'bold').setFontSize(9).setTextColor(...SL900)
      pdf.text('Wind', PW / 2, y, { align: 'center' })
      y += 5
      addPlotImagesGrid(y, windPlotPages.value[pi]!)
      addDisclaimer()
    }

    /* ── Save ── */
    const filename = `rute-pelayaran-${(routeInfo.value.shipName || 'report').replace(/[^a-zA-Z0-9-_]/g, '_')}.pdf`
    pdf.save(filename)
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

.port-table-title {
  font-size: 12px;
  font-weight: 700;
  margin: 0 0 6px 0;
  color: #0f172a;
}

.port-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  font-size: 9px;
  line-height: 1.3;
}

.port-thead-row1 {
  background: #1e2b4a;
  color: #ffffff;
}

.port-thead-row2 {
  background: #2d3f65;
  color: #ffffff;
}

.port-thead-row3 {
  background: #ffffff;
  color: #1e293b;
}

.port-th {
  padding: 4px;
  text-align: center;
  font-weight: 600;
  font-size: 9px;
  line-height: 1.3;
}

.port-th-border {
  border: 1px solid #000000;
}

.port-th-border-light {
  border: 1px solid #000000;
}

.port-date-row {
  background: #dbeafe;
}

.port-data-row {
  background: #ffffff;
}

.port-td {
  padding: 4px;
  font-size: 9px;
  line-height: 1.3;
}

.port-td-border {
  border: 1px solid #000000;
}

/* Route rules — aligned with jsPDF (top = thick+thin, bottom = thin+thick) */
.pdf-rule-double-top,
.pdf-rule-double-bottom {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.pdf-rule-thick {
  height: 2px;
  background-color: rgb(15 23 42);
  flex-shrink: 0;
}

.pdf-rule-thin {
  height: 1px;
  background-color: rgb(15 23 42);
  flex-shrink: 0;
}

.pdf-rule-gap {
  height: 2px;
  flex-shrink: 0;
}
</style>
