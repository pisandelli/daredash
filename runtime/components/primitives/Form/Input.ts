import { defineNuxtComponent } from 'nuxt/app'
import { h, computed, type VNode } from 'vue'
import { useBaseComponent } from '#dd/composables/useBaseComponent'
import styles from '#dd/styles/Input.module.css'
import { Icon } from '#components'
import FieldShell from './FieldShell'

export default defineNuxtComponent({
  name: 'Input',
  inheritAttrs: false,
  props: {
    /**
     * Optional name for the input element.
     */
    name: {
      type: String,
      default: undefined
    },
    /**
     * Label text displayed above the input field.
     */
    label: {
      type: String,
      default: undefined
    },
    /**
     * The HTML native type attribute for the input (e.g., 'text', 'password', 'email').
     */
    type: {
      type: String,
      default: 'text'
    },
    /**
     * Custom ID for the input. Falls back to the `name` prop if not provided.
     */
    id: {
      type: String,
      default: undefined
    },
    /**
     * Placeholder text shown when the input is empty.
     */
    placeholder: {
      type: String,
      default: ''
    },
    /**
     * The name of the icon to display on the left side of the input.
     */
    icon: {
      type: String,
      default: undefined
    },
    /**
     * The name of the icon to display on the right side of the input.
     */
    iconRight: {
      type: String,
      default: undefined
    },
    /**
     * V-model binding value.
     */
    modelValue: {
      type: [String, Number],
      default: undefined
    },
    /**
     * Indicates whether the input is in an invalid state.
     */
    isInvalid: {
      type: Boolean,
      default: false
    },
    /**
     * Error message to display when the input is invalid.
     */
    errorMessage: {
      type: String,
      default: undefined
    }
  },
  emits: ['update:modelValue'],
  setup(props, { attrs, emit }) {
    // 1. Process Attributes and get wrapped class
    const { processedAttrs } = useBaseComponent(
      attrs,
      styles,
      'Input'
    )
    const inputAttrs = computed(() => {
      const filteredAttrs = { ...processedAttrs.value }
      delete filteredAttrs['data-no-message']
      return filteredAttrs
    })

    // Handle input change
    const onInput = (event: Event) => {
      const target = event.target as HTMLInputElement
      emit('update:modelValue', target.value)
    }

    const attrError = computed(() =>
      typeof attrs.error === 'string'
        ? attrs.error
        : attrs.error === '' || attrs.error === true
          ? true
          : undefined
    )
    const attrWarning = computed(() =>
      typeof attrs.warning === 'string'
        ? attrs.warning
        : attrs.warning === '' || attrs.warning === true
          ? true
          : undefined
    )
    const attrSuccess = computed(
      () => attrs.success !== undefined && attrs.success !== false
    )
    const isRequired = computed(
      () => attrs.required !== undefined && attrs.required !== false
    )
    const isDisabled = computed(
      () => attrs.disabled !== undefined && attrs.disabled !== false
    )
    const shouldRenderMessage = computed(
      () => attrs['no-message'] === undefined || attrs['no-message'] === false
    )

    const identifier = computed(() => props.id || props.name || 'input')
    const hasError = computed(() => !!(attrError.value || props.isInvalid))
    const hasWarning = computed(() => !hasError.value && !!attrWarning.value)
    const isSuccess = computed(
      () => !hasError.value && !hasWarning.value && attrSuccess.value
    )

    const activeError = computed(
      () =>
        (typeof attrError.value === 'string' ? attrError.value : undefined) ||
        props.errorMessage
    )
    const activeMessage = computed(
      () =>
        activeError.value ||
        (typeof attrWarning.value === 'string' ? attrWarning.value : undefined)
    )

    return () => {
      const inputNodes: VNode[] = []

      // Icon Left
      if (props.icon) {
        inputNodes.push(
          h(
            'div',
            {
              class: [
                styles.iconWrapper,
                styles.left,
                hasError.value && styles.error,
                hasWarning.value && styles.warning,
                isSuccess.value && styles.success
              ]
            },
            [h(Icon, { name: props.icon, size: 'var(--dd-input-icon-size)' })]
          )
        )
      }

      // Input Element
      inputNodes.push(
        h('input', {
          ...inputAttrs.value,
          id: identifier.value,
          name: props.name,
          type: props.type,
          class: styles.input,
          disabled: isDisabled.value || undefined, // undefined to remove attribute if false
          required: isRequired.value || undefined,
          placeholder: props.placeholder,
          value: props.modelValue,
          'data-error': hasError.value ? '' : undefined,
          'data-warning': hasWarning.value ? '' : undefined,
          'data-success': isSuccess.value ? '' : undefined,
          'data-has-icon-left': !!props.icon || undefined,
          'data-has-icon-right': !!props.iconRight || undefined,
          onInput: onInput
        })
      )

      // Icon Right
      if (props.iconRight) {
        inputNodes.push(
          h(
            'div',
            {
              class: [
                styles.iconWrapper,
                styles.right,
                hasError.value && styles.error,
                hasWarning.value && styles.warning,
                isSuccess.value && styles.success
              ]
            },
            [h(Icon, { name: props.iconRight, size: 'var(--dd-input-icon-size)' })]
          )
        )
      }

      return h(
        FieldShell,
        {
          label: props.label,
          forId: identifier.value,
          required: isRequired.value,
          message: activeMessage.value,
          messageState: hasError.value ? 'error' : hasWarning.value ? 'warning' : undefined,
          noMessage: !shouldRenderMessage.value,
          wrapperClass: attrs.class,
          wrapperStyle: attrs.style
        },
        () => inputNodes
      )
    }
  }
})
