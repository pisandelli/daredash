# DareDash Developer Guide

This guide is for contributors and maintainers.

If you are adopting DareDash in an application, start with [README.md](./README.md) and the files inside [`docs/`](./docs). This file is specifically for people extending the module, evolving the tokens, or maintaining the component system.

## Documentation Map

Use this order when working on the library itself:

1. [README](./README.md)  
   Product-facing entrypoint and adoption path.
2. [Installation and Configuration](./docs/installation.md)  
   Consumer setup expectations.
3. [Layout Primitives](./docs/layout.md)  
   Human-facing structural reference.
4. [UI Components](./docs/components.md)  
   Human-facing component reference.
5. [Features, Tokens, and Theming](./docs/features.md)  
   Design-system and customization model.
6. [Architecture](./docs/architecture.md)  
   Conceptual system overview for broader audiences.
7. [Developer Guide](./README.DEV.md)  
   Contributor and maintainer workflows.

AI guidance remains separate in [llms.txt](./llms.txt).

## What maintainers should keep in mind

DareDash is a Nuxt-first UI library with four connected parts:

- a Nuxt module that wires the system into the app
- a component surface made of primitives, wrappers, and widgets
- a token pipeline that produces CSS variables and themes
- a Studio that sits on top of the same runtime and token infrastructure

The important mental model is:

- the module prepares the system
- tokens define the system
- components render the system
- Studio helps evolve the system

## High-level architecture

### Build layer

The build layer lives mainly in `src/` and `module.ts`.

Its responsibilities include:

- reading token sources
- resolving token references
- generating CSS variable output
- wiring the PostCSS `v()` function
- registering components with the current prefix

Important files:

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

Important folders:

- `runtime/components/`
- `runtime/composables/`
- `runtime/assets/styles/`
- `runtime/shared/`
- `runtime/studio/`

## Core relationships

### Module -> tokens

The Nuxt module loads the configured token source and turns it into:

- root-level CSS custom properties
- theme selectors such as `[data-theme="light"]`
- typed token metadata for the client

### Module -> components

The module reads `components.config.ts` and registers the public component surface using the configured prefix.

This registration supports:

- generated wrappers for simpler components
- direct registration for more complex implementations

### Components -> composables

Components rely on shared composables for consistency.

Examples:

- `useBaseComponent`
  shared attr/class handling
- `useToaster`
  public toast state and API
- `useThemeEditor`
  Studio-oriented token editing workflow

### Components -> tokens

Components should not hardcode most visual values.

Instead, CSS Modules consume token-generated custom properties, usually through local `--local-*` mappings. This is what keeps the library themeable and easier to evolve.

### Studio -> everything

Studio is not a disconnected playground. It relies on the same token pipeline, component runtime, and CSS infrastructure as the rest of the library.

That makes it valuable for:

- internal development
- product review
- theme iteration
- regression inspection

## Public vs internal surface

### Safe public surface

Treat these as application-facing:

- auto-registered DareDash components
- module options: `tokens`, `prefix`, `debug`
- `useToaster`
- icon overrides through `appConfig.daredash.icons`

### Internal or tooling-oriented surface

Do not treat these as stable consumer APIs:

- `runtime/components/*`
- `runtime/shared/utils/*`
- `useBaseComponent`
- `useThemeEditor`
- `#dd/*` aliases as a primary app-consumer API

## Styling and token rules

### Use `v()` in module CSS

When authoring styles inside the library:

- use `v('token.path')`
- do not manually hardcode generated CSS variable names when the intent is a token reference

### Prefer token layering

The default layering model should stay:

1. global token
2. component token
3. local variable usage

This keeps overrides predictable and reduces visual leakage.

### Validate attrs against the actual system

When documenting or implementing visual capabilities, verify all three:

- component TypeScript
- `runtime/shared/utils/processedAttrs.ts`
- component CSS module selectors

Do not invent attrs, props, or slots because another UI library supports them.

## Extending the library

### Add a new component

When adding a new public component:

- decide whether it is a layout primitive, UI primitive, form wrapper, or widget
- register it through the component catalog and module flow
- author styles in `runtime/assets/styles/components/`
- expose only the minimum public API needed
- document it in `docs/components.md` and align `llms.txt` if the public surface changed

### Add or evolve tokens

When adding visual controls:

- prefer component tokens over hardcoded values
- keep token names semantic and scoped
- update Studio registry entries if the token should be editable there
- verify human docs stay aligned with the exposed capability

### Add a more complex widget

For richer components:

- keep orchestration logic inside dedicated runtime implementation files
- reuse primitives and composables where it improves consistency
- avoid leaking internal coordination details into the public API

## Validation

Before closing a documentation or public-surface change:

- review links and cross-doc references
- verify props/slots/emits against component code
- verify attrs against `processedAttrs.ts` and component CSS

## Publishing to npm

The package is prepared to publish as `@pisandelli/daredash`.

Recommended release flow:

1. Ensure you are authenticated with npm:
   `npm login`
2. Build the package artifact:
   `pnpm --filter @pisandelli/daredash prepack`
3. Review the published contents:
   `cd modules/daredash && npm pack --dry-run`
4. Publish the package:
   `npm publish --access public`

Notes:

- the first public publish for a scoped package must include public access
- the module consumer installs `@pisandelli/daredash`, but the Nuxt config key remains `daredash`
- run the relevant checks for the changed area

Useful checks include:

```bash
pnpm --dir modules/daredash run lint:ts
pnpm --dir modules/daredash run test:studio
```

## Practical contribution rules

- Keep `README.md` consumer-first and `README.DEV.md` maintainer-first.
- Keep human docs aligned with the real code, not with assumptions from other UI libraries.
- Keep `llms.txt` aligned when the public API changes.
- Prefer adding tokens and semantic attrs over one-off visual exceptions.
- Preserve the distinction between public API and internal tooling.
