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

  it('supports double-quoted token paths and fallbacks', () => {
    const plugin = createPostCSSVPlugin('dd', {
      button: {
        color: {
          $value: '#ffffff'
        }
      },
      color: {
        gray: {
          '50': {
            $value: '#f9fafb'
          }
        }
      }
    })

    const decl = {
      value: '--local-color: v("button.color", contrast-color(v("color.gray.50")))'
    }
    plugin.Declaration(decl)

    expect(decl.value).toBe(
      '--local-color: var(--dd-button-color, contrast-color(var(--dd-color-gray-50, #f9fafb)))'
    )
  })

  it('preserves referenced semantic aliases in automatic fallbacks', () => {
    const plugin = createPostCSSVPlugin('dd', {
      color: {
        success: {
          $value: '{color.success.600}',
          '600': {
            $value: '#2e7d32'
          }
        }
      },
      button: {
        success: {
          'base-color': {
            $value: '{color.success}'
          }
        }
      }
    })

    const decl = {
      value: "--local-base-color: v('button.success.base-color')"
    }
    plugin.Declaration(decl)

    expect(decl.value).toBe(
      '--local-base-color: var(--dd-button-success-base-color, var(--dd-color-success))'
    )
  })

  it('preserves embedded reference expressions in automatic fallbacks', () => {
    const plugin = createPostCSSVPlugin('dd', {
      color: {
        success: {
          $value: '{color.success.600}',
          '600': {
            $value: '#2e7d32'
          }
        }
      },
      button: {
        success: {
          color: {
            $value: 'contrast-color({color.success})'
          }
        }
      }
    })

    const decl = {
      value: "--local-color: v('button.success.color')"
    }
    plugin.Declaration(decl)

    expect(decl.value).toBe(
      '--local-color: var(--dd-button-success-color, contrast-color(var(--dd-color-success)))'
    )
  })
})
