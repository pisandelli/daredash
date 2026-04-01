import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Progress from '../../../runtime/components/primitives/Progress/Progress'

describe('Progress Component', () => {
  // ─────────────────────────────────────────
  // ARIA & Semantic contract
  // ─────────────────────────────────────────

  it('renders with role="progressbar" and correct ARIA attributes', async () => {
    const wrapper = await mountSuspended(Progress, {
      props: { value: 60, min: 0, max: 100 }
    })

    const root = wrapper.find('[role="progressbar"]')
    expect(root.exists()).toBe(true)
    expect(root.attributes('aria-valuenow')).toBe('60')
    expect(root.attributes('aria-valuemin')).toBe('0')
    expect(root.attributes('aria-valuemax')).toBe('100')
  })

  it('sets aria-label when label prop is provided', async () => {
    const wrapper = await mountSuspended(Progress, {
      props: { value: 30, label: 'Upload progress' }
    })

    expect(wrapper.find('[role="progressbar"]').attributes('aria-label')).toBe('Upload progress')
  })

  it('omits aria-valuenow when in indeterminate mode', async () => {
    const wrapper = await mountSuspended(Progress, {
      props: { indeterminate: true }
    })

    const root = wrapper.find('[role="progressbar"]')
    expect(root.attributes('aria-valuenow')).toBeUndefined()
  })

  // ─────────────────────────────────────────
  // data-* attribute contract
  // ─────────────────────────────────────────

  it('sets data-indeterminate when indeterminate prop is true', async () => {
    const wrapper = await mountSuspended(Progress, {
      props: { indeterminate: true }
    })

    expect(wrapper.find('[data-indeterminate]').exists()).toBe(true)
  })

  it('sets data-indeterminate when value prop is absent', async () => {
    const wrapper = await mountSuspended(Progress, { props: {} })
    expect(wrapper.find('[data-indeterminate]').exists()).toBe(true)
  })

  it('does NOT set data-indeterminate when a value is provided', async () => {
    const wrapper = await mountSuspended(Progress, {
      props: { value: 50 }
    })

    expect(wrapper.find('[data-indeterminate]').exists()).toBe(false)
  })

  it('applies data-success from boolean attribute', async () => {
    const wrapper = await mountSuspended(Progress, {
      props: { value: 75 },
      attrs: { success: true }
    })

    expect(wrapper.find('[data-success]').exists()).toBe(true)
  })

  it('applies data-tiny from boolean attribute', async () => {
    const wrapper = await mountSuspended(Progress, {
      props: { value: 50 },
      attrs: { tiny: true }
    })

    expect(wrapper.find('[data-tiny]').exists()).toBe(true)
  })

  // ─────────────────────────────────────────
  // Value clamping
  // ─────────────────────────────────────────

  it('clamps value above max to 100% fill', async () => {
    const wrapper = await mountSuspended(Progress, {
      props: { value: 150, min: 0, max: 100 }
    })

    // aria-valuenow should reflect the clamped rounded percentage (100)
    expect(wrapper.find('[role="progressbar"]').attributes('aria-valuenow')).toBe('100')
  })

  it('clamps value below min to 0% fill', async () => {
    const wrapper = await mountSuspended(Progress, {
      props: { value: -20, min: 0, max: 100 }
    })

    expect(wrapper.find('[role="progressbar"]').attributes('aria-valuenow')).toBe('0')
  })

  it('computes percentage correctly within a custom min/max range', async () => {
    // value=75, min=50, max=100 → 50% progress
    const wrapper = await mountSuspended(Progress, {
      props: { value: 75, min: 50, max: 100 }
    })

    expect(wrapper.find('[role="progressbar"]').attributes('aria-valuenow')).toBe('50')
  })

  // ─────────────────────────────────────────
  // Custom color injection
  // ─────────────────────────────────────────

  it('injects CSS custom property when color prop is provided', async () => {
    const wrapper = await mountSuspended(Progress, {
      props: { value: 50, color: '#ff6b6b' }
    })

    const fillEl = wrapper.find('[role="progressbar"] > div > div')
    // The style should contain a CSS custom property with the provided color
    expect(fillEl.attributes('style')).toContain('#ff6b6b')
  })

  it('injects range color CSS custom property when value falls within a range', async () => {
    const wrapper = await mountSuspended(Progress, {
      props: {
        value: 15,
        ranges: [
          { from: 0, to: 20, color: '#ef4444' },
          { from: 21, to: 60, color: '#f97316' },
          { from: 61, to: 100, color: '#22c55e' }
        ]
      }
    })

    const fillEl = wrapper.find('[role="progressbar"] > div > div')
    expect(fillEl.attributes('style')).toContain('#ef4444')
  })

  it('uses no custom color injection when no range matches', async () => {
    // value=50 falls in the second range (no color defined)
    const wrapper = await mountSuspended(Progress, {
      props: {
        value: 50,
        ranges: [
          { from: 0, to: 20, color: '#ef4444' },
          { from: 21, to: 60 } // no color
        ]
      }
    })

    const fillEl = wrapper.find('[role="progressbar"] > div > div')
    // The style should only contain inline-size, no custom color property
    const style = fillEl.attributes('style') ?? ''
    expect(style).not.toContain('--')
  })

  // ─────────────────────────────────────────
  // Slots
  // ─────────────────────────────────────────

  it('renders default label slot content', async () => {
    const wrapper = await mountSuspended(Progress, {
      props: { value: 50 },
      slots: { label: 'Storage used' }
    })

    expect(wrapper.text()).toContain('Storage used')
  })

  it('renders label prop as fallback label', async () => {
    const wrapper = await mountSuspended(Progress, {
      props: { value: 50, label: 'Download speed' }
    })

    expect(wrapper.text()).toContain('Download speed')
  })
})
