import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Radio from './Radio'

describe('Radio Primitive', () => {
  it('applies consumer layout hooks to the outer wrapper', async () => {
    const wrapper = await mountSuspended(Radio, {
      attrs: {
        class: 'toolbarField',
        style: 'flex: 0 1 256px;'
      },
      props: {
        value: 'option-a'
      }
    })

    const field = wrapper.findAll('div')[1]
    expect(field.classes()).toContain('toolbarField')
    expect(field.attributes('style')).toContain('flex-basis: 256px;')
  })
})
