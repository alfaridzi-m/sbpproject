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
            width="70"
            height="88"
          />
          <div class="flex-1 text-center">
            <p class="text-[0.875rem] font-bold m-0 mb-0.5 text-teal-700 tracking-wide">AGENCY FOR METEOROLOGY, CLIMATOLOGY, AND GEOPHYSICS</p>
            <p class="text-[0.75rem] font-semibold m-0 mb-0.5 text-slate-800">Stasiun Meteorologi Klas II Maritim Paotere Makassar</p>
            <p class="text-[0.6875rem] m-0 mb-0.5 text-slate-600">Jl. Salodong, Kel. Untia, Kec. Biringkanaya, Kota Makassar, Sulawesi Selatan (90243)</p>
            <p class="text-[0.6875rem] m-0 text-slate-600">Telp: 081242069700 | Email: stamar.paotere@bmkg.go.id</p>
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
          <div class="border-b-[3px] border-double border-slate-900 mb-3" />
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
            <div>
              <p class="m-0 font-bold text-[0.75rem] text-slate-900 leading-tight">Forecaster</p>
              <p class="m-0 text-[0.75rem] text-slate-700 leading-tight">{{ routeInfo.forecaster || '—' }}</p>
            </div>
          </div>
          <div class="border-b-[3px] border-double border-slate-900 mt-3" />
        </div>

        <!-- 4. METEOROLOGICAL SITUATION -->
        <div class="mb-1 pb-3 border-b border-slate-300 pdf-avoid-split">
          <h3 class="text-[0.8125rem] font-bold m-0 mb-1.5 text-slate-900 underline">Meteorological Situation</h3>
          <p class="m-0 text-[0.75rem] leading-relaxed text-slate-800">{{ synopticInfo || '—' }}</p>
        </div>

        <!-- 5. WARNINGS -->
        <div class="mb-1 pb-3 border-b border-slate-300 pdf-avoid-split">
          <h3 class="text-[0.8125rem] font-bold m-0 mb-1.5 text-slate-900">Warnings</h3>
          <p class="m-0 text-[0.75rem] leading-relaxed">
            <span class="bg-yellow-200 px-1 py-0.5">{{ warnings || '—' }}</span>
          </p>
          <p class="m-0 text-[0.75rem] leading-relaxed text-slate-800 mt-1.5">
            <span class="font-bold">Cyclone Warning</span> : {{ cycloneWarning || 'No Tropical Cyclone (TC) and Tropical Storms (TS).' }}
          </p>
        </div>

        <!-- 6. ROUTE MAP -->
        <div class="mb-4 pdf-avoid-split">
          <div class="border border-slate-300 rounded overflow-hidden bg-slate-50">
            <div ref="mapContainerRef" class="w-full h-[220px]" />
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
          <div class="border border-slate-300 rounded p-1 bg-white text-xs">
            <svg
              class="w-full h-auto block"
              :viewBox="`0 0 ${chartWidth} ${chartHeight}`"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <linearGradient id="tempGradRute" x1="0" x2="0" y1="1" y2="0">
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
              <polyline v-if="tempPath" :points="tempPath" fill="none" stroke="url(#tempGradRute)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path v-if="windPath" :d="windPath" fill="none" stroke="#2779FD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <g v-for="(pt, i) in windPoints" :key="'pt' + i">
                <rect :x="pt.x - 2.5" :y="pt.y - 2.5" width="5" height="5" fill="#2779FD" />
              </g>
              <!-- Y-AXIS LEFT (Temperature) -->
              <text :x="marginLeft - 4" :y="marginTop + chartAreaH / 2" text-anchor="middle" font-size="6" fill="#64748b" :transform="`rotate(-90,${marginLeft - 4},${marginTop + chartAreaH / 2})`">Temperature (°C)</text>
              <text v-for="(t, i) in [35, 30, 25, 20, 15, 10, 5, 0]" :key="'ty' + i" :x="marginLeft - 6" :y="marginTop + i * chartAreaH / 7 + 2.5" text-anchor="end" font-size="6" fill="#64748b">{{ t }}</text>
              <!-- Y-AXIS RIGHT (Wind Speed) -->
              <text :x="marginLeft + chartAreaW + 22" :y="marginTop + chartAreaH / 2" text-anchor="middle" font-size="6" fill="#64748b" :transform="`rotate(90,${marginLeft + chartAreaW + 22},${marginTop + chartAreaH / 2})`">Wind Speed (kts)</text>
              <text v-for="(w, i) in [14, 12, 10, 8, 6, 4, 2, 0]" :key="'wy' + i" :x="marginLeft + chartAreaW + 8" :y="marginTop + i * chartAreaH / 7 + 2.5" text-anchor="start" font-size="6" fill="#64748b">{{ w }}</text>
              <!-- WIND DIRECTION ARROWS (at 0-axis) -->
              <g class="meteogram-wind-arrows">
                <g v-for="(row, i) in meteogramRows" :key="'wa' + row.id" :transform="`translate(${marginLeft + (i + 0.5) * (chartAreaW / meteogramRows.length)},${marginTop + chartAreaH + 9}) rotate(${windDirectionAngle(row.wd)})`">
                  <path d="M0,-5 L-2,4 L0,1.5 L2,4 Z" fill="#1e293b" stroke="#1e293b" stroke-width="0.5" />
                </g>
              </g>
            </svg>
            <div class="flex gap-6 pt-1 border-t border-slate-200 text-xs justify-center">
              <span class="flex items-center gap-2"><span class="inline-block w-6 h-0.5 rounded bg-gradient-to-r from-[#fda4af] to-[#f43f5e]" /> Temperature</span>
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
          <img :src="bmkgLogoUrl" alt="BMKG Logo" class="bmkg-logo shrink-0 object-contain" width="70" height="88" />
          <div class="flex-1 text-center">
            <p class="text-[0.875rem] font-bold m-0 mb-0.5 text-teal-700 tracking-wide">AGENCY FOR METEOROLOGY, CLIMATOLOGY, AND GEOPHYSICS</p>
            <p class="text-[0.75rem] font-semibold m-0 mb-0.5 text-slate-800">Stasiun Meteorologi Klas II Maritim Paotere Makassar</p>
            <p class="text-[0.6875rem] m-0 mb-0.5 text-slate-600">Jl. Salodong, Kel. Untia, Kec. Biringkanaya, Kota Makassar, Sulawesi Selatan (90243)</p>
            <p class="text-[0.6875rem] m-0 text-slate-600">Telp: 081242069700 | Email: stamar.paotere@bmkg.go.id</p>
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
          <div class="border-b-[3px] border-double border-slate-900 mb-3" />
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
            <div>
              <p class="m-0 font-bold text-[0.75rem] text-slate-900 leading-tight">Forecaster</p>
              <p class="m-0 text-[0.75rem] text-slate-700 leading-tight">{{ routeInfo.forecaster || '—' }}</p>
            </div>
          </div>
          <div class="border-b-[3px] border-double border-slate-900 mt-3" />
        </div>

        <!-- 4. PORT FORECAST TITLE -->
        <h2 class="text-center text-[0.875rem] font-bold m-0 mb-3 text-slate-900">Port Forecast</h2>

        <!-- 5. THRESHOLD LEVEL LEGEND -->
        <div class="mb-4 text-[0.5625rem] leading-relaxed text-slate-600 border border-slate-300 rounded p-2.5 pdf-avoid-split">
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
                <span class="flex items-center gap-0.5"><span class="inline-block w-3.5 h-2.5 bg-yellow-300 border border-yellow-400" /> Moderate (1.25-2.5 m)</span>
                <span class="flex items-center gap-0.5"><span class="inline-block w-3.5 h-2.5 bg-purple-400 border border-purple-500" /> Rough (2.5-4.0 m)</span>
                <span class="flex items-center gap-0.5"><span class="inline-block w-3.5 h-2.5 bg-blue-900 border border-blue-950" /> Very Rough (&gt;4 m)</span>
              </div>
              <div class="flex items-center gap-2 flex-wrap">
                <span class="font-semibold text-slate-700 w-10">Winds</span>
                <span class="flex items-center gap-0.5"><span class="inline-block w-3.5 h-2.5 bg-slate-200 border border-slate-300" /> Moderate (11-16 kts)</span>
                <span class="flex items-center gap-0.5"><span class="inline-block w-3.5 h-2.5 bg-yellow-300 border border-yellow-400" /> Fresh (17-21 kts)</span>
                <span class="flex items-center gap-0.5"><span class="inline-block w-3.5 h-2.5 bg-purple-400 border border-purple-500" /> Strong (22-27 kts)</span>
                <span class="flex items-center gap-0.5"><span class="inline-block w-3.5 h-2.5 bg-blue-900 border border-blue-950" /> Near Gale (28-33 kts)</span>
                <span class="flex items-center gap-0.5"><span class="inline-block w-3.5 h-2.5 bg-slate-900 border border-slate-950" /> Gale (&gt;33 kts)</span>
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
          <img :src="bmkgLogoUrl" alt="BMKG Logo" class="bmkg-logo shrink-0 object-contain" width="70" height="88" />
          <div class="flex-1 text-center">
            <p class="text-[0.875rem] font-bold m-0 mb-0.5 text-teal-700 tracking-wide">AGENCY FOR METEOROLOGY, CLIMATOLOGY, AND GEOPHYSICS</p>
            <p class="text-[0.75rem] font-semibold m-0 mb-0.5 text-slate-800">Stasiun Meteorologi Klas II Maritim Paotere Makassar</p>
            <p class="text-[0.6875rem] m-0 mb-0.5 text-slate-600">Jl. Salodong, Kel. Untia, Kec. Biringkanaya, Kota Makassar, Sulawesi Selatan (90243)</p>
            <p class="text-[0.6875rem] m-0 text-slate-600">Telp: 081242069700 | Email: stamar.paotere@bmkg.go.id</p>
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
          <div class="border-b-[3px] border-double border-slate-900 mb-3" />
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
            <div>
              <p class="m-0 font-bold text-[0.75rem] text-slate-900 leading-tight">Forecaster</p>
              <p class="m-0 text-[0.75rem] text-slate-700 leading-tight">{{ routeInfo.forecaster || '—' }}</p>
            </div>
          </div>
          <div class="border-b-[3px] border-double border-slate-900 mt-3" />
        </div>

        <!-- 4. EN ROUTE FORECAST TITLE -->
        <h2 class="text-center text-[0.875rem] font-bold m-0 mb-3 text-slate-900">
          En route Forecast<template v-if="pageIdx > 0"> (continued)</template>
        </h2>

        <!-- THRESHOLD LEVEL LEGEND (first forecast page only) -->
        <div v-if="pageIdx === 0" class="mb-4 text-[0.5625rem] leading-relaxed text-slate-600 border border-slate-300 rounded p-2.5 pdf-avoid-split">
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
                <span class="flex items-center gap-0.5"><span class="inline-block w-3.5 h-2.5 bg-yellow-300 border border-yellow-400" /> Moderate (1.25-2.5 m)</span>
                <span class="flex items-center gap-0.5"><span class="inline-block w-3.5 h-2.5 bg-purple-400 border border-purple-500" /> Rough (2.5-4.0 m)</span>
                <span class="flex items-center gap-0.5"><span class="inline-block w-3.5 h-2.5 bg-blue-900 border border-blue-950" /> Very Rough (&gt;4 m)</span>
              </div>
              <div class="flex items-center gap-2 flex-wrap">
                <span class="font-semibold text-slate-700 w-10">Winds</span>
                <span class="flex items-center gap-0.5"><span class="inline-block w-3.5 h-2.5 bg-slate-200 border border-slate-300" /> Moderate (11-16 kts)</span>
                <span class="flex items-center gap-0.5"><span class="inline-block w-3.5 h-2.5 bg-yellow-300 border border-yellow-400" /> Fresh (17-21 kts)</span>
                <span class="flex items-center gap-0.5"><span class="inline-block w-3.5 h-2.5 bg-purple-400 border border-purple-500" /> Strong (22-27 kts)</span>
                <span class="flex items-center gap-0.5"><span class="inline-block w-3.5 h-2.5 bg-blue-900 border border-blue-950" /> Near Gale (28-33 kts)</span>
                <span class="flex items-center gap-0.5"><span class="inline-block w-3.5 h-2.5 bg-slate-900 border border-slate-950" /> Gale (&gt;33 kts)</span>
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
        <div v-if="pageIdx === enRoutePages.length - 1" class="mt-8 text-right pr-4 pdf-avoid-split">
          <p class="m-0 text-[0.8125rem] text-slate-800">Forecaster on Duty</p>
          <div class="mt-16">
            <p class="m-0 text-[0.8125rem] font-semibold text-slate-900">({{ routeInfo.forecaster || '—' }})</p>
          </div>
        </div>

        <!-- DISCLAIMER (pinned bottom — appears on every page) -->
        <div class="mt-auto pt-3 border-t border-slate-200 pdf-avoid-split">
          <p class="m-0 text-[0.6875rem] italic text-slate-500">Disclaimer : {{ disclaimer }}</p>
        </div>
      </div>

      <!-- ========== PAGE 4 — Significant Wave Height ========== -->
      <div class="pdf-page pdf-page-start px-8 pb-8 pt-0 flex flex-col">
        <!-- HEADER -->
        <header class="flex items-center gap-4 -mx-8 px-8 py-3 mb-4 border-b border-slate-300 bg-slate-100">
          <img :src="bmkgLogoUrl" alt="BMKG Logo" class="bmkg-logo shrink-0 object-contain" width="70" height="88" />
          <div class="flex-1 text-center">
            <p class="text-[0.875rem] font-bold m-0 mb-0.5 text-teal-700 tracking-wide">AGENCY FOR METEOROLOGY, CLIMATOLOGY, AND GEOPHYSICS</p>
            <p class="text-[0.75rem] font-semibold m-0 mb-0.5 text-slate-800">Stasiun Meteorologi Klas II Maritim Paotere Makassar</p>
            <p class="text-[0.6875rem] m-0 mb-0.5 text-slate-600">Jl. Salodong, Kel. Untia, Kec. Biringkanaya, Kota Makassar, Sulawesi Selatan (90243)</p>
            <p class="text-[0.6875rem] m-0 text-slate-600">Telp: 081242069700 | Email: stamar.paotere@bmkg.go.id</p>
          </div>
        </header>

        <!-- DOCUMENT TITLE -->
        <div class="text-center mb-1">
          <h1 class="text-[0.9375rem] font-bold m-0 text-slate-900">
            En Route and Port Weather Forecast Information for {{ routeInfo.shipName || '[Nama Kapal]' }}
          </h1>
        </div>

        <!-- ROUTE INFO -->
        <div class="mb-5 pdf-avoid-split">
          <div class="border-b-[3px] border-double border-slate-900 mb-3" />
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
            <div>
              <p class="m-0 font-bold text-[0.75rem] text-slate-900 leading-tight">Forecaster</p>
              <p class="m-0 text-[0.75rem] text-slate-700 leading-tight">{{ routeInfo.forecaster || '—' }}</p>
            </div>
          </div>
          <div class="border-b-[3px] border-double border-slate-900 mt-3" />
        </div>

        <!-- PLOT IMAGES — Significant Wave Height -->
        <div class="grid grid-cols-2 gap-3 pdf-avoid-split">
          <div class="border border-slate-300 rounded overflow-hidden">
            <img src="/image.png" alt="Significant Wave Height and Direction" class="w-full h-auto block" />
          </div>
          <div class="border border-slate-300 rounded overflow-hidden">
            <img src="/image2.png" alt="Primary Swell Height and Direction" class="w-full h-auto block" />
          </div>
        </div>

        <!-- DISCLAIMER (pinned bottom) -->
        <div class="mt-auto pt-3 border-t border-slate-200 pdf-avoid-split">
          <p class="m-0 text-[0.6875rem] italic text-slate-500">Disclaimer : {{ disclaimer }}</p>
        </div>
      </div>

      <!-- ========== PAGE 5 — Wind ========== -->
      <div class="pdf-page pdf-page-start px-8 pb-8 pt-0 flex flex-col">
        <!-- HEADER -->
        <header class="flex items-center gap-4 -mx-8 px-8 py-3 mb-4 border-b border-slate-300 bg-slate-100">
          <img :src="bmkgLogoUrl" alt="BMKG Logo" class="bmkg-logo shrink-0 object-contain" width="70" height="88" />
          <div class="flex-1 text-center">
            <p class="text-[0.875rem] font-bold m-0 mb-0.5 text-teal-700 tracking-wide">AGENCY FOR METEOROLOGY, CLIMATOLOGY, AND GEOPHYSICS</p>
            <p class="text-[0.75rem] font-semibold m-0 mb-0.5 text-slate-800">Stasiun Meteorologi Klas II Maritim Paotere Makassar</p>
            <p class="text-[0.6875rem] m-0 mb-0.5 text-slate-600">Jl. Salodong, Kel. Untia, Kec. Biringkanaya, Kota Makassar, Sulawesi Selatan (90243)</p>
            <p class="text-[0.6875rem] m-0 text-slate-600">Telp: 081242069700 | Email: stamar.paotere@bmkg.go.id</p>
          </div>
        </header>

        <!-- DOCUMENT TITLE -->
        <div class="text-center mb-1">
          <h1 class="text-[0.9375rem] font-bold m-0 text-slate-900">
            En Route and Port Weather Forecast Information for {{ routeInfo.shipName || '[Nama Kapal]' }}
          </h1>
        </div>

        <!-- ROUTE INFO -->
        <div class="mb-5 pdf-avoid-split">
          <div class="border-b-[3px] border-double border-slate-900 mb-3" />
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
            <div>
              <p class="m-0 font-bold text-[0.75rem] text-slate-900 leading-tight">Forecaster</p>
              <p class="m-0 text-[0.75rem] text-slate-700 leading-tight">{{ routeInfo.forecaster || '—' }}</p>
            </div>
          </div>
          <div class="border-b-[3px] border-double border-slate-900 mt-3" />
        </div>

        <!-- PLOT IMAGES — Wind -->
        <div class="grid grid-cols-2 gap-3 pdf-avoid-split">
          <div class="border border-slate-300 rounded overflow-hidden">
            <img src="/image.png" alt="Wind Speed and Direction Plot 1" class="w-full h-auto block" />
          </div>
          <div class="border border-slate-300 rounded overflow-hidden">
            <img src="/image2.png" alt="Wind Speed and Direction Plot 2" class="w-full h-auto block" />
          </div>
        </div>

        <!-- DISCLAIMER (pinned bottom) -->
        <div class="mt-auto pt-3 border-t border-slate-200 pdf-avoid-split">
          <p class="m-0 text-[0.6875rem] italic text-slate-500">Disclaimer : {{ disclaimer }}</p>
        </div>
      </div>
    </div>

    <div class="flex justify-end mt-4">
      <button
        type="button"
        class="py-2 px-5 bg-[var(--primary)] text-white border-none rounded-lg text-sm font-medium cursor-pointer shadow-md transition-[opacity,box-shadow] duration-200 hover:opacity-95 hover:shadow-[0_6px_20px_rgba(1,167,62,0.35)] disabled:opacity-60 disabled:shadow-none"
        :disabled="isDownloading"
        @click="downloadPdf"
      >
        {{ isDownloading ? 'Mengunduh...' : 'Download pdf' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const { routeInfo, forecastData, synopticInfo, warnings, cycloneWarning, disclaimer, safetyAdvisory, manualRouteData, availableRoutes, selectedRouteId } = useMaritimeData()
const bmkgLogoUrl = useBmkgLogoUrl()

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

const meteogramRows = computed(() => forecastData.value.filter(r => r.date || r.time))

const tempPath = computed(() => {
  const rows = meteogramRows.value
  if (!rows.length) return ''
  return rows.map((r, i) => {
    const temp = parseFloat(r.temp || '0') || 25
    const x = marginLeft + (i + 0.5) * (chartAreaW / rows.length)
    const y = marginTop + (1 - temp / 35) * chartAreaH
    return `${x},${y}`
  }).join(' ')
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

function windDirectionAngle(wd: string): number {
  const dirMap: Record<string, number> = { N: 180, NNE: 202.5, NE: 225, ENE: 247.5, E: 270, ESE: 292.5, SE: 315, SSE: 337.5, S: 0, SSW: 22.5, SW: 45, WSW: 67.5, W: 90, WNW: 112.5, NW: 135, NNW: 157.5 }
  return dirMap[wd?.toUpperCase()] ?? 0
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

function formatFullDate(dateStr: string): string {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  const dayName = d.toLocaleDateString('en-US', { weekday: 'long' })
  const day = d.getDate()
  const month = d.toLocaleDateString('en-US', { month: 'long' })
  const year = d.getFullYear()
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
  if (v >= 34) return 'bg-slate-900 text-white'
  if (v >= 28) return 'bg-blue-900 text-white'
  if (v >= 22) return 'bg-purple-400 text-white'
  if (v >= 17) return 'bg-yellow-300'
  if (v >= 15) return 'bg-purple-400 text-white'
  if (v >= 11) return 'bg-yellow-300'
  return ''
}

// --- Page 3: En Route Forecast helpers ---
function weatherAbbrev(weather: string, rr: string): string {
  const w = (weather || '').toLowerCase()
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
  if (v >= 4.0) return 'bg-purple-700 text-white'
  if (v >= 2.5) return 'bg-purple-400 text-white'
  if (v >= 1.25) return 'bg-yellow-300'
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
    return new Date(year, month, day)
  }
  return null
}

function formatRouteDate(dateStr: string): string {
  const d = parseRouteDate(dateStr)
  if (!d) return dateStr || '—'
  const dayName = d.toLocaleDateString('en-US', { weekday: 'long' })
  const day = d.getDate()
  const month = d.toLocaleDateString('en-US', { month: 'long' })
  const year = d.getFullYear()
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
  const geoJson: GeoJSON.FeatureCollection = {
    type: 'FeatureCollection',
    features: [{
      type: 'Feature',
      properties: {},
      geometry: { type: 'LineString', coordinates: coords }
    }]
  }

  routeLayer = Leaflet.geoJSON(geoJson as never, {
    style: { color: '#ef4444', weight: 3, opacity: 0.9, dashArray: '8 4' }
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

onMounted(async () => {
  const el = mapContainerRef.value
  if (!el) return
  const Leaflet = (await import('leaflet')).default

  try {
    map = Leaflet.map(el, { preferCanvas: true, zoomControl: false, attributionControl: false }).setView([2.3, 125], 6)
    Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map)

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

watch([manualRouteData, availableRoutes, selectedRouteId], async () => {
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

    const html2canvas = (await import('html2canvas')).default
    const { jsPDF } = await import('jspdf')

    const filename = `rute-pelayaran-${(routeInfo.value.shipName || 'report').replace(/[^a-zA-Z0-9-_]/g, '_')}.pdf`
    const pages = el.querySelectorAll<HTMLElement>('.pdf-page')
    if (!pages.length) return

    const A4_W = 210
    const A4_H = 297

    const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait', compress: true })

    for (let i = 0; i < pages.length; i++) {
      if (i > 0) pdf.addPage()

      const page = pages[i]!
      const canvas = await html2canvas(page, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        windowWidth: page.offsetWidth,
        windowHeight: page.offsetHeight,
        onclone: (_doc: Document, clonedPage: HTMLElement) => {
          if (logoDataUrl) {
            clonedPage.querySelectorAll<HTMLImageElement>('.bmkg-logo').forEach(img => {
              img.src = logoDataUrl!
            })
          }
          clonedPage.style.boxShadow = 'none'
          clonedPage.style.border = 'none'
          clonedPage.style.margin = '0'
        },
      })

      const imgData = canvas.toDataURL('image/jpeg', 0.92)
      pdf.addImage(imgData, 'JPEG', 0, 0, A4_W, A4_H)
    }

    const blob = pdf.output('blob')
    const url = URL.createObjectURL(blob)
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
</style>
