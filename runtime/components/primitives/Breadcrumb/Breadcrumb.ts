import { defineNuxtComponent } from 'nuxt/app'
import { h, computed, type PropType, type VNode } from 'vue'
import { NuxtLink, Icon } from '#components'
import { useAppConfig } from '#imports'
import { useBaseComponent } from '#dd/composables/useBaseComponent'
import styles from '#dd/styles/Breadcrumb.module.css'
import getPrefixName from '#dd/utils/getPrefixName'
import { sanitizeHref } from '#dd/utils/sanitizeHref'

export interface BreadcrumbItem {
  label: string;
  href?: string;
  to?: string;
  disabled?: boolean;
  icon?: string;
  hoverColor?: string;
}

export interface BreadcrumbConfig {
  /**
   * Optional separator icon name. Falls back to `appConfig.daredash.icons.breadcrumbSeparator`.
   */
  separator?: string;
  routes: BreadcrumbItem[];
}

export default defineNuxtComponent({
  name: 'Breadcrumb',
  inheritAttrs: false,
  props: {
    /**
     * Configuration object for the breadcrumb.
     */
    config: {
      type: Object as PropType<BreadcrumbConfig>,
      required: true
    }
  },
  setup(props, { attrs }): () => VNode {
    const { processedAttrs, classList } = useBaseComponent(attrs, styles, 'Breadcrumb')
    const appConfig = useAppConfig()

    const separatorIconName = computed(() => {
      return props.config.separator
        ?? appConfig.daredash?.icons?.breadcrumbSeparator
        ?? appConfig.daredash?.icons?.menuExpand
        ?? 'heroicons:chevron-right'
    })

    const renderIcon = (iconName?: string) => {
      if (!iconName) return null
      return h(Icon, { name: iconName, class: styles.icon })
    }

    const renderItemDynamicStyle = (item: BreadcrumbItem) => {
      if (!item.hoverColor) return {}
      return {
        [getPrefixName('breadcrumbs-item-hover-color', { type: 'css-var-decl' })]: item.hoverColor
      }
    }

    return () => {
      const routes = props.config.routes || []
      
      const items = routes.map((item, index) => {
        const isCurrent = index === routes.length - 1
        const hasSeparator = !isCurrent

        const itemContent = [
          renderIcon(item.icon),
          h('span', {}, item.label)
        ]

        let elementNode: VNode
        if (isCurrent) {
          elementNode = h(
            'span',
            {
              class: [styles.item, styles.current],
              'aria-current': 'page'
            },
            itemContent
          )
        } else {
          elementNode = h(
            NuxtLink as any,
            {
              to: item.to,
              href: sanitizeHref(item.href),
              class: [styles.item, styles.link],
              style: renderItemDynamicStyle(item),
              ...(item.disabled ? { disabled: true, 'aria-disabled': 'true' } : {})
            },
            () => itemContent
          )
        }

        const nodes = [elementNode]
        
        if (hasSeparator) {
          nodes.push(
            h(
              'span',
              {
                class: styles.separator,
                'aria-hidden': 'true'
              },
              h(Icon, {
                name: separatorIconName.value,
                class: styles.icon
              })
            )
          )
        }

        return h('li', { class: styles.listItem }, nodes)
      })

      return h(
        'nav',
        {
          ...processedAttrs.value,
          class: classList.value,
          'aria-label': 'breadcrumb'
        },
        [
          h('ol', { class: styles.list }, items)
        ]
      )
    }
  }
})
