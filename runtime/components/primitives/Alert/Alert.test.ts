import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import getPrefixName from '#dd/utils/getPrefixName'
import Alert from './Alert.vue'

describe('Alert Primitive', () => {
  it('renders default slot content correctly', async () => {
    const wrapper = await mountSuspended(Alert, {
      slots: {
        default: () => 'Alert Content'
      }
    })

    expect(wrapper.text()).toContain('Alert Content')
  })

  it('renders `data-` attributes from boolean properties using useBaseComponent', async () => {
    const wrapper = await mountSuspended(Alert, {
      props: {
        success: true
      }
    })

    expect(wrapper.attributes('data-success')).toBeDefined()
  })

  it('renders the title prop or slot', async () => {
    const wrapper = await mountSuspended(Alert, {
      props: {
        title: 'Error Message'
      }
    })

    expect(wrapper.text()).toContain('Error Message')
  })

  it('binds custom `color` via CSS variable style correctly', async () => {
    const wrapper = await mountSuspended(Alert, {
      props: {
        color: '#ffba00'
      }
    })

    const expectedVar = getPrefixName('alert-base-color', {
      type: 'css-var-decl'
    })
    const styleAttr = wrapper.attributes('style')
    expect(styleAttr).toBeDefined()
    expect(styleAttr).toContain('#ffba00')
    expect(styleAttr).toContain(expectedVar)
  })

  it('emits close event when close button is clicked', async () => {
    const wrapper = await mountSuspended(Alert, {
      props: {
        closable: true,
        modelValue: true
      }
    })

    const closeButton = wrapper.find('button')
    expect(closeButton.exists()).toBe(true)

    await closeButton.trigger('click')

    expect(wrapper.emitted('close')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([false])
  })

  it('uses semantic icon when icon is true', async () => {
    const wrapper = await mountSuspended(Alert, {
      props: {
        success: true,
        icon: true
      }
    })

    const html = wrapper.html()
    expect(html).toContain('heroicons:check-circle') // Or whatever the component resolves NuxtIcon to based on its string
  })

  it('uses custom icon when icon prop is string', async () => {
    const wrapper = await mountSuspended(Alert, {
      props: {
        icon: 'mdi:home'
      }
    })

    const html = wrapper.html()
    expect(html).toContain('mdi:home')
  })
})
