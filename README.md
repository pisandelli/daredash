# DareDash

Token-driven UI library for Nuxt.

`daredash` is a Nuxt-first component library built around:

- reusable UI primitives and widgets
- JSON-based design tokens
- CSS Modules with semantic variants
- a built-in Studio for exploring and exporting theme changes

If you want a UI layer that is consistent, themeable, and tightly integrated with Nuxt, this library is the entry point.

## Documentation TOC

### Start here

- [Installation Guide](./docs/installation.md)
- [UI Components](./docs/components.md)
- [Layout Primitives](./docs/layout.md)
- [Features](./docs/features.md)
- [Architecture](./docs/architecture.md)

### AI and internal guidance

- [LLM Guide](./llms.md)
- [Compact AI Guide](./docs/LLM.md)
- [Developer Guide](./README.DEV.md)

## Why DareDash

DareDash combines three concerns that are often split across multiple tools:

- **UI components**
  - buttons, forms, layout primitives, navigation, tables, overlays
- **design system infrastructure**
  - tokens, variants, themes, CSS variable generation
- **interactive design tooling**
  - DareDash Studio for live token inspection and theme iteration

The result is a library that is not only reusable in application code, but also easier to evolve as a product system.

## Studio as a Differentiator

One of the strongest parts of DareDash is the built-in **DareDash Studio**.

Studio is not just a playground. It is a working surface for the design system itself.

It helps teams:

- inspect components in one place
- preview token-driven visual changes
- experiment with theme values without rewriting component code
- export token overrides as JSON
- reduce the back-and-forth between design intent and implementation

From a product perspective, Studio turns the UI library into a system you can actively shape, not just consume.

From a developer perspective, Studio reduces guesswork when working on tokens, themes, and visual regressions.

The module exposes Studio at:

- `/studio`
- and as a dedicated tab in Nuxt DevTools

## Quick Start

### Install

```bash
pnpm add daredash
```

### Register the module

```ts
// nuxt.config.ts
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

### Use components

```vue
<template>
  <DdLayout>
    <DdSidebar>
      <DdMenu :items="menuItems" collapsible />
    </DdSidebar>

    <DdBox tag="main">
      <DdStack spaced>
        <DdCard>
          <template #header>Welcome</template>
          <p>Your content here.</p>
        </DdCard>
      </DdStack>
    </DdBox>
  </DdLayout>
</template>
```

## What the Module Provides

When enabled, `daredash`:

- auto-registers all library components
- processes token JSON into CSS custom properties
- injects the global reset stylesheet
- adds runtime composable imports
- exposes token/theme tooling through Studio
- registers a DevTools tab for faster iteration

## Main Capabilities

### Components

DareDash includes:

- layout primitives such as `Box`, `Stack`, `Cluster`, `Grid`, `Sidebar`, `Layout`
- form primitives such as `Input`, `Textarea`, `Select`, `Checkbox`, `Radio`, `Toggle`
- validated form wrappers such as `FormInput`, `FormSelect`, `FormCheckbox`
- widgets such as `Modal`, `Drawer`, `Tabs`, `Table`, `Menu`, `Popover`, `Anchor`
- feedback components such as `Alert`, `Loading`, `Toast`, `Toaster`

### Design Tokens

The library consumes JSON token files and turns them into:

- CSS variables
- theme layers
- typed token metadata for client registration

This gives you a centralized way to control:

- color
- spacing
- sizing
- component-level visual behavior

### Theme System

DareDash supports theme-oriented token organization and runtime theme selectors such as `data-theme`.

The current architecture is especially strong when used with Studio for previewing and exporting theme overrides.

## Example Use Cases

### Action Button

```vue
<DdButton primary icon="heroicons:plus">
  New
</DdButton>
```

### Validated Form

```vue
<DdFormInput
  name="email"
  label="Email"
  type="email"
/>
```

### Table

```vue
<DdTable :columns="columns" :data="rows" />
```

### Modal

```vue
<DdModal :open="open" title="Confirm" @update:open="open = $event">
  <p>Are you sure?</p>
</DdModal>
```

## Documentation

- [Installation Guide](./docs/installation.md)
- [Layout Primitives](./docs/layout.md)
- [UI Components](./docs/components.md)
- [Features](./docs/features.md)
- [Architecture](./docs/architecture.md)
- [LLM Guide](./llms.md)
- [Compact AI Guide](./docs/LLM.md)
- [Developer Guide](./README.DEV.md)

## Notes

- Default prefix: `dd`
- If you change the prefix, restart the Nuxt dev server
- The library is currently designed for Nuxt usage, not positioned as a framework-agnostic Vue package

## Why the Name

The project grew out of a naming journey around CSS variables and the `dd` prefix. The final name, **DareDash**, kept the established `dd` identity while turning the “double dash” idea into something memorable and brandable.
