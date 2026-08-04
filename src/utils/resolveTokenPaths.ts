import { isAbsolute, resolve } from 'node:path'
import type { Resolver } from '@nuxt/kit'

/**
 * Resolves the absolute paths for a tokens file, both in the project and in the module.
 * This helper is Node-only and should stay out of any runtime/client import path.
 */
export function resolveTokenPaths(
  rootDir: string,
  resolver: Resolver,
  tokenOption: string
) {
  const projectPaths = isAbsolute(tokenOption)
    ? [tokenOption]
    : [
        resolve(rootDir, tokenOption),
        resolve(rootDir, 'app/assets/styles/tokens', tokenOption)
      ]
  const projectPath = projectPaths[0]
  const modulePath = resolver.resolve(tokenOption)

  return {
    projectPath,
    projectPaths: [...new Set(projectPaths)],
    modulePath
  }
}
