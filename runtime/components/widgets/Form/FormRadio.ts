import { defineNuxtComponent } from 'nuxt/app'
import { h, computed } from 'vue'
import { useField } from 'vee-validate'
import { resolveComponent } from 'vue'
import getPrefixName from '#dd/utils/getPrefixName'

export default defineNuxtComponent({
  name: 'FormRadio',
  inheritAttrs: false,
  props: {
    /**
     * Required name for the radio group. All radios in the same group must share this name.
     */
    name: {
      type: String,
      required: true
    },
    /**
     * The value associated with this specific radio option.
     */
    value: {
      type: [String, Number, Boolean],
      required: true
    },
    /**
     * V-model binding value for the radio group.
     */
    modelValue: {
      type: [String, Number, Boolean],
      default: undefined
    }
  },
  setup(props, { attrs, slots }) {
    const RadioComponent = resolveComponent(
      getPrefixName('Radio', { type: 'component' })
    )

    const {
      checked,
      errorMessage: fieldError,
      meta,
      handleChange
    } = useField(() => props.name, undefined, {
      type: 'radio',
      checkedValue: props.value,
      initialValue: props.modelValue,
      syncVModel: true
    })

    const isInvalid = computed(() => !!fieldError.value && meta.touched)

    return () => {
      // For radio, we want the current selected value of the group.
      // checked.value is a boolean in vee-validate for radios, so we fall back
      // to passing the active value by evaluating if checked is true.
      const currentModelValue = checked?.value ? props.value : props.modelValue

      return h(
        RadioComponent as any,
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
