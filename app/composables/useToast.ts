import { useToast as useVueToast } from 'vue-toastification'

export const useToast = () => {
  const toast = useVueToast()

  const success = (message: string, options?: any) => {
    toast.success(message, {
      timeout: 3000,
      ...options
    })
  }

  const error = (message: string, options?: any) => {
    toast.error(message, {
      timeout: 4000,
      ...options
    })
  }

  const info = (message: string, options?: any) => {
    toast.info(message, {
      timeout: 3000,
      ...options
    })
  }

  const warning = (message: string, options?: any) => {
    toast.warning(message, {
      timeout: 3000,
      ...options
    })
  }
  
  const neutral = (message: string, options?: any) => {
    toast(message, {
      timeout: 3000,
      type: 'default',
      ...options
    })
  }

  return {
    success,
    error,
    info,
    warning,
    neutral,
    toast // Exposição direta para casos avançados
  }
}
