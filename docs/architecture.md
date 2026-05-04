# UI Library Architecture

This document explains how the `daredash` UI library works at a high level.

It is intended for developers, maintainers, product stakeholders, and anyone who needs to understand the structure of the library without diving into implementation details.

## 1. Architecture Overview

`daredash` is a Nuxt-first UI library built as a Nuxt module.

At a high level, the library is split into two layers:

- **Build layer**
  - runs while Nuxt prepares or builds the application
  - reads tokens
  - generates CSS variables
  - configures the CSS token helper
  - registers components
- **Runtime layer**
  - runs inside the consuming application
  - renders components
  - applies tokens and variants
  - exposes composables
  - powers Studio tooling

This separation is important:

- the build layer prepares the design system and component registration;
- the runtime layer delivers the actual UI behavior inside the app.

## 2. How Components Are Structured

The component system is intentionally split into different levels of complexity.

### Layout primitives

Examples:

- `Box`
- `Stack`
- `Cluster`
- `Grid`
- `Sidebar`
- `Layout`

These components are small, compositional building blocks. They usually:

- render a neutral HTML wrapper;
- accept a configurable `tag`;
- rely on CSS Modules and attrs for layout behavior.

### UI primitives

Examples:

- `Button`
- `Badge`
- `Input`
- `Select`
- `Checkbox`
- `Alert`
- `Progress`

These are the main reusable UI elements. They usually:

- expose a compact API;
- translate semantic attrs into styling states;
- keep most visual behavior in CSS Modules.

### Form wrappers

Examples:

- `FormInput`
- `FormSelect`
- `FormCheckbox`

These components are thin wrappers around primitives. Their role is not to redefine the UI, but to connect primitives to `vee-validate`.

### Widgets

Examples:

- `Modal`
- `Drawer`
- `Tabs`
- `Menu`
- `Table`
- `Popover`
- `Anchor`

These components usually contain more interaction logic, more internal coordination, and sometimes orchestration across multiple child components.

## 3. Relationship Between Components, Composables, Tokens, Theme, and the Nuxt Plugin

The library is best understood as a system of connected layers rather than a flat collection of components.

### Components

Components are the visible surface of the library.

They depend on:

- CSS Modules for structure and appearance;
- processed attrs for variants and states;
- tokens for spacing, color, typography, and sizing;
- composables for shared runtime behavior where needed.

### Composables

Composables provide reusable runtime logic.

There are two different roles here:

- **public composables**
  - currently the main public example is `useToaster`
- **internal/tooling composables**
  - examples include `useBaseComponent`
  - `useThemeEditor` is currently Studio-oriented tooling

Composables reduce duplication and help keep component logic consistent.

### Tokens

Tokens are the design system foundation.

They define:

- colors
- spacing
- sizing
- component-level visual mappings
- theme-specific overrides

At build time, tokens are transformed into CSS custom properties. At runtime, components consume those properties through CSS Modules.

### Theme

Theme is built on top of tokens.

The current model supports:

- a default token layer
- named themes such as `light` and `dark`
- overrides via `[data-theme="..."]`

Today, theme switching infrastructure exists, but the strongest supported workflow is still tied to Studio and token preview/export rather than a broad public runtime theming API.

### Nuxt plugin/module layer

The Nuxt module is the glue that turns all of this into a usable library.

It is responsible for:

- exposing the runtime prefix
- registering components
- injecting reset styles
- wiring the token pipeline
- adding composable imports
- exposing the Studio route

Without the Nuxt module, the library architecture is incomplete. This is why the project should be understood as a Nuxt module first, not as a generic UI package.

## 4. Rendering Flow

The rendering flow can be understood in five steps.

### Step 1: Module setup

When Nuxt loads the module:

- module options are read
- the prefix is defined
- tokens are loaded
- components are registered
- reset styles are injected

### Step 2: Token preparation

During build:

- token JSON is parsed
- references are resolved
- CSS variables are generated
- theme selectors are generated
- typed token metadata is prepared for the client

### Step 3: Component registration

The component catalog is read from `components.config.ts`.

From there:

- simple style-driven components can be generated through the base wrapper mechanism
- more complex components are registered directly from their implementation files

### Step 4: Runtime render

When a consuming app renders a component:

- the prefixed component name is resolved by Nuxt
- the component receives props and attrs
- shared attr processing maps recognized styling attrs into `data-*` states
- CSS Modules consume those states and token-based variables

### Step 5: Visual output

The final appearance is produced by the combination of:

- component markup
- processed attrs
- CSS Modules
- generated CSS custom properties
- current theme context

This means the runtime UI is not driven by inline styles or one-off logic. It is driven by a structured contract between markup, attrs, and tokenized CSS.

## 5. Design System Model

The design system is one of the central architectural ideas in `daredash`.

### Token-first styling

Components are not styled as isolated one-offs.

Instead, they inherit from a token hierarchy that provides:

- consistency
- centralized control
- theming support
- safer overrides

### Variant model

Variants are primarily attr-driven.

Examples of semantic variants used across the system:

- `primary`
- `accent`
- `success`
- `warning`
- `danger`
- `error`
- `info`

This gives the system a consistent mental model:

- semantic intent comes from attrs;
- component CSS interprets those attrs visually.

### Size model

The system recognizes a set of size attrs such as:

- `tiny`
- `small`
- `large`
- `xlarge`

However, there is no formal universal size scale applied identically to every component. Size support is component-dependent.

### Token layering

A useful way to think about styling in `daredash` is:

1. global token
2. component token mapping
3. local usage

This helps avoid visual leakage and keeps overrides predictable.

## 6. Extensibility

The library was designed to be extended in multiple directions.

### New components

New components can be added by:

- creating a runtime implementation
- creating a CSS Module
- registering the component in `components.config.ts`

For simple components, the system can lean on the shared base wrapper pattern. For more complex components, direct implementation files are used.

### New tokens

The token system is extensible by design.

You can:

- add new token files
- split tokens by directory
- introduce new component-level token namespaces
- extend theme definitions

Because the build pipeline already knows how to merge and parse token files, the design system can grow without changing the overall architecture.

### New themes

Theme support is built into the token model.

Adding themes generally means:

- defining additional theme token groups
- allowing those values to be emitted under a `data-theme` selector

### Consumer-level customization

Consumers can extend or adapt the library through:

- module options
- token overrides
- theme selectors
- icon overrides in `appConfig`
- component composition inside the app

This gives teams multiple ways to adapt the library without forking its structure.

## 7. Known Limitations

The architecture is strong, but it is intentionally opinionated and still evolving in some areas.

### Nuxt-first, not framework-agnostic

The library is built around Nuxt module behavior.

That means:

- component registration depends on Nuxt
- composable imports depend on Nuxt wiring
- the Studio route is part of the Nuxt integration

This is a deliberate choice, but it means the library should not be positioned as a generic Vue UI package right now.

### Theme runtime usage is still maturing

The token and theme infrastructure is real and functional, but the strongest supported flow today is still Studio-oriented.

In other words:

- the architecture supports theme layers
- the public runtime theming story is not yet as mature as the underlying token system

### Some public surface is broader than the typed config

The runtime reads more icon keys than the typed `appConfig` definition currently declares.

This does not break the architecture, but it creates a documentation and typing mismatch that should be aligned over time.

### Variant and size support is intentionally uneven

The system has shared semantic patterns, but not every component supports every variant or every size.

This keeps primitives focused, but it also means consumers should not assume a perfectly uniform API across the whole catalog.

### Studio-specific tooling is still close to the runtime

Some tooling pieces, especially around token editing, live close to the runtime layer.

This is practical, but it means documentation must clearly distinguish:

- what is meant for application consumers
- what is meant for internal tooling or Studio workflows

## 8. Summary

At a high level, `daredash` is:

- a Nuxt module
- a token-driven design system
- a component library organized around primitives and widgets
- a styling architecture based on attrs, CSS Modules, and generated CSS variables

Its main strength is coherence:

- tokens define the system
- the module wires the system into Nuxt
- components render the system
- composables support the system
- Studio helps inspect and evolve the system

That coherence is what makes the library maintainable as it grows.
