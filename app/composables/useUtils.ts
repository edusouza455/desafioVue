/**
 * Composable com utilitários gerais da aplicação
 */
export const useUtils = () => {
  
  // Formatar data
  const formatDate = (date: string | Date): string => {
    try {
      const d = new Date(date)
      return d.toLocaleDateString('pt-BR')
    } catch {
      return 'Data inválida'
    }
  }

  // Formatar ano de lançamento
  const formatReleaseYear = (date: string | null): string => {
    if (!date) return 'Ano desconhecido'
    try {
      return new Date(date).getFullYear().toString()
    } catch {
      return 'Ano inválido'
    }
  }

  // Formatar duração em minutos para horas e minutos
  const formatRuntime = (minutes: number): string => {
    if (!minutes || minutes <= 0) return 'Duração não informada'
    
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    
    if (hours === 0) return `${mins}min`
    if (mins === 0) return `${hours}h`
    return `${hours}h ${mins}min`
  }

  // Formatar nota de avaliação
  const formatRating = (rating: number): string => {
    if (!rating || rating <= 0) return 'N/A'
    return rating.toFixed(1)
  }

  // Truncar texto
  const truncateText = (text: string, maxLength: number = 100): string => {
    if (!text || text.length <= maxLength) return text
    return text.substring(0, maxLength).trim() + '...'
  }

  // Gerar slug a partir de string
  const generateSlug = (text: string): string => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
      .replace(/\s+/g, '-') // Substitui espaços por hífens
      .replace(/-+/g, '-') // Remove hífens duplicados
      .trim()
  }

  // Capitalizar primeira letra
  const capitalize = (text: string): string => {
    if (!text) return ''
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
  }

  // Verificar se é URL válida
  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  // Debounce para otimizar busca
  const debounce = <T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): ((...args: Parameters<T>) => void) => {
    let timeoutId: NodeJS.Timeout
    
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => func.apply(null, args), delay)
    }
  }

  // Throttle para limitar chamadas de função
  const throttle = <T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): ((...args: Parameters<T>) => void) => {
    let lastCall = 0
    
    return (...args: Parameters<T>) => {
      const now = Date.now()
      if (now - lastCall >= delay) {
        lastCall = now
        func.apply(null, args)
      }
    }
  }

  // Gerar ID único
  const generateId = (): string => {
    return Math.random().toString(36).substring(2) + Date.now().toString(36)
  }

  return {
    formatDate,
    formatReleaseYear,
    formatRuntime,
    formatRating,
    truncateText,
    generateSlug,
    capitalize,
    isValidUrl,
    debounce,
    throttle,
    generateId
  }
}

/**
 * Composable para configurar meta tags das páginas
 */
export const usePageMeta = (title: string, description: string = '') => {
  const fullTitle = title ? `${title} | VueMovie` : 'VueMovie'
  
  useSeoMeta({
    title: fullTitle,
    description: description || 'Explore, salve e organize os melhores filmes do cinema com VueMovie',
    ogTitle: fullTitle,
    ogDescription: description || 'Explore, salve e organize os melhores filmes do cinema com VueMovie',
    ogType: 'website',
    twitterCard: 'summary_large_image'
  })
}
