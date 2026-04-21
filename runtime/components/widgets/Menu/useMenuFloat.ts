import { ref, computed, type ComputedRef, onMounted, onUnmounted, nextTick } from 'vue'

interface UseMenuFloatOptions {
  orientation: 'vertical' | 'horizontal'
}

interface UseMenuFloatReturn {
  expandedKeys: ReturnType<typeof ref<Set<string>>>
  openFloatKey: ReturnType<typeof ref<string | null>>
  floatPositions: ReturnType<typeof ref<Map<string, { top: number; left: number }>>>
  anchorRefs: ReturnType<typeof ref<Map<string, HTMLElement>>>
  floatPanelRefs: ReturnType<typeof ref<Map<string, HTMLElement>>>
  usesCssAnchor: ComputedRef<boolean>
  toggleExpand: (key: string) => void
  openFloat: (key: string) => Promise<void>
  closeFloat: () => void
  scheduleOpenFloat: (key: string) => void
  scheduleCloseFloat: () => void
  toggleFloat: (key: string) => void
}

export function useMenuFloat(
  props: { orientation: 'vertical' | 'horizontal' },
  isCollapsed: ComputedRef<boolean>
): UseMenuFloatReturn {
  const expandedKeys = ref<Set<string>>(new Set())
  const openFloatKey = ref<string | null>(null)
  const floatPositions = ref<Map<string, { top: number; left: number }>>(new Map())
  const anchorRefs = ref<Map<string, HTMLElement>>(new Map())
  const floatPanelRefs = ref<Map<string, HTMLElement>>(new Map())
  let floatTimeout: ReturnType<typeof setTimeout> | null = null

  const usesCssAnchor = computed(() => {
    if (typeof CSS === 'undefined') return false
    return CSS.supports('anchor-name', '--a')
  })

  const updateFloatPosition = (key: string) => {
    if (usesCssAnchor.value) return

    const anchor = anchorRefs.value.get(key)
    const panel = floatPanelRefs.value.get(key)
    if (!anchor || !panel) return

    const rect = anchor.getBoundingClientRect()
    const panelRect = panel.getBoundingClientRect()

    let top = rect.top
    let left = rect.right + 8

    if (props.orientation === 'horizontal') {
      top = rect.bottom + 4
      left = rect.left
    }

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
    if (floatTimeout) clearTimeout(floatTimeout)
    openFloatKey.value = key
    await nextTick()
    updateFloatPosition(key)
  }

  const closeFloat = () => {
    if (floatTimeout) clearTimeout(floatTimeout)
    openFloatKey.value = null
  }

  const scheduleOpenFloat = (key: string) => {
    if (floatTimeout) clearTimeout(floatTimeout)
    floatTimeout = setTimeout(() => {
      openFloat(key)
    }, 80)
  }

  const scheduleCloseFloat = () => {
    if (floatTimeout) clearTimeout(floatTimeout)
    floatTimeout = setTimeout(() => {
      closeFloat()
    }, 150)
  }

  const toggleFloat = (key: string) => {
    if (openFloatKey.value === key) {
      closeFloat()
    } else {
      openFloat(key)
    }
  }

  const toggleExpand = (key: string) => {
    if (expandedKeys.value.has(key)) {
      expandedKeys.value.delete(key)
    } else {
      expandedKeys.value.add(key)
    }
    expandedKeys.value = new Set(expandedKeys.value)
  }

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

  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && openFloatKey.value) {
      closeFloat()
    }
  }

  onMounted(() => {
    document.addEventListener('click', handleOutsideClick, { passive: true })
    document.addEventListener('keydown', handleKeydown)
  })

  onUnmounted(() => {
    document.removeEventListener('click', handleOutsideClick)
    document.removeEventListener('keydown', handleKeydown)
  })

  return {
    expandedKeys,
    openFloatKey,
    floatPositions,
    anchorRefs,
    floatPanelRefs,
    usesCssAnchor,
    toggleExpand,
    openFloat,
    closeFloat,
    scheduleOpenFloat,
    scheduleCloseFloat,
    toggleFloat
  }
}
