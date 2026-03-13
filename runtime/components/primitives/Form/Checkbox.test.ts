import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Checkbox from './Checkbox'

describe('Checkbox Primitive', () => {
  it('renders a native checkbox input', async () => {
    const wrapper = await mountSuspended(Checkbox, {})

    const input = wrapper.find('input[type="checkbox"]')
    expect(input.exists()).toBe(true)
  })

  it('binds native HTML properties correctly', async () => {
    const wrapper = await mountSuspended(Checkbox, {
      props: {
        name: 'terms',
        id: 'terms-checkbox',
        disabled: true,
        value: 'accepted'
      }
    })

    const input = wrapper.find('input')
    expect(input.attributes('name')).toBe('terms')
    expect(input.attributes('id')).toBe('terms-checkbox')
    expect(input.attributes('disabled')).toBeDefined()
    expect(input.attributes('value')).toBe('accepted')
  })

  it('renders a label if provided', async () => {
    const wrapper = await mountSuspended(Checkbox, {
      props: {
        label: 'Accept Terms'
      }
    })

    const label = wrapper.find('label')
    expect(label.exists()).toBe(true)
    expect(label.text()).toContain('Accept Terms')
  })

  it('emits `update:modelValue` with boolean when checked (single mode)', async () => {
    const wrapper = await mountSuspended(Checkbox, {
      props: {
        value: true
      }
    })

    const input = wrapper.find('input')
    // Set checked state and trigger change event
    await input.setChecked(true)

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
  })

  it('emits `update:modelValue` with appended array when checked (array mode)', async () => {
    const wrapper = await mountSuspended(Checkbox, {
      props: {
        modelValue: ['option1'],
        value: 'option2'
      }
    })

    const input = wrapper.find('input')
    await input.setChecked(true)

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    // It should append 'option2' to the array
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([
      ['option1', 'option2']
    ])
  })

  it('handles semantic states generating custom attributes on the internal wrapper', async () => {
    const wrapper = await mountSuspended(Checkbox, {
      props: {
        isInvalid: true,
        disabled: true
      }
    })

    // According to Checkbox.ts, these semantic props apply to the internal wrapper div around the input
    // The second element inside the root is the wrapper (div > div.wrapper)
    const innerWrapper = wrapper.findAll('div').at(1)
    expect(innerWrapper?.attributes('data-error')).toBeDefined()
    expect(innerWrapper?.attributes('data-disabled')).toBeDefined()
  })
})
