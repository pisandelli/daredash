import { describe, expect, it } from 'vitest'
import { studioTokenDiagnostic } from '../../runtime/studio/tokens'

describe('Studio token diagnostics', () => {
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
