import { describe, expect, it } from 'vitest'
import { buildThemeScopedDependentTokens } from '../../src/utils/themeScopedTokens'
import { parseTokens } from '../../src/parser'

describe('buildThemeScopedDependentTokens', () => {
  it('re-emits direct and transitive aliases that depend on theme overrides', () => {
    const baseTokens = {
      color: {
        success: {
          500: { $value: '#61c66a' },
          $value: '{color.success.500}'
        }
      },
      button: {
        success: {
          'base-color': { $value: '{color.success}' },
          color: { $value: 'contrast-color({button.success.base-color})' }
        }
      },
      badge: {
        'base-color': { $value: '{color.primary}' }
      }
    }

    const darkThemeTokens = {
      color: {
        success: {
          500: { $value: '#34b640' },
          $value: '{color.success.500}'
        }
      }
    }

    const dependentTokens = buildThemeScopedDependentTokens(
      baseTokens,
      darkThemeTokens
    )

    expect(dependentTokens).toEqual({
      button: {
        success: {
          'base-color': { $value: '{color.success}' },
          color: { $value: 'contrast-color({button.success.base-color})' }
        }
      }
    })
  })

  it('does not re-emit unrelated aliases or paths already overridden by the theme', () => {
    const baseTokens = {
      color: {
        success: {
          500: { $value: '#61c66a' },
          $value: '{color.success.500}'
        }
      },
      button: {
        success: {
          'base-color': { $value: '{color.success}' }
        },
        primary: {
          'base-color': { $value: '{color.primary}' }
        }
      }
    }

    const darkThemeTokens = {
      color: {
        success: {
          500: { $value: '#34b640' },
          $value: '{color.success.500}'
        }
      },
      button: {
        success: {
          'base-color': { $value: '{color.success}' }
        }
      }
    }

    const dependentTokens = buildThemeScopedDependentTokens(
      baseTokens,
      darkThemeTokens
    )

    expect(dependentTokens).toEqual({})
  })

  it('produces theme-scoped CSS variables that keep semantic aliases dynamic', () => {
    const baseTokens = {
      color: {
        success: {
          500: { $value: '#61c66a' },
          $value: '{color.success.500}'
        }
      },
      button: {
        success: {
          'base-color': { $value: '{color.success}' }
        }
      }
    }

    const darkThemeTokens = {
      color: {
        success: {
          500: { $value: '#34b640' },
          $value: '{color.success.500}'
        }
      }
    }

    const dependentTokens = buildThemeScopedDependentTokens(
      baseTokens,
      darkThemeTokens
    )
    const cssVars: string[] = []

    parseTokens(dependentTokens, [], cssVars, [])

    expect(cssVars).toContain(
      '  --dd-button-success-base-color: var(--dd-color-success);'
    )
  })
})

