import { describe, expect, it } from 'vitest'
import { availableStudioThemes, studioTokenDiagnostic, tokenValue } from '../../runtime/studio/tokens'

describe('Studio token diagnostics', () => {
  it('offers the experimental precision visual proposal without replacing default', () => {
    expect(availableStudioThemes()).toContainEqual({ id: 'precision', label: 'Precision' })
    expect(availableStudioThemes()[0]).toEqual({ id: 'default', label: 'Default (Light)' })
  })

  it('keeps Precision small text fluid while enforcing a readable minimum', () => {
    expect(tokenValue('font-size.xs', undefined, 'precision')).toBe(
      'clamp(0.75rem, 0.72rem + 0.08vw, 0.8125rem)'
    )
    expect(tokenValue('font-size.sm', undefined, 'precision')).toBe(
      'clamp(0.875rem, 0.84rem + 0.1vw, 0.9375rem)'
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
