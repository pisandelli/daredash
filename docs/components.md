# UI Components & Primitives

The `daredash` module includes a variety of UI primitives and form elements.

**Note**: Examples assume the default `dd` prefix.

## General Components

### Button (`<dd-button>`)

A styled button component.

```vue
<template>
  <dd-button @click="handleClick">Click Me</dd-button>
  <dd-button href="/home" icon="mdi:home">Home Link</dd-button>
</template>
```

#### Props
-   `warning`, `info`, `success`, `error`: Boolean flags for variations.
-   `href` / `to`: Renders as a link (`NuxtLink`).
-   `icon`: Icon name (via `@nuxt/icon`).

### Card (`<dd-card>`)

A generic card container with default styling.

```vue
<template>
  <dd-card>
    <h2>Card Title</h2>
    <p>Card content...</p>
  </dd-card>
</template>
```

### Badge (`<dd-badge>`)

A small text badge or tag.

```vue
<template>
  <dd-badge>New</dd-badge>
  <dd-badge class="success">Completed</dd-badge>
</template>
```

### Accordion (`<dd-accordion>`)

A collapsible panel using native `<details>` and `<summary>`.

```vue
<template>
  <dd-accordion title="More Info">
    <p>Hidden content...</p>
  </dd-accordion>
</template>
```

#### Props
-   `title`: The summary text.
-   `open`: Initial open state.

### Loading (`<dd-loading>`)

A loading spinner/indicator.

```vue
<template>
  <dd-loading v-if="isLoading" />
</template>
```

### VideoPlayer (`<dd-video-player>`)

A video player wrapper around Video.js.

```vue
<template>
  <dd-video-player src="https://example.com/video.m3u8" />
</template>
```

---

## Form Elements

### Input (`<dd-input>`)

A validated text input field (integrates with VeeValidate).

```vue
<template>
  <dd-input name="email" label="Email Address" type="email" required />
</template>
```

#### Props
-   `name`: Field name for validation (required).
-   `label`: Visual label text.
-   `placeholder`: Input placeholder.
-   `type`: Input type (text, email, password, etc.).

### Checkbox (`<dd-checkbox>`)

A validated checkbox component.

```vue
<template>
  <dd-checkbox name="terms" :value="true">
    I agree to the terms
  </dd-checkbox>
</template>
```

---

## Feedback

### Toaster (`<dd-toaster>`) & Toast

A global notification system. Place `<dd-toaster>` once in your layout (usually in `app.vue` or a root layout).

```vue
<!-- app.vue -->
<template>
  <NuxtLayout>
    <NuxtPage />
    <dd-toaster />
  </NuxtLayout>
</template>
```

#### Usage (`useToaster`)

Use the `useToaster` composable to trigger notifications.

```typescript
const { showToast } = useToaster()

showToast('Operation successful', { type: 'success' })
showToast('Something went wrong', { type: 'error', duration: 5000 })
```
