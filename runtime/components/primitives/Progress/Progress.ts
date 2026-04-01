import { defineNuxtComponent } from 'nuxt/app'
import { h, computed, type VNode } from 'vue'
import { useBaseComponent } from '#dd/composables/useBaseComponent'
import styles from '#dd/styles/Progress.module.css'
import getPrefixName from '#dd/utils/getPrefixName'

/**
 * Defines a value-range-to-color mapping for the Progress indicator.
 */
export interface ProgressRange {
  /** Lower bound of the range (inclusive). */
  from: number
  /** Upper bound of the range (inclusive). */
  to: number
  /** Optional CSS color applied when the value falls within this range. */
  color?: string
}

export default defineNuxtComponent({
  name: 'Progress',
  inheritAttrs: false,

  props: {
    /**
     * Current progress value. Must be within [min, max].
     * If not provided, the component renders in indeterminate mode.
     */
    value: {
      type: Number,
      default: undefined
    },
    /**
     * Minimum value of the range. Defaults to `0`.
     */
    min: {
      type: Number,
      default: 0
    },
    /**
     * Maximum value of the range. Defaults to `100`.
     */
    max: {
      type: Number,
      default: 100
    },
    /**
     * Custom CSS color for the indicator. Accepts any valid CSS color string.
     * Takes priority over semantic color variants but is overridden by range colors.
     */
    color: {
      type: String,
      default: undefined
    },
    /**
     * Array of value ranges with optional per-range colors.
     * When the current value falls within a range, its `color` is applied —
     * taking priority over both the `color` prop and semantic variants.
     */
    ranges: {
      type: Array as () => ProgressRange[],
      default: undefined
    },
    /**
     * External label text displayed above the progress track.
     * Can also be provided via the `#label` slot.
     */
    label: {
      type: String,
      default: undefined
    },
    /**
     * Forces indeterminate (looping animation) mode regardless of the `value` prop.
     */
    indeterminate: {
      type: Boolean,
      default: false
    }
  },

  setup(props, { slots, attrs }): () => VNode {
    const { processedAttrs } = useBaseComponent(attrs, styles)

    /** True when the component should render in indeterminate/loading mode. */
    const isIndeterminate = computed(
      () => props.indeterminate || props.value === undefined
    )

    /**
     * Normalized fill percentage clamped to [0, 100].
     * Returns 0 when in indeterminate mode.
     */
    const percentage = computed<number>(() => {
      if (isIndeterminate.value) return 0
      const clamped = Math.min(Math.max(props.value!, props.min), props.max)
      return ((clamped - props.min) / (props.max - props.min)) * 100
    })

    /** Resolves the color from the active range, if any. */
    const activeRangeColor = computed<string | undefined>(() => {
      if (!props.ranges?.length || isIndeterminate.value) return undefined
      const pct = percentage.value
      return props.ranges.find((r) => pct >= r.from && pct <= r.to)?.color
    })

    /**
     * Final resolved color: range color > custom prop color > undefined (CSS handles fallback).
     */
    const resolvedColor = computed(() => activeRangeColor.value ?? props.color)

    /**
     * Inline styles applied to the fill element:
     * - Sets the fill width via `inline-size`.
     * - Optionally overrides the indicator color CSS var when a resolved color is present.
     */
    const fillStyle = computed(() => {
      if (isIndeterminate.value) return undefined

      const s: Record<string, string> = {
        inlineSize: `${percentage.value}%`
      }

      if (resolvedColor.value) {
        s[getPrefixName('progress-indicator-background-color', { type: 'css-var-decl' })] =
          resolvedColor.value
      }

      return s
    })

    return (): VNode => {
      const roundedPct = Math.round(percentage.value)

      // Tooltip slot — provides { percentage } as scoped slot context
      const tooltipContent = slots.tooltip
        ? slots.tooltip({ percentage: roundedPct })
        : [`${roundedPct}%`]

      // Label slot — falls back to label prop text, or omitted entirely
      const labelContent = slots.label?.() ?? (props.label ? [props.label] : null)

      return h(
        'div',
        {
          ...processedAttrs.value,
          class: styles.progress,
          role: 'progressbar',
          'aria-valuenow': isIndeterminate.value ? undefined : roundedPct,
          'aria-valuemin': props.min,
          'aria-valuemax': props.max,
          ...(props.label ? { 'aria-label': props.label } : {}),
          ...(isIndeterminate.value ? { 'data-indeterminate': '' } : {})
        },
        [
          // Optional label above the track
          labelContent ? h('div', { class: styles.label }, labelContent) : null,

          // Visual track (background)
          h('div', { class: styles.track }, [
            // Fill / Indicator
            h(
              'div',
              {
                class: styles.fill,
                style: fillStyle.value
              },
              [
                // Hover tooltip — hidden when indeterminate (no meaningful value)
                !isIndeterminate.value
                  ? h(
                      'span',
                      { class: styles.tooltip, role: 'tooltip' },
                      tooltipContent
                    )
                  : null
              ]
            )
          ])
        ]
      )
    }
  }
})
