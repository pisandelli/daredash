import { describe, it, expect, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Modal from '../../../runtime/components/widgets/Modal/Modal'

describe('Modal Widget', () => {
  it('renders default slot content correctly when open', async () => {
    HTMLDialogElement.prototype.showModal = vi.fn()
    HTMLDialogElement.prototype.close = vi.fn()

    const wrapper = await mountSuspended(Modal, {
      props: {
        open: true
      },
      slots: {
        default: () => 'Modal Body Content'
      }
    })

    expect(wrapper.text()).toContain('Modal Body Content')
    expect(wrapper.find('dialog').exists()).toBe(true)
  })

  it('renders title and close button when title is provided', async () => {
    const wrapper = await mountSuspended(Modal, {
      props: {
        open: true,
        title: 'Confirm Action'
      }
    })

    expect(wrapper.text()).toContain('Confirm Action')
    expect(wrapper.find('button[aria-label="Close modal"]').exists()).toBe(true)
  })

  it('renders footer slot', async () => {
    const wrapper = await mountSuspended(Modal, {
      props: {
        open: true
      },
      slots: {
        footer: () => 'Modal Footer Actions'
      }
    })

    expect(wrapper.text()).toContain('Modal Footer Actions')
  })

  it('calls showModal when open prop is set to true', async () => {
    const showModalMock = vi.fn()
    HTMLDialogElement.prototype.showModal = showModalMock

    const wrapper = await mountSuspended(Modal, {
      props: {
        open: false
      }
    })

    expect(showModalMock).not.toHaveBeenCalled()

    await wrapper.setProps({ open: true })

    expect(showModalMock).toHaveBeenCalled()
  })
})
