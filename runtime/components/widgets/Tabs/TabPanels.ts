import { defineNuxtComponent } from 'nuxt/app'
import { h, inject } from 'vue'
import { useBaseComponent } from '#dd/composables/useBaseComponent'
import styles from '#dd/styles/Tabs.module.css'
import { TabsContextKey, type TabsContext } from './Tabs'

export default defineNuxtComponent({
  name: 'DdTabPanels',
  inheritAttrs: false,
  setup(props, { slots, attrs }) {
    const { processedAttrs, classList } = useBaseComponent(attrs, styles, 'panels')

    return () => {
      return h(
        'div',
        {
          ...processedAttrs.value,
          class: [classList.value]
        },
        slots.default?.()
      )
    }
  }
})
