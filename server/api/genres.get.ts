export default defineEventHandler(async (event) => {
  try {
    const { useTMDB } = await import('~/composables/useTMDB')
    const tmdb = useTMDB()

    const genres = await tmdb.getGenres()

    return {
      success: true,
      data: genres
    }
  } catch (error) {
    console.error('Erro ao buscar gêneros:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro interno do servidor ao buscar gêneros'
    })
  }
})
