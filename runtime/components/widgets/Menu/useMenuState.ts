import { ref, computed, watch, type ComputedRef } from 'vue'
import { useRoute } from 'nuxt/app'
import type { MenuEntry } from './types'

interface UseMenuStateOptions {
  collapsed: boolean
  collapsible: boolean
}

interface UseMenuStateReturn {
  internalCollapsed: ReturnType<typeof ref<boolean>>
  isCollapsed: ComputedRef<boolean>
  collapse: () => void
  expand: () => void
  toggle: () => void
}

export function useMenuState(
  props: UseMenuStateOptions,
  emit: (event: 'update:collapsed', value: boolean) => void
): UseMenuStateReturn {
  const route = useRoute()
  const internalCollapsed = ref(props.collapsed)

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

  const isCollapsed = computed(
    () => props.collapsible && (props.collapsed || internalCollapsed.value)
  )

  watch(
    () => route.path,
    () => {
      internalCollapsed.value = props.collapsed
    }
  )

  return {
    internalCollapsed,
    isCollapsed,
    collapse,
    expand,
    toggle
  }
}
