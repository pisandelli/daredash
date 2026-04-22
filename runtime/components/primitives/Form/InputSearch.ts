import { defineNuxtComponent } from 'nuxt/app'
import { h, computed, resolveComponent } from 'vue'
import { useBaseComponent } from '#dd/composables/useBaseComponent'
import styles from '#dd/styles/InputSearch.module.css'
import { Icon } from '#components'
import { useAppConfig } from '#imports'
import getPrefixName from '#dd/utils/getPrefixName'

export default defineNuxtComponent({
  name: 'InputSearch',
  inheritAttrs: false,
  props: {
    /**
     * Optional name for the search input element.
     */
    name: {
      type: String,
      default: 'search'
    },
    /**
     * Custom ID for the input element.
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
      default: 'Search…'
    },
    /**
     * V-model binding value.
     */
    modelValue: {
      type: String,
      default: undefined
    },
    /**
     * Text label displayed inside the search button. If omitted, only the icon is shown.
     */
    buttonLabel: {
      type: String,
      default: undefined
    },
    /**
     * Icon name (via @nuxt/icon) shown inside the search button.
     * Defaults to `heroicons:magnifying-glass` if not provided.
     */
    buttonIcon: {
      type: String,
      default: undefined
    },
    /**
     * When true, the search button displays a loading spinner instead of the icon.
     */
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue', 'search'],
  setup(props, { attrs, emit }) {
    const { processedAttrs } = useBaseComponent(attrs, styles, 'InputSearch')
    const appConfig = useAppConfig()
    const globalIcons = appConfig.daredash?.icons || {}

    const DdCluster = resolveComponent(
      getPrefixName('Cluster', { type: 'component' })
    )

    const onInput = (event: Event) => {
      const target = event.target as HTMLInputElement
      emit('update:modelValue', target.value)
    }

    const onSearch = () => {
      emit('search', props.modelValue)
    }

    const onKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') onSearch()
    }

    const identifier = computed(() => props.id || props.name)

    // Button color variant via attrs (primary by default, or success/danger/neutral)
    const isDisabled = computed(
      () => attrs.disabled !== undefined && attrs.disabled !== false
    )

    // Button colour variant: read from component attrs and pass as data-* on the button.
    // processAttrs handles the root element; we mirror manually for the inner button.
    const buttonVariant = computed(() => {
      if (attrs.success !== undefined && attrs.success !== false)
        return 'success'
      if (attrs.danger !== undefined && attrs.danger !== false) return 'danger'
      if (attrs.neutral !== undefined && attrs.neutral !== false)
        return 'neutral'
      return 'primary'
    })

    const searchIcon = computed(
      () =>
        props.buttonIcon || globalIcons.search || 'heroicons:magnifying-glass'
    )
    const loadingIcon = computed(
      () => globalIcons.loading || 'svg-spinners:ring-resize'
    )

    return () => {
      // Input element
      const inputNode = h('input', {
        ...processedAttrs.value,
        id: identifier.value,
        name: props.name,
        type: 'search',
        enterkeyhint: 'search',
        class: styles.input,
        placeholder: props.placeholder,
        value: props.modelValue,
        disabled: isDisabled.value || undefined,
        onInput,
        onKeydown
      })

      // Button content: spinner | icon | icon + label | label only
      const buttonContentNodes = props.loading
        ? [h(Icon, { name: loadingIcon.value, class: styles.buttonIcon })]
        : [
            searchIcon.value && !props.buttonLabel
              ? h(Icon, { name: searchIcon.value, class: styles.buttonIcon })
              : null,
            props.buttonIcon && props.buttonLabel
              ? h(Icon, { name: props.buttonIcon, class: styles.buttonIcon })
              : null,
            props.buttonLabel ? h('span', props.buttonLabel) : null
          ].filter(Boolean)

      // Search button
      const buttonNode = h(
        'button',
        {
          type: 'button',
          class: styles.searchButton,
          'data-variant': buttonVariant.value,
          disabled: isDisabled.value || props.loading || undefined,
          'aria-label': props.buttonLabel ?? 'Search',
          onClick: onSearch
        },
        buttonContentNodes
      )

      return h(
        DdCluster as any,
        {
          nowrap: true,
          stretch: true,
          nogap: true,
          class: [styles.group, processedAttrs.value.class]
        },
        () => [inputNode, buttonNode]
      )
    }
  }
})
