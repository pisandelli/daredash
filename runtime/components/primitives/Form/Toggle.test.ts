import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Toggle from './Toggle'

describe('Toggle Primitive', () => {
  it('renders a native checkbox input', async () => {
    const wrapper = await mountSuspended(Toggle, {})

    const input = wrapper.find('input[type="checkbox"]')
    expect(input.exists()).toBe(true)
  })

  it('binds native HTML properties correctly', async () => {
    const wrapper = await mountSuspended(Toggle, {
      props: {
        name: 'notifications',
        id: 'toggle-notifications',
        disabled: true,
        value: 'yes'
      }
    })

    const input = wrapper.find('input')
    expect(input.attributes('name')).toBe('notifications')
    expect(input.attributes('id')).toBe('toggle-notifications')
    expect(input.attributes('disabled')).toBeDefined()
    expect(input.attributes('value')).toBe('yes')
  })

  it('renders a label if provided', async () => {
    const wrapper = await mountSuspended(Toggle, {
      props: {
        label: 'Enable Notifications'
      }
    })

    const label = wrapper.find('span[class*="label"]')
    expect(label.exists()).toBe(true)
    expect(label.text()).toContain('Enable Notifications')
  })

  it('emits `update:modelValue` with boolean when checked (single mode)', async () => {
    const wrapper = await mountSuspended(Toggle, {
      props: {
        value: true
      }
    })

    const input = wrapper.find('input')
    await input.setChecked(true)

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
  })

  it('emits `update:modelValue` with appended array when checked (array mode)', async () => {
    const wrapper = await mountSuspended(Toggle, {
      props: {
        modelValue: ['option1'],
        value: 'option2'
      }
    })

    const input = wrapper.find('input')
    await input.setChecked(true)

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([
      ['option1', 'option2']
    ])
  })

  it('renders a loading spinner and disables input when loading prop is true', async () => {
    const wrapper = await mountSuspended(Toggle, {
      props: {
        loading: true
      }
    })

    const input = wrapper.find('input')
    expect(input.attributes('disabled')).toBeDefined()

    // Assert wrapper data attribute
    const rootLabel = wrapper.find('label')
    expect(rootLabel.attributes('data-loading')).toBeDefined()

    // Assuming Icon component resolves to an SVG or its name is bound
    const html = wrapper.html()
    expect(html).toContain('gooey-balls-2')
  })

  it('renders checked/unchecked slots based on modelValue state', async () => {
    const wrapper = await mountSuspended(Toggle, {
      props: {
        modelValue: false
      },
      slots: {
        checked: () => 'ON',
        unchecked: () => 'OFF'
      }
    })

    const inner = wrapper.find('span[class*="inner"]')
    expect(inner.text()).toContain('OFF')
    expect(inner.text()).not.toContain('ON')

    await wrapper.setProps({ modelValue: true })
    expect(inner.text()).toContain('ON')
    expect(inner.text()).not.toContain('OFF')
  })

  it('applies semantic class via useBaseComponent data attributes', async () => {
    const wrapper = await mountSuspended(Toggle, {
      props: {
        success: true,
        small: true
      }
    })

    const rootLabel = wrapper.find('label')
    // useBaseComponent processes these booleans into data- attributes
    expect(rootLabel.attributes('data-success')).toBeDefined()
    expect(rootLabel.attributes('data-small')).toBeDefined()
  })
})
