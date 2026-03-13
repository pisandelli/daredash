import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import getPrefixName from '../../../shared/utils/getPrefixName'
import Avatar from './Avatar'

describe('Avatar Primitive', () => {
  it('renders initials as fallback when no src is provided', async () => {
    const wrapper = await mountSuspended(Avatar, {
      props: {
        alt: 'John Doe'
      }
    })

    // Fallback initials algorithm is expected to take the first char of first and last word
    expect(wrapper.text()).toContain('JD')
    // No img tag should exist without src
    expect(wrapper.find('img').exists()).toBe(false)
  })

  it('renders single initial if alt is a single word', async () => {
    const wrapper = await mountSuspended(Avatar, {
      props: {
        alt: 'Admin'
      }
    })

    expect(wrapper.text()).toContain('AD')
  })

  it('renders wildcard initial if alt is missing', async () => {
    const wrapper = await mountSuspended(Avatar, {})

    expect(wrapper.text()).toContain('?')
  })

  it('renders image when src is provided', async () => {
    const wrapper = await mountSuspended(Avatar, {
      props: {
        src: 'https://daredash.ui/avatar.png',
        alt: 'Avatar Image'
      }
    })

    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('https://daredash.ui/avatar.png')
    expect(img.attributes('alt')).toBe('Avatar Image')
  })

  it('renders `data-` attributes from boolean properties using useBaseComponent', async () => {
    const wrapper = await mountSuspended(Avatar, {
      props: {
        square: true,
        online: true
      }
    })

    expect(wrapper.attributes('data-square')).toBeDefined()
    expect(wrapper.attributes('data-online')).toBeDefined()
  })

  it('calculates consistent background colors using CSS variables for fallback initials', async () => {
    const wrapper = await mountSuspended(Avatar, {
      props: {
        alt: 'John Doe'
      }
    })

    const styleAttr = wrapper.attributes('style')
    expect(styleAttr).toBeDefined()
    // It should bind variable using dynamic prefix
    expect(styleAttr).toContain(
      getPrefixName('avatar-background-color', { type: 'css-var-decl' })
    )
    expect(styleAttr).toContain(
      getPrefixName('avatar-color', { type: 'css-var-decl' })
    )
  })
})
