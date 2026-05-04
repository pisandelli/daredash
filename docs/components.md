# UI Components

`daredash` ships a set of primitives, form wrappers, and interactive widgets for Nuxt applications.

All examples assume the default `dd` prefix.

## 1. Primitives

### Button (`<dd-button>`)

Use `dd-button` for actions, links, and simple call-to-action patterns.

```vue
<template>
  <dd-cluster>
    <dd-button primary icon="heroicons:plus">New</dd-button>
    <dd-button outline href="/docs">Docs</dd-button>
  </dd-cluster>
</template>
```

#### Props

| Prop | Type | Description |
| :--- | :--- | :--- |
| `color` | `string` | Overrides the base button color directly. |
| `icon` | `string` | Left-side icon name. |
| `to` | `string \| object` | Renders the button as a Nuxt link. |
| `href` | `string` | Renders the button as an external/internal href link. |

#### Common attrs

- semantic attrs such as `primary`, `success`, `warning`, `danger`, `info`
- visual attrs such as `ghost`, `outline`, `full`, `icon-right`, `icon-only`
- size attrs such as `tiny`, `small`, `large`, `xlarge`

### Card (`<dd-card>`)

Use `dd-card` to group related content.

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

### Badge (`<dd-badge>`)

Small label for status or metadata.

```vue
<template>
  <dd-cluster>
    <dd-badge>New</dd-badge>
    <dd-badge success>Done</dd-badge>
    <dd-badge danger icon="heroicons:x-mark">Failed</dd-badge>
  </dd-cluster>
</template>
```

#### Props

| Prop | Type | Description |
| :--- | :--- | :--- |
| `icon` | `string` | Optional icon. |
| `color` | `string` | Custom badge color override. |

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

#### `dd-avatar-group` props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `limit` | `number` | `5` | Maximum number of rendered avatar children. |

### Alert (`<dd-alert>`)

Inline contextual message.

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
| `color` | `string` | `undefined` | Custom alert color. |
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

Linear progress bar.

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

Loading indicator.

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

### Breadcrumb (`<dd-breadcrumb>`)

Breadcrumb navigation trail.

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
| `config` | `BreadcrumbConfig` | Configuration object with `routes` and optional `separator`. |

## 2. Form primitives

### Input (`<dd-input>`)

Styled text input.

```vue
<template>
  <dd-input
    name="email"
    label="Email"
    type="email"
    placeholder="email@example.com"
  />
</template>
```

Key props:

- `name`
- `label`
- `type`
- `id`
- `placeholder`
- `icon`
- `iconRight`
- `modelValue`
- `isInvalid`
- `errorMessage`

### Textarea (`<dd-textarea>`)

Styled multiline text field.

Key props:

- `name`
- `label`
- `id`
- `placeholder`
- `modelValue`
- `maxLength`
- `rows`
- `isInvalid`
- `errorMessage`
- `useValidation`

### Select (`<dd-select>`)

Styled native select element.

```vue
<template>
  <dd-select
    name="role"
    label="Role"
    :options="[
      { label: 'Editor', value: 'editor' },
      { label: 'Admin', value: 'admin' }
    ]"
  />
</template>
```

Key props:

- `name`
- `label`
- `id`
- `options`
- `placeholder`
- `modelValue`
- `isInvalid`
- `errorMessage`

### Checkbox (`<dd-checkbox>`)

Checkbox for boolean or array-based selection.

### Radio (`<dd-radio>`)

Radio option for a mutually exclusive group.

### Toggle (`<dd-toggle>`)

Binary switch component.

### InputSearch (`<dd-input-search>`)

Search field with built-in trigger button.

```vue
<template>
  <dd-input-search
    v-model="query"
    button-label="Search"
    @search="runSearch"
  />
</template>
```

#### Emits

- `update:modelValue`
- `search`

### InputGroup (`<dd-input-group>`)

Wraps a field with optional pre/post content.

```vue
<template>
  <dd-input-group label="Email" error-message="Invalid email" error>
    <template #pre>@</template>
    <dd-input type="email" placeholder="email@example.com" />
    <template #post>
      <dd-button>Send</dd-button>
    </template>
  </dd-input-group>
</template>
```

#### Props

| Prop | Type | Description |
| :--- | :--- | :--- |
| `label` | `string` | Group label. |
| `id` | `string` | Label association target. |
| `pre` | `string` | Text sugar for the `#pre` slot. |
| `post` | `string` | Text sugar for the `#post` slot. |
| `errorMessage` | `string` | Error message. |
| `warningMessage` | `string` | Warning message. |

#### Slots

- `default`
- `pre`
- `post`

### FormLabel (`<dd-form-label>`)

Styled label wrapper.

```vue
<template>
  <dd-form-label>Email</dd-form-label>
</template>
```

## 3. Form wrappers (`vee-validate`)

These wrappers forward most fallthrough attrs to the underlying primitive while integrating with `vee-validate`.

Available wrappers:

- `<dd-form-input>`
- `<dd-form-textarea>`
- `<dd-form-select>`
- `<dd-form-checkbox>`
- `<dd-form-radio>`
- `<dd-form-toggle>`

Shared documented props:

- `name` (required)
- `modelValue` (wrapper-dependent)

Example:

```vue
<template>
  <dd-form-input
    name="email"
    label="Email Address"
    type="email"
  />
</template>
```

## 4. Widgets

### Accordion (`<dd-accordion>` and `<dd-accordion-group>`)

Native expandable panels built on `<details>` and `<summary>`.

```vue
<template>
  <dd-accordion-group>
    <dd-accordion title="Question 1">
      Detailed answer...
    </dd-accordion>
    <dd-accordion title="Question 2">
      Another detailed answer...
    </dd-accordion>
  </dd-accordion-group>
</template>
```

#### `dd-accordion` props

- `title`
- `icon`
- `accentColor`
- `name`

#### `dd-accordion-group` props

- `multiple`
- `accentColor`

### Modal (`<dd-modal>`)

Dialog built on native `<dialog>`.

```vue
<template>
  <dd-modal :open="isOpen" title="Confirm Action" @update:open="isOpen = $event">
    <p>Are you sure you want to delete this item?</p>
    <template #footer>
      <dd-cluster end>
        <dd-button ghost>Cancel</dd-button>
        <dd-button primary>Confirm</dd-button>
      </dd-cluster>
    </template>
  </dd-modal>
</template>
```

#### Props

- `open`
- `title`
- `closeOnBackdrop`

#### Emits

- `close`
- `update:open`

#### Slots

- `default`
- `footer`

### Drawer (`<dd-drawer>`)

Sliding panel built on native `<dialog>`.

```vue
<template>
  <dd-drawer :open="isOpen" position="right" @update:open="isOpen = $event">
    <template #header>Sidebar Menu</template>
    Drawer content...
  </dd-drawer>
</template>
```

#### Props

- `open`
- `title`
- `closeOnBackdrop`
- `position`

#### Emits

- `close`
- `update:open`

#### Slots

- `header`
- `default`
- `footer`

### Tabs

Tabs are split into:

- `<dd-tabs>`
- `<dd-tab-list>`
- `<dd-tab>`
- `<dd-tab-panels>`
- `<dd-tab-panel>`

```vue
<template>
  <dd-tabs v-model="activeTab">
    <dd-tab-list>
      <dd-tab value="profile">Profile</dd-tab>
      <dd-tab value="settings">Settings</dd-tab>
    </dd-tab-list>
    <dd-tab-panels>
      <dd-tab-panel value="profile">Profile data...</dd-tab-panel>
      <dd-tab-panel value="settings">System options...</dd-tab-panel>
    </dd-tab-panels>
  </dd-tabs>
</template>
```

### Table (`<dd-table>`)

Styled data table with empty, loading, and error states.

```vue
<template>
  <dd-table :columns="columns" :data="rows" />
</template>
```

#### Props

- `columns`
- `data`
- `rowKey`
- `loading`
- `isInvalid`
- `errorMessage`

#### Slots

- `empty`
- `header-${column.key}`
- `cell-${column.key}`

### Pagination (`<dd-pagination>`)

Pagination controls.

```vue
<template>
  <dd-pagination :total="100" :page-size="10" v-model="currentPage" />
</template>
```

#### Props

- `disabled`
- `total`
- `modelValue`
- `pageSize`
- `siblingCount`

#### Emits

- `update:modelValue`

### Popover (`<dd-popover>`)

Small contextual layer attached to a trigger.

```vue
<template>
  <dd-popover title="More options" trigger="click">
    <dd-button>More options</dd-button>

    <template #content>
      <ul>
        <li>Option A</li>
        <li>Option B</li>
      </ul>
    </template>
  </dd-popover>
</template>
```

#### Props

- `title`
- `trigger`
- `placement`
- `offset`
- `onClose`

#### Slots

- `default`
- `header`
- `content`

### Menu (`<dd-menu>`)

Navigation component supporting vertical/horizontal modes, collapsible sidebars, submenus, and separators.

```vue
<template>
  <dd-menu :items="menuItems" />
</template>

<script setup>
const menuItems = [
  { key: 'home', label: 'Home', icon: 'heroicons:home', action: { type: 'link', to: '/' } },
  { key: 'settings', label: 'Settings', action: { type: 'action', handler: () => {} } },
  { type: 'separator', label: 'Reports' },
  {
    key: 'reports',
    label: 'Reports',
    icon: 'heroicons:chart-bar',
    action: { type: 'none' },
    children: [
      { key: 'monthly', label: 'Monthly', action: { type: 'link', to: '/reports/monthly' } },
      { key: 'annual', label: 'Annual', action: { type: 'link', to: '/reports/annual' } }
    ]
  }
]
</script>
```

#### Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `items` | `MenuEntry[]` | required | Menu entries and separators. |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | Menu orientation. |
| `collapsible` | `boolean` | `false` | Allows collapsing in vertical mode. |
| `collapsed` | `boolean` | `false` | Controlled collapsed state. |
| `toggleButton` | `boolean` | `false` | Renders a built-in collapse toggle. |
| `activeKey` | `string` | `undefined` | Overrides automatic active detection. |
| `maxHeight` | `string` | `undefined` | Scrollable max block size in vertical mode. |
| `maxWidth` | `string` | `undefined` | Scrollable max inline size in horizontal mode. |

#### Emits

- `update:collapsed`
- `select`

#### Types

```ts
type MenuItemActionType =
  | { type: 'link'; to: string; target?: '_blank' | '_self' | '_parent' | '_top' }
  | { type: 'action'; handler: () => void }
  | { type: 'none' }

interface MenuItem {
  key: string
  label: string
  icon?: string
  badge?: { label: string | number; color?: string }
  disabled?: boolean
  active?: boolean
  float?: boolean
  children?: MenuEntry[]
  action: MenuItemActionType
}

interface MenuSeparator {
  type: 'separator'
  label?: string
  icon?: string
}

type MenuEntry = MenuItem | MenuSeparator
```

### Anchor (`<dd-anchor>`)

Anchor navigation component that tracks the current section while scrolling.

```vue
<template>
  <dd-anchor
    :items="[
      { key: 'intro', href: '#intro', title: 'Introduction' },
      { key: 'usage', href: '#usage', title: 'Usage' },
      { key: 'api', href: '#api', title: 'API' }
    ]"
  />
</template>
```

#### Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `items` | `AnchorItem[]` | `[]` | Anchor entries to render. |
| `horizontal` | `boolean` | `false` | Changes layout to horizontal. |
| `offset` | `number` | `0` | Offset used for active item detection. |
| `affix` | `boolean` | `false` | Uses fixed positioning behavior. |
| `container` | `string \| HTMLElement \| Window` | `window` | Scrollable container. |

#### Emits

- `click`
- `change`

## 5. Feedback and notifications

### Toaster (`<dd-toaster>` and `useToaster`)

Global toast system.

Place `<dd-toaster>` once near the root of the app:

```vue
<template>
  <NuxtLayout>
    <NuxtPage />
    <dd-toaster />
  </NuxtLayout>
</template>
```

Use `useToaster()` to create notifications:

```vue
<script setup>
const { showToast } = useToaster()

showToast('Operation performed successfully!', {
  type: 'success',
  title: 'Success'
})
</script>
```

#### Toast defaults

- `type: 'info'`
- `position: 'top-right'`
- `duration: 5000`
