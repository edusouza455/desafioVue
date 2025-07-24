export default defineEventHandler(async (event) => {
  const movieId = getRouterParam(event, 'id')

  if (!movieId || isNaN(Number(movieId))) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID do filme inválido'
    })
  }

  try {
    const { useTMDB } = await import('~/composables/useTMDB')
    const tmdb = useTMDB()

    const movie = await tmdb.getMovieById(Number(movieId))

    return {
      success: true,
      data: movie
    }
  } catch (error) {
    console.error('Erro ao buscar filme:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro interno do servidor ao buscar filme'
    })
  }
})
