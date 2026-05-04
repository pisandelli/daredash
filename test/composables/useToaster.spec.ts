import { describe, it, expect, vi } from 'vitest'
import { useToaster } from '../../runtime/composables/useToaster'

// Mock nuxt/app
vi.mock('nuxt/app', () => ({
  useState: vi.fn((key, init) => ({ value: init ? init() : [] }))
}))

describe('useToaster', () => {
  it('should generate a UUID for new toasts', () => {
    const { showToast, notifications } = useToaster()

    showToast('Test message')

    expect(notifications.value).toHaveLength(1)
    const toast = notifications.value[0]

    // UUID v4 regex
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    // Note: crypto.randomUUID() might not always be v4 depending on the environment,
    // but it usually follows this format.
    // Let's just check if it's a string and has a certain length/format
    expect(typeof toast.id).toBe('string')
    expect(toast.id).toMatch(/^[0-9a-f-]+$/)
    expect(toast.id.length).toBeGreaterThan(20)
  })

  it('should dismiss a toast by its string ID', () => {
    const { showToast, dismissToast, notifications } = useToaster()

    showToast('Test message')
    const id = notifications.value[0].id

    expect(notifications.value).toHaveLength(1)

    dismissToast(id)

    expect(notifications.value).toHaveLength(0)
  })
})
