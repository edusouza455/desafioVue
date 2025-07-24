<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="text-center">
      <div class="text-8xl mb-4">🎬</div>
      <h1 class="text-4xl font-bold text-gray-800 mb-2">
        {{ error.statusCode || 'Erro' }}
      </h1>
      <p class="text-xl text-gray-600 mb-6">
        {{ error.statusMessage || 'Algo deu errado!' }}
      </p>
      <div class="space-x-4">
        <button 
          @click="handleError" 
          class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          🔄 Tentar Novamente
        </button>
        <NuxtLink 
          to="/" 
          class="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors inline-block"
        >
          🏠 Voltar ao Início
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
// Props do erro
const props = defineProps({
  error: Object
})

// Função para lidar com erro
const handleError = () => {
  clearError({ redirect: '/' })
}
</script>
