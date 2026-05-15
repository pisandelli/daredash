# Features, Tokens, and Theming

This guide is for developers who want to understand how DareDash handles tokens, styling, themes, and safe visual customization. Read it after installation if you plan to change the look and feel of the library instead of only consuming the default system.

Next step after this guide: [Architecture](./architecture.md)

## 1. What DareDash is optimizing for

DareDash is designed around a few core ideas:

- consistency through tokens instead of scattered visual values
- semantic styling through attrs instead of ad hoc variant APIs
- safe component-level customization through token layering
- a Studio workflow for theme exploration and export

## 2. Design tokens

The design-token system is the foundation of the visual layer.

Tokens define things like:

- colors
- spacing
- typography
- sizing
- component-level visual mappings
- theme-specific overrides

At build time, these tokens are transformed into CSS custom properties. At runtime, components consume them through CSS Modules.

## 3. Token types

### Standard tokens

Standard tokens are simple token values or references.

```json
{
  "color": {
    "text": {
      "$value": "{color.primary}"
    }
  }
}
```

### Typed tokens

Typed tokens are defined with explicit CSS metadata and are intended to work with `CSS.registerProperty`.

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

Typed tokens help the browser understand the expected kind of value and can improve transitions and runtime validation of custom properties.

## 4. Using tokens in module CSS

When authoring CSS inside the DareDash library, use the `v()` helper.

```css
.my-component {
  color: v('color.text.default');
  background-color: v('color.primary');
}
```

This is preferred over manually writing generated variable names when your goal is to reference a token.

The `v()` function is processed at build time by DareDash’s PostCSS pipeline.

## 5. Token layering

The safest styling model inside DareDash is:

1. global token
2. component token
3. local `--local-*` variable usage

This keeps the system:

- easier to theme
- easier to debug
- safer to override
- less likely to leak styles across components

In practice, components should avoid hardcoding visual values when a component token should own that control.

## 6. Component customization strategy

When you want to customize a component, prefer this order:

1. use the exposed semantic attrs
2. use existing component tokens
3. use local CSS variable overrides
4. only then reach for one-off ad hoc values

Example:

```css
.my-button {
  --dd-button-base-color: #0f766e;
}
```

```vue
<template>
  <dd-button class="my-button">Save</dd-button>
</template>
```

The exact public variable names and token mappings depend on the component, so use the component CSS and token files as the source of truth when customizing deeply.

## 7. Semantic attrs and visual states

DareDash relies heavily on semantic attrs that become `data-*` states in the rendered output.

Common examples include:

- `primary`
- `success`
- `warning`
- `danger`
- `info`
- `ghost`
- `outline`
- `small`
- `large`

These attrs matter because they are part of the styling contract. Human documentation should treat them as real supported capabilities only when they are actually implemented in the component code and CSS.

## 8. Themes

The current architecture supports:

- a default token layer
- named themes such as `light` and `dark`
- runtime selectors such as `[data-theme="..."]`

Today, the strongest supported workflow for theme iteration is still tied to Studio and token preview/export, even though the theme infrastructure exists at runtime.

## 9. Studio

Studio is where DareDash becomes more than a static component library.

It helps teams:

- inspect components in one place
- preview token changes
- experiment with semantic scales and component tokens
- export token overrides as JSON

This is especially useful when the goal is to evolve a product system instead of only consuming the default theme.

## 10. Organizing token files

The `tokens` option can point to:

- a single token file
- or a directory of token files

When a directory is used, DareDash reads `.json` files recursively and merges them into the final token graph.

This is the preferred model once the design system grows beyond a single file.

## 11. Practical guidance

- Use semantic attrs before arbitrary color overrides.
- Add component tokens when a visual control should be reusable and themeable.
- Use local CSS variable overrides for narrow, instance-level customization.
- Avoid `!important` when token layering or attrs can solve the problem cleanly.
- Treat Studio as part of the design-system workflow, not as an unrelated demo surface.

## 12. Contrast with `contrast-color()`

MDN currently marks `contrast-color()` as Baseline 2026 and widely available in current engines since April 2026, which makes it a practical default in modern-only DareDash environments.

For filled surfaces such as buttons, `contrast-color()` is a good fit because it can derive a readable foreground from the effective background color at runtime, including instance-level overrides such as:

```vue
<DdButton color="#facc15">Custom</DdButton>
```

In DareDash, the recommended pattern is to expose the foreground as a tokenized CSS expression instead of hardcoding the contrast decision inside component CSS.

Example defaults:

```json
{
  "button": {
    "color": {
      "$value": "contrast-color({button.base-color})"
    },
    "success": {
      "color": {
        "$value": "contrast-color({button.success.base-color})"
      }
    }
  },
  "input-search": {
    "button": {
      "color": {
        "$value": "contrast-color({input-search.button.background-color})"
      },
      "success": {
        "color": {
          "$value": "contrast-color({input-search.button.success.background-color})"
        }
      }
    }
  }
}
```

This keeps the public token API expressed in standard token references rather than component-private `--local-*` variables, while still allowing the component CSS to use local fallbacks where instance-level overrides are needed.

Use the generic token when the foreground must track the component's real local background, including per-instance overrides. Use semantic variant tokens when you want granular control over a specific style such as `success`, `danger`, or `neutral`.

For `Button`, there is also an instance-level escape hatch:

```vue
<DdButton color="#facc15" text-color="#111827">Custom</DdButton>
```

Use `textColor` when the theme-level foreground logic is correct in general but a specific button needs an explicit foreground override.

These tokens are text/CSS expression tokens, so they can accept values such as:

- `contrast-color(...)`
- `#fff`
- `var(...)`
- `color-mix(...)`

That said, `contrast-color()` still fits best in some places more than others:

- solid surfaces owned by the component are strong candidates
- transparent, tinted, or gradient-driven surfaces often still need explicit design choices instead of black-or-white auto contrast
- interaction tokens that derive from foreground intent, such as close-hover layers or icon accents, may still deserve separate tokens

In practice, this means the safest pattern is:

1. keep the background token or local variable as the source of truth
2. default the foreground token to `contrast-color()` over the component's real local background variable
3. add semantic foreground tokens when consumers need brand-over-default behavior only for specific variants

This pattern is a strong match for `Button`, `InputSearch`, `InputGroup` addons, `Progress` tooltips, and `Toast` solid variants. Even in `Toast`, related pieces such as icons or close-action colors can still stay on dedicated tokens while referencing the main foreground token when that is the right default.
