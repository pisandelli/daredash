import { h, resolveComponent, type VNode, type ComponentPublicInstance } from 'vue'
import getPrefixName from '#dd/utils/getPrefixName'
import type { MenuEntry, MenuItem, MenuSeparator } from './types'

interface UseMenuRenderOptions {
  isCollapsed: ReturnType<typeof import('vue').computed<boolean>>
  resolvedActiveKey: ReturnType<typeof import('vue').computed<string | undefined>>
  usesCssAnchor: ReturnType<typeof import('vue').computed<boolean>>
  openFloatKey: ReturnType<typeof import('vue').ref<string | null>>
  expandedKeys: ReturnType<typeof import('vue').ref<Set<string>>>
  floatPositions: ReturnType<typeof import('vue').ref<Map<string, { top: number; left: number }>>>
  anchorRefs: ReturnType<typeof import('vue').ref<Map<string, HTMLElement>>>
  floatPanelRefs: ReturnType<typeof import('vue').ref<Map<string, HTMLElement>>>
  toggleExpand: (key: string) => void
  toggleFloat: (key: string) => void
  emit: (event: 'select', payload: { key: string; item: MenuItem }) => void
}

interface UseMenuRenderReturn {
  renderSeparator: (entry: MenuSeparator, index: number) => VNode
  renderLinkContent: (item: MenuItem) => VNode[]
  renderItems: (entries: MenuEntry[], depth: number) => VNode[]
}

export function useMenuRender(
  styles: Record<string, string>,
  options: UseMenuRenderOptions
): UseMenuRenderReturn {
  const DdBadge = resolveComponent(getPrefixName('Badge', { type: 'component' }))
  const Icon = resolveComponent('Icon')

  const renderSeparator = (entry: MenuSeparator, index: number): VNode => {
    const children: VNode[] = []

    if (entry.label && !options.isCollapsed.value) {
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

  const renderLinkContent = (item: MenuItem): VNode[] => {
    const nodes: VNode[] = []

    if (item.icon) {
      nodes.push(
        h(Icon, {
          name: item.icon,
          class: styles.icon,
          'aria-hidden': 'true'
        })
      )
    }

    if (!options.isCollapsed.value) {
      nodes.push(
        h('span', { class: styles.label }, item.label)
      )
    }

    if (item.badge && !options.isCollapsed.value) {
      nodes.push(
        h(DdBadge, {
          class: styles.badge,
          ...(item.badge.color ? { color: item.badge.color } : {})
        }, () => String(item.badge.label))
      )
    }

    return nodes
  }

  const renderItems = (entries: MenuEntry[], depth: number): VNode[] => {
    return entries.map((entry, index) => {
      if (entry.type === 'separator') {
        return renderSeparator(entry, index)
      }

      const item = entry as MenuItem
      const isActive = options.resolvedActiveKey.value === item.key || item.active === true
      const hasChildren = !!item.children?.length
      const isExpanded = options.expandedKeys.value.has(item.key)

      const isFloat = item.float || (options.isCollapsed.value && hasChildren)
      const anchorName = `--dd-menu-anchor-${item.key}`
      const floatIsOpen = options.openFloatKey.value === item.key

      const chevronNode = (hasChildren && !options.isCollapsed.value)
        ? h(Icon, {
            name: 'heroicons:chevron-right',
            class: styles.chevron,
            'aria-hidden': 'true'
          })
        : null

      let linkElement: VNode

      if (item.action.type === 'link') {
        linkElement = h(resolveComponent('NuxtLink'), {
          class: [
            styles.link,
            isFloat && options.usesCssAnchor.value ? styles.floatAnchor : ''
          ],
          to: item.action.to,
          ...(item.action.target ? { target: item.action.target } : {}),
          'aria-current': isActive ? 'page' : undefined,
          'aria-disabled': item.disabled ? 'true' : undefined,
          title: options.isCollapsed.value ? item.label : undefined,
          ...(isFloat && !options.usesCssAnchor.value
            ? {
                ref: (el: ComponentPublicInstance | Element | null, _refs: Record<string, unknown>) => {
                  if (el && el instanceof HTMLElement) options.anchorRefs.value.set(item.key, el)
                }
              }
            : {}),
          style: isFloat && options.usesCssAnchor.value
            ? { anchorName }
            : undefined,
          onClick: hasChildren && isFloat
            ? (e: Event) => { e.preventDefault(); options.toggleFloat(item.key) }
            : hasChildren
              ? (e: Event) => { e.preventDefault(); options.toggleExpand(item.key) }
              : undefined
        }, { default: () => [...renderLinkContent(item), chevronNode] })
      } else {
        linkElement = h('button', {
          type: 'button',
          class: [
            styles.link,
            isFloat && options.usesCssAnchor.value ? styles.floatAnchor : ''
          ],
          disabled: item.disabled || undefined,
          'aria-expanded': hasChildren ? String(isFloat ? floatIsOpen : isExpanded) : undefined,
          'aria-controls': hasChildren ? `dd-submenu-${item.key}` : undefined,
          'aria-haspopup': hasChildren && isFloat ? 'true' : undefined,
          title: options.isCollapsed.value ? item.label : undefined,
          style: isFloat && options.usesCssAnchor.value
            ? { anchorName }
            : undefined,
          ref: isFloat && !options.usesCssAnchor.value
            ? (el: ComponentPublicInstance | Element | null, _refs: Record<string, unknown>) => {
                if (el && el instanceof HTMLElement) options.anchorRefs.value.set(item.key, el)
              }
            : undefined,
          onClick: item.disabled
            ? undefined
            : () => {
                if (hasChildren) {
                  isFloat ? options.toggleFloat(item.key) : options.toggleExpand(item.key)
                } else if (item.action.type === 'action') {
                  item.action.handler()
                  options.emit('select', { key: item.key, item })
                }
              }
        }, [...renderLinkContent(item), chevronNode])
      }

      let subMenu: VNode | null = null

      if (hasChildren && item.children) {
        if (isFloat) {
          const pos = options.floatPositions.value.get(item.key)
          subMenu = h('ul', {
            id: `dd-submenu-${item.key}`,
            class: styles.floatPanel,
            role: 'menu',
            'aria-label': item.label,
            'data-open': floatIsOpen ? '' : undefined,
            style: [
              options.usesCssAnchor.value
                ? { '--anchor-name': anchorName }
                : pos
                  ? { top: `${pos.top}px`, left: `${pos.left}px` }
                  : { display: 'none' }
            ],
            ref: (el: ComponentPublicInstance | Element | null, _refs: Record<string, unknown>) => {
              if (el && el instanceof HTMLElement) options.floatPanelRefs.value.set(item.key, el)
              else if (!el) options.floatPanelRefs.value.delete(item.key)
            }
          }, renderItems(item.children, depth + 1))
        } else {
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

  return {
    renderSeparator,
    renderLinkContent,
    renderItems
  }
}
