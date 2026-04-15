import { defineNuxtPlugin } from '#app'
import { modLabel } from './utils'
import typedTokens from '#build/design-tokens.json'
import type { TypedTokenValue } from './types'

interface TypedToken {
  name: string
  value: TypedTokenValue
}

interface CssPropertyRegistry {
  registerProperty?: (property: {
    name: string
    syntax: string
    inherits: boolean
    initialValue: string
  }) => void
}

export default defineNuxtPlugin(() => {
  const tokens = Array.isArray(typedTokens)
    ? (typedTokens as TypedToken[])
    : []

  if (tokens.length === 0) {
    return
  }

  const css = window.CSS as CssPropertyRegistry | undefined

  if (typeof css?.registerProperty === 'function') {
    for (const token of tokens) {
      try {
        css.registerProperty({
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
