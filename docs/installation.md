# Installation and Configuration

This guide is for application developers adopting DareDash in a Nuxt project. Use it to get the module running quickly, understand the available options, and confirm what DareDash adds to your app.

Next step after this guide: [Layout Primitives](./layout.md)

## 1. Install the module

```bash
pnpm add @pisandelli/daredash
```

You can also use a local module path while developing inside a monorepo.

## 2. Register DareDash in `nuxt.config.ts`

Add `@pisandelli/daredash` to the Nuxt `modules` array.

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    [
      '@pisandelli/daredash',
      {
        prefix: 'dd',
        debug: false
      }
    ]
  ]
})
```

## 3. Available module options

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `tokens` | `string` | `./runtime/assets/styles/tokens/default-theme` | Path to a token JSON file or a directory of token files. |
| `prefix` | `string` | `'dd'` | Prefix used for registered components and generated CSS variables. |
| `debug` | `boolean` | `false` | Enables internal build-time debug logs. |

### Example with custom tokens

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    [
      '@pisandelli/daredash',
      {
        tokens: './tokens',
        prefix: 'dd'
      }
    ]
  ]
})
```

If you change `prefix`, restart the Nuxt dev server so component registration and CSS variable generation are rebuilt with the new names.

## 4. Token sources

DareDash accepts either:

- a single `.json` token file
- or a directory containing multiple `.json` token files

Example:

```json
{
  "color": {
    "primary": {
      "$value": {
        "syntax": "<color>",
        "inherits": true,
        "initial-value": "#0090ea"
      }
    },
    "text": {
      "$value": "{color.primary}"
    }
  }
}
```

If you point `tokens` to a directory, the module recursively reads `.json` files and merges them into the final token graph.

## 5. What DareDash adds to your app

When enabled, the module:

- auto-registers all public components
- injects the global reset stylesheet
- processes tokens into CSS custom properties and theme layers
- auto-imports runtime composables
- registers the internal `/studio` route
- adds a Nuxt DevTools tab for Studio
- exposes `runtime/public` as Nitro public assets

You do not need to manually import the reset in `app.vue`.

## 6. Runtime dependencies used by the module

The module configures and depends on:

- `@nuxt/fonts`
- `@nuxt/icon`
- `@vee-validate/nuxt`

This matters mainly so consumers understand why icons, fonts, and validation wrappers are available out of the box.

## 7. Icon configuration

DareDash uses `@nuxt/icon` and reads icon names from `appConfig.daredash.icons`.

Common documented keys include:

- `success`
- `error`
- `warning`
- `info`
- `toastClose`
- `selectArrow`
- `modalClose`
- `menuCollapse`
- `menuExpand`

Additional runtime keys are also used by some components, so keep icon naming centralized in `app.config.ts` when you customize the library.

Example:

```ts
// app.config.ts
export default defineAppConfig({
  daredash: {
    icons: {
      modalClose: 'mdi:close',
      selectArrow: 'mdi:chevron-down',
      menuCollapse: 'mdi:chevron-left',
      menuExpand: 'mdi:chevron-right'
    }
  }
})
```

## 8. Studio

Studio is available at:

- `/studio`
- and as a dedicated Nuxt DevTools tab

Studio is useful for:

- previewing components
- inspecting token-driven behavior
- iterating on theme values
- exporting token overrides

You do not need Studio to use DareDash, but it becomes very valuable once you start customizing the design system.

## 9. First render sanity check

Once the module is installed, this should work without extra component imports:

```vue
<template>
  <dd-stack compact>
    <dd-button primary>Save</dd-button>
    <dd-alert info title="Ready">DareDash is active.</dd-alert>
  </dd-stack>
</template>
```

If the prefix is still `dd`, the component tags and CSS variable names will be generated accordingly.
