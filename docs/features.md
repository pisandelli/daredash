# Features

`daredash` is a powerful Nuxt module designed to centralize and manage Design Tokens, allowing you to apply styles in a flexible and predictable way. Below, we detail the key features, token usage, and best practices.

## 1. Using Tokens

The heart of `daredash` is its Design Token system. Instead of scattering hexadecimal color values or measurements (rem, px) directly in CSS or components, you define these values in a centralized JSON file and reference them.

### Why use Tokens?
* **Consistency:** Ensures the same color or spacing is used throughout the application.
* **Maintainability:** Updating a token in a single file affects the entire application.
* **Theming:** Makes it easy to create dark modes or custom themes for different brands using the same codebase.

## 2. Token Types

The library supports two types of tokens:

### Standard Tokens
These are simple key-value pairs. They are often used to create references to other tokens or define simple values that don't require strict browser typing.

```json
{
  "color": {
    "text": {
      "$value": "{color.primary}"
    }
  }
}
```

### Typed Tokens
Tokens defined as objects with a specific schema, intended for use with the `CSS.registerProperty` API (CSS Typed OM). This allows the browser to know the *type* of value that CSS property expects (e.g., `<color>`, `<length>`, `<number>`).

```json
{
  "color": {
    "primary": {
      "$value": {
        "syntax": "<color>",
        "inherits": true,
        "initial-value": "#0090ea"
      }
    }
  }
}
```

**Benefits of Typed Tokens:**
* **Type Safety in CSS:** The browser rejects invalid values (e.g., setting a size `10px` for a property of type `<color>`).
* **Animations (Transitions):** Typed custom properties can be animated smoothly (e.g., gradual transition between two colors).

## 3. How to Use Tokens

Tokens defined in your JSON file are automatically converted into **CSS Custom Properties (CSS Variables)** during the Nuxt build process.

### In CSS (PostCSS)
`daredash` uses a custom PostCSS plugin (`postcss-v-function`) to make it easier to reference tokens in your CSS files. Instead of using `var(--dd-color-primary)`, you can use the `v()` function.

```css
.my-component {
  /* Using the PostCSS v() function */
  color: v('color.text');
  background-color: v('color.primary');

  /* Is converted to: */
  /* color: var(--dd-color-text); */
  /* background-color: var(--dd-color-primary); */
}
```

This approach allows seamless integration with other native CSS functions, such as `color-mix()` or relative color syntax.

### In Vue Components
Since tokens become standard CSS variables in the root (`:root`), you can use them directly in inline style attributes or in utility classes if you use something like Tailwind CSS alongside it, referencing the generated global variables (e.g., `--dd-color-primary`).

## 4. How to Apply Components

`daredash` provides a series of components (Primitives and Widgets) that come pre-styled based on your tokens.

The components respect the prefix defined in the module configuration (by default, `dd`).

```vue
<template>
  <dd-layout>
    <dd-sidebar>
      <dd-stack>
        <dd-button>Action</dd-button>
        <dd-badge>New</dd-badge>
      </dd-stack>
    </dd-sidebar>
    <dd-box>
      Main content here.
    </dd-box>
  </dd-layout>
</template>
```

## 5. Best Practices for Customization and Theming

The architecture of `daredash` follows a golden rule (Token Layering) to prevent style leakage and allow safe overrides.

### Token Layering (The Golden Rule)

1. **Global Token:** Defined in your tokens JSON file (e.g., `default-theme.tokens.json`). This generates variables in the `:root`.
2. **Component Token:** Defined in the component's CSS (`.module.css`), it maps the global token to a component-specific token.
3. **Local Scope:** Inside the component, this token is mapped to a local variable `--local-`.

**Example of a Safe Override:**
Instead of trying to override the primary color globally or forcing a style with `!important`, you should override the `--local-` variable or the component's scoped variable in the instance where you are using it.

```css
/* Wrong: may affect the entire application or fail depending on specificity */
.my-button {
  background-color: red !important;
}

/* Right: Overrides only the local/component token for this instance */
.my-custom-button {
  --dd-button-bg: v('color.error'); /* If you want to use another system token */
  /* or */
  --dd-button-bg: #ff0000; /* If it's an ad-hoc value */
}
```

```vue
<template>
  <dd-button class="my-custom-button">Red Button</dd-button>
</template>
```

### Organizing your Token JSONs
If your design system grows significantly, you can point the `tokens` property in `nuxt.config.ts` to a **directory** instead of a single file.
The module will recursively read all `.json` files in the directory and automatically merge them, creating namespaces (e.g., a file at `tokens/components/button.json` will be accessible under the key `components.button`).
