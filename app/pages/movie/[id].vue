<template>
  <div class="min-h-screen bg-dark-900">
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center min-h-screen">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-vue-600"></div>
        <p class="mt-4 text-gray-400">Carregando detalhes do filme...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex justify-center items-center min-h-screen">
      <div class="text-center">
        <svg class="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <h3 class="text-xl font-semibold text-white mb-2">Filme não encontrado</h3>
        <p class="text-gray-400 mb-4">{{ error }}</p>
        <NuxtLink 
          to="/" 
          class="inline-flex items-center space-x-2 bg-vue-600 text-white px-6 py-3 rounded-lg hover:bg-vue-700 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
          <span>Voltar ao Início</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Movie Details -->
    <div v-else-if="movie" class="min-h-screen bg-dark-900">
      <!-- Back Button -->
      <div class="pt-8 pb-4">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button 
            @click="$router.back()"
            class="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-colors group"
          >
            <svg class="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
            <span class="font-medium">Voltar</span>
          </button>
        </div>
      </div>

      <!-- Main Content -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div class="flex flex-col lg:flex-row gap-12">
          <!-- Poster Section - Left Side -->
          <div class="lg:w-1/3 xl:w-1/4 flex-shrink-0">
            <div class="sticky top-8">
              <!-- Poster Image -->
              <div class="relative group">
                <img 
                  :src="movie.posterUrl || '/placeholder-movie.svg'"
                  :alt="movie.title"
                  class="w-full rounded-2xl shadow-2xl transition-transform duration-300 group-hover:scale-105"
                  @error="handleImageError"
                />
                <!-- Overlay gradient for better text visibility -->
                <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              
              <!-- Action Buttons -->
              <div class="mt-6 space-y-3">
                <!-- Favorite Button -->
                <button 
                  @click="toggleFavorite"
                  :class="[
                    'w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105',
                    isFavorite 
                      ? 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 shadow-lg shadow-red-500/25' 
                      : 'bg-dark-800 text-gray-300 hover:bg-dark-700 border border-dark-600 hover:border-vue-500'
                  ]"
                >
                  <svg 
                    class="w-5 h-5 inline mr-3" 
                    :fill="isFavorite ? 'currentColor' : 'none'" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                  </svg>
                  {{ isFavorite ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos' }}
                </button>

                
              </div>
            </div>
          </div>

          <!-- Information Section - Right Side -->
          <div class="lg:w-2/3 xl:w-3/4">
            <!-- Title and Basic Info -->
            <div class="mb-8">
              <h1 class="text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                {{ movie.title }}
              </h1>
              <div class="flex flex-wrap items-center gap-4 text-lg text-gray-400">
                <span v-if="movie.releaseYear" class="flex items-center space-x-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  <span>{{ movie.releaseYear }}</span>
                </span>
                <span v-if="movie.runtime" class="flex items-center space-x-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span>{{ formatRuntime(movie.runtime) }}</span>
                </span>
              </div>
            </div>

            <!-- Genres -->
            <div v-if="movie.genres && movie.genres.length > 0" class="mb-8">
              <div class="flex flex-wrap gap-3">
                <span 
                  v-for="genre in movie.genres" 
                  :key="genre.id"
                  class="px-4 py-2 bg-gradient-to-r from-vue-600/20 to-vue-700/20 text-vue-300 text-sm font-medium rounded-full border border-vue-600/30 hover:border-vue-500/50 transition-colors"
                >
                  {{ genre.name }}
                </span>
              </div>
            </div>

            <!-- Overview -->
            <div v-if="movie.overview" class="mb-10">
              <h2 class="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
                <svg class="w-6 h-6 text-vue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                <span>Sinopse</span>
              </h2>
              <div class="bg-dark-800/50 rounded-2xl p-6 border border-dark-700">
                <p class="text-gray-300 text-lg leading-relaxed">
                  {{ movie.overview }}
                </p>
              </div>
            </div>

            <!-- Additional Information Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Release Date -->
              <div v-if="movie.release_date" class="bg-dark-800/50 rounded-xl p-6 border border-dark-700">
                <h3 class="text-lg font-semibold text-white mb-3 flex items-center space-x-2">
                  <svg class="w-5 h-5 text-vue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  <span>Data de Lançamento</span>
                </h3>
                <p class="text-gray-300 text-lg">{{ formatDate(movie.release_date) }}</p>
              </div>
              
              <!-- Star Rating -->
              <div v-if="movie.vote_average" class="bg-dark-800/50 rounded-xl p-6 border border-dark-700">
                <h3 class="text-lg font-semibold text-white mb-3 flex items-center space-x-2">
                  <svg class="w-5 h-5 text-vue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                  </svg>
                  <span>Avaliação</span>
                </h3>
                <div class="flex items-center space-x-3">
                  <div class="flex items-center space-x-1">
                    <svg 
                      v-for="star in 5" 
                      :key="star"
                      class="w-6 h-6"
                      :class="star <= Math.round(movie.vote_average / 2) ? 'text-yellow-500' : 'text-gray-600'"
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  </div>
                  <span class="text-gray-300 text-lg font-medium">{{ movie.vote_average.toFixed(1) }}/10</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Movie } from '~/types'
import { useTMDB } from '~/composables/useTMDB'
import { useFavoritesStore } from '~/stores/favorites'

// Parâmetros da rota
const route = useRoute()
const movieId = computed(() => {
  const id = route.params.id
  const numId = Number(id)
  return !isNaN(numId) && numId > 0 ? numId : null
})

// Composables
const { getMovieById, getImageUrl } = useTMDB()
const favoritesStore = useFavoritesStore()
const { success, neutral, error: errorToast } = useToast()

// Estado reativo
const movie = ref<Movie | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

// SEO dinâmico
const title = computed(() => movie.value ? `${movie.value.title} - VueMovie` : 'Filme - VueMovie')
const description = computed(() => movie.value?.overview || 'Detalhes do filme')

useSeoMeta({
  title: title,
  description: description
})

// Computed para verificar se é favorito
const isFavorite = computed(() => {
  return movie.value ? favoritesStore.isFavorite(movie.value.id) : false
})

// Função para carregar detalhes do filme
const loadMovieDetails = async () => {
  if (!movieId.value) {
    error.value = 'ID do filme inválido'
    loading.value = false
    return
  }

  try {
    loading.value = true
    error.value = null
    
    movie.value = await getMovieById(movieId.value)
  } catch (err) {
    error.value = 'Não foi possível carregar os detalhes do filme.'
    console.error('Erro ao carregar filme:', err)
  } finally {
    loading.value = false
  }
}

// Função para alternar favorito
const toggleFavorite = async () => {
  if (movie.value) {
    try {
      if (isFavorite.value) {
        await favoritesStore.removeFromFavorites(movie.value.id)
        neutral(`${movie.value.title} removido dos favoritos`)
      } else {
        await favoritesStore.addToFavorites(movie.value)
        success(`${movie.value.title} adicionado aos favoritos!`)
      }
    } catch (err) {
      errorToast('Erro ao atualizar favoritos. Tente novamente.')
      console.error('Erro ao favoritar:', err)
    }
  }
}

// Função para formatar duração
const formatRuntime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}h ${mins}min`
}

// Função para formatar data
const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Função para tratar erro de imagem
const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.src = '/placeholder-movie.svg'
}

// Carregar dados ao montar
onMounted(() => {
  loadMovieDetails()
})
</script>

<style scoped>
/* Adicionar estilos personalizados se necessário */
</style>
