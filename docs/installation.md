# Installation and Configuration

`daredash` is a Nuxt module that automates the injection of design tokens and ready-to-use components.

## 1. Installation

Add the `daredash` module to your project.

If you are in a local repository, copy the module folder to your project, or use a package manager to install it if it is published on npm.

```bash
npm install daredash # or yarn, pnpm, bun
```

## 2. Configuring `nuxt.config.ts`

Add `daredash` to the `modules` array in your `nuxt.config.ts` or `nuxt.config.js` file.

```typescript
export default defineNuxtConfig({
  modules: [
    [
      'daredash', // or the local path, e.g., './modules/daredash'
      {
        // Optional: Path to your Design Tokens file or directory (JSON format).
        // By default, it points to './tokens/default-theme.tokens.json' relative to the module.
        tokens: 'tokens/', // Can be a single file (e.g., 'dd-theme.tokens.json') or an entire directory

        // Optional: Changes the prefix for Vue components and CSS variables (default: 'dd').
        // Example: 'acme' -> <acme-button>, --acme-color-primary
        prefix: 'dd',

        // Optional: Enables debug logging of the module in the terminal during the build process.
        debug: true
      }
    ]
  ]
})
```

> **Important Note:** If you change the `prefix` property, you must restart your Nuxt development server for the changes to fully take effect in the generation of components and CSS.

## 3. Creating your Tokens file

The module needs a `.json` file or a folder containing `.json` files with the definition of your design tokens.

If you configured `tokens: 'tokens/'` in the previous step, create the folder and an initial file.

**Example: `tokens/colors.json`**

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

## 4. Font Management

The `daredash` module uses `@nuxt/fonts` to manage typographic fonts seamlessly.

It comes pre-configured to load local fonts from the `modules/daredash/fonts/` directory (currently the Inter family). You can overwrite the default fonts using the `@nuxt/fonts` injection or by loading external fonts via custom tokens.

## 5. Global Base Styles

The module automatically injects a small `reset.css` file containing a modern and lightweight CSS reset. This ensures that the initial rendering of components starts from the same baseline across different browsers, in addition to injecting the dynamically generated `default.css` with variables at the `:root`.

There is no need to manually import the styles in `app.vue`. The module handles the injection in the Nuxt lifecycle.

## 6. Icon Configuration (Optional)

The library is agnostic to specific icon libraries. It uses the keys from the `@nuxt/icon` package.

You can overwrite the default icons (usually mapped to the `heroicons:` set) through `appConfig` in your `app.config.ts`.

```typescript
// app.config.ts
export default defineAppConfig({
  daredash: {
    icons: {
      // Example: Change the system 'close' icon to use the 'mdi' set
      close: 'mdi:close-circle'
    }
  }
})
```
