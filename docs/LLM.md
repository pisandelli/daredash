# daredash - Compact AI Guide

This file remains as a compact companion to `modules/daredash/llms.md`.

Use `llms.md` as the detailed source of truth. Use this file when a shorter architectural summary is enough.

## 1. Core architecture

`daredash` is a Nuxt-first UI module with two main layers:

- **Build phase (`src/`)**
  - parses tokens
  - generates CSS variables
  - configures the PostCSS `v()` function
  - registers components
- **Runtime phase (`runtime/`)**
  - contains Vue/Nuxt components
  - contains composables
  - contains CSS Modules
  - contains Studio tooling

## 2. Prefixing

The module uses a configurable prefix for:

- registered components
- generated CSS variables

Default prefix: `dd`

Examples:

- component: `DdButton`
- CSS variable: `--dd-color-primary`

If a project changes the prefix, generated code must change accordingly.

## 3. Token rules

Tokens are defined in JSON files and are transformed into CSS custom properties.

Inside module CSS:

- use `v('color.primary')`
- do not manually hardcode `var(--dd-color-primary)` when authoring the library CSS

## 4. Styling rule

Prefer token layering over brute-force overrides.

Recommended order:

1. global token
2. component token mapping
3. local override

Avoid `!important` unless there is a very strong reason outside the normal component system.

## 5. Public vs internal usage

Safe public usage:

- auto-registered components
- `useToaster`
- module options: `tokens`, `prefix`, `debug`
- icon overrides in `appConfig.daredash.icons`

Internal or tooling-only:

- `useThemeEditor`
- `useBaseComponent`
- `runtime/shared/utils/*`
- `src/*`
- `#dd/*` aliases as a primary consumer API

## 6. Forms

There are two form layers:

- primitive inputs such as `DdInput`, `DdSelect`, `DdCheckbox`
- `Form*` wrappers integrated with `vee-validate`

Examples:

- `DdInput`
- `DdFormInput`

## 7. Feedback

Notifications use:

- `DdToaster`
- `useToaster`

Place a single `DdToaster` near the root of the app.

## 8. Icons

The library uses `@nuxt/icon`.

Icon names are configured through `appConfig.daredash.icons`.

## 9. Validation routine

After TypeScript-oriented code changes:

```bash
pnpm --dir modules/daredash run lint:ts
```

After Studio-related changes:

```bash
pnpm --dir modules/daredash run test:studio
```
