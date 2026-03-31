/**
 * Absolute URL for public/logo-bmkg.svg — avoids bad resolution (e.g. /&/logo-bmkg.svg)
 * when the document path or html2canvas clone has an odd base.
 */
export function useBmkgLogoUrl() {
  return computed(() => {
    const path = '/logo-bmkg.svg'
    if (import.meta.server) {
      const u = useRequestURL()
      return new URL(path, `${u.origin}/`).href
    }
    return new URL(path, `${window.location.origin}/`).href
  })
}
