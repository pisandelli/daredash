import { h, type VNode } from 'vue'
import { defineNuxtComponent } from 'nuxt/app'
import { useBaseComponent } from '#dd/composables/useBaseComponent'

interface BaseComponentProps {
  /**
   * Specifies the HTML tag to be rendered by the component.
   * @default 'div'
   */
  tag?: string
}

/**
 * Represents an object where keys are arbitrary strings and values are CSS class names.
 * Typically used for CSS modules.
 */
interface StylesObject {
  [key: string]: string
}

/**
 * A higher-order function that creates a generic, stylable Vue component for Nuxt.
 * This factory is designed to reduce boilerplate by generating base components
 * (e.g., Box, Stack, Grid) that share common logic for applying styles, attributes,
 * and rendering a configurable HTML tag.
 *
 * @param {StylesObject} Styles - An object where values are CSS class names to be applied to the root element. Typically from a CSS module import.
 * @param {string} [name] - An optional name for the component, which is useful for debugging with Vue DevTools.
 * @returns {ReturnType<typeof defineNuxtComponent>} A Vue component definition configured for Nuxt.
 */
export default function (Styles: StylesObject, name?: string) {
  return defineNuxtComponent({
    name,
    inheritAttrs: false,
    props: {
      /**
       * The HTML tag to render as the root element of the component.
       */
      tag: {
        type: String,
        default: 'div'
      }
    },
    setup(props: BaseComponentProps, { slots, attrs }): () => VNode {
      const { processedAttrs, classList } = useBaseComponent(attrs, Styles)

      // Returns a render function.
      return () => {
        // Creates a VNode using Vue's `h` function.
        // 1. The tag is determined by the `tag` prop.
        // 2. Attributes are passed through, with `class` being the combined list.
        // 3. The default slot content is rendered as the component's children.
        return h(
          props.tag as string,
          { ...processedAttrs.value, class: classList.value },
          slots
        )
      }
    }
  })
}
