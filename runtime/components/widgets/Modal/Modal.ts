import { defineNuxtComponent } from 'nuxt/app'
import { h, ref, watch, onMounted, resolveComponent, useId } from 'vue'
import type { VNode } from 'vue'
import { useBaseComponent } from '#dd/composables/useBaseComponent'
import { useAppConfig } from '#imports'
import styles from '#dd/styles/Modal.module.css'
import getPrefixName from '#dd/utils/getPrefixName'
import { Icon } from '#components'

export default defineNuxtComponent({
  name: 'Modal',
  inheritAttrs: false,
  props: {
    /**
     * Controls whether the modal is open or closed.
     */
    open: {
      type: Boolean,
      default: false
    },
    /**
     * The title of the modal, displayed in the header.
     */
    title: {
      type: String,
      default: undefined
    },
    /**
     * Whether the modal should close when clicking outside of it.
     */
    closeOnBackdrop: {
      type: Boolean,
      default: true
    }
  },
  emits: ['close', 'update:open'],
  setup(props, { emit, slots, attrs }) {
    const dialog = ref<HTMLDialogElement | null>(null)
    const titleId = useId()

    // Base component setup for styling
    const { processedAttrs, classList } = useBaseComponent(
      attrs,
      styles,
      'Modal'
    )

    // AppConfig icons fallback
    const appConfig = useAppConfig() as Record<string, any>
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

    function closeModal() {
      emit('update:open', false)
      emit('close')
    }

    // Native dialogs capture backdrop clicks on the dialog element itself
    function onDialogClick(event: MouseEvent) {
      if (props.closeOnBackdrop && event.target === dialog.value) {
        closeModal()
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
      const modalContent: VNode[] = []

      // Header
      if (props.title) {
        modalContent.push(
          h(
            DdCluster,
            { between: true, tag: 'header', class: styles.header },
            () => [
              h('h2', { id: titleId, class: styles.title }, props.title),
              h(
                'button',
                {
                  class: styles.close,
                  onClick: (e: Event) => {
                    e.preventDefault()
                    closeModal()
                  },
                  'aria-label': 'Close modal'
                },
                [
                  h(Icon, {
                    name: globalIcons.modalClose || 'heroicons:x-mark'
                  })
                ]
              )
            ]
          )
        )
      }

      // Body (Default slot)
      modalContent.push(
        h(DdBox, { class: styles.body }, () => slots.default?.())
      )

      // Footer
      if (slots.footer) {
        modalContent.push(h('footer', { class: styles.footer }, slots.footer()))
      }

      const innerStack = h(
        DdStack as any,
        { class: styles.inner },
        () => modalContent
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
