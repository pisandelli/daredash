import { defineNuxtComponent } from 'nuxt/app'
import { h, ref, onMounted, onUnmounted, type PropType, type VNode } from 'vue'
import { useBaseComponent } from '#dd/composables/useBaseComponent'
import styles from '#dd/styles/Anchor.module.css'
import { sanitizeHref } from '#dd/utils/sanitizeHref'

export interface AnchorItem {
  key: string
  href: string
  title: string | (() => VNode)
}

export default defineNuxtComponent({
  name: 'Anchor',
  inheritAttrs: false,
  props: {
    /**
     * Array of anchor items to display
     */
    items: {
      type: Array as PropType<AnchorItem[]>,
      required: true,
      default: () => []
    },
    /**
     * If true, changes the layout to horizontal
     */
    horizontal: {
      type: Boolean,
      default: false
    },
    /**
     * Pixel offset to consider an item active, useful when a fixed header exists
     */
    offset: {
      type: Number,
      default: 0
    },
    /**
     * Forces `position: fixed` instead of `position: sticky` as a workaround for parent overflow-hidden issues
     */
    affix: {
      type: Boolean,
      default: false
    },
    /**
     * Selector or Element for the scrollable container. Defaults to window.
     */
    container: {
      type: [String, Object] as PropType<string | HTMLElement | Window>,
      default: () => typeof window !== 'undefined' ? window : null
    }
  },
  emits: ['click', 'change'],
  setup(props, { emit, attrs }): () => VNode {
    const { processedAttrs, classList } = useBaseComponent(attrs, styles, 'Anchor')
    const activeKey = ref<string>('')
    
    let scrollContainer: HTMLElement | Window | null = null

    const handleScroll = () => {
      if (!props.items.length) return
      
      let currentKey = ''
      
      let containerTop = 0
      if (scrollContainer && scrollContainer !== window) {
        containerTop = (scrollContainer as HTMLElement).getBoundingClientRect().top
      }
      
      for (const item of props.items) {
        if (!item.href || !item.href.startsWith('#')) continue
        const id = item.href.substring(1)
        if (!id) continue

        const el = document.getElementById(id)
        if (!el) continue

        const rect = el.getBoundingClientRect()
        // Determine if the element's top is close to or above the offset (adjusted by container pos)
        const adjustedTop = rect.top - containerTop
        if (adjustedTop <= props.offset + 150) {
          currentKey = item.key
        }
      }

      // Fallback: If reaching bottom of page/container, select the last item
      if (scrollContainer === window) {
        if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 2) {
          const lastItem = props.items[props.items.length - 1]
          if (lastItem) currentKey = lastItem.key
        }
      } else if (scrollContainer) {
        const el = scrollContainer as HTMLElement
        if (el.scrollTop + el.clientHeight >= el.scrollHeight - 2) {
           const lastItem = props.items[props.items.length - 1]
           if (lastItem) currentKey = lastItem.key
        }
      }

      // Fallback: Default to first item if we haven't scrolled past it yet
      if (!currentKey && props.items.length > 0) {
         currentKey = props.items[0].key
      }

      if (currentKey !== activeKey.value) {
        activeKey.value = currentKey
        emit('change', currentKey)
      }
    }

    onMounted(() => {
      if (typeof props.container === 'string') {
        scrollContainer = document.querySelector(props.container) as HTMLElement
      } else {
        scrollContainer = props.container as HTMLElement | Window
      }
      
      if (scrollContainer) {
        scrollContainer.addEventListener('scroll', handleScroll, { passive: true })
        // Trigger initial calculation
        setTimeout(handleScroll, 100)
      }
    })

    onUnmounted(() => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll)
      }
    })

    const handleClick = (e: MouseEvent, item: AnchorItem) => {
      emit('click', e, item)
    }

    return () => {
      const listItems = props.items.map(item => {
        const isActive = activeKey.value === item.key
        const titleContent = typeof item.title === 'function' ? item.title() : item.title

        return h('li', {
          key: item.key,
          class: styles.item,
          'data-active': isActive ? '' : undefined
        }, [
          h('a', {
            class: styles.link,
            href: sanitizeHref(item.href),
            onClick: (e: MouseEvent) => handleClick(e, item)
          }, titleContent)
        ])
      })

      return h('nav', {
        ...processedAttrs.value,
        class: classList.value,
        'data-horizontal': props.horizontal ? '' : undefined,
        'data-affix': props.affix ? '' : undefined,
        style: props.affix ? { top: `${props.offset}px` } : undefined
      }, [
        h('ul', { class: styles.list }, listItems)
      ])
    }
  }
})
