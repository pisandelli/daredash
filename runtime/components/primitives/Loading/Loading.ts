import { defineNuxtComponent } from 'nuxt/app'
import { h, computed, type VNode, resolveComponent } from 'vue'
import { Icon } from '#components'
import { useAppConfig } from '#imports'
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
      default: undefined
    }
  },
  setup(props, { slots, attrs }): () => VNode {
    const { processedAttrs } = useBaseComponent(attrs, {})
    const appConfig = useAppConfig()
    const DdCenter = resolveComponent(
      getPrefixName('Center', { type: 'component' })
    )
    const iconName = computed(
      () => props.icon || appConfig.daredash?.icons?.loading || 'svg-spinners:ring-resize'
    )

    return () => {
      const children = [h(Icon, { class: styles.loader, name: iconName.value })]

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
