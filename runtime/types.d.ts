export default defineNuxtPlugin(() => {})

declare module 'nuxt/schema' {
  interface PublicRuntimeConfig {
    daredash: {
      prefix: string
    }
  }

  interface AppConfig {
    daredash?: {
      icons?: {
        success?: string
        error?: string
        warning?: string
        info?: string
        toastClose?: string
        selectArrow?: string
        modalClose?: string
        search?: string
        loading?: string
        drawerClose?: string
        tableError?: string
        emptyTable?: string
        paginationPrev?: string
        paginationNext?: string
        [key: string]: string | undefined
      }
    }
  }
}
