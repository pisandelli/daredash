import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import getPrefixName from '../../../shared/utils/getPrefixName'
import Skeleton from './Skeleton'

describe('Skeleton Primitive', () => {
  it('renders as an aria-hidden placeholder by default', async () => {
    const wrapper = await mountSuspended(Skeleton)

    expect(wrapper.attributes('aria-hidden')).toBe('true')
  })

  it('supports custom width, height and radius via CSS variables', async () => {
    const wrapper = await mountSuspended(Skeleton, {
      props: {
        width: '12rem',
        height: '2rem',
        radius: '999px'
      }
    })

    const styleAttr = wrapper.attributes('style')
    expect(styleAttr).toContain(getPrefixName('skeleton-inline-size', { type: 'css-var-decl' }))
    expect(styleAttr).toContain('12rem')
    expect(styleAttr).toContain(getPrefixName('skeleton-block-size', { type: 'css-var-decl' }))
    expect(styleAttr).toContain('2rem')
    expect(styleAttr).toContain(getPrefixName('skeleton-radius', { type: 'css-var-decl' }))
    expect(styleAttr).toContain('999px')
  })

  it('renders the circle modifier class when requested', async () => {
    const wrapper = await mountSuspended(Skeleton, {
      props: {
        circle: true
      }
    })

    expect(wrapper.classes().join(' ')).toContain('circle')
  })

  it('can disable animation with the static modifier', async () => {
    const wrapper = await mountSuspended(Skeleton, {
      props: {
        animated: false
      }
    })

    expect(wrapper.classes().join(' ')).toContain('static')
  })
})
