import { defineNuxtComponent } from 'nuxt/app'
import { h, computed, type VNode } from 'vue'
import { useBaseComponent } from '#dd/composables/useBaseComponent'
import styles from '#dd/styles/Checkbox.module.css'

export default defineNuxtComponent({
  name: 'Checkbox',
  inheritAttrs: false,
  props: {
    /**
     * Optional name for the checkbox input. Used for identification.
     */
    name: {
      type: String,
      default: undefined
    },
    /**
     * The value associated with the checkbox when checked.
     */
    value: {
      type: [Boolean, String, Number],
      default: true // Value when checked
    },
    /**
     * Custom ID for the checkbox. If not provided, falls back to the `name` prop.
     */
    id: {
      type: String,
      default: undefined
    },
    /**
     * Label text displayed next to the checkbox.
     */
    label: {
      type: String,
      default: undefined
    },
    /**
     * Warning message to display below the checkbox.
     */
    warning: {
      type: String,
      default: undefined
    },
    /**
     * Disables the checkbox interaction.
     */
    disabled: {
      type: Boolean,
      default: false
    },
    /**
     * Used internally by v-model.
     */
    modelValue: {
      type: [Boolean, Array],
      default: undefined
    },
    /**
     * Indicates whether the checkbox is in an invalid state.
     */
    isInvalid: {
      type: Boolean,
      default: false
    },
    /**
     * Error message to display when the checkbox is invalid.
     */
    errorMessage: {
      type: String,
      default: undefined
    }
  },
  emits: ['update:modelValue'],
  setup(props, { attrs, slots, emit }) {
    // Handle click/change
    const isChecked = computed(() => {
      if (Array.isArray(props.modelValue)) {
        return props.modelValue.includes(props.value)
      }
      return !!props.modelValue
    })

    const onChange = (event: Event) => {
      const target = event.target as HTMLInputElement

      if (Array.isArray(props.modelValue)) {
        const newValue = [...props.modelValue]
        if (target.checked) {
          newValue.push(props.value)
        } else {
          const index = newValue.indexOf(props.value)
          if (index > -1) newValue.splice(index, 1)
        }
        emit('update:modelValue', newValue)
      } else {
        emit('update:modelValue', target.checked ? props.value : false)
      }
    }

    const identifier = computed(() => props.id || props.name || 'checkbox')

    const hasError = computed(() => props.isInvalid)
    const hasWarning = computed(() => !hasError.value && !!props.warning)
    const activeMessage = computed(() =>
      hasError.value ? props.errorMessage : props.warning
    )

    const { processedAttrs } = useBaseComponent(attrs, styles)

    return () => {
      const checkboxContent = [
        h('input', {
          id: identifier.value,
          name: props.name,
          type: 'checkbox',
          class: styles.checkbox,
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
          checkboxContent
        ),
        messageNode
      ])
    }
  }
})
