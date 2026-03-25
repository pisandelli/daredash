import { defineNuxtComponent } from 'nuxt/app'
import { h, inject, computed } from 'vue'
import { useBaseComponent } from '#dd/composables/useBaseComponent'
import styles from '#dd/styles/Tabs.module.css'
import { TabsContextKey, type TabsContext } from './Tabs'

export default defineNuxtComponent({
  name: 'DdTabPanel',
  inheritAttrs: false,
  props: {
    value: {
      type: [String, Number],
      required: true
    }
  },
  setup(props, { slots, attrs }) {
    const { processedAttrs, classList } = useBaseComponent(attrs, styles, 'panel')
    const context = inject(TabsContextKey) as TabsContext | null

    const isActive = computed(() => context?.activeTab.value === props.value)

    return () => {
      if (!isActive.value) return null

      return h(
        'div',
        {
          ...processedAttrs.value,
          class: [classList.value],
          role: 'tabpanel',
          id: `panel-${props.value}`,
          'aria-labelledby': `tab-${props.value}`,
          tabindex: 0
        },
        slots.default?.()
      )
    }
  }
})
