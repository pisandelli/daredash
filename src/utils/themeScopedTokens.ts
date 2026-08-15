import type { TokenNode } from '../types'

type TokenLeafEntry = {
  path: string
  node: TokenNode
  value: string | number | null
}

const RESERVED_KEYS = new Set(['$description', '$type'])

function isPlainObject(value: unknown): value is Record<string, any> {
  return typeof value === 'object' && value !== null
}

function cloneTokenNode(node: TokenNode): TokenNode {
  return JSON.parse(JSON.stringify(node)) as TokenNode
}

function collectLeafTokenEntries(
  node: TokenNode,
  path: string[] = [],
  entries: TokenLeafEntry[] = []
): TokenLeafEntry[] {
  if (!isPlainObject(node)) return entries

  for (const key in node) {
    if (RESERVED_KEYS.has(key)) continue

    const currentValue = node[key]

    if (key === '$value') {
      entries.push({
        path: path.join('.'),
        node: cloneTokenNode(node),
        value:
          typeof currentValue === 'string' || typeof currentValue === 'number'
            ? currentValue
            : null
      })
      continue
    }

    if (isPlainObject(currentValue)) {
      collectLeafTokenEntries(currentValue as TokenNode, [...path, key], entries)
    }
  }

  return entries
}

function extractTokenReferences(value: string | number | null): string[] {
  if (typeof value !== 'string' || !value.includes('{')) return []

  return [...value.matchAll(/{([^}]+)}/g)].map((match) => match[1])
}

function assignTokenPath(
  target: Record<string, any>,
  path: string,
  node: TokenNode
): void {
  const segments = path.split('.')
  let current = target

  for (let index = 0; index < segments.length - 1; index += 1) {
    const segment = segments[index]
    if (!isPlainObject(current[segment])) current[segment] = {}
    current = current[segment]
  }

  current[segments[segments.length - 1]] = cloneTokenNode(node)
}

function dependsOnThemeOverride(
  tokenPath: string,
  referencesByPath: Map<string, string[]>,
  overriddenPaths: Set<string>,
  cache: Map<string, boolean>,
  ancestry: Set<string> = new Set()
): boolean {
  if (cache.has(tokenPath)) return cache.get(tokenPath) ?? false
  if (ancestry.has(tokenPath)) return false

  const references = referencesByPath.get(tokenPath) ?? []
  if (references.length === 0) {
    cache.set(tokenPath, false)
    return false
  }

  const nextAncestry = new Set(ancestry)
  nextAncestry.add(tokenPath)

  for (const referencePath of references) {
    if (overriddenPaths.has(referencePath)) {
      cache.set(tokenPath, true)
      return true
    }

    if (
      referencesByPath.has(referencePath) &&
      dependsOnThemeOverride(
        referencePath,
        referencesByPath,
        overriddenPaths,
        cache,
        nextAncestry
      )
    ) {
      cache.set(tokenPath, true)
      return true
    }
  }

  cache.set(tokenPath, false)
  return false
}

export function buildThemeScopedDependentTokens(
  baseTokens: TokenNode,
  themeTokens: TokenNode
): TokenNode {
  const baseEntries = collectLeafTokenEntries(baseTokens)
  const themeEntries = collectLeafTokenEntries(themeTokens)
  const overriddenPaths = new Set(themeEntries.map((entry) => entry.path))
  const referencesByPath = new Map(
    baseEntries.map((entry) => [entry.path, extractTokenReferences(entry.value)])
  )
  const dependencyCache = new Map<string, boolean>()
  const dependentTree: Record<string, any> = {}

  for (const entry of baseEntries) {
    if (overriddenPaths.has(entry.path)) continue

    if (
      dependsOnThemeOverride(
        entry.path,
        referencesByPath,
        overriddenPaths,
        dependencyCache
      )
    ) {
      assignTokenPath(dependentTree, entry.path, entry.node)
    }
  }

  return dependentTree
}

