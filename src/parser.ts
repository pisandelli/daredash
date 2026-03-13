import type { TokenNode, TypedTokenValue } from './types'

/**
 * Recursively parses a token node object and flattens it into two arrays:
 * one for standard CSS variables and one for typed tokens (which require special handling).
 *
 * This function processes token values, automatically resolving internal references
 * (e.g., `{color.primary}`) into their corresponding CSS variable syntax
 * (e.g., `var(--dd-color-primary)`), even when nested within strings like `calc()`.
 *
 * @param {TokenNode} node - The current token node to parse (part of the tokens JSON).
 * @param {string[]} path - The accumulated path to the current node (used to build the CSS variable name).
 * @param {string[]} standardTokens - An array to collect the processed standard CSS variable strings.
 * @param {{ name: string, value: TypedTokenValue }[]} typedTokens - An array to collect tokens that have typed (non-string/number) values.
 * @param {string} prefix - The prefix to use for CSS variables (default: 'dd').
 */
export function parseTokens(
  node: TokenNode,
  path: string[],
  standardTokens: string[],
  typedTokens: { name: string; value: TypedTokenValue }[],
  prefix: string = 'dd'
): void {
  for (const key in node) {
    if (key === '$description' || key === '$type') continue

    const currentValue = node[key]

    if (key === '$value' && currentValue !== undefined) {
      const varName = path.join('-')
      const propertyName = `--${prefix}-${varName}`
      if (typeof currentValue === 'object' && currentValue !== null) {
        typedTokens.push({
          name: propertyName,
          value: currentValue as TypedTokenValue
        })
      } else if (
        typeof currentValue === 'string' ||
        typeof currentValue === 'number'
      ) {
        let value = String(currentValue)

        // Regex to find all reference occurrences, e.g., {color.primary}
        const referenceRegex = /{([^}]+)}/g

        // Replace all found references with their var() syntax
        value = value.replace(referenceRegex, (match, reference) => {
          // 'reference' is the captured group (e.g., "anchorpoint.min")
          const referencePath = reference.replace(/\./g, '-')
          return `var(--${prefix}-${referencePath})`
        })

        standardTokens.push(`  ${propertyName}: ${value};`)
      }
      return
    }

    if (typeof currentValue === 'object' && currentValue !== null) {
      parseTokens(
        currentValue,
        [...path, key],
        standardTokens,
        typedTokens,
        prefix
      )
    }
  }
}
