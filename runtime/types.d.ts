export default defineNuxtPlugin(() => {})

declare module 'nuxt/schema' {
  interface PublicRuntimeConfig {
    daredash: {
      prefix: string
    }
  }
}
