import { defineNuxtComponent } from 'nuxt/app'
import { h, inject } from 'vue'
import { useBaseComponent } from '#dd/composables/useBaseComponent'
import styles from '#dd/styles/Tabs.module.css'
import { TabsContextKey, type TabsContext } from './Tabs'

export default defineNuxtComponent({
  name: 'DdTabList',
  inheritAttrs: false,
  setup(props, { slots, attrs }) {
    const { processedAttrs, classList } = useBaseComponent(attrs, styles, 'list')
    const context = inject(TabsContextKey) as TabsContext | null

    return () => {
      const tabNodes = slots.default?.() || []
      
      const listAttrs = {
        ...processedAttrs.value,
        class: [classList.value],
        role: 'tablist',
        'aria-orientation': context?.vertical.value ? 'vertical' : 'horizontal'
      }

      const children = []
      
      if (slots.prefix) {
        children.push(h('div', { class: styles['header-prefix'] }, slots.prefix()))
      }
      
      const indicator = h('div', {
        class: styles.indicator,
        'data-type': context?.indicatorType.value,
        'aria-hidden': 'true',
        style: {
          'position-anchor': `--dd-tab-${String(context?.activeTab.value).replace(/[^a-zA-Z0-9-]/g, '-')}`
        }
      })

      children.push(
        h('div', listAttrs, [
          ...tabNodes,
          indicator
        ])
      )

      if (slots.suffix) {
        children.push(h('div', { class: styles['header-suffix'] }, slots.suffix()))
      }

      if (slots.prefix || slots.suffix) {
        return h('div', { class: styles.header }, children)
      }

      return children[0]
    }
  }
})
