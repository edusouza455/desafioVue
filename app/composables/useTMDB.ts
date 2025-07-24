import type { Movie, TMDBMovie, TMDBMovieResponse, TMDBGenre } from '../types'

export const useTMDB = () => {
  const config = useRuntimeConfig()
  
  // Função para fazer requisições à API TMDB
  const tmdbRequest = async <T>(endpoint: string, params: Record<string, any> = {}): Promise<T> => {
    const url = new URL(`${config.public.tmdbBaseUrl}${endpoint}`)
    
    // Adicionar API key aos parâmetros
    params.api_key = config.tmdbApiKey
    
    // Adicionar parâmetros à URL
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        url.searchParams.append(key, params[key].toString())
      }
    })

    try {
      const response = await $fetch(url.toString(), {
        retry: 3,
        retryDelay: 1000
      }) as T
      return response
    } catch (error) {
      console.error('Erro na requisição TMDB:', error)
      throw new Error('Erro ao buscar dados de filmes')
    }
  }

  // Converter filme TMDB para formato interno
  const convertTMDBMovie = (tmdbMovie: TMDBMovie): Movie => {
    return {
      id: tmdbMovie.id,
      title: tmdbMovie.title,
      overview: tmdbMovie.overview,
      poster_path: tmdbMovie.poster_path,
      release_date: tmdbMovie.release_date,
      vote_average: tmdbMovie.vote_average,
      vote_count: tmdbMovie.vote_count,
      genre_ids: tmdbMovie.genre_ids,
      
      // Campos legados para compatibilidade
      description: tmdbMovie.overview,
      rating: tmdbMovie.vote_average,
      releaseYear: tmdbMovie.release_date ? new Date(tmdbMovie.release_date).getFullYear() : undefined,
      posterUrl: tmdbMovie.poster_path ? `${config.public.tmdbImageBaseUrl}/w500${tmdbMovie.poster_path}` : null
    }
  }

  // Buscar filmes populares
  const getPopularMovies = async (page: number = 1): Promise<{ movies: Movie[], totalPages: number, totalResults: number }> => {
    const response = await tmdbRequest<TMDBMovieResponse>('/movie/popular', { 
      page,
      language: 'pt-BR'
    })
    
    return {
      movies: response.results.map(convertTMDBMovie),
      totalPages: response.total_pages,
      totalResults: response.total_results
    }
  }

  // Buscar filmes mais bem avaliados
  const getTopRatedMovies = async (page: number = 1): Promise<{ movies: Movie[], totalPages: number, totalResults: number }> => {
    const response = await tmdbRequest<TMDBMovieResponse>('/movie/top_rated', { 
      page,
      language: 'pt-BR'
    })
    
    return {
      movies: response.results.map(convertTMDBMovie),
      totalPages: response.total_pages,
      totalResults: response.total_results
    }
  }

  // Buscar filmes por gênero
  const getMoviesByGenre = async (genreId: number, page: number = 1): Promise<{ movies: Movie[], totalPages: number, totalResults: number }> => {
    const response = await tmdbRequest<TMDBMovieResponse>('/discover/movie', {
      with_genres: genreId,
      page,
      language: 'pt-BR',
      sort_by: 'popularity.desc'
    })
    
    return {
      movies: response.results.map(convertTMDBMovie),
      totalPages: response.total_pages,
      totalResults: response.total_results
    }
  }

  // Buscar filme por ID
  const getMovieById = async (id: number): Promise<Movie> => {
    const response = await tmdbRequest<TMDBMovie & { genres: TMDBGenre[], runtime: number }>(`/movie/${id}`, {
      language: 'pt-BR'
    })
    
    const movie = convertTMDBMovie(response)
    movie.genres = response.genres
    movie.runtime = response.runtime
    
    return movie
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

    const response = await tmdbRequest<TMDBMovieResponse>('/search/movie', {
      query: query.trim(),
      page,
      language: 'pt-BR',
      include_adult: false
    })
    
    return {
      movies: response.results.map(convertTMDBMovie),
      totalPages: response.total_pages,
      totalResults: response.total_results
    }
  }

  // Buscar gêneros
  const getGenres = async (): Promise<TMDBGenre[]> => {
    const response = await tmdbRequest<{ genres: TMDBGenre[] }>('/genre/movie/list', {
      language: 'pt-BR'
    })
    
    return response.genres
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
    getImageUrl,
    convertTMDBMovie
  }
}
