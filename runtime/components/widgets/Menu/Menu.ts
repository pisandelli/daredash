import { defineNuxtComponent } from 'nuxt/app'
import { h, resolveComponent, type PropType } from 'vue'
import { useBaseComponent } from '#dd/composables/useBaseComponent'
import styles from '#dd/styles/Menu.module.css'
import type { MenuEntry } from './types'
import { useMenuState } from './useMenuState'
import { useMenuFloat } from './useMenuFloat'
import { useMenuActive } from './useMenuActive'
import { useMenuRender } from './useMenuRender'

export default defineNuxtComponent({
  name: 'Menu',
  inheritAttrs: false,

  props: {
    /**
     * Array of menu entries (items and separators).
     */
    items: {
      type: Array as PropType<MenuEntry[]>,
      required: true
    },
    /**
     * Menu orientation.
     * @default 'vertical'
     */
    orientation: {
      type: String as PropType<'vertical' | 'horizontal'>,
      default: 'vertical'
    },
    /**
     * Allows the menu to be collapsed (vertical only).
     * @default false
     */
    collapsible: {
      type: Boolean,
      default: false
    },
    /**
     * Controlled collapsed state.
     * Emits `update:collapsed` for v-model binding.
     * @default false
     */
    collapsed: {
      type: Boolean,
      default: false
    },
    /**
     * Renders a built-in toggle button to collapse/expand the sidebar.
     * @default false
     */
    toggleButton: {
      type: Boolean,
      default: false
    },
    /**
     * Overrides automatic active detection.
     * When provided, this key is treated as active regardless of the current route.
     * For action-based items, always use `activeKey` since routes don't apply.
     */
    activeKey: {
      type: String,
      default: undefined
    },
    /**
     * Sets a fixed block-size (height) on the menu with overflow scroll.
     * Applies only in vertical orientation.
     * @example '400px'
     */
    maxHeight: {
      type: String,
      default: undefined
    },
    /**
     * Sets a fixed inline-size (width) on the menu with overflow scroll.
     * Applies only in horizontal orientation.
     * @example '100%'
     */
    maxWidth: {
      type: String,
      default: undefined
    }
  },

  emits: ['update:collapsed', 'select'],

  setup(props, { attrs, emit, expose }) {
    const PROP_KEYS = new Set([
      'items', 'orientation', 'collapsible', 'collapsed',
      'toggleButton', 'activeKey', 'maxHeight', 'maxWidth'
    ])
    const filteredAttrs = Object.fromEntries(
      Object.entries(attrs).filter(([key]) => !PROP_KEYS.has(key))
    )
    const { processedAttrs, classList } = useBaseComponent(filteredAttrs, styles, 'Menu')

    const { isCollapsed, collapse, expand, toggle } = useMenuState(props, emit)
    const float = useMenuFloat(props, isCollapsed)
    const { resolvedActiveKey } = useMenuActive({ activeKey: props.activeKey, items: props.items })

    const render = useMenuRender(styles, {
      isCollapsed,
      resolvedActiveKey,
      usesCssAnchor: float.usesCssAnchor,
      openFloatKey: float.openFloatKey,
      expandedKeys: float.expandedKeys,
      floatPositions: float.floatPositions,
      anchorRefs: float.anchorRefs,
      floatPanelRefs: float.floatPanelRefs,
      toggleExpand: float.toggleExpand,
      toggleFloat: float.toggleFloat,
      scheduleOpenFloat: float.scheduleOpenFloat,
      scheduleCloseFloat: float.scheduleCloseFloat,
      emit
    })

    expose({ collapse, expand, toggle })

    return () => {
      const isHorizontal = props.orientation === 'horizontal'

      const containerStyle: Record<string, string> = {}
      if (props.maxHeight && !isHorizontal) {
        containerStyle['max-block-size'] = props.maxHeight
      }
      if (props.maxWidth && isHorizontal) {
        containerStyle['max-inline-size'] = props.maxWidth
        containerStyle['overflow-x'] = 'auto'
      }

      const toggleBtn = props.toggleButton && !isHorizontal
        ? h('button', {
            type: 'button',
            class: styles.toggle,
            onClick: toggle,
            'aria-label': isCollapsed.value ? 'Expand menu' : 'Collapse menu',
            'aria-expanded': String(!isCollapsed.value)
          }, [
            h(resolveComponent('Icon'), {
              name: isCollapsed.value
                ? 'heroicons:chevron-double-right'
                : 'heroicons:chevron-double-left',
              class: styles.toggleIcon,
              'aria-hidden': 'true'
            })
          ])
        : null

      return h('nav', {
        ...processedAttrs.value,
        class: classList.value,
        role: 'navigation',
        'data-orientation': props.orientation,
        'data-collapsed': isCollapsed.value ? '' : undefined,
        style: Object.keys(containerStyle).length ? containerStyle : undefined
      }, [
        toggleBtn,
        h('ul', {
          class: styles.list,
          role: 'list'
        }, render.renderItems(props.items, 0))
      ])
    }
  }
})
