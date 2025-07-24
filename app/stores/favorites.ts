import { defineStore } from 'pinia'
import type { Movie } from '~/types'

export const useFavoritesStore = defineStore('favorites', {
  // Estado
  state: () => ({
    favorites: [] as Movie[],
    isLoading: false
  }),

  // Getters (computeds)
  getters: {
    favoritesCount: (state) => state.favorites.length,
    hasFavorites: (state) => state.favorites.length > 0,
    isFavorite: (state) => (movieId: number) => 
      state.favorites.some(movie => movie.id === movieId),
    
    // Favoritos por gênero
    favoritesByGenre: (state) => {
      const genreCount: Record<string, number> = {}
      state.favorites.forEach(movie => {
        if (movie.genres) {
          movie.genres.forEach(genre => {
            genreCount[genre.name] = (genreCount[genre.name] || 0) + 1
          })
        }
      })
      return genreCount
    },

    // Favoritos ordenados por rating
    favoritesSortedByRating: (state) => 
      [...state.favorites].sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0))
  },

  // Actions (métodos)
  actions: {
    // Adicionar filme aos favoritos
    async addToFavorites(movie: Movie) {
      try {
        this.isLoading = true
        
        // Debug: log do filme sendo adicionado
        console.log('Adicionando filme aos favoritos:', movie)
        
        // Verifica se já não está nos favoritos
        if (this.isFavorite(movie.id)) {
          throw new Error('Filme já está nos favoritos')
        }

        // Garantir que o filme tem os campos necessários
        const movieToSave: Movie = {
          id: movie.id,
          title: movie.title,
          overview: movie.overview || movie.description || '',
          poster_path: movie.poster_path,
          release_date: movie.release_date,
          vote_average: movie.vote_average || movie.rating,
          vote_count: movie.vote_count,
          genre_ids: movie.genre_ids,
          genres: movie.genres,
          runtime: movie.runtime,
          // Campos legados para compatibilidade
          rating: movie.rating || movie.vote_average,
          description: movie.description || movie.overview,
          posterUrl: movie.posterUrl,
          releaseYear: movie.releaseYear
        }

        console.log('Filme formatado para salvar:', movieToSave)

        this.favorites.push(movieToSave)
        
        // Salvar no localStorage
        this.saveToLocalStorage()
        
      } catch (error) {
        console.error('Erro ao adicionar aos favoritos:', error)
        await this.showNotification(
          error instanceof Error ? error.message : 'Erro ao adicionar filme aos favoritos', 
          'error'
        )
      } finally {
        this.isLoading = false
      }
    },

    // Remover filme dos favoritos
    async removeFromFavorites(movieId: number) {
      try {
        this.isLoading = true
        
        const movieIndex = this.favorites.findIndex(movie => movie.id === movieId)
        if (movieIndex === -1) {
          throw new Error('Filme não encontrado nos favoritos')
        }

        const removedMovie = this.favorites[movieIndex]
        this.favorites.splice(movieIndex, 1)
        
        // Salvar no localStorage
        this.saveToLocalStorage()
        
      } catch (error) {
        console.error('Erro ao remover filme dos favoritos:', error)
      } finally {
        this.isLoading = false
      }
    },

    // Toggle favorito
    async toggleFavorite(movie: Movie) {
      if (this.isFavorite(movie.id)) {
        await this.removeFromFavorites(movie.id)
      } else {
        await this.addToFavorites(movie)
      }
    },

    // Limpar todos os favoritos
    async clearFavorites() {
      try {
        this.isLoading = true
        this.favorites = []
        this.saveToLocalStorage()
        await this.showNotification('Todos os favoritos foram removidos!', 'info')
      } catch (error) {
        await this.showNotification('Erro ao limpar favoritos', 'error')
      } finally {
        this.isLoading = false
      }
    },

    // Salvar no localStorage
    saveToLocalStorage() {
      if (process.client) {
        try {
          localStorage.setItem('vuemovie-favorites', JSON.stringify(this.favorites))
        } catch (error) {
          console.error('Erro ao salvar favoritos no localStorage:', error)
        }
      }
    },

    // Carregar do localStorage
    loadFromLocalStorage() {
      if (process.client) {
        try {
          const saved = localStorage.getItem('vuemovie-favorites')
          if (saved) {
            this.favorites = JSON.parse(saved)
          }
        } catch (error) {
          console.error('Erro ao carregar favoritos do localStorage:', error)
          this.favorites = []
        }
      }
    },

    // Buscar favoritos por gênero
    getFavoritesByGenre(genreName: string): Movie[] {
      return this.favorites.filter(movie => 
        movie.genres?.some(genre => genre.name === genreName)
      )
    },

    // Exportar favoritos (para backup)
    exportFavorites(): string {
      return JSON.stringify(this.favorites, null, 2)
    },

    // Importar favoritos (de backup)
    async importFavorites(favoritesJson: string) {
      try {
        const importedFavorites = JSON.parse(favoritesJson) as Movie[]
        this.favorites = importedFavorites
        this.saveToLocalStorage()
        await this.showNotification(`${importedFavorites.length} favoritos importados!`, 'success')
      } catch (error) {
        await this.showNotification('Erro ao importar favoritos - formato inválido', 'error')
      }
    },

    // Sistema de notificações com Sonner
    async showNotification(message: string, type: 'success' | 'error' | 'info' = 'info') {
      if (process.client) {
        const { success, error, info } = useToast()
        
        switch (type) {
          case 'success':
            success(message)
            break
          case 'error':
            error(message)
            break
          case 'info':
            info(message)
            break
        }
      }
    }
  }
})

// Composable helper para usar a store de forma mais conveniente
export const useFavorites = () => {
  const favoritesStore = useFavoritesStore()

  // Auto-carregar favoritos quando o composable é usado
  onMounted(() => {
    favoritesStore.loadFromLocalStorage()
  })

  return {
    // Estado
    favorites: computed(() => favoritesStore.favorites),
    favoritesCount: computed(() => favoritesStore.favoritesCount),
    hasFavorites: computed(() => favoritesStore.hasFavorites),
    isLoading: computed(() => favoritesStore.isLoading),
    favoritesByGenre: computed(() => favoritesStore.favoritesByGenre),
    favoritesSortedByRating: computed(() => favoritesStore.favoritesSortedByRating),

    // Métodos
    addToFavorites: favoritesStore.addToFavorites,
    removeFromFavorites: favoritesStore.removeFromFavorites,
    toggleFavorite: favoritesStore.toggleFavorite,
    isFavorite: favoritesStore.isFavorite,
    clearFavorites: favoritesStore.clearFavorites,
    getFavoritesByGenre: favoritesStore.getFavoritesByGenre,
    exportFavorites: favoritesStore.exportFavorites,
    importFavorites: favoritesStore.importFavorites
  }
}
