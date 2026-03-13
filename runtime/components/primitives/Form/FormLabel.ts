import { h, type VNode } from 'vue'
import { defineNuxtComponent } from '#imports'
import { useBaseComponent } from '#dd/composables/useBaseComponent'
import styles from '#dd/styles/FormLabel.module.css'

export default defineNuxtComponent({
  name: 'FormLabel',
  inheritAttrs: false,
  setup(_, { attrs, slots }): () => VNode {
    // Pass the full styles object to map all variant mappings securely
    const { processedAttrs, classList } = useBaseComponent(attrs, styles)

    return () => {
      return h(
        'label',
        {
          ...processedAttrs.value,
          class: classList.value
        },
        slots.default?.()
      )
    }
  }
})
