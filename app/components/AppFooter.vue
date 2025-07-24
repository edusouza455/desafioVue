<template>
  <footer class="bg-dark-900 border-t border-dark-800 mt-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <!-- Brand Section -->
        <div class="lg:col-span-1">
          <div class="flex items-center space-x-3 mb-4">
            <div>
              <span class="text-xl font-bold text-white">Vue</span>
              <span class="text-xl font-bold text-vue-400">Movie</span>
            </div>
          </div>
          <p class="text-gray-400 text-sm mb-4">
            Sua plataforma favorita para descobrir, explorar e organizar os melhores filmes do cinema mundial.
          </p>
          <div class="flex space-x-4">
            <a href="https://github.com/edusouza455/desafioVue" target="_blank" class="text-gray-400 hover:text-vue-400 transition-colors">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
          </div>
        </div>

        <div>
          <h3 class="text-white font-semibold mb-4">Navegação</h3>
          <ul class="space-y-2">
            <li>
              <NuxtLink to="/" class="text-gray-400 hover:text-vue-400 transition-colors text-sm">
                Home
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/search" class="text-gray-400 hover:text-vue-400 transition-colors text-sm">
                Buscar Filmes
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/fav" class="text-gray-400 hover:text-vue-400 transition-colors text-sm">
                Meus Favoritos
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="text-white font-semibold mb-4">Categorias</h3>
          <ul class="space-y-2">
            <li>
              <NuxtLink to="/?category=popular" class="text-gray-400 hover:text-vue-400 transition-colors text-sm">
                Populares
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/?category=top_rated" class="text-gray-400 hover:text-vue-400 transition-colors text-sm">
                Melhor Avaliados
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/?category=animation" class="text-gray-400 hover:text-vue-400 transition-colors text-sm">
                Animação
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/?category=comedy" class="text-gray-400 hover:text-vue-400 transition-colors text-sm">
                Comédia
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="text-white font-semibold mb-4">Informações</h3>
          <div class="space-y-3">
            <div class="text-sm">
              <span class="text-gray-500">Filmes catalogados:</span>
              <span class="text-vue-400 font-semibold ml-1">{{ movieStats.total }}+</span>
            </div>
            <div class="text-sm">
              <span class="text-gray-500">Seus favoritos:</span>
              <span class="text-vue-400 font-semibold ml-1">{{ favoritesCount }}</span>
            </div>
          </div>
          
          <div class="mt-6">
            <h4 class="text-white text-sm font-medium mb-3">Desenvolvido com</h4>
            <div class="flex flex-wrap gap-2">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-vue-900 bg-opacity-30 text-vue-400 border border-vue-700">
                Vue.js
              </span>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-dark-700 text-gray-300 border border-dark-600">
                Nuxt 4
              </span>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900 bg-opacity-30 text-blue-400 border border-blue-700">
                TypeScript
              </span>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-900 bg-opacity-30 text-cyan-400 border border-cyan-700">
                Tailwind
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="border-t border-dark-800 py-6">
        <div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div class="flex items-center space-x-4 text-sm text-gray-400">
            <span>&copy; {{ currentYear }} VueMovie. Todos os direitos reservados.</span>
          </div>
          
          <div class="flex items-center space-x-6 text-sm">
            <button 
              @click="scrollToTop" 
              class="flex items-center space-x-1 text-gray-400 hover:text-vue-400 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
              </svg>
              <span>Voltar ao topo</span>
            </button>
            
            <div class="flex items-center space-x-1 text-gray-500">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
              <span>Feito por</span>
              <a href="https://github.com/edusouza455" target="_blank" class="text-vue-400 hover:text-vue-300 font-medium">
                Eduardo Souza
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="border-t border-dark-800 py-4">
        <div class="text-center">
          <p class="text-xs text-gray-500">
            Dados fornecidos por 
            <a href="https://www.themoviedb.org/" target="_blank" class="text-vue-400 hover:text-vue-300 font-medium">
              The Movie Database (TMDB)
            </a>
            • Este produto usa a TMDB API mas não é endossado ou certificado pela TMDB.
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { useFavorites } from '~/stores/favorites'

const currentYear = new Date().getFullYear()

const { favoritesCount } = useFavorites()

const movieStats = ref({
  total: formatNumber(850000),
  users: formatNumber(120000)
})

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(0) + 'K'
  }
  return num.toString()
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}
</script>
