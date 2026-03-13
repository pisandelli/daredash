import { computed } from 'vue'
import processAttrs from '#dd/utils/processedAttrs'

/**
 * Represents an object where keys are arbitrary strings and values are CSS class names.
 * Typically used for CSS modules.
 */
interface StylesObject {
  [key: string]: string
}

/**
 * A composable for handling base component logic, primarily attribute processing and class merging.
 *
 * @param attrs - The component attributes (from `setup(props, { attrs })`).
 * @param styles - The CSS modules object containing class mappings.
 * @param componentName - Optional name of the component for debugging/logging.
 *
 * @returns An object containing:
 * - `processedAttrs`: Attributes stripped of boolean modifiers used for styling.
 * - `classList`: A computed array of classes to apply, including boolean modifiers mapped to CSS module classes.
 */
export function useBaseComponent(
  attrs: Record<string, unknown>,
  styles: Record<string, string>,
  componentName?: string
) {
  const processedAttrs = computed(() => processAttrs(attrs))

  const classList = computed(() => {
    let baseClass = ''

    // If a componentName is provided, we try to extract the specific class that matches.
    // CSS Modules often convert CamelCase to camelCase or lowercase.
    if (componentName && Object.keys(styles).length > 0) {
      const lowerName = componentName.toLowerCase()
      // camelCase conversion (e.g. VideoPlayer -> videoPlayer)
      const camelName =
        componentName.charAt(0).toLowerCase() + componentName.slice(1)

      if (styles[camelName]) {
        baseClass = styles[camelName]
      } else if (styles[lowerName]) {
        baseClass = styles[lowerName]
      } else if (styles[componentName]) {
        baseClass = styles[componentName]
      } else {
        // Fallback: If we couldn't match the component name exactly,
        // stringify all classes (original behavior but discouraged)
        baseClass = Object.values(styles).join(' ')
      }
    } else {
      // Legacy behavior if no name is provided (e.g. Button.ts hasn't been updated to pass name yet)
      baseClass = Object.values(styles).join(' ')
    }

    // `attrs.class` contains classes passed by the consumer component
    return [baseClass, attrs.class].filter(Boolean).join(' ')
  })

  return {
    processedAttrs,
    classList
  }
}
