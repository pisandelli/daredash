import { defineNuxtComponent } from 'nuxt/app'
import { h, computed } from 'vue'
import { useField } from 'vee-validate'
import { resolveComponent } from 'vue'
import getPrefixName from '#dd/utils/getPrefixName'

export default defineNuxtComponent({
  name: 'FormCheckbox',
  inheritAttrs: false,
  props: {
    /**
     * Required name for the checkbox input. Used for forms and vee-validate binding.
     */
    name: {
      type: String,
      required: true
    },
    /**
     * The value associated with the checkbox when checked.
     */
    value: {
      type: [Boolean, String, Number],
      default: true
    },
    /**
     * Optional initial value for the field.
     */
    modelValue: {
      type: [Boolean, Array],
      default: undefined
    }
  },
  setup(props, { attrs, slots }) {
    const CheckboxComponent = resolveComponent(
      getPrefixName('Checkbox', { type: 'component' })
    )

    const {
      checked,
      errorMessage: fieldError,
      meta,
      handleChange
    } = useField(() => props.name, undefined, {
      type: 'checkbox',
      checkedValue: props.value,
      uncheckedValue: false,
      initialValue: props.modelValue as any,
      syncVModel: true
    })

    const isInvalid = computed(() => !!fieldError.value && meta.touched)

    return () => {
      // In vee-validate v4, checked returns the active value state or boolean
      // depending on array vs single value. The base component expects the
      // array of values or a boolean.
      const currentModelValue =
        checked?.value !== undefined ? checked.value : props.modelValue

      return h(
        CheckboxComponent as any,
        {
          ...attrs,
          name: props.name,
          value: props.value,
          modelValue: currentModelValue,
          isInvalid: isInvalid.value,
          errorMessage: fieldError.value,
          'onUpdate:modelValue': handleChange
        },
        slots
      )
    }
  }
})
