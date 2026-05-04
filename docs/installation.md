# Installation and Configuration

`daredash` is a Nuxt-first UI library module. It handles component registration, design token processing, global reset styles, and a Studio route for token inspection.

## 1. Install the module

```bash
pnpm add daredash
```

You can also use a local module path while developing inside a monorepo.

## 2. Configure `nuxt.config.ts`

Add `daredash` to the Nuxt `modules` array.

```ts
export default defineNuxtConfig({
  modules: [
    [
      'daredash',
      {
        prefix: 'dd',
        debug: false
      }
    ]
  ]
})
```

### Available module options

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `tokens` | `string` | `./runtime/assets/styles/tokens/default-theme` | Path to a JSON token file or a directory of token files. |
| `prefix` | `string` | `'dd'` | Prefix used for registered components and generated CSS variables. |
| `debug` | `boolean` | `false` | Enables internal build-time debug logs. |

### Example with custom tokens

```ts
export default defineNuxtConfig({
  modules: [
    [
      'daredash',
      {
        tokens: './tokens',
        prefix: 'dd'
      }
    ]
  ]
})
```

If you change `prefix`, restart the Nuxt dev server so component registration and CSS variable generation are rebuilt correctly.

## 3. Token files

The module accepts either:

- a single `.json` token file;
- or a directory containing multiple `.json` token files.

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

If you point `tokens` to a directory, the module recursively reads all `.json` files and merges them.

## 4. What the module adds to your app

When enabled, `daredash`:

- auto-registers all library components;
- injects the global `reset.css`;
- processes tokens into CSS custom properties;
- registers the internal `/studio` route;
- adds a Nuxt DevTools tab for the Studio;
- auto-imports runtime composables from `runtime/composables`;
- exposes `runtime/public` as Nitro public assets.

## 5. Nuxt dependencies used by the module

The module configures and depends on:

- `@nuxt/fonts`
- `@nuxt/icon`
- `@vee-validate/nuxt`

## 6. Fonts

`daredash` uses `@nuxt/fonts` for font handling.

In practice, your app can keep using Nuxt font configuration as usual. Token-driven typography can be layered on top of that.

## 7. Global styles

You do not need to manually import the library reset in `app.vue`.

The module injects:

- the design token output;
- the global reset stylesheet.

This gives all components a consistent baseline without extra setup in the consuming app.

## 8. Icon configuration

The library uses `@nuxt/icon` and reads icon names from `appConfig.daredash.icons`.

Common documented keys include:

- `success`
- `error`
- `warning`
- `info`
- `toastClose`
- `selectArrow`
- `modalClose`

Additional runtime keys are also used by some components, so keep icon naming centralized in `app.config.ts` when you customize the library.

Example:

```ts
export default defineAppConfig({
  daredash: {
    icons: {
      modalClose: 'mdi:close',
      selectArrow: 'mdi:chevron-down'
    }
  }
})
```
