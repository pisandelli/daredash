import { defu } from 'defu'
import type { Resolver } from '@nuxt/kit'
import type { Nuxt } from '@nuxt/schema'
import { mergeTokenSource } from './token-merger'
import { resolveTokenPaths } from './resolveTokenPaths'
import { debugLog } from '../utils'

interface LoadResolvedTokensOptions {
  tokenOption?: string
  defaultTokensPath: string
  debug?: boolean
}

async function tryLoadProjectTokens(
  rootDir: string,
  resolver: Resolver,
  tokenOption: string,
  debugMode: boolean
) {
  const { projectPaths, modulePath } = resolveTokenPaths(rootDir, resolver, tokenOption)

  for (const projectPath of projectPaths) {
    try {
      if (debugMode) debugLog(`Attempting to load tokens from project path: ${projectPath}`)
      const tokens = await mergeTokenSource(projectPath)
      if (debugMode) debugLog('Successfully loaded tokens from project path.')
      return { tokens, sourcePath: projectPath }
    } catch (projectError: unknown) {
      if (!(projectError instanceof Error)) throw projectError
      if ((projectError as NodeJS.ErrnoException).code !== 'ENOENT') throw projectError
    }
  }

  if (debugMode) debugLog('Tokens not found in project, trying module path.')
  if (debugMode) debugLog(`Attempting to load tokens from module path: ${modulePath}`)
  const tokens = await mergeTokenSource(modulePath)
  if (debugMode) debugLog('Successfully loaded tokens from module path.')
  return { tokens, sourcePath: modulePath }
}

export async function loadResolvedTokens(
  nuxt: Pick<Nuxt, 'options'>,
  resolver: Resolver,
  options: LoadResolvedTokensOptions
) {
  const debugMode = options.debug || false
  const defaultTokens = await mergeTokenSource(options.defaultTokensPath)

  if (!options.tokenOption || options.tokenOption === options.defaultTokensPath) {
    return {
      tokens: defaultTokens,
      sourcePath: options.defaultTokensPath,
      mergedWithDefaults: false
    }
  }

  const customTokens = await tryLoadProjectTokens(
    nuxt.options.rootDir,
    resolver,
    options.tokenOption,
    debugMode
  )

  return {
    tokens: defu(customTokens.tokens, defaultTokens),
    sourcePath: customTokens.sourcePath,
    mergedWithDefaults: true
  }
}
