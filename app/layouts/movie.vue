<template>
  <div class="movie-layout">
    <!-- Header específico para filmes -->
    <div class="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 mb-6">
      <h2 class="text-2xl font-bold">🎬 Área de Filmes</h2>
      <p class="opacity-90">Explore e favorite seus filmes preferidos</p>
    </div>
    
    <!-- Conteúdo da página -->
    <div class="container mx-auto px-4">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.movie-layout {
  min-height: calc(100vh - 200px);
}
</style>
