import { defineNuxtComponent } from 'nuxt/app'
import { h, inject, onMounted, onUnmounted, computed, resolveComponent } from 'vue'
import { useBaseComponent } from '#dd/composables/useBaseComponent'
import getPrefixName from '#dd/utils/getPrefixName'
import styles from '#dd/styles/Tabs.module.css'
import { Icon } from '#components'
import { TabsContextKey, type TabsContext } from './Tabs'

export default defineNuxtComponent({
  name: 'DdTab',
  inheritAttrs: false,
  props: {
    value: {
      type: [String, Number],
      required: true
    },
    disabled: Boolean,
    loading: Boolean,
    closable: Boolean,
    icon: String,
    to: String,
    href: String
  },
  setup(props, { slots, attrs }) {
    const { processedAttrs, classList } = useBaseComponent(attrs, styles, 'Tab')
    const context = inject(TabsContextKey) as TabsContext | null

    onMounted(() => {
      if (!props.disabled) context?.registerTab(props.value)
    })

    onUnmounted(() => {
      context?.unregisterTab(props.value)
    })

    const isActive = computed(() => context?.activeTab.value === props.value)

    const onClick = (e: Event) => {
      if (props.disabled || props.loading) {
        e.preventDefault()
        return
      }
      context?.selectTab(props.value)
    }

    const onKeydown = (e: KeyboardEvent) => {
      if (props.disabled || props.loading) return
      
      const isVertical = context?.vertical.value
      let handled = false

      if ((!isVertical && e.key === 'ArrowRight') || (isVertical && e.key === 'ArrowDown')) {
        context?.selectNextTab(props.value)
        handled = true
      } else if ((!isVertical && e.key === 'ArrowLeft') || (isVertical && e.key === 'ArrowUp')) {
        context?.selectPrevTab(props.value)
        handled = true
      } else if (e.key === 'Home') {
        context?.selectFirstTab()
        handled = true
      } else if (e.key === 'End') {
        context?.selectLastTab()
        handled = true
      } else if ((e.key === 'Enter' || e.key === ' ') && context?.manualActivation.value) {
        context?.selectTab(props.value)
        handled = true
      }

      if (handled) {
        e.preventDefault()
        setTimeout(() => {
          const newActiveId = context?.activeTab.value
          const el = document.getElementById(`tab-${newActiveId}`)
          if (el) el.focus()
        }, 0)
      }
    }

    const onClose = (e: Event) => {
      e.stopPropagation()
      e.preventDefault()
      context?.closeTab(props.value)
    }

    return () => {
      let tag: any = 'button'
      if (props.to) {
        tag = resolveComponent('NuxtLink')
      } else if (props.href) {
        tag = 'a'
      }

      const anchorName = `--dd-tab-${String(props.value).replace(/[^a-zA-Z0-9-]/g, '-')}`

      const tabAttrs: Record<string, any> = {
        ...processedAttrs.value,
        class: [classList.value],
        role: 'tab',
        'aria-selected': isActive.value ? 'true' : 'false',
        'aria-controls': `panel-${props.value}`,
        id: `tab-${props.value}`,
        tabindex: isActive.value ? 0 : -1,
        disabled: props.disabled ? true : undefined,
        'data-active': isActive.value ? '' : undefined,
        'data-indicator-type': context?.indicatorType.value,
        onClick,
        onKeydown,
        style: {
          'anchor-name': anchorName
        }
      }

      if (props.to) tabAttrs.to = props.to
      if (props.href) tabAttrs.href = props.href

      const children = []

      if (props.loading) {
        children.push(h(Icon, { name: 'svg-spinners:gooey-balls-2', 'aria-hidden': 'true', style: { fontSize: '1.25em' } }))
      } else if (props.icon) {
        children.push(h(Icon, { name: props.icon, 'aria-hidden': 'true' }))
      } else if (slots.prefix) {
        children.push(slots.prefix())
      }

      children.push(slots.default?.())

      if (props.closable) {
        children.push(h('button', {
          class: styles['close-btn'],
          onClick: onClose,
          'aria-label': 'Close tab',
          tabindex: -1 
        }, [
          h(Icon, { name: 'heroicons:x-mark' })
        ]))
      } else if (slots.suffix) {
        children.push(slots.suffix())
      }

      return h(tag, tabAttrs, children)
    }
  }
})
