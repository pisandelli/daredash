import { resolve } from 'path'
import { mkdir, writeFile, readFile } from 'fs/promises'
import { addComponent } from '@nuxt/kit'
import type { Resolver } from '@nuxt/kit'
import type { Nuxt } from '@nuxt/schema'
import type { ModuleOptions } from '../types'
import { debugLog } from '../utils'
import { resolveTokenPaths } from '../utils/resolveTokenPaths'
import { flattenTokens } from '../utils/tokens'
import { mergeTokenSource } from '../utils/token-merger'
import { createPostCSSVPlugin } from '../postcss/postcss-v-function'
import { components } from '../../components.config'

/**
 * Sets up the component generation logic.
 *
 * This function handles:
 * 1. Registering the `@daredash` alias for module root access.
 * 2. Configuring PostCSS in Vite with the custom `v()` plugin.
 * 3. Iterating through defined components in `components.config.ts`.
 * 4. Generating Vue component wrappers for simple (style-only) components.
 * 5. Registering components with Nuxt using the configured prefix.
 */

export async function setupComponents(
  options: ModuleOptions,
  nuxt: Nuxt,
  resolver: Resolver
) {
  const debugMode = options.debug
  const rawPrefix = options.prefix || 'dd'

  // Component names use TitleCase prefix to match what getPrefixName({ type: 'component' }) generates
  // e.g. prefix 'acme' → 'Acme', prefix 'dd' → 'Dd'
  const prefix = rawPrefix.charAt(0).toUpperCase() + rawPrefix.slice(1)

  // Define alias for the module root
  const moduleRoot = resolver.resolve('.')
  nuxt.options.alias['@daredash'] = moduleRoot

  // Ensure alias is available in Vite (for components) and Nitro (for server)
  nuxt.hook('vite:extendConfig', (config) => {
    if (config.resolve) {
      config.resolve.alias = config.resolve.alias || {}
      ;(config.resolve.alias as any)['@daredash'] = moduleRoot
    }
  })

  nuxt.hook('nitro:config', (config) => {
    config.alias = config.alias || {}
    config.alias['@daredash'] = moduleRoot
  })

  if (debugMode) debugLog(`Registered alias @daredash -> ${moduleRoot}`)

  // Load and flatten tokens for automated CSS fallback resolution
  const tokens: Record<string, any> = {}
  try {
    if (!options.tokens) {
      if (debugMode) debugLog('No tokens file specified for CSS fallbacks.', 'warn')
    } else {
      const { projectPath, modulePath } = resolveTokenPaths(
        nuxt.options.rootDir,
        resolver,
        options.tokens
      )

      let rawTokens
      try {
        rawTokens = await mergeTokenSource(projectPath)
        if (debugMode) debugLog(`Loaded tokens for CSS fallbacks from ${projectPath}`)
      } catch (err: any) {
        if (err.code !== 'ENOENT') throw err
        rawTokens = await mergeTokenSource(modulePath)
        if (debugMode) debugLog(`Loaded tokens for CSS fallbacks from ${modulePath}`)
      }

      Object.assign(tokens, flattenTokens(rawTokens))
    }
  } catch (error) {
    if (debugMode)
      debugLog(`Failed to load tokens for CSS fallbacks: ${error}`, 'warn')
  }

  // Configure PostCSS in Vite to process the v() function in CSS files.
  // PostCSS runs as a Vite plugin (transform hook), so the factory function
  // is never serialized — unlike Stylus preprocessorOptions.
  nuxt.hook('vite:extendConfig', (config) => {
    const vPlugin = createPostCSSVPlugin(options.prefix || 'dd', tokens)

    const existingPostcss = (config.css?.postcss ?? {}) as { plugins?: any[] }
    const plugins = [...(existingPostcss.plugins ?? []), vPlugin]

    Object.assign(config, {
      css: {
        ...config.css,
        postcss: { ...existingPostcss, plugins }
      }
    })

    if (debugMode)
      debugLog(
        `PostCSS v() plugin registered with prefix "${options.prefix || 'dd'}"`
      )
  })

  // Directory to store generated component wrappers (for simple/style-only components)
  const generatedComponentsDir = resolve(
    nuxt.options.buildDir,
    'daredash/components'
  )
  await mkdir(generatedComponentsDir, { recursive: true })

  const generationPromises: Promise<void>[] = []

  for (const [name, config] of Object.entries(components)) {
    const componentName = config.name || name
    const prefixedName = `${prefix}${componentName}`

    // Simple component: has a style file but no custom filePath.
    // We generate a thin wrapper that imports the CSS and uses baseComponent.
    if (config.style && !config.filePath) {
      const stylePath = `@daredash/${config.style.replace(/^\.\//, '')}`
      const baseComponentPath = `@daredash/runtime/shared/utils/baseComponent`

      const componentContent = `import styles from '${stylePath}'
import baseComponent from '${baseComponentPath}'
export default baseComponent(styles, '${componentName}')
`
      const componentPath = resolve(
        generatedComponentsDir,
        `${componentName}.ts`
      )
      generationPromises.push(
        writeFile(componentPath, componentContent, 'utf-8').then(() => {
          if (debugMode) debugLog(`Generated component file: ${componentPath}`)
        })
      )

      addComponent({
        name: prefixedName,
        filePath: componentPath,
        global: true
      })

      if (debugMode) debugLog(`Registered simple component: ${prefixedName}`)
    }

    if (config.filePath) {
      // Complex component: Register existing file directly using alias
      const filePath = `@daredash/${config.filePath.replace(/^\.\//, '')}`

      addComponent({
        name: prefixedName,
        filePath: filePath,
        global: true
      })

      if (debugMode)
        debugLog(`Registered complex component: ${prefixedName} -> ${filePath}`)
    }
  }

  await Promise.all(generationPromises)
}
