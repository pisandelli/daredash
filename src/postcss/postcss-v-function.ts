import { resolveTokenValue } from '../utils/tokens'

/**
 * PostCSS plugin that transforms the `v()` helper into a proper CSS custom
 * property reference, respecting the configured module prefix and optionally
 * providing an auto-generated fallback value from the design tokens.
 *
 * This is the PostCSS equivalent of the old Stylus `createVFunction`.
 *
 * ### Usage in CSS files
 * ```css
 * .button {
 *   color: v('button.base-color');
 * }
 * ```
 *
 * ### Output (with prefix `dd` and fallback from tokens)
 * ```css
 * .button {
 *   color: var(--dd-button-base-color, #3b82f6);
 * }
 * ```
 *
 * @param prefix  - The configured module prefix (e.g. `'dd'`, `'acme'`).
 * @param tokens  - The flattened design tokens object for fallback resolution.
 * @returns A PostCSS plugin instance.
 */
export function createPostCSSVPlugin(prefix: string, tokens?: any) {
  return {
    postcssPlugin: 'postcss-v-function',

    Declaration(decl: { value: string }) {
      if (!decl.value.includes('v(')) return

      decl.value = decl.value.replace(/v\('([^']+)'\)/g, (_, path: string) => {
        // Convert dot-notation path to CSS variable name
        const varName = `--${prefix}-${path.replace(/\./g, '-')}`

        // Attempt to resolve an automated fallback from the tokens object
        const fallback = tokens ? resolveTokenValue(tokens, path) : null

        return fallback ? `var(${varName}, ${fallback})` : `var(${varName})`
      })
    }
  }
}

createPostCSSVPlugin.postcss = true
