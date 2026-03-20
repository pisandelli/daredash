import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Breadcrumb from './Breadcrumb'
import getPrefixName from '#dd/utils/getPrefixName'
import { h } from 'vue'

describe('Breadcrumb Primitive', () => {
  it('renders correct number of items based on routes config', async () => {
    const wrapper = await mountSuspended(Breadcrumb, {
      props: {
        config: {
          routes: [
            { label: 'Home', to: '/' },
            { label: 'Settings', to: '/settings' },
            { label: 'Profile' }
          ]
        }
      }
    })

    const items = wrapper.findAll('li')
    expect(items.length).toBe(3)
  })

  it('renders intermediate items as NuxtLink and last item as span', async () => {
    const wrapper = await mountSuspended(Breadcrumb, {
      props: {
        config: {
          routes: [
            { label: 'Home', to: '/' },
            { label: 'Config', to: '/config' },
            { label: 'Current' }
          ]
        }
      }
    })

    const items = wrapper.findAll('li')
    
    const firstLink = items[0]!.find('a')
    expect(firstLink.exists()).toBe(true)
    
    const lastItem = items[2]!.find('span[aria-current="page"]')
    expect(lastItem.exists()).toBe(true)
  })

  it('renders default separator between items', async () => {
    const wrapper = await mountSuspended(Breadcrumb, {
      props: {
        config: {
          routes: [
            { label: 'A', to: '/a' },
            { label: 'B' }
          ]
        }
      }
    })

    const separators = wrapper.findAll('span[aria-hidden="true"]')
    expect(separators.length).toBe(1)
    expect(separators[0]!.text()).toContain('➜')
  })

  it('renders custom separator character', async () => {
    const wrapper = await mountSuspended(Breadcrumb, {
      props: {
        config: {
          separator: '/',
          routes: [
            { label: 'A', to: '/a' },
            { label: 'B' }
          ]
        }
      }
    })

    const separators = wrapper.findAll('span[aria-hidden="true"]')
    expect(separators[0]!.text()).toBe('/')
  })

  it('applies custom hoverColor via CSS variable interpolation', async () => {
    const wrapper = await mountSuspended(Breadcrumb, {
      props: {
        config: {
          routes: [
            { label: 'Home', to: '/', hoverColor: 'success' },
            { label: 'Current' }
          ]
        }
      }
    })

    // It depends on whether test-utils mounts NuxtLink properly. We can just check the component element directly.
    const firstItem = wrapper.findAll('li')[0]
    const linkNode = firstItem!.find('a')
    
    expect(linkNode.exists()).toBe(true)
    
    // To test the attribute binding on the rendered element by NuxtLink
    const expectedVar = getPrefixName('breadcrumbs-item-hover-color', { type: 'css-var-decl' })
    const styleAttr = linkNode.attributes('style')
    
    expect(styleAttr).toBeDefined()
    expect(styleAttr).toContain(expectedVar)
    expect(styleAttr).toContain('success')
  })
})
