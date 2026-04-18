import primitives from '../assets/styles/tokens/default-theme/primitives.json'
import accordion from '../assets/styles/tokens/default-theme/components/accordion.json'
import button from '../assets/styles/tokens/default-theme/components/button.json'
import badge from '../assets/styles/tokens/default-theme/components/badge.json'
import alert from '../assets/styles/tokens/default-theme/components/alert.json'
import type { StudioFieldDefinition } from './types'

function getTokenNode(tokens: any, path: string): Record<string, any> | null {
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

  return current && typeof current === 'object' ? current : null
}

function resolveTokenValue(tokens: any, path: string): string | null {
  const current = getTokenNode(tokens, path)

  if (current && '$value' in current) {
    let value = current.$value

    if (typeof value === 'string' && value.includes('{')) {
      value = value.replace(/{([^}]+)}/g, (_: string, refPath: string) => {
        const refValue = resolveTokenValue(tokens, refPath)
        return refValue || `var(--dd-${refPath.replace(/\./g, '-')})`
      })
    }

    return String(value)
  }

  return null
}

function flattenTokens(
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

export function tokenReference(path: string): string | undefined {
  const node = getTokenNode(flatTokens, path)
  const rawValue = node?.$value

  if (typeof rawValue !== 'string') return undefined

  const match = rawValue.match(/^\{([^}]+)\}$/)
  return match?.[1]
}

export function rawTokenValue(path: string): string | undefined {
  const node = getTokenNode(flatTokens, path)
  if (node?.$value == null) return undefined
  return String(node.$value)
}

const flatTokens = flattenTokens({
  primitives,
  components: {
    accordion,
    button,
    badge,
    alert
  }
})

const PRIMITIVE_SECTION_META: Record<string, string> = {
  color: 'Color',
  'border-radius': 'Radius',
  space: 'Space',
  'border-width': 'Border Width',
  'z-index': 'Z-Index',
  transition: 'Transition',
  shadow: 'Shadow',
  'max-width': 'Max Width'
}

const TYPOGRAPHY_SECTION_META: Record<string, string> = {
  font: 'Font Family',
  'font-size': 'Font Size',
  'font-weight': 'Font Weight',
  'line-height': 'Line Height',
  'letter-spacing': 'Letter Spacing'
}

const TYPOGRAPHY_SECTIONS = new Set([
  'font',
  'font-size',
  'font-weight',
  'line-height',
  'letter-spacing'
])

function toTitleCase(value: string): string {
  return value
    .split(/[-\s]/g)
    .filter(Boolean)
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(' ')
}

function isTokenLeaf(value: unknown): value is { $value: string | number } {
  return Boolean(value && typeof value === 'object' && '$value' in value)
}

function collectLeafPaths(node: Record<string, any>, prefix = ''): string[] {
  const paths: string[] = []

  for (const [key, value] of Object.entries(node)) {
    if (key.startsWith('$')) continue

    const path = prefix ? `${prefix}.${key}` : key

    if (isTokenLeaf(value)) {
      paths.push(path)
    }

    if (value && typeof value === 'object') {
      paths.push(...collectLeafPaths(value as Record<string, any>, path))
    }
  }

  return paths
}

function fieldTypeForPath(path: string): 'color' | 'text' {
  return path.startsWith('color.') ? 'color' : 'text'
}

function labelForPrimitivePath(path: string): string {
  const parts = path.split('.')
  const section = parts[0]

  if (!section) return toTitleCase(path)

  const sectionLabel = PRIMITIVE_SECTION_META[section] ?? toTitleCase(section)
  const tokenLabel = parts.slice(1).map((part) => toTitleCase(part)).join(' ')

  return tokenLabel ? `${sectionLabel} ${tokenLabel}` : sectionLabel
}

export function tokenValue(path: string, fallback?: string): string {
  const resolved = resolveTokenValue(flatTokens, path)

  if (!resolved) return fallback ?? ''
  if (fallback && resolved.includes('var(--dd-')) return fallback
  return resolved
}

export function primitiveStudioFields(): StudioFieldDefinition[] {
  return collectLeafPaths(primitives)
    .filter((path) => {
      const section = path.split('.')[0]
      return section ? !TYPOGRAPHY_SECTIONS.has(section) : false
    })
    .map((path) => {
      const section = path.split('.')[0] ?? ''
      return {
        path,
        label: labelForPrimitivePath(path),
        type: fieldTypeForPath(path),
        defaultValue: tokenValue(path),
        rawDefaultValue: rawTokenValue(path),
        referencePath: tokenReference(path),
        group: PRIMITIVE_SECTION_META[section] ?? toTitleCase(section)
      }
    })
}

export function typographyStudioFields(): StudioFieldDefinition[] {
  return collectLeafPaths(primitives)
    .filter((path) => {
      const section = path.split('.')[0]
      return section ? TYPOGRAPHY_SECTIONS.has(section) : false
    })
    .map((path) => {
      const section = path.split('.')[0] ?? ''
      return {
        path,
        label: labelForPrimitivePath(path),
        type: 'text',
        defaultValue: tokenValue(path),
        rawDefaultValue: rawTokenValue(path),
        referencePath: tokenReference(path),
        description: section === 'font'
          ? 'Font family changes only render when the browser already has that font available or loaded by the app.'
          : undefined,
        group: TYPOGRAPHY_SECTION_META[section] ?? toTitleCase(section)
      }
    })
}
