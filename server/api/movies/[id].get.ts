export default defineEventHandler(async (event) => {
  const movieId = getRouterParam(event, 'id')

  if (!movieId || isNaN(Number(movieId))) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID do filme inválido'
    })
  }

  try {
    const config = useRuntimeConfig()
    const baseUrl = config.public.tmdbBaseUrl
    const apiKey = config.tmdbApiKey

    console.log('Movie Details API Config:', { baseUrl, hasApiKey: !!apiKey, movieId })

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

    const url = `${baseUrl}/movie/${movieId}?${params.toString()}`
    console.log('Movie Details Request URL:', url.replace(apiKey, '[API_KEY]'))

    const response = await fetch(url)
    
    if (!response.ok) {
      console.error('TMDB Movie Details API Error:', response.status, response.statusText)
      throw createError({
        statusCode: response.status,
        statusMessage: `TMDB API error: ${response.statusText}`
      })
    }

    const movie = await response.json()

    // Converter filme para formato padrão
    const posterUrl = movie.poster_path 
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : '/placeholder-movie.svg'

    const backdropUrl = movie.backdrop_path 
      ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
      : null
      
    const formattedMovie = {
      id: movie.id,
      title: movie.title,
      overview: movie.overview,
      poster_path: movie.poster_path,
      backdrop_path: movie.backdrop_path,
      release_date: movie.release_date,
      vote_average: movie.vote_average,
      vote_count: movie.vote_count,
      genres: movie.genres,
      runtime: movie.runtime,
      tagline: movie.tagline,
      homepage: movie.homepage,
      
      // Campos legados para compatibilidade
      rating: movie.vote_average,
      description: movie.overview,
      posterUrl: posterUrl,
      backdropUrl: backdropUrl,
      releaseYear: movie.release_date ? new Date(movie.release_date).getFullYear() : undefined
    }

    return {
      success: true,
      data: formattedMovie
    }
  } catch (error) {
    console.error('Erro ao buscar filme:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: error instanceof Error ? error.message : 'Erro interno do servidor ao buscar filme'
    })
  }
})
