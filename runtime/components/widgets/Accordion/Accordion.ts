import { defineNuxtComponent } from 'nuxt/app'
import { h, inject, type VNode } from 'vue'
import { useBaseComponent } from '#dd/composables/useBaseComponent'
import getPrefixName from '#dd/utils/getPrefixName'
import styles from '#dd/styles/Accordion.module.css'
import { Icon } from '#components'
import { AccordionGroupInjectionKey } from './AccordionGroup'

export default defineNuxtComponent({
  name: 'Accordion',
  inheritAttrs: false,
  props: {
    /**
     * The title of the accordion summary.
     */
    title: {
      type: String,
      required: true
    },
    /**
     * Optional icon to display before the title.
     * Use `@nuxt/icon` format (e.g., 'heroicons:user').
     */
    icon: {
      type: String,
      default: undefined
    },
    /**
     * Accent color to highlight the item. Overrides the group's accent color if provided.
     */
    accentColor: {
      type: String,
      default: undefined
    },
    /**
     * Explicit native name attribute. If omitted, it will inherit from a parent AccordionGroup if present.
     */
    name: {
      type: String,
      default: undefined
    }
  },
  setup(props, { slots, attrs }) {
    const { processedAttrs, classList } = useBaseComponent(
      attrs,
      styles,
      'Accordion'
    )

    // Inject context if nested inside an AccordionGroup
    const groupContext = inject(AccordionGroupInjectionKey, null) as {
      name?: string
      accentColor?: string
    } | null

    return () => {
      // Determine final properties combining local props and injected context
      const finalName = props.name || groupContext?.name
      const finalAccentColor = props.accentColor || groupContext?.accentColor

      // Prepare attributes for the details element
      const detailsAttrs: Record<string, any> = {
        ...processedAttrs.value,
        class: classList.value
      }

      // Map custom color to the public component token or standard semantic data attribute
      if (finalAccentColor) {
        const semanticVariants = ['primary', 'success', 'warning', 'danger', 'info']
        if (semanticVariants.includes(finalAccentColor)) {
          detailsAttrs[`data-${finalAccentColor}`] = ''
        } else {
          detailsAttrs.style = {
            [getPrefixName('accordion-accent-color', { type: 'css-var-decl' })]: finalAccentColor
          }
        }
      }

      // Mutual exclusivity native HTML5 implementation
      if (finalName) {
        detailsAttrs.name = finalName
      }

      // Title Content (Header)
      const summaryChildren: VNode[] = []

      const titleWrapper: VNode[] = []
      if (props.icon) {
        titleWrapper.push(
          h(Icon, {
            name: props.icon,
            class: styles.leadicon,
            'aria-hidden': 'true'
          })
        )
      }
      titleWrapper.push(h('span', { class: styles.title }, props.title))

      summaryChildren.push(
        h('span', { class: styles.titlewrapper }, titleWrapper)
      )

      // Active state chevron
      summaryChildren.push(
        h('span', { class: styles.icon, 'aria-hidden': 'true' }, [
          h(Icon, { name: 'heroicons:chevron-down' })
        ])
      )

      // Body Content wrapper EXACTLY matching the Vue Example for Grid Animation
      const bodyContent = h('div', { class: styles.contentwrapper }, [
        h('div', { class: styles.contentinner }, [slots.default?.()])
      ])

      return h('details', detailsAttrs, [
        h('summary', { class: styles.summary }, summaryChildren),
        bodyContent
      ])
    }
  }
})
