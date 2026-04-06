<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
const { initTheme } = useTheme()
onMounted(() => initTheme())
</script>

<style>
:root {
  --color-white: #ffffff;
  --color-page: #f8fafb;
  --color-green: #01a73e;
  --color-blue: #2779fd;

  --text: #0f172a;
  --text-muted: #64748b;
  --surface: var(--color-white);
  --surface-hover: #f1f5f9;
  --border: #e2e8f0;
  --primary: var(--color-green);
  --accent: var(--color-blue);
  --danger: #dc2626;

  --table-header-bg: var(--color-blue);
  --table-header-text: #ffffff;
  --input-bg: #f8fafb;
  --input-border: #cbd5e1;

  --primary-hover: color-mix(in srgb, var(--primary) 8%, transparent);
  --primary-glow: color-mix(in srgb, var(--primary) 35%, transparent);
  --accent-ring: color-mix(in srgb, var(--accent) 15%, transparent);

  --shadow-sm: 0 1px 2px rgba(15, 23, 42, 0.05);
  --shadow-md: 0 4px 14px rgba(15, 23, 42, 0.08), 0 2px 4px rgba(15, 23, 42, 0.04);
  --shadow-card: 0 8px 28px rgba(15, 23, 42, 0.09), 0 2px 10px rgba(39, 121, 253, 0.06);
  --shadow-inset: inset 0 1px 0 rgba(255, 255, 255, 0.6);

  --section-accent: var(--accent);
  --bulk-row-bg: #eff6ff;
  --bulk-row-border: #bfdbfe;
  --bulk-row-text: #1e293b;
  --bulk-input-border: #bfdbfe;
  --bulk-input-bg: #ffffff;
  --bulk-label-text: rgba(23, 37, 84, 0.85);
  --bulk-label-sub: rgba(30, 58, 138, 0.7);
  --warning-bg: #fffbeb;
  --warning-border: #fcd34d;
  --warning-text: #92400e;
  --toolbar-bg: rgba(255, 255, 255, 0.95);
  --toolbar-border: #e2e8f0;
  --toolbar-hover: #f1f5f9;
}

[data-theme="dark"] {
  --color-page: #0c0e14;
  --color-green: #34d399;
  --color-blue: #60a5fa;

  --text: #e2e8f0;
  --text-muted: #94a3b8;
  --surface: #151821;
  --surface-hover: #1e2231;
  --border: #2a3042;
  --primary: #34d399;
  --accent: #60a5fa;
  --danger: #f87171;

  --table-header-bg: #1e40af;
  --table-header-text: #f1f5f9;
  --input-bg: #1a1e2a;
  --input-border: #374151;

  --primary-hover: color-mix(in srgb, var(--primary) 12%, transparent);
  --primary-glow: color-mix(in srgb, var(--primary) 20%, transparent);
  --accent-ring: color-mix(in srgb, var(--accent) 20%, transparent);

  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.4);
  --shadow-md: 0 4px 14px rgba(0, 0, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.25);
  --shadow-card: 0 8px 28px rgba(0, 0, 0, 0.45), 0 2px 10px rgba(96, 165, 250, 0.04);
  --shadow-inset: inset 0 1px 0 rgba(255, 255, 255, 0.04);

  --bulk-row-bg: #1a2236;
  --bulk-row-border: #1e3a5f;
  --bulk-row-text: #cbd5e1;
  --bulk-input-border: #1e3a5f;
  --bulk-input-bg: #0f172a;
  --bulk-label-text: #94a3b8;
  --bulk-label-sub: #64748b;
  --warning-bg: #422006;
  --warning-border: #92400e;
  --warning-text: #fbbf24;
  --toolbar-bg: rgba(21, 24, 33, 0.95);
  --toolbar-border: #2a3042;
  --toolbar-hover: #1e2231;
}

html[data-theme] *:not([class*="animate-"]):not(canvas):not(.leaflet-tile):not(.leaflet-pane):not(video) {
  transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
}

body {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: var(--color-page);
  color: var(--text);
  margin: 0;
}
</style>
