import { defineNuxtComponent } from 'nuxt/app'
import { h, computed, useSlots, resolveComponent } from 'vue'
import { useBaseComponent } from '#dd/composables/useBaseComponent'
import styles from '#dd/styles/InputGroup.module.css'
import getPrefixName from '#dd/utils/getPrefixName'

export default defineNuxtComponent({
  name: 'InputGroup',
  inheritAttrs: false,
  props: {
    /**
     * Label text displayed above the group. Same pattern as `Input.label`.
     */
    label: {
      type: String,
      default: undefined
    },
    /**
     * ID used for the `<label for>` association.
     */
    id: {
      type: String,
      default: undefined
    },
    /**
     * Text label for the `pre` addon (sugar for the `#pre` slot).
     */
    pre: {
      type: String,
      default: undefined
    },
    /**
     * Text label for the `post` addon (sugar for the `#post` slot).
     */
    post: {
      type: String,
      default: undefined
    },
    /**
     * Error message shown below the group. Used alongside the `error` attribute.
     */
    errorMessage: {
      type: String,
      default: undefined
    },
    /**
     * Warning message shown below the group. Used alongside the `warning` attribute.
     */
    warningMessage: {
      type: String,
      default: undefined
    }
  },
  setup(props, { attrs }) {
    const { processedAttrs } = useBaseComponent(attrs, styles, 'InputGroup')
    const slots = useSlots()

    const DdCluster = resolveComponent(
      getPrefixName('Cluster', { type: 'component' })
    )
    const DdStack = resolveComponent(
      getPrefixName('Stack', { type: 'component' })
    )

    // State from boolean attrs (same pattern as Input)
    const hasError = computed(
      () => attrs.error !== undefined && attrs.error !== false
    )
    const hasWarning = computed(
      () =>
        !hasError.value &&
        attrs.warning !== undefined &&
        attrs.warning !== false
    )
    const isSuccess = computed(
      () =>
        !hasError.value &&
        !hasWarning.value &&
        attrs.success !== undefined &&
        attrs.success !== false
    )

    const activeMessage = computed(() => {
      if (hasError.value)
        return typeof attrs.error === 'string'
          ? attrs.error
          : props.errorMessage
      if (hasWarning.value)
        return typeof attrs.warning === 'string'
          ? attrs.warning
          : props.warningMessage
      return undefined
    })

    return () => {
      const hasPre = props.pre || !!slots.pre
      const hasPost = props.post || !!slots.post

      // 1. Label (same as Input)
      const labelNode = props.label
        ? h('label', { class: styles.label, for: props.id }, props.label)
        : null

      // 2. Pre addon
      const preNode = hasPre
        ? h(
            'div',
            { class: [styles.addon, styles.addonPre] },
            slots.pre ? slots.pre() : [props.pre]
          )
        : null

      // 3. Default slot (the input/select fields)
      const defaultContent = slots.default?.() ?? []

      // 4. Post addon
      const postNode = hasPost
        ? h(
            'div',
            { class: [styles.addon, styles.addonPost] },
            slots.post ? slots.post() : [props.post]
          )
        : null

      // 5. Visual group box
      const groupBox = h(
        DdCluster as any,
        {
          nowrap: true,
          stretch: true,
          nogap: true,
          class: [
            styles.group,
            hasPre ? styles.hasPre : undefined,
            hasPost ? styles.hasPost : undefined,
            hasError.value ? styles.groupError : undefined,
            hasWarning.value ? styles.groupWarning : undefined,
            isSuccess.value ? styles.groupSuccess : undefined
          ]
        },
        () => [preNode, ...defaultContent, postNode].filter(Boolean)
      )

      // 6. Always-rendered message container (same pattern as Input)
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

      return h(
        DdStack as any,
        { class: [styles.wrapper, processedAttrs.value.class] },
        () => [labelNode, groupBox, messageNode].filter(Boolean)
      )
    }
  }
})
