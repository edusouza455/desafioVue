<template>
  <div class="bg-dark-950">
    <!-- Header da página -->
    <div class="bg-dark-900 shadow-sm border-b border-dark-800">
      <div class="container mx-auto px-4 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-white">Meus Favoritos</h1>
            <p class="text-gray-400 mt-1">
              {{ hasFavorites ? `${favoritesCount} ${favoritesCount === 1 ? 'filme' : 'filmes'} favoritado${favoritesCount === 1 ? '' : 's'}` : 'Nenhum filme favoritado ainda' }}
            </p>
          </div>
          
          <!-- Actions -->
          <div v-if="hasFavorites" class="flex gap-2">
            
            <button 
              @click="confirmClearAll"
              class="text-red-400 hover:text-red-300 px-3 py-1 text-sm border border-red-600 rounded hover:bg-red-900 hover:bg-opacity-30 transition-colors flex items-center space-x-1"
              :disabled="isLoading"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
              <span>Limpar Tudo</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <main class="container mx-auto px-4 py-8">
      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-vue-600 mx-auto"></div>
        <p class="mt-4 text-gray-400">Carregando...</p>
      </div>

      <!-- Lista de Favoritos -->
      <div v-else-if="hasFavorites">
        <!-- Grid de filmes -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div 
            v-for="movie in favoritesSortedByRating" 
            :key="movie.id" 
            @click="navigateToMovie(movie.id)"
            class="bg-dark-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300 border border-dark-700 cursor-pointer group"
          >
            <!-- Imagem do filme -->
            <div class="relative">
              <img 
                :src="getMoviePosterUrl(movie)" 
                :alt="movie.title"
                class="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                @error="handleImageError"
              >
              <div class="absolute top-2 right-2">
                <span class="bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                  ⭐ {{ getMovieRating(movie) }}
                </span>
              </div>
              
              <!-- Overlay de hover -->
              <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300 flex items-center justify-center">
                <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-vue-600 text-white px-4 py-2 rounded-lg font-semibold">
                  Ver Detalhes
                </div>
              </div>
            </div>

            <!-- Conteúdo do card -->
            <div class="p-4">
              <h3 class="font-semibold text-white mb-2 line-clamp-2 group-hover:text-vue-400 transition-colors">{{ movie.title }}</h3>
              <p class="text-sm text-gray-400 mb-2">{{ formatReleaseYear(movie.release_date) }}</p>
              
              <!-- Overview -->
              <p v-if="getMovieOverview(movie)" class="text-sm text-gray-300 mb-4 line-clamp-3">
                {{ getMovieOverview(movie) }}
              </p>

              <!-- Actions -->
              <div class="flex justify-between items-center">
                <div class="flex items-center space-x-2">
                  <svg class="w-4 h-4 text-vue-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                  </svg>
                  <span class="text-sm font-medium text-gray-300">{{ getMovieRating(movie) }}/10</span>
                </div>
                <button 
                  @click.stop="removeFromFavorites(movie.id)"
                  class="text-red-400 hover:text-red-300 transition-colors p-2 rounded-full hover:bg-red-900 hover:bg-opacity-30"
                  title="Remover dos favoritos"
                  :disabled="isLoading"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Estado vazio -->
      <div v-else class="text-center py-12">
        <div class="text-6xl mb-4">📽️</div>
        <h2 class="text-xl text-gray-300 mb-2">Nenhum filme favoritado ainda</h2>
        <p class="text-gray-400 mb-6">Comece explorando filmes na página inicial e adicione aos seus favoritos!</p>
        <div class="space-y-3">
          <div>
            <NuxtLink 
              to="/" 
              class="bg-vue-600 text-white px-6 py-3 rounded-lg hover:bg-vue-700 transition-colors inline-block"
            >
              🏠 Descobrir Filmes
            </NuxtLink>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import type { Movie } from '~/types'
import { useFavoritesStore } from '~/stores/favorites'
import { usePageMeta } from '~/composables/useUtils'

// Composables
const { getImageUrl } = useTMDB()
const favoritesStore = useFavoritesStore()
const { neutral, success, error } = useToast()

// Carregar favoritos do localStorage quando a página é montada
onMounted(() => {
  favoritesStore.loadFromLocalStorage()
})

// Computeds reativos
const favorites = computed(() => favoritesStore.favorites)
const favoritesCount = computed(() => favoritesStore.favoritesCount)
const hasFavorites = computed(() => favoritesStore.hasFavorites)
const isLoading = computed(() => favoritesStore.isLoading)
const favoritesByGenre = computed(() => favoritesStore.favoritesByGenre)
const favoritesSortedByRating = computed(() => favoritesStore.favoritesSortedByRating)

// Actions
const removeFromFavorites = async (movieId: number) => {
  try {
    const movie = favoritesStore.favorites.find(f => f.id === movieId)
    await favoritesStore.removeFromFavorites(movieId)
    if (movie) {
      neutral(`${movie.title} removido dos favoritos`)
    }
  } catch (err) {
    error('Erro ao remover filme dos favoritos')
    console.error('Erro:', err)
  }
}

const clearFavorites = async () => {
  try {
    await favoritesStore.clearFavorites()
    success('Todos os favoritos foram removidos!')
  } catch (err) {
    error('Erro ao limpar favoritos')
    console.error('Erro:', err)
  }
}
const exportFavorites = () => favoritesStore.exportFavorites()
const importFavorites = (data: string) => favoritesStore.importFavorites(data)

// Navegação para detalhes do filme
const navigateToMovie = (movieId: number) => {
  // Validar se o ID é válido antes de navegar
  if (!movieId || isNaN(movieId) || movieId <= 0) {
    console.error('ID de filme inválido:', movieId)
    return
  }
  navigateTo(`/movie/${movieId}`)
}

// Meta tags
// usePageMeta('Favoritos', 'Seus filmes favoritos salvos no VueMovie')

// Utilitários
const formatReleaseYear = (date: string | null) => {
  if (!date) return 'Ano desconhecido'
  return new Date(date).getFullYear()
}

// Funções para lidar com diferentes formatos de dados
const getMoviePosterUrl = (movie: Movie): string => {
  // Tenta usar posterUrl primeiro (campo legado), depois poster_path
  if (movie.posterUrl) return movie.posterUrl
  if (movie.poster_path) return getImageUrl(movie.poster_path, 'w500')
  return '/placeholder-movie.svg'
}

const getMovieRating = (movie: Movie): string => {
  // Tenta vote_average primeiro, depois rating (campo legado)
  const rating = movie.vote_average || movie.rating
  return rating ? rating.toFixed(1) : 'N/A'
}

const getMovieOverview = (movie: Movie): string => {
  // Tenta overview primeiro, depois description (campo legado)
  return movie.overview || movie.description || ''
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/placeholder-movie.svg'
}

// Actions
const confirmClearAll = () => {
  if (confirm(`Tem certeza que deseja remover todos os ${favoritesCount.value} filmes dos favoritos? Esta ação não pode ser desfeita.`)) {
    clearFavorites()
  }
}

const exportData = () => {
  const data = exportFavorites()
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `vuemovie-favoritos-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

const handleImport = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  
  if (!file) return
  
  try {
    const text = await file.text()
    await importFavorites(text)
    input.value = '' // Reset input
  } catch (error) {
    alert('Erro ao importar arquivo. Verifique se é um arquivo JSON válido.')
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
