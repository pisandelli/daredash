import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import InputSearch from './InputSearch'

describe('InputSearch Primitive', () => {
  it('renders the default button action', async () => {
    const wrapper = await mountSuspended(InputSearch, {})

    expect(wrapper.find('button').exists()).toBe(true)
    expect(wrapper.find('input').attributes('type')).toBe('search')
  })

  it('renders a leading inline search icon without a button', async () => {
    const wrapper = await mountSuspended(InputSearch, {
      attrs: { 'no-button': true }
    })

    expect(wrapper.find('button').exists()).toBe(false)
    expect(wrapper.find('input').attributes('data-no-button')).toBeDefined()
    expect(wrapper.html()).toContain('lucide:search')
  })

  it('moves the inline icon to the end when icon-right is used', async () => {
    const wrapper = await mountSuspended(InputSearch, {
      attrs: { 'no-button': true, 'icon-right': true }
    })

    expect(wrapper.find('input').attributes('data-icon-right')).toBeDefined()
    expect(wrapper.find('[aria-hidden="true"]').exists()).toBe(true)
  })

  it.each(['small', 'large'])('supports the %s inline icon size', async (size) => {
    const wrapper = await mountSuspended(InputSearch, {
      attrs: { 'no-button': true, [size]: true }
    })

    expect(wrapper.find('input').attributes(`data-${size}`)).toBeDefined()
    expect(wrapper.attributes(`data-${size}`)).toBeDefined()
  })

  it('emits search when Enter is pressed in the no-button variation', async () => {
    const wrapper = await mountSuspended(InputSearch, {
      props: { modelValue: 'clients' },
      attrs: { 'no-button': true }
    })

    await wrapper.find('input').trigger('keydown', { key: 'Enter' })

    expect(wrapper.emitted('search')?.[0]).toEqual(['clients'])
  })
})
