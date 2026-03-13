import { h, defineComponent } from 'vue'
import { useBaseComponent } from '#dd/composables/useBaseComponent'
import styles from '#dd/styles/Avatar.module.css'

export default defineComponent({
  name: 'AvatarGroup',
  inheritAttrs: false,
  props: {
    /**
     * Maximum number of avatars to display before truncating.
     */
    limit: {
      type: Number,
      default: 5
    }
  },
  setup(props, { slots, attrs }) {
    const { processedAttrs } = useBaseComponent(attrs, styles)

    return () => {
      // Future implementation can filter slots/children to handle 'limit'.
      return h(
        'div',
        {
          ...processedAttrs.value,
          class: styles.avatarGroup,
          role: 'group'
        },
        slots.default?.()
      )
    }
  }
})
