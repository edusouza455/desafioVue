# 🎬 VueMovie - Aplicação de Filmes

Uma aplicação moderna para descobrir, explorar e organizar seus filmes favoritos, desenvolvida com Vue.js 3, Nuxt 4 e integração com a API do TMDB.

![Vue.js](https://img.shields.io/badge/Vue.js-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![Nuxt](https://img.shields.io/badge/Nuxt-00DC82?style=for-the-badge&logo=nuxt.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

## ✨ Funcionalidades

- 🔍 **Busca avançada** com filtros por gênero, ano e ordenação
- 📂 **Categorias** - Popular, Animação, Comédia, Top Rated
- ❤️ **Sistema de favoritos** com persistência local
- 🎬 **Detalhes completos** de filmes com informações da TMDB
- 📱 **Interface responsiva** para todos os dispositivos
- 🔔 **Notificações** para feedback do usuário
- ⚡ **Performance otimizada** com paginação e lazy loading

## 🛠 Stack Tecnológica

- **Vue.js 3.5.17** + **Nuxt 4.0.1** + **TypeScript**
- **Tailwind CSS** + **Pinia** + **Vue Toastification**
- **TMDB API** + **Docker** + **Nginx**

## 🚀 Como usar

### 🐳 Com Docker (Recomendado)

1. **Setup**:
```bash
git clone https://github.com/edusouza455/desafioVue.git
cd desafioVue
echo "TMDB_API_KEY=sua_api_key_aqui" > .env
```

2. **Executar**:
```bash
docker build -t vuemovie-app .
docker run -p 3000:80 vuemovie-app
```

3. **Acessar**: http://localhost:3000

### 💻 Desenvolvimento Local

1. **Instalar**:
```bash
npm install
```

2. **Configurar** (crie arquivo `.env`):
```env
NUXT_TMDB_API_KEY=sua_chave_api_tmdb
NUXT_TMDB_BASE_URL=https://api.themoviedb.org/3
NUXT_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
```

3. **Executar**:
```bash
npm run dev  # Desenvolvimento
npm run build && npm run preview  # Produção
```

> **📝 Obtenha sua API Key gratuita**: [TMDB API](https://www.themoviedb.org/settings/api)

## 🎯 Requisitos Atendidos

| Funcionalidade | Status | Tecnologia |
|----------------|--------|------------|
| **Busca de Filmes** | ✅ | TMDB API + Filtros avançados |
| **Categorias** | ✅ | 4 categorias com navegação |
| **Favoritos** | ✅ | Pinia + localStorage |
| **Detalhes** | ✅ | Páginas dinâmicas [id].vue |
| **Responsivo** | ✅ | Tailwind CSS mobile-first |
| **Vue.js + TypeScript** | ✅ | Vue 3.5.17 + TS completo |
| **Roteamento** | ✅ | Nuxt Router file-based |
| **Estado Global** | ✅ | Pinia stores |
| **Docker** | ✅ | Multi-stage build + Nginx |

## 📁 Estrutura do Projeto

```
desafioVue/
├── app/
│   ├── components/     # AppHeader, AppFooter, MovieCard
│   ├── pages/         # index, search, fav, movie/[id]
│   ├── composables/   # useTMDB (API integration)
│   ├── stores/        # favorites (Pinia)
│   └── types/         # TypeScript definitions
├── server/api/        # Nuxt API routes
├── public/           # Static assets
├── Dockerfile        # Docker configuration
├── nginx.conf        # Production server
└── nuxt.config.ts    # Nuxt configuration
```

## 🌐 Deploy

### 🚀 Vercel (Recomendado)

1. **Push para GitHub**: Faça push do projeto para o GitHub
2. **Conectar na Vercel**: Acesse [vercel.com](https://vercel.com) e conecte seu GitHub
3. **Importar projeto**: Selecione o repositório `desafioVue`
4. **Configurar variáveis**: Na Vercel, adicione as environment variables:
   ```
   NUXT_TMDB_API_KEY=sua_chave_api_tmdb
   NUXT_TMDB_BASE_URL=https://api.themoviedb.org/3
   NUXT_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
   ```
5. **Deploy automático**: A Vercel detectará automaticamente que é um projeto Nuxt e fará o deploy

### 🐳 Docker
- **Container otimizado** para produção
- **Nginx** com cache e compressão gzip
- **Multi-stage build** para menor tamanho

---

**Desenvolvido por**: [Eduardo Souza](https://github.com/edusouza455)  
**API**: [The Movie Database (TMDB)](https://www.themoviedb.org/)
