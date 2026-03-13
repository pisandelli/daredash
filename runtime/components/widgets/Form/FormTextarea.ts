import { defineNuxtComponent } from 'nuxt/app'
import { h, computed } from 'vue'
import { useField } from 'vee-validate'
import { resolveComponent } from 'vue'
import getPrefixName from '#dd/utils/getPrefixName'

export default defineNuxtComponent({
  name: 'FormTextarea',
  inheritAttrs: false,
  props: {
    /**
     * Required name for the textarea element. Used for forms and vee-validate binding.
     */
    name: {
      type: String,
      required: true
    },
    /**
     * Optional initial value for the field.
     */
    modelValue: {
      type: [String, Number],
      default: undefined
    }
  },
  setup(props, { attrs, slots }) {
    const TextareaComponent = resolveComponent(
      getPrefixName('Textarea', { type: 'component' })
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
        TextareaComponent as any,
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
