import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import StudioPage from '../../runtime/pages/studio.vue'

describe('DareDash Studio page', () => {
  it('renders inside its own sandbox root', async () => {
    const wrapper = await mountSuspended(StudioPage)

    expect(wrapper.find('.dd-studio-root').exists()).toBe(true)
    expect(wrapper.find('.dd-studio-preview-scope').exists()).toBe(true)
  })

  it('updates preview styles without relying on :root overrides', async () => {
    const wrapper = await mountSuspended(StudioPage)
    const preview = wrapper.find('.dd-studio-preview-scope')
    const colorInput = wrapper.find('#field-color\\.primary\\.600')

    await colorInput.setValue('#123456')

    expect(preview.attributes('style')).toContain('--dd-color-primary-600: #123456;')
    expect(preview.attributes('style')).not.toContain(':root')
  })

  it('reflects referenced color aliases in the base palette ramp', async () => {
    const wrapper = await mountSuspended(StudioPage)
    const dangerInput = wrapper.find('#field-color\\.danger\\.600')

    await dangerInput.setValue('#ffee00')

    const errorRampSwatch = wrapper.find('[title="Edit color.error.600"]')

    expect(errorRampSwatch.attributes('style')).toContain('background: #ffee00;')
  })

  it('selects components through the searchable component picker', async () => {
    const wrapper = await mountSuspended(StudioPage)
    const componentTrigger = wrapper.find('.dde-component-trigger')

    await componentTrigger.trigger('click')

    const search = wrapper.find('.dde-component-search')
    await search.setValue('alert')

    const alertOption = wrapper.findAll('.dde-component-option')
      .find((option) => option.text().includes('Alert'))

    expect(alertOption).toBeDefined()

    await alertOption!.trigger('click')

    expect(wrapper.text()).toContain('Primary alert')
    expect(wrapper.text()).toContain('Success alert')
  })
})
