# daredash: Double Dash Design Tokens Module

## Overview

The `daredash` is a Nuxt module designed to streamline the management and use of design tokens within a Nuxt application. It provides a robust system for defining, parsing, and applying design tokens, with special support for CSS Typed OM (Object Model) properties.

This module automatically processes a JSON-based token file, generates CSS custom properties, and registers typed tokens on the client-side, enabling more powerful and predictable styling capabilities.

## Features

- **Design Token Management**: Centralize your design system's values (colors, fonts, spacing, etc.) in a structured JSON file.
- **Dynamic Prefixes**: Configurable prefixes for components (`<DdButton>` vs. `<acme-button>`) and CSS variables (`--dd-color` vs. `--acme-color`).
- **Automatic CSS Generation**: Automatically generates CSS custom properties from your token files.
- **Typed CSS Properties**: Leverages the CSS Typed OM API (`CSS.registerProperty`) to register tokens with specific types (e.g., `<color>`).
- **Font Management**: Integrates with `@nuxt/fonts`.
- **Global Styles**: Injects a baseline CSS reset.
- **Robust Developer Experience**: Typed aliases and debug modes.

## Configuration

To use the module, add it to your `nuxt.config.ts`.

```typescript
export default defineNuxtConfig({
  modules: [
    [
      './modules/daredash',
      {
        // Optional: Path to your design tokens file.
        // Defaults to './tokens/default-theme.tokens.json' relative to the module.
        tokens: 'dd-theme.tokens.json',

        // Optional: Change the prefix for components and variables (default: 'dd').
        // Example: 'acme' -> <acme-button>, --acme-color-primary
        prefix: 'dd',

        // Optional: Enable debug logging
        debug: true
      }
    ]
  ]
})
```

## Documentation

-   [Layout Primitives](./docs/layout.md): Stack, Grid, Cluster, Box, etc.
-   [UI Components & Forms](./docs/components.md): Button, Input, Checkbox, Toaster, etc.
-   [Developer Guide](./README.DEV.md): Internal architecture and contribution guide.

> **Note**: If you change the `prefix`, you must restart your Nuxt dev server for the changes to take full effect.

## Design Tokens

The core of this module is the design token system. Tokens are defined in a JSON file.

### Token Structure

The module supports two types of tokens:

1.  **Standard Tokens**: Simple key-value pairs.
2.  **Typed Tokens**: Tokens defined as objects with a specific schema, intended for use with `CSS.registerProperty`.

**Example `tokens.json`:**

```json
{
  "defaults": {
    "color": {
      "primary": {
        // Typed Token
        "$value": {
          "syntax": "<color>",
          "inherits": true,
          "initial-value": "#0090ea"
        }
      },
      "text": {
        // Standard Token (referencing another token)
        "$value": "{color.primary}"
      }
    },
    "font": {
      "weight": {
        "bold": {
          // Typed Token
          "$value": {
            "syntax": "<integer>",
            "inherits": true,
            "initial-value": "700"
          }
        }
      }
    }
  }
}
```

### Token Processing

1.  The module reads the specified `tokens` file.
2.  It recursively parses the JSON structure.
3.  **Standard tokens** are converted into CSS custom properties. For example, `font.weight.regular` becomes `--font-weight-regular`. These are injected into a `default.css` file in the `:root`.
4.  **Typed tokens** (those with a `$value` object containing `syntax`, `inherits`, and `initial-value`) are collected and saved into a `design-tokens.json` file within the Nuxt build directory.

## Typed Tokens Plugin

This is where the magic happens for typed tokens. The module includes a client-side plugin (`typedTokens.client.ts`) that runs when the application loads in the browser.

### How It Works

1.  The plugin imports the `design-tokens.json` file that was generated during the build process.
2.  It checks if the browser supports the CSS Typed OM API via `CSS.registerProperty`.
3.  If supported, it iterates through each typed token and registers it with the browser.

**Example Registration:**

For a token like:

```json
"primary": {
  "$value": {
    "syntax": "<color>",
    "inherits": true,
    "initial-value": "#0090ea"
  }
}
```

The plugin will execute the following JavaScript in the browser:

```javascript
CSS.registerProperty({
  name: '--color-primary',
  syntax: '<color>',
  inherits: true,
  initialValue: '#0090ea'
})
```

> **Important Note on `initial-value`**: While standard tokens in this module can reference other tokens (e.g., `"$value": "{color.secondary.light}"`), the `initial-value` for a typed token **cannot** use references like `var()`. It must be a static, literal value that conforms to the specified `syntax`. This is a limitation of the underlying `CSS.registerProperty` API.
> For more details, see the [MDN documentation for `@property`](https://developer.mozilla.org/en-US/docs/Web/CSS/@property/initial-value).

### Benefits of Typed Tokens

- **Type Safety**: The browser knows the type of the custom property. Trying to set an invalid value (e.g., a number for a `<color>`) will fail.
- **Transitions and Animations**: Typed custom properties can be animated smoothly. The browser understands how to interpolate between values (e.g., from one color to another).
- **Default Values**: Ensures that a custom property always has a valid initial value.
- **Predictable Inheritance**: Explicitly defines whether a property should be inherited by child elements.

If the browser does not support `CSS.registerProperty`, a warning is logged to the console, and the custom properties will still work as standard, untyped CSS variables.

### Caveats
> **Important Note on CSS Flickering**: Registering typed tokens via the client-side plugin may cause a brief "CSS Flickering" (flash) effect during page load, as the browser applies registration after the initial paint. A server-side or build-time injection solution is planned but currently not on the roadmap.

## Font Management

The module uses `@nuxt/fonts` to manage fonts. It's pre-configured to load fonts from the `modules/daredash/fonts/` directory. Currently, it loads the 'Inter' font family.

## Global Styles

A `reset.css` file containing a very tinny modern CSS reset is automatically included in the application's styles to ensure a consistent baseline.

## Curiosities

**Why "daredash"?**
The project began as "tokenUI", but the possible prefixes (TUI, TU, TKU) never quite hit the mark. Inspired by the double dashes (`--`) that define CSS variables, the name was changed to **Double Dash**. After some time, it became clear that the domain was already in use. A pivot to **2Dash** followed, but it felt disconnected from the `dd` prefix that had already become well-established in the codebase. As a lifelong fan of Marvel's **Daredevil**, the perfect name finally clicked: **DareDash**. It allowed us to keep the `dd` prefix, honor the "Man Without Fear", and finally secure an available domain!
