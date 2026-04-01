import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Breadcrumb from './Breadcrumb'

describe('Breadcrumb Security', () => {
  it('escapes XSS payload in label', async () => {
    const xssPayload = '<script id="xss-label">alert("xss-label")</script>'
    const wrapper = await mountSuspended(Breadcrumb, {
      props: {
        config: {
          routes: [
            { label: xssPayload }
          ]
        }
      }
    })

    // If it's vulnerable, the script tag will be present in the DOM
    const scriptTag = wrapper.find('#xss-label')
    expect(scriptTag.exists()).toBe(false)

    // The text content should contain the payload as literal text
    expect(wrapper.html()).toContain('&lt;script id="xss-label"&gt;alert("xss-label")&lt;/script&gt;')
  })

  it('escapes XSS payload in separator', async () => {
    const xssPayload = '<script id="xss-separator">alert("xss-separator")</script>'
    const wrapper = await mountSuspended(Breadcrumb, {
      props: {
        config: {
          separator: xssPayload,
          routes: [
            { label: 'Home', to: '/' },
            { label: 'End' }
          ]
        }
      }
    })

    // If it's vulnerable, the script tag will be present in the DOM
    const scriptTag = wrapper.find('#xss-separator')
    expect(scriptTag.exists()).toBe(false)

    // The text content should contain the payload as literal text
    expect(wrapper.html()).toContain('&lt;script id="xss-separator"&gt;alert("xss-separator")&lt;/script&gt;')
  })
})
