import { defineNuxtComponent } from 'nuxt/app'
import { h, computed, ref, watch } from 'vue'
import { useBaseComponent } from '#dd/composables/useBaseComponent'
import styles from '#dd/styles/Textarea.module.css'

// Optional VeeValidate integration – gracefully degrades when not installed.
let useField: undefined | ((...args: any[]) => any)
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  useField = require('vee-validate').useField
} catch (_) {
  /* VeeValidate not available – prop-based validation will be used instead */
}

export default defineNuxtComponent({
  name: 'Textarea',
  inheritAttrs: false,
  props: {
    /**
     * Optional name for the textarea element. Also used as the VeeValidate field name
     * when `useValidation` is true.
     */
    name: {
      type: String,
      default: undefined
    },
    /**
     * Label text displayed above the textarea field.
     */
    label: {
      type: String,
      default: undefined
    },
    /**
     * Custom ID for the textarea element. Falls back to the `name` prop if not provided.
     */
    id: {
      type: String,
      default: undefined
    },
    /**
     * Placeholder text shown when the textarea is empty.
     */
    placeholder: {
      type: String,
      default: ''
    },
    /**
     * V-model binding value.
     */
    modelValue: {
      type: String,
      default: undefined
    },
    /**
     * Maximum number of characters allowed. Displays a live counter when provided.
     */
    maxLength: {
      type: [String, Number],
      default: undefined
    },
    /**
     * Visible number of text rows. Maps to the native `rows` HTML attribute.
     */
    rows: {
      type: [Number, String],
      default: undefined
    },
    /**
     * Indicates whether the textarea is in an invalid state (for use without VeeValidate).
     */
    isInvalid: {
      type: Boolean,
      default: false
    },
    /**
     * Error message to display when invalid (for use without VeeValidate).
     */
    errorMessage: {
      type: String,
      default: undefined
    },
    /**
     * When true, binds the field to a VeeValidate context using the `name` prop.
     * Requires VeeValidate to be installed in the host project.
     */
    useValidation: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue'],
  setup(props, { attrs, emit }) {
    const { processedAttrs, classList } = useBaseComponent(
      attrs,
      styles,
      'Textarea'
    )

    const liveValue = ref((props.modelValue || '') as string)

    // Keep local value in sync when parent externally changes modelValue (e.g. form reset)
    watch(
      () => props.modelValue,
      (newVal) => {
        if (newVal !== liveValue.value) liveValue.value = newVal || ''
      }
    )

    const onInput = (event: Event) => {
      const target = event.target as HTMLTextAreaElement
      liveValue.value = target.value
      emit('update:modelValue', target.value)
    }

    // --- Attr-based state (works without VeeValidate) ---
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

    const identifier = computed(() => props.id || props.name || 'textarea')

    // --- VeeValidate opt-in path ---
    const veeErrorMessage = ref<string | undefined>(undefined)

    if (props.useValidation && props.name && useField) {
      const { errorMessage: veeError } = useField(
        () => props.name!,
        undefined,
        { syncVModel: true }
      )
      // Mirror reactive vee-validate error into the local ref
      import('vue').then(({ watchEffect }) => {
        watchEffect(() => {
          veeErrorMessage.value = veeError.value as string | undefined
        })
      })
    }

    const hasError = computed(
      () => !!(veeErrorMessage.value || attrError.value || props.isInvalid)
    )
    const hasWarning = computed(() => !hasError.value && !!attrWarning.value)
    const isSuccess = computed(
      () => !hasError.value && !hasWarning.value && attrSuccess.value
    )

    const activeError = computed(
      () =>
        veeErrorMessage.value ||
        (typeof attrError.value === 'string' ? attrError.value : undefined) ||
        props.errorMessage
    )
    const activeMessage = computed(
      () =>
        activeError.value ||
        (typeof attrWarning.value === 'string' ? attrWarning.value : undefined)
    )

    const charCount = computed(() => liveValue.value.length)

    return () => {
      // 1. Label
      const labelNode = props.label
        ? h('label', { class: styles.label, for: identifier.value }, [
            props.label,
            isRequired.value ? ' *' : ''
          ])
        : null

      // 2. Textarea
      const textareaNode = h('textarea', {
        ...processedAttrs.value,
        id: identifier.value,
        name: props.name,
        rows: props.rows,
        class: [styles.textarea, classList.value],
        disabled: isDisabled.value || undefined,
        required: isRequired.value || undefined,
        placeholder: props.placeholder,
        value: liveValue.value,
        maxlength: props.maxLength,
        'data-error': hasError.value ? '' : undefined,
        'data-warning': hasWarning.value ? '' : undefined,
        'data-success': isSuccess.value ? '' : undefined,
        onInput
      })

      // 3. Footer: message on the left, char counter on the right
      const messageNode = activeMessage.value
        ? h(
            'small',
            {
              class: [
                styles.message,
                hasError.value ? styles.errorMessage : styles.warningMessage
              ]
            },
            activeMessage.value
          )
        : null

      const counterNode = props.maxLength
        ? h(
            'small',
            { class: styles.counter },
            `${charCount.value} / ${props.maxLength}`
          )
        : null

      const footerNode =
        messageNode || counterNode
          ? h('div', { class: styles.footer }, [
              messageNode ?? h('span'),
              counterNode
            ])
          : null

      return h('div', { class: [styles.wrapper, processedAttrs.value.class] }, [
        labelNode,
        textareaNode,
        footerNode
      ])
    }
  }
})
