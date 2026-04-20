import { ref, computed, readonly, type Ref } from 'vue'
import { useRuntimeConfig } from '#app'
import { tokenValue } from '../studio/tokens'
import type { StudioTabDefinition, StudioTokenGroup } from '../studio/types'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type TokenValues = Record<string, string>
export type TokenEditorMode = 'literal' | 'reference'

type TokenModeValues = Record<string, TokenEditorMode>

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

function sanitizeCssValue(value: string): string {
  return value.replace(/[;{}]/g, '').trim()
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
// Composable
// ---------------------------------------------------------------------------

export function useThemeEditor(tabs: StudioTabDefinition[]) {
  const config = useRuntimeConfig()
  const prefix = (config.public.daredash as { prefix: string })?.prefix ?? 'dd'

  /** All fields from every group, keyed by token path */
  const allFields = tabs.flatMap((tab) => tab.fields)

  /** Lookup map for O(1) field retrieval by path */
  const fieldsMap = Object.fromEntries(allFields.map((f) => [f.path, f]))
  const groupMap = new Map<string, StudioTokenGroup>(
    tabs.flatMap((tab) => tab.fields.map((field) => [field.path, tab.tokenGroup]))
  )

  /** Reactive map of { tokenPath → currentLiteralValue } */
  const literalValues: Ref<TokenValues> = ref(
    Object.fromEntries(allFields.map((f) => [f.path, f.defaultValue]))
  )
  const references: Ref<TokenValues> = ref(
    Object.fromEntries(allFields.map((f) => [f.path, f.referencePath ?? '']))
  )
  const modes: Ref<TokenModeValues> = ref(
    Object.fromEntries(
      allFields.map((f) => [f.path, f.referencePath ? 'reference' : 'literal'])
    ) as TokenModeValues
  )

  function normalizeReferencePath(path: string, value: string): string {
    const normalized = value.trim().replace(/^\{|\}$/g, '')
    if (!normalized) return ''

    if (path.startsWith('color.') && !normalized.startsWith('color.')) {
      return `color.${normalized}`
    }

    return normalized
  }

  function defaultModeForPath(path: string): TokenEditorMode {
    return fieldsMap[path]?.referencePath ? 'reference' : 'literal'
  }

  function defaultLiteralValueForPath(path: string): string {
    return fieldsMap[path]?.defaultValue ?? ''
  }

  function defaultReferencePathForPath(path: string): string {
    return fieldsMap[path]?.referencePath ?? ''
  }

  function resolveValue(
    path: string,
    visited = new Set<string>(),
    modeValues: TokenModeValues = modes.value,
    literalValueMap: TokenValues = literalValues.value,
    referenceValueMap: TokenValues = references.value
  ): string {
    if (visited.has(path)) {
      return literalValueMap[path] ?? defaultLiteralValueForPath(path)
    }

    const mode = modeValues[path] ?? defaultModeForPath(path)
    const literalValue = literalValueMap[path] ?? defaultLiteralValueForPath(path)

    if (mode !== 'reference') return literalValue

    const referencePath = normalizeReferencePath(path, referenceValueMap[path] ?? '')
    if (!referencePath) return literalValue

    if (referencePath in fieldsMap) {
      visited.add(path)
      return resolveValue(referencePath, visited, modeValues, literalValueMap, referenceValueMap)
    }

    return tokenValue(referencePath, literalValue)
  }

  const values = computed<TokenValues>(() =>
    Object.fromEntries(allFields.map((field) => [field.path, resolveValue(field.path)]))
  )

  function rawValueForPath(path: string): string {
    const mode = modes.value[path] ?? 'literal'
    if (mode === 'reference') {
      const referencePath = normalizeReferencePath(path, references.value[path] ?? '')
      if (referencePath) return `{${referencePath}}`
    }

    return literalValues.value[path] ?? fieldsMap[path]?.defaultValue ?? ''
  }

  function defaultRawValue(path: string): string {
    const field = fieldsMap[path]
    return field?.rawDefaultValue ?? field?.defaultValue ?? ''
  }

  function isFieldChanged(path: string): boolean {
    const currentMode = modes.value[path] ?? defaultModeForPath(path)
    const initialMode = defaultModeForPath(path)

    if (currentMode !== initialMode) return true

    if (currentMode === 'reference') {
      const currentReference = normalizeReferencePath(path, references.value[path] ?? '')
      const defaultReference = defaultReferencePathForPath(path)
      return currentReference !== defaultReference
    }

    return (literalValues.value[path] ?? '') !== defaultLiteralValueForPath(path)
  }

  const defaultModeValues = Object.fromEntries(
    allFields.map((field) => [field.path, defaultModeForPath(field.path)])
  ) as TokenModeValues
  const defaultLiteralValues = Object.fromEntries(
    allFields.map((field) => [field.path, defaultLiteralValueForPath(field.path)])
  )
  const defaultReferenceValues = Object.fromEntries(
    allFields.map((field) => [field.path, defaultReferencePathForPath(field.path)])
  )

  function defaultResolvedValue(path: string): string {
    return resolveValue(
      path,
      new Set<string>(),
      defaultModeValues,
      defaultLiteralValues,
      defaultReferenceValues
    )
  }

  /** Computed flag — true when any value differs from its default */
  const hasChanges = computed(() => allFields.some((f) => isFieldChanged(f.path)))

  const previewStyle = computed(() => {
    const style: Record<string, string> = {}
    for (const [path, val] of Object.entries(values.value)) {
      const field = fieldsMap[path]
      if (!field || val === defaultResolvedValue(path)) continue
      style[pathToCssVar(path, prefix)] = val
    }
    return style
  })

  const previewCss = computed(() => {
    const declarations = Object.entries(previewStyle.value)
      .map(([name, val]) => `  ${name}: ${sanitizeCssValue(val)};`)
      .join('\n')

    if (!declarations) return ''

    return [
      '.dd-studio-root .dd-studio-preview-scope,',
      '.dd-studio-root .dd-studio-preview-scope * {',
      declarations,
      '}'
    ].join('\n')
  })

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

    for (const path of Object.keys(fieldsMap)) {
      const field = fieldsMap[path]
      if (!field || !isFieldChanged(path)) continue

      const group = groupMap.get(path)
      const rawValue = rawValueForPath(path)

      if (group === 'components') {
        if (!overrides['components']) overrides['components'] = {}
        setNestedValue(overrides['components'] as Record<string, unknown>, path, rawValue)
      } else {
        if (!overrides['primitives']) overrides['primitives'] = {}
        setNestedValue(overrides['primitives'] as Record<string, unknown>, path, rawValue)
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
      literalValues.value[field.path] = field.defaultValue
      references.value[field.path] = field.referencePath ?? ''
      modes.value[field.path] = field.referencePath ? 'reference' : 'literal'
    }
  }

  function setLiteralValue(path: string, value: string): void {
    literalValues.value[path] = value
  }

  function setReferencePath(path: string, value: string): void {
    references.value[path] = normalizeReferencePath(path, value)
  }

  function setMode(path: string, mode: TokenEditorMode): void {
    modes.value[path] = mode
  }

  return {
    values,
    literalValues,
    references,
    modes,
    hasChanges: readonly(hasChanges),
    previewStyle,
    previewCss,
    reset,
    downloadTokens,
    exportTokensJson,
    isFieldChanged,
    setLiteralValue,
    setReferencePath,
    setMode
  }
}
