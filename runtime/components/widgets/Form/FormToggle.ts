import { defineNuxtComponent } from 'nuxt/app'
import { h, computed } from 'vue'
import { useField } from 'vee-validate'
import { resolveComponent } from 'vue'
import getPrefixName from '#dd/utils/getPrefixName'

export default defineNuxtComponent({
  name: 'FormToggle',
  inheritAttrs: false,
  props: {
    /**
     * Required name for the toggle input. Used for forms and vee-validate binding.
     */
    name: {
      type: String,
      required: true
    },
    /**
     * The value associated with the toggle when active.
     */
    value: {
      type: [Boolean, String, Number],
      default: true
    },
    /**
     * Optional initial value for the field.
     */
    modelValue: {
      type: [Boolean, String, Number, Array],
      default: undefined
    }
  },
  setup(props, { attrs, slots }) {
    const ToggleComponent = resolveComponent(
      getPrefixName('Toggle', { type: 'component' })
    )

    const { checked, handleChange } = useField(() => props.name, undefined, {
      type: 'checkbox', // Toggle behaves like a checkbox under the hood
      checkedValue: props.value,
      uncheckedValue: false,
      initialValue: props.modelValue,
      syncVModel: true
    })

    // Toggles typically don't show inline text errors, but we provide state capability
    // in case the design system adds error borders to toggles in the future.

    return () => {
      // Toggle handles arrays similarly to checkbox if used in a group
      const currentModelValue =
        checked?.value !== undefined ? checked.value : props.modelValue

      return h(
        ToggleComponent as any,
        {
          ...attrs,
          name: props.name,
          value: props.value,
          modelValue: currentModelValue,
          'onUpdate:modelValue': handleChange
        },
        slots
      )
    }
  }
})
