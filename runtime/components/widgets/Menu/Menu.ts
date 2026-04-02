import { defineNuxtComponent, useRoute } from 'nuxt/app'
import {
  h,
  ref,
  computed,
  onMounted,
  onUnmounted,
  nextTick,
  type PropType,
  type VNode,
  type ComponentPublicInstance,
  resolveComponent
} from 'vue'
import { useBaseComponent } from '#dd/composables/useBaseComponent'
import getPrefixName from '#dd/utils/getPrefixName'
import styles from '#dd/styles/Menu.module.css'
import { NuxtLink } from '#components'

// =============================================================================
// Types & Interfaces
// =============================================================================

export type MenuItemActionType =
  | { type: 'link'; to: string; target?: '_blank' | '_self' | '_parent' | '_top' }
  | { type: 'action'; handler: () => void }
  | { type: 'none' }

export interface MenuBadge {
  /** Text or numeric label for the badge */
  label: string | number
  /** Optional color override (any valid CSS color or token) */
  color?: string
}

export interface MenuSeparator {
  type: 'separator'
  /** Optional label for the separator group */
  label?: string
  /** Optional icon displayed before the label */
  icon?: string
}

export interface MenuItem {
  /** Unique identifier — used for active state tracking */
  key: string
  /** Display text */
  label: string
  /** @nuxt/icon format icon name (e.g., 'heroicons:home') */
  icon?: string
  /** Optional badge rendered beside the label */
  badge?: MenuBadge
  /** Disables the item — prevents interaction */
  disabled?: boolean
  /**
   * Forces the item active state.
   * For `link` items, active state is auto-detected via `useRoute()`.
   * For `action` items, use this prop to control active state manually.
   */
  active?: boolean
  /**
   * When true, children render in a floating panel instead of an accordion.
   * This is also set automatically when the menu is collapsed.
   */
  float?: boolean
  /** Nested items — supports infinite recursion */
  children?: MenuEntry[]
  /** Defines what happens when the item is clicked */
  action: MenuItemActionType
}

export type MenuEntry = MenuItem | MenuSeparator

// Type guard
function isSeparator(entry: MenuEntry): entry is MenuSeparator {
  return (entry as MenuSeparator).type === 'separator'
}

// =============================================================================
// Component
// =============================================================================

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

  emits: [
    /**
     * Fired when the collapsed state changes via internal toggle.
     */
    'update:collapsed',
    /**
     * Fired when an action-based item is selected.
     * Payload: `{ key: string, item: MenuItem }`
     */
    'select'
  ],

  setup(props, { attrs, emit, expose }) {
    // Filter out declared props from attrs to prevent them from being applied as HTML attributes.
    // defineNuxtComponent may not exclude declared props from `attrs` in all environments.
    const PROP_KEYS = new Set([
      'items', 'orientation', 'collapsible', 'collapsed',
      'toggleButton', 'activeKey', 'maxHeight', 'maxWidth'
    ])
    const filteredAttrs = Object.fromEntries(
      Object.entries(attrs).filter(([key]) => !PROP_KEYS.has(key))
    )
    const { processedAttrs, classList } = useBaseComponent(filteredAttrs, styles, 'Menu')
    const route = useRoute()

    // -------------------------------------------------------------------------
    // Internal collapsed state (mirrors the prop, also driven internally)
    // -------------------------------------------------------------------------
    const internalCollapsed = ref(props.collapsed)

    // Watch route changes to close all float panels
    // (we use a separate watcher approach to keep reactivity clean)

    const collapse = () => {
      internalCollapsed.value = true
      emit('update:collapsed', true)
    }

    const expand = () => {
      internalCollapsed.value = false
      emit('update:collapsed', false)
    }

    const toggle = () => {
      if (internalCollapsed.value) {
        expand()
      } else {
        collapse()
      }
    }

    // Keep in sync with controlled prop
    const isCollapsed = computed(
      () => props.collapsible && (props.collapsed || internalCollapsed.value)
    )

    // -------------------------------------------------------------------------
    // Expanded sub-items map (accordion state)
    // -------------------------------------------------------------------------
    const expandedKeys = ref<Set<string>>(new Set())

    const toggleExpand = (key: string) => {
      if (expandedKeys.value.has(key)) {
        expandedKeys.value.delete(key)
      } else {
        expandedKeys.value.add(key)
      }
      // Trigger reactivity (Set mutation isn't reactive on its own)
      expandedKeys.value = new Set(expandedKeys.value)
    }

    // -------------------------------------------------------------------------
    // Float panel state
    // -------------------------------------------------------------------------
    const openFloatKey = ref<string | null>(null)
    const floatPositions = ref<Map<string, { top: number; left: number }>>(new Map())
    const anchorRefs = ref<Map<string, HTMLElement>>(new Map())
    const floatPanelRefs = ref<Map<string, HTMLElement>>(new Map())

    const usesCssAnchor = computed(() => {
      if (typeof CSS === 'undefined') return false
      return CSS.supports('anchor-name', '--a')
    })

    const updateFloatPosition = (key: string) => {
      if (usesCssAnchor.value) return // CSS handles it natively

      const anchor = anchorRefs.value.get(key)
      const panel = floatPanelRefs.value.get(key)
      if (!anchor || !panel) return

      const rect = anchor.getBoundingClientRect()
      const panelRect = panel.getBoundingClientRect()

      let top = rect.top
      let left = rect.right + 8 // Default: inline-end + offset

      // Horizontal: place below
      if (props.orientation === 'horizontal') {
        top = rect.bottom + 4
        left = rect.left
      }

      // Boundary check: flip if panel bleeds out of viewport
      if (left + panelRect.width > window.innerWidth) {
        left = rect.left - panelRect.width - 8
      }
      if (top + panelRect.height > window.innerHeight) {
        top = Math.max(8, rect.bottom - panelRect.height)
      }

      floatPositions.value.set(key, { top, left })
      floatPositions.value = new Map(floatPositions.value)
    }

    const openFloat = async (key: string) => {
      openFloatKey.value = key
      await nextTick()
      updateFloatPosition(key)
    }

    const closeFloat = () => {
      openFloatKey.value = null
    }

    const toggleFloat = (key: string) => {
      if (openFloatKey.value === key) {
        closeFloat()
      } else {
        openFloat(key)
      }
    }

    // Close float on outside click
    const handleOutsideClick = (e: MouseEvent) => {
      if (!openFloatKey.value) return
      const panel = floatPanelRefs.value.get(openFloatKey.value)
      const anchor = anchorRefs.value.get(openFloatKey.value)
      if (
        panel &&
        !panel.contains(e.target as Node) &&
        anchor &&
        !anchor.contains(e.target as Node)
      ) {
        closeFloat()
      }
    }

    // Close float on Escape
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && openFloatKey.value) {
        closeFloat()
      }
    }

    onMounted(() => {
      document.addEventListener('click', handleOutsideClick, { passive: true })
      document.addEventListener('keydown', handleKeydown)

      // Debug warning: horizontal + collapsible
      if (
        props.orientation === 'horizontal' &&
        props.collapsible &&
        import.meta.dev
      ) {
        console.warn(
          '[DdMenu] `collapsible` has no effect in horizontal orientation.'
        )
      }
    })

    onUnmounted(() => {
      document.removeEventListener('click', handleOutsideClick)
      document.removeEventListener('keydown', handleKeydown)
    })

    // -------------------------------------------------------------------------
    // Active key resolution
    // -------------------------------------------------------------------------
    const resolvedActiveKey = computed(() => {
      if (props.activeKey !== undefined) return props.activeKey

      // Auto-detect via route for link-type items
      const currentPath = route?.path
      if (!currentPath) return undefined

      const findActive = (entries: MenuEntry[]): string | undefined => {
        for (const entry of entries) {
          if (isSeparator(entry)) continue
          if (entry.action.type === 'link') {
            const to = entry.action.to
            // Exact match or starts-with for nested routes
            if (to === currentPath || (to !== '/' && currentPath.startsWith(to))) {
              return entry.key
            }
          }
          if (entry.children?.length) {
            const found = findActive(entry.children)
            if (found) return found
          }
        }
        return undefined
      }

      return findActive(props.items)
    })

    // -------------------------------------------------------------------------
    // Expose imperative API
    // -------------------------------------------------------------------------
    expose({ collapse, expand, toggle })

    // -------------------------------------------------------------------------
    // Render helpers
    // -------------------------------------------------------------------------
    const DdBadge = resolveComponent(getPrefixName('Badge', { type: 'component' }))

    /**
     * Renders a separator entry.
     */
    const renderSeparator = (
      entry: MenuSeparator,
      index: number
    ): VNode => {
      const children: VNode[] = []

      if (entry.label && !isCollapsed.value) {
        children.push(
          h('span', { class: styles.separatorLabel }, entry.label)
        )
      }

      children.push(
        h('span', { class: styles.separatorLine })
      )

      return h('li', {
        key: `sep-${index}`,
        class: styles.separator,
        role: 'separator',
        'aria-label': entry.label
      }, children)
    }

    /**
     * Renders the icon + label + badge content inside a link/button element.
     */
    const renderLinkContent = (item: MenuItem): VNode[] => {
      const icon = resolveComponent('Icon')
      const nodes: VNode[] = []

      // Icon
      if (item.icon) {
        nodes.push(
          h(icon, {
            name: item.icon,
            class: styles.icon,
            'aria-hidden': 'true'
          })
        )
      }

      // Label (render only if not collapsed)
      if (!isCollapsed.value) {
        nodes.push(
          h('span', { class: styles.label }, item.label)
        )
      }

      // Badge (render only if not collapsed)
      if (item.badge && !isCollapsed.value) {
        nodes.push(
          h(DdBadge, {
            class: styles.badge,
            ...(item.badge.color ? { color: item.badge.color } : {})
          }, () => String(item.badge!.label))
        )
      }

      return nodes
    }

    /**
     * Main recursive render function.
     * @param entries - Array of MenuEntry to render
     * @param depth - Nesting depth (0 = root)
     */
    const renderItems = (entries: MenuEntry[], depth: number = 0): VNode[] => {
      return entries.map((entry, index) => {
        if (isSeparator(entry)) {
          return renderSeparator(entry, index)
        }

        const item = entry as MenuItem
        const isActive = resolvedActiveKey.value === item.key || item.active === true
        const hasChildren = !!item.children?.length
        const isExpanded = expandedKeys.value.has(item.key)

        // Float mode: explicit float prop OR auto-float when collapsed
        const isFloat = item.float || (isCollapsed.value && hasChildren)

        // Unique anchor name for CSS Anchor Positioning
        const anchorName = `--dd-menu-anchor-${item.key}`
        const floatIsOpen = openFloatKey.value === item.key

        // Chevron icon
        const ChevronIcon = resolveComponent('Icon')
        const chevronNode = (hasChildren && !isCollapsed.value)
          ? h(ChevronIcon, {
              name: 'heroicons:chevron-right',
              class: styles.chevron,
              'aria-hidden': 'true'
            })
          : null

        // Build the interactive element (anchor or button)
        let linkElement: VNode

        if (item.action.type === 'link') {
          // Internal / External link
          linkElement = h(NuxtLink, {
            class: [
              styles.link,
              isFloat && usesCssAnchor.value ? styles.floatAnchor : ''
            ],
            to: item.action.to,
            ...(item.action.target ? { target: item.action.target } : {}),
            'aria-current': isActive ? 'page' : undefined,
            'aria-disabled': item.disabled ? 'true' : undefined,
            // For collapsed mode: show label as native tooltip
            title: isCollapsed.value ? item.label : undefined,
            // CSS Anchor Positioning anchor
            ...(isFloat && !usesCssAnchor.value
              ? {
                  ref: (el: ComponentPublicInstance | Element | null, _refs: Record<string, unknown>) => {
                    if (el && el instanceof HTMLElement) anchorRefs.value.set(item.key, el)
                  }
                }
              : {}),
            style: isFloat && usesCssAnchor.value
              ? { anchorName }
              : undefined,
            onClick: hasChildren && isFloat
              ? (e: Event) => { e.preventDefault(); toggleFloat(item.key) }
              : hasChildren
                ? (e: Event) => { e.preventDefault(); toggleExpand(item.key) }
                : undefined
          }, { default: () => [...renderLinkContent(item), chevronNode] })
        } else {
          // Button (action or parent-only)
          linkElement = h('button', {
            type: 'button',
            class: [
              styles.link,
              isFloat && usesCssAnchor.value ? styles.floatAnchor : ''
            ],
            disabled: item.disabled || undefined,
            'aria-expanded': hasChildren ? String(isFloat ? floatIsOpen : isExpanded) : undefined,
            'aria-controls': hasChildren ? `dd-submenu-${item.key}` : undefined,
            'aria-haspopup': hasChildren && isFloat ? 'true' : undefined,
            title: isCollapsed.value ? item.label : undefined,
            style: isFloat && usesCssAnchor.value
              ? { anchorName }
              : undefined,
            ref: isFloat && !usesCssAnchor.value
              ? (el: ComponentPublicInstance | Element | null, _refs: Record<string, unknown>) => {
                  if (el && el instanceof HTMLElement) anchorRefs.value.set(item.key, el)
                }
              : undefined,
            onClick: item.disabled
              ? undefined
              : () => {
                  if (hasChildren) {
                    isFloat ? toggleFloat(item.key) : toggleExpand(item.key)
                  } else if (item.action.type === 'action') {
                    item.action.handler()
                    emit('select', { key: item.key, item })
                  }
                }
          }, [...renderLinkContent(item), chevronNode])
        }

        // Sub-menu rendering
        let subMenu: VNode | null = null

        if (hasChildren && item.children) {
          if (isFloat) {
            // Floating panel
            const pos = floatPositions.value.get(item.key)
            subMenu = h('ul', {
              id: `dd-submenu-${item.key}`,
              class: styles.floatPanel,
              role: 'menu',
              'aria-label': item.label,
              'data-open': floatIsOpen ? '' : undefined,
              style: [
                usesCssAnchor.value
                  ? { '--anchor-name': anchorName }
                  : pos
                    ? { top: `${pos.top}px`, left: `${pos.left}px` }
                    : { display: 'none' }
              ],
              ref: (el: ComponentPublicInstance | Element | null, _refs: Record<string, unknown>) => {
                if (el && el instanceof HTMLElement) floatPanelRefs.value.set(item.key, el)
                else if (!el) floatPanelRefs.value.delete(item.key)
              }
            }, renderItems(item.children, depth + 1))
          } else {
            // Accordion (grid trick)
            subMenu = h('div', {
              class: styles.submenuWrapper
            }, [
              h('div', { class: styles.submenuInner }, [
                h('ul', {
                  id: `dd-submenu-${item.key}`,
                  class: styles.submenu,
                  role: 'group',
                  'aria-label': item.label
                }, renderItems(item.children, depth + 1))
              ])
            ])
          }
        }

        return h('li', {
          key: item.key,
          class: styles.item,
          role: 'none',
          'data-active': isActive ? '' : undefined,
          'data-disabled': item.disabled ? '' : undefined,
          'data-expanded': !isFloat && isExpanded ? '' : undefined,
          'data-has-children': hasChildren ? '' : undefined,
          'data-float': isFloat ? '' : undefined
        }, [linkElement, subMenu])
      })
    }

    // -------------------------------------------------------------------------
    // Root render function
    // -------------------------------------------------------------------------
    return () => {
      const isHorizontal = props.orientation === 'horizontal'

      // Container style (max-height / max-width overrides)
      const containerStyle: Record<string, string> = {}
      if (props.maxHeight && !isHorizontal) {
        containerStyle['max-block-size'] = props.maxHeight
      }
      if (props.maxWidth && isHorizontal) {
        containerStyle['max-inline-size'] = props.maxWidth
        containerStyle['overflow-x'] = 'auto'
      }

      // Internal toggle button
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
        }, renderItems(props.items, 0))
      ])
    }
  }
})
