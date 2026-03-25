# Project Rules (DareDash Module)

These rules are strict and must be followed to maintain the project's architecture, which relies on dynamic prefixing and a token-driven design system.

## 1. Dynamic Prefix System
*   **NEVER hardcode the project prefix** (e.g., do not write `dd-button` or `--dd-color`).
*   **ALWAYS use `getPrefixName`**:
    *   To resolve internal components: `resolveComponent(getPrefixName('Box', { type: 'component' }))`.
    *   To generate CSS variables: `getPrefixName('color-primary', { type: 'css-var-decl' })`.
*   **Context**: The prefix is configurable (default: `dd`). The system must work flawlessly if the prefix changes to something else (e.g., `acme`).

## 2. Styling (PostCSS & Tokens)
*   **Module Files Only**: All styles must reside in `runtime/assets/styles/components/*.module.css`.
*   **NO Scoped Styles**: Do not use `<style scoped>` in Vue components.
*   **Import via alias**: Import CSS modules using the `#dd/styles` alias:
    *   `import styles from '#dd/styles/Button.module.css'`
*   **Token Usage**:
    *   **NEVER hardcode values** (colors, spacing, borders).
    *   **ALWAYS use the `v()` function**: `color: v('color.primary');`
    *   The `v()` function is processed at build time by the PostCSS plugin `postcss-v-function`, compiling to `var(--prefix-token-name, fallback)`.
    *   **Modern CSS is allowed directly**: Do NOT use `unquote()`. Write `hsl(from ...)`, `color-mix(...)`, `repeat(auto-fit, ...)` natively.
    *   **New Tokens**: If a value is missing, **CREATE a new global token** in `default-theme.tokens.json` instead of hardcoding it.
*   **State Management**:
    *   Use **Data Attributes** for styling visual variants (e.g., `&[data-compact]`, `&[data-success]`).
    *   Do NOT toggle classes manually. Let CSS selectors handle the state based on attributes.
    *   **Boolean Attributes**: Attributes with `false` value are **stripped** from the DOM by `processAttrs`. This allows cleaner CSS selectors (e.g., `&[data-primary]` matches only true).
    *   **CSS State Cascade**: When modifying an internal primitive's behavior based on a parent's state variant (e.g., `Pagination` passing `compact` logic to an internal `DdCluster`), do **NOT** use JS reactive logic or Vue props to bind this behavior conditionally. Instead, the parent must orchestrate the child's reaction entirely through the CSS cascade by overriding the child's `--local-` tokens. *Example*: `&[data-compact] > .list { --local-gap: 0; }`.
*   **Token Layering (The "Leak-Proof" Rule)**:
    *   Local Scope: Inside the component class, map global tokens to local variables starting with `--local-`.
    *   Example: `.badge { --local-bg: v('badge-bg'); background: var(--local-bg); }`
    *   This ensures styles don't leak and allows safe external overrides via the public token.
    *   **Public Token Layer (The Golden Rule)**:
    *   Do NOT map local variables directly to global tokens (e.g., `v('color.gray')`).
    *   ALWAYS map local variables to a **specific component token** (e.g., `v('accordion.border-color')`).
    *   This empowers the `default-theme.tokens.json` to be the single source of truth for component theming.

## 3. CSS Modern Best Practices (MANDATORY)
*   **Logical Properties**: ALWAYS replace physical directions.
    *   `top/bottom` -> `block-start/block-end`
    *   `left/right` -> `inline-start/inline-end`
    *   `width/height` -> `inline-size/block-size`
*   **Layout Composition**:
    *   **No Component Margins**: Components must be layout-agnostic. Use `<Stack>`, `<Cluster>`, or `<Grid>` to manage spacing.
    *   **Gap over Margin**: ALWAYS use `gap` for spacing siblings.
    *   **Primitive Reuse (DRY)**: When composing complex widgets (e.g., `InputGroup`), ALWAYS leverage internal layout components (`DdCluster`, `DdStack`) dynamically via `resolveComponent(getPrefixName(...))` instead of re-declaring flexbox properties (`display: flex`, `align-items`) directly in `.module.css`.
*   **Defensive CSS**:
    *   `min-width: 0` on flex/grid children.
    *   `flex-wrap: wrap` by default.
    *   `object-fit: cover` for images.

## 4. Component Architecture
*   **SFC Order**: Script Setup -> Template (HTML) -> Style (CSS Module import, if any).
*   **Base Component Pattern**: All primitives must use the `useBaseComponent` composable to handle attribute inheritance and class merging.
*   **Definition**: Use `defineNuxtComponent` for all components.
*   **Templates**: Use standard **HTML** templates. Do NOT use Pug.
*   **Inherit Attrs**: Set `inheritAttrs: false` to allow `useBaseComponent` to manage them.
*   **Documentation**: JSDoc is MANDATORY for all props. "Teaching comments" (tutorials) are forbidden.
*   **Data Integrity**: Business logic, filtering, facets, counts, and exports must read from normalized/raw data sources, not from UI-facing view models that may truncate, format, or fallback values for display.
*   **Payload Mapping**: If multiple surfaces need the same payload-derived values, extract shared mapper/normalizer helpers instead of re-implementing parsing in pages or widgets.
*   **Complexity Limit**: No "God Components". Split any file > **300 lines**.
*   **Refactoring Consistency**: When refactoring component state semantics, rename related events, injected context keys, documentation, and debug logs in the same change.

## 5. UX Engineering (The 5 States)
Every data-driven or interactive component **MUST** visually handle:
1.  **Loading**: Skeleton loaders or spinners.
2.  **Error**: Retry actions and clear error messages.
3.  **Empty**: "No results" states with actionable feedback. Model page states explicitly (initial, loading, empty, ready, error) and avoid reusing the same UI block for semantically different empty states (e.g., "No search results" vs "No data available").
4.  **Ideal**: The content itself.
5.  **Partial**: Pagination or "Load More" controls (where applicable).

## 6. HTML & Semantics (No-JS First)
*   **Modals**: Use `<dialog>`.
*   **Popups**: Use `popover` API.
*   **Accordions**: Use `<details name="group">`.
*   **Forms**: Use `<inputmode>`, `<enterkeyhint>`, and `<search>` where appropriate.
*   **Images**: `<NuxtImg>` is **Preferred** over `<img>` (investigate local module resolution issues if using).
*   **Lightweight Hints**: For lightweight hover hints on interactive text/badges, prefer native `title` plus accessible labeling before introducing a custom tooltip primitive.

## 7. Directory Structure
*   **Primitives**: (`runtime/components/primitives/`) for foundational UI elements (Button, Badge, Box).
*   **Widgets**: (`runtime/components/widgets/`) for composed/interactive logic (Modal, Accordion). *Formerly "Complex"*.
*   **Styles**: (`runtime/assets/styles/components/`) matching the component name.

## 8. Forms
*   **Validation**: All form components must integrate with **VeeValidate** using `useField`.

## 9. Customization Strategy
*   **The Golden Hierarchy**:
    1.  **Variants**: Use semantic props/attributes first (e.g., `<Button success>`, `<Stack compact>`).
    2.  **Token Overrides (Class-based)**:
        *   To customize deeper, create a CSS class that overrides the **Public Token**.
        *   *Example*: `.brand-button { --dd-button-bg: var(--dd-color-brand); }`
        *   ⚠️ The `dd` prefix in the example above is the **default**. If the module is configured with a custom prefix (e.g., `acme`), the variables will be `--acme-button-bg` and `--acme-color-brand`. Always use the prefix configured by the consumer; assume `dd` only as the default fallback.
        *   **Avoid**: Creating new BEM modifiers like `.button--brand` that duplicate CSS properties.
    3.  **Utilities**: Use helper classes for minor layout/spacing tweaks.

## 10. Props vs Attributes (The Separation of Concerns)
*   **Props**: Use strictly for **DATA** passing (e.g., `src`, `label`, `modelValue`).
*   **Attributes**: Use boolean attributes for **STYLING** and **STATE**.
    *   *Do*: `<Avatar square large online />`
    *   *Avoid*: `<Avatar variant="square" size="lg" status="online" />`
*   **Sizing Convention**: Always use the full word for size boolean attributes (e.g., `small`, `large`) rather than abbreviations (e.g., `sm`, `lg`) to maintain consistency across the UI module.
*   **Mechanism**: The `useBaseComponent` + `processAttrs` utilities automatically prefix these known attributes with `data-` (e.g., `data-square`, `data-online`) for CSS targeting.
*   **The Accessibility Exception**: Attributes that dictate native browser behavior and accessibility (e.g., `disabled`, `readonly`, `hidden`, `required`) **MUST NOT** be added to the `customAttributes` list in `processedAttrs.ts`. They must remain native HTML attributes (`<button disabled>`) and be styled in CSS directly via attribute selectors (`&[disabled]`), rather than `data-` variants, to preserve screen reader and keyboard functionality.
*   **Semantic Alignment**: Toggle controls must use one semantic model consistently: state names, emitted payloads, labels, icons, and ARIA attributes must all describe the same state.

## 11. Testing Protocol (Vitest)
*   **Language Protocol**: Tests are part of the core codebase and MUST ALWAYS be written in **English** (Descriptions, variables, asserts, mock data).
*   **Framework**: Use `@nuxt/test-utils/vitest` combined with `@vue/test-utils` for Nuxt-aware component testing.
*   **Test Contract over Implementation**: For UI primitives, do NOT test CSS styling rules (checking if a color is `#f00`). DO test the "Component Contract":
    1. Verify dynamic `data-` attributes generated by useBaseComponent/`processAttrs` for boolean props (e.g., `<Button success>` sets `data-success`).
    2. Verify slot rendering and dynamic component resolution (e.g. `nuxt-link` vs `a`).
    3. Verify emitted events (e.g., `@click`, `update:modelValue`).
    4. Verify state behavior under invalid or disabled properties.
*   **What to Test**: Write tests for any component that involves logical branching, dynamic attributes, event emissions, or internal state (e.g., `Button`, Input, `Avatar`, `Card`).
*   **What NOT to Test**: Do NOT write unit tests for purely structural layout primitives (e.g., `Box`, `Stack`, `Cluster`) that have no internal JS logic and act merely as CSS class wrappers. Their functionality is inherently covered by the `useBaseComponent` tests.

## 12. Iconography (Agnostic Architecture)
*   **The Golden Rule**: The `daredash` UI module is **Icon-Agnostic**. It delegates the icon rendering entirely to the consumer via `@nuxt/icon`.
*   **Consumers**: Developers consuming the module can pass any valid `@nuxt/icon` string to the `icon` prop (e.g., `mdi:home`, `lucide:check`, `solar:user`).
*   **Internal Fallbacks**: Interactive components (like `Toast`, `Modal`, `Select`) provide internal agnostic fallbacks using `heroicons:` out of the box. These global default strings can be overridden seamlessly via the Nuxt `app.config.ts` (`appConfig.doubledash.icons`).
*   **Module Dependencies**: The ONLY icon library forcefully shipped as a hard dependency inside the module is `@iconify-json/svg-spinners` for the `Loading` component default.
*   **Internal App & Tests**: By convention, our internal playground (`app/`) and Unit Tests use `heroicons:` (and `heroicons-solid:` for buttons), but this is strictly a documentation standard, NOT a module constraint.
