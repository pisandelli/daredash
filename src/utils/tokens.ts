/**
 * Resolves a dot-notation token path in the flattened tokens object,
 * returning the raw `$value` if found.
 *
 * References like `{color.primary}` within a value are resolved recursively.
 *
 * @param tokens - The flattened tokens object (top-level groups merged).
 * @param path   - Dot-notation path, e.g. `'button.border-radius'`.
 * @param prefix - CSS variable prefix used for unresolved reference fallbacks.
 * @returns The resolved string value, or `null` if not found.
 */
export type TokenResolutionStatus =
  | 'resolved'
  | 'invalid-path'
  | 'unresolved-reference'
  | 'cyclic-reference'

export interface TokenResolution {
  value: string | null
  rawValue?: string
  references: string[]
  status: TokenResolutionStatus
  cycle?: string[]
}

function tokenNode(tokens: any, path: string): Record<string, any> | null {
  if (!tokens || !path) return null

  let current = tokens
  for (const part of path.split('.')) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part]
    } else {
      return null
    }
  }

  return current && typeof current === 'object' && '$value' in current ? current : null
}

/**
 * Resolves a token and reports the reference chain used to obtain its value.
 * Missing references remain CSS-variable fallbacks so existing runtime
 * behaviour is preserved; cycles are reported rather than recursing forever.
 */
export function resolveToken(
  tokens: any,
  path: string,
  prefix: string = 'dd'
): TokenResolution {
  const resolve = (currentPath: string, stack: string[]): TokenResolution => {
    const node = tokenNode(tokens, currentPath)
    if (!node) return { value: null, references: [], status: 'invalid-path' }

    const rawValue = String(node.$value)
    const references = [...rawValue.matchAll(/{([^}]+)}/g)].map((match) => match[1]!)

    if (stack.includes(currentPath)) {
      const cycleStart = stack.indexOf(currentPath)
      return {
        value: `var(--${prefix}-${currentPath.replace(/\./g, '-')})`,
        rawValue,
        references,
        status: 'cyclic-reference',
        cycle: [...stack.slice(cycleStart), currentPath]
      }
    }

    if (!references.length) {
      return { value: rawValue, rawValue, references, status: 'resolved' }
    }

    let status: TokenResolutionStatus = 'resolved'
    let cycle: string[] | undefined
    const value = rawValue.replace(/{([^}]+)}/g, (_match, refPath: string) => {
      const reference = resolve(refPath, [...stack, currentPath])
      if (reference.status === 'cyclic-reference') {
        status = 'cyclic-reference'
        cycle = reference.cycle
      } else if (reference.status !== 'resolved' && status === 'resolved') {
        status = 'unresolved-reference'
      }

      return reference.value ?? `var(--${prefix}-${refPath.replace(/\./g, '-')})`
    })

    return { value, rawValue, references, status, cycle }
  }

  return resolve(path, [])
}

export function resolveTokenValue(
  tokens: any,
  path: string,
  prefix: string = 'dd'
): string | null {
  return resolveToken(tokens, path, prefix).value
}

/**
 * Resolves a dot-notation token path into a CSS expression that preserves
 * token references as CSS variable links instead of collapsing them to the
 * current flattened literal value.
 *
 * Example:
 * - `button.success.base-color` -> `var(--dd-color-success)`
 * - `contrast-color({color.success})` -> `contrast-color(var(--dd-color-success))`
 *
 * This is important for theme-aware CSS fallbacks, because a compiled literal
 * fallback from the default theme would prevent `[data-theme]` overrides from
 * flowing through semantic aliases.
 */
export function resolveTokenExpression(
  tokens: any,
  path: string,
  prefix: string = 'dd'
): string | null {
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
    const value = current['$value']

    if (typeof value === 'string' && value.includes('{')) {
      return value.replace(/{([^}]+)}/g, (_, refPath: string) => {
        return `var(--${prefix}-${refPath.replace(/\./g, '-')})`
      })
    }

    if (typeof value === 'string' || typeof value === 'number') {
      return String(value)
    }
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
