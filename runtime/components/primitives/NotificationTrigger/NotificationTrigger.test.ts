import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import NotificationTrigger from './NotificationTrigger'
import styles from '#dd/styles/NotificationTrigger.module.css'

describe('NotificationTrigger Primitive', () => {
  it('renders an icon-only notification button', async () => {
    const wrapper = await mountSuspended(NotificationTrigger)

    expect(wrapper.classes()).toContain(styles.notificationTrigger)
    expect(wrapper.find('button').attributes('aria-label')).toBe('Notifications')
    expect(wrapper.html()).toContain('lucide:bell')
    expect(wrapper.find('button').attributes('data-icon-only')).toBeDefined()
  })

  it('renders a detached badge when count is positive', async () => {
    const wrapper = await mountSuspended(NotificationTrigger, {
      props: {
        count: 7
      }
    })

    const badge = wrapper.find(`.${styles.badge}`)
    expect(badge.exists()).toBe(true)
    expect(badge.element.tagName).toBe('SPAN')
    expect(badge.text()).toBe('7')
    expect(badge.attributes('aria-hidden')).toBe('true')
    expect(badge.attributes('data-overflow')).toBeUndefined()
  })

  it('caps the badge label using max', async () => {
    const wrapper = await mountSuspended(NotificationTrigger, {
      props: {
        count: 120,
        max: 99
      }
    })

    const badge = wrapper.find(`.${styles.badge}`)
    expect(badge.text()).toBe('99+')
    expect(badge.attributes('data-overflow')).toBeDefined()
  })

  it('omits the badge when count is zero by default', async () => {
    const wrapper = await mountSuspended(NotificationTrigger, {
      props: {
        count: 0
      }
    })

    expect(wrapper.find(`.${styles.badge}`).exists()).toBe(false)
  })

  it('forwards button visual attrs without applying them to the wrapper', async () => {
    const wrapper = await mountSuspended(NotificationTrigger, {
      attrs: {
        ghost: true,
        class: 'topbar-trigger'
      }
    })

    expect(wrapper.classes()).toContain('topbar-trigger')
    expect(wrapper.attributes('data-ghost')).toBeUndefined()
    expect(wrapper.find('button').attributes('data-ghost')).toBeDefined()
  })
})
