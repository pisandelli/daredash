import { defineNuxtComponent } from 'nuxt/app'
import { h, computed, type VNode, resolveComponent } from 'vue'
import { useBaseComponent } from '#dd/composables/useBaseComponent'
import styles from '#dd/styles/Input.module.css'
import { Icon } from '#components'

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
    const { processedAttrs, classList } = useBaseComponent(
      attrs,
      styles,
      'Input'
    )

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
      // 1. Render Label if present
      const labelNode = props.label
        ? h(
            'label',
            {
              class: styles.label,
              for: identifier.value
            },
            [props.label, isRequired.value ? ' *' : '']
          )
        : null

      // 2. Render Input Wrapper
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
            [h(Icon, { name: props.icon, size: '1.25rem' })]
          )
        )
      }

      // Input Element
      inputNodes.push(
        h('input', {
          ...processedAttrs.value,
          id: identifier.value,
          name: props.name,
          type: props.type,
          class: [styles.input, classList.value],
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
            [h(Icon, { name: props.iconRight, size: '1.25rem' })]
          )
        )
      }

      // 3. Always render message container to reserve space and prevent layout shift
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

      // Return the wrapper
      return h('div', { class: styles.wrapper }, [
        labelNode,
        h('div', { style: { position: 'relative' } }, inputNodes), // Wrap input+icons for positioning
        messageNode
      ])
    }
  }
})
