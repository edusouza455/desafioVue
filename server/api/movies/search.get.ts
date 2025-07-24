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
    const { useTMDB } = await import('~/composables/useTMDB')
    const tmdb = useTMDB()

    const result = await tmdb.searchMovies(searchQuery, page)

    return {
      success: true,
      data: result
    }
  } catch (error) {
    console.error('Erro ao buscar filmes:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro interno do servidor ao buscar filmes'
    })
  }
})
