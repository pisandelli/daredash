# UI Components & Primitives

`daredash` provides an extensive collection of User Interface Primitives and complex Widgets to build Nuxt applications.

**Note:** The examples assume the default `dd` prefix. If you have configured a different prefix (e.g., `rtv`), replace `dd-` with `rtv-`.

---

## 1. Primitives (Base Components)

These components are simple building blocks, mostly Functional (TS), meaning they are lightweight and delegate styling strictly to CSS Modules.

### 1.1 Button (`<dd-button>`)

A button component with support for state variations, icons, and link behavior.

```vue
<template>
  <dd-cluster>
    <dd-button @click="handleClick">Default Button</dd-button>
    <dd-button warning>Warning</dd-button>
    <dd-button href="/home" icon="mdi:home">Link to Home</dd-button>
  </dd-cluster>
</template>
```

#### API (Props / Attributes)

| Property | Type | Description |
| :--- | :--- | :--- |
| `warning` | `Boolean` | Styles the button with the warning color (yellow/orange). |
| `info` | `Boolean` | Styles the button with the info color (light blue). |
| `success` | `Boolean` | Styles the button with the success color (green). |
| `error` | `Boolean` | Styles the button with the error color (red). |
| `href`/`to` | `String` | Renders the button as a `<NuxtLink>` or `<a>`. |
| `icon` | `String` | Name of the icon to be rendered before the text (uses `@nuxt/icon`). |
| `disabled` | `Boolean` | Disables interactions and applies opacity. |

### 1.2 Card (`<dd-card>`)

A generic container to group content with default elevation/border styling.

```vue
<template>
  <dd-card>
    <h3>Card Title</h3>
    <p>Detailed card content goes here.</p>
  </dd-card>
</template>
```

### 1.3 Badge (`<dd-badge>`)

A small label or text tag.

```vue
<template>
  <dd-cluster>
    <dd-badge>New</dd-badge>
    <dd-badge success>Completed</dd-badge>
    <dd-badge error>Failed</dd-badge>
  </dd-cluster>
</template>
```

#### API (Props / Attributes)

| Property | Type | Description |
| :--- | :--- | :--- |
| `warning` | `Boolean` | Warning style. |
| `info` | `Boolean` | Informative style. |
| `success` | `Boolean` | Success style. |
| `error` | `Boolean` | Error style. |

### 1.4 Avatar (`<dd-avatar>` & `<dd-avatar-group>`)

Displays a profile picture or user initials.

```vue
<template>
  <dd-avatar-group>
    <dd-avatar src="https://example.com/photo1.jpg" alt="Maria" />
    <dd-avatar fallback="JD" />
    <dd-avatar icon="mdi:account" />
  </dd-avatar-group>
</template>
```

### 1.5 Alert (`<dd-alert>`)

Displays an important message to the user.

```vue
<template>
  <dd-alert title="Attention" warning>
    Your session will expire in 5 minutes.
  </dd-alert>
</template>
```

### 1.6 Progress (`<dd-progress>`)

Linear progress bar.

```vue
<template>
  <dd-progress :value="50" max="100" />
</template>
```

### 1.7 Loading (`<dd-loading>`)

A visual indicator (spinner) for ongoing processes.

```vue
<template>
  <dd-loading v-if="isLoading" />
</template>
```

### 1.8 Breadcrumb (`<dd-breadcrumb>`)

Breadcrumb navigation trail.

```vue
<template>
  <dd-breadcrumb :items="[{ label: 'Home', href: '/' }, { label: 'Docs', href: '/docs' }]" />
</template>
```

### 1.9 VideoPlayer (`<dd-video-player>`)

A responsive wrapper for Video.js.

```vue
<template>
  <dd-video-player src="https://example.com/video.m3u8" poster="/cover.jpg" />
</template>
```

---

## 2. Forms & Inputs

### 2.1 Basic Primitives

These are styled HTML form elements (without attached validation).

* `<dd-input>`: Generic text field.
* `<dd-textarea>`: Multiline text field.
* `<dd-select>`: Native dropdown menu.
* `<dd-checkbox>`: Checkbox.
* `<dd-radio>`: Radio button.
* `<dd-toggle>`: Switch.
* `<dd-input-search>`: Field optimized for search.

```vue
<template>
  <dd-form-label text="Your Name">
    <dd-input placeholder="e.g., John Doe" />
  </dd-form-label>
</template>
```

#### Add-ons (InputGroup)
To add icons or buttons next to the input.

```vue
<template>
  <dd-input-group>
    <template #leading>
      <dd-icon name="mdi:email" />
    </template>
    <dd-input type="email" placeholder="email@example.com" />
    <template #trailing>
      <dd-button>Send</dd-button>
    </template>
  </dd-input-group>
</template>
```

### 2.2 Form Wrappers (VeeValidate Integration)

For complete forms with robust validation, `daredash` provides wrappers prefixed with `Form` that integrate seamlessly with the `vee-validate` library.

They manage error messages and states (dirty, touched) automatically.

* `<dd-form-input>`
* `<dd-form-textarea>`
* `<dd-form-select>`
* `<dd-form-checkbox>`
* `<dd-form-radio>`
* `<dd-form-toggle>`

```vue
<template>
  <dd-form-input
    name="email"
    label="Email Address"
    type="email"
    required
  />
</template>
```

#### Wrappers API (Props)

| Property | Type | Description |
| :--- | :--- | :--- |
| `name` | `String` | Name of the field in the form (required for validation). |
| `label` | `String` | Text of the visual label. |
| `placeholder` | `String` | Hint text for the field. |
| `type` | `String` | Type of input (text, email, password, etc.). |

---

## 3. Widgets (Complex Components)

Widgets are more sophisticated interactive components (Vue SFCs), usually containing internal state and heavy logic.

### 3.1 Accordion (`<dd-accordion>` & `<dd-accordion-group>`)

Native expandable panels based on `<details>` and `<summary>` tags.

```vue
<template>
  <dd-accordion-group>
    <dd-accordion title="Question 1" open>
      Detailed answer...
    </dd-accordion>
    <dd-accordion title="Question 2">
      Another detailed answer...
    </dd-accordion>
  </dd-accordion-group>
</template>
```

#### API (Props)
* `title`: The visible summary text.
* `open`: Boolean that dictates the initial state of the panel.

### 3.2 Modal (`<dd-modal>`)

A dialog box using the native browser Popover API (when applicable) and `dialog` behaviors.

```vue
<template>
  <dd-button @click="isOpen = true">Open Modal</dd-button>

  <dd-modal v-model:open="isOpen" title="Confirm Action">
    <p>Are you sure you want to delete this item?</p>
    <template #footer>
      <dd-cluster justify="end">
        <dd-button warning @click="isOpen = false">Cancel</dd-button>
        <dd-button success>Confirm</dd-button>
      </dd-cluster>
    </template>
  </dd-modal>
</template>

<script setup>
import { ref } from 'vue'
const isOpen = ref(false)
</script>
```

#### Slots
* `header`: Replaces the default header (where the title is).
* `default`: Main body of the modal.
* `footer`: Bottom area, generally used for action buttons.

### 3.3 Drawer (`<dd-drawer>`)

Sliding panel (Off-canvas).

```vue
<template>
  <dd-drawer v-model:open="isOpen" side="right">
    Sidebar menu content...
  </dd-drawer>
</template>
```

#### API (Props)
* `side`: 'left', 'right', 'top', 'bottom' (default: 'right').

### 3.4 Tabs (`<dd-tabs>`)

Tab navigation.

```vue
<template>
  <dd-tabs>
    <dd-tab-list>
      <dd-tab>Profile</dd-tab>
      <dd-tab>Settings</dd-tab>
    </dd-tab-list>
    <dd-tab-panels>
      <dd-tab-panel>Profile data...</dd-tab-panel>
      <dd-tab-panel>System options...</dd-tab-panel>
    </dd-tab-panels>
  </dd-tabs>
</template>
```

### 3.5 Table (`<dd-table>`)

Styled data table.

```vue
<template>
  <dd-table :columns="columns" :data="rows" />
</template>
```

### 3.6 Pagination (`<dd-pagination>`)

Controls to navigate between pages of results.

```vue
<template>
  <dd-pagination :total="100" :per-page="10" v-model:page="currentPage" />
</template>
```

### 3.7 Popover (`<dd-popover>`)

A small information balloon anchored to an element.

```vue
<template>
  <dd-popover>
    <template #trigger>
      <dd-button>More options</dd-button>
    </template>
    <ul>
      <li>Option A</li>
      <li>Option B</li>
    </ul>
  </dd-popover>
</template>
```

### 3.8 Menu (`<dd-menu>`)

A versatile navigation component supporting vertical/horizontal orientations, collapsible sidebars, accordion and floating sub-menus, and sticky separators.

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

#### Collapsible Sidebar

```vue
<template>
  <dd-menu
    :items="menuItems"
    collapsible
    toggle-button
    v-model:collapsed="isCollapsed"
  />
</template>
```

#### Props

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `items` | `MenuEntry[]` | Required | Array of menu items and separators. |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | Menu orientation. |
| `collapsible` | `Boolean` | `false` | Allows the menu to be collapsed. |
| `collapsed` | `Boolean` | `false` | Controlled collapsed state (use `v-model:collapsed`). |
| `toggleButton` | `Boolean` | `false` | Renders a built-in toggle button. |
| `activeKey` | `String` | `undefined` | Overrides automatic active detection. |
| `maxHeight` | `String` | `undefined` | Fixed height with overflow scroll (vertical only). |
| `maxWidth` | `String` | `undefined` | Fixed width with overflow scroll (horizontal only). |

#### Events

| Event | Payload | Description |
| :--- | :--- | :--- |
| `update:collapsed` | `boolean` | Fired when collapsed state changes. |
| `select` | `{ key: string, item: MenuItem }` | Fired when an action item is clicked. |

#### Types

```typescript
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

### 3.9 Anchor (`<dd-anchor>`)

A scroll-to-position component that creates navigation anchors with smooth scrolling.

```vue
<template>
  <dd-anchor>
    <dd-cluster>
      <a href="#section-1">Section 1</a>
      <a href="#section-2">Section 2</a>
      <a href="#section-3">Section 3</a>
    </dd-cluster>
  </dd-anchor>
</template>
```

#### Props

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `scroll-behavior` | `'smooth' \| 'auto'` | `'smooth'` | Scroll behavior when clicking anchors. |
| `offset` | `Number` | `0` | Offset from the top of the viewport. |
| `active-key` | `String` | `undefined` | Currently active anchor key. |

#### Slots

* `default`: The trigger links/buttons.

---

## 4. Feedback and Notifications

### Toaster (`<dd-toaster>` & `useToaster`)

Global notification system (Toast messages).

**Initial Setup:**
Place the `<dd-toaster>` component **only once** in your base layout (usually in `app.vue` or within layouts like `default.vue`).

```vue
<!-- app.vue -->
<template>
  <NuxtLayout>
    <NuxtPage />
    <dd-toaster /> <!-- Single global instance -->
  </NuxtLayout>
</template>
```

**Use in Components/Pages:**
Use the `useToaster` composable to trigger notifications from anywhere in your application.

```vue
<script setup>
const { showToast } = useToaster()

const save = async () => {
  try {
    await asyncOperation()
    showToast('Operation performed successfully!', { type: 'success' })
  } catch (err) {
    showToast('An error occurred while saving.', { type: 'error', duration: 5000 })
  }
}
</script>
```

#### Toast Options
* `type`: 'success', 'error', 'warning', 'info' (Default: 'info').
* `duration`: Time in milliseconds before disappearing (Default: 3000ms). Use `0` for persistent toasts (closed manually).
* `title`: Bold title above the main message.
