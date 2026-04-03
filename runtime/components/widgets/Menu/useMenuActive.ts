import { computed } from 'vue'
import { useRoute } from 'nuxt/app'
import type { MenuEntry } from './types'

interface UseMenuActiveOptions {
  activeKey: string | undefined
  items: MenuEntry[]
}

export function useMenuActive(props: UseMenuActiveOptions) {
  const route = useRoute()

  const resolvedActiveKey = computed(() => {
    if (props.activeKey !== undefined) return props.activeKey

    const currentPath = route?.path
    if (!currentPath) return undefined

    const findActive = (entries: MenuEntry[]): string | undefined => {
      for (const entry of entries) {
        if (entry.type === 'separator') continue
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

    return findActive(props.items)
  })

  return {
    resolvedActiveKey
  }
}
