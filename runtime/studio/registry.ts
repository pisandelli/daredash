import type { StudioTabDefinition } from './types'
import BasePreview from './previews/BasePreview.vue'
import TypographyPreview from './previews/TypographyPreview.vue'
import AccordionPreview from './previews/AccordionPreview.vue'
import ButtonPreview from './previews/ButtonPreview.vue'
import BadgePreview from './previews/BadgePreview.vue'
import AlertPreview from './previews/AlertPreview.vue'
import AnchorPreview from './previews/AnchorPreview.vue'
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
      componentField('accordion.accent-color', 'Accent Color', 'color', 'Core'),
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
      componentField('accordion.header.chevron-size', 'Chevron Size', 'text', 'Header'),
      componentField('accordion.header.gap', 'Header Gap', 'text', 'Header'),
      componentField('accordion.header.title-gap', 'Title Gap', 'text', 'Header'),
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
      componentField('button.base-color', 'Base Color', 'color', 'Core'),
      componentField('button.border-radius', 'Border Radius', 'text', 'Core'),
      componentField('button.font-family', 'Font Family', 'text', 'Core'),
      componentField('button.font-weight', 'Font Weight', 'text', 'Core', '700'),
      {
        path: 'button.text-transform',
        label: 'Text Transform',
        type: 'select',
        options: ['uppercase', 'none', 'capitalize', 'lowercase'],
        defaultValue: tokenValue('button.text-transform'),
        rawDefaultValue: rawTokenValue('button.text-transform'),
        referencePath: tokenReference('button.text-transform'),
        group: 'Core'
      },
      componentField('button.sizes.tiny.height', 'Height (tiny)', 'text', 'Sizes'),
      componentField('button.sizes.tiny.padding', 'Padding (tiny)', 'text', 'Sizes'),
      componentField('button.sizes.tiny.font-size', 'Font Size (tiny)', 'text', 'Sizes'),
      componentField('button.sizes.tiny.icon-size', 'Icon Size (tiny)', 'text', 'Sizes'),
      componentField('button.sizes.small.height', 'Height (small)', 'text', 'Sizes'),
      componentField('button.sizes.small.padding', 'Padding (small)', 'text', 'Sizes'),
      componentField('button.sizes.small.font-size', 'Font Size (small)', 'text', 'Sizes'),
      componentField('button.sizes.small.icon-size', 'Icon Size (small)', 'text', 'Sizes'),
      componentField('button.sizes.regular.height', 'Height (regular)', 'text', 'Sizes'),
      componentField('button.sizes.regular.padding', 'Padding (regular)', 'text', 'Sizes'),
      componentField('button.sizes.regular.font-size', 'Font Size (regular)', 'text', 'Sizes'),
      componentField('button.sizes.regular.icon-size', 'Icon Size (regular)', 'text', 'Sizes'),
      componentField('button.sizes.large.height', 'Height (large)', 'text', 'Sizes'),
      componentField('button.sizes.large.padding', 'Padding (large)', 'text', 'Sizes'),
      componentField('button.sizes.large.font-size', 'Font Size (large)', 'text', 'Sizes'),
      componentField('button.sizes.large.icon-size', 'Icon Size (large)', 'text', 'Sizes'),
      componentField('button.sizes.xlarge.height', 'Height (xlarge)', 'text', 'Sizes'),
      componentField('button.sizes.xlarge.padding', 'Padding (xlarge)', 'text', 'Sizes'),
      componentField('button.sizes.xlarge.font-size', 'Font Size (xlarge)', 'text', 'Sizes'),
      componentField('button.sizes.xlarge.icon-size', 'Icon Size (xlarge)', 'text', 'Sizes'),
      componentField('button.primary.base-color', 'Primary Color', 'color', 'Semantic'),
      componentField('button.success.base-color', 'Success Color', 'color', 'Semantic'),
      componentField('button.warning.base-color', 'Warning Color', 'color', 'Semantic'),
      componentField('button.danger.base-color', 'Danger Color', 'color', 'Semantic', '#ef4444'),
      componentField('button.info.base-color', 'Info Color', 'color', 'Semantic')
    ]
  },
  {
    id: 'badge',
    label: 'Badge',
    navigationKind: 'component',
    tokenGroup: 'components',
    preview: BadgePreview,
    fields: [
      componentField('badge.base-color', 'Base Color', 'color', 'Core'),
      componentField('badge.border-radius', 'Border Radius', 'text', 'Core'),
      componentField('badge.font-size', 'Font Size', 'text', 'Typography'),
      componentField('badge.font-weight', 'Font Weight', 'text', 'Typography'),
      componentField('badge.letter-spacing', 'Letter Spacing', 'text', 'Typography'),
      {
        path: 'badge.text-transform',
        label: 'Text Transform',
        type: 'select',
        options: ['none', 'uppercase', 'capitalize', 'lowercase'],
        defaultValue: tokenValue('badge.text-transform'),
        rawDefaultValue: rawTokenValue('badge.text-transform'),
        referencePath: tokenReference('badge.text-transform'),
        group: 'Typography'
      },
      componentField('badge.icon-size', 'Icon Size', 'text', 'Typography'),
      componentField('badge.gap', 'Gap', 'text', 'Spacing'),
      componentField('badge.padding.inline', 'Padding Inline', 'text', 'Spacing'),
      componentField('badge.padding.block', 'Padding Block', 'text', 'Spacing'),
      componentField('badge.primary.base-color', 'Primary Color', 'color', 'Semantic', '#0984e3'),
      componentField('badge.success.base-color', 'Success Color', 'color', 'Semantic'),
      componentField('badge.warning.base-color', 'Warning Color', 'color', 'Semantic'),
      componentField('badge.danger.base-color', 'Danger Color', 'color', 'Semantic', '#ef4444'),
      componentField('badge.info.base-color', 'Info Color', 'color', 'Semantic')
    ]
  },
  {
    id: 'alert',
    label: 'Alert',
    navigationKind: 'component',
    tokenGroup: 'components',
    preview: AlertPreview,
    fields: [
      componentField('alert.base-color', 'Base Color', 'color', 'Core'),
      componentField('alert.border-radius', 'Border Radius', 'text', 'Core'),
      componentField('alert.padding', 'Padding', 'text', 'Core'),
      componentField('alert.gap', 'Gap', 'text', 'Core'),
      componentField('alert.font-family', 'Font Family', 'text', 'Typography'),
      componentField('alert.font-size', 'Font Size', 'text', 'Typography'),
      componentField('alert.line-height', 'Line Height', 'text', 'Typography'),
      componentField('alert.icon-size', 'Icon Size', 'text', 'Typography'),
      componentField('alert.title.font-weight', 'Title Weight', 'text', 'Title'),
      componentField('alert.title.font-size', 'Title Size', 'text', 'Title'),
      componentField('alert.close.size', 'Close Size', 'text', 'Close'),
      componentField('alert.close.opacity', 'Close Opacity', 'text', 'Close'),
      componentField('alert.close.hover-opacity', 'Close Hover Opacity', 'text', 'Close'),
      componentField('alert.primary.base-color', 'Primary Color', 'color', 'Semantic'),
      componentField('alert.success.base-color', 'Success Color', 'color', 'Semantic'),
      componentField('alert.warning.base-color', 'Warning Color', 'color', 'Semantic'),
      componentField('alert.danger.base-color', 'Danger Color', 'color', 'Semantic', '#ef4444'),
      componentField('alert.error.base-color', 'Error Color', 'color', 'Semantic', '#ef4444'),
      componentField('alert.info.base-color', 'Info Color', 'color', 'Semantic')    ]
  },
  {
    id: 'anchor',
    label: 'Anchor',
    navigationKind: 'component',
    tokenGroup: 'components',
    preview: AnchorPreview,
    fields: [
      componentField('anchor.active-font-weight', 'Active Font Weight', 'text', 'Typography'),
      componentField('anchor.font-family', 'Font Family', 'text', 'Typography'),
      componentField('anchor.font-size', 'Font Size', 'text', 'Typography'),
      componentField('anchor.active-color', 'Active Color', 'color', 'Core'),
      componentField('anchor.border-color', 'Border Color', 'color', 'Core'),
      componentField('anchor.indicator-color', 'Indicator Color', 'color', 'Core'),
      componentField('anchor.indicator-width', 'Indicator Width', 'text', 'Core'),
      componentField('anchor.link-color', 'Link Color', 'color', 'Core'),
      componentField('anchor.link-color-hover', 'Link Hover Color', 'color', 'Core'),
      componentField('anchor.indicator-color-hover', 'Indicator Hover', 'color', 'Core'),
      componentField('anchor.item-bg-hover', 'Hover Background', 'color', 'Core'),
      componentField('anchor.item-radius', 'Item Radius', 'text', 'Core'),
      componentField('anchor.padding-inline', 'Padding Inline', 'text', 'Spacing'),
      componentField('anchor.padding-block', 'Padding Block', 'text', 'Spacing')
    ]
  }
]
