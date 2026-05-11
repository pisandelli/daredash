# DareDash

Token-driven UI library for Nuxt.

`@pisandelli/daredash` is a Nuxt-first UI library built around reusable components, JSON design tokens, CSS Modules, semantic attrs, and a built-in Studio for theme exploration. If you want a UI layer that stays consistent while remaining easy to theme and evolve, this is the front door.

## Documentation Map

Use this order if you are adopting DareDash in an application:

1. [Installation and Configuration](./docs/installation.md)  
   Set up the Nuxt module, prefix, tokens, icons, and Studio route.
2. [Layout Primitives](./docs/layout.md)  
   Learn the structural building blocks used to compose pages.
3. [UI Components](./docs/components.md)  
   Browse the main component reference for forms, feedback, navigation, and widgets.
4. [Features, Tokens, and Theming](./docs/features.md)  
   Understand the design-token model, `v()`, theming, and safe customization.
5. [Architecture](./docs/architecture.md)  
   Read the high-level system explanation once you want the “why” behind the library.
6. [Developer Guide](./README.DEV.md)  
   Use this only if you are extending or maintaining the library itself.

AI-specific guidance lives separately in [llms.txt](./llms.txt).

## Why DareDash

DareDash combines three concerns that are often split across separate tools:

- a component library for real application UI
- a design-token system for consistency and theming
- a built-in Studio for visual iteration and token export

The result is not just a bag of components. It is a working product system that can be consumed by app teams and evolved by maintainers without drifting into one-off styling.

## Quick Start

### Install

```bash
pnpm add @pisandelli/daredash
```

### Register the module

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

### Build a page with DareDash

```vue
<template>
  <dd-layout>
    <dd-sidebar>
      <dd-menu :items="menuItems" collapsible />
    </dd-sidebar>

    <dd-box tag="main">
      <dd-stack spaced>
        <dd-breadcrumb :config="breadcrumb" />

        <dd-card>
          <template #header>Welcome</template>
          <p>Your content goes here.</p>
        </dd-card>
      </dd-stack>
    </dd-box>
  </dd-layout>
</template>

<script setup lang="ts">
const menuItems = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    icon: 'heroicons:home',
    action: { type: 'link', to: '/' }
  }
]

const breadcrumb = {
  routes: [
    { label: 'Home', to: '/' },
    { label: 'Dashboard' }
  ]
}
</script>
```

## What the Module Provides

When you enable `@pisandelli/daredash`, the module:

- auto-registers the component surface with the configured prefix
- parses token JSON and emits CSS custom properties
- injects the reset stylesheet and token output
- auto-imports runtime composables
- exposes the `/studio` route
- adds a Nuxt DevTools tab for Studio

This is why DareDash should be understood as a Nuxt module first, not as a disconnected component package.

## Main Capabilities

### Components

The library includes:

- layout primitives such as `dd-box`, `dd-stack`, `dd-cluster`, `dd-grid`, `dd-sidebar`, and `dd-layout`
- form primitives such as `dd-input`, `dd-textarea`, `dd-select`, `dd-checkbox`, `dd-radio`, and `dd-toggle`
- `vee-validate` wrappers such as `dd-form-input` and `dd-form-select`
- widgets such as `dd-menu`, `dd-tabs`, `dd-modal`, `dd-drawer`, `dd-table`, `dd-popover`, and `dd-anchor`
- feedback primitives such as `dd-alert`, `dd-badge`, `dd-progress`, `dd-loading`, `dd-toast`, and `dd-toaster`

### Tokens and theming

The design system is token-driven. JSON token files become:

- CSS variables
- theme layers
- component-level visual mappings

This gives consumers a centralized way to control color, spacing, typography, sizing, and component behavior without turning every screen into a custom CSS project.

### Studio

Studio is one of DareDash’s strongest differentiators.

It is exposed at:

- `/studio`
- and as a dedicated tab in Nuxt DevTools

Studio helps teams preview token changes, inspect components, iterate on themes, and export overrides without rewriting component logic.

## Where to go next

- Start with [Installation and Configuration](./docs/installation.md) if you are adding DareDash to a Nuxt app.
- Jump to [Layout Primitives](./docs/layout.md) if you want to start composing pages.
- Open [UI Components](./docs/components.md) if you need the human-facing component reference.
- Read [Features, Tokens, and Theming](./docs/features.md) before customizing the visual system deeply.

## Notes

- Default prefix: `dd`
- If you change the prefix, restart the Nuxt dev server
- Consumer examples in the human docs use `kebab-case` tags such as `<dd-button>`
