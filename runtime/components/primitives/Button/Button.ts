import { defineNuxtComponent } from 'nuxt/app'
import { h, computed, type VNode } from 'vue'
import { NuxtLink, Icon } from '#components'
import { useBaseComponent } from '#dd/composables/useBaseComponent'
import styles from '#dd/styles/Button.module.css'
import getPrefixName from '#dd/utils/getPrefixName'

export default defineNuxtComponent({
  name: 'Button',
  inheritAttrs: false,
  props: {
    /**
     * Custom background color for the button.
     * Overrides theme colors set by boolean attributes.
     */
    color: {
      type: String,
      default: undefined
    },
    /**
     * The name of the icon to display on the left side of the button.
     */
    icon: {
      type: String,
      default: undefined
    },
    /**
     * If provided, the button will be rendered as a NuxtLink pointing to this location.
     */
    to: {
      type: [String, Object], // NuxtLink `to` can be an object
      default: undefined
    },
    /**
     * If provided (and `to` is not), the button will be rendered as a NuxtLink with this href.
     */
    href: {
      type: String,
      default: undefined
    }
  },
  setup(props, { slots, attrs }): () => VNode {
    const { processedAttrs, classList } = useBaseComponent(
      attrs,
      styles,
      'Button'
    )

    const component = computed(() => {
      if (props.to || props.href) return NuxtLink
      return 'button'
    })

    const defineColor = computed(() => {
      // Only return color if explicit color prop is present.
      // Standard semantic colors are handled via CSS selectors based on attributes.
      if (props.color) return props.color

      return undefined
    })

    const buttonStyle = computed(() => {
      const styles: Record<string, string> = {}

      if (defineColor.value) {
        // Bind the calculated color to the Proxy Variable
        styles[getPrefixName('button-base-color', { type: 'css-var-decl' })] =
          defineColor.value
      }

      return styles
    })

    const isIconOnly = computed(() => props.icon && !slots.default)

    const iconSize = '1.25em'

    return () => {
      const renderProps = {
        ...processedAttrs.value,
        class: classList.value,
        ...(defineColor.value ? { style: buttonStyle.value } : {}),
        'data-icon-only': isIconOnly.value ? '' : undefined,
        ...(props.to && { to: props.to }),
        ...(props.href && { href: props.href })
      }

      return h(component.value as any, renderProps, {
        default: () => {
          const children = []
          if (props.icon) {
            // Updated to use relative styling or standard size
            children.push(
              h(Icon, { name: props.icon, size: iconSize, class: styles.icon })
            )
          }
          if (slots.default) {
            children.push(...slots.default())
          }
          return children
        }
      })
    }
  }
})
