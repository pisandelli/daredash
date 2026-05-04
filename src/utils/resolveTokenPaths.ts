import { resolve } from 'node:path'
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
  const projectPath = resolve(rootDir, 'app/assets/styles/tokens', tokenOption)
  const modulePath = resolver.resolve(tokenOption)

  return { projectPath, modulePath }
}
