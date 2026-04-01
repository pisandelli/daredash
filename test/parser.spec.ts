import { describe, it, expect, beforeEach } from 'vitest'
import { parseTokens } from '../src/parser'
import type { TokenNode, TypedTokenValue } from '../src/types'

describe('parseTokens', () => {
  let standardTokens: string[]
  let typedTokens: { name: string; value: TypedTokenValue }[]

  beforeEach(() => {
    standardTokens = []
    typedTokens = []
  })

  it('should parse simple string tokens', () => {
    const node: TokenNode = {
      primary: {
        $value: '#ff0000'
      }
    }
    parseTokens(node, ['color'], standardTokens, typedTokens)
    expect(standardTokens).toContain('  --dd-color-primary: #ff0000;')
    expect(typedTokens).toHaveLength(0)
  })

  it('should parse number tokens', () => {
    const node: TokenNode = {
      base: {
        $value: 16
      }
    }
    parseTokens(node, ['spacing'], standardTokens, typedTokens)
    expect(standardTokens).toContain('  --dd-spacing-base: 16;')
  })

  it('should resolve single references', () => {
    const node: TokenNode = {
      accent: {
        $value: '{color.primary}'
      }
    }
    parseTokens(node, ['color'], standardTokens, typedTokens)
    expect(standardTokens).toContain('  --dd-color-accent: var(--dd-color-primary);')
  })

  it('should resolve multiple references in a single value', () => {
    const node: TokenNode = {
      combined: {
        $value: 'calc({spacing.1} + {spacing.2})'
      }
    }
    parseTokens(node, ['layout'], standardTokens, typedTokens)
    expect(standardTokens).toContain('  --dd-layout-combined: calc(var(--dd-spacing-1) + var(--dd-spacing-2));')
  })

  it('should parse typed tokens', () => {
    const typedValue: TypedTokenValue = {
      syntax: '<color>',
      inherits: false,
      'initial-value': '#000000'
    }
    const node: TokenNode = {
      surface: {
        $value: typedValue
      }
    }
    parseTokens(node, ['color'], standardTokens, typedTokens)
    expect(standardTokens).toHaveLength(0)
    expect(typedTokens).toContainEqual({
      name: '--dd-color-surface',
      value: typedValue
    })
  })

  it('should parse nested structures', () => {
    const node: TokenNode = {
      button: {
        primary: {
          background: {
            $value: '#007bff'
          }
        }
      }
    }
    parseTokens(node, ['theme'], standardTokens, typedTokens)
    expect(standardTokens).toContain('  --dd-theme-button-primary-background: #007bff;')
  })

  it('should ignore $description and $type', () => {
    const node: TokenNode = {
      $description: 'Theme colors',
      $type: 'color',
      primary: {
        $value: '#ff0000',
        $description: 'Primary color'
      }
    }
    parseTokens(node, ['color'], standardTokens, typedTokens)
    expect(standardTokens).toHaveLength(1)
    expect(standardTokens).toContain('  --dd-color-primary: #ff0000;')
  })

  it('should use custom prefix', () => {
    const node: TokenNode = {
      primary: {
        $value: '#ff0000'
      }
    }
    parseTokens(node, ['color'], standardTokens, typedTokens, 'custom')
    expect(standardTokens).toContain('  --custom-color-primary: #ff0000;')
  })

  it('should handle references with multiple dots correctly', () => {
     const node: TokenNode = {
      nested: {
        $value: '{a.b.c}'
      }
    }
    parseTokens(node, ['ref'], standardTokens, typedTokens)
    expect(standardTokens).toContain('  --dd-ref-nested: var(--dd-a-b-c);')
  })
})
