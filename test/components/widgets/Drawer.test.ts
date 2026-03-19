import { describe, it, expect, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Drawer from '../../../runtime/components/widgets/Drawer/Drawer'

describe('Drawer Widget', () => {
  it('renders default slot content correctly when open', async () => {
    // Mock HTMLDialogElement showModal and close because jsdom doesn't fully support it natively sometimes
    HTMLDialogElement.prototype.showModal = vi.fn()
    HTMLDialogElement.prototype.close = vi.fn()

    const wrapper = await mountSuspended(Drawer, {
      props: {
        open: true,
        position: 'left'
      },
      slots: {
        default: () => 'Drawer Body Content'
      }
    })

    expect(wrapper.text()).toContain('Drawer Body Content')
    // Check if the data-position is mapped
    expect(wrapper.find('dialog').attributes('data-position')).toBe('left')
  })

  it('renders title slot and close button when title is provided', async () => {
    const wrapper = await mountSuspended(Drawer, {
      props: {
        open: true,
        title: 'Sidebar Title'
      }
    })

    expect(wrapper.text()).toContain('Sidebar Title')
    expect(wrapper.find('button').exists()).toBe(true) // Close button
  })

  it('renders footer slot', async () => {
    const wrapper = await mountSuspended(Drawer, {
      props: {
        open: true
      },
      slots: {
        footer: () => 'Drawer Footer Actions'
      }
    })

    expect(wrapper.text()).toContain('Drawer Footer Actions')
  })

  it('calls showModal when open prop is set to true', async () => {
    const showModalMock = vi.fn()
    HTMLDialogElement.prototype.showModal = showModalMock

    const wrapper = await mountSuspended(Drawer, {
      props: {
        open: false
      }
    })

    expect(showModalMock).not.toHaveBeenCalled()

    await wrapper.setProps({ open: true })

    expect(showModalMock).toHaveBeenCalled()
  })
})
