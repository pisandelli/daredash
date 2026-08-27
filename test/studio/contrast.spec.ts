import { describe, expect, it } from 'vitest'
import { studioContrast } from '../../runtime/studio/contrast'

describe('Studio contrast diagnostics', () => {
  it('classifies opaque HEX and RGB pairs by WCAG contrast thresholds', () => {
    expect(studioContrast('#111827', '#ffffff')).toMatchObject({ status: 'aaa' })
    expect(studioContrast('rgb(29 78 216)', '#ffffff')).toMatchObject({ status: 'aa' })
    expect(studioContrast('#94a3b8', '#ffffff')).toMatchObject({ status: 'fail' })
  })

  it('keeps expressions and alpha colors indeterminate instead of guessing', () => {
    expect(studioContrast('contrast-color(#2563eb)', '#ffffff')).toEqual({ ratio: null, status: 'indeterminate' })
    expect(studioContrast('rgba(0 0 0 / 50%)', '#ffffff')).toEqual({ ratio: null, status: 'indeterminate' })
  })
})
