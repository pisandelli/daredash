import { describe, it, expect } from 'vitest'
import { flattenTokens, resolveTokenValue } from '../../src/utils/tokens'
import { STUDIO_TABS } from '../../runtime/studio/registry'
import primitives from '../../runtime/assets/styles/tokens/default-theme/primitives.json'
import {
  STUDIO_COMPONENT_TOKENS,
  type StudioComponentTokenId
} from '../../runtime/studio/componentTokens'

describe('DareDash Studio registry', () => {
  it('maps every field path to a real token', () => {
    const rawTokens = {
      primitives,
      components: STUDIO_COMPONENT_TOKENS
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

  it('keeps every component tab backed by a shared token source', () => {
    const componentTabs = STUDIO_TABS.filter((tab) => tab.navigationKind === 'component')

    for (const tab of componentTabs) {
      expect(STUDIO_COMPONENT_TOKENS[tab.id as StudioComponentTokenId]).toBeDefined()
    }
  })

  it('keeps every shared component token exposed by a studio tab', () => {
    const componentTabIds = new Set(
      STUDIO_TABS
        .filter((tab) => tab.navigationKind === 'component')
        .map((tab) => tab.id)
    )

    for (const componentId of Object.keys(STUDIO_COMPONENT_TOKENS) as StudioComponentTokenId[]) {
      expect(componentTabIds.has(componentId)).toBe(true)
    }
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

  it('registers avatar with preserved token references', () => {
    const avatarTab = STUDIO_TABS.find((tab) => tab.id === 'avatar')
    const avatarSize = avatarTab?.fields.find((field) => field.path === 'avatar.size')
    const avatarBackground = avatarTab?.fields.find((field) => field.path === 'avatar.background-color')

    expect(avatarTab).toBeDefined()
    expect(avatarTab!.navigationKind).toBe('component')
    expect(avatarSize?.referencePath).toBe('space.sl')
    expect(avatarBackground?.referencePath).toBe('color.gray')
  })

  it('registers breadcrumbs with preserved token references', () => {
    const breadcrumbsTab = STUDIO_TABS.find((tab) => tab.id === 'breadcrumbs')
    const fontSizeField = breadcrumbsTab?.fields.find((field) => field.path === 'breadcrumbs.font-size')
    const gapField = breadcrumbsTab?.fields.find((field) => field.path === 'breadcrumbs.gap')
    const hoverField = breadcrumbsTab?.fields.find((field) => field.path === 'breadcrumbs.item.hover-color')

    expect(breadcrumbsTab).toBeDefined()
    expect(breadcrumbsTab!.navigationKind).toBe('component')
    expect(fontSizeField?.referencePath).toBe('font-size.sm')
    expect(gapField?.referencePath).toBe('space.xs')
    expect(hoverField?.referencePath).toBe('color.primary')
  })

  it('registers card with preserved token references', () => {
    const cardTab = STUDIO_TABS.find((tab) => tab.id === 'card')
    const backgroundField = cardTab?.fields.find((field) => field.path === 'card.background-color')
    const radiusField = cardTab?.fields.find((field) => field.path === 'card.border-radius')
    const headerPaddingField = cardTab?.fields.find((field) => field.path === 'card.header.padding')

    expect(cardTab).toBeDefined()
    expect(cardTab!.navigationKind).toBe('component')
    expect(backgroundField?.referencePath).toBe('color.bg.surface')
    expect(radiusField?.referencePath).toBe('border-radius.lg')
    expect(headerPaddingField?.referencePath).toBe('space.lg')
  })

  it('registers center with preserved token references', () => {
    const centerTab = STUDIO_TABS.find((tab) => tab.id === 'center')
    const gapField = centerTab?.fields.find((field) => field.path === 'center.gap')
    const maxWidthField = centerTab?.fields.find((field) => field.path === 'center.max-width')

    expect(centerTab).toBeDefined()
    expect(centerTab!.navigationKind).toBe('component')
    expect(gapField?.referencePath).toBe('space.lg')
    expect(maxWidthField?.referencePath).toBe('max-width')
  })

  it('registers cluster with preserved token references', () => {
    const clusterTab = STUDIO_TABS.find((tab) => tab.id === 'cluster')
    const gapField = clusterTab?.fields.find((field) => field.path === 'cluster.gap')

    expect(clusterTab).toBeDefined()
    expect(clusterTab!.navigationKind).toBe('component')
    expect(gapField?.referencePath).toBe('space.lg')
  })

  it('registers grid with preserved token references', () => {
    const gridTab = STUDIO_TABS.find((tab) => tab.id === 'grid')
    const gapField = gridTab?.fields.find((field) => field.path === 'grid.gap')

    expect(gridTab).toBeDefined()
    expect(gridTab!.navigationKind).toBe('component')
    expect(gapField?.referencePath).toBe('space.lg')
  })

  it('registers layout structure tokens', () => {
    const layoutTab = STUDIO_TABS.find((tab) => tab.id === 'layout')
    const gapField = layoutTab?.fields.find((field) => field.path === 'layout.gap')

    expect(layoutTab).toBeDefined()
    expect(layoutTab!.navigationKind).toBe('component')
    expect(gapField?.defaultValue).toBe('0')
  })

  it('registers stack with preserved token references', () => {
    const stackTab = STUDIO_TABS.find((tab) => tab.id === 'stack')
    const gapField = stackTab?.fields.find((field) => field.path === 'stack.gap')

    expect(stackTab).toBeDefined()
    expect(stackTab!.navigationKind).toBe('component')
    expect(gapField?.referencePath).toBe('space.lg')
  })

  it('registers box with preserved token references', () => {
    const boxTab = STUDIO_TABS.find((tab) => tab.id === 'box')
    const gapField = boxTab?.fields.find((field) => field.path === 'box.gap')

    expect(boxTab).toBeDefined()
    expect(boxTab!.navigationKind).toBe('component')
    expect(gapField?.referencePath).toBe('space.lg')
  })
})
