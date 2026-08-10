import { ref, computed, readonly, type Ref } from 'vue'
import { useRuntimeConfig } from '#app'
import { tokenValue, tokenReference, rawTokenValue } from '../studio/tokens'
import type { StudioTabDefinition, StudioTokenGroup, StudioFieldDefinition } from '../studio/types'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type TokenValues = Record<string, string>
export type TokenEditorMode = 'literal' | 'reference'

type TokenModeValues = Record<string, TokenEditorMode>

const REFERENCE_SENTINEL = '__DDA_REFERENCE__'

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

function extractReferenceTemplate(rawValue?: string): string | undefined {
  if (typeof rawValue !== 'string') return undefined

  const matches = [...rawValue.matchAll(/{([^}]+)}/g)]
  if (matches.length !== 1) return undefined

  const match = matches[0]
  if (!match) return undefined

  return `${rawValue.slice(0, match.index)}{${REFERENCE_SENTINEL}}${rawValue.slice((match.index ?? 0) + match[0].length)}`
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
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      throw new Error('Prototype pollution detected')
    }
    if (typeof cursor[key] !== 'object' || cursor[key] === null) {
      cursor[key] = {}
    }
    cursor = cursor[key] as Record<string, unknown>
  }

  const leaf = keys[keys.length - 1]!
  if (leaf === '__proto__' || leaf === 'constructor' || leaf === 'prototype') {
    throw new Error('Prototype pollution detected')
  }
  if (typeof cursor[leaf] !== 'object' || cursor[leaf] === null) {
    cursor[leaf] = {}
  }
  ;(cursor[leaf] as Record<string, unknown>)['$value'] = value
}

// ---------------------------------------------------------------------------
// Editor Helpers
// ---------------------------------------------------------------------------

function normalizeReferencePath(path: string, value: string): string {
  const normalized = value.trim().replace(/^\{|\}$/g, '')
  if (!normalized) return ''

  if (path.startsWith('color.') && !normalized.startsWith('color.')) {
    return `color.${normalized}`
  }

  return normalized
}

function defaultModeForPath(fieldsMap: Record<string, StudioFieldDefinition>, path: string): TokenEditorMode {
  return fieldsMap[path]?.referencePath ? 'reference' : 'literal'
}

function defaultLiteralValueForPath(fieldsMap: Record<string, StudioFieldDefinition>, path: string): string {
  return fieldsMap[path]?.defaultValue ?? ''
}

function defaultReferencePathForPath(fieldsMap: Record<string, StudioFieldDefinition>, path: string): string {
  return fieldsMap[path]?.referencePath ?? ''
}

function referenceTemplateForPath(fieldsMap: Record<string, StudioFieldDefinition>, path: string): string | undefined {
  return extractReferenceTemplate(fieldsMap[path]?.rawDefaultValue)
}

function applyReferenceTemplate(template: string | undefined, referenceValue: string): string {
  if (!template) return referenceValue
  return template.replace(`{${REFERENCE_SENTINEL}}`, referenceValue)
}

function resolveValue(
  fieldsMap: Record<string, StudioFieldDefinition>,
  path: string,
  visited: Set<string>,
  modeValues: TokenModeValues,
  literalValueMap: TokenValues,
  referenceValueMap: TokenValues
): string {
  if (visited.has(path)) {
    return literalValueMap[path] ?? defaultLiteralValueForPath(fieldsMap, path)
  }

  const mode = modeValues[path] ?? defaultModeForPath(fieldsMap, path)
  const literalValue = literalValueMap[path] ?? defaultLiteralValueForPath(fieldsMap, path)

  if (mode !== 'reference') return literalValue

  const referencePath = normalizeReferencePath(path, referenceValueMap[path] ?? '')
  if (!referencePath) return literalValue

  const referenceTemplate = referenceTemplateForPath(fieldsMap, path)
  let resolvedReferenceValue: string

  if (referencePath in fieldsMap) {
    visited.add(path)
    resolvedReferenceValue = resolveValue(
      fieldsMap,
      referencePath,
      visited,
      modeValues,
      literalValueMap,
      referenceValueMap
    )
  } else {
    resolvedReferenceValue = tokenValue(referencePath, literalValue)
  }

  return applyReferenceTemplate(referenceTemplate, resolvedReferenceValue)
}

function rawValueForPath(
  fieldsMap: Record<string, StudioFieldDefinition>,
  path: string,
  modeValues: TokenModeValues,
  literalValueMap: TokenValues,
  referenceValueMap: TokenValues
): string {
  const mode = modeValues[path] ?? 'literal'
  if (mode === 'reference') {
    const referencePath = normalizeReferencePath(path, referenceValueMap[path] ?? '')
    if (referencePath) {
      return applyReferenceTemplate(referenceTemplateForPath(fieldsMap, path), `{${referencePath}}`)
    }
  }

  return literalValueMap[path] ?? fieldsMap[path]?.defaultValue ?? ''
}

function isFieldChanged(
  path: string,
  modeValues: TokenModeValues,
  literalValueMap: TokenValues,
  referenceValueMap: TokenValues,
  defaultModeValues: TokenModeValues,
  defaultLiteralValues: TokenValues,
  defaultReferenceValues: TokenValues
): boolean {
  const currentMode = modeValues[path] ?? defaultModeValues[path]
  const initialMode = defaultModeValues[path]

  if (currentMode !== initialMode) return true

  if (currentMode === 'reference') {
    const currentReference = normalizeReferencePath(path, referenceValueMap[path] ?? '')
    const defaultReference = defaultReferenceValues[path] ?? ''
    return currentReference !== defaultReference
  }

  return (literalValueMap[path] ?? '') !== (defaultLiteralValues[path] ?? '')
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
  const fieldsMap: Record<string, StudioFieldDefinition> = Object.fromEntries(allFields.map((f) => [f.path, f]))
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

  const defaultModeValues = Object.fromEntries(
    allFields.map((field) => [field.path, defaultModeForPath(fieldsMap, field.path)])
  ) as TokenModeValues

  const defaultLiteralValues = Object.fromEntries(
    allFields.map((field) => [field.path, defaultLiteralValueForPath(fieldsMap, field.path)])
  )

  const defaultReferenceValues = Object.fromEntries(
    allFields.map((field) => [field.path, defaultReferencePathForPath(fieldsMap, field.path)])
  )

  const values = computed<TokenValues>(() =>
    Object.fromEntries(allFields.map((field) => [
      field.path,
      resolveValue(fieldsMap, field.path, new Set<string>(), modes.value, literalValues.value, references.value)
    ]))
  )

  function publicRawValueForPath(path: string): string {
    return rawValueForPath(fieldsMap, path, modes.value, literalValues.value, references.value)
  }

  function publicHasReferenceTemplate(path: string): boolean {
    return Boolean(referenceTemplateForPath(fieldsMap, path))
  }

  function publicIsFieldChanged(path: string): boolean {
    return isFieldChanged(
      path,
      modes.value,
      literalValues.value,
      references.value,
      defaultModeValues,
      defaultLiteralValues,
      defaultReferenceValues
    )
  }

  const activeThemeId = ref('default')

  type ThemeState = {
    literals: TokenValues
    references: TokenValues
    modes: TokenModeValues
    defaultLiterals: TokenValues
    defaultReferences: TokenValues
    defaultModes: TokenModeValues
  }

  const themeStates = reactive<Record<string, ThemeState>>({})

  function defaultResolvedValue(path: string): string {
    return resolveValue(
      fieldsMap,
      path,
      new Set<string>(),
      defaultModeValues,
      defaultLiteralValues,
      defaultReferenceValues
    )
  }

  /** Computed flag — true when any value differs from its default in any theme */
  const hasChanges = computed(() => {
    if (allFields.some((f) => publicIsFieldChanged(f.path))) return true

    for (const [themeId, state] of Object.entries(themeStates)) {
      if (themeId === activeThemeId.value) continue
      if (allFields.some((f) => isFieldChanged(
        f.path,
        state.modes,
        state.literals,
        state.references,
        state.defaultModes,
        state.defaultLiterals,
        state.defaultReferences
      ))) {
        return true
      }
    }

    return false
  })

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

    // Save current active theme into themeStates so we have all changes
    themeStates[activeThemeId.value] = {
      literals: { ...literalValues.value },
      references: { ...references.value },
      modes: { ...modes.value },
      defaultLiterals: { ...defaultLiteralValues },
      defaultReferences: { ...defaultReferenceValues },
      defaultModes: { ...defaultModeValues }
    }

    // Iterate through all modified themes
    for (const [themeId, state] of Object.entries(themeStates)) {
      let target = overrides

      if (themeId !== 'default') {
        if (!overrides['themes']) overrides['themes'] = {}
        if (!(overrides['themes'] as Record<string, any>)[themeId]) {
          (overrides['themes'] as Record<string, any>)[themeId] = {}
        }
        target = (overrides['themes'] as Record<string, any>)[themeId]
      }

      for (const path of Object.keys(fieldsMap)) {
        const field = fieldsMap[path]
        
        // Determine if this specific field has changed for this theme
        const isChanged = isFieldChanged(
          path,
          state.modes,
          state.literals,
          state.references,
          state.defaultModes,
          state.defaultLiterals,
          state.defaultReferences
        )

        if (!field || !isChanged) continue

        const group = groupMap.get(path)
        const rawValue = rawValueForPath(fieldsMap, path, state.modes, state.literals, state.references)

        if (themeId === 'default') {
          // Default theme needs the folder-level namespacing
          if (group === 'components') {
            if (!target['components']) target['components'] = {}
            setNestedValue(target['components'] as Record<string, unknown>, path, rawValue)
          } else {
            if (!target['primitives']) target['primitives'] = {}
            setNestedValue(target['primitives'] as Record<string, unknown>, path, rawValue)
          }
        } else {
          // Specific themes map directly without folder-level namespacing
          setNestedValue(target, path, rawValue)
        }
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
    literalValues.value = {
      ...literalValues.value,
      [path]: value
    }
  }

  function setReferencePath(path: string, value: string): void {
    references.value = {
      ...references.value,
      [path]: normalizeReferencePath(path, value)
    }
  }

  function setReferenceExpression(path: string, value: string): void {
    const normalizedValue = value.trim()
    const template = referenceTemplateForPath(fieldsMap, path)

    if (!template) {
      setLiteralValue(path, value)
      setMode(path, 'literal')
      return
    }

    const matches = [...normalizedValue.matchAll(/{([^}]+)}/g)]
    if (matches.length !== 1) {
      setLiteralValue(path, value)
      setMode(path, 'literal')
      return
    }

    const match = matches[0]
    if (!match) {
      setLiteralValue(path, value)
      setMode(path, 'literal')
      return
    }

    const candidateTemplate = `${normalizedValue.slice(0, match.index)}{${REFERENCE_SENTINEL}}${normalizedValue.slice((match.index ?? 0) + match[0].length)}`
    if (candidateTemplate !== template) {
      setLiteralValue(path, value)
      setMode(path, 'literal')
      return
    }

    references.value[path] = normalizeReferencePath(path, match[1] ?? '')
    modes.value[path] = 'reference'
  }

  function loadTheme(themeId: string): void {
    if (activeThemeId.value) {
      themeStates[activeThemeId.value] = {
        literals: { ...literalValues.value },
        references: { ...references.value },
        modes: { ...modes.value },
        defaultLiterals: { ...defaultLiteralValues },
        defaultReferences: { ...defaultReferenceValues },
        defaultModes: { ...defaultModeValues }
      }
    }

    activeThemeId.value = themeId

    if (themeStates[themeId]) {
      const state = themeStates[themeId]
      Object.assign(defaultLiteralValues, state.defaultLiterals)
      Object.assign(defaultReferenceValues, state.defaultReferences)
      Object.assign(defaultModeValues, state.defaultModes)
      literalValues.value = { ...state.literals }
      references.value = { ...state.references }
      modes.value = { ...state.modes }
      return
    }

    const newLiterals = { ...literalValues.value }
    const newReferences = { ...references.value }
    const newModes = { ...modes.value }

    for (const field of allFields) {
      const refPath = tokenReference(field.path, themeId)
      const val = tokenValue(field.path, undefined, themeId)

      defaultLiteralValues[field.path] = val
      defaultReferenceValues[field.path] = refPath ?? ''
      defaultModeValues[field.path] = refPath ? 'reference' : 'literal'

      newLiterals[field.path] = val
      newReferences[field.path] = refPath ?? ''
      newModes[field.path] = refPath ? 'reference' : 'literal'
    }

    literalValues.value = newLiterals
    references.value = newReferences
    modes.value = newModes
  }

  function setMode(path: string, mode: TokenEditorMode): void {
    modes.value = {
      ...modes.value,
      [path]: mode
    }
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
    loadTheme,
    downloadTokens,
    exportTokensJson,
    isFieldChanged: publicIsFieldChanged,
    rawValueForPath: publicRawValueForPath,
    hasReferenceTemplate: publicHasReferenceTemplate,
    setLiteralValue,
    setReferencePath,
    setReferenceExpression,
    setMode
  }
}
