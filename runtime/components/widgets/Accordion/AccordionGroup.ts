import { defineNuxtComponent } from 'nuxt/app'
import { h, provide, type VNode } from 'vue'
import { useBaseComponent } from '#dd/composables/useBaseComponent'
import getPrefixName from '#dd/utils/getPrefixName'
import { resolveComponent } from 'vue'

export const AccordionGroupInjectionKey = Symbol('AccordionGroup')

export default defineNuxtComponent({
  name: 'AccordionGroup',
  inheritAttrs: false,
  props: {
    /**
     * If false, only one accordion can be open at a time (they share the same name attribute).
     * If true, multiple accordions can be open simultaneously.
     */
    multiple: {
      type: Boolean,
      default: false
    },
    /**
     * An optional accent color to pass down to all children accordions.
     */
    accentColor: {
      type: String,
      default: undefined
    }
  },
  setup(props, { slots, attrs }) {
    const { processedAttrs, classList } = useBaseComponent(
      attrs,
      {},
      'AccordionGroup'
    )
    const DdStack = resolveComponent(
      getPrefixName('Stack', { type: 'component' })
    )

    // Provide context to descendant Accordion items
    const groupName = props.multiple
      ? undefined
      : `accordion-group-${Math.random().toString(36).substring(2, 9)}`

    let injectedAccentColor = props.accentColor

    if (!injectedAccentColor) {
      const semanticVariants = ['primary', 'success', 'warning', 'danger', 'info']
      for (const variant of semanticVariants) {
        if (`data-${variant}` in processedAttrs.value) {
          injectedAccentColor = variant
          break
        }
      }
    }

    provide(AccordionGroupInjectionKey, {
      name: groupName,
      accentColor: injectedAccentColor
    })

    return () => {
      return h(
        DdStack,
        {
          ...processedAttrs.value,
          class: classList.value,
          nogap: true // Removing gaps since accordions are usually stacked flush
        },
        () => slots.default?.()
      )
    }
  }
})
