import {
  defineNuxtModule,
  createResolver,
  addImportsDir,
  extendPages
} from '@nuxt/kit'
import type { Nuxt } from '@nuxt/schema'
import { type ModuleOptions } from './src/types'
import { debugLog } from './src/utils'
import { setupTokens } from './src/builder/tokens'
import { setupComponents } from './src/builder/components'
import { addCustomTab } from '@nuxt/devtools-kit'

const moduleTokensPath =
  './runtime/assets/styles/tokens/default-theme'

interface PublicAssetConfig {
  dir: string
  maxAge: number
}

interface NitroPublicAssetsConfig {
  publicAssets?: PublicAssetConfig[]
}

export default defineNuxtModule<ModuleOptions>().with({
  meta: {
    name: 'daredash',
    configKey: 'daredash',
    compatibility: {
      nuxt: '^4.3.0'
    }
  },
  moduleDependencies: {
    '@nuxt/fonts': {
      version: '^0.14.0',
      defaults: {
        processCSSVariables: true
      }
    },
    '@nuxt/icon': {
      version: '^2.2.2'
    },
    '@vee-validate/nuxt': {
      version: '^4.15.1',
      defaults: {
        autoImports: true
      }
    }
  },
  defaults: {
    tokens: moduleTokensPath,
    prefix: 'dd',
    debug: false
  },
  async setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)
    const debugMode = options.debug
    if (debugMode) debugLog('Debug mode is enabled.', 'warn')

    nuxt.options.routeRules ||= {}
    const studioRouteRules = nuxt.options.routeRules['/studio'] || {}
    const studioHeaders = {
      ...(studioRouteRules.headers || {}),
      'X-Frame-Options': 'SAMEORIGIN',
      'Content-Security-Policy': [
        "frame-ancestors 'self'",
        'http://localhost:*',
        'http://127.0.0.1:*',
        'https://localhost:*',
        'https://127.0.0.1:*'
      ].join(' ')
    }

    nuxt.options.routeRules['/studio'] = {
      ...studioRouteRules,
      headers: studioHeaders
    }

    /**
     * Exposes the configured prefix to the Nuxt public runtime config.
     * Required by `getPrefixName` and other runtime utilities.
     * @note Requires a dev server restart when changed.
     */
    nuxt.options.runtimeConfig.public.daredash = {
      prefix: options.prefix || 'dd'
    }

    /**
     * Seeds the default icon map for interactive components (Toast, Modal, Select, etc.).
     * Consumers can override any key via `appConfig.daredash.icons` in their own
     * `app.config.ts`.
     * @see Rule §12 — Iconography (Agnostic Architecture)
     */
    const menuExpandIcon = 'lucide:chevron-right'

    const defaultIcons = {
      success: 'lucide:circle-check',
      error: 'lucide:circle-x',
      warning: 'lucide:triangle-alert',
      info: 'lucide:circle-alert',
      toastClose: 'lucide:x',
      selectArrow: 'lucide:chevron-down',
      breadcrumbSeparator: menuExpandIcon,
      modalClose: 'lucide:x',
      menuCollapse: 'lucide:chevron-left',
      menuExpand: menuExpandIcon,
      search: 'lucide:search',
      loading: 'svg-spinners:ring-resize',
      drawerClose: 'lucide:x',
      tableError: 'lucide:triangle-alert',
      emptyTable: 'lucide:inbox',
      paginationPrev: 'lucide:chevron-left',
      paginationNext: 'lucide:chevron-right'
    }

    const daredashAppConfig = (nuxt.options.appConfig.daredash as Record<string, any>) || {}

    nuxt.options.appConfig.daredash = {
      ...daredashAppConfig,
      icons: {
        ...defaultIcons,
        ...(daredashAppConfig.icons || {})
      }
    }

    /**
     * Parses the design token JSON file, generates CSS custom properties,
     * and creates a typed token list for client-side registration (CSS Typed OM).
     */
    await setupTokens(options, nuxt, resolver)

    /**
     * Registers the PostCSS `v()` plugin, the `@daredash` alias, and all
     * component wrappers (both generated and explicit).
     * @note Must run before the reset CSS is injected so the `v()` PostCSS
     * plugin is already active when Vite processes that file.
     */
    await setupComponents(options, nuxt, resolver)

    /**
     * Injects the global reset stylesheet into the consumer application.
     * The file uses the `v()` function, so it depends on `setupComponents`
     * having already registered the PostCSS plugin.
     */
    const resetCssPath = resolver.resolve('./runtime/assets/styles/reset.css')
    nuxt.options.css.unshift(resetCssPath)
    if (debugMode) debugLog(`Global reset injected from ${resetCssPath}`)

    /**
     * Exposes the module's `runtime/public` directory as a Nitro public asset,
     * served with a one-year cache header.
     */
    ;(nuxt as Nuxt).hook('nitro:config' as any, async (nitroConfig: NitroPublicAssetsConfig) => {
      nitroConfig.publicAssets ||= []
      nitroConfig.publicAssets.push({
        dir: resolver.resolve('./runtime/public'),
        maxAge: 60 * 60 * 24 * 365
      })
    })

    /**
     * Registers the internal path aliases used by module source files.
     * These are resolved at build time by Vite and TypeScript.
     */
    nuxt.options.alias['#dd/utils'] = resolver.resolve('./runtime/shared/utils')
    nuxt.options.alias['#dd/styles'] = resolver.resolve(
      './runtime/assets/styles/components'
    )
    nuxt.options.alias['#dd/composables'] = resolver.resolve(
      './runtime/composables'
    )
    nuxt.options.alias['#dd/types'] = resolver.resolve('./runtime/shared/types')

    /**
     * Prevents Vite from pre-bundling module files, which would corrupt the
     * PostCSS transform pipeline and break HMR for CSS module changes.
     */
    nuxt.options.vite ||= {}
    nuxt.options.vite.optimizeDeps ||= {}
    nuxt.options.vite.optimizeDeps.exclude ||= []
    nuxt.options.vite.optimizeDeps.exclude.push('@daredash', 'daredash')

    addImportsDir(resolver.resolve('./runtime/composables'))

    /**
     * Registers the DareDash Studio internal route.
     * Serves the token/theme inspector page at `/config` during development.
     */
    extendPages((pages) => {
      pages.push({
        name: 'dd-studio',
        path: '/studio',
        file: resolver.resolve('./runtime/pages/studio.vue'),
        meta: {
          layout: false
        }
      })
    })

    /**
     * Registers a custom tab in Nuxt DevTools pointing to the Studio page.
     * Uses a runtime type cast because `devtools:customTabs` is not part of
     * `NuxtHooks` — it belongs to `@nuxt/devtools`, which is an optional peer
     * and intentionally not declared as a hard dependency of this module.
     */
    addCustomTab({
      name: 'dd-studio',
      title: 'DareDash Studio',
      icon: 'lucide:paintbrush',
      view: {
        type: 'iframe',
        src: '/studio'
      }
    })

    /**
     * HMR for Design Tokens
     * Watches the tokens directory and regenerates CSS/JSON when a file changes.
     */
    const tokensDir = resolver.resolve(options.tokens)
    nuxt.options.watch.push(tokensDir)

    nuxt.hook('builder:watch', async (event, path) => {
      if (path.startsWith(tokensDir) && path.endsWith('.json')) {
        if (debugMode) {
          debugLog(`Token file ${event}: ${path}. Regenerating...`)
        }
        await setupTokens(options, nuxt, resolver)
      }
    })
  }
})
