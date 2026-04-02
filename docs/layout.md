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

Centers content horizontally using `margin-inline: auto`. Can also center text or children vertically/horizontally using flexbox properties.

```vue
<template>
  <dd-center intrinsic>
    <p>This content is centered within the parent.</p>
  </dd-center>
</template>
```

### Props/Attrs

| Property | Type | Description |
| :--- | :--- | :--- |
| `intrinsic` | `Boolean` | If present, centers the content based on its intrinsic width. |
| `text` | `Boolean` | Centers text alignment. |

## Cluster (`<dd-cluster>`)

Arranges children in a wrapping row with consistent spacing (gap). Great for button groups, tags, or navigation links.

```vue
<template>
  <dd-cluster center>
    <dd-button>One</dd-button>
    <dd-button>Two</dd-button>
    <dd-button>Three</dd-button>
  </dd-cluster>
</template>
```

### Props/Attrs

*Note: Items are aligned to the `center` vertically by default.*

| Property | Type | Description |
| :--- | :--- | :--- |
| `center` | `Boolean` | Justifies content to the center. |
| `end` | `Boolean` | Justifies content to the end (flex-end). |
| `between` | `Boolean` | Justifies content using space-between. |
| `around` | `Boolean` | Justifies content using space-around. |
| `evenly` | `Boolean` | Justifies content using space-evenly. |
| `narrow` | `Boolean` | Reduces the gap between items. |
| `wide` | `Boolean` | Increases the gap between items. |
| `nowrap` | `Boolean` | Prevents items from wrapping to the next line. |
| `stretch` | `Boolean` | Changes alignment to stretch items vertically. |
| `nogap` | `Boolean` | Removes the gap entirely. |

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
.my-grid {
  --dd-grid-min-item-size: 200px;
  --dd-grid-gap: 1.5rem;
}
```

## Stack (`<dd-stack>`)

Arranges children vertically with consistent spacing (gap). A foundational vertical layout component.

```vue
<template>
  <dd-stack compact>
    <h2>Heading</h2>
    <p>Paragraph text.</p>
    <dd-button>Action</dd-button>
  </dd-stack>
</template>
```

### Props/Attrs

| Property | Type | Description |
| :--- | :--- | :--- |
| `compact` | `Boolean` | Reduces the vertical gap. |
| `nogap` | `Boolean` | Removes the gap entirely. |
| `recursive` | `Boolean` | Applies stack spacing to nested elements. |
| `split-after` | `Number/String` | Applies `margin-block-end: auto` to the nth child, pushing subsequent items to the bottom. |

## Sidebar (`<dd-sidebar>`)

Arranges elements horizontally, placing a sidebar alongside a main content area. Based on Every Layout's "The Sidebar" pattern. It automatically wraps into a stacked layout when the main content would fall below its minimum threshold width.

```vue
<template>
  <dd-sidebar right>
    <aside>Sidebar Nav</aside>
    <div>Main Content</div>
  </dd-sidebar>
</template>
```

### Props/Attrs

| Property | Type | Description |
| :--- | :--- | :--- |
| `right` | `Boolean` | Reverses the order, placing the sidebar on the right instead of the left. |
| `start` | `Boolean` | Aligns items to the top (flex-start). |
| `end` | `Boolean` | Aligns items to the bottom (flex-end). |
| `nogap` | `Boolean` | Removes the gap between the sidebar and the main content. |

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
