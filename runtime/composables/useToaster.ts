import { useState } from 'nuxt/app'
import type { ToastMessage } from '../shared/types/ToastMessage'

type ToastOptions = Partial<Omit<ToastMessage, 'id' | 'message'>>

/**
 * A composable function that provides a simple way to manage and display toast notifications.
 * It exposes methods to show, dismiss, and reactively track notifications.
 */
export const useToaster = () => {
  const notifications = useState<ToastMessage[]>('notifications', () => [])

  /**
   * Displays a new toast notification.
   *
   * @param message The text message to be displayed in the toast.
   * @param options An optional configuration object for the toast.
   */
  const showToast = (message: string, options: ToastOptions = {}) => {
    const id = Date.now() + Math.random() // Unique ID

    const defaults: Omit<ToastMessage, 'id' | 'message'> = {
      type: 'info', // Default type
      position: 'top-right',
      duration: 5000
    }

    const newNotification: ToastMessage = {
      id,
      message,
      ...defaults,
      ...options
    }

    notifications.value.push(newNotification)

    if (newNotification.duration > 0) {
      setTimeout(() => {
        dismissToast(id)
      }, newNotification.duration)
    }
  }

  /**
   * Removes a toast notification from the list by its unique ID.
   *
   * @param id The unique identifier of the notification to be dismissed.
   */
  const dismissToast = (id: number) => {
    const index: number = notifications.value.findIndex(
      (n: ToastMessage) => n.id === id
    )
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  return {
    notifications,
    showToast,
    dismissToast
  }
}
