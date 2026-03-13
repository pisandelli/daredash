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

    const onError = () => {
      imgError.value = true
    }

    // Palette colors for random backgrounds (lighter pastel shades)
    const palette = [
      '#fee2e2', // crimson-100
      '#ffedd5', // orange-100 (approx)
      '#fef9c3', // warning-100 (approx / yellow)
      '#dcfce7', // success-100 (green)
      '#cffafe', // cyan-100
      '#dbeafe', // primary-100 (blue)
      '#ede9fe', // violet-100
      '#fae8ff', // fuchsia-100
      '#ffe4e6' // rose-100
    ]

    const backgroundColor = computed(() => {
      if (hasImage.value) return undefined

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
          style: {
            [bgVar]: backgroundColor.value,
            [colorVar]: backgroundColor.value ? '#111827' : undefined // darker-gray for contrast
          }
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
