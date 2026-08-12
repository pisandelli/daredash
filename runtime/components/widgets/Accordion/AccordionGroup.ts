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

    const registerItem = (id: string, defaultOpen: boolean) => {
      if (!defaultOpen) return
      if (props.multiple) {
        const nextOpenItems = new Set(openItems.value)
        nextOpenItems.add(id)
        openItems.value = nextOpenItems
        return
      }
      if (openItems.value.size === 0) {
        openItems.value = new Set([id])
      }
    }
    
    const toggleItem = (id: string, isOpen: boolean) => {
      const nextOpenItems = new Set(openItems.value)

      if (props.multiple) {
        if (isOpen) nextOpenItems.add(id)
        else nextOpenItems.delete(id)
        openItems.value = nextOpenItems
      } else {
        if (isOpen) {
          openItems.value = new Set([id])
        } else {
          nextOpenItems.delete(id)
          openItems.value = nextOpenItems
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
      registerItem,
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
