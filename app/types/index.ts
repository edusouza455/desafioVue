// Tipo para um filme (compatível com TMDB)
export interface Movie {
  id: number
  title: string
  overview?: string
  poster_path?: string | null
  release_date?: string
  vote_average?: number
  vote_count?: number
  genre_ids?: number[]
  genres?: TMDBGenre[]
  runtime?: number
  
  // Campos legados (mantidos para compatibilidade)
  genre?: string
  rating?: number
  description?: string
  posterUrl?: string
  releaseYear?: number
}

// Tipos TMDB
export interface TMDBMovie {
  id: number
  title: string
  original_title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  vote_count: number
  popularity: number
  adult: boolean
  genre_ids: number[]
  original_language: string
  video: boolean
}

export interface TMDBMovieResponse {
  page: number
  results: TMDBMovie[]
  total_pages: number
  total_results: number
}

export interface TMDBGenre {
  id: number
  name: string
}

export interface TMDBGenresResponse {
  genres: TMDBGenre[]
}

export interface TMDBMovieDetails extends TMDBMovie {
  belongs_to_collection: any
  budget: number
  genres: TMDBGenre[]
  homepage: string
  imdb_id: string
  production_companies: any[]
  production_countries: any[]
  revenue: number
  runtime: number
  spoken_languages: any[]
  status: string
  tagline: string
}

// Tipo para favoritos
export interface Favorite {
  id: number
  movieId: number
  addedAt: Date
}

// Tipo para usuário (futuro)
export interface User {
  id: number
  name: string
  email: string
}
