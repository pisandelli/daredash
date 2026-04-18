import { describe, it, expect } from 'vitest'
import { flattenTokens, resolveTokenValue } from '../../src/utils/tokens'
import { STUDIO_TABS } from '../../runtime/studio/registry'
import primitives from '../../runtime/assets/styles/tokens/default-theme/primitives.json'
import accordion from '../../runtime/assets/styles/tokens/default-theme/components/accordion.json'
import button from '../../runtime/assets/styles/tokens/default-theme/components/button.json'
import badge from '../../runtime/assets/styles/tokens/default-theme/components/badge.json'
import alert from '../../runtime/assets/styles/tokens/default-theme/components/alert.json'

describe('DareDash Studio registry', () => {
  it('maps every field path to a real token', () => {
    const rawTokens = {
      primitives,
      components: {
        accordion,
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

  it('keeps typography primitives in the typography foundation tab', () => {
    const typographyTab = STUDIO_TABS.find((tab) => tab.id === 'typography')

    expect(typographyTab).toBeDefined()
    expect(typographyTab!.navigationKind).toBe('foundation')
    expect(typographyTab!.fields.some((field) => field.path === 'font.base')).toBe(true)
    expect(typographyTab!.fields.some((field) => field.path === 'font-size.md')).toBe(true)
    expect(typographyTab!.fields.some((field) => field.path === 'font-weight.bold')).toBe(true)
    expect(typographyTab!.fields.some((field) => field.path === 'line-height.normal')).toBe(true)
    expect(typographyTab!.fields.some((field) => field.path === 'letter-spacing.wide')).toBe(true)
    expect(typographyTab!.fields.some((field) => field.path === 'space.md')).toBe(false)
  })

  it('preserves primitive alias metadata for studio fields', () => {
    const baseTab = STUDIO_TABS.find((tab) => tab.id === 'base')
    const errorAlias = baseTab?.fields.find((field) => field.path === 'color.error.500')
    const borderAlias = baseTab?.fields.find((field) => field.path === 'color.border.default')

    expect(errorAlias?.referencePath).toBe('color.danger.500')
    expect(borderAlias?.referencePath).toBe('color.light-gray')
  })

  it('registers accordion with preserved token references', () => {
    const accordionTab = STUDIO_TABS.find((tab) => tab.id === 'accordion')
    const headerPadding = accordionTab?.fields.find((field) => field.path === 'accordion.header.padding')
    const contentPadding = accordionTab?.fields.find((field) => field.path === 'accordion.content.padding')

    expect(accordionTab).toBeDefined()
    expect(accordionTab!.navigationKind).toBe('component')
    expect(headerPadding?.referencePath).toBe('space.md')
    expect(contentPadding?.referencePath).toBe('accordion.header.padding')
  })
})
