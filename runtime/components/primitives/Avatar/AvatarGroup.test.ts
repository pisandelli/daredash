import { h } from 'vue'
import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import AvatarGroup from './AvatarGroup'

describe('AvatarGroup Primitive', () => {
  it('renders all children by default', async () => {
    const wrapper = await mountSuspended(AvatarGroup, {
      slots: {
        default: () => [
          h('span', { class: 'avatar-child' }, 'A'),
          h('span', { class: 'avatar-child' }, 'B'),
          h('span', { class: 'avatar-child' }, 'C')
        ]
      }
    })

    expect(wrapper.findAll('.avatar-child')).toHaveLength(3)
  })

  it('limits the rendered children when `limit` is provided', async () => {
    const wrapper = await mountSuspended(AvatarGroup, {
      props: {
        limit: 2
      },
      slots: {
        default: () => [
          h('span', { class: 'avatar-child' }, 'A'),
          h('span', { class: 'avatar-child' }, 'B'),
          h('span', { class: 'avatar-child' }, 'C')
        ]
      }
    })

    const children = wrapper.findAll('.avatar-child')
    expect(children).toHaveLength(2)
    expect(wrapper.text()).toContain('A')
    expect(wrapper.text()).toContain('B')
    expect(wrapper.text()).not.toContain('C')
  })
})
