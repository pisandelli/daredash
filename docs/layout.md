# Layout Primitives

This guide is for application developers composing pages with DareDash. Use it to understand which structural primitive to reach for first, how the layout attrs work, and how to combine these building blocks without inventing custom wrappers too early.

Next step after this guide: [UI Components](./components.md)

## 1. Which primitive should I use?

| Primitive | Use it for |
| :--- | :--- |
| `dd-box` | A neutral wrapper with tokenized internal padding. |
| `dd-center` | Centering content and constraining line length. |
| `dd-cluster` | Horizontal groups of items with wrapping and alignment control. |
| `dd-grid` | Responsive card or tile layouts. |
| `dd-stack` | Vertical page rhythm and grouped flows. |
| `dd-sidebar` | Sidebar/content arrangements that can wrap responsively. |
| `dd-layout` | High-level page shells and full-page vertical framing. |

## 2. Shared rules

All layout primitives:

- are auto-registered by the Nuxt module
- render a neutral wrapper by default
- accept `tag` to change the root element
- use attrs to activate layout variants

Example:

```vue
<template>
  <dd-box tag="section">
    Content
  </dd-box>
</template>
```

## 3. Box (`<dd-box>`)

A generic wrapper for grouping content with internal padding.

```vue
<template>
  <dd-box>
    Content goes here.
  </dd-box>
</template>
```

### Props

| Prop | Type | Default |
| :--- | :--- | :--- |
| `tag` | `string` | `'div'` |

### Relevant attrs

| Attr | Description |
| :--- | :--- |
| `nogap` | Removes the internal padding. |

## 4. Center (`<dd-center>`)

Centers content horizontally and constrains width using tokens.

```vue
<template>
  <dd-center intrinsic>
    <p>This content is centered.</p>
  </dd-center>
</template>
```

### Props

| Prop | Type | Default |
| :--- | :--- | :--- |
| `tag` | `string` | `'div'` |

### Relevant attrs

| Attr | Description |
| :--- | :--- |
| `intrinsic` | Keeps the layout centered around intrinsic content size. |

## 5. Cluster (`<dd-cluster>`)

Places children in a wrapping horizontal row with alignment and gap controls.

```vue
<template>
  <dd-cluster between>
    <dd-button>One</dd-button>
    <dd-button>Two</dd-button>
    <dd-button>Three</dd-button>
  </dd-cluster>
</template>
```

### Props

| Prop | Type | Default |
| :--- | :--- | :--- |
| `tag` | `string` | `'div'` |

### Relevant attrs

| Attr | Description |
| :--- | :--- |
| `center` | Centers items horizontally. |
| `end` | Aligns items to the end. |
| `between` | Uses `space-between`. |
| `around` | Uses `space-around`. |
| `evenly` | Uses `space-evenly`. |
| `narrow` | Reduces the gap. |
| `wide` | Increases the gap. |
| `nowrap` | Prevents wrapping. |
| `stretch` | Stretches items vertically. |
| `nogap` | Removes the gap. |

## 6. Grid (`<dd-grid>`)

Creates a responsive CSS grid based on tokenized gap and minimum column width.

```vue
<template>
  <dd-grid>
    <dd-card>A</dd-card>
    <dd-card>B</dd-card>
  </dd-grid>
</template>
```

### Props

| Prop | Type | Default |
| :--- | :--- | :--- |
| `tag` | `string` | `'div'` |

### Customization

Use local CSS variable overrides when needed:

```css
.my-grid {
  --dd-grid-column-min-width: 200px;
  --dd-grid-gap: 1.5rem;
}
```

## 7. Stack (`<dd-stack>`)

Stacks children vertically using tokenized spacing.

```vue
<template>
  <dd-stack compact>
    <h2>Heading</h2>
    <p>Paragraph text.</p>
    <dd-button>Action</dd-button>
  </dd-stack>
</template>
```

`split-after` is useful when one child should push the remaining content downward:

```vue
<template>
  <dd-stack split-after="2" style="min-height: 14rem;">
    <header>Toolbar</header>
    <nav>Filters</nav>
    <footer>Actions pinned to the bottom</footer>
  </dd-stack>
</template>
```

### Props

| Prop | Type | Default |
| :--- | :--- | :--- |
| `tag` | `string` | `'div'` |

### Relevant attrs

| Attr | Description |
| :--- | :--- |
| `compact` | Reduces the vertical gap. |
| `spaced` | Uses a larger gap. |
| `nogap` | Removes the gap. |
| `recursive` | Applies stack spacing inside nested children. |
| `reverse` | Reverses the visual order. |
| `split-after` | Applies `margin-block-end: auto` to the nth child. |

## 8. Sidebar (`<dd-sidebar>`)

Creates a sidebar/content pattern that can wrap when space gets tight.

```vue
<template>
  <dd-sidebar right>
    <aside>Sidebar navigation</aside>
    <main>Main content</main>
  </dd-sidebar>
</template>
```

Use `fill` when the sidebar region should stretch inside a larger page shell:

```vue
<template>
  <dd-layout>
    <header>Header</header>

    <div data-body>
      <dd-sidebar fill>
        <aside>Sidebar navigation</aside>
        <main>Main content</main>
      </dd-sidebar>
    </div>

    <footer>Footer</footer>
  </dd-layout>
</template>
```

### Props

| Prop | Type | Default |
| :--- | :--- | :--- |
| `tag` | `string` | `'div'` |

### Relevant attrs

| Attr | Description |
| :--- | :--- |
| `right` | Places the sidebar on the right side. |
| `start` | Aligns items to the top. |
| `end` | Aligns items to the bottom. |
| `fill` | Expands the layout to occupy available vertical space. |
| `nogap` | Removes the gap. |

## 9. Layout (`<dd-layout>`)

High-level page layout wrapper.

```vue
<template>
  <dd-layout>
    <dd-sidebar>
      <aside>Sidebar</aside>
      <main>Main content</main>
    </dd-sidebar>
  </dd-layout>
</template>
```

### Props

| Prop | Type | Default |
| :--- | :--- | :--- |
| `tag` | `string` | `'div'` |

### Important note

`dd-layout` itself does not expose a formal `body` or `fill` prop API. Instead, some CSS behaviors react to descendants carrying `data-body` and `data-fill`.

Use that pattern only when you really need the page body to stretch inside a larger shell.

## 10. Practical composition tips

- Start with `dd-stack` when the page is mostly vertical.
- Use `dd-cluster` for toolbars, action rows, and mixed inline controls.
- Use `dd-grid` for card collections and dashboard sections.
- Use `dd-sidebar` when the content relationship is explicitly “main + aside”.
- Use `dd-layout` only when you are shaping the whole page shell, not for small internal sections.
