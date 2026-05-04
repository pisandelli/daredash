/**
 * A controlled set of custom attributes used across the UI components.
 * These attributes are identified from the project's CSS files.
 * If an attribute is on this list, it will be prefixed with `data-`.
 * Otherwise, it's treated as a standard HTML attribute and passed through as-is.
 */
export const customAttributes = new Set([
  // from Button.vue
  'full',
  'icon-right',
  'outline',
  'ghost',
  'tiny',
  'small',
  'regular',
  'large',
  'xlarge',
  'size',
  'icon-only',
  // from Avatar
  'square',
  'circle',
  'medium',
  'online',
  'offline',
  'busy',
  'away',
  'random',
  'xxs', // New token support
  'nogap',
  // from center.module.css
  'intrinsic',
  // from cluster.module.css
  'start',
  'center',
  'end',
  'between',
  'around',
  'evenly',
  'align-start',
  'align-center',
  'align-end',
  'baseline',
  'narrow',
  'wide',
  'nowrap',
  'stretch',
  'fill',
  // from stack.module.css
  'recursive',
  'compact',
  'spaced',
  'reverse',
  // from Card.vue
  'noborder',
  'flat',
  // default colors
  'primary',
  'accent',
  'success',
  'warning',
  'danger',
  'error',
  'info',
  // generic variants
  'solid',
  'right',
  'top-right',
  'top-left',
  'bottom-right',
  'bottom-left',
  // pagination variants & states
  'simple',
  // table states
  'striped',
  'striped-odd',
  // from Progress.module.css
  'indeterminate'
])

/**
 * Processes an attributes object. If an attribute is in the `customAttributes` list,
 * it gets prefixed with `data-`. Otherwise, it is passed through as a standard attribute.
 * Attributes already starting with `data-` are also passed through.
 *
 * @param attrs - An object of attributes to be processed.
 * @returns A new object of processed attributes.
 */
export default (attrs: Record<string, unknown>): Record<string, unknown> => {
  const newAttrs: Record<string, unknown> = {}
  for (const key in attrs) {
    if (Object.prototype.hasOwnProperty.call(attrs, key)) {
      // If the value is strictly false, we skip it entirely.
      // This prevents [data-attr="false"] which would still match CSS [data-attr].
      if (attrs[key] === false) {
        continue
      }

      // Strip native Vue fallthrough attributes from the generated object
      // so they don't double-bind when developers use `v-bind="processedAttrs"`
      if (key === 'class' || key === 'style') {
        continue
      }

      if (customAttributes.has(key) && !key.startsWith('data-')) {
        newAttrs[`data-${key}`] = attrs[key]
      } else {
        newAttrs[key] = attrs[key]
      }
    }
  }
  return newAttrs
}
