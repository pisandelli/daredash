# Layout Primitives

`daredash` includes a small set of layout primitives built around CSS Modules, tokenized spacing, and attribute-driven variants.

All examples below assume the default `dd` prefix.

## Shared rule

All layout primitives:

- are auto-registered by the Nuxt module;
- render a neutral wrapper by default;
- accept `tag` to change the root HTML element;
- use boolean or valued attrs to activate layout variants.

Example:

```vue
<dd-box tag="section">
  Content
</dd-box>
```

## Box (`<dd-box>`)

A generic wrapper for grouping content with internal padding.

```vue
<template>
  <dd-box>
    Content goes here
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
| `nogap` | Removes internal spacing. |

## Center (`<dd-center>`)

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
| `intrinsic` | Keeps the content centered based on its intrinsic size. |

## Cluster (`<dd-cluster>`)

Places children in a wrapping horizontal row with gap control.

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

## Grid (`<dd-grid>`)

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

Use local overrides when needed:

```css
.my-grid {
  --dd-grid-column-min-width: 200px;
  --dd-grid-gap: 1.5rem;
}
```

## Stack (`<dd-stack>`)

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

`split-after` is useful when one item should push the rest downward:

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
| `reverse` | Reverses visual order. |
| `split-after` | Applies `margin-block-end: auto` to the nth child. |

## Sidebar (`<dd-sidebar>`)

Creates a sidebar/content pattern that can wrap when space gets tight.

```vue
<template>
  <dd-sidebar right>
    <aside>Sidebar Nav</aside>
    <main>Main Content</main>
  </dd-sidebar>
</template>
```

Use `fill` when the sidebar area should occupy available vertical space inside a larger page layout:

```vue
<template>
  <dd-layout>
    <header>Header</header>

    <div data-body>
      <dd-sidebar fill>
        <aside>Sidebar Nav</aside>
        <main>Main Content</main>
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

## Layout (`<dd-layout>`)

High-level page layout wrapper.

```vue
<template>
  <dd-layout>
    <dd-sidebar>
      <aside>Sidebar</aside>
      <main>Main Content</main>
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
