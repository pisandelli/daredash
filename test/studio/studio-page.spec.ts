import { describe, it, expect, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import StudioPage from '../../runtime/pages/studio.vue'

vi.unmock('../../runtime/studio/registry')
import getPrefixName from '../../runtime/shared/utils/getPrefixName'

describe('DareDash Studio page', () => {
  it('renders inside its own sandbox root', async () => {
    const wrapper = await mountSuspended(StudioPage)

    expect(wrapper.find('.dd-studio-root').exists()).toBe(true)
    expect(wrapper.find('.dd-studio-preview-scope').exists()).toBe(true)
    expect(wrapper.find('.dde-field-info-trigger').exists()).toBe(true)
  })

  it('updates preview styles without relying on :root overrides', async () => {
    const wrapper = await mountSuspended(StudioPage)
    const preview = wrapper.find('.dd-studio-preview-scope')
    const colorInput = wrapper.find('#field-color\\.primary\\.600')

    await colorInput.setValue('#123456')
    await colorInput.trigger('input')
    await flushPromises()

    const varDecl = getPrefixName('color-primary-600', { type: 'css-var-decl' })
    const varDeclClean = varDecl.replace(/^var\(--/, '').replace(/,.*$/, '').trim()
    const cssVarName = varDecl.startsWith('--') ? varDecl : `--${varDeclClean}`

    const inlineStyle = preview.attributes('style') || (preview.element as HTMLElement).style.cssText || (preview.element as HTMLElement).getAttribute('style') || ''
    const styleValue = inlineStyle || (preview.element as HTMLElement).style.getPropertyValue(cssVarName)

    expect(styleValue).toBeTruthy()
    expect(preview.attributes('style') ?? (preview.element as HTMLElement).style.cssText).not.toContain(':root')
  })

  it('reflects referenced color aliases in the base palette ramp', async () => {
    const wrapper = await mountSuspended(StudioPage)
    const dangerField = wrapper.findAll('.dde-field')
      .find((f) => f.find('.dde-field-path').text() === 'color.danger.600')

    await dangerField?.find('button[title*="raw CSS value"]').trigger('click')
    await flushPromises()

    const dangerInput = wrapper.find('#field-color\\.danger\\.600')
    await dangerInput.setValue('#ffee00')
    await dangerInput.trigger('input')
    await flushPromises()

    const errorRampSwatch = wrapper.find('[title="Edit color.error.600"]')
    expect(errorRampSwatch.attributes('style')).toContain('background: #ffee00;')
  })

  it('selects components through the searchable component picker', async () => {
    const wrapper = await mountSuspended(StudioPage)
    const componentTrigger = wrapper.find('.dde-component-trigger')

    await componentTrigger.trigger('click')
    await flushPromises()

    const search = wrapper.find('.dde-component-search')
    await search.setValue('alert')
    await search.trigger('input')
    await flushPromises()

    const alertOption = wrapper.findAll('.dde-component-option')
      .find((option) => option.text().includes('Alert'))

    expect(alertOption).toBeDefined()

    await alertOption!.trigger('click')
    await flushPromises()

    expect(wrapper.text()).toContain('Primary alert')
    expect(wrapper.text()).toContain('Success alert')
  })

  it('switches preview theme dynamically via theme selector and updates input fields', async () => {
    const wrapper = await mountSuspended(StudioPage)
    const themeSelect = wrapper.find('#dde-theme-select')
    const preview = wrapper.find('.dd-studio-preview-scope')

    expect(themeSelect.exists()).toBe(true)
    expect(preview.attributes('data-theme')).toBeUndefined()

    await themeSelect.setValue('dark')
    await themeSelect.trigger('change')
    await flushPromises()

    expect(preview.attributes('data-theme')).toBe('dark')

    const canvasInput = wrapper.find('#field-color\\.bg\\.canvas')
    expect((canvasInput.element as HTMLInputElement).value).toBe('color.gray.950')
  })
})
