import { describe, it, expect } from 'vitest'
import { flattenTokens, resolveTokenValue } from '../../src/utils/tokens'
import { STUDIO_TABS } from '../../runtime/studio/registry'
import primitives from '../../runtime/assets/styles/tokens/default-theme/primitives.json'
import button from '../../runtime/assets/styles/tokens/default-theme/components/button.json'
import badge from '../../runtime/assets/styles/tokens/default-theme/components/badge.json'
import alert from '../../runtime/assets/styles/tokens/default-theme/components/alert.json'

describe('DareDash Studio registry', () => {
  it('maps every field path to a real token', () => {
    const rawTokens = {
      primitives,
      components: {
        button,
        badge,
        alert
      }
    }
    const flat = flattenTokens(rawTokens)
    const fields = STUDIO_TABS.flatMap((tab) => tab.fields)

    for (const field of fields) {
      const resolved = resolveTokenValue(flat, field.path)
      expect(resolved, `Missing token path: ${field.path}`).not.toBeNull()
    }
  })

  it('keeps the base tab focused on non-typographic primitives', () => {
    const baseTab = STUDIO_TABS.find((tab) => tab.id === 'base')

    expect(baseTab).toBeDefined()
    expect(baseTab!.fields.some((field) => field.path.startsWith('font-size.'))).toBe(false)
    expect(baseTab!.fields.some((field) => field.path.startsWith('font-weight.'))).toBe(false)
    expect(baseTab!.fields.some((field) => field.path === 'space.md')).toBe(true)
    expect(baseTab!.fields.some((field) => field.path === 'shadow.md')).toBe(true)
    expect(baseTab!.fields.some((field) => field.path === 'transition.base')).toBe(true)
    expect(baseTab!.fields.some((field) => field.path === 'max-width')).toBe(true)
  })

  it('preserves primitive alias metadata for studio fields', () => {
    const baseTab = STUDIO_TABS.find((tab) => tab.id === 'base')
    const errorAlias = baseTab?.fields.find((field) => field.path === 'color.error.500')
    const borderAlias = baseTab?.fields.find((field) => field.path === 'color.border.default')

    expect(errorAlias?.referencePath).toBe('color.danger.500')
    expect(borderAlias?.referencePath).toBe('color.light-gray')
  })
})
