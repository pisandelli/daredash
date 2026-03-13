import { resolve } from 'path'
import { readFile, writeFile } from 'fs/promises'
import { addTemplate, addPlugin } from '@nuxt/kit'
import type { Resolver } from '@nuxt/kit'
import type { Nuxt } from '@nuxt/schema'
import type { ModuleOptions, TokensFile, TypedTokenValue } from '../types'
import { debugLog } from '../utils'
import { parseTokens } from '../parser'

export async function setupTokens(
  options: ModuleOptions,
  nuxt: Nuxt,
  resolver: Resolver
) {
  const standardTokens: string[] = []
  const typedTokens: { name: string; value: TypedTokenValue }[] = []
  let tokens: TokensFile
  const debugMode = options.debug

  let filePath = ''
  try {
    let fileContent: string
    if (!options.tokens) {
      if (debugMode) debugLog('No tokens file specified.', 'warn')
      return
    }

    const projectPath = resolve(
      nuxt.options.rootDir,
      'app/assets/styles/tokens',
      options.tokens
    )
    const modulePath = resolver.resolve(options.tokens)

    try {
      filePath = projectPath
      if (debugMode)
        debugLog(`Attempting to load tokens from project path: ${filePath}`)
      fileContent = await readFile(filePath, 'utf-8')
      if (debugMode) debugLog(`Successfully loaded tokens from project path.`)
    } catch (projectError: any) {
      if (projectError.code !== 'ENOENT') {
        throw projectError
      }

      if (debugMode)
        debugLog(`Tokens not found in project, trying module path.`)
      filePath = modulePath
      if (debugMode)
        debugLog(`Attempting to load tokens from module path: ${filePath}`)
      fileContent = await readFile(filePath, 'utf-8')
      if (debugMode) debugLog(`Successfully loaded tokens from module path.`)
    }

    const loadedTokens = JSON.parse(fileContent)
    tokens = loadedTokens.default || loadedTokens
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
      getContents: () => cssContent
    })
    nuxt.options.css.unshift(template.dst)
    if (debugMode) {
      debugLog(`Injected CSS template at ${template.dst}`)
    }
  } else {
    if (debugMode) {
      debugLog('No standard tokens found to generate CSS file.', 'warn')
    }
  }

  if (typedTokens.length > 0) {
    const jsonPath = resolve(nuxt.options.buildDir, 'design-tokens.json')
    await writeFile(jsonPath, JSON.stringify(typedTokens), 'utf-8')
    if (debugMode) debugLog(`Typed tokens JSON generated at ${jsonPath}`)
    addPlugin(resolver.resolve('./src/typedTokens.client.ts'))
    if (debugMode) debugLog(`typedTokens Plugin added to Nuxt.`)
  } else {
    if (debugMode)
      debugLog('No typed tokens found to generate JSON file.', 'warn')
  }
}
