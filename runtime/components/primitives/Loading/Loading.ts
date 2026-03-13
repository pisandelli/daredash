import { defineNuxtComponent } from 'nuxt/app'
import { h, type VNode, resolveComponent } from 'vue'
import { Icon } from '#components'
import { useBaseComponent } from '#dd/composables/useBaseComponent'
import styles from '#dd/styles/Loading.module.css'
import getPrefixName from '#dd/utils/getPrefixName'

export default defineNuxtComponent({
  name: 'Loading',
  inheritAttrs: false,
  props: {
    /**
     * Text label to display alongside or instead of the loading icon.
     */
    label: {
      type: String,
      default: 'Loading...'
    },
    /**
     * The name of the icon to display while loading.
     */
    icon: {
      type: String,
      default: 'svg-spinners:gooey-balls-2'
    }
  },
  setup(props, { slots, attrs }): () => VNode {
    const { processedAttrs } = useBaseComponent(attrs, {})
    const DdCenter = resolveComponent(
      getPrefixName('Center', { type: 'component' })
    )

    return () => {
      const children = [h(Icon, { class: styles.loader, name: props.icon })]

      if (slots.default) {
        children.push(...slots.default())
      } else {
        children.push(h('span', props.label))
      }

      return h(
        DdCenter,
        { ...processedAttrs.value, class: styles.loading, intrinsic: '' },
        () => children
      )
    }
  }
})
