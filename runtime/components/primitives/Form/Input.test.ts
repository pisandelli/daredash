import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Input from './Input'

describe('Input Primitive', () => {
  it('renders an input type text by default', async () => {
    const wrapper = await mountSuspended(Input, {})

    const input = wrapper.find('input')
    expect(input.exists()).toBe(true)
    expect(input.attributes('type')).toBe('text')
  })

  it('binds native HTML properties correctly', async () => {
    const wrapper = await mountSuspended(Input, {
      props: {
        placeholder: 'Enter text',
        name: 'username',
        type: 'email'
      }
    })

    const input = wrapper.find('input')
    expect(input.attributes('placeholder')).toBe('Enter text')
    expect(input.attributes('name')).toBe('username')
    expect(input.attributes('type')).toBe('email')
  })

  it('emits `update:modelValue` when typing', async () => {
    const wrapper = await mountSuspended(Input, {})

    const input = wrapper.find('input')
    await input.setValue('test value')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['test value'])
  })

  it('renders a label if provided', async () => {
    const wrapper = await mountSuspended(Input, {
      props: {
        label: 'Username'
      }
    })

    const label = wrapper.find('label')
    expect(label.exists()).toBe(true)
    expect(label.text()).toContain('Username')
  })

  it('handles `isInvalid` property generating semantic error attribute on input', async () => {
    const wrapper = await mountSuspended(Input, {
      props: {
        isInvalid: true
      }
    })

    // According to Input.ts, isInvalid prop should apply a `data-error` attribute on the inner input
    const input = wrapper.find('input')
    expect(input.attributes('data-error')).toBeDefined()
  })

  it('renders standard `data-` attributes on the input', async () => {
    const wrapper = await mountSuspended(Input, {
      props: {
        success: true
      }
    })

    // In Input, processAttrs is called, but the output `processedAttrs` is applied to the input directly
    const input = wrapper.find('input')
    expect(input.attributes('data-success')).toBeDefined()
  })

  it('renders left and right icons correctly', async () => {
    const wrapper = await mountSuspended(Input, {
      props: {
        icon: 'mdi:account',
        iconRight: 'mdi:check'
      }
    })

    // The input should get icon presence dataset attributes
    const input = wrapper.find('input')
    expect(input.attributes('data-has-icon-left')).toBeDefined()
    expect(input.attributes('data-has-icon-right')).toBeDefined()

    // Ensure that the icons are rendered
    const html = wrapper.html()
    expect(html).toContain('mdi:account')
    expect(html).toContain('mdi:check')
  })
})
