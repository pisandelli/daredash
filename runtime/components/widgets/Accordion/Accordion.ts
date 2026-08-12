import { defineNuxtComponent } from 'nuxt/app'
import { h, inject, type VNode, ref, computed, useId } from 'vue'
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
     * Use `@nuxt/icon` format (e.g., 'lucide:user').
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
     * Whether the accordion is open by default.
     */
    defaultOpen: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { slots, attrs }) {
    const { processedAttrs, classList } = useBaseComponent(
      attrs,
      styles,
      'Accordion'
    )

    const id = useId()
    const localIsOpen = ref(props.defaultOpen)

    // Inject context if nested inside an AccordionGroup
    const groupContext = inject(AccordionGroupInjectionKey, null) as {
      openItems?: { value: Set<string> }
      registerItem?: (id: string, defaultOpen: boolean) => void
      toggleItem?: (id: string, isOpen: boolean) => void
      accentColor?: string
      isControlled?: boolean
    } | null

    const isOpen = computed(() => {
      if (groupContext?.isControlled && groupContext.openItems) {
        return groupContext.openItems.value.has(id)
      }
      return localIsOpen.value
    })

    const toggle = () => {
      const nextState = !isOpen.value
      if (groupContext?.isControlled && groupContext.toggleItem) {
        groupContext.toggleItem(id, nextState)
      } else {
        localIsOpen.value = nextState
      }
    }
    groupContext?.registerItem?.(id, props.defaultOpen)

    return () => {
      // Determine final properties combining local props and injected context
      const finalAccentColor = props.accentColor || groupContext?.accentColor

      // Prepare attributes for the root div element
      const wrapperAttrs: Record<string, any> = {
        ...processedAttrs.value,
        class: [classList.value, { [styles.isopen]: isOpen.value }]
      }

      // Map custom color to the public component token or standard semantic data attribute
      if (finalAccentColor) {
        const semanticVariants = ['primary', 'success', 'warning', 'danger', 'info']
        if (semanticVariants.includes(finalAccentColor)) {
          wrapperAttrs[`data-${finalAccentColor}`] = ''
        } else {
          wrapperAttrs.style = {
            [getPrefixName('accordion-accent-color', { type: 'css-var-decl' })]: finalAccentColor
          }
        }
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
          h(Icon, { name: 'lucide:chevron-down' })
        ])
      )

      // Body Content wrapper EXACTLY matching the Vue Example for Grid Animation
      const bodyContent = h(
        'div',
        { 
          class: styles.contentwrapper,
          id: `accordion-content-${id}`,
          role: 'region',
          'aria-labelledby': `accordion-header-${id}`
        },
        [
          h('div', { class: styles.contentinner }, [slots.default?.()])
        ]
      )

      return h('div', wrapperAttrs, [
        h(
          'button',
          {
            class: styles.summary,
            id: `accordion-header-${id}`,
            type: 'button',
            'aria-expanded': isOpen.value,
            'aria-controls': `accordion-content-${id}`,
            onClick: toggle
          },
          summaryChildren
        ),
        bodyContent
      ])
    }
  }
})
