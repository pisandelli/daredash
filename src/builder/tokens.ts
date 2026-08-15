import { resolve, dirname } from 'path'
import { readFile, writeFile, mkdir } from 'fs/promises'
import { addTemplate, addPlugin } from '@nuxt/kit'
import type { Resolver } from '@nuxt/kit'
import type { Nuxt } from '@nuxt/schema'
import type { ModuleOptions, TokensFile, TypedTokenValue } from '../types'
import { debugLog } from '../utils'
import { parseTokens } from '../parser'
import { loadResolvedTokens } from '../utils/loadResolvedTokens'
import { flattenTokens } from '../utils/tokens'
import { buildThemeScopedDependentTokens } from '../utils/themeScopedTokens'

export async function setupTokens(
  options: ModuleOptions,
  nuxt: Nuxt,
  resolver: Resolver,
  defaultTokensPath: string
) {
  const standardTokens: string[] = []
  const typedTokens: { name: string; value: TypedTokenValue }[] = []
  let tokens: TokensFile
  const debugMode = options.debug
  let flattenedTokens: Record<string, any> = {}

  let filePath = ''
  try {
    const resolvedTokens = await loadResolvedTokens(nuxt, resolver, {
      tokenOption: options.tokens,
      defaultTokensPath,
      debug: debugMode
    })
    filePath = resolvedTokens.sourcePath
    tokens = resolvedTokens.tokens as TokensFile
    flattenedTokens = flattenTokens(tokens)
    if (debugMode && resolvedTokens.mergedWithDefaults) {
      debugLog(`Merged custom tokens over default theme tokens.`)
    }
  } catch (error) {
    debugLog(
      `Failed to load tokens. Last attempted path: '${filePath}'`,
      'error'
    )
    return
  }

  let cssContent = ''

  // 1. Process Global/Standard Tokens (Everything EXCEPT 'themes')
  for (const topLevelKey in tokens) {
    if (topLevelKey === 'themes') continue

    const tokenNode = tokens[topLevelKey]
    if (!tokenNode) continue

    parseTokens(
      tokenNode,
      [],
      standardTokens,
      typedTokens,
      options.prefix || 'dd'
    )
  }

  if (standardTokens.length > 0) {
    cssContent += `:root {\n${standardTokens.join('\n')}\n}\n\n`
  }

  // 2. Process 'themes' (e.g. [data-theme="dark"])
  if (tokens.themes) {
    for (const themeName in tokens.themes) {
      if (themeName === '$description' || themeName === '$type') continue

      const themeTokens: string[] = []
      // We parse into a temporary array 'themeTokens' to isolate this theme's CSS vars
      parseTokens(
        tokens.themes[themeName],
        [],
        themeTokens,
        typedTokens, // Typed tokens still go to the global list (or could be separated if needed)
        options.prefix || 'dd'
      )

      const dependentThemeTokens = buildThemeScopedDependentTokens(
        flattenedTokens,
        tokens.themes[themeName]
      )

      parseTokens(
        dependentThemeTokens,
        [],
        themeTokens,
        typedTokens,
        options.prefix || 'dd'
      )

      if (themeTokens.length > 0) {
        // Create a selector. If it's 'light', we might want it as default too,
        // but for strict theming we usually do [data-theme="light"]
        cssContent += `[data-theme="${themeName}"] {\n${themeTokens.join(
          '\n'
        )}\n}\n\n`
      }
    }
  }

  if (cssContent.length > 0) {
    const template = addTemplate({
      filename: 'styles/main.css',
      getContents: () => cssContent,
      write: true
    })

    // Only add to CSS array if not already present to avoid duplicates during HMR
    if (!nuxt.options.css.includes(template.dst)) {
      nuxt.options.css.unshift(template.dst)
    }

    if (debugMode) {
      debugLog(`Virtual global CSS Custom Properties registered`)
    }
  } else {
    if (debugMode) {
      debugLog('No standard tokens found to generate CSS file.', 'warn')
    }
  }

  const jsonPath = resolve(nuxt.options.buildDir, 'design-tokens.json')
  await mkdir(dirname(jsonPath), { recursive: true })
  if (typedTokens.length > 0) {
    await writeFile(jsonPath, JSON.stringify(typedTokens), 'utf-8')
    if (debugMode) debugLog(`Typed tokens JSON generated at ${jsonPath}`)
  } else {
    await writeFile(jsonPath, JSON.stringify([]), 'utf-8')
    if (debugMode)
      debugLog('No typed tokens found. Generated empty JSON file.', 'warn')
  }

  addPlugin(resolver.resolve('./runtime/typedTokens.client'))
  if (debugMode) debugLog(`typedTokens Plugin added to Nuxt.`)
}
