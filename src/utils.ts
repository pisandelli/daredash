import { resolve } from 'node:path'
import type { Resolver } from '@nuxt/kit'

// Module label for logging purposes.
export const modLabel = '[DAREDASH] >>>> '

/**
 * Logs debug messages to the console if in development mode.
 * @param {string} message - The message to log.
 * @param {'log'|'warn'|'error'} [type] - The type of log message.
 * @param {any} [data] - Additional data to log.
 */
export function debugLog(
  message: string,
  type: 'log' | 'warn' | 'error' = 'log',
  data?: any
) {
  if (process.env.NODE_ENV === 'development') {
    const logMethod = console[type] || console.log
    logMethod(`${modLabel} ${message}`, data ?? '')
  }
}

/**
 * Resolves the absolute paths for a tokens file, both in the project and in the module.
 * @param {string} rootDir - The root directory of the Nuxt project.
 * @param {Resolver} resolver - The resolver instance from @nuxt/kit.
 * @param {string} tokenOption - The path to the tokens file from options.
 * @returns {{ projectPath: string, modulePath: string }}
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
