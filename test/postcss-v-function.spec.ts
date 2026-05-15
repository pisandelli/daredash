import { describe, expect, it } from 'vitest'
import { createPostCSSVPlugin } from '../src/postcss/postcss-v-function'

describe('createPostCSSVPlugin', () => {
  it('replaces v() with token fallback values', () => {
    const plugin = createPostCSSVPlugin('dd', {
      button: {
        color: {
          $value: '#ffffff'
        }
      }
    })

    const decl = { value: "color: v('button.color')" }
    plugin.Declaration(decl)

    expect(decl.value).toBe('color: var(--dd-button-color, #ffffff)')
  })

  it('supports explicit fallback expressions including nested v() calls', () => {
    const plugin = createPostCSSVPlugin('dd', {
      color: {
        gray: {
          '50': {
            $value: '#f9fafb'
          }
        }
      }
    })

    const decl = {
      value: "--local-color: v('button.color', contrast-color(v('color.gray.50')))"
    }
    plugin.Declaration(decl)

    expect(decl.value).toBe(
      '--local-color: var(--dd-button-color, contrast-color(var(--dd-color-gray-50, #f9fafb)))'
    )
  })
})
