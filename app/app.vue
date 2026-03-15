<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </div>
</template>

<style>
:root {
  --text: #1e293b;
  --text-muted: #64748b;
  --surface: #ffffff;
  --surface-hover: #f8fafc;
  --border: #e2e8f0;
  --primary: #0f766e;
  --danger: #dc2626;
  /* MFStudio-style table theme */
  --table-header-bg: #5b9bd5;
  --table-header-text: #ffffff;
  --input-bg: rgb(240, 242, 244);
  --input-border: #d1d5db;
}

body {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: #ffffff;
  color: var(--text);
  margin: 0;
}
</style>
