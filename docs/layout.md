# Layout Primitives

The `daredash` module provides a set of layout primitives to handle common CSS patterns. These components rely heavily on CSS custom properties for configuration.

**Note**: All component names are prefixed based on your configuration (default: `dd`, example: `rtv`). The examples below assume the default `dd` prefix.

## Box (`<dd-box>`)

A generic container for grouping content. Useful for applying padding, borders, and background colors.

```vue
<template>
  <dd-box class="my-box">
    Content goes here
  </dd-box>
</template>

<style scoped>
.my-box {
  /* Override tokens */
  --dd-box-padding: 2rem;
  --dd-box-background-color: white;
}
</style>
```

## Center (`<dd-center>`)

centers content horizontally using `margin-inline: auto`. Can also center text or children vertically/horizontally using flexbox properties.

```vue
<template>
  <dd-center intrinsic>
    <p>This content is centered within the parent.</p>
  </dd-center>
</template>
```

### Props/Attrs
-   `intrinsic`: If present, centers the content based on its intrinsic width.
-   `text`: Centers text alignment.

## Cluster (`<dd-cluster>`)

Arranges children in a wrapping row with consistent spacing (gap). Great for button groups, tags, or navigation links.

```vue
<template>
  <dd-cluster>
    <dd-button>One</dd-button>
    <dd-button>Two</dd-button>
    <dd-button>Three</dd-button>
  </dd-cluster>
</template>
```

### Props/Attrs
-   `justify`: CSS `justify-content` value (start, center, end, space-between).
-   `align`: CSS `align-items` value.
-   `narrow`: Reduces the gap.

## Grid (`<dd-grid>`)

Creates a CSS Grid layout.

```vue
<template>
  <dd-grid>
    <div>Column 1</div>
    <div>Column 2</div>
  </dd-grid>
</template>
```

### Customization
Use CSS custom properties to control columns:
```css
--dd-grid-min-item-size: 200px;
--dd-grid-gap: 1.5rem;
```

## Stack (`<dd-stack>`)

Arranges children vertically with consistent spacing (gap). A foundational vertical layout component.

```vue
<template>
  <dd-stack>
    <h2>Heading</h2>
    <p>Paragraph text.</p>
    <dd-button>Action</dd-button>
  </dd-stack>
</template>
```

### Props/Attrs
-   `compact`: Reduces the vertical gap.
-   `nogap`: Removes the gap entirely.
-   `recursive`: Applies stack spacing to nested elements.
-   `split-after`: Applies `margin-block-end: auto` to the nth child, pushing subsequent items to the bottom.

## Layout (`<dd-layout>`)

Root layout component often used for page structures (Sidebar + Main Content).

```vue
<template>
  <dd-layout>
    <aside>Sidebar</aside>
    <main>Main Content</main>
  </dd-layout>
</template>
```

## Modal (`<dd-modal>`)

A native Popover-based modal dialog.

```vue
<template>
  <dd-button @click="isOpen = true">Open Modal</dd-button>

  <dd-modal v-model:open="isOpen" title="My Modal">
    <p>This is a native popover modal.</p>
    <template #header>
      <!-- Optional custom header -->
    </template>
  </dd-modal>
</template>
```

### Props
-   `open`: Boolean (v-model).
-   `title`: String for the header title.

