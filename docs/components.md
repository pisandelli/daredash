# UI Components

This is the human-facing component reference for DareDash. It is written for application developers using the library in Nuxt projects and focuses on real usage, supported props, meaningful attrs, and composition patterns without repeating the full internal reference style used for AI.

All examples assume the default `dd` prefix and use `kebab-case` tags.

## 1. Reading this reference

Use this file in three ways:

- scan the category sections when choosing the right component
- read the component tables when checking props, emits, and slots
- cross-reference [Layout Primitives](./layout.md) when the question is structural rather than interactive

For deeper theming and token behavior, continue to [Features, Tokens, and Theming](./features.md).

## 2. Primitives

### Button (`<dd-button>`)

Use `dd-button` for actions, links, and compact call-to-action patterns.

```vue
<template>
  <dd-cluster>
    <dd-button primary icon="lucide:plus">New</dd-button>
    <dd-button outline href="/docs">Docs</dd-button>
  </dd-cluster>
</template>
```

#### Props

| Prop | Type | Description |
| :--- | :--- | :--- |
| `color` | `string` | Direct custom color override. |
| `textColor` | `string` | Direct custom foreground override for this instance. |
| `icon` | `string` | Left-side icon name. |
| `to` | `string \| object` | Renders the button as a Nuxt link. |
| `href` | `string` | Renders the button as an href-driven link. |

#### Common attrs

- semantic attrs such as `primary`, `success`, `warning`, `danger`, `info`
- visual attrs such as `ghost`, `outline`, `full`, `icon-right`, `icon-only`
- size attrs such as `tiny`, `small`, `large`, `xlarge`

Use semantic attrs for status and intent first. Reserve `color` for arbitrary one-off overrides.

When `color` is used on its own, the button still follows the themed foreground token, which can default to `contrast-color({button.base-color})`. Add `textColor` only when a specific instance needs an explicit foreground instead of the theme decision.

### Card (`<dd-card>`)

Use `dd-card` to group related content with optional header and footer regions.

```vue
<template>
  <dd-card>
    <template #header>Account</template>
    <p>Detailed content goes here.</p>
    <template #footer>
      <dd-button primary>Save</dd-button>
    </template>
  </dd-card>
</template>
```

#### Slots

- `header`
- `default`
- `footer`

#### Common attrs

- `flat`
- `noborder`

### Badge (`<dd-badge>`)

Use `dd-badge` for short status labels, counts, or metadata.

```vue
<template>
  <dd-cluster>
    <dd-badge>New</dd-badge>
    <dd-badge success>Done</dd-badge>
    <dd-badge danger icon="lucide:x">Failed</dd-badge>
  </dd-cluster>
</template>
```

#### Props

| Prop | Type | Description |
| :--- | :--- | :--- |
| `icon` | `string` | Optional icon. |
| `color` | `string` | Direct custom color override. |

#### Common attrs

- semantic attrs such as `primary`, `success`, `warning`, `danger`, `info`

### Avatar (`<dd-avatar>` and `<dd-avatar-group>`)

Displays profile images or initials.

```vue
<template>
  <dd-avatar-group :limit="3">
    <dd-avatar src="https://example.com/photo1.jpg" alt="Maria Souza" />
    <dd-avatar alt="Joao Dias" />
    <dd-avatar alt="Ana Lima" random />
    <dd-avatar alt="Extra User" />
  </dd-avatar-group>
</template>
```

#### `dd-avatar` props

| Prop | Type | Description |
| :--- | :--- | :--- |
| `src` | `string` | Avatar image URL. |
| `alt` | `string` | Accessible label and initials source. |

#### Common attrs

- `square`
- `circle`
- `online`
- `offline`
- `busy`
- `away`
- `random`
- size attrs such as `xxs`, `small`, `medium`, `large`

#### `dd-avatar-group` props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `limit` | `number` | `5` | Maximum number of rendered avatar children. |

### Alert (`<dd-alert>`)

Use `dd-alert` for inline contextual messages.

```vue
<template>
  <dd-alert title="Attention" warning closable>
    Your session will expire in 5 minutes.
  </dd-alert>
</template>
```

#### Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `modelValue` | `boolean` | `true` | Controls visibility. |
| `color` | `string` | `undefined` | Direct custom alert color. |
| `title` | `string` | `undefined` | Alert title. |
| `closable` | `boolean` | `true` | Enables close button. |
| `icon` | `boolean \| string` | `false` | Shows a default or custom icon. |

#### Emits

- `update:modelValue`
- `close`

#### Slots

- `title`
- `default`

### Progress (`<dd-progress>`)

Linear progress bar with optional label and tooltip slot.

```vue
<template>
  <dd-progress :value="50" :max="100" label="Upload" />
</template>
```

#### Props

| Prop | Type | Default |
| :--- | :--- | :--- |
| `value` | `number` | `undefined` |
| `min` | `number` | `0` |
| `max` | `number` | `100` |
| `color` | `string` | `undefined` |
| `ranges` | `ProgressRange[]` | `undefined` |
| `label` | `string` | `undefined` |
| `indeterminate` | `boolean` | `false` |

#### Slots

- `label`
- `tooltip` with `{ percentage }`

### Loading (`<dd-loading>`)

Loading indicator for explicit waiting states.

```vue
<template>
  <dd-loading label="Loading data" />
</template>
```

#### Props

| Prop | Type | Default |
| :--- | :--- | :--- |
| `label` | `string` | `'Loading...'` |
| `icon` | `string` | `'svg-spinners:gooey-balls-2'` |

#### Slots

- `default`

### Skeleton (`<dd-skeleton>`)

Decorative placeholder for loading layouts before the real content is ready.

```vue
<template>
  <dd-stack compact>
    <dd-skeleton width="12rem" />
    <dd-skeleton width="100%" height="6rem" />
    <dd-cluster>
      <dd-skeleton circle width="3rem" />
      <dd-stack compact style="flex: 1;">
        <dd-skeleton width="10rem" />
        <dd-skeleton width="70%" />
      </dd-stack>
    </dd-cluster>
  </dd-stack>
</template>
```

#### Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `width` | `string` | `undefined` | Optional inline size override. |
| `height` | `string` | `undefined` | Optional block size override. |
| `radius` | `string` | `undefined` | Optional border radius override. |
| `circle` | `boolean` | `false` | Forces a circular placeholder. |
| `animated` | `boolean` | `true` | Enables or disables the shimmer effect. |

#### Common attrs

- `aria-hidden`

`dd-skeleton` is decorative by default and renders with `aria-hidden="true"` unless you explicitly override it.

### Breadcrumb (`<dd-breadcrumb>`)

Breadcrumb navigation trail for contextual hierarchy.

```vue
<template>
  <dd-breadcrumb
    :config="{
      routes: [
        { label: 'Home', to: '/' },
        { label: 'Docs', to: '/docs' },
        { label: 'Components' }
      ]
    }"
  />
</template>
```

#### Props

| Prop | Type | Description |
| :--- | :--- | :--- |
| `config` | `BreadcrumbConfig` | Contains `routes` and optional `separator`. |

`separator` is an optional icon name override for the separator glyph. If omitted, DareDash uses `appConfig.daredash.icons.breadcrumbSeparator`, which falls back to the same icon used by `menuExpand`.

## 3. Form primitives

These components are best when you want direct control over state without `vee-validate` wrappers.

### Input (`<dd-input>`)

Styled text input for short values.

```vue
<template>
  <dd-input
    v-model="email"
    name="email"
    type="email"
    label="Email"
    icon="lucide:mail"
  />
</template>
```

#### Main props

- `name`
- `label`
- `type`
- `id`
- `placeholder`
- `icon`
- `icon-right`
- `model-value`
- `is-invalid`
- `error-message`

#### Common attrs

- `error`
- `warning`
- `success`
- `small`
- `large`
- standard native attrs such as `required` and `disabled`

### Textarea (`<dd-textarea>`)

Multiline field for longer text.

```vue
<template>
  <dd-textarea
    v-model="bio"
    name="bio"
    label="Bio"
    :rows="4"
    :max-length="280"
  />
</template>
```

#### Main props

- `name`
- `label`
- `id`
- `placeholder`
- `model-value`
- `max-length`
- `rows`
- `is-invalid`
- `error-message`
- `use-validation`

#### Common attrs

- `error`
- `warning`
- `success`

### Select (`<dd-select>`)

Styled native select for a single choice from a closed list.

```vue
<template>
  <dd-select
    v-model="status"
    label="Status"
    :options="statusOptions"
  />
</template>
```

#### Main props

- `name`
- `label`
- `id`
- `options`
- `placeholder`
- `model-value`
- `is-invalid`
- `error-message`

#### Common attrs

- `error`
- `warning`
- `success`
- `small`
- `large`

### Checkbox (`<dd-checkbox>`), Radio (`<dd-radio>`), and Toggle (`<dd-toggle>`)

Use these for boolean or mutually exclusive choices.

```vue
<template>
  <dd-stack compact>
    <dd-checkbox v-model="accepted">I accept the terms</dd-checkbox>
    <dd-radio v-model="plan" name="plan" value="pro">Pro</dd-radio>
    <dd-toggle v-model="enabled" label="Enable notifications" />
  </dd-stack>
</template>
```

Common supported behavior across these controls includes:

- labels or default slot content
- `disabled` handling
- `error` and `warning`-style messaging where relevant
- standard `v-model`-driven usage

#### `dd-checkbox` highlights

- props: `name`, `value`, `id`, `label`, `warning`, `disabled`, `model-value`, `is-invalid`, `error-message`
- emits: `update:modelValue`
- supports default slot content instead of `label`

#### `dd-radio` highlights

- props: `name`, `value`, `id`, `label`, `warning`, `disabled`, `model-value`, `is-invalid`, `error-message`
- emits: `update:modelValue`
- `value` is required

#### `dd-toggle` highlights

- props: `name`, `value`, `id`, `label`, `disabled`, `loading`, `model-value`
- emits: `update:modelValue`
- slots: `default`, `checked`, `unchecked`
- supports semantic and size attrs where implemented by the toggle CSS

### InputSearch (`<dd-input-search>`)

Search input with an embedded button.

```vue
<template>
  <dd-input-search v-model="query" @search="runSearch" />
</template>
```

#### Props

- `name`
- `id`
- `placeholder`
- `model-value`
- `button-label`
- `button-icon`
- `loading`

#### Emits

- `update:modelValue`
- `search`

Semantic button intent is driven by attrs on the component, not by a generic variant prop.

### InputGroup (`<dd-input-group>`)

Use `dd-input-group` when multiple fields or controls should read as a single grouped input surface.

```vue
<template>
  <dd-input-group label="Website" pre="https://" post=".com">
    <dd-input />
  </dd-input-group>
</template>
```

#### Props

- `label`
- `id`
- `pre`
- `post`
- `error-message`
- `warning-message`

#### Slots

- `default`
- `pre`
- `post`

#### Common attrs

- `error`
- `warning`
- `success`

### FormLabel (`<dd-form-label>`)

Use `dd-form-label` when you need a standalone label primitive outside the integrated field components.

It renders a native `<label>` and is most useful in custom form compositions where `dd-input` or `dd-select` labels are not enough on their own.

## 4. Form wrappers (`vee-validate`)

Use the `Form*` surface when the page already relies on `vee-validate` and you want DareDash to stay aligned with that validation flow.

Main wrappers:

- `dd-form-input`
- `dd-form-textarea`
- `dd-form-select`
- `dd-form-checkbox`
- `dd-form-radio`
- `dd-form-toggle`

These wrappers are intentionally thin. Their role is to connect the corresponding primitive to `vee-validate`, not to invent a second visual system.

## 5. Widgets

### Accordion (`<dd-accordion>` and `<dd-accordion-group>`)

Use accordions for reveal/hide patterns that stay in the same scroll flow.

```vue
<template>
  <dd-accordion-group>
    <dd-accordion title="Details">
      Content
    </dd-accordion>
  </dd-accordion-group>
</template>
```

`dd-accordion` props:

- `title`
- `icon`
- `accent-color`
- `name`

`dd-accordion-group` props:

- `multiple`
- `accent-color`

### Modal (`<dd-modal>`)

Use `dd-modal` for focused, blocking tasks.

```vue
<template>
  <dd-modal :open="open" title="Confirm" @update:open="open = $event">
    <p>Are you sure?</p>
    <template #footer>
      <dd-cluster end>
        <dd-button ghost @click="open = false">Cancel</dd-button>
        <dd-button danger>Delete</dd-button>
      </dd-cluster>
    </template>
  </dd-modal>
</template>
```

#### Props

- `open`
- `title`
- `close-on-backdrop`

#### Emits

- `close`
- `update:open`

#### Slots

- `default`
- `footer`

There is no `header` slot on `dd-modal`.

### Drawer (`<dd-drawer>`)

Use `dd-drawer` for side details, filters, and secondary flows.

```vue
<template>
  <dd-drawer :open="open" position="left">
    <template #header>Filters</template>
    <p>Drawer content.</p>
  </dd-drawer>
</template>
```

#### Props

- `open`
- `title`
- `close-on-backdrop`
- `position`

#### Emits

- `close`
- `update:open`

#### Slots

- `header`
- `default`
- `footer`

### Tabs (`<dd-tabs>` family)

Use tabs when the page needs peer views in the same context.

```vue
<template>
  <dd-tabs v-model="tab">
    <dd-tab-list>
      <dd-tab value="account">Account</dd-tab>
      <dd-tab value="security">Security</dd-tab>
    </dd-tab-list>

    <dd-tab-panels>
      <dd-tab-panel value="account">Account content</dd-tab-panel>
      <dd-tab-panel value="security">Security content</dd-tab-panel>
    </dd-tab-panels>
  </dd-tabs>
</template>
```

Important pieces:

- `dd-tabs`
  - props: `model-value`, `vertical`, `manual-activation`, `indicator`
  - emits: `update:modelValue`, `close`
- `dd-tab-list`
  - slots: `default`, `prefix`, `suffix`
- `dd-tab`
  - props: `value`, `disabled`, `loading`, `closable`, `icon`, `to`, `href`
- `dd-tab-panel`
  - prop: `value`

### Table (`<dd-table>`)

Use `dd-table` for straightforward tabular data with built-in loading, empty, and error states.

```vue
<template>
  <dd-table :columns="columns" :data="rows">
    <template #cell-status="{ row }">
      <dd-badge :success="row.status === 'active'" :warning="row.status !== 'active'">
        {{ row.status }}
      </dd-badge>
    </template>
  </dd-table>
</template>
```

#### Main props

- `columns`
- `data`
- `row-key`
- `loading`
- `is-invalid`
- `error-message`

#### Slots

- `empty`
- `header-${column.key}`
- `cell-${column.key}`

#### Common attrs

- `large`
- `comfortable` (same preset used by default)
- `compact`
- `striped`
- `striped-odd`

#### Density presets

`dd-table` supports three density presets inspired by mailbox-style data views:

- `large`
- `comfortable`
- `compact`

When no density attr is provided, the table uses the `comfortable` token set by default.

### Pagination (`<dd-pagination>`)

Use `dd-pagination` for paginated lists and tables.

```vue
<template>
  <dd-pagination v-model="page" :total="120" :page-size="10" />
</template>
```

#### Props

- `disabled`
- `total`
- `model-value`
- `page-size`
- `sibling-count`

#### Emits

- `update:modelValue`

#### Common attrs

- `small`
- `compact`
- `simple`

### Popover (`<dd-popover>`)

Use `dd-popover` for compact contextual content.

```vue
<template>
  <dd-popover trigger="click">
    <dd-button>More</dd-button>
    <template #content>
      Actions
    </template>
  </dd-popover>
</template>
```

#### Props

- `title`
- `trigger`
- `placement`
- `offset`
- `on-close`

#### Slots

- `default`
- `header`
- `content`

### Menu (`<dd-menu>`)

Use `dd-menu` for hierarchical, persistent navigation.

```vue
<template>
  <dd-menu :items="menuItems" collapsible />
</template>
```

#### Main props

- `items`
- `orientation`
- `collapsible`
- `collapsed`
- `toggle-button`
- `active-key`
- `max-height`
- `max-width`

#### Emits

- `update:collapsed`
- `select`

Nested indentation is controlled through theming, not through a prop-level API.

### Anchor (`<dd-anchor>`)

Use `dd-anchor` for long-document section navigation.

```vue
<template>
  <dd-anchor
    :items="[
      { key: 'intro', href: '#intro', title: 'Introduction' },
      { key: 'api', href: '#api', title: 'API' }
    ]"
  />
</template>
```

#### Props

- `items`
- `horizontal`
- `offset`
- `affix`
- `container`

#### Emits

- `click`
- `change`

## 6. Feedback and notifications

### Toaster (`<dd-toaster>` and `useToaster`)

Use one global `dd-toaster` in the application tree and call `useToaster()` where transient feedback is needed.

```vue
<template>
  <dd-toaster />
</template>

<script setup lang="ts">
const { showToast } = useToaster()

function save() {
  showToast('Record saved.', { type: 'success', title: 'Success' })
}
</script>
```

#### Toast defaults

- `type: 'info'`
- `position: 'top-right'`
- `duration: 5000`
