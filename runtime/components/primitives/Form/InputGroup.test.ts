import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { h } from 'vue'
import InputGroup from './InputGroup'

describe('InputGroup Primitive', () => {
  it('renders the shared required marker when the group is required', async () => {
    const wrapper = await mountSuspended(InputGroup, {
      props: {
        label: 'Amount'
      },
      attrs: {
        required: true
      },
      slots: {
        default: () => h('input', { type: 'text' })
      }
    })

    const marker = wrapper.find('[data-field-required-marker]')

    expect(marker.exists()).toBe(true)
    expect(marker.text()).toBe('*')
  })

  it('uses the shared field shell structure for label and feedback rhythm', async () => {
    const wrapper = await mountSuspended(InputGroup, {
      props: {
        label: 'Website',
        errorMessage: 'Invalid URL'
      },
      attrs: {
        error: true
      },
      slots: {
        default: () => h('input', { type: 'text' })
      }
    })

    expect(wrapper.find('[data-field-shell]').exists()).toBe(true)
    expect(wrapper.find('[data-field-label]').text()).toContain('Website')
    expect(wrapper.find('[data-field-message]').text()).toBe('Invalid URL')
  })
})
