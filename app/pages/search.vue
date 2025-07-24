<template>
  <div class="bg-dark-950">
    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-dark-900 to-vue-900 text-white py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h1 class="text-3xl md:text-4xl font-bold mb-4">
            Buscar Filmes
          </h1>
          <p class="text-lg text-gray-300 mb-8">
            Encontre seus filmes favoritos na maior base de dados do cinema
          </p>
          
          <!-- Barra de busca principal -->
          <div class="max-w-2xl mx-auto">
            <div class="relative">
              <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input 
                v-model="searchQuery"
                @input="onSearchInput"
                @keydown.enter="performSearch"
                type="text" 
                placeholder="Digite o nome do filme, ator ou diretor..."
                class="w-full pl-12 pr-24 py-4 bg-dark-800 text-white rounded-xl border border-dark-700 focus:outline-none focus:ring-2 focus:ring-vue-500 focus:border-vue-500 text-lg"
                :disabled="isLoading"
              >
              <button 
                @click="performSearch"
                :disabled="isLoading || !searchQuery.trim()"
                class="absolute right-2 top-2 bottom-2 px-6 bg-vue-600 text-white rounded-lg hover:bg-vue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                <svg v-if="isLoading" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Filtros -->
    <section class="bg-dark-900 border-b border-dark-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex flex-wrap items-center gap-4">
          <!-- Filtro por gênero -->
          <div class="flex items-center space-x-2">
            <label class="text-sm font-medium text-gray-300">Gênero:</label>
            <select 
              v-model="selectedGenre"
              @change="applyFilters"
              class="bg-dark-800 border border-dark-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-vue-500"
            >
              <option value="">Todos os gêneros</option>
              <option 
                v-for="genre in genres" 
                :key="genre.id" 
                :value="genre.id"
              >
                {{ genre.name }}
              </option>
            </select>
          </div>

          <!-- Filtro por ano -->
          <div class="flex items-center space-x-2">
            <label class="text-sm font-medium text-gray-300">Ano:</label>
            <select 
              v-model="selectedYear"
              @change="applyFilters"
              class="bg-dark-800 border border-dark-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-vue-500"
            >
              <option value="">Qualquer ano</option>
              <option 
                v-for="year in yearOptions" 
                :key="year" 
                :value="year"
              >
                {{ year }}
              </option>
            </select>
          </div>

          <!-- Ordenação -->
          <div class="flex items-center space-x-2">
            <label class="text-sm font-medium text-gray-300">Ordenar por:</label>
            <select 
              v-model="sortBy"
              @change="applyFilters"
              class="bg-dark-800 border border-dark-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-vue-500"
            >
              <option value="popularity.desc">Popularidade</option>
              <option value="vote_average.desc">Melhor Avaliação</option>
              <option value="release_date.desc">Mais Recentes</option>
              <option value="title.asc">Título A-Z</option>
            </select>
          </div>

          <!-- Limpar filtros -->
          <button 
            v-if="hasActiveFilters"
            @click="clearFilters"
            class="text-sm text-vue-400 hover:text-vue-300 underline"
          >
            Limpar filtros
          </button>
        </div>
      </div>
    </section>

    <!-- Resultados -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header dos resultados -->
      <div v-if="searchQuery || hasResults" class="flex justify-between items-center mb-6">
        <div>
          <h2 class="text-2xl font-bold text-white">
            {{ searchQuery ? `Resultados para "${searchQuery}"` : 'Filmes Populares' }}
          </h2>
          <p class="text-gray-400 mt-1">
            {{ totalResults > 0 ? `${totalResults} ${totalResults === 1 ? 'filme encontrado' : 'filmes encontrados'}` : 'Nenhum resultado encontrado' }}
          </p>
        </div>
        
        <!-- View toggle -->
        <div class="flex items-center space-x-2">
          <button 
            @click="viewMode = 'grid'"
            :class="[
              'p-2 rounded-lg transition-colors',
              viewMode === 'grid' ? 'bg-vue-900 bg-opacity-30 text-vue-400' : 'text-gray-400 hover:text-gray-300'
            ]"
            title="Visualização em grade"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
            </svg>
          </button>
          <button 
            @click="viewMode = 'list'"
            :class="[
              'p-2 rounded-lg transition-colors',
              viewMode === 'list' ? 'bg-vue-900 bg-opacity-30 text-vue-400' : 'text-gray-400 hover:text-gray-300'
            ]"
            title="Visualização em lista"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        <p class="mt-4 text-gray-600">Buscando filmes...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <div class="text-red-500 text-6xl mb-4">⚠️</div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">Erro na busca</h3>
        <p class="text-gray-600 mb-4">{{ error }}</p>
        <button 
          @click="retry" 
          class="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          Tentar Novamente
        </button>
      </div>

      <!-- Empty State -->
      <div v-else-if="searchQuery && movies.length === 0 && !isLoading" class="text-center py-12">
        <div class="text-6xl mb-4">🎬</div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">Nenhum filme encontrado</h3>
        <p class="text-gray-600 mb-6">Tente buscar com termos diferentes ou ajustar os filtros.</p>
        <div class="space-x-4">
          <button 
            @click="clearSearch" 
            class="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Nova Busca
          </button>
          <NuxtLink 
            to="/" 
            class="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors inline-block"
          >
            Ver Populares
          </NuxtLink>
        </div>
      </div>

      <!-- Results Grid -->
      <div v-else-if="movies.length > 0">
        <!-- Grid View -->
        <div v-if="viewMode === 'grid'" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          <MovieCard 
            v-for="movie in movies" 
            :key="movie.id" 
            :movie="formatMovieForCard(movie)"
            @view-details="viewMovieDetails"
          />
        </div>

        <!-- List View -->
        <div v-else class="space-y-4">
          <div 
            v-for="movie in movies" 
            :key="movie.id"
            class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div class="flex">
              <img 
                :src="getImageUrl(movie.poster_path, 'w185')" 
                :alt="movie.title"
                class="w-24 h-36 object-cover"
                @error="handleImageError"
              >
              <div class="flex-1 p-4">
                <div class="flex justify-between items-start">
                  <div class="flex-1">
                    <h3 class="font-semibold text-lg text-gray-900 mb-2">{{ movie.title }}</h3>
                    <p class="text-sm text-gray-600 mb-2">{{ formatReleaseYear(movie.release_date) }}</p>
                    <p v-if="movie.overview" class="text-sm text-gray-700 line-clamp-2">{{ movie.overview }}</p>
                  </div>
                  <div class="flex flex-col items-end space-y-2 ml-4">
                    <span class="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                      ⭐ {{ movie.vote_average?.toFixed(1) || 'N/A' }}
                    </span>
                    <NuxtLink 
                      :to="`/movie/${movie.id}`"
                      class="text-purple-600 hover:text-purple-700 text-sm font-medium"
                    >
                      Ver detalhes →
                    </NuxtLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="mt-8 flex justify-center">
          <nav class="flex items-center space-x-2">
            <button 
              @click="goToPage(currentPage - 1)"
              :disabled="currentPage === 1 || isLoading"
              class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            
            <template v-for="page in visiblePages" :key="page">
              <button 
                v-if="page !== '...'"
                @click="goToPage(page as number)"
                :class="[
                  'px-3 py-2 text-sm font-medium border rounded-md',
                  page === currentPage 
                    ? 'text-purple-600 bg-purple-50 border-purple-500' 
                    : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-50'
                ]"
              >
                {{ page }}
              </button>
              <span v-else class="px-3 py-2 text-sm font-medium text-gray-500">...</span>
            </template>
            
            <button 
              @click="goToPage(currentPage + 1)"
              :disabled="currentPage === totalPages || isLoading"
              class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Próxima
            </button>
          </nav>
        </div>
      </div>

      <!-- Default State (when no search) -->
      <div v-else-if="!searchQuery && !isLoading" class="text-center py-12">
        <div class="text-6xl mb-4">🍿</div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">Pronto para descobrir filmes incríveis?</h3>
        <p class="text-gray-600 mb-8">Use a barra de busca acima para encontrar seus filmes favoritos.</p>
        
        <!-- Sugestões de busca -->
        <div class="max-w-md mx-auto">
          <h4 class="text-sm font-medium text-gray-700 mb-3">Sugestões populares:</h4>
          <div class="flex flex-wrap gap-2 justify-center">
            <button 
              v-for="suggestion in searchSuggestions"
              :key="suggestion"
              @click="searchSuggestion(suggestion)"
              class="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors"
            >
              {{ suggestion }}
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { Movie, TMDBMovie, TMDBGenre } from '~/types'

// Composables
const { searchMovies, getPopularMovies, getGenres, getImageUrl, discoverMovies } = useTMDB()

// Meta tags
usePageMeta('Buscar Filmes', 'Encontre seus filmes favoritos na maior base de dados do cinema')

// Estado reativo
const searchQuery = ref('')
const movies = ref<Movie[]>([])
const genres = ref<TMDBGenre[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)

// Filtros
const selectedGenre = ref('')
const selectedYear = ref('')
const sortBy = ref('popularity.desc')
const viewMode = ref<'grid' | 'list'>('grid')

// Paginação
const currentPage = ref(1)
const totalPages = ref(0)
const totalResults = ref(0)

// Computed
const hasResults = computed(() => movies.value.length > 0)
const hasActiveFilters = computed(() => selectedGenre.value || selectedYear.value || sortBy.value !== 'popularity.desc')

// Opções de ano (últimos 30 anos)
const yearOptions = computed(() => {
  const currentYear = new Date().getFullYear()
  const years = []
  for (let year = currentYear; year >= currentYear - 30; year--) {
    years.push(year)
  }
  return years
})

// Páginas visíveis na paginação
const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    pages.push(1)
    if (current > 4) pages.push('...')
    
    const start = Math.max(2, current - 1)
    const end = Math.min(total - 1, current + 1)
    
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    
    if (current < total - 3) pages.push('...')
    pages.push(total)
  }
  
  return pages
})

// Sugestões de busca
const searchSuggestions = ref([
  'Marvel', 'Vingadores', 'Harry Potter', 'Star Wars', 
  'Senhor dos Anéis', 'Pixar', 'Disney', 'DC Comics'
])

// Debounce para busca automática
let searchTimeout: NodeJS.Timeout | null = null

// Métodos
const performSearch = async (page: number = 1) => {
  try {
    isLoading.value = true
    error.value = null
    
    // Se há filtros ativos, usar discoverMovies, senão usar busca normal
    if (hasActiveFilters.value || (!searchQuery.value.trim() && (selectedGenre.value || selectedYear.value))) {
      const filters = {
        query: searchQuery.value.trim(),
        page,
        genre: selectedGenre.value,
        year: selectedYear.value,
        sortBy: sortBy.value
      }
      
      const response = await discoverMovies(filters)
      
      movies.value = response.movies
      totalResults.value = response.totalResults
      totalPages.value = response.totalPages
      currentPage.value = page
      
    } else if (searchQuery.value.trim()) {
      const response = await searchMovies(searchQuery.value.trim(), page)
      
      movies.value = response.movies
      totalResults.value = response.totalResults
      totalPages.value = response.totalPages
      currentPage.value = page
      
    } else {
      await loadPopularMovies(page)
    }
    
  } catch (err) {
    error.value = 'Erro ao buscar filmes. Tente novamente.'
    console.error('Erro na busca:', err)
  } finally {
    isLoading.value = false
  }
}

const loadPopularMovies = async (page: number = 1) => {
  try {
    isLoading.value = true
    error.value = null
    
    const response = await getPopularMovies(page)
    
    movies.value = response.movies
    totalResults.value = response.totalResults
    totalPages.value = response.totalPages
    currentPage.value = page
    
  } catch (err) {
    error.value = 'Erro ao carregar filmes populares.'
    console.error('Erro:', err)
  } finally {
    isLoading.value = false
  }
}

const onSearchInput = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  
  searchTimeout = setTimeout(() => {
    if (searchQuery.value.trim().length >= 3) {
      performSearch()
    } else if (searchQuery.value.trim().length === 0) {
      loadPopularMovies()
    }
  }, 500)
}

const applyFilters = async () => {
  try {
    isLoading.value = true
    error.value = null
    
    const filters = {
      query: searchQuery.value.trim(),
      page: 1,
      genre: selectedGenre.value,
      year: selectedYear.value,
      sortBy: sortBy.value
    }
    
    const response = await discoverMovies(filters)
    
    movies.value = response.movies
    totalResults.value = response.totalResults
    totalPages.value = response.totalPages
    currentPage.value = 1
    
  } catch (err) {
    error.value = 'Erro ao aplicar filtros. Tente novamente.'
    console.error('Erro nos filtros:', err)
  } finally {
    isLoading.value = false
  }
}

const clearFilters = () => {
  selectedGenre.value = ''
  selectedYear.value = ''
  sortBy.value = 'popularity.desc'
  performSearch()
}

const clearSearch = () => {
  searchQuery.value = ''
  clearFilters()
  loadPopularMovies()
}

const searchSuggestion = (suggestion: string) => {
  searchQuery.value = suggestion
  performSearch()
}

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value && page !== currentPage.value) {
    performSearch(page)
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const retry = () => {
  performSearch()
}

const viewMovieDetails = (movie: Movie) => {
  navigateTo(`/movie/${movie.id}`)
}

// Utilitários
const formatReleaseYear = (date: string | null) => {
  if (!date) return 'Ano desconhecido'
  return new Date(date).getFullYear()
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/placeholder-movie.svg'
}

const formatMovieForCard = (tmdbMovie: TMDBMovie): Movie => {
  return {
    id: tmdbMovie.id,
    title: tmdbMovie.title,
    overview: tmdbMovie.overview,
    poster_path: tmdbMovie.poster_path,
    release_date: tmdbMovie.release_date,
    vote_average: tmdbMovie.vote_average,
    // Campos legados para compatibilidade
    rating: tmdbMovie.vote_average,
    description: tmdbMovie.overview,
    posterUrl: getImageUrl(tmdbMovie.poster_path),
    releaseYear: tmdbMovie.release_date ? new Date(tmdbMovie.release_date).getFullYear() : undefined
  }
}

// Carregar dados iniciais
onMounted(async () => {
  // Verificar se há query na URL
  const route = useRoute()
  if (route.query.q) {
    searchQuery.value = route.query.q as string
  }
  
  // Carregar gêneros
  try {
    const genresResponse = await getGenres()
    genres.value = genresResponse
  } catch (err) {
    console.error('Erro ao carregar gêneros:', err)
  }
  
  // Se há uma query na URL, fazer a busca, senão carregar populares
  if (searchQuery.value.trim()) {
    await performSearch()
  } else {
    await loadPopularMovies()
  }
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
