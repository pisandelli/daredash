import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Card from './Card'

describe('Card Primitive', () => {
  it('renders default slot content correctly inside a section', async () => {
    const wrapper = await mountSuspended(Card, {
      slots: {
        default: () => 'Card Content'
      }
    })

    // The default slot should be rendered within a section element inside the Card
    expect(wrapper.find('section').exists()).toBe(true)
    expect(wrapper.find('section').text()).toContain('Card Content')
  })

  it('renders header slot if provided', async () => {
    const wrapper = await mountSuspended(Card, {
      slots: {
        header: () => 'Card Header'
      }
    })

    expect(wrapper.find('header').exists()).toBe(true)
    expect(wrapper.find('header').text()).toContain('Card Header')
  })

  it('renders footer slot if provided', async () => {
    const wrapper = await mountSuspended(Card, {
      slots: {
        footer: () => 'Card Footer'
      }
    })

    expect(wrapper.find('footer').exists()).toBe(true)
    expect(wrapper.find('footer').text()).toContain('Card Footer')
  })

  it('renders `data-` attributes from boolean properties using useBaseComponent', async () => {
    const wrapper = await mountSuspended(Card, {
      props: {
        flat: true,
        noborder: true
      }
    })

    // The Card wraps around a root component, so the attributes should be applied to the topmost container
    expect(wrapper.attributes('data-flat')).toBeDefined()
    expect(wrapper.attributes('data-noborder')).toBeDefined()
  })
})
