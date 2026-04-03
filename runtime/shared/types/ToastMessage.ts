export type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'

export type ToastMessage = {
  id: number
  title?: string
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
  variant?: 'default' | 'solid'
  position?: ToastPosition
  duration: number
}
