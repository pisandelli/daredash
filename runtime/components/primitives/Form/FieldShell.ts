import { defineNuxtComponent } from 'nuxt/app'
import { h, type PropType, type VNode } from 'vue'
import styles from '#dd/styles/FieldShell.module.css'

type MessageState = 'error' | 'warning' | undefined

export default defineNuxtComponent({
  name: 'FieldShell',
  inheritAttrs: false,
  props: {
    label: {
      type: String,
      default: undefined
    },
    forId: {
      type: String,
      default: undefined
    },
    required: {
      type: Boolean,
      default: false
    },
    message: {
      type: String,
      default: undefined
    },
    messageState: {
      type: String as PropType<MessageState>,
      default: undefined
    },
    noMessage: {
      type: Boolean,
      default: false
    },
    reserveMessage: {
      type: Boolean,
      default: true
    },
    counter: {
      type: String,
      default: undefined
    },
    wrapperClass: {
      type: [String, Array, Object],
      default: undefined
    },
    wrapperStyle: {
      type: [String, Object, Array],
      default: undefined
    }
  },
  setup(props, { slots }): () => VNode {
    return () => {
      const labelNode = props.label
        ? h(
            'label',
            {
              class: styles.label,
              for: props.forId,
              'data-dd-field-label': ''
            },
            [props.label, props.required ? ' *' : '']
          )
        : null

      const controlNode = h(
        'div',
        {
          class: styles.control,
          'data-dd-field-control': ''
        },
        slots.default?.()
      )
      const shouldRenderMessage = !props.noMessage && (props.reserveMessage || props.message)
      const messageNode = shouldRenderMessage
        ? h(
            'small',
            {
              class: [
                styles.message,
                props.messageState === 'error' ? styles.errorMessage : undefined,
                props.messageState === 'warning' ? styles.warningMessage : undefined
              ],
              'data-dd-field-message': ''
            },
            props.message ?? ''
          )
        : null

      const counterNode = props.counter
        ? h(
            'small',
            {
              class: styles.counter,
              'data-dd-field-counter': ''
            },
            props.counter
          )
        : null

      const feedbackNode = messageNode || counterNode
        ? h('div', { class: styles.feedback, 'data-dd-field-feedback': '' }, [
            messageNode ?? h('span', { 'data-dd-field-message-placeholder': '' }),
            counterNode
          ])
        : null

      return h(
        'div',
        {
          class: [styles.field, props.wrapperClass],
          style: props.wrapperStyle,
          'data-dd-field-shell': '',
          'data-no-message': props.noMessage ? '' : undefined
        },
        [labelNode, controlNode, feedbackNode].filter(Boolean)
      )
    }
  }
})
