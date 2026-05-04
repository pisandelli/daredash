import { h, computed, ref } from 'vue'
import { defineNuxtComponent } from 'nuxt/app'
import { useBaseComponent } from '#dd/composables/useBaseComponent'
import styles from '#dd/styles/Avatar.module.css'
import getPrefixName from '#dd/utils/getPrefixName'

export default defineNuxtComponent({
  name: 'Avatar',
  inheritAttrs: false,
  props: {
    /**
     * Source URL for the avatar image.
     */
    src: String,
    /**
     * Alt text for accessibility.
     */
    alt: String
  },
  setup(props, { attrs }) {
    const { processedAttrs } = useBaseComponent(attrs, styles)
    const imgError = ref(false)

    const initials = computed(() => {
      const val = props.alt
      if (!val) return '?'
      const parts = val.trim().split(/\s+/)
      const first = parts[0]
      if (!first) return '?'

      if (parts.length === 1) return first.slice(0, 2).toUpperCase()

      const last = parts[parts.length - 1] || ''
      return (first.charAt(0) + last.charAt(0)).toUpperCase()
    })

    const hasImage = computed(() => props.src && !imgError.value)
    const usesRandomPalette = computed(() => attrs.random !== undefined && attrs.random !== false)

    const onError = () => {
      imgError.value = true
    }

    // Palette colors for random backgrounds (lighter pastel shades)
    const palette = [
      '#fee2e2',
      '#ffedd5',
      '#fef9c3',
      '#dcfce7',
      '#cffafe',
      '#dbeafe',
      '#ede9fe',
      '#fae8ff',
      '#ffe4e6'
    ]

    const backgroundColor = computed(() => {
      if (hasImage.value || !usesRandomPalette.value) return undefined

      // Generate a consistent index based on the initials string
      const str = initials.value || ''
      let hash = 0
      for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash)
      }
      const index = Math.abs(hash) % palette.length
      return palette[index]
    })

    const bgVar = getPrefixName('avatar-background-color', {
      type: 'css-var-decl'
    })
    const colorVar = getPrefixName('avatar-color', { type: 'css-var-decl' })

    return () => {
      return h(
        'div',
        {
          ...processedAttrs.value,
          class: styles.avatar,
          role: 'img',
          'aria-label': props.alt || 'Avatar',
          style: backgroundColor.value
            ? {
                [bgVar]: backgroundColor.value,
                [colorVar]: '#111827'
              }
            : undefined
        },
        [
          // Image or Initials
          hasImage.value
            ? h('img', {
                src: props.src,
                alt: props.alt,
                loading: 'lazy',
                onError
              })
            : h('span', initials.value)
        ]
      )
    }
  }
})
