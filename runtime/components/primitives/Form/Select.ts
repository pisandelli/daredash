import { defineNuxtComponent } from 'nuxt/app'
import { h, computed } from 'vue'
import { useBaseComponent } from '#dd/composables/useBaseComponent'
import { useAppConfig } from '#imports'
import styles from '#dd/styles/Select.module.css'
import { Icon } from '#components'
import FieldShell from './FieldShell'

export default defineNuxtComponent({
  name: 'Select',
  inheritAttrs: false,
  props: {
    /**
     * Optional name for the select element.
     */
    name: {
      type: String,
      default: undefined
    },
    /**
     * Label text displayed above the select field.
     */
    label: {
      type: String,
      default: undefined
    },
    /**
     * Custom ID for the select element. Falls back to the `name` prop if not provided.
     */
    id: {
      type: String,
      default: undefined
    },
    /**
     * Array of options to populate the select dropdown.
     */
    options: {
      type: Array as () => Array<{
        label: string
        value: any
        disabled?: boolean
      }>,
      default: () => []
    },
    /**
     * Placeholder text shown as the first disabled option.
     */
    placeholder: {
      type: String,
      default: 'Select an option'
    },
    /**
     * V-model binding value.
     */
    modelValue: {
      type: [String, Number, Object],
      default: undefined
    },
    /**
     * Indicates whether the select is in an invalid state.
     */
    isInvalid: {
      type: Boolean,
      default: false
    },
    /**
     * Error message to display when the select is invalid.
     */
    errorMessage: {
      type: String,
      default: undefined
    }
  },
  emits: ['update:modelValue'],
  setup(props, { attrs, emit }) {
    const { processedAttrs } = useBaseComponent(attrs, {})
    const appConfig = useAppConfig()
    const globalIcons = appConfig.daredash?.icons || {}
    const selectAttrs = computed(() => {
      const filteredAttrs = { ...processedAttrs.value }

      for (const propKey of [
        'options',
        'modelValue',
        'placeholder',
        'isInvalid',
        'errorMessage',
        'id',
        'name',
        'label',
        'data-no-message'
      ]) {
        delete filteredAttrs[propKey]
      }

      return filteredAttrs
    })

    // Handle input change
    const onChange = (event: Event) => {
      const target = event.target as HTMLSelectElement
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

    const identifier = computed(() => props.id || props.name || 'select')
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
      const optionsNodes = [
        h(
          'option',
          { value: '', disabled: true, selected: !props.modelValue },
          props.placeholder
        ),
        ...props.options.map((opt) =>
          h('option', { value: opt.value, disabled: opt.disabled }, opt.label)
        )
      ]

      // 3. Render Select
      const selectNode = h(
        'select',
        {
          ...selectAttrs.value,
          id: identifier.value,
          name: props.name,
          class: styles.select,
          disabled: isDisabled.value || undefined,
          required: isRequired.value || undefined,
          value: props.modelValue || '', // Ensure controlled
          'data-error': hasError.value ? '' : undefined,
          'data-warning': hasWarning.value ? '' : undefined,
          'data-success': isSuccess.value ? '' : undefined,
          onChange: onChange
        },
        optionsNodes
      )

      // 4. Render Arrow
      const arrowNode = h('div', { class: styles.arrowWrapper }, [
        h(Icon, {
          name: globalIcons.selectArrow || 'lucide:chevron-down',
          size: 'var(--dd-select-arrow-size)'
        })
      ])

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
        () => [selectNode, arrowNode]
      )
    }
  }
})
