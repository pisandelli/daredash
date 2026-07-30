import { defineNuxtComponent } from 'nuxt/app'
import { computed, h, resolveComponent, type PropType, type VNode } from 'vue'
import { useAppConfig } from '#imports'
import processAttrs from '#dd/utils/processedAttrs'
import getPrefixName from '#dd/utils/getPrefixName'
import styles from '#dd/styles/NotificationTrigger.module.css'

export default defineNuxtComponent({
  name: 'NotificationTrigger',
  inheritAttrs: false,
  props: {
    /**
     * Number displayed in the detached badge.
     */
    count: {
      type: Number,
      default: 0
    },
    /**
     * Highest number rendered before using the compact "max+" label.
     */
    max: {
      type: Number,
      default: 99
    },
    /**
     * Icon displayed by the underlying icon-only button.
     */
    icon: {
      type: String,
      default: undefined
    },
    /**
     * Accessible label for the notification button.
     */
    label: {
      type: String,
      default: 'Notifications'
    },
    /**
     * Renders a zero badge when count is 0.
     */
    showZero: {
      type: Boolean,
      default: false
    },
    /**
     * Optional route target passed to the underlying button.
     */
    to: {
      type: [String, Object] as PropType<string | Record<string, unknown>>,
      default: undefined
    },
    /**
     * Optional href passed to the underlying button.
     */
    href: {
      type: String,
      default: undefined
    }
  },
  setup(props, { attrs, slots }): () => VNode {
    const DdButton = resolveComponent(getPrefixName('Button', { type: 'component' }))
    const appConfig = useAppConfig()
    const globalIcons = (appConfig.daredash?.icons || {}) as Record<string, string | undefined>

    const hasBadge = computed(() => props.count > 0 || props.showZero)
    const badgeLabel = computed(() => {
      if (props.max > 0 && props.count > props.max) return `${props.max}+`
      return String(props.count)
    })
    const buttonAttrs = computed(() => processAttrs(attrs))

    return () => {
      return h('span', {
        class: [styles.notificationTrigger, attrs.class],
        style: attrs.style
      }, [
        h(DdButton, {
          ...buttonAttrs.value,
          icon: props.icon || globalIcons.notification || 'lucide:bell',
          'aria-label': attrs['aria-label'] || props.label,
          ...(props.to ? { to: props.to } : {}),
          ...(props.href ? { href: props.href } : {})
        }, slots.default),
        hasBadge.value
          ? h('span', {
              class: styles.badge,
              'data-overflow': badgeLabel.value.length > 1 ? '' : undefined,
              'aria-hidden': 'true'
            }, badgeLabel.value)
          : null
      ])
    }
  }
})
