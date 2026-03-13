export type ToastMessage = {
  id: number
  title?: string
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
  variant?: 'default' | 'solid'
  duration: number
}
