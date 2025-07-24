<template>
  <div class="bg-dark-950">
    <section class="bg-gradient-to-r from-dark-900 to-vue-900 text-white py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h1 class="text-4xl md:text-6xl font-bold mb-4">
            Descubra seus filmes favoritos
          </h1>
          <p class="text-xl md:text-2xl mb-8 text-gray-300">
            Explore, salve e organize os melhores filmes do cinema
          </p>
          <NuxtLink 
            to="/search" 
            class="inline-flex items-center space-x-2 bg-vue-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-vue-700 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <span>Buscar Filmes</span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 class="text-2xl font-bold text-white mb-8 text-center">Explorar por Categoria</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <button 
          @click="filterByCategory('popular')"
          :class="[
            'group flex flex-col items-center p-6 rounded-xl transition-all duration-300',
            selectedCategory === 'popular' 
              ? 'bg-vue-600 text-white' 
              : 'bg-dark-800 text-gray-300 hover:bg-dark-700 hover:text-vue-400'
          ]"
        >
          <svg class="w-8 h-8 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
          </svg>
          <span class="font-semibold">Novidades</span>
        </button>

        <button 
          @click="filterByCategory('animation')"
          :class="[
            'group flex flex-col items-center p-6 rounded-xl transition-all duration-300',
            selectedCategory === 'animation' 
              ? 'bg-vue-600 text-white' 
              : 'bg-dark-800 text-gray-300 hover:bg-dark-700 hover:text-vue-400'
          ]"
        >
          <svg class="w-8 h-8 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.01M15 10h1.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <span class="font-semibold">Animação</span>
        </button>

        <button 
          @click="filterByCategory('comedy')"
          :class="[
            'group flex flex-col items-center p-6 rounded-xl transition-all duration-300',
            selectedCategory === 'comedy' 
              ? 'bg-vue-600 text-white' 
              : 'bg-dark-800 text-gray-300 hover:bg-dark-700 hover:text-vue-400'
          ]"
        >
          <svg class="w-8 h-8 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364-.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
          </svg>
          <span class="font-semibold">Comédia</span>
        </button>

        <button 
          @click="filterByCategory('top_rated')"
          :class="[
            'group flex flex-col items-center p-6 rounded-xl transition-all duration-300',
            selectedCategory === 'top_rated' 
              ? 'bg-vue-600 text-white' 
              : 'bg-dark-800 text-gray-300 hover:bg-dark-700 hover:text-vue-400'
          ]"
        >
          <svg class="w-8 h-8 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
          </svg>
          <span class="font-semibold">Melhores</span>
        </button>
      </div>
    </section>

    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      <div class="flex justify-between items-center mb-8">
        <h2 class="text-3xl font-bold text-white">
          {{ getCategoryTitle() }}
        </h2>
      </div>

      <div v-if="loading && movies.length === 0" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-vue-600"></div>
        <p class="mt-4 text-gray-400">Carregando filmes...</p>
      </div>

      <div v-else-if="error" class="text-center py-12">
        <svg class="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <h3 class="text-xl font-semibold text-white mb-2">Erro ao carregar filmes</h3>
        <p class="text-gray-400 mb-4">{{ error }}</p>
        <button 
          @click="refresh" 
          class="inline-flex items-center space-x-2 bg-vue-600 text-white px-6 py-3 rounded-lg hover:bg-vue-700 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          <span>Tentar Novamente</span>
        </button>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        <MovieCard 
          v-for="movie in movies" 
          :key="movie.id" 
          :movie="movie"
        />
      </div>

      <div v-if="!loading || movies.length > 0" class="mt-12 text-center">
        <div v-if="loading && movies.length > 0" class="py-8">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-vue-600"></div>
          <p class="mt-2 text-gray-400">Carregando mais filmes...</p>
        </div>
        
        <button 
          v-else-if="hasMorePages"
          @click="loadMore" 
          :disabled="loading"
          class="flex items-center space-x-2 bg-vue-600 text-white px-8 py-4 rounded-lg hover:bg-vue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mx-auto text-lg font-medium"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
          </svg>
          <span>Carregar Mais Filmes</span>
        </button>
        
        <div v-else-if="movies.length > 0" class="py-8">
          <p class="text-gray-400">Você chegou ao final da lista! 🎬</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { Movie } from '~/types'
import { useTMDB } from '~/composables/useTMDB'

// Configuração de SEO
useSeoMeta({
  title: 'VueMovie - Descubra seus filmes favoritos',
  description: 'Explore, salve e organize os melhores filmes do cinema com VueMovie'
})

const { getPopularMovies, getTopRatedMovies, getMoviesByGenre } = useTMDB()

const route = useRoute()
const movies = ref<Movie[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const currentPage = ref(1)
const hasMorePages = ref(true)
const selectedCategory = ref('popular')

const initializeCategory = () => {
  const urlCategory = route.query.category as string
  if (urlCategory && ['popular', 'top_rated', 'animation', 'comedy'].includes(urlCategory)) {
    selectedCategory.value = urlCategory
  }
}

const getCategoryTitle = () => {
  const titles = {
    popular: 'Filmes Populares',
    animation: 'Filmes de Animação',
    comedy: 'Filmes de Comédia',
    top_rated: 'Melhores Filmes'
  }
  return titles[selectedCategory.value as keyof typeof titles] || 'Filmes'
}

const filterByCategory = async (category: string) => {
  selectedCategory.value = category
  currentPage.value = 1
  hasMorePages.value = true
  
  await navigateTo({
    path: '/',
    query: { category }
  }, { replace: true })
  
  await loadMovies(1, false)
}

const loadMovies = async (page: number = 1, append: boolean = false) => {
  if (loading.value) return
  
  try {
    loading.value = true
    error.value = null
    
    let response: any = null
    
    switch (selectedCategory.value) {
      case 'popular':
        response = await getPopularMovies(page)
        break
      case 'top_rated':
        response = await getTopRatedMovies(page)
        break
      case 'animation':
        response = await getMoviesByGenre(16, page)
        break
      case 'comedy':
        response = await getMoviesByGenre(35, page)
        break
      default:
        response = await getPopularMovies(page)
    }
    
    const moviesList = response.movies
    
    if (append) {
      movies.value.push(...moviesList)
    } else {
      movies.value = moviesList
    }
    
    hasMorePages.value = page < response.totalPages
    currentPage.value = page
    
  } catch (err) {
    error.value = 'Não foi possível carregar os filmes. Tente novamente.'
    console.error('Erro ao carregar filmes:', err)
  } finally {
    loading.value = false
  }
}

const loadMore = () => {
  if (hasMorePages.value && !loading.value) {
    loadMovies(currentPage.value + 1, true)
  }
}

const refresh = () => {
  currentPage.value = 1
  hasMorePages.value = true
  loadMovies(1, false)
}

const viewMovieDetails = (movie: Movie) => {
  console.log('Ver detalhes do filme:', movie)
}

onMounted(() => {
  initializeCategory()
  loadMovies()
})

watch(() => route.query.category, (newCategory) => {
  if (newCategory && typeof newCategory === 'string' && 
      ['popular', 'top_rated', 'animation', 'comedy'].includes(newCategory)) {
    selectedCategory.value = newCategory
    loadMovies(1, false)
  }
})
</script>
