# UI Library Architecture

This document is for readers who want the high-level system model behind DareDash without jumping straight into maintainer workflows. It explains how the module, token pipeline, runtime components, and Studio fit together conceptually.

If you need contributor-specific guidance, continue to [README.DEV.md](../README.DEV.md).

## 1. Architecture overview

`daredash` is a Nuxt-first UI library implemented as a Nuxt module.

At a high level, the system is split into two layers:

- a build layer that prepares tokens, CSS variable output, themes, and component registration
- a runtime layer that renders components, applies attrs and tokens, and powers Studio

This separation matters because DareDash is not just a set of Vue files. The build pipeline and the runtime surface are both part of the public experience.

## 2. The component model

The component system is intentionally layered.

### Layout primitives

Examples:

- `Box`
- `Stack`
- `Cluster`
- `Grid`
- `Sidebar`
- `Layout`

These components are mostly structural building blocks. They usually:

- render a neutral wrapper
- accept a configurable `tag`
- rely on attrs and CSS Modules for layout behavior

### UI primitives

Examples:

- `Button`
- `Badge`
- `Input`
- `Select`
- `Alert`
- `Progress`

These are the main reusable interface elements. They usually:

- expose compact APIs
- translate semantic attrs into styling states
- keep most visual behavior in CSS Modules and tokens

### Form wrappers

Examples:

- `FormInput`
- `FormSelect`
- `FormCheckbox`

These are thin wrappers around primitives whose main role is integration with `vee-validate`.

### Widgets

Examples:

- `Modal`
- `Drawer`
- `Tabs`
- `Menu`
- `Table`
- `Popover`
- `Anchor`

These components usually contain more coordination logic and richer runtime behavior.

## 3. How the main layers connect

### Components

Components are the visible surface of the library.

They depend on:

- CSS Modules for structure and appearance
- processed attrs for styling states and variants
- tokens for spacing, color, sizing, and typography
- composables for shared runtime behavior where needed

### Composables

Composables have two roles:

- public composables such as `useToaster`
- internal or tooling composables such as `useBaseComponent` and `useThemeEditor`

This distinction is important because not every reusable implementation detail should be treated as a public integration API.

### Tokens

Tokens are the design-system foundation.

They define:

- colors
- spacing
- sizing
- component-level mappings
- theme overrides

At build time, tokens become CSS custom properties. At runtime, components consume those properties through CSS Modules.

### Themes

Theme support is built on top of tokens.

The current model supports:

- a default token layer
- named themes such as `light` and `dark`
- runtime theme selectors such as `[data-theme="..."]`

The infrastructure exists broadly, but the strongest supported workflow today is still closely tied to Studio.

### The Nuxt module

The Nuxt module is the glue that makes the system usable.

It is responsible for:

- reading module options
- loading and processing token sources
- registering the public component surface
- injecting reset styles
- wiring runtime aliases and imports
- exposing Studio

Without the module layer, the DareDash architecture is incomplete.

## 4. Rendering flow

The runtime output can be understood in five steps.

### Step 1: module setup

Nuxt loads the module, reads the prefix and token source, and prepares registration.

### Step 2: token preparation

Token JSON is parsed, references are resolved, CSS variables are generated, and theme selectors are emitted.

### Step 3: component registration

The component catalog is read from `components.config.ts`, and components are registered with the configured prefix.

### Step 4: runtime render

When the application renders a component:

- the prefixed component is resolved
- props and attrs are received
- recognized attrs are processed into `data-*` styling states
- CSS Modules consume those states alongside token-driven values

### Step 5: visual output

The final appearance comes from the combination of:

- component markup
- processed attrs
- CSS Modules
- generated CSS custom properties
- current theme context

This is why DareDash should be understood as a contract between markup, attrs, and tokenized CSS rather than a collection of inline styles.

## 5. Design-system model

### Token-first styling

DareDash is intentionally token-driven. Visual consistency is expected to come from shared token definitions and component token mappings, not from duplicated raw values.

### Variant model

Variants are largely attr-driven. In practice, many components express state through semantic attrs such as `primary`, `success`, `warning`, `danger`, and `info`.

### Size model

The system includes shared size semantics, but support is intentionally uneven. Not every component exposes the same set of size attrs, so component-level implementation remains the source of truth.

### Token layering

The preferred internal model is:

1. global token
2. component token
3. local `--local-*` variable usage

This keeps customization safer and easier to reason about.

## 6. Extensibility

The architecture is designed to evolve in a few predictable directions:

- new components
- new tokens
- new themes
- safer consumer-level customization

The main rule is that extensibility should reinforce the system, not bypass it.

## 7. Known limitations

Today, the most important limitations are:

- DareDash is Nuxt-first, not framework-agnostic
- some runtime theming workflows are still strongest inside Studio
- some runtime behavior is broader than the typed config surface
- variant and size support is intentionally uneven across components
- some Studio-oriented tooling still sits close to runtime implementation details

## 8. Summary

DareDash is best understood as a product system with four connected parts:

- a Nuxt module
- a token pipeline
- a component runtime
- a Studio for visual iteration

That combination is what gives the library its shape, and why its documentation needs to talk about more than isolated components.
