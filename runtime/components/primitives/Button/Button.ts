import { defineNuxtComponent } from 'nuxt/app'
import { h, computed, type VNode } from 'vue'
import { NuxtLink, Icon } from '#components'
import { useBaseComponent } from '#dd/composables/useBaseComponent'
import styles from '#dd/styles/Button.module.css'
import getPrefixName from '#dd/utils/getPrefixName'
import { sanitizeHref } from '#dd/utils/sanitizeHref'

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
     * Custom foreground color for the button text and icon.
     * Overrides theme text colors for this instance only.
     */
    textColor: {
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
      if (props.color) return props.color

      return undefined
    })

    const defineTextColor = computed(() => {
      if (props.textColor) return props.textColor

      return undefined
    })

    const buttonStyle = computed(() => {
      const styles: Record<string, string> = {}

      if (defineColor.value) {
        styles[getPrefixName('button-base-color', { type: 'css-var-decl' })] =
          defineColor.value
      }

      if (defineTextColor.value) {
        styles[getPrefixName('button-color', { type: 'css-var-decl' })] =
          defineTextColor.value
      }

      return styles
    })

    const isIconOnly = computed(() => props.icon && !slots.default)

    return () => {
      const renderProps = {
        ...processedAttrs.value,
        class: classList.value,
        ...(Object.keys(buttonStyle.value).length > 0 ? { style: buttonStyle.value } : {}),
        'data-icon-only': isIconOnly.value ? '' : undefined,
        ...(props.to && { to: props.to }),
        ...(props.href && { href: sanitizeHref(props.href) })
      }

      return h(component.value as any, renderProps, {
        default: () => {
          const children = []
          if (props.icon) {
            children.push(h(Icon, { name: props.icon, class: styles.icon }))
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
