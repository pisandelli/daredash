# daredash Module - Developer Guide

This guide is intended for contributors and maintainers of the `daredash` Nuxt module. It details the internal architecture, core utilities, and coding standards.

## Architecture Overview

The module is split into two main phases:

1.  **Build Phase (`src/`)**: Runs during `nuxt prepare` or `nuxt dev`. It handles parsing tokens, configuring PostCSS, and generating component wrappers.
2.  **Runtime Phase (`runtime/`)**: Code that runs in the consumer application. Contains Vue components, composables, and shared utilities.

### Directory Structure

```
modules/daredash/
├── module.ts           # Entry point. Defines options, hooks, and setup.
├── components.config.ts # Component definitions map (name, style path, file path).
├── src/
│   ├── builder/        # Build-time logic.
│   │   ├── components.ts # Component orchestration and factory.
│   │   └── tokens.ts     # Token parsing and CSS generation.
│   ├── postcss/        # Custom PostCSS plugins (v-function).
│   └── utils/          # Build-time utilities.
└── runtime/
    ├── assets/
    │   └── styles/
    │       ├── components/ # CSS Modules (.module.css).
    │       └── tokens/     # Source token JSON files.
    ├── components/     # Vue component implementations (TS or SFC).
    ├── composables/    # runtime logic (useBaseComponent).
    └── shared/
        └── utils/
            ├── getPrefixName.ts  # Dynamic naming & CSS var resolution.
            └── processedAttrs.ts # Attribute mapping & prefixing.
```

## Key Concepts

### 1. Dynamic Prefixes
The module supports a configurable prefix (default: `dd`). This is handled by **`getPrefixName`**.

- **CSS Variables**: Generates `--dd-color-primary`.
- **Component Names**: Generates `DdButton`.
- **Runtime Resolution**: Consumers can resolve components and variables using the current prefix without hardcoding.

**Implementation**:
- **Build Time**: `module.ts` passes the prefix to the builder, which registers components using Nuxt's `addComponent`.
- **Runtime**: `runtimeConfig.public.daredash` exposes the prefix. `getPrefixName` consumes this to resolve names dynamically.

### 2. Design Tokens Architecture
The module consumes JSON files to build the design system. The `tokens` setting in `module.ts` can point to a **single JSON file** or a **Directory of JSON files**.
- **Directory Support**: If a directory is provided, the module recursively finds all `.json` files and performs an in-memory Deep Merge.
- **File Namespace Matching**: The directory structure dictates the JSON namespace. A file at `components/button.json` is automatically injected into the `{"components": {"button": {...}}}` object.

### 3. PostCSS `v()` Hook
We use a custom PostCSS plugin (`postcss-v-function`) to handle design tokens in CSS.

- **Function**: `color: v('color.primary');`
- **Output**: `color: var(--dd-color-primary, #fallback);`
- **Native Support**: Unlike Stylus/Sass, this runs in the standard PostCSS pipeline, allowing us to use native modern CSS features like `color-mix()` and `hsl` Relative Color Syntax directly.

### 3. Core Utilities

#### `processedAttrs`
Maps boolean properties and standard attributes to `data-*` attributes for styling.
- **Boolean mapping**: `<Button primary>` -> `data-primary`.
- **Security**: Strips `false` values to prevent selector mismatches.
- **Stability**: Excludes native accessibility attributes (`disabled`, `required`, etc.) to preserve browser behavior.

#### `baseComponent`
A high-order component factory for **Functional Components**.
- Orchestrates `processedAttrs`.
- Binds CSS Modules automatically.
- Ensures consistent attribute inheritance and class merging.

## Component Architecture

### Functional Components (TS) vs SFC
- **Functional (Pure TS)**: Preferred for foundational **Primitives** (Buttons, Badges, Layouts). They are faster, lighter, and keep styling logic strictly in `.module.css`.
- **SFC (Vue)**: Reserved for complex **Widgets** or components with heavy internal logic, intricate templates, or third-party integrations (e.g., specific form wrappers with VeeValidate).

### Token Layering (The Golden Rule)
To prevent style leaks and allow safe overrides:
1.  **Global Token**: Defined in `default-theme.tokens.json`.
2.  **Component Token**: Defined in CSS mapping the global token.
3.  **Local Scope**: Inside the component, map to a `--local-` variable.
    ```css
    .button {
      --local-bg: v('button.bg');
      background: var(--local-bg);
    }
    ```

## Code Standards

### 1. Templates & Styling
- **HTML**: Standard HTML templates only.
- **PostCSS**: CSS Modules (`.module.css`) are mandatory. No global/scoped `<style>` tags in SFCs.
- **Logical Properties**: ALWAYS replace physical directions (e.g., `padding-inline-start` instead of `padding-left`).

### 2. UX Engineering (The 5 States)
Every data-driven or interactive component **MUST** visually handle:
1.  **Loading**: Skeletons or spinners.
2.  **Error**: Clear messages and retry actions.
3.  **Empty**: Status feedback for "No Results".
4.  **Ideal**: The standard content.
5.  **Partial**: Scenarios like pagination or "Load More".

## Iconography (Agnostic)
The module is icon-agnostic. It provides defaults (usually `heroicons:`) but allows consumers to override any icon key via `appConfig.daredash.icons` using any `@nuxt/icon` compatible string.

## Contributing

### Creating a New Component

1. **Choose the right directory**:
   - `runtime/components/primitives/` - For simple, foundational components (Button, Badge, etc.)
   - `runtime/components/widgets/` - For complex, stateful components (Modal, Table, etc.)

2. **Create the component file**:
   - Use `defineNuxtComponent` for all components
   - Set `inheritAttrs: false` and use `useBaseComponent`

3. **Create the CSS Module**:
   - File: `runtime/assets/styles/components/{ComponentName}.module.css`
   - Use `v('token.path')` for all token values
   - Use logical properties (block-start, inline-start, etc.)

4. **Register the component**:
   - Add to `components.config.ts` for automatic registration

5. **Create tokens** (if needed):
   - File: `runtime/assets/styles/tokens/default-theme/components/{component}.json`

### Running Tests

```bash
# Run all tests
pnpm test

# Run specific component tests
pnpm test -- modules/daredash/test/components/primitives/Button.spec.ts
```

### Code Style Rules

All contributors should follow the rules defined in `.agent/rules/code-style.md`:

- Use `getPrefixName` for dynamic prefixing (never hardcode "dd-")
- Use JSDoc for all props
- Keep components under 300 lines
- Use data attributes for styling variants
- Follow the 5 States rule (Loading, Error, Empty, Ideal, Partial)

### Before Submitting a PR

1. Run tests: `pnpm test`
2. Verify all props have JSDoc documentation
3. Check that the component is under 300 lines
4. Ensure CSS uses tokens via `v()` function
5. Add unit tests for components with logic branching
