import type { Movie, TMDBGenre } from '../types'

export const useTMDB = () => {
  const config = useRuntimeConfig()
  
  // Buscar filmes populares
  const getPopularMovies = async (page: number = 1): Promise<{ movies: Movie[], totalPages: number, totalResults: number }> => {
    const params = new URLSearchParams()
    params.append('page', page.toString())
    params.append('category', 'popular')

    const response = await $fetch<{ success: boolean, data: any }>(`/api/movies/discover?${params}`)
    
    if (!response.success) {
      throw new Error('Erro ao buscar filmes populares')
    }
    
    return response.data
  }

  // Buscar filmes mais bem avaliados
  const getTopRatedMovies = async (page: number = 1): Promise<{ movies: Movie[], totalPages: number, totalResults: number }> => {
    const params = new URLSearchParams()
    params.append('page', page.toString())
    params.append('category', 'top_rated')

    const response = await $fetch<{ success: boolean, data: any }>(`/api/movies/discover?${params}`)
    
    if (!response.success) {
      throw new Error('Erro ao buscar filmes mais bem avaliados')
    }
    
    return response.data
  }

  // Buscar filmes por gênero
  const getMoviesByGenre = async (genreId: number, page: number = 1): Promise<{ movies: Movie[], totalPages: number, totalResults: number }> => {
    const params = new URLSearchParams()
    params.append('page', page.toString())
    params.append('genre', genreId.toString())

    const response = await $fetch<{ success: boolean, data: any }>(`/api/movies/discover?${params}`)
    
    if (!response.success) {
      throw new Error('Erro ao buscar filmes por gênero')
    }
    
    return response.data
  }

  // Buscar filme por ID
  const getMovieById = async (id: number): Promise<Movie> => {
    const response = await $fetch<{ success: boolean, data: any }>(`/api/movies/${id}`)
    
    if (!response.success) {
      throw new Error('Erro ao buscar detalhes do filme')
    }
    
    return response.data
  }

  // Buscar filmes com filtros
  const discoverMovies = async (filters: {
    query?: string
    page?: number
    genre?: string
    year?: string
    sortBy?: string
  } = {}): Promise<{ movies: Movie[], totalPages: number, totalResults: number }> => {
    const params = new URLSearchParams()
    
    if (filters.query) params.append('q', filters.query)
    if (filters.page) params.append('page', filters.page.toString())
    if (filters.genre) params.append('genre', filters.genre)
    if (filters.year) params.append('year', filters.year)
    if (filters.sortBy) params.append('sort_by', filters.sortBy)

    const response = await $fetch<{ success: boolean, data: any }>(`/api/movies/discover?${params}`)
    
    if (!response.success) {
      throw new Error('Erro ao buscar filmes')
    }
    
    return response.data
  }

  // Buscar filmes
  const searchMovies = async (query: string, page: number = 1): Promise<{ movies: Movie[], totalPages: number, totalResults: number }> => {
    if (!query.trim()) {
      return { movies: [], totalPages: 0, totalResults: 0 }
    }

    const params = new URLSearchParams()
    params.append('q', query.trim())
    params.append('page', page.toString())

    const response = await $fetch<{ success: boolean, data: any }>(`/api/movies/search?${params}`)
    
    if (!response.success) {
      throw new Error('Erro ao buscar filmes')
    }
    
    return response.data
  }

  // Buscar gêneros
  const getGenres = async (): Promise<TMDBGenre[]> => {
    const response = await $fetch<{ success: boolean, data: TMDBGenre[] }>('/api/genres')
    
    if (!response.success) {
      throw new Error('Erro ao buscar gêneros')
    }
    
    return response.data
  }

  // Gerar URL de imagem
  const getImageUrl = (path: string | null, size: string = 'w500'): string => {
    if (!path) {
      return '/placeholder-movie.svg'
    }
    return `${config.public.tmdbImageBaseUrl}/${size}${path}`
  }

  return {
    // Funções principais
    getPopularMovies,
    getTopRatedMovies,
    getMoviesByGenre,
    getMovieById,
    searchMovies,
    getGenres,
    discoverMovies,
    
    // Utilitários
    getImageUrl
  }
}
