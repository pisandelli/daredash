import { useRuntimeConfig } from '#app'

/**
 * Generates a prefixed name based on the type.
 * @param name - The name to prefix.
 * @param options - Options for generation.
 * @returns The prefixed string.
 */
/**
 * Options for generating prefixed names.
 */
interface PrefixOptions {
  /**
   * The type of output to generate.
   * - `css-var`: Returns `var(--prefix-name)`. Default.
   * - `component`: Returns PascalCase name (e.g. `PrefixName`).
   * - `css-var-decl`: Returns the variable name declaration (e.g. `--prefix-name`).
   * - `css-var-name`: Returns the variable name without dashes (e.g. `prefix-name`).
   */
  type?: 'css-var' | 'component' | 'css-var-decl' | 'css-var-name'
  /**
   * Optional fallback value for CSS variables.
   */
  fallback?: string
  /**
   * Optional manual prefix override. If not provided, uses runtime config.
   */
  prefix?: string
}

/**
 * Generates a correctly prefixed string based on the module configuration.
 * Used for dynamic CSS variables and component resolution.
 *
 * @param name - The base name (e.g. 'color-primary', 'Button').
 * @param options - Generation options.
 * @returns The prefixed string.
 */
export default function getPrefixName(
  name: string,
  options: PrefixOptions = {}
): string {
  const config = useRuntimeConfig()
  const prefix = options.prefix || config.public.daredash?.prefix || 'dd'

  if (options.type === 'component') {
    const titlePrefix = prefix.charAt(0).toUpperCase() + prefix.slice(1)
    const titleName = name.charAt(0).toUpperCase() + name.slice(1)
    return `${titlePrefix}${titleName}`
  }

  const variableName = `${prefix}-${name}`
  const variable = `--${variableName}`

  if (options.type === 'css-var-name') {
    return variableName
  }

  if (options.type === 'css-var-decl') {
    return variable
  }

  if (options.fallback) {
    return `var(${variable}, ${options.fallback})`
  }
  return `var(${variable})`
}
