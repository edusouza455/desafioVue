export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  
  const searchQuery = query.q as string
  const page = Number(query.page) || 1
  const genre = query.genre as string
  const year = query.year as string
  const sortBy = query.sort_by as string || 'popularity.desc'

  try {
    const config = useRuntimeConfig()
    const baseUrl = config.public.tmdbBaseUrl
    const apiKey = config.tmdbApiKey

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
      sort_by: sortBy,
      include_adult: 'false'
    })

    // Adicionar filtros se fornecidos
    if (genre) {
      params.append('with_genres', genre)
    }
    
    if (year) {
      params.append('year', year)
    }

    // Se há uma query de busca, usar search, senão usar discover
    const endpoint = searchQuery ? '/search/movie' : '/discover/movie'
    
    if (searchQuery) {
      params.append('query', searchQuery)
    }

    const response = await fetch(`${baseUrl}${endpoint}?${params}`)
    
    if (!response.ok) {
      throw createError({
        statusCode: response.status,
        statusMessage: `TMDB API error: ${response.statusText}`
      })
    }

    const data = await response.json()

    // Converter filmes para formato padrão
    const movies = data.results.map((movie: any) => ({
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
      releaseYear: movie.release_date ? new Date(movie.release_date).getFullYear() : undefined
    }))

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
    console.error('Erro na API discover:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro interno do servidor ao buscar filmes'
    })
  }
})