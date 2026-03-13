import { defineNuxtComponent } from 'nuxt/app'
import { h, computed } from 'vue'
import { useField } from 'vee-validate'
import { resolveComponent } from 'vue'
import getPrefixName from '#dd/utils/getPrefixName'

export default defineNuxtComponent({
  name: 'FormSelect',
  inheritAttrs: false,
  props: {
    /**
     * Required name for the select element. Used for forms and vee-validate binding.
     */
    name: {
      type: String,
      required: true
    },
    /**
     * Optional initial value for the field.
     */
    modelValue: {
      type: [String, Number, Object],
      default: undefined
    }
  },
  setup(props, { attrs, slots }) {
    const SelectComponent = resolveComponent(
      getPrefixName('Select', { type: 'component' })
    )

    const {
      value,
      errorMessage: fieldError,
      meta,
      handleChange,
      handleBlur
    } = useField(() => props.name, undefined, {
      initialValue: props.modelValue,
      syncVModel: true
    })

    const isInvalid = computed(() => !!fieldError.value && meta.touched)

    return () => {
      return h(
        SelectComponent as any,
        {
          ...attrs,
          name: props.name,
          modelValue: value.value,
          isInvalid: isInvalid.value,
          errorMessage: fieldError.value,
          'onUpdate:modelValue': handleChange,
          onBlur: handleBlur
        },
        slots
      )
    }
  }
})
