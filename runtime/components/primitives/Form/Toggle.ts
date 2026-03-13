import { defineNuxtComponent } from 'nuxt/app'
import { h, computed, type VNode } from 'vue'
import { Icon } from '#components'
import { useBaseComponent } from '#dd/composables/useBaseComponent'
import styles from '#dd/styles/Toggle.module.css'

export default defineNuxtComponent({
  name: 'Toggle',
  inheritAttrs: false,
  props: {
    /**
     * Optional name for the toggle input.
     */
    name: {
      type: String,
      default: undefined
    },
    /**
     * The value associated with the toggle when active.
     */
    value: {
      type: [Boolean, String, Number],
      default: true
    },
    /**
     * Custom ID for the toggle. Falls back to the `name` prop if not provided.
     */
    id: {
      type: String,
      default: undefined
    },
    /**
     * Label text displayed next to the toggle switch.
     */
    label: {
      type: String,
      default: undefined
    },
    /**
     * Disables the toggle interaction.
     */
    disabled: {
      type: Boolean,
      default: false
    },
    /**
     * Display a loading spinner inside the toggle switch and disable interaction.
     */
    loading: {
      type: Boolean,
      default: false
    },
    /**
     * V-model binding value.
     */
    modelValue: {
      type: [Boolean, String, Number, Array],
      default: undefined
    }
  },
  emits: ['update:modelValue'],
  setup(props, { attrs, slots, emit }) {
    const { processedAttrs } = useBaseComponent(attrs, styles)

    const identifier = computed(() => props.id || props.name || 'toggle')

    // Handle click/change
    const isChecked = computed(() => {
      if (Array.isArray(props.modelValue)) {
        return props.modelValue.includes(props.value)
      }
      return !!props.modelValue
    })

    const onChange = (event: Event) => {
      if (props.loading || props.disabled) return

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

    return () => {
      const input = h('input', {
        id: identifier.value,
        name: props.name,
        type: 'checkbox',
        class: styles.input,
        disabled: props.disabled || props.loading || undefined,
        checked: isChecked.value,
        value: props.value,
        onChange: onChange,
        role: 'switch',
        'aria-checked': isChecked.value
      })

      const innerContent = h('span', { class: styles.inner }, [
        isChecked.value && slots.checked ? slots.checked() : null,
        !isChecked.value && slots.unchecked ? slots.unchecked() : null
      ])

      const thumbContent = props.loading
        ? h(Icon, {
            name: 'svg-spinners:gooey-balls-2',
            class: styles.loadingIcon
          })
        : null

      const track = h('span', { class: styles.track }, [
        innerContent,
        h('span', { class: styles.thumb }, thumbContent)
      ])

      const label =
        props.label || slots.default
          ? h(
              'span',
              { class: styles.label },
              props.label || (slots.default && slots.default())
            )
          : null

      return h(
        'label',
        {
          ...processedAttrs.value,
          class: [styles.wrapper, processedAttrs.value.class],
          for: identifier.value,
          'data-checked': isChecked.value ? '' : undefined,
          'data-disabled': props.disabled ? '' : undefined,
          'data-loading': props.loading ? '' : undefined
        },
        [input, track, label]
      )
    }
  }
})
