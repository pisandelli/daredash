import { describe, it, expect } from 'vitest'
import { flattenTokens, resolveTokenValue } from '../../src/utils/tokens'

describe('tokens util', () => {
  describe('flattenTokens', () => {
    it('merges multiple token groups into a single flat object', () => {
      const rawTokens = {
        primitives: {
          blue: { $value: '#0000ff' },
          red: { $value: '#ff0000' }
        },
        components: {
          button: {
            background: { $value: '{primitives.blue}' }
          }
        }
      }

      const flat = flattenTokens(rawTokens)

      expect(flat).toEqual({
        blue: { $value: '#0000ff' },
        red: { $value: '#ff0000' },
        button: {
          background: { $value: '{primitives.blue}' }
        }
      })
    })

    it('skips reserved keys: $description, $type, and themes', () => {
      const rawTokens = {
        $description: 'Test tokens',
        $type: 'color',
        themes: {
          dark: {
            blue: { $value: '#000088' }
          }
        },
        primitives: {
          blue: { $value: '#0000ff' }
        }
      }

      const flat = flattenTokens(rawTokens)

      expect(flat).toEqual({
        blue: { $value: '#0000ff' }
      })
      expect(flat).not.toHaveProperty('$description')
      expect(flat).not.toHaveProperty('$type')
      expect(flat).not.toHaveProperty('themes')
    })

    it('only merges keys that are objects', () => {
      const rawTokens = {
        primitives: {
          blue: { $value: '#0000ff' }
        },
        invalid: 'not an object',
        alsoInvalid: 123
      }

      const flat = flattenTokens(rawTokens)

      expect(flat).toEqual({
        blue: { $value: '#0000ff' }
      })
    })

    it('overwrites earlier keys with later ones if they overlap', () => {
      const rawTokens = {
        group1: {
          token: { $value: 'value1' }
        },
        group2: {
          token: { $value: 'value2' }
        }
      }

      const flat = flattenTokens(rawTokens)

      expect(flat.token.$value).toBe('value2')
    })

    it('returns an empty object when given an empty object', () => {
      expect(flattenTokens({})).toEqual({})
    })
  })

  describe('resolveTokenValue', () => {
    const tokens = {
      blue: { $value: '#0000ff' },
      button: {
        radius: { $value: '4px' },
        primary: {
          background: { $value: '{blue}' }
        }
      },
      nested: {
        deep: {
          ref: { $value: '{button.radius}' }
        }
      }
    }

    it('resolves a simple token path', () => {
      expect(resolveTokenValue(tokens, 'blue')).toBe('#0000ff')
    })

    it('resolves a nested token path', () => {
      expect(resolveTokenValue(tokens, 'button.radius')).toBe('4px')
    })

    it('returns null for non-existent paths', () => {
      expect(resolveTokenValue(tokens, 'non.existent')).toBeNull()
      expect(resolveTokenValue(tokens, 'button.nonexistent')).toBeNull()
    })

    it('resolves references within values', () => {
      expect(resolveTokenValue(tokens, 'button.primary.background')).toBe('#0000ff')
    })

    it('resolves nested references', () => {
      expect(resolveTokenValue(tokens, 'nested.deep.ref')).toBe('4px')
    })

    it('returns CSS variable fallback for unresolved references', () => {
      const tokensWithMissingRef = {
        a: { $value: '{missing}' }
      }
      expect(resolveTokenValue(tokensWithMissingRef, 'a')).toBe('var(--dd-missing)')
    })

    it('returns null for invalid inputs', () => {
      expect(resolveTokenValue(null, 'path')).toBeNull()
      expect(resolveTokenValue({}, '')).toBeNull()
    })
  })
})
