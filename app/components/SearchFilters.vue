<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">🔧 Filtros Avançados</h3>
    
    <div class="space-y-4">
      <!-- Gênero -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Gênero</label>
        <select 
          v-model="filters.genre"
          @change="$emit('filter-change', filters)"
          class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
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

      <!-- Ano -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Ano de Lançamento</label>
        <div class="grid grid-cols-2 gap-2">
          <select 
            v-model="filters.yearFrom"
            @change="$emit('filter-change', filters)"
            class="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">De</option>
            <option 
              v-for="year in yearOptions" 
              :key="`from-${year}`" 
              :value="year"
            >
              {{ year }}
            </option>
          </select>
          <select 
            v-model="filters.yearTo"
            @change="$emit('filter-change', filters)"
            class="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Até</option>
            <option 
              v-for="year in yearOptions" 
              :key="`to-${year}`" 
              :value="year"
            >
              {{ year }}
            </option>
          </select>
        </div>
      </div>

      <!-- Rating -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Avaliação Mínima: {{ filters.rating }}
        </label>
        <input 
          v-model.number="filters.rating"
          @input="$emit('filter-change', filters)"
          type="range" 
          min="0" 
          max="10" 
          step="0.5"
          class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        >
        <div class="flex justify-between text-xs text-gray-500 mt-1">
          <span>0</span>
          <span>5</span>
          <span>10</span>
        </div>
      </div>

      <!-- Ordenação -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Ordenar por</label>
        <select 
          v-model="filters.sortBy"
          @change="$emit('filter-change', filters)"
          class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="popularity.desc">Mais Populares</option>
          <option value="vote_average.desc">Melhor Avaliação</option>
          <option value="release_date.desc">Mais Recentes</option>
          <option value="release_date.asc">Mais Antigos</option>
          <option value="title.asc">Título A-Z</option>
          <option value="title.desc">Título Z-A</option>
        </select>
      </div>

      <!-- Ações -->
      <div class="flex space-x-2 pt-4">
        <button 
          @click="applyFilters"
          class="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          Aplicar Filtros
        </button>
        <button 
          @click="clearFilters"
          class="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Limpar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TMDBGenre } from '~/types'

interface Filters {
  genre: string
  yearFrom: string
  yearTo: string
  rating: number
  sortBy: string
}

interface Props {
  genres: TMDBGenre[]
  modelValue: Filters
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'filter-change': [filters: Filters]
  'apply-filters': [filters: Filters]
  'clear-filters': []
}>()

// Estado local dos filtros
const filters = ref<Filters>({ ...props.modelValue })

// Opções de ano
const yearOptions = computed(() => {
  const currentYear = new Date().getFullYear()
  const years = []
  for (let year = currentYear; year >= 1900; year--) {
    years.push(year)
  }
  return years
})

// Aplicar filtros
const applyFilters = () => {
  emit('apply-filters', filters.value)
}

// Limpar filtros
const clearFilters = () => {
  filters.value = {
    genre: '',
    yearFrom: '',
    yearTo: '',
    rating: 0,
    sortBy: 'popularity.desc'
  }
  emit('clear-filters')
}

// Sincronizar com props
watch(() => props.modelValue, (newValue) => {
  filters.value = { ...newValue }
}, { deep: true })
</script>

<style scoped>
/* Customizar slider */
input[type="range"]::-webkit-slider-thumb {
  appearance: none;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #9333ea;
  cursor: pointer;
}

input[type="range"]::-moz-range-thumb {
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #9333ea;
  cursor: pointer;
  border: none;
}
</style>
