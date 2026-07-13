import { defineNuxtComponent } from 'nuxt/app'
import { computed, h, type VNode } from 'vue'
import { useBaseComponent } from '#dd/composables/useBaseComponent'
import styles from '#dd/styles/Skeleton.module.css'
import getPrefixName from '#dd/utils/getPrefixName'

export default defineNuxtComponent({
  name: 'Skeleton',
  inheritAttrs: false,
  props: {
    /**
     * Custom inline size for this placeholder.
     */
    width: {
      type: String,
      default: undefined
    },
    /**
     * Custom block size for this placeholder.
     */
    height: {
      type: String,
      default: undefined
    },
    /**
     * Custom border radius override for this placeholder.
     */
    radius: {
      type: String,
      default: undefined
    },
    /**
     * Makes the skeleton circular.
     */
    circle: {
      type: Boolean,
      default: false
    },
    /**
     * Enables the shimmer animation.
     */
    animated: {
      type: Boolean,
      default: true
    }
  },
  setup(props, { attrs }): () => VNode {
    const { processedAttrs } = useBaseComponent(attrs, {})

    const skeletonStyle = computed(() => {
      const style: Record<string, string> = {}

      if (props.width) {
        style[getPrefixName('skeleton-inline-size', { type: 'css-var-decl' })] = props.width
      }

      if (props.height) {
        style[getPrefixName('skeleton-block-size', { type: 'css-var-decl' })] = props.height
      }

      if (props.radius) {
        style[getPrefixName('skeleton-radius', { type: 'css-var-decl' })] = props.radius
      }

      return style
    })

    return () => h('span', {
      ...processedAttrs.value,
      class: [
        styles.skeleton,
        props.circle && styles.circle,
        !props.animated && styles.static
      ],
      style: skeletonStyle.value,
      'aria-hidden': attrs['aria-hidden'] ?? 'true'
    })
  }
})
