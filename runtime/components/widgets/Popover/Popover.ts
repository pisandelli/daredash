import { defineNuxtComponent } from 'nuxt/app'
import { h, ref, onMounted, onUnmounted, nextTick, type PropType } from 'vue'
import { useBaseComponent } from '#dd/composables/useBaseComponent'
import styles from '#dd/styles/Popover.module.css'
import getPrefixName from '#dd/utils/getPrefixName'

export type PopoverPlacement = 
  | 'top' | 'top-start' | 'top-end'
  | 'bottom' | 'bottom-start' | 'bottom-end'
  | 'left' | 'left-start' | 'left-end'
  | 'right' | 'right-start' | 'right-end'

export type PopoverTrigger = 'click' | 'hover' | 'focus'

export default defineNuxtComponent({
  name: 'Popover',
  inheritAttrs: false,
  props: {
    /**
     * Title text displayed in the popover header.
     */
    title: { type: String, default: undefined },
    /**
     * Trigger event to show the popover.
     * @default 'hover'
     */
    trigger: { type: String as PropType<PopoverTrigger>, default: 'hover' },
    /**
     * Position of the popover relative to the trigger element.
     * @default 'top'
     */
    placement: { type: String as PropType<PopoverPlacement>, default: 'top' },
    /**
     * Offset distance between trigger and popover.
     * @default 8
     */
    offset: { type: Number, default: 8 },
    /**
     * Callback fired when the popover closes.
     */
    onClose: { type: Function as PropType<() => void>, default: undefined }
  },
  setup(props, { slots, attrs }) {
    const { processedAttrs } = useBaseComponent(attrs, styles)
    
    const triggerRef = ref<HTMLElement | null>(null)
    const popoverRef = ref<HTMLElement | null>(null)
    
    // Positioning logic (calculating coordinates based on trigger)
    const updatePosition = () => {
      if (!triggerRef.value || !popoverRef.value) return
      
      const triggerRect = triggerRef.value.getBoundingClientRect()
      const popoverRect = popoverRef.value.getBoundingClientRect()
      
      let top = 0
      let left = 0
      
      // Basic positioning logic depending on placement
      const [side, align] = props.placement.split('-')
      
      // Side logic
      if (side === 'top') {
        top = triggerRect.top - popoverRect.height - props.offset
        left = triggerRect.left + (triggerRect.width / 2) - (popoverRect.width / 2)
      } else if (side === 'bottom') {
        top = triggerRect.bottom + props.offset
        left = triggerRect.left + (triggerRect.width / 2) - (popoverRect.width / 2)
      } else if (side === 'left') {
        top = triggerRect.top + (triggerRect.height / 2) - (popoverRect.height / 2)
        left = triggerRect.left - popoverRect.width - props.offset
      } else if (side === 'right') {
        top = triggerRect.top + (triggerRect.height / 2) - (popoverRect.height / 2)
        left = triggerRect.right + props.offset
      }
      
      // Alignment modifications
      if (align === 'start') {
        if (side === 'top' || side === 'bottom') left = triggerRect.left
        if (side === 'left' || side === 'right') top = triggerRect.top
      } else if (align === 'end') {
        if (side === 'top' || side === 'bottom') left = triggerRect.right - popoverRect.width
        if (side === 'left' || side === 'right') top = triggerRect.bottom - popoverRect.height
      }
      
      // Boundary collision (basic viewport flip/shift)
      // Very basic implementation: just push it inside viewport if it bleeds
      // Note: we'd ideally wait for CSS Anchor Positioning, but we fallback to JS here to be fully "puramente nativo sem @floating-ui"
      
      if (left < 0) left = props.offset
      if (left + popoverRect.width > window.innerWidth) left = window.innerWidth - popoverRect.width - props.offset
      if (top < 0) top = props.offset
      if (top + popoverRect.height > window.innerHeight) top = window.innerHeight - popoverRect.height - props.offset

      // Apply
      popoverRef.value.style.left = `${left}px`
      popoverRef.value.style.top = `${top}px`
    }

    const show = async () => {
      if (popoverRef.value && !popoverRef.value.matches(':popover-open')) {
        popoverRef.value.showPopover()
        await nextTick()
        updatePosition()
        window.addEventListener('scroll', updatePosition, { passive: true })
        window.addEventListener('resize', updatePosition, { passive: true })
      }
    }
    
    const hide = () => {
      if (popoverRef.value && popoverRef.value.matches(':popover-open')) {
        popoverRef.value.hidePopover()
        window.removeEventListener('scroll', updatePosition)
        window.removeEventListener('resize', updatePosition)
      }
    }
    
    const toggle = () => {
      if (popoverRef.value?.matches(':popover-open')) {
        hide()
      } else {
        show()
      }
    }

    // Hover mechanisms
    let hoverTimeout: any = null
    const onMouseEnter = () => {
      if (props.trigger === 'hover') {
        clearTimeout(hoverTimeout)
        show()
      }
    }
    
    const onMouseLeave = () => {
      if (props.trigger === 'hover') {
        hoverTimeout = setTimeout(() => {
          hide()
        }, 100) // Small delay to allow moving from trigger to popover
      }
    }

    // Click mechanisms
    const onClick = (e: MouseEvent) => {
      if (props.trigger === 'click') {
        toggle()
      }
    }

    // Focus mechanisms
    const onFocus = () => {
      if (props.trigger === 'focus') show()
    }
    
    const onBlur = (e: FocusEvent) => {
      if (props.trigger === 'focus') {
        // Only hide if focus moves outside both trigger and popover
        const relatedTarget = e.relatedTarget as Node
        if (
          triggerRef.value?.contains(relatedTarget) || 
          popoverRef.value?.contains(relatedTarget)
        ) return
        hide()
      }
    }

    onMounted(() => {
      if (triggerRef.value && triggerRef.value.firstElementChild) {
        const el = triggerRef.value.firstElementChild as HTMLElement
        if (props.trigger === 'hover') {
          el.addEventListener('mouseenter', onMouseEnter)
          el.addEventListener('mouseleave', onMouseLeave)
        } else if (props.trigger === 'click') {
          el.addEventListener('click', onClick)
        } else if (props.trigger === 'focus') {
          el.addEventListener('focus', onFocus)
          el.addEventListener('blur', onBlur)
        }
      }
      
      if (popoverRef.value && props.trigger === 'hover') {
        popoverRef.value.addEventListener('mouseenter', onMouseEnter)
        popoverRef.value.addEventListener('mouseleave', onMouseLeave)
      }
      
      // Handle native popover attributes matching 'click-outside' or 'esc'
      if (popoverRef.value) {
        popoverRef.value.addEventListener('beforetoggle', (e: Event) => {
          const evt = e as any
          if (evt.newState === 'closed') {
            window.removeEventListener('scroll', updatePosition)
            window.removeEventListener('resize', updatePosition)
            props.onClose?.()
          }
        })
      }
    })

    onUnmounted(() => {
      if (triggerRef.value && triggerRef.value.firstElementChild) {
        const el = triggerRef.value.firstElementChild as HTMLElement
        el.removeEventListener('mouseenter', onMouseEnter)
        el.removeEventListener('mouseleave', onMouseLeave)
        el.removeEventListener('click', onClick)
        el.removeEventListener('focus', onFocus)
        el.removeEventListener('blur', onBlur)
      }
      if (popoverRef.value) {
        popoverRef.value.removeEventListener('mouseenter', onMouseEnter)
        popoverRef.value.removeEventListener('mouseleave', onMouseLeave)
      }
      clearTimeout(hoverTimeout)
      window.removeEventListener('scroll', updatePosition)
      window.removeEventListener('resize', updatePosition)
    })

    return () => {
      return h('div', { class: styles.popover, ...processedAttrs.value }, [
        // Trigger slot wrapper
        h('div', { 
          ref: triggerRef,
          class: styles.triggerWrapper,
          // If trigger is click, popover API can handle it natively for accessibility mostly
        }, slots.default?.()),
        
        // Popover Content
        h('div', {
          ref: popoverRef,
          popover: props.trigger === 'click' ? 'auto' : 'manual', // Auto allows Esc and backdrop click implicitly.
          class: styles.popoverPanel,
          'data-placement': props.placement
        }, [
          h('div', { class: styles.inner }, [
            (props.title || slots.header?.()) && h('div', { class: styles.header }, [
              slots.header?.() || props.title
            ]),
            h('div', { class: styles.content }, slots.content?.())
          ]),
          h('div', { class: styles.arrow })
        ])
      ])
    }
  }
})
