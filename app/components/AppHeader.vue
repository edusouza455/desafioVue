<template>
  <header class="bg-dark-900 border-b border-dark-800 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <div class="flex items-center">
          <NuxtLink to="/" class="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div>
              <span class="text-xl font-bold text-white">Vue</span>
              <span class="text-xl font-bold text-vue-400">Movie</span>
            </div>
          </NuxtLink>
        </div>

        <!-- Navigation Desktop -->
        <nav class="hidden md:flex items-center space-x-8">
          <NuxtLink 
            to="/" 
            class="flex items-center space-x-2 text-gray-300 hover:text-vue-400 transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-dark-800"
            active-class="text-vue-400 bg-dark-800"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5l4-2 4 2"/>
            </svg>
            <span class="font-medium">Home</span>
          </NuxtLink>
          
          <NuxtLink 
            to="/search" 
            class="flex items-center space-x-2 text-gray-300 hover:text-vue-400 transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-dark-800"
            active-class="text-vue-400 bg-dark-800"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <span class="font-medium">Buscar</span>
          </NuxtLink>
          
          <NuxtLink 
            to="/fav" 
            class="flex items-center space-x-2 text-gray-300 hover:text-vue-400 transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-dark-800 relative"
            active-class="text-vue-400 bg-dark-800"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
            </svg>
            <span class="font-medium">Favoritos</span>
            <!-- Badge de favoritos -->
            <span 
              v-if="favoritesCount > 0" 
              class="absolute -top-1 -right-1 bg-vue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold"
            >
              {{ favoritesCount > 99 ? '99+' : favoritesCount }}
            </span>
          </NuxtLink>
        </nav>

        <!-- Quick Search Desktop -->
        <div class="hidden lg:flex items-center max-w-sm w-full mx-8">
          <div class="relative w-full">
            <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input 
              v-model="quickSearch"
              @input="onQuickSearchInput"
              @keydown.enter="handleQuickSearch"
              @focus="showSuggestions = true"
              @blur="hideSuggestions"
              type="text" 
              placeholder="Buscar filmes..."
              class="w-full pl-12 pr-4 py-3 bg-dark-800 text-white rounded-xl border border-dark-700 focus:outline-none focus:ring-2 focus:ring-vue-500 focus:border-vue-500 placeholder-gray-400"
            >
            
            <!-- Dropdown de Sugestões -->
            <div 
              v-if="showSuggestions && (filteredSuggestions.length > 0 || recentSearches.length > 0)" 
              class="absolute top-full left-0 right-0 mt-2 bg-dark-800 border border-dark-700 rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto"
            >
              <!-- Sugestões de busca rápida -->
              <div v-if="filteredSuggestions.length > 0" class="p-2">
                <div class="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Sugestões
                </div>
                <button
                  v-for="suggestion in filteredSuggestions"
                  :key="suggestion"
                  @mousedown="selectSuggestion(suggestion)"
                  class="w-full text-left px-3 py-2 text-gray-300 hover:bg-dark-700 hover:text-white rounded-lg transition-colors flex items-center space-x-2"
                >
                  <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                  <span>{{ suggestion }}</span>
                </button>
              </div>
              
              <!-- Histórico de buscas recentes -->
              <div v-if="recentSearches.length > 0" class="p-2 border-t border-dark-700">
                <div class="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Buscas Recentes
                </div>
                <button
                  v-for="recent in recentSearches.slice(0, 3)"
                  :key="recent"
                  @mousedown="selectSuggestion(recent)"
                  class="w-full text-left px-3 py-2 text-gray-300 hover:bg-dark-700 hover:text-white rounded-lg transition-colors flex items-center space-x-2"
                >
                  <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span>{{ recent }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>


        <!-- Mobile menu button -->
        <div class="md:hidden">
          <button 
            @click="toggleMobileMenu"
            class="p-2 text-gray-300 hover:text-vue-400 focus:outline-none focus:text-vue-400 rounded-lg hover:bg-dark-800 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path 
                v-if="!mobileMenuOpen" 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M4 6h16M4 12h16M4 18h16"
              />
              <path 
                v-else 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    <div 
      v-show="mobileMenuOpen" 
      class="md:hidden bg-dark-800 border-t border-dark-700"
    >
      <div class="px-2 pt-2 pb-3 space-y-1">
        <!-- Mobile Search -->
        <div class="px-3 py-2">
          <div class="relative">
            <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input 
              v-model="quickSearch"
              @input="onQuickSearchInput"
              @keydown.enter="handleQuickSearch"
              type="text" 
              placeholder="Buscar filmes..."
              class="w-full pl-10 pr-4 py-2 bg-dark-700 text-white rounded-lg border border-dark-600 focus:outline-none focus:ring-2 focus:ring-vue-500 focus:border-vue-500 text-sm placeholder-gray-400"
            >
          </div>
        </div>

        <!-- Mobile Navigation Links -->
        <NuxtLink 
          to="/" 
          @click="closeMobileMenu"
          class="flex items-center space-x-2 text-gray-300 hover:text-vue-400 hover:bg-dark-700 px-3 py-2 rounded-md text-base font-medium transition-colors"
          active-class="text-vue-400 bg-dark-700"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5l4-2 4 2"/>
          </svg>
          <span>Home</span>
        </NuxtLink>
        
        <NuxtLink 
          to="/search" 
          @click="closeMobileMenu"
          class="flex items-center space-x-2 text-gray-300 hover:text-vue-400 hover:bg-dark-700 px-3 py-2 rounded-md text-base font-medium transition-colors"
          active-class="text-vue-400 bg-dark-700"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <span>Buscar</span>
        </NuxtLink>
        
        <NuxtLink 
          to="/fav" 
          @click="closeMobileMenu"
          class="flex items-center space-x-2 text-gray-300 hover:text-vue-400 hover:bg-dark-700 px-3 py-2 rounded-md text-base font-medium transition-colors relative"
          active-class="text-vue-400 bg-dark-700"
        >
          <div class="flex items-center space-x-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
            </svg>
            <span>Favoritos</span>
            <span 
              v-if="favoritesCount > 0" 
              class="bg-vue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold ml-2"
            >
              {{ favoritesCount > 99 ? '99+' : favoritesCount }}
            </span>
          </div>
        </NuxtLink>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useFavoritesStore } from '~/stores/favorites'

// Estado do menu mobile
const mobileMenuOpen = ref(false)
const quickSearch = ref('')
const showSuggestions = ref(false)

// Store de favoritos
const favoritesStore = useFavoritesStore()
const favoritesCount = computed(() => favoritesStore.favoritesCount)

// Sugestões de busca
const searchSuggestions = ref([
  'Marvel', 'Vingadores', 'Harry Potter', 'Star Wars', 
  'Senhor dos Anéis', 'Pixar', 'Disney', 'DC Comics',
  'James Bond', 'Fast and Furious', 'Jurassic Park'
])

// Histórico de buscas (localStorage)
const recentSearches = ref<string[]>([])

// Debounce timer
let searchTimeout: NodeJS.Timeout | null = null

// Carregar histórico do localStorage
onMounted(() => {
  if (process.client) {
    const saved = localStorage.getItem('recentSearches')
    if (saved) {
      recentSearches.value = JSON.parse(saved)
    }
  }
})

// Salvar no localStorage
const saveRecentSearch = (query: string) => {
  if (process.client) {
    const trimmed = query.trim()
    if (!trimmed) return
    
    // Remove se já existe
    const filtered = recentSearches.value.filter(search => search !== trimmed)
    // Adiciona no início
    recentSearches.value = [trimmed, ...filtered].slice(0, 5) // Máximo 5 itens
    
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches.value))
  }
}

// Filtrar sugestões baseado no texto digitado
const filteredSuggestions = computed(() => {
  if (!quickSearch.value.trim()) return searchSuggestions.value.slice(0, 5)
  
  return searchSuggestions.value.filter(suggestion => 
    suggestion.toLowerCase().includes(quickSearch.value.toLowerCase())
  ).slice(0, 5)
})

// Funções do menu mobile
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

// Função de busca rápida melhorada
const handleQuickSearch = () => {
  if (quickSearch.value.trim()) {
    saveRecentSearch(quickSearch.value)
    navigateTo(`/search?q=${encodeURIComponent(quickSearch.value)}`)
    quickSearch.value = ''
    showSuggestions.value = false
    closeMobileMenu()
  }
}

// Input da busca rápida com debounce
const onQuickSearchInput = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  
  searchTimeout = setTimeout(() => {
    // Mostrar sugestões se há texto
    showSuggestions.value = quickSearch.value.trim().length > 0
  }, 150)
}

// Selecionar sugestão
const selectSuggestion = (suggestion: string) => {
  quickSearch.value = suggestion
  handleQuickSearch()
}

// Esconder sugestões com delay para permitir cliques
const hideSuggestions = () => {
  setTimeout(() => {
    showSuggestions.value = false
  }, 200)
}

// Fecha o menu mobile quando a rota muda
watch(() => useRoute().path, () => {
  closeMobileMenu()
  showSuggestions.value = false
})

// Fecha o menu mobile quando clica fora
onMounted(() => {
  const handleClickOutside = (event: Event) => {
    const target = event.target as Element
    if (!target?.closest('header') && mobileMenuOpen.value) {
      closeMobileMenu()
    }
  }
  
  document.addEventListener('click', handleClickOutside)
  
  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })
})
</script>
