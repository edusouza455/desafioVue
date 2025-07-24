export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const searchQuery = query.q as string
  const page = Number(query.page) || 1

  if (!searchQuery?.trim()) {
    return {
      success: true,
      data: {
        movies: [],
        totalPages: 0,
        totalResults: 0
      }
    }
  }

  try {
    const config = useRuntimeConfig()
    const baseUrl = config.public.tmdbBaseUrl
    const apiKey = config.tmdbApiKey

    console.log('Search API Config:', { baseUrl, hasApiKey: !!apiKey, query: searchQuery, page })

    if (!apiKey) {
      throw createError({
        statusCode: 500,
        statusMessage: 'TMDB API key not configured'
      })
    }

    // Construir parâmetros da busca
    const params = new URLSearchParams({
      api_key: apiKey,
      language: 'pt-BR',
      page: page.toString(),
      include_adult: 'false',
      query: searchQuery.trim()
    })

    const url = `${baseUrl}/search/movie?${params.toString()}`
    console.log('Search Request URL:', url.replace(apiKey, '[API_KEY]'))

    const response = await fetch(url)
    
    if (!response.ok) {
      console.error('TMDB Search API Error:', response.status, response.statusText)
      throw createError({
        statusCode: response.status,
        statusMessage: `TMDB API error: ${response.statusText}`
      })
    }

    const data = await response.json()

    // Converter filmes para formato padrão
    const movies = data.results.map((movie: any) => {
      const posterUrl = movie.poster_path 
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : '/placeholder-movie.svg'
        
      return {
        id: movie.id,
        title: movie.title,
        overview: movie.overview,
        poster_path: movie.poster_path,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
        vote_count: movie.vote_count,
        genre_ids: movie.genre_ids,
        
        // Campos legados para compatibilidade
        rating: movie.vote_average,
        description: movie.overview,
        posterUrl: posterUrl,
        releaseYear: movie.release_date ? new Date(movie.release_date).getFullYear() : undefined
      }
    })

    return {
      success: true,
      data: {
        movies,
        totalPages: Math.min(data.total_pages, 500), // TMDB limita a 500 páginas
        totalResults: data.total_results,
        currentPage: page
      }
    }
  } catch (error) {
    console.error('Erro ao buscar filmes:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: error instanceof Error ? error.message : 'Erro interno do servidor ao buscar filmes'
    })
  }
})
