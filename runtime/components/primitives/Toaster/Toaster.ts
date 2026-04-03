import { defineNuxtComponent } from 'nuxt/app'
import { h, Teleport, TransitionGroup, type VNode, resolveComponent } from 'vue'
import { useToaster } from '#dd/composables/useToaster'
import { useBaseComponent } from '#dd/composables/useBaseComponent'
import getPrefixName from '#dd/utils/getPrefixName'
import styles from '#dd/styles/Toaster.module.css'

export default defineNuxtComponent({
  name: 'Toaster',
  inheritAttrs: false,
  setup(props, { attrs }): () => VNode {
    const { notifications, dismissToast } = useToaster()
    const { processedAttrs, classList } = useBaseComponent(attrs, styles, 'Toaster')

    const myPosition = computed(() => {
      if ('top-left' in attrs && attrs['top-left'] !== false) return 'top-left'
      if ('bottom-right' in attrs && attrs['bottom-right'] !== false) return 'bottom-right'
      if ('bottom-left' in attrs && attrs['bottom-left'] !== false) return 'bottom-left'
      return 'top-right'
    })

    const ToastComponent = resolveComponent(
      getPrefixName('Toast', { type: 'component' })
    )

    return () => {
      const filteredNotifications = notifications.value.filter(n => n.position === myPosition.value)

      const toastNodes = filteredNotifications.map((notification) =>
        h(
          ToastComponent,
          {
            key: notification.id,
            title: notification.title,
            onClose: () => dismissToast(notification.id),
            [notification.type]: true,
            ...(notification.variant === 'solid' ? { solid: true } : {})
          },
          () => notification.message
        )
      )

      const transitionGroup = h(
        TransitionGroup,
        {
          name: 'toast-fade',
          tag: 'div'
        },
        () => toastNodes
      )

      const toasterContainer = h(
        'div',
        { 
          ...processedAttrs.value,
          class: classList.value 
        },
        transitionGroup
      )

      return h(Teleport, { to: 'body' }, toasterContainer)
    }
  }
})
