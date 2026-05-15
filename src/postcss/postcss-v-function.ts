import { resolveTokenValue } from '../utils/tokens'

function replaceVFunctions(
  value: string,
  prefix: string,
  tokens?: any
): string {
  let result = ''
  let cursor = 0

  while (cursor < value.length) {
    const start = value.indexOf("v('", cursor)
    if (start === -1) {
      result += value.slice(cursor)
      break
    }

    result += value.slice(cursor, start)

    let index = start + 3
    const pathStart = index
    const pathEnd = value.indexOf("'", pathStart)

    if (pathEnd === -1) {
      result += value.slice(start)
      break
    }

    const path = value.slice(pathStart, pathEnd)
    index = pathEnd + 1

    while (index < value.length && /\s/.test(value[index]!)) index++

    let explicitFallback: string | null = null

    if (value[index] === ',') {
      index++
      const fallbackStart = index
      let depth = 1

      while (index < value.length) {
        const char = value[index]!

        if (char === '(') depth++
        if (char === ')') {
          depth--
          if (depth === 0) break
        }

        index++
      }

      if (index >= value.length) {
        result += value.slice(start)
        break
      }

      explicitFallback = value.slice(fallbackStart, index).trim()
    } else if (value[index] !== ')') {
      result += value.slice(start)
      break
    }

    if (value[index] !== ')') {
      result += value.slice(start)
      break
    }

    const varName = `--${prefix}-${path.replace(/\./g, '-')}`
    const tokenFallback = tokens ? resolveTokenValue(tokens, path) : null
    const fallback = explicitFallback
      ? replaceVFunctions(explicitFallback, prefix, tokens)
      : tokenFallback

    result += fallback ? `var(${varName}, ${fallback})` : `var(${varName})`
    cursor = index + 1
  }

  return result
}

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

      decl.value = replaceVFunctions(decl.value, prefix, tokens)
    }
  }
}

createPostCSSVPlugin.postcss = true
