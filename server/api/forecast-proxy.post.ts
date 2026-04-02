export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)

  try {
    const response = await $fetch(config.apiBaseUrl + '/apispb', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': config.apiKey
      },
      body
    })

    return response
  } catch (err: unknown) {
    const status = (err as { statusCode?: number }).statusCode
      ?? (err as { status?: number }).status
      ?? 502
    const message = (err as { message?: string }).message ?? 'Upstream API error'

    throw createError({
      statusCode: status,
      statusMessage: `Forecast API error: ${message}`
    })
  }
})
