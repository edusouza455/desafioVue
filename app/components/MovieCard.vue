<template>
  <div 
    @click="viewDetails"
    class="bg-dark-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300 border border-dark-700 cursor-pointer group"
  >
    <!-- Poster do filme -->
    <div class="relative h-64 overflow-hidden">
      <img 
        :src="movie.posterUrl" 
        :alt="movie.title"
        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        @error="onImageError"
      />
      <div class="absolute top-2 right-2">
        <span class="bg-dark-900 bg-opacity-80 text-vue-400 px-2 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
          </svg>
          <span>{{ formatRating(movie.rating) }}</span>
        </span>
      </div>
      
      <!-- Overlay de hover para indicar que é clicável -->
      <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300 flex items-center justify-center">
        <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-vue-600 text-white px-4 py-2 rounded-lg font-semibold">
          Ver Detalhes
        </div>
      </div>
    </div>
    
    <!-- Informações do filme -->
    <div class="p-4">
      <h3 class="font-bold text-lg mb-2 text-white line-clamp-2 group-hover:text-vue-400 transition-colors">{{ movie.title }}</h3>
      <p class="text-gray-400 text-sm mb-2">{{ movie.releaseYear }}</p>
      <p v-if="movie.description" class="text-gray-300 text-sm mb-3 line-clamp-3">
        {{ movie.description }}
      </p>
      
      <!-- Footer do card -->
      <div class="flex justify-between items-center mt-4">
        <div class="flex items-center space-x-2">
          <svg class="w-4 h-4 text-vue-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
          </svg>
          <span class="text-sm font-medium text-gray-300">{{ formatRating(movie.rating) }}/10</span>
        </div>
        
        <div class="flex space-x-2">
          <!-- Botão de favoritar -->
          <button 
            @click.stop="handleToggleFavorite"
            :disabled="isLoading"
            :class="[
              'p-2 rounded-full transition-all duration-200 z-10',
              isFavorited 
                ? 'text-red-400 hover:text-red-300 bg-red-900 bg-opacity-30 hover:bg-opacity-50' 
                : 'text-gray-400 hover:text-red-400 hover:bg-red-900 hover:bg-opacity-30',
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            ]"
            :title="isFavorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'"
          >
            <svg 
              class="w-5 h-5" 
              :fill="isFavorited ? 'currentColor' : 'none'" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Movie } from '~/types'
import { useFavoritesStore } from '~/stores/favorites'

interface Props {
  movie: Movie
}

const props = defineProps<Props>()

// Store
const favoritesStore = useFavoritesStore()
const { success, error, neutral } = useToast()

// Computed
const isFavorited = computed(() => favoritesStore.isFavorite(props.movie.id))
const isLoading = computed(() => favoritesStore.isLoading)

// Methods
const handleToggleFavorite = async () => {
  try {
    if (isFavorited.value) {
      await favoritesStore.removeFromFavorites(props.movie.id)
      neutral(`${props.movie.title} removido dos favoritos`)
    } else {
      await favoritesStore.addToFavorites(props.movie)
      success(`${props.movie.title} adicionado aos favoritos!`)
    }
  } catch (err) {
    error('Erro ao atualizar favoritos. Tente novamente.')
    console.error('Erro ao favoritar:', err)
  }
}

const viewDetails = () => {
  navigateTo(`/movie/${props.movie.id}`)
}

const onImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.src = '/placeholder-movie.svg'
}

// Função para formatar a nota com 1 casa decimal
const formatRating = (rating: number | undefined): string => {
  if (rating === undefined || rating === null) {
    return '0.0'
  }
  return rating.toFixed(1)
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
