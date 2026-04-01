import { ref, watch, readonly, type Ref } from 'vue'
import { useRuntimeConfig } from '#app'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type TokenInputType = 'color' | 'text' | 'select'

export interface TokenField {
  /** Dot-notation path in the tokens JSON (e.g. `color.primary.600`) */
  path: string
  /** Human-readable label */
  label: string
  /** Input control type */
  type: TokenInputType
  /** Options list — only used when type === 'select' */
  options?: string[]
  /** Default value shown in the form */
  defaultValue: string
}

export interface TokenGroup {
  id: string
  label: string
  fields: TokenField[]
}

export type TokenValues = Record<string, string>

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Converts a dot-notation token path to a kebab-case CSS var name.
 * e.g. `color.primary.600` → `--dd-color-primary-600`
 */
function pathToCssVar(path: string, prefix: string): string {
  const kebab = path.replaceAll('.', '-')
  return `--${prefix}-${kebab}`
}

/**
 * Sets a deeply nested value in an object using a dot-notation path.
 * Ensures `$value` is set at the leaf node.
 */
function setNestedValue(obj: Record<string, unknown>, path: string, value: string): void {
  const keys = path.split('.')
  let cursor = obj

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]!
    if (typeof cursor[key] !== 'object' || cursor[key] === null) {
      cursor[key] = {}
    }
    cursor = cursor[key] as Record<string, unknown>
  }

  const leaf = keys[keys.length - 1]!
  if (typeof cursor[leaf] !== 'object' || cursor[leaf] === null) {
    cursor[leaf] = {}
  }
  ;(cursor[leaf] as Record<string, unknown>)['$value'] = value
}

// ---------------------------------------------------------------------------
// Token group definitions
// ---------------------------------------------------------------------------

const BASE_TOKENS: TokenField[] = [
  { path: 'color.primary.600', label: 'Primary (600)', type: 'color', defaultValue: '#0984e3' },
  { path: 'color.primary.500', label: 'Primary (500)', type: 'color', defaultValue: '#34a7ff' },
  { path: 'color.success',     label: 'Success',       type: 'color', defaultValue: '#22c55e' },
  { path: 'color.warning',     label: 'Warning',       type: 'color', defaultValue: '#eab308' },
  { path: 'color.info',        label: 'Info',          type: 'color', defaultValue: '#3b82f6' },
  { path: 'color.gray',        label: 'Gray',          type: 'color', defaultValue: '#9ca3af' },
  { path: 'color.light-gray',  label: 'Light Gray',    type: 'color', defaultValue: '#dbe1e6' },
  { path: 'color.darker-gray', label: 'Darker Gray',   type: 'color', defaultValue: '#111827' },
  { path: 'border-radius.base', label: 'Radius Base',  type: 'text',  defaultValue: '0.25rem' },
  { path: 'border-radius.md',   label: 'Radius MD',    type: 'text',  defaultValue: '0.375rem' },
  { path: 'border-radius.lg',   label: 'Radius LG',    type: 'text',  defaultValue: '0.5rem' },
  { path: 'border-radius.full', label: 'Radius Full',  type: 'text',  defaultValue: '9999px' },
  { path: 'font-size.xs', label: 'Font Size XS', type: 'text', defaultValue: 'clamp(0.51rem, 0.46rem + 0.21vw, 0.64rem)' },
  { path: 'font-size.sm', label: 'Font Size SM', type: 'text', defaultValue: 'clamp(0.71rem, 0.67rem + 0.19vw, 0.89rem)' },
  { path: 'font-size.md', label: 'Font Size MD', type: 'text', defaultValue: 'clamp(1rem, 0.94rem + 0.26vw, 1.25rem)' },
]

const BUTTON_TOKENS: TokenField[] = [
  { path: 'button.base-color',            label: 'Base Color',          type: 'color',  defaultValue: '#0984e3' },
  { path: 'button.border-radius',          label: 'Border Radius',       type: 'text',   defaultValue: '0.25rem' },
  { path: 'button.text-transform',         label: 'Text Transform',      type: 'select', options: ['uppercase', 'none', 'capitalize', 'lowercase'], defaultValue: 'uppercase' },
  { path: 'button.sizes.regular.height',   label: 'Height (regular)',     type: 'text',   defaultValue: '2.5rem' },
  { path: 'button.sizes.regular.padding',  label: 'Padding X (regular)', type: 'text',   defaultValue: '1rem' },
  { path: 'button.sizes.small.height',     label: 'Height (small)',       type: 'text',   defaultValue: '2rem' },
  { path: 'button.sizes.large.height',     label: 'Height (large)',       type: 'text',   defaultValue: '3rem' },
  { path: 'button.primary.base-color',     label: 'Primary Color',       type: 'color',  defaultValue: '#0984e3' },
  { path: 'button.success.base-color',     label: 'Success Color',       type: 'color',  defaultValue: '#22c55e' },
  { path: 'button.warning.base-color',     label: 'Warning Color',       type: 'color',  defaultValue: '#eab308' },
  { path: 'button.danger.base-color',      label: 'Danger Color',        type: 'color',  defaultValue: '#ef4444' },
  { path: 'button.info.base-color',        label: 'Info Color',          type: 'color',  defaultValue: '#3b82f6' },
]

const BADGE_TOKENS: TokenField[] = [
  { path: 'badge.base-color',         label: 'Base Color',      type: 'color',  defaultValue: '#9ca3af' },
  { path: 'badge.border-radius',      label: 'Border Radius',   type: 'text',   defaultValue: '0.375rem' },
  { path: 'badge.font-size',          label: 'Font Size',       type: 'text',   defaultValue: 'clamp(0.71rem, 0.67rem + 0.19vw, 0.89rem)' },
  { path: 'badge.font-weight',        label: 'Font Weight',     type: 'text',   defaultValue: '300' },
  { path: 'badge.text-transform',     label: 'Text Transform',  type: 'select', options: ['none', 'uppercase', 'capitalize', 'lowercase'], defaultValue: 'none' },
  { path: 'badge.padding.inline',     label: 'Padding Inline',  type: 'text',   defaultValue: 'clamp(0.71rem, 0.67rem + 0.19vw, 0.89rem)' },
  { path: 'badge.padding.block',      label: 'Padding Block',   type: 'text',   defaultValue: '0.25rem' },
  { path: 'badge.primary.base-color', label: 'Primary Color',   type: 'color',  defaultValue: '#0984e3' },
  { path: 'badge.success.base-color', label: 'Success Color',   type: 'color',  defaultValue: '#22c55e' },
  { path: 'badge.warning.base-color', label: 'Warning Color',   type: 'color',  defaultValue: '#eab308' },
  { path: 'badge.danger.base-color',  label: 'Danger Color',    type: 'color',  defaultValue: '#ef4444' },
  { path: 'badge.info.base-color',    label: 'Info Color',      type: 'color',  defaultValue: '#3b82f6' },
]

export const TOKEN_GROUPS: TokenGroup[] = [
  { id: 'base',   label: 'Base',   fields: BASE_TOKENS   },
  { id: 'button', label: 'Button', fields: BUTTON_TOKENS },
  { id: 'badge',  label: 'Badge',  fields: BADGE_TOKENS  },
]

// ---------------------------------------------------------------------------
// Composable
// ---------------------------------------------------------------------------

export function useThemeEditor() {
  const config = useRuntimeConfig()
  const prefix = (config.public.daredash as { prefix: string })?.prefix ?? 'dd'

  /** All fields from every group, keyed by token path */
  const allFields = TOKEN_GROUPS.flatMap((g) => g.fields)

  /** Lookup map for O(1) field retrieval by path */
  const fieldsMap = Object.fromEntries(allFields.map((f) => [f.path, f]))

  /** Reactive map of { tokenPath → currentValue } */
  const values: Ref<TokenValues> = ref(
    Object.fromEntries(allFields.map((f) => [f.path, f.defaultValue]))
  )

  /** Computed flag — true when any value differs from its default */
  const hasChanges = ref(false)

  // -------------------------------------------------------------------------
  // DOM Injection
  // -------------------------------------------------------------------------

  const STYLE_ID = 'dd-theme-override'

  function buildCss(vals: TokenValues): string {
    const overrides = Object.entries(vals)
      .filter(([path, val]) => {
        const field = fieldsMap[path]
        return field && val !== field.defaultValue
      })
      .map(([path, val]) => `  ${pathToCssVar(path, prefix)}: ${val};`)
      .join('\n')

    if (!overrides) return ''
    return `:root {\n${overrides}\n}`
  }

  function applyOverrides(vals: TokenValues): void {
    if (typeof document === 'undefined') return

    let el = document.getElementById(STYLE_ID) as HTMLStyleElement | null

    const css = buildCss(vals)

    if (!css) {
      el?.remove()
      return
    }

    if (!el) {
      el = document.createElement('style')
      el.id = STYLE_ID
      document.head.appendChild(el)
    }

    el.textContent = css
  }

  // Watch and apply on every change
  watch(
    values,
    (vals) => {
      applyOverrides(vals)
      hasChanges.value = allFields.some((f) => vals[f.path] !== f.defaultValue)
    },
    { deep: true }
  )

  // -------------------------------------------------------------------------
  // Export — generates tokens JSON following the default-theme.tokens.json model
  // -------------------------------------------------------------------------

  /**
   * Builds a tokens JSON snippet containing only the overridden tokens,
   * following the nested `{ "$value": "..." }` structure of the default theme.
   * The result can be merged on top of `default-theme.tokens.json` by the user.
   */
  function exportTokensJson(): string {
    const overrides: Record<string, unknown> = {
      $description: 'Custom theme overrides — generated by DareDash Studio',
    }

    for (const [path, val] of Object.entries(values.value)) {
      const field = fieldsMap[path]
      if (!field || val === field.defaultValue) continue

      // Determine the section: base fields live at root level of the JSON,
      // component fields (button.*, badge.*) belong to `components`.
      const isComponent = path.startsWith('button.') || path.startsWith('badge.')

      if (isComponent) {
        if (!overrides['components']) overrides['components'] = {}
        setNestedValue(overrides['components'] as Record<string, unknown>, path, val)
      } else {
        if (!overrides['primitives']) overrides['primitives'] = {}
        setNestedValue(overrides['primitives'] as Record<string, unknown>, path, val)
      }
    }

    return JSON.stringify(overrides, null, 2)
  }

  async function downloadTokens(): Promise<void> {
    const json = exportTokensJson()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'custom-theme.tokens.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  // -------------------------------------------------------------------------
  // Reset
  // -------------------------------------------------------------------------

  function reset(): void {
    for (const field of allFields) {
      values.value[field.path] = field.defaultValue
    }
    document.getElementById(STYLE_ID)?.remove()
    hasChanges.value = false
  }

  return {
    values,
    hasChanges: readonly(hasChanges),
    groups: TOKEN_GROUPS,
    reset,
    downloadTokens,
    exportTokensJson,
  }
}
