<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </div>
</template>

<style>
:root {
  /* Brand palette */
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

  /* Transparent variants */
  --primary-hover: color-mix(in srgb, var(--primary) 8%, transparent);
  --primary-glow: color-mix(in srgb, var(--primary) 35%, transparent);
  --accent-ring: color-mix(in srgb, var(--accent) 15%, transparent);

  /* Elevation */
  --shadow-sm: 0 1px 2px rgba(15, 23, 42, 0.05);
  --shadow-md: 0 4px 14px rgba(15, 23, 42, 0.08), 0 2px 4px rgba(15, 23, 42, 0.04);
  --shadow-card: 0 8px 28px rgba(15, 23, 42, 0.09), 0 2px 10px rgba(39, 121, 253, 0.06);
  --shadow-inset: inset 0 1px 0 rgba(255, 255, 255, 0.6);
}

body {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: var(--color-page);
  color: var(--text);
  margin: 0;
}
</style>
