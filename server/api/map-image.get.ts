export default defineEventHandler(async (event) => {
  const targetRaw = getQuery(event).url
  const target = Array.isArray(targetRaw) ? targetRaw[0] : targetRaw
  if (!target || typeof target !== 'string') {
    throw createError({ statusCode: 400, statusMessage: 'Missing url query parameter' })
  }

  let parsed: URL
  try {
    parsed = new URL(target)
  } catch {
    throw createError({ statusCode: 400, statusMessage: 'Invalid url' })
  }

  if (!/^https?:$/.test(parsed.protocol)) {
    throw createError({ statusCode: 400, statusMessage: 'Only http(s) URLs are allowed' })
  }

  try {
    const response = await fetch(parsed.toString())
    if (!response.ok) {
      throw createError({
        statusCode: response.status,
        statusMessage: `Failed to fetch image: ${response.statusText || 'upstream error'}`
      })
    }

    const contentType = response.headers.get('content-type') || 'application/octet-stream'
    setHeader(event, 'Content-Type', contentType)
    setHeader(event, 'Cache-Control', 'public, max-age=3600')
    return new Uint8Array(await response.arrayBuffer())
  } catch (err: unknown) {
    if ((err as { statusCode?: number }).statusCode) throw err
    throw createError({
      statusCode: 502,
      statusMessage: (err as { message?: string }).message || 'Image proxy failed'
    })
  }
})
