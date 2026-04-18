import type { StudioTabDefinition } from './types'
import BasePreview from './previews/BasePreview.vue'
import TypographyPreview from './previews/TypographyPreview.vue'
import AccordionPreview from './previews/AccordionPreview.vue'
import ButtonPreview from './previews/ButtonPreview.vue'
import BadgePreview from './previews/BadgePreview.vue'
import AlertPreview from './previews/AlertPreview.vue'
import {
  primitiveStudioFields,
  rawTokenValue,
  tokenReference,
  tokenValue,
  typographyStudioFields
} from './tokens'
import type { StudioFieldDefinition } from './types'

function componentField(
  path: string,
  label: string,
  type: StudioFieldDefinition['type'],
  group: string,
  fallback?: string
): StudioFieldDefinition {
  return {
    path,
    label,
    type,
    defaultValue: tokenValue(path, fallback),
    rawDefaultValue: rawTokenValue(path),
    referencePath: tokenReference(path),
    group
  }
}

export const STUDIO_TABS: StudioTabDefinition[] = [
  {
    id: 'base',
    label: 'Base',
    navigationKind: 'foundation',
    tokenGroup: 'primitives',
    preview: BasePreview,
    fields: primitiveStudioFields()
  },
  {
    id: 'typography',
    label: 'Typography',
    navigationKind: 'foundation',
    tokenGroup: 'primitives',
    preview: TypographyPreview,
    fields: typographyStudioFields()
  },
  {
    id: 'accordion',
    label: 'Accordion',
    navigationKind: 'component',
    tokenGroup: 'components',
    preview: AccordionPreview,
    fields: [
      componentField('accordion.border-width', 'Border Width', 'text', 'Core'),
      componentField('accordion.border-color', 'Border Color', 'color', 'Core'),
      componentField('accordion.border-radius', 'Border Radius', 'text', 'Core'),
      componentField('accordion.header.background-color', 'Header Background', 'color', 'Header'),
      componentField('accordion.header.background-color-hover', 'Header Hover Background', 'color', 'Header'),
      componentField('accordion.header.padding', 'Header Padding', 'text', 'Header'),
      componentField('accordion.header.font-family', 'Header Font Family', 'text', 'Header'),
      componentField('accordion.header.font-size', 'Header Font Size', 'text', 'Header'),
      componentField('accordion.header.font-weight', 'Header Font Weight', 'text', 'Header'),
      componentField('accordion.header.icon-size', 'Header Icon Size', 'text', 'Header'),
      componentField('accordion.content.padding', 'Content Padding', 'text', 'Content'),
      componentField('accordion.content.background-color', 'Content Background', 'color', 'Content'),
      componentField('accordion.content.font-family', 'Content Font Family', 'text', 'Content')
    ]
  },
  {
    id: 'button',
    label: 'Button',
    navigationKind: 'component',
    tokenGroup: 'components',
    preview: ButtonPreview,
    fields: [
      {
        path: 'button.base-color',
        label: 'Base Color',
        type: 'color',
        defaultValue: tokenValue('button.base-color'),
        group: 'Core'
      },
      {
        path: 'button.border-radius',
        label: 'Border Radius',
        type: 'text',
        defaultValue: tokenValue('button.border-radius'),
        group: 'Core'
      },
      {
        path: 'button.font-family',
        label: 'Font Family',
        type: 'text',
        defaultValue: tokenValue('button.font-family'),
        group: 'Core'
      },
      {
        path: 'button.font-weight',
        label: 'Font Weight',
        type: 'text',
        defaultValue: tokenValue('button.font-weight', '700'),
        group: 'Core'
      },
      {
        path: 'button.text-transform',
        label: 'Text Transform',
        type: 'select',
        options: ['uppercase', 'none', 'capitalize', 'lowercase'],
        defaultValue: tokenValue('button.text-transform'),
        group: 'Core'
      },
      {
        path: 'button.sizes.tiny.height',
        label: 'Height (tiny)',
        type: 'text',
        defaultValue: tokenValue('button.sizes.tiny.height'),
        group: 'Sizes'
      },
      {
        path: 'button.sizes.tiny.padding',
        label: 'Padding (tiny)',
        type: 'text',
        defaultValue: tokenValue('button.sizes.tiny.padding'),
        group: 'Sizes'
      },
      {
        path: 'button.sizes.small.height',
        label: 'Height (small)',
        type: 'text',
        defaultValue: tokenValue('button.sizes.small.height'),
        group: 'Sizes'
      },
      {
        path: 'button.sizes.small.padding',
        label: 'Padding (small)',
        type: 'text',
        defaultValue: tokenValue('button.sizes.small.padding'),
        group: 'Sizes'
      },
      {
        path: 'button.sizes.regular.height',
        label: 'Height (regular)',
        type: 'text',
        defaultValue: tokenValue('button.sizes.regular.height'),
        group: 'Sizes'
      },
      {
        path: 'button.sizes.regular.padding',
        label: 'Padding (regular)',
        type: 'text',
        defaultValue: tokenValue('button.sizes.regular.padding'),
        group: 'Sizes'
      },
      {
        path: 'button.sizes.large.height',
        label: 'Height (large)',
        type: 'text',
        defaultValue: tokenValue('button.sizes.large.height'),
        group: 'Sizes'
      },
      {
        path: 'button.sizes.large.padding',
        label: 'Padding (large)',
        type: 'text',
        defaultValue: tokenValue('button.sizes.large.padding'),
        group: 'Sizes'
      },
      {
        path: 'button.primary.base-color',
        label: 'Primary Color',
        type: 'color',
        defaultValue: tokenValue('button.primary.base-color'),
        group: 'Semantic'
      },
      {
        path: 'button.success.base-color',
        label: 'Success Color',
        type: 'color',
        defaultValue: tokenValue('button.success.base-color'),
        group: 'Semantic'
      },
      {
        path: 'button.warning.base-color',
        label: 'Warning Color',
        type: 'color',
        defaultValue: tokenValue('button.warning.base-color'),
        group: 'Semantic'
      },
      {
        path: 'button.danger.base-color',
        label: 'Danger Color',
        type: 'color',
        defaultValue: tokenValue('button.danger.base-color', '#ef4444'),
        group: 'Semantic'
      },
      {
        path: 'button.info.base-color',
        label: 'Info Color',
        type: 'color',
        defaultValue: tokenValue('button.info.base-color'),
        group: 'Semantic'
      }
    ]
  },
  {
    id: 'badge',
    label: 'Badge',
    navigationKind: 'component',
    tokenGroup: 'components',
    preview: BadgePreview,
    fields: [
      {
        path: 'badge.base-color',
        label: 'Base Color',
        type: 'color',
        defaultValue: tokenValue('badge.base-color'),
        group: 'Core'
      },
      {
        path: 'badge.border-radius',
        label: 'Border Radius',
        type: 'text',
        defaultValue: tokenValue('badge.border-radius'),
        group: 'Core'
      },
      {
        path: 'badge.font-size',
        label: 'Font Size',
        type: 'text',
        defaultValue: tokenValue('badge.font-size'),
        group: 'Typography'
      },
      {
        path: 'badge.font-weight',
        label: 'Font Weight',
        type: 'text',
        defaultValue: tokenValue('badge.font-weight'),
        group: 'Typography'
      },
      {
        path: 'badge.letter-spacing',
        label: 'Letter Spacing',
        type: 'text',
        defaultValue: tokenValue('badge.letter-spacing'),
        group: 'Typography'
      },
      {
        path: 'badge.text-transform',
        label: 'Text Transform',
        type: 'select',
        options: ['none', 'uppercase', 'capitalize', 'lowercase'],
        defaultValue: tokenValue('badge.text-transform'),
        group: 'Typography'
      },
      {
        path: 'badge.icon-size',
        label: 'Icon Size',
        type: 'text',
        defaultValue: tokenValue('badge.icon-size'),
        group: 'Typography'
      },
      {
        path: 'badge.padding.inline',
        label: 'Padding Inline',
        type: 'text',
        defaultValue: tokenValue('badge.padding.inline'),
        group: 'Spacing'
      },
      {
        path: 'badge.padding.block',
        label: 'Padding Block',
        type: 'text',
        defaultValue: tokenValue('badge.padding.block'),
        group: 'Spacing'
      },
      {
        path: 'badge.primary.base-color',
        label: 'Primary Color',
        type: 'color',
        defaultValue: tokenValue('badge.primary.base-color', '#0984e3'),
        group: 'Semantic'
      },
      {
        path: 'badge.success.base-color',
        label: 'Success Color',
        type: 'color',
        defaultValue: tokenValue('badge.success.base-color'),
        group: 'Semantic'
      },
      {
        path: 'badge.warning.base-color',
        label: 'Warning Color',
        type: 'color',
        defaultValue: tokenValue('badge.warning.base-color'),
        group: 'Semantic'
      },
      {
        path: 'badge.danger.base-color',
        label: 'Danger Color',
        type: 'color',
        defaultValue: tokenValue('badge.danger.base-color', '#ef4444'),
        group: 'Semantic'
      },
      {
        path: 'badge.info.base-color',
        label: 'Info Color',
        type: 'color',
        defaultValue: tokenValue('badge.info.base-color'),
        group: 'Semantic'
      }
    ]
  },
  {
    id: 'alert',
    label: 'Alert',
    navigationKind: 'component',
    tokenGroup: 'components',
    preview: AlertPreview,
    fields: [
      {
        path: 'alert.base-color',
        label: 'Base Color',
        type: 'color',
        defaultValue: tokenValue('alert.base-color'),
        group: 'Core'
      },
      {
        path: 'alert.border-radius',
        label: 'Border Radius',
        type: 'text',
        defaultValue: tokenValue('alert.border-radius'),
        group: 'Core'
      },
      {
        path: 'alert.padding',
        label: 'Padding',
        type: 'text',
        defaultValue: tokenValue('alert.padding'),
        group: 'Core'
      },
      {
        path: 'alert.gap',
        label: 'Gap',
        type: 'text',
        defaultValue: tokenValue('alert.gap'),
        group: 'Core'
      },
      {
        path: 'alert.font-family',
        label: 'Font Family',
        type: 'text',
        defaultValue: tokenValue('alert.font-family'),
        group: 'Typography'
      },
      {
        path: 'alert.font-size',
        label: 'Font Size',
        type: 'text',
        defaultValue: tokenValue('alert.font-size'),
        group: 'Typography'
      },
      {
        path: 'alert.line-height',
        label: 'Line Height',
        type: 'text',
        defaultValue: tokenValue('alert.line-height'),
        group: 'Typography'
      },
      {
        path: 'alert.icon-size',
        label: 'Icon Size',
        type: 'text',
        defaultValue: tokenValue('alert.icon-size'),
        group: 'Typography'
      },
      {
        path: 'alert.title.font-weight',
        label: 'Title Weight',
        type: 'text',
        defaultValue: tokenValue('alert.title.font-weight'),
        group: 'Title'
      },
      {
        path: 'alert.title.font-size',
        label: 'Title Size',
        type: 'text',
        defaultValue: tokenValue('alert.title.font-size'),
        group: 'Title'
      },
      {
        path: 'alert.close.size',
        label: 'Close Size',
        type: 'text',
        defaultValue: tokenValue('alert.close.size'),
        group: 'Close'
      },
      {
        path: 'alert.close.opacity',
        label: 'Close Opacity',
        type: 'text',
        defaultValue: tokenValue('alert.close.opacity'),
        group: 'Close'
      },
      {
        path: 'alert.close.hover-opacity',
        label: 'Close Hover Opacity',
        type: 'text',
        defaultValue: tokenValue('alert.close.hover-opacity'),
        group: 'Close'
      },
      {
        path: 'alert.primary.base-color',
        label: 'Primary Color',
        type: 'color',
        defaultValue: tokenValue('alert.primary.base-color'),
        group: 'Semantic'
      },
      {
        path: 'alert.success.base-color',
        label: 'Success Color',
        type: 'color',
        defaultValue: tokenValue('alert.success.base-color'),
        group: 'Semantic'
      },
      {
        path: 'alert.warning.base-color',
        label: 'Warning Color',
        type: 'color',
        defaultValue: tokenValue('alert.warning.base-color'),
        group: 'Semantic'
      },
      {
        path: 'alert.danger.base-color',
        label: 'Danger Color',
        type: 'color',
        defaultValue: tokenValue('alert.danger.base-color', '#ef4444'),
        group: 'Semantic'
      },
      {
        path: 'alert.error.base-color',
        label: 'Error Color',
        type: 'color',
        defaultValue: tokenValue('alert.error.base-color', '#ef4444'),
        group: 'Semantic'
      },
      {
        path: 'alert.info.base-color',
        label: 'Info Color',
        type: 'color',
        defaultValue: tokenValue('alert.info.base-color'),
        group: 'Semantic'
      }
    ]
  }
]
