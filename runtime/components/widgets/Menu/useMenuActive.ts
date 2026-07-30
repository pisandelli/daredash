import { computed, type Ref } from 'vue'
import { useRoute } from 'nuxt/app'
import { isSeparator, type MenuEntry } from './types'

interface UseMenuActiveOptions {
  activeKey: Ref<string | undefined>
  items: Ref<MenuEntry[]>
}

export function useMenuActive(props: UseMenuActiveOptions) {
  const route = useRoute()

  const resolvedActiveKey = computed(() => {
    if (props.activeKey.value !== undefined) return props.activeKey.value

    const currentPath = route?.path
    if (!currentPath) return undefined

    const findActive = (entries: MenuEntry[]): string | undefined => {
      for (const entry of entries) {
        if (isSeparator(entry)) continue
        if (entry.action.type === 'link') {
          const to = entry.action.to
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

    return findActive(props.items.value)
  })

  const resolvedActiveParentKeys = computed(() => {
    const activeKey = resolvedActiveKey.value
    if (!activeKey) return []

    const findParents = (entries: MenuEntry[], parents: string[] = []): string[] | undefined => {
      for (const entry of entries) {
        if (isSeparator(entry)) continue

        if (entry.key === activeKey) {
          return entry.children?.length ? [...parents, entry.key] : parents
        }

        if (entry.children?.length) {
          const found = findParents(entry.children, [...parents, entry.key])
          if (found) return found
        }
      }

      return undefined
    }

    return findParents(props.items.value) ?? []
  })

  return {
    resolvedActiveKey,
    resolvedActiveParentKeys
  }
}
