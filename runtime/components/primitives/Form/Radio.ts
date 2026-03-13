import { defineNuxtComponent } from 'nuxt/app'
import { h, computed, type VNode } from 'vue'
import { useBaseComponent } from '#dd/composables/useBaseComponent'
import styles from '#dd/styles/Radio.module.css'

export default defineNuxtComponent({
  name: 'Radio',
  inheritAttrs: false,
  props: {
    /**
     * Optional name for the radio group. All radios in the same group must share this name.
     */
    name: {
      type: String,
      default: undefined
    },
    /**
     * The value associated with this specific radio option.
     */
    value: {
      type: [String, Number, Boolean],
      required: true // Radio needs a value to be meaningful
    },
    /**
     * Custom ID for the radio input. If not provided, falls back to a generated ID using name and value.
     */
    id: {
      type: String,
      default: undefined
    },
    /**
     * Label text displayed next to the radio button.
     */
    label: {
      type: String,
      default: undefined
    },
    /**
     * Warning message to display below the radio button.
     */
    warning: {
      type: String,
      default: undefined
    },
    /**
     * Disables the radio button interaction.
     */
    disabled: {
      type: Boolean,
      default: false
    },
    /**
     * V-model binding value for the radio group.
     */
    modelValue: {
      type: [String, Number, Boolean],
      default: undefined
    },
    /**
     * Indicates whether the radio is in an invalid state.
     */
    isInvalid: {
      type: Boolean,
      default: false
    },
    /**
     * Error message to display when the radio is invalid.
     */
    errorMessage: {
      type: String,
      default: undefined
    }
  },
  emits: ['update:modelValue'],
  setup(props, { attrs, slots, emit }) {
    // Handle click/change
    const isChecked = computed(() => props.modelValue === props.value)

    const onChange = (event: Event) => {
      const target = event.target as HTMLInputElement
      if (target.checked) {
        emit('update:modelValue', props.value)
      }
    }

    const identifier = computed(
      () => props.id || `${props.name || 'radio'}-${props.value}`
    )

    const hasError = computed(() => props.isInvalid)
    const hasWarning = computed(() => !hasError.value && !!props.warning)
    const activeMessage = computed(() =>
      hasError.value ? props.errorMessage : props.warning
    )

    const { processedAttrs } = useBaseComponent(attrs, styles)

    return () => {
      const radioContent = [
        h('input', {
          id: identifier.value,
          name: props.name,
          type: 'radio',
          class: styles.radio,
          disabled: props.disabled || undefined,
          checked: isChecked.value,
          value: props.value,
          onChange: onChange
        }),
        props.label || slots.default
          ? h(
              'label',
              { class: styles.label, for: identifier.value },
              props.label || (slots.default && slots.default())
            )
          : null
      ]

      const messageNode = h(
        'small',
        {
          class: [
            styles.message,
            hasError.value ? styles.errorMessage : undefined,
            hasWarning.value ? styles.warningMessage : undefined
          ]
        },
        activeMessage.value ?? ''
      )

      return h('div', [
        h(
          'div',
          {
            ...processedAttrs.value,
            class: [styles.wrapper, processedAttrs.value.class],
            'data-disabled': props.disabled || undefined,
            'data-error': hasError.value ? '' : undefined,
            'data-warning': hasWarning.value ? '' : undefined
          },
          radioContent
        ),
        messageNode
      ])
    }
  }
})
