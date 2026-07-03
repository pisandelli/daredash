import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Select from './Select'

describe('Select Primitive', () => {
  it('renders the placeholder and options', async () => {
    const wrapper = await mountSuspended(Select, {
      props: {
        placeholder: 'Choose one',
        options: [
          { label: 'Alpha', value: 'a' },
          { label: 'Beta', value: 'b' }
        ]
      }
    })

    const options = wrapper.findAll('option')
    expect(options).toHaveLength(3)
    expect(options[0]?.text()).toBe('Choose one')
    expect(options[1]?.text()).toBe('Alpha')
    expect(options[2]?.text()).toBe('Beta')
  })

  it('emits `update:modelValue` when selection changes', async () => {
    const wrapper = await mountSuspended(Select, {
      props: {
        options: [
          { label: 'Alpha', value: 'a' },
          { label: 'Beta', value: 'b' }
        ]
      }
    })

    await wrapper.find('select').setValue('b')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['b'])
  })

  it('applies consumer layout hooks to the outer wrapper', async () => {
    const wrapper = await mountSuspended(Select, {
      attrs: {
        class: 'toolbarField',
        style: 'flex: 0 1 256px;',
        'data-testid': 'category-filter'
      },
      props: {
        options: [{ label: 'Alpha', value: 'a' }]
      }
    })

    expect(wrapper.classes()).toContain('toolbarField')
    expect(wrapper.attributes('style')).toContain('flex-basis: 256px;')
    expect(wrapper.attributes('data-testid')).toBeUndefined()

    const select = wrapper.find('select')
    expect(select.attributes('data-testid')).toBe('category-filter')
    expect(select.classes()).not.toContain('toolbarField')
  })
})
