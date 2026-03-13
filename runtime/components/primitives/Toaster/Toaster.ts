import { defineNuxtComponent } from 'nuxt/app'
import { h, Teleport, TransitionGroup, type VNode, resolveComponent } from 'vue'
import { useToaster } from '#dd/composables/useToaster'
import getPrefixName from '#dd/utils/getPrefixName'
import styles from '#dd/styles/Toaster.module.css'

export default defineNuxtComponent({
  name: 'Toaster',
  setup(): () => VNode {
    const { notifications, dismissToast } = useToaster()

    const ToastComponent = resolveComponent(
      getPrefixName('Toast', { type: 'component' })
    )

    return () => {
      const toastNodes = notifications.value.map((notification) =>
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
        { class: styles.toaster },
        transitionGroup
      )

      return h(Teleport, { to: 'body' }, toasterContainer)
    }
  }
})
