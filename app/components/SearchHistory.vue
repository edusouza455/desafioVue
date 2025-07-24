<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">🕒 Buscas Recentes</h3>
    
    <div v-if="searchHistory.length > 0" class="space-y-2">
      <button 
        v-for="(search, index) in searchHistory" 
        :key="index"
        @click="$emit('search-selected', search)"
        class="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-between group"
      >
        <span class="truncate">{{ search }}</span>
        <button 
          @click.stop="removeFromHistory(index)"
          class="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all"
          title="Remover do histórico"
        >
          ✕
        </button>
      </button>
      
      <button 
        @click="clearHistory"
        class="w-full text-center py-2 text-sm text-gray-500 hover:text-red-600 transition-colors"
      >
        Limpar histórico
      </button>
    </div>
    
    <div v-else class="text-center py-8">
      <div class="text-4xl mb-2">🔍</div>
      <p class="text-gray-500 text-sm">Suas buscas aparecerão aqui</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  'search-selected': [search: string]
}>()

// Estado do histórico
const searchHistory = ref<string[]>([])

// Adicionar busca ao histórico
const addToHistory = (search: string) => {
  if (!search.trim()) return
  
  // Remove se já existe
  const index = searchHistory.value.indexOf(search)
  if (index > -1) {
    searchHistory.value.splice(index, 1)
  }
  
  // Adiciona no início
  searchHistory.value.unshift(search)
  
  // Mantém apenas os últimos 10
  if (searchHistory.value.length > 10) {
    searchHistory.value = searchHistory.value.slice(0, 10)
  }
  
  // Salva no localStorage
  saveToLocalStorage()
}

// Remover busca do histórico
const removeFromHistory = (index: number) => {
  searchHistory.value.splice(index, 1)
  saveToLocalStorage()
}

// Limpar histórico
const clearHistory = () => {
  searchHistory.value = []
  saveToLocalStorage()
}

// Salvar no localStorage
const saveToLocalStorage = () => {
  if (process.client) {
    try {
      localStorage.setItem('vuemovie-search-history', JSON.stringify(searchHistory.value))
    } catch (error) {
      console.error('Erro ao salvar histórico de busca:', error)
    }
  }
}

// Carregar do localStorage
const loadFromLocalStorage = () => {
  if (process.client) {
    try {
      const saved = localStorage.getItem('vuemovie-search-history')
      if (saved) {
        searchHistory.value = JSON.parse(saved)
      }
    } catch (error) {
      console.error('Erro ao carregar histórico de busca:', error)
      searchHistory.value = []
    }
  }
}

// Expor funções para o componente pai
defineExpose({
  addToHistory
})

// Carregar histórico ao montar
onMounted(() => {
  loadFromLocalStorage()
})
</script>
