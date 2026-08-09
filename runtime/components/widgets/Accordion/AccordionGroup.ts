import { defineNuxtComponent } from 'nuxt/app'
import { h, provide, type VNode, ref } from 'vue'
import { useBaseComponent } from '#dd/composables/useBaseComponent'
import getPrefixName from '#dd/utils/getPrefixName'
import { resolveComponent } from 'vue'

import styles from '#dd/styles/AccordionGroup.module.css'

export const AccordionGroupInjectionKey = Symbol('AccordionGroup')

export default defineNuxtComponent({
  name: 'AccordionGroup',
  inheritAttrs: false,
  props: {
    /**
     * If false, only one accordion can be open at a time.
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
      styles,
      'AccordionGroup'
    )
    const DdStack = resolveComponent(
      getPrefixName('Stack', { type: 'component' })
    )

    const openItems = ref(new Set<string>())
    
    const toggleItem = (id: string, isOpen: boolean) => {
      if (props.multiple) {
        if (isOpen) openItems.value.add(id)
        else openItems.value.delete(id)
      } else {
        if (isOpen) {
          openItems.value.clear()
          openItems.value.add(id)
        } else {
          openItems.value.delete(id)
        }
      }
    }

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
      openItems,
      toggleItem,
      accentColor: injectedAccentColor,
      isControlled: true
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
