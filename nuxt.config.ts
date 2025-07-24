// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  
  // Configurações específicas do Nuxt 4
  future: {
    compatibilityVersion: 4
  },
  
  // Módulos
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt'
  ],
  
  // Auto-imports
  imports: {
    dirs: [
      'composables/**',
      'stores/**'
    ]
  },
  
  // Configuração de runtime
  runtimeConfig: {
    // Private keys (only available on server-side)
    tmdbApiKey: process.env.NUXT_TMDB_API_KEY,
    
    // Public keys (exposed to client-side)
    public: {
      tmdbBaseUrl: process.env.NUXT_TMDB_BASE_URL || 'https://api.themoviedb.org/3',
      tmdbImageBaseUrl: process.env.NUXT_TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p'
    }
  },
  
  // Configuração TypeScript mais simples
  typescript: {
    strict: false,
    typeCheck: false
  },

  // Configuração de build estático
  nitro: {
    preset: 'static',
    prerender: {
      failOnError: false
    }
  },

  // Configuração de roteamento
  pages: true,

  // Configuração do servidor de desenvolvimento
  devServer: {
    host: '0.0.0.0',
    port: 3000
  },

  // Configuração do Vite
  vite: {
    server: {
      hmr: {
        clientPort: 443
      }
    },
    define: {
      global: 'globalThis'
    }
  },
  
  // Configuração de SEO
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'VueMovie - Seus filmes favoritos',
      meta: [
        { name: 'description', content: 'Organize e descubra seus filmes favoritos com VueMovie' }
      ]
    }
  }
})
