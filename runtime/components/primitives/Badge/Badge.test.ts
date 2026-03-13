import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import getPrefixName from '../../../shared/utils/getPrefixName'
import Badge from './Badge'

describe('Badge Primitive', () => {
  it('renders default slot content correctly', async () => {
    const wrapper = await mountSuspended(Badge, {
      slots: {
        default: () => 'New'
      }
    })

    expect(wrapper.text()).toContain('New')
  })

  it('renders `data-` attributes from boolean properties using useBaseComponent', async () => {
    const wrapper = await mountSuspended(Badge, {
      props: {
        success: true,
        large: true
      }
    })

    expect(wrapper.attributes('data-success')).toBeDefined()
    expect(wrapper.attributes('data-large')).toBeDefined()
  })

  it('binds custom `color` via CSS variable style correctly', async () => {
    const wrapper = await mountSuspended(Badge, {
      props: {
        color: '#ffba00'
      }
    })

    const styleAttr = wrapper.attributes('style')
    expect(styleAttr).toBeDefined()
    expect(styleAttr).toContain('#ffba00')
    expect(styleAttr).toContain(
      getPrefixName('badge-base-color', { type: 'css-var-decl' })
    )
  })

  it('renders the given icon through the Icon component', async () => {
    const wrapper = await mountSuspended(Badge, {
      props: {
        icon: 'heroicons:star'
      }
    })

    const html = wrapper.html()
    expect(html).toContain('heroicons:star')
  })
})
