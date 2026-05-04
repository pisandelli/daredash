# `daredash` LLM Guide

## 1. Library overview

`daredash` is a Nuxt module for UI and design tokens. The module combines:

- build-time code in `src/` for token parsing, CSS variable generation, the PostCSS `v()` plugin, and component registration;
- runtime code in `runtime/` for Vue/Nuxt components, composables, styles, and Studio;
- a declarative component catalog in `components.config.ts`.

The library's default prefix is `dd`. With this default configuration, components are registered with names such as `DdButton`, `DdInput`, and `DdTabs`.

All examples in this file assume `prefix: 'dd'`.

If a consuming project changes the module `prefix`, the AI must adjust:

- the registered component names;
- the generated CSS variable names;
- any example in this file that uses the default prefix.

Example:

```ts
prefix: 'acme'
```

This implies names such as:

- `AcmeButton`
- `--acme-color-primary`

## 2. Nuxt installation and configuration

### Installation

```bash
pnpm add daredash
```

Inferred from the code and existing documentation: the library is intended to be used as a Nuxt module, not as a generic standalone Vue package.

### Minimal configuration

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

Example with custom tokens in the consuming app:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    [
      'daredash',
      {
        tokens: './tokens',
        prefix: 'dd'
      }
    ]
  ]
})
```

### Module options

- `tokens?: string`
  - path to a JSON token file or directory;
  - default: `./runtime/assets/styles/tokens/default-theme`
- `prefix?: string`
  - prefix for components and CSS variables;
  - default: `dd`
- `debug?: boolean`
  - enables internal build logs;
  - default: `false`

### Dependencies registered by the module

Confirmed in `module.ts`:

- `@nuxt/fonts`
- `@nuxt/icon`
- `@vee-validate/nuxt`

### Effects of the module in a Nuxt app

Confirmed in `module.ts`:

- auto-registers components;
- injects `runtime/assets/styles/reset.css`;
- adds auto-imports from `runtime/composables`;
- registers technical aliases:
  - `#dd/utils`
  - `#dd/styles`
  - `#dd/composables`
  - `#dd/types`
- exposes `runtime/public` as a Nitro public asset;
- registers the `/studio` route;
- adds a Nuxt DevTools tab for Studio;
- exposes `runtimeConfig.public.daredash.prefix`.

### Icon configuration

Confirmed in `module.ts` and `src/types.ts`: the module populates `appConfig.daredash.icons`.

Keys explicitly typed in `src/types.ts`:

- `success`
- `error`
- `warning`
- `info`
- `toastClose`
- `selectArrow`
- `modalClose`

Keys also read directly by runtime components:

- `search`
- `loading`
- `tableError`
- `emptyTable`
- `paginationPrev`
- `paginationNext`
- `drawerClose`

Example:

```ts
// app.config.ts
export default defineAppConfig({
  daredash: {
    icons: {
      modalClose: 'mdi:close',
      selectArrow: 'mdi:chevron-down'
    }
  }
})
```

### Restart after changing the prefix

Inferred from the code: changing `prefix` requires restarting the dev server so component registration and CSS variable generation update correctly.

## 3. General rules for AI usage

### Confirmed

- Use the library as a Nuxt module.
- Assume auto-registered components with the configured prefix.
- In examples, prefer `DdButton`, `DdInput`, `DdTabs`, etc. with the default prefix.
- For CSS inside the module itself, use `v('token.path')` instead of manually writing `var(--dd-...)`.
- Use variants through recognized attrs/flags, not through a generic `variant` prop.
- Use `useToaster` as a public runtime composable.
- Treat `useThemeEditor` as a Studio tool, not as a general public API.
- Do not treat `useBaseComponent` or `runtime/shared/utils/*` as public APIs.
- Do not treat `#dd/*` aliases as the primary recommended app-consumer API.
- Do not assume official support outside Nuxt.

### Inferred from the code

- The preferred pattern is composing richer widgets from internal primitives, especially `Box`, `Stack`, and `Cluster`.
- The visual system is based on CSS Modules + tokens + `data-*` attrs.
- Naming follows `PascalCase` for registered component names.

### Project direction

- Custom classes are technically accepted.
- There is no strict formal rule for `class`.
- Use common sense and avoid utility classes from external libraries such as Tailwind or Bootstrap when they conflict with the component’s visual layer.

### When in doubt

- Do not invent props, emits, slots, or unsupported runtime/theme behavior.
- If something is not explicit, write `TODO`.

## 4. Available public APIs

### Public

- Nuxt module `daredash`
- components listed in `components.config.ts`
- `useToaster`
- icon configuration through `appConfig.daredash.icons`
- module options:
  - `tokens`
  - `prefix`
  - `debug`

### Internal

- `src/*`
- `runtime/shared/utils/*`
- `runtime/composables/useBaseComponent.ts`
- `runtime/components/widgets/Menu/useMenu*.ts`
- `runtime/composables/useThemeEditor.ts`
  - current use: Studio
  - do not treat as a general public application API

## 5. Library core

### Build phase

Main files:

- `src/parser.ts`
- `src/builder/tokens.ts`
- `src/builder/components.ts`
- `src/postcss/postcss-v-function.ts`
- `src/typedTokens.client.ts`
- `src/utils/resolveTokenPaths.ts`
- `src/utils/token-merger.ts`
- `src/utils/tokens.ts`

Responsibilities:

- read JSON tokens;
- resolve `{token.path}` references;
- generate CSS custom properties;
- generate `[data-theme="..."]` themes;
- register typed tokens on the client;
- register components in Nuxt;
- enable the PostCSS `v()` function.

### Runtime phase

Main folders:

- `runtime/components/`
- `runtime/composables/`
- `runtime/assets/styles/`
- `runtime/shared/`
- `runtime/studio/`
- `runtime/pages/studio.vue`

## 6. Design tokens and theme

### Structure

Confirmed:

- default tokens in `runtime/assets/styles/tokens/default-theme/`
- primitive tokens in `primitives.json`
- themes in `themes.json`

### How tokens work

Confirmed in `src/parser.ts` and `src/builder/tokens.ts`:

- simple tokens generate CSS variables;
- typed tokens support `CSS.registerProperty`;
- references such as `{color.primary.600}` resolve to prefixed CSS variables;
- themes are emitted as `[data-theme="light"]`, `[data-theme="dark"]`.

### Rules for module CSS

Confirmed:

- inside module CSS, use `v('token.path')`;
- the library uses PostCSS to transform `v()` into `var(--prefix-...)`.

Correct:

```css
.button {
  color: v('color.text');
}
```

Incorrect:

```css
.button {
  color: var(--dd-color-text);
}
```

Note: the incorrect example above applies to CSS authored inside the library. In consuming apps, using the generated CSS variables directly is still possible.

### Theme strategy

Confirmed:

- there is theme infrastructure via `data-theme`;
- Studio uses this infrastructure for previews and override export.

Current state:

- runtime theme switching is currently more tied to Studio than to a fully consolidated public app flow.

### Global variants and sizes

Confirmed in `runtime/shared/utils/processedAttrs.ts`:

- globally recognized semantic variants:
  - `primary`
  - `accent`
  - `success`
  - `warning`
  - `danger`
  - `error`
  - `info`
- globally recognized sizes:
  - `tiny`
  - `small`
  - `regular`
  - `medium`
  - `large`
  - `xlarge`
  - `xxs`

Inferred from the code:

- `primary`, `accent`, `success`, `warning`, `danger`, and `info` are public variants reused across multiple components;
- `danger` and `error` coexist by semantic intent;
- there is no formal global size scale that applies uniformly to all components.

## 7. Composables

### `useToaster`

File: `runtime/composables/useToaster.ts`

Usage:

```ts
const { notifications, showToast, dismissToast } = useToaster()
```

Confirmed API:

- `notifications`
  - global reactive toast state
- `showToast(message: string, options?: Partial<Omit<ToastMessage, 'id' | 'message'>>)`
- `dismissToast(id: string)`

Internal defaults:

- `type: 'info'`
- `position: 'top-right'`
- `duration: 5000`

### `useThemeEditor`

File: `runtime/composables/useThemeEditor.ts`

Status:

- current use: Studio
- internal/tooling
- do not treat as a general public composable

What it does:

- manages literal values and token references;
- generates preview CSS with the current prefix;
- exports token overrides as JSON;
- enables download of `custom-theme.tokens.json`.

### `useBaseComponent`

File: `runtime/composables/useBaseComponent.ts`

Status:

- internal

Do not document as an application API.

## 8. Component documentation

### Import rule for all components

Confirmed in `module.ts` and `src/builder/components.ts`:

- after installing the module, components are auto-registered;
- with `prefix: 'dd'`, the registered name is `DdXxx`.

Inferred from the code:

- using `DdXxx` in templates is the safest and most explicit path for AI;
- there is no public barrel for direct import from internal files;
- do not import from `runtime/components/...` in consuming application code.

---

## Layout

### `DdBox`

- Description: generic layout wrapper. Inferred from the code.
- When to use: group content and apply attrs/semantics via `tag`.
- When not to use: when another layout primitive expresses the intent more clearly.
- Import: auto-registered by the module.
- Props: `tag?: string = 'div'`.
- Emits: none explicitly declared.
- Slots: `default`.
- Correct example: `<DdBox tag="section">Content</DdBox>`.
- Incorrect example: `<DdBox><template #header>Title</template></DdBox>`.
- Accessibility notes: adjust `tag`, `role`, and ARIA as needed.
- Restrictions: relevant variant `nogap`; unknown attrs fall through.

### `DdCenter`

- Description: primitive for centering content. Inferred from the code.
- When to use: block/content centering.
- When not to use: when you need more specific flex alignment.
- Import: auto-registered by the module.
- Props: `tag?: string = 'div'`.
- Emits: none explicitly declared.
- Slots: `default`.
- Correct example: `<DdCenter><DdCard>Centered</DdCard></DdCenter>`.
- Incorrect example: `<DdCenter><template #footer>Footer</template></DdCenter>`.
- Accessibility notes: change `tag` if the wrapper needs semantics.
- Restrictions: relevant variant `intrinsic`.

### `DdCluster`

- Description: primitive for horizontal grouping with gap and wrap. Inferred from the code.
- When to use: action groups, badges, filters.
- When not to use: when the main intent is vertical stacking.
- Import: auto-registered by the module.
- Props: `tag?: string = 'div'`.
- Emits: none explicitly declared.
- Slots: `default`.
- Correct example: `<DdCluster between><DdButton>A</DdButton><DdButton>B</DdButton></DdCluster>`.
- Incorrect example: `<DdCluster><template #actions><DdButton>A</DdButton></template></DdCluster>`.
- Accessibility notes: neutral; semantics depend on `tag`.
- Restrictions: relevant attrs `start`, `center`, `end`, `between`, `around`, `evenly`, `narrow`, `wide`, `nowrap`, `stretch`, `nogap`.

### `DdGrid`

- Description: grid primitive. Inferred from the code.
- When to use: lists, dashboards, cards.
- When not to use: when flex/stack is a better fit.
- Import: auto-registered by the module.
- Props: `tag?: string = 'div'`.
- Emits: none explicitly declared.
- Slots: `default`.
- Correct example: `<DdGrid><DdCard>A</DdCard><DdCard>B</DdCard></DdGrid>`.
- Incorrect example: `<DdGrid><template #empty>No items</template></DdGrid>`.
- Accessibility notes: neutral; use an appropriate `tag` when needed.
- Restrictions: no explicit props other than `tag`.

### `DdLayout`

- Description: page/section layout primitive. Inferred from the code.
- When to use: main composition with sidebar/body.
- When not to use: simple alignment tasks.
- Import: auto-registered by the module.
- Props: `tag?: string = 'div'`.
- Emits: none explicitly declared.
- Slots: `default`.
- Correct example: `<DdLayout><DdSidebar /><DdBox /></DdLayout>`.
- Incorrect example: `<DdLayout><template #header>Top</template></DdLayout>`.
- Accessibility notes: prefer semantic wrappers such as `tag="main"` when appropriate.
- Restrictions: the CSS observes descendants marked with `body` and `fill`; this is not an explicit component prop.

### `DdStack`

- Description: primitive for vertical stacking. Inferred from the code.
- When to use: forms, cards, panels, sections.
- When not to use: when the primary flow is horizontal.
- Import: auto-registered by the module.
- Props: `tag?: string = 'div'`.
- Emits: none explicitly declared.
- Slots: `default`.
- Correct example: `<DdStack compact><DdFormLabel>Email</DdFormLabel><DdInput /></DdStack>`.
- Incorrect example: `<DdStack><template #header>Top</template></DdStack>`.
- Accessibility notes: neutral; adjust `tag` to fit the context.
- Restrictions: relevant attrs `compact`, `spaced`, `recursive`, `nogap`, `split-after`, `reverse`.

### `DdSidebar`

- Description: sidebar/content layout primitive. Inferred from the code.
- When to use: lateral navigation, filters, secondary panels.
- When not to use: when there is no sidebar/content relationship.
- Import: auto-registered by the module.
- Props: `tag?: string = 'div'`.
- Emits: none explicitly declared.
- Slots: `default`.
- Correct example: `<DdSidebar><DdMenu :items="items" /></DdSidebar>`.
- Incorrect example: `<DdSidebar><template #aside>Filter</template></DdSidebar>`.
- Accessibility notes: use semantic wrappers when needed.
- Restrictions: relevant attrs `start`, `end`, `right`, `fill`, `nogap`.

---

## Primitives

### `DdCard`

- Description: container with `header`, `body`, and `footer` regions.
- When to use: group related content with clear visual framing.
- When not to use: small groupings that do not need framing.
- Import: auto-registered by the module.
- Props: no explicit props.
- Emits: none explicitly declared.
- Slots: `header`, `default`, `footer`.
- Correct example: `<DdCard><template #header>Title</template>Content<template #footer><DdButton>Save</DdButton></template></DdCard>`.
- Incorrect example: `<DdCard><template #actions><DdButton>Save</DdButton></template></DdCard>`.
- Accessibility notes: the semantics of inner content depend on the elements used in the slots.
- Restrictions: relevant attrs `flat`, `noborder`.

### `DdBadge`

- Description: short label for status, count, or metadata.
- When to use: short and compact states.
- When not to use: as a button or primary interactive element.
- Import: auto-registered by the module.
- Props:
  - `icon?: string`
  - `color?: string`
- Emits: none explicitly declared.
- Slots: `default`.
- Correct example: `<DdBadge success icon="heroicons:check">Active</DdBadge>`.
- Incorrect example: `<DdBadge :count="3" />`.
- Accessibility notes: does not replace a fuller status description when that is needed.
- Restrictions: supports semantic variants; `color` allows direct customization.

### `DdBreadcrumb`

- Description: breadcrumb trail.
- When to use: hierarchical pages and contextual navigation.
- When not to use: menus or sidebar navigation.
- Import: auto-registered by the module.
- Props:
  - `config: { separator?: string; routes: BreadcrumbItem[] }`
- Emits: none explicitly declared.
- Slots: none explicitly declared.
- Correct example: `<DdBreadcrumb :config="{ routes: [{ label: 'Home', to: '/' }, { label: 'Account', to: '/account' }] }" />`.
- Incorrect example: `<DdBreadcrumb :items="items" />`.
- Accessibility notes: uses real links and sanitizes `href`; prefer clear labels.
- Restrictions: `config` is required.

### `DdProgress`

- Description: linear progress bar.
- When to use: determinate progress or indeterminate activity.
- When not to use: simple boolean states.
- Import: auto-registered by the module.
- Props:
  - `value?: number`
  - `min: number = 0`
  - `max: number = 100`
  - `color?: string`
  - `ranges?: ProgressRange[]`
  - `label?: string`
  - `indeterminate: boolean = false`
- Emits: none explicitly declared.
- Slots:
  - `label`
  - `tooltip` with scope `{ percentage }`
- Correct example: `<DdProgress :value="42" label="Upload" />`.
- Incorrect example: `<DdProgress :current="42" />`.
- Accessibility notes: uses `role="progressbar"`; keep `min`, `max`, and `value` coherent.
- Restrictions: sizes/variants via attrs `tiny`, `small`, `large`, `xlarge`, `primary`, `success`, `warning`, `danger`, `info`.

### `DdAlert`

- Description: contextual message, optionally dismissible.
- When to use: inline feedback for success, error, warning, or information.
- When not to use: transient global notifications; use `DdToast`/`DdToaster` instead.
- Import: auto-registered by the module.
- Props:
  - `modelValue: boolean = true`
  - `color?: string`
  - `title?: string`
  - `closable: boolean = true`
  - `icon: boolean | string = false`
- Emits:
  - `update:modelValue`
  - `close`
- Slots:
  - `title`
  - `default`
- Correct example: `<DdAlert warning title="Attention" closable>Review the fields.</DdAlert>`.
- Incorrect example: `<DdAlert v-model:open="isOpen" />`.
- Accessibility notes: uses `role="alert"`; prefer short and clear messages.
- Restrictions: supports semantic variants and `color`.

### `DdButton`

- Description: primary/secondary action; can render an internal or external link.
- When to use: actions and CTAs.
- When not to use: complex navigation with persistent active state; consider `DdMenu` or `DdTabs`.
- Import: auto-registered by the module.
- Props:
  - `color?: string`
  - `icon?: string`
  - `to?: string | object`
  - `href?: string`
- Emits: none explicitly declared.
- Slots: `default`.
- Correct example: `<DdButton primary icon="heroicons:plus">New</DdButton>`.
- Correct example: `<DdButton href="https://example.com">Open</DdButton>`.
- Incorrect example: `<DdButton variant="primary">Save</DdButton>`.
- Accessibility notes: use visible text; if using `icon-only`, provide `aria-label`.
- Restrictions: relevant variants/attrs `full`, `ghost`, `outline`, `icon-right`, `icon-only`, `tiny`, `small`, `large`, `xlarge`, semantic attrs, and `color`.

### `DdInput`

- Description: styled text input.
- When to use: short text, email, password, or number input as a simple field.
- When not to use: long-form text or richer fields; use `DdTextarea` or another component.
- Import: auto-registered by the module.
- Props:
  - `name?: string`
  - `label?: string`
  - `type: string = 'text'`
  - `id?: string`
  - `placeholder: string = ''`
  - `icon?: string`
  - `iconRight?: string`
  - `modelValue?: string | number`
  - `isInvalid: boolean = false`
  - `errorMessage?: string`
- Emits:
  - `update:modelValue`
- Slots: none explicitly declared.
- Correct example: `<DdInput v-model="email" name="email" type="email" label="Email" />`.
- Incorrect example: `<DdInput :options="options" />`.
- Accessibility notes: use `label` or provide equivalent labeling.
- Restrictions: states `error`, `warning`, `success`; sizes `small`, `large`.

### `DdTextarea`

- Description: multiline field with optional counter and validation integration.
- When to use: messages, descriptions, and longer notes.
- When not to use: short inputs.
- Import: auto-registered by the module.
- Props:
  - `name?: string`
  - `label?: string`
  - `id?: string`
  - `placeholder: string = ''`
  - `modelValue?: string`
  - `maxLength?: string | number`
  - `rows?: string | number`
  - `isInvalid: boolean = false`
  - `errorMessage?: string`
  - `useValidation: boolean = false`
- Emits:
  - `update:modelValue`
- Slots: none explicitly declared.
- Correct example: `<DdTextarea v-model="bio" name="bio" :rows="4" :max-length="280" />`.
- Incorrect example: `<DdTextarea :options="options" />`.
- Accessibility notes: use `label` or equivalent labeling.
- Restrictions: states `error`, `warning`, `success`.

### `DdSelect`

- Description: styled native select.
- When to use: single choice from a closed list.
- When not to use: async search or multi-select.
- Import: auto-registered by the module.
- Props:
  - `name?: string`
  - `label?: string`
  - `id?: string`
  - `options: { label: string; value: any; disabled?: boolean }[] = []`
  - `placeholder: string = 'Select an option'`
  - `modelValue?: string | number | object`
  - `isInvalid: boolean = false`
  - `errorMessage?: string`
- Emits:
  - `update:modelValue`
- Slots: none explicitly declared.
- Correct example: `<DdSelect v-model="status" :options="statusOptions" label="Status" />`.
- Incorrect example: `<DdSelect :items="statusOptions" />`.
- Accessibility notes: use `label` when possible.
- Restrictions: states `error`, `warning`, `success`; sizes `small`, `large`.

### `DdCheckbox`

- Description: simple checkbox or array-bound checkbox.
- When to use: consent or independent selection.
- When not to use: mutually exclusive choice; use `DdRadio`.
- Import: auto-registered by the module.
- Props:
  - `name?: string`
  - `value: boolean | string | number = true`
  - `id?: string`
  - `label?: string`
  - `warning?: string`
  - `disabled: boolean = false`
  - `modelValue?: boolean | any[]`
  - `isInvalid: boolean = false`
  - `errorMessage?: string`
- Emits:
  - `update:modelValue`
- Slots:
  - `default`
- Correct example: `<DdCheckbox v-model="accepted" name="accepted">I accept the terms</DdCheckbox>`.
- Incorrect example: `<DdCheckbox :options="options" />`.
- Accessibility notes: associate clear text with the control.
- Restrictions: states `disabled`, `error`, `warning`.

### `DdRadio`

- Description: single option inside a group.
- When to use: multiple mutually exclusive options.
- When not to use: independent selection; use `DdCheckbox`.
- Import: auto-registered by the module.
- Props:
  - `name?: string`
  - `value: string | number | boolean`
  - `id?: string`
  - `label?: string`
  - `warning?: string`
  - `disabled: boolean = false`
  - `modelValue?: string | number | boolean`
  - `isInvalid: boolean = false`
  - `errorMessage?: string`
- Emits:
  - `update:modelValue`
- Slots:
  - `default`
- Correct example: `<DdRadio v-model="plan" name="plan" value="pro">Pro</DdRadio>`.
- Incorrect example: `<DdRadio v-model="value">Missing value</DdRadio>`.
- Accessibility notes: radios in the same group should share `name`.
- Restrictions: `value` is required.

### `DdToggle`

- Description: on/off switch.
- When to use: immediate binary state.
- When not to use: legal consent where a checkbox may be clearer.
- Import: auto-registered by the module.
- Props:
  - `name?: string`
  - `value: boolean | string | number = true`
  - `id?: string`
  - `label?: string`
  - `disabled: boolean = false`
  - `loading: boolean = false`
  - `modelValue?: boolean | string | number | any[]`
- Emits:
  - `update:modelValue`
- Slots:
  - `default`
  - `checked`
  - `unchecked`
- Correct example: `<DdToggle v-model="enabled" label="Enable notifications" />`.
- Incorrect example: `<DdToggle :options="options" />`.
- Accessibility notes: uses `role="switch"`; keep the label clear.
- Restrictions: states `disabled`, `loading`; sizes `small`, `large`, `xlarge`; semantic variants.

### `DdInputSearch`

- Description: search input with an embedded button.
- When to use: simple search forms.
- When not to use: complex filter forms with many fields.
- Import: auto-registered by the module.
- Props:
  - `name: string = 'search'`
  - `id?: string`
  - `placeholder: string = 'Search…'`
  - `modelValue?: string`
  - `buttonLabel?: string`
  - `buttonIcon?: string`
  - `loading: boolean = false`
- Emits:
  - `update:modelValue`
  - `search`
- Slots: none explicitly declared.
- Correct example: `<DdInputSearch v-model="query" @search="runSearch" />`.
- Incorrect example: `<DdInputSearch :options="options" />`.
- Accessibility notes: provide an external label if the placeholder is not sufficient.
- Restrictions: `search` is an explicit part of the API.

### `DdInputGroup`

- Description: groups a control with leading/trailing content.
- When to use: prefixes, suffixes, adornments, and hints around a field.
- When not to use: simple fields with no adornments.
- Import: auto-registered by the module.
- Props:
  - `label?: string`
  - `id?: string`
  - `pre?: string`
  - `post?: string`
  - `errorMessage?: string`
  - `warningMessage?: string`
- Emits: none explicitly declared.
- Slots:
  - `default`
  - `pre`
  - `post`
- Correct example: `<DdInputGroup label="URL"><template #pre>https://</template><DdInput /></DdInputGroup>`.
- Incorrect example: `<DdInputGroup><template #leading>https://</template><DdInput /></DdInputGroup>`.
- Accessibility notes: the inner control must still provide appropriate labeling.
- Restrictions: visual states are driven by error/warning messaging.

### `DdFormLabel`

- Description: styled label.
- When to use: label form controls.
- When not to use: plain text with no labeling role.
- Import: auto-registered by the module.
- Props: no explicit props.
- Emits: none explicitly declared.
- Slots:
  - `default`
- Correct example: `<DdFormLabel>Email</DdFormLabel>`.
- Incorrect example: `<DdFormLabel text="Email" />`.
- Accessibility notes: associate it with the control through structure, `for`, or context when needed.
- Restrictions: there is no `text` prop.

### `DdLoading`

- Description: loading indicator.
- When to use: async or temporarily empty states.
- When not to use: determinate progress; use `DdProgress`.
- Import: auto-registered by the module.
- Props:
  - `label: string = 'Loading...'`
  - `icon: string = 'svg-spinners:gooey-balls-2'`
- Emits: none explicitly declared.
- Slots:
  - `default`
- Correct example: `<DdLoading label="Loading data" />`.
- Incorrect example: `<DdLoading :value="40" />`.
- Accessibility notes: keep a textual label when the loading state needs to be announced.
- Restrictions: the `default` slot replaces the label.

### `DdToaster`

- Description: global toast container via `Teleport`.
- When to use: once at the app root layout.
- When not to use: multiple instances spread across the tree.
- Import: auto-registered by the module.
- Props: no explicit props.
- Emits: none explicitly declared.
- Slots: none explicitly declared.
- Correct example: `<DdToaster />`.
- Incorrect example: `<DdToaster position="top-left" />`.
- Accessibility notes: depends on `DdToast` semantics; keep only one global instance.
- Restrictions: renders notifications from the global `useToaster` state.

### `DdToast`

- Description: individual notification.
- When to use: transient and contextual feedback.
- When not to use: persistent inline validation; use `DdAlert` or form-level messages.
- Import: auto-registered by the module.
- Props:
  - `title?: string`
  - `icon?: string`
- Emits:
  - `close`
- Slots:
  - `default`
- Correct example: `<DdToast title="Success">Record saved.</DdToast>`.
- Incorrect example: `<DdToast type="success">Record saved.</DdToast>`.
- Accessibility notes: keep messages short; use together with `DdToaster`.
- Restrictions: variants `success`, `error`, `warning`, `info`; visual variant `solid`.

### `DdAvatar`

- Description: avatar with image or initials.
- When to use: user, author, or member identity.
- When not to use: complex thumbnails or rich media.
- Import: auto-registered by the module.
- Props:
  - `src?: string`
  - `alt?: string`
- Emits: none explicitly declared.
- Slots: none explicitly declared.
- Correct example: `<DdAvatar src="/user.jpg" alt="Ana Souza" online />`.
- Incorrect example: `<DdAvatar fallback="AS" />`.
- Accessibility notes: always use meaningful `alt` when the image matters.
- Restrictions: relevant attrs `random`, `square`, `small`, `large`, `xlarge`, `online`, `offline`, `busy`, `away`.

### `DdAvatarGroup`

- Description: group of multiple avatars.
- When to use: team members, participants, collaborators.
- When not to use: when each avatar needs independent layout treatment.
- Import: auto-registered by the module.
- Props:
  - `limit: number = 5`
- Emits: none explicitly declared.
- Slots:
  - `default`
- Correct example: `<DdAvatarGroup :limit="3"><DdAvatar /><DdAvatar /><DdAvatar /><DdAvatar /></DdAvatarGroup>`.
- Incorrect example: `<DdAvatarGroup><template #header>Team</template></DdAvatarGroup>`.
- Accessibility notes: inner avatars should keep `alt` when applicable.
- Restrictions: `limit` truncates the number of rendered children.

---

## Form wrappers

### `DdFormInput`

- Description: `DdInput` wrapper integrated with `vee-validate`.
- When to use: schema/field-validated forms.
- When not to use: standalone inputs without validation; use `DdInput`.
- Import: auto-registered by the module.
- Props:
  - `name: string`
  - `modelValue?: string | number`
- Emits:
  - `update:modelValue`
- Slots: forwarded to `DdInput`.
- Correct example: `<DdFormInput name="email" type="email" label="Email" />`.
- Incorrect example: `<DdFormInput type="email" />`.
- Accessibility notes: depends on `DdInput` labeling behavior.
- Restrictions: `name` is required; other attrs are forwarded to the base input.

### `DdFormTextarea`

- Description: `DdTextarea` wrapper integrated with `vee-validate`.
- When to use: validated long-form fields.
- When not to use: textarea without validation integration.
- Import: auto-registered by the module.
- Props:
  - `name: string`
  - `modelValue?: string | number`
- Emits:
  - `update:modelValue`
- Slots: forwarded to `DdTextarea`.
- Correct example: `<DdFormTextarea name="bio" label="Bio" :rows="4" />`.
- Incorrect example: `<DdFormTextarea />`.
- Accessibility notes: inherits `DdTextarea` behavior.
- Restrictions: `name` is required.

### `DdFormSelect`

- Description: `DdSelect` wrapper integrated with `vee-validate`.
- When to use: validated selects.
- When not to use: simple select without validation.
- Import: auto-registered by the module.
- Props:
  - `name: string`
  - `modelValue?: string | number | object`
- Emits:
  - `update:modelValue`
- Slots: forwarded to `DdSelect`.
- Correct example: `<DdFormSelect name="status" :options="statusOptions" />`.
- Incorrect example: `<DdFormSelect :options="statusOptions" />`.
- Accessibility notes: inherits `DdSelect` behavior.
- Restrictions: `name` is required.

### `DdFormCheckbox`

- Description: `DdCheckbox` wrapper integrated with `vee-validate`.
- When to use: validated checkbox fields.
- When not to use: simple checkbox without validation.
- Import: auto-registered by the module.
- Props:
  - `name: string`
  - `value: boolean | string | number = true`
  - `modelValue?: boolean | any[]`
- Emits:
  - `update:modelValue`
- Slots: forwarded to `DdCheckbox`.
- Correct example: `<DdFormCheckbox name="terms">I accept the terms</DdFormCheckbox>`.
- Incorrect example: `<DdFormCheckbox />`.
- Accessibility notes: inherits `DdCheckbox` behavior.
- Restrictions: `name` is required.

### `DdFormRadio`

- Description: `DdRadio` wrapper integrated with `vee-validate`.
- When to use: validated radio groups.
- When not to use: simple radios without validation.
- Import: auto-registered by the module.
- Props:
  - `name: string`
  - `value: string | number | boolean`
  - `modelValue?: string | number | boolean`
- Emits:
  - `update:modelValue`
- Slots: forwarded to `DdRadio`.
- Correct example: `<DdFormRadio name="plan" value="pro">Pro</DdFormRadio>`.
- Incorrect example: `<DdFormRadio name="plan">Missing value</DdFormRadio>`.
- Accessibility notes: inherits `DdRadio` behavior.
- Restrictions: `name` and `value` are required.

### `DdFormToggle`

- Description: `DdToggle` wrapper integrated with `vee-validate`.
- When to use: validated switch fields.
- When not to use: simple toggle without validation.
- Import: auto-registered by the module.
- Props:
  - `name: string`
  - `value: boolean | string | number = true`
  - `modelValue?: boolean | string | number | any[]`
- Emits:
  - `update:modelValue`
- Slots: forwarded to `DdToggle`.
- Correct example: `<DdFormToggle name="notifications" label="Notifications" />`.
- Incorrect example: `<DdFormToggle />`.
- Accessibility notes: inherits `DdToggle` behavior.
- Restrictions: `name` is required.

---

## Widgets

### `DdAccordion`

- Description: expandable item.
- When to use: reveal/hide secondary content.
- When not to use: tabs or context-switch navigation; use `DdTabs`.
- Import: auto-registered by the module.
- Props:
  - `title: string`
  - `icon?: string`
  - `accentColor?: string`
  - `name?: string`
- Emits: none explicitly declared.
- Slots:
  - `default`
- Correct example: `<DdAccordion title="Details">Content</DdAccordion>`.
- Incorrect example: `<DdAccordion open title="Details" />`.
- Accessibility notes: based on semantic disclosure elements.
- Restrictions: `title` is required; can inherit coordination from `DdAccordionGroup`.

### `DdAccordionGroup`

- Description: groups accordions and optionally controls exclusivity.
- When to use: FAQ and coordinated expandable sections.
- When not to use: when accordions are fully independent.
- Import: auto-registered by the module.
- Props:
  - `multiple: boolean = false`
  - `accentColor?: string`
- Emits: none explicitly declared.
- Slots:
  - `default`
- Correct example: `<DdAccordionGroup><DdAccordion title="A">...</DdAccordion><DdAccordion title="B">...</DdAccordion></DdAccordionGroup>`.
- Incorrect example: `<DdAccordionGroup :open="true" />`.
- Accessibility notes: the main semantics live in the inner accordions.
- Restrictions: `multiple=false` implies exclusive behavior.

### `DdTabs`

- Description: tab navigation context.
- When to use: switch between related panels in the same space.
- When not to use: independent disclosure; use accordion.
- Import: auto-registered by the module.
- Props:
  - `modelValue?: string | number`
  - `vertical: boolean = false`
  - `manualActivation: boolean = false`
  - `indicator: 'underline' | 'dot' = 'underline'`
- Emits:
  - `update:modelValue`
  - `close`
- Slots:
  - `default`
- Correct example: `<DdTabs v-model="tab"><DdTabList><DdTab value="account">Account</DdTab></DdTabList><DdTabPanels><DdTabPanel value="account">...</DdTabPanel></DdTabPanels></DdTabs>`.
- Incorrect example: `<DdTabs><DdTabList><DdTab name="account">Account</DdTab></DdTabList></DdTabs>`.
- Accessibility notes: provides the context for `tablist`, `tab`, and `tabpanel`; keyboard support is handled in the tabs system.
- Restrictions: tab/panel linkage is based on `value`.

### `DdTabList`

- Description: tab list container.
- When to use: inside `DdTabs`.
- When not to use: standalone outside tab context.
- Import: auto-registered by the module.
- Props: no explicit props.
- Emits: none explicitly declared.
- Slots:
  - `default`
  - `prefix`
  - `suffix`
- Correct example: `<DdTabList><DdTab value="a">A</DdTab></DdTabList>`.
- Incorrect example: `<DdTabList />`.
- Accessibility notes: depends on `DdTabs` context.
- Restrictions: must be used inside `DdTabs`.

### `DdTab`

- Description: individual tab trigger.
- When to use: inside `DdTabList`.
- When not to use: generic menu links.
- Import: auto-registered by the module.
- Props:
  - `value: string | number`
  - `disabled?: boolean`
  - `loading?: boolean`
  - `closable?: boolean`
  - `icon?: string`
  - `to?: string`
  - `href?: string`
- Emits: none explicitly declared.
- Slots:
  - `default`
  - `prefix`
  - `suffix`
- Correct example: `<DdTab value="profile" icon="heroicons:user">Profile</DdTab>`.
- Incorrect example: `<DdTab name="profile">Profile</DdTab>`.
- Accessibility notes: participates in `aria-selected`, `aria-controls`, and keyboard navigation.
- Restrictions: `value` is required.

### `DdTabPanels`

- Description: panel container.
- When to use: inside `DdTabs`.
- When not to use: standalone.
- Import: auto-registered by the module.
- Props: no explicit props.
- Emits: none explicitly declared.
- Slots:
  - `default`
- Correct example: `<DdTabPanels><DdTabPanel value="a">...</DdTabPanel></DdTabPanels>`.
- Incorrect example: `<DdTabPanels value="profile" />`.
- Accessibility notes: depends on `DdTabs` context.
- Restrictions: should be used with `DdTabPanel`.

### `DdTabPanel`

- Description: panel associated with a tab.
- When to use: inside `DdTabPanels`.
- When not to use: outside `DdTabs`.
- Import: auto-registered by the module.
- Props:
  - `value: string | number`
- Emits: none explicitly declared.
- Slots:
  - `default`
- Correct example: `<DdTabPanel value="profile">Content</DdTabPanel>`.
- Incorrect example: `<DdTabPanel name="profile">Content</DdTabPanel>`.
- Accessibility notes: linked to the corresponding tab through context.
- Restrictions: `value` is required.

### `DdModal`

- Description: modal dialog based on `<dialog>`.
- When to use: confirmation, quick editing, focused tasks.
- When not to use: persistent lateral navigation; use `DdDrawer`.
- Import: auto-registered by the module.
- Props:
  - `open: boolean = false`
  - `title?: string`
  - `closeOnBackdrop: boolean = true`
- Emits:
  - `close`
  - `update:open`
- Slots:
  - `default`
  - `footer`
- Correct example: `<DdModal :open="open" title="Edit" @update:open="open = $event">...</DdModal>`.
- Incorrect example: `<DdModal><template #header>Top</template></DdModal>`.
- Accessibility notes: uses `<dialog>`; keep title and closing action clear.
- Restrictions: there is no `header` slot.

### `DdDrawer`

- Description: sliding panel based on `<dialog>`.
- When to use: secondary actions, side details, filters.
- When not to use: centered focused dialogs; use `DdModal`.
- Import: auto-registered by the module.
- Props:
  - `open: boolean = false`
  - `title?: string`
  - `closeOnBackdrop: boolean = true`
  - `position: 'top' | 'right' | 'bottom' | 'left' = 'right'`
- Emits:
  - `close`
  - `update:open`
- Slots:
  - `header`
  - `default`
  - `footer`
- Correct example: `<DdDrawer :open="open" position="left"><template #header>Filters</template>...</DdDrawer>`.
- Incorrect example: `<DdDrawer side="left" />`.
- Accessibility notes: uses `<dialog>`; keep the open/close flow clear.
- Restrictions: use `position`, not `side`.

### `DdPagination`

- Description: numeric pagination with ellipses.
- When to use: paginated lists and tables.
- When not to use: infinite scroll or incremental loading.
- Import: auto-registered by the module.
- Props:
  - `disabled: boolean = false`
  - `total: number = 0`
  - `modelValue: number = 1`
  - `pageSize: number = 10`
  - `siblingCount: number = 1`
- Emits:
  - `update:modelValue`
- Slots: none explicitly declared.
- Correct example: `<DdPagination v-model="page" :total="120" :page-size="10" />`.
- Incorrect example: `<DdPagination v-model:page="page" :per-page="10" />`.
- Accessibility notes: uses buttons/links with active state; keep it paired with the paginated content.
- Restrictions: visual variants `small`, `compact`, `simple`.

### `DdTable`

- Description: data table with loading, error, and empty states.
- When to use: simple tabular data.
- When not to use: highly interactive grids without an additional business layer.
- Import: auto-registered by the module.
- Props:
  - `columns: TableColumn[] = []`
  - `data: Record<string, any>[] = []`
  - `rowKey: string | ((row: any) => string) = 'id'`
  - `loading: boolean = false`
  - `isInvalid: boolean = false`
  - `errorMessage?: string`
- Emits: none explicitly declared.
- Slots:
  - `empty`
  - `header-${column.key}`
  - `cell-${column.key}`
- Correct example: `<DdTable :columns="columns" :data="rows"><template #cell-status="{ row }"><DdBadge>{{ row.status }}</DdBadge></template></DdTable>`.
- Incorrect example: `<DdTable :items="rows" />`.
- Accessibility notes: use clear column titles; custom cell rendering should preserve legibility.
- Restrictions: variants `striped` and `striped-odd`.

### `DdPopover`

- Description: native popover with trigger and floating content.
- When to use: contextual help, short menu, or rich tooltip.
- When not to use: modal or drawer; the interaction scope should stay small.
- Import: auto-registered by the module.
- Props:
  - `title?: string`
  - `trigger: 'click' | 'hover' | 'focus' = 'hover'`
  - `placement: PopoverPlacement = 'top'`
  - `offset: number = 8`
  - `onClose?: () => void`
- Emits: none explicitly declared.
- Slots:
  - `default`
  - `header`
  - `content`
- Correct example: `<DdPopover trigger="click"><DdButton>More</DdButton><template #content>Options</template></DdPopover>`.
- Incorrect example: `<DdPopover><template #trigger><DdButton>More</DdButton></template></DdPopover>`.
- Accessibility notes: depends on trigger and content; keep content short and focus behavior clear.
- Restrictions: closing uses the `onClose` prop, not an emit.

### `DdAnchor`

- Description: anchor navigation with active item tracking on scroll.
- When to use: long documents, sectioned pages, article side navigation.
- When not to use: general application menus.
- Import: auto-registered by the module.
- Props:
  - `items: AnchorItem[] = []`
  - `horizontal: boolean = false`
  - `offset: number = 0`
  - `affix: boolean = false`
  - `container: string | HTMLElement | Window = window | null`
- Emits:
  - `click`
  - `change`
- Slots: none explicitly declared.
- Correct example: `<DdAnchor :items="[{ key: 'intro', href: '#intro', title: 'Introduction' }]" />`.
- Incorrect example: `<DdAnchor :items="[{ key: 'intro', href: '#intro', label: 'Introduction' }]" />`.
- Accessibility notes: uses `nav` and real links; `href`s should point to existing IDs.
- Restrictions: the type requires `title`; the code declares both `required: true` and `default`, so keep `items` explicit.

### `DdMenu`

- Description: vertical or horizontal menu with submenus, collapsing, and action/link items.
- When to use: primary navigation, side menus, sidebars.
- When not to use: tabs, breadcrumbs, or simple flat lists without hierarchy.
- Import: auto-registered by the module.
- Props:
  - `items: MenuEntry[]`
  - `orientation: 'vertical' | 'horizontal' = 'vertical'`
  - `collapsible: boolean = false`
  - `collapsed: boolean = false`
  - `toggleButton: boolean = false`
  - `activeKey?: string`
  - `maxHeight?: string`
  - `maxWidth?: string`
- Emits:
  - `update:collapsed`
  - `select`
- Slots: none explicitly declared.
- Correct example: `<DdMenu :items="menuItems" collapsible />`.
- Incorrect example: `<DdMenu :items="[{ label: 'Home' }]" />`.
- Accessibility notes: uses navigation semantics and active state; keep labels clear and do not rely on icons alone.
- Restrictions:
  - `items` is required;
  - each item must follow `MenuEntry`;
  - actions are modeled as `action: { type: 'link' | 'action' | 'none' }`.

## 9. Best practices

- Install and use the library through the Nuxt module.
- Keep the prefix consistent in examples and generated code.
- Prefer `DdXxx` in AI-generated examples.
- Use `useToaster` together with a single global `DdToaster` instance.
- Use `Form*` components when the context is already integrated with `vee-validate`.
- Use `Input`, `Textarea`, `Select`, `Checkbox`, `Radio`, and `Toggle` directly when structured validation is not needed.
- In module CSS, use `v('...')`.
- Customize appearance through tokens and exposed variables before relying on ad hoc classes.
- Use semantic variants (`success`, `warning`, `danger`, `error`, `info`, `accent`, `primary`) according to context.
- Adjust `tag`, ARIA, and semantics on layout primitives when a neutral wrapper is not sufficient.

## 10. Anti-patterns

- Do not import components from internal `runtime/components/...` paths in consuming app code.
- Do not import internal helpers from `runtime/shared/utils/*`.
- Do not use `useThemeEditor` as if it were a general public app composable.
- Do not use a generic `variant="primary"` prop where the component expects attrs such as `primary`, `ghost`, `outline`, etc.
- Do not assume every component shares the same size scale.
- Do not document or generate examples as if the library had official support outside Nuxt.
- Do not rely by default on Tailwind/Bootstrap utility classes to “force” component appearance.
- Do not use non-existent props/slots such as:
  - `DdFormLabel text`
  - `DdInputGroup #leading`
  - `DdAccordion open`
  - `DdModal #header`
  - `DdDrawer side`
  - `DdPagination v-model:page`
  - `DdPopover #trigger`

## 11. Complete usage examples

### Example 1: layout with menu and content

```vue
<template>
  <DdLayout>
    <DdSidebar>
      <DdMenu :items="menuItems" collapsible />
    </DdSidebar>

    <DdBox tag="main">
      <DdStack spaced>
        <DdBreadcrumb :config="breadcrumb" />
        <DdCard>
          <template #header>Dashboard</template>
          <p>Main content.</p>
        </DdCard>
      </DdStack>
    </DdBox>
  </DdLayout>
</template>

<script setup lang="ts">
const menuItems = [
  {
    key: 'home',
    label: 'Home',
    icon: 'heroicons:home',
    action: { type: 'link', to: '/' }
  }
]

const breadcrumb = {
  routes: [
    { label: 'Home', to: '/' },
    { label: 'Dashboard', to: '/dashboard' }
  ]
}
</script>
```

### Example 2: validated form

```vue
<template>
  <form @submit.prevent="onSubmit">
    <DdStack compact>
      <DdFormInput name="email" type="email" label="Email" />
      <DdFormSelect name="plan" label="Plan" :options="planOptions" />
      <DdFormCheckbox name="terms">
        I accept the terms
      </DdFormCheckbox>
      <DdButton primary>Submit</DdButton>
    </DdStack>
  </form>
</template>

<script setup lang="ts">
const planOptions = [
  { label: 'Starter', value: 'starter' },
  { label: 'Pro', value: 'pro' }
]

function onSubmit() {}
</script>
```

### Example 3: global feedback with toaster

```vue
<template>
  <DdBox>
    <p>The toaster should exist once in the application tree.</p>
    <DdToaster />
  </DdBox>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

const { showToast } = useToaster()

onMounted(() => {
  showToast('Record saved successfully.', {
    type: 'success',
    title: 'Success'
  })
})
</script>
```

### Example 4: tabs with panels

```vue
<template>
  <DdTabs v-model="tab">
    <DdTabList>
      <DdTab value="profile">Profile</DdTab>
      <DdTab value="security">Security</DdTab>
    </DdTabList>

    <DdTabPanels>
      <DdTabPanel value="profile">
        <DdCard>Profile settings</DdCard>
      </DdTabPanel>
      <DdTabPanel value="security">
        <DdCard>Security settings</DdCard>
      </DdTabPanel>
    </DdTabPanels>
  </DdTabs>
</template>

<script setup lang="ts">
const tab = ref('profile')
</script>
```

### Example 5: table with custom cell

```vue
<template>
  <DdTable :columns="columns" :data="rows" striped>
    <template #cell-status="{ row }">
      <DdBadge :success="row.status === 'active'" :warning="row.status !== 'active'">
        {{ row.status }}
      </DdBadge>
    </template>
  </DdTable>
</template>

<script setup lang="ts">
const columns = [
  { key: 'name', title: 'Name' },
  { key: 'status', title: 'Status' }
]

const rows = [
  { id: '1', name: 'Ada', status: 'active' },
  { id: '2', name: 'Linus', status: 'pending' }
]
</script>
```

## 12. TODOs for remaining gaps

- `TODO:` decide whether `DdModal` should gain a `header` slot in the future; today it does not exist.
- `TODO:` align `src/types.ts` with all `appConfig.daredash.icons` keys that are actually read at runtime.

## Appendix: useful public types

### `TableColumn`

```ts
interface TableColumn {
  key: string
  title?: string
  align?: 'left' | 'center' | 'right'
  width?: string
}
```

### `ToastMessage`

```ts
type ToastMessage = {
  id: string
  title?: string
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
  variant?: 'default' | 'solid'
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  duration: number
}
```

### `MenuEntry`

```ts
type MenuItemActionType =
  | { type: 'link'; to: string; target?: '_blank' | '_self' | '_parent' | '_top' }
  | { type: 'action'; handler: () => void }
  | { type: 'none' }

interface MenuBadge {
  label: string | number
  color?: string
}

interface MenuSeparator {
  type: 'separator'
  label?: string
  icon?: string
}

interface MenuItem {
  key: string
  label: string
  icon?: string
  badge?: MenuBadge
  disabled?: boolean
  active?: boolean
  float?: boolean
  children?: MenuEntry[]
  action: MenuItemActionType
}

type MenuEntry = MenuItem | MenuSeparator
```
