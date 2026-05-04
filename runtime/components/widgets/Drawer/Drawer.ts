import { defineNuxtComponent } from 'nuxt/app'
import { h, ref, watch, onMounted, resolveComponent, useId } from 'vue'
import type { VNode, PropType } from 'vue'
import { useBaseComponent } from '#dd/composables/useBaseComponent'
import { useAppConfig } from '#imports'
import styles from '#dd/styles/Drawer.module.css'
import getPrefixName from '#dd/utils/getPrefixName'
import { Icon } from '#components'

export default defineNuxtComponent({
  name: 'Drawer',
  inheritAttrs: false,
  props: {
    /**
     * Controls whether the drawer is open or closed.
     */
    open: {
      type: Boolean,
      default: false
    },
    /**
     * The title of the drawer, displayed in the header.
     */
    title: {
      type: String,
      default: undefined
    },
    /**
     * Whether the drawer should close when clicking outside of it.
     */
    closeOnBackdrop: {
      type: Boolean,
      default: true
    },
    /**
     * Position from which the drawer will slide in.
     */
    position: {
      type: String as PropType<'top' | 'right' | 'bottom' | 'left'>,
      default: 'right',
      validator: (value: string) => ['top', 'right', 'bottom', 'left'].includes(value)
    }
  },
  emits: ['close', 'update:open'],
  setup(props, { emit, slots, attrs }) {
    const dialog = ref<HTMLDialogElement | null>(null)
    const titleId = useId()

    // Map position prop to data-position attribute for CSS
    const dynamicAttrs = {
      ...attrs,
      [`data-position`]: props.position
    }

    // Base component setup for styling
    const { processedAttrs, classList } = useBaseComponent(
      dynamicAttrs,
      styles,
      'Drawer'
    )

    // AppConfig icons fallback
    const appConfig = useAppConfig()
    const globalIcons = appConfig.daredash?.icons || {}

    // Resolve DareDash components dynamically
    const DdBox = resolveComponent(getPrefixName('Box', { type: 'component' }))
    const DdStack = resolveComponent(
      getPrefixName('Stack', { type: 'component' })
    )
    const DdCluster = resolveComponent(
      getPrefixName('Cluster', { type: 'component' })
    )

    watch(
      () => props.open,
      (isOpen) => {
        if (isOpen) {
          dialog.value?.showModal()
        } else {
          dialog.value?.close()
        }
      }
    )

    function closeDrawer() {
      emit('update:open', false)
      emit('close')
    }

    // Native dialogs capture backdrop clicks on the dialog element itself
    function onDialogClick(event: MouseEvent) {
      if (props.closeOnBackdrop && event.target === dialog.value) {
        closeDrawer()
      }
    }

    // Ensure the dialog's state stays synced if native browser mechanics close it
    onMounted(() => {
      if (dialog.value) {
        dialog.value.addEventListener('close', () => {
          emit('update:open', false)
          emit('close')
        })

        if (props.open) {
          dialog.value.showModal()
        }
      }
    })

    return () => {
      const drawerContent: VNode[] = []

      // Header
      if (props.title || slots.header) {
        drawerContent.push(
          h(
            DdCluster,
            { between: true, tag: 'header', class: styles.header },
            () => {
              const headerNodes = slots.header ? slots.header() : [
                h('h2', { id: titleId, class: styles.title }, props.title)
              ]

              const closeBtn = h(
                'button',
                {
                  class: styles.close,
                  onClick: (e: Event) => {
                    e.preventDefault()
                    closeDrawer()
                  },
                  'aria-label': 'Close drawer'
                },
                [
                  h(Icon, {
                    name: globalIcons.drawerClose || globalIcons.modalClose || 'heroicons:x-mark'
                  })
                ]
              )
              return [...headerNodes, closeBtn]
            }
          )
        )
      }

      // Body (Default slot)
      drawerContent.push(
        h(DdBox, { class: styles.body }, () => slots.default?.())
      )

      // Footer
      if (slots.footer) {
        drawerContent.push(h('footer', { class: styles.footer }, slots.footer()))
      }

      const innerStack = h(
        DdStack as any,
        { class: styles.inner },
        () => drawerContent
      )

      return h(
        'dialog',
        {
          ref: dialog,
          'aria-labelledby': props.title ? titleId : undefined,
          class: classList.value,
          ...processedAttrs.value,
          onClick: onDialogClick
        },
        [innerStack]
      )
    }
  }
})
