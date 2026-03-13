/**
 * Resolves a dot-notation token path in the flattened tokens object,
 * returning the raw `$value` if found.
 *
 * References like `{color.primary}` within a value are resolved recursively.
 *
 * @param tokens - The flattened tokens object (top-level groups merged).
 * @param path   - Dot-notation path, e.g. `'button.border-radius'`.
 * @returns The resolved string value, or `null` if not found.
 */
export function resolveTokenValue(tokens: any, path: string): string | null {
  if (!tokens || !path) return null

  const parts = path.split('.')
  let current = tokens

  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part]
    } else {
      return null
    }
  }

  if (current && typeof current === 'object' && '$value' in current) {
    let value = current['$value']

    // Resolve Design Token references like {color.primary}
    if (typeof value === 'string' && value.includes('{')) {
      value = value.replace(/{([^}]+)}/g, (_, refPath: string) => {
        const refValue = resolveTokenValue(tokens, refPath)
        return refValue || `var(--dd-${refPath.replace(/\./g, '-')})`
      })
    }

    return String(value)
  }

  return null
}

/**
 * Flattens a structured tokens JSON object (with top-level group keys like
 * `primitives`, `components`, etc.) into a single flat record where each
 * group's children are merged to the root level.
 *
 * This mirrors the behaviour of the token generator that creates CSS variables.
 *
 * @param rawTokens - The raw parsed tokens JSON.
 * @returns A flat record with all token groups merged.
 */
export function flattenTokens(
  rawTokens: Record<string, any>
): Record<string, any> {
  const flat: Record<string, any> = {}

  for (const key of Object.keys(rawTokens)) {
    if (key === '$description' || key === '$type' || key === 'themes') continue

    const section = rawTokens[key]
    if (typeof section === 'object' && section !== null) {
      Object.assign(flat, section)
    }
  }

  return flat
}
