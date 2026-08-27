import { describe, expect, it } from 'vitest'
import { availableStudioThemes, studioTokenDiagnostic, tokenValue } from '../../runtime/studio/tokens'

describe('Studio token diagnostics', () => {
  it('offers the experimental precision visual proposal without replacing default', () => {
    expect(availableStudioThemes()).toContainEqual({
      id: 'precision',
      label: 'Precision',
      profile: 'brand',
      accessibilityTarget: 'best-effort'
    })
    expect(availableStudioThemes()[0]).toEqual({
      id: 'default',
      label: 'Default (Light)',
      profile: 'brand',
      accessibilityTarget: 'best-effort'
    })
  })

  it('offers the accessible profile with its WCAG AA target', () => {
    expect(availableStudioThemes()).toContainEqual({
      id: 'accessible',
      label: 'Accessible (WCAG AA)',
      profile: 'accessible',
      accessibilityTarget: 'wcag-aa'
    })
    expect(tokenValue('focus.ring', undefined, 'accessible')).toBe('0 0 0 3px #1d4ed8')
    expect(tokenValue('color.warning', undefined, 'accessible')).toBe('#9a4d00')
  })

  it('keeps Precision small text fluid while enforcing a readable minimum', () => {
    expect(tokenValue('font-size.xs', undefined, 'precision')).toBe(
      'clamp(0.75rem, 0.72rem + 0.08vw, 0.8125rem)'
    )
    expect(tokenValue('font-size.sm', undefined, 'precision')).toBe(
      'clamp(0.875rem, 0.84rem + 0.1vw, 0.9375rem)'
    )
  })

  it('keeps Precision tabs compact with a subtle active surface', () => {
    expect(tokenValue('tabs.list.gap', undefined, 'precision')).toBe('clamp(0.51rem, 0.46rem + 0.21vw, 0.64rem)')
    expect(tokenValue('tabs.trigger.border-radius', undefined, 'precision')).toBe('0.5rem')
    expect(tokenValue('tabs.trigger.active.bg', undefined, 'precision')).toBe(
      'color-mix(in srgb, #2563eb 8%, #ffffff)'
    )
  })

  it('keeps Precision table hierarchy subtle and scannable', () => {
    expect(tokenValue('table.row-striped.background-color', undefined, 'precision')).toBe('#fbfcfe')
    expect(tokenValue('table.row-hover.background-color', undefined, 'precision')).toBe(
      'color-mix(in srgb, #2563eb 4%, #ffffff)'
    )
  })

  it('uses a distinct active surface for Precision menu navigation', () => {
    expect(tokenValue('menu.item.bg-hover', undefined, 'precision')).toBe('#f1f5f9')
    expect(tokenValue('menu.item.bg-active', undefined, 'precision')).toBe(
      'color-mix(in srgb, #2563eb 8%, #ffffff)'
    )
  })

  it('aligns Precision anchors with the active navigation surface', () => {
    expect(tokenValue('anchor.item-bg-active', undefined, 'precision')).toBe(
      'color-mix(in srgb, #2563eb 8%, #ffffff)'
    )
  })

  it('resolves theme aliases recursively and exposes their chain', () => {
    const diagnostic = studioTokenDiagnostic('button.base-color', 'dark')

    expect(diagnostic).toMatchObject({
      status: 'resolved',
      rawValue: '{color.primary.400}',
      value: '#4895f6'
    })
    expect(diagnostic.chain).toEqual(['button.base-color', 'color.primary.400'])
  })

  it('reports unavailable token paths without throwing', () => {
    const diagnostic = studioTokenDiagnostic('does.not.exist')

    expect(diagnostic).toMatchObject({
      value: null,
      status: 'invalid-path',
      chain: ['does.not.exist']
    })
  })
})
