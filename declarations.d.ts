declare module '*.module.css'

declare const definePageMeta: (...args: any[]) => any

declare module '#app' {
  export const defineNuxtPlugin: (...args: any[]) => any
  export const useRuntimeConfig: (...args: any[]) => any
}

declare module '#imports' {
  export const defineNuxtComponent: (...args: any[]) => any
  export const useAppConfig: (...args: any[]) => any
}

declare module '#components' {
  export const NuxtLink: any
  export const Icon: any
}
