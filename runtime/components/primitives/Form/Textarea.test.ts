import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Textarea from './Textarea'

describe('Textarea Primitive', () => {
  it('omits validation message while preserving the counter when no-message is used', async () => {
    const wrapper = await mountSuspended(Textarea, {
      attrs: {
        'no-message': true,
        error: 'Too short'
      },
      props: {
        maxLength: 120,
        modelValue: 'Short note'
      }
    })

    expect(wrapper.find('textarea').exists()).toBe(true)
    expect(wrapper.text()).not.toContain('Too short')
    expect(wrapper.text()).toContain('10 / 120')
  })
})
