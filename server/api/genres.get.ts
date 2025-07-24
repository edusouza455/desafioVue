export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig()
    const baseUrl = config.public.tmdbBaseUrl
    const apiKey = config.tmdbApiKey

    console.log('Genres API Config:', { baseUrl, hasApiKey: !!apiKey })

    if (!apiKey) {
      throw createError({
        statusCode: 500,
        statusMessage: 'TMDB API key not configured'
      })
    }

    // Construir parâmetros da requisição
    const params = new URLSearchParams({
      api_key: apiKey,
      language: 'pt-BR'
    })

    const url = `${baseUrl}/genre/movie/list?${params.toString()}`
    console.log('Genres Request URL:', url.replace(apiKey, '[API_KEY]'))

    const response = await fetch(url)
    
    if (!response.ok) {
      console.error('TMDB Genres API Error:', response.status, response.statusText)
      throw createError({
        statusCode: response.status,
        statusMessage: `TMDB API error: ${response.statusText}`
      })
    }

    const data = await response.json()

    return {
      success: true,
      data: data.genres
    }
  } catch (error) {
    console.error('Erro ao buscar gêneros:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: error instanceof Error ? error.message : 'Erro interno do servidor ao buscar gêneros'
    })
  }
})
