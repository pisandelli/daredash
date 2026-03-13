import { defineNuxtComponent } from 'nuxt/app'
import { h, type VNode } from 'vue'
import { resolveComponent } from 'vue' // Use resolveComponent to find Global components
import { useBaseComponent } from '#dd/composables/useBaseComponent'
import styles from '#dd/styles/Card.module.css'
import getPrefixName from '#dd/utils/getPrefixName'

export default defineNuxtComponent({
  name: 'Card',
  inheritAttrs: false,
  setup(props, { slots, attrs }): () => VNode {
    const { processedAttrs, classList } = useBaseComponent(attrs, styles)
    const Box = resolveComponent(getPrefixName('Box', { type: 'component' }))

    const Stack = resolveComponent(
      getPrefixName('Stack', { type: 'component' })
    )

    return () => {
      const children: VNode[] = []

      // Header
      if (slots.header) {
        children.push(h('header', { class: styles.header }, slots.header()))
      }

      // Body (Default slot)
      if (slots.default) {
        children.push(h('section', { class: styles.body }, slots.default()))
      }

      // Footer
      if (slots.footer) {
        children.push(h('footer', { class: styles.footer }, slots.footer()))
      }

      // Wrap children in a Stack.
      // We use compact=true to let child sections manage their own padding/borders.
      const content = h(Stack, { compact: true }, () => children)

      return h(
        Box,
        {
          ...processedAttrs.value,
          class: styles.card,
          nogap: true
        },
        () => content
      )
    }
  }
})
