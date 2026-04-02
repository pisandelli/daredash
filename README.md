# ⚡ DareDash: Token-Driven UI Library for Nuxt

## Overview

`daredash` is a Nuxt module designed to streamline the management and use of design tokens within a Nuxt application. It provides a robust system for defining, parsing, and applying design tokens, with special support for CSS Typed OM (Object Model) properties.

This module automatically processes a JSON-based token file, generates CSS custom properties, and registers typed tokens on the client-side, enabling more powerful and predictable styling capabilities.

## Quick Start

### Installation

```bash
npm install daredash # or yarn, pnpm, bun
```

### Setup

To use the module, add it to your `nuxt.config.ts`.

```typescript
export default defineNuxtConfig({
  modules: [
    [
      'daredash',
      {
        tokens: 'tokens/', // Path to your tokens JSON file or directory
        prefix: 'dd',      // Optional: Change component and variable prefixes
        debug: true        // Optional: Enable build-time debug logs
      }
    ]
  ]
})
```

For more details on setup, custom configurations, fonts, and global styles, see the [Installation Guide](./docs/installation.md).

## Features

- **Design Token Management**: Centralize your design system's values (colors, fonts, spacing, etc.) in structured JSON files.
- **Dynamic Prefixes**: Configurable prefixes for components (`<DdButton>` vs. `<AcmeButton>`) and CSS variables (`--dd-color` vs. `--acme-color`).
- **Automatic CSS Generation**: Automatically generates CSS custom properties from your token files.
- **Typed CSS Properties**: Leverages the CSS Typed OM API (`CSS.registerProperty`) to register tokens with specific types (e.g., `<color>`).

Learn more about token types, usage, and best practices in the [Features & Architecture Guide](./docs/features.md).

## Documentation

- [Features & Architecture](./docs/features.md): Token types, theming, and styling best practices.
- [Installation Guide](./docs/installation.md): Full module setup and configuration.
- [Layout Primitives](./docs/layout.md): Stack, Grid, Cluster, Box, etc.
- [UI Components & Forms](./docs/components.md): Button, Input, Checkbox, Toaster, Modal, etc.
- [LLM Guide](./docs/LLM.txt): Architecture overview and context specifically written for AI agents.
- [Developer Guide](./README.DEV.md): Internal architecture and contribution guide.

> **Note**: If you change the `prefix` in `nuxt.config.ts`, you must restart your Nuxt dev server for the changes to take full effect.

## Typed Tokens Plugin

The module includes a client-side plugin (`typedTokens.client.ts`) that registers tokens using the `CSS.registerProperty` API.

- **Type Safety**: The browser knows the type of the custom property.
- **Transitions and Animations**: Typed custom properties can be animated smoothly.
- **Predictable Inheritance**: Explicitly defines whether a property should be inherited by child elements.

If the browser does not support `CSS.registerProperty`, a warning is logged, and the custom properties will still work as standard, untyped CSS variables.

### Caveats
> **Important Note on CSS Flickering**: Registering typed tokens via the client-side plugin may cause a brief "CSS Flickering" (flash) effect during page load, as the browser applies registration after the initial paint. A server-side or build-time injection solution is planned but currently not on the roadmap.

## Curiosities

**Why "daredash"?**
The project began as "tokenUI", but the possible prefixes (TUI, TU, TKU) never quite hit the mark. Inspired by the double dashes (`--`) that define CSS variables, the name was changed to **Double Dash**. After some time, it became clear that the domain was already in use. A pivot to **2Dash** followed, but it felt disconnected from the `dd` prefix that had already become well-established in the codebase. As a lifelong fan of Marvel's **Daredevil**, the perfect name finally clicked: **DareDash**. It allowed us to keep the `dd` prefix, honor the "Man Without Fear", and finally secure an available domain!
