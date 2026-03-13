import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import getPrefixName from '../../../shared/utils/getPrefixName'
import Button from './Button'

describe('Button Primitive', () => {
  it('renders default slot content correctly', async () => {
    const wrapper = await mountSuspended(Button, {
      slots: {
        default: () => 'Click Me'
      }
    })

    expect(wrapper.text()).toContain('Click Me')
  })

  it('renders as a NuxtLink when `to` prop is provided', async () => {
    const wrapper = await mountSuspended(Button, {
      props: {
        to: '/dashboard'
      },
      slots: {
        default: () => 'Go to Dashboard'
      }
    })

    // It should render an 'a' tag (since NuxtLink resolves to an anchor tag in standard mounts or router mocks)
    expect(wrapper.find('a').exists()).toBe(true)
    expect(wrapper.find('a').attributes('href')).toBe('/dashboard')
  })

  it('renders as a native anchor tag when `href` prop is provided', async () => {
    const wrapper = await mountSuspended(Button, {
      props: {
        href: 'https://daredash.ui'
      },
      slots: {
        default: () => 'External Link'
      }
    })

    expect(wrapper.find('a').exists()).toBe(true)
    expect(wrapper.find('a').attributes('href')).toBe('https://daredash.ui')
  })

  it('renders `data-` attributes from boolean properties using useBaseComponent', async () => {
    // According to Rule 10: boolean attributes define styling/state and get prefixed with `data-`
    const wrapper = await mountSuspended(Button, {
      props: {
        success: true,
        large: true,
        disabled: true
      }
    })

    // The button element should have these converted to data-* by useBaseComponent and processAttrs
    expect(wrapper.attributes('data-success')).toBeDefined()
    expect(wrapper.attributes('data-large')).toBeDefined()
    expect(wrapper.attributes('disabled')).toBeDefined()
  })

  it('binds custom `color` via CSS variable style correctly', async () => {
    const wrapper = await mountSuspended(Button, {
      props: {
        color: '#ffba00'
      }
    })

    // Button computes style for custom colors dynamically based on prefix
    const expectedVar = getPrefixName('button-base-color', {
      type: 'css-var-decl'
    })
    // Let's just check if the custom color string is present in the style attribute
    const styleAttr = wrapper.attributes('style')
    expect(styleAttr).toBeDefined()
    expect(styleAttr).toContain('#ffba00')
    expect(styleAttr).toContain(expectedVar)
  })

  it('renders the given icon through the Icon component', async () => {
    const wrapper = await mountSuspended(Button, {
      props: {
        icon: 'mdi:home'
      }
    })

    // The icon is rendered by Nuxt Icon module (which usually renders an SVG inside a span)
    // We check if the wrapping span or the icon component exists with the corresponding name
    const html = wrapper.html()
    expect(html).toContain('mdi:home')
  })

  it('adds `data-icon-only` when an icon is provided but no slots', async () => {
    const wrapper = await mountSuspended(Button, {
      props: {
        icon: 'mdi:pencil'
      }
      // No slots provided
    })

    expect(wrapper.attributes('data-icon-only')).toBeDefined()
  })
})
