import { defineNuxtComponent } from 'nuxt/app'
import { h, computed, type VNode } from 'vue'
import { Icon } from '#components'
import { useBaseComponent } from '#dd/composables/useBaseComponent'
import styles from '#dd/styles/Badge.module.css'
import getPrefixName from '#dd/utils/getPrefixName'

export default defineNuxtComponent({
  name: 'Badge',
  inheritAttrs: false,
  props: {
    /**
     * The name of the icon to display in the badge.
     */
    icon: {
      type: String,
      default: undefined
    },
    /**
     * Custom background color.
     */
    color: {
      type: String,
      default: undefined
    }
  },
  setup(props, { slots, attrs }): () => VNode {
    const { processedAttrs } = useBaseComponent(attrs, styles)

    const defineColor = computed(() => {
      // Only return color if explicit color prop is present.
      // Standard semantic colors are handled via CSS selectors based on attributes.
      if (props.color) return props.color

      return undefined
    })

    const badgeStyle = computed(() => {
      const styles: Record<string, string> = {}
      if (defineColor.value) {
        styles[getPrefixName('badge-base-color', { type: 'css-var-decl' })] =
          defineColor.value
      }
      return styles
    })

    return () => {
      return h(
        'span',
        {
          ...processedAttrs.value,
          class: styles.badge,
          ...(defineColor.value ? { style: badgeStyle.value } : {})
        },
        [
          props.icon && h(Icon, { name: props.icon, class: styles.icon }),
          slots.default?.()
        ]
      )
    }
  }
})
