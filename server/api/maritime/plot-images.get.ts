import { readdir } from 'node:fs/promises'
import { join } from 'node:path'

const swhRe = /^swh_\d{10}\.(png|jpe?g|webp)$/i
const wsRe = /^ws_\d{10}\.(png|jpe?g|webp)$/i

function stampFromName(name: string): string | null {
  const m = name.match(/^(?:swh|ws)_(\d{10})\./i)
  return m?.[1] ?? null
}

/**
 * Lists `public/swh_YYYYMMDDHH.*` and `public/ws_YYYYMMDDHH.*` so the PDF preview can
 * reference the correct extension (png/jpeg/webp).
 */
export default defineEventHandler(async () => {
  const publicDir = join(process.cwd(), 'public')
  let names: string[] = []
  try {
    names = await readdir(publicDir)
  } catch {
    return { swhPaths: [] as string[], wsPaths: [] as string[] }
  }

  const sortByStamp = (a: string, b: string) => {
    const sa = stampFromName(a) ?? ''
    const sb = stampFromName(b) ?? ''
    return sa.localeCompare(sb, undefined, { numeric: true })
  }

  const swhPaths = names.filter(n => swhRe.test(n)).sort(sortByStamp).map(n => `/${n}`)
  const wsPaths = names.filter(n => wsRe.test(n)).sort(sortByStamp).map(n => `/${n}`)

  return { swhPaths, wsPaths }
})
