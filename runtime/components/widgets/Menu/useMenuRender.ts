import { h, resolveComponent, type VNode, type ComponentPublicInstance, type ComputedRef, type Ref } from 'vue'
import { NuxtLink, Icon } from '#components'
import getPrefixName from '#dd/utils/getPrefixName'
import type { MenuEntry, MenuItem, MenuSeparator } from './types'
import type { useMenuFloat } from './useMenuFloat'

interface UseMenuRenderOptions {
  isCollapsed: ComputedRef<boolean>
  resolvedActiveKey: ComputedRef<string | undefined>
  usesCssAnchor: ComputedRef<boolean>
  openFloatKey: ReturnType<typeof useMenuFloat>['openFloatKey']
  expandedKeys: ReturnType<typeof useMenuFloat>['expandedKeys']
  floatPositions: ReturnType<typeof useMenuFloat>['floatPositions']
  anchorRefs: ReturnType<typeof useMenuFloat>['anchorRefs']
  floatPanelRefs: ReturnType<typeof useMenuFloat>['floatPanelRefs']
  toggleExpand: ReturnType<typeof useMenuFloat>['toggleExpand']
  toggleFloat: ReturnType<typeof useMenuFloat>['toggleFloat']
  scheduleOpenFloat: ReturnType<typeof useMenuFloat>['scheduleOpenFloat']
  scheduleCloseFloat: ReturnType<typeof useMenuFloat>['scheduleCloseFloat']
  emit: (event: 'select', payload: { key: string; item: MenuItem }) => void
}

interface UseMenuRenderReturn {
  renderSeparator: (entry: MenuSeparator, index: number) => VNode
  renderLinkContent: (item: MenuItem, hideLabel: boolean) => VNode[]
  renderItems: (entries: MenuEntry[], depth: number) => VNode[]
}

export function useMenuRender(
  styles: Record<string, string>,
  options: UseMenuRenderOptions
): UseMenuRenderReturn {
  const DdBadge = resolveComponent(getPrefixName('Badge', { type: 'component' }))

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

  const renderLinkContent = (item: MenuItem, hideLabel: boolean): VNode[] => {
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

    if (!hideLabel) {
      nodes.push(
        h('span', { class: styles.label }, item.label)
      )
    }

    if (item.badge && !hideLabel) {
      nodes.push(
        h(DdBadge, {
          class: styles.badge,
          ...(item.badge!.color ? { color: item.badge!.color } : {})
        }, () => String(item.badge!.label))
      )
    }

    return nodes
  }

  const renderItems = (entries: MenuEntry[], depth: number): VNode[] => {
    return entries.map((entry, index) => {
      if ('type' in entry && entry.type === 'separator') {
        return renderSeparator(entry as MenuSeparator, index)
      }

      const item = entry as MenuItem
      const isActive = options.resolvedActiveKey.value === item.key || item.active === true
      const hasChildren = !!item.children?.length
      const isExpanded = options.expandedKeys?.value?.has(item.key) ?? false

      const isFloat = item.float || (options.isCollapsed.value && hasChildren)
      const anchorName = `--dd-menu-anchor-${item.key}`
      const floatIsOpen = options.openFloatKey.value === item.key

      const hideLabel = options.isCollapsed.value && depth === 0

      const chevronNode = (hasChildren && !hideLabel)
        ? h(Icon, {
            name: 'heroicons:chevron-right',
            class: styles.chevron,
            'aria-hidden': 'true'
          })
        : null

      let linkElement: VNode

      if (item.action.type === 'link') {
        linkElement = h(NuxtLink, {
          class: [
            styles.link,
            isFloat && options.usesCssAnchor.value ? styles.floatAnchor : ''
          ],
          to: item.action.to,
          ...(item.action.target ? { target: item.action.target } : {}),
          'aria-current': isActive ? 'page' : undefined,
          'aria-disabled': item.disabled ? 'true' : undefined,
          title: hideLabel ? item.label : undefined,
          ...(isFloat && !options.usesCssAnchor.value
            ? {
                ref: (el: ComponentPublicInstance | Element | null, _refs: Record<string, unknown>) => {
                  if (el && el instanceof HTMLElement) options.anchorRefs?.value?.set(item.key, el)
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
        }, { default: () => [...renderLinkContent(item, hideLabel), chevronNode] })
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
          title: hideLabel ? item.label : undefined,
          style: isFloat && options.usesCssAnchor.value
            ? { anchorName }
            : undefined,
          ref: isFloat && !options.usesCssAnchor.value
            ? (el: ComponentPublicInstance | Element | null, _refs: Record<string, unknown>) => {
                if (el && el instanceof HTMLElement) options.anchorRefs?.value?.set(item.key, el)
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
        }, [...renderLinkContent(item, hideLabel), chevronNode])
      }

      let subMenu: VNode | null = null

      if (hasChildren && item.children) {
        if (isFloat) {
          const pos = options.floatPositions?.value?.get(item.key)
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
              if (el && el instanceof HTMLElement) options.floatPanelRefs?.value?.set(item.key, el)
              else if (!el) options.floatPanelRefs?.value?.delete(item.key)
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
        'data-float': isFloat ? '' : undefined,
        ...(isFloat && hasChildren
          ? {
              onMouseenter: () => options.scheduleOpenFloat(item.key),
              onMouseleave: () => options.scheduleCloseFloat()
            }
          : {})
      }, [linkElement, subMenu])
    })
  }

  return {
    renderSeparator,
    renderLinkContent,
    renderItems
  }
}
