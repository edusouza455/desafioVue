<template>
  <div class="min-h-screen bg-dark-950 flex flex-col">
    <!-- Header Component -->
    <AppHeader />
    
    <!-- Main Content -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Footer Component -->
    <AppFooter />
  </div>
</template>

<script setup>
// Components are auto-imported
</script>
