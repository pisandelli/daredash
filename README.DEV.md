# DareDash Developer Guide

This README is for contributors and maintainers.

If you want to understand how the library is structured, where core responsibilities live, and how to safely extend the system, start here.

For a higher-level architectural explanation aimed at broader audiences, see [docs/architecture.md](./docs/architecture.md).

## Documentation TOC

### Product and usage docs

- [README](./README.md)
- [Installation Guide](./docs/installation.md)
- [Layout Primitives](./docs/layout.md)
- [UI Components](./docs/components.md)
- [Features](./docs/features.md)
- [Architecture](./docs/architecture.md)

### AI and maintainer docs

- [LLM Guide](./llms.md)
- [Compact AI Guide](./docs/LLM.md)
- [Developer Guide](./README.DEV.md)

## What DareDash Is

DareDash is a Nuxt-first UI library with four tightly connected parts:

- a **Nuxt module** that wires everything into the app
- a **component system** made of primitives, wrappers, and widgets
- a **design token pipeline** that generates CSS variables and themes
- a **Studio** that helps inspect, preview, and export visual system changes

The important mental model is:

- the module prepares the system
- tokens define the system
- components render the system
- Studio helps evolve the system

## High-Level Architecture

### Build layer

The build layer lives mainly in `src/`.

Its responsibilities include:

- reading token sources
- resolving references
- generating CSS variable output
- registering the PostCSS `v()` hook
- registering components with the current prefix

Key files:

- `module.ts`
- `src/builder/tokens.ts`
- `src/builder/components.ts`
- `src/parser.ts`
- `src/postcss/postcss-v-function.ts`

### Runtime layer

The runtime layer lives mainly in `runtime/`.

It contains:

- Vue/Nuxt components
- composables
- CSS Modules
- shared utilities
- Studio pages and previews

Key folders:

- `runtime/components/`
- `runtime/composables/`
- `runtime/assets/styles/`
- `runtime/shared/`
- `runtime/studio/`

## Core Relationships

### 1. Module -> Tokens

The Nuxt module loads token sources through the configured `tokens` path.

Those tokens are parsed and converted into:

- root-level CSS custom properties
- theme selectors such as `[data-theme="light"]`
- typed token metadata for client-side registration

### 2. Module -> Components

The module reads `components.config.ts` and registers components with the configured prefix.

That registration supports two paths:

- **generated wrappers**
  - for simpler style-driven components
- **direct registration**
  - for more complex components with dedicated implementation files

### 3. Components -> Composables

Components rely on composables and shared utilities for consistency.

Examples:

- `useBaseComponent`
  - shared attr/class handling
- `useToaster`
  - global toast state
- `useThemeEditor`
  - Studio-oriented token editing workflow

### 4. Components -> Tokens

Components do not hardcode most visual values.

Instead, CSS Modules consume token-generated custom properties, often through local variable mapping. This keeps the system themeable and easier to evolve.

### 5. Studio -> Everything

Studio is not a side feature. It sits on top of the same token and component infrastructure used by the runtime.

That makes it valuable for:

- internal development
- product review
- theme experimentation
- design-system iteration

## Component Model

The component catalog is intentionally layered.

### Layout primitives

Examples:

- `Box`
- `Stack`
- `Cluster`
- `Grid`
- `Sidebar`
- `Layout`

These are mostly structural building blocks with small APIs.

### UI primitives

Examples:

- `Button`
- `Badge`
- `Input`
- `Select`
- `Checkbox`
- `Alert`
- `Progress`

These are the main reusable UI elements.

### Form wrappers

Examples:

- `FormInput`
- `FormSelect`
- `FormCheckbox`

These are thin `vee-validate` adapters around primitives.

### Widgets

Examples:

- `Modal`
- `Drawer`
- `Tabs`
- `Menu`
- `Table`
- `Popover`
- `Anchor`

These components typically contain more coordination logic and richer runtime behavior.

## Prefix Strategy

The prefix system is fundamental to the library.

Default prefix:

- `dd`

Examples:

- component name: `DdButton`
- CSS variable: `--dd-color-primary`

Never hardcode the prefix in new logic when a helper already exists for dynamic resolution.

The main runtime helper for this is `getPrefixName`.

## Token System

Tokens are defined in JSON and can come from:

- a single file
- or a directory tree of JSON files

The build pipeline:

1. resolves the token source
2. merges JSON when directories are used
3. parses standard and typed token values
4. emits CSS variable output
5. emits theme blocks
6. registers the client token plugin

This architecture gives DareDash its consistency and extensibility.

## Styling Rules

### Use `v()` in module CSS

When authoring CSS for the library:

- use `v('token.path')`
- do not manually hardcode the generated CSS variable name when the intent is a token reference

### Prefer token layering

The safest styling model is:

1. global token
2. component token mapping
3. local usage

This reduces leakage and makes overrides more predictable.

### Use attr-driven variants

The library relies heavily on attrs that become `data-*` states.

This is part of the system design, not an incidental implementation detail.

## Studio

Studio is one of the most important differentiators in the repository.

For contributors, it matters because it provides a fast feedback loop for:

- component previews
- theme previews
- token inspection
- exporting token overrides

From an internal architecture perspective, Studio proves that the token pipeline and component system are reusable beyond normal page rendering.

Studio is exposed through:

- `/studio`
- a Nuxt DevTools tab

## Public vs Internal Surface

### Safe public surface

- registered components
- module options: `tokens`, `prefix`, `debug`
- `useToaster`
- icon overrides in `appConfig.daredash.icons`

### Internal or tooling-oriented surface

- `useBaseComponent`
- `useThemeEditor`
- `runtime/shared/utils/*`
- `src/*`
- `#dd/*` aliases as a primary app API
- `runtime/components/widgets/Menu/useMenu*.ts`

When documenting or extending the project, keep this boundary explicit.

## Extending the Library

### Add a new component

Typical workflow:

1. create the runtime implementation
2. create the CSS Module
3. add the component to `components.config.ts`
4. add tokens if the component needs its own token namespace
5. add tests when logic branches exist

### Add or evolve tokens

Typical workflow:

1. add or update token JSON
2. keep naming aligned with existing namespaces
3. verify output in Studio
4. verify CSS usage through `v()`

### Add a more complex widget

Use the widget path when the component needs:

- significant internal coordination
- overlay/dialog logic
- keyboard interaction
- composition across multiple subcomponents

## Validation

After TypeScript or component API changes:

```bash
pnpm --dir modules/daredash run lint:ts
```

After Studio-related changes:

```bash
pnpm --dir modules/daredash run test:studio
```

For broader coverage:

```bash
pnpm --dir modules/daredash test
```

## Practical Contribution Rules

- Keep documentation aligned with `llms.md` when the public API changes.
- Preserve the distinction between public API and internal tooling.
- Prefer adding clarity to tokens and variants over adding one-off exceptions.
- Avoid inventing public APIs that are only implementation details today.
- Treat Studio as a first-class part of the product story, not just a dev sandbox.
