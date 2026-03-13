import { defineNuxtComponent } from 'nuxt/app'
import { h, computed, type VNode } from 'vue'
import { useAppConfig } from '#imports'
import { Icon } from '#components'
import { useBaseComponent } from '#dd/composables/useBaseComponent'
import styles from '#dd/styles/Toast.module.css'
import getPrefixName from '#dd/utils/getPrefixName'
import type { PropType } from 'vue'

export default defineNuxtComponent({
  name: 'Toast',
  inheritAttrs: false,
  props: {
    /**
     * The main title text of the toast notification.
     */
    title: {
      type: String,
      default: undefined
    },
    /**
     * Custom icon to display in the toast. Overrides default state icons.
     */
    icon: {
      type: String,
      default: undefined
    }
  },
  emits: ['close'],
  setup(props, { slots, attrs, emit }): () => VNode {
    const { processedAttrs, classList } = useBaseComponent(attrs, styles)
    const appConfig = useAppConfig() as any
    const globalIcons = appConfig.daredash?.icons || {}

    const iconName = computed(() => {
      if (props.icon) return props.icon
      if (attrs.success !== undefined && attrs.success !== false)
        return globalIcons.success || 'heroicons:check-circle'
      if (attrs.error !== undefined && attrs.error !== false)
        return globalIcons.error || 'heroicons:x-circle'
      if (attrs.warning !== undefined && attrs.warning !== false)
        return globalIcons.warning || 'heroicons:exclamation-triangle'
      return globalIcons.info || 'heroicons:information-circle'
    })

    return () => {
      const iconNode = h('div', { class: styles.iconWrapper }, [
        h(Icon, { name: iconName.value, size: '24px' })
      ])

      const titleNode = props.title
        ? h('span', { class: styles.title }, props.title)
        : null

      const descriptionNode = h(
        'span',
        { class: styles.description },
        slots.default?.()
      )

      const contentNode = h('div', { class: styles.content }, [
        titleNode,
        descriptionNode
      ])

      const closeButton = h(
        'div',
        { class: styles.closeWrapper },
        h(
          'button',
          {
            class: styles.close,
            onClick: () => emit('close'),
            'aria-label': 'Dismiss'
          },
          h(Icon, {
            name: globalIcons.toastClose || 'heroicons:x-mark',
            size: '1.25rem'
          })
        )
      )

      return h(
        'div',
        {
          ...processedAttrs.value,
          class: [styles.toast, attrs.class]
        },
        [iconNode, contentNode, closeButton]
      )
    }
  }
})
