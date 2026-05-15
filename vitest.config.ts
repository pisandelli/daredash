import { defineVitestConfig } from '@nuxt/test-utils/config'
import { createResolver } from '@nuxt/kit'

const { resolve } = createResolver(import.meta.url)
const nativeStructuredClone = globalThis.structuredClone

/**
 * Work around a Nuxt/Vitest bootstrap issue where Node fails to clone
 * Nuxt runtimeConfig objects during test config resolution.
 * We keep the native path first and only fall back for plain JSON-safe data.
 */
globalThis.structuredClone = ((value: unknown, options?: StructuredSerializeOptions) => {
  try {
    return nativeStructuredClone(value, options)
  } catch (error) {
    if (
      error instanceof DOMException &&
      error.name === 'DataCloneError'
    ) {
      return JSON.parse(JSON.stringify(value))
    }

    throw error
  }
}) as typeof structuredClone

export default defineVitestConfig({
  test: {
    environment: 'nuxt',
    environmentOptions: {
      nuxt: {
        rootDir: resolve('./test/fixtures/basic'),
        domEnvironment: 'happy-dom'
      }
    }
  }
})
