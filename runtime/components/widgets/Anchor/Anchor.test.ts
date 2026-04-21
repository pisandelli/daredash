import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Anchor from './Anchor'
import { h } from 'vue'

describe('Anchor Widget', () => {
  const mockItems = [
    { key: 'section1', href: '#section1', title: 'Section 1' },
    { key: 'section2', href: '#section2', title: () => h('span', { class: 'custom-vnode' }, 'Section 2') }
  ]

  it('renders correct number of anchor links based on items', async () => {
    const wrapper = await mountSuspended(Anchor, {
      props: {
        items: mockItems
      }
    })

    const listItems = wrapper.findAll('li')
    expect(listItems.length).toBe(2)

    const links = wrapper.findAll('a')
    expect(links.length).toBe(2)
    const firstLink = links[0]
    expect(firstLink).toBeDefined()
    expect(firstLink!.text()).toBe('Section 1')
    expect(firstLink!.attributes('href')).toBe('#section1')
  })

  it('renders VNode title correctly', async () => {
    const wrapper = await mountSuspended(Anchor, {
      props: {
        items: mockItems
      }
    })

    const customSpan = wrapper.find('span.custom-vnode')
    expect(customSpan.exists()).toBe(true)
    expect(customSpan.text()).toBe('Section 2')
  })

  it('applies horizontal and affix attributes properly', async () => {
    const wrapper = await mountSuspended(Anchor, {
      props: {
        items: mockItems,
        horizontal: true,
        affix: true,
        offset: 50
      }
    })

    const nav = wrapper.find('nav')
    expect(nav.attributes('data-horizontal')).toBeDefined()
    expect(nav.attributes('data-affix')).toBeDefined()
    expect(nav.attributes('style')).toContain('top: 50px')
  })

  it('emits click event with mouse event and item when link is clicked', async () => {
    const wrapper = await mountSuspended(Anchor, {
      props: {
        items: mockItems
      }
    })

    const firstLink = wrapper.findAll('a')[0]
    expect(firstLink).toBeDefined()
    await firstLink!.trigger('click')

    const clickEvents = wrapper.emitted('click')
    expect(clickEvents).toBeDefined()
    expect(clickEvents!.length).toBe(1)
    
    const firstEmission = clickEvents![0]
    expect(firstEmission).toBeDefined()
    const emittedItem = firstEmission![1]
    expect(emittedItem).toEqual(mockItems[0])
  })
})
