import { defineNuxtPlugin } from '#app'
import { modLabel } from './utils'
import typedTokens from '#build/design-tokens.json'

export default defineNuxtPlugin(async (nuxtApp) => {
  if (!typedTokens || !Array.isArray(typedTokens) || typedTokens.length === 0) {
    return
  }

  if ('CSS' in window && 'registerProperty' in CSS) {
    for (const token of typedTokens) {
      try {
        CSS.registerProperty({
          name: token.name,
          syntax: token.value.syntax.replace(/'/g, ''),
          inherits: token.value.inherits ?? false,
          initialValue: token.value['initial-value']
        })
      } catch (error) {
        console.error(
          `${modLabel} Failed to register typed property "${token.name}".`,
          error
        )
      }
    }
  } else {
    console.warn(
      `${modLabel} CSS Typed OM API is not supported in this browser.`
    )
  }
})
