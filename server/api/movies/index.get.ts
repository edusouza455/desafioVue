export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const page = Number(query.page) || 1
  const category = query.category as string || 'popular'

  try {
    const { useTMDB } = await import('~/composables/useTMDB')
    const tmdb = useTMDB()

    let result
    
    switch (category) {
      case 'top_rated':
        result = await tmdb.getTopRatedMovies(page)
        break
      case 'popular':
      default:
        result = await tmdb.getPopularMovies(page)
        break
    }

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
